import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const JOHTO_EAST_BATTLE={
  partner:'nexusJohtoEastBattlePartner',slot:'nexusJohtoEastBattlePartnerSlot',
  level:'nexusJohtoEastBattlePartnerLevel',trainer:'nexusJohtoEastBattleTrainer',
  participated:'nexusJohtoEastBattlePartnerWon',
} as const;

const trainers=new Set(['johto-route-44-practice','johto-ice-path-practice']);
const origins=new Set(['성도 44번도로','얼음샛길']);
const trainerCode=(id:string)=>id==='johto-route-44-practice'?1:id==='johto-ice-path-practice'?2:0;

export function prepareJohtoEastPartnerBattle(save:SaveData,trainerId:string){
  const f=JOHTO_EAST_BATTLE,partner=save.party[0];
  if(!trainers.has(trainerId)||save.flags[f.participated]===true)return false;
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];delete save.flags[f.trainer];save.flags[f.participated]=false;
  if(!partner||partner.hp<=0||!origins.has(partner.met))return false;
  save.flags[f.partner]=partner.species;save.flags[f.slot]=0;save.flags[f.level]=partner.level;
  save.flags[f.trainer]=trainerCode(trainerId);return true;
}

export function canRetryJohtoEastPartnerBattle(save:SaveData,trainerId:string){
  const f=JOHTO_EAST_BATTLE,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined;
  const lead=save.party[0],candidate=partner?.species===save.flags[f.partner]?partner:lead;
  return trainers.has(trainerId)&&save.flags[`trainerWon:${trainerId}`]===true&&save.flags[f.participated]!==true&&
    !!candidate&&candidate.hp>0&&origins.has(candidate.met);
}

export function recordJohtoEastPartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=JOHTO_EAST_BATTLE,id=battle.trainer?.id,slot=save.flags[f.slot];
  if(save.flags[f.participated]===true||outcome!=='won'||battle.kind!=='trainer'||!id||!trainers.has(id)||trainerCode(id)!==save.flags[f.trainer]||typeof slot!=='number')return false;
  const partner:Pokemon|undefined=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!origins.has(partner.met)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  save.flags[f.participated]=true;return true;
}
