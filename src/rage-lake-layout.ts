import type { GameMap,Point } from './types';
import type { TourBuilding,TourFeature } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const RAGE_LAKE_SIZE={width:56,height:48};
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

/** Expand the compact stop into a walkable shore while preserving its original doors and rooms. */
export function installRageLakeDetails(map:GameMap,outdoors:TourOutdoors,buildings:TourBuilding[],features:TourFeature[]){
  const previous=map.walkable;
  const rows=Array.from({length:RAGE_LAKE_SIZE.height},()=>Array<string>(RAGE_LAKE_SIZE.width).fill('#'));
  carve(rows,2,3,20,20);                         // preserved facility quarter
  carve(rows,20,3,33,5);carve(rows,20,31,33,8); // north and south lake banks
  carve(rows,20,7,5,29);carve(rows,48,7,5,29);  // west and east observation loops
  carve(rows,25,36,7,11);                       // Route 43 arrival path
  carve(rows,7,21,18,6);carve(rows,7,26,7,11);  // reed-side western trail
  for(let y=0;y<previous.length;y++)for(let x=0;x<previous[y].length;x++)if(previous[y][x]==='.')rows[y][x]='.';
  const nextFeatures:TourFeature[]=[
    {kind:'water',x:28,y:8,w:20,h:23,name:'분노의호수 수면',description:'바람과 상류 유입에 따라 물결의 결이 달라지는 넓은 호수다.\n현재 수상 이동·낚시·특별 조우는 제공하지 않는다.'},
    {kind:'grove',x:3,y:27,w:10,h:9,name:'서쪽 갈대 보존지',description:'물가 포켓몬이 쉬는 갈대와 낮은 습지다.\n관찰길 밖으로 들어가거나 포획하는 구역은 아니다.'},
    {kind:'garden',x:34,y:39,w:16,h:5,name:'남쪽 붉은 단풍 둑',description:'43번도로에서 올라온 여행자가 호수의 바람을 처음 마주하는 둑이다.\n붉은 색은 단풍 경관이며 특별 개체 출현 상태가 아니다.'},
  ];
  features.splice(0,features.length,...nextFeatures);
  for(const block of [...buildings,...nextFeatures])for(let y=block.y;y<block.y+block.h;y++)for(let x=block.x;x<block.x+block.w;x++)rows[y][x]='#';
  for(const building of buildings)if(building.room)rows[building.door.y][building.door.x]='.';
  const routeWarp=map.warps.find(w=>w.to==='tour_pass_mahogany_rage_lake');
  if(routeWarp){routeWarp.x=28;routeWarp.y=46;routeWarp.spawn={x:16,y:4};routeWarp.entry='down';routeWarp.facing='down';rows[46][28]='.';}
  const objects:ObjectInfo[]=[
    {name:'분리 취수 분기 받침',event:'rageReliefIntake',cells:[{x:25,y:20}],pages:['생활 공급과 별도로 홈통을 이을 둑의 받침이다.']},
    {name:'주민 취수 받이',event:'rageReliefBasin',cells:[{x:25,y:28}],pages:['낮은 둑에서 생활용 물을 받는 자리다.']},
    {name:'낮은 둑 독립 경보 받침',event:'rageReliefBell',cells:[{x:25,y:30}],pages:['물가에서 보이는 수동 종과 신호판을 세울 자리다.']},
    {name:'43번도로 귀환 표석',event:'rageLakeRoute43Stone',cells:[{x:32,y:43}],pages:['남쪽은 43번도로를 지나 황토마을로 돌아간다.\n호수 관찰 여부와 관계없이 본선은 열려 있다.']},
    {name:'갈대 흔들림 기록대',event:'rageLakeReedDesk',cells:[{x:14,y:31}],pages:['갈대가 흔들린 방향과 물가 발자국을 기록한다.\n건강한 동료와 선택 관찰을 시작할 수 있다.']},
    {name:'호수 수위 표석',event:'rageLakeWaterStone',cells:[{x:22,y:18}],pages:['상류 유입과 둑 가장자리의 물높이를 비교한다.\n수상 이동이나 낚시를 시작하는 장치는 아니다.']},
    {name:'동쪽 호수 전망대',event:'rageLakeLookout',cells:[{x:50,y:18}],pages:['넓은 수면과 서쪽 갈대, 남쪽 귀환로를 한눈에 살핀다.\n특별 포켓몬이나 사건 완료를 선언하는 장소가 아니다.']},
    {name:'북쪽 숲 보존선',event:'rageLakeNorthBoundary',cells:[{x:38,y:5}],pages:['북쪽 숲은 현재 공개 관찰 범위의 경계다.\n숨은 집·도구·추가 도로를 구현한 구역이 아니다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.width=RAGE_LAKE_SIZE.width;map.height=RAGE_LAKE_SIZE.height;map.walkable=rows.map(row=>row.join(''));
  map.npcs.push({id:'rageLakeObserver',name:'호수 생태 관찰자',sprite:'scientist_f',x:20,y:34,facing:'right',dialogue:'rageLakeObserver'});
  outdoors.objects.push(...objects);
}
