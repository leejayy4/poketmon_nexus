import type { Engine } from './engine';
import type { Dialogue, Point, SaveData } from './types';
import { ETERNA_CLOCK, ETERNA_CLOCK_PAGES } from './eterna-clock-art';
import { JUBILIFE_CLOCK, SINNOH_CLOCK_FLAGS } from './sinnoh-clock-state';
export { installJubilifeClock, JUBILIFE_CLOCK, SINNOH_CLOCK_FLAGS } from './sinnoh-clock-state';

interface ClockContext { save: SaveData; map: SaveData['map']; position: Point; dialogue: Dialogue }
interface ClockObservation extends ClockContext { start: number; elapsed: number }
const observations = new WeakMap<Engine, ClockObservation>();
const invitations = new WeakMap<Engine, ClockContext>();
const OBSERVATION_DURATION = 4.3;

function sameFieldContext(g: Engine, context: ClockContext): boolean {
  return g.save === context.save && g.save.map === context.map && !g.move && !g.battle && !g.transition && g.panel === 'field'
    && g.save.player.x === context.position.x && g.save.player.y === context.position.y;
}

function discardStaleInvitation(g: Engine) {
  const invitation = invitations.get(g);
  if (invitation && (!sameFieldContext(g, invitation) || g.dialogue !== invitation.dialogue)) invitations.delete(g);
}

function observation(g: Engine): ClockObservation | undefined {
  const scene = observations.get(g);
  if (scene && (!sameFieldContext(g, scene) || g.save.map !== 'tour_jubilife' || g.dialogue !== scene.dialogue)) {
    observations.delete(g);
    return undefined;
  }
  return scene;
}

export function watchingSinnohClock(g: Engine): boolean { return !!observation(g); }

export function sinnohClockView(g: Engine): Readonly<{ elapsed: number; remaining: number }> | null {
  const scene = observation(g);
  return scene ? { elapsed: scene.elapsed, remaining: Math.max(0, OBSERVATION_DURATION - scene.elapsed) } : null;
}

export function cancelSinnohClock(g: Engine) {
  if (!observation(g)) return;
  observations.delete(g);
  g.clearInput();
  g.say('광장 교통 시계', ['시계에서 눈을 뗐다.\n다음에 다시 살펴보자.']);
}

export function updateSinnohClock(g: Engine, dt: number) {
  discardStaleInvitation(g);
  const scene = observation(g);
  if (!scene) return;
  if (!Number.isFinite(dt) || dt <= 0) return;
  scene.elapsed += dt;
  if (scene.elapsed < OBSERVATION_DURATION) return;
  observations.delete(g);
  scene.save.flags[SINNOH_CLOCK_FLAGS.observed] = true;
  g.persist();
  g.say('분수 옆에서', [
    '기준 시계가 세 번 움직이는 동안\n큰 시계의 초침은 같은 곳에 있었다.',
    '그동안 분수는 계속 흐르고 있었다.\n지금은 두 시계 모두 움직인다.',
    '무슨 일이었을까? 수첩에 적어 두었다.\n동쪽 길에서는 첫 체육관이 기다린다.',
  ]);
}

