import type { GameMap } from './types';
import { paintRoute210Gorge } from './sinnoh-route210-gorge-art';
import { paintCoronet211Entrances } from './sinnoh-coronet-entrance-art';
import { paintSinnohStratum } from './sinnoh-strata-art';
import type { TourBuilding } from './explore-world';
import { isRoute211SideTrail,isCoronet211SurveyTrail } from './sinnoh-route211-trails';
import { celesticTravelMarkers } from './sinnoh-celestic-markers';
import { C211,CELESTIC,R210N,R211E,R211W } from './sinnoh-celestic-route';

const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const open=(map:GameMap,x:number,y:number)=>map.walkable[y]?.[x]==='.';
type Area=readonly [number,number,number,number];
const inside=(x:number,y:number,[ax,ay,w,h]:Area)=>x>=ax&&x<ax+w&&y>=ay&&y<ay+h;

function paintTravelMarkers(c:CanvasRenderingContext2D,map:GameMap){
  for(const p of celesticTravelMarkers(map)){
    const x=p.x*16,y=p.y*16,flat=open(map,p.x,p.y);
    // The existing prop remains the interaction source. Never add a solid-looking
    // post on a valid save/walking tile; plaza signs are engraved ground plaques.
    rect(c,x+1,y+(flat?4:1),14,flat?10:11,'#6b7463');
    rect(c,x+2,y+(flat?5:2),12,flat?8:8,'#e0d3aa');
    if(!flat){rect(c,x+6,y+12,4,4,'#77644d');}
    const cy=y+(flat?9:6),vertical=p.dialogue==='route210NorthFogSign';
    if(vertical){
      rect(c,x+7,cy-3,2,6,'#647865');rect(c,x+5,cy,6,1,'#647865');rect(c,x+6,cy+1,4,1,'#647865');
    }else{
      rect(c,x+4,cy,8,1,'#647865');rect(c,x+3,cy-1,2,3,'#647865');rect(c,x+11,cy-1,2,3,'#647865');
    }
  }
}
const townPaths:readonly Area[]=[
  [1,19,38,3], // 211 west gate -> 210 north gate
  [19,14,3,19], // public ruins -> residential street
  [8,31,14,2], // both inhabited houses
  [30,9,3,12], // center -> eastern road
  [16,15,10,4], // elder and ruins forecourt
  [8,21,3,12], // west arrival -> inhabited shop, without crossing its facade
  [8,24,12,2], // residential approach before the two door courts
  [24,16,8,2], // ruins forecourt -> center approach
  [24,17,2,8], // east forecourt -> resident and grove edge
];
const buildings:readonly Area[]=[[28,6,7,4],[5,27,7,4],[15,27,7,4],[17,8,7,7]];

/** Walkable courts express facility roles without inventing collision objects. */
function paintCelesticCourts(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!==CELESTIC)return;
  const courts:readonly {area:Area;kind:'ruins'|'center'|'shop'|'home'}[]=[
    {area:[16,15,10,4],kind:'ruins'},
    {area:[28,10,7,4],kind:'center'},
    {area:[5,31,7,3],kind:'shop'},
    {area:[15,31,7,3],kind:'home'},
  ];
  for(const {area,kind} of courts){
    const [ax,ay,w,h]=area;
    for(let y=ay;y<ay+h;y++)for(let x=ax;x<ax+w;x++){
      if(!open(map,x,y))continue;
      const px=x*16,py=y*16;
      rect(c,px,py,16,16,kind==='ruins'?'#b4b4a0':kind==='center'?'#d0cbb4':kind==='shop'?'#b8a582':'#aeb393');
      if(kind==='ruins'){
        // Irregular old paving: flush joints, not steps requiring a jump.
        rect(c,px,py+14,16,2,'#929a89');
        rect(c,px+(y%2?5:11),py,1,14,'#8f9888');
        if((x+y)%4===0)rect(c,px+2,py+3,3,2,'#829273');
      }else if(kind==='center'){
        rect(c,px,py+15,16,1,'#b3b39e');
        rect(c,px+15,py,1,16,'#b3b39e');
      }else{
        // Swept earth and small inset stones remain fully traversable.
        if((x+y)%2===0)rect(c,px+3,py+7,9,2,kind==='shop'?'#d4c19b':'#c9cbb1');
      }
    }
  }
  // Worn doorstep paths reach the actual preserved shop/home door columns.
  for(const x of [8,18])for(let y=31;y<=33;y++){
    if(open(map,x,y))rect(c,x*16+2,y*16+3,12,10,'#d0c4a4');
  }
}

