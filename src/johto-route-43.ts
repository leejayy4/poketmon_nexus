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
  // HGSS's route choice: a longer western grass/trainer path and a shorter
  // eastern gate path. Both rejoin the same Lake and Mahogany approaches.
  carve(rows,13,1,7,21);carve(rows,6,18,21,6);
  carve(rows,5,20,8,47);carve(rows,20,20,7,47);
  carve(rows,5,64,22,6);carve(rows,13,67,7,12);
  const objects:ObjectInfo[]=[
    {name:'분노의호수 남쪽 도착 표지',event:'tourRoute43LakeBoard',cells:[{x:19,y:8}],pages:['북쪽은 분노의호수 남쪽 둑, 남쪽은 43번도로와 황토마을이다.\n호숫가 주택에서는 주민에게 물가 생활 이야기를 들을 수 있다.']},
    {name:'상류 물길 관찰대',event:'tourRoute43WaterRail',cells:[{x:23,y:35}],pages:['호수에서 내려온 물이 낮은 둑을 따라 황토 방향으로 흐른다.\n수상 이동·낚시·야생 조우는 현재 제공하지 않는다.']},
    {name:'옛 검문 흔적 표지',event:'tourRoute43GateTrace',cells:[{x:22,y:56}],pages:['동쪽 짧은 길에는 오래된 검문 초소의 기단만 남아 있다.\n현재 통행료·강제 전투·길막 조건은 없다.']},
    {name:'황토 북쪽 43번도로 표석',event:'tourRoute43MahoganyBoard',cells:[{x:22,y:69}],pages:['남쪽은 황토마을 센터와 장터, 북쪽은 분노의호수다.\n가운데 본선은 언제든 양방향으로 돌아갈 수 있다.']},
  ];for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  world.maps[JOHTO_ROUTE_43]={id:JOHTO_ROUTE_43,name:'성도 43번도로',width:32,height:80,background:JOHTO_ROUTE_43,walkable:rows.map(r=>r.join('')),warps:[
    {x:16,y:1,to:lake.id,spawn:lake.id==='tour_rage_lake'&&world.maps[lake.id].width===56?{x:28,y:43}:{...toL.spawn},entry:'up',facing:toL.facing},{x:16,y:78,to:mahogany.id,spawn:{...toM.spawn},entry:'down',facing:toM.facing},
  ],npcs:[
    {id:'route43Camper',name:'43번도로 야영객',sprite:'rancher',x:9,y:43,facing:'down',dialogue:'tourRoute43Camper'},
    {id:'route43Traveler',name:'43번도로 상류 여행자',sprite:'rancher',x:23,y:43,facing:'down',dialogue:'journeyWalker'},
    {id:'route43Trainer',name:'43번도로 새잡이',sprite:'ace_trainer_f',x:9,y:61,facing:'right',dialogue:'tourRoute43Trainer'},
  ],props:objects.flatMap(o=>o.cells.map(c=>({...c,dialogue:o.event}))),terrain:[
    {kind:'tallGrass',x:6,y:27,w:6,h:14},{kind:'tallGrass',x:5,y:50,w:8,h:12},
  ]};
  world.passages[JOHTO_ROUTE_43]={id:JOHTO_ROUTE_43,a:mahogany,b:lake,kind:'road',bend:42};
  world.passagePlaces[JOHTO_ROUTE_43]={id:JOHTO_ROUTE_43,name:'성도 43번도로',region:'성도',theme:'water',concept:'황토마을과 분노의호수를 잇는 상류 둑길',landmark:'상류 물길과 옛 검문 흔적',x:(mahogany.x+lake.x)/2,y:(mahogany.y+lake.y)/2};
  world.outdoors[JOHTO_ROUTE_43]={objects,signs:[]};world.spawns[JOHTO_ROUTE_43]={x:16,y:75};
  mExit.to=JOHTO_ROUTE_43;mExit.spawn={x:16,y:75};mExit.facing='up';lExit.to=JOHTO_ROUTE_43;lExit.spawn={x:16,y:4};lExit.facing='down';
}

/** BW/BW2-style interpretation of the HGSS two-path woodland route. */
export function paintJohtoRoute43(c:CanvasRenderingContext2D,map:GameMap):void{
  if(map.id!==JOHTO_ROUTE_43)return;
  const grass=(x:number,y:number)=>map.terrain?.some(t=>t.kind==='tallGrass'&&x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+t.h);
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    if(!walk){
      c.fillStyle='#3f614d';c.fillRect(px,py,16,16);
      c.fillStyle=(x+y)%3?'#55785a':'#668563';c.fillRect(px+2,py+2,12,9);
      c.fillStyle='#294a3d';c.fillRect(px+1,py+11,14,5);continue;
    }
    const east=x>=20&&y>=20&&y<67;
    c.fillStyle=east?'#9a9275':'#86785c';c.fillRect(px,py,16,16);
    c.fillStyle=east?'#b9af8e':'#a89570';c.fillRect(px+1,py+1,14,14);
    c.fillStyle=east?'#d1c8a4':'#c1ad80';c.fillRect(px+3+(y%2)*4,py+4,7,2);
    if(grass(x,y)){
      c.fillStyle='#678753';c.fillRect(px,py,16,16);c.fillStyle='#91aa64';
      for(let i=2;i<15;i+=4){c.fillRect(px+i,py+4+(i%3),2,9);c.fillRect(px+i-1,py+4+(i%3),1,3);}
    }
  }
  // The eastern shortcut keeps the old gate footprint visible without reviving tolls.
  c.fillStyle='#777b70';c.fillRect(20*16,53*16,7*16,7*16);
  c.fillStyle='#a7a992';c.fillRect(20*16+4,53*16+4,7*16-8,7*16-8);
  c.fillStyle='#625f58';c.fillRect(21*16,53*16,3,7*16);c.fillRect(25*16+13,53*16,3,7*16);
  c.fillStyle='#c1b88e';c.fillRect(21*16,55*16,5*16,2);
  // Prop cells are blocked for interaction, but must not masquerade as trees.
  for(const prop of map.props){
    const px=prop.x*16,py=prop.y*16;
    c.fillStyle='#a89570';c.fillRect(px,py,16,16);
    if(prop.dialogue==='tourRoute43WaterRail'){
      c.fillStyle='#496f78';c.fillRect(px+1,py+1,14,14);
      c.fillStyle='#91bec0';c.fillRect(px+3,py+4,8,2);c.fillRect(px+6,py+10,7,1);
      c.fillStyle='#6d604b';c.fillRect(px,py+12,16,3);c.fillRect(px+1,py+8,2,8);c.fillRect(px+13,py+8,2,8);
    }else if(prop.dialogue==='tourRoute43GateTrace'){
      c.fillStyle='#5e6258';c.fillRect(px+1,py+5,14,11);
      c.fillStyle='#b7b8a1';c.fillRect(px+2,py+4,12,7);
      c.fillStyle='#858675';c.fillRect(px+4,py+7,8,1);
    }else{
      c.fillStyle='#60513e';c.fillRect(px+6,py+8,3,8);
      c.fillStyle='#665844';c.fillRect(px+1,py+2,14,9);
      c.fillStyle='#e0d3a4';c.fillRect(px+2,py+3,12,6);
      c.fillStyle='#817958';c.fillRect(px+4,py+5,8,1);
    }
  }
}
