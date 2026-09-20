import type { GameMap } from './types';
import { ICIRRUS_YARD_AISLES,ICIRRUS_LOOKOUT_ACCESS,ICIRRUS_LOOKOUT_SIGN,ICIRRUS_POND_BANK } from './icirrus-city-layout';

const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const t=(n:number)=>n*16;

/** A working drying yard replaces the snow-garden stamp; fixtures stay off walkable cells. */
export function paintIcirrusLivingYard(c:CanvasRenderingContext2D,map:GameMap,x:number,y:number,w:number,h:number){
  c.save();
  try{
    c.beginPath();
    for(let ty=y/16;ty<(y+h)/16;ty++)for(let tx=x/16;tx<(x+w)/16;tx++){
      if(map.walkable[ty]?.[tx]!=='.')c.rect(tx*16,ty*16,16,16);
    }
    c.clip();
    box(c,x,y,w,h,'#89977d');
    for(let py=y+4;py<y+h;py+=12){box(c,x+3,py,w-6,1,'#adb191');}
    // West: stone rinse trough and a separate shallow drainage channel.
    box(c,x+12,y+15,54,38,'#4f6d64');box(c,x+15,y+17,48,30,'#b8bba0');
    box(c,x+20,y+21,38,20,'#729d99');box(c,x+23,y+24,31,2,'#bad1bc');
    box(c,x+33,y+47,8,h-53,'#637d70');box(c,x+35,y+49,3,h-55,'#8bad99');
    // East: two drying rails with unevenly hung cloths and clear ground between them.
    for(const ry of [y+20,y+64]){
      box(c,x+90,ry+4,w-103,3,'#566a53');
      for(const rx of [x+92,x+w-17])box(c,rx,ry,3,26,'#657456');
      for(let i=0;i<3;i++){
        const rx=x+99+i*22;box(c,rx,ry+5,14,14+i*3,'#d1c69d');
        box(c,rx+2,ry+8,10,2,'#9cae90');box(c,rx+4,ry+19+i*3,7,1,'#6b816b');
      }
    }
    // Low equipment shelf and paired boots identify the household use from the street.
    box(c,x+10,y+h-26,60,5,'#c3b68a');box(c,x+14,y+h-21,4,15,'#53684f');
    for(const rx of [x+24,x+38]){box(c,rx,y+h-19,7,10,'#5a7465');box(c,rx,y+h-10,11,4,'#405b50');}
  }finally{c.restore();}
}

