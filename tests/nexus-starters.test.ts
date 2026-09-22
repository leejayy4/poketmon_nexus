import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave } from '../src/save';
import { NEXUS_STARTERS, isNexusStarter, starterSpeciesFor, nexusStarterDefinition } from '../src/nexus-starters';
import { grantPokemon, pokemonMoves, availableMoves, teachMove, validPokemonMoves, SPECIES, STARTERS, MOVE_RULES } from '../src/pokemon';
import { OWNABLE_SPECIES, minimumLevel, maxHpAtLevel, gainExperience } from '../src/growth';
import { currentPp, maxPp, restorePp, spendPp } from '../src/move-pp';
import { RUNTIME_DATABASE } from '../src/data/runtime';

// Written during the QA pause; these scenarios remain unexecuted until QA resumes.
function nexusSave(){return {...newSave(),version:2 as const,campaign:'nexus' as const};}

test('NEXUS first partners use distinct ownable IDs and a legal typed attack at level five',()=>{
  assert.deepEqual(STARTERS,[7,4,1]);
  assert.deepEqual(NEXUS_STARTERS,[900001,900002,900003]);
  for(const id of NEXUS_STARTERS){
    const save=nexusSave();
    assert(grantPokemon(save,id));
    const partner=save.party[0],definition=RUNTIME_DATABASE.species.require(id);
    assert(OWNABLE_SPECIES.includes(id));
    assert(isNexusStarter(id));
    assert.equal(partner.level,5);
    assert.equal(minimumLevel(id),5);
    assert.equal(partner.hp,maxHpAtLevel(id,5));
    assert.equal(partner.met,'새잎마을 · 포켓몬 연구소');
    assert(validPokemonMoves(partner,save.keyItems));
    assert(pokemonMoves(partner).some(move=>MOVE_RULES[move].rule==='damage'&&SPECIES[id].types.includes(MOVE_RULES[move].type)));
    assert.equal(definition.learnsetVersion,'nexus-first-journey-v1');
    assert.equal(nexusStarterDefinition(id)?.designStatus,'provisional-project-design');
    assert.deepEqual(save.pokedex?.caught,[id]);
    assert.equal(RUNTIME_DATABASE.evolutionFrom(id,25),undefined);
    const snapshot=structuredClone(save);
    for(const other of NEXUS_STARTERS)assert.equal(grantPokemon(save,other),false);
    assert.deepEqual(save,snapshot,'revisiting the selection never changes the original partner');
  }
});

test('starter grant honors campaign and never reinterprets legacy partners',()=>{
  const legacy=newSave(),nexus=nexusSave();
  assert.deepEqual(starterSpeciesFor(legacy),STARTERS);
  assert.deepEqual(starterSpeciesFor(nexus),NEXUS_STARTERS);
  for(const id of NEXUS_STARTERS)assert.equal(grantPokemon(legacy,id),false);
  for(const id of [...STARTERS,25])assert.equal(grantPokemon(nexus,id),false);
  assert(grantPokemon(legacy,7));
  const legacyPartner=structuredClone(legacy.party[0]);
  legacy.version=2;legacy.campaign='legacy';
  assert.equal(grantPokemon(legacy,900001),false);
  assert.deepEqual(legacy.party[0],legacyPartner);
});

test('an already owned party or boxed Pokemon prevents a second NEXUS first partner',()=>{
  const source=newSave();assert(grantPokemon(source,7));
  for(const storage of ['party','box'] as const){
    const save=nexusSave();save[storage]=[structuredClone(source.party[0])];
    const before=structuredClone(save);
    assert.equal(grantPokemon(save,900002),false);
    assert.deepEqual(save,before);
  }
});

test('NEXUS moves share the pinned PP use and full-rest contracts',()=>{
  for(const id of NEXUS_STARTERS){
    const save=nexusSave();assert(grantPokemon(save,id));
    const partner=save.party[0],moves=pokemonMoves(partner),full=moves.map(maxPp);
    assert(full.every(pp=>pp>0));
    assert.deepEqual(currentPp(partner,moves),full);
    spendPp(partner,moves,0);
    assert.equal(currentPp(partner,moves)[0],full[0]-1);
    restorePp(partner,moves);
    assert.deepEqual(currentPp(partner,moves),full);
  }
});

test('the fire partner gains a supported rock-opponent option through ordinary growth and replacement',()=>{
  const save=nexusSave();assert(grantPokemon(save,900002));
  const partner=save.party[0];
  // 5->11 costs 50+60+70+80+90+100 under the retained project growth contract.
  gainExperience(partner,450);
  assert.equal(partner.level,11);
  assert.equal(partner.species,900002,'no unapproved evolution stage is invented');
  assert.equal(partner.maxHp,maxHpAtLevel(900002,11));
  assert(availableMoves(partner).includes('물기'));
  assert(availableMoves(partner).includes('전광석화'));
  assert(availableMoves(partner).includes('안다리걸기'));
  assert(teachMove(save,0,'안다리걸기',1));
  assert(validPokemonMoves(partner,save.keyItems));
  assert.equal(currentPp(partner,pokemonMoves(partner))[1],maxPp('안다리걸기'));
  assert.equal(MOVE_RULES['안다리걸기'].rule,'weightDamage');
});
