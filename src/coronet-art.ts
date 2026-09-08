import type {GameMap} from './types';

const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

// Quiet bedrock leaves the lighter footpath and green encounter grass readable.
// Tile coordinates keep the small chips fixed while the camera moves.
export function paintCoronetGround(c:CanvasRenderingContext2D,tx:number,ty:number){
  c.save();try{
    const x=tx*16,y=ty*16,seed=(tx*17+ty*29)%11;
    rect(c,x,y,16,16,'#a9ad98');
    if(seed<4){
      const dx=3+seed*2,dy=4+(tx+ty)%6;
      rect(c,x+dx,y+dy,4,1,'#929d8c');rect(c,x+dx+3,y+dy+1,2,1,'#929d8c');rect(c,x+dx,y+dy-1,3,1,'#c2c3a7');
    }else if(seed===7){rect(c,x+5,y+10,3,2,'#bfc1a5');rect(c,x+6,y+12,3,1,'#939d8b');}
  }finally{c.restore();}
}

export function paintCoronetPaths(c:CanvasRenderingContext2D,paths:Set<string>){
  c.save();try{
    for(const key of paths){
      const [tx,ty]=key.split(',').map(Number),x=tx*16,y=ty*16;
      rect(c,x,y,16,16,'#d2c6a2');
      if((tx+ty)%4===0){rect(c,x+5,y+6,6,1,'#e4d9b5');rect(c,x+7,y+11,3,1,'#b7af91');}
      if(!paths.has(`${tx},${ty-1}`)){rect(c,x,y,16,1,'#929d8b');rect(c,x,y+1,16,1,'#e4d9b5');}
      if(!paths.has(`${tx},${ty+1}`))rect(c,x,y+15,16,1,'#929d8b');
      if(!paths.has(`${tx-1},${ty}`))rect(c,x,y,1,16,'#b7af91');
      if(!paths.has(`${tx+1},${ty}`))rect(c,x+15,y,1,16,'#b7af91');
    }
  }finally{c.restore();}
}

// Strata share world coordinates across tiles. Only blocked perimeter cells are
// painted: no ledge or shadow may spill into a passable approach or warp.
export function paintCoronetBoundary(c:CanvasRenderingContext2D,map:GameMap){
  c.save();try{
    const exits=new Set(map.warps.map(w=>`${w.x},${w.y}`));
    const open=(x:number,y:number)=>map.walkable[y]?.[x]==='.'||exits.has(`${x},${y}`);
    for(let ty=0;ty<map.height;ty++)for(let tx=0;tx<map.width;tx++){
      if(!(tx<2||tx>=map.width-2||ty<3||ty>=map.height-2)||map.walkable[ty]?.[tx]!=='#'||open(tx,ty))continue;
      const x=tx*16,y=ty*16;
      rect(c,x,y,16,16,'#596b6a');
      for(let row=0;row<16;row++){
        const band=(y+row+Math.floor(tx/4)*3)%24;
        if(band<4)rect(c,x,y+row,16,1,'#b8bba2');
        else if(band<13)rect(c,x,y+row,16,1,'#8c9b8d');
        else if(band===14)rect(c,x,y+row,16,1,'#a5ac96');
      }
      if((tx+ty*3)%5===0){rect(c,x+9,y+4,2,6,'#647973');rect(c,x+7,y+9,3,2,'#647973');}
      if(open(tx,ty+1)){rect(c,x,y+13,16,1,'#c0c2a3');rect(c,x,y+14,16,2,'#495e5e');}
      if(open(tx,ty-1)){rect(c,x,y,16,2,'#d3cfb1');rect(c,x,y+2,16,2,'#a5ac96');}
      if(open(tx+1,ty)){rect(c,x+13,y,1,16,'#a5ac96');rect(c,x+14,y,2,16,'#495e5e');}
      if(open(tx-1,ty)){rect(c,x,y,2,16,'#d3cfb1');rect(c,x+2,y,1,16,'#8c9b8d');}
    }
  }finally{c.restore();}
}

function oval(c:CanvasRenderingContext2D,cx:number,cy:number,rx:number,ry:number,color:string){
  for(let y=-ry;y<=ry;y++){
    const span=Math.floor(rx*Math.sqrt(1-y*y/(ry*ry))),left=Math.max(0,cx-span),right=Math.min(256,cx+span+1);
    if(right>left)rect(c,left,cy+y,right-left,1,color);
  }
}

// Entirely behind actors and dialogue, with their usual footing retained.
export function paintCoronetBattleArena(c:CanvasRenderingContext2D){
  c.save();try{
    rect(c,0,0,256,192,'#b4b69e');rect(c,0,0,256,77,'#798b83');
    for(const [x,y,w,h] of [[0,0,61,49],[63,0,82,58],[148,0,108,43],[0,51,43,22],[46,60,94,18],[145,47,111,27]]){
      rect(c,x,y,w,h,'#9ba88f');rect(c,x,y,w,3,'#c6c8ac');rect(c,x,y+h-4,w,4,'#647973');
    }
    rect(c,23,8,3,18,'#798b83');rect(c,20,25,5,2,'#798b83');
    rect(c,180,10,2,23,'#798b83');rect(c,181,31,7,2,'#798b83');
    rect(c,0,77,256,5,'#8c9b8d');rect(c,0,82,256,3,'#c9c7a7');
    for(const [x,y] of [[8,93],[81,88],[133,99],[229,108],[93,123],[177,142],[16,157]]){
      rect(c,x,y,12,1,'#939d8b');rect(c,x+10,y+1,4,1,'#939d8b');rect(c,x+1,y-1,8,1,'#cfceb0');
    }
    oval(c,196,85,53,12,'#7d8e80');oval(c,196,82,51,10,'#d0c9a5');oval(c,196,80,45,7,'#bfc1a2');
    oval(c,59,135,70,19,'#7d8e80');oval(c,59,131,68,17,'#d0c9a5');oval(c,59,128,61,12,'#bfc1a2');
  }finally{c.restore();}
}
