import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
const HOME_IDS=['tour_goldenrod_home1','tour_goldenrod_home2','tour_goldenrod_home3'];
const HALL_IDS=['tour_goldenrod_hall','tour_goldenrod_hall_2f','tour_goldenrod_hall_3f'];

function roomIds(){return ['tour_goldenrod_center','tour_goldenrod_mart',...HOME_IDS.flatMap(id=>[id,`${id}_2f`,`${id}_3f`]),...HALL_IDS];}
function dimensions(id:string):Point{
  if(id==='tour_goldenrod_center')return {x:28,y:22};
  if(id==='tour_goldenrod_mart')return {x:24,y:20};
  if(id.startsWith('tour_goldenrod_hall'))return {x:28,y:24};
  return {x:24,y:18};
}
function positions(id:string):Point[]{
  if(id==='tour_goldenrod_center')return [{x:4,y:8},{x:20,y:8},{x:4,y:15},{x:12,y:10},{x:19,y:15}];
  if(id==='tour_goldenrod_mart')return [{x:3,y:9},{x:18,y:9},{x:3,y:15},{x:11,y:10},{x:17,y:15}];
  if(id.startsWith('tour_goldenrod_hall'))return [{x:4,y:7},{x:19,y:7},{x:4,y:16},{x:12,y:11},{x:18,y:17}];
  return [{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12},{x:10,y:8}];
}

