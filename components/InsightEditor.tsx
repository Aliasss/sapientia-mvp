'use client';

import { useState } from 'react';
import type { Node, ValueId } from '@/lib/schemas';
import { Sparkles, Edit3 } from 'lucide-react';

interface InsightEditorProps {
  node: Node | null;
  selectedLens: ValueId[];
  onSave: (myRewrite: string) => void;
}

export default function InsightEditor({ node, selectedLens, onSave }: InsightEditorProps) {
  const [myRewrite, setMyRewrite] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!node) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'rewrite',
          payload: {
            info: node.summary,
            value_lens: selectedLens,
          },
        }),
      });

      const data = await res.json();
      if (data.ok && data.data?.choices?.[0]?.message?.content) {
        setMyRewrite(data.data.choices[0].message.content);
      } else if (data.fallback) {
        setMyRewrite(data.fallback);
      }
    } catch (error) {
      console.error('Generate error:', error);
      // Fallback for demo
      setMyRewrite(`"${node.title}"를 내 언어로 재해석하면: ${node.summary.slice(0, 100)}...`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (myRewrite.trim()) {
      onSave(myRewrite);
    }
  };

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-subtle">
        <p>노드를 선택하여 재해석을 시작하세요</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{node.title}</h2>
        <p className="text-sm text-subtle">원문 정보</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <p className="text-sm leading-relaxed">{node.summary}</p>
        </div>

        <div className="flex flex-col">
          <textarea
            value={myRewrite}
            onChange={e => setMyRewrite(e.target.value)}
            placeholder="내 언어로 재해석한 내용을 작성하세요..."
            className="flex-1 p-4 rounded-2xl bg-surface border border-border focus:border-accent outline-none resize-none animation-smooth"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || selectedLens.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-info text-white hover:bg-info/90 disabled:bg-surface disabled:text-subtle disabled:cursor-not-allowed animation-smooth"
        >
          <Sparkles size={16} />
          {isGenerating ? '생성 중...' : 'LLM로 재해석 제안'}
        </button>

        <button
          onClick={handleSave}
          disabled={!myRewrite.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent text-white hover:bg-accent/90 disabled:bg-surface disabled:text-subtle disabled:cursor-not-allowed animation-smooth"
        >
          <Edit3 size={16} />
          저장
        </button>
      </div>
    </div>
  );
}

