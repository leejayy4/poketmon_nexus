import { TOUR_BUILDINGS,TOUR_MAPS } from './explore-world';
import { getMap } from './maps';
import { WORLD_GYMS } from './unified-world';
import type { GameMap,Point,MapId } from './types';

export interface TourMapMarker extends Point {
  id:string; name:string; kind:'center'|'facility'|'gym'|'person'|'pokemon'; destination?:MapId;
}
export function tourMinimapLayout(map:GameMap){
  const scale=Math.min(6,106/map.height);
  return {scale,x:(256-map.width*scale)/2,y:56};
}
export function tourMapMarkers(map:GameMap):TourMapMarker[]{
  const doors=map.warps.filter(w=>WORLD_GYMS.some(([,gym])=>gym===w.to)||(TOUR_BUILDINGS[map.id]??[]).some(b=>b.room===w.to)||['lab','home','neighbor','cottage','bedroom'].includes(w.to));
  return [...doors.map(w=>({id:w.to,name:getMap(w.to).name,kind:WORLD_GYMS.some(([,gym])=>gym===w.to)?'gym' as const:w.to.endsWith('_center')?'center' as const:'facility' as const,x:w.x,y:w.y,destination:w.to})),...map.npcs.map(n=>({id:n.id,name:n.name,kind:n.id==='tourPokemon'?'pokemon' as const:'person' as const,x:n.x,y:n.y}))];
}
export function tourMarkerBounds(map:GameMap,marker:Point){
  const layout=tourMinimapLayout(map),cx=layout.x+(marker.x+.5)*layout.scale,cy=layout.y+(marker.y+.5)*layout.scale;
  const size=Math.min(12,layout.scale*3);return {x:cx-size/2,y:cy-size/2,w:size,h:size,cx,cy};
}
