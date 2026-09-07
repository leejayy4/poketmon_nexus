import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_LAYOUTS } from '../src/explore-layouts';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { canStand,getMap } from '../src/maps';
import { tourExitPath } from '../src/explore-navigation';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOWN_REVISION } from '../src/town';
import { Engine,VECTOR } from '../src/engine';

const id='tour_coronet',layout=TOUR_LAYOUTS[id];
test('Coronet marked paths connect every pair of its three exits without forcing encounters',()=>{
  const map=getMap(id),paths=new Set<string>();
  assert.deepEqual([map.width,map.height],[20,18]);
  assert.deepEqual(map.terrain,[{kind:'tallGrass',x:4,y:10,w:4,h:3}]);
  assert.deepEqual(map.warps.map(w=>[w.to,w.x,w.y,w.entry]),[
    ['tour_eterna',10,2,'up'],['tour_hearthome',10,16,'down'],['tour_lake',18,9,'right'],
  ]);
  for(const [x,y,w,h]of layout.paths)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){
    assert.equal(map.walkable[j][i],'.',`path overlaps rock at ${i},${j}`);
    assert(!map.terrain!.some(r=>i>=r.x&&i<r.x+r.w&&j>=r.y&&j<r.y+r.h),'grass stays optional');paths.add(i+','+j);
  }
  for(const warp of map.warps)paths.add(warp.x+','+warp.y);
  const trail={...map,walkable:map.walkable.map((row,y)=>[...row].map((cell,x)=>paths.has(x+','+y)?cell:'#').join(''))};
  for(const from of map.warps)for(const to of map.warps){if(from===to)continue;
    const v=VECTOR[from.entry],start={x:from.x-v.x,y:from.y-v.y};
    const path=tourExitPath(trail,start,to);assert(path.length>1,from.to+' to '+to.to);
  }
  assert(canStand(trail,12,8)); // Guide approach.
  for(const sign of TOUR_OUTDOORS[id].signs)assert(canStand(trail,sign.x,sign.y+1),sign.name+' sign approach');
  for(let y=10;y<=12;y++)assert(canStand(trail,8,y)&&canStand(map,7,y),'optional grass approach');
});

test('revision 18 Coronet floor saves retain progress and repair only new rock overlaps',()=>{
  const map=getMap(id);
  for(let y=3;y<=15;y++)for(let x=2;x<=17;x++){
    if((x>=4&&x<=5&&y>=5&&y<=6)||(x>=14&&x<=15&&y>=12&&y<=13))continue;
    if(map.npcs.some(n=>n.x===x&&n.y===y)||TOUR_OUTDOORS[id].signs.some(s=>s.x===x&&s.y===y))continue;
    const save=newSave();save.worldRevision=18;save.map=id;save.player={x,y,facing:'left'};
    grantPokemon(save,7);save.flags.departureCleared=true;save.inventory={pokeBalls:4,potions:3};save.steps=234;save.seconds=567;
    const loaded=parseSave(JSON.stringify(save));assert(loaded,`old floor ${x},${y}`);
    assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,canStand(map,x,y)?save.player:{...TOUR_SPAWNS[id],facing:'down'});
    for(const key of ['party','inventory','badges','keyItems','money','flags','steps','seconds'] as const)assert.deepEqual(loaded[key],save[key]);
  }
  const forest=newSave();forest.worldRevision=18;forest.map='tour_eterna_forest';forest.player={x:8,y:12,facing:'up'};
  assert.deepEqual(parseSave(JSON.stringify(forest))?.player,forest.player);
});

test('Coronet preserves old rock and sign event IDs while adding accessible scenery',()=>{
  const outdoor=TOUR_OUTDOORS[id];
  assert.deepEqual(outdoor.objects.slice(0,2).map(o=>[o.event,o.name]),[['tourOutdoor0','동굴 암반'],['tourOutdoor1','동굴 암반']]);
  assert.equal(outdoor.objects.length,5);
  assert.deepEqual(outdoor.signs.map(s=>s.event),['tourExit0','tourExit1','tourExit2']);
  for(const obj of outdoor.objects)assert(obj.cells.some(p=>Object.values(VECTOR).some(v=>canStand(getMap(id),p.x+v.x,p.y+v.y))),obj.name);
});

test('Coronet guide names all actual exits and retains healing without reducing stocked potions',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{
    const game=new Engine();game.save=newSave();grantPokemon(game.save,7);game.save.flags.departureCleared=true;
    game.save.map=id;game.save.player={x:12,y:8,facing:'up'};game.save.party[0].hp=1;game.save.inventory.potions=3;
    const flags=structuredClone(game.save.flags);game.confirm();
    assert.equal(game.dialogue?.speaker,'길 안내원');
    assert(game.dialogue?.pages[1].includes('북쪽은 영원시티, 남쪽은 연고시티'));
    assert(game.dialogue?.pages[1].includes('동쪽 갈림길은 신오 호수'));
    assert(!game.dialogue?.pages.join('').includes('서쪽'));
    assert.equal(game.save.party[0].hp,game.save.party[0].maxHp);assert.equal(game.save.inventory.potions,3);
    assert.deepEqual(game.save.flags,flags);assert.deepEqual(game.save.badges,[]);
  }finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
