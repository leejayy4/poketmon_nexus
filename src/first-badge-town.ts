import type { Engine } from './engine';
import { getMap } from './maps';
import { gymById } from './gyms';
import { adventureObjective } from './adventure-guide';
import { sinnohEvent } from './sinnoh-story';
import type { MapId, SaveData } from './types';

type TownId = 'tour_jubilife' | 'tour_oreburgh';
type GuideChoice = { label: string; target: MapId; event?: string };

const residentEvent: Record<TownId, string> = {
  tour_jubilife: 'tourResident1',
  tour_oreburgh: 'tourResident0',
};

function isFacingNpc(save: SaveData, npc: { x: number; y: number }): boolean {
  const dx = npc.x - save.player.x;
  const dy = npc.y - save.player.y;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
  const toward = dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up';
  return save.player.facing === toward;
}

function nextBadgeTarget(map: TownId, flags: SaveData['flags']): MapId | null {
  const town = getMap(map, flags);
  if (map === 'tour_oreburgh') {
    return town.warps.find(warp => warp.to === 'oreburgh_gym')?.to ?? null;
  }
  // The current first journey leaves through the authored Route 203 door, then
  // crosses Oreburgh Gate. The old generated tour_pass_* shortcut is no longer
  // the active connection and must not hide this guide option.
  return town.warps.find(warp => warp.to === 'tour_sinnoh_route_203')?.to ?? null;
}

function choicesFor(map: TownId, save: SaveData): GuideChoice[] {
  const flags = save.flags;
  const town = getMap(map, flags);
  const center = town.warps.find(warp => warp.to.endsWith('_center'));
  const mart = town.warps.find(warp => warp.to.endsWith('_mart'));
  const resident = town.npcs.find(npc => npc.dialogue === residentEvent[map]);
  const next = save.badges.includes(gymById('roark').badge)
    ? !save.badges.includes(gymById('gardenia').badge) ? 'tour_floaroma' : adventureObjective(save)?.map
    : nextBadgeTarget(map, flags);
  const choices: GuideChoice[] = [];
  if (center) choices.push({ label: '센터로 안내', target: center.to, event: 'nurse' });
  if (mart) choices.push({ label: '상점으로 안내', target: mart.to, event: 'martClerk' });
  if (resident) choices.push({ label: '주민 부탁 안내', target: map, event: resident.dialogue });
  if (next) choices.push({ label: '다음 길 안내', target: next });
  return choices;
}

function guideSpeaker(map: TownId, game: Engine, id: string): string {
  return getMap(map, game.save.flags).npcs.find(npc => npc.dialogue === id)?.name ?? '마을 안내원';
}

/** Guides only an actual, faced town guide; selecting a choice only draws the existing route. */
export function handleFirstBadgeTown(game: Engine, id: string): boolean {
  const map = game.save.map;
  if (map !== 'tour_jubilife' && map !== 'tour_oreburgh') return false;
  if (game.battle || game.dialogue) return false;
  const town = getMap(map, game.save.flags);
  const guide = town.npcs.find(npc => npc.dialogue === id);
  const jubilifeResearchGuide = map === 'tour_jubilife' && id === 'researchGate';
  if (jubilifeResearchGuide && game.save.flags.observationCollected === true) return false;
  if (!guide || (id !== 'tourGuide' && !jubilifeResearchGuide) || !isFacingNpc(game.save, guide)) return false;

  const choices = choicesFor(map, game.save);
  if (!choices.length) return false;
  const save = game.save;
  const current = () => game.save === save && save.map === map && !game.battle;
  const guidePages = [
    map === 'tour_oreburgh'
      ? save.badges.includes(gymById('roark').badge)
        ? '콜배지를 얻었군요.\n다음 여행을 준비해 볼까요?'
        : '무쇠게이트를 지나 광산 도시까지 왔군요.\n첫 배지와 탄갱 여행을 준비해 볼까요?'
      : '축복시티에서 동료와\n여행 준비를 시작해 볼까요?',
    '센터에서는 포켓몬을 회복하고\nPC에 동료를 맡길 수 있어요.',
    '상점에서는 몬스터볼과\n상처약을 살 수 있어요.',
    map === 'tour_oreburgh'
      ? `${town.npcs.find(npc => npc.dialogue === residentEvent[map])?.name ?? '광부'}의 준비 부탁과\n남쪽 탄갱 작업은 선택이에요.`
      : `${town.npcs.find(npc => npc.dialogue === residentEvent[map])?.name ?? '방송국 직원'}은 서로 다른 두 종을\n만나 소개해 달라고 부탁했어요.`,
    save.badges.includes(gymById('roark').badge)
      ? !save.badges.includes(gymById('gardenia').badge)
        ? '축복 북문에서 204번도로와 험한샛길을\n지나면 꽃향기마을이에요.'
        : '다음 길 안내에서 현재 모험의\n목적지를 확인할 수 있어요.'
      : map === 'tour_oreburgh'
      ? '동쪽 체육관에서 강석과 겨뤄 보세요.\n서쪽 무쇠게이트로 축복에 돌아갈 수 있어요.'
      : '동쪽 203번도로와 무쇠게이트 1층을 지나면\n무쇠시티와 첫 배지로 이어져요.',
    ...(map === 'tour_oreburgh' ? [
      '북쪽은 207번도로, 남쪽은 탄갱이에요.\n북동쪽 광산 전시관에도 들러 보세요.',
    ] : []),
    '안내는 선택사항이에요.\n원할 때만 골라 주세요.',
  ];
  const guideDialogue = game.dialogue;
  let consumed = false;
  const guideChoices = choices.map(choice => ({
    label: choice.label,
    action: () => {
      if (consumed || !current() || game.dialogue !== guideDialogue) return;
      consumed = true;
      game.setTourDestination(choice.target, choice.event);
      game.fieldMap = true;
    },
  }));
  if (jubilifeResearchGuide) {
    const researchLabel = '연구 통로 안내';
    guideChoices.push({ label: researchLabel, action: () => {
      if (consumed || !current() || game.dialogue !== guideDialogue) return;
      consumed = true;
      sinnohEvent(game, 'researchGate');
    }});
  }
  guideChoices.push({ label: '돌아가기', action: () => {} });
  game.say(guideSpeaker(map, game, id), guidePages, undefined, guideChoices);
  return true;
}
