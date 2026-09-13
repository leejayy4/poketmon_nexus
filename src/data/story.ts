import type { SaveData, MapId } from '../types';
import { createCatalog } from './catalog';

export type StoryCondition =
  | { readonly kind: 'flag'; readonly key: string }
  | { readonly kind: 'badge'; readonly id: string }
  | { readonly kind: 'all'; readonly conditions: readonly StoryCondition[] }
  | { readonly kind: 'any'; readonly conditions: readonly StoryCondition[] }
  | { readonly kind: 'not'; readonly condition: StoryCondition };

/** Read-only. Looking up an objective never grants a flag, reward, badge or Pokémon. */
export function meetsStoryCondition(save: Pick<SaveData, 'flags' | 'badges'>, condition: StoryCondition): boolean {
  switch (condition.kind) {
    case 'flag': return Boolean(save.flags[condition.key]); // Preserve existing legacy flag truthiness.
    case 'badge': return save.badges.includes(condition.id);
    case 'all': return condition.conditions.every(row => meetsStoryCondition(save, row));
    case 'any': return condition.conditions.some(row => meetsStoryCondition(save, row));
    case 'not': return !meetsStoryCondition(save, condition.condition);
  }
}
export interface StoryObjectiveDefinition {
  readonly id: string;
  readonly title: string;
  readonly map: MapId;
  readonly event: string;
  readonly action: string;
  readonly complete: StoryCondition;
}
// Existing guide IDs/flags only. CH03~CH10 design records must never be imported as completed quests.
export const SINNOH_DELIVERY_OBJECTIVES = createCatalog<string, StoryObjectiveDefinition>('story objectives', [
  { id: 'observation', event: 'observation', title: '관측 자료 받기', map: 'tour_veilstone',
    action: '마을 안내 자리의 연구원을 만나자', complete: { kind: 'flag', key: 'observationCollected' } },
  { id: 'research', event: 'researchGate', title: '관측 자료 전달', map: 'tour_jubilife',
    action: '연구 통로 안내원을 만나자', complete: { kind: 'flag', key: 'researchDelivered' } },
  { id: 'ferry', event: 'ferry', title: '조사선으로 출발', map: 'tour_canalave',
    action: '조사선 선원에게 말을 걸자', complete: { kind: 'flag', key: 'ferryPass' } },
], row => row.id);

