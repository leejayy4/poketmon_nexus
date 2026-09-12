import type { GameMap,Point } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const KANTO_ROUTE_SIX='tour_kanto_route_6' as const;
export const KANTO_UNDERGROUND_NS='tour_kanto_underground_ns' as const;
export const KANTO_ROUTE_FIVE='tour_kanto_route_5' as const;
const COMPAT_ROUTE='tour_pass_vermilion_cerulean' as const;

/** Insert Route 6 at Vermilion's north edge while retaining the old through-route for save compatibility. */
export function installKantoRouteSix(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const city=world.places.find(p=>p.id==='tour_vermilion')!;
  const cerulean=world.places.find(p=>p.id==='tour_cerulean')!;
  const cityMap=world.maps[city.id],ceruleanMap=world.maps[cerulean.id],compat=world.maps[COMPAT_ROUTE];
  const cityExit=cityMap.warps.find(w=>w.to===COMPAT_ROUTE)!;
  const ceruleanExit=ceruleanMap.warps.find(w=>w.to===COMPAT_ROUTE)!;
  const compatReturn=compat.warps.find(w=>w.to===city.id)!;
  const compatForward=compat.warps.find(w=>w.to===cerulean.id)!;
  const citySpawn={...compatReturn.spawn};
  const width=28,height=56,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // A gentle northbound road alternates between open verge and low embankment.
  open(12,1,4,10);open(10,8,6,12);open(9,17,4,11);open(9,25,8,4);
  open(14,26,4,13);open(12,36,6,10);open(12,43,4,12);
  open(4,12,8,3);open(4,13,3,9);open(5,19,6,3); // western rest loop
  open(16,32,8,3);open(21,33,3,9);open(15,39,9,3); // eastern raised verge
  open(7,47,7,3);open(6,48,3,5);open(8,50,6,3); // port-side observation bend
  rows[1][14]='.';rows[height-2][14]='.';
  const signs=[
    {x:17,y:51,direction:'down' as const,destination:city.id,name:'6번도로 남쪽 표지',event:'journeySign',pages:['↓ 남쪽 갈색시티\n↑ 북쪽 지하통로 방향','항구를 떠나 완만한 길을 따라 북쪽으로 올라간다.']},
    {x:17,y:5,direction:'up' as const,destination:KANTO_UNDERGROUND_NS,name:'6번도로 북쪽 표지',event:'journeySign',pages:['↓ 남쪽 갈색시티\n↑ 북쪽 남북 지하통로','지하통로와 5번도로를 지나 블루시티로 이어진다.']},
  ];
  const objects=[
    {name:'항구 바람 쉼터',event:'tourRoute6Rest',cells:[{x:6,y:18}],pages:['낮은 나무 울타리가 항구에서 불어오는 바람을 막아 준다.\n동료와 쉬고 남쪽 갈색시티에서 상태를 돌볼 수 있다.']},
    {name:'완만한 둑길',event:'tourRoute6Bank',cells:[{x:22,y:37}],pages:['도로 옆 둑이 조금 높아져 갈색시티의 지붕이 보인다.\n큰길은 남북 양쪽으로 다시 이어진다.']},
    {name:'풀잎 사이 발자국',event:'tourRoute6Tracks',cells:[{x:8,y:49}],pages:['작은 포켓몬이 물가와 풀 가장자리를 오간 발자국이다.\n길 위에서는 흔적만 살피고 서식지를 어지럽히지 말자.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_SIX]={id:KANTO_ROUTE_SIX,name:'관동 6번도로',width,height,background:KANTO_ROUTE_SIX,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:14,y:height-2,to:city.id,spawn:citySpawn,entry:'down',facing:compatReturn.facing},
      {x:14,y:1,to:KANTO_UNDERGROUND_NS,spawn:{x:12,y:68},entry:'up',facing:'up'},
    ],
    terrain:[],
    npcs:[{id:'route6Traveler',name:'6번도로 여행자',sprite:'rancher',x:11,y:23,facing:'down',dialogue:'journeyWalker'}],
    props:[...signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_ROUTE_SIX]={id:KANTO_ROUTE_SIX,a:city,b:cerulean,kind:'road',bend:14};
  world.passagePlaces[KANTO_ROUTE_SIX]={id:KANTO_ROUTE_SIX,name:'관동 6번도로',region:'관동',theme:'forest',concept:'갈색시티에서 지하통로 방향으로 올라가는 완만한 남북길',landmark:'항구 바람 쉼터',x:city.x,y:(city.y+cerulean.y)/2};
  world.spawns[KANTO_ROUTE_SIX]={x:14,y:52};world.outdoors[KANTO_ROUTE_SIX]={objects,signs};
  cityExit.to=KANTO_ROUTE_SIX;cityExit.spawn={x:14,y:52};cityExit.facing='up';

  const tunnelWidth=24,tunnelHeight=72,tunnelRows=Array.from({length:tunnelHeight},()=>Array<string>(tunnelWidth).fill('#'));
  const tunnelOpen=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)tunnelRows[j][i]='.';};
  // Long tiled spine with alternating service and rest alcoves.
  tunnelOpen(10,1,5,70);tunnelOpen(6,9,5,8);tunnelOpen(5,13,6,4);
  tunnelOpen(14,24,5,9);tunnelOpen(14,28,6,4);tunnelOpen(6,41,5,9);
  tunnelOpen(5,45,6,4);tunnelOpen(14,56,5,8);tunnelOpen(14,59,6,4);
  tunnelRows[1][12]='.';tunnelRows[tunnelHeight-2][12]='.';
  const tunnelSigns=[
    {x:8,y:66,direction:'down' as const,destination:KANTO_ROUTE_SIX,name:'지하통로 남쪽 출입 안내',event:'journeySign',pages:['↓ 남쪽 6번도로 · 갈색시티\n↑ 북쪽 5번도로 · 블루시티 방향','긴 통로 안에서는 벽의 남북 화살표를 따라간다.']},
    {x:8,y:5,direction:'up' as const,destination:KANTO_ROUTE_FIVE,name:'지하통로 북쪽 출입 안내',event:'journeySign',pages:['↓ 남쪽 6번도로 · 갈색시티\n↑ 북쪽 5번도로 · 블루시티','북쪽 출입구에서 5번도로를 따라 블루시티로 올라간다.']},
  ];
  const tunnelObjects=[
    {name:'남북 노선 벽화',event:'tourUndergroundRouteWall',cells:[{x:6,y:14}],pages:['푸른 선은 북쪽 블루시티, 주황 선은 남쪽 갈색시티를 가리킨다.\n6번도로 → 지하통로 → 5번도로 순서가 그려져 있다.']},
    {name:'환기 설비',event:'tourUndergroundVent',cells:[{x:18,y:29}],pages:['천장 환풍기가 일정한 소리로 돌아간다.\n포켓몬이 놀라지 않도록 설비 앞에서는 천천히 걷자.']},
    {name:'통로 휴게 벤치',event:'tourUndergroundBench',cells:[{x:6,y:46}],pages:['긴 통로 중간에 사람과 포켓몬이 함께 쉬는 낮은 벤치가 있다.\n회복이 필요하면 남쪽 갈색시티 센터로 돌아갈 수 있다.']},
    {name:'북쪽 출입구 시계',event:'tourUndergroundClock',cells:[{x:18,y:60}],pages:['출입구까지 남은 시간을 가늠하는 시계다.\n북쪽으로 나가면 5번도로와 블루시티 방향이다.']},
  ];
  for(const sign of tunnelSigns)tunnelRows[sign.y][sign.x]='#';
  for(const object of tunnelObjects)for(const cell of object.cells)tunnelRows[cell.y][cell.x]='#';
  world.maps[KANTO_UNDERGROUND_NS]={id:KANTO_UNDERGROUND_NS,name:'관동 남북 지하통로',width:tunnelWidth,height:tunnelHeight,background:KANTO_UNDERGROUND_NS,walkable:tunnelRows.map(row=>row.join('')),
    warps:[
      {x:12,y:tunnelHeight-2,to:KANTO_ROUTE_SIX,spawn:{x:14,y:3},entry:'down',facing:'down'},
      {x:12,y:1,to:KANTO_ROUTE_FIVE,spawn:{x:14,y:52},entry:'up',facing:'up'},
    ],
    terrain:[],
    npcs:[{id:'undergroundCommuter',name:'지하통로 여행자',sprite:'ace_trainer_f',x:13,y:36,facing:'left',dialogue:'journeyWalker'}],
    props:[...tunnelSigns.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...tunnelObjects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_UNDERGROUND_NS]={id:KANTO_UNDERGROUND_NS,a:city,b:cerulean,kind:'road',bend:12};
  world.passagePlaces[KANTO_UNDERGROUND_NS]={id:KANTO_UNDERGROUND_NS,name:'관동 남북 지하통로',region:'관동',theme:'city',concept:'6번도로와 5번도로 사이를 잇는 긴 보행 지하통로',landmark:'남북 노선 벽화',x:city.x,y:(city.y+cerulean.y)/2};
  world.spawns[KANTO_UNDERGROUND_NS]={x:12,y:68};world.outdoors[KANTO_UNDERGROUND_NS]={objects:tunnelObjects,signs:tunnelSigns};

  const routeWidth=28,routeHeight=56,routeRows=Array.from({length:routeHeight},()=>Array<string>(routeWidth).fill('#'));
  const routeOpen=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)routeRows[j][i]='.';};
  // Northbound main road, care-yard frontage, and a shallow-water observation loop.
  routeOpen(12,1,4,10);routeOpen(10,8,6,13);routeOpen(9,18,5,12);
  routeOpen(11,27,7,11);routeOpen(13,35,5,20);
  routeOpen(4,11,7,3);routeOpen(4,12,3,13);routeOpen(5,22,6,3); // care-yard frontage
  routeOpen(17,29,7,3);routeOpen(21,30,3,10);routeOpen(16,37,8,3); // pond loop
  routeOpen(7,44,7,3);routeOpen(6,45,3,7);routeOpen(8,49,6,3); // underground approach garden
  routeRows[1][14]='.';routeRows[routeHeight-2][14]='.';
  const routeSigns=[
    {x:17,y:51,direction:'down' as const,destination:KANTO_UNDERGROUND_NS,name:'5번도로 남쪽 표지',event:'journeySign',pages:['↓ 남쪽 남북 지하통로 · 6번도로 · 갈색시티\n↑ 북쪽 블루시티 방향','지하통로 출입구 앞에서는 오가는 여행자와 동료를 위해 길을 비워 둔다.']},
    {x:17,y:5,direction:'up' as const,destination:cerulean.id,name:'5번도로 북쪽 표지',event:'journeySign',pages:['↓ 남쪽 지하통로 · 갈색시티\n↑ 북쪽 블루시티','완만한 둑길을 지나면 블루시티 남쪽 출구로 이어진다.']},
  ];
  const routeObjects=[
    {name:'돌봄집 외부 울타리',event:'tourRoute5CareFence',cells:[{x:5,y:18}],pages:['울타리 안쪽에서 사람이 포켓몬과 천천히 걷고 있다.\n현재 이곳은 길가 풍경이며 포켓몬을 맡기는 서비스는 제공하지 않는다.']},
    {name:'물웅덩이 관찰 난간',event:'tourRoute5Pond',cells:[{x:22,y:35}],pages:['비가 고인 얕은 물웅덩이 주변에 작은 발자국이 남았다.\n본선에서 벗어난 짧은 길은 다시 북쪽 도로로 합류한다.']},
    {name:'지하통로 입구 화단',event:'tourRoute5TunnelGarden',cells:[{x:7,y:48}],pages:['지하통로 입구의 방향을 찾기 쉽도록 낮은 꽃을 줄지어 심었다.\n남쪽은 지하통로와 6번도로, 북쪽은 블루시티다.']},
    {name:'블루 남쪽 도착 둑',event:'tourRoute5CeruleanBank',cells:[{x:10,y:12}],pages:['북쪽으로 블루시티의 푸른 지붕과 수로가 보인다.\n돌아갈 때는 같은 5번도로를 따라 지하통로로 내려간다.']},
  ];
  for(const sign of routeSigns)routeRows[sign.y][sign.x]='#';
  for(const object of routeObjects)for(const cell of object.cells)routeRows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_FIVE]={id:KANTO_ROUTE_FIVE,name:'관동 5번도로',width:routeWidth,height:routeHeight,background:KANTO_ROUTE_FIVE,walkable:routeRows.map(row=>row.join('')),
    warps:[
      {x:14,y:routeHeight-2,to:KANTO_UNDERGROUND_NS,spawn:{x:12,y:3},entry:'down',facing:'down'},
      {x:14,y:1,to:cerulean.id,spawn:{...compatForward.spawn},entry:'up',facing:compatForward.facing},
    ],
    terrain:[
      {kind:'tallGrass',x:7,y:14,w:3,h:3},
      {kind:'tallGrass',x:18,y:31,w:3,h:3},
      {kind:'tallGrass',x:9,y:47,w:3,h:2},
    ],
    npcs:[{id:'route5Walker',name:'5번도로 산책자',sprite:'pokemon_breeder_f',x:15,y:26,facing:'left',dialogue:'journeyWalker'}],
    props:[...routeSigns.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...routeObjects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_ROUTE_FIVE]={id:KANTO_ROUTE_FIVE,a:city,b:cerulean,kind:'road',bend:13};
  world.passagePlaces[KANTO_ROUTE_FIVE]={id:KANTO_ROUTE_FIVE,name:'관동 5번도로',region:'관동',theme:'forest',concept:'남북 지하통로에서 블루시티 남쪽으로 이어지는 완만한 도로',landmark:'돌봄집 외부 울타리',x:cerulean.x,y:(city.y+cerulean.y)/2};
  world.spawns[KANTO_ROUTE_FIVE]={x:14,y:52};world.outdoors[KANTO_ROUTE_FIVE]={objects:routeObjects,signs:routeSigns};
  compatReturn.to=KANTO_ROUTE_FIVE;compatReturn.spawn={x:14,y:3};compatReturn.facing='down';
  ceruleanExit.to=KANTO_ROUTE_FIVE;ceruleanExit.spawn={x:14,y:3};ceruleanExit.facing='down';
}
