import type { GameMap } from './types';
import { paintSinnohStratum } from './sinnoh-strata-art';
import type { Furnishing } from './explore-interiors';
const r=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};

export function paintCelesticRuinsRoom(c:CanvasRenderingContext2D,map:GameMap):boolean{
  if(map.id!=='tour_celestic_ruins')return false;
  c.save();
  r(c,0,0,map.width*16,map.height*16,'#354b48');
  const entrance=map.warps.find(w=>w.entry==='down');
  const mural=map.props.filter(p=>p.dialogue==='tourCelesticRuinsMural');
  const muralBottom=mural.length?Math.max(...mural.map(p=>p.y)):6;
  const axis=entrance?.x??12;
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,open=map.walkable[y]?.[x]==='.';
    r(c,px+1,py+1,15,15,open?'#a9ad94':'#64786a');
    if(!open){r(c,px+1,py+2,14,3,'#8c9a7f');r(c,px+7,py+6,1,9,'#455d51');}
    else{
      // Broad worn aisle leads from the real doorway past the keeper; the
      // two side viewing bays stay on existing floor beside actual exhibits.
      const aisle=Math.abs(x-axis)<=1&&y>muralBottom;
      const forecourt=y===muralBottom+1&&mural.some(p=>p.x===x);
      const viewingBay=map.props.some(p=>p.x===x&&p.y===y-1&&
        (p.dialogue==='tourCelesticRuinsRecord'||p.dialogue==='tourCelesticRuinsStone'));
      if(aisle||forecourt||viewingBay){
        r(c,px,py,16,16,forecourt?'#c5bfa0':viewingBay?'#b7b79e':'#bbb89d');
        r(c,px+1,py+14,14,1,'#929880');
        if((x+y)%3===0)r(c,px+3,py+4,8,1,'#d1ccb0');
      }else if((x+y)%5===0)r(c,px+4,py+6,6,1,'#838f7b');
      // Contact shading belongs to the floor edge, never a new wall or step.
      if(map.walkable[y-1]?.[x]==='#')r(c,px,py,16,2,'#7c8a73');
    }
  }
  // Ancient stone enclosure: no repeated household windows or wooden floor.
  for(const warp of map.warps)r(c,warp.x*16,warp.y*16,16,16,'#d0c4a4');
  c.restore();return true;
}

export function paintCelesticRuinsExhibit(c:CanvasRenderingContext2D,o:Furnishing):boolean{
  if(!['tourCelesticRuinsMural','tourCelesticRuinsRecord','tourCelesticRuinsStone','tourCelesticRuinsReturn'].includes(o.event))return false;
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  r(c,x,y,w,h,'#697b68');r(c,x+2,y+2,w-4,h-7,'#b6b49a');
  r(c,x+2,y+h-6,w-4,5,'#89927a');
  if(o.event==='tourCelesticRuinsMural'){
    r(c,x+6,y+5,w-12,h-16,'#8c9980');
    // Three abstract lake motifs retain the existing project exhibit's subject.
    for(let i=0;i<3;i++){
      const cx=x+Math.round(w*(i+1)/4),cy=y+18+(i===1?8:0);
      r(c,cx-8,cy-3,16,7,'#d5c79c');r(c,cx-5,cy-6,10,13,'#d5c79c');
      r(c,cx-3,cy-2,6,5,'#738a7e');
    }
    r(c,x+5,y+7,2,h-18,'#647765');r(c,x+w-8,y+10,2,h-21,'#647765');
  }else if(o.event==='tourCelesticRuinsRecord'){
    r(c,x+5,y+7,w-10,h-20,'#dcd0ad');r(c,x+w/2,y+8,2,h-23,'#a39170');
    for(let j=12;j<h-15;j+=5){r(c,x+9,y+j,w/2-14,1,'#8f977c');r(c,x+w/2+6,y+j,w/2-16,1,'#8f977c');}
  }else if(o.event==='tourCelesticRuinsStone'){
    for(let i=0;i<2;i++){
      const bx=x+7+i*w/2;
      paintSinnohStratum(c,bx,y+9,w/2-14,h-24,i===0);
      r(c,bx+2,y+h-12,w/2-18,3,'#e1d5b3');
    }
  }else{
    r(c,x+5,y+7,w-10,h-14,'#d7c9a2');
    r(c,x+Math.floor(w/2)-2,y+10,4,h-20,'#6f806d');
    r(c,x+Math.floor(w/2)-7,y+10,14,3,'#6f806d');
  }
  c.restore();return true;
}
