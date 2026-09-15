import type { GameMap,Point } from './types';
import type { Furnishing,TourInterior } from './explore-interiors';

const CENTER='tour_cinnabar_center';
const LAB='tour_cinnabar_hall';
const MART='tour_cinnabar_mart';
const HOMES=['tour_cinnabar_home1','tour_cinnabar_home2'] as const;

const furnishing=(value:Furnishing):Furnishing=>value;
const centerAdditions:Furnishing[]=[
  furnishing({kind:'bench',name:'쌍둥이섬 동료 건조석',pages:['20번수로와 쌍둥이섬에서 돌아온 동료가 쉬는 자리다.\n마른 수건과 몸집별 방석, 미지근한 물그릇을 나누어 두었다.'],x:18,y:9,w:6,h:2,event:'cinnabarCenterSeafoamRest'}),
  furnishing({kind:'chart',name:'남부 수로 귀환도',pages:['동쪽은 관동 20번수로·쌍둥이섬, 북쪽은 21번수로 방향이다.\n현재 넥서스의 북쪽 길은 원작 수상 지리를 도보 해안길로 재구성했다.'],x:18,y:14,w:6,h:2,event:'cinnabarCenterSeaRouteChart'}),
  furnishing({kind:'workbench',name:'화산재 돌봄 준비대',pages:['분화 뒤 다시 세운 센터에서 포켓몬의 발과 호흡을 먼저 살핀다.\n재가 묻은 장비와 동료가 쓰는 천은 칸을 나누어 정리한다.'],x:4,y:15,w:7,h:2,event:'cinnabarCenterAshCare'}),
];
const labAdditions:Furnishing[]=[
  furnishing({kind:'chart',name:'복구 연구 경계판',pages:['이 공개 연구실은 분화 뒤 넥서스에서 다시 꾸린 공간이다.\nHGSS 시기의 원래 홍련랩이 남아 있었다는 기록이 아니다.'],x:18,y:15,w:6,h:2,event:'cinnabarLabReconstructionRecord'}),
  furnishing({kind:'workbench',name:'현장 귀환 기록대',pages:['20번수로와 쌍둥이섬의 층·날씨·동료 상태를 따로 적는다.\n표본은 가져오지 않고 현장에서 본 위치와 표면만 비교한다.'],x:10,y:19,w:8,h:2,event:'cinnabarLabReturnDesk'}),
];
const martAdditions:Furnishing[]=[
  furnishing({kind:'shelf',name:'남부 수로 보급 선반',pages:['20번수로와 쌍둥이섬을 오가기 전 젖지 않게 싸는 여행 도구를 진열했다.\n실제 판매품은 점원의 기존 몬스터볼과 상처약이다.'],x:16,y:9,w:5,h:2,event:'cinnabarMartSeaRouteShelf'}),
  furnishing({kind:'chart',name:'회복·보급 순서표',pages:['동료가 지쳤다면 먼저 북쪽 센터에서 회복한다.\n보급 뒤 서쪽 상륙 데크로 나가면 공식 20번수로로 돌아간다.'],x:16,y:14,w:5,h:2,event:'cinnabarMartSupplyChart'}),
  furnishing({kind:'bench',name:'동료와 짐을 고르는 자리',pages:['포켓몬이 마른 방석에서 쉬는 동안 몬스터볼과 상처약 수를 확인한다.\n구매는 앞쪽 점원에게 부탁한다.'],x:4,y:14,w:7,h:2,event:'cinnabarMartPackingBench'}),
];

function resizePlainRoom(map:GameMap,room:TourInterior,width:number,height:number,city:string,spawns:Record<string,Point>){
  const center=Math.floor(width/2),rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
  const props:GameMap['props']=[];
  if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
    rows[y][x]='#';props.push({x,y,dialogue:map.id===MART?'martClerk':'tourHost'});
  }
  for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
    rows[y][x]='#';props.push({x,y,dialogue:object.event});
  }
  const entrance={x:center,y:height-1};rows[height-1][center]='.';rows[height-2][center]='.';
  const exit=map.warps.find(warp=>warp.to===city);if(exit)Object.assign(exit,entrance);
  for(const warp of map.warps)if(rows[warp.y]?.[warp.x]!==undefined)rows[warp.y][warp.x]='.';
  map.width=width;map.height=height;map.walkable=rows.map(row=>row.join(''));map.props=props;
  if(map.npcs[0])Object.assign(map.npcs[0],room.host);
  spawns[map.id]={x:center,y:height-4};
}

