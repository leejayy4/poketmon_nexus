import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice, MapId } from '../src/types';
import { newSave } from '../src/save';
import { handleJourneyEvent } from '../src/journey-services';
import { planTourNavigation, tourExitPath } from '../src/explore-navigation';
import { getMap } from '../src/maps';

test('Viridian facility supplies and all three journeys select walkable routes without changing save',()=>{
  const save=newSave();save.map='tour_viridian_hall';save.player={x:8,y:10,facing:'up'};
  let choices:Choice[]=[],target:MapId|undefined,event:string|undefined;
  const g={save,battle:null,say(_s:string,_p:string[],_a:unknown,c:Choice[]){choices=c;},setTourDestination(t:MapId,e?:string){target=t;event=e;}} as unknown as Engine;
  const before=structuredClone(save);
  assert(handleJourneyEvent(g,'tourHost'));choices[0].action();
  assert.equal(target,'tour_viridian_center');assert.equal(event,'nurse');
  assert(handleJourneyEvent(g,'tourHost'));choices[1].action();
  assert.equal(target,'tour_viridian_mart');assert.equal(event,'martClerk');
  assert(handleJourneyEvent(g,'tourExhibit1'));
  assert.deepEqual(choices.map(c=>c.label),['태초마을 안내','상록숲 안내','무지개시티 안내','지도 접기']);
  for(const choice of choices.slice(0,-1)){
    choice.action();const route=planTourNavigation(save,target!);assert(route);assert.equal(route.status,'walking');
    let spawn=save.player;
    for(let i=0;i<route.maps.length-1;i++){
      const map=getMap(route.maps[i],save.flags),exit=map.warps.find(w=>w.to===route.maps[i+1])!;
      assert(tourExitPath(map,spawn,exit).length,`${map.id} → ${exit.to}`);spawn={...exit.spawn,facing:'up'};
    }
  }
  const previous=target;choices.at(-1)!.action();assert.equal(target,previous);
  const stale=choices[0];g.save=newSave();stale.action();assert.equal(target,previous);
  assert.deepEqual(save,before);assert.equal(handleJourneyEvent(g,'tourHost'),false);
});
