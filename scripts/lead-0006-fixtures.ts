import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
const dir='tests/lead-0006-fixtures';fs.mkdirSync(dir,{recursive:true});
for(const [name,level] of [['move',6],['evolution',15],['supply',8]] as const){
 const s=newSave();grantPokemon(s,4);s.flags.departureCleared=true;s.map='route_s01';s.player={x:4,y:11,facing:'left'};
 Object.assign(s.party[0],{level,experience:level*10-1,hp:maxHpAtLevel(4,level),maxHp:maxHpAtLevel(4,level)});
 if(name==='supply'){s.badges=['BADGE-GS01'];s.keyItems=['TM-stealth-rock'];s.player={x:22,y:9,facing:'left'};s.party[0].hp-=3;}
 s.inventory={pokeBalls:0,potions:0};if(!parseSave(JSON.stringify(s)))throw Error(name);fs.writeFileSync(`${dir}/${name}.json`,JSON.stringify(s,null,2));
}
