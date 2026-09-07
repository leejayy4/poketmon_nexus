import test from 'node:test';
import assert from 'node:assert/strict';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {gainExperience,maxHpAtLevel} from '../src/growth';

test('growth names use consonant particles and preserve experience',()=>{
  const s=newSave();grantPokemon(s,7);const p=s.party[0];
  Object.assign(p,{species:74,level:9,hp:46,maxHp:46,experience:0,moves:['몸통박치기','웅크리기']});
  assert.deepEqual(gainExperience(p,1),['꼬마돌은 경험치를\n1 얻었다!']);
  assert.equal(p.experience,1);assert.equal(p.hp,46);
});

test('first evolution and move messages contain resolved particles without changing milestones',()=>{
  const s=newSave();grantPokemon(s,4);const p=s.party[0];
  Object.assign(p,{level:15,experience:149,hp:maxHpAtLevel(4,15),maxHp:maxHpAtLevel(4,15)});
  const pages=gainExperience(p,1);
  assert(pages.includes('파이리의 레벨이\n올랐다! Lv.16'));
  assert(pages.includes('파이리는\n리자드로 진화했다!'));
  assert.equal(p.species,5);assert.equal(p.level,16);assert.equal(p.experience,0);
  const b=newSave();grantPokemon(b,1);Object.assign(b.party[0],{level:8,experience:79,hp:maxHpAtLevel(1,8),maxHp:maxHpAtLevel(1,8)});
  assert(gainExperience(b.party[0],1).some(x=>x.includes('이상해씨는 덩굴채찍을\n배울 수 있다!')));
});
