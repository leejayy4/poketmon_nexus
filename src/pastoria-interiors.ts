import type { GameMap,Point,Warp } from './types';
import type { Furnishing,TourInterior } from './explore-interiors';

type FloorInfo=Record<string,{floor:number;total:number;title:string}>;
const ids=()=>['tour_pastoria_center','tour_pastoria_hall','tour_pastoria_mart',...['tour_pastoria_home1','tour_pastoria_home2'].flatMap(id=>[id,id+'_2f',id+'_3f'])];
const size=(id:string):Point=>id.endsWith('_center')?{x:28,y:22}:id.endsWith('_hall')?{x:28,y:24}:id.endsWith('_mart')?{x:24,y:20}:{x:24,y:18};
const positions=(id:string):Point[]=>id.endsWith('_center')?[{x:4,y:8},{x:20,y:8},{x:4,y:15},{x:19,y:15}]:id.endsWith('_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16},{x:18,y:16}]:id.endsWith('_mart')?[{x:3,y:9},{x:18,y:9},{x:3,y:15},{x:16,y:15}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
const detail=(name:string,text:string,event:string):Furnishing=>({kind:'bench',name,pages:[text],x:0,y:0,w:3,h:2,event});
const additions:Record<string,Furnishing>={
  tour_pastoria_center:detail('습지 동료 건조석','젖은 발과 털을 닦을 마른 수건과 물이 있다.','pastoriaCenterDrying'),
  tour_pastoria_hall:detail('동료 습지 관찰 기록판','동료를 골라 얕은 습지와 동쪽 수로의 흔적을 비교한다.','pastoriaObservationDesk'),
  tour_pastoria_mart:detail('습지 여행 정리대','몬스터볼과 상처약, 마른 수건을 나눠 놓는 자리다.','pastoriaMartPacking'),
};
function warpLayout(id:string,map:GameMap,width:number,height:number,floors:FloorInfo):Warp[]{const info=floors[id],center=Math.floor(width/2),stairs=width-5;return map.warps.map(w=>{const target=floors[w.to];if(!target)return {...w,x:center,y:height-1};return target.floor>info.floor?{...w,x:stairs,y:8,spawn:{x:stairs,y:height-5}}:{...w,x:stairs,y:height-6,spawn:{x:stairs,y:9}};});}

export function installPastoriaInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:FloorInfo){
  for(const id of ids()){
    const map=maps[id],room=rooms[id];if(!map||!room)continue;
    if(additions[id])room.objects.push(additions[id]);
    if(id.includes('_home')){const floor=floors[id]?.floor??1,home=id.includes('home1')?'습지 관리인':'데크 목수';room.title=`${home} 공동주택 ${floor}층`;room.greeting=[floor===1?'젖은 장비와 동료의 발을 먼저 말리는 층이에요.':floor===2?'갈대와 나무 데크의 상태를 기록하는 층이에요.':'사람과 포켓몬이 함께 쉬며 습지를 바라보는 층이에요.'];room.objects.push(detail(floor===1?'장비 건조대':floor===2?'습지 작업 기록':'동료 전망 휴게석',floor===1?'장화와 수건을 동료 물품과 나눠 말린다.':floor===2?'갈대 높이와 데크 보수 위치를 날짜별로 적었다.':'얕은 습지와 동쪽 수로가 보이는 낮은 의자다.',`pastoriaHome${home}${floor}`));}
    const {x:width,y:height}=size(id),center=Math.floor(width/2),upper=Boolean(floors[id]&&floors[id].floor>1),rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
    if(!upper){rows[height-2][center]='.';rows[height-1][center]='.';}
    const ps=positions(id);room.objects.forEach((o,i)=>Object.assign(o,ps[i]??ps.at(-1)));
    room.host={x:center,y:id.endsWith('_center')||id.endsWith('_mart')?5:height-5};if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:center-4,y:6,w:8,h:1};
    const props:GameMap['props']=[];if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}for(const o of room.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}
    const warps=warpLayout(id,map,width,height,floors);for(const w of warps)rows[w.y][w.x]='.';map.width=width;map.height=height;map.walkable=rows.map(r=>r.join(''));map.warps=warps;map.props=props;Object.assign(map.npcs[0],room.host);spawns[id]={x:center,y:height-4};
  }
  for(const warp of maps.tour_pastoria.warps){const spawn=spawns[warp.to];if(spawn&&warp.to.startsWith('tour_pastoria_'))warp.spawn={...spawn};}
}
