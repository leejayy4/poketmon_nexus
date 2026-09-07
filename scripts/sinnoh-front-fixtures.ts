import { mkdirSync,writeFileSync } from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { awardGym,GYMS } from '../src/gyms';
const root=new URL('../tests/fixtures/sinnoh-front/',import.meta.url);mkdirSync(root,{recursive:true});
for(const name of ['journey','skip-gym','forest','defeat']){
  const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};const level=name==='forest'?9:15;
  Object.assign(s.party[0],{level,hp:maxHpAtLevel(7,level),maxHp:maxHpAtLevel(7,level)});awardGym(s,'roark');s.map='jubilife';s.player={x:3,y:12,facing:'left'};
  if(name==='skip-gym'){s.map='veilstone_gym';s.player={x:8,y:5,facing:'up'}}
  if(name==='forest'){s.map='eterna_forest';s.player={x:6,y:6,facing:'right'}}
  if(name==='defeat'){for(const g of GYMS.slice(1,3))awardGym(s,g.id);s.map='veilstone_gym';s.player={x:8,y:5,facing:'up'};s.healingPoint='veilstone_center';s.party[0].hp=1;}
  const raw=JSON.stringify(s,null,2);if(!parseSave(raw))throw Error(name);writeFileSync(new URL(name+'.json',root),raw);
}
