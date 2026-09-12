import type { Place,TourBuilding,TourFeature } from './explore-world';
import { JUBILIFE_BUILDINGS,JUBILIFE_SIZE,JUBILIFE_EXITS,JUBILIFE_SIGNS } from './explore-jubilife';
import { CASTELIA_SIZE,casteliaPlan } from './explore-castelia';
import type { Direction,Point } from './types';
import { CINNABAR_SIZE,extendCinnabarTown } from './cinnabar-layout';
import { VERMILION_SIZE,extendVermilionTown } from './vermilion-layout';
import { ETERNA_CITY_SIZE,extendEternaCity } from './eterna-city-layout';
import { GOLDENROD_CITY_SIZE,extendGoldenrodCity } from './goldenrod-city-layout';
import { NIMBASA_CITY_SIZE,nimbasaPlan } from './nimbasa-city-layout';
import { DRIFTVEIL_CITY_SIZE,driftveilPlan } from './driftveil-city-layout';
import { MISTRALTON_CITY_SIZE,mistraltonPlan } from './mistralton-city-layout';
import { LENTIMAS_TOWN_SIZE,lentimasPlan } from './lentimas-town-layout';
import { UNDELLA_TOWN_SIZE,undellaPlan } from './undella-town-layout';
import { LACUNOSA_TOWN_SIZE,lacunosaPlan } from './lacunosa-town-layout';
import { HEARTHOME_SIZE,extendHearthomeCity } from './hearthome-layout';
import { VEILSTONE_CITY_SIZE,extendVeilstoneCity } from './veilstone-city-layout';
import { PASTORIA_CITY_SIZE,extendPastoriaCity } from './pastoria-city-layout';
import { SUNYSHORE_CITY_SIZE,extendSunyshoreCity } from './sunyshore-city-layout';
import { SINNOH_LAKE_SIZE,extendSinnohLake } from './sinnoh-lake-layout';
import { SNOWPOINT_CITY_SIZE,extendSnowpointCity } from './snowpoint-city-layout';
import { AZALEA_SIZE,extendAzaleaTown } from './azalea-layout';
import { CANALAVE_CITY_SIZE,extendCanalaveCity } from './canalave-layout';
import { LAVENDER_TOWN_SIZE,extendLavenderTown } from './lavender-layout';
import { VIOLET_CITY_SIZE,extendVioletCity } from './violet-city-layout';

