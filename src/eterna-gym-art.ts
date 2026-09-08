import type { TourBuilding } from './explore-world';
import type { GameMap } from './types';
import { GYM_ROCKS } from './badge-maps';

/** A compact glass-roof gym within the former house's 73 × 85 pixel envelope. */
export function paintEternaGym(c:CanvasRenderingContext2D,b:TourBuilding):void {
  const x=b.x*16,y=(b.y+2)*16-85,door=b.door.x*16-x;
  const rect=(dx:number,dy:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x+dx,y+dy,w,h);};
  c.save();
  try {
    // The stone foundation ends at the same tile edge as the original house.
    rect(5,47,64,37,'#455a59');
    rect(7,49,58,32,'#a9ad91');
    rect(8,50,52,27,'#d0ceb0');
    rect(61,49,6,30,'#7b8f81');
    for(const row of [57,66,75]){
      rect(8,row,52,1,'#b0b49a');
      for(let column=10+(row===66?7:0);column<60;column+=14)rect(column,row-7,1,7,'#b5b9a0');
    }
    rect(5,80,64,3,'#6c8174');rect(7,80,58,1,'#c5cbb2');

    // Native-resolution scanlines form a broad, shallow roof instead of a
    // domestic gable. Paired glass panes keep the DS material and pixel scale.
    for(let row=0;row<35;row++){
      const inset=row<14?Math.max(0,10-Math.floor(row*10/14)):0;
      const left=3+inset,width=66-inset*2;
      rect(left,12+row,width,1,'#3f625b');
      if(row>1)rect(left+2,12+row,width-4,1,row<15?'#70a88a':row<27?'#599579':'#487d69');
      if(row>3&&row<30)rect(left+4,12+row,2,1,'#a3c5a1');
      if(row>4&&row<31)rect(64-inset,12+row,2,1,'#315951');
    }
    // Copper-green ribs, dark lower seams and narrow reflected strips.
    for(const column of [16,29,42,55]){
      rect(column,16,2,27,'#365e54');
      rect(column+2,17,1,24,'#b2cda7');
      rect(column+4,21,6,1,'#82b393');
      rect(column+4,25,4,1,'#72a88b');
    }
    rect(14,11,44,2,'#45645c');rect(15,12,42,1,'#c1d2aa');
    rect(7,29,58,2,'#3c6d5c');rect(8,29,56,1,'#9abc96');
    rect(2,45,68,4,'#405e57');rect(3,45,66,1,'#b9ccaa');rect(5,49,64,2,'#7e9682');

    // A raised leaf crest identifies the grass gym without adding another
    // text label. The existing renderer still draws GYM over the entrance.
    rect(27,32,18,12,'#3e6256');rect(29,31,14,14,'#3e6256');
    rect(29,33,14,9,'#d6d6b7');rect(31,32,10,11,'#d6d6b7');
    for(let row=0;row<7;row++){
      const width=[3,5,7,8,7,5,3][row];
      rect(32+Math.floor((8-width)/2),34+row,width,1,row<3?'#81aa58':'#527e4d');
    }
    rect(35,35,1,8,'#d0da97');rect(33,36,2,1,'#b8cd80');rect(36,38,2,1,'#b8cd80');

    // The door is aligned to its unchanged warp tile, including its sill.
    rect(door-3,51,24,32,'#789183');
    rect(door-2,52,22,29,'#d5d7bc');
    rect(door+1,62,16,19,'#3c6267');
    rect(door+2,63,14,15,'#729e9b');
    rect(door+3,64,12,2,'#c3dcd0');
    rect(door+8,63,1,16,'#436d70');
    rect(door+6,73,1,2,'#e2d7a4');rect(door+10,73,1,2,'#e2d7a4');
    rect(door,81,18,3,'#9aa693');rect(door+1,81,16,1,'#e0dcc0');

    // Deep window reveals and a planted ledge fit inside the stone footprint.
    rect(44,54,17,22,'#697f75');rect(45,54,15,2,'#e0dfc0');
    rect(46,57,12,15,'#3e696c');rect(47,58,10,12,'#80aaa0');
    rect(48,59,8,2,'#c1ddd0');rect(48,63,3,1,'#a8cdbb');
    rect(51,57,2,15,'#d2d4b5');rect(46,64,12,2,'#d2d4b5');
    rect(43,74,19,3,'#91a18a');rect(43,74,19,1,'#d5d7b7');
    for(const column of [45,50,55]){
      rect(column,72,4,2,'#56794d');rect(column+1,70,3,3,'#80a667');
    }
    rect(8,52,3,26,'#e0ddbd');rect(11,53,1,25,'#9faa91');
    rect(64,51,3,28,'#9aab91');rect(64,51,1,27,'#bfccb0');
  } finally {c.restore();}
}

function gardenRect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){
  c.fillStyle=color;c.fillRect(x,y,w,h);
}

function greenhouseWall(c:CanvasRenderingContext2D,width:number,height:number){
  const r=(x:number,y:number,w:number,h:number,color:string)=>gardenRect(c,x,y,w,h,color);
  r(0,0,width,height,'#4a6e63');
  for(let x=16;x<width-16;x+=32){
    r(x,7,27,height-13,'#71917b');r(x+2,9,23,height-17,'#a6bea0');
    r(x+3,10,21,3,'#c7d4af');r(x+3,14,3,height-23,'#bed0aa');
    r(x+13,10,2,height-19,'#759981');
    r(x+2,Math.floor(height/2),23,2,'#789a7f');
    r(x+25,8,2,height-15,'#526f60');
  }
  r(0,height-6,width,6,'#758e76');r(0,height-6,width,2,'#c6cbaa');
  for(const x of [4,width-14]){
    r(x,0,10,height,'#45685d');r(x+2,0,6,height-3,'#8fa98a');r(x+2,1,1,height-5,'#c4cfaa');
  }
}

