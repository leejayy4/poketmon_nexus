import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {encounterPool} from '../src/runtime-encounters';
const dir='tests/lead-0012-fixtures';fs.mkdirSync(dir,{recursive:true});
for(const caught of [false,true]){
 const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='tour_pass_jubilife_oreburgh';s.player={x:15,y:12,facing:'down'};s.inventory={pokeBalls:5,potions:2};
 const species=encounterPool(s.map)!.slots.map(slot=>slot.speciesId);
 s.pokedex={seen:[7,...species],caught:[7,...caught?species:[]]};
 if(!parseSave(JSON.stringify(s)))throw Error('Invalid fixture');
 fs.writeFileSync(`${dir}/${caught?'caught':'seen'}.json`,JSON.stringify(s,null,2));
}
