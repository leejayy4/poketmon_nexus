import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';

export const JOHTO_ROUTE_43='tour_johto_route_43' as const;
const COMPAT='tour_pass_mahogany_rage_lake' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const carve=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};

/** Replace the Mahogany-Lake shortcut with the Route 43 north-south approach. */
export function installJohtoRoute43(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  const mahogany=world.places.find(p=>p.id==='tour_mahogany')!,lake=world.places.find(p=>p.id==='tour_rage_lake')!,compat=world.maps[COMPAT];
  const mExit=world.maps[mahogany.id].warps.find(w=>w.to===COMPAT)!,lExit=world.maps[lake.id].warps.find(w=>w.to===COMPAT)!;
  const toM=compat.warps.find(w=>w.to===mahogany.id)!,toL=compat.warps.find(w=>w.to===lake.id)!;
  const rows=Array.from({length:80},()=>Array<string>(32).fill('#'));
  carve(rows,13,1,7,78);carve(rows,5,10,9,15);carve(rows,19,28,8,16);carve(rows,4,49,10,17);carve(rows,18,62,9,12);
  const objects:ObjectInfo[]=[
    {name:'분노의호수 남쪽 도착 표지',event:'tourRoute43LakeBoard',cells:[{x:21,y:8}],pages:['북쪽은 분노의호수 남쪽 둑, 남쪽은 43번도로와 황토마을이다.\n호숫가 주택에서는 주민에게 물가 생활 이야기를 들을 수 있다.']},
    {name:'상류 물길 관찰대',event:'tourRoute43WaterRail',cells:[{x:23,y:35}],pages:['호수에서 내려온 물이 낮은 둑을 따라 황토 방향으로 흐른다.\n수상 이동·낚시·야생 조우는 현재 제공하지 않는다.']},
    {name:'옛 검문 흔적 표지',event:'tourRoute43GateTrace',cells:[{x:9,y:56}],pages:['길 가장자리에는 오래된 검문 초소의 기단만 남아 있다.\n현재 통행료·강제 전투·길막 조건은 없다.']},
    {name:'황토 북쪽 43번도로 표석',event:'tourRoute43MahoganyBoard',cells:[{x:22,y:69}],pages:['남쪽은 황토마을 센터와 장터, 북쪽은 분노의호수다.\n가운데 본선은 언제든 양방향으로 돌아갈 수 있다.']},
  ];for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[JOHTO_ROUTE_43]={id:JOHTO_ROUTE_43,name:'성도 43번도로',width:32,height:80,background:JOHTO_ROUTE_43,walkable:rows.map(r=>r.join('')),warps:[
    {x:16,y:1,to:lake.id,spawn:lake.id==='tour_rage_lake'&&world.maps[lake.id].width===56?{x:28,y:43}:{...toL.spawn},entry:'up',facing:toL.facing},{x:16,y:78,to:mahogany.id,spawn:{...toM.spawn},entry:'down',facing:toM.facing},
  ],npcs:[
    {id:'route43Traveler',name:'43번도로 상류 여행자',sprite:'rancher',x:16,y:43,facing:'down',dialogue:'journeyWalker'},
    {id:'route43Trainer',name:'43번도로 새잡이',sprite:'ace_trainer_f',x:9,y:61,facing:'right',dialogue:'tourRoute43Trainer'},
  ],props:objects.flatMap(o=>o.cells.map(c=>({...c,dialogue:o.event}))),terrain:[
    {kind:'tallGrass',x:5,y:50,w:8,h:7},{kind:'tallGrass',x:19,y:29,w:7,h:9},
  ]};
  world.passages[JOHTO_ROUTE_43]={id:JOHTO_ROUTE_43,a:mahogany,b:lake,kind:'road',bend:42};
  world.passagePlaces[JOHTO_ROUTE_43]={id:JOHTO_ROUTE_43,name:'성도 43번도로',region:'성도',theme:'water',concept:'황토마을과 분노의호수를 잇는 상류 둑길',landmark:'상류 물길과 옛 검문 흔적',x:(mahogany.x+lake.x)/2,y:(mahogany.y+lake.y)/2};
  world.outdoors[JOHTO_ROUTE_43]={objects,signs:[]};world.spawns[JOHTO_ROUTE_43]={x:16,y:75};
  mExit.to=JOHTO_ROUTE_43;mExit.spawn={x:16,y:75};mExit.facing='up';lExit.to=JOHTO_ROUTE_43;lExit.spawn={x:16,y:4};lExit.facing='down';
}
