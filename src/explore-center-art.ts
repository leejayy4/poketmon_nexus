import type { Furnishing,TourInterior } from './explore-interiors';

type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
// Native DPPt samples, composed into our existing 16 × 14 exploration room.
export const CENTER_SAMPLES={floor:[77,145,16,16],wall:[73,10,24,22],healer:[90,29,28,38],pc:[180,28,22,36],seat:[41,127,15,31],counter:[80,65,32,21],emblem:[101,106,53,41]} as const;
const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
function sample(c:CanvasRenderingContext2D,images:Images,key:keyof typeof CENTER_SAMPLES,x:number,y:number){
  const [sx,sy,w,h]=CENTER_SAMPLES[key];c.drawImage(images['center-reference'],sx,sy,w,h,x,y,w,h);
}
export function paintTourCenter(c:CanvasRenderingContext2D,images:Images){
  box(c,0,0,256,224,'#172b34');box(c,28,18,200,176,'#705644');
  for(let y=3;y<12;y++)for(let x=2;x<14;x++)sample(c,images,'floor',x*16,y*16);
  box(c,32,31,192,17,'#e7a35d');box(c,32,42,192,6,'#bd6039');
  for(let x=32;x<224;x+=24)sample(c,images,'wall',x,9);
  box(c,28,47,4,145,'#af8560');box(c,224,47,4,145,'#af8560');
  box(c,32,188,96,4,'#a8825a');box(c,144,188,80,4,'#a8825a');
  // Main aisle and threshold remain exactly on the existing exit column.
  sample(c,images,'emblem',110,125);
  box(c,128,176,16,48,'#a13e37');box(c,130,178,12,46,'#d85642');
  for(let y=180;y<224;y+=8)box(c,132,y,8,1,'#e96e50');
  // Wall monitor and travel posters are outside the walkable floor.
  c.drawImage(images['center-reference'],119,15,33,19,120,19,33,19);
  c.drawImage(images['center-reference'],204,20,23,26,194,18,23,26);
}
export function paintCenterFurnishing(c:CanvasRenderingContext2D,images:Images,o:Furnishing){
  const x=o.x*16,y=(o.y+o.h)*16;
  if(o.kind==='healer'){
    box(c,x,y-32,32,32,'#bcbcab');box(c,x+2,y-29,28,27,'#d8d8c5');
    sample(c,images,'healer',x+2,y-43);
    box(c,x+5,y-7,22,3,'#898c8c');
  }else if(o.kind==='console'){
    box(c,x,y-32,32,32,'#c0baa0');sample(c,images,'pc',x+5,y-40);
    box(c,x+5,y-5,22,3,'#958d78');
  }else{
    for(let i=0;i<o.w;i++)sample(c,images,'seat',x+i*16,y-31);
  }
}
export function paintCenterReception(c:CanvasRenderingContext2D,images:Images,room:TourInterior){
  const r=room.reception!;for(let i=0;i<r.w;i+=2)sample(c,images,'counter',(r.x+i)*16,(r.y+r.h)*16-21);
  box(c,r.x*16+2,r.y*16-5,r.w*16-4,3,'#eff3df');
  box(c,r.x*16+27,r.y*16+1,12,3,'#e5eee5');
}
