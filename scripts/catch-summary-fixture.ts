import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';s.player={x:17,y:6,facing:'right'};s.inventory={pokeBalls:3,potions:2};
if(!parseSave(JSON.stringify(s)))throw Error('invalid fixture');writeFileSync('tests/catch-summary-save.json',JSON.stringify(s,null,2));
