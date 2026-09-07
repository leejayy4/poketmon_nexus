import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {GYMS} from '../src/gyms';
import {worldSpawn} from '../src/unified-world';
for(const kind of ['center','observation'] as const){
  const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;
  save.map=kind==='center'?'tour_oreburgh_center':'tour_veilstone';save.player={...worldSpawn(save.map)!,facing:'down'};
  if(kind==='center')save.party[0].hp=1;
  else for(const gym of GYMS){save.badges.push(gym.badge);save.keyItems.push(gym.tm);}
  if(!parseSave(JSON.stringify(save)))throw Error('invalid fixture');
  writeFileSync(`tests/objective-${kind}-save.json`,JSON.stringify(save,null,2));
}
