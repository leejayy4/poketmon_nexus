import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOME_IDS=['tour_driftveil_home1','tour_driftveil_home2'];
const HALL_IDS=['tour_driftveil_hall','tour_driftveil_hall_2f','tour_driftveil_hall_3f'];

const ROLES:Record<string,Role>={
  tour_driftveil_hall:{title:'물풍경시장 1층 · 지역 장터',host:'시장 안내 상인',greeting:['물풍경의 농산물과 부두 화물이 만나는 지역 장터입니다.','진열품을 살펴보고 실제 여행 도구는 프렌들리숍에서 준비하세요.'],objects:[['나무열매 가판대','시장 배달 텃밭과 주변 농가에서 가져온 나무열매를\n상태와 쓰임에 따라 나누어 놓았다.'],['광물 견본대','동쪽 야적장에서 분류한 광물의 색과 무게를\n작은 견본으로 비교할 수 있다.'],['시장 층별 안내','1층 지역 장터 · 2층 선적 기록실\n3층 상인과 포켓몬 휴게층']]},
  tour_driftveil_hall_2f:{title:'물풍경시장 2층 · 선적 기록실',host:'시장 기록원',greeting:['시장에 들어온 물품이 어느 창고와 배로 가는지 기록하는 층입니다.','사람과 작업 포켓몬의 교대 시간도 함께 남깁니다.'],objects:[['화물 분류 장부','농산물과 광물, 생활 물품의 목적지와 무게가\n서로 다른 색으로 표시돼 있다.'],['도개교 운송도','물풍경도개교와 5번도로를 거쳐 뇌문으로 가는\n육상 운송 순서가 그려져 있다.'],['교대 작업표','하역 시간 뒤에 작업자와 포켓몬의\n급수·식사·휴식 시간이 적혀 있다.']]},
  tour_driftveil_hall_3f:{title:'물풍경시장 3층 · 동행 휴게층',host:'시장 휴게 도우미',greeting:['장터와 부두 일을 마친 사람과 포켓몬이 함께 쉬는 층입니다.','회복이 필요하면 북서쪽 포켓몬센터를 이용해 주세요.'],objects:[['상인 공동 식탁','시장 상인과 배달 포켓몬이 나누어 먹을\n간단한 식사와 물이 준비돼 있다.'],['항구 전망석','동쪽 작업 부두와 남쪽 도개교 도착길을\n창 너머로 함께 볼 수 있다.'],['다음 여행 수첩','북쪽 6번도로와 전기돌동굴을 준비하는\n도구·동료 상태 점검표가 놓여 있다.']]},
  tour_driftveil_home1:{title:'항만 작업자 공동주택 1층 · 장비 손질방',host:'항만 작업자',greeting:['부두에서 돌아오면 밧줄과 장갑을 말리고 작업 도구를 정리해요.'],objects:[['하역 장비대','젖은 밧줄과 크기가 다른 운반 장갑이 걸려 있다.'],['안전 기록 책장','작업 통로와 포켓몬 휴식 규칙을 적은 책이 꽂혀 있다.']]},
  tour_driftveil_home1_2f:{title:'항만 작업자 공동주택 2층 · 교대 식당',host:'항만 작업자 가족',greeting:['교대를 마친 가족과 작업 포켓몬이 함께 식사하는 층이에요.'],objects:[['교대 식탁','사람과 포켓몬의 식사 그릇이 움직임을 막지 않게 놓여 있다.'],['근무 시간표','부두 담당 구역과 다음 휴식 시간이 적혀 있다.']]},
  tour_driftveil_home1_3f:{title:'항만 작업자 공동주택 3층 · 수로 쉼터',host:'항만 작업자 가족',greeting:['동쪽 수로를 바라보며 피로를 푸는 조용한 층이에요.'],objects:[['수로 전망석','화물선과 데크를 오가는 작업 포켓몬이 멀리 보인다.'],['동료 휴게 방석','몸집이 다른 포켓몬을 위한 튼튼한 방석이 놓여 있다.']]},
  tour_driftveil_home2:{title:'시장 상인 공동주택 1층 · 배달 준비방',host:'시장 상인',greeting:['장터를 열기 전에 주문표와 배달 바구니를 확인해요.'],objects:[['배달 준비대','가판대별 표식이 붙은 바구니와 포장 천이 놓여 있다.'],['시장 주문 책장','필요한 물품과 도착 시간을 적은 장부가 꽂혀 있다.']]},
  tour_driftveil_home2_2f:{title:'시장 상인 공동주택 2층 · 가족 부엌',host:'시장 상인 가족',greeting:['남은 식재료를 낭비하지 않고 가족과 포켓몬의 식사를 준비해요.'],objects:[['가족 조리대','나무열매와 채소를 사람과 포켓몬 몫으로 나누고 있다.'],['보관 선반','습기와 햇빛을 피해 보관할 물품이 칸마다 정리돼 있다.']]},
  tour_driftveil_home2_3f:{title:'시장 상인 공동주택 3층 · 옥상 텃밭',host:'시장 상인 가족',greeting:['시장 배달 텃밭에서 옮겨 심은 작은 작물을 돌보는 층이에요.'],objects:[['옥상 재배 상자','바람을 피할 낮은 상자에 어린 나무열매 싹이 자란다.'],['포켓몬 급수대','흙일을 도운 파트너가 물을 마시고 쉬는 자리다.']]},
};

const roomIds=()=>['tour_driftveil_center','tour_driftveil_mart',...HOME_IDS.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_driftveil_center'?{x:28,y:22}:id==='tour_driftveil_mart'?{x:24,y:20}:id.startsWith('tour_driftveil_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_driftveil_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_driftveil_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_driftveil_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});
}

export function installDriftveilInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){const map=maps[id],room=rooms[id];if(!map||!room)continue;room.title=role.title;room.greeting=role.greeting;room.objects.forEach((object,index)=>{const item=role.objects[index];if(item){object.name=item[0];object.pages=[item[1]];}});map.name='물풍경시티 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;if(floors[id])floors[id].title=role.title;}
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
  for(const warp of maps.tour_driftveil.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_driftveil_'))warp.spawn={...spawn};}
}
