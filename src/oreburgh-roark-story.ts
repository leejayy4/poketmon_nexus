import type { Engine } from './engine';
import type { SaveData } from './types';
import { GYMS } from './gyms';
import { OREBURGH_ROARK } from './oreburgh-roark-state';

export function oreburghRoarkMinePages(save: SaveData): string[] {
  return save.flags[OREBURGH_ROARK.met] || save.flags[OREBURGH_ROARK.gymMet]
    ? ['강석은 교대 확인을 마치고\n도시 동쪽 체육관으로 돌아갔습니다.']
    : save.badges.includes(GYMS[0].badge)
    ? ['강석이 오늘도 제 오른쪽 교대 자리를\n살피고 있어요. 여행 이야기를 들려주세요.']
    : ['강석은 제 오른쪽 교대 자리에서\n광차가 지나가는 길을 살피고 있어요.', '동료와 서두르지 말고 가 보세요.\n작업을 돕지 않아도 이야기할 수 있어요.'];
}

export function handleOreburghRoark(g: Engine, id: string): boolean {
  if (id !== OREBURGH_ROARK.event || g.save.map !== 'tour_oreburgh_mine') return false;
  const save = g.save;
  const current = () => g.save === save && save.map === 'tour_oreburgh_mine' && !g.battle && !g.transition && !g.dialogue;
  if (save.flags[OREBURGH_ROARK.met] || save.flags[OREBURGH_ROARK.gymMet]) return true;
  let used = false;
  if (save.badges.includes(GYMS[0].badge)) {
    g.say('강석', ['콜배지를 가지고 다시 왔구나.\n이곳에선 내가 광부들의 교대를 살피고 있어.', '여행하다 쉬고 싶으면 들러.\n나는 이제 체육관으로 돌아갈게.'], () => {
      if (used || !current()) return;
      used = true;
      save.flags[OREBURGH_ROARK.gymMet] = true;
      g.persist();
    });
    return true;
  }
  const finish = () => {
    if (used || !current() || save.flags[OREBURGH_ROARK.met]) return;
    used = true;
    save.flags[OREBURGH_ROARK.met] = true;
    // Preserve the old guidance contract without turning the foreman's account
    // into proof of a meeting the player has never experienced.
    save.flags.oreburghRoarkMineBriefed = true;
    g.persist();
  };
  const introduce = () => {
    if (used || !current()) return;
    g.say('강석', ['나는 무쇠시티 관장 강석이야.\n여기서는 광부들과 작업 시간을 나눠 지내지.',
      '광차가 지나갈 때는 꼬마돌도 길을 비켜.\n주뱃이 쉬는 갱도엔 큰 소리를 내지 않고.',
      '배틀에서도 동료가 쉴 틈을 살펴봐.\n교체하고 회복하는 것도 트레이너의 판단이야.',
      '교대가 끝났네. 나는 동쪽 체육관으로 갈게.\n준비가 되면 너희의 배틀을 보여 줘!'], finish);
  };
  let chosen = false;
  g.say('교대를 살피는 청년', ['잠깐, 광차가 지나가는 중이야.\n동료와 이쪽 넓은 자리에서 기다릴래?'], undefined, [
    { label: '함께 교대를 기다린다', action: () => {
      if (chosen || used || !current()) return;
      chosen = true;
      g.say('탄갱 교대 자리', ['빈 광차가 지나가자 작업반장이 손을 든다.\n꼬마돌이 먼저 비켜서고 광부가 길을 건넌다.',
        '청년은 마지막 발소리까지 듣고\n작업반장에게 고개를 끄덕인다.'], introduce);
    } },
    { label: '나중에 이야기한다', action: () => { chosen = true; used = true; } },
  ]);
  return true;
}
