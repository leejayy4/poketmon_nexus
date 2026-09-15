import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_42='tour_johto_route_42' as const;
export const JOHTO_MT_MORTAR_1F='tour_johto_mt_mortar_1f' as const;
const COMPAT='tour_pass_ecruteak_mahogany' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const props=(objects:ObjectInfo[])=>objects.flatMap(o=>o.cells.map(c=>({...c,dialogue:o.event})));

/** Replace the Ecruteak-Mahogany shortcut with Route 42 and an optional Mt. Mortar first floor. */
export function installJohtoRoute42(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  const ecruteak=world.places.find(p=>p.id==='tour_ecruteak')!,mahogany=world.places.find(p=>p.id==='tour_mahogany')!,compat=world.maps[COMPAT];
  const eExit=world.maps[ecruteak.id].warps.find(w=>w.to===COMPAT)!,mExit=world.maps[mahogany.id].warps.find(w=>w.to===COMPAT)!;
  const toE=compat.warps.find(w=>w.to===ecruteak.id)!,toM=compat.warps.find(w=>w.to===mahogany.id)!;
  const rows=Array.from({length:32},()=>Array<string>(88).fill('#'));
  carve(rows,1,12,86,7);carve(rows,17,5,14,8);carve(rows,39,18,12,8);carve(rows,57,5,15,8);carve(rows,42,7,7,6);
  const objects:ObjectInfo[]=[
    {name:'인주 동쪽 42번도로 표석',event:'tourRoute42EcruteakStone',cells:[{x:8,y:10}],pages:['서쪽은 인주시티, 동쪽은 황토마을이다.\n가운데 본선에서 절구산 선택 분기가 갈라진다.']},
    {name:'절구산 선택 분기표',event:'tourRoute42MortarBoard',cells:[{x:45,y:10}],pages:['북쪽은 절구산 1층 선택 탐험, 동쪽 본선은 황토마을이다.\n동굴을 방문하지 않아도 두 도시를 왕복할 수 있다.']},
    {name:'산물길 관찰 난간',event:'tourRoute42WaterRail',cells:[{x:64,y:9}],pages:['산에서 내려온 물이 도로 옆 낮은 바위 사이로 흐른다.\n난간에서 물빛을 살핀 뒤 북쪽 절구산 입구로 돌아갈 수 있다.']},
    {name:'황토 서쪽 도착 표지',event:'tourRoute42MahoganyStone',cells:[{x:79,y:20}],pages:['동쪽은 황토마을 장터와 43·44번도로 준비 지점이다.\n서쪽은 절구산 분기와 인주시티다.']},
    {name:'규토리나무 아래 깨비참',event:'route42SpearowGrove',cells:[{x:24,y:7}],pages:['절구산 기슭의 나무 아래에 깨비참이 내려와 있다.\n마른 길에서 동료와 천천히 살펴볼 수 있다.']},
  ];for(const o of objects)for(const c of o.cells)rows[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_42]={id:JOHTO_ROUTE_42,name:'성도 42번도로',width:88,height:32,background:JOHTO_ROUTE_42,walkable:rows.map(r=>r.join('')),warps:[
    {x:1,y:15,to:ecruteak.id,spawn:{...toE.spawn},entry:'left',facing:toE.facing},{x:86,y:15,to:mahogany.id,spawn:{...toM.spawn},entry:'right',facing:toM.facing},{x:45,y:7,to:JOHTO_MT_MORTAR_1F,spawn:{x:28,y:52},entry:'up',facing:'up'},
  ],npcs:[
    {id:'route42Traveler',name:'42번도로 산물길 여행자',sprite:'ace_trainer_m',x:35,y:15,facing:'right',dialogue:'journeyWalker'},
    {id:'route42GroveTrainer',name:'42번도로 기슭 트레이너',sprite:'youngster',x:29,y:10,facing:'left',dialogue:'route42GroveTrainer'},
  ],props:props(objects),terrain:[]};

  const cave=Array.from({length:56},()=>Array<string>(56).fill('#'));
  carve(cave,25,39,7,16);carve(cave,10,34,36,8);carve(cave,9,15,8,20);carve(cave,39,12,8,23);carve(cave,15,12,25,7);carve(cave,24,18,8,17);
  const caveObjects:ObjectInfo[]=[
    {name:'상류 퇴적물 거름틀',event:'mortarSedimentScreen',cells:[{x:17,y:25}],pages:['암반 배수홈의 잎과 모래를 거르는 틀이다. 서쪽 마른 길에서 접근한다.']},
    {name:'배수 분리·침전 받이',event:'mortarSettlingBasin',cells:[{x:17,y:30}],pages:['퇴적물을 아래로 쏟지 않도록 물을 따로 받는 작은 설비다.']},
    {name:'북쪽 횡단로 회전 표식',event:'mortarNorthBypassMarker',cells:[{x:32,y:11}],pages:['북쪽 횡단로의 벽에 고정된 우회 표식 받침이다. 기존 길을 가리지 않는다.']},
    {name:'절구산 암반 물길',event:'tourMortarWaterTrace',cells:[{x:13,y:25}],pages:['천장에서 떨어진 물이 낮은 암반 홈을 따라 흐른다.\n물 옆의 마른 암반을 따라 북쪽 횡단로와 남쪽 합류점으로 이어진다.']},
    {name:'산바람 메아리벽',event:'tourMortarEchoWall',cells:[{x:43,y:22}],pages:['동쪽 좁은 홈에서 들어온 바람이 넓은 암반실에 낮게 울린다.']},
    {name:'닫힌 깊은층 경계',event:'tourMortarDeepBoundary',cells:[{x:28,y:23}],pages:['바위가 좁은 틈을 메우고 있어 더 안쪽으로는 갈 수 없다.\n남쪽 합류점과 서쪽 물길로 돌아가자.']},
    {name:'42번도로 귀환 표식',event:'tourMortarReturnBoard',cells:[{x:33,y:42}],pages:['남쪽 출구로 42번도로 본선에 돌아간다.\n서쪽 인주와 동쪽 황토를 계속 왕복할 수 있다.']},
  ];for(const o of caveObjects)for(const c of o.cells)cave[c.y][c.x]='#';
  world.maps[JOHTO_MT_MORTAR_1F]={id:JOHTO_MT_MORTAR_1F,name:'절구산 1층',width:56,height:56,background:JOHTO_MT_MORTAR_1F,walkable:cave.map(r=>r.join('')),warps:[{x:28,y:54,to:JOHTO_ROUTE_42,spawn:{x:45,y:9},entry:'down',facing:'down'}],npcs:[{id:'mortarHiker',name:'절구산 산행객',sprite:'ace_trainer_m',x:28,y:37,facing:'up',dialogue:'journeyWalker'}],props:props(caveObjects),terrain:[]};
  for(const [id,name,landmark,theme] of [[JOHTO_ROUTE_42,'성도 42번도로','산물길과 절구산 분기','village'],[JOHTO_MT_MORTAR_1F,'절구산 1층','암반 물길과 닫힌 깊은층','cave']] as const){world.passages[id]={id,a:ecruteak,b:mahogany,kind:theme==='cave'?'cave':'road',bend:id===JOHTO_ROUTE_42?30:20};world.passagePlaces[id]={id,name,region:'성도',theme,concept:'인주와 황토 사이의 42번도로 및 선택 산악 탐험',landmark,x:(ecruteak.x+mahogany.x)/2,y:(ecruteak.y+mahogany.y)/2};world.outdoors[id]={objects:id===JOHTO_ROUTE_42?objects:caveObjects,signs:[]};}
  world.spawns[JOHTO_ROUTE_42]={x:3,y:15};world.spawns[JOHTO_MT_MORTAR_1F]={x:28,y:52};
  world.maps[JOHTO_MT_MORTAR_1F].npcs.push({id:'mortarRescueWalker',name:'돌아갈 길을 기다리는 산행객',sprite:'middle_aged_man',x:44,y:20,facing:'up',dialogue:'mortarRescueWalker'});
  eExit.to=JOHTO_ROUTE_42;eExit.spawn={x:3,y:15};eExit.facing='right';mExit.to=JOHTO_ROUTE_42;mExit.spawn={x:84,y:15};mExit.facing='left';
}
