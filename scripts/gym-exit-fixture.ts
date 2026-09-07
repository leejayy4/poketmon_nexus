import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const s=newSave();grantPokemon(s,7);s.party[0].hp=1;
for(let i=0;i<2;i++)s.party.push({species:399,level:3,hp:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});
s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};s.healingPoint='tour_oreburgh_center';s.money=123;s.inventory={pokeBalls:3,potions:2};
if(!parseSave(JSON.stringify(s)))throw Error('invalid fixture');writeFileSync('tests/gym-exit-forced-save.json',JSON.stringify(s,null,2));
