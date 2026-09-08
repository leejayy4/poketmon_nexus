import type {SaveData} from './types';
import {gymById,gymTeam} from './gyms';
import {SPECIES,MOVE_RULES,RUNTIME_SPECIES,pokemonMoves,availableMoves,isDamagingMove} from './pokemon';
import {moveEffectiveness} from './battle';
import {encounterPool} from './runtime-encounters';

/** Read-only advice for the current Eterna roster; it never gates a challenge. */
export function gardeniaPreparationPages(save:SaveData):string[]{
  const gym=gymById('gardenia');
  if(save.badges.includes(gym.badge))return ['유채에게 승리했어요!\n다음 모험 목표를 확인해 보세요.'];
  const levels=gym.team.map(p=>p[1]),targets=gymTeam('gardenia');
  const intro=`유채의 동료는 Lv.${Math.min(...levels)}~${Math.max(...levels)}이에요.\n권장 준비 레벨은 Lv.${gym.level}이에요.`;
  const useful=(move:string)=>isDamagingMove(move)&&['불꽃','비행'].includes(MOVE_RULES[move]?.type)&&targets.every(target=>moveEffectiveness(move,target)>1);
  // Equipped moves take priority over learning, then retain the party order.
  for(const equipped of [true,false])for(const pokemon of save.party){
    const selected=pokemonMoves(pokemon);
    const move=(equipped?selected:availableMoves(pokemon,save).filter(move=>!selected.includes(move))).find(useful);
    if(!move)continue;
    const pages=[intro,`${SPECIES[pokemon.species].name}의 ${move}\n유채의 세 동료에게 유리해요.`];
    pages.push(equipped?'현재 기억하고 있는 기술이에요.\n회복과 상처약도 준비해 주세요.':'지금 배울 수 있는 기술이에요.\n포켓몬 → 정보 → 기술 배우기에서 준비해요.');
    if(pokemon.hp===0)pages.push('쓰러진 동료는 포켓몬센터에서\n먼저 회복해 주세요.');
    return pages;
  }
  const pool=encounterPool('tour_eterna_forest'),slot=pool?.slots.find(slot=>slot.speciesId===415);
  const share=slot&&pool?slot.weight/pool.slots.reduce((n,slot)=>n+slot.weight,0):0;
  const gust=RUNTIME_SPECIES[415]?.learnset.some(entry=>entry.move==='바람일으키기'&&entry.level<=(pool?.levels[0]??0));
  if(slot&&share<.1&&gust&&useful('바람일으키기'))return [intro,'영원숲의 세꿀버리는 드문 동료예요.\n바람일으키기로 약점을 노릴 수 있어요.','회복과 상처약도 준비해 주세요.'];
  return [intro,'포켓몬 정보에서 기술을 살펴보고\n회복과 상처약을 준비해 주세요.'];
}
