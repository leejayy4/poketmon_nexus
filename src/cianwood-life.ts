import type { Engine } from './engine';
import { SPECIES } from './pokemon';

/** Cianwood exterior life and companion observation; no gym, rewards or new sea exits. */
export function handleCianwoodLife(g:Engine,event:string):boolean{
  if(!g.save.map.startsWith('tour_cianwood'))return false;
  const save=g.save,healthy=save.party.filter(p=>p.hp>0),state=save.party.length?`파티 ${save.party.length}마리 · 건강 ${healthy.length} · 기절 ${save.party.filter(p=>p.hp<=0).length}`:'현재 함께 걷는 동료가 없다.';
  const selected=()=>{const species=Number(save.flags.cianwoodWalkSpecies??0);return save.party.find(p=>p.species===species&&p.hp>0);};
  if(event==='cianwoodDojoBalanceMat'){
    const p=selected();if(!p||!save.flags.cianwoodBreathingPracticed){g.say('파도 균형 마루',[state,'외부 화단→해변 발자국→호흡마당 산책을 마친 건강한 동료와 실내 균형 수련을 이어갈 수 있다.','외부 기록이나 수련 없이도 도장 출입과 도시 이동은 열린다.']);return true;}
    save.flags.cianwoodDojoBalanced=true;save.flags.cianwoodDojoPosture=false;g.persist();g.say('파도 균형 수련',[`${SPECIES[p.species].name}와 발 표식 위에서 파도 세 번 동안 중심을 옮겼다.`,'둥근바위 자세대에서 같은 동료와 다음 수련을 이어갈 수 있다.']);return true;
  }
  if(event==='cianwoodDojoStonePosture'){
    const p=selected();if(!p||!save.flags.cianwoodDojoBalanced){g.say('둥근바위 밀기 자세대',[state,'먼저 외부 산책과 도장 균형 마루를 같은 건강한 동료와 마치자.','고정된 바위를 실제로 밀거나 통로를 여는 장치는 아니다.']);return true;}
    save.flags.cianwoodDojoPosture=true;g.persist();g.say('둥근바위 자세 수련',[`${SPECIES[p.species].name}와 힘을 주기 전 발 위치·등의 각도·숨을 내쉬는 순서를 확인했다.`,'HP·능력치·지형은 변하지 않는다. 동행 기록대에서 수련을 정리할 수 있다.']);return true;
  }
  if(event==='cianwoodDojoPracticeLog'){
    const p=selected();if(!p||!save.flags.cianwoodDojoPosture){g.say('동행 수련 기록대',[state,'외부 해풍 산책과 실내 균형·자세 수련을 마치면 같은 동료와 기록할 수 있다.']);return true;}
    save.flags.cianwoodDojoPracticeCompleted=true;g.persist();g.say('진청 동행 수련 기록',[`${SPECIES[p.species].name}와 해변의 흐름을 읽고 균형과 자세로 이어 간 과정을 남겼다.`,'체육관·배지·보상·통행 조건은 바뀌지 않는다.']);return true;
  }
  if(/^cianwoodCenter/.test(event)){g.say('진청 여행 준비',[state,save.flags['trainerWon:cianwood-dojo-practice']?'바다 도장 선택 실전 승리 기록이 있다. 상금은 다시 지급되지 않는다.':save.flags.cianwoodDojoPracticeCompleted?'외부 산책과 도장 동행 수련을 마쳤다. 도장 수련생과 선택 실전을 할 수 있다.':'외부 산책 뒤 바다 도장에서 균형·자세·동행 기록을 이어갈 수 있다.','실제 회복과 PC 편성은 간호사와 센터 PC를 이용한다.']);return true;}
  if(/^cianwoodMart/.test(event)){g.say('진청 출발 준비',[state,'실제 판매 품목은 기존 몬스터볼과 상처약이다. 연락선 운임·수상 기술·체육관 도구는 판매하지 않는다.']);return true;}
  if(/^tour_cianwood_home/.test(event)){g.say('진청 공동주택 생활',[state,save.flags.cianwoodDojoPracticeCompleted?'동료와 남긴 해변·도장 수련 기록을 주민 생활 기록과 비교한다.':'장비 손질·연락선 시간·옥상 화분은 사람과 포켓몬의 해변 생활을 보여 준다.','조사로 회복·아이템·보상은 생기지 않는다.']);return true;}
  if(event==='tourCianwoodRoute41Board'){g.say('41번수로 상륙 표지',[state,'상륙 데크 → 41번수로 정기 연락선 → 40번수로 → 담청시티','소용돌이섬 외부는 선택 분기이며 섬 내부·수상 기술·전설 사건은 열리지 않았다.']);return true;}
  if(event==='tourCianwoodGardenCare'){
    if(!healthy.length){g.say('해풍 화단 돌봄대',[state,'건강한 동료와 다시 오면 화단에서 해변까지 함께 걸을 수 있다. 실제 회복은 센터에서 한다.']);return true;}
    g.say('해풍 산책 동료',['화단과 해변 발자국을 함께 살필 건강한 동료를 고르자.','특정 종이나 40·41번수로 포획은 필요하지 않다.'],undefined,[...healthy.map(p=>({label:SPECIES[p.species].name,action:()=>{if(g.save!==save||!save.party.includes(p)||p.hp<=0)return;save.flags.cianwoodWalkSpecies=p.species;save.flags.cianwoodTracksObserved=false;save.flags.cianwoodBreathingPracticed=false;g.persist();g.say('해풍 산책 시작',[`${SPECIES[p.species].name}와 낮은 화단의 잎과 물그릇을 살폈다.`,'해변 둥근바위 발자국판에서 산책을 이어갈 수 있다.']);}})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='tourCianwoodBeachTracks'){
    const p=selected();if(!p){g.say('해변 생태 발자국판',[state,'해풍 화단에서 건강한 동료를 먼저 고르면 함께 발자국을 비교할 수 있다.','조사 없이도 상륙 데크와 도시 통행은 열린다.']);return true;}
    save.flags.cianwoodTracksObserved=true;save.flags.cianwoodBreathingPracticed=false;g.persist();g.say('해변 발자국 관찰',[`${SPECIES[p.species].name}와 젖은 모래·둥근바위 주변의 발자국 크기와 방향을 비교했다.`,'도감 등록이나 야생 조우는 일어나지 않는다. 도장 앞 호흡 표식에서 산책을 마칠 수 있다.']);return true;
  }
  if(event==='tourCianwoodDojoMark'){
    const p=selected();if(!p||!save.flags.cianwoodTracksObserved){g.say('바다 도장 호흡 표식',[state,'화단에서 동료를 고르고 해변 발자국을 본 뒤 파도 소리에 맞춰 호흡을 정리할 수 있다.','이 수련은 체육관·배지·통행 조건이 아니다.']);return true;}
    save.flags.cianwoodBreathingPracticed=true;g.persist();g.say('해풍 호흡 수련',[`${SPECIES[p.species].name}와 파도 세 번에 맞춰 발을 옮기고 숨을 골랐다.`,'HP·경험치·능력·도구·배지·통행은 바뀌지 않는다.']);return true;
  }
  if(event==='tourCianwoodReturnLookout'){g.say('연락선 귀환 전망석',[state,save.flags.cianwoodBreathingPracticed?'해변 산책과 호흡 수련 기록이 남아 있다.':'동쪽 바다에서 41번수로 연락선이 담청 방향으로 돌아가는 것이 보인다.','서쪽 새 출구와 소용돌이섬 내부는 열리지 않았다.']);return true;}
  if(event==='tourResident0'){g.say('해변 산책객',[state,save.flags.cianwoodTracksObserved?'해변 발자국을 동료와 살폈구나. 도장 앞에서 파도에 맞춰 숨을 골라 봐.':'해풍 화단에서 동료를 고르면 해변 생태 산책을 시작할 수 있어.','산책 없이도 41번수로 연락선으로 돌아갈 수 있단다.']);return true;}
  if(event==='tourResident1'){g.say('도장 수련생',[state,save.flags['trainerWon:cianwood-dojo-practice']?'도장 선택 실전까지 마쳤구나. 센터에서 쉬고 41번수로 연락선으로 돌아갈 수 있어.':save.flags.cianwoodDojoPracticeCompleted?'동행 수련 기록을 마쳤구나. 도장 안 수련생과 선택 실전을 해 볼 수 있어.':save.flags.cianwoodBreathingPracticed?'동료와 파도 호흡을 맞췄구나. 도장 안에서 균형과 자세 수련을 이어가 봐.':'화단→해변 발자국→도장 앞 호흡 표식을 순서대로 걸어 봐.','현재 체육관전·관장·배지 사건은 열지 않았다.']);return true;}
  return false;
}
