import type { Furnishing,TourInterior,RoomStyle } from './explore-interiors';
type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
export const HALL_SAMPLES={tile:['lab-reference',80,80,16,16],wood:['home-reference',160,80,16,16],shelf:['lab-reference',42,20,30,32],desk:['lab-reference',24,55,48,24],monitor:['home-reference',94,48,30,28],window:['lab-reference',105,13,26,17]} as const;
function sample(c:CanvasRenderingContext2D,images:Images,key:keyof typeof HALL_SAMPLES,x:number,y:number){const [name,sx,sy,w,h]=HALL_SAMPLES[key];c.drawImage(images[name],sx,sy,w,h,x,y,w,h);}

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const PALETTES:Record<RoomStyle,[string,string,string,string]>={
  studio:['#6d7e95','#c2cad0','#a1b2bc','#6e8495'],museum:['#897d6b','#dfd8bc','#d4ccb1','#956b4d'],
  garden:['#6e907f','#d3dfbf','#c4d4b1','#6d9a89'],shrine:['#77697b','#cfbf9f','#bfab8c','#8f6579'],
  stage:['#967784','#ded0c7','#d1c0bc','#b0718b'],shop:['#8c9588','#e0ddc5','#d1d7c5','#85a799'],
  terminal:['#738e9a','#d1ddda','#bfd0d0','#6696ac'],lab:['#788f8e','#dee5d8','#cedbd3','#6f9b94'],
  school:['#869373','#e4d8bc','#d5c9ae','#85a473'],workshop:['#827e6e','#c9c5b2','#b9b6a6','#b78c5e'],
  gallery:['#96948a','#e7e1cd','#dad4c3','#859ba1'],dojo:['#837865','#d0bf99','#c5b18c','#7b9b90'],
  center:['#988582','#e4e2d4','#d4dbd2','#c58582'],
};

