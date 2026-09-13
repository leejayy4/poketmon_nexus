import { openIcirrusYard,openIcirrusLookout,openIcirrusPondBank,installIcirrusWindmillBoard } from './icirrus-city-layout';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';
type Floors=Record<string,{floor:number;total:number;title:string}>;
const HOMES=['tour_icirrus_home1','tour_icirrus_home2'],HALLS=['tour_icirrus_hall','tour_icirrus_hall_2f','tour_icirrus_hall_3f'];
const homeData:Array<Array<[string,string,string]>>=[
  [['습지 주민의 집 1층 · 장화 손질방','습지 장비 선반','젖은 장화와 동료의 발을 닦는 천이 나뉘어 걸려 있다.'],['습지 주민의 집 2층 · 물길 기록방','빗물 높이 수첩','8번도로 웅덩이와 도시 연못의 물 높이를 날짜별로 적었다.'],['습지 주민의 집 3층 · 가족 휴게방','따뜻한 동료 방석','습지를 걸은 포켓몬이 몸을 말리고 쉬는 자리다.']],
  [['전망 둔덕 주민의 집 1층 · 길 준비방','마른 길 준비대','8번도로 본선과 둔덕을 걸을 때 쓸 장비가 정리돼 있다.'],['전망 둔덕 주민의 집 2층 · 탑 방향방','용나선 방향 지도','도시 북쪽 전망과 용나선탑 방향을 구분해 표시했다.'],['전망 둔덕 주민의 집 3층 · 바람 휴게방','북풍 창가 자리','바람을 피해 사람과 포켓몬이 함께 쉬는 낮은 자리다.']],
];
const hallData:Array<[string,string,string]>=[
  ['습지 생활관 1층 · 8번도로 도착 안내','8번도로 귀환 지도','설화 동문에서 8번도로·튜브라인브리지·9번도로·쌍용까지의 귀환 순서를 표시한다.'],
  ['습지 생활관 2층 · 빗물 생활 자료실','습지 생활 비교표','마른 본선과 빗물 순환로, 도시 연못의 쓰임을 생활 기록으로 비교한다.'],
  ['습지 생활관 3층 · 북쪽 전망 휴게실','용나선 방향 전망석','북쪽 둔덕과 용나선탑 방향을 보며 동료와 쉬는 자리다.'],
];
const ids=()=>['tour_icirrus_center','tour_icirrus_mart',...HOMES.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALLS];
const size=(id:string):Point=>id==='tour_icirrus_center'?{x:28,y:22}:id==='tour_icirrus_mart'?{x:24,y:20}:id.startsWith('tour_icirrus_hall')?{x:28,y:24}:{x:24,y:18};
const floorIndex=(id:string)=>id.endsWith('_2f')?1:id.endsWith('_3f')?2:0;
function resizeWarps(id:string,map:GameMap,w:number,h:number,floors:Floors):Warp[]{const info=floors[id],stair=w-5,center=Math.floor(w/2);return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:h-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stair,y:8,spawn:{x:stair,y:h-5}}:{...warp,x:stair,y:h-6,spawn:{x:stair,y:9}};});}
export function installIcirrusInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:Floors,outdoors:TourOutdoors){
  for(const id of [...HOMES.flatMap(home=>[home,home+'_2f',home+'_3f']),...HALLS]){const room=rooms[id],map=maps[id];if(!room||!map)continue;const floor=floorIndex(id),home=HOMES.findIndex(base=>id.startsWith(base)),data=home>=0?homeData[home][floor]:hallData[floor];room.title=data[0];room.greeting=[home>=0?'설화의 습지 생활과 동료 휴식을 이어 가는 가족 공간입니다.':'8번도로 도착과 도시 습지 생활을 층별로 살피는 생활관입니다.'];if(room.objects[0]){room.objects[0].name=data[1];room.objects[0].pages=[data[2]];}map.name='설화시티 · '+data[0];if(floors[id])floors[id].title=data[0];}
  if(rooms.tour_icirrus_center?.objects[0]){rooms.tour_icirrus_center.objects[0].name='설화 여행 준비 지도';rooms.tour_icirrus_center.objects[0].event='tourIcirrusCenterGuide';rooms.tour_icirrus_center.objects[0].pages=['8번도로 귀환, 습지 생활관, 북쪽 용나선 방향을 구분한 지도다.'];}
  if(rooms.tour_icirrus_mart?.objects[0]){rooms.tour_icirrus_mart.objects[0].name='설화 도보 여행 준비대';rooms.tour_icirrus_mart.objects[0].event='tourIcirrusMartGuide';rooms.tour_icirrus_mart.objects[0].pages=['8번도로·설화의 습지·번호 없는 용나선탑 접근로의 준비를 구분한다.'];}
  if(rooms.tour_icirrus_hall?.objects[0])rooms.tour_icirrus_hall.objects[0].event='tourIcirrusArrivalLog';
  const corner=rooms.tour_icirrus_hall?.objects[1];
  if(corner){corner.name='동료 교류 코너';corner.event='tourIcirrusCompanionCorner';corner.pages=['함께 여행하는 동료와 현재 익힌 기술을 보여주는 교류 자리다.'];}
  if(rooms.tour_icirrus_hall_2f?.objects[0])rooms.tour_icirrus_hall_2f.objects[0].event='tourIcirrusWaterStudy';
  if(rooms.tour_icirrus_hall_3f?.objects[0])rooms.tour_icirrus_hall_3f.objects[0].event='tourIcirrusCompanionRest';
  const homeEvents:Record<string,string>={tour_icirrus_home1:'tourIcirrusGearCare',tour_icirrus_home1_2f:'tourIcirrusRainLedger',tour_icirrus_home1_3f:'tourIcirrusDryRest',tour_icirrus_home2:'tourIcirrusRoadKit',tour_icirrus_home2_2f:'tourIcirrusTowerMap',tour_icirrus_home2_3f:'tourIcirrusWindRest'};
  for(const [id,event] of Object.entries(homeEvents))if(rooms[id]?.objects[0])rooms[id].objects[0].event=event;
  for(const id of ids()){const map=maps[id],room=rooms[id];if(!map||!room)continue;const {x:w,y:h}=size(id),center=Math.floor(w/2),upper=!!floors[id]&&floors[id].floor>1,rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=2&&x<=w-3&&y>=3&&y<=h-3?'.':'#'));if(!upper){rows[h-2][center]='.';rows[h-1][center]='.';}const positions=id.startsWith('tour_icirrus_hall')?[[4,7],[19,7],[4,16]]:[[3,6],[17,6],[3,12],[17,12]];room.objects.forEach((object,index)=>Object.assign(object,{x:positions[index]?.[0]??3,y:positions[index]?.[1]??12}));room.host={x:center,y:id.endsWith('_center')||id.endsWith('_mart')?5:h-5};if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:center-4,y:6,w:8,h:1};const props:GameMap['props']=[];if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}const warps=resizeWarps(id,map,w,h,floors);for(const warp of warps)rows[warp.y][warp.x]='.';Object.assign(map,{width:w,height:h,walkable:rows.map(row=>row.join('')),warps,props});Object.assign(map.npcs[0],room.host);spawns[id]={x:center,y:h-4};}
  for(const warp of maps.tour_icirrus.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_icirrus_'))warp.spawn={...spawn};}
  openIcirrusYard(maps.tour_icirrus,outdoors);
  openIcirrusLookout(maps.tour_icirrus,outdoors);
  openIcirrusPondBank(maps.tour_icirrus);
  installIcirrusWindmillBoard(maps.tour_icirrus,outdoors);
}

