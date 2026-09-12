import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const UNOVA_ROUTE_THIRTEEN='tour_unova_route_13' as const;
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const objectProps=(objects:{event:string;cells:Point[]}[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

/** 물결마을에서 보배마을 방향으로 오르는 B2W2 기준 13번도로의 남부 본선. */
export function installUnovaRouteThirteen(world:World){
  const undella=world.places.find(place=>place.id==='tour_undella'),lacunosa=world.places.find(place=>place.id==='tour_lacunosa');if(!undella||!lacunosa)return;
  const town=world.maps[undella.id],townOutdoors=world.outdoors[undella.id],northTown=world.maps[lacunosa.id],northOutdoors=world.outdoors[lacunosa.id];if(!town||!townOutdoors||!northTown||!northOutdoors)return;
  const rows=Array.from({length:96},()=>Array<string>(36).fill('#'));
  open(rows,15,1,6,94);
  open(rows,6,75,15,5);open(rows,6,67,5,13);open(rows,8,65,13,5);
  open(rows,20,50,10,5);open(rows,26,41,4,14);open(rows,18,39,12,5);
  open(rows,5,24,16,5);open(rows,5,15,4,14);open(rows,7,13,14,5);
  open(rows,21,60,8,4);open(rows,25,57,4,7);
  const objects=[
    {name:'물결 해안 전망대',event:'tourRouteThirteenCoast',cells:[{x:9,y:72}],pages:['물결마을 해변과 리버스마운틴의 붉은 절벽을 함께 볼 수 있다.','바닷바람이 강할 때 사람과 포켓몬이 난간 안쪽에서 쉬는 자리다.']},
    {name:'절벽 샘 관찰지',event:'tourRouteThirteenSpring',cells:[{x:27,y:48}],pages:['바위 틈에서 나온 맑은 물이 낮은 홈을 따라 흐른다.','마실 수 있는 물이나 회복 지점으로 확인된 장소는 아니므로 관찰선 밖에서 살핀다.']},
    {name:'숨은동굴 흔적판',event:'tourRouteThirteenGrotto',cells:[{x:26,y:59}],pages:['절벽 식생 사이 작은 틈과 포켓몬 발자국을 구분해 그린 관찰판이다.','숨은동굴 내부·야생 조우·도구 획득은 아직 연결하지 않았다.']},
    {name:'고지 초원 바람표',event:'tourRouteThirteenMeadow',cells:[{x:12,y:25}],pages:['해안의 습한 바람이 고지의 마른 풀밭으로 바뀌는 지점이다.','확인되지 않은 조우종 대신 풀의 눕는 방향과 발자국만 기록한다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  const map:GameMap={id:UNOVA_ROUTE_THIRTEEN,name:'하나 13번도로',width:36,height:96,background:UNOVA_ROUTE_THIRTEEN,walkable:rows.map(row=>row.join('')),terrain:[],
    warps:[{x:17,y:94,to:undella.id,spawn:{x:45,y:13},entry:'down',facing:'left'},{x:17,y:1,to:lacunosa.id,spawn:{x:14,y:37},entry:'up',facing:'up'}],
    npcs:[
      {id:'routeThirteenRanger',name:'13번도로 해안지기',sprite:'rancher',x:12,y:67,facing:'right',dialogue:'tourRouteThirteenRanger'},
      {id:'routeThirteenHiker',name:'고지 산행객',sprite:'worker',x:18,y:39,facing:'down',dialogue:'tourRouteThirteenHiker'},
    ],
    props:[{x:13,y:89,dialogue:'tourRouteThirteenSign'},{x:21,y:8,dialogue:'tourRouteThirteenSign'},...objectProps(objects)],
  };
  world.maps[UNOVA_ROUTE_THIRTEEN]=map;
  world.passagePlaces[UNOVA_ROUTE_THIRTEEN]={id:UNOVA_ROUTE_THIRTEEN,name:'하나 13번도로',region:'하나',theme:'coast',concept:'물결마을 해변에서 절벽 샘과 고지 초원을 지나 보배마을 방향으로 오르는 긴 해안도로',landmark:'해안 전망대와 숨은동굴 흔적판',x:undella.x+1,y:undella.y-.5};
  world.spawns[UNOVA_ROUTE_THIRTEEN]={x:17,y:91};
  world.outdoors[UNOVA_ROUTE_THIRTEEN]={objects,signs:[
    {x:13,y:89,direction:'down',destination:undella.id,name:'물결마을',event:'tourRouteThirteenSign',pages:['↓ 물결마을','해변 안내소와 리버스마운틴 귀환길 방향이다.']},
    {x:21,y:8,direction:'up',destination:lacunosa.id,name:'보배마을',event:'tourRouteThirteenSign',pages:['↑ 보배마을','고지 초원을 지나 오래된 성벽의 남쪽 문으로 들어간다.']},
  ]};
  for(let x=36;x<=46;x++)town.walkable[13]=town.walkable[13].slice(0,x)+'.'+town.walkable[13].slice(x+1);
  town.warps.push({x:46,y:13,to:UNOVA_ROUTE_THIRTEEN,spawn:{x:17,y:91},entry:'right',facing:'up'});
  for(let y=26;y<=38;y++)northTown.walkable[y]=northTown.walkable[y].slice(0,14)+'.'+northTown.walkable[y].slice(15);
  northTown.warps.push({x:14,y:38,to:UNOVA_ROUTE_THIRTEEN,spawn:{x:17,y:3},entry:'down',facing:'down'});
  const sign=townOutdoors.objects.find(object=>object.event==='tourUndellaRouteThirteen')??townOutdoors.objects.find(object=>/13번도로/.test(object.name));
  if(sign){sign.name='13번도로 진입 표지';sign.pages=['동쪽 길은 하나 13번도로 남부로 이어진다.','해안 절벽과 고지 초원을 지나 보배마을 남쪽 성벽 문까지 같은 길로 왕복할 수 있다.'];}
  const exitSign=townOutdoors.signs.find(sign=>sign.direction==='right');
  if(exitSign){exitSign.destination=UNOVA_ROUTE_THIRTEEN;exitSign.name='하나 13번도로';exitSign.pages=['동쪽 → 하나 13번도로','해안 절벽·고지 초원·보배마을 방향이다.'];}
  const arrival=northOutdoors.objects.find(object=>/13번도로 도착/.test(object.name));
  if(arrival)arrival.pages=['남쪽 길은 하나 13번도로와 물결마을로 이어진다.','고지 초원과 해안 절벽을 지나 같은 길로 왕복할 수 있다.'];
  northOutdoors.signs.push({x:17,y:34,direction:'down',destination:UNOVA_ROUTE_THIRTEEN,name:'하나 13번도로',event:'tourLacunosaSign',pages:['남쪽 → 하나 13번도로 · 물결마을','고지 초원과 해안 절벽을 지나 물결마을 동쪽으로 이어진다.']});
}

export function paintUnovaRouteThirteen(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';paintTourGround(c,images['town-reference'],px,py,y>62?'coast':'forest');
    if(walk)paths.add(x+','+y);else if(y>62){fill(px,py,16,16,'#4b92a7');fill(px+2+(y%2)*3,py+6,10,1,'#b8dedb');}else{fill(px,py,16,16,'#55744f');fill(px+2,py+3,11,5,'#7f9c69');}
  }
  paintTourPaths(c,images['town-reference'],paths,'forest');
  for(let y=36;y<66;y++){fill(31*16,y*16,5*16,16,'#68716b');if(y%4===0)fill(31*16,y*16+3,45,3,'#b7ad8d');}
  for(const [x,y] of [[9,72],[27,48],[26,59],[12,25]]){fill(x*16+2,y*16+3,12,11,'#665844');fill(x*16+4,y*16+5,8,5,'#e0cf96');}
}
