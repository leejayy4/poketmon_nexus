import type { GameMap } from './types';

/** Project reconstruction: relief follows collision, not an independent painted path. */
export function paintSeafoamChamberRelief(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_kanto_seafoam_b1f'&&map.id!=='tour_kanto_seafoam_b2f')return;
  const floor=(x:number,y:number)=>map.walkable[y]?.[x]==='.';
  const occupied=new Set([...map.props,...map.warps].map(p=>`${p.x},${p.y}`));
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=1;y<map.height-1;y++)for(let x=1;x<map.width-1;x++){
    if(occupied.has(`${x},${y}`))continue;
    // The dynamic boulder painter owns its complete pocket, before and after pushing.
    if(map.id==='tour_kanto_seafoam_b2f'&&x>=15&&x<=17&&y>=20&&y<=22)continue;
    const px=x*16,py=y*16;
    if(floor(x,y)){
      // Preserve the exact encounter-ground material supplied by the base painter.
      if(map.terrain?.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h))continue;
      if(!floor(x,y-1)&&!occupied.has(`${x},${y-1}`))rect(px,py,16,3,'#607c91');
      if(!floor(x-1,y)&&!occupied.has(`${x-1},${y}`))rect(px,py+3,2,13,'#7895a4');
      if(!floor(x+1,y)&&!occupied.has(`${x+1},${y}`))rect(px+14,py+3,2,13,'#d4e3df');
      // Fine, flush seams distinguish the broad chambers without implying ice sliding.
      if(floor(x-2,y)&&floor(x+2,y)&&floor(x,y-2)&&floor(x,y+2)&&(x+2*y)%7===0){
        rect(px+2,py+11,7,1,'#8ba5b0');rect(px+9,py+8,1,4,'#8ba5b0');
      }
      continue;
    }
    // Retain the enclosed B1F water instead of turning its bank into a rock wall.
    if(map.id==='tour_kanto_seafoam_b1f'&&x>=15&&x<=20&&y>=15&&y<=22)continue;
    if(floor(x,y+1)){
      rect(px,py,16,4,'#d4e8e5');rect(px,py+4,16,8,'#82a8bb');
      rect(px+3,py+5,2,7,'#b8d8df');rect(px+11,py+5,3,9,'#547c96');
      rect(px,py+14,16,2,'#2e4b65');
    }else if(floor(x-1,y)||floor(x+1,y)){
      const edge=floor(x-1,y)?0:12;
      rect(px+edge,py,4,16,'#a6cbd5');rect(px+edge+1,py+2,1,11,'#e0ede6');
    }else if(floor(x,y-1)){
      rect(px,py,16,3,'#d4e8e5');rect(px,py+3,16,3,'#65879e');
    }
  }
}
