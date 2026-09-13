import DATA from '../runtime-pokemon-data.json';
import { createCatalog, REGIONS, type DefinitionOrigin } from './catalog';

/** Compatibility view. The exporter remains the sole source of species/move numbers. */
export const RUNTIME_DATA = DATA;
export const RUNTIME_ORIGIN: DefinitionOrigin = Object.freeze({
  kind: 'mixed', source: `runtime-pokemon-data.json@${DATA.referenceCommit}`,
  implementation: 'runtime', verification: 'not-verified-by-catalog',
});
export type RuntimeSpecies = (typeof DATA.species)['1'];
export type RuntimeMove = (typeof DATA.moves)[keyof typeof DATA.moves];
export type RuntimeEncounterPool = (typeof DATA.pools)[number];
export const RUNTIME_SPECIES_DATA = DATA.species as Record<number, RuntimeSpecies>;
export const RUNTIME_MOVE_DATA = DATA.moves as Record<string, RuntimeMove>;

const species = createCatalog('species', Object.entries(RUNTIME_SPECIES_DATA).map(([id, data]) => ({
  id: Number(id), data,
  learnsetVersion: (DATA.learnsetOverrides as Record<string, string>)[id] ?? DATA.learnsetVersion,
  ownable: DATA.ownable.includes(Number(id)),
})), row => row.id);
const moves = createCatalog('moves', Object.entries(RUNTIME_MOVE_DATA).map(([name, data]) => ({
  id: data.id, name, data,
})), row => row.id);
// An ENC source can be adapted into several project habitats; node is the runtime binding key.
const pools = createCatalog('encounter pools by node', DATA.pools, row => row.node);
const evolutions = createCatalog('level evolutions', DATA.evolutions.map(data => ({
  id: `${data.from}:${data.to}:${data.level}`, ...data,
})), row => row.id);

export const RUNTIME_DATABASE = Object.freeze({
  schemaVersion: 1,
  origin: RUNTIME_ORIGIN,
  regions: REGIONS, species, moves, pools, evolutions,
  capabilities: Object.freeze({
    timePolicy: DATA.timePolicy,
    restrictions: DATA.limits,
    visualTarget: 'bw-bw2',
    questDesignsAutoEnabled: false,
  }),
  moveByName(name: string) { return RUNTIME_MOVE_DATA[name]; },
  poolByNode(node: string) { return pools.get(node); },
  evolutionFrom(speciesId: number, level: number) {
    // Preserve the exporter's precedence if a future species has several candidates.
    return evolutions.all().find(row => row.from === speciesId && level >= row.level);
  },
  evolutionInto(speciesId: number) { return evolutions.all().find(row => row.to === speciesId); },
});

