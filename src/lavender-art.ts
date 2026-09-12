import type { GameMap } from './types';

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const tile=(n:number)=>n*16;

function ridge(c:CanvasRenderingContext2D,x:number,y:number,w:number){
  box(c,tile(x),tile(y),tile(w),6,'#596b61');box(c,tile(x),tile(y)+6,tile(w),4,'#9da280');
  for(let i=0;i<w;i++){box(c,tile(x+i)+2,tile(y)+10,12,4,'#71806b');box(c,tile(x+i)+5,tile(y)+13,6,2,'#485f58');}
}

function waterWindow(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number){
  box(c,tile(x),tile(y),tile(w),tile(h),'#527f91');
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    box(c,tile(x+i)+2+((i+j)%2)*4,tile(y+j)+5,8,1,'#8cb8bd');
    box(c,tile(x+i)+8,tile(y+j)+12,5,1,'#3f6e80');
  }
}

function caveGlow(c:CanvasRenderingContext2D,x:number,y:number,color:string){
  box(c,tile(x)+6,tile(y)+2,4,10,color);box(c,tile(x)+4,tile(y)+6,8,5,color+'99');
  box(c,tile(x)+7,tile(y)+12,2,2,'#e5dfbd');
}

/** Location-specific scenery for the official Cerulean-to-Lavender approach. */
export function paintLavenderApproach(c:CanvasRenderingContext2D,map:GameMap){
  switch(map.id){
    case 'tour_kanto_route_9':
      ridge(c,8,5,13);ridge(c,46,23,17);
      for(const [x,y] of [[18,7],[39,18],[57,25]]){box(c,tile(x)+3,tile(y)+4,10,8,'#69766b');box(c,tile(x)+5,tile(y)+2,6,3,'#b3ad8c');}
      break;
    case 'tour_kanto_route_10_north':
      waterWindow(c,22,5,8,15);ridge(c,3,8,8);ridge(c,4,39,10);
      box(c,tile(24),tile(8),64,35,'#66777c');box(c,tile(24)+5,tile(8)+5,54,23,'#d5d2b6');
      box(c,tile(25),tile(8)-6,48,8,'#9b836e');box(c,tile(26)+4,tile(9),8,7,'#76a6ad');
      break;
    case 'tour_kanto_route_10_north_center':
      ridge(c,3,4,8);ridge(c,17,13,8);
      box(c,tile(11),tile(4)+3,96,3,'#d8d0a9');
      break;
    case 'tour_kanto_rock_tunnel_1f':
      for(const [x,y] of [[8,8],[45,8],[10,38],[42,37]])ridge(c,x,y,6);
      for(const [x,y] of [[12,10],[27,21],[43,34]])caveGlow(c,x,y,'#d7bb78');
      break;
    case 'tour_kanto_rock_tunnel_b1f':
      for(const [x,y] of [[16,30],[27,22],[39,16]])caveGlow(c,x,y,'#83b9bc');
      for(const [x,y,w] of [[5,7,9],[34,35,14]] as const)ridge(c,x,y,w);
      break;
    case 'tour_kanto_route_10_south':
      ridge(c,3,8,8);ridge(c,16,31,9);
      box(c,tile(18),tile(38),96,4,'#655b72');box(c,tile(20),tile(36),64,5,'#a994aa');
      box(c,tile(22)+4,tile(33),24,48,'#776984');box(c,tile(22),tile(33)+8,32,5,'#c1aec2');
      break;
  }
}

function flowerRow(c:CanvasRenderingContext2D,x:number,y:number,count:number){
  for(let i=0;i<count;i++){
    const px=tile(x)+i*13,py=tile(y)+(i%2)*5;
    box(c,px+5,py+7,2,7,'#53735b');box(c,px+2,py+3,5,5,i%3===0?'#e7dfd1':'#aa91b5');box(c,px+7,py+2,5,5,'#d2bfd4');
  }
}

/** Quiet civic details that give Lavender a distinct palette without covering doors. */
export function paintLavenderTownDetails(c:CanvasRenderingContext2D){
  flowerRow(c,4,11,8);flowerRow(c,4,16,8);flowerRow(c,31,23,7);flowerRow(c,31,29,7);
  box(c,tile(16)+8,tile(16)+10,64,3,'#ded5b8');box(c,tile(16)+13,tile(16)+4,54,5,'#8a8494');
  box(c,tile(18)+5,tile(16)-8,18,31,'#807b88');box(c,tile(18)+8,tile(16)-12,12,8,'#c8c3b2');
  for(const [x,y] of [[7,23],[25,27],[17,26]]){box(c,tile(x)-8,tile(y)-25,48,7,'#66566f');box(c,tile(x)-4,tile(y)-31,40,8,'#a98cae');}
  box(c,tile(24),tile(8)-11,128,8,'#5d5269');box(c,tile(24)+8,tile(8)-18,112,9,'#9b86a5');
}

/** Room-specific accents for Lavender's expanded center, tower, mart and homes. */
export function paintLavenderInteriorDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(!map.id.startsWith('tour_lavender_'))return;
  const width=map.width*16;
  if(map.id==='tour_lavender_center'){
    box(c,width-132,22,92,17,'#6e617d');box(c,width-127,26,82,9,'#ddd7c2');
    for(let i=0;i<4;i++)box(c,width-119+i*19,28,12,3,i%2?'#8eaa98':'#aa8da8');
    return;
  }
  if(map.id==='tour_lavender_hall'||map.id==='tour_lavender_hall_2f'||map.id==='tour_lavender_hall_3f'){
    const floor=map.id.endsWith('_2f')?2:map.id.endsWith('_3f')?3:1;
    box(c,32,38,width-64,5,'#66566d');box(c,34,39,width-68,2,'#c9b99d');
    for(let x=54;x<width-60;x+=58){box(c,x,17,28,20,'#665b58');box(c,x+3,20,22,14,floor===3?'#b5c9c8':'#e2d4b4');}
    if(floor===1)for(let x=68;x<width-70;x+=50){box(c,x,51,30,13,'#837987');box(c,x+4,54,22,6,'#d8cfb5');}
    if(floor===2)for(let x=74;x<width-70;x+=54){box(c,x,51,34,14,'#796a59');for(let i=0;i<4;i++)box(c,x+4+i*7,54,4,7,['#9a7c91','#c2a36f','#78989a'][i%3]);}
    if(floor===3){box(c,width/2-15,47,30,4,'#8b7158');box(c,width/2-8,51,16,13,'#c7ae70');box(c,width/2-11,62,22,3,'#e1cd92');}
    return;
  }
  const accent=map.id==='tour_lavender_mart'?'#718e9b':'#a1849c';
  box(c,42,22,width-84,16,accent);box(c,46,25,width-92,8,'#dfd3b7');
  flowerRow(c,4,3,Math.max(4,Math.floor(map.width/3)));
}
