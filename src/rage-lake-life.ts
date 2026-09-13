import type { Engine } from './engine';
import {handleRageLakeNexus} from './rage-lake-nexus';
import {handleRageLakeRelief} from './rage-lake-relief';
import {handleRageLakeGyarados} from './rage-lake-gyarados';
import { SPECIES } from './pokemon';

export function handleRageLakeLife(g:Engine,event:string,skipNexus=false):boolean{
  if(!skipNexus&&handleRageLakeGyarados(g,event,()=>{if(!handleRageLakeLife(g,event,true))g.say('호숫가 주민',['물가의 바람을 느끼며 동료와 쉬어 가세요.']);}))return true;
  if(!skipNexus&&handleRageLakeRelief(g,event,()=>{if(!handleRageLakeLife(g,event,true))g.say('호숫가 작업자리',['주민과 동료가 둑의 설비를 살피며 쉬어 가는 자리다.']);}))return true;
  if(!skipNexus&&handleRageLakeNexus(g,event,()=>{if(!handleRageLakeLife(g,event,true))g.say('호숫가 주민',['갈대를 손질하고 동료와 함께 쉬어 가는 집이에요. 물가에서는 발밑을 조심하세요.']);}))return true;
  if(!new Set(['tour_rage_lake','tour_rage_lake_center','tour_rage_lake_hall','tour_rage_lake_mart','tour_rage_lake_home1']).has(g.save.map))return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_rage_lake'&&!g.battle;
  const healthy=save.party.filter(mon=>mon.hp>0),species=Number(save.flags.rageLakeObservationSpecies??0),name=SPECIES[species]?.name;
  const partner=()=>save.party.find(mon=>mon.species===species&&mon.hp>0);
  const status=name?`${name}와 호수 관찰을 시작한 기록이 있다.`:'아직 함께 관찰할 동료를 고르지 않았다.';
  const partyLine=save.party.length?`현재 파티 ${save.party.length}마리 · 건강 ${healthy.length}마리`:'현재 파티가 비어 있다. 센터 PC에서 동료를 편성할 수 있다.';
  const route43=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 43번도로'),route43Party=route43.filter(mon=>save.party.includes(mon));
  const route43Line=route43.length?`43번도로 출신 동료 ${route43.length}마리 · 파티 ${route43Party.length} · PC ${route43.length-route43Party.length}\n${[...new Set(route43.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')}`:'43번도로에서 만난 보유 동료는 아직 없다.';
  const trainerLine=save.flags['trainerWon:johto-route-43-practice']?'43번도로 새잡이 선택 실전 승리 기록 있음':'43번도로 새잡이 선택 실전 미승리';
  if(event==='tourGuide'||event==='rageLakeObserver'){
    g.say(event==='tourGuide'?'분노의호수 안내원':'호수 생태 관찰자',[partyLine,route43Line,trainerLine,status,'서쪽 갈대 → 가운데 수위 표석 → 동쪽 전망대 순서로 선택 관찰할 수 있다.','남쪽 43번도로 귀환은 관찰·포획·배틀·사건과 관계없이 열려 있다.'],undefined,[
      {label:'갈대 관찰 시작',action:()=>{if(current())g.setTourDestination('tour_rage_lake','rageLakeReedDesk');}},
      {label:'수위 표석',action:()=>{if(current())g.setTourDestination('tour_rage_lake','rageLakeWaterStone');}},
      {label:'43번도로 귀환',action:()=>{if(current())g.setTourDestination('tour_johto_route_43','tourRoute43LakeBoard');}},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(event==='rageLakeRoute43Stone'){g.say('43번도로 귀환 표석',[status,'분노의호수 → 43번도로 → 황토마을','가운데 남쪽 길은 언제든 걸어서 돌아갈 수 있다.']);return true;}
  if(event==='rageLakeNorthBoundary'){g.say('북쪽 숲 보존선',[status,'현재 공개 범위는 호수 둘레와 남쪽43번도로 귀환로다.','숨은 집·도구·추가 사건은 아직 열지 않았다.']);return true;}
  if(event==='rageLakeReedDesk'){
    if(!healthy.length){g.say('갈대 흔들림 기록대',['함께 관찰할 건강한 동료가 없다. 황토센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.','관찰하지 않아도 호수 둘레와 43번도로는 자유롭게 이용한다.']);return true;}
    g.say('갈대 흔들림 기록대',['물가 발자국과 갈대가 눕는 방향을 함께 살필 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(!current()||!save.party.includes(mon)||mon.hp<=0)return;save.flags.rageLakeObservationSpecies=mon.species;save.flags.rageLakeReedsObserved=true;delete save.flags.rageLakeWaterCompared;delete save.flags.rageLakeObservationCompleted;g.persist();g.say('갈대 관찰',[`${SPECIES[mon.species].name}와 물가 발자국을 밟지 않도록 둑길에서 흔들림을 기록했다.`,'HP·경험치·능력치·도구는 변하지 않는다. 가운데 수위 표석에서 이어서 살펴볼 수 있다.']);}})),{label:'나중에 관찰한다',action:()=>{}}]);return true;
  }
  if(event==='rageLakeWaterStone'){
    const mon=partner();if(!save.flags.rageLakeReedsObserved||!name){g.say('호수 수위 표석',['먼저 서쪽 갈대 기록대에서 건강한 동료와 관찰을 시작할 수 있다.','순서와 관계없이 둘레길과 귀환로는 열린다.']);return true;}
    if(!mon){g.say('호수 수위 표석',[`${name}와 시작한 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'회복하거나 다시 편성한 뒤 관찰을 이어갈 수 있다.']);return true;}
    save.flags.rageLakeWaterCompared=true;g.persist();g.say('호수 수위 비교',[`${name}와 상류 물결, 둑의 젖은 선, 갈대 아래 물높이를 차례로 비교했다.`,'수상 이동·낚시·야생 조우·사건 상태는 생기지 않는다. 동쪽 전망대에서 기록을 정리할 수 있다.']);return true;
  }
  if(event==='rageLakeLookout'){
    const mon=partner();if(!save.flags.rageLakeWaterCompared||!name){g.say('동쪽 호수 전망대',[status,'갈대와 수위 비교를 마치면 같은 동료와 관찰 기록을 정리할 수 있다.']);return true;}
    if(!mon){g.say('동쪽 호수 전망대',[`${name}와 이어 온 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'기록은 보존된다. 회복하거나 다시 편성한 뒤 돌아오자.']);return true;}
    const first=!save.flags.rageLakeObservationCompleted;save.flags.rageLakeObservationCompleted=true;g.persist();g.say('호수 생태 관찰 기록',[`${name}와 갈대 흔들림·수위·넓은 수면을 한 장의 관찰 기록으로 정리했다.`,first?'호수 둘레 활동을 수첩에 남겼다.':'앞서 남긴 관찰 기록을 다시 확인했다.','보상·능력 변화·특별 조우·사건 완료·통행 조건은 생기지 않는다.']);return true;
  }
  if(/^rageLakeCenter/.test(event)){
    const choices=event==='rageLakeCenterRouteChart'?[{label:'현재 파티 확인',action:()=>{if(g.save===save&&save.map==='tour_rage_lake_center'){g.panel='party';g.partyIndex=0;}}},{label:'센터 PC 안내',action:()=>{if(g.save===save&&save.map==='tour_rage_lake_center')g.setTourDestination('tour_rage_lake_center','pc');}},{label:'외부 갈대 기록대',action:()=>{if(g.save===save&&save.map==='tour_rage_lake_center')g.setTourDestination('tour_rage_lake','rageLakeReedDesk');}},{label:'지도를 덮는다',action:()=>{}}]:undefined;
    g.say(event==='rageLakeCenterRouteChart'?'호수 둘레·황토 귀환도':event==='rageLakeCenterPartyTable'?'호수 관찰 편성대':'43번도로 동료 휴게석',[partyLine,route43Line,trainerLine,status,save.flags.rageLakeObservationCompleted?'갈대·수위·전망 관찰 기록을 모두 남겼다.':'아직 끝내지 않은 외부 관찰 단계가 있다.','실제 회복은 간호사, 파티·PC 교환은 PC를 이용한다.'],undefined,choices);return true;
  }
  if(/^rageLakeHall/.test(event)){
    g.say(event==='rageLakeHallEcologyChart'?'호수 생태 기록도':event==='rageLakeHallReedSample'?'갈대·수위 표본대':'동료 관찰 수첩대',[partyLine,route43Line,trainerLine,status,save.flags.rageLakeReedsObserved?'서쪽 갈대 흔들림 기록 있음':'갈대 흔들림 기록 없음',save.flags.rageLakeWaterCompared?'수위 비교 기록 있음':'수위 비교 기록 없음',save.flags.rageLakeObservationCompleted?'동쪽 전망대에서 관찰 정리 완료':'전망대 정리는 아직 완료하지 않음','이 기록은 붉은 갸라도스·로켓단 사건·보상·통행 조건과 무관하다.']);return true;
  }
  if(/^rageLakeMart/.test(event)){g.say('분노의호수 보급 안내',[partyLine,status,'실제 판매품은 점원의 몬스터볼과 상처약이다. 남쪽43번도로와 황토마을은 언제든 돌아갈 수 있다.']);return true;}
  if(/^rageLakeHome/.test(event)){g.say('호숫가 생활 기록',[partyLine,status,save.flags.rageLakeObservationCompleted?'주민의 물결 일지와 동료 관찰 기록을 나란히 비교할 수 있다.':'주민은 갈대 보존선과 물결을 날마다 기록한다.','생활 조사는 회복·도구·보상·특별 조우를 만들지 않는다.']);return true;}
  return false;
}
