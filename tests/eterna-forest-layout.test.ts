import test from 'node:test';
import assert from 'node:assert/strict';
import { getMap,getWorldOutdoors,canStand,canEnter } from '../src/maps';
import { Engine,VECTOR } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { encounterPool,hasWildEncounters } from '../src/runtime-encounters';
import { TOUR_FEATURES,TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { buildExploreArt } from '../src/explore-art';
import { tourMinimapLayout } from '../src/explore-minimap';
import { TOWN_REVISION } from '../src/town';

const id='tour_eterna_forest',oldRows=[
  '####################','####################','##########.#########','##................##',
  '##..####....#####.##','##..####.....####.##','##..####.....####.##','##..####.....####.##',
  '##................##','##................##','##................##','##........##.####.##',
  '##........##.####.##','##........##.####.##','##........#######.##','##................##',
  '##########.#########','####################',
];
const grassy=(x:number,y:number)=>getMap(id).terrain!.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
function distances(start:[number,number],safe=false){const map=getMap(id),queue=[{x:start[0],y:start[1],d:0}],seen=new Map<string,number>();for(let i=0;i<queue.length;i++){const {x,y,d}=queue[i],key=`${x},${y}`;if(seen.has(key)||!canStand(map,x,y)||safe&&grassy(x,y))continue;seen.set(key,d);for(const v of Object.values(VECTOR))queue.push({x:x+v.x,y:y+v.y,d:d+1});}return seen;}
function ready(){const save=newSave();grantPokemon(save,1);save.flags.departureCleared=true;save.map=id;save.player={...TOUR_SPAWNS[id],facing:'up'};return save;}

test('forest expansion preserves every former valid save tile and existing investigation identities',()=>{
  const map=getMap(id);assert.deepEqual([map.width,map.height],[32,34]);assert.equal(TOWN_REVISION,24);
  for(let y=0;y<oldRows.length;y++)for(let x=0;x<oldRows[y].length;x++){
    if(oldRows[y][x]!=='.'||x===12&&y===7)continue;
    assert(canStand(map,x,y),`old floor ${x},${y}`);
    const save=ready();save.player={x,y,facing:'left'};save.flags.gymCartStage=1;save.money=520;
    const restored=parseSave(JSON.stringify(save));assert(restored,`old save ${x},${y}`);assert.deepEqual(restored.player,save.player);assert.deepEqual(restored.party,save.party);assert.equal(restored.money,520);assert.equal(restored.flags.gymCartStage,1);
  }
  assert.deepEqual(map.npcs.map(n=>({id:n.id,x:n.x,y:n.y,dialogue:n.dialogue})),[{id:'tourGuide',x:12,y:7,dialogue:'trailGuide'}]);
  assert.deepEqual(TOUR_OUTDOORS[id].objects.slice(0,5).map(o=>[o.event,o.name]),[['tourOutdoor0','숲의 나무'],['tourOutdoor1','빛이 스미는 나무'],['tourOutdoor2','북쪽 나무 군락'],['tourOutdoor3','풀밭 옆 나무'],['tourOutdoor4','숲 가장자리 나무']]);
  assert.deepEqual(map.terrain![0],{kind:'tallGrass',x:4,y:10,w:4,h:3});
  assert.equal(getMap('tour_coronet').width,20);assert.equal(getMap('tour_ilex').height,18);
});

test('safe route spans the new bend while both grass branches join back to reachable paths',()=>{
  const map=getMap(id),safe=distances([10,31],true),all=distances([10,31]);
  assert.equal(safe.get('10,3'),54);assert.equal(all.get('10,3'),32);
  assert(safe.has('12,8'),'healing guide remains reachable without encounters');
  for(const r of map.terrain!.slice(1)){
    assert(safe.has(`${r.x},${r.y-1}`),'upper grass approach');assert(safe.has(`${r.x+r.w-1},${r.y+r.h}`),'lower grass approach');
    for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){assert(all.has(`${x},${y}`));assert(!safe.has(`${x},${y}`));assert(!map.props.some(p=>p.x===x&&p.y===y));}
  }
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(canStand(map,x,y))assert(all.has(`${x},${y}`),`disconnected floor ${x},${y}`);
  for(const object of TOUR_OUTDOORS[id].objects){assert(object.cells.length,object.name);for(const cell of object.cells)assert(Object.values(VECTOR).some(v=>all.has(`${cell.x+v.x},${cell.y+v.y}`)),`${object.event} face ${cell.x},${cell.y}`);}
});

