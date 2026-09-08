import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';

// Imported UI boundary check; not a naturally played first-badge save.
const s=newSave();grantPokemon(s,1);
Object.assign(s.party[0],{level:9,hp:maxHpAtLevel(1,9),maxHp:maxHpAtLevel(1,9)});
s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:11,y:11,facing:'up'};
s.inventory={pokeBalls:5,potions:4};s.money=300;s.healingPoint='tour_oreburgh_center';
assert(parseSave(JSON.stringify(s)));fs.mkdirSync('tests/lead-0016-fixtures',{recursive:true});
fs.writeFileSync('tests/lead-0016-fixtures/cart-and-learning.json',JSON.stringify(s,null,2)+'\n');
