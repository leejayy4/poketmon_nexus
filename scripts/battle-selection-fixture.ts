import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';s.player={x:17,y:6,facing:'right'};s.inventory={pokeBalls:3,potions:2};
for(let i=1;i<6;i++)s.party.push({species:399,level:3,hp:i===1?2:i===2?0:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});
if(!parseSave(JSON.stringify(s)))throw Error('invalid selection fixture');writeFileSync('tests/battle-selection-save.json',JSON.stringify(s,null,2));
