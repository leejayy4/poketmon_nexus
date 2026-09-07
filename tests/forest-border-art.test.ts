import test from 'node:test';
import assert from 'node:assert/strict';
import {FOREST_BORDER_MAPS,forestBorderTrees,isForestBorder} from '../src/forest-border-art';
import {TOUR_MAPS} from '../src/explore-world';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';

test('forest perimeter trees preserve every map and keep all exit tiles clear',()=>{
 for(const map of Object.values(TOUR_MAPS)){
  const before=structuredClone(map),trees=forestBorderTrees(map);
  if(!FOREST_BORDER_MAPS.has(map.id)){assert.deepEqual(trees,[]);continue;}
  assert(trees.length>20);assert.equal(new Set(trees.map(t=>`${t.x},${t.y}`)).size,trees.length);
  for(const t of trees){
   assert(t.x>=0&&t.y>=0&&t.x+32<=map.width*16&&t.y+48<=map.height*16);
   assert(Number.isInteger(t.x)&&Number.isInteger(t.y));
   const x=t.x/16,y=t.y/16+1;
   for(let j=y;j<y+2;j++)for(let i=x;i<x+2;i++)assert(isForestBorder(map,i,j),'trunks stay in the original blocked perimeter');
   for(const w of map.warps)assert(!(w.x*16<t.x+32&&(w.x+1)*16>t.x&&w.y*16<t.y+48&&(w.y+1)*16>t.y),'no canopy over any exit');
  }
  assert.deepEqual(map,before);
 }
});

test('live renderer puts southern perimeter trees in front of the player, keeps northern trees behind and preserves saves',()=>{
 const g=new Engine();g.exploreTo('tour_eterna_forest');g.save.player={x:9,y:15,facing:'down'};
 const hero={height:512} as HTMLImageElement,tree={} as HTMLImageElement;
 const draws:{im:unknown,x:number,y:number}[]=[];let tx=0,ty=0;
 const context=new Proxy({}, {get:(_,key)=>key==='translate'?(x:number,y:number)=>{tx=x;ty=y}:key==='drawImage'?(im:unknown)=>draws.push({im,x:tx,y:ty}):()=>{}}) as CanvasRenderingContext2D;
 const canvas={getContext:()=>context} as unknown as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
 r.images=new Proxy({hero,'sandgem-reference':tree},{get:(target,key)=>target[key as keyof typeof target]??{height:512}});
 const before=structuredClone(g.save);r.world();const actor=draws.findIndex(d=>d.im===hero);assert(actor>=0);
 for(const t of forestBorderTrees(g.map)){
  const index=draws.findIndex(d=>d.im===tree&&d.x===t.x&&d.y===t.y);assert(index>=0);
  assert.equal(index>actor,t.depth>g.save.player.y,'tree foot controls painter order');
 }
 assert.deepEqual(g.save,before);
});

