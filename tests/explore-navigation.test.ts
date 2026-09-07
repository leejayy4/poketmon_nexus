import test from 'node:test';
import assert from 'node:assert/strict';
import { grantPokemon } from '../src/pokemon';
import { Engine,VECTOR } from '../src/engine';
import { getMap,canEnter } from '../src/maps';
import { PLACES,TOUR_SPAWNS,TOUR_INTERIORS,tourPlaceForMap,type TourId } from '../src/explore-world';
import { FLOOR_PARENTS } from '../src/journey-world';
import { planTourNavigation,tourExitPath } from '../src/explore-navigation';
function tour(id:string='town'){const g=new Engine();g.exploring=true;g.save=g.freshSave();g.save.map=id as typeof g.save.map;g.save.player={...(TOUR_SPAWNS[id as TourId]??{x:8,y:25}),facing:'down'};return g}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}
test('every pair of tour destinations has a legal connected map route and a usable first exit path',()=>{
  for(const from of PLACES)for(const to of PLACES){const g=tour(from.id),r=planTourNavigation(g.save,to.id)!;assert(r);if(from.id===to.id){assert.equal(r.status,'arrived');continue}assert.equal(r.status,'walking');assert.equal(r.maps[0],from.id);assert.equal(r.maps.at(-1),to.id);
    for(let i=1;i<r.maps.length;i++)assert(getMap(r.maps[i-1],g.save.flags).warps.some(w=>w.to===r.maps[i]));
    assert.deepEqual(r.tiles[0],{x:g.save.player.x,y:g.save.player.y});assert.deepEqual(r.tiles.at(-1),{x:r.exit!.x,y:r.exit!.y});
    for(let i=1;i<r.tiles.length;i++){const a=r.tiles[i-1],b=r.tiles[i],dir=Object.entries(VECTOR).find(([,v])=>a.x+v.x===b.x&&a.y+v.y===b.y)?.[0];assert(dir);assert(canEnter(g.map,b.x,b.y,dir as keyof typeof VECTOR));assert(i===r.tiles.length-1||!g.map.warps.some(w=>w.x===b.x&&w.y===b.y));}
  }
});
test('all interiors first guide outside and recognize a destination already being visited',()=>{
  for(const id of Object.keys(TOUR_INTERIORS)){const g=tour(id),place=tourPlaceForMap(id)!.id;assert.equal(planTourNavigation(g.save,place)?.status,'arrived');const target=place==='tour_jubilife'?'tour_humilau':'tour_jubilife';const r=planTourNavigation(g.save,target)!;assert.equal(r.status,'walking');assert.equal(r.maps[1],FLOOR_PARENTS[id]??place);assert.equal(r.exit?.entry,'down');}
});
test('following the displayed tile path walks from the starting town to another region without teleporting',()=>{
  const g=tour();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.setTourDestination('tour_vermilion');let crossed=0;
  while(g.tourNavigation?.status==='walking'&&crossed<12){const r=g.tourNavigation!;for(let i=1;i<r.tiles.length;i++){const a=r.tiles[i-1],b=r.tiles[i],dir=Object.entries(VECTOR).find(([,v])=>a.x+v.x===b.x&&a.y+v.y===b.y)![0];step(g,'Arrow'+dir[0].toUpperCase()+dir.slice(1));}assert.equal(g.save.map,r.maps[1]);crossed++;}
  assert.equal(g.tourNavigation?.status,'arrived');assert.equal(g.save.map,'tour_vermilion');assert(crossed>=3);assert(g.save.steps>20);assert.equal(g.save.party[0].species,7);assert.deepEqual(g.save.flags,{starterReceived:true,departureCleared:true});
});
test('guidance can change, recalculate and cancel without moving the player or altering the save',()=>{
  const g=tour('tour_jubilife'),before=structuredClone(g.save);g.setTourDestination('tour_oreburgh');assert.deepEqual(g.save,before);assert(g.tourNavigation);g.setTourDestination('unknown');assert.equal(g.tourDestination,'tour_oreburgh');
  const a=g.tourNavigation!;step(g,'ArrowRight');assert.notDeepEqual(g.tourNavigation?.tiles[0],a.tiles[0]);g.setTourDestination('tour_humilau');assert.equal(g.tourNavigation?.destination,'tour_humilau');const after=structuredClone(g.save);g.setTourDestination(null);assert.equal(g.tourNavigation,null);assert.deepEqual(g.save,after);
  const normal=new Engine();normal.setTourDestination('tour_jubilife');assert.equal(normal.tourNavigation?.status,'blocked');assert.equal(new Engine().tourDestination,null);
});
test('an obstructed exit reports no tile route instead of crossing blocked terrain',()=>{
  const g=tour('tour_jubilife'),r=planTourNavigation(g.save,'tour_oreburgh')!,map=structuredClone(g.map);const v=VECTOR[r.exit!.entry],x=r.exit!.x-v.x,y=r.exit!.y-v.y;map.walkable[y]=map.walkable[y].slice(0,x)+'#'+map.walkable[y].slice(x+1);assert.deepEqual(tourExitPath(map,g.save.player,r.exit!),[]);
});
