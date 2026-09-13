import type { GameMap } from './types';
import { SEAFOAM_BOULDER_EVENT } from './seafoam-boulder';
import { paintSeafoamChamberRelief } from './seafoam-chamber-art';
import { paintCinnabarTownApproaches } from './cinnabar-town-art';
import { paintCinnabarSiteEntrance } from './cinnabar-control-site';
import { CINNABAR_RESEARCH_ROCKS,CINNABAR_HABITAT_PATHS } from './cinnabar-layout';

const routes=new Set(['tour_kanto_route_19','tour_kanto_route_20']);
const caves=new Set(['tour_kanto_seafoam_1f','tour_kanto_seafoam_b1f','tour_kanto_seafoam_b2f','tour_kanto_seafoam_b3f','tour_kanto_seafoam_b4f']);
const fill=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
const walk=(map:GameMap,x:number,y:number)=>map.walkable[y]?.[x]==='.';

function deck(c:CanvasRenderingContext2D,x:number,y:number){
  fill(c,x,y,16,16,'#aa8962');
  for(let j=0;j<16;j+=4){fill(c,x,y+j,16,1,'#705744');fill(c,x+1,y+j+1,14,1,'#ceb48a');}
  fill(c,x+2,y+2,1,1,'#514c48');fill(c,x+13,y+14,1,1,'#514c48');
}

/** Existing blocked investigation cells get distinct silhouettes, within their tile. */
function seafoamLandmark(c:CanvasRenderingContext2D,event:string,x:number,y:number):boolean{
  const crystal=(left:number,top:number,width:number,height:number)=>{
    c.fillStyle='#c6e6e9';c.beginPath();c.moveTo(left,top+height);
    c.lineTo(left,top+4);c.lineTo(left+width/2,top);c.lineTo(left+width,top+4);
    c.lineTo(left+width,top+height);c.closePath();c.fill();
    fill(c,left+width/2,top+4,width/2,height-4,'#729caf');
    fill(c,left+1,top+4,1,height-5,'#eff9e8');
  };
  switch(event){
    case 'tourSeafoam1FWater':
      fill(c,x+1,y+12,14,3,'#465f75');
      crystal(x+2,y+2,7,12);crystal(x+10,y+6,4,8);return true;
    case 'tourSeafoamB1Water':
    case 'tourSeafoamB4Water':
      fill(c,x+1,y+4,14,11,'#496c82');fill(c,x+3,y+6,10,7,'#286485');
      fill(c,x+4,y+7,7,1,'#a5d8dd');fill(c,x+7,y+10,5,1,'#6cb8ce');
      fill(c,x+1,y+2,2,11,'#c5d5cd');
      for(let j=3;j<12;j+=3)fill(c,x+2,y+j,3,1,'#576a73');return true;
    case 'tourSeafoamB2Water':
      fill(c,x+1,y+12,14,3,'#344c62');
      fill(c,x+2,y+4,5,10,'#8ca6b4');fill(c,x+9,y+2,5,12,'#66859b');
      fill(c,x+3,y+3,4,2,'#dae7de');fill(c,x+9,y+1,4,2,'#c0d6d7');
      fill(c,x+3,y+8,3,1,'#4e6d83');fill(c,x+10,y+7,3,1,'#a6c5cb');return true;
    case 'tourSeafoamB3Water':
      fill(c,x+1,y+12,14,3,'#334b62');
      crystal(x+1,y+7,4,7);crystal(x+6,y+1,5,13);crystal(x+12,y+6,3,8);return true;
    case 'tourSeafoamB4Cold':
      fill(c,x+1,y+10,14,5,'#526e80');fill(c,x+3,y+11,10,2,'#263e55');
      fill(c,x+2,y+8,12,2,'#c5d9d5');fill(c,x+7,y+3,2,7,'#acbaa9');
      fill(c,x+5,y+1,6,5,'#d4c697');fill(c,x+6,y+2,4,3,'#4b8396');
      fill(c,x+2,y+3,2,3,'#a3d3dc');fill(c,x+12,y+5,2,2,'#c5e6e8');return true;
    default:return false;
  }
}

