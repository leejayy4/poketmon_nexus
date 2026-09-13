import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import {handleEcruteakDisclosure} from './ecruteak-disclosure';

const ECRUTEAK_MAPS=new Set(['tour_ecruteak','tour_ecruteak_center','tour_ecruteak_hall','tour_ecruteak_hall_2f','tour_ecruteak_hall_3f','tour_ecruteak_mart','tour_ecruteak_home1','tour_ecruteak_home2']);
const SOUTH_ROUTE=[
  ['tour_johto_route_35','35번도로'],
  ['tour_johto_national_park','자연공원'],
  ['tour_johto_route_36','36번도로'],
  ['tour_johto_route_37','37번도로'],
] as const;

/** Ecruteak city life and a voluntary three-floor companion heritage activity. */
export function handleEcruteakLife(g:Engine,event:string):boolean{
  if(handleEcruteakDisclosure(g,event))return true;
  if(!ECRUTEAK_MAPS.has(g.save.map))return false;
  const save=g.save,originMap=save.map,player=save.player,originX=player.x,originY=player.y;
  const current=(map=originMap)=>g.save===save&&save.player===player&&save.map===map&&player.x===originX&&player.y===originY&&!g.battle;
  const visited=new Set(save.tourVisited??[]),visitedRoutes=SOUTH_ROUTE.filter(([id])=>visited.has(id));
  const routeLine=visitedRoutes.length
    ?`남쪽 여행 기록 ${visitedRoutes.length}/4 · ${visitedRoutes.map(([,name])=>name).join('·')}`
    :'35번도로·자연공원·36번도로·37번도로의 방문 기록은 아직 없다.';
  const healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const partyLine=save.party.length?`동료 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 함께 걷는 동료가 없다. 센터 PC에서 맡긴 동료를 확인할 수 있다.';
  const localOrigins=new Set(['성도 35번도로','자연공원','성도 36번도로','성도 37번도로']);
  const localParty=save.party.filter(mon=>localOrigins.has(mon.met)),localBox=(save.box??[]).filter(mon=>localOrigins.has(mon.met));
  const local=[...localParty,...localBox],localNames=[...new Set(local.map(mon=>SPECIES[mon.species].name))].slice(0,5).join('·')||'아직 없음';
  const localLine=local.length?`성도 중부에서 만난 보유 동료 ${local.length}마리 · 파티 ${localParty.length} · PC ${localBox.length}\n${localNames}`:'35번도로·자연공원·36번도로·37번도로에서 잡은 동료는 아직 없다.';
  const partner=Number(save.flags.ecruteakTowerPartnerSpecies??0),partnerName=SPECIES[partner]?.name;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string,eventId?:string)=>()=>{
    if(!current())return;g.setTourDestination(map,eventId);g.say(title,[text,'아래 지도에 목적지를 표시했다. 실제 표지와 길을 따라 걸어가자.']);
  };
  const partnerInParty=()=>save.party.find(mon=>mon.species===partner&&mon.hp>0);

  if(save.map==='tour_ecruteak'&&event==='tourGuide'){
    g.say('인주시티 안내원',[partyLine,routeLine,localLine,'방울탑 공개 층에서는 동료와 방울·목조 짜임·바람을 차례로 관찰할 수 있다. 전설 포획이나 체육관 진행과는 별개다.'],undefined,[
      {label:'센터에서 준비',action:guide('tour_ecruteak_center','인주 회복 안내','포켓몬센터에서 실제 회복과 PC 편성을 할 수 있다.')},
      {label:'방울탑 공개 층',action:guide('tour_ecruteak_hall','방울탑 안내','1층 방울 소리 비교대에서 건강한 동료와 관찰을 시작한다.','ecruteakTowerBellTable')},
      {label:'37번도로',action:guide('tour_johto_route_37','인주 남쪽 안내','남문에서 37번도로로 내려가 36번도로 갈림길에 닿는다.')},
      {label:'서쪽 담청 방향',action:guide('tour_johto_route_38','인주 서쪽 안내','서문에서 38번도로로 나가 39번도로·튼튼목장 분기를 지나 담청시티로 간다.')},
      {label:'동쪽 황토 방향',action:guide('tour_johto_route_42','인주 동쪽 안내','42번도로 본선은 황토마을로 이어지고 가운데 북쪽에서 절구산 1층 선택 분기가 갈라진다.')},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourEcruteakRoute37Stone'){
    g.say('37번도로 도착 기록석',['금빛시티 → 35번도로 → 자연공원 → 36번도로 → 37번도로 → 인주시티',routeLine,'방문 기록은 포획·보상·통행 조건이 아니다.'],undefined,[
      {label:'37번도로 표시',action:guide('tour_johto_route_37','37번도로 안내','남문에서 단풍길을 따라 36번도로 갈림길로 내려간다.')},
      {label:'센터 표시',action:guide('tour_ecruteak_center','인주센터 안내','여행 뒤 실제 회복과 PC 편성을 할 수 있다.')},
      {label:'기록을 덮는다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourEcruteakBellStreet'){
    g.say('방울탑 전승 거리 표식',[partnerName?`${partnerName}와 방울탑을 관찰한 기록이 있다.`:'방울탑 1층에서 건강한 동료와 공개 전시 관찰을 시작할 수 있다.','돌등 사이 목조 거리는 주민과 포켓몬이 함께 관리한다. 전설을 부르는 의식은 아니다.'],undefined,[{label:'방울탑 1층',action:guide('tour_ecruteak_hall','방울탑 안내','1층 방울 소리 비교대로 간다.','ecruteakTowerBellTable')},{label:'그대로 둔다',action:()=>{}}]);return true;
  }
  if(event==='tourEcruteakBurnedBoundary'){g.say('불탄탑 외부 보존선',['그을린 기와와 돌기단을 더 훼손하지 않도록 바깥에서 관찰한다.','내부 탐험·전설 등장·사건 해결은 현재 적용하지 않았다.']);return true;}
  if(event==='tourEcruteakRoute38Stone'){g.say('서쪽 목초지 방향 표석',['인주시티 → 38번도로 → 39번도로·튼튼목장 분기 → 담청시티','튼튼목장은 선택 생활 구역이며 방문하지 않아도 담청까지 갈 수 있다.','모든 구간은 같은 길로 돌아올 수 있다.']);return true;}
  if(event==='tourEcruteakRoute42Stone'){g.say('동쪽 산길 방향 표석',['현재 본선: 인주시티 → 42번도로 → 황토마을','선택 분기: 42번도로 가운데 북쪽 → 절구산 1층 → 같은 분기로 귀환','절구산 깊은 층·폭포·특별 조우는 열리지 않았으며 방문은 본선 조건이 아니다.']);return true;}

  if(event==='ecruteakCenterRouteChart'){
    g.say('인주 여행 방향도',[partyLine,routeLine,localLine,'남쪽은 37→36번도로 갈림길, 서쪽은 38→39번도로·튼튼목장/담청, 동쪽은 42번도로 본선·절구산 1층 선택 분기·황토다.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current('tour_ecruteak_center')){g.panel='party';g.partyIndex=0;}}},
      {label:'센터 PC 안내',action:()=>{if(current('tour_ecruteak_center'))g.setTourDestination('tour_ecruteak_center','pc');}},
      {label:'37번도로',action:guide('tour_johto_route_37','37번도로 안내','남문에서 37번도로로 내려간다.')},
      {label:'38번도로',action:guide('tour_johto_route_38','38번도로 안내','서문에서 목초지 길을 따라 39번도로로 간다.')},
      {label:'방울탑',action:guide('tour_ecruteak_hall','방울탑 안내','1층에서 동료와 방울 소리를 비교할 수 있다.','ecruteakTowerBellTable')},
      {label:'지도를 덮는다',action:()=>{}},
    ]);return true;
  }
  if(event==='ecruteakCenterRouteBench'||event==='ecruteakCenterCompanionGarden'){
    g.say(event==='ecruteakCenterRouteBench'?'37번도로 동료 휴게석':'전승 거리 동료 쉼뜰',[partyLine,routeLine,localLine,hurt.length||fainted.length?'이곳에서는 회복되지 않는다. 앞쪽 간호사에게 부탁하자.':'동료가 흙과 단풍잎을 털며 쉬어도 HP·능력치는 변하지 않는다.']);return true;
  }

  if(event==='ecruteakTowerBellTable'){
    if(!healthy.length){g.say('방울 소리 비교대',[partyLine,'함께 소리를 비교할 건강한 동료가 없다. 센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.']);return true;}
    g.say('방울 소리 비교대',['크기가 다른 방울의 울림이 잦아드는 시간을 동료의 반응과 함께 살핀다.',localLine,'함께 관찰할 건강한 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:`${SPECIES[mon.species].name}${localOrigins.has(mon.met)?' · 성도 중부':''}`,action:()=>{
      if(!current('tour_ecruteak_hall')||!save.party.includes(mon)||mon.hp<=0)return;
      save.flags.ecruteakTowerPartnerSpecies=mon.species;save.flags.ecruteakTowerBellCompared=true;delete save.flags.ecruteakTowerJoineryObserved;delete save.flags.ecruteakTowerWindRecorded;g.persist();
      g.say('방울 소리 관찰',[`${SPECIES[mon.species].name}와 낮은 울림과 맑은 울림이 잦아드는 시간을 비교했다.`,localOrigins.has(mon.met)?`${mon.met}에서 만난 동료의 여행 기록을 방울탑 수첩과 이어 적었다.`:'다른 장소에서 만난 동료도 같은 공개 관찰에 참여할 수 있다.','HP·경험치·능력치는 변하지 않는다. 같은 동료와 2층 목조 짜임 관찰을 이어갈 수 있다.']);
    }})),{label:'나중에 관찰한다',action:()=>{}}]);return true;
  }
  if(event==='ecruteakTowerFloorGuide'){g.say('방울탑 층별 안내',['1층 방울 소리 비교 → 2층 목조 짜임 관찰 → 3층 바람·여행 기록','모든 관찰은 선택이며 체육관·전설·보상·통행과 무관하다.']);return true;}
  if(event==='ecruteakTowerWaitingFloor'){g.say('방문 동료 대기 마루',[partyLine,partnerName?`${partnerName}와 시작한 방울 관찰 기록이 있다.`:'1층 비교대에서 건강한 동료를 선택할 수 있다.','이 마루에서는 실제 회복이 일어나지 않는다.']);return true;}
  if(event==='ecruteakTowerJoineryTable'){
    const mon=partnerInParty();
    if(!save.flags.ecruteakTowerBellCompared||!partnerName){g.say('목조 짜임 보존대',['먼저 1층 방울 소리 비교대에서 건강한 동료와 관찰을 시작하자.','전시 표본은 직접 분해하지 않는다.']);return true;}
    if(!mon){g.say('목조 짜임 보존대',[`${partnerName}와 시작한 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'센터에서 회복하거나 PC로 다시 편성한 뒤 이어갈 수 있다.']);return true;}
    save.flags.ecruteakTowerJoineryObserved=true;g.persist();g.say('목조 짜임 관찰',[`${partnerName}와 홈·받침·기둥이 흔들림을 나누는 모습을 차례로 살폈다.`,'전시를 훼손하지 않았고 능력치도 변하지 않는다. 3층 풍경 관찰로 이어갈 수 있다.']);return true;
  }
  if(event==='ecruteakTowerRepairLog'||event==='ecruteakTowerWoodRest'){g.say('방울탑 목조 보존 기록',[partnerName?`${partnerName}와 이어가는 관찰 기록이 있다.`:'1층에서 함께할 동료를 선택할 수 있다.',save.flags.ecruteakTowerJoineryObserved?'목조 짜임의 홈과 받침을 관찰한 단계까지 기록됐다.':'2층 보존대 관찰은 아직 기록되지 않았다.','쉼자리와 기록장은 회복·보상을 주지 않는다.']);return true;}
  if(event==='ecruteakTowerWindBell'){
    const mon=partnerInParty();
    if(!save.flags.ecruteakTowerJoineryObserved||!partnerName){g.say('바람 방향 풍경',['1층 방울 비교와 2층 목조 짜임 관찰을 마치면 같은 동료와 바람 방향을 기록할 수 있다.']);return true;}
    if(!mon){g.say('바람 방향 풍경',[`${partnerName}와 이어 온 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'센터에서 회복하거나 PC로 편성한 뒤 다시 살펴보자.']);return true;}
    const first=!save.flags.ecruteakTowerWindRecorded;save.flags.ecruteakTowerWindRecorded=true;g.persist();
    g.say('방울탑 바람 기록',[`${partnerName}와 남쪽 단풍길, 서쪽 목초지, 동쪽 산길에서 오는 바람을 차례로 구분했다.`,routeLine,first?'세 층 관찰을 여행 수첩에 이어 적었다.':'앞서 남긴 바람 기록을 다시 확인했다.','보상·능력 변화·통행 조건은 생기지 않는다.']);return true;
  }
  if(event==='ecruteakTowerViewSeat'||event==='ecruteakTowerJourneyBook'){
    g.say(event==='ecruteakTowerViewSeat'?'인주 세 갈래 전망석':'전승 거리 여행 수첩',[routeLine,localLine,partnerName?`${partnerName}와 방울탑 관찰을 시작한 기록이 있다.`:'아직 방울탑 동료 관찰 기록은 없다.',save.flags.ecruteakTowerWindRecorded?'방울·목조 짜임·세 방향 바람을 모두 기록했다.':'완료되지 않은 단계는 나중에 같은 동료와 이어갈 수 있다.','이 기록은 전설 사건·배지·보상·통행 조건이 아니다.']);return true;
  }

  if(/^ecruteakMart/.test(event)){g.say('인주 여행 보급 안내',[partyLine,routeLine,'현재 실제 판매 품목은 점원의 몬스터볼과 상처약이다. 서쪽은 38·39번도로와 튼튼목장·담청, 동쪽은 42번도로·절구산 1층 선택 분기·황토다.']);return true;}
  if(/^ecruteakHome/.test(event)){g.say('인주 목조 거리 생활 기록',[partyLine,partnerName?`${partnerName}와 방울탑을 살핀 기록이 주민의 보존 일지와 나란히 놓여 있다.`:'주민과 포켓몬이 돌등·목조 담장·단풍정원을 함께 돌보는 기록이다.','불탄탑 내부 사건이나 전설 포획을 완료했다는 기록은 아니다.']);return true;}
  if(save.map==='tour_ecruteak'&&(event==='tourResident0'||event==='tourResident1')){g.say(event==='tourResident0'?'목조 거리를 돌보는 주민':'37번도로에서 온 여행자',[partyLine,event==='tourResident0'?'포켓몬과 돌등 사이의 낙엽을 모으고 목조 담장의 갈라짐을 살피고 있어요.':'37번도로의 단풍길은 36번 갈림길과 자연공원·금빛 방향으로 이어져요.',partnerName?`${partnerName}와 방울탑 공개 층을 둘러봤군요.`:'방울탑 공개 층은 건강한 동료와 천천히 살펴볼 수 있어요.']);return true;}
  if(save.map==='tour_ecruteak'&&event==='tourPokemon'){const lead=save.party[0];g.say('전승 거리의 동료 포켓몬',[lead?`${SPECIES[lead.species].name}을 바라본 뒤 돌등 그늘로 천천히 자리를 옮긴다.`:'돌등과 목조 담장 사이를 천천히 걸으며 주민 곁으로 돌아간다.','도시 주민과 함께 사는 포켓몬이며 야생 조우·포획 대상이 아니다.']);return true;}
  return false;
}
