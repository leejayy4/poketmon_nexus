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
