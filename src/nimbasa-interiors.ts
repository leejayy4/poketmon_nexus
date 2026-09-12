import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOME_IDS=['tour_nimbasa_home1','tour_nimbasa_home2','tour_nimbasa_home3'];
const HALL_IDS=['tour_nimbasa_hall','tour_nimbasa_hall_2f','tour_nimbasa_hall_3f'];
const ROLES:Record<string,Role>={
  tour_nimbasa_hall:{title:'놀이공원 안내소 1층 · 도시 길안내',host:'놀이공원 안내원',greeting:['관람차와 공연 거리, 경기 휴게원을 안내하는 로비입니다.','남쪽 환영 광장은 조인애버뉴, 북쪽 길은 물풍경 방향으로 이어집니다.'],objects:[['뇌문 놀이 지도','서쪽 센터와 주택가, 동쪽 관람차와 공연 거리,\n남쪽 조인애버뉴 환영 광장이 표시돼 있다.'],['관람차 모형','색색의 객실과 탑승 광장 동선을 한눈에 볼 수 있다.'],['안내소 층별 표지','1층 도시 안내 · 2층 공연 준비\n3층 파트너 휴게 정원']]},
  tour_nimbasa_hall_2f:{title:'놀이공원 안내소 2층 · 공연 준비실',host:'공연 준비 안내원',greeting:['사람과 포켓몬이 함께 무대에 오르기 전 동작을 맞추는 층입니다.','의상과 조명은 관람용 전시이며 대회나 보상은 운영하지 않습니다.'],objects:[['동행 연습 무대','파트너와 나란히 서서 인사와 회전을 맞춰 보는 낮은 무대다.'],['의상 관리 선반','몸집과 움직임을 방해하지 않도록 나눈 장식과 천이 정리돼 있다.'],['조명 순서표','밖의 조명 분수와 공연 마당을 밝히는 순서가 색으로 표시돼 있다.']]},
  tour_nimbasa_hall_3f:{title:'놀이공원 안내소 3층 · 파트너 휴게 정원',host:'파트너 휴게 도우미',greeting:['공연과 관람을 마친 여행자와 포켓몬이 조용히 쉬는 층입니다.','회복이 필요하면 서쪽 포켓몬센터를 이용해 주세요.'],objects:[['실내 휴게 화단','밝은 조명에 민감한 포켓몬도 쉴 수 있도록 낮은 식물을 심었다.'],['관람차 전망석','창 너머로 관람차와 남쪽 조인애버뉴 방향 불빛이 보인다.'],['동행 기록 수첩','오늘 함께 본 공연과 지나온 도로를 적는 빈 수첩이 놓여 있다.']]},
  tour_nimbasa_home1:{title:'공연가 공동주택 1층 · 의상 손질방',host:'공연가 주민',greeting:['공연을 마치면 사람과 포켓몬의 의상을 함께 정리해요.'],objects:[['의상 손질대','느슨한 끈과 장식을 고치는 작은 도구가 놓여 있다.'],['공연 생활 책장','파트너의 움직임과 휴식 시간을 기록한 책이 꽂혀 있다.']]},
  tour_nimbasa_home1_2f:{title:'공연가 공동주택 2층 · 박자 연습실',host:'공연가 주민',greeting:['큰 소리를 내지 않고 손짓과 발걸음으로 박자를 맞추는 방이에요.'],objects:[['박자 표시판','사람과 포켓몬의 동작 순서를 그림으로 표시했다.'],['낮은 연습 거울','작은 파트너도 자세를 볼 수 있도록 낮게 설치한 거울이다.']]},
  tour_nimbasa_home1_3f:{title:'공연가 공동주택 3층 · 동행 휴게실',host:'공연가 주민',greeting:['연습을 마친 가족과 포켓몬이 함께 쉬는 층이에요.'],objects:[['동행 방석','몸집이 다른 파트너를 위한 방석이 나란히 놓여 있다.'],['공연 사진 선반','관람차 광장과 작은 무대에서 찍은 가족사진이 있다.']]},
  tour_nimbasa_home2:{title:'경기 팬 공동주택 1층 · 응원 준비방',host:'경기 팬 주민',greeting:['경기를 보러 가기 전에 응원 도구와 동료의 상태를 확인해요.'],objects:[['응원 준비대','가벼운 깃발과 물통을 종류별로 나누어 두었다.'],['경기 일정 책장','도시 경기와 휴게원 이용 시간이 적힌 안내책이 있다.']]},
  tour_nimbasa_home2_2f:{title:'경기 팬 공동주택 2층 · 기록 감상실',host:'경기 팬 주민',greeting:['좋아하는 승부를 다시 보며 기술과 움직임을 이야기하는 층이에요.'],objects:[['경기 기록 단말','승패보다 포켓몬의 움직임을 살펴보는 견학 화면이다.'],['응원 사진 선반','가족과 파트너가 경기장에서 찍은 사진이 정리돼 있다.']]},
  tour_nimbasa_home2_3f:{title:'경기 팬 공동주택 3층 · 조용한 휴식방',host:'경기 팬 주민',greeting:['큰 응원 소리에서 벗어나 귀와 몸을 쉬게 하는 방이에요.'],objects:[['차광 휴게석','부드러운 커튼과 낮은 조명이 있는 포켓몬 휴게석이다.'],['상태 확인 수첩','센터에 가기 전 식욕과 걸음걸이를 적어 보는 수첩이다.']]},
  tour_nimbasa_home3:{title:'조명 관리 공동주택 1층 · 장비 정리방',host:'조명 관리 주민',greeting:['거리 불빛을 점검한 뒤 안전 장비를 제자리에 돌려놓아요.'],objects:[['조명 작업대','색유리와 작은 전구, 절연 장갑이 정리돼 있다.'],['도시 배선 지도','관람차에서 남쪽 환영 광장까지 조명 구역을 나눈 지도다.']]},
  tour_nimbasa_home3_2f:{title:'조명 관리 공동주택 2층 · 색 연구실',host:'조명 관리 주민',greeting:['포켓몬이 편안하게 느끼는 밝기와 색을 비교하는 방이에요.'],objects:[['색유리 견본','눈부심이 다른 유리 조각을 차분한 순서로 놓았다.'],['관찰 기록판','빛을 낮췄을 때 파트너가 쉬는 모습을 기록했다.']]},
  tour_nimbasa_home3_3f:{title:'조명 관리 공동주택 3층 · 야경 휴게실',host:'조명 관리 주민',greeting:['도시 불빛을 바라보며 가족과 포켓몬이 하루를 마무리해요.'],objects:[['야경 전망석','동쪽 관람차와 남쪽 조인애버뉴 불빛이 함께 보인다.'],['포켓몬 수면등','아주 약한 빛만 내도록 덮개를 씌운 작은 등이다.']]},
};

