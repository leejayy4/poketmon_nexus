import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { forestObservationPages } from '../src/viridian-notebook';
import { handleJourneyEvent } from '../src/journey-services';
import { TOUR_INTERIORS } from '../src/explore-world';
import { newSave } from '../src/save';

test('forest records distinguish seen, caught, unknown and include boxed ownership without changing save',()=>{
  const save=JSON.parse(readFileSync('tests/viridian-journey-final-save.json','utf8'));
  save.pokedex={seen:[10],caught:[25]};
  const before=structuredClone(save),pages=forestObservationPages(save);
  assert.equal(pages.length,5);
  assert(pages.some(p=>p.startsWith('캐터피 · 발견 기록 있음')));
  assert(pages.some(p=>p.startsWith('피카츄 · 포획 기록 있음')));
  assert(pages.some(p=>p.startsWith('딱충이 · 포획 기록 있음')));
  assert(pages.some(p=>p.startsWith('뿔충이 · 아직 발견 기록 없음')));
  save.box.push(save.party.splice(save.party.findIndex((p:{species:number})=>p.species===14),1)[0]);
  assert(forestObservationPages(save).some(p=>p.startsWith('딱충이 · 포획 기록 있음')));
  save.party=before.party;save.box=before.box;
  assert.deepEqual(save,before);
});

test('real exhibit routes to optional notebook, returns after reading, opens party and rejects stale callbacks',()=>{
  const save=newSave();save.map='tour_viridian_hall';
  let choices:Choice[]=[],after:(()=>void)|undefined;
  const g={save,panel:'field',partyIndex:4,battle:null,say(_s:string,_p:string[],a?:()=>void,c?:Choice[]){choices=c??[];after=a;}} as unknown as Engine;
  const before=structuredClone(save);
  assert.equal(TOUR_INTERIORS[save.map].objects[2].kind,'workbench');
  assert(handleJourneyEvent(g,'tourExhibit2'));
  choices[2].action();assert.deepEqual(save,before);
  choices[0].action();assert(after);after();assert.equal(choices.length,3);
  choices[1].action();assert.equal(g.panel,'party');assert.equal(g.partyIndex,0);
  const stale=choices[1];g.panel='field';g.save=newSave();stale.action();assert.equal(g.panel,'field');
  assert.equal(handleJourneyEvent(g,'tourExhibit2'),false);
  assert.deepEqual(save,before);
});
