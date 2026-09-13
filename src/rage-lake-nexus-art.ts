import type {GameMap,SaveData} from './types';
export function rageLakeNexusLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags']):{depth:number;draw:()=>void}[]{
  if(map.id!=='tour_rage_lake'||!f.nexusGoldenrodInquiryReady)return [];
  return [{x:22,y:18,event:'rageLakeWaterStone',flag:'nexusRageIntakeCompared'}, {x:14,y:31,event:'rageLakeReedDesk',flag:'nexusRageReedMarked'}, {x:50,y:18,event:'rageLakeLookout',flag:'nexusRageAlarmTested'}].filter(p=>map.props.some(o=>o.x===p.x&&o.y===p.y&&o.dialogue===p.event)).map((p,i)=>({depth:p.y+.95,draw:()=>{
    const x=p.x*16,y=p.y*16,on=Boolean(f[p.flag]);c.save();c.beginPath();c.rect(x,y,16,16);c.clip();
    c.fillStyle='#64736d';c.fillRect(x+1,y+1,14,15);c.fillStyle='#c8ba91';c.fillRect(x+3,y+3,10,10);
    if(i===0){c.fillStyle='#668fa8';c.fillRect(x+4,y+(on?7:10),4,on?5:2);c.fillStyle='#805f4d';c.fillRect(x+10,y+4,1,8);}
    else if(i===1){c.fillStyle=on?'#dcca86':'#958a71';c.fillRect(x+(on?3:7),y+4,3,8);c.fillStyle='#688654';c.fillRect(x+10,y+6,2,8);}
    else{c.fillStyle='#b8cf8e';c.fillRect(x+4,y+4,3,3);c.fillStyle=on?'#d9e8c8':'#84989a';c.fillRect(x+(on?3:9),y+9,5,3);}
    c.restore();
  }}));
}
