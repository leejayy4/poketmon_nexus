import test from 'node:test';
import assert from 'node:assert/strict';
import {paintCoronetGround,paintCoronetBoundary,paintCoronetPaths,paintCoronetBattleArena} from '../src/coronet-art';
import {buildExploreArt} from '../src/explore-art';
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
function within(rects:Rect[],width:number,height:number){
  assert(rects.length);
  for(const r of rects){assert([r.x,r.y,r.w,r.h].every(Number.isInteger));assert(r.w>0&&r.h>0);assert(r.x>=0&&r.y>=0&&r.x+r.w<=width&&r.y+r.h<=height,JSON.stringify(r));}
}
function withDocument(run:(created:ReturnType<typeof canvas>[])=>void){
  const old=Object.getOwnPropertyDescriptor(globalThis,'document'),created:ReturnType<typeof canvas>[]=[];
  Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement(){const c=canvas();created.push(c);return c.element;},getElementById:()=>null}});
  try{run(created);}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
}

test('mountain walls follow dynamic map sizes and never obscure any walkable approach or warp',()=>{
  for(const height of [18,30,36]){
    const map=structuredClone(getMap('tour_coronet'));
    map.height=height;
    map.walkable=Array.from({length:height},(_,y)=>Array.from({length:map.width},(_,x)=>x>=2&&x<map.width-2&&y>=3&&y<height-2?'.':'#').join(''));
    map.warps[1].y=height-2;
    // Deliberately leave warp cells blocked to test the explicit exit exemption.
    const before=structuredClone(map),paint=canvas();paintCoronetBoundary(paint.ctx,map);
    within(paint.rects,map.width*16,height*16);assert.deepEqual(map,before);
    assert(paint.rects.some(r=>r.y>=(height-1)*16),'dynamic bottom wall');
    for(const r of paint.rects)for(let y=Math.floor(r.y/16);y<Math.ceil((r.y+r.h)/16);y++)for(let x=Math.floor(r.x/16);x<Math.ceil((r.x+r.w)/16);x++){
      assert.equal(map.walkable[y][x],'#');assert(!map.warps.some(w=>w.x===x&&w.y===y));
    }
    assert.equal(paint.ctx.fillStyle,'original');assert.equal(paint.stack.length,0);
  }
});

test('the actual three mountain mouths remain clear and paths retain a continuous contrasting surface',()=>{
  const map=getMap('tour_coronet'),paint=canvas();paintCoronetBoundary(paint.ctx,map);
  for(const r of paint.rects)for(let y=Math.floor(r.y/16);y<Math.ceil((r.y+r.h)/16);y++)for(let x=Math.floor(r.x/16);x<Math.ceil((r.x+r.w)/16);x++)assert.equal(map.walkable[y][x],'#');
  for(const w of map.warps)assert(!paint.rects.some(r=>r.x<(w.x+1)*16&&r.x+r.w>w.x*16&&r.y<(w.y+1)*16&&r.y+r.h>w.y*16));
  const path=canvas();paintCoronetPaths(path.ctx,new Set(['4,4','5,4']));
  // Adjacent tiles have no vertical outline along their shared edge.
  assert(!path.rects.some(r=>r.w===1&&(r.x===79||r.x===80)));
  assert(path.rects.some(r=>r.color==='#d2c6a2'));assert.equal(path.ctx.fillStyle,'original');
});

test('exploration integration keeps rock footprints and terrain data while replacing generic ground only on Coronet',()=>withDocument(created=>{
  const map=getMap('tour_coronet'),before=structuredClone(map),image=buildExploreArt({},map.id),paint=created.at(-1)!;
  assert.equal(image.width,map.width*16);assert.equal(image.height,map.height*16);within(paint.rects,image.width,image.height);assert.deepEqual(map,before);
  assert(paint.rects.some(r=>r.color==='#a9ad98'));assert(paint.rects.some(r=>r.color==='#d2c6a2'));
  for(const [x,y,w,h] of [[4,5,2,2],[14,12,2,2],[8,6,3,2],[10,11,2,3],[14,5,2,2],[8,20,7,5]])assert(paint.rects.some(r=>r.x===x*16&&r.y===y*16&&r.w===w*16&&r.h===h*16&&r.color==='#888b7e'),'existing rock painter footprint');
  assert.equal(map.terrain!.length,2);
  buildExploreArt({},'tour_desert');assert(!created.at(-1)!.rects.some(r=>r.color==='#a9ad98'||r.color==='#d2c6a2'));
}));

function arena(map:Parameters<typeof getMap>[0],clock=0){
  const g=new Engine();grantPokemon(g.save,7);g.save.map=map;g.clock=clock;g.battle=createBattle(g.save)!;
  const paint=canvas(),r=new Renderer(g,paint.element,paint.element);return {g,r,...paint};
}
test('only mountain wild battles use the static rocky arena; other fields, cave and gyms keep their own arenas',()=>{
  const direct=canvas();paintCoronetBattleArena(direct.ctx);within(direct.rects,256,192);
  for(const clock of [0,5,20]){
    const a=arena('tour_coronet',clock),before=structuredClone(a.g.save),battle=structuredClone(a.g.battle);a.r.battleArena(a.ctx);
    assert.deepEqual(a.rects,direct.rects);assert.deepEqual(a.g.save,before);assert.deepEqual(a.g.battle,battle);
  }
  for(const map of ['tour_eterna_forest','tour_pass_jubilife_oreburgh'] as const){
    const a=arena(map);a.r.battleArena(a.ctx);assert(!a.rects.some(r=>r.color==='#b4b69e'));
    assert(a.rects.some(r=>r.color===(map==='tour_eterna_forest'?'#f3f3dc':'#9b9888')));
  }
  for(const [id,map,color] of [['gardenia','eterna_gym','#a6bea0'],['roark','oreburgh_gym','#a9a393']] as const){
    const a=arena(map);a.g.battle=createBattle(a.g.save,'gym',id);a.r.battleArena(a.ctx);assert(a.rects.some(r=>r.color===color));
  }
});

test('mountain arena is completely behind actors and text, and every painter restores Canvas on failure',()=>{
  const a=arena('tour_coronet'),original=a.r.battleArena.bind(a.r);
  a.r.battleArena=c=>{original(c);a.events.push('arena-finished');};a.r.battleTop(a.ctx);
  assert.equal(a.events.filter(e=>e==='arena-finished').length,1);
  const end=a.events.indexOf('arena-finished');assert(end<a.events.indexOf('image'));assert(end<a.events.indexOf('text'));
  for(const draw of [(c:CanvasRenderingContext2D)=>paintCoronetGround(c,0,0),(c:CanvasRenderingContext2D)=>paintCoronetBoundary(c,getMap('tour_coronet')),(c:CanvasRenderingContext2D)=>paintCoronetPaths(c,new Set(['0,0'])),paintCoronetBattleArena]){
    let restored=false;const ctx={save(){},restore(){restored=true;},fillRect(){throw Error('paint failure');}} as unknown as CanvasRenderingContext2D;
    assert.throws(()=>draw(ctx),/paint failure/);assert(restored);
  }
});
