import type { GameMap,Point } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import type { TourInterior } from './explore-interiors';

export const KANTO_ROUTE_NINE='tour_kanto_route_9' as const;
export const KANTO_ROUTE_TEN_NORTH='tour_kanto_route_10_north' as const;
export const KANTO_ROUTE_TEN_CENTER='tour_kanto_route_10_north_center' as const;
export const KANTO_ROCK_TUNNEL_1F='tour_kanto_rock_tunnel_1f' as const;
export const KANTO_ROCK_TUNNEL_B1F='tour_kanto_rock_tunnel_b1f' as const;
export const KANTO_ROUTE_TEN_SOUTH='tour_kanto_route_10_south' as const;

/** Start the canonical eastern Kanto approach without disturbing Cerulean's existing three exits. */
export function installKantoLavenderApproach(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
  rooms:Record<string,TourInterior>;parents:Record<string,Place>;
}){
  const cerulean=world.places.find(p=>p.id==='tour_cerulean')!;
  const lavender=world.places.find(p=>p.id==='tour_lavender')!;
  const cityMap=world.maps[cerulean.id];
  const width=72,height=32,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // West-east ridge road with ledge bends and one low return loop.
  open(1,14,12,4);open(10,11,5,7);open(12,10,15,4);
  open(24,10,5,11);open(26,17,16,4);open(39,13,5,8);
  open(41,12,15,4);open(53,12,5,9);open(55,17,14,4);open(66,15,5,6);
  open(17,22,4,6);open(18,25,23,3);open(38,20,4,8); // lower return trail
  open(45,5,4,8);open(46,5,12,3);open(55,6,4,8); // upper lookout loop
  rows[16][1]='.';
  const signs=[
    {x:4,y:13,direction:'left' as const,destination:cerulean.id,name:'9번도로 서쪽 표지',event:'journeySign',pages:['← 서쪽 블루시티\n→ 동쪽 10번도로 북부 · 돌산터널 방향','턱 아래 우회로는 중앙 본선으로 다시 합류한다.']},
  ];
  const objects=[
    {name:'턱길 안전 표석',event:'tourRoute9Ledge',cells:[{x:27,y:15}],pages:['낮은 턱이 여러 번 꺾이며 동쪽으로 이어진다.\n되돌아갈 때는 남쪽 우회로를 따라 블루 방향 본선에 합류한다.']},
    {name:'동부 고지 전망대',event:'tourRoute9Lookout',cells:[{x:52,y:6}],pages:['동쪽으로 어두운 암벽과 터널 입구 방향이 보인다.\n발전소 수역은 별도 분기이며 현재 길에서 건너갈 수 없다.']},
    {name:'터널 전 준비 쉼터',event:'tourRoute9Rest',cells:[{x:61,y:18}],pages:['돌산터널로 향하기 전에 동료 상태와 도구를 확인하는 쉼터다.\n회복이 필요하면 서쪽 블루시티로 돌아가자.']},
    {name:'10번도로 방향 경계석',event:'tourRoute9East',cells:[{x:68,y:14}],pages:['→ 동쪽 10번도로 북부 · 돌산터널\n← 서쪽 관동 9번도로 · 블루시티','다음 구간은 터널 앞 북부 길로 이어진다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[KANTO_ROUTE_NINE]={id:KANTO_ROUTE_NINE,name:'관동 9번도로',width,height,background:KANTO_ROUTE_NINE,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:1,y:16,to:cerulean.id,spawn:{x:cityMap.width-3,y:12},entry:'left',facing:'left'},
      {x:70,y:17,to:KANTO_ROUTE_TEN_NORTH,spawn:{x:16,y:52},entry:'right',facing:'up'},
    ],
    terrain:[
      {kind:'tallGrass',x:18,y:25,w:3,h:3},{kind:'tallGrass',x:46,y:5,w:3,h:3},{kind:'tallGrass',x:55,y:17,w:4,h:3},
    ],
    npcs:[
      {id:'route9Hiker',name:'9번도로 산행객',sprite:'worker',x:33,y:18,facing:'down',dialogue:'journeyWalker'},
      {id:'route9Trainer',name:'9번도로 캠프 트레이너',sprite:'school_kid_m',x:34,y:26,facing:'left',dialogue:'tourRoute9Trainer'},
    ],
    props:[...signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[KANTO_ROUTE_NINE]={id:KANTO_ROUTE_NINE,a:cerulean,b:lavender,kind:'road',bend:16};
  world.passagePlaces[KANTO_ROUTE_NINE]={id:KANTO_ROUTE_NINE,name:'관동 9번도로',region:'관동',theme:'forest',concept:'블루 동쪽에서 턱과 굴곡을 지나 돌산터널 방향으로 향하는 고지 도로',landmark:'동부 고지 전망대',x:(cerulean.x+lavender.x)/2,y:cerulean.y};
  world.spawns[KANTO_ROUTE_NINE]={x:3,y:16};world.outdoors[KANTO_ROUTE_NINE]={objects,signs};
  const cityX=cityMap.width-2,cityY=12;
  cityMap.walkable[cityY]=cityMap.walkable[cityY].slice(0,cityX)+'.'+cityMap.walkable[cityY].slice(cityX+1);
  cityMap.warps.push({x:cityX,y:cityY,to:KANTO_ROUTE_NINE,spawn:{x:3,y:16},entry:'right',facing:'right'});
  const citySign={x:cityMap.width-4,y:10,direction:'right' as const,destination:KANTO_ROUTE_NINE,name:'9번도로 동쪽 출구',event:'journeySign',pages:['→ 동쪽 관동 9번도로\n10번도로 북부 · 돌산터널 · 보라타운 방향','터널 전에는 블루시티에서 동료 상태와 도구를 확인하자.']};
  cityMap.props.push({x:citySign.x,y:citySign.y,dialogue:citySign.event});
  cityMap.walkable[citySign.y]=cityMap.walkable[citySign.y].slice(0,citySign.x)+'#'+cityMap.walkable[citySign.y].slice(citySign.x+1);
  world.outdoors[cerulean.id].signs.push(citySign);

  installRouteTenNorth(world,lavender);
}

function installRouteTenNorth(world:{
  maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;
  spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
  rooms:Record<string,TourInterior>;parents:Record<string,Place>;
},lavender:Place){
  const width=32,height=56,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // A long climb from Route 9 to the tunnel, with a center-side rest loop.
  open(14,1,5,12);open(11,9,8,5);open(9,12,6,10);open(9,19,12,5);
  open(17,21,5,11);open(14,29,8,5);open(12,32,6,9);open(12,38,10,5);
  open(18,40,5,9);open(15,46,8,9);open(16,54,3,2);
  open(4,34,10,7);open(5,31,5,5); // Pokémon Center forecourt and return loop.
  open(22,18,5,8);open(20,16,7,5); // Water-edge lookout; the water branch stays closed.

  const signs=[
    {x:18,y:51,direction:'down' as const,destination:KANTO_ROUTE_NINE,name:'10번도로 남쪽 표지',event:'journeySign',pages:['↓ 남쪽 관동 9번도로 · 블루시티\n↑ 북쪽 돌산터널 입구','긴 산길 중간의 포켓몬센터에서 동료를 쉬게 할 수 있다.']},
    {x:13,y:5,direction:'up' as const,destination:'tour_kanto_rock_tunnel_1f' as TourId,name:'돌산터널 입구 표지',event:'journeySign',pages:['↑ 북쪽 돌산터널\n터널을 지나면 10번도로 남부 · 보라타운 방향','동굴 안은 굽은 암반길이 이어진다.\n들어가기 전에 동료 상태와 길을 확인하자.']},
  ];
  const objects=[
    {name:'터널 앞 포켓몬센터',event:'tourRoute10CenterFront',cells:[
      {x:4,y:34},{x:5,y:34},{x:6,y:34},{x:7,y:34},{x:8,y:34},{x:9,y:34},{x:10,y:34},
      {x:4,y:35},{x:5,y:35},{x:6,y:35},{x:7,y:35},{x:8,y:35},{x:9,y:35},{x:10,y:35},
      {x:4,y:36},{x:5,y:36},{x:6,y:36},{x:8,y:36},{x:9,y:36},{x:10,y:36},
    ],pages:['산길과 돌산터널을 오가는 여행자와 포켓몬이 쉬어 가는 작은 센터다.\n열린 현관으로 들어가면 회복과 길 안내를 받을 수 있다.']},
    {name:'산기슭 발자국 관찰터',event:'tourRoute10Tracks',cells:[{x:10,y:17}],pages:['마른 흙 위에 크기가 다른 발자국이 겹쳐 있다.\n산길을 오가는 포켓몬과 여행자가 물가와 그늘에서 함께 쉬어 간 흔적이다.']},
    {name:'발전소 수역 전망 난간',event:'tourRoute10PowerView',cells:[{x:24,y:18}],pages:['동쪽 아래로 물길과 멀리 발전 시설이 보인다.\n이 산길에서는 물 건너편으로 이어지는 길이 없다.']},
    {name:'터널 앞 짐 점검대',event:'tourRoute10Packing',cells:[{x:19,y:10}],pages:['작업등, 물통, 동료의 먹이를 꺼내기 좋은 낮은 돌받침이다.\n터널에 들어가기 전 포켓몬센터와 가방을 다시 확인하자.']},
    {name:'산행객의 피카츄',event:'tourRoute10Partner',cells:[],pages:['산행객의 피카츄가 귀를 세우고 암벽 쪽 소리를 살핀다.\n주인은 동료와 교대로 길을 확인하며 천천히 오르고 있다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  rows[54][16]='.';
  const centerDoor={x:7,y:36};rows[centerDoor.y][centerDoor.x]='.';
  world.maps[KANTO_ROUTE_TEN_NORTH]={id:KANTO_ROUTE_TEN_NORTH,name:'관동 10번도로 북부',width,height,background:KANTO_ROUTE_TEN_NORTH,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:16,y:54,to:KANTO_ROUTE_NINE,spawn:{x:68,y:17},entry:'down',facing:'left'},
      {...centerDoor,to:KANTO_ROUTE_TEN_CENTER,spawn:{x:14,y:18},entry:'up',facing:'up'},
    ],terrain:[
      {kind:'tallGrass',x:22,y:19,w:4,h:5},{kind:'tallGrass',x:5,y:32,w:4,h:3},
    ],
    npcs:[
      {id:'route10Hiker',name:'10번도로 산행객',sprite:'worker',x:18,y:28,facing:'down',dialogue:'journeyWalker'},
      {id:'route10Partner',name:'산행객의 피카츄',sprite:'field-pikachu',x:19,y:28,facing:'left',dialogue:'tourRoute10Partner'},
    ],
    props:[...signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event)))],
  };
  world.passages[KANTO_ROUTE_TEN_NORTH]={id:KANTO_ROUTE_TEN_NORTH,a:world.passagePlaces[KANTO_ROUTE_NINE],b:lavender,kind:'road',bend:31};
  world.passagePlaces[KANTO_ROUTE_TEN_NORTH]={id:KANTO_ROUTE_TEN_NORTH,name:'관동 10번도로 북부',region:'관동',theme:'cave',concept:'9번도로에서 산기슭을 올라 돌산터널 입구와 회복 거점에 닿는 북부 산길',landmark:'터널 앞 포켓몬센터',x:lavender.x-0.5,y:lavender.y-1};
  world.spawns[KANTO_ROUTE_TEN_NORTH]={x:16,y:52};world.outdoors[KANTO_ROUTE_TEN_NORTH]={objects,signs};

  const room:TourInterior={style:'center',title:'10번도로 포켓몬센터',host:{x:14,y:8},reception:{x:10,y:9,w:9,h:1},greeting:[
    '돌산터널 앞 포켓몬센터입니다.\n지친 동료를 맡겨 주세요.',
    '밖의 표지를 따라 북쪽으로 오르면 터널 입구,\n남쪽으로 내려가면 9번도로입니다.',
  ],objects:[
    {x:4,y:7,w:3,h:2,kind:'healer',name:'산길 회복 장치',event:'tourRoute10Healer',pages:['산길의 흙을 털 수 있는 받침과 회복 장치가 함께 놓여 있다.\n회복은 카운터의 간호사에게 부탁하자.']},
    {x:21,y:7,w:3,h:2,kind:'console',name:'돌산터널 길 안내 PC',event:'tourRoute10CenterMap',pages:['9번도로 → 10번도로 북부 → 돌산터널 → 10번도로 남부 → 보라타운\n현재 위치와 양쪽 출구가 표시되어 있다.']},
    {x:5,y:14,w:5,h:2,kind:'bench',name:'포켓몬 동행 휴게석',event:'tourRoute10CenterBench',pages:['큰 포켓몬도 몸을 돌릴 수 있도록 의자 사이를 넓게 비워 두었다.\n물통과 발 닦는 수건이 곁에 놓여 있다.']},
  ]};
  const roomRows=Array.from({length:22},(_,y)=>Array.from({length:28},(_,x)=>x>=2&&x<=25&&y>=4&&y<=19||x===14&&y>=20?'.':'#'));
  const roomProps:GameMap['props']=[];
  for(const o of room.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){roomRows[y][x]='#';roomProps.push({x,y,dialogue:o.event});}
  if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){roomRows[y][x]='#';roomProps.push({x,y,dialogue:'nurse'});}
  world.maps[KANTO_ROUTE_TEN_CENTER]={id:KANTO_ROUTE_TEN_CENTER,name:room.title,width:28,height:22,background:KANTO_ROUTE_TEN_CENTER,walkable:roomRows.map(row=>row.join('')),
    warps:[{x:14,y:21,to:KANTO_ROUTE_TEN_NORTH,spawn:{x:centerDoor.x,y:centerDoor.y+1},entry:'down',facing:'down'}],
    npcs:[{id:'route10Nurse',name:'간호사',sprite:'pokecenter_nurse',...room.host,facing:'down',dialogue:'nurse'}],props:roomProps};
  world.rooms[KANTO_ROUTE_TEN_CENTER]=room;world.parents[KANTO_ROUTE_TEN_CENTER]=lavender;
  world.spawns[KANTO_ROUTE_TEN_CENTER]={x:14,y:18};

  installRockTunnel(world,lavender);
}

