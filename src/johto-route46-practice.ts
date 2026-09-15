import type {Engine} from './engine';
import {SPECIES} from './pokemon';
import {leadPokemon} from './team';
import {showMoveSchool} from './move-school';
import {handleRoadTrainer,trainerWinFlag} from './road-trainers';
import {JOHTO_SOUTH_BATTLE,canRetryJohtoSouthPartnerBattle} from './johto-south-battle';

export const ROUTE46_PRACTICE='johtoRoute46Practice';

/** Local field entry; the existing trainer owns battle, victory and reward rules. */
export function handleRoute46Practice(g:Engine,event:string){
  if(g.save.map!=='tour_johto_route_46'||event!==ROUTE46_PRACTICE)return false;
  const save=g.save,current=()=>g.save===save&&g.save.map==='tour_johto_route_46'&&!g.battle;
  const guide=(map:typeof save.map,id?:string)=>()=>{if(current())g.setTourDestination(map,id);};
  const prepare=(page=0)=>{
    if(!current())return;
    if(!save.party.length){g.say('실전 준비',['함께할 동료를 무궁센터 PC에서 데려오자.'],undefined,[{label:'센터 PC로',action:guide('tour_cherrygrove_center','tourExhibit1')},{label:'나중에 준비',action:()=>{}}]);return;}
    g.say('먼저 나갈 동료',['함께할 동료를 고르면 선두로 세우거나 기술을 편성할 수 있어.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} ${mon.hp}/${mon.maxHp}`,action:()=>{
        if(!current()||!save.party.includes(mon))return;
        if(mon.hp<=0){g.say('먼저 회복하자',['쓰러진 동료는 무궁센터에서 회복한 뒤 함께하자.'],undefined,[{label:'센터로 돌아가기',action:guide('tour_cherrygrove_center','tourHost')},{label:'다른 동료 고르기',action:()=>prepare(page)}]);return;}
        const valid=()=>current()&&save.party.includes(mon)&&mon.hp>0;
        g.say(SPECIES[mon.species].name,[`${mon.met}에서 만난 동료야. 현재 레벨 ${mon.level}, HP ${mon.hp}/${mon.maxHp}.`],undefined,[
          {label:'선두로 세우기',action:()=>{if(!valid())return;const message=leadPokemon(save,save.party.indexOf(mon));g.persist();g.say('실전 준비',[message],undefined,[{label:'배틀 상담으로',action:()=>{if(current())handleRoute46Practice(g,ROUTE46_PRACTICE);}},{label:'준비 마치기',action:()=>{}}]);}},
          {label:'기술 편성하기',action:()=>{if(!valid())return;g.partyIndex=save.party.indexOf(mon);showMoveSchool(g,0,undefined,false,{label:'실전 준비로 돌아가기',action:()=>{if(valid())prepare(page);}});}},
          {label:'다른 동료 고르기',action:()=>prepare(page)},
        ]);
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>prepare(page?0:1)}]:[]),
      {label:'나중에 준비',action:()=>{}},
    ]);
  };
  const won=Boolean(save.flags[trainerWinFlag('johto-route-46-practice')]);
  const retry=canRetryJohtoSouthPartnerBattle(save,'johto-route-46-practice');
  const hurt=save.party.filter(mon=>mon.hp<mon.maxHp).length;
  const lead=save.party[0];
  const f=JOHTO_SOUTH_BATTLE,recordedSpecies=Number(save.flags[f.partner]??0),recordedName=SPECIES[recordedSpecies]?.name,recordedSlot=save.flags[f.slot],recorded=typeof recordedSlot==='number'&&save.party[recordedSlot]?.species===recordedSpecies?save.party[recordedSlot]:undefined;
  const result=save.flags[f.participated]===true&&recordedName?(recorded?`${recordedName}가 실제로 상대를 쓰러뜨린 기록 · Lv.${Number(save.flags[f.level]??recorded.level)}→${recorded.level} · HP ${recorded.hp}/${recorded.maxHp}`:`${recordedName}가 실제로 상대를 쓰러뜨린 기록 · 현재 PC 또는 다른 편성`):won?'승리 기록은 있지만 현지 동료의 실제 격파 증거는 없다. 현지 동료를 선두로 세우면 상금 없는 재확인전을 할 수 있다.':'현지 동료의 실제 격파 기록은 아직 없다.';
  g.say('46번도로 산기슭 트레이너',[
    won?'이 공터에서 겨룬 승리 기록이 남아 있어. 다음 여행 전에 동료 상태를 살펴보자.':'꼬렛·깨비참·꼬마돌과 겨루기 전에 먼저 나갈 동료와 기술을 준비해 봐.',
    lead?`현재 선두는 ${SPECIES[lead.species].name}, HP ${lead.hp}/${lead.maxHp}.`:'현재 파티에 동료가 없어.',
    hurt?`회복이 필요한 동료가 ${hurt}마리야. 남쪽29번도로에서 서쪽 무궁센터로 돌아갈 수 있어.`:'현재 동료 상태를 살피고 준비되면 다음 길을 골라 봐.',
    result,
  ],undefined,[
    {label:'동료·기술 준비',action:()=>prepare()},
    won&&retry?{label:'현지 동료 재확인전',action:()=>{if(current())handleRoadTrainer(g,'tourRoute46Trainer');}}:won?{label:'45번도로로 출발',action:guide('tour_johto_route_45')}:{label:'기존 선택 배틀에 도전',action:()=>{if(current())handleRoadTrainer(g,'tourRoute46Trainer');}},
    {label:'무궁센터로 귀환',action:guide('tour_cherrygrove_center','tourHost')},
    {label:'계속 걷기',action:()=>{}},
  ]);
  return true;
}