function stone(c:CanvasRenderingContext2D,x:number,y:number){
  rect(c,x,y,16,16,'#717d72');rect(c,x+1,y+1,14,5,'#abb09a');
  rect(c,x+1,y+7,14,8,'#84917f');rect(c,x+7,y+7,1,8,'#586960');
  rect(c,x,y+15,16,1,'#43564f');
}
function paintCelesticEscarpment(c:CanvasRenderingContext2D,map:GameMap,x:number,y:number){
  const px=x*16,py=y*16;
  // One continuous landform instead of a grid of isolated boulders.
  const edge=open(map,x,y+1),side=open(map,x-1,y)||open(map,x+1,y);
  rect(c,px,py,16,16,edge?'#6b7563':'#8c9679');
  if(edge){
    rect(c,px,py,16,3,'#b4b497');
    rect(c,px,py+6,16,2,'#91957b');
    rect(c,px,py+12,16,2,'#525f50');
    rect(c,px+(x%3)*4+2,py+3,1,9,'#465649');
  }else{
    if(y%3===0)rect(c,px,py+8,16,2,'#79866c');
    if((x+y)%4===0)rect(c,px+3,py+4,7,2,'#a8ad8a');
  }
  if(side)rect(c,px+(open(map,x-1,y)?0:13),py,3,16,'#65745d');
}
function tree(c:CanvasRenderingContext2D,x:number,y:number){
  rect(c,x,y,16,16,'#3f614e');rect(c,x+6,y+11,4,5,'#77664c');
  rect(c,x+2,y+4,12,9,'#355e49');rect(c,x+4,y+1,8,10,'#54805a');
  rect(c,x+5,y+2,5,3,'#83a36d');rect(c,x+2,y+11,12,2,'#2e4f40');
}

/** Ground layer only. Facades/NPCs remain in the existing foreground renderer.
 * Solid scenery is restricted to # cells; decorative ledges cannot cross a walkable route. */
