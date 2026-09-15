import { SEAFOAM_BOULDER_MAP,SEAFOAM_BOULDER_EVENT,SEAFOAM_BOULDER_START } from './seafoam-boulder';
import { canEnter,getMap,ACTIVE_MAPS } from './maps';
import { TOUR_INTERIORS,placeById,tourPlaceForMap } from './explore-world';
import { WORLD_GYMS,isWorldCenter } from './unified-world';
import type { Direction,GameMap,MapId,Point,SaveData,Warp } from './types';

export interface TourNavigation {
  destination:MapId; name:string; status:'walking'|'arrived'|'blocked';
  maps:MapId[]; tiles:Point[]; nextName:string|null; exit:Warp|null;
  interaction?:Point & {facing:Direction};
}
const directions:[Direction,number,number][]=[['up',0,-1],['right',1,0],['down',0,1],['left',-1,0]];
export const DIRECTION_LABEL:Record<Direction,string>={up:'↑ 북쪽',right:'→ 동쪽',down:'↓ 남쪽',left:'← 서쪽'};
export const tourPassageLabel=(exit:Warp)=>Object.hasOwn(TOUR_INTERIORS,exit.to)||WORLD_GYMS.some(([,gym])=>gym===exit.to)||['lab','home','neighbor','cottage','bedroom'].includes(exit.to)?'입구':'출구';

export function tourMapRoute(start:MapId,target:MapId,flags:SaveData['flags'],avoid?:MapId):MapId[]{
  const queue:MapId[]=[start],previous=new Map<MapId,MapId|null>([[start,null]]);
  for(let i=0;i<queue.length;i++){
    const id=queue[i];if(id===target){const result:MapId[]=[];let cursor:MapId|null=id;while(cursor){result.unshift(cursor);cursor=previous.get(cursor)??null}return result}
    for(const w of getMap(id,flags).warps)if(w.to!==avoid&&!previous.has(w.to)){previous.set(w.to,id);queue.push(w.to)}
  }
  return [];
}

export function tourExitPath(map:GameMap,start:Point,exit:Pick<Warp,'x'|'y'>):Point[]{
  const key=(p:Point)=>p.x+','+p.y,queue:Point[]=[{x:start.x,y:start.y}],previous=new Map<string,Point|null>([[key(start),null]]);
  for(let i=0;i<queue.length;i++){
    const point=queue[i];if(point.x===exit.x&&point.y===exit.y){const path:Point[]=[];let cursor:Point|null=point;while(cursor){path.unshift(cursor);cursor=previous.get(key(cursor))??null}return path}
    for(const [dir,dx,dy]of directions){const next={x:point.x+dx,y:point.y+dy};
      if(previous.has(key(next))||!canEnter(map,next.x,next.y,dir))continue;
      if(map.warps.some(w=>w.x===next.x&&w.y===next.y&&(w.x!==exit.x||w.y!==exit.y)))continue;
      previous.set(key(next),point);queue.push(next);
    }
  }
  return [];
}

interface WalkableMapRoute { maps:MapId[]; exit:Warp; tiles:Point[] }

// Carry the real arrival point across floors. A graph-only route can select a
// stair that exists but deposits the player in a sealed section of the next map.
function tourWalkableMapRoute(start:MapId,target:MapId,flags:SaveData['flags'],startPoint:Point,currentMap?:GameMap):WalkableMapRoute|null {
  type State={map:MapId;point:Point;maps:MapId[];exit:Warp|null;tiles:Point[]};
  const queue:State[]=[{map:start,point:{...startPoint},maps:[start],exit:null,tiles:[]}];
  const seen=new Set<string>([`${start}:${startPoint.x},${startPoint.y}`]);
  for(let i=0;i<queue.length;i++){
    const state=queue[i];
    if(state.map===target&&state.exit)return {maps:state.maps,exit:state.exit,tiles:state.tiles};
    const map=state.map===start&&currentMap?.id===start?currentMap:getMap(state.map,flags);
    for(const warp of map.warps){
      const local=tourExitPath(map,state.point,warp);if(!local.length)continue;
      const key=`${warp.to}:${warp.spawn.x},${warp.spawn.y}`;if(seen.has(key))continue;
      seen.add(key);
      queue.push({map:warp.to,point:{...warp.spawn},maps:[...state.maps,warp.to],exit:state.exit??warp,tiles:state.exit?state.tiles:local});
    }
  }
  return null;
}

