import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_olivine_center:{width:28,height:22},tour_olivine_mart:{width:24,height:20},
  tour_olivine_hall:{width:28,height:24},tour_olivine_hall_2f:{width:28,height:24},tour_olivine_hall_3f:{width:28,height:24},
  tour_olivine_home1:{width:24,height:18},tour_olivine_home1_2f:{width:24,height:18},tour_olivine_home1_3f:{width:24,height:18},
  tour_olivine_home2:{width:24,height:18},tour_olivine_home2_2f:{width:24,height:18},tour_olivine_home2_3f:{width:24,height:18},
};
const item=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_olivine_center:[item('bench','39번도로 동료 휴게석','목초지와 내리막을 지나온 동료가 발의 흙을 털고 쉬는 자리다.\n실제 회복은 간호사에게 부탁하자.',18,5,6,2,'olivineCenterRouteBench'),item('chart','담청 여행 방향도','북쪽39번도로·인주, 남쪽 작업항·등대, 후속40번수로를 구분했다.',18,11,6,2,'olivineCenterRouteChart'),item('workbench','항구 동료 장비 건조대','젖은 천과 마른 수건을 나눠 걸었다.\n조사만으로 회복이나 도구 지급은 없다.',5,16,7,2,'olivineCenterDryingBench')],
  tour_olivine_mart:[item('shelf','해풍 여행용품대','방수천과 작은 물통을 전시했다.\n실제 판매품은 기존 몬스터볼과 상처약이다.',16,4,5,2,'olivineMartHarborShelf'),item('chart','육상·해상 준비표','38·39번 육상길과 후속40·41번수로, 국제 여객 항로를 나눴다.',16,10,5,2,'olivineMartRouteChart'),item('bench','동료와 가방 점검석','항구로 가기 전 파티 상태와 보유품을 살핀다.',4,14,7,2,'olivineMartPackingBench')],
  tour_olivine_hall:[item('machine','등대 렌즈 손질대','작은 보조 렌즈와 부드러운 천으로 빛의 번짐을 비교한다.',17,5,7,3,'olivineLighthouseLensTable'),item('chart','담청등대 층별 안내','1층 렌즈 관리 · 2층 항로 관측\n3층 등실과 외항 전망',18,12,6,3,'olivineLighthouseFloorGuide'),item('bench','등대 동료 대기석','계단을 오르기 전 사람과 포켓몬이 함께 쉬는 넓은 자리다.',5,17,7,2,'olivineLighthouseWaitingSeat')],
  tour_olivine_hall_2f:[item('machine','항로 관측 렌즈','외항의 부표와 방파제 사이를 비추는 관측 장치다.',17,5,7,3,'olivineLighthouseRouteLens'),item('chart','항로 구분 기록판','40·41번수로와 담청↔구름 국제 항로를 별도 색으로 기록했다.',18,12,6,3,'olivineLighthouseRouteLog'),item('bench','관측 동료 쉼자리','빛에 민감한 동료가 렌즈 정면을 피해서 쉴 자리다.',5,17,7,2,'olivineLighthouseObserverRest')],
  tour_olivine_hall_3f:[item('machine','담청 등실','외항과 작업항에 일정한 간격으로 빛을 보낸다.\n조사로 항로가 새로 열리지는 않는다.',17,5,7,3,'olivineLighthouseLamp'),item('bench','외항 동행 전망석','담청 지붕과 39번도로 언덕, 외항을 차례로 바라본다.',18,12,6,3,'olivineLighthouseLookout'),item('workbench','항구 여행 기록대','동료와 지나온 육상길과 항구 안전선을 기록한다.',5,17,7,2,'olivineLighthouseJourneyLog')],
};
for(const root of ['tour_olivine_home1','tour_olivine_home2'])for(let floor=1;floor<=3;floor++){
  const id=floor===1?root:`${root}_${floor}f`;
  additions[id]=floor===1?[item('workbench','항구 장비 손질대','밧줄과 가방끈을 닦고 느슨한 매듭을 다시 묶는다.',16,4,5,2,`${root}Gear`),item('bench','가족과 동료의 낮은 자리','사람 의자 옆에 젖은 발을 말릴 포켓몬 방석을 두었다.',5,14,7,1,`${root}Companion`)]:floor===2?[item('shelf','항구 생활 기록장','작업항의 물때와 등대 불빛을 주민별로 기록했다.',16,4,5,2,`${root}HarborLog`),item('bench','해풍 독서 자리','바람이 센 날에도 책장이 넘겨지지 않는 낮은 책상이다.',5,14,7,1,`${root}Reading`)]:[item('plants','옥상 바람 화분','소금기 있는 바람에도 자라는 낮은 풀을 함께 돌본다.',16,4,5,2,`${root}RoofPlants`),item('bench','동료 항구 전망 방석','작업항과 등대를 함께 볼 수 있는 낮은 쉼자리다.',5,14,7,1,`${root}View`)];
}

/** Apply the size ledger while retaining room event IDs, outdoor doors and stairs. */
export function installOlivineInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id==='tour_olivine_mart'?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const outside=map.warps.find(w=>w.to==='tour_olivine');if(outside){const entrance={x:Math.floor(width/2),y:height-1};rows[height-1][entrance.x]='.';rows[height-2][entrance.x]='.';Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};}
    for(const warp of map.warps){rows[warp.y][warp.x]='.';if(warp.y+1<height-1)rows[warp.y+1][warp.x]='.';}
    map.width=width;map.height=height;map.walkable=rows.map(r=>r.join(''));map.props=props;
  }
  for(const warp of maps.tour_olivine.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_olivine_hall?.npcs[0])maps.tour_olivine_hall.npcs[0].name='담청등대 렌즈 안내인';
  if(maps.tour_olivine_hall_2f?.npcs[0])maps.tour_olivine_hall_2f.npcs[0].name='항로 관측 안내인';
  if(maps.tour_olivine_hall_3f?.npcs[0])maps.tour_olivine_hall_3f.npcs[0].name='등실 관리 안내인';
}
