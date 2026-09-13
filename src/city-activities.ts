import type { Engine } from './engine';
import type { SaveData } from './types';
import { createTourResidents } from './explore-residents';
import { SPECIES } from './pokemon';
import { gymById } from './gyms';
import { handleFirstBadgeTown } from './first-badge-town';

// Optional local errands, independent of CH/SQ/PG design quests and gym gates.
// Parent integration: call before Engine.event's generic tour resident branch.
type Activity = {
  map: SaveData['map']; event: string; flag: string;
  request: () => string[]; check: (save: SaveData) => string | null;
  thanks: (save: SaveData) => string[]; revisit: (save: SaveData) => string[];
  money: number; item: 'pokeBalls' | 'potions'; amount: number;
};

// Old saves need no migration. A future flat box array may contribute owned
// species; merely seeing a Pokemon in the Pokedex must not count as owning it.
function ownedSpecies(save: SaveData): number[] {
  const box = (save as SaveData & { box?: { species: number }[] }).box;
  return [...new Set([...save.party, ...(Array.isArray(box) ? box : [])]
    .filter(p => p && SPECIES[p.species]).map(p => p.species))];
}

const activities: Activity[] = [
  {
    map: 'tour_jubilife', event: 'tourResident1', flag: 'cityJubilifeFriends',
    request: () => ['광장을 찾는 동료들의 이야기를\n짧게 소개하는 건 어떨까요?',
      '서로 다른 두 종을 동료로 맞고\n다시 이야기해 주세요.',
      '파티와 박스의 친구를 함께 셀게요.\n사례: 200원과 몬스터볼 2개예요.'],
    check: save => ownedSpecies(save).length >= 2 ? null
      : '아직 서로 다른 두 종이 아니네요.\n풀밭에서 새 동료를 만나 보세요.',
    thanks: save => {
      const [first, second] = ownedSpecies(save).map(id => SPECIES[id].name);
      return [`${first}, ${second}!\n서로 다른 친구들과 여행하는군요.`,
        '이름을 들으니 광장 풍경에도\n여행 이야기가 더해진 것 같아요.'];
    },
    revisit: save => save.badges.includes(gymById('roark').badge)
      ? ['동료들을 소개해 준 트레이너군요!\n콜배지도 얻었네요.',
        '함께한 친구들과 더 먼 곳의\n풍경도 만나고 오세요.']
      : ['소개해 준 친구들 기억하고 있어요.\n다음에는 여행 이야기도 들려주세요.'],
    money: 200, item: 'pokeBalls', amount: 2,
  },
  {
    map: 'tour_oreburgh', event: 'tourResident0', flag: 'cityOreburghReady',
    request: () => ['광산에서 일할 때도 준비와 휴식이\n먼저야. 파티도 살펴볼까?',
      `두 친구 이상을 모두 회복시키고\n한 친구를 레벨 ${gymById('roark').level}까지 키워 봐.`,
      '돌아오면 300원과 상처약 2개를 줄게.\n이 부탁은 체육관 도전 조건은 아니야.'],
    check: save => save.party.length < 2
      ? '교대하며 쉴 수 있게 둘 이상 데려와.\n풀밭에서 동료를 만나 보렴.'
      : save.party.some(p => p.hp <= 0 || p.hp < p.maxHp)
      ? '다친 친구가 있구나. 포켓몬센터에서\n모두 회복하고 돌아오렴.'
      : !save.party.some(p => p.level >= gymById('roark').level)
      ? `한 친구가 레벨 ${gymById('roark').level}이면 준비 끝이야.\n풀밭에서 무리하지 말고 연습해 봐.` : null,
    thanks: save => save.badges.includes(gymById('roark').badge)
      ? ['콜배지를 얻은 뒤에도 잘 돌보는구나.\n다음 여행에서도 준비를 잊지 마.']
      : ['모두 건강하고 든든하게 자랐구나!\n강석에게 도전할 때 도움이 될 거야.'],
    revisit: save => save.badges.includes(gymById('roark').badge)
      ? ['콜배지구나! 준비하던 모습이 떠올라.\n너희가 함께 해냈구나.',
        '앞으로도 연습한 뒤에는 쉬어 가렴.\n무쇠에 돌아오면 또 이야기하자.']
      : ['준비 선물은 잘 챙겼지?\n도전하기 전에는 파티를 살펴보렴.',
        '강석에게 콜배지를 받으면\n다시 보여 주러 오렴.'],
    money: 300, item: 'potions', amount: 2,
  },
];

