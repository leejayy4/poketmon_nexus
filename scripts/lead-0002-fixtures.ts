import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {getMap} from '../src/maps';
import {objectiveInteractionPath} from '../src/explore-navigation';
import {PASSAGES} from '../src/journey-world';
import type {SaveData} from '../src/types';
fs.mkdirSync('tests/lead-0002-fixtures',{recursive:true});
function write(name:string,s:SaveData){if(!parseSave(JSON.stringify(s)))throw Error(name);fs.writeFileSync(`tests/lead-0002-fixtures/${name}.json`,JSON.stringify(s,null,2));}
const base=()=>{const s=newSave();grantPokemon(s,4);s.flags.departureCleared=true;return s;};
const moves=base();Object.assign(moves.party[0],{species:5,level:17,hp:maxHpAtLevel(5,17),maxHp:maxHpAtLevel(5,17)});write('move-school',moves);
for(const [name,map] of [['cave','tour_pass_jubilife_oreburgh'],['quiet-road',Object.keys(PASSAGES).find(id=>PASSAGES[id].kind==='road')!]]){
 const s=base();s.map=map as SaveData['map'];const m=getMap(s.map,s.flags);s.player={x:1,y:10,facing:'right'};
 const path=objectiveInteractionPath(m,s.player,'journeySign');if(!path)throw Error('Missing sign path '+map);
 s.player={...path.tiles.at(-1)!,facing:path.interaction.facing};write(name,s);
}
console.log('lead-0002: three validated isolated fixtures');
