import type {Engine} from './engine';
import {SPECIES} from './pokemon';
import {JOHTO_SOUTH_BATTLE} from './johto-south-battle';

const SLOT='cherrygroveCareSlot',SPECIES_ID='cherrygroveCareSpecies',WIND='cherrygroveCareWind',DONE='cherrygroveCareDone';
const SOUTH_ORIGINS=new Set(['성도 29번도로','성도 45번도로','성도 46번도로','성도 29번도로 · 동쪽 합류부','성도 29번도로 · 무궁-46 합류 구간']);
export function handleCherrygroveCare(g:Engine,event:string):boolean{
  const start=g.save.map==='tour_cherrygrove_home1'&&(event==='cherrygroveHomeFlowers'||event==='tourHost');
  const coast=g.save.map==='tour_cherrygrove'&&event==='tourCherrygroveCoast';
  const bed=g.save.map==='tour_cherrygrove'&&event==='tourCherrygroveWindbreak';
  if(!start&&!coast&&!bed)return false;
  const save=g.save,map=save.map,active=()=>g.save===save&&g.save.map===map&&!g.battle;
  const guide=(target:typeof save.map,id:string)=>()=>{if(active())g.setTourDestination(target,id);};
  const selected=()=>{const slot=save.flags[SLOT];const mon=typeof slot==='number'?save.party[slot]:undefined;return mon?.species===save.flags[SPECIES_ID]?mon:undefined;};
  const name=()=>{const mon=selected();return mon?SPECIES[mon.species].name:'동료';};
  const southBattlePartner=()=>{
    const f=JOHTO_SOUTH_BATTLE,slot=save.flags[f.slot];
    if(save.flags[f.participated]!==true||typeof slot!=='number')return undefined;
    const mon=save.party[slot];
    return mon?.species===save.flags[f.partner]?mon:undefined;
  };
  const journeyLine=(mon:NonNullable<ReturnType<typeof selected>>)=>{
    const actual=southBattlePartner()===mon;
    if(actual){
      const startLevel=Number(save.flags[JOHTO_SOUTH_BATTLE.level]??mon.level);
      return `${SPECIES[mon.species].name}는 남쪽 산길 실전에서 직접 싸운 동료예요. Lv.${startLevel}에서 지금 Lv.${mon.level}까지 이어진 여정을 꽃길 돌봄에도 남기고 있군요.`;
    }
    return SOUTH_ORIGINS.has(mon.met)
      ?`${mon.met.replace('성도 ','')}에서 내려온 동료와 꽃길도 함께 돌보고 있군요.`
      :'함께 고른 동료와 하던 일을 이어가 주세요.';
  };
  const choose=(page=0)=>g.say('꽃길 바람막이 준비',['동료와 서쪽 해안의 바람을 확인한 뒤 공동 화단에 바람막이를 세워 주세요.'],undefined,[
    ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
      if(!active()||!save.party.includes(mon))return;
      if(mon.hp<=0){g.say('꽃길 주민',['이 동료는 먼저 센터에서 회복해야 해요.']);return;}
      save.flags[SLOT]=save.party.indexOf(mon);save.flags[SPECIES_ID]=mon.species;save.flags[WIND]=false;save.flags[DONE]=false;g.persist();
      g.setTourDestination('tour_cherrygrove','tourCherrygroveCoast');
      g.say('꽃길 주민',[`${SPECIES[mon.species].name}와 준비했어요. 서쪽 해안 관찰대에서 바람을 확인해 주세요.`,journeyLine(mon)]);
    }})),
    ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>{if(active())choose(page?0:1);}}]:[]),
    {label:'나중에 하기',action:()=>{}},
  ]);
  if(start){
    if(save.flags[DONE]){
      const hurt=save.party.some(mon=>mon.hp<mon.maxHp);
      g.say('꽃길 주민',['공동 화단의 바람막이 설치 기록이 남아 있어요. 도와줘서 고마워요.',
        !save.party.length?'센터 PC에서 함께할 동료를 데려온 뒤 여행을 준비하세요.':hurt?'동료가 지쳐 있네요. 먼저 무궁센터에서 회복하고 기술을 준비하세요.':'동료와 다음 여행을 준비해 보세요. 동쪽29번도로를 따라 북쪽46번도로로 갈 수 있어요.',
      ],undefined,[
        {label:!save.party.length?'센터 PC로':hurt?'센터에서 회복':'센터에서 기술 준비',action:guide('tour_cherrygrove_center',!save.party.length?'tourExhibit1':hurt?'tourHost':'cherrygroveCenterChart')},
        {label:'46번도로 실전 준비로',action:guide('tour_johto_route_46','johtoRoute46Practice')},
        {label:'화단 다시 살펴보기',action:guide('tour_cherrygrove','tourCherrygroveWindbreak')},
        {label:'인사하고 나가기',action:()=>{}},
      ]);return true;
    }
    if(!save.party.length){g.say('꽃길 주민',['함께 일할 동료를 센터 PC에서 데려와 주세요.']);return true;}
    const partner=selected();
    if(!partner){choose();return true;}
    const observed=Boolean(save.flags[WIND]);
    const destination=()=>{
      if(!active()||selected()!==partner)return;
      if(partner.hp<=0){g.setTourDestination('tour_cherrygrove_center','tourHost');return;}
      g.setTourDestination('tour_cherrygrove',save.flags[WIND]?'tourCherrygroveWindbreak':'tourCherrygroveCoast');
    };
    g.say('꽃길 주민',[
      `${SPECIES[partner.species].name}와 준비한 기록이 남아 있어요.`,
      journeyLine(partner),
      partner.hp<=0?'먼저 센터에서 회복해 주세요. 확인한 바람 방향은 그대로 기억해 둘게요.':observed?'서쪽 바람을 확인했으니 이제 공동 화단에 바람막이를 세우면 돼요.':'서쪽 해안 관찰대에서 바람 방향을 확인하면 돼요.',
    ],undefined,[
      {label:partner.hp<=0?'센터에서 회복':observed?'화단에서 이어하기':'해안에서 이어하기',action:destination},
      {label:'동료 다시 고르기',action:()=>{
        if(!active()||selected()!==partner)return;
        g.say('동료 다시 준비',['동료를 선택하면 바람 확인부터 다시 시작해요. 취소하면 지금 기록을 유지해요.'],undefined,[
          {label:'선택 화면 열기',action:()=>{if(active())choose();}},
          {label:'기록 유지하기',action:()=>{}},
        ]);
      }},
      {label:'나중에 이어하기',action:()=>{}},
    ]);return true;
  }
  if(save.flags[DONE]){g.say(coast?'서쪽 해안':'공동 화단',[coast?'바다에서 도시 쪽으로 바람이 분다. 동료와 확인한 이 바람을 막도록 공동 화단 서쪽에 바람막이를 세웠다.':'서쪽 바람을 막도록 설치한 바람막이를 다시 살펴봤다. 꽃길 돌봄 기록이 남아 있다.'],undefined,[
    {label:'꽃길 주민에게 돌아가기',action:guide('tour_cherrygrove_home1','cherrygroveHomeFlowers')},
    {label:'산책 계속하기',action:()=>{}},
  ]);return true;}
  const mon=selected();
  if(!mon||mon.hp<=0){g.say('꽃길 돌봄',[mon?'동료가 지쳐 있다. 센터에서 회복한 뒤 이어 하자.':'꽃길 주민집의 화분에서 함께할 동료를 골라 주세요. 파티 편성이 바뀌었다면 다시 준비해 주세요.'],undefined,[
    {label:mon?'센터에서 회복하기':'주민집에서 동료 고르기',action:mon?guide('tour_cherrygrove_center','tourHost'):guide('tour_cherrygrove_home1','cherrygroveHomeFlowers')},
    {label:'나중에 이어하기',action:()=>{}},
  ]);return true;}
  const ready=()=>active()&&selected()===mon&&mon.hp>0;
  if(coast){g.say('서쪽 해안',[`${name()}와 꽃잎이 바다 쪽에서 도시 쪽으로 날리는 모습을 보았다.`],undefined,[{label:'바람 방향 기억하기',action:()=>{if(!ready())return;save.flags[WIND]=true;g.persist();g.setTourDestination('tour_cherrygrove','tourCherrygroveWindbreak');g.say('바람 확인',['서쪽에서 부는 바람이다. 공동 화단 서쪽에 바람막이를 세우자.']);}},{label:'돌아가기',action:()=>{}}]);return true;}
  if(!save.flags[WIND]){g.say('공동 화단',['먼저 서쪽 해안 관찰대에서 동료와 바람 방향을 확인하자.'],undefined,[
    {label:'해안 관찰대로',action:guide('tour_cherrygrove','tourCherrygroveCoast')},
    {label:'나중에 이어하기',action:()=>{}},
  ]);return true;}
  g.say('바람막이 설치',[`${name()}가 받침을 지키는 동안 어느 쪽에 바람막이를 세울까?`],undefined,[
    {label:'서쪽에 세운다',action:()=>{if(!ready())return;save.flags[DONE]=true;g.persist();g.say('꽃길 돌봄 완료',[`${name()}와 받침을 맞추고 서쪽에 바람막이를 고정했다.`,'주민집으로 돌아가 설치 기록을 확인할 수 있다.'],undefined,[{label:'꽃길 주민에게 돌아가기',action:guide('tour_cherrygrove_home1','cherrygroveHomeFlowers')},{label:'꽃길 더 걷기',action:()=>{}}]);}},
    {label:'동쪽에 세운다',action:()=>{if(ready())g.say('바람막이 방향',['바닷바람이 꽃밭에 먼저 닿는다. 해안에서 확인한 방향을 떠올리고 다시 놓자.']);}},
    {label:'그만두기',action:()=>{}},
  ]);return true;
}
