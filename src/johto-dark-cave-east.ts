import type {GameMap,Point} from './types';
import type {Place,TourId} from './explore-world';
import type {TourOutdoors} from './explore-outdoors';
import {JOHTO_ROUTE_45,JOHTO_ROUTE_46} from './johto-blackthorn-south';

export const JOHTO_DARK_CAVE_EAST='tour_johto_dark_cave_east' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};

/** HGSS Dark Cave Route 45 side, retaining separate Route 45 and Route 46 return pockets. */
export function installJohtoDarkCaveEast(world:World){
  const r45=world.maps[JOHTO_ROUTE_45],r46=world.maps[JOHTO_ROUTE_46],base=world.passagePlaces[JOHTO_ROUTE_45];
  if(!r45||!r46||!base||world.maps[JOHTO_DARK_CAVE_EAST])return;
  const width=64,height=56,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  carve(rows,28,1,9,17);carve(rows,15,13,22,9);carve(rows,10,18,12,16);carve(rows,19,29,19,8); // Route 45 pocket
  carve(rows,46,38,10,17);carve(rows,38,36,18,8);carve(rows,42,28,9,11);                 // Route 46 pocket
  const objects:ObjectInfo[]=[
    {name:'45번도로 바깥빛 표식',event:'tourDarkCaveRoute45Light',cells:[{x:31,y:5}],pages:['북쪽 출구는45번도로와 검은먹시티 방향이다.\n이 구역은 지하 연못 가장자리까지 살핀 뒤 같은 출구로 돌아온다.']},
    {name:'북동 구역 지하 연못',event:'tourDarkCaveEastPond',cells:[{x:20,y:25}],pages:['45번도로 쪽 굽은 길 아래에 큰 지하 연못이 놓여 있다.\n파도타기 없이 건너지 않으며 서쪽 남서 구역과의 관통은 아직 경계다.']},
    {name:'남서 구역 연결 경계',event:'tourDarkCaveWestLinkBoundary',cells:[{x:36,y:34}],pages:['물길 너머는31번도로 쪽 남서 구역이다.\n현재는 두 구역을 억지로 연결하지 않고45번도로 출구로 되돌아간다.']},
    {name:'46번도로 바깥빛 표식',event:'tourDarkCaveRoute46Light',cells:[{x:52,y:49}],pages:['남쪽 출구는46번도로와29번도로 방향이다.\n막힌 바위 전까지 살핀 뒤 같은 출구로 돌아갈 수 있다.']},
    {name:'46번도로 쪽 바위 경계',event:'tourDarkCaveRoute46RockBoundary',cells:[{x:43,y:29}],pages:['북쪽 통로는 원작의 바위 장애물과 심부 길을 나타낸다.\n현재 바위깨기·괴력을 새로 열지 않고46번도로로 귀환한다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[JOHTO_DARK_CAVE_EAST]={id:JOHTO_DARK_CAVE_EAST,name:'어둠의동굴 북동 구역',width,height,background:JOHTO_DARK_CAVE_EAST,walkable:rows.map(row=>row.join('')),warps:[
    {x:32,y:1,to:JOHTO_ROUTE_45,spawn:{x:8,y:17},entry:'up',facing:'up'},
    {x:52,y:54,to:JOHTO_ROUTE_46,spawn:{x:28,y:22},entry:'down',facing:'down'},
  ],terrain:[
    {kind:'tallGrass',x:16,y:15,w:8,h:5},{kind:'tallGrass',x:11,y:23,w:7,h:8},{kind:'tallGrass',x:23,y:31,w:10,h:4},
    {kind:'tallGrass',x:47,y:40,w:7,h:5},{kind:'tallGrass',x:43,y:30,w:6,h:6},
  ],npcs:[],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  const place:Place={id:JOHTO_DARK_CAVE_EAST,name:'어둠의동굴 북동 구역',region:'성도',theme:'cave',concept:'45번도로 연못 가장자리와46번도로 바위 주머니를 각각 살피고 같은 산길로 돌아가는 선택 동굴',landmark:'큰 지하 연못과 두 바깥빛 표식',x:base.x+1,y:base.y+1};
  world.places.push(place);world.passagePlaces[JOHTO_DARK_CAVE_EAST]=place;world.spawns[JOHTO_DARK_CAVE_EAST]={x:32,y:3};world.outdoors[JOHTO_DARK_CAVE_EAST]={objects,signs:[]};

  r45.warps.push({x:8,y:17,to:JOHTO_DARK_CAVE_EAST,spawn:{x:32,y:3},entry:'left',facing:'down'});
  r46.warps.push({x:28,y:22,to:JOHTO_DARK_CAVE_EAST,spawn:{x:52,y:51},entry:'right',facing:'up'});
  const route45Object:ObjectInfo={name:'어둠의동굴 45번도로 입구',event:'tourRoute45DarkCaveEntrance',cells:[{x:8,y:14}],pages:['남쪽 암벽길은 어둠의동굴 북동 구역으로 이어진다.\n지하 연못 가장자리까지 살핀 뒤 같은45번도로로 돌아온다.']};
  const route46Object:ObjectInfo={name:'어둠의동굴 46번도로 입구',event:'tourRoute46DarkCaveEntrance',cells:[{x:30,y:21}],pages:['서쪽 암벽길은 어둠의동굴 북동 구역의 남쪽 주머니로 이어진다.\n바위 경계에서 같은46번도로로 돌아온다.']};
  for(const [map,outdoor,object] of [[r45,world.outdoors[JOHTO_ROUTE_45],route45Object],[r46,world.outdoors[JOHTO_ROUTE_46],route46Object]] as const){
    outdoor.objects.push(object);map.props.push(...object.cells.map(cell=>({...cell,dialogue:object.event})));
  }
}

export function paintJohtoDarkCaveEast(c:CanvasRenderingContext2D,map:GameMap):boolean{
  if(map.id!==JOHTO_DARK_CAVE_EAST)return false;
  const encounter=(x:number,y:number)=>(map.terrain??[]).some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    if(!walk){c.fillStyle='#303b42';c.fillRect(px,py,16,16);c.fillStyle=(x+y)%3?'#52616a':'#5d6b70';c.fillRect(px+1,py+2,14,9);c.fillStyle='#253138';c.fillRect(px,py+11,16,5);continue;}
    const rough=encounter(x,y);c.fillStyle=rough?'#68665c':'#858477';c.fillRect(px,py,16,16);c.fillStyle=rough?'#8c8777':'#aaa58d';c.fillRect(px+1,py+1,14,14);
    c.fillStyle=rough?'#50534f':'#77766a';c.fillRect(px+3+(x%3)*3,py+10,4,2);
    if(!rough&&(x*3+y*5)%13===0){c.fillStyle='#d9d5aa';c.fillRect(px+6,py+6,4,3);c.fillStyle='#f2eab9';c.fillRect(px+7,py+5,2,1);}
  }
  // The central darkness reads as the uncrossed water/rock divide between the two return pockets.
  for(let y=22;y<28;y++)for(let x=22;x<35;x++){const px=x*16,py=y*16;if(map.walkable[y]?.[x]==='.')continue;c.fillStyle='#31596c';c.fillRect(px,py,16,16);c.fillStyle='#4a8490';c.fillRect(px+1,py+2,14,11);c.fillStyle='#9bbdb4';c.fillRect(px+3+(y%2)*3,py+6,8,1);}
  return true;
}
