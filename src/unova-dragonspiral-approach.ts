import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const DRAGONSPIRAL_APPROACH='tour_dragonspiral_approach' as const;
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
const openTile=(map:GameMap,x:number,y:number)=>{const row=map.walkable[y];map.walkable[y]=row.slice(0,x)+'.'+row.slice(x+1);};

export function installDragonspiralApproach(w:World){
  const city=w.places.find(place=>place.id==='tour_icirrus'),tower=w.places.find(place=>place.id==='tour_dragonspiral');if(!city||!tower)return;
  const cityMap=w.maps[city.id],towerMap=w.maps[tower.id],cityOutside=w.outdoors[city.id],towerOutside=w.outdoors[tower.id];if(!cityMap||!towerMap||!cityOutside||!towerOutside)return;
  const rows=Array.from({length:40},()=>Array<string>(48).fill('#'));
  open(rows,21,1,7,38);                         // dry north-south path
  open(rows,10,25,14,7);open(rows,10,18,7,14); // Icirrus-side wetland overlook loop
  open(rows,25,9,14,8);open(rows,33,14,6,12);  // tower moat overlook loop
  open(rows,18,4,13,8);                        // tower forecourt
  const objects=[
    {name:'설화 북문 귀환 표석',event:'tourDragonspiralIcirrusStone',cells:[{x:19,y:32}],pages:['남쪽은 설화시티 북문이다.','도시 동쪽 문에서 하나 8번도로·튜브라인브리지·9번도로·쌍용시티까지 돌아갈 수 있다.']},
    {name:'탑 해자 관찰 데크',event:'tourDragonspiralMoat',cells:[{x:35,y:12}],pages:['용나선탑 둘레의 물과 오래된 돌기단을 마른 데크에서 살핀다.','수상 이동이나 해자 횡단은 적용하지 않았으며 중앙 접근로로 탑 입구에 닿는다.']},
    {name:'용나선탑 남쪽 문',event:'tourDragonspiralGate',cells:[{x:24,y:6}],pages:['북쪽은 용나선탑 기슭으로 이어진다.','현재 탑의 기존 전시층과 궐수 귀환 통로는 보존되어 있다. 전설 사건이나 포획은 이 문에서 시작하지 않는다.']},
  ];
  for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
  w.maps[DRAGONSPIRAL_APPROACH]={id:DRAGONSPIRAL_APPROACH,name:'용나선탑 남쪽 접근로',width:48,height:40,background:DRAGONSPIRAL_APPROACH,walkable:rows.map(row=>row.join('')),terrain:[],warps:[
    {x:24,y:38,to:city.id,spawn:{x:24,y:3},entry:'down',facing:'down'},
    {x:24,y:1,to:tower.id,spawn:{x:28,y:45},entry:'up',facing:'up'},
  ],npcs:[{id:'dragonspiralApproachKeeper',name:'용나선 접근로 관리인',sprite:'rancher',x:28,y:27,facing:'left',dialogue:'tourGuide'}],props:objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))};
  w.passagePlaces[DRAGONSPIRAL_APPROACH]={id:DRAGONSPIRAL_APPROACH,name:'용나선탑 남쪽 접근로',region:'하나',theme:'water',concept:'설화시티 북문에서 습지 가장자리와 탑 해자를 지나 용나선탑 기슭으로 가는 길',landmark:'해자 관찰 데크와 탑 남문',x:3.5,y:.5};
  w.spawns[DRAGONSPIRAL_APPROACH]={x:24,y:36};
  w.outdoors[DRAGONSPIRAL_APPROACH]={objects,signs:[]};
  for(let y=1;y<=7;y++)openTile(cityMap,26,y);
  cityMap.warps.push({x:26,y:1,to:DRAGONSPIRAL_APPROACH,spawn:{x:24,y:36},entry:'up',facing:'up'});
  cityOutside.signs.push({x:27,y:4,direction:'up',destination:DRAGONSPIRAL_APPROACH,name:'용나선탑 접근로',event:'tourIcirrusNorthSign',pages:['북쪽 → 용나선탑 남쪽 접근로','습지 가장자리와 해자 관찰 데크를 지나 탑 기슭으로 간다. 도로 번호는 없다.']});
  openTile(towerMap,28,46);
  towerMap.warps.push({x:28,y:46,to:DRAGONSPIRAL_APPROACH,spawn:{x:24,y:3},entry:'down',facing:'down'});
  towerOutside.signs.push({x:31,y:42,direction:'down',destination:DRAGONSPIRAL_APPROACH,name:'설화시티',event:'tourDragonspiralSouthSign',pages:['남쪽 → 용나선탑 접근로 · 설화시티','도로 번호 없는 북문 접근로로 8번도로까지 돌아간다.']});
}

export function paintDragonspiralApproach(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';paintTourGround(c,images['town-reference'],px,py,'water');if(walk)paths.add(`${x},${y}`);else{fill(px,py,16,16,(x+y)%3?'#58776d':'#66867b');fill(px+2,py+3,12,8,'#7da0a0');}}
  paintTourPaths(c,images['town-reference'],paths,'water');
  for(const [x,y,w,h]of [[11,19,5,10],[34,15,4,10]] as const){fill(x*16,y*16,w*16,h*16,'#688fa0');fill(x*16+3,y*16+3,w*16-6,h*16-6,'#8ab1bb');}
}

/** Water glints below and staggered wind strokes above make the tower approach feel exposed. */
export function paintDragonspiralApproachMotion(c:CanvasRenderingContext2D,clock:number){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const drift=Math.round(Math.sin(clock*2)*2);
  for(const [x,y,phase] of [[12,21,0],[14,26,1],[35,17,1],[36,22,0]] as const)fill(x*16+3+drift*(phase?1:-1),y*16+8,9,1,phase?'#b5d6d2':'#d7e8df');
  const travel=Math.floor(clock*18)%96;
  for(const [x,y,length,phase] of [[18,8,20,0],[27,12,27,32],[20,30,17,64]] as const){
    const dx=(travel+phase)%96;fill(x*16+dx,y*16,Math.max(4,length-dx/10),1,'#dce8df');
  }
}
