import type { Pokemon } from './types';
import { encounterOrigin } from './runtime-encounters';

export const SEAFOAM_HABITATS=['tour_kanto_seafoam_1f','tour_kanto_seafoam_b1f','tour_kanto_seafoam_b2f'] as const;
export const CINNABAR_RESEARCH_HABITATS=['tour_cinnabar',...SEAFOAM_HABITATS] as const;

/** Capture provenance, including evolved partners; species alone is not local origin. */
export function isSeafoamCompanion(mon:Pokemon):boolean{
  return SEAFOAM_HABITATS.some(map=>encounterOrigin(map)===mon.met);
}
export function isCinnabarResearchCompanion(mon:Pokemon):boolean{
  return CINNABAR_RESEARCH_HABITATS.some(map=>encounterOrigin(map)===mon.met);
}
