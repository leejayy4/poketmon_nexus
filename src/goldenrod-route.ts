import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const GOLDENROD_ROUTE='tour_route_34' as const;
export const ROUTE_34_PATHS:readonly (readonly number[])[]=[
  [13,1,3,9],[13,8,10,3],[20,9,3,12],[13,18,10,3],[13,19,3,22],
  // Riverbank observation loop rejoins the main road south of the bend.
  [7,12,15,2],[7,13,2,16],[8,27,7,2],
  // The longer southern approach changes from open meadow to Ilex woodland.
  [13,39,3,32],[8,45,8,3],[8,45,3,10],[10,52,6,3],[15,57,10,3],[22,58,3,8],[14,64,11,3],
];
export const ROUTE_34_WATER={x:3,y:15,w:3,h:10};
export const ROUTE_34_SIGNS=[{x:17,y:4},{x:17,y:66}];
// Optional clearings only: the riverbank loop and the main road remain safe.
export const ROUTE_34_GRASS=[{kind:'tallGrass' as const,x:10,y:16,w:3,h:2},{kind:'tallGrass' as const,x:18,y:23,w:4,h:2},{kind:'tallGrass' as const,x:17,y:46,w:5,h:3},{kind:'tallGrass' as const,x:7,y:58,w:4,h:3}];

/** Insert an actual road without moving any pre-existing city/forest tile. */
export function installGoldenrodRoute(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const a=world.places.find(p=>p.id==='tour_goldenrod')!,b=world.places.find(p=>p.id==='tour_ilex')!;
  const town=world.maps[a.id],forest=world.maps[b.id];
  const south=town.warps.find(w=>w.to===b.id)!,north=forest.warps.find(w=>w.to===a.id)!;
  const townSpawn={...north.spawn},forestSpawn={...south.spawn};
  const width=36,height=72,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  for(const [x,y,w,h]of ROUTE_34_PATHS)open(x,y,w,h);
  open(16,3,4,4);open(16,34,4,5);open(9,12,5,4);open(17,23,8,6);open(14,25,5,2);
  open(9,14,5,4);
  // Optional southern encounter clearings branch off the safe main road.
  open(15,45,8,5);open(6,57,8,5);
  const signs=ROUTE_34_SIGNS.map((p,i)=>({...p,direction:i?'down' as const:'up' as const,destination:i?b.id:a.id,name:'34번도로 이정표',event:'tourRoute34Sign',pages:['↑ 북쪽 금빛시티\n↓ 남쪽 너도밤나무숲 · 고동마을','강가 샛길은 남쪽 큰길로 돌아온다.\n긴 풀밭에서 새 동료를 만나 보자.']}));
  for(const p of signs)rows[p.y][p.x]='#';
  const objects=[
    {name:'강가의 관찰 자리',event:'tourRoute34River',cells:[{x:6,y:19}],pages:['물살을 피해 작은 잎들이 모여 있다.\n강가 길은 남쪽 큰길로 이어진다.']},
    {name:'여행자의 쉼터',event:'tourRoute34Rest',cells:[{x:23,y:25}],pages:['나무 그늘 아래 낮은 의자가 있다.\n금빛에서 산 도시락을 펼치기 좋은 곳.']},
    {name:'목장 울타리',event:'tourRoute34Pasture',cells:[{x:11,y:47}],pages:['낮은 울타리 너머로 포켓몬 발자국이 이어진다.\n큰길에서는 풀밭의 생태를 조용히 살필 수 있다.']},
    {name:'숲 문턱 표석',event:'tourRoute34IlexStone',cells:[{x:25,y:63}],pages:['그늘이 짙어지며 너도밤나무숲의 냄새가 난다.\n북쪽은 금빛시티, 남쪽은 숲과 고동마을이다.']},
    {name:'강가 풀숲의 작은 발자국',event:'tourRoute34RiverGrass',cells:[{x:9,y:18}],pages:['물가로 이어진 작은 발자국과 갉은 풀잎이 있다.\n꼬렛이 먹이를 찾고 물을 마신 흔적 같다.']},
    {name:'굽이 풀숲의 눌린 자리',event:'tourRoute34BendGrass',cells:[{x:22,y:22}],pages:['그늘진 풀 사이가 둥글게 눌려 있다.\n낮 동안 졸음이 많은 슬리프가 쉬었을지도 모른다.']},
    {name:'목장 가장자리의 갉은 열매',event:'tourRoute34PastureGrass',cells:[{x:23,y:47}],pages:['울타리 밖 풀숲에 작은 이빨 자국 난 열매가 있다.\n목장 먹이를 노린 꼬렛이 다녀간 흔적이다.']},
    {name:'숲 문턱의 졸음 흔적',event:'tourRoute34ForestGrass',cells:[{x:6,y:56}],pages:['짙은 나무 그늘 아래 마른 잎이 둥글게 모였다.\n조용한 곳을 찾은 슬리프가 쉬어 간 흔적 같다.']},
  ];
  // An observation face touches the west edge of the riverbank path.
  rows[19][6]='#';rows[25][23]='#';rows[47][11]='#';rows[63][25]='#';
  for(const object of objects.slice(4))for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[GOLDENROD_ROUTE]={id:GOLDENROD_ROUTE,name:'성도 34번도로',width,height,background:GOLDENROD_ROUTE,walkable:rows.map(r=>r.join('')),
    warps:[{x:14,y:1,entry:'up',to:a.id,spawn:townSpawn,facing:north.facing},{x:14,y:70,entry:'down',to:b.id,spawn:forestSpawn,facing:south.facing}],
    terrain:ROUTE_34_GRASS,
    npcs:[
      {id:'route34Traveler',name:'숲길 여행자',sprite:'rancher',x:11,y:14,facing:'down',dialogue:'tourGuide'},
      {id:'route34Trainer',name:'34번도로 트레이너',sprite:'ace_trainer_f',x:18,y:36,facing:'left',dialogue:'tourRoute34Trainer'},
      {id:'route34Keeper',name:'34번도로 목장지기',sprite:'pokemon_breeder_f',x:12,y:53,facing:'right',dialogue:'tourRoute34Keeper'},
      {id:'route34Pokemon',name:'목장 옆 파치리스',sprite:'field-pachirisu',x:20,y:58,facing:'left',dialogue:'tourRoute34Pokemon'},
    ],
    props:[...signs.map(p=>({x:p.x,y:p.y,dialogue:p.event})),...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))],
  };
  world.passages[GOLDENROD_ROUTE]={id:GOLDENROD_ROUTE,a,b,kind:'road',bend:18};
  world.passagePlaces[GOLDENROD_ROUTE]={id:GOLDENROD_ROUTE,name:'성도 34번도로',region:'성도',theme:'forest',concept:'금빛시티와 너도밤나무숲 사이의 강변 산책길',landmark:'강변 쉼터',x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  world.spawns[GOLDENROD_ROUTE]={x:14,y:3};world.outdoors[GOLDENROD_ROUTE]={objects,signs};
  south.to=GOLDENROD_ROUTE;south.spawn={x:14,y:3};south.facing='down';
  north.to=GOLDENROD_ROUTE;north.spawn={x:14,y:68};north.facing='up';
}
