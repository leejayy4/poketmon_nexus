import type { GameMap } from './types';
import { ROUTE_34_PATHS,ROUTE_34_WATER,ROUTE_34_SIGNS } from './goldenrod-route';
import { paintTourGround,paintTourPaths } from './explore-materials';
import { paintTallGrass } from './town';

/** Inlaid paving distinguishes the station, radio forecourt and residential lanes. */
export function paintGoldenrodPaving(c:CanvasRenderingContext2D,walkable:string[]){
  c.save();
  const zones=[
    {x:2,y:11,w:10,h:4,color:'#bca776'},{x:25,y:21,w:11,h:4,color:'#98b5bc'},{x:5,y:27,w:22,h:3,color:'#bdad94'},
    {x:36,y:11,w:18,h:3,color:'#879da2'},{x:38,y:12,w:3,h:18,color:'#91a8aa'},
    {x:3,y:37,w:50,h:3,color:'#c1aa78'},{x:3,y:45,w:50,h:3,color:'#bca27b'},
    {x:3,y:57,w:50,h:3,color:'#a7a88d'},{x:12,y:32,w:5,h:38,color:'#b8ad8d'},
  ];
  for(const z of zones)for(let y=z.y;y<z.y+z.h;y++)for(let x=z.x;x<z.x+z.w;x++){
    if(walkable[y]?.[x]!=='.')continue;
    c.fillStyle=z.color;c.fillRect(x*16,y*16,16,16);
    c.fillStyle='#dedbc3';c.fillRect(x*16,y*16,16,1);c.fillRect(x*16,y*16,1,16);
    c.fillStyle='#8c9285';c.fillRect(x*16+15,y*16+1,1,15);c.fillRect(x*16+1,y*16+15,15,1);
    if((x+y)%3===0){c.fillStyle='#cfc8ab';c.fillRect(x*16+6,y*16+6,4,4);}
  }
  c.restore();
}

/** Small district details make Goldenrod's expanded quarters readable at field scale. */
export function paintGoldenrodDistricts(c:CanvasRenderingContext2D){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  // Radio postcard board beside the eastern garden.
  fill(41*16+2,22*16,12,22,'#665f55');fill(41*16-5,22*16-5,26,16,'#c8b47b');fill(41*16-3,22*16-3,22,12,'#eee2b8');
  fill(41*16,22*16,7,5,'#b46f67');fill(41*16+9,22*16+1,7,4,'#7294a1');
  // Market awning, berry baskets and a low delivery cart.
  fill(3*16,44*16+5,70,5,'#796a58');
  for(let i=0;i<4;i++){fill(3*16+i*18,44*16-7,18,12,i%2?'#efe0b0':'#b9655d');fill(3*16+i*18+3,44*16+10,3,17,'#655d50');}
  for(const [x,y,color] of [[6,48,'#c46d5e'],[8,48,'#d2b05f'],[10,48,'#78945e']] as const){fill(x*16,y*16+7,22,12,'#8a6b4b');fill(x*16+3,y*16+3,16,7,color);fill(x*16+5,y*16+1,4,3,'#668654');}
  fill(30*16,55*16+4,58,18,'#9a7957');fill(30*16+3,55*16+7,52,9,'#c7a36f');
  fill(30*16+8,55*16+20,8,5,'#4f5d5d');fill(30*16+43,55*16+20,8,5,'#4f5d5d');
  // Forest threshold lanterns and leaf-shaped departure sign.
  for(const x of [17,31]){fill(x*16+6,66*16-6,4,24,'#5e6455');fill(x*16+3,66*16-9,10,8,'#d4bd72');fill(x*16+5,66*16-7,6,4,'#f2e4a5');}
  fill(22*16,65*16,5,24,'#655d4d');fill(22*16-9,65*16-8,24,13,'#718d59');fill(22*16-6,65*16-5,18,7,'#d9d4a5');
}

export function paintGoldenrodStation(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  fill(0,0,448,352,'#243e49');
  for(let y=9;y<=19;y++)for(let x=2;x<=25;x++){
    c.drawImage(images['jubilife-reference'],464,112,16,16,x*16,y*16,16,16);
  }
  // Stationary carriage; the open door matches the actual boarding warp (22,9).
  fill(32,126,384,13,'#354d57');fill(32,136,384,3,'#98a4a2');
  fill(37,42,376,91,'#526d7c');fill(39,40,372,5,'#dbdfd1');fill(39,45,372,85,'#c0d3d0');
  fill(39,114,372,7,'#b0985e');fill(39,121,372,3,'#e4d6ab');
  for(const x of [48,96,144,192,240,288]){
    fill(x,53,25,22,'#425f73');fill(x+2,55,21,18,'#83b4bf');fill(x+3,56,14,2,'#cbe3d9');
  }
  fill(350,50,21,82,'#405868');fill(353,53,15,79,'#233d4b');
  fill(352,132,16,28,'#9daea5');fill(354,137,12,2,'#d6d9c6');fill(354,143,12,2,'#d6d9c6');
  fill(32,156,320,3,'#d9bd66');fill(368,156,48,3,'#d9bd66');
  // Timetable, waiting bench and street exit sit on their authored tiles.
  fill(64,187,48,20,'#40596a');fill(66,189,44,15,'#e8dfb8');
  fill(70,193,31,2,'#718781');fill(70,198,25,2,'#718781');
  fill(64,268,80,7,'#aa8457');fill(64,278,80,6,'#c1a16c');fill(67,284,3,4,'#5e6258');fill(137,284,3,4,'#5e6258');
  fill(224,320,16,32,'#c2b38e');fill(225,321,14,13,'#a1906c');
  c.save();c.font='8px Galmuri11, monospace';c.textAlign='center';c.fillStyle='#f0e5b8';
  c.fillText('노랑시티행',224,26);c.fillText('금빛 거리 ↓',232,314);c.restore();
}

