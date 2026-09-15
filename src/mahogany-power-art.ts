import type {GameMap,SaveData} from './types';
import type {Furnishing} from './explore-interiors';
import {MAHOGANY_POWER_MAP,MAHOGANY_POWER_FLAGS,MAHOGANY_POWER_PATH} from './mahogany-power';
import {paintMahoganyHomecoming} from './mahogany-homecoming';
export function paintMahoganyPowerFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags']):void{
  paintMahoganyHomecoming(c,mapId,o,f);
  if(mapId!==MAHOGANY_POWER_MAP||o.event!=='mahoganyHallLakeBook')return;
  c.save();c.beginPath();c.rect(9*16,17*16,32,32);c.clip();c.fillStyle='#576b69';c.fillRect(9*16,17*16,32,32);c.fillStyle='#bdc4ae';c.fillRect(9*16+3,17*16+3,26,9);
  c.fillStyle=f[MAHOGANY_POWER_FLAGS.allocation]===1?'#f0d589':'#75806f';c.fillRect(9*16+5,17*16+5,7,4);
  c.fillStyle=f[MAHOGANY_POWER_FLAGS.allocation]===2?'#c7e9af':'#75806f';c.fillRect(9*16+20,17*16+5,7,4);
  c.fillStyle='#303f40';c.fillRect(9*16+5,17*16+17,22,8);c.fillStyle='#cab889';c.fillRect(9*16+(f[MAHOGANY_POWER_FLAGS.allocation]===2?21:7),17*16+16,3,11);c.restore();
}
export function mahoganyPowerLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags']):{depth:number;draw:()=>void}[]{
  if(map.id!==MAHOGANY_POWER_MAP)return [];
  return [{depth:0,draw:()=>{
    c.save();const on=f[MAHOGANY_POWER_FLAGS.allocation]===2;
    // Flush-mounted floor strips follow existing walkable tiles, independent of NPC occupancy.
    for(const p of [...MAHOGANY_POWER_PATH,{x:14,y:21},{x:14,y:22},{x:14,y:23}]){if(map.walkable[p.y]?.[p.x]!=='.')continue;
      c.fillStyle=on?'#e9df9b':'#727d70';c.fillRect(p.x*16+2,p.y*16+12,12,2);
      if(on){c.fillStyle='#e4d89124';c.fillRect(p.x*16,p.y*16,16,16);}
    }
    c.strokeStyle='#6b9390';c.lineWidth=2;c.beginPath();c.moveTo(10*16,19*16);c.lineTo(10*16,20*16+8);c.lineTo(12*16+8,20*16+8);c.stroke();
    c.strokeStyle=f[MAHOGANY_POWER_FLAGS.allocation]===1?'#d7bc78':'#797d67';c.lineWidth=1;c.beginPath();c.moveTo(10*16,19*16+3);c.lineTo(12*16+3,19*16+3);c.lineTo(12*16+3,11*16+8);c.lineTo(20*16+8,11*16+8);c.lineTo(20*16+8,8*16);c.stroke();c.restore();
  }},{depth:7.95,draw:()=>{
    c.save();c.beginPath();c.rect(17*16,5*16,7*16,3*16);c.clip();
    c.fillStyle=f[MAHOGANY_POWER_FLAGS.allocation]===1?'#f4dda052':'#273c461c';c.fillRect(17*16,5*16,7*16,3*16);
    c.fillStyle=f[MAHOGANY_POWER_FLAGS.allocation]===1?'#f1d889':'#7c806f';c.fillRect(20*16,5*16+2,16,3);c.restore();
  }}];
}
