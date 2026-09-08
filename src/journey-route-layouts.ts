import type { GameMap } from './types';

export interface RouteRect { x:number; y:number; w:number; h:number }
export interface JourneyRouteLayout {
  width:number; height:number;
  /** Additive ground only: existing paths, people and pickups are preserved. */
  openings:RouteRect[];
  safePath:RouteRect[];
  grass:RouteRect[];
  landmarks:(RouteRect & {kind:'water'|'cliff'|'grove'})[];
}
const r=(x:number,y:number,w:number,h:number):RouteRect=>({x,y,w,h});
const caveSafe=[r(29,9,7,3),r(33,9,3,12),r(34,18,15,3),r(47,9,3,12),r(48,9,3,3)];
const ridgeSafe=[r(29,9,8,3),r(34,5,3,7),r(35,5,11,3),r(43,5,3,7),r(44,9,9,3)];
const watersideSafe=[r(29,9,7,3),r(33,9,3,10),r(34,16,12,3),r(43,9,3,10),r(44,9,7,3)];

export const JOURNEY_ROUTE_LAYOUTS:Record<string,JourneyRouteLayout>={
  tour_pass_jubilife_oreburgh:{
    width:52,height:30,safePath:caveSafe,
    openings:[...caveSafe,r(33,5,3,5),r(34,4,12,4),r(43,6,3,8),r(43,12,6,3),r(33,19,3,8),r(34,23,12,5),r(43,19,3,8),r(25,16,10,3)],
    grass:[r(37,4,6,3),r(36,24,7,3)],
    landmarks:[{...r(37,10,5,6),kind:'cliff'},{...r(27,23,4,4),kind:'cliff'},{...r(47,24,3,3),kind:'cliff'}],
  },
  tour_pass_hearthome_veilstone:{
    width:54,height:30,safePath:ridgeSafe,
    openings:[...ridgeSafe,r(29,10,3,14),r(30,21,19,4),r(46,10,3,15),r(34,14,3,10),r(35,13,9,4),r(41,14,3,10)],
    grass:[r(35,13,6,3),r(33,22,8,3),r(44,21,4,3)],
    landmarks:[{...r(37,9,4,3),kind:'cliff'},{...r(37,18,3,3),kind:'grove'},{...r(49,18,3,7),kind:'cliff'}],
  },
  tour_pass_hearthome_pastoria:{
    width:52,height:32,safePath:watersideSafe,
    openings:[...watersideSafe,r(29,10,3,17),r(30,24,17,4),r(44,17,3,11),r(34,5,13,3),r(33,6,3,5),r(44,6,3,5)],
    grass:[r(35,5,7,3),r(33,25,7,3),r(43,24,4,3)],
    landmarks:[{...r(36,10,6,5),kind:'water'},{...r(34,20,8,3),kind:'water'},{...r(48,23,2,5),kind:'grove'}],
  },
};

/** Called after generic passage construction, before city entry spawns are set. */
export function applyJourneyRouteLayout(map:GameMap):void{
  const layout=JOURNEY_ROUTE_LAYOUTS[map.id];if(!layout)return;
  const rows=Array.from({length:layout.height},(_,y)=>Array.from({length:layout.width},(_,x)=>map.walkable[y]?.[x]??'#'));
  for(const area of layout.openings)for(let y=area.y;y<area.y+area.h;y++)for(let x=area.x;x<area.x+area.w;x++)rows[y][x]='.';
  map.width=layout.width;map.height=layout.height;map.walkable=rows.map(row=>row.join(''));
  map.terrain=[...(map.terrain??[]),...layout.grass.map(area=>({kind:'tallGrass' as const,...area}))];
  const east=map.warps.find(w=>w.entry==='right');if(east)east.x=layout.width-2;
  map.props.push({x:layout.width-4,y:8,dialogue:'journeySign'});
}
