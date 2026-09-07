import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_INTERIORS,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { Engine,VECTOR } from '../src/engine';
import { canStand } from '../src/maps';
import { newSave,parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';

function tour(){const g=new Engine();g.exploring=true;g.save=g.freshSave();return g}
test('all 76 rooms have three solid exhibits with reachable investigation surfaces',()=>{
  assert.equal(Object.keys(TOUR_INTERIORS).length,76);
  for(const [id,room]of Object.entries(TOUR_INTERIORS)){
    const map=TOUR_MAPS[id as TourId];assert.equal(room.objects.length,3,id);
    const occupied=new Set<string>();
    for(const o of room.objects){
      for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){
        assert(!occupied.has(x+','+y),id+' overlapping furniture');occupied.add(x+','+y);
        assert(!canStand(map,x,y));assert(map.props.some(p=>p.x===x&&p.y===y&&p.dialogue===o.event));
      }
      assert(canStand(map,o.x,o.y+o.h),id+' front approach');
    }
    assert(canStand(map,TOUR_SPAWNS[id as TourId].x,TOUR_SPAWNS[id as TourId].y));
  }
});
test('every exhibit is investigated through player facing and confirm, repeatedly without rewards',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{for(const [id,room]of Object.entries(TOUR_INTERIORS)){
    const g=tour();g.save.map=id as TourId;
    for(const o of room.objects){
      g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
      for(let n=0;n<2;n++){
        g.confirm();assert.equal(g.dialogue?.speaker,o.name);assert.deepEqual(g.dialogue?.pages,o.pages);
        while(g.dialogue){g.dialogue.shown=1000;g.confirm()}
        assert.deepEqual(g.save,before);assert.equal(g.battle,null);
      }
      for(const [dir,v]of Object.entries(VECTOR)){
        const x=o.x-v.x,y=o.y-v.y;if(!canStand(g.map,x,y))continue;
        g.save.player={x,y,facing:dir as keyof typeof VECTOR};g.confirm();assert.equal(g.dialogue?.speaker,o.name);g.dialogue=null;
      }
    }
    g.save.player={x:room.host.x,y:room.reception?room.reception.y+room.reception.h:room.host.y+1,facing:'up'};
    assert(canStand(g.map,g.save.player.x,g.save.player.y));g.confirm();if(room.style==='center')assert(g.dialogue?.pages[0].includes('건강해졌어요'));else assert.deepEqual(g.dialogue?.pages,room.greeting);
  }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
test('revision seven interior saves relocate only obstructed positions and preserve progress',()=>{
  for(const [id,room]of Object.entries(TOUR_INTERIORS)){
    const s=tour().save;s.worldRevision=7;s.map=id as TourId;s.steps=234;s.seconds=456;s.flags.assistantTalks=2;
    const o=room.objects[2];s.player={x:o.x,y:o.y,facing:'left'};
    const loaded=parseSave(JSON.stringify(s));assert(loaded,id);assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id as TourId],facing:'down'});assert.equal(loaded.steps,234);assert.equal(loaded.seconds,456);assert.deepEqual(loaded.flags,s.flags);
    s.player={x:8,y:9,facing:'left'};assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
  }
  const normal=newSave();normal.worldRevision=7;assert.deepEqual(parseSave(JSON.stringify(normal)),{...normal,worldRevision:TOWN_REVISION});
});
test('facility dialogue fits the two-line DS dialogue box and landmark collections are distinct',()=>{
  const collections=new Set<string>();
  for(const [id,room]of Object.entries(TOUR_INTERIORS)){
    if(id.endsWith('_hall')){const signature=JSON.stringify(room.objects.map(o=>[o.name,o.pages]));assert(!collections.has(signature),id);collections.add(signature);}
    for(const page of [...room.greeting,...room.objects.flatMap(o=>o.pages)]){
      assert(page.split('\n').length<=2,id+' too many lines');
      for(const line of page.split('\n'))assert(line.length<=24,id+' dialogue width: '+line);
    }
  }
  assert.equal(collections.size,38);
});
