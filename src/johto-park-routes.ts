import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_35='tour_johto_route_35' as const;
export const JOHTO_NATIONAL_PARK='tour_johto_national_park' as const;
export const JOHTO_ROUTE_36='tour_johto_route_36' as const;
export const JOHTO_ROUTE_37='tour_johto_route_37' as const;
const COMPAT_VIOLET='tour_pass_goldenrod_violet' as const;
const COMPAT_ECRUTEAK='tour_pass_goldenrod_ecruteak' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const props=(objects:ObjectInfo[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

/** Replace Goldenrod's two compatibility shortcuts with the shared 35/Park/36 junction and Route 37. */
export function installJohtoParkRoutes(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const goldenrod=world.places.find(p=>p.id==='tour_goldenrod')!,violet=world.places.find(p=>p.id==='tour_violet')!,ecruteak=world.places.find(p=>p.id==='tour_ecruteak')!;
  const goldenrodMap=world.maps[goldenrod.id],violetMap=world.maps[violet.id],ecruteakMap=world.maps[ecruteak.id];
  const compatV=world.maps[COMPAT_VIOLET],compatE=world.maps[COMPAT_ECRUTEAK];
  const goldenrodNorth=goldenrodMap.warps.find(w=>w.to===COMPAT_VIOLET)!;
  const goldenrodEast=goldenrodMap.warps.find(w=>w.to===COMPAT_ECRUTEAK)!;
  const violetExit=violetMap.warps.find(w=>w.to===COMPAT_VIOLET)!;
  const ecruteakExit=ecruteakMap.warps.find(w=>w.to===COMPAT_ECRUTEAK)!;
  const toGoldenrodV=compatV.warps.find(w=>w.to===goldenrod.id)!;
  const toGoldenrodE=compatE.warps.find(w=>w.to===goldenrod.id)!;
  const toViolet=compatV.warps.find(w=>w.to===violet.id)!;
  const toEcruteak=compatE.warps.find(w=>w.to===ecruteak.id)!;

  const r35=Array.from({length:72},()=>Array<string>(32).fill('#'));
  carve(r35,13,1,7,69);carve(r35,5,47,9,5);carve(r35,5,34,5,18);carve(r35,19,22,8,5);carve(r35,22,22,5,17);carve(r35,18,36,9,4);
  r35[70][14]='.';r35[70][18]='.';
  const objects35:ObjectInfo[]=[
    {name:'금빛 북문 거리표',event:'tourRoute35GoldenrodStone',cells:[{x:11,y:63}],pages:['남쪽은 금빛시티, 북쪽은 자연공원이다.\n도라지와 인주는 공원 너머 36번도로에서 갈라진다.']},
    {name:'도시 외곽 운동장',event:'tourRoute35PracticeYard',cells:[{x:8,y:43}],pages:['금빛 주민과 포켓몬이 길을 막지 않는 안쪽 공터에서 몸을 푼다.\n긴풀 앞 마른 자리에서 선택 배틀을 할 수 있다.']},
    {name:'공원 전 휴게 울타리',event:'tourRoute35ParkRest',cells:[{x:23,y:30}],pages:['자연공원에 들어가기 전 물과 짐을 확인하는 낮은 울타리다.\n회복은 금빛시티 포켓몬센터에서 한다.']},
  ];
  for(const o of objects35)for(const c of o.cells)r35[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_35]={id:JOHTO_ROUTE_35,name:'성도 35번도로',width:32,height:72,background:JOHTO_ROUTE_35,walkable:r35.map(row=>row.join('')),warps:[
    {x:14,y:70,to:goldenrod.id,spawn:{...toGoldenrodV.spawn},entry:'down',facing:toGoldenrodV.facing},
    {x:18,y:70,to:goldenrod.id,spawn:{...toGoldenrodE.spawn},entry:'down',facing:toGoldenrodE.facing},
    {x:16,y:1,to:JOHTO_NATIONAL_PARK,spawn:{x:28,y:52},entry:'up',facing:'up'},
  ],npcs:[
    {id:'route35Commuter',name:'35번도로 공원 여행자',sprite:'ace_trainer_f',x:16,y:39,facing:'down',dialogue:'journeyWalker'},
    {id:'route35Pokemon',name:'운동장의 파치리스',sprite:'field-pachirisu',x:12,y:47,facing:'left',dialogue:'tourRoute35Pokemon'},
    {id:'route35Trainer',name:'35번도로 포켓몬 트레이너',sprite:'school_kid_m',x:8,y:47,facing:'down',dialogue:'tourRoute35Trainer'},
  ],props:props(objects35),terrain:[
    {kind:'tallGrass',x:6,y:48,w:7,h:3},{kind:'tallGrass',x:20,y:23,w:6,h:3},{kind:'tallGrass',x:23,y:36,w:4,h:3},
  ]};

  const park=Array.from({length:56},()=>Array<string>(56).fill('#'));
  carve(park,25,1,7,54);carve(park,8,8,40,5);carve(park,8,8,5,38);carve(park,8,41,40,5);carve(park,43,8,5,38);carve(park,18,17,20,22);carve(park,13,24,31,7);
  const parkObjects:ObjectInfo[]=[
    {name:'자연공원 중앙 분수',event:'tourNationalParkFountain',cells:[{x:27,y:27},{x:28,y:27}],pages:['대칭 산책로 가운데 낮은 분수가 있다.\n행사 시간이 아니어도 사람과 포켓몬이 둘레에서 쉰다.']},
    {name:'곤충 관찰 화단',event:'tourNationalParkBugGarden',cells:[{x:15,y:13}],pages:['꽃과 낮은 풀 사이의 벌레 포켓몬 흔적을 산책로에서 관찰한다.\n곤충채집 대회·포획·보상은 아직 시작되지 않는다.']},
    {name:'공원 행사 게시판',event:'tourNationalParkBoard',cells:[{x:40,y:42}],pages:['현재는 자유 산책 시간이다.\n곤충채집 대회 규칙과 시간제 이벤트는 후속 확정 범위다.']},
  ];
  for(const o of parkObjects)for(const c of o.cells)park[c.y][c.x]='#';
  world.maps[JOHTO_NATIONAL_PARK]={id:JOHTO_NATIONAL_PARK,name:'자연공원',width:56,height:56,background:JOHTO_NATIONAL_PARK,walkable:park.map(row=>row.join('')),warps:[
    {x:28,y:54,to:JOHTO_ROUTE_35,spawn:{x:16,y:3},entry:'down',facing:'down'},
    {x:28,y:1,to:JOHTO_ROUTE_36,spawn:{x:32,y:24},entry:'up',facing:'up'},
  ],npcs:[
    {id:'nationalParkCaretaker',name:'자연공원 관리인',sprite:'rancher',x:39,y:12,facing:'left',dialogue:'journeyWalker'},
    {id:'nationalParkPokemon',name:'관리인의 찌르꼬',sprite:'field-starly',x:40,y:12,facing:'left',dialogue:'tourNationalParkPokemon'},
    {id:'nationalParkTrainer',name:'자연공원 곤충채집가',sprite:'school_kid_m',x:20,y:35,facing:'up',dialogue:'tourNationalParkTrainer'},
  ],props:props(parkObjects),terrain:[
    {kind:'tallGrass',x:19,y:18,w:6,h:4},{kind:'tallGrass',x:14,y:25,w:5,h:5},{kind:'tallGrass',x:32,y:34,w:5,h:4},
  ]};

  const r36=Array.from({length:28},()=>Array<string>(64).fill('#'));
  carve(r36,1,11,62,7);carve(r36,29,15,7,12);carve(r36,45,5,5,8);carve(r36,45,5,15,4);carve(r36,17,5,5,8);carve(r36,17,5,14,4);
  const objects36:ObjectInfo[]=[
    {name:'36번도로 세 갈래 표석',event:'tourRoute36Junction',cells:[{x:32,y:10}],pages:['서쪽은 도라지시티, 남쪽은 자연공원·35번도로·금빛시티, 북동쪽은 37번도로·인주시티다.']},
    {name:'마른나무 우회 표식',event:'tourRoute36TreeMark',cells:[{x:47,y:8}],pages:['길 가장자리의 단단한 나무를 건드리지 않고 남쪽 우회길로 지난다.\n꼬지모 사건·도구·배지 잠금은 아직 적용하지 않았다.']},
  ];
  for(const o of objects36)for(const c of o.cells)r36[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_36]={id:JOHTO_ROUTE_36,name:'성도 36번도로',width:64,height:28,background:JOHTO_ROUTE_36,walkable:r36.map(row=>row.join('')),warps:[
    {x:1,y:14,to:violet.id,spawn:{...toViolet.spawn},entry:'left',facing:toViolet.facing},
    {x:32,y:26,to:JOHTO_NATIONAL_PARK,spawn:{x:28,y:52},entry:'down',facing:'down'},
    {x:62,y:14,to:JOHTO_ROUTE_37,spawn:{x:14,y:52},entry:'right',facing:'right'},
  ],npcs:[
    {id:'route36Guide',name:'36번도로 갈림길 안내원',sprite:'school_kid_f',x:37,y:14,facing:'left',dialogue:'journeyWalker'},
    {id:'route36Trainer',name:'36번도로 새잡이',sprite:'ace_trainer_f',x:25,y:7,facing:'left',dialogue:'tourRoute36Trainer'},
  ],props:props(objects36),terrain:[
    {kind:'tallGrass',x:18,y:6,w:3,h:5},{kind:'tallGrass',x:52,y:6,w:7,h:3},{kind:'tallGrass',x:46,y:10,w:4,h:2},
  ]};

  const r37=Array.from({length:56},()=>Array<string>(28).fill('#'));
  carve(r37,11,1,7,54);carve(r37,4,34,8,5);carve(r37,4,22,5,17);carve(r37,17,13,7,5);carve(r37,20,13,4,17);carve(r37,16,26,8,4);
  const objects37:ObjectInfo[]=[
    {name:'인주 남쪽 단풍 표석',event:'tourRoute37EcruteakStone',cells:[{x:19,y:16}],pages:['북쪽으로 인주시티의 목조 지붕과 오래된 탑이 보인다.\n남쪽은 36번도로의 공유 갈림길이다.']},
    {name:'규토리나무 돌봄터',event:'tourRoute37ApricornGrove',cells:[{x:7,y:29}],pages:['길가 나무와 떨어진 열매를 주민이 구분해 돌본다.\n조사만으로 규토리나 도구를 얻지 않는다.']},
  ];
  for(const o of objects37)for(const c of o.cells)r37[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_37]={id:JOHTO_ROUTE_37,name:'성도 37번도로',width:28,height:56,background:JOHTO_ROUTE_37,walkable:r37.map(row=>row.join('')),warps:[
    {x:14,y:54,to:JOHTO_ROUTE_36,spawn:{x:60,y:14},entry:'down',facing:'left'},
    {x:14,y:1,to:ecruteak.id,spawn:{...toEcruteak.spawn},entry:'up',facing:toEcruteak.facing},
  ],npcs:[
    {id:'route37Traveler',name:'인주로 가는 여행자',sprite:'old_man',x:14,y:31,facing:'up',dialogue:'journeyWalker'},
    {id:'route37Pokemon',name:'단풍길의 삐삐',sprite:'field-clefairy',x:23,y:17,facing:'left',dialogue:'tourRoute37Pokemon'},
    {id:'route37Trainer',name:'37번도로 포켓몬 트레이너',sprite:'pokemon_breeder_f',x:9,y:36,facing:'left',dialogue:'tourRoute37Trainer'},
  ],props:props(objects37),terrain:[
    {kind:'tallGrass',x:5,y:23,w:3,h:5},{kind:'tallGrass',x:18,y:14,w:5,h:3},{kind:'tallGrass',x:20,y:27,w:4,h:3},
  ]};

  for(const [id,name,landmark] of [[JOHTO_ROUTE_35,'성도 35번도로','도시 외곽과 공원 진입'],[JOHTO_NATIONAL_PARK,'자연공원','대칭 산책로와 중앙 분수'],[JOHTO_ROUTE_36,'성도 36번도로','도라지·금빛·인주 공유 갈림길'],[JOHTO_ROUTE_37,'성도 37번도로','규토리나무와 인주 남문']] as const){
    world.passages[id]={id,a:goldenrod,b:id===JOHTO_ROUTE_36?violet:ecruteak,kind:'road',bend:id===JOHTO_NATIONAL_PARK?28:18};
    world.passagePlaces[id]={id,name,region:'성도',theme:id===JOHTO_NATIONAL_PARK?'forest':'village',concept:'금빛·도라지에서 인주시티로 이어지는 성도 중부 공유 본선',landmark,x:ecruteak.x,y:(goldenrod.y+ecruteak.y)/2};
    world.outdoors[id]={objects:id===JOHTO_ROUTE_35?objects35:id===JOHTO_NATIONAL_PARK?parkObjects:id===JOHTO_ROUTE_36?objects36:objects37,signs:[]};
  }
  world.spawns[JOHTO_ROUTE_35]={x:16,y:68};world.spawns[JOHTO_NATIONAL_PARK]={x:28,y:52};world.spawns[JOHTO_ROUTE_36]={x:32,y:24};world.spawns[JOHTO_ROUTE_37]={x:14,y:52};
  goldenrodNorth.to=JOHTO_ROUTE_35;goldenrodNorth.spawn={x:14,y:68};goldenrodNorth.facing='up';
  goldenrodEast.to=JOHTO_ROUTE_35;goldenrodEast.spawn={x:18,y:68};goldenrodEast.facing='up';
  violetExit.to=JOHTO_ROUTE_36;violetExit.spawn={x:3,y:14};violetExit.facing='right';
  ecruteakExit.to=JOHTO_ROUTE_37;ecruteakExit.spawn={x:14,y:3};ecruteakExit.facing='down';
}
