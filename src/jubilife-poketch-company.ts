import type { Engine } from './engine';
import type { Place,TourId } from './explore-world';
import type { Furnishing,TourInterior } from './explore-interiors';
import type { GameMap,Point } from './types';

export const JUBILIFE_POKETCH_FLOORS=['tour_jubilife_poketch_1f','tour_jubilife_poketch_2f','tour_jubilife_poketch_3f'] as const;
const makeObject=(kind:Furnishing['kind'],name:string,event:string,x:number,y:number,w:number,h:number,pages:string[]):Furnishing=>({kind,name,event,x,y,w,h,pages});

function makeFloor(id:TourId,name:string,objects:Furnishing[],npcs:GameMap['npcs'],warps:GameMap['warps']):GameMap{
  const rows=Array.from({length:20},(_,y)=>Array.from({length:24},(_,x)=>x>=2&&x<=21&&y>=3&&y<=17||x===12&&y>=18?'.':'#'));
  const props:GameMap['props']=[];
  for(const object of objects)for(let y=object.y;y<object.y+object.h;y++)for(let x=object.x;x<object.x+object.w;x++){
    rows[y][x]='#';props.push({x,y,dialogue:object.event});
  }
  for(const warp of warps)rows[warp.y][warp.x]='.';
  return {id,name,width:24,height:20,background:id,walkable:rows.map(row=>row.join('')),warps,npcs,props};
}

export function installJubilifePoketchCompany(a:{
  maps:Record<TourId,GameMap>;rooms:Record<string,TourInterior>;spawns:Record<TourId,Point>;
  roomParents:Record<string,Place>;floorParents:Record<string,TourId>;floorInfo:Record<string,{floor:number;total:number;title:string}>;place:Place;
}){
  const {maps,rooms,spawns,roomParents,floorParents,floorInfo,place}=a;
  const [f1,f2,f3]=JUBILIFE_POKETCH_FLOORS;
  const objects:Furnishing[][]=[
    [makeObject('console','여행 정보 단말','jubilifePoketchTravelConsole',4,5,4,2,['걸음과 방문 기록을 정리하는 견학용 단말이다.']),makeObject('chart','사방 도로 벽지도','jubilifePoketchRouteChart',13,5,5,2,['축복에서 갈라지는 네 도로가 표시되어 있다.']),makeObject('workbench','소형 장치 접수대','jubilifePoketchReception',5,11,5,2,['작은 화면과 단추를 점검하는 작업대다.'])],
    [makeObject('machine','걸음 계측 시제품','jubilifePoketchStepPrototype',4,5,5,2,['걸음에 따라 숫자가 바뀌는 시제품이다.']),makeObject('console','동료 상태 화면','jubilifePoketchPartyPrototype',14,5,4,2,['파티 상태 표시를 시험하는 화면이다.']),makeObject('chart','응용 프로그램 설계판','jubilifePoketchAppBoard',6,11,6,2,['여행 중 필요한 정보를 작은 화면에 배치한 설계다.'])],
    [makeObject('shelf','가족의 개발 수첩','jubilifePoketchFamilyNotes',4,5,5,2,['취미로 만든 장치가 작은 회사로 자란 기록이다.']),makeObject('bench','가족 거실','jubilifePoketchFamilyRoom',14,5,5,2,['개발실 위층에서 가족이 함께 쉬는 공간이다.']),makeObject('plants','창가 화분','jubilifePoketchWindow',8,11,3,2,['북쪽 도로를 향한 창가에 화분이 놓여 있다.'])],
  ];
  const warps:GameMap['warps'][]=[
    [{x:12,y:19,to:'tour_jubilife',spawn:{x:20,y:9},entry:'down',facing:'down'},{x:19,y:8,to:f2,spawn:{x:19,y:11},entry:'up',facing:'up'}],
    [{x:19,y:12,to:f1,spawn:{x:19,y:9},entry:'down',facing:'down'},{x:19,y:8,to:f3,spawn:{x:19,y:11},entry:'up',facing:'up'}],
    [{x:19,y:12,to:f2,spawn:{x:19,y:9},entry:'down',facing:'down'}],
  ];
  const npcs:GameMap['npcs'][]=[
    [{id:'jubilifePoketchPresident',name:'포켓치주식회사 사장',sprite:'scientist_m',x:12,y:8,facing:'down',dialogue:'jubilifePoketchPresident'}],
    [{id:'jubilifePoketchDeveloper',name:'포켓치 개발자',sprite:'scientist_f',x:12,y:9,facing:'left',dialogue:'jubilifePoketchDeveloper'}],
    [{id:'jubilifePoketchFamily',name:'사장 가족',sprite:'pokemon_breeder_f',x:13,y:9,facing:'right',dialogue:'jubilifePoketchFamily'}],
  ];
  const titles=['포켓치주식회사 1층 · 여행 장치 안내','포켓치주식회사 2층 · 개발실','포켓치주식회사 3층 · 가족 생활층'];
  for(let i=0;i<3;i++){
    const id=JUBILIFE_POKETCH_FLOORS[i] as TourId;
    maps[id]=makeFloor(id,'축복시티 · '+titles[i],objects[i],npcs[i],warps[i]);
    rooms[id]={style:i===2?'dojo':'lab',title:titles[i],host:{...npcs[i][0]},objects:objects[i],greeting:['작은 여행 장치와 가족 기업의 생활을 함께 살펴보는 층이다.']};
    spawns[id]=i?{x:19,y:10}:{x:12,y:16};roomParents[id]=place;floorInfo[id]={floor:i+1,total:3,title:titles[i]};
    if(i)floorParents[id]=JUBILIFE_POKETCH_FLOORS[i-1] as TourId;
  }
  const door=maps.tour_jubilife.warps.find(w=>w.to===f1);if(door)door.spawn={x:12,y:16};
}

