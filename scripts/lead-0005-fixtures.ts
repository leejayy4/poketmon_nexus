import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
const dir='tests/lead-0005-fixtures';fs.mkdirSync(dir,{recursive:true});
for(const species of [4,1,25]){
 const s=newSave();grantPokemon(s,species);s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:11,y:12,facing:'right'};
 Object.assign(s.party[0],{level:8,hp:maxHpAtLevel(species,8),maxHp:maxHpAtLevel(species,8)});
 s.inventory.potions=2;
 if(!parseSave(JSON.stringify(s)))throw Error(String(species));
 fs.writeFileSync(`${dir}/${species}.json`,JSON.stringify(s,null,2));
}
console.log('Validated first-badge preparation fixtures');
