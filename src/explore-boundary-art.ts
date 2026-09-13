import type { GameMap } from './types';
import type { TourBuilding,TourFeature } from './explore-world';
import { paintGroveTree } from './explore-tree-art';

type Footprint={x:number;y:number;w:number;h:number};
const fill=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** Terrain fallback for authored collision maps without a town layout.
 * It reveals existing barriers; it never adds collision or invents a water route.
 * Buildings, scenery and interactive props keep their own rendering footprint.
 */
export function paintUnmappedBoundaries(c:CanvasRenderingContext2D,map:GameMap,theme:string,treeImage:CanvasImageSource,buildings:TourBuilding[],features:TourFeature[]){
  const occupied=new Set<string>();
  const reserve=(r:Footprint)=>{
    for(let y=Math.max(0,r.y);y<Math.min(map.height,r.y+r.h);y++)
      for(let x=Math.max(0,r.x);x<Math.min(map.width,r.x+r.w);x++)occupied.add(`${x},${y}`);
  };
  for(const r of [...buildings,...features])reserve(r);
  for(const p of [...map.props,...map.warps,...map.npcs])occupied.add(`${p.x},${p.y}`);
  const barrier=(x:number,y:number)=>map.walkable[y]?.[x]==='#'&&!occupied.has(`${x},${y}`);
  const open=(x:number,y:number)=>map.walkable[y]?.[x]==='.';
  const cave=theme==='cave',snow=theme==='snow',sand=theme==='coast'||theme==='desert';
  const wooded=['forest','village','flowers','water'].includes(theme);
  const top=wooded?'#668957':cave?'#536567':snow?'#d3e1d8':sand?'#c1b084':'#87947b';
  const face=wooded?'#3e6749':cave?'#34494e':snow?'#80969d':sand?'#8f805f':'#586d64';
  c.save();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(!barrier(x,y))continue;
    const px=x*16,py=y*16;
    fill(c,px,py,16,16,top);
    // Contours follow the actual walkable edge, rather than a visible tile grid.
    if(open(x,y+1)){
      fill(c,px,py+4,16,12,face);
      fill(c,px,py+3,16,2,snow?'#eff4e6':sand?'#e0cf9e':'#aeb79a');
      fill(c,px+3+(x%3),py+8,8,2,top);
      fill(c,px,py+15,16,1,cave?'#263d43':'#3d5548');
    }
    if(open(x-1,y))fill(c,px,py,2,16,face);
    if(open(x+1,y))fill(c,px+14,py,2,16,face);
    if(open(x,y-1))fill(c,px,py,16,2,face);
    if((x*7+y*3)%5===0)fill(c,px+5,py+6,5,1,snow?'#eff4e6':sand?'#d9c797':'#98a582');
  }
  if(wooded)for(let y=1;y<map.height-1;y+=2)for(let x=0;x<map.width-1;x+=2){
    // The entire canopy and trunk must fit in blocked terrain, away from doors.
    let fits=true;
    for(let dy=-1;dy<2;dy++)for(let dx=0;dx<2;dx++)if(!barrier(x+dx,y+dy))fits=false;
    if(fits)paintGroveTree(c,treeImage,{x:x*16,y:y*16-16,depth:y+1.5});
  }
  c.restore();
}
