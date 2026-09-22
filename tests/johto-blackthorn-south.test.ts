import { newSave } from '../src/save';
import assert from 'node:assert/strict';
import test from 'node:test';
import {TOUR_MAPS} from '../src/explore-world';
import {JOHTO_ROUTE_29,JOHTO_ROUTE_45,JOHTO_ROUTE_46} from '../src/johto-blackthorn-south';
import {encounterPool,wildPokemon} from '../src/runtime-encounters';
import {paintJohtoBlackthornSouth,paintJohtoBlackthornSouthMotion} from '../src/johto-blackthorn-south-art';
import {tourMapMarkers,tourMarkerBounds,tourMinimapLayout} from '../src/explore-minimap';
import {Engine} from '../src/engine';
import {grantPokemon} from '../src/pokemon';
import {handleJohtoBlackthornSouthLife} from '../src/johto-blackthorn-south-life';
import {handleBlackthornLife} from '../src/blackthorn-life';
import type {GameMap,Point} from '../src/types';

function connected(map:GameMap,start:Point,end:Point){
  const blocked=new Set([...map.npcs,...map.props].map(item=>`${item.x},${item.y}`));
  const queue=[start],seen=new Set([`${start.x},${start.y}`]);
  for(let i=0;i<queue.length;i++){
    const point=queue[i];
    if(point.x===end.x&&point.y===end.y)return true;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const next={x:point.x+dx,y:point.y+dy},key=`${next.x},${next.y}`;
      if(next.x<0||next.y<0||next.x>=map.width||next.y>=map.height||map.walkable[next.y][next.x]==='#'||blocked.has(key)||seen.has(key))continue;
      seen.add(key);queue.push(next);
    }
  }
  return false;
}

test('Blackthorn south exit names Route 45, Route 46 and the Route 29 junction explicitly',()=>{
  const city=TOUR_MAPS.tour_blackthorn;
  assert(city.warps.some(warp=>warp.x===16&&warp.y===54&&warp.to===JOHTO_ROUTE_45));
  assert(TOUR_MAPS[JOHTO_ROUTE_45].warps.some(warp=>warp.to==='tour_blackthorn'));
  assert(TOUR_MAPS[JOHTO_ROUTE_45].warps.some(warp=>warp.to===JOHTO_ROUTE_46));
  assert(TOUR_MAPS[JOHTO_ROUTE_46].warps.some(warp=>warp.to===JOHTO_ROUTE_29));
  assert(TOUR_MAPS[JOHTO_ROUTE_29].warps.some(warp=>warp.to===JOHTO_ROUTE_46));
});

test('Route 45 and Route 46 ledges descend one way while side climbs preserve return travel',()=>{
  const route45=TOUR_MAPS[JOHTO_ROUTE_45],ledge45=route45.warps.find(warp=>warp.to===JOHTO_ROUTE_45)!;
  assert.equal(ledge45.entry,'down');assert(ledge45.spawn.y>ledge45.y);
  assert(connected(route45,ledge45.spawn,{x:20,y:3}));
  const route46=TOUR_MAPS[JOHTO_ROUTE_46],ledge46=route46.warps.find(warp=>warp.to===JOHTO_ROUTE_46)!;
  assert.equal(ledge46.entry,'down');assert(ledge46.spawn.y>ledge46.y);
  assert(connected(route46,ledge46.spawn,{x:18,y:3}));
});

test('Route dimensions follow the terrain flow and Route 29 does not invent missing towns',()=>{
  assert.deepEqual([TOUR_MAPS[JOHTO_ROUTE_45].width,TOUR_MAPS[JOHTO_ROUTE_45].height],[40,96]);
  assert.deepEqual([TOUR_MAPS[JOHTO_ROUTE_46].width,TOUR_MAPS[JOHTO_ROUTE_46].height],[36,72]);
  assert.deepEqual([TOUR_MAPS[JOHTO_ROUTE_29].width,TOUR_MAPS[JOHTO_ROUTE_29].height],[80,32]);
  assert.deepEqual(TOUR_MAPS[JOHTO_ROUTE_29].warps.map(warp=>warp.to),[JOHTO_ROUTE_46]);
});

test('Route 45 and Route 46 expose authored mountain encounters while Route 29 stays a boundary',()=>{
  assert.deepEqual(encounterPool(JOHTO_ROUTE_45)?.slots.map(slot=>[slot.speciesId,slot.weight]),[[74,100]]);
  assert.deepEqual(encounterPool(JOHTO_ROUTE_46)?.slots.map(slot=>[slot.speciesId,slot.weight]),[[19,25],[21,35],[74,40]]);
  assert.equal(encounterPool(JOHTO_ROUTE_29),undefined);
  assert.equal(wildPokemon(JOHTO_ROUTE_45,()=>0)?.met,'성도 45번도로');
  assert.equal(wildPokemon(JOHTO_ROUTE_46,()=>0.99)?.species,74);
});

