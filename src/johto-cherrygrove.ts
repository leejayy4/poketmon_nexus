import type {GameMap,Point} from './types';
import type {Place,TourBuilding,TourFeature,TourId} from './explore-world';
import type {TourOutdoors} from './explore-outdoors';
import type {Furnishing,RoomStyle,TourInterior} from './explore-interiors';
import {JOHTO_ROUTE_29} from './johto-blackthorn-south';

export const JOHTO_CHERRYGROVE='tour_cherrygrove' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<string,Point>;outdoors:Record<string,TourOutdoors>;rooms:Record<string,TourInterior>;roomParents:Record<string,Place>;buildings:Record<string,TourBuilding[]>;features:Record<string,TourFeature[]>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';};
const furnishing=(kind:Furnishing['kind'],name:string,text:string,x:number,y:number,w:number,h:number,event:string):Furnishing=>({kind,name,pages:[text],x,y,w,h,event});

function installRoom(w:World,id:TourId,title:string,style:RoomStyle,width:number,height:number,outsideDoor:Point,objects:Furnishing[],service:'center'|'mart'|'home'){
  const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
  const props:NonNullable<GameMap['props']>=[];
  const reception=service==='center'?{x:5,y:5,w:6,h:1}:service==='mart'?{x:4,y:5,w:5,h:1}:undefined;
  if(reception)for(let y=reception.y;y<reception.y+reception.h;y++)for(let x=reception.x;x<reception.x+reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:service==='mart'?'martClerk':'tourHost'});}
  for(const object of objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){rows[y][x]='#';props.push({x,y,dialogue:object.event});}
  const entrance={x:Math.floor(width/2),y:height-1};rows[entrance.y][entrance.x]='.';rows[height-2][entrance.x]='.';
  const host=service==='home'?{x:7,y:8}:{x:8,y:4};
  w.rooms[id]={style,title,objects,host:service==='home'?{x:7,y:8}:{x:8,y:4},...(reception?{reception}:{}),greeting:service==='center'?['무궁시티 포켓몬센터입니다.','동료를 회복하고29번도로와30번도로 방향을 확인하세요.']:service==='mart'?['무궁시티 프렌들리숍입니다.','현재 판매품은 기존 여행 물품을 따릅니다.']:['무궁시티 주민의 집입니다.','사람과 포켓몬이 바닷바람 속에서 함께 지내는 공간입니다.']};
  w.maps[id]={id,name:`무궁시티 · ${title}`,width,height,background:id,walkable:rows.map(row=>row.join('')),warps:[{...entrance,to:JOHTO_CHERRYGROVE,spawn:{x:outsideDoor.x,y:outsideDoor.y+1},entry:'down',facing:'down'}],npcs:[{id:'tourHost',name:service==='center'?'간호사':service==='mart'?'상점 직원':'무궁시티 주민',sprite:service==='center'?'pokecenter_nurse':service==='mart'?'worker':'elder_f',...host,facing:'down',dialogue:service==='mart'?'martClerk':'tourHost'}],props};
  w.spawns[id]={x:entrance.x,y:height-3};w.roomParents[id]=w.passagePlaces[JOHTO_CHERRYGROVE];
}

