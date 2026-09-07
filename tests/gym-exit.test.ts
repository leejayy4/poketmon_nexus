import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {createBattle} from './runtime-battle-fixture';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.inventory={pokeBalls:3,potions:2};g.save.money=123;g.save.map='oreburgh_gym';g.save.player={x:8,y:5,facing:'up'};g.battle=createBattle(g.save,'gym');g.battle!.selected=3;return g}
function finish(g:Engine){for(let i=0;g.dialogue&&i<70;i++)g.confirm();assert.equal(g.dialogue,null)}
function choices(g:Engine){for(let i=0;i<20;i++){const d=g.dialogue!;if(d.page===d.pages.length-1&&d.shown>=d.pages[d.page].length)return;g.confirm()}assert.fail('choices missing')}
function renderer(g:Engine){const ctx=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement;return new Renderer(g,canvas,canvas)}

test('gym exit defaults to continuing and X restores the exact battle selection without cost',()=>dom(()=>{
  const g=game(),before=structuredClone({save:g.save,battle:g.battle});g.selectBattle();assert(g.confirmingBattleExit);assert.equal(g.dialogue!.selected,1);assert.deepEqual(g.dialogue!.choices!.map(c=>c.label),['도전을 중단한다','계속 싸운다']);assert.match(g.dialogue!.pages[0],/경험치와 현재 HP/);g.cancel();assert.equal(g.dialogue,null);assert.equal(g.confirmingBattleExit,false);assert.deepEqual({save:g.save,battle:g.battle},before);
  g.selectBattle();finish(g);assert.deepEqual({save:g.save,battle:g.battle},before);g.selectBattle();choices(g);g.navigate('up');g.cancel();assert.deepEqual({save:g.save,battle:g.battle},before,'X always continues even when stop is highlighted');
}));

test('confirmed stop retains earned XP, HP, tools and money and the next challenge starts at opponent one',()=>dom(()=>{
  const g=game(),b=g.battle!;b.enemy.hp=1;g.actBattle('move0');finish(g);assert.equal(b.enemyIndex,1);assert(g.save.party[0].level>5);const before=structuredClone(g.save);
  b.selected=3;g.selectBattle();choices(g);g.navigate('up');g.confirm();assert(b.result);assert.deepEqual(g.save,before);finish(g);assert.equal(g.battle,null);assert.deepEqual(g.save.badges,[]);assert.deepEqual(g.save.keyItems,[]);g.challengeGym('roark');finish(g);assert.equal(g.battle!.enemyIndex,0);assert.equal(g.battle!.enemy.hp,22);assert.deepEqual(g.save,before);
}));

test('touch exit protects forced replacement and cancellation preserves the chosen healthy Pokemon',()=>dom(()=>{
  const g=game();g.battle!.turn=1;g.save.party[0].hp=1;g.save.party.push({...g.save.party[0],species:399,level:3,hp:18,maxHp:18},{...g.save.party[0],species:399,level:3,hp:18,maxHp:18});g.actBattle('move1');finish(g);const b=g.battle!;assert(b.forcedSwitch);b.selected=2;const before=structuredClone({save:g.save,battle:b}),r=renderer(g);
  r.lower();r.click(128,179);assert(g.dialogue);choices(g);r.lower();r.click(128,164);assert.deepEqual({save:g.save,battle:b},before);assert.equal(g.dialogue,null);
  r.lower();r.click(128,179);choices(g);r.lower();r.click(128,135);assert(b.result);finish(g);assert.equal(g.battle,null);assert.deepEqual(g.save,before.save);
}));

test('repeated menu submissions and stale button callbacks cannot quit through the confirmation',()=>dom(()=>{
  const g=game(),r=renderer(g),before=structuredClone(g.save);r.lower();const hit=r.hits.find(h=>h.x===132&&h.y===101)!;hit.action();const d=g.dialogue;hit.action();g.selectBattle();g.requestBattleExit();assert.equal(g.dialogue,d);assert(!g.battle!.result);assert.deepEqual(g.save,before);finish(g);assert(g.battle);assert(!g.battle.result);
}));

test('wild escapes remain immediate and exit cannot interrupt an existing battle dialogue',()=>dom(()=>{
  const g=game();g.battle=createBattle(g.save);g.battle!.selected=3;const before=structuredClone(g.save);g.selectBattle();assert(g.battle!.result);assert.equal(g.dialogue!.choices,undefined);finish(g);assert.equal(g.battle,null);assert.deepEqual(g.save,before);
  g.battle=createBattle(g.save,'gym');g.actBattle('move1');const d=g.dialogue,b=structuredClone(g.battle),s=structuredClone(g.save);g.requestBattleExit();assert.equal(g.dialogue,d);assert.deepEqual(g.battle,b);assert.deepEqual(g.save,s);
}));

test('reloading at exit confirmation restores committed progress without a pending choice or reward',()=>dom(()=>{
  const g=game();g.save.party[0].experience=17;g.requestBattleExit();const saved=parseSave(JSON.stringify(g.save))!;assert(saved);g.restore(saved);assert.equal(g.confirmingBattleExit,false);assert.equal(g.battle,null);assert.equal(g.dialogue,null);assert.deepEqual(g.save.party,saved.party);assert.equal(g.save.money,123);assert.deepEqual(g.save.badges,[]);g.challengeGym('roark');finish(g);assert.equal(g.battle!.enemyIndex,0);
}));
