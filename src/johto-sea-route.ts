import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_40='tour_johto_route_40' as const;
export const JOHTO_ROUTE_41='tour_johto_route_41' as const;
export const JOHTO_WHIRL_EXTERIOR='tour_johto_whirl_islands_exterior' as const;
const COMPAT='tour_pass_olivine_cianwood' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const props=(objects:ObjectInfo[])=>objects.flatMap(o=>o.cells.map(c=>({...c,dialogue:o.event})));

/** Split the walking substitute into numbered sea-route ferry decks and a reversible island exterior. */
export function installJohtoSeaRoute(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  const olivine=world.places.find(p=>p.id==='tour_olivine')!,cianwood=world.places.find(p=>p.id==='tour_cianwood')!,compat=world.maps[COMPAT];
  const olivineExit=world.maps[olivine.id].warps.find(w=>w.to===COMPAT)!,cianwoodExit=world.maps[cianwood.id].warps.find(w=>w.to===COMPAT)!;
  const toOlivine=compat.warps.find(w=>w.to===olivine.id)!,toCianwood=compat.warps.find(w=>w.to===cianwood.id)!;

  const r40=Array.from({length:72},()=>Array<string>(32).fill('#'));
  carve(r40,12,1,8,69);carve(r40,4,10,9,8);carve(r40,19,28,9,8);carve(r40,5,47,8,9);carve(r40,8,62,13,5);
  const objects40:ObjectInfo[]=[
    {name:'40번수로 담청 승선표',event:'tourRoute40OlivineBoard',cells:[{x:10,y:13}],pages:['북쪽 담청항에서 정기 연락선 갑판으로 들어왔다.\n남쪽 41번수로 환승 데크까지 같은 배로 이동한다.']},
    {name:'연락선 동료 대기 그늘',event:'tourRoute40CompanionShade',cells:[{x:24,y:32}],pages:['바닷바람과 직사광선을 피하도록 낮은 차양과 물그릇을 고정했다.\n회복은 담청 또는 진청 포켓몬센터에서 한다.']},
    {name:'41번수로 환승 표지',event:'tourRoute40TransferBoard',cells:[{x:9,y:53}],pages:['남쪽 데크 → 41번수로·소용돌이섬 바깥길·진청시티\n이동 표현은 정기 연락선이며 파도타기를 습득한 것으로 기록하지 않는다.']},
  ];for(const o of objects40)for(const c of o.cells)r40[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_40]={id:JOHTO_ROUTE_40,name:'성도 40번수로 · 연락선',width:32,height:72,background:JOHTO_ROUTE_40,walkable:r40.map(r=>r.join('')),warps:[
    {x:16,y:1,to:olivine.id,spawn:{...toOlivine.spawn},entry:'up',facing:toOlivine.facing},
    {x:16,y:69,to:JOHTO_ROUTE_41,spawn:{x:24,y:4},entry:'down',facing:'down'},
  ],npcs:[{id:'route40Deckhand',name:'40번수로 연락선 선원',sprite:'sailor',x:16,y:39,facing:'up',dialogue:'journeyWalker'}],props:props(objects40),terrain:[]};

  const r41=Array.from({length:104},()=>Array<string>(48).fill('#'));
  carve(r41,20,1,9,101);carve(r41,7,15,14,7);carve(r41,28,30,14,7);carve(r41,8,47,13,8);carve(r41,28,64,13,8);carve(r41,9,82,12,8);carve(r41,1,50,8,5);
  const objects41:ObjectInfo[]=[
    {name:'41번수로 북쪽 연락표',event:'tourRoute41NorthBoard',cells:[{x:15,y:18}],pages:['북쪽은 40번수로 연락선과 담청시티다.\n남쪽은 진청 상륙 데크다.']},
    {name:'소용돌이섬 외부 분기표',event:'tourRoute41WhirlBoard',cells:[{x:34,y:33}],pages:['서쪽 보조선은 소용돌이섬 외부 상륙 데크까지만 운항한다.\n동굴 내부·소용돌이 통과·전설 포켓몬 사건은 열지 않았다.']},
    {name:'진청 상륙 준비대',event:'tourRoute41CianwoodBoard',cells:[{x:15,y:85}],pages:['남쪽은 진청시티 선착장이다.\n북쪽 같은 연락선으로 담청까지 돌아갈 수 있다.']},
  ];for(const o of objects41)for(const c of o.cells)r41[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_41]={id:JOHTO_ROUTE_41,name:'성도 41번수로 · 연락선',width:48,height:104,background:JOHTO_ROUTE_41,walkable:r41.map(r=>r.join('')),warps:[
    {x:24,y:1,to:JOHTO_ROUTE_40,spawn:{x:16,y:67},entry:'up',facing:'up'},
    {x:24,y:102,to:cianwood.id,spawn:{...toCianwood.spawn},entry:'down',facing:toCianwood.facing},
    {x:1,y:52,to:JOHTO_WHIRL_EXTERIOR,spawn:{x:61,y:28},entry:'left',facing:'left'},
  ],npcs:[{id:'route41Deckhand',name:'41번수로 연락선 선원',sprite:'sailor',x:24,y:58,facing:'down',dialogue:'journeyWalker'}],props:props(objects41),terrain:[]};

  const island=Array.from({length:56},()=>Array<string>(64).fill('#'));
  carve(island,45,25,18,7);carve(island,34,16,14,24);carve(island,18,12,18,10);carve(island,17,35,19,9);carve(island,28,21,9,16);
  const islandObjects:ObjectInfo[]=[
    {name:'소용돌이섬 바깥 암반',event:'tourWhirlOuterRock',cells:[{x:24,y:17}],pages:['파도에 둥글게 닳은 바위와 바닷새의 흔적이 보인다.\n외부 생태 관찰만 제공하며 동굴 입구는 닫혀 있다.']},
    {name:'닫힌 동굴 경계표',event:'tourWhirlClosedCave',cells:[{x:31,y:28}],pages:['소용돌이섬 내부는 층별 던전·귀환·조류 이동 계약을 확정한 뒤 연다.\n현재 전설 조우·포획·사건 해결은 발생하지 않는다.']},
    {name:'41번수로 귀환 승선표',event:'tourWhirlReturnBoard',cells:[{x:51,y:24}],pages:['동쪽 상륙 데크에서 41번수로 정기 연락선으로 돌아간다.\n방문 여부는 진청 통행 조건이 아니다.']},
  ];for(const o of islandObjects)for(const c of o.cells)island[c.y][c.x]='#';
  world.maps[JOHTO_WHIRL_EXTERIOR]={id:JOHTO_WHIRL_EXTERIOR,name:'소용돌이섬 외부',width:64,height:56,background:JOHTO_WHIRL_EXTERIOR,walkable:island.map(r=>r.join('')),warps:[{x:62,y:28,to:JOHTO_ROUTE_41,spawn:{x:3,y:52},entry:'right',facing:'right'}],npcs:[{id:'whirlObserver',name:'소용돌이섬 외부 관찰자',sprite:'rancher',x:41,y:28,facing:'left',dialogue:'journeyWalker'}],props:props(islandObjects),terrain:[]};

  for(const [id,name,landmark] of [[JOHTO_ROUTE_40,'성도 40번수로','담청 출항 연락선'],[JOHTO_ROUTE_41,'성도 41번수로','소용돌이섬 분기 연락선'],[JOHTO_WHIRL_EXTERIOR,'소용돌이섬 외부','외부 암반과 닫힌 동굴 경계']] as const){
    world.passages[id]={id,a:olivine,b:cianwood,kind:'coast',bend:id===JOHTO_ROUTE_41?28:16};
    world.passagePlaces[id]={id,name,region:'성도',theme:'coast',concept:'수상 기술을 대신하는 정기 연락선과 안전 상륙 데크',landmark,x:(olivine.x+cianwood.x)/2,y:(olivine.y+cianwood.y)/2};
    world.outdoors[id]={objects:id===JOHTO_ROUTE_40?objects40:id===JOHTO_ROUTE_41?objects41:islandObjects,signs:[]};
  }
  world.spawns[JOHTO_ROUTE_40]={x:16,y:4};world.spawns[JOHTO_ROUTE_41]={x:24,y:4};world.spawns[JOHTO_WHIRL_EXTERIOR]={x:61,y:28};
  olivineExit.to=JOHTO_ROUTE_40;olivineExit.spawn={x:16,y:4};olivineExit.facing='down';
  cianwoodExit.to=JOHTO_ROUTE_41;cianwoodExit.spawn={x:24,y:99};cianwoodExit.facing='up';
}
