import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { TOUR_MAPS } from '../src/explore-world';
import { handleBlackthornLife } from '../src/blackthorn-life';
import { grantPokemon } from '../src/pokemon';
import { parseSave } from '../src/save';
import { wildPokemon } from '../src/runtime-encounters';

function prepared(){
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=g.freshSave();
  assert(grantPokemon(g.save,7));const tangela=wildPokemon('tour_johto_route_44',()=>0);assert(tangela);g.save.party.push(tangela);
  g.save.flags.departureCleared=true;
  g.save.map='tour_blackthorn';g.save.player={x:32,y:25,facing:'right'};
  return g;
}

function connected(mapId:keyof typeof TOUR_MAPS,start:{x:number;y:number},goal:{x:number;y:number}){
  const map=TOUR_MAPS[mapId],seen=new Set([`${start.x},${start.y}`]),queue=[start];
  for(const point of queue)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const x=point.x+dx,y=point.y+dy,key=`${x},${y}`;
    if(map.walkable[y]?.[x]!=='.'||seen.has(key))continue;seen.add(key);queue.push({x,y});
  }
  assert(seen.has(`${goal.x},${goal.y}`),`${map.name}: ${start.x},${start.y} -> ${goal.x},${goal.y}`);
}

test('Route 44 and every Ice Path floor retain a continuous reversible main route',()=>{
  connected('tour_johto_route_44',{x:1,y:15},{x:78,y:15});
  connected('tour_johto_ice_path_1f',{x:1,y:24},{x:31,y:8});
  connected('tour_johto_ice_path_b1f',{x:8,y:7},{x:38,y:38});
  connected('tour_johto_ice_path_b2f',{x:8,y:40},{x:38,y:8});
  connected('tour_johto_ice_path_b3f',{x:8,y:7},{x:30,y:31});
  connected('tour_johto_ice_path_1f',{x:44,y:38},{x:54,y:24});
});

test('choosing a companion again clears every downstream Dragon Den observation',()=>{
  const g=prepared();
  Object.assign(g.save.flags,{blackthornTrainingSpecies:7,blackthornWaterBreathing:true,blackthornRockCompared:true,dragonsDenLakeObserved:true,dragonsDenIslandObserved:true,dragonsDenObservationCompleted:true});
  assert(handleBlackthornLife(g,'tourBlackthornTrainingWater'));
  const choice=g.dialogue!.choices!.find(item=>item.label==='덩쿠리');assert(choice);choice.action();
  assert.equal(g.save.flags.blackthornTrainingSpecies,114);
  assert.equal(g.save.flags.blackthornWaterBreathing,true);
  for(const key of ['blackthornRockCompared','dragonsDenLakeObserved','dragonsDenIslandObserved','dragonsDenObservationCompleted'])assert.equal(g.save.flags[key],undefined,key);
});

test('the complete companion observation chain survives save parsing without changing rewards',()=>{
  const g=prepared(),mon=g.save.party[0],before={hp:mon.hp,experience:mon.experience,money:g.save.money,inventory:{...g.save.inventory}};
  assert(handleBlackthornLife(g,'tourBlackthornTrainingWater'));g.dialogue!.choices![0].action();g.dialogue=null;
  g.save.map='tour_blackthorn_hall';assert(handleBlackthornLife(g,'blackthornHallRockTable'));g.dialogue=null;
  g.save.map='tour_johto_dragons_den';assert(handleBlackthornLife(g,'dragonsDenLakeRail'));g.dialogue=null;
  assert(handleBlackthornLife(g,'dragonsDenIslandStone'));g.dialogue=null;
  g.save.map='tour_johto_dragons_den_shrine';g.save.player={x:12,y:17,facing:'up'};assert(handleBlackthornLife(g,'dragonsDenShrineAltar'));
  const loaded=parseSave(JSON.stringify(g.save));assert(loaded);
  assert.equal(loaded.flags.dragonsDenObservationCompleted,true);
  assert.equal(loaded.flags.blackthornTrainingSpecies,mon.species);
  assert.deepEqual({hp:mon.hp,experience:mon.experience,money:g.save.money,inventory:g.save.inventory},before);
});
