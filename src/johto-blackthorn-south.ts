import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_45='tour_johto_route_45' as const;
export const JOHTO_ROUTE_46='tour_johto_route_46' as const;
export const JOHTO_ROUTE_29='tour_johto_route_29' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
const block=(rows:string[][],objects:ObjectInfo[])=>{for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';};
const props=(objects:ObjectInfo[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

/** Build the HGSS southbound mountain line and the Route 29 junction. */
export function installJohtoBlackthornSouth(w:World){
  const blackthorn=w.places.find(place=>place.id==='tour_blackthorn');if(!blackthorn)return;
  const city=w.maps[blackthorn.id],outside=w.outdoors[blackthorn.id];if(!city||!outside)return;

  const r45=Array.from({length:96},()=>Array<string>(40).fill('#'));
  open(r45,17,1,7,32);open(r45,17,36,7,59);
  open(r45,21,28,12,5);open(r45,29,29,5,12);open(r45,21,37,12,5); // climb-back switchback
  open(r45,6,15,12,5);open(r45,6,17,5,14);open(r45,9,27,9,4);
  open(r45,23,51,11,5);open(r45,30,53,5,15);open(r45,23,64,11,5);
  open(r45,6,74,12,5);open(r45,6,76,5,13);open(r45,9,85,9,4);
  const objects45:ObjectInfo[]=[
    {name:'검은먹 남쪽 절벽 표석',event:'tourRoute45NorthStone',cells:[{x:25,y:8}],pages:['북쪽은 검은먹시티, 남쪽은45번도로 내리막과46번도로다.\n절벽 턱을 내려가도 동쪽 오르막길로 되돌아갈 수 있다.']},
    {name:'45번도로 낙차 턱',event:'tourRoute45Ledge',cells:[{x:16,y:32}],pages:['서쪽 턱은 아래쪽으로만 내려간다.\n북쪽 귀환은 동쪽 절벽의 굽은 오르막길을 이용한다.']},
    {name:'45번도로 산악 생태판',event:'tourRoute45Habitat',cells:[{x:11,y:26}],pages:['서쪽 선택 풀밭에는 꼬마돌이 산다.\n가운데 본선과 동쪽 귀환 오르막에서는 야생 포켓몬을 만나지 않는다.']},
    {name:'산기슭 샘 관찰대',event:'tourRoute45Spring',cells:[{x:32,y:57}],pages:['절벽 틈의 물이 남쪽 풀길로 흐른다.\n현재 수상 이동·낚시·도구 획득은 제공하지 않는다.']},
    {name:'46번도로 인계 표석',event:'tourRoute45SouthStone',cells:[{x:12,y:86}],pages:['남쪽에서46번도로가 시작되고29번도로 합류점으로 내려간다.\n세 도로는 서로 다른 MapId와 출구로 구분된다.']},
  ];block(r45,objects45);
  w.maps[JOHTO_ROUTE_45]={id:JOHTO_ROUTE_45,name:'성도 45번도로',width:40,height:96,background:JOHTO_ROUTE_45,walkable:r45.map(row=>row.join('')),warps:[
    {x:20,y:1,to:blackthorn.id,spawn:{x:16,y:53},entry:'up',facing:'up'},
    {x:20,y:32,to:JOHTO_ROUTE_45,spawn:{x:20,y:38},entry:'down',facing:'down'},
    {x:20,y:94,to:JOHTO_ROUTE_46,spawn:{x:18,y:3},entry:'down',facing:'down'},
  ],terrain:[{kind:'tallGrass',x:7,y:18,w:3,h:11},{kind:'tallGrass',x:30,y:54,w:4,h:13},{kind:'tallGrass',x:7,y:77,w:3,h:10}],npcs:[
    {id:'route45Traveler',name:'45번도로 절벽 여행자',sprite:'rancher',x:20,y:47,facing:'down',dialogue:'journeyWalker'},
    {id:'route45Trainer',name:'45번도로 산악 트레이너',sprite:'ace_trainer_m',x:26,y:66,facing:'left',dialogue:'tourRoute45Trainer'},
  ],props:props(objects45)};

  const r46=Array.from({length:72},()=>Array<string>(36).fill('#'));
  open(r46,15,1,7,23);open(r46,15,28,7,43);
  open(r46,19,19,11,5);open(r46,26,20,5,13);open(r46,19,28,11,5); // second return climb
  open(r46,5,38,11,5);open(r46,5,40,5,13);open(r46,8,49,8,4);
  open(r46,21,54,10,5);open(r46,27,56,4,10);open(r46,20,63,11,4);
  const objects46:ObjectInfo[]=[
    {name:'45번도로 귀환 표석',event:'tourRoute46NorthStone',cells:[{x:14,y:7}],pages:['북쪽은45번도로와 검은먹시티다.\n남쪽은46번도로를 지나29번도로 합류점으로 이어진다.']},
    {name:'46번도로 낮은 턱',event:'tourRoute46Ledge',cells:[{x:14,y:23}],pages:['가운데 턱은 남쪽으로만 내려간다.\n북쪽으로 돌아가려면 동쪽 낮은 오르막을 돈다.']},
    {name:'46번도로 산기슭 생태판',event:'tourRoute46Habitat',cells:[{x:10,y:47}],pages:['선택 풀밭에는 꼬렛·깨비참·꼬마돌이 산다.\n표시된 가운데 길은 조우 없는29번도로 합류 본선이다.']},
    {name:'산허리 바람쉼터',event:'tourRoute46Rest',cells:[{x:8,y:47}],pages:['짧은 내리막 사이에서 사람과 포켓몬이 바람을 피한다.\n회복 효과나 도구 지급은 없다.']},
    {name:'29번도로 합류 표석',event:'tourRoute46SouthStone',cells:[{x:25,y:64}],pages:['남쪽 출구는29번도로 합류점이다.\n합류점에서 서쪽은 무궁시티 센터와 상점, 동쪽 연두마을 방향은 미개통이다.']},
  ];block(r46,objects46);
  w.maps[JOHTO_ROUTE_46]={id:JOHTO_ROUTE_46,name:'성도 46번도로',width:36,height:72,background:JOHTO_ROUTE_46,walkable:r46.map(row=>row.join('')),warps:[
    {x:18,y:1,to:JOHTO_ROUTE_45,spawn:{x:20,y:92},entry:'up',facing:'up'},
    {x:18,y:23,to:JOHTO_ROUTE_46,spawn:{x:18,y:30},entry:'down',facing:'down'},
    {x:18,y:70,to:JOHTO_ROUTE_29,spawn:{x:68,y:4},entry:'down',facing:'down'},
  ],terrain:[{kind:'tallGrass',x:6,y:41,w:3,h:6},{kind:'tallGrass',x:6,y:47,w:2,h:1},{kind:'tallGrass',x:6,y:48,w:3,h:3},{kind:'tallGrass',x:27,y:57,w:3,h:8}],npcs:[
    {id:'route46Traveler',name:'46번도로 귀환 여행자',sprite:'ace_trainer_f',x:18,y:36,facing:'down',dialogue:'journeyWalker'},
    {id:'route46Trainer',name:'46번도로 산기슭 트레이너',sprite:'school_kid_m',x:23,y:58,facing:'right',dialogue:'johtoRoute46Practice'},
  ],props:props(objects46)};

  const r29=Array.from({length:32},()=>Array<string>(80).fill('#'));
  open(r29,1,12,78,7);open(r29,66,1,6,15);
  open(r29,12,5,14,8);open(r29,12,7,5,9);open(r29,35,19,14,6);open(r29,44,17,5,8);
  // The optional habitat now has an eastern descent back to the safe main road.
  // Add walkable cells only, preserving every previously valid saved position.
  open(r29,25,10,5,3);
  const objects29:ObjectInfo[]=[
    {name:'46번도로 합류 안내',event:'tourRoute29Junction',cells:[{x:65,y:9}],pages:['북쪽은46번도로·45번도로·검은먹시티다.\n서쪽은 무궁시티, 동쪽은 연두마을 방향이다.']},
    {name:'29번도로 풀언덕',event:'tourRoute29GrassHill',cells:[{x:19,y:7}],pages:['북쪽 긴풀에는 구구·꼬렛이 산다. 서쪽 샛길로 올라와 풀밭을 살펴보고 동쪽 낮은 길로 본선에 내려갈 수 있다.\n풀밭을 피하려면 아래쪽 동서 흙길을 이용하자. 서쪽 무궁시티에서 회복·보급하고 남쪽 쉼터에서 기술을 준비할 수 있다.']},
    {name:'무궁시티 방향 표석',event:'tourRoute29TownBoundary',cells:[{x:5,y:15}],pages:['서쪽은 무궁시티다. 무궁시티 북쪽 길은30번도로 방향으로 이어진다.\n동쪽은29번도로를 따라 연두마을로 향하지만 연두마을 외부는 아직 열리지 않았다.']},
    {name:'연두마을 예정 경계',event:'tourRoute29NewBarkBoundary',cells:[{x:76,y:15}],pages:['동쪽 연두마을 방향은 아직 열리지 않았다.\n서쪽 무궁시티나 북쪽46번도로로 돌아가자.']},
    {name:'산길 도착 쉼터',event:'tourRoute29Rest',cells:[{x:45,y:22}],pages:['긴 산길을 내려온 동료가 풀바람을 맞으며 쉬는 자리다.\n조사만으로 회복·보상·통행 조건은 생기지 않는다.']},
  ];block(r29,objects29);
  w.maps[JOHTO_ROUTE_29]={id:JOHTO_ROUTE_29,name:'성도 29번도로 · 무궁-46 합류 구간',width:80,height:32,background:JOHTO_ROUTE_29,walkable:r29.map(row=>row.join('')),warps:[
    {x:68,y:1,to:JOHTO_ROUTE_46,spawn:{x:18,y:68},entry:'up',facing:'up'},
    {x:1,y:15,to:'tour_cherrygrove',spawn:{x:41,y:20},entry:'left',facing:'left'},
  ],terrain:[{kind:'tallGrass',x:17,y:5,w:8,h:2},{kind:'tallGrass',x:20,y:7,w:5,h:1},{kind:'tallGrass',x:17,y:10,w:8,h:2}],npcs:[{id:'route29Traveler',name:'29번도로 산길 여행자',sprite:'school_kid_m',x:55,y:15,facing:'left',dialogue:'journeyWalker'}],props:props(objects29)};

  for(const [id,name,theme,concept,landmark,y] of [
    [JOHTO_ROUTE_45,'성도 45번도로','cave','검은먹시티 남문에서 절벽 턱과 귀환 오르막을 지나46번도로로 내려가는 산악길','절벽 턱과 산기슭 샘',blackthorn.y+1],
    [JOHTO_ROUTE_46,'성도 46번도로','forest','45번도로 아래에서 낮은 턱과 바람쉼터를 지나29번도로에 합류하는 산길','낮은 턱과 바람쉼터',blackthorn.y+2],
    [JOHTO_ROUTE_29,'성도 29번도로 · 무궁-46 합류 구간','forest','무궁시티 동문에서46번도로 남쪽 합류점과 연두마을 예정 경계로 이어지는29번도로','풀언덕과46번도로 합류점',blackthorn.y+3],
  ] as const){w.passagePlaces[id]={id,name,region:'성도',theme,concept,landmark,x:blackthorn.x,y};w.outdoors[id]={objects:id===JOHTO_ROUTE_45?objects45:id===JOHTO_ROUTE_46?objects46:objects29,signs:[]};}
  w.spawns[JOHTO_ROUTE_45]={x:20,y:3};w.spawns[JOHTO_ROUTE_46]={x:18,y:3};w.spawns[JOHTO_ROUTE_29]={x:68,y:4};

  for(let y=51;y<=54;y++){const row=city.walkable[y];city.walkable[y]=row.slice(0,16)+'.'+row.slice(17);}
  city.warps.push({x:16,y:54,to:JOHTO_ROUTE_45,spawn:{x:20,y:3},entry:'down',facing:'down'});
  outside.signs.push({x:19,y:50,direction:'down',destination:JOHTO_ROUTE_45,name:'성도 45번도로',event:'tourBlackthornRoute45Sign',pages:['남쪽 ↓ 성도45번도로 → 46번도로 → 29번도로 동쪽 합류부','절벽 턱은 남쪽으로 내려가고 별도 오르막길로 검은먹시티에 돌아온다.']});
}