/** Low foliage stays entirely on the old blocked rock tiles. */
export function paintEternaGymPlanters(c:CanvasRenderingContext2D):void {
  c.save();
  try {
    for(const [tx,ty,tw,th] of GYM_ROCKS){
      const x=tx*16,y=ty*16,w=tw*16,h=th*16;
      const r=(dx:number,dy:number,rw:number,rh:number,color:string)=>gardenRect(c,x+dx,y+dy,rw,rh,color);
      r(0,0,w,h,'#526d5b');r(1,1,w-2,h-3,'#b2b798');
      r(3,3,w-6,h-9,'#6d7751');r(4,4,w-8,h-11,'#8c9064');
      for(let py=5;py<h-10;py+=10)for(let px=5;px<w-9;px+=12){
        r(px,py+2,9,6,'#426e4b');r(px+2,py,6,8,'#5d8b52');
        r(px+1,py+2,7,3,'#80a563');r(px+3,py+1,3,1,'#b4c887');
        r(px+6,py+4,2,3,'#4a784c');
      }
      r(2,h-7,w-4,2,'#d1cfab');r(2,h-5,w-4,3,'#909e7e');
      for(let px=12;px<w-3;px+=12)r(px,h-5,1,3,'#6f836b');
    }
  } finally {c.restore();}
}

/** Background-only painting: no map, NPC, collision or save changes. */
export function paintEternaGymInterior(c:CanvasRenderingContext2D,map:Pick<GameMap,'width'|'height'|'walkable'>):void {
  c.save();
  try {
    const width=map.width*16,height=map.height*16;
    gardenRect(c,0,0,width,height,'#48675c');
    for(let ty=3;ty<map.height-2;ty++)for(let tx=2;tx<map.width-2;tx++){
      const x=tx*16,y=ty*16;
      gardenRect(c,x,y,16,16,(tx+ty)%2?'#bfc5a7':'#c7cbb0');
      gardenRect(c,x,y,16,1,'#a9b396');gardenRect(c,x+2,y+2,12,1,'#d4d7b9');
    }
    greenhouseWall(c,width,48);
    for(const x of [16,width-32]){
      gardenRect(c,x,48,16,height-48,'#66856d');gardenRect(c,x+3,49,2,height-50,'#9eaf8b');
      for(let y=63;y<height;y+=16)gardenRect(c,x,y,16,1,'#466858');
    }
    // The original central approach remains visible all the way to the door.
    for(let ty=3;ty<map.height;ty++)for(const tx of [7,8,9]){
      if(map.walkable[ty]?.[tx]!=='.')continue;
      const x=tx*16,y=ty*16;
      gardenRect(c,x,y,16,16,'#d8d0ac');gardenRect(c,x+1,y+1,14,1,'#ebe0bb');
      gardenRect(c,x,y+15,16,1,'#b5b28e');
    }
    // A small court border frames the leader's existing tile, without a dais
    // or step that would imply a new collision or interaction.
    gardenRect(c,111,57,1,30,'#8da17a');gardenRect(c,160,57,1,30,'#8da17a');
    gardenRect(c,112,85,48,2,'#8da17a');
    paintEternaGymPlanters(c);
  } finally {c.restore();}
}

/** Static background drawn before either battle actor and the existing HUD. */
export function paintEternaGymBattleArena(c:CanvasRenderingContext2D):void {
  c.save();
  try {
    greenhouseWall(c,256,64);
    gardenRect(c,0,64,256,128,'#b8c3a0');
    for(let y=72;y<192;y+=16){
      gardenRect(c,0,y,256,1,'#a7b592');
      for(let x=(y%32?8:24);x<256;x+=32)gardenRect(c,x,y-7,1,7,'#aebc99');
    }
    // Distant low planting beds establish an indoor garden, without tall
    // silhouettes crossing the platform or actor positions.
    for(const x of [0,85,170]){
      gardenRect(c,x,64,80,8,'#6c8767');gardenRect(c,x,71,80,3,'#d0cda7');
      for(let leaf=x+3;leaf<x+75;leaf+=12){
        gardenRect(c,leaf,65,8,4,'#89a674');gardenRect(c,leaf+2,64,4,2,'#a7bd88');
      }
    }
    const oval=(x:number,y:number,rx:number,ry:number,color:string)=>{
      for(let row=-ry;row<=ry;row++){
        const half=Math.floor(rx*Math.sqrt(Math.max(0,1-row*row/(ry*ry))));
        const left=Math.max(0,x-half),right=Math.min(256,x+half+1);
        if(right>left)gardenRect(c,left,y+row,right-left,1,color);
      }
    };
    for(const [x,y,rx,ry] of [[196,84,53,12],[59,133,70,19]]){
      oval(x,y+3,rx,ry,'#69836c');oval(x,y,rx,ry,'#9eaf84');
      oval(x,y-1,rx-3,ry-3,'#d5d0aa');oval(x,y-2,rx-7,ry-5,'#b9c29a');
      gardenRect(c,Math.max(0,x-rx+15),y-3,rx-19,1,'#e4dec0');
      gardenRect(c,x+9,y+4,rx-21,1,'#90a17b');
    }
  } finally {c.restore();}
}
