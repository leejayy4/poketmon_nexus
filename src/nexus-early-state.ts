import type { GameMap, Pokemon, SaveData } from './types';
import { isNexusCampaign } from './nexus-starters';

export const NEXUS_EARLY = {
  reunion:'nexusSandgemReunion', rested:'nexusSandgemRested',
  lesson:'nexusCatchingLesson', reviewed:'nexusLocalPartnerReviewed',
  caught:'nexusEarlyCaught', partnerBattled:'nexusEarlyPartnerBattled',
} as const;

export function nexusEarlyReady(save:SaveData):boolean {
  return isNexusCampaign(save)&&save.flags.departureCleared===true;
}
export function isEarlyPartner(partner:Pokemon):boolean {
  return partner.met==='신오 201번도로'||partner.met==='신오 202번도로';
}
export function earlyPartners(save:SaveData):Pokemon[] {
  return [...save.party,...save.box??[]].filter(isEarlyPartner);
}
export function hasSandgemSupply(save:SaveData):boolean {
  return nexusEarlyReady(save)&&!save.badges.length;
}
/** New facts are optional for older v2 saves. Loading never invents a visit. */
export function validNexusEarlyState(save:SaveData):boolean {
  const keys=Object.values(NEXUS_EARLY);
  if(keys.some(key=>save.flags[key]!==undefined&&typeof save.flags[key]!=='boolean'))return false;
  if(keys.some(key=>save.flags[key]===true)&&!nexusEarlyReady(save))return false;
  return !save.flags[NEXUS_EARLY.reviewed]||save.flags[NEXUS_EARLY.reunion]===true;
}

/** Use an already blocked bench anchor, preserving every previously legal tile. */
export function applyNexusEarlyActors(map:GameMap,save:SaveData):GameMap {
  if(map.id!=='tour_sandgem_center'||!nexusEarlyReady(save))return map;
  return {...map,npcs:[...map.npcs,{id:'nexusYujinSandgem',name:'유진',sprite:'youngster',
    x:3,y:9,facing:'right',dialogue:'tourExhibit2'}]};
}
