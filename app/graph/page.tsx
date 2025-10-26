'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Node, Insight, ValueId } from '@/lib/schemas';
import { getClientIdFromLocal, getAllNodes, getAllInsights } from '@/lib/storage';
import { VALUE_DESCRIPTIONS } from '@/lib/prompts';
import MiniGraph from '@/components/MiniGraph';
import { ArrowLeft } from 'lucide-react';

export default function GraphPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<ValueId | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const clientId = getClientIdFromLocal();
      if (!clientId) {
        router.push('/onboarding');
        return;
      }

      const allNodes = await getAllNodes();
      const allInsights = await getAllInsights();

      setNodes(allNodes);
      setInsights(allInsights);
      setIsLoading(false);
    }

    loadData();
  }, [router]);

  const filteredNodes =
    selectedFilter === 'all'
      ? nodes
      : nodes.filter(node => node.valueVector[selectedFilter] && node.valueVector[selectedFilter]! > 0.5);

  const completedActionsCount = insights.reduce(
    (acc, insight) => acc + insight.actions.length,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-subtle">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-info hover:text-info/80 mb-4 animation-smooth"
        >
          <ArrowLeft size={20} />
          메인으로 돌아가기
        </button>

        <h1 className="text-3xl font-bold mb-2">지식 그래프</h1>
        <p className="text-subtle">가치별로 노드를 탐색하고 연결을 확인하세요</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-surface border border-border">
          <p className="text-sm text-subtle mb-1">총 노드</p>
          <p className="text-3xl font-bold">{nodes.length}</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border">
          <p className="text-sm text-subtle mb-1">재해석 완료</p>
          <p className="text-3xl font-bold">{insights.length}</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border">
          <p className="text-sm text-subtle mb-1">제안된 행동</p>
          <p className="text-3xl font-bold">{completedActionsCount}</p>
        </div>
      </div>

      {/* Value Filter */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-3">가치별 필터</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-2xl font-semibold animation-smooth ${
              selectedFilter === 'all'
                ? 'bg-accent text-white'
                : 'bg-surface text-text border border-border hover:border-accent/50'
            }`}
          >
            전체
          </button>

          {Object.entries(VALUE_DESCRIPTIONS).map(([valueId, value]) => (
            <button
              key={valueId}
              onClick={() => setSelectedFilter(valueId as ValueId)}
              className={`px-4 py-2 rounded-2xl font-semibold animation-smooth ${
                selectedFilter === valueId
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text border border-border hover:border-accent/50'
              }`}
            >
              {value.title}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="p-6 rounded-2xl bg-surface border border-border mb-6">
        <h2 className="text-xl font-bold mb-4">노드 네트워크</h2>
        <MiniGraph nodes={filteredNodes} maxNodes={10} />
      </div>

      {/* Node List */}
      <div>
        <h2 className="text-xl font-bold mb-4">노드 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNodes.map(node => (
            <div
              key={node.id}
              className="p-4 rounded-2xl bg-surface border border-border"
            >
              <h3 className="font-semibold mb-2">{node.title}</h3>
              <p className="text-sm text-subtle line-clamp-2">{node.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

