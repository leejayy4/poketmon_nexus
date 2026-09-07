import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import { TOUR_MAPS } from '../src/explore-world';
import { tourMapMarkers,tourMarkerBounds } from '../src/explore-minimap';

function setup(){
  const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo('tour_jubilife');
  const context=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D;
  const canvas={getContext:()=>context} as unknown as HTMLCanvasElement;
  return {g,r:new Renderer(g,canvas,canvas)};
}

test('all tour minimap markers match actual doors or NPCs, fit the map and have distinct touch areas',()=>{
  let facilities=0,people=0,pokemon=0;
  for(const map of Object.values(TOUR_MAPS)){
    const markers=tourMapMarkers(map);
    for(const m of markers){
      const box=tourMarkerBounds(map,m);assert(box.x>=0&&box.x+box.w<=256&&box.y>=46&&box.y+box.h<=179);
      if(m.destination){facilities++;assert(map.warps.some(w=>w.to===m.destination&&w.x===m.x&&w.y===m.y));assert.equal(m.name,TOUR_MAPS[m.destination as keyof typeof TOUR_MAPS].name)}
      else{if(m.kind==='pokemon')pokemon++;else people++;assert(map.npcs.some(n=>n.id===m.id&&n.x===m.x&&n.y===m.y&&n.name===m.name))}
      for(const other of markers.filter(n=>n!==m)){const b=tourMarkerBounds(map,other);assert(box.x+box.w<=b.x||b.x+b.w<=box.x||box.y+box.h<=b.y||b.y+b.h<=box.y,map.id+' overlapping marker '+m.id)}
    }
  }
  assert.equal(facilities,76);assert.equal(people,189);assert.equal(pokemon,35);
});

test('touching facilities guides without travel, while touching a person only identifies them',()=>{
  const {g,r}=setup(),before=structuredClone(g.save);r.hits=[];r.exploreMap(r.touch);
  const markers=tourMapMarkers(g.map),center=markers.find(m=>m.kind==='center')!,person=markers.find(m=>m.id==='tourResident0')!;
  let b=tourMarkerBounds(g.map,center);r.click(b.cx,b.cy);assert.equal(g.tourDestination,center.destination);assert.deepEqual(g.save,before);
  r.hits=[];r.exploreMap(r.touch);b=tourMarkerBounds(g.map,person);r.click(b.cx,b.cy);assert.equal(g.toast,person.name+' · 앞에서 Z 대화');assert.equal(g.dialogue,null);assert.equal(g.tourDestination,center.destination);assert.deepEqual(g.save,before);
  const pokemon=markers.find(m=>m.kind==='pokemon')!;r.hits=[];r.exploreMap(r.touch);b=tourMarkerBounds(g.map,pokemon);r.click(b.cx,b.cy);assert.equal(g.toast,pokemon.name+' · 앞에서 Z 대화');assert.equal(g.dialogue,null);assert.deepEqual(g.save,before);
  g.exploreTo('tour_jubilife_center');r.hits=[];r.exploreMap(r.touch);assert.equal(tourMapMarkers(g.map).length,1);const host=tourMapMarkers(g.map)[0];b=tourMarkerBounds(g.map,host);r.click(b.cx,b.cy);assert(g.toast.startsWith('간호사'));assert.equal(g.dialogue,null);
});

test('markers cannot change guidance through menus, dialogue, walking, transitions or stale map hits',()=>{
  const {g,r}=setup();
  for(const state of ['menu','dialogue','walking','transition']){
    g.panel=state==='menu'?'menu':'field';g.dialogue=state==='dialogue'?{speaker:'test',pages:['test'],page:0,shown:4,selected:0}:null;
    g.move=state==='walking'?{from:{x:14,y:11},to:{x:15,y:11},elapsed:0,duration:1}:null;g.transition=state==='transition'?.2:0;
    r.hits=[];r.exploreMap(r.touch);assert.equal(r.hits.length,0,state);
  }
  g.panel='field';g.dialogue=null;g.move=null;g.transition=0;r.hits=[];r.exploreMap(r.touch);
  const oldCenter=tourMarkerBounds(g.map,tourMapMarkers(g.map).find(m=>m.kind==='center')!);
  g.panel='menu';r.click(oldCenter.cx,oldCenter.cy);assert.equal(g.tourDestination,null);
  g.panel='field';g.exploreTo('tour_eterna_forest');r.click(oldCenter.cx,oldCenter.cy);assert.equal(g.tourDestination,null);r.hits=[];r.exploreMap(r.touch);
  assert.equal(tourMapMarkers(g.map).filter(m=>m.destination).length,0);
  assert(g.interactionHint?.includes('풀밭 옆 나무'));assert.equal(r.hits.length,5); // Includes the nearby tree investigation button.
  g.exploreTo('town');r.hits=[];r.exploreMap(r.touch);assert(tourMapMarkers(g.map).some(m=>m.destination==='lab'));
});
