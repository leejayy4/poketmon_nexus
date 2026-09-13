import { RUNTIME_DATABASE } from './data/runtime';
import { CASTELIA_HABITAT } from './explore-castelia';
import type { Pokemon } from './types';
import { maxHpAtLevel } from './growth';
import { pokemonMoves } from './pokemon';
import { CINNABAR_HABITAT_NAME } from './cinnabar-layout';

// Exact geography only. New passages elsewhere have no encounter pool until
// their own design node is selected; CH numbers are never runtime locks.
const MAP_POOLS:Record<string,{node:string;name:string}>={
  tour_castelia_sewers:{node:'U-CASTELIA-SEWERS',name:'구름하수도'},
  tour_castelia_park:{node:'U-CASTELIA-PARK-W2',name:'구름시티 공원'},
  tour_sinnoh_route_211_west:{node:'S-R211-WEST',name:'신오 211번도로 서부'},
  tour_sinnoh_route_211_east:{node:'S-R211-EAST',name:'신오 211번도로 동부'},
  tour_kanto_seafoam_b2f:{node:'K-SEAFOAM-B2F',name:'쌍둥이섬 지하2층'},
  tour_coronet_211_pass:{node:'S-CORONET-211',name:'천관산 211 통과층'},
  tour_kanto_seafoam_b1f:{node:'K-SEAFOAM-B1F',name:'쌍둥이섬 지하1층'},
  tour_kanto_seafoam_1f:{node:'K-SEAFOAM-1F',name:'쌍둥이섬 1층'},
  tour_icirrus_moor:{node:'U-MOOR-DAY',name:'설화의 습지'},
  tour_castelia:{node:'U01-GARDEN',name:CASTELIA_HABITAT},
  tour_cinnabar:{node:'K13-OUTSKIRTS',name:CINNABAR_HABITAT_NAME},
  route_s01:{node:'S02',name:'새잎 서쪽길'},
  jubilife:{node:'S03',name:'축복시티 주변'},tour_jubilife:{node:'S03',name:'축복시티 주변'},
  tour_pass_jubilife_oreburgh:{node:'S04',name:'축복–무쇠 암반굴'},
  tour_pass_oreburgh_jubilife:{node:'S04',name:'무쇠–축복 암반굴'},
  eterna_forest:{node:'S05',name:'영원숲'},tour_eterna_forest:{node:'S05',name:'영원숲'},
  coronet_pass:{node:'S15',name:'천관산 하부'},tour_coronet:{node:'S15',name:'천관산 하부'},
  tour_pass_hearthome_veilstone:{node:'S08',name:'연고–장막 연결도로'},
  tour_sinnoh_route_215:{node:'S08',name:'신오 215번도로'},
  tour_pass_hearthome_pastoria:{node:'S07',name:'연고–들판 연결도로'},
  tour_sinnoh_route_212_south:{node:'S07',name:'신오 212번도로 남부'},
  tour_sinnoh_route_210_north:{node:'S-R210-NORTH-DAY',name:'신오 210번도로 북부'},
  tour_kanto_route_5:{node:'K18',name:'관동 5번도로'},
  tour_kanto_route_7:{node:'K-R07-DAY',name:'관동 7번도로'},
  tour_kanto_route_8:{node:'K-R08-DAY',name:'관동 8번도로'},
  tour_kanto_route_9:{node:'K-R09-DAY',name:'관동 9번도로'},
  tour_kanto_route_10_north:{node:'K-R10-DAY',name:'관동 10번도로 북부'},
  tour_kanto_rock_tunnel_b1f:{node:'K-ROCK-B1F',name:'돌산터널 B1F'},
  tour_kanto_route_10_south:{node:'K-R10-DAY',name:'관동 10번도로 남부'},
  tour_kanto_route_16:{node:'K-R16-DAY',name:'관동 16번도로'},
  tour_kanto_route_17:{node:'K-R17-DAY',name:'관동 17번도로'},
  tour_kanto_route_18:{node:'K-R18-DAY',name:'관동 18번도로'},
  tour_kanto_route_15:{node:'K-R15-DAY',name:'관동 15번도로'},
  tour_kanto_route_14:{node:'K-R14-DAY',name:'관동 14번도로'},
  tour_kanto_route_13:{node:'K-R13-DAY',name:'관동 13번도로'},
  tour_pass_vermilion_cerulean:{node:'K18',name:'갈색–블루 해안길'},
  tour_viridian_forest:{node:'K05',name:'상록숲'},
  tour_route_34:{node:'J-R34',name:'성도 34번도로'},
  tour_ilex:{node:'J-ILEX',name:'너도밤나무숲'},
  tour_johto_route_33:{node:'J-R33',name:'성도 33번도로'},
  tour_union_cave_1f:{node:'J-UNION-1F',name:'연결동굴 1층'},
  tour_johto_route_32:{node:'J-R32',name:'성도 32번도로'},
  tour_johto_route_35:{node:'J-R35',name:'성도 35번도로'},
  tour_johto_national_park:{node:'J-NATIONAL-PARK',name:'자연공원'},
  tour_johto_route_36:{node:'J-R36',name:'성도 36번도로'},
  tour_johto_route_37:{node:'J-R37',name:'성도 37번도로'},
  tour_johto_route_38:{node:'J-R38',name:'성도 38번도로'},
  tour_johto_route_39:{node:'J-R39',name:'성도 39번도로'},
  tour_johto_route_43:{node:'J-R43',name:'성도 43번도로'},
  tour_johto_route_44:{node:'J-R44',name:'성도 44번도로'},
  tour_johto_route_45:{node:'J-R45-DAY',name:'성도 45번도로'},
  tour_johto_route_46:{node:'J-R46-DAY',name:'성도 46번도로'},
  tour_johto_route_29:{node:'J-R29-DAY',name:'성도 29번도로'},
  tour_johto_ice_path_1f:{node:'J-ICE-PATH',name:'얼음샛길'},tour_johto_ice_path_b1f:{node:'J-ICE-PATH',name:'얼음샛길'},tour_johto_ice_path_b2f:{node:'J-ICE-PATH',name:'얼음샛길'},tour_johto_ice_path_b3f:{node:'J-ICE-PATH',name:'얼음샛길'},
  tour_unova_route_11:{node:'U-R11-DAY',name:'하나 11번도로'},
  tour_unova_route_08:{node:'U-R08-DAY',name:'하나 8번도로'},
};
export const ENCOUNTER_TIME_POLICY='day-only' as const;
export function encounterPool(map:string){const binding=MAP_POOLS[map];return binding?RUNTIME_DATABASE.poolByNode(binding.node):undefined;}
// Saved met labels remain stable; consumers must not infer origin from species.
export function encounterOrigin(map:string):string|undefined{return MAP_POOLS[map]?.name;}
export function hasWildEncounters(map:string){return Boolean(encounterPool(map));}
// Optional species-specific level lists retain gaps in original encounter tables.
function encounterLevels(slot:{speciesId:number;levelChoices?:number[]},range:number[]):number[]{
  const choices=slot.levelChoices?.filter(level=>Number.isInteger(level)&&level>=range[0]&&level<=range[1]);
  return choices?.length?choices:Array.from({length:range[1]-range[0]+1},(_,i)=>range[0]+i);
}
export function speciesHabitats(species:number):{name:string;minLevel:number;maxLevel:number;rarity:string}[]{
  const seenNodes=new Set<string>();
  const habitats:{name:string;minLevel:number;maxLevel:number;rarity:string}[]=[];
  for(const binding of Object.values(MAP_POOLS)){
    if(seenNodes.has(binding.node))continue;
    seenNodes.add(binding.node);
    const pool=RUNTIME_DATABASE.poolByNode(binding.node);
    if(!pool)continue;
    const slot=pool.slots.find(s=>s.speciesId===species);
    if(!slot)continue;
    const totalWeight=pool.slots.reduce((sum,s)=>sum+s.weight,0);
    const share=totalWeight?slot.weight/totalWeight*100:0;
    const levels=encounterLevels(slot,pool.levels);
    habitats.push({
      name:binding.name,
      minLevel:Math.min(...levels),
      maxLevel:Math.max(...levels),
      rarity:share>=30?'흔함':share>=10?'보통':'드묾',
    });
  }
  return habitats;
}
export function wildPokemon(map:string,random:()=>number=Math.random):Pokemon|null{
  const pool=encounterPool(map);if(!pool)return null;
  const unit=()=>Math.max(0,Math.min(1-Number.EPSILON,random()));
  let pick=unit()*pool.slots.reduce((sum,s)=>sum+s.weight,0);
  const slot=pool.slots.find(s=>(pick-=s.weight)<0)!;
  const levels=encounterLevels(slot,pool.levels);
  const level=levels[Math.floor(unit()*levels.length)];
  const maxHp=maxHpAtLevel(slot.speciesId,level);
  const p:Pokemon={species:slot.speciesId,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:MAP_POOLS[map].name};
  p.moves=pokemonMoves(p);return p;
}
