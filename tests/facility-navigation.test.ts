import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { TOUR_INTERIORS,TOUR_MAPS,TOUR_SPAWNS,tourPlaceForMap,type TourId } from '../src/explore-world';
import { FLOOR_PARENTS } from '../src/journey-world';
import { planTourNavigation,tourPassageLabel } from '../src/explore-navigation';

function tour(id:TourId){const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);return g}
function follow(g:Engine){
  const route=g.tourNavigation!,source=g.save.map;assert.equal(route.status,'walking');
  // The live guide recalculates around roaming Pokemon. Follow that displayed
  // route each step rather than replaying a stale path through a moving NPC.
  for(let i=0;g.save.map===source&&i<300;i++){
    const next=g.tourNavigation!;assert.equal(next.status,'walking');
    const a=next.tiles[0],b=next.tiles[1],dir=Object.entries(VECTOR).find(([,v])=>a.x+v.x===b.x&&a.y+v.y===b.y)![0];
    const key='Arrow'+dir[0].toUpperCase()+dir.slice(1);g.press(key);g.release(key);for(let tick=0;tick<20;tick++)g.update(.04);
  }
  assert.equal(g.save.map,route.maps[1]);
}

test('all facility and floor destinations guide through real doors and stairs and arrive only inside',()=>{
  for(const id of Object.keys(TOUR_INTERIORS) as TourId[]){
    const parent=tourPlaceForMap(id)!.id,g=tour(parent),before=structuredClone(g.save);g.setTourDestination(id);
    let entrance=id;while(FLOOR_PARENTS[entrance])entrance=FLOOR_PARENTS[entrance];
    assert.deepEqual(g.save,before);assert.equal(g.tourNavigation?.exit?.to,entrance);assert.equal(tourPassageLabel(g.tourNavigation!.exit!),'입구');
    let steps=0;while(g.tourNavigation?.status==='walking'&&steps++<4)follow(g);assert.equal(g.tourNavigation?.status,'arrived');assert(g.save.tourVisited?.includes(id));
    g.setTourDestination(parent);assert.equal(g.tourNavigation?.status,'arrived');
  }
});

test('another room in the same town requires leaving and reentering, preserving visits and no rewards',()=>{
  for(const id of Object.keys(TOUR_INTERIORS) as TourId[]){
    const parent=tourPlaceForMap(id)!.id,other=(parent+(id.endsWith('_center')?'_hall':'_center')) as TourId,g=tour(id);g.setTourDestination(other);
    const floors:TourId[]=[];let lower=FLOOR_PARENTS[id];while(lower){floors.push(lower);lower=FLOOR_PARENTS[lower];}
    assert.deepEqual(g.tourNavigation?.maps,[id,...floors,parent,other]);assert.equal(g.tourNavigation?.exit?.entry,'down');
    let steps=0;while(g.tourNavigation?.status==='walking'&&steps++<5)follow(g);assert.equal(g.tourNavigation?.status,'arrived');
    assert(g.save.tourVisited?.includes(id));assert(g.save.tourVisited?.includes(other));assert.deepEqual(g.save.flags,{});assert.equal(g.save.money,0);
  }
});

test('facility guidance crosses regions, recalculates after fast travel and clears without changing saves',()=>{
  const g=tour('tour_jubilife_center');g.setTourDestination('tour_vermilion_hall');let count=0;
  while(g.tourNavigation?.status==='walking'&&count++<15)follow(g);
  assert.equal(g.save.map,'tour_vermilion_hall');assert.equal(g.tourNavigation?.status,'arrived');
  g.exploreTo('tour_vermilion');assert.equal(g.tourNavigation?.status,'walking');assert.equal(g.tourNavigation?.exit?.to,'tour_vermilion_hall');
  const before=structuredClone(g.save);g.setTourDestination(null);assert.equal(g.tourNavigation,null);assert.deepEqual(g.save,before);
  assert.equal(new Engine().tourDestination,null);
});

test('only existing tour destinations are accepted and new adventures retain the departure gate in facility guidance',()=>{
  const g=tour('tour_jubilife');g.setTourDestination('tour_jubilife_center');
  for(const id of ['toString','__proto__','tour_eterna_forest_center','tour_missing_hall']){
    g.setTourDestination(id);assert.equal(g.tourDestination,'tour_jubilife_center');assert.equal(planTourNavigation(g.save,id as TourId),null);
  }
  const normal=new Engine();normal.setTourDestination('tour_jubilife_center');assert.equal(normal.tourNavigation?.status,'blocked');
  assert.deepEqual(Object.keys(TOUR_SPAWNS).sort(),Object.keys(TOUR_MAPS).sort());
});
