import type { Engine } from './engine';
import { handleSilphRecordsStory } from './silph-records-story';
import { handleSilphDiscrepancyStory } from './silph-discrepancy-story';
import { SPECIES } from './pokemon';
import { KANTO_ROUTE_EIGHT,KANTO_ROUTE_SEVEN,KANTO_UNDERGROUND_EW } from './kanto-saffron-approach';

const GOLDENROD_STATION='tour_goldenrod_station' as const;

const SAFFRON_MAPS=new Set([
  'tour_saffron','tour_saffron_center','tour_saffron_hall','tour_saffron_hall_2f','tour_saffron_hall_3f','tour_saffron_mart',
  'tour_saffron_home1','tour_saffron_home1_2f','tour_saffron_home1_3f','tour_saffron_home2','tour_saffron_home2_2f','tour_saffron_home2_3f','tour_saffron_home3','tour_saffron_home3_2f','tour_saffron_home3_3f',
]);

/** Saffron city life and travel reactions without adopting the Silph incident or a gym gate. */
export function handleSaffronLife(g:Engine,event:string):boolean{
  if(handleSilphRecordsStory(g,event))return true;
  if(handleSilphDiscrepancyStory(g,event,()=>{handleSaffronPublicLife(g,event);}))return true;
  return handleSaffronPublicLife(g,event);
}

