import type {GameMap} from './types';
import type {Furnishing} from './explore-interiors';

const T=16;
const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** Room details are flat floor treatments or mounted inside the north wall. */
export function paintCherrygroveInterior(c:CanvasRenderingContext2D,map:GameMap){
  const home=map.id==='tour_cherrygrove_home1'||map.id==='tour_cherrygrove_home2';
  if(!home&&map.id!=='tour_cherrygrove_center'&&map.id!=='tour_cherrygrove_mart')return;
  const center=map.id==='tour_cherrygrove_center';
  const floor=(x:number,y:number,w:number,h:number,color:string)=>{
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
      if(map.walkable[yy]?.[xx]!=='.')continue;
      rect(c,xx*T,yy*T,T,T,color);
      rect(c,xx*T,yy*T+15,T,1,home?'#b6a17f':'#bcc9bd');
    }
  };
  if(home){
    floor(2,3,map.width-4,map.height-5,'#d5c39e');
    floor(5,7,7,4,map.id==='tour_cherrygrove_home1'?'#b5c3a1':'#a9bec0');
    floor(14,8,8,1,'#c3b08d');
  }else{
    // Service approach and eastern browsing/waiting aisle remain fully walkable.
    floor(center?6:5,6,4,11,center?'#e2c8bb':'#bed1ca');
    floor(16,10,8,3,center?'#cbd9cf':'#d9d1ad');
  }
  for(const x of home?[4,17]:[3,map.width-6]){
    rect(c,x*T,17,3*T,25,'#596f71');
    rect(c,x*T+3,20,3*T-6,18,'#8ebcbd');
    rect(c,x*T+5,22,3*T-10,3,'#c5dfd4');
    rect(c,x*T+23,20,2,18,'#d6d6bd');
    rect(c,x*T-2,39,3*T+4,4,'#b6a788');
  }
}

/** The existing recovery guide is a board, not the center renderer's seat fallback. */
export function paintCherrygroveCenterFurnishing(c:CanvasRenderingContext2D,o:Furnishing){
  if(o.event!=='cherrygroveCenterChart')return false;
  const x=o.x*T,y=o.y*T,w=o.w*T,h=o.h*T;
  rect(c,x+2,y+2,w-4,h-4,'#667b77');
  rect(c,x+5,y+4,w-10,h-11,'#eee6c9');
  for(let i=0;i<3;i++){
    const px=x+10+i*28;
    rect(c,px,y+7,9,8,['#cb827d','#8eafb8','#9cac78'][i]);
    rect(c,px+12,y+8,10,2,'#8e9d92');
    rect(c,px+12,y+13,8,2,'#a8ae99');
  }
  rect(c,x+8,y+h-7,3,7,'#63736b');
  rect(c,x+w-11,y+h-7,3,7,'#63736b');
  return true;
}

/** Completed care raises a cloth screen entirely inside the existing blocked flower bed. */
export function paintCherrygroveCare(c:CanvasRenderingContext2D,map:GameMap,done:boolean){
  if(map.id!=='tour_cherrygrove'||!done)return;
  rect(c,18*T+2,25*T+3,5,3*T-6,'#82694e');
  rect(c,18*T+7,25*T+6,7,3*T-12,'#ddd2a1');
  for(let y=25;y<28;y++)rect(c,18*T+7,y*T+9,7,2,'#a9aa7c');
}