const partyState=(g:Engine)=>{
  const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
  return g.save.party.length?`파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'파티가 비어 있다. 포켓몬센터 PC에서 동료를 편성할 수 있다.';
};

export function handleJubilifePoketchCompany(g:Engine,id:string):boolean{
  if(!JUBILIFE_POKETCH_FLOORS.includes(g.save.map as typeof JUBILIFE_POKETCH_FLOORS[number]))return false;
  if(id==='jubilifePoketchPresident'){
    g.say('포켓치주식회사 사장',['좋아하는 여행 장치를 만들던 일이 가족 회사로 자랐습니다.','이 견학실에서는 지금 가진 여행 기록을 작은 화면에 어떻게 보여 줄지 살펴볼 수 있어요.','시제품은 견학용이라 가져갈 수 없지만 세 층은 자유롭게 둘러볼 수 있어요.']);return true;
  }
  if(id==='jubilifePoketchDeveloper'){
    g.say('포켓치 개발자',[`현재 걸음 기록 ${g.save.steps}걸음`,partyState(g),'도시와 도로를 오갈 때 필요한 정보가 무엇인지 시제품 화면에 반영하고 있어요.']);return true;
  }
  if(id==='jubilifePoketchFamily'){
    g.say('사장 가족',['개발실 위층은 가족이 함께 생활하는 집이기도 해요.','사람과 포켓몬이 실제 여행에서 겪은 불편을 저녁 식탁에서 이야기하고 다음 시제품에 적어 둡니다.']);return true;
  }
  if(id==='jubilifePoketchTravelConsole'){
    const visited=new Set(g.save.tourVisited??[]),near=[['tour_sinnoh_route_202','202 남쪽'],['tour_sinnoh_route_203','203 동쪽'],['tour_sinnoh_route_204_south','204 북쪽'],['tour_sinnoh_route_218','218 서쪽']];
    g.say('여행 정보 단말',[`누적 걸음 ${g.save.steps} · 방문 장소 ${visited.size}`,near.map(([map,label])=>`${label} ${visited.has(map as TourId)?'방문':'미방문'}`).join(' · '),'표시 기록은 여행을 정리할 뿐 출구를 잠그지 않는다.']);return true;
  }
  if(id==='jubilifePoketchRouteChart'){
    g.say('사방 도로 벽지도',['북쪽 204번도로 · 동쪽 203번도로','남쪽 202번도로 · 서쪽 218번도로','무쇠시티 본선은 동쪽 203번도로에서 무쇠게이트 1층을 지난다.']);return true;
  }
  if(id==='jubilifePoketchReception'){
    g.say('소형 장치 접수대',['버튼·화면·끈의 마모를 살피는 작업대다.','현재는 견학용 시제품만 있으며 새 기기나 아이템을 받지는 않는다.']);return true;
  }
  if(id==='jubilifePoketchStepPrototype'){g.say('걸음 계측 시제품',[`화면에 ${g.save.steps}걸음이라고 표시된다.`,'도시와 도로를 직접 걸으면 누적 기록이 바뀐다.']);return true;}
  if(id==='jubilifePoketchPartyPrototype'){g.say('동료 상태 화면',[partyState(g),'실제 치료와 편성은 축복시티 포켓몬센터에서 한다.']);return true;}
  if(id==='jubilifePoketchAppBoard'){g.say('응용 프로그램 설계판',['걸음 수·파티 상태·지방 지도를 작은 화면에 나누어 배치한 설계다.','설계 관람은 포켓치 앱 획득이나 배지 보상이 아니다.']);return true;}
  if(id==='jubilifePoketchFamilyNotes'){g.say('가족의 개발 수첩',['처음에는 좋아하는 기능을 직접 만들었고, 여행자들의 의견이 쌓이며 회사가 되었다.','새 장치를 실제 아이템으로 가져가지는 않는다.']);return true;}
  if(id==='jubilifePoketchFamilyRoom'){g.say('가족 거실',['낮에는 개발 이야기가, 저녁에는 여행자와 포켓몬 이야기가 오가는 거실이다.']);return true;}
  if(id==='jubilifePoketchWindow'){g.say('북서쪽 창가',['창밖으로 204번도로 방면과 축복의 높은 건물이 보인다.','아래층 계단으로 같은 도시 거리로 돌아갈 수 있다.']);return true;}
  return false;
}
