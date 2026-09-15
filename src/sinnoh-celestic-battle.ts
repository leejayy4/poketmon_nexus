import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const CELESTIC_ROUTE_BATTLE={
  partner:'celesticRouteBattlePartner',
  slot:'celesticRouteBattlePartnerSlot',
  level:'celesticRouteBattlePartnerLevel',
  trainer:'celesticRouteBattleTrainer',
  participated:'celesticRouteBattlePartnerWon',
} as const;

const trainers=new Set(['sinnoh-route-210-north-practice','sinnoh-route-211-west-practice','sinnoh-route-211-east-practice']);
/** Stable save codes; do not derive these values from catalogue ordering. */
export function celesticTrainerCode(id:string):number{
  return id==='sinnoh-route-210-north-practice'?1:id==='sinnoh-route-211-west-practice'?2:id==='sinnoh-route-211-east-practice'?3:0;
}
const localMet=new Set(['신오 210번도로 북부','천관산 211 통과층','신오 211번도로 서부','신오 211번도로 동부']);

export function prepareCelesticRouteBattle(save:SaveData,partner:Pokemon,trainerId:string){
  if(!trainers.has(trainerId)||!localMet.has(partner.met)||!save.party.includes(partner)||partner.hp<=0)return false;
  const f=CELESTIC_ROUTE_BATTLE;
  save.flags[f.partner]=partner.species;save.flags[f.slot]=save.party.indexOf(partner);
  save.flags[f.level]=partner.level;save.flags[f.trainer]=celesticTrainerCode(trainerId);save.flags[f.participated]=false;
  return true;
}

/** Record only the selected local object taking part in a newly won full trainer battle. */
export function recordCelesticRoutePartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=CELESTIC_ROUTE_BATTLE,slot=save.flags[f.slot],trainerId=battle.trainer?.id;
  if(outcome!=='won'||battle.kind!=='trainer'||!trainers.has(trainerId??'')||celesticTrainerCode(trainerId??'')!==save.flags[f.trainer]||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!localMet.has(partner.met)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  save.flags[f.participated]=true;return true;
}
