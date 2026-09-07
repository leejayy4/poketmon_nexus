import test from 'node:test';
import assert from 'node:assert/strict';
import {starterPresentation} from '../src/starter-presentation';
import {Engine} from '../src/engine';
import {captureBattleFrame,battleTurn,type BattleFrame} from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import {grantPokemon} from '../src/pokemon';
import {newSave,parseSave} from '../src/save';
import {maxHpAtLevel} from '../src/growth';

function game(move='불꽃세례'){
  const g=new Engine();g.save=newSave();grantPokemon(g.save,4);
  g.save.party[0].moves=[move,'울음소리'];g.battle=createBattle(g.save);return g;
}
function frames(move:string,target:'enemy'|'player'){
  const g=game(move),before=captureBattleFrame(g.save,g.battle!);
  before.technique={move,target};before[target].hp=10;
  const after:BattleFrame=structuredClone(before);delete after.technique;
  after[target].hp=0;after.effect={target,kind:'damage',amount:10};return {before,after};
}
function dom(run:()=>void){
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
}

test('three declarations have exact preparation, contact and afterglow boundaries',()=>{
  for(const move of ['불꽃세례','물대포','덩굴채찍'])for(const target of ['enemy','player'] as const){
    const {before}=frames(move,target);
    for(const [time,phase,canAdvance] of [[0,'prepare',false],[.149,'prepare',false],[.15,'travel',false],[.649,'travel',false],[.65,'afterglow',false],[.899,'afterglow',false],[.9,'afterglow',true]] as const){
      const p=starterPresentation(before,null,time)!;assert.equal(p.phase,phase);assert.equal(p.canAdvance,canAdvance);assert.deepEqual(p.frame,before);
    }
  }
});

test('damage holds old HP then interpolates only display HP and keeps a knockout visible for the whole page',()=>{
  for(const target of ['enemy','player'] as const){
    const {before,after}=frames('물대포',target);
    const raw=structuredClone([before,after]);
    for(const [time,hp,phase,canAdvance] of [[0,10,'impact',false],[.149,10,'impact',false],[.15,10,'hp',false],[.4,5,'hp',false],[.65,0,'hp',true],[9,0,'hp',true]] as const){
      const p=starterPresentation(after,before,time)!;assert.equal(p.frame[target].hp,hp);assert.equal(p.phase,phase);assert.equal(p.canAdvance,canAdvance);
      assert.equal(p.keepEnemyVisible,target==='enemy');assert.equal(p.keepPlayerVisible,target==='player');
    }
    assert.deepEqual([before,after],raw);
    const faint=structuredClone(after);delete faint.effect;assert.equal(starterPresentation(faint,after,0),null);
  }
});

test('other moves, unrelated effects and invalid times cannot accidentally inherit presentation',()=>{
  const {before,after}=frames('물대포','enemy');
  assert.equal(starterPresentation(null,before,0),null);
  assert.equal(starterPresentation(after,null,0),null);
  for(const move of ['몸통박치기','화염방사','거품']){const f=structuredClone(before);f.technique!.move=move;assert.equal(starterPresentation(f,null,0),null);assert.equal(starterPresentation(after,f,0),null);}
  const heal=structuredClone(after);heal.effect!.kind='heal';assert.equal(starterPresentation(heal,before,0),null);
  const other=structuredClone(after);other.active++;assert.equal(starterPresentation(other,before,0),null);
  for(const time of [-1,NaN,Infinity])assert.equal(starterPresentation(before,null,time)!.canAdvance,false);
});

test('confirm, touch-confirm and X reveal text but cannot skip or queue the two waits',()=>dom(()=>{
  for(const input of [(g:Engine)=>g.press('z'),(g:Engine)=>g.confirm(),(g:Engine)=>g.press('x')])for(const speed of [36,80]){
    const g=game();g.textSpeed=speed;g.actBattle('move0');const raw=g.battleFrame;
    input(g);assert.equal(g.dialogue!.shown,g.dialogue!.pages[0].length);
    for(let i=0;i<10;i++)input(g);assert.equal(g.dialogue!.page,0);assert.equal(g.dialogueElapsed,0);
    for(let i=0;i<18;i++)g.update(.05);
    assert.equal(g.dialogue!.page,0);assert.equal(g.battleFrame,raw);
    input(g);assert.equal(g.dialogue!.page,1);assert.equal(g.dialogueElapsed,0);
    input(g);input(g);assert.equal(g.dialogue!.page,1);
    for(let i=0;i<13;i++)g.update(.05);
    assert.equal(g.dialogue!.page,1);input(g);assert.equal(g.dialogue!.page,2);
  }
}));

test('raw turn results, snapshot isolation and reload remain independent of presentation',()=>dom(()=>{
  const g=game('불꽃세례');g.save.party[0].level=7;g.save.party[0].maxHp=maxHpAtLevel(4,7);const expected=structuredClone(g.save),battle=structuredClone(g.battle!);
  battleTurn(expected,battle,'move0');g.actBattle('move0');assert.deepEqual(g.save.party,expected.party);
  const raw=g.battleFrame,snap=g.snapshot();snap.battlePresentation!.frame.enemy.hp=999;
  assert.notEqual(g.battlePresentation!.frame.enemy.hp,999);assert.equal(g.battleFrame,raw);
  const saved=parseSave(JSON.stringify(g.save))!;assert.ok(saved);assert.equal('battlePresentation' in saved,false);
  g.restore(saved);assert.equal(g.battlePresentation,null);assert.deepEqual(g.save.party,saved.party);
}));

test('ordinary techniques still advance without elapsed time and appended pages never reuse the last frame',()=>dom(()=>{
  const g=game('몸통박치기');g.actBattle('move0');assert.equal(g.battlePresentation,null);g.confirm();g.confirm();assert.equal(g.dialogue!.page,1);
  const h=game();h.actBattle('move0');h.dialogue!.pages.push('추가');h.dialogue!.page=h.battleFrames!.length;assert.equal(h.battlePresentation,null);
}));

test('X cannot execute a later reward choice while a selected technique is being presented',()=>dom(()=>{
  const g=game();g.actBattle('move0');let chosen=0;
  g.dialogue!.choices=[{label:'계속',action:()=>{chosen++;}}];
  g.cancel();g.cancel();assert.equal(chosen,0);assert.equal(g.dialogue!.page,0);
  g.dialogueElapsed=.9;g.cancel();assert.equal(chosen,0);assert.equal(g.dialogue!.page,1);
}));
