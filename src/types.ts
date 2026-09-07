export type Direction = 'up' | 'down' | 'left' | 'right';
export type MapId = import('./explore-world').TourId | 'bedroom' | 'home' | 'town' | 'lab' | 'neighbor' | 'cottage' | 'route_s01' | 'jubilife' | 'oreburgh' | 'jubilife_center' | 'oreburgh_center' | 'oreburgh_gym' | 'eterna_forest' | 'eterna' | 'eterna_center' | 'eterna_gym' | 'coronet_pass' | 'hearthome' | 'hearthome_center' | 'hearthome_gym' | 'veilstone' | 'veilstone_center' | 'veilstone_gym' | 'research_path' | 'canalave' | 'vermilion_port';
export interface Point { x: number; y: number }
export interface Warp extends Point { to: MapId; spawn: Point; facing: Direction; entry: Direction; requiresFlag?:string }
export interface NPC extends Point { id: string; name: string; sprite: string; facing: Direction; dialogue: string }
export interface Prop extends Point { dialogue: string }
export interface GameMap { id: MapId; name: string; width: number; height: number; background: string; walkable: string[]; warps: Warp[]; npcs: NPC[]; props: Prop[]; reserved?:Point[]; terrain?: {kind:'tallGrass';x:number;y:number;w:number;h:number}[] }
export interface Pokemon { species: number; level: number; hp: number; maxHp: number; experience:number; nature: string; met: string }
export interface SaveData { tourVisited?:import('./explore-world').TourId[]; version: 1; worldRevision?:number; map: MapId; player: Point & { facing: Direction }; flags: Record<string, boolean | number>; party: Pokemon[]; inventory:{pokeBalls:number;potions:number}; badges:string[]; keyItems:string[]; money:number; healingPoint:MapId; steps: number; seconds: number }
export interface Choice { label: string; action: () => void }
export interface Dialogue { speaker: string; pages: string[]; page: number; shown: number; choices?: Choice[]; selected: number; after?: () => void }
export type Panel = 'field' | 'menu' | 'party' | 'summary' | 'bag' | 'fieldHeal' | 'trainer' | 'options' | 'starters';
