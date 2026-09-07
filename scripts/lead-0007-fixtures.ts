import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='tour_pass_jubilife_oreburgh';s.player={x:15,y:12,facing:'down'};Object.assign(s.party[0],{level:8,hp:maxHpAtLevel(7,8),maxHp:maxHpAtLevel(7,8),moves:['거품','꼬리흔들기']});s.inventory={pokeBalls:5,potions:2};if(!parseSave(JSON.stringify(s)))throw Error('fixture');fs.mkdirSync('tests/lead-0007-fixtures',{recursive:true});fs.writeFileSync('tests/lead-0007-fixtures/cave.json',JSON.stringify(s,null,2));
