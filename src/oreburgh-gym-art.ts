/** The indoor stone court keeps the existing battle actors and HUD coordinates. */
export function paintOreburghGymBattleArena(c: CanvasRenderingContext2D): void {
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    c.fillStyle = color;
    c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  // Integer scanlines keep the platforms crisp at the native DS resolution.
  const oval = (x: number, y: number, rx: number, ry: number, color: string) => {
    for (let row = -ry; row <= ry; row++) {
      const half = Math.floor(rx * Math.sqrt(Math.max(0, 1 - row * row / (ry * ry))));
      rect(x - half, y + row, half * 2 + 1, 1, color);
    }
  };
  c.save();
  rect(0, 0, 256, 192, '#a9a393');
  rect(0, 0, 256, 62, '#8d8f86');
  for (let row = 0; row < 4; row++) {
    const y = row * 15;
    rect(0, y + 13, 256, 1, '#7d827a');
    rect(0, y + 14, 256, 1, '#9b9d91');
    for (let x = (row % 2 ? -21 : 0); x < 256; x += 43) {
      rect(x, y, 1, 13, '#7d827a');
      rect(x + 3, y + 2, 36, 1, '#989b8f');
    }
  }
  // Edge columns frame the room without adding detail behind either HP panel.
  for (const x of [0, 242]) {
    rect(x, 0, 14, 61, '#7e857e');
    rect(x + 3, 0, 8, 58, '#a4a797');
    rect(x + 4, 0, 2, 55, '#b4b5a3');
    rect(x, 53, 14, 5, '#90998b');
    rect(x, 58, 14, 4, '#737d75');
  }
  rect(14, 58, 228, 3, '#afb09d');
  rect(0, 61, 256, 3, '#727e76');
  rect(0, 64, 256, 128, '#aaa58f');
  for (const y of [73, 87, 107, 134, 169]) {
    rect(0, y, 256, 1, '#969782');
    rect(0, y + 1, 256, 1, '#b9b29a');
  }
  for (let y = 65; y < 192; y++) {
    const spread = (y - 64) * .18;
    for (const x of [29 - spread, 94 - spread / 3, 160 + spread / 3, 225 + spread]) {
      rect(x, y, 1, 1, '#9e9f89');
    }
  }
  // Worn ochre court edges distinguish the gym from the wild cave floor.
  for (let y = 71; y < 143; y++) {
    const x = 116 - Math.floor((y - 71) * .52);
    rect(x, y, 2, 1, '#c2b58e');
    rect(x + 111, y, 2, 1, '#c2b58e');
  }
  for (const [x, y, rx, ry] of [[196, 84, 53, 12], [59, 133, 70, 19]] as const) {
    oval(x, y + 3, rx, ry, '#788477');
    oval(x, y, rx, ry, '#909785');
    oval(x, y - 1, rx - 3, ry - 3, '#c3b894');
    oval(x, y - 2, rx - 7, ry - 5, '#b7ae91');
    rect(x - rx + 16, y - 3, rx - 19, 1, '#d0c5a4');
    rect(x + 10, y + 4, rx - 21, 1, '#9c9f87');
    rect(x - 13, y + 2, 9, 1, '#aaa98d');
  }
  c.restore();
}
