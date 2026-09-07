import type { Pokemon, SaveData } from './types';
import { SPECIES, pokemonMoves, pokemonSnapshot, MOVE_RULES, RUNTIME_SPECIES, BOX_CAPACITY, recordSeen, isDamagingMove } from './pokemon';
import DATA from './runtime-pokemon-data.json';
import { wildPokemon } from './runtime-encounters';
import { gainExperience, minimumLevel, type GrowthStep } from './growth';
import { gymTeam,gymById,type GymId } from './gyms';
import { withParticle } from './korean-text';

export interface TrainerBattleInfo {id:string;name:string;reward:number;team:Pokemon[]}
export interface Battle {
  kind:'wild'|'gym'|'trainer'; trainer?:TrainerBattleInfo; gymId:GymId; opponents:Pokemon[]; enemyIndex:number; enemy:Pokemon; active:number; menu:'actions'|'moves'|'bag'|'party'|'heal'|'between'; selected:number;
  enemyAttackDrop:number; enemyDefenseDrop:number; result:boolean;
  participants:number[];
  forcedSwitch:boolean;
  betweenOpponents:boolean;
  moveSelections:number[];
  turn?:number; playerDefense?:Record<number,number>; playerAttackDrop?:Record<number,number>; playerDefenseDrop?:Record<number,number>; enemyDefense?:number;
  playerRocks?:boolean; enemyRocks?:boolean; protectStreak?:number;
  caughtBeforeBattle?:boolean;
}
export function createBattle(save:SaveData,kind:'wild'|'gym'='wild',gymId:GymId='roark',random:()=>number=Math.random):Battle|null {
  const active=save.party.findIndex(p=>p.hp>0);
  if(active<0)return null;
  const wild=kind==='wild'?wildPokemon(save.map,random):null;
  if(kind==='wild'&&!wild)return null;
  const opponents=kind==='gym'?gymTeam(gymId):[wild!];
  const caughtBeforeBattle=kind==='wild'&&(
    save.pokedex?.caught.includes(opponents[0].species)===true||
    save.party.some(p=>p.species===opponents[0].species)||
    save.box?.some(p=>p.species===opponents[0].species)===true
  );
  if(kind==='gym')for(const p of opponents){p.moves=pokemonMoves(p);const tm=gymById(gymId).move;if(RUNTIME_SPECIES[p.species]?.tm.includes(tm))p.moves[1]=tm;}
  recordSeen(save,opponents[0].species);
  return {kind,gymId,opponents,enemyIndex:0,enemy:opponents[0],
    active,participants:[active],forcedSwitch:false,betweenOpponents:false,moveSelections:save.party.map(()=>0),menu:'actions',selected:0,enemyAttackDrop:0,enemyDefenseDrop:0,result:false,
    ...(kind==='wild'?{caughtBeforeBattle}:{})};
}
export function experienceParticipants(save:SaveData,b:Battle):number[]{
  return [...new Set(b.participants)].filter(i=>save.party[i]?.hp>0).sort((a,b)=>a-b);
}
export function createTrainerBattle(save:SaveData,trainer:TrainerBattleInfo):Battle|null{
  if(!trainer.team.length||trainer.team.some(p=>!SPECIES[p.species]||p.hp<=0)||!Number.isInteger(trainer.reward)||trainer.reward<0)return null;
  const active=save.party.findIndex(p=>p.hp>0);if(active<0)return null;
  const opponents=trainer.team.map(p=>({...p,moves:p.moves?[...p.moves]:pokemonMoves(p)}));
  recordSeen(save,opponents[0].species);
  return {kind:'trainer',trainer,gymId:'roark',opponents,enemy:opponents[0],enemyIndex:0,active,participants:[active],forcedSwitch:false,betweenOpponents:false,moveSelections:save.party.map(()=>0),menu:'actions',selected:0,enemyAttackDrop:0,enemyDefenseDrop:0,result:false};
}
export function opponentTrainerName(b:Battle){return b.kind==='trainer'?b.trainer!.name:gymById(b.gymId).name;}
function rockEntryDamage(p:Pokemon){
  const chart=DATA.typeChart as Record<string,Record<string,number>>;
  const scale=SPECIES[p.species].types.reduce((n,t)=>n*(chart['바위']?.[t]??1),1);
  return Math.min(p.hp,Math.max(1,Math.floor(p.maxHp*scale/8)));
}
export function switchEntryDamage(b:Battle,p:Pokemon){return b.playerRocks?rockEntryDamage(p):0;}
// Presentation and damage resolution share the generated source data.
export function moveType(move:string):string|undefined{return MOVE_RULES[move]?.type;}
export function moveEffectiveness(move:string,target:Pokemon):number{
  if(MOVE_RULES[move]?.rule==='struggle')return 1;
  const attacking=moveType(move);
  if(!attacking)return 1;
  const chart=DATA.typeChart as Record<string,Record<string,number>>;
  return SPECIES[target.species].types.reduce((total,type)=>total*(chart[attacking]?.[type]??1),1);
}
export function effectivenessText(effectiveness:number):string{
  return effectiveness===0?'효과가 없는 것 같다...':effectiveness>1?'효과가 굉장했다!':effectiveness<1?'효과가 별로인 듯하다...':'';
}
export function techniqueDamage(p:Pokemon,target:Pokemon,move:string,attackDrop=0,defenseDrop=0,defenseUp=0):number{
  const rule=MOVE_RULES[move];if(!rule||!isDamagingMove(move))return 0;
  const effectiveness=moveEffectiveness(move,target);if(effectiveness===0)return 0;
  if(rule.rule==='fixedDamage')return 40;
  if(rule.rule==='levelDamage')return p.level;
  const weight=(RUNTIME_SPECIES[target.species]?.weight??100)/10;
  const power=rule.rule==='weightDamage'?(weight<10?20:weight<25?40:weight<50?60:weight<100?80:weight<200?100:120):rule.power;
  const base=(p.species===25?7:p.species===399?4:6)+Math.floor((p.level-Math.min(5,minimumLevel(p.species)))/2)+([2,5,8].includes(p.species)?2:0);
  return Math.max(1,Math.floor(Math.max(1,base+defenseDrop-attackDrop-defenseUp)*power/40*effectiveness));
}
export function playerDamage(p:Pokemon,b:Battle,move=pokemonMoves(p)[0]):number{
  return techniqueDamage(p,b.enemy,move,b.playerAttackDrop?.[b.active]??0,b.enemyDefenseDrop,b.enemyDefense??0);
}
export function enemyMove(b:Battle,target?:Pokemon):string{
  const moves=pokemonMoves(b.enemy),turn=b.turn??0;
  if(b.kind!=='wild'&&turn===0&&!b.playerRocks&&moves.some(m=>MOVE_RULES[m]?.rule==='hazard'))return moves.find(m=>MOVE_RULES[m]?.rule==='hazard')!;
  return [...moves].sort((a,c)=>(target?techniqueDamage(b.enemy,target,c):Number(isDamagingMove(c)))-(target?techniqueDamage(b.enemy,target,a):Number(isDamagingMove(a))))[0];
}
export function enemyDamage(b:Battle,attackDrop=b.enemyAttackDrop,target?:Pokemon):number{
  const p=target??b.enemy;
  return techniqueDamage(b.enemy,p,enemyMove(b,target),attackDrop,b.playerDefenseDrop?.[b.active]??0,b.playerDefense?.[b.active]??0);
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
  technique?:{move:string;target:'player'|'enemy'};
}
export function captureBattleFrame(save:SaveData,b:Battle):BattleFrame {
  return {enemy:pokemonSnapshot(b.enemy),player:pokemonSnapshot(save.party[b.active]),enemyIndex:b.enemyIndex,active:b.active,enemyAttackDrop:b.enemyAttackDrop,enemyDefenseDrop:b.enemyDefenseDrop};
}
export interface TurnResult { pages:string[]; frames?:BattleFrame[]; outcome?:'won'|'caught'|'escaped'|'lost'; retry?:boolean; caughtInBox?:boolean; reward?:number }
function rejectAction(message:string):TurnResult{return {pages:[message],retry:true};}
// Small battle rules: level-based damage, two moves and HP-based wild catching.
// Resolve the whole turn synchronously; dialogue callbacks never apply damage or items.
export function battleTurn(save:SaveData,b:Battle,action:BattleAction,random:()=>number=Math.random):TurnResult {
  if(b.result)return {pages:[]};
  let active=save.party[b.active],name=SPECIES[active.species].name;
  const enemyName=SPECIES[b.enemy.species].name,prefix=b.kind!=='wild'?opponentTrainerName(b)+'의':'야생',pages:string[]=[],frames:BattleFrame[]=[];
  let protectedTurn=false;
  const show=(...lines:string[])=>{for(const line of lines){pages.push(line);frames.push(captureBattleFrame(save,b));}};
  const enter=():TurnResult|undefined=>{
    b.playerDefense??={};b.playerAttackDrop??={};b.playerDefenseDrop??={};b.playerDefense[b.active]=0;b.playerAttackDrop[b.active]=0;b.playerDefenseDrop[b.active]=0;b.protectStreak=0;
    if(!b.playerRocks)return;
    const p=save.party[b.active],hit=rockEntryDamage(p);p.hp-=hit;show(`뾰족한 바위가 ${withParticle(SPECIES[p.species].name,'을/를')} 찔렀다!`);frames.at(-1)!.effect={target:'player',kind:'damage',amount:hit};
    if(p.hp>0)return;
    show(`${withParticle(SPECIES[p.species].name,'은/는')} 쓰러졌다!`);const next=save.party.findIndex(p=>p.hp>0);
    if(next<0){b.result=true;return {pages,frames,outcome:'lost'};}
    b.forcedSwitch=true;b.menu='party';b.selected=next;return {pages,frames};
  };
  const finishEnemy=():TurnResult=>{
        show(`${prefix} ${withParticle(SPECIES[b.enemy.species].name,'이/가')} 쓰러졌다!`);
        if(!save.party.some(p=>p.hp>0)){b.result=true;show('싸울 수 있는 포켓몬이 없다!');return {pages,frames,outcome:'lost'};}
        rewardParticipants(save,b,b.kind==='gym'?gymById(b.gymId).xp:b.enemy.level*10,(page,step,index)=>{
          show(page);frames[frames.length-1].growth={...step,index};
          if(step.kind==='evolution')recordSeen(save,step.after.species,true);
        });
        if(b.enemyIndex+1<b.opponents.length){b.enemy=b.opponents[++b.enemyIndex];b.enemyAttackDrop=0;b.enemyDefenseDrop=0;b.enemyDefense=0;b.turn=0;b.participants=[b.active];b.betweenOpponents=save.party.some((p,i)=>i!==b.active&&p.hp>0);recordSeen(save,b.enemy.species);show(`${withParticle(opponentTrainerName(b),'은/는')} ${withParticle(SPECIES[b.enemy.species].name,'을/를')}\n내보냈다!`);if(b.enemyRocks){const hit=rockEntryDamage(b.enemy);b.enemy.hp-=hit;show('뾰족한 바위가 상대를 찔렀다!');frames.at(-1)!.effect={target:'enemy',kind:'damage',amount:hit};}if(active.hp===0){b.forcedSwitch=true;b.menu='party';b.selected=save.party.findIndex(p=>p.hp>0);}return b.enemy.hp===0?finishEnemy():{pages,frames};}
        b.result=true;const reward=b.kind==='trainer'?Math.min(b.trainer!.reward,999999-save.money):0;if(reward)save.money+=reward;
        show(b.kind==='gym'?`체육관 관장 ${opponentTrainerName(b)}에게 이겼다!`:b.kind==='trainer'?`${opponentTrainerName(b)}에게 이겼다!\n상금 ${reward}원을 받았다!`:'싸움에서 이겼다!');return {pages,frames,outcome:'won',...(reward?{reward}:{})};
  };
  const finishPlayer=():TurnResult=>{
    show(`${withParticle(name,'은/는')} 쓰러졌다!`);
    // Resolve a simultaneous knockout before replacing either combatant.
    if(b.enemy.hp===0)return finishEnemy();
    const next=save.party.findIndex(p=>p.hp>0);
    if(next<0){b.result=true;return {pages,frames,outcome:'lost'};}
    if(save.party.filter(p=>p.hp>0).length>1){
      b.forcedSwitch=true;b.menu='party';b.selected=next;
      show('다음에 싸울 포켓몬을 선택하자!');return {pages,frames};
    }
    b.active=next;if(!b.participants.includes(next))b.participants.push(next);
    show(`힘내! ${SPECIES[save.party[next].species].name}!`);
    return enter()??{pages,frames};
  };
  if(action==='run'){b.betweenOpponents=false;b.result=true;return {pages:[b.kind!=='wild'?'도전을 그만두었다.\n준비를 마치고 다시 도전하자!':'무사히 도망쳤다!'],outcome:'escaped'};}
  if(b.forcedSwitch&&!(typeof action==='object'&&'switch' in action))return rejectAction('다음에 싸울 포켓몬을\n먼저 선택하자.');
  if(typeof action==='object'&&'switch' in action){
    const index=action.switch,next=save.party[index];
    if(!Number.isInteger(index)||!next)return rejectAction('내보낼 포켓몬을 선택하자.');
    if(next.hp<=0)return rejectAction('쓰러진 포켓몬은 싸울 수 없다.\n다른 포켓몬을 선택하자.');
    if(index===b.active)return rejectAction('이미 싸우고 있는 포켓몬이다.');
    if(b.betweenOpponents&&!b.forcedSwitch){
      show(`${name}, 수고했어! 돌아와!`);b.active=index;b.betweenOpponents=false;b.participants=[index];
      show(`가랏! ${SPECIES[next.species].name}!`);return enter()??{pages,frames};
    }
    if(b.forcedSwitch){
      b.active=index;b.forcedSwitch=false;b.betweenOpponents=false;
      if(!b.participants.includes(index))b.participants.push(index);
      show(`가랏! ${SPECIES[next.species].name}!`);return enter()??{pages,frames};
    }
      show(`${name}, 수고했어! 돌아와!`);b.active=index;active=next;name=SPECIES[next.species].name;
    if(!b.participants.includes(index))b.participants.push(index);
    show(`가랏! ${name}!`);
    const entry=enter();if(entry)return entry;
  }else if(action==='ball') {
    if(b.kind!=='wild')return rejectAction('다른 트레이너의 포켓몬은\n잡을 수 없다.');
    if(save.party.length>=6&&(save.box?.length??0)>=BOX_CAPACITY)return rejectAction('파티와 PC 박스가 가득 찼다.\n다른 행동을 선택하자.');
    if(save.inventory.pokeBalls<=0)return rejectAction(`몬스터볼이 없다. ${save.badges.length?'마을 상점에서':'길 안내원에게'}\n도구를 보충받을 수 있다.`);
    b.betweenOpponents=false;b.protectStreak=0;save.inventory.pokeBalls--;
    show('몬스터볼을 던졌다!');frames[frames.length-1].capture='throw';
    if(b.enemy.hp<=b.enemy.maxHp/2||random()<.55){
      const caughtInBox=save.party.length>=6;save.box??=[];
      (caughtInBox?save.box:save.party).push({...b.enemy,moves:pokemonMoves(b.enemy)});b.result=true;recordSeen(save,b.enemy.species,true);
      show(`좋아! ${withParticle(enemyName,'을/를')} 잡았다!\n${withParticle(enemyName,'이/가')} ${caughtInBox?'PC 박스로 보내졌다.':'파티에 등록되었다.'}`);return {pages,frames,outcome:'caught',caughtInBox};
    }
    show(`앗! ${withParticle(enemyName,'이/가')} 빠져나왔다.`);
  } else if(action==='potion'||typeof action==='object') {
    const index=action==='potion'?b.active:action.potion,target=save.party[index];
    if(!Number.isInteger(index)||!target)return rejectAction('회복할 포켓몬을 선택하자.');
    if(target.hp<=0)return rejectAction('쓰러진 포켓몬에게는 쓸 수 없다.\n센터에서 회복해 주자.');
    if(save.inventory.potions<=0)return rejectAction(`상처약이 없다. ${save.badges.length?'마을 상점에서':'길 안내원에게'}\n도구를 보충받을 수 있다.`);
    if(target.hp===target.maxHp)return rejectAction('아직 상처약을 쓸 필요가 없다.');
    b.betweenOpponents=false;b.protectStreak=0;save.inventory.potions--;const healed=Math.min(20,target.maxHp-target.hp);target.hp+=healed;
    show(`상처약을 사용했다!\n${SPECIES[target.species].name}의 HP가 ${healed} 회복되었다.`);
    if(index===b.active)frames[frames.length-1].effect={target:'player',kind:'heal',amount:healed};
  } else {
    b.betweenOpponents=false;
    b.moveSelections[b.active]=action==='move0'?0:1;
    const move=pokemonMoves(active)[action==='move0'?0:1],rule=MOVE_RULES[move]?.rule;
    show(`${name}의 ${move}!`);
    frames[frames.length-1].technique={move,target:['defenseUp','protect','escape','nothing'].includes(rule??'')?'player':'enemy'};
    if(rule!=='protect')b.protectStreak=0;
    if(isDamagingMove(move)) {
      const damage=Math.min(b.enemy.hp,playerDamage(active,b,move));
      const effectiveness=moveEffectiveness(move,b.enemy);
      b.enemy.hp=Math.max(0,b.enemy.hp-damage);
      show(`${enemyName}에게 ${damage}의 피해를 주었다!`);
      frames[frames.length-1].effect={target:'enemy',kind:'damage',amount:damage};
      if(rule==='drain'&&damage>0){const heal=Math.min(active.maxHp-active.hp,Math.max(1,Math.floor(damage/2)));active.hp+=heal;if(heal){show(`${withParticle(name,'은/는')} HP를 ${heal} 흡수했다!`);frames.at(-1)!.effect={target:'player',kind:'heal',amount:heal};}}
      if(rule==='struggle'){const recoil=Math.min(active.hp,Math.max(1,Math.floor(active.maxHp/4)));active.hp-=recoil;show(`${withParticle(name,'은/는')} 반동으로 ${recoil} 피해를 입었다!`);frames.at(-1)!.effect={target:'player',kind:'damage',amount:recoil};}
      const effectivenessLine=effectivenessText(effectiveness);
      if(effectivenessLine)show(effectivenessLine);
      if(active.hp===0)return finishPlayer();
      if(b.enemy.hp===0)return finishEnemy();
    } else if(rule==='defenseDrop') {
      if(b.enemyDefenseDrop>=3)show(`${enemyName}의 방어는\n더 이상 떨어지지 않는다!`);
      else {b.enemyDefenseDrop++;show(`${enemyName}의 방어가 떨어졌다!`);}
    } else if(rule==='attackDrop') {
      if(b.enemyAttackDrop>=3)show(`${enemyName}의 공격은\n더 이상 떨어지지 않는다!`);
      else {b.enemyAttackDrop++;show(`${enemyName}의 공격이 떨어졌다!`);}
    } else if(rule==='defenseUp'){
      b.playerDefense??={};b.playerDefense[b.active]=Math.min(3,(b.playerDefense[b.active]??0)+1);show(`${name}의 방어가 올라갔다!`);
    } else if(rule==='protect'){
      protectedTurn=(b.protectStreak??0)===0||random()<1/3**b.protectStreak!;b.protectStreak=(b.protectStreak??0)+1;
      show(protectedTurn?`${withParticle(name,'은/는')} 방어 태세를 취했다!`:'하지만 잘되지 않았다!');
    } else if(rule==='hazard'){
      if(b.enemyRocks)show('이미 상대 주위에 바위가 떠 있다!');else {b.enemyRocks=true;show('상대 주위에 뾰족한 바위를 띄웠다!');}
    } else if(rule==='escape'&&b.kind==='wild'){
      b.result=true;show('순간이동으로 무사히 벗어났다!');return {pages,frames,outcome:'escaped'};
    } else {
      show('하지만 아무 일도 일어나지 않았다!');
    }
  }
  const foeMove=enemyMove(b,active),foeRule=MOVE_RULES[foeMove]?.rule;
  show(`${prefix} ${enemyName}의 ${foeMove}!`);frames.at(-1)!.technique={move:foeMove,target:'player'};
  const damage=protectedTurn?0:Math.min(active.hp,enemyDamage(b,b.enemyAttackDrop,active));b.turn=(b.turn??0)+1;
  active.hp=Math.max(0,active.hp-damage);
  if(foeRule==='hazard'){b.playerRocks=true;show('아군 주위에 뾰족한 바위가 떠 있다!');}
  else if(protectedTurn)show(`${withParticle(name,'은/는')} 공격을 막아냈다!`);
  else if(foeRule==='attackDrop'){b.playerAttackDrop??={};b.playerAttackDrop[b.active]=Math.min(3,(b.playerAttackDrop[b.active]??0)+1);show(`${name}의 공격이 떨어졌다!`);}
  else if(foeRule==='defenseDrop'){b.playerDefenseDrop??={};b.playerDefenseDrop[b.active]=Math.min(3,(b.playerDefenseDrop[b.active]??0)+1);show(`${name}의 방어가 떨어졌다!`);}
  else if(foeRule==='defenseUp'){b.enemyDefense=Math.min(3,(b.enemyDefense??0)+1);show(`${enemyName}의 방어가 올라갔다!`);}
  else show(`${name}에게 ${damage}의 피해!`);
  frames[frames.length-1].effect={target:'player',kind:'damage',amount:damage};
  if(foeRule==='drain'&&damage>0){const heal=Math.min(b.enemy.maxHp-b.enemy.hp,Math.max(1,Math.floor(damage/2)));b.enemy.hp+=heal;if(heal){show(`${withParticle(enemyName,'은/는')} HP를 ${heal} 흡수했다!`);frames.at(-1)!.effect={target:'enemy',kind:'heal',amount:heal};}}
  if(foeRule==='struggle'&&damage>0){const hit=Math.min(b.enemy.hp,Math.max(1,Math.floor(b.enemy.maxHp/4)));b.enemy.hp-=hit;show(`${withParticle(enemyName,'은/는')} 반동으로 ${hit} 피해를 입었다!`);frames.at(-1)!.effect={target:'enemy',kind:'damage',amount:hit};}
  if(active.hp===0)return finishPlayer();
  if(b.enemy.hp===0)return finishEnemy();
  return {pages,frames};
}
