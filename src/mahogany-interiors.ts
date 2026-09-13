import type { GameMap,Point } from './types';
import type { Furnishing,FurnishingKind,TourInterior } from './explore-interiors';

const sizes:Record<string,{width:number;height:number}>={
  tour_mahogany_center:{width:28,height:22},tour_mahogany_hall:{width:28,height:24},tour_mahogany_mart:{width:24,height:20},
  tour_mahogany_home1:{width:24,height:18},tour_mahogany_home2:{width:24,height:18},
};
const item=(kind:FurnishingKind,name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});
const additions:Record<string,Furnishing[]>={
  tour_mahogany_center:[
    item('bench','42번도로 동료 휴게석','절구산 아래 산물길을 지나온 동료가 흙과 잎을 털며 쉬는 자리다.\n실제 회복은 간호사에게 부탁하자.',18,5,6,2,'mahoganyCenterRouteBench'),
    item('chart','황토 세 방향 여행도','서쪽42번도로·인주, 북쪽43번도로·분노의호수, 동쪽44번도로·얼음샛길 방향을 구분했다.',18,11,6,3,'mahoganyCenterRouteChart'),
    item('workbench','산길 편성 점검대','현재 파티와 센터 PC의 동료를 확인하고 호숫길과 얼음길 준비를 나누는 자리다.\n자동 편성이나 기술 변경은 일어나지 않는다.',5,16,7,2,'mahoganyCenterPartyTable'),
  ],
  tour_mahogany_hall:[
    item('console','생활 공급반','호숫가 생활 공급을 유지하는 별도 계통이다.',18,17,2,2,'mahoganyLifeSupply'),
    item('console','분리 송신 제어기','생활 공급과 구분된 복원 송신기의 단로기다.',22,17,2,2,'mahoganyTransmissionConsole'),
    item('chart','세 번호 도로 기후표','42번 산물길, 43번 상류 빗길, 44번 얼음바람의 지형과 귀환 방향을 나누어 표시했다.',17,5,7,3,'mahoganyHallRouteChart'),
    item('mineral','절구산·얼음샛길 암석 비교대','절구산 1층의 젖은 암반과 얼음샛길 방향의 차가운 돌 표본을 외형으로 비교한다.\n깊은 동굴이나 얼음 퍼즐을 완료하는 장치가 아니다.',18,12,6,3,'mahoganyHallRockTable'),
    item('workbench','호수 생활 수첩','43번도로 상류 물과 마을 빗물못의 생활 쓰임을 기록한다.\n호수 사건이나 특별 조우 완료 기록은 아니다.',5,17,7,2,'mahoganyHallLakeBook'),
  ],
  tour_mahogany_mart:[
    item('shelf','산길 건조용품대','젖은 끈과 천을 말리는 걸이, 찬바람을 막는 덮개를 전시했다.\n실제 판매품은 기존 몬스터볼과 상처약이다.',16,4,5,2,'mahoganyMartTravelShelf'),
    item('chart','호수·얼음길 출발표','북쪽43번도로와 동쪽44번도로의 현재 연결과 후속 독립 맵을 구분했다.',16,10,5,2,'mahoganyMartRouteChart'),
    item('bench','동료와 가방 점검석','세 번호 도로로 떠나기 전에 파티 상태와 몬스터볼·상처약을 확인한다.',4,14,7,2,'mahoganyMartPackingBench'),
  ],
  tour_mahogany_home1:[
    item('workbench','산나물 손질대','장터에 내놓을 산나물의 흙을 털고 마른 잎을 따로 모은다.',16,4,5,2,'mahoganyHomeHerbTable'),
    item('shelf','42번도로 여행 사진책','절구산 분기와 인주 방향의 산물길을 주민과 포켓몬이 왕복한 사진이 모여 있다.',16,9,5,2,'mahoganyHomeRouteAlbum'),
    item('bench','가족과 동료의 온돌 자리','찬 산바람을 피해 사람과 포켓몬이 함께 쉬는 낮은 자리다.\n실제 회복 효과는 없다.',5,14,7,1,'mahoganyHomeCompanionSeat'),
  ],
  tour_mahogany_home2:[
    item('chart','상류 빗물 사용표','43번도로에서 내려온 물을 씻기·화단·장터 청소로 나누어 적었다.',16,4,5,2,'mahoganyHomeWaterChart'),
    item('shelf','44번도로 방한 기록','동쪽 산길로 떠난 주민이 바람과 결빙 흔적을 날짜별로 기록했다.\n얼음샛길 통과 기록은 아니다.',16,9,5,2,'mahoganyHomeColdLog'),
    item('bench','산길 출발 동료 자리','호수나 얼음길로 떠나기 전 사람과 동료가 장비를 확인하는 자리다.',5,14,7,1,'mahoganyHomeTravelSeat'),
  ],
};

/** Resize Mahogany's required rooms while preserving doors, sales and return contracts. */
export function installMahoganyInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  for(const [id,{width,height}] of Object.entries(sizes)){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;room.objects.push(...additions[id]);
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#')),props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id==='tour_mahogany_mart'?'martClerk':'tourHost'});}
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
    const outside=map.warps.find(w=>w.to==='tour_mahogany');if(outside){const entrance={x:Math.floor(width/2),y:height-1};rows[height-1][entrance.x]='.';rows[height-2][entrance.x]='.';Object.assign(outside,entrance);spawns[id]={x:entrance.x,y:height-4};}
    for(const warp of map.warps){rows[warp.y][warp.x]='.';if(warp.y+1<height-1)rows[warp.y+1][warp.x]='.';}
    map.width=width;map.height=height;map.walkable=rows.map(r=>r.join(''));map.props=props;
  }
  for(const warp of maps.tour_mahogany.warps){const spawn=spawns[warp.to];if(spawn&&sizes[warp.to])warp.spawn={...spawn};}
  if(maps.tour_mahogany_hall?.npcs[0])maps.tour_mahogany_hall.npcs[0].name='산길 안내 기록원';
  maps.tour_mahogany_hall?.npcs.push({id:'mahoganyTransmissionKeeper',name:'송신 현장 담당자',sprite:'scientist_f',x:21,y:20,facing:'up',dialogue:'mahoganyTransmissionKeeper'});
  const hall=maps.tour_mahogany_hall;
  if(hall){
    for(const prop of hall.props)if(prop.dialogue==='mahoganyHallLakeBook'&&prop.x>=9&&prop.x<=10&&prop.y>=17&&prop.y<=18)prop.dialogue='mahoganyReserveSwitch';
    hall.npcs.push({id:'mahoganyPowerResident',name:'출입 길을 살피는 주민',sprite:'middle_aged_man',x:12,y:15,facing:'down',dialogue:'mahoganyPowerResident'});
  }
}
