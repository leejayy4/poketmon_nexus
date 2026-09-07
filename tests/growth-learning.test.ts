import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { createTrainerBattle } from '../src/battle';
import { createBattle } from './runtime-battle-fixture';
import { maxHpAtLevel } from '../src/growth';

function run(fn:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{fn();}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}}
function game(multiple=false){
  const g=new Engine();g.save=newSave();g.save.flags.departureCleared=true;grantPokemon(g.save,4);
  const p=g.save.party[0];p.level=6;p.hp=p.maxHp=maxHpAtLevel(4,6);p.experience=59;
  if(multiple)g.save.party.push({...p,moves:p.moves?[...p.moves]:undefined});
  g.persist=()=>true;return g;
}
function end(g:Engine){for(let i=0;i<200&&g.dialogue;i++){const d=g.dialogue;if(d.choices&&d.page===d.pages.length-1&&d.shown===d.pages[d.page].length)return;g.confirm();} }
function choose(g:Engine,label:string){end(g);const i=g.dialogue!.choices!.findIndex(c=>c.label===label);assert(i>=0,label);g.dialogue!.selected=i;g.confirm();}
function trainer(g:Engine,count=2){const p={...g.save.party[0],level:3,hp:1,maxHp:20};g.battle=createTrainerBattle(g.save,{id:'growth-test',name:'검토',reward:100,team:Array.from({length:count},()=>({...p}))});}

test('post-battle learning focuses the newly unlocked move on a later page without teaching it',()=>run(()=>{
  const g=game();const p=g.save.party[0];
  Object.assign(p,{species:7,level:12,experience:119,hp:maxHpAtLevel(7,12),maxHp:maxHpAtLevel(7,12),moves:['거품','꼬리흔들기']});
  trainer(g,1);g.actBattle('move0');choose(g,'기술 배우기');
  const before=structuredClone(g.save);choose(g,'꼬부기 · 기술 배우기');
  assert(g.dialogue!.pages[0].includes('2/2쪽'));
  assert.equal(g.dialogue!.choices![g.dialogue!.selected].label,'물대포');
  assert.deepEqual(g.save,before);g.cancel();assert.deepEqual(p.moves,['거품','꼬리흔들기']);
}));

test('early chained growth and multiple participants survive until final victory; existing school opens',()=>run(()=>{
  const g=game(true);trainer(g);g.battle!.participants=[0,1];g.actBattle('move0');end(g);
  assert.equal(g.dialogue,null);assert(g.battle);assert.equal(g.save.party[0].level,7);
  g.actBattle('move0');choose(g,'기술 배우기');assert.equal(g.battle,null);
  assert.equal(g.dialogue!.choices!.filter(c=>c.label.includes('기술 배우기')).length,2);
  choose(g,'파이리 · 기술 배우기');assert.equal(g.panel,'summary');assert.equal(g.dialogue!.speaker,'기술 배우기');
}));
test('gym growth preserves guide order, defaults to continue and grants rewards once',()=>run(()=>{
  const g=game();g.battle=createBattle(g.save,'gym');g.battle!.enemyIndex=2;g.battle!.enemy=g.battle!.opponents[2];g.battle!.enemy.hp=1;
  let writes=0;g.persist=()=>{writes++;return true;};g.actBattle('move0');end(g);
  assert.deepEqual(g.dialogue!.choices!.map(c=>c.label),['목표 안내','기술 배우기','계속 모험하기']);assert.equal(g.dialogue!.selected,2);
  const saved=structuredClone(g.save);g.actBattle('move0');choose(g,'기술 배우기');assert.equal(g.gymReward,null);assert.deepEqual(g.save,saved);assert.equal(writes,1);
}));
test('cancel keeps learned slots and rewards; restore invalidates victory and picker callbacks',()=>run(()=>{
  for(const picker of [false,true]){const g=game();trainer(g,1);g.actBattle('move0');end(g);if(picker)choose(g,'기술 배우기');
    const callback=g.dialogue!.choices![0].action,saved=structuredClone(g.save);g.restore(saved);callback();assert.equal(g.dialogue,null);assert.equal(g.panel,'field');
    trainer(g,1);g.save.party[0].experience=0;g.actBattle('move0');assert.equal(g.dialogue!.choices,undefined);
  }
  const g=game();trainer(g,1);g.actBattle('move0');end(g);const saved=structuredClone(g.save),callback=g.dialogue!.choices![0].action;g.cancel();callback();assert.equal(g.dialogue,null);assert.equal(g.battle,null);assert.deepEqual(g.save,saved);
}));
test('interrupted chain never offers learning in the next battle',()=>run(()=>{
  for(const lost of [false,true]){const g=game();trainer(g);g.actBattle('move0');end(g);
    if(lost){g.save.party[0].hp=1;g.battle!.enemy.hp=100;g.actBattle('move1');}else g.actBattle('run');end(g);
    assert.equal(g.battle,null);trainer(g,1);g.save.party[0].experience=0;g.actBattle('move0');assert.equal(g.dialogue!.choices,undefined);
  }
}));
test('no growth keeps old gym choices and ordinary victory dialogue; picker cancel invalidates callback',()=>run(()=>{
  const g=game();g.save.party[0].level=25;g.battle=createBattle(g.save,'gym');g.battle!.enemyIndex=2;g.battle!.enemy=g.battle!.opponents[2];g.battle!.enemy.hp=1;g.actBattle('move0');end(g);
  assert.deepEqual(g.dialogue!.choices!.map(c=>c.label),['목표 안내','계속 모험하기']);assert.equal(g.dialogue!.selected,1);g.cancel();
  trainer(g,1);g.actBattle('move0');assert.equal(g.dialogue!.choices,undefined);
  const h=game();trainer(h,1);h.actBattle('move0');choose(h,'기술 배우기');const callback=h.dialogue!.choices![0].action;h.cancel();callback();assert.equal(h.dialogue,null);assert.equal(h.panel,'field');
}));
