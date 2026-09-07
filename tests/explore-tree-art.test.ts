import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import { groveTrees } from '../src/explore-tree-art';
import { TOUR_FEATURES } from '../src/explore-world';

test('complete grove trees stay inside the blocked footprint except for the northern canopy',()=>{
  let groves=0;
  for(const features of Object.values(TOUR_FEATURES))for(const f of features){
    const original=structuredClone(f),trees=groveTrees(f);
    if(f.kind!=='grove'){assert.deepEqual(trees,[]);continue;}
    groves++;assert(trees.length>0);
    for(const t of trees){
      assert(t.x>=f.x*16&&t.x+32<=(f.x+f.w)*16);
      assert(t.y>=f.y*16-16&&t.y+48<=(f.y+f.h)*16);
      assert(t.depth>=(f.y)&&t.depth<f.y+f.h);
      assert(Number.isInteger(t.x)&&Number.isInteger(t.y));
    }
    assert.equal(Math.max(...trees.map(t=>t.x+32)),(f.x+f.w)*16);
    assert.equal(Math.max(...trees.map(t=>t.y+48)),(f.y+f.h)*16);
    assert.equal(new Set(trees.map(t=>`${t.x},${t.y}`)).size,trees.length);
    assert.deepEqual(f,original);
  }
  assert(groves>=4);
});

test('world renderer paints trees in front of northern actors and behind southern actors without changing progress',()=>{
  const g=new Engine();g.exploreTo('tour_eterna_forest');
  const draws:unknown[]=[];let tx=0,ty=0;const selected=groveTrees(TOUR_FEATURES[g.map.id].filter(f=>f.kind==='grove').at(-1)!).at(-1)!;
  const context=new Proxy({}, {get:(_,key)=>key==='translate'?(x:number,y:number)=>{tx=x;ty=y}:key==='drawImage'?(im:unknown)=>{if(im!==tree||(tx===selected.x&&ty===selected.y))draws.push(im)}:()=>{}}) as CanvasRenderingContext2D;
  const canvas={getContext:()=>context} as unknown as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
  const hero={height:512} as HTMLImageElement,tree={} as HTMLImageElement;
  r.images=new Proxy({hero,'sandgem-reference':tree},{get:(target,key)=>target[key as keyof typeof target]??{height:512}});
  // Both positions are walkable immediately north/south of the same narrow grove.
  for(const [y,behind]of [[10,true],[15,false]] as const){
    g.save.player={x:11,y,facing:'down'};const before=structuredClone(g.save);
    assert.equal(g.map.walkable[y][11],'.');draws.length=0;r.world();
    const actorIndex=draws.indexOf(hero),treeIndex=draws.lastIndexOf(tree);
    assert(actorIndex>=0&&treeIndex>=0);
    assert.equal(actorIndex<treeIndex,behind);
    assert.deepEqual(g.save,before);
  }
});

