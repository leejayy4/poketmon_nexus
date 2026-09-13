import type {GameMap,SaveData} from './types';
import type {Furnishing} from './explore-interiors';
import {MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS,MAHOGANY_LIFE_PRESERVED,MAHOGANY_TRANSMISSION_STOPPED} from './mahogany-transmitter';

export function paintMahoganyTransmitterFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags']):void{
  if(mapId!==MAHOGANY_TRANSMITTER_MAP||![MAHOGANY_TRANSMITTER_EVENTS.life,MAHOGANY_TRANSMITTER_EVENTS.signal].some(e=>e===o.event))return;
  const life=o.event===MAHOGANY_TRANSMITTER_EVENTS.life,off=!life&&Boolean(f[MAHOGANY_TRANSMISSION_STOPPED]);
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle='#56626a';c.fillRect(x+1,y+2,w-2,h-2);c.fillStyle='#b4beb4';c.fillRect(x+3,y+3,w-6,7);
  c.fillStyle=life?'#68b6ae':'#c5a56d';c.fillRect(x+4,y+11,4,h-14);
  c.fillStyle=off?'#525954':life?'#a5e5c0':'#eacb7e';c.fillRect(x+22,y+5,5,3);
  c.fillStyle='#263c40';c.fillRect(x+11,y+13,14,12);c.strokeStyle='#b8c0ac';c.lineWidth=2;c.beginPath();c.moveTo(x+13,y+22);c.lineTo(x+(off?14:22),y+15);c.stroke();
  if(life&&f[MAHOGANY_LIFE_PRESERVED]||off){c.fillStyle='#e4d9af';c.fillRect(x+24,y+22,4,6);}
  c.fillStyle='#344b50';for(let i=0;i<3;i++)c.fillRect(x+11,y+27+i*2,10,1);c.restore();
}

export function mahoganyTransmitterLayers(c:CanvasRenderingContext2D,map:GameMap):{depth:number;draw:()=>void}[]{
  if(map.id!==MAHOGANY_TRANSMITTER_MAP)return [];
  return [{depth:0,draw:()=>{
    c.save();c.lineWidth=2;
    // Separate conduits run under the apparatus; no raised object or collision on this floor.
    c.strokeStyle='#4f9a95';c.beginPath();c.moveTo(19*16,19*16);c.lineTo(19*16,19*16+8);c.lineTo(17*16,19*16+8);c.stroke();
    c.strokeStyle='#af8d57';c.beginPath();c.moveTo(23*16,19*16);c.lineTo(23*16,19*16+8);c.lineTo(25*16,19*16+8);c.stroke();
    c.fillStyle='#b9b49a';for(const x of [17,25])c.fillRect(x*16-2,19*16+5,4,6);
    c.restore();
  }}];
}
