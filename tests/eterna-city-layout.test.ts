import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand,getMap } from '../src/maps';
import { TOUR_BUILDINGS,TOUR_FEATURES,TOUR_SPAWNS } from '../src/explore-world';
import { ETERNA_CITY_SIZE } from '../src/eterna-city-layout';

test('Eterna keeps its original district and reaches the expanded southern boundary',()=>{
  const map=getMap('tour_eterna');
  assert.deepEqual([map.width,map.height],[ETERNA_CITY_SIZE.width,ETERNA_CITY_SIZE.height]);
  assert(TOUR_FEATURES.tour_eterna.some(f=>f.name==='남쪽길 오래된 나무터'));
  assert(TOUR_FEATURES.tour_eterna.some(f=>f.name==='숲지기들의 묘목밭'));
  const south=map.warps.find(w=>w.entry==='down')!;
  assert.deepEqual({x:south.x,y:south.y},{x:14,y:62});

  const targets=[south,...map.warps.filter(w=>TOUR_BUILDINGS.tour_eterna.some(b=>b.room===w.to))];
  const queue=[TOUR_SPAWNS.tour_eterna],seen=new Set<string>();
  for(const p of queue){
    const key=`${p.x},${p.y}`;if(seen.has(key))continue;seen.add(key);
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){
      const q={x:p.x+dx,y:p.y+dy},next=`${q.x},${q.y}`;
      if(canStand(map,q.x,q.y)&&!seen.has(next))queue.push(q);
    }
  }
  for(const target of targets)assert(seen.has(`${target.x},${target.y}`),`reachable ${target.to}`);
  for(const p of [{x:14,y:40},{x:30,y:35},{x:40,y:18}])assert(p.x<map.width&&p.y<map.height,'existing coordinate retained');
});
