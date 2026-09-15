import type { GameMap } from './types';

// Top-down, project-authored field layer for the inhabited stone bridge. It
// follows the existing 72x48 collision and never creates or closes a path.
export function paintVillageBridgeField(c:CanvasRenderingContext2D,map:GameMap,clock:number){
  if(map.id!=='tour_village_bridge')return;
  const tile=16,left=4*tile,right=68*tile,top=21*tile,bottom=28*tile;
  // Moving reflections remain below the bridge deck.
  for(let x=7*tile;x<65*tile;x+=48){
    const drift=Math.round(Math.sin(clock*1.8+x)*3);
    c.fillStyle='rgba(196,231,222,.45)';c.fillRect(x+drift,18*tile,25,2);c.fillRect(x-drift,29*tile,17,2);
  }
  // Dressed-stone deck and seams distinguish it from an ordinary boardwalk.
  c.fillStyle='#a79b84';c.fillRect(left,top,right-left,bottom-top);
  c.fillStyle='#d5c8a8';c.fillRect(left,top+3,right-left,bottom-top-8);
  for(let y=top+8;y<bottom-5;y+=16){
    c.fillStyle='rgba(112,102,86,.24)';c.fillRect(left,y,right-left,1);
    for(let x=left+((y/16)%2?8:0);x<right;x+=32)c.fillRect(x,y-8,1,8);
  }
  // Parapets occupy the already blocked edge rows; the central deck remains clear.
  for(const y of [top,bottom-5]){
    c.fillStyle='#625f59';c.fillRect(left,y,right-left,5);
    c.fillStyle='#eee0bd';c.fillRect(left,y,right-left,2);
    for(let x=left+8;x<right;x+=48){c.fillStyle='#777269';c.fillRect(x,y-4,7,9);c.fillStyle='#d8cbaa';c.fillRect(x+1,y-3,5,3);}
  }
  // Pier shadows and arch hints at the north/south water edges.
  for(let x=10*tile;x<65*tile;x+=13*tile){
    c.fillStyle='rgba(42,69,72,.34)';c.fillRect(x-5,17*tile,22,4);c.fillRect(x-5,28*tile,22,4);
    c.strokeStyle='#777068';c.lineWidth=4;c.beginPath();c.arc(x+6,21*tile,11,Math.PI,0);c.stroke();
  }
}
