import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_fuchsia_center:{width:28,height:22},tour_fuchsia_hall:{width:28,height:24},
  tour_fuchsia_mart:{width:24,height:20},tour_fuchsia_home1:{width:24,height:18},tour_fuchsia_home2:{width:24,height:18},
};
const f=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_fuchsia_center:[
    f('chart','연분홍 여행·귀환 지도','서쪽18번도로→17→16→무지개, 동쪽 현행 보라 연결, 남쪽 후속19번수로를 서로 다른 선으로 표시했다.',18,5,6,2,'fuchsiaCenterRouteChart'),
    f('bench','습지 여행 동료 휴게석','긴풀과 젖은 길을 걸은 동료가 털과 발을 말리는 넓은 자리다.\n실제 회복은 간호사에게 부탁한다.',18,11,6,2,'fuchsiaCenterCompanionBench'),
    f('console','보호구역 준비 단말','현재 파티·PC와18번도로 출신 동료를 확인하고 관찰 규칙과 회복 준비를 살피는 단말이다.',5,16,7,2,'fuchsiaCenterReserveConsole'),
  ],
  tour_fuchsia_hall:[
    f('model','도시·보호구역 경계 모형','서쪽 관문, 도시 생활로, 관찰 연못, 완충숲과 남부 습지를 높이가 다른 모형으로 나눴다.',17,5,7,3,'fuchsiaHallBoundaryModel'),
    f('plants','연못·숲 서식 표본','연못의 갈대와 완충숲의 낮은 관목을 비교한다.\n생활 포켓몬과 야생 서식 기록을 구분해 적었다.',18,12,6,3,'fuchsiaHallHabitatSamples'),
    f('chart','공개 관찰 예절표','표시된 길에서 거리를 두고 보고 먹이·포획·소음을 임의로 만들지 않는 관찰 원칙이다.',5,17,7,2,'fuchsiaHallObservationRules'),
  ],
  tour_fuchsia_mart:[
    f('shelf','습지 여행 보급 진열','발을 닦는 천과 물통을 기존 여행용품 곁에 전시했다.\n실제 구매는 기존 몬스터볼과 상처약이다.',16,4,5,2,'fuchsiaMartWetlandShelf'),
    f('chart','세 방향 준비표','서쪽18번도로, 동쪽 보라 축약 연결, 남쪽 미개통19번수로의 현재 이용 가능 범위를 표시했다.',16,10,5,2,'fuchsiaMartRouteChart'),
    f('bench','가방·동료 건조석','젖은 가방과 동료의 발을 확인하는 자리다.\n조사만으로 HP나 도구 수량은 바뀌지 않는다.',4,14,7,2,'fuchsiaMartPackingBench'),
  ],
  tour_fuchsia_home1:[
    f('workbench','먹이 그릇 세척대','도시 생활 포켓몬이 쓰는 그릇을 크기별로 나눠 씻고 말린다.',16,4,5,2,'fuchsiaHomeCareWash'),
    f('shelf','관찰 시간 기록책','연못의 빛과 바람, 포켓몬이 모습을 보인 거리를 시간별로 적었다.',16,9,5,2,'fuchsiaHomeObservationBook'),
    f('bench','동료 발 말림자리','젖은 풀을 지난 동료가 발을 말리도록 수건과 낮은 깔개를 놓았다.',5,14,7,1,'fuchsiaHomeCompanionRest'),
  ],
  tour_fuchsia_home2:[
    f('chart','보호숲 순찰표','완충숲 가장자리와 도시 산책로의 쓰레기·울타리 상태를 나눠 확인한다.',16,4,5,2,'fuchsiaHomePatrolChart'),
    f('shelf','도로·수로 기록책','18번도로 귀환과 후속12~15번도로·19번수로의 현재 구현 경계를 따로 적었다.',16,9,5,2,'fuchsiaHomeTravelBook'),
    f('bench','순찰 동료 쉼자리','사람과 동행 포켓몬이 다음 순찰 전 조용히 쉬는 긴 자리다.',5,14,7,1,'fuchsiaHomePatrolRest'),
  ],
};

/** Expand Fuchsia's required rooms while retaining services, room IDs and exterior doors. */
export function installFuchsiaInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_fuchsia_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const outside=map.warps.find(warp=>warp.to==='tour_fuchsia');
    if(outside){const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};}
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_fuchsia.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_fuchsia_hall?.npcs[0])maps.tour_fuchsia_hall.npcs[0].name='보호구역 관찰 안내원';
}
