import test from 'node:test';
import assert from 'node:assert/strict';
import {paintFerryJourney,ferryProgress,type FerryJourneyView} from '../src/ferry-art';
import {startFerryJourney,updateFerryJourney,FERRY_DURATION} from '../src/ferry-journey';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';

type Rect={x:number;y:number;w:number;h:number;color:string};
function canvas(){
  const rects:Rect[]=[],texts:{text:string;x:number;y:number;font:string}[]=[],stack:string[]=[];
  const state={fillStyle:'original',font:'original',imageSmoothingEnabled:false,
    save(){stack.push(this.fillStyle);},restore(){this.fillStyle=stack.pop()!;},
    fillRect(x:number,y:number,w:number,h:number){rects.push({x,y,w,h,color:this.fillStyle});},
    fillText(text:string,x:number,y:number){texts.push({text,x,y,font:this.font});}};
  const ctx=new Proxy(state,{get:(target,key)=>key in target?Reflect.get(target,key):()=>{}}) as unknown as CanvasRenderingContext2D;
  const element={width:256,height:192,getContext:()=>ctx} as unknown as HTMLCanvasElement;
  return {ctx,element,rects,texts,stack};
}
function bounded(rects:Rect[]){
  assert(rects.length);
  for(const r of rects){assert([r.x,r.y,r.w,r.h].every(Number.isInteger));assert(r.w>0&&r.h>0);assert(r.x>=0&&r.y>=0&&r.x+r.w<=256&&r.y+r.h<=192,JSON.stringify(r));}
}
function underway(outbound=true){
  const g=new Engine();g.announce=()=>{};g.save.map=outbound?'tour_canalave':'tour_vermilion';g.save.flags.researchDelivered=true;
  assert(startFerryJourney(g,outbound));
  const top=canvas(),bottom=canvas(),r=new Renderer(g,top.element,bottom.element);return {g,r,top,bottom};
}

test('voyage artwork is bounded integer DS pixels at both headings and every progress edge',()=>{
  for(const outbound of [true,false])for(const elapsed of [-1,0,.45,.9,1.35,1.8,3]){
    const view={outbound,elapsed,duration:1.8},before=structuredClone(view),paint=canvas();paintFerryJourney(paint.ctx,view);
    bounded(paint.rects);assert.deepEqual(view,before);assert.equal(paint.ctx.fillStyle,'original');assert.equal(paint.stack.length,0);
  }
  assert.equal(ferryProgress({outbound:true,elapsed:-1,duration:1.8}),0);assert.equal(ferryProgress({outbound:false,elapsed:3,duration:1.8}),1);
});

test('boat travels toward the selected port and the wake stays behind the mirrored hull',()=>{
  for(const outbound of [true,false]){
    const positions:number[]=[];
    for(const elapsed of [0,.9,1.8]){
      const paint=canvas();paintFerryJourney(paint.ctx,{outbound,elapsed,duration:1.8});
      const hull=paint.rects.find(r=>r.color==='#526777'&&r.w===87)!;positions.push(hull.x);
      const wake=paint.rects.find(r=>r.color==='#d9e7d3')!;
      assert(outbound?wake.x<hull.x:wake.x>hull.x+hull.w-8);
    }
    assert.deepEqual(positions,outbound?[28,84,140]:[141,85,29]);
  }
});

test('voyage owns both screens, clears old touch hits and leaves save and journey state untouched',()=>{
  for(const outbound of [true,false]){
    const a=underway(outbound),before=structuredClone(a.g.save),journey=structuredClone(a.g.ferryJourney);
    a.r.world=()=>assert.fail('world must not paint over voyage');a.r.lower=()=>assert.fail('field menus must not paint over voyage');
    a.g.toast='old toast';a.g.toastTime=2;a.g.transition=.3;
    a.r.hits=[{x:0,y:0,w:256,h:192,action:()=>assert.fail('stale action')}];
    a.r.draw();assert.deepEqual(a.r.hits,[]);bounded(a.top.rects);bounded(a.bottom.rects);
    assert.deepEqual(a.g.save,before);assert.deepEqual(a.g.ferryJourney,journey);
    assert.deepEqual(a.bottom.texts.map(t=>t.text),['조사선 항해',outbound?'운하항 → 갈색항':'갈색항 → 운하항','바다를 건너고 있어요']);
    // Centred 11px text has ample horizontal room at the native 256px width.
    for(const t of a.bottom.texts){assert.equal(t.x,128);assert(t.text.length*11<220);assert(t.y>=25&&t.y+11<167);}
  }
});

test('touch guard rejects the previous frame button before the first voyage draw and permits controls after arrival',()=>{
  const a=underway();let clicked=0;
  a.r.hits=[{x:0,y:0,w:256,h:192,action:()=>{clicked++;}}];a.r.click(80,90);assert.equal(clicked,0);
  a.r.draw();assert.equal(a.r.hits.length,0);
  updateFerryJourney(a.g,FERRY_DURATION);assert.equal(a.g.ferryJourney,null);
  let world=0,lower=0;a.r.world=()=>{world++;};a.r.lower=()=>{lower++;a.r.hits=[{x:0,y:0,w:256,h:192,action:()=>{clicked++;}}];};
  a.r.draw();assert.deepEqual([world,lower],[1,1]);a.r.click(80,90);assert.equal(clicked,1);
});

test('normal rendering returns after restore cancels a voyage; painter restores Canvas if drawing fails',()=>{
  const a=underway(),saved=structuredClone(a.g.save);a.g.restore(saved);assert.equal(a.g.ferryJourney,null);
  let world=0,lower=0;a.r.world=()=>{world++;};a.r.lower=()=>{lower++;};a.r.draw();assert.deepEqual([world,lower],[1,1]);
  let restored=false;const ctx={save(){},restore(){restored=true;},fillRect(){throw Error('paint failure');}} as unknown as CanvasRenderingContext2D;
  const view:FerryJourneyView={elapsed:.9,duration:1.8,outbound:true};assert.throws(()=>paintFerryJourney(ctx,view),/paint failure/);assert(restored);
});
