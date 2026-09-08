import type {TourBuilding} from './explore-world';
import type {GameMap} from './types';
import {GYM_ROCKS} from './badge-maps';

const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** Matches the urban house's 81 by 108 envelope and its centred door tile. */
export function paintVeilstoneGym(c:CanvasRenderingContext2D,b:TourBuilding):void{
  c.save();try{
    const x=b.door.x*16+8-40,y=(b.door.y+1)*16-108,door=b.door.x*16-x;
    const r=(dx:number,dy:number,w:number,h:number,color:string)=>rect(c,x+dx,y+dy,w,h,color);
    r(5,51,71,54,'#5d615b');r(8,53,65,48,'#9b886b');r(10,54,60,43,'#d9cba5');
    for(const row of [67,82,94])r(10,row,60,1,'#b6a984');
    // Low, broad tile roof and timber eaves distinguish the training hall.
    for(let row=0;row<44;row++){
      const inset=Math.max(0,22-Math.floor(row*3/4));
      r(2+inset,8+row,77-inset*2,1,'#615c55');
      if(row>1)r(4+inset,8+row,73-inset*2,1,row<14?'#b19673':row<30?'#938264':'#786e59');
      if(row>3&&row%7===0)r(4+inset,8+row,73-inset*2,1,'#c6b18d');
    }
    r(25,6,31,3,'#696051');r(26,6,29,1,'#d6c29c');
    r(1,50,79,4,'#5a594e');r(3,50,75,1,'#d3bd92');r(7,54,67,4,'#8a7152');r(9,55,63,1,'#c8aa7c');
    // Belt-shaped crest, without adding another label above the existing GYM.
    r(30,35,21,14,'#5c5e52');r(32,34,17,16,'#5c5e52');r(32,36,17,11,'#d6c7a1');
    r(35,39,11,3,'#9d7457');r(38,38,4,5,'#6c6654');r(36,42,3,3,'#9d7457');r(43,42,3,3,'#9d7457');
    for(const col of [8,25,53,70]){r(col,58,3,40,'#887052');r(col,58,1,39,'#c4a57b');}
    for(const col of [12,57]){
      r(col,64,12,23,'#796f59');r(col+1,65,10,20,'#b9c1ae');r(col+2,66,8,2,'#e0dfc2');
      r(col+5,65,1,20,'#8e8c71');r(col+1,74,10,1,'#8e8c71');r(col-1,88,14,3,'#c6b28d');
    }
    r(door-4,59,25,43,'#846f54');r(door-2,61,21,39,'#d8c79f');
    r(door,69,17,31,'#626c60');r(door+1,70,15,28,'#a9b5a1');
    r(door+2,71,13,2,'#d7ddbc');r(door+8,70,1,29,'#687767');r(door+1,82,15,2,'#87957d');
    r(door+6,87,1,3,'#ebd4a1');r(door+10,87,1,3,'#ebd4a1');
    r(5,101,71,4,'#7b7765');r(7,101,67,1,'#d2c4a3');r(door,100,18,5,'#a5a28c');r(door+1,100,16,1,'#e1d6b5');
  }finally{c.restore();}
}

function dojoWall(c:CanvasRenderingContext2D,width:number,height:number){
  rect(c,0,0,width,height,'#8b785c');
  for(let x=16;x<width-16;x+=48){
    const w=Math.min(40,width-16-x);if(w<12)continue;
    rect(c,x,8,w,height-16,'#746a54');rect(c,x+2,10,w-4,height-20,'#d4d2b0');
    rect(c,x+3,11,w-6,2,'#ece3bd');
    for(let col=x+10;col<x+w-3;col+=10)rect(c,col,10,1,height-20,'#a59c7d');
    for(let row=20;row<height-12;row+=10)rect(c,x+2,row,w-4,1,'#a59c7d');
  }
  rect(c,0,height-7,width,7,'#876d4e');rect(c,0,height-7,width,2,'#c9ac7e');
  for(const x of [4,width-14]){rect(c,x,0,10,height,'#7a634a');rect(c,x+2,0,2,height-2,'#b6956b');}
}

