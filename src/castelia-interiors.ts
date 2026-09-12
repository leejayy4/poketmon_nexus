import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;

const HOME_IDS=['tour_castelia_home1','tour_castelia_home2','tour_castelia_home3','tour_castelia_home4','tour_castelia_home5'];
const HALL_IDS=['tour_castelia_hall','tour_castelia_hall_2f','tour_castelia_hall_3f'];

function roomIds(){
  return ['tour_castelia_center','tour_castelia_mart',...HOME_IDS.flatMap(id=>[id,`${id}_2f`,`${id}_3f`]),...HALL_IDS];
}

function dimensions(id:string):Point{
  if(id==='tour_castelia_center')return {x:28,y:22};
  if(id==='tour_castelia_mart')return {x:24,y:20};
  if(id.startsWith('tour_castelia_hall'))return {x:28,y:24};
  return {x:24,y:18};
}

function objectPositions(id:string):Point[]{
  if(id==='tour_castelia_center')return [{x:4,y:8},{x:20,y:8},{x:4,y:15}];
  if(id==='tour_castelia_mart')return [{x:3,y:9},{x:19,y:9},{x:3,y:15}];
  if(id.startsWith('tour_castelia_hall'))return [{x:4,y:7},{x:19,y:7},{x:4,y:16}];
  return [{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
}

function resizedWarps(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairX=width-5;
  return map.warps.map(warp=>{
    const target=floors[warp.to];
    if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};
    if(target.floor>info.floor)return {...warp,x:stairX,y:8,spawn:{x:stairX,y:height-5}};
    return {...warp,x:stairX,y:height-6,spawn:{x:stairX,y:9}};
  });
}

/** Expand only Castelia rooms while preserving stable map IDs and event IDs. */
export function installCasteliaInteriorSizes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const id of roomIds()){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    const {x:width,y:height}=dimensions(id),center=Math.floor(width/2),upper=!!floors[id]&&floors[id].floor>1;
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    if(!upper){rows[height-2][center]='.';rows[height-1][center]='.';}
    const positions=objectPositions(id);
    room.objects.forEach((object,index)=>Object.assign(object,positions[index]??positions.at(-1)));
    if(id==='tour_castelia_center'){
      room.host={x:center,y:5};room.reception={x:center-4,y:6,w:8,h:1};
    }else if(id==='tour_castelia_mart'){
      room.host={x:center,y:5};room.reception={x:center-4,y:6,w:8,h:1};
    }else room.host={x:center,y:height-5};
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_castelia_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const warps=resizedWarps(id,map,width,height,floors);
    for(const warp of warps)rows[warp.y][warp.x]='.';
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.warps=warps;map.props=props;
    Object.assign(map.npcs[0],room.host);
    spawns[id]={x:center,y:height-4};
  }
  // Outdoor doors must use each newly expanded ground-floor foyer.
  const city=maps.tour_castelia;
  for(const warp of city.warps){
    const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_castelia_'))warp.spawn={...spawn};
  }
}
