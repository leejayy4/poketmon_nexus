import type { GameMap } from './types';

const bounds={x:17,y:5,w:9,h:8};
/** The same mask drives the basin and its animation; neither paints across a dry tile. */
export function paintIcirrusPond(c:CanvasRenderingContext2D,map:GameMap,clock?:number,compared=false){
  const {x,y,w,h}=bounds;
  const water=(tx:number,ty:number)=>tx>=x&&tx<x+w&&ty>=y&&ty<y+h&&map.walkable[ty]?.[tx]!=='.';
  const r=(px:number,py:number,ww:number,hh:number,color:string)=>{c.fillStyle=color;c.fillRect(px,py,ww,hh);};
  c.save();
  try{
    for(let ty=y;ty<y+h;ty++)for(let tx=x;tx<x+w;tx++){
      if(!water(tx,ty))continue;
      const px=tx*16,py=ty*16;
      if(clock!==undefined){
        if(water(tx-1,ty)&&water(tx+1,ty)&&water(tx,ty-1)&&water(tx,ty+1)&&(tx*3+ty)%7===0){
          const shift=Math.round(Math.sin(clock*1.8+tx)*2);
          r(px+3+shift,py+8,8,1,'#bed3c1');r(px+6+shift,py+10,4,1,'#96bbb1');
        }
        continue;
      }
      r(px,py,16,16,'#658e87');
      if((tx+ty)%5===0)r(px+4,py+6,7,2,'#719c91');
      if(!water(tx,ty-1)){r(px,py,16,6,'#526d60');r(px,py,16,2,'#c3c5a5');}
      if(!water(tx,ty+1)){r(px,py+10,16,6,'#536f60');r(px,py+10,16,2,'#b9bda0');}
      if(!water(tx-1,ty)){r(px,py,5,16,'#81917b');r(px,py,2,16,'#c3c5a5');}
      if(!water(tx+1,ty))r(px+12,py,4,16,'#536f60');
      if(tx===x&&ty%3===0){r(px+6,py+3,2,10,'#4c7457');r(px+10,py+5,1,8,'#a6ac78');}
    }
    // A gauge on the existing blocked bank reflects the existing comparison record.
    const bank=map.props.find(p=>p.dialogue==='tourOutdoor0'&&p.y===y&&water(p.x,p.y));
    if(bank){
      const px=bank.x*16,py=bank.y*16;
      r(px+3,py+2,10,13,'#d1c7a1');r(px+6,py+4,2,9,'#617d6c');
      for(let i=0;i<3;i++)r(px+8,py+4+i*3,3,1,'#617d6c');
      if(compared){r(px+4,py+10,8,2,'#3f8076');}
    }
  }finally{c.restore();}
}
