import { paintTallGrass } from './town';

export const ROUTE_SIZE={width:32,height:24};
export const ROUTE_GRASS=[{kind:'tallGrass' as const,x:17,y:6,w:6,h:4},{kind:'tallGrass' as const,x:7,y:15,w:8,h:4}];
export const ROUTE_SIGN={x:6,y:10};
export function makeRouteCollision():string[]{
  const rows=Array.from({length:24},()=>Array<string>(32).fill('#'));
  for(let y=4;y<=20;y++)for(let x=3;x<=29;x++)rows[y][x]='.';
  rows[12][30]='.';rows[12][2]='.';
  rows[ROUTE_SIGN.y][ROUTE_SIGN.x]='#';
  return rows.map(row=>row.join(''));
}
export function buildRouteArt(images:Record<string,HTMLImageElement|HTMLCanvasElement>):HTMLCanvasElement{
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=384;
  const c=canvas.getContext('2d')!;c.imageSmoothingEnabled=false;
  const original=images['town-reference'];
  for(let y=0;y<24;y++)for(let x=0;x<32;x++){
    c.drawImage(original,184,16,16,16,x*16,y*16,16,16);
    if(x<3||x>29||y<4||y>20)c.drawImage(original,(x%2)*16,(y%4)*16,16,16,x*16,y*16,16,16);
  }
  // A continuous safe lane connects the entry to the western roadworks.
  for(let y=11;y<=13;y++)for(let x=3;x<=29;x++){
    c.drawImage(original,232,64,16,16,x*16,y*16,16,16);
    if(y===11||y===13){c.fillStyle='#c8d886';c.fillRect(x*16,y*16+(y===13?14:0),16,2);}
  }
  c.drawImage(original,232,64,16,16,480,192,16,16);c.drawImage(original,232,64,16,16,32,192,16,16);
  for(const r of ROUTE_GRASS)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)paintTallGrass(c,x*16,y*16,false,0,images['grass-reference']);
  // Reuse DS flowers as small clearings off the main road.
  for(const [x,y]of [[5,5],[25,17],[18,19]])c.drawImage(original,105,12,44,24,x*16,y*16,44,24);
  return canvas;
}
