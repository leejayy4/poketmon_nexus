import type { TourBuilding } from './explore-world';

/** Project wetland facades fit their authored plot and put the threshold on the warp. */
export function paintIcirrusBuilding(c:CanvasRenderingContext2D,b:TourBuilding):boolean{
  const hall=b.room==='tour_icirrus_hall',home=b.room==='tour_icirrus_home1'||b.room==='tour_icirrus_home2';
  if(!hall&&!home)return false;
  const x=b.x*16,y=b.y*16,w=b.w*16,h=b.h*16,door=(b.door.x-b.x)*16,base=(b.door.y-b.y+1)*16;
  const r=(a:number,d:number,ww:number,hh:number,color:string)=>{c.fillStyle=color;c.fillRect(x+a,y+d,ww,hh);};
  c.save();
  try{
    c.beginPath();c.rect(x,y,w,h);c.clip();
    r(1,4,w-2,h-4,'#425952');r(4,7,w-8,h-11,'#aeb29a');
    // Stepped roof has an eave and gutter, not a recoloured copy of the common house.
    r(8,0,w-16,5,'#a5b9aa');r(4,5,w-8,9,'#64837b');r(1,14,w-2,4,'#385c57');
    for(let a=10;a<w-8;a+=12)r(a,6,1,7,'#8da599');
    r(4,h-8,w-8,8,'#64756b');r(4,h-9,w-8,2,'#d2c9a4');
    for(let a=6;a<w-8;a+=16)r(a,h-6,1,6,'#97a18b');
    if(hall){
      // Broad upper gallery overlooks the wetlands; lower bays leave the entrance clear.
      r(12,22,w-24,18,'#416d70');r(14,24,w-28,4,'#bed1bc');
      for(let a=12;a<w-12;a+=18)r(a,22,2,18,'#d0d0ad');
      for(const a of [14,w-42]){r(a,47,27,15,'#617e74');r(a+2,49,23,3,'#c1c8a6');}
      r(door-9,base-32,34,5,'#52746c');r(door-6,base-27,3,24,'#d1c9a7');r(door+19,base-27,3,24,'#d1c9a7');
    }else{
      for(const a of [12,w-29]){r(a,22,17,12,'#4c7879');r(a+2,24,13,3,'#c5d3b8');r(a+8,22,1,12,'#c1c5a2');}
      if(b.room==='tour_icirrus_home1'){
        // Drying rack stays against the wall, never extending into the approach tile.
        r(6,35,25,2,'#53654f');for(const a of [9,19]){r(a,29,7,9,'#d2c79d');r(a,37,7,1,'#9fa880');}
      }else{
        r(w-33,19,27,3,'#485f54');r(w-9,22,3,17,'#72846c');
        r(w-31,34,20,4,'#95a78a');r(w-28,30,3,5,'#597a66');
      }
    }
    // Door is drawn last to preserve a visible, exact sixteen-pixel entrance.
    r(door-2,base-25,20,25,'#40594f');r(door,base-23,16,23,'#887958');
    r(door+2,base-21,12,13,'#b6b795');r(door+11,base-9,2,2,'#e2d1a1');
    r(door,base-3,16,3,'#d8d0ad');
  }finally{c.restore();}
  return true;
}
