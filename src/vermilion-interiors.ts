import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
const HOME_IDS=['tour_vermilion_home1','tour_vermilion_home2'];
const HALL_IDS=['tour_vermilion_hall','tour_vermilion_hall_2f','tour_vermilion_hall_3f'];

type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const ROLES:Record<string,Role>={
  tour_vermilion_hall:{title:'여객 터미널 1층 · 항로 안내층',host:'터미널 안내원',greeting:['갈색시티 여객 터미널의 항로 안내층입니다.','일반 지방 연결과 기존 조사선 승선 절차는 서로 다른 안내를 따릅니다.'],objects:[['항로 안내도','서쪽은 홍련–갈색 해안길, 북쪽은 갈색–블루 해안길이다.\n동쪽 일반 연결은 운하시티 방향이다.'],['출항 확인판','바람과 파도, 하역 작업 시간을 함께 확인한다.'],['터미널 층별 안내','1층 항로 안내 · 2층 하역 관찰\n3층 여행자와 포켓몬 휴게 공간']]},
  tour_vermilion_hall_2f:{title:'여객 터미널 2층 · 하역 관찰실',host:'항만 기록원',greeting:['부두의 포켓몬과 작업자가 함께 움직이는 모습을 기록합니다.','이곳은 관찰층입니다. 승선 절차는 1층 안내를 확인하세요.'],objects:[['하역 관찰 창','괴력과 알통몬이 무거운 짐을 옮기고\n작업자는 이동선을 비워 둔다.'],['화물 기록 선반','도착지와 무게, 함께 일한 포켓몬의\n휴식 시간을 기록해 두었다.'],['작업 동선 도면','동쪽 작업 부두와 남쪽 정박 구역의\n안전 통로가 표시되어 있다.']]},
  tour_vermilion_hall_3f:{title:'여객 터미널 3층 · 동행 휴게실',host:'여행자 도우미',greeting:['여행자와 포켓몬이 출발 전에 함께 쉬는 층입니다.','센터에서 상태를 돌보고 도구를 확인한 뒤 이동하세요.'],objects:[['동행 휴게 화단','바닷바람에 강한 식물 곁에\n포켓몬용 물그릇이 놓여 있다.'],['항구 전망석','서쪽 해안길과 동쪽 작업 부두가 보인다.'],['여행 준비 수첩','지나온 장소와 다음 경유지,\n동료의 상태를 적는 수첩이다.']]},
  tour_vermilion_home1:{title:'항만 노동자 공동주택 1층 · 장비 손질방',host:'부두 작업자',greeting:['부두에서 돌아오면 장갑과 밧줄을 손질해요.','함께 일한 포켓몬의 몸 상태도 꼭 살펴봅니다.'],objects:[['작업 장비대','젖은 밧줄과 장갑을 말리고 있다.'],['항만 생활 책장','부두 안전과 포켓몬 휴식에 관한 책이다.']]},
  tour_vermilion_home1_2f:{title:'항만 노동자 공동주택 2층 · 가족 식당',host:'항구 주민',greeting:['교대가 끝난 가족과 포켓몬이 함께 식사하는 층이에요.'],objects:[['가족 식탁','사람과 포켓몬이 나누어 먹을 식사다.'],['교대 근무표','부두 작업과 동료의 휴식 시간이 적혀 있다.']]},
  tour_vermilion_home1_3f:{title:'항만 노동자 공동주택 3층 · 옥상 쉼터',host:'항구 주민',greeting:['작업을 마친 동료들이 바닷바람을 맞으며 쉬는 곳이에요.'],objects:[['공동 화단','염분 섞인 바람에도 잘 자라는 식물이다.'],['포켓몬 휴게석','몸집이 다른 동료를 위한 방석이 놓여 있다.']]},
  tour_vermilion_home2:{title:'항해 가족 공동주택 1층 · 여행 준비방',host:'항해 가족',greeting:['해안길로 나가기 전에 지도와 도구를 확인해요.'],objects:[['여행 가방 작업대','몬스터볼과 상처약 자리를 나누어 두었다.'],['해안 지도 책장','홍련과 블루 방향 해안길 기록이다.']]},
  tour_vermilion_home2_2f:{title:'항해 가족 공동주택 2층 · 항로 기록실',host:'항해 가족',greeting:['날씨와 파도, 만난 포켓몬을 가족끼리 기록해 둡니다.'],objects:[['항로 기록장','갈색시티를 출발한 날짜와 경유지가 적혀 있다.'],['가족 사진 선반','여러 항구에서 포켓몬과 찍은 사진이다.']]},
  tour_vermilion_home2_3f:{title:'항해 가족 공동주택 3층 · 동행 정원',host:'항해 가족',greeting:['긴 이동 전후에 사람과 포켓몬이 함께 쉬는 작은 정원이에요.'],objects:[['수초 화분','작은 물그릇과 수초가 놓여 있다.'],['전망 휴게석','터미널과 남쪽 정박 구역이 보인다.']]},
};

const roomIds=()=>['tour_vermilion_center','tour_vermilion_mart',...HOME_IDS.flatMap(id=>[id,`${id}_2f`,`${id}_3f`]),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_vermilion_center'?{x:28,y:22}:id==='tour_vermilion_mart'?{x:24,y:20}:id.startsWith('tour_vermilion_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_vermilion_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_vermilion_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_vermilion_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];

function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{
    const target=floors[warp.to];
    if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};
    return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};
  });
}

/** Apply the size ledger to Vermilion rooms while keeping stable map/event IDs. */
export function installVermilionInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.title=role.title;room.greeting=role.greeting;
    room.objects.forEach((object,index)=>{const identity=role.objects[index];if(identity){object.name=identity[0];object.pages=[identity[1]];}});
    map.name='갈색시티 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;
    if(floors[id])floors[id].title=role.title;
  }
  for(const id of roomIds()){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    const {x:width,y:height}=dimensions(id),center=Math.floor(width/2),upper=!!floors[id]&&floors[id].floor>1;
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    if(!upper){rows[height-2][center]='.';rows[height-1][center]='.';}
    const objectPositions=positions(id);
    room.objects.forEach((object,index)=>Object.assign(object,objectPositions[index]??objectPositions.at(-1)));
    room.host={x:center,y:id.endsWith('_center')||id.endsWith('_mart')?5:height-5};
    if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:center-4,y:6,w:8,h:1};
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const warps=warpsFor(id,map,width,height,floors);for(const warp of warps)rows[warp.y][warp.x]='.';
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.warps=warps;map.props=props;
    Object.assign(map.npcs[0],room.host);spawns[id]={x:center,y:height-4};
  }
  for(const warp of maps.tour_vermilion.warps){
    const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_vermilion_'))warp.spawn={...spawn};
  }
}
