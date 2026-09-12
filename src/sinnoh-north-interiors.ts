import type { GameMap,Point,Warp } from './types';
import type { Furnishing,TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
const cityOf=(id:string)=>id.startsWith('tour_lake_')?'tour_lake':'tour_snowpoint';
const size=(id:string):Point=>id.endsWith('_center')?{x:28,y:22}:id.endsWith('_hall')?{x:28,y:24}:id.endsWith('_mart')?{x:24,y:20}:{x:24,y:18};
const positions=(id:string):Point[]=>id.endsWith('_center')?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id.endsWith('_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:id.endsWith('_mart')?[{x:3,y:9},{x:18,y:9},{x:3,y:15}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
const extra=(name:string,text:string,event:string):Furnishing=>({kind:'bench',name,pages:[text],x:0,y:0,w:4,h:2,event});
const additions:Record<string,Furnishing>={
  tour_lake_center:extra('호숫길 동료 건조석','젖은 발과 털을 닦는 마른 수건과 낮은 물그릇이 있다.','lakeCenterDrying'),
  tour_lake_hall:extra('세 호수 구분 안내판','이곳은 여러 물가를 비교하는 관찰 거점이며 진실·입지·예지호수 중 하나가 아니다.','lakeIdentityGuide'),
  tour_lake_mart:extra('설원 출발 정리대','북쪽 연결길에 나가기 전 상처약과 몬스터볼, 동료 상태를 확인한다.','lakeWinterPacking'),
  tour_snowpoint_center:extra('설원 동료 온기석','눈길을 걸은 동료가 천천히 몸을 덥히는 담요와 물이 있다.','snowpointCenterWarmth'),
  tour_snowpoint_hall:extra('신전 주변 관찰도','도시 생활길과 신전 접근 석주를 표시한 안내도다. 신전 본편을 여는 장치는 아니다.','snowpointTempleGuide'),
  tour_snowpoint_mart:extra('방한 여행 정리대','설원길 출발 전에 가방과 동료 상태를 점검하는 자리다.','snowpointWinterPacking'),
};

function remapWarps(id:string,map:GameMap,w:number,h:number,floors:FloorInfo):Warp[]{
  const current=floors[id];const stairX=w-5;
  return map.warps.map(warp=>{
    if(warp.to===cityOf(id))return {...warp,x:Math.floor(w/2),y:h-1};
    const target=floors[warp.to];
    if(!current||!target)return warp;
    return target.floor>current.floor?{...warp,x:stairX,y:7,spawn:{x:stairX,y:h-5}}:{...warp,x:stairX,y:h-6,spawn:{x:stairX,y:9}};
  });
}

export function installSinnohNorthInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  const ids=Object.keys(maps).filter(id=>/^tour_(lake|snowpoint)_(center|hall|mart|home\d)(?:_[23]f)?$/.test(id));
  for(const id of ids){
    const map=maps[id],room=rooms[id];if(!room)continue;
    if(additions[id])room.objects.push(additions[id]);
    const {x:w,y:h}=size(id),c=Math.floor(w/2),upper=Boolean(floors[id]?.floor&&floors[id].floor>1);
    const rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=2&&x<=w-3&&y>=3&&y<=h-3?'.':'#'));
    if(!upper){rows[h-2][c]='.';rows[h-1][c]='.';}
    const spots=positions(id);room.objects.forEach((object,index)=>Object.assign(object,spots[index]??spots.at(-1)));
    room.host={x:c,y:id.endsWith('_center')||id.endsWith('_mart')?5:h-5};
    if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:c-4,y:6,w:8,h:1};
    if(id.startsWith('tour_lake_home'))room.greeting=['호숫가 관찰자와 동료가 장비를 말리고 기록을 정리하는 생활 공간이에요.'];
    if(id.startsWith('tour_snowpoint_home'))room.greeting=['눈길 장비를 손질하고 사람과 포켓몬이 함께 몸을 녹이는 집이에요.'];
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const warps=remapWarps(id,map,w,h,floors);for(const warp of warps)rows[warp.y][warp.x]='.';
    map.width=w;map.height=h;map.walkable=rows.map(row=>row.join(''));map.warps=warps;map.props=props;Object.assign(map.npcs[0],room.host);spawns[id]={x:c,y:h-4};
  }
  for(const cityId of ['tour_lake','tour_snowpoint'])for(const warp of maps[cityId].warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith(cityId+'_'))warp.spawn={...spawn};}
}
