import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_EAST_BATTLE } from './johto-east-battle';
import { JOHTO_SOUTH_BATTLE } from './johto-south-battle';

const MAPS=new Set(['tour_blackthorn','tour_blackthorn_center','tour_blackthorn_hall','tour_blackthorn_mart','tour_blackthorn_home1','tour_blackthorn_home2','tour_johto_dragons_den','tour_johto_dragons_den_shrine']);
const local=(met:string)=>met.includes('44번도로')||met.includes('얼음샛길');

/** Connect the Ice Path arrival to a voluntary companion breathing and rock-observation loop. */
export function handleBlackthornLife(g:Engine,event:string):boolean{
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const owned=[...save.party,...save.box??[]].filter(mon=>local(mon.met)),inParty=owned.filter(mon=>save.party.includes(mon));
  const healthy=save.party.filter(mon=>mon.hp>0),species=Number(save.flags.blackthornTrainingSpecies??0),partnerName=SPECIES[species]?.name,trainingSlot=save.flags.blackthornTrainingSlot;
  const trackedPartner=()=>typeof trainingSlot==='number'&&save.party[trainingSlot]?.species===species?save.party[trainingSlot]:undefined;
  const partner=()=>{const mon=trackedPartner();return mon&&mon.hp>0?mon:undefined;};
  const ef=JOHTO_EAST_BATTLE,eastSpecies=Number(save.flags[ef.partner]??0),eastName=SPECIES[eastSpecies]?.name,eastSlot=save.flags[ef.slot],eastPartner=typeof eastSlot==='number'&&save.party[eastSlot]?.species===eastSpecies?save.party[eastSlot]:undefined;
  const eastBattleLine=save.flags[ef.participated]===true&&eastName?(eastPartner?`${eastName}의 동부 산길 실제 격파 기록 · Lv.${Number(save.flags[ef.level]??eastPartner.level)}→${eastPartner.level} · HP ${eastPartner.hp}/${eastPartner.maxHp}`:`${eastName}의 동부 산길 실제 격파 기록 · 현재 PC 또는 다른 편성`):'44번도로·얼음샛길 현지 동료의 실제 격파 기록은 아직 없다.';
  const sf=JOHTO_SOUTH_BATTLE,southSpecies=Number(save.flags[sf.partner]??0),southName=SPECIES[southSpecies]?.name,southSlot=save.flags[sf.slot],southPartner=typeof southSlot==='number'&&save.party[southSlot]?.species===southSpecies?save.party[southSlot]:undefined;
  const southBattleLine=save.flags[sf.participated]===true&&southName?(southPartner?`${southName}의 남쪽 산길 실제 격파 기록 · Lv.${Number(save.flags[sf.level]??southPartner.level)}→${southPartner.level} · HP ${southPartner.hp}/${southPartner.maxHp}`:`${southName}의 남쪽 산길 실제 격파 기록 · 현재 PC 또는 다른 편성`):'29·45·46번도로 현지 동료의 실제 격파 기록은 아직 없다.';
  const partyLine=save.party.length?`파티 ${save.party.length}마리 · 건강 ${healthy.length}`:'현재 함께 걷는 동료가 없다. 센터 PC에서 동료를 편성할 수 있다.';
  const localLine=owned.length?`44번도로·얼음샛길 출신 동료 ${owned.length}마리 · 파티 ${inParty.length} · PC ${owned.length-inParty.length}`:'44번도로·얼음샛길에서 만난 보유 동료는 아직 없다.';
  const progress=save.flags.blackthornRockCompared?'찬물 호흡·암반 비교 완료':save.flags.blackthornWaterBreathing?'찬물 호흡 완료 · 암반 비교 대기':'도시 산악 수련 기록 없음';
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string,eventId?:string)=>()=>{if(!current())return;g.setTourDestination(map,eventId);g.say(title,[text,'아래 지도에 목적지를 표시했다. 실제 길과 표지를 따라가자.']);};

  if(save.map==='tour_blackthorn'&&event==='tourGuide'){
    g.say('검은먹시티 안내원',[partyLine,localLine,eastBattleLine,southBattleLine,progress,'서쪽 얼음샛길, 북쪽 용의굴·전승 사당, 남쪽45번도로→46번도로→29번도로 동쪽 합류부를 실제 왕복할 수 있다.'],undefined,[
      {label:'센터에서 준비',action:guide('tour_blackthorn_center','검은먹 회복 안내','센터에서 실제 회복과 PC 편성을 할 수 있다.')},
      {label:'용 전승관',action:guide('tour_blackthorn_hall','용 전승관 안내','공개 전시실에서 찬물 호흡과 푸른 암반의 차이를 기록한다.','blackthornHallBreathChart')},
      {label:'얼음샛길 귀환',action:guide('tour_johto_ice_path_1f','얼음샛길 안내','서문으로 나가 얼음샛길 네 층과44번도로를 역순으로 지나 황토로 돌아간다.')},
      {label:'남쪽 산길',action:guide('tour_johto_route_45','검은먹 남쪽 안내','남문으로 나가45번도로·46번도로를 지나29번도로 동쪽 합류부까지 내려간다.')},
    ]);return true;
  }
  if(event==='tourBlackthornTrainingWater'){
    if(!healthy.length){g.say('용 수행 물길 관리판',[partyLine,'호흡을 함께 맞출 건강한 동료가 없다. 센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.','활동 없이도 얼음샛길 귀환과 모든 시설은 열린다.']);return true;}
    g.say('용 수행 물길 관리판',[localLine,'찬물의 흐름을 살필 건강한 동료를 고르자. 출신 장소와 무관하게 참여할 수 있다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current('tour_blackthorn')||!save.party.includes(mon)||mon.hp<=0)return;
      save.flags.blackthornTrainingSpecies=mon.species;save.flags.blackthornTrainingSlot=save.party.indexOf(mon);save.flags.blackthornWaterBreathing=true;
      delete save.flags.blackthornRockCompared;delete save.flags.dragonsDenLakeObserved;delete save.flags.dragonsDenIslandObserved;delete save.flags.dragonsDenObservationCompleted;g.persist();
      g.say('찬물 호흡 기록',[`${SPECIES[mon.species].name}와 물소리 사이의 긴 호흡과 짧은 호흡을 차례로 맞췄다.`,'HP·경험치·능력치·도구는 변하지 않는다. 용 전승관의 암반 비교대로 이어갈 수 있다.']);
    }})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='blackthornHallRockTable'){
    const mon=partner();
    if(!save.flags.blackthornWaterBreathing||!partnerName){g.say('푸른 암반 결 비교대',['먼저 외부 수행 물길에서 건강한 동료와 호흡을 맞춘 뒤 비교할 수 있다.','순서와 무관하게 전승관과 도시 통행은 자유롭다.']);return true;}
    if(!mon){const same=trackedPartner();g.say('푸른 암반 결 비교대',[`${partnerName}와 시작한 기록이 있지만 같은 실제 동료가 현재 건강한 파티에 없다.`,same?'기절했다면 센터에서 같은 동료를 회복한 뒤 이어갈 수 있다.':'PC 보관이나 이전 저장의 슬롯 부재는 다른 동종 개체로 대신하지 않는다. 외부 수행 물길에서 동료를 명시적으로 다시 선택하자.']);return true;}
    const first=!save.flags.blackthornRockCompared;save.flags.blackthornRockCompared=true;g.persist();
    g.say('검은먹 산악 수련 기록',[`${partnerName}와 얼음 서리층과 푸른 암벽의 빛·결 차이를 비교했다.`,first?'찬물 호흡과 암반 비교를 한 기록으로 이어 적었다.':'앞서 남긴 비교 기록을 다시 확인했다.','용의굴 시험·체육관·배지·보상·통행 조건은 생기지 않는다.']);return true;
  }
  if(event==='dragonsDenLakeRail'){
    const mon=partner();
    if(!save.flags.blackthornRockCompared||!partnerName){g.say('지하 호수 관찰 난간',['검은먹 수행 물길과 용 전승관 암반 비교를 마친 동료가 있다면 같은 기록을 동굴까지 이어갈 수 있다.','관찰하지 않아도 중앙 섬·사당·도시 귀환길은 모두 열린다.']);return true;}
    if(!mon){const same=trackedPartner();g.say('지하 호수 관찰 난간',[`${partnerName}와 이어 온 기록이 있지만 같은 실제 동료가 현재 건강한 파티에 없다.`,same?'검은먹센터에서 같은 동료를 회복한 뒤 다시 이어갈 수 있다.':'PC에서 꺼낸 뒤 외부 수행 물길에서 동료를 다시 선택해야 한다.']);return true;}
    save.flags.dragonsDenLakeObserved=true;g.persist();g.say('지하 호수 물결 관찰',[`${partnerName}와 북쪽·남쪽 수면의 물결 방향과 마른 둑을 비교했다.`,'수상 이동·낚시·조우·능력 변화는 없다. 중앙 섬 문양석으로 이어갈 수 있다.']);return true;
  }
  if(event==='dragonsDenIslandStone'){
    const mon=partner();
    if(!save.flags.dragonsDenLakeObserved||!partnerName){g.say('중앙 섬 용 문양석',['먼저 서쪽 지하 호수 난간에서 검은먹 수련 기록을 이어갈 수 있다.','관찰 순서와 무관하게 사당과 귀환로는 이용할 수 있다.']);return true;}
    if(!mon){const same=trackedPartner();g.say('중앙 섬 용 문양석',[`${partnerName}와 시작한 동굴 기록이 있지만 같은 실제 동료가 현재 건강한 파티에 없다.`,same?'회복 뒤 같은 기록을 이어갈 수 있다.':'PC 편성 뒤 외부 수행 물길에서 다시 선택해야 한다.']);return true;}
    save.flags.dragonsDenIslandObserved=true;g.persist();g.say('중앙 섬 문양 관찰',[`${partnerName}와 물결 모양과 산등성이 모양이 만나는 돌의 결을 살폈다.`,'사당의 전승 보존대에서 마지막 비교를 이어갈 수 있다.']);return true;
  }
  if(event==='dragonsDenShrineAltar'){
    const mon=partner();
    if(!save.flags.dragonsDenIslandObserved||!partnerName){g.say('용 전승 사당',['지하 호수 난간과 중앙 섬 문양석을 살핀 뒤 같은 동료와 공개 전승을 비교할 수 있다.','장로 시험·특별 보상·통행 조건은 아니다.']);return true;}
    if(!mon){const same=trackedPartner();g.say('용 전승 사당',[`${partnerName}와 이어 온 기록이 있지만 같은 실제 동료가 현재 건강한 파티에 없다.`,same?'검은먹센터에서 같은 동료를 회복한 뒤 다시 올 수 있다.':'PC 편성 뒤 외부 수행 물길에서 다시 선택해야 한다.']);return true;}
    const first=!save.flags.dragonsDenObservationCompleted;save.flags.dragonsDenObservationCompleted=true;g.persist();g.say('용의 굴 동행 관찰 기록',[`${partnerName}와 검은먹 찬물→푸른 암반→지하 호수→중앙 섬→전승 사당의 차이를 이어 기록했다.`,first?'도시와 동굴의 공개 관찰 기록을 마쳤다.':'앞서 마친 관찰 기록을 다시 확인했다.','기술·도구·포켓몬·배지·보상은 받지 않는다.']);return true;
  }
  if(event==='dragonsDenKeeper'||event==='dragonsDenCityReturn'||event==='dragonsDenShrineGuide'||event==='dragonsDenReturnChart'||event==='dragonsDenRestBench'){
    const denProgress=save.flags.dragonsDenObservationCompleted?'용의 굴 동행 관찰 완료':save.flags.dragonsDenIslandObserved?'중앙 섬까지 관찰':save.flags.dragonsDenLakeObserved?'지하 호수 관찰 완료':'용의 굴 관찰 기록 없음';
    g.say(event==='dragonsDenKeeper'?'용의 굴 보존원':'용의 굴 공개 관찰 안내',[partyLine,localLine,progress,denProgress,partnerName?`${partnerName}와 이어 온 기록이 있다.`:'검은먹 수행 물길에서 건강한 동료와 기록을 시작할 수 있다.','모든 관찰과 관계없이 검은먹 귀환과 사당 출입은 자유롭다.']);return true;
  }
  if(/^blackthornCenter/.test(event)){g.say('검은먹센터 산악 안내',[partyLine,localLine,eastBattleLine,southBattleLine,progress,'실제 회복은 간호사, 편성은 PC를 이용하자. 서쪽 얼음샛길·북쪽 용의굴·남쪽45번도로는 양방향이며45번도로와46번도로의 턱은 별도 오르막으로 돌아온다.']);return true;}
  if(event==='blackthornHallBreathChart'||event==='blackthornHallTraditionAltar'){
    g.say(event==='blackthornHallBreathChart'?'얼음과 찬물 호흡도':'용 전승 보존대',[partyLine,localLine,progress,partnerName?`${partnerName}와 시작한 수련 기록이 있다.`:'외부 수행 물길에서 건강한 동료와 기록을 시작할 수 있다.','이 전시는 용의굴 내부 시험이나 체육관 도전이 아니다.']);return true;
  }
  if(/^blackthornMart/.test(event)){g.say('검은먹 산악 보급 안내',[partyLine,localLine,'실제 판매품은 점원의 몬스터볼과 상처약이다. 서쪽 얼음샛길 귀환에 맞춰 파티와 가방을 확인하자.']);return true;}
  if(/^blackthornHome/.test(event)){g.say('검은먹 산악 생활 기록',[partyLine,localLine,southBattleLine,progress,'주민과 포켓몬이 방한 천·찬물·절벽 바람 기록을 함께 관리한다. 조사만으로 회복이나 보상은 생기지 않는다.']);return true;}
  if(save.map==='tour_blackthorn'&&(event==='tourResident0'||event==='tourResident1'||event==='tourPokemon')){g.say('검은먹 주민과 생활 포켓몬',[partyLine,localLine,progress,'푸른 암벽과 찬물을 돌보며 함께 사는 생활이다. 도시 야생 조우나 특별 포획 대상은 아니다.']);return true;}
  if(event==='tourBlackthornIcePathStone'||event==='tourBlackthornDragonDenBoundary'||event==='tourBlackthornRoute45Stone'||event==='tourBlackthornHallStone'){
    const pages=event==='tourBlackthornIcePathStone'?['서쪽 얼음샛길1F 동쪽 구역→B3F→B2F→B1F→1F 서쪽 구역→44번도로→황토마을로 돌아갈 수 있다.']:event==='tourBlackthornDragonDenBoundary'?['북쪽 문으로 용의굴 지하 호수와 전승 사당을 왕복할 수 있다. 장로 시험·배지·특별 포켓몬 보상은 아직 열리지 않았다.']:event==='tourBlackthornRoute45Stone'?['남문에서45번도로→46번도로→29번도로 동쪽 합류부까지 갈 수 있다. 일방 턱을 내려간 뒤에는 동쪽 오르막길로 되돌아온다.']:['용 전승관은 도시의 공개 전시실이며 북쪽 용의굴과 다른 장소다.'];
    g.say('검은먹 방향 기록',[...pages,partyLine,event==='tourBlackthornRoute45Stone'?southBattleLine:eastBattleLine,progress]);return true;
  }
  return false;
}
