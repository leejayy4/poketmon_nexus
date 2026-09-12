import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { handleCinnabarResearch,cinnabarSurveyPages } from '../src/cinnabar-research';
import { encounterGuidance } from '../src/encounter-guidance';

test('Cinnabar two-species guidance does not call the same companion common and rare',()=>{
  const pages=encounterGuidance('tour_cinnabar').pages.join('\n');
  assert.match(pages,/가디·질퍽이/);assert.doesNotMatch(pages,/드물게/);
  assert.match(pages,/Lv\.22~24/);
});

function fixture(){
  const save=newSave();assert(grantPokemon(save,1));save.flags.departureCleared=true;
  save.map='tour_cinnabar';save.player={...TOUR_SPAWNS.tour_cinnabar,facing:'down'};
  let writes=0,destinations=0,choices:Choice[]=[];
  const g={save,battle:null,persist(){writes++;},audio:{play(){}},setTourDestination(){destinations++;},say(_s:string,_p:string[],_a:unknown,c:Choice[]=[]){choices=c;}} as unknown as Engine;
  return {g,get writes(){return writes;},get destinations(){return destinations;},get guide(){return choices.find(c=>c.label==='연구소 길 안내')!.action;},observe(name:string){const object=TOUR_OUTDOORS.tour_cinnabar.objects.find(o=>o.name===name);assert(object);assert(handleCinnabarResearch(g,object.event));}};
}

test('Cinnabar field observations persist independently and revisits give no extra rewards',()=>{
  const f=fixture(),before=structuredClone(f.g.save);
  f.observe('붉은 화산암 절벽');assert.equal(f.writes,1);
  assert.equal(f.g.save.flags.cinnabarCliffObserved,true);assert(!f.g.save.flags.cinnabarShoreObserved);
  f.observe('붉은 화산암 절벽');assert.equal(f.writes,1);
  f.observe('물에 닳은 화산암');assert.equal(f.writes,2);
  const loaded=parseSave(JSON.stringify(f.g.save));assert(loaded);
  assert.equal(loaded.flags.cinnabarCliffObserved,true);assert.equal(loaded.flags.cinnabarShoreObserved,true);
  assert(cinnabarSurveyPages(loaded).some(p=>p.includes('직접 살펴봤다')));
  for(const key of ['party','inventory','money','badges','keyItems'] as const)assert.deepEqual(loaded[key],before[key],key);
});

test('Cinnabar guidance ignores callbacks after a save replacement',()=>{
  const f=fixture();f.observe('붉은 화산암 절벽');const guide=f.guide;
  guide();assert.equal(f.destinations,1);
  f.g.save=structuredClone(f.g.save);guide();assert.equal(f.destinations,1);
});

test('Cinnabar observation flags accept old saves and reject malformed records',()=>{
  const f=fixture();assert(parseSave(JSON.stringify(f.g.save)));
  for(const key of ['cinnabarCliffObserved','cinnabarShoreObserved']){
    const raw=structuredClone(f.g.save) as any;raw.flags[key]='true';
    assert.equal(parseSave(JSON.stringify(raw)),null);
  }
});
