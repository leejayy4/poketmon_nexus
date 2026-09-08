import DATA from './runtime-pokemon-data.json';
import type { Pokemon } from './types';
import { maxHpAtLevel } from './growth';
import { pokemonMoves } from './pokemon';

// Exact geography only. New passages elsewhere have no encounter pool until
// their own design node is selected; CH numbers are never runtime locks.
const MAP_POOLS:Record<string,{node:string;name:string}>={
  route_s01:{node:'S02',name:'새잎 서쪽길'},
  jubilife:{node:'S03',name:'축복시티 주변'},tour_jubilife:{node:'S03',name:'축복시티 주변'},
  tour_pass_jubilife_oreburgh:{node:'S04',name:'축복–무쇠 암반굴'},
  tour_pass_oreburgh_jubilife:{node:'S04',name:'무쇠–축복 암반굴'},
  eterna_forest:{node:'S05',name:'영원숲'},tour_eterna_forest:{node:'S05',name:'영원숲'},
  coronet_pass:{node:'S15',name:'천관산 하부'},tour_coronet:{node:'S15',name:'천관산 하부'},
  tour_pass_hearthome_veilstone:{node:'S08',name:'연고–장막 연결도로'},
  tour_pass_hearthome_pastoria:{node:'S07',name:'연고–들판 연결도로'},
  tour_pass_vermilion_cerulean:{node:'K18',name:'갈색–블루 해안길'},
};
export const ENCOUNTER_TIME_POLICY='day-only' as const;
export function encounterPool(map:string){const binding=MAP_POOLS[map];return binding?DATA.pools.find(p=>p.node===binding.node):undefined;}
export function hasWildEncounters(map:string){return Boolean(encounterPool(map));}
export function speciesHabitats(species:number):{name:string;minLevel:number;maxLevel:number;rarity:string}[]{
  const seenNodes=new Set<string>();
  const habitats:{name:string;minLevel:number;maxLevel:number;rarity:string}[]=[];
  for(const binding of Object.values(MAP_POOLS)){
    if(seenNodes.has(binding.node))continue;
    seenNodes.add(binding.node);
    const pool=DATA.pools.find(p=>p.node===binding.node);
    if(!pool)continue;
    const slot=pool.slots.find(s=>s.speciesId===species);
    if(!slot)continue;
    const totalWeight=pool.slots.reduce((sum,s)=>sum+s.weight,0);
    const share=totalWeight?slot.weight/totalWeight*100:0;
    habitats.push({
      name:binding.name,
      minLevel:pool.levels[0],
      maxLevel:pool.levels[1],
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
  const level=pool.levels[0]+Math.floor(unit()*(pool.levels[1]-pool.levels[0]+1));
  const maxHp=maxHpAtLevel(slot.speciesId,level);
  const p:Pokemon={species:slot.speciesId,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:MAP_POOLS[map].name};
  p.moves=pokemonMoves(p);return p;
}
