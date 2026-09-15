import type { Battle } from './battle';
import type { Pokemon,SaveData } from './types';

export const ROUTE43_BATTLE={
  partner:'nexusRoute43BattlePartner',slot:'nexusRoute43BattlePartnerSlot',
  level:'nexusRoute43BattlePartnerLevel',trainer:'nexusRoute43BattleTrainer',
  participated:'nexusRoute43BattlePartnerWon',
} as const;

const trainers=new Set(['johto-route-43-practice','johto-route-43-camper-practice']);
const trainerCode=(id:string)=>id==='johto-route-43-practice'?1:id==='johto-route-43-camper-practice'?2:0;

/** Remember the actual local lead at battle start; ordinary party members remain valid choices. */
export function prepareRoute43PartnerBattle(save:SaveData,trainerId:string){
  const partner=save.party[0],f=ROUTE43_BATTLE;
  if(!trainers.has(trainerId))return false;
  // A later optional fight must not erase the companion's completed journey.
  // The roster tracker continues to follow that object for the return dialogue.
  if(save.flags[f.participated]===true)return false;
  delete save.flags[f.partner];delete save.flags[f.slot];delete save.flags[f.level];delete save.flags[f.trainer];save.flags[f.participated]=false;
  if(!partner||partner.hp<=0||partner.met!=='성도 43번도로')return false;
  save.flags[f.partner]=partner.species;save.flags[f.slot]=0;save.flags[f.level]=partner.level;
  save.flags[f.trainer]=trainerCode(trainerId);save.flags[f.participated]=false;return true;
}

/** A win counts only when that same captured object actually defeated an opponent. */
export function recordRoute43PartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=ROUTE43_BATTLE,id=battle.trainer?.id,slot=save.flags[f.slot];
  if(save.flags[f.participated]===true)return false;
  if(outcome!=='won'||battle.kind!=='trainer'||!id||!trainers.has(id)||trainerCode(id)!==save.flags[f.trainer]||typeof slot!=='number')return false;
  const partner:Pokemon|undefined=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||partner.met!=='성도 43번도로'||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  save.flags[f.participated]=true;return true;
}
