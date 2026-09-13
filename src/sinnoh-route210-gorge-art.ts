import type { GameMap } from './types';

/** Route 210's canyon/bridge motif; project coordinates, no copied assets.
 * Water and rail supports occupy blocked cells only. The deck retains the
 * whole existing six-tile crossing, including old save and navigation cells.
 */
export function paintRoute210Gorge(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_sinnoh_route_210_north')return;
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{
    c.fillStyle=color;c.fillRect(x,y,w,h);
  };
  c.save();
  for(let y=19;y<=37;y++)for(let x=24;x<=32;x++){
    if(map.walkable[y]?.[x]!=='#')continue;
    const px=x*16,py=y*16;
    fill(px,py,16,16,'#344f59');
    fill(px+2,py,12,16,'#477785');
    if((x+y)%3===0)fill(px+4,py+5,7,1,'#8eafb0');
    if(x===24||x===32){
      fill(px+(x===24?0:12),py,4,16,'#65776b');
      fill(px+(x===24?0:14),py,2,16,'#a4ad91');
    }
  }
  for(let y=25;y<=30;y++)for(let x=23;x<=33;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    const px=x*16,py=y*16;
    fill(px,py,16,16,'#826c51');
    fill(px+1,py+1,14,14,(x+y)%2?'#bba27a':'#c4ac84');
    fill(px+7,py+1,1,14,'#9b835f');
    fill(px+2,py+3,2,2,'#6e685a');
    fill(px+12,py+11,2,2,'#6e685a');
  }
  // Rails sit beyond the walkable deck, never across a traversable tile.
  for(const y of [24,31])for(let x=23;x<=33;x++){
    if(map.walkable[y]?.[x]!=='#')continue;
    const px=x*16,py=y*16;
    fill(px,py+6,16,3,'#6b5946');
    fill(px,py+5,16,1,'#d3bd95');
    if(x%2===1){fill(px+6,py+2,4,12,'#7f6b51');fill(px+6,py+2,4,2,'#d3bd95');}
  }
  c.restore();
}
