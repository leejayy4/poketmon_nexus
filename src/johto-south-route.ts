import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const JOHTO_ROUTE_33='tour_johto_route_33' as const;
export const UNION_CAVE_1F='tour_union_cave_1f' as const;
export const JOHTO_ROUTE_32='tour_johto_route_32' as const;
const COMPAT_ROUTE='tour_pass_violet_azalea' as const;
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const props=(objects:ObjectInfo[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

export function installJohtoSouthRoute(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  const azalea=world.places.find(p=>p.id==='tour_azalea')!,violet=world.places.find(p=>p.id==='tour_violet')!;
  const old=world.maps[COMPAT_ROUTE],azaleaExit=world.maps[azalea.id].warps.find(w=>w.to===COMPAT_ROUTE)!,violetExit=world.maps[violet.id].warps.find(w=>w.to===COMPAT_ROUTE)!;
  const oldAzalea=old.warps.find(w=>w.to===azalea.id)!,oldViolet=old.warps.find(w=>w.to===violet.id)!;

  const r33=Array.from({length:24},()=>Array<string>(48).fill('#'));
  const open33=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)r33[j][i]='.';};
  open33(1,10,46,5);open33(8,5,10,6);open33(8,5,4,5);open33(24,14,4,6);open33(24,17,13,3);open33(39,6,5,5);open33(36,6,7,3);
  const objects33:ObjectInfo[]=[
    {name:'33번도로 빗물 돌도랑',event:'tourRoute33Drain',cells:[{x:12,y:8}],pages:['숲에서 흘러온 빗물이 낮은 돌도랑을 따라 흐른다.\n비 연출과 전투 날씨 효과는 아직 별개다.']},
    {name:'고동마을 도착 표석',event:'tourRoute33AzaleaStone',cells:[{x:41,y:8}],pages:['동쪽 길 끝에 고동마을의 낮은 지붕이 보인다.\n서쪽은 연결동굴 1층 입구다.']},
    {name:'동굴 앞 우비 쉼터',event:'tourRoute33RainShelter',cells:[{x:27,y:18}],pages:['젖은 겉옷과 동료의 발을 닦을 수 있는 낮은 지붕이다.\n회복이 필요하면 고동마을 센터로 돌아갈 수 있다.']},
  ];
  for(const o of objects33)for(const c of o.cells)r33[c.y][c.x]='#';
  const signs33=[
    {x:8,y:8,direction:'left' as const,destination:UNION_CAVE_1F,name:'33번도로 서쪽 표지',event:'journeySign',pages:['← 연결동굴 1층 · 32번도로 · 도라지시티','짧은 빗길 뒤 동굴 통과층으로 들어간다.']},
    {x:42,y:8,direction:'right' as const,destination:azalea.id,name:'33번도로 동쪽 표지',event:'journeySign',pages:['→ 고동마을','규토리 공방과 포켓몬센터가 있는 숲 마을이다.']},
  ];
  for(const s of signs33)r33[s.y][s.x]='#';
  world.maps[JOHTO_ROUTE_33]={id:JOHTO_ROUTE_33,name:'성도 33번도로',width:48,height:24,background:JOHTO_ROUTE_33,walkable:r33.map(row=>row.join('')),warps:[
    {x:1,y:12,to:UNION_CAVE_1F,spawn:{x:52,y:24},entry:'left',facing:'left'},
    {x:46,y:12,to:azalea.id,spawn:{...oldAzalea.spawn},entry:'right',facing:oldAzalea.facing},
  ],npcs:[
    {id:'route33Traveler',name:'33번도로 여행자',sprite:'rancher',x:32,y:12,facing:'left',dialogue:'tourRoute33Traveler'},
    {id:'route33Pokemon',name:'빗물 도랑의 파치리스',sprite:'field-pachirisu',x:15,y:12,facing:'right',dialogue:'tourRoute33Pokemon'},
    {id:'route33Trainer',name:'33번도로 새잡이',sprite:'school_kid_m',x:35,y:18,facing:'left',dialogue:'tourRoute33Trainer'},
  ],props:[...signs33.map(s=>({x:s.x,y:s.y,dialogue:s.event})),...props(objects33)],terrain:[
    {kind:'tallGrass',x:9,y:6,w:7,h:3},{kind:'tallGrass',x:25,y:15,w:3,h:4},{kind:'tallGrass',x:37,y:6,w:5,h:2},
  ]};

  const cave=Array.from({length:48},()=>Array<string>(56).fill('#'));
  const openCave=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)cave[j][i]='.';};
  openCave(50,21,5,7);openCave(38,21,14,5);openCave(36,13,6,13);openCave(25,11,15,5);openCave(25,1,7,14);
  openCave(16,11,11,5);openCave(14,14,5,17);openCave(14,27,15,5);openCave(25,27,5,12);openCave(27,36,12,5);openCave(36,28,5,13); // optional lower loop
  const caveObjects:ObjectInfo[]=[
    {name:'연결동굴 지하수 홈',event:'tourUnionCaveWater',cells:[{x:17,y:22}],pages:['암반 아래 홈에 맑은 지하수가 고여 있다.\n현재 본선은 물을 건너지 않고 통과할 수 있다.']},
    {name:'겹쳐진 암반 곡선',event:'tourUnionCaveLayers',cells:[{x:38,y:18}],pages:['서로 다른 색의 암반층이 통로를 따라 굽어 있다.\n동쪽은 33번도로, 북쪽은 32번도로다.']},
    {name:'아래층 갈림 표식',event:'tourUnionCaveLowerMark',cells:[{x:29,y:38}],pages:['아래로 이어질 듯한 암반 틈에 출입 금지 표식이 있다.\n선택 B1F와 B2F는 아직 개통하지 않았다.']},
  ];
  for(const o of caveObjects)for(const c of o.cells)cave[c.y][c.x]='#';
  const caveSigns=[
    {x:49,y:20,direction:'right' as const,destination:JOHTO_ROUTE_33,name:'연결동굴 동쪽 안내',event:'journeySign',pages:['→ 33번도로 · 고동마을','밝아지는 동쪽 통로가 짧은 빗길로 이어진다.']},
    {x:32,y:5,direction:'up' as const,destination:JOHTO_ROUTE_32,name:'연결동굴 북쪽 안내',event:'journeySign',pages:['↑ 32번도로 · 도라지시티','통과층 북쪽 출구로 올라간다.']},
  ];
  for(const s of caveSigns)cave[s.y][s.x]='#';
  world.maps[UNION_CAVE_1F]={id:UNION_CAVE_1F,name:'연결동굴 · 1층 통과층',width:56,height:48,background:UNION_CAVE_1F,walkable:cave.map(row=>row.join('')),warps:[
    {x:54,y:24,to:JOHTO_ROUTE_33,spawn:{x:3,y:12},entry:'right',facing:'right'},
    {x:28,y:1,to:JOHTO_ROUTE_32,spawn:{x:18,y:92},entry:'up',facing:'up'},
  ],npcs:[
    {id:'unionCaveHiker',name:'연결동굴 산행객',sprite:'worker',x:33,y:13,facing:'left',dialogue:'tourUnionCaveHiker'},
    {id:'unionCavePokemon',name:'산행객의 알통몬',sprite:'field-machop',x:34,y:13,facing:'left',dialogue:'tourUnionCavePokemon'},
    {id:'unionCaveTrainer',name:'연결동굴 암반 트레이너',sprite:'worker',x:38,y:39,facing:'left',dialogue:'tourUnionCaveTrainer'},
  ],props:[...caveSigns.map(s=>({x:s.x,y:s.y,dialogue:s.event})),...props(caveObjects)],terrain:[
    {kind:'tallGrass',x:39,y:22,w:6,h:3},{kind:'tallGrass',x:26,y:12,w:7,h:3},{kind:'tallGrass',x:15,y:28,w:7,h:3},{kind:'tallGrass',x:28,y:37,w:8,h:3},
  ]};

  const r32=Array.from({length:96},()=>Array<string>(36).fill('#'));
  const open32=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)r32[j][i]='.';};
  open32(16,1,5,94);open32(8,11,9,4);open32(8,12,4,18);open32(10,27,7,4);open32(20,35,9,4);open32(25,36,4,18);open32(19,50,10,4);
  open32(7,59,10,4);open32(7,60,4,18);open32(9,74,8,4);open32(20,81,10,4);open32(27,82,4,9);open32(18,88,13,4);
  const objects32:ObjectInfo[]=[
    {name:'32번도로 절벽 전망',event:'tourRoute32Cliff',cells:[{x:10,y:20}],pages:['서쪽 절벽 아래로 긴 길과 물가가 함께 보인다.\n본선은 난간 안쪽을 따라 남북으로 이어진다.']},
    {name:'물가 관찰 부두',event:'tourRoute32Pier',cells:[{x:27,y:45}],pages:['낮은 나무 부두에서 물결과 포켓몬 흔적을 살핀다.\n낚시와 수상이동 기능은 아직 없다.']},
    {name:'동굴 전 휴게소 표지',event:'tourRoute32Rest',cells:[{x:9,y:68}],pages:['연결동굴에 들어가기 전 동료와 장비를 확인하는 쉼터다.\n치료 기능은 없으며 회복은 도시 센터에서 한다.']},
    {name:'도라지 남쪽 도착 표석',event:'tourRoute32VioletStone',cells:[{x:21,y:8}],pages:['북쪽으로 도라지시티의 전통 지붕이 보인다.\n남쪽은 연결동굴과 33번도로를 거쳐 고동마을로 이어진다.']},
  ];
  for(const o of objects32)for(const c of o.cells)r32[c.y][c.x]='#';
  const signs32=[
    {x:15,y:90,direction:'down' as const,destination:UNION_CAVE_1F,name:'32번도로 남쪽 표지',event:'journeySign',pages:['↓ 연결동굴 1층 · 33번도로 · 고동마을','동굴 본선은 지하 선택층을 거치지 않아도 통과할 수 있다.']},
    {x:15,y:5,direction:'up' as const,destination:violet.id,name:'32번도로 북쪽 표지',event:'journeySign',pages:['↑ 도라지시티','북쪽 큰길 끝이 도라지시티 남쪽 입구다.']},
  ];
  for(const s of signs32)r32[s.y][s.x]='#';
  world.maps[JOHTO_ROUTE_32]={id:JOHTO_ROUTE_32,name:'성도 32번도로',width:36,height:96,background:JOHTO_ROUTE_32,walkable:r32.map(row=>row.join('')),warps:[
    {x:18,y:94,to:UNION_CAVE_1F,spawn:{x:28,y:3},entry:'down',facing:'down'},
    {x:18,y:1,to:violet.id,spawn:{...oldViolet.spawn},entry:'up',facing:oldViolet.facing},
  ],npcs:[
    {id:'route32Traveler',name:'32번도로 여행자',sprite:'ace_trainer_f',x:18,y:56,facing:'down',dialogue:'tourRoute32Traveler'},
    {id:'route32Pokemon',name:'물가 여행자의 고라파덕',sprite:'field-psyduck',x:25,y:37,facing:'left',dialogue:'tourRoute32Pokemon'},
    {id:'route32Trainer',name:'32번도로 피크닉 트레이너',sprite:'pokemon_breeder_f',x:10,y:75,facing:'right',dialogue:'tourRoute32Trainer'},
  ],props:[...signs32.map(s=>({x:s.x,y:s.y,dialogue:s.event})),...props(objects32)],terrain:[
    {kind:'tallGrass',x:9,y:13,w:3,h:6},{kind:'tallGrass',x:21,y:36,w:7,h:3},{kind:'tallGrass',x:8,y:61,w:3,h:10},{kind:'tallGrass',x:21,y:82,w:8,h:3},
  ]};

  for(const [id,name,kind,landmark] of [[JOHTO_ROUTE_33,'성도 33번도로','road','빗물 돌도랑'],[UNION_CAVE_1F,'연결동굴 · 1층 통과층','cave','지하수와 암반 곡선'],[JOHTO_ROUTE_32,'성도 32번도로','road','절벽과 물가']] as const){
    world.passages[id]={id,a:azalea,b:violet,kind,bend:kind==='cave'?28:18};
    world.passagePlaces[id]={id,name,region:'성도',theme:kind==='cave'?'cave':'forest',concept:name+'을 지나 고동마을과 도라지시티를 잇는 남부 여행 본선',landmark,x:violet.x,y:(violet.y+azalea.y)/2};
    world.outdoors[id]={objects:id===JOHTO_ROUTE_33?objects33:id===UNION_CAVE_1F?caveObjects:objects32,signs:id===JOHTO_ROUTE_33?signs33:id===UNION_CAVE_1F?caveSigns:signs32};
  }
  world.spawns[JOHTO_ROUTE_33]={x:44,y:12};world.spawns[UNION_CAVE_1F]={x:52,y:24};world.spawns[JOHTO_ROUTE_32]={x:18,y:92};
  azaleaExit.to=JOHTO_ROUTE_33;azaleaExit.spawn={x:44,y:12};azaleaExit.facing='left';
  violetExit.to=JOHTO_ROUTE_32;violetExit.spawn={x:18,y:3};violetExit.facing='down';
}

