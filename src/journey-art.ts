import type { GameMap,SaveData } from './types';
import { PASSAGES,FLOOR_INFO,MART_ROOMS,MART_DOORS,HOME_ROOMS,journeyItemFlag } from './journey-world';
import { paintTourGround,paintTourPaths } from './explore-materials';
import { paintGroveTree } from './explore-tree-art';
import { paintTallGrass } from './town';
import { isOreburghCave,paintCaveEncounter } from './oreburgh-cave-art';
import type { TourInterior } from './explore-interiors';
import type { TourBuilding } from './explore-world';

type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
const OREBURGH_CAVE='tour_pass_jubilife_oreburgh';
const OREBURGH_CAVE_PATH='#bca77f80';
const OREBURGH_CAVE_HINT='#c7aa78';

const caveHintGround=(map:GameMap,x:number,y:number)=>map.walkable[y]?.[x]==='.'
  &&!map.props.some(p=>p.x===x&&p.y===y)
  &&!map.npcs.some(n=>n.x===x&&n.y===y);

function paintOreburghCavePathHints(c:CanvasRenderingContext2D,map:GameMap){
  const safePath=(x:number,y:number)=>(y>=9&&y<=11&&x>=1&&x<=30)
    ||(x>=9&&x<=12&&y>=7&&y<=11)
    ||(x>=21&&x<=24&&y>=7&&y<=11);
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(!safePath(x,y)||!caveHintGround(map,x,y))continue;
    const px=x*16,py=y*16;
    const seed=(x*3+y*5)%3-1;
    rect(c,px+1+(x+y)%2,py+4+seed,12+(x*5+y)%3,7,OREBURGH_CAVE_PATH);
    rect(c,px+2+(x*3+y)%2,py+3+seed,8+(x+y)%4,1,'#d7c28f80');
  }
  // A quiet trail from the central clearing to the existing encounter patch.
  for(const [x,y] of [[16,10],[16,11],[16,12]] as const){
    if(!caveHintGround(map,x,y))continue;
    const px=x*16,py=y*16;
    rect(c,px+5,py+6,3,2,OREBURGH_CAVE_HINT);
    rect(c,px+9,py+9,2,2,OREBURGH_CAVE_HINT);
  }
  for(const [x,y,dx,dy] of [[14,10,3,11],[18,10,10,5],[15,12,2,10],[18,12,9,10]] as const){
    if(!caveHintGround(map,x,y))continue;
    rect(c,x*16+dx,y*16+dy,2,2,OREBURGH_CAVE_HINT);
  }
}

/** A blue single-storey mart: sampled DS roof texture, exact authored door tile. */
export function paintJourneyMart(c:CanvasRenderingContext2D,images:Images,b:TourBuilding){
  const x=b.x*16,y=(b.door.y+1)*16-68,w=b.w*16,door=b.door.x*16;
  rect(c,x+2,y+64,w-2,5,'#45595b66');
  c.save();c.beginPath();[[0,26],[3,12],[w/2,0],[w-3,12],[w,26],[w-2,37],[2,37]].forEach(([a,d],i)=>i?c.lineTo(x+a,y+d):c.moveTo(x+a,y+d));c.closePath();c.clip();
  c.drawImage(images['sandgem-reference'],232,70,82,38,x,y,w,38);
  c.fillStyle='#5289b7';c.globalAlpha=.7;c.fillRect(x,y,w,38);c.restore();
  rect(c,x+2,y+34,w-4,30,'#768b8c');rect(c,x+4,y+35,w-8,28,'#e2dfc6');rect(c,x+4,y+36,w-8,3,'#faf0d0');
  rect(c,x+2,y+32,w-4,6,'#3e799a');rect(c,x+3,y+33,w-6,2,'#8bbbc5');
  for(const wx of [x+6,x+w-20])if(wx+14<=door||wx>=door+16){rect(c,wx,y+44,14,15,'#5a767d');rect(c,wx+2,y+45,10,11,'#9bc7c7');rect(c,wx+3,y+46,6,2,'#e0eee0');}
  rect(c,door,y+45,16,23,'#506a74');rect(c,door+2,y+46,12,19,'#9dc4c6');rect(c,door+7,y+46,2,19,'#d3ded0');rect(c,door+3,y+49,3,6,'#d9e9d8');rect(c,door,y+66,16,2,'#e6d6ad');
}

