import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_rage_lake_center:{width:28,height:22},tour_rage_lake_hall:{width:28,height:24},
  tour_rage_lake_mart:{width:24,height:20},tour_rage_lake_home1:{width:24,height:18},
};
const item=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_rage_lake_center:[
    item('bench','43번도로 동료 휴게석','호수와 긴 43번도로를 걸은 동료가 발의 흙과 물기를 털며 쉰다.\n실제 회복은 간호사에게 부탁하자.',18,5,6,2,'rageLakeCenterRouteBench'),
    item('chart','호수 둘레·황토 귀환도','외부 갈대·수위·전망대 순환과 남쪽43번도로·황토마을 귀환을 표시했다.',18,11,6,3,'rageLakeCenterRouteChart'),
    item('workbench','호수 관찰 편성대','현재 파티와 센터 PC의 동료를 확인하는 자리다.\n자동 편성·회복·기술 변경은 일어나지 않는다.',5,16,7,2,'rageLakeCenterPartyTable'),
  ],
  tour_rage_lake_hall:[
    item('chart','호수 생태 기록도','서쪽 갈대, 가운데 수위 표석, 동쪽 전망대와 남쪽 귀환로를 한 장에 표시했다.',17,5,7,3,'rageLakeHallEcologyChart'),
    item('tank','갈대·수위 표본대','갈대 줄기와 둑의 젖은 선을 관찰 기록과 비교한다.\n살아 있는 야생 포켓몬을 전시하는 수조가 아니다.',18,12,6,3,'rageLakeHallReedSample'),
    item('workbench','동료 관찰 수첩대','외부에서 같은 동료와 남긴 갈대·수위·전망 기록을 정리한다.\n특별 조우나 사건 완료 기록은 아니다.',5,17,7,2,'rageLakeHallCompanionLog'),
  ],
  tour_rage_lake_mart:[
    item('shelf','물가 산책 용품대','마른 수건과 갈대에 걸리지 않는 짧은 끈을 전시했다.\n실제 판매품은 기존 몬스터볼과 상처약이다.',16,4,5,2,'rageLakeMartShoreShelf'),
    item('chart','43번도로 귀환표','호수 남쪽에서43번도로를 지나 황토마을 센터로 돌아가는 순서를 적었다.',16,10,5,2,'rageLakeMartRouteChart'),
    item('bench','동료와 가방 점검석','호수 둘레를 걷기 전 파티 상태와 몬스터볼·상처약을 확인한다.',4,14,7,2,'rageLakeMartPackingBench'),
  ],
  tour_rage_lake_home1:[
    item('workbench','갈대 손질 작업대','둑길에 쓰러진 마른 갈대만 모아 생활 바구니를 엮는다.\n보존지의 살아 있는 갈대는 베지 않는다.',16,4,5,2,'rageLakeHomeReedTable'),
    item('shelf','호수 물결 일지','비와 바람에 따라 달라지는 수위와 물결을 날짜별로 적었다.',16,9,5,2,'rageLakeHomeWaterLog'),
    item('bench','주민과 동료의 창가 자리','호수 쪽 창을 바라보며 사람과 포켓몬이 함께 쉬는 낮은 자리다.\n실제 회복 효과는 없다.',5,14,7,1,'rageLakeHomeCompanionSeat'),
  ],
};

/** Resize the lake stop's required rooms while preserving service and return contracts. */
export function installRageLakeInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#')),props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id==='tour_rage_lake_mart'?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const outside=map.warps.find(w=>w.to==='tour_rage_lake');if(outside){const entrance={x:Math.floor(width/2),y:height-1};rows[height-1][entrance.x]='.';rows[height-2][entrance.x]='.';Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};}
    for(const warp of map.warps){rows[warp.y][warp.x]='.';if(warp.y+1<height-1)rows[warp.y+1][warp.x]='.';}
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  }
  for(const warp of maps.tour_rage_lake.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_rage_lake_hall?.npcs[0])maps.tour_rage_lake_hall.npcs[0].name='호수 생태 기록원';
}
