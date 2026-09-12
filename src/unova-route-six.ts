import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';
import type { TourInterior } from './explore-interiors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const UNOVA_ROUTE_SIX='tour_pass_driftveil_mistralton' as const;
export const CHARGESTONE_1F='tour_chargestone_1f' as const;
export const CHARGESTONE_B1F='tour_chargestone_b1f' as const;
export const ROUTE_SIX_LAB='tour_route_six_lab' as const;

type World={places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;rooms:Record<string,TourInterior>;parents:Record<string,Place>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const objectProps=(objects:{event:string;cells:Point[]}[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

export function installUnovaRouteSix(world:World){
  const driftveil=world.places.find(p=>p.id==='tour_driftveil')!,mistralton=world.places.find(p=>p.id==='tour_mistralton')!;
  const legacy=world.maps[UNOVA_ROUTE_SIX],passage=world.passages[UNOVA_ROUTE_SIX];if(!legacy||!passage)return;
  const toDriftveil=legacy.warps.find(w=>w.to===driftveil.id)!,toMistralton=legacy.warps.find(w=>w.to===mistralton.id)!;
  const driftveilExit=world.maps[driftveil.id].warps.find(w=>w.to===UNOVA_ROUTE_SIX)!;
  const mistraltonExit=world.maps[mistralton.id].warps.find(w=>w.to===UNOVA_ROUTE_SIX)!;

  const route=Array.from({length:88},()=>Array<string>(40).fill('#'));
  open(route,18,1,4,86);open(route,8,13,10,4);open(route,8,13,4,18);open(route,8,27,10,4);
  open(route,22,39,10,4);open(route,28,39,4,18);open(route,22,53,10,4);
  open(route,7,65,11,4);open(route,7,65,4,12);open(route,9,73,9,4);
  const routeObjects=[
    {name:'계절 연구소 안내판',event:'tourRouteSixLab',cells:[{x:12,y:26}],pages:['강가의 풀과 포켓몬 흔적을 계절별로 비교하는 작은 연구소다.','연구원은 현재 관찰 기록만 공개하며\n새 사건이나 통행 조건을 요구하지 않는다.']},
    {name:'강물 높이 기록',event:'tourRouteSixRiverGauge',cells:[{x:25,y:42}],pages:['다리 기둥에 계절마다 달라진 강물 높이가 표시돼 있다.','수상이동 없이 건널 수 있는 목재 다리가\n본선에 놓여 있다.']},
    {name:'푸른 결정 조각',event:'tourRouteSixCrystalShard',cells:[{x:17,y:8}],pages:['동굴 쪽에서 굴러온 듯한 푸른 결정 조각이 희미하게 빛난다.','북쪽 출구 너머가 전기돌동굴 1층이다.']},
  ];
  for(const object of routeObjects)for(const cell of object.cells)route[cell.y][cell.x]='#';
  legacy.name='하나 6번도로';legacy.width=40;legacy.height=88;legacy.background=UNOVA_ROUTE_SIX;legacy.walkable=route.map(row=>row.join(''));legacy.terrain=[];
  legacy.warps=[{x:19,y:86,to:driftveil.id,spawn:{...toDriftveil.spawn},entry:'down',facing:toDriftveil.facing},{x:19,y:1,to:CHARGESTONE_1F,spawn:{x:31,y:52},entry:'up',facing:'up'}];
  legacy.warps.push({x:13,y:27,to:ROUTE_SIX_LAB,spawn:{x:14,y:18},entry:'up',facing:'up'});
  legacy.npcs=[{id:'routeSixResearcher',name:'계절 연구원',sprite:'scientist_f',x:15,y:29,facing:'left',dialogue:'tourRouteSixResearcher'}];
  legacy.props=[{x:17,y:82,dialogue:'tourRouteSixSign'},{x:22,y:5,dialogue:'tourRouteSixSign'},...objectProps(routeObjects)];
  world.passages[UNOVA_ROUTE_SIX]={...passage,a:driftveil,b:mistralton,kind:'road',bend:44};
  world.passagePlaces[UNOVA_ROUTE_SIX]={id:UNOVA_ROUTE_SIX,name:'하나 6번도로',region:'하나',theme:'forest',concept:'물풍경시티에서 강과 계절 연구소를 지나 전기돌동굴로 오르는 연구도로',landmark:'계절 연구소와 목재 다리',x:driftveil.x,y:driftveil.y-1};
  world.spawns[UNOVA_ROUTE_SIX]={x:19,y:84};
  world.outdoors[UNOVA_ROUTE_SIX]={objects:routeObjects,signs:[
    {x:17,y:82,direction:'down',destination:driftveil.id,name:'물풍경시티',event:'tourRouteSixSign',pages:['↓ 물풍경시티','시장과 물풍경도개교 방향이다.']},
    {x:22,y:5,direction:'up',destination:CHARGESTONE_1F,name:'전기돌동굴 1층',event:'tourRouteSixSign',pages:['↑ 전기돌동굴 1층 · 궐수시티','동굴 본선은 B1F를 거쳐 북부 출구로 이어진다.']},
  ]};
  const labRows=Array.from({length:22},(_,y)=>Array.from({length:28},(_,x)=>x>=2&&x<=25&&y>=3&&y<=19?'.':'#'));
  labRows[20][14]='.';labRows[21][14]='.';
  const labObjects=[
    {kind:'plants' as const,name:'계절 식물 비교대',pages:['같은 강가에서 기록한 네 계절의 잎과 씨앗 표본이다.','실제 계절 변화가 아니라 연구원이 모아 둔 고정 전시다.'],event:'tourRouteSixLabPlants',x:4,y:7,w:4,h:2},
    {kind:'chart' as const,name:'강물 높이 기록판',pages:['목재 다리 기둥에서 읽은 강물 높이가 날짜별로 표시돼 있다.','현재 본선은 수상이동 없이 두 다리로 건널 수 있다.'],event:'tourRouteSixLabRiver',x:19,y:7,w:4,h:2},
    {kind:'workbench' as const,name:'동행 관찰 기록대',pages:['파트너와 함께 본 풀·바람·결정 조각을 적는 빈 기록지다.','특정 포켓몬을 잡거나 모든 계절 모습을 모을 필요는 없다.'],event:'tourRouteSixLabJournal',x:4,y:15,w:5,h:2},
    {kind:'model' as const,name:'6번도로 입체 지도',pages:['남쪽 물풍경시티에서 연구소와 목재 다리를 지나 북쪽 전기돌동굴로 이어진다.','동굴은 1층 남부에서 B1F를 거쳐 1층 북부와 궐수시티로 연결된다.'],event:'tourRouteSixLabMap',x:18,y:14,w:5,h:3},
  ];
  for(const object of labObjects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++)labRows[y][x]='#';
  world.rooms[ROUTE_SIX_LAB]={style:'lab',title:'6번도로 계절 연구소',host:{x:14,y:6},greeting:['6번도로의 강과 식물 흔적을 계절별로 비교하는 작은 연구소입니다.','전시는 고정 관찰 자료이며 포획·보상·통행 조건은 없습니다.'],objects:labObjects};
  world.maps[ROUTE_SIX_LAB]={id:ROUTE_SIX_LAB,name:'하나 6번도로 · 계절 연구소',width:28,height:22,background:ROUTE_SIX_LAB,walkable:labRows.map(row=>row.join('')),terrain:[],warps:[{x:14,y:21,to:UNOVA_ROUTE_SIX,spawn:{x:13,y:28},entry:'down',facing:'down'}],npcs:[{id:'routeSixLabResearcher',name:'계절 연구원',sprite:'scientist_f',x:14,y:6,facing:'down',dialogue:'tourRouteSixLabHost'}],props:labObjects.flatMap(object=>Array.from({length:object.h},(_,dy)=>Array.from({length:object.w},(_,dx)=>({x:object.x+dx,y:object.y+dy,dialogue:object.event}))).flat())};
  world.spawns[ROUTE_SIX_LAB]={x:14,y:18};
  world.parents[ROUTE_SIX_LAB]=world.passagePlaces[UNOVA_ROUTE_SIX];

  const one=Array.from({length:56},()=>Array<string>(64).fill('#'));
  open(one,29,43,6,12);open(one,12,43,23,5);open(one,12,31,5,16);open(one,14,29,25,5);open(one,35,20,5,14);
  open(one,28,1,7,12);open(one,28,9,16,5);open(one,40,9,5,14);open(one,30,19,15,5);
  const oneObjects=[
    {name:'입구 학습 결정',event:'tourChargestoneLearningCrystal',cells:[{x:27,y:45}],pages:['작은 결정이 큰 자석 바위 쪽을 향해 떠 있다.','자석 바위 방향을 확인하고 안전하게 밀기 동작을 배울 수 있다.']},
    {name:'전기석 관찰벽',event:'tourChargestoneWall',cells:[{x:38,y:28}],pages:['검은 암반 사이 푸른 결정에서 가느다란 빛이 흐른다.','손을 대지 않고 표시선 밖에서 관찰한다.']},
    {name:'북부 출구 결정',event:'tourChargestoneNorthCrystal',cells:[{x:35,y:11}],pages:['위층 출구 쪽으로 갈수록 결정의 빛이 옅어진다.','북쪽 길은 궐수시티 활주로 외곽으로 이어진다.']},
  ];
  for(const object of oneObjects)for(const cell of object.cells)one[cell.y][cell.x]='#';
  world.maps[CHARGESTONE_1F]={id:CHARGESTONE_1F,name:'전기돌동굴 1층',width:64,height:56,background:CHARGESTONE_1F,walkable:one.map(row=>row.join('')),terrain:[],
    warps:[
      {x:31,y:54,to:UNOVA_ROUTE_SIX,spawn:{x:19,y:3},entry:'down',facing:'down'},
      {x:15,y:32,to:CHARGESTONE_B1F,spawn:{x:7,y:42},entry:'left',facing:'left'},
      {x:42,y:21,to:CHARGESTONE_B1F,spawn:{x:48,y:7},entry:'right',facing:'right'},
      {x:31,y:1,to:mistralton.id,spawn:{...toMistralton.spawn},entry:'up',facing:toMistralton.facing},
    ],
    npcs:[{id:'chargestoneGuide',name:'전기돌동굴 조사원',sprite:'scientist_f',x:22,y:44,facing:'right',dialogue:'tourChargestoneGuide'}],
    props:[{x:29,y:51,dialogue:'tourChargestoneSign'},{x:29,y:5,dialogue:'tourChargestoneSign'},...objectProps(oneObjects)],
  };
  const basement=Array.from({length:48},()=>Array<string>(56).fill('#'));
  open(basement,5,39,8,6);open(basement,9,27,5,16);open(basement,9,25,18,5);open(basement,23,16,5,14);
  open(basement,23,14,20,5);open(basement,39,6,5,13);open(basement,41,5,10,5);
  open(basement,16,34,9,3);open(basement,16,29,3,8);open(basement,31,18,3,10);open(basement,31,25,10,3);
  for(let x=23;x<=27;x++)basement[23][x]='#';
  const basementObjects=[
    {name:'본선 이동 결정',event:'tourChargestoneMainCrystal',cells:[{x:25,y:23}],pages:['좁은 통로의 작은 결정이 북쪽 자석 바위를 향하고 있다.','입구에서 배운 방향대로 밀면 북쪽 계단으로 가는 길이 열린다.']},
    {name:'자석 바위 배열',event:'tourChargestoneMagnetRocks',cells:[{x:20,y:28},{x:34,y:24}],pages:['큰 자석 바위 사이에 작은 결정이 이동할 여백이 남아 있다.','결정은 가까운 자석 바위 방향으로만 밀 수 있다.']},
    {name:'아래층 균열 전망',event:'tourChargestoneLowerView',cells:[{x:27,y:17}],pages:['난간 아래로 더 깊은 결정층이 희미하게 보인다.','선택 B2F는 후속 후보이며 현재 내려가는 길은 없다.']},
  ];
  for(const object of basementObjects)for(const cell of object.cells)basement[cell.y][cell.x]='#';
  world.maps[CHARGESTONE_B1F]={id:CHARGESTONE_B1F,name:'전기돌동굴 B1F',width:56,height:48,background:CHARGESTONE_B1F,walkable:basement.map(row=>row.join('')),terrain:[],
    warps:[{x:6,y:42,to:CHARGESTONE_1F,spawn:{x:16,y:32},entry:'down',facing:'right'},{x:49,y:7,to:CHARGESTONE_1F,spawn:{x:41,y:21},entry:'up',facing:'left'}],
    npcs:[{id:'chargestoneHiker',name:'결정길 산행객',sprite:'worker',x:25,y:35,facing:'left',dialogue:'tourChargestoneHiker'}],
    props:[{x:8,y:38,dialogue:'tourChargestoneSign'},{x:47,y:10,dialogue:'tourChargestoneSign'},...objectProps(basementObjects)],
  };
  world.passages[CHARGESTONE_1F]={id:CHARGESTONE_1F,a:driftveil,b:mistralton,kind:'cave',bend:31};
  world.passages[CHARGESTONE_B1F]={id:CHARGESTONE_B1F,a:driftveil,b:mistralton,kind:'cave',bend:27};
  world.passagePlaces[CHARGESTONE_1F]={id:CHARGESTONE_1F,name:'전기돌동굴 1층',region:'하나',theme:'cave',concept:'남부 입구와 북부 출구가 B1F 경유로 이어지는 푸른 전기 결정 동굴',landmark:'입구 학습 결정',x:mistralton.x,y:mistralton.y+1};
  world.passagePlaces[CHARGESTONE_B1F]={id:CHARGESTONE_B1F,name:'전기돌동굴 B1F',region:'하나',theme:'cave',concept:'자석 바위와 결정 다리를 돌아 1층 북부로 오르는 지하 본선',landmark:'자석 바위 배열',x:mistralton.x+.25,y:mistralton.y+1};
  world.spawns[CHARGESTONE_1F]={x:31,y:52};world.spawns[CHARGESTONE_B1F]={x:7,y:42};
  world.outdoors[CHARGESTONE_1F]={objects:oneObjects,signs:[
    {x:29,y:51,direction:'down',destination:UNOVA_ROUTE_SIX,name:'하나 6번도로',event:'tourChargestoneSign',pages:['↓ 하나 6번도로 · 물풍경시티','남부 입구로 되돌아갈 수 있다.']},
    {x:29,y:5,direction:'up',destination:mistralton.id,name:'궐수시티',event:'tourChargestoneSign',pages:['↑ 궐수시티','북부 출구는 공항 도시 외곽으로 이어진다.']},
  ]};
  world.outdoors[CHARGESTONE_B1F]={objects:basementObjects,signs:[
    {x:8,y:38,direction:'down',destination:CHARGESTONE_1F,name:'1층 남부',event:'tourChargestoneSign',pages:['↓ 전기돌동굴 1층 남부','6번도로와 물풍경시티 방향이다.']},
    {x:47,y:10,direction:'up',destination:CHARGESTONE_1F,name:'1층 북부',event:'tourChargestoneSign',pages:['↑ 전기돌동굴 1층 북부','궐수시티 출구 방향이다.']},
  ]};
  driftveilExit.spawn={x:19,y:84};driftveilExit.facing='up';
  mistraltonExit.to=CHARGESTONE_1F;mistraltonExit.spawn={x:31,y:3};mistraltonExit.facing='down';
  const driftveilSign=world.outdoors[driftveil.id].signs.find(sign=>sign.destination===mistralton.id);
  if(driftveilSign){driftveilSign.destination=UNOVA_ROUTE_SIX;driftveilSign.name='하나 6번도로';driftveilSign.pages=['북쪽 → 하나 6번도로\n전기돌동굴 · 궐수시티 방향','강과 계절 연구소를 지나 동굴 남부 입구로 이어집니다.'];}
  const mistraltonSign=world.outdoors[mistralton.id].signs.find(sign=>sign.destination===driftveil.id);
  if(mistraltonSign){mistraltonSign.destination=CHARGESTONE_1F;mistraltonSign.name='전기돌동굴 1층';mistraltonSign.pages=['남쪽 → 전기돌동굴 1층\nB1F · 6번도로 · 물풍경시티 방향','동굴 본선은 B1F를 거쳐 남부 입구로 이어집니다.'];}
}

export function paintUnovaRouteSix(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const cave=map.id!==UNOVA_ROUTE_SIX,paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';paintTourGround(c,images['town-reference'],px,py,cave?'cave':'forest');if(walk)paths.add(x+','+y);else if(cave){fill(px,py,16,16,'#253a43');fill(px+2,py+2,10,5,'#405761');if((x+y)%5===0)fill(px+9,py+5,3,8,'#5ac4d1');}else{fill(px,py,16,16,'#4d7752');fill(px+2,py+2,10,5,'#79a26c');}}
  paintTourPaths(c,images['town-reference'],paths,cave?'cave':'forest');
  if(cave)for(const p of map.props.filter(prop=>prop.dialogue!=='tourChargestoneMainCrystal'&&/Crystal|Magnet|Wall|Learning/.test(prop.dialogue))){fill(p.x*16+3,p.y*16+2,10,13,'#347d91');fill(p.x*16+6,p.y*16,4,12,'#8de1df');fill(p.x*16+7,p.y*16+2,2,5,'#e2fff1');}
  else{for(let y=18;y<72;y++){fill(2*16,y*16,5*16,16,'#4b94ac');fill(3*16+(y%3)*8,y*16+6,28,1,'#a6d6d3');}for(const y of [34,58]){fill(6*16,y*16,12*16,3*16,'#8b6f4e');for(let x=7;x<18;x+=3)fill(x*16,y*16,3,48,'#5b594c');}fill(11*16,23*16,6*16,4*16,'#d8d2a8');fill(11*16,23*16,6*16,12,'#6e9b72');fill(13*16,26*16,16,16,'#765744');}
}

export function paintChargestoneMainCrystal(c:CanvasRenderingContext2D,moved:boolean){
  const x=(moved?28:25)*16,y=(moved?20:23)*16;
  c.fillStyle='#347d91';c.fillRect(x+3,y+2,10,13);
  c.fillStyle='#8de1df';c.fillRect(x+6,y,4,12);
  c.fillStyle='#e2fff1';c.fillRect(x+7,y+2,2,5);
}
