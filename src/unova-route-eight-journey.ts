import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const ROUTE_EIGHT_JOURNEY={
  partner:'nexusRouteEightBattlePartner',slot:'nexusRouteEightBattlePartnerSlot',
  level:'nexusRouteEightBattlePartnerLevel',participated:'nexusRouteEightBattlePartnerWon',
  arrived:'nexusRouteEightPartnerArrivedIcirrus',
} as const;
export const ROUTE_EIGHT_TRAINER='unova-route-8-practice';
const LOCAL_SPECIES=new Set([588,616]);

export function isRouteEightPartner(mon:Pokemon|undefined){return !!mon&&mon.met==='하나 8번도로'&&LOCAL_SPECIES.has(mon.species);}

export function prepareRouteEightPartnerBattle(save:SaveData,trainerId:string){
  if(trainerId!==ROUTE_EIGHT_TRAINER)return false;
  const f=ROUTE_EIGHT_JOURNEY,partner=save.party[0];
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];delete save.flags[f.arrived];save.flags[f.participated]=false;
  if(!isRouteEightPartner(partner)||partner!.hp<=0)return false;
  save.flags[f.partner]=partner!.species;save.flags[f.slot]=0;save.flags[f.level]=partner!.level;return true;
}

export function canRetryRouteEightPartnerBattle(save:SaveData,trainerId:string){
  const f=ROUTE_EIGHT_JOURNEY,slot=save.flags[f.slot],tracked=typeof slot==='number'?save.party[slot]:undefined;
  const current=tracked?.species===save.flags[f.partner]&&isRouteEightPartner(tracked)?tracked:undefined;
  return trainerId===ROUTE_EIGHT_TRAINER&&save.flags[`trainerWon:${trainerId}`]===true&&
    (save.flags[f.participated]!==true||!current)&&save.party.some(mon=>mon.hp>0&&isRouteEightPartner(mon));
}

export function recordRouteEightPartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=ROUTE_EIGHT_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==ROUTE_EIGHT_TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isRouteEightPartner(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated]===true)return false;save.flags[f.participated]=true;return true;
}

export function routeEightTrackedPartner(save:SaveData){
  const f=ROUTE_EIGHT_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined;
  return partner?.species===save.flags[f.partner]&&isRouteEightPartner(partner)?partner:undefined;
}
