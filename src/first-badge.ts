import type { Pokemon,SaveData } from './types';

export const FIRST_BADGE='BADGE-GS01';
export const FIRST_TM='TM-stealth-rock';
export const FIRST_PRIZE=1440;
export function roarkTeam():Pokemon[]{
  return [[74,10,22],[95,11,24],[408,12,26]].map(([species,level,maxHp])=>({species,level,maxHp,hp:maxHp,experience:0,nature:'성실',met:'무쇠체육관'}));
}
export function grantFirstBadge(save:SaveData):boolean{
  if(save.badges.includes(FIRST_BADGE))return false;
  save.badges.push(FIRST_BADGE);save.keyItems.push(FIRST_TM);save.money=Math.min(999999,save.money+FIRST_PRIZE);
  return true;
}
