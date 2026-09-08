import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { getMap,canStand,canEnter } from '../src/maps';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { encounterPool } from '../src/runtime-encounters';
import { TOUR_FEATURES,TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { tourMinimapLayout } from '../src/explore-minimap';
import { TOWN_REVISION } from '../src/town';

const id='tour_coronet';
const oldRows=['####################','####################','##########.#########','##................##','##..........#.....##','##..##........##..##','##..##..###...##..##','##......###.....#.##','##................##','##.................#','##................##','##........##......##','##........##..##..##','##........##..##..##','##..........#.....##','##................##','##########.#########','####################'];
function ready(){const s=newSave();grantPokemon(s,1);s.flags.departureCleared=true;s.map=id;s.player={...TOUR_SPAWNS[id],facing:'up'};return s;}
const grassy=(x:number,y:number)=>getMap(id).terrain!.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
function distances(safe=false){const map=getMap(id),q=[[10,3,0]],seen=new Map<string,number>();for(let i=0;i<q.length;i++){const[x,y,d]=q[i],key=`${x},${y}`;if(seen.has(key)||!canStand(map,x,y)||safe&&grassy(x,y))continue;seen.set(key,d);for(const v of Object.values(VECTOR))q.push([x+v.x,y+v.y,d+1]);}return seen;}

test('Coronet keeps every former valid coordinate, five old rocks, investigation IDs and healing guide',()=>{
  const map=getMap(id);assert.deepEqual([map.width,map.height],[20,30]);assert.equal(TOWN_REVISION,24);
  for(let y=0;y<oldRows.length;y++)for(let x=0;x<oldRows[y].length;x++)if(oldRows[y][x]==='.'&&!(x===12&&y===7)){
    assert(canStand(map,x,y),`${x},${y}`);const save=ready();save.player={x,y,facing:'left'};save.money=2800;save.flags.gymCartStage=2;const restored=parseSave(JSON.stringify(save));assert(restored);assert.deepEqual(restored.player,save.player);assert.deepEqual(restored.party,save.party);assert.equal(restored.money,2800);assert.equal(restored.flags.gymCartStage,2);
  }
  assert.deepEqual(TOUR_SPAWNS[id],{x:10,y:10});assert.deepEqual(map.npcs.map(n=>[n.id,n.x,n.y,n.dialogue]),[['tourGuide',12,7,'trailGuide']]);
  assert.deepEqual(TOUR_OUTDOORS[id].objects.slice(0,5).map(o=>[o.event,o.name]),[['tourOutdoor0','동굴 암반'],['tourOutdoor1','동굴 암반'],['tourOutdoor2','겹겹이 드러난 지층'],['tourOutdoor3','풀밭 옆 바위턱'],['tourOutdoor4','호수 쪽 암반']]);
  for(const [x,y,w,h]of [[4,5,2,2],[14,12,2,2],[8,6,3,2],[10,11,2,3],[14,5,2,2]])for(let b=y;b<y+h;b++)for(let a=x;a<x+w;a++)assert(!canStand(map,a,b));
});

test('the longer safe route and southern encounter branch reconnect while every registered face is approachable',()=>{
  const map=getMap(id),safe=distances(true),all=distances();assert.equal(safe.get('10,27'),38);assert.equal(all.get('10,27'),32);assert(safe.has('12,8'));assert(safe.has('17,9'));
  const grass=map.terrain![1];assert.deepEqual(grass,{kind:'tallGrass',x:2,y:20,w:6,h:5});assert(safe.has('7,19'));assert(safe.has('7,25'));
  for(let y=grass.y;y<grass.y+grass.h;y++)for(let x=grass.x;x<grass.x+grass.w;x++){assert(all.has(`${x},${y}`));assert(!safe.has(`${x},${y}`));assert(!map.props.some(p=>p.x===x&&p.y===y));}
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(canStand(map,x,y))assert(all.has(`${x},${y}`));
  for(const object of TOUR_OUTDOORS[id].objects){assert(object.cells.length);for(const cell of object.cells)assert(Object.values(VECTOR).some(v=>all.has(`${cell.x+v.x},${cell.y+v.y}`)),`${object.event}:${cell.x},${cell.y}`);}
});

test('Hearthome uses the new south entry while Eterna and the lake retain their original mouths and return directions',()=>{
  const map=getMap(id);assert.deepEqual(map.warps.map(w=>[w.x,w.y,w.to,w.entry]),[[10,2,'tour_eterna','up'],[10,28,'tour_hearthome','down'],[18,9,'tour_lake','right']]);
  assert.deepEqual(getMap('tour_hearthome').warps.find(w=>w.to===id)!.spawn,{x:10,y:27});assert.deepEqual(getMap('tour_eterna').warps.find(w=>w.to===id)!.spawn,{x:10,y:3});assert.deepEqual(getMap('tour_lake').warps.find(w=>w.to===id)!.spawn,{x:17,y:9});
  for(const source of [map,getMap('tour_eterna'),getMap('tour_hearthome'),getMap('tour_lake')])for(const w of source.warps.filter(w=>source.id===id||w.to===id)){
    const g=new Engine();g.save=ready();g.save.map=source.id;const v=VECTOR[w.entry];g.save.player={x:w.x-v.x,y:w.y-v.y,facing:w.entry};assert(canStand(source,g.save.player.x,g.save.player.y));for(const dir of ['up','down','left','right'] as const)assert.equal(canEnter(source,w.x,w.y,dir),dir===w.entry);g.walk(w.entry);for(let i=0;i<20;i++)g.update(.05);assert.equal(g.save.map,w.to);assert.deepEqual(g.save.player,{...w.spawn,facing:w.facing});assert(parseSave(JSON.stringify(g.save)));
  }
  assert(canStand(map,10,16));assert(!map.warps.some(w=>w.y===16));
});

test('both encounter patches use the unchanged S15 pool and the guide still heals without post-badge supplies',()=>{
  const map=getMap(id),pool=encounterPool(id)!;assert.equal(pool.id,'ENC-016');assert.deepEqual(pool.levels,[13,17]);assert.deepEqual(pool.slots.map(s=>[s.speciesId,s.weight]),[[41,35],[74,25],[307,20],[173,15],[443,5]]);assert.deepEqual(map.terrain![0],{kind:'tallGrass',x:4,y:10,w:4,h:3});
  const old=globalThis.document;globalThis.document={getElementById:()=>null} as unknown as Document;
  try{
    for(const r of map.terrain!){const g=new Engine();g.save=ready();g.save.player={x:r.x,y:r.y,facing:'up'};g.random=()=>0;for(let i=0;i<6;i++)g.onFieldStep();assert.equal(g.battle!.enemy.species,41);assert.equal(g.battle!.enemy.level,13);}
    const g=new Engine();g.save=ready();g.save.party[0].hp=1;g.save.badges=['BADGE-GS01'];g.save.keyItems=['TM-stealth-rock'];g.save.inventory.potions=0;g.event('trailGuide');assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert.equal(g.save.inventory.potions,0);assert.match(g.dialogue!.pages.join(''),/영원시티.*연고시티/s);assert.match(g.dialogue!.pages.join(''),/신오 호수/);
  }finally{globalThis.document=old;}
});

test('Coronet geometry and minimap fit the new map while the other expanded forest stays unchanged',()=>{
  const m=getMap(id);for(const row of m.walkable)assert.equal(row.length,20);assert.equal(m.walkable.length,30);
  for(const r of [...TOUR_FEATURES[id],...m.terrain!])assert(r.x>=0&&r.y>=0&&r.x+r.w<=m.width&&r.y+r.h<=m.height);
  for(const [x,y,w,h]of TOUR_LAYOUTS[id].paths)assert(x>=0&&y>=0&&x+w<=m.width&&y+h<=m.height);
  const mini=tourMinimapLayout(m);assert(mini.x>=0);assert(mini.x+m.width*mini.scale<=256);assert(mini.y+m.height*mini.scale<=192);assert.deepEqual([getMap('tour_eterna_forest').width,getMap('tour_eterna_forest').height],[32,34]);
});
