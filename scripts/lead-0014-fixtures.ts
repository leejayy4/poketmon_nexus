import fs from 'node:fs';
import assert from 'node:assert/strict';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { canStand,getMap } from '../src/maps';
import type { SaveData } from '../src/types';

// Imported boundary fixtures are separate from the naturally played journey save.
const directory='tests/lead-0014-fixtures';
fs.mkdirSync(directory,{recursive:true});
function fixture(level:number):SaveData {
  const save=newSave();grantPokemon(save,4);
  const pokemon=save.party[0];pokemon.level=level;pokemon.hp=pokemon.maxHp=maxHpAtLevel(4,level);
  save.flags.departureCleared=true;save.map='oreburgh_gym';save.player={x:8,y:13,facing:'up'};
  save.inventory={pokeBalls:5,potions:3};save.money=100;save.healingPoint='tour_oreburgh_center';
  assert.deepEqual(pokemon.moves,['할퀴기','울음소리']);
  return save;
}
function write(name:string,save:SaveData){
  const raw=JSON.stringify(save,null,2),restored=parseSave(raw);assert(restored,name);
  assert(canStand(getMap(restored.map,restored.flags),restored.player.x,restored.player.y),name);
  assert.deepEqual(restored.party,save.party);assert.equal(restored.money,save.money);
  fs.writeFileSync(`${directory}/${name}.json`,raw+'\n');
  return restored;
}
write('four-moves-learning',fixture(16));
const defeat=fixture(5);defeat.party[0].hp=1;defeat.player={x:4,y:9,facing:'left'};
write('trainer-defeat',defeat);
const legacy=structuredClone(defeat);legacy.worldRevision=23;legacy.player={x:3,y:9,facing:'left'};
const migrated=write('revision23-npc-overlap',legacy);
assert.deepEqual(migrated.player,{x:8,y:13,facing:'down'});
const replacement=newSave();grantPokemon(replacement,7);
replacement.flags.departureCleared=true;replacement.map='oreburgh_gym';replacement.player={x:8,y:13,facing:'up'};
const turtle=replacement.party[0];turtle.level=13;turtle.hp=turtle.maxHp=maxHpAtLevel(7,13);
turtle.moves=['몸통박치기','꼬리흔들기','거품','껍질에숨기'];
write('four-moves-replacement',replacement);
console.log(`Validated 4 boundary fixtures in ${directory}`);
