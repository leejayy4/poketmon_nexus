import type { Pokemon, SaveData } from './types';
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
export function grantPokemon(save: SaveData, species: number): boolean {
  const flag = species === 25 ? 'pikachuReceived' : 'starterReceived';
  if (![1,4,7,25].includes(species) || !SPECIES[species] || save.flags[flag] || save.party.length >= 6) return false;
  if (species !== 25 && (save.flags.pikachuReceived || save.party.some(p=>p.species===25))) return false;
  const data = SPECIES[species];
  const pokemon: Pokemon = { species, level: 5, experience:0, hp: data.hp, maxHp: data.hp, nature: species === 25 ? '고집' : '성실', met: '새잎마을 · 포켓몬 연구소' };
  save.party.push(pokemon);
  save.flags[flag] = true;
  return true;
}
