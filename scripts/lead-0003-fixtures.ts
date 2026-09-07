import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {PASSAGES} from '../src/journey-world';
import {getMap} from '../src/maps';
import {objectiveInteractionPath} from '../src/explore-navigation';
const s=newSave();grantPokemon(s,4);s.flags.departureCleared=true;
s.map='route_s01';s.player={x:4,y:11,facing:'left'};
Object.assign(s.party[0],{level:6,experience:59,hp:maxHpAtLevel(4,6),maxHp:maxHpAtLevel(4,6)});
s.inventory.potions=5;
if(!parseSave(JSON.stringify(s)))throw Error('invalid growth fixture');
fs.mkdirSync('tests/lead-0003-fixtures',{recursive:true});
fs.writeFileSync('tests/lead-0003-fixtures/growth.json',JSON.stringify(s,null,2));
for(const kind of ['road','cave','coast']){
 const passage=Object.values(PASSAGES).find(p=>p.kind===kind)!;
 const route=structuredClone(s);route.map=passage.id;route.player={x:2,y:10,facing:'right'};
 if(!parseSave(JSON.stringify(route)))throw Error('invalid route '+kind);
 fs.writeFileSync(`tests/lead-0003-fixtures/${kind}.json`,JSON.stringify(route,null,2));
}
console.log('Validated growth-to-learning fixture');
const gym=newSave();grantPokemon(gym,7);gym.flags.departureCleared=true;
Object.assign(gym.party[0],{level:15,experience:149,hp:maxHpAtLevel(7,15),maxHp:maxHpAtLevel(7,15),moves:['물대포','꼬리흔들기']});
gym.map='oreburgh_gym';gym.player={x:8,y:13,facing:'up'};
const path=objectiveInteractionPath(getMap(gym.map,gym.flags),gym.player,'roark');if(!path)throw Error('roark path');
gym.player={...path.tiles.at(-1)!,facing:path.interaction.facing};
if(!parseSave(JSON.stringify(gym)))throw Error('invalid gym');
fs.writeFileSync('tests/lead-0003-fixtures/gym-growth.json',JSON.stringify(gym,null,2));
