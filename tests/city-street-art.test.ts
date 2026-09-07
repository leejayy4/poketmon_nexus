import test from 'node:test';
import assert from 'node:assert/strict';
import { cityRoadTiles,paintCityStreets,CITY_STREET_SAMPLES } from '../src/city-street-art';
import { TOUR_MAPS,TOUR_PLANS } from '../src/explore-world';
import { JUBILIFE_ROADS } from '../src/explore-jubilife';

function recorder(){
  const pixels=new Map<string,string>(),images:number[][]=[];
  const c={fillStyle:'',fillRect(x:number,y:number,w:number,h:number){
    for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)pixels.set(`${i},${j}`,this.fillStyle);
  },drawImage(_source:unknown,...args:number[]){images.push(args)}} as unknown as CanvasRenderingContext2D;
  return {c,pixels,images};
}

test('city rendering preserves all live road footprints and never paints outside the paved tiles',()=>{
  for(const [id,plan]of Object.entries(TOUR_PLANS)){
    if(plan.style!=='urban')continue;
    const map=TOUR_MAPS[id as keyof typeof TOUR_MAPS],before=structuredClone(map.walkable);
    const streets=id==='tour_jubilife'?JUBILIFE_ROADS:[[12,3,4,map.height-5],[2,11,map.width-4,3],[2,map.height-9,map.width-4,3]];
    const roads=cityRoadTiles(map.walkable,streets),paths=new Set<string>();
    for(const [x,y,w,h]of plan.paths)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(map.walkable[j]?.[i]==='.')paths.add(`${i},${j}`);
    const originalRoads=[...roads],originalPaths=[...paths],paved=new Set([...paths,...roads]),{c,pixels,images}=recorder();
    paintCityStreets(c,{} as CanvasImageSource,roads,paths,id==='tour_jubilife'?[10,18,28]:[9,16,map.height-7]);
    for(const tile of roads){const [x,y]=tile.split(',').map(Number);assert.equal(map.walkable[y][x],'.',id)}
    for(const pixel of pixels.keys()){
      const [x,y]=pixel.split(',').map(Number);assert(paved.has(`${Math.floor(x/16)},${Math.floor(y/16)}`),`${id}: art outside pavement at ${pixel}`);
    }
    for(const args of images){
      assert(paved.has(`${args[4]/16},${args[5]/16}`));assert.equal(args[6],16);assert.equal(args[7],16);
      if(args[0]===CITY_STREET_SAMPLES.drain[0])assert(!roads.has(`${args[4]/16},${args[5]/16}`),'drain covers belong on pavement');
    }
    assert.deepEqual(map.walkable,before);assert.deepEqual([...roads],originalRoads);assert.deepEqual([...paths],originalPaths);
  }
});

test('intersection asphalt is seamless across tiles while inner and outer corners retain a curb',()=>{
  const roads=new Set(['1,0','0,1','1,1','2,1','1,2']),paths=new Set(['0,0','2,0','0,2','2,2']);
  const {c,pixels}=recorder();paintCityStreets(c,{} as CanvasImageSource,roads,paths,[]);
  const center=pixels.get('24,24');assert(center);
  for(const [x,y]of [[24,15],[24,16],[24,31],[24,32],[15,24],[16,24],[31,24],[32,24]])assert.equal(pixels.get(`${x},${y}`),center,'no curb seam within the crossing');
  assert.notEqual(pixels.get('16,16'),center,'inside bend has a curb');
  const end=recorder();paintCityStreets(end.c,{} as CanvasImageSource,new Set(['1,1']),new Set(),[]);
  assert(!end.pixels.has('16,16'),'outer corner reveals the native pavement');
  assert.notEqual(end.pixels.get('24,17'),end.pixels.get('24,24'),'edge is shaded');
});
