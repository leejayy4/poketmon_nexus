import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';

const SLOT='veilstoneTrainingPartnerSlot',SPECIES_FLAG='veilstoneTrainingPartner';
const FIELD='veilstoneTrainingFieldObserved',REVIEW='veilstoneTrainingReviewed';
export const VEILSTONE_FIELD_EVENT='veilstoneTrainingField';

export function installVeilstoneTrainingField(map:GameMap,outdoors:TourOutdoors){
  const object=outdoors.objects.find(item=>item.name==='남쪽 훈련 절벽');if(!object)return;
  const previous=object.event,cells=new Set(object.cells.map(cell=>`${cell.x},${cell.y}`));object.event=VEILSTONE_FIELD_EVENT;
  for(const prop of map.props)if(prop.dialogue===previous&&cells.has(`${prop.x},${prop.y}`))prop.dialogue=VEILSTONE_FIELD_EVENT;
}

/** Optional observation loop for Maylene preparation; it grants no battle progress or reward. */
export function handleVeilstoneTraining(g:Engine,event:string):boolean{
  const save=g.save,current=(map:string)=>()=>g.save===save&&save.map===map&&!g.battle;
  const selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[SPECIES_FLAG]?mon:undefined;};
  if(save.map==='tour_veilstone'&&event===VEILSTONE_FIELD_EVENT){
    const mon=selected();
    if(!mon){g.say('남쪽 훈련 절벽',['낮은 발판이 이어진다.\n백화점 2층에서 관찰 동료를 먼저 골라 보자.'],undefined,[{label:'백화점 자료 안내',action:()=>{if(current('tour_veilstone')())g.setTourDestination('tour_veilstone_hall_2f','veilstoneTechniqueDesk');}},{label:'돌아가기',action:()=>{}}]);return true;}
    if(mon.hp<=0){g.say('남쪽 훈련 절벽',[`${SPECIES[mon.species].name}은 지쳐 있다.\n센터에서 회복한 뒤 균형을 살펴보자.`]);return true;}
    save.flags[FIELD]=true;save.flags[REVIEW]=false;g.persist();
    g.say('균형 관찰',[`${SPECIES[mon.species].name}와 낮은 발판을 천천히 오르내렸다.\n발을 딛고 방향을 바꾸는 움직임을 살폈다.`,'백화점 2층의 타입 대응표와 비교하면\n자두 체육관 준비를 정리할 수 있다.'],undefined,[{label:'자료실 안내',action:()=>{if(current('tour_veilstone')())g.setTourDestination('tour_veilstone_hall_2f','veilstoneTechniqueDesk');}},{label:'관찰 마치기',action:()=>{}}]);return true;
  }
  if(save.map!=='tour_veilstone_hall_2f'||event!=='veilstoneTechniqueDesk')return false;
  const choose=()=>g.say('관찰 동료',['외부 수련광장에서 움직임을 살펴볼 동료를 고르세요.'],undefined,[...save.party.map(mon=>({label:SPECIES[mon.species].name,action:()=>{
    if(!current('tour_veilstone_hall_2f')()||!save.party.includes(mon))return;
    if(mon.hp<=0){g.say('기술 준비 안내원',['지친 동료는 센터에서 먼저 쉬게 해 주세요.'],choose);return;}
    save.flags[SLOT]=save.party.indexOf(mon);save.flags[SPECIES_FLAG]=mon.species;save.flags[FIELD]=false;save.flags[REVIEW]=false;g.persist();
    g.say('기술 준비 자료',[`${SPECIES[mon.species].name}의 현재 움직임을 살펴보기로 했다.\n남쪽 훈련 절벽의 낮은 발판으로 가 보자.`]);
  }})),{label:'돌아가기',action:()=>{}}]);
  const mon=selected();
  if(!mon){if(!save.party.length){g.say('기술 준비 안내원',['함께 살펴볼 동료가 생기면 다시 찾아와 주세요.']);return true;}choose();return true;}
  if(save.flags[FIELD]){save.flags[REVIEW]=true;g.persist();g.say('기술 준비 자료',[`${SPECIES[mon.species].name}의 발판 움직임과 타입 대응표를 비교했다.\n교대와 회복 시점을 서두르지 않는 것이 좋겠다.`,'이 기록은 자두 체육관의 도전 조건이 아니다.\n안내원에게 실제 파티 기준 준비 조언을 다시 확인하자.']);return true;}
  g.say('기술 준비 자료',[`관찰 동료: ${SPECIES[mon.species].name}\n아직 외부 수련광장의 움직임을 살피지 않았다.`],undefined,[{label:'동료 다시 고르기',action:choose},{label:'수련광장 안내',action:()=>{if(current('tour_veilstone_hall_2f')())g.setTourDestination('tour_veilstone',VEILSTONE_FIELD_EVENT);}},{label:'돌아가기',action:()=>{}}]);return true;
}
