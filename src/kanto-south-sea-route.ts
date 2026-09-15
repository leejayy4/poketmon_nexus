import type { GameMap,Point } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const KANTO_ROUTE_NINETEEN='tour_kanto_route_19' as const;
export const KANTO_ROUTE_TWENTY='tour_kanto_route_20' as const;
export const KANTO_SEAFOAM_EXTERIOR='tour_kanto_seafoam_exterior' as const;

type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};

/** Open Fuchsia's canonical Route 19 approach without pretending that Surf exists. */
export function installKantoRouteNineteen(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const fuchsia=world.places.find(place=>place.id==='tour_fuchsia')!;
  const width=32,height=80,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};

  // Dry city approach, bathing beach, and a long safety-ferry deck over the official sea route.
  open(13,1,7,18);open(8,14,17,9);open(4,20,24,8);open(11,26,10,52);
  open(3,34,9,7);open(20,45,9,7);open(3,58,9,8);open(18,68,11,7);
  rows[1][16]='.';rows[height-2][16]='.';

  const objects:ObjectInfo[]=[
    {name:'19번수로 연분홍 상륙표',event:'tourRoute19FuchsiaBoard',cells:[{x:7,y:22}],pages:['북쪽은 연분홍시티 남문이다.\n남쪽은 관동19번수로 해안과 연락선 데크다.','원작의 수상 구간을 번호 그대로 구분하되, 현재 이동 수단은 안전 연락선이다.']},
    {name:'해수욕장 안전선',event:'tourRoute19BeachLine',cells:[{x:24,y:25}],pages:['연분홍 남쪽 모래 해안과 얕은 물의 경계를 표시했다.\n수영·낚시·야생 수상 조우는 아직 제공하지 않는다.']},
    {name:'19번수로 동료 바람막이',event:'tourRoute19CompanionShade',cells:[{x:6,y:38}],pages:['사람과 동료 포켓몬이 바닷바람을 피하는 낮은 차양이다.\n회복과 도구 지급은 일어나지 않는다.']},
    {name:'20번수로 인계 항로표',event:'tourRoute19Route20Handoff',cells:[{x:23,y:72}],pages:['남쪽 다음 구간: 관동20번수로 → 쌍둥이섬 → 홍련섬','쌍둥이섬1F부터 B4F를 통과해 홍련섬까지 왕복할 수 있다. 같은 연락선으로 연분홍에도 돌아갈 수 있다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';

  world.maps[KANTO_ROUTE_NINETEEN]={
    id:KANTO_ROUTE_NINETEEN,name:'관동 19번수로 · 연락선',width,height,background:KANTO_ROUTE_NINETEEN,
    walkable:rows.map(row=>row.join('')),terrain:[],
    warps:[
      {x:16,y:1,to:fuchsia.id,spawn:{x:30,y:52},entry:'up',facing:'up'},
      {x:16,y:height-2,to:KANTO_ROUTE_TWENTY,spawn:{x:92,y:18},entry:'down',facing:'left'},
    ],
    npcs:[
      {id:'route19Deckhand',name:'19번수로 연락선 선원',sprite:'sailor',x:16,y:49,facing:'up',dialogue:'journeyWalker'},
      {id:'route19Traveler',name:'19번수로 해안 여행자',sprite:'rancher',x:16,y:31,facing:'down',dialogue:'journeyWalker'},
    ],
    props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event}))),
  };
  world.passages[KANTO_ROUTE_NINETEEN]={id:KANTO_ROUTE_NINETEEN,a:fuchsia,b:fuchsia,kind:'coast',bend:16};
  world.passagePlaces[KANTO_ROUTE_NINETEEN]={id:KANTO_ROUTE_NINETEEN,name:'관동 19번수로 · 연락선',region:'관동',theme:'coast',concept:'연분홍 남쪽 해안에서 공식19번수로를 따라20번수로 경계까지 내려가는 안전 연락선',landmark:'20번수로 인계 항로표',x:fuchsia.x,y:fuchsia.y+.55};
  world.spawns[KANTO_ROUTE_NINETEEN]={x:16,y:4};world.outdoors[KANTO_ROUTE_NINETEEN]={objects,signs:[]};

  const city=world.maps[fuchsia.id],cityRows=city.walkable.map(row=>row.split(''));
  for(let y=50;y<=54;y++)for(let x=28;x<=32;x++)cityRows[y][x]='.';
  city.walkable=cityRows.map(row=>row.join(''));
  city.warps.push({x:30,y:54,to:KANTO_ROUTE_NINETEEN,spawn:{x:16,y:4},entry:'down',facing:'down'});

  const width20=96,height20=36,route20=Array.from({length:height20},()=>Array<string>(width20).fill('#'));
  const carve20=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)route20[yy][xx]='.';};
  carve20(1,15,94,8);carve20(75,6,10,10);carve20(60,21,10,9);carve20(43,8,12,8);carve20(24,21,12,9);
  route20[18][94]='.';route20[10][48]='.';
  const objects20:ObjectInfo[]=[
    {name:'19번수로 동쪽 환승표',event:'tourRoute20Route19Board',cells:[{x:82,y:9}],pages:['동쪽 연락선은 관동19번수로를 거쳐 연분홍시티로 돌아간다.\n서쪽은 쌍둥이섬 상륙 데크 방향이다.']},
    {name:'20번수로 해류 관측판',event:'tourRoute20CurrentBoard',cells:[{x:65,y:27}],pages:['섬 양쪽에서 바닷물의 방향과 파도 높이를 기록한다.\n해류 퍼즐·수영·낚시·수상 야생 조우는 아직 적용하지 않았다.']},
    {name:'쌍둥이섬 상륙 안내',event:'tourRoute20SeafoamBoard',cells:[{x:52,y:12}],pages:['북쪽 보조 데크에서 쌍둥이섬 외부로 상륙할 수 있다.\n동굴 내부를 통과하기 전에는 서쪽 홍련 방면 연락선이 출항하지 않는다.']},
    {name:'홍련 방면 항로표',event:'tourRoute20CinnabarClosed',cells:[{x:29,y:27}],pages:['쌍둥이섬 전 층을 통과하면20번수로 서쪽 연락선으로 나온다.\n서쪽 끝 출구는 홍련섬 상륙 데크로 이어진다.','홍련에서 센터와 연구소에 들른 뒤 같은 항로로 쌍둥이섬과 연분홍시티까지 돌아갈 수 있다.']},
  ];
  for(const object of objects20)for(const cell of object.cells)route20[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_TWENTY]={id:KANTO_ROUTE_TWENTY,name:'관동 20번수로 · 연락선',width:width20,height:height20,background:KANTO_ROUTE_TWENTY,walkable:route20.map(row=>row.join('')),terrain:[],warps:[
    {x:94,y:18,to:KANTO_ROUTE_NINETEEN,spawn:{x:16,y:height-4},entry:'right',facing:'up'},
    {x:48,y:10,to:KANTO_SEAFOAM_EXTERIOR,spawn:{x:32,y:42},entry:'up',facing:'up'},
  ],npcs:[
    {id:'route20Deckhand',name:'20번수로 연락선 선원',sprite:'sailor',x:72,y:18,facing:'left',dialogue:'journeyWalker'},
    {id:'route20Observer',name:'20번수로 해류 관찰자',sprite:'scientist_f',x:45,y:18,facing:'right',dialogue:'journeyWalker'},
    {id:'route20HomewardKeeper',name:'20번수로 새 조련사',sprite:'rancher',x:63,y:25,facing:'right',dialogue:'route20HomewardKeeper'},
  ],props:objects20.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};

  const islandWidth=64,islandHeight=48,island=Array.from({length:islandHeight},()=>Array<string>(islandWidth).fill('#'));
  const carveIsland=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)island[yy][xx]='.';};
  carveIsland(29,11,7,36);carveIsland(14,28,18,8);carveIsland(33,20,18,9);carveIsland(20,9,25,7);
  island[46][32]='.';
  const islandObjects:ObjectInfo[]=[
    {name:'쌍둥이섬 바깥 얼음바위',event:'tourSeafoamOuterIce',cells:[{x:18,y:31}],pages:['바닷바람에 식은 바위 틈에 얇은 얼음 결이 남아 있다.\n외부 관찰이며 야생 조우·도구 획득은 없다.']},
    {name:'쌍둥이섬 동쪽 동굴 입구',event:'tourSeafoamCaveClosed',cells:[{x:32,y:10}],pages:['쌍둥이섬1F→B1F→B2F→B3F→B4F를 지나 서쪽 통로로 돌아 올라갈 수 있다.\nB2F에는 작은 바위를 남쪽 홈으로 밀어 여는 곁길이 있다. 계단 본선으로도 왕복할 수 있다.']},
    {name:'20번수로 귀환 승선표',event:'tourSeafoamReturnBoard',cells:[{x:43,y:24}],pages:['남쪽 상륙 데크에서 관동20번수로 연락선으로 돌아간다.\n동굴 방문은 연분홍 귀환 조건이 아니다.']},
  ];
  for(const object of islandObjects)for(const cell of object.cells)island[cell.y][cell.x]='#';
  world.maps[KANTO_SEAFOAM_EXTERIOR]={id:KANTO_SEAFOAM_EXTERIOR,name:'쌍둥이섬 · 외부 상륙지',width:islandWidth,height:islandHeight,background:KANTO_SEAFOAM_EXTERIOR,walkable:island.map(row=>row.join('')),terrain:[],warps:[
    {x:32,y:46,to:KANTO_ROUTE_TWENTY,spawn:{x:48,y:12},entry:'down',facing:'down'},
  ],npcs:[{id:'seafoamObserver',name:'쌍둥이섬 외부 관찰자',sprite:'rancher',x:38,y:24,facing:'left',dialogue:'journeyWalker'}],props:islandObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};

  for(const [id,name,concept,landmark] of [
    [KANTO_ROUTE_TWENTY,'관동 20번수로 · 연락선','19번수로 남단에서 쌍둥이섬 외부까지 동서로 이어지는 안전 연락선','쌍둥이섬 상륙 안내'],
    [KANTO_SEAFOAM_EXTERIOR,'쌍둥이섬 · 외부 상륙지','20번수로 연락선에서 내리는 얼음바위 섬의 외부 관찰지','쌍둥이섬 동쪽 동굴 입구'],
  ] as const){
    world.passages[id]={id,a:fuchsia,b:fuchsia,kind:id===KANTO_ROUTE_TWENTY?'coast':'cave',bend:id===KANTO_ROUTE_TWENTY?48:32};
    world.passagePlaces[id]={id,name,region:'관동',theme:id===KANTO_ROUTE_TWENTY?'coast':'cave',concept,landmark,x:fuchsia.x-.3,y:fuchsia.y+.75};
  }
  world.spawns[KANTO_ROUTE_TWENTY]={x:92,y:18};world.spawns[KANTO_SEAFOAM_EXTERIOR]={x:32,y:42};
  world.outdoors[KANTO_ROUTE_TWENTY]={objects:objects20,signs:[]};world.outdoors[KANTO_SEAFOAM_EXTERIOR]={objects:islandObjects,signs:[]};
}
