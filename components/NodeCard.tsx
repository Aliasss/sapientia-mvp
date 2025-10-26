'use client';

import { VALUE_DESCRIPTIONS } from '@/lib/prompts';
import type { Node, ValueId } from '@/lib/schemas';
import WhyThisTooltip from './WhyThisTooltip';

interface NodeCardProps {
  node: Node;
  score?: number;
  reason: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function NodeCard({ node, reason, isSelected, onClick }: NodeCardProps) {
  const topValues = Object.entries(node.valueVector)
    .sort(([, a], [, b]) => (b || 0) - (a || 0))
    .slice(0, 3);

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 text-left animation-smooth ${
        isSelected
          ? 'border-accent bg-accent/10'
          : 'border-border bg-surface hover:border-accent/50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold flex-1">{node.title}</h3>
        <WhyThisTooltip reason={reason} />
      </div>

      <p className="text-sm text-subtle mb-3 line-clamp-2">{node.summary}</p>

      <div className="flex gap-2 flex-wrap">
        {topValues.map(([valueId, weight]) => {
          const value = VALUE_DESCRIPTIONS[valueId as ValueId];
          const opacity = Math.max(0.3, weight || 0);

          return (
            <span
              key={valueId}
              className="px-2 py-1 rounded-lg text-xs border"
              style={{
                borderColor: `rgba(127, 90, 240, ${opacity})`,
                backgroundColor: `rgba(127, 90, 240, ${opacity * 0.2})`,
              }}
            >
              {value.title}
            </span>
          );
        })}
      </div>
    </button>
  );
}

