import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const REVERSAL_MOUNTAIN_EXTERIOR='tour_reversal_mountain_exterior' as const;
export const REVERSAL_MOUNTAIN_A='tour_reversal_mountain_a' as const;
export const REVERSAL_MOUNTAIN_B='tour_reversal_mountain_b' as const;
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

export function installReversalMountainExterior(world:World){
  const lentimas=world.places.find(p=>p.id==='tour_lentimas')!,undella=world.places.find(p=>p.id==='tour_undella')!;
  const rows=Array.from({length:48},()=>Array<string>(56).fill('#'));
  open(rows,1,21,15,7);open(rows,12,15,7,13);open(rows,16,13,14,6);open(rows,26,9,7,10);
  open(rows,29,7,16,6);open(rows,41,7,7,13);open(rows,44,16,7,8);open(rows,47,10,7,14);
  open(rows,8,31,11,4);open(rows,15,27,4,8);open(rows,18,27,10,4);
  const objects=[
    {name:'화산재 바람막이',event:'tourReversalAshShelter',cells:[{x:14,y:20}],pages:['낮은 돌담이 산에서 내려오는 재바람을 막아 준다.','사람과 포켓몬이 눈과 발을 닦을 마른 천이 밀폐함에 들어 있다.']},
    {name:'식은 용암층',event:'tourReversalLavaShelf',cells:[{x:30,y:14}],pages:['검붉은 바위 표면에 오래전에 식은 흐름의 결이 남아 있다.','현재 뜨거운 용암이 흐른다는 뜻은 아니며 표시선 안으로 들어가지 않는다.']},
    {name:'동굴 입구 안전선',event:'tourReversalCaveBoundary',cells:[{x:50,y:12}],pages:['리버스마운틴 통과구역 A 입구다.','내부 MapId와 귀환 경로가 연결되기 전에는 안전선 밖에서 돌아간다.']},
    {name:'화산재 발자국판',event:'tourReversalTracks',cells:[{x:23,y:28}],pages:['작은 포켓몬과 등산화 자국이 재 위에 겹쳐 있다.','현재 조우종을 확정한 표본이 아니므로 특정 포켓몬의 흔적이라고 단정하지 않는다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[REVERSAL_MOUNTAIN_EXTERIOR]={id:REVERSAL_MOUNTAIN_EXTERIOR,name:'리버스마운틴 외부',width:56,height:48,background:REVERSAL_MOUNTAIN_EXTERIOR,walkable:rows.map(row=>row.join('')),terrain:[],
    warps:[{x:1,y:24,to:lentimas.id,spawn:{x:37,y:12},entry:'left',facing:'left'}],
    npcs:[{id:'reversalRanger',name:'재바람 산길지기',sprite:'rancher',x:18,y:17,facing:'right',dialogue:'tourReversalRanger'}],
    props:[{x:4,y:20,dialogue:'tourReversalSign'},...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))]};
  world.passagePlaces[REVERSAL_MOUNTAIN_EXTERIOR]={id:REVERSAL_MOUNTAIN_EXTERIOR,name:'리버스마운틴 외부',region:'하나',theme:'desert',concept:'산로마을에서 재바람 능선과 식은 용암층을 지나 동굴 입구로 오르는 외부 산길',landmark:'화산재 바람막이',x:lentimas.x+.5,y:lentimas.y};
  world.spawns[REVERSAL_MOUNTAIN_EXTERIOR]={x:3,y:24};
  world.outdoors[REVERSAL_MOUNTAIN_EXTERIOR]={objects,signs:[{x:4,y:20,direction:'left',destination:lentimas.id,name:'산로마을',event:'tourReversalSign',pages:['← 산로마을 · 궐수행 착륙장','센터와 산길 안내소로 돌아갈 수 있다.']} ]};
  const town=world.maps[lentimas.id];town.walkable=town.walkable.map((row,y)=>y===12?row.slice(0,38)+'.'+row.slice(39):row);
  town.warps.push({x:38,y:12,to:REVERSAL_MOUNTAIN_EXTERIOR,spawn:{x:3,y:24},entry:'right',facing:'right'});
  world.outdoors[lentimas.id].signs.push({x:35,y:10,direction:'right',destination:REVERSAL_MOUNTAIN_EXTERIOR,name:'리버스마운틴 외부',event:'tourLentimasMountainSign',pages:['동쪽 → 리버스마운틴 외부','재바람 능선을 지나 동굴 입구 안전선까지 왕복할 수 있다.']});
  town.props.push({x:35,y:10,dialogue:'tourLentimasMountainSign'});

  const cave=Array.from({length:56},()=>Array<string>(64).fill('#'));
  open(cave,1,43,13,7);open(cave,10,33,7,17);open(cave,13,31,18,7);open(cave,27,22,7,16);
  open(cave,30,19,17,7);open(cave,43,10,7,16);open(cave,46,8,16,7);
  open(cave,18,42,13,4);open(cave,18,37,5,9);open(cave,37,29,10,4);open(cave,43,24,4,9);
  const caveObjects=[
    {name:'식은 용암 수로',event:'tourReversalCooledChannel',cells:[{x:15,y:36},{x:39,y:23}],pages:['검은 수로 표면에 굳은 흐름의 줄무늬가 남아 있다.','빛나 보여도 현재 흐르는 용암이나 건널 수 있는 물길은 아니다.']},
    {name:'증기 분출 관측선',event:'tourReversalSteamVent',cells:[{x:31,y:29}],pages:['바위 틈의 따뜻한 증기를 안전 거리에서 관찰하는 표시선이다.','포켓몬의 얼굴을 가까이 대지 않고 바람이 빠지는 길을 비워 둔다.']},
    {name:'동행 휴게 홈',event:'tourReversalRestAlcove',cells:[{x:21,y:40}],pages:['재바람이 적고 지면이 식은 작은 암벽 홈이다.','동료의 호흡과 발 상태를 확인하고 외부나 산로마을로 돌아갈 수 있다.']},
    {name:'통과구역 B 경계 표지',event:'tourReversalBoundaryB',cells:[{x:56,y:11}],pages:['리버스마운틴 통과구역 B 방향이다.','B의 동쪽 출구는 물결마을 서쪽 절벽으로 이어지며 같은 길로 돌아올 수 있다.']},
  ];
  for(const object of caveObjects)for(const cell of object.cells)cave[cell.y][cell.x]='#';
  world.maps[REVERSAL_MOUNTAIN_A]={id:REVERSAL_MOUNTAIN_A,name:'리버스마운틴 통과구역 A',width:64,height:56,background:REVERSAL_MOUNTAIN_A,walkable:cave.map(row=>row.join('')),terrain:[],
    warps:[{x:1,y:46,to:REVERSAL_MOUNTAIN_EXTERIOR,spawn:{x:52,y:12},entry:'left',facing:'left'}],
    npcs:[{id:'reversalCaveGuide',name:'화산 동굴 조사원',sprite:'scientist_f',x:16,y:45,facing:'up',dialogue:'tourReversalCaveGuide'}],
    props:[{x:4,y:42,dialogue:'tourReversalCaveSign'},...caveObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))]};
  world.passagePlaces[REVERSAL_MOUNTAIN_A]={id:REVERSAL_MOUNTAIN_A,name:'리버스마운틴 통과구역 A',region:'하나',theme:'cave',concept:'식은 용암 수로와 증기 관측선을 지나 동행 상태를 살피는 리버스마운틴 첫 내부 구역',landmark:'동행 휴게 홈',x:lentimas.x+1,y:lentimas.y};
  world.spawns[REVERSAL_MOUNTAIN_A]={x:3,y:46};
  world.outdoors[REVERSAL_MOUNTAIN_A]={objects:caveObjects,signs:[{x:4,y:42,direction:'left',destination:REVERSAL_MOUNTAIN_EXTERIOR,name:'리버스마운틴 외부',event:'tourReversalCaveSign',pages:['← 리버스마운틴 외부 · 산로마을','외부 능선을 지나 산로마을 센터와 궐수행 착륙장으로 돌아간다.']} ]};
  world.maps[REVERSAL_MOUNTAIN_EXTERIOR].warps.push({x:53,y:12,to:REVERSAL_MOUNTAIN_A,spawn:{x:3,y:46},entry:'right',facing:'right'});
  const boundary=objects.find(object=>object.event==='tourReversalCaveBoundary');if(boundary){boundary.name='통과구역 A 입구';boundary.pages=['리버스마운틴 통과구역 A 입구다.','내부 첫 구역과 외부 귀환 경로가 연결돼 있다. B 구역은 내부 표지에서 확인한다.'];}

  const deep=Array.from({length:56},()=>Array<string>(56).fill('#'));
  open(deep,1,41,12,7);open(deep,9,31,7,17);open(deep,12,28,17,7);open(deep,25,20,7,15);
  open(deep,28,17,15,7);open(deep,39,9,7,15);open(deep,42,7,13,7);
  open(deep,18,39,11,4);open(deep,18,33,5,10);open(deep,34,26,4,10);open(deep,34,23,9,4);
  const deepObjects=[
    {name:'고온 지면 우회선',event:'tourReversalHotFloor',cells:[{x:13,y:37}],pages:['붉게 변색된 지면을 피해 식은 바위 가장자리로 걷는 우회선이다.','뜨거운 곳을 밟는 기술이나 특정 포켓몬을 요구하지 않는다.']},
    {name:'광물빛 관찰벽',event:'tourReversalMineralWall',cells:[{x:27,y:27}],pages:['어두운 벽의 광물층이 증기를 받아 희미하게 반짝인다.','빛나는 돌을 아이템으로 획득하거나 캐내는 장소는 아니다.']},
    {name:'서늘한 바람 홈',event:'tourReversalCoolAlcove',cells:[{x:36,y:25}],pages:['동쪽 출구에서 들어온 서늘한 바람이 머무는 작은 홈이다.','사람과 포켓몬이 물을 마시고 호흡을 고른 뒤 진행한다.']},
    {name:'물결마을 출구 안전선',event:'tourReversalUndellaBoundary',cells:[{x:49,y:10}],pages:['리버스마운틴 동쪽 출구와 물결마을 방향이다.','동쪽으로 나가면 물결마을 서쪽 절벽이며 서쪽은 통과구역 A 귀환길이다.']},
  ];
  for(const object of deepObjects)for(const cell of object.cells)deep[cell.y][cell.x]='#';
  world.maps[REVERSAL_MOUNTAIN_B]={id:REVERSAL_MOUNTAIN_B,name:'리버스마운틴 통과구역 B',width:56,height:56,background:REVERSAL_MOUNTAIN_B,walkable:deep.map(row=>row.join('')),terrain:[],
    warps:[{x:1,y:44,to:REVERSAL_MOUNTAIN_A,spawn:{x:61,y:11},entry:'left',facing:'left'}],
    npcs:[{id:'reversalDeepGuide',name:'고온 지대 산길지기',sprite:'worker',x:15,y:32,facing:'right',dialogue:'tourReversalDeepGuide'}],
    props:[{x:4,y:40,dialogue:'tourReversalDeepSign'},...deepObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))]};
  world.passagePlaces[REVERSAL_MOUNTAIN_B]={id:REVERSAL_MOUNTAIN_B,name:'리버스마운틴 통과구역 B',region:'하나',theme:'cave',concept:'고온 지면을 우회하고 서늘한 바람 홈에서 쉬며 물결마을 방향 출구로 오르는 깊은 통과 구역',landmark:'서늘한 바람 홈',x:lentimas.x+1.5,y:lentimas.y};
  world.spawns[REVERSAL_MOUNTAIN_B]={x:3,y:44};
  world.outdoors[REVERSAL_MOUNTAIN_B]={objects:deepObjects,signs:[{x:4,y:40,direction:'left',destination:REVERSAL_MOUNTAIN_A,name:'통과구역 A',event:'tourReversalDeepSign',pages:['← 리버스마운틴 통과구역 A','외부와 산로마을로 돌아가는 길이다.']} ]};
  world.maps[REVERSAL_MOUNTAIN_A].warps.push({x:62,y:11,to:REVERSAL_MOUNTAIN_B,spawn:{x:3,y:44},entry:'right',facing:'right'});
  const boundaryB=caveObjects.find(object=>object.event==='tourReversalBoundaryB');if(boundaryB){boundaryB.name='통과구역 B 입구';boundaryB.pages=['리버스마운틴 통과구역 B 방향이다.','깊은 구역과 A 귀환 경로가 연결돼 있다. 물결마을 경계는 B 동쪽에 있다.'];}
  world.maps[REVERSAL_MOUNTAIN_B].warps.push({x:54,y:10,to:undella.id,spawn:{x:2,y:12},entry:'right',facing:'right'});
  const undellaMap=world.maps[undella.id];undellaMap.walkable=undellaMap.walkable.map((row,y)=>y===12?row.slice(0,1)+'.'+row.slice(2):row);
  undellaMap.warps.push({x:1,y:12,to:REVERSAL_MOUNTAIN_B,spawn:{x:53,y:10},entry:'left',facing:'left'});
  world.outdoors[undella.id].signs.push({x:3,y:10,direction:'left',destination:REVERSAL_MOUNTAIN_B,name:'리버스마운틴 통과구역 B',event:'tourUndellaMountainSign',pages:['서쪽 → 리버스마운틴 통과구역 B · 산로마을','고온 지대와 통과구역 A, 외부 능선을 거쳐 산로마을로 돌아간다.']});
  undellaMap.props.push({x:3,y:10,dialogue:'tourUndellaMountainSign'});
  const undellaBoundary=deepObjects.find(object=>object.event==='tourReversalUndellaBoundary');if(undellaBoundary){undellaBoundary.name='물결마을 출구';undellaBoundary.pages=['리버스마운틴 동쪽 출구와 물결마을 방향이다.','바닷바람이 드는 출구로 나가면 물결마을 서쪽 절벽에 닿는다.'];}
}

export function paintReversalMountain(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const cave=map.id!==REVERSAL_MOUNTAIN_EXTERIOR,paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';paintTourGround(c,images['town-reference'],px,py,cave?'cave':'desert');
    if(walk)paths.add(x+','+y);else if(cave){fill(px,py,16,16,'#3c3234');fill(px+1,py+2,14,6,'#684848');fill(px+3,py+4,10,2,'#986354');if((x+y)%6===0)fill(px+9,py+9,5,4,'#24282b');}else{fill(px,py,16,16,'#704f45');fill(px+1,py+2,14,6,'#9b6a55');fill(px+3,py+4,10,2,'#c18a68');if((x+y)%7===0)fill(px+9,py+9,5,4,'#4d4642');}
  }
  paintTourPaths(c,images['town-reference'],paths,cave?'cave':'desert');
  for(let y=6;y<map.height-4;y+=9)for(let x=5+(y%4);x<map.width-4;x+=13){fill(x*16,y*16+12,8,2,cave?'#8e5f51':'#d2aa82');fill(x*16+3,y*16+10,3,2,cave?'#c69072':'#ead0a8');}
}
