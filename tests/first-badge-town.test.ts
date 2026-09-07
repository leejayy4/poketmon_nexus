import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { handleCityActivity } from '../src/city-activities';
import { getMap } from '../src/maps';
import { newSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';

function fixture(map: 'tour_jubilife' | 'tour_oreburgh') {
  const save = newSave();
  grantPokemon(save, 7);
  save.flags.departureCleared = true;
  save.flags.researchDelivered = map === 'tour_jubilife';
  save.map = map;
  const guide = getMap(map, save.flags).npcs.find(npc => npc.dialogue === (map === 'tour_jubilife' ? 'researchGate' : 'tourGuide'))!;
  save.player = { x: guide.x, y: guide.y + 1, facing: 'up' };
  let dialogue: { speaker: string; pages: string[]; choices?: Choice[] } | undefined;
  const destinations: Array<[string, string | null]> = [];
  const game = {
    save,
    say(speaker: string, pages: string[], _after?: () => void, choices?: Choice[]) { dialogue = { speaker, pages, choices }; },
    setTourDestination(id: string | null, event?: string) { destinations.push([id ?? '', event ?? null]); },
    fieldMap: false,
  } as unknown as Engine;
  return { game, save, guide, get dialogue() { return dialogue!; }, destinations };
}

function assertLineLengths(pages: string[]) {
  assert(pages.every(page => page.split('\n').every(line => line.length <= 24)));
}

test('active Jubilife guide offers real center, mart, resident and next-route choices', () => {
  const f = fixture('tour_jubilife');
  const before = structuredClone(f.save);
  assert.equal(handleCityActivity(f.game, 'researchGate'), true);
  assert.equal(f.dialogue.speaker, '연구 통로 안내원');
  assert.match(f.dialogue.pages.join(''), /선택사항/);
  assertLineLengths(f.dialogue.pages);
  assert.match(f.dialogue.pages.join(''), /방송국 직원/);
  assert.deepEqual(f.dialogue.choices?.map(choice => choice.label), ['센터로 안내', '상점으로 안내', '주민 부탁 안내', '다음 길 안내', '연구 통로 안내', '돌아가기']);
  f.dialogue.choices![0].action();
  assert.deepEqual(f.destinations[0], ['tour_jubilife_center', 'nurse']);
  assert.equal(f.game.fieldMap, true);
  assert.deepEqual(f.save, before);
});

test('Oreburgh guide targets the real center, shop, resident and gym without teleporting', () => {
  const f = fixture('tour_oreburgh');
  const beforeMap = f.save.map;
  assert.equal(handleCityActivity(f.game, 'tourGuide'), true);
  assert.deepEqual(f.dialogue.choices?.map(choice => choice.label), ['센터로 안내', '상점으로 안내', '주민 부탁 안내', '다음 길 안내', '돌아가기']);
  assertLineLengths(f.dialogue.pages);
  [
    ['tour_oreburgh_center', 'nurse'],
    ['tour_oreburgh_mart', 'martClerk'],
    ['tour_oreburgh', 'tourResident0'],
    ['oreburgh_gym', null],
  ].forEach(([expectedTarget, expectedEvent], index) => {
    const next = fixture('tour_oreburgh');
    assert.equal(handleCityActivity(next.game, 'tourGuide'), true);
    next.dialogue.choices![index].action();
    assert.deepEqual(next.destinations, [[expectedTarget, expectedEvent]]);
  });
  assert.equal(f.save.map, beforeMap);
});

test('Oreburgh guide reacts to an earned first badge', () => {
  const f = fixture('tour_oreburgh');
  f.save.badges.push('BADGE-GS01');
  assert.equal(handleCityActivity(f.game, 'tourGuide'), true);
  assert.match(f.dialogue.pages[0], /콜배지/);
  assert.doesNotMatch(f.dialogue.pages[0], /첫 배지를 준비/);
  assert.match(f.dialogue.pages.join(''), /영원숲/);
  assert.doesNotMatch(f.dialogue.pages.join(''), /첫 배지를 겨룰|광부은/);
  f.dialogue.choices!.find(choice => choice.label === '다음 길 안내')!.action();
  assert.deepEqual(f.destinations, [['tour_eterna_forest', null]]);
  assertLineLengths(f.dialogue.pages);
});

test('Jubilife keeps research guidance as an explicit choice until observation delivery', () => {
  const f = fixture('tour_jubilife');
  f.save.flags.researchDelivered = false;
  assert.equal(handleCityActivity(f.game, 'researchGate'), true);
  assert.equal(f.dialogue.choices![4].label, '연구 통로 안내');
  f.dialogue.choices![4].action();
  assert.match(f.dialogue.pages.join(''), /네 배지와/);
  assert.equal(f.save.flags.researchDelivered, false);
  f.save.flags.observationCollected = true;
  assert.equal(handleCityActivity(f.game, 'researchGate'), false);
  f.save.player = { x: 14, y: 11, facing: 'down' };
  assert.equal(handleCityActivity(f.game, 'tourGuide'), false);
});
