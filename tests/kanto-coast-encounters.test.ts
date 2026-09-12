import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import DATA from '../src/runtime-pokemon-data.json';
import {wildPokemon,encounterPool,hasWildEncounters,speciesHabitats} from '../src/runtime-encounters';
import {newSave,parseSave} from '../src/save';
import {grantPokemon,pokemonMoves,availableMoves,teachMove,isDamagingMove,validPokemonMoves} from '../src/pokemon';
import {createBattle,battleTurn} from '../src/battle';
import {LEVEL_CAP,gainExperience} from '../src/growth';
import {getMap} from '../src/maps';
import {showPokedex} from '../src/journey-services';
import {encounterGuidance} from '../src/encounter-guidance';
import {Engine} from '../src/engine';

const MAP='tour_pass_vermilion_cerulean';
const species=[19,52,21,23,39,96];
const expectedMoves=[['필살앞니','꼬리흔들기'],['할퀴기','울음소리'],['제비반환','째려보기'],['물기','째려보기'],['막치기','웅크리기'],['염동력','박치기']];
function ready(){const s=newSave();grantPokemon(s,1);s.flags.departureCleared=true;s.map=MAP;s.player={x:2,y:10,facing:'right'};s.inventory.pokeBalls=2;return s;}
function monster(slot:number,levelRoll:number){const pool=encounterPool(MAP)!,before=pool.slots.slice(0,slot).reduce((n,s)=>n+s.weight,0);let call=0;return wildPokemon(MAP,()=>call++===0?(before+pool.slots[slot].weight/2)/100:levelRoll)!;}
test('K18 keeps all six authored weights and original levels as evidence while exposing only save-compatible levels',()=>{
  const source=JSON.parse(readFileSync('docs/design-data/encounters.json','utf8')).find((p:{id:string})=>p.id==='ENC-039');
  const pool=encounterPool(MAP)!;assert.equal(pool.id,'ENC-039');assert.equal(pool.node,'K18');assert.deepEqual(pool.slots,source.slots.map(({speciesId,weight}:{speciesId:number;weight:number})=>({speciesId,weight})));
  assert.deepEqual(pool.slots.map(s=>s.speciesId),species);assert.deepEqual(pool.slots.map(s=>s.weight),[30,25,20,12,8,5]);assert.deepEqual(source.levels,[22,27]);assert.deepEqual(pool.sourceLevels,source.levels);assert.deepEqual(pool.levels,[22,25]);assert.match(pool.levelPolicy!,/limited to level 25/);assert.equal(LEVEL_CAP,25);assert.match(DATA.limits,/four selected moves/);
  assert.deepEqual(Array.from({length:4},(_,i)=>monster(0,(i+.5)/4).level),[22,23,24,25]);
  for(const map of ['tour_vermilion','tour_cerulean','tour_pass_pewter_cerulean','tour_pass_cerulean_saffron','tour_pass_cinnabar_vermilion']){assert(!hasWildEncounters(map),map);assert.equal(wildPokemon(map),null);}
});
test('every coast species has supported minimum/maximum-level attacks and captured saves round-trip without extra progression',()=>{
  for(let slot=0;slot<species.length;slot++)for(const levelRoll of [0,1-Number.EPSILON]){
    const p=monster(slot,levelRoll);assert.equal(p.species,species[slot]);assert.equal(p.level,levelRoll===0?22:25);assert.equal(p.met,getMap(MAP).name);assert.deepEqual(pokemonMoves(p),expectedMoves[slot]);assert(pokemonMoves(p).some(isDamagingMove));assert(validPokemonMoves(p,[]));
    const s=ready(),b=createBattle(s,'wild','roark',()=>0)!;b.enemy=p;b.enemy.hp=1;const turn=battleTurn(s,b,'ball');assert.equal(turn.outcome,'caught');
    const loaded=parseSave(JSON.stringify(s));assert(loaded,`${p.species} Lv${p.level}`);assert.deepEqual(loaded.party.at(-1),s.party.at(-1));assert(loaded.pokedex!.caught.includes(p.species));assert.equal(loaded.badges.length,0);
    if(p.level===25){const caught=loaded.party.at(-1)!,before=structuredClone(caught);gainExperience(caught,1000);assert.deepEqual(caught,before);assert(parseSave(JSON.stringify(loaded)));}
  }
  const s=ready();s.party.push(monster(1,0));assert(availableMoves(s.party[1],s).includes('물기'));assert(teachMove(s,1,'물기',2));assert(parseSave(JSON.stringify(s)));
});
test('new sprite files use pinned Platinum front/back assets with matching hashes and dimensions',()=>{
  const manifest=JSON.parse(readFileSync('public/assets/pokemon-runtime-sources.json','utf8'));
  for(const id of species)for(const side of ['','back-']){
    const file=`pokemon-${side}${id}.png`,bytes=readFileSync(`public/assets/${file}`),entry=manifest.sprites.find((s:{file:string})=>s.file===file);
    assert(entry,file);assert.match(entry.url,/6e523c72bb714306c90912647e0b2ccc4fd2fff1.*generation-iv\/platinum/);assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),80);assert.equal(bytes.readUInt32BE(20),80);
  }
});
test('coast capture updates the actual Pokedex habitat page and route guidance uses the runtime range',()=>{
  const g=new Engine();g.save=ready();g.announce=()=>{};
  for(let slot=0;slot<species.length;slot++){
    const p=monster(slot,0);g.save.pokedex!.seen.push(p.species);g.save.pokedex!.caught.push(p.species);
    const habitats=speciesHabitats(p.species);assert.deepEqual(habitats.map(h=>[h.name,h.minLevel,h.maxLevel]),[['갈색–블루 해안길',22,25],...([19,96].includes(p.species)?[['성도 34번도로',22,24]]:[])]);
    let page=0;while(true){showPokedex(g,page);const choice=g.dialogue!.choices!.find(c=>c.label.includes(` ${['꼬렛','나옹','깨비참','아보','푸린','슬리프'][slot]}`));if(choice){choice.action();break;}assert(g.dialogue!.choices!.some(c=>c.label==='다음 페이지'));page++;}
    assert(g.dialogue!.pages.some(p=>p.includes('잡은 포켓몬')));assert(g.dialogue!.pages.some(p=>p.includes('갈색–블루 해안길')&&p.includes('Lv.22~25')));
  }
  const pages=encounterGuidance(MAP).pages.join('\n');assert.match(pages,/꼬렛·나옹/);assert.match(pages,/슬리프/);assert.match(pages,/22~25/);assert(!pages.includes('27'));
});
