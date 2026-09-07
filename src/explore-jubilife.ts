import type { TourBuilding } from './explore-world';
import type { Direction,Point } from './types';
import { cityRoadTiles,paintCityStreets } from './city-street-art';

export const JUBILIFE_SIZE={width:40,height:36};
export const JUBILIFE_BUILDINGS:TourBuilding[]=[
  {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_jubilife_center'},
  {kind:'landmark',x:26,y:17,w:10,h:4,door:{x:31,y:20},room:'tour_jubilife_hall'},
  {kind:'house',x:5,y:23,w:5,h:2,door:{x:7,y:24}},
  {kind:'house',x:24,y:27,w:5,h:2,door:{x:26,y:28}},
  {kind:'house',x:5,y:16,w:5,h:2,door:{x:7,y:17}},
  {kind:'house',x:18,y:7,w:5,h:2,door:{x:20,y:8}},
];
export const JUBILIFE_EXITS:Record<Direction,{point:Point;spawn:Point;facing:Direction}>={
  up:{point:{x:14,y:2},spawn:{x:14,y:3},facing:'down'},
  down:{point:{x:14,y:34},spawn:{x:14,y:33},facing:'up'},
  left:{point:{x:1,y:14},spawn:{x:2,y:14},facing:'right'},
  right:{point:{x:38,y:24},spawn:{x:37,y:24},facing:'left'},
};
export const JUBILIFE_SIGNS:Record<Direction,Point>={up:{x:16,y:4},down:{x:16,y:32},left:{x:3,y:12},right:{x:36,y:23}};
export const JUBILIFE_ROADS:[number,number,number,number][]=[[12,3,4,31],[2,12,24,3],[12,23,27,3]];

type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
export function paintJubilifeBuilding(c:CanvasRenderingContext2D,images:Images,b:TourBuilding){
  const tower=b.kind==='landmark',source=tower?[266,232,175,296]:b.x<15?[166,546,81,108]:[601,546,83,111];
  const [sx,sy,w,h]=source,x=b.door.x*16+8-(tower?86:40),y=(b.door.y+1)*16-h;
  c.save();c.beginPath();
  const outline=tower?[[84,0],[89,0],[91,59],[106,71],[106,100],[132,101],[141,114],[155,114],[155,247],[147,281],[105,290],[105,296],[64,296],[64,290],[31,283],[19,261],[19,220],[1,219],[1,173],[21,173],[21,139],[40,139],[40,105],[65,105],[65,72],[81,59]]:[[3,3],[w-4,3],[w-4,h-4],[3,h-4]];
  outline.forEach(([a,d],i)=>i?c.lineTo(x+a,y+d):c.moveTo(x+a,y+d));c.closePath();c.clip();
  c.drawImage(images['jubilife-reference'],sx,sy,w,h,x,y,w,h);c.restore();
}

export function paintCityHall(c:CanvasRenderingContext2D,images:Images,b:TourBuilding){
  const x=b.door.x*16+8-74,y=(b.door.y+1)*16-188;
  c.save();c.beginPath();[[2,3],[142,3],[142,167],[127,185],[20,185],[2,167]].forEach(([a,d],i)=>i?c.lineTo(x+a,y+d):c.moveTo(x+a,y+d));c.closePath();c.clip();
  c.drawImage(images['jubilife-reference'],518,14,148,188,x,y,148,188);c.restore();
}

export function paintJubilifeStreets(c:CanvasRenderingContext2D,images:Images,walkable:string[],paths:Set<string>,jubilife=true){
  const width=walkable[0].length,height=walkable.length;
  const streets=jubilife?JUBILIFE_ROADS:[[12,3,4,height-5],[2,11,width-4,3],[2,height-9,width-4,3]];
  paintCityStreets(c,images['jubilife-reference'],cityRoadTiles(walkable,streets),paths,jubilife?[10,18,28]:[9,16,height-7]);
}
