import type { GameMap } from './types';

/** Authored wetland basins, clipped to collision so dry routes never look flooded. */
export function paintWetlandGround(c:CanvasRenderingContext2D,map:GameMap,moor:boolean){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const walk=(x:number,y:number)=>map.walkable[y]?.[x]==='.';
  const basins=moor?[[19,28,11,13],[37,22,13,12],[39,39,13,8],[12,10,12,7]]:[[17,10,12,7],[39,10,12,8],[23,26,12,7],[52,27,13,6]];
  const wet=(x:number,y:number)=>!walk(x,y)&&basins.some(([cx,cy,rx,ry])=>((x-cx)/rx)**2+((y-cy)/ry)**2<1);
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,seed=(x*31+y*17)%23;
    if(walk(x,y)){
      const deck=moor&&(x>=25&&x<=31||x>=42&&y<=31||y>=12&&y<=18&&x>=29);
      rect(px,py,16,16,deck?'#ad9870':'#a8ad80');
      if(deck){rect(px,py+3,16,1,'#d0bc91');rect(px,py+11,16,1,'#746c53');rect(px+2,py+5,1,1,'#615d4d');}
      else if(seed<6)rect(px+seed+2,py+9,4,2,'#c2bd94');
      if(!walk(x,y+1)){rect(px,py+11,16,5,'#526358');rect(px,py+10,16,2,'#d0c59b');}
      if(!walk(x-1,y))rect(px,py,2,12,'#d1c6a2');
      continue;
    }
    if(wet(x,y)){
      rect(px,py,16,16,'#668f96');
      if(seed<5)rect(px+2,py+6,9,1,'#91b3b2');
      if(!wet(x,y-1))rect(px,py,16,4,'#879c78');
      if(seed===8){rect(px+5,py+3,5,3,'#779c76');rect(px+8,py+5,5,3,'#547e68');}
    }else{
      rect(px,py,16,16,'#657e60');
      if(seed<8){rect(px+3,py+5,9,6,'#738c63');rect(px+6,py+2,5,7,'#82966c');}
      if(seed===13){rect(px+2,py+5,11,8,'#536b61');rect(px+3,py+3,9,5,'#9ba593');}
    }
    if((walk(x+1,y)||walk(x-1,y)||walk(x,y+1))&&seed%3===0){
      rect(px+5,py+3,2,11,'#405f4d');rect(px+10,py+5,1,9,'#b5af75');rect(px+4,py+2,4,3,'#c3b780');
    }
  }
  // Existing observation props receive recognizable platforms, not new event menus.
  for(const prop of map.props){
    if(!/Moor(Reeds|Birds|North)|Eight(Marsh|Moor)/.test(prop.dialogue))continue;
    const px=prop.x*16,py=prop.y*16;
    rect(px,py,16,16,'#6c7966');rect(px+2,py+2,12,8,'#c0b48c');rect(px+5,py+10,6,5,'#526355');
  }
}
