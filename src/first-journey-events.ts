import type { Engine } from './engine';
import type { MapId } from './types';
import { handleFirstBadgeTown } from './first-badge-town';
import { handleOreburghFirstBadge } from './oreburgh-first-badge';
import { OREBURGH_FIRST_BADGE } from './oreburgh-first-badge-state';
import { handleOreburghMineCompanion, handleOreburghMineExhibition } from './oreburgh-mine-companion';
import { handleOreburghRoark } from './oreburgh-roark-story';
import { OREBURGH_ROARK } from './oreburgh-roark-state';
import { handleSinnohClock } from './sinnoh-clock-story';
import { JUBILIFE_CLOCK } from './sinnoh-clock-state';
import { handleFirstJourneyArrival, handleFirstJourneyGate } from './first-journey-travel';
import { handleNexusOpening } from './nexus-opening';
import { handleNexusEarlyJourney } from './nexus-early-journey';

type EventHandler = (game: Engine, event: string) => boolean;
export interface FirstJourneyEventRegistration {
  readonly map: MapId;
  readonly event: string;
  readonly handlers: readonly EventHandler[];
}

/**
 * Only the adopted first-journey interactions live here. Map construction keeps
 * placement; each existing adapter owns conditions, dialogue and save effects.
 * A shared event name on another map never opts it into this progression.
 */
export const FIRST_JOURNEY_EVENTS = [
  { map: 'bedroom', event: 'tv', handlers: [handleNexusOpening] },
  { map: 'home', event: 'tv', handlers: [handleNexusOpening] },
  { map: 'home', event: 'mom', handlers: [handleNexusOpening] },
  { map: 'lab', event: 'professor', handlers: [handleNexusOpening] },
  { map: 'lab', event: 'pokeballs', handlers: [handleNexusOpening] },
  { map: 'lab', event: 'assistant', handlers: [handleNexusOpening] },
  { map: 'lab', event: 'eeveeResearcher', handlers: [handleNexusOpening] },
  { map: 'tour_sandgem_center', event: 'tourExhibit2', handlers: [handleNexusEarlyJourney] },
  { map: 'tour_sinnoh_route_202', event: 'route202Sign', handlers: [handleNexusEarlyJourney] },
  { map: 'tour_jubilife', event: JUBILIFE_CLOCK.event, handlers: [handleSinnohClock] },
  { map: 'tour_jubilife', event: 'researchGate', handlers: [handleFirstBadgeTown] },
  { map: 'tour_jubilife', event: 'jubilifeSouthGreeter', handlers: [handleFirstJourneyArrival] },
  { map: 'tour_jubilife', event: 'jubilifeEastGuide', handlers: [handleFirstJourneyArrival] },
  { map: 'tour_oreburgh_gate_1f', event: 'oreburghGateSign', handlers: [handleFirstJourneyGate] },
  { map: 'tour_oreburgh_gate_1f', event: 'oreburghGateBasementSign', handlers: [handleFirstJourneyGate] },
  { map: 'tour_oreburgh_gate_1f', event: 'oreburghGateWorker', handlers: [handleFirstJourneyGate] },
  { map: 'tour_oreburgh', event: 'oreburghWestArrivalGuide', handlers: [handleFirstJourneyArrival] },
  // The celebration claims this actor only after a badge. Earlier visits still
  // use the same town-guide adapter; a claimed interaction never falls through.
  { map: 'tour_oreburgh', event: OREBURGH_FIRST_BADGE.event, handlers: [handleOreburghFirstBadge, handleFirstBadgeTown] },
  { map: 'tour_oreburgh', event: 'tourResident1', handlers: [handleOreburghMineExhibition] },
  { map: 'tour_oreburgh_mine', event: OREBURGH_ROARK.event, handlers: [handleOreburghRoark] },
  { map: 'tour_oreburgh_mine', event: 'oreburghMineForeman', handlers: [handleOreburghMineCompanion] },
  { map: 'tour_oreburgh_mine', event: 'oreburghMineRail', handlers: [handleOreburghMineCompanion] },
  { map: 'tour_oreburgh_mine', event: 'oreburghMineSeam', handlers: [handleOreburghMineCompanion] },
  { map: 'tour_oreburgh_hall', event: 'tourHost', handlers: [handleOreburghMineExhibition] },
  { map: 'tour_oreburgh_hall', event: 'tourExhibit0', handlers: [handleOreburghMineExhibition] },
  { map: 'tour_oreburgh_hall', event: 'tourExhibit1', handlers: [handleOreburghMineExhibition] },
  { map: 'tour_oreburgh_hall', event: 'tourExhibit2', handlers: [handleOreburghMineExhibition] },
] as const satisfies readonly FirstJourneyEventRegistration[];

export function firstJourneyEvent(map: MapId, event: string): FirstJourneyEventRegistration | undefined {
  return FIRST_JOURNEY_EVENTS.find(registration => registration.map === map && registration.event === event);
}

/** Call after gym/road trainers and before generic city/resident/story fallbacks. */
export function handleFirstJourneyEvent(game: Engine, event: string): boolean {
  const registration = firstJourneyEvent(game.save.map, event);
  if (!registration) return false;
  for (const handle of registration.handlers) if (handle(game, event)) return true;
  return false;
}