/** Native DS ground and whole trees; river and rest stop share the collision grid. */
export function paintRoute34(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    paintTourGround(c,images['town-reference'],x*16,y*16,'forest');
    if(map.walkable[y][x]==='.'&&ROUTE_34_PATHS.some(([rx,ry,w,h])=>x>=rx&&x<rx+w&&y>=ry&&y<ry+h))paths.add(`${x},${y}`);
  }
  paintTourPaths(c,images['town-reference'],paths,'forest');
  for(const patch of map.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++)paintTallGrass(c,x*16,y*16,false,0,images['grass-reference']);
  const water=ROUTE_34_WATER;
  for(let y=water.y;y<water.y+water.h;y++)for(let x=water.x;x<water.x+water.w;x++){
    fill(x*16,y*16,16,16,'#599dad');fill(x*16+2+(y%2)*2,y*16+6,8,1,'#b2dcd1');fill(x*16+7,y*16+12,6,1,'#80bcbe');
  }
  fill(6*16,15*16,4,10*16,'#d0c392');fill(6*16+4,15*16,4,10*16,'#77946a');
  // Leaves caught beside a river stone identify the existing investigation tile (6,19).
  fill(6*16+3,19*16+8,11,6,'#667b70');
  fill(6*16+4,19*16+6,8,6,'#b5bc9c');
  fill(6*16+5,19*16+6,5,2,'#e0dab6');
  fill(6*16+1,19*16+3,6,3,'#63874e');
  fill(6*16,19*16+4,5,1,'#a7be70');
  fill(6*16+9,19*16+2,5,3,'#839c55');
  for(let y=1;y<map.height-2;y+=2)for(let x=0;x<map.width-1;x+=2){
    const blocked=[0,1].every(dx=>[0,1,2].every(dy=>map.walkable[y+dy]?.[x+dx]==='#'));
    const river=x<7&&x+2>water.x&&y<water.y+water.h&&y+3>water.y;
    const prop=map.props.some(p=>p.x>=x&&p.x<x+2&&p.y>=y&&p.y<y+3);
    if(blocked&&!river&&!prop)c.drawImage(images['sandgem-reference'],24,88,32,48,x*16,y*16,32,48);
  }
  for(const p of ROUTE_34_SIGNS){
    fill(p.x*16+6,p.y*16+3,4,16,'#6d6551');fill(p.x*16+1,p.y*16-1,14,11,'#777d69');fill(p.x*16+2,p.y*16,12,8,'#ede2b7');fill(p.x*16+4,p.y*16+3,8,1,'#858b73');
  }
  // Single-tile bench at the authored, blocked interaction tile.
  fill(23*16,25*16,16,5,'#ac8958');fill(23*16,25*16+7,16,4,'#c5a570');
  fill(23*16+2,25*16+11,2,5,'#655e4e');fill(23*16+12,25*16+11,2,5,'#655e4e');
  // Pasture fence and the stone that marks the transition into Ilex Forest.
  for(let x=7;x<=22;x++){if(x===13||x===14)continue;fill(x*16,48*16+5,16,4,'#a28159');fill(x*16+6,47*16+8,4,24,'#665f50');}
  fill(11*16+2,47*16+5,12,9,'#b69564');fill(11*16+5,47*16+2,6,5,'#d0b77d');
  fill(25*16+2,63*16+5,12,10,'#66776f');fill(25*16+4,63*16+2,8,11,'#aeb79f');fill(25*16+5,63*16+5,6,2,'#dcd8b8');
  for(const [x,y] of [[10,61],[27,60],[8,67]]){fill(x*16+3,y*16+8,10,3,'#617c4e');fill(x*16+6,y*16+4,4,7,'#8eaa63');}
  // Small footprint and leaf clues sit on the four authored ecology props.
  for(const [x,y] of [[9,18],[23,47]]){
    fill(x*16+3,y*16+10,4,3,'#8b765a');fill(x*16+9,y*16+5,4,3,'#8b765a');
    fill(x*16+1,y*16+3,6,2,'#6e8b55');fill(x*16+3,y*16+1,3,3,'#9eb86d');
  }
  for(const [x,y] of [[22,22],[6,56]]){
    fill(x*16+2,y*16+9,12,4,'#8b8064');fill(x*16+4,y*16+6,8,5,'#b3a879');
    fill(x*16+1,y*16+3,5,2,'#688653');fill(x*16+10,y*16+2,5,3,'#78945c');
  }
}
