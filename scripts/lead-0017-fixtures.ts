import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
// Public import fixture only; separate from natural journey save.
const s=newSave();grantPokemon(s,7);Object.assign(s.party[0],{level:10,hp:maxHpAtLevel(7,10),maxHp:maxHpAtLevel(7,10),moves:['몸통박치기','껍질에숨기']});
s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:4,y:9,facing:'left'};s.inventory={pokeBalls:5,potions:4};s.healingPoint='tour_oreburgh_center';assert(parseSave(JSON.stringify(s)));
fs.mkdirSync('tests/lead-0017-fixtures',{recursive:true});fs.writeFileSync('tests/lead-0017-fixtures/defense.json',JSON.stringify(s,null,2)+'\n');