export function handleSinnohClock(g: Engine, id: string): boolean {
  const save = g.save, map = save.map;
  const current = () => g.save === save && save.map === map && !g.battle && !g.transition;
  if (map === 'tour_jubilife' && id === JUBILIFE_CLOCK.event) {
    invitations.delete(g);
    if (save.flags[SINNOH_CLOCK_FLAGS.observed] === true) {
      g.say('광장 교통 시계', ['초침은 다시 움직이고 있다.\n분수의 물소리도 여전하다.', save.flags[SINNOH_CLOCK_FLAGS.compared] === true
        ? '영원의 관측 그림에도 같은 세 초가 있었다.\n원인은 아직 알 수 없다.'
        : '영원시티에도 시계 관측 기록판이 있다고 한다.\n여행길에 내 기록과 비교해 보자.']);
      return true;
    }
    let invitation: ClockContext | undefined;
    const accept = () => {
      if (!invitation || invitations.get(g) !== invitation) return false;
      // Engine.confirm clears the selected dialogue immediately before its action.
      if (!sameFieldContext(g, invitation) || (g.dialogue !== null && g.dialogue !== invitation.dialogue)) {
        invitations.delete(g);
        return false;
      }
      invitations.delete(g);
      return true;
    };
    g.say('광장 교통 시계', ['분수 옆에는 교통 시계와\n작은 기준 시계가 나란히 있다.'], undefined, [
      { label: '초침을 살펴본다', action: () => {
        if (!accept()) return;
        g.clearInput();
        g.say('분수 옆에서', ['초침과 물줄기를 함께 바라본다.\n잠깐 기다려 보자. (X: 그만 보기)']);
        if (g.dialogue) observations.set(g, { save, map, position: { ...save.player }, dialogue: g.dialogue, start: g.clock, elapsed: 0 });
      } },
      { label: '여행을 계속한다', action: () => { if (invitation && invitations.get(g) === invitation) invitations.delete(g); } },
    ]);
    if (g.dialogue) {
      invitation = { save, map, position: { ...save.player }, dialogue: g.dialogue };
      invitations.set(g, invitation);
    }
    return true;
  }
  if (map !== 'tour_eterna' || id !== ETERNA_CLOCK.event) return false;
  if (save.flags[SINNOH_CLOCK_FLAGS.observed] !== true) {
    g.say('시계 관측 기록판', [...ETERNA_CLOCK_PAGES, '축복 분수 옆에도 두 시계가 있다.\n돌아가는 길에 직접 살펴보자.']);
    return true;
  }
  if (save.flags[SINNOH_CLOCK_FLAGS.compared] === true) {
    g.say('시계 관측 기록판', ['축복에서 본 세 초와 같은 간격이다.\n수첩에 두 장소를 나란히 그렸다.', '장막의 관측 연구원이 모으는 기록에도\n같은 흔적이 있는지 물어보자.']);
    return true;
  }
  let used = false;
  g.say('시계 관측 기록판', [...ETERNA_CLOCK_PAGES.slice(0, 2), '축복에서 큰 초침이 멈췄을 때\n주변은 어땠는지 떠올려 보자.'], undefined, [
    { label: '분수는 계속 흘렀다', action: () => {
      if (used || !current() || save.flags[SINNOH_CLOCK_FLAGS.observed] !== true) return;
      used = true;
      save.flags[SINNOH_CLOCK_FLAGS.compared] = true;
      g.persist();
      g.say('여행 수첩', ['물줄기까지 멈춘 것은 아니었다.\n두 장소의 시계 간격은 같은 세 초다.', '관측 그림 옆에 내 경험을 적었다.\n원인까지 단정하지는 말자.']);
    } },
    { label: '도시 전체가 멈췄다', action: () => {
      if (used || !current()) return;
      used = true;
      g.say('여행 수첩', ['물줄기는 계속 흘렀다.\n도시 전체가 멈췄다고 적을 수는 없다.', '기록판을 다시 살펴보자.']);
    } },
    { label: '나중에 비교한다', action: () => { used = true; } },
  ]);
  return true;
}

export function sinnohClockResearchPages(save: SaveData): string[] {
  if (save.flags[SINNOH_CLOCK_FLAGS.observed] !== true) return [];
  return save.flags[SINNOH_CLOCK_FLAGS.compared] === true
    ? ['축복에서 본 초침과 영원의 관측 그림.\n당신의 수첩에도 같은 세 초가 있군요.', '원본과 수첩의 사본을 함께 은솔박사에게\n보관을 부탁할게요. 조사는 연구진이 맡아요.']
    : ['축복에서 직접 시계를 보았군요.\n영원의 기록판도 여행길에 비교해 보세요.'];
}

/** Extra evidence never replaces or gates the existing four-badge delivery. */
export function archiveSinnohClockEvidence(save: SaveData): boolean {
  const f = SINNOH_CLOCK_FLAGS;
  if (save.flags[f.archived] === true || save.flags[f.observed] !== true || save.flags[f.compared] !== true || save.flags.researchDelivered !== true) return false;
  save.flags[f.archived] = true;
  return true;
}

/** The city hand alone pauses for three seconds; the reference and fountain run. */
export function paintJubilifeClock(c: CanvasRenderingContext2D, g: Engine) {
  if (g.save.map !== 'tour_jubilife') return;
  const scene = observation(g), time = scene ? scene.start + scene.elapsed : g.clock;
  const delay = scene ? Math.min(3, Math.max(0, scene.elapsed - 1)) : g.save.flags[SINNOH_CLOCK_FLAGS.observed] === true ? 3 : 0;
  const x = JUBILIFE_CLOCK.x * 16 + 8, y = JUBILIFE_CLOCK.y * 16 + 8;
  c.save();
  c.fillStyle = '#4c626b'; c.fillRect(x - 3, y - 18, 6, 21);
  c.fillStyle = '#9ba9a1'; c.fillRect(x - 1, y - 17, 2, 20);
  c.fillStyle = '#364e59'; c.fillRect(x - 12, y - 38, 24, 25);
  c.fillStyle = '#e8ddaf'; c.fillRect(x - 10, y - 36, 20, 21);
  const dial = (cx: number, cy: number, radius: number, seconds: number) => {
    c.fillStyle = '#faf2d8'; c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#506675'; c.lineWidth = 1; c.stroke();
    for (let n = 0; n < 4; n++) { const a = n * Math.PI / 2; c.fillStyle = '#506675'; c.fillRect(Math.round(cx + Math.cos(a) * (radius - 1)), Math.round(cy + Math.sin(a) * (radius - 1)), 1, 1); }
    const a = Math.floor(seconds) * Math.PI / 30 - Math.PI / 2;
    c.strokeStyle = '#a2564e'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * (radius - 2), cy + Math.sin(a) * (radius - 2)); c.stroke();
  };
  dial(x, y - 27, 8, time - delay);
  c.fillStyle = '#364e59'; c.fillRect(x - 7, y - 12, 14, 13);
  dial(x, y - 6, 5, time);
  c.restore();
}
