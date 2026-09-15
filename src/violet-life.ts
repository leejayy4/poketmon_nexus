import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const VIOLET_MAPS=new Set(['tour_violet','tour_violet_center','tour_violet_hall','tour_violet_hall_2f','tour_violet_hall_3f','tour_violet_mart','tour_violet_home1','tour_violet_home2']);
const SOUTH_ORIGINS=new Set(['성도 32번도로','연결동굴 1층','성도 33번도로','너도밤나무숲','성도 31번도로','성도 30번도로']);

/** Connect the Route 32 arrival party to a voluntary three-floor tower practice. */
export function handleVioletLife(g:Engine,event:string):boolean{
  if(!VIOLET_MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string,eventId?:string)=>()=>{
    if(!current())return;g.setTourDestination(map,eventId);g.say(title,[text,'아래 지도에 목적지를 표시했다. 실제 표지와 길을 따라가자.']);
  };
  const local=[...save.party,...save.box??[]].filter(mon=>SOUTH_ORIGINS.has(mon.met));
  const localNames=[...new Set(local.map(mon=>SPECIES[mon.species].name))].slice(0,5).join('·')||'아직 없음';

  if(save.map==='tour_violet'&&event==='tourGuide'){
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say('도라지시티 안내원',[
      `현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`,
      '동쪽은31·30번도로와 무궁 방향, 북쪽은32번도로·연결동굴·고동 방향, 남쪽은36번도로 갈림길과 자연공원·35번도로를 지나 금빛 방향이다.',
      '모다피의 탑에서는 동료와 세 층의 균형 수련을 할 수 있다. 체육관 도전과는 별개다.',
    ],undefined,[
      {label:'센터에서 준비',action:guide('tour_violet_center','도라지 회복 안내','센터에서 회복과 PC 편성을 한 뒤 탑으로 갈 수 있다.')},
      {label:'모다피의 탑 수련',action:guide('tour_violet_hall','모다피의 탑 안내','1층 흔들리는 기둥 앞에서 건강한 동료와 첫걸음을 시작한다.','violetTowerFirstStep')},
      {label:'32번도로 귀환',action:guide('tour_johto_route_32','성도 남부 귀환 안내','북쪽 출구에서 32번도로로 돌아가 연결동굴과 고동 방향으로 내려갈 수 있다.')},
      {label:'31번도로·무궁 방향',action:guide('tour_johto_route_31','성도 남동부 귀환 안내','동쪽 출구에서31번도로로 나가 남쪽30번도로와 무궁시티까지 돌아갈 수 있다.')},
      {label:'남쪽 금빛 방향',action:guide('tour_johto_route_36','도라지 남쪽 안내','남쪽 출구에서 36번도로 갈림길로 나가 자연공원과 35번도로를 지나 금빛시티로 간다.')},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourVioletRoute32Stone'){
    g.say('32번도로 도착 기록석',['도라지시티 → 32번도로 → 연결동굴 1층 → 33번도로 → 고동마을',`성도 남부에서 만난 보유 동료 ${local.length}마리\n${localNames}`,'특정 포획은 통행이나 탑 수련 조건이 아니다.'],undefined,[
      {label:'센터에서 편성',action:guide('tour_violet_center','도라지센터 안내','회복 장치와 PC를 이용한 뒤 탑 수련을 준비할 수 있다.','pc')},
      {label:'32번도로 표시',action:guide('tour_johto_route_32','32번도로 안내','도시 북쪽 출구에서 긴 물가길로 돌아간다.')},
      {label:'기록을 덮는다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourVioletRoute31Stone'){
    const southeast=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 30번도로'||mon.met==='성도 31번도로');
    const names=[...new Set(southeast.map(mon=>SPECIES[mon.species].name))].slice(0,5).join('·')||'아직 없음';
    const cave=[...save.party,...save.box??[]].filter(mon=>mon.met==='어둠의동굴 남서 구역');
    const caveSpecies=Number(save.flags.darkCaveSurveyPartnerSpecies??0),caveName=SPECIES[caveSpecies]?.name;
    const caveRecord=save.flags.darkCaveSurveyCompleted&&caveName
      ?`${caveName}와 어둠의동굴 입구 탐사를 마치고31번도로로 돌아온 기록이 있다. Lv.${Number(save.flags.darkCaveSurveyStartLevel??0)} → 완료 당시 Lv.${Number(save.flags.darkCaveSurveyEndLevel??save.flags.darkCaveSurveyStartLevel??0)}.`
      :`어둠의동굴에서 만난 보유 동료 ${cave.length}마리. 현지 동료와 입구 탐사 기록을 남길 수 있다.`;
    g.say('31번도로 동문 기록석',['도라지시티 → 31번도로 → 30번도로 → 무궁시티',`30·31번도로에서 만난 보유 동료 ${southeast.length}마리\n${names}`,caveRecord,'31번도로 동쪽 어둠의동굴은 남서 탐사 고리까지 왕복할 수 있다. 북동 심부와46·45번도로 관통은 아직 경계다.','특정 포획·배틀·배지는 통행 조건이 아니다.'],undefined,[
      {label:'31번도로로 나가기',action:guide('tour_johto_route_31','31번도로 안내','동쪽 문에서 작은 연못과 어둠의동굴 입구를 지나30번도로로 내려간다.')},
      {label:'어둠의동굴 탐사',action:guide('tour_johto_dark_cave_west','어둠의동굴 안내','31번도로 동쪽 입구에서 밝은 돌 고리와 선택 암반 지대를 살핀다.','tourDarkCaveHabitat')},
      {label:'센터에서 회복',action:guide('tour_violet_center','도라지센터 안내','동료를 회복하고 PC에서 다음 파티를 준비할 수 있다.')},
      {label:'기록을 덮는다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourVioletTrainingYard'){
    g.say('탑 수련 앞마당',[save.flags.violetTowerFirstStep?'1층에서 동료와 맞춘 첫걸음 기록이 있다. 이제 2층 균형 수련을 이어갈 수 있다.':'탑 1층에서 흔들리는 기둥을 보고 동료와 첫걸음을 맞출 수 있다.','체육관·배지와 별개의 선택 활동이며 언제든 그만둘 수 있다.'],undefined,[
      {label:'탑 1층으로',action:guide('tour_violet_hall','모다피의 탑 안내','1층 첫걸음 수련 자리에서 동료를 고르자.','violetTowerFirstStep')},
      {label:'센터로',action:guide('tour_violet_center','도라지센터 안내','동료가 지쳤다면 먼저 실제 회복을 받자.')},
      {label:'그대로 둔다',action:()=>{}},
    ]);return true;
  }
  if(event==='tourVioletBirdBasin'){
    const birds=save.party.filter(mon=>SPECIES[mon.species].types.includes('비행'));
    g.say('새 포켓몬 물그릇',[birds.length?`${birds.slice(0,3).map(mon=>SPECIES[mon.species].name).join('·')}도 물그릇과 낮은 나뭇가지를 살펴본다.`:'작은 발자국과 깃털이 남았지만 현재 파티의 비행 타입 동료는 없다.','마을의 생활 장소이며 조사만으로 야생 포켓몬을 만나거나 포획하지 않는다.']);return true;
  }
  if(event==='tourVioletSouthStone'){g.say('36번도로 방향 표석',['도라지시티 → 36번도로 갈림길','서쪽 가지는 자연공원 → 35번도로 → 금빛시티, 동쪽 가지는 37번도로 → 인주시티','모든 구간은 같은 길로 돌아올 수 있다.']);return true;}

  if(event==='violetCenterRouteChart'){
    const practiced=Number(save.flags.violetTowerPracticeSpecies??0);
    const towerWon=Boolean(save.flags['trainerWon:violet-tower-practice']);
    g.say('도라지 여행 방향도',['북쪽은 32번도로 → 연결동굴 1층 → 33번도로 → 고동마을',`성도 남부에서 만난 보유 동료 ${local.length}마리\n${localNames}`,towerWon&&practiced&&SPECIES[practiced]?`${SPECIES[practiced].name}와 탑 세 층 수련 뒤 선택 배틀까지 마친 기록이 있다.`:practiced&&SPECIES[practiced]?`모다피의 탑에서 ${SPECIES[practiced].name}와 수련한 기록이 있다.`:'탑 1층에서 건강한 동료와 선택 수련을 시작할 수 있다.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current('tour_violet_center')){g.panel='party';g.partyIndex=0;}}},
      {label:'센터 PC 안내',action:()=>{if(current('tour_violet_center'))g.setTourDestination('tour_violet_center','pc');}},
      {label:'모다피의 탑 안내',action:guide('tour_violet_hall','모다피의 탑 안내','1층에서 흔들리는 기둥과 동료의 움직임을 맞춰 보자.','violetTowerFirstStep')},
      {label:'32번도로 안내',action:guide('tour_johto_route_32','32번도로 안내','도시 북쪽 출구에서 긴 물가길로 돌아갈 수 있다.')},
      {label:'지도를 덮는다',action:()=>{}},
    ]);return true;
  }
  if(event==='violetCenterRouteBench'){
    g.say('32번도로 동료 휴게석',[save.party.length?`현재 동료 ${save.party.length}마리 중 부상 ${save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length} · 기절 ${save.party.filter(mon=>mon.hp<=0).length}`:'현재 파티에 동료가 없다.',local.length?`파티와 PC에 성도 남부 출신 동료 ${local.length}마리가 있다.`:'성도 남부에서 새 동료를 잡지 않아도 탑과 도시를 둘러볼 수 있다.','이 좌석은 상태를 확인하는 자리다. 실제 회복은 간호사에게 부탁하자.']);return true;
  }
  if(event==='violetCenterBirdRest'){g.say('새 포켓몬 낮은 쉼뜰',['낮은 횃대와 얕은 물그릇을 센터 안쪽에 마련했다.','야생 조우나 포획은 시작되지 않으며 실제 회복은 간호사가 담당한다.']);return true;}

  if(event==='violetTowerFirstStep'){
    const healthy=save.party.filter(mon=>mon.hp>0);
    if(!healthy.length){g.say('첫걸음 수련 자리',['함께 발을 맞출 건강한 동료가 없다.','센터에서 회복하거나 PC로 동료를 편성한 뒤 다시 와도 된다. 수련은 통행 조건이 아니다.']);return true;}
    g.say('첫걸음 수련 자리',['흔들리는 기둥이 왼쪽으로 기울 때 한 걸음 멈추고, 돌아올 때 동료와 함께 발을 옮긴다.','함께 시작할 건강한 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current('tour_violet_hall')||!save.party.includes(mon)||mon.hp<=0)return;
      save.flags.violetTowerFirstStep=true;save.flags.violetTowerPracticeSpecies=mon.species;g.persist();
      g.say('모다피의 탑 첫걸음',[`${SPECIES[mon.species].name}와 기둥의 흔들림을 보고 멈춤과 한 걸음을 맞췄다.`,'HP·경험치·능력치는 변하지 않는다. 2층 균형 수련으로 이어갈 수 있다.']);
    }})),{label:'나중에 한다',action:()=>{}}]);return true;
  }
  if(event==='violetTowerPillar'){g.say('흔들리는 나무 기둥 받침',[save.flags.violetTowerFirstStep?'동료와 첫걸음을 맞춘 뒤 보니 기둥의 흔들림과 바닥 받침의 차이가 더 잘 보인다.':'기둥은 천천히 흔들리지만 넓은 받침은 자리를 지킨다. 1층 수련 자리에서 건강한 동료와 움직임을 맞춰 볼 수 있다.']);return true;}
  if(event==='violetTowerFloorGuide'){g.say('모다피의 탑 층별 안내',['1층 기둥 관찰과 첫걸음 → 2층 균형 수련 → 3층 호흡과 도시 전망','수련은 선택이며 체육관·배지·통행과 무관하다.']);return true;}
  if(event==='violetTowerBalancePillar'){
    const species=Number(save.flags.violetTowerPracticeSpecies??0),mon=save.party.find(p=>p.species===species&&p.hp>0);
    if(!save.flags.violetTowerFirstStep||!mon){g.say('균형 수련 기둥',['1층 첫걸음 기록과 함께 수련할 건강한 동료를 확인할 수 없다.','1층으로 돌아가 동료를 고르거나 센터에서 회복하자. 위층 이동은 막히지 않는다.']);return true;}
    g.say('균형 수련 기둥',[`${SPECIES[mon.species].name}와 발 모양 표식을 따라 천천히 중심을 옮겨 볼 수 있다.`,'실패나 낙하 없이 언제든 멈출 수 있으며 HP·경험치는 변하지 않는다.'],undefined,[
      {label:'균형 수련을 한다',action:()=>{if(!current('tour_violet_hall_2f')||!save.party.includes(mon)||mon.hp<=0)return;save.flags.violetTowerBalancePracticed=true;g.persist();g.say('모다피의 탑 균형 수련',[`${SPECIES[mon.species].name}와 세 발자국을 천천히 옮기고 흔들림이 멎을 때 함께 멈췄다.`,'2층 수련 기록을 남겼다. 3층에서 호흡을 마무리할 수 있다.']);}},
      {label:'지금은 쉬어 간다',action:()=>{}},
    ]);return true;
  }
  if(event==='violetTowerTrainingLog'){g.say('수련생 관찰 기록',[save.flags.violetTowerBalancePracticed?'첫걸음 뒤 2층 균형 수련을 마친 기록과 같은 순서가 적혀 있다.':'기둥의 흔들림을 이긴 시간이 아니라 멈추고 다시 중심을 잡는 방법을 적었다.','승리·상금·배지 기록은 아니다.']);return true;}
  if(event==='violetTowerCompanionMat'){g.say('동료와 쉬는 마루',['사람 방석 옆에 포켓몬이 몸을 돌릴 빈자리가 있다.','HP는 회복되지 않는다. 지친 동료는 센터 간호사에게 데려가자.']);return true;}
  if(event==='violetTowerBreathingBell'){
    const species=Number(save.flags.violetTowerPracticeSpecies??0);
    if(!save.flags.violetTowerBalancePracticed||!species||!SPECIES[species]){g.say('바람 호흡 종',['바람에 맞춰 종이 천천히 울린다.','1층 첫걸음과 2층 균형 수련을 하지 않아도 전망과 계단은 이용할 수 있다.']);return true;}
    g.say('바람 호흡 종',[`${SPECIES[species].name}와 종소리 두 번 동안 숨을 고르고 도라지의 바람을 느꼈다.`,'세 층 수련을 마무리해 수첩에 남길 수 있다.'],undefined,[
      {label:'수련을 마무리한다',action:()=>{if(!current('tour_violet_hall_3f'))return;save.flags.violetTowerPracticeCompleted=true;g.persist();g.say('모다피의 탑 수련',[`${SPECIES[species].name}와 첫걸음·균형·호흡 수련을 마쳤다.`,'보상·능력 변화·체육관 조건은 없다. 도시와 다음 길은 계속 자유롭게 이용할 수 있다.']);}},
      {label:'종소리만 듣는다',action:()=>{}},
    ]);return true;
  }
  if(event==='violetTowerViewSeat'){g.say('도라지 전망 자리',['북쪽은 32번도로·연결동굴·고동 방향이다.','남쪽은 현재 연결도로를 따라 금빛 방향이며 35번도로·자연공원·36번도로 분리는 아직 후속이다.']);return true;}
  if(event==='violetTowerJourneyBook'){
    const species=Number(save.flags.violetTowerPracticeSpecies??0);
    const towerWon=Boolean(save.flags['trainerWon:violet-tower-practice']);
    g.say('탑 여행 수첩',[save.flags.violetTowerPracticeCompleted&&species&&SPECIES[species]?`${SPECIES[species].name}와 세 층 수련을 마친 기록이 있다.`:'세 층 수련 완료 기록은 아직 없다.',towerWon?'2층 선택 배틀에서 주뱃과 꼬마돌의 다른 움직임에 맞춰 기술과 교대를 연습했다.':'세 층 수련 뒤 2층 수련생과 선택 배틀을 할 수 있다.',`성도 남부에서 만난 보유 동료 ${local.length}마리\n${localNames}`,'기록은 배지·통행 조건이 아니다.']);return true;
  }
  if(event==='violetMartTowerShelf'||event==='violetMartSouthChart'||event==='violetMartPackingBench'){
    g.say('도라지 여행 보급 안내',['모다피의 탑 수련과 32번도로 여행 전에 동료 상태와 가방을 확인하자.',`몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개`,'실제 판매 품목은 점원의 몬스터볼과 상처약이다.']);return true;
  }
  if(event==='violetHomeFloorTools'||event==='violetHomeTrainingAlbum'){g.say('탑 마루 생활 기록',[save.flags.violetTowerPracticeCompleted?'세 층 수련을 마친 뒤에도 주민과 포켓몬이 함께 마루를 닦고 발자국 표식을 정리한다.':'수련이 끝나면 주민과 포켓몬이 천과 솔로 나무 마루를 함께 돌본다.','탑은 수련 장소이면서 마을 사람들이 관리하는 생활 공간이다.']);return true;}
  if(event==='violetHomeBirdPerch'||event==='violetHomeWaterChart'){g.say('새 포켓몬 돌봄 기록',['낮은 횃대와 물그릇을 작은 발과 날개에 맞춰 관리한다.','야생 포획이나 특정 종 소유를 요구하지 않는 마을 생활 기록이다.']);return true;}
  if(event==='violetHomeRouteJournal'||event==='violetHomeFamilyRest'){g.say('성도 남부 여행 생활',[`성도 남부에서 만난 보유 동료 ${local.length}마리 · ${localNames}`,'절벽·물가·동굴을 지나온 동료는 센터에서 상태를 확인한 뒤 탑이나 다음 길로 향한다.']);return true;}
  return false;
}