export function paintSinnohCelesticDetails(c:CanvasRenderingContext2D,map:GameMap){
  if(![CELESTIC,R211W,R211E,C211,R210N].includes(map.id as typeof CELESTIC))return;
  const town=map.id===CELESTIC,cave=map.id===C211,north=map.id===R210N;
  c.save();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,passable=open(map,x,y);
    if(!passable){
      // Registered building footprints are owned by the foreground facade renderer.
      if(town&&buildings.some(b=>inside(x,y,b)))continue;
      if(town&&inside(x,y,[4,5,11,10])){paintCelesticEscarpment(c,map,x,y);continue;}
      const forest=town?inside(x,y,[27,23,8,10])||x<2||x>37||y<2||y>37:
        north?(x<24||y>33):map.id===R211E&&x>33;
      if(forest)tree(c,px,py);
      else{
        stone(c,px,py);
        if(cave)rect(c,px+1,py+1,14,5,x<28?'#a4a58b':'#829c9b');
        if(open(map,x,y+1)){
          rect(c,px,py+8,16,8,cave?'#3e5153':'#536459');
          rect(c,px,py+7,16,2,'#b4b69a');
        }
      }
      continue;
    }
    // Do not replace the encounter renderer's authored grass surface.
    if(map.terrain?.some(t=>t.kind==='tallGrass'&&inside(x,y,[t.x,t.y,t.w,t.h])))continue;
    const paved=town&&townPaths.some(a=>inside(x,y,a));
    const grass=town&&!paved;
    const surveyTrail=isCoronet211SurveyTrail(map,x,y);
    const sideTrail=isRoute211SideTrail(map,x,y);
    const color=grass?'#93ad79':paved?'#c3bea0':cave?(surveyTrail?(x<28?'#bdb694':'#aec0b7'):(x<28?'#aaa68c':'#94a4a0')):north?'#b5bba0':sideTrail?'#adb395':'#c6bd95';
    rect(c,px,py,16,16,color);
    if(paved){
      rect(c,px,py+15,16,1,'#a5a48d');
      rect(c,px+(y%2?7:0),py,1,15,'#aaa990');
    }else if(grass){
      if((x*3+y)%5===0){rect(c,px+3,py+6,2,3,'#688d61');rect(c,px+6,py+5,2,4,'#b8c990');}
      // Low flowers remain walkable; never imply a solid hedge on an open tile.
      if(y>23&&y<36&&(x<8||x>24)&&(x+y)%7===0){rect(c,px+7,py+8,2,4,'#567959');rect(c,px+5,py+6,5,3,'#e1d29b');}
    }else{
      if(surveyTrail){
        rect(c,px+3,py+4,7,2,x<28?'#ddd1aa':'#d0ded0');
        rect(c,px+10,py+11,3,2,'#7c8e83');
      }
      if(sideTrail&&(x+y)%3===0)rect(c,px+2,py+3,9,3,'#cbd0b0');
      if((x+y)%4===0)rect(c,px+4,py+7,5,2,cave?'#ccd0b6':'#ddd3b0');
      if(!open(map,x,y-1))rect(c,px,py,16,2,cave?'#637675':'#879577');
      if(!open(map,x,y+1))rect(c,px,py+14,16,2,'#8d967b');
    }
  }
  paintCelesticCourts(c,map);
  if(town)for(const [ax,ay,w,h] of [[1,18,5,5],[34,18,5,5]] as const){
    for(let y=ay;y<ay+h;y++)for(let x=ax;x<ax+w;x++){
      if(!open(map,x,y))continue;
      // Flush road shoulders mark the complete five-cell gate, not a false wall.
      if(y===ay||y===ay+h-1){
        rect(c,x*16,y*16,16,16,'#a5aa87');
        rect(c,x*16+3,y*16+7,9,2,x<20?'#c1bba0':'#b8c4a2');
      }
    }
  }
  paintRoute210Gorge(c,map);
  // Thresholds use the actual warp cells, rather than a second painted entrance.
  for(const w of map.warps){
    if(!open(map,w.x,w.y))continue;
    rect(c,w.x*16,w.y*16,16,16,town?'#d7ccb0':'#c6c3a6');
    rect(c,w.x*16+2,w.y*16+12,12,2,'#909a85');
  }
  if(cave)for(const p of map.props){
    if(p.dialogue!=='coronet211WestLayer'&&p.dialogue!=='coronet211EastLayer')continue;
    // Read the actual investigation cell; exposed strata remain flush with the path.
    rect(c,p.x*16,p.y*16,16,16,'#596d61');
    paintSinnohStratum(c,p.x*16+1,p.y*16+1,14,14,p.dialogue==='coronet211WestLayer');
  }
  paintCoronet211Entrances(c,map);
  paintTravelMarkers(c,map);
  c.restore();
}

