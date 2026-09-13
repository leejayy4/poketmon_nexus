import type { GameMap } from './types';
import { paintTallGrass } from './town';
import { JOHTO_ROUTE_29,JOHTO_ROUTE_45,JOHTO_ROUTE_46 } from './johto-blackthorn-south';

type GrassImage=HTMLImageElement|HTMLCanvasElement;
const tile=16;
const fill=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** Existing Route 29 geometry: city threshold, east-west track, north mountain junction and side lawns. */
function paintRoute29Ground(c:CanvasRenderingContext2D,map:GameMap){
  const path=new Set<string>();
  const lane=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)path.add(`${i},${j}`);};
  lane(1,14,78,3);lane(67,1,3,15);
  lane(13,8,3,7);lane(15,8,8,2);lane(44,16,3,8);lane(37,21,10,2);
  lane(25,10,4,2);lane(27,11,2,4);
  const props=new Set((map.props??[]).map(p=>`${p.x},${p.y}`));
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*tile,py=y*tile,key=`${x},${y}`;
    if(map.walkable[y][x]==='.'){
      if(path.has(key)){
        const city=x<11&&y>=14&&y<=16;
        fill(c,px,py,16,16,city?'#d3c6a5':'#c0b18a');
        if(city){fill(c,px,py+15,16,1,'#acaa8d');fill(c,px+(y%2)*8,py,1,15,'#bab296');}
        else{fill(c,px+3+(x%3),py+5,3,1,'#a69b78');fill(c,px+10,py+12,2,1,'#dcd0a8');}
      }else{
        // Short lawn is walkable and deliberately distinct from encounter tall grass.
        fill(c,px,py,16,16,(x+y)%3?'#8fa56b':'#98ad74');
        fill(c,px+3,py+10,3,1,'#bdc58b');fill(c,px+11,py+5,2,1,'#718957');
      }
      continue;
    }
    if(props.has(key))continue;
    const below=map.walkable[y+1]?.[x]==='.',above=map.walkable[y-1]?.[x]==='.';
    const side=map.walkable[y]?.[x-1]==='.'||map.walkable[y]?.[x+1]==='.';
    if(!below&&!above&&!side)continue;
    // Banks stay on collision cells; no painted ledge across a valid path.
    fill(c,px,py,16,16,'#607b52');fill(c,px+1,py+1,14,7,'#8d9e66');
    if(below){fill(c,px,py+9,16,7,'#8d8060');fill(c,px+2,py+9,12,2,'#c0b388');fill(c,px+5,py+13,8,2,'#726c51');}
    if(above)fill(c,px,py,16,3,'#c1bf8b');
    if(x<12&&(x+y)%3===0){fill(c,px+5,py+3,6,3,'#dcb9b5');fill(c,px+7,py+2,2,5,'#f0d6c5');}
  }
  // Flat stone seams at the actual northern warp announce the mountain road.
  // The habitat's eastern descent is shallow paving, not a new one-way warp.
  for(let y=10;y<=12;y++)for(let x=27;x<=28;x++)if(map.walkable[y]?.[x]==='.'){
    fill(c,x*tile+1,y*tile+4,14,3,'#dbcdab');
    fill(c,x*tile+2,y*tile+7,12,1,'#9d9578');
  }
  for(let y=1;y<=4;y++)for(let x=67;x<=69;x++)if(map.walkable[y]?.[x]==='.'){
    fill(c,x*tile+1,y*tile+2,14,10,'#b8b7a0');fill(c,x*tile+2,y*tile+12,12,2,'#8b927c');
  }
}

