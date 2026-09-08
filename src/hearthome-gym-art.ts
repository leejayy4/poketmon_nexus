import type {TourBuilding} from './explore-world';
import type {GameMap} from './types';
import {GYM_ROCKS} from './badge-maps';

const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** Stone theatre inside the existing house's 73 by 85 pixel drawing envelope. */
export function paintHearthomeGym(c:CanvasRenderingContext2D,b:TourBuilding):void{
  c.save();try{
    const x=b.x*16,y=(b.y+2)*16-85,door=b.door.x*16-x;
    const r=(dx:number,dy:number,w:number,h:number,color:string)=>rect(c,x+dx,y+dy,w,h,color);
    r(4,45,65,39,'#555461');r(7,47,59,34,'#b4adb2');r(9,49,53,29,'#d5cbbd');
    for(const row of [56,64,72]){r(9,row,53,1,'#b8b0ad');for(let col=12+(row===64?7:0);col<60;col+=14)r(col,row-6,1,6,'#c3b9b2');}
    // A broad stepped roof and cornice read as a public hall, at DS pixel scale.
    for(let row=0;row<37;row++){
      const inset=Math.max(0,9-Math.floor(row/2));
      r(3+inset,8+row,67-inset*2,1,'#514d65');
      if(row>1)r(5+inset,8+row,63-inset*2,1,row<13?'#a18da3':row<25?'#89778f':'#72677f');
    }
    for(const col of [19,34,49]){r(col,13,2,28,'#655c76');r(col+2,14,1,25,'#b2a0b2');}
    r(14,7,45,3,'#625b70');r(15,7,43,1,'#d0c0bf');
    r(2,43,69,5,'#595464');r(3,43,67,2,'#d2c6b9');r(6,48,61,2,'#9b9098');
    // A small spectral crest is part of the roof; the renderer owns GYM text.
    r(29,27,16,15,'#514d65');r(31,25,12,19,'#514d65');r(31,28,12,12,'#cfc5bd');
    r(34,30,6,2,'#82738d');r(33,32,8,6,'#82738d');r(32,37,3,3,'#82738d');r(36,37,3,2,'#82738d');r(40,36,2,4,'#82738d');
    r(34,33,2,2,'#e8deca');r(38,33,2,2,'#e8deca');
    // Door and threshold are derived from the existing warp, including its left offset.
    r(door-3,53,24,29,'#8d8492');r(door-2,52,22,28,'#e0d4c1');r(door+1,58,16,22,'#565671');
    r(door+3,56,12,3,'#565671');r(door+2,61,14,18,'#8c839e');r(door+3,62,12,2,'#c5b5c0');
    r(door+8,61,1,18,'#5d596f');r(door+6,72,1,2,'#e5cf9c');r(door+10,72,1,2,'#e5cf9c');
    r(door,80,18,4,'#97929b');r(door+1,80,16,1,'#e7dbc5');
    // Recessed arched window and narrow columns stay within the old footprint.
    r(44,54,17,22,'#928a98');r(47,52,11,3,'#b1a8ad');r(47,55,11,17,'#5e6179');r(49,53,7,3,'#5e6179');
    r(48,56,9,13,'#9aa0af');r(49,56,7,2,'#d2ced1');r(51,55,2,16,'#d9cebe');r(47,63,11,2,'#d9cebe');
    r(43,73,19,3,'#d7cbb9');r(44,76,17,2,'#a59ca3');
    for(const col of [7,64]){r(col,50,3,29,'#ded2c0');r(col+3,51,1,28,'#918995');}
    r(4,82,65,2,'#655f6d');r(6,81,9,1,'#ded2c0');r(37,81,28,1,'#ded2c0');
  }finally{c.restore();}
}

function hallWall(c:CanvasRenderingContext2D,width:number,height:number){
  rect(c,0,0,width,height,'#625d75');
  for(let x=16;x<width-16;x+=48){
    const w=Math.min(40,width-16-x);
    if(w<12)continue;
    rect(c,x,8,w,height-14,'#aaa0b0');rect(c,x+3,10,w-6,height-19,'#797489');
    rect(c,x+7,7,w-14,5,'#c5b9bb');rect(c,x+5,11,w-10,height-22,'#9695a7');
    rect(c,x+8,12,w-16,2,'#d3c8c4');
    // Gathered curtains leave a bright central recess instead of a black void.
    rect(c,x+3,13,7,height-22,'#7f6380');rect(c,x+w-10,13,7,height-22,'#7f6380');
    rect(c,x+4,14,2,height-24,'#aa85a0');rect(c,x+w-7,14,2,height-24,'#aa85a0');
    rect(c,x+3,height-18,7,2,'#ceb995');rect(c,x+w-10,height-18,7,2,'#ceb995');
    rect(c,x+1,height-7,w-2,2,'#d6cabb');
  }
  rect(c,0,height-5,width,5,'#797084');rect(c,0,height-5,width,2,'#c3b7b6');
  for(const x of [4,width-14]){rect(c,x,0,10,height,'#8f8599');rect(c,x+2,0,3,height-3,'#c8bcbb');}
}

