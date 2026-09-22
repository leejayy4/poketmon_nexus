import type { GameMap } from './types';

export const OREBURGH_FIRST_BADGE = {
  event: 'tourGuide', x: 16, y: 14,
  won: 'nexusOreburghFirstBadgeWon',
  observed: 'nexusOreburghBadgeObserved',
  reply: 'nexusOreburghBadgeReply',
  shared: 'nexusOreburghSnackShared',
  partner: 'nexusOreburghSnackPartnerSpecies',
  revisited: 'nexusOreburghBadgeRevisited',
  completed: 'nexusOreburghFirstBadgeEvening',
} as const;

/** Reuse the existing guide actor and occupied cell; old save positions stay valid. */
export function installOreburghFirstBadge(map: GameMap) {
  if (map.id !== 'tour_oreburgh') return;
  const guide = map.npcs.find(npc => npc.id === OREBURGH_FIRST_BADGE.event);
  if (guide) Object.assign(guide, { name: '여행 친구 유진', sprite: 'school_kid_m' });
}
