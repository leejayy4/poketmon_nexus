import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PLACES,TOUR_MAPS,TOUR_INTERIORS,TOUR_BUILDINGS,TOUR_SPAWNS,TOUR_OUTDOORS,TOUR_EDGES,tourPlaceForMap,type TourId } from '../src/explore-world';
import { PASSAGES,FLOOR_INFO,FLOOR_PARENTS,ROOM_PARENTS,MART_ROOMS,HOME_ROOMS,journeyConnection,journeyItemFlag } from '../src/journey-world';
import { COMPACT_PLACES } from '../src/explore-expansion';
import { canStand,getMap } from '../src/maps';
import { tourExitPath,objectiveInteractionPath,planTourNavigation } from '../src/explore-navigation';
import { newSave,parseSave } from '../src/save';
import { markTourVisit,tourVisitSummary } from '../src/explore-journal';
import { buildExploreArt } from '../src/explore-art';
import { paintJourneyOverlay } from '../src/journey-art';
import type { GameMap } from '../src/types';

test('every same-region city edge has a real route, retaining forests and research transport',()=>{
  assert.equal(Object.keys(PASSAGES).length,33);
  assert.deepEqual(new Set(Object.values(PASSAGES).map(p=>p.kind)),new Set(['road','cave','coast']));
  for(const [a,b] of TOUR_EDGES){
    const p=PLACES.find(p=>p.id===a)!,q=PLACES.find(p=>p.id===b)!;
    if(p.region!==q.region||!TOUR_BUILDINGS[a].length||!TOUR_BUILDINGS[b].length)continue;
    if(a==='tour_jubilife'&&b==='tour_canalave'){assert(getMap(a).warps.some(w=>w.to==='research_path'));continue;}
    const exit=journeyConnection(getMap(a),b)!;assert(exit,`${a} to ${b}`);
    assert(PASSAGES[exit.to],`${a} should enter a route before ${b}`);
    assert(getMap(exit.to).warps.some(w=>w.to===a));assert(getMap(exit.to).warps.some(w=>w.to===b));
  }
  assert(getMap('tour_eterna_forest').warps.some(w=>w.to==='tour_eterna'));
  assert(getMap('tour_coronet').warps.some(w=>w.to==='tour_hearthome'));
  assert(getMap('tour_canalave').warps.some(w=>w.to==='tour_vermilion'));
});

test('routes provide a clear main path, optional grass, accessible signs, traveller and pickup',()=>{
  for(const p of Object.values(PASSAGES)){
    const map=getMap(p.id),spawn=TOUR_SPAWNS[p.id];
    assert.equal(map.width,32);assert.equal(map.height,20);assert(canStand(map,spawn.x,spawn.y));
    for(const event of ['journeySign','journeyWalker','journeyItem'])assert(objectiveInteractionPath(map,spawn,event),p.id+' '+event);
    for(const sign of TOUR_OUTDOORS[p.id].signs)assert(map.warps.some(w=>w.to===sign.destination&&w.entry===sign.direction));
    // Remove grass from the walking graph: both cities must remain reachable.
    const safe:GameMap=structuredClone(map);
    for(const patch of safe.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++)safe.walkable[y]=safe.walkable[y].slice(0,x)+'#'+safe.walkable[y].slice(x+1);
    for(const exit of safe.warps)assert(tourExitPath(safe,spawn,exit).length>0,p.id+' avoids mandatory grass');
    const save=newSave();save.map=p.id;save.player={...spawn,facing:'right'};save.flags[journeyItemFlag(p.id)]=true;
    assert(parseSave(JSON.stringify(save)),p.id+' save');
  }
});

test('all 35 towns have accessible shops and homes, without replacing gym entrances',()=>{
  const towns=PLACES.filter(p=>!COMPACT_PLACES.has(p.id));assert.equal(towns.length,35);
  for(const p of towns){
    const buildings=TOUR_BUILDINGS[p.id],map=getMap(p.id);
    assert(buildings.some(b=>b.room&&MART_ROOMS.has(b.room)),p.name+' mart');
    assert(buildings.some(b=>b.room&&HOME_ROOMS.has(b.room)),p.name+' resident home');
    for(const b of buildings.filter(b=>b.room)){
      const exit=map.warps.find(w=>w.to===b.room)!;assert(exit,p.name+' door');assert.deepEqual({x:exit.x,y:exit.y},b.door);
      assert(tourExitPath(map,TOUR_SPAWNS[p.id],exit).length>0,p.name+' building approach');
      const room=getMap(exit.to),back=room.warps.find(w=>w.to===p.id)!;assert(back,p.name+' return');
      assert.deepEqual(back.spawn,{x:b.door.x,y:b.door.y+1});
    }
  }
  for(const id of MART_ROOMS){
    const room=getMap(id as TourId);assert(objectiveInteractionPath(room,TOUR_SPAWNS[id as TourId],'martClerk'),id+' clerk');
    const counter=TOUR_INTERIORS[id].reception;
    if(counter)for(let x=counter.x;x<counter.x+counter.w;x++){
      assert(canStand(room,x,counter.y+counter.h));assert(room.props.some(p=>p.x===x&&p.y===counter.y&&p.dialogue==='martClerk'));
    }
  }
});