/** Expand the rebuilt Cinnabar Center while retaining its stable room and service event IDs. */
export function installCinnabarInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  const map=maps[CENTER],room=rooms[CENTER],outside=maps.tour_cinnabar;
  if(!map||!room||!outside)return;
  const width=28,height=22,center=Math.floor(width/2);
  room.title='재건 포켓몬센터';
  room.greeting=['분화 뒤 다시 세운 홍련섬 포켓몬센터입니다.','20번수로와 쌍둥이섬을 다녀온 동료를 쉬게 하고 PC와 귀환도를 확인하세요.'];
  room.host={x:center,y:5};
  room.reception={x:center-4,y:6,w:8,h:1};
  const oldPositions=[{x:4,y:9},{x:20,y:4},{x:4,y:11}];
  room.objects.forEach((object,index)=>Object.assign(object,oldPositions[index]??oldPositions.at(-1)));
  room.objects.push(...centerAdditions);

  const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
  const props:GameMap['props']=[];
  for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){
    rows[y][x]='#';props.push({x,y,dialogue:'tourHost'});
  }
  for(const object of room.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
    rows[y][x]='#';props.push({x,y,dialogue:object.event});
  }
  const entrance={x:center,y:height-1};
  rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
  const exit=map.warps.find(warp=>warp.to==='tour_cinnabar');
  if(exit)Object.assign(exit,entrance);
  map.name='홍련섬 · 재건 포켓몬센터';map.width=width;map.height=height;
  map.walkable=rows.map(row=>row.join(''));map.props=props;
  if(map.npcs[0])Object.assign(map.npcs[0],room.host,{name:'홍련센터 간호사'});
  spawns[CENTER]={x:center,y:height-4};
  for(const warp of outside.warps)if(warp.to===CENTER)warp.spawn={...spawns[CENTER]};

  const labMap=maps[LAB],lab=rooms[LAB];
  if(!labMap||!lab)return;
  const labWidth=28,labHeight=24,labCenter=Math.floor(labWidth/2);
  lab.title='화산 연구소';
  lab.greeting=['분화 뒤 넥서스에서 다시 꾸린 홍련 공개 연구소입니다.','현장 기록과 동료의 기술을 비교하되 표본 채취나 포획을 요구하지 않습니다.'];
  lab.host={x:labCenter,y:6};
  const labPositions=[{x:4,y:8},{x:18,y:8},{x:4,y:15}];
  lab.objects.forEach((object,index)=>Object.assign(object,labPositions[index]??labPositions.at(-1)));
  lab.objects.push(...labAdditions);
  const labRows=Array.from({length:labHeight},(_,y)=>Array.from({length:labWidth},(_,x)=>x>=2&&x<=labWidth-3&&y>=3&&y<=labHeight-3?'.':'#'));
  const labProps:GameMap['props']=[];
  for(const object of lab.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
    labRows[y][x]='#';labProps.push({x,y,dialogue:object.event});
  }
  const labEntrance={x:labCenter,y:labHeight-1};
  labRows[labEntrance.y][labEntrance.x]='.';labRows[labHeight-2][labEntrance.x]='.';
  const labExit=labMap.warps.find(warp=>warp.to==='tour_cinnabar');
  if(labExit)Object.assign(labExit,labEntrance);
  labMap.name='홍련섬 · 복구 화산 연구소';labMap.width=labWidth;labMap.height=labHeight;
  labMap.walkable=labRows.map(row=>row.join(''));labMap.props=labProps;
  if(labMap.npcs[0])Object.assign(labMap.npcs[0],lab.host,{name:'홍련 현장 연구원'});
  spawns[LAB]={x:labCenter,y:labHeight-4};
  for(const warp of outside.warps)if(warp.to===LAB)warp.spawn={...spawns[LAB]};

  const martMap=maps[MART],mart=rooms[MART];
  if(martMap&&mart){
    mart.title='해안 여행 프렌들리숍';
    mart.greeting=['분화 뒤 다시 꾸린 홍련섬 여행 보급소입니다.','20번수로로 떠나기 전에 동료의 상태와 몬스터볼·상처약을 확인하세요.'];
    mart.host={x:12,y:5};mart.reception={x:8,y:6,w:8,h:1};
    const positions=[{x:3,y:4},{x:19,y:4},{x:3,y:10}];
    mart.objects.forEach((object,index)=>Object.assign(object,positions[index]??positions.at(-1)));
    mart.objects.push(...martAdditions);resizePlainRoom(martMap,mart,24,20,'tour_cinnabar',spawns);
    martMap.name='홍련섬 · 해안 여행 프렌들리숍';
  }
  for(const id of HOMES){
    const homeMap=maps[id],home=rooms[id];if(!homeMap||!home)continue;
    const positions=[{x:3,y:6},{x:16,y:5},{x:4,y:12},{x:17,y:12}];
    home.objects.forEach((object,index)=>Object.assign(object,positions[index]??positions.at(-1)));
    home.host={x:12,y:9};resizePlainRoom(homeMap,home,24,18,'tour_cinnabar',spawns);
  }
  const resizedRooms=new Set<string>([MART,...HOMES]);
  for(const warp of outside.warps)if(resizedRooms.has(warp.to)&&spawns[warp.to])warp.spawn={...spawns[warp.to]};
}
