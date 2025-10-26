// Personalization scoring functions

import type { UserValueProfile, Node, ValueId } from './schemas';

// Simple cosine similarity
function cosine(
  userValues: { valueId: ValueId; weight: number }[],
  nodeVector: Partial<Record<ValueId, number>>
): number {
  let dotProduct = 0;
  let userMag = 0;
  let nodeMag = 0;

  for (const uv of userValues) {
    const nodeVal = nodeVector[uv.valueId] || 0;
    dotProduct += uv.weight * nodeVal;
    userMag += uv.weight * uv.weight;
    nodeMag += nodeVal * nodeVal;
  }

  if (userMag === 0 || nodeMag === 0) return 0;
  return dotProduct / (Math.sqrt(userMag) * Math.sqrt(nodeMag));
}

// Score a single node for a user
export function scoreNode(user: UserValueProfile, node: Node): number {
  const cos = cosine(user.topValues, node.valueVector);
  const novelty = 0.2; // MVP constant
  const recency = 0.1; // MVP constant
  const difficulty = 0.2; // TODO: onboarding difficulty matching

  return 0.5 * cos + 0.2 * difficulty + 0.2 * novelty + 0.1 * recency;
}

// Score and sort nodes for recommendation
export function scoreAndRecommendNodes(
  user: UserValueProfile,
  nodes: Node[],
  limit: number = 5
): Array<{ node: Node; score: number }> {
  const scored = nodes.map(node => ({
    node,
    score: scoreNode(user, node),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

// Get recommendation reason text
export function getRecommendationReason(score: number): string {
  const novelty = score > 0.6 ? '높음' : '보통';
  return `가치 적합도 ${(score).toFixed(2)} · 신규성 ${novelty}`;
}

