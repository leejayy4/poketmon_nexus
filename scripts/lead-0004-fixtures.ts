import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon,teachMove} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
const dir='tests/lead-0004-fixtures';fs.mkdirSync(dir,{recursive:true});
for(const [species,level,move,name] of [[4,7,'불꽃세례','ember'],[7,13,'물대포','water'],[1,9,'덩굴채찍','vine']] as const){
 const s=newSave();grantPokemon(s,species);s.flags.departureCleared=true;s.map='route_s01';s.player={x:4,y:11,facing:'left'};
 Object.assign(s.party[0],{level,hp:maxHpAtLevel(species,level),maxHp:maxHpAtLevel(species,level)});
 if(!teachMove(s,0,move,0)||!parseSave(JSON.stringify(s)))throw Error(name);
 fs.writeFileSync(`${dir}/${name}.json`,JSON.stringify(s,null,2));
}
console.log('Three isolated starter-technique fixtures validated');
