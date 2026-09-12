import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_OUTDOORS,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { canStand,getMap,getWorldOutdoors } from '../src/maps';
import { Engine,VECTOR } from '../src/engine';
import { parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';
import { PASSAGES,TRANSIT_LINKS } from '../src/journey-world';
import { passageSignPages } from '../src/encounter-guidance';
function tour(id:string){const g=new Engine();g.exploring=true;g.save=g.freshSave();g.save.map=id as TourId;return g}
test('original outdoor maps and added passages expose solid signs for actual exterior exits',()=>{
  assert.equal(Object.keys(TOUR_OUTDOORS).length,43+Object.keys(PASSAGES).length);
  for(const id of Object.keys(TOUR_OUTDOORS)){const outdoor=getWorldOutdoors(getMap(id as TourId))!;
    const map=getMap(id as TourId);assert.equal(outdoor.signs.length,map.warps.filter(w=>TOUR_OUTDOORS[w.to]||TRANSIT_LINKS[w.to]?.includes(id)||['town','route_s01','research_path'].includes(w.to)).length,id+' exterior exit signs');
    for(const sign of outdoor.signs){
      assert(!canStand(map,sign.x,sign.y));assert(canStand(map,sign.x,sign.y+1),id+' sign approach');
      assert(map.warps.some(w=>w.to===sign.destination&&w.entry===sign.direction));
      assert(map.props.some(p=>p.x===sign.x&&p.y===sign.y&&p.dialogue===sign.event));
    }
  }
});
for(const id of Object.keys(TOUR_OUTDOORS))test('outdoor investigation through reachable surfaces preserves progress: '+id,()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{const outdoor=getWorldOutdoors(getMap(id as TourId))!;
    const g=tour(id);for(const obj of [...outdoor.objects,...outdoor.signs]){
      const cells='cells'in obj?obj.cells:[obj];let checked=0;
      for(const cell of cells)for(const [direction,v]of Object.entries(VECTOR)){
        const x=cell.x-v.x,y=cell.y-v.y;if(!canStand(g.map,x,y))continue;
        g.save.player={x,y,facing:direction as keyof typeof VECTOR};assert(g.interactionHint?.includes(obj.name));
        if(id==='tour_route_34'&&obj.event==='tourRoute34Sign'){
          const before=structuredClone(g.save);g.confirm();
          assert.equal(g.dialogue?.speaker,'34번도로 이정표');
          assert(g.dialogue?.pages.some(p=>p.includes('금빛시티')&&p.includes('너도밤나무숲')));
          assert(g.dialogue?.pages.some(p=>p.includes('슬리프')&&p.includes('꼬렛')));
          assert(g.dialogue?.choices?.some(c=>c.label==='계속 걷기'));assert.equal(g.interactionHint,null);
          g.cancel();assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);assert.equal(g.battle,null);checked++;continue;
        }
        const passageSign=PASSAGES[id]&&obj.event==='journeySign';
        const before=structuredClone(g.save);g.confirm();assert.equal(g.dialogue?.speaker,passageSign?'이정표':obj.name);assert.deepEqual(g.dialogue?.pages,passageSign?passageSignPages(id,PASSAGES[id].a.name,PASSAGES[id].b.name):obj.pages);assert.equal(g.interactionHint,null);
        for(let page=0;g.dialogue&&page<12;page++){g.dialogue.shown=1000;g.confirm()}
        assert.equal(g.dialogue,null,id+' investigation finishes');
        assert.deepEqual(g.save,before);assert.equal(g.battle,null);checked++;
      }
      assert(checked>0,id+' accessible investigation');
      const displayedPages=PASSAGES[id]&&obj.event==='journeySign'?passageSignPages(id,PASSAGES[id].a.name,PASSAGES[id].b.name):obj.pages;
      for(const page of displayedPages){assert(page.split('\n').length<=2,id+' dialogue rows');for(const line of page.split('\n'))assert(line.length<=24,line)}
    }
  }finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
test('interaction hints match facing and disappear during movement and menus',()=>{
  const g=tour('tour_jubilife'),sign=TOUR_OUTDOORS.tour_jubilife.signs[0];g.save.player={x:sign.x,y:sign.y+1,facing:'up'};assert(g.interactionHint?.includes(sign.name));
  g.save.player.facing='down';assert.equal(g.interactionHint,null);g.save.player.facing='up';g.panel='menu';assert.equal(g.interactionHint,null);g.panel='field';g.move={from:{x:1,y:1},to:{x:2,y:1},duration:1,elapsed:0};assert.equal(g.interactionHint,null);g.move=null;assert(g.interactionHint?.includes(sign.name));
});
test('revision eight saves on new sign tiles relocate while other valid positions remain',()=>{
  for(const [id,outdoor]of Object.entries(TOUR_OUTDOORS))for(const sign of outdoor.signs){
    const s=tour(id).save;s.worldRevision=8;s.player={x:sign.x,y:sign.y,facing:'left'};s.steps=77;
    const parsed=parseSave(JSON.stringify(s));assert(parsed);assert.equal(parsed.worldRevision,TOWN_REVISION);assert.equal(parsed.steps,77);assert.deepEqual(parsed.player,{...TOUR_SPAWNS[id as TourId],facing:'down'});
    s.player={x:sign.x,y:sign.y+1,facing:'up'};assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
  }
});