type Rect=[number,number,number,number];
export type TownStyle='urban'|'waterfront'|'rural'|'heritage'|'mining';
export const COMPACT_PLACES=new Set(['tour_eterna_forest','tour_coronet','tour_viridian_forest','tour_ilex','tour_desert','tour_rage_lake','tour_dragonspiral']);
export function townStyle(p:Place):TownStyle {
  return ['city','factory','airport','fair'].includes(p.theme)?'urban':['port','water','coast'].includes(p.theme)?'waterfront':['temple','ghost','dragon','snow'].includes(p.theme)?'heritage':['mine','desert'].includes(p.theme)?'mining':'rural';
}
export function tourSize(p:Place){
  if(p.id==='tour_vermilion')return VERMILION_SIZE;
  if(p.id==='tour_eterna')return ETERNA_CITY_SIZE;
  if(p.id==='tour_hearthome')return HEARTHOME_SIZE;
  if(p.id==='tour_veilstone')return VEILSTONE_CITY_SIZE;
  if(p.id==='tour_pastoria')return PASTORIA_CITY_SIZE;
  if(p.id==='tour_sunyshore')return SUNYSHORE_CITY_SIZE;
  if(p.id==='tour_lake')return SINNOH_LAKE_SIZE;
  if(p.id==='tour_snowpoint')return SNOWPOINT_CITY_SIZE;
  if(p.id==='tour_canalave')return CANALAVE_CITY_SIZE;
  if(p.id==='tour_goldenrod')return GOLDENROD_CITY_SIZE;
  if(p.id==='tour_azalea')return AZALEA_SIZE;
  if(p.id==='tour_castelia')return CASTELIA_SIZE;
  if(p.id==='tour_nimbasa')return NIMBASA_CITY_SIZE;
  if(p.id==='tour_driftveil')return DRIFTVEIL_CITY_SIZE;
  if(p.id==='tour_mistralton')return MISTRALTON_CITY_SIZE;
  if(p.id==='tour_lentimas')return LENTIMAS_TOWN_SIZE;
  if(p.id==='tour_undella')return UNDELLA_TOWN_SIZE;
  if(p.id==='tour_lacunosa')return LACUNOSA_TOWN_SIZE;
  if(p.id==='tour_cinnabar')return CINNABAR_SIZE;
  if(p.id==='tour_lavender')return LAVENDER_TOWN_SIZE;
  if(p.id==='tour_violet')return VIOLET_CITY_SIZE;
  if(COMPACT_PLACES.has(p.id))return {width:28,height:24};
  return p.id==='tour_jubilife'?JUBILIFE_SIZE:({urban:{width:40,height:36},waterfront:{width:40,height:32},rural:{width:34,height:30},heritage:{width:36,height:34},mining:{width:34,height:32}})[townStyle(p)];
}
export function expandedExits(p:Place){
  if(p.id==='tour_jubilife')return JUBILIFE_EXITS;
  const {width,height}=tourSize(p);
  if(p.id==='tour_lavender')return {up:{point:{x:14,y:2},spawn:{x:14,y:3},facing:'down'},right:{point:{x:34,y:12},spawn:{x:33,y:12},facing:'left'},down:{point:{x:14,y:32},spawn:{x:14,y:31},facing:'up'},left:{point:{x:1,y:12},spawn:{x:2,y:12},facing:'right'}} as Record<Direction,{point:Point;spawn:Point;facing:Direction}>;
  return {up:{point:{x:14,y:2},spawn:{x:14,y:3},facing:'down'},right:{point:{x:width-2,y:12},spawn:{x:width-3,y:12},facing:'left'},down:{point:{x:14,y:height-2},spawn:{x:14,y:height-3},facing:'up'},left:{point:{x:1,y:12},spawn:{x:2,y:12},facing:'right'}} as Record<Direction,{point:Point;spawn:Point;facing:Direction}>;
}
export function expandedSigns(p:Place){
  if(p.id==='tour_jubilife')return JUBILIFE_SIGNS;
  if(p.id==='tour_lavender')return {up:{x:16,y:4},right:{x:32,y:10},down:{x:16,y:30},left:{x:3,y:10}} as Record<Direction,Point>;
  const {width,height}=tourSize(p);return {up:{x:16,y:4},right:{x:width-4,y:10},down:{x:16,y:height-4},left:{x:3,y:10}} as Record<Direction,Point>;
}
export interface ExpandedTown {width:number;height:number;style:TownStyle;buildings:TourBuilding[];features:TourFeature[];paths:Rect[];boardwalks:Rect[]}
export function expandTown(p:Place,features:TourFeature[],jubilifePaths:Rect[]=[]):ExpandedTown {
  if(p.id==='tour_castelia')return casteliaPlan();
  if(p.id==='tour_nimbasa')return nimbasaPlan();
  if(p.id==='tour_driftveil')return driftveilPlan();
  if(p.id==='tour_mistralton')return mistraltonPlan();
  if(p.id==='tour_lentimas')return lentimasPlan();
  if(p.id==='tour_undella')return undellaPlan();
  if(p.id==='tour_lacunosa')return lacunosaPlan();
  const {width,height}=p.id==='tour_vermilion'?{width:40,height:32}:p.id==='tour_eterna'?{width:36,height:34}:p.id==='tour_goldenrod'?{width:40,height:36}:p.id==='tour_azalea'?{width:34,height:30}:p.id==='tour_cinnabar'?{width:34,height:32}:tourSize(p),style=townStyle(p);
  const urban=style==='urban',wet=style==='waterfront',heritage=style==='heritage';
  const hallX=width-(urban||wet?14:12),hallY=urban?17:wet?11:8;
  const buildings:TourBuilding[]=p.id==='tour_jubilife'?JUBILIFE_BUILDINGS:[
    {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:`${p.id}_center`},
    {kind:'landmark',x:hallX,y:hallY,w:urban||wet?10:8,h:urban||wet?4:3,door:{x:hallX+(urban||wet?5:2),y:hallY+(urban||wet?3:2)},room:`${p.id}_hall`},
  ];
  if(p.id!=='tour_jubilife'){
    const locations=urban?[[5,25],[22,27],[5,16],[18,7]]:wet?[[5,25],[26,26],[18,7]]:heritage?[[5,23],[24,27],[16,26]]:style==='mining'?[[5,24],[23,25],[14,26]]:[[5,19],[21,23],[5,25]];
    for(const [x,y]of locations){const apartment=urban||wet;buildings.push({kind:'house',x,y,w:apartment?5:4,h:2,door:{x:x+(apartment?2:1),y:y+1}})}
  }
  const positions=urban?[[5,28],[16,19],[32,28]]:wet?[[5,13],[20,18],[33,25]]:heritage?[[5,10],[14,18],[29,22]]:style==='mining'?[[5,10],[19,18],[26,21]]:[[5,10],[14,19],[27,19]];
  const scenery=p.id==='tour_jubilife'?features:features.map((f,i)=>({...f,x:positions[i][0],y:positions[i][1]}));
  const paths:Rect[]=p.id==='tour_jubilife'?[...jubilifePaths]:[[12,3,5,height-5],[2,11,width-4,3],[2,height-9,width-4,3]];
  for(const b of buildings)paths.push([Math.min(12,b.door.x),b.door.y+1,Math.abs(b.door.x-12)+2,2]);
  const boardwalks:Rect[]=[];
  for(const f of scenery){const border:Rect[]=[[f.x-1,f.y-1,f.w+2,1],[f.x-1,f.y+f.h,f.w+2,1],[f.x-1,f.y,1,f.h],[f.x+f.w,f.y,1,f.h]];paths.push(...border);if(wet&&f.kind==='water')boardwalks.push(...border)}
  if(p.id==='tour_goldenrod'){
    // Broader station forecourt, radio entrance plaza and southern market walk.
    // Existing collision, building doors and saved positions stay unchanged.
    paths.push([2,10,10,6],[24,21,12,4],[5,27,23,3],[17,9,6,2]);
    scenery[0]={...scenery[0],name:'시장 골목의 화단',description:'상점 골목에 꽃을 모아 심었다.\n남쪽 큰길은 34번도로로 이어진다.'};
    scenery[1]={...scenery[1],name:'라디오 광장 분수',description:'방송을 기다리는 주민들이 쉬는 곳.\n동쪽 라디오 타워에서 동료를 소개하자.'};
  }
  const plan={width,height,style,buildings,features:scenery,paths,boardwalks};
  return p.id==='tour_vermilion'?extendVermilionTown(plan):p.id==='tour_eterna'?extendEternaCity(plan):p.id==='tour_hearthome'?extendHearthomeCity(plan):p.id==='tour_veilstone'?extendVeilstoneCity(plan):p.id==='tour_pastoria'?extendPastoriaCity(plan):p.id==='tour_sunyshore'?extendSunyshoreCity(plan):p.id==='tour_lake'?extendSinnohLake(plan):p.id==='tour_snowpoint'?extendSnowpointCity(plan):p.id==='tour_canalave'?extendCanalaveCity(plan):p.id==='tour_goldenrod'?extendGoldenrodCity(plan):p.id==='tour_azalea'?extendAzaleaTown(plan):p.id==='tour_cinnabar'?extendCinnabarTown(plan):p.id==='tour_lavender'?extendLavenderTown(plan):p.id==='tour_violet'?extendVioletCity(plan):plan;
}
