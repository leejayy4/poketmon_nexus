import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_blackthorn_center:{width:28,height:22},tour_blackthorn_hall:{width:28,height:24},tour_blackthorn_mart:{width:24,height:20},
  tour_blackthorn_home1:{width:24,height:18},tour_blackthorn_home2:{width:24,height:18},
};
const item=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_blackthorn_center:[
    item('bench','얼음샛길 동료 휴게석','차가운 동굴을 건넌 동료가 몸의 서리를 털며 쉬는 자리다.\n실제 회복은 간호사에게 부탁하자.',18,5,6,2,'blackthornCenterIceBench'),
    item('chart','검은먹 산악 여행도','서쪽44번도로·얼음샛길, 북쪽 용의굴, 남쪽45·46번도로와29번도로 동쪽 합류부를 구분했다.\n각 출구는 실제 왕복할 수 있다.',18,11,6,3,'blackthornCenterRouteChart'),
    item('workbench','동굴 귀환 편성대','파티와 PC의 동료를 확인하고 얼음샛길로 돌아갈 준비를 하는 자리다.\n자동 편성이나 기술 변경은 일어나지 않는다.',5,16,7,2,'blackthornCenterPartyTable'),
  ],
  tour_blackthorn_hall:[
    item('chart','얼음과 찬물 호흡도','얼음샛길의 찬 공기와 도시 수행 물길에서 호흡을 맞추는 순서를 기록했다.',17,5,7,3,'blackthornHallBreathChart'),
    item('mineral','푸른 암반 결 비교대','동굴 서리 암반과 검은먹 푸른 암벽의 결을 빛의 방향에 따라 비교한다.\n용의굴 내부 시험을 대신하는 장치가 아니다.',18,12,6,3,'blackthornHallRockTable'),
    item('altar','용 전승 보존대','도시 주민이 오래된 용 문양을 공개 전시하고 돌보는 자리다.\n용의굴·체육관·배지 사건과는 별개다.',5,17,7,3,'blackthornHallTraditionAltar'),
  ],
  tour_blackthorn_mart:[
    item('shelf','동굴 방한용품대','젖은 천을 닦는 수건과 미끄럼을 줄이는 덧신 견본이 놓였다.\n실제 판매품은 기존 몬스터볼과 상처약이다.',16,4,5,2,'blackthornMartColdShelf'),
    item('chart','서쪽 귀환 준비표','얼음샛길 네 층과44번도로를 거쳐 황토로 돌아가는 순서를 표시했다.',16,10,5,2,'blackthornMartReturnChart'),
    item('bench','동료 장비 점검석','찬 동굴로 돌아가기 전에 파티 상태와 가방을 함께 확인한다.',4,14,7,2,'blackthornMartPackingBench'),
  ],
  tour_blackthorn_home1:[
    item('workbench','산물길 방한 손질대','주민과 포켓몬이 젖은 끈과 천을 말리고 찢어진 덮개를 꿰맨다.',16,4,5,2,'blackthornHomeColdTable'),
    item('shelf','얼음샛길 왕복 일지','44번도로와 얼음샛길 네 층을 왕복한 날짜와 동료 상태를 적었다.',16,9,5,2,'blackthornHomeIceLog'),
    item('bench','온돌 동료 자리','차가운 산길을 다녀온 가족과 포켓몬이 함께 쉬는 낮은 자리다.\n회복 효과는 없다.',5,14,7,1,'blackthornHomeWarmSeat'),
  ],
  tour_blackthorn_home2:[
    item('chart','찬물 사용 기록','산에서 내려온 물을 수행터·생활용·화단용으로 나누어 적었다.',16,4,5,2,'blackthornHomeWaterChart'),
    item('shelf','남쪽 절벽 관찰책','45번도로 절벽의 바람과 낙석 흔적,46번도로의 낮은 턱까지 왕복하며 기록했다.\n29번도로에서는 동쪽 합류부 경계를 확인한다.',16,9,5,2,'blackthornHomeCliffBook'),
    item('bench','암벽 관찰 동료 자리','푸른 암반의 빛과 결을 주민과 포켓몬이 함께 비교하는 자리다.',5,14,7,1,'blackthornHomeRockSeat'),
  ],
};

/** Resize Blackthorn's required rooms while preserving healing, sales and return contracts. */
export function installBlackthornInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#')),props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id==='tour_blackthorn_mart'?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const outside=map.warps.find(w=>w.to==='tour_blackthorn');if(outside){const entrance={x:Math.floor(width/2),y:height-1};rows[height-1][entrance.x]='.';rows[height-2][entrance.x]='.';Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};}
    for(const warp of map.warps){rows[warp.y][warp.x]='.';if(warp.y+1<height-1)rows[warp.y+1][warp.x]='.';}
    map.width=width;map.height=height;map.walkable=rows.map(r=>r.join(''));map.props=props;
  }
  for(const warp of maps.tour_blackthorn.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_blackthorn_hall?.npcs[0])maps.tour_blackthorn_hall.npcs[0].name='용 전승 기록원';
}
