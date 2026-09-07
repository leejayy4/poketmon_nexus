import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { Renderer } from '../src/renderer';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { awardGym } from '../src/gyms';
import { WORLD_GYMS,worldSpawn } from '../src/unified-world';
import { getMap,ACTIVE_MAPS } from '../src/maps';
import { tourMapMarkers,tourMarkerBounds } from '../src/explore-minimap';
import { planTourNavigation,tourPassageLabel } from '../src/explore-navigation';

function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='tour_oreburgh';g.save.player={...worldSpawn(g.save.map)!,facing:'down'};return g}
function renderer(g:Engine){const context=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement;return new Renderer(g,canvas,canvas)}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}

test('field map opens with M or touch and retains the unchanged adventure save',()=>{
  const g=game(),r=renderer(g),before=structuredClone(g.save);g.press('m');assert(g.fieldMap);g.press('m',true);assert(g.fieldMap);g.press('m');assert(!g.fieldMap);r.lower();r.click(187,28);assert(g.fieldMap);r.lower();r.click(212,180);assert(!g.fieldMap);assert.deepEqual(g.save,before);assert.equal(g.tourNavigation,null);
});

test('map controls cannot bypass dialogue, menus, battle, movement or transition locks',()=>{
  for(const state of ['dialogue','menu','battle','move','transition']){const g=game();if(state==='dialogue')g.dialogue={speaker:'test',pages:['test'],page:0,shown:0,selected:0};if(state==='menu')g.panel='menu';if(state==='battle')g.battle={} as any;if(state==='move')g.move={from:{x:14,y:11},to:{x:15,y:11},elapsed:0,duration:1};if(state==='transition')g.transition=.2;const before=structuredClone(g.save);g.press('m');g.guideObjective();assert(!g.fieldMap,state);assert(!g.followingObjective,state);assert.equal(g.tourDestination,null);assert.deepEqual(g.save,before);}
});

test('all four gym markers guide through real expanded city doors without granting a badge',()=>{
  for(const [city,gym]of WORLD_GYMS){const g=game();g.save.map=city;g.save.player={...worldSpawn(city)!,facing:'down'};const marker=tourMapMarkers(g.map).find(m=>m.destination===gym)!;assert(marker);assert.equal(marker.kind,'gym');const before=structuredClone(g.save),r=renderer(g);g.fieldMap=true;r.lower();const b=tourMarkerBounds(g.map,marker);r.click(b.cx,b.cy);assert.deepEqual(g.save,before);const route=g.tourNavigation!;assert.equal(route.exit?.to,gym);assert.equal(tourPassageLabel(route.exit!),'입구');
    for(let i=1;i<route.tiles.length;i++){const a=route.tiles[i-1],b=route.tiles[i],dir=Object.entries(VECTOR).find(([,v])=>a.x+v.x===b.x&&a.y+v.y===b.y)![0];step(g,'Arrow'+dir[0].toUpperCase()+dir.slice(1));}
    assert.equal(g.save.map,gym);assert.equal(g.tourNavigation?.status,'arrived');assert.deepEqual(g.save.badges,[]);assert(parseSave(JSON.stringify(g.save)));
  }
});

test('objective guidance tracks the next badge and switches to recovery only while needed',()=>{
  const g=game(),before=structuredClone(g.save);g.guideObjective();assert.equal(g.tourNavigation?.destination,'oreburgh_gym');assert.deepEqual(g.save,before);awardGym(g.save,'roark');assert.equal(g.tourNavigation?.destination,'eterna_gym');g.save.party[0].hp=1;assert.equal(g.tourNavigation?.destination,'tour_oreburgh_center');g.healParty();assert.equal(g.tourNavigation?.destination,'eterna_gym');g.setTourDestination('tour_jubilife');assert(!g.followingObjective);g.save.party[0].hp=1;assert.equal(g.tourNavigation?.destination,'tour_jubilife');g.setTourDestination(null);assert.equal(g.tourNavigation,null);
});

test('starter objective guides from the bedroom to the lab and respects the departure gate',()=>{
  const g=new Engine();g.save=newSave();g.guideObjective();assert.deepEqual(g.tourNavigation?.maps,['bedroom','home','town','lab']);assert.equal(g.tourNavigation?.exit?.to,'home');assert.equal(planTourNavigation(g.save,'oreburgh_gym')?.status,'blocked');assert(tourMapMarkers(getMap('town')).some(m=>m.destination==='lab'));g.restore(game().save);assert.equal(g.tourNavigation?.destination,'oreburgh_gym');assert.equal(new Engine().followingObjective,false);
});

test('active-world map markers fit their map and point to real doors or people',()=>{
  let gyms=0;for(const map of Object.values(ACTIVE_MAPS)){for(const marker of tourMapMarkers(map)){const b=tourMarkerBounds(map,marker);assert(b.x>=0&&b.x+b.w<=256&&b.y>=49&&b.y+b.h<170,map.id);if(marker.destination)assert(map.warps.some(w=>w.to===marker.destination&&w.x===marker.x&&w.y===marker.y));else assert(map.npcs.some(n=>n.id===marker.id));if(marker.kind==='gym')gyms++;}}assert.equal(gyms,4);
});
