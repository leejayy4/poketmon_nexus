import type { GameMap,Point } from './types';
import type { Place,TourBuilding,TourId } from './explore-world';
import type { TourInterior,Furnishing } from './explore-interiors';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_DRAGONS_DEN='tour_johto_dragons_den' as const;
export const JOHTO_DRAGONS_DEN_SHRINE='tour_johto_dragons_den_shrine' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;rooms:Record<string,TourInterior>;roomParents:Record<string,Place>;buildings:Record<string,TourBuilding[]>;features:Record<string,import('./explore-world').TourFeature[]>};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const props=(objects:ObjectInfo[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

/** Add the city-attached Dragon's Den without opening the elder trial or reward story. */
export function installJohtoDragonsDen(world:World){
  const city=world.places.find(place=>place.id==='tour_blackthorn');if(!city)return;
  const cityMap=world.maps.tour_blackthorn,cityRows=cityMap.walkable.map(row=>row.split(''));
  cityRows[2][42]='.';cityRows[3][42]='.';
  cityMap.warps.push({x:42,y:2,to:JOHTO_DRAGONS_DEN,spawn:{x:28,y:44},entry:'up',facing:'up'});
  cityMap.walkable=cityRows.map(row=>row.join(''));

  const rows=Array.from({length:48},()=>Array<string>(56).fill('#'));
  carve(rows,24,34,9,13);                       // city entrance slope
  carve(rows,8,30,40,7);                        // south bank
  carve(rows,6,10,7,23);carve(rows,43,10,7,23);// bank loops
  carve(rows,8,7,40,7);                         // north shrine bank
  carve(rows,20,20,16,7);                       // central dry island
  carve(rows,10,22,12,5);carve(rows,34,22,12,5);
  const lakeDescription='찬 지하수가 중앙 섬과 북쪽 사당을 둘러 흐른다.\n현재 물 위 이동·낚시·수상 조우는 제공하지 않는다.';
  const water=[
    {kind:'water' as const,x:13,y:14,w:30,h:6,name:'용의 굴 북쪽 지하 호수',description:lakeDescription},
    {kind:'water' as const,x:13,y:27,w:30,h:3,name:'용의 굴 남쪽 지하 호수',description:lakeDescription},
    {kind:'water' as const,x:13,y:20,w:7,h:7,name:'용의 굴 서쪽 지하 호수',description:lakeDescription},
    {kind:'water' as const,x:36,y:20,w:7,h:7,name:'용의 굴 동쪽 지하 호수',description:lakeDescription},
  ];
  const building:TourBuilding={kind:'landmark',x:21,y:3,w:14,h:6,door:{x:28,y:8},room:JOHTO_DRAGONS_DEN_SHRINE};
  for(const feature of water)for(let y=feature.y;y<feature.y+feature.h;y++)for(let x=feature.x;x<feature.x+feature.w;x++)rows[y][x]='#';
  carve(rows,20,20,16,7);carve(rows,10,22,12,5);carve(rows,34,22,12,5);
  for(let y=building.y;y<building.y+building.h;y++)for(let x=building.x;x<building.x+building.w;x++)rows[y][x]='#';rows[building.door.y][building.door.x]='.';
  const objects:ObjectInfo[]=[
    {name:'검은먹시티 귀환 표석',event:'dragonsDenCityReturn',cells:[{x:33,y:40}],pages:['남쪽 출구는 검은먹시티 북쪽 암벽길로 돌아간다.\n동굴 관찰 여부와 관계없이 같은 길로 귀환할 수 있다.']},
    {name:'지하 호수 관찰 난간',event:'dragonsDenLakeRail',cells:[{x:11,y:25}],pages:['찬 지하수가 중앙 섬 둘레를 천천히 흐른다.\n수상 이동·낚시·특별 조우를 시작하는 장치는 아니다.']},
    {name:'중앙 섬 용 문양석',event:'dragonsDenIslandStone',cells:[{x:28,y:23}],pages:['물결과 산등성이를 닮은 용 문양이 중앙 돌에 이어져 있다.\n조사만으로 시험·배지·도구·포켓몬 획득은 발생하지 않는다.']},
    {name:'북쪽 사당 공개 경계',event:'dragonsDenShrineGuide',cells:[{x:38,y:11}],pages:['북쪽 사당은 전승 보존 공간으로 공개된 범위만 살필 수 있다.\n장로 시험과 특별 보상은 아직 열지 않는다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  rows[46][28]='.';
  world.maps[JOHTO_DRAGONS_DEN]={id:JOHTO_DRAGONS_DEN,name:'용의 굴',width:56,height:48,background:JOHTO_DRAGONS_DEN,walkable:rows.map(row=>row.join('')),warps:[
    {x:28,y:46,to:'tour_blackthorn',spawn:{x:42,y:4},entry:'down',facing:'down'},
    {...building.door,to:JOHTO_DRAGONS_DEN_SHRINE,spawn:{x:12,y:16},entry:'up',facing:'up'},
  ],npcs:[{id:'dragonsDenKeeper',name:'용의 굴 보존원',sprite:'old_man',x:18,y:33,facing:'right',dialogue:'dragonsDenKeeper'}],props:props(objects),terrain:[]};

  const shrineRows=Array.from({length:20},(_,y)=>Array.from({length:24},(_,x)=>x>=2&&x<=21&&y>=3&&y<=17?'.':'#'));
  const furnishings:Furnishing[]=[
    {kind:'altar',name:'용 전승 사당',pages:['사람과 포켓몬이 오랫동안 함께 지켜 온 물과 산의 문양이다.\n현재 장로 시험·기술·특별 포켓몬 보상은 없다.'],x:9,y:4,w:6,h:3,event:'dragonsDenShrineAltar'},
    {kind:'chart',name:'굴과 도시 귀환도',pages:['사당 남쪽→지하 호수 남쪽 둑→검은먹시티 북쪽으로 돌아가는 길을 표시했다.'],x:16,y:10,w:5,h:3,event:'dragonsDenReturnChart'},
    {kind:'bench',name:'동료 관찰 쉼석',pages:['동굴을 함께 걸은 동료와 물소리를 들으며 쉬는 자리다.\n회복·경험치·능력치는 변하지 않는다.'],x:4,y:13,w:6,h:2,event:'dragonsDenRestBench'},
  ];
  for(const object of furnishings)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++)shrineRows[y][x]='#';
  shrineRows[19][12]='.';shrineRows[18][12]='.';
  const room:TourInterior={style:'shrine',title:'용의 굴 · 전승 사당',host:{x:12,y:11},greeting:['공개된 사당과 귀환길을 자유롭게 살펴볼 수 있습니다.','장로 시험과 특별 보상은 아직 진행하지 않습니다.'],objects:furnishings};
  world.maps[JOHTO_DRAGONS_DEN_SHRINE]={id:JOHTO_DRAGONS_DEN_SHRINE,name:'용의 굴 · 전승 사당',width:24,height:20,background:JOHTO_DRAGONS_DEN_SHRINE,walkable:shrineRows.map(row=>row.join('')),warps:[{x:12,y:19,to:JOHTO_DRAGONS_DEN,spawn:{x:28,y:10},entry:'down',facing:'down'}],npcs:[{id:'tourHost',name:'전승 사당 기록원',sprite:'old_man',x:12,y:11,facing:'down',dialogue:'tourHost'}],props:furnishings.flatMap(object=>Array.from({length:object.h},(_,j)=>Array.from({length:object.w},(_,i)=>({x:object.x+i,y:object.y+j,dialogue:object.event}))).flat())};

  const place:Place={id:JOHTO_DRAGONS_DEN,name:'용의 굴',region:'성도',theme:'cave',concept:'검은먹시티 북쪽의 지하 호수와 용 전승 사당',landmark:'지하 호수와 전승 사당',x:city.x,y:city.y-0.35};
  world.passagePlaces[JOHTO_DRAGONS_DEN]=place;world.passagePlaces[JOHTO_DRAGONS_DEN_SHRINE]={...place,id:JOHTO_DRAGONS_DEN_SHRINE,name:'용의 굴 · 전승 사당'};
  world.spawns[JOHTO_DRAGONS_DEN]={x:28,y:44};world.spawns[JOHTO_DRAGONS_DEN_SHRINE]={x:12,y:16};
  world.outdoors[JOHTO_DRAGONS_DEN]={objects:[...objects],signs:[]};world.rooms[JOHTO_DRAGONS_DEN_SHRINE]=room;world.roomParents[JOHTO_DRAGONS_DEN_SHRINE]=city;world.buildings[JOHTO_DRAGONS_DEN]=[building];world.features[JOHTO_DRAGONS_DEN]=water;
}
