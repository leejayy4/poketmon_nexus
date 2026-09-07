// Recreate QA saves with node_modules/.bin/tsx.cmd scripts/first-adventure-fixtures.ts.
// Load through the existing save panel on a unique ?qa= URL.
import { mkdirSync,writeFileSync } from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { createBattle } from '../src/battle';
const directory=new URL('../tests/fixtures/first-adventure/',import.meta.url);
mkdirSync(directory,{recursive:true});
for(const name of ['no-partner','starter','pikachu','both','low-hp','full-party']){
  const s=newSave();s.map='town';s.player={x:4,y:15,facing:'left'};
  if(name!=='no-partner')grantPokemon(s,name==='pikachu'?25:7);
  if(name==='both')grantPokemon(s,25);
  if(name==='low-hp'){s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};s.map='route_s01';s.player={x:23,y:9,facing:'left'};s.party[0].hp=1;}
  if(name==='full-party'){s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};s.map='route_s01';s.player={x:23,y:9,facing:'left'};const enemy=createBattle(s)!.enemy;for(let i=0;i<5;i++)s.party.push({...enemy});}
  const raw=JSON.stringify(s,null,2)+'\n';if(!parseSave(raw))throw Error(name);
  writeFileSync(new URL(name+'.json',directory),raw);
}
