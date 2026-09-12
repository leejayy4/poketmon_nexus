import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_azalea_center:{width:28,height:22},
  tour_azalea_hall:{width:28,height:24},
  tour_azalea_mart:{width:24,height:20},
  tour_azalea_home1:{width:24,height:18},
  tour_azalea_home2:{width:24,height:18},
};
const furnishing=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_azalea_center:[
    furnishing('bench','숲 여행 동료 휴게석','너도밤나무숲을 지난 동료가 쉬도록\n마른 수건과 낮은 방석을 마련했다.',18,5,6,2,'azaleaCenterForestBench'),
    furnishing('chart','고동 여행 준비 지도','서쪽 너도밤나무숲과 북쪽 도라지 방향을 나눠 표시했다.\n연결동굴에 들어가기 전 회복과 도구를 확인하자.',18,11,6,2,'azaleaCenterRouteChart'),
    furnishing('plants','규토리 묘목 화분','마을 공방에서 돌보는 어린 규토리 나무다.\n열매를 따지 않고 잎 상태만 살펴본다.',5,16,5,2,'azaleaCenterApricornPlant'),
  ],
  tour_azalea_hall:[
    furnishing('workbench','규토리 선별 작업대','색과 단단함이 다른 규토리를 칸마다 나눴다.\n현재는 공방 생활을 관찰하는 전시 작업대다.',17,5,7,3,'azaleaHallSortingDesk'),
    furnishing('shelf','공방 건조 선반','씻은 규토리를 바람이 통하도록 벌려 놓았다.\n완성품 지급이나 제작 기능은 아직 없다.',18,12,6,3,'azaleaHallDryingShelf'),
    furnishing('bench','동료 작업 휴게석','열매를 나른 포켓몬이 쉴 수 있는 낮은 자리다.\n물그릇과 부드러운 솔이 놓여 있다.',5,17,7,2,'azaleaHallPokemonRest'),
  ],
  tour_azalea_mart:[
    furnishing('shelf','숲길 여행용품 진열대','숲과 동굴에 갈 때 챙기는 수건과 작은 등불이다.\n구매 품목은 기존 몬스터볼과 상처약을 따른다.',16,4,5,2,'azaleaMartTrailShelf'),
    furnishing('chart','연결동굴 준비표','회복·몬스터볼·상처약을 확인한 뒤\n33번도로와 연결동굴로 출발하라고 적혀 있다.',16,10,5,2,'azaleaMartCaveChart'),
    furnishing('bench','동료와 짐을 고르는 자리','가방을 내려놓고 동료의 몸 상태를 살핀다.\n구매는 앞쪽 점원에게 부탁하자.',4,14,7,2,'azaleaMartPackingBench'),
  ],
  tour_azalea_home1:[
    furnishing('workbench','규토리 손질 도구대','작은 솔과 천, 열매 크기를 재는 자가 놓여 있다.\n날카로운 도구는 덮개 안에 보관한다.',16,4,5,2,'azaleaHomeApricornTools'),
    furnishing('shelf','공방 생활 기록장','열매를 주운 날과 말린 시간,\n함께 일한 포켓몬의 휴식 시간을 적었다.',16,9,5,2,'azaleaHomeWorkshopLog'),
    furnishing('bench','동료의 낮은 잠자리','작업을 마친 동료가 쉬는 작은 방석이다.\n옆에는 깨끗한 물그릇이 있다.',5,14,7,1,'azaleaHomePokemonBed'),
  ],
  tour_azalea_home2:[
    furnishing('chart','우물 주변 관찰 그림','비 온 뒤 샘터의 물높이와 발자국을 그렸다.\n야돈 구조 사건을 완료했다는 기록은 아니다.',16,4,5,2,'azaleaHomeWellChart'),
    furnishing('shelf','숲과 우물 생태 책장','나무 그늘과 물가에서 쉬는 포켓몬을\n멀리서 관찰하는 방법이 적혀 있다.',16,9,5,2,'azaleaHomeEcologyShelf'),
    furnishing('bench','가족과 동료의 쉼터','사람 의자 옆에 포켓몬용 방석을 놓았다.\n마을을 한 바퀴 돈 뒤 함께 쉬는 자리다.',5,14,7,1,'azaleaHomeFamilyRest'),
  ],
};

/** Expand Azalea's required rooms while retaining the former 16x14 fixtures. */
export function installAzaleaInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_azalea_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
    const outside=map.warps.find(warp=>warp.to==='tour_azalea');
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
    if(outside)Object.assign(outside,entrance);
    spawns[id]={x:entrance.x,y:height-4};
  }
  for(const warp of maps.tour_azalea.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
}
