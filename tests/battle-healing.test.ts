import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import {battleTurn,enemyDamage } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { battleHint } from '../src/battle-hints';

function ready(){
  const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';s.player={x:8,y:14,facing:'down'};s.inventory.potions=3;
  s.party.push({species:399,level:3,hp:2,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});return s;
}
function dom(run:()=>void){const previous=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});try{run();}finally{if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document');}}

test('reserve healing consumes one potion while only the active Pokemon takes retaliation',()=>{
  for(const kind of ['wild','gym'] as const){
    const s=ready(),b=createBattle(s,kind)!;b.enemyAttackDrop=1;b.enemyDefenseDrop=2;
    b.turn=1;const reply=enemyDamage(b,b.enemyAttackDrop,s.party[0]);const result=battleTurn(s,b,{potion:1});
    assert.equal(s.party[1].hp,18);assert.equal(s.party[0].hp,20-reply);assert.equal(s.inventory.potions,2);
    assert.equal(b.active,0);assert.deepEqual(b.participants,[0]);assert.equal(b.enemyDefenseDrop,2);assert.equal(result.outcome,undefined);
    assert(result.pages.some(p=>p.includes('비버니의 HP가 16 회복')));assert.deepEqual(parseSave(JSON.stringify(s))?.party,s.party);
    b.enemy.hp=1;battleTurn(s,b,'move0');assert.equal(s.party[1].experience,0);
  }
});
test('invalid, full, fainted and out-of-stock healing changes neither battle nor save',()=>{
  for(const index of [-1,1.5,6,NaN]){
    const s=ready(),b=createBattle(s)!;const before=structuredClone({s,b});battleTurn(s,b,{potion:index});assert.deepEqual({s,b},before);
  }
  for(const mode of ['full','fainted','empty']){
    const s=ready(),b=createBattle(s)!;if(mode==='empty')s.inventory.potions=0;else s.party[1].hp=mode==='full'?18:0;
    const before=structuredClone({s,b});battleTurn(s,b,{potion:1});assert.deepEqual({s,b},before);
  }
});
test('active-target healing is compatible and heals at most 20 before retaliation',()=>{
  for(const action of ['potion',{potion:0}] as const){
    const s=ready();s.party[0].level=15;s.party[0].maxHp=50;s.party[0].hp=1;const b=createBattle(s)!;
    battleTurn(s,b,action);assert.equal(s.party[0].hp,17);assert.equal(s.inventory.potions,2);assert.equal(s.party[1].hp,2);
  }
});
test('reserve is healed before a fatal retaliation and can then replace the active Pokemon',()=>{
  const s=ready(),b=createBattle(s)!;s.party[0].hp=1;b.menu='heal';b.selected=1;
  assert.match(battleHint(s,b)[1],/꼬부기: 반격 후 기절/);
  battleTurn(s,b,{potion:1});assert.equal(s.party[0].hp,0);assert.equal(s.party[1].hp,18);assert.equal(b.active,1);assert.deepEqual(b.participants,[0,1]);
});
test('bag opens target selection without spending a turn and cancellation returns through bag',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=ready();g.battle=createBattle(g.save);const b=g.battle!;
  while(g.save.party.length<6)g.save.party.push({...g.save.party[1]});
  const before=structuredClone(g.save);b.menu='bag';b.selected=1;g.selectBattle();assert.equal(b.menu,'heal');assert.equal(b.selected,0);
  g.navigate('down');g.navigate('down');g.navigate('right');assert.equal(b.selected,5);assert.deepEqual(g.save,before);
  assert.match(battleHint(g.save,b)[0],/비버니 HP 2 → 18/);assert.match(battleHint(g.save,b)[1],/꼬부기: 반격 후 HP 16\/20/);
  g.cancel();assert.equal(b.menu,'bag');assert.equal(b.selected,1);g.cancel();assert.equal(b.menu,'actions');assert.deepEqual(g.save,before);
  b.menu='bag';b.selected=1;g.selectBattle();g.navigate('right');g.selectBattle();assert.equal(g.save.party[1].hp,18);assert.equal(g.save.inventory.potions,2);
  g.selectBattle();assert.equal(g.save.inventory.potions,2); // dialogue blocks a second submission
}));
