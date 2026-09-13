import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_ROUTE_40,JOHTO_ROUTE_41,JOHTO_WHIRL_EXTERIOR } from './johto-sea-route';

const maps=new Set<string>([JOHTO_ROUTE_40,JOHTO_ROUTE_41,JOHTO_WHIRL_EXTERIOR]);

/** Explain the ferry-backed sea route without claiming Surf, whirlpool passage or island completion. */
export function handleJohtoSeaLife(g:Engine,event:string):boolean{
  if(!maps.has(g.save.map))return false;
  const save=g.save,lead=save.party[0],party=lead?`선두 ${SPECIES[lead.species].name} · HP ${lead.hp}/${lead.maxHp}`:'현재 함께 걷는 동료가 없다.';
  if(event==='journeyWalker'){
    if(save.map===JOHTO_ROUTE_40)g.say('40번수로 연락선 선원',[party,'북쪽 담청항에서 남쪽 41번수로 환승 데크까지 정기 연락선으로 이동한다.','파도타기 습득이나 야생 수상 조우로 기록하지 않으며 같은 배로 담청에 돌아갈 수 있다.']);
    else if(save.map===JOHTO_ROUTE_41)g.say('41번수로 연락선 선원',[party,'북쪽은 40번수로·담청, 남쪽은 진청시티, 서쪽 보조선은 소용돌이섬 외부다.','섬에 들르지 않아도 진청으로 갈 수 있고 내부 동굴·소용돌이 통과는 열리지 않았다.']);
    else g.say('소용돌이섬 외부 관찰자',[party,'바깥 암반과 바닷새 흔적만 살피는 선택 상륙지다.','동쪽 연락선으로 41번수로에 돌아간다. 동굴 내부·전설 포켓몬·사건 해결은 아직 열리지 않았다.']);
    return true;
  }
  const title:Record<string,string>={tourRoute40OlivineBoard:'40번수로 담청 승선표',tourRoute40CompanionShade:'연락선 동료 대기 그늘',tourRoute40TransferBoard:'41번수로 환승 표지',tourRoute41NorthBoard:'41번수로 북쪽 연락표',tourRoute41WhirlBoard:'소용돌이섬 외부 분기표',tourRoute41CianwoodBoard:'진청 상륙 준비대',tourWhirlOuterRock:'소용돌이섬 바깥 암반',tourWhirlClosedCave:'닫힌 동굴 경계표',tourWhirlReturnBoard:'41번수로 귀환 승선표'};
  if(!title[event])return false;
  const route=save.map===JOHTO_ROUTE_40?'담청시티 ↔ 40번수로 연락선 ↔ 41번수로 연락선':save.map===JOHTO_ROUTE_41?'40번수로·담청 ↔ 41번수로 ↔ 진청시티':'소용돌이섬 외부 ↔ 41번수로 연락선';
  g.say(title[event],[party,route,event==='tourWhirlClosedCave'||event==='tourRoute41WhirlBoard'?'섬 내부·소용돌이 통과·전설 조우는 미구현이며 외부 방문은 본선 조건이 아니다.':'현재 이동 수단은 정기 연락선과 상륙 데크다. 수상 기술을 얻은 것으로 처리하지 않는다.']);return true;
}
