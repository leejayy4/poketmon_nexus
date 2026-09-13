// Engine-independent definition layer; import WORLD_DATABASE from maps for constructed geography.
export { createCatalog, REGIONS } from './catalog';
export type { Catalog, RegionId, DefinitionOrigin } from './catalog';
export { RUNTIME_DATABASE, RUNTIME_ORIGIN } from './runtime';
export { RUNTIME_RULES } from './rules';
export { ITEMS, ITEM_ORIGIN, POKE_BALL, POTION, BASIC_SHOP_ITEMS } from './items';
export { SINNOH_DELIVERY_OBJECTIVES, meetsStoryCondition } from './story';
export type { StoryCondition, StoryObjectiveDefinition } from './story';
export { createWorldDatabase } from './world';
export { inspectRuntimeReferences } from './references';