function addGoldenrodDetails(id:string,room:TourInterior){
  const floor=id.endsWith('_2f')?2:id.endsWith('_3f')?3:1;
  const details:Array<[TourInterior['objects'][number]['kind'],string,string]>=
    id==='tour_goldenrod_center'?
      [['chart','34번도로 출발 안내판','금빛 남쪽 출구부터 목장길과 숲 문턱까지 표시했다.\n긴 풀밭에 들어가기 전 동료의 몸 상태를 확인하자.'],['bench','동료 손질 자리','부드러운 솔과 마른 수건이 놓여 있다.\n회복을 마친 동료와 잠시 쉬는 자리다.']]:
    id==='tour_goldenrod_mart'?
      [['shelf','시장 도시락 진열대','34번도로로 떠나는 여행자를 위한 도시락이다.\n전시 진열이며 구매 품목은 기존 도구 목록을 따른다.'],['chart','목장 배달 장부','34번도로 목장과 남쪽 시장을 오간 기록이다.\n사람과 포켓몬이 함께 짐을 날랐다고 적혀 있다.']]:
    id.startsWith('tour_goldenrod_hall')?
      floor===1?[['console','지역 방송 편성표','시장 소식과 34번도로 여행 이야기가 시간별로 적혀 있다.'],['bench','동료 청취석','낮은 의자 옆에 포켓몬용 방석이 놓였다.\n녹음을 마친 동료가 함께 방송을 듣는 자리다.']]:
      floor===2?[['workbench','휴대 녹음기 정비대','도로에서 쓰는 작은 녹음기와 여분 전지가 놓였다.'],['shelf','현지 취재 자료함','금빛 시장·34번 목장·너도밤나무숲 자료를 구역별로 모았다.']]:
      [['console','방송 수신 확인대','금빛 거리와 34번도로에서 들어온 신호를 확인한다.'],['bench','여행자 사연 열람석','동료와 만난 이야기를 천천히 읽을 수 있는 자리다.']]:
    id.includes('home1')?
      floor===1?[['bench','동료 식사 뒤 쉼터','낮은 방석과 물그릇이 나란히 놓여 있다.'],['shelf','돌봄 일정표','식사·산책·휴식 시간을 동료마다 다르게 적었다.']]:floor===2?[['shelf','동료 건강 기록장','산책 거리와 쉬어 간 장소를 날짜별로 기록했다.'],['plants','햇볕 드는 풀 화분','풀타입 포켓몬이 냄새를 맡기 좋은 잎이 자란다.']]:[['bench','공동 낮잠 자리','사람과 포켓몬이 함께 쉬도록 넓은 방석을 폈다.'],['shelf','계절 이불장','도시와 숲의 날씨에 맞춘 작은 담요가 들어 있다.']]:
    id.includes('home2')?
      floor===1?[['workbench','볼 주머니 수선대','34번도로에서 쓰기 좋은 작은 주머니를 꿰매고 있다.'],['chart','출발 전 확인표','회복·도구·기술·귀환 장소를 차례로 확인한다.']]:floor===2?[['chart','34번도로 굽이 지도','강가 루프와 목장길, 숲 문턱이 손그림으로 이어져 있다.'],['shelf','기술 비교 자료','타입과 위력, 동료가 기억한 기술을 비교한 표다.']]:[['workbench','여행 장비 건조대','비에 젖은 가방과 신발을 말리는 낮은 선반이다.'],['bench','출발 회의 자리','다음 길을 정하기 위해 지도 주위에 방석을 놓았다.']]:
      floor===1?[['console','가족용 라디오','시장 소식과 여행자 방송이 작은 스피커에서 흘러나온다.'],['shelf','방송 엽서 보관함','라디오 타워에 보낼 엽서를 주소별로 나눠 두었다.']]:floor===2?[['chart','주간 방송표','포켓몬 생활·시장·도로 소식의 방송 시간이 적혀 있다.'],['bench','창가 청취석','도시 불빛을 보며 방송을 듣는 작은 의자다.']]:[['console','옥상 안테나 조절기','노랑시티와 34번도로 방향의 수신 눈금을 맞춘다.'],['shelf','여행 사연 모음','다른 지방에서 온 여행자와 동료의 이야기를 묶었다.']];
  for(const [kind,name,text] of details)room.objects.push({x:0,y:0,w:3,h:2,kind,name,pages:[text],event:`${id.replace('tour_','')}Detail${room.objects.length}`});
}
function warpsFor(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{
  const info=floors[id],center=Math.floor(width/2),stairX=width-5;
  return map.warps.map(warp=>{
    const target=floors[warp.to];
    if(!target)return {...warp,x:center,y:height-1,spawn:{...warp.spawn}};
    if(target.floor>info.floor)return {...warp,x:stairX,y:7,spawn:{x:stairX,y:height-5}};
    return {...warp,x:stairX,y:height-6,spawn:{x:stairX,y:8}};
  });
}

/** Apply Goldenrod's full room sizes after its home and radio roles are installed. */
export function installGoldenrodInteriorSizes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const id of roomIds()){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    addGoldenrodDetails(id,room);
    const {x:width,y:height}=dimensions(id),center=Math.floor(width/2),upper=!!floors[id]&&floors[id].floor>1;
    const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    if(!upper){rows[height-2][center]='.';rows[height-1][center]='.';}
    const objectPositions=positions(id);
    room.objects.forEach((object,index)=>Object.assign(object,objectPositions[index]??objectPositions.at(-1)));
    if(id==='tour_goldenrod_center'){
      room.host={x:center,y:5};room.reception={x:center-4,y:6,w:8,h:1};
    }else if(id==='tour_goldenrod_mart'){
      room.host={x:center,y:5};room.reception={x:center-4,y:6,w:8,h:1};
    }else room.host={x:center,y:height-5};
    const props:GameMap['props']=[];
    if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:id==='tour_goldenrod_mart'?'martClerk':'tourHost'});
    }
    for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    const warps=warpsFor(id,map,width,height,floors);
    for(const warp of warps)rows[warp.y][warp.x]='.';
    map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.warps=warps;map.props=props;
    Object.assign(map.npcs[0],room.host);spawns[id]={x:center,y:height-4};
  }
  const city=maps.tour_goldenrod;
  for(const warp of city.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_goldenrod_'))warp.spawn={...spawn};}
}
