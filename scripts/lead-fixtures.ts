import fs from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { awardGym } from '../src/gyms';
import { getMap } from '../src/maps';
import { objectiveInteractionPath } from '../src/explore-navigation';
import type { Pokemon,SaveData } from '../src/types';

fs.mkdirSync('tests/lead-fixtures',{recursive:true});
const base=()=>{const s=newSave();grantPokemon(s,4);s.flags.departureCleared=true;return s;};
function write(name:string,s:SaveData){if(!parseSave(JSON.stringify(s)))throw Error('Invalid fixture: '+name);fs.writeFileSync('tests/lead-fixtures/'+name+'.json',JSON.stringify(s,null,2));}
const road=base();road.map='route_s01';road.player={x:4,y:11,facing:'left'};write('road-guidance',road);
const recoil=base();awardGym(recoil,'roark');awardGym(recoil,'gardenia');recoil.map='hearthome_gym';recoil.player={x:8,y:13,facing:'up'};
const abra:Pokemon={species:63,level:5,hp:1,maxHp:maxHpAtLevel(63,5),experience:0,nature:'성실',met:'축복시티 주변'};abra.moves=pokemonMoves(abra);recoil.party.unshift(abra);
const path=objectiveInteractionPath(getMap(recoil.map,recoil.flags),recoil.player,'fantina');if(!path)throw Error('Gym leader not reachable');recoil.player={...path.tiles.at(-1)!,facing:path.interaction.facing};write('struggle-recoil',recoil);
const longRoom=base();longRoom.map='tour_celadon_home2';longRoom.player={x:8,y:10,facing:'up'};longRoom.party[0].hp=1;write('poketch-long-name',longRoom);
console.log('3 isolated lead QA saves generated and parsed.');
