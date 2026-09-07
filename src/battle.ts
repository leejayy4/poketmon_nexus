import type { Pokemon, SaveData } from './types';
import { SPECIES } from './pokemon';
import { gainExperience, minimumLevel, type GrowthStep } from './growth';
import { gymTeam,gymById,type GymId } from './gyms';
import { maxHpAtLevel } from './growth';

export interface Battle {
  kind:'wild'|'gym'; gymId:GymId; opponents:Pokemon[]; enemyIndex:number; enemy:Pokemon; active:number; menu:'actions'|'moves'|'bag'|'party'|'heal'|'between'; selected:number;
  enemyAttackDrop:number; enemyDefenseDrop:number; result:boolean;
  participants:number[];
  forcedSwitch:boolean;
  betweenOpponents:boolean;
  moveSelections:number[];
}
export function createBattle(save:SaveData,kind:'wild'|'gym'='wild',gymId:GymId='roark'):Battle|null {
  const active=save.party.findIndex(p=>p.hp>0);
  if(active<0)return null;
  const level=(save.map==='eterna_forest'||save.map==='tour_eterna_forest')?7:(save.map==='coronet_pass'||save.map==='tour_coronet')?10:3;
  const maxHp=maxHpAtLevel(399,level);
  const opponents=kind==='gym'?gymTeam(gymId):[{species:399,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:(save.map==='eterna_forest'||save.map==='tour_eterna_forest')?'영원숲':(save.map==='coronet_pass'||save.map==='tour_coronet')?'천관산 하부':'새잎 서쪽길'}];
  return {kind,gymId,opponents,enemyIndex:0,enemy:opponents[0],
    active,participants:[active],forcedSwitch:false,betweenOpponents:false,moveSelections:save.party.map(()=>0),menu:'actions',selected:0,enemyAttackDrop:0,enemyDefenseDrop:0,result:false};
}
export function experienceParticipants(save:SaveData,b:Battle):number[]{
  return [...new Set(b.participants)].filter(i=>save.party[i]?.hp>0).sort((a,b)=>a-b);
}
export function playerDamage(p:Pokemon,b:Battle):number{
  return (p.species===25?7:6)+Math.floor((p.level-minimumLevel(p.species))/2)+b.enemyDefenseDrop;
}
export function enemyDamage(b:Battle,attackDrop=b.enemyAttackDrop):number{
  return Math.max(1,(b.kind==='gym'?gymById(b.gymId).damage:b.enemy.level===3?4:5)-attackDrop);
}
function rewardParticipants(save:SaveData,b:Battle,total:number,onStep:(page:string,step:GrowthStep,index:number)=>void){
  const eligible=experienceParticipants(save,b);
  eligible.forEach((index,i)=>gainExperience(save.party[index],Math.floor(total/eligible.length)+(i<total%eligible.length?1:0),(page,step)=>onStep(page,step,index)));
}
export type BattleAction = 'move0'|'move1'|'ball'|'potion'|'run'|{switch:number}|{potion:number};
export interface BattleFrame {
  enemy:Pokemon; player:Pokemon; enemyIndex:number; active:number;
  enemyAttackDrop:number; enemyDefenseDrop:number;
  effect?:{target:'player'|'enemy';kind:'damage'|'heal';amount:number};
  capture?:'throw';
  growth?:GrowthStep&{index:number};
}
export function captureBattleFrame(save:SaveData,b:Battle):BattleFrame {
  return {enemy:{...b.enemy},player:{...save.party[b.active]},enemyIndex:b.enemyIndex,active:b.active,enemyAttackDrop:b.enemyAttackDrop,enemyDefenseDrop:b.enemyDefenseDrop};
}
export interface TurnResult { pages:string[]; frames?:BattleFrame[]; outcome?:'won'|'caught'|'escaped'|'lost'; retry?:boolean }
function rejectAction(message:string):TurnResult{return {pages:[message],retry:true};}
// Small battle rules: level-based damage, two moves and HP-based wild catching.
// Resolve the whole turn synchronously; dialogue callbacks never apply damage or items.
export function battleTurn(save:SaveData,b:Battle,action:BattleAction,random:()=>number=Math.random):TurnResult {
  if(b.result)return {pages:[]};
  let active=save.party[b.active],name=SPECIES[active.species].name;
  const enemyName=SPECIES[b.enemy.species].name,prefix=b.kind==='gym'?gymById(b.gymId).name+'의':'야생',pages:string[]=[],frames:BattleFrame[]=[];
  const show=(...lines:string[])=>{for(const line of lines){pages.push(line);frames.push(captureBattleFrame(save,b));}};
  if(action==='run'){b.betweenOpponents=false;b.result=true;return {pages:[b.kind==='gym'?'도전을 그만두었다.\n준비를 마치고 다시 도전하자!':'무사히 도망쳤다!'],outcome:'escaped'};}
  if(b.forcedSwitch&&!(typeof action==='object'&&'switch' in action))return rejectAction('다음에 싸울 포켓몬을\n먼저 선택하자.');
  if(typeof action==='object'&&'switch' in action){
    const index=action.switch,next=save.party[index];
    if(!Number.isInteger(index)||!next)return rejectAction('내보낼 포켓몬을 선택하자.');
    if(next.hp<=0)return rejectAction('쓰러진 포켓몬은 싸울 수 없다.\n다른 포켓몬을 선택하자.');
    if(index===b.active)return rejectAction('이미 싸우고 있는 포켓몬이다.');
    if(b.betweenOpponents){
      show(`${name}, 수고했어! 돌아와!`);b.active=index;b.betweenOpponents=false;b.participants=[index];
      show(`가랏! ${SPECIES[next.species].name}!`);return {pages,frames};
    }
    if(b.forcedSwitch){
      b.active=index;b.forcedSwitch=false;
      if(!b.participants.includes(index))b.participants.push(index);
      show(`가랏! ${SPECIES[next.species].name}!`);return {pages,frames};
    }
    show(`${name}, 수고했어! 돌아와!`);b.active=index;active=next;name=SPECIES[next.species].name;
    if(!b.participants.includes(index))b.participants.push(index);
    show(`가랏! ${name}!`);
  }else if(action==='ball') {
    if(b.kind==='gym')return rejectAction('다른 트레이너의 포켓몬은\n잡을 수 없다.');
    if(save.party.length>=6)return rejectAction('파티에 빈자리가 없다.\n다른 행동을 선택하자.');
    if(save.inventory.pokeBalls<=0)return rejectAction('몬스터볼이 없다. 길 안내원에게\n도구를 보충받을 수 있다.');
    b.betweenOpponents=false;save.inventory.pokeBalls--;
    show('몬스터볼을 던졌다!');frames[frames.length-1].capture='throw';
    if(b.enemy.hp<=b.enemy.maxHp/2||random()<.55){
      save.party.push({...b.enemy});b.result=true;
      show('좋아! 비버니를 잡았다!\n비버니가 파티에 등록되었다.');return {pages,frames,outcome:'caught'};
    }
    show('앗! 비버니가 빠져나왔다.');
  } else if(action==='potion'||typeof action==='object') {
    const index=action==='potion'?b.active:action.potion,target=save.party[index];
    if(!Number.isInteger(index)||!target)return rejectAction('회복할 포켓몬을 선택하자.');
    if(target.hp<=0)return rejectAction('쓰러진 포켓몬에게는 쓸 수 없다.\n센터에서 회복해 주자.');
    if(save.inventory.potions<=0)return rejectAction('상처약이 없다. 길 안내원에게\n도구를 보충받을 수 있다.');
    if(target.hp===target.maxHp)return rejectAction('아직 상처약을 쓸 필요가 없다.');
    b.betweenOpponents=false;save.inventory.potions--;const healed=Math.min(20,target.maxHp-target.hp);target.hp+=healed;
    show(`상처약을 사용했다!\n${SPECIES[target.species].name}의 HP가 ${healed} 회복되었다.`);
    if(index===b.active)frames[frames.length-1].effect={target:'player',kind:'heal',amount:healed};
  } else {
    b.betweenOpponents=false;
    b.moveSelections[b.active]=action==='move0'?0:1;
    const move=SPECIES[active.species].moves[action==='move0'?0:1];
    show(`${name}의 ${move}!`);
    if(action==='move0') {
      const damage=Math.min(b.enemy.hp,playerDamage(active,b));
      b.enemy.hp=Math.max(0,b.enemy.hp-damage);
      show(`${enemyName}에게 ${damage}의 피해를 주었다!`);
      frames[frames.length-1].effect={target:'enemy',kind:'damage',amount:damage};
      if(b.enemy.hp===0){
        show(`${prefix} ${enemyName}가 쓰러졌다!`);
        rewardParticipants(save,b,b.kind==='gym'?gymById(b.gymId).xp:b.enemy.level===7?60:b.enemy.level===10?80:30,(page,step,index)=>{
          show(page);frames[frames.length-1].growth={...step,index};
        });
        if(b.enemyIndex+1<b.opponents.length){b.enemy=b.opponents[++b.enemyIndex];b.enemyAttackDrop=0;b.enemyDefenseDrop=0;b.participants=[b.active];b.betweenOpponents=save.party.some((p,i)=>i!==b.active&&p.hp>0);show(`${gymById(b.gymId).name}는 ${SPECIES[b.enemy.species].name}를\n내보냈다!`);return {pages,frames};}
        b.result=true;show(b.kind==='gym'?`체육관 관장 ${gymById(b.gymId).name}에게 이겼다!`:'싸움에서 이겼다!');return {pages,frames,outcome:'won'};
      }
    } else if(move==='꼬리흔들기') {
      if(b.enemyDefenseDrop>=3)show(`${enemyName}의 방어는\n더 이상 떨어지지 않는다!`);
      else {b.enemyDefenseDrop++;show(`${enemyName}의 방어가 떨어졌다!`);}
    } else {
      if(b.enemyAttackDrop>=3)show(`${enemyName}의 공격은\n더 이상 떨어지지 않는다!`);
      else {b.enemyAttackDrop++;show(`${enemyName}의 공격이 떨어졌다!`);}
    }
  }
  show(`${prefix} ${enemyName}의 ${SPECIES[b.enemy.species].moves[0]}!`);
  const damage=Math.min(active.hp,enemyDamage(b));
  active.hp=Math.max(0,active.hp-damage);
  show(`${name}에게 ${damage}의 피해!`);
  frames[frames.length-1].effect={target:'player',kind:'damage',amount:damage};
  if(active.hp===0){
    show(`${name}는 쓰러졌다!`);
    const next=save.party.findIndex(p=>p.hp>0);
    if(next<0){b.result=true;return {pages,frames,outcome:'lost'};}
    if(save.party.filter(p=>p.hp>0).length>1){
      b.forcedSwitch=true;b.menu='party';b.selected=next;
      show('다음에 싸울 포켓몬을 선택하자!');return {pages,frames};
    }
    b.active=next;if(!b.participants.includes(next))b.participants.push(next);show(`힘내! ${SPECIES[save.party[next].species].name}!`);
  }
  return {pages,frames};
}
