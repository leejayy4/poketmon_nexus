import type { GameMap } from './types';

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const t=(n:number)=>n*16;
function blueCliff(c:CanvasRenderingContext2D,x:number,y:number,w:number){
  box(c,t(x),t(y),t(w),7,'#334f5c');box(c,t(x)+5,t(y)-7,t(w)-10,8,'#6d8990');
  for(let px=t(x)+12;px<t(x+w)-10;px+=28){box(c,px,t(y)-11,16,5,'#a8b9ad');box(c,px+4,t(y)-15,9,5,'#738e92');}
}
function dragonLamp(c:CanvasRenderingContext2D,x:number,y:number){
  box(c,t(x)+7,t(y)-4,3,24,'#354f55');box(c,t(x)+3,t(y)-8,11,6,'#526f72');box(c,t(x)+5,t(y)-6,7,3,'#a9d8d1');box(c,t(x)+4,t(y)+18,9,2,'#2f4449');
}

/** BW/BW2-inspired height bands and cold mountain accents for Blackthorn. */
export function paintBlackthornTownDetails(c:CanvasRenderingContext2D){
  blueCliff(c,34,5,17);blueCliff(c,32,39,19);blueCliff(c,34,50,17);
  for(const [x,y] of [[4,14],[11,14],[20,14],[31,14],[43,14],[12,31],[29,31],[46,31]])dragonLamp(c,x,y);
  // Frosted western arrival and a narrow raised bridge toward the northern den.
  box(c,t(2),t(11)-5,t(12),5,'#728b90');box(c,t(3),t(11)-10,t(10),6,'#d8e8df');
  for(let x=3;x<15;x+=2){box(c,t(x)+3,t(34)+(x%4)*4,10,3,'#e5eee7');box(c,t(x)+6,t(34)-4+(x%3)*5,5,5,'#9fb7ae');}
  box(c,t(39),t(3),t(7),5,'#435d63');box(c,t(40),t(3)-6,t(5),7,'#b8c8b8');
  // Water-training terrace and south outlook stay legible without covering props.
  box(c,t(32),t(34)-5,t(18),5,'#3e5d63');box(c,t(33),t(34)-11,t(16),7,'#a9c8bd');
  box(c,t(31),t(51)-5,t(19),5,'#394e55');box(c,t(32),t(51)-11,t(17),7,'#c0b68d');
}

/** Rock strata, dry bridges and shrine depth for the Dragon's Den exterior map. */
export function paintDragonsDenDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_johto_dragons_den')return;
  blueCliff(c,7,9,42);blueCliff(c,8,37,40);
  for(const [x,y,w] of [[10,22,12],[34,22,12],[20,20,16]]){
    box(c,t(x),t(y)+5,t(w),5,'#394f54');box(c,t(x)+4,t(y),t(w)-8,6,'#a89b78');
    for(let px=t(x)+12;px<t(x+w)-8;px+=24)box(c,px,t(y)-4,4,12,'#596568');
  }
  for(const [x,y] of [[8,29],[46,29],[17,33],[38,33],[25,12],[32,12]])dragonLamp(c,x,y);
  box(c,t(24),t(42),t(9),5,'#50656a');box(c,t(25),t(42)-6,t(7),7,'#d6e3d8');
}

/** Cold-stone material bands for Blackthorn rooms and the den shrine. */
export function paintBlackthornInteriorDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(!map.id.startsWith('tour_blackthorn_')&&map.id!=='tour_johto_dragons_den_shrine')return;
  const width=map.width*16,shrine=map.id.includes('hall')||map.id.endsWith('den_shrine');
  box(c,32,21,width-64,6,shrine?'#45616b':'#526d70');box(c,38,27,width-76,3,shrine?'#a9c5bc':'#d7dbc7');
  for(let x=56;x<width-64;x+=64){box(c,x,45,36,14,'#4a6268');box(c,x+4,49,28,7,shrine?'#78969a':'#9ba98e');box(c,x+9,51,18,2,'#d9d7b9');}
  if(shrine){box(c,width/2-32,67,64,5,'#354d56');box(c,width/2-24,61,48,7,'#8ea8a3');}
}
