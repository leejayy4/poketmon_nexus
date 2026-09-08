import test from 'node:test';
import assert from 'node:assert/strict';
import {paintVeilstoneGym,paintVeilstoneGymInterior,paintVeilstoneGymEquipment,paintVeilstoneGymBattleArena} from '../src/veilstone-gym-art';
import {paintTourBuilding} from '../src/explore-art';
import {paintJubilifeBuilding} from '../src/explore-jubilife';
import {paintEternaGymInterior,paintEternaGymBattleArena} from '../src/eterna-gym-art';
import {paintHearthomeGymInterior,paintHearthomeGymBattleArena} from '../src/hearthome-gym-art';
import {paintOreburghGymBattleArena} from '../src/oreburgh-gym-art';
import {paintCoronetBattleArena} from '../src/coronet-art';
import {buildSinnohArt,SINNOH_MAPS} from '../src/sinnoh-maps';
import {GYM_ROCKS} from '../src/badge-maps';
import {TOUR_BUILDINGS,tourPlaceForMap} from '../src/explore-world';
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
function within(rects:Rect[],x:number,y:number,w:number,h:number){
  assert(rects.length);for(const r of rects){assert([r.x,r.y,r.w,r.h].every(Number.isInteger));assert(r.w>0&&r.h>0);assert(r.x>=x&&r.y>=y&&r.x+r.w<=x+w&&r.y+r.h<=y+h,JSON.stringify(r));}
}
function withDocument(run:(created:ReturnType<typeof canvas>[])=>void){
  const old=Object.getOwnPropertyDescriptor(globalThis,'document'),created:ReturnType<typeof canvas>[]=[];
  Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement(){const c=canvas();created.push(c);return c.element;},getElementById:()=>null}});
  try{run(created);}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
}

test('training hall follows the existing urban envelope and door; ordinary urban houses remain unchanged',()=>{
  const p=tourPlaceForMap('tour_veilstone')!,buildings=TOUR_BUILDINGS.tour_veilstone,b=buildings.find(b=>b.kind==='house')!,before=structuredClone(buildings);
  const direct=canvas(),integrated=canvas();paintVeilstoneGym(direct.ctx,b);paintTourBuilding(integrated.ctx,{},p,b);
  assert.deepEqual(integrated.rects,direct.rects);within(direct.rects,b.door.x*16+8-40,(b.door.y+1)*16-108,81,108);assert.deepEqual(buildings,before);
  assert(direct.rects.some(r=>r.x===b.door.x*16&&r.y===(b.door.y+1)*16-8&&r.w===18&&r.h===5));
  const other=buildings.find(h=>h.room==='tour_veilstone_home2')!,ordinary=canvas(),through=canvas();
  assert(other);paintJubilifeBuilding(ordinary.ctx,{},other);paintTourBuilding(through.ctx,{},p,other);assert.deepEqual(through.rects,ordinary.rects);assert.deepEqual(through.events,ordinary.events);
});

test('wooden hall preserves the complete map and draws its mat lane only on valid floor through the exit',()=>withDocument(created=>{
  const map=getMap('veilstone_gym'),before=structuredClone(map),image=buildSinnohArt({},map),paint=created.at(-1)!;
  assert.deepEqual([image.width,image.height],[272,256]);within(paint.rects,0,0,272,256);assert.deepEqual(map,before);
  assert.deepEqual(map.npcs.map(n=>[n.id,n.x,n.y]),[['maylene',8,4],['gymGuide',12,12]]);
  assert.deepEqual(map.warps.map(w=>[w.x,w.y,w.to,w.spawn]),[[8,15,'tour_veilstone',{x:7,y:27}]]);
  assert.deepEqual(map.walkable,SINNOH_MAPS.eterna_gym.walkable);
  const mats=paint.rects.filter(r=>r.color==='#b3bc8e');for(const r of mats)assert.equal(map.walkable[r.y/16][r.x/16],'.');
  assert(mats.some(r=>r.x===128&&r.y===240));assert(!paint.rects.some(r=>r.color==='#ba754a33'));assert.equal(paint.ctx.fillStyle,'original');
}));

