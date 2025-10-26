'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Node, Insight, UserValueProfile, ValueId } from '@/lib/schemas';
import {
  getClientIdFromLocal,
  getUserProfile,
  saveNode,
  saveInsight,
  logEvent,
  startDwellTracking,
  getDwellTime,
} from '@/lib/storage';
import { scoreAndRecommendNodes, getRecommendationReason } from '@/lib/scoring';
import { SAMPLE_NODES } from '@/lib/sampleData';
import { generateUUID } from '@/lib/uuid';

import LensToggle from '@/components/LensToggle';
import NodeCard from '@/components/NodeCard';
import InsightEditor from '@/components/InsightEditor';
import ActionList from '@/components/ActionList';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserValueProfile | null>(null);
  const [selectedLens, setSelectedLens] = useState<ValueId[]>([]);
  const [recommendedNodes, setRecommendedNodes] = useState<
    Array<{ node: Node; score: number }>
  >([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const clientId = getClientIdFromLocal();
      if (!clientId) {
        router.push('/onboarding');
        return;
      }

      const userProfile = await getUserProfile(clientId);
      if (!userProfile) {
        router.push('/onboarding');
        return;
      }

      setProfile(userProfile);
      const topValueIds = userProfile.topValues.map(v => v.valueId);
      setSelectedLens(topValueIds);

      // Save sample nodes to IndexedDB
      await Promise.all(SAMPLE_NODES.map(node => saveNode(node)));

      // Recommend nodes
      const recommended = scoreAndRecommendNodes(userProfile, SAMPLE_NODES, 5);
      setRecommendedNodes(recommended);

      startDwellTracking();
      setIsLoading(false);
    }

    initialize();
  }, [router]);

  const handleLensToggle = async (valueId: ValueId) => {
    if (!profile) return;

    const newLens = selectedLens.includes(valueId)
      ? selectedLens.filter(v => v !== valueId)
      : [...selectedLens, valueId];

    setSelectedLens(newLens);

    await logEvent(profile.clientId, 'session_value_context', {
      selected_lens: newLens,
    });

    // Re-score nodes with new lens
    const tempProfile = {
      ...profile,
      topValues: newLens.map(vid => ({
        valueId: vid,
        weight: 1 / newLens.length,
      })),
    };
    const recommended = scoreAndRecommendNodes(tempProfile, SAMPLE_NODES, 5);
    setRecommendedNodes(recommended);
  };

  const handleNodeSelect = async (node: Node) => {
    if (!profile) return;

    setSelectedNode(node);
    setCurrentInsight(null);
    setCompletedActions(new Set());

    const dwellMs = getDwellTime();
    await logEvent(profile.clientId, 'view', { dwell_ms: dwellMs }, node.id);
    startDwellTracking();
  };

  const handleInsightSave = async (myRewrite: string) => {
    if (!profile || !selectedNode) return;

    // Generate actions
    const actionsResponse = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'actions',
        payload: {
          my_rewrite: myRewrite,
          value_lens: selectedLens,
        },
      }),
    });

    const actionsData = await actionsResponse.json();
    let actions: string[] = [];

    if (actionsData.ok && actionsData.data?.choices?.[0]?.message?.content) {
      const content = actionsData.data.choices[0].message.content;
      actions = content.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 3);
    } else if (actionsData.fallback) {
      actions = actionsData.fallback.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 3);
    }

    const insight: Insight = {
      id: generateUUID(),
      nodeId: selectedNode.id,
      myRewrite,
      actions,
      lensUsed: selectedLens,
      createdAt: new Date().toISOString(),
    };

    await saveInsight(insight);
    await logEvent(profile.clientId, 'rewrite', {}, selectedNode.id);

    setCurrentInsight(insight);
  };

  const handleActionToggle = async (index: number) => {
    if (!profile || !currentInsight) return;

    const newCompleted = new Set(completedActions);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
      await logEvent(profile.clientId, 'action_done', { action_index: index }, currentInsight.nodeId);
    }
    setCompletedActions(newCompleted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-subtle">로딩 중...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">SAPIENTIA</h1>
          <a
            href="/graph"
            className="text-sm text-info hover:text-info/80 animation-smooth"
          >
            그래프 보기
          </a>
        </div>

        <LensToggle
          topValues={profile.topValues.map(v => v.valueId)}
          selectedLens={selectedLens}
          onToggle={handleLensToggle}
        />
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Node List */}
        <div className="col-span-3 space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto">
          {recommendedNodes.map(({ node, score }) => (
            <NodeCard
              key={node.id}
              node={node}
              score={score}
              reason={getRecommendationReason(score)}
              isSelected={selectedNode?.id === node.id}
              onClick={() => handleNodeSelect(node)}
            />
          ))}
        </div>

        {/* Insight Editor */}
        <div className="col-span-5 p-6 rounded-2xl bg-surface border border-border min-h-[500px]">
          <InsightEditor
            node={selectedNode}
            selectedLens={selectedLens}
            onSave={handleInsightSave}
          />
        </div>

        {/* Action List */}
        <div className="col-span-4 p-6 rounded-2xl bg-surface border border-border min-h-[500px]">
          <ActionList
            insight={currentInsight}
            completedActions={completedActions}
            onToggle={handleActionToggle}
          />
        </div>
      </div>
    </div>
  );
}

