import type {GameMap,SaveData} from './types';
import {JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42} from './johto-route-42';
import {MORTAR_DRAINAGE_FLAGS} from './mortar-drainage';
export function mortarDrainageLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags'],clock=0):{depth:number;draw:()=>void}[]{
  if(map.id!==JOHTO_MT_MORTAR_1F&&map.id!==JOHTO_ROUTE_42)return [];
  const diverted=Boolean(f[MORTAR_DRAINAGE_FLAGS[2]])&&!f[MORTAR_DRAINAGE_FLAGS[4]],collected=Boolean(f[MORTAR_DRAINAGE_FLAGS[3]]),restored=Boolean(f[MORTAR_DRAINAGE_FLAGS[4]]);
  const phase=Math.floor((Number.isFinite(clock)?Math.max(0,clock):0)*12)%16;
  const cell=(x:number,y:number,draw:()=>void)=>{if(map.walkable[y]?.[x]!=='#'||map.warps.some(w=>w.x===x&&w.y===y))return;c.save();c.beginPath();c.rect(x*16,y*16,16,16);c.clip();draw();c.restore();};
  if(map.id===JOHTO_ROUTE_42)return [{depth:-1,draw:()=>{for(let x=64;x<=69;x++)cell(x,4,()=>{
    const px=x*16,py=4*16;c.fillStyle='#7f8b78';c.fillRect(px,py,16,16);c.fillStyle=restored?'#6d9da4':'#929378';c.fillRect(px,py+3,16,9);c.fillStyle=restored?'#bad8cd':'#b9ac7b';c.fillRect(px+phase,py+7,5,1);if(phase>11)c.fillRect(px,py+7,phase-11,1);if(!restored){c.fillStyle='#716d46';c.fillRect(px+6,py+5,3,2);}c.fillStyle='#c4c1a0';c.fillRect(px,py+12,16,2);
  });}}];
  const layers:{depth:number;draw:()=>void}[]=[{depth:-1,draw:()=>{for(let y=24;y<=33;y++)cell(17,y,()=>{
    const px=17*16,py=y*16;c.fillStyle='#6c7970';c.fillRect(px,py,16,16);c.fillStyle='#b4b496';c.fillRect(px+2,py,2,16);c.fillRect(px+12,py,2,16);
    c.fillStyle=restored?'#789ea6':diverted&&y>25?'#717a68':'#989573';c.fillRect(px+4,py,8,16);c.fillStyle=restored?'#b6d4d0':'#b3ac82';if(!diverted||y<25){c.fillRect(px+7,py+phase,3,4);if(phase>12)c.fillRect(px+7,py,3,phase-12);}
    if(diverted&&y>=25&&y<=30){c.fillStyle='#859c99';c.fillRect(px+11,py,2,16);c.fillStyle='#c0d6c8';c.fillRect(px+11,py+phase,2,3);if(phase>13)c.fillRect(px+11,py,2,phase-13);}
    if(!collected&&y===25){c.fillStyle='#756241';c.fillRect(px+4,py+3,8,8);}
  });}}];
  for(const [event,y] of [['mortarSedimentScreen',25],['mortarSettlingBasin',30]] as const)layers.push({depth:y+.95,draw:()=>{
    if(!map.props.some(p=>p.x===17&&p.y===y&&p.dialogue===event))return;cell(17,y,()=>{
      const x=17*16,py=y*16;c.fillStyle='#bab397';c.fillRect(x+1,py+1,14,14);
      if(y===25){c.fillStyle=collected?'#718f91':'#82724d';c.fillRect(x+3,py+3,7,10);c.fillStyle='#5e7169';for(let j=4;j<13;j+=3)c.fillRect(x+3,py+j,7,1);c.fillStyle=collected?'#977b47':'#5e695b';c.fillRect(x+11,py+5,3,8);}
      else{c.fillStyle=diverted?'#a3946b':'#789e9f';c.fillRect(x+3,py+4,10,8);c.fillStyle='#546d65';c.fillRect(x+(diverted?10:3),py+2,3,5);if(collected){c.fillStyle='#756043';c.fillRect(x+11,py+11,3,3);}}
    });
  }});
  return layers;
}