/** Full background painter; call before the generic PASSAGES branch and return on true. */
export function paintKantoSouthPassage(c:CanvasRenderingContext2D,map:GameMap):boolean{
  const sea=routes.has(map.id),cave=caves.has(map.id),island=map.id==='tour_kanto_seafoam_exterior';
  if(!sea&&!cave&&!island)return false;
  const props=new Set(map.props.map(p=>`${p.x},${p.y}`));
  const floor=(x:number,y:number)=>walk(map,x,y)||props.has(`${x},${y}`);
  c.save();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,ground=floor(x,y);
    if(ground){
      const beach=map.id==='tour_kanto_route_19'&&y<28;
      if(sea&&!beach)deck(c,px,py);
      else{
        fill(c,px,py,16,16,beach?'#d5c699':island?'#abb8b6':'#a0b6bc');
        if((x*7+y*3)%5===0){fill(c,px+3,py+8,7,1,beach?'#b5a779':'#728d9a');fill(c,px+9,py+9,3,1,'#cbd9cf');}
      }
      if(cave&&walk(map,x,y)&&map.terrain?.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h)){
        fill(c,px,py,16,16,'#657f90');fill(c,px+2,py+3,5,2,'#a8bbc1');
        fill(c,px+9,py+9,4,2,'#354d63');fill(c,px+3,py+12,3,1,'#c4d1d0');
      }
      // Rails occupy only the rim; no decorative barrier crosses a walkable neighbour.
      for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){
        if(floor(x+dx,y+dy)||map.warps.some(w=>w.x===x&&w.y===y))continue;
        if(sea&&!beach){
          fill(c,px+(dx===1?14:0),py+(dy===1?14:0),dx?2:16,dy?2:16,'#584e45');
          fill(c,px+(dx===1?14:0),py+(dy===1?14:0),dx?1:16,dy?1:16,'#e0cba6');
        }
      }
    }else if(sea||island){
      fill(c,px,py,16,16,(x+y)%3?'#326e8b':'#397b94');
      if((x+y)%3===0)fill(c,px+2,py+7,10,1,'#70a7b8');
      if(floor(x,y-1)||floor(x-1,y)){fill(c,px,py,16,3,'#83b6ba');fill(c,px+2,py+3,11,1,'#d2ded0');}
      if(island&&y<30&&!floor(x,y+1)){
        fill(c,px,py,16,16,'#536b7c');fill(c,px+1,py+1,14,5,'#93aeb9');fill(c,px+3,py+8,10,2,'#354f67');
      }
    }else if(map.id==='tour_kanto_seafoam_b2f'&&x>=15&&x<=17&&y>=20&&y<=22){
      // Central stone rib enclosed by the new local loop, not a movable boulder.
      fill(c,px,py,16,16,'#3c526b');fill(c,px+1,py+1,14,4,'#c5dadd');
      fill(c,px+2,py+5,12,6,'#789bad');fill(c,px+5,py+6,2,9,'#a9c8d1');
      fill(c,px+11,py+8,2,7,'#273c56');fill(c,px+2,py+14,12,2,'#243c51');
    }else if(map.id==='tour_kanto_seafoam_b1f'&&x>=15&&x<=20&&y>=15&&y<=22){
      // Enclosed by the existing optional loop; water occupies blocked cells only.
      fill(c,px,py,16,16,'#235877');
      fill(c,px+2,py+7,10,1,'#5a9eb5');
      if(y===15)fill(c,px,py,16,3,'#b5d9df');
      if(y===22)fill(c,px,py+13,16,3,'#b5d9df');
      if(x===15)fill(c,px,py,3,16,'#b5d9df');
      if(x===20)fill(c,px+13,py,3,16,'#b5d9df');
      if((x+y)%4===0){fill(c,px+5,py+10,7,2,'#90c4d3');fill(c,px+7,py+9,3,1,'#d0e5e4');}
    }else{
      fill(c,px,py,16,16,'#273a4e');
      if(floor(x,y+1)||floor(x-1,y)||floor(x+1,y)){
        fill(c,px,py,16,16,'#58758b');fill(c,px+1,py+1,14,4,'#b2d0d4');
        fill(c,px+2,py+6,12,2,'#829eaf');fill(c,px+3,py+12,11,3,'#3b526c');
        if((x+y)%3===0)fill(c,px+10,py+3,2,8,'#c2dedb');
      }
    }
  }
  paintSeafoamChamberRelief(c,map);
  // Furnishings belong to dry surfaces, never holes in the surrounding water.
  for(const p of map.props){const x=p.x*16,y=p.y*16;
    if(p.dialogue===SEAFOAM_BOULDER_EVENT)continue;
    if(cave&&seafoamLandmark(c,p.dialogue,x,y))continue;
    fill(c,x+3,y+5,11,10,'#455362');fill(c,x+2,y+2,12,7,'#ccb58c');
    fill(c,x+4,y+3,8,2,'#e6d9b6');fill(c,x+6,y+11,3,5,'#745d48');
  }
  for(const w of map.warps){const x=w.x*16,y=w.y*16;
    if(cave&&caves.has(w.to)){
      fill(c,x,y,16,16,'#34465b');
      for(let j=2;j<16;j+=3){fill(c,x+2,y+j,12,2,'#bfd1d0');fill(c,x+2,y+j+2,12,1,'#648297');}
      if(map.id==='tour_kanto_seafoam_b1f'||map.id==='tour_kanto_seafoam_b2f'){
        const up=w.to===(map.id==='tour_kanto_seafoam_b1f'?'tour_kanto_seafoam_1f':'tour_kanto_seafoam_b1f');
        fill(c,x+6,y+(up?2:11),4,2,'#f2e7bb');
        fill(c,x+4,y+(up?4:9),8,2,'#f2e7bb');
        for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){
          if(!walk(map,w.x+dx,w.y+dy))continue;
          fill(c,x+dx*16+3,y+dy*16+7,10,2,up?'#d7c69c':'#92becb');
        }
      }
    }else if(w.to.startsWith('tour_kanto_seafoam_')&&(cave||island)){
      fill(c,x,y,16,16,'#2e4155');fill(c,x+3,y+3,10,13,'#192b3d');fill(c,x+2,y+14,12,2,'#c1d5d5');
    }else{
      if(sea)deck(c,x,y);
      fill(c,x+3,y+6,10,3,'#e3d6a7');fill(c,x+6,y+3,3,9,'#e3d6a7');
    }
  }
  c.restore();return true;
}

