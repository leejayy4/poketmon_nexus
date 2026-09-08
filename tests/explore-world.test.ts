import test from 'node:test';
import assert from 'node:assert/strict';
import { PLACES,TOUR_MAPS,TOUR_SPAWNS,TOUR_EDGES,TOUR_BUILDINGS,TOUR_FEATURES,SHORT_TOURS } from '../src/explore-world';
import { grantPokemon } from '../src/pokemon';
import { Engine,VECTOR } from '../src/engine';
import { MAPS,canStand,canEnter,getMap,getWorldOutdoors } from '../src/maps';
import { newSave,parseSave } from '../src/save';
import { encodeSave,decodeSave,checkpoint } from '../src/save-library';
function tour(){const g=new Engine();g.save=g.freshSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;return g}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}
function ui(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
test('all 43 exterior places and four regions form one connected walking graph',()=>{
  assert.equal(PLACES.length,43);assert.equal(new Set(PLACES.map(p=>p.region)).size,4);const seen=new Set(['tour_jubilife']),q=['tour_jubilife'];for(let i=0;i<q.length;i++)for(const [a,b]of TOUR_EDGES){const next=a===q[i]?b:b===q[i]?a:null;if(next&&!seen.has(next)){seen.add(next);q.push(next)}}assert.equal(seen.size,43);
  for(const id of SHORT_TOURS){const map=TOUR_MAPS[id as keyof typeof TOUR_MAPS];assert.deepEqual([map.width,map.height],id==='tour_eterna_forest'?[32,34]:id==='tour_coronet'?[20,30]:[20,18]);}
});
test('every tour doorway and regional connection moves to a valid save and can be revisited',()=>{
  for(const map of Object.values(TOUR_MAPS).map(m=>getMap(m.id,{departureCleared:true})))for(const w of map.warps){const g=tour();g.save.map=map.id;const v=VECTOR[w.entry];g.save.player={x:w.x-v.x,y:w.y-v.y,facing:w.entry};assert(canStand(g.map,g.save.player.x,g.save.player.y),map.id+' approach');step(g,'Arrow'+w.entry[0].toUpperCase()+w.entry.slice(1));assert.equal(g.save.map,w.to);assert.deepEqual(g.save.player,{...w.spawn,facing:w.facing});assert(parseSave(JSON.stringify(g.save)),map.id+' saved arrival');const target=getMap(w.to,g.save.flags);assert(target.warps.some(back=>back.to===map.id),map.id+' return exit');}
});
test('the western route and expanded Jubilife return preserve the adventure party',()=>{
  const g=tour();g.save.map='route_s01';g.save.player={x:3,y:12,facing:'left'};const party=structuredClone(g.save.party);step(g,'ArrowLeft');assert.equal(g.save.map,'tour_jubilife');assert.deepEqual(g.save.player,{x:37,y:24,facing:'left'});step(g,'ArrowRight');assert.equal(g.save.map,'route_s01');assert.deepEqual(g.save.party,party);assert(g.save.flags.departureCleared);
});
test('tour buildings and features have collision; every non-enterable house can be investigated',()=>{
  for(const p of PLACES){const map=TOUR_MAPS[p.id];for(const r of [...TOUR_BUILDINGS[p.id],...TOUR_FEATURES[p.id]])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const door='room'in r&&r.room&&r.door.x===x&&r.door.y===y;assert.equal(canStand(map,x,y),Boolean(door),p.id+' foundation '+x+','+y)}for(const prop of map.props.filter(p=>p.dialogue==='tourHouse'))assert(canStand(map,prop.x,prop.y+1),p.id+' house approach');}
});
test('developer map jump preserves progress and cannot bypass dialogue, battle or movement',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{const g=tour(),before=structuredClone(g.save);g.say('안내',['대화 중']);const dialogue=g.dialogue;g.exploreTo('tour_snowpoint');assert.equal(g.dialogue,dialogue);assert.equal(g.save.map,before.map);g.dialogue=null;g.exploreTo('tour_snowpoint');assert.equal(g.save.map,'tour_snowpoint');assert.deepEqual(g.save.party,before.party);assert.deepEqual(g.save.flags,before.flags);assert.deepEqual(g.save.badges,before.badges);g.walk('down');g.exploreTo('tour_blackthorn');assert.equal(g.save.map,'tour_snowpoint');g.move=null;g.event('roark');while(g.dialogue)g.confirm();assert(g.battle);g.exploreTo('tour_blackthorn');assert.equal(g.save.map,'tour_snowpoint');}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
test('expanded map saves round trip as adventures; legacy test imports preserve current progress',()=>{
  const g=tour();g.exploreTo('tour_blackthorn');const file=decodeSave(encodeSave(g.save))!;assert(file);assert.equal(file.save.map,'tour_blackthorn');const normal=new Engine();normal.restore(file.save);assert.equal(normal.save.map,'tour_blackthorn');assert.deepEqual(normal.save.party,g.save.party);
  const legacy=newSave();legacy.flags.exploration=true;legacy.map='tour_snowpoint';legacy.player={...TOUR_SPAWNS.tour_snowpoint,facing:'down'};const parsed=parseSave(JSON.stringify(legacy))!;assert(parsed);normal.restore(parsed);assert.equal(normal.save.map,'tour_snowpoint');assert.deepEqual(normal.save.party,g.save.party);assert.deepEqual(normal.save.flags,g.save.flags);assert(!normal.save.flags.exploration);assert(parseSave(JSON.stringify(normal.save)));
});
test('every tour spawn reaches all entrances, guides and house investigation positions',()=>{
  for(const map of Object.values(TOUR_MAPS)){const spawn=TOUR_SPAWNS[map.id as keyof typeof TOUR_SPAWNS],q=[spawn],seen=new Set<string>();for(let i=0;i<q.length;i++){const{x,y}=q[i],key=x+','+y;if(seen.has(key))continue;seen.add(key);for(const[dir,v]of Object.entries(VECTOR)){const a=x+v.x,b=y+v.y;if(canEnter(map,a,b,dir as keyof typeof VECTOR)&&!map.warps.some(w=>w.x===a&&w.y===b))q.push({x:a,y:b})}}for(const w of map.warps){const v=VECTOR[w.entry];assert(seen.has((w.x-v.x)+','+(w.y-v.y)),map.id+' exit')}for(const n of [...map.npcs,...map.props])assert(Object.values(VECTOR).some(v=>seen.has((n.x+v.x)+','+(n.y+v.y))),map.id+' interaction');}
});
test('tour guides repeat their map’s real exit directions and destinations',()=>ui(()=>{
  const g=tour();
  for(const place of PLACES){g.save.map=place.id;g.save.player={...TOUR_SPAWNS[place.id],facing:'down'};const signs=getWorldOutdoors(g.map)!.signs;g.event('tourGuide');assert.deepEqual(g.dialogue?.pages.slice(1),signs.map(sign=>sign.pages[0]));g.dialogue=null;}
}));
test('legacy exploration URL uses the same adventure storage namespace',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'location');try{Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?explore=1&qa=world-test'}});const a=new Engine();assert.equal(a.exploring,false);assert(a.storageKey.endsWith(':qa:world-test'));Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?qa=world-test'}});const b=new Engine();assert(!b.exploring);assert.equal(a.storageKey,b.storageKey);}finally{if(old)Object.defineProperty(globalThis,'location',old);else Reflect.deleteProperty(globalThis,'location')}
});
