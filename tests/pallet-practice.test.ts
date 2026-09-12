import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { parseSave } from '../src/save';
import { handleJourneyEvent } from '../src/journey-services';
import { practicePages } from '../src/pallet-practice';

function fixture(){
  const save=parseSave(readFileSync('tests/pallet-ready-copy-save.json','utf8'))!;save.map='tour_pallet_hall';
  let choices:Choice[]=[],pages:string[]=[];
  const g={save,battle:null,panel:'field',partyIndex:0,say(_s:string,p:string[],_a:unknown,c:Choice[]=[]){pages=p;choices=c;this.dialogue={selected:0};}} as unknown as Engine;
  return {g,get choices(){return choices;},get pages(){return pages;},choose(label:string){const c=choices.find(c=>c.label===label);assert(c,label);c.action();}};
}

test('Pallet machine compares actual party moves without damaging, rewarding or rearranging Pokemon',()=>{
  const f=fixture(),before=structuredClone(f.g.save);
  assert(handleJourneyEvent(f.g,'tourExhibit0'));f.choose('요가랑 Lv.20');f.choose('딱충이 Lv.21');f.choose('염동력');
  assert(f.pages.some(p=>p.includes('타입 상성 ×2')));assert(f.pages.some(p=>p.includes('HP 75 중')));
  f.choose('다른 기술 비교');f.choose('판별');assert(f.pages.some(p=>p.includes('직접 피해를 주는 기술이 아니다')));
  assert.deepEqual(f.g.save,before);
  f.choose('기술 편성하기');assert.equal(f.g.panel,'summary');assert.equal(f.g.partyIndex,0);
  assert(f.pages[0].includes('요가랑'));assert.deepEqual(f.g.save,before);
});

test('party pages, back choices, insufficient party and stale slot callbacks are safe',()=>{
  const f=fixture();handleJourneyEvent(f.g,'tourExhibit0');f.choose('다음 페이지');f.choose('꼬렛 Lv.25');
  assert(!f.choices.some(c=>c.label==='꼬렛 Lv.25'));f.choose('사용할 동료 다시 고르기');
  const stale=f.choices[0],before=f.pages;f.g.save=structuredClone(f.g.save);stale.action();assert.equal(f.pages,before);
  f.g.save.party=[];handleJourneyEvent(f.g,'tourExhibit0');assert.deepEqual(f.choices.map(c=>c.label),['돌아가기']);
  f.g.save.map='tour_pallet_center';assert.equal(handleJourneyEvent(f.g,'tourExhibit0'),false);
});

test('immune, fixed-damage and non-damaging trials do not promise ordinary multiplied damage',()=>{
  const f=fixture(),p=f.g.save.party[0],target={...f.g.save.party[3],species:228};
  assert(practicePages(p,target,'염동력').some(p=>p.includes('효과가 없다')));
  assert(practicePages(p,target,'용의분노').some(p=>p.includes('정해진 피해')));
  assert(!practicePages(p,target,'용의분노').some(p=>p.includes('타입 상성 ×')));
  assert(practicePages(p,target,'판별').some(p=>p.includes('직접 피해를 주는 기술이 아니다')));
});
