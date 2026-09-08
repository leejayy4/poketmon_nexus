import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {GYMS} from '../src/gyms';
import {getMap,canStand} from '../src/maps';
for(const [name,map,count,done] of [
  ['eterna-three','tour_eterna',3,false],
  ['hearthome-four','tour_hearthome',4,false],
  ['eterna-delivered','tour_eterna',4,true],
] as const){
  const save=newSave();grantPokemon(save,1);save.flags.departureCleared=true;
  save.badges=GYMS.slice(0,count).map(g=>g.badge);save.keyItems=GYMS.slice(0,count).map(g=>g.tm);
  if(done){save.flags.observationCollected=true;save.flags.researchDelivered=true;}
  save.map=map;const m=getMap(map),npc=m.npcs.find(n=>n.dialogue==='sinnohGuide')!;
  save.player={x:npc.x,y:npc.y+1,facing:'up'};assert(canStand(m,save.player.x,save.player.y));
  assert(parseSave(JSON.stringify(save)));
  fs.mkdirSync('tests/lead-0021-fixtures',{recursive:true});
  fs.writeFileSync(`tests/lead-0021-fixtures/${name}.json`,JSON.stringify(save,null,2)+'\n');
}
