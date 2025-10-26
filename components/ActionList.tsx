'use client';

import { Check } from 'lucide-react';
import type { Insight } from '@/lib/schemas';

interface ActionListProps {
  insight: Insight | null;
  completedActions: Set<number>;
  onToggle: (index: number) => void;
}

export default function ActionList({ insight, completedActions, onToggle }: ActionListProps) {
  if (!insight) {
    return (
      <div className="h-full flex items-center justify-center text-subtle">
        <p>재해석을 저장하면 행동 제안이 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-1">72시간 내 실행 가능한 행동</h3>
        <p className="text-sm text-subtle">작은 행동부터 시작하세요</p>
      </div>

      <div className="space-y-3">
        {insight.actions.map((action, index) => {
          const isCompleted = completedActions.has(index);

          return (
            <button
              key={index}
              onClick={() => onToggle(index)}
              className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3 animation-smooth ${
                isCompleted
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border bg-surface hover:border-accent/50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center animation-smooth ${
                  isCompleted ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {isCompleted && <Check size={14} className="text-white" />}
              </div>

              <span
                className={`text-sm ${
                  isCompleted ? 'line-through text-subtle' : 'text-text'
                }`}
              >
                {action}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

