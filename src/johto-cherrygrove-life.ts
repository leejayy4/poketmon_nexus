import type {Engine} from './engine';
import {SPECIES} from './pokemon';
import {showMoveSchool} from './move-school';
import {ROUTE46_PRACTICE} from './johto-route46-practice';
import {handleCherrygroveCare} from './johto-cherrygrove-care';
import {JOHTO_SOUTH_BATTLE} from './johto-south-battle';

/** Read current ownership only; never turn an encounter history into a reward or travel lock. */
export function handleCherrygroveLife(g:Engine,event:string):boolean{
  if(handleCherrygroveCare(g,event))return true;
  const map=g.save.map;
  if(map==='tour_cherrygrove'&&event==='cherrygroveCoastalResident'){
    const save=g.save;
    const guide=(target:typeof save.map,id:string)=>()=>{if(g.save===save&&g.save.map===map&&!g.battle)g.setTourDestination(target,id);};
    g.say('해안 산책 주민',[
      '우리 집 앞 공동 화단은 포켓몬과 함께 돌봐요. 서쪽 바닷바람이 꽃에 바로 닿지 않도록 살피고 있죠.',
      save.flags.cherrygroveCareDone?'세워 준 바람막이가 화단 서쪽에 남아 있어요. 꽃길 주민에게도 들러 주세요.':'꽃길 주민집에서 함께할 동료를 고른 뒤 서쪽 해안 관찰대와 공동 화단을 차례로 살펴보세요.',
    ],undefined,[
      {label:'꽃길 주민집으로',action:guide('tour_cherrygrove_home1','cherrygroveHomeFlowers')},
      {label:'해안 관찰대로',action:guide('tour_cherrygrove','tourCherrygroveCoast')},
      {label:'공동 화단으로',action:guide('tour_cherrygrove','tourCherrygroveWindbreak')},
      {label:'산책 계속하기',action:()=>{}},
    ]);return true;
  }
  const resident=map==='tour_cherrygrove'&&event==='journeyWalker';
  const center=map==='tour_cherrygrove_center'&&['cherrygroveCenterChart','cherrygroveCenterBench'].includes(event);
  const home=map==='tour_cherrygrove_home1'&&['tourHost','cherrygroveHomeFlowers','cherrygroveHomeRest'].includes(event)
    ||map==='tour_cherrygrove_home2'&&['tourHost','cherrygroveHomeWindLog','cherrygroveHomeRouteBook'].includes(event);
  if(!resident&&!center&&!home)return false;
  const save=g.save;
  const origins=new Set(['성도 45번도로','성도 46번도로','성도 29번도로','성도 29번도로 · 동쪽 합류부','성도 29번도로 · 무궁-46 합류 구간','성도 30번도로']);
  const describe=(mon:typeof save.party[number],boxed:boolean)=>{
    const name=SPECIES[mon.species]?.name??mon.species;
    return `${mon.met}에서 만난 ${name}: ${boxed?'PC에서 쉬고 있어요. 함께 가려면 센터 PC에서 데려오세요.':mon.hp<=0?'기절해 있어요. 먼저 간호사에게 회복을 부탁하세요.':mon.hp<mon.maxHp?`함께 걷고 있지만 HP가 ${mon.hp}/${mon.maxHp}예요. 산길에 오르기 전에 회복해 주세요.`:'건강하게 함께 걷고 있네요.'}`;
  };
  const companions=[...save.party.filter(mon=>origins.has(mon.met)).map(mon=>describe(mon,false)),...(save.box??[]).filter(mon=>origins.has(mon.met)).map(mon=>describe(mon,true))];
  const injured=save.party.filter(mon=>mon.hp<mon.maxHp).length;
  const preparation=!save.party.length?'동행할 포켓몬이 없네요. 센터 PC에서 파티를 준비하세요.':injured?`파티에서 ${injured}마리가 회복이 필요해요. 센터 간호사에게 들렀다 가세요.`:'파티가 모두 건강하네요. 산길에서는 동료의 HP와 기술을 살펴 주세요.';
  const f=JOHTO_SOUTH_BATTLE,recordedSpecies=Number(save.flags[f.partner]??0),recordedName=SPECIES[recordedSpecies]?.name,recordedSlot=save.flags[f.slot],recorded=typeof recordedSlot==='number'&&save.party[recordedSlot]?.species===recordedSpecies?save.party[recordedSlot]:undefined;
  const battleResult=save.flags[f.participated]===true&&recordedName?(recorded?`${recordedName}가 남쪽 산길에서 실제로 상대를 쓰러뜨린 기록이 있어요. Lv.${Number(save.flags[f.level]??recorded.level)}→${recorded.level}, HP ${recorded.hp}/${recorded.maxHp}.`:`${recordedName}의 남쪽 산길 실제 격파 기록이 남아 있어요. 지금은 PC 또는 다른 편성이에요.`):'29·45·46번도로 현지 동료의 실제 격파 기록은 아직 없어요.';
  const flavor=center?'긴 산길에서 내려왔다면 먼저 동료가 쉴 자리를 마련해 주세요.':map.endsWith('home1')?'꽃을 돌볼 때는 동료가 밟지 않도록 길 쪽에 자리를 비워 둬요.':map.endsWith('home2')?'46번도로에서 내려온 날에는 동료 발에 묻은 흙을 털고 바닷바람을 쐬어요.':'꽃길을 따라 쉬었다가 동쪽29번도로로 나가면 북쪽46번도로 산길에 닿아요.';
  const guide=(target:typeof save.map,id?:string)=>()=>{if(g.save===save&&g.save.map===map&&!g.battle)g.setTourDestination(target,id);};
  const current=()=>g.save===save&&g.save.map===map&&!g.battle;
  const prepare=(page=0)=>{
    if(!current())return;
    g.say('산길 기술 준비',[save.party.length?'동료의 기술을 비교하고 46번도로 실전을 준비하세요.':'센터 PC에서 함께할 동료를 데려오세요.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{
        if(!current())return;
        const index=save.party.indexOf(mon);if(index<0)return;
        g.partyIndex=index;
        showMoveSchool(g,0,undefined,false,{label:'센터 준비로 돌아가기',action:()=>{if(current())prepare(page);}});
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>prepare(page?0:1)}]:[]),
      {label:'여행 안내로',action:()=>{if(current())handleCherrygroveLife(g,event);}},
    ]);
  };
  g.say(center?'무궁센터 여행 준비':home?'무궁시티 주민':'무궁시티 길 안내',[flavor,...(companions.length?companions:['현재 보유한 동료 중 이 길의 출신 기록은 없네요. 29·30·46번도로의 선택 풀밭에서 현지 포켓몬을 만날 수 있어요.']),battleResult,preparation,'29번도로 북서쪽 풀언덕에는 구구·꼬렛, 북쪽30번도로 연못 곁풀에는 구구와 애벌레포켓몬이 살아요. 표시된 본선은 안전해요.','포획 여부와 관계없이 북쪽30번도로와 동쪽29→46번도로를 왕복할 수 있어요. 30번 북쪽31번도로와29번 동쪽 연두마을은 아직 경계예요.'],undefined,center?[
    {label:'간호사에게 회복',action:guide('tour_cherrygrove_center','tourHost')},
    {label:'PC에서 편성',action:guide('tour_cherrygrove_center','tourExhibit1')},
    {label:'동료 기술 준비',action:()=>prepare()},
    {label:'46번도로 실전 준비로',action:guide('tour_johto_route_46',ROUTE46_PRACTICE)},
    {label:'안내 마치기',action:()=>{}},
  ]:undefined);
  return true;
}
