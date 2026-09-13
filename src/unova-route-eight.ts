import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintWetlandGround } from './icirrus-wetland-art';
import { paintTallGrass } from './town';
import { TUBELINE_BRIDGE } from './unova-route-nine';

export const UNOVA_ROUTE_EIGHT='tour_unova_route_08' as const;
export const UNOVA_ROUTE_EIGHT_GRASS=[
  {kind:'tallGrass' as const,x:14,y:11,w:4,h:2},
  {kind:'tallGrass' as const,x:18,y:24,w:5,h:2},
];
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const openTile=(map:GameMap,x:number,y:number)=>{const row=map.walkable[y];map.walkable[y]=row.slice(0,x)+'.'+row.slice(x+1);};

export function installUnovaRouteEight(w:World){
  const city=w.places.find(place=>place.id==='tour_icirrus');if(!city)return;
  const bridge=w.maps[TUBELINE_BRIDGE],bridgeOutside=w.outdoors[TUBELINE_BRIDGE],cityMap=w.maps[city.id],cityOutside=w.outdoors[city.id];if(!bridge||!bridgeOutside||!cityMap||!cityOutside)return;
  const rows=Array.from({length:36},()=>Array<string>(64).fill('#'));
  open(rows,1,15,62,7);                          // city-to-bridge safe road
  open(rows,9,8,17,7);open(rows,9,8,5,12);open(rows,21,11,5,9); // northern marsh loop
  open(rows,33,5,13,10);open(rows,33,5,5,14);open(rows,41,10,5,9); // Moor overlook loop
  open(rows,16,22,14,7);open(rows,25,19,5,10);   // southern puddle loop
  // A short dry return from the northern habitat to the main road allows retreat after capture.
  open(rows,18,13,3,3);
  const objects=[
    {name:'비가 고인 습지',event:'tourRouteEightMarsh',cells:[{x:19,y:10}],pages:['비가 잦아 낮은 땅에 물이 고이고 마른 흙길이 그 사이를 돈다.','물가 대신 가운데 마른 길을 따라가면 설화시티와 다리로 돌아갈 수 있다.']},
    {name:'설화의 습지 방향 전망',event:'tourRouteEightMoor',cells:[{x:39,y:7}],pages:['북쪽 출구는 설화의 습지 남쪽 데크로 이어진다.','서쪽 갈대 순환로와 동쪽 물새 관찰로를 지나 같은 출구로 돌아올 수 있다.']},
    {name:'설화시티 동문 방향 경계',event:'tourRouteEightIcirrus',cells:[{x:5,y:22}],pages:['서쪽은 설화시티 동문 방향이다.','가운데 마른 본선으로 설화시티와 튜브라인브리지를 왕복할 수 있다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  w.maps[UNOVA_ROUTE_EIGHT]={id:UNOVA_ROUTE_EIGHT,name:'하나 8번도로',width:64,height:36,background:UNOVA_ROUTE_EIGHT,walkable:rows.map(row=>row.join('')),warps:[
    {x:62,y:18,to:TUBELINE_BRIDGE,spawn:{x:2,y:9},entry:'right',facing:'right'},
    {x:1,y:18,to:city.id,spawn:{x:cityMap.width-3,y:18},entry:'left',facing:'left'},
  ],terrain:UNOVA_ROUTE_EIGHT_GRASS,npcs:[
    {id:'routeEightGuide',name:'8번도로 우산 여행자',sprite:'pokemon_breeder_f',x:51,y:19,facing:'left',dialogue:'tourGuide'},
    {id:'routeEightTrainer',name:'8번도로 습지 트레이너',sprite:'rancher',x:23,y:13,facing:'left',dialogue:'tourRouteEightTrainer'},
  ],props:[
    {x:58,y:14,dialogue:'tourRouteEightSign'},
    ...objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event}))),
  ]};
  w.passagePlaces[UNOVA_ROUTE_EIGHT]={id:UNOVA_ROUTE_EIGHT,name:'하나 8번도로',region:'하나',theme:'water',concept:'튜브라인브리지에서 빗물 습지와 마른 우회로를 지나 설화시티 동문으로 향하는 길',landmark:'빗물 웅덩이와 습지 전망',x:3.5,y:1.5};
  w.spawns[UNOVA_ROUTE_EIGHT]={x:60,y:18};
  w.outdoors[UNOVA_ROUTE_EIGHT]={objects,signs:[
    {x:58,y:14,direction:'right',destination:TUBELINE_BRIDGE,name:'튜브라인브리지',event:'tourRouteEightSign',pages:['동쪽 → 튜브라인브리지 · 9번도로','철골 다리를 건너 쌍용시티로 돌아간다.']},
  ]};

  for(let x=1;x<=7;x++)openTile(bridge,x,9);
  bridge.warps.push({x:1,y:9,to:UNOVA_ROUTE_EIGHT,spawn:{x:60,y:18},entry:'left',facing:'left'});
  const boundary=bridgeOutside.objects.find(object=>object.name==='8번도로 방향 경계');
  if(boundary)boundary.pages=['서쪽은 하나 8번도로와 설화시티 방향이다.','빗물 습지의 마른 본선과 순환로를 지나 설화 동문 경계까지 갈 수 있다.'];
  bridgeOutside.signs.push({x:6,y:4,direction:'left',destination:UNOVA_ROUTE_EIGHT,name:'하나 8번도로',event:'tourTubelineSign',pages:['서쪽 → 하나 8번도로','빗물 습지·설화시티 방향이다.']});
  for(let x=cityMap.width-8;x<=cityMap.width-2;x++)openTile(cityMap,x,18);
  cityMap.warps.push({x:cityMap.width-2,y:18,to:UNOVA_ROUTE_EIGHT,spawn:{x:3,y:18},entry:'right',facing:'right'});
  cityOutside.signs.push({x:cityMap.width-7,y:14,direction:'right',destination:UNOVA_ROUTE_EIGHT,name:'하나 8번도로',event:'tourIcirrusSign',pages:['동쪽 → 하나 8번도로','튜브라인브리지·9번도로·쌍용시티 방향이다.']});
}

