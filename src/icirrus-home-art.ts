import type { Furnishing } from './explore-interiors';
import type { SaveData } from './types';

/** Existing home activities get readable household objects, within their collision footprint. */
export function paintIcirrusHomeFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,save:SaveData):boolean{
  if(!/^tour_icirrus_home[12](?:_[23]f)?$/.test(mapId))return false;
  const event=o.event,w=o.w*16,h=o.h*16;
  const r=(x:number,y:number,a:number,b:number,color:string)=>{c.fillStyle=color;c.fillRect(o.x*16+x,o.y*16+y,a,b);};
  c.save();
  try{
    r(1,2,w-2,h-2,'#4d6255');r(2,0,w-4,h-5,'#ad9770');
    if(event==='tourIcirrusGearCare'||event==='tourIcirrusRoadKit'){
      // Boots and a folded drying cloth; the second house keeps rolled travel equipment.
      for(const x of [6,16]){r(x,5,6,12,'#596d61');r(x,14,9,4,'#40594f');}
      r(w-17,5,11,12,'#ded8b2');r(w-16,9,9,1,'#9cab91');
      if(event==='tourIcirrusGearCare'&&!save.flags.icirrusGearChecked){r(7,15,3,2,'#8d7956');r(17,15,3,2,'#8d7956');}
      if(event==='tourIcirrusRoadKit'){r(5,19,w-10,3,'#d2bb86');r(11,18,2,5,'#667b66');}
    }else if(event==='tourIcirrusRainLedger'||event==='tourIcirrusTowerMap'){
      r(4,3,w-8,h-11,'#e1d9b4');r(w/2,3,1,h-11,'#9c9475');
      if(event==='tourIcirrusRainLedger'){
        for(let x=7;x<w-6;x+=6){r(x,6,1,h-16,'#b6b59b');}
        for(let i=0;i<4;i++)r(7+i*5,12-i,6,1,'#587f79');
        if(save.flags.icirrusMoorObservationCompleted)for(let i=0;i<3;i++)r(w/2+4,7+i*4,w/2-11,1,'#53766a');
      }else{
        r(w/2-2,6,3,h-16,'#748774');
        for(let i=0;i<3;i++)r(w/2-5,6+i*5,9,2,'#52716a');
        const marks=save.flags.dragonspiralWindRecorded?3:save.flags.dragonspiralBaseObserved?2:save.flags.dragonspiralApproachMoatObserved?1:0;
        for(let i=0;i<marks;i++)r(w/2+6,7+i*5,4,3,'#548c7c');
      }
    }else if(event==='tourIcirrusDryRest'||event==='tourIcirrusWindRest'||o.kind==='bench'){
      // Low padded resting surface, not another display cabinet.
      r(3,3,w-6,h-8,'#758e78');r(5,5,w-10,h-13,'#c5c49b');
      r(6,6,9,7,'#e0d6af');r(w-16,6,9,7,'#94ac91');
      const used=event==='tourIcirrusDryRest'?save.flags.icirrusGearChecked:event==='tourIcirrusWindRest'?save.flags.icirrusTowerReturnRested:false;
      if(used){r(w/2-5,8,10,3,'#a2ac88');r(w/2-3,11,6,2,'#a2ac88');}
    }else{
      for(let x=5;x<w-8;x+=10){r(x,5,7,h-13,'#778669');r(x+1,7,5,2,'#d7cda4');}
      r(3,h-8,w-6,2,'#6e755b');
    }
    r(w/2-4,h-4,8,2,'#dfcc91');
  }finally{c.restore();}
  return true;
}