/** True only for one of the two existing outdoor resident conversations. */
export function handleCityActivity(game: Engine, id: string): boolean {
  if (game.save.map === 'tour_oreburgh' && id === 'tourResident1') {
    const species = Number(game.save.flags.oreburghMineWorkSpecies ?? 0);
    const partner = game.save.party.find(p => p.species === species && p.hp > 0);
    const completed = Boolean(game.save.flags.oreburghMineWorkComplete);
    const hurt = game.save.party.filter(p => p.hp > 0 && p.hp < p.maxHp).length;
    const fainted = game.save.party.filter(p => p.hp <= 0).length;
    game.say('전시관 학생',[
      completed && partner
        ? `${SPECIES[partner.species].name}와 탄갱 레일과 광맥의 소리를 비교했군요!\n전시관 모형에서도 같은 길을 찾아볼 수 있어요.`
        : partner
        ? `${SPECIES[partner.species].name}와 탄갱 작업 확인 중이군요.\n레일을 먼저 보고 측면 광맥으로 가 보세요.`
        : '광차 모형을 보러 왔어요.\n탄갱 작업반장에게 동료를 정하면 실제 레일과 비교할 수 있대요.',
      game.save.party.length
        ? `현재 파티 ${game.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`
        : '현재 파티가 비어 있어요. 포켓몬센터 PC에서 동료를 편성할 수 있어요.',
      '전시관과 탄갱 활동은 강석 도전이나 콜배지 조건이 아니에요.',
    ]);
    return true;
  }
  if (game.save.map === 'tour_oreburgh_hall' && (id === 'tourHost' || id.startsWith('tourExhibit'))) {
    const species = Number(game.save.flags.oreburghMineWorkSpecies ?? 0);
    const partner = game.save.party.find(p => p.species === species && p.hp > 0);
    const rail = Boolean(game.save.flags.oreburghMineRailChecked);
    const completed = Boolean(game.save.flags.oreburghMineWorkComplete);
    const name = partner ? SPECIES[partner.species].name : null;
    if (id === 'tourHost') {
      game.say('광산 전시관 안내원',[
        '무쇠탄갱의 광석층, 운반 레일, 작업 도구를 보존한 전시관입니다.',
        completed && name
          ? `${name}와 남긴 탄갱 작업 기록을 전시물과 비교해 보세요.`
          : name
          ? `${name}와 진행 중인 탄갱 확인을 마치면 전시 설명이 달라집니다.`
          : '탄갱 작업반장에게 건강한 동료를 정한 뒤 돌아오면 실제 작업과 전시를 비교할 수 있습니다.',
        '관람 기록은 체육관·배지·통행 조건이나 보상이 아닙니다.',
      ]);
      return true;
    }
    if (id === 'tourExhibit0') {
      game.say('광석 표본',[completed && name
        ? `${name}와 들었던 측면 광맥의 울림을 떠올리며 색과 결이 다른 표본을 비교했습니다.`
        : '채굴 깊이에 따라 색과 결이 다른 광석과 석탄 표본이 놓여 있습니다.',
        '표본을 가져가거나 아이템으로 얻지는 않습니다.']);
      return true;
    }
    if (id === 'tourExhibit1') {
      game.say('탄광 모형',[rail && name
        ? `${name}와 확인한 광차 바퀴 자국과 대피 폭이 작은 모형에도 표시되어 있습니다.`
        : '작은 광차와 작업로, 사람과 포켓몬이 비켜서는 공간을 한눈에 볼 수 있습니다.',
        completed ? '측면 갱도가 본선으로 돌아오는 위치도 실제 작업 기록과 일치합니다.' : '실제 탄갱에서는 작업반장에게 동료를 정하고 레일부터 살펴볼 수 있습니다.']);
      return true;
    }
    game.say('광부의 도구',[name
      ? `${name}와 작업할 때 사용한 손짓·소리 신호가 그림으로 정리되어 있습니다.`
      : '사람과 포켓몬이 함께 일할 때 쓰는 손짓·소리 신호가 도구 옆에 그려져 있습니다.',
      '도구를 사용하거나 광석을 채취하는 기능은 없습니다.']);
    return true;
  }
  if (handleFirstBadgeTown(game, id)) return true;
  const activity = activities.find(a => a.map === game.save.map && a.event === id);
  if (!activity) return false;
  const resident = createTourResidents(activity.map).find(n => n.dialogue === id);
  if (!resident) return false;
  const save = game.save;
  const accepted = activity.flag + 'Accepted', rewarded = activity.flag + 'Rewarded';
  // Dialogue callbacks from a different save/map must never grant a reward.
  const current = () => game.save === save && save.map === activity.map;
  const say = (pages: string[]) => game.say(resident.name, pages);
  if (save.flags[rewarded] === true) {
    say(activity.revisit(save));
    return true;
  }
  if (save.flags[accepted] !== true) {
    game.say(resident.name, [...resident.pages, ...activity.request()], undefined, [
      { label: '해 볼게요', action: () => {
        if (!current() || save.flags[accepted] === true || save.flags[rewarded] === true) return;
        save.flags[accepted] = true;
        game.persist();
        say(['준비되면 다시 말을 걸어 줘요.\n천천히 다녀와도 괜찮아요.']);
      } },
      { label: '다음에 할게요', action: () => {} },
    ]);
    return true;
  }
  game.say(resident.name, activity.request(), undefined, [
    { label: '동료를 보여 준다', action: () => {
      if (!current() || save.flags[accepted] !== true) return;
      if (save.flags[rewarded] === true) { say(activity.revisit(save)); return; }
      const missing = activity.check(save);
      if (missing) { say([missing]); return; }
      const money = Math.min(activity.money, 999999 - save.money);
      const amount = Math.min(activity.amount, 999 - save.inventory[activity.item]);
      // Keep the whole gift available until there is room; no silent lost items.
      if (money < activity.money || amount < activity.amount) {
        say(['선물을 전부 받을 여유가 부족해요.\n돈과 도구를 사용한 뒤 다시 와 주세요.']);
        return;
      }
      const pages = activity.thanks(save);
      save.flags[rewarded] = true;
      save.money += money;
      save.inventory[activity.item] += amount;
      game.persist();
      const itemName = activity.item === 'pokeBalls' ? '몬스터볼' : '상처약';
      say([...pages, `${money}원과 ${itemName} ${amount}개를 받았다!`]);
    } },
    { label: '다음에 보여 준다', action: () => {} },
  ]);
  return true;
}
