import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOME_IDS=['tour_mistralton_home1','tour_mistralton_home2','tour_mistralton_home3'];
const HALL_IDS=['tour_mistralton_hall','tour_mistralton_hall_2f','tour_mistralton_hall_3f'];
const ROLES:Record<string,Role>={
  tour_mistralton_hall:{title:'공항 터미널 1층 · 도착 안내',host:'공항 안내원',greeting:['전기돌동굴에서 도착한 여행자와 공항 견학자를 안내하는 로비입니다.','현재 확인된 시설과 육로만 안내하며 이용 가능한 항공편은 없습니다.'],objects:[['궐수 도착 안내도','남쪽 전기돌동굴, 북서쪽 센터와 상점, 동쪽 활주로 외곽 보행로가 표시돼 있다.'],['비행기 구조 모형','날개와 화물칸, 바퀴의 위치를 안전한 모형으로 살펴볼 수 있다.'],['터미널 층별 안내','1층 도착 안내 · 2층 화물과 기상 운영 · 3층 동행 휴게 전망실']]},
  tour_mistralton_hall_2f:{title:'공항 터미널 2층 · 화물·기상 운영실',host:'비행 운영 기록원',greeting:['활주로의 바람과 화물 적재 순서를 기록하는 견학층입니다.','운항을 예약하거나 출발시키는 기능은 아직 운영하지 않습니다.'],objects:[['바람 관측판','활주로 표지탑이 가리킨 풍향과 시간대별 바람 세기가 기록돼 있다.'],['화물 적재표','동굴 광물 표본과 농산물 상자를 무게와 목적지별로 나눈 표다.'],['활주로 안전도','울타리 밖 보행로와 작업 구역, 포켓몬 쉼터의 경계가 표시돼 있다.']]},
  tour_mistralton_hall_3f:{title:'공항 터미널 3층 · 동행 휴게 전망실',host:'동행 휴게 도우미',greeting:['긴 동굴길과 공항 견학을 마친 사람과 포켓몬이 함께 쉬는 층입니다.','회복이 필요하면 도시 북서쪽 포켓몬센터를 이용해 주세요.'],objects:[['활주로 전망석','유리 너머 가로 활주로와 바람 방향 표지탑이 함께 보인다.'],['비행 포켓몬 휴게 기록','날개·발·호흡을 살피고 급수한 시간이 차례로 적혀 있다.'],['다음 육로 수첩','전기돌동굴 귀환과 도시의 다른 육로 출구를 구분해 적는 수첩이다.']]},
  tour_mistralton_home1:{title:'정비사 공동주택 1층 · 장비 손질방',host:'공항 정비사',greeting:['작업을 마치면 보호 장비와 작은 공구부터 제자리에 정리해요.'],objects:[['정비 공구대','크기가 다른 렌치와 안전 장갑이 칸마다 놓여 있다.'],['작업 안전 책장','활주로 울타리와 보행로 경계를 설명한 책이 꽂혀 있다.']]},
  tour_mistralton_home1_2f:{title:'정비사 공동주택 2층 · 부품 기록실',host:'정비사 가족',greeting:['교체한 부품과 점검 시간을 가족이 함께 기록하는 층이에요.'],objects:[['부품 표본 선반','닳은 부품과 새 부품을 나란히 두어 차이를 볼 수 있다.'],['점검 기록판','바람이 강한 날 추가로 살필 부분이 적혀 있다.']]},
  tour_mistralton_home1_3f:{title:'정비사 공동주택 3층 · 조용한 휴게실',host:'정비사 가족',greeting:['기계 소리에서 벗어나 가족과 포켓몬이 쉬는 층이에요.'],objects:[['방음 휴게석','두꺼운 천과 낮은 방석이 놓인 조용한 자리다.'],['작은 날개 모형','가족이 만든 종이 날개가 천천히 흔들린다.']]},
  tour_mistralton_home2:{title:'화물원 공동주택 1층 · 포장 준비방',host:'공항 화물원',greeting:['화물이 흔들리지 않도록 상자와 완충재를 목적지별로 준비해요.'],objects:[['화물 포장대','광물 표본과 농산물에 맞는 서로 다른 포장재가 놓여 있다.'],['목적지 표식 선반','현재 기록된 육상 운송 목적지 표식만 정리돼 있다.']]},
  tour_mistralton_home2_2f:{title:'화물원 공동주택 2층 · 교대 식당',host:'화물원 가족',greeting:['작업자와 짐을 돕는 포켓몬이 교대 뒤 식사하는 층이에요.'],objects:[['교대 식탁','사람과 포켓몬의 식사와 물그릇이 통로 밖에 놓여 있다.'],['근무 시간표','적재 작업과 급수·휴식 시간이 함께 적혀 있다.']]},
  tour_mistralton_home2_3f:{title:'화물원 공동주택 3층 · 바람 전망실',host:'화물원 가족',greeting:['표지탑과 농로를 바라보며 다음 날 바람을 짐작해 보는 층이에요.'],objects:[['표지탑 전망석','남동쪽 날개판이 바람에 따라 방향을 바꾸는 모습이 보인다.'],['동료 휴게 방석','화물 일을 도운 파트너가 몸을 펴고 쉬는 자리다.']]},
  tour_mistralton_home3:{title:'농로 주민 공동주택 1층 · 수확 준비방',host:'농로 주민',greeting:['바람밭의 작물을 살피기 전 바구니와 물통을 준비해요.'],objects:[['수확 준비대','높이가 다른 포켓몬도 옮길 수 있는 작은 바구니가 놓여 있다.'],['바람밭 책장','강한 바람을 견디는 작물의 돌봄 기록이 꽂혀 있다.']]},
  tour_mistralton_home3_2f:{title:'농로 주민 공동주택 2층 · 가족 부엌',host:'농로 주민 가족',greeting:['수확한 작물을 나누어 가족과 포켓몬의 식사를 준비해요.'],objects:[['가족 조리대','향이 강한 재료와 포켓몬용 재료를 구분해 놓았다.'],['작물 보관 선반','습도와 햇빛에 맞춰 저장 칸을 나눈 선반이다.']]},
  tour_mistralton_home3_3f:{title:'농로 주민 공동주택 3층 · 씨앗 온실',host:'농로 주민 가족',greeting:['어린 싹이 강한 바람을 견딜 때까지 돌보는 작은 온실이에요.'],objects:[['씨앗 재배 상자','바람막이 안에서 어린 잎이 고르게 자라고 있다.'],['포켓몬 급수대','밭일을 도운 파트너가 물을 마시고 쉬는 자리다.']]},
};

