import test from 'node:test';
import assert from 'node:assert/strict';
import { battleTurn, createTrainerBattle, experienceParticipants } from '../src/battle';
import { LEVEL_CAP, maxHpAtLevel } from '../src/growth';
import { newSave, parseSave } from '../src/save';
import type { Pokemon } from '../src/types';
import { grantPokemon, pokemonMoves } from '../src/pokemon';

function pokemon(level:number,hp?:number):Pokemon {
  const maxHp=maxHpAtLevel(19,level);
  const p:Pokemon={species:19,level,hp:hp??maxHp,maxHp,experience:0,nature:'성실',met:'테스트'};
  p.moves=pokemonMoves(p);return p;
}
function setup(levels:number[],enemies=1){
  const save=newSave();save.party=levels.map(level=>pokemon(level));
  const battle=createTrainerBattle(save,{id:'training',name:'연습 상대',reward:0,team:Array.from({length:enemies},()=>pokemon(3,1))})!;
  return {save,battle};
}
test('switching to a capped partner awards all experience to the growing participant and preserves presentation/save',()=>{
  const {save,battle}=setup([10,LEVEL_CAP,8]);
  battleTurn(save,battle,{switch:1});
  assert.deepEqual(experienceParticipants(save,battle),[0]);
  const result=battleTurn(save,battle,'move0');
  assert.equal(result.outcome,'won');
  assert.deepEqual(save.party.map(p=>p.experience),[30,0,0]);
  const growth=result.frames!.filter(f=>f.growth);
  assert.equal(growth.length,1);assert.equal(growth[0].growth!.index,0);
  assert.equal(growth[0].growth!.amount,30);assert.equal(growth[0].active,1);
  grantPokemon(save,7);save.flags.departureCleared=true;
  assert.deepEqual(parseSave(JSON.stringify(save))!.party,save.party);
  assert.deepEqual(battleTurn(save,battle,'move0').pages,[]);
});
test('all capped participants finish normally without growth pages',()=>{
  const {save,battle}=setup([LEVEL_CAP]);
  assert.deepEqual(experienceParticipants(save,battle),[]);
  const result=battleTurn(save,battle,'move0');
  assert.equal(result.outcome,'won');assert(!result.frames!.some(f=>f.growth));
  assert.equal(save.party[0].experience,0);
});
test('capped, fainted, duplicate and reserve entries do not dilute eligible shares',()=>{
  const {save,battle}=setup([LEVEL_CAP,10,10,10,10,10]);
  save.party[4].hp=0;battle.participants=[3,2,1,0,1,4,99];
  assert.deepEqual(experienceParticipants(save,battle),[1,2,3]);
  battleTurn(save,battle,'move0');
  assert.deepEqual(save.party.map(p=>p.experience),[0,10,10,10,0,0]);
});
test('next opponent resets recipients even when the active battler is capped',()=>{
  const {save,battle}=setup([10,LEVEL_CAP],2);
  battleTurn(save,battle,{switch:1});battleTurn(save,battle,'move0');
  assert.equal(save.party[0].experience,30);
  assert.deepEqual(experienceParticipants(save,battle),[]);
  assert.equal(battleTurn(save,battle,'move0').outcome,'won');
  assert.equal(save.party[0].experience,30);
});
