import type { Direction,NPC } from './types';
import type { Place } from './explore-world';

export const FIELD_POKEMON=['pikachu','psyduck','machop','clefairy','pachirisu','buneary','starly','piplup','pidove'] as const;
type FieldSpecies=typeof FIELD_POKEMON[number];
export interface TownPokemon extends NPC { species:FieldSpecies; pages:string[] }
const names:Record<FieldSpecies,string>={pikachu:'피카츄',psyduck:'고라파덕',machop:'알통몬',clefairy:'삐삐',pachirisu:'파치리스',buneary:'이어롤',starly:'찌르꼬',piplup:'팽도리',pidove:'콩둘기'};
const reactions:Record<FieldSpecies,string>={
  pikachu:'피카피카!\n반갑다는 듯 귀를 쫑긋 세웠다.',
  psyduck:'고라... 파덕?\n고개를 갸웃하다가 이쪽을 바라본다.',
  machop:'알통! 알통!\n씩씩하게 팔을 들어 인사한다.',
  clefairy:'삐삐!\n가벼운 발걸음으로 빙글 돌아본다.',
  pachirisu:'파치파치!\n풍성한 꼬리를 살랑살랑 흔든다.',
  buneary:'이어! 이어롤!\n접었던 귀를 펴고 반갑게 인사한다.',
  starly:'찌르르!\n날개를 퍼덕이며 주위를 살핀다.',
  piplup:'팽도!\n가슴을 펴고 의젓하게 고개를 끄덕인다.',
  pidove:'구구구!\n바람이 부는 쪽으로 몸을 돌려 깃을 고른다.',
};
export function createTownPokemon(p:Place):TownPokemon {
  if(p.id==='tour_vermilion')return {id:'tourPokemon',name:'부두의 고라파덕',species:'psyduck',sprite:'field-psyduck',x:45,y:27,facing:'left',dialogue:'tourPokemon',pages:['고라... 파덕?\n데크 아래 물결을 가만히 바라본다.']};
  if(p.id==='tour_castelia')return {id:'tourPokemon',name:'정원 앞 피카츄',species:'pikachu',sprite:'field-pikachu',x:60,y:12,facing:'right',dialogue:'tourPokemon',pages:['피카피카!\n풀잎 사이를 바라보다가 귀를 세웠다.','정원 풀밭에서는 콩둘기와 치릴리를\n만날 수 있다. 피카츄는 산책 나온 동료다.']};
  if(p.id==='tour_eterna')return {id:'tourPokemon',name:'정원의 삐삐',species:'clefairy',sprite:'field-clefairy',x:30,y:35,facing:'left',dialogue:'tourPokemon',pages:['삐삐!\n꽃밭 가장자리에서 산책길을 바라본다.']};
  if(p.id==='tour_goldenrod')return {id:'tourPokemon',name:'라디오 앞 피카츄',species:'pikachu',sprite:'field-pikachu',x:22,y:16,facing:'down',dialogue:'tourPokemon',pages:[
    '피카, 피카!\n타워에서 들려오는 소리에 귀를 세웠다.',
    '지나가는 주민에게 꼬리를 흔들고는\n다시 앞마당을 천천히 거닌다.',
  ]};
  if(p.id==='tour_azalea')return {id:'tourPokemon',name:'공방 마당의 찌르꼬',species:'starly',sprite:'field-starly',x:30,y:23,facing:'right',dialogue:'tourPokemon',pages:['찌르르!\n공방 마당 가장자리에서 떨어진 잎을 살핀다.','규토리를 쪼지 않고 사람과 포켓몬이 오가는 길을 비켜 걷는다.']};
  if(p.id==='tour_mistralton')return {id:'tourPokemon',name:'바람쉼터의 콩둘기',species:'pidove',sprite:'field-pidove',x:61,y:39,facing:'down',dialogue:'tourPokemon',pages:['구구구!\n표지탑의 날개판과 같은 쪽으로 몸을 돌린다.','활주로 안으로 들어가지 않고\n보행로 가장자리에서 바람을 살피고 있다.']};
  if(p.id==='tour_lentimas')return {id:'tourPokemon',name:'화산재를 피하는 콩둘기',species:'pidove',sprite:'field-pidove',x:22,y:16,facing:'left',dialogue:'tourPokemon',pages:['구구구...\n붉은 바위 그늘에서 날개 사이의 재를 턴다.','바람이 잦아들자 산길 안내소 쪽을 바라본다.']};
  if(p.id==='tour_undella')return {id:'tourPokemon',name:'해풍을 맞는 콩둘기',species:'pidove',sprite:'field-pidove',x:29,y:21,facing:'down',dialogue:'tourPokemon',pages:['구구구!\n동굴의 재를 털고 시원한 바닷바람에 날개를 편다.','정원 물그릇을 확인한 뒤 낮은 풀 그늘로 돌아간다.']};
  if(p.id==='tour_lacunosa')return {id:'tourPokemon',name:'안뜰에서 쉬는 콩둘기',species:'pidove',sprite:'field-pidove',x:21,y:19,facing:'left',dialogue:'tourPokemon',pages:['구구구.\n성벽 안쪽 바람이 잔잔해지자 낮은 돌 위에서 깃을 고른다.','주민이 놓아 둔 물그릇 옆을 막지 않고 안뜰 가장자리로 걸어간다.']};
  const species:FieldSpecies=p.theme==='snow'?'piplup':['mine','desert','factory'].includes(p.theme)?'machop':['port','water','coast'].includes(p.theme)?'psyduck':['temple','ghost','dragon'].includes(p.theme)?'clefairy':p.theme==='flowers'?'buneary':p.theme==='forest'?'pachirisu':['village','airport'].includes(p.theme)?'starly':'pikachu';
  return {id:'tourPokemon',name:names[species],species,sprite:'field-'+species,x:p.id==='tour_cinnabar'?20:22,y:p.id==='tour_cinnabar'?32:16,facing:'down',dialogue:'tourPokemon',pages:p.id==='tour_cinnabar'?['알통!\n짐을 내려놓고 바닷바람을 쐬고 있다.','주민을 돌아보고는 팔을 쭉 폈다.\n잠깐 쉬고 다시 일을 도울 모양이다.']:[reactions[species]]};
}
// Platinum NPC sheets use N/S/W/E, four frames per direction; Starly has one each.
export function fieldPokemonFrame(species:FieldSpecies,direction:Direction,clock:number,reacting=false){
  const directionIndex={up:0,down:1,left:2,right:3}[direction];
  if(species==='starly'||species==='pidove')return directionIndex;
  const phase=[0,1,0,3][Math.floor(clock*(reacting?6:2))%4];
  return directionIndex*4+phase;
}
export function pokemonFacing(playerFacing:Direction):Direction{return {up:'down',down:'up',left:'right',right:'left'}[playerFacing] as Direction;}
