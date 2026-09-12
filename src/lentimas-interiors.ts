import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOME_IDS=['tour_lentimas_home1','tour_lentimas_home2','tour_lentimas_home3'];
const HALL_IDS=['tour_lentimas_hall','tour_lentimas_hall_2f','tour_lentimas_hall_3f'];
const ROLES:Record<string,Role>={
  tour_lentimas_hall:{title:'산길 안내소 1층 · 화산 여행 준비',host:'산길 안내원',greeting:['재바람과 뜨거운 지면에 대비하는 산길 안내층입니다.','동쪽 리버스마운틴은 별도 통과 맵이 연결된 뒤 출발할 수 있습니다.'],objects:[['리버스마운틴 준비표','동료의 상태, 물, 재를 닦을 천, 귀환 방향을 차례로 확인한다.'],['화산 지형 모형','산로마을과 동굴 입구, 물결마을 방향의 높이 차를 보여 주는 모형이다.'],['안내소 층별 표지','1층 여행 준비 · 2층 화산 관측\n3층 사람과 포켓몬 휴게']]},
  tour_lentimas_hall_2f:{title:'산길 안내소 2층 · 화산 관측실',host:'화산 관측원',greeting:['바람에 섞인 재와 지면 온도를 안전 거리에서 기록하는 층입니다.','관측 자료는 동굴이 열렸다는 신호나 전설 포켓몬의 징후가 아닙니다.'],objects:[['재바람 관측판','바람 방향과 재의 양을 시간대별로 구분해 적었다.'],['지면 온도표','마을길과 산 입구의 온도를 같은 시각에 비교한 표다.'],['암석 표본대','붉은 화산암과 식은 돌을 만지지 않고 비교할 수 있게 덮개 안에 두었다.']]},
  tour_lentimas_hall_3f:{title:'산길 안내소 3층 · 동행 휴게실',host:'동행 휴게 도우미',greeting:['재바람 관측과 비행을 마친 사람과 포켓몬이 함께 쉬는 층입니다.','실제 회복은 포켓몬센터에서 받을 수 있습니다.'],objects:[['재 제거 손질대','부드러운 솔과 마른 천을 몸집별로 나누어 두었다.'],['동행 급수대','사람과 포켓몬이 통로를 막지 않고 물을 마실 수 있는 자리다.'],['귀환 수첩','궐수행 비행기와 산로마을 센터 위치를 적어 두는 수첩이다.']]},
  tour_lentimas_home1:{title:'도공의 집 1층 · 흙 준비방',host:'화산 흙 도공',greeting:['재와 자갈을 골라내고 그릇에 쓸 흙을 준비하는 방이에요.'],objects:[['흙 고름대','입자 크기가 다른 붉은 흙을 체로 나누어 놓았다.'],['도자기 책장','마을에서 오래 사용한 물그릇과 저장 항아리 기록이 꽂혀 있다.']]},
  tour_lentimas_home1_2f:{title:'도공의 집 2층 · 빚기 작업실',host:'도공 가족',greeting:['사람과 포켓몬이 쓰기 편한 높이와 무게를 생각하며 그릇을 빚어요.'],objects:[['낮은 물그릇 작업대','작은 포켓몬도 편하게 마실 수 있는 넓고 낮은 그릇이 놓여 있다.'],['손자국 견본대','가족이 만든 그릇의 바닥 무늬를 나란히 비교한다.']]},
  tour_lentimas_home1_3f:{title:'도공의 집 3층 · 그늘 건조실',host:'도공 가족',greeting:['강한 재바람을 피해 빚은 그릇을 천천히 말리는 층이에요.'],objects:[['그늘 건조 선반','갈라지지 않도록 간격을 둔 그릇이 놓여 있다.'],['파트너 휴게석','흙일을 도운 포켓몬이 발을 닦고 쉬는 자리다.']]},
  tour_lentimas_home2:{title:'착륙장 정비사 집 1층 · 장비 손질방',host:'착륙장 정비사',greeting:['비행 뒤에는 보호안경과 바퀴 솔부터 깨끗하게 정리해요.'],objects:[['재 제거 공구대','기체 틈의 재를 빼는 작은 솔과 천이 걸려 있다.'],['착륙 안전 책장','바람 방향과 사람·포켓몬 대기선을 적은 책이 꽂혀 있다.']]},
  tour_lentimas_home2_2f:{title:'착륙장 정비사 집 2층 · 바람 기록실',host:'정비사 가족',greeting:['착륙 전후의 바람과 점검 결과를 함께 기록하는 층이에요.'],objects:[['비행 기록판','궐수와 산로 사이의 바람 변화를 날짜별로 표시했다.'],['날개 모형 선반','날개 각도에 따라 재가 쌓이는 위치를 보여 주는 모형이다.']]},
  tour_lentimas_home2_3f:{title:'착륙장 정비사 집 3층 · 조용한 휴게방',host:'정비사 가족',greeting:['비행 소리와 재바람에서 벗어나 가족과 동료가 쉬는 층이에요.'],objects:[['차광 휴게석','눈에 재가 들어간 포켓몬도 편히 쉴 수 있게 빛을 낮췄다.'],['깨끗한 물 선반','밀폐한 물통과 작은 급수 그릇이 정리돼 있다.']]},
  tour_lentimas_home3:{title:'산길 조사원 집 1층 · 표본 정리방',host:'산길 조사원',greeting:['안전한 곳에서 주운 돌만 위치와 날짜를 적어 정리해요.'],objects:[['암석 분류대','색과 무게가 다른 돌이 출처표와 함께 놓여 있다.'],['산길 지도 책장','산로마을 귀환점과 동굴 출입구를 구분한 지도가 꽂혀 있다.']]},
  tour_lentimas_home3_2f:{title:'산길 조사원 집 2층 · 보호 장비실',host:'조사원 가족',greeting:['사람과 포켓몬의 눈·발·호흡을 보호할 장비를 점검해요.'],objects:[['보호 장비 선반','몸집에 맞춘 천과 보호안경이 칸마다 나뉘어 있다.'],['상태 기록판','재바람 뒤 식욕과 걸음걸이를 살핀 기록이 붙어 있다.']]},
  tour_lentimas_home3_3f:{title:'산길 조사원 집 3층 · 전망 휴게실',host:'조사원 가족',greeting:['동쪽 산의 바람을 창 안에서 살피며 하루를 마무리해요.'],objects:[['산 입구 전망석','리버스마운틴 표지와 마을 귀환길을 함께 볼 수 있다.'],['동료 방석','조사를 함께한 포켓몬이 몸을 펴고 쉬는 자리다.']]},
};

const roomIds=()=>['tour_lentimas_center','tour_lentimas_mart',...HOME_IDS.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_lentimas_center'?{x:28,y:22}:id==='tour_lentimas_mart'?{x:24,y:20}:id.startsWith('tour_lentimas_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_lentimas_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_lentimas_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_lentimas_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});
}
export function installLentimasInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){const map=maps[id],room=rooms[id];if(!map||!room)continue;room.title=role.title;room.greeting=role.greeting;room.objects.forEach((object,index)=>{const item=role.objects[index];if(item){object.name=item[0];object.pages=[item[1]];}});map.name='산로마을 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;if(floors[id])floors[id].title=role.title;}
  if(rooms.tour_lentimas_hall?.objects[0])rooms.tour_lentimas_hall.objects[0].event='tourLentimasPreparation';
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
  for(const warp of maps.tour_lentimas.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_lentimas_'))warp.spawn={...spawn};}
}
