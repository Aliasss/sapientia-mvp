'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

interface WhyThisTooltipProps {
  reason: string;
}

export default function WhyThisTooltip({ reason }: WhyThisTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-info hover:text-info/80 animation-smooth"
        aria-label="추천 이유"
      >
        <Info size={16} />
      </button>

      {isVisible && (
        <div className="absolute left-0 top-6 z-10 w-64 p-3 rounded-lg bg-surface border border-border shadow-soft text-sm animation-smooth">
          {reason}
        </div>
      )}
    </div>
  );
}

