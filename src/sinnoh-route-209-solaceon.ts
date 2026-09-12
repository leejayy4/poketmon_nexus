import type { GameMap } from './types';
import type { Passage } from './journey-world';
import type { Place,TourFeature,TourId } from './explore-world';

export const SINNOH_ROUTE_209='tour_sinnoh_route_209' as TourId;
export const SOLACEON_TOWN='tour_solaceon' as TourId;
export const SINNOH_ROUTE_210_SOUTH='tour_sinnoh_route_210_south' as TourId;
export const SINNOH_ROUTE_215='tour_sinnoh_route_215' as TourId;

const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';
};

/** Add Route 209 and Solaceon before the retained Hearthome-Veilstone compatibility road. */
export function installSinnohRoute209Solaceon(args:{
  places:Place[];
  maps:Record<TourId,GameMap>;
  passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;
  spawns:Record<TourId,{x:number;y:number}>;
  features:Record<string,TourFeature[]>;
}){
  const {places,maps,passages,passagePlaces,spawns,features}=args;
  const hearthome=places.find(p=>p.id==='tour_hearthome')!;
  const veilstone=places.find(p=>p.id==='tour_veilstone')!;
  const legacyId='tour_pass_hearthome_veilstone' as TourId;
  const fromHearthome=maps[hearthome.id].warps.find(w=>w.to===legacyId)!;
  const legacyWest=maps[legacyId].warps.find(w=>w.to===hearthome.id)!;
  const legacyEast=maps[legacyId].warps.find(w=>w.to===veilstone.id)!;
  const fromVeilstone=maps[veilstone.id].warps.find(w=>w.to===legacyId)!;

  const routeRows=Array.from({length:72},()=>Array<string>(32).fill('#'));
  carve(routeRows,13,61,6,10);carve(routeRows,10,53,9,10);carve(routeRows,8,43,6,12);
  carve(routeRows,8,35,15,10);carve(routeRows,17,26,6,11);carve(routeRows,14,17,9,11);
  carve(routeRows,10,8,7,11);carve(routeRows,13,1,4,9);
  // Optional eastern rise hints at the Lost Tower branch without inventing its interior.
  carve(routeRows,22,31,7,4);carve(routeRows,26,24,3,9);
  const routeFeatures:TourFeature[]=[
    {kind:'water',x:2,y:48,w:5,h:12,name:'209번도로 연못',description:'연고를 떠난 여행자가 쉬어 가는 작은 물가다.'},
    {kind:'rocks',x:24,y:17,w:6,h:6,name:'로스트타워 방면 언덕',description:'추모탑으로 이어질 높은 지대다. 탑 내부는 아직 열리지 않았다.'},
    {kind:'grove',x:2,y:8,w:7,h:12,name:'신수 남쪽 나무길',description:'목장 마을 가까이에서 길을 감싸는 나무 띠다.'},
  ];
  maps[SINNOH_ROUTE_209]={id:SINNOH_ROUTE_209,name:'신오 209번도로',width:32,height:72,background:SINNOH_ROUTE_209,
    walkable:routeRows.map(r=>r.join('')),terrain:[],
    warps:[
      {x:15,y:70,to:hearthome.id,spawn:{...legacyWest.spawn},entry:'down',facing:'down'},
      {x:14,y:1,to:SOLACEON_TOWN,spawn:{x:20,y:37},entry:'up',facing:'up'},
    ],
    npcs:[{id:'route209Walker',name:'209번도로 여행자',sprite:'rancher',x:11,y:39,facing:'right',dialogue:'route209Walker'}],
    props:[{x:12,y:64,dialogue:'route209Sign'},{x:25,y:30,dialogue:'route209TowerSign'},{x:17,y:6,dialogue:'route209Sign'}],
  };
  features[SINNOH_ROUTE_209]=routeFeatures;spawns[SINNOH_ROUTE_209]={x:15,y:68};

  const townRows=Array.from({length:40},(_,y)=>Array.from({length:40},(_,x)=>x>=2&&x<=37&&y>=2&&y<=37?'.':'#'));
  const townFeatures:TourFeature[]=[
    {kind:'garden',x:4,y:5,w:13,h:10,name:'신수 목장 울타리',description:'사람과 포켓몬이 함께 쉬는 풀밭과 돌봄 공간이다.'},
    {kind:'grove',x:28,y:4,w:7,h:12,name:'마을 북쪽 방풍림',description:'210번도로 남부로 나가기 전 바람을 막는 숲이다.'},
    {kind:'water',x:25,y:25,w:9,h:7,name:'신수 물웅덩이',description:'목장 포켓몬에게 물을 대는 얕은 못이다.'},
  ];
  for(const f of townFeatures)for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)townRows[y][x]='#';
  carve(townRows,18,1,5,38);carve(townRows,10,18,19,5);carve(townRows,5,15,8,3);carve(townRows,27,18,9,3);
  maps[SOLACEON_TOWN]={id:SOLACEON_TOWN,name:'신수마을',width:40,height:40,background:SOLACEON_TOWN,
    walkable:townRows.map(r=>r.join('')),terrain:[],
    warps:[
      {x:20,y:38,to:SINNOH_ROUTE_209,spawn:{x:14,y:2},entry:'down',facing:'down'},
      {x:20,y:1,to:SINNOH_ROUTE_210_SOUTH,spawn:{x:15,y:69},entry:'up',facing:'up'},
    ],
    npcs:[
      {id:'solaceonBreeder',name:'신수마을 목장지기',sprite:'pokemon_breeder_f',x:12,y:17,facing:'down',dialogue:'solaceonBreeder'},
      {id:'solaceonTraveler',name:'신수마을 여행자',sprite:'school_kid_f',x:25,y:20,facing:'left',dialogue:'solaceonTraveler'},
    ],
    props:[{x:17,y:35,dialogue:'solaceonSign'},{x:23,y:4,dialogue:'solaceonSign'}],
  };
  features[SOLACEON_TOWN]=townFeatures;spawns[SOLACEON_TOWN]={x:20,y:35};

  const route210Rows=Array.from({length:72},()=>Array<string>(32).fill('#'));
  carve(route210Rows,13,62,6,9);carve(route210Rows,9,54,10,10);carve(route210Rows,8,42,6,14);
  carve(route210Rows,8,34,17,10);carve(route210Rows,19,24,6,12);carve(route210Rows,15,15,10,11);
  carve(route210Rows,13,7,6,10);carve(route210Rows,14,1,4,8);
  carve(route210Rows,3,27,7,4);carve(route210Rows,3,21,4,8);
  const route210Features:TourFeature[]=[
    {kind:'garden',x:2,y:45,w:5,h:12,name:'210번도로 키 큰 풀밭',description:'남부 목장 지대에 키 큰 풀이 자라는 선택 관찰 구역이다.'},
    {kind:'garden',x:25,y:37,w:5,h:13,name:'포켓몬 동행 초지',description:'신수 목장에서 나온 포켓몬과 여행자가 잠시 쉬는 풀밭이다.'},
    {kind:'rocks',x:2,y:12,w:8,h:7,name:'북부 고지 경계',description:'안개 낀 210번도로 북부와 갈라지는 암반 경계다.'},
  ];
  maps[SINNOH_ROUTE_210_SOUTH]={id:SINNOH_ROUTE_210_SOUTH,name:'신오 210번도로 · 남부',width:32,height:72,background:SINNOH_ROUTE_210_SOUTH,
    walkable:route210Rows.map(r=>r.join('')),terrain:[],
    warps:[
      {x:15,y:70,to:SOLACEON_TOWN,spawn:{x:20,y:2},entry:'down',facing:'down'},
      {x:15,y:1,to:SINNOH_ROUTE_215,spawn:{x:2,y:18},entry:'up',facing:'up'},
    ],
    npcs:[
      {id:'route210CafeKeeper',name:'210번도로 카페 주인',sprite:'pokemon_breeder_f',x:6,y:26,facing:'right',dialogue:'route210CafeKeeper'},
      {id:'route210Rancher',name:'210번도로 목장 일꾼',sprite:'rancher',x:21,y:31,facing:'down',dialogue:'route210Rancher'},
    ],
    props:[{x:12,y:65,dialogue:'route210SouthSign'},{x:7,y:23,dialogue:'route210CafeSign'},{x:19,y:7,dialogue:'route210SouthSign'}],
  };
  features[SINNOH_ROUTE_210_SOUTH]=route210Features;spawns[SINNOH_ROUTE_210_SOUTH]={x:15,y:68};

  const route215Rows=Array.from({length:36},()=>Array<string>(88).fill('#'));
  carve(route215Rows,1,16,14,6);carve(route215Rows,12,12,12,10);carve(route215Rows,21,10,14,6);
  carve(route215Rows,32,10,6,14);carve(route215Rows,35,20,16,5);carve(route215Rows,48,13,6,12);
  carve(route215Rows,51,11,17,6);carve(route215Rows,65,11,6,12);carve(route215Rows,68,19,19,5);
  carve(route215Rows,24,25,18,4);carve(route215Rows,22,21,5,8);
  const route215Features:TourFeature[]=[
    {kind:'water',x:16,y:25,w:6,h:7,name:'215번도로 빗물 계곡',description:'상시 내리는 비가 모이는 낮은 물길이다.'},
    {kind:'water',x:43,y:5,w:8,h:8,name:'215번도로 계류',description:'나무다리 아래로 빗물이 흐르는 계류다.'},
    {kind:'grove',x:57,y:23,w:11,h:8,name:'장막 서쪽 비숲',description:'비를 머금은 나무가 장막 진입로를 감싼다.'},
  ];
  maps[SINNOH_ROUTE_215]={id:SINNOH_ROUTE_215,name:'신오 215번도로 · 비와 다리',width:88,height:36,background:SINNOH_ROUTE_215,
    walkable:route215Rows.map(r=>r.join('')),terrain:[],
    warps:[
      {x:1,y:18,to:SINNOH_ROUTE_210_SOUTH,spawn:{x:15,y:2},entry:'left',facing:'left'},
      {x:86,y:21,to:veilstone.id,spawn:{...legacyEast.spawn},entry:'right',facing:'right'},
    ],
    npcs:[
      {id:'route215BridgeKeeper',name:'215번도로 다리 관리인',sprite:'worker',x:38,y:22,facing:'right',dialogue:'route215BridgeKeeper'},
      {id:'route215Traveler',name:'비를 피하는 여행자',sprite:'ace_trainer_f',x:61,y:14,facing:'left',dialogue:'route215Traveler'},
    ],
    props:[{x:5,y:14,dialogue:'route215Sign'},{x:46,y:18,dialogue:'route215BridgeSign'},{x:82,y:25,dialogue:'route215Sign'}],
  };
  features[SINNOH_ROUTE_215]=route215Features;spawns[SINNOH_ROUTE_215]={x:3,y:18};

  const routePlace:Place={id:SINNOH_ROUTE_209,name:'신오 209번도로',region:'신오',theme:'forest',concept:'연고에서 신수로 이어지는 굽은 풀길과 추모탑 분기',landmark:'로스트타워 방면 언덕',x:5.25,y:4.6};
  const townPlace:Place={id:SOLACEON_TOWN,name:'신수마을',region:'신오',theme:'village',concept:'209번도로와 210번도로 사이의 목장 마을',landmark:'포켓몬 목장',x:5.5,y:4.3};
  const route210Place:Place={id:SINNOH_ROUTE_210_SOUTH,name:'신오 210번도로 · 남부',region:'신오',theme:'forest',concept:'카페와 키 큰 풀이 있는 신수 북쪽 목장길',landmark:'길가 카페터',x:5.7,y:4.1};
  const route215Place:Place={id:SINNOH_ROUTE_215,name:'신오 215번도로 · 비와 다리',region:'신오',theme:'water',concept:'계속 내리는 비와 나무다리를 지나 장막으로 가는 길',landmark:'빗물 계류와 다리',x:5.9,y:4.1};
  passages[SINNOH_ROUTE_209]={id:SINNOH_ROUTE_209,a:hearthome,b:townPlace,kind:'road',bend:7};
  passages[SINNOH_ROUTE_210_SOUTH]={id:SINNOH_ROUTE_210_SOUTH,a:townPlace,b:route215Place,kind:'road',bend:12};
  passages[SINNOH_ROUTE_215]={id:SINNOH_ROUTE_215,a:route210Place,b:veilstone,kind:'road',bend:7};
  passagePlaces[SINNOH_ROUTE_209]=routePlace;passagePlaces[SOLACEON_TOWN]=townPlace;
  passagePlaces[SINNOH_ROUTE_210_SOUTH]=route210Place;passagePlaces[SINNOH_ROUTE_215]=route215Place;

  fromHearthome.to=SINNOH_ROUTE_209;fromHearthome.spawn={x:15,y:68};
  legacyWest.to=SOLACEON_TOWN;legacyWest.spawn={x:20,y:2};
  fromVeilstone.to=SINNOH_ROUTE_215;fromVeilstone.spawn={x:84,y:21};
}
