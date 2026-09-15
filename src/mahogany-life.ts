import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import {handleMahoganyTransmitter} from './mahogany-transmitter';
import {handleMahoganyPower} from './mahogany-power';
import {handleMahoganyHomecoming} from './mahogany-homecoming';
import {RAGE_RECOVERY_FLAGS} from './rage-lake-gyarados';

const MAPS=new Set(['tour_mahogany','tour_mahogany_center','tour_mahogany_hall','tour_mahogany_mart','tour_mahogany_home1','tour_mahogany_home2']);

/** Mahogany village life and a voluntary companion preparation loop for Routes 42, 43 and 44. */
export function handleMahoganyLife(g:Engine,event:string):boolean{
  if(handleMahoganyHomecoming(g,event))return true;
  if(handleMahoganyPower(g,event))return true;
  if(handleMahoganyTransmitter(g,event))return true;
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,originMap=save.map,player=save.player,originX=player.x,originY=player.y;
  const current=(map=originMap)=>g.save===save&&save.player===player&&save.map===map&&player.x===originX&&player.y===originY&&!g.battle;
  const visited=new Set(save.tourVisited??[]),route42=visited.has('tour_johto_route_42'),mortar=visited.has('tour_johto_mt_mortar_1f');
  const healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const partyLine=save.party.length?`동료 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 함께 걷는 동료가 없다. 센터 PC에서 맡긴 동료를 확인할 수 있다.';
  const route43Owned=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 43번도로'),route43Party=route43Owned.filter(mon=>save.party.includes(mon));
  const route43Line=route43Owned.length?`43번도로 출신 동료 ${route43Owned.length}마리 · 파티 ${route43Party.length} · PC ${route43Owned.length-route43Party.length}\n${[...new Set(route43Owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')}`:'43번도로에서 만난 보유 동료는 아직 없다.';
  const lakeLine=save.flags.rageLakeObservationCompleted?'분노의호수 동료 관찰 완료':save.flags.rageLakeReedsObserved?'분노의호수 동료 관찰 진행 중':'분노의호수 동료 관찰 기록 없음';
  const arrivalLine=route42?`42번도로 방문 기록 있음${mortar?' · 절구산 1층 방문 기록 있음':' · 절구산은 방문하지 않음'}`:'42번도로와 절구산 방문 기록은 아직 없다.';
  const species=Number(save.flags.mahoganyPrepSpecies??0),partnerName=SPECIES[species]?.name;
  const partner=()=>save.party.find(mon=>mon.species===species&&mon.hp>0);
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string,eventId?:string)=>()=>{if(!current())return;g.setTourDestination(map,eventId);g.say(title,[text,'아래 지도에 목적지를 표시했다. 실제 표지와 길을 따라 걸어가자.']);};

  if(save.map==='tour_mahogany_center'&&event==='mahoganyCenterPartyTable'&&save.flags[RAGE_RECOVERY_FLAGS.residents]){
    const healthy=save.party.filter(mon=>mon.hp>0),recorded=Number(save.flags.nexusMahoganyRecoverySpecies??0),recordedName=SPECIES[recorded]?.name;
    const after=()=>[
      {label:'43번도로·호수 결과 재확인',action:()=>{if(current())g.setTourDestination('tour_johto_route_43','tourRoute43LakeBoard');}},
      {label:'44번도로·얼음샛길 준비',action:()=>{if(current())g.setTourDestination('tour_johto_route_44');}},
      {label:'센터 간호사에게 회복',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','tourHost');}},
      {label:'산기슭 주택에서 쉬기',action:()=>{if(current())g.setTourDestination('tour_mahogany_home1','tourHost');}},
      {label:'편성대를 닫는다',action:()=>{}},
    ];
    if(save.flags.nexusMahoganyRecoveryDebriefed){
      g.say('호수 귀환 편성 기록',[`${recordedName??'동료'}의 현재 상태와 기술을 확인하고 호수 생활 재개 결과를 황토센터에 남겼다.`,'43번도로로 돌아가 물과 경보를 다시 확인하거나, 동쪽 44번도로와 얼음샛길 여행을 준비할 수 있다. 어느 길도 배지·포획·이 기록으로 잠기지 않는다.'],undefined,after());return true;
    }
    if(!healthy.length){g.say('호수 귀환 편성대',['호수 주민이 물 받이와 갈대 작업을 다시 시작했다는 기록이 도착했다.','현장에서 돌아온 동료가 모두 기절해 있다. 앞쪽 간호사에게 회복을 부탁한 뒤 레벨과 기술을 함께 정리하자.'],undefined,[{label:'센터 간호사에게',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','tourHost');}},{label:'나중에 기록한다',action:()=>{}}]);return true;}
    const choose=(page=0)=>{if(!current())return;g.say('호수 귀환 동료 점검',['송신 장치를 분리한 뒤 붉은 갸라도스를 진정시키고 주민의 생활 재개까지 확인했다. 현장에 함께한 파티에서 다음 길을 준비할 동료 한 마리를 살펴보자.'],undefined,[
      ...healthy.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}`,action:()=>{
        if(!current()||!save.party.includes(mon)||mon.hp<=0)return;
        const moves=(mon.moves?.length?mon.moves:SPECIES[mon.species]?.moves??[]).join(' · ')||'확인 가능한 기술 없음';
        save.flags.nexusMahoganyRecoveryDebriefed=true;save.flags.nexusMahoganyRecoverySpecies=mon.species;g.persist();
        g.say('황토 귀환 성장 기록',[`${SPECIES[mon.species].name} Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}`,`현재 기술: ${moves}`,'호수의 물과 경보가 주민 생활로 돌아온 결과를 파티 상태와 함께 남겼다. 이 기록은 경험치나 기술을 임의로 바꾸지 않는다.'],undefined,after());
      }})),...(healthy.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),{label:'현재 파티 화면',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'나중에 기록한다',action:()=>{}}]);};
    choose();return true;
  }

  if(save.map==='tour_mahogany'&&event==='tourGuide'){
    g.say('황토마을 안내원',[partyLine,arrivalLine,'산기슭 장터에서 건강한 동료와 세 방향 산길 준비를 시작할 수 있다. 선택 기록이며 통행 조건은 아니다.'],undefined,[
      {label:'센터에서 준비',action:guide('tour_mahogany_center','황토 회복 안내','포켓몬센터에서 실제 회복과 PC 편성을 할 수 있다.')},
      {label:'산길 안내소',action:guide('tour_mahogany_hall','황토 산길 안내','42·43·44번도로의 기후와 암석·생활용 물 기록을 살핀다.','mahoganyHallRouteChart')},
      {label:'서쪽 42번도로',action:guide('tour_johto_route_42','42번도로 안내','서문에서 42번도로 본선을 따라 절구산 선택 분기와 인주시티로 돌아간다.')},
      {label:'북쪽 43번도로',action:guide('tour_johto_route_43','43번도로 안내','북문에서 상류 둑길을 따라 분노의호수 남쪽에 닿는다.')},
      {label:'동쪽 44번도로',action:guide('tour_johto_route_44','44번도로·얼음샛길 안내','동문에서 44번도로를 따라 얼음샛길 1F·B1F·B2F·B3F를 지나 검은먹시티까지 왕복할 수 있다.')},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourMahoganyRoute42Stone'){g.say('42번도로 도착 표석',[partyLine,arrivalLine,'황토마을 → 42번도로 → 절구산 선택 분기 → 인주시티','절구산 방문은 본선 조건이 아니며 같은 도로로 돌아갈 수 있다.']);return true;}
  if(event==='tourMahoganyRoute43Stone'){g.say('43번도로 호수 방향 표석',[partyLine,'황토마을 → 43번도로 → 분노의호수','43번도로의 둑길을 따라 호숫가 주택까지 갈 수 있다. 같은 길로 황토마을에 돌아오자.']);return true;}
  if(event==='tourMahoganyRoute44Stone'){g.say('44번도로 얼음샛길 표석',[partyLine,'황토마을 → 44번도로 → 얼음샛길 → 검은먹시티','얼음샛길 안에는 지하 세 층으로 이어지는 계단이 있다. 층마다 돌아갈 계단과 출구 표지를 확인하자.']);return true;}

  if(event==='tourMahoganyMarketRack'){
    if(!healthy.length){g.say('산기슭 장터 건조대',[partyLine,'함께 장비를 살필 건강한 동료가 없다. 센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.']);return true;}
    g.say('산기슭 장터 건조대',[arrivalLine,'젖은 끈과 천을 분리해 말릴 건강한 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current('tour_mahogany')||!save.party.includes(mon)||mon.hp<=0)return;
      save.flags.mahoganyPrepSpecies=mon.species;save.flags.mahoganyGearDried=true;delete save.flags.mahoganyWaterChecked;delete save.flags.mahoganyRoutePrepared;g.persist();
      g.say('산길 장비 점검',[`${SPECIES[mon.species].name}와 젖은 끈·천·덮개를 나누어 건조대에 걸었다.`,'HP·경험치·능력치·도구는 변하지 않는다. 빗물 분배대에서 다음 점검을 이어갈 수 있다.']);
    }})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='tourMahoganyWaterTable'){
    const mon=partner();
    if(!save.flags.mahoganyGearDried||!partnerName){g.say('상류 빗물 분배대',['먼저 장터 건조대에서 건강한 동료와 산길 장비를 점검할 수 있다.','활동 없이도 모든 출구와 시설은 열려 있다.']);return true;}
    if(!mon){g.say('상류 빗물 분배대',[`${partnerName}와 시작한 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'센터에서 회복하거나 PC로 다시 편성한 뒤 이어갈 수 있다.']);return true;}
    save.flags.mahoganyWaterChecked=true;g.persist();g.say('상류 빗물 점검',[`${partnerName}와 씻기·화단·장터 청소용 물통의 표식을 차례로 확인했다.`,'수상 이동·회복·호수 사건 상태는 생기지 않는다. 안내소에서 세 도로 기후를 비교할 수 있다.']);return true;
  }

  if(event==='mahoganyHallRockTable'){
    const mon=partner();
    if(!save.flags.mahoganyWaterChecked||!partnerName){g.say('절구산·얼음샛길 암석 비교대',['장터 건조대와 외부 빗물 분배대를 살핀 뒤 같은 동료와 비교 기록을 남길 수 있다.','순서와 무관하게 안내소 출입과 도시 통행은 자유롭다.']);return true;}
    if(!mon){g.say('절구산·얼음샛길 암석 비교대',[`${partnerName}와 이어 온 준비 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'센터에서 회복하거나 PC로 편성한 뒤 다시 살펴보자.']);return true;}
    const first=!save.flags.mahoganyRoutePrepared;save.flags.mahoganyRoutePrepared=true;g.persist();g.say('세 방향 산길 준비 기록',[`${partnerName}와 42번 젖은 암반, 43번 상류 물기, 44번 얼음바람 표본을 구분했다.`,first?'장터·빗물·안내소의 준비를 수첩에 이어 적었다.':'앞서 남긴 준비 기록을 다시 확인했다.','보상·능력 변화·배지·통행 조건은 생기지 않는다.']);return true;
  }
  if(event==='mahoganyHallRouteChart'||event==='mahoganyHallLakeBook'){
    g.say(event==='mahoganyHallRouteChart'?'세 번호 도로 기후표':'호수 생활 수첩',[partyLine,arrivalLine,partnerName?`${partnerName}와 산길 준비를 시작한 기록이 있다.`:'장터 건조대에서 건강한 동료와 준비를 시작할 수 있다.',save.flags.mahoganyRoutePrepared?'장터 건조·빗물 분배·암석 비교를 모두 기록했다.':'아직 끝내지 않은 준비 단계가 있다.','호수 사건·특별 조우·얼음샛길 통과·배지는 이 기록과 무관하다.']);return true;
  }
  if(event==='mahoganyCenterRouteChart'||event==='mahoganyCenterPartyTable'||event==='mahoganyCenterRouteBench'){
    const choices=event==='mahoganyCenterRouteChart'?[{label:'현재 파티 확인',action:()=>{if(current('tour_mahogany_center')){g.panel='party';g.partyIndex=0;}}},{label:'센터 PC 안내',action:()=>{if(current('tour_mahogany_center'))g.setTourDestination('tour_mahogany_center','pc');}},{label:'42번도로',action:guide('tour_johto_route_42','42번도로 안내','서문에서 인주 방향 본선으로 돌아간다.')},{label:'43번도로',action:guide('tour_johto_route_43','43번도로 안내','북문에서 피죤 선택 풀밭과 분노의호수로 이어진다.')},{label:'지도를 덮는다',action:()=>{}}]:undefined;
    g.say(event==='mahoganyCenterRouteChart'?'황토 세 방향 여행도':event==='mahoganyCenterPartyTable'?'산길 편성 점검대':'42번도로 동료 휴게석',[partyLine,arrivalLine,route43Line,lakeLine,partnerName?`${partnerName}와 시작한 산길 준비 기록이 있다.`:'아직 선택한 준비 동료가 없다.',hurt.length||fainted.length?'실제 회복은 앞쪽 간호사에게 부탁하자.':'이 조사에서는 HP나 능력치가 변하지 않는다.'],undefined,choices);return true;
  }
  if(/^mahoganyMart/.test(event)){g.say('황토 산길 보급 안내',[partyLine,arrivalLine,'점원에게 몬스터볼과 상처약을 살 수 있다. 북쪽은 43번도로와 분노의호수, 동쪽은 44번도로와 얼음샛길이다. 동굴에 들어가기 전에 동료를 돌보고 보급품을 챙기자.']);return true;}
  if(/^mahoganyHome/.test(event)){g.say('황토 산기슭 생활 기록',[partyLine,partnerName?`${partnerName}와 시작한 산길 준비 기록을 주민 생활표와 함께 볼 수 있다.`:'산나물 건조·상류 빗물·방한 준비를 주민과 포켓몬이 함께 맡는다.',save.flags.nexusMahoganyRecoveryDebriefed?'호수 주민이 물 받이와 갈대 작업을 다시 시작한 결과가 센터 편성 기록에도 남아 있다.':'호수 사건이나 얼음샛길 통과를 완료했다는 기록은 아니다.']);return true;}
  if(save.map==='tour_mahogany'&&(event==='tourResident0'||event==='tourResident1')){g.say(event==='tourResident0'?'산기슭 장터 주민':'산길 여행객',[partyLine,arrivalLine,save.flags.mahoganyRoutePrepared&&partnerName?`${partnerName}와 세 방향 준비를 마쳤군요.`:'장터 건조대에서 건강한 동료와 산길 준비를 시작할 수 있어요.','그 기록 없이도 세 방향 길과 시설은 이용할 수 있습니다.']);return true;}
  if(save.map==='tour_mahogany'&&event==='tourPokemon'){const lead=save.party[0];g.say('장터의 생활 포켓몬',[lead?`${SPECIES[lead.species].name}을 바라본 뒤 건조대 그늘로 자리를 옮긴다.`:'건조대와 물통 사이를 오가며 주민의 일을 돕는다.','주민과 함께 사는 생활 개체이며 황토마을 야생 조우·포획 대상이 아니다.']);return true;}
  return false;
}
