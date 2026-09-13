import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { KANTO_ROUTE_EIGHTEEN,KANTO_ROUTE_SEVENTEEN,KANTO_ROUTE_SIXTEEN } from './kanto-route-sixteen';
import { KANTO_ROUTE_FIFTEEN,KANTO_ROUTE_FOURTEEN,KANTO_ROUTE_THIRTEEN,KANTO_ROUTE_TWELVE } from './kanto-fuchsia-east';

const FUCHSIA_MAPS=new Set([
  'tour_fuchsia','tour_fuchsia_center','tour_fuchsia_hall','tour_fuchsia_mart','tour_fuchsia_home1','tour_fuchsia_home2',
  KANTO_ROUTE_THIRTEEN,
  KANTO_ROUTE_TWELVE,
]);
const withWaGwa=(name:string)=>`${name}${((name.charCodeAt(name.length-1)-0xac00)%28)?'과':'와'}`;

/** Fuchsia travel, wetland observation and companion-care reactions without opening Safari rules. */
export function handleFuchsiaLife(g:Engine,event:string):boolean{
  if(!FUCHSIA_MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const visited=new Set(save.tourVisited??[]),owned=[...save.party,...(save.box??[])];
  const healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const roadOwned=owned.filter(mon=>['관동 13번도로','관동 14번도로','관동 15번도로','관동 16번도로','관동 17번도로','관동 18번도로'].includes(mon.met??''));
  const roadNames=[...new Set(roadOwned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
  const partyLine=save.party.length?`현재 파티 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 파티가 비어 있다. 센터 PC에서 맡긴 동료를 확인할 수 있다.';
  const routeLine=`12번 ${visited.has(KANTO_ROUTE_TWELVE)?'방문':'미방문'} · 13번 ${visited.has(KANTO_ROUTE_THIRTEEN)?'방문':'미방문'} · 14번 ${visited.has(KANTO_ROUTE_FOURTEEN)?'방문':'미방문'} · 15번 ${visited.has(KANTO_ROUTE_FIFTEEN)?'방문':'미방문'} · 16번 ${visited.has(KANTO_ROUTE_SIXTEEN)?'방문':'미방문'} · 17번 ${visited.has(KANTO_ROUTE_SEVENTEEN)?'방문':'미방문'} · 18번 ${visited.has(KANTO_ROUTE_EIGHTEEN)?'방문':'미방문'}`;
  const localLine=`13·14·15·16·17·18번도로 출신 보유 ${roadOwned.length}마리 · ${roadNames}`;
  const practiceLine=`선택 실전 · 12번 ${save.flags['trainerWon:kanto-route-12-practice']?'승리':'미승리'} · 13번 ${save.flags['trainerWon:kanto-route-13-practice']?'승리':'미승리'} · 14번 ${save.flags['trainerWon:kanto-route-14-practice']?'승리':'미승리'} · 15번 ${save.flags['trainerWon:kanto-route-15-practice']?'승리':'미승리'} · 16번 ${save.flags['trainerWon:kanto-route-16-practice']?'승리':'미승리'} · 17번 ${save.flags['trainerWon:kanto-route-17-practice']?'승리':'미승리'} · 18번 ${save.flags['trainerWon:kanto-route-18-practice']?'승리':'미승리'}`;
  const observed=Boolean(save.flags.fuchsiaPondObserved),observedSpecies=Number(save.flags.fuchsiaObservationSpecies??0);
  const washed=Boolean(save.flags.fuchsiaCareWashed),washedSpecies=Number(save.flags.fuchsiaCareSpecies??0);
  const observationLine=observed?(observedSpecies&&SPECIES[observedSpecies]?`관찰 연못: ${withWaGwa(SPECIES[observedSpecies].name)} 수위·발자국을 확인함`:'관찰 연못: 혼자 수위·발자국을 확인함'):'관찰 연못: 아직 기록 없음';
  const careLine=washed?(washedSpecies&&SPECIES[washedSpecies]?`돌봄뜰: ${withWaGwa(SPECIES[washedSpecies].name)} 발 세척 순서를 확인함`:'돌봄뜰: 혼자 세척 도구 순서를 확인함'):'돌봄뜰: 아직 기록 없음';
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string)=>()=>{if(!current())return;g.setTourDestination(map);g.say(title,[text,'지도에 목적지를 표시했다. 번호와 현장 표지를 따라 이동하자.']);};

  if(event==='tourRoute13FenceSurvey'){
    const record=(species:number)=>{if(!current(KANTO_ROUTE_THIRTEEN))return;save.flags.fuchsiaRoute13FenceSurveyed=true;save.flags.fuchsiaRoute13SurveySpecies=species;g.persist();g.say('13번도로 울타리 관찰 기록',[species&&SPECIES[species]?`${withWaGwa(SPECIES[species].name)} 서쪽 틈→가운데 굽이→동쪽 난간 순서로 바람과 통행 흔적을 살폈다.`:'혼자 서쪽 틈→가운데 굽이→동쪽 난간 순서로 바람과 통행 흔적을 살폈다.','관찰 기록만 저장했다. 회복·경험치·돈·아이템·통행 조건은 바뀌지 않는다.','서쪽은14번도로, 동쪽은 후속12번도로 인계 지점이며 이 사이에 동굴은 없다.']);};
    g.say('울타리 미로 관찰판',[save.flags.fuchsiaRoute13FenceSurveyed?'앞서 남긴 울타리 관찰 기록이 있다. 동료를 바꾸거나 혼자 다시 확인할 수 있다.':'울타리 사이 안전 본선과 세 관찰 순환로를 비교해 기록할 수 있다.',partyLine,'건강한 동료를 선택해도 야생 조우·배틀·보상은 발생하지 않는다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 기록한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(event==='tourRoute12BridgeCheck'){
    const record=(species:number)=>{if(!current(KANTO_ROUTE_TWELVE))return;save.flags.fuchsiaRoute12BridgeChecked=true;save.flags.fuchsiaRoute12BridgeSpecies=species;g.persist();g.say('사일런스브리지 동료 점검 기록',[species&&SPECIES[species]?`${withWaGwa(SPECIES[species].name)} 북쪽 난간→마른 발판→남쪽 귀환 표지를 차례로 확인했다.`:'혼자 북쪽 난간→마른 발판→남쪽 귀환 표지를 차례로 확인했다.','점검 기록만 저장했다. HP·경험치·돈·아이템·통행 조건은 바뀌지 않는다.','북쪽은 보라타운, 남쪽은13→14→15번도로와 연분홍시티 방향이다.']);};
    g.say('사일런스브리지 동료 점검대',[save.flags.fuchsiaRoute12BridgeChecked?'앞서 남긴 다리 점검 기록이 있다. 동료를 바꾸거나 혼자 다시 확인할 수 있다.':'긴 다리의 난간·마른 발판·양쪽 귀환 표지를 차례로 확인할 수 있다.',partyLine,'건강한 동료를 선택해도 낚시·수상 이동·야생 조우·보상은 발생하지 않는다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 점검한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(event==='tourRoute12Keeper'){
    const route13Owned=owned.filter(mon=>mon.met==='관동 13번도로'),names=[...new Set(route13Owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')||'아직 없음';
    g.say('사일런스브리지 관리인',[save.flags.fuchsiaRoute12BridgeChecked?'난간·마른 발판·귀환 표지 점검 기록이 남아 있어.':'동료 점검대에서 난간·마른 발판·귀환 표지를 차례로 확인할 수 있어.',`13번도로 출신 보유 동료 ${route13Owned.length}마리 · ${names}`,save.flags['trainerWon:kanto-route-12-practice']?'남쪽 바람막이 선택 실전 승리 기록이 있어.':'남쪽 바람막이의 선택 실전은 통행 조건이 아니야.','HGSS 기준 이 다리에는 육상 풀숲이 없다. 낚시와 수상 이동도 현재 지원하지 않는다.']);return true;
  }

  if(event==='tourGuide'){
    g.say('연분홍시티 안내원',[partyLine,routeLine,localLine,practiceLine,observationLine,careLine,'서쪽은 18→17→16번도로를 거쳐 무지개시티로 이어진다. 동쪽15→14→13번도로는 독립됐고12번도로는 후속 구간이다.','남쪽 19번수로는 전망만 열려 있다. 20번수로·쌍둥이섬·홍련 이동은 아직 개통하지 않았다.'],undefined,[
      {label:'센터에서 준비',action:guide('tour_fuchsia_center','연분홍 회복·편성 안내','센터에서 간호사 회복과 PC 편성을 할 수 있다.')},
      {label:'보호구역 안내소',action:guide('tour_fuchsia_hall','연분홍 관찰 안내','공개 관찰 범위와 도시·보호구역 경계를 확인한다.')},
      {label:'서쪽 18번도로',action:guide(KANTO_ROUTE_EIGHTEEN,'18번도로 귀환 안내','18번도로에서17번도로의 긴 오르막과16번도로를 차례로 지나 무지개시티로 돌아간다.')},
      {label:'동쪽 15번도로',action:guide(KANTO_ROUTE_FIFTEEN,'15·14·13번도로 안내','15번도로에서14번도로와13번도로 동쪽까지 왕복할 수 있다. 이후12번도로와 보라타운은 다음 독립 구간이다.')},
    ]);return true;
  }
  if(event==='tourFuchsiaPondGauge'){
    const record=(species:number)=>{if(!current('tour_fuchsia'))return;const first=!save.flags.fuchsiaPondObserved;save.flags.fuchsiaPondObserved=true;save.flags.fuchsiaObservationSpecies=species;g.persist();g.say('북동 관찰 연못 기록',[species&&SPECIES[species]?`${withWaGwa(SPECIES[species].name)} 물가 밖에서 수위표·젖은 발자국·풀 흔들림을 차례로 살폈다.`:'혼자 물가 밖에서 수위표·젖은 발자국·풀 흔들림을 차례로 살폈다.',first?'공개 관찰 기록을 남겼다. 포획·회복·아이템·보상은 없다.':'앞서 남긴 관찰 기록을 갱신했다. 새 보상은 없다.','남서 돌봄 작업뜰에서 같은 동료와 발 세척 순서를 이어 확인할 수 있다.']);};
    g.say('관찰 연못 수위표',[partyLine,'건강한 현재 파티 동료와 습지 흔적을 관찰하거나 혼자 기록할 수 있다.','보호구역 안으로 들어가거나 야생 포켓몬을 포획하는 활동이 아니다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 관찰한다',action:()=>record(0)},{label:'나중에 관찰한다',action:()=>{}}]);return true;
  }
  if(event==='tourFuchsiaCareWash'){
    if(!observed){g.say('돌봄 도구 세척대',['연못을 다녀온 동료의 발과 장비를 닦도록 높이가 다른 물그릇과 마른 수건이 놓여 있다.','먼저 북동 관찰 연못에서 건강한 동료와 흔적을 살피거나 혼자 관찰 기록을 남기자.','이 세척대는 포켓몬센터 회복 시설이 아니다.']);return true;}
    const partner=observedSpecies?save.party.find(mon=>mon.species===observedSpecies&&mon.hp>0):undefined;
    const record=(species:number)=>{if(!current('tour_fuchsia'))return;const first=!save.flags.fuchsiaCareWashed;save.flags.fuchsiaCareWashed=true;save.flags.fuchsiaCareSpecies=species;g.persist();g.say('돌봄 작업뜰 기록',[species&&SPECIES[species]?`${withWaGwa(SPECIES[species].name)} 낮은 물그릇→마른 수건→발판 정리 순서를 확인했다.`:'혼자 물그릇→마른 수건→발판 정리 순서를 확인했다.',first?'생활 돌봄 기록을 남겼다. HP·상태·능력치·도구는 변하지 않는다.':'앞서 남긴 돌봄 기록을 갱신했다. 새 보상은 없다.',partner?'관찰 연못에서 함께한 같은 동료가 건강한 상태로 순서를 이어 왔다.':'관찰 동료가 현재 건강한 파티에 없어 혼자 도구만 정리했다.']);};
    g.say('돌봄 도구 세척대',[observationLine,partner?`${withWaGwa(SPECIES[partner.species].name)} 관찰 뒤 세척 순서를 이어 확인할 수 있다.`:'관찰 때 함께한 동료가 현재 건강한 파티에 없으므로 혼자 도구 순서를 확인할 수 있다.','실제 회복은 포켓몬센터에서 한다.'],undefined,[...(partner?[{label:`${withWaGwa(SPECIES[partner.species].name)} 확인`,action:()=>{if(save.party.includes(partner)&&partner.hp>0)record(partner.species);}}]:[]),{label:'혼자 정리한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(['tourFuchsiaReserveRules','fuchsiaHallBoundaryModel','fuchsiaHallHabitatSamples','fuchsiaHallObservationRules','fuchsiaCenterReserveConsole'].includes(event)){
    const title=event==='fuchsiaHallBoundaryModel'?'도시·보호구역 경계 모형':event==='fuchsiaHallHabitatSamples'?'연못·숲 서식 표본':event==='fuchsiaHallObservationRules'?'공개 관찰 예절표':event==='tourFuchsiaReserveRules'?'보호구역 관찰 규칙판':'보호구역 준비 단말';
    g.say(title,[observationLine,careLine,localLine,'현재 공개 범위는 도시 연못과 생활 돌봄 기록이다. 독립 보호구역 맵·입장 제한·사파리볼·시간/걸음 제한·포획 보상은 아직 적용하지 않았다.']);return true;
  }
  if(['tourFuchsiaRoute18Arrival','fuchsiaCenterRouteChart','fuchsiaMartRouteChart','fuchsiaHomePatrolChart','fuchsiaHomeTravelBook'].includes(event)){
    const title=event==='tourFuchsiaRoute18Arrival'?'18번도로 도착 기록석':event==='fuchsiaCenterRouteChart'?'연분홍 여행·귀환 지도':event==='fuchsiaMartRouteChart'?'세 방향 준비표':event==='fuchsiaHomePatrolChart'?'보호숲 순찰표':'도로·수로 기록책';
    g.say(title,[routeLine,localLine,practiceLine,'서쪽: 연분홍 → 18번도로 → 17번도로 → 16번도로 → 무지개시티','동쪽: 연분홍 → 15번도로 → 14번도로 → 13번도로 · 후속12번도로 → 보라타운','남쪽: 19번수로 전망 · 20번수로·쌍둥이섬·홍련 이동 미개통']);return true;
  }
  if(event==='tourFuchsiaEastRoadBoard'||event==='tourFuchsiaRoute19Outlook'){
    g.say(event==='tourFuchsiaEastRoadBoard'?'15→14→13→12번도로 방향판':'19번수로 전망 표석',[event==='tourFuchsiaEastRoadBoard'?'동쪽15번도로→북쪽14번도로→울타리13번도로가 독립 연결됐다.':'남문에서 관동19번수로 연락선으로 왕복할 수 있으며 이후20번수로·쌍둥이섬·홍련 방향이다.',event==='tourFuchsiaEastRoadBoard'?'후속12번도로를 지나 보라타운에 닿는다. 이 구간에 동굴은 없다.':'현재19번수로는 안전 연락선으로 이동한다.20번수로·쌍둥이섬과 수상 조우·사건은 아직 열리지 않았다.',partyLine]);return true;
  }
  if(event==='tourPokemon'){
    const lead=save.party[0];g.say('돌봄뜰의 파치리스',[lead?`${SPECIES[lead.species].name}을 바라본 뒤 마른 수건 꾸러미 옆으로 비켜 선다.`:'낮은 물그릇 가장자리를 살피고 꼬리로 마른 발판을 톡톡 두드린다.','주민과 함께 지내는 생활 포켓몬이며 도시의 야생 조우·포획 대상이 아니다.',careLine]);return true;
  }
  if(event==='tourResident0'||event==='tourResident1'){
    const first=event==='tourResident0'?'연못 주변에서는 발소리를 낮춰 봐.\n한 자리에서 바라보는 재미도 있지.':'관찰한 풍경을 작은 그림으로 남겨요.\n안내소에서 본 표본도 그려 봤어요.';
    g.say(event==='tourResident0'?'보호구역 관찰자':'안내소 방문객',[first,partyLine,localLine,event==='tourResident0'?observationLine:careLine,hurt.length||fainted.length?'부상하거나 기절한 동료의 실제 회복은 센터 간호사에게 부탁하자.':'관찰과 돌봄 기록은 HP나 상태를 바꾸지 않는다.']);return true;
  }
  if(['fuchsiaCenterCompanionBench','fuchsiaMartWetlandShelf','fuchsiaMartPackingBench','fuchsiaHomeCareWash','fuchsiaHomeObservationBook','fuchsiaHomeCompanionRest','fuchsiaHomePatrolRest'].includes(event)){
    const titles:Record<string,string>={fuchsiaCenterCompanionBench:'습지 여행 동료 휴게석',fuchsiaMartWetlandShelf:'습지 여행 보급 진열',fuchsiaMartPackingBench:'가방·동료 건조석',fuchsiaHomeCareWash:'먹이 그릇 세척대',fuchsiaHomeObservationBook:'관찰 시간 기록책',fuchsiaHomeCompanionRest:'동료 발 말림자리',fuchsiaHomePatrolRest:'순찰 동료 쉼자리'};
    g.say(titles[event],[partyLine,localLine,observationLine,careLine,hurt.length||fainted.length?'이곳에서는 회복되지 않는다. 센터 간호사에게 부탁하자.':'휴식과 조사는 능력치·도구·돈을 바꾸지 않는다.']);return true;
  }
  return false;
}
