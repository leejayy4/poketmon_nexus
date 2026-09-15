import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import type { TourInterior } from './explore-interiors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const UNOVA_ROUTE_NINE='tour_unova_route_09' as const;
export const TUBELINE_BRIDGE='tour_tubeline_bridge' as const;
export const SHOPPING_MALL_NINE='tour_unova_mall_nine_1f' as const;
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;rooms:Record<string,TourInterior>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const openTile=(map:GameMap,x:number,y:number)=>{const row=map.walkable[y];map.walkable[y]=row.slice(0,x)+'.'+row.slice(x+1);};

export function installUnovaRouteNine(w:World){
  const city=w.places.find(place=>place.id==='tour_opelucid');if(!city)return;
  const cityMap=w.maps[city.id],cityOutside=w.outdoors[city.id];if(!cityMap||!cityOutside)return;
  const route=Array.from({length:28},()=>Array<string>(56).fill('#'));
  open(route,1,11,54,8);                         // paved east-west main road
  open(route,21,4,14,7);open(route,25,3,6,10);   // Shopping Mall Nine frontage
  open(route,7,19,15,5);open(route,7,16,5,8);    // southern grass-side walk
  open(route,40,19,9,5);open(route,44,16,5,8);   // southeast rest loop
  const routeObjects=[
    {name:'쇼핑몰 나인 외부 접근부',event:'tourRouteNineMall',cells:[{x:27,y:6}],pages:['북쪽 건물 앞의 넓은 진입 광장이다.','쇼핑몰 공개 1층과 이어지며 판매 서비스와 도시 결빙 사건은 아직 적용하지 않았다.']},
    {name:'남쪽 숲 풀길',event:'tourRouteNineGrass',cells:[{x:16,y:21}],pages:['포장도로 아래 나무 사이로 굽은 선택 풀길이 이어진다.','치라미가 머무는 풀밭을 지나거나 바깥 흙길로 같은 포장 본선에 돌아간다.']},
    {name:'쌍용 서문 쉼터',event:'tourRouteNineRest',cells:[{x:46,y:21}],pages:['쌍용시티 서문을 앞둔 사람과 포켓몬이 쉬는 마른 공터다.','회복 시설은 아니며 실제 회복은 쌍용 포켓몬센터에서 받는다.']},
  ];
  for(const object of routeObjects)for(const cell of object.cells)route[cell.y][cell.x]='#';
  w.maps[UNOVA_ROUTE_NINE]={id:UNOVA_ROUTE_NINE,name:'하나 9번도로',width:56,height:28,background:UNOVA_ROUTE_NINE,walkable:route.map(row=>row.join('')),terrain:[{kind:'tallGrass',x:8,y:20,w:7,h:3},{kind:'tallGrass',x:17,y:20,w:4,h:3}],warps:[
    {x:54,y:14,to:city.id,spawn:{x:3,y:45},entry:'right',facing:'right'},
    {x:1,y:14,to:TUBELINE_BRIDGE,spawn:{x:77,y:9},entry:'left',facing:'left'},
    {x:28,y:4,to:SHOPPING_MALL_NINE,spawn:{x:18,y:25},entry:'up',facing:'up'},
  ],npcs:[
    {id:'routeNineGuide',name:'9번도로 안내원',sprite:'ace_trainer_f',x:37,y:15,facing:'left',dialogue:'tourGuide'},
    {id:'routeNineTrainer',name:'9번도로 라이더',sprite:'ace_trainer_m',x:24,y:15,facing:'right',dialogue:'tourRouteNineTrainer'},
    {id:'tourPokemon',name:'서문 쉼터의 콩둘기',sprite:'field-pidove',x:43,y:21,facing:'left',dialogue:'tourPokemon'},
  ],props:[
    {x:50,y:9,dialogue:'tourRouteNineSign'},{x:5,y:9,dialogue:'tourRouteNineSign'},
    ...routeObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event}))),
  ]};
  w.passagePlaces[UNOVA_ROUTE_NINE]={id:UNOVA_ROUTE_NINE,name:'하나 9번도로',region:'하나',theme:'forest',concept:'쌍용시티 서문에서 포장도로와 쇼핑몰 나인 외부를 지나 튜브라인브리지로 가는 숲길',landmark:'포장 본선과 쇼핑몰 나인 외부',x:city.x-1,y:city.y-.5};
  w.spawns[UNOVA_ROUTE_NINE]={x:52,y:14};
  w.outdoors[UNOVA_ROUTE_NINE]={objects:routeObjects,signs:[
    {x:50,y:9,direction:'right',destination:city.id,name:'쌍용시티',event:'tourRouteNineSign',pages:['동쪽 → 쌍용시티','서문을 지나 센터와 용의 역사관으로 돌아간다.']},
    {x:5,y:9,direction:'left',destination:TUBELINE_BRIDGE,name:'튜브라인브리지',event:'tourRouteNineSign',pages:['서쪽 → 튜브라인브리지','철골 보행교를 건너 8번도로 방향으로 간다.']},
  ]};

  const mall=Array.from({length:28},(_,y)=>Array.from({length:36},(_,x)=>x>=2&&x<34&&y>=3&&y<27?'.':'#'));
  for(const [x,y,wid,hei] of [[5,7,8,3],[23,7,8,3],[5,15,8,3],[23,15,8,3],[15,8,6,8]] as const)for(let j=y;j<y+hei;j++)for(let i=x;i<x+wid;i++)mall[j][i]='#';
  w.maps[SHOPPING_MALL_NINE]={id:SHOPPING_MALL_NINE,name:'쇼핑몰 나인 · 공개 1층',width:36,height:28,background:SHOPPING_MALL_NINE,walkable:mall.map(row=>row.join('')),terrain:[],warps:[
    {x:18,y:26,to:UNOVA_ROUTE_NINE,spawn:{x:28,y:6},entry:'down',facing:'down'},
  ],npcs:[{id:'mallNineGuide',name:'쇼핑몰 나인 안내원',sprite:'middle_aged_man',x:18,y:18,facing:'down',dialogue:'tourGuide'}],props:[
    {x:9,y:10,dialogue:'tourMallNineDeliveries'},{x:27,y:10,dialogue:'tourMallNineTravelGoods'},{x:9,y:18,dialogue:'tourMallNineRest'},{x:27,y:18,dialogue:'tourMallNineFloorBoard'},
  ]};
  w.rooms[SHOPPING_MALL_NINE]={style:'shop',title:'쇼핑몰 나인 공개 1층',host:{x:18,y:18},greeting:['9번도로 여행자와 화물 작업자가 함께 쓰는 공개 1층입니다.','판매 준비 전이므로 진열·하역·휴게 동선을 둘러볼 수 있습니다.'],objects:[
    {x:5,y:7,w:8,h:3,kind:'workbench',name:'입고 정리대',pages:['9번도로 하역선에서 들어온 상자를 통행선 밖에서 정리한다.'],event:'tourMallNineDeliveries'},
    {x:23,y:7,w:8,h:3,kind:'shelf',name:'여행용품 진열 구역',pages:['상품표가 덮여 있어 지금은 구입할 수 없다.'],event:'tourMallNineTravelGoods'},
    {x:5,y:15,w:8,h:3,kind:'bench',name:'동행 휴게 구역',pages:['사람과 포켓몬이 중앙 통행선을 비워 두고 쉬는 자리다.'],event:'tourMallNineRest'},
    {x:23,y:15,w:8,h:3,kind:'chart',name:'층별 준비 안내판',pages:['공개된 1층과 아직 열리지 않은 위층을 구분한다.'],event:'tourMallNineFloorBoard'},
  ]};
  w.passagePlaces[SHOPPING_MALL_NINE]={id:SHOPPING_MALL_NINE,name:'쇼핑몰 나인 · 공개 1층',region:'하나',theme:'city',concept:'9번도로의 보행선과 하역선이 이어지는 공개 실내',landmark:'진열·하역·휴게 구역',x:city.x-1,y:city.y-.7};
  w.spawns[SHOPPING_MALL_NINE]={x:18,y:25};

  const bridge=Array.from({length:18},()=>Array<string>(80).fill('#'));
  open(bridge,1,7,78,5);open(bridge,10,5,8,9);open(bridge,61,5,8,9);
  const bridgeObjects=[
    {name:'서쪽 철골 점검대',event:'tourTubelineWestFrame',cells:[{x:16,y:6}],pages:['8번도로 쪽 철골과 보행 통로의 떨림을 비교하는 자리다.','선로 안으로 들어가지 않고 마른 통로에서 살핀다.']},
    {name:'동쪽 철골 점검대',event:'tourTubelineEastFrame',cells:[{x:64,y:6}],pages:['9번도로 쪽 철골과 보행 통로의 떨림을 비교하는 자리다.','서쪽 기록과 맞추면 다리를 건넌 순서를 확인할 수 있다.']},
    {name:'8번도로 방향 경계',event:'tourTubelineWest',cells:[{x:4,y:13}],pages:['서쪽은 하나 8번도로와 설화시티 방향이다.','8번도로 MapId와 출구가 적용되기 전에는 이 다리에서 9번도로로 돌아간다.']},
  ];
  for(const object of bridgeObjects)for(const cell of object.cells)bridge[cell.y][cell.x]='#';
  w.maps[TUBELINE_BRIDGE]={id:TUBELINE_BRIDGE,name:'튜브라인브리지',width:80,height:18,background:TUBELINE_BRIDGE,walkable:bridge.map(row=>row.join('')),terrain:[],warps:[
    {x:78,y:9,to:UNOVA_ROUTE_NINE,spawn:{x:3,y:14},entry:'right',facing:'right'},
  ],npcs:[{id:'tubelineGuide',name:'튜브라인브리지 점검원',sprite:'worker',x:41,y:10,facing:'left',dialogue:'tourGuide'}],props:[
    {x:73,y:5,dialogue:'tourTubelineSign'},
    ...bridgeObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event}))),
  ]};
  w.passagePlaces[TUBELINE_BRIDGE]={id:TUBELINE_BRIDGE,name:'튜브라인브리지',region:'하나',theme:'city',concept:'9번도로와 8번도로 사이의 철골 보행교',landmark:'철골과 열차선',x:city.x-1.5,y:city.y-.5};
  w.spawns[TUBELINE_BRIDGE]={x:76,y:9};
  w.outdoors[TUBELINE_BRIDGE]={objects:bridgeObjects,signs:[
    {x:73,y:5,direction:'right',destination:UNOVA_ROUTE_NINE,name:'하나 9번도로',event:'tourTubelineSign',pages:['동쪽 → 하나 9번도로 · 쌍용시티','포장도로와 쇼핑몰 나인 외부를 지난다.']},
  ]};

  for(let x=1;x<=8;x++)openTile(cityMap,x,45);
  cityMap.warps.push({x:1,y:45,to:UNOVA_ROUTE_NINE,spawn:{x:52,y:14},entry:'left',facing:'left'});
  cityOutside.signs.push({x:4,y:42,direction:'left',destination:UNOVA_ROUTE_NINE,name:'하나 9번도로',event:'tourOpelucidSign',pages:['서쪽 → 하나 9번도로','쇼핑몰 나인 외부·튜브라인브리지 방향이다.']});
}

