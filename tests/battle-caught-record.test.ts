import test from 'node:test';
import assert from 'node:assert/strict';
import {battleTurn,createBattle,createTrainerBattle} from '../src/battle';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import type {Pokemon} from '../src/types';

function ready(){
  const save=newSave();
  grantPokemon(save,7);
  save.flags.departureCleared=true;
  save.map='route_s01';
  save.inventory={pokeBalls:5,potions:2};
  return save;
}

function wild(save=ready()){
  return {save,battle:createBattle(save,'wild','roark',()=>0)!};
}

function caught(species=399):Pokemon{
  return {species,level:3,hp:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'};
}

test('caught snapshot stays false when the species is only seen',()=>{
  const save=ready();save.pokedex={seen:[399],caught:[]};
  const {battle}=wild(save);
  assert.equal(battle.enemy.species,399);
  assert.equal(battle.caughtBeforeBattle,false);
  assert.deepEqual(save.pokedex,{seen:[399],caught:[]});
});

test('caught snapshot includes PC ownership and legacy party ownership',()=>{
  const boxed=ready();boxed.box=[caught()];
  assert.equal(wild(boxed).battle.caughtBeforeBattle,true);

  const legacy=ready();legacy.party.push(caught());
  delete legacy.pokedex;
  assert.equal(legacy.pokedex,undefined);
  assert.equal(wild(legacy).battle.caughtBeforeBattle,true);
});

test('caught dex records mark the wild battle as previously caught',()=>{
  const save=ready();save.pokedex={seen:[399],caught:[399]};
  assert.equal(wild(save).battle.caughtBeforeBattle,true);
});

test('trainer and gym battles do not expose a wild caught snapshot',()=>{
  const save=ready();
  const trainer=createTrainerBattle(save,{id:'test',name:'테스트 트레이너',reward:0,team:[caught()]})!;
  assert.equal(trainer.caughtBeforeBattle,undefined);
  const gym=createBattle(save,'gym');
  assert.equal(gym?.caughtBeforeBattle,undefined);
});

test('a new capture does not update the current battle snapshot, but the next battle sees it',()=>{
  const {save,battle}=wild();
  battle.enemy.hp=battle.enemy.maxHp/2;
  assert.equal(battle.caughtBeforeBattle,false);
  assert.equal(battleTurn(save,battle,'ball',()=>.99).outcome,'caught');
  assert.equal(battle.caughtBeforeBattle,false);
  assert(save.pokedex?.caught.includes(399));
  assert.equal(parseSnapshot(save),false);
  assert.equal(wild(save).battle.caughtBeforeBattle,true);
});

function parseSnapshot(save:ReturnType<typeof ready>){
  const parsed=JSON.parse(JSON.stringify(save)) as Record<string,unknown>;
  return 'caughtBeforeBattle' in parsed;
}
