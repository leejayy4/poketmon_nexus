import test from 'node:test';
import assert from 'node:assert/strict';
import {growthPreview} from '../src/growth-preview';
import {newSave} from '../src/save';
import {grantPokemon, RUNTIME_SPECIES} from '../src/pokemon';
import {gainExperience, maxHpAtLevel, minimumLevel, LEVEL_CAP} from '../src/growth';
function mon(species:number,level:number){const s=newSave();grantPokemon(s,species);return {...s.party[0],species,level,experience:0,hp:maxHpAtLevel(species,level),maxHp:maxHpAtLevel(species,level)};}
test('starter previews anticipate actual next technique and change after leveling',()=>{
 const p=mon(4,6),before=structuredClone(p);assert.equal(growthPreview(p),'다음 기술 Lv.7 · 불꽃세례');assert.deepEqual(p,before);
 const pages=gainExperience(p,60);assert(pages.some(t=>t.includes('불꽃세례')));assert.equal(growthPreview(p),'다음 진화 Lv.16 · 리자드');
 assert.equal(growthPreview(mon(1,8)),'다음 기술 Lv.9 · 덩굴채찍');assert.equal(growthPreview(mon(7,6)),'다음 기술 Lv.7 · 거품');
});
test('same-level evolution takes precedence and preview follows evolved learnset',()=>{
 const p=mon(4,15);assert.equal(growthPreview(p),'다음 진화 Lv.16 · 리자드');gainExperience(p,150);assert.equal(p.species,5);assert.equal(growthPreview(p),'다음 기술 Lv.17 · 용의분노');
});
test('unimplemented evolutions and levels above the cap are never promised',()=>{
 assert.doesNotMatch(growthPreview(mon(63,15)),/진화|Lv\./);assert.doesNotMatch(growthPreview(mon(25,24)),/진화|Lv\./);assert.doesNotMatch(growthPreview(mon(7,25)),/다음 기술|진화/);
});
test('all current species and levels produce compact immutable labels',()=>{
 for(const id of Object.keys(RUNTIME_SPECIES).map(Number))for(let level=minimumLevel(id);level<=LEVEL_CAP;level++){
 const p=mon(id,level),before=structuredClone(p),label=growthPreview(p);assert(label.length<=26,`${id}/${level}: ${label}`);assert(!label.includes('\n'));assert.deepEqual(p,before);
 }
});

test('legacy unevolved starters preview the next level that actually triggers evolution',()=>{
 const p=mon(4,18);assert.equal(growthPreview(p),'다음 진화 Lv.19 · 리자드');gainExperience(p,180);assert.equal(p.species,5);assert.equal(p.level,19);
});
