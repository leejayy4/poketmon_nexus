import { buildJourneyWorld,ROOM_PARENTS,PASSAGES,PASSAGE_PLACES,FLOOR_INFO,TRANSIT_LINKS } from './journey-world';
import { installGoldenrodHomes } from './goldenrod-homes';
import { installCasteliaHomes } from './castelia-homes';
import { installCasteliaInteriorSizes } from './castelia-interiors';
import { installCinnabarHomes } from './cinnabar-life';
import { installVermilionInteriors } from './vermilion-interiors';
import { installGoldenrodRadioFloors } from './goldenrod-radio';
import { installUnovaRouteOne } from './unova-route-one';
import { COMPACT_PLACES,tourSize,expandedExits,expandTown,type ExpandedTown } from './explore-expansion';
import { createTownPokemon,type TownPokemon } from './explore-pokemon';
import type { Direction,GameMap,MapId,Point } from './types';
import { createTourInterior,type TourInterior } from './explore-interiors';
import { prepareTourOutdoors,type TourOutdoors } from './explore-outdoors';
import { createTourResidents,type TourResident } from './explore-residents';
import { TOUR_LAYOUTS } from './explore-layouts';
import { ETERNA_FOREST_SOUTH,makeEternaForestFloor } from './eterna-forest-layout';
import { CORONET_EAST,CORONET_SOUTH,makeCoronetFloor } from './coronet-layout';
import { ILEX_FOREST_EAST,installIlexForestDetails,makeIlexForestFloor } from './ilex-forest-layout';
import { installGoldenrodRoute } from './goldenrod-route';
import { installGoldenrodStation } from './goldenrod-station';
import { installGoldenrodInteriorSizes } from './goldenrod-interiors';
import { buildEternaApproaches,ETERNA_APPROACHES } from './eterna-approaches';
import { installEternaInteriorSizes } from './eterna-interiors';
import { installHearthomeInteriorSizes } from './hearthome-interiors';
import { installVeilstoneInteriors } from './veilstone-interiors';
import { installVeilstoneTrainingField } from './veilstone-training';
import { installPastoriaInteriors } from './pastoria-interiors';
import { installPastoriaObservation } from './pastoria-observation';
import { installSunyshoreInteriors } from './sunyshore-interiors';
import { installSunyshoreObservation } from './sunyshore-observation';
import { installSinnohNorthInteriors } from './sinnoh-north-interiors';
import { installSinnohNorthObservation } from './sinnoh-north-observation';
import { installCanalaveInteriors } from './canalave-interiors';
import { installCanalaveWork } from './canalave-work';
import { createSinnohRoute218,SINNOH_ROUTE_218 } from './sinnoh-route-218';
import { installHearthomePracticeGarden } from './hearthome-performance';
import { installEternaGardenCare } from './eterna-garden-care';
import { installEternaCoronetApproach } from './eterna-coronet-approach';
import { installSinnohRoute208 } from './sinnoh-route-208';
import { installSinnohRoute209Solaceon } from './sinnoh-route-209-solaceon';
import { installSinnohRoute212 } from './sinnoh-route-212';
import { installSinnohSoutheastRoutes } from './sinnoh-southeast-routes';
import { installSinnohNorthRoute } from './sinnoh-north-route';
import { installEternaClock } from './eterna-clock-art';
import { installNimbasaInteriors } from './nimbasa-interiors';
import { installNimbasaWestRoute } from './nimbasa-west-route';
import { installDriftveilInteriors } from './driftveil-interiors';
import { installMistraltonInteriors } from './mistralton-interiors';
import { installLentimasInteriors } from './lentimas-interiors';
import { installUndellaInteriors } from './undella-interiors';
import { installLacunosaInteriors } from './lacunosa-interiors';
import { installUnovaRouteSix } from './unova-route-six';
import { installReversalMountainExterior } from './unova-reversal-mountain';
import { installUnovaRouteThirteen } from './unova-route-thirteen';
import { installUnovaRouteTwelve } from './unova-route-twelve';
import { installKantoRouteSix } from './kanto-route-six';
import { installKantoLavenderApproach } from './kanto-lavender-approach';
import { installAzaleaInteriors } from './azalea-interiors';
import { installJohtoSouthRoute } from './johto-south-route';
import { installAzaleaDetails } from './azalea-layout';
import { installVioletDetails } from './violet-city-layout';
import { installLavenderDetails } from './lavender-layout';
import { installLavenderInteriors } from './lavender-interiors';
export type TourId=`tour_${string}`;
export type Theme='village'|'city'|'forest'|'mine'|'port'|'water'|'snow'|'temple'|'factory'|'ghost'|'flowers'|'coast'|'desert'|'dragon'|'airport'|'fair'|'cave';
export interface Place {id:TourId;name:string;region:string;theme:Theme;concept:string;landmark:string;x:number;y:number}
const groups:Record<string,[string,string,Theme,string,string,number,number][]>= {
  '신오':[
    ['jubilife','축복시티','city','방송탑과 분수 광장이 있는 교류 도시','방송국',2,5],['oreburgh','무쇠시티','mine','광석 더미와 운반 레일이 놓인 광산 도시','광산 전시관',3,6],
    ['eterna_forest','영원숲','forest','마을 사이에 남긴 짧은 숲 산책길','숲 안내소',2,4],['eterna','영원시티','temple','오래된 석상과 나무 정원이 있는 도시','역사관',3,3],
    ['coronet','천관산 하부','cave','신오 동서부를 잇는 짧은 암반 통로','산악 쉼터',4,4],['hearthome','연고시티','flowers','꽃 화단과 공연장으로 꾸민 도시','콘테스트 홀',5,5],
    ['veilstone','장막시티','city','계단식 광장과 백화점 거리','백화점',6,4],['pastoria','들판시티','water','습지와 나무 관찰 데크가 있는 도시','습지 관찰소',6,6],
    ['canalave','운하시티','port','운하와 창고, 지방을 잇는 부두','항만 사무소',1,5],['snowpoint','선단시티','snow','눈 덮인 집과 얼음 신전','선단신전',5,1],
    ['sunyshore','물가시티','coast','바닷가와 태양광 설비의 해안 도시','등대',7,5],['lake','신오 호수','water','호수 중앙의 작은 섬과 관찰 자리','호수 쉼터',4,2],
  ],
  '관동':[
    ['vermilion','갈색시티','port','주황 지붕의 항구와 교류 부두','여객 터미널',5,6],['pallet','태초마을','village','작은 집과 연구소, 남쪽 바닷바람','연구소',1,6],
    ['viridian','상록시티','forest','상록수와 낮은 울타리의 입구 도시','숲 안내관',1,4],['viridian_forest','상록숲','forest','상록과 회색을 잇는 짧은 숲길','숲 쉼터',1,3],
    ['pewter','회색시티','mine','회색 석재와 화석 전시의 도시','화석 박물관',2,2],['cerulean','블루시티','water','수로와 푸른 분수의 도시','수족관',5,2],
    ['celadon','무지개시티','flowers','정원과 꽃집, 백화점이 있는 도시','백화점',3,4],['saffron','노랑시티','city','높은 빌딩과 성도행 역','실프 사옥',5,4],
    ['lavender','보라타운','ghost','보랏빛 정원과 조용한 추모 탑','추모의 탑',7,4],['fuchsia','연분홍시티','forest','연못과 보호구역을 품은 도시','보호구역 안내소',5,7],
    ['cinnabar','홍련섬','desert','붉은 암반과 바닷가 연구 시설','화산 연구소',2,8],
  ],
  '성도':[
    ['goldenrod','금빛시티','city','금빛 지붕, 시장 광장과 국제역','라디오 타워',3,6],['violet','도라지시티','temple','전통 지붕과 새들이 쉬는 탑','모다피의 탑',5,3],
    ['azalea','고동마을','village','숲 가장자리의 공방과 작은 우물','규토리 공방',5,7],['ilex','너도밤나무숲','forest','34번도로와 고동을 잇는 깊은 숲과 순환길','숲 사당',4,7],
    ['ecruteak','인주시티','temple','전통 목조 거리와 오래된 탑','방울탑',3,3],['mahogany','황토마을','village','갈색 지붕과 산기슭 장터','산길 안내소',5,2],
    ['rage_lake','분노의호수','water','넓은 호수와 붉은 단풍 둑','호수 관찰소',5,1],['olivine','담청시티','port','등대 불빛이 비치는 항구','등대',1,4],
    ['cianwood','진청시티','coast','해변 바위와 수행 마당','바다 도장',0,6],['blackthorn','검은먹시티','dragon','푸른 암반과 용의 문양이 있는 도시','용의 사당',7,3],
  ],
  '하나':[
    ['castelia','구름시티','city','높은 빌딩과 해안 산책로','항구 갤러리',3,7],['aspertia','부채시티','village','전망 언덕과 학교 운동장','트레이너 학교',0,7],
    ['virbank','모란만시티','factory','굴뚝과 부두 창고가 있는 공업 도시','공장 견학관',1,8],['nimbasa','뇌문시티','fair','관람차와 밝은 놀이 광장','놀이공원 안내소',3,4],
    ['driftveil','물풍경시티','port','큰 창고와 광물 선적 부두','시장',2,3],['mistralton','궐수시티','airport','활주로와 화물 창고가 있는 도시','공항 터미널',2,1],['lentimas','산로마을','desert','화산재 바람과 붉은 암반이 이어지는 작은 마을','산길 안내소',4,1],['undella','물결마을','coast','산의 온기와 푸른 해변이 만나는 휴양 마을','해변 안내소',5,3],['lacunosa','보배마을','village','오래된 성벽과 공동 안뜰을 함께 돌보는 들판 마을','마을 기록관',5,2],
    ['opelucid','쌍용시티','dragon','석조 기둥과 용의 문양 광장','용의 역사관',6,2],['humilau','기하시티','coast','수상 데크와 밝은 해변 마을','해양 안내소',7,4],
    ['desert','리조트데저트','desert','구름과 뇌문 사이의 짧은 모래 유적','유적 쉼터',3,5],['dragonspiral','용나선탑','dragon','나선형 돌탑이 있는 작은 유적 마당','용나선탑',4,1],
  ],
};
export const PLACES:Place[]=Object.entries(groups).flatMap(([region,rows])=>rows.map(([id,name,theme,concept,landmark,x,y])=>({id:`tour_${id}` as TourId,name,theme,region,concept,landmark,x,y})));
export const placeById=(id:string)=>PLACES.find(p=>p.id===id);
const edgeNames=[
  ['jubilife','oreburgh'],['jubilife','eterna_forest'],['eterna_forest','eterna'],['eterna','coronet'],['coronet','hearthome'],['hearthome','veilstone'],['hearthome','pastoria'],['pastoria','sunyshore'],['veilstone','sunyshore'],['coronet','lake'],['lake','snowpoint'],['jubilife','canalave'],
  ['vermilion','cerulean'],['pallet','viridian'],['viridian','viridian_forest'],['viridian_forest','pewter'],['pewter','cerulean'],['viridian','celadon'],['cerulean','saffron'],['saffron','celadon'],['saffron','lavender'],['celadon','fuchsia'],['lavender','fuchsia'],['pallet','cinnabar'],['cinnabar','vermilion'],
  ['goldenrod','violet'],['goldenrod','ecruteak'],['goldenrod','ilex'],['ilex','azalea'],['azalea','violet'],['ecruteak','mahogany'],['mahogany','rage_lake'],['ecruteak','olivine'],['olivine','cianwood'],['mahogany','blackthorn'],
  ['castelia','virbank'],['virbank','aspertia'],['aspertia','castelia'],['castelia','desert'],['desert','nimbasa'],['nimbasa','driftveil'],['driftveil','mistralton'],['mistralton','opelucid'],['opelucid','humilau'],['mistralton','dragonspiral'],
  ['canalave','vermilion'],['saffron','goldenrod'],['olivine','castelia'],['humilau','canalave'],
];
export const TOUR_EDGES=edgeNames.map(([a,b])=>[`tour_${a}`,`tour_${b}`] as [TourId,TourId]);
export const TOUR_NEIGHBORS=(id:TourId)=>TOUR_EDGES.filter(e=>e.includes(id)).map(e=>e[0]===id?e[1]:e[0]);
export const TOUR_W=28,TOUR_H=24;
export interface TourBuilding {kind:'house'|'center'|'landmark';x:number;y:number;w:number;h:number;door:Point;room?:TourId}
export interface TourFeature extends Point {w:number;h:number;kind:'water'|'garden'|'rocks'|'grove'|'runway'|'fountain'|'rail'|'statue';name?:string;description?:string}
export const TOUR_BUILDINGS:Record<string,TourBuilding[]>={};
export const TOUR_PLANS:Record<string,ExpandedTown>={};
export const TOUR_FEATURES:Record<string,TourFeature[]>={};
export const TOUR_SPAWNS:Record<TourId,Point>={};
export const TOUR_MAPS={} as Record<TourId,GameMap>;
export const TOUR_INTERIORS:Record<string,TourInterior>={};
export const TOUR_OUTDOORS:Record<string,TourOutdoors>={};
export const TOUR_RESIDENTS:Record<string,TourResident[]>={};
const DIRECTION:Direction[]=['up','right','down','left'];
const slots:Record<Direction,{point:Point;spawn:Point;facing:Direction}>={up:{point:{x:14,y:2},spawn:{x:14,y:3},facing:'down'},right:{point:{x:26,y:12},spawn:{x:25,y:12},facing:'left'},down:{point:{x:14,y:22},spawn:{x:14,y:21},facing:'up'},left:{point:{x:1,y:12},spawn:{x:2,y:12},facing:'right'}};
export const SHORT_TOURS=new Set(['tour_eterna_forest','tour_coronet','tour_viridian_forest','tour_ilex','tour_desert']);
const shortSlots:typeof slots={up:{point:{x:10,y:2},spawn:{x:10,y:3},facing:'down'},right:{point:{x:18,y:9},spawn:{x:17,y:9},facing:'left'},down:{point:{x:10,y:16},spawn:{x:10,y:15},facing:'up'},left:{point:{x:1,y:9},spawn:{x:2,y:9},facing:'right'}};
const slotsFor=(id:string)=>id==='tour_eterna_forest'?{...shortSlots,down:ETERNA_FOREST_SOUTH}:id==='tour_coronet'?{...shortSlots,right:CORONET_EAST,down:CORONET_SOUTH}:id==='tour_ilex'?{...shortSlots,right:ILEX_FOREST_EAST}:SHORT_TOURS.has(id)?shortSlots:COMPACT_PLACES.has(id)?slots:expandedExits(placeById(id)!);
const exits:Record<string,Map<TourId,Direction>>={};
for(const p of PLACES){exits[p.id]=new Map();for(const dest of TOUR_NEIGHBORS(p.id)){const target=placeById(dest)!;const dx=target.x-p.x,dy=target.y-p.y;const desired=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';const direction=[desired,...DIRECTION].find(d=>![...exits[p.id].values()].includes(d as Direction)) as Direction;if(!direction)throw Error('Too many exits '+p.id);exits[p.id].set(dest,direction);}}
for(const [index,p]of PLACES.entries()){
  if(SHORT_TOURS.has(p.id)){
    const grid=p.id==='tour_eterna_forest'?makeEternaForestFloor():p.id==='tour_coronet'?makeCoronetFloor():p.id==='tour_ilex'?makeIlexForestFloor():Array.from({length:18},(_,y)=>Array.from({length:20},(_,x)=>x>=2&&x<=17&&y>=3&&y<=15?'.':'#'));
    if(p.theme==='cave'||p.theme==='desert')for(const[x,y]of [[4,5],[14,12]])for(let j=y;j<y+2;j++)for(let i=x;i<x+2;i++)grid[j][i]='#';
    const features=TOUR_LAYOUTS[p.id]?.features??[];
    for(const f of features)for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)grid[y][x]='#';
    const warps:GameMap['warps']=[];
    for(const[dest,dir]of exits[p.id]){
      const from=slotsFor(p.id)[dir],other=slotsFor(dest)[exits[dest].get(p.id)!];
      grid[from.point.y][from.point.x]='.';warps.push({...from.point,to:dest,spawn:other.spawn,entry:dir,facing:other.facing});
    }
    TOUR_MAPS[p.id]={id:p.id,name:p.name,width:grid[0].length,height:grid.length,background:p.id,walkable:grid.map(r=>r.join('')),warps,npcs:[{id:'tourGuide',name:'길 안내원',sprite:'rancher',x:12,y:7,facing:'down',dialogue:'tourGuide'}],props:[]};
    TOUR_SPAWNS[p.id]={x:10,y:10};TOUR_BUILDINGS[p.id]=[];TOUR_FEATURES[p.id]=features;continue;
  }
  const {width,height}=tourSize(p);
  const g=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3?'.':'#'));
  const houseY=index%2?19:18;
  let buildings:TourBuilding[]=[{kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:`${p.id}_center`},{kind:'landmark',x:17,y:7,w:8,h:3,door:{x:19,y:9},room:`${p.id}_hall`},{kind:'house',x:5,y:houseY,w:4,h:2,door:{x:6,y:houseY+1}},{kind:'house',x:20,y:houseY,w:4,h:2,door:{x:21,y:houseY+1}}];
  const feature:TourFeature={x:5,y:11,w:4,h:5,kind:['port','water','coast'].includes(p.theme)?'water':p.theme==='airport'?'runway':['mine','cave','desert','dragon'].includes(p.theme)?'rocks':p.theme==='forest'?'grove':'garden'};
  let scenery=TOUR_LAYOUTS[p.id]?.features??[feature,{x:12,y:15,w:3,h:2,kind:'fountain' as const}];
  if(!COMPACT_PLACES.has(p.id)){const plan=expandTown(p,scenery,TOUR_LAYOUTS[p.id]?.paths);TOUR_PLANS[p.id]=plan;buildings=plan.buildings;scenery=plan.features;}
  TOUR_BUILDINGS[p.id]=buildings;TOUR_FEATURES[p.id]=scenery;
  for(const r of [...buildings,...TOUR_FEATURES[p.id]])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)g[y][x]='#';
  for(const b of buildings)if(b.room)g[b.door.y][b.door.x]='.';
  const warps:GameMap['warps']=buildings.filter(b=>b.room).map(b=>({...b.door,to:b.room!,spawn:{x:8,y:10},entry:'up',facing:'up'}));
  for(const [dest,dir]of exits[p.id]){const from=slotsFor(p.id)[dir],other=slotsFor(dest)[exits[dest].get(p.id)!];g[from.point.y][from.point.x]='.';warps.push({...from.point,to:dest,spawn:other.spawn,entry:dir,facing:other.facing});}
  if(p.id==='tour_jubilife'){g[24][38]='.';/* Eastern walking connection to the original starting town. */}
  const npc={id:'tourGuide',name:'마을 안내원',sprite:['ace_trainer_f','rancher','school_kid_f','worker'][index%4],x:16,y:14,facing:'left' as Direction,dialogue:'tourGuide'};
  TOUR_MAPS[p.id]={id:p.id,name:p.name,width,height,background:p.id,walkable:g.map(r=>r.join('')),warps,npcs:[npc],props:buildings.filter(b=>!b.room).map(b=>({...b.door,dialogue:'tourHouse'}))};
  if(p.id==='tour_jubilife')TOUR_MAPS[p.id].warps.push({x:38,y:24,to:'town',spawn:{x:4,y:15},entry:'right',facing:'right'});
  TOUR_SPAWNS[p.id]={x:14,y:11};
  for(const b of buildings.filter(b=>b.room)){
    const room=b.room!,center=b.kind==='center';const rows=Array.from({length:14},(_,y)=>Array.from({length:16},(_,x)=>(x>=2&&x<=13&&y>=3&&y<=11)||(x===8&&y>=12)?'.':'#'));
    const interior=createTourInterior(p,center);TOUR_INTERIORS[room]=interior;
    const props:GameMap['props']=[];
    if(interior.reception){const r=interior.reception;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){rows[y][x]='#';props.push({x,y,dialogue:'tourHost'});}}
    for(const object of interior.objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
      rows[y][x]='#';props.push({x,y,dialogue:object.event});
    }
    TOUR_MAPS[room]={id:room,name:p.name+' · '+interior.title,width:16,height:14,background:room,walkable:rows.map(r=>r.join('')),warps:[{x:8,y:13,to:p.id,spawn:{x:b.door.x,y:b.door.y+1},entry:'down',facing:'down'}],npcs:[{id:'tourHost',name:center?'간호사':'시설 안내원',sprite:center?'pokecenter_nurse':interior.style==='workshop'?'worker':'scientist_f',...interior.host,facing:'down',dialogue:'tourHost'}],props};TOUR_SPAWNS[room]={x:8,y:10};
  }
}
{const route=createSinnohRoute218();TOUR_MAPS[SINNOH_ROUTE_218]=route.map;TOUR_FEATURES[SINNOH_ROUTE_218]=route.features;TOUR_BUILDINGS[SINNOH_ROUTE_218]=[];TOUR_SPAWNS[SINNOH_ROUTE_218]={x:2,y:13};}
for(const p of PLACES)TOUR_OUTDOORS[p.id]=prepareTourOutdoors(p,TOUR_MAPS[p.id],TOUR_FEATURES[p.id],SHORT_TOURS.has(p.id),placeById);
installIlexForestDetails(TOUR_MAPS.tour_ilex,TOUR_OUTDOORS.tour_ilex);
installAzaleaDetails(TOUR_MAPS.tour_azalea,TOUR_OUTDOORS.tour_azalea);
installVioletDetails(TOUR_MAPS.tour_violet,TOUR_OUTDOORS.tour_violet);
installLavenderDetails(TOUR_MAPS.tour_lavender,TOUR_OUTDOORS.tour_lavender);
installEternaClock(TOUR_MAPS.tour_eterna,TOUR_OUTDOORS.tour_eterna);
installEternaGardenCare(TOUR_MAPS.tour_eterna,TOUR_OUTDOORS.tour_eterna);
installHearthomePracticeGarden(TOUR_MAPS.tour_hearthome,TOUR_OUTDOORS.tour_hearthome);
installVeilstoneTrainingField(TOUR_MAPS.tour_veilstone,TOUR_OUTDOORS.tour_veilstone);
installPastoriaObservation(TOUR_MAPS.tour_pastoria,TOUR_OUTDOORS.tour_pastoria);
installSunyshoreObservation(TOUR_MAPS.tour_sunyshore,TOUR_OUTDOORS.tour_sunyshore);
installSinnohNorthObservation(TOUR_MAPS,TOUR_OUTDOORS);
installCanalaveWork(TOUR_MAPS.tour_canalave,TOUR_OUTDOORS.tour_canalave);
// The extended groves and rocks meet the map edge and one another. Register
// investigation faces only where a player can actually stand beside them.
// Preserve every original object and sign, including their event IDs.
for(const id of ['tour_eterna_forest','tour_coronet','tour_ilex'] as const){
  const map=TOUR_MAPS[id],added=TOUR_OUTDOORS[id].objects.slice(id==='tour_ilex'?4:5);
  const events=new Set(added.map(o=>o.event));
  const approachable=(p:Point)=>[[0,-1],[0,1],[-1,0],[1,0]].some(([dx,dy])=>{
    const x=p.x+dx,y=p.y+dy;
    return map.walkable[y]?.[x]==='.'&&!map.npcs.some(n=>n.x===x&&n.y===y)&&!map.warps.some(w=>w.x===x&&w.y===y);
  });
  for(const object of added)object.cells=object.cells.filter(approachable);
  map.props=map.props.filter(p=>!events.has(p.dialogue)||approachable(p));
}
export const TOUR_POKEMON:Record<string,TownPokemon>={};
for(const p of PLACES){const residents=createTourResidents(p.id);if(residents.length){TOUR_RESIDENTS[p.id]=residents;const pokemon=createTownPokemon(p);TOUR_POKEMON[p.id]=pokemon;TOUR_MAPS[p.id].npcs.push(...residents,pokemon)}}
TOUR_MAPS.tour_lentimas.npcs.push({id:'lentimasPilot',name:'궐수행 조종사',sprite:'ace_trainer_f',x:12,y:11,facing:'right',dialogue:'tourLentimasReturnFlight'});
buildJourneyWorld({places:PLACES,maps:TOUR_MAPS,buildings:TOUR_BUILDINGS,rooms:TOUR_INTERIORS,spawns:TOUR_SPAWNS});
installEternaInteriorSizes(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS);
installHearthomeInteriorSizes(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS);
installVeilstoneInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installPastoriaInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installSunyshoreInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installSinnohNorthInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installCanalaveInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installUnovaRouteOne({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS,edges:TOUR_EDGES,transitLinks:TRANSIT_LINKS});
installGoldenrodRoute({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installGoldenrodStation({places:PLACES,maps:TOUR_MAPS,rooms:TOUR_INTERIORS,parents:ROOM_PARENTS,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installGoldenrodHomes(TOUR_MAPS,TOUR_INTERIORS,FLOOR_INFO);
installCasteliaHomes(TOUR_MAPS,TOUR_INTERIORS,FLOOR_INFO);
installCasteliaInteriorSizes(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installVermilionInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installCinnabarHomes(TOUR_MAPS,TOUR_INTERIORS);
installGoldenrodRadioFloors(TOUR_MAPS,TOUR_INTERIORS);
installGoldenrodInteriorSizes(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installAzaleaInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS);
installLavenderInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS);
installNimbasaInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installDriftveilInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installMistraltonInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installLentimasInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installUndellaInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installLacunosaInteriors(TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,FLOOR_INFO);
installNimbasaWestRoute({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installUnovaRouteSix({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS,rooms:TOUR_INTERIORS,parents:ROOM_PARENTS});
installReversalMountainExterior({places:PLACES,maps:TOUR_MAPS,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installUnovaRouteThirteen({places:PLACES,maps:TOUR_MAPS,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installUnovaRouteTwelve({places:PLACES,maps:TOUR_MAPS,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installKantoRouteSix({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
installKantoLavenderApproach({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS,rooms:TOUR_INTERIORS,parents:ROOM_PARENTS});
installJohtoSouthRoute({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,outdoors:TOUR_OUTDOORS});
buildEternaApproaches(PLACES,TOUR_MAPS,PASSAGES,PASSAGE_PLACES,TOUR_SPAWNS);
installEternaCoronetApproach(PLACES,TOUR_MAPS,PASSAGES,PASSAGE_PLACES,TOUR_SPAWNS);
installSinnohRoute208(PLACES,TOUR_MAPS,PASSAGES,PASSAGE_PLACES,TOUR_SPAWNS);
installSinnohRoute209Solaceon({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,features:TOUR_FEATURES});
installSinnohRoute212({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,features:TOUR_FEATURES});
installSinnohSoutheastRoutes({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,features:TOUR_FEATURES});
installSinnohNorthRoute({places:PLACES,maps:TOUR_MAPS,passages:PASSAGES,passagePlaces:PASSAGE_PLACES,spawns:TOUR_SPAWNS,features:TOUR_FEATURES});
// Signs were authored before the connecting roads were inserted.
for(const route of ETERNA_APPROACHES)for(const [from,to] of [[route.a,route.b],[route.b,route.a]]){
  for(const sign of TOUR_OUTDOORS[from].signs.filter(sign=>sign.destination===to)){
    sign.pages=[`${sign.pages[0].split('\n')[0].split(' → ')[0]}\n${route.name}`,...sign.pages.slice(1)];
    sign.destination=route.id;sign.name=route.name;
  }
}
// Store the actual next map in exit signs; direction and tile never change.
for(const p of PLACES)for(const sign of TOUR_OUTDOORS[p.id].signs){
  const exit=TOUR_MAPS[p.id].warps.find(w=>w.entry===sign.direction&&PASSAGES[w.to]&&[PASSAGES[w.to].a.id,PASSAGES[w.to].b.id].includes(sign.destination as TourId));
  if(exit){const name=TOUR_MAPS[exit.to as TourId].name;sign.pages[0]=sign.pages[0].split(' → ')[0]+'\n'+name;sign.name=name;sign.destination=exit.to;}
}
for(const passage of Object.values(PASSAGES)){
  if(TOUR_OUTDOORS[passage.id])continue;
  const map=TOUR_MAPS[passage.id];
  TOUR_OUTDOORS[passage.id]={objects:[],signs:map.warps.map((w,i)=>({x:i?map.width-4:3,y:8,direction:w.entry,destination:w.to,name:map.name,event:'journeySign',pages:[`${map.name}\n← ${passage.a.name}\n→ ${passage.b.name}`,...(map.terrain?.length?['길에서 벗어난 풀밭에는\n다른 포켓몬이 살고 있을지도 모른다.']:['큰길과 산책길은 양쪽 출구로 이어집니다.'])]}))};
}
export function tourPlaceForMap(id:string){return placeById(id)??PASSAGE_PLACES[id]??ROOM_PARENTS[id]??PLACES.find(p=>id===p.id+'_center'||id===p.id+'_hall')}