/** All route pixels are derived from the same walkable grid as movement. */
export function paintJourneyPassage(c:CanvasRenderingContext2D,images:Images,map:GameMap){
  const passage=PASSAGES[map.id];if(!passage)return;
  const {kind}=passage,tiles=images['town-reference'];
  const paths=new Set<string>();
  const isGround=(x:number,y:number)=>map.walkable[y]?.[x]==='.'||map.props.some(p=>p.x===x&&p.y===y&&p.dialogue==='journeyItem');
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,ground=isGround(x,y);
    paintTourGround(c,tiles,px,py,kind==='coast'?'coast':kind==='cave'?'cave':'forest');
    if(ground){paths.add(x+','+y);continue;}
    if(kind==='cave'){
      rect(c,px,py,16,16,'#4b5a60');rect(c,px+1,py+1,15,5,'#7c8983');
      rect(c,px+3,py+2,8,2,'#a1a995');rect(c,px+(y%2?3:11),py+7,2,7,'#35464f');
      if(isGround(x,y+1)){rect(c,px,py+6,16,9,'#66766e');rect(c,px+1,py+7,14,2,'#96a18b');rect(c,px,py+15,16,1,'#374950');}
    }else if(kind==='coast'){
      rect(c,px,py,16,16,'#579cae');rect(c,px+2+(y%2)*3,py+6,8,1,'#a0d0cf');rect(c,px+8,py+12,5,1,'#71b6be');
      if(isGround(x,y-1)||isGround(x,y+1)||isGround(x-1,y)||isGround(x+1,y)){
        rect(c,px,py,16,16,'#967e58');rect(c,px+1,py+1,14,8,'#d6bc80');rect(c,px+2,py+1,12,2,'#eee0a2');rect(c,px+3,py+11,11,1,'#6c7059');
      }
    }else{
      rect(c,px,py,16,16,'#527b4d');rect(c,px+1,py+1,14,10,'#6f9a5b');
      rect(c,px+2,py+2,7,2,'#96b777');rect(c,px+8,py+9,6,3,'#416b49');
    }
  }
  paintTourPaths(c,tiles,paths,kind==='coast'?'desert':kind==='cave'?'cave':'forest');
  if(kind==='cave')for(const key of paths){const[x,y]=key.split(',').map(Number);rect(c,x*16,y*16,16,16,'#839082b8');rect(c,x*16+2,y*16+5,4,1,'#b4b7a0');if((x+y)%3===0)rect(c,x*16+10,y*16+12,3,2,'#5c726a');}
  if(map.id===OREBURGH_CAVE)paintOreburghCavePathHints(c,map);
  // Complete existing DS trees fit only within the blocked canopy rectangle.
  if(kind==='road')for(let y=1;y<map.height-2;y+=2)for(let x=0;x<map.width-1;x+=2){
    let clear=true;for(let dy=-1;dy<2;dy++)for(let dx=0;dx<2;dx++)if(isGround(x+dx,y+dy))clear=false;
    if(clear)paintGroveTree(c,images['sandgem-reference'],{x:x*16,y:y*16-16,depth:y+1.5});
  }
  for(const patch of map.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++){
    if(isGround(x,y)){
      if(isOreburghCave(map.id))paintCaveEncounter(c,x*16,y*16,false);
      else paintTallGrass(c,x*16,y*16,false,0,images['grass-reference']);
    }
  }
  // Direction arrows at the walkable mouths make both exits unambiguous.
  for(const exit of map.warps){
    const x=exit.x*16,y=exit.y*16,dir=exit.entry==='left'?-1:1;
    rect(c,x+2,y+4,12,8,kind==='cave'?'#4a615d':'#a9996f');
    for(let i=0;i<4;i++)rect(c,x+7+dir*(3-i),y+4+i,2,8-i*2,'#f6e9bb');
  }
}

