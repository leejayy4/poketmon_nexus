import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { canStand,getMap } from '../src/maps';
import { tourExitPath } from '../src/explore-navigation';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOWN_REVISION } from '../src/town';

const id='tour_desert',layout=TOUR_LAYOUTS[id];
test('Desert marked paths connect north and south exits and reach signs and guide',()=>{
  const map=getMap(id),paths=new Set<string>();
  assert.deepEqual([map.width,map.height],[20,18]);
  assert.deepEqual(map.warps.map(w=>[w.to,w.x,w.y,w.entry]),[
    ['tour_castelia',10,16,'down'],['tour_nimbasa',10,2,'up'],
  ]);
  for(const [x,y,w,h]of layout.paths)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){
    assert.equal(map.walkable[j][i],'.',`path over rock ${i},${j}`);paths.add(i+','+j);
  }
  for(const warp of map.warps)paths.add(warp.x+','+warp.y);
  const marked={...map,walkable:map.walkable.map((row,y)=>[...row].map((c,x)=>paths.has(x+','+y)?c:'#').join(''))};
  const path=tourExitPath(marked,{x:10,y:3},map.warps[0]);
  assert(path.length>8,'paths connect both exits');
  for(const sign of TOUR_OUTDOORS[id].signs)assert(canStand(marked,sign.x,sign.y+1)||canStand(marked,sign.x,sign.y-1));
  assert(canStand(marked,12,8),'guide approach');
});

test('revision 21 Desert floor saves preserve progress and repair newly blocked rocks',()=>{
  const map=getMap(id);
  for(let y=3;y<=15;y++)for(let x=2;x<=17;x++){
    if((x>=4&&x<=5&&y>=5&&y<=6)||(x>=14&&x<=15&&y>=12&&y<=13))continue;
    if(map.npcs.some(n=>n.x===x&&n.y===y)||TOUR_OUTDOORS[id].signs.some(s=>s.x===x&&s.y===y))continue;
    const save=newSave();save.worldRevision=21;save.map=id;save.tourVisited=[id];save.player={x,y,facing:'left'};
    grantPokemon(save,7);save.flags.departureCleared=true;save.inventory={pokeBalls:4,potions:3};save.steps=234;save.seconds=567;
    const loaded=parseSave(JSON.stringify(save));assert(loaded,`old floor ${x},${y}`);
    assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,canStand(map,x,y)?save.player:{...TOUR_SPAWNS[id],facing:'down'});
    for(const key of ['party','inventory','badges','keyItems','money','flags','steps','seconds','tourVisited'] as const)assert.deepEqual(loaded[key],save[key]);
    if(!canStand(map,x,y)){save.worldRevision=TOWN_REVISION;assert.equal(parseSave(JSON.stringify(save)),null);}
  }
});

test('Desert preserves original rocks and sign events while adding 3 new investigable features',()=>{
  const outdoor=TOUR_OUTDOORS[id];
  assert.equal(outdoor.objects.length,5);
  assert.deepEqual(outdoor.objects.slice(0,2).map(o=>[o.event,o.name]),[['tourOutdoor0','모래 속 유적석'],['tourOutdoor1','모래 속 유적석']]);
  assert.deepEqual(outdoor.objects.slice(2).map(o=>o.name),['모래에 묻힌 유적 기둥','바람이 쌓은 모래 언덕','유적 외곽 석벽']);
  assert.deepEqual(outdoor.signs.map(s=>[s.event,s.destination]),[['tourExit0','tour_castelia'],['tourExit1','tour_nimbasa']]);
  for(const obj of outdoor.objects)assert(obj.cells.some(c=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>canStand(getMap(id),c.x+dx,c.y+dy))),obj.name+' reachable');
});
