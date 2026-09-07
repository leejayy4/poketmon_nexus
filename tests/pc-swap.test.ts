import test from 'node:test';
import assert from 'node:assert/strict';
import type { Pokemon } from '../src/types';
import { newSave } from '../src/save';
import { swapStoredPokemon } from '../src/pc-swap';

const pokemon = (species: number, hp: number): Pokemon => ({
  species,
  level: 5,
  hp,
  maxHp: 20,
  experience: 13,
  nature: '성실',
  met: 'PC 교체 테스트',
  moves: ['몸통박치기', '울음소리'],
});

test('party 6 and box 60 are both full but one-to-one swap succeeds', () => {
  const save = newSave();
  save.party = Array.from({ length: 6 }, (_, index) => pokemon(index + 1, 20));
  save.box = Array.from({ length: 60 }, (_, index) => pokemon(index + 101, 20));
  const partyBefore = [...save.party];
  const boxBefore = [...save.box];
  const result = swapStoredPokemon(save, 2, 59);

  assert.deepEqual(result, { ok: true, message: '파티와 박스 포켓몬을 교체했습니다.' });
  assert.strictEqual(save.party[2], boxBefore[59]);
  assert.strictEqual(save.box[59], partyBefore[2]);
  assert.deepEqual(save.party.filter((_, index) => index !== 2), partyBefore.filter((_, index) => index !== 2));
  assert.deepEqual(save.box.filter((_, index) => index !== 59), boxBefore.filter((_, index) => index !== 59));
});

test('swap preserves the two Pokemon objects and every stored field', () => {
  const save = newSave();
  const partyPokemon = pokemon(7, 4);
  partyPokemon.experience = 77;
  partyPokemon.moves = ['물대포', '방어'];
  partyPokemon.nature = '고집';
  partyPokemon.met = '먼 곳';
  const boxPokemon = pokemon(399, 18);
  boxPokemon.experience = 2;
  save.party = [partyPokemon, pokemon(25, 20)];
  save.box = [boxPokemon];

  const result = swapStoredPokemon(save, 0, 0);

  assert.equal(result.ok, true);
  assert.strictEqual(save.party[0], boxPokemon);
  assert.strictEqual(save.box[0], partyPokemon);
  assert.deepEqual(save.party[0], boxPokemon);
  assert.deepEqual(save.box[0], partyPokemon);
  assert.strictEqual(save.party[1].species, 25);
});

test('rejects non-integer or out-of-range slots without changing the save', () => {
  const save = newSave();
  save.party = [pokemon(7, 20)];
  save.box = [pokemon(399, 20)];
  for (const [partyIndex, boxIndex] of [[0.5, 0], [0, 1], [-1, 0], [0, -1], [1, 0]] as const) {
    const before = structuredClone(save);
    const result = swapStoredPokemon(save, partyIndex, boxIndex);
    assert.equal(result.ok, false);
    assert.deepEqual(save, before);
  }
});

test('rejects exchanging the last healthy party Pokemon with a fainted box Pokemon atomically', () => {
  const save = newSave();
  save.party = [pokemon(7, 20)];
  save.box = [pokemon(399, 0)];
  const partyPokemon = save.party[0];
  const boxPokemon = save.box[0];
  const before = structuredClone(save);

  const result = swapStoredPokemon(save, 0, 0);

  assert.equal(result.ok, false);
  assert.match(result.message, /건강한/);
  assert.deepEqual(save, before);
  assert.strictEqual(save.party[0], partyPokemon);
  assert.strictEqual(save.box[0], boxPokemon);
});
