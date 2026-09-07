import test from 'node:test';
import assert from 'node:assert/strict';
import { gymCoachPages } from '../src/gym-coach';
import { newSave } from '../src/save';
import { grantPokemon, pokemonMoves } from '../src/pokemon';
import { GYMS } from '../src/gyms';

function saveWith(species: number) {
  const save = newSave();
  grantPokemon(save, species);
  save.flags.departureCleared = true;
  return save;
}

function assertCompact(pages: string[]) {
  assert(pages.length >= 2 && pages.length <= 3);
  for (const page of pages) {
    assert(page.split('\n').length <= 3);
    for (const line of page.split('\n')) assert(line.length <= 24, line);
  }
}

test('coach prioritizes injury and keeps every page compact', () => {
  const save = saveWith(4);
  save.party[0].hp = 1;
  const pages = gymCoachPages(save);
  assert.match(pages.join('\n'), /센터에서 회복/);
  assert(!pages.join('').includes('불꽃세례'));
  assertCompact(pages);
});

test('coach reports the current selected favorable attack from actual gym targets', () => {
  const save = saveWith(1);
  save.party[0].level = 9;
  save.party[0].moves = ['덩굴채찍', '울음소리'];
  const pages = gymCoachPages(save);
  assert.match(pages.join('\n'), /이상해씨의 덩굴채찍/);
  assert.match(pages.join('\n'), /꼬마돌·롱스톤·두개도스/);
  assert(!pages.join('').includes('기술 배우기'));
  assertCompact(pages);
});

test('coach recommends a currently learnable favorable move and the move-school path', () => {
  const save = saveWith(25);
  save.party[0].moves = pokemonMoves(save.party[0]);
  save.keyItems = ['TM-grass-knot'];
  const pages = gymCoachPages(save);
  assert.match(pages.join('\n'), /피카츄의 풀묶기/);
  assert.match(pages.join('\n'), /정보 → 기술 배우기/);
  assertCompact(pages);
});

test('coach reports a near future move separately from currently learnable moves', () => {
  const save = saveWith(1);
  save.party[0].level = 8;
  const pages = gymCoachPages(save);
  assert.match(pages.join('\n'), /Lv\.9에/);
  assert.match(pages.join('\n'), /덩굴채찍을 배울 수 있어요/);
  assert.match(pages.join('\n'), /아직 배울 수 없는 기술/);
  assert.match(pages.join('\n'), /성장은 선택/);
  assert(!pages.join('').includes('정보 → 기술 배우기'));
  assert(!pages.join('').includes('암반굴'));
  assertCompact(pages);
});

test('coach falls back to the actual S04 encounter and recognizes Machop', () => {
  const save = saveWith(4);
  save.party[0].moves = ['할퀴기', '울음소리'];
  const pages = gymCoachPages(save);
  assert.match(pages.join('\n'), /암반굴에서 알통몬을 만나 봐요/);
  assert.match(pages.join('\n'), /Lv\.7~10/);
  assert.match(pages.join('\n'), /안다리걸기/);
  assert.match(pages.join('\n'), /꼬마돌·롱스톤·두개도스에게 유리해요/);
  assertCompact(pages);
});

test('coach celebrates an already owned badge without combat advice or mutation', () => {
  const save = saveWith(7);
  save.badges.push(GYMS[0].badge);
  save.keyItems.push(GYMS[0].tm);
  const before = structuredClone(save);
  const pages = gymCoachPages(save);
  assert.match(pages.join('\n'), /콜배지/);
  assert.match(pages.join('\n'), /다음 여행/);
  assert.deepEqual(save, before);
  assertCompact(pages);
});
