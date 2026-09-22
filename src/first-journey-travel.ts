import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { ROUTE203_JOURNEY, isRoute203Partner } from './sinnoh-route203-journey';
import { OREBURGH_GATE_JOURNEY, isOreburghGatePartner } from './oreburgh-gate-journey';

/** Existing arrival/return conversations, kept separate from their map registration. */
export function handleFirstJourneyArrival(g: Engine, id: string): boolean {
  if (id === 'jubilifeSouthGreeter' && g.save.map === 'tour_jubilife') {
    const owned = [...g.save.party, ...g.save.box ?? []].filter(mon => mon.met === '신오 202번도로');
    const names = [...new Set(owned.map(mon => SPECIES[mon.species]?.name).filter(Boolean))].join('·') || '아직 없음';
    const wins = ['sinnoh-route-202-starly', 'sinnoh-route-202-bidoof', 'sinnoh-route-202-burmy'].filter(trainer => g.save.flags['trainerWon:' + trainer]).length;
    const hurt = g.save.party.filter(mon => mon.hp > 0 && mon.hp < mon.maxHp).length;
    const fainted = g.save.party.filter(mon => mon.hp <= 0).length;
    if (!g.save.flags.jubilifeArrivedVia202) { g.save.flags.jubilifeArrivedVia202 = true; g.persist(); }
    g.say('축복 남문 여행자', [
      '202번도로를 지나 축복시티 남문에 도착했군요.',
      `202번도로 출신 보유 동료 ${owned.length}마리 · ${names}`,
      `지나온 초보 트레이너 승리 ${wins}/3`,
      hurt || fainted ? `현재 부상 ${hurt} · 기절 ${fainted}. 북서쪽 포켓몬센터에서 먼저 쉬세요.` : '파티가 건강해요. 서쪽 트레이너스쿨에서 동료 상태와 실전을 배워 보세요.',
      '다음 본선은 동쪽 203번도로→무쇠게이트→무쇠시티입니다. 북쪽은 204번도로, 서쪽은 218번도로예요.',
    ]);
    return true;
  }
  if (id === 'jubilifeEastGuide' && g.save.map === 'tour_jubilife') {
    const f = ROUTE203_JOURNEY, local = [...g.save.party, ...g.save.box ?? []].filter(isRoute203Partner), slot = g.save.flags[f.slot];
    const partner = typeof slot === 'number' ? g.save.party[slot] : undefined;
    const same = partner && partner.species === g.save.flags[f.partner] && isRoute203Partner(partner) ? partner : undefined;
    const won = g.save.flags['trainerWon:sinnoh-route-203-practice'] === true, participated = g.save.flags[f.participated] === true;
    if (same && same.hp > 0 && won && participated) {
      if (!g.save.flags.jubilifeRoute203ReturnReviewed) { g.save.flags.jubilifeRoute203ReturnReviewed = true; g.persist(); }
      const start = Number(g.save.flags[f.level] ?? same.level);
      g.say('축복 동문 길 안내원', [
        `${SPECIES[same.species].name}가 203번도로 선택 실전에 실제로 참가하고 돌아왔군요.`,
        `포획 뒤 실전 시작 Lv.${start} → 현재 Lv.${same.level} · HP ${same.hp}/${same.maxHp}`,
        '동쪽으로 다시 나가면 203번도로와 무쇠게이트, 무쇠시티까지 이어집니다. 같은 길로 축복에 돌아올 수 있어요.',
      ]);
      return true;
    }
    const names = [...new Set(local.map(mon => SPECIES[mon.species]?.name).filter(Boolean))].join('·') || '아직 없음';
    g.say('축복 동문 길 안내원', [
      '동쪽은 203번도로 → 무쇠게이트 1층 → 무쇠시티로 이어집니다.',
      `203번도로 출신 보유 동료 ${local.length}마리 · ${names}`,
      local.length ? '건강한 현지 동료를 선두로 두고 연못과 바위턱 사이 트레이너와 선택 실전을 해 보세요.' : '서쪽·동쪽 풀밭에서 찌르꼬·비버니·꼬링크·캐이시를 만날 수 있어요. 포획하지 않아도 본선은 열려 있습니다.',
      won && !participated ? '이미 이긴 트레이너에게 현지 동료를 선두로 보여 주면 상금 없는 재확인전을 할 수 있어요.' : '실전 뒤 같은 동료와 돌아오면 성장과 귀환을 함께 기록할게요.',
    ]);
    return true;
  }
  if (id === 'oreburghWestArrivalGuide' && g.save.map === 'tour_oreburgh') {
    const f = OREBURGH_GATE_JOURNEY, local = [...g.save.party, ...g.save.box ?? []].filter(isOreburghGatePartner), slot = g.save.flags[f.slot];
    const partner = typeof slot === 'number' ? g.save.party[slot] : undefined;
    const same = partner && partner.species === g.save.flags[f.partner] && isOreburghGatePartner(partner) ? partner : undefined;
    const won = g.save.flags['trainerWon:oreburgh-gate-1f-practice'] === true, participated = g.save.flags[f.participated] === true;
    if (!g.save.flags.oreburghGateArrivalReviewed) { g.save.flags.oreburghGateArrivalReviewed = true; g.persist(); }
    if (same && same.hp > 0 && won && participated) {
      const start = Number(g.save.flags[f.level] ?? same.level);
      g.say('무쇠 서문 동굴 안내원', [
        `${SPECIES[same.species].name}와 무쇠게이트 1층을 지나 도착했군요.`,
        `선택 실전 시작 Lv.${start} → 현재 Lv.${same.level} · HP ${same.hp}/${same.maxHp}`,
        '북쪽 광산 전시관에서 도시와 탄갱의 관계를 살피고, 남쪽 무쇠탄갱에서 강석을 만날 수 있어요. 서쪽 게이트로 되돌아갈 수도 있습니다.',
      ]);
      return true;
    }
    const names = [...new Set(local.map(mon => SPECIES[mon.species]?.name).filter(Boolean))].join('·') || '아직 없음';
    g.say('무쇠 서문 동굴 안내원', [
      '서쪽 무쇠게이트 1층은 203번도로와 축복시티로 이어집니다.',
      `무쇠게이트 출신 보유 동료 ${local.length}마리 · ${names}`,
      local.length ? '건강한 현지 동료를 선두로 두고 게이트 작업자와 선택 실전을 해 보세요.' : '광석 곁 느슨한 돌길에서 주뱃·고라파덕·꼬마돌을 만날 수 있어요. 포획과 실전은 통행 조건이 아닙니다.',
      won && !participated ? '이미 이긴 작업자에게 현지 동료를 선두로 보여 주면 상금 없는 재확인전을 할 수 있어요.' : '동굴 동료가 실제 승리에 참가한 뒤 다시 도착하면 여행과 성장을 기록할게요.',
    ]);
    return true;
  }
  return false;
}

/** Road-trainer dispatch retains priority over the worker's travel fallback. */
export function handleFirstJourneyGate(g: Engine, id: string): boolean {
  if (g.save.map !== 'tour_oreburgh_gate_1f') return false;
  if (id === 'oreburghGateSign') {
    g.say('무쇠게이트 이정표', ['← 203번도로 · 축복시티 · → 무쇠시티', '밝은 통과로와 광석벽을 따라가면 도시 입구가 나옵니다.']);
    return true;
  }
  if (id === 'oreburghGateBasementSign') {
    g.say('무쇠게이트 지하 표지', ['아래쪽은 선택 탐험구역 B1F 방향입니다.', '현재 계단·지하층·아이템은 아직 적용하지 않았습니다.']);
    return true;
  }
  if (id === 'oreburghGateWorker') {
    g.say('무쇠게이트 작업자', ['야외 203번도로와 광산 도시 사이의 조명을 살피고 있어요.', '느슨한 돌길에서 만난 동료를 선두로 두면 작업선 밖에서 선택 실전을 할 수 있어요. 동쪽 본선은 계속 열려 있습니다.']);
    return true;
  }
  return false;
}
