import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const ROUTE_TWELVE_JOURNEY={
  partner:'nexusRouteTwelveBattlePartner',
  slot:'nexusRouteTwelveBattlePartnerSlot',
  level:'nexusRouteTwelveBattlePartnerLevel',
  participated:'nexusRouteTwelveBattlePartnerWon',
} as const;

export const ROUTE_TWELVE_TRAINER='unova-route-12-practice';
const LOCAL_MET='하나 12번도로';
const LOCAL_SPECIES=new Set([315,415,520]);

export function isRouteTwelvePartner(mon:Pokemon|undefined){
  return !!mon&&mon.met===LOCAL_MET&&LOCAL_SPECIES.has(mon.species);
}

/** Bind the actual lead object immediately before this battle starts. */
export function prepareRouteTwelvePartnerBattle(save:SaveData,trainerId:string){
  if(trainerId!==ROUTE_TWELVE_TRAINER)return false;
  const f=ROUTE_TWELVE_JOURNEY,partner=save.party[0];
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];
  save.flags[f.participated]=false;
  if(!isRouteTwelvePartner(partner)||partner!.hp<=0)return false;
  save.flags[f.partner]=partner!.species;save.flags[f.slot]=0;save.flags[f.level]=partner!.level;
  return true;
}

/** Old wins can be replayed without reward after a local healthy partner is selected. */
export function canRetryRouteTwelvePartnerBattle(save:SaveData,trainerId:string){
  const f=ROUTE_TWELVE_JOURNEY,slot=save.flags[f.slot],tracked=typeof slot==='number'?save.party[slot]:undefined;
  const current=tracked?.species===save.flags[f.partner]&&isRouteTwelvePartner(tracked)?tracked:undefined;
  return trainerId===ROUTE_TWELVE_TRAINER&&save.flags[`trainerWon:${trainerId}`]===true&&
    (save.flags[f.participated]!==true||!current)&&save.party.some(mon=>mon.hp>0&&isRouteTwelvePartner(mon));
}

/** Count only the selected object if it actually defeated an opposing Pokémon in the won battle. */
export function recordRouteTwelvePartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=ROUTE_TWELVE_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==ROUTE_TWELVE_TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isRouteTwelvePartner(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated]===true)return false;
  save.flags[f.participated]=true;return true;
}
