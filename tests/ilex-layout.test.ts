import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { canStand,getMap } from '../src/maps';
import { tourExitPath } from '../src/explore-navigation';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOWN_REVISION } from '../src/town';

const id='tour_ilex';
test('Ilex marked roads lead only to real exits and the observation spur stays inside the forest',()=>{
  const map=getMap(id),paths=new Set<string>();
  assert.deepEqual([map.width,map.height],[20,18]);assert.equal(map.terrain,undefined);
  assert.deepEqual(map.warps.map(w=>[w.to,w.x,w.y,w.entry]),[
    ['tour_route_34',10,2,'up'],['tour_azalea',18,9,'right'],
  ]);
  for(const [x,y,w,h]of TOUR_LAYOUTS[id].paths)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){
    assert(canStand(map,i,j),`marked path blocked ${i},${j}`);
    assert(i>2&&j<15,'closed west/south boundaries must not look like exits');paths.add(i+','+j);
  }
  for(const w of map.warps)paths.add(w.x+','+w.y);
  const trail={...map,walkable:map.walkable.map((r,y)=>[...r].map((c,x)=>paths.has(x+','+y)?c:'#').join(''))};
  for(const [start,exit]of [[{x:10,y:3},map.warps[1]],[{x:17,y:9},map.warps[0]],[{x:10,y:14},map.warps[0]],[{x:10,y:14},map.warps[1]]] as const)
    assert(tourExitPath(trail,start,exit).length>1,'roads and observation end connect to both exits');
  for(const sign of TOUR_OUTDOORS[id].signs)assert(canStand(trail,sign.x,sign.y+1));
  assert(canStand(trail,12,8));assert(canStand(trail,10,10));
});

test('revision 20 Ilex floor saves relocate only tree overlaps without losing progress',()=>{
  const map=getMap(id);
  for(let y=3;y<=15;y++)for(let x=2;x<=17;x++){
    if(map.npcs.some(n=>n.x===x&&n.y===y)||TOUR_OUTDOORS[id].signs.some(s=>s.x===x&&s.y===y))continue;
    const save=newSave();save.worldRevision=20;save.map=id;save.tourVisited=[id];save.player={x,y,facing:'left'};
    grantPokemon(save,7);save.party[0].hp=9;save.flags.departureCleared=true;
    save.inventory={pokeBalls:4,potions:3};save.steps=234;save.seconds=567;
    const loaded=parseSave(JSON.stringify(save));assert(loaded,`old floor ${x},${y}`);
    assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,canStand(map,x,y)?save.player:{...TOUR_SPAWNS[id],facing:'down'});
    for(const key of ['party','inventory','badges','keyItems','money','flags','steps','seconds','tourVisited'] as const)assert.deepEqual(loaded[key],save[key]);
    if(!canStand(map,x,y)){save.worldRevision=TOWN_REVISION;assert.equal(parseSave(JSON.stringify(save)),null);}
  }
  const elsewhere=newSave();elsewhere.worldRevision=20;elsewhere.map='tour_viridian_forest';elsewhere.player={x:11,y:8,facing:'left'};
  assert.deepEqual(parseSave(JSON.stringify(elsewhere))?.player,elsewhere.player);
});

test('Ilex retains original observation, signs and guide while each new grove is approachable',()=>{
  const outdoor=TOUR_OUTDOORS[id],map=getMap(id);
  assert.equal(outdoor.objects.length,4);
  assert.deepEqual([outdoor.objects[0].event,outdoor.objects[0].name],['tourOutdoor0','숲의 나무']);
  assert.deepEqual(outdoor.signs.map(s=>[s.event,s.destination]),[['tourExit0','tour_route_34'],['tourExit1','tour_azalea']]);
  assert.deepEqual(map.npcs.map(n=>[n.id,n.x,n.y,n.dialogue]),[['tourGuide',12,7,'tourGuide']]);
  for(const obj of outdoor.objects)for(const c of obj.cells)
    assert([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>canStand(map,c.x+dx,c.y+dy)),obj.name+' surface reachable');
});
