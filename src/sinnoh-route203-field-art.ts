import type { GameMap } from './types';

const T=16;
const blocked=(map:GameMap,x:number,y:number)=>map.walkable[y]?.[x]==='#';

/** Adds Route 203's Platinum landmarks without changing terrain, collision or warps. */
export function paintSinnohRoute203Field(c:CanvasRenderingContext2D,map:GameMap,clock:number){
  if(map.id!=='tour_sinnoh_route_203')return;

  // Reeds and bank stones make the small western pond readable from the lower path.
  for(let x=3;x<14;x++){
    const y=(x%3===0?18:19)*T;
    c.fillStyle='#6d8450';c.fillRect(x*T+4,y+4,2,10);
    c.fillStyle='#a6bd72';c.fillRect(x*T+2,y+4,6,2);
    if(x%2===0){c.fillStyle='#a9a27d';c.fillRect(x*T+9,y+10,6,4);c.fillStyle='#c9c29a';c.fillRect(x*T+10,y+9,4,2);}
  }
  const shimmer=.18+Math.sin(clock*2.4)*.04;
  c.fillStyle=`rgba(220,239,216,${shimmer})`;c.fillRect(5*T,21*T,6*T,2);

  // The eastern rock feature is a two-level ledge; only existing blocked cells receive faces.
  for(let y=5;y<13;y++)for(let x=34;x<43;x++){
    if(!blocked(map,x,y))continue;
    c.fillStyle=(x+y)%2?'#74755e':'#818068';c.fillRect(x*T,y*T,T,T);
    c.fillStyle='#a9a47d';c.fillRect(x*T+2,y*T+2,12,3);
    c.fillStyle='#5f654f';c.fillRect(x*T+4,y*T+11,12,3);
  }

  // Stone stair treads mark the climb between the west pond level and the upper grass belt.
  for(const [x,y,w] of [[25,10,6],[25,14,6],[42,14,6]] as const){
    for(let j=0;j<3;j++){
      const py=(y+j)*T;
      c.fillStyle='#8d8973';c.fillRect(x*T,py,w*T,13);
      c.fillStyle='#c8bea0';c.fillRect(x*T,py,w*T,3);
      c.fillStyle='#666552';c.fillRect(x*T,py+13,w*T,3);
    }
  }

  // A low stone lip along the upper route communicates height while preserving every open cell.
  for(let x=45;x<63;x++)if(blocked(map,x,8)){
    c.fillStyle='#77775f';c.fillRect(x*T,8*T,T,T);
    c.fillStyle='#bbb28e';c.fillRect(x*T,8*T,T,3);
  }
}
