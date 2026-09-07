import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
for(const home of [false,true]){
  const s=newSave();grantPokemon(s,7);s.party[0].hp=1;s.party[0].experience=17;s.flags.departureCleared=true;
  s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};s.healingPoint=home?'home':'tour_oreburgh_center';s.money=123;s.inventory={pokeBalls:3,potions:0};
  if(home)while(s.party.length<6)s.party.push({species:399,level:3,maxHp:18,hp:0,experience:0,nature:'성실',met:'새잎 서쪽길'});
  if(!parseSave(JSON.stringify(s)))throw Error('invalid fixture');
  writeFileSync(`tests/defeat-recovery-${home?'home':'center'}-save.json`,JSON.stringify(s,null,2));
}
