// IndexedDB adapter using localforage

import localforage from 'localforage';
import type { UserValueProfile, Node, Insight, EventLog } from './schemas';

// Initialize localforage
const store = localforage.createInstance({
  name: 'sapientia-mvp',
  storeName: 'data',
});

// User Value Profile
export async function saveUserProfile(profile: UserValueProfile): Promise<void> {
  await store.setItem(`svp:${profile.clientId}`, profile);
}

export async function getUserProfile(clientId: string): Promise<UserValueProfile | null> {
  return await store.getItem(`svp:${clientId}`);
}

// Node cache
export async function saveNode(node: Node): Promise<void> {
  await store.setItem(`node:${node.id}`, node);
}

export async function getNode(nodeId: string): Promise<Node | null> {
  return await store.getItem(`node:${nodeId}`);
}

export async function getAllNodes(): Promise<Node[]> {
  const keys = await store.keys();
  const nodeKeys = keys.filter(k => k.startsWith('node:'));
  const nodes = await Promise.all(nodeKeys.map(k => store.getItem<Node>(k)));
  return nodes.filter((n): n is Node => n !== null);
}

// Insight
export async function saveInsight(insight: Insight): Promise<void> {
  await store.setItem(`insight:${insight.id}`, insight);
}

export async function getInsight(insightId: string): Promise<Insight | null> {
  return await store.getItem(`insight:${insightId}`);
}

export async function getInsightsByNode(nodeId: string): Promise<Insight[]> {
  const keys = await store.keys();
  const insightKeys = keys.filter(k => k.startsWith('insight:'));
  const insights = await Promise.all(insightKeys.map(k => store.getItem<Insight>(k)));
  return insights.filter((i): i is Insight => i !== null && i.nodeId === nodeId);
}

export async function getAllInsights(): Promise<Insight[]> {
  const keys = await store.keys();
  const insightKeys = keys.filter(k => k.startsWith('insight:'));
  const insights = await Promise.all(insightKeys.map(k => store.getItem<Insight>(k)));
  return insights.filter((i): i is Insight => i !== null);
}

// Event logging
export async function logEvent(
  clientId: string,
  type: EventLog['type'],
  meta?: Record<string, unknown>,
  nodeId?: string
): Promise<void> {
  const event: EventLog = {
    ts: new Date().toISOString(),
    clientId,
    type,
    nodeId,
    meta,
  };
  const key = `elog:${event.ts}:${type}`;
  await store.setItem(key, event);
}

// Dwell time tracking helper
let dwellStart: number | null = null;

export function startDwellTracking(): void {
  dwellStart = Date.now();
}

export function getDwellTime(): number | undefined {
  if (dwellStart === null) return undefined;
  return Date.now() - dwellStart;
}

export function resetDwellTracking(): void {
  dwellStart = null;
}

// Get all event logs
export async function getAllEvents(): Promise<EventLog[]> {
  const keys = await store.keys();
  const eventKeys = keys.filter(k => k.startsWith('elog:'));
  const events = await Promise.all(eventKeys.map(k => store.getItem<EventLog>(k)));
  return events.filter((e): e is EventLog => e !== null);
}

// Local storage for auth
export function saveClientIdToLocal(clientId: string, nickname: string, pin: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sapientia_client_id', clientId);
    localStorage.setItem('sapientia_nickname', nickname);
    localStorage.setItem('sapientia_pin', pin);
  }
}

export function getClientIdFromLocal(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sapientia_client_id');
  }
  return null;
}

export function getNicknameFromLocal(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sapientia_nickname');
  }
  return null;
}

export function clearAuthFromLocal(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sapientia_client_id');
    localStorage.removeItem('sapientia_nickname');
    localStorage.removeItem('sapientia_pin');
  }
}

