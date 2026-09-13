/** Static definitions only: never put a player's party, flags or rewards here. */
export interface Catalog<K extends string | number, T> {
  readonly size: number;
  get(id: K): T | undefined;
  require(id: K): T;
  has(id: K): boolean;
  all(): readonly T[];
}

/** Keys are explicit: translated names and source encounter IDs are not universal IDs. */
export function createCatalog<K extends string | number, T>(
  table: string, rows: readonly T[], key: (row: T) => K,
): Catalog<K, T> {
  const index = new Map<K, T>();
  for (const row of rows) {
    const id = key(row);
    if (index.has(id)) throw new Error(`Duplicate ${table} key: ${String(id)}`);
    index.set(id, row);
  }
  const values = Object.freeze([...index.values()]);
  return Object.freeze({
    size: index.size,
    get: (id: K) => index.get(id),
    has: (id: K) => index.has(id),
    require(id: K): T {
      const row = index.get(id);
      if (row === undefined) throw new Error(`Unknown ${table} key: ${String(id)}`);
      return row;
    },
    all: () => values,
  });
}

export type RegionId = 'sinnoh' | 'kanto' | 'johto' | 'unova';
export interface DefinitionOrigin {
  readonly kind: 'source' | 'project' | 'mixed';
  readonly source: string;
  readonly implementation: 'runtime' | 'design-only';
  /** Runtime inclusion is not evidence of successful play or QA. */
  readonly verification: 'not-verified-by-catalog';
}
export const REGIONS = createCatalog('regions', [
  { id: 'sinnoh' as const, name: '신오', geographyReference: 'platinum' },
  { id: 'kanto' as const, name: '관동', geographyReference: 'heartgold-soulsilver' },
  { id: 'johto' as const, name: '성도', geographyReference: 'heartgold-soulsilver' },
  { id: 'unova' as const, name: '하나', geographyReference: 'black-2-white-2' },
], row => row.id);

