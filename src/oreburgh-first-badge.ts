import type { Engine } from './engine';
import type { Dialogue, Point, Pokemon, SaveData } from './types';
import { FIRST_BADGE } from './first-badge';
import { SPECIES } from './pokemon';
import { withParticle } from './korean-text';
import { OREBURGH_FIRST_BADGE as F } from './oreburgh-first-badge-state';

type Images = Record<string, HTMLImageElement | HTMLCanvasElement>;
type Scene = { save: SaveData; dialogue: Dialogue | null; start: number; phase: 'badge' | 'snack' | 'farewell'; partner?: Pokemon; point?: Point };
const scenes = new WeakMap<Engine, Scene>();
const nextRoadPages = [
  '서쪽 무쇠게이트와 203번도로를 지나\n축복시티로 돌아가자.',
  '축복 북문의 204번도로와 험한샛길을\n지나면 꽃향기마을이야.',
];

function facingYujin(g: Engine): boolean {
  const npc = g.map.npcs.find(n => n.id === F.event), p = g.save.player;
  if (!npc) return false;
  const dx = npc.x - p.x, dy = npc.y - p.y;
  return Math.abs(dx) + Math.abs(dy) === 1 && p.facing === (dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up');
}

function current(g: Engine, scene: Scene): boolean {
  return scenes.get(g) === scene && g.save === scene.save && scene.save.map === 'tour_oreburgh'
    && scene.save.badges.includes(FIRST_BADGE) && !g.battle && !g.transition && !g.move && facingYujin(g);
}

function stop(g: Engine, scene: Scene) { if (scenes.get(g) === scene) scenes.delete(g); }

function cityExitGuide(g: Engine) {
  scenes.delete(g);
  const save = g.save;
  let used = false;
  const guide = (target: string, event?: string) => {
    if (used || g.save !== save || save.map !== 'tour_oreburgh' || !save.badges.includes(FIRST_BADGE) || g.battle || g.transition || !facingYujin(g)) return;
    used = true; g.setTourDestination(target, event);
  };
  g.say('유진', [
    '서쪽 무쇠게이트와 203번도로는 축복시티로,\n북쪽 207번도로는 206번도로와 천관산으로 이어져.',
    '남쪽은 무쇠탄갱이야.\n세 길 모두 같은 길로 돌아올 수 있어.',
    '센터는 북서쪽, 상점은 남서쪽에 있어.\n동쪽 체육관과 북동쪽 전시관도 들러 봐.',
  ], undefined, [
    { label: '센터로 안내', action: () => guide('tour_oreburgh_center', 'nurse') },
    { label: '상점으로 안내', action: () => guide('tour_oreburgh_mart', 'martClerk') },
    { label: '주민 부탁 안내', action: () => guide('tour_oreburgh', 'tourResident0') },
    { label: '꽃향기 쪽 길 안내', action: () => guide('tour_floaroma') },
    { label: '돌아가기', action: () => { used = true; } },
  ]);
}

function say(g: Engine, scene: Scene, speaker: string, pages: string[], after?: () => void, choices?: Parameters<Engine['say']>[3]) {
  g.say(speaker, pages, after, choices); scene.dialogue = g.dialogue;
}

function nextRoad(g: Engine, scene: Scene) {
  if (!current(g, scene) || scene.save.flags[F.shared] !== true) { stop(g, scene); return; }
  scene.phase = 'farewell';
  say(g, scene, '유진', [
    '다음에도 같이 출발할래?\n무쇠게이트에서는 네가 앞에 가.',
    '도시까지 안다고 했지, 도시에서 나가는\n길까지 안다고는 안 했어.',
    ...nextRoadPages,
  ], () => {
    if (!current(g, scene) || scene.save.flags[F.observed] !== true || scene.save.flags[F.shared] !== true) { stop(g, scene); return; }
    scene.save.flags[F.completed] = true;
    g.persist(); stop(g, scene);
  });
}

function partnerSpace(g: Engine): Point | undefined {
  const p = g.save.player, map = g.map;
  return [{ x: p.x + 1, y: p.y }, { x: p.x - 1, y: p.y }, { x: p.x, y: p.y + 1 }, { x: p.x, y: p.y - 1 }].find(point =>
    map.walkable[point.y]?.[point.x] === '.' && !map.npcs.some(npc => npc.x === point.x && npc.y === point.y)
    && !map.warps.some(warp => warp.x === point.x && warp.y === point.y)
    && !map.props.some(prop => prop.x === point.x && prop.y === point.y));
}

function chooseCompanion(g: Engine, scene: Scene) {
  if (!current(g, scene)) { stop(g, scene); return; }
  if (scene.save.flags[F.shared] === true) { nextRoad(g, scene); return; }
  const healthy = scene.save.party.filter(mon => mon.hp > 0);
  if (!healthy.length) {
    stop(g, scene);
    g.say('유진', ['먼저 바로 뒤 센터에서 동료를 쉬게 하자.\n간식은 그다음에 같이 나누면 돼.']);
    return;
  }
  let used = false;
  say(g, scene, '유진', ['센터에서 간식을 받아 왔어.\n같이 앉을 동료를 불러 줄래?'], undefined, [
    ...healthy.map(mon => ({ label: `${SPECIES[mon.species].name} Lv.${mon.level}`, action: () => {
      if (used || !current(g, scene)) return;
      used = true;
      if (!scene.save.party.includes(mon) || mon.hp <= 0) { stop(g, scene); return; }
      const point = partnerSpace(g);
      if (!point) { stop(g, scene); g.say('유진', ['동료가 앉을 자리를 조금 비켜 주자.\n센터 앞에서 다시 이야기하자.']); return; }
      scene.partner = mon; scene.point = point; scene.phase = 'snack'; scene.start = g.clock;
      const name = SPECIES[mon.species].name;
      let shared = false;
      say(g, scene, '센터 앞에서', [
        `${withParticle(name, '이/가')} 옆에 다가왔다.\n유진이 배지를 조심히 돌려준다.`,
        '“먹는 거 아니야.\n너한테 줄 건 따로 있어.”',
      ], undefined, [
        { label: '간식을 나눈다', action: () => {
          if (shared || !current(g, scene)) return;
          shared = true;
          if (!scene.save.party.includes(mon) || mon.hp <= 0) { stop(g, scene); return; }
          scene.save.flags[F.shared] = true;
          scene.save.flags[F.partner] = mon.species;
          g.persist();
          say(g, scene, '센터 앞에서', [
            `${withParticle(name, '과/와')} 작은 접시를 사이에\n두고 간식을 나눴다.`,
            '유진은 배지보다 접시를 먼저 챙긴다.\n잠깐은 다음 승부 이야기도 쉬어 간다.',
          ], () => nextRoad(g, scene));
        } },
        { label: '다음에 나눈다', action: () => stop(g, scene) },
      ]);
    } })),
    { label: '나중에 함께 쉰다', action: () => { used = true; stop(g, scene); } },
  ]);
}

export function handleOreburghFirstBadge(g: Engine, id: string): boolean {
  if (id !== F.event || g.save.map !== 'tour_oreburgh' || g.battle || g.transition || g.move || !facingYujin(g)) return false;
  scenes.delete(g);
  const save = g.save;
  if (!save.badges.includes(FIRST_BADGE)) return false;
  if (save.flags[F.completed] === true) {
    g.say('유진', ['그 작은 배지, 잘 챙겼지?\n다음 길도 서두르지 말고 가자.', ...nextRoadPages], undefined, [
      { label: '도시 출구 안내', action: () => {
        if (g.save === save && save.map === 'tour_oreburgh' && save.badges.includes(FIRST_BADGE) && !g.battle && !g.transition && facingYujin(g)) cityExitGuide(g);
      } },
      { label: '모험을 계속한다', action: () => {} },
    ]);
    return true;
  }
  const scene: Scene = { save, dialogue: null, start: g.clock, phase: 'badge' };
  scenes.set(g, scene);
  if (save.flags[F.observed] === true) {
    let used = false;
    say(g, scene, '유진', [save.flags[F.shared] === true ? '잠깐 쉬었으니 다음 길을 살펴볼까?' : '배지는 잘 챙겼지?\n이제 동료하고도 같이 쉬자.'], undefined, [
      { label: save.flags[F.shared] === true ? '다음 길 이야기' : '동료와 간식 나누기', action: () => {
        if (used || !current(g, scene)) return; used = true; chooseCompanion(g, scene);
      } },
      { label: '도시 출구 안내', action: () => {
        if (used || !current(g, scene)) return; used = true; cityExitGuide(g);
      } },
      { label: '나중에 함께 쉰다', action: () => { used = true; stop(g, scene); } },
    ]);
    return true;
  }
  const revisit = save.flags[F.won] !== true;
  let used = false;
  const observe = (reply: number) => {
    if (used || !current(g, scene)) return;
    used = true;
    save.flags[F.observed] = true; save.flags[F.reply] = reply;
    if (revisit) save.flags[F.revisited] = true;
    g.persist();
    say(g, scene, '유진', [
      reply === 1 ? '큰 걸 줄 줄 알았냐고?\n주머니에 안 들어가면 곤란하잖아.' : '응, 작아도 네가 이겨서 받은 배지잖아.\n가까이서 봐도 꽤 멋지네.',
      '등불에 비추니까 무늬가 더 잘 보여.\n자, 동료하고도 같이 쉬자.',
    ], () => chooseCompanion(g, scene));
  };
  say(g, scene, '유진', [
    revisit ? '이미 가지고 있던 콜배지구나.\n무쇠에 다시 왔으니 축하를 나누자.' : '강석한테서 첫 배지를 받았구나.\n잠깐 가까이서 봐도 돼?',
    '생각보다 작은데?\n센터 앞 등불 아래서 배지를 돌려 본다.',
  ], undefined, [
    { label: '큰 걸 줄 줄 알았어?', action: () => observe(1) },
    { label: '작아도 마음에 들어', action: () => observe(2) },
    { label: '도시 출구 안내', action: () => {
      if (used || !current(g, scene)) return; used = true; cityExitGuide(g);
    } },
    { label: '나중에 같이 본다', action: () => { used = true; stop(g, scene); } },
  ]);
  return true;
}

/** Local light and the selected current object only; no global night or save movement. */
export function oreburghFirstBadgeLayers(c: CanvasRenderingContext2D, g: Engine, images: Images) {
  const scene = scenes.get(g);
  if (!scene || !current(g, scene) || g.dialogue !== scene.dialogue) { if (scene) stop(g, scene); return []; }
  const layers: { depth: number; draw: () => void }[] = [];
  const x = F.x * 16 + 8, y = F.y * 16 + 8;
  layers.push({ depth: F.y - 1, draw: () => {
    c.save(); c.fillStyle = '#e5bc6030'; c.beginPath(); c.ellipse(x, y + 1, 43, 23, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  } });
  layers.push({ depth: F.y + .1, draw: () => {
    c.save(); c.fillStyle = '#535d60'; c.fillRect(x + 5, y - 4, 8, 3); c.fillRect(x + 5, y - 12, 2, 9); c.fillRect(x + 11, y - 12, 2, 9);
    c.fillStyle = '#e6c777'; c.fillRect(x + 7, y - 11, 4, 7); c.fillStyle = '#fff0b8'; c.fillRect(x + 8, y - 10, 2, 4);
    if (scene.phase === 'badge') {
      c.fillStyle = '#625d57'; c.fillRect(x - 11, y - 9, 8, 7); c.fillStyle = '#b9a58a'; c.fillRect(x - 10, y - 8, 6, 5);
      c.fillStyle = '#e7d7b2'; c.fillRect(x - 9, y - 7, 3, 2);
      if (Math.floor((g.clock - scene.start) * 2) % 3 === 0) { c.fillStyle = '#fff0c7'; c.fillRect(x - 6, y - 9, 1, 4); c.fillRect(x - 7, y - 8, 3, 1); }
    }
    c.restore();
  } });
  const mon = scene.partner, point = scene.point;
  if (mon && point && scene.save.party.includes(mon) && mon.hp > 0) {
    const sprite = images['pokemon-' + mon.species];
    if (sprite) layers.push({ depth: point.y - .01, draw: () => {
      const px = point.x * 16 + 8, py = point.y * 16 + 8, bob = Math.sin((g.clock - scene.start) * 3) * .8;
      c.save(); c.fillStyle = '#344b4040'; c.fillRect(px - 8, py + 4, 16, 3);
      c.drawImage(sprite, px - 13, Math.round(py - 23 + bob), 26, 26);
      c.fillStyle = '#e0d6b4'; c.fillRect(px - 5, py + 9, 10, 3); c.fillStyle = '#b78c63'; c.fillRect(px - 2, py + 8, 4, 2); c.restore();
    } });
  }
  return layers;
}
