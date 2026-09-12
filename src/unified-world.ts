import type { GameMap,MapId,Point } from './types';
import { TOUR_BUILDINGS,TOUR_INTERIORS,TOUR_MAPS,TOUR_SPAWNS } from './explore-world';
import { ETERNA_FOREST_GRASS } from './eterna-forest-layout';
import { CORONET_GRASS } from './coronet-layout';
import { CINNABAR_GRASS } from './cinnabar-layout';
import { CASTELIA_GRASS } from './explore-castelia';
import { extendSinnohWestRoute } from './sinnoh-west-route';

export const WORLD_ALIASES:Partial<Record<MapId,MapId>>={
  jubilife:'tour_jubilife',oreburgh:'tour_oreburgh',eterna_forest:'tour_eterna_forest',eterna:'tour_eterna',coronet_pass:'tour_coronet',hearthome:'tour_hearthome',veilstone:'tour_veilstone',canalave:'tour_canalave',vermilion_port:'tour_vermilion',
  jubilife_center:'tour_jubilife_center',oreburgh_center:'tour_oreburgh_center',eterna_center:'tour_eterna_center',hearthome_center:'tour_hearthome_center',veilstone_center:'tour_veilstone_center',
};
export const worldMapId=(id:MapId):MapId=>WORLD_ALIASES[id]??id;
export const WORLD_GYMS=[['tour_oreburgh','oreburgh_gym'],['tour_eterna','eterna_gym'],['tour_hearthome','hearthome_gym'],['tour_veilstone','veilstone_gym']] as const;
export function worldGymDoor(id:string){return WORLD_GYMS.some(([city])=>city===id)?TOUR_BUILDINGS[id].find(b=>b.kind==='house')?.door:undefined;}
export function worldSpawn(id:MapId):Point|undefined{return TOUR_SPAWNS[worldMapId(id) as keyof typeof TOUR_SPAWNS];}
export const isWorldCenter=(id:MapId)=>TOUR_INTERIORS[worldMapId(id)]?.style==='center';

// Keep graphic source maps intact; runtime joins them to the existing adventure.
export function createUnifiedWorld(base:Record<MapId,GameMap>):Partial<Record<MapId,GameMap>>{
  const result:Partial<Record<MapId,GameMap>>={};
  const edit=(id:MapId)=>result[id]??(result[id]=structuredClone(base[id]));
  edit('tour_cinnabar').terrain=CINNABAR_GRASS.map(r=>({...r}));
  edit('tour_castelia').terrain=CASTELIA_GRASS.map(r=>({...r}));
  const route=edit('route_s01');route.warps.find(w=>w.to==='jubilife')!.to='tour_jubilife';route.warps.find(w=>w.to==='tour_jubilife')!.spawn={x:37,y:24};
  const jubilife=edit('tour_jubilife'),entrance=jubilife.warps.find(w=>w.to==='town')!;entrance.to='route_s01';entrance.spawn={x:3,y:12};
  // S03 in the authored encounter DB is the city's outskirts, away from its
  // plaza and building doors. Keep the pavement route around this optional lawn.
  jubilife.terrain=[{kind:'tallGrass',x:3,y:29,w:6,h:3}];
  jubilife.props.push({x:3,y:33,dialogue:'jubilifeGrassSign'});
  jubilife.walkable[33]=jubilife.walkable[33].slice(0,3)+'#'+jubilife.walkable[33].slice(4);
  for(const [city,gym] of WORLD_GYMS){
    const map=edit(city),door=worldGymDoor(city)!;
    map.walkable[door.y]=map.walkable[door.y].slice(0,door.x)+'.'+map.walkable[door.y].slice(door.x+1);
    map.props=map.props.filter(p=>p.x!==door.x||p.y!==door.y);
    map.warps.push({...door,to:gym,spawn:{x:8,y:13},entry:'up',facing:'up'});
    edit(gym).warps[0]={...base[gym].warps[0],to:city,spawn:{x:door.x,y:door.y+1}};
  }
  for(const id of Object.keys(TOUR_MAPS) as MapId[]){
    if(isWorldCenter(id))edit(id).npcs[0].dialogue='nurse';
  }
  for(const id of ['tour_eterna_forest','tour_coronet'] as const){
    const map=edit(id);map.terrain=(id==='tour_eterna_forest'?ETERNA_FOREST_GRASS:CORONET_GRASS).map(r=>({...r}));map.npcs[0].dialogue='trailGuide';
  }
  // Optional woodland grass stays off both marked routes and every existing prop.
  edit('tour_viridian_forest').terrain=[{kind:'tallGrass',x:14,y:6,w:3,h:3},{kind:'tallGrass',x:2,y:10,w:3,h:2}];
  edit('tour_viridian_forest').npcs[0].dialogue='viridianForestGuide';
  for(const [id,event,name] of [['tour_jubilife','researchGate','연구 통로 안내원'],['tour_eterna','sinnohGuide','도시 안내원'],['tour_hearthome','sinnohGuide','도시 안내원'],['tour_veilstone','observation','관측 연구원'],['tour_canalave','ferry','조사선 선원'],['tour_vermilion','ferry','조사선 선원']] as const){
    const npc=edit(id).npcs.find(n=>n.id==='tourGuide')!;npc.dialogue=event;npc.name=name;
  }
  // The existing research corridor becomes the short connection between the cities.
  const canalave=edit('tour_canalave'),toCanalave=jubilife.warps.find(w=>w.to==='tour_canalave')!,toJubilife=canalave.warps.find(w=>w.to==='tour_jubilife')!;
  const corridor=edit('research_path');corridor.warps[0]={...corridor.warps[0],to:'tour_jubilife',spawn:toJubilife.spawn};corridor.warps[1]={...corridor.warps[1],to:'tour_canalave',spawn:toCanalave.spawn};
  extendSinnohWestRoute(corridor);
  const route218=edit('tour_sinnoh_route_218');route218.warps=[
    {x:1,y:13,to:'tour_jubilife',spawn:{...toJubilife.spawn},entry:'left',facing:'left'},
    {x:62,y:10,to:'research_path',spawn:{x:2,y:12},entry:'right',facing:'right'},
  ];
  toCanalave.to='tour_sinnoh_route_218';toCanalave.spawn={x:2,y:13};
  corridor.warps[0]={...corridor.warps[0],to:'tour_sinnoh_route_218',spawn:{x:61,y:10}};
  toJubilife.to='research_path';toJubilife.spawn={x:61,y:12};
  return result;
}
