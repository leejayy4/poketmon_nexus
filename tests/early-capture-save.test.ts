import test from 'node:test';
import assert from 'node:assert/strict';
import { battleTurn, createBattle } from '../src/battle';
import { encounterPool } from '../src/runtime-encounters';
import { TOUR_SPAWNS } from '../src/explore-world';
import { gainExperience, maxHpAtLevel, minimumLevel, nextLevelXp } from '../src/growth';
import { grantPokemon, pokemonMoves, SPECIES } from '../src/pokemon';
import { currentPp, spendPp } from '../src/move-pp';
import { newNexusSave, newSave, parseSave } from '../src/save';
import { SaveSession } from '../src/save-session';
import type { SaveStorage } from '../src/save-library';
import { NEXUS_OPENING } from '../src/nexus-opening-state';

// Prepared during the QA pause. No browser storage or user save is accessed.
const ROUTES=['tour_sinnoh_route_201','tour_sinnoh_route_202'] as const;
type EarlyRoute=typeof ROUTES[number];
class MemoryStorage implements SaveStorage {
  readonly values=new Map<string,string>();
  getItem(key:string){return this.values.get(key)??null;}
  setItem(key:string,value:string){this.values.set(key,value);}
}
function journey(map:EarlyRoute){
  const save=newNexusSave();
  Object.assign(save.flags,{
    [NEXUS_OPENING.profile]:true,[NEXUS_OPENING.broadcast]:true,
    [NEXUS_OPENING.postcards]:true,[NEXUS_OPENING.reply]:1,
    [NEXUS_OPENING.outside]:true,departureCleared:true,
  });
  assert(grantPokemon(save,900001));
  save.map=map;save.player={...TOUR_SPAWNS[map],facing:'up'};
  save.inventory.pokeBalls=5;
  return save;
}
function encounterRolls(map:EarlyRoute,species:number,level:number){
  const pool=encounterPool(map)!;
  const slot=pool.slots.find(entry=>entry.speciesId===species)!;
  const preceding=pool.slots.slice(0,pool.slots.indexOf(slot)).reduce((sum,entry)=>sum+entry.weight,0);
  const total=pool.slots.reduce((sum,entry)=>sum+entry.weight,0);
  const levels=slot.levelChoices??Array.from({length:pool.levels[1]-pool.levels[0]+1},(_,i)=>pool.levels[0]+i);
  const rolls=[(preceding+slot.weight/2)/total,(levels.indexOf(level)+.5)/levels.length];
  return ()=>rolls.shift()??0;
}

for(const map of ROUTES){
  const pool=encounterPool(map)!;
  for(const slot of pool.slots){
    const levels=slot.levelChoices??Array.from({length:pool.levels[1]-pool.levels[0]+1},(_,i)=>pool.levels[0]+i);
    for(const level of levels)test(`${map}: Lv.${level} species ${slot.speciesId} capture remains reloadable in v2`,()=>{
      const save=journey(map),storage=new MemoryStorage(),key=`capture-${map}-${slot.speciesId}-${level}`;
      const original=JSON.stringify(save);storage.setItem(key,original);
      const session=new SaveSession(storage,key);assert(session.open());
      const battle=createBattle(save,'wild','roark',encounterRolls(map,slot.speciesId,level));assert(battle);
      assert.equal(battle.enemy.species,slot.speciesId);assert.equal(battle.enemy.level,level);
      const result=battleTurn(save,battle,'ball',()=>0);
      assert.equal(result.outcome,'caught');assert.equal(save.inventory.pokeBalls,4);
      const caught=save.party[1];assert.equal(caught.species,slot.speciesId);assert.equal(caught.level,level);
      assert(save.pokedex?.caught.includes(caught.species));
      const parsed=parseSave(JSON.stringify(save));assert(parsed);
      assert.equal(parsed.version,2);assert.equal(parsed.campaign,'nexus');assert.deepEqual(parsed.party,save.party);
      assert(session.persist(save));assert.equal(session.status.writable,true);
      assert.equal(storage.getItem(key),original,'the source save remains byte-for-byte intact');
      const reloaded=new SaveSession(storage,key).open();assert(reloaded);
      assert.deepEqual(reloaded.party,save.party);assert.equal(reloaded.inventory.pokeBalls,4);
      assert.equal(reloaded.flags.departureCleared,true);
    });
  }
}

test('Lv.2 Bidoof also survives capture into a full-party PC box',()=>{
  const save=journey('tour_sinnoh_route_201');
  const filler=createBattle(save,'wild','roark',encounterRolls('tour_sinnoh_route_201',396,2));assert(filler);
  for(let i=0;i<5;i++)save.party.push(structuredClone(filler.enemy));
  const battle=createBattle(save,'wild','roark',encounterRolls('tour_sinnoh_route_201',399,2));assert(battle);
  const result=battleTurn(save,battle,'ball',()=>0);
  assert.equal(result.outcome,'caught');assert.equal(result.caughtInBox,true);
  assert.equal(save.party.length,6);assert.equal(save.box?.[0].level,2);
  const parsed=parseSave(JSON.stringify(save));assert(parsed);
  assert.deepEqual(parsed.box,save.box);assert.equal(parsed.party[0].species,900001);
});

test('Bidoof grows across Lv.3 without changing historical HP or restoring spent PP',()=>{
  assert.equal(minimumLevel(399),2);assert.equal(maxHpAtLevel(399,2),15);
  const save=journey('tour_sinnoh_route_201');
  const battle=createBattle(save,'wild','roark',encounterRolls('tour_sinnoh_route_201',399,2));assert(battle);
  assert.equal(battleTurn(save,battle,'ball',()=>0).outcome,'caught');
  const partner=save.party[1],moves=pokemonMoves(partner);partner.hp-=4;spendPp(partner,moves,0);
  const pp=currentPp(partner,moves);
  gainExperience(partner,nextLevelXp(2));
  assert.equal(partner.level,3);assert.equal(partner.maxHp,18);assert.equal(partner.hp,14);
  assert.deepEqual(currentPp(partner,moves),pp);assert(parseSave(JSON.stringify(save)));
  for(let level=3;level<=25;level++)assert.equal(maxHpAtLevel(399,level),SPECIES[399].hp+(level-3)*3);
});

test('existing Lv.3 Bidoof and legacy first partner retain the v1 save contract',()=>{
  const save=newSave();assert(grantPokemon(save,7));save.flags.departureCleared=true;
  const early=journey('tour_sinnoh_route_201');
  const battle=createBattle(early,'wild','roark',encounterRolls('tour_sinnoh_route_201',399,3));assert(battle);
  save.party.push({...battle.enemy,hp:18,maxHp:18});
  const parsed=parseSave(JSON.stringify(save));assert(parsed);
  assert.equal(parsed.version,1);assert.equal(parsed.campaign,undefined);
  assert.deepEqual(parsed.party,save.party);
});
