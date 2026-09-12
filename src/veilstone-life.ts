import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const partner=(g:Engine)=>{const slot=g.save.flags.veilstoneTrainingPartnerSlot,mon=typeof slot==='number'?g.save.party[slot]:undefined;return mon&&mon.species===g.save.flags.veilstoneTrainingPartner?mon:undefined;};
const guide=(g:Engine,map:string,event:string)=>()=>{if(g.save.map==='tour_veilstone'&&!g.battle)g.setTourDestination(map,event);};

/** Veilstone residents connect city life to existing recovery, gym and observation contracts. */
export function handleVeilstoneLife(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_veilstone')return false;
  if(event==='tourResident0'){
    const mon=partner(g),hurt=g.save.party.some(p=>p.hp<p.maxHp),reviewed=Boolean(g.save.flags.veilstoneTrainingReviewed);
    const status=!g.save.party.length?'함께 여행할 동료가 생기면 센터와 백화점부터 둘러봐.':hurt?'지친 동료가 보여. 수련 전에 센터에서 쉬게 하자.':reviewed&&mon?`${SPECIES[mon.species].name}와 발판 관찰을 마쳤구나.\n이제 실제 자두전 준비를 확인해 봐.`:mon?`${SPECIES[mon.species].name}와 남쪽 훈련 절벽에서\n균형과 방향 전환을 살펴볼 수 있어.`:'백화점 2층에서 관찰 동료를 고른 뒤\n남쪽 훈련 절벽으로 내려가 봐.';
    g.say('광장 산책객',[status,'백화점은 보급·기술 자료·동료 휴게의 3개 층이야.\n수련 기록은 배지나 통행 조건이 아니야.'],undefined,[
      {label:'센터 안내',action:guide(g,'tour_veilstone_center','tourExhibit1')},
      {label:'백화점 2층',action:guide(g,'tour_veilstone_hall_2f','veilstoneTechniqueDesk')},
      {label:'수련광장',action:guide(g,'tour_veilstone','veilstoneTrainingField')},
      {label:'자두 체육관',action:guide(g,'veilstone_gym','sinnohGymGuide')},
      {label:'안내 마치기',action:()=>{}},
    ]);return true;
  }
  if(event==='tourResident1'){
    const badge=g.save.badges.includes('BADGE-GS04');
    g.say('백화점 직원',[badge?'자두에게 승리했군요. 도시 안내 자리에 있는\n관측 연구원이 다음 자료를 맡기려 해요.':'1층은 기본 보급, 2층은 기술 준비 자료,\n3층은 여행자와 동료의 휴게 공간이에요.','물가 방면 현행 길은 원작 214번도로·입지호수 근처·\n222번도로를 한 해안길로 줄인 연결입니다.','백화점 이용이나 수련 기록 없이도\n다음 길로 나갔다가 장막으로 돌아올 수 있어요.'],undefined,[
      {label:badge?'관측 연구원':'자두 준비',action:guide(g,badge?'tour_veilstone':'veilstone_gym',badge?'observation':'sinnohGymGuide')},
      {label:'214번도로 · 물가',action:guide(g,'tour_sinnoh_route_214','journeySign')},
      {label:'백화점 입구',action:guide(g,'tour_veilstone_hall','martClerk')},
      {label:'안내 마치기',action:()=>{}},
    ]);return true;
  }
  return false;
}
