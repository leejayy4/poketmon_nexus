import type { GameMap } from './types';

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const tile=(n:number)=>n*16;

function flowerRibbon(c:CanvasRenderingContext2D,x:number,y:number,count:number,a='#e7d070',b='#c783ad'){
  box(c,tile(x),tile(y)+10,count*12,3,'#55785e');
  for(let i=0;i<count;i++){
    const px=tile(x)+i*12,py=tile(y)+(i%2)*4;
    box(c,px+5,py+7,2,7,'#4f7456');box(c,px+2,py+3,6,5,i%3?a:b);box(c,px+7,py+2,5,5,i%3===1?'#f1e5cf':b);
  }
}
function cityLamp(c:CanvasRenderingContext2D,x:number,y:number){
  box(c,tile(x)+7,tile(y)-5,3,25,'#465a62');box(c,tile(x)+3,tile(y)-8,11,7,'#526a72');box(c,tile(x)+5,tile(y)-6,7,3,'#f2d58b');
  box(c,tile(x)+5,tile(y)+18,7,2,'#324b52');
}
function awning(c:CanvasRenderingContext2D,x:number,y:number,w:number,color:string){
  box(c,tile(x),tile(y),tile(w),8,'#4b5d65');
  for(let px=tile(x);px<tile(x+w);px+=16){box(c,px,tile(y)-7,16,8,color);box(c,px+9,tile(y)-7,7,8,'#f2e3c5');}
  box(c,tile(x)+4,tile(y)+8,3,15,'#4d5b5c');box(c,tile(x+w)-7,tile(y)+8,3,15,'#4d5b5c');
}

/** BW/BW2-inspired depth accents for Celadon's garden and shopping districts. */
export function paintCeladonTownDetails(c:CanvasRenderingContext2D){
  // East arrival garden: layered planting marks the transition from Route 7.
  flowerRibbon(c,38,7,17,'#ead36f','#c979a7');flowerRibbon(c,38,11,15,'#f0df8c','#a882bd');
  box(c,tile(37),tile(5)-8,tile(15),7,'#3f6656');box(c,tile(37)+5,tile(5)-13,tile(15)-10,6,'#81a768');
  for(const [x,y] of [[36,16],[47,16],[56,17],[65,17],[34,31],[48,31],[61,31],[25,57],[40,57],[55,57]])cityLamp(c,x,y);

  // Department-store plaza uses a raised canopy and long shadows without covering the door at 24,10.
  awning(c,22,8,8,'#7d9f87');
  box(c,tile(34),tile(18),tile(18),5,'#4f6469');box(c,tile(35),tile(18)-5,tile(16),5,'#e6d8b6');
  box(c,tile(38)+12,tile(21)-14,tile(10)-24,7,'#466e77');box(c,tile(38)+18,tile(21)-20,tile(10)-36,7,'#b8d9d2');

  // Nursery benches and roofline; the interaction cell at 23,43 stays visible.
  awning(c,7,39,11,'#d19a73');flowerRibbon(c,6,42,18,'#e4c96c','#db879c');flowerRibbon(c,7,47,16,'#f0dd9b','#a687bb');
  for(const x of [8,14,20]){box(c,tile(x),tile(44),34,5,'#795f50');box(c,tile(x)+3,tile(44)-5,28,5,'#c69b70');}

  // Grove foreground creates depth while leaving the main loop and water station readable.
  for(const [x,y] of [[52,40],[58,41],[63,43],[53,49],[61,50]]){
    box(c,tile(x)+7,tile(y)+12,5,22,'#5f5949');box(c,tile(x)-4,tile(y)-6,27,22,'#416b55');box(c,tile(x),tile(y)-12,19,18,'#76a267');
    box(c,tile(x)+3,tile(y)-9,8,4,'#a8c783');
  }
  box(c,tile(48),tile(46)+5,32,5,'#576b68');box(c,tile(48)+5,tile(46),22,6,'#79b6bc');

  // South travel axis visually narrows toward the 16→17→18 road exit.
  flowerRibbon(c,28,47,17,'#e0c66d','#bf81a8');
  box(c,tile(12),tile(58)-5,80,5,'#42585e');box(c,tile(12)+6,tile(58)-11,68,7,'#e0cf9c');
  box(c,tile(14)+4,tile(60),24,4,'#d6c69b');box(c,tile(14)+9,tile(60)+4,14,28,'#56666a');
}

