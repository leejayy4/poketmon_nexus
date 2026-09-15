import type {GameMap,SaveData} from './types';
import {JOHTO_ROUTE_43} from './johto-route-43';
import {ROUTE43_HOMEWARD_FLAGS as F} from './johto-route-43-life';

/** Persistent work frames on existing blocked prop cells; state only, no collision changes. */
export function rageRouteHomecomingLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags']):{depth:number;draw:()=>void}[]{
  if(map.id!==JOHTO_ROUTE_43||!f[F.started])return [];
  const frame=(x:number,y:number,wet:boolean)=>{
    const px=x*16,py=y*16;c.save();c.strokeStyle=wet?'#668c91':'#806f52';c.lineWidth=2;
    c.strokeRect(px+2,py+2,12,11);for(let i=4;i<12;i+=3){c.beginPath();c.moveTo(px+i,py+3);c.lineTo(px+i,py+12);c.stroke();}
    if(wet){c.fillStyle='#85b6ba88';c.fillRect(px+3,py+11,10,2);}else{c.fillStyle='#c9bd8d';c.fillRect(px+3,py+3,10,2);}c.restore();
  };
  const state=!f[F.rinsed]?{x:19,y:8,wet:false}:!f[F.dried]?{x:23,y:35,wet:true}:!f[F.returned]?{x:22,y:56,wet:false}:{x:22,y:69,wet:false};
  return [{depth:state.y+.8,draw:()=>frame(state.x,state.y,state.wet)}];
}
