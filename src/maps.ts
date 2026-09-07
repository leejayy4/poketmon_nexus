import { createUnifiedWorld,worldMapId } from './unified-world';
import { TOUR_MAPS,TOUR_OUTDOORS } from './explore-world';
import { SINNOH_MAPS } from './sinnoh-maps';
import type { GameMap, MapId, SaveData } from './types';
import { TOWN_SIZE,TOWN_GRASS,makeTownCollision } from './town';
import { ROUTE_SIZE, ROUTE_GRASS, ROUTE_SIGN, makeRouteCollision } from './route';
import { BADGE_MAPS } from './badge-maps';
function grid(w: number, h: number, rectangles: number[][], blocks: number[][] = [], openings: number[][] = []): string[] {
  const g = Array.from({ length: h }, () => Array(w).fill('#'));
  for (const [x,y,rw,rh] of rectangles) for(let j=y;j<y+rh;j++) for(let i=x;i<x+rw;i++) g[j][i]='.';
  for (const [x,y,rw,rh] of blocks) for(let j=y;j<y+rh;j++) for(let i=x;i<x+rw;i++) g[j][i]='#';
  for (const [x,y] of openings) g[y][x]='.';
  return g.map(row=>row.join(''));
}
const homeFloor = grid(13,10,[[1,4,11,5],[8,3,2,1]],[[1,8,1,1],[11,8,1,1],[1,4,3,1],[6,4,2,1],[2,6,3,1],[3,7,2,1],[7,6,2,1]],[[6,8],[10,3]]);
export const MAPS: Record<MapId, GameMap> = {
  ...BADGE_MAPS,...SINNOH_MAPS,...TOUR_MAPS,
  route_s01: {id:'route_s01',name:'새잎 서쪽길',...ROUTE_SIZE,background:'route_s01',walkable:makeRouteCollision(),terrain:ROUTE_GRASS,
    warps:[{x:2,y:12,to:'jubilife',spawn:{x:21,y:12},entry:'left',facing:'left'},{x:30,y:12,to:'town',spawn:{x:4,y:15},facing:'right',entry:'right'}],
    npcs:[{id:'routeGuide',name:'길 안내원',sprite:'pokemon_breeder_f',x:25,y:10,facing:'down',dialogue:'routeGuide'},
      {id:'roadworker',name:'도로 정비원',sprite:'worker',x:3,y:11,facing:'right',dialogue:'roadworker'}],
    props:[{...ROUTE_SIGN,dialogue:'routeSign'}]},
  bedroom: { id:'bedroom',name:'우리 집 · 2층',width:13,height:10,background:'bedroom-reference',
    walkable:grid(13,10,[[1,4,10,5]],[[1,4,1,1],[9,7,2,2],[1,7,1,2]],[[8,4]]),
    warps:[{x:8,y:4,to:'home',spawn:{x:10,y:4},facing:'down',entry:'up'}],npcs:[],
    props:[{x:3,y:3,dialogue:'computer'},{x:4,y:3,dialogue:'tv'},{x:9,y:7,dialogue:'bed'},{x:6,y:3,dialogue:'window'},{x:2,y:3,dialogue:'books'}] },
  home: {id:'home',name:'우리 집 · 1층',width:13,height:10,background:'home-reference',walkable:homeFloor,
    warps:[{x:10,y:3,to:'bedroom',spawn:{x:8,y:5},facing:'down',entry:'up'},{x:6,y:8,to:'town',spawn:{x:8,y:25},facing:'down',entry:'down'}],
    npcs:[{id:'mom',name:'엄마',sprite:'mother',x:4,y:4,facing:'down',dialogue:'mom'}],props:[{x:6,y:4,dialogue:'tv'},{x:7,y:4,dialogue:'tv'},{x:2,y:4,dialogue:'kitchen'},{x:7,y:6,dialogue:'tea'}]},
  town: {id:'town',name:'새잎마을',...TOWN_SIZE,background:'town',terrain:[TOWN_GRASS],
    walkable:makeTownCollision(),
    warps:[{x:2,y:15,to:'route_s01',spawn:{x:29,y:12},facing:'left',entry:'left',requiresFlag:'departureCleared'},{x:8,y:24,to:'home',spawn:{x:6,y:7},facing:'up',entry:'up'},{x:10,y:9,to:'lab',spawn:{x:6,y:11},facing:'up',entry:'up'},{x:24,y:10,to:'neighbor',spawn:{x:6,y:7},facing:'up',entry:'up'},{x:30,y:24,to:'cottage',spawn:{x:6,y:7},facing:'up',entry:'up'}],
    npcs:[{id:'gatekeeper',name:'이웃 도윤',sprite:'worker',x:3,y:15,facing:'right',dialogue:'gatekeeper'},{id:'girl',name:'정원사 소윤',sprite:'gardener',x:18,y:12,facing:'down',dialogue:'girl'},{id:'boy',name:'산책하는 민우',sprite:'school_kid_m',x:33,y:9,facing:'up',dialogue:'boy'},{id:'elder',name:'연못지기',sprite:'rancher',x:26,y:17,facing:'left',dialogue:'elder'}],
    props:[{x:17,y:17,dialogue:'townSign'},{x:13,y:23,dialogue:'mailbox'}]},
  lab: {id:'lab',name:'포켓몬 연구소',width:21,height:14,background:'lab-reference',
    walkable:grid(21,14,[[1,4,11,9],[12,4,8,3]],[[1,4,3,1],[1,6,1,2],[11,6,1,2],[1,9,1,2],[11,9,1,2],[1,11,2,2],[10,11,2,2],[5,6,3,1],[13,5,1,1],[19,5,1,1]],[[6,13]]),
    warps:[{x:6,y:13,to:'town',spawn:{x:10,y:10},facing:'down',entry:'down'}],
    npcs:[{id:'professor',name:'은솔박사',sprite:'professor',x:6,y:4,facing:'down',dialogue:'professor'},{id:'assistant',name:'연구원',sprite:'scientist_m',x:9,y:4,facing:'down',dialogue:'assistant'},{id:'eeveeResearcher',name:'연구원 하린',sprite:'scientist_f',x:15,y:4,facing:'right',dialogue:'eeveeResearcher'},{id:'eevee',name:'이브이',sprite:'eevee-play',x:17,y:4,facing:'left',dialogue:'eevee'}],
    props:[{x:5,y:6,dialogue:'pokeballs'},{x:6,y:6,dialogue:'pokeballs'},{x:7,y:6,dialogue:'pokeballs'},{x:3,y:4,dialogue:'researchBooks'},{x:11,y:3,dialogue:'labComputer'}]},
  neighbor: {id:'neighbor',name:'이웃집',width:13,height:10,background:'home-reference',walkable:homeFloor.map((r,y)=>y===3?'#############':r),warps:[{x:6,y:8,to:'town',spawn:{x:24,y:11},facing:'down',entry:'down'}],npcs:[{id:'neighbor',name:'이웃 아주머니',sprite:'ace_trainer_f',x:4,y:4,facing:'down',dialogue:'neighbor'}],props:[{x:6,y:4,dialogue:'tv'},{x:9,y:3,dialogue:'privateRoom'}]},
  cottage: {id:'cottage',name:'작은 집',width:13,height:10,background:'home-reference',walkable:homeFloor.map((r,y)=>y===3?'#############':r),warps:[{x:6,y:8,to:'town',spawn:{x:30,y:25},facing:'down',entry:'down'}],npcs:[{id:'reader',name:'책 읽는 소녀',sprite:'school_kid_f',x:4,y:4,facing:'down',dialogue:'reader'}],props:[{x:9,y:3,dialogue:'privateRoom'},{x:6,y:4,dialogue:'tv'}]},
};
export const UNIFIED_MAPS=createUnifiedWorld(MAPS);
export const ACTIVE_MAPS=Object.fromEntries(Object.entries(MAPS).filter(([id])=>worldMapId(id as MapId)===id).map(([id,map])=>[id,UNIFIED_MAPS[id as MapId]??map])) as Record<MapId,GameMap>;
export function getWorldOutdoors(map:GameMap){
  const source=TOUR_OUTDOORS[map.id];if(!source)return undefined;
  return {...source,signs:source.signs.map(sign=>{
    const original=TOUR_MAPS[map.id as keyof typeof TOUR_MAPS].warps.find(w=>w.entry===sign.direction&&(w.to===sign.destination||w.to.startsWith('tour_pass_')));
    const exit=map.warps.find(w=>w.x===original?.x&&w.y===original?.y);
    if(!exit||exit.to===sign.destination)return sign;
    const name=MAPS[exit.to].name;
    return {...sign,destination:exit.to,name,pages:[sign.pages[0].replace(sign.name,name),sign.pages[1]]};
  })};
}
export function canStand(map: GameMap,x:number,y:number): boolean {
  return map.walkable[y]?.[x]==='.' && !map.npcs.some(n=>n.x===x&&n.y===y) && !map.reserved?.some(p=>p.x===x&&p.y===y);
}

// A doorway occupies one tile and can only be entered from its approach direction.
export function canEnter(map:GameMap,x:number,y:number,direction:import('./types').Direction):boolean {
  return canStand(map,x,y) && !map.warps.some(w=>w.x===x&&w.y===y&&w.entry!==direction);
}

// Position and access derive from this save; loading another slot cannot leak gate state.
export function getMap(id:MapId,flags:SaveData['flags']={}):GameMap {
  id=worldMapId(id);const map=UNIFIED_MAPS[id]??MAPS[id];
  const collected=flags['pickup:'+id]?map.props.find(p=>p.dialogue==='journeyItem'):undefined;
  return {...map,walkable:collected?map.walkable.map((row,y)=>y===collected.y?row.slice(0,collected.x)+'.'+row.slice(collected.x+1):row):map.walkable,
    props:collected?map.props.filter(p=>p!==collected):map.props,warps:map.warps.filter(w=>!w.requiresFlag||flags[w.requiresFlag]===true),
    npcs:map.npcs.map(n=>n.id==='gatekeeper'&&flags.departureCleared===true?{...n,x:4,y:14,facing:'down'}:n)};
}
