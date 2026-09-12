import {readFileSync} from 'node:fs';
import {parseSave} from '../src/save';
import {pokemonMoves,recordSeen} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {awardGym} from '../src/gyms';

// Prepared QA party, not a claim that these Pokemon or the first badge were earned by play.
export function eternaCombatFixture(){
  const s=parseSave(readFileSync('tests/eterna-city-walk-save.json','utf8'))!;
  s.party=[1,396,403,41].map(species=>{const level=12,maxHp=maxHpAtLevel(species,level);const p={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'QA 준비 사본 · 신오 초반 동료'};return {...p,moves:pokemonMoves(p)};});
  for(const p of s.party)recordSeen(s,p.species,true);
  if(!awardGym(s,'roark'))throw Error('First badge fixture failed');
  s.map='tour_sinnoh_route_03';s.player={x:17,y:12,facing:'up'};
  if(!parseSave(JSON.stringify(s)))throw Error('Invalid combat fixture');
  return s;
}
