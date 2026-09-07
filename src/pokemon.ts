import type { Pokemon, SaveData } from './types';
import DATA from './runtime-pokemon-data.json';
export const SPECIES: Record<number, { name: string; genus: string; types: string[]; color: string; description: string; moves: string[]; hp: number }> = {
  406:{name:'꼬몽울',genus:'관장 파트너',types:['풀'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['흡수','방어'],hp:30},
  420:{name:'체리버',genus:'관장 파트너',types:['풀'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['몸통박치기','방어'],hp:30},
  315:{name:'로젤리아',genus:'관장 파트너',types:['풀'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['매지컬리프','방어'],hp:30},
  425:{name:'흔들풍손',genus:'관장 파트너',types:['고스트'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['놀래키기','방어'],hp:30},
  92:{name:'고오스',genus:'관장 파트너',types:['고스트'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['핥기','방어'],hp:30},
  200:{name:'무우마',genus:'관장 파트너',types:['고스트'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['놀래키기','방어'],hp:30},
  307:{name:'요가랑',genus:'관장 파트너',types:['격투'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['염동력','방어'],hp:30},
  66:{name:'알통몬',genus:'관장 파트너',types:['격투'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['태권당수','방어'],hp:30},
  448:{name:'루카리오',genus:'관장 파트너',types:['격투'],color:'#8796a2',description:'체육관에서 만나는 파트너.',moves:['발경','방어'],hp:30},
  74: {name:'꼬마돌',genus:'암석포켓몬',types:['바위','땅'],color:'#9b967b',description:'단단한 바위 같은 몸.',moves:['몸통박치기','방어'],hp:22},
  95: {name:'롱스톤',genus:'돌뱀포켓몬',types:['바위','땅'],color:'#979b93',description:'긴 바위 몸으로 길을 만든다.',moves:['몸통박치기','방어'],hp:24},
  408: {name:'두개도스',genus:'박치기포켓몬',types:['바위'],color:'#8396b2',description:'단단한 머리로 부딪친다.',moves:['박치기','울음소리'],hp:26},
  399: { name:'비버니',genus:'둥글쥐포켓몬',types:['노말'],color:'#ad875f',description:'풀밭에서 부지런히 움직이는\n새잎 서쪽길의 작은 이웃.',moves:['몸통박치기','울음소리'],hp:18 },
  1: { name: '이상해씨', genus: '씨앗포켓몬', types: ['풀', '독'], color: '#72a951', description: '등에 있는 씨앗과 함께 자라는\n온순하고 든든한 파트너.', moves: ['몸통박치기', '울음소리'], hp: 20 },
  4: { name: '파이리', genus: '도롱뇽포켓몬', types: ['불꽃'], color: '#d7784a', description: '꼬리의 불꽃처럼 따뜻한 마음.\n작은 몸에 용기가 가득하다.', moves: ['할퀴기', '울음소리'], hp: 19 },
  7: { name: '꼬부기', genus: '꼬마거북포켓몬', types: ['물'], color: '#619abd', description: '단단한 등껍질을 지닌 친구.\n물속에서 헤엄치기를 좋아한다.', moves: ['몸통박치기', '꼬리흔들기'], hp: 20 },
  25: { name: '피카츄', genus: '쥐포켓몬', types: ['전기'], color: '#caaa35', description: '아직 사람을 조금 경계한다.\n천천히 서로를 알아가 보자.', moves: ['전기쇼크', '울음소리'], hp: 19 },
};
export const STARTERS = [7, 4, 1];
export const RUNTIME_SPECIES=DATA.species as Record<number,(typeof DATA.species)['1']>;
export const MOVE_RULES=DATA.moves as Record<string,{id:number;slug:string;type:string;power:number;priority:number;rule:string}>;
export const BOX_CAPACITY=60;
export function pokemonSnapshot(p:Pokemon):Pokemon{return {...p,...(p.moves?{moves:[...p.moves]}:{})};}
for(const [key,data] of Object.entries(RUNTIME_SPECIES)){
  const id=Number(key),old=SPECIES[id];
  SPECIES[id]={name:data.name,genus:old?.genus??'여행의 동료',types:data.types,color:old?.color??'#8796a2',description:old?.description??'여행 중 만난 포켓몬.\n함께 싸우고 성장하는 동료다.',hp:old?.hp??({2:57,5:56,8:57}[id]??12+Math.floor(data.stats.hp/12)),moves:old?.moves??['발버둥','튀어오르기']};
}
function levelMoves(p:Pokemon):string[]{
  const own=RUNTIME_SPECIES[p.species]?.learnset.filter(m=>m.level<=p.level).map(m=>m.move)??[];
  const evo=DATA.evolutions.find(e=>e.to===p.species);
  const inherited=evo?RUNTIME_SPECIES[evo.from].learnset.filter(m=>m.level<evo.level).map(m=>m.move):[];
  return [...new Set([...inherited,...own])];
}
export function isDamagingMove(move:string){return ['damage','drain','weightDamage','struggle','fixedDamage','levelDamage'].includes(MOVE_RULES[move]?.rule);}
export function pokemonMoves(p:Pokemon):string[]{
  if(p.moves?.length)return [...p.moves];
  const learned=levelMoves(p),attacks=learned.filter(isDamagingMove);
  const typed=attacks.filter(m=>SPECIES[p.species].types.includes(MOVE_RULES[m].type));
  const attack=typed.at(-1)??attacks.at(-1)??'발버둥';
  const status=learned.filter(m=>!isDamagingMove(m)).at(-1);
  const fallback=SPECIES[p.species].moves[1];
  return [attack,status??(learned.includes(fallback)?fallback:attacks.filter(m=>m!==attack).at(-1)??attack)];
}
// Return move names for the parent's replacement UI. TM availability requires
// both the reward key and the species' Platinum machine-learnset evidence.
export function availableMoves(p:Pokemon,save?:SaveData):string[]{
  const tm=RUNTIME_SPECIES[p.species]?.tm.filter(m=>save?.keyItems.includes('TM-'+MOVE_RULES[m].slug))??[];
  return [...new Set([...levelMoves(p),...pokemonMoves(p),...tm])];
}
export function validPokemonMoves(p:Pokemon,keyItems:string[]):boolean{
  if(p.moves===undefined)return true;
  if(!Array.isArray(p.moves)||p.moves.length!==2||p.moves.some(m=>typeof m!=='string'||!MOVE_RULES[m]))return false;
  const natural=levelMoves(p),tm=RUNTIME_SPECIES[p.species]?.tm??[];
  // A previously selected emergency Struggle remains legal after learning an
  // attack, until the player uses the replacement menu.
  return p.moves.every(m=>natural.includes(m)||m==='발버둥'||(tm.includes(m)&&keyItems.includes('TM-'+MOVE_RULES[m].slug)));
}
export function teachMove(save:SaveData,index:number,move:string,slot:number):boolean{
  const p=save.party[index];
  if(!Number.isInteger(index)||!p||!Number.isInteger(slot)||slot<0||slot>1||!availableMoves(p,save).includes(move))return false;
  const moves=pokemonMoves(p);if(moves[slot]===move||moves[1-slot]===move)return false;
  moves[slot]=move;p.moves=moves;return true;
}
export function recordSeen(save:SaveData,species:number,caught=false){
  save.pokedex??={seen:[],caught:[]};
  if(!save.pokedex.seen.includes(species))save.pokedex.seen.push(species);
  if(caught&&!save.pokedex.caught.includes(species))save.pokedex.caught.push(species);
}
export function grantPokemon(save: SaveData, species: number): boolean {
  const flag = species === 25 ? 'pikachuReceived' : 'starterReceived';
  if (![1,4,7,25].includes(species) || !SPECIES[species] || save.flags[flag] || save.party.length >= 6) return false;
  if (species !== 25 && (save.flags.pikachuReceived || save.party.some(p=>p.species===25))) return false;
  const data = SPECIES[species];
  const pokemon: Pokemon = { species, level: 5, experience:0, hp: data.hp, maxHp: data.hp, nature: species === 25 ? '고집' : '성실', met: '새잎마을 · 포켓몬 연구소' };
  save.party.push(pokemon);
  pokemon.moves=[...data.moves];recordSeen(save,species,true);
  save.flags[flag] = true;
  return true;
}
