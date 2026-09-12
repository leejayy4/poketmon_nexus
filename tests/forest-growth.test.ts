import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gainExperience, maxHpAtLevel } from '../src/growth';
import { availableMoves, teachMove, validPokemonMoves } from '../src/pokemon';
import { parseSave } from '../src/save';
import { battleTurn, createBattle } from '../src/battle';

const journey=()=>parseSave(readFileSync('tests/viridian-journey-final-save.json','utf8'))!;

test('late forest evolution preserves learned Bug Bite, HP damage, identity and save validity',()=>{
  for(const [from,to] of [[10,11],[13,14]]){
    const s=journey(),p=s.party[3];Object.assign(p,{species:from,level:20,experience:199,maxHp:maxHpAtLevel(from,20),hp:maxHpAtLevel(from,20)-10,moves:['벌레먹기']});
    const pages=gainExperience(p,1);
    assert.equal(p.species,to);assert.equal(p.level,21);assert.equal(p.maxHp-p.hp,10);
    assert.equal(p.met,'상록숲');assert(pages.some(page=>page.includes('진화했다')));
    assert(validPokemonMoves(p,s.keyItems));assert(availableMoves(p,s).includes('벌레먹기'));
    assert.deepEqual(parseSave(JSON.stringify(s))?.party[3],p);
  }
});

test('existing caught Kakuna recalls an attack and uses it in a battle turn without changing old save on load',()=>{
  const s=journey(),p=s.party[3],old=structuredClone(p);
  assert.deepEqual(p.moves,['발버둥','단단해지기']);
  assert.deepEqual(parseSave(JSON.stringify(s))?.party[3],old);
  assert(availableMoves(p,s).includes('독침'));
  assert(teachMove(s,3,'독침',0));assert.deepEqual(p.moves,['독침','단단해지기']);
  s.map='tour_viridian_forest';s.player={x:10,y:3,facing:'down'};
  const b=createBattle(s,'wild','roark',()=>0)!;b.active=3;
  const hp=b.enemy.hp;b.menu='moves';b.selected=0;
  battleTurn(s,b,'move0');assert(b.enemy.hp<hp);
  assert.deepEqual(parseSave(JSON.stringify(s))?.party[3].moves,p.moves);
});

test('cocoon evolution uses level seven and cannot add unregistered final stages',()=>{
  for(const [from,to] of [[10,11],[13,14]]){
    const p=journey().party[3];Object.assign(p,{species:from,level:6,experience:59,maxHp:maxHpAtLevel(from,6),hp:0,moves:['발버둥']});
    gainExperience(p,1);assert.equal(p.species,to);assert.equal(p.hp,0);
    gainExperience(p,10000);assert.equal(p.species,to);assert.equal(p.level,25);
  }
});
