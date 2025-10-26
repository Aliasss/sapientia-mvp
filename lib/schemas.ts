// Type definitions for SAPIENTIA MVP

export type ValueId = 'autonomy' | 'growth' | 'solidarity' | 'stability' | 'aesthetics' | 'integrity';

export type UserValueWeight = {
  valueId: ValueId;
  weight: number; // 0~1
};

export type UserValueProfile = {
  clientId: string;
  topValues: UserValueWeight[]; // length 3
  updatedAt: string;
};

export type Node = {
  id: string;
  title: string;
  summary: string;
  valueVector: Partial<Record<ValueId, number>>; // 0~1
  confidence?: number; // tagging confidence
};

export type Insight = {
  id: string;
  nodeId: string;
  myRewrite: string; // user's reinterpretation
  actions: string[]; // 3 actions
  lensUsed: ValueId[]; // applied lenses
  createdAt: string;
};

export type EventLog = {
  ts: string;
  clientId: string;
  nodeId?: string;
  type: 'view' | 'save' | 'skip' | 'rewrite' | 'action_done' | 'session_value_context';
  dwellMs?: number;
  meta?: Record<string, unknown>;
};

