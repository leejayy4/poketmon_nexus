import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_celadon_center:{width:28,height:22},
  tour_celadon_hall:{width:28,height:24},tour_celadon_hall_2f:{width:28,height:24},tour_celadon_hall_3f:{width:28,height:24},
  tour_celadon_mart:{width:24,height:20},
  tour_celadon_home1:{width:24,height:18},tour_celadon_home2:{width:24,height:18},
};
const f=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_celadon_center:[
    f('chart','무지개 여행 준비 지도','동쪽7번도로·노랑, 남쪽16→17→18번도로·연분홍, 서쪽 번호 없는 상록 연결을 서로 다른 색으로 표시했다.',18,5,6,2,'celadonCenterRouteChart'),
    f('bench','정원 여행 동료 휴게석','풀밭과 상업 거리를 걸은 동료가 사람 곁에서 발과 털을 쉬는 넓은 자리다.\n실제 회복은 간호사에게 부탁한다.',18,11,6,2,'celadonCenterCompanionBench'),
    f('console','파티·기술 준비 단말','백화점과 도로의 선택 실전에 앞서 파티·PC 동료와 현재 기술을 살펴보는 단말이다.',5,16,7,2,'celadonCenterPartyConsole'),
  ],
  tour_celadon_hall:[
    f('chart','백화점 층별 안내','1층 여행 보급 전시 · 2층 기술과 동료 역할 비교\n3층 정원 연구·지방 연락 휴게층',17,5,7,3,'celadonDepartmentFloorGuide'),
    f('shelf','도로 여행 상품 전시','몬스터볼·상처약과 가방 정리 예시를 전시한다.\n실제 구매는 프렌들리숍 점원에게 부탁한다.',18,12,6,3,'celadonDepartmentTravelDisplay'),
    f('bench','쇼핑 동료 대기석','사람이 진열대를 보는 동안 몸집이 다른 포켓몬이 통로를 막지 않고 쉴 수 있는 자리다.',5,17,7,2,'celadonDepartmentCompanionSeat'),
  ],
  tour_celadon_hall_2f:[
    f('machine','기술 역할 비교대','현재 동료의 기술을 공격·지원·교대 준비 역할로 나누어 살펴보는 공개 단말이다.',17,5,7,3,'celadonDepartmentMoveDesk'),
    f('shelf','7번도로 실전 진열장','나옹과 구구처럼 움직임이 다른 상대를 만났을 때 기술과 교대 순서를 비교하는 전시다.',18,12,6,3,'celadonDepartmentRoute7Case'),
    f('bench','동료 장비 점검석','가방과 동료 상태를 함께 확인하는 낮은 자리다.\n조사만으로 기술·능력·도구가 바뀌지 않는다.',5,17,7,2,'celadonDepartmentTrainingBench'),
  ],
  tour_celadon_hall_3f:[
    f('plants','도시 화단 표본대','향기정원·꽃집 재배원·7번도로 가장자리에서 기록한 잎과 흙 상태를 비교한다.',17,5,7,3,'celadonDepartmentGardenSamples'),
    f('console','무지개 연구 연락대','신오의 하린과 관동 연구진이 포켓몬의 휴식과 장치 기록을 비교할 연락 자리다.\n현재는 공개 연락 준비 공간이며 본편 사건 완료 기록이 아니다.',18,12,6,3,'celadonDepartmentResearchLink'),
    f('bench','정원 전망 휴게석','도시 화단과 남쪽 여행 준비뜰을 바라보며 사람과 포켓몬이 함께 쉬는 창가 자리다.',5,17,7,2,'celadonDepartmentGardenLounge'),
  ],
  tour_celadon_mart:[
    f('shelf','정원·도로 여행 진열대','꽃가루를 닦는 천과 물통을 기존 여행용품 곁에 진열했다.\n실제 구매 품목은 기존 몬스터볼과 상처약이다.',16,4,5,2,'celadonMartGardenShelf'),
    f('chart','세 방향 보급표','동쪽7번도로, 남쪽16→17→18번도로, 서쪽 창작 연결의 가장 가까운 회복점을 표시했다.',16,10,5,2,'celadonMartRouteChart'),
    f('bench','가방·동료 점검석','구매 뒤 몬스터볼·상처약과 파티 상태를 함께 확인하는 자리다.',4,14,7,2,'celadonMartPackingBench'),
  ],
  tour_celadon_home1:[
    f('workbench','꽃집 모종 기록대','도시 화단별 물·빛·흙 기록과 작은 모종 이름표를 정리한다.',16,4,5,2,'celadonHomeNurseryLog'),
    f('shelf','정원 동행 사진책','주민과 포켓몬이 향기정원과 꽃집 재배원을 함께 돌보는 사진을 모았다.',16,9,5,2,'celadonHomeGardenAlbum'),
    f('bench','현관 발닦이 자리','정원 흙을 묻힌 동료가 털과 발을 정리하도록 부드러운 천을 놓았다.',5,14,7,1,'celadonHomeEntryRest'),
  ],
  tour_celadon_home2:[
    f('chart','백화점 가족 장보기표','사람용 물건과 포켓몬 돌봄 물품을 층과 진열대별로 나누어 적었다.',16,4,5,2,'celadonHomeShoppingChart'),
    f('shelf','도시·도로 생활책','7번도로 통근과 남쪽 긴 여행 뒤 동료를 쉬게 하는 생활 기록이 꽂혀 있다.',16,9,5,2,'celadonHomeTravelBook'),
    f('bench','가족과 동료의 쉼자리','긴 의자 옆에 작은 동료와 큰 동료가 몸을 돌릴 빈자리를 각각 마련했다.',5,14,7,1,'celadonHomeFamilyRest'),
  ],
};

/** Expand Celadon's required rooms while retaining old furniture, services and stair events. */
export function installCeladonInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_celadon_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const outside=map.warps.find(warp=>warp.to==='tour_celadon');
    if(outside){
      const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
      Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};
    }
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_celadon.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_celadon_hall?.npcs[0])maps.tour_celadon_hall.npcs[0].name='백화점 여행 보급 안내원';
  if(maps.tour_celadon_hall_2f?.npcs[0])maps.tour_celadon_hall_2f.npcs[0].name='기술 역할 안내원';
  if(maps.tour_celadon_hall_3f?.npcs[0])maps.tour_celadon_hall_3f.npcs[0].name='정원 연구 연락원';
}
