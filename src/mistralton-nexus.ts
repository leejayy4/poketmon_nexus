import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { RUNTIME_RULES } from './data/rules';

export const MISTRALTON_NEXUS={
  partner:'nexusMistraltonCargoPartner',slot:'nexusMistraltonCargoPartnerSlot',prepared:'nexusMistraltonCargoPrepared',
  loaded:'nexusMistraltonCargoLoaded',kind:'nexusMistraltonCargoKind',rested:'nexusMistraltonCargoRested',completed:'nexusMistraltonCargoCompleted',rewarded:'nexusMistraltonCargoRewarded',
} as const;

const claimCargoSupply=(g:Engine):string=>{
  const f=MISTRALTON_NEXUS;
  if(g.save.flags[f.rewarded])return '앞서 작업 보급을 받았다.';
  if(g.save.inventory.pokeBalls+3>RUNTIME_RULES.inventoryCapacity)return '몬스터볼 3개를 넣을 공간이 부족하다. 작업 기록은 보존되며, 공간을 마련하고 이 적재표에서 보급을 받을 수 있다.';
  g.save.inventory.pokeBalls+=3;g.save.flags[f.rewarded]=true;g.persist();
  return '작업 보급으로 몬스터볼 3개를 받았다.';
};
const eligible=(species:number)=>SPECIES[species]?.types.some(type=>type==='비행'||type==='에스퍼');
const current=(g:Engine)=>{
  const f=MISTRALTON_NEXUS,slot=g.save.flags[f.slot],mon=typeof slot==='number'?g.save.party[slot]:undefined;
  return mon?.species===g.save.flags[f.partner]?mon:undefined;
};
const choosePartner=(g:Engine)=>{
  const f=MISTRALTON_NEXUS,save=g.save,choices=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0&&eligible(mon.species));
  if(!choices.length){g.say('화물 적재표',['작은 화물의 높이와 바람을 함께 살필 비행 또는 에스퍼타입 동료가 필요하다.','건강한 동료를 파티에 편성한 뒤 다시 확인하자. 이 활동을 하지 않아도 센터·전기돌동굴·산로행 왕복편은 이용할 수 있다.']);return;}
  g.say('화물 적재표',['바람 속에서 상자 위치를 살필 건강한 비행 또는 에스퍼타입 동료를 고르자.','선택한 실제 파티 동료가 적재장과 쉼터까지 함께해야 한다.'],undefined,[...choices.map(({mon,slot})=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{if(g.save!==save||save.map!=='tour_mistralton_hall_2f'||save.party[slot]!==mon||mon.hp<=0)return;save.flags[f.partner]=mon.species;save.flags[f.slot]=slot;save.flags[f.prepared]=true;delete save.flags[f.loaded];delete save.flags[f.kind];delete save.flags[f.rested];g.persist();g.say('화물 적재표',[`${SPECIES[mon.species].name}와 적재 순서를 확인했다.`,'외부 화물 적재장에서 광물 표본과 농산물 중 먼저 실을 화물을 고르자.']);}})),{label:'나중에 고른다',action:()=>{}}]);
};

