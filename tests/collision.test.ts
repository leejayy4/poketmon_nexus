import { TOUR_SPAWNS } from '../src/explore-world';
import { SINNOH_STARTS } from '../src/sinnoh-maps';
import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVE_MAPS as MAPS,canEnter,canStand } from '../src/maps';
import { Engine,VECTOR } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { TOWN_BUILDINGS } from '../src/town';

function settle(g:Engine){for(let i=0;i<20;i++)g.update(.04)}
test('every door and stair requires the exact tile and approach direction',()=>{
  for(const map of Object.values(MAPS))for(const w of map.warps){
    for(const dir of ['up','down','left','right'] as const){
      assert.equal(canEnter(map,w.x,w.y,dir),dir===w.entry,`${map.id}: ${dir}`);
      const v=VECTOR[dir],from={x:w.x-v.x,y:w.y-v.y};
      if(!canStand(map,from.x,from.y))continue;
      const g=new Engine();g.save={...newSave(),map:map.id,player:{...from,facing:dir}};
      g.walk(dir);settle(g);
      if(dir===w.entry){assert.equal(g.save.map,w.to);assert.deepEqual(g.save.player,{...w.spawn,facing:w.facing})}
      else{assert.equal(g.save.map,map.id);assert.deepEqual(g.save.player,{...from,facing:dir})}
    }
  }
});
test('walking parallel to the front of every town door never warps',()=>{
  for(const w of MAPS.town.warps){const g=new Engine();g.save={...newSave(),map:'town',player:{x:w.x-1,y:w.y+1,facing:'right'}};g.walk('right');settle(g);g.walk('right');settle(g);assert.equal(g.save.map,'town');assert.equal(g.transition,0)}
});
test('lab annex floor and both new characters are reachable from the entrance',()=>{
  const m=MAPS.lab,seen=new Set<string>(),q=[[6,11]];
  for(let i=0;i<q.length;i++){const [x,y]=q[i],key=`${x},${y}`;if(seen.has(key)||!canStand(m,x,y))continue;seen.add(key);for(const v of Object.values(VECTOR))q.push([x+v.x,y+v.y]);}
  for(const tile of ['11,4','12,4','14,5','16,5','17,5','16,6','19,6'])assert(seen.has(tile),tile);
  for(const id of ['eeveeResearcher','eevee']){const n=m.npcs.find(n=>n.id===id)!;assert(n);assert(Object.values(VECTOR).some(v=>seen.has(`${n.x+v.x},${n.y+v.y}`)))}
  assert(!canStand(m,16,7),'black void below the annex remains solid');
});
test('buildings block foundations while side and rear paths remain walkable',()=>{
  for(const b of TOWN_BUILDINGS){assert(canStand(MAPS.town,b.x,b.y-1),b.id+' rear');assert(canStand(MAPS.town,b.x-1,b.y),b.id+' side');assert(!canStand(MAPS.town,b.x,b.y),b.id+' foundation')}
  for(const [x,y] of [[4,4],[36,4],[36,26],[4,26]])assert(canStand(MAPS.town,x,y));
  for(const [x,y] of [[4,3],[37,8],[8,27],[3,8]])assert(!canStand(MAPS.town,x,y));
});
test('revision two saves preserve progress and relocate only newly blocked positions',()=>{
  const s=newSave();s.worldRevision=2;s.map='town';s.player={x:33,y:6,facing:'up'};s.flags.assistantTalks=3;
  assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
  s.player={x:4,y:3,facing:'down'};const migrated=parseSave(JSON.stringify(s));assert(migrated);assert.deepEqual(migrated.player,{x:8,y:25,facing:'down'});assert.equal(migrated.flags.assistantTalks,3);
});
test('every walkable floor cell in every map is connected, except the guarded exit',()=>{
  const starts:Record<string,number[]>={...Object.fromEntries(Object.entries(TOUR_SPAWNS).map(([id,p])=>[id,[p.x,p.y]])),...SINNOH_STARTS,bedroom:[6,6],home:[6,7],town:[8,25],lab:[6,11],neighbor:[6,7],cottage:[6,7],route_s01:[29,12],jubilife:[21,12],oreburgh:[12,20],jubilife_center:[8,11],oreburgh_center:[8,11],oreburgh_gym:[8,13]};
  for(const m of Object.values(MAPS)){
    const q=[starts[m.id]],seen=new Set<string>();
    for(let i=0;i<q.length;i++){const [x,y]=q[i],key=`${x},${y}`;if(seen.has(key))continue;seen.add(key);for(const [dir,v]of Object.entries(VECTOR)){const a=x+v.x,b=y+v.y;if(canEnter(m,a,b,dir as keyof typeof VECTOR)&&!m.warps.some(w=>w.x===a&&w.y===b))q.push([a,b]);}}
    for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){
      if(!canStand(m,x,y)||m.warps.some(w=>w.x===x&&w.y===y)||(m.id==='town'&&x===2&&y===15))continue;
      assert(seen.has(`${x},${y}`),`${m.id}: disconnected floor at ${x},${y}`);
    }
  }
});
