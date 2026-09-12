import type { GameMap } from './types';
import type { Passage } from './journey-world';
import type { Place,TourFeature,TourId } from './explore-world';

export const SINNOH_ROUTE_213='tour_sinnoh_route_213' as TourId;
export const SINNOH_ROUTE_214='tour_sinnoh_route_214' as TourId;
export const VALOR_LAKEFRONT='tour_valor_lakefront' as TourId;
export const SINNOH_ROUTE_222='tour_sinnoh_route_222' as TourId;
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

export function installSinnohSoutheastRoutes(args:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,{x:number;y:number}>;features:Record<string,TourFeature[]>}){
  const {places,maps,passages,passagePlaces,spawns,features}=args;
  const pastoria=places.find(p=>p.id==='tour_pastoria')!,veilstone=places.find(p=>p.id==='tour_veilstone')!,sunyshore=places.find(p=>p.id==='tour_sunyshore')!;
  const pastLegacy='tour_pass_pastoria_sunyshore' as TourId,veilLegacy='tour_pass_veilstone_sunyshore' as TourId;
  const pastExit=maps[pastoria.id].warps.find(w=>w.to===pastLegacy)!,veilExit=maps[veilstone.id].warps.find(w=>w.to===veilLegacy)!;
  const sunPast=maps[sunyshore.id].warps.find(w=>w.to===pastLegacy)!,sunVeil=maps[sunyshore.id].warps.find(w=>w.to===veilLegacy)!;
  const pastLegacyEnd=maps[pastLegacy].warps.find(w=>w.to===pastoria.id)!,veilLegacyEnd=maps[veilLegacy].warps.find(w=>w.to===veilstone.id)!;
  const sunLegacyEnd=maps[pastLegacy].warps.find(w=>w.to===sunyshore.id)!;

  const r213=Array.from({length:32},()=>Array<string>(72).fill('#'));
  carve(r213,1,14,14,5);carve(r213,12,10,15,9);carve(r213,24,8,6,13);carve(r213,27,17,17,5);carve(r213,41,12,6,10);carve(r213,44,10,18,5);carve(r213,59,10,12,5);carve(r213,16,23,18,4);
  const f213:TourFeature[]=[{kind:'water',x:3,y:21,w:11,h:8,name:'213번도로 모래 해안',description:'들판 동쪽에서 바다와 맞닿는 긴 해변이다.'},{kind:'rocks',x:34,y:23,w:9,h:6,name:'해안 절벽',description:'리조트 방면 산책로와 해변을 나누는 낮은 절벽이다.'},{kind:'garden',x:50,y:18,w:10,h:8,name:'리조트 앞 정원',description:'호수근처에 가까워지며 정돈된 휴양지 풍경이 나타난다.'}];
  maps[SINNOH_ROUTE_213]={id:SINNOH_ROUTE_213,name:'신오 213번도로 · 해변길',width:72,height:32,background:SINNOH_ROUTE_213,walkable:r213.map(r=>r.join('')),terrain:[],warps:[{x:1,y:16,to:pastoria.id,spawn:{...pastLegacyEnd.spawn},entry:'left',facing:'left'},{x:70,y:12,to:VALOR_LAKEFRONT,spawn:{x:3,y:27},entry:'right',facing:'right'}],npcs:[{id:'route213BeachWalker',name:'213번도로 해변 여행자',sprite:'ace_trainer_f',x:28,y:19,facing:'down',dialogue:'route213BeachWalker'}],props:[{x:5,y:12,dialogue:'route213Sign'},{x:64,y:8,dialogue:'route213Sign'}]};features[SINNOH_ROUTE_213]=f213;spawns[SINNOH_ROUTE_213]={x:3,y:16};

  const r214=Array.from({length:80},()=>Array<string>(32).fill('#'));
  carve(r214,13,1,6,11);carve(r214,10,9,9,15);carve(r214,8,21,7,15);carve(r214,8,33,16,6);carve(r214,19,36,6,14);carve(r214,15,47,10,8);carve(r214,12,52,8,15);carve(r214,11,64,14,6);carve(r214,19,67,6,12);carve(r214,24,26,6,4);
  const f214:TourFeature[]=[{kind:'rocks',x:2,y:8,w:7,h:17,name:'214번도로 장막 절벽',description:'장막 남쪽에서 길을 좁히는 층층 암벽이다.'},{kind:'garden',x:2,y:43,w:10,h:12,name:'214번도로 풀밭',description:'암벽 사이 햇빛이 드는 선택 풀밭이다.'},{kind:'rocks',x:24,y:54,w:6,h:13,name:'호수근처 바위턱',description:'입지호수 근처로 내려가기 전 마지막 암반 지대다.'}];
  maps[SINNOH_ROUTE_214]={id:SINNOH_ROUTE_214,name:'신오 214번도로 · 암벽길',width:32,height:80,background:SINNOH_ROUTE_214,walkable:r214.map(r=>r.join('')),terrain:[],warps:[{x:15,y:1,to:veilstone.id,spawn:{...veilLegacyEnd.spawn},entry:'up',facing:'up'},{x:22,y:78,to:VALOR_LAKEFRONT,spawn:{x:20,y:3},entry:'down',facing:'down'}],npcs:[{id:'route214Hiker',name:'214번도로 등산객',sprite:'rancher',x:21,y:43,facing:'left',dialogue:'route214Hiker'}],props:[{x:20,y:7,dialogue:'route214Sign'},{x:17,y:72,dialogue:'route214Sign'}]};features[SINNOH_ROUTE_214]=f214;spawns[SINNOH_ROUTE_214]={x:15,y:3};

  const lake=Array.from({length:40},(_,y)=>Array.from({length:40},(_,x)=>x>=2&&x<=37&&y>=2&&y<=37?'.':'#'));
  const fLake:TourFeature[]=[{kind:'water',x:11,y:8,w:18,h:16,name:'입지호수 전망 수면',description:'입지호수 본체를 바라보는 넓은 수면이다. 호수 내부와 동굴은 별도 범위다.'},{kind:'rocks',x:4,y:5,w:6,h:10,name:'214번도로 암벽 인계',description:'장막 방향 산길과 호숫가를 잇는 바위 지대다.'},{kind:'garden',x:26,y:27,w:9,h:7,name:'호반 휴양 정원',description:'213번도로 리조트와 222번도로 사이의 쉼터다.'}];for(const f of fLake)for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)lake[y][x]='#';carve(lake,18,1,5,8);carve(lake,2,25,14,5);carve(lake,13,23,15,5);carve(lake,22,21,5,17);carve(lake,24,34,14,4);
  maps[VALOR_LAKEFRONT]={id:VALOR_LAKEFRONT,name:'입지호수 근처',width:40,height:40,background:VALOR_LAKEFRONT,walkable:lake.map(r=>r.join('')),terrain:[],warps:[{x:20,y:1,to:SINNOH_ROUTE_214,spawn:{x:22,y:76},entry:'up',facing:'up'},{x:2,y:27,to:SINNOH_ROUTE_213,spawn:{x:68,y:12},entry:'left',facing:'left'},{x:37,y:36,to:SINNOH_ROUTE_222,spawn:{x:2,y:16},entry:'right',facing:'right'}],npcs:[{id:'valorLakefrontRanger',name:'입지호수 근처 관리인',sprite:'scientist_f',x:24,y:29,facing:'down',dialogue:'valorLakefrontRanger'}],props:[{x:16,y:31,dialogue:'valorLakefrontSign'},{x:29,y:20,dialogue:'valorLakeSign'}]};features[VALOR_LAKEFRONT]=fLake;spawns[VALOR_LAKEFRONT]={x:4,y:27};

  const r222=Array.from({length:32},()=>Array<string>(80).fill('#'));
  carve(r222,1,14,15,5);carve(r222,13,10,15,9);carve(r222,25,8,6,13);carve(r222,28,17,18,5);carve(r222,43,12,6,10);carve(r222,46,10,18,5);carve(r222,61,10,18,5);carve(r222,36,24,19,4);
  const f222:TourFeature[]=[{kind:'water',x:4,y:21,w:14,h:8,name:'222번도로 해안 수면',description:'입지호수 근처에서 물가시티로 이어지는 바닷가다.'},{kind:'grove',x:31,y:5,w:10,h:8,name:'222번도로 방풍림',description:'해풍을 누그러뜨리는 낮은 나무 띠다.'},{kind:'rocks',x:58,y:18,w:12,h:8,name:'물가시티 앞 해안 절벽',description:'태양광 산책로가 보이기 시작하는 해안 바위다.'}];
  maps[SINNOH_ROUTE_222]={id:SINNOH_ROUTE_222,name:'신오 222번도로 · 물가 해안길',width:80,height:32,background:SINNOH_ROUTE_222,walkable:r222.map(r=>r.join('')),terrain:[],warps:[{x:1,y:16,to:VALOR_LAKEFRONT,spawn:{x:35,y:36},entry:'left',facing:'left'},{x:78,y:12,to:sunyshore.id,spawn:{...sunLegacyEnd.spawn},entry:'right',facing:'right'}],npcs:[{id:'route222CoastWalker',name:'222번도로 해안 여행자',sprite:'school_kid_f',x:47,y:19,facing:'up',dialogue:'route222CoastWalker'}],props:[{x:5,y:12,dialogue:'route222Sign'},{x:72,y:8,dialogue:'route222Sign'}]};features[SINNOH_ROUTE_222]=f222;spawns[SINNOH_ROUTE_222]={x:3,y:16};

  const p213:Place={id:SINNOH_ROUTE_213,name:'신오 213번도로 · 해변길',region:'신오',theme:'coast',concept:'들판에서 리조트와 호수근처로 이어지는 해변길',landmark:'해안 산책로',x:6.3,y:6};
  const p214:Place={id:SINNOH_ROUTE_214,name:'신오 214번도로 · 암벽길',region:'신오',theme:'mine',concept:'장막 남쪽 암벽과 풀밭을 지나 호수근처로 가는 길',landmark:'층층 암벽',x:6.4,y:5};
  const pLake:Place={id:VALOR_LAKEFRONT,name:'입지호수 근처',region:'신오',theme:'water',concept:'213·214·222번도로가 만나는 호반 휴양지',landmark:'입지호수 전망',x:6.7,y:5.5};
  const p222:Place={id:SINNOH_ROUTE_222,name:'신오 222번도로 · 물가 해안길',region:'신오',theme:'coast',concept:'호수근처에서 물가시티로 이어지는 동쪽 해안',landmark:'물가 앞 해안 절벽',x:7,y:5.5};
  for(const p of [p213,p214,pLake,p222])passagePlaces[p.id]=p;
  passages[SINNOH_ROUTE_213]={id:SINNOH_ROUTE_213,a:pastoria,b:pLake,kind:'coast',bend:7};passages[SINNOH_ROUTE_214]={id:SINNOH_ROUTE_214,a:veilstone,b:pLake,kind:'road',bend:12};passages[SINNOH_ROUTE_222]={id:SINNOH_ROUTE_222,a:pLake,b:sunyshore,kind:'coast',bend:7};
  pastExit.to=SINNOH_ROUTE_213;pastExit.spawn={x:3,y:16};veilExit.to=SINNOH_ROUTE_214;veilExit.spawn={x:15,y:3};
  for(const exit of [sunPast,sunVeil]){exit.to=SINNOH_ROUTE_222;exit.spawn={x:76,y:12};}
}
