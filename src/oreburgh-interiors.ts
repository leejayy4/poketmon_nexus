import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';
import type { GameMap,Point } from './types';

const sizes:Record<string,{width:number;height:number}>={
  tour_oreburgh_center:{width:28,height:22},
  tour_oreburgh_hall:{width:28,height:24},
  tour_oreburgh_mart:{width:24,height:20},
  tour_oreburgh_home2:{width:24,height:18},
};
const furnishing=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_oreburgh_center:[
    furnishing('bench','탄갱 교대 대기석','작업을 마친 광부와 포켓몬이 함께 쉬는 긴 의자다.',17,5,7,2,'oreburghCenterShiftBench'),
    furnishing('chart','무쇠 회복 동선표','서쪽 무쇠게이트·북쪽 207번도로·남쪽 탄갱에서 돌아오는 길과 센터 위치가 표시돼 있다.',17,11,7,3,'oreburghCenterRouteChart'),
    furnishing('plants','환기구 곁 공기 화분','잎의 흔들림으로 센터 안 공기 흐름을 살피는 화분이다.',5,16,6,2,'oreburghCenterVentPlant'),
  ],
  tour_oreburgh_hall:[
    furnishing('model','무쇠시티 지하 단면 모형','도시 아래 탄층과 남쪽 탄갱, 지상 환기구의 위치를 한눈에 보여 준다.',17,5,7,4,'tourExhibitCitySection'),
    furnishing('machine','자동 운반 설비 모형','포켓몬의 생활 구역을 피해 석탄을 옮기는 자동 운반선을 재현했다.',17,12,7,3,'tourExhibitAutomation'),
    furnishing('bench','동료와 보는 광석 탁자','게이트와 탄갱에서 본 돌의 색·결·소리를 비교해 기록하는 자리다.',5,18,8,2,'tourExhibitPartnerTable'),
  ],
  tour_oreburgh_mart:[
    furnishing('shelf','동굴 여행용품 진열대','먼지를 닦는 수건과 안전등 모형이다. 현재 판매품은 계산대의 공통 도구다.',16,4,5,2,'oreburghMartCaveShelf'),
    furnishing('chart','세 갈래 보급표','서쪽 무쇠게이트, 북쪽 207번도로, 남쪽 탄갱으로 나가기 전 회복과 도구를 확인한다.',16,10,5,3,'oreburghMartRouteChart'),
    furnishing('bench','동료 짐 정리석','가방과 몬스터볼을 다시 챙기며 동료가 쉬는 낮은 자리다.',4,15,7,2,'oreburghMartPackingBench'),
  ],
  tour_oreburgh_home2:[
    furnishing('workbench','광부의 교대표','사람과 포켓몬이 번갈아 쉬도록 탄갱 작업 시간이 적혀 있다.',16,4,5,2,'oreburghHomeShiftDesk'),
    furnishing('shelf','암석과 포켓몬 생활책','광맥을 찾을 때 야생 포켓몬의 서식지를 해치지 않는 방법을 정리했다.',16,9,5,2,'oreburghHomeHabitatShelf'),
    furnishing('bench','작업 동료의 방석','검은 먼지를 털고 쉬는 포켓몬용 두꺼운 방석이다.',5,14,7,1,'oreburghHomePartnerBed'),
  ],
};

export function installOreburghInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id==='tour_oreburgh_mart'?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
    const outside=map.warps.find(warp=>warp.to==='tour_oreburgh');
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;if(outside)Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};
  }
  const city=maps.tour_oreburgh;
  for(const warp of city.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
}
