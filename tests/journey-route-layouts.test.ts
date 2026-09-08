import test from 'node:test';
import assert from 'node:assert/strict';
import { getMap, canStand } from '../src/maps';
import { PASSAGES, PASSAGE_LOOP_OPENINGS } from '../src/journey-world';
import { JOURNEY_ROUTE_LAYOUTS } from '../src/journey-route-layouts';
import { newSave, parseSave } from '../src/save';
import type { GameMap } from '../src/types';

const ids=Object.keys(JOURNEY_ROUTE_LAYOUTS);
const key=(x:number,y:number)=>`${x},${y}`;
function reachable(map:GameMap,avoidGrass=false){
  const grass=new Set<string>();
  if(avoidGrass)for(const r of map.terrain??[])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)grass.add(key(x,y));
  const queue=[[2,10]],seen=new Set([key(2,10)]);
  for(let i=0;i<queue.length;i++){
    const [x,y]=queue[i];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy,k=key(nx,ny);
      if(!seen.has(k)&&canStand(map,nx,ny)&&!grass.has(k)){seen.add(k);queue.push([nx,ny]);}
    }
  }
  return seen;
}

test('authored routes connect both cities with grass-free walking and reciprocal landings',()=>{
  for(const id of ids){
    const map=getMap(id as GameMap['id']),layout=JOURNEY_ROUTE_LAYOUTS[id];
    assert.deepEqual([map.width,map.height],[layout.width,layout.height]);
    const safe=reachable(map,true);
    assert(safe.has(key(1,10)),id+' west');assert(safe.has(key(map.width-2,10)),id+' east');
    assert(safe.has(key(30,10)),id+' former exit is now a checkpoint');
    assert(!map.warps.some(w=>w.x===30&&w.y===10));
    for(const warp of map.warps){
      const city=getMap(warp.to),back=city.warps.find(w=>w.to===id)!;
      assert(back,id+' city returns');assert(canStand(map,back.spawn.x,back.spawn.y));
      assert.equal(back.spawn.x,warp.entry==='left'?2:map.width-3);
      assert(canStand(city,warp.spawn.x,warp.spawn.y),id+' city landing');
    }
  }
});

test('authored routes offer several accessible encounter clearings and preserve NPC and pickup access',()=>{
  for(const id of ids){
    const map=getMap(id as GameMap['id']),seen=reachable(map);
    assert((map.terrain?.length??0)>=3);
    for(const area of map.terrain??[]){
      assert(area.w*area.h>=10);
      for(let y=area.y;y<area.y+area.h;y++)for(let x=area.x;x<area.x+area.w;x++)assert(seen.has(key(x,y)),id+' accessible grass '+key(x,y));
    }
    for(const p of [...map.props,...map.npcs])assert([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has(key(p.x+dx,p.y+dy))),id+' interaction '+key(p.x,p.y));
    for(const r of JOURNEY_ROUTE_LAYOUTS[id].landmarks)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)assert.equal(map.walkable[y][x],'#',id+' landmark collision');
  }
});

test('all former ground coordinates and saved progress survive additive route expansion',()=>{
  for(const id of ids){
    const map=getMap(id as GameMap['id']),p=PASSAGES[id],bend=p.bend;
    const oldRects=[{x:1,y:9,w:10,h:3},{x:9,y:Math.min(9,bend),w:4,h:Math.abs(bend-9)+3},{x:10,y:bend,w:13,h:3},{x:21,y:Math.min(9,bend),w:4,h:Math.abs(bend-9)+3},{x:23,y:9,w:8,h:3},{x:14,y:4,w:6,h:12},{x:13,y:4,w:8,h:4}];
    const oldPoints=oldRects.flatMap(r=>Array.from({length:r.h},(_,j)=>Array.from({length:r.w},(_,i)=>({x:r.x+i,y:r.y+j}))).flat()).concat(PASSAGE_LOOP_OPENINGS[p.kind]);
    for(const point of oldPoints)if(point.x!==15||point.y!==5)assert.equal(map.walkable[point.y][point.x],'.',id+' legacy ground');
    assert.equal(map.walkable[5][15],'#');
    assert(map.npcs.some(n=>n.x===18&&n.y===5&&n.dialogue==='journeyWalker'));
    assert(map.props.some(p=>p.x===15&&p.y===5&&p.dialogue==='journeyItem'));
    const save=newSave();save.map=map.id;save.player={x:30,y:10,facing:'right'};save.flags['pickup:'+id]=true;
    const loaded=parseSave(JSON.stringify(save));assert(loaded);assert.deepEqual(loaded.player,save.player);assert.equal(loaded.flags['pickup:'+id],true);
  }
});

test('authored routes have distinct paths and retain solid exterior borders except their exits',()=>{
  assert.equal(new Set(ids.map(id=>JSON.stringify(JOURNEY_ROUTE_LAYOUTS[id].safePath))).size,3);
  for(const id of ids){const map=getMap(id as GameMap['id']);
    assert(map.walkable.every(row=>row.length===map.width));
    assert.equal(map.walkable[0],'#'.repeat(map.width));assert.equal(map.walkable[map.height-1],'#'.repeat(map.width));
    for(const row of map.walkable){assert.equal(row[0],'#');assert.equal(row[map.width-1],'#');}
  }
});
