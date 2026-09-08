import test from 'node:test';
import assert from 'node:assert/strict';
import {paintVermilionTerminal} from '../src/vermilion-terminal-art';
import {paintTourBuilding} from '../src/explore-art';
import {paintCityHall,paintJubilifeBuilding} from '../src/explore-jubilife';
import {TOUR_BUILDINGS,TOUR_INTERIORS,tourPlaceForMap} from '../src/explore-world';
import {getMap} from '../src/maps';

type Rect={x:number;y:number;w:number;h:number;color:string};
function canvas(){
  const rects:Rect[]=[],images:unknown[][]=[],texts:string[]=[],stack:string[]=[];
  const state={fillStyle:'original',save(){stack.push(this.fillStyle);},restore(){this.fillStyle=stack.pop()!;},
    fillRect(x:number,y:number,w:number,h:number){rects.push({x,y,w,h,color:this.fillStyle});},
    drawImage(...args:unknown[]){images.push(args);},fillText(text:string){texts.push(text);}};
  const ctx=new Proxy(state,{get:(target,key)=>key in target?Reflect.get(target,key):()=>{}}) as unknown as CanvasRenderingContext2D;
  return {ctx,rects,images,texts,stack};
}
const terminal=()=>TOUR_BUILDINGS.tour_vermilion.find(b=>b.room==='tour_vermilion_hall')!;

test('terminal artwork fits the original urban landmark envelope at integer pixels and preserves all map and room data',()=>{
  const b=terminal(),city=getMap('tour_vermilion'),room=getMap('tour_vermilion_hall'),before=structuredClone({b,city,room,interior:TOUR_INTERIORS.tour_vermilion_hall});
  const paint=canvas();paintVermilionTerminal(paint.ctx,b);
  const left=b.door.x*16+8-74,top=(b.door.y+1)*16-188;
  assert(paint.rects.length);
  for(const r of paint.rects){assert([r.x,r.y,r.w,r.h].every(Number.isInteger));assert(r.w>0&&r.h>0);assert(r.x>=left&&r.y>=top&&r.x+r.w<=left+148&&r.y+r.h<=top+188,JSON.stringify(r));}
  assert.deepEqual({b,city,room,interior:TOUR_INTERIORS.tour_vermilion_hall},before);
  assert.equal(city.warps.find(w=>w.to==='tour_vermilion_hall')!.x,31);assert.equal(city.warps.find(w=>w.to==='tour_vermilion_hall')!.y,14);
  assert(paint.rects.some(r=>r.x===b.door.x*16&&r.y===top+157&&r.w===16&&r.h===27&&r.color==='#507b80'),'door opening follows the existing warp column');
  assert.equal(paint.ctx.fillStyle,'original');assert.equal(paint.stack.length,0);assert.deepEqual(paint.texts,[]);
});

test('the terminal follows supplied building coordinates instead of hardcoding its current city position',()=>{
  const b=terminal(),moved={...b,x:b.x+3,y:b.y+2,door:{x:b.door.x+3,y:b.door.y+2}},first=canvas(),second=canvas();
  paintVermilionTerminal(first.ctx,b);paintVermilionTerminal(second.ctx,moved);
  assert.deepEqual(second.rects,first.rects.map(r=>({...r,x:r.x+48,y:r.y+32})));
});

test('only Vermilion passenger terminal receives the new facade; other city halls and homes keep their exact painter',()=>{
  const b=terminal(),direct=canvas(),through=canvas();paintVermilionTerminal(direct.ctx,b);paintTourBuilding(through.ctx,{},tourPlaceForMap('tour_vermilion')!,b);
  assert.deepEqual(through.rects,direct.rects);assert.equal(through.images.length,0);
  for(const id of ['tour_canalave','tour_veilstone','tour_jubilife'] as const){
    const landmark=TOUR_BUILDINGS[id].find(b=>b.kind==='landmark')!,expected=canvas(),actual=canvas();
    // Jubilife has its own tower; other waterfront/urban halls share this crop.
    if(id==='tour_jubilife')paintJubilifeBuilding(expected.ctx,{},landmark);else paintCityHall(expected.ctx,{},landmark);
    paintTourBuilding(actual.ctx,{},tourPlaceForMap(id)!,landmark);
    assert.deepEqual(actual.rects,expected.rects);assert.deepEqual(actual.images,expected.images);
  }
  const home=TOUR_BUILDINGS.tour_vermilion.find(b=>b.room==='tour_vermilion_home1')!,expected=canvas(),actual=canvas();
  paintJubilifeBuilding(expected.ctx,{},home);paintTourBuilding(actual.ctx,{},tourPlaceForMap('tour_vermilion')!,home);
  assert.deepEqual(actual.rects,expected.rects);assert.deepEqual(actual.images,expected.images);
});

test('terminal painter always restores the caller Canvas on a drawing failure',()=>{
  let restored=false;const ctx={save(){},restore(){restored=true;},fillRect(){throw Error('paint failure');}} as unknown as CanvasRenderingContext2D;
  assert.throws(()=>paintVermilionTerminal(ctx,terminal()),/paint failure/);assert(restored);
});
