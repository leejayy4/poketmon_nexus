import { paintJubilifeBuilding,paintJubilifeStreets,paintCityHall } from './explore-jubilife';
import { paintTourFacade,paintTourHouse,paintTourGround,paintTourPaths } from './explore-materials';
import { paintTourInterior } from './explore-interior-art';
import { paintTourCenter } from './explore-center-art';
import { paintGroveGround } from './explore-tree-art';
import { PASSAGES,MART_ROOMS } from './journey-world';
import { paintJourneyPassage,paintJourneyInterior,paintJourneyMart } from './journey-art';
import { FOREST_BORDER_MAPS,paintForestBorderGround } from './forest-border-art';
import { TOUR_LAYOUTS } from './explore-layouts';
import { PLACES,TOUR_PLANS,TOUR_MAPS,TOUR_OUTDOORS,TOUR_INTERIORS,TOUR_BUILDINGS,TOUR_FEATURES,SHORT_TOURS,tourPlaceForMap,type Place,type TourBuilding } from './explore-world';

import { paintCityBuilding } from './badge-maps';
type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
export const TOUR_COLORS={village:'#9bb96a',city:'#abb8aa',forest:'#5b9a62',mine:'#aaab91',port:'#8db8b0',water:'#91bca7',snow:'#dde7e6',temple:'#acae8b',factory:'#a9aaa0',ghost:'#a79eaf',flowers:'#a5bd85',coast:'#e6d0a0',desert:'#cfb784',dragon:'#a2b7b2',airport:'#afc9a0',fair:'#b9bcb0',cave:'#999c9c'};
const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
function rock(c:CanvasRenderingContext2D,x:number,y:number,w=25,h=22){c.fillStyle='#5b6770';c.beginPath();c.moveTo(x,y+h);c.lineTo(x+2,y+7);c.lineTo(x+w/3,y);c.lineTo(x+w-5,y+3);c.lineTo(x+w,y+h-4);c.closePath();c.fill();rect(c,x+5,y+5,w-10,5,'#b9b9a1');rect(c,x+6,y+10,w-12,h-15,'#949c97')}
// A readable rock footprint: the shadow reaches the blocked tile edges; the
// stepped face and strata stay inside them, including the older 2x2 rocks.
function paintCoronetRock(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number){
  rect(c,x,y,w,h,'#888b7e');
  const face=(points:number[][],color:string)=>{c.fillStyle=color;c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(x+a,y+b):c.moveTo(x+a,y+b));c.closePath();c.fill()};
  face([[0,h-8],[2,h-8],[2,14],[6,14],[6,7],[12,7],[12,3],[w-13,3],[w-13,5],[w-6,5],[w-6,10],[w-2,10],[w-2,18],[w,18],[w,h-5],[w-8,h-5],[w-8,h-2],[5,h-2],[5,h-5],[0,h-5]],'#596b6a');
  face([[6,14],[12,7],[w-13,6],[w-7,10],[w-4,17],[w-10,19],[w-15,15],[13,17]],'#b8bba2');
  face([[5,17],[12,20],[w-14,18],[w-9,21],[w-3,19],[w-5,h-7],[w-13,h-3],[7,h-6]],'#8c9b8d');
  face([[9,19],[13,21],[w-15,h-5],[7,h-7]],'#a5ac96');
  rect(c,x+13,y+8,5,2,'#d3cfb1');rect(c,x+w-10,y+13,3,2,'#d3cfb1');
  for(let j=22;j<h-5;j+=7){rect(c,x+w-12,y+j,6,2,'#647973');rect(c,x+8,y+j+1,3,1,'#c0c2a3');}
  rect(c,x+Math.floor(w/2),y+12,2,5,'#78867b');rect(c,x+Math.floor(w/2)-3,y+17,4,2,'#78867b');
}
export function paintDesertRuinsRock(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number){
  rect(c,x,y,w,h,'#8a6b46');
  const face=(points:number[][],color:string)=>{c.fillStyle=color;c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(x+a,y+b):c.moveTo(x+a,y+b));c.closePath();c.fill()};
  face([[0,h-6],[2,h-6],[2,10],[6,10],[6,5],[10,5],[10,2],[w-10,2],[w-10,5],[w-5,5],[w-5,10],[w-2,10],[w-2,16],[w,16],[w,h-4],[w-6,h-4],[w-6,h-2],[4,h-2],[4,h-4],[0,h-4]],'#6e5233');
  face([[4,10],[10,5],[w-10,5],[w-6,9],[w-3,15],[w-8,17],[w-12,13],[11,15]],'#e5d3a8');
  face([[3,13],[10,16],[w-11,15],[w-7,19],[w-3,18],[w-5,h-5],[w-10,h-3],[5,h-5]],'#c8ad7f');
  rect(c,x+8,y+6,Math.max(4,w-16),2,'#f4e7c5');
  for(let j=16;j<h-4;j+=6){
    rect(c,x+4,y+j,Math.max(4,w-8),1,'#7e5f3c');
    rect(c,x+6,y+j+1,Math.max(4,w-12),1,'#dfcda2');
  }
  const mid=Math.floor(w/2);
  rect(c,x+mid-2,y+8,4,Math.max(2,h-16),'#a08259');
  rect(c,x+mid-1,y+8,2,Math.max(2,h-16),'#745634');
}
// A compact, stepped plaza fountain: richer than a flat oval while staying in
// the same 16px DS field grid as the surrounding Jubilife street tiles.
export function paintJubilifeFountain(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number){
  const fill=(dx:number,dy:number,dw:number,dh:number,color:string)=>rect(c,x+dx,y+dy,dw,dh,color);
  fill(4,0,w-8,h,'#52696b');fill(1,4,w-2,h-8,'#6f8580');fill(0,8,w,h-16,'#52696b');
  fill(6,3,w-12,h-6,'#d6d7bf');fill(3,7,w-6,h-14,'#d6d7bf');
  fill(8,6,w-16,h-12,'#5a9fba');fill(5,10,w-10,h-20,'#5a9fba');
  fill(10,8,w-20,2,'#b9e4e1');fill(8,h-10,w-16,2,'#407f9d');
  fill(w/2-7,10,14,h-20,'#778f86');fill(w/2-5,8,10,h-19,'#d2d8be');
  fill(w/2-9,6,18,4,'#f0eed5');fill(w/2-2,1,4,8,'#e8f3df');fill(w/2-1,0,2,5,'#bce8e0');
  fill(7,h-8,4,2,'#d9f0dd');fill(w-11,h-8,4,2,'#d9f0dd');
}
export function paintTourBuilding(c:CanvasRenderingContext2D,images:Images,p:Place,b:TourBuilding){
  if(b.kind==='house'&&b.room&&MART_ROOMS.has(b.room)){paintJourneyMart(c,images,b);return}
  if(p.id==='tour_jubilife'&&b.kind!=='center'){paintJubilifeBuilding(c,images,b);return}
  if(['urban','waterfront'].includes(TOUR_PLANS[p.id]?.style)){
    if(b.kind==='landmark'){paintCityHall(c,images,b);return}
    if(b.kind==='house'){paintJubilifeBuilding(c,images,b);return}
  }
  if(b.kind==='landmark'){paintTourFacade(c,images,p,b);return}
  if(b.kind==='center'){paintCityBuilding(c,images,b as any);return}
  paintTourHouse(c,images,p,b);
}
export function paintTourSign(c:CanvasRenderingContext2D,images:Images,point:{x:number;y:number}){
  const x=point.x*16-4,y=point.y*16-12;
  c.save();c.beginPath();
  [[10,1],[17,1],[17,7],[22,7],[22,20],[17,20],[17,28],[10,28],[10,20],[2,20],[2,7],[10,7]].forEach(([a,b],i)=>i?c.lineTo(x+a,y+b):c.moveTo(x+a,y+b));
  c.closePath();c.clip();c.drawImage(images['town-reference'],244,156,24,28,x,y,24,28);c.restore();
}
export function buildExploreArt(images:Images,id:string){
  const map=TOUR_MAPS[id as keyof typeof TOUR_MAPS],p=tourPlaceForMap(id)!;const canvas=document.createElement('canvas');canvas.width=map.width*16;canvas.height=map.height*16;const c=canvas.getContext('2d')!;c.imageSmoothingEnabled=false;
  if(PASSAGES[id]){paintJourneyPassage(c,images,map);return canvas;}
  if(TOUR_INTERIORS[id]){if(TOUR_INTERIORS[id].style==='center')paintTourCenter(c,images);else paintTourInterior(c,images,TOUR_INTERIORS[id]);paintJourneyInterior(c,images,map,TOUR_INTERIORS[id]);return canvas;}
  const short=SHORT_TOURS.has(p.id),cx=short?10:14,cy=short?9:12;
  const tiles=images['town-reference'];
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const edge=x<2||x>=map.width-2||y<3||y>=map.height-2;
    paintTourGround(c,tiles,x*16,y*16,p.theme);
    if(edge){if(FOREST_BORDER_MAPS.has(id)){if(map.walkable[y][x]==='#')paintForestBorderGround(c,x,y)}else if(['port','coast','water'].includes(p.theme)){rect(c,x*16,y*16,16,16,'#69aac1');rect(c,x*16+3,y*16+7,10,1,'#bbdbe1')}else if(['cave','mine','desert'].includes(p.theme)){rect(c,x*16,y*16,16,16,'#75818b');rect(c,x*16+1,y*16+2,14,5,'#aab0a2')}else{c.drawImage(tiles,(x%2)*16,(y%4)*16,16,16,x*16,y*16,16,16);if(p.theme==='snow'){c.fillStyle='#e8f2ed99';c.fillRect(x*16,y*16,16,16)}}}
  }
  const paths=new Set<string>();const path=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(map.walkable[j]?.[i]==='.')paths.add(i+','+j)};
  const layout=TOUR_PLANS[p.id]??TOUR_LAYOUTS[p.id];
  if(layout){for(const r of layout.paths)path(...r)}else{path(cx-1,3,3,map.height-5);path(2,cy-1,map.width-4,3);if(!short)path(10,10,8,8)}
  if(!short)for(const b of TOUR_BUILDINGS[p.id]){path(b.door.x,b.door.y+1,1,Math.max(1,cy-b.door.y));if(b.y>cy)path(b.door.x,cy,1,b.door.y-cy+2);}
  for(const w of map.warps){path(w.x,w.y,1,1);}
  if(TOUR_PLANS[p.id]?.style==='urban')paintJubilifeStreets(c,images,map.walkable,paths,p.id==='tour_jubilife');else paintTourPaths(c,tiles,paths,p.theme);
  for(const [x,y,w,h] of layout?.boardwalks??[])for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(map.walkable[j]?.[i]==='.'){
    rect(c,i*16,j*16,16,16,'#866d54');rect(c,i*16+1,j*16,14,16,'#bb9b70');
    for(let k=3;k<16;k+=4)rect(c,i*16+1,j*16+k,14,1,'#927754');
    rect(c,i*16+2,j*16+1,1,1,'#e4c99a');rect(c,i*16+12,j*16+13,1,1,'#645e51');
  }
  for(const f of TOUR_FEATURES[p.id]){
    const x=f.x*16,y=f.y*16,w=f.w*16,h=f.h*16;
    if(f.kind==='fountain'&&p.id==='tour_jubilife'){
      paintJubilifeFountain(c,x,y,w,h);
    }else if(f.kind==='fountain'){
      const basin=(inset:number,color:string)=>{c.fillStyle=color;c.beginPath();[[8,inset],[w-8,inset],[w-inset,7],[w-inset,h-7],[w-8,h-inset],[8,h-inset],[inset,h-7],[inset,7]].forEach(([a,b],i)=>i?c.lineTo(x+a,y+b):c.moveTo(x+a,y+b));c.closePath();c.fill()};
      basin(0,'#657e83');basin(2,'#d5d7c1');basin(5,p.theme==='snow'?'#d5e9e6':'#70b9d7');
      rect(c,x+10,y+h-7,w-20,1,'#aedce2');rect(c,x+8,y+8,w-16,1,'#548fa9');
      rect(c,x+w/2-6,y+9,12,11,'#8eabaa');rect(c,x+w/2-4,y+6,8,12,'#d0d8c7');
      rect(c,x+w/2-8,y+5,16,4,'#ecedda');rect(c,x+w/2-2,y-1,4,7,'#b9dce1');
      rect(c,x+w/2-1,y-4,2,4,'#edf3e8');rect(c,x+w/2-11,y+12,2,4,'#cbebec');rect(c,x+w/2+9,y+12,2,4,'#cbebec');
    }
    if(f.kind==='water'){
      rect(c,x,y,w,h,'#788b81');rect(c,x+2,y+2,w-4,h-4,'#63aaca');rect(c,x+3,y+3,w-6,4,'#aed9d9');
      for(let j=13;j<h-4;j+=24)for(let i=8;i<w-16;i+=23)rect(c,x+i,y+j,13,2,'#a7dce1');
      if(p.theme==='water')for(let j=14;j<h-8;j+=22){rect(c,x+5,y+j,2,8,'#526f4e');rect(c,x+9,y+j-3,2,11,'#78925c');rect(c,x+8,y+j-5,4,3,'#b7a575');rect(c,x+w-15,y+j,9,3,'#81ad83');}
      if(p.theme==='port'||p.theme==='coast'){rect(c,x+w-12,y+12,10,h-24,'#c19b70');for(let j=13;j<h-12;j+=8){rect(c,x+w-11,y+j,8,1,'#886e57');rect(c,x+w-14,y+j,3,4,'#5f6c64');}}
    }
    if(f.kind==='statue'){
      rect(c,x,y,w,h,'#929e80');rect(c,x+3,y+3,w-6,h-6,'#c2c3a3');
      rect(c,x+7,y+h-13,w-14,9,'#697a78');rect(c,x+9,y+h-15,w-18,5,'#d1d0b6');
      const sx=x+w/2;rect(c,sx-10,y+16,20,h-30,'#7a8985');rect(c,sx-7,y+17,12,h-32,'#a8b3a4');
      rect(c,sx-9,y+5,18,13,'#6c7d7a');rect(c,sx-6,y+4,12,11,'#bac3b1');
      rect(c,sx-13,y+19,5,9,'#8f9c8d');rect(c,sx+8,y+19,5,9,'#8f9c8d');
      rect(c,x+9,y+h-7,7,2,'#7c9769');rect(c,sx-4,y+h-10,8,3,'#dfd6ad');
    }
    if(f.kind==='garden'){rect(c,x,y,w,h,p.theme==='ghost'?'#837b91':'#85986d');rect(c,x+3,y+3,w-6,h-6,p.theme==='ghost'?'#b1a7b9':p.theme==='snow'?'#cbded9':'#aec38b');for(let j=0;j<Math.floor(h/23);j++)for(let i=0;i<Math.floor((w+3)/24);i++){if(p.theme==='ghost'){rect(c,x+10+i*23,y+10+j*22,9,13,'#737785');rect(c,x+12+i*23,y+8+j*22,5,3,'#d0c7bd')}else if(p.theme==='snow'){rect(c,x+9+i*23,y+10+j*22,10,11,'#e9f2e6');rect(c,x+11+i*23,y+7+j*22,6,4,'#b8d5de')}else c.drawImage(tiles,105,12,14,16,x+7+i*24,y+7+j*23,14,16)}
      if(p.theme==='fair'){c.strokeStyle='#626e7f';c.lineWidth=3;c.beginPath();c.arc(x+w/2,y+25,34,0,Math.PI*2);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4,px=Math.round(x+w/2+34*Math.cos(a)),py=Math.round(y+25+34*Math.sin(a));rect(c,px-5,py-5,10,10,['#cf9278','#d2bd77','#81acb2'][i%3])}rect(c,x+w/2-2,y+23,4,49,'#768b91')}
    }
    if(f.kind==='rocks'){
      if(p.id==='tour_coronet')paintCoronetRock(c,x,y,w,h);
      else if(p.id==='tour_desert')paintDesertRuinsRock(c,x,y,w,h);
      else{rect(c,x,y,w,h,p.theme==='desert'?'#ae9271':'#7e898b');for(let j=0;j<2;j++)for(let i=0;i<2;i++)rock(c,x+4+i*w/2,y+6+j*(h-20)/2,w/2-8,(h-20)/2-5);if(p.theme==='mine'){rect(c,x+4,y+h-12,w-8,2,'#dfd4b5');rect(c,x+4,y+h-4,w-8,2,'#515d69');for(let i=8;i<w-5;i+=10)rect(c,x+i,y+h-13,3,13,'#b0946a')}}
    }
    if(f.kind==='rail'){
      rect(c,x,y,w,h,'#898b7b');for(let i=4;i<w-4;i+=9)rect(c,x+i,y+7,4,h-10,'#ae8b61');
      for(const offset of [9,h-7]){rect(c,x+2,y+offset,w-4,3,'#505e66');rect(c,x+2,y+offset,w-4,1,'#d0d3c3')}
      const cart=x+w/2-12;rect(c,cart+1,y+20,6,5,'#3b4c57');rect(c,cart+17,y+20,6,5,'#3b4c57');
      rect(c,cart,y+6,25,16,'#536974');rect(c,cart+2,y+8,21,10,'#91a3a2');rect(c,cart-1,y+4,27,4,'#c2ccbf');
      for(let i=0;i<3;i++){rect(c,cart+2+i*7,y+2,6,5,'#667579');rect(c,cart+3+i*7,y+1,4,2,'#c2c3aa')}
    }
    if(f.kind==='grove')paintGroveGround(c,f);
    if(f.kind==='runway'){rect(c,x,y,w,h,'#748388');rect(c,x+3,y+3,w-6,h-6,'#879397');for(let i=0;i<5;i++)rect(c,x+13+i*12,y+h/2,7,3,'#ece8ca');rect(c,x+28,y+12,26,5,'#dde4da');rect(c,x+39,y+4,4,28,'#dae2d8')}
  }
  if(p.theme==='port'||p.theme==='coast'){const bx=50,by=canvas.height-30;rect(c,bx,by,78,16,'#f0ecd7');rect(c,bx+5,by+14,66,5,'#8b7259');rect(c,bx+18,by-8,37,12,'#f0e6c7');rect(c,bx+23,by-5,10,5,'#709bad');rect(c,bx+39,by-5,10,5,'#709bad');rect(c,bx+7,by+2,5,6,'#bc8d65');}
  if(short){for(const[x,y]of [[4,5],[14,12]])if(p.id==='tour_coronet')paintCoronetRock(c,x*16,y*16,32,32);else if(p.id==='tour_desert')paintDesertRuinsRock(c,x*16,y*16,32,32);else if(p.theme==='cave')rock(c,x*16,y*16,22,19);}
  return canvas;
}
