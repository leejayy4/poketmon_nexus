import type { GameMap } from './types';

const FLOORS=new Set(['tour_dragonspiral_hall','tour_dragonspiral_hall_2f','tour_dragonspiral_hall_3f']);
const fill=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** BW/BW2-inspired stone, moat and height cues for the public tower grounds. */
export function paintDragonspiralGroundDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_dragonspiral')return;
  for(const [x,y,w,h] of [[7,17,12,14],[37,10,11,9]] as const){
    fill(c,x*16,y*16,w*16,h*16,'#5d7f82');fill(c,x*16+4,y*16+4,w*16-8,h*16-8,'#84a9aa');
    for(let row=10;row<h*16-4;row+=21)fill(c,x*16+8+(row%17),y*16+row,Math.max(16,w*16-31),1,'#b8d1c5');
  }
  for(const [x,y,w,h] of [[19,8,19,8],[20,5,17,8],[13,30,31,7]] as const){
    fill(c,x*16,y*16,w*16,3,'#d2cfb2');fill(c,x*16,y*16+3,w*16,4,'#788982');
    for(let col=8;col<w*16-5;col+=24)fill(c,x*16+col,y*16+1,10,2,'#eee4c2');
  }
  for(const [x,y] of [[15,33],[42,20],[28,39]] as const){fill(c,x*16+5,y*16+4,6,9,'#6a7972');fill(c,x*16+3,y*16+2,10,3,'#c6c3a7');}
}

/** Each floor keeps one readable material identity: base, fitted spiral stone, then wind deck. */
export function paintDragonspiralInteriorDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(!FLOORS.has(map.id))return;
  const floor=map.id.endsWith('_2f')?2:map.id.endsWith('_3f')?3:1;
  const dark=['','#625e58','#585d61','#53646b'][floor],light=['','#c5b995','#b9b89f','#b8cbc1'][floor],accent=['','#8a7556','#797d69','#6f9398'][floor];
  for(let x=3;x<45;x+=4){fill(c,x*16+2,3*16+2,28,4,dark);fill(c,x*16+4,3*16+2,20,1,light);}
  const rings=floor===1?[[10,11,27,23]]:floor===2?[[11,11,26,24],[18,17,12,13]]:[[13,17,22,12],[17,20,14,7]];
  for(const [x,y,w,h] of rings){
    fill(c,x*16,y*16,w*16,3,accent);fill(c,x*16,y*16+h*16-3,w*16,3,dark);
    fill(c,x*16,y*16,3,h*16,dark);fill(c,x*16+w*16-3,y*16,3,h*16,light);
  }
  if(floor===3)for(const [x,y] of [[16,21],[25,18],[32,24]] as const){fill(c,x*16,y*16+6,9,1,'#dce6d7');fill(c,x*16+4,y*16+9,13,1,'#91b6b2');}
}

export function paintDragonspiralMotion(c:CanvasRenderingContext2D,mapId:string,clock:number){
  if(mapId==='tour_dragonspiral'){
    const shift=Math.round(Math.sin(clock*1.7)*3);
    for(const [x,y,w] of [[8,21,53],[39,14,38],[41,17,47]] as const)fill(c,x*16+6+shift,y*16+8,w,1,'#d3e3d7');
    return;
  }
  if(mapId!=='tour_dragonspiral_hall_3f')return;
  const travel=Math.floor(clock*16)%72;
  for(const [x,y,phase] of [[14,21,0],[20,18,24],[25,26,48]] as const){const dx=(travel+phase)%72;fill(c,x*16+dx,y*16+5,Math.max(5,20-Math.floor(dx/8)),1,'#dce8df');}
}
