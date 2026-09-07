// Load only through the save-file UI in a unique ?qa= browser session.
import { mkdirSync,writeFileSync } from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
const dir=new URL('../tests/fixtures/core-battle-turn/',import.meta.url);mkdirSync(dir,{recursive:true});
for(const name of ['healthy','faint']){
  const s=newSave();grantPokemon(s,7);Object.assign(s.party[0],{level:8,maxHp:29,hp:name==='faint'?2:29});
  s.party.push({species:399,level:8,hp:33,maxHp:33,experience:0,nature:'성실',met:'새잎 서쪽길'});
  s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};s.healingPoint='tour_oreburgh_center';s.inventory={pokeBalls:5,potions:2};
  const raw=JSON.stringify(s,null,2);if(!parseSave(raw))throw Error('invalid fixture: '+name);writeFileSync(new URL(name+'.json',dir),raw);
}
