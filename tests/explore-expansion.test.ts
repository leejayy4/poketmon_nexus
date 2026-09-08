import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { parseSave } from '../src/save';
import { canStand } from '../src/maps';
import { TOWN_REVISION } from '../src/town';
import { COMPACT_PLACES } from '../src/explore-expansion';
import { PLACES,TOUR_PLANS,TOUR_BUILDINGS,TOUR_MAPS,TOUR_SPAWNS,SHORT_TOURS,type TourId } from '../src/explore-world';

test('all 35 towns expand while essential areas use their authored dimensions',()=>{
  assert.equal(Object.keys(TOUR_PLANS).length,35);
  assert.equal(new Set(Object.values(TOUR_PLANS).map(p=>p.style)).size,5);
  for(const p of PLACES){
    const m=TOUR_MAPS[p.id];
    if(COMPACT_PLACES.has(p.id)){assert.deepEqual([m.width,m.height],p.id==='tour_eterna_forest'?[32,34]:p.id==='tour_coronet'?[20,30]:SHORT_TOURS.has(p.id)?[20,18]:[28,24]);continue;}
    assert(m.width>28&&m.height>24,p.id);
    assert(TOUR_BUILDINGS[p.id].filter(b=>b.kind==='house').length>=3,p.id);
    const occupied=new Set<string>();
    for(const r of [...TOUR_PLANS[p.id].buildings,...TOUR_PLANS[p.id].features]){
      for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
        assert(x>=2&&x<m.width-2&&y>=3&&y<m.height-2,p.id+' bounds');
        const key=x+','+y;assert(!occupied.has(key),p.id+' overlapping objects '+key);occupied.add(key);
      }
    }
    for(const b of TOUR_BUILDINGS[p.id])assert(canStand(m,b.door.x,b.door.y+1),p.id+' door approach');
  }
});

test('revision 12 saves recover blocked town positions and preserve valid positions and visits',()=>{
  for(const id of Object.keys(TOUR_PLANS) as TourId[]){
    const plan=TOUR_PLANS[id],g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id+'_hall');g.exploreTo(id);
    const feature=plan.features.find(f=>f.x<28&&f.y<24)!;assert(feature,id);
    const s=g.save;s.worldRevision=12;s.player={x:feature.x,y:feature.y,facing:'right'};s.steps=432;s.seconds=765;
    assert(!canStand(TOUR_MAPS[id],s.player.x,s.player.y));
    const loaded=parseSave(JSON.stringify(s))!;assert(loaded,id);
    assert.equal(loaded.worldRevision,TOWN_REVISION);assert.equal(loaded.map,id);
    assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id],facing:'down'});
    assert.equal(loaded.steps,432);assert.equal(loaded.seconds,765);assert.deepEqual(loaded.tourVisited,s.tourVisited);
    s.player={x:14,y:11,facing:'left'};assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player,id+' valid save');
  }
});
