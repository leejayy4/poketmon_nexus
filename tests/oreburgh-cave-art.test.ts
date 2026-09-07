import test from 'node:test';
import assert from 'node:assert/strict';
import { isOreburghCave,paintCaveEncounter,paintCaveBattleArena } from '../src/oreburgh-cave-art';

type Fill={x:number;y:number;w:number;h:number;color:string};
function context(){
  const fills:Fill[]=[];
  const ellipses:{x:number;y:number;rx:number;ry:number}[]=[];
  const saves:number[]=[];
  let depth=0;
  const c={
    fillStyle:'',
    save:()=>{depth++;saves.push(depth)},
    restore:()=>{depth--},
    fillRect:(x:number,y:number,w:number,h:number)=>fills.push({x,y,w,h,color:c.fillStyle}),
    beginPath:()=>{},
    ellipse:(x:number,y:number,rx:number,ry:number)=>ellipses.push({x,y,rx,ry}),
    fill:()=>fills.push({x:0,y:0,w:0,h:0,color:c.fillStyle}),
  } as unknown as CanvasRenderingContext2D;
  return {c,fills,ellipses,saves,depth:()=>depth};
}

test('identifies only the exact Oreburgh cave map',()=>{
  assert.equal(isOreburghCave('tour_pass_jubilife_oreburgh'),true);
  assert.equal(isOreburghCave('tour_pass_jubilife_oreburgh_'),false);
  assert.equal(isOreburghCave('tour_pass_oreburgh_jubilife'),false);
});

test('paints a 16px gravel tile at integer coordinates and restores the canvas',()=>{
  const t=context();paintCaveEncounter(t.c,240,192,false);
  assert.equal(t.saves.length,1);assert.equal(t.depth(),0);
  assert(t.fills.some(f=>f.x===240&&f.y===192&&f.w===16&&f.h===16));
  for(const f of t.fills)for(const n of [f.x,f.y,f.w,f.h])assert.equal(Number.isInteger(n),true);
  assert(t.fills.some(f=>f.color==='#858878'),'cave gravel base');
  assert(t.fills.some(f=>f.color==='#9f9f86'),'small stone');
});

test('foreground adds foot dust while background tiles do not',()=>{
  const back=context(),front=context();
  paintCaveEncounter(back.c,240,192,false,1);paintCaveEncounter(front.c,240,192,true,1);
  assert(!front.fills.some(f=>f.w===16&&f.h===16),'foreground does not repaint the tile');
  assert(!back.fills.some(f=>f.color==='#d2c29d'||f.color==='#b7ab8d'||f.color==='#e1d1aa'));
  assert(front.fills.some(f=>f.color==='#d2c29d'));
  assert.equal(back.depth(),0);assert.equal(front.depth(),0);
});

test('paints a cave arena with the existing platform centers and cave palette',()=>{
  const t=context();paintCaveBattleArena(t.c);
  assert.equal(t.saves.length,1);assert.equal(t.depth(),0);
  assert(t.ellipses.some(e=>e.x===196&&e.y===84&&e.rx===53&&e.ry===12));
  assert(t.ellipses.some(e=>e.x===59&&e.y===133&&e.rx===70&&e.ry===19));
  assert(t.fills.some(f=>f.color==='#77786f'),'layered cave wall');
  assert(t.fills.filter(f=>f.color==='#6b706a').length>=5,'low-contrast rock plates');
  assert(t.fills.filter(f=>f.color==='#60655f').length>=5,'short stalactite silhouettes');
  assert(t.fills.some(f=>f.color==='#898675'),'rocky cave floor');
  assert(t.fills.some(f=>f.color==='#8d806c'),'gray-brown platform');
  assert(!t.fills.some(f=>f.color==='#c7d7aa'||f.color==='#f3f3dc'),'no grass or clouds');
});
