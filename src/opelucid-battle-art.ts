// Nexus adopts the White 2/history-facing side of Opelucid while retaining a
// few clean modern lines. This is project-authored art, not an original tile copy.
export function paintOpelucidBattleArena(c:CanvasRenderingContext2D){
  c.fillStyle='#c9d4cb';c.fillRect(0,0,256,192);
  c.fillStyle='#aebdb1';c.fillRect(0,55,256,137);
  // Stepped stone skyline and the central dragon-gate silhouette.
  for(const [x,w,h] of [[0,39,32],[43,31,43],[78,45,27],[132,34,46],[171,41,35],[217,39,51]] as const){
    c.fillStyle='#687875';c.fillRect(x,55-h,w,h);
    c.fillStyle='#9ba9a0';c.fillRect(x+3,58-h,w-6,h-6);
    c.fillStyle='#d6d3bd';c.fillRect(x+7,63-h,w-14,2);
  }
  c.fillStyle='#596c70';c.fillRect(113,13,30,43);
  c.fillStyle='#c8bea4';c.fillRect(118,18,20,38);
  c.fillStyle='#596c70';c.beginPath();c.moveTo(108,23);c.lineTo(128,5);c.lineTo(148,23);c.lineTo(140,23);c.lineTo(128,14);c.lineTo(116,23);c.fill();
  c.fillStyle='#6f817a';c.fillRect(0,55,256,8);
  // Broad paved plaza with old masonry seams and restrained modern inlays.
  c.fillStyle='#b7b4a4';c.fillRect(0,63,256,129);
  for(let y=70;y<192;y+=18){c.fillStyle='rgba(87,96,91,.20)';c.fillRect(0,y,256,1);for(let x=(y%36?0:16);x<256;x+=34)c.fillRect(x,y-17,1,17);}
  c.fillStyle='#789391';c.fillRect(122,63,12,129);c.fillStyle='#d8ddc7';c.fillRect(126,63,4,129);
  const platform=(x:number,y:number,rx:number,ry:number)=>{
    c.fillStyle='#667570';c.beginPath();c.ellipse(x,y+5,rx,ry,0,0,Math.PI*2);c.fill();
    c.fillStyle='#cfc8ae';c.beginPath();c.ellipse(x,y,rx-2,ry-3,0,0,Math.PI*2);c.fill();
    c.strokeStyle='#f2e8ca';c.lineWidth=2;c.beginPath();c.ellipse(x,y-2,rx-8,ry-7,0,0,Math.PI*2);c.stroke();
  };
  platform(196,87,49,14);platform(59,140,61,20);
}
