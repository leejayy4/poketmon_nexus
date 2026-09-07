import type { Pokemon, SaveData } from './types';
import { availableMoves, isDamagingMove, pokemonMoves, RUNTIME_SPECIES, SPECIES } from './pokemon';
import { moveEffectiveness } from './battle';
import { encounterPool } from './runtime-encounters';
import { maxHpAtLevel } from './growth';
import { gymById, gymTeam } from './gyms';

const ROARK_ID = 'roark' as const;

function targetsFor(move: string, targets: Pokemon[]): string[] {
  return targets
    .filter(target => moveEffectiveness(move, target) > 1)
    .map(target => SPECIES[target.species].name);
}

function compactRecommendation(p: Pokemon, move: string, targets: string[]): string[] {
  return [`${SPECIES[p.species].name}의 ${move}`, `${targets.join('·')}에게 유리해요.`];
}

function joinRecommendation(item: { pokemon: Pokemon; move: string; targets: string[] }): string {
  return compactRecommendation(item.pokemon, item.move, item.targets).join('\n');
}

function objectParticle(word: string): string {
  const code = word.codePointAt(word.length - 1) ?? 0;
  return code >= 0xac00 && (code - 0xac00) % 28 ? '을' : '를';
}

function encounterPartner(): { pokemon: Pokemon; move: string; targets: string[] } | null {
  const pool = encounterPool('tour_pass_jubilife_oreburgh');
  if (!pool) return null;
  const level = pool.levels[0];
  const target = gymTeam(ROARK_ID);
  for (const slot of pool.slots) {
    const pokemon: Pokemon = {
      species: slot.speciesId,
      level,
      maxHp: maxHpAtLevel(slot.speciesId, level),
      hp: maxHpAtLevel(slot.speciesId, level),
      experience: 0,
      nature: '성실',
      met: pool.method,
    };
    const move = pokemonMoves(pokemon).find(candidate => isDamagingMove(candidate) && targetsFor(candidate, target).length);
    if (move) return { pokemon, move, targets: targetsFor(move, target) };
  }
  return null;
}

/** Builds first-badge advice only from the current save and runtime combat data. */
export function gymCoachPages(save: SaveData): string[] {
  const gym = gymById(ROARK_ID);
  if (save.badges.includes(gym.badge)) return ['콜배지를 얻었네요!\n다음 여행도 준비해요.', '다음 체육관을 향해\n동료들과 함께 가 봐요.'];
  if (save.party.some(p => p.hp < p.maxHp)) return ['다친 동료를 먼저\n포켓몬센터에서 회복해 주세요.', '회복한 뒤 기술과 상성을\n다시 확인해 보세요.'];

  const targets = gymTeam(ROARK_ID);
  const current: { pokemon: Pokemon; move: string; targets: string[] }[] = [];
  for (const pokemon of save.party.filter(p => p.hp > 0)) {
    for (const move of pokemonMoves(pokemon)) {
      if (!isDamagingMove(move)) continue;
      const effective = targetsFor(move, targets);
      if (effective.length) current.push({ pokemon, move, targets: effective });
    }
  }
  if (current.length) {
    return ['현재 기술 중 강석에게 유리한 기술이에요.', joinRecommendation(current[0])];
  }

  const learnable: { pokemon: Pokemon; move: string; targets: string[] }[] = [];
  for (const pokemon of save.party.filter(p => p.hp > 0)) {
    const selected = new Set(pokemonMoves(pokemon));
    for (const move of availableMoves(pokemon, save)) {
      if (selected.has(move) || !isDamagingMove(move)) continue;
      const effective = targetsFor(move, targets);
      if (effective.length) learnable.push({ pokemon, move, targets: effective });
    }
  }
  if (learnable.length) {
    return ['지금 배울 수 있는 기술 중\n강석에게 유리해요.', joinRecommendation(learnable[0]), '정보 → 기술 배우기에서\n기술을 선택해 주세요.'];
  }

  const future: { pokemon: Pokemon; move: string; level: number; targets: string[] }[] = [];
  for (const pokemon of save.party.filter(p => p.hp > 0)) {
    const selected = new Set(pokemonMoves(pokemon));
    for (const learned of RUNTIME_SPECIES[pokemon.species]?.learnset ?? []) {
      if (learned.level <= pokemon.level || learned.level > pokemon.level + 2 || selected.has(learned.move) || !isDamagingMove(learned.move)) continue;
      const effective = targetsFor(learned.move, targets);
      if (effective.length) future.push({ pokemon, move: learned.move, level: learned.level, targets: effective });
    }
  }
  if (future.length) {
    const item = future[0];
    return [
      '지금은 유리한 기술이 없어요.',
      `${SPECIES[item.pokemon.species].name}는 Lv.${item.level}에\n${item.move}${objectParticle(item.move)} 배울 수 있어요.`,
      '아직 배울 수 없는 기술이에요.\n성장은 선택이에요.',
    ];
  }

  const partner = encounterPartner();
  if (partner) return [
    '현재 기술로는 유리한\n공격이 없어요.',
    `암반굴에서 ${SPECIES[partner.pokemon.species].name}을 만나 봐요.\n이곳의 동료는 Lv.${poolLevel()}이에요.`,
    joinRecommendation(partner),
  ];
  return ['현재 기술과 암반굴 조우에\n유리한 공격이 없어요.', '센터에서 회복하고\n파티를 다시 확인해 주세요.'];
}

function poolLevel(): string {
  const pool = encounterPool('tour_pass_jubilife_oreburgh');
  return pool ? `${pool.levels[0]}~${pool.levels[1]}` : '현재 조우 레벨';
}
