import type { GameMap, SaveData } from './types';

export const OREBURGH_ROARK = {
  event: 'oreburghRoarkShift', x: 32, y: 33,
  met: 'oreburghRoarkMineMet', gymMet: 'oreburghRoarkGymMet',
} as const;

/** Keep the optional meeting off the six-tile entrance lane and all habitats. */
export function installOreburghRoark(map: GameMap) {
  if (map.npcs.some(npc => npc.id === OREBURGH_ROARK.event)) return;
  // This was solid rock, so no valid old save can already occupy this cell.
  // Open only a one-tile alcove beside (31,33), never block an old save position.
  const { x, y } = OREBURGH_ROARK;
  map.walkable = map.walkable.map((row, index) => index === y ? row.slice(0, x) + '.' + row.slice(x + 1) : row);
  map.npcs.push({ id: OREBURGH_ROARK.event, dialogue: OREBURGH_ROARK.event,
    name: '교대를 살피는 강석',
    sprite: 'worker', x: OREBURGH_ROARK.x, y: OREBURGH_ROARK.y, facing: 'left' });
}

/** A save projection, never a mutation of the shared world or another slot. */
export function applyOreburghRoark(map: GameMap, flags: SaveData['flags']): GameMap {
  if (map.id !== 'tour_oreburgh_mine' || (!flags[OREBURGH_ROARK.met] && !flags[OREBURGH_ROARK.gymMet])) return map;
  return { ...map, npcs: map.npcs.filter(npc => npc.id !== OREBURGH_ROARK.event) };
}
