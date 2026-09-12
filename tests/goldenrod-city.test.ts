import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { planTourNavigation,tourExitPath } from '../src/explore-navigation';
import { parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOUR_MAPS,TOUR_NEIGHBORS } from '../src/explore-world';
import { journeyConnection } from '../src/journey-world';
import { wildPokemon } from '../src/runtime-encounters';
import { handleGoldenrodRadio,route34RecordPages } from '../src/goldenrod-radio';

test('Goldenrod and Saffron neighbor panels resolve the station corridor without losing directions',()=>{
  for(const id of ['tour_goldenrod','tour_saffron'] as const){
    for(const target of TOUR_NEIGHBORS(id))assert(journeyConnection(TOUR_MAPS[id],target),`${id} → ${target}`);
  }
  assert.equal(journeyConnection(TOUR_MAPS.tour_goldenrod,'tour_saffron')?.entry,'left');
  assert.equal(journeyConnection(TOUR_MAPS.tour_saffron,'tour_goldenrod')?.entry,'down');
});

test('radio upper floors use current party provenance, leave progress unchanged and reject stale navigation',()=>{
  for(const [map,event] of [['tour_goldenrod_hall_2f','tourDetail3_4'],['tour_goldenrod_hall_3f','tourDetail3_9']] as const){
    const g=new Engine();g.announce=()=>{};g.save=g.freshSave();g.save.party=[wildPokemon('tour_route_34',()=>0.99)!];g.save.map=map;
    g.save.party[0].met='성도 34번도로';
    const before=JSON.stringify(g.save);
    assert(handleGoldenrodRadio(g,event));
    assert(g.dialogue!.pages.join(' ').includes(map.endsWith('2f')?'성도 34번도로':'현지')||g.dialogue!.pages.join(' ').includes('34번도로에서 만난 동료'));
    const action=g.dialogue!.choices![0].action;
    assert.equal(JSON.stringify(g.save),before);
    g.save.map='tour_goldenrod';action();assert.equal(g.tourNavigation,null);
  }
});

test('Route 34 notebook distinguishes same-species outsiders from local boxed companions',()=>{
  const g=new Engine();g.save=g.freshSave();g.save.party=[wildPokemon('tour_route_34',()=>0.99)!];
  g.save.party[0].met='다른 도시';
  assert(route34RecordPages(g.save).some(page=>page.includes('현지 동료 없음')));
  g.save.party[0].met='성도 34번도로';g.save.box=[g.save.party.pop()!];
  assert(route34RecordPages(g.save).some(page=>page.includes('34번도로에서 만난 동료 1마리')));
});

test('station, radio floors, homes and Route 34 support engine walking and save restoration in one journey',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=g.freshSave();
  grantPokemon(g.save,7);g.save.flags.departureCleared=true;
  g.save.map='tour_saffron';g.save.player={x:14,y:33,facing:'down'};
  const party=JSON.stringify(g.save.party);
  const targets=['tour_goldenrod_station','tour_goldenrod','tour_goldenrod_hall_2f','tour_goldenrod_hall_3f','tour_goldenrod_home2','tour_route_34','tour_ilex','tour_goldenrod','tour_saffron'] as const;
  for(const target of targets){
    let crossings=0;
    while(g.save.map!==target){
      assert(crossings++<10,`stuck before ${target}`);
      let route=planTourNavigation(g.save,target)!;
      // A city destination intentionally counts its interiors as already visited.
      if(route.status==='arrived'){
        const exit=g.map.warps.find(w=>w.to===target)!;assert(exit,target);
        route={...route,status:'walking',maps:[g.save.map,target],tiles:tourExitPath(g.map,g.save.player,exit),exit};
      }
      assert.equal(route.status,'walking',target);
      for(let i=1;i<route.tiles.length;i++){
        const a=route.tiles[i-1],b=route.tiles[i];
        const dir=Object.entries(VECTOR).find(([,v])=>a.x+v.x===b.x&&a.y+v.y===b.y)![0];
        const key='Arrow'+dir[0].toUpperCase()+dir.slice(1);
        g.press(key);g.release(key);for(let tick=0;tick<20;tick++)g.update(.04);
        assert(!g.battle,`safe route entered grass before ${target}`);
      }
      assert.equal(g.save.map,route.maps[1],target);
    }
    const restored=parseSave(JSON.stringify(g.save));assert(restored,`${target} save rejected`);
    assert.deepEqual(restored.player,g.save.player,target);assert.equal(JSON.stringify(restored.party),party);
  }
  assert(g.save.steps>100);
});
