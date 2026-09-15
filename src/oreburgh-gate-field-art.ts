import type { GameMap } from './types';

const T=16;
const blocked=(map:GameMap,x:number,y:number)=>map.walkable[y]?.[x]==='#';

function rockFace(c:CanvasRenderingContext2D,map:GameMap,x:number,y:number,ore=false){
  if(!blocked(map,x,y))return;
  c.fillStyle=(x+y)%2?'#55595a':'#626260';c.fillRect(x*T,y*T,T,T);
  c.fillStyle='#79736a';c.fillRect(x*T+2,y*T+3,11,3);c.fillRect(x*T+6,y*T+10,8,2);
  if(ore){c.fillStyle=(x+y)%3?'#ad8755':'#708f96';c.fillRect(x*T+8,y*T+2,2,7);c.fillRect(x*T+5,y*T+7,5,2);}
}

/** Paints the Gate's landmarks without opening or closing any walkable cell. */
export function paintOreburghGateField(c:CanvasRenderingContext2D,map:GameMap,clock:number){
  if(map.id!=='tour_oreburgh_gate_1f')return;
  // West sediment and east ore faces occupy only the existing blocked features.
  for(let y=5;y<15;y++)for(let x=4;x<14;x++)rockFace(c,map,x,y,false);
  for(let y=5;y<13;y++)for(let x=31;x<43;x++)rockFace(c,map,x,y,true);
  // The lower-floor boundary is visibly sealed and remains a non-warp prop.
  for(let y=33;y<38;y++)for(let x=16;x<32;x++)rockFace(c,map,x,y,false);
  const sx=20*T,sy=26*T;
  if(blocked(map,20,26)){
    c.fillStyle='#343a3b';c.fillRect(sx-4,sy-5,24,21);
    c.fillStyle='#8a8271';c.fillRect(sx-1,sy+5,18,3);c.fillRect(sx+2,sy+10,14,3);
    c.fillStyle='#c4a967';c.fillRect(sx-3,sy-3,22,3);
  }
  // Warm wall lamps identify the safe east-west transit line.
  const glow=.12+Math.sin(clock*2.1)*.025;
  for(const [x,y] of [[6,17],[18,17],[32,17],[41,17]] as const){
    if(!blocked(map,x,y))continue;
    c.fillStyle=`rgba(232,202,120,${glow})`;c.fillRect(x*T-8,y*T-8,32,32);
    c.fillStyle='#4a4b47';c.fillRect(x*T+6,y*T+4,4,10);
    c.fillStyle='#e3c16e';c.fillRect(x*T+4,y*T+2,8,5);
  }
  // Daylight washes just inside both real 1F exits; it never changes collision.
  const west=c.createLinearGradient(0,0,64,0);west.addColorStop(0,'rgba(223,233,190,.52)');west.addColorStop(1,'rgba(223,233,190,0)');c.fillStyle=west;c.fillRect(0,18*T,64,6*T);
  const east=c.createLinearGradient(48*T,0,44*T,0);east.addColorStop(0,'rgba(223,233,190,.48)');east.addColorStop(1,'rgba(223,233,190,0)');c.fillStyle=east;c.fillRect(44*T,18*T,4*T,7*T);
}
