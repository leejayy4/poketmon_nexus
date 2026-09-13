import type { GameMap } from './types';
const r=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};

/** Side-facing entrances follow existing warp cells and preserve the open road. */
export function paintCoronet211Entrances(c:CanvasRenderingContext2D,map:GameMap){
  const inside=map.id==='tour_coronet_211_pass';
  if(!inside&&map.id!=='tour_sinnoh_route_211_west'&&map.id!=='tour_sinnoh_route_211_east')return;
  c.save();
  for(const warp of map.warps){
    if(!inside&&warp.to!=='tour_coronet_211_pass')continue;
    if(warp.entry!=='left'&&warp.entry!=='right')continue;
    const inward=warp.entry==='left'?1:-1;
    // Four columns of daylight in the cave / shadow on the outdoor approach.
    // Every painted floor cell must already be walkable.
    for(let step=0;step<4;step++)for(let dy=-1;dy<=1;dy++){
      const x=warp.x+inward*step,y=warp.y+dy;
      if(map.walkable[y]?.[x]!=='.')continue;
      const colors=inside?['#e0d8b7','#cdcbb0','#b7baa2','#a0ae9a']:['#556963','#728172','#929b7f','#b2ae8e'];
      r(c,x*16,y*16,16,16,colors[step]);
      if(dy===0)r(c,x*16+3,y*16+12,10,1,inside?'#f0e5c2':'#c5c5a4');
    }
    // Rock lips occupy only the first existing blocked tile on each side.
    for(const side of [-1,1])for(let offset=1;offset<=4;offset++){
      const y=warp.y+side*offset,x=warp.x;
      if(!map.walkable[y]?.[x])break;
      if(map.walkable[y][x]!== '#')continue;
      r(c,x*16,y*16,16,16,'#4b6159');
      r(c,x*16+2,y*16+2,12,5,'#a2ad8e');
      r(c,x*16+3,y*16+8,10,6,'#768b77');
      break;
    }
    // Direction chevron is flat on the real warp, not a second doorway.
    if(map.walkable[warp.y]?.[warp.x]==='.'){
      const x=warp.x*16,y=warp.y*16,tip=warp.entry==='left'?4:11;
      r(c,x+tip,y+7,2,2,'#ede0b6');
      r(c,x+tip+inward*2,y+5,2,6,'#ede0b6');
    }
  }
  c.restore();
}
