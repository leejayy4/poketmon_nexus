import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const UNOVA_ROUTE_FIVE='tour_pass_nimbasa_driftveil' as const;
export const DRIFTVEIL_DRAWBRIDGE='tour_driftveil_drawbridge' as const;

type World={places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

export function installNimbasaWestRoute(world:World){
  const nimbasa=world.places.find(p=>p.id==='tour_nimbasa')!,driftveil=world.places.find(p=>p.id==='tour_driftveil')!;
  const legacy=world.maps[UNOVA_ROUTE_FIVE],routePassage=world.passages[UNOVA_ROUTE_FIVE];if(!legacy||!routePassage)return;
  const fromNimbasa=legacy.warps.find(w=>w.to===nimbasa.id)!,toDriftveil=legacy.warps.find(w=>w.to===driftveil.id)!;
  const nimbasaExit=world.maps[nimbasa.id].warps.find(w=>w.to===UNOVA_ROUTE_FIVE)!;
  const driftveilBack=world.maps[driftveil.id].warps.find(w=>w.to===UNOVA_ROUTE_FIVE)!;
  const route=Array.from({length:28},()=>Array<string>(64).fill('#'));
  open(route,1,11,14,4);open(route,12,8,4,7);open(route,14,8,18,4);open(route,29,8,4,10);open(route,31,14,17,4);open(route,45,9,4,9);open(route,47,9,15,4);
  open(route,18,4,10,3);open(route,18,6,3,4);open(route,25,6,3,3);open(route,35,17,3,7);open(route,35,21,12,3);
  const objects=[
    {name:'푸드트럭 준비대',event:'tourRouteFiveFoodTruck',cells:[{x:17,y:7}],pages:['공연 거리로 향하는 푸드트럭이 재료 상자를 정리하고 있다.','사람과 포켓몬이 쉬는 자리를 가리지 않도록\n큰길 옆 공터에 차를 세운다.']},
    {name:'동행 공연 게시판',event:'tourRouteFivePerformanceBoard',cells:[{x:34,y:14}],pages:['여행자와 파트너가 함께 참여한 작은 공연 사진이 붙어 있다.','서쪽 물풍경도개교의 바람이 강할 때는\n장식을 단단히 고정하라는 메모가 보인다.']},
    {name:'도개교 바람 표지',event:'tourRouteFiveBridgeWeather',cells:[{x:51,y:8}],pages:['물풍경도개교 위 바람과 개폐 점검 시간을 알리는 표지다.','현재 통행을 막는 조건은 없으며\n서쪽 큰길을 따라 다리 입구로 갈 수 있다.']},
  ];
  for(const object of objects)for(const cell of object.cells)route[cell.y][cell.x]='#';
  legacy.name='하나 5번도로';legacy.width=64;legacy.height=28;legacy.background=UNOVA_ROUTE_FIVE;legacy.walkable=route.map(row=>row.join(''));legacy.terrain=[];
  legacy.warps=[
    {x:1,y:13,to:DRIFTVEIL_DRAWBRIDGE,spawn:{x:85,y:13},entry:'left',facing:'left'},
    {...fromNimbasa,x:62,y:11,to:nimbasa.id,entry:'right'},
  ];
  legacy.npcs=[{id:'routeFivePerformer',name:'5번도로 공연가',sprite:'ace_trainer_f',x:38,y:22,facing:'left',dialogue:'journeyWalker'}];
  legacy.props=[{x:4,y:10,dialogue:'journeySign'},{x:59,y:8,dialogue:'journeySign'},...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))];
  world.passages[UNOVA_ROUTE_FIVE]={...routePassage,a:nimbasa,b:driftveil,kind:'road',bend:15};
  world.passagePlaces[UNOVA_ROUTE_FIVE]={id:UNOVA_ROUTE_FIVE,name:'하나 5번도로',region:'하나',theme:'forest',concept:'뇌문시티 공연 거리에서 물풍경도개교 동쪽 입구로 이어지는 완만한 들길',landmark:'여행 공연 공터',x:(nimbasa.x+driftveil.x)/2,y:(nimbasa.y+driftveil.y)/2};
  world.spawns[UNOVA_ROUTE_FIVE]={x:2,y:13};
  world.outdoors[UNOVA_ROUTE_FIVE]={objects,signs:[
    {x:4,y:10,direction:'left',destination:DRIFTVEIL_DRAWBRIDGE,name:'물풍경도개교',event:'journeySign',pages:['← 물풍경도개교 · 물풍경시티','다리 위 중앙 보행로를 따라 이동한다.']},
    {x:59,y:8,direction:'right',destination:nimbasa.id,name:'뇌문시티',event:'journeySign',pages:['→ 뇌문시티','공연 거리와 놀이공원 방향이다.']},
  ]};

  const bridge=Array.from({length:28},()=>Array<string>(88).fill('#'));
  open(bridge,1,11,86,5);open(bridge,18,9,14,2);open(bridge,55,16,14,2);
  const bridgeObjects=[
    {name:'도개 장치 관찰판',event:'tourDrawbridgeMechanism',cells:[{x:28,y:10}],pages:['큰 다리 상판을 들어 올리는 도르래와 균형추 구조를 그린 판이다.','관리원이 통행로와 수면을 모두 확인한 뒤\n장치를 움직인다고 적혀 있다.']},
    {name:'날개 포켓몬 관찰 자리',event:'tourDrawbridgeWingWatch',cells:[{x:62,y:17}],pages:['강바람을 타는 포켓몬을 멀리서 살피는 표시선이다.','이 장소에는 아직 야생 조우나\n떨어지는 도구 획득이 연결되어 있지 않다.']},
  ];
  for(const object of bridgeObjects)for(const cell of object.cells)bridge[cell.y][cell.x]='#';
  world.maps[DRIFTVEIL_DRAWBRIDGE]={id:DRIFTVEIL_DRAWBRIDGE,name:'물풍경도개교',width:88,height:28,background:DRIFTVEIL_DRAWBRIDGE,walkable:bridge.map(row=>row.join('')),terrain:[],
    warps:[{x:1,y:13,to:driftveil.id,spawn:{...toDriftveil.spawn},entry:'left',facing:toDriftveil.facing},{x:86,y:13,to:UNOVA_ROUTE_FIVE,spawn:{x:2,y:13},entry:'right',facing:'right'}],
    npcs:[{id:'drawbridgeKeeper',name:'도개교 관리원',sprite:'worker',x:46,y:14,facing:'up',dialogue:'journeyWalker'}],
    props:[{x:5,y:10,dialogue:'journeySign'},{x:82,y:10,dialogue:'journeySign'},{x:28,y:10,dialogue:'tourDrawbridgeMechanism'},{x:62,y:17,dialogue:'tourDrawbridgeWingWatch'}],
  };
  world.passages[DRIFTVEIL_DRAWBRIDGE]={id:DRIFTVEIL_DRAWBRIDGE,a:nimbasa,b:driftveil,kind:'coast',bend:44};
  world.passagePlaces[DRIFTVEIL_DRAWBRIDGE]={id:DRIFTVEIL_DRAWBRIDGE,name:'물풍경도개교',region:'하나',theme:'coast',concept:'5번도로와 물풍경시티를 잇는 긴 개폐교의 중앙 보행로',landmark:'도개 장치',x:driftveil.x+.25,y:driftveil.y+.25};
  world.spawns[DRIFTVEIL_DRAWBRIDGE]={x:2,y:13};
  world.outdoors[DRIFTVEIL_DRAWBRIDGE]={objects:bridgeObjects,signs:[
    {x:5,y:10,direction:'left',destination:driftveil.id,name:'물풍경시티',event:'journeySign',pages:['← 물풍경시티','서쪽 교량 끝에서 시장 도시로 들어간다.']},
    {x:82,y:10,direction:'right',destination:UNOVA_ROUTE_FIVE,name:'하나 5번도로',event:'journeySign',pages:['→ 하나 5번도로 · 뇌문시티','동쪽 다리 입구로 돌아간다.']},
  ]};
  nimbasaExit.spawn={x:61,y:11};nimbasaExit.facing='left';
  driftveilBack.to=DRIFTVEIL_DRAWBRIDGE;driftveilBack.spawn={x:2,y:13};driftveilBack.facing='right';
  const citySign=world.outdoors[driftveil.id].signs.find(sign=>sign.destination===nimbasa.id);
  if(citySign){citySign.destination=DRIFTVEIL_DRAWBRIDGE;citySign.name='물풍경도개교';citySign.pages=['남쪽 → 물풍경도개교\n5번도로 · 뇌문시티 방향','다리 중앙 보행로는 같은 길로 왕복할 수 있습니다.'];}
}

