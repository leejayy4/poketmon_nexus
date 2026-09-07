import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_OUTDOORS,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { canStand,getMap,getWorldOutdoors } from '../src/maps';
import { Engine,VECTOR } from '../src/engine';
import { parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';
function tour(id:string){const g=new Engine();g.exploring=true;g.save=g.freshSave();g.save.map=id as TourId;return g}
test('all 43 outdoor maps expose solid signs for their actual exterior exits',()=>{
  assert.equal(Object.keys(TOUR_OUTDOORS).length,43);
  for(const id of Object.keys(TOUR_OUTDOORS)){const outdoor=getWorldOutdoors(getMap(id as TourId))!;
    const map=getMap(id as TourId);assert.equal(outdoor.signs.length,map.warps.filter(w=>TOUR_OUTDOORS[w.to]||['town','route_s01','research_path'].includes(w.to)).length);
    for(const sign of outdoor.signs){
      assert(!canStand(map,sign.x,sign.y));assert(canStand(map,sign.x,sign.y+1),id+' sign approach');
      assert(map.warps.some(w=>w.to===sign.destination&&w.entry===sign.direction));
      assert(map.props.some(p=>p.x===sign.x&&p.y===sign.y&&p.dialogue===sign.event));
    }
  }
});
test('every outdoor object and sign is investigated by facing a reachable surface without rewards',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{for(const id of Object.keys(TOUR_OUTDOORS)){const outdoor=getWorldOutdoors(getMap(id as TourId))!;
    const g=tour(id);for(const obj of [...outdoor.objects,...outdoor.signs]){
      const cells='cells'in obj?obj.cells:[obj];let checked=0;
      for(const cell of cells)for(const [direction,v]of Object.entries(VECTOR)){
        const x=cell.x-v.x,y=cell.y-v.y;if(!canStand(g.map,x,y))continue;
        g.save.player={x,y,facing:direction as keyof typeof VECTOR};assert(g.interactionHint?.includes(obj.name));
        const before=structuredClone(g.save);g.confirm();assert.equal(g.dialogue?.speaker,obj.name);assert.deepEqual(g.dialogue?.pages,obj.pages);assert.equal(g.interactionHint,null);
        while(g.dialogue){g.dialogue.shown=1000;g.confirm()}
        assert.deepEqual(g.save,before);assert.equal(g.battle,null);checked++;
      }
      assert(checked>0,id+' accessible investigation');
      for(const page of obj.pages){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=24,line)}
    }
  }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
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
