import type { Pokemon,SaveData } from './types';
import { ROUTE_ELEVEN_JOURNEY,isRouteElevenPartner } from './unova-route-eleven-journey';

export const OPELUCID_ARRIVAL={
  arrived:'opelucidRouteElevenArrived',
  logged:'opelucidRouteElevenPartnerLogged',
  partner:'opelucidRouteElevenArrivalPartner',
  slot:'opelucidRouteElevenArrivalPartnerSlot',
  level:'opelucidRouteElevenArrivalLevel',
  moveStudy:'opelucidMoveStudyReviewed',
} as const;

export type OpelucidArrivalState='ready'|'fainted'|'missing'|'not-participated';

export function opelucidArrivalPartner(save:SaveData):{state:OpelucidArrivalState;partner?:Pokemon;slot?:number}{
  const f=ROUTE_ELEVEN_JOURNEY,slot=save.flags[f.slot];
  if(save.flags[f.participated]!==true)return {state:'not-participated'};
  if(typeof slot!=='number')return {state:'missing'};
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isRouteElevenPartner(partner))return {state:'missing'};
  return {state:partner.hp>0?'ready':'fainted',partner,slot};
}

export function recordOpelucidArrival(save:SaveData){
  const current=opelucidArrivalPartner(save);
  if(current.state!=='ready'||!current.partner||current.slot===undefined)return false;
  const f=OPELUCID_ARRIVAL;
  save.flags[f.arrived]=true;
  save.flags[f.partner]=current.partner.species;
  save.flags[f.slot]=current.slot;
  save.flags[f.level]=current.partner.level;
  return true;
}

export function isRecordedOpelucidPartner(save:SaveData,partner:Pokemon|undefined){
  const f=OPELUCID_ARRIVAL,current=opelucidArrivalPartner(save);
  return save.flags[f.arrived]===true&&current.partner===partner&&
    !!partner&&partner.species===save.flags[f.partner]&&isRouteElevenPartner(partner);
}
