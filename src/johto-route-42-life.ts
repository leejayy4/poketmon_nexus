import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42 } from './johto-route-42';
import {handleMortarHeat} from './mortar-heat';
import {handleMortarRescue} from './mortar-rescue';
import {handleMortarDrainage} from './mortar-drainage';

const MAPS=new Set<string>([JOHTO_ROUTE_42,JOHTO_MT_MORTAR_1F]);

/** Keep Route 42 and Mt. Mortar guidance aligned with the implemented, optional branch. */
export function handleJohtoRoute42Life(g:Engine,event:string,skipStory=false):boolean{
  if(!skipStory&&handleMortarDrainage(g,event,()=>{if(!handleJohtoRoute42Life(g,event,true))g.say('작은 배수홈',['물 밖에 놓인 거름틀과 침전 받이다.']);}))return true;
  if(!skipStory&&handleMortarRescue(g,event,()=>{handleJohtoRoute42Life(g,event,true);}))return true;
  if(!skipStory&&handleMortarHeat(g,event,()=>{handleJohtoRoute42Life(g,event,true);}))return true;
  if(!MAPS.has(g.save.map))return false;
  const lead=g.save.party[0];
  const party=lead?`선두 ${SPECIES[lead.species].name} · HP ${lead.hp}/${lead.maxHp}`:'현재 함께 걷는 동료가 없다.';
  if(event==='journeyWalker'){
    if(g.save.map===JOHTO_ROUTE_42)g.say('42번도로 산물길 여행자',[party,'서쪽은 인주시티, 동쪽은 황토마을이며 가운데 북쪽 길이 절구산 1층으로 갈라진다.','절구산에 들어가지 않아도 본선으로 두 도시를 왕복할 수 있다.']);
    else g.say('절구산 산행객',[party,'남쪽 출구로 42번도로 가운데 분기에 돌아간다.','현재는 1층 암반 물길만 둘러볼 수 있고 깊은 층·폭포·특별 조우는 열리지 않았다.']);
    return true;
  }
  const titles:Record<string,string>={
    mortarNorthBypassMarker:'북쪽 횡단로 회전 표식',
    tourRoute42EcruteakStone:'인주 동쪽 42번도로 표석',tourRoute42MortarBoard:'절구산 선택 분기표',tourRoute42WaterRail:'산물길 관찰 난간',tourRoute42MahoganyStone:'황토 서쪽 도착 표지',
    tourMortarWaterTrace:'절구산 암반 물길',tourMortarEchoWall:'산바람 메아리벽',tourMortarDeepBoundary:'닫힌 깊은층 경계',tourMortarReturnBoard:'42번도로 귀환 표식',
  };
  if(!titles[event])return false;
  const route=g.save.map===JOHTO_ROUTE_42?'인주시티 ↔ 42번도로 ↔ 황토마을 · 가운데 북쪽 절구산 선택 분기':'절구산 1층 ↔ 남쪽 출구 ↔ 42번도로';
  const boundary=g.save.map===JOHTO_MT_MORTAR_1F||event==='tourRoute42MortarBoard'?'절구산 방문은 선택이다. 2·3층, 폭포, 특별 조우와 사건 완료는 아직 열리지 않았다.':'도로 옆 물길은 풍경 구역이며 수상 이동·낚시 조우를 제공하지 않는다.';
  g.say(titles[event],[party,route,boundary]);return true;
}
