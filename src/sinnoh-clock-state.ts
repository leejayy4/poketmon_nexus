import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';

export const SINNOH_CLOCK_FLAGS = {
  observed: 'nexusJubilifeClockObserved',
  compared: 'nexusEternaClockCompared',
  archived: 'nexusSinnohClockArchived',
} as const;

// Reuse one solid fountain-rim tile: no new collision or save-position migration.
export const JUBILIFE_CLOCK = { x: 16, y: 19, event: 'nexusJubilifeClock' } as const;

export function installJubilifeClock(map: GameMap, outdoors: TourOutdoors) {
  const { x, y, event } = JUBILIFE_CLOCK;
  outdoors.objects = outdoors.objects.filter(object => object.event !== event);
  for (const object of outdoors.objects) object.cells = object.cells.filter(cell => cell.x !== x || cell.y !== y);
  map.props = map.props.filter(prop => prop.dialogue !== event && (prop.x !== x || prop.y !== y));
  map.props.push({ x, y, dialogue: event });
  outdoors.objects.push({ name: '광장 교통 시계', event, cells: [{ x, y }], pages: ['분수 옆 교통 시계. 작은 기준 시계가 나란히 달려 있다.'] });
}
