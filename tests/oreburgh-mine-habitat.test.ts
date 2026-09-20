import test from 'node:test';
import assert from 'node:assert/strict';
import DATA from '../src/runtime-pokemon-data.json';
import { getMap } from '../src/maps';
import { hasWildEncounters, wildPokemon } from '../src/runtime-encounters';
import { OREBURGH_MINE, MINE_HABITATS } from '../src/oreburgh-mine';
import { minimumLevel } from '../src/growth';

const MINE_POOL='S-OREBURGH-MINE-PT';
const GEODUDE=74, ZUBAT=41, ONIX=95;
const SPAWN={x:28,y:43};

const mine=()=>getMap(OREBURGH_MINE,{});
const habitatCells=()=>{
  const cells=new Set<string>();
  for(const t of mine().terrain??[])for(let y=t.y;y<t.y+t.h;y++)for(let x=t.x;x<t.x+t.w;x++)cells.add(`${x},${y}`);
  return cells;
};
/** Cells reachable from the entrance without ever stepping on an encounter cell. */
const safeReach=()=>{
  const m=mine(),grass=habitatCells();
  const walk=(x:number,y:number)=>m.walkable[y]?.[x]==='.';
  const seen=new Set([`${SPAWN.x},${SPAWN.y}`]),queue=[SPAWN];
  while(queue.length){
    const c=queue.shift()!;
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){
      const x=c.x+dx,y=c.y+dy,key=`${x},${y}`;
      if(seen.has(key)||!walk(x,y)||grass.has(key))continue;
      seen.add(key);queue.push({x,y});
    }
  }
  return seen;
};

test('the mine pool records its Platinum source, rates and levels', () => {
  const pool=DATA.pools.find(p=>p.node===MINE_POOL);
  assert(pool,'the mine has its own encounter pool');
  const source=(pool as {source?:{file:string;crossCheck?:string;version:string;checked:string;policy:string}}).source;
  assert(source,'an applied pool records where it came from');
  assert.equal(source.version,'platinum');
  assert.match(source.file,/bulbapedia\.bulbagarden\.net\/wiki\/Oreburgh_Mine/);
  assert.match(source.crossCheck??'',/serebii\.net/);
  assert.match(source.checked,/^\d{4}-\d{2}-\d{2}$/);
  assert.match(source.policy,/excluded/,'the policy names what was not adopted');

  const rates=Object.fromEntries(pool.slots.map(s=>[s.speciesId,s.weight]));
  assert.deepEqual(rates,{[GEODUDE]:65,[ZUBAT]:25,[ONIX]:10});
  assert.equal(pool.slots.reduce((n,s)=>n+s.weight,0),100);
  assert.deepEqual(pool.levels,[5,9]);
});

test('the mine is bound to that pool and only produces its own species and levels', () => {
  const m=mine();
  assert(hasWildEncounters(m.id),'the mine supports wild encounters');
  const species=new Set<number>(),levels=new Set<number>();
  for(let i=0;i<4000;i++){
    const wild=wildPokemon(m.id,Math.random);
    assert(wild,'a bound map always produces an encounter');
    species.add(wild.species);levels.add(wild.level);
  }
  assert.deepEqual([...species].sort((a,b)=>a-b),[ZUBAT,GEODUDE,ONIX].sort((a,b)=>a-b));
  for(const level of levels)assert(level>=5&&level<=9,`level ${level} outside 5-9`);
  for(const id of [ZUBAT,GEODUDE,ONIX]){
    assert((DATA.ownable as number[]).includes(id),`${id} must be catchable`);
    assert(DATA.species[String(id) as keyof typeof DATA.species],`${id} needs runtime data`);
    assert(minimumLevel(id)<=5,`${id} must be legal at the pool's lowest level`);
  }
});

test('every encounter cell is an open cell and clashes with nothing placed', () => {
  const m=mine(),cells=habitatCells();
  assert.equal(MINE_HABITATS.length,3,'three loose-rock pockets');
  assert(cells.size>0);
  for(const key of cells){
    const [x,y]=key.split(',').map(Number);
    assert.equal(m.walkable[y]?.[x],'.',`encounter cell ${key} must be walkable`);
  }
  const placed=new Set([
    ...m.warps.map(w=>`${w.x},${w.y}`),
    ...m.npcs.map(n=>`${n.x},${n.y}`),
    ...m.props.map(p=>`${p.x},${p.y}`),
    `${SPAWN.x},${SPAWN.y}`,
  ]);
  for(const key of cells)assert(!placed.has(key),`encounter cell ${key} covers something placed`);
});

test('the lit main line crosses the mine without a single encounter', () => {
  const m=mine(),safe=safeReach(),grass=habitatCells();
  const walk=(x:number,y:number)=>m.walkable[y]?.[x]==='.';
  const exit=m.warps[0];
  assert(safe.has(`${exit.x},${exit.y}`),'the city exit is reachable without an encounter');
  for(const npc of m.npcs){
    const reachable=[[0,1],[0,-1],[1,0],[-1,0]]
      .some(([dx,dy])=>safe.has(`${npc.x+dx},${npc.y+dy}`));
    assert(reachable,`${npc.name} must be approachable without an encounter`);
  }
  for(const prop of m.props){
    const reachable=[[0,1],[0,-1],[1,0],[-1,0]]
      .some(([dx,dy])=>walk(prop.x+dx,prop.y+dy)&&safe.has(`${prop.x+dx},${prop.y+dy}`));
    assert(reachable,`prop ${prop.dialogue} must be inspectable without an encounter`);
  }
  // Exploring is optional, but the pockets must still be enterable.
  const all=new Set([`${SPAWN.x},${SPAWN.y}`]),queue=[SPAWN];
  while(queue.length){
    const c=queue.shift()!;
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){
      const x=c.x+dx,y=c.y+dy,key=`${x},${y}`;
      if(all.has(key)||!walk(x,y))continue;
      all.add(key);queue.push({x,y});
    }
  }
  for(const key of grass)assert(all.has(key),`encounter cell ${key} is walled off`);
  assert(safe.size<all.size,'the pockets really are off the safe line');
});
