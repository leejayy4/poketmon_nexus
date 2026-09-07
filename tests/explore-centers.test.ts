import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { TOUR_INTERIORS,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { Engine } from '../src/engine';
import { canStand } from '../src/maps';
import { parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';
import { CENTER_SAMPLES } from '../src/explore-center-art';
import { spriteFrame } from '../src/sprites';

const centers=Object.entries(TOUR_INTERIORS).filter(([,r])=>r.style==='center');
test('all 38 reception counters block walking and talk to the nurse from every front tile',()=>{
  assert.equal(centers.length,38);
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{for(const [id,r]of centers){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.save.map=id as TourId;
    const counter=r.reception!;assert.equal(g.map.npcs[0].sprite,'pokecenter_nurse');
    for(let x=counter.x;x<counter.x+counter.w;x++){
      assert(!canStand(g.map,x,counter.y),id);assert(canStand(g.map,x,counter.y+1),id);
      g.save.player={x,y:counter.y+1,facing:'up'};g.save.inventory.potions=2;g.persist();const before=structuredClone(g.save);
      assert.equal(g.interactionHint,'Z 말걸기 · 간호사');g.confirm();
      assert.equal(g.dialogue?.speaker,'간호사');assert(g.dialogue?.pages[0].includes('건강해졌어요'));
      g.dialogue=null;assert.deepEqual(g.save,before);assert.equal(g.battle,null);
    }
  }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
test('revision 15 counter and nurse saves migrate safely while valid room positions and progress survive',()=>{
  for(const [id,r]of centers){
    const g=new Engine();g.exploring=true;const s=g.freshSave();s.map=id as TourId;s.worldRevision=15;
    s.steps=732;s.seconds=1400;s.tourVisited=[id.replace(/_center$/,'') as TourId,id as TourId];
    for(const p of [{x:r.reception!.x,y:r.reception!.y},r.host]){
      s.player={...p,facing:'left'};const loaded=parseSave(JSON.stringify(s));assert(loaded,id);
      assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id as TourId],facing:'down'});
      assert.equal(loaded.worldRevision,TOWN_REVISION);assert.equal(loaded.steps,732);assert.equal(loaded.seconds,1400);
      assert.deepEqual(loaded.flags,s.flags);assert.deepEqual(loaded.tourVisited,s.tourVisited);
    }
    s.player={x:8,y:9,facing:'left'};assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
    s.worldRevision=TOWN_REVISION;s.player={x:r.reception!.x,y:r.reception!.y,facing:'up'};
    assert.equal(parseSave(JSON.stringify(s)),null);
    assert(canStand(TOUR_MAPS[id as TourId],8,10));
  }
});
test('DS interior samples and nurse directional frames fit the downloaded images',async()=>{
  const bg=await sharp('public/assets/center-reference.png').metadata();
  for(const [name,[x,y,w,h]]of Object.entries(CENTER_SAMPLES)){
    assert(x>=0&&y>=0&&x+w<=bg.width!&&y+h<=bg.height!,name);
  }
  const nurse=await sharp('public/assets/pokecenter_nurse.png').metadata();assert.equal(nurse.width,32);
  for(const d of ['up','down','left','right'] as const)assert((spriteFrame(d,false,0,0,false,nurse.height!/32)+1)*32<=nurse.height!);
});
