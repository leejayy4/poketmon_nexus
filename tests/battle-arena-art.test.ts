import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';

function arena(clock:number){
  const g=new Engine();g.clock=clock;
  const rects:{x:number;y:number;w:number;h:number;color:string}[]=[];
  const target:{fillStyle:string}={fillStyle:''};
  const ctx=new Proxy(target,{get:(state,key)=>key==='fillStyle'?state.fillStyle:key==='fill'?()=>rects.push({x:0,y:0,w:0,h:0,color:state.fillStyle}):key==='fillRect'?(x:number,y:number,w:number,h:number)=>rects.push({x,y,w,h,color:state.fillStyle}):()=>{}}) as CanvasRenderingContext2D;
  const canvas={getContext:()=>ctx} as HTMLCanvasElement;
  new Renderer(g,canvas,canvas).battleArena(ctx);
  return rects;
}

test('battle arena keeps the platform depth while adding a pixel horizon and drifting clouds',()=>{
  const start=arena(0),later=arena(5);
  assert(start.some(rect=>rect.color==='#b4c69a'&&rect.y<62),'draws a distant foliage horizon before the battlefield');
  assert(start.some(rect=>rect.color==='#f3f3dc'),'draws low-contrast pixel clouds');
  assert(start.some(rect=>rect.color==='#76996e'),'retains the platform shadow layer');
  const cloudStart=start.find(rect=>rect.color==='#f3f3dc')!;
  const cloudLater=later.find(rect=>rect.color==='#f3f3dc')!;
  assert.notEqual(cloudStart.x,cloudLater.x,'clouds move with the non-persistent render clock');
});
