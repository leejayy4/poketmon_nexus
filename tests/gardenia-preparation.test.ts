import test from 'node:test';
import assert from 'node:assert/strict';
import {gardeniaPreparationPages} from '../src/gardenia-preparation';
import {sinnohEvent} from '../src/sinnoh-story';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {GYMS,gymChallengeBlock} from '../src/gyms';
import type {Engine} from '../src/engine';

function fixture(species=1,level=10){const save=newSave();grantPokemon(save,species);save.flags.departureCleared=true;save.badges=[GYMS[0].badge];save.keyItems=[GYMS[0].tm];save.map='eterna_gym';const p=save.party[0];p.level=level;p.hp=p.maxHp=maxHpAtLevel(species,level);return save;}
test('Eterna preparation distinguishes opponent and recommended levels and leaves the challenge unchanged',()=>{
  const save=fixture(),before=structuredClone(save),pages=gardeniaPreparationPages(save);
  assert.match(pages[0],/유채의 동료는 Lv.14~16/);assert.match(pages[0],/권장 준비 레벨은 Lv.10/);
  assert(pages.some(page=>page.includes('세꿀버리는 드문 동료')));assert(pages.some(page=>page.includes('바람일으키기')));assert.deepEqual(save,before);assert.equal(gymChallengeBlock(save,'gardenia'),null);
  const noBadge={...save,badges:[],keyItems:[]};gardeniaPreparationPages(noBadge);assert.match(gymChallengeBlock(noBadge,'gardenia')!,/강석/);
});
test('equipped advantageous moves win over unselected learnable moves and only one partner is recommended',()=>{
  const save=fixture(4,7);save.party.push({species:415,level:10,hp:maxHpAtLevel(415,10),maxHp:maxHpAtLevel(415,10),experience:0,nature:'성실',met:'영원숲',moves:['바람일으키기','바람일으키기']});
  const pages=gardeniaPreparationPages(save);assert(pages.some(page=>page.includes('세꿀버리의 바람일으키기')));assert(pages.some(page=>page.includes('현재 기억하고 있는 기술')));assert(!pages.some(page=>page.includes('불꽃세례')));
});
test('unselected available moves provide a learning path without claiming a future unlock is available',()=>{
  const save=fixture(4,7),before=structuredClone(save),pages=gardeniaPreparationPages(save);
  assert(pages.some(page=>page.includes('파이리의 불꽃세례')));assert(pages.some(page=>page.includes('지금 배울 수 있는 기술')));assert(pages.some(page=>page.includes('포켓몬 → 정보 → 기술 배우기')));assert.deepEqual(save,before);
  const future=gardeniaPreparationPages(fixture(4,6));assert(!future.some(page=>page.includes('불꽃세례')));assert(future.some(page=>page.includes('드문 동료')));
});
test('fainted recommended partners receive recovery advice and completed Gardenia does not repeat preparation',()=>{
  const save=fixture(4,7);save.party[0].moves!.push('불꽃세례');save.party[0].hp=0;assert(gardeniaPreparationPages(save).some(page=>page.includes('먼저 회복')));
  save.badges.push(GYMS[1].badge);const before=structuredClone(save);assert.deepEqual(gardeniaPreparationPages(save),['유채에게 승리했어요!\n다음 모험 목표를 확인해 보세요.']);assert.deepEqual(save,before);
});
test('only the Eterna gym guide uses new preparation and advice stays compact',()=>{
  for(const map of ['eterna_gym','hearthome_gym','veilstone_gym'] as const){const save=fixture();save.map=map;let pages:string[]=[];const game={save,say(_name:string,text:string[]){pages=text;}} as unknown as Engine;const before=structuredClone(save);assert(sinnohEvent(game,'sinnohGymGuide'));assert.deepEqual(save,before);assert.equal(pages.some(page=>page.includes('Lv.14~16')),map==='eterna_gym');if(map==='veilstone_gym')assert.match(pages[0],/자두의 동료는 Lv.21~23/);}
  for(const save of [fixture(),fixture(4,7),fixture(4,6)])for(const page of gardeniaPreparationPages(save)){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=30,line);}
});