function installRockTunnel(world:{
  maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;
  spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
},lavender:Place){
  const route=world.maps[KANTO_ROUTE_TEN_NORTH];
  route.walkable[1]=route.walkable[1].slice(0,16)+'.'+route.walkable[1].slice(17);
  route.warps.push({x:16,y:1,to:KANTO_ROCK_TUNNEL_1F,spawn:{x:28,y:44},entry:'up',facing:'up'});

  const width=56,height=48;
  const one=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const openOne=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)one[j][i]='.';};
  // The south and north halves of 1F are intentionally separated by B1F.
  openOne(26,42,5,6);openOne(20,38,11,7);openOne(18,31,7,10);openOne(10,29,13,6);
  openOne(7,20,7,12);openOne(7,8,9,15);openOne(8,6,8,5); // south entrance to west stairs
  openOne(44,7,6,7);openOne(38,10,10,6);openOne(36,13,7,10);openOne(28,19,12,6);
  openOne(26,17,6,11);openOne(24,9,7,11);openOne(26,1,5,10); // east stairs to north exit

  const oneSigns=[
    {x:31,y:43,direction:'down' as const,destination:KANTO_ROUTE_TEN_NORTH,name:'돌산터널 남부 입구',event:'journeySign',pages:['↓ 10번도로 북부 · 블루시티 방향\n← B1F로 내려가는 서쪽 계단','입구의 자연광과 벽의 안전 표식을 따라가면 계단에 닿는다.']},
    {x:31,y:4,direction:'up' as const,destination:KANTO_ROUTE_TEN_SOUTH,name:'돌산터널 북부 출구',event:'journeySign',pages:['↑ 10번도로 남부 · 보라타운 방향\n→ B1F에서 올라오는 동쪽 계단','북쪽 벽 틈으로 바깥빛이 들어온다.']},
  ];
  const oneObjects=[
    {name:'입구 자연광 바위',event:'tourRockTunnelDaylight',cells:[{x:27,y:39},{x:29,y:39}],pages:['터널 입구의 빛이 밝은 암반에 반사되어 남쪽 길을 비춘다.\n안쪽 벽에는 일정한 간격으로 안전 표식이 이어진다.']},
    {name:'암반 긁힌 자국',event:'tourRockTunnelScratches',cells:[{x:19,y:33}],pages:['낮은 암벽에 둥글고 얕은 긁힌 자국이 여러 줄 남아 있다.\n동굴을 오가는 포켓몬이 몸을 기대거나 발을 디딘 흔적처럼 보인다.']},
    {name:'서쪽 하강 계단',event:'tourRockTunnelWestStairs',cells:[{x:11,y:8}],pages:['돌계단이 B1F의 깊은 암반 통로로 내려간다.\n남부 입구로 돌아가려면 이 계단을 다시 이용하면 된다.']},
    {name:'동쪽 상승 계단',event:'tourRockTunnelEastStairs',cells:[{x:47,y:9}],pages:['B1F에서 올라온 계단이다.\n좁은 북부 굴곡을 따라가면 바깥빛이 보인다.']},
  ];
  for(const sign of oneSigns)one[sign.y][sign.x]='#';
  for(const object of oneObjects)for(const cell of object.cells)one[cell.y][cell.x]='#';
  one[47][28]='.';one[1][28]='.';one[9][11]='.';one[10][47]='.';
  world.maps[KANTO_ROCK_TUNNEL_1F]={id:KANTO_ROCK_TUNNEL_1F,name:'돌산터널 1F',width,height,background:KANTO_ROCK_TUNNEL_1F,walkable:one.map(row=>row.join('')),terrain:[],
    warps:[
      {x:28,y:47,to:KANTO_ROUTE_TEN_NORTH,spawn:{x:16,y:3},entry:'down',facing:'down'},
      {x:11,y:9,to:KANTO_ROCK_TUNNEL_B1F,spawn:{x:8,y:38},entry:'up',facing:'down'},
      {x:47,y:10,to:KANTO_ROCK_TUNNEL_B1F,spawn:{x:47,y:10},entry:'down',facing:'left'},
    ],
    npcs:[{id:'rockTunnelWalker',name:'동굴 산행객',sprite:'worker',x:21,y:35,facing:'left',dialogue:'journeyWalker'}],
    props:[...oneSigns.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...oneObjects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };

  const basement=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const openBasement=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)basement[j][i]='.';};
  openBasement(6,36,8,6);openBasement(10,31,8,8);openBasement(14,27,12,7);openBasement(22,21,8,9);
  openBasement(26,18,13,7);openBasement(35,13,8,9);openBasement(40,9,10,7);
  openBasement(13,15,7,7);openBasement(16,13,13,5);openBasement(24,10,7,6); // optional echo loop
  const basementSigns=[
    {x:7,y:39,direction:'down' as const,destination:KANTO_ROCK_TUNNEL_1F,name:'B1F 서쪽 계단 표지',event:'journeySign',pages:['↓ 1F 남부 · 10번도로 북부\n→ B1F 암반 본선','벽의 밝은 표식을 오른쪽으로 이어 따라가자.']},
    {x:48,y:12,direction:'up' as const,destination:KANTO_ROCK_TUNNEL_1F,name:'B1F 동쪽 계단 표지',event:'journeySign',pages:['↑ 1F 북부 · 10번도로 남부 방향\n← B1F 암반 본선','되돌아갈 때도 같은 표식이 서쪽 계단까지 이어진다.']},
  ];
  const basementObjects=[
    {name:'밝은 광물 안전 표식',event:'tourRockTunnelMarkers',cells:[{x:16,y:30},{x:27,y:22},{x:39,y:16}],pages:['자연스럽게 밝은 광물 조각이 본선 벽에 일정한 간격으로 박혀 있다.\n별도 기술을 쓰지 않아도 양쪽 계단 방향을 구분할 수 있다.']},
    {name:'동굴 물방울 쉼터',event:'tourRockTunnelDripRest',cells:[{x:27,y:14}],pages:['천장에서 떨어진 물이 얕은 돌홈에 고여 있다.\n날갯짓 소리가 멀어질 때 여행자와 동료가 잠시 숨을 고르는 자리다.']},
    {name:'산행객의 알통몬',event:'tourRockTunnelPartner',cells:[],pages:['산행객의 알통몬이 작은 돌을 길가에서 치워 통로 가장자리에 모은다.\n둘은 밝은 표식을 하나씩 확인하며 동쪽 계단으로 향하고 있다.']},
  ];
  for(const sign of basementSigns)basement[sign.y][sign.x]='#';
  for(const object of basementObjects)for(const cell of object.cells)basement[cell.y][cell.x]='#';
  basement[40][8]='.';basement[11][47]='.';
  world.maps[KANTO_ROCK_TUNNEL_B1F]={id:KANTO_ROCK_TUNNEL_B1F,name:'돌산터널 B1F',width,height,background:KANTO_ROCK_TUNNEL_B1F,walkable:basement.map(row=>row.join('')),terrain:[
      {kind:'tallGrass',x:14,y:15,w:5,h:6},{kind:'tallGrass',x:24,y:11,w:6,h:4},{kind:'tallGrass',x:28,y:37,w:7,h:3},
    ],
    warps:[
      {x:8,y:40,to:KANTO_ROCK_TUNNEL_1F,spawn:{x:11,y:10},entry:'down',facing:'down'},
      {x:47,y:11,to:KANTO_ROCK_TUNNEL_1F,spawn:{x:47,y:11},entry:'up',facing:'left'},
    ],
    npcs:[
      {id:'rockTunnelHiker',name:'돌산터널 산행객',sprite:'worker',x:31,y:20,facing:'left',dialogue:'journeyWalker'},
      {id:'rockTunnelPartner',name:'산행객의 알통몬',sprite:'field-machop',x:31,y:21,facing:'up',dialogue:'tourRockTunnelPartner'},
      {id:'rockTunnelTrainer',name:'돌산터널 암반 트레이너',sprite:'worker',x:18,y:21,facing:'up',dialogue:'tourRockTunnelTrainer'},
    ],
    props:[...basementSigns.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...basementObjects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };

  for(const [id,name,concept,landmark,x] of [
    [KANTO_ROCK_TUNNEL_1F,'돌산터널 1F','10번도로 북부 입구와 B1F 양쪽 계단, 북부 출구가 분리된 암반층','입구 자연광과 두 계단',lavender.x-.35],
    [KANTO_ROCK_TUNNEL_B1F,'돌산터널 B1F','밝은 광물 안전 표식을 따라 서쪽과 동쪽 계단을 잇는 깊은 암반 본선','광물 안전 표식',lavender.x-.2],
  ] as const){
    world.passages[id]={id,a:world.passagePlaces[KANTO_ROUTE_TEN_NORTH],b:lavender,kind:'cave',bend:id===KANTO_ROCK_TUNNEL_1F?24:30};
    world.passagePlaces[id]={id,name,region:'관동',theme:'cave',concept,landmark,x,y:lavender.y-.65};
    world.spawns[id]=id===KANTO_ROCK_TUNNEL_1F?{x:28,y:44}:{x:8,y:38};
  }
  world.outdoors[KANTO_ROCK_TUNNEL_1F]={objects:oneObjects,signs:oneSigns};
  world.outdoors[KANTO_ROCK_TUNNEL_B1F]={objects:basementObjects,signs:basementSigns};

  installRouteTenSouth(world,lavender);
}

