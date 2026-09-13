import type { Furnishing } from './explore-interiors';
import type { SaveData } from './types';

/** Draw within the existing furnishing footprint and retain its investigation event. */
export function paintIcirrusHallFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,save:SaveData):boolean{
  if(!['tour_icirrus_hall','tour_icirrus_hall_2f','tour_icirrus_hall_3f'].includes(mapId))return false;
  const floor=mapId.endsWith('_3f')?3:mapId.endsWith('_2f')?2:1;
  const w=o.w*16,h=o.h*16;
  const r=(x:number,y:number,ww:number,hh:number,color:string)=>{c.fillStyle=color;c.fillRect(o.x*16+x,o.y*16+y,ww,hh);};
  c.save();
  try{
    r(0,2,w,h-2,'#455d58');r(2,0,w-4,h-5,'#b1a27c');r(4,3,w-8,h-11,'#dbd1aa');
    const main=o.event==='tourIcirrusArrivalLog'||o.event==='tourIcirrusWaterStudy'||o.event==='tourIcirrusCompanionRest';
    if(o.event==='tourIcirrusCompanionCorner'){
      // Open technique album and a Poké Ball cushion on the existing table.
      r(5,5,w-10,h-13,'#eff0ce');r(Math.floor(w/2),6,1,h-15,'#938b6c');
      for(let yy=8;yy<h-10;yy+=5){r(8,yy,Math.max(2,w/2-12),1,'#799281');}
      r(w-19,7,10,4,'#b57665');r(w-19,11,10,4,'#e1dfba');r(w-20,10,12,2,'#516e65');r(w-15,9,3,4,'#eef0d1');
    }else if(main&&floor===1){
      // East-west route diagram and its northern wetland branch.
      r(7,13,w-14,3,'#827956');r(16,6,2,8,'#827956');
      for(const x of [8,Math.floor(w/2),w-12]){r(x,10,5,8,'#547879');r(x+1,9,3,2,'#eff0cb');}
      if(save.flags.icirrusArrivalLogged){r(w-15,3,9,5,'#526e55');r(w-13,4,5,2,'#d7d7a6');}
    }else if(main&&floor===2){
      // Three separate sections: dry road, reed bed and managed town water.
      const cell=Math.floor((w-12)/3);
      for(let i=0;i<3;i++){
        const x=6+i*cell;r(x,5,cell-2,h-15,i===0?'#a5a57b':'#719d9d');
        r(x,5,cell-2,2,'#d4e0c3');r(x+2,h-13,cell-6,2,'#617766');
        if(i===1)for(let j=2;j<cell-3;j+=4)r(x+j,9,1,8,'#3f7257');
      }
      if(save.flags.icirrusWaterCompared)r(6,h-7,w-12,2,'#e9d486');
    }else if(main){
      // A raised stone outlook with an unmistakable tower silhouette.
      r(6,7,w-12,h-15,'#829d90');r(8,h-13,w-16,4,'#647d71');
      const x=Math.floor(w/2)-5;r(x,3,10,h-14,'#c5cbb0');
      for(let y=5;y<h-12;y+=5)r(x-2,y,14,2,'#526d67');
      if(save.flags.dragonspiralWindRecorded){r(x+9,3,10,1,'#e9e6b9');r(x+11,6,7,1,'#e9e6b9');}
      if(save.flags.icirrusCompanionRested)r(6,h-7,8,2,'#e9d486');
    }else if(o.kind==='bench'){
      r(4,6,w-8,4,'#697c62');r(4,12,w-8,6,'#c8b780');
      for(let x=7;x<w-6;x+=12)r(x,13,7,4,'#8aab90');
    }else{
      // Supporting shelves carry field notebooks, water samples or rolled wind charts.
      for(let x=6;x<w-8;x+=10){
        r(x,6,6,h-15,floor===2?'#7ea5a1':'#82906d');
        r(x+1,8,4,2,'#e8dbaf');if(floor===3)r(x+2,4,2,3,'#596f66');
      }
    }
    r(w/2-4,h-4,8,2,'#e8d59a');
  }finally{c.restore();}
  return true;
}
