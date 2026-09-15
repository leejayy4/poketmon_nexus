import type { GameMap } from './types';

const TILE=16;

function stoneCourse(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,base:string,joint:string,offset=0){
  c.fillStyle=base;c.fillRect(x,y,w,h);
  c.fillStyle=joint;
  for(let py=y+8;py<y+h;py+=12){
    c.fillRect(x,py,w,1);
    for(let px=x+((py/TILE+offset)%2?12:4);px<x+w;px+=24)c.fillRect(px,py-8,1,8);
  }
}

// Project-authored BW/BW2-style field layer. Every shape sits inside an
// existing feature rectangle, so it changes neither collision nor travel.
export function paintOpelucidField(c:CanvasRenderingContext2D,map:GameMap,clock:number){
  if(map.id!=='tour_opelucid')return;

  // W2/history-facing old quarter: irregular courses and low resting walls.
  stoneCourse(c,5*TILE,17*TILE,14*TILE,7*TILE,'#a99b7f','rgba(86,76,64,.30)');
  c.fillStyle='#6e685d';c.fillRect(5*TILE,17*TILE,14*TILE,4);
  c.fillStyle='#ddd0ac';c.fillRect(5*TILE,17*TILE,14*TILE,2);
  for(const [tx,ty] of [[6,18],[10,21],[15,18],[17,22]]){
    c.fillStyle='#7e7565';c.fillRect(tx*TILE,ty*TILE,11,7);
    c.fillStyle='#c8b996';c.fillRect(tx*TILE+2,ty*TILE+1,7,3);
  }

  // Newer east garden: regular paving, contained planters and restrained light.
  stoneCourse(c,35*TILE,18*TILE,18*TILE,7*TILE,'#c7c5b4','rgba(103,112,105,.22)',1);
  for(const [tx,ty] of [[36,19],[48,19],[38,23],[50,23]]){
    c.fillStyle='#59695e';c.fillRect(tx*TILE,ty*TILE,28,12);
    c.fillStyle='#9bb073';c.fillRect(tx*TILE+2,ty*TILE+2,24,7);
    c.fillStyle='#d4d9a5';c.fillRect(tx*TILE+5,ty*TILE+3,5,3);
  }
  const glow=.18+Math.sin(clock*2.2)*.04;
  for(const tx of [35,52]){
    c.fillStyle=`rgba(181,222,214,${glow})`;c.fillRect(tx*TILE-5,18*TILE-5,18,18);
    c.fillStyle='#526d6c';c.fillRect(tx*TILE,18*TILE,4,14);
    c.fillStyle='#d9ece0';c.fillRect(tx*TILE-2,18*TILE-2,8,5);
  }

  // Central dragon plaza: paired coils show two eras sharing one civic space.
  stoneCourse(c,20*TILE,7*TILE,10*TILE,8*TILE,'#b9ad91','rgba(84,78,69,.22)');
  c.strokeStyle='#5e786f';c.lineWidth=5;c.beginPath();
  c.arc(23*TILE,11*TILE,25,Math.PI*.25,Math.PI*1.72);c.stroke();
  c.strokeStyle='#8b6f5d';c.beginPath();
  c.arc(27*TILE,11*TILE,25,Math.PI*1.25,Math.PI*.72);c.stroke();
  c.fillStyle='#e3d4aa';c.fillRect(24*TILE+4,10*TILE+4,24,24);
  c.fillStyle='#61776d';c.fillRect(24*TILE+9,10*TILE+9,14,14);
  c.fillStyle='#cfbd91';c.fillRect(24*TILE+13,10*TILE+13,6,6);

  // Shared-height yard: broad steps and a parallel ramp meet at one landing.
  stoneCourse(c,21*TILE,35*TILE,14*TILE,8*TILE,'#918d82','rgba(65,66,64,.28)');
  for(let i=0;i<5;i++){
    c.fillStyle=i%2?'#c5bda8':'#b2aa98';
    c.fillRect((22+i)*TILE,(36+i)*TILE,6*TILE,9);
  }
  c.fillStyle='#d6d0bb';c.beginPath();c.moveTo(29*TILE,36*TILE);c.lineTo(34*TILE,40*TILE);c.lineTo(34*TILE,42*TILE);c.lineTo(29*TILE,38*TILE);c.fill();

  // The east arch announces Route 11; the west stone remains a subdued legacy
  // save-return marker and is deliberately not labelled as an original route.
  for(const [tx,color] of [[45,'#66776f'],[5,'#756f65']] as const){
    const x=tx*TILE,y=46*TILE,w=14*TILE;
    c.fillStyle=color;c.fillRect(x,y,w,6);c.fillRect(x,y,7,8*TILE);c.fillRect(x+w-7,y,7,8*TILE);
    c.fillStyle='#d6c9a7';c.fillRect(x+2,y+2,w-4,2);
  }
  c.fillStyle='#b7d9cd';c.fillRect(49*TILE,47*TILE,6*TILE,3);
  c.fillStyle='#4f6967';c.fillRect(51*TILE,47*TILE+4,2*TILE,8);
}
