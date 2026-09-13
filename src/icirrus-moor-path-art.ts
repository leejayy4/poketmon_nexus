import type { GameMap } from './types';

/** Surface hierarchy follows existing collision; every shoulder remains traversable. */
export function paintIcirrusMoorPaths(c:CanvasRenderingContext2D,map:GameMap){
  const walk=(x:number,y:number)=>map.walkable[y]?.[x]==='.';
  const habitat=(x:number,y:number)=>map.terrain?.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);
  const r=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(!walk(x,y)||habitat(x,y))continue;
    const px=x*16,py=y*16,central=x>=25&&x<=31;
    const junction=central&&(y>=34&&y<=37||y>=28&&y<=31||y>=19&&y<=22||y>=12&&y<=15);
    if(central){
      // Three central planks with broad, walkable gravel shoulders; widened at junctions.
      const core=x>=27&&x<=29||junction;
      r(px,py,16,16,core?'#b7a17c':'#9ca38a');
      if(core){r(px,py+4,16,1,'#dfc79a');r(px,py+12,16,1,'#7b725b');r(px+2,py+7,1,1,'#645e50');}
      else {r(px+3,py+6,3,2,'#c0bea0');r(px+11,py+12,2,1,'#788b75');}
    }else if(x<25){
      // Ochre earth winds visually through reed-bank shoulders without narrowing collision.
      const tread=y>=34&&y<=36||y>=19&&y<=21||x>=11&&x<=13;
      r(px,py,16,16,tread?'#b4ad82':'#97a37b');
      if((x+y)%3===0){r(px+3,py+8,5,2,tread?'#d0c69c':'#b4b58b');r(px+10,py+4,2,1,'#84936d');}
    }else{
      // Weathered cross-laid boards identify the waterfowl circuit.
      r(px,py,16,16,'#9caa98');
      const vertical=x>=42&&y>18;
      for(const offset of [3,11]){
        r(px+(vertical?0:offset),py+(vertical?offset:0),vertical?16:1,vertical?1:16,'#ccd0b5');
      }
      r(px+7,py+7,2,2,'#697f74');
    }
    // Flat edge strips only at actual blocked banks, never across a junction or doorway.
    if(map.walkable[y+1]?.[x]==='#')r(px,py+14,16,2,'#586f61');
    if(map.walkable[y-1]?.[x]==='#')r(px,py,16,1,'#d1cda9');
    if(map.walkable[y]?.[x-1]==='#')r(px,py,1,16,'#c3c5a2');
    if(map.walkable[y]?.[x+1]==='#')r(px+15,py,1,16,'#647d6a');
  }
}
