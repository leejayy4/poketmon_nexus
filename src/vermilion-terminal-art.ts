import type {TourBuilding} from './explore-world';

/** Passenger terminal inside the existing city hall's 148 by 188 envelope. */
export function paintVermilionTerminal(c:CanvasRenderingContext2D,b:TourBuilding):void{
  c.save();try{
    const x=b.door.x*16+8-74,y=(b.door.y+1)*16-188,door=b.door.x*16-x;
    const r=(dx:number,dy:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x+dx,y+dy,w,h);};
    // A pale masonry terminal, with its lower wall and sill ending at the old door.
    r(9,67,130,117,'#657c78');r(12,69,124,111,'#c1b99b');r(15,71,117,105,'#e0d2b0');
    r(131,72,5,106,'#a1a78e');
    for(const row of [82,98,114,130,146,162,176]){
      r(15,row,116,1,'#c8bda1');
      for(let col=18+(row%4?8:0);col<127;col+=18)r(col,row-11,1,11,'#d1c5a7');
    }
    // Broad hipped tile roof: warm orange tiles, narrow seams and a dark eave.
    for(let row=0;row<55;row++){
      const inset=Math.max(0,24-Math.floor(row*3/5));
      r(3+inset,13+row,142-inset*2,1,'#825f50');
      if(row>2)r(5+inset,13+row,138-inset*2,1,row<19?'#dc9c67':row<38?'#c68157':'#ae714f');
      if(row>4&&row%8===0)r(6+inset,13+row,136-inset*2,1,'#edbb83');
    }
    r(27,11,94,4,'#946b50');r(29,11,90,1,'#f0c894');
    for(const col of [43,65,87,109])for(let row=22;row<63;row+=8){r(col,row,1,6,'#aa7050');r(col+1,row,1,5,'#e0a373');}
    r(2,67,144,6,'#64716a');r(4,67,140,2,'#e6d4ad');r(8,73,132,3,'#b8aa89');
    // Upper passenger-hall windows retain DS-sized panes and recess shadows.
    for(const left of [23,91]){
      r(left,84,33,35,'#b0aa92');r(left+2,86,29,29,'#597f83');r(left+3,87,27,26,'#8ab4b0');
      r(left+4,88,25,3,'#c4dad0');r(left+5,93,3,16,'#a7ccc0');
      for(const col of [10,20])r(left+col,86,2,29,'#d8ccad');r(left+2,99,29,2,'#d8ccad');
      r(left-2,116,37,4,'#e8d8b5');r(left,120,33,2,'#b7aa8e');
    }
    // Round maritime window above the awning, made from native pixel scanlines.
    for(let row=-11;row<=11;row++){
      const span=Math.floor(Math.sqrt(121-row*row));r(74-span,101+row,span*2+1,1,'#87988e');
      if(Math.abs(row)<9){const inner=Math.floor(Math.sqrt(81-row*row));r(74-inner,101+row,inner*2+1,1,'#d9ceb1');}
      if(Math.abs(row)<7){const glass=Math.floor(Math.sqrt(49-row*row));r(74-glass,101+row,glass*2+1,1,'#739fa3');}
    }
    r(70,96,8,2,'#bedbd1');r(73,95,2,13,'#d6d2b4');r(68,100,13,2,'#d6d2b4');
    r(13,125,122,4,'#91a296');r(14,125,120,1,'#e7d9b6');
    // A shallow entrance canopy, with clear glass doors below rather than a
    // second facade label; the field renderer retains the facility name.
    r(39,143,70,15,'#597574');
    for(let row=0;row<12;row++){
      const inset=Math.max(0,6-Math.floor(row/2));r(39+inset,133+row,70-inset*2,1,row<6?'#d89864':'#bd7a53');
    }
    for(const col of [53,69,85,101])r(col,135,1,9,'#f0bb84');
    r(38,145,72,4,'#ece0bd');r(40,149,68,2,'#73928a');
    // Low side windows and slim masonry piers anchor the public frontage.
    for(const left of [22,101]){
      r(left,138,23,31,'#a39f8a');r(left+2,140,19,25,'#5d8182');r(left+3,141,17,22,'#95b6aa');
      r(left+4,142,15,2,'#cbdccd');r(left+11,140,2,25,'#d9cdae');r(left+2,153,19,2,'#d9cdae');
      r(left-1,166,25,4,'#ddd1ad');
    }
    for(const col of [14,129]){r(col,130,4,47,'#ebe0bf');r(col+4,130,1,47,'#b5ad91');}
    for(const col of [43,102]){r(col,151,3,27,'#d7ccb0');r(col+3,151,1,27,'#9aaa96');}
    r(door-6,151,28,32,'#a4af9c');r(door-4,153,24,30,'#e2d8b8');r(door,157,16,27,'#507b80');
    r(door+1,158,14,24,'#8eb6b0');r(door+2,159,12,3,'#c9dfd0');r(door+7,157,2,27,'#d7d8ba');
    r(door+5,172,1,3,'#f2dfad');r(door+10,172,1,3,'#f2dfad');
    r(8,179,132,5,'#8b9c8b');r(10,179,128,1,'#d8ccaa');
    r(door-3,183,22,4,'#acb6a0');r(door-2,183,20,1,'#e9dfbe');
  }finally{c.restore();}
}
