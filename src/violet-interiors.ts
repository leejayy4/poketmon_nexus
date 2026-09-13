import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_violet_center:{width:28,height:22},
  tour_violet_hall:{width:28,height:24},
  tour_violet_hall_2f:{width:28,height:24},
  tour_violet_hall_3f:{width:28,height:24},
  tour_violet_mart:{width:24,height:20},
  tour_violet_home1:{width:24,height:18},
  tour_violet_home2:{width:24,height:18},
};
const furnishing=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_violet_center:[
    furnishing('bench','32번도로 동료 휴게석','긴 물가길과 연결동굴을 지나온 동료가 몸을 말리는 자리다.\n실제 회복은 앞쪽 간호사에게 부탁하자.',18,5,6,2,'violetCenterRouteBench'),
    furnishing('chart','도라지 여행 방향도','북쪽32번도로·연결동굴·고동과 남쪽 현행 금빛 연결을 나눠 표시했다.\n도시 안에서는 모다피의 탑과 상점을 따로 찾을 수 있다.',18,11,6,2,'violetCenterRouteChart'),
    furnishing('plants','새 포켓몬 낮은 쉼뜰','작은 발로 디딜 수 있는 나뭇가지와 얕은 물그릇을 두었다.\n야생 조우나 포획을 시작하는 장소는 아니다.',5,16,6,2,'violetCenterBirdRest'),
  ],
  tour_violet_hall:[
    furnishing('altar','흔들리는 나무 기둥 받침','높은 기둥이 천천히 흔들려도 바닥의 넓은 받침은 자리를 지킨다.\n표시선 밖에서 움직임을 관찰하자.',17,5,7,3,'violetTowerPillar'),
    furnishing('chart','모다피의 탑 층별 안내','1층 기둥 관찰 · 2층 균형 수련\n3층 호흡과 도시 전망',18,12,6,3,'violetTowerFloorGuide'),
    furnishing('bench','첫걸음 수련 자리','기둥의 움직임을 보며 발을 천천히 옮기는 넓은 마루다.\n체육관 도전이나 배지 조건과는 별개다.',5,17,7,2,'violetTowerFirstStep'),
  ],
  tour_violet_hall_2f:[
    furnishing('altar','균형 수련 기둥','가느다란 나무 기둥과 바닥의 발 모양 표식이 한 줄로 놓였다.\n서두르지 않고 중심을 옮기는 수련용이다.',17,5,7,3,'violetTowerBalancePillar'),
    furnishing('shelf','수련생 관찰 기록','흔들림을 버틴 시간이 아니라 자세를 고쳐 잡은 방법을 기록했다.\n승패나 보상 목록은 아니다.',18,12,6,3,'violetTowerTrainingLog'),
    furnishing('bench','동료와 쉬는 마루','사람의 방석 옆에 작은 포켓몬이 앉을 빈자리를 남겼다.\nHP를 회복하는 시설은 아니다.',5,17,7,2,'violetTowerCompanionMat'),
  ],
  tour_violet_hall_3f:[
    furnishing('bell','바람 호흡 종','창으로 들어오는 바람이 약한 종을 울려 들숨과 날숨의 길이를 알려 준다.\n사건이나 특별한 만남의 신호는 아니다.',17,5,7,3,'violetTowerBreathingBell'),
    furnishing('bench','도라지 전망 자리','도시 지붕과 북쪽32번도로 들머리, 남쪽 길을 차례로 바라볼 수 있다.\n동료가 몸을 돌릴 자리도 비워 두었다.',18,12,6,3,'violetTowerViewSeat'),
    furnishing('workbench','탑 여행 수첩','함께 온 동료와 지나온 숲·동굴·물가길을 적는 수첩이다.\n완료 보상이나 진행 조건은 만들지 않는다.',5,17,7,2,'violetTowerJourneyBook'),
  ],
  tour_violet_mart:[
    furnishing('shelf','탑 수련 준비 진열대','미끄럽지 않은 천과 작은 물통을 진열했다.\n실제 구매 품목은 기존 몬스터볼과 상처약이다.',16,4,5,2,'violetMartTowerShelf'),
    furnishing('chart','성도 남부 여행 준비표','32번도로·연결동굴·33번도로의 거리와 회복 지점을 표시했다.\n낚시나 수상 이동을 약속하는 표가 아니다.',16,10,5,2,'violetMartSouthChart'),
    furnishing('bench','동료와 가방 점검석','긴 길을 떠나기 전 파티 상태와 몬스터볼·상처약을 살피는 자리다.\n구매는 앞쪽 점원에게 부탁하자.',4,14,7,2,'violetMartPackingBench'),
  ],
  tour_violet_home1:[
    furnishing('workbench','탑 마루 손질 도구대','나무 마루를 닦는 천과 부드러운 솔을 크기별로 걸어 두었다.',16,4,5,2,'violetHomeFloorTools'),
    furnishing('shelf','수련과 생활 사진책','탑 수련생이 끝난 뒤 주민과 포켓몬이 마루를 정리하는 사진이 모여 있다.',16,9,5,2,'violetHomeTrainingAlbum'),
    furnishing('bench','작은 새 포켓몬 횃대','창가의 낮은 횃대 아래에 깃털과 먹이 그릇을 두었다.\n마을에서 돌보는 생활 자리다.',5,14,7,1,'violetHomeBirdPerch'),
  ],
  tour_violet_home2:[
    furnishing('chart','물그릇 돌봄표','동쪽 쉼숲의 물그릇을 씻고 채운 시간을 작은 발자국 그림과 함께 적었다.',16,4,5,2,'violetHomeWaterChart'),
    furnishing('shelf','32번도로 여행 기록','절벽·물가·연결동굴을 지나온 여행자와 동료의 돌봄 방법을 기록했다.',16,9,5,2,'violetHomeRouteJournal'),
    furnishing('bench','가족과 동료의 쉼자리','사람 의자와 포켓몬 방석이 같은 창을 바라보도록 놓였다.',5,14,7,1,'violetHomeFamilyRest'),
  ],
};

/** Expand Violet's required rooms while retaining former fixtures and stair IDs. */
export function installVioletInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_violet_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const outside=map.warps.find(warp=>warp.to==='tour_violet');
    if(outside){
      const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
      Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};
    }
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_violet.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_violet_hall?.npcs[0])maps.tour_violet_hall.npcs[0].name='모다피의 탑 안내인';
  if(maps.tour_violet_hall_2f?.npcs[0])maps.tour_violet_hall_2f.npcs[0].name='균형 수련 안내인';
  if(maps.tour_violet_hall_3f?.npcs[0])maps.tour_violet_hall_3f.npcs[0].name='호흡 수련 안내인';
  maps.tour_violet_hall_2f?.npcs.push({id:'violetTowerTrainer',name:'모다피의 탑 수련생',sprite:'ace_trainer_f',x:10,y:15,facing:'right',dialogue:'violetTowerTrainer'});
}
