import fs from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { getMap,canStand } from '../src/maps';
import { PASSAGES } from '../src/journey-world';
import { JOURNEY_ROUTE_LAYOUTS } from '../src/journey-route-layouts';
const dir='tests/lead-0013-fixtures';fs.mkdirSync(dir,{recursive:true});
for(const id of Object.keys(JOURNEY_ROUTE_LAYOUTS)){
  const s=newSave();grantPokemon(s,7);const p=s.party[0];p.level=25;p.experience=0;p.hp=p.maxHp=maxHpAtLevel(p.species,p.level);p.moves=pokemonMoves(p);
  s.flags.departureCleared=true;s.inventory={pokeBalls:30,potions:10};
  const passage=PASSAGES[id];s.map=passage.a.id;
  const map=getMap(s.map,s.flags),exit=map.warps.find(w=>w.to===id)!;
  const offsets={up:[0,1],down:[0,-1],left:[1,0],right:[-1,0]} as const;
  const direction=exit.entry!;const [dx,dy]=offsets[direction];
  s.player={x:exit.x+dx,y:exit.y+dy,facing:direction};
  if(!canStand(map,s.player.x,s.player.y)||!parseSave(JSON.stringify(s)))throw Error('Invalid city fixture '+id);
  fs.writeFileSync(`${dir}/${id}.json`,JSON.stringify(s,null,2));
}
