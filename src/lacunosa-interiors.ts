import type { GameMap,Point,Warp } from './types';
import type { TourInterior } from './explore-interiors';
type Floors=Record<string,{floor:number;total:number;title:string}>;
type Role={title:string;host:string;greeting:string[];objects:Array<[string,string]>};
const HOMES=['tour_lacunosa_home1','tour_lacunosa_home2'],HALLS=['tour_lacunosa_hall','tour_lacunosa_hall_2f','tour_lacunosa_hall_3f'];
const role=(title:string,host:string,greeting:string,objects:Array<[string,string]>):Role=>({title,host,greeting:[greeting],objects});
const ROLES:Record<string,Role>={
  tour_lacunosa_hall:role('마을 기록관 1층 · 성벽 생활 기록','마을 기록원','성벽과 공동 안뜰을 돌본 기록을 현재 생활과 오래된 이야기로 나누어 보관합니다.',[['성벽 점검 기록대','남쪽 문·돌담·귀환 표지의 상태와 함께 걸은 동료를 기록한다.'],['마을 생활 지도','남쪽 13번도로, 공동 안뜰, 센터와 서쪽 12번도로 경계를 표시했다.'],['층별 안내','1층 성벽 생활 · 2층 들판 자료\n3층 공동 돌봄 휴게']]),
  tour_lacunosa_hall_2f:role('마을 기록관 2층 · 들판 자료실','들판 기록원','13번도로 고지와 12번도로 방향 들판의 바람과 식생 자료를 비교합니다.',[['고지 바람 기록','해안의 습한 바람이 마른 들판 바람으로 바뀌는 시각을 적었다.'],['식재료 분류장','사람용·포켓몬용 허브와 열매의 건조 칸을 구분한 기록이다.'],['이야기 분류표','확인된 생활 기록과 전해 오는 이야기를 같은 사실로 섞지 않도록 나눴다.']]),
  tour_lacunosa_hall_3f:role('마을 기록관 3층 · 공동 돌봄 휴게실','안뜰 돌봄 도우미','사람과 포켓몬이 안뜰 일을 마치고 물을 마시며 쉬는 층입니다.',[['공동 돌봄 기록대','건강한 동료와 물그릇·그늘·통로를 살핀 기록을 남긴다.'],['낮은 급수대','몸집이 작은 포켓몬도 편히 마시도록 넓은 그릇을 놓았다.'],['귀환 수첩','남쪽 13번도로와 물결마을까지의 귀환 순서를 적었다.']]),
  tour_lacunosa_home1:role('성벽 관리인의 집 1층 · 도구방','성벽 관리인','남쪽 문과 오래된 돌담을 살핀 뒤 도구를 정리해요.',[['돌담 점검대','헐거운 돌과 통행로를 구분해 표시한 점검표다.'],['안전 표지 선반','사람과 포켓몬이 함께 볼 수 있는 낮은 귀환 표지를 보관한다.']]),
  tour_lacunosa_home1_2f:role('성벽 관리인의 집 2층 · 바람 기록방','관리인 가족','성벽 안팎의 바람 차이를 기록하는 방이에요.',[['바람 기록판','남쪽 문과 안뜰에서 잰 바람을 시간별로 비교했다.'],['동료 장비함','발 보호 천과 물통을 몸집별로 나누어 두었다.']]),
  tour_lacunosa_home1_3f:role('성벽 관리인의 집 3층 · 가족 휴게방','관리인 가족','13번도로 일을 마친 가족과 동료가 쉬는 층이에요.',[['남쪽 문 전망석','13번도로 도착 표석과 성벽 문을 함께 볼 수 있다.'],['동료 방석','긴 길을 걸은 포켓몬이 몸을 펴는 자리다.']]),
  tour_lacunosa_home2:role('건조 관리인의 집 1층 · 분류방','건조 관리인','들판에서 가져온 허브와 열매를 용도별로 나누는 방이에요.',[['식재료 분류대','사람용과 포켓몬용 재료를 다른 색 상자에 담았다.'],['건조 생활 책장','바람과 습도에 맞춘 건조 시간을 적은 책이 꽂혀 있다.']]),
  tour_lacunosa_home2_2f:role('건조 관리인의 집 2층 · 가족 부엌','관리인 가족','말린 재료를 확인하고 물과 식사를 준비해요.',[['밀폐 저장장','모래와 먼지가 들지 않도록 재료에 뚜껑을 덮었다.'],['낮은 식사대','작은 포켓몬도 편히 먹을 수 있는 낮은 자리다.']]),
  tour_lacunosa_home2_3f:role('건조 관리인의 집 3층 · 안뜰 휴게방','관리인 가족','안뜰을 바라보며 가족과 동료가 조용히 쉬어요.',[['차광 창가','강한 햇빛을 낮추는 얇은 커튼이 걸려 있다.'],['공동 안뜰 수첩','물그릇과 그늘을 맡은 이웃의 순번을 적었다.']]),
};
const ids=()=>['tour_lacunosa_center','tour_lacunosa_mart',...HOMES.flatMap(id=>[id,id+'_2f',id+'_3f']),...HALLS];
const size=(id:string):Point=>id==='tour_lacunosa_center'?{x:28,y:22}:id==='tour_lacunosa_mart'?{x:24,y:20}:id.startsWith('tour_lacunosa_hall')?{x:28,y:24}:{x:24,y:18};
const positions=(id:string):Point[]=>id.startsWith('tour_lacunosa_hall')?[{x:4,y:7},{x:19,y:7},{x:4,y:16}]:[{x:3,y:6},{x:17,y:6},{x:3,y:12},{x:17,y:12}];
function warps(id:string,map:GameMap,w:number,h:number,floors:Floors):Warp[]{const info=floors[id],s=w-5,c=Math.floor(w/2);return map.warps.map(x=>{const target=floors[x.to];if(!target)return {...x,x:c,y:h-1,spawn:{...x.spawn}};return target.floor>info.floor?{...x,x:s,y:8,spawn:{x:s,y:h-5}}:{...x,x:s,y:h-6,spawn:{x:s,y:9}};});}
export function installLacunosaInteriors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>,floors:Floors){
  for(const [id,r] of Object.entries(ROLES)){const map=maps[id],room=rooms[id];if(!map||!room)continue;room.title=r.title;room.greeting=r.greeting;room.objects.forEach((o,i)=>{if(r.objects[i]){o.name=r.objects[i][0];o.pages=[r.objects[i][1]];}});map.name='보배마을 · '+r.title;if(map.npcs[0])map.npcs[0].name=r.host;if(floors[id])floors[id].title=r.title;}
  if(rooms.tour_lacunosa_hall?.objects[0])rooms.tour_lacunosa_hall.objects[0].event='tourLacunosaWallLog';if(rooms.tour_lacunosa_hall_3f?.objects[0])rooms.tour_lacunosa_hall_3f.objects[0].event='tourLacunosaCourtyardCare';
  for(const id of ids()){const map=maps[id],room=rooms[id];if(!map||!room)continue;const {x:w,y:h}=size(id),c=Math.floor(w/2),upper=!!floors[id]&&floors[id].floor>1,rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=2&&x<=w-3&&y>=3&&y<=h-3?'.':'#'));if(!upper){rows[h-2][c]='.';rows[h-1][c]='.';}const ps=positions(id);room.objects.forEach((o,i)=>Object.assign(o,ps[i]??ps.at(-1)));room.host={x:c,y:id.endsWith('_center')||id.endsWith('_mart')?5:h-5};if(id.endsWith('_center')||id.endsWith('_mart'))room.reception={x:c-4,y:6,w:8,h:1};const props:GameMap['props']=[];if(room.reception)for(let y=room.reception.y;y<room.reception.y+room.reception.h;y++)for(let x=room.reception.x;x<room.reception.x+room.reception.w;x++){rows[y][x]='#';props.push({x,y,dialogue:id.endsWith('_mart')?'martClerk':'tourHost'});}for(const o of room.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}const ws=warps(id,map,w,h,floors);for(const x of ws)rows[x.y][x.x]='.';map.width=w;map.height=h;map.walkable=rows.map(r=>r.join(''));map.warps=ws;map.props=props;Object.assign(map.npcs[0],room.host);spawns[id]={x:c,y:h-4};}
  for(const w of maps.tour_lacunosa.warps){const spawn=spawns[w.to];if(spawn&&w.to.startsWith('tour_lacunosa_'))w.spawn={...spawn};}
}
