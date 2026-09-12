/** Tile-sized volcanic strata, kept inside the collision footprint. */
export function paintCinnabarRock(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number){
  const fill=(dx:number,dy:number,rw:number,rh:number,color:string)=>{c.fillStyle=color;c.fillRect(x+dx,y+dy,rw,rh);};
  fill(0,0,w,h,'#79625b');
  // Continuous, uneven strata instead of a repeated square tile wall.
  for(let col=0;col<w;col+=2){
    const ridge=2+Math.floor((Math.sin(col*.17)+Math.cos(col*.31)+2)*1.5);
    fill(col,0,Math.min(2,w-col),ridge,'#b8987c');
    fill(col,ridge,Math.min(2,w-col),2,'#d0ad8a');
    for(let layer=1;layer<4;layer++){
      const edge=Math.floor(h*layer/4+Math.sin(col*.09+layer*2)*3+Math.cos(col*.23)*2);
      fill(col,edge,Math.min(2,w-col),2,layer%2?'#a47d69':'#5e504c');
    }
  }
  for(let i=0;i<Math.floor(w*h/110);i++){
    const px=3+(i*29+Math.floor(i/3)*7)%Math.max(1,w-8);
    const py=8+(i*17)%Math.max(1,h-14);
    fill(px,py,3,2,'#564e4a');fill(px+1,py+2,2,3,'#65534e');
    fill(px-1,py-1,3,1,'#b18b71');
  }
  fill(1,h-3,w-2,2,'#484e50');
}
