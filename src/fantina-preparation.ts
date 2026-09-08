import type {Pokemon,SaveData} from './types';
import {gymById,gymTeam} from './gyms';
import {SPECIES,pokemonMoves,availableMoves,isDamagingMove} from './pokemon';
import {moveEffectiveness,techniqueDamage} from './battle';
import {encounterPool} from './runtime-encounters';
import {maxHpAtLevel} from './growth';
import {adventureObjective} from './adventure-guide';
import {MAPS} from './maps';

/** Advice uses current damage rules and owned moves, without changing the save. */
export function fantinaPreparationPages(save:SaveData):string[]{
  const gym=gymById('fantina');
  if(save.badges.includes(gym.badge)){
    const next=adventureObjective(save);
    return ['멜리사에게 승리했어요!',...(next?[`${MAPS[next.map].name} · ${next.title}\n${next.id==='observation'?'관측 연구원을 만나 보세요.':next.action}`]:[])];
  }
  const targets=gymTeam('fantina'),levels=targets.map(p=>p.level);
  const pages=[`멜리사의 동료는 Lv.${Math.min(...levels)}~${Math.max(...levels)}이에요.\n권장 준비 레벨은 Lv.${gym.level}이에요.`,
    '노말·격투 공격은 통하지 않아요.\n발버둥과 변화기는 별도로 봐 주세요.'];
  const candidates=(pokemon:Pokemon,moves:string[])=>moves.filter(isDamagingMove).map(move=>({pokemon,move,hits:targets.map(target=>Math.min(target.hp,techniqueDamage(pokemon,target,move)))})).filter(c=>c.hits.every(hit=>hit>0));
  // Prefer equipped attacks, then the best minimum damage across all three foes.
  // Total actual damage breaks ties; stable sorting retains party/move order.
  const ranked=(entries:ReturnType<typeof candidates>)=>entries.sort((a,b)=>Math.min(...b.hits)-Math.min(...a.hits)||b.hits.reduce((n,h)=>n+h,0)-a.hits.reduce((n,h)=>n+h,0));
  let recommended=false;
  for(const equipped of [true,false]){
    const choice=ranked(save.party.flatMap(p=>candidates(p,equipped?pokemonMoves(p):availableMoves(p,save).filter(move=>!pokemonMoves(p).includes(move)))))[0];
    if(!choice)continue;
    const advantageous=targets.every(target=>moveEffectiveness(choice.move,target)>1);
    pages.push(`${SPECIES[choice.pokemon.species].name}의 ${choice.move}\n${advantageous?'세 동료의 약점을 노릴 수 있어요.':'세 동료에게 피해를 줄 수 있어요.'}`);
    pages.push(equipped?'현재 기억하고 있는 기술이에요.\n반격 예고를 보고 회복과 교대를 골라요.':'지금 배울 수 있는 기술이에요.\n포켓몬 → 정보 → 기술 배우기에서 준비해요.');
    if(choice.pokemon.hp===0)pages.push('쓰러진 동료는 포켓몬센터에서\n먼저 회복해 주세요.');
    recommended=true;break;
  }
  if(!recommended){
    const pool=encounterPool('tour_coronet'),slot=pool?.slots.find(slot=>slot.speciesId===74);
    if(pool&&slot){
      const level=pool.levels[0],maxHp=maxHpAtLevel(74,level);
      const pokemon:Pokemon={species:74,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'천관산 하부'};
      const choice=ranked(candidates(pokemon,pokemonMoves(pokemon)))[0];
      if(choice)pages.push(`천관산 하부의 꼬마돌을 살펴보세요.\n${choice.move}는 세 동료에게 통하는 공격이에요.`);
    }
  }
  pages.push(`상처약은 현재 ${save.inventory.potions}개예요.\n센터에서 회복하고 상점에서 준비해요.`);
  return pages;
}
