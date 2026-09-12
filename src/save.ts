import { worldMapId,worldSpawn,isWorldCenter } from './unified-world';
import { markTourVisit,validTourVisits } from './explore-journal';
import type { SaveData, Pokemon } from './types';
import { SPECIES, BOX_CAPACITY, validPokemonMoves, recordSeen } from './pokemon';
import { MAPS, getMap, canStand } from './maps';
import { TOWN_REVISION } from './town';
import { LEVEL_CAP, OWNABLE_SPECIES, minimumLevel, maxHpAtLevel, nextLevelXp } from './growth';
import { TOUR_SPAWNS } from './explore-world';
import { GYMS } from './gyms';
import { SINNOH_MAPS,SINNOH_STARTS,SINNOH_CENTERS } from './sinnoh-maps';
export const SAVE_KEY='first-partner-save-v1';
export function newSave():SaveData { return {version:1,worldRevision:TOWN_REVISION,map:'bedroom',player:{x:6,y:6,facing:'down'},flags:{},party:[],box:[],pokedex:{seen:[],caught:[]},inventory:{pokeBalls:0,potions:0},badges:[],keyItems:[],money:0,healingPoint:'home',steps:0,seconds:0}; }
export function parseSave(raw:string|null):SaveData|null {
  try {
    if(!raw) return null;
    const s=JSON.parse(raw) as SaveData;
    if(!s||typeof s!=='object'||(s.worldRevision!==undefined&&(!Number.isInteger(s.worldRevision)||s.worldRevision<1||s.worldRevision>TOWN_REVISION)))return null;
    const previousRevision=s.worldRevision??1;
    const originalMap=s.map,canonical=worldMapId(s.map);
    if(canonical!==originalMap&&(!s.player||!MAPS[originalMap]||!Number.isInteger(s.player.x)||!Number.isInteger(s.player.y)||s.player.x<0||s.player.y<0||s.player.x>=MAPS[originalMap].width||s.player.y>=MAPS[originalMap].height||!['up','down','left','right'].includes(s.player.facing)))return null;
    if(canonical!==originalMap&&MAPS[originalMap]&&s.player&&Number.isInteger(s.player.x)&&Number.isInteger(s.player.y)&&s.player.x>=0&&s.player.y>=0&&s.player.x<MAPS[originalMap].width&&s.player.y<MAPS[originalMap].height){
      s.map=canonical;s.player={...worldSpawn(canonical)!,facing:'down'};
    }
    if(s.healingPoint)s.healingPoint=worldMapId(s.healingPoint);

    if(s.inventory===undefined && previousRevision<4)s.inventory={pokeBalls:0,potions:0};
    if(previousRevision<5){
      if(s.badges===undefined)s.badges=[];if(s.keyItems===undefined)s.keyItems=[];if(s.money===undefined)s.money=0;if(s.healingPoint===undefined)s.healingPoint='home';
      if(Array.isArray(s.party))for(const p of s.party)if(p&&p.experience===undefined)p.experience=0;
    }
    // Retain progress when a former floor tile becomes an obstacle after map corrections.
    if(s.version===1 && (s.worldRevision??1)<TOWN_REVISION){
      if(s.map==='town'&&(s.worldRevision??1)<2)s.player={x:8,y:25,facing:'down'};
      const base=MAPS[s.map]&&getMap(s.map,s.flags);
      // Roaming has never occupied a persistent save tile since revision 15.
      const map=base&&previousRevision>=15?{...base,npcs:base.npcs.filter(n=>n.id!=='tourPokemon')}:base;
      if(map&&s.player&&Number.isInteger(s.player.x)&&Number.isInteger(s.player.y)&&s.player.x>=0&&s.player.x<map.width&&s.player.y>=0&&s.player.y<map.height&&!canStand(map,s.player.x,s.player.y)){
        const safe=({...TOUR_SPAWNS,...Object.fromEntries(Object.entries(SINNOH_STARTS).map(([id,[x,y]])=>[id,{x,y}])) as Record<keyof typeof SINNOH_MAPS,{x:number;y:number}>,bedroom:{x:8,y:5},home:{x:10,y:4},town:{x:8,y:25},lab:{x:6,y:11},neighbor:{x:6,y:7},cottage:{x:6,y:7},route_s01:{x:29,y:12},jubilife:{x:21,y:12},oreburgh:{x:12,y:20},jubilife_center:{x:8,y:11},oreburgh_center:{x:8,y:11},oreburgh_gym:{x:8,y:13}} as Record<SaveData['map'],{x:number;y:number}>)[s.map];
        s.player={...(safe??{x:2,y:12}),facing:'down'};
      }
      s.worldRevision=TOWN_REVISION;
    }
    if(s.version!==1 || !MAPS[s.map] || !s.player || !Number.isInteger(s.player.x) || !Number.isInteger(s.player.y) || !canStand({...getMap(s.map,s.flags),npcs:getMap(s.map,s.flags).npcs.filter(n=>n.id!=='tourPokemon')},s.player.x,s.player.y) || !['up','down','left','right'].includes(s.player.facing)) return null;
    const validPokemon=(p:Pokemon)=>Boolean(p)&&Number.isInteger(p.species)&&OWNABLE_SPECIES.includes(p.species)&&Number.isInteger(p.level)&&p.level>=minimumLevel(p.species)&&p.level<=LEVEL_CAP&&p.maxHp===maxHpAtLevel(p.species,p.level)&&Number.isInteger(p.experience)&&p.experience>=0&&p.experience<(p.level===LEVEL_CAP?1:nextLevelXp(p.level))&&Number.isInteger(p.hp)&&p.hp>=0&&p.hp<=p.maxHp&&typeof p.nature==='string'&&p.nature.length<=20&&typeof p.met==='string'&&p.met.length<=100&&validPokemonMoves(p,Array.isArray(s.keyItems)?s.keyItems:[]);
    if(!Array.isArray(s.party)||s.party.length>6||s.party.some(p=>!validPokemon(p)))return null;
    if(s.box===undefined)s.box=[];
    if(!Array.isArray(s.box)||s.box.length>BOX_CAPACITY||s.box.some(p=>!validPokemon(p)))return null;
    const owned=[...s.party,...s.box];
    if(s.pokedex!==undefined){
      const d=s.pokedex;
      if(!d||typeof d!=='object'||!Array.isArray(d.seen)||!Array.isArray(d.caught))return null;
      for(const values of [d.seen,d.caught])if(values.length>Object.keys(SPECIES).length||new Set(values).size!==values.length||values.some(id=>!Number.isInteger(id)||!SPECIES[id]))return null;
      if(d.caught.some(id=>!OWNABLE_SPECIES.includes(id)||!d.seen.includes(id)))return null;
    }
    for(const p of owned)recordSeen(s,p.species,true);
    if(!s.flags||Array.isArray(s.flags)||typeof s.flags!=='object'||Object.values(s.flags).some(v=>typeof v!=='boolean' && (typeof v!=='number'||!Number.isFinite(v)))) return null;
    // Only the implemented forest capture provenance is separate from the
    // researcher's gift. Other legacy Pikachu records retain the gift checks.
    const wildPikachu=owned.filter(p=>p.species===25&&p.met==='상록숲');
    const starters=owned.filter(p=>[1,2,4,5,7,8].includes(p.species)), pikachu=owned.filter(p=>p.species===25&&p.met!=='상록숲');
    if(starters.length>1||pikachu.length>1||Boolean(s.flags.starterReceived)!==Boolean(starters.length)||Boolean(s.flags.pikachuReceived)!==Boolean(pikachu.length)) return null;
    if(s.flags.exploration!==undefined&&typeof s.flags.exploration!=='boolean')return null;
    for(const key of ['cinnabarCliffObserved','cinnabarShoreObserved'])if(s.flags[key]!==undefined&&typeof s.flags[key]!=='boolean')return null;

    if(s.flags.exploration===true&&(owned.length||s.badges?.length||s.keyItems?.length||s.money!==0))return null;
    if(s.flags.departureCleared!==undefined&&typeof s.flags.departureCleared!=='boolean')return null;
    if((wildPikachu.length||owned.some(p=>![1,2,4,5,7,8,25].includes(p.species)))&&s.flags.departureCleared!==true)return null;
    if(s.flags.departureCleared===true&&!starters.length&&!pikachu.length)return null;
    if(!s.inventory||!['pokeBalls','potions'].every(key=>Number.isInteger(s.inventory[key as keyof typeof s.inventory])&&s.inventory[key as keyof typeof s.inventory]>=0&&s.inventory[key as keyof typeof s.inventory]<=999))return null;
    if(!Array.isArray(s.badges)||s.badges.length>4||s.badges.some((b,i)=>b!==GYMS[i].badge)||!Array.isArray(s.keyItems)||s.keyItems.length!==s.badges.length||s.keyItems.some((item,i)=>item!==GYMS[i].tm))return null;
    for(const key of ['observationCollected','researchDelivered','ferryPass'])if(s.flags[key]!==undefined&&typeof s.flags[key]!=='boolean')return null;
    if(s.flags.observationCollected&&s.badges.length!==4)return null;
    if(s.flags.researchDelivered&&!s.flags.observationCollected)return null;
    if(s.flags.ferryPass&&!s.flags.researchDelivered)return null;
    
    
    if(s.badges.length&&!s.flags.departureCleared)return null;
    if(!Number.isInteger(s.money)||s.money<0||s.money>999999||!(s.healingPoint==='home'||isWorldCenter(s.healingPoint)))return null;
    if(s.healingPoint!=='home'&&!s.party.length)return null;
    if(!Number.isInteger(s.steps)||s.steps<0||!Number.isFinite(s.seconds)||s.seconds<0) return null;
    if(s.tourVisited!==undefined&&(!validTourVisits(s.tourVisited)))return null;
    markTourVisit(s);
    return s;
  } catch { return null; }
}
