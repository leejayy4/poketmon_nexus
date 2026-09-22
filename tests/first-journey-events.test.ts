import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import type { Choice, Dialogue, MapId, Pokemon } from '../src/types';
import { getMap } from '../src/maps';
import { newSave } from '../src/save';
import { FIRST_JOURNEY_EVENTS, firstJourneyEvent, handleFirstJourneyEvent } from '../src/first-journey-events';
import { FIRST_BADGE } from '../src/first-badge';
import { OREBURGH_ROARK } from '../src/oreburgh-roark-state';
import { OREBURGH_FIRST_BADGE as BADGE_SCENE } from '../src/oreburgh-first-badge-state';
import { JUBILIFE_CLOCK, SINNOH_CLOCK_FLAGS } from '../src/sinnoh-clock-state';
import { updateSinnohClock } from '../src/sinnoh-clock-story';
import { ROUTE203_JOURNEY } from '../src/sinnoh-route203-journey';

// Written while QA is paused. No Engine construction or browser storage access.
function fixture(map: MapId) {
  let writes = 0, speeches = 0;
  const save = newSave();
  save.map = map;
  const stub = {
    save, clock: 0, panel: 'field', battle: null, move: null, transition: 0,
    dialogue: null as Dialogue | null,
    get map() { return getMap(this.save.map, this.save.flags); },
    clearInput() {},
    persist() { writes++; return true; },
    setTourDestination() {},
    say(speaker: string, pages: string[], after?: () => void, choices?: Choice[]) {
      speeches++;
      this.dialogue = { speaker, pages, page: 0, shown: 0, selected: 0, after, choices };
    },
  };
  return { game: stub as unknown as Engine, writes: () => writes, speeches: () => speeches };
}

function face(game: Engine, event: string) {
  const actor = game.map.npcs.find(npc => npc.dialogue === event)!;
  assert(actor, `Missing actor: ${game.save.map}/${event}`);
  game.save.player = { x: actor.x, y: actor.y + 1, facing: 'up' };
}

function choose(game: Engine, label: string) {
  const choice = game.dialogue!.choices!.find(option => option.label === label)!;
  assert(choice, `Missing choice: ${label}`);
  game.dialogue = null;
  choice.action();
}

test('every first-journey binding has a real active map interaction and a unique map/event key', () => {
  const keys = new Set<string>();
  for (const registration of FIRST_JOURNEY_EVENTS) {
    const key = `${registration.map}/${registration.event}`;
    assert(!keys.has(key), `Duplicate event registration: ${key}`);
    keys.add(key);
    const map = getMap(registration.map, {});
    assert(map.npcs.some(npc => npc.dialogue === registration.event) || map.props.some(prop => prop.dialogue === registration.event), key);
  }
});

test('shared event names from other towns never start the first-journey scenes', () => {
  const { game, writes, speeches } = fixture('tour_eterna');
  const before = structuredClone(game.save);
  for (const event of ['tourGuide', 'tourHost', 'tourExhibit0', OREBURGH_ROARK.event, JUBILIFE_CLOCK.event, 'oreburghGateSign']) {
    assert.equal(firstJourneyEvent(game.save.map, event), undefined);
    assert.equal(handleFirstJourneyEvent(game, event), false);
  }
  assert.deepEqual(game.save, before);
  assert.equal(writes(), 0);
  assert.equal(speeches(), 0);
});

test('the clock registration keeps observation completion separate from accepting the invitation', () => {
  const { game, writes } = fixture('tour_jubilife');
  game.save.player = { x: JUBILIFE_CLOCK.x + 1, y: JUBILIFE_CLOCK.y, facing: 'left' };
  assert(handleFirstJourneyEvent(game, JUBILIFE_CLOCK.event));
  choose(game, '초침을 살펴본다');
  assert.equal(game.save.flags[SINNOH_CLOCK_FLAGS.observed], undefined);
  assert.equal(writes(), 0);
  updateSinnohClock(game, 4.31);
  updateSinnohClock(game, 4.31);
  assert.equal(game.save.flags[SINNOH_CLOCK_FLAGS.observed], true);
  assert.equal(writes(), 1);
});