/** Solid low equipment platforms remain inside the former blocked rock tiles. */
export function paintVeilstoneGymEquipment(c:CanvasRenderingContext2D):void{
  c.save();try{
    for(const [tx,ty,tw,th] of GYM_ROCKS){
      const x=tx*16,y=ty*16,w=tw*16,h=th*16;
      rect(c,x,y,w,h,'#6e705b');rect(c,x+1,y+1,w-2,h-3,'#b79c71');rect(c,x+3,y+3,w-6,h-9,'#d8c197');
      for(let yy=y+6;yy<y+h-12;yy+=4){rect(c,x+5,yy,w-10,2,'#9ca37c');rect(c,x+5,yy,w-10,1,'#c9c8a0');}
      rect(c,x+Math.floor(w/2)-2,y+5,4,h-14,'#7e8266');
      rect(c,x+2,y+h-8,w-4,2,'#e0c69b');rect(c,x+3,y+h-5,w-6,2,'#896f50');
    }
  }finally{c.restore();}
}

/** Light wood and a joined mat lane keep the unchanged approaches readable. */
export function paintVeilstoneGymInterior(c:CanvasRenderingContext2D,map:Pick<GameMap,'width'|'height'|'walkable'>):void{
  c.save();try{
    const width=map.width*16,height=map.height*16;rect(c,0,0,width,height,'#786b52');
    for(let ty=3;ty<map.height-2;ty++)for(let tx=2;tx<map.width-2;tx++){
      const x=tx*16,y=ty*16;rect(c,x,y,16,16,'#c5ae84');rect(c,x,y+15,16,1,'#a68d69');
      if((tx+ty)%3===0)rect(c,x+2,y+5,10,1,'#ddc497');
      if(tx%3===ty%3)rect(c,x,y,1,15,'#b49a73');
    }
    dojoWall(c,width,48);
    for(const x of [16,width-32]){rect(c,x,48,16,height-48,'#8c7454');rect(c,x+3,49,2,height-50,'#c0a174');}
    for(let ty=3;ty<map.height;ty++)for(const tx of [7,8,9]){
      if(map.walkable[ty]?.[tx]!=='.')continue;
      const x=tx*16,y=ty*16;rect(c,x,y,16,16,'#b3bc8e');
      if(tx===7||ty>=map.height-2)rect(c,x,y,2,16,'#778768');
      if(tx===9||ty>=map.height-2)rect(c,x+14,y,2,16,'#778768');
      if(ty%2===0)rect(c,x,y,16,1,'#889773');
      rect(c,x+3,y+7,10,1,'#c7cea2');
    }
    paintVeilstoneGymEquipment(c);
  }finally{c.restore();}
}

/** Static interior, painted before both Pokemon and the existing battle HUD. */
export function paintVeilstoneGymBattleArena(c:CanvasRenderingContext2D):void{
  c.save();try{
    dojoWall(c,256,64);rect(c,0,64,256,128,'#c3ab80');
    for(let y=77;y<192;y+=16){rect(c,0,y,256,1,'#a28a65');for(let x=y%32?24:56;x<256;x+=64)rect(c,x,y-15,1,15,'#b2976e');}
    rect(c,0,68,256,5,'#8d7856');rect(c,0,68,256,1,'#dbc295');
    const oval=(cx:number,cy:number,rx:number,ry:number,color:string)=>{
      for(let y=-ry;y<=ry;y++){
        const span=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry)))),left=Math.max(0,cx-span),right=Math.min(256,cx+span+1);
        if(right>left)rect(c,left,cy+y,right-left,1,color);
      }
    };
    for(const [x,y,rx,ry] of [[196,84,53,12],[59,133,70,19]]){
      oval(x,y+3,rx,ry,'#7f7859');oval(x,y,rx-1,ry-1,'#738767');oval(x,y-2,rx-5,ry-4,'#b9c394');
      rect(c,Math.max(0,x-rx+17),y-3,rx-22,1,'#d6d9aa');
    }
  }finally{c.restore();}
}
