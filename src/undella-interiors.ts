import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOME_IDS=['tour_undella_home1','tour_undella_home2'];
const HALL_IDS=['tour_undella_hall','tour_undella_hall_2f','tour_undella_hall_3f'];
const ROLES:Record<string,Role>={
  tour_undella_hall:{title:'해변 안내소 1층 · 산길 도착 안내',host:'산길 도착 안내원',greeting:['리버스마운틴을 지난 사람과 포켓몬이 귀환길과 마을 시설을 확인하는 층입니다.','도착 기록은 보상이나 13번도로 통행 조건이 아닙니다.'],objects:[['리버스마운틴 도착 기록대','산로마을에서 리버스마운틴 외부·A·B를 지나 물결마을에 온 순서를 기록한다.'],['마을 생활 안내도','서쪽 동굴 귀환길, 북쪽 센터, 온천수 관찰지, 남쪽 해변을 구분해 표시했다.'],['안내소 층별 표지','1층 산길 도착 · 2층 온천수와 해안 관찰\n3층 동행 손질과 휴게']]},
  tour_undella_hall_2f:{title:'해변 안내소 2층 · 온천수와 해안 관찰',host:'해안 관찰원',greeting:['산에서 식어 내려온 물과 바닷바람을 안전한 거리에서 비교하는 층입니다.','관찰 기록은 회복 효과나 야생 포켓몬 출현을 뜻하지 않습니다.'],objects:[['온천수 온도 기록판','동굴 쪽 물이 해안으로 흐르며 식는 변화를 시간대별로 적었다.'],['해풍 관찰 창','바람에 섞인 소금기와 화산재가 낮은 풀에 남긴 흔적을 살핀다.'],['해변 생태 수첩','확인하지 않은 조우종은 적지 않고 발자국과 먹이 흔적만 구분해 그렸다.']]},
  tour_undella_hall_3f:{title:'해변 안내소 3층 · 동행 손질 휴게실',host:'동행 손질 도우미',greeting:['동굴의 재와 해변의 모래를 털고 사람과 포켓몬이 함께 쉬는 층입니다.','실제 HP와 상태 회복은 포켓몬센터에서 받을 수 있습니다.'],objects:[['동행 손질대','부드러운 솔과 마른 천으로 발과 털에 남은 재와 모래를 정리한다.'],['깨끗한 급수대','몸집에 맞는 물그릇을 통로 밖에 나누어 두었다.'],['귀환 방향 수첩','서쪽으로 B→A→외부→산로마을 순서로 돌아가는 길을 적었다.']]},
  tour_undella_home1:{title:'절벽 관리인의 집 1층 · 장비 정리방',host:'절벽 관리인',greeting:['동굴 출구와 절벽 보행선을 살핀 뒤 장비를 정리하는 방이에요.'],objects:[['절벽 점검대','난간과 귀환 표지에 쓸 도구가 위치별로 정리돼 있다.'],['산길 지도 책장','리버스마운틴 B부터 산로마을까지의 쉼터와 귀환 방향을 표시했다.']]},
  tour_undella_home1_2f:{title:'절벽 관리인의 집 2층 · 바람 기록실',host:'관리인 가족',greeting:['산바람이 해풍으로 바뀌는 시각과 세기를 기록해요.'],objects:[['바람 기록판','붉은 재가 가라앉는 날과 바닷바람이 강한 날을 나누어 적었다.'],['동료 장비 선반','발 보호 천과 물통을 포켓몬 몸집에 맞춰 보관한다.']]},
  tour_undella_home1_3f:{title:'절벽 관리인의 집 3층 · 전망 휴게방',host:'관리인 가족',greeting:['동굴 출구와 마을 센터를 함께 보며 가족과 동료가 쉬는 층이에요.'],objects:[['동굴 출구 전망석','서쪽 절벽 표지와 마을 귀환길을 한눈에 확인할 수 있다.'],['동료 방석','산길을 함께 걸은 포켓몬이 발을 펴고 쉬는 자리다.']]},
  tour_undella_home2:{title:'해변 주민의 집 1층 · 모래 손질방',host:'해변 주민',greeting:['집에 들어오기 전에 신발과 포켓몬 발의 모래를 털어요.'],objects:[['모래 손질대','크기가 다른 솔과 마른 발수건이 가지런히 놓여 있다.'],['해변 생활 책장','파도 높이와 안전한 산책 시간을 적은 수첩이 꽂혀 있다.']]},
  tour_undella_home2_2f:{title:'해변 주민의 집 2층 · 해풍 부엌',host:'주민 가족',greeting:['바닷바람을 피해 사람과 포켓몬의 물과 식사를 준비하는 층이에요.'],objects:[['밀폐 식재료장','소금기와 모래가 들지 않도록 먹이를 뚜껑 있는 통에 나눴다.'],['낮은 물그릇 선반','작은 포켓몬도 편하게 마실 넓고 낮은 그릇이 놓여 있다.']]},
  tour_undella_home2_3f:{title:'해변 주민의 집 3층 · 그늘 휴게실',host:'주민 가족',greeting:['강한 햇빛과 바람을 피해 가족과 동료가 조용히 쉬어요.'],objects:[['차광 휴게석','얇은 커튼과 시원한 방석으로 햇빛을 낮춘 자리다.'],['해변 전망 창','남쪽 해변과 동쪽 13번도로의 해안 절벽길이 보인다.']]},
};

const roomIds=()=>['tour_undella_center','tour_undella_mart',...HOME_IDS.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_undella_center'?{x:28,y:22}:id==='tour_undella_mart'?{x:24,y:20}:id.startsWith('tour_undella_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_undella_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_undella_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_undella_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});
}
export function installUndellaInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){const map=maps[id],room=rooms[id];if(!map||!room)continue;room.title=role.title;room.greeting=role.greeting;room.objects.forEach((object,index)=>{const item=role.objects[index];if(item){object.name=item[0];object.pages=[item[1]];}});map.name='물결마을 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;if(floors[id])floors[id].title=role.title;}
  if(rooms.tour_undella_hall?.objects[0])rooms.tour_undella_hall.objects[0].event='tourUndellaArrivalLog';
  if(rooms.tour_undella_hall_3f?.objects[0])rooms.tour_undella_hall_3f.objects[0].event='tourUndellaCompanionCare';
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
  for(const warp of maps.tour_undella.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_undella_'))warp.spawn={...spawn};}
}
