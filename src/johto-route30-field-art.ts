import type { GameMap } from './types';

const T=16;
const blocked=(map:GameMap,x:number,y:number)=>map.walkable[y]?.[x]==='#';

function ledgeTile(c:CanvasRenderingContext2D,map:GameMap,x:number,y:number){
  if(!blocked(map,x,y))return;
  c.fillStyle='#667356';c.fillRect(x*T,y*T,T,T);
  c.fillStyle='#d2c292';c.fillRect(x*T,y*T,T,3);
  c.fillStyle='#8c886b';c.fillRect(x*T+2,y*T+5,12,4);
  c.fillStyle='#5c684e';c.fillRect(x*T+4,y*T+11,8,5);
}

function forestEdge(c:CanvasRenderingContext2D,map:GameMap,cells:Array<[number,number]>){
  for(const [x,y] of cells){
    if(!blocked(map,x,y))continue;
    c.fillStyle='#405f45';c.fillRect(x*T,y*T,T,T);
    c.fillStyle='#648653';c.fillRect(x*T+1,y*T+2,14,10);
    c.fillStyle='#91a963';c.fillRect(x*T+4,y*T+1,7,5);
    c.fillStyle='#354b3c';c.fillRect(x*T+7,y*T+10,3,6);
  }
}

/** Adds landmarks only on already-blocked cells; walking and warps stay intact. */
export function paintJohtoRoute30Field(c:CanvasRenderingContext2D,map:GameMap,clock:number){
  if(map.id==='tour_johto_route_30'){
    // South approach ledge frames the grass-free backbone rather than covering it.
    for(let x=14;x<=25;x++){ledgeTile(c,map,x,71);ledgeTile(c,map,x,79);}
    forestEdge(c,map,[[16,18],[17,18],[23,18],[24,18],[27,14],[28,14],[13,46],[14,46]]);
    // Pond-edge reeds use the existing water feature; they do not create encounters.
    for(const [x,y] of [[22,36],[22,40],[31,37],[31,43],[22,57],[28,60]] as const){
      if(!blocked(map,x,y))continue;
      const sway=Math.round(Math.sin(clock*2+x)*1);
      c.fillStyle='#5d7c50';c.fillRect(x*T+5+sway,y*T+5,2,10);c.fillRect(x*T+10-sway,y*T+7,2,8);
      c.fillStyle='#9fb66e';c.fillRect(x*T+3+sway,y*T+5,5,2);c.fillRect(x*T+8-sway,y*T+7,5,2);
    }
    return;
  }
  if(map.id!=='tour_johto_route_31')return;
  // Long ledge borders the southern grass detour, with every painted tile blocked.
  for(let x=27;x<=45;x++){ledgeTile(c,map,x,16);ledgeTile(c,map,x,23);}
  forestEdge(c,map,[[14,10],[15,10],[27,3],[28,3],[44,10],[45,10],[16,16],[17,16]]);
  // Open cave mouth; the actual warp remains on the clear floor immediately below it.
  const x=42,y=4;
  if(blocked(map,x,y)){
    c.fillStyle='#65695b';c.fillRect(x*T-5,y*T-7,T+10,T+7);
    c.fillStyle='#2b3434';c.beginPath();c.ellipse(x*T+8,y*T+10,8,12,0,Math.PI,Math.PI*2);c.fill();
    c.fillStyle='#d8d2ad';c.fillRect(x*T+5,y*T+14,6,2);
  }
}