/** Low ornamental plinths occupy exactly the former three blocked rock areas. */
export function paintHearthomeGymPlinths(c:CanvasRenderingContext2D):void{
  c.save();try{
    for(const [tx,ty,tw,th] of GYM_ROCKS){
      const x=tx*16,y=ty*16,w=tw*16,h=th*16;
      rect(c,x,y,w,h,'#655f73');rect(c,x+1,y+1,w-2,h-3,'#a49aa7');rect(c,x+3,y+3,w-6,h-10,'#d1c6bd');
      rect(c,x+5,y+5,w-10,h-14,'#8f758f');rect(c,x+6,y+5,w-12,1,'#b49aac');
      const cx=x+Math.floor(w/2),cy=y+Math.floor((h-8)/2);
      for(let row=-4;row<=4;row++){const span=4-Math.abs(row);rect(c,cx-span,cy+row,span*2+1,1,'#d8c8ac');}
      rect(c,cx-1,cy-2,3,5,'#b39bae');rect(c,x+2,y+h-8,w-4,2,'#e0d3bf');rect(c,x+3,y+h-5,w-6,2,'#81758c');
    }
  }finally{c.restore();}
}

/** Paint-only room; every valid tile, exit and actor remains in its old place. */
export function paintHearthomeGymInterior(c:CanvasRenderingContext2D,map:Pick<GameMap,'width'|'height'|'walkable'>):void{
  c.save();try{
    const width=map.width*16,height=map.height*16;
    rect(c,0,0,width,height,'#625d75');
    for(let ty=3;ty<map.height-2;ty++)for(let tx=2;tx<map.width-2;tx++){
      rect(c,tx*16,ty*16,16,16,'#bcb7be');
      if(ty%2===1)rect(c,tx*16,ty*16+15,16,1,'#aaa4b1');
      if(tx%2===0)rect(c,tx*16,ty*16,1,16,'#aaa4b1');
      if((tx+ty)%5===0)rect(c,tx*16+5,ty*16+7,6,1,'#d2cbcc');
    }
    hallWall(c,width,48);
    for(const x of [16,width-32]){rect(c,x,48,16,height-48,'#80758c');rect(c,x+3,49,2,height-50,'#b9abb6');}
    for(let ty=3;ty<map.height;ty++)for(const tx of [7,8,9]){
      if(map.walkable[ty]?.[tx]!=='.')continue;
      const x=tx*16,y=ty*16;
      rect(c,x,y,16,16,'#97758e');
      if(tx===7||ty>=map.height-2)rect(c,x+1,y,2,16,'#cfb898');
      if(tx===9||ty>=map.height-2)rect(c,x+13,y,2,16,'#cfb898');
      if(ty%3===0&&tx===8){rect(c,x+7,y+5,2,6,'#bba0ac');rect(c,x+5,y+7,6,2,'#bba0ac');}
    }
    paintHearthomeGymPlinths(c);
  }finally{c.restore();}
}

/** The hall is one background pass, below all battle actors and HUD text. */
export function paintHearthomeGymBattleArena(c:CanvasRenderingContext2D):void{
  c.save();try{
    hallWall(c,256,64);rect(c,0,64,256,128,'#b7afbc');
    for(let y=79;y<192;y+=24){rect(c,0,y,256,1,'#a299ae');for(let x=y%48?16:40;x<256;x+=48)rect(c,x,y-14,1,14,'#aaa0b3');}
    rect(c,0,69,256,3,'#d4c1ac');rect(c,0,72,256,5,'#97758e');
    const oval=(cx:number,cy:number,rx:number,ry:number,color:string)=>{
      for(let y=-ry;y<=ry;y++){
        const span=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry)))),left=Math.max(0,cx-span),right=Math.min(256,cx+span+1);
        if(right>left)rect(c,left,cy+y,right-left,1,color);
      }
    };
    for(const [x,y,rx,ry] of [[196,84,53,12],[59,133,70,19]]){
      oval(x,y+3,rx,ry,'#756b85');oval(x,y,rx-1,ry-1,'#d2c3b2');oval(x,y-2,rx-5,ry-4,'#b09aaa');
      rect(c,Math.max(0,x-rx+17),y-3,rx-22,1,'#e3d1bd');
    }
  }finally{c.restore();}
}
