import { TOUR_BUILDINGS,TOUR_MAPS,TOUR_OUTDOORS } from './explore-world';
import { getMap } from './maps';
import { WORLD_GYMS } from './unified-world';
import { FLOOR_INFO } from './journey-world';
import type { GameMap,Point,MapId } from './types';

export interface TourMapMarker extends Point {
  id:string; name:string; kind:'center'|'facility'|'gym'|'person'|'pokemon'|'exit'; destination?:MapId; event?:string;
}
export function tourMinimapLayout(map:GameMap){
  const scale=Math.min(6,106/map.height);
  return {scale,x:(256-map.width*scale)/2,y:56};
}
export function tourMapMarkers(map:GameMap):TourMapMarker[]{
  const doors=map.warps.filter(w=>WORLD_GYMS.some(([,gym])=>gym===w.to)||(TOUR_BUILDINGS[map.id]??[]).some(b=>b.room===w.to)||FLOOR_INFO[map.id]&&FLOOR_INFO[w.to]||['lab','home','neighbor','cottage','bedroom'].includes(w.to));
  const doorTargets=new Set(doors.map(w=>w.to));
  const travelExitMaps=new Set<MapId>([
    'tour_vermilion','tour_kanto_route_6','tour_kanto_underground_ns','tour_kanto_route_5','tour_pass_vermilion_cinnabar','tour_pass_vermilion_cerulean',
    'tour_goldenrod','tour_route_34','tour_ilex','tour_pass_goldenrod_violet','tour_pass_goldenrod_ecruteak',
  ]);
  const exitDirection:Record<string,string>={left:'←',right:'→',up:'↑',down:'↓'};
  const exits=travelExitMaps.has(map.id)?map.warps.filter(w=>!doorTargets.has(w.to)).map(w=>({id:'exit:'+w.to,name:`${exitDirection[w.entry]??'◇'} ${getMap(w.to).name}`,kind:'exit' as const,x:w.x,y:w.y,destination:w.to})):[];
  const landmarks=(TOUR_OUTDOORS[map.id]?.objects??[]).flatMap(object=>object.cells.length?[{id:object.event,name:object.name,kind:'facility' as const,...object.cells[0],destination:map.id,event:object.event}]:[]);
  return [
    ...doors.map(w=>({id:w.to,name:getMap(w.to).name,kind:WORLD_GYMS.some(([,gym])=>gym===w.to)?'gym' as const:w.to.endsWith('_center')?'center' as const:'facility' as const,x:w.x,y:w.y,destination:w.to})),
    ...exits,
    ...landmarks,
    ...map.npcs.map(n=>({id:n.id,name:n.name,kind:n.id==='tourPokemon'||n.sprite.startsWith('field-')?'pokemon' as const:'person' as const,x:n.x,y:n.y,destination:map.id,event:n.dialogue})),
  ];
}
export function tourMarkerBounds(map:GameMap,marker:Point){
  const layout=tourMinimapLayout(map),cx=layout.x+(marker.x+.5)*layout.scale,cy=layout.y+(marker.y+.5)*layout.scale;
  const size=Math.min(12,layout.scale*3);return {x:cx-size/2,y:cy-size/2,w:size,h:size,cx,cy};
}
