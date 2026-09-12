import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave, parseSave } from '../src/save';
import { grantPokemon, pokemonMoves } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { createBattle, battleTurn } from '../src/battle';
import type { Pokemon, SaveData } from '../src/types';

function forestPikachu(level=20):Pokemon {
  const maxHp=maxHpAtLevel(25,level);
  const pokemon:Pokemon={species:25,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'상록숲'};
  pokemon.moves=pokemonMoves(pokemon);return pokemon;
}
function ready(starter=4){
  const save=newSave();assert(grantPokemon(save,starter));save.flags.departureCleared=true;return save;
}
const reload=(save:SaveData)=>parseSave(JSON.stringify(save));

test('actual capture resolution preserves a forest Pikachu without setting the researcher gift flag',()=>{
  const save=ready();save.map='route_s01';save.player={x:29,y:12,facing:'left'};save.inventory.pokeBalls=2;
  const battle=createBattle(save,'wild','roark',()=>0)!;
  battle.enemy=forestPikachu();battle.enemy.hp=1;
  const flags=structuredClone(save.flags);
  assert.equal(battleTurn(save,battle,'ball').outcome,'caught');
  const restored=reload(save);assert(restored);
  assert.deepEqual(restored.party,save.party);assert.deepEqual(restored.flags,flags);
  assert(restored.pokedex!.caught.includes(25));assert.equal(restored.flags.pikachuReceived,undefined);
});

test('repeated forest catches in the party and box round-trip with a starter or gifted Pikachu',()=>{
  for(const starter of [4,25]){
    const save=ready(starter);save.party.push(forestPikachu(20),forestPikachu(24));save.box!.push(forestPikachu(22));
    const restored=reload(save);assert(restored);
    assert.deepEqual(restored.party,save.party);assert.deepEqual(restored.box,save.box);
    assert.equal(restored.flags.pikachuReceived,starter===25?true:undefined);
    assert(reload(restored));
  }
});

test('legacy researcher gift provenance, unique gift and flag consistency remain enforced',()=>{
  const gift=ready(25);assert(reload(gift));
  gift.party[0].met='기존 저장의 연구소';assert(reload(gift));
  const missingFlag=structuredClone(gift);delete missingFlag.flags.pikachuReceived;assert.equal(reload(missingFlag),null);
  const duplicate=structuredClone(gift);duplicate.box!.push(structuredClone(gift.party[0]));assert.equal(reload(duplicate),null);
  const noGift=ready();noGift.party.push(forestPikachu());noGift.flags.pikachuReceived=true;assert.equal(reload(noGift),null);
  const wrongSource=ready();wrongSource.party.push({...forestPikachu(),met:'미구현 서식지'});assert.equal(reload(wrongSource),null);
  const before=structuredClone(gift);assert.equal(grantPokemon(gift,25),false);assert.deepEqual(gift,before);
});

test('forest Pikachu cannot substitute for a departure gift or appear before departure clearance',()=>{
  for(const cleared of [false,true])for(const giftFlag of [false,true]){
    const save=newSave();save.party.push(forestPikachu());save.flags.departureCleared=cleared;save.flags.pikachuReceived=giftFlag;
    assert.equal(reload(save),null);
  }
  const beforeDeparture=ready();delete beforeDeparture.flags.departureCleared;beforeDeparture.box!.push(forestPikachu());
  assert.equal(reload(beforeDeparture),null);
});