test('equipment platforms and every decorative pixel stay inside the original three blocked rectangles',()=>{
  const map=getMap('veilstone_gym'),paint=canvas();paintVeilstoneGymEquipment(paint.ctx);
  for(const r of paint.rects){
    assert([r.x,r.y,r.w,r.h].every(Number.isInteger));assert(GYM_ROCKS.some(([x,y,w,h])=>r.x>=x*16&&r.y>=y*16&&r.x+r.w<=(x+w)*16&&r.y+r.h<=(y+h)*16));
    for(let y=Math.floor(r.y/16);y<Math.ceil((r.y+r.h)/16);y++)for(let x=Math.floor(r.x/16);x<Math.ceil((r.x+r.w)/16);x++)assert.equal(map.walkable[y][x],'#');
  }
  for(const [x,y,w,h] of GYM_ROCKS)assert(paint.rects.some(r=>r.x===x*16&&r.y===y*16&&r.w===w*16&&r.h===h*16));
  assert.equal(paint.ctx.fillStyle,'original');
});

test('the previously completed greenhouse and ghost hall keep their full interior paintings',()=>withDocument(created=>{
  for(const [id,draw] of [['eterna_gym',paintEternaGymInterior],['hearthome_gym',paintHearthomeGymInterior]] as const){
    const expected=canvas();draw(expected.ctx,SINNOH_MAPS[id]);buildSinnohArt({},SINNOH_MAPS[id]);assert.deepEqual(created.at(-1)!.rects,expected.rects);
  }
}));
function arena(id:'roark'|'gardenia'|'fantina'|'maylene',clock=0){
  const g=new Engine();grantPokemon(g.save,7);g.save.map=id==='maylene'?'veilstone_gym':id==='fantina'?'hearthome_gym':id==='gardenia'?'eterna_gym':'oreburgh_gym';g.clock=clock;g.battle=createBattle(g.save,'gym',id)!;
  const paint=canvas(),r=new Renderer(g,paint.element,paint.element);return {g,r,...paint};
}
test('Maylene uses static dojo scenery and other leaders, mountain and outdoor battles retain their backgrounds',()=>{
  const direct=canvas();paintVeilstoneGymBattleArena(direct.ctx);within(direct.rects,0,0,256,192);
  for(const clock of [0,5,20]){
    const a=arena('maylene',clock),save=structuredClone(a.g.save),battle=structuredClone(a.g.battle);a.r.battleArena(a.ctx);
    assert.deepEqual(a.rects,direct.rects);assert.deepEqual(a.g.save,save);assert.deepEqual(a.g.battle,battle);
  }
  for(const [id,draw] of [['gardenia',paintEternaGymBattleArena],['roark',paintOreburghGymBattleArena],['fantina',paintHearthomeGymBattleArena]] as const){
    const a=arena(id),expected=canvas();draw(expected.ctx);a.r.battleArena(a.ctx);assert.deepEqual(a.rects,expected.rects);
  }
  const mountain=arena('maylene'),expected=canvas();mountain.g.save.map='tour_coronet';mountain.g.battle=createBattle(mountain.g.save)!;paintCoronetBattleArena(expected.ctx);mountain.r.battleArena(mountain.ctx);assert.deepEqual(mountain.rects,expected.rects);
  const road=arena('maylene');road.g.save.map='tour_pass_hearthome_veilstone';road.g.battle=createBattle(road.g.save)!;road.r.battleArena(road.ctx);assert(road.rects.some(r=>r.color==='#f3f3dc'));
});

test('dojo paints behind both actors and HUD; all painters restore Canvas even on drawing failure',()=>{
  const a=arena('maylene'),original=a.r.battleArena.bind(a.r);a.r.battleArena=c=>{original(c);a.events.push('arena-finished');};a.r.battleTop(a.ctx);
  assert.equal(a.events.filter(e=>e==='arena-finished').length,1);assert.equal(a.events.filter(e=>e==='image').length,2);
  const end=a.events.indexOf('arena-finished');assert(end<a.events.indexOf('image'));assert(end<a.events.indexOf('text'));
  const b=TOUR_BUILDINGS.tour_veilstone.find(b=>b.kind==='house')!;
  for(const draw of [(c:CanvasRenderingContext2D)=>paintVeilstoneGym(c,b),(c:CanvasRenderingContext2D)=>paintVeilstoneGymInterior(c,SINNOH_MAPS.veilstone_gym),paintVeilstoneGymEquipment,paintVeilstoneGymBattleArena]){
    let restored=false;const ctx={save(){},restore(){restored=true;},fillRect(){throw Error('paint failure');}} as unknown as CanvasRenderingContext2D;
    assert.throws(()=>draw(ctx),/paint failure/);assert(restored);
  }
});
