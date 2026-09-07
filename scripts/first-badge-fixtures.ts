import { mkdirSync,writeFileSync } from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
const directory=new URL('../tests/fixtures/first-badge/',import.meta.url);mkdirSync(directory,{recursive:true});
for(const name of ['entry','trained','low-hp','level-up']){
  const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};s.map='route_s01';s.player={x:3,y:12,facing:'left'};
  if(name==='trained'||name==='low-hp'){Object.assign(s.party[0],{level:8,maxHp:maxHpAtLevel(7,8),hp:name==='low-hp'?1:maxHpAtLevel(7,8)});s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};s.healingPoint='oreburgh_center';}
  if(name==='level-up'){s.party[0].experience=40;s.player={x:23,y:9,facing:'left'};}
  const raw=JSON.stringify(s,null,2)+'\n';if(!parseSave(raw))throw Error(name);writeFileSync(new URL(name+'.json',directory),raw);
}