function handleSaffronPublicLife(g:Engine,event:string):boolean{
  if(!SAFFRON_MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const visited=new Set(save.tourVisited??[]);
  const healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const allOwned=[...save.party,...(save.box??[])];
  const route7Owned=allOwned.filter(mon=>mon.met==='관동 7번도로'),route8Owned=allOwned.filter(mon=>mon.met==='관동 8번도로');
  const localOwned=[...route7Owned,...route8Owned];
  const localNames=[...new Set(localOwned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
  const localParty=save.party.filter(mon=>mon.met==='관동 7번도로'||mon.met==='관동 8번도로').length;
  const route7Won=Boolean(save.flags['trainerWon:kanto-route-7-practice']),route8Won=Boolean(save.flags['trainerWon:kanto-route-8-practice']);
  const partyLine=save.party.length?`현재 파티 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 파티가 비어 있다. 센터 PC에서 맡긴 동료를 확인할 수 있다.';
  const routeLine=`7번도로 ${visited.has(KANTO_ROUTE_SEVEN)?'방문':'미방문'} · 동서 지하통로 ${visited.has(KANTO_UNDERGROUND_EW)?'방문':'미방문'} · 8번도로 ${visited.has(KANTO_ROUTE_EIGHT)?'방문':'미방문'}`;
  const localLine=`현지 보유: 7번도로 ${route7Owned.length}마리 · 8번도로 ${route8Owned.length}마리 · 현재 파티 ${localParty}마리\n${localNames}`;
  const battleLine=`선택 실전: 7번도로 ${route7Won?'승리 기록':'미승리'} · 8번도로 ${route8Won?'승리 기록':'미승리'}`;
  const trainVisited=visited.has(GOLDENROD_STATION)||visited.has('tour_goldenrod');
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string)=>()=>{if(!current())return;g.setTourDestination(map);g.say(title,[text,'지도에 목적지를 표시했다. 실제 거리와 표지를 따라 이동하자.']);};

  if(event==='tourGuide'){
    g.say('노랑시티 안내원',[partyLine,routeLine,localLine,battleLine,trainVisited?'성도 금빛역 또는 금빛시티를 방문한 기록이 있다. 열차는 계속 무료로 왕복한다.':'남쪽 열차 연결은 성도 금빛역과 무료로 왕복한다.','서쪽7번도로→무지개, 동쪽8번도로→보라. 두 도로의 남쪽 입구는 동서 지하통로로 이어진다.','실프 사옥은 현재 공개 견학 공간이다. 도시 봉쇄·사옥 사건·체육관 조건은 없다.'],undefined,[
      {label:'센터에서 준비',action:guide('tour_saffron_center','노랑 회복·편성 안내','센터에서 간호사 회복과 PC 편성을 할 수 있다.')},
      {label:'실프 공개 견학',action:guide('tour_saffron_hall','실프 사옥 안내','공개된 세 층에서 생활 장치·안전 연구·도시 기술 전시를 살펴볼 수 있다.')},
      {label:'서쪽 7번도로',action:guide(KANTO_ROUTE_SEVEN,'노랑 서쪽 안내','서쪽 출구에서 7번도로를 지나 무지개시티로 간다.')},
      {label:'동쪽 8번도로',action:guide(KANTO_ROUTE_EIGHT,'노랑 동쪽 안내','동쪽 출구에서 8번도로를 지나 보라타운으로 간다.')},
      {label:'성도 금빛역',action:guide(GOLDENROD_STATION,'노랑 열차 안내','도시의 기존 열차 출구는 금빛역 대합실과 무료로 왕복한다.')},
    ]);return true;
  }
  if(event==='tourSaffronRoute7Board'||event==='tourSaffronRoute8Board'){
    const west=event==='tourSaffronRoute7Board';
    const caught=west?route7Owned.length:route8Owned.length,won=west?route7Won:route8Won;
    g.say(west?'7번도로 도착 안내판':'8번도로 도착 안내판',[west?'노랑 서쪽 → 관동7번도로 → 무지개시티':'노랑 동쪽 → 관동8번도로 → 보라타운','선택 우회: 7번도로 남쪽 → 동서 지하통로 → 8번도로 남쪽',west?'정원 가장자리 선택 풀밭: 나옹·구구 Lv.23~25':'도시 외곽 선택 풀밭: 구구·깨비참·아보 Lv.23~25',`이 도로 출신 보유 동료 ${caught}마리 · 선택 트레이너 ${won?'승리 기록 있음':'미승리'}`,'지상 큰길과 지하통로는 포획·배틀 없이도 자유롭게 왕복한다.']);return true;
  }
  if(event==='tourSaffronResearchGarden'||event==='tourSaffronCompanionWater'){
    const garden=event==='tourSaffronResearchGarden';
    g.say(garden?'연구 휴게정원 관찰대':'공동주택 동료 급수대',[partyLine,garden?'연구원과 포켓몬이 실내 작업 뒤 빛과 바람을 쬐는 곳이다.':'주민이 높이가 다른 물그릇을 씻고 채우는 생활 장소다.',hurt.length||fainted.length?'부상하거나 기절한 동료는 이곳에서 회복되지 않는다. 포켓몬센터 간호사에게 부탁하자.':'동료가 쉬어도 HP·상태·능력치는 변하지 않는다.']);return true;
  }
  if(event==='tourSaffronRailMarker'||event==='saffronHome3TrainChart'){
    g.say('성도행 열차 안내',[trainVisited?'금빛역 또는 금빛시티를 방문한 기록이 있다. 같은 열차로 돌아올 수 있다.':'노랑시티와 성도 금빛역을 잇는 열차다.','승차권·포획·사옥 견학·체육관 승리는 요구하지 않는다.'],undefined,[
      {label:'금빛역 길안내',action:guide(GOLDENROD_STATION,'금빛역행 열차','도시의 열차 출구를 이용하면 금빛역 대합실에 도착한다.')},
      {label:'현재 파티 확인',action:()=>{if(!current())return;g.panel='party';g.partyIndex=0;}},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(event==='saffronCenterTravelChart'){
    g.say('노랑 동서 여행 지도',[routeLine,partyLine,localLine,battleLine,'지상 본선: 무지개 → 7번도로 → 노랑 → 8번도로 → 보라','선택 우회: 7번도로 → 동서 지하통로 → 8번도로'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current('tour_saffron_center'))return;g.panel='party';g.partyIndex=0;}},
      {label:'센터 PC 안내',action:()=>{if(!current('tour_saffron_center'))return;g.setTourDestination('tour_saffron_center','pc');g.say('노랑 편성 안내',['센터 PC에서 파티와 박스 동료를 맡기거나 데려올 수 있다.','지도 표시는 자동 편성이나 회복을 하지 않는다.']);}},
      {label:'7번도로',action:guide(KANTO_ROUTE_SEVEN,'7번도로 안내','서쪽 큰길로 나가 무지개 방향 7번도로에 들어간다.')},
      {label:'동서 지하통로',action:guide(KANTO_UNDERGROUND_EW,'동서 지하통로 안내','7번 또는 8번도로의 남쪽 입구에서 노랑 아래의 보행 통로로 들어간다.')},
      {label:'8번도로',action:guide(KANTO_ROUTE_EIGHT,'8번도로 안내','동쪽 큰길로 나가 보라 방향 8번도로에 들어간다.')},
    ]);return true;
  }
  if(event==='saffronCenterCommuterBench'||event==='saffronCenterPartyConsole'){
    g.say(event==='saffronCenterCommuterBench'?'도시 통근 동료 휴게석':'파티·PC 준비 단말',[partyLine,localLine,battleLine,hurt.length||fainted.length?'실제 회복은 앞쪽 간호사에게 부탁하자.':'도로와 열차를 이용하기 전 기술과 도구도 확인할 수 있다.','현지 동료가 PC에만 있다면 편성한 뒤 선택 실전에 데려갈 수 있다. 필수 포획이나 자동 편성은 없다.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current('tour_saffron_center'))return;g.panel='party';g.partyIndex=0;}},
      {label:'센터 PC에서 편성',action:()=>{if(current('tour_saffron_center'))g.setTourDestination('tour_saffron_center','pc');}},
      {label:route7Won?'7번도로 다시 걷기':'7번도로 선택 실전',action:guide(KANTO_ROUTE_SEVEN,'7번도로 포획·실전','중앙 안전길에서 벗어난 정원 풀밭과 남쪽 마른 공터의 선택 트레이너를 찾아갈 수 있다.')},
      {label:route8Won?'8번도로 다시 걷기':'8번도로 선택 실전',action:guide(KANTO_ROUTE_EIGHT,'8번도로 포획·실전','중앙 안전길에서 벗어난 외곽 풀밭과 꽃둑 안쪽 공터의 선택 트레이너를 찾아갈 수 있다.')},
      {label:'그대로 쉰다',action:()=>{}},
    ]);return true;
  }
  if(event==='saffronSilphFloorGuide'||event==='saffronSilphTransitChart'){
    g.say(event==='saffronSilphFloorGuide'?'실프 사옥 공개 층 안내':'관동·성도 교류 노선도',['1층 생활 제품 전시 → 2층 장치 안전 연구 → 3층 도시 기술·교통 전시',routeLine,trainVisited?'금빛 방향 이동 기록도 노선도에 이어서 볼 수 있다.':'노랑–금빛 무료 열차는 지상 도로와 별도 노선이다.','공개 견학은 사옥 사건·봉쇄 해결이나 체육관 진행으로 기록되지 않는다.']);return true;
  }
  if(event==='saffronSilphLifeDisplay'||event==='saffronSilphSafetyDesk'||event==='saffronSilphObservationLog'||event==='saffronSilphCityModel'||event==='saffronSilphVisitorLog'){
    g.say('실프 공개 견학',[partyLine,localOwned.length?`7·8번도로 출신 ${localNames}의 체형과 이동 반응도 생활 장치 설명에 대조할 수 있다.`:'7·8번도로에서 만난 동료를 데려오면 도시 장치와 야외 생활의 차이를 함께 살펴볼 수 있다.',event==='saffronSilphLifeDisplay'?'조명·급수·보관 장치를 사람과 포켓몬이 함께 쓰는 모습을 전시한다.':event==='saffronSilphSafetyDesk'||event==='saffronSilphObservationLog'?'동료의 체형과 반응을 살펴 장치 출력을 낮추고 안전 기록을 남긴다.':'센터·주택·역에서 쓰이는 생활 기술과 교통 연결을 공개 자료로 살펴본다.','현재 동료와 함께 관찰할 수 있지만 새 아이템·능력·보상·진행 플래그는 생기지 않는다.']);return true;
  }
  if(event==='tourResident0'||event==='tourResident1'){
    g.say(event==='tourResident0'?'거리 직장인':'기술 연구원',[partyLine,event==='tourResident0'?'7번과 8번 사이 큰길을 걸으며 동료와 점심 뒤 한 바퀴 쉬고 있어.':'실프 공개 층에서 생활 장치의 밝기와 소리가 포켓몬에게 편한지 정리하고 있어요.',routeLine]);return true;
  }
  if(event==='tourPokemon'){
    const lead=save.party[0];g.say('업무 거리의 피카츄',[lead?`${SPECIES[lead.species].name}을 바라보고 귀를 세운 뒤 낮은 급수대 쪽으로 비켜 선다.`:'피카! 출퇴근 큰길의 사람들을 살피며 낮은 급수대 곁에서 쉬고 있다.','도시 주민과 생활하는 포켓몬이며 이곳의 야생 조우·포획 대상이 아니다.']);return true;
  }
  if(/^saffron(?:Mart|Home)/.test(event)){
    g.say('노랑 생활 기록',[partyLine,routeLine,localLine,battleLine,trainVisited?'금빛과 노랑을 오간 생활 기록이 이어져 있다.':'도로 통근과 금빛행 열차 준비를 나누어 기록했다.','주민과 포켓몬이 함께 쓰는 생활 공간이며 조사만으로 회복·아이템·보상·통행 변화는 없다.']);return true;
  }
  return false;
}
