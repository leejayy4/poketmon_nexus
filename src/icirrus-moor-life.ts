import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const MAP='tour_icirrus_moor';
const SLOT='icirrusMoorPartnerSlot',MON='icirrusMoorPartnerSpecies';
const REEDS='icirrusMoorReedsObserved',BIRDS='icirrusMoorBirdsObserved',DONE='icirrusMoorObservationCompleted';

/** A voluntary companion walk through the two dry boardwalk loops. */
export function handleIcirrusMoorLife(g:Engine,event:string):boolean{
  if(g.save.map!==MAP)return false;
  const save=g.save,current=()=>g.save===save&&save.map===MAP&&!g.battle;
  const selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[MON]&&mon.hp>0?mon:undefined;};
  const name=SPECIES[Number(save.flags[MON]??0)]?.name;
  const guide=(target:string)=>()=>{if(current())g.setTourDestination(MAP,target);};
  if(event==='tourIcirrusMoorWestStump'||event==='tourIcirrusMoorEastStump'){
    const west=event==='tourIcirrusMoorWestStump';
    g.say(west?'이끼 낀 그루터기':'갈라진 그루터기',[
      west?'낮은 나무 밑동에 이끼가 붙어 있다. 바로 옆 풀숲이 바스락거린다.':'갈라진 나무 밑동 너머로 동쪽 데크가 북쪽 물가까지 이어진다.',
      west?'쪼마리와 딱정곤을 찾아 풀숲으로 들어가거나, 동쪽 마른 길로 돌아갈 수 있다.':'물새 흔적을 살피려면 동쪽 길을 따라 북쪽 관찰 데크로 가자.',
    ],undefined,[{label:west?'갈대 말뚝으로 돌아간다':'물새 데크로 간다',action:guide(west?'tourIcirrusMoorReeds':'tourIcirrusMoorBirds')},{label:'남쪽 귀환 데크로',action:guide('tourIcirrusMoorRoute8')},{label:'주변을 더 걷는다',action:()=>{}}]);return true;
  }
  const next=save.flags[DONE]?{label:'8번도로 귀환 데크',target:'tourIcirrusMoorRoute8'}:save.flags[BIRDS]?{label:'북쪽에서 기록 맞추기',target:'tourIcirrusMoorNorth'}:save.flags[REEDS]?{label:'동쪽 물새 흔적 이어보기',target:'tourIcirrusMoorBirds'}:{label:'서쪽 갈대 관찰 시작',target:'tourIcirrusMoorReeds'};
  const status=save.flags[DONE]&&name?`${name}와 갈대 수위와 물새 흔적을 모두 살핀 기록이 있다.`:name?`${name}와 습지 관찰을 이어가는 중이다.`:'건강한 파티 동료 한 마리와 관찰을 시작할 수 있다.';

  if(event==='tourGuide'){
    const healthy=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0);
    const choices=healthy.map(({mon,slot})=>({label:`${SPECIES[mon.species].name}와 걷기`,action:()=>{
      if(!current()||save.party[slot]!==mon||mon.hp<=0)return;
      if(!save.flags[DONE]&&save.flags[SLOT]===slot&&save.flags[MON]===mon.species){
        g.say('습지 관찰원',[status,'함께 걷던 동료와 남긴 기록을 그대로 이어가자.'],undefined,[{label:next.label,action:guide(next.target)},{label:'그대로 걷기',action:()=>{}}]);return;
      }
      const begin=()=>{
        if(!current()||save.party[slot]!==mon||mon.hp<=0)return;
        save.flags[SLOT]=slot;save.flags[MON]=mon.species;delete save.flags[REEDS];delete save.flags[BIRDS];delete save.flags[DONE];g.persist();
        g.say('습지 관찰원',[`${SPECIES[mon.species].name}와 서쪽 갈대 수위 말뚝부터 살펴보자.`,'서쪽과 동쪽 순환로는 모두 마른 데크이며 중앙길로 돌아온다.','관찰은 HP·경험치·통행 조건을 바꾸지 않는다.'],undefined,[{label:'갈대 관찰로',action:guide('tourIcirrusMoorReeds')},{label:'먼저 둘러보기',action:()=>{}}]);
      };
      if(save.flags[DONE]){
        g.say('새 관찰 시작',[`${SPECIES[mon.species].name}와 다시 관찰하면 기존 완료 기록을 새 관찰 기록으로 바꾼다.`,'갈대 수위와 물새 흔적을 처음부터 다시 살펴볼까?'],undefined,[{label:'새 관찰 시작',action:begin},{label:'완료 기록 유지',action:()=>{}}]);
      }else begin();
    }}));
    g.say('습지 관찰원',[status, !save.flags[DONE]&&name&&!selected()?'기록은 남아 있다. 함께 걷는 동료가 쓰러졌다면 센터에서 회복하자. PC에 맡겼다면 동료를 다시 골라 새 관찰을 시작하자.':'서쪽 갈대 수위 말뚝과 동쪽 물새 데크를 살핀 뒤 북쪽 전망대에서 기록을 맞춘다.','다른 동료를 고르면 새 관찰을 시작한다.','서쪽 순환로 아래 풀숲에는 쪼마리와 딱정곤이 산다. 풀숲 동쪽 마른 길로 피해 갈 수도 있다.','관찰하거나 포획하지 않아도 남쪽 8번도로로 언제든 돌아갈 수 있다.'],undefined,[...choices,{label:next.label,action:guide(next.target)},{label:'그대로 걷기',action:()=>{}}]);return true;
  }
  if(save.flags[DONE]&&(event==='tourIcirrusMoorReeds'||event==='tourIcirrusMoorBirds')){
    g.say('습지 관찰 기록',[status,event==='tourIcirrusMoorReeds'?'수위 말뚝 옆 갈대 높이를 기록했던 자리다.':'난간 뒤에서 물새가 날아간 방향을 기록했던 자리다.'],undefined,[
      {label:'완성된 기록 보기',action:guide('tourIcirrusMoorNorth')},
      {label:'관찰원에게 돌아가기',action:guide('icirrusMoorKeeper')},
      {label:'그대로 걷기',action:()=>{}},
    ]);return true;
  }
  if(event==='tourIcirrusMoorReeds'){
    const mon=selected();if(!mon){g.say('갈대 수위 말뚝',['관찰원에게서 건강한 동료를 고르면 갈대 높이와 발자국을 함께 비교할 수 있다.','동료를 고르지 않아도 서쪽 순환로와 중앙 데크는 자유롭게 걷는다.']);return true;}
    const record=()=>{
      if(!current()||selected()!==mon)return;
      const first=!save.flags[REEDS];save.flags[REEDS]=true;if(first)g.persist();
      g.say('갈대 수위 관찰',[`${SPECIES[mon.species].name}와 아래쪽 젖은 눈금을 수첩에 옮겼다.`,first?'마른 갈대 끝과 현재 물높이를 구분해 서쪽 관찰을 기록했다.':'앞서 남긴 갈대 기록을 다시 확인했다.','다음은 동쪽 물새 관찰 데크다.'],undefined,[{label:'동쪽 물새 데크로',action:guide('tourIcirrusMoorBirds')},{label:'기록을 덮는다',action:()=>{}}]);
    };
    if(save.flags[REEDS]){record();return true;}
    const examine=()=>{
      if(!current()||selected()!==mon)return;
      let answered=false;
      const answer=(correct:boolean)=>()=>{
        if(answered||!current()||selected()!==mon)return;answered=true;
        if(correct){record();return;}
        g.say('갈대 수위 말뚝',[`${SPECIES[mon.species].name}와 말뚝 아래를 다시 살폈다.`,'갈대 끝은 바람에 흔들리지만 아래쪽의 푸른 물선은 같은 높이로 이어져 있다.'],undefined,[{label:'눈금을 다시 비교한다',action:examine},{label:'나중에 살핀다',action:()=>{}}]);
      };
      g.say('갈대 수위 말뚝',[`${SPECIES[mon.species].name}와 눈금 옆에 나란히 섰다.`,'위쪽 갈대 끝은 마르고 아래쪽 눈금에는 푸른 물자국이 이어진다.','현재 물높이로 어느 쪽을 기록할까?'],undefined,[{label:'아래쪽 젖은 눈금',action:answer(true)},{label:'위쪽 갈대 끝',action:answer(false)},{label:'관찰을 미룬다',action:()=>{}}]);
    };
    examine();return true;
  }
  if(event==='tourIcirrusMoorBirds'){
    const mon=selected();if(!save.flags[REEDS]||!mon){g.say('물새 관찰 데크',[status,'서쪽 갈대 수위 말뚝을 먼저 살피면 흔적이 이어지는 방향을 비교할 수 있다.','순서와 관계없이 길은 막히지 않는다.']);return true;}
    const record=()=>{
      if(!current()||selected()!==mon||!save.flags[REEDS])return;
      const first=!save.flags[BIRDS];save.flags[BIRDS]=true;if(first)g.persist();
      g.say('물새 흔적 관찰',[`${SPECIES[mon.species].name}와 난간 뒤에서 움직임을 멈췄다.`,'물가에 잔물결이 번지고, 갈대 너머 작은 날갯짓들이 북쪽으로 이어졌다.',first?'깃털 흔적과 날아간 방향을 수첩에 함께 기록했다.':'앞서 기록한 북쪽 방향과 날갯짓을 다시 확인했다.'],undefined,[{label:'북쪽 전망대로',action:guide('tourIcirrusMoorNorth')},{label:'조금 더 바라본다',action:()=>{}}]);
    };
    if(save.flags[BIRDS]){record();return true;}
    const watch=()=>{
      if(!current()||selected()!==mon)return;
      let chosen=false;
      g.say('물새 관찰 데크',['젖은 깃털이 갈대 쪽으로 이어지지만 지금은 날갯짓이 보이지 않는다.',`${SPECIES[mon.species].name}와 어떻게 살펴볼까?`],undefined,[
        {label:'난간 뒤에서 함께 기다린다',action:()=>{if(chosen||!current()||selected()!==mon)return;chosen=true;record();}},
        {label:'발자국부터 살핀다',action:()=>{
          if(chosen||!current()||selected()!==mon)return;chosen=true;
          g.say('데크의 흔적',['발자국은 물가에서 끊겨 있다. 이것만으로 날아간 방향을 알기는 어렵다.','난간 뒤에 머물며 갈대 위의 움직임을 기다려 보자.'],undefined,[{label:'관찰 위치로 돌아간다',action:watch},{label:'나중에 살핀다',action:()=>{}}]);
        }},
        {label:'관찰을 미룬다',action:()=>{}},
      ]);
    };
    watch();return true;
  }
  if(event==='tourIcirrusMoorNorth'){
    if(save.flags[DONE]){
      g.say('설화의 습지 관찰 기록',[name?`${name}와 갈대 수위와 물새 흔적을 비교한 기록이 남아 있다.`:'갈대 수위와 물새 흔적을 비교한 기록이 남아 있다.','기록한 동료가 지금 파티에 없어도 완성된 수첩을 다시 읽을 수 있다.','남쪽 중앙 데크로 돌아가 8번도로 여행을 이어가자.'],undefined,[
        {label:'귀환 데크로',action:guide('tourIcirrusMoorRoute8')},
        {label:'기록을 덮는다',action:()=>{}},
      ]);return true;
    }
    const mon=selected();if(!save.flags[REEDS]||!save.flags[BIRDS]||!mon){g.say('북쪽 습지 전망대',[status,'갈대 수위와 물새 흔적을 모두 살핀 뒤 같은 건강한 동료와 기록을 맞출 수 있다.','추가 출구나 보상은 없으며 남쪽 중앙 데크로 돌아간다.']);return true;}
    const first=!save.flags[DONE];save.flags[DONE]=true;if(first)g.persist();g.say('설화의 습지 관찰 기록',[`${SPECIES[mon.species].name}와 서쪽 갈대밭에서 동쪽 물가로 이어지는 생활 흔적을 한눈에 맞췄다.`,first?'습지 순환 관찰을 마쳤다.':'완성된 습지 기록을 다시 펼쳐 보았다.','8번도로로 돌아가는 남쪽 중앙 데크를 수첩에 짚었다.'],undefined,[{label:'귀환 데크로',action:guide('tourIcirrusMoorRoute8')},{label:'기록을 덮는다',action:()=>{}}]);return true;
  }
  if(event==='tourIcirrusMoorRoute8'){g.say('8번도로 귀환 데크',[status,'남쪽 출구는 하나 8번도로 북쪽 분기로 이어진다.','8번도로 서쪽은 설화시티, 동쪽은 튜브라인브리지와 9번도로·쌍용시티 방향이다.'],undefined,[{label:'설화 포켓몬센터로',action:()=>{if(current())g.setTourDestination('tour_icirrus_center');}},{label:'8번도로 실전 준비로',action:()=>{if(current())g.setTourDestination('tour_unova_route_08','tourRouteEightTrainer');}},{label:'8번도로로 돌아가기',action:()=>{if(current())g.setTourDestination('tour_unova_route_08');}},{label:'기록 지점 다시 보기',action:guide(save.flags[DONE]?'tourIcirrusMoorNorth':next.target)},{label:'그대로 걷기',action:()=>{}}]);return true;}
  return false;
}
