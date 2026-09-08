import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newSave,parseSave} from '../src/save';
import {grantPokemon,pokemonMoves} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import type {Pokemon} from '../src/types';
const mon=(species:number,level:number,moves?:string[]):Pokemon=>{const p:Pokemon={species,level,hp:maxHpAtLevel(species,level),maxHp:maxHpAtLevel(species,level),experience:0,nature:'성실',met:'준비 파티 재검증'};p.moves=moves??pokemonMoves(p);return p;};
for(const starter of [7,4]){const s=newSave();grantPokemon(s,starter);s.party=starter===7?[mon(7,8,['몸통박치기','꼬리흔들기','거품']),mon(401,4)]:[mon(4,8,['할퀴기','울음소리','불꽃세례']),mon(406,8)];s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};s.healingPoint='tour_oreburgh_center';s.inventory={pokeBalls:5,potions:4};s.money=300;assert(parseSave(JSON.stringify(s)));fs.mkdirSync('tests/lead-0019-fixtures',{recursive:true});fs.writeFileSync(`tests/lead-0019-fixtures/${starter===7?'squirtle':'charmander-budew'}.json`,JSON.stringify(s,null,2)+'\n');}
const city=newSave();grantPokemon(city,1);city.flags.departureCleared=true;city.map='tour_eterna';city.player={x:6,y:25,facing:'up'};assert(parseSave(JSON.stringify(city)));fs.writeFileSync('tests/lead-0019-fixtures/eterna-exterior.json',JSON.stringify(city,null,2)+'\n');
