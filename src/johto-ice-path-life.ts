import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const MAPS=new Set(['tour_johto_route_44','tour_johto_ice_path_1f','tour_johto_ice_path_b1f','tour_johto_ice_path_b2f','tour_johto_ice_path_b3f']);
export function handleJohtoIcePathLife(g:Engine,event:string):boolean{
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle,healthy=save.party.filter(mon=>mon.hp>0);
  const local=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 44번도로'||mon.met==='얼음샛길');
  const localLine=local.length?`동부 산길 출신 동료 ${local.length}마리 · ${[...new Set(local.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')}`:'44번도로·얼음샛길에서 만난 보유 동료는 아직 없다.';
  const species=Number(save.flags.icePathCompanionSpecies??0),name=SPECIES[species]?.name,partner=()=>save.party.find(mon=>mon.species===species&&mon.hp>0);
  const progress=save.flags.icePathTraverseObserved?'찬바람·얼음마루·고드름 관찰 완료':save.flags.icePathColdCompared?'B1F까지 동행 관찰 진행 중':name?`${name}와 동행 준비 기록 있음`:'동행 관찰 기록 없음';
  if(event==='journeyWalker'){
    g.say(g.save.map==='tour_johto_route_44'?'44번도로 연못 여행자':'얼음샛길 산행객',[localLine,progress,g.save.map==='tour_johto_route_44'?'서쪽은 황토마을, 동쪽은 얼음샛길 네 층과 검은먹시티다.':'1F 서쪽→B1F→B2F→B3F→1F 동쪽 순서로 검은먹에 닿으며 모든 계단은 되돌아갈 수 있다.','포획·배틀·동행 기록 없이도 본선과 계단은 열린다.']);return true;
  }
  if(event==='tourRoute44ColdShelter'){
    if(!healthy.length){g.say('차가운 바람 쉼터',[localLine,'함께 바람을 살필 건강한 동료가 없다. 황토센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.','활동 없이도 얼음샛길과 검은먹 방향은 열린다.']);return true;}
    g.say('차가운 바람 쉼터',[localLine,'얼음샛길에 들어가기 전 바람과 체온 변화를 함께 살필 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(!current('tour_johto_route_44')||!save.party.includes(mon)||mon.hp<=0)return;save.flags.icePathCompanionSpecies=mon.species;save.flags.icePathShelterObserved=true;delete save.flags.icePathColdCompared;delete save.flags.icePathTraverseObserved;g.persist();g.say('찬바람 동행 준비',[`${SPECIES[mon.species].name}와 바위벽 안팎의 바람과 발밑 온도를 비교했다.`,'HP·경험치·능력치·도구는 변하지 않는다. B1F 얼음마루에서 이어갈 수 있다.']);}})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='icePathB1IceBoard'){
    const mon=partner();if(!save.flags.icePathShelterObserved||!name){g.say('B1F 얼음마루 안내',[localLine,'44번도로 찬바람 쉼터에서 건강한 동료와 관찰을 시작할 수 있다.','시작하지 않아도 모든 계단은 이용할 수 있다.']);return true;}if(!mon){g.say('B1F 얼음마루 안내',[`${name}와 시작한 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'기록은 보존된다. 회복하거나 다시 편성한 뒤 이어가자.']);return true;}save.flags.icePathColdCompared=true;g.persist();g.say('얼음마루 동행 관찰',[`${name}와 마른 암반·얇은 서리·넓은 얼음마루에서 발의 움직임을 비교했다.`,'강제 미끄럼이나 능력 변화는 생기지 않는다. B3F 고드름 회랑에서 기록을 정리할 수 있다.']);return true;
  }
  if(event==='icePathB3IcicleBoard'){
    const mon=partner();if(!save.flags.icePathColdCompared||!name){g.say('B3F 고드름 회랑',[localLine,progress,'B1F 얼음마루 관찰 뒤 같은 건강한 동료와 기록을 정리할 수 있다.']);return true;}if(!mon){g.say('B3F 고드름 회랑',[`${name}와 이어 온 기록이 있지만 현재 건강한 상태로 파티에 없다.`,'기록은 보존되며 계단과 출구는 계속 열린다.']);return true;}const first=!save.flags.icePathTraverseObserved;save.flags.icePathTraverseObserved=true;g.persist();g.say('얼음샛길 동행 기록',[`${name}와 찬바람·얼음마루·고드름 물방울의 차이를 수첩에 정리했다.`,first?'네 층을 걷는 동료 관찰 기록을 남겼다.':'앞서 남긴 동행 기록을 다시 확인했다.','보상·능력 변화·도구·스토리 잠금은 생기지 않는다.']);return true;
  }
  const titles:Record<string,string>={tourRoute44MahoganyStone:'황토 동쪽44번도로 표석',tourRoute44PondRail:'쌍둥이 연못 관찰 난간',tourRoute44IcePathBoard:'얼음샛길 서쪽 입구 표지',icePathWestMarker:'얼음샛길 서쪽 온도 표식',icePathB1StairBoard:'B1F 서리 계단',icePathBlackthornLight:'검은먹 쪽 바깥빛 표식',icePathB1ReturnBoard:'1F 귀환 계단',icePathB2StairBoard:'B2F 진행 계단',icePathB2RockBoard:'B2F 바위홈 관찰판',icePathB2ReturnBoard:'B1F 귀환 계단',icePathB3StairBoard:'B3F 진행 계단',icePathB3ReturnBoard:'B2F 귀환 계단',icePathExitStairBoard:'검은먹 방향1F 계단'};
  if(!titles[event])return false;g.say(titles[event],[localLine,progress,'황토마을 → 44번도로 → 얼음샛길 1F/B1F/B2F/B3F → 검은먹시티','미끄럼 강제 이동·바위 밀기·도구·스토리 잠금은 아직 없다.']);return true;
}
