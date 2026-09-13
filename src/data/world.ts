import type { GameMap, MapId } from '../types';

/** Reads built runtime maps lazily; avoids importing map construction into the data layer. */
export function createWorldDatabase(
  maps: () => Partial<Record<MapId, GameMap>>,
  canonicalId: (id: MapId) => MapId,
) {
  return Object.freeze({
    get(id: MapId): GameMap | undefined { return maps()[canonicalId(id)]; },
    require(id: MapId): GameMap {
      const map = maps()[canonicalId(id)];
      if (!map) throw new Error(`Unknown runtime map: ${id}`);
      return map;
    },
    locations() {
      return Object.values(maps()).filter((map): map is GameMap => Boolean(map)).map(map => ({
        id: map.id, name: map.name, width: map.width, height: map.height,
        // These are actual dimensions, never design targets or inferred original route numbers.
        implementation: 'runtime' as const,
      }));
    },
    exits(id: MapId) {
      const map = maps()[canonicalId(id)];
      return map?.warps.map(warp => ({
        from: map.id, to: canonicalId(warp.to),
        exit: { x: warp.x, y: warp.y }, spawn: { ...warp.spawn },
        entry: warp.entry, facing: warp.facing, requiresFlag: warp.requiresFlag,
      })) ?? [];
    },
  });
}

