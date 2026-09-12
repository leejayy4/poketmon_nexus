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
const veilstoneRidgeSafe=[...ridgeSafe,r(50,9,3,17),r(51,23,12,3),r(60,14,3,12),r(61,12,9,3)];
const watersideSafe=[r(29,9,7,3),r(33,9,3,10),r(34,16,12,3),r(43,9,3,10),r(44,9,7,3)];
const pastoriaWatersideSafe=[...watersideSafe,r(48,9,3,18),r(49,24,13,3),r(59,14,3,13),r(60,12,10,3)];
const cinnabarSafe=[r(29,9,8,3),r(34,9,3,14),r(35,20,17,3),r(49,9,3,14),r(50,9,13,3)];
const vermilionCoastSafe=[r(29,9,7,3),r(33,9,3,16),r(34,22,20,3),r(51,9,3,16),r(52,9,19,3)];
const ceruleanCoastSafe=[r(29,9,10,3),r(36,9,3,18),r(37,24,20,3),r(54,9,3,18),r(55,9,16,3)];
const sinnohCoastSafe=[r(29,9,8,3),r(34,9,3,17),r(35,23,17,3),r(49,9,3,17),r(50,9,12,3),r(59,9,3,18),r(60,24,10,3),r(67,9,3,18)];

export const JOURNEY_ROUTE_LAYOUTS:Record<string,JourneyRouteLayout>={
  tour_pass_snowpoint_lake:{
    width:72,height:36,safePath:ridgeSafe,
    openings:[...ridgeSafe,r(30,5,3,6),r(31,4,15,3),r(43,5,3,7),r(38,12,3,15),r(39,24,18,3),r(54,12,3,15),r(55,10,16,3),r(62,11,3,19),r(63,27,8,3)],
    grass:[r(33,5,7,3),r(42,21,7,3),r(57,13,5,4)],
    landmarks:[{...r(32,13,6,8),kind:'cliff'},{...r(41,27,11,4),kind:'grove'},{...r(50,14,4,8),kind:'cliff'},{...r(58,22,4,8),kind:'grove'},{...r(65,13,5,9),kind:'cliff'}],
  },
  tour_pass_veilstone_sunyshore:{
    width:72,height:36,safePath:sinnohCoastSafe,
    openings:[...sinnohCoastSafe,r(33,4,3,7),r(34,4,13,3),r(44,5,3,8),r(38,25,3,7),r(39,29,18,3),r(54,24,3,8),r(61,12,7,3)],
    grass:[r(37,5,6,3),r(38,26,6,3),r(62,16,5,4)],
    landmarks:[{...r(37,10,8,9),kind:'cliff'},{...r(42,26,10,3),kind:'grove'},{...r(51,13,6,8),kind:'water'},{...r(62,11,5,4),kind:'cliff'}],
  },
  tour_pass_pastoria_sunyshore:{
    width:72,height:36,safePath:sinnohCoastSafe,
    openings:[...sinnohCoastSafe,r(34,4,3,7),r(35,4,15,3),r(47,5,3,6),r(39,25,3,7),r(40,29,16,3),r(53,24,3,8),r(61,12,7,3)],
    grass:[r(38,5,7,3),r(38,26,6,3),r(62,16,5,4)],
    landmarks:[{...r(38,10,9,10),kind:'water'},{...r(42,26,10,3),kind:'grove'},{...r(53,13,5,8),kind:'cliff'},{...r(62,11,5,4),kind:'water'}],
  },
  tour_pass_vermilion_cinnabar:{
    width:72,height:36,safePath:vermilionCoastSafe,
    openings:[...vermilionCoastSafe,r(33,4,3,6),r(34,4,20,3),r(51,5,3,6),r(37,24,3,8),r(38,29,20,3),r(55,24,3,8),r(58,14,10,3),r(65,11,3,6)],
    // Coastal scenery is not an encounter binding or a new sailing service.
    grass:[],
    landmarks:[{...r(37,9,12,11),kind:'water'},{...r(39,27,16,2),kind:'cliff'},{...r(59,17,7,7),kind:'cliff'},{...r(61,4,7,4),kind:'grove'}],
  },
  tour_pass_vermilion_cerulean:{
    width:72,height:36,safePath:ceruleanCoastSafe,
    openings:[...ceruleanCoastSafe,r(32,4,3,6),r(33,4,14,3),r(44,5,3,10),r(40,14,18,3),r(55,14,3,10),r(59,20,9,3),r(65,11,3,12)],
    // Existing runtime encounter data remains authoritative; these are additional habitat patches.
    grass:[r(39,5,5,3),r(47,17,6,3),r(59,23,6,3)],
    landmarks:[{...r(39,9,5,5),kind:'water'},{...r(48,10,7,4),kind:'cliff'},{...r(58,14,7,5),kind:'water'},{...r(39,28,9,4),kind:'grove'}],
  },
  tour_pass_pallet_cinnabar:{
    width:64,height:34,safePath:cinnabarSafe,
    openings:[...cinnabarSafe,r(34,4,3,6),r(35,4,17,3),r(49,5,3,6),r(38,22,3,8),r(39,27,17,3),r(53,20,3,10),r(50,20,6,3)],
    // Habitat binding is a later part of the Cinnabar city work, not inferred from scenery.
    grass:[],
    landmarks:[{...r(38,9,10,10),kind:'water'},{...r(41,23,11,3),kind:'cliff'},{...r(55,14,6,5),kind:'cliff'}],
  },
  tour_pass_jubilife_oreburgh:{
    width:52,height:30,safePath:caveSafe,
    openings:[...caveSafe,r(33,5,3,5),r(34,4,12,4),r(43,6,3,8),r(43,12,6,3),r(33,19,3,8),r(34,23,12,5),r(43,19,3,8),r(25,16,10,3)],
    grass:[r(37,4,6,3),r(36,24,7,3)],
    landmarks:[{...r(37,10,5,6),kind:'cliff'},{...r(27,23,4,4),kind:'cliff'},{...r(47,24,3,3),kind:'cliff'}],
  },
  tour_pass_hearthome_veilstone:{
    width:72,height:36,safePath:veilstoneRidgeSafe,
    openings:[...veilstoneRidgeSafe,r(29,10,3,14),r(30,21,19,4),r(46,10,3,15),r(34,14,3,10),r(35,13,9,4),r(41,14,3,10),r(53,6,3,18),r(54,5,11,3),r(62,5,3,10),r(57,25,3,7),r(58,29,10,3),r(65,12,3,20)],
    grass:[r(35,13,6,3),r(33,22,8,3),r(44,21,4,3),r(54,8,6,4),r(53,26,4,4),r(63,16,4,5)],
    landmarks:[{...r(37,9,4,3),kind:'cliff'},{...r(37,18,3,3),kind:'grove'},{...r(49,18,3,7),kind:'cliff'},{...r(56,12,4,10),kind:'water'},{...r(61,26,4,3),kind:'grove'},{...r(68,15,3,15),kind:'cliff'}],
  },
  tour_pass_hearthome_pastoria:{
    width:72,height:36,safePath:pastoriaWatersideSafe,
    openings:[...pastoriaWatersideSafe,r(29,10,3,17),r(30,24,17,4),r(44,17,3,11),r(34,5,13,3),r(33,6,3,5),r(44,6,3,5),r(51,5,3,20),r(52,5,12,3),r(61,6,3,9),r(55,27,3,5),r(56,29,12,3),r(65,12,3,20)],
    grass:[r(35,5,7,3),r(33,25,7,3),r(43,24,4,3),r(53,8,6,4),r(51,27,4,4),r(63,16,4,5)],
    landmarks:[{...r(36,10,6,5),kind:'water'},{...r(34,20,8,3),kind:'water'},{...r(48,23,2,5),kind:'grove'},{...r(55,12,4,10),kind:'water'},{...r(60,26,4,3),kind:'grove'},{...r(68,15,3,15),kind:'water'}],
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
  if(map.id==='tour_pass_vermilion_cinnabar')map.npcs.push({id:'vermilionCoastWorker',name:'해안 운반원',sprite:'worker',x:55,y:30,facing:'left',dialogue:'vermilionCoastWorker'});
  if(map.id==='tour_pass_vermilion_cerulean')map.npcs.push({id:'vermilionBlueNaturalist',name:'해안 조사원',sprite:'scientist_f',x:49,y:16,facing:'down',dialogue:'vermilionBlueNaturalist'});
}