export function paintUnovaRouteNine(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    paintTourGround(c,images['town-reference'],px,py,map.id===TUBELINE_BRIDGE?'city':'forest');
    if(walk)paths.add(`${x},${y}`);else if(map.id===TUBELINE_BRIDGE){fill(px,py,16,16,(x+y)%2?'#485463':'#596675');fill(px+2,py+6,12,3,'#94a6b4');}else{fill(px,py,16,16,'#4f7148');fill(px+2,py+2,12,8,(x+y)%3?'#749060':'#879d6d');}
  }
  paintTourPaths(c,images['town-reference'],paths,map.id===TUBELINE_BRIDGE?'city':'forest');
  if(map.id===TUBELINE_BRIDGE)for(let x=2;x<78;x+=6){fill(x*16,5*16,3,9*16,'#35414e');fill(x*16,12*16,3,2*16,'#778896');}
  else{fill(25*16,3*16,6*16,4*16,'#747c8e');fill(26*16,4*16,4*16,2*16,'#c6d4dc');}
}

/** Structural signal pulses on the bridge and small roadside motion on Route 9. */
export function paintUnovaRouteNineMotion(c:CanvasRenderingContext2D,mapId:string,clock:number){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  if(mapId===TUBELINE_BRIDGE){
    const pulse=Math.sin(clock*2.4)>0;
    for(const x of [16,40,64]){fill(x*16+5,5*16+4,6,3,pulse?'#d9bb6c':'#786e58');fill(x*16+7,5*16+7,2,5,'#4c5861');}
    const shift=Math.round(Math.sin(clock*3));
    for(const x of [11,29,47,65])fill(x*16+3+shift,11*16+6,18,1,'#9fb1b7');
    return;
  }
  if(mapId!==UNOVA_ROUTE_NINE)return;
  const sway=Math.sin(clock*2.6)>0?1:-1;
  for(const [x,y,phase] of [[8,18,0],[12,17,1],[41,18,1],[48,17,0]] as const){fill(x*16+5+(phase?sway:-sway),y*16+1,5,9,phase?'#739269':'#65835d');fill(x*16+3,y*16+3,10,4,'#88a274');}
  const mallOn=Math.sin(clock*1.4)>-.2;
  for(const x of [26,28,30])fill(x*16+5,4*16+5,6,3,mallOn?'#c8dde0':'#74858d');
}
