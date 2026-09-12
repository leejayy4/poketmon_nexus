import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOME_IDS=['tour_veilstone_home2','tour_veilstone_home3'];
const HALL_IDS=['tour_veilstone_hall','tour_veilstone_hall_2f','tour_veilstone_hall_3f'];
const ROLES:Record<string,Role>={
  tour_veilstone_center:{title:'포켓몬센터 · 고갯길 휴게소',host:'센터 안내원',greeting:['연고–장막 고갯길을 건넌 동료를 먼저 쉬게 해 주세요.','PC와 회복 안내는 기존과 같습니다.'],objects:[['고갯길 상태표','비탈길을 건넌 뒤 발과 체온을 확인하는 순서가 적혀 있다.'],['동료 건조석','젖은 털과 장비를 닦을 마른 수건이 준비돼 있다.'],['장막 여행 지도','백화점·수련광장·체육관과 다음 출구가 표시돼 있다.']]},
  tour_veilstone_mart:{title:'프렌들리숍 · 수련 준비점',host:'상점 점원',greeting:['몬스터볼과 상처약은 기존 판매 목록에서 고를 수 있어요.','수련광장이나 다음 길로 나가기 전에 가방을 확인하세요.'],objects:[['여행용품 진열대','몬스터볼과 상처약의 쓰임을 그림으로 설명한다.'],['수련 보호용품','손목띠와 마른 수건은 생활 전시품이며 판매 품목이 아니다.'],['가방 정리대','보유 도구와 동료의 상태를 확인할 수 있는 낮은 탁자다.']]},
  tour_veilstone_hall:{title:'백화점 1층 · 여행 보급',host:'백화점 점원',greeting:['고갯길과 도시 수련에 필요한 기본 도구를 안내하는 층입니다.','실제 구매 품목은 기존 몬스터볼과 상처약입니다.'],objects:[['여행 보급 진열대','몬스터볼과 상처약 사용 시점을 소개한다.'],['장막 층별 안내','1층 보급 · 2층 기술 준비 · 3층 동료 휴게.'],['고갯길 귀환 지도','연고 방면 축약 고갯길과 장막 귀환 지점을 표시했다.']]},
  tour_veilstone_hall_2f:{title:'백화점 2층 · 기술 준비 자료실',host:'기술 준비 안내원',greeting:['현재 동료의 기술과 자두 체육관 준비를 비교하는 자료층입니다.','기술이나 도구를 새로 지급하는 곳은 아닙니다.'],objects:[['타입 대응표','격투 동료와 맞설 때 기술이 어떻게 통하는지 정리했다.'],['동작 관찰대','공격 자세와 교대 시점을 천천히 살펴보는 견학 화면이다.'],['준비 기록 선반','회복·기술·도구를 확인한 여행자의 기록이 꽂혀 있다.']]},
  tour_veilstone_hall_3f:{title:'백화점 3층 · 동료 휴게실',host:'휴게실 안내원',greeting:['쇼핑과 수련을 마친 사람과 포켓몬이 함께 쉬는 층입니다.','회복이 필요하면 포켓몬센터를 이용해 주세요.'],objects:[['도시 전망 휴게석','단차 광장과 체육관 방향이 보이는 긴 의자다.'],['동료용 물자리','몸집이 다른 포켓몬도 마실 수 있게 높이를 나눴다.'],['다음 여행 수첩','장막 밖으로 나가기 전 확인할 항목을 적는 빈 수첩이다.']]},
  tour_veilstone_home2:{title:'수련가 공동주택 1층 · 장비 손질방',host:'수련가 주민',greeting:['수련을 마친 뒤 사람과 포켓몬의 장비를 함께 정리해요.'],objects:[['보호대 손질대','움직임을 막지 않도록 끈과 보호대를 다듬는다.'],['수련 생활 책장','훈련과 휴식 시간을 번갈아 적은 기록이 있다.'],['동료 휴식 방석','연습 뒤 숨을 고르는 넓은 방석이다.']]},
  tour_veilstone_home2_2f:{title:'수련가 공동주택 2층 · 균형 연습실',host:'수련가 주민',greeting:['승패 없이 발걸음과 균형을 맞추는 조용한 방이에요.'],objects:[['낮은 발판','사람과 포켓몬이 차례로 오르는 넓은 발판이다.'],['동작 순서표','준비 운동과 휴식 순서를 그림으로 표시했다.'],['물과 수건 선반','무리하지 않고 쉬도록 물과 수건을 놓았다.']]},
  tour_veilstone_home2_3f:{title:'수련가 공동주택 3층 · 회복 생활실',host:'수련가 주민',greeting:['훈련을 마친 가족과 동료가 조용히 하루를 마무리해요.'],objects:[['공동 낮잠 자리','크기가 다른 방석과 얇은 담요가 놓여 있다.'],['식사 기록판','동료마다 먹은 양과 컨디션을 적어 둔다.'],['창가 전망석','남쪽 훈련 절벽과 수련광장이 내려다보인다.']]},
  tour_veilstone_home3:{title:'상인 공동주택 1층 · 배송 정리방',host:'상인 주민',greeting:['백화점과 고갯길을 오가는 짐을 사람과 포켓몬이 함께 정리해요.'],objects:[['배송 분류대','가벼운 물품과 깨지기 쉬운 짐을 나눠 놓았다.'],['도시 배달 지도','백화점·센터·공동주택 사이의 계단길이 표시돼 있다.'],['운반 동료 쉼터','일을 마친 포켓몬을 위한 물과 방석이 있다.']]},
  tour_veilstone_home3_2f:{title:'상인 공동주택 2층 · 가격표 작업실',host:'상인 주민',greeting:['판매 물품의 이름과 쓰임을 읽기 쉽게 정리하는 층이에요.'],objects:[['가격표 작업대','큰 글씨와 그림으로 만든 견본 가격표가 놓여 있다.'],['재고 기록 선반','판매품과 생활 전시품을 구분한 장부가 꽂혀 있다.'],['포장 재료함','동료가 다치지 않도록 부드러운 천을 따로 모았다.']]},
  tour_veilstone_home3_3f:{title:'상인 공동주택 3층 · 옥상 화단 휴게실',host:'상인 주민',greeting:['도시 일을 마친 이웃과 포켓몬이 화단 곁에서 쉬어요.'],objects:[['옥상 허브 화분','강한 향을 피한 잎을 주민들이 번갈아 돌본다.'],['동료 전망석','동쪽 출구 방풍수와 상업 거리가 함께 보인다.'],['배송 일지','고갯길 날씨와 귀환 시간을 날짜별로 기록했다.']]},
};

const roomIds=()=>['tour_veilstone_center','tour_veilstone_mart',...HOME_IDS.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_veilstone_center'?{x:28,y:22}:id==='tour_veilstone_mart'?{x:24,y:20}:id.startsWith('tour_veilstone_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_veilstone_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_veilstone_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_veilstone_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12}];
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});
}

/** Apply Veilstone's room sizes while preserving shops, stairs and outdoor door contracts. */
export function installVeilstoneInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.title=role.title;room.greeting=role.greeting;room.objects.forEach((object,index)=>{const detail=role.objects[index];if(detail){object.name=detail[0];object.pages=[detail[1]];}});
    if(id==='tour_veilstone_hall_2f'&&room.objects[0])room.objects[0].event='veilstoneTechniqueDesk';
    map.name='장막시티 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;if(floors[id])floors[id].title=role.title;
  }
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
  for(const warp of maps.tour_veilstone.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_veilstone_'))warp.spawn={...spawn};}
}
