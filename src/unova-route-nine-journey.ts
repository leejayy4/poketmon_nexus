import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const ROUTE_NINE_JOURNEY={
  partner:'nexusRouteNineBattlePartner',slot:'nexusRouteNineBattlePartnerSlot',
  level:'nexusRouteNineBattlePartnerLevel',participated:'nexusRouteNineBattlePartnerWon',
  returned:'nexusRouteNinePartnerReturned',
} as const;
export const ROUTE_NINE_TRAINER='unova-route-9-practice';

export function isRouteNinePartner(mon:Pokemon|undefined){return !!mon&&mon.met==='하나 9번도로'&&mon.species===572;}

export function prepareRouteNinePartnerBattle(save:SaveData,trainerId:string){
  if(trainerId!==ROUTE_NINE_TRAINER)return false;
  const f=ROUTE_NINE_JOURNEY,partner=save.party[0];
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];delete save.flags[f.returned];save.flags[f.participated]=false;
  if(!isRouteNinePartner(partner)||partner!.hp<=0)return false;
  save.flags[f.partner]=partner!.species;save.flags[f.slot]=0;save.flags[f.level]=partner!.level;return true;
}

export function canRetryRouteNinePartnerBattle(save:SaveData,trainerId:string){
  const f=ROUTE_NINE_JOURNEY,slot=save.flags[f.slot],tracked=typeof slot==='number'?save.party[slot]:undefined;
  const current=tracked?.species===save.flags[f.partner]&&isRouteNinePartner(tracked)?tracked:undefined;
  return trainerId===ROUTE_NINE_TRAINER&&save.flags[`trainerWon:${trainerId}`]===true&&
    (save.flags[f.participated]!==true||!current)&&save.party.some(mon=>mon.hp>0&&isRouteNinePartner(mon));
}

export function recordRouteNinePartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=ROUTE_NINE_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==ROUTE_NINE_TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isRouteNinePartner(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated]===true)return false;save.flags[f.participated]=true;return true;
}
