import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const OREBURGH_GATE_JOURNEY={partner:'oreburghGatePartner',slot:'oreburghGatePartnerSlot',level:'oreburghGatePartnerLevel',participated:'oreburghGatePartnerWon'} as const;
export const OREBURGH_GATE_TRAINER='oreburgh-gate-1f-practice';
const LOCAL_MET='무쇠게이트 1층';
const LOCAL_SPECIES=new Set([41,54,74]);

export function isOreburghGatePartner(mon:Pokemon|undefined){return !!mon&&mon.met===LOCAL_MET&&LOCAL_SPECIES.has(mon.species);}

export function prepareOreburghGatePartnerBattle(save:SaveData,trainerId:string){
  if(trainerId!==OREBURGH_GATE_TRAINER)return false;
  const f=OREBURGH_GATE_JOURNEY,partner=save.party[0];
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];save.flags[f.participated]=false;
  if(!isOreburghGatePartner(partner)||partner!.hp<=0)return false;
  save.flags[f.partner]=partner!.species;save.flags[f.slot]=0;save.flags[f.level]=partner!.level;return true;
}

export function canRetryOreburghGatePartnerBattle(save:SaveData,trainerId:string){
  const f=OREBURGH_GATE_JOURNEY,slot=save.flags[f.slot],tracked=typeof slot==='number'?save.party[slot]:undefined;
  const current=tracked?.species===save.flags[f.partner]&&isOreburghGatePartner(tracked)?tracked:undefined;
  return trainerId===OREBURGH_GATE_TRAINER&&save.flags[`trainerWon:${trainerId}`]===true&&(save.flags[f.participated]!==true||!current)&&save.party.some(mon=>mon.hp>0&&isOreburghGatePartner(mon));
}

export function recordOreburghGatePartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=OREBURGH_GATE_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==OREBURGH_GATE_TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!isOreburghGatePartner(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated]===true)return false;save.flags[f.participated]=true;return true;
}
