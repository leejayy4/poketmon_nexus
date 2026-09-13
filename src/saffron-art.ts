import type { GameMap } from './types';
import { paintTourGround,paintTourPaths } from './explore-materials';
import { KANTO_ROUTE_EIGHT,KANTO_ROUTE_SEVEN,KANTO_UNDERGROUND_EW } from './kanto-saffron-approach';

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const tile=(n:number)=>n*16;

function treeLine(c:CanvasRenderingContext2D,x:number,y:number,count:number){
  for(let i=0;i<count;i++){const px=tile(x+i*2),py=tile(y+(i%2));box(c,px+6,py+12,4,10,'#735c48');box(c,px+2,py+2,12,12,'#47765d');box(c,px+4,py,8,7,'#79a86e');}
}
function lamp(c:CanvasRenderingContext2D,x:number,y:number,color:string){
  box(c,tile(x)+7,tile(y)+4,2,13,'#4b5960');box(c,tile(x)+4,tile(y)+2,8,5,'#6c7474');box(c,tile(x)+5,tile(y)+3,6,3,color);
}
function flowerBank(c:CanvasRenderingContext2D,x:number,y:number,count:number){
  for(let i=0;i<count;i++){const px=tile(x)+i*12,py=tile(y)+(i%2)*5;box(c,px+5,py+8,2,6,'#52735c');box(c,px+2,py+4,5,5,i%3?'#c5a5c9':'#eee0d0');box(c,px+7,py+3,5,5,'#9d82ae');}
}

/** Dedicated surface and tunnel materials for Saffron's Route 7/8 approach. */
export function paintSaffronApproach(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const underground=map.id===KANTO_UNDERGROUND_EW,tiles=images['town-reference'],paths=new Set<string>();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=tile(x),py=tile(y),walk=map.walkable[y]?.[x]==='.';
    if(underground){
      box(c,px,py,16,16,walk?'#c7c1ad':'#3d4650');
      if(walk){box(c,px,py+13,16,3,'#928d82');if((x+y)%4===0)box(c,px+3,py+4,10,1,'#ddd6bd');paths.add(x+','+y);}
      else{box(c,px+2,py+2,12,5,'#59646c');box(c,px+3,py+10,10,2,'#303a43');}
    }else{
      const saffronSide=map.id===KANTO_ROUTE_SEVEN?x>map.width/2:x<map.width/2;
      paintTourGround(c,tiles,px,py,saffronSide?'city':'flowers');
      if(walk)paths.add(x+','+y);else if(saffronSide){box(c,px+2,py+3,12,10,'#737b78');box(c,px+4,py+5,8,3,'#aab0a1');}
    }
  }
  if(!underground)paintTourPaths(c,tiles,paths,'city');
  if(map.id===KANTO_ROUTE_SEVEN){
    treeLine(c,6,5,7);flowerBank(c,6,8,13);
    for(const x of [31,37,43])lamp(c,x,8,'#f0d88e');
    box(c,tile(34),tile(5),tile(10),5,'#d7bc73');box(c,tile(34),tile(5)+5,tile(10),3,'#5b6570');
    box(c,tile(22),tile(18),tile(5),5,'#59616a');box(c,tile(23),tile(18)-5,tile(3),6,'#d8c77c');
  }else if(map.id===KANTO_ROUTE_EIGHT){
    for(const x of [7,14,39,47])lamp(c,x,10,'#f2d98b');
    box(c,tile(8),tile(6),tile(11),6,'#d9bc72');box(c,tile(8)+5,tile(6)+6,tile(11)-10,4,'#5a6470');
    treeLine(c,48,18,5);flowerBank(c,49,21,11);
    box(c,tile(24),tile(19),tile(6),5,'#59616a');box(c,tile(25),tile(19)-5,tile(4),6,'#b598bc');
  }else{
    box(c,0,tile(9),tile(map.width),2,'#4c7f69');box(c,tile(map.width/2),tile(9),tile(map.width/2),2,'#846798');
    box(c,0,tile(14)-2,tile(map.width/2),2,'#4c7f69');box(c,tile(map.width/2),tile(14)-2,tile(map.width/2),2,'#846798');
    for(const x of [8,20,36,52,65]){lamp(c,x,8,x<36?'#b9dca8':'#d5b9dd');box(c,tile(x)-8,tile(6),18,3,'#778187');}
    for(const [x,y] of [[31,16],[58,16]]){box(c,tile(x)-8,tile(y),48,7,'#5b6470');box(c,tile(x)-5,tile(y)+7,42,5,'#9a856e');box(c,tile(x),tile(y)+12,3,8,'#4a545c');box(c,tile(x)+28,tile(y)+12,3,8,'#4a545c');}
    for(const x of [14,42]){box(c,tile(x),tile(5),tile(4),4,'#75838a');box(c,tile(x)+8,tile(5)+4,tile(3)-16,12,'#b8c3bb');}
  }
}
