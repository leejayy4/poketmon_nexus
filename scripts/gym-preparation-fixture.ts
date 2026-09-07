import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';

for(const variant of ['low','injured','ready','blocked'] as const){
  const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map=variant==='blocked'?'eterna_gym':'oreburgh_gym';s.player={x:8,y:5,facing:'up'};s.inventory={pokeBalls:5,potions:variant==='low'?0:2};s.healingPoint='tour_oreburgh_center';
  if(variant==='ready'||variant==='injured'){
    const hp=maxHpAtLevel(7,8);Object.assign(s.party[0],{level:8,hp:variant==='injured'?7:hp,maxHp:hp});
    s.party.push({species:399,level:8,hp:variant==='injured'?0:33,maxHp:33,experience:0,nature:'성실',met:'새잎 서쪽길'});
  }
  if(!parseSave(JSON.stringify(s)))throw Error('invalid fixture '+variant);
  writeFileSync(`tests/gym-preparation-${variant}-save.json`,JSON.stringify(s,null,2));
}
