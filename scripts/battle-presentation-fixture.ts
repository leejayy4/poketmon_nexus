import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';

const s=newSave();grantPokemon(s,7);Object.assign(s.party[0],{level:8,hp:1,maxHp:29});
s.party.push({species:399,level:8,hp:33,maxHp:33,experience:0,nature:'성실',met:'새잎 서쪽길'});
s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};
s.healingPoint='tour_oreburgh_center';s.inventory={pokeBalls:5,potions:2};
if(!parseSave(JSON.stringify(s)))throw Error('invalid fixture');
writeFileSync('tests/battle-presentation-faint-save.json',JSON.stringify(s,null,2));
