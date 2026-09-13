import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { KANTO_ROUTE_SEVEN } from './kanto-saffron-approach';
import { KANTO_ROUTE_EIGHTEEN,KANTO_ROUTE_SEVENTEEN,KANTO_ROUTE_SIXTEEN } from './kanto-route-sixteen';

const CELADON_WEST='tour_viridian' as const;
const CELADON_MAPS=new Set([
  'tour_celadon','tour_celadon_center','tour_celadon_hall','tour_celadon_hall_2f','tour_celadon_hall_3f',
  'tour_celadon_mart','tour_celadon_home1','tour_celadon_home2',KANTO_ROUTE_SIXTEEN,KANTO_ROUTE_SEVENTEEN,KANTO_ROUTE_EIGHTEEN,
]);

/** Celadon travel, companion and research-preparation reactions without completing a main-story incident. */
export function handleCeladonLife(g:Engine,event:string):boolean{
  if(!CELADON_MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const visited=new Set(save.tourVisited??[]),owned=[...save.party,...(save.box??[])];
  const healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const route7Owned=owned.filter(mon=>mon.met==='관동 7번도로');
  const route7Names=[...new Set(route7Owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
  const route7Party=save.party.filter(mon=>mon.met==='관동 7번도로').length;
  const cyclingOwned=owned.filter(mon=>mon.met==='관동 16번도로'||mon.met==='관동 17번도로'||mon.met==='관동 18번도로');
  const cyclingNames=[...new Set(cyclingOwned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
  const route7Won=Boolean(save.flags['trainerWon:kanto-route-7-practice']);
  const researchStarted=Boolean(save.flags.celadonResearchContactStarted),researchField=Boolean(save.flags.celadonResearchRoute7Logged),researchCompared=Boolean(save.flags.celadonResearchSilphCompared),researchReturned=Boolean(save.flags.celadonResearchReturned);
  const partyLine=save.party.length?`현재 파티 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 파티가 비어 있다. 센터 PC에서 맡긴 동료를 확인할 수 있다.';
  const routeLine=`7번도로 ${visited.has(KANTO_ROUTE_SEVEN)?'방문':'미방문'} · 16번 ${visited.has(KANTO_ROUTE_SIXTEEN)?'방문':'미방문'} · 17번 ${visited.has(KANTO_ROUTE_SEVENTEEN)?'방문':'미방문'} · 18번 ${visited.has(KANTO_ROUTE_EIGHTEEN)?'방문':'미방문'} · 서쪽 번호 없는 연결 ${visited.has(CELADON_WEST)?'방문':'미방문'}`;
  const localLine=`7번도로 출신 보유 ${route7Owned.length}마리 · 현재 파티 ${route7Party}마리 · ${route7Names}`;
  const practiceLine=`7번도로 선택 트레이너 ${route7Won?'승리 기록 있음':'미승리'}`;
  const cyclingPracticeLine=`16번 선택 실전 ${save.flags['trainerWon:kanto-route-16-practice']?'승리':'미승리'} · 17번 ${save.flags['trainerWon:kanto-route-17-practice']?'승리':'미승리'} · 18번 ${save.flags['trainerWon:kanto-route-18-practice']?'승리':'미승리'}`;
  const cyclingLocalLine=`16·17·18번도로 출신 보유 ${cyclingOwned.length}마리 · ${cyclingNames}`;
  const researchLine=researchReturned?'연구 연락: 현장·공개 기록 비교 후 귀환 정리됨':researchCompared?'연구 연락: 실프 공개 기록 비교 후 무지개 귀환 필요':researchField?'연구 연락: 7번도로 현장 기록 후 실프 공개층 비교 필요':researchStarted?'연구 연락: 시작됨 · 7번도로 현장 기록 필요':'연구 연락: 백화점3층에서 시작 가능';
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string)=>()=>{if(!current())return;g.setTourDestination(map);g.say(title,[text,'지도에 목적지를 표시했다. 실제 거리와 표지를 따라 이동하자.']);};

  if(save.map===KANTO_ROUTE_SIXTEEN&&event==='journeyWalker'){
    const observed=Boolean(save.flags.celadonRoute16CompanionObserved),species=Number(save.flags.celadonRoute16ObservedSpecies??0);
    g.say('16번도로 도보 여행자',[partyLine,'북쪽 무지개시티 정원에서 남쪽 사이클링로드 관문까지 동료와 천천히 걷고 있어.',observed?(species&&SPECIES[species]?`${SPECIES[species].name}와 바람막이·난간·귀환 표지를 살핀 기록이 있구나.`:'혼자 도로 안전 지점을 살핀 기록이 있구나.'):'도보 여행 점검대에서 건강한 동료와 바람막이·난간·귀환 방향을 살필 수 있어.','관찰은 선택이며 야생 포획·배틀·자전거 조건이나 보상을 만들지 않아.']);return true;
  }
  if(save.map===KANTO_ROUTE_SIXTEEN&&event==='tourRoute16Pokemon'){
    const lead=save.party[0];g.say('여행자의 피카츄',[lead?`${SPECIES[lead.species].name}을 바라보고 귀를 세운 뒤 난간 안쪽으로 비켜 선다.`:'피카! 남쪽에서 불어오는 바람에 몸을 낮추고 여행자의 가방 곁을 지킨다.','사람과 함께 여행하는 생활 포켓몬이며 이 도로의 야생 조우·포획 대상이 아니다.']);return true;
  }
  if(save.map===KANTO_ROUTE_SIXTEEN&&event==='tourRoute16WalkingCheck'){
    const healthyParty=save.party.filter(mon=>mon.hp>0);
    const record=(species:number)=>{if(!current(KANTO_ROUTE_SIXTEEN))return;const first=!save.flags.celadonRoute16CompanionObserved;save.flags.celadonRoute16CompanionObserved=true;save.flags.celadonRoute16ObservedSpecies=species;g.persist();g.say('16번도로 동행 점검 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 도시 정원 바람막이·전망 난간·17번도로 인계 표석을 차례로 확인했다.`:'혼자 바람막이·전망 난간·17번도로 인계 표석을 차례로 확인했다.',first?'동행 점검 기록을 남겼다. HP·능력치·도구는 변하지 않는다.':'앞서 남긴 점검 기록을 갱신했다. 새 보상은 없다.','북쪽은 무지개시티, 남쪽은 독립17번도로와18번도로를 지나 연분홍시티다.']);};
    g.say('도보 여행 점검대',[partyLine,'건강한 동료와 도로의 바람·난간·귀환 표지를 살피거나 혼자 점검할 수 있다.','부상하거나 기절한 동료는 선택 목록에서 제외되며 실제 회복은 무지개시티 포켓몬센터에서 한다.'],undefined,[...healthyParty.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 점검한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(save.map===KANTO_ROUTE_SIXTEEN&&['tourRoute16GardenScreen','tourRoute16CyclingOverlook','tourRoute16Handoff'].includes(event)){
    const observed=Boolean(save.flags.celadonRoute16CompanionObserved),species=Number(save.flags.celadonRoute16ObservedSpecies??0);
    g.say(event==='tourRoute16GardenScreen'?'도시 정원 바람막이':event==='tourRoute16CyclingOverlook'?'사이클링로드 전망 난간':'17번도로 인계 표석',[event==='tourRoute16GardenScreen'?'무지개시티 화단에서 이어진 낮은 나무가 도시 쪽 바람을 누그러뜨린다.':event==='tourRoute16CyclingOverlook'?'남쪽17번도로의 긴 내리막과 그 너머18번도로 방향이 보인다.':'이 표석 남쪽부터 관동17번도로가 시작되고 18번도로를 지나 연분홍시티에 닿는다.',observed?(species&&SPECIES[species]?`${SPECIES[species].name}와 남긴 동행 점검 기록에 이 장소가 포함돼 있다.`:'혼자 남긴 도로 점검 기록에 이 장소가 포함돼 있다.'):'서쪽 도보 여행 점검대에서 동료와 세 안전 지점을 함께 확인할 수 있다.','조사와 휴식만으로 HP·아이템·돈·통행 상태는 변하지 않는다.']);return true;
  }

  if(save.map===KANTO_ROUTE_SEVENTEEN&&event==='journeyWalker'){
    const rested=Boolean(save.flags.celadonRoute17Rested),species=Number(save.flags.celadonRoute17RestSpecies??0);
    g.say('17번도로 휴게 여행자',[partyLine,'16번도로 아래에서 시작한 긴 내리막이라 중앙 휴게소에서 사람과 포켓몬의 호흡을 함께 살펴야 해.',rested?(species&&SPECIES[species]?`${SPECIES[species].name}와 중앙 휴게소에서 바람과 귀환 방향을 확인한 기록이 있구나.`:'혼자 중앙 휴게소와 귀환 방향을 확인한 기록이 있구나.'):'중앙 도보 휴게소에서 건강한 동료와 쉬거나 혼자 길을 확인할 수 있어.','휴식 기록은 선택이며 HP·상태·아이템·통행 조건은 바뀌지 않아.']);return true;
  }
  if(save.map===KANTO_ROUTE_SEVENTEEN&&event==='tourRoute17Pokemon'){
    const lead=save.party[0];g.say('여행자의 파치리스',[lead?`${SPECIES[lead.species].name} 쪽을 살핀 뒤 난간 기둥을 타고 여행자의 어깨로 돌아간다.`:'꼬리를 세워 내리막 바람을 재다가 여행자의 물병 곁에 앉는다.','여행자와 함께 쉬는 생활 포켓몬이며 17번도로의 야생 조우·포획 대상이 아니다.']);return true;
  }
  if(save.map===KANTO_ROUTE_SEVENTEEN&&event==='tourRoute17Rest'){
    const choices=save.party.filter(mon=>mon.hp>0);
    const record=(species:number)=>{if(!current(KANTO_ROUTE_SEVENTEEN))return;const first=!save.flags.celadonRoute17Rested;save.flags.celadonRoute17Rested=true;save.flags.celadonRoute17RestSpecies=species;g.persist();g.say('17번도로 휴게 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 난간 안쪽에서 내리막 바람을 피하고 남쪽18번도로 표지를 확인했다.`:'혼자 물과 신발을 점검하고 남쪽18번도로 표지를 확인했다.',first?'중앙 휴게소 기록을 남겼다. 실제 회복이나 도구 지급은 없다.':'앞서 남긴 휴게 기록을 갱신했다. 새 보상은 없다.','북쪽은16번도로·무지개시티, 남쪽은18번도로·연분홍시티다.']);};
    g.say('중앙 도보 휴게소',[partyLine,'건강한 동료와 바람을 피하거나 혼자 귀환 방향을 확인할 수 있다.','부상하거나 기절한 동료는 선택하지 않으며 실제 회복은 도시 포켓몬센터에서 한다.'],undefined,[...choices.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 점검한다',action:()=>record(0)},{label:'계속 이동한다',action:()=>{}}]);return true;
  }
  if(save.map===KANTO_ROUTE_SEVENTEEN&&['tourRoute17NorthView','tourRoute17WindMarker'].includes(event)){
    const rested=Boolean(save.flags.celadonRoute17Rested),species=Number(save.flags.celadonRoute17RestSpecies??0);
    g.say(event==='tourRoute17NorthView'?'북부 내리막 전망대':'남부 바람 표식',[event==='tourRoute17NorthView'?'북쪽 관문 너머로16번도로와 무지개시티 정원 방향이 층층이 보인다.':'바람판이 남쪽18번도로와 연분홍시티 방향으로 기울어 있다.',rested?(species&&SPECIES[species]?`${SPECIES[species].name}와 남긴 중앙 휴게 기록에서 이 귀환 방향을 확인했다.`:'혼자 남긴 중앙 휴게 기록에 이 귀환 방향이 적혀 있다.'):'중앙 도보 휴게소에서 동료와 이동 방향을 다시 확인할 수 있다.','조사만으로 HP·아이템·돈·통행 상태는 변하지 않는다.']);return true;
  }

  if(save.map===KANTO_ROUTE_EIGHTEEN&&event==='journeyWalker'){
    const checked=Boolean(save.flags.celadonRoute18ReturnChecked),species=Number(save.flags.celadonRoute18ReturnSpecies??0);
    g.say('18번도로 귀환 여행자',[partyLine,'연분홍시티에 들어가기 전 전 구간 지도에서 돌아갈 길도 확인하고 있어.',checked?(species&&SPECIES[species]?`${SPECIES[species].name}와18→17→16번도로의 귀환 방향을 확인한 기록이 있구나.`:'혼자18→17→16번도로의 귀환 방향을 확인한 기록이 있구나.'):'전 구간 지도에서 건강한 동료와 귀환 방향을 짚어 볼 수 있어.','기록은 선택이며 포획·배틀·자전거·보상을 요구하지 않아.']);return true;
  }
  if(save.map===KANTO_ROUTE_EIGHTEEN&&event==='tourRoute18Pokemon'){
    const lead=save.party[0];g.say('여행자의 고라파덕',[lead?`${SPECIES[lead.species].name}을 바라보다가 습지 냄새가 나는 동쪽 바람 쪽으로 고개를 돌린다.`:'머리를 감싸고 서 있다가 여행자가 가리키는 연분홍시티 쪽을 천천히 본다.','여행자와 함께 귀환 길을 확인하는 생활 포켓몬이며 야생 조우·포획 대상이 아니다.']);return true;
  }
  if(save.map===KANTO_ROUTE_EIGHTEEN&&event==='tourRoute18FullChart'){
    const choices=save.party.filter(mon=>mon.hp>0);
    const record=(species:number)=>{if(!current(KANTO_ROUTE_EIGHTEEN))return;const first=!save.flags.celadonRoute18ReturnChecked;save.flags.celadonRoute18ReturnChecked=true;save.flags.celadonRoute18ReturnSpecies=species;g.persist();g.say('18번도로 귀환 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 연분홍→18→17→16번도로→무지개시티의 귀환 순서를 짚었다.`:'혼자 연분홍→18→17→16번도로→무지개시티의 귀환 순서를 짚었다.',first?'전 구간 귀환 기록을 남겼다. 통행 조건이나 보상은 생기지 않는다.':'앞서 남긴 귀환 기록을 갱신했다. 새 보상은 없다.','동쪽은 연분홍시티, 서쪽은17번도로의 긴 내리막을 거꾸로 올라16번도로와 무지개시티로 이어진다.']);};
    g.say('사이클링로드 전 구간 지도',[partyLine,'건강한 동료와 귀환 순서를 확인하거나 혼자 지도를 읽을 수 있다.','이 확인은 이동 안내이며 HP·상태·아이템·돈을 바꾸지 않는다.'],undefined,[...choices.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 확인한다',action:()=>record(0)},{label:'연분홍으로 간다',action:()=>{}}]);return true;
  }
  if(save.map===KANTO_ROUTE_EIGHTEEN&&['tourRoute18ArrivalRail','tourRoute18FuchsiaVerge'].includes(event)){
    const checked=Boolean(save.flags.celadonRoute18ReturnChecked),species=Number(save.flags.celadonRoute18ReturnSpecies??0);
    g.say(event==='tourRoute18ArrivalRail'?'17번도로 도착 난간':'연분홍 외곽 풀바람터',[event==='tourRoute18ArrivalRail'?'서쪽 관문 너머로17번도로의 긴 내리막과 북쪽16번도로 방향이 보인다.':'동쪽에서 연분홍시티의 낮은 지붕과 습지 바람이 가까워진다.',checked?(species&&SPECIES[species]?`${SPECIES[species].name}와 남긴 전 구간 기록에서 이 방향을 확인했다.`:'혼자 남긴 전 구간 기록에 이 방향이 적혀 있다.'):'동쪽 전 구간 지도에서 동료와 귀환 순서를 확인할 수 있다.',event==='tourRoute18FuchsiaVerge'?'현재는 생활 풍경이며 야생 조우 장소로 등록하지 않았다.':'조사만으로 HP·아이템·돈·통행 상태는 변하지 않는다.']);return true;
  }

  if(event==='tourGuide'){
    g.say('무지개시티 안내원',[partyLine,routeLine,localLine,practiceLine,cyclingLocalLine,cyclingPracticeLine,researchLine,'동쪽은 7번도로를 지나 노랑시티, 남쪽은 16→17→18번도로를 거쳐 연분홍시티로 이어진다.','서쪽 상록 연결은 프로젝트가 만든 번호 없는 길이다. 관동 공식 도로로 표시하지 않는다.'],undefined,[
      {label:'센터에서 준비',action:guide('tour_celadon_center','무지개 회복·편성 안내','센터에서 간호사 회복과 PC 편성을 할 수 있다.')},
      {label:'백화점 둘러보기',action:guide('tour_celadon_hall','무지개 백화점 안내','여행 보급, 기술 역할, 정원 연구 연락 준비를 층별로 살펴볼 수 있다.')},
      {label:'동쪽 7번도로',action:guide(KANTO_ROUTE_SEVEN,'무지개 동쪽 안내','동쪽 출구에서 7번도로를 지나 노랑시티로 간다.')},
      {label:'남쪽 16번도로',action:guide(KANTO_ROUTE_SIXTEEN,'무지개 남쪽 안내','16번도로에서17번도로의 긴 내리막과18번도로의 마지막 동서길을 지나 연분홍으로 향한다.')},
      {label:'서쪽 번호 없는 길',action:guide(CELADON_WEST,'무지개 서쪽 안내','상록시티와 잇는 프로젝트 창작 연결이며 공식 도로 번호는 없다.')},
    ]);return true;
  }
  if(event==='tourCeladonWestBoard'||event==='tourCeladonRoute7Board'||event==='tourCeladonCyclingBoard'){
    const east=event==='tourCeladonRoute7Board',south=event==='tourCeladonCyclingBoard';
    g.say(east?'7번도로 도착 안내판':south?'사이클링로드 방향 표석':'서쪽 연결 안내판',[
      east?'무지개 동쪽 → 관동 7번도로 → 노랑시티':south?'무지개 남쪽 → 관동 16번도로 → 17번도로 → 18번도로 → 연분홍시티':'무지개 서쪽 → 번호 없는 프로젝트 연결 → 상록시티',
      east?`${localLine}\n${practiceLine}`:south?`16·17·18번도로가 각각 독립 맵으로 이어진다. 현재는 자전거 없이 도보로 왕복한다.\n${cyclingLocalLine}\n${cyclingPracticeLine}`:'이 길에 관동 공식 도로 번호를 붙이지 않는다.',
      east?'중앙 안전길은 포획·배틀 없이 통과할 수 있다. 풀밭 조우와 트레이너 실전은 선택이다.':'통행으로 아이템·포획·배지·사건 완료를 요구하지 않는다.',
    ]);return true;
  }
  if(event==='tourCeladonNursery'||event==='tourCeladonCompanionWater'){
    g.say(event==='tourCeladonNursery'?'꽃집 모종 작업대':'도시숲 동료 급수대',[partyLine,event==='tourCeladonNursery'?'7번도로 가장자리와 도시 화단의 빛·물·흙 기록을 비교해 모종을 나눈다.':'사람과 크기가 다른 포켓몬이 함께 쉬도록 높이가 다른 물그릇을 두었다.',route7Owned.length?`7번도로 출신 ${route7Names}도 도시의 향기와 그늘을 천천히 익히고 있다.`:'7번도로에서 만난 동료가 없어도 정원과 쉼터를 이용할 수 있다.',researchReturned?'연구진은 확인된 생활 반응과 아직 모르는 표식의 의미를 나누어 기록했다. 정원 돌봄은 평소처럼 이어진다.':researchStarted?'연구 연락 중에도 포켓몬의 휴식과 주민의 정원 일을 먼저 지킨다.':'백화점3층 연구 연락대는 이 생활 환경을 공개 기록과 비교할 준비를 하고 있다.',hurt.length||fainted.length?'여기서는 회복되지 않는다. 포켓몬센터 간호사에게 부탁하자.':'쉬어도 HP·상태·능력치는 바뀌지 않는다.']);return true;
  }
  if(event==='celadonCenterRouteChart'){
    g.say('무지개 여행 준비 지도',[routeLine,partyLine,localLine,practiceLine,cyclingLocalLine,cyclingPracticeLine],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current('tour_celadon_center'))return;g.panel='party';g.partyIndex=0;}},
      {label:'센터 PC에서 편성',action:()=>{if(current('tour_celadon_center'))g.setTourDestination('tour_celadon_center','pc');}},
      {label:'7번도로',action:guide(KANTO_ROUTE_SEVEN,'7번도로 안내','동쪽 향기정원을 지나 7번도로로 나간다.')},
      {label:'남쪽 16번도로',action:guide(KANTO_ROUTE_SIXTEEN,'16번도로 안내','여행 준비뜰 아래 출구에서16번→17번→18번도로를 차례로 지나 연분홍으로 간다.')},
    ]);return true;
  }
  if(event==='celadonCenterCompanionBench'||event==='celadonCenterPartyConsole'){
    g.say(event==='celadonCenterCompanionBench'?'정원 여행 동료 휴게석':'파티·기술 준비 단말',[partyLine,localLine,practiceLine,cyclingLocalLine,cyclingPracticeLine,hurt.length||fainted.length?'실제 회복은 앞쪽 간호사에게 부탁하자.':'7·16·17·18번도로의 선택 조우와 실전에 앞서 기술과 도구도 확인할 수 있다.','현지 포켓몬 포획이나 트레이너 승리는 통행 조건이 아니다.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current('tour_celadon_center'))return;g.panel='party';g.partyIndex=0;}},
      {label:'센터 PC에서 편성',action:()=>{if(current('tour_celadon_center'))g.setTourDestination('tour_celadon_center','pc');}},
      {label:route7Won?'7번도로 다시 걷기':'7번도로 선택 실전',action:guide(KANTO_ROUTE_SEVEN,'7번도로 준비','정원 가장자리 풀밭과 남쪽 선택 트레이너를 찾아갈 수 있다.')},
      {label:'그대로 쉰다',action:()=>{}},
    ]);return true;
  }
  if(event==='celadonDepartmentFloorGuide'||event==='celadonDepartmentTravelDisplay'||event==='celadonDepartmentCompanionSeat'){
    g.say('백화점 여행 보급층',[partyLine,routeLine,'기존 판매는 프렌들리숍에서 하며 이 층의 진열과 좌석은 조사·휴식 공간이다.','조사만으로 아이템·회복·통행 조건은 바뀌지 않는다.']);return true;
  }
  if(event==='celadonDepartmentMoveDesk'||event==='celadonDepartmentRoute7Case'||event==='celadonDepartmentTrainingBench'){
    g.say('백화점 기술 역할층',[partyLine,localLine,practiceLine,route7Owned.length?'7번도로 출신 동료를 현재 파티에 두면 야외에서 겪은 움직임과 현재 기술 구성을 함께 비교할 수 있다.':'현지 동료가 없어도 전시를 볼 수 있으며 포획은 선택이다.','공개 단말은 기술·능력·도구를 자동 변경하지 않는다.'],undefined,[{label:'현재 파티 확인',action:()=>{if(!current('tour_celadon_hall_2f'))return;g.panel='party';g.partyIndex=0;}},{label:'7번도로 길안내',action:guide(KANTO_ROUTE_SEVEN,'7번도로 실전 안내','중앙 안전길 밖의 조우와 트레이너는 선택이다.')},{label:'관찰을 마친다',action:()=>{}}]);return true;
  }
  if(event==='celadonDepartmentGardenSamples'||event==='celadonDepartmentGardenLounge'){
    g.say('백화점 정원 연구층',[routeLine,localLine,route7Owned.length?'도시 화단과 7번도로 출신 동료의 반응을 공개 관찰 기록에 함께 대조한다.':'도시 화단과 7번도로 가장자리 기록을 먼저 비교하고 있다. 현지 포획은 필수가 아니다.','이 관찰은 하린 연구 연락의 준비 자료이며 본편 단서나 사건 완료가 아니다.']);return true;
  }
  if(event==='celadonDepartmentResearchLink'){
    g.say('하린–무지개 연구 연락대',[`준비 기록 · 7번도로 ${visited.has(KANTO_ROUTE_SEVEN)?'방문':'미방문'} · 현지 보유 ${route7Owned.length}마리 · 선택 실전 ${route7Won?'승리':'미승리'}`,partyLine,'신오의 하린과 관동 연구진이 포켓몬의 휴식, 도시 장치, 야외 이동 기록을 비교할 공개 연락 자리다.','현재는 연락을 준비하는 공간이다. 조사해도 본편 단서·사건 완료·보상 플래그는 생기지 않는다.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current('tour_celadon_hall_3f'))return;g.panel='party';g.partyIndex=0;}},
      {label:'7번도로 현장 확인',action:guide(KANTO_ROUTE_SEVEN,'연구 현장 안내','동쪽 7번도로의 정원 경계와 선택 풀밭을 직접 살펴볼 수 있다.')},
      {label:'노랑 실프 공개층',action:guide('tour_saffron_hall','관동 연구 교류 안내','7번도로 건너 노랑시티 실프 사옥의 공개 생활 기술 전시로 이어진다.')},
      {label:'연락을 보류한다',action:()=>{}},
    ]);return true;
  }
  if(/^celadon(?:Mart|Home)/.test(event)){
    g.say('무지개 생활 기록',[partyLine,routeLine,localLine,practiceLine,'주민과 포켓몬이 정원·쇼핑·도로 여행을 함께 준비하는 공간이다. 조사만으로 회복·아이템·보상·본편 진행은 바뀌지 않는다.']);return true;
  }
  if(event==='tourResident0'||event==='tourResident1'){
    g.say(event==='tourResident0'?'도시 정원사':'백화점 손님',[partyLine,event==='tourResident0'?'7번도로의 바람과 도시 그늘이 이어지도록 꽃 높이와 향기를 나누어 심고 있어요.':'쇼핑 뒤에는 동료와 분수광장을 한 바퀴 걷고 남쪽 길을 떠날 준비를 해.',localLine,researchReturned?'연구진이 모르는 것은 모른다고 남겨 줘서 정원 기록도 평소 방식으로 계속 적을 수 있어.':researchStarted?'연구 연락 때문에 서두르지 않도록 사람과 포켓몬이 쉬는 시간도 함께 적고 있어.':'백화점 연구진이 정원의 평범한 하루를 비교 자료로 부탁했어.']);return true;
  }
  return false;
}