test('visible high buildings have three distinct floors with safe reciprocal staircase landings',()=>{
  const entries=Object.entries(FLOOR_INFO).filter(([,f])=>f.floor===1);assert(entries.length>=15);
  for(const [base] of entries){
    let id=base as TourId;const furniture=new Set<string>();
    for(let floor=1;floor<=3;floor++){
      const map=getMap(id),info=FLOOR_INFO[id];assert.equal(info.floor,floor);assert.equal(info.total,3);
      const room=TOUR_INTERIORS[id];furniture.add(JSON.stringify(room.objects.map(o=>[o.kind,o.name])));
      for(const exit of map.warps){
        assert(tourExitPath(map,TOUR_SPAWNS[id],exit).length>0,id+' stair approach');
        const to=getMap(exit.to);assert(canStand(to,exit.spawn.x,exit.spawn.y));assert(!to.warps.some(w=>w.x===exit.spawn.x&&w.y===exit.spawn.y));
        assert(to.warps.some(w=>w.to===id),id+' reciprocal');
      }
      if(floor>1){assert(!map.warps.some(w=>w.to===ROOM_PARENTS[id].id));assert.equal(map.walkable[13],'#'.repeat(16));}
      if(floor<3){const up=map.warps.find(w=>FLOOR_INFO[w.to]?.floor===floor+1)!;assert(up);assert.equal(FLOOR_PARENTS[up.to],id);id=up.to as TourId;}
    }
    assert.equal(furniture.size,3,base+' different use and furniture on each floor');
  }
});

test('routes do not falsely mark either city arrived or visited, while upper rooms group under their city',()=>{
  const p=Object.values(PASSAGES)[0],save=newSave();save.map=p.id;save.player={...TOUR_SPAWNS[p.id],facing:'right'};markTourVisit(save);
  assert.deepEqual(save.tourVisited,[p.id]);assert.equal(tourVisitSummary(save,p.a.region).interiors,0);
  assert.equal(planTourNavigation(save,p.a.id)?.status,'walking');assert.equal(planTourNavigation(save,p.b.id)?.status,'walking');
  const room='tour_jubilife_hall_3f';save.map=room;save.player={...TOUR_SPAWNS[room],facing:'down'};markTourVisit(save);
  assert(save.tourVisited?.includes('tour_jubilife'));assert(!save.tourVisited?.includes('tour_jubilife_hall_2f'));
  assert.equal(tourPlaceForMap(room)?.id,'tour_jubilife');assert.equal(tourVisitSummary(save,'신오').passages,1);
});

test('shop labels use the existing DB potion price and all centers retain the PC event',()=>{
  const items=JSON.parse(readFileSync('docs/design-data/items.json','utf8'));
  const rows=Array.isArray(items)?items:items.items;const potion=rows.find((i:{slug:string})=>i.slug==='potion');assert.equal(potion.buy,200);
  for(const id of MART_ROOMS)if(id.endsWith('_mart'))assert(TOUR_INTERIORS[id].objects.some(o=>o.pages.some(p=>p.includes('상처약 200원'))));
  for(const room of Object.values(TOUR_INTERIORS).filter(r=>r.style==='center')){
    assert.equal(room.objects[1].event,'tourExhibit1');assert.equal(room.objects[1].name,'포켓몬 보관 PC');
  }
});

test('every new background generates, stairs are painted, and pickup art respects the saved service flag',()=>{
  const calls:{name:string;args:unknown[]}[]=[];
  const ctx=new Proxy({},{get:(_t,key)=>key==='measureText'?()=>({width:20}):(...args:unknown[])=>calls.push({name:String(key),args}),set:()=>true}) as CanvasRenderingContext2D;
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement:()=>({width:0,height:0,getContext:()=>ctx})}});
  const images=new Proxy({},{get:()=>({width:1024,height:1024})}) as Record<string,HTMLImageElement>;
  try{
    for(const id of [...Object.keys(PASSAGES),...Object.keys(ROOM_PARENTS)]){
      calls.length=0;const art=buildExploreArt(images,id),map=getMap(id as TourId);
      assert.equal(art.width,map.width*16);assert.equal(art.height,map.height*16);assert(calls.some(c=>c.name==='drawImage'));
      if(FLOOR_INFO[id])assert(calls.some(c=>c.name==='fillText'&&c.args[0]===FLOOR_INFO[id].floor+'F'),id+' floor display');
    }
    const map=getMap(Object.values(PASSAGES)[0].id);calls.length=0;paintJourneyOverlay(ctx,images,map,{},0);assert(calls.some(c=>c.name==='fillRect'));
    calls.length=0;paintJourneyOverlay(ctx,images,map,{[journeyItemFlag(map.id)]:true},0);assert.equal(calls.length,0);
  }finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
});
