import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { PASSAGES } from '../src/journey-world';
import { encounterPool } from '../src/runtime-encounters';
import { SPECIES,grantPokemon } from '../src/pokemon';
import { ETERNA_APPROACHES } from '../src/eterna-approaches';
import { newSave } from '../src/save';
import { handleJourneyEvent } from '../src/journey-services';
import { encounterGuidance, routeCompanionPages } from '../src/encounter-guidance';

function game(map: string) {
  const g = new Engine();
  g.save = newSave();
  g.save.map = map as typeof g.save.map;
  g.save.flags.departureCleared = true;
  g.persist = () => true;
  g.announce = () => {};
  return g;
}

test('every integrated passage gives truthful sign and traveller guidance', () => {
  for (const passage of Object.values(PASSAGES)) {
    if(passage.id==='tour_unova_route_01'){
      const g=game(passage.id),before=JSON.stringify(g.save);
      g.event('journeySign');assert.match(g.dialogue!.pages.join('\n'),/4번도로 · 리조트데저트 입구/);assert.match(g.dialogue!.pages.join('\n'),/야생 조우가 없습니다/);
      g.dialogue=null;g.event('journeyWalker');assert.match(g.dialogue!.pages.join('\n'),/← 구름시티  → 리조트데저트/);assert.doesNotMatch(g.dialogue!.pages.join('\n'),/도구|보상/);
      assert.equal(JSON.stringify(g.save),before);continue;
    }
    const approach=ETERNA_APPROACHES.find(route=>route.id===passage.id);
    if(approach){
      const g=game(passage.id);grantPokemon(g.save,1);const before=structuredClone(g.save);
      g.event('journeySign');const pages=g.dialogue!.pages.join('\n');
      assert(pages.includes(approach.name));assert(pages.includes(passage.a.name));assert(pages.includes(passage.b.name));assert.match(pages,/이 도로에는 없어요/);assert.equal(encounterPool(passage.id),undefined);
      g.dialogue=null;g.event('journeyWalker');
      if(approach.id==='tour_sinnoh_route_03'){assert(g.dialogue?.choices?.some(c=>c.label==='배틀한다'));g.cancel();assert(!g.battle);}
      else{assert(g.dialogue?.pages.some(p=>p.includes('숲 안의 안내원')));g.dialogue=null;}
      assert.deepEqual(g.save,before);continue;
    }
    if(passage.id==='tour_pass_pallet_cinnabar'){
      const g=game(passage.id),before=JSON.stringify(g.save);
      g.event('journeySign');assert.match(g.dialogue!.pages.join('\n'),/태초–홍련 해안길/);
      assert.match(g.dialogue!.pages.join('\n'),/태초마을/);assert.match(g.dialogue!.pages.join('\n'),/홍련섬/);
      g.dialogue=null;g.event('journeyWalker');assert(g.dialogue!.choices?.some(c=>c.label==='태초로 돌아가는 길'));
      assert(g.dialogue!.choices?.some(c=>c.label==='홍련센터 안내'));g.cancel();assert.equal(g.dialogue,null);
      assert.equal(JSON.stringify(g.save),before);continue;
    }
    const pool = encounterPool(passage.id);
    const g = game(passage.id);
    const before = JSON.stringify(g.save);
    assert.equal(handleJourneyEvent(g, 'journeySign'), true);
    assert(g.dialogue);
    if (pool) {
      assert.match(g.dialogue.pages.join('\n'), pool.slots.length<=2?/만날 수 있는 동료:/ : /흔한 동료:/);
      if(pool.slots.length>2)assert.match(g.dialogue.pages.join('\n'), /드물게/);else assert.doesNotMatch(g.dialogue.pages.join('\n'), /드물게/);
      assert.match(g.dialogue.pages.join('\n'), new RegExp(`이곳의 포켓몬은\\nLv\\.${pool.levels[0]}~${pool.levels[1]}`));
    } else {
      assert.match(g.dialogue.pages.join('\n'), /도시 사이를 걷기 좋은 길/);
      assert.doesNotMatch(g.dialogue.pages.join('\n'), /다른 포켓몬|풀밭도 둘러/);
    }
    g.dialogue = null;
    assert.equal(handleJourneyEvent(g, 'journeyWalker'), true);
    assert(g.dialogue);
    assert(g.dialogue.pages.some(page => /←|→/.test(page)));
    assert(g.dialogue.pages.some(page => /공터.*도구|도구.*공터/.test(page)));
    if (!pool) assert.doesNotMatch(g.dialogue.pages[0], /동료|살펴봐/);
    assert.equal(JSON.stringify(g.save), before);
  }
});

test('guidance derives the two common and one rare species from the runtime pool', () => {
  const map = 'tour_pass_jubilife_oreburgh';
  const pool = encounterPool(map)!;
  const sorted = [...pool.slots].sort((a, b) => b.weight - a.weight);
  const text = encounterGuidance(map).pages.join('\n');
  assert.match(text, new RegExp(`흔한 동료: ${SPECIES[sorted[0].speciesId].name}·${SPECIES[sorted[1].speciesId].name}`));
  assert.match(text, new RegExp(`드물게 ${SPECIES[sorted.at(-1)!.speciesId].name}`));
  assert.match(text, new RegExp(`Lv\\.${pool.levels[0]}~${pool.levels[1]}`));
});

test('route companion guidance uses the actual weighted route pool', () => {
  const map = 'route_s01';
  const pool = encounterPool(map)!;
  const sorted = [...pool.slots].sort((a, b) => b.weight - a.weight);
  const pages = routeCompanionPages(map);
  const text = pages.join('\n');

  assert.equal(pages.length, 2);
  assert.match(text, new RegExp(`흔한 동료: ${SPECIES[sorted[0].speciesId].name}·${SPECIES[sorted[1].speciesId].name}`));
  assert.match(text, new RegExp(`드물게 ${SPECIES[sorted.at(-1)!.speciesId].name}`));
  assert.match(text, new RegExp(`Lv\\.${pool.levels[0]}~${pool.levels[1]}`));
  assert.doesNotMatch(text, new RegExp(SPECIES[sorted[2].speciesId].name));
  assert.doesNotMatch(text, new RegExp(SPECIES[sorted[3].speciesId].name));
  assert.equal(pages[0].split('\n').length, 3);
  assert.match(pages[1], /HP를 절반 이하/);
  assert.match(pages[1], /몬스터볼/);
});

test('route companion guidance fits the field dialogue UI', () => {
  assert.equal(routeCompanionPages('route_s01').length, 2);
  for (const page of routeCompanionPages('route_s01')) {
    const lines = page.split('\n');
    assert(lines.length <= 3);
    for (const line of lines) assert(line.length <= 24, `${line} is too long`);
  }
});

test('guidance and pickup preserve rewards and pickup remains one time', () => {
  const g = game('tour_pass_jubilife_oreburgh');
  const before = structuredClone(g.save);
  handleJourneyEvent(g, 'journeySign');
  g.dialogue = null;
  handleJourneyEvent(g, 'journeyWalker');
  assert.deepEqual(g.save, before);
  g.dialogue = null;
  const potions = g.save.inventory.potions;
  handleJourneyEvent(g, 'journeyItem');
  g.dialogue = null;
  handleJourneyEvent(g, 'journeyItem');
  assert.equal(g.save.inventory.potions, potions + 1);
  assert.equal(g.save.money, before.money);
  assert.equal(g.save.inventory.pokeBalls, before.inventory.pokeBalls);
});
