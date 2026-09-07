import test from 'node:test';
import assert from 'node:assert/strict';
import { speciesHabitats } from '../src/runtime-encounters';

test('species habitats use registered encounter nodes and deduplicate map aliases', () => {
  assert.deepEqual(speciesHabitats(399), [
    { name: '새잎 서쪽길', minLevel: 3, maxLevel: 6, rarity: '흔함' },
    { name: '축복시티 주변', minLevel: 4, maxLevel: 7, rarity: '흔함' },
  ]);
});

test('species habitats expose the runtime level range and weighted rarity', () => {
  assert.deepEqual(speciesHabitats(406), [
    { name: '새잎 서쪽길', minLevel: 3, maxLevel: 6, rarity: '드묾' },
    { name: '축복시티 주변', minLevel: 4, maxLevel: 7, rarity: '보통' },
    { name: '영원숲', minLevel: 10, maxLevel: 14, rarity: '보통' },
  ]);
  assert.deepEqual(speciesHabitats(74), [
    { name: '축복–무쇠 암반굴', minLevel: 7, maxLevel: 10, rarity: '흔함' },
    { name: '천관산 하부', minLevel: 13, maxLevel: 17, rarity: '보통' },
  ]);
});

test('unregistered species have no promised habitat', () => {
  assert.deepEqual(speciesHabitats(9999), []);
});
