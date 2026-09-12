import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_hearthome_center:{width:28,height:22},tour_hearthome_hall:{width:28,height:24},
  tour_hearthome_mart:{width:24,height:20},tour_hearthome_home2:{width:24,height:18},
};
const item=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_hearthome_center:[
    item('bench','공연 동료 대기석','무대 연습을 마친 동료가 쉬는 긴 의자다.\n물과 부드러운 수건이 준비되어 있다.',18,5,6,2,'hearthomeCenterStageBench'),
    item('chart','연고 여행 안내도','208번도로와 공연 거리·체육관을 표시했다.\n출발 전에 동료의 상태를 확인하자.',18,11,6,2,'hearthomeCenterGuide'),
    item('plants','휴식실 꽃장식','향이 강하지 않은 꽃을 골라 놓았다.\n포켓몬이 편히 쉬도록 작은 화분만 쓴다.',4,16,6,2,'hearthomeCenterFlowers'),
  ],
  tour_hearthome_hall:[
    item('stage','동료 연습 무대','큰 대회 전 일상의 걸음과 인사를 맞춘다.\n무대 가장자리에 안전선이 그려져 있다.',17,5,7,3,'hearthomePracticeStage'),
    item('workbench','리본 손질대','동료의 몸을 조이지 않도록 장식을 맞춘다.\n부드러운 천과 빗이 놓여 있다.',18,12,5,3,'hearthomeRibbonTable'),
    item('bench','연습 뒤 휴게석','동료와 나란히 앉아 무대를 돌아보는 자리다.\n다음 연습 순서를 적은 수첩이 있다.',5,17,7,2,'hearthomeHallRest'),
  ],
  tour_hearthome_mart:[
    item('shelf','공연 산책용품 진열대','부드러운 수건과 장식 보관함이 놓였다.\n전시품이며 구매 품목은 앞 점원에게 묻자.',16,4,5,2,'hearthomeMartStageShelf'),
    item('plants','계절 꽃 표본','공연 거리의 꽃을 계절별로 소개한다.\n꽃가루가 날리지 않게 덮개를 씌웠다.',16,10,4,3,'hearthomeMartFlowers'),
    item('bench','여행 가방 정리석','산길에서 내려온 짐을 잠시 펼칠 수 있다.\n몬스터볼과 상처약 수를 확인해 보자.',4,14,6,2,'hearthomeMartBench'),
  ],
  tour_hearthome_home2:[
    item('workbench','공연 의상 수선대','동료의 움직임을 막지 않게 천을 다듬는다.\n바늘과 리본은 작은 상자에 넣어 두었다.',16,4,5,2,'hearthomeHomeCostume'),
    item('shelf','연습 기록 책장','주민과 동료가 함께 연습한 수첩이 꽂혀 있다.\n승패보다 호흡을 맞춘 기록이 많다.',16,9,5,2,'hearthomeHomeRecords'),
    item('bench','동료의 휴식 방석','창가의 낮은 의자 옆에 방석을 놓았다.\n산책과 연습을 마친 동료의 자리다.',5,14,7,1,'hearthomeHomeBed'),
  ],
};

export function installHearthomeInteriorSizes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_hearthome_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
    const outside=map.warps.find(warp=>warp.to==='tour_hearthome');
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
    if(outside)Object.assign(outside,entrance);
    spawns[id]={x:entrance.x,y:height-4};
    if(id==='tour_hearthome_hall')map.npcs[0].name='콘테스트 연습 안내원';
  }
  const city=maps.tour_hearthome;
  for(const warp of city.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
}