export function paintJohtoSouthRoute(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const cave=map.id===UNION_CAVE_1F,paths=new Set<string>();
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    paintTourGround(c,images['town-reference'],px,py,cave?'cave':'forest');
    if(walk)paths.add(`${x},${y}`);
    else if(cave){fill(px,py,16,16,'#303a3e');fill(px+2,py+2,11,5,'#526064');if((x+y)%6===0)fill(px+9,py+8,4,3,'#718078');}
    else{fill(px,py,16,16,'#527653');fill(px+2,py+3,10,5,'#77956a');}
  }
  paintTourPaths(c,images['town-reference'],paths,cave?'cave':'forest');
  if(map.id===JOHTO_ROUTE_33){
    for(let x=2;x<46;x++){fill(x*16,15*16,16,5,'#627d67');if(x%3===0)fill(x*16+3,15*16+2,10,1,'#9bb8a6');}
    for(const [x,y] of [[12,8],[27,18]]){fill(x*16+2,y*16+11,12,3,'#719eac');fill(x*16+5,y*16+9,5,1,'#b4d4cf');}
  }else if(cave){
    for(const [x,y,w,h] of [[8,34,13,8],[3,18,9,12],[43,30,8,10]]){fill(x*16,y*16,w*16,h*16,'#273438');fill(x*16+5,y*16+8,w*16-10,5,'#46585b');}
    fill(5*16,18*16,5*16,10*16,'#477d88');for(let y=19;y<28;y+=2)fill(5*16+8,y*16,54,2,'#9ac4bd');
  }else{
    for(let y=12;y<82;y++){fill(2*16,y*16,5*16,16,'#5595a4');if(y%3===0)fill(3*16,y*16+6,42,1,'#b0d2ca');}
    for(let y=8;y<88;y+=8){fill(29*16,y*16,5*16,16,'#6c725f');fill(30*16,y*16+3,45,4,'#9b9272');}
    fill(24*16,38*16,5*16,15*16,'#8b7252');for(let y=39;y<52;y+=3)fill(24*16,y*16,80,2,'#c0a273');
  }
}
