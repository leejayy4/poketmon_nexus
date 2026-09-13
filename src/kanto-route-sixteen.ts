import type { GameMap,Point } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const KANTO_ROUTE_SIXTEEN='tour_kanto_route_16' as const;
export const KANTO_ROUTE_SEVENTEEN='tour_kanto_route_17' as const;
export const KANTO_ROUTE_EIGHTEEN='tour_kanto_route_18' as const;
const COMPAT_CYCLING_ROAD='tour_pass_celadon_fuchsia' as const;

/** Split Celadon's official Route 16 approach from the legacy Route 17/18 compressed road. */
export function installKantoRouteSixteen(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const celadon=world.places.find(place=>place.id==='tour_celadon')!;
  const fuchsia=world.places.find(place=>place.id==='tour_fuchsia')!;
  const cityMap=world.maps[celadon.id],legacy=world.maps[COMPAT_CYCLING_ROAD];
  const cityExit=cityMap.warps.find(warp=>warp.to===COMPAT_CYCLING_ROAD)!;
  const legacyReturn=legacy.warps.find(warp=>warp.to===celadon.id)!;
  const legacyEntry={...cityExit.spawn},citySpawn={...legacyReturn.spawn};
  const width=40,height=56,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
  // A north/south road descends from Celadon's garden edge to the Cycling Road gate.
  open(17,1,6,13);open(15,10,8,13);open(12,20,11,6);open(12,23,6,12);
  open(15,32,9,7);open(18,36,7,19);
  open(5,12,11,4);open(5,14,4,10);open(7,21,7,3); // west rest garden
  open(22,18,12,4);open(30,19,4,11);open(23,27,10,4); // east gate overlook
  open(6,39,13,4);open(6,41,4,9);open(8,47,11,4); // return loop
  rows[1][20]='.';rows[height-2][20]='.';
  const signs=[
    {x:24,y:5,direction:'up' as const,destination:celadon.id,name:'16번도로 북쪽 표지',event:'journeySign',pages:['↑ 북쪽 무지개시티\n↓ 남쪽 17번도로·18번도로·연분홍시티','무지개 남문에서 사이클링로드 입구까지 이어지는 관동 16번도로다.']},
    {x:25,y:50,direction:'down' as const,destination:KANTO_ROUTE_SEVENTEEN,name:'16번도로 남쪽 표지',event:'journeySign',pages:['↑ 북쪽 관동 16번도로·무지개시티\n↓ 남쪽 관동 17번도로 → 18번도로 → 연분홍시티','남쪽에서 긴 내리막17번도로가 시작되고18번도로에서 연분홍 방향으로 꺾인다. 현재는 자전거 없이 도보로 왕복한다.']},
  ];
  const objects=[
    {name:'도시 정원 바람막이',event:'tourRoute16GardenScreen',cells:[{x:7,y:18}],pages:['무지개시티 화단에서 이어진 낮은 나무가 북쪽 도시 바람을 막는다.\n동료와 쉬어도 실제 회복은 일어나지 않는다.']},
    {name:'사이클링로드 전망 난간',event:'tourRoute16CyclingOverlook',cells:[{x:32,y:24}],pages:['남쪽으로17번도로의 긴 내리막과 휴게 구간이 보인다.\n그 끝에서18번도로가 연분홍시티 방향으로 이어진다.']},
    {name:'도보 여행 점검대',event:'tourRoute16WalkingCheck',cells:[{x:8,y:45}],pages:['신발·물·동료 상태와 무지개시티 귀환 방향을 확인하는 점검대다.\n자전거 소지나 포켓몬 포획을 통행 조건으로 요구하지 않는다.']},
    {name:'17번도로 인계 표석',event:'tourRoute16Handoff',cells:[{x:20,y:51}],pages:['이 표석 남쪽에서 관동17번도로가 시작되고 이어서18번도로를 지나 연분홍시티에 닿는다.\n17번과18번은 서로 다른 맵과 출구로 구분된다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_SIXTEEN]={id:KANTO_ROUTE_SIXTEEN,name:'관동 16번도로',width,height,background:KANTO_ROUTE_SIXTEEN,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:20,y:1,to:celadon.id,spawn:citySpawn,entry:'up',facing:'up'},
      {x:20,y:height-2,to:COMPAT_CYCLING_ROAD,spawn:legacyEntry,entry:'down',facing:'down'},
    ],terrain:[
      {kind:'tallGrass',x:5,y:14,w:3,h:8},{kind:'tallGrass',x:30,y:19,w:3,h:9},{kind:'tallGrass',x:6,y:41,w:3,h:8},
    ],
    npcs:[
      {id:'route16Traveler',name:'16번도로 도보 여행자',sprite:'rancher',x:17,y:29,facing:'right',dialogue:'journeyWalker'},
      {id:'route16Pokemon',name:'여행자의 피카츄',sprite:'field-pikachu',x:22,y:29,facing:'left',dialogue:'tourRoute16Pokemon'},
      {id:'route16Trainer',name:'16번도로 관문 트레이너',sprite:'ace_trainer_m',x:28,y:29,facing:'right',dialogue:'tourRoute16Trainer'},
    ],
    props:[...signs.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[KANTO_ROUTE_SIXTEEN]={id:KANTO_ROUTE_SIXTEEN,a:celadon,b:fuchsia,kind:'road',bend:20};
  world.passagePlaces[KANTO_ROUTE_SIXTEEN]={id:KANTO_ROUTE_SIXTEEN,name:'관동 16번도로',region:'관동',theme:'flowers',concept:'무지개시티 남문에서 사이클링로드 관문으로 내려가는 도시 외곽길',landmark:'17번도로 인계 표석',x:celadon.x,y:(celadon.y+fuchsia.y)/2};
  world.spawns[KANTO_ROUTE_SIXTEEN]={x:20,y:3};world.outdoors[KANTO_ROUTE_SIXTEEN]={objects,signs};
  cityExit.to=KANTO_ROUTE_SIXTEEN;cityExit.spawn={x:20,y:3};cityExit.facing='down';
  legacyReturn.to=KANTO_ROUTE_SIXTEEN;legacyReturn.spawn={x:20,y:height-4};legacyReturn.facing='up';
}

/** Replace the normal through-route with distinct Route 17 and Route 18 while retaining the legacy map for old saves. */
export function installKantoCyclingRoad(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const celadon=world.places.find(place=>place.id==='tour_celadon')!,fuchsia=world.places.find(place=>place.id==='tour_fuchsia')!;
  const route16=world.maps[KANTO_ROUTE_SIXTEEN],fuchsiaMap=world.maps[fuchsia.id],legacy=world.maps[COMPAT_CYCLING_ROAD];
  const route16South=route16.warps.find(warp=>warp.to===COMPAT_CYCLING_ROAD)!;
  const fuchsiaExit=fuchsiaMap.warps.find(warp=>warp.to===COMPAT_CYCLING_ROAD)!;
  const oldFuchsiaExit={x:fuchsiaExit.x,y:fuchsiaExit.y};

  const width17=32,height17=88,rows17=Array.from({length:height17},()=>Array<string>(width17).fill('#'));
  const open17=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows17[yy][xx]='.';};
  open17(13,1,7,16);open17(10,13,10,15);open17(9,25,8,17);open17(12,39,8,16);open17(14,52,8,18);open17(11,67,11,20);
  open17(4,18,7,4);open17(4,20,4,10);open17(6,27,5,3);open17(17,32,10,4);open17(24,33,4,11);open17(18,41,10,4);
  open17(5,56,10,4);open17(5,58,4,12);open17(7,67,7,4);open17(20,72,8,4);open17(25,73,3,10);open17(18,80,10,4);
  rows17[1][16]='.';rows17[height17-2][16]='.';
  const signs17=[
    {x:21,y:6,direction:'up' as const,destination:KANTO_ROUTE_SIXTEEN,name:'17번도로 북쪽 표지',event:'journeySign',pages:['↑ 북쪽 관동16번도로·무지개시티\n↓ 남쪽 관동17번도로·18번도로','긴 내리막 본선과 두 휴게 굴곡을 지나 남쪽18번도로로 이어진다.']},
    {x:21,y:82,direction:'down' as const,destination:KANTO_ROUTE_EIGHTEEN,name:'17번도로 남쪽 표지',event:'journeySign',pages:['↑ 북쪽 관동17번도로·16번도로·무지개시티\n↓ 남쪽 관동18번도로·연분홍시티','남쪽 관문에서18번도로의 동서 방향 길로 바뀐다.']},
  ];
  const objects17=[
    {name:'북부 내리막 전망대',event:'tourRoute17NorthView',cells:[{x:6,y:25}],pages:['북쪽16번도로 관문과 무지개시티 방향을 되돌아볼 수 있다.\n낮은 난간 안쪽은 비조우 휴게 공간이다.']},
    {name:'중앙 도보 휴게소',event:'tourRoute17Rest',cells:[{x:25,y:38}],pages:['긴 내리막 중간에서 사람과 포켓몬이 물을 마시는 휴게소다.\n회복 기능과 아이템 지급은 없다.']},
    {name:'남부 바람 표식',event:'tourRoute17WindMarker',cells:[{x:7,y:64}],pages:['바람판이 남쪽18번도로와 연분홍 방향으로 기울어 있다.\n북쪽으로 되돌아가면16번도로와 무지개시티다.']},
  ];
  for(const sign of signs17)rows17[sign.y][sign.x]='#';for(const object of objects17)for(const cell of object.cells)rows17[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_SEVENTEEN]={id:KANTO_ROUTE_SEVENTEEN,name:'관동 17번도로',width:width17,height:height17,background:KANTO_ROUTE_SEVENTEEN,walkable:rows17.map(row=>row.join('')),
    warps:[{x:16,y:1,to:KANTO_ROUTE_SIXTEEN,spawn:{x:20,y:52},entry:'up',facing:'up'},{x:16,y:height17-2,to:KANTO_ROUTE_EIGHTEEN,spawn:{x:3,y:15},entry:'down',facing:'right'}],terrain:[
      {kind:'tallGrass',x:5,y:20,w:3,h:4},{kind:'tallGrass',x:24,y:34,w:3,h:8},{kind:'tallGrass',x:6,y:59,w:3,h:9},{kind:'tallGrass',x:25,y:74,w:2,h:8},
    ],
    npcs:[
      {id:'route17Traveler',name:'17번도로 휴게 여행자',sprite:'ace_trainer_f',x:18,y:48,facing:'left',dialogue:'journeyWalker'},
      {id:'route17Pokemon',name:'여행자의 파치리스',sprite:'field-pachirisu',x:20,y:48,facing:'right',dialogue:'tourRoute17Pokemon'},
      {id:'route17Trainer',name:'17번도로 내리막 트레이너',sprite:'ace_trainer_m',x:20,y:81,facing:'right',dialogue:'tourRoute17Trainer'},
    ],
    props:[...signs17.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects17.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };

  const width18=56,height18=32,rows18=Array.from({length:height18},()=>Array<string>(width18).fill('#'));
  const open18=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows18[yy][xx]='.';};
  open18(1,12,15,7);open18(13,10,14,9);open18(24,13,16,8);open18(37,11,18,8);
  open18(8,19,4,8);open18(9,24,13,4);open18(19,20,4,8);open18(32,6,4,8);open18(33,6,13,4);open18(43,8,4,5);
  rows18[15][1]='.';rows18[15][width18-2]='.';
  const signs18=[
    {x:5,y:10,direction:'left' as const,destination:KANTO_ROUTE_SEVENTEEN,name:'18번도로 서쪽 표지',event:'journeySign',pages:['← 서쪽 관동17번도로·16번도로·무지개시티\n→ 동쪽 관동18번도로·연분홍시티','긴 남북 내리막 뒤 동쪽 연분홍 관문으로 이어지는 짧은 마지막 구간이다.']},
    {x:50,y:10,direction:'right' as const,destination:fuchsia.id,name:'18번도로 동쪽 표지',event:'journeySign',pages:['← 서쪽 관동18번도로·17번도로\n→ 동쪽 연분홍시티','연분홍시티 센터와 남부 도로 안내는 도시 안에서 확인한다.']},
  ];
  const objects18=[
    {name:'17번도로 도착 난간',event:'tourRoute18ArrivalRail',cells:[{x:10,y:25}],pages:['서쪽 관문 너머로17번도로의 긴 내리막이 보인다.\n되돌아가면16번도로와 무지개시티까지 이어진다.']},
    {name:'연분홍 외곽 풀바람터',event:'tourRoute18FuchsiaVerge',cells:[{x:36,y:7}],pages:['동쪽에서 연분홍시티의 낮은 지붕과 습지 바람이 가까워진다.\n현재는 풍경 조사이며 야생 조우 장소로 등록하지 않았다.']},
    {name:'사이클링로드 전 구간 지도',event:'tourRoute18FullChart',cells:[{x:44,y:13}],pages:['무지개시티 → 16번도로 → 17번도로 → 18번도로 → 연분홍시티\n네 구간은 각 출구로 왕복하며 현재 자전거 조건은 없다.']},
  ];
  for(const sign of signs18)rows18[sign.y][sign.x]='#';for(const object of objects18)for(const cell of object.cells)rows18[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_EIGHTEEN]={id:KANTO_ROUTE_EIGHTEEN,name:'관동 18번도로',width:width18,height:height18,background:KANTO_ROUTE_EIGHTEEN,walkable:rows18.map(row=>row.join('')),
    warps:[{x:1,y:15,to:KANTO_ROUTE_SEVENTEEN,spawn:{x:16,y:height17-4},entry:'left',facing:'up'},{x:width18-2,y:15,to:fuchsia.id,spawn:{x:3,y:18},entry:'right',facing:'right'}],terrain:[
      {kind:'tallGrass',x:9,y:20,w:3,h:6},{kind:'tallGrass',x:20,y:21,w:3,h:6},{kind:'tallGrass',x:34,y:7,w:11,h:3},
    ],
    npcs:[
      {id:'route18Traveler',name:'18번도로 귀환 여행자',sprite:'rancher',x:29,y:16,facing:'right',dialogue:'journeyWalker'},
      {id:'route18Pokemon',name:'여행자의 고라파덕',sprite:'field-psyduck',x:31,y:17,facing:'left',dialogue:'tourRoute18Pokemon'},
      {id:'route18Trainer',name:'18번도로 새잡이',sprite:'youngster',x:19,y:25,facing:'right',dialogue:'tourRoute18Trainer'},
    ],
    props:[...signs18.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects18.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[KANTO_ROUTE_SEVENTEEN]={id:KANTO_ROUTE_SEVENTEEN,a:celadon,b:fuchsia,kind:'road',bend:16};
  world.passages[KANTO_ROUTE_EIGHTEEN]={id:KANTO_ROUTE_EIGHTEEN,a:celadon,b:fuchsia,kind:'road',bend:15};
  world.passagePlaces[KANTO_ROUTE_SEVENTEEN]={id:KANTO_ROUTE_SEVENTEEN,name:'관동 17번도로',region:'관동',theme:'flowers',concept:'16번도로 남쪽에서 길게 내려가18번도로 관문에 닿는 사이클링로드 본선',landmark:'중앙 도보 휴게소',x:celadon.x,y:(celadon.y+fuchsia.y)/2};
  world.passagePlaces[KANTO_ROUTE_EIGHTEEN]={id:KANTO_ROUTE_EIGHTEEN,name:'관동 18번도로',region:'관동',theme:'forest',concept:'17번도로 남단에서 연분홍시티 서쪽 관문으로 이어지는 마지막 동서길',landmark:'사이클링로드 전 구간 지도',x:(celadon.x+fuchsia.x)/2,y:fuchsia.y};
  world.spawns[KANTO_ROUTE_SEVENTEEN]={x:16,y:3};world.spawns[KANTO_ROUTE_EIGHTEEN]={x:3,y:15};
  world.outdoors[KANTO_ROUTE_SEVENTEEN]={objects:objects17,signs:signs17};world.outdoors[KANTO_ROUTE_EIGHTEEN]={objects:objects18,signs:signs18};
  route16South.to=KANTO_ROUTE_SEVENTEEN;route16South.spawn={x:16,y:3};route16South.facing='down';
  const fuchsiaRows=fuchsiaMap.walkable.map(row=>row.split(''));
  fuchsiaRows[oldFuchsiaExit.y][oldFuchsiaExit.x]='#';fuchsiaRows[18][1]='.';fuchsiaRows[18][2]='.';fuchsiaRows[18][3]='.';
  fuchsiaMap.walkable=fuchsiaRows.map(row=>row.join(''));
  Object.assign(fuchsiaExit,{x:1,y:18,to:KANTO_ROUTE_EIGHTEEN,spawn:{x:width18-4,y:15},entry:'left',facing:'left'});
}
