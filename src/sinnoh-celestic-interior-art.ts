import type { Furnishing } from './explore-interiors';
import type { GameMap } from './types';

const r=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};

/** Walkable floor decoration only; furniture and collision retain their existing coordinates. */
export function paintCelesticInteriorFloor(c:CanvasRenderingContext2D,map:GameMap){
  const shop=map.id==='tour_celestic_shop',home=map.id==='tour_celestic_home';
  if(!shop&&!home)return;
  c.save();
  for(let y=3;y<map.height-2;y++)for(let x=2;x<map.width-2;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    const px=x*16,py=y*16;
    if(shop){
      // Goods aisle and counter approach are visually distinct from the side floorboards.
      const aisle=x>=10&&x<=13&&y>=7;
      r(c,px,py,16,16,aisle?'#b7b5a0':'#af9675');
      r(c,px,py+15,16,1,aisle?'#999e8a':'#8c795f');
      if(!aisle)r(c,px+(y%2?5:12),py,1,15,'#927b61');
      if(y===12&&(x<9||x>14)){r(c,px+2,py+3,12,10,'#c6b691');r(c,px+3,py+4,10,1,'#e2cfaa');}
    }else{
      // Woven reading mats surround the records; the center lane and exit remain clear.
      const mat=y>=9&&y<=11&&(x<=8||x>=15);
      r(c,px,py,16,16,mat?'#b8b98c':'#b69c77');
      for(let i=3;i<16;i+=4)r(c,px,py+i,16,1,mat?'#a3aa7e':'#9d8567');
      if(mat)r(c,px,py,1,16,'#647e6c');
    }
  }
  c.restore();
}

/** Existing furnishing events identify the physical prop, without changing its interaction. */
export function paintCelesticFurnishing(c:CanvasRenderingContext2D,o:Furnishing):boolean{
  if(o.event==='martClerk'&&o.name==='봉신 생활 상점 판매대'){
    const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
    c.save();c.beginPath();c.rect(x,y-4,w,h+4);c.clip();
    r(c,x,y,w,h,'#806b50');r(c,x+2,y+3,w-4,h-5,'#b39a73');
    r(c,x,y-4,w,7,'#ddc59c');
    // Storage drawers under the top, sample boxes left, till right.
    for(let i=5;i<w-12;i+=22){r(c,x+i,y+5,18,h-7,'#9d835f');r(c,x+i+6,y+7,6,2,'#e2cba0');}
    for(let i=0;i<3;i++){r(c,x+7+i*12,y-3,9,5,'#8f9e7a');r(c,x+8+i*12,y-2,7,1,'#d5d4ac');}
    r(c,x+w-27,y-4,20,8,'#617b70');r(c,x+w-24,y-3,12,3,'#b9c7a2');
    c.restore();return true;
  }
  const events=['tourCelesticShopShelf','tourCelesticShopLedger','tourCelesticFamilyRecord','tourCelesticFamilyMap','tourCelesticFamilyRest'];
  if(!events.includes(o.event))return false;
  const x=o.x*16,y=o.y*16-8,w=o.w*16,h=o.h*16+8;
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  r(c,x+2,y+h-5,w-2,5,'#48574c');
  if(o.event==='tourCelesticShopShelf'){
    r(c,x,y+2,w,h-5,'#806c52');r(c,x+3,y+5,w-6,h-11,'#ac9674');
    for(let shelf=0;shelf<2;shelf++){
      const sy=y+5+shelf*15;
      for(let i=6;i<w-12;i+=17){
        if(shelf===0){
          r(c,x+i,sy+2,10,9,'#e8e2bf');r(c,x+i,sy+2,10,4,'#af6656');
          r(c,x+i,sy+6,10,1,'#4f5b52');r(c,x+i+4,sy+5,3,3,'#eae7d6');
        }else{
          r(c,x+i+1,sy+3,8,8,'#84a6a0');r(c,x+i+3,sy,4,4,'#d4cec0');
          r(c,x+i+3,sy+6,4,3,'#e5d8ad');
        }
      }
      r(c,x+2,sy+12,w-4,3,'#d2b88b');
    }
  }else if(o.event==='tourCelesticFamilyRecord'){
    r(c,x,y+1,w,h-4,'#776a56');
    for(let j=4;j<h-8;j+=15){
      r(c,x+3,y+j,w-6,12,'#495e52');
      for(let i=5;i<w-8;i+=7){r(c,x+i,y+j+2,5,10,(i+j)%3?'#bfb293':'#899c88');r(c,x+i+1,y+j+4,3,1,'#e0cfaa');}
      r(c,x+2,y+j+12,w-4,2,'#b5a180');
    }
  }else if(o.event==='tourCelesticFamilyRest'){
    for(let i=0;i<3;i++){
      const bx=x+i*w/3;
      r(c,bx+3,y+10,w/3-6,h-16,'#7e9076');r(c,bx+5,y+12,w/3-10,h-21,'#c8bd94');
      r(c,bx+8,y+16,3,3,'#9d9f7e');r(c,bx+w/3-11,y+16,3,3,'#9d9f7e');
    }
  }else{
    // A low work desk, rather than the generic laboratory chart cabinet.
    r(c,x+4,y+h-12,5,10,'#695e4c');r(c,x+w-9,y+h-12,5,10,'#695e4c');
    r(c,x,y+8,w,h-18,'#9b825f');r(c,x+2,y+9,w-4,h-22,'#c0a67e');
    r(c,x+8,y+11,w-24,h-27,'#e3dab6');
    if(o.event==='tourCelesticFamilyMap'){
      for(let i=13;i<w-24;i+=13){r(c,x+i,y+14,7,3,'#88947c');r(c,x+i+2,y+12,3,2,'#88947c');}
      r(c,x+11,y+23,w-33,2,'#a18b61');r(c,x+w-28,y+18,3,8,'#a18b61');
    }else{
      for(let j=15;j<h-16;j+=5)r(c,x+12,y+j,w-34,1,'#989a80');
      r(c,x+w/2,y+12,1,h-29,'#b7a98a');
    }
    r(c,x+w-12,y+13,2,11,'#5d7165');
  }
  c.restore();return true;
}
