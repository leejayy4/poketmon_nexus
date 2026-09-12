import { COMPACT_PLACES,expandedSigns } from './explore-expansion';
import type { Place,TourFeature } from './explore-world';
import type { Direction,GameMap,Point } from './types';
import { ILEX_FOREST_EAST } from './ilex-forest-layout';

export interface OutdoorObject { name:string; pages:string[]; event:string; cells:Point[] }
export interface TourSign extends Point { direction:Direction; destination:string; name:string; event:string; pages:string[] }
export interface TourOutdoors { objects:OutdoorObject[]; signs:TourSign[] }
const arrows:Record<Direction,string>={up:'↑ 북쪽',down:'↓ 남쪽',left:'← 서쪽',right:'→ 동쪽'};
function description(p:Place,f:TourFeature):[string,string]{
  if(f.name&&f.description)return [f.name,f.description];
  if(f.kind==='fountain')return p.theme==='snow'?['얼어붙은 분수','분수 가장자리에 얇은 얼음이 맺혔다.\n눈 위에 햇빛이 반짝인다.']:['광장 분수','작은 물줄기가 광장 가운데 솟는다.\n여행자가 쉬어 가기 좋은 자리다.'];
  if(f.kind==='water')return p.theme==='port'?['항구 관찰 데크','나무 데크 아래로 물결이 밀려온다.\n멀리 정박한 배가 보인다.']:p.theme==='coast'?['해변 물가','밝은 모래 옆으로 맑은 물이 흐른다.\n바닷바람에 짠 냄새가 실려 온다.']:['호수와 습지','잔잔한 수면 아래 수초가 보인다.\n물가에서 조용히 풍경을 바라본다.'];
  if(f.kind==='runway')return ['활주로 모형','흰 유도선 옆에 작은 비행기가 있다.\n공항 터미널에서 모형도 살펴보자.'];
  if(f.kind==='grove')return ['숲의 나무','빽빽한 나뭇잎 사이로 빛이 스민다.\n짧은 숲길에 잎 스치는 소리가 난다.'];
  if(f.kind==='rocks')return p.theme==='mine'?['광석과 운반 레일','광석 더미 옆으로 레일이 놓여 있다.\n전시관에서 광산의 구조를 볼 수 있다.']:p.theme==='dragon'?['푸른 암반','푸른 결이 남은 돌들이 모여 있다.\n용의 문양을 닮은 무늬가 보인다.']:p.theme==='desert'?['모래 속 유적석','바람이 돌 표면에 모래를 쌓아 놓았다.\n모서리에 오래된 자국이 남아 있다.']:['동굴 암반','서늘한 돌벽에 물기가 맺혀 있다.\n통로를 따라 다른 마을로 이어진다.'];
  if(p.theme==='fair')return ['관람차 광장','색색의 객실이 둥글게 늘어서 있다.\n놀이공원 안내소에서 모형을 보자.'];
  if(p.theme==='ghost')return ['추모 정원','조용한 정원에 작은 비석이 서 있다.\n곁에 놓인 꽃이 바람에 흔들린다.'];
  if(p.theme==='snow')return ['눈꽃 정원','눈이 작은 기둥과 화단을 덮었다.\n발자국 너머로 신전이 보인다.'];
  return ['마을 정원','꽃과 잎을 정성스럽게 가꾼 화단이다.\n마을의 작은 쉼터가 되어 준다.'];
}

export function prepareTourOutdoors(p:Place,map:GameMap,features:TourFeature[],short:boolean,lookup:(id:string)=>Place|undefined):TourOutdoors {
  const rows=map.walkable.map(r=>r.split(''));
  const props:GameMap['props']=[];
  const details=short?(p.theme==='cave'||p.theme==='desert'?[{x:4,y:5,w:2,h:2,kind:'rocks' as const},{x:14,y:12,w:2,h:2,kind:'rocks' as const}]:[{x:1,y:5,w:1,h:3,kind:'grove' as const}]):features;
  // Keep the original short-trail investigation IDs before additional scenery.
  const objects=(short?[...details,...features]:details).map((f,i)=>{
    const cells:Point[]=[];
    for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)if(x===f.x||x===f.x+f.w-1||y===f.y||y===f.y+f.h-1)cells.push({x,y});
    const [name,text]=description(p,f),event='tourOutdoor'+i;
    props.push(...cells.map(point=>({...point,dialogue:event})));
    return {name,pages:[text],event,cells};
  });
  const slots:Record<Direction,Point>=p.id==='tour_ilex'?{up:{x:12,y:4},right:{x:ILEX_FOREST_EAST.spawn.x-1,y:ILEX_FOREST_EAST.spawn.y-2},down:{x:12,y:14},left:{x:3,y:7}}:short?{up:{x:12,y:4},right:{x:16,y:7},down:{x:12,y:14},left:{x:3,y:7}}:{up:{x:16,y:4},right:{x:24,y:11},down:{x:16,y:20},left:{x:3,y:10}};
  const signs=map.warps.filter(w=>lookup(w.to)||w.to==='town').map((w,i)=>{
    const point=(!COMPACT_PLACES.has(p.id)?expandedSigns(p):slots)[w.entry],dest=lookup(w.to),name=dest?.name??'새잎마을';
    if(rows[point.y][point.x]!=='.'||map.npcs.some(n=>n.x===point.x&&n.y===point.y))throw Error('Blocked tour sign '+p.id);
    rows[point.y][point.x]='#';const event='tourExit'+i;props.push({...point,dialogue:event});
    const transport=dest&&dest.region!==p.region?(['tour_saffron','tour_goldenrod'].includes(p.id)?'열차 연결편':'배 연결편'):'마을 연결길';
    return {...point,direction:w.entry,destination:w.to,name,event,pages:[arrows[w.entry]+' 출구 → '+name+'\n'+transport+' 표지입니다.','표지 옆 길을 따라 출구로 걸어가세요.\n이 길은 돌아올 때도 이용할 수 있어요.']};
  });
  map.walkable=rows.map(r=>r.join(''));map.props.push(...props);return {objects,signs};
}
