import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintWetlandGround } from './icirrus-wetland-art';
import { paintIcirrusMoorPaths } from './icirrus-moor-path-art';
import { UNOVA_ROUTE_EIGHT } from './unova-route-eight';

export const ICIRRUS_MOOR='tour_icirrus_moor' as const;
// Project landmarks on existing blocked banks; never consume a walking or encounter tile.
const STUMPS=[{x:7,y:28,event:'tourIcirrusMoorWestStump'},{x:41,y:23,event:'tourIcirrusMoorEastStump'}];
type World={maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const openTile=(map:GameMap,x:number,y:number)=>{const row=map.walkable[y];map.walkable[y]=row.slice(0,x)+'.'+row.slice(x+1);};

export function installIcirrusMoor(w:World){
  const route=w.maps[UNOVA_ROUTE_EIGHT],routeOutside=w.outdoors[UNOVA_ROUTE_EIGHT];if(!route||!routeOutside)return;
  const rows=Array.from({length:48},()=>Array<string>(56).fill('#'));
  open(rows,25,1,7,46);                         // dry central boardwalk
  open(rows,8,33,21,7);open(rows,8,18,7,20);open(rows,13,18,17,6); // western reed loop
  open(rows,29,27,19,7);open(rows,42,14,7,18);open(rows,29,12,18,7); // eastern waterfowl loop
  open(rows,19,7,18,8);                         // northern observation rise
  const habitat=[{kind:'tallGrass' as const,x:8,y:27,w:3,h:5}];
  const objects=[
    ...STUMPS.map((p,index)=>({name:index===0?'서쪽 이끼 그루터기':'동쪽 갈라진 그루터기',event:p.event,cells:[{x:p.x,y:p.y}],pages:[index===0?'이끼 그루터기 옆 풀숲에서는 야생 포켓몬을 만날 수 있다. 풀숲 동쪽 마른 길로 돌아갈 수도 있다.':'갈라진 그루터기 동쪽 길을 따라 북쪽 물새 관찰 데크로 간다.']})),
    {name:'8번도로 귀환 데크',event:'tourIcirrusMoorRoute8',cells:[{x:21,y:39}],pages:['남쪽은 하나 8번도로 북쪽 분기다.','마른 데크를 따라 튜브라인브리지 또는 설화시티로 돌아갈 수 있다.']},
    {name:'갈대 수위 말뚝',event:'tourIcirrusMoorReeds',cells:[{x:12,y:20}],pages:['갈대 아래 물높이를 계절별 눈금과 비교한다.','현재 계절·날씨 변화와 결빙 이동 효과는 적용하지 않았다.']},
    {name:'물새 관찰 데크',event:'tourIcirrusMoorBirds',cells:[{x:45,y:16}],pages:['물가를 건드리지 않고 데크 위에서 날개 자국과 먹이 흔적을 살핀다.','생활 흔적 관찰이며 야생 조우·포획은 일어나지 않는다.']},
    {name:'북쪽 습지 전망대',event:'tourIcirrusMoorNorth',cells:[{x:28,y:9}],pages:['넓은 습지의 물길이 갈대밭 사이로 갈라졌다 다시 모인다.','북쪽 추가 출구는 없으며 두 순환로 모두 남쪽 본선으로 돌아온다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  w.maps[ICIRRUS_MOOR]={id:ICIRRUS_MOOR,name:'설화의 습지',width:56,height:48,background:ICIRRUS_MOOR,walkable:rows.map(row=>row.join('')),terrain:habitat,warps:[{x:28,y:46,to:UNOVA_ROUTE_EIGHT,spawn:{x:39,y:6},entry:'down',facing:'down'}],npcs:[{id:'icirrusMoorKeeper',name:'습지 관찰원',sprite:'pokemon_breeder_f',x:31,y:36,facing:'left',dialogue:'tourGuide'}],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  w.passagePlaces[ICIRRUS_MOOR]={id:ICIRRUS_MOOR,name:'설화의 습지',region:'하나',theme:'water',concept:'8번도로 북쪽에서 마른 데크를 따라 갈대 수위와 물새 흔적을 살피는 선택 습지',landmark:'갈대 수위 말뚝과 물새 관찰 데크',x:3.7,y:1.2};
  w.spawns[ICIRRUS_MOOR]={x:28,y:44};w.outdoors[ICIRRUS_MOOR]={objects,signs:[]};
  openTile(route,39,5);route.warps.push({x:39,y:5,to:ICIRRUS_MOOR,spawn:{x:28,y:44},entry:'up',facing:'up'});
  routeOutside.signs.push({x:43,y:8,direction:'up',destination:ICIRRUS_MOOR,name:'설화의 습지',event:'tourRouteEightMoorSign',pages:['북쪽 → 설화의 습지','마른 데크의 서쪽 갈대 순환로와 동쪽 물새 관찰로를 지나 같은 분기로 돌아온다.']});
  const outlook=routeOutside.objects.find(object=>object.name==='설화의 습지 방향 전망');if(outlook)outlook.pages=['북쪽은 독립 장소 설화의 습지로 이어진다.','전망 옆 북쪽 출구에서 들어가 마른 데크 두 순환로를 살핀 뒤 8번도로로 돌아올 수 있다.'];
}

export function paintIcirrusMoor(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  paintWetlandGround(c,map,true);
  paintIcirrusMoorPaths(c,map);
  const r=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(const stump of STUMPS){
    if(map.walkable[stump.y]?.[stump.x]!=='#')continue;
    const x=stump.x*16,y=stump.y*16;
    r(x+1,y+12,14,3,'#526b60');r(x+3,y+5,10,9,'#715c47');
    r(x+5,y+7,2,6,'#a38a63');r(x+10,y+7,2,7,'#4f493c');
    r(x+2,y+3,12,5,'#c5ad79');r(x+4,y+4,8,3,'#8f7755');r(x+6,y+5,4,1,'#d8c18c');
    if(stump.event==='tourIcirrusMoorWestStump'){r(x+1,y+9,5,3,'#7c985f');r(x+3,y+7,3,2,'#9bae73');}
    else {r(x+8,y+3,2,5,'#4f493c');r(x+10,y+3,2,2,'#4f493c');}
  }
  for(const prop of map.props){
    // Show a real adjacent investigation surface rather than a second, decorative station.
    const approach=[{x:prop.x,y:prop.y+1},{x:prop.x,y:prop.y-1},{x:prop.x-1,y:prop.y},{x:prop.x+1,y:prop.y}].find(p=>map.walkable[p.y]?.[p.x]==='.'&&!map.npcs.some(n=>n.x===p.x&&n.y===p.y));
    if(approach&&!map.terrain?.some(p=>approach.x>=p.x&&approach.x<p.x+p.w&&approach.y>=p.y&&approach.y<p.y+p.h)){const x=approach.x*16,y=approach.y*16;r(x+1,y+2,14,12,'#c7b78e');r(x+2,y+5,12,1,'#82765b');r(x+2,y+10,12,1,'#82765b');}
    if(prop.dialogue==='tourIcirrusMoorRoute8'){
      const x=prop.x*16,y=prop.y*16;r(x+5,y+1,6,14,'#58715d');r(x+1,y+1,14,9,'#d1c69a');
      r(x+6,y+2,3,4,'#456c60');r(x+4,y+5,7,2,'#456c60');r(x+6,y+7,3,2,'#456c60');
    }
  }
  const exit=map.warps.find(w=>w.to===UNOVA_ROUTE_EIGHT);
  if(exit)for(let step=1;step<=3;step++){
    const x=exit.x,y=exit.y-step;if(map.walkable[y]?.[x]!=='.')continue;
    r(x*16+7,y*16+4,2,6,'#e0cda0');r(x*16+5,y*16+8,6,2,'#e0cda0');r(x*16+7,y*16+10,2,2,'#e0cda0');
  }
}

/** Independent water, reed and distant-bird loops give the optional wetland a living rhythm. */
export function paintIcirrusMoorMotion(c:CanvasRenderingContext2D,clock:number,map?:GameMap,birdsObserved=false){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const ripple=Math.round(Math.sin(clock*1.9)*3);
  for(const [x,y,phase] of [[17,26,0],[21,30,1],[35,21,1],[39,24,0],[18,41,1],[39,38,0],[43,41,1]] as const){
    fill(x*16+2+ripple*(phase?1:-1),y*16+8,11,1,phase?'#acd0cf':'#d3e5dd');
  }
  const sway=Math.sin(clock*2.6)>0?1:-1;
  for(const [x,y,phase] of [[9,20,0],[12,24,1],[10,31,0],[44,15,1],[46,21,0],[43,29,1]] as const){
    const edge=map?[{x:x-1,y},{x:x+1,y},{x,y:y-1},{x,y:y+1}].find(p=>map.walkable[p.y]?.[p.x]==='#'&&!map.props.some(prop=>prop.x===p.x&&prop.y===p.y)):undefined;
    if(!edge)continue;
    fill(edge.x*16+5+(phase?sway:-sway),edge.y*16+5,4,9,'#6f9274');fill(edge.x*16+4+(phase?sway:-sway),edge.y*16+3,6,3,phase?'#b7aa79':'#c8b986');
  }
  const birdX=31*16+(Math.floor(clock*9)%70),birdY=10*16+Math.round(Math.sin(clock*3)*3);
  fill(birdX,birdY,4,1,'#465b60');fill(birdX-2,birdY-1,2,1,'#465b60');fill(birdX+4,birdY-1,2,1,'#465b60');
  if(birdsObserved){
    // Small distant silhouettes trace the observed northern direction, not new encounters.
    const progress=(clock*.045)%1;
    for(let i=0;i<3;i++){
      const x=Math.round((46-progress*10)*16+i*10),y=Math.round((18-progress*9)*16+i*5);
      const wing=Math.sin(clock*5+i)>0?-2:0;
      fill(x,y,3,2,'#435d60');fill(x-3,y+wing,3,1,'#435d60');fill(x+3,y+wing,3,1,'#435d60');
    }
  }
}
