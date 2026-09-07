import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { ACTIVE_MAPS,MAPS,getMap,canStand } from '../src/maps';
import { WORLD_ALIASES,WORLD_GYMS,worldGymDoor,worldMapId,worldSpawn } from '../src/unified-world';
import { TOUR_INTERIORS,TOUR_SPAWNS } from '../src/explore-world';
import { newSave,parseSave,SAVE_KEY } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { awardGym,GYMS } from '../src/gyms';
import { tourExitPath } from '../src/explore-navigation';
import type { MapId } from '../src/types';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};return s}
function ui(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;g.dialogue&&i<100;i++)g.confirm();assert.equal(g.dialogue,null)}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}

test('one world reaches every active map from the bedroom after departure',()=>{
  const queue:MapId[]=['bedroom'],seen=new Set(queue);
  for(let i=0;i<queue.length;i++)for(const w of getMap(queue[i],{departureCleared:true}).warps){assert.equal(worldMapId(w.to),w.to);assert(ACTIVE_MAPS[w.to]);assert(canStand(getMap(w.to,{departureCleared:true}),w.spawn.x,w.spawn.y),queue[i]+' arrival');if(!seen.has(w.to)){seen.add(w.to);queue.push(w.to)}}
  assert(Object.keys(ACTIVE_MAPS).length>131);assert.deepEqual([...seen].sort(),Object.keys(ACTIVE_MAPS).sort());
  assert(!getMap('town').warps.some(w=>w.to==='route_s01'));
  assert(getMap('tour_jubilife').warps.some(w=>w.to==='research_path'));
});

test('four expanded city gym doors have reachable approaches and reciprocal safe exits',()=>{
  for(const [city,gym]of WORLD_GYMS){const map=getMap(city),door=worldGymDoor(city)!,warp=map.warps.find(w=>w.to===gym)!;assert.deepEqual({x:warp.x,y:warp.y},door);assert(!map.props.some(p=>p.x===door.x&&p.y===door.y));assert(tourExitPath(map,worldSpawn(city)!,warp).length>1);
    const g=new Engine();g.save=ready();g.save.map=city;g.save.player={x:door.x,y:door.y+1,facing:'up'};const party=structuredClone(g.save.party);step(g,'ArrowUp');assert.equal(g.save.map,gym);const exit=g.map.warps[0],v=VECTOR[exit.entry];g.save.player={x:exit.x-v.x,y:exit.y-v.y,facing:exit.entry};step(g,'ArrowDown');assert.equal(g.save.map,city);assert.deepEqual(g.save.party,party);assert(parseSave(JSON.stringify(g.save)));
  }
});

test('all fourteen legacy city aliases migrate to safe expanded coordinates without losing progress',()=>{
  for(const [id,target]of Object.entries(WORLD_ALIASES)){const s=ready();s.worldRevision=16;s.map=id as MapId;s.player={x:3,y:3,facing:'left'};s.healingPoint='oreburgh_center';awardGym(s,'roark');s.party[0].experience=17;s.party[0].hp=7;s.steps=321;s.seconds=456;
    const loaded=parseSave(JSON.stringify(s));assert(loaded,id);assert.equal(loaded.map,target);assert.deepEqual(loaded.player,{...worldSpawn(target as MapId),facing:'down'});assert.equal(loaded.healingPoint,'tour_oreburgh_center');for(const key of ['party','inventory','badges','keyItems','money','flags','steps','seconds'] as const)assert.deepEqual(loaded[key],s[key],id+' '+key);
    s.player.x=MAPS[s.map].width;assert.equal(parseSave(JSON.stringify(s)),null,id+' invalid position must not be repaired');
  }
});

test('legacy exploration is merged once into main progress and its source storage stays intact',()=>{
  const descriptors=['localStorage','location'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)] as const),store=new Map<string,string>(),key=SAVE_KEY+':qa:merge-world';
  Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?explore=1&qa=merge-world'}});Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>store.set(k,v)}});
  try{const main=ready();main.worldRevision=16;main.map='oreburgh';main.player={x:12,y:20,facing:'up'};awardGym(main,GYMS[0].id);const legacy=newSave();legacy.worldRevision=16;legacy.flags.exploration=true;legacy.map='tour_snowpoint';legacy.player={...TOUR_SPAWNS.tour_snowpoint,facing:'down'};legacy.tourVisited=['tour_snowpoint','tour_blackthorn'];const oldKey=key.replace(SAVE_KEY,SAVE_KEY+':explore'),raw=JSON.stringify(legacy);store.set(key,JSON.stringify(main));store.set(oldKey,raw);
    const g=new Engine();assert.equal(g.storageKey,key);assert.equal(g.save.map,'tour_oreburgh');assert.deepEqual(g.save.party,main.party);assert.deepEqual(g.save.badges,main.badges);assert(g.save.tourVisited?.includes('tour_blackthorn'));assert(!g.save.flags.exploration);g.persist();assert.equal(store.get(oldKey),raw);
    g.restore(newSave());const reset=new Engine();assert.equal(reset.save.map,'bedroom');assert(!reset.save.tourVisited?.includes('tour_blackthorn'));assert.equal(store.get(oldKey),raw);
    store.delete(key);const onlyLegacy=new Engine();assert.equal(onlyLegacy.save.map,'tour_snowpoint');assert(!onlyLegacy.save.flags.exploration);assert.equal(onlyLegacy.save.party.length,0);assert(parseSave(JSON.stringify(onlyLegacy.save)));
  }finally{for(const [key,desc]of descriptors)if(desc)Object.defineProperty(globalThis,key,desc);else Reflect.deleteProperty(globalThis,key)}
});

test('every expanded center heals the adventure party, supplies potions and becomes a safe return point',()=>ui(()=>{
  for(const [id,room]of Object.entries(TOUR_INTERIORS).filter(([,room])=>room.style==='center')){const g=new Engine();g.save=ready();g.save.map=id as MapId;g.save.party[0].hp=0;g.save.inventory.potions=0;g.save.player={x:room.reception!.x,y:room.reception!.y+1,facing:'up'};g.confirm();assert.equal(g.dialogue?.speaker,'간호사');finish(g);assert.equal(g.save.healingPoint,id);assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert.equal(g.save.inventory.potions,2);g.save.map='oreburgh_gym';g.save.party[0].hp=0;g.returnHome();assert.equal(g.save.map,id);assert(canStand(g.map,g.save.player.x,g.save.player.y));assert(parseSave(JSON.stringify(g.save)));}
}));

test('graphic test travel can save at every active map without granting adventure progress',()=>{
  for(const map of Object.values(ACTIVE_MAPS)){const g=new Engine();g.save=newSave();g.save.map=map.id;const p=worldSpawn(map.id)??map.warps.map(w=>({x:w.x-VECTOR[w.entry].x,y:w.y-VECTOR[w.entry].y})).find(p=>canStand(g.map,p.x,p.y))!;g.save.player={...p,facing:'down'};assert(parseSave(JSON.stringify(g.save)),map.id);assert.deepEqual(g.save.party,[]);assert.deepEqual(g.save.flags,{});}
});
