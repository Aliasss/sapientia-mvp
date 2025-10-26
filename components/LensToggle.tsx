'use client';

import { VALUE_DESCRIPTIONS } from '@/lib/prompts';
import type { ValueId } from '@/lib/schemas';

interface LensToggleProps {
  topValues: ValueId[];
  selectedLens: ValueId[];
  onToggle: (valueId: ValueId) => void;
}

export default function LensToggle({ topValues, selectedLens, onToggle }: LensToggleProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {topValues.map(valueId => {
        const value = VALUE_DESCRIPTIONS[valueId];
        const isSelected = selectedLens.includes(valueId);

        return (
          <button
            key={valueId}
            onClick={() => onToggle(valueId)}
            className={`px-4 py-2 rounded-2xl font-semibold animation-smooth ${
              isSelected
                ? 'bg-accent text-white'
                : 'bg-surface text-text border border-border hover:border-accent/50'
            }`}
          >
            {value.title}
          </button>
        );
      })}
    </div>
  );
}

