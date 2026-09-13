import type { GameMap,Point } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const KANTO_ROUTE_FIFTEEN='tour_kanto_route_15' as const;
export const KANTO_ROUTE_FOURTEEN='tour_kanto_route_14' as const;
export const KANTO_ROUTE_THIRTEEN='tour_kanto_route_13' as const;
export const KANTO_ROUTE_TWELVE='tour_kanto_route_12' as const;
const COMPAT_LAVENDER_FUCHSIA='tour_pass_lavender_fuchsia' as const;

/** Insert Route 15 at Fuchsia's east gate while retaining the compressed road for old saves. */
export function installKantoFuchsiaEast(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const fuchsia=world.places.find(place=>place.id==='tour_fuchsia')!;
  const lavender=world.places.find(place=>place.id==='tour_lavender')!;
  const city=world.maps[fuchsia.id],compat=world.maps[COMPAT_LAVENDER_FUCHSIA];
  const cityExit=city.warps.find(warp=>warp.to===COMPAT_LAVENDER_FUCHSIA)!;
  const compatReturn=compat.warps.find(warp=>warp.to===fuchsia.id)!;
  const compatSpawn={...cityExit.spawn},citySpawn={...compatReturn.spawn};

  const width=64,height=28,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
  // A west-east main road with fenced grass bends and a southern return/rest loop.
  open(1,11,14,7);open(12,9,14,8);open(23,7,15,8);open(35,9,15,7);open(47,11,16,7);
  open(8,18,4,6);open(9,21,14,4);open(20,17,4,8); // west wetland verge
  open(35,16,4,7);open(37,19,15,4);open(49,16,4,7); // east rest loop
  open(27,3,4,5);open(29,3,12,3);open(38,5,4,4); // raised grass overlook
  rows[14][1]='.';rows[14][width-2]='.';

  const signs=[
    {x:5,y:10,direction:'left' as const,destination:fuchsia.id,name:'15번도로 서쪽 표지',event:'journeySign',pages:['← 서쪽 연분홍시티\n→ 동쪽 관동15번도로·14번도로 방향','연분홍 동문에서 낮은 초원과 울타리 쉼터를 지나14번도로 경계로 향한다.']},
    {x:58,y:10,direction:'right' as const,destination:COMPAT_LAVENDER_FUCHSIA,name:'15번도로 동쪽 표지',event:'journeySign',pages:['← 서쪽 관동15번도로·연분홍시티\n→ 동쪽 후속 관동14번도로','14번도로는 다음 독립 구간이다. 현재 끝은 과거 저장 귀환용 압축길에 임시 연결된다.']},
  ];
  const objects=[
    {name:'연분홍 습지 경계 화단',event:'tourRoute15WetlandVerge',cells:[{x:10,y:22}],pages:['연분홍의 습한 바람이 낮은 꽃과 갈대 끝을 흔든다.\n도시 연못의 생활권과15번도로 초원이 이 자리에서 갈린다.']},
    {name:'15번도로 높은 풀 전망',event:'tourRoute15GrassView',cells:[{x:35,y:4}],pages:['울타리 위쪽의 긴 풀이 바람 방향을 보여 준다.\n현재는 경관 구역이며 야생 조우표나 아이템을 연결하지 않았다.']},
    {name:'동쪽 동료 쉼터',event:'tourRoute15PartnerRest',cells:[{x:45,y:21}],pages:['사람과 포켓몬이14번도로로 넘어가기 전에 물과 발 상태를 살피는 자리다.\n조사만으로 회복이나 도구 지급은 일어나지 않는다.']},
    {name:'14번도로 인계 표석',event:'tourRoute15Handoff',cells:[{x:59,y:18}],pages:['이 표석 동쪽에서 관동14번도로가 시작된다.\n14번도로→13번도로→12번도로를 지나 보라타운으로 이어지며 이 사이에 동굴은 없다.']},
    {name:'여행자의 찌르꼬',event:'tourRoute15Pokemon',cells:[],pages:['찌르르!\n초원 바람이 부는 쪽으로 몸을 돌려 깃을 고른다.','여행자와 함께 쉬는 생활 포켓몬이며\n현재15번도로의 야생 조우 대상은 아니다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';

  world.maps[KANTO_ROUTE_FIFTEEN]={id:KANTO_ROUTE_FIFTEEN,name:'관동 15번도로',width,height,background:KANTO_ROUTE_FIFTEEN,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:1,y:14,to:fuchsia.id,spawn:citySpawn,entry:'left',facing:'left'},
      {x:width-2,y:14,to:COMPAT_LAVENDER_FUCHSIA,spawn:compatSpawn,entry:'right',facing:'left'},
    ],terrain:[
      {kind:'tallGrass',x:9,y:21,w:14,h:4},{kind:'tallGrass',x:29,y:3,w:12,h:3},{kind:'tallGrass',x:37,y:19,w:14,h:4},
    ],
    npcs:[
      {id:'route15Walker',name:'15번도로 초원 여행자',sprite:'ace_trainer_f',x:31,y:12,facing:'right',dialogue:'journeyWalker'},
      {id:'route15Pokemon',name:'여행자의 찌르꼬',sprite:'field-starly',x:33,y:12,facing:'left',dialogue:'tourRoute15Pokemon'},
      {id:'route15Trainer',name:'15번도로 초원 트레이너',sprite:'school_kid_f',x:52,y:20,facing:'left',dialogue:'tourRoute15Trainer'},
    ],
    props:[...signs.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[KANTO_ROUTE_FIFTEEN]={id:KANTO_ROUTE_FIFTEEN,a:fuchsia,b:lavender,kind:'road',bend:14};
  world.passagePlaces[KANTO_ROUTE_FIFTEEN]={id:KANTO_ROUTE_FIFTEEN,name:'관동 15번도로',region:'관동',theme:'flowers',concept:'연분홍 동문에서 울타리 초원과 동료 쉼터를 지나14번도로로 향하는 길',landmark:'14번도로 인계 표석',x:fuchsia.x+.45,y:fuchsia.y-.05};
  world.spawns[KANTO_ROUTE_FIFTEEN]={x:3,y:14};world.outdoors[KANTO_ROUTE_FIFTEEN]={objects,signs};

  cityExit.to=KANTO_ROUTE_FIFTEEN;cityExit.spawn={x:3,y:14};cityExit.facing='right';
  compatReturn.to=KANTO_ROUTE_FIFTEEN;compatReturn.spawn={x:width-4,y:14};compatReturn.facing='left';

  const eastBoard=world.outdoors[fuchsia.id]?.objects.find(object=>object.event==='tourFuchsiaEastRoadBoard');
  if(eastBoard){eastBoard.name='15→14→13→12번도로 방향판';eastBoard.pages=['동쪽15→14→13번도로는 독립되어 왕복할 수 있다.\n12번도로는 다음 구현 구간이다.','15→14→13→12번도로를 차례로 지나\n보라타운 남쪽에 닿으며 동굴은 없다.'];}

  installKantoRouteFourteen(world,fuchsia,lavender,compatSpawn);
}

function installKantoRouteFourteen(world:{
  maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;
  spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
},fuchsia:Place,lavender:Place,compatSpawn:Point){
  const route15=world.maps[KANTO_ROUTE_FIFTEEN],compat=world.maps[COMPAT_LAVENDER_FUCHSIA];
  const route15East=route15.warps.find(warp=>warp.to===COMPAT_LAVENDER_FUCHSIA)!;
  const compatReturn=compat.warps.find(warp=>warp.to===KANTO_ROUTE_FIFTEEN)!;
  const width=28,height=72,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
  // The road turns north from Route 15 through long grassland bends.
  open(11,1,7,13);open(9,11,9,13);open(7,21,9,14);open(10,32,9,14);open(12,43,8,15);open(10,55,8,16);
  open(17,8,7,4);open(21,10,4,12);open(16,19,8,4); // northeast birdwatch loop
  open(3,27,7,4);open(3,29,4,12);open(5,38,7,4); // west windbreak loop
  open(18,48,7,4);open(22,50,4,11);open(17,58,8,4); // southeast rest loop
  rows[1][14]='.';rows[height-2][14]='.';
  const signs=[
    {x:18,y:66,direction:'down' as const,destination:KANTO_ROUTE_FIFTEEN,name:'14번도로 남쪽 표지',event:'journeySign',pages:['↓ 남쪽 관동15번도로·연분홍시티\n↑ 북쪽 관동14번도로·13번도로 방향','15번도로 동쪽에서 북쪽으로 꺾이는 긴 초원길이다.']},
    {x:18,y:5,direction:'up' as const,destination:COMPAT_LAVENDER_FUCHSIA,name:'14번도로 북쪽 표지',event:'journeySign',pages:['↓ 남쪽 관동14번도로·15번도로\n↑ 북쪽 후속 관동13번도로','13번도로는 다음 독립 구간이다. 현재 끝은 과거 저장 귀환용 압축길에 임시 연결된다.']},
  ];
  const objects=[
    {name:'15번도로 도착 바람판',event:'tourRoute14SouthWind',cells:[{x:20,y:58}],pages:['남쪽15번도로에서 불어온 바람이 북쪽 굴곡을 가리킨다.\n되돌아가면 연분홍시티 동문까지 이어진다.']},
    {name:'서쪽 풀바람 쉼터',event:'tourRoute14Windbreak',cells:[{x:5,y:37}],pages:['낮은 나무와 울타리가 긴 남북길의 옆바람을 막아 준다.\n현재는 비보상 휴식 공간이며 회복 기능은 없다.']},
    {name:'동쪽 물새 관찰 난간',event:'tourRoute14BirdRail',cells:[{x:23,y:18}],pages:['멀리 습지 쪽을 오가는 새 포켓몬을 길 밖에서 바라보는 난간이다.\n관찰은 야생 조우나 포획을 발생시키지 않는다.']},
    {name:'13번도로 인계 표석',event:'tourRoute14Handoff',cells:[{x:19,y:8}],pages:['이 표석 북쪽에서 관동13번도로가 시작된다.\n13번도로와12번도로를 지나 보라타운 남쪽에 닿으며 동굴은 없다.']},
    {name:'여행자의 이어롤',event:'tourRoute14Pokemon',cells:[],pages:['이어!\n바람막이 울타리 곁에서 접었던 귀를 천천히 편다.','여행자와 함께 걷는 생활 포켓몬이며\n현재14번도로의 야생 조우 대상은 아니다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_FOURTEEN]={id:KANTO_ROUTE_FOURTEEN,name:'관동 14번도로',width,height,background:KANTO_ROUTE_FOURTEEN,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:14,y:height-2,to:KANTO_ROUTE_FIFTEEN,spawn:{x:route15.width-4,y:14},entry:'down',facing:'left'},
      {x:14,y:1,to:COMPAT_LAVENDER_FUCHSIA,spawn:compatSpawn,entry:'up',facing:'left'},
    ],terrain:[
      {kind:'tallGrass',x:21,y:10,w:4,h:8},{kind:'tallGrass',x:3,y:29,w:4,h:8},{kind:'tallGrass',x:22,y:50,w:4,h:8},
    ],
    npcs:[
      {id:'route14Walker',name:'14번도로 바람길 여행자',sprite:'rancher',x:14,y:40,facing:'up',dialogue:'journeyWalker'},
      {id:'route14Pokemon',name:'여행자의 이어롤',sprite:'field-buneary',x:16,y:40,facing:'left',dialogue:'tourRoute14Pokemon'},
      {id:'route14Trainer',name:'14번도로 새잡이',sprite:'ace_trainer_m',x:20,y:60,facing:'left',dialogue:'tourRoute14Trainer'},
    ],
    props:[...signs.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[KANTO_ROUTE_FOURTEEN]={id:KANTO_ROUTE_FOURTEEN,a:fuchsia,b:lavender,kind:'road',bend:14};
  world.passagePlaces[KANTO_ROUTE_FOURTEEN]={id:KANTO_ROUTE_FOURTEEN,name:'관동 14번도로',region:'관동',theme:'forest',concept:'15번도로 동쪽에서 긴 초원 굴곡을 따라13번도로로 올라가는 남북길',landmark:'서쪽 풀바람 쉼터',x:fuchsia.x+.55,y:(fuchsia.y+lavender.y)/2};
  world.spawns[KANTO_ROUTE_FOURTEEN]={x:14,y:height-4};world.outdoors[KANTO_ROUTE_FOURTEEN]={objects,signs};
  route15East.to=KANTO_ROUTE_FOURTEEN;route15East.spawn={x:14,y:height-4};route15East.facing='up';
  compatReturn.to=KANTO_ROUTE_FOURTEEN;compatReturn.spawn={x:14,y:3};compatReturn.facing='down';
  const eastSign=world.outdoors[KANTO_ROUTE_FIFTEEN].signs.find(sign=>sign.name==='15번도로 동쪽 표지');
  if(eastSign){eastSign.destination=KANTO_ROUTE_FOURTEEN;eastSign.pages=['← 서쪽 관동15번도로·연분홍시티\n→ 동쪽 관동14번도로','동쪽 끝에서14번도로 남단으로 꺾여 북쪽13번도로 경계까지 왕복한다.'];}
  const handoff=world.outdoors[KANTO_ROUTE_FIFTEEN].objects.find(object=>object.event==='tourRoute15Handoff');
  if(handoff)handoff.pages=['이 표석 동쪽에서 관동14번도로가 시작된다.\n긴 남북 초원길을 따라13번도로 경계까지 왕복할 수 있다.'];
  installKantoRouteThirteen(world,fuchsia,lavender,compatSpawn);
}

function installKantoRouteThirteen(world:{
  maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;
  spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
},fuchsia:Place,lavender:Place,compatSpawn:Point){
  const route14=world.maps[KANTO_ROUTE_FOURTEEN],compat=world.maps[COMPAT_LAVENDER_FUCHSIA];
  const route14North=route14.warps.find(warp=>warp.to===COMPAT_LAVENDER_FUCHSIA)!;
  const compatReturn=compat.warps.find(warp=>warp.to===KANTO_ROUTE_FOURTEEN)!;
  const width=72,height=32,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
  // A readable reconstruction of Route 13's long fence maze, with the center spine always open.
  open(1,13,13,7);open(11,10,12,10);open(20,7,12,11);open(29,7,11,8);
  open(37,10,12,8);open(46,12,12,8);open(55,9,10,11);open(62,12,9,8);
  open(7,5,5,9);open(7,5,15,4);open(30,18,5,8);open(30,23,16,4);
  open(43,5,5,8);open(43,5,16,4);open(57,7,5,6);open(50,19,5,8);open(50,24,15,4);
  rows[16][1]='.';rows[16][width-2]='.';
  const signs=[
    {x:5,y:12,direction:'left' as const,destination:KANTO_ROUTE_FOURTEEN,name:'13번도로 서쪽 표지',event:'journeySign',pages:['← 서쪽 관동14번도로·15번도로\n→ 동쪽 관동13번도로·12번도로 방향','울타리 사이 굽은 길을 지나 사일런스브리지 쪽 경계로 향한다.']},
    {x:66,y:11,direction:'right' as const,destination:COMPAT_LAVENDER_FUCHSIA,name:'13번도로 동쪽 표지',event:'journeySign',pages:['← 서쪽 관동13번도로·14번도로\n→ 동쪽 후속 관동12번도로','12번도로는 다음 독립 구간이다. 현재 끝은 과거 저장 귀환용 압축길에 임시 연결된다.']},
  ];
  const objects=[
    {name:'14번도로 도착 표석',event:'tourRoute13WestHandoff',cells:[{x:8,y:19}],pages:['서쪽 길은14번도로 북쪽과 이어진다.\n14→15번도로를 거슬러 연분홍시티까지 돌아갈 수 있다.']},
    {name:'울타리 미로 관찰판',event:'tourRoute13FenceSurvey',cells:[{x:33,y:23}],pages:['울타리의 틈과 바람 방향을 따라 안전 본선과 막다른 관찰길을 구분한다.']},
    {name:'사일런스브리지 전망 난간',event:'tourRoute13BridgeRail',cells:[{x:57,y:7}],pages:['동쪽 물길 위로 이어지는 사일런스브리지의 시작을 바라본다.\n현재는 육상 전망이며 수상 이동이나 낚시는 없다.']},
    {name:'12번도로 인계 표석',event:'tourRoute13EastHandoff',cells:[{x:63,y:24}],pages:['이 표석 동쪽에서 관동12번도로가 시작된다.\n12번도로를 따라 보라타운 남쪽으로 이어지며 동굴은 없다.']},
    {name:'여행자의 파치리스',event:'tourRoute13Pokemon',cells:[],pages:['파치파치!\n울타리 기둥을 번갈아 살피며 여행자에게 안전한 굽이를 알려 준다.','여행자와 함께 걷는 생활 포켓몬이며13번도로 야생 조우 대상은 아니다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_THIRTEEN]={id:KANTO_ROUTE_THIRTEEN,name:'관동 13번도로',width,height,background:KANTO_ROUTE_THIRTEEN,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:1,y:16,to:KANTO_ROUTE_FOURTEEN,spawn:{x:14,y:3},entry:'left',facing:'down'},
      {x:width-2,y:16,to:COMPAT_LAVENDER_FUCHSIA,spawn:compatSpawn,entry:'right',facing:'left'},
    ],terrain:[{kind:'tallGrass',x:45,y:5,w:12,h:4}],
    npcs:[
      {id:'route13Walker',name:'13번도로 울타리 여행자',sprite:'ace_trainer_f',x:38,y:13,facing:'right',dialogue:'journeyWalker'},
      {id:'route13Pokemon',name:'여행자의 파치리스',sprite:'field-pachirisu',x:40,y:13,facing:'left',dialogue:'tourRoute13Pokemon'},
      {id:'route13Trainer',name:'13번도로 새잡이',sprite:'ace_trainer_m',x:52,y:25,facing:'right',dialogue:'tourRoute13Trainer'},
    ],
    props:[...signs.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[KANTO_ROUTE_THIRTEEN]={id:KANTO_ROUTE_THIRTEEN,a:fuchsia,b:lavender,kind:'road',bend:13};
  world.passagePlaces[KANTO_ROUTE_THIRTEEN]={id:KANTO_ROUTE_THIRTEEN,name:'관동 13번도로',region:'관동',theme:'coast',concept:'14번도로에서 울타리 미로와 사일런스브리지 전망을 지나12번도로로 향하는 좁은 길',landmark:'울타리 미로 관찰판',x:(fuchsia.x+lavender.x)/2,y:lavender.y+.35};
  world.spawns[KANTO_ROUTE_THIRTEEN]={x:3,y:16};world.outdoors[KANTO_ROUTE_THIRTEEN]={objects,signs};
  route14North.to=KANTO_ROUTE_THIRTEEN;route14North.spawn={x:3,y:16};route14North.facing='right';
  compatReturn.to=KANTO_ROUTE_THIRTEEN;compatReturn.spawn={x:width-4,y:16};compatReturn.facing='left';
  const northSign=world.outdoors[KANTO_ROUTE_FOURTEEN].signs.find(sign=>sign.name==='14번도로 북쪽 표지');
  if(northSign){northSign.destination=KANTO_ROUTE_THIRTEEN;northSign.pages=['↓ 남쪽 관동14번도로·15번도로\n↑ 북쪽에서 서쪽 관동13번도로','13번도로 울타리 길을 따라12번도로 인계 지점까지 왕복할 수 있다.'];}
  const handoff=world.outdoors[KANTO_ROUTE_FOURTEEN].objects.find(object=>object.event==='tourRoute14Handoff');
  if(handoff)handoff.pages=['이 표석 북쪽에서 관동13번도로가 시작된다.\n울타리 미로를 지나12번도로 경계까지 왕복할 수 있다.'];
  installKantoRouteTwelve(world,fuchsia,lavender);
}

function installKantoRouteTwelve(world:{
  maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;
  spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
},fuchsia:Place,lavender:Place){
  const route13=world.maps[KANTO_ROUTE_THIRTEEN],city=world.maps[lavender.id];
  const route13East=route13.warps.find(warp=>warp.to===COMPAT_LAVENDER_FUCHSIA)!;
  const citySouth=city.warps.find(warp=>warp.to===COMPAT_LAVENDER_FUCHSIA)!;
  const width=32,height=88,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
  // Long Silence Bridge spine with dry overlooks and rest loops beside the water.
  open(13,1,7,14);open(11,11,9,15);open(9,23,10,16);open(12,36,9,14);
  open(14,47,8,16);open(11,60,10,15);open(13,72,8,15);
  open(19,9,8,5);open(24,11,4,13);open(18,21,10,4); // northern lookout loop
  open(3,29,8,5);open(3,31,4,14);open(5,42,9,5); // Route 11 direction/rest loop
  open(20,51,8,5);open(24,53,4,15);open(19,65,9,5); // fishing pier loop
  open(4,67,9,5);open(4,69,4,12);open(6,78,9,5); // southern windbreak loop
  rows[1][16]='.';rows[height-2][16]='.';
  const signs=[
    {x:20,y:6,direction:'up' as const,destination:lavender.id,name:'12번도로 북쪽 표지',event:'journeySign',pages:['↑ 북쪽 보라타운\n↓ 남쪽 관동12번도로·13번도로','보라타운 남문에서 사일런스브리지를 따라13번도로까지 내려간다.']},
    {x:21,y:82,direction:'down' as const,destination:KANTO_ROUTE_THIRTEEN,name:'12번도로 남쪽 표지',event:'journeySign',pages:['↑ 북쪽 관동12번도로·보라타운\n↓ 남쪽 관동13번도로·연분홍시티 방향','13→14→15번도로를 차례로 지나 연분홍시티로 돌아간다.']},
  ];
  const objects=[
    {name:'보라타운 남문 도착 표석',event:'tourRoute12LavenderArrival',cells:[{x:25,y:12}],pages:['북쪽 계단은 보라타운 남문으로 이어진다.\n센터와 마을 시설은 도시 안에서 이용할 수 있다.']},
    {name:'11번도로 방향 표지',event:'tourRoute12Route11Board',cells:[{x:5,y:43}],pages:['서쪽은 관동11번도로 방향이다.\n이번 구간에서는 방향만 확인하며 실제11번도로 출구는 아직 연결하지 않았다.']},
    {name:'사일런스브리지 동료 점검대',event:'tourRoute12BridgeCheck',cells:[{x:26,y:64}],pages:['긴 다리의 난간·마른 발판·귀환 방향을 동료와 확인하는 자리다.']},
    {name:'낚시 명소 전망 난간',event:'tourRoute12FishingRail',cells:[{x:25,y:54}],pages:['물가에 낚시꾼이 모이는 곳으로 알려진 다리다.\n현재 낚시와 수상 이동은 지원하지 않아 전망만 가능하다.']},
    {name:'13번도로 인계 표석',event:'tourRoute12Route13Handoff',cells:[{x:8,y:79}],pages:['남쪽 끝에서 관동13번도로의 울타리 길로 이어진다.\n13→14→15번도로 사이에 동굴은 없다.']},
    {name:'여행자의 고라파덕',event:'tourRoute12Pokemon',cells:[],pages:['고라파!\n난간 아래 물결을 보다가 여행자의 발소리에 맞춰 고개를 든다.','여행자와 함께 쉬는 생활 포켓몬이며 야생 조우나 낚시 대상이 아니다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_TWELVE]={id:KANTO_ROUTE_TWELVE,name:'관동 12번도로 · 사일런스브리지',width,height,background:KANTO_ROUTE_TWELVE,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:16,y:1,to:lavender.id,spawn:{x:14,y:31},entry:'up',facing:'up'},
      {x:16,y:height-2,to:KANTO_ROUTE_THIRTEEN,spawn:{x:68,y:16},entry:'down',facing:'left'},
    ],terrain:[],
    npcs:[
      {id:'route12Walker',name:'12번도로 다리 여행자',sprite:'rancher',x:16,y:57,facing:'down',dialogue:'journeyWalker'},
      {id:'route12Pokemon',name:'여행자의 고라파덕',sprite:'field-psyduck',x:18,y:57,facing:'left',dialogue:'tourRoute12Pokemon'},
      {id:'route12Keeper',name:'사일런스브리지 관리인',sprite:'worker',x:7,y:44,facing:'up',dialogue:'tourRoute12Keeper'},
      {id:'route12Trainer',name:'12번도로 다리 트레이너',sprite:'ace_trainer_f',x:7,y:70,facing:'down',dialogue:'tourRoute12Trainer'},
    ],
    props:[...signs.map(sign=>({x:sign.x,y:sign.y,dialogue:sign.event})),...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[KANTO_ROUTE_TWELVE]={id:KANTO_ROUTE_TWELVE,a:fuchsia,b:lavender,kind:'road',bend:12};
  world.passagePlaces[KANTO_ROUTE_TWELVE]={id:KANTO_ROUTE_TWELVE,name:'관동 12번도로 · 사일런스브리지',region:'관동',theme:'water',concept:'보라타운 남문에서 긴 해안 다리와 낚시 명소 전망을 지나13번도로로 내려가는 길',landmark:'사일런스브리지 동료 점검대',x:lavender.x,y:lavender.y+.55};
  world.spawns[KANTO_ROUTE_TWELVE]={x:16,y:3};world.outdoors[KANTO_ROUTE_TWELVE]={objects,signs};
  route13East.to=KANTO_ROUTE_TWELVE;route13East.spawn={x:16,y:height-4};route13East.facing='up';
  citySouth.to=KANTO_ROUTE_TWELVE;citySouth.spawn={x:16,y:3};citySouth.facing='down';
  const eastSign=world.outdoors[KANTO_ROUTE_THIRTEEN].signs.find(sign=>sign.name==='13번도로 동쪽 표지');
  if(eastSign){eastSign.destination=KANTO_ROUTE_TWELVE;eastSign.pages=['← 서쪽 관동13번도로·14번도로\n→ 동쪽에서 북쪽 관동12번도로','사일런스브리지 육상 본선을 따라 보라타운 남문까지 왕복할 수 있다.'];}
  const handoff=world.outdoors[KANTO_ROUTE_THIRTEEN].objects.find(object=>object.event==='tourRoute13EastHandoff');
  if(handoff)handoff.pages=['이 표석 동쪽에서 관동12번도로가 시작된다.\n사일런스브리지를 따라 보라타운 남문까지 왕복할 수 있다.'];
}
