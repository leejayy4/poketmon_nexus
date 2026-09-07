import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { parseSave } from '../src/save';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { TOUR_PLANS,TOUR_BUILDINGS,TOUR_FEATURES,TOUR_MAPS,TOUR_OUTDOORS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { canStand } from '../src/maps';
import { TOWN_REVISION } from '../src/town';

test('six towns and five trails have distinct investigable arrangements while facility doors stay aligned',()=>{
  assert.equal(Object.keys(TOUR_LAYOUTS).length,11);
  assert.equal(TOUR_FEATURES.tour_jubilife.filter(f=>f.kind==='fountain').length,1);
  assert(TOUR_FEATURES.tour_oreburgh.some(f=>f.kind==='rail'));assert(TOUR_FEATURES.tour_hearthome.every(f=>f.kind==='garden'));
  const names=new Set<string>();
  for(const id of Object.keys(TOUR_LAYOUTS) as TourId[]){
    const map=TOUR_MAPS[id];
    for(const f of TOUR_FEATURES[id]){
      const o=TOUR_OUTDOORS[id].objects.find(o=>o.name===f.name)!;assert(o);names.add(o.name);assert.deepEqual(o.pages,[f.description]);
      for(const line of o.pages[0].split('\n'))assert(line.length<=24,line);
      for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)assert(!canStand(map,x,y));
    }
    for(const building of TOUR_BUILDINGS[id].filter(b=>b.room)){
      const {x,y}=building.door;
      const door=map.warps.find(w=>w.to===building.room)!;assert.deepEqual([door.x,door.y],[x,y]);
      assert(TOUR_MAPS[door.to as TourId].warps.some(w=>w.to===id&&w.spawn.x===x&&w.spawn.y===y+1));
    }
  }
  assert.equal(names.size,33);assert.equal(Object.values(TOUR_OUTDOORS).flatMap(o=>o.objects).length,104);
});

test('revision 10 plaza saves relocate only newly blocked positions and preserve visited interiors',()=>{
  for(const [id,x,y]of [['tour_jubilife',14,19],['tour_oreburgh',19,18],['tour_hearthome',14,19]] as const){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id+'_center');g.exploreTo(id);
    const s=g.save;s.worldRevision=10;s.player={x,y,facing:'right'};s.steps=234;s.seconds=567;
    const loaded=parseSave(JSON.stringify(s))!;assert(loaded);assert.equal(loaded.worldRevision,TOWN_REVISION);assert.equal(loaded.map,id);
    assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id],facing:'down'});assert.equal(loaded.steps,234);assert.equal(loaded.seconds,567);assert.deepEqual(loaded.tourVisited,s.tourVisited);
    s.player={x:14,y:11,facing:'left'};assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
  }
});

test('wooden observation paths stay on reachable floor and revision 11 saves recover new scenery overlaps',()=>{
  for(const [id,x,y]of [['tour_eterna',14,18],['tour_pastoria',20,18],['tour_canalave',24,18]] as const){
    const map=TOUR_MAPS[id],g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id+'_hall');g.exploreTo(id);
    const s=g.save;s.worldRevision=11;s.player={x,y,facing:'right'};s.steps=345;s.seconds=678;
    const loaded=parseSave(JSON.stringify(s))!;assert(loaded);assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id],facing:'down'});assert.equal(loaded.steps,345);assert.equal(loaded.seconds,678);assert.deepEqual(loaded.tourVisited,s.tourVisited);
    s.player={x:14,y:11,facing:'left'};assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
    s.worldRevision=TOWN_REVISION;s.player={x,y,facing:'right'};assert.equal(parseSave(JSON.stringify(s)),null);
    const reached=new Set<string>(),queue=[TOUR_SPAWNS[id]];
    for(const p of queue){const key=p.x+','+p.y;if(reached.has(key))continue;reached.add(key);
      for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){const q={x:p.x+dx,y:p.y+dy};if(canStand(map,q.x,q.y)&&!map.warps.some(w=>w.x===q.x&&w.y===q.y)&&!reached.has(q.x+','+q.y))queue.push(q);}}
    for(const [bx,by,w,h]of TOUR_PLANS[id].boardwalks??[])for(let j=by;j<by+h;j++)for(let i=bx;i<bx+w;i++){
      assert.equal(map.walkable[j][i],'.',id+' deck is floor');if(canStand(map,i,j))assert(reached.has(i+','+j),id+' deck reachable');
    }
  }
});
