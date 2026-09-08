import test from 'node:test';
import assert from 'node:assert/strict';
import {maylenePreparationPages} from '../src/maylene-preparation';
import {sinnohEvent} from '../src/sinnoh-story';
import {newSave} from '../src/save';
import {maxHpAtLevel} from '../src/growth';
import {teachMove} from '../src/pokemon';
import {gymChallengeBlock} from '../src/gyms';
import {createBattle,battleTurn} from '../src/battle';
import type {Engine} from '../src/engine';
import type {Pokemon} from '../src/types';

function pokemon(species:number,level:number,moves:string[]):Pokemon{const maxHp=maxHpAtLevel(species,level);return {species,level,hp:maxHp,maxHp,experience:0,moves,nature:'성실',met:'검토'};}
function fixture(){const s=newSave();s.map='veilstone_gym';s.flags.departureCleared=true;s.flags.starterReceived=true;s.badges=['BADGE-GS01','BADGE-GS02','BADGE-GS03'];s.keyItems=['TM-stealth-rock','TM-grass-knot','TM-shadow-ball'];s.party=[pokemon(74,17,['돌떨구기','웅크리기']),pokemon(1,13,['몸통박치기','울음소리','덩굴채찍']),pokemon(399,4,['몸통박치기','몸통박치기','풀묶기'])];s.party[0].hp=10;return s;}
test('Maylene preparation reports opponent levels and limited current damage without changing health or challenge rules',()=>{
  const save=fixture(),before=structuredClone(save),pages=maylenePreparationPages(save);
  assert.match(pages[0],/Lv.21~23/);assert.match(pages[0],/권장 준비 레벨은 Lv.15/);
  assert(pages.some(p=>p.includes('장착 · 이상해씨의 덩굴채찍')&&p.includes('요가랑 HP38 중 11 피해')));
  assert(pages.some(p=>p.includes('드레인펀치는 HP를 흡수')));assert(pages.some(p=>p.includes('상대별 상성과 반격 예고')));
  assert(pages.some(p=>p.includes('상처약은 현재 0개')));assert(pages.some(p=>p.includes('센터에서 회복하고 상점')));
  assert(!pages.some(p=>p.includes('충분')||p.includes('모두에게 유리')));assert.deepEqual(save,before);assert.equal(gymChallengeBlock(save,'maylene'),null);
  save.badges=[];maylenePreparationPages(save);assert.match(gymChallengeBlock(save,'maylene')!,/강석/);
});
test('drain warning matches the actual opening response to the existing Geodude',()=>{
  const save=fixture();save.party=save.party.slice(0,1);save.party[0].hp=70;const b=createBattle(save,'gym','maylene')!;
  const result=battleTurn(save,b,'move0');assert.equal(save.party[0].hp,10);assert.equal(b.enemy.hp,38);assert(result.pages.some(p=>p.includes('HP를 8 흡수')));
});
test('Ponyta learning advice changes to equipped advice after learning, never promises a future move',()=>{
  const save=fixture();save.party=[pokemon(77,18,['몸통박치기','울음소리'])];const before=structuredClone(save);let pages=maylenePreparationPages(save);
  assert(pages.some(p=>p.includes('배울 수 있음 · 포니타의 불꽃세례')&&p.includes('루카리오 HP42 중 28 피해')));
  assert(pages.some(p=>p.includes('포켓몬 → 정보 → 기술 배우기')));assert.deepEqual(save,before);
  assert(teachMove(save,0,'불꽃세례',2));pages=maylenePreparationPages(save);assert(pages.some(p=>p.includes('장착 · 포니타의 불꽃세례')));assert(!pages.some(p=>p.includes('배울 수 있음')||p.includes('기술 배우기')));
  save.party=[pokemon(4,6,['할퀴기','울음소리'])];assert(!maylenePreparationPages(save).some(p=>p.includes('파이리의 불꽃세례')));
});
test('TM advice respects ownership and existing road companions have distinct target-specific roles',()=>{
  const save=fixture();let pages=maylenePreparationPages(save);
  assert(pages.some(p=>p.includes('배울 수 있음 · 비버니의 섀도볼')));
  assert(pages.some(p=>p.includes('연고–장막 길의 요가랑 · 염동력')&&p.includes('알통몬의 약점')));
  assert(pages.some(p=>p.includes('연고–장막 길의 포니타 · 불꽃세례')&&p.includes('루카리오의 약점')));
  save.keyItems=[];pages=maylenePreparationPages(save);assert(!pages.some(p=>p.includes('섀도볼')));
  save.party=[pokemon(77,18,['불꽃세례','울음소리'])];save.party[0].hp=0;assert(maylenePreparationPages(save).some(p=>p.includes('먼저 회복')));
});
test('Maylene guide integrates read-only and completed battles follow the real research destination',()=>{
  const save=fixture();let pages:string[]=[];const game={save,say(_name:string,text:string[]){pages=text;}} as unknown as Engine;const before=structuredClone(save);
  assert(sinnohEvent(game,'sinnohGymGuide'));assert.deepEqual(pages,maylenePreparationPages(save));assert.deepEqual(save,before);
  const sets=[pages];save.badges.push('BADGE-GS04');pages=maylenePreparationPages(save);assert(pages.some(p=>p.includes('장막시티')&&p.includes('관측 연구원')));assert(!pages.some(p=>p.includes('권장 준비')));sets.push(pages);
  save.flags.observationCollected=true;pages=maylenePreparationPages(save);assert(pages.some(p=>p.includes('축복시티')&&p.includes('관측 자료 전달')));sets.push(pages);
  save.flags.researchDelivered=true;pages=maylenePreparationPages(save);assert(pages.some(p=>p.includes('운하시티')&&p.includes('조사선')));sets.push(pages);
  for(const group of sets)for(const page of group){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=30,line);}
});
