import { TOWN_BUILDINGS,paintBuilding } from './town';
import type { Place,TourBuilding } from './explore-world';

type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
const roofColors:Record<string,string>={city:'#667fa2',mine:'#9c815e',port:'#718c9d',water:'#689e8b',temple:'#8d7890',snow:'#eff5ed',flowers:'#c98296',ghost:'#8d7a9e',factory:'#7e8793',coast:'#689eae',dragon:'#7c89a2',airport:'#7c9db1',fair:'#c08b9e',desert:'#c5a175'};
const facades=new WeakMap<Images,Map<string,HTMLCanvasElement>>();

export function paintTourHouse(c:CanvasRenderingContext2D,images:Images,p:Place,b:TourBuilding){
  const source=TOWN_BUILDINGS[3],x=b.x*16,y=(b.y+2)*16-85;
  c.save();c.translate(x-source.draw.x,y-source.draw.y);paintBuilding(c,images,source);c.restore();
  // Tint only the sloping roof, retaining the original DS pixel shading and walls.
  c.save();c.beginPath();[[3,20],[35,0],[65,22],[65,49],[37,29],[7,51],[3,50]].forEach(([a,d],i)=>i?c.lineTo(x+a,y+d):c.moveTo(x+a,y+d));c.closePath();c.clip();
  c.globalAlpha=p.theme==='snow'?.68:.3;c.fillStyle=roofColors[p.theme]??(b.x<10?'#bf9e66':'#749aa8');c.fillRect(x,y,73,52);c.restore();
}

// Reuse the already aligned DS lab foundation: its entrance is two tiles from the left.
export function paintTourFacade(c:CanvasRenderingContext2D,images:Images,p:Place,b:TourBuilding){
  let cache=facades.get(images);if(!cache){cache=new Map();facades.set(images,cache)}
  let art=cache.get(p.theme);
  if(!art){
    art=document.createElement('canvas');art.width=140;art.height=105;
    const a=art.getContext('2d')!,source=TOWN_BUILDINGS[0];a.imageSmoothingEnabled=false;
    a.translate(-source.draw.x,-source.draw.y);paintBuilding(a,images,source);a.resetTransform();
    a.globalCompositeOperation='source-atop';a.globalAlpha=p.theme==='snow'?.65:.32;
    a.fillStyle=roofColors[p.theme]??'#689c89';a.fillRect(5,4,87,59);a.globalAlpha=1;a.globalCompositeOperation='source-over';
    cache.set(p.theme,art);
  }
  c.drawImage(art,b.x*16-8,b.y*16-53);
}

export function paintTourGround(c:CanvasRenderingContext2D,source:CanvasImageSource,x:number,y:number,theme:string){
  c.drawImage(source,184,16,16,16,x,y,16,16);
  const tint:Record<string,string>={forest:'#73986e70',city:'#a6b89d77',port:'#93b5a177',water:'#81a99b66',mine:'#b8af88bb',snow:'#eff3e8ed',factory:'#a9b0a1aa',ghost:'#a29bac99',coast:'#ead2a0ee',desert:'#d8b885ee',cave:'#9b9e96ee'};
  if(tint[theme]){c.fillStyle=tint[theme];c.fillRect(x,y,16,16)}
}

export function paintTourPaths(c:CanvasRenderingContext2D,source:CanvasImageSource,paths:Set<string>,theme:string){
  const paved=['city','fair','factory','dragon','airport'].includes(theme),snow=theme==='snow';
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
  for(const key of paths){
    const [x,y]=key.split(',').map(Number),px=x*16,py=y*16;
    c.drawImage(source,232,64,16,16,px,py,16,16);
    if(paved||snow)fill(px,py,16,16,snow?'#d8e4e0e0':'#c7c6b8bf');
    // Edge only at the perimeter: the path reads as one surface, not a striped tile grid.
    const edge=paved?'#8c9a8d':snow?'#aabeb8':theme==='forest'?'#7eab70':'#8dc579',light=snow?'#f1f4e8':'#eee6bf';
    if(!paths.has(x+','+(y-1))){fill(px,py,16,2,edge);fill(px+1,py+2,14,1,light)}
    if(!paths.has(x+','+(y+1))){fill(px,py+14,16,2,edge);fill(px+1,py+13,14,1,light)}
    if(!paths.has((x-1)+','+y)){fill(px,py,2,16,edge);fill(px+2,py+1,1,14,light)}
    if(!paths.has((x+1)+','+y)){fill(px+14,py,2,16,edge);fill(px+13,py+1,1,14,light)}
    if(paved){fill(px+3,py+7,10,1,'#adb4a455');if(x%2===0)fill(px+7,py+3,1,4,'#e8e5d155')}
  }
}
