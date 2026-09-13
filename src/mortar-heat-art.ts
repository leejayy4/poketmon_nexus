import type {GameMap,SaveData} from './types';
import {JOHTO_MT_MORTAR_1F} from './johto-route-42';
import {MORTAR_HEAT_STAGES} from './mortar-heat';
import {mortarLandmarkLayers} from './mortar-landmarks-art';
import {MORTAR_RESCUE_PATH,MORTAR_RESCUE_READY,MORTAR_RESCUE_PROGRESS,MORTAR_RESCUE_DONE} from './mortar-rescue';
export function mortarHeatLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags']):{depth:number;draw:()=>void}[]{
  if(map.id!==JOHTO_MT_MORTAR_1F)return [];
  const landmarks=mortarLandmarkLayers(c,map);
  if(!f.nexusEcruteakEugeneReflected)return landmarks;
  return [...landmarks,{depth:0,draw:()=>{
    c.save();
    for(let y=24;y<=30;y++)for(let x=40;x<=42;x++)if(map.walkable[y]?.[x]==='.'){
      c.fillStyle='#b67d553d';c.fillRect(x*16,y*16,16,16);c.strokeStyle='#d3a679';c.beginPath();c.moveTo(x*16+4,y*16+12);c.lineTo(x*16+8,y*16+8);c.lineTo(x*16+5,y*16+4);c.stroke();
    }
    const mark=(x:number,y:number)=>{if(map.walkable[y]?.[x]!=='.')return;c.fillStyle='#a6c0a3';c.fillRect(x*16+6,y*16+7,4,2);};
    const arrow=(x:number,y:number,turn:number)=>{
      if(map.walkable[y]?.[x]!=='.')return;
      c.save();c.translate(x*16+8,y*16+8);c.rotate(turn*Math.PI/2);
      c.strokeStyle='#d7dfb8';c.lineWidth=2;c.beginPath();c.moveTo(4,0);c.lineTo(-4,0);c.moveTo(-1,-3);c.lineTo(-4,0);c.lineTo(-1,3);c.stroke();c.restore();
    };
    // Flat floor hatching distinguishes the warm approach without adding a barrier.
    for(let x=40;x<=42;x++)if(map.walkable[23]?.[x]==='.'){
      c.strokeStyle='#d4ad77';c.lineWidth=1;c.beginPath();c.moveTo(x*16+2,23*16+11);c.lineTo(x*16+6,23*16+7);c.moveTo(x*16+9,23*16+11);c.lineTo(x*16+13,23*16+7);c.stroke();
    }
    if(f[MORTAR_HEAT_STAGES[2]]){
      for(let y=16;y<=22;y+=2)mark(44,y);
      for(let x=16;x<=44;x+=2)mark(x,16);
      mark(14,16);
      for(let y=12;y<=16;y+=2)mark(32,y);
      arrow(44,18,1);arrow(42,16,0);arrow(32,16,0);arrow(16,16,3);
    }
    if(f[MORTAR_HEAT_STAGES[3]]){
      for(let y=18;y<=36;y+=2)mark(14,y);
      for(let x=14;x<=28;x+=2)mark(x,38);
      arrow(14,24,3);arrow(14,36,3);arrow(16,38,2);arrow(26,38,2);
    }
    const cursor=f[MORTAR_RESCUE_PROGRESS];
    if(f[MORTAR_RESCUE_READY]&&!f[MORTAR_RESCUE_DONE]&&typeof cursor==='number'&&Number.isInteger(cursor)){
      const p=MORTAR_RESCUE_PATH[cursor+1];
      if(p&&map.walkable[p.y]?.[p.x]==='.'){
        c.strokeStyle='#f0df9c';c.lineWidth=1;c.strokeRect(p.x*16+3,p.y*16+3,10,10);
        c.fillStyle='#eee0b2';c.fillRect(p.x*16+6,p.y*16+6,2,4);c.fillRect(p.x*16+9,p.y*16+7,2,4);
      }
    }
    c.restore();
  }},{depth:11.95,draw:()=>{
    if(!map.props.some(p=>p.x===32&&p.y===11&&p.dialogue==='mortarNorthBypassMarker'))return;
    c.save();c.beginPath();c.rect(32*16,11*16,16,16);c.clip();c.fillStyle='#807664';c.fillRect(32*16+3,11*16+4,11,12);c.fillStyle=f[MORTAR_HEAT_STAGES[2]]?'#b7d0af':'#a69b7a';c.fillRect(32*16+4,11*16+6,9,5);
    if(f[MORTAR_HEAT_STAGES[2]]){c.fillStyle='#49614d';c.fillRect(32*16+5,11*16+8,6,1);c.fillRect(32*16+5,11*16+7,2,3);}c.restore();
  }},{depth:42.95,draw:()=>{
    if(!f[MORTAR_HEAT_STAGES[4]])return;
    if(!map.props.some(p=>p.x===33&&p.y===42&&p.dialogue==='tourMortarReturnBoard'))return;
    c.save();c.beginPath();c.rect(33*16,42*16,16,16);c.clip();c.fillStyle='#e4d8ae';c.fillRect(33*16+2,42*16+3,12,10);c.strokeStyle='#5b7963';c.beginPath();c.moveTo(33*16+11,42*16+5);c.lineTo(33*16+5,42*16+5);c.lineTo(33*16+5,42*16+10);c.lineTo(33*16+11,42*16+10);c.stroke();c.restore();
  }}];
}
