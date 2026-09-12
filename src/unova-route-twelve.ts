import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';
export const UNOVA_ROUTE_TWELVE='tour_unova_route_12' as const;
type World={places:Place[];maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(r:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)r[j][i]='.';};
export function installUnovaRouteTwelve(w:World){const town=w.places.find(p=>p.id==='tour_lacunosa');if(!town)return;const city=w.maps[town.id],outside=w.outdoors[town.id];if(!city||!outside)return;
  const rows=Array.from({length:32},()=>Array<string>(72).fill('#'));open(rows,1,13,70,6);open(rows,12,7,18,6);open(rows,12,6,5,9);open(rows,38,18,18,6);open(rows,51,16,5,8);open(rows,28,10,12,12);
  const objects=[
    {name:'전원 초원 바람길',event:'tourRouteTwelveMeadow',cells:[{x:52,y:20}],pages:['보배마을 성벽을 벗어나 넓은 풀밭 바람이 지나가는 자리다.','야생 조우 구역으로 확인하기 전에는 길 밖의 풀을 관찰만 한다.']},
    {name:'동료 급수 쉼터',event:'tourRouteTwelveRest',cells:[{x:34,y:20}],pages:['긴 들길을 걷는 사람과 포켓몬을 위한 그늘과 물그릇이다.','HP 회복 시설은 아니며 실제 회복은 보배마을 센터에서 받는다.']},
    {name:'빌리지브리지 물소리 표지',event:'tourRouteTwelveBridgeSound',cells:[{x:15,y:9}],pages:['서쪽에서 물 흐르는 소리가 들리는 날의 바람 방향을 적었다.','빌리지브리지 MapId와 도착 워프는 아직 연결하지 않았다.']},
  ];for(const o of objects)for(const p of o.cells)rows[p.y][p.x]='#';
  w.maps[UNOVA_ROUTE_TWELVE]={id:UNOVA_ROUTE_TWELVE,name:'하나 12번도로',width:72,height:32,background:UNOVA_ROUTE_TWELVE,walkable:rows.map(r=>r.join('')),terrain:[],warps:[{x:70,y:15,to:town.id,spawn:{x:2,y:12},entry:'right',facing:'right'}],npcs:[{id:'routeTwelveWalker',name:'12번도로 들판 여행자',sprite:'ace_trainer_f',x:45,y:21,facing:'left',dialogue:'tourRouteTwelveWalker'}],props:[{x:65,y:11,dialogue:'tourRouteTwelveSign'},{x:6,y:11,dialogue:'tourRouteTwelveSign'},...objects.flatMap(o=>o.cells.map(p=>({...p,dialogue:o.event})))]};
  w.passagePlaces[UNOVA_ROUTE_TWELVE]={id:UNOVA_ROUTE_TWELVE,name:'하나 12번도로',region:'하나',theme:'forest',concept:'보배마을 성벽에서 넓은 전원 초원을 지나 빌리지브리지 방향으로 가는 들길',landmark:'전원 초원과 동료 쉼터',x:town.x-.5,y:town.y};w.spawns[UNOVA_ROUTE_TWELVE]={x:68,y:15};w.outdoors[UNOVA_ROUTE_TWELVE]={objects,signs:[{x:65,y:11,direction:'right',destination:town.id,name:'보배마을',event:'tourRouteTwelveSign',pages:['→ 보배마을','성벽 안뜰과 13번도로 방향이다.']},{x:6,y:11,direction:'left',destination:UNOVA_ROUTE_TWELVE,name:'빌리지브리지 방향 경계',event:'tourRouteTwelveSign',pages:['← 빌리지브리지 방향','다리 마을 MapId가 연결되기 전에는 서쪽 경계에서 돌아간다.']}]};
  for(let x=1;x<=13;x++)city.walkable[12]=city.walkable[12].slice(0,x)+'.'+city.walkable[12].slice(x+1);city.warps.push({x:1,y:12,to:UNOVA_ROUTE_TWELVE,spawn:{x:68,y:15},entry:'left',facing:'left'});
  const marker=outside.objects.find(o=>/12번도로/.test(o.name));if(marker)marker.pages=['서쪽은 하나 12번도로와 빌리지브리지 방향이다.','전원 초원과 동료 쉼터를 지나 서쪽 경계까지 왕복할 수 있다.'];outside.signs.push({x:4,y:25,direction:'left',destination:UNOVA_ROUTE_TWELVE,name:'하나 12번도로',event:'tourLacunosaSign',pages:['서쪽 → 하나 12번도로','전원 초원·빌리지브리지 방향이다.']});
}
export function paintUnovaRouteTwelve(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){const paths=new Set<string>(),fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';paintTourGround(c,images['town-reference'],px,py,'forest');if(walk)paths.add(x+','+y);else{fill(px,py,16,16,'#5c8050');fill(px+2,py+2,11,6,(x+y)%3?'#83a568':'#9ab475');}}paintTourPaths(c,images['town-reference'],paths,'forest');for(const [x,y]of [[52,20],[34,20],[15,9]]){fill(x*16+2,y*16+3,12,11,'#665844');fill(x*16+4,y*16+5,8,5,'#dfcf96');}}
