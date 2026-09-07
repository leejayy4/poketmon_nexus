import fs from 'node:fs';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { maxHpAtLevel,nextLevelXp } from '../src/growth';
import { awardGym } from '../src/gyms';
import { getMap } from '../src/maps';
import { MART_DOORS } from '../src/journey-world';
import { objectiveInteractionPath } from '../src/explore-navigation';
import type { MapId,SaveData } from '../src/types';
fs.mkdirSync('tests/journey-fixtures',{recursive:true});
const base=()=>{const s=newSave();grantPokemon(s,4);grantPokemon(s,25);s.flags.departureCleared=true;s.money=5000;s.inventory={pokeBalls:20,potions:10};return s;};
function write(name:string,s:SaveData){if(!parseSave(JSON.stringify(s)))throw Error('Invalid fixture: '+name);fs.writeFileSync('tests/journey-fixtures/'+name+'.json',JSON.stringify(s,null,2));}
const shop=base();shop.map='tour_jubilife';shop.player={...MART_DOORS.tour_jubilife,y:MART_DOORS.tour_jubilife.y+1,facing:'up'};write('shop-door',shop);
const tower=base();tower.map='tour_veilstone_hall';tower.player={x:12,y:8,facing:'up'};write('stairs',tower);
const pc=base();pc.map='tour_jubilife_center';pc.player={x:8,y:10,facing:'up'};const path=objectiveInteractionPath(getMap(pc.map),pc.player,'tourExhibit1')!;pc.player={...path.tiles.at(-1)!,facing:path.interaction.facing};write('pc',pc);
const battle=base();battle.map='route_s01';battle.player={x:17,y:6,facing:'right'};battle.party[0].level=15;battle.party[0].experience=nextLevelXp(15)-1;battle.party[0].maxHp=maxHpAtLevel(4,15);battle.party[0].hp=battle.party[0].maxHp;delete battle.party[0].moves;battle.party[0].moves=pokemonMoves(battle.party[0]);write('evolution',battle);
const full=structuredClone(battle);for(let i=0;i<4;i++)full.party.push({species:399,level:3,hp:maxHpAtLevel(399,3),maxHp:maxHpAtLevel(399,3),experience:0,nature:'성실',met:'새잎 서쪽길'});write('full-party',full);
const cave=base();cave.map='tour_pass_jubilife_oreburgh';cave.player={x:2,y:10,facing:'right'};write('cave',cave);
for(const [name,map,event] of [['city-task','tour_jubilife','tourResident1'],['mart-inside','tour_jubilife_mart','martClerk']] as const){const s=base();s.map=map as MapId;s.player={x:8,y:10,facing:'up'};if(name==='city-task')s.player={x:14,y:11,facing:'down'};const path=objectiveInteractionPath(getMap(s.map),s.player,event)!;s.player={...path.tiles.at(-1)!,facing:path.interaction.facing};write(name,s);}
const lawn=base();lawn.map='tour_jubilife';lawn.player={x:3,y:32,facing:'up'};write('city-grass',lawn);
const learn=base();learn.party[0].level=7;learn.party[0].hp=learn.party[0].maxHp=maxHpAtLevel(4,7);write('learn-move',learn);
const supplied=base();awardGym(supplied,'roark');supplied.map='tour_jubilife_center';supplied.player={x:8,y:7,facing:'up'};supplied.party[0].hp=1;supplied.inventory={pokeBalls:0,potions:0};write('after-badge-supply',supplied);
console.log('11 isolated journey saves generated and parsed.');
