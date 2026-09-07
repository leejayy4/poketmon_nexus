import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { canStand,getMap } from '../src/maps';
import { tourExitPath } from '../src/explore-navigation';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOWN_REVISION } from '../src/town';

const id='tour_viridian_forest';
test('Viridian Forest has two marked routes around its central grove and accessible signs and guide',()=>{
  const map=getMap(id),paths=new Set<string>();
  assert.deepEqual([map.width,map.height],[20,18]);assert.equal(map.terrain,undefined);
  assert.deepEqual(map.warps.map(w=>[w.to,w.x,w.y,w.entry]),[
    ['tour_viridian',10,16,'down'],['tour_pewter',10,2,'up'],
  ]);
  for(const [x,y,w,h]of TOUR_LAYOUTS[id].paths)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){
    assert.equal(map.walkable[j][i],'.',`path over scenery ${i},${j}`);paths.add(i+','+j);
  }
  for(const warp of map.warps)paths.add(warp.x+','+warp.y);
  const marked={...map,walkable:map.walkable.map((row,y)=>[...row].map((c,x)=>paths.has(x+','+y)?c:'#').join(''))};
  for(const sign of TOUR_OUTDOORS[id].signs)assert(canStand(marked,sign.x,sign.y+1));
  assert(canStand(marked,12,8));assert(canStand(marked,10,10));
  // Each branch must work even if the other branch is unavailable.
  for(const blockedColumns of [[6,7],[13]]){
    const branch={...marked,walkable:marked.walkable.map((row,y)=>[...row].map((c,x)=>y>=6&&y<=9&&blockedColumns.includes(x)?'#':c).join(''))};
    for(const [start,to]of [[{x:10,y:3},map.warps[0]],[{x:10,y:15},map.warps[1]]] as const){
      const path=tourExitPath(branch,start,to);assert(path.length>14,'both detours reach either exit');
    }
  }
});

test('revision 19 Viridian Forest saves preserve progress and repair only newly blocked trees',()=>{
  const map=getMap(id);
  for(let y=3;y<=15;y++)for(let x=2;x<=17;x++){
    if(map.npcs.some(n=>n.x===x&&n.y===y)||TOUR_OUTDOORS[id].signs.some(s=>s.x===x&&s.y===y))continue;
    const save=newSave();save.worldRevision=19;save.map=id;save.tourVisited=[id];save.player={x,y,facing:'left'};
    grantPokemon(save,7);save.party[0].hp=9;save.flags.departureCleared=true;save.inventory={pokeBalls:4,potions:3};save.steps=234;save.seconds=567;
    const loaded=parseSave(JSON.stringify(save));assert(loaded,`old floor ${x},${y}`);
    assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,canStand(map,x,y)?save.player:{...TOUR_SPAWNS[id],facing:'down'});
    for(const key of ['party','inventory','badges','keyItems','money','flags','steps','seconds','tourVisited'] as const)assert.deepEqual(loaded[key],save[key]);
    if(!canStand(map,x,y)){save.worldRevision=TOWN_REVISION;assert.equal(parseSave(JSON.stringify(save)),null);}
  }
  const elsewhere=newSave();elsewhere.worldRevision=19;elsewhere.map='tour_coronet';elsewhere.player={x:9,y:12,facing:'left'};
  assert.deepEqual(parseSave(JSON.stringify(elsewhere))?.player,elsewhere.player);
});

test('Viridian Forest retains existing observation and exit IDs with no encounter or story replacement',()=>{
  const outdoor=TOUR_OUTDOORS[id],map=getMap(id);
  assert.equal(outdoor.objects.length,5);
  assert.deepEqual([outdoor.objects[0].event,outdoor.objects[0].name],['tourOutdoor0','숲의 나무']);
  assert.deepEqual(outdoor.signs.map(s=>[s.event,s.destination]),[['tourExit0','tour_viridian'],['tourExit1','tour_pewter']]);
  assert.deepEqual(map.npcs.map(n=>[n.id,n.x,n.y,n.dialogue]),[['tourGuide',12,7,'tourGuide']]);
  for(const obj of outdoor.objects)assert(obj.cells.some(c=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>canStand(map,c.x+dx,c.y+dy))),obj.name+' reachable');
});
