import type {GameMap,Point} from './types';
import type {Place,TourId} from './explore-world';
import type {TourOutdoors} from './explore-outdoors';
import {JOHTO_ROUTE_31} from './johto-route-30';

export const JOHTO_DARK_CAVE_WEST='tour_johto_dark_cave_west' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};

/** HGSS Dark Cave Route 31 side: optional lit survey loop with a guaranteed return. */
export function installJohtoDarkCaveWest(world:World){
  const route=world.maps[JOHTO_ROUTE_31],routePlace=world.passagePlaces[JOHTO_ROUTE_31];
  if(!route||!routePlace||world.maps[JOHTO_DARK_CAVE_WEST])return;

  const width=56,height=48,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  carve(rows,1,34,16,9);                    // Route 31 entrance shelf
  carve(rows,12,25,10,17);                  // western rise
  carve(rows,18,20,20,10);                  // central dry ridge
  carve(rows,34,9,10,19);                   // northeast rock corridor
  carve(rows,25,33,20,8);                   // southern return loop
  carve(rows,42,24,9,17);                   // deeper-cave boundary approach
  carve(rows,20,37,8,4);
  for(let y=34;y<39;y++)for(let x=34;x<40;x++)rows[y][x]='#'; // underground pond inside the return loop

  const objects:ObjectInfo[]=[
    {name:'31번도로 바깥빛 표식',event:'tourDarkCaveRoute31Light',cells:[{x:8,y:34}],pages:['서쪽 입구로31번도로와 도라지시티에 돌아갈 수 있다.\n바닥의 밝은 돌 표식을 따라가면 막힌 물길 앞에서 다시 이곳으로 이어진다.']},
    {name:'어둠의동굴 서식 흔적',event:'tourDarkCaveHabitat',cells:[{x:28,y:21}],pages:['낮은 천장에는 주뱃의 날갯소리가, 마른 암반에는 꼬마돌의 긁힌 흔적이 남아 있다.\n밝은 본선을 벗어난 자갈 구역에서만 야생 포켓몬을 만난다.']},
    {name:'남서 구역 작은 연못',event:'tourDarkCavePond',cells:[{x:37,y:31}],pages:['원작의 남서 구역은 물길·바위 장애물을 넘어46번도로와 북동 구역으로 이어진다.\n현재는 파도타기·바위깨기·괴력을 대신 열지 않고 이 탐사 고리에서 되돌아간다.']},
    {name:'심부 통행 경계',event:'tourDarkCaveDeepBoundary',cells:[{x:49,y:27}],pages:['동쪽 심부와46번도로·45번도로 방면은 아직 연결하지 않았다.\n31번도로 출구는 밝은 돌 표식을 따라 서쪽 아래에 있다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';

  world.maps[JOHTO_DARK_CAVE_WEST]={id:JOHTO_DARK_CAVE_WEST,name:'어둠의동굴 남서 구역',width,height,background:JOHTO_DARK_CAVE_WEST,walkable:rows.map(row=>row.join('')),warps:[
    {x:1,y:38,to:JOHTO_ROUTE_31,spawn:{x:40,y:6},entry:'left',facing:'left'},
  ],terrain:[
    {kind:'tallGrass',x:13,y:27,w:6,h:8},{kind:'tallGrass',x:22,y:21,w:10,h:5},{kind:'tallGrass',x:28,y:35,w:11,h:4},
  ],npcs:[
    {id:'darkCaveObserver',name:'어둠의동굴 생태 조사원',sprite:'ace_trainer_f',x:19,y:38,facing:'left',dialogue:'tourDarkCaveObserver'},
  ],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};

  const place:Place={id:JOHTO_DARK_CAVE_WEST,name:'어둠의동굴 남서 구역',region:'성도',theme:'cave',concept:'31번도로 바깥빛에서 주뱃·꼬마돌의 암반 서식지를 살피고 같은 입구로 귀환하는 선택 동굴',landmark:'밝은 돌 표식과 작은 지하 연못',x:routePlace.x+1,y:routePlace.y};
  world.places.push(place);world.passagePlaces[JOHTO_DARK_CAVE_WEST]=place;world.spawns[JOHTO_DARK_CAVE_WEST]={x:3,y:38};world.outdoors[JOHTO_DARK_CAVE_WEST]={objects,signs:[]};

  route.warps.push({x:42,y:6,to:JOHTO_DARK_CAVE_WEST,spawn:{x:3,y:38},entry:'up',facing:'right'});
  const entrance=world.outdoors[JOHTO_ROUTE_31]?.objects.find(object=>object.event==='tourRoute31DarkCaveBoundary');
  if(entrance){entrance.name='어둠의동굴 서쪽 입구';entrance.pages=['동쪽 암벽은 어둠의동굴 남서 구역 입구다.\n입구 가까운 밝은 돌 탐사 고리를 돌아 같은31번도로로 귀환할 수 있다.'];}
}

/** Project-drawn BW/BW2-style cave floor; no original pixels are reused. */
export function paintJohtoDarkCaveWest(c:CanvasRenderingContext2D,map:GameMap):boolean{
  if(map.id!==JOHTO_DARK_CAVE_WEST)return false;
  const encounter=(x:number,y:number)=>(map.terrain??[]).some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    if(!walk){
      const pond=x>=34&&x<40&&y>=34&&y<39;
      if(pond){c.fillStyle='#315c70';c.fillRect(px,py,16,16);c.fillStyle='#4c8793';c.fillRect(px+1,py+2,14,11);c.fillStyle='#9bc0b7';c.fillRect(px+3+(y%2)*3,py+5,8,1);c.fillStyle='#254653';c.fillRect(px,py+13,16,3);continue;}
      c.fillStyle='#343e43';c.fillRect(px,py,16,16);c.fillStyle=(x+y)%3?'#536068':'#5d696e';c.fillRect(px+1,py+2,14,9);c.fillStyle='#263238';c.fillRect(px,py+11,16,5);c.fillStyle='#798178';c.fillRect(px+3,py+2,8,1);continue;
    }
    const rough=encounter(x,y);
    c.fillStyle=rough?'#646259':'#77786d';c.fillRect(px,py,16,16);
    c.fillStyle=rough?'#868173':'#9b9a87';c.fillRect(px+1,py+1,14,14);
    c.fillStyle=rough?'#4f5350':'#6e7168';c.fillRect(px+2+(x%3)*4,py+10,4,2);
    if(!rough&&(x*5+y*3)%11===0){c.fillStyle='#d7d2a4';c.fillRect(px+6,py+6,4,3);c.fillStyle='#f1e7b1';c.fillRect(px+7,py+5,2,1);}
  }
  for(const warp of map.warps){const px=warp.x*16,py=warp.y*16;c.fillStyle='#252f34';c.fillRect(px,py+2,16,14);c.fillStyle='#d8d2a4';c.fillRect(px+5,py+12,6,2);}
  return true;
}