/** Route 46's dry practice clearing and switchback remain separate from encounter grass. */
function paintRoute46Ground(c:CanvasRenderingContext2D,map:GameMap){
  const grass=(x:number,y:number)=>(map.terrain??[]).some(p=>p.kind==='tallGrass'&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);
  for(let y=1;y<map.height-1;y++)for(let x=1;x<map.width-1;x++){
    if(map.walkable[y][x]!=='.'||grass(x,y))continue;
    const px=x*tile,py=y*tile;
    const ramp=y>=19&&y<=32&&x>=22;
    const clearing=x>=21&&x<=26&&y>=54&&y<=58;
    const trail=x>=17&&x<=19;
    const west=x<=15&&y>=38&&y<=52;
    fill(c,px,py,16,16,ramp?'#acac91':clearing?'#c7b88f':trail?'#b9ab83':west?'#94a573':'#a5ad80');
    if(ramp){
      // Flush stone seams follow the climbing hairpin without adding collision steps.
      fill(c,px+1,py+3,14,9,'#c4c1a4');fill(c,px+2,py+12,12,2,'#8c947e');
    }else if(clearing){
      fill(c,px+3,py+10,8,1,'#b3a27b');
      if(y===54)fill(c,px+2,py+2,12,2,'#e6d7ac');
    }else if(trail){fill(c,px+4,py+5,3,1,'#d6c9a3');fill(c,px+11,py+12,2,1,'#9b9473');}
    else{fill(c,px+3,py+11,3,1,'#bac28f');fill(c,px+10,py+4,2,1,'#7e9364');}
    // The narrow dry strip beside the western habitat is visibly distinct from tall grass.
    if(west&&(y===39||y===51||x===9)){
      fill(c,px+2,py+2,12,12,'#bcb38e');fill(c,px+4,py+12,8,1,'#d8cea9');
    }
  }
  // Actual drop face sits on the blocked row, leaving the y=23 launch floor unobscured.
  for(let x=15;x<=21;x++)if(map.walkable[24]?.[x]==='#'){
    fill(c,x*tile,24*tile,16,16,'#776e55');fill(c,x*tile,24*tile,16,3,'#c5b993');
    fill(c,x*tile+3,24*tile+7,10,2,'#9b8d6b');
  }
}

/** Layered cliff rims, ledges and grass make the southbound mountain direction readable. */
export function paintJohtoBlackthornSouth(c:CanvasRenderingContext2D,map:GameMap,grass:GrassImage){
  if(![JOHTO_ROUTE_45,JOHTO_ROUTE_46,JOHTO_ROUTE_29].includes(map.id as typeof JOHTO_ROUTE_45))return;
  if(map.id===JOHTO_ROUTE_45||map.id===JOHTO_ROUTE_46){
    if(map.id===JOHTO_ROUTE_46)paintRoute46Ground(c,map);
    for(let y=1;y<map.height-1;y++)for(let x=1;x<map.width-1;x++){
      if(map.walkable[y][x]!=='#')continue;
      const beside=map.walkable[y]?.[x-1]==='.'||map.walkable[y]?.[x+1]==='.';
      if(!beside)continue;
      const px=x*tile,py=y*tile;
      fill(c,px,py,tile,tile,(x+y)%3?'#65756f':'#71827a');
      fill(c,px+2,py+3,12,4,'#9eaa91');fill(c,px+4,py+9,9,2,'#4e625f');
      if((y+x)%5===0)fill(c,px+7,py+12,4,3,'#b8b795');
    }
    if(map.id===JOHTO_ROUTE_45){
    const ledgeY=32,ledgeX=17;
    fill(c,ledgeX*tile,ledgeY*tile-5,7*tile,5,'#485c58');
    fill(c,ledgeX*tile+5,ledgeY*tile-9,7*tile-10,5,'#c1b88c');
    for(let x=ledgeX+1;x<ledgeX+7;x+=2)fill(c,x*tile+4,ledgeY*tile-4,8,2,'#e1d6a5');
    }
    // Narrow runoff on blocked rock visually follows Route 45's mountain spring.
    if(map.id===JOHTO_ROUTE_45)for(let y=49;y<70;y++){
      fill(c,35*tile,y*tile,8,tile,'#567c83');fill(c,35*tile+2,y*tile+(y%2?5:10),6,2,'#a9ced0');
    }
  }else{
    paintRoute29Ground(c,map);
  }
  for(const patch of map.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++)paintTallGrass(c,x*tile,y*tile,false,0,grass);
}

/** Small water glints and grass sway animate only the authored side habitats. */
export function paintJohtoBlackthornSouthMotion(c:CanvasRenderingContext2D,map:GameMap,clock:number){
  if(map.id!==JOHTO_ROUTE_45&&map.id!==JOHTO_ROUTE_46)return;
  const sway=Math.sin(clock*3.2)>0?1:-1;
  for(const patch of map.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y+=3)for(let x=patch.x;x<patch.x+patch.w;x+=2){
    fill(c,x*tile+6+sway,y*tile+3,3,6,(x+y)%2?'#587b55':'#6e8e5d');
  }
  if(map.id===JOHTO_ROUTE_45)for(const y of [53,58,63,68])fill(c,35*tile+2+sway,y*tile+7,5,1,'#d5e4d7');
}
