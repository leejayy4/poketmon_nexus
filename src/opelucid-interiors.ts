import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';
type Floors=Record<string,{floor:number;total:number;title:string}>;
const HOMES=['tour_opelucid_home1','tour_opelucid_home2'],HALLS=['tour_opelucid_hall','tour_opelucid_hall_2f','tour_opelucid_hall_3f'];
const homeData:Array<Array<[string,string,string]>>=[
  [['석조 거리 주민의 집 1층 · 돌봄 도구방','돌바닥 손질대','거친 돌 사이를 정리하고 동료의 발을 닦는 천이 놓여 있다.'],['석조 거리 주민의 집 2층 · 문양 기록방','생활 문양 수첩','집과 광장에서 실제로 쓰는 문양을 위치별로 그렸다.'],['석조 거리 주민의 집 3층 · 가족 휴게방','낮은 동료 방석','돌길을 걸은 포켓몬이 발을 펴고 쉬는 자리다.']],
  [['새 거리 주민의 집 1층 · 화단 준비방','화단 도구 선반','낮은 화단과 보행 여백을 관리하는 도구가 정리돼 있다.'],['새 거리 주민의 집 2층 · 도시 비교방','거리 비교 지도','옛 돌길과 새 포장의 높이·그늘·쉼터 위치를 나란히 적었다.'],['새 거리 주민의 집 3층 · 전망 휴게방','동쪽 문 전망석','11번도로 도착문과 도시 중심 광장을 함께 바라본다.']],
];
const hallData:Array<[string,string,string]>=[
  ['용의 역사관 1층 · 도시 생활 기록','도시 생활 기록대','11번도로 도착문과 옛·새 거리의 현재 생활을 기록한다.'],
  ['용의 역사관 2층 · 건축 비교실','건축 비교 모형','석조 기둥·완만한 경사·새 포장의 쓰임을 축소 모형으로 비교한다.'],
  ['용의 역사관 3층 · 동행 관찰 휴게실','동행 관찰석','건강한 동료와 광장 문양을 살피고 조용히 쉬는 자리다.'],
];
const ids=()=>['tour_opelucid_center','tour_opelucid_mart',...HOMES.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALLS];
const size=(id:string):Point=>id==='tour_opelucid_center'?{x:28,y:22}:id==='tour_opelucid_mart'?{x:24,y:20}:id.startsWith('tour_opelucid_hall')?{x:28,y:24}:{x:24,y:18};
const floorIndex=(id:string)=>id.endsWith('_2f')?1:id.endsWith('_3f')?2:0;
function resizeWarps(id:string,map:GameMap,w:number,h:number,floors:Floors):Warp[]{const info=floors[id],stair=w-5,center=Math.floor(w/2);return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:h-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stair,y:8,spawn:{x:stair,y:h-5}}:{...warp,x:stair,y:h-6,spawn:{x:stair,y:9}};});}
export function installOpelucidInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:Floors){
  for(const id of [...HOMES.flatMap(home=>[home,home+'_2f',home+'_3f']),...HALLS]){const room=rooms[id],map=maps[id];if(!room||!map)continue;const floor=floorIndex(id),home=HOMES.findIndex(base=>id.startsWith(base)),data=home>=0?homeData[home][floor]:hallData[floor];room.title=data[0];room.greeting=[home>=0?'쌍용시티의 거리와 동료 생활을 돌보는 가족 공간입니다.':'확인된 도시 생활과 건축 자료를 층별로 살피는 역사관입니다.'];if(room.objects[0]){room.objects[0].name=data[1];room.objects[0].pages=[data[2]];}map.name='쌍용시티 · '+data[0];if(floors[id])floors[id].title=data[0];}
  if(rooms.tour_opelucid_center?.objects[0]){rooms.tour_opelucid_center.objects[0].name='쌍용 여행 준비 지도';rooms.tour_opelucid_center.objects[0].event='tourOpelucidCenterGuide';rooms.tour_opelucid_center.objects[0].pages=['11번도로·용의 역사관·도시 두 거리와 기존 귀환 통로를 구분한 지도다.'];}
  if(rooms.tour_opelucid_hall?.objects[0])rooms.tour_opelucid_hall.objects[0].event='tourOpelucidCityLog';
  if(rooms.tour_opelucid_hall_2f?.objects[0])rooms.tour_opelucid_hall_2f.objects[0].event='tourOpelucidMoveStudy';
  if(rooms.tour_opelucid_hall_3f?.objects[0])rooms.tour_opelucid_hall_3f.objects[0].event='tourOpelucidCompanionObserve';
  for(const id of ids()){const map=maps[id],room=rooms[id];if(!map||!room)continue;const {x:w,y:h}=size(id),center=Math.floor(w/2),upper=!!floors[id]&&floors[id].floor>1,rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=2&&x<=w-3&&y>=3&&y<=h-3?'.':'#'));if(!upper){rows[h-2][center]='.';rows[h-1][center]='.';}const positions=id.startsWith('tour_opelucid_hall')?[[4,7],[19,7],[4,16]]:[[3,6],[17,6],[3,12],[17,12]];room.objects.forEach((object,index)=>Object.assign(object,{x:positions[index]?.[0]??3,y:positions[index]?.[1]??12}));room.host={x:center,y:id.endsWith('_center')||id.endsWith('_mart')?5:h-5};if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:center-4,y:6,w:8,h:1};const props:GameMap['props']=[];if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}const warps=resizeWarps(id,map,w,h,floors);for(const warp of warps)rows[warp.y][warp.x]='.';Object.assign(map,{width:w,height:h,walkable:rows.map(row=>row.join('')),warps,props});Object.assign(map.npcs[0],room.host);spawns[id]={x:center,y:h-4};}
  for(const warp of maps.tour_opelucid.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_opelucid_'))warp.spawn={...spawn};}
}
