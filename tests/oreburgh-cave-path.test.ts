import test from 'node:test';
import assert from 'node:assert/strict';
import { getMap } from '../src/maps';
import { newSave } from '../src/save';
import { PASSAGES } from '../src/journey-world';
import { paintJourneyPassage } from '../src/journey-art';

function context(){
  const fills:{x:number;y:number;w:number;h:number;color:string}[]=[];
  const c={
    fillStyle:'',
    fillRect(x:number,y:number,w:number,h:number){fills.push({x,y,w,h,color:this.fillStyle})},
    drawImage(){},
    save(){},
    restore(){},
    translate(){},
    beginPath(){},
    moveTo(){},
    lineTo(){},
    closePath(){},
    clip(){},
  } as unknown as CanvasRenderingContext2D;
  return {c,fills};
}

const tileFills=(fills:{x:number;y:number;w:number;h:number;color:string}[],x:number,y:number)=>
  fills.filter(f=>f.x>=x*16&&f.x<(x+1)*16&&f.y>=y*16&&f.y<(y+1)*16);

test('Oreburgh cave art branch is isolated to the authored map',()=>{
  const cave=getMap('tour_pass_jubilife_oreburgh',newSave().flags);
  const roadId=Object.keys(PASSAGES).find(id=>PASSAGES[id].kind==='road')!;
  const road=getMap(roadId as any,newSave().flags);
  const caveArt=context(),roadArt=context();
  paintJourneyPassage(caveArt.c,{},cave);
  paintJourneyPassage(roadArt.c,{},road);
  assert(caveArt.fills.some(f=>f.color==='#c7aa78'));
  assert(!roadArt.fills.some(f=>f.color==='#c7aa78'));
});

test('Oreburgh cave art does not mutate the source map',()=>{
  const map=getMap('tour_pass_jubilife_oreburgh',newSave().flags);
  const before=structuredClone(map);
  paintJourneyPassage(context().c,{},map);
  assert.deepEqual(map,before);
});

test('Oreburgh cave keeps the existing warps and safe main route',()=>{
  const map=getMap('tour_pass_jubilife_oreburgh',newSave().flags);
  const before=structuredClone(map.warps);
  paintJourneyPassage(context().c,{},map);
  assert.deepEqual(map.warps,before);
  assert.deepEqual(map.warps.map(({x,y,to})=>({x,y,to})),[
    {x:1,y:10,to:'tour_jubilife'},
    {x:30,y:10,to:'tour_oreburgh'},
  ]);
  for(const y of [9,10,11])for(const x of [1,10,15,22,30])assert.equal(map.walkable[y][x],'.',`${x},${y}`);
  for(const [x,y] of [[9,7],[9,11],[12,7],[21,7],[24,11]] as const)assert.equal(map.walkable[y][x],'.',`${x},${y}`);
});

test('path hint stays on walkable non-prop tiles and points to the encounter patch',()=>{
  const map=getMap('tour_pass_jubilife_oreburgh',newSave().flags),{c,fills}=context();
  paintJourneyPassage(c,{},map);
  const pathColor='#bca77f80',hintColor='#c7aa78';
  assert(tileFills(fills,15,9).some(f=>f.color===pathColor));
  assert(tileFills(fills,9,7).some(f=>f.color===pathColor));
  assert(tileFills(fills,16,10).some(f=>f.color===hintColor));
  assert(tileFills(fills,16,12).some(f=>f.color===hintColor));
  for(const prop of map.props)assert(!tileFills(fills,prop.x,prop.y).some(f=>f.color===pathColor||f.color===hintColor));
  for(const row of map.walkable)assert.equal(row.length,map.width);
});