const roomIds=()=>['tour_nimbasa_center','tour_nimbasa_mart',...HOME_IDS.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALL_IDS];
const dimensions=(id:string):Point=>id==='tour_nimbasa_center'?{x:28,y:22}:id==='tour_nimbasa_mart'?{x:24,y:20}:id.startsWith('tour_nimbasa_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id==='tour_nimbasa_center'?[{x:4,y:8},{x:20,y:8},{x:4,y:15}]:id==='tour_nimbasa_mart'?[{x:3,y:9},{x:19,y:9},{x:3,y:15}]:id.startsWith('tour_nimbasa_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairs=width-5;
  return map.warps.map(warp=>{const target=floors[warp.to];if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};return target.floor>info.floor?{...warp,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...warp,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});
}
export function installNimbasaInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const [id,role] of Object.entries(ROLES)){const map=maps[id],room=rooms[id];if(!map||!room)continue;room.title=role.title;room.greeting=role.greeting;room.objects.forEach((object,index)=>{const item=role.objects[index];if(item){object.name=item[0];object.pages=[item[1]];}});map.name='뇌문시티 · '+role.title;if(map.npcs[0])map.npcs[0].name=role.host;if(floors[id])floors[id].title=role.title;}
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
  for(const warp of maps.tour_nimbasa.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_nimbasa_'))warp.spawn={...spawn};}
}