test('city transitions use the moved southern mouth and preserve exact entry directions in both directions',()=>{
  const forest=getMap(id),jubilife=getMap('tour_jubilife'),eterna=getMap('tour_eterna');
  const south=getMap('tour_sinnoh_route_02'),north=getMap('tour_sinnoh_route_03');
  assert.deepEqual(forest.warps.map(w=>[w.x,w.y,w.to,w.entry]),[[10,32,south.id,'down'],[10,2,north.id,'up']]);
  assert.deepEqual(south.warps.find(w=>w.to===id)!.spawn,{x:10,y:31});assert.deepEqual(north.warps.find(w=>w.to===id)!.spawn,{x:10,y:3});
  assert(jubilife.warps.some(w=>w.to===south.id));assert(eterna.warps.some(w=>w.to===north.id));
  const chain=[jubilife,south,forest,north,eterna];
  for(const [from,to] of [[jubilife,south],[forest,south],[forest,north],[eterna,north]]){
    const sign=getWorldOutdoors(from)!.signs.find(sign=>sign.destination===to.id);
    assert(sign,`${from.id} names the actual connecting road`);assert.equal(sign.name,to.name);
    for(const page of sign.pages){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=24,line);}
  }
  for(const map of chain)for(const w of map.warps.filter(w=>chain.some(area=>area.id===w.to))){
    assert(canStand(getMap(w.to),w.spawn.x,w.spawn.y));
    for(const direction of ['up','down','left','right'] as const)assert.equal(canEnter(map,w.x,w.y,direction),w.entry===direction);
    const g=new Engine();g.save=ready();g.save.map=map.id;const v=VECTOR[w.entry];g.save.player={x:w.x-v.x,y:w.y-v.y,facing:w.entry};g.walk(w.entry);for(let i=0;i<20;i++)g.update(.05);assert.equal(g.save.map,w.to);assert.deepEqual(g.save.player,{...w.spawn,facing:w.facing});assert(parseSave(JSON.stringify(g.save)));
  }
  assert.equal(forest.warps.some(w=>w.x===10&&w.y===16),false);assert(canStand(forest,10,16));
});

test('new grass retains the existing six-species pool and creates actual forest encounters',()=>{
  const pool=encounterPool(id)!;assert.equal(pool.id,'ENC-004');assert.deepEqual(pool.levels,[10,14]);assert.deepEqual(pool.slots.map(s=>[s.speciesId,s.weight]),[[265,30],[266,25],[268,20],[406,12],[427,8],[415,5]]);assert(hasWildEncounters(id));
  const old=globalThis.document;globalThis.document={getElementById:()=>null} as unknown as Document;
  try{for(const r of getMap(id).terrain!.slice(1)){const g=new Engine();g.save=ready();g.save.player={x:r.x,y:r.y,facing:'up'};g.random=()=>0;for(let i=0;i<6;i++)g.onFieldStep();assert.equal(g.battle?.enemy.species,265);assert.equal(g.battle?.enemy.level,10);}}finally{globalThis.document=old;}
});

test('expanded art and minimap use the new dimensions and keep all authored geometry in bounds',()=>{
  const map=getMap(id),width=map.width*16,height=map.height*16,old=globalThis.document;
  const fills:number[][]=[];const context=new Proxy({}, {get:(_target,key)=>key==='fillRect'?((...rect:number[])=>fills.push(rect)):(()=>{})}) as CanvasRenderingContext2D;
  const canvas={width:0,height:0,getContext:()=>context} as unknown as HTMLCanvasElement;
  globalThis.document={createElement:()=>canvas} as unknown as Document;
  const before=structuredClone(map);
  try{const built=buildExploreArt({'town-reference':{} as HTMLImageElement},id);assert.equal(built.width,width);assert.equal(built.height,height);}finally{globalThis.document=old;}
  assert(fills.length>0);for(const [x,y,w,h] of fills){assert([x,y,w,h].every(Number.isFinite));assert(x>=0&&y>=0&&x+w<=width&&y+h<=height,`paint ${x},${y},${w},${h}`);}
  for(const r of [...TOUR_FEATURES[id],...map.terrain!])assert(r.x>=0&&r.y>=0&&r.x+r.w<=map.width&&r.y+r.h<=map.height);
  for(const [x,y,w,h] of TOUR_LAYOUTS[id].paths)assert(x>=0&&y>=0&&x+w<=map.width&&y+h<=map.height);
  const mini=tourMinimapLayout(map);assert(mini.x>=0);assert(mini.x+map.width*mini.scale<=256);assert(mini.y+map.height*mini.scale<=192);assert.deepEqual(getMap(id),before);
});
