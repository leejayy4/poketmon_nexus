import { RUNTIME_DATA } from './data/runtime';

/** Source-owned starter IDs, separate from National Dex species and legacy gifts. */
export const NEXUS_STARTERS:readonly number[]=Object.freeze([...RUNTIME_DATA.nexusStarterIds]);
export const LEGACY_STARTERS:readonly number[]=Object.freeze([7,4,1]);
export interface StarterCampaign {readonly version?:number;readonly campaign?:'nexus'|'legacy'}
export type NexusStarterDefinition=(typeof RUNTIME_DATA.projectSpecies)['900001'];
const definitions:Readonly<Record<number,NexusStarterDefinition>>=RUNTIME_DATA.projectSpecies;

export function isNexusCampaign(save:StarterCampaign):boolean{return save.version===2&&save.campaign==='nexus';}
export function isNexusStarter(species:number):boolean{return NEXUS_STARTERS.includes(species);}
export function isStarterSpecies(species:number):boolean{return isNexusStarter(species)||LEGACY_STARTERS.includes(species);}
export function starterSpeciesFor(save:StarterCampaign):readonly number[]{return isNexusCampaign(save)?NEXUS_STARTERS:LEGACY_STARTERS;}
export function nexusStarterDefinition(species:number):NexusStarterDefinition|undefined{return definitions[species];}
/** Project IDs are storage keys, never invented National Dex numbers in the UI. */
export function speciesNumberLabel(species:number):string{return isNexusStarter(species)?'NEXUS':`No.${String(species).padStart(3,'0')}`;}
