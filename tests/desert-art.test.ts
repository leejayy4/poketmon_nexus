import test from 'node:test';
import assert from 'node:assert/strict';
import { paintDesertRuinsRock,paintJubilifeFountain } from '../src/explore-art';
import { paintTourGround,paintTourPaths } from '../src/explore-materials';

test('paintDesertRuinsRock renders sandstone strata and highlights within bounding box',()=>{
  const fills:string[]=[];
  const ctx={
    fillStyle:'',
    fillRect:(_x:number,_y:number,_w:number,_h:number)=>{fills.push(ctx.fillStyle)},
    beginPath:()=>{},
    moveTo:()=>{},
    lineTo:()=>{},
    closePath:()=>{},
    fill:()=>{fills.push(ctx.fillStyle)},
  } as unknown as CanvasRenderingContext2D;

  paintDesertRuinsRock(ctx,32,48,48,48);
  assert(fills.length>8,'draws multiple layers of sandstone and strata');
  assert(fills.includes('#8a6b46'),'base sandstone boundary');
  assert(fills.includes('#e5d3a8'),'sunlit sandstone face');
  assert(fills.includes('#c8ad7f'),'sandstone body');
  assert(fills.includes('#f4e7c5'),'mortar strata highlight');
});

test('Jubilife fountain renders a stepped stone basin and separate water highlights',()=>{
  const fills:string[]=[];
  const ctx={fillStyle:'',fillRect:()=>{fills.push(ctx.fillStyle)}} as unknown as CanvasRenderingContext2D;
  paintJubilifeFountain(ctx,0,0,48,32);
  assert(fills.includes('#d6d7bf'),'stone basin');
  assert(fills.includes('#5a9fba'),'water surface');
  assert(fills.includes('#b9e4e1'),'water highlight');
  assert(fills.includes('#f0eed5'),'central fountain cap');
});

test('desert ground and paths use sandstone marks rather than grass-green path edges',()=>{
  const fills:string[]=[];
  const ctx={fillStyle:'',fillRect:()=>{fills.push(ctx.fillStyle)},drawImage:()=>{}} as unknown as CanvasRenderingContext2D;
  paintTourGround(ctx,{} as CanvasImageSource,16,32,'desert');
  paintTourPaths(ctx,{} as CanvasImageSource,new Set(['1,2']),'desert');
  assert(fills.includes('#d9bd7d'),'warm sand base');
  assert(fills.includes('#e7c982'),'packed sand path');
  assert(fills.includes('#a88050'),'sand-brown path edge');
  assert(!fills.includes('#8dc579'),'does not use the generic green path edge');
});