/** Overlay after town scenery: repair the authored landing and boundary exit tiles only. */
export function paintCinnabarLanding(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_cinnabar')return;
  paintCinnabarTownApproaches(c,map);
  paintCinnabarSiteEntrance(c,map);
  c.save();
  for(const path of CINNABAR_HABITAT_PATHS){
    for(let y=path.y;y<path.y+path.h;y++)for(let x=path.x;x<path.x+path.w;x++){
      if(!walk(map,x,y))continue;
      fill(c,x*16,y*16,16,16,'#c6b995');
      fill(c,x*16+1,y*16+1,14,1,'#ece0bb');
      fill(c,x*16+2,y*16+13,11,1,'#9e967e');
      fill(c,x*16+7,y*16+3,1,9,'#b3a889');
    }
  }
  for(let y=38;y<=41;y++)for(let x=1;x<=13;x++)if(walk(map,x,y))deck(c,x*16,y*16);
  for(const w of map.warps){
    if(w.to==='tour_pass_pallet_cinnabar'||w.to==='tour_pass_vermilion_cinnabar')deck(c,w.x*16,w.y*16);
  }
  // Share the authored investigation bounds; never paint stone over an open path.
  for(const [index,site] of CINNABAR_RESEARCH_ROCKS.entries()){
    for(let y=site.y;y<site.y+site.h;y++)for(let x=site.x;x<site.x+site.w;x++){
      if(map.walkable[y]?.[x]!=='#')continue;
      const px=x*16,py=y*16;
      if(index===0){
        fill(c,px,py,16,16,'#79504c');
        fill(c,px,py+1,16,3,'#bb8770');fill(c,px,py+6,16,2,'#9f6557');
        fill(c,px,py+12,16,3,'#513e42');
        fill(c,px+3+(y%2)*6,py+4,2,5,'#443941');
        fill(c,px+10,py+10,3,2,'#d09e7c');
      }else{
        fill(c,px,py,16,16,'#5c696c');
        fill(c,px+2,py+3,12,10,'#8f9995');
        fill(c,px+4,py+1,8,2,'#c7c9b5');fill(c,px+1,py+6,2,5,'#adb5a9');
        fill(c,px+4,py+12,10,3,'#40575f');
        fill(c,px+5,py+6,7,1,'#c0cdc0');
        if(y===site.y+site.h-1)fill(c,px+2,py+14,12,1,'#83acb3');
      }
    }
  }
  c.restore();
}
