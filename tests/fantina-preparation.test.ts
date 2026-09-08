import test from 'node:test';
import assert from 'node:assert/strict';
import {fantinaPreparationPages} from '../src/fantina-preparation';
import {sinnohEvent} from '../src/sinnoh-story';
import {newSave} from '../src/save';
import {maxHpAtLevel} from '../src/growth';
import {teachMove,MOVE_RULES} from '../src/pokemon';
import {gymTeam,gymChallengeBlock} from '../src/gyms';
import {techniqueDamage} from '../src/battle';
import type {Engine} from '../src/engine';
import type {Pokemon} from '../src/types';

function pokemon(species:number,level:number,moves:string[]):Pokemon{const maxHp=maxHpAtLevel(species,level);return {species,level,hp:maxHp,maxHp,experience:0,moves,nature:'성실',met:'테스트'};}
function fixture(){const save=newSave();save.map='hearthome_gym';save.flags.departureCleared=true;save.flags.starterReceived=true;save.badges=['BADGE-GS01','BADGE-GS02'];save.keyItems=['TM-stealth-rock','TM-grass-knot'];save.inventory.potions=1;save.party=[pokemon(1,13,['몸통박치기','울음소리','덩굴채찍']),pokemon(399,3,['몸통박치기','몸통박치기']),pokemon(74,16,['돌떨구기','웅크리기'])];return save;}
test('Fantina advice selects actual damage across all opponents and preserves the natural party',()=>{
  const save=fixture(),before=structuredClone(save),pages=fantinaPreparationPages(save);
  assert.match(pages[0],/Lv.17~19/);assert.match(pages[0],/권장 준비 레벨은 Lv.12/);
  assert(pages.some(p=>p.includes('꼬마돌의 돌떨구기')));assert(!pages.some(p=>p.includes('이상해씨의')||p.includes('비버니의')));
  assert(pages.some(p=>p.includes('세 동료에게 피해')));assert(!pages.some(p=>p.includes('세 동료의 약점')));
  assert.deepEqual(gymTeam('fantina').map(enemy=>techniqueDamage(save.party[2],enemy,'돌떨구기')),[32,16,16]);
  assert(pages.some(p=>p.includes('상처약은 현재 1개')));assert(pages.some(p=>p.includes('센터에서 회복하고 상점')));
  assert.deepEqual(save,before);assert.equal(gymChallengeBlock(save,'fantina'),null);
});
test('immunity advice is limited to attacks and retains the struggle and status exceptions',()=>{
  const save=fixture(),text=fantinaPreparationPages(save).join('\n');
  assert.match(text,/노말·격투 공격은 통하지/);assert.match(text,/발버둥과 변화기는 별도로/);
  for(const enemy of gymTeam('fantina')){assert.equal(techniqueDamage(save.party[0],enemy,'몸통박치기'),0);assert(techniqueDamage(save.party[0],enemy,'발버둥')>0);}
  assert.equal(MOVE_RULES['울음소리'].rule,'attackDrop');
});
test('equipped attacks precede unselected moves, learning advice changes after teaching, and no future move is promised',()=>{
  const save=fixture();save.party=[pokemon(4,7,['할퀴기','울음소리']),pokemon(1,13,['덩굴채찍','울음소리'])];
  assert(fantinaPreparationPages(save).some(p=>p.includes('이상해씨의 덩굴채찍')));
  save.party.pop();let pages=fantinaPreparationPages(save);assert(pages.some(p=>p.includes('파이리의 불꽃세례')));assert(pages.some(p=>p.includes('지금 배울 수 있는')));assert(pages.some(p=>p.includes('포켓몬 → 정보 → 기술 배우기')));
  assert(teachMove(save,0,'불꽃세례',2));pages=fantinaPreparationPages(save);assert(pages.some(p=>p.includes('현재 기억하고 있는')));assert(!pages.some(p=>p.includes('기술 배우기')));
  save.party=[pokemon(4,6,['할퀴기','울음소리'])];pages=fantinaPreparationPages(save);assert(!pages.some(p=>p.includes('불꽃세례')));assert(pages.some(p=>p.includes('천관산 하부의 꼬마돌')));
});
test('TM availability is owned, fainted partners get recovery advice, and a missing prior badge still blocks challenge',()=>{
  const save=fixture();save.party=[pokemon(399,3,['몸통박치기','몸통박치기'])];let pages=fantinaPreparationPages(save);assert(pages.some(p=>p.includes('비버니의 풀묶기')));
  save.keyItems=[];pages=fantinaPreparationPages(save);assert(!pages.some(p=>p.includes('풀묶기')));assert(pages.some(p=>p.includes('천관산 하부')));
  save.party=[pokemon(74,16,['돌떨구기','웅크리기'])];save.party[0].hp=0;assert(fantinaPreparationPages(save).some(p=>p.includes('먼저 회복')));
  save.party[0].hp=1;save.badges=[];const before=structuredClone(save);fantinaPreparationPages(save);assert.match(gymChallengeBlock(save,'fantina')!,/강석/);assert.deepEqual(save,before);
});
test('victory follows the existing objective with its destination, and the guide integration stays compact and read-only',()=>{
  const save=fixture();let pages:string[]=[];const game={save,say(_name:string,text:string[]){pages=text;}} as unknown as Engine;
  const before=structuredClone(save);assert(sinnohEvent(game,'sinnohGymGuide'));assert.deepEqual(pages,fantinaPreparationPages(save));assert.deepEqual(save,before);
  const sets=[pages];save.badges.push('BADGE-GS03');pages=fantinaPreparationPages(save);assert(pages.some(p=>p.includes('장막체육관')&&p.includes('자두')));assert(!pages.some(p=>p.includes('권장 준비')));sets.push(pages);
  save.badges.push('BADGE-GS04');pages=fantinaPreparationPages(save);assert(pages.some(p=>p.includes('장막시티')&&p.includes('관측 연구원')));sets.push(pages);
  save.party=[pokemon(4,6,['할퀴기','울음소리'])];save.badges=['BADGE-GS01','BADGE-GS02'];sets.push(fantinaPreparationPages(save));
  for(const group of sets)for(const page of group){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=30,line);}
});
