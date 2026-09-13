import type { GameMap } from './types';

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const t=(n:number)=>n*16;

function wetlandLamp(c:CanvasRenderingContext2D,x:number,y:number){
  box(c,t(x)+7,t(y)-3,3,22,'#405c58');box(c,t(x)+3,t(y)-7,11,6,'#55746c');box(c,t(x)+5,t(y)-5,7,3,'#f0d691');box(c,t(x)+4,t(y)+18,9,2,'#344b49');
}
function reedLine(c:CanvasRenderingContext2D,x:number,y:number,count:number){
  for(let i=0;i<count;i++){const px=t(x)+i*11,py=t(y)+(i%3)*3;box(c,px+4,py,2,13,'#54785d');box(c,px+7,py+3,2,10,'#78966a');box(c,px+3,py-3,4,4,i%2?'#aa9865':'#c0ad73');}
}
function timberRail(c:CanvasRenderingContext2D,x:number,y:number,w:number){
  box(c,t(x),t(y),t(w),3,'#53645d');box(c,t(x)+3,t(y)-5,t(w)-6,6,'#b49a70');
  for(let px=t(x)+5;px<t(x+w)-5;px+=32)box(c,px,t(y)-8,4,12,'#6d604f');
}

/** BW/BW2-inspired depth cues for Fuchsia's public wetland and care streets. */
export function paintFuchsiaTownDetails(c:CanvasRenderingContext2D){
  // Route 18 arrival reads as a gated western edge before the city opens out.
  timberRail(c,2,16,11);box(c,t(3),t(18)-13,72,8,'#496762');box(c,t(3)+6,t(18)-19,60,7,'#d7c18c');
  for(const [x,y] of [[8,16],[18,16],[28,16],[49,16],[12,31],[29,31],[48,31],[12,49],[31,49]])wetlandLamp(c,x,y);

  // The northeast pond gets a raised public deck, reeds and a low viewing rail.
  timberRail(c,31,16,15);timberRail(c,30,4,17);reedLine(c,32,15,18);reedLine(c,38,5,10);
  box(c,t(33),t(16)-9,38,7,'#4c6662');box(c,t(33)+5,t(16)-15,28,7,'#d8c791');

  // Care yard uses a shaded work canopy and drying rails without covering (15,39).
  box(c,t(17),t(36)-7,t(12),7,'#516762');
  for(let x=17;x<29;x+=2)box(c,t(x),t(36)-14,30,8,(x/2)%2?'#d59b8a':'#efe0bd');
  box(c,t(18),t(39),84,5,'#6a6051');box(c,t(18)+4,t(39)-5,76,6,'#c3a879');
  for(const x of [20,24,28]){box(c,t(x),t(42),22,4,'#4f6b67');box(c,t(x)+4,t(42)-4,14,5,'#9fc7bd');}

  // South wetland outlook is separated from the unopened Route 19 edge.
  timberRail(c,29,49,20);reedLine(c,36,47,17);box(c,t(29),t(51)-5,88,5,'#485f5d');box(c,t(29)+7,t(51)-11,74,7,'#d3bc85');
}

/** Small, map-local motion layered over the static city art each frame. */
export function paintFuchsiaTownMotion(c:CanvasRenderingContext2D,clock:number){
  const sway=Math.sin(clock*2.4)>0?1:-1;

  // Reed heads shift by one pixel while the shared water renderer moves the pond glints.
  for(const [x,y,phase] of [[32,15,0],[35,16,1],[39,5,0],[43,6,1],[37,47,1],[42,48,0],[47,47,1]] as const){
    const dx=(phase?sway:-sway);
    box(c,t(x)+3+dx,t(y)-3,4,3,phase?'#b7a36b':'#c7b678');
  }

  // The care yard drying cloths lift independently instead of reading as fixed signs.
  for(const [x,phase] of [[20,0],[24,1],[28,2]] as const){
    const lift=Math.round(Math.sin(clock*2.8+phase)*1.4);
    box(c,t(x)+4,t(42)-4+lift,14,4,phase===1?'#b8d2c1':'#9fc7bd');
    box(c,t(x)+6,t(42)+lift,10,1,'#e4ddbd');
  }

  // A slow gauge pulse makes the public observation deck legible at a glance.
  const bright=Math.sin(clock*3)>0;
  box(c,t(33)+16,t(16)-13,5,3,bright?'#f1df91':'#9fb99b');
}

/** Route 15 shifts from Fuchsia's damp verge to a brighter fenced grassland. */
export function paintKantoRoute15(c:CanvasRenderingContext2D,map:GameMap){
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=t(x),py=t(y),walk=map.walkable[y]?.[x]==='.';
    const west=x<18,high=y<8&&x>24&&x<44;
    box(c,px,py,16,16,west?'#7e9e78':high?'#8fa96e':'#91aa72');
    if(walk){box(c,px,py,16,16,west?'#b9b796':'#c6bc8f');box(c,px+2,py+4,12,1,west?'#d9d2ae':'#e0d2a5');}
    else if((x*3+y)%4===0){box(c,px+3,py+9,10,6,west?'#50775e':'#5b7c50');box(c,px+5,py+4,7,7,west?'#79a477':'#87a96b');}
  }
  // Low fences clarify the optional grass terraces without closing the main road.
  for(const [x,y,w] of [[7,19,17],[27,7,15],[35,17,18]] as const)timberRail(c,x,y,w);
  reedLine(c,3,19,11);reedLine(c,13,6,8);
  for(const [x,y] of [[7,14],[18,12],[30,10],[43,12],[56,14]])wetlandLamp(c,x,y);
  box(c,t(41),t(18)-8,62,8,'#526a60');box(c,t(41)+5,t(18)-14,52,7,'#dbc88d');
  box(c,t(56),t(19)-7,76,7,'#4d625c');box(c,t(56)+7,t(19)-13,62,7,'#d7bd82');
}

