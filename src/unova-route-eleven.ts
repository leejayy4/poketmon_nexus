import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const UNOVA_ROUTE_ELEVEN='tour_unova_route_11' as const;
export const UNOVA_ROUTE_ELEVEN_GRASS=[
  {kind:'tallGrass' as const,x:15,y:6,w:5,h:2},
  {kind:'tallGrass' as const,x:48,y:18,w:4,h:3},
];
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const openTile=(map:GameMap,x:number,y:number)=>{const row=map.walkable[y];map.walkable[y]=row.slice(0,x)+'.'+row.slice(x+1);};

export function installUnovaRouteEleven(w:World){
  const bridge=w.places.find(p=>p.id==='tour_village_bridge'),city=w.places.find(p=>p.id==='tour_opelucid');
  if(!bridge||!city)return;
  const bridgeMap=w.maps[bridge.id],bridgeOutside=w.outdoors[bridge.id],cityMap=w.maps[city.id],cityOutside=w.outdoors[city.id];
  if(!bridgeMap||!bridgeOutside||!cityMap||!cityOutside)return;
  const rows=Array.from({length:28},()=>Array<string>(64).fill('#'));
  open(rows,1,11,62,6);                 // east-west safe road
  open(rows,7,5,16,6);open(rows,7,5,5,9);open(rows,18,8,5,6); // water overlook loop
  open(rows,36,17,17,6);open(rows,36,14,5,9);open(rows,48,14,5,9); // rocky rise loop
  const objects=[
    {name:'빌리지브리지 물길 전망',event:'tourRouteElevenWaterfall',cells:[{x:12,y:7}],pages:['동쪽 다리 아래 물길이 바위 단을 따라 낮아지는 모습을 보는 자리다.','수상이동이나 폭포오르기 기능은 없으며 남쪽 길로 돌아가 본선에 합류한다.']},
    {name:'바위 단차 관찰길',event:'tourRouteElevenRockRise',cells:[{x:44,y:20}],pages:['쌍용시티 쪽으로 갈수록 회색 바위와 길의 높이가 조금씩 달라진다.','관찰길은 양쪽에서 본선으로 합류하며 아이템이나 필수 통행 조건은 없다.']},
    {name:'쌍용시티 문앞 쉼터',event:'tourRouteElevenCityRest',cells:[{x:56,y:9}],pages:['긴 다리를 건넌 사람과 포켓몬이 석조 도시에 들어가기 전 쉬는 자리다.','회복 시설은 아니며 실제 회복은 가까운 도시 포켓몬센터에서 받는다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  w.maps[UNOVA_ROUTE_ELEVEN]={id:UNOVA_ROUTE_ELEVEN,name:'하나 11번도로',width:64,height:28,background:UNOVA_ROUTE_ELEVEN,walkable:rows.map(row=>row.join('')),warps:[
    {x:62,y:13,to:bridge.id,spawn:{x:3,y:24},entry:'right',facing:'right'},
    {x:1,y:13,to:city.id,spawn:{x:cityMap.width-3,y:12},entry:'left',facing:'left'},
  ],terrain:UNOVA_ROUTE_ELEVEN_GRASS,npcs:[
    {id:'routeElevenKeeper',name:'11번도로 길지기',sprite:'rancher',x:29,y:14,facing:'right',dialogue:'tourRouteElevenKeeper'},
    {id:'routeElevenTrainer',name:'11번도로 생태 트레이너',sprite:'rancher',x:21,y:9,facing:'left',dialogue:'tourRouteElevenTrainer'},
  ],props:[
    {x:58,y:10,dialogue:'tourRouteElevenSign'},{x:5,y:10,dialogue:'tourRouteElevenSign'},
    ...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event}))),
  ]};
  w.passagePlaces[UNOVA_ROUTE_ELEVEN]={id:UNOVA_ROUTE_ELEVEN,name:'하나 11번도로',region:'하나',theme:'forest',concept:'빌리지브리지의 물길에서 바위 단차를 지나 쌍용시티 석조 문으로 오르는 길',landmark:'물길 전망과 바위 단차',x:city.x-1,y:city.y};
  w.spawns[UNOVA_ROUTE_ELEVEN]={x:60,y:13};
  w.outdoors[UNOVA_ROUTE_ELEVEN]={objects,signs:[
    {x:58,y:10,direction:'right',destination:bridge.id,name:'빌리지브리지',event:'tourRouteElevenSign',pages:['동쪽 → 빌리지브리지','긴 다리와 12번도로·보배마을 방향이다.']},
    {x:5,y:10,direction:'left',destination:city.id,name:'쌍용시티',event:'tourRouteElevenSign',pages:['서쪽 → 쌍용시티','석조 문과 용의 역사관이 있는 도시다.']},
  ]};

  for(let x=1;x<=8;x++)openTile(bridgeMap,x,24);
  bridgeMap.warps.push({x:1,y:24,to:UNOVA_ROUTE_ELEVEN,spawn:{x:60,y:13},entry:'left',facing:'left'});
  const boundary=bridgeOutside.objects.find(object=>object.name==='11번도로 방향 표지');
  if(boundary)boundary.pages=['서쪽은 하나 11번도로와 쌍용시티 방향이다.','물길 전망과 바위 단차를 지나 쌍용시티까지 왕복할 수 있다.'];
  bridgeOutside.signs.push({x:7,y:40,direction:'left',destination:UNOVA_ROUTE_ELEVEN,name:'하나 11번도로',event:'tourVillageBridgeSign',pages:['서쪽 → 하나 11번도로 · 쌍용시티','물길 전망과 바위 단차를 지나는 도보다.']});

  for(let x=Math.max(1,cityMap.width-3);x<=cityMap.width-2;x++)openTile(cityMap,x,12);
  cityMap.warps.push({x:cityMap.width-2,y:12,to:UNOVA_ROUTE_ELEVEN,spawn:{x:3,y:13},entry:'right',facing:'right'});
  cityOutside.signs.push({x:cityMap.width-5,y:10,direction:'right',destination:UNOVA_ROUTE_ELEVEN,name:'하나 11번도로',event:'tourOpelucidSign',pages:['동쪽 → 하나 11번도로','빌리지브리지·12번도로·보배마을 방향이다.']});
}

export function paintUnovaRouteEleven(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    paintTourGround(c,images['town-reference'],px,py,'forest');
    if(walk)paths.add(`${x},${y}`);else{fill(px,py,16,16,'#617852');fill(px+2,py+3,12,7,(x+y)%3?'#8b9670':'#9fa17b');}
  }
  paintTourPaths(c,images['town-reference'],paths,'forest');
  for(const [x,y,color]of [[12,7,'#79a9b4'],[44,20,'#837b68'],[56,9,'#756f67']] as const){fill(x*16+2,y*16+2,12,12,color);fill(x*16+5,y*16+5,6,4,'#d3c99a');}
}
