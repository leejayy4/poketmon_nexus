import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const ROUTE203_JOURNEY={partner:'sinnohRoute203Partner',slot:'sinnohRoute203PartnerSlot',level:'sinnohRoute203PartnerLevel',participated:'sinnohRoute203PartnerWon'} as const;
export const ROUTE203_TRAINER='sinnoh-route-203-practice';
const LOCAL_MET='신오 203번도로';
const LOCAL_SPECIES=new Set([63,396,399,403]);

export function isRoute203Partner(mon:Pokemon|undefined){return !!mon&&mon.met===LOCAL_MET&&LOCAL_SPECIES.has(mon.species);}

export function prepareRoute203PartnerBattle(save:SaveData,trainerId:string){
  if(trainerId!==ROUTE203_TRAINER)return false;
  const f=ROUTE203_JOURNEY,partner=save.party[0];
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];save.flags[f.participated]=false;
  if(!isRoute203Partner(partner)||partner!.hp<=0)return false;
  save.flags[f.partner]=partner!.species;save.flags[f.slot]=0;save.flags[f.level]=partner!.level;return true;
}

export function canRetryRoute203PartnerBattle(save:SaveData,trainerId:string){
  const f=ROUTE203_JOURNEY,slot=save.flags[f.slot],tracked=typeof slot==='number'?save.party[slot]:undefined;
  const current=tracked?.species===save.flags[f.partner]&&isRoute203Partner(tracked)?tracked:undefined;
  return trainerId===ROUTE203_TRAINER&&save.flags[`trainerWon:${trainerId}`]===true&&(save.flags[f.participated]!==true||!current)&&save.party.some(mon=>mon.hp>0&&isRoute203Partner(mon));
}

export function recordRoute203PartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=ROUTE203_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==ROUTE203_TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isRoute203Partner(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated]===true)return false;save.flags[f.participated]=true;return true;
}
