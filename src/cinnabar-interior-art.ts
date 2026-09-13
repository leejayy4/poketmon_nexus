import type { Furnishing,TourInterior } from './explore-interiors';
import type { GameMap } from './types';

/** Public laboratory zoning and real walkable return directions, below actors. */
export function paintCinnabarLabFloor(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_cinnabar_hall')return;
  const exit=map.warps.find(w=>w.to==='tour_cinnabar');
  if(!exit)return;
  const key=(x:number,y:number)=>`${x},${y}`;
  const toward=new Map<string,{x:number;y:number}>();
  const queue=[{x:exit.x,y:exit.y}];
  toward.set(key(exit.x,exit.y),exit);
  for(let i=0;i<queue.length;i++){
    const point=queue[i];
    for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){
      const x=point.x+dx,y=point.y+dy,k=key(x,y);
      if(map.walkable[y]?.[x]!=='.'||toward.has(k)||map.npcs.some(n=>n.x===x&&n.y===y))continue;
      toward.set(k,point);queue.push({x,y});
    }
  }
  c.save();
  // Floor inlays indicate public activities without adding a wall or locking a door.
  for(let y=3;y<map.height-2;y++)for(let x=2;x<map.width-2;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    c.fillStyle=x<7?'#bca387':x>9?'#87aaa7':'#bbc8b8';
    c.fillRect(x*16+1,y*16+14,14,1);
  }
  const painted=new Set<string>();
  for(const start of [{x:6,y:6},{x:10,y:6},{x:6,y:10}]){
    let point=start;
    for(let step=0;step<map.width*map.height;step++){
      const k=key(point.x,point.y),next=toward.get(k);
      if(!next||next.x===point.x&&next.y===point.y)break;
      if(!painted.has(k)){
        const dx=next.x-point.x,dy=next.y-point.y,px=point.x*16+8,py=point.y*16+8;
        c.strokeStyle='#437e71';c.lineWidth=2;c.beginPath();
        c.moveTo(px-dx*3-dy*3,py-dy*3+dx*3);c.lineTo(px+dx*2,py+dy*2);
        c.lineTo(px-dx*3+dy*3,py-dy*3-dx*3);c.stroke();painted.add(k);
      }
      point=next;
    }
  }
  c.restore();
}

/** Draw at the registered furnishing footprint, including the existing raised face. */
export function paintCinnabarFurnishing(c:CanvasRenderingContext2D,room:TourInterior,o:Furnishing,state={protection:true,control:true},clock=0):boolean{
  const sample=room.title==='화산 연구소'&&o.name==='화산암 표본';
  const circuit=room.title==='화산 연구소'&&o.name==='지열 관측 장치';
  const travel=room.title==='섬 여행자의 작업방'&&['가방 수선대','해안길 수첩'].includes(o.name);
  if(!sample&&!travel&&!circuit)return false;
  const x=o.x*16,y=o.y*16-8,w=o.w*16,h=o.h*16+8;
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const r=(a:number,b:number,width:number,height:number,color:string)=>{c.fillStyle=color;c.fillRect(x+a,y+b,width,height);};
  r(2,h-8,w-4,8,'#45515b');r(0,8,w,h-15,sample?'#8caaa5':'#956e50');
  r(1,3,w-2,12,sample?'#d4ded4':'#d1b481');r(3,h-12,w-6,3,'#c7c4a7');
  if(circuit){
    r(3,4,w-6,23,'#3c535b');
    r(6,7,12,12,state.protection?'#84aaa6':'#526065');
    if(state.protection&&Math.floor(clock*8)%2){
      for(let i=0;i<8;i++){r(8+i,9+i,2,2,'#d6e7cc');r(15-i,9+i,2,2,'#d6e7cc');}
    }else{r(10,8,3,10,'#d6e7cc');r(7,12,10,3,'#d6e7cc');}
    r(w-18,7,10,10,'#806e5e');r(w-16,9,6,6,state.control?'#f1d692':'#424f55');
    r(8,22,8,3,state.protection?'#8abeb2':'#4b595b');r(w-18,22,8,3,state.control?'#d4ad74':'#4b595b');
    r(11,19,2,4,'#8abeb2');r(w-15,17,2,6,'#d4ad74');
  }else if(sample){
    r(4,5,w/2-6,17,'#6c4542');r(5,6,w/2-8,3,'#b57d64');
    r(5,12,w/2-8,2,'#c68e6d');r(8,9,3,2,'#493b42');
    r(w/2+2,8,w/2-6,13,'#637579');r(w/2+5,5,w/2-12,3,'#a7b7b1');
    r(w/2+5,11,w/2-12,2,'#c8d4c6');
    r(5,24,w/2-8,3,'#f1e8c9');r(w/2+3,24,w/2-8,3,'#f1e8c9');
  }else if(o.name==='해안길 수첩'){
    r(4,5,w-8,19,'#f0e7c8');r(w/2,6,1,17,'#b79b71');
    r(7,9,w/2-10,2,'#6d9ead');r(9,10,2,9,'#6d9ead');r(10,18,w/2-13,2,'#6d9ead');
    for(let row=0;row<3;row++)r(w/2+4,9+row*4,w/2-10,1,'#7e8478');
  }else{
    r(5,7,16,17,'#486777');r(8,4,10,3,'#344c5a');r(7,15,12,2,'#d3b77d');
    r(w-15,7,8,8,'#e4d4aa');r(w-13,9,4,4,'#867055');
    r(w-17,20,12,2,'#d3d9cc');r(w-8,18,2,6,'#5e7379');
  }
  c.restore();return true;
}
