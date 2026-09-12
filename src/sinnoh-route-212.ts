import type { GameMap } from './types';
import type { Passage } from './journey-world';
import type { Place,TourFeature,TourId } from './explore-world';

export const SINNOH_ROUTE_212_NORTH='tour_sinnoh_route_212_north' as TourId;
export const SINNOH_ROUTE_212_SOUTH='tour_sinnoh_route_212_south' as TourId;

const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';
};

/** Replace the normal Hearthome-Pastoria journey with separate Route 212 halves. */
export function installSinnohRoute212(args:{
  places:Place[];
  maps:Record<TourId,GameMap>;
  passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;
  spawns:Record<TourId,{x:number;y:number}>;
  features:Record<string,TourFeature[]>;
}){
  const {places,maps,passages,passagePlaces,spawns,features}=args;
  const hearthome=places.find(p=>p.id==='tour_hearthome')!;
  const pastoria=places.find(p=>p.id==='tour_pastoria')!;
  const legacyId='tour_pass_hearthome_pastoria' as TourId;
  const legacyNorth=maps[legacyId].warps.find(w=>w.to===hearthome.id)!;
  const legacySouth=maps[legacyId].warps.find(w=>w.to===pastoria.id)!;
  const fromHearthome=maps[hearthome.id].warps.find(w=>w.to===legacyId)!;
  const fromPastoria=maps[pastoria.id].warps.find(w=>w.to===legacyId)!;

  const northRows=Array.from({length:72},()=>Array<string>(32).fill('#'));
  carve(northRows,13,1,5,10);carve(northRows,10,8,8,14);carve(northRows,8,19,7,13);
  carve(northRows,8,29,15,6);carve(northRows,18,32,6,13);carve(northRows,15,42,9,12);
  carve(northRows,12,51,7,12);carve(northRows,14,60,5,11);
  carve(northRows,22,13,8,4);carve(northRows,27,14,3,12);carve(northRows,22,23,8,4);
  const northFeatures:TourFeature[]=[
    {kind:'garden',x:2,y:7,w:9,h:13,name:'212번도로 저택 정원길',description:'연고 남쪽의 다듬어진 나무와 화단을 지나는 길이다.'},
    {kind:'statue',x:23,y:5,w:5,h:5,name:'포켓몬저택 앞 표식',description:'저택 부지 방향을 알리는 정원 석상이다. 건물 내부는 아직 열리지 않았다.'},
    {kind:'water',x:2,y:42,w:8,h:13,name:'남부 습지 전이 연못',description:'정원길이 비 내리는 남부 습지로 바뀌기 시작하는 물가다.'},
  ];
  maps[SINNOH_ROUTE_212_NORTH]={id:SINNOH_ROUTE_212_NORTH,name:'신오 212번도로 · 북부 정원길',width:32,height:72,background:SINNOH_ROUTE_212_NORTH,
    walkable:northRows.map(r=>r.join('')),terrain:[],
    warps:[
      {x:15,y:1,to:hearthome.id,spawn:{...legacyNorth.spawn},entry:'up',facing:'up'},
      {x:16,y:70,to:SINNOH_ROUTE_212_SOUTH,spawn:{x:17,y:2},entry:'down',facing:'down'},
    ],
    npcs:[
      {id:'route212Gardener',name:'212번도로 정원사',sprite:'pokemon_breeder_f',x:27,y:20,facing:'left',dialogue:'route212Gardener'},
      {id:'route212NorthTraveler',name:'정원길 여행자',sprite:'school_kid_f',x:20,y:37,facing:'down',dialogue:'route212NorthTraveler'},
    ],
    props:[{x:19,y:6,dialogue:'route212NorthSign'},{x:24,y:12,dialogue:'route212MansionSign'},{x:11,y:64,dialogue:'route212NorthSign'}],
  };
  features[SINNOH_ROUTE_212_NORTH]=northFeatures;spawns[SINNOH_ROUTE_212_NORTH]={x:15,y:3};

  const southRows=Array.from({length:88},()=>Array<string>(36).fill('#'));
  carve(southRows,15,1,6,11);carve(southRows,11,9,10,14);carve(southRows,9,20,7,14);
  carve(southRows,9,31,17,6);carve(southRows,20,34,7,15);carve(southRows,17,46,10,9);
  carve(southRows,13,52,8,14);carve(southRows,12,63,15,6);carve(southRows,21,66,6,13);
  carve(southRows,17,76,10,11);carve(southRows,3,42,8,4);carve(southRows,3,39,4,9);
  carve(southRows,27,57,6,4);carve(southRows,30,57,3,12);
  const southFeatures:TourFeature[]=[
    {kind:'water',x:2,y:10,w:7,h:16,name:'212번도로 빗물못',description:'계속 내리는 비가 고인 북쪽 웅덩이다.'},
    {kind:'water',x:27,y:24,w:7,h:19,name:'212번도로 남부 늪',description:'갈대와 진흙 사이로 물길이 퍼지는 습지다.'},
    {kind:'grove',x:2,y:58,w:8,h:15,name:'들판 북쪽 갈대숲',description:'들판시티가 가까워지며 길가를 채우는 습지 식생이다.'},
  ];
  maps[SINNOH_ROUTE_212_SOUTH]={id:SINNOH_ROUTE_212_SOUTH,name:'신오 212번도로 · 남부 습지',width:36,height:88,background:SINNOH_ROUTE_212_SOUTH,
    walkable:southRows.map(r=>r.join('')),terrain:[],
    warps:[
      {x:17,y:1,to:SINNOH_ROUTE_212_NORTH,spawn:{x:16,y:69},entry:'up',facing:'up'},
      {x:22,y:86,to:pastoria.id,spawn:{...legacySouth.spawn},entry:'down',facing:'down'},
    ],
    npcs:[
      {id:'route212BoardwalkKeeper',name:'212번도로 데크 관리인',sprite:'worker',x:23,y:51,facing:'left',dialogue:'route212BoardwalkKeeper'},
      {id:'route212MarshTraveler',name:'습지 여행자',sprite:'rancher',x:15,y:65,facing:'right',dialogue:'route212MarshTraveler'},
    ],
    props:[{x:22,y:8,dialogue:'route212SouthSign'},{x:28,y:55,dialogue:'route212MarshSign'},{x:19,y:80,dialogue:'route212SouthSign'}],
  };
  features[SINNOH_ROUTE_212_SOUTH]=southFeatures;spawns[SINNOH_ROUTE_212_SOUTH]={x:17,y:3};

  const northPlace:Place={id:SINNOH_ROUTE_212_NORTH,name:'신오 212번도로 · 북부 정원길',region:'신오',theme:'flowers',concept:'저택 정원과 화단을 지나 남부 습지로 내려가는 길',landmark:'포켓몬저택 앞 정원',x:5.2,y:5.5};
  const southPlace:Place={id:SINNOH_ROUTE_212_SOUTH,name:'신오 212번도로 · 남부 습지',region:'신오',theme:'water',concept:'비와 진흙, 갈대 데크를 지나 들판으로 향하는 길',landmark:'습지 나무데크',x:5.5,y:5.8};
  passages[SINNOH_ROUTE_212_NORTH]={id:SINNOH_ROUTE_212_NORTH,a:hearthome,b:southPlace,kind:'road',bend:7};
  passages[SINNOH_ROUTE_212_SOUTH]={id:SINNOH_ROUTE_212_SOUTH,a:northPlace,b:pastoria,kind:'road',bend:12};
  passagePlaces[SINNOH_ROUTE_212_NORTH]=northPlace;passagePlaces[SINNOH_ROUTE_212_SOUTH]=southPlace;

  fromHearthome.to=SINNOH_ROUTE_212_NORTH;fromHearthome.spawn={x:15,y:3};
  fromPastoria.to=SINNOH_ROUTE_212_SOUTH;fromPastoria.spawn={x:22,y:84};
}
