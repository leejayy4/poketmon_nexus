import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_eterna_center:{width:28,height:22},
  tour_eterna_hall:{width:28,height:24},
  tour_eterna_mart:{width:24,height:20},
  tour_eterna_home2:{width:24,height:18},
};

const furnishing=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>
  ({kind,name,pages:[text],x,y,w,h,event});

const additions:Record<string,Furnishing[]>={
  tour_eterna_center:[
    furnishing('bench','숲길 여행자 대기석','흙이 묻은 가방을 둘 자리가 있다.\n숲에서 온 동료와 함께 쉬는 의자다.',18,5,6,2,'eternaCenterBench'),
    furnishing('plants','회복실 이끼 화단','영원숲의 습도에 맞춘 이끼 화단이다.\n센터 안에서도 숲 향기가 희미하게 난다.',18,11,5,3,'eternaCenterMoss'),
    furnishing('chart','영원 주변 회복 안내','영원숲과 천관산 방면 귀환길을 표시했다.\n다치면 이 센터로 돌아와 쉬자.',4,16,6,2,'eternaCenterGuide'),
  ],
  tour_eterna_hall:[
    furnishing('model','옛 영원 거리 모형','석상과 숲 경계 사이의 옛길을 재현했다.\n지금의 남쪽 산책로는 아직 그려져 있지 않다.',17,5,7,3,'eternaHallModel'),
    furnishing('plants','숲 경계 이끼 표본','돌담과 고목 뿌리에서 옮긴 이끼다.\n채집 위치와 날짜가 작은 표찰에 적혀 있다.',18,12,5,3,'eternaHallMoss'),
    furnishing('bench','답사 수첩 정리석','동료와 걸은 길을 천천히 정리하는 자리다.\n창밖으로 광장의 석상 쪽이 보인다.',5,17,7,2,'eternaHallBench'),
  ],
  tour_eterna_mart:[
    furnishing('shelf','숲길 방수용품 진열대','비와 이슬을 막는 덮개와 작은 수건이다.\n답사 장비 전시품이라 구매할 수는 없다.',16,4,5,2,'eternaMartTrailShelf'),
    furnishing('plants','묘목 관리 화분','남쪽 묘목밭에서 돌보는 어린 나무다.\n잎 상태를 적은 쪽지가 매달려 있다.',16,10,4,3,'eternaMartSapling'),
    furnishing('bench','동료와 짐을 고르는 자리','가방을 내려놓고 소지품을 정리할 수 있다.\n구매는 앞쪽 점원에게 부탁하자.',4,14,6,2,'eternaMartBench'),
  ],
  tour_eterna_home2:[
    furnishing('workbench','묘목 기록 작업대','나무마다 물을 준 날과 새잎 수를 적었다.\n옆에는 작은 삽과 부드러운 끈이 있다.',16,4,5,2,'eternaHomeSaplingDesk'),
    furnishing('shelf','숲지기의 생활 책장','숲길 정비와 포켓몬 돌봄 기록이 꽂혀 있다.\n비 오는 날의 발자국 그림도 보인다.',16,9,5,2,'eternaHomeForestShelf'),
    furnishing('bench','동료의 낮은 잠자리','창가에 포켓몬용 방석을 나란히 놓았다.\n묘목밭 일을 마친 동료가 쉬는 자리다.',5,14,7,1,'eternaHomePokemonBed'),
  ],
};

/** Expand Eterna's required rooms without invalidating valid coordinates in the former 16x14 rooms. */
export function installEternaInteriorSizes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_eterna_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
    const outside=map.warps.find(warp=>warp.to==='tour_eterna');
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
    if(outside)Object.assign(outside,entrance);
    spawns[id]={x:entrance.x,y:height-4};
  }
  const city=maps.tour_eterna;
  for(const warp of city.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
}
