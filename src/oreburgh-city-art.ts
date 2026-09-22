import type { GameMap } from './types';
import type { TourBuilding } from './explore-world';
import type { Furnishing } from './explore-interiors';

const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const label=(c:CanvasRenderingContext2D,text:string,x:number,y:number,color='#f3e7bb')=>{c.save();c.fillStyle=color;c.font='7px Galmuri11, monospace';c.textAlign='center';c.fillText(text,x,y);c.restore();};

/** Canvas-only BW/BW2-style reconstruction; no original game bitmap is copied. */
export function paintOreburghBuilding(c:CanvasRenderingContext2D,b:TourBuilding):boolean{
  const x=b.x*16,y=b.y*16,w=b.w*16,h=b.h*16;
  // The doorway must reach the bottom of the walkable door tile, like the mart.
  const doorX=b.door.x*16,thresholdY=(b.door.y+1)*16;
  if(b.room==='tour_oreburgh_hall'){
    rect(c,x-4,y+10,w+8,h-10,'#56646a');rect(c,x,y+4,w,h-7,'#aeb4a4');rect(c,x+5,y+9,w-10,h-18,'#d2cfb5');
    for(let i=10;i<w-8;i+=23){rect(c,x+i,y+16,12,15,'#668894');rect(c,x+i+2,y+18,8,11,'#b9d8d6');}
    rect(c,x+10,y,w-20,9,'#66767b');rect(c,x+15,y-4,w-30,6,'#9da99f');rect(c,x+w/2-28,y+34,56,12,'#4f6067');label(c,'MUSEUM',x+w/2,y+43);
    rect(c,doorX,thresholdY-28,16,28,'#506169');rect(c,doorX+3,thresholdY-25,10,23,'#769293');
    rect(c,doorX+7,thresholdY-25,2,23,'#c5d3c4');rect(c,doorX,thresholdY-2,16,2,'#e0d3aa');return true;
  }
  if(b.kind==='house'&&b.door.x===41&&b.door.y===23){
    rect(c,x-4,y+8,w+8,h-8,'#4d585d');rect(c,x,y+3,w,h-5,'#8e9890');
    for(let i=4;i<w-4;i+=16){rect(c,x+i,y-2,12,8,'#5d696a');rect(c,x+i+2,y,8,3,'#c5b98e');}
    rect(c,x+7,y+13,w-14,h-25,'#c0bea6');rect(c,x+w/2-22,y+21,44,12,'#414e55');label(c,'GYM',x+w/2,y+30,'#efcf72');
    rect(c,doorX,thresholdY-30,16,30,'#434e55');rect(c,doorX+3,thresholdY-27,10,25,'#63716b');
    rect(c,doorX+5,thresholdY-25,6,5,'#d4bd6d');rect(c,doorX,thresholdY-2,16,2,'#d8c79d');return true;
  }
  return false;
}

export function paintOreburghCityDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_oreburgh')return;
  const arrow=(x:number,y:number,dir:'left'|'up'|'down',text:string)=>{
    const px=x*16,py=y*16;rect(c,px-2,py-2,52,13,'#59666a');c.save();c.fillStyle='#e6d89e';c.beginPath();
    if(dir==='left'){c.moveTo(px+3,py+5);c.lineTo(px+11,py);c.lineTo(px+11,py+3);c.lineTo(px+18,py+3);c.lineTo(px+18,py+8);c.lineTo(px+11,py+8);c.lineTo(px+11,py+11);}
    else if(dir==='up'){c.moveTo(px+7,py);c.lineTo(px+1,py+7);c.lineTo(px+5,py+7);c.lineTo(px+5,py+11);c.lineTo(px+10,py+11);c.lineTo(px+10,py+7);c.lineTo(px+14,py+7);}
    else{c.moveTo(px+7,py+11);c.lineTo(px+1,py+4);c.lineTo(px+5,py+4);c.lineTo(px+5,py);c.lineTo(px+10,py);c.lineTo(px+10,py+4);c.lineTo(px+14,py+4);}
    c.closePath();c.fill();c.restore();label(c,text,px+35,py+9);
  };
  arrow(3,12,'left','GATE');arrow(15,4,'up','207');arrow(15,39,'down','MINE');
  const directory=map.props.find(prop=>prop.dialogue==='oreburghCityDirectory');
  if(directory){
    // Keep this ground-level map stand inside its one blocked tile.
    const x=directory.x*16,y=directory.y*16;
    rect(c,x+1,y,14,14,'#4d5e63');rect(c,x+2,y+1,12,11,'#d7c897');
    rect(c,x+7,y+3,2,7,'#718974');rect(c,x+4,y+5,7,2,'#718974');
    rect(c,x+3,y+4,3,3,'#ba775f');rect(c,x+10,y+4,2,3,'#77869a');
    rect(c,x+3,y+14,3,2,'#4d5e63');rect(c,x+10,y+14,3,2,'#4d5e63');
  }
  for(const [tx,ty,height] of [[38,32,25],[41,33,34],[43,32,22]] as const){const x=tx*16,y=ty*16;rect(c,x+3,y-height,10,height,'#4e5d61');rect(c,x+5,y-height+3,6,height-5,'#87938e');rect(c,x,y-height-4,16,6,'#3e4c52');rect(c,x+3,y-height-3,10,2,'#bec0aa');rect(c,x+5,y-7,6,7,'#3f4d51');}
  const sx=20*16,sy=33*16;rect(c,sx+5,sy-22,4,22,'#48565b');rect(c,sx,sy-24,14,8,'#34434a');rect(c,sx+3,sy-22,3,3,'#d7b957');rect(c,sx+8,sy-22,3,3,'#ba6658');
}

/** Oreburgh's chart and plants must not fall through to the center seat painter. */
export function paintOreburghCenterFurnishing(c:CanvasRenderingContext2D,o:Furnishing):boolean{
  if(o.event!=='oreburghCenterRouteChart'&&o.event!=='oreburghCenterVentPlant')return false;
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
  c.save();
  if(o.event==='oreburghCenterRouteChart'){
    rect(c,x+2,y+2,w-4,h-2,'#586a6c');rect(c,x+4,y+4,w-8,h-9,'#d9d0ae');
    label(c,'무쇠 회복 동선',x+w/2,y+13,'#485e61');
    const cx=x+Math.floor(w/2),cy=y+27;
    rect(c,cx-2,y+17,4,h-25,'#8c9d80');rect(c,x+14,cy-2,cx-x-12,4,'#8c9d80');
    rect(c,cx-7,cy-5,14,11,'#b66c5a');rect(c,cx-1,cy-3,2,7,'#f0e4bb');rect(c,cx-3,cy-1,6,2,'#f0e4bb');
    label(c,'서문',x+17,cy-5,'#485e61');label(c,'207',cx,y+22,'#485e61');label(c,'탄갱',cx,y+h-7,'#485e61');
    rect(c,x+6,y+h-5,w-12,2,'#b6bda1');
  }else{
    rect(c,x+2,y+h-11,w-4,11,'#576762');rect(c,x+4,y+h-9,w-8,6,'#ab9371');
    for(let px=x+10;px<x+w-7;px+=19){
      rect(c,px,y+h-10,8,2,'#726b50');rect(c,px+3,y+8,2,h-16,'#567854');
      rect(c,px-3,y+7,8,5,'#769b68');rect(c,px+5,y+11,8,4,'#648e63');
      rect(c,px+1,y+3,6,6,'#93af76');rect(c,px+2,y+4,3,2,'#bac18a');
    }
    rect(c,x+4,y+h-3,w-8,1,'#c2b394');
  }
  c.restore();return true;
}
