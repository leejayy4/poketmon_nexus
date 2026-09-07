import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { createBattle } from '../src/battle';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { fieldPotionPreview } from '../src/team';

function dom(run:()=>void){
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});
  try{run();}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
}
function ready(){
  const g=new Engine();g.exploring=false;g.save=newSave();grantPokemon(g.save,7);
  g.save.flags.departureCleared=true;
  for(let i=1;i<6;i++)g.save.party.push({species:399,level:3,experience:0,hp:i===2?0:i===1?3:18,maxHp:18,nature:'성실',met:'새잎 서쪽길'});
  g.save.inventory.potions=2;g.selectMenu(1);return g;
}
function finish(g:Engine){for(let i=0;i<20&&g.dialogue;i++)g.confirm();assert(!g.dialogue);}

test('field bag opens injured target and cancels to potion then bag menu without spending inventory or steps',()=>dom(()=>{
  const g=ready(),before=structuredClone(g.save);assert.equal(g.bagIndex,1);g.confirm();
  assert.equal(g.panel,'fieldHeal');assert.equal(g.partyIndex,1);
  g.navigate('down');assert.equal(g.partyIndex,3);g.navigate('down');assert.equal(g.partyIndex,5);
  g.cancel();assert.equal(g.panel,'bag');assert.equal(g.bagIndex,1);g.cancel();assert.equal(g.panel,'menu');
  assert.deepEqual(g.save,before);
}));

test('bag healing agrees with preview, keeps target list and party order, and blocks double activation',()=>dom(()=>{
  const g=ready();g.confirm();const original=structuredClone(g.save);
  assert.deepEqual(fieldPotionPreview(g.save,1),['HP 3 → 18 / 18','상처약 1개 사용 · 15 회복']);
  assert.deepEqual(g.save,original);g.confirm();assert.equal(g.save.party[1].hp,18);assert.equal(g.save.inventory.potions,1);
  g.useFieldPotion(5);assert.equal(g.save.inventory.potions,1);finish(g);
  assert.equal(g.panel,'fieldHeal');assert.equal(g.partyIndex,1);
  assert.deepEqual(g.save.party.map(p=>p.species),original.party.map(p=>p.species));
  assert.equal(g.save.party[0].hp,original.party[0].hp);assert.equal(g.save.steps,original.steps);
  const loaded=parseSave(JSON.stringify(g.save));assert(loaded);g.restore(loaded);
  assert.equal(g.panel,'field');assert.equal(g.bagIndex,1);assert.equal(g.save.party[1].hp,18);assert.equal(g.save.inventory.potions,1);
}));

test('full, fainted, invalid and exhausted targets stay on the same list without consuming medicine',()=>dom(()=>{
  const g=ready();g.confirm();
  for(const index of [0,2,-1,1.5,6]){
    const before=structuredClone(g.save);g.useFieldPotion(index);finish(g);assert.deepEqual(g.save,before);assert.equal(g.panel,'fieldHeal');
  }
  g.save.inventory.potions=0;const before=structuredClone(g.save);g.useFieldPotion(1);finish(g);
  assert.deepEqual(g.save,before);assert.match(fieldPotionPreview(g.save,1).join(' '),/상처약이 없어요/);
  g.cancel();g.confirm();finish(g);assert.equal(g.panel,'bag');
}));

test('field balls explain battle use and empty party cannot enter target selection',()=>dom(()=>{
  const g=ready();g.save.inventory.pokeBalls=1;const before=structuredClone(g.save);g.navigate('left');assert.equal(g.bagIndex,0);g.confirm();
  assert.match(g.dialogue!.pages[0],/야생 포켓몬/);finish(g);assert.equal(g.panel,'bag');assert.deepEqual(g.save,before);
  g.save.party=[];g.selectFieldItem(1);finish(g);assert.equal(g.panel,'bag');
  assert.deepEqual(g.save.inventory,before.inventory);
}));

test('field item handlers cannot bypass battle, dialogue, movement or transition locks',()=>dom(()=>{
  const g=ready();g.save.party[0].hp=1;g.confirm();const before=structuredClone(g.save);
  g.battle=createBattle({...structuredClone(g.save),map:'route_s01'},'wild','roark',()=>0);g.useFieldPotion(0);assert.deepEqual(g.save,before);g.battle=null;
  g.say('검사',['대화 중']);g.useFieldPotion(0);assert.deepEqual(g.save,before);finish(g);
  g.move={from:{x:1,y:1},to:{x:2,y:1},elapsed:0,duration:.16};g.useFieldPotion(0);assert.deepEqual(g.save,before);g.move=null;
  g.transition=.4;g.useFieldPotion(0);assert.deepEqual(g.save,before);g.transition=0;
  g.panel='bag';g.battle=createBattle({...structuredClone(g.save),map:'route_s01'},'wild','roark',()=>0);g.selectFieldItem(1);assert.equal(g.panel,'bag');assert.deepEqual(g.save,before);
}));