/** Floor-specific Celadon accents applied after the shared expanded-interior renderer. */
export function paintCeladonInteriorDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(!map.id.startsWith('tour_celadon_'))return;
  const width=map.width*16;
  if(map.id==='tour_celadon_center'){
    box(c,36,18,width-72,5,'#52735e');flowerRibbon(c,4,3,Math.max(8,map.width-9),'#e2ca72','#c482a8');
    box(c,width-132,50,94,7,'#48666c');box(c,width-126,44,82,7,'#d9cc9e');return;
  }
  if(map.id==='tour_celadon_hall'||map.id==='tour_celadon_hall_2f'||map.id==='tour_celadon_hall_3f'){
    const floor=map.id.endsWith('_2f')?2:map.id.endsWith('_3f')?3:1;
    const accents=floor===1?['#4f7180','#d4b96f']:floor===2?['#596b82','#c98570']:['#4f765d','#c683a7'];
    box(c,32,36,width-64,7,accents[0]);box(c,36,37,width-72,2,'#eee0ba');
    for(let x=56;x<width-62;x+=62){box(c,x,17,34,17,'#455c64');box(c,x+3,20,28,11,accents[(x/62)%2<1?0:1]);box(c,x+7,23,20,2,'#e5dbc0');}
    if(floor===1)for(let x=58;x<width-70;x+=64)awning(c,Math.floor(x/16),4,3,'#78a08c');
    if(floor===2){for(let x=70;x<width-70;x+=68){box(c,x,51,42,12,'#536571');for(let i=0;i<4;i++)box(c,x+5+i*9,54,6,5,['#d2b76e','#89aaa5','#c77f73'][i%3]);}}
    if(floor===3){flowerRibbon(c,4,4,Math.max(9,map.width-10),'#e3cc73','#c680aa');box(c,width/2-26,48,52,5,'#496a67');box(c,width/2-20,43,40,6,'#b8d2bd');}
    return;
  }
  const accent=map.id==='tour_celadon_mart'?'#638492':map.id==='tour_celadon_home1'?'#759568':'#9a806f';
  box(c,38,19,width-76,17,accent);box(c,43,22,width-86,8,'#eadbbc');
  if(map.id!=='tour_celadon_mart')flowerRibbon(c,4,3,Math.max(7,map.width-9),'#dfc46b','#c782a8');
}

/** Dedicated north/south depth and garden-to-cycling-road transition for Route 16. */
export function paintCeladonRoute16(c:CanvasRenderingContext2D,map:GameMap){
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=tile(x),py=tile(y),walk=map.walkable[y]?.[x]==='.';
    box(c,px,py,16,16,y<18?'#8fb77b':y<36?'#9ea878':'#9a9274');
    if(walk){box(c,px,py,16,16,y<18?'#c7c49b':y<36?'#beb795':'#aaa68e');box(c,px+2,py+3,12,1,'#dfd7b5');}
    else if((x+y)%3===0){box(c,px+3,py+8,10,7,'#52735a');box(c,px+5,py+4,7,7,y<24?'#83aa70':'#718c63');}
  }
  flowerRibbon(c,5,12,14,'#e5cd73','#c682a6');flowerRibbon(c,6,21,10,'#efd990','#a986b9');
  for(const [x,y] of [[18,8],[15,25],[21,38],[18,49]])cityLamp(c,x,y);
  box(c,tile(29),tile(18)-8,80,7,'#52636a');box(c,tile(30),tile(18)-14,64,7,'#dec999');
  box(c,tile(6),tile(41)-7,112,7,'#52665f');box(c,tile(7),tile(41)-13,96,7,'#d7c58f');
  box(c,tile(17),tile(52),112,5,'#4b565b');box(c,tile(18),tile(52)-6,80,7,'#d3bf87');
}

/** Long downhill terraces on Route 17 and the greener eastbound Fuchsia approach on Route 18. */
export function paintCeladonCyclingRoad(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id==='tour_kanto_route_17'){
    for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
      const px=tile(x),py=tile(y),walk=map.walkable[y]?.[x]==='.',band=Math.floor(y/14)%2;
      box(c,px,py,16,16,band?'#8f9569':'#9da478');
      if(walk){box(c,px,py,16,16,band?'#aaa389':'#bbb18f');box(c,px+2,py+3,12,1,'#d6c9a4');}
      else if((x+y)%4===0){box(c,px+3,py+8,10,7,'#566c50');box(c,px+5,py+4,7,7,'#78895c');}
    }
    for(const y of [14,28,42,56,70]){box(c,0,tile(y)-4,map.width*16,4,'#59615a');box(c,0,tile(y),map.width*16,2,'#c0ae7d');}
    for(const [x,y] of [[14,9],[11,22],[15,35],[14,50],[16,63],[13,78]])cityLamp(c,x,y);
    for(const y of [18,33,47,61,75]){box(c,tile(10),tile(y),tile(12),4,'#4c5657');box(c,tile(11),tile(y)-5,tile(10),6,'#d1bc83');}
    box(c,tile(23),tile(36)-12,64,12,'#4e6660');box(c,tile(24),tile(36)-18,48,7,'#d6c588');
    return;
  }
  if(map.id!=='tour_kanto_route_18')return;
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=tile(x),py=tile(y),walk=map.walkable[y]?.[x]==='.';
    box(c,px,py,16,16,x<25?'#899b6e':'#82a678');
    if(walk){box(c,px,py,16,16,x<25?'#b7ad90':'#b9b797');box(c,px+2,py+3,12,1,'#ddd0aa');}
    else if((x+y)%3===0){box(c,px+3,py+9,10,6,x>34?'#527b62':'#596f52');box(c,px+5,py+4,7,7,x>34?'#7da878':'#7f9366');}
  }
  box(c,tile(8),tile(11)-5,tile(14),5,'#4e5a5c');box(c,tile(9),tile(11)-11,tile(12),7,'#d0bc83');
  flowerRibbon(c,34,7,16,'#e4cc78','#cf86a7');flowerRibbon(c,39,22,12,'#efd994','#bc8bb9');
  for(const [x,y] of [[14,13],[27,16],[39,14],[49,15]])cityLamp(c,x,y);
  box(c,tile(48),tile(8)-9,72,9,'#52676a');box(c,tile(49),tile(8)-15,56,7,'#dabf91');
  box(c,tile(34),tile(5),tile(12),4,'#4b7973');box(c,tile(35),tile(5)-5,tile(10),6,'#8fc2b1');
}