export function paintNimbasaWestRoute(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const bridge=map.id===DRIFTVEIL_DRAWBRIDGE,paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    paintTourGround(c,images['town-reference'],px,py,bridge?'coast':'forest');
    if(walk)paths.add(x+','+y);
    else if(bridge){fill(px,py,16,16,'#4f94aa');fill(px+2+(y%2)*4,py+6,8,1,'#a8d4d3');}
    else{fill(px,py,16,16,'#568052');fill(px+2,py+2,11,5,'#7da36a');}
  }
  paintTourPaths(c,images['town-reference'],paths,bridge?'city':'forest');
  if(bridge){
    for(let x=1;x<map.width-1;x++){fill(x*16,10*16+12,16,4,'#4d6064');fill(x*16,16*16,16,3,'#4d6064');}
    for(let x=4;x<map.width-4;x+=6){fill(x*16+6,9*16,3,32,'#65777a');fill(x*16+2,9*16+4,11,3,'#c8c8ae');}
    fill(42*16,10*16,4*16,7*16,'#596b70');fill(43*16,11*16,2*16,5*16,'#b5aa83');
  }else{
    for(const [x,y] of [[17,7],[34,14],[51,8]]){fill(x*16+2,y*16+3,12,11,'#665844');fill(x*16+4,y*16+5,8,5,'#e0cf96');}
  }
}
