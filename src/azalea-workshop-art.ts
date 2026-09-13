import type {SaveData} from './types';
import type {Furnishing} from './explore-interiors';
export function paintAzaleaWorkshopFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags']){
  if(mapId!=='tour_azalea_hall'||!f.azaleaWorkBatch)return;
  if(!['azaleaHallSortingDesk','azaleaHallDryingShelf','azaleaHallPokemonRest'].includes(o.event))return;
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  if(o.event==='azaleaHallPokemonRest'){
    if(f.azaleaWorkRested){c.fillStyle='#b9c99f';c.fillRect(x+4,y+7,w-25,h-13);c.fillStyle='#789eb0';c.fillRect(x+w-18,y+h-13,12,8);}
  }else{
    c.fillStyle='#d6c59e';c.fillRect(x+3,y+3,w-6,h-8);
    const desk=o.event==='azaleaHallSortingDesk';
    const sorted=Boolean(f.azaleaWorkSorted);
    const spaced=!desk&&Boolean(f.azaleaWorkDrying);
    const crowded=!desk&&!spaced&&Boolean(f.azaleaWorkCrowded);
    // The same batch moves from the desk to the shelf; damaged fruit stays behind.
    const count=desk?(sorted?2:6):(sorted?4:0);
    if(desk&&sorted){
      c.fillStyle='#a6997e';c.fillRect(x+5,y+6,27,24);
      c.fillStyle='#e6d9b9';c.fillRect(x+7,y+8,23,20);
    }
    for(let i=0;i<count;i++){
      const px=x+9+(crowded?Math.floor(i/2)*7:spaced?i*18:i*12);
      const py=y+11+(crowded?(i%2)*5:(i%2)*7);
      c.fillStyle=desk&&sorted?'#8c7467':i%2?'#b49557':'#93965e';
      c.fillRect(px,py,6,7);
      c.fillStyle='#e2d3a5';c.fillRect(px+2,py,2,2);
      if(desk&&sorted){c.fillStyle='#594b43';c.fillRect(px+3,py+2,1,4);}
    }
    if(spaced){
      c.fillStyle=f.azaleaWorkVentilated?'#9abfc0':'#9d825b';
      for(let i=0;i<5;i++)c.fillRect(x+14+i*11,y+h-11,f.azaleaWorkVentilated?7:2,3);
    }
  }
  c.restore();
}
