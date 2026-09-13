import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_38='tour_johto_route_38' as const;
export const JOHTO_ROUTE_39='tour_johto_route_39' as const;
export const JOHTO_MOOMOO_FARM='tour_johto_moomoo_farm' as const;
const COMPAT='tour_pass_ecruteak_olivine' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const props=(objects:ObjectInfo[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

/** Replace the Ecruteak-Olivine shortcut with Route 38, Route 39 and a free farm branch. */
export function installJohtoOlivineApproach(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  const ecruteak=world.places.find(p=>p.id==='tour_ecruteak')!,olivine=world.places.find(p=>p.id==='tour_olivine')!;
  const ecruteakMap=world.maps[ecruteak.id],olivineMap=world.maps[olivine.id],compat=world.maps[COMPAT];
  const ecruteakExit=ecruteakMap.warps.find(w=>w.to===COMPAT)!,olivineExit=olivineMap.warps.find(w=>w.to===COMPAT)!;
  const toEcruteak=compat.warps.find(w=>w.to===ecruteak.id)!,toOlivine=compat.warps.find(w=>w.to===olivine.id)!;

  const r38=Array.from({length:28},()=>Array<string>(72).fill('#'));
  carve(r38,1,11,70,7);carve(r38,18,4,14,8);carve(r38,46,17,14,7);carve(r38,28,7,7,5);carve(r38,55,7,6,5);
  const objects38:ObjectInfo[]=[
    {name:'인주 서쪽 38번도로 표석',event:'tourRoute38EcruteakStone',cells:[{x:65,y:9}],pages:['동쪽은 인주시티, 서쪽은 39번도로와 담청시티다.\n목초지 샛길과 가운데 본선을 구분해 걷자.']},
    {name:'바람 목초지 관찰 울타리',event:'tourRoute38PastureFence',cells:[{x:24,y:7}],pages:['낮은 울타리 너머 풀의 결이 서쪽 바람을 따라 눕는다.\n조사만으로 포켓몬을 만나거나 도구를 얻지 않는다.']},
    {name:'39번도로 내리막 표지',event:'tourRoute38Route39Stone',cells:[{x:6,y:9}],pages:['서쪽 길 끝에서 39번도로가 남쪽으로 꺾인다.\n튼튼목장 분기를 지나 담청시티까지 내려간다.']},
  ];
  for(const o of objects38)for(const c of o.cells)r38[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_38]={id:JOHTO_ROUTE_38,name:'성도 38번도로',width:72,height:28,background:JOHTO_ROUTE_38,walkable:r38.map(row=>row.join('')),warps:[
    {x:70,y:14,to:ecruteak.id,spawn:{...toEcruteak.spawn},entry:'right',facing:toEcruteak.facing},
    {x:1,y:14,to:JOHTO_ROUTE_39,spawn:{x:16,y:3},entry:'left',facing:'down'},
  ],npcs:[
    {id:'route38Traveler',name:'38번도로 목초지 여행자',sprite:'ace_trainer_f',x:40,y:14,facing:'left',dialogue:'journeyWalker'},
    {id:'route38Trainer',name:'38번도로 목초지 트레이너',sprite:'pokemon_breeder_f',x:28,y:9,facing:'left',dialogue:'tourRoute38Trainer'},
  ],props:props(objects38),terrain:[{kind:'tallGrass',x:19,y:5,w:8,h:3},{kind:'tallGrass',x:48,y:18,w:10,h:4}]};

  const r39=Array.from({length:64},()=>Array<string>(32).fill('#'));
  carve(r39,13,1,7,62);carve(r39,5,12,9,5);carve(r39,5,12,5,17);carve(r39,19,20,12,7);carve(r39,22,26,5,15);carve(r39,7,43,7,5);carve(r39,7,43,5,13);
  const objects39:ObjectInfo[]=[
    {name:'튼튼목장 분기 표지',event:'tourRoute39FarmStone',cells:[{x:24,y:22}],pages:['동쪽은 튼튼목장 생활 구역, 북쪽은 38번도로·인주, 남쪽은 담청시티다.\n목장 방문은 도로 통행 조건이 아니다.']},
    {name:'담청 바다 전망 울타리',event:'tourRoute39SeaFence',cells:[{x:9,y:46}],pages:['남쪽 내리막 너머로 담청시티의 등대와 바다가 보인다.\n이 구간은 육상 39번도로이며 40번수로가 아니다.']},
  ];
  for(const o of objects39)for(const c of o.cells)r39[c.y][c.x]='#';
  world.maps[JOHTO_ROUTE_39]={id:JOHTO_ROUTE_39,name:'성도 39번도로',width:32,height:64,background:JOHTO_ROUTE_39,walkable:r39.map(row=>row.join('')),warps:[
    {x:16,y:1,to:JOHTO_ROUTE_38,spawn:{x:3,y:14},entry:'up',facing:'right'},
    {x:16,y:62,to:olivine.id,spawn:{...toOlivine.spawn},entry:'down',facing:toOlivine.facing},
    {x:30,y:24,to:JOHTO_MOOMOO_FARM,spawn:{x:3,y:16},entry:'right',facing:'right'},
  ],npcs:[
    {id:'route39Rancher',name:'39번도로 목장 주민',sprite:'rancher',x:16,y:34,facing:'up',dialogue:'journeyWalker'},
    {id:'route39Trainer',name:'39번도로 목장 트레이너',sprite:'school_kid_f',x:9,y:25,facing:'right',dialogue:'tourRoute39Trainer'},
  ],props:props(objects39),terrain:[{kind:'tallGrass',x:6,y:13,w:7,h:3},{kind:'tallGrass',x:23,y:28,w:3,h:10},{kind:'tallGrass',x:8,y:49,w:3,h:6}]};

  const farm=Array.from({length:32},()=>Array<string>(40).fill('#'));
  carve(farm,1,13,37,7);carve(farm,7,5,10,9);carve(farm,22,5,12,9);carve(farm,7,19,27,8);
  const farmObjects:ObjectInfo[]=[
    {name:'목장 돌봄 작업대',event:'tourMoomooCareTable',cells:[{x:12,y:9}],pages:['먹이 양과 물그릇, 동료의 걸음 상태를 차례로 기록한다.\n우유·아이템·보상은 아직 지급하지 않는다.']},
    {name:'넓은 방목 울타리',event:'tourMoomooPasture',cells:[{x:28,y:9}],pages:['사람과 포켓몬이 울타리를 따라 천천히 걷는 생활 목초지다.\n현재 야생 조우나 포획 장소가 아니다.']},
    {name:'39번도로 귀환 표지',event:'tourMoomooReturnStone',cells:[{x:5,y:12}],pages:['서쪽 출구는 39번도로로 돌아간다.\n북쪽은 38번도로·인주, 남쪽은 담청시티다.']},
  ];
  for(const o of farmObjects)for(const c of o.cells)farm[c.y][c.x]='#';
  world.maps[JOHTO_MOOMOO_FARM]={id:JOHTO_MOOMOO_FARM,name:'튼튼목장',width:40,height:32,background:JOHTO_MOOMOO_FARM,walkable:farm.map(row=>row.join('')),warps:[
    {x:1,y:16,to:JOHTO_ROUTE_39,spawn:{x:28,y:24},entry:'left',facing:'left'},
  ],npcs:[
    {id:'moomooRancher',name:'튼튼목장 돌봄 주민',sprite:'pokemon_breeder_f',x:19,y:16,facing:'right',dialogue:'journeyWalker'},
    {id:'moomooPokemon',name:'목장 일을 돕는 알통몬',sprite:'field-machop',x:26,y:22,facing:'left',dialogue:'tourMoomooPokemon'},
  ],props:props(farmObjects),terrain:[]};

  for(const [id,name,landmark] of [[JOHTO_ROUTE_38,'성도 38번도로','바람 목초지'],[JOHTO_ROUTE_39,'성도 39번도로','튼튼목장 분기와 담청 내리막'],[JOHTO_MOOMOO_FARM,'튼튼목장','목장 돌봄 작업대와 방목 울타리']] as const){
    world.passages[id]={id,a:ecruteak,b:olivine,kind:'road',bend:id===JOHTO_ROUTE_38?20:14};
    world.passagePlaces[id]={id,name,region:'성도',theme:'village',concept:'인주시티에서 38번도로와 39번도로를 지나 담청시티로 가는 서부 목초지 여행',landmark,x:(ecruteak.x+olivine.x)/2,y:(ecruteak.y+olivine.y)/2};
    world.outdoors[id]={objects:id===JOHTO_ROUTE_38?objects38:id===JOHTO_ROUTE_39?objects39:farmObjects,signs:[]};
  }
  world.spawns[JOHTO_ROUTE_38]={x:68,y:14};world.spawns[JOHTO_ROUTE_39]={x:16,y:3};world.spawns[JOHTO_MOOMOO_FARM]={x:3,y:16};
  ecruteakExit.to=JOHTO_ROUTE_38;ecruteakExit.spawn={x:68,y:14};ecruteakExit.facing='left';
  olivineExit.to=JOHTO_ROUTE_39;olivineExit.spawn={x:16,y:60};olivineExit.facing='up';
}