export function paintTourFurnishing(c:CanvasRenderingContext2D,images:Images,room:TourInterior,o:Furnishing){
  const accent=PALETTES[room.style][3],x=o.x*16,y=o.y*16-8,w=o.w*16,h=o.h*16+8;
  c.save();c.beginPath();c.rect(x,y-4,w,h+4);c.clip();
  // The footprint stays fixed; raised faces overlap actors behind the exhibit.
  box(c,x+2,y+h-5,w-2,5,'#39463c55');
  if(!['camera','plants','bench','stage','altar','memorial','bell'].includes(o.kind)){
    box(c,x,y+9,w,h-10,'#657371');box(c,x+2,y+10,w-4,h-13,'#bbc5ae');
    box(c,x,y+h-10,w,6,'#8e9c8e');box(c,x+2,y+h-10,w-4,2,'#dde1c5');
    box(c,x+2,y+2,w-4,24,'#e5dfbc');
  }
  const r=(a:number,b:number,d:number,e:number,color:string)=>box(c,x+a,y+b,d,e,color);
  if(o.kind==='shelf'&&!/리본|인형|여행용품|가판/.test(o.name)){
    c.save();c.beginPath();c.rect(x,y,w,h-4);c.clip();
    for(let i=0;i<w;i+=30)sample(c,images,'shelf',x+i,y+1);c.restore();
    r(1,32,w-2,2,'#c8bf87');r(2,34,w-4,3,'#827b57');
  }else if(o.kind==='console'){
    c.save();c.beginPath();c.rect(x,y,w,h-5);c.clip();sample(c,images,'desk',x,y+13);c.restore();
    sample(c,images,'monitor',x+(w-30)/2,y-3);
    r(5,27,w-10,5,'#586a79');for(let i=0;i<Math.floor((w-10)/6);i++)r(6+i*6,28,3,2,i%2?'#d7c48b':'#89b9a9');
  }else if(o.kind==='workbench'){
    c.save();c.beginPath();c.rect(x,y,w,h-5);c.clip();sample(c,images,'desk',x,y+8);c.restore();
    if(o.name.includes('학생')){r(10,11,13,10,'#f8f3da');r(11,12,1,8,'#b6977b');r(14,14,7,1,'#839ea2');r(28,13,2,9,'#ae755f');}
    else{r(7,12,3,13,'#687e85');r(5,11,8,4,'#b8c7bd');r(21,14,w-27,3,'#607078');r(24,19,3,6,'#aa7352');}
  }else
  if(o.kind==='healer'){
    r(3,3,w-6,h-8,'#a8b4b5');r(6,5,w-12,13,'#456575');r(8,7,w-16,7,'#99d1cc');
    for(let i=0;i<3;i++){r(7+i*12,9,7,7,'#d07873');r(7+i*12,13,7,3,'#f2ead0')}
  }else if(o.kind==='camera'){
    const mid=w/2;
    r(mid-2,15,4,18,'#3f535d');r(mid-1,16,1,15,'#bcc8c0');
    for(let i=0;i<7;i++){r(mid-3-i,25+i,3,2,'#596e75');r(mid+1+i,25+i,3,2,'#879999');}
    r(mid-13,31,8,3,'#344952');r(mid+5,31,8,3,'#344952');
    r(mid-13,3,25,16,'#334953');r(mid-11,4,21,3,'#a3b8b8');r(mid-11,7,21,9,'#637e8c');r(mid-8,9,7,5,'#8da6b0');
    r(mid+11,7,6,9,'#293e4b');r(mid+13,8,3,6,'#b3d8d0');r(mid-7,0,10,3,'#3e5663');r(mid-10,9,2,2,'#bf8175');
  }else if(o.kind==='shelf'){
    r(3,3,w-6,24,'#647977');r(5,5,w-10,19,'#b2c9bc');
    for(let i=0;i<Math.floor((w-8)/12);i++){
      const px=7+i*12,color=['#b380a3','#d1b774','#85aeb8'][i%3];
      if(o.name.includes('리본')){r(px,8,7,7,color);r(px-1,10,9,3,color);r(px+1,15,2,7,color);r(px+5,15,2,7,color);r(px+2,10,3,3,'#ecdb9e');}
      else if(o.name.includes('인형')){r(px,8,2,5,color);r(px+6,8,2,5,color);r(px,12,8,8,color);r(px+1,20,6,3,color);r(px+2,14,1,2,'#3f515c');r(px+6,14,1,2,'#3f515c');}
      else{r(px,10,8,12,color);r(px+2,7,4,3,'#677b78');r(px+1,12,6,2,'#dddaba');}
    }
    r(4,25,w-8,2,'#e7d7ae');r(5,5,w-10,1,'#e6eee0');
  }else if(o.kind==='tank'){
    r(3,3,w-6,22,'#81b8bc');r(5,5,w-10,16,'#539cac');r(5,20,w-10,3,'#cfca9e');
    for(let i=0;i<3;i++){r(8+i*11,12,2,9,'#88bc89');r(6+i*11,13,6,2,'#a2c69a');r(11+i*10,7,2,2,'#d8ece1')}
    r(6,5,w-12,2,'#cde5da');r(w-9,7,2,12,'#a1d8d3');
  }else if(o.kind==='plants'){
    r(3,3,w-6,23,'#899c72');for(let i=0;i<Math.max(2,Math.floor(w/14));i++){const px=6+i*12;r(px,17,8,7,'#bb8c70');r(px+2,9,4,9,'#638762');r(px-1,7,10,7,'#87af72');r(px+2,5,4,5,accent)}
  }else if(o.kind==='chart'){
    r(3,3,w-6,23,'#8c765c');r(5,5,w-10,18,'#eee3bf');r(9,8,w-18,2,'#8aa49c');
    r(10,13,3,7,'#82a693');r(10,17,w-22,3,'#82a693');r(w-15,10,3,9,'#82a693');r(w-19,10,9,2,'#ab8581');
  }else if(o.kind==='bench'){
    r(3,3,w-6,9,accent);r(3,14,w-6,9,accent);r(5,24,4,6,'#536b70');r(w-9,24,4,6,'#536b70');
    r(3,12,4,12,'#d5c7a6');r(w-7,12,4,12,'#d5c7a6');r(9,5,w-18,2,'#dfd5ba');
  }else if(o.kind==='stage'){
    r(2,2,w-4,24,'#bc9c76');for(let i=4;i<w-4;i+=8)r(i,3,1,20,'#8e785f');
    r(2,2,8,19,accent);r(w-10,2,8,19,accent);r(2,2,w-4,5,accent);r(w/2-2,12,4,11,'#566778');r(w/2-4,10,8,4,'#b4c6c0');
  }else if(o.kind==='mineral'||o.kind==='fossil'){
    r(4,4,w-8,20,'#99a89b');r(8,7,w-16,14,o.kind==='fossil'?'#c8b490':'#899baf');
    if(o.kind==='fossil'){r(13,10,14,2,'#776f63');r(13,10,2,10,'#776f63');r(14,19,12,2,'#776f63');r(25,12,2,7,'#776f63');r(18,14,8,2,'#776f63')}
    else{r(13,5,6,14,'#d6e5dc');r(21,9,7,12,'#b4cbd0');r(9,18,w-20,3,'#718991')}
  }else if(o.kind==='altar'||o.kind==='memorial'||o.kind==='bell'){
    r(6,22,w-12,5,'#969e96');r(9,19,w-18,4,'#c6c7ae');
    if(o.kind==='bell'){r(w/2-10,4,20,3,'#8f765a');r(w/2-12,4,3,15,'#8f765a');r(w/2+9,4,3,15,'#8f765a');r(w/2-5,8,10,8,'#cbb16d');r(w/2-7,16,14,3,'#e2cc8d')}
    else{r(w/2-6,5,12,15,o.kind==='memorial'?'#878296':'#78999b');r(w/2-9,14,18,5,'#9aaeb0');r(w/2-3,8,6,3,'#dedbc0');r(5,23,4,3,'#c5919d')}
  }else if(o.kind==='machine'){
    r(5,4,w-10,19,'#839499');r(7,6,12,9,'#55777d');r(9,7,8,4,'#bfdad0');r(w-17,7,8,12,'#c5cfbf');
    r(9,18,5,3,'#c78973');r(17,18,5,3,'#d1bc7b');r(w-16,2,6,4,'#d4d0b6');
  }else if(o.kind==='model'){
    r(3,3,w-6,21,'#8ea991');r(6,19,w-12,3,'#d6c49b');
    if(o.name.includes('탄광')){r(6,20,w-12,2,'#495b62');r(6,25,w-12,2,'#495b62');for(let i=8;i<w-6;i+=6)r(i,19,2,9,'#ae9670');r(13,10,22,11,'#657885');r(15,12,18,6,'#a1adb0');r(17,6,6,6,'#535e64');r(24,7,7,5,'#768388');r(15,21,4,4,'#364952');r(29,21,4,4,'#364952');}
    else if(o.name.includes('비행')){r(8,12,w-16,5,'#e2e6d9');r(w/2-2,5,4,18,'#dde4d8');r(w/2-8,19,16,3,'#8ba7b3')}
    else if(o.name.includes('관람차')){c.strokeStyle='#e2d6ac';c.lineWidth=2;c.beginPath();c.arc(x+w/2,y+12,9,0,Math.PI*2);c.stroke();r(w/2-1,12,2,12,'#71878f');for(const [a,b]of [[-10,10],[7,10],[-2,2],[-2,19]])r(w/2+a,b,5,4,accent)}
    else if(/선박|여객선|등대/.test(o.name)){r(7,15,w-14,6,'#eee3bf');r(13,10,w-26,7,'#cad6cd');r(w/2-3,5,6,7,accent)}
    else{r(8,10,10,11,'#d4cab0');r(21,6,10,15,'#91b3b7');r(22,8,7,2,'#dce2cd');if(w>38)r(33,13,7,8,'#c5ae8c')}
  }
  // A small brass label makes the investigation surface visible without covering the art.
  r(w/2-5,h-5,10,3,'#ead7a1');
  c.restore();
}