export function handleMistraltonNexus(g:Engine,id:string):boolean{
  const f=MISTRALTON_NEXUS;
  if(g.save.map==='tour_mistralton_hall_2f'&&id==='tourMistraltonCargoLog'){
    const mon=current(g);
    if(g.save.flags[f.completed]){const supply=claimCargoSupply(g);const species=Number(g.save.flags[f.partner]??0);g.say('화물 적재표',[species&&SPECIES[species]?`${SPECIES[species].name}와 마친 적재·휴식 기록이 보존돼 있다.`:'앞서 마친 적재·휴식 기록이 보존돼 있다.',supply,'활주로 가장자리 농산물과 전기돌동굴 표본을 빠르고 안전하게 나누었다.','1층 조종사에게 산로행 왕복편을 물어보거나 남쪽 전기돌동굴로 돌아갈 수 있다.']);return true;}
    if(!g.save.flags[f.prepared]||!mon){choosePartner(g);return true;}
    if(mon.hp<=0){g.say('화물 적재표',[`${SPECIES[mon.species].name}가 지쳐 있다.`,'북서쪽 포켓몬센터에서 회복한 뒤 같은 동료와 돌아오자. 먼저 기록한 적재 순서는 유지된다.']);return true;}
    if(!g.save.flags[f.loaded]){g.say('화물 적재표',[`${SPECIES[mon.species].name}와 적재 순서를 준비했다.`,'외부 동쪽 화물 적재장에서 실제 상자 배치를 확인하자.']);return true;}
    if(!g.save.flags[f.rested]){g.say('화물 적재표',['화물 배치를 마쳤다.','적재장 동쪽 바람쉼터에서 함께 일한 동료의 날개·발·호흡과 물그릇을 확인하자.']);return true;}
    g.save.flags[f.completed]=true;
    const reward=claimCargoSupply(g);
    g.persist();g.say('화물 적재표',[`${SPECIES[mon.species].name}와 적재·휴식 기록을 함께 마쳤다.`,reward,'이 활동은 체육관·도감·항공편의 통행 조건이 아니다.']);return true;
  }
  if(g.save.map==='tour_mistralton'&&(id==='tourOutdoor3'||id==='tourOutdoor4')&&g.save.flags[f.completed]){
    g.say('화물 작업 기록',['함께 마친 적재와 휴식 기록이 남아 있다.','터미널 2층에서 기록과 남은 보급을 확인하거나 1층에서 다음 항공편을 물어보자.']);return true;
  }
  if(g.save.map==='tour_mistralton'&&id==='tourOutdoor3'){
    const mon=current(g);if(!g.save.flags[f.prepared]||!mon){g.say('화물 적재장',['터미널 2층 화물 적재표에서 함께 일할 동료와 순서를 먼저 정하자.']);return true;}
    if(mon.hp<=0){g.say('화물 적재장',[`${SPECIES[mon.species].name}가 지쳐 있다. 센터에서 회복한 뒤 돌아오자.`]);return true;}
    const save=g.save,load=(kind:number)=>{if(g.save!==save||save.map!=='tour_mistralton'||current(g)!==mon||mon.hp<=0||save.flags[f.completed])return;save.flags[f.loaded]=true;save.flags[f.kind]=kind;delete save.flags[f.rested];g.persist();g.say('화물 적재장',[kind===1?'무거운 전기돌동굴 광물 표본을 아래쪽에 고정하고 농산물을 바람 반대편에 놓았다.':'농산물 바구니를 그늘 쪽에 먼저 놓고 광물 표본을 낮은 고정대에 묶었다.',`${SPECIES[mon.species].name}가 바람을 읽으며 흔들리는 상자를 알려 주었다.`,'동쪽 바람쉼터에서 함께 일한 동료를 쉬게 하자.']);};
    g.say('화물 적재장',[g.save.flags[f.loaded]?'상자 배치를 다시 고를 수 있다. 배치를 바꾸면 작업 뒤 동료의 물과 그늘도 다시 확인하자.':'광물 표본과 활주로 가장자리 농산물을 어떤 순서로 실을지 고르자.'],undefined,[{label:'광물 표본부터 고정',action:()=>load(1)},{label:'농산물부터 그늘로',action:()=>load(2)},{label:'아직 싣지 않는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_mistralton'&&id==='tourOutdoor4'){
    const mon=current(g);if(!g.save.flags[f.loaded]||!mon){g.say('비행 포켓몬 바람쉼터',['화물 적재장에서 동료와 상자 배치를 마친 뒤 쉬어 가자.','누구나 통행할 수 있는 쉼터이며 작업 기록이 없어도 도시 이동은 가능하다.']);return true;}
    if(mon.hp<=0){g.say('비행 포켓몬 바람쉼터',[`${SPECIES[mon.species].name}는 먼저 포켓몬센터의 치료가 필요하다.`]);return true;}
    const save=g.save;g.say('비행 포켓몬 바람쉼터',[`${SPECIES[mon.species].name}의 날개·발·호흡과 물그릇을 살펴보자.`,'이 휴식은 HP를 회복하거나 능력치를 바꾸지 않는다.'],undefined,[{label:'물과 그늘을 확인',action:()=>{if(g.save!==save||save.map!=='tour_mistralton'||current(g)!==mon||mon.hp<=0||save.flags[f.completed])return;save.flags[f.rested]=true;g.persist();g.say('비행 포켓몬 바람쉼터',[`${SPECIES[mon.species].name}가 물을 마시고 바람이 약한 그늘에서 쉬었다.`,'터미널 2층 적재표에 작업과 휴식을 함께 남기자.']);}},{label:'센터에서 먼저 쉰다',action:()=>{}}]);return true;
  }
  return false;
}
