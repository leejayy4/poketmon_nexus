import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_INTERIORS,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { Engine,VECTOR } from '../src/engine';
import { canStand } from '../src/maps';
import { newSave,parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';
import { MART_ROOMS } from '../src/journey-world';

function tour(){const g=new Engine();g.exploring=true;g.save=g.freshSave();return g}
function goldenrodChoice(id:string,event:string):string|undefined{
  if(id==='tour_goldenrod_station'&&event==='tourHost')return '라디오 타워 안내';
  if(id==='tour_goldenrod_hall'&&['tourHost','tourExhibit0'].includes(event))return '동료 소개 녹음';
  if((id==='tour_goldenrod_hall_2f'&&['tourHost','tourDetail3_4'].includes(event))||(id==='tour_goldenrod_hall_3f'&&['tourHost','tourDetail3_9'].includes(event)))return '34번도로 안내';
  if(/^tour_goldenrod_home[123]$/.test(id)&&['tourHost','tourDetail4_7'].includes(event))return '동료 기술 준비';
  return undefined;
}

test('every room has solid furniture with reachable investigation surfaces',()=>{
  assert(Object.keys(TOUR_INTERIORS).length>=76);
  for(const [id,room]of Object.entries(TOUR_INTERIORS)){
    const map=TOUR_MAPS[id as TourId];assert(room.objects.length>0,id);
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
for(const [id,room]of Object.entries(TOUR_INTERIORS))test('room investigation and optional activity cancellation preserve progress: '+id,()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{
    const g=tour();g.save.map=id as TourId;
    for(const o of room.objects){
      const choice=goldenrodChoice(id,o.event);
      if(choice){
        g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
        for(let n=0;n<2;n++){
          g.confirm();assert(g.dialogue?.choices?.some(c=>c.label===choice),id+' activity');
          g.cancel();assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);assert.equal(g.battle,null);
        }continue;
      }
      if(id==='tour_cinnabar_hall'&&['tourExhibit0','tourExhibit2'].includes(o.event)){
        g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
        for(let n=0;n<2;n++){
          g.confirm();assert.equal(g.dialogue?.speaker,o.event==='tourExhibit0'?'화산암 관찰':'홍련 서식 관찰판');
          assert(g.dialogue?.choices?.some(c=>c.label===(o.event==='tourExhibit0'?'북동쪽 절벽':'현지 동료·기술 관찰')));
          g.cancel();assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);
        }continue;
      }
      if(id==='tour_eterna_hall'&&o.event==='tourExhibit1'){
        g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
        g.confirm();assert.equal(g.dialogue?.speaker,'역사관 답사 책상');assert(g.dialogue?.choices?.some(c=>c.label==='답사 동료 고르기'));
        g.cancel();assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);continue;
      }
      if(id==='tour_pallet_hall'&&o.event==='tourExhibit0'){
        g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
        g.confirm();assert.equal(g.dialogue?.speaker,'기술 관찰 장치');assert(g.dialogue?.choices?.length);
        g.cancel();assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);continue;
      }
      if(id==='tour_viridian_hall'&&['tourExhibit1','tourExhibit2'].includes(o.event)){
        g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
        for(let n=0;n<2;n++){
          g.confirm();assert(g.dialogue?.choices?.some(c=>c.label===(o.event==='tourExhibit1'?'태초마을 안내':'숲 기록 비교')));
          g.cancel();assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);
        }
        continue;
      }
      if(room.style==='center'&&o.event==='tourExhibit1'){
        g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);g.confirm();
        assert(g.dialogue?.choices?.some(c=>c.label==='포켓몬 맡기기'));assert(g.dialogue?.choices?.some(c=>c.label==='포켓몬도감'));g.dialogue=null;assert.deepEqual(g.save,before);continue;
      }
      g.save.player={x:o.x,y:o.y+o.h,facing:'up'};const before=structuredClone(g.save);
      for(let n=0;n<2;n++){
        g.confirm();assert.equal(g.dialogue?.speaker,o.name);assert.deepEqual(g.dialogue?.pages,o.pages);
        for(let page=0;g.dialogue&&page<12;page++){g.dialogue.shown=1000;g.confirm()}
        assert.equal(g.dialogue,null,id+' investigation finishes');
        assert.deepEqual(g.save,before);assert.equal(g.battle,null);
      }
      for(const [dir,v]of Object.entries(VECTOR)){
        const x=o.x-v.x,y=o.y-v.y;if(!canStand(g.map,x,y))continue;
        g.save.player={x,y,facing:dir as keyof typeof VECTOR};g.confirm();assert.equal(g.dialogue?.speaker,o.name);g.dialogue=null;
      }
    }
    g.save.player={x:room.host.x,y:room.reception?room.reception.y+room.reception.h:room.host.y+1,facing:'up'};
    assert(canStand(g.map,g.save.player.x,g.save.player.y));g.confirm();if(room.style==='center')assert(g.dialogue?.pages[0].includes('건강해졌어요'));else if(MART_ROOMS.has(id))assert(g.dialogue?.choices?.some(c=>c.label==='상처약 200원'));else if(id==='tour_cinnabar_hall')assert(g.dialogue?.choices?.some(c=>c.label==='북동쪽 절벽'));else if(id==='tour_eterna_hall')assert(g.dialogue?.choices?.some(c=>c.label==='옛 지도와 비교'));else if(id==='tour_viridian_hall')assert(g.dialogue?.choices?.some(c=>c.label==='센터로 안내'));else if(goldenrodChoice(id,'tourHost'))assert(g.dialogue?.choices?.some(c=>c.label===goldenrodChoice(id,'tourHost')));else assert.deepEqual(g.dialogue?.pages,room.greeting);
  }finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
test('revision seven interior saves relocate only obstructed positions and preserve progress',()=>{
  for(const [id,room]of Object.entries(TOUR_INTERIORS)){
    const s=tour().save;s.worldRevision=7;s.map=id as TourId;s.steps=234;s.seconds=456;s.flags.assistantTalks=2;
    const o=room.objects.at(-1)!;s.player={x:o.x,y:o.y,facing:'left'};
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
