import type { GameMap } from './types';

/** Terraced lookout masonry stays inside blocked terrain; the existing east road stays dry. */
export function paintIcirrusOverlook(c:CanvasRenderingContext2D,map:GameMap,x:number,y:number,w:number,h:number){
  const r=(a:number,b:number,ww:number,hh:number,color:string)=>{c.fillStyle=color;c.fillRect(x+a,y+b,ww,hh);};
  c.save();
  try{
    c.beginPath();
    for(let ty=y/16;ty<(y+h)/16;ty++)for(let tx=x/16;tx<(x+w)/16;tx++)if(map.walkable[ty]?.[tx]!=='.')c.rect(tx*16,ty*16,16,16);
    c.clip();
    r(0,0,w,h,'#687d6c');
    // Broad, stepped rock shelves replace the four identical boulders.
    for(let i=0;i<3;i++){
      const top=8+i*30,inset=7+i*6;
      r(inset,top,w-inset*2,25,'#94a28a');r(inset,top+20,w-inset*2,8,'#50685d');
      r(inset+2,top,w-inset*2-4,3,'#c1c6a8');
      for(let a=inset+13;a<w-inset-8;a+=29)r(a,top+22,2,5,'#7c8b76');
    }
    // Low north-facing interpretive slab: carved tower and compass, not an entrance.
    r(60,5,77,24,'#526f64');r(63,7,71,17,'#c4c4a0');
    r(75,10,38,2,'#71836b');r(75,15,38,2,'#71836b');
    r(119,9,6,13,'#617e70');r(116,12,12,2,'#617e70');r(116,18,12,2,'#617e70');
    // Edge planting follows rock cracks instead of a uniform grid.
    for(const [a,b] of [[12,13],[176,62],[37,84],[157,94]]){r(a,b,13,4,'#849b73');r(a+3,b-5,2,7,'#b1b58b');}
  }finally{c.restore();}
}
