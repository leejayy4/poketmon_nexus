import test from 'node:test';
import assert from 'node:assert/strict';
import {paintEternaGym,paintEternaGymInterior,paintEternaGymPlanters,paintEternaGymBattleArena} from '../src/eterna-gym-art';
import {paintVeilstoneGymInterior} from '../src/veilstone-gym-art';
import {buildSinnohArt,SINNOH_MAPS} from '../src/sinnoh-maps';
import {buildBadgeArt,BADGE_MAPS,GYM_ROCKS} from '../src/badge-maps';
import {TOUR_BUILDINGS} from '../src/explore-world';
import {getMap} from '../src/maps';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {grantPokemon} from '../src/pokemon';
import {createBattle} from './runtime-battle-fixture';

type Rect={x:number;y:number;w:number;h:number;color:string};
function canvas(){
  const rects:Rect[]=[],events:string[]=[],stack:string[]=[];
  const state={fillStyle:'original',imageSmoothingEnabled:false,
    save(){stack.push(this.fillStyle);},restore(){this.fillStyle=stack.pop()!;},
    fillRect(x:number,y:number,w:number,h:number){rects.push({x,y,w,h,color:this.fillStyle});events.push('rect');},
    drawImage(){events.push('image');},fillText(){events.push('text');}};
  const ctx=new Proxy(state,{get:(target,key)=>key in target?Reflect.get(target,key):()=>{}}) as unknown as CanvasRenderingContext2D;
  const element={width:0,height:0,getContext:()=>ctx} as unknown as HTMLCanvasElement;
  return {ctx,element,rects,events,stack};
}
function withDocument(run:(created:ReturnType<typeof canvas>[])=>void){
  const old=Object.getOwnPropertyDescriptor(globalThis,'document'),created:ReturnType<typeof canvas>[]=[];
  Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement(){const c=canvas();created.push(c);return c.element;},getElementById:()=>null}});
  try{run(created);}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
}
function within(rects:Rect[],x:number,y:number,w:number,h:number){
  assert(rects.length);
  for(const r of rects){assert([r.x,r.y,r.w,r.h].every(Number.isInteger));assert(r.w>0&&r.h>0);assert(r.x>=x&&r.y>=y&&r.x+r.w<=x+w&&r.y+r.h<=y+h,JSON.stringify(r));}
}

test('greenhouse room rendering keeps the existing geometry, actors, exit and map data intact',()=>withDocument(created=>{
  const map=getMap('eterna_gym'),before=structuredClone(map);
  assert.deepEqual(map.walkable,BADGE_MAPS.oreburgh_gym.walkable);
  assert.deepEqual(map.npcs.map(n=>[n.id,n.x,n.y]),[['gardenia',8,4],['gymGuide',12,12]]);
  assert.deepEqual(map.warps.map(w=>[w.x,w.y,w.to]),[[8,15,'tour_eterna']]);
  const image=buildSinnohArt({},map),paint=created.at(-1)!;
  assert.equal(image.width,272);assert.equal(image.height,256);within(paint.rects,0,0,272,256);
  assert.deepEqual(map,before);assert.equal(paint.ctx.fillStyle,'original');assert.equal(paint.stack.length,0);
  assert(paint.rects.some(r=>r.color==='#a6bea0'),'greenhouse window material is present');
  assert(!paint.rects.some(r=>r.color==='#5d996733'),'the former color wash is not used');
}));

test('all low planter foliage and borders stay on the original blocked rock footprint',()=>{
  const {ctx,rects}=canvas(),map=getMap('eterna_gym');paintEternaGymPlanters(ctx);
  for(const rect of rects){
    assert(GYM_ROCKS.some(([x,y,w,h])=>rect.x>=x*16&&rect.y>=y*16&&rect.x+rect.w<=(x+w)*16&&rect.y+rect.h<=(y+h)*16));
    for(let y=Math.floor(rect.y/16);y<Math.ceil((rect.y+rect.h)/16);y++)for(let x=Math.floor(rect.x/16);x<Math.ceil((rect.x+rect.w)/16);x++)assert.equal(map.walkable[y][x],'#');
  }
  assert.equal(ctx.fillStyle,'original');
});

test('Veilstone uses its own room drawing instead of greenhouse scenery',()=>withDocument(created=>{
  const direct=canvas();paintVeilstoneGymInterior(direct.ctx,SINNOH_MAPS.veilstone_gym);
  buildSinnohArt({},SINNOH_MAPS.veilstone_gym);assert.deepEqual(created.at(-1)!.rects,direct.rects);
}));

test('exterior still fits the original house envelope and painting always restores Canvas',()=>{
  const building=TOUR_BUILDINGS.tour_eterna.find(b=>b.kind==='house')!,before=structuredClone(building),paint=canvas();
  paintEternaGym(paint.ctx,building);within(paint.rects,building.x*16,(building.y+2)*16-85,73,85);assert.deepEqual(building,before);
  for(const draw of [(c:CanvasRenderingContext2D)=>paintEternaGym(c,building),(c:CanvasRenderingContext2D)=>paintEternaGymInterior(c,SINNOH_MAPS.eterna_gym),paintEternaGymPlanters,paintEternaGymBattleArena]){
    let restored=false;const ctx={save(){},restore(){restored=true;},fillRect(){throw Error('paint failure');}} as unknown as CanvasRenderingContext2D;
    assert.throws(()=>draw(ctx),/paint failure/);assert(restored);
  }
});

function arena(id:'roark'|'gardenia'|'fantina'|'maylene',clock=0){
  const g=new Engine();grantPokemon(g.save,7);g.save.map=id==='gardenia'?'eterna_gym':'oreburgh_gym';g.clock=clock;g.battle=createBattle(g.save,'gym',id)!;
  const paint=canvas(),r=new Renderer(g,paint.element,paint.element);return {g,r,...paint};
}
test('only Gardenia uses the static greenhouse battle background and stays inside the DS screen',()=>{
  const direct=canvas();paintEternaGymBattleArena(direct.ctx);within(direct.rects,0,0,256,192);
  for(const clock of [0,5,20]){
    const a=arena('gardenia',clock),save=structuredClone(a.g.save),battle=structuredClone(a.g.battle);a.r.battleArena(a.ctx);
    assert.deepEqual(a.rects,direct.rects);assert.deepEqual(a.g.save,save);assert.deepEqual(a.g.battle,battle);
  }
  for(const id of ['roark','maylene'] as const){
    const a=arena(id);a.r.battleArena(a.ctx);assert(!a.rects.some(r=>r.color==='#a6bea0'));
    assert(a.rects.some(r=>r.color===(id==='roark'?'#a9a393':'#d4d2b0')));
  }
});

test('greenhouse decorations are painted before battle actors and text, with no foreground pass',()=>{
  const a=arena('gardenia'),original=a.r.battleArena.bind(a.r);
  a.r.battleArena=c=>{original(c);a.events.push('arena-finished');};a.r.battleTop(a.ctx);
  assert.equal(a.events.filter(e=>e==='arena-finished').length,1);
  const end=a.events.indexOf('arena-finished');assert(end<a.events.indexOf('image'));assert(end<a.events.indexOf('text'));
  assert.equal(a.events.filter(e=>e==='image').length,2);
});
