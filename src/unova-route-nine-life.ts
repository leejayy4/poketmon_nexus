import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const BRIDGE='tour_tubeline_bridge',ROUTE='tour_unova_route_09',MALL_MAP='tour_unova_mall_nine_1f',SLOT='tubelinePartnerSlot',MON='tubelinePartnerSpecies',WEST='tubelineWestFrameChecked',DONE='tubelineCrossingChecked',MALL='routeNineMallFrontChecked',GRASS='routeNineGrassPathChecked';

/** Optional bridge inspection and Route 9 response without trains, rewards or travel gates. */
export function handleUnovaRouteNineLife(g:Engine,event:string):boolean{
  if(g.save.map!==BRIDGE&&g.save.map!==ROUTE&&g.save.map!==MALL_MAP)return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[MON]&&mon.hp>0?mon:undefined;};
  const species=SPECIES[Number(save.flags[MON]??0)]?.name,status=save.flags[DONE]?(species?`${species}와 서쪽·동쪽 철골 점검을 마쳤다.`:'서쪽·동쪽 철골 점검을 마쳤다.'):save.flags[WEST]?'서쪽 점검을 마쳤다. 다음은 동쪽 점검대다.':'서쪽 점검대에서 동행 관찰을 시작할 수 있다.';
  const guide=(map:Parameters<Engine['setTourDestination']>[0],target?:string)=>()=>{if(current())g.setTourDestination(map,target);};
  if(save.map===BRIDGE&&event==='tourGuide'){
    const healthy=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0);
    g.say('튜브라인브리지 점검원',[status,'서쪽은 하나 8번도로·설화시티, 동쪽은 하나 9번도로·쌍용시티다.','철골 점검은 선택이며 보행 통로는 항상 열려 있다. 열차 탑승이나 선로 진입은 없다.'],undefined,[...healthy.map(({mon,slot})=>({label:`${SPECIES[mon.species].name}와 점검`,action:()=>{if(!current(BRIDGE)||save.party[slot]!==mon||mon.hp<=0)return;save.flags[SLOT]=slot;save.flags[MON]=mon.species;delete save.flags[WEST];delete save.flags[DONE];g.persist();g.say('동행 철골 점검',[`${SPECIES[mon.species].name}와 서쪽 점검대부터 다리의 떨림과 바람을 살펴보자.`,'HP·경험치·능력치는 변하지 않는다.']);}})),{label:'서쪽 점검대',action:guide(BRIDGE,'tourTubelineWestFrame')},{label:'9번도로 방향',action:guide(ROUTE,'routeNineGuide')},{label:'안내를 마친다',action:()=>{}}]);return true;
  }
  if(save.map===BRIDGE&&event==='tourTubelineWestFrame'){
    const mon=selected();if(!mon){g.say('서쪽 철골 점검대',[status,'점검원에게서 건강한 동료를 선택하면 철골 떨림과 보행판 바람을 함께 비교할 수 있다.','점검 없이도 양쪽 도로로 자유롭게 건널 수 있다.']);return true;}
    const first=!save.flags[WEST];save.flags[WEST]=true;if(first)g.persist();g.say('서쪽 철골 관찰',[`${SPECIES[mon.species].name}와 8번도로 쪽 철골 떨림·보행판 바람·선로 경계를 확인했다.`,first?'서쪽 점검을 수첩에 기록했다.':'서쪽 기록을 다시 확인했다.','다음은 다리 동쪽 철골 점검대다.']);return true;
  }
  if(save.map===BRIDGE&&event==='tourTubelineEastFrame'){
    const mon=selected();if(!mon||!save.flags[WEST]){g.say('동쪽 철골 점검대',[status,'서쪽 점검대에서 건강한 동료와 시작하면 다리를 건넌 순서로 기록할 수 있다.','순서와 관계없이 9번도로 출구는 열려 있다.']);return true;}
    const first=!save.flags[DONE];save.flags[DONE]=true;if(first)g.persist();g.say('튜브라인브리지 횡단 기록',[`${SPECIES[mon.species].name}와 서쪽 8번도로 경계에서 동쪽 9번도로 경계까지 철골과 보행판을 비교했다.`,first?'다리 횡단 점검을 수첩에 기록했다.':'완성된 횡단 기록을 다시 확인했다.','열차를 타거나 선로에 들어가지 않았으며 보상·통행 조건은 없다.']);return true;
  }
  if(save.map===BRIDGE&&(event==='tourTubelineWest'||event==='tourTubelineSign')){g.say('튜브라인브리지 방향 표지',[status,'서쪽 → 하나 8번도로 → 설화시티','동쪽 → 하나 9번도로 → 쌍용시티','다리는 철골 보행 통로이며 열차 탑승 지점이 아니다.']);return true;}
  if(save.map===ROUTE&&event==='tourGuide'){
    const routeRecord=save.flags[GRASS]?'쇼핑몰 외부와 남쪽 방풍림을 함께 확인한 기록이 있습니다.':save.flags[MALL]?'쇼핑몰 외부를 확인했습니다. 다음은 남쪽 숲 풀길입니다.':'북쪽 건물 외부와 남쪽 숲 풀길을 둘러볼 수 있습니다.';
    g.say('9번도로 안내원',[save.flags[DONE]?`${species??'동료'}와 튜브라인브리지를 점검하고 건너온 기록이 있군요.`:'서쪽 튜브라인브리지는 하나 8번도로·설화시티로 이어져요.','동쪽 포장 본선은 쌍용시티 서문으로 이어지고, 북쪽은 쇼핑몰 나인 외부 접근부입니다.',routeRecord,'남쪽 숲 풀길은 현재 야생 조우 구역이 아니며 본선으로 돌아옵니다.'],undefined,[{label:'쇼핑몰 나인 외부',action:guide(ROUTE,'tourRouteNineMall')},{label:'남쪽 숲 풀길',action:guide(ROUTE,'tourRouteNineGrass')},{label:'튜브라인브리지',action:guide(BRIDGE,'tubelineGuide')},{label:'쌍용시티 서문',action:guide('tour_opelucid','tourOpelucidSign')},{label:'안내를 마친다',action:()=>{}}]);return true;
  }
  if(save.map===ROUTE&&event==='tourRouteNineMall'){
    const mon=selected();
    if(!mon){g.say('쇼핑몰 나인 외부 접근부',['북쪽 건물 앞의 넓은 진입 광장과 보행선·하역선이 바닥 무늬로 나뉜다.','튜브라인브리지 점검원에게서 건강한 동료를 선택했다면 바람과 짐수레가 겹치지 않는 길을 함께 확인할 수 있다.','쇼핑몰 실내·판매 서비스와 도시 결빙 사건은 아직 적용하지 않았다.']);return true;}
    const first=!save.flags[MALL];save.flags[MALL]=true;if(first)g.persist();g.say('쇼핑몰 나인 외부 기록',[`${SPECIES[mon.species].name}와 보행선·하역선·9번도로 본선의 경계를 확인했다.`,first?'외부 접근 순서를 여행 수첩에 기록했다.':'외부 접근 기록을 다시 확인했다.','다음은 남쪽 숲 풀길에서 건물 사이 바람을 막는 나무를 살펴볼 수 있다.','건물 안으로 들어가거나 물건을 받는 활동은 아니다.']);return true;
  }
  if(save.map===ROUTE&&event==='tourRouteNineGrass'){
    const mon=selected();
    if(!mon||!save.flags[MALL]){g.say('남쪽 숲 풀길',[save.flags[MALL]?'함께 기록하던 동료가 현재 건강한 파티에 있어야 이어서 살필 수 있다.':'먼저 북쪽 쇼핑몰 나인 외부에서 보행선과 하역선 경계를 확인하면 이 길의 역할을 이어 기록할 수 있다.','이 풀길은 포장 본선으로 돌아가며 현재 야생 조우 구역이나 도전자굴 입구가 아니다.']);return true;}
    const first=!save.flags[GRASS];save.flags[GRASS]=true;if(first)g.persist();g.say('9번도로 방풍림 기록',[`${SPECIES[mon.species].name}와 가로수 잎 방향·마른 흙·건물 사이에서 내려오는 바람을 확인했다.`,first?'쇼핑몰 외부에서 남쪽 방풍림까지의 여행 기록을 완성했다.':'완성된 9번도로 기록을 다시 확인했다.','HP·경험치·소지품·보상·통행은 바뀌지 않는다.']);return true;
  }
  if(save.map===ROUTE&&event==='tourRouteNineRest'){g.say('쌍용 서문 쉼터',[save.flags[DONE]?'튜브라인브리지 횡단 점검을 마친 동료가 마른 공터에서 숨을 고른다.':'다리를 건넌 사람과 포켓몬이 쌍용시티에 들어가기 전 쉬는 마른 공터다.','회복 시설은 아니며 실제 회복은 쌍용시티 포켓몬센터를 이용한다.']);return true;}
  if(save.map===ROUTE&&event==='tourPokemon'){
    const lead=save.party[0],leadName=lead?SPECIES[lead.species]?.name:undefined;
    g.say('서문 쉼터의 콩둘기',[save.flags[DONE]?'구구구. 다리 점검 수첩을 든 동료 쪽을 보다가 철골 안전등과 같은 방향으로 고개를 돌린다.':'구구구. 튜브라인브리지 쪽 철골 소리가 잦아들자 낮은 울타리에서 깃을 고른다.',leadName?`${leadName}이 다가오자 포장 본선을 비켜 쉼터 안쪽으로 두 걸음 옮긴다.`:'사람이 지나는 포장 본선을 비켜 쉼터 울타리 안쪽에 머문다.','안내원과 함께 이동하는 생활 포켓몬이며 9번도로 야생 조우나 포획 대상이 아니다.']);return true;
  }
  if(save.map===MALL_MAP&&event==='tourGuide'){g.say('쇼핑몰 나인 안내원',['현재 공개된 1층은 입고 정리대·여행용품 진열 구역·동행 휴게 구역을 중앙 통행선과 나누어 사용합니다.','남쪽 출구는 하나 9번도로로 돌아갑니다.','판매·상층 이동·도시 결빙 사건은 아직 적용하지 않았습니다.'],undefined,[{label:'입고 정리대',action:guide(MALL_MAP,'tourMallNineDeliveries')},{label:'여행용품 구역',action:guide(MALL_MAP,'tourMallNineTravelGoods')},{label:'동행 휴게 구역',action:guide(MALL_MAP,'tourMallNineRest')},{label:'9번도로 출구',action:guide(ROUTE,'tourRouteNineMall')},{label:'안내를 마친다',action:()=>{}}]);return true;}
  if(save.map===MALL_MAP&&event==='tourMallNineDeliveries'){g.say('쇼핑몰 나인 입고 정리대',[save.flags[MALL]?'외부에서 확인한 하역선이 이 정리대까지 이어진다. 짐수레는 중앙 보행선을 가로막지 않게 세워져 있다.':'9번도로 외부 하역선에서 들어오는 상자를 중앙 보행선 밖에서 정리하는 곳이다.','상자를 받거나 옮기는 의뢰는 아직 없다.']);return true;}
  if(save.map===MALL_MAP&&event==='tourMallNineTravelGoods'){g.say('여행용품 진열 구역',['몬스터볼과 상처약 모양의 진열표가 있지만 가격표는 덮여 있다.','현재 구매는 기존 프렌들리숍에서만 가능하며 이 진열대는 판매 기능이 아니다.']);return true;}
  if(save.map===MALL_MAP&&event==='tourMallNineRest'){const mon=selected();g.say('동행 휴게 구역',[mon?`${SPECIES[mon.species].name}가 중앙 통행선을 비운 벤치 옆에서 잠시 숨을 고른다.`:'사람과 포켓몬이 중앙 통행선을 비워 두고 쉬는 자리다.','휴게 표현이며 HP·상태·기술 횟수는 회복하지 않는다.']);return true;}
  if(save.map===MALL_MAP&&event==='tourMallNineFloorBoard'){g.say('쇼핑몰 나인 층별 준비 안내',['1층 · 입고 정리 / 여행용품 진열 / 동행 휴게 — 공개','상층 · 매장과 추가 시설 — 미구현','남쪽 출구 → 하나 9번도로 → 쌍용시티 / 튜브라인브리지']);return true;}
  return false;
}
