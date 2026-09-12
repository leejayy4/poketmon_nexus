import type { GameMap } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';

// Legacy IDs remain save-compatible; these shortcuts are not canonical numbered routes.
export const ETERNA_APPROACHES=[
  {id:'tour_sinnoh_route_02',name:'영원숲 남쪽길',a:'tour_jubilife',b:'tour_eterna_forest',width:64,height:32},
  {id:'tour_sinnoh_route_03',name:'영원숲 북쪽길',a:'tour_eterna_forest',b:'tour_eterna',width:56,height:28},
] as const;

export function buildEternaApproaches(places:Place[],maps:Record<TourId,GameMap>,passages:Record<string,Passage>,passagePlaces:Record<string,Place>,spawns:Record<TourId,{x:number;y:number}>){
  for(const route of ETERNA_APPROACHES){
    const a=places.find(p=>p.id===route.a)!,b=places.find(p=>p.id===route.b)!;
    const outward=maps[a.id].warps.find(w=>w.to===b.id)!,back=maps[b.id].warps.find(w=>w.to===a.id)!;
    const rows=Array.from({length:route.height},()=>Array<string>(route.width).fill('#'));
    const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
    // The winding main lane and lower woodland loop meet at both ends.
    open(1,9,10,3);open(8,5,3,7);open(9,5,17,3);open(23,6,3,12);
    open(24,15,route.width-27,3);open(route.width-5,9,3,9);open(route.width-4,9,3,3);
    open(8,11,3,12);open(9,20,19,3);open(25,16,3,7);
    // A trainer's clearing is optional, so the main road never requires a win.
    open(13,10,7,6);open(9,12,6,3);open(18,14,8,2);
    if(route.id==='tour_sinnoh_route_02'){
      // A longer low woodland walk: the optional southern loop rejoins twice.
      open(27,20,4,8);open(29,25,17,3);open(43,20,4,8);
      open(35,11,4,11);open(37,9,13,3);open(47,9,4,11);
      open(49,17,9,3);open(55,12,4,8);
    }else{
      // The northern road rises through a short ridge before entering Eterna.
      open(27,4,4,14);open(29,4,14,3);open(40,4,4,12);
      open(42,13,9,3);open(48,9,4,7);
      open(29,18,16,3);open(42,17,4,5);
    }
    const signs=[{x:3,y:8,dialogue:'journeySign'},{x:route.width-4,y:8,dialogue:'journeySign'}];
    maps[route.id]={id:route.id,name:route.name,width:route.width,height:route.height,background:route.id,
      walkable:rows.map(r=>r.join('')),terrain:[],props:signs,
      warps:[{x:1,y:10,to:a.id,spawn:{...back.spawn},entry:'left',facing:back.facing},{x:route.width-2,y:10,to:b.id,spawn:{...outward.spawn},entry:'right',facing:outward.facing}],
      npcs:[{id:'pathWalker',name:route.id==='tour_sinnoh_route_03'?'숲길 트레이너':'숲길 안내원',sprite:'rancher',x:17,y:11,facing:'down',dialogue:'journeyWalker'}]};
    passages[route.id]={id:route.id,a,b,kind:'road',bend:5};
    passagePlaces[route.id]={id:route.id,name:route.name,region:'신오',theme:'forest',concept:route.name,landmark:'숲길 이정표',x:(a.x+b.x)/2,y:(a.y+b.y)/2};
    spawns[route.id]={x:2,y:10};
    outward.to=route.id;outward.spawn={x:2,y:10};outward.facing='right';
    back.to=route.id;back.spawn={x:route.width-3,y:10};back.facing='left';
  }
}

export function eternaApproachPages(map:string):string[]|undefined{
  const route=ETERNA_APPROACHES.find(r=>r.id===map);if(!route)return;
  return [route.name,
    route.id==='tour_sinnoh_route_02'?'왼쪽은 축복시티, 오른쪽은 영원숲입니다.\n나무 사이 굽은 길을 따라가세요.':'왼쪽은 영원숲, 오른쪽은 영원시티입니다.\n남쪽 산책길도 큰길로 돌아옵니다.',
    '야생 포켓몬은 영원숲의 긴 풀에서\n만날 수 있어요. 이 도로에는 없어요.',
    route.id==='tour_sinnoh_route_02'?'숲 안의 안내원에게 동료를 쉬게 하고\n긴 풀이나 큰길을 골라 여행하세요.':'공터의 트레이너와 연습하거나\n영원시티 센터에서 쉬어 가세요.'];
}
