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

export function tourMapRoute(start:MapId,target:MapId,flags:SaveData['flags']):MapId[]{
  const queue:MapId[]=[start],previous=new Map<MapId,MapId|null>([[start,null]]);
  for(let i=0;i<queue.length;i++){
    const id=queue[i];if(id===target){const result:MapId[]=[];let cursor:MapId|null=id;while(cursor){result.unshift(cursor);cursor=previous.get(cursor)??null}return result}
    for(const w of getMap(id,flags).warps)if(!previous.has(w.to)){previous.set(w.to,id);queue.push(w.to)}
  }
  return [];
}

export function tourExitPath(map:GameMap,start:Point,exit:Warp):Point[]{
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

// Match Engine.interact: NPCs take precedence over props at the same tile.
export function objectiveInteractionPath(map:GameMap,start:Point,event:string):{tiles:Point[];interaction:Point & {facing:Direction}}|null {
  const key=(p:Point)=>p.x+','+p.y,queue:Point[]=[{x:start.x,y:start.y}],previous=new Map<string,Point|null>([[key(start),null]]);
  for(let i=0;i<queue.length;i++){
    const point=queue[i];
    for(const [facing,dx,dy]of directions){
      const x=point.x+dx,y=point.y+dy,object=map.npcs.find(n=>n.x===x&&n.y===y)??map.props.find(p=>p.x===x&&p.y===y);
      const dialogue=object?.dialogue==='tourHost'&&isWorldCenter(map.id)?'nurse':object?.dialogue;
      if(dialogue!==event)continue;
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

export function planTourNavigation(save:SaveData,target:MapId,currentMap?:GameMap,event?:string):TourNavigation|null {
  if(!Object.hasOwn(ACTIVE_MAPS,target))return null;
  const place=placeById(target);
  const result:TourNavigation={destination:target,name:place?.name??getMap(target).name,status:'blocked',maps:[],tiles:[],nextName:null,exit:null};
  if(save.map===target&&event){
    const map=currentMap?.id===save.map?currentMap:getMap(save.map,save.flags),path=objectiveInteractionPath(map,save.player,event);
    return path?{...result,...path,maps:[save.map],status:path.tiles.length>1?'walking':'arrived'}:result;
  }
  if((save.map===target||(place&&tourPlaceForMap(save.map)?.id===target))&&!event)return {...result,status:'arrived',maps:[save.map]};
  const maps=tourMapRoute(save.map,target,save.flags);if(maps.length<2)return result;
  const map=currentMap?.id===save.map?currentMap:getMap(save.map,save.flags),exit=map.warps.find(w=>w.to===maps[1])!;
  const tiles=tourExitPath(map,save.player,exit);
  return {...result,maps,exit,tiles,nextName:getMap(maps[1],save.flags).name,status:tiles.length?'walking':'blocked'};
}
