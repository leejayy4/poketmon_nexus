import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_ecruteak_center:{width:28,height:22},
  tour_ecruteak_hall:{width:28,height:24},
  tour_ecruteak_hall_2f:{width:28,height:24},
  tour_ecruteak_hall_3f:{width:28,height:24},
  tour_ecruteak_mart:{width:24,height:20},
  tour_ecruteak_home1:{width:24,height:18},
  tour_ecruteak_home2:{width:24,height:18},
};
const furnishing=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_ecruteak_center:[
    furnishing('bench','37번도로 동료 휴게석','자연공원과 36·37번도로를 지나온 동료가 단풍잎과 흙을 털고 쉬는 자리다.\n실제 회복은 간호사에게 부탁하자.',18,5,6,2,'ecruteakCenterRouteBench'),
    furnishing('chart','인주 여행 방향도','남쪽37번도로·36번 갈림길, 서쪽 담청 방향, 동쪽 황토 방향을 구분했다.\n현재 연결과 후속 번호 도로는 따로 표시한다.',18,11,6,2,'ecruteakCenterRouteChart'),
    furnishing('plants','전승 거리 동료 쉼뜰','향이 약한 풀과 낮은 물그릇을 두어 탑을 찾은 동료가 조용히 쉰다.\n야생 조우나 포획 장소는 아니다.',5,16,6,2,'ecruteakCenterCompanionGarden'),
  ],
  tour_ecruteak_hall:[
    furnishing('bell','방울 소리 비교대','크기가 다른 방울과 끈을 나란히 두어 울림의 길이를 비교한다.\n특별한 포켓몬을 부르는 장치는 아니다.',17,5,7,3,'ecruteakTowerBellTable'),
    furnishing('chart','방울탑 층별 안내','1층 전승 안내 · 2층 목조 보존\n3층 도시 전망과 여행 기록',18,12,6,3,'ecruteakTowerFloorGuide'),
    furnishing('bench','방문 동료 대기 마루','사람의 방석 옆에 포켓몬이 몸을 돌릴 넓은 자리를 비웠다.\n회복과 능력 변화는 일어나지 않는다.',5,17,7,2,'ecruteakTowerWaitingFloor'),
  ],
  tour_ecruteak_hall_2f:[
    furnishing('workbench','서명본·생활 원본 공개대','사업 설명과 주민이 남긴 원래 말을 함께 보관하는 자리다.',18,17,6,2,'ecruteakDisclosureOriginals'),
    furnishing('workbench','목조 짜임 보존대','못을 박지 않고 홈과 받침을 맞추는 목조 짜임 표본을 살핀다.\n전시 표본을 직접 해체하지 않는다.',17,5,7,3,'ecruteakTowerJoineryTable'),
    furnishing('shelf','탑 수리 기록장','기둥의 갈라짐과 지붕 받침을 손질한 날짜를 층별로 적었다.\n전설 사건이나 봉인 기록은 아니다.',18,12,6,3,'ecruteakTowerRepairLog'),
    furnishing('bench','목재 향 동료 쉼자리','새 목재와 오래된 목재의 향을 맡으며 동료와 잠시 쉬는 마루다.\n실제 회복은 센터에서 한다.',5,17,7,2,'ecruteakTowerWoodRest'),
  ],
  tour_ecruteak_hall_3f:[
    furnishing('bell','바람 방향 풍경','서쪽 목초지와 동쪽 산길에서 들어오는 바람에 따라 작은 풍경이 다르게 흔들린다.\n전설 등장 신호로 사용하지 않는다.',17,5,7,3,'ecruteakTowerWindBell'),
    furnishing('bench','인주 세 갈래 전망석','남쪽37번도로, 서쪽 담청 방향, 동쪽 황토 방향의 지붕과 숲을 차례로 볼 수 있다.',18,12,6,3,'ecruteakTowerViewSeat'),
    furnishing('workbench','전승 거리 여행 수첩','함께 온 동료와 걸어온 공원·도로·목조 거리를 자유롭게 기록한다.\n완료 보상이나 통행 조건은 없다.',5,17,7,2,'ecruteakTowerJourneyBook'),
  ],
  tour_ecruteak_mart:[
    furnishing('shelf','목조 거리 여행용품대','단풍잎과 흙을 털 천, 작은 물통을 진열했다.\n실제 구매 품목은 기존 몬스터볼과 상처약이다.',16,4,5,2,'ecruteakMartTravelShelf'),
    furnishing('chart','세 방향 출발 준비표','남쪽37번도로, 서쪽38·39번도로, 동쪽42번도로의 현재/후속 경계를 구분했다.',16,10,5,2,'ecruteakMartRouteChart'),
    furnishing('bench','동료와 가방 점검석','출발 전 파티 상태와 몬스터볼·상처약을 확인하는 자리다.\n구매는 앞쪽 점원에게 부탁하자.',4,14,7,2,'ecruteakMartPackingBench'),
  ],
  tour_ecruteak_home1:[
    furnishing('workbench','목조 담장 손질대','부드러운 솔과 천으로 목재 틈의 먼지를 털고 갈라진 부분을 기록한다.',16,4,5,2,'ecruteakHomeWoodTools'),
    furnishing('shelf','전승 거리 사진책','주민과 포켓몬이 돌등 사이를 걸으며 탑과 목조 집을 돌보는 사진이 모여 있다.',16,9,5,2,'ecruteakHomeStreetAlbum'),
    furnishing('bench','가족과 동료의 낮은 자리','사람 의자와 포켓몬 방석이 목조 창을 함께 바라보도록 놓였다.',5,14,7,1,'ecruteakHomeCompanionSeat'),
  ],
  tour_ecruteak_home2:[
    furnishing('chart','단풍정원 돌봄표','남문 단풍정원의 물 주기와 떨어진 잎을 모은 시간을 주민과 동료별로 적었다.',16,4,5,2,'ecruteakHomeGardenChart'),
    furnishing('shelf','불탄탑 보존 기록','외부 보존선 안쪽의 기와와 돌기단을 건드리지 않고 관찰한 기록이다.\n내부 사건 해결 기록은 아니다.',16,9,5,2,'ecruteakHomeBurnedRecord'),
    furnishing('bench','산길 여행 동료 쉼자리','동쪽 산길이나 서쪽 목초지로 떠나기 전 사람과 동료가 함께 쉬는 자리다.',5,14,7,1,'ecruteakHomeTravelRest'),
  ],
};

