import test from 'node:test';
import assert from 'node:assert/strict';
import { PASSAGES, PASSAGE_LOOP_OPENINGS } from '../src/journey-world';
import { getMap } from '../src/maps';
import { newSave, parseSave } from '../src/save';

const dirs=[[1,0],[-1,0],[0,1],[0,-1]] as const;
function reachable(map:ReturnType<typeof getMap>, start:[number,number], allowed:(x:number,y:number)=>boolean){
  const seen=new Set([start.join(',')]),queue=[start];
  while(queue.length){const [x,y]=queue.shift()!;for(const [dx,dy] of dirs){const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;if(!seen.has(key)&&allowed(nx,ny)){seen.add(key);queue.push([nx,ny]);}}}
  return seen;
}
function baseOpen(bend:number,x:number,y:number){
  const inRect=(rx:number,ry:number,rw:number,rh:number)=>x>=rx&&x<rx+rw&&y>=ry&&y<ry+rh;
  return (inRect(1,9,10,3)||inRect(9,Math.min(9,bend),4,Math.abs(bend-9)+3)||inRect(10,bend,13,3)||inRect(21,Math.min(9,bend),4,Math.abs(bend-9)+3)||inRect(23,9,8,3)||inRect(14,4,6,12)||inRect(13,4,8,4))&&!(x===15&&y===5);
}
const passageIds=Object.keys(PASSAGES);

test('all 33 passages add kind-specific outer loop openings only',()=>{
  assert.equal(passageIds.length,33);
  for(const id of passageIds){
    const passage=PASSAGES[id],map=getMap(id as any,newSave().flags),openings=PASSAGE_LOOP_OPENINGS[passage.kind];
    assert(openings.length>=20);
    let newlyOpened=0;
    for(const point of openings){assert.equal(map.walkable[point.y][point.x],'.',`${id} loop ${point.x},${point.y}`);if(!baseOpen(passage.bend,point.x,point.y))newlyOpened++;}
    assert(newlyOpened>=12,`${id} must add a visible outer loop`);
    assert.equal(map.walkable[5][15],'#',`${id} blocked island preserved`);
    for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(baseOpen(passage.bend,x,y))assert.equal(map.walkable[y][x],'.',`${id} old tile ${x},${y}`);
  }
});

test('each loop joins the existing route and keeps both exits reachable without grass',()=>{
  for(const id of passageIds){
    const map=getMap(id as any,newSave().flags),grass=new Set<string>();
    for(const r of map.terrain??[])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)grass.add(`${x},${y}`);
    const passable=(x:number,y:number)=>map.walkable[y]?.[x]==='.'&&!grass.has(`${x},${y}`);
    const fromLeft=reachable(map,[1,10],passable),fromRight=reachable(map,[30,10],passable);
    assert(fromLeft.has('30,10'),`${id} left to right`);assert(fromRight.has('1,10'),`${id} right to left`);
    const passage=PASSAGES[id];for(const point of PASSAGE_LOOP_OPENINGS[passage.kind])assert(reachable(map,[point.x,point.y],passable).has('1,10'),`${id} loop joins`);
  }
});

test('core props and NPC remain reachable and kind layouts differ',()=>{
  const samples={road:'tour_pass_hearthome_veilstone',cave:'tour_pass_jubilife_oreburgh',coast:'tour_pass_vermilion_cerulean'} as const;
  const sets=Object.values(samples).map(id=>PASSAGE_LOOP_OPENINGS[PASSAGES[id].kind].map(p=>`${p.x},${p.y}`).join('|'));
  assert.equal(new Set(sets).size,3);
  for(const id of Object.values(samples)){const map=getMap(id as any,newSave().flags),passable=(x:number,y:number)=>map.walkable[y]?.[x]==='.';const from=reachable(map,[1,10],passable);for(const p of [...map.props,...map.npcs]){const access=[[p.x,p.y],[p.x-1,p.y],[p.x+1,p.y],[p.x,p.y-1],[p.x,p.y+1]].some(([x,y])=>from.has(`${x},${y}`));assert(access,`${id} core ${p.x},${p.y}`);}}
});

test('existing passage save coordinates survive parsing without a revision change',()=>{
  for(const id of passageIds){const s=newSave();s.map=id as typeof s.map;s.player={x:2,y:10,facing:'right'};const loaded=parseSave(JSON.stringify(s));assert(loaded);assert.equal(loaded!.map,id);assert.deepEqual(loaded!.player,s.player);assert.equal(loaded!.worldRevision,s.worldRevision);}
});
