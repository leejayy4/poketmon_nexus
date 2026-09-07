import type { SaveData } from './types';

const INVALID_SLOT = '교체할 포켓몬 슬롯을 선택해 주세요.';
const NEED_HEALTHY_PARTY = '파티에 건강한 포켓몬이\n한 마리 이상 남아 있어야 해요.';

export function swapStoredPokemon(save: SaveData, partyIndex: number, boxIndex: number): { ok: boolean; message: string } {
  const box = save.box;
  if (!Number.isInteger(partyIndex) || !Number.isInteger(boxIndex) || !Array.isArray(box)) {
    return { ok: false, message: INVALID_SLOT };
  }

  const partyPokemon = save.party[partyIndex];
  const boxPokemon = box[boxIndex];
  if (!partyPokemon || !boxPokemon) return { ok: false, message: INVALID_SLOT };

  const healthyAfterSwap = save.party.filter((pokemon, index) => index !== partyIndex && pokemon.hp > 0).length + (boxPokemon.hp > 0 ? 1 : 0);
  if (healthyAfterSwap < 1) return { ok: false, message: NEED_HEALTHY_PARTY };

  save.party[partyIndex] = boxPokemon;
  box[boxIndex] = partyPokemon;
  return { ok: true, message: '파티와 박스 포켓몬을 교체했습니다.' };
}