/** Route 14 climbs north through sea wind, sheltered grass and a birdwatch edge. */
export function paintKantoRoute14(c:CanvasRenderingContext2D,map:GameMap){
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=t(x),py=t(y),walk=map.walkable[y]?.[x]==='.';
    const south=y>49,north=y<23;
    box(c,px,py,16,16,south?'#8eaa73':north?'#78946b':'#849e70');
    if(walk){box(c,px,py,16,16,south?'#c8bc8d':north?'#b7ad86':'#c0b58b');box(c,px+2,py+5,12,1,north?'#d2c79e':'#dfd1a5');}
    else if((x+y*3)%4===0){box(c,px+3,py+8,10,7,north?'#4d6d50':'#567650');box(c,px+5,py+3,7,7,north?'#78946c':'#80a16b');}
  }
  // Rails and windbreaks frame the three optional grass loops while the winding spine stays clear.
  timberRail(c,17,9,8);timberRail(c,2,28,8);timberRail(c,18,49,8);
  reedLine(c,18,21,9);reedLine(c,2,39,8);
  for(const [x,y] of [[14,64],[14,53],[14,43],[12,31],[13,19],[14,8]])wetlandLamp(c,x,y);
  box(c,t(18),t(59)-8,86,8,'#52665c');box(c,t(18)+6,t(59)-14,74,7,'#d6bf85');
  box(c,t(19),t(20)-5,86,5,'#48635c');box(c,t(19)+6,t(20)-11,74,7,'#cbb982');
}

/** Route 13 reads as a long coastal fence maze approaching Silence Bridge. */
export function paintKantoRoute13(c:CanvasRenderingContext2D,map:GameMap){
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=t(x),py=t(y),walk=map.walkable[y]?.[x]==='.';
    const east=x>54,north=y<10;
    box(c,px,py,16,16,east?'#789a86':north?'#78936b':'#829a70');
    if(walk){box(c,px,py,16,16,east?'#b8b697':'#c0b58b');box(c,px+2,py+5,12,1,east?'#d7d1b1':'#ddd0a3');}
    else if((x*2+y)%4===0){box(c,px+3,py+8,10,7,'#4f7155');box(c,px+5,py+3,7,7,'#77966b');}
  }
  // Repeated rails make the maze readable; gaps align with each open loop.
  for(const [x,y,w] of [[6,10,15],[19,18,16],[29,6,12],[42,9,17],[49,22,16]] as const)timberRail(c,x,y,w);
  for(const [x,y] of [[8,16],[19,14],[30,11],[39,14],[50,16],[61,15],[68,16]])wetlandLamp(c,x,y);
  reedLine(c,56,6,13);reedLine(c,60,23,9);
  box(c,t(55),t(8)-7,104,7,'#4b6663');box(c,t(55)+7,t(8)-13,90,7,'#d1c08a');
}

/** Route 12 is a long raised boardwalk over Kanto's eastern coast. */
export function paintKantoRoute12(c:CanvasRenderingContext2D,map:GameMap){
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=t(x),py=t(y),walk=map.walkable[y]?.[x]==='.';
    if(walk){box(c,px,py,16,16,y<18?'#b9b394':'#b6a987');box(c,px+1,py+4,14,1,'#ddd0a8');box(c,px+2,py+12,12,1,'#897e6a');}
    else{box(c,px,py,16,16,'#609bad');box(c,px+2+(y%2)*4,py+6,10,1,'#a7ccd0');box(c,px+5,py+12,8,1,'#79b3bd');}
  }
  for(const [x,y,w] of [[18,10,10],[2,30,9],[19,52,9],[3,68,10]] as const)timberRail(c,x,y,w);
  for(const [x,y] of [[16,8],[15,20],[14,33],[16,45],[17,58],[15,72],[16,82]])wetlandLamp(c,x,y);
  reedLine(c,3,43,9);reedLine(c,20,67,8);
  box(c,t(20),t(52)-8,104,8,'#4d6662');box(c,t(20)+7,t(52)-14,90,7,'#d4c18a');
}

/** Room-specific material bands layered over the shared Fuchsia interiors. */
export function paintFuchsiaInteriorDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(!map.id.startsWith('tour_fuchsia_'))return;
  const width=map.width*16;
  if(map.id==='tour_fuchsia_center'){
    box(c,34,18,width-68,5,'#477269');box(c,38,23,width-76,3,'#b7d3bd');reedLine(c,4,3,Math.max(8,map.width-9));return;
  }
  if(map.id==='tour_fuchsia_hall'){
    box(c,32,27,width-64,7,'#476a67');box(c,37,34,width-74,3,'#d7c48f');
    for(let x=54;x<width-70;x+=68){box(c,x,44,44,18,'#526d69');box(c,x+4,48,36,10,'#86b4a3');box(c,x+9,51,26,2,'#d8e1c9');}return;
  }
  const accent=map.id==='tour_fuchsia_mart'?'#668b86':'#7b9270';box(c,36,20,width-72,16,accent);box(c,42,23,width-84,7,'#e4d6ae');
  if(map.id!=='tour_fuchsia_mart')reedLine(c,4,3,Math.max(7,map.width-9));
}
