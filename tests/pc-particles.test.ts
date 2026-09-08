import test from 'node:test';
import assert from 'node:assert/strict';
import {depositPokemon,withdrawPokemon} from '../src/journey-services';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';

test('PC deposit and withdrawal use the species final consonant while preserving the exact Pokemon and save rules',()=>{
  for(const [species,accusative,subject] of [[307,'요가랑을','요가랑이'],[77,'포니타를','포니타가']] as const){
    const s=newSave();grantPokemon(s,1);s.flags.departureCleared=true;const maxHp=maxHpAtLevel(species,18),p={species,level:18,hp:maxHp-3,maxHp,experience:17,nature:'성실',met:'연고–장막 연결도로'};s.party.push(p);const before=structuredClone(p);
    assert.match(depositPokemon(s,1),new RegExp(`^${accusative} 박스에 맡겼다`));assert.deepEqual(s.box[0],before);assert(parseSave(JSON.stringify(s)));
    assert.match(withdrawPokemon(s,0),new RegExp(`^${subject} 파티로 돌아왔다`));assert.deepEqual(s.party[1],before);assert.equal(s.box.length,0);assert(parseSave(JSON.stringify(s)));
  }
});
