import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import {battleTurn } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';

function ready(){const s=newSave();grantPokemon(s,7);s.map='route_s01';s.player={x:8,y:14,facing:'down'};s.flags.departureCleared=true;s.inventory={pokeBalls:0,potions:2};s.party.push({species:399,level:3,hp:3,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});return s;}
function dom(run:()=>void){const previous=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});try{run();}finally{if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document');}}
function finish(g:Engine){for(let i=0;i<40&&g.dialogue;i++)g.confirm();assert(!g.dialogue);}
function game(){const g=new Engine();g.exploring=false;g.save=ready();g.battle=createBattle(g.save);return g;}

test('invalid healing, switching and catching preserve the menu and cursor for a retry',()=>dom(()=>{
  const g=game(),b=g.battle!;
  for(const [menu,index] of [['heal',0],['party',0],['bag',0]] as const){
    b.menu=menu;b.selected=index;const before=structuredClone(g.save);g.selectBattle();assert(g.dialogue);g.selectBattle();assert.deepEqual(g.save,before);finish(g);
    assert.equal(b.menu,menu);assert.equal(b.selected,index);assert.deepEqual(g.save,before);
  }
  b.menu='heal';b.selected=0;g.selectBattle();finish(g);g.navigate('right');g.selectBattle();finish(g);
  assert.equal(g.save.party[1].hp,18);assert.equal(g.save.inventory.potions,1);assert.equal(g.save.party[0].hp,16);assert.equal(b.menu,'actions');
}));
test('cancelling submenus returns focus to the action that opened them without consuming a turn',()=>dom(()=>{
  const g=game(),b=g.battle!,before=structuredClone(g.save);
  for(const [menu,index] of [['moves',0],['bag',1],['party',2]] as const){b.menu=menu;b.selected=1;g.cancel();assert.equal(b.menu,'actions');assert.equal(b.selected,index);}
  b.menu='heal';b.selected=1;g.cancel();assert.equal(b.menu,'bag');assert.equal(b.selected,1);g.cancel();assert.equal(b.menu,'actions');assert.equal(b.selected,1);assert.deepEqual(g.save,before);
}));
test('last used move is remembered per Pokemon while browsing and cancelling do not overwrite it',()=>dom(()=>{
  const g=game(),b=g.battle!;g.save.party[1].hp=18;
  g.selectBattle();g.navigate('right');g.selectBattle();finish(g);assert.deepEqual(b.moveSelections,[1,0]);
  g.selectBattle();assert.equal(b.menu,'moves');assert.equal(b.selected,1);g.navigate('left');g.cancel();g.selectBattle();assert.equal(b.selected,1);g.cancel();
  g.actBattle({switch:1});finish(g);g.selectBattle();assert.equal(b.selected,0);g.cancel();
  g.actBattle({switch:0});finish(g);g.selectBattle();assert.equal(b.selected,1);
  const saved=parseSave(JSON.stringify(g.save));assert(saved);g.restore(saved);g.battle=createBattle(g.save);g.selectBattle();assert.equal(g.battle!.selected,0);
}));
test('failed capture and capped status moves still consume their normal turn and return to actions',()=>dom(()=>{
  const g=game(),b=g.battle!;g.save.inventory.pokeBalls=1;g.random=()=>.99;b.menu='bag';g.selectBattle();finish(g);
  assert.equal(b.menu,'actions');assert.equal(g.save.inventory.pokeBalls,0);assert.equal(g.save.party[0].hp,16);
  b.enemyDefenseDrop=3;b.menu='moves';b.selected=1;g.selectBattle();finish(g);
  assert.equal(b.menu,'actions');assert.equal(g.save.party[0].hp,12);assert.equal(b.moveSelections[0],1);
}));
test('the fainted active Pokemon is rejected accurately and forced replacement keeps its selection',()=>dom(()=>{
  const g=game();g.save.party.push({...g.save.party[1]});g.save.party[0].hp=1;g.battle=createBattle(g.save);g.actBattle('move0');finish(g);const b=g.battle!;
  b.selected=0;g.selectBattle();assert(g.dialogue!.pages.some(p=>p.includes('쓰러진 포켓몬')));finish(g);assert.equal(b.menu,'party');assert.equal(b.selected,0);assert(b.forcedSwitch);
  assert.equal(battleTurn(g.save,b,'potion').retry,true);
}));
