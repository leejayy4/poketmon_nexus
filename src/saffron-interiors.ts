import type { GameMap,Point } from './types';
import { installSilphRecordsRoom } from './silph-records-room';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_saffron_center:{width:28,height:22},
  tour_saffron_hall:{width:28,height:24},tour_saffron_hall_2f:{width:28,height:24},tour_saffron_hall_3f:{width:28,height:24},
  tour_saffron_mart:{width:24,height:20},
  tour_saffron_home1:{width:24,height:18},tour_saffron_home1_2f:{width:24,height:18},tour_saffron_home1_3f:{width:24,height:18},
  tour_saffron_home2:{width:24,height:18},tour_saffron_home2_2f:{width:24,height:18},tour_saffron_home2_3f:{width:24,height:18},
  tour_saffron_home3:{width:24,height:18},tour_saffron_home3_2f:{width:24,height:18},tour_saffron_home3_3f:{width:24,height:18},
};
const f=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_saffron_center:[
    f('chart','노랑 동서 여행 지도','서쪽7번도로·무지개, 동쪽8번도로·보라, 두 도로 사이 동서 지하통로를 함께 표시했다.',18,5,6,2,'saffronCenterTravelChart'),
    f('bench','도시 통근 동료 휴게석','긴 도로와 열차를 이용한 동료가 사람 곁에서 쉬는 넓은 자리다.\n실제 회복은 간호사에게 부탁하자.',18,11,6,2,'saffronCenterCommuterBench'),
    f('console','파티·PC 준비 단말','동서 도로와 성도행 열차를 이용하기 전에 파티와 박스 동료를 확인하는 단말이다.',5,16,7,2,'saffronCenterPartyConsole'),
  ],
  tour_saffron_hall:[
    f('chart','실프 사옥 공개 층 안내','1층 생활 제품 전시 · 2층 안전 연구 기록\n3층 도시 기술 휴게 전시',17,5,7,3,'saffronSilphFloorGuide'),
    f('machine','포켓몬 생활 장치 전시','사람과 포켓몬이 함께 쓰는 조명·급수·보관 장치의 구조를 공개 전시한다.',18,12,6,3,'saffronSilphLifeDisplay'),
    f('bench','견학 동료 대기석','전시를 보는 동안 동료가 복도에서 안전하게 쉬는 자리다.\n사옥 사건이나 봉쇄 구역의 입구가 아니다.',5,17,7,2,'saffronSilphVisitorBench'),
  ],
  tour_saffron_hall_2f:[
    f('console','장치 안전 시험대','빛·소리·진동이 포켓몬에게 불편하지 않은지 낮은 출력으로 확인하는 공개 시험대다.',17,5,7,3,'saffronSilphSafetyDesk'),
    f('shelf','동료 반응 관찰 기록','체형과 타입이 다른 동료의 반응을 제품 개선에 반영한 기록이다.\n전투 수치나 보상 목록은 아니다.',18,12,6,3,'saffronSilphObservationLog'),
    f('bench','연구원 교대 휴게석','연구원과 동행 포켓몬이 같은 시간에 쉬도록 넓게 비운 자리다.',5,17,7,2,'saffronSilphResearchRest'),
  ],
  tour_saffron_hall_3f:[
    f('machine','도시 생활 기술 모형','센터·주택·역에서 쓰이는 작은 장치를 한눈에 볼 수 있는 도시 모형이다.',17,5,7,3,'saffronSilphCityModel'),
    f('chart','관동·성도 교류 노선도','7번도로·8번도로와 노랑–금빛 열차를 별도 색으로 표시했다.\n자동 이동이나 새 승차 조건은 없다.',18,12,6,3,'saffronSilphTransitChart'),
    f('workbench','견학 기록 수첩','동료와 살펴본 생활 장치와 도시 이동을 적는 공개 수첩이다.\n사건 해결이나 사옥 점거 완료 기록이 아니다.',5,17,7,2,'saffronSilphVisitorLog'),
  ],
  tour_saffron_mart:[
    f('shelf','도시·도로 여행 진열대','통근과 도보 여행에 필요한 소모품을 정리했다.\n실제 구매 품목은 기존 몬스터볼과 상처약이다.',16,4,5,2,'saffronMartTravelShelf'),
    f('chart','7·8번도로 보급표','노랑을 중심으로 서쪽7번과 동쪽8번의 센터 귀환 방향을 표시했다.',16,10,5,2,'saffronMartRouteChart'),
    f('bench','열차 전 가방 점검석','금빛역행 열차를 타기 전에 파티와 가방을 살피는 자리다.\n승차권을 발급하는 곳은 아니다.',4,14,7,2,'saffronMartPackingBench'),
  ],
  tour_saffron_home1:[f('workbench','통근 가방 정리대','사람 가방과 포켓몬용 물통을 나란히 정리한다.',16,4,5,2,'saffronHome1Packing'),f('bench','현관 동료 발닦이 자리','도로에서 돌아온 동료의 발과 털을 살피는 낮은 자리다.',5,14,7,1,'saffronHome1EntryRest')],
  tour_saffron_home1_2f:[f('shelf','무지개·보라 여행 사진책','7번도로의 화단과 8번도로 너머 보라의 꽃을 담은 가족 사진책이다.',16,4,5,2,'saffronHome1Album'),f('bench','가족 독서 소파','사람과 포켓몬이 같은 창을 바라보며 쉬는 소파다.',5,14,7,1,'saffronHome1Reading')],
  tour_saffron_home1_3f:[f('plants','옥상빛 실내 화단','높은 빌딩 사이에서도 포켓몬과 함께 돌볼 수 있는 작은 화단이다.',16,4,5,2,'saffronHome1Garden'),f('bench','도시 전망 방석','동료가 도시 불빛을 편히 바라보도록 넓게 비운 자리다.',5,14,7,1,'saffronHome1View')],
  tour_saffron_home2:[f('chart','공동 급수 관리표','외부 쉼뜰의 포켓몬 물그릇을 씻고 채운 시간을 기록했다.',16,4,5,2,'saffronHome2WaterChart'),f('bench','교대 근무 쉼자리','늦은 근무를 마친 주민과 동료가 조용히 쉬는 자리다.',5,14,7,1,'saffronHome2ShiftRest')],
  tour_saffron_home2_2f:[f('workbench','생활 장치 수선대','조명과 물그릇 받침 같은 작은 생활 도구를 손질한다.',16,4,5,2,'saffronHome2Repair'),f('shelf','안전 사용 설명책','포켓몬 곁에서 장치를 안전하게 쓰는 방법을 모았다.',5,14,7,1,'saffronHome2SafetyBook')],
  tour_saffron_home2_3f:[f('plants','이웃 공동 화분','층마다 맡은 화분과 동료의 발자국 이름표가 함께 놓였다.',16,4,5,2,'saffronHome2Plants'),f('bench','이웃 대화 자리','주민과 포켓몬이 교대 시간을 맞추며 쉬는 자리다.',5,14,7,1,'saffronHome2NeighborRest')],
  tour_saffron_home3:[f('chart','금빛역 왕복 시간표','노랑과 금빛의 무료 왕복 열차 방향을 적은 생활 시간표다.',16,4,5,2,'saffronHome3TrainChart'),f('bench','여행 동료 대기석','열차를 기다리는 가족과 동료가 함께 앉는 낮은 의자다.',5,14,7,1,'saffronHome3TravelRest')],
  tour_saffron_home3_2f:[f('shelf','관동·성도 생활 교류책','두 지방에서 사람과 포켓몬이 함께 일하고 쉬는 모습을 모았다.',16,4,5,2,'saffronHome3CultureBook'),f('workbench','여행 엽서 책상','금빛과 노랑 사이를 오간 가족의 엽서를 정리한다.',5,14,7,1,'saffronHome3Postcard')],
  tour_saffron_home3_3f:[f('plants','열차 창가 화분','열차 진동에도 넘어지지 않는 낮은 화분을 시험해 보는 자리다.',16,4,5,2,'saffronHome3WindowPlants'),f('bench','귀가 동료 휴게석','긴 이동을 마친 동료가 물을 마시고 눕는 방석이 있다.',5,14,7,1,'saffronHome3ReturnRest')],
};

/** Expand Saffron's existing room IDs while retaining doors, stairs and service events. */
export function installSaffronInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_saffron_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const outside=map.warps.find(warp=>warp.to==='tour_saffron');
    if(outside){
      const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
      Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};
    }
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_saffron.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_saffron_hall?.npcs[0])maps.tour_saffron_hall.npcs[0].name='실프 공개 전시 안내원';
  if(maps.tour_saffron_hall_2f?.npcs[0])maps.tour_saffron_hall_2f.npcs[0].name='장치 안전 연구원';
  if(maps.tour_saffron_hall_3f?.npcs[0])maps.tour_saffron_hall_3f.npcs[0].name='도시 기술 안내원';
  installSilphRecordsRoom(maps,rooms,spawns);
}
