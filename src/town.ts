// Tile coordinates are shared by the field artwork, collision, and entrances.
export const TOWN_REVISION = 22;
export const TOWN_SIZE = { width:40, height:30 };
export const TOWN_GRASS = { x:32,y:5,w:4,h:3,kind:'tallGrass' as const };
export const TOWN_POND = { x:28,y:13,w:7,h:5 };
export const TOWN_FLOWERS = { x:19,y:14,w:3,h:2 };
export const TOWN_BUILDINGS = [
  {id:'lab',x:8,y:7,w:8,h:3,door:{x:10,y:9},draw:{image:'sandgem-reference',source:[80,46,140,105],x:120,y:59},outline:[[5,4],[92,4],[92,13],[137,13],[137,88],[92,88],[92,101],[5,101]]},
  {id:'home',x:7,y:22,w:6,h:3,door:{x:8,y:24},draw:{image:'town-reference',source:[113,45,103,105],x:107,y:299},outline:[[3,36],[42,0],[89,34],[92,79],[87,79],[87,101],[7,101],[7,79],[3,79]]},
  {id:'neighbor',x:23,y:8,w:6,h:3,door:{x:24,y:10},draw:{image:'town-reference',source:[282,168,105,106],x:358,y:73},outline:[[10,40],[52,0],[96,29],[104,77],[98,80],[98,101],[17,101],[17,81],[10,81]]},
  {id:'cottage',x:29,y:23,w:4,h:2,door:{x:30,y:24},draw:{image:'town-reference',source:[132,189,73,85],x:464,y:317},outline:[[3,20],[35,0],[65,22],[65,80],[7,80],[7,50],[3,50]]},
] as const;
export const TOWN_PATHS = [
  [10,10,2,5],[3,14,16,3],[16,12,9,6],[8,17,3,9],[9,24,24,2],
  [23,17,3,9],[24,11,2,4],[25,10,10,2],[34,8,2,3],[30,18,3,7],[24,18,9,2],
] as const;
export function makeTownCollision():string[]{
  const rows=Array.from({length:TOWN_SIZE.height},()=>Array<string>(TOWN_SIZE.width).fill('#'));
  for(let y=4;y<=26;y++)for(let x=4;x<=36;x++)rows[y][x]='.';
  for(const r of [...TOWN_BUILDINGS,TOWN_POND,TOWN_FLOWERS])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)rows[y][x]='#';
  for(const b of TOWN_BUILDINGS)rows[b.door.y][b.door.x]='.';
  rows[15][2]='.';rows[15][3]='.';
  rows[17][17]='#';rows[23][13]='#'; // Town sign.
  for(let x=30;x<=36;x++)rows[3][x]='#';
  for(let x=25;x<=27;x++)rows[13][x]='#';
  return rows.map(r=>r.join(''));
}
type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
export function paintTallGrass(c:CanvasRenderingContext2D,x:number,y:number,front=false,phase=0,source?:CanvasImageSource){
  if(source){c.drawImage(source,680,88+(front?4:0),16,front?9:13,x,y+(front?7:3),16,front?9:13);return;}
  const shift=Math.sin(phase)>.7?1:0;
  const rect=(a:number,b:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x+a,y+b,w,h)};
  if(!front){rect(0,2,16,14,'#5db968');rect(1,6,14,9,'#459052');rect(2,12,12,4,'#337749');}
  for(const [a,b]of (front?[[1,12],[6,14],[11,12]]:[[1,5],[7,4],[11,6],[3,10],[9,10]])){
    rect(a,b,5,3,'#42834b');rect(a+1,b-3,2,5,'#5bb657');rect(a+shift,b-5,1,4,'#a0d56c');rect(a+3,b-3,1,5,'#b7df80');rect(a+4,b-1,1,3,'#7bc362');
  }
}
export function buildTownArt(images:Images):HTMLCanvasElement{
  const canvas=document.createElement('canvas');canvas.width=TOWN_SIZE.width*16;canvas.height=TOWN_SIZE.height*16;
  const c=canvas.getContext('2d')!;c.imageSmoothingEnabled=false;
  const original=images['town-reference'];
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
  // Reassemble the original DS material samples into a new map, rather than displaying Twinleaf.
  for(let y=0;y<canvas.height;y+=16)for(let x=0;x<canvas.width;x+=16)c.drawImage(original,184,16,16,16,x,y,16,16);
  const path=new Set<string>();for(const [x,y,w,h]of TOWN_PATHS)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)path.add(`${i},${j}`);
  for(const key of path){const [x,y]=key.split(',').map(Number),px=x*16,py=y*16;c.drawImage(original,232,64,16,16,px,py,16,16);
    if(!path.has(`${x},${y-1}`)){rect(px,py,16,2,'#c8d886');rect(px+1,py+2,14,1,'#f9e6ac')}
    if(!path.has(`${x},${y+1}`)){rect(px,py+14,16,2,'#c8d886');rect(px+1,py+13,14,1,'#f9e6ac')}
    if(!path.has(`${x-1},${y}`)){rect(px,py,2,16,'#c8d886');rect(px+2,py+1,1,14,'#f9e6ac')}
    if(!path.has(`${x+1},${y}`)){rect(px+14,py,2,16,'#c8d886');rect(px+13,py+1,1,14,'#f9e6ac')}
  }
  // A continuous woodland edge with one narrow western exit.
  for(let y=0;y<canvas.height;y+=16)for(let x=0;x<canvas.width;x+=16){if(x<64||x>=592||y<64||y>=432)c.drawImage(original,x%32,y%64,16,16,x,y,16,16)}
  c.drawImage(original,232,64,16,16,32,240,16,16);c.drawImage(original,232,64,16,16,48,240,16,16);
  // Raised flower island in the square.
  const f=TOWN_FLOWERS;rect(f.x*16-2,f.y*16+3,f.w*16+4,f.h*16,'#6e7e69');rect(f.x*16,f.y*16,f.w*16,f.h*16,'#d4d8b6');rect(f.x*16+2,f.y*16+2,f.w*16-4,f.h*16-4,'#50945e');
  c.drawImage(original,105,12,44,24,f.x*16+2,f.y*16+4,44,24);
  const p=TOWN_POND,px=p.x*16,py=p.y*16;
  rect(px+8,py,p.w*16-16,p.h*16,'#759571');rect(px,py+8,p.w*16,p.h*16-16,'#759571');rect(px+7,py+5,p.w*16-14,p.h*16-10,'#a99ca5');rect(px+3,py+12,p.w*16-6,p.h*16-24,'#a99ca5');rect(px+10,py+10,p.w*16-20,p.h*16-20,'#72bde7');rect(px+7,py+16,p.w*16-14,p.h*16-32,'#72bde7');rect(px+12,py+8,p.w*16-24,3,'#576a94');
  for(let i=0;i<6;i++){rect(px+18+i*13,py+20+(i%3)*15,8,1,'#a3dded');rect(px+20+i*13,py+22+(i%3)*15,4,1,'#96d4ed')}
  // Buildings are separate depth-sorted objects; only their foundations block walking.
  // A small patch reserved as terrain data for future encounters. It has no encounter events.
  for(let y=TOWN_GRASS.y;y<TOWN_GRASS.y+TOWN_GRASS.h;y++)for(let x=TOWN_GRASS.x;x<TOWN_GRASS.x+TOWN_GRASS.w;x++)paintTallGrass(c,x*16,y*16,false,0,images['grass-reference']);
  c.drawImage(original,204,113,12,33,210,349,12,33);
  // Short fences by the meadow and a bench overlooking the pond.
  for(let x=30;x<=36;x++){rect(x*16+3,57,4,14,'#6e8273');rect(x*16+4,55,3,13,'#eff0d9');rect(x*16,61,16,2,'#d1e4bf')}
  rect(406,212,3,10,'#565f60');rect(432,212,3,10,'#565f60');rect(404,205,34,5,'#7b6552');rect(404,205,34,2,'#c3a16c');rect(404,213,34,4,'#ac8e61');
  return canvas;
}


export function paintBuilding(c:CanvasRenderingContext2D,images:Images,b:typeof TOWN_BUILDINGS[number]){
  const s=b.draw.source;c.save();c.beginPath();b.outline.forEach(([x,y],i)=>i?c.lineTo(b.draw.x+x,b.draw.y+y):c.moveTo(b.draw.x+x,b.draw.y+y));c.closePath();c.clip();c.drawImage(images[b.draw.image],s[0],s[1],s[2],s[3],b.draw.x,b.draw.y,s[2],s[3]);c.restore();
}
