import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_44='tour_johto_route_44' as const;
export const JOHTO_ICE_PATH_1F='tour_johto_ice_path_1f' as const;
export const JOHTO_ICE_PATH_B1F='tour_johto_ice_path_b1f' as const;
export const JOHTO_ICE_PATH_B2F='tour_johto_ice_path_b2f' as const;
export const JOHTO_ICE_PATH_B3F='tour_johto_ice_path_b3f' as const;
const COMPAT='tour_pass_mahogany_blackthorn' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const props=(objects:ObjectInfo[])=>objects.flatMap(o=>o.cells.map(c=>({...c,dialogue:o.event})));
const blockObjects=(rows:string[][],objects:ObjectInfo[])=>{for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';};

/** Replace the Mahogany-Blackthorn shortcut with Route 44 and a reversible four-floor Ice Path. */
export function installJohtoIcePath(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  const mahogany=world.places.find(p=>p.id==='tour_mahogany')!,blackthorn=world.places.find(p=>p.id==='tour_blackthorn')!,compat=world.maps[COMPAT];
  const mExit=world.maps[mahogany.id].warps.find(w=>w.to===COMPAT)!,bExit=world.maps[blackthorn.id].warps.find(w=>w.to===COMPAT)!;
  const toM=compat.warps.find(w=>w.to===mahogany.id)!,toB=compat.warps.find(w=>w.to===blackthorn.id)!;

  const route=Array.from({length:32},()=>Array<string>(80).fill('#'));
  carve(route,1,12,78,7);carve(route,14,5,16,8);carve(route,36,18,14,8);carve(route,57,5,14,8);
  const routeObjects:ObjectInfo[]=[
    {name:'황토 동쪽 44번도로 표석',event:'tourRoute44MahoganyStone',cells:[{x:8,y:11}],pages:['서쪽은 황토마을, 동쪽은 얼음샛길과 검은먹시티다.\n가운데 본선은 언제든 양방향으로 걸을 수 있다.']},
    {name:'쌍둥이 연못 관찰 난간',event:'tourRoute44PondRail',cells:[{x:23,y:8}],pages:['낮은 연못 두 곳이 풀밭과 본선을 나누고 있다.\n현재 수상 이동·낚시·도구 획득은 제공하지 않는다.']},
    {name:'차가운 바람 쉼터',event:'tourRoute44ColdShelter',cells:[{x:43,y:22}],pages:['얼음샛길에서 내려오는 바람을 낮은 바위벽이 막아 준다.\n동굴은 되돌아올 수 있는 네 층 통과로다.']},
    {name:'얼음샛길 서쪽 입구 표지',event:'tourRoute44IcePathBoard',cells:[{x:69,y:9}],pages:['동쪽 동굴은 얼음샛길 1F·B1F·B2F·B3F를 거쳐 검은먹시티로 이어진다.\n미끄럼 퍼즐의 강제 이동은 아직 적용하지 않는다.']},
  ];blockObjects(route,routeObjects);
  world.maps[JOHTO_ROUTE_44]={id:JOHTO_ROUTE_44,name:'성도 44번도로',width:80,height:32,background:JOHTO_ROUTE_44,walkable:route.map(r=>r.join('')),warps:[
    {x:1,y:15,to:mahogany.id,spawn:{...toM.spawn},entry:'left',facing:toM.facing},{x:78,y:15,to:JOHTO_ICE_PATH_1F,spawn:{x:3,y:24},entry:'right',facing:'right'},
  ],npcs:[{id:'route44Traveler',name:'44번도로 연못 여행자',sprite:'ace_trainer_m',x:53,y:15,facing:'left',dialogue:'journeyWalker'},{id:'route44Trainer',name:'44번도로 풀숲 트레이너',sprite:'pokemon_breeder_f',x:49,y:22,facing:'left',dialogue:'tourRoute44Trainer'}],props:props(routeObjects),terrain:[{kind:'tallGrass',x:37,y:19,w:12,h:6}]};

  const f1=Array.from({length:48},()=>Array<string>(56).fill('#'));
  carve(f1,1,20,35,9);carve(f1,27,8,9,20);carve(f1,40,20,15,9);carve(f1,40,27,9,13);
  const f1Objects:ObjectInfo[]=[
    {name:'얼음샛길 서쪽 온도 표식',event:'icePathWestMarker',cells:[{x:9,y:19}],pages:['서쪽 출구는44번도로·황토마을이다.\n차가운 바닥과 마른 암반을 구분해 걸어가자.']},
    {name:'B1F 내려가는 서리 계단',event:'icePathB1StairBoard',cells:[{x:26,y:11}],pages:['북쪽 계단은 B1F로 내려간다.\n모든 층은 같은 계단으로 되돌아올 수 있다.']},
    {name:'검은먹 쪽 바깥빛 표식',event:'icePathBlackthornLight',cells:[{x:46,y:19}],pages:['동쪽 틈으로 검은먹시티의 바깥빛이 들어온다.\nB3F에서 올라온 뒤 동쪽 출구로 나간다.']},
  ];blockObjects(f1,f1Objects);
  world.maps[JOHTO_ICE_PATH_1F]={id:JOHTO_ICE_PATH_1F,name:'얼음샛길 1F',width:56,height:48,background:JOHTO_ICE_PATH_1F,walkable:f1.map(r=>r.join('')),warps:[
    {x:1,y:24,to:JOHTO_ROUTE_44,spawn:{x:76,y:15},entry:'left',facing:'left'},
    {x:31,y:8,to:JOHTO_ICE_PATH_B1F,spawn:{x:8,y:9},entry:'up',facing:'down'},
    {x:44,y:38,to:JOHTO_ICE_PATH_B3F,spawn:{x:30,y:29},entry:'down',facing:'up'},
    {x:54,y:24,to:blackthorn.id,spawn:{...toB.spawn},entry:'right',facing:toB.facing},
  ],npcs:[{id:'icePathGuide',name:'얼음샛길 산행객',sprite:'ace_trainer_m',x:18,y:24,facing:'right',dialogue:'journeyWalker'}],props:props(f1Objects),terrain:[]};

  const b1=Array.from({length:48},()=>Array<string>(48).fill('#'));
  carve(b1,5,5,9,36);carve(b1,12,32,29,9);carve(b1,32,12,9,27);carve(b1,12,12,22,7);
  const b1Objects:ObjectInfo[]=[
    {name:'B1F 얼음마루 안내',event:'icePathB1IceBoard',cells:[{x:18,y:11}],pages:['넓은 얼음마루를 낮은 암반 길이 둘러싼다.\n현재는 방향 입력이 강제로 미끄러지지 않는다.']},
    {name:'1F 귀환 계단 표식',event:'icePathB1ReturnBoard',cells:[{x:10,y:12}],pages:['서북쪽 계단으로 1F 서쪽 구역과44번도로에 돌아간다.']},
    {name:'B2F 진행 계단 표식',event:'icePathB2StairBoard',cells:[{x:37,y:29}],pages:['남동쪽 계단은 B2F로 이어진다.\n막히면 같은 길로 1F까지 돌아갈 수 있다.']},
  ];blockObjects(b1,b1Objects);
  world.maps[JOHTO_ICE_PATH_B1F]={id:JOHTO_ICE_PATH_B1F,name:'얼음샛길 B1F',width:48,height:48,background:JOHTO_ICE_PATH_B1F,walkable:b1.map(r=>r.join('')),warps:[
    {x:8,y:7,to:JOHTO_ICE_PATH_1F,spawn:{x:31,y:10},entry:'up',facing:'down'},{x:38,y:38,to:JOHTO_ICE_PATH_B2F,spawn:{x:8,y:37},entry:'down',facing:'up'},
  ],npcs:[{id:'icePathTrainer',name:'얼음샛길 동굴 트레이너',sprite:'ace_trainer_m',x:27,y:35,facing:'right',dialogue:'tourIcePathTrainer'}],props:props(b1Objects),terrain:[]};

  const b2=Array.from({length:48},()=>Array<string>(48).fill('#'));
  carve(b2,5,30,10,13);carve(b2,12,30,29,9);carve(b2,33,7,9,27);carve(b2,12,7,23,8);carve(b2,20,14,8,17);
  const b2Objects:ObjectInfo[]=[
    {name:'B2F 바위홈 관찰판',event:'icePathB2RockBoard',cells:[{x:24,y:20}],pages:['얼음 사이 바위홈은 아래층으로 찬 공기가 흐르는 자리다.\n바위 밀기·낙하 퍼즐은 아직 동작하지 않는다.']},
    {name:'B1F 귀환 계단 표식',event:'icePathB2ReturnBoard',cells:[{x:11,y:40}],pages:['남서쪽 계단으로 B1F와1F에 돌아간다.']},
    {name:'B3F 진행 계단 표식',event:'icePathB3StairBoard',cells:[{x:36,y:10}],pages:['북동쪽 계단은 B3F와 검은먹 방향으로 이어진다.']},
  ];blockObjects(b2,b2Objects);
  world.maps[JOHTO_ICE_PATH_B2F]={id:JOHTO_ICE_PATH_B2F,name:'얼음샛길 B2F',width:48,height:48,background:JOHTO_ICE_PATH_B2F,walkable:b2.map(r=>r.join('')),warps:[
    {x:8,y:40,to:JOHTO_ICE_PATH_B1F,spawn:{x:38,y:36},entry:'down',facing:'up'},{x:38,y:8,to:JOHTO_ICE_PATH_B3F,spawn:{x:8,y:9},entry:'up',facing:'down'},
  ],npcs:[],props:props(b2Objects),terrain:[]};

  const b3=Array.from({length:40},()=>Array<string>(40).fill('#'));
  carve(b3,5,5,9,29);carve(b3,12,26,22,8);carve(b3,27,12,8,18);carve(b3,12,12,17,7);
  const b3Objects:ObjectInfo[]=[
    {name:'B3F 고드름 회랑',event:'icePathB3IcicleBoard',cells:[{x:20,y:11}],pages:['천장의 고드름 아래는 물방울이 떨어지는 낮은 회랑이다.\n조사만으로 도구나 특별 조우가 생기지 않는다.']},
    {name:'B2F 귀환 계단 표식',event:'icePathB3ReturnBoard',cells:[{x:10,y:14}],pages:['북서쪽 계단으로 B2F·B1F·1F 서쪽에 돌아간다.']},
    {name:'검은먹 방향 1F 계단 표식',event:'icePathExitStairBoard',cells:[{x:27,y:31}],pages:['동쪽 계단으로 1F 검은먹 출구 구역에 올라간다.\n출구에서도 네 층을 역순으로 돌아갈 수 있다.']},
  ];blockObjects(b3,b3Objects);
  world.maps[JOHTO_ICE_PATH_B3F]={id:JOHTO_ICE_PATH_B3F,name:'얼음샛길 B3F',width:40,height:40,background:JOHTO_ICE_PATH_B3F,walkable:b3.map(r=>r.join('')),warps:[
    {x:8,y:7,to:JOHTO_ICE_PATH_B2F,spawn:{x:38,y:10},entry:'up',facing:'down'},{x:30,y:31,to:JOHTO_ICE_PATH_1F,spawn:{x:44,y:36},entry:'right',facing:'down'},
  ],npcs:[],props:props(b3Objects),terrain:[]};

  const maps=[[JOHTO_ROUTE_44,'성도 44번도로',routeObjects,'village'],[JOHTO_ICE_PATH_1F,'얼음샛길 1F',f1Objects,'cave'],[JOHTO_ICE_PATH_B1F,'얼음샛길 B1F',b1Objects,'cave'],[JOHTO_ICE_PATH_B2F,'얼음샛길 B2F',b2Objects,'cave'],[JOHTO_ICE_PATH_B3F,'얼음샛길 B3F',b3Objects,'cave']] as const;
  for(const [id,name,objects,theme] of maps){world.passages[id]={id,a:mahogany,b:blackthorn,kind:theme==='cave'?'cave':'road',bend:theme==='cave'?20:30};world.passagePlaces[id]={id,name,region:'성도',theme,concept:'황토마을에서44번도로와 얼음샛길을 지나 검은먹시티로 가는 동부 산악 본선',landmark:theme==='cave'?'서리 계단과 얼음 회랑':'쌍둥이 연못과 찬바람 쉼터',x:(mahogany.x+blackthorn.x)/2,y:(mahogany.y+blackthorn.y)/2};world.outdoors[id]={objects:[...objects],signs:[]};}
  world.spawns[JOHTO_ROUTE_44]={x:3,y:15};world.spawns[JOHTO_ICE_PATH_1F]={x:3,y:24};world.spawns[JOHTO_ICE_PATH_B1F]={x:8,y:9};world.spawns[JOHTO_ICE_PATH_B2F]={x:8,y:37};world.spawns[JOHTO_ICE_PATH_B3F]={x:8,y:9};
  mExit.to=JOHTO_ROUTE_44;mExit.spawn={x:3,y:15};mExit.facing='right';bExit.to=JOHTO_ICE_PATH_1F;bExit.spawn={x:52,y:24};bExit.facing='left';
}
