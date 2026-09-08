import type {Pokemon,SaveData} from './types';
import {gymById,gymTeam} from './gyms';
import {SPECIES,pokemonMoves,availableMoves,isDamagingMove} from './pokemon';
import {moveEffectiveness,techniqueDamage} from './battle';
import {encounterPool} from './runtime-encounters';
import {maxHpAtLevel} from './growth';
import {adventureObjective} from './adventure-guide';
import {MAPS} from './maps';

/** Read-only preparation; damage figures describe a fresh fight, not a win guarantee. */
export function maylenePreparationPages(save:SaveData):string[]{
  const gym=gymById('maylene');
  if(save.badges.includes(gym.badge)){
    const next=adventureObjective(save);
    return ['자두에게 승리했어요!',...(next?[`${MAPS[next.map].name} · ${next.title}\n${next.id==='observation'?'관측 연구원을 만나 보세요.':next.action}`]:[])];
  }
  const targets=gymTeam('maylene'),levels=targets.map(p=>p.level);
  const pages=[`자두의 동료는 Lv.${Math.min(...levels)}~${Math.max(...levels)}이에요.\n권장 준비 레벨은 Lv.${gym.level}이에요.`,
    '드레인펀치는 HP를 흡수해요.\n상대별 상성과 반격 예고를 살펴보세요.'];
  const candidates=(pokemon:Pokemon,moves:string[])=>moves.filter(isDamagingMove).flatMap(move=>targets.map(target=>({pokemon,move,target,hit:Math.min(target.hp,techniqueDamage(pokemon,target,move))}))).filter(c=>c.hit>0);
  const equipped=save.party.flatMap(p=>candidates(p,pokemonMoves(p)));
  const learnable=save.party.flatMap(p=>candidates(p,availableMoves(p,save).filter(move=>!pokemonMoves(p).includes(move))));
  // Compare the fraction of one opponent's HP, then actual damage. Stable ties keep
  // party/move order. Recommendations identify that opponent, never all three.
  const rank=(entries:typeof equipped)=>entries.sort((a,b)=>b.hit/b.target.maxHp-a.hit/a.target.maxHp||b.hit-a.hit);
  const current=rank(equipped)[0],learning=rank(learnable)[0];
  const damageLine=(choice:NonNullable<typeof current>)=>`${SPECIES[choice.target.species].name} HP${choice.target.maxHp} 중 ${choice.hit} 피해 예상`;
  if(current)pages.push(`장착 · ${SPECIES[current.pokemon.species].name}의 ${current.move}\n${damageLine(current)}`);
  const betterLearning=learning&&(!current||learning.hit/learning.target.maxHp>current.hit/current.target.maxHp);
  if(betterLearning){
    pages.push(`배울 수 있음 · ${SPECIES[learning.pokemon.species].name}의 ${learning.move}\n${damageLine(learning)}`);
    pages.push('포켓몬 → 정보 → 기술 배우기에서\n준비하고 반격도 버틸 수 있는지 살펴요.');
  }
  if(current?.pokemon.hp===0||betterLearning&&learning.pokemon.hp===0)pages.push('쓰러진 동료는 포켓몬센터에서\n먼저 회복해 주세요.');
  // Offer existing road companions only where the party's available attacks take
  // more than two hits. This is a preparation prompt, never a capture requirement.
  const pool=encounterPool('tour_pass_hearthome_veilstone');
  for(const [species,move,targetSpecies] of [[307,'염동력',66],[77,'불꽃세례',448]] as const){
    const target=targets.find(p=>p.species===targetSpecies);
    if(!pool?.slots.some(slot=>slot.speciesId===species)||!target)continue;
    if([...equipped,...learnable].some(c=>c.target.species===targetSpecies&&c.hit*2>=target.hp))continue;
    const level=pool.levels[0],maxHp=maxHpAtLevel(species,level);
    const pokemon:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'연고–장막 연결도로'};
    if(!pokemonMoves(pokemon).includes(move)||moveEffectiveness(move,target)<=1)continue;
    pages.push(`연고–장막 길의 ${SPECIES[species].name} · ${move}\n${SPECIES[targetSpecies].name}의 약점을 노릴 수 있어요.`);
  }
  pages.push(`상처약은 현재 ${save.inventory.potions}개예요.\n센터에서 회복하고 상점에서 준비해요.`);
  return pages;
}
