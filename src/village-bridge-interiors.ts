import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';
type Floors=Record<string,{floor:number;total:number;title:string}>;
const HOMES=['tour_village_bridge_home1','tour_village_bridge_home2','tour_village_bridge_home3'],HALLS=['tour_village_bridge_hall','tour_village_bridge_hall_2f','tour_village_bridge_hall_3f'];
const homeData:Array<Array<[string,string,string]>>=[
  [['다리 관리인의 집 1층 · 장비방','난간 점검대','난간·보행선·미끄럼 표지에 쓸 도구가 정리돼 있다.'],['다리 관리인의 집 2층 · 수위 기록방','수로 기록판','다리 기둥에서 읽은 수위와 바람을 시간별로 적었다.'],['다리 관리인의 집 3층 · 교대 휴게방','동료 방석','다리 일을 마친 사람과 포켓몬이 함께 쉬는 자리다.']],
  [['공연 주민의 집 1층 · 연습 준비방','손장단 연습대','통행을 막지 않을 작은 악보대와 손장단 순서를 놓았다.'],['공연 주민의 집 2층 · 목소리 기록방','연습 기록판','실제 공연 음원이 아니라 주민의 연습 순서를 글로 적었다.'],['공연 주민의 집 3층 · 조용한 휴게방','방음 휴게석','연습을 마친 가족과 동료가 조용히 쉬는 자리다.']],
  [['둔치 주민의 집 1층 · 물가 도구방','둔치 손질대','젖은 발을 닦는 천과 수로 난간 점검 도구가 있다.'],['둔치 주민의 집 2층 · 가족 부엌','밀폐 식재료장','물기와 바람을 피해 사람용·포켓몬용 재료를 나눴다.'],['둔치 주민의 집 3층 · 수로 전망방','수로 전망석','긴 다리와 동료 휴게뜰을 함께 바라보는 자리다.']],
];
const hallData:Array<[string,string,string]>=[
  ['다리 생활관 1층 · 통행 안내','다리 통행 기록대','12번도로 도착, 중앙 보행선, 11번도로 방향을 동료와 확인한다.'],
  ['다리 생활관 2층 · 수로 관측','수로 관측판','수위·바람·난간 점검 기록을 비교하되 수상이동 기능으로 안내하지 않는다.'],
  ['다리 생활관 3층 · 동행 휴게','동행 휴게 기록대','건강한 동료와 다리 휴게뜰의 물·그늘·통로를 살핀다.'],
];
const ids=()=>['tour_village_bridge_center','tour_village_bridge_mart',...HOMES.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALLS];
const size=(id:string):Point=>id==='tour_village_bridge_center'?{x:28,y:22}:id==='tour_village_bridge_mart'?{x:24,y:20}:id.startsWith('tour_village_bridge_hall')?{x:28,y:24}:{x:24,y:18};
function floorIndex(id:string){return id.endsWith('_2f')?1:id.endsWith('_3f')?2:0;}
function ws(id:string,map:GameMap,w:number,h:number,f:Floors):Warp[]{const info=f[id],s=w-5,c=Math.floor(w/2);return map.warps.map(x=>{const t=f[x.to];if(!t)return {...x,x:c,y:h-1,spawn:{...x.spawn}};return t.floor>info.floor?{...x,x:s,y:8,spawn:{x:s,y:h-5}}:{...x,x:s,y:h-6,spawn:{x:s,y:9}};});}
export function installVillageBridgeInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:Floors){
  for(const id of [...HOMES.flatMap(x=>[x,x+'_2f',x+'_3f']),...HALLS]){const room=rooms[id],map=maps[id];if(!room||!map)continue;const floor=floorIndex(id),home=HOMES.findIndex(x=>id.startsWith(x)),data=home>=0?homeData[home][floor]:hallData[floor];room.title=data[0];room.greeting=[home>=0?'다리와 둔치 생활을 마친 가족과 포켓몬이 쓰는 공간입니다.':'빌리지브리지의 통행·수로·동행 생활을 층별로 살피는 곳입니다.'];if(room.objects[0]){room.objects[0].name=data[1];room.objects[0].pages=[data[2]];}map.name='빌리지브리지 · '+data[0];if(floors[id])floors[id].title=data[0];}
  if(rooms.tour_village_bridge_hall?.objects[0])rooms.tour_village_bridge_hall.objects[0].event='tourVillageBridgeWalkLog';if(rooms.tour_village_bridge_hall_3f?.objects[0])rooms.tour_village_bridge_hall_3f.objects[0].event='tourVillageBridgeRestLog';
  for(const id of ids()){const map=maps[id],room=rooms[id];if(!map||!room)continue;const {x:w,y:h}=size(id),c=Math.floor(w/2),upper=!!floors[id]&&floors[id].floor>1,rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=2&&x<=w-3&&y>=3&&y<=h-3?'.':'#'));if(!upper){rows[h-2][c]='.';rows[h-1][c]='.';}const pos=id.startsWith('tour_village_bridge_hall')?[[4,7],[19,7],[4,16]]:[[3,6],[17,6],[3,12],[17,12]];room.objects.forEach((o,i)=>Object.assign(o,{x:pos[i]?.[0]??3,y:pos[i]?.[1]??12}));room.host={x:c,y:id.endsWith('_center')||id.endsWith('_mart')?5:h-5};if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:c-4,y:6,w:8,h:1};const props:GameMap['props']=[];if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}for(const o of room.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}const warps=ws(id,map,w,h,floors);for(const x of warps)rows[x.y][x.x]='.';Object.assign(map,{width:w,height:h,walkable:rows.map(r=>r.join('')),warps,props});Object.assign(map.npcs[0],room.host);spawns[id]={x:c,y:h-4};}
  for(const w of maps.tour_village_bridge.warps){const s=spawns[w.to];if(s&&w.to.startsWith('tour_village_bridge_'))w.spawn={...s};}
}
