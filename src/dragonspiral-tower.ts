import type { GameMap,Point,Warp } from './types';
import type { Place,TourBuilding,TourId } from './explore-world';
import type { TourInterior,Furnishing } from './explore-interiors';
import type { TourOutdoors } from './explore-outdoors';

export const DRAGONSPIRAL_FLOORS=['tour_dragonspiral_hall','tour_dragonspiral_hall_2f','tour_dragonspiral_hall_3f'] as const;
type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
type World={places:Place[];maps:Record<TourId,GameMap>;rooms:Record<string,TourInterior>;spawns:Record<TourId,Point>;floors:FloorInfo;roomParents:Record<string,Place>;floorParents:Record<string,TourId>;buildings:Record<string,TourBuilding[]>;outdoors:Record<string,TourOutdoors>};
const furnishing=(kind:Furnishing['kind'],name:string,pages:string[],x:number,y:number,event:string):Furnishing=>({kind,name,pages,x,y,w:3,h:2,event});
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

function floorMap(id:typeof DRAGONSPIRAL_FLOORS[number],floor:number):{map:GameMap;room:TourInterior}{
  const rows=Array.from({length:48},()=>Array<string>(48).fill('#'));
  carve(rows,3,3,42,7);carve(rows,38,8,7,34);carve(rows,3,38,38,7);carve(rows,3,8,7,33);
  carve(rows,9,12,28,5);carve(rows,12,16,5,18);carve(rows,16,29,18,5);carve(rows,29,16,5,14);
  if(floor===2){carve(rows,20,18,8,11);carve(rows,16,22,18,5);}
  if(floor===3){carve(rows,18,18,12,12);carve(rows,14,21,20,6);}
  const down={x:8,y:40},up={x:40,y:8};rows[down.y][down.x]='.';rows[up.y][up.x]='.';
  const titles=['용나선탑 1층 · 기단 회랑','용나선탑 2층 · 나선 석재 회랑','용나선탑 3층 · 바람 관찰층'];
  const data:Array<Array<[Furnishing['kind'],string,string,string,number,number]>>=[
    [['altar','기단 방향석','남쪽 입구와 서쪽 궐수 귀환 통로, 위층 계단 방향을 구분한다.','tourDragonspiralBaseStone',12,13],['chart','해자와 기단 도면','탑 둘레 물길과 사람이 걷는 마른 돌기단을 나누어 그렸다.','tourDragonspiralMoatChart',29,30]],
    [['altar','나선 석재 맞춤','돌마다 하중을 나누는 방향 표시가 남아 있다.','tourDragonspiralMasonry',20,19],['shelf','보존 작업 기록','무너진 곳을 새 전설로 해석하지 않고 수리 위치만 기록했다.','tourDragonspiralPreservation',12,31]],
    [['chart','세 방향 바람판','설화시티·습지·탑 상부에서 부는 바람의 방향을 비교한다.','tourDragonspiralWindChart',19,19],['bench','동행 관찰 쉼석','사람과 포켓몬이 탑의 돌과 바람을 조용히 살피는 자리다.','tourDragonspiralRest',31,31]],
  ];
  const objects=data[floor-1].map(([kind,name,text,event,x,y])=>furnishing(kind,name,[text],x,y,event));
  for(const object of objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++)rows[y][x]='#';
  const warps:Warp[]=[];
  if(floor===1)warps.push({x:24,y:46,to:'tour_dragonspiral',spawn:{x:28,y:14},entry:'down',facing:'down'});
  else warps.push({x:down.x,y:down.y,to:DRAGONSPIRAL_FLOORS[floor-2],spawn:{x:40,y:10},entry:'down',facing:'down'});
  if(floor<3)warps.push({x:up.x,y:up.y,to:DRAGONSPIRAL_FLOORS[floor],spawn:{x:8,y:38},entry:'up',facing:'up'});
  for(const warp of warps)rows[warp.y][warp.x]='.';
  const room:TourInterior={style:'shrine',title:titles[floor-1],host:{x:24,y:36},greeting:['오래된 회랑을 따라 입구와 계단으로 되돌아갈 수 있습니다.','관찰 기록은 전설 사건이나 포획 조건이 아닙니다.'],objects};
  const props=objects.flatMap(object=>Array.from({length:object.h},(_,j)=>Array.from({length:object.w},(_,i)=>({x:object.x+i,y:object.y+j,dialogue:object.event}))).flat());
  const map:GameMap={id,name:'용나선탑 · '+titles[floor-1],width:48,height:48,background:id,walkable:rows.map(row=>row.join('')),terrain:[],warps,npcs:[{id:'tourHost',name:'탑 보존 안내원',sprite:'scientist_f',x:24,y:36,facing:'down',dialogue:'tourHost'}],props};
  return {map,room};
}

