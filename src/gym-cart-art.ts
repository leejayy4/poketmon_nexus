/** Small tabletop models; all pixels remain inside the existing stone blocks. */
export interface GymCartView {
  stage: 0 | 1 | 2;
  right: boolean;
  progress: number | null;
  targetRight: boolean;
}

const INK = '#465259';
const METAL = '#8d9b98';
const LIGHT = '#d5d2b5';
const STRIPE = '#bd935b';
const DOT = '#609a91';

function pixel(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}

function patternedOre(c: CanvasRenderingContext2D, x: number, y: number, dotted: boolean) {
  pixel(c, x, y, 7, 6, INK);
  pixel(c, x + 1, y, 5, 5, dotted ? DOT : STRIPE);
  if (dotted) {
    pixel(c, x + 2, y + 1, 1, 1, LIGHT);
    pixel(c, x + 4, y + 3, 1, 1, LIGHT);
  } else {
    pixel(c, x + 1, y + 1, 5, 1, LIGHT);
    pixel(c, x + 1, y + 3, 5, 1, LIGHT);
  }
}

function lamp(c: CanvasRenderingContext2D, x: number, y: number, on: boolean) {
  pixel(c, x, y, 5, 4, INK);
  pixel(c, x + 1, y + 1, 3, 2, on ? '#e4ce74' : '#737d74');
  if (on) pixel(c, x + 1, y + 1, 1, 1, '#fff1ba');
}

function rail(c: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, selected: boolean) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(x1 + (x2 - x1) * i / steps);
    const y = Math.round(y1 + (y2 - y1) * i / steps);
    if (i % 4 === 0) pixel(c, x - 2, y - 1, 5, 4, '#746957');
    pixel(c, x - 1, y, 3, 2, INK);
    pixel(c, x, y, 1, 1, selected ? LIGHT : METAL);
  }
}

/** Left block: tiles (4..6, 6..7), world pixels [64,112) × [96,128). */
export function paintGymCart(c: CanvasRenderingContext2D, view: GymCartView): void {
  c.save();
  try {
    // Both patterns are visible on the docks even while the model is idle.
    for (const [x, dotted] of [[67, false], [96, true]] as const) {
      pixel(c, x, 97, 13, 8, INK);
      pixel(c, x + 1, 98, 11, 6, '#b1b6a5');
      patternedOre(c, x + 3, 98, dotted);
    }
    const travelling = view.progress !== null;
    const direction = travelling ? view.targetRight : view.right;
    rail(c, 88, 114, 73, 107, !direction);
    rail(c, 88, 114, 103, 107, direction);
    rail(c, 88, 118, 88, 114, true);

    // A latched target drives the cart, so moving the lever cannot reroute it.
    const progress = Number.isFinite(view.progress) ? Math.max(0, Math.min(1, view.progress!)) : 0;
    const travel = Math.min(1, progress / .75);
    const first = Math.min(1, travel / .3);
    const branch = Math.max(0, (travel - .3) / .7);
    const x = Math.round(88 + (direction ? 15 : -15) * branch);
    const y = Math.round(118 - 4 * first - 7 * branch);
    pixel(c, x - 4, y - 1, 9, 2, '#59625e');
    pixel(c, x - 3, y, 2, 2, INK);
    pixel(c, x + 2, y, 2, 2, INK);
    pixel(c, x - 5, y - 7, 11, 6, INK);
    pixel(c, x - 4, y - 6, 9, 4, METAL);
    pixel(c, x - 4, y - 2, 9, 1, '#bfc5b2');
    if (view.stage < 2) patternedOre(c, x - 3, y - 8, view.stage === 1);
    // The final quarter of the animation rests at the destination dock.
    if (travelling && progress >= .75) {
      const correct = view.targetRight === (view.stage === 1);
      pixel(c, x - 2, 96, 5, 1, correct ? '#e4ce74' : '#b87960');
    }

    // Controls line up with the two existing front-facing interaction tiles.
    pixel(c, 81, 121, 14, 6, INK);
    pixel(c, 82, 122, 12, 4, '#929b8b');
    pixel(c, 87, 122, 3, 4, '#536465');
    pixel(c, view.right ? 89 : 84, 121, 4, 2, LIGHT);
    pixel(c, view.right ? 89 : 86, 122, 1, 2, LIGHT);
    pixel(c, 99, 120, 10, 7, INK);
    pixel(c, 100, 121, 8, 5, METAL);
    pixel(c, 102, travelling ? 123 : 122, 4, 3, travelling ? '#8a8062' : STRIPE);
    if (!travelling) pixel(c, 102, 122, 3, 1, '#edcd8e');
    lamp(c, 67, 122, view.stage >= 1);
    lamp(c, 74, 122, view.stage === 2);
  } finally {
    c.restore();
  }
}

/** Right block: tiles (10..12, 9..10), world pixels [160,208) × [144,176). */
export function paintGymCartSamples(c: CanvasRenderingContext2D, view: GymCartView): void {
  c.save();
  try {
    for (const [index, x] of [166, 187].entries()) {
      const selected = view.stage === index;
      pixel(c, x - 1, 146, 17, 17, INK);
      pixel(c, x, 147, 15, 15, selected ? '#d5cba5' : '#afb4a2');
      pixel(c, x + 2, 149, 11, 11, '#8b9488');
      pixel(c, x + 4, 150, 7, 3, '#59615d');
      patternedOre(c, x + 4, 151, index === 1);
      pixel(c, x + 2, 160, 11, 1, selected ? LIGHT : METAL);
      lamp(c, x + 5, 166, view.stage > index);
    }
    // A small slanted information plate marks the central front interaction.
    pixel(c, 179, 170, 11, 4, INK);
    pixel(c, 180, 170, 9, 2, LIGHT);
    pixel(c, 181, 170, 2, 1, '#7e887d');
    pixel(c, 185, 170, 3, 1, '#7e887d');
  } finally {
    c.restore();
  }
}