// Match Engine.interact: NPCs take precedence over props at the same tile.
export function objectiveInteractionPath(map:GameMap,start:Point,event:string,npcId?:string):{tiles:Point[];interaction:Point & {facing:Direction}}|null {
  const key=(p:Point)=>p.x+','+p.y,queue:Point[]=[{x:start.x,y:start.y}],previous=new Map<string,Point|null>([[key(start),null]]);
  for(let i=0;i<queue.length;i++){
    const point=queue[i];
    for(const [facing,dx,dy]of directions){
      const x=point.x+dx,y=point.y+dy,object=map.npcs.find(n=>n.x===x&&n.y===y)??map.props.find(p=>p.x===x&&p.y===y);
      const dialogue=object?.dialogue==='tourHost'&&isWorldCenter(map.id)?'nurse':object?.dialogue;
      // Direct marker selection follows identity even if the resident changes
      // dialogue (including a center host projected as the nurse interaction).
      if(npcId?!map.npcs.some(n=>n===object&&n.id===npcId):dialogue!==event)continue;
      // An unmoved boulder can only be pushed from its north approach.
      if(map.id===SEAFOAM_BOULDER_MAP&&event===SEAFOAM_BOULDER_EVENT
        &&x===SEAFOAM_BOULDER_START.x&&y===SEAFOAM_BOULDER_START.y&&facing!=='down')continue;
      const tiles:Point[]=[];let cursor:Point|null=point;while(cursor){tiles.unshift(cursor);cursor=previous.get(key(cursor))??null;}
      return {tiles,interaction:{x,y,facing}};
    }
    for(const [dir,dx,dy]of directions){const next={x:point.x+dx,y:point.y+dy};
      if(previous.has(key(next))||!canEnter(map,next.x,next.y,dir)||map.warps.some(w=>w.x===next.x&&w.y===next.y))continue;
      previous.set(key(next),point);queue.push(next);
    }
  }
  return null;
}

export function planTourNavigation(save:SaveData,target:MapId,currentMap?:GameMap,event?:string,point?:Point,npcId?:string):TourNavigation|null {
  if(!Object.hasOwn(ACTIVE_MAPS,target))return null;
  const place=placeById(target);
  const result:TourNavigation={destination:target,name:place?.name??getMap(target).name,status:'blocked',maps:[],tiles:[],nextName:null,exit:null};
  if(save.map===target&&point){
    const map=currentMap?.id===save.map?currentMap:getMap(save.map,save.flags);
    if(!Number.isInteger(point.x)||!Number.isInteger(point.y)||map.warps.some(w=>w.x===point.x&&w.y===point.y))return result;
    const tiles=tourExitPath(map,save.player,point);
    return {...result,tiles,maps:[save.map],status:tiles.length?(tiles.length>1?'walking':'arrived'):'blocked'};
  }
  if(save.map===target&&event){
    const map=currentMap?.id===save.map?currentMap:getMap(save.map,save.flags),path=objectiveInteractionPath(map,save.player,event,npcId);
    return path?{...result,...path,maps:[save.map],status:path.tiles.length>1?'walking':'arrived'}:result;
  }
  if((save.map===target||(place&&tourPlaceForMap(save.map)?.id===target))&&!event&&!point)return {...result,status:'arrived',maps:[save.map]};
  const map=currentMap?.id===save.map?currentMap:getMap(save.map,save.flags);
  const walkable=tourWalkableMapRoute(save.map,target,save.flags,save.player,map);
  if(walkable)return {...result,...walkable,nextName:getMap(walkable.maps[1],save.flags).name,status:'walking'};
  // Retain the graph route only as a blocked description when no complete
  // entrance-aware walking chain can reach the destination.
  const maps=tourMapRoute(save.map,target,save.flags);
  return {...result,maps,nextName:maps.length>1?getMap(maps[1],save.flags).name:null};
}
