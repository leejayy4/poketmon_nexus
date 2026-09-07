import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {createBattle} from './runtime-battle-fixture';
import {GYMS,type GymId} from '../src/gyms';
import {adventureGuide} from '../src/adventure-guide';
import {newSave,parseSave} from '../src/save';
import {grantPokemon,teachMove} from '../src/pokemon';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(id:GymId='roark'){
  const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='oreburgh_gym';g.save.player={x:8,y:5,facing:'up'};
  for(const gym of GYMS){if(gym.id===id)break;g.save.badges.push(gym.badge);g.save.keyItems.push(gym.tm);}
  if(id==='fantina'){g.save.party[0].level=16;g.save.party[0].hp=g.save.party[0].maxHp=53;teachMove(g.save,0,'물기',0);}g.battle=createBattle(g.save,'gym',id);g.battle!.enemyIndex=2;g.battle!.enemy=g.battle!.opponents[2];g.battle!.enemy.hp=1;return g;
}
function choices(g:Engine){for(let i=0;i<50;i++){const d=g.dialogue!;if(d.page===d.pages.length-1&&d.shown>=d.pages[d.page].length)return;g.confirm()}assert.fail('no choice')}
function renderer(g:Engine,upper:string[]=[],lower:string[]=[]){const ctx=(out:string[])=>new Proxy({}, {get:(_,key)=>key==='fillText'?(text:string)=>out.push(text):()=>{}}) as CanvasRenderingContext2D;return new Renderer(g,{getContext:()=>ctx(upper)} as HTMLCanvasElement,{getContext:()=>ctx(lower)} as HTMLCanvasElement)}

test('four gym rewards appear after the final knockout and are awarded once before display',()=>dom(()=>{
  for(const [i,gym] of GYMS.entries()){
    const g=game(gym.id),before=g.save.money;let saves=0;g.persist=()=>{saves++;return true};g.actBattle('move0');assert.equal(saves,1);assert.equal(g.showingGymReward,false);assert.equal(g.save.money,before+gym.team[2][1]*120);assert.equal(g.save.badges.length,i+1);assert.equal(g.save.keyItems.filter(x=>x===gym.tm).length,1);
    const awarded=structuredClone(g.save);g.actBattle('move0');while(g.dialogue!.page<g.gymReward!.page)g.confirm();assert(g.showingGymReward);choices(g);assert.equal(g.dialogue!.choices![g.dialogue!.selected].label,'계속 모험하기');g.confirm();assert.equal(g.battle,null);assert.equal(g.gymReward,null);assert.equal(g.fieldMap,false);assert.deepEqual(g.save,awarded);assert.equal(saves,1);
  }
}));

test('reward guidance follows the next gym, recovery and the existing fourth-badge objective',()=>dom(()=>{
  for(const variant of ['next','recover','fourth']){
    const g=game(variant==='fourth'?'maylene':'roark');if(variant==='recover')g.save.party.push({...g.save.party[0],hp:0});
    g.actBattle('move0');choices(g);const before=structuredClone(g.save);while(g.dialogue!.choices![g.dialogue!.selected].label!=='목표 안내')g.navigate('up');g.confirm();assert.equal(g.battle,null);assert(g.fieldMap);assert(g.followingObjective);assert.equal(adventureGuide(g.save)?.objective.id,variant==='next'?'gardenia':variant==='recover'?'recover':'observation');assert(g.tourNavigation);assert.deepEqual(g.save,before);
  }
}));

test('reward rendering shows earned resources, badge count and a working touch route button',()=>dom(()=>{
  const g=game();g.actBattle('move0');choices(g);const upper:string[]=[],lower:string[]=[],r=renderer(g,upper,lower);r.world();r.lower();assert(upper.includes('콜배지 획득'));assert(upper.includes('기술머신 · 스텔스록'));assert(upper.includes('상금 +1,440원 · 배지 1/4'));assert(!upper.includes('목표 안내'));assert(lower.includes('포리스트배지에 도전'));r.click(128,136);assert(g.fieldMap);assert(g.followingObjective);assert.equal(g.gymReward,null);
}));

test('X and touch continue close the scene while preserving rewards and party state',()=>dom(()=>{
  for(const touch of [false,true]){const g=game();g.actBattle('move0');choices(g);g.navigate('up');const before=structuredClone(g.save);if(touch){const r=renderer(g);r.lower();r.click(128,164)}else g.cancel();assert.equal(g.dialogue,null);assert.equal(g.battle,null);assert.equal(g.gymReward,null);assert.equal(g.fieldMap,false);assert.deepEqual(g.save,before);}
}));

test('capped money is reported as the actual gain including zero, and existing badges give no duplicate reward',()=>dom(()=>{
  for(const money of [999990,999999]){const g=game();g.save.money=money;g.actBattle('move0');assert.equal(g.save.money,999999);assert.equal(g.gymReward?.money,999999-money);assert(g.dialogue!.pages.at(-1)!.includes(`상금 ${999999-money}원`));}
  const g=game();g.save.badges.push(GYMS[0].badge);g.save.keyItems.push(GYMS[0].tm);const money=g.save.money;g.actBattle('move0');assert.equal(g.gymReward,null);assert.equal(g.dialogue!.choices,undefined);assert.equal(g.save.money,money);assert.equal(g.save.keyItems.length,1);
}));

test('reloading before or during reward display preserves prizes and invalidates pending actions',()=>dom(()=>{
  for(const show of [false,true]){const g=game();g.actBattle('move0');if(show)choices(g);const pending=g.dialogue!.choices![0].action,saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert(!('gymReward'in saved));g.restore(saved);assert.equal(g.gymReward,null);assert.equal(g.dialogue,null);assert.equal(g.battle,null);pending();assert.equal(g.fieldMap,false);assert.equal(g.save.badges.length,1);assert.equal(g.save.keyItems.filter(x=>x===GYMS[0].tm).length,1);assert.equal(g.save.money,saved.money);}
}));

test('wild victory, partial gym victory, defeat and exit never show a badge reward',()=>dom(()=>{
  for(const variant of ['wild','partial','lost','exit']){const g=game();if(variant==='wild')g.battle=createBattle(g.save);if(variant==='partial')g.battle=createBattle(g.save,'gym');if(variant==='lost'){g.save.party[0].hp=1;g.battle!.enemy.hp=g.battle!.enemy.maxHp;}else g.battle!.enemy.hp=1;g.actBattle(variant==='exit'?'run':variant==='lost'?'move1':'move0');assert.equal(g.gymReward,null);assert(!g.showingGymReward);assert.equal(g.save.badges.length,0);}
}));
