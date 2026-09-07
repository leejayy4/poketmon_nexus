import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { battleTurn,createBattle,experienceParticipants } from '../src/battle';
import { gridSelection } from '../src/menu-grid';
import { Engine } from '../src/engine';

function team(){const s=newSave();grantPokemon(s,7);s.map='route_s01';s.player={x:8,y:14,facing:'down'};s.flags.departureCleared=true;s.party.push({species:399,level:3,hp:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});return s;}
test('switch training shares experience once per participant and preserves level progress in saves',()=>{
  const s=team();s.party[1].experience=20;const b=createBattle(s)!;
  battleTurn(s,b,{switch:1});battleTurn(s,b,{switch:0});battleTurn(s,b,{switch:1});b.enemy.hp=1;
  assert.deepEqual(experienceParticipants(s,b),[0,1]);const t=battleTurn(s,b,'move0');
  assert.equal(t.outcome,'won');assert.equal(s.party[0].experience,15);assert.equal(s.party[1].level,4);assert.equal(s.party[1].experience,5);
  const after=structuredClone(s);battleTurn(s,b,'move0');assert.deepEqual(s,after);assert.deepEqual(parseSave(JSON.stringify(s))?.party,s.party);
});
test('only healthy participants earn experience; reserves, escapes and captures earn none',()=>{
  const s=team();s.party.push({...s.party[1]});const b=createBattle(s)!;s.party[0].hp=1;
  battleTurn(s,b,'move1');assert.equal(s.party[0].hp,0);assert(b.forcedSwitch);battleTurn(s,b,{switch:1});assert.equal(b.active,1);b.enemy.hp=1;
  battleTurn(s,b,'move0');assert.equal(s.party[0].experience,0);assert.equal(s.party[1].level,4);assert.equal(s.party[2].experience,0);
  for(const action of ['run','ball'] as const){const fresh=team();fresh.inventory.pokeBalls=1;const fight=createBattle(fresh)!;fight.enemy.hp=1;battleTurn(fresh,fight,action);assert(fresh.party.every(p=>p.experience===0));}
});
test('gym experience conserves its budget and participation resets for each opponent',()=>{
  const s=team();s.party.push({...s.party[1]});const b=createBattle(s,'gym')!;
  battleTurn(s,b,{switch:1});battleTurn(s,b,{switch:2});b.enemy.hp=1;battleTurn(s,b,'move0');
  assert.deepEqual(s.party.map(p=>p.experience),[17,17,16]);assert.deepEqual(b.participants,[2]);
  b.enemy.hp=1;battleTurn(s,b,'move0');assert.equal(s.party[0].experience,17);assert.equal(s.party[1].experience,17);assert.equal(s.party[2].level,4);assert.equal(s.party[2].experience,36);
});
test('two-column navigation follows rows and columns including odd and full parties',()=>{
  assert.equal(gridSelection(0,4,'down'),2);assert.equal(gridSelection(2,4,'right'),3);assert.equal(gridSelection(3,4,'up'),1);
  assert.equal(gridSelection(1,5,'up'),3);assert.equal(gridSelection(4,5,'right'),4);assert.equal(gridSelection(4,5,'down'),0);
  assert.equal(gridSelection(5,6,'up'),3);assert.equal(gridSelection(1,6,'up'),5);
  assert.equal(gridSelection(0,1,'down'),0);assert.equal(gridSelection(0,2,'down'),0);
  const g=new Engine();g.save=team();g.battle=createBattle(g.save);g.navigate('down');assert.equal(g.battle!.selected,2);
  g.battle=null;g.panel='party';g.save.party.push({...g.save.party[1]});g.navigate('down');assert.equal(g.partyIndex,2);
});
test('X on action selection never ends a battle while submenu cancellation remains free',()=>{
  for(const kind of ['wild','gym'] as const){const g=new Engine();g.save=team();g.battle=createBattle(g.save,kind);const before=structuredClone(g.save);
    g.cancel();assert(g.battle);assert.equal(g.battle.result,false);assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);
    for(const menu of ['moves','bag','party'] as const){g.battle.menu=menu;g.cancel();assert.equal(g.battle.menu,'actions');assert.deepEqual(g.save,before);}
  }
});
