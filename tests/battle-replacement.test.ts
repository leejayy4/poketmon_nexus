import test from 'node:test';
import assert from 'node:assert/strict';
import { createBattle,battleTurn } from '../src/battle';
import { battleHint } from '../src/battle-hints';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { Engine } from '../src/engine';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';s.player={x:8,y:14,facing:'down'};s.party[0].hp=1;s.inventory={pokeBalls:5,potions:2};for(let i=0;i<2;i++)s.party.push({species:399,level:3,hp:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});return s;}
function dom(run:()=>void){const previous=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});try{run();}finally{if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document');}}
function finish(g:Engine){for(let i=0;i<40&&g.dialogue;i++)g.confirm();assert(!g.dialogue);}

test('wild and gym fainting lets the player choose among healthy reserves without another attack',()=>{
  for(const kind of ['wild','gym'] as const){
    const s=ready(),b=createBattle(s,kind)!;battleTurn(s,b,'move1');
    assert(b.forcedSwitch);assert.equal(b.menu,'party');assert.equal(b.active,0);assert.equal(b.selected,1);assert.deepEqual(b.participants,[0]);
    b.selected=2;assert.equal(battleHint(s,b)[1],'추가 반격 없이 출전합니다');
    const before=structuredClone(s);battleTurn(s,b,{switch:2});assert.equal(b.active,2);assert(!b.forcedSwitch);assert.deepEqual(s,before);assert.deepEqual(b.participants,[0,2]);assert.equal(b.enemyDefenseDrop,1);
    b.enemy.hp=1;battleTurn(s,b,'move0');assert.equal(s.party[0].experience,0);assert.equal(s.party[1].experience,0);assert(s.party[2].experience>0||s.party[2].level>3);
  }
});
test('pending replacement blocks moves, items and invalid replacements but permits explicit escape',()=>{
  for(const kind of ['wild','gym'] as const){
    const s=ready(),b=createBattle(s,kind)!;battleTurn(s,b,'move0');
    for(const action of ['move0','move1','ball','potion',{potion:1},{switch:0},{switch:-1},{switch:1.5},{switch:8}] as const){const before=structuredClone({s,b});battleTurn(s,b,action);assert.deepEqual({s,b},before);}
    const before=structuredClone(s);assert.equal(battleTurn(s,b,'run').outcome,'escaped');assert.deepEqual(s,before);battleTurn(s,b,{switch:2});assert.deepEqual(s,before);
  }
});
test('one healthy reserve still enters automatically and a total defeat still ends the battle',()=>{
  const s=ready();s.party[2].hp=0;const b=createBattle(s)!;battleTurn(s,b,'move0');assert.equal(b.active,1);assert(!b.forcedSwitch);assert.equal(s.party[1].hp,18);
  s.party[1].hp=1;assert.equal(battleTurn(s,b,'move1').outcome,'lost');assert(b.result);assert(!b.forcedSwitch);
});
test('healing or manually switching before fainting leads to the same free replacement choice',()=>{
  const s=ready(),b=createBattle(s)!;s.party[1].hp=2;battleTurn(s,b,{potion:1});assert.equal(s.party[1].hp,18);assert(b.forcedSwitch);assert.equal(s.inventory.potions,1);
  battleTurn(s,b,{switch:2});assert.equal(s.party[2].hp,18);assert.equal(b.active,2);
  const t=ready();t.party[0].hp=20;t.party[1].hp=1;const fight=createBattle(t)!;battleTurn(t,fight,{switch:1});assert(fight.forcedSwitch);assert.equal(fight.active,1);battleTurn(t,fight,{switch:2});assert.equal(t.party[2].hp,18);
});
test('Engine opens replacement after dialogue, prevents cancellation bypass and safely restores saves',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=ready();while(g.save.party.length<6)g.save.party.push({...g.save.party[1]});g.battle=createBattle(g.save);
  g.actBattle('move0');const b=g.battle!;assert(b.forcedSwitch);assert.equal(b.menu,'party');const before=structuredClone(g.save);
  g.selectBattle();assert.deepEqual(g.save,before);finish(g);g.cancel();assert.equal(b.menu,'party');assert(b.forcedSwitch);
  g.navigate('down');g.navigate('down');assert.equal(b.selected,5);g.selectBattle();assert.equal(b.active,5);assert(!b.forcedSwitch);assert.equal(b.menu,'actions');assert.deepEqual(g.save,before);finish(g);
  const waiting=new Engine();waiting.exploring=false;waiting.save=ready();waiting.battle=createBattle(waiting.save);waiting.actBattle('move0');
  const saved=parseSave(JSON.stringify(waiting.save));assert(saved);waiting.restore(saved);assert.equal(waiting.battle,null);assert.equal(waiting.save.party[0].hp,0);assert.equal(createBattle(waiting.save)!.active,1);
}));