/** Southern windmill replaces the oversized relief; the collision mask protects the street. */
export function paintIcirrusTravelRelief(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,map:GameMap){
  c.save();c.beginPath();
  for(let ty=y/16;ty<(y+h)/16;ty++)for(let tx=x/16;tx<(x+w)/16;tx++)if(map.walkable[ty]?.[tx]==='#')c.rect(tx*16,ty*16,16,16);
  c.clip();
  box(c,x,y,w,h,'#829578');
  // Whole silhouette occupies tiles (34..36,34..35), above the street at row 36.
  // Require the entire footprint to be blocked: clipping must never manufacture fragments.
  const footprint={x:x/16+3,y:y/16,w:3,h:2};
  let intact=true;
  for(let ty=footprint.y;ty<footprint.y+footprint.h;ty++)for(let tx=footprint.x;tx<footprint.x+footprint.w;tx++){
    if(map.walkable[ty]?.[tx]!=='#')intact=false;
  }
  if(intact){
    const cx=x+72,cy=y+12;
    box(c,cx-9,y+27,18,4,'#526c62');box(c,cx-7,y+25,14,3,'#c1c4a6');
    box(c,cx-4,cy+2,8,13,'#9c9876');box(c,cx-3,cy+2,3,13,'#c7bea0');
    for(const [dx,dy,bw,bh] of [[-19,-2,16,4],[3,-2,16,4],[-2,-11,4,8],[-2,3,4,8]]){
      box(c,cx+dx,cy+dy,bw,bh,'#655f4d');box(c,cx+dx+1,cy+dy+1,bw-2,bh-2,'#ded1a5');
    }
    box(c,cx-3,cy-3,6,6,'#4b665e');box(c,cx-1,cy-1,2,2,'#bfac78');
  }
  // One compact route board retains the existing investigation event at the southern edge.
  const sign=map.props.find(p=>p.dialogue==='tourOutdoor3');
  if(sign){const sx=sign.x*16,sy=sign.y*16;box(c,sx+6,sy+6,3,10,'#5c6552');box(c,sx+1,sy+1,14,9,'#d2c69d');box(c,sx+4,sy+4,8,1,'#5b7768');box(c,sx+9,sy+3,2,4,'#5b7768');}
  c.restore();
}
/** BW/BW2-inspired wetland depth and raised dry ground for Icirrus City. */
export function paintIcirrusTownDetails(c:CanvasRenderingContext2D,map?:GameMap){
  if(map)for(const r of ICIRRUS_YARD_AISLES)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    box(c,x*16,y*16,16,16,'#b9a97f');
    box(c,x*16+1,y*16+3,14,1,'#dfc89b');box(c,x*16+1,y*16+12,14,1,'#7c775e');
    box(c,x*16+3,y*16+6,1,1,'#676b55');
  }
  // Follow the actual dry surface; doors, residents and props remain in their original cells.
  if(map)for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    const px=t(x),py=t(y),north=x>=24&&x<=29&&y<=16,east=y>=16&&y<=19&&x>=28;
    if(north||east){
      box(c,px,py,16,16,north?'#b5bba9':'#b4ad8b');
      box(c,px,py+13,16,1,'#8b9586');
      if((x+y)%3===0)box(c,px+5,py+3,1,10,'#d1d4bd');
    }
    if(map.walkable[y+1]?.[x]==='#'){
      box(c,px,py+10,16,6,'#52675f');box(c,px,py+9,16,2,'#d0c7a5');
      box(c,px+7,py+12,1,4,'#839183');
    }
  }
  // The pond-side bank connects the low southern street to the northern dry approach.
  if(map){const r=ICIRRUS_POND_BANK;
    for(let y:number=r.y;y<r.y+r.h;y++)for(let x:number=r.x;x<r.x+r.w;x++){
      if(map.walkable[y]?.[x]!=='.')continue;
      box(c,t(x),t(y),16,16,'#b5b7a0');
      if(y===12||y===13)for(const offset of [3,8,13]){
        box(c,t(x),t(y)+offset,16,2,'#d9d4b6');box(c,t(x),t(y)+offset+2,16,1,'#788b7b');
      }else {box(c,t(x),t(y)+15,16,1,'#8b9b87');box(c,t(x)+15,t(y),1,16,'#98a48b');}
      if(x===r.x&&map.walkable[y]?.[x-1]==='#')box(c,t(x),t(y),2,16,'#d4cfad');
    }
  }
  // Paired carved stones frame the northward tower approach, leaving its five-tile path open.
  // A traversable south stair and landing replace the formerly sealed lookout plot.
  if(map)for(const r of ICIRRUS_LOOKOUT_ACCESS)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    const px=t(x),py=t(y),stairs=y>=22;
    box(c,px,py,16,16,'#aab39a');
    if(stairs)for(const offset of [3,8,13]){box(c,px,py+offset,16,2,'#d6d4b5');box(c,px,py+offset+2,16,1,'#6b7d6b');}
    else {box(c,px,py+15,16,1,'#768975');box(c,px+15,py,1,16,'#8a997e');}
  }
  if(map?.props.some(p=>p.dialogue==='tourOutdoor2'&&p.x===ICIRRUS_LOOKOUT_SIGN.x&&p.y===ICIRRUS_LOOKOUT_SIGN.y)){
    const px=t(ICIRRUS_LOOKOUT_SIGN.x),py=t(ICIRRUS_LOOKOUT_SIGN.y);
    box(c,px+6,py+9,4,7,'#53675d');box(c,px+1,py+2,14,9,'#d6d4b5');
    box(c,px+2,py+10,12,2,'#6b7d6b');box(c,px+7,py+4,2,5,'#49645e');
    box(c,px+5,py+5,6,2,'#49645e');
  }
  for(const x of [23,30]){
    if(!map)continue;
    c.save();c.beginPath();
    // Clip the full projected column, including its cap and footing, to real obstacles.
    for(let y=3;y<=5;y++)if(map.walkable[y]?.[x]==='#')c.rect(t(x),t(y),16,16);
    c.clip();
    box(c,t(x)+2,t(4),12,26,'#465f60');box(c,t(x)+3,t(4)-6,10,25,'#96a89b');
    box(c,t(x)+5,t(4)-4,3,17,'#c6d1bd');box(c,t(x)+6,t(4)+5,6,2,'#597771');
    box(c,t(x),t(4)+21,16,5,'#3f5755');
    c.restore();
  }
  // Lookout masonry is drawn once by the collision-clipped feature painter.
  // Living-yard furniture is drawn once by its collision-clipped feature painter.

  // Flat northbound inlays follow the actual outdoor exit, not a decorative gate.
  const north=map?.warps.find(warp=>warp.to==='tour_dragonspiral_approach');
  if(north&&map)for(let offset=1;offset<=4;offset++){
    const x=north.x,y=north.y+offset;if(map.walkable[y]?.[x]!=='.')continue;
    box(c,t(x)+6,t(y)+6,3,7,'#d4d6ba');box(c,t(x)+4,t(y)+5,7,3,'#d4d6ba');box(c,t(x)+6,t(y)+3,3,2,'#d4d6ba');
  }
  const east=map?.warps.find(warp=>warp.to==='tour_unova_route_08');
  if(east&&map){
    // Flat inlaid arrows follow the actual warp approach without inventing a second gate.
    for(let offset=1;offset<=5;offset++){
      const x=east.x-offset,y=east.y;if(map.walkable[y]?.[x]!=='.')continue;
      box(c,t(x)+2,t(y)+6,8,3,'#d6d0a6');
      box(c,t(x)+8,t(y)+4,3,7,'#d6d0a6');box(c,t(x)+11,t(y)+6,2,3,'#d6d0a6');
    }
  }

  // Read actual interior warps: raised doorsteps must lead to real doors, never painted gates.
  if(map)for(const door of map.warps){
    if(!/^tour_icirrus_(center|mart|hall|home[12])$/.test(door.to))continue;
    for(let step=1;step<=2;step++)for(let side=-1;side<=1;side++){
      const x=door.x+side,y=door.y+step;
      if(map.walkable[y]?.[x]!=='.'||map.props.some(p=>p.x===x&&p.y===y))continue;
      if(map.terrain?.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h))continue;
      const px=t(x),py=t(y);
      box(c,px,py,16,16,'#b7bba2');
      if(step===1){box(c,px,py+14,16,1,'#899780');box(c,px+15,py,1,14,'#99a28b');}
      else for(const offset of [3,8,13]){
        box(c,px,py+offset,16,2,'#d9d3b4');box(c,px,py+offset+2,16,1,'#7c8b78');
      }
    }
  }

}

