import type { Direction,NPC } from './types';
import type { Place } from './explore-world';

export const FIELD_POKEMON=['pikachu','psyduck','machop','clefairy','pachirisu','buneary','starly','piplup'] as const;
type FieldSpecies=typeof FIELD_POKEMON[number];
export interface TownPokemon extends NPC { species:FieldSpecies; pages:string[] }
const names:Record<FieldSpecies,string>={pikachu:'피카츄',psyduck:'고라파덕',machop:'알통몬',clefairy:'삐삐',pachirisu:'파치리스',buneary:'이어롤',starly:'찌르꼬',piplup:'팽도리'};
const reactions:Record<FieldSpecies,string>={
  pikachu:'피카피카!\n반갑다는 듯 귀를 쫑긋 세웠다.',
  psyduck:'고라... 파덕?\n고개를 갸웃하다가 이쪽을 바라본다.',
  machop:'알통! 알통!\n씩씩하게 팔을 들어 인사한다.',
  clefairy:'삐삐!\n가벼운 발걸음으로 빙글 돌아본다.',
  pachirisu:'파치파치!\n풍성한 꼬리를 살랑살랑 흔든다.',
  buneary:'이어! 이어롤!\n접었던 귀를 펴고 반갑게 인사한다.',
  starly:'찌르르!\n날개를 퍼덕이며 주위를 살핀다.',
  piplup:'팽도!\n가슴을 펴고 의젓하게 고개를 끄덕인다.',
};
export function createTownPokemon(p:Place):TownPokemon {
  const species:FieldSpecies=p.theme==='snow'?'piplup':['mine','desert','factory'].includes(p.theme)?'machop':['port','water','coast'].includes(p.theme)?'psyduck':['temple','ghost','dragon'].includes(p.theme)?'clefairy':p.theme==='flowers'?'buneary':p.theme==='forest'?'pachirisu':['village','airport'].includes(p.theme)?'starly':'pikachu';
  return {id:'tourPokemon',name:names[species],species,sprite:'field-'+species,x:22,y:16,facing:'down',dialogue:'tourPokemon',pages:[reactions[species]]};
}
// Platinum NPC sheets use N/S/W/E, four frames per direction; Starly has one each.
export function fieldPokemonFrame(species:FieldSpecies,direction:Direction,clock:number,reacting=false){
  const directionIndex={up:0,down:1,left:2,right:3}[direction];
  if(species==='starly')return directionIndex;
  const phase=[0,1,0,3][Math.floor(clock*(reacting?6:2))%4];
  return directionIndex*4+phase;
}
export function pokemonFacing(playerFacing:Direction):Direction{return {up:'down',down:'up',left:'right',right:'left'}[playerFacing] as Direction;}
