import test from 'node:test';
import assert from 'node:assert/strict';
import { battleTurn,enemyDamage} from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { leadPokemon,healFieldPokemon } from '../src/team';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { Engine } from '../src/engine';

function team(){const s=newSave();grantPokemon(s,7);s.map='route_s01';s.flags.departureCleared=true;s.party.push({species:399,hp:18,maxHp:18,level:3,experience:0,nature:'성실',met:'새잎 서쪽길'});s.inventory.potions=2;return s;}
function dom(fn:()=>void){const d=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{fn()}finally{if(d)Object.defineProperty(globalThis,'document',d);else Reflect.deleteProperty(globalThis,'document')}}
test('manual switching costs one enemy attack and keeps target debuffs, party order and items',()=>{
  for(const kind of ['wild','gym'] as const){const s=team(),b=createBattle(s,kind)!;b.enemyAttackDrop=1;b.enemyDefenseDrop=2;
    b.turn=1;const reply=enemyDamage({...b,active:1},b.enemyAttackDrop,s.party[1]);const before=structuredClone(s),enemy=b.enemy.hp;const turn=battleTurn(s,b,{switch:1});
    assert.equal(b.active,1);assert.equal(s.party[0].hp,before.party[0].hp);assert.equal(s.party[1].hp,18-reply);
    assert.equal(b.enemy.hp,enemy);assert.equal(b.enemyAttackDrop,1);assert.equal(b.enemyDefenseDrop,2);assert.deepEqual(s.inventory,before.inventory);
    assert.equal(turn.pages.filter(p=>p.includes('피해!')).length,1);assert(!turn.outcome);
  }
});
test('invalid, current and fainted switches spend no turn; a knocked out replacement falls back once',()=>{
  const s=team(),b=createBattle({...s,map:'route_s01'},'wild','roark',()=>0)!;s.party[1].hp=0;
  for(const index of [0,1,-1,8,1.5]){const old=structuredClone(s),oldBattle=structuredClone(b);assert(battleTurn(s,b,{switch:index}).pages.length);assert.deepEqual(s,old);assert.deepEqual(b,oldBattle);}
  s.party[1].hp=1;const t=battleTurn(s,b,{switch:1});assert.equal(s.party[1].hp,0);assert.equal(b.active,0);assert.equal(s.party[0].hp,20);assert(!t.outcome);
});
test('both healthy participants receive a share of victory experience after switching',()=>{
  const s=team(),b=createBattle({...s,map:'route_s01'},'wild','roark',()=>0)!;battleTurn(s,b,{switch:1});b.enemy.hp=1;
  const t=battleTurn(s,b,'move0');assert.equal(t.outcome,'won');assert.equal(s.party[1].experience,15);assert.equal(s.party[0].experience,15);
});
test('lead selection preserves all Pokemon data through saves and the next encounter uses that lead',()=>{
  const s=team();s.player={x:29,y:12,facing:'left'};s.party[1].experience=12;const captured=structuredClone(s.party[1]);
  leadPokemon(s,1);assert.deepEqual(s.party[0],captured);const saved=parseSave(JSON.stringify(s));assert(saved);assert.deepEqual(saved.party,s.party);
  assert.equal(createBattle(saved)!.active,0);assert.equal(createBattle(saved)!.enemy.species,399);
  const old=structuredClone(s);leadPokemon(s,0);leadPokemon(s,8);assert.deepEqual(s,old);s.party[1].hp=0;const fainted=structuredClone(s);leadPokemon(s,1);assert.deepEqual(s,fainted);
});
test('field potion heals at most 20, consumes exactly one, and does not revive or waste stock',()=>{
  const s=team();s.party[0].hp=3;healFieldPokemon(s,0);assert.equal(s.party[0].hp,20);assert.equal(s.inventory.potions,1);
  const full=structuredClone(s);healFieldPokemon(s,0);assert.deepEqual(s,full);s.party[1].hp=0;const fainted=structuredClone(s);healFieldPokemon(s,1);assert.deepEqual(s,fainted);
  s.inventory.potions=0;s.party[0].hp=1;const empty=structuredClone(s);healFieldPokemon(s,0);assert.deepEqual(s,empty);
});
test('battle menu cancellation spends no turn and summary actions cannot mutate during dialogue or battle',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=team();g.battle=createBattle({...g.save,map:'route_s01'},'wild','roark',()=>0);const initial=structuredClone(g.save);
  g.battle!.selected=2;g.selectBattle();assert.equal(g.battle!.menu,'party');g.cancel();assert.equal(g.battle!.menu,'actions');assert.deepEqual(g.save,initial);
  g.battle!.selected=1;g.selectBattle();assert.equal(g.battle!.menu,'bag');g.cancel();assert.equal(g.battle!.menu,'actions');assert.deepEqual(g.save,initial);
  g.panel='summary';g.partyIndex=1;g.manageParty(0);assert.deepEqual(g.save,initial);g.battle=null;
  g.manageParty(0);assert.equal(g.save.party[0].species,399);assert.equal(g.partyIndex,0);const done=structuredClone(g.save);g.manageParty(1);assert.deepEqual(g.save,done);
}));
