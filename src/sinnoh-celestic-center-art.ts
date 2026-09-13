import type { Furnishing,TourInterior } from './explore-interiors';
import type { GameMap } from './types';
const r=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};

export function paintCelesticCenterFloor(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_celestic_center')return;
  c.save();
  for(let y=7;y<map.height-2;y++)for(let x=2;x<map.width-2;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    const main=x>=13&&x<=15,pc=x>=17&&x<=22&&y>=12&&y<=13,rest=x<=8&&y>=17;
    if(!main&&!pc&&!rest)continue;
    r(c,x*16,y*16,16,16,main?'#dfd1b5':pc?'#b6ccbf':'#d1d4bf');
    r(c,x*16,y*16+15,16,1,'#aeb7a5');
    if(main&&(x===13||x===15))r(c,x*16+(x===13?1:14),y*16,1,16,'#b38173');
  }
  c.restore();
}

export function paintCelesticCenterFurnishing(c:CanvasRenderingContext2D,o:Furnishing):boolean{
  const guide=o.event==='tourCelesticCenterGuide',bench=o.event==='tourCelesticCenterBench';
  const pc=o.event==='tourPC'&&o.name==='포켓몬 보관 PC';
  if(!guide&&!bench&&!pc)return false;
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
  c.save();c.beginPath();c.rect(x,y-8,w,h+8);c.clip();
  if(guide){
    r(c,x,y-5,w,h+5,'#788877');r(c,x+3,y-2,w-6,h-1,'#e1d9b8');
    r(c,x+10,y+12,w-20,3,'#a5946c');r(c,x+w/2,y+4,3,19,'#a5946c');
    for(const dx of [9,w/2-3,w-18]){r(c,x+dx,y+8,9,8,'#728e80');r(c,x+dx+2,y+6,5,3,'#b8886e');}
    r(c,x+5,y+h-5,w-10,2,'#bdb291');
  }else if(pc){
    // The console fills its real four-tile footprint, including the side worktop.
    r(c,x,y,w,h,'#87988e');r(c,x+2,y+3,w-4,h-8,'#c3cbb8');
    r(c,x+6,y-6,26,23,'#4c6e69');r(c,x+9,y-3,20,15,'#9cc1ae');
    r(c,x+10,y+20,23,4,'#6d8279');
    for(let i=0;i<3;i++)r(c,x+12+i*6,y+21,3,1,'#e4ddba');
    r(c,x+40,y+8,16,10,'#e3dfc6');r(c,x+43,y+11,10,1,'#899b86');
  }else{
    r(c,x,y+3,w,5,'#8ba393');r(c,x,y+10,w,h-14,'#c7ba91');
    for(let i=0;i<o.w;i++){r(c,x+i*16+2,y+11,12,h-17,'#dcd3b1');r(c,x+i*16+5,y+h-4,5,4,'#65786a');}
  }
  c.restore();return true;
}

export function paintCelesticCenterReception(c:CanvasRenderingContext2D,room:TourInterior):boolean{
  if(!room.objects.some(o=>o.event==='tourCelesticCenterGuide')||!room.reception)return false;
  const a=room.reception,x=a.x*16,y=a.y*16,w=a.w*16,h=a.h*16;
  c.save();
  r(c,x,y,w,h,'#a47769');r(c,x,y-4,w,7,'#e2d6b6');
  r(c,x+2,y+4,w-4,h-6,'#cfab93');
  for(let i=8;i<w-8;i+=18)r(c,x+i,y+6,12,4,'#e4ccb0');
  // Six ball recesses identify the recovery counter without adding a new event.
  for(let i=0;i<6;i++){const bx=x+8+i*10;r(c,bx,y-3,7,5,'#677c70');r(c,bx+1,y-2,5,2,'#d79b80');}
  r(c,x+w-25,y-3,17,7,'#6b8e80');r(c,x+w-23,y-2,13,3,'#b9d6b5');
  c.restore();return true;
}