test('Roark registration preserves an optional meeting and commits only its finished dialogue once', () => {
  const { game, writes } = fixture('tour_oreburgh_mine');
  assert(handleFirstJourneyEvent(game, OREBURGH_ROARK.event));
  choose(game, '나중에 이야기한다');
  assert.equal(game.save.flags[OREBURGH_ROARK.met], undefined);
  assert.equal(writes(), 0);
  assert(handleFirstJourneyEvent(game, OREBURGH_ROARK.event));
  choose(game, '함께 교대를 기다린다');
  const introduce = game.dialogue!.after!;
  game.dialogue = null;
  introduce();
  assert.equal(game.save.flags[OREBURGH_ROARK.met], undefined);
  const finish = game.dialogue!.after!;
  game.dialogue = null;
  finish(); finish();
  assert.equal(game.save.flags[OREBURGH_ROARK.met], true);
  assert.equal(writes(), 1);
  assert(handleFirstJourneyEvent(game, OREBURGH_ROARK.event));
  assert.equal(writes(), 1);
});

test('the same Oreburgh guide uses travel help before a badge and celebration after it', () => {
  const before = fixture('tour_oreburgh');
  face(before.game, BADGE_SCENE.event);
  assert(handleFirstJourneyEvent(before.game, BADGE_SCENE.event));
  assert(before.game.dialogue!.pages.some(page => page.includes('탄갱 여행')));
  assert.equal(before.speeches(), 1);
  assert.equal(before.writes(), 0);

  const after = fixture('tour_oreburgh');
  after.game.save.badges.push(FIRST_BADGE);
  face(after.game, BADGE_SCENE.event);
  assert(handleFirstJourneyEvent(after.game, BADGE_SCENE.event));
  assert(after.game.dialogue!.pages.some(page => page.includes('다시 왔으니 축하')));
  assert(after.game.dialogue!.choices!.some(choice => choice.label === '작아도 마음에 들어'));
  assert.equal(after.speeches(), 1); // The generic town guide must not replace it.
  assert.equal(after.writes(), 0);
});

test('research delivery remains a legacy fallback after first-journey guidance stops claiming it', () => {
  const { game } = fixture('tour_jubilife');
  face(game, 'researchGate');
  assert(handleFirstJourneyEvent(game, 'researchGate'));
  game.dialogue = null;
  game.save.flags.observationCollected = true;
  assert.equal(handleFirstJourneyEvent(game, 'researchGate'), false);
  assert.equal(game.dialogue, null);
});

test('arrival remains available without capture or optional battles and only records the greeting once', () => {
  const { game, writes } = fixture('tour_oreburgh');
  assert.equal(game.save.party.length, 0);
  assert(handleFirstJourneyEvent(game, 'oreburghWestArrivalGuide'));
  assert(game.dialogue!.pages.some(page => page.includes('통행 조건이 아닙니다')));
  game.dialogue = null;
  assert(handleFirstJourneyEvent(game, 'oreburghWestArrivalGuide'));
  assert.equal(writes(), 1);
  assert.deepEqual(game.save.badges, []);
  assert.equal(game.save.flags.oreburghGatePartnerWon, undefined);
});

test('a route 203 victory alone does not become a recorded companion return', () => {
  const { game, writes } = fixture('tour_jubilife');
  const partner: Pokemon = { species: 396, level: 7, maxHp: 22, hp: 22, experience: 0, nature: '성실', met: '신오 203번도로' };
  game.save.party = [partner];
  game.save.flags['trainerWon:sinnoh-route-203-practice'] = true;
  game.save.flags[ROUTE203_JOURNEY.partner] = partner.species;
  game.save.flags[ROUTE203_JOURNEY.slot] = 0;
  game.save.flags[ROUTE203_JOURNEY.level] = 5;
  assert(handleFirstJourneyEvent(game, 'jubilifeEastGuide'));
  assert.equal(game.save.flags.jubilifeRoute203ReturnReviewed, undefined);
  assert.equal(writes(), 0);
  game.save.flags[ROUTE203_JOURNEY.participated] = true;
  assert(handleFirstJourneyEvent(game, 'jubilifeEastGuide'));
  assert.equal(game.save.flags.jubilifeRoute203ReturnReviewed, true);
  assert.equal(writes(), 1);
});

test('Engine keeps the gate trainer ahead of the registered worker travel fallback', () => {
  const { game, speeches } = fixture('tour_oreburgh_gate_1f');
  game.save.flags.departureCleared = true;
  game.save.party = [{ species: 7, level: 8, maxHp: 25, hp: 25, experience: 0, nature: '성실', met: '은솔박사 연구소' }];
  Engine.prototype.event.call(game, 'oreburghGateWorker');
  assert.equal(speeches(), 1);
  assert(game.dialogue!.choices?.some(choice => choice.label.includes('배틀')));
  assert(game.dialogue!.pages.some(page => page.includes('선택 배틀')));
});