function paintCelesticHouse(c:CanvasRenderingContext2D,b:TourBuilding,shop:boolean){
  const x=b.x*16,y=b.y*16,w=b.w*16,h=b.h*16,door=b.door.x*16;
  c.save();
  // All raised details stay within the existing collision footprint.
  rect(c,x,y,w,h,'#697060');
  rect(c,x+3,y+24,w-6,h-24,'#c5ba94');
  rect(c,x+4,y+h-5,w-8,5,'#747e6b');
  if(shop){
    rect(c,x+2,y+2,w-4,23,'#807563');
    for(let j=5;j<24;j+=6)rect(c,x+3,y+j,w-6,2,'#aaa08a');
    // Low shop roof, striped awning and a broad goods window.
    rect(c,x+5,y+28,35,22,'#516966');
    for(let i=0;i<4;i++){rect(c,x+8+i*8,y+37,5,9,['#a8bd8c','#d5bd7b','#c5c9aa','#ab9876'][i]);}
    rect(c,x+4,y+25,39,6,'#e0d4ad');
    for(let i=4;i<43;i+=10)rect(c,x+i,y+25,5,8,'#75928a');
    rect(c,x+w-30,y+h-22,23,16,'#998260');
    rect(c,x+w-28,y+h-20,19,2,'#d0b58a');
    rect(c,x+w-28,y+h-10,19,2,'#695e4d');
  }else{
    // Stepped gable and a sheltered book window distinguish the family home.
    for(let j=0;j<7;j++)rect(c,x+Math.max(2,14-j*2),y+j*4,w-Math.max(4,28-j*4),4,j%2?'#677d75':'#819087');
    rect(c,x+8,y+31,29,20,'#485f59');
    for(let i=0;i<5;i++)rect(c,x+11+i*4,y+37,3,11,i%2?'#bda983':'#a0afa0');
    rect(c,x+8,y+41,29,2,'#9b9274');
    rect(c,x+w-26,y+30,17,20,'#647f79');
    rect(c,x+w-18,y+30,2,20,'#c8bb95');
    rect(c,x+w-26,y+39,17,2,'#c8bb95');
  }
  // The visible opening and threshold share the existing warp's exact x/y.
  rect(c,door-2,y+h-25,20,25,'#7b7b65');
  rect(c,door,y+h-23,16,23,'#344e48');
  rect(c,door,b.door.y*16+12,16,4,'#d9ccaa');
  c.restore();
}

/** Existing Celestic foreground dispatch, including its two inhabited houses. */
export function paintCelesticRuinsFacade(c:CanvasRenderingContext2D,b:TourBuilding):boolean{
  if(b.room==='tour_celestic_shop'||b.room==='tour_celestic_home'){
    paintCelesticHouse(c,b,b.room==='tour_celestic_shop');return true;
  }
  if(b.room!=='tour_celestic_ruins')return false;
  const x=b.x*16,y=b.y*16,w=b.w*16,h=b.h*16,door=b.door.x*16;
  c.save();
  // Weathered mound and stone lintel, confined to the registered solid footprint.
  rect(c,x,y,w,h,'#697868');
  // Broad courses keep the cave mound distinct from houses and isolated rocks.
  for(let j=0;j<h;j+=12){
    rect(c,x+2,y+j,w-4,10,j<h/2?'#929b81':'#7c8b75');
    rect(c,x+2,y+j+10,w-4,2,'#566a59');
    for(let i=(j%24?14:3);i<w-4;i+=29)rect(c,x+i,y+j,2,10,'#697d67');
  }
  rect(c,x+4,y+3,w-8,12,'#98a081');
  rect(c,x+8,y+6,w-16,3,'#b8b897');
  for(let i=8;i<w-8;i+=18){rect(c,x+i,y+20,8,3,'#a6ab8b');rect(c,x+i+3,y+23,2,9,'#506653');}
  const top=y+h-43;
  rect(c,door-8,top,32,43,'#536154');
  rect(c,door-5,top+3,26,8,'#b6b99a');
  rect(c,door-4,top+11,24,32,'#273e3b');
  rect(c,door-7,top+11,4,32,'#a4aa8e');rect(c,door+19,top+11,4,32,'#84937b');
  rect(c,door,b.door.y*16+12,16,4,'#c7c0a0');
  c.restore();
  return true;
}
