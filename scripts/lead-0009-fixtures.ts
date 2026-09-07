import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;
s.map='tour_pass_jubilife_oreburgh';s.player={x:15,y:12,facing:'down'};
s.pokedex={seen:[7,74],caught:[7]};
if(!parseSave(JSON.stringify(s)))throw Error('Invalid fixture');
fs.mkdirSync('tests/lead-0009-fixtures',{recursive:true});
fs.writeFileSync('tests/lead-0009-fixtures/dex.json',JSON.stringify(s,null,2));
