import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { canStand,getMap } from '../src/maps';
import { tourExitPath } from '../src/explore-navigation';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOWN_REVISION } from '../src/town';
import { Engine } from '../src/engine';

const id='tour_eterna_forest',layout=TOUR_LAYOUTS[id];
test('Eterna Forest has a continuous encounter-free marked trail in both directions',()=>{
  const map=getMap(id),paths=new Set<string>();
  assert.deepEqual([map.width,map.height],[20,18]);
  assert.deepEqual(map.terrain,[{kind:'tallGrass',x:4,y:10,w:4,h:3}]);
  for(const [x,y,w,h]of layout.paths)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){
    assert.equal(map.walkable[j][i],'.',`path over obstacle at ${i},${j}`);
    assert(!map.terrain!.some(r=>i>=r.x&&i<r.x+r.w&&j>=r.y&&j<r.y+r.h),'grass must stay optional');
    paths.add(i+','+j);
  }
  for(const warp of map.warps)paths.add(warp.x+','+warp.y);
  const trail={...map,walkable:map.walkable.map((row,y)=>[...row].map((cell,x)=>paths.has(x+','+y)?cell:'#').join(''))};
  const north=map.warps.find(w=>w.to==='tour_eterna')!,south=map.warps.find(w=>w.to==='tour_jubilife')!;
  assert.deepEqual([north.x,north.y,north.entry],[10,2,'up']);
  assert.deepEqual([south.x,south.y,south.entry],[10,16,'down']);
  assert(tourExitPath(trail,{x:10,y:15},north).length>14,'bends replace the straight crossing');
  assert(tourExitPath(trail,{x:10,y:3},south).length>14);
  assert(canStand(trail,12,8),'guide remains approachable');
  for(let y=10;y<=12;y++)assert(canStand(trail,8,y)&&canStand(map,7,y),'side trail reaches the existing grass');
});

test('revision 17 forest saves keep progress and relocate only new tree overlaps',()=>{
  const map=getMap(id);
  for(let y=3;y<=15;y++)for(let x=2;x<=17;x++){
    if(map.npcs.some(n=>n.x===x&&n.y===y)||TOUR_OUTDOORS[id].signs.some(s=>s.x===x&&s.y===y))continue;
    const save=newSave();save.worldRevision=17;save.map=id;save.player={x,y,facing:'left'};
    grantPokemon(save,7);save.flags.departureCleared=true;save.inventory={pokeBalls:4,potions:2};save.steps=123;save.seconds=456;
    const loaded=parseSave(JSON.stringify(save));assert(loaded,`old floor ${x},${y}`);
    assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,canStand(map,x,y)?save.player:{...TOUR_SPAWNS[id],facing:'down'});
    for(const key of ['party','inventory','badges','keyItems','money','flags','steps','seconds'] as const)assert.deepEqual(loaded[key],save[key]);
  }
  const elsewhere=newSave();elsewhere.worldRevision=17;
  assert.deepEqual(parseSave(JSON.stringify(elsewhere))?.player,elsewhere.player);
});

test('existing forest investigation and sign IDs stay stable with four additional groves',()=>{
  const outdoor=TOUR_OUTDOORS[id];
  assert.equal(outdoor.objects[0].event,'tourOutdoor0');assert.equal(outdoor.objects[0].name,'숲의 나무');
  assert.equal(outdoor.objects.length,5);
  assert.deepEqual(outdoor.signs.map(s=>[s.event,s.destination]),[['tourExit0','tour_jubilife'],['tourExit1','tour_eterna']]);
  for(const object of outdoor.objects.slice(1))assert(object.cells.some(cell=>[
    [cell.x-1,cell.y],[cell.x+1,cell.y],[cell.x,cell.y-1],[cell.x,cell.y+1],
  ].some(([x,y])=>canStand(getMap(id),x,y))),object.name+' accessible');
});

test('forest guide describes the actual north and south exits while retaining healing and supplies',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{
    const game=new Engine();game.save=newSave();grantPokemon(game.save,7);game.save.flags.departureCleared=true;
    game.save.map=id;game.save.player={x:12,y:8,facing:'up'};game.save.party[0].hp=1;
    const flags=structuredClone(game.save.flags);game.confirm();
    assert.equal(game.dialogue?.speaker,'길 안내원');
    assert(game.dialogue?.pages[1].includes('북쪽은 영원시티, 남쪽은 축복시티'));
    assert.equal(game.save.party[0].hp,game.save.party[0].maxHp);assert.equal(game.save.inventory.potions,2);
    assert.deepEqual(game.save.flags,flags);assert.deepEqual(game.save.badges,[]);
  }finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
