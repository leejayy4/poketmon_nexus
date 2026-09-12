import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_lavender_center:{width:28,height:22},
  tour_lavender_hall:{width:28,height:24},
  tour_lavender_hall_2f:{width:28,height:24},
  tour_lavender_hall_3f:{width:28,height:24},
  tour_lavender_mart:{width:24,height:20},
  tour_lavender_home1:{width:24,height:18},
  tour_lavender_home2:{width:24,height:18},
};
const furnishing=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_lavender_center:[
    furnishing('bench','터널 여행 동료 휴게석','돌산터널을 지나온 동료가 밝은 실내에 적응하며 쉬는 자리다.\n마른 수건과 미지근한 물을 준비해 두었다.',18,5,6,2,'lavenderCenterTunnelBench'),
    furnishing('chart','보라타운 여행 안내도','북쪽 10번도로와 돌산터널, 서쪽 노랑 방향, 남쪽 연분홍 방향을 구분했다.\n회복 뒤에는 실제 외부 표지를 따라가자.',18,11,6,2,'lavenderCenterRouteChart'),
    furnishing('plants','향이 약한 추모 꽃','포켓몬이 편히 쉬도록 향이 강하지 않은 꽃만 작은 화분에 두었다.\n외부 공동 정원에서 주민들이 함께 돌본다.',5,16,6,2,'lavenderCenterQuietFlowers'),
  ],
  tour_lavender_hall:[
    furnishing('memorial','동행의 기억 명패','사람과 포켓몬이 함께 지낸 시간을 짧은 글과 그림으로 남긴 명패다.\n누구의 이야기도 사건 해결 기록으로 바꾸지 않는다.',17,5,7,3,'lavenderTowerMemoryPlaques'),
    furnishing('plants','마을 공동 추모 꽃','밖의 꽃정원에서 손질한 꽃을 주민과 포켓몬이 함께 가져다 놓았다.\n꽃을 바꾸는 순서가 조용히 적혀 있다.',18,12,6,3,'lavenderTowerSharedFlowers'),
    furnishing('chart','추모탑 층별 안내','1층 동행의 기억 · 2층 돌봄 기록\n3층 조용한 휴식과 마을 전망',5,17,7,2,'lavenderTowerFloorGuide'),
  ],
  tour_lavender_hall_2f:[
    furnishing('shelf','포켓몬 돌봄 기록장','아팠던 동료를 돌본 시간과 좋아하던 먹이, 함께 걸은 장소를 기록했다.\n야생 조우나 포획 목록은 아니다.',17,5,7,3,'lavenderTowerCareRecords'),
    furnishing('workbench','꽃과 편지 정리대','접은 편지와 마른 꽃을 상하지 않게 정리하는 낮은 작업대다.\n날카로운 도구는 덮개 안에 넣어 두었다.',18,12,6,3,'lavenderTowerLetterTable'),
    furnishing('bench','동료와 머무는 조용한 자리','사람 의자 옆에 포켓몬용 방석을 놓고 통로를 넓게 비웠다.\n서로 말하지 않아도 잠시 함께 있을 수 있다.',5,17,7,2,'lavenderTowerCompanionSeat'),
  ],
  tour_lavender_hall_3f:[
    furnishing('bell','바람을 알리는 작은 종','창으로 들어온 바람이 아주 약하게 종을 흔든다.\n특정 유령이나 사건의 신호로 쓰는 종은 아니다.',17,5,7,3,'lavenderTowerWindBell'),
    furnishing('bench','보라타운 전망 휴게석','외부 추모 꽃정원과 10번도로에서 내려오는 길을 함께 볼 수 있다.\n동료가 몸을 돌릴 자리도 비워 두었다.',18,12,6,3,'lavenderTowerViewSeat'),
    furnishing('workbench','방문 기록 수첩','오늘 함께 온 동료와 바라본 풍경을 자유롭게 적는 수첩이다.\n보상이나 통행 조건을 만드는 완료 기록은 아니다.',5,17,7,2,'lavenderTowerVisitorBook'),
  ],
  tour_lavender_mart:[
    furnishing('shelf','동굴 여행용품 진열대','마른 천과 물통, 작은 안전등을 진열했다.\n실제 구매 품목은 기존 몬스터볼과 상처약이다.',16,4,5,2,'lavenderMartTunnelShelf'),
    furnishing('plants','추모 꽃 관리용품','꽃을 오래 돌보는 작은 물뿌리개와 부드러운 끈이 놓여 있다.\n전시용이며 새 구매 품목이나 보상은 아니다.',16,10,5,2,'lavenderMartFlowerShelf'),
    furnishing('bench','동료와 가방을 정리하는 자리','길을 떠나기 전 동료 상태와 몬스터볼·상처약을 살펴보는 낮은 의자다.\n구매는 앞쪽 점원에게 부탁하자.',4,14,7,2,'lavenderMartPackingBench'),
  ],
  tour_lavender_home1:[
    furnishing('workbench','꽃정원 손질 도구대','작은 삽과 천, 포켓몬 발에 맞춘 덮개를 깨끗하게 정리했다.\n주민과 동료가 외부 꽃정원을 함께 돌본다.',16,4,5,2,'lavenderHomeGardenTools'),
    furnishing('shelf','함께 걸은 길의 사진책','10번도로 전망 언덕과 마을 산책길을 사람과 포켓몬이 걷는 사진이 모여 있다.',16,9,5,2,'lavenderHomeWalkAlbum'),
    furnishing('bench','창가 동료 방석','햇빛이 약하게 드는 창가에 사람 의자와 포켓몬 방석을 나란히 놓았다.',5,14,7,1,'lavenderHomeCompanionCushion'),
  ],
  tour_lavender_home2:[
    furnishing('chart','마을 물그릇 돌봄표','공동 쉼뜰의 물을 갈고 그릇을 닦은 시간을 몸집별 그릇 그림과 함께 적었다.',16,4,5,2,'lavenderHomeWaterChart'),
    furnishing('shelf','포켓몬과 이별을 돌보는 책장','함께 지낸 시간을 기억하고 남은 동료를 천천히 돌보는 방법을 다룬 책이 꽂혀 있다.',16,9,5,2,'lavenderHomeMemoryShelf'),
    furnishing('bench','가족과 동료의 낮은 쉼터','주민의 긴 의자 곁에 작은 동료와 큰 동료가 쉴 빈자리를 각각 마련했다.',5,14,7,1,'lavenderHomeFamilyRest'),
  ],
};

/** Expand Lavender's required rooms while retaining old furniture and stair events. */
export function installLavenderInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_lavender_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const outside=map.warps.find(warp=>warp.to==='tour_lavender');
    if(outside){
      const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
      Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};
    }
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_lavender.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_lavender_hall?.npcs[0])maps.tour_lavender_hall.npcs[0].name='추모탑 안내인';
  if(maps.tour_lavender_hall_2f?.npcs[0])maps.tour_lavender_hall_2f.npcs[0].name='돌봄 기록 안내인';
  if(maps.tour_lavender_hall_3f?.npcs[0])maps.tour_lavender_hall_3f.npcs[0].name='조용한 쉼터 안내인';
}