function installRouteTenSouth(world:{
  maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;
  spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
},lavender:Place){
  const tunnel=world.maps[KANTO_ROCK_TUNNEL_1F],town=world.maps[lavender.id];
  tunnel.warps.push({x:28,y:1,to:KANTO_ROUTE_TEN_SOUTH,spawn:{x:14,y:3},entry:'up',facing:'down'});

  const width=28,height=48,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // A descending mountain road that gradually opens toward Lavender Town.
  open(12,1,5,9);open(9,7,8,6);open(8,11,6,10);open(8,18,12,5);
  open(16,20,5,9);open(13,26,8,6);open(11,29,6,10);open(11,36,9,5);
  open(14,38,6,9);open(14,46,3,2);
  open(3,24,10,6);open(4,21,5,5); // Seep and companion rest loop.
  open(18,32,7,6);open(20,29,5,5); // Lavender overlook loop.

  const signs=[
    {x:16,y:5,direction:'up' as const,destination:KANTO_ROCK_TUNNEL_1F,name:'10번도로 북쪽 표지',event:'journeySign',pages:['↑ 돌산터널 1F · B1F · 블루시티 방향\n↓ 10번도로 남부 · 보라타운','터널로 돌아가려면 북쪽 오르막을 따라가자.']},
    {x:12,y:43,direction:'down' as const,destination:lavender.id,name:'보라타운 도착 표지',event:'journeySign',pages:['↓ 보라타운 북쪽\n↑ 돌산터널 · 10번도로 북부 · 9번도로','추모탑이 보이는 완만한 내리막이 마을 입구까지 이어진다.']},
  ];
  const objects=[
    {name:'동굴 바람 쉼터',event:'tourRoute10SouthCaveRest',cells:[{x:10,y:12}],pages:['동굴에서 불어오는 서늘한 바람이 낮은 바위 사이로 빠져나간다.\n여행자와 동료가 밝은 바깥빛에 눈을 적응시키는 자리다.']},
    {name:'산기슭 물고임',event:'tourRoute10SouthSeep',cells:[{x:6,y:23}],pages:['암벽에서 스민 물이 얕은 웅덩이를 만들었다.\n주변에는 작은 발자국과 물을 턴 흔적이 남아 있다.']},
    {name:'보라타운 전망 언덕',event:'tourRoute10LavenderView',cells:[{x:22,y:31}],pages:['남쪽 아래로 보랏빛 지붕과 조용한 정원, 높은 추모탑이 차례로 보인다.\n산길의 거친 돌바닥도 마을 가까이에서 완만해진다.']},
    {name:'여행자의 고라파덕',event:'tourRoute10Psyduck',cells:[],pages:['여행자의 고라파덕이 물고임 가장자리에서 젖은 발을 턴다.\n주인은 동료가 쉬는 동안 보라타운까지 남은 내리막을 지도에서 확인한다.']},
  ];
  for(const sign of signs)rows[sign.y][sign.x]='#';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  rows[1][14]='.';rows[46][14]='.';
  world.maps[KANTO_ROUTE_TEN_SOUTH]={id:KANTO_ROUTE_TEN_SOUTH,name:'관동 10번도로 남부',width,height,background:KANTO_ROUTE_TEN_SOUTH,walkable:rows.map(row=>row.join('')),
    warps:[
      {x:14,y:1,to:KANTO_ROCK_TUNNEL_1F,spawn:{x:28,y:3},entry:'up',facing:'down'},
      {x:14,y:46,to:lavender.id,spawn:{x:14,y:3},entry:'down',facing:'down'},
    ],
    props:[...signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],terrain:[
      {kind:'tallGrass',x:4,y:24,w:5,h:5},{kind:'tallGrass',x:20,y:30,w:4,h:5},
    ],
    npcs:[
      {id:'route10SouthTraveler',name:'보라타운행 여행자',sprite:'ace_trainer_f',x:7,y:26,facing:'right',dialogue:'journeyWalker'},
      {id:'route10SouthPsyduck',name:'여행자의 고라파덕',sprite:'field-psyduck',x:8,y:26,facing:'left',dialogue:'tourRoute10Psyduck'},
      {id:'route10SouthTrainer',name:'10번도로 포켓몬 트레이너',sprite:'pokemon_breeder_f',x:22,y:35,facing:'left',dialogue:'tourRoute10SouthTrainer'},
    ],
  };
  world.passages[KANTO_ROUTE_TEN_SOUTH]={id:KANTO_ROUTE_TEN_SOUTH,a:world.passagePlaces[KANTO_ROCK_TUNNEL_1F],b:lavender,kind:'road',bend:25};
  world.passagePlaces[KANTO_ROUTE_TEN_SOUTH]={id:KANTO_ROUTE_TEN_SOUTH,name:'관동 10번도로 남부',region:'관동',theme:'ghost',concept:'돌산터널의 거친 암반에서 보라타운의 조용한 지붕과 추모탑으로 내려가는 도착 산길',landmark:'보라타운 전망 언덕',x:lavender.x,y:lavender.y-.35};
  world.spawns[KANTO_ROUTE_TEN_SOUTH]={x:14,y:3};world.outdoors[KANTO_ROUTE_TEN_SOUTH]={objects,signs};

  const townX=14,townY=2;
  town.walkable[townY]=town.walkable[townY].slice(0,townX)+'.'+town.walkable[townY].slice(townX+1);
  town.warps.push({x:townX,y:townY,to:KANTO_ROUTE_TEN_SOUTH,spawn:{x:14,y:44},entry:'up',facing:'up'});
  const townSign={x:16,y:4,direction:'up' as const,destination:KANTO_ROUTE_TEN_SOUTH,name:'10번도로 북쪽 출구',event:'journeySign',pages:['↑ 북쪽 관동 10번도로 남부\n돌산터널 · 10번도로 북부 · 9번도로 · 블루시티 방향','산길 전망 언덕을 지나면 돌산터널 북부 입구에 닿는다.']};
  town.walkable[townSign.y]=town.walkable[townSign.y].slice(0,townSign.x)+'#'+town.walkable[townSign.y].slice(townSign.x+1);
  town.props.push({x:townSign.x,y:townSign.y,dialogue:townSign.event});
  world.outdoors[lavender.id].signs.push(townSign);
}
