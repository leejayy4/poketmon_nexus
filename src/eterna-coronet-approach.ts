import type { GameMap } from './types';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';

export const ETERNA_CORONET_APPROACH={
  id:'tour_eterna_coronet_approach' as TourId,
  name:'천관산 영원 입구길',width:56,height:28,
} as const;

/** Replace the compressed city-to-cave warp with a named, walkable foothill segment. */
export function installEternaCoronetApproach(places:Place[],maps:Record<TourId,GameMap>,passages:Record<string,Passage>,passagePlaces:Record<string,Place>,spawns:Record<TourId,{x:number;y:number}>){
  const city=places.find(place=>place.id==='tour_eterna')!,cave=places.find(place=>place.id==='tour_coronet')!;
  const outward=maps[city.id].warps.find(warp=>warp.to===cave.id)!,back=maps[cave.id].warps.find(warp=>warp.to===city.id)!;
  const {id,name,width,height}=ETERNA_CORONET_APPROACH;
  const rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
  const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
  // The stone path climbs twice; lower and upper overlooks both rejoin it.
  open(1,9,10,3);open(8,9,4,10);open(10,16,14,3);open(21,8,4,11);
  open(23,7,15,3);open(35,7,4,11);open(37,15,12,3);open(46,9,4,9);open(48,9,7,3);
  open(13,19,14,3);open(13,18,3,4);open(25,14,3,8);
  open(28,3,13,3);open(28,4,3,12);open(39,3,3,7);
  rows[10][1]='.';rows[10][width-2]='.';
  maps[id]={id,name,width,height,background:id,walkable:rows.map(row=>row.join('')),terrain:[],
    warps:[
      {x:1,y:10,to:city.id,spawn:{...back.spawn},entry:'left',facing:back.facing},
      {x:width-2,y:10,to:cave.id,spawn:{...outward.spawn},entry:'right',facing:outward.facing},
    ],
    npcs:[{id:'pathWalker',name:'산기슭 여행자',sprite:'worker',x:25,y:17,facing:'down',dialogue:'journeyWalker'}],
    props:[{x:3,y:8,dialogue:'journeySign'},{x:width-4,y:8,dialogue:'journeySign'}],
  };
  passages[id]={id,a:city,b:cave,kind:'road',bend:16};
  passagePlaces[id]={id,name,region:'신오',theme:'cave',concept:'영원시티와 천관산 하부 사이의 산기슭 오르막',landmark:'천관산 입구 표지',x:(city.x+cave.x)/2,y:(city.y+cave.y)/2};
  spawns[id]={x:2,y:10};
  outward.to=id;outward.spawn={x:2,y:10};outward.facing='right';
  back.to=id;back.spawn={x:width-3,y:10};back.facing='left';
}
