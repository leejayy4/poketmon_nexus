import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const MAPS=new Set(['tour_johto_route_44','tour_johto_ice_path_1f','tour_johto_ice_path_b1f','tour_johto_ice_path_b2f','tour_johto_ice_path_b3f']);
export function handleJohtoIcePathLife(g:Engine,event:string):boolean{
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle,healthy=save.party.filter(mon=>mon.hp>0);
  const local=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 44번도로'||mon.met==='얼음샛길');
  const localLine=local.length?`동부 산길 출신 동료 ${local.length}마리 · ${[...new Set(local.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')}`:'44번도로·얼음샛길에서 만난 보유 동료는 아직 없다.';
  const species=Number(save.flags.icePathCompanionSpecies??0),name=SPECIES[species]?.name,slot=save.flags.icePathCompanionSlot;
  const tracked=()=>typeof slot==='number'&&save.party[slot]?.species===species?save.party[slot]:undefined;
  const partner=()=>{const mon=tracked();return mon&&mon.hp>0?mon:undefined;};
  const progress=save.flags.icePathTraverseObserved?'찬바람·얼음마루·고드름 관찰 완료':save.flags.icePathColdCompared?'B1F까지 동행 관찰 진행 중':name?`${name}와 동행 준비 기록 있음`:'동행 관찰 기록 없음';
  if(event==='journeyWalker'){
    g.say(g.save.map==='tour_johto_route_44'?'44번도로 연못 여행자':'얼음샛길 산행객',[localLine,progress,g.save.map==='tour_johto_route_44'?'서쪽은 황토마을, 동쪽은 얼음샛길 네 층과 검은먹시티다.':'1F 서쪽→B1F→B2F→B3F→1F 동쪽 순서로 검은먹에 닿으며 모든 계단은 되돌아갈 수 있다.','포획·배틀·동행 기록 없이도 본선과 계단은 열린다.']);return true;
  }
  if(event==='tourRoute44ColdShelter'){
    if(!healthy.length){g.say('차가운 바람 쉼터',[localLine,'함께 바람을 살필 건강한 동료가 없다. 황토센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.','활동 없이도 얼음샛길과 검은먹 방향은 열린다.']);return true;}
    g.say('차가운 바람 쉼터',[localLine,'얼음샛길에 들어가기 전 바람과 체온 변화를 함께 살필 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(!current('tour_johto_route_44')||!save.party.includes(mon)||mon.hp<=0)return;save.flags.icePathCompanionSpecies=mon.species;save.flags.icePathCompanionSlot=save.party.indexOf(mon);save.flags.icePathShelterObserved=true;delete save.flags.icePathColdCompared;delete save.flags.icePathTraverseObserved;g.persist();g.say('찬바람 동행 준비',[`${SPECIES[mon.species].name}와 바위벽 안팎의 바람과 발밑 온도를 비교했다.`,'같은 실제 동료와 B1F 얼음마루에서 이어갈 수 있다. HP·경험치·능력치·도구는 변하지 않는다.']);}})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='icePathB1IceBoard'){
    if(save.flags.icePathTraverseObserved&&name){
      g.say('얼음마루 동행 기록',[`${name}와 비교했던 마른 암반·서리·얼음마루의 기록이 남아 있다.`,'동행 관찰은 이미 마쳤다. 현재 동료를 바꾸거나 PC에 맡겨도 이 기록은 유지된다.','B3F에서 전체 기록을 다시 보거나 1F를 통해 44번도로로 돌아갈 수 있다.']);return true;
    }
    const mon=partner();if(!save.flags.icePathShelterObserved||!name){g.say('B1F 얼음마루 안내',[localLine,'44번도로 찬바람 쉼터에서 건강한 동료와 관찰을 시작할 수 있다.','시작하지 않아도 모든 계단은 이용할 수 있다.']);return true;}if(!mon){const same=tracked();g.say('B1F 얼음마루 안내',[`${name}와 시작한 기록은 남아 있지만 같은 실제 동료가 현재 건강한 파티에 없다.`,same?'기절했다면 황토센터에서 회복한 뒤 이어가자.':'PC 편성이나 이전 저장에는 객체 슬롯이 없을 수 있다. 44번도로 쉼터에서 동료를 명시적으로 다시 선택하자.'],undefined,[{label:'44번도로 쉼터로',action:()=>{if(current())g.setTourDestination('tour_johto_route_44','tourRoute44ColdShelter');}},{label:'황토센터로',action:()=>{if(current())g.setTourDestination('tour_mahogany_center',same?'nurse':'pc');}},{label:'동굴을 계속 걷는다',action:()=>{}}]);return true;}save.flags.icePathColdCompared=true;g.persist();g.say('얼음마루 동행 관찰',[`${name}와 마른 암반·얇은 서리·넓은 얼음마루에서 발의 움직임을 비교했다.`,'강제 미끄럼이나 능력 변화는 생기지 않는다. 같은 동료와 B3F 고드름 회랑에서 기록을 정리할 수 있다.']);return true;
  }
  if(event==='icePathB3IcicleBoard'){
    if(save.flags.icePathTraverseObserved&&name){g.say('얼음샛길 동행 기록',[`${name}와 찬바람·얼음마루·고드름 물방울을 비교한 기록이 남아 있다.`,'완료 기록은 당시 동료의 역사이며 현재 파티 편성이나 같은 종의 다른 개체를 요구하지 않는다.','서쪽 계단은 B2F·B1F와 44번도로, 동쪽 계단은 1F 검은먹 출구로 이어진다.']);return true;}
    const mon=partner();if(!save.flags.icePathColdCompared||!name){g.say('B3F 고드름 회랑',[localLine,progress,'B1F 얼음마루 관찰 뒤 같은 건강한 동료와 기록을 정리할 수 있다.']);return true;}if(!mon){const same=tracked();g.say('B3F 고드름 회랑',[`${name}와 이어 온 기록은 남아 있지만 같은 실제 동료가 현재 건강한 파티에 없다.`,same?'기절했다면 황토센터에서 회복한 뒤 돌아오자.':'같은 종의 다른 개체로 대신 완료하지 않는다. 44번도로 쉼터에서 동료를 다시 선택하면 새 동행으로 시작한다.','기록이 멈춰도 계단과 출구는 계속 열린다.'],undefined,[{label:'44번도로 쉼터로',action:()=>{if(current())g.setTourDestination('tour_johto_route_44','tourRoute44ColdShelter');}},{label:'검은먹 출구로',action:()=>{if(current())g.setTourDestination('tour_johto_ice_path_1f','icePathBlackthornLight');}},{label:'동굴에 머문다',action:()=>{}}]);return true;}const first=!save.flags.icePathTraverseObserved;save.flags.icePathTraverseObserved=true;g.persist();g.say('얼음샛길 동행 기록',[`${name}와 찬바람·얼음마루·고드름 물방울의 차이를 수첩에 정리했다.`,first?'같은 실제 동료와 네 층을 걸은 기록을 남겼다.':'앞서 남긴 동행 기록을 다시 확인했다.','보상·능력 변화·도구·스토리 잠금은 생기지 않는다.']);return true;
  }
  const titles:Record<string,string>={tourRoute44MahoganyStone:'황토 동쪽44번도로 표석',tourRoute44PondRail:'쌍둥이 연못 관찰 난간',tourRoute44IcePathBoard:'얼음샛길 서쪽 입구 표지',icePathWestMarker:'얼음샛길 서쪽 온도 표식',icePathB1StairBoard:'B1F 서리 계단',icePathBlackthornLight:'검은먹 쪽 바깥빛 표식',icePathB1ReturnBoard:'1F 귀환 계단',icePathB2StairBoard:'B2F 진행 계단',icePathB2RockBoard:'B2F 바위홈 관찰판',icePathB2ReturnBoard:'B1F 귀환 계단',icePathB3StairBoard:'B3F 진행 계단',icePathB3ReturnBoard:'B2F 귀환 계단',icePathExitStairBoard:'검은먹 방향1F 계단'};
  if(!titles[event])return false;g.say(titles[event],[localLine,progress,'황토마을 → 44번도로 → 얼음샛길 1F/B1F/B2F/B3F → 검은먹시티','미끄럼 강제 이동·바위 밀기·도구·스토리 잠금은 아직 없다.']);return true;
}
