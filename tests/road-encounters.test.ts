import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import DATA from '../src/runtime-pokemon-data.json';
import {encounterPool,wildPokemon,hasWildEncounters,speciesHabitats} from '../src/runtime-encounters';
import {getMap} from '../src/maps';
import {newSave,parseSave} from '../src/save';
import {grantPokemon,pokemonMoves,validPokemonMoves,isDamagingMove,MOVE_RULES} from '../src/pokemon';
import {createBattle,battleTurn} from '../src/battle';
import {LEVEL_CAP} from '../src/growth';

const roads=[
  {map:'tour_pass_hearthome_veilstone',id:'ENC-008',node:'S08',levels:[18,21]},
  {map:'tour_pass_hearthome_pastoria',id:'ENC-007',node:'S07',levels:[15,18]},
] as const;

test('two named roads use the selected design pools without enabling other roads',()=>{
  const design=JSON.parse(readFileSync('docs/design-data/encounters.json','utf8'));
  for(const road of roads){
    const pool=encounterPool(road.map)!;
    const source=design.find((p:{id:string})=>p.id===road.id);
    assert.equal(pool.id,road.id);assert.equal(pool.node,road.node);
    assert.deepEqual(pool.levels,road.levels);
    assert.deepEqual(pool.slots,source.slots.map(({speciesId,weight}:{speciesId:number;weight:number})=>({speciesId,weight})));
    assert.deepEqual(pool.levels,source.levels);
    assert(pool.levels[1]<=LEVEL_CAP);
  }
  assert.deepEqual(DATA.pools.map(p=>p.id).sort(),['ENC-001','ENC-002','ENC-003','ENC-004','ENC-007','ENC-008','ENC-016','ENC-039']);
  for(const map of ['tour_pass_veilstone_sunyshore','tour_pass_pastoria_sunyshore','tour_hearthome','tour_veilstone']){
    assert.equal(hasWildEncounters(map),false,map);assert.equal(wildPokemon(map),null,map);
  }
});

test('each new road slot has playable moves, sprite evidence and survives capture and save reload',()=>{
  const manifest=JSON.parse(readFileSync('public/assets/pokemon-runtime-sources.json','utf8'));
  for(const road of roads){
    const pool=encounterPool(road.map)!,weight=pool.slots.reduce((sum,s)=>sum+s.weight,0);
    let before=0;
    for(const slot of pool.slots){
      for(const levelRoll of [0,1-Number.EPSILON]){
        const roll=(before+slot.weight/2)/weight;
        let call=0;
        const p=wildPokemon(road.map,()=>call++===0?roll:levelRoll)!;
        assert.equal(p.species,slot.speciesId);
        assert.equal(p.level,pool.levels[levelRoll===0?0:1]);
        assert.equal(p.met,getMap(road.map).name);
        assert(speciesHabitats(p.species).some(h=>h.name===p.met));
        const moves=pokemonMoves(p);
        assert.equal(moves.length,2);assert(moves.some(isDamagingMove));
        assert(moves.every(move=>Boolean(MOVE_RULES[move])));assert(validPokemonMoves(p,[]));
        const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;save.map=road.map;save.inventory.pokeBalls=1;
        const battle=createBattle(save,'wild','roark',()=>0)!;battle.enemy=p;battle.enemy.hp=1;
        assert.equal(battleTurn(save,battle,'ball').outcome,'caught');
        const loaded=parseSave(JSON.stringify(save));assert(loaded,`${road.map}:${p.species}:${p.level}`);
        assert(loaded.pokedex!.caught.includes(p.species));
        assert.deepEqual(loaded.party.at(-1)?.moves,moves);
      }
      for(const side of ['','back-']){
        const file=`pokemon-${side}${slot.speciesId}.png`;
        assert.equal(readFileSync(`public/assets/${file}`).subarray(1,4).toString(),'PNG');
        assert(manifest.sprites.some((s:{file:string;sha256:string})=>s.file===file&&s.sha256.length===64));
      }
      before+=slot.weight;
    }
  }
});