/** Stairs are painted into the background, underneath actors and furniture. */
export function paintJourneyInterior(c:CanvasRenderingContext2D,images:Images,map:GameMap,room:TourInterior){
  const info=FLOOR_INFO[map.id];
  if(HOME_ROOMS.has(map.id)){
    // Replace the dojo wall treatment with household windows and warm wallpaper.
    rect(c,32,12,192,30,'#d2c3a0');rect(c,32,40,192,8,'#977b59');
    for(const x of [48,112,176]){rect(c,x-2,16,30,23,'#735e4b');c.drawImage(images['lab-reference'],105,13,26,17,x,18,26,17);rect(c,x-3,16,5,22,'#c58d7d');rect(c,x+24,16,5,22,'#c58d7d');}
    rect(c,112,138,35,27,'#a97868');rect(c,115,141,29,21,'#dec092');rect(c,118,144,23,15,'#c79975');
  }
  if(MART_ROOMS.has(map.id)&&room.reception){
    const {x,y,w}=room.reception,px=x*16,py=y*16;
    rect(c,px,py-6,w*16,22,'#537f87');rect(c,px+2,py-5,w*16-4,10,'#dce5d0');rect(c,px+2,py+6,w*16-4,8,'#82afa9');
    rect(c,px+w*16-18,py-13,14,11,'#5f727b');rect(c,px+w*16-16,py-11,10,5,'#a5d2bf');
    rect(c,104,19,49,15,'#436b80');c.save();c.font='8px Galmuri11, monospace';c.fillStyle='#fff0c9';c.textAlign='center';c.fillText('SHOP',128,30);c.restore();
  }
  if(!info)return;
  if(info.floor>1){
    // paintTourInterior contains an exterior mat. Upper floors have a solid wall.
    rect(c,128,176,16,16,'#b9b5a0');rect(c,32,189,192,4,'#6b786b');rect(c,128,193,16,31,'#172b34');
  }
  for(const exit of map.warps){
    if(!FLOOR_INFO[exit.to])continue;
    const up=FLOOR_INFO[exit.to].floor>info.floor,px=exit.x*16,py=exit.y*16;
    rect(c,px,py,16,16,'#43565b');
    for(let i=0;i<5;i++){const yy=py+1+i*3;rect(c,px+2,yy,12,2,up?'#d1d3b8':'#89998d');rect(c,px+2,yy+2,12,1,'#536b66');}
    rect(c,px,py,2,16,'#9ba99a');rect(c,px+14,py,2,16,'#d6d7bd');
    // Wall placards are outside the stair approach tile.
    const signY=up?py-10:py+17;
    rect(c,px-2,signY,20,8,'#466674');c.save();c.font='7px Galmuri11, monospace';c.fillStyle='#f7e6b3';c.textAlign='center';c.fillText((up?'↑':'↓')+FLOOR_INFO[exit.to].floor+'F',px+8,signY+7);c.restore();
  }
  c.save();c.font='8px Galmuri11, monospace';c.fillStyle='#fff0c9';c.textAlign='center';rect(c,193,20,23,13,'#526c77');c.fillText(info.floor+'F',204,30);c.restore();
}

/** Renderer integration: call in world coordinates after depth layers, before UI.
 * Static stair/floor graphics are already part of buildExploreArt backgrounds.
 * The pickup flag is shared through journeyItemFlag; drawing never mutates saves.
 */
export function paintJourneyOverlay(c:CanvasRenderingContext2D,_images:Images,map:GameMap,flags:SaveData['flags']={},clock=0){
  if(map.id==='tour_jubilife'){
    const sign=map.props.find(p=>p.dialogue==='jubilifeGrassSign');
    if(sign){const x=sign.x*16,y=sign.y*16;rect(c,x+7,y+8,3,9,'#776246');rect(c,x,y,17,11,'#566b55');rect(c,x+1,y+1,15,8,'#e4d4a0');rect(c,x+3,y+3,10,1,'#8b8866');rect(c,x+3,y+5,8,1,'#8b8866');}
  }
  const door=MART_DOORS[map.id];
  if(door){
    const x=door.x*16,y=door.y*16;rect(c,x-7,y-17,30,11,'#35677e');rect(c,x-6,y-16,28,2,'#8db9bd');
    c.save();c.font='7px Galmuri11, monospace';c.textAlign='center';c.fillStyle='#fff2cc';c.fillText('SHOP',x+8,y-8);c.restore();
  }
  if(PASSAGES[map.id]&&!flags[journeyItemFlag(map.id)]){
    const item=map.props.find(p=>p.dialogue==='journeyItem');if(!item)return;
    const x=item.x*16+8,y=item.y*16+7;
    rect(c,x-5,y+5,11,3,'#354a4866');rect(c,x-5,y-4,10,9,'#3c525c');rect(c,x-4,y-5,8,4,'#d36e64');rect(c,x-4,y,8,4,'#efe8c9');rect(c,x-5,y-1,10,2,'#3c525c');rect(c,x-1,y-1,3,3,'#f8f0cc');
    if(Math.floor(clock*2)%3===0){rect(c,x+7,y-7,1,5,'#fff0b9');rect(c,x+5,y-5,5,1,'#fff0b9');}
  }
}
