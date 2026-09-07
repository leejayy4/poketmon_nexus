import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice, Pokemon, SaveData } from '../src/types';
import { handleCityActivity } from '../src/city-activities';
import { newSave, parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { awardGym } from '../src/gyms';
import { TOUR_MAPS, TOUR_SPAWNS } from '../src/explore-world';

function pokemon(species = 399, level = 5): Pokemon {
  const maxHp = maxHpAtLevel(species, level);
  return { species, level, maxHp, hp: maxHp, experience: 0, nature: '성실', met: '새잎 서쪽길' };
}
function fixture(map: 'tour_jubilife' | 'tour_oreburgh' = 'tour_jubilife') {
  const save = newSave();
  grantPokemon(save, 7);
  save.flags.departureCleared = true;
  save.map = map;
  save.player = { ...TOUR_SPAWNS[map], facing: 'down' };
  let calls = 0;
  let dialogue: { speaker: string; pages: string[]; choices?: Choice[] };
  // Keep tests independent of parent Engine.event integration and browser globals.
  const game = {
    save,
    say(speaker: string, pages: string[], _after?: () => void, choices?: Choice[]) {
      dialogue = { speaker, pages, choices };
    },
    persist() { calls++; return true; },
  } as unknown as Engine;
  const event = map === 'tour_jubilife' ? 'tourResident1' : 'tourResident0';
  return {
    game, event,
    open() { assert.equal(handleCityActivity(game, event), true); },
    choose(i = 0) { assert(dialogue.choices); dialogue.choices[i].action(); },
    get dialogue() { return dialogue; },
    get calls() { return calls; },
  };
}

test('activities target two real residents and unrelated events leave state untouched', () => {
  for (const map of ['tour_jubilife', 'tour_oreburgh'] as const) {
    const f = fixture(map);
    assert(TOUR_MAPS[map].npcs.some(n => n.dialogue === f.event));
    const before = structuredClone(f.game.save);
    for (const event of ['tourGuide', 'tourPokemon', 'researchGate', 'roark', 'tourHost']) {
      assert.equal(handleCityActivity(f.game, event), false);
    }
    f.game.save.map = 'tour_eterna';
    assert.equal(handleCityActivity(f.game, f.event), false);
    f.game.save.map = map;
    assert.deepEqual(f.game.save, before);
    assert.equal(f.calls, 0);
  }
});

test('acceptance is optional, has safe last choices, and survives a real save reload', () => {
  const f = fixture();
  const before = structuredClone(f.game.save);
  f.open();
  assert.equal(f.dialogue.speaker, '방송국 직원');
  assert(f.dialogue.choices!.length <= 3);
  f.choose(f.dialogue.choices!.length - 1);
  assert.deepEqual(f.game.save, before);
  assert.equal(f.calls, 0);
  f.open(); f.choose();
  assert.equal(f.game.save.flags.cityJubilifeFriendsAccepted, true);
  const reloaded = parseSave(JSON.stringify(f.game.save));
  assert(reloaded);
  f.game.save = reloaded;
  f.open();
  assert.equal(f.dialogue.choices![0].label, '동료를 보여 준다');
  const accepted = structuredClone(f.game.save);
  f.choose(1);
  assert.deepEqual(f.game.save, accepted);
});

test('broadcast errand needs distinct owned species, then pays once across reload and stale replay', () => {
  const f = fixture();
  f.open(); f.choose();
  f.game.save.party.push({ ...f.game.save.party[0] });
  f.open(); f.choose();
  assert.match(f.dialogue.pages.join(''), /서로 다른 두 종/);
  assert.equal(f.game.save.money, 0);
  f.game.save.party[1] = pokemon();
  const preserved = structuredClone(f.game.save);
  f.open();
  const replay = f.dialogue.choices![0].action;
  f.choose();
  assert.match(f.dialogue.pages.join(''), /꼬부기, 비버니/);
  assert.equal(f.game.save.money, 200);
  assert.equal(f.game.save.inventory.pokeBalls, 2);
  assert.deepEqual(f.game.save.party, preserved.party);
  assert.deepEqual(f.game.save.badges, preserved.badges);
  assert.deepEqual(f.game.save.keyItems, preserved.keyItems);
  replay();
  const earned = parseSave(JSON.stringify(f.game.save));
  assert(earned);
  f.game.save = earned;
  f.open();
  assert.equal(f.dialogue.choices, undefined);
  assert.equal(f.game.save.money, 200);
  assert.equal(f.game.save.inventory.pokeBalls, 2);
  assert.equal(f.calls, 2);
});

test('optional flat box contributes owned species while seen-only Pokedex does not', () => {
  const f = fixture();
  f.open(); f.choose();
  Object.assign(f.game.save, { pokedex: { seen: [7, 399], caught: [7] } });
  f.open(); f.choose();
  assert.equal(f.game.save.money, 0);
  Object.assign(f.game.save, { box: [pokemon()] });
  f.open(); f.choose();
  assert.equal(f.game.save.money, 200);
});

test('unknown species cannot complete a collection errand', () => {
  const f = fixture();
  f.open(); f.choose();
  Object.assign(f.game.save, { box: [{ species: 999999 }] });
  f.open(); f.choose();
  assert.equal(f.game.save.money, 0);
});

test('miner checks party size, actual recovery, and level without healing or growing for the player', () => {
  const f = fixture('tour_oreburgh');
  f.open(); f.choose();
  f.open(); f.choose();
  assert.match(f.dialogue.pages.join(''), /둘 이상/);
  f.game.save.party.push(pokemon());
  f.game.save.party[1].hp = 0;
  f.open(); f.choose();
  assert.match(f.dialogue.pages.join(''), /회복/);
  assert.equal(f.game.save.party[1].hp, 0);
  f.game.save.party[1].hp = f.game.save.party[1].maxHp;
  f.open(); f.choose();
  assert.match(f.dialogue.pages.join(''), /레벨 8/);
  assert.equal(f.game.save.party[1].level, 5);
  f.game.save.party[1] = pokemon(399, 8);
  const party = structuredClone(f.game.save.party);
  f.open(); f.choose();
  assert.equal(f.game.save.money, 300);
  assert.equal(f.game.save.inventory.potions, 2);
  assert.deepEqual(f.game.save.party, party);
  assert.equal(f.game.save.flags.cityOreburghReadyRewarded, true);
  assert.equal(f.game.save.badges.length, 0);
  assert.equal(f.game.save.flags.observationCollected, undefined);
  assert(parseSave(JSON.stringify(f.game.save)));
});

test('revisits acknowledge a newly earned badge without repeating the local gift', () => {
  for (const map of ['tour_jubilife', 'tour_oreburgh'] as const) {
    const f = fixture(map);
    f.game.save.party.push(pokemon(399, 8));
    f.open(); f.choose(); f.open(); f.choose();
    f.open();
    assert(f.dialogue.pages.some(p => p.includes(map === 'tour_jubilife' ? '기억' : '받으면')));
    assert(awardGym(f.game.save, 'roark'));
    const saved = parseSave(JSON.stringify(f.game.save));
    assert(saved);
    f.game.save = saved;
    const before = structuredClone(saved);
    f.open();
    assert(f.dialogue.pages.some(p => p.includes('콜배지')));
    assert.deepEqual(f.game.save, before);
  }
});

test('already badged players may still complete the optional preparation errand', () => {
  const f = fixture('tour_oreburgh');
  f.game.save.party.push(pokemon(399, 8));
  assert(awardGym(f.game.save, 'roark'));
  const money = f.game.save.money;
  f.open(); f.choose(); f.open(); f.choose();
  assert.match(f.dialogue.pages.join(''), /콜배지를 얻은 뒤/);
  assert.equal(f.game.save.money, money + 300);
});

test('capacity blocks the whole gift without loss and leaves it claimable after spending', () => {
  for (const map of ['tour_jubilife', 'tour_oreburgh'] as const) {
    const f = fixture(map);
    f.game.save.party.push(pokemon(399, 8));
    f.open(); f.choose();
    for (const inventory of [{ pokeBalls: 998, potions: 998 }, { pokeBalls: 0, potions: 0 }]) {
      f.game.save.inventory = inventory;
      f.game.save.money = inventory.pokeBalls ? 0 : 999999;
      const before = structuredClone(f.game.save);
      f.open(); f.choose();
      assert.deepEqual(f.game.save, before);
      assert.match(f.dialogue.pages.join(''), /여유가 부족/);
    }
    f.game.save.money = 0;
    f.open(); f.choose();
    assert(f.game.save.money > 0);
    assert(parseSave(JSON.stringify(f.game.save)));
  }
});

test('callbacks from another slot or departed map cannot change save progress', () => {
  const f = fixture();
  f.open();
  const accept = f.dialogue.choices![0].action;
  f.game.save = structuredClone(f.game.save);
  accept();
  assert.equal(f.calls, 0);
  f.open(); f.choose();
  f.game.save.party.push(pokemon());
  f.open();
  const reward = f.dialogue.choices![0].action;
  f.game.save.map = 'tour_oreburgh';
  reward();
  assert.equal(f.game.save.money, 0);
  assert.equal(f.calls, 1);
});
