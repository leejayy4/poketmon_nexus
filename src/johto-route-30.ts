import type {GameMap,Point} from './types';
import type {Place,TourFeature,TourId} from './explore-world';
import type {TourOutdoors} from './explore-outdoors';
import {JOHTO_CHERRYGROVE} from './johto-cherrygrove';

export const JOHTO_ROUTE_30='tour_johto_route_30' as const;
export const JOHTO_ROUTE_31='tour_johto_route_31' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;features:Record<string,TourFeature[]>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};

/** HGSS Route 30 reconstruction: Cherrygrove return, pond split, two houses, and a safe Route 31 boundary. */
export function installJohtoRoute30(w:World){
  const town=w.maps[JOHTO_CHERRYGROVE],place=w.passagePlaces[JOHTO_CHERRYGROVE];
  if(!town||!place||w.maps[JOHTO_ROUTE_30])return;
  const width=40,height=88,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  open(rows,18,1,5,18);                         // western Route 31 branch
  open(rows,18,15,15,6);open(rows,29,15,5,20); // split and Mr. Pokemon branch
  open(rows,18,18,5,69);                        // safe north-south backbone
  open(rows,9,28,10,6);open(rows,9,31,5,15);   // Apricorn house loop
  open(rows,13,43,10,5);
  open(rows,21,50,11,6);open(rows,28,52,5,16); // east pond grass loop
  open(rows,21,65,12,6);
  open(rows,15,72,8,7);                         // south ledge bypass shape
  const objects:ObjectInfo[]=[
    {name:'31번도로 인계 표석',event:'tourRoute30NorthBoundary',cells:[{x:23,y:5}],pages:['북쪽은 성도31번도로다.\n짧은 숲길에서 서쪽 도라지시티와 동쪽 어둠의동굴 입구가 갈라진다.']},
    {name:'포켓몬 할아버지 집 앞 기록판',event:'tourRoute30MrPokemon',cells:[{x:32,y:18}],pages:['동쪽 숲 끝에는 포켓몬의 생태와 발견물을 연구하는 집이 있다.\n현재 넥서스에서는 이상한 알·도감·오브를 지급하지 않고 관찰 기록만 남긴다.']},
    {name:'규토리 주민 집 앞 나무',event:'tourRoute30ApricornHouse',cells:[{x:12,y:32}],pages:['주민은 이 길의 규토리와 포켓몬이 쉬는 자리를 살핀다.\n규토리상자와 도구 보상은 현재 공통 아이템 계약에 없어 지급하지 않는다.']},
    {name:'30번도로 연못 생태판',event:'tourRoute30PondHabitat',cells:[{x:29,y:61}],pages:['연못 양쪽 선택 긴풀에는 낮에 구구와 애벌레포켓몬이 산다.\n수상 이동·낚시는 제공하지 않으며 가운데 표시 길은 조우 없이 지나갈 수 있다.']},
    {name:'무궁시티 귀환 표석',event:'tourRoute30SouthStone',cells:[{x:16,y:76}],pages:['남쪽은 꽃향기와 바닷바람의 무궁시티다.\n센터·PC·상점에서 동료를 쉬게 하고 다시 이 길로 돌아올 수 있다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  const features:TourFeature[]=[
    {kind:'water',x:23,y:34,w:8,h:14,name:'30번도로 남쪽 연못'},
    {kind:'water',x:23,y:56,w:5,h:9,name:'30번도로 북쪽 연못'},
    {kind:'grove',x:2,y:8,w:14,h:18,name:'서쪽 울창한 숲'},
    {kind:'grove',x:24,y:3,w:13,h:11,name:'북동 연구숲'},
    {kind:'grove',x:3,y:52,w:13,h:17,name:'남서 방풍림'},
  ];
  w.maps[JOHTO_ROUTE_30]={id:JOHTO_ROUTE_30,name:'성도 30번도로',width,height,background:JOHTO_ROUTE_30,walkable:rows.map(row=>row.join('')),warps:[
    {x:20,y:1,to:JOHTO_ROUTE_31,spawn:{x:10,y:25},entry:'up',facing:'up'},
    {x:20,y:86,to:JOHTO_CHERRYGROVE,spawn:{x:22,y:4},entry:'down',facing:'down'},
  ],terrain:[
    {kind:'tallGrass',x:10,y:34,w:3,h:10},{kind:'tallGrass',x:29,y:22,w:3,h:12},
    {kind:'tallGrass',x:29,y:53,w:3,h:8},{kind:'tallGrass',x:22,y:66,w:9,h:4},
  ],npcs:[
    {id:'route30Traveler',name:'30번도로 초보 여행자',sprite:'school_kid_m',x:20,y:58,facing:'down',dialogue:'journeyWalker'},
    {id:'route30Trainer',name:'30번도로 곤충채집가',sprite:'school_kid_m',x:29,y:27,facing:'left',dialogue:'tourRoute30Trainer'},
  ],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  const routePlace:Place={id:JOHTO_ROUTE_30,name:'성도 30번도로',region:'성도',theme:'forest',concept:'무궁시티 북문에서 연못과 두 갈래 숲길을 지나31번도로 경계로 오르는 초원길',landmark:'연못 갈림길과 두 연구 가옥',x:place.x,y:place.y-1};
  w.places.push(routePlace);w.passagePlaces[JOHTO_ROUTE_30]=routePlace;w.spawns[JOHTO_ROUTE_30]={x:20,y:83};w.outdoors[JOHTO_ROUTE_30]={objects,signs:[]};w.features[JOHTO_ROUTE_30]=features;
  town.warps.push({x:22,y:2,to:JOHTO_ROUTE_30,spawn:{x:20,y:84},entry:'up',facing:'up'});

  const r31=Array.from({length:28},()=>Array<string>(56).fill('#'));
  open(r31,1,11,54,7);                         // Violet east-west road
  open(r31,8,14,6,13);                         // Route 30 south approach
  open(r31,15,6,14,6);open(r31,15,6,5,9);     // pond bypass
  open(r31,28,4,16,8);open(r31,40,3,5,9);     // Dark Cave approach
  open(r31,31,17,13,6);open(r31,31,17,5,6);   // optional southern grass loop
  const objects31:ObjectInfo[]=[
    {name:'30번도로 남쪽 표석',event:'tourRoute31SouthStone',cells:[{x:12,y:23}],pages:['남쪽은30번도로의 연못길과 무궁시티다.\n같은 길로 센터·PC·상점까지 돌아갈 수 있다.']},
    {name:'31번도로 작은 연못',event:'tourRoute31Pond',cells:[{x:23,y:8}],pages:['숲 가장자리 작은 연못과 긴풀이 이어진다.\n수상 이동·낚시는 제공하지 않으며 남쪽 우회로는 걸어서 지난다.']},
    {name:'어둠의동굴 서쪽 입구',event:'tourRoute31DarkCaveBoundary',cells:[{x:42,y:4}],pages:['동쪽 암벽은 어둠의동굴 남서 구역 입구다.\n입구 가까운 밝은 돌 탐사 고리를 돌아 같은31번도로로 귀환할 수 있다.']},
    {name:'도라지시티 도착 표석',event:'tourRoute31VioletStone',cells:[{x:5,y:14}],pages:['서쪽 문 너머는 도라지시티다.\n포켓몬센터와 모다피의 탑에서 쉬고 같은31·30번도로로 무궁시티에 돌아갈 수 있다.']},
  ];
  for(const object of objects31)for(const cell of object.cells)r31[cell.y][cell.x]='#';
  const violet=w.maps.tour_violet;
  const violetRows=violet.walkable.map(row=>row.split(''));
  open(violetRows,44,14,4,3);violet.walkable=violetRows.map(row=>row.join(''));
  w.maps[JOHTO_ROUTE_31]={id:JOHTO_ROUTE_31,name:'성도 31번도로',width:56,height:28,background:JOHTO_ROUTE_31,walkable:r31.map(row=>row.join('')),warps:[
    {x:10,y:26,to:JOHTO_ROUTE_30,spawn:{x:20,y:3},entry:'down',facing:'down'},
    {x:1,y:14,to:'tour_violet',spawn:{x:44,y:15},entry:'left',facing:'left'},
  ],terrain:[
    {kind:'tallGrass',x:16,y:7,w:3,h:7},{kind:'tallGrass',x:32,y:18,w:11,h:4},{kind:'tallGrass',x:29,y:5,w:10,h:5},
  ],npcs:[
    {id:'route31Traveler',name:'도라지로 가는 여행자',sprite:'ace_trainer_f',x:25,y:14,facing:'left',dialogue:'journeyWalker'},
    {id:'route31Trainer',name:'31번도로 곤충채집가',sprite:'school_kid_m',x:37,y:20,facing:'up',dialogue:'tourRoute31Trainer'},
  ],props:objects31.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  const place31:Place={id:JOHTO_ROUTE_31,name:'성도 31번도로',region:'성도',theme:'forest',concept:'30번도로 북쪽에서 작은 연못과 어둠의동굴 입구를 지나 도라지시티 동문으로 이어지는 짧은 숲길',landmark:'작은 연못과 어둠의동굴 서쪽 입구',x:place.x-1,y:place.y-2};
  w.places.push(place31);w.passagePlaces[JOHTO_ROUTE_31]=place31;w.spawns[JOHTO_ROUTE_31]={x:10,y:24};w.outdoors[JOHTO_ROUTE_31]={objects:objects31,signs:[]};
  w.features[JOHTO_ROUTE_31]=[
    {kind:'water',x:20,y:4,w:8,h:7,name:'31번도로 작은 연못'},
    {kind:'grove',x:3,y:2,w:13,h:8,name:'도라지 동쪽 숲'},
    {kind:'grove',x:44,y:2,w:10,h:9,name:'어둠의동굴 앞 숲'},
  ];
  violet.warps.push({x:46,y:15,to:JOHTO_ROUTE_31,spawn:{x:3,y:14},entry:'right',facing:'right'});
}
