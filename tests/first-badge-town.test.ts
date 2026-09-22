import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice, Dialogue } from '../src/types';
import { handleFirstJourneyEvent } from '../src/first-journey-events';
import { getMap } from '../src/maps';
import { newSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { OREBURGH_FIRST_BADGE } from '../src/oreburgh-first-badge-state';

// Entry points follow the first-journey registry. Dormant while QA is paused.
function fixture(map: 'tour_jubilife' | 'tour_oreburgh') {
  const save = newSave();
  grantPokemon(save, 7);
  save.flags.departureCleared = true;
  save.flags.researchDelivered = map === 'tour_jubilife';
  save.map = map;
  const guide = getMap(map, save.flags).npcs.find(npc => npc.dialogue === (map === 'tour_jubilife' ? 'researchGate' : 'tourGuide'))!;
  save.player = { x: guide.x, y: guide.y + 1, facing: 'up' };
  const destinations: Array<[string, string | null]> = [];
  const game = {
    save, clock: 0, move: null, transition: 0, battle: null,
    dialogue: null as Dialogue | null,
    get map() { return getMap(this.save.map, this.save.flags); },
    say(speaker: string, pages: string[], after?: () => void, choices?: Choice[]) {
      this.dialogue = { speaker, pages, choices, after, page: 0, shown: 0, selected: 0 };
    },
    persist() { return true; },
    setTourDestination(id: string | null, event?: string) { destinations.push([id ?? '', event ?? null]); },
    fieldMap: false,
  } as unknown as Engine;
  return { game, save, guide, get dialogue() { return game.dialogue!; }, destinations };
}

function select(game: Engine, label: string) {
  const choice = game.dialogue!.choices!.find(choice => choice.label === label)!;
  assert(choice, `Missing choice: ${label}`);
  game.dialogue = null; // Engine.confirm clears the menu before its callback.
  choice.action();
}

function assertLineLengths(pages: string[]) {
  assert(pages.every(page => page.split('\n').every(line => line.length <= 24)));
}

test('active Jubilife guide offers real center, mart, resident and next-route choices', () => {
  const f = fixture('tour_jubilife');
  const before = structuredClone(f.save);
  assert.equal(handleFirstJourneyEvent(f.game, 'researchGate'), true);
  assert.equal(f.dialogue.speaker, '연구 통로 안내원');
  assert.match(f.dialogue.pages.join(''), /선택사항/);
  assertLineLengths(f.dialogue.pages);
  assert.match(f.dialogue.pages.join(''), /방송국 직원/);
  assert.deepEqual(f.dialogue.choices?.map(choice => choice.label), ['센터로 안내', '상점으로 안내', '주민 부탁 안내', '다음 길 안내', '연구 통로 안내', '돌아가기']);
  select(f.game, '센터로 안내');
  assert.deepEqual(f.destinations[0], ['tour_jubilife_center', 'nurse']);
  assert.equal(f.game.fieldMap, true);
  assert.deepEqual(f.save, before);
});

test('Jubilife next-route guidance uses the active Route 203 door', () => {
  const f = fixture('tour_jubilife');
  assert.equal(handleFirstJourneyEvent(f.game, 'researchGate'), true);
  assert(f.game.map.warps.some(warp => warp.to === 'tour_sinnoh_route_203'));
  select(f.game, '다음 길 안내');
  assert.deepEqual(f.destinations, [['tour_sinnoh_route_203', null]]);
  assert.equal(f.save.map, 'tour_jubilife');
});

test('Oreburgh guide targets the real center, shop, resident and gym without teleporting', () => {
  const f = fixture('tour_oreburgh');
  const beforeMap = f.save.map;
  assert.equal(handleFirstJourneyEvent(f.game, 'tourGuide'), true);
  assert.deepEqual(f.dialogue.choices?.map(choice => choice.label), ['센터로 안내', '상점으로 안내', '주민 부탁 안내', '다음 길 안내', '돌아가기']);
  assertLineLengths(f.dialogue.pages);
  [
    ['tour_oreburgh_center', 'nurse'],
    ['tour_oreburgh_mart', 'martClerk'],
    ['tour_oreburgh', 'tourResident0'],
    ['oreburgh_gym', null],
  ].forEach(([expectedTarget, expectedEvent], index) => {
    const next = fixture('tour_oreburgh');
    assert.equal(handleFirstJourneyEvent(next.game, 'tourGuide'), true);
    select(next.game, next.dialogue.choices![index].label);
    assert.deepEqual(next.destinations, [[expectedTarget, expectedEvent]]);
  });
  assert.equal(f.save.map, beforeMap);
});

test('Oreburgh first-badge celebration keeps the next route through Jubilife and Floaroma', () => {
  const f = fixture('tour_oreburgh');
  f.save.badges.push('BADGE-GS01');
  f.save.flags[OREBURGH_FIRST_BADGE.completed] = true;
  assert.equal(handleFirstJourneyEvent(f.game, 'tourGuide'), true);
  assert.match(f.dialogue.pages.join(''), /축복시티/);
  assert.match(f.dialogue.pages.join(''), /204번도로와 험한샛길/);
  assert.match(f.dialogue.pages.join(''), /꽃향기마을/);
  select(f.game, '도시 출구 안내');
  select(f.game, '꽃향기 쪽 길 안내');
  assert.deepEqual(f.destinations, [['tour_floaroma', null]]);
  assert.equal(f.save.map, 'tour_oreburgh');
});

test('Jubilife after the first badge guides north through Route 204 and Ravaged Path', () => {
  const f = fixture('tour_jubilife');
  f.save.badges.push('BADGE-GS01');
  assert.equal(handleFirstJourneyEvent(f.game, 'researchGate'), true);
  assert.match(f.dialogue.pages.join(''), /204번도로와 험한샛길/);
  assert.match(f.dialogue.pages.join(''), /꽃향기마을/);
  assertLineLengths(f.dialogue.pages);
  select(f.game, '다음 길 안내');
  assert.deepEqual(f.destinations, [['tour_floaroma', null]]);
});

test('Jubilife keeps research guidance as an explicit choice until observation delivery', () => {
  const f = fixture('tour_jubilife');
  f.save.flags.researchDelivered = false;
  assert.equal(handleFirstJourneyEvent(f.game, 'researchGate'), true);
  assert.equal(f.dialogue.choices![4].label, '연구 통로 안내');
  select(f.game, '연구 통로 안내');
  assert.match(f.dialogue.pages.join(''), /네 배지와/);
  assert.equal(f.save.flags.researchDelivered, false);
  f.game.dialogue = null;
  f.save.flags.observationCollected = true;
  assert.equal(handleFirstJourneyEvent(f.game, 'researchGate'), false);
  f.save.player = { x: 14, y: 11, facing: 'down' };
  assert.equal(handleFirstJourneyEvent(f.game, 'tourGuide'), false);
});