test('both mountain routes provide optional trainers outside the safe main route',()=>{
  const route45=TOUR_MAPS[JOHTO_ROUTE_45],route46=TOUR_MAPS[JOHTO_ROUTE_46];
  assert(route45.npcs.some(npc=>npc.dialogue==='tourRoute45Trainer'));
  assert(route46.npcs.some(npc=>npc.dialogue==='tourRoute46Trainer'));
  for(const map of [route45,route46])for(const terrain of map.terrain)assert.equal(terrain.kind,'tallGrass');
  assert(connected(route45,{x:20,y:3},{x:20,y:92}));
  assert(connected(route46,{x:18,y:3},{x:18,y:68}));
});

test('south mountain art distinguishes cliffs, ledges, runoff and moving side grass',()=>{
  const colors:string[]=[],draws:number[][]=[],state={fillStyle:''};
  const c=new Proxy(state,{get:(target,key)=>key==='fillStyle'?target.fillStyle:key==='fillRect'?((...args:number[])=>colors.push(target.fillStyle)):key==='drawImage'?((_image:unknown,...args:number[])=>draws.push(args)):(()=>{}),set:(target,key,value)=>{if(key==='fillStyle')target.fillStyle=String(value);return true;}}) as unknown as CanvasRenderingContext2D;
  const grass={} as HTMLImageElement;
  paintJohtoBlackthornSouth(c,TOUR_MAPS[JOHTO_ROUTE_45],grass);
  paintJohtoBlackthornSouthMotion(c,TOUR_MAPS[JOHTO_ROUTE_45],1);
  assert(colors.includes('#65756f')||colors.includes('#71827a'));
  assert(colors.includes('#c1b88c'));
  assert(colors.includes('#567c83'));
  assert(colors.includes('#587b55')||colors.includes('#6e8e5d'));
  assert(draws.length>0,'static tall grass tiles');
});

test('wide and tall south maps fit the minimap and expose official-number exits',()=>{
  for(const id of [JOHTO_ROUTE_45,JOHTO_ROUTE_46,JOHTO_ROUTE_29] as const){
    const map=TOUR_MAPS[id],layout=tourMinimapLayout(map);
    assert(map.width*layout.scale<=228);assert(map.height*layout.scale<=106);
    for(const marker of tourMapMarkers(map)){const bounds=tourMarkerBounds(map,marker);assert(bounds.cx>=14&&bounds.cx<=242);assert(bounds.cy>=56&&bounds.cy<=162);}
  }
  assert(tourMapMarkers(TOUR_MAPS[JOHTO_ROUTE_45]).some(marker=>marker.kind==='exit'&&marker.name.includes('성도 46번도로')));
  assert(tourMapMarkers(TOUR_MAPS[JOHTO_ROUTE_46]).some(marker=>marker.kind==='exit'&&marker.name.includes('성도 29번도로 · 동쪽 합류부')));
  assert(tourMapMarkers(TOUR_MAPS[JOHTO_ROUTE_29]).some(marker=>marker.kind==='exit'&&marker.name.includes('성도 46번도로')));
});

test('Blackthorn and route travelers guide capture, optional battles and return without changing progress',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';assert(grantPokemon(g.save,7));g.save.flags.departureCleared=true;
  g.save.map='tour_blackthorn';g.save.player={x:32,y:25,facing:'down'};const before=structuredClone(g.save);
  assert(handleBlackthornLife(g,'tourGuide'));const south=g.dialogue?.choices?.find(choice=>choice.label==='남쪽 산길');assert(south);south.action();assert.equal(g.tourNavigation?.destination,JOHTO_ROUTE_45);assert.deepEqual(g.save,before);
  g.setTourDestination(null);g.dialogue=null;g.save.map=JOHTO_ROUTE_45;g.save.player={x:20,y:48,facing:'up'};
  assert(handleJohtoBlackthornSouthLife(g,'journeyWalker'));const grass=g.dialogue?.choices?.find(choice=>choice.label==='45번 풀밭 안내');assert(grass);grass.action();assert.equal(g.tourDestination,JOHTO_ROUTE_45);assert.equal(g.tourEvent,'tourRoute45Habitat');
});