const roomIds=()=>['tour_mistralton_center','tour_mistralton_mart',...HOME_IDS.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_mistralton_center'?{x:28,y:22}:id==='tour_mistralton_mart'?{x:24,y:20}:id.startsWith('tour_mistralton_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_mistralton_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_mistralton_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_mistralton_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});
}

export function installMistraltonInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){const map=maps[id],room=rooms[id];if(!map||!room)continue;room.title=role.title;room.greeting=role.greeting;room.objects.forEach((object,index)=>{const item=role.objects[index];if(item){object.name=item[0];object.pages=[item[1]];}});map.name='궐수시티 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;if(floors[id])floors[id].title=role.title;}
  if(rooms.tour_mistralton_hall?.objects[0])rooms.tour_mistralton_hall.objects[0].event='tourMistraltonArrivalBoard';
  if(rooms.tour_mistralton_hall_2f?.objects[0])rooms.tour_mistralton_hall_2f.objects[0].event='tourMistraltonWeatherLog';
  if(rooms.tour_mistralton_hall_2f?.objects[1])rooms.tour_mistralton_hall_2f.objects[1].event='tourMistraltonCargoLog';
  if(rooms.tour_mistralton_hall_3f?.objects[1])rooms.tour_mistralton_hall_3f.objects[1].event='tourMistraltonCompanionRest';
  if(rooms.tour_mistralton_hall_3f?.objects[2])rooms.tour_mistralton_hall_3f.objects[2].event='tourMistraltonRoadJournal';
  if(rooms.tour_mistralton_center?.objects[2]){rooms.tour_mistralton_center.objects[2].event='tourMistraltonCenterGuide';rooms.tour_mistralton_center.objects[2].name='궐수 여행 준비 안내';rooms.tour_mistralton_center.objects[2].pages=['동굴에서 온 동료의 회복과 공항 도시의 육로를 확인하는 안내판이다.'];}
  for(const id of roomIds()){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    const {x:width,y:height}=dimensions(id),center=Math.floor(width/2),upper=!!floors[id]&&floors[id].floor>1;
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    if(!upper){rows[height-2][center]='.';rows[height-1][center]='.';}
    const objectPositions=positions(id);room.objects.forEach((object,index)=>Object.assign(object,objectPositions[index]??objectPositions.at(-1)));
    room.host={x:center,y:id.endsWith('_center')||id.endsWith('_mart')?5:height-5};if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:center-4,y:6,w:8,h:1};
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const warps=warpsFor(id,map,width,height,floors);for(const warp of warps)rows[warp.y][warp.x]='.';
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.warps=warps;map.props=props;Object.assign(map.npcs[0],room.host);spawns[id]={x:center,y:height-4};
  }
  for(const warp of maps.tour_mistralton.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_mistralton_'))warp.spawn={...spawn};}
  maps.tour_mistralton_hall.npcs.push({id:'lentimasPilot',name:'산로행 조종사',sprite:'ace_trainer_f',x:8,y:18,facing:'down',dialogue:'tourMistraltonLentimasFlight'});
}
