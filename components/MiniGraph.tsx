'use client';

import type { Node } from '@/lib/schemas';

interface MiniGraphProps {
  nodes: Node[];
  maxNodes?: number;
}

export default function MiniGraph({ nodes, maxNodes = 10 }: MiniGraphProps) {
  const displayNodes = nodes.slice(0, maxNodes);
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 100;

  // Position nodes in a circle
  const positions = displayNodes.map((node, index) => {
    const angle = (index / displayNodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // Calculate max value for border width
    const maxValue = Math.max(...Object.values(node.valueVector).filter(v => v !== undefined) as number[]);
    const strokeWidth = 1 + maxValue * 3;

    return { node, x, y, strokeWidth };
  });

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Draw connections */}
      {positions.map((pos1, i) =>
        positions.slice(i + 1).map((pos2) => (
          <line
            key={`${i}-${pos2.node.id}`}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))
      )}

      {/* Draw nodes */}
      {positions.map((pos) => (
        <g key={pos.node.id}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={15}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth={pos.strokeWidth}
          />
          <title>{pos.node.title}</title>
        </g>
      ))}
    </svg>
  );
}

