import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const APPROACH='tour_dragonspiral_approach';
const MAPS=new Set([APPROACH,'tour_dragonspiral','tour_dragonspiral_hall','tour_dragonspiral_hall_2f','tour_dragonspiral_hall_3f']);
const SLOT='dragonspiralPartnerSlot',MON='dragonspiralPartnerSpecies',BASE='dragonspiralBaseObserved',STONE='dragonspiralMasonryObserved',WIND='dragonspiralWindRecorded';
const APPROACH_OBSERVED='dragonspiralApproachMoatObserved',APPROACH_MON='dragonspiralApproachPartnerSpecies';

/** Voluntary companion observation in the currently public three tower floors. */
export function handleDragonspiralLife(g:Engine,event:string):boolean{
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[MON]&&mon.hp>0?mon:undefined;};
  const species=Number(save.flags[MON]??0),name=SPECIES[species]?.name;
  const status=name?(selected()?`${name}와 이어가는 관찰 기록이 있다.`:`${name}와 시작한 기록이 있지만 현재 같은 동료가 건강한 상태로 파티에 없다.`):'1층 기단 방향석에서 건강한 동료를 선택할 수 있다.';
  const guide=(map:Parameters<Engine['setTourDestination']>[0],target?:string)=>()=>{if(current())g.setTourDestination(map,target);};

  if(save.map===APPROACH&&event==='tourGuide'){
    const locals=save.flags.icirrusMoorObservationCompleted?'설화의 습지에서 갈대와 물새 흔적을 살핀 기록이 있다.':'설화의 습지는 8번도로 북쪽 분기에서 따로 돌아볼 수 있다.';
    g.say('용나선 접근로 관리인',[locals,save.flags[APPROACH_OBSERVED]?'해자 가장자리의 흔적을 동료와 살핀 기록도 남아 있다.':'마른 중앙길은 탑 기슭까지 열려 있다. 해자 관찰은 선택 사항이다.','이곳은 도로 번호가 없는 설화시티 북문 접근로다.'],undefined,[
      {label:'해자 관찰 데크',action:guide(APPROACH,'tourDragonspiralMoat')},
      {label:'용나선탑 기슭',action:guide('tour_dragonspiral','tourDragonspiralFoundation')},
      {label:'설화시티 북문',action:guide('tour_icirrus','tourIcirrusNorthSign')},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(save.map===APPROACH&&event==='tourDragonspiralMoat'){
    const healthy=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0);
    if(!healthy.length){g.say('탑 해자 관찰 데크',['물가의 작은 발자국과 갈대가 눕는 방향이 보인다.','함께 살필 건강한 동료가 없어 기록은 남기지 않았다. 설화시티 센터에서 회복한 뒤 다시 와도 된다.','마른 중앙길과 탑 출입은 그대로 열려 있다.']);return true;}
    g.say('탑 해자 관찰 데크',[save.flags[APPROACH_OBSERVED]?'앞서 남긴 해자 가장자리 기록을 다른 동료와 다시 살필 수 있다.':'해자에 들어가지 않고 마른 데크에서 물가 흔적을 살필 동료를 고르자.','특정 종이나 설화 출신을 요구하지 않는다.'],undefined,[...healthy.map(({mon,slot})=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current(APPROACH)||save.party[slot]!==mon||mon.hp<=0)return;
      save.flags[APPROACH_OBSERVED]=true;save.flags[APPROACH_MON]=mon.species;g.persist();g.say('해자 가장자리 관찰',[`${SPECIES[mon.species].name}와 물가의 작은 발자국·갈대가 눕는 방향·돌기단의 마른 경계를 차례로 살폈다.`,'물에 들어가거나 야생 포켓몬을 불러내지 않았다. HP·경험치·소지품·통행 조건은 변하지 않는다.','북쪽 중앙길로 용나선탑 기슭까지 갈 수 있다.']);
    }})),{label:'혼자 둘러본다',action:()=>{g.say('탑 해자 관찰 데크',['마른 데크에서 물가 흔적과 돌기단의 경계만 확인했다.','동행 관찰 기록은 남기지 않았으며 탑으로 가는 길은 열려 있다.']);}}]);return true;
  }
  if(save.map===APPROACH&&(event==='tourDragonspiralIcirrusStone'||event==='tourDragonspiralGate')){
    const north=event==='tourDragonspiralGate';
    g.say(north?'용나선탑 남쪽 문':'설화 북문 귀환 표석',[north?'북쪽 중앙길은 용나선탑 기슭으로 이어진다.':'남쪽 중앙길은 설화시티 북문으로 돌아간다.',save.flags[APPROACH_OBSERVED]?'해자 가장자리 동행 관찰 기록을 마쳤다.':'해자 관찰은 선택 사항이며 지나치지 않아도 이동할 수 있다.',north?'전설 사건이나 포획은 이 문에서 시작하지 않는다.':'설화 동문에서 하나 8번도로로 이어갈 수 있다.']);return true;
  }

  if(save.map==='tour_dragonspiral'&&event==='tourGuide'){
    const approachSpecies=SPECIES[Number(save.flags[APPROACH_MON]??0)]?.name;
    const approach=save.flags[APPROACH_OBSERVED]?(approachSpecies?`${approachSpecies}와 남쪽 해자 가장자리를 살핀 기록이 보존 수첩에 이어져 있다.`:'남쪽 해자 가장자리를 살핀 기록이 보존 수첩에 이어져 있다.'):'남쪽 접근로의 해자 관찰은 선택이며 탑 출입 조건이 아니다.';
    g.say('탑 기슭 보존원',[approach,status,'남쪽은 도로 번호 없는 설화시티 접근로, 서쪽은 과거 저장 귀환용 궐수 암반굴이다.','탑의 공개 1~3층은 기단 방향→석재 맞춤→바람을 차례로 살필 수 있다. 전설 사건이나 포획은 시작하지 않는다.'],undefined,[
      {label:'탑 1층 관찰',action:guide('tour_dragonspiral_hall','tourDragonspiralBaseStone')},
      {label:'설화시티 귀환',action:guide('tour_dragonspiral_approach','tourDragonspiralIcirrusStone')},
      {label:'안내를 마친다',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_dragonspiral'&&event==='tourPokemon'){
    const lead=save.party[0],leadName=lead?SPECIES[lead.species]?.name:undefined;
    const wind=save.flags[WIND]?'3층 바람 관찰을 마친 수첩 옆에서 상층과 같은 방향으로 몸을 돌린다.':save.flags[APPROACH_OBSERVED]?'남쪽 해자에서 기록한 갈대 방향과 같은 쪽으로 깃을 눕힌다.':'해자 수면과 탑 위쪽을 번갈아 보며 바람이 바뀌기를 기다린다.';
    g.say('해자 바람을 살피는 콩둘기',[`구구구. ${wind}`,leadName?`${leadName}을 바라보고 마른 돌기단 가장자리로 두 걸음 비켜선다.`:'보존원이 지나갈 중앙 통로를 비켜 마른 돌 가장자리에 앉는다.','보존원과 함께 지내는 생활 포켓몬이며 용나선탑 야생 조우나 포획 대상이 아니다.']);return true;
  }
  if(event==='tourDragonspiralFoundation'||event==='tourDragonspiralSouthGuide'||event==='tourDragonspiralLegacyGuide'){
    const title=event==='tourDragonspiralFoundation'?'탑 기단 관찰판':event==='tourDragonspiralSouthGuide'?'남쪽 접근로 귀환석':'서쪽 레거시 귀환 표지';
    const path=event==='tourDragonspiralFoundation'?'탑 문에서 1층 기단 회랑으로 들어가 오른쪽 위 계단을 따라 3층까지 왕복한다.':event==='tourDragonspiralSouthGuide'?'남쪽은 용나선탑 접근로와 설화시티 북문으로 이어진다.':'서쪽은 과거 저장을 위한 궐수–용나선탑 암반굴이며 공식 동굴명이 아니다.';
    g.say(title,[path,save.flags[APPROACH_OBSERVED]?'남쪽 해자 가장자리 관찰 기록이 탑 보존 수첩에 표시되어 있다.':'남쪽 해자 관찰을 건너뛰어도 탑을 자유롭게 둘러볼 수 있다.',status,save.flags[WIND]?'세 층의 동행 관찰 기록을 마쳤다.':'미완료 단계는 나중에 같은 동료와 이어갈 수 있다.','관찰 기록은 출구·보상·전설 사건을 바꾸지 않는다.']);return true;
  }
  if(event==='tourDragonspiralBaseStone'){
    const healthy=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0);
    if(!healthy.length){g.say('기단 방향석',['함께 회랑을 살필 건강한 동료가 없다.','설화시티 센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다. 탑 출입과 계단은 막히지 않는다.']);return true;}
    g.say('기단 방향석',[save.flags[BASE]?'동료를 다시 선택하면 이후 석재·바람 관찰 기록을 새로 이어간다.':'남쪽 입구, 서쪽 귀환 통로, 위층 계단의 방향을 함께 살필 동료를 고르자.','특정 종이나 설화·8번도로 출신을 요구하지 않는다.'],undefined,[...healthy.map(({mon,slot})=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current('tour_dragonspiral_hall')||save.party[slot]!==mon||mon.hp<=0)return;
      save.flags[SLOT]=slot;save.flags[MON]=mon.species;save.flags[BASE]=true;delete save.flags[STONE];delete save.flags[WIND];g.persist();
      g.say('기단 방향 관찰',[`${SPECIES[mon.species].name}와 남쪽 입구·서쪽 귀환·2층 계단의 방향을 차례로 확인했다.`,'HP·경험치·능력치는 변하지 않는다. 2층 나선 석재 맞춤에서 이어갈 수 있다.']);
    }})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='tourDragonspiralMoatChart'){
    const approachSpecies=SPECIES[Number(save.flags[APPROACH_MON]??0)]?.name;
    const field=save.flags[APPROACH_OBSERVED]?(approachSpecies?`접근로에서 ${approachSpecies}와 살핀 발자국·갈대 방향이 도면의 남쪽 가장자리에 표시됐다.`:'접근로의 발자국·갈대 관찰 기록이 도면의 남쪽 가장자리에 표시됐다.'):'접근로 현장 기록은 아직 없으며 도면만 먼저 살필 수 있다.';
    const same=name&&approachSpecies?name===approachSpecies?`${name}와 접근로부터 같은 기록을 이어가고 있다.`:`접근로에서는 ${approachSpecies}, 탑에서는 ${name}와 서로 다른 관찰을 이어가고 있다.`:undefined;
    g.say('해자와 기단 도면',[field,...(same?[same]:[]),status,save.flags[BASE]?'기단 방향을 확인한 단계까지 수첩에 표시됐다.':'기단 방향 관찰은 아직 시작하지 않았다.','해자는 도면으로만 살피며 수상 이동이나 특별 조우가 일어나지 않는다.']);return true;
  }
  if(event==='tourDragonspiralMasonry'){
    const mon=selected();if(!save.flags[BASE]||!name){g.say('나선 석재 맞춤',['1층 기단 방향석에서 건강한 동료와 관찰을 시작할 수 있다.','관찰 전에도 계단과 회랑은 자유롭게 이용한다.']);return true;}
    if(!mon){g.say('나선 석재 맞춤',[status,'설화시티 센터에서 회복하거나 PC로 같은 동료를 편성한 뒤 이어갈 수 있다.']);return true;}
    const first=!save.flags[STONE];save.flags[STONE]=true;if(first)g.persist();g.say('나선 석재 관찰',[`${name}와 돌의 맞물림·하중 방향·안쪽 회랑의 틈을 차례로 살폈다.`,first?'2층 관찰을 수첩에 기록했다.':'앞서 남긴 석재 기록을 다시 확인했다.','전시를 움직이거나 능력치를 바꾸지 않는다. 3층 바람판에서 이어갈 수 있다.']);return true;
  }
  if(event==='tourDragonspiralPreservation'){
    g.say('보존 작업 기록',[status,save.flags[STONE]?'석재 맞춤 관찰이 보존 기록과 나란히 표시됐다.':'무너진 위치와 보강 순서만 기록되어 있다.','기록에 없는 전설 사건이나 탑의 원인을 새로 단정하지 않는다.']);return true;
  }
  if(event==='tourDragonspiralWindChart'){
    const mon=selected();if(!save.flags[STONE]||!name){g.say('세 방향 바람판',['1층 기단 방향과 2층 석재 맞춤을 살핀 뒤 같은 동료와 바람을 기록할 수 있다.','단계를 마치지 않아도 3층과 아래층을 자유롭게 왕복한다.']);return true;}
    if(!mon){g.say('세 방향 바람판',[status,'설화시티 센터에서 같은 동료를 건강한 상태로 편성한 뒤 이어갈 수 있다.']);return true;}
    const first=!save.flags[WIND];save.flags[WIND]=true;if(first)g.persist();g.say('용나선탑 바람 기록',[`${name}와 남쪽 설화시티, 습지 가장자리, 탑 위쪽에서 내려오는 바람을 구분했다.`,first?'세 층의 동행 관찰을 수첩에 이어 적었다.':'앞서 남긴 바람 기록을 다시 읽었다.','전설 포켓몬을 부르거나 획득하지 않으며 보상·통행 조건도 생기지 않는다.']);return true;
  }
  if(event==='tourDragonspiralRest'){
    g.say('동행 관찰 쉼석',[status,save.flags[WIND]?'기단·석재·바람을 모두 살핀 기록이 있다. 동료와 조용히 쉬었다.':'아직 남은 관찰 단계가 있어도 이 자리에서 쉬고 입구로 돌아갈 수 있다.','휴식은 HP·상태·능력치를 회복하지 않는다. 실제 회복은 설화시티 센터를 이용한다.']);return true;
  }
  return false;
}
