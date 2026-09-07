import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { canStand } from '../src/maps';
import { TownRoaming } from '../src/explore-roaming';
import { TOUR_POKEMON,TOUR_MAPS,type TourId } from '../src/explore-world';
import { tourMapMarkers,tourMarkerBounds } from '../src/explore-minimap';
import { tourExitPath } from '../src/explore-navigation';
import { parseSave } from '../src/save';
import { encodeSave,decodeSave } from '../src/save-library';
import { TOWN_REVISION } from '../src/town';
const tick=(g:Engine,seconds:number)=>{for(let i=0;i<Math.ceil(seconds/.05);i++)g.update(.05);};
function setup(id='tour_jubilife'){const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);return g;}

test('all 35 Pokemon roam connected clear tiles without overlapping doors, people or minimap hits',()=>{
  for(const [id,n]of Object.entries(TOUR_POKEMON)){
    const base=TOUR_MAPS[id as TourId],r=new TownRoaming(base,n,{x:14,y:11}),seen=new Set<string>();
    assert(r.tiles.length>=3,id+' roaming space');
    for(const p of r.tiles){
      const map={...base,npcs:base.npcs.map(a=>a.id===n.id?{...a,...p}:a)};
      for(const exit of map.warps)assert(tourExitPath(map,{x:14,y:11},exit).length,id+' patrol leaves exits reachable');
      for(const v of Object.values(VECTOR))assert(canStand(map,p.x+v.x,p.y+v.y),id+' clear side');
      const markers=tourMapMarkers(map),self=tourMarkerBounds(map,markers.find(a=>a.id===n.id)!);
      for(const m of markers.filter(a=>a.id!==n.id)){const b=tourMarkerBounds(map,m);assert(self.x+self.w<=b.x||b.x+b.w<=self.x||self.y+self.h<=b.y||b.y+b.h<=self.y,id+' marker separation');}
    }
    for(let i=0;i<600;i++){r.update(.05,{x:14,y:11},undefined,false);seen.add(r.npc.x+','+r.npc.y);assert(r.tiles.some(p=>p.x===r.npc.x&&p.y===r.npc.y));}
    assert(seen.size>=3,id+' actual walking');assert.deepEqual({x:n.x,y:n.y},{x:22,y:16},'shared anchor remains unchanged');
  }
});

test('moving Pokemon reserve both endpoints and release the previous tile on arrival',()=>{
  const g=setup(),r=g.roaming!;tick(g,1.55);assert(r.move);const {from,to}=structuredClone(r.move);
  assert(!canStand(g.map,from.x,from.y));assert(!canStand(g.map,to.x,to.y));assert.equal(g.map.walkable[to.y][to.x],'.','reservation does not paint a wall');
  g.save.player={x:to.x,y:to.y+1,facing:'up'};g.walk('up');assert.equal(g.move,null,'player cannot enter reserved destination');
  tick(g,.4);assert.equal(r.move,null);assert(canStand(g.map,from.x,from.y));assert(!canStand(g.map,to.x,to.y));
  const stopped={x:r.npc.x,y:r.npc.y};tick(g,4);assert.deepEqual({x:r.npc.x,y:r.npc.y},stopped,'nearby player keeps Pokemon still');
  const other=setup();other.save.player={x:23,y:17,facing:'up'};other.walk('up');assert(other.move);other.roaming!.wait=0;other.update(.05);assert.equal(other.roaming!.move,null,'Pokemon yields to an approaching player step');
});

test('menus and dialogue pause roaming and nearby conversations remain available',()=>{
  const g=setup(),r=g.roaming!;tick(g,1.6);assert(r.move);g.panel='menu';const frozen=structuredClone(r.position);tick(g,3);assert.deepEqual(r.position,frozen);
  g.panel='field';tick(g,.4);assert.equal(r.move,null);g.save.player={x:r.npc.x-1,y:r.npc.y,facing:'right'};assert.equal(g.interactionHint,'Z 말걸기 · '+r.npc.name);
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{g.confirm();assert.equal(g.dialogue?.speaker,r.npc.name);const position=structuredClone(r.position);tick(g,5);assert.deepEqual(r.position,position);g.confirm();assert.equal(g.dialogue,null);tick(g,3);assert.deepEqual(r.position,position);}
  finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
  g.save.player={x:14,y:11,facing:'down'};tick(g,3);assert.notDeepEqual({x:r.npc.x,y:r.npc.y},{x:frozen.x,y:frozen.y});
});

test('revision 15 and current saves on the former fixed anchor reload exactly and spawn the Pokemon beside the player',()=>{
  for(const revision of [15,TOWN_REVISION])for(const id of Object.keys(TOUR_POKEMON)){
    const g=setup(id);g.save.player={x:22,y:16,facing:'left'};g.save.steps=234;
    g.save.worldRevision=revision;
    const parsed=parseSave(JSON.stringify(g.save))!;assert(parsed);assert.equal(parsed.worldRevision,TOWN_REVISION);
    const exported=decodeSave(encodeSave(parsed));assert(exported);g.restore(parsed);
    assert.deepEqual(g.save.player,{x:22,y:16,facing:'left'});assert.equal(g.save.steps,234);assert(canStand(g.map,22,16));
    assert(g.roaming!.npc.x!==22||g.roaming!.npc.y!==16);
  }
});

test('navigation recomputes around current Pokemon positions and reserved steps without moving the player',()=>{
  const g=setup();g.setTourDestination('tour_jubilife_hall');const before=structuredClone(g.save.player),first=g.tourNavigation;
  tick(g,1.6);assert(g.roaming!.move);const next=g.tourNavigation;assert.notStrictEqual(next,first);assert.equal(next?.status,'walking');
  for(const p of next!.tiles.slice(1))assert(canStand(g.map,p.x,p.y));
  tick(g,.4);assert.notStrictEqual(g.tourNavigation,next);assert.deepEqual(g.save.player,before);
});

test('roaming state is isolated by engine and resets on map changes or file restoration',()=>{
  const a=setup(),b=setup(),initial=structuredClone(b.roaming!.position);tick(a,2);assert.deepEqual(b.roaming!.position,initial);
  a.exploreTo('tour_pastoria');assert.equal(a.roaming!.base.id,'tour_pastoria');assert.equal(a.roaming!.move,null);
  a.exploreTo('tour_jubilife');assert.deepEqual(a.roaming!.position,initial);tick(a,1.6);assert(a.roaming!.move);
  const checkpoint=structuredClone(a.save);a.restore(checkpoint);assert.equal(a.roaming!.move,null);assert.deepEqual(a.roaming!.position,initial);
});
