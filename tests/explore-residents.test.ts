import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { Engine,VECTOR } from '../src/engine';
import { canStand } from '../src/maps';
import { TOUR_RESIDENTS,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';
import { planTourNavigation } from '../src/explore-navigation';

test('35 towns have 70 distinct local conversations with existing DS sprite assets and clear approaches',()=>{
  assert.equal(Object.keys(TOUR_RESIDENTS).length,35);
  const texts=new Set<string>();
  for(const [id,residents]of Object.entries(TOUR_RESIDENTS)){
    assert.equal(residents.length,2);const map=TOUR_MAPS[id as TourId];
    for(const n of residents){
      assert(existsSync(new URL('../public/assets/'+n.sprite+'.png',import.meta.url)));assert.equal(map.npcs.filter(a=>a.x===n.x&&a.y===n.y).length,1);
      assert(!canStand(map,n.x,n.y));assert(!map.warps.some(w=>w.x===n.x&&w.y===n.y));assert(Object.values(VECTOR).every(v=>canStand(map,n.x+v.x,n.y+v.y)));
      texts.add(n.pages.join(''));for(const page of n.pages){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=24,line)}
    }
  }
  assert.equal(texts.size,70);
});

for(const [id,residents]of Object.entries(TOUR_RESIDENTS))test('residents remain approachable and declining requests preserves progress: '+id,()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{for(const n of residents){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);g.save.player={x:n.x,y:n.y+1,facing:'up'};const before=structuredClone(g.save);
    assert.equal(g.interactionHint,'Z 말걸기 · '+n.name);
    for(let i=0;i<2;i++){
      g.confirm();assert.equal(g.dialogue?.speaker,n.name);
      if(id==='tour_eterna'&&n.dialogue==='tourResident0'){assert(g.dialogue?.pages.some(p=>p.includes('산책길 가장자리')));assert(g.dialogue?.pages.some(p=>p.includes('시계 기록')));}
      else assert.deepEqual(g.dialogue?.pages.slice(0,n.pages.length),n.pages);
      if(g.dialogue?.choices)g.cancel();else for(let page=0;g.dialogue&&page<12;page++){g.dialogue.shown=1000;g.confirm();}
      assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);
    }
    assert.equal(g.battle,null);
  }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});

test('revision 9 saves overlapping new residents move safely while visits and valid positions survive',()=>{
  for(const [id,residents]of Object.entries(TOUR_RESIDENTS))for(const n of residents){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);const s=g.save;s.worldRevision=9;s.steps=123;s.seconds=456;s.player={x:n.x,y:n.y,facing:'left'};
    const loaded=parseSave(JSON.stringify(s))!;assert(loaded);assert.equal(loaded.worldRevision,TOWN_REVISION);assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id as TourId],facing:'down'});
    assert.deepEqual(loaded.tourVisited,s.tourVisited);assert.equal(loaded.steps,123);assert.equal(loaded.seconds,456);assert.deepEqual(loaded.flags,s.flags);
    s.player.y++;assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
    s.player.y--;s.worldRevision=TOWN_REVISION;assert.equal(parseSave(JSON.stringify(s)),null);
  }
});

test('facility routes avoid the newly occupied resident tiles',()=>{
  for(const [id,residents]of Object.entries(TOUR_RESIDENTS)){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);
    for(const suffix of ['center','hall']){const route=planTourNavigation(g.save,(id+'_'+suffix) as TourId)!;assert.equal(route.status,'walking');for(const t of route.tiles)assert(!residents.some(n=>n.x===t.x&&n.y===t.y))}
  }
});
