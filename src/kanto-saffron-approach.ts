import type { GameMap,Point } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const KANTO_ROUTE_EIGHT='tour_kanto_route_8' as const;
export const KANTO_ROUTE_SEVEN='tour_kanto_route_7' as const;
export const KANTO_UNDERGROUND_EW='tour_kanto_underground_ew' as const;
const COMPAT_EAST='tour_pass_saffron_lavender' as const;
const COMPAT_WEST='tour_pass_celadon_saffron' as const;

/** Insert the official Route 8 surface road while retaining the old direct map for saved positions. */
export function installKantoSaffronApproach(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const celadon=world.places.find(p=>p.id==='tour_celadon')!,saffron=world.places.find(p=>p.id==='tour_saffron')!,lavender=world.places.find(p=>p.id==='tour_lavender')!;
  const celadonMap=world.maps[celadon.id],saffronMap=world.maps[saffron.id],lavenderMap=world.maps[lavender.id];
  const compatEast=world.maps[COMPAT_EAST],compatWest=world.maps[COMPAT_WEST];
  const saffronEastExit=saffronMap.warps.find(w=>w.to===COMPAT_EAST)!;
  const lavenderExit=lavenderMap.warps.find(w=>w.to===COMPAT_EAST)!;
  const toSaffronEast=compatEast.warps.find(w=>w.to===saffron.id)!,toLavender=compatEast.warps.find(w=>w.to===lavender.id)!;
  const width=64,height=28,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // The central street stays encounter-free; grass terraces and the tunnel forecourt are optional loops.
  open(1,12,62,5);open(8,8,11,5);open(8,6,5,4);open(23,15,5,7);open(25,19,12,3);
  open(38,7,6,6);open(41,6,12,3);open(50,8,5,5);open(54,15,4,7);open(48,19,10,3);
  rows[14][1]='.';rows[14][62]='.';
  const signs=[
    {x:58,y:11,direction:'right' as const,destination:lavender.id,name:'8번도로 동쪽 표지',event:'journeySign',pages:['→ 동쪽 보라타운\n← 서쪽 노랑시티 관문','보라타운의 추모 정원에서 도시 외곽의 넓은 길로 이어진다.']},
    {x:5,y:11,direction:'left' as const,destination:saffron.id,name:'8번도로 서쪽 표지',event:'journeySign',pages:['← 서쪽 노랑시티 동쪽 관문\n→ 동쪽 보라타운','현재 지상 관문은 자유롭게 왕복한다. 지하통로 분기는 별도 입구다.']},
  ];
  const objects=[
    {name:'보라 경계 꽃둑',event:'tourRoute8LavenderBank',cells:[{x:53,y:20}],pages:['보라타운에서 날아온 꽃잎이 낮은 둑 아래에 모여 있다.\n동쪽으로 갈수록 추모탑 지붕이 가까워진다.']},
    {name:'노랑 외곽 전광 안내',event:'tourRoute8SaffronBoard',cells:[{x:11,y:8}],pages:['서쪽 노랑시티의 업무 지구와 포켓몬센터 방향이 표시되어 있다.\n실프 사건이나 체육관 개방을 알리는 전광판은 아니다.']},
      {name:'동서 지하통로 동쪽 입구',event:'tourRoute8UndergroundGate',cells:[{x:27,y:20}],pages:['계단 아래 동서 지하통로는 7번도로의 서쪽 출구로 이어진다.\n지상 본선은 노랑시티와 보라타운 사이를 그대로 왕복한다.']},
    {name:'도시 포켓몬 휴게 울타리',event:'tourRoute8CompanionRest',cells:[{x:42,y:8}],pages:['출퇴근 길에서 주민과 포켓몬이 잠시 물을 마시고 쉬는 낮은 울타리다.\n회복 기능은 없으며 치료는 양쪽 도시 포켓몬센터를 이용한다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_EIGHT]={id:KANTO_ROUTE_EIGHT,name:'관동 8번도로',width,height,background:KANTO_ROUTE_EIGHT,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:1,y:14,to:saffron.id,spawn:{...toSaffronEast.spawn},entry:'left',facing:toSaffronEast.facing},
      {x:62,y:14,to:lavender.id,spawn:{...toLavender.spawn},entry:'right',facing:toLavender.facing},
      {x:27,y:21,to:KANTO_UNDERGROUND_EW,spawn:{x:69,y:12},entry:'down',facing:'left'},
    ],terrain:[
      {kind:'tallGrass',x:9,y:9,w:4,h:2},{kind:'tallGrass',x:48,y:19,w:4,h:2},{kind:'tallGrass',x:54,y:17,w:3,h:3},
    ],
    npcs:[
      {id:'route8Commuter',name:'8번도로 통근 여행자',sprite:'ace_trainer_f',x:34,y:14,facing:'right',dialogue:'journeyWalker'},
      {id:'route8Trainer',name:'8번도로 새잡이',sprite:'youngster',x:35,y:20,facing:'left',dialogue:'tourRoute8Trainer'},
    ],
    props:[...signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_ROUTE_EIGHT]={id:KANTO_ROUTE_EIGHT,a:saffron,b:lavender,kind:'road',bend:14};
  world.passagePlaces[KANTO_ROUTE_EIGHT]={id:KANTO_ROUTE_EIGHT,name:'관동 8번도로',region:'관동',theme:'city',concept:'보라타운의 조용한 주거 경계에서 노랑시티 동쪽 관문으로 이어지는 도시 외곽 도로',landmark:'동서 지하통로 동쪽 입구 경계',x:(saffron.x+lavender.x)/2,y:lavender.y};
  world.spawns[KANTO_ROUTE_EIGHT]={x:60,y:14};world.outdoors[KANTO_ROUTE_EIGHT]={objects,signs};
  saffronEastExit.to=KANTO_ROUTE_EIGHT;saffronEastExit.spawn={x:3,y:14};saffronEastExit.facing='right';
  lavenderExit.to=KANTO_ROUTE_EIGHT;lavenderExit.spawn={x:60,y:14};lavenderExit.facing='left';

  const saffronWestExit=saffronMap.warps.find(w=>w.to===COMPAT_WEST)!;
  const celadonExit=celadonMap.warps.find(w=>w.to===COMPAT_WEST)!;
  const toCeladon=compatWest.warps.find(w=>w.to===celadon.id)!,toSaffronWest=compatWest.warps.find(w=>w.to===saffron.id)!;
  const route7Width=48,route7Height=24,route7Rows=Array.from({length:route7Height},()=>Array<string>(route7Width).fill('#'));
  const open7=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)route7Rows[j][i]='.';};
  // A short metropolitan road contrasts Celadon's garden edge with Saffron's dense paving.
  open7(1,10,46,5);open7(6,6,11,4);open7(10,5,10,3);open7(21,13,6,8);open7(25,18,10,3);open7(34,6,8,4);open7(37,5,7,3);
  const route7Signs=[
    {x:4,y:9,direction:'left' as const,destination:celadon.id,name:'7번도로 서쪽 표지',event:'journeySign',pages:['← 서쪽 무지개시티\n→ 동쪽 노랑시티','정원 지구와 백화점이 있는 무지개시티 경계다.']},
    {x:43,y:9,direction:'right' as const,destination:saffron.id,name:'7번도로 동쪽 표지',event:'journeySign',pages:['→ 동쪽 노랑시티\n← 서쪽 무지개시티','노랑시티 서쪽 업무 지구로 이어지는 짧은 도시 도로다.']},
  ];
  const route7Objects=[
    {name:'7번도로 생활 반응 기록대',event:'celadonResearchRoute7Field',cells:[{x:12,y:6}],pages:['무지개시티에서 이어진 화단과 향기 나는 나무가 도로의 소음을 누그러뜨린다.\n백화점 연구 연락을 시작하면 생활 반응 원본을 기록할 수 있다.']},
    {name:'노랑 업무 지구 안내판',event:'tourRoute7SaffronBoard',cells:[{x:39,y:6}],pages:['노랑시티의 포켓몬센터와 역 방향이 표시되어 있다.\n실프 사건이나 체육관 진행을 요구하는 검문은 없다.']},
    {name:'동서 지하통로 서쪽 입구',event:'tourRoute7UndergroundGate',cells:[{x:24,y:19}],pages:['계단 아래 통로는 8번도로 동쪽 입구까지 이어진다.\n노랑시티를 지나지 않고 두 외곽 도로 사이를 걸을 수 있다.']},
  ];
  for(const sign of route7Signs)route7Rows[sign.y][sign.x]='#';
  for(const object of route7Objects)for(const cell of object.cells)route7Rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_SEVEN]={id:KANTO_ROUTE_SEVEN,name:'관동 7번도로',width:route7Width,height:route7Height,background:KANTO_ROUTE_SEVEN,walkable:route7Rows.map(row=>row.join('')),
    warps:[
      {x:1,y:12,to:celadon.id,spawn:{...toCeladon.spawn},entry:'left',facing:toCeladon.facing},
      {x:46,y:12,to:saffron.id,spawn:{...toSaffronWest.spawn},entry:'right',facing:toSaffronWest.facing},
      {x:24,y:20,to:KANTO_UNDERGROUND_EW,spawn:{x:2,y:12},entry:'down',facing:'right'},
    ],terrain:[
      {kind:'tallGrass',x:7,y:7,w:4,h:2},{kind:'tallGrass',x:14,y:5,w:4,h:2},{kind:'tallGrass',x:35,y:7,w:4,h:2},
    ],npcs:[
      {id:'route7Gardener',name:'7번도로 정원 여행자',sprite:'pokemon_breeder_f',x:18,y:12,facing:'left',dialogue:'journeyWalker'},
      {id:'route7Trainer',name:'7번도로 포켓몬 트레이너',sprite:'lass',x:30,y:19,facing:'left',dialogue:'tourRoute7Trainer'},
    ],
    props:[...route7Signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...route7Objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_ROUTE_SEVEN]={id:KANTO_ROUTE_SEVEN,a:celadon,b:saffron,kind:'road',bend:12};
  world.passagePlaces[KANTO_ROUTE_SEVEN]={id:KANTO_ROUTE_SEVEN,name:'관동 7번도로',region:'관동',theme:'city',concept:'무지개시티 정원 경계와 노랑시티 서쪽 업무 지구를 잇는 짧은 도시 도로',landmark:'동서 지하통로 서쪽 입구',x:(celadon.x+saffron.x)/2,y:saffron.y};
  world.spawns[KANTO_ROUTE_SEVEN]={x:2,y:12};world.outdoors[KANTO_ROUTE_SEVEN]={objects:route7Objects,signs:route7Signs};
  celadonExit.to=KANTO_ROUTE_SEVEN;celadonExit.spawn={x:2,y:12};celadonExit.facing='right';
  saffronWestExit.to=KANTO_ROUTE_SEVEN;saffronWestExit.spawn={x:45,y:12};saffronWestExit.facing='left';

  const undergroundWidth=72,undergroundHeight=24,undergroundRows=Array.from({length:undergroundHeight},()=>Array<string>(undergroundWidth).fill('#'));
  const openUnderground=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)undergroundRows[j][i]='.';};
  openUnderground(1,10,70,5);openUnderground(9,7,10,3);openUnderground(27,14,8,4);openUnderground(38,6,8,4);openUnderground(54,14,9,4);
  const undergroundSigns=[
    {x:5,y:9,direction:'left' as const,destination:KANTO_ROUTE_SEVEN,name:'동서 지하통로 서쪽 안내',event:'journeySign',pages:['← 서쪽 7번도로·무지개시티\n→ 동쪽 8번도로·보라타운','노랑시티를 우회하는 보행 통로다. 양쪽 지상 도로로 언제든 되돌아갈 수 있다.']},
    {x:66,y:9,direction:'right' as const,destination:KANTO_ROUTE_EIGHT,name:'동서 지하통로 동쪽 안내',event:'journeySign',pages:['→ 동쪽 8번도로·보라타운\n← 서쪽 7번도로·무지개시티','긴 직선 통로의 색 띠가 동쪽과 서쪽 출구를 구분한다.']},
  ];
  const undergroundObjects=[
    {name:'서쪽 녹색 노선띠',event:'tourUndergroundWestLine',cells:[{x:15,y:8}],pages:['녹색 노선띠가 7번도로와 무지개시티 방향으로 이어진다.']},
    {name:'지하통로 포켓몬 쉼터',event:'tourUndergroundCompanionRest',cells:[{x:31,y:16},{x:58,y:16}],pages:['긴 통로를 걷는 사람과 포켓몬이 함께 쉬는 벤치다.\n회복 기능이나 통행 조건은 없다.']},
    {name:'동쪽 보라색 노선띠',event:'tourUndergroundEastLine',cells:[{x:42,y:8}],pages:['보라색 노선띠가 8번도로와 보라타운 방향으로 이어진다.']},
  ];
  for(const sign of undergroundSigns)undergroundRows[sign.y][sign.x]='#';
  for(const object of undergroundObjects)for(const cell of object.cells)undergroundRows[cell.y][cell.x]='#';
  world.maps[KANTO_UNDERGROUND_EW]={id:KANTO_UNDERGROUND_EW,name:'관동 동서 지하통로',width:undergroundWidth,height:undergroundHeight,background:KANTO_UNDERGROUND_EW,walkable:undergroundRows.map(row=>row.join('')),
    warps:[
      {x:1,y:12,to:KANTO_ROUTE_SEVEN,spawn:{x:24,y:18},entry:'left',facing:'up'},
      {x:70,y:12,to:KANTO_ROUTE_EIGHT,spawn:{x:27,y:19},entry:'right',facing:'up'},
    ],terrain:[],npcs:[{id:'undergroundCommuter',name:'지하통로 통근 여행자',sprite:'ace_trainer_m',x:49,y:12,facing:'left',dialogue:'journeyWalker'}],
    props:[...undergroundSigns.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...undergroundObjects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_UNDERGROUND_EW]={id:KANTO_UNDERGROUND_EW,a:world.passagePlaces[KANTO_ROUTE_SEVEN],b:world.passagePlaces[KANTO_ROUTE_EIGHT],kind:'road',bend:12};
  world.passagePlaces[KANTO_UNDERGROUND_EW]={id:KANTO_UNDERGROUND_EW,name:'관동 동서 지하통로',region:'관동',theme:'city',concept:'7번도로와 8번도로를 노랑시티 남쪽 아래로 잇는 보행 우회 통로',landmark:'동서 색 노선띠와 포켓몬 쉼터',x:saffron.x,y:saffron.y+0.35};
  world.spawns[KANTO_UNDERGROUND_EW]={x:2,y:12};world.outdoors[KANTO_UNDERGROUND_EW]={objects:undergroundObjects,signs:undergroundSigns};
}
