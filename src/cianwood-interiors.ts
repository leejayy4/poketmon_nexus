import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_cianwood_center:{width:28,height:22},tour_cianwood_hall:{width:28,height:24},tour_cianwood_mart:{width:24,height:20},
  tour_cianwood_home1:{width:24,height:18},tour_cianwood_home1_2f:{width:24,height:18},tour_cianwood_home1_3f:{width:24,height:18},
  tour_cianwood_home2:{width:24,height:18},tour_cianwood_home2_2f:{width:24,height:18},tour_cianwood_home2_3f:{width:24,height:18},
};
const item=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_cianwood_center:[item('bench','41번수로 동료 휴게석','연락선과 해변 산책을 마친 동료가 몸을 말리는 자리다.\n실제 회복은 간호사에게 부탁하자.',18,5,6,2,'cianwoodCenterRouteBench'),item('chart','진청 여행 방향도','남쪽 상륙 데크·41번수로·담청 귀환과 도시 안 도장·상점·주거를 구분했다.',18,11,6,2,'cianwoodCenterRouteChart'),item('workbench','해변 산책 기록대','화단·발자국·호흡마당 기록과 현재 파티를 함께 확인한다.',5,16,7,2,'cianwoodCenterWalkLog')],
  tour_cianwood_hall:[item('stage','파도 균형 마루','외부에서 맞춘 호흡을 낮은 발 표식 위의 체중 이동으로 이어간다.',17,5,7,3,'cianwoodDojoBalanceMat'),item('mineral','둥근바위 밀기 자세대','고정된 둥근바위 앞에서 힘보다 발 위치와 자세를 살핀다.\n실제 바위를 움직이지 않는다.',18,12,6,3,'cianwoodDojoStonePosture'),item('workbench','동행 수련 기록대','외부 산책과 실내 균형·자세를 같은 동료와 기록한다.\n체육관전·배지 조건은 아니다.',5,17,7,2,'cianwoodDojoPracticeLog')],
  tour_cianwood_mart:[item('shelf','해변 여행용품대','마른 수건과 방수천을 전시했다.\n실제 판매품은 기존 몬스터볼과 상처약이다.',16,4,5,2,'cianwoodMartBeachShelf'),item('chart','연락선 귀환 준비표','41번수로→40번수로→담청 정기 연락선과 섬 외부 선택 분기를 표시했다.',16,10,5,2,'cianwoodMartRouteChart'),item('bench','동료와 가방 점검석','도장이나 연락선으로 가기 전에 파티와 보유품을 확인한다.',4,14,7,2,'cianwoodMartPackingBench')],
};
for(const root of ['tour_cianwood_home1','tour_cianwood_home2'])for(let floor=1;floor<=3;floor++){
  const id=floor===1?root:`${root}_${floor}f`;
  additions[id]=floor===1?[item('workbench','해변 장비 손질대','모래를 털 솔과 젖은 끈을 말리는 걸이가 있다.',16,4,5,2,`${root}BeachGear`),item('bench','가족과 동료의 낮은 자리','사람과 포켓몬이 파도 소리를 들으며 쉬는 자리다.',5,14,7,1,`${root}Companion`)]:floor===2?[item('shelf','연락선 생활 기록','바람·물때·귀환 시간을 주민별로 기록했다.',16,4,5,2,`${root}FerryLog`),item('bench','호흡 독서 자리','도장 수련과 해변 생태를 기록한 책을 읽는 자리다.',5,14,7,1,`${root}Reading`)]:[item('plants','옥상 해풍 화분','소금기 있는 바람에도 견디는 낮은 풀을 이웃과 돌본다.',16,4,5,2,`${root}RoofPlants`),item('bench','동료 바다 전망 방석','41번수로 연락선과 해변을 함께 보는 낮은 자리다.',5,14,7,1,`${root}View`)];
}

/** Resize Cianwood rooms while preserving all existing room, stair and door contracts. */
export function installCianwoodInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#')),props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id==='tour_cianwood_mart'?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const outside=map.warps.find(w=>w.to==='tour_cianwood');if(outside){const entrance={x:Math.floor(width/2),y:height-1};rows[height-1][entrance.x]='.';rows[height-2][entrance.x]='.';Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};}
    for(const warp of map.warps){rows[warp.y][warp.x]='.';if(warp.y+1<height-1)rows[warp.y+1][warp.x]='.';}
    map.width=width;map.height=height;map.walkable=rows.map(r=>r.join(''));map.props=props;
  }
  for(const warp of maps.tour_cianwood.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_cianwood_hall?.npcs[0])maps.tour_cianwood_hall.npcs[0].name='바다 도장 수련 안내인';
  maps.tour_cianwood_hall?.npcs.push({id:'cianwoodDojoTrainer',name:'바다 도장 수련생',sprite:'ace_trainer_m',x:10,y:14,facing:'right',dialogue:'cianwoodDojoTrainer'});
}