/** Install Cherrygrove as the west end of Route 29 and preserve Route 30 as the next boundary. */
export function installJohtoCherrygrove(w:World){
  if(w.maps[JOHTO_CHERRYGROVE])return;
  const anchor=w.places.find(place=>place.id==='tour_blackthorn');if(!anchor)return;
  const rows=Array.from({length:40},()=>Array<string>(44).fill('#'));
  open(rows,1,17,42,7);                         // Route 29 east-west street
  open(rows,19,2,7,20);                         // Route 30 north approach
  open(rows,5,8,12,10);open(rows,28,7,11,11);  // residential blocks
  open(rows,5,23,34,9);open(rows,10,31,23,5);  // coastal promenade
  open(rows,6,31,4,3);                         // wrap the west lane around the flower house
  const objects:ObjectInfo[]=[
    {name:'공동 화단 바람막이',event:'tourCherrygroveWindbreak',cells:[{x:21,y:27}],pages:['꽃길 주민과 동료가 함께 돌보는 화단이다.']},
    {name:'무궁시티 안내판',event:'tourCherrygroveWelcome',cells:[{x:35,y:19}],pages:['무궁시티 ― 꽃향기와 바닷바람이 만나는 작은 도시.\n동쪽 출구는 성도29번도로와46번도로 합류점으로 이어진다.']},
    {name:'30번도로 북문 표석',event:'tourCherrygroveRoute30Boundary',cells:[{x:22,y:3}],pages:['북쪽은 성도30번도로 방향이다.\n북쪽 길은 정비 중입니다. 동쪽29번도로를 이용해 주세요.']},
    {name:'서쪽 바닷길 표석',event:'tourCherrygroveWestBoundary',cells:[{x:6,y:20}],pages:['서쪽 해안 너머 길은 아직 이동 구간으로 열리지 않았다.\n현재 왕복할 수 있는 육로는 동쪽29번도로다.']},
    {name:'바닷바람 관찰대',event:'tourCherrygroveCoast',cells:[{x:7,y:23}],pages:['낮은 방파제 너머로 성도 서쪽 바다가 펼쳐진다.\n돌담 안쪽에서 동료와 파도 소리를 들어 보자.']},
  ];
  const buildings:TourBuilding[]=[
    {kind:'center',x:7,y:8,w:7,h:4,door:{x:10,y:11},room:'tour_cherrygrove_center'},
    {kind:'landmark',x:29,y:8,w:7,h:4,door:{x:32,y:11},room:'tour_cherrygrove_mart'},
    {kind:'house',x:8,y:25,w:6,h:4,door:{x:10,y:28},room:'tour_cherrygrove_home1'},
    {kind:'house',x:29,y:25,w:6,h:4,door:{x:31,y:28},room:'tour_cherrygrove_home2'},
  ];
  const features:TourFeature[]=[
    {kind:'water',x:0,y:14,w:4,h:26,name:'무궁 서쪽 바다'},
    {kind:'water',x:4,y:24,w:2,h:16,name:'굽은 해안'},
    {kind:'water',x:6,y:35,w:8,h:5,name:'남서쪽 만'},
    {kind:'garden',x:15,y:8,w:2,h:6,name:'센터 꽃울타리'},
    {kind:'garden',x:28,y:13,w:3,h:2,name:'상점 앞 서쪽 꽃밭'},
    {kind:'garden',x:33,y:13,w:4,h:2,name:'상점 앞 동쪽 꽃밭'},
    {kind:'garden',x:18,y:25,w:8,h:3,name:'주민 공동 화단'},
    {kind:'garden',x:35,y:25,w:3,h:5,name:'해풍 화단'},
    {kind:'grove',x:28,y:3,w:10,h:3,name:'북쪽 방풍림'},
    {kind:'grove',x:15,y:35,w:22,h:3,name:'남쪽 생활숲'},
  ];
  for(const building of buildings)for(let y=building.y;y<building.y+building.h;y++)for(let x=building.x;x<building.x+building.w;x++)rows[y][x]='#';
  for(const feature of features)for(let y=feature.y;y<feature.y+feature.h;y++)for(let x=feature.x;x<feature.x+feature.w;x++)rows[y][x]='#';
  for(const building of buildings)rows[building.door.y][building.door.x]='.';
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  w.maps[JOHTO_CHERRYGROVE]={id:JOHTO_CHERRYGROVE,name:'무궁시티',width:44,height:40,background:JOHTO_CHERRYGROVE,walkable:rows.map(row=>row.join('')),warps:[
    {x:42,y:20,to:JOHTO_ROUTE_29,spawn:{x:3,y:15},entry:'right',facing:'right'},
    ...buildings.map(building=>({...building.door,to:building.room!,spawn:{x:8,y:15},entry:'up' as const,facing:'up' as const})),
  ],terrain:[],npcs:[
    {id:'cherrygroveGuide',name:'무궁시티 길잡이',sprite:'school_kid_f',x:32,y:21,facing:'left',dialogue:'journeyWalker'},
    {id:'cherrygroveWalker',name:'해안 산책 주민',sprite:'elder_f',x:15,y:29,facing:'right',dialogue:'cherrygroveCoastalResident'},
  ],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  const place:Place={id:JOHTO_CHERRYGROVE,name:'무궁시티',region:'성도',theme:'water',concept:'29번도로 서쪽 끝과30번도로 남쪽 경계가 만나는 해안 도시',landmark:'바닷바람 관찰대',x:anchor.x-2,y:anchor.y+3};
  w.places.push(place);w.passagePlaces[JOHTO_CHERRYGROVE]=place;
  w.outdoors[JOHTO_CHERRYGROVE]={objects,signs:[]};w.spawns[JOHTO_CHERRYGROVE]={x:40,y:20};w.buildings[JOHTO_CHERRYGROVE]=buildings;
  w.features[JOHTO_CHERRYGROVE]=features;
  installRoom(w,'tour_cherrygrove_center','포켓몬센터','center',28,22,{x:10,y:11},[
    furnishing('healer','포켓몬 회복 장치','간호사에게 동료의 회복을 부탁한다.',3,8,2,2,'tourHost'),
    furnishing('console','포켓몬 보관 PC','동료를 맡기거나 데려와 다음 여행의 파티를 준비한다.',11,8,2,2,'tourExhibit1'),
    furnishing('bench','29번도로 동료 휴게석','29번도로를 걸어온 동료가 꽃향기와 바닷바람을 맞으며 쉬는 자리다.\n실제 회복은 간호사에게 부탁한다.',18,7,6,2,'cherrygroveCenterBench'),
    furnishing('chart','무궁 여행 안내도','동쪽29번도로와 북쪽30번도로 방향을 구분한다.\n현재 실제 왕복 출구는29번도로뿐이다.',18,13,6,2,'cherrygroveCenterChart'),
  ],'center');
  installRoom(w,'tour_cherrygrove_mart','프렌들리숍','shop',24,20,{x:32,y:11},[
    furnishing('shelf','초행길 여행용품대','29번도로를 걷는 여행자를 위한 물통과 지도 견본이다.\n물품 구매는 앞쪽 점원에게 부탁하자.',15,8,6,2,'tourCherrygroveMartTravelShelf'),
    furnishing('chart','도로 준비표','동쪽29번도로의 풀길과46번도로 합류 방향을 표시했다.',15,13,6,2,'tourCherrygroveMartRouteChart'),
  ],'mart');
  installRoom(w,'tour_cherrygrove_home1','꽃길 주민의 집','garden',24,18,{x:10,y:28},[
    furnishing('plants','해풍 꽃 화분','짠 바람에도 견디는 꽃을 주민과 포켓몬이 함께 돌본다.',15,5,6,3,'cherrygroveHomeFlowers'),
    furnishing('bench','동료 낮잠 자리','29번도로 산책을 마친 동료를 위한 낮은 방석과 물그릇이다.\n회복 효과는 없다.',5,13,7,1,'cherrygroveHomeRest'),
  ],'home');
  installRoom(w,'tour_cherrygrove_home2','해안 주민의 집','gallery',24,18,{x:31,y:28},[
    furnishing('chart','바닷바람 기록','날마다 바람 방향과 해안 물결을 주민이 기록했다.',15,5,6,2,'cherrygroveHomeWindLog'),
    furnishing('shelf','29번도로 생활책','무궁과 연두 사이 길에서 사람과 포켓몬이 쉬는 자리를 그린 책이다.\n연두마을이 열렸다는 뜻은 아니다.',15,10,6,2,'cherrygroveHomeRouteBook'),
  ],'home');
  for(const warp of w.maps[JOHTO_CHERRYGROVE].warps){const spawn=w.spawns[warp.to];if(spawn&&w.roomParents[warp.to]?.id===JOHTO_CHERRYGROVE)warp.spawn={...spawn};}
}
