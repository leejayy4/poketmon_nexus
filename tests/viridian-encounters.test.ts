import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {wildPokemon,encounterPool,hasWildEncounters,speciesHabitats} from '../src/runtime-encounters';
import {getMap,canStand} from '../src/maps';
import {tourExitPath} from '../src/explore-navigation';
import {TOUR_LAYOUTS} from '../src/explore-layouts';
import {newSave,parseSave} from '../src/save';
import {grantPokemon,pokemonMoves,validPokemonMoves} from '../src/pokemon';
import {createBattle,battleTurn} from '../src/battle';
import {viridianForestGuidePages} from '../src/encounter-guidance';
import {Engine} from '../src/engine';

const id='tour_viridian_forest';
test('Viridian uses exactly the authored daytime forest pool and keeps nearby cities peaceful',()=>{
  const pool=encounterPool(id)!;
  const source=JSON.parse(readFileSync('docs/design-data/encounters.json','utf8')).find((p:{id:string})=>p.id==='ENC-027');
  assert.equal(pool.node,'K05');assert.equal(pool.condition,'낮');assert.deepEqual(pool.levels,[20,24]);
  assert.deepEqual(pool.slots,source.slots.map(({speciesId,weight}:{speciesId:number;weight:number})=>({speciesId,weight})));
  assert.deepEqual(pool.slots.map(s=>s.speciesId),[10,13,11,14,25]);
  for(const map of ['tour_pewter','tour_viridian','tour_ilex','tour_pass_pewter_cerulean'])assert(!hasWildEncounters(map),map);
});

test('both optional grass patches are reachable and leave both marked forest routes and old positions intact',()=>{
  const map=getMap(id),grass=map.terrain!;
  const inside=(x:number,y:number)=>grass.some(g=>x>=g.x&&x<g.x+g.w&&y>=g.y&&y<g.y+g.h);
  for(const patch of grass)for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++){
    assert(canStand(map,x,y));assert(!map.props.some(p=>p.x===x&&p.y===y));assert(!map.warps.some(w=>w.x===x&&w.y===y));
    assert(!TOUR_LAYOUTS[id].paths.some(([px,py,w,h])=>x>=px&&x<px+w&&y>=py&&y<py+h));
  }
  const safe={...map,walkable:map.walkable.map((row,y)=>[...row].map((c,x)=>inside(x,y)?'#':c).join(''))};
  for(const [start,warp] of [[{x:10,y:3},map.warps[0]],[{x:10,y:15},map.warps[1]]] as const){
    const path=tourExitPath(safe,start,warp);assert(path.length>0);assert(path.every(p=>!inside(p.x,p.y)));
  }
  for(const patch of grass){const s=newSave();grantPokemon(s,1);s.flags.departureCleared=true;s.map=id;s.player={x:patch.x,y:patch.y,facing:'left'};
    assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
  }
});

test('all forest slots at both level limits capture into valid saves with their own supported moves',()=>{
  const pool=encounterPool(id)!,moves=[['벌레먹기','몸통박치기'],['벌레먹기','독침'],['벌레먹기','단단해지기'],['벌레먹기','단단해지기'],['전기쇼크','꼬리흔들기']];
  let prior=0;
  for(const [i,slot] of pool.slots.entries()){
    for(const end of [0,1-Number.EPSILON]){
      let call=0;const p=wildPokemon(id,()=>call++===0?(prior+slot.weight/2)/100:end)!;
      assert.equal(p.species,slot.speciesId);assert.equal(p.level,end===0?20:24);assert.equal(p.met,'상록숲');assert.deepEqual(pokemonMoves(p),moves[i]);assert(validPokemonMoves(p,[]));
      const s=newSave();grantPokemon(s,1);s.flags.departureCleared=true;s.map=id;s.player={x:10,y:3,facing:'down'};s.inventory.pokeBalls=1;
      const b=createBattle(s,'wild','roark',()=>0)!;b.enemy=p;b.enemy.hp=1;assert.equal(battleTurn(s,b,'ball').outcome,'caught');
      const loaded=parseSave(JSON.stringify(s));assert(loaded);assert.deepEqual(loaded.party.at(-1),s.party.at(-1));assert.equal(loaded.flags.pikachuReceived,undefined);
      assert(speciesHabitats(p.species).some(h=>h.name==='상록숲'&&h.minLevel===20&&h.maxLevel===24));
    }
    prior+=slot.weight;
  }
});

test('guide connects real encounters to safe travel and eight new Platinum sprites have verified provenance',()=>{
  const g=new Engine();g.announce=()=>{};g.save.map=id;const before=structuredClone(g.save);g.event('viridianForestGuide');
  assert.deepEqual(g.dialogue?.pages,viridianForestGuidePages());assert.deepEqual(g.save,before);
  const pages=g.dialogue!.pages.join('\n');for(const text of ['회색시티','상록시티','흙길','캐터피·뿔충이','피카츄','20~24','센터'])assert(pages.includes(text));
  const manifest=JSON.parse(readFileSync('public/assets/pokemon-runtime-sources.json','utf8'));
  for(const species of [10,11,13,14])for(const side of ['','back-']){
    const file=`pokemon-${side}${species}.png`,bytes=readFileSync(`public/assets/${file}`),entry=manifest.sprites.find((s:{file:string})=>s.file===file);
    assert.match(entry.url,/6e523c72bb714306c90912647e0b2ccc4fd2fff1.*generation-iv\/platinum/);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);assert.equal(bytes.readUInt32BE(16),80);assert.equal(bytes.readUInt32BE(20),80);
  }
});
