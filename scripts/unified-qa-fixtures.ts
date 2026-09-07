import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {worldGymDoor} from '../src/unified-world';
import {getMap} from '../src/maps';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:0};s.party[0].hp=4;s.map='route_s01';s.player={x:3,y:12,facing:'left'};
function put(name:string){if(!parseSave(JSON.stringify(s)))throw new Error(name);writeFileSync('tests/unified-'+name+'-save.json',JSON.stringify(s,null,2))}
put('route');
s.map='tour_oreburgh';const d=worldGymDoor(s.map)!;s.player={x:d.x,y:d.y+1,facing:'up'};Object.assign(s.party[0],{level:25,hp:maxHpAtLevel(7,25),maxHp:maxHpAtLevel(7,25)});put('gym');
s.map='tour_eterna_forest';s.player={x:4,y:10,facing:'right'};put('forest');
writeFileSync('tests/unified-qa-geometry.json',JSON.stringify(Object.fromEntries(['tour_jubilife','tour_jubilife_center','tour_oreburgh','oreburgh_gym','tour_eterna_forest'].map(id=>[id,getMap(id as any)])),null,2));