export function paintUnovaRouteEight(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  paintWetlandGround(c,map,false);
  // Raised materials distinguish the safe road, observation branch and battle turnout.
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(map.walkable[y]?.[x]!=='.'||map.terrain?.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h))continue;
    const main=y>=17&&y<=19;
    // The northern deck reaches the actual Moor warp at (39,5), including its approach.
    const branch=x>=33&&x<=37&&y>=7&&y<=16||x>=35&&x<=40&&y>=5&&y<=8;
    const cityBank=x>=1&&x<=7&&y>=16&&y<=20;
    const trainerApproach=x>=22&&x<=24&&y>=14&&y<=17;
    const turnout=x>=21&&x<=25&&y>=11&&y<=14;
    if(!main&&!branch&&!turnout&&!cityBank&&!trainerApproach)continue;
    const px=x*16,py=y*16;
    c.fillStyle=branch?'#b3a17c':turnout?'#c0b28b':'#b9b795';c.fillRect(px,py,16,16);
    c.fillStyle=branch?'#776d53':'#90997d';c.fillRect(px,py+(branch?11:15),16,1);
    if(branch){c.fillStyle='#d4c59d';c.fillRect(px,py+3,16,1);}
    if(turnout&&(x===21||x===25)){c.fillStyle='#e1d5aa';c.fillRect(px+7,py+4,2,8);}
    if(trainerApproach){c.fillStyle='#c0b28b';c.fillRect(px,py,16,16);c.fillStyle='#a09473';c.fillRect(px+3,py+10,3,1);}
    if(cityBank){
      c.fillStyle=x<=4?'#b7bba2':'#b0ac8d';c.fillRect(px,py,16,16);
      if(x===5||x===6)for(const offset of [3,8,13]){
        c.fillStyle='#d9d3b4';c.fillRect(px+offset,py,2,16);
        c.fillStyle='#7c8b78';c.fillRect(px+offset+2,py,1,16);
      }
      else {c.fillStyle='#8b9b87';c.fillRect(px,py+15,16,1);}
    }
  }
  for(const patch of map.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++)paintTallGrass(c,x*16,y*16,false,0,images['grass-reference']);
}

/** Rainwater glints and grass movement stay on the optional side loops. */
export function paintUnovaRouteEightMotion(c:CanvasRenderingContext2D,clock:number){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const drift=Math.round(Math.sin(clock*2.2)*2);
  for(const [x,y,phase] of [[16,6,0],[19,5,1],[39,3,1],[40,4,0],[22,30,0],[23,31,1]] as const){
    fill(x*16+3+drift*(phase?1:-1),y*16+7,9,1,phase?'#acd2d1':'#d4e6dd');
  }
  const sway=Math.sin(clock*3)>0?1:-1;
  for(const [x,y,phase] of [[14,11,0],[17,12,1],[18,24,1],[22,25,0]] as const){
    fill(x*16+5+(phase?sway:-sway),y*16+2,3,7,phase?'#668d68':'#7b9d70');
  }
}