/** Draw after generic terrain/features, before buildings and outdoor props. No asset dependency. */
export function paintCherrygroveGround(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_cherrygrove')return;
  // A continuous brick spine joins the east arrival, shops, homes and north road.
  const streets=[[7,18,36,5],[20,4,5,15],[8,12,5,6],[31,12,8,1],[31,12,2,8],[37,12,2,9],[7,23,10,2],[6,24,2,10],[6,31,11,3],[8,29,9,2],[14,24,3,9],[17,28,10,4],[27,29,7,3],[30,23,4,6]];
  for(const [x,y,w,h] of streets)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
    if(map.walkable[yy]?.[xx]!=='.')continue;
    rect(c,xx*T,yy*T,T,T,'#d2c4a0');
    rect(c,xx*T,yy*T+15,T,1,'#b5ac91');
    rect(c,xx*T+((yy%2)*8),yy*T,1,15,'#c0b392');
  }
  // Western inlet: stepped shoreline follows the very same blocked water cells.
  for(let y=14;y<40;y++){
    const edge=y>=35?14:y>=24?6:4;
    for(let x=0;x<edge;x++){
      if(map.walkable[y]?.[x]!=='#')continue;
      rect(c,x*T,y*T,T,T,x<edge-2?'#397d9a':'#68a8b1');
      if((x+y)%3===0)rect(c,x*T+2,y*T+7,9,2,'#a9d7ce');
    }
    if(map.walkable[y]?.[edge-1]==='#'){
      // Keep sand and seawall inside the blocked coastal cell, clear of the promenade.
      rect(c,edge*T-7,y*T,3,T,'#e5d7a5');
      rect(c,edge*T-4,y*T,4,T,'#8c9272');
      if(y<35)rect(c,edge*T-3,y*T+3,2,10,'#c9c7a7');
    }
  }
  // Close the horizontal seawall returns at the two actual steps in the water boundary.
  // Every raised face remains inside water collision cells, never on the footway.
  for(const [left,right,y] of [[4,6,24],[6,14,35]])for(let x=left;x<right;x++){
    if(map.walkable[y]?.[x]!=='#')continue;
    rect(c,x*T,y*T,T,4,'#c9c7a7');
    rect(c,x*T,y*T+4,T,3,'#8c9272');
    rect(c,x*T+2,y*T+7,12,2,'#e5d7a5');
    rect(c,x*T+7,y*T,1,4,'#929782');
  }
  // Coastal paving bends around the house into the shared garden approach.
  // These flush seams indicate a walking surface, not another fence.
  for(let y=24;y<=33;y++)if(map.walkable[y]?.[6]==='.'){
    rect(c,6*T+2,y*T+2,3,12,'#ece0bd');
    rect(c,6*T+5,y*T+3,1,10,'#b3aa8e');
  }
  for(let x=7;x<=16;x++)if(map.walkable[33]?.[x]==='.'){
    rect(c,x*T+2,33*T+11,12,3,'#ece0bd');
    rect(c,x*T+3,33*T+10,10,1,'#b3aa8e');
  }
  // Flowers have individual petals, soil beds and masonry rims rather than blank green blocks.
  for(const [x,y,w,h] of [[15,8,2,6],[28,13,3,2],[33,13,4,2],[18,25,8,3],[35,25,3,5]]){
    rect(c,x*T,y*T,w*T,h*T,'#788951');
    rect(c,x*T,y*T+h*T-3,w*T,3,'#a3a184');
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
      const px=xx*T+8,py=yy*T+7;
      rect(c,px,py+2,2,6,'#456747');
      const petal=(xx+yy)%3===0?'#f3e6b1':'#dba6b6';
      rect(c,px-3,py,8,3,petal);rect(c,px,py-3,3,9,petal);rect(c,px,py,2,2,'#fff2cc');
    }
  }
  // Northern closed road is visible as a timber gate, not an unexplained empty edge.
  // Flush entrance seams align the two-tile flower-bed opening with the shop door.
  for(const y of [13,14])for(const x of [31,32])if(map.walkable[y]?.[x]==='.'){
    rect(c,x*T+1,y*T+3,14,3,'#ece0c2');
    rect(c,x*T+2,y*T+6,12,1,'#aea68a');
  }
  for(let x=19;x<=25;x++)if(map.walkable[1]?.[x]==='#'){
    rect(c,x*T,T+8,T,5,'#826a4f');
    if([19,22,25].includes(x))rect(c,x*T,T+1,4,15,'#bca581');
  }
  // Door approaches and service emblems remain on the street side of the existing doors.
  for(const [x,y,color] of [[10,12,'#cf6370'],[32,12,'#669db5'],[10,29,'#af9667'],[31,29,'#af9667']] as const){
    rect(c,x*T-5,y*T,26,5,'#ece3c5');rect(c,x*T+4,y*T+7,7,5,color);
  }
  // Posts stay wholly inside the flower bed. The south inspection tile remains open.
  for(const x of [18,24])if(map.walkable[27]?.[x]==='#'){
    rect(c,x*T,27*T+5,5,10,'#baa980');rect(c,x*T,27*T+5,5,2,'#e0d5b4');
  }
  // Flat stepping stones mark the working side; these are paving, not raised barriers.
  for(const x of [20,21,22])if(map.walkable[28]?.[x]==='.'){
    rect(c,x*T+2,28*T+5,12,7,'#e5dbc0');
    rect(c,x*T+3,28*T+11,10,1,'#b7ae92');
  }
}
