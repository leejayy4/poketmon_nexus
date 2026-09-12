import type { GameMap } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';

export const SINNOH_ROUTE_208={id:'tour_sinnoh_route_208' as TourId,name:'신오 208번도로',width:56,height:28} as const;

/** Insert the canonical Route 208 descent between lower Mt. Coronet and Hearthome. */
export function installSinnohRoute208(places:Place[],maps:Record<TourId,GameMap>,passages:Record<string,Passage>,passagePlaces:Record<string,Place>,spawns:Record<TourId,{x:number;y:number}>){
  const cave=places.find(place=>place.id==='tour_coronet')!,city=places.find(place=>place.id==='tour_hearthome')!;
  const outward=maps[cave.id].warps.find(warp=>warp.to===city.id)!,back=maps[city.id].warps.find(warp=>warp.to===cave.id)!;
  const {id,name,width,height}=SINNOH_ROUTE_208;
  const rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // A descending main road and a lower creek walk meet before Hearthome.
  open(1,9,9,3);open(8,7,4,5);open(10,7,12,3);open(19,7,4,8);
  open(21,12,12,3);open(30,12,4,8);open(32,17,12,3);open(41,9,4,11);open(43,9,12,3);
  open(13,15,5,8);open(15,20,17,3);open(29,18,4,5);
  open(34,4,12,3);open(34,5,4,9);open(43,4,4,7);
  rows[10][1]='.';rows[10][width-2]='.';
  maps[id]={id,name,width,height,background:id,walkable:rows.map(row=>row.join('')),terrain:[],
    warps:[
      {x:1,y:10,to:cave.id,spawn:{...back.spawn},entry:'left',facing:back.facing},
      {x:width-2,y:10,to:city.id,spawn:{...outward.spawn},entry:'right',facing:outward.facing},
    ],
    npcs:[{id:'pathWalker',name:'208번도로 등산객',sprite:'rancher',x:29,y:19,facing:'down',dialogue:'journeyWalker'}],
    props:[{x:3,y:8,dialogue:'journeySign'},{x:width-4,y:8,dialogue:'journeySign'}],
  };
  passages[id]={id,a:cave,b:city,kind:'road',bend:12};
  passagePlaces[id]={id,name,region:'신오',theme:'water',concept:'천관산에서 개울과 계단을 따라 연고로 내려가는 208번도로',landmark:'208번도로 계단과 개울',x:(cave.x+city.x)/2,y:(cave.y+city.y)/2};
  spawns[id]={x:2,y:10};
  outward.to=id;outward.spawn={x:2,y:10};outward.facing='right';
  back.to=id;back.spawn={x:width-3,y:10};back.facing='left';
}
