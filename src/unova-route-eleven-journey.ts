import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const ROUTE_ELEVEN_JOURNEY={
  partner:'nexusRouteElevenBattlePartner',slot:'nexusRouteElevenBattlePartnerSlot',
  level:'nexusRouteElevenBattlePartnerLevel',participated:'nexusRouteElevenBattlePartnerWon',
} as const;
export const ROUTE_ELEVEN_TRAINER='unova-route-11-practice';
const LOCAL_SPECIES=new Set([183,588,616]);

export function isRouteElevenPartner(mon:Pokemon|undefined){return !!mon&&mon.met==='하나 11번도로'&&LOCAL_SPECIES.has(mon.species);}

export function prepareRouteElevenPartnerBattle(save:SaveData,trainerId:string){
  if(trainerId!==ROUTE_ELEVEN_TRAINER)return false;
  const f=ROUTE_ELEVEN_JOURNEY,partner=save.party[0];
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];save.flags[f.participated]=false;
  if(!isRouteElevenPartner(partner)||partner!.hp<=0)return false;
  save.flags[f.partner]=partner!.species;save.flags[f.slot]=0;save.flags[f.level]=partner!.level;return true;
}

export function canRetryRouteElevenPartnerBattle(save:SaveData,trainerId:string){
  const f=ROUTE_ELEVEN_JOURNEY,slot=save.flags[f.slot],tracked=typeof slot==='number'?save.party[slot]:undefined;
  const current=tracked?.species===save.flags[f.partner]&&isRouteElevenPartner(tracked)?tracked:undefined;
  return trainerId===ROUTE_ELEVEN_TRAINER&&save.flags[`trainerWon:${trainerId}`]===true&&
    (save.flags[f.participated]!==true||!current)&&save.party.some(mon=>mon.hp>0&&isRouteElevenPartner(mon));
}

export function recordRouteElevenPartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=ROUTE_ELEVEN_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==ROUTE_ELEVEN_TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isRouteElevenPartner(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated]===true)return false;save.flags[f.participated]=true;return true;
}
