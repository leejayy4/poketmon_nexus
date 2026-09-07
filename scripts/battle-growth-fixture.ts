import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';s.player={x:17,y:6,facing:'right'};s.inventory={pokeBalls:3,potions:2};s.party[0].experience=40;
s.party.push({species:399,level:3,hp:18,maxHp:18,experience:20,nature:'성실',met:'새잎 서쪽길'});
if(!parseSave(JSON.stringify(s)))throw Error('invalid growth fixture');writeFileSync('tests/battle-growth-save.json',JSON.stringify(s,null,2));
