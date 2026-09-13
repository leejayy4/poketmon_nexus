import type {Furnishing} from './explore-interiors';

const EVENTS=new Set(['cherrygroveHomeFlowers','cherrygroveHomeRest','cherrygroveHomeWindLog','cherrygroveHomeRouteBook','tourCherrygroveMartTravelShelf','tourCherrygroveMartRouteChart']);

/** Existing investigation objects only; all surfaces stay within their blocked footprint. */
export function paintCherrygroveFurnishing(c:CanvasRenderingContext2D,o:Furnishing){
  if(!EVENTS.has(o.event))return false;
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
  const r=(a:number,b:number,d:number,e:number,color:string)=>{c.fillStyle=color;c.fillRect(x+a,y+b,d,e);};
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  r(0,0,w,h,'#c5b392');
  if(o.event==='cherrygroveHomeRest'){
    r(3,2,w-6,h-4,'#8d9f87');
    for(const px of [9,39,69]){r(px,3,24,10,'#d8c3a1');r(px+2,4,20,2,'#eee0bf');}
    r(w-15,4,11,9,'#687d85');r(w-13,5,7,5,'#a8d0ce');
  }else if(o.event==='cherrygroveHomeFlowers'){
    r(2,3,w-4,h-5,'#8b775a');r(4,h-7,w-8,4,'#c0a67e');
    for(let row=0;row<2;row++)for(let col=0;col<4;col++){
      const px=9+col*22,py=5+row*21;
      r(px,py+9,13,9,'#b47f63');r(px-1,py+8,15,3,'#d1a17e');
      r(px+6,py+2,2,8,'#4f795b');r(px+2,py+4,11,3,'#749564');
      r(px+4,py,6,5,(row+col)%2?'#d9a9b6':'#ece0b0');r(px+6,py+1,2,2,'#f7ebbb');
    }
  }else if(o.event==='tourCherrygroveMartTravelShelf'){
    r(2,2,w-4,h-4,'#698782');r(4,4,w-8,h-10,'#a6beb1');
    for(const px of [8,25,42]){r(px+3,6,6,3,'#536b70');r(px,9,12,14,'#80a9b3');r(px+2,13,8,4,'#e4dfbd');}
    r(62,7,25,16,'#ece4c9');r(73,8,1,14,'#b7a889');r(65,11,6,2,'#88a689');r(76,14,8,2,'#8ba6ac');
    r(3,h-7,w-6,4,'#d7c499');
  }else if(o.event==='cherrygroveHomeRouteBook'){
    r(2,2,w-4,h-3,'#8c7057');
    for(let i=0;i<8;i++){const px=6+i*6;r(px,5,5,19,['#8eaaa4','#c6ab7b','#aa8586'][i%3]);r(px+1,8,3,2,'#e8dec0');}
    r(58,6,30,18,'#eee4c8');r(72,7,1,16,'#b0a286');r(61,11,8,2,'#8ba286');r(76,15,8,2,'#809da5');
    r(3,h-6,w-6,3,'#c1a27c');
  }else{
    r(2,2,w-4,h-4,'#807761');r(5,4,w-10,h-10,'#ece3c6');
    if(o.event==='cherrygroveHomeWindLog'){
      for(let i=0;i<3;i++){const px=10+i*27;r(px,7,20,1,'#c2b796');r(px+9,9,2,8,'#819d9b');r(px+5,10,10,2,'#819d9b');r(px+6,18,13,2,'#8bafba');}
    }else{
      // East-west Route 29 with the north branch to Route 46, not a new exit.
      r(12,17,w-24,3,'#a58d65');r(49,8,3,12,'#a58d65');
      r(9,14,8,8,'#b77f7a');r(47,6,7,5,'#91a47a');
      for(const px of [26,65,77])r(px,10,6,4,'#9aaf82');
    }
    r(8,h-6,3,6,'#697368');r(w-11,h-6,3,6,'#697368');
  }
  c.restore();return true;
}