export function paintTourInterior(c:CanvasRenderingContext2D,images:Images,room:TourInterior){
  const [wall,floor,,accent]=PALETTES[room.style],style=room.style;
  const wood=['shrine','stage','school','workshop','dojo','gallery'].includes(style);
  box(c,0,0,256,224,'#172b34');box(c,28,10,200,184,'#354746');
  box(c,32,12,192,36,wall);
  for(let x=32;x<224;x+=16){box(c,x+1,14,14,23,floor);box(c,x+2,15,12,1,'#f4f1d4');box(c,x+1,35,14,3,accent);}
  box(c,32,39,192,9,accent);box(c,32,40,192,2,'#e0d5b9');
  for(let y=3;y<=11;y++)for(let x=2;x<=13;x++){
    sample(c,images,wood?'wood':'tile',x*16,y*16);
    if(!wood){c.save();c.globalAlpha=.2;box(c,x*16,y*16,16,16,floor);c.restore();}
  }
  // Floor finishes are walkable. All ornamental wall details stay above row 3.
  if(['museum','gallery','shop'].includes(style)){
    box(c,112,96,32,79,accent);box(c,114,98,28,75,'#cdc4a1');box(c,117,100,22,71,accent);
    for(let y=102;y<170;y+=8){box(c,115,y,2,2,'#ebe3ba');box(c,139,y,2,2,'#ebe3ba');}
  }
  if(style==='garden'){
    for(let x=39;x<211;x+=43){sample(c,images,'window',x,19);box(c,x-2,36,30,4,'#658d74');}
    for(let y=3;y<12;y++)for(const x of [2,13]){box(c,x*16,y*16,16,16,'#bbcbb0');box(c,x*16+1,y*16+1,14,14,'#cfdbc0');}
  }else if(style==='studio'){
    for(let x=34;x<223;x+=6)for(let y=14;y<42;y+=6){box(c,x,y,4,4,'#445666');box(c,x,y,4,1,'#7f929c');}
    for(let x=97;x<157;x+=20){box(c,x,20,18,17,'#273e4b');box(c,x+2,22,14,11,'#83b4b6');box(c,x+3,29,12,2,'#b3d7ca');}
    box(c,104,117,48,36,'#657984');box(c,106,119,44,32,'#91a2a4');
  }else if(style==='stage'){
    box(c,33,12,190,29,'#985e7b');for(let x=35;x<223;x+=8){box(c,x,14,3,25,'#c47f9b');box(c,x+4,15,2,21,'#6b5268');}
    box(c,35,12,186,4,'#d4b17b');box(c,108,112,40,56,'#ba7f89');box(c,110,114,36,52,'#d4ab9e');
  }else if(style==='shrine'||style==='dojo'){
    box(c,32,14,192,28,'#cbbd97');for(let x=34;x<224;x+=16){box(c,x,16,2,25,'#817759');box(c,x+2,27,13,1,'#ad9f78');}
    for(const x of [32,94,156,218]){box(c,x,12,6,36,'#685b49');box(c,x+1,13,2,33,'#a18a65');}
    for(let y=112;y<178;y+=16)for(let x=104;x<153;x+=16){box(c,x,y,16,16,'#a4ac83');box(c,x+1,y+1,14,14,'#cfcc9e');for(let k=3;k<14;k+=3)box(c,x+2,y+k,12,1,'#bdbe91');}
  }else if(style==='school'){
    box(c,77,17,106,27,'#856e53');box(c,80,19,100,22,'#466e60');box(c,83,23,42,1,'#d8dcbf');box(c,86,29,31,1,'#d8dcbf');box(c,139,24,26,11,'#6e9781');box(c,159,38,8,2,'#eee5bf');
  }else if(style==='workshop'){
    box(c,35,17,186,23,'#72817c');for(let x=39;x<219;x+=9)for(let y=20;y<37;y+=7)box(c,x,y,1,1,'#3b5555');
    for(let x=39;x<219;x+=16){box(c,x,111,9,3,'#d2b267');box(c,x+9,111,7,3,'#555e59');}
  }else if(style==='terminal'){
    box(c,85,18,92,25,'#364e61');for(let y=22;y<41;y+=6){box(c,91,y,24,2,'#d8d8b5');box(c,121,y,20,2,'#8fb7b7');box(c,151,y,19,2,'#d1b985');}
  }else if(style==='lab'){
    for(const x of [46,183])sample(c,images,'window',x,20);
    box(c,103,19,51,23,'#5e8483');box(c,106,22,45,17,'#aec9be');box(c,125,25,6,11,'#eef0d7');box(c,120,28,16,5,'#eef0d7');
  }else{
    for(const x of [51,113,175]){box(c,x,18,28,24,'#7c715c');box(c,x+2,20,24,20,'#ddcea7');box(c,x+4,22,20,12,accent);box(c,x+7,29,14,7,'#a8b598');}
  }
  box(c,28,47,4,145,'#6b786b');box(c,224,47,4,145,'#6b786b');
  box(c,32,189,96,3,'#7b806a');box(c,144,189,80,3,'#7b806a');
  box(c,128,176,16,48,'#865d57');box(c,130,178,12,46,'#bb816e');for(let y=181;y<224;y+=8)box(c,132,y,8,1,'#d8a383');
}