export function installDragonspiralTower(w:World){
  const place=w.places.find(item=>item.id==='tour_dragonspiral'),previous=w.maps.tour_dragonspiral;if(!place||!previous)return;
  const rows=Array.from({length:48},()=>Array<string>(56).fill('#'));
  carve(rows,25,12,7,35);carve(rows,1,21,29,7);carve(rows,13,30,31,7);carve(rows,38,18,7,19);
  carve(rows,19,8,19,8);carve(rows,7,17,13,14);carve(rows,36,10,13,10);
  const building:TourBuilding={kind:'landmark',x:20,y:5,w:17,h:8,door:{x:28,y:12},room:DRAGONSPIRAL_FLOORS[0]};
  const objects=[
    {name:'남쪽 접근로 귀환석',event:'tourDragonspiralSouthGuide',cells:[{x:28,y:40}],pages:['남쪽은 용나선탑 접근로와 설화시티 북문 방향이다.','설화 동문에서 하나 8번도로까지 같은 길로 돌아갈 수 있다.']},
    {name:'서쪽 레거시 귀환 표지',event:'tourDragonspiralLegacyGuide',cells:[{x:9,y:23}],pages:['서쪽은 기존 궐수–용나선탑 암반굴이다.','과거 저장의 귀환을 위해 보존한 프로젝트 통로이며 공식 도로·동굴 이름이 아니다.']},
    {name:'탑 기단 관찰판',event:'tourDragonspiralFoundation',cells:[{x:40,y:19}],pages:['해자 안쪽의 마른 기단과 남쪽 탑 문을 살핀다.','수상 이동·전설 조우·포획 없이 1층 회랑에 들어갈 수 있다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  rows[building.door.y][building.door.x]='.';
  const legacy=previous.warps.map((warp,index)=>({...warp,x:1,y:24+index,spawn:{...warp.spawn}}));for(const warp of legacy)rows[warp.y][warp.x]='.';
  w.maps.tour_dragonspiral={id:'tour_dragonspiral',name:'용나선탑 기슭',width:56,height:48,background:'tour_dragonspiral',walkable:rows.map(row=>row.join('')),terrain:[],warps:[...legacy,{...building.door,to:DRAGONSPIRAL_FLOORS[0],spawn:{x:24,y:44},entry:'up',facing:'up'}],npcs:[
    {id:'tourGuide',name:'탑 기슭 보존원',sprite:'rancher',x:33,y:32,facing:'left',dialogue:'tourGuide'},
    {id:'tourPokemon',name:'해자 바람을 살피는 콩둘기',sprite:'field-pidove',x:40,y:34,facing:'left',dialogue:'tourPokemon'},
  ],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  w.spawns.tour_dragonspiral={x:28,y:42};w.buildings.tour_dragonspiral=[building];w.outdoors.tour_dragonspiral={objects,signs:[]};
  for(const map of Object.values(w.maps))for(const warp of map.warps)if(warp.to==='tour_dragonspiral')warp.spawn={x:2,y:24};
  for(let index=0;index<DRAGONSPIRAL_FLOORS.length;index++){const id=DRAGONSPIRAL_FLOORS[index],built=floorMap(id,index+1);w.maps[id]=built.map;w.rooms[id]=built.room;w.spawns[id]={x:24,y:index?36:44};w.roomParents[id]=place;w.floors[id]={floor:index+1,total:3,title:built.room.title};if(index)w.floorParents[id]=DRAGONSPIRAL_FLOORS[index-1];}
}