/** Expand Ecruteak's required rooms while preserving existing events and stair contracts. */
export function installEcruteakInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_ecruteak_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const outside=map.warps.find(warp=>warp.to==='tour_ecruteak');
    if(outside){
      const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
      Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};
    }
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_ecruteak.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_ecruteak_hall?.npcs[0])maps.tour_ecruteak_hall.npcs[0].name='방울탑 전승 안내인';
  if(maps.tour_ecruteak_hall_2f?.npcs[0])maps.tour_ecruteak_hall_2f.npcs[0].name='목조 보존 안내인';
  if(maps.tour_ecruteak_hall_3f?.npcs[0])maps.tour_ecruteak_hall_3f.npcs[0].name='전망 기록 안내인';
  maps.tour_ecruteak_hall_2f?.npcs.push({id:'ecruteakDisclosureIan',name:'이안',sprite:'scientist_m',x:21,y:20,facing:'up',dialogue:'ecruteakDisclosureIan'});
  maps.tour_ecruteak_hall?.npcs.push({id:'ecruteakDisclosureResident',name:'전승시설을 돌보는 주민',sprite:'old_man',x:21,y:20,facing:'left',dialogue:'ecruteakDisclosureResident'});
  maps.tour_ecruteak_hall_3f?.npcs.push({id:'ecruteakDisclosureEugene',name:'유진',sprite:'ace_trainer_m',x:21,y:20,facing:'left',dialogue:'ecruteakDisclosureEugene'});
}