/** Cool wall bands and wetland records for Icirrus indoor maps. */
export function paintIcirrusInteriorDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(!map.id.startsWith('tour_icirrus_'))return;
  const width=map.width*16,hall=map.id.startsWith('tour_icirrus_hall');
  if(hall){
    box(c,32,18,width-64,26,'#435f62');
    if(map.id.endsWith('_3f')){
      // Panorama stays on the north wall, above every walkable tile and staircase.
      box(c,40,20,width-80,21,'#a6bfb3');
      for(let x=43;x<width-43;x+=37){box(c,x,34,30,7,'#78958c');box(c,x+9,29,14,8,'#89a699');}
      box(c,width/2-7,21,14,19,'#536e6b');
      for(let y=23;y<40;y+=5)box(c,width/2-10,y,20,2,'#c4cbb3');
      for(let x=40;x<width-40;x+=80)box(c,x,20,3,22,'#d2d4b9');
    }else if(map.id.endsWith('_2f')){
      for(let x=48;x<width-62;x+=55){box(c,x,21,35,18,'#8fae9f');box(c,x+3,29,29,8,'#537e81');box(c,x+6,23,2,13,'#d0d4b0');}
    }else{
      box(c,48,27,width-96,3,'#b7ad83');
      for(let x=52;x<width-60;x+=65){box(c,x,21,11,17,'#a9bfac');box(c,x+2,24,7,7,'#527c78');}
    }
    return;
  }
  box(c,32,20,width-64,6,hall?'#48666b':'#56716e');box(c,38,26,width-76,3,hall?'#aac5bd':'#d5dcc9');
  for(let x=54;x<width-66;x+=68){
    box(c,x,43,42,16,hall?'#526f70':'#657c74');box(c,x+4,47,34,9,hall?'#87aaa6':'#a9bd9f');
    box(c,x+9,50,24,2,'#e0ddba');
  }
  if(hall){box(c,width/2-35,65,70,5,'#3f5c62');box(c,width/2-27,60,54,6,'#a5b99f');}
}

