import type { Engine } from './engine';
import { startCinnabarEvacuationMotion,cinnabarEvacuationMoving } from './cinnabar-evacuation-motion';
import { CINNABAR_CONTROL_SEPARATED,CINNABAR_PROTECTION_READY,CINNABAR_EVACUATION_READY } from './cinnabar-rescue-work';
import { CINNABAR_EVAC_MAP,CINNABAR_EVACUEES,CINNABAR_MEWTWO_ASSISTED,CINNABAR_SHORE_EVENT,CINNABAR_SHORE_HANDOFF,evacuationStage,cinnabarAllHandedOver } from './cinnabar-evacuation-state';

const sessions=new WeakMap<Engine,object>();
export function handleCinnabarEvacuation(g:Engine,event:string):boolean{
  if(cinnabarEvacuationMoving(g))return true;
  const save=g.save,mon=CINNABAR_EVACUEES.find(m=>m.event===event);
  if(!mon&&event!==CINNABAR_SHORE_EVENT&&event!=='tourCinnabarMewtwoWitness'){sessions.delete(g);return false;}
  if(save.map!==CINNABAR_EVAC_MAP&&save.map!=='tour_cinnabar'){sessions.delete(g);return false;}
  const token={},map=save.map,player=save.player;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&!g.battle&&sessions.get(g)===token;
  const ready=()=>Boolean(save.flags.nexusSilphRecordsSecured&&save.flags[CINNABAR_PROTECTION_READY]&&save.flags[CINNABAR_EVACUATION_READY]&&save.flags[CINNABAR_CONTROL_SEPARATED]);
  const close=()=>{if(sessions.get(g)===token)sessions.delete(g);};
  const next=()=>{
    if(!active())return;
    const pending=CINNABAR_EVACUEES.find(m=>evacuationStage(save.flags,m.flag)<4);
    if(pending)g.setTourDestination(evacuationStage(save.flags,pending.flag)<3?CINNABAR_EVAC_MAP:'tour_cinnabar',pending.event);
    else g.setTourDestination('tour_cinnabar',CINNABAR_SHORE_EVENT);
  };
  const witness=()=>{
    if(!active()||!ready()||map!==CINNABAR_EVAC_MAP||save.flags[CINNABAR_MEWTWO_ASSISTED]||!CINNABAR_EVACUEES.some(m=>evacuationStage(save.flags,m.flag)===2))return;
    g.say('남쪽 로비의 짧은 빛',[
      '멀리서 들어온 간섭 신호에 로비 표시등이 떨린다. 뮤츠가 문가에서 포켓몬들을 바라본다.',
      '누가 부탁하기도 전에 뮤츠가 손을 들었다. 간섭이 잠깐 끊기고 보호 장치의 불빛이 다시 안정된다.',
      '뮤츠는 포켓몬들이 숨을 고르는 것을 보고 조용히 떠났다. 유진이 열린 남문을 가리킨다. 지금이야. 서두르되 한 마리씩!',
    ],()=>{if(!active()||!ready()||save.flags[CINNABAR_MEWTWO_ASSISTED])return;save.flags[CINNABAR_MEWTWO_ASSISTED]=true;g.persist();next();});
  };
  if(!ready()){
    g.say(mon?.name??'구조 현장',['아직 포켓몬을 옮길 수 없다. 보호 전원과 대피로를 확인하고 제어 신호를 분리해야 한다.']);return true;
  }
  if(event==='tourCinnabarMewtwoWitness'){witness();return true;}
  if(event===CINNABAR_SHORE_EVENT){
    if(map!=='tour_cinnabar')return false;
    if(save.flags[CINNABAR_SHORE_HANDOFF]){g.say('유진',['피카츄와 알통몬이 해안에서 쉬고 있어. 책임자를 놓쳤지만 이 친구들은 데리고 나왔네.','실프 원본은 그대로 남겼고 보호 전원도 끊지 않았어. 이제 다음 일을 서두르기 전에 잠깐 쉬자.']);return true;}
    if(!cinnabarAllHandedOver(save.flags)){g.say('유진',['바위에 둘러싸인 마른 해안에서 기다릴게. 도착한 포켓몬마다 상태를 살핀 뒤 내게 알려 줘.','아직 현장이나 로비에 남은 친구가 있다면 같은 남문으로 돌아가 데리고 나오자.'],undefined,[{label:'남은 동료 위치 확인',action:next},{label:'잠시 기다린다',action:close}]);return true;}
    g.say('안전한 홍련 해안',['피카츄가 알통몬 옆에서 숨을 고른다. 유진이 바닷바람을 막아 주며 두 포켓몬을 살핀다.','책임자를 놓친 건 아직 마음에 걸려. 그래도 우리가 남겨 두지 않은 친구들이 여기 있네.'],undefined,[
      {label:'두 포켓몬의 인계를 확인한다',action:()=>{if(!active()||!ready()||!cinnabarAllHandedOver(save.flags)||!save.flags[CINNABAR_MEWTWO_ASSISTED]||save.flags[CINNABAR_SHORE_HANDOFF])return;g.say('해안에서 쉬는 동료들',['두 포켓몬을 안전 해안에서 확인하고 유진과 돌봄을 이어가기로 했다.','급한 걸음이 멎었다. 한동안 파도 소리와 동료들의 숨소리를 듣는다.'],()=>{if(!active()||!ready()||!cinnabarAllHandedOver(save.flags)||!save.flags[CINNABAR_MEWTWO_ASSISTED]||save.flags[CINNABAR_SHORE_HANDOFF])return;save.flags[CINNABAR_SHORE_HANDOFF]=true;g.persist();close();});}},
      {label:'조금 더 살펴본다',action:close},
    ]);return true;
  }
  if(!mon)return false;
  const stage=evacuationStage(save.flags,mon.flag);
  if((stage<3)!==(map===CINNABAR_EVAC_MAP))return false;
  if(stage===4){g.say('해안에서 쉬는 '+mon.name,['바닷바람을 피하며 유진 곁에서 쉬고 있다. 다시 현장으로 데려가지 않아도 된다.'],undefined,[{label:'유진에게',action:()=>{if(active())g.setTourDestination('tour_cinnabar',CINNABAR_SHORE_EVENT);}},{label:'곁에서 쉰다',action:close}]);return true;}
  if(stage===2&&!save.flags[CINNABAR_MEWTWO_ASSISTED]){witness();return true;}
  const pages=stage===0?[`${mon.name}에게 낮게 몸을 기울여 열린 통로를 가리켰다.`,'먼저 동쪽 통로의 넓은 자리까지 이동시켜 다시 상태를 확인하자.']:stage===1?[`${mon.name}이 동쪽 통로에서 기다린다.`,'남쪽 로비까지 길은 열려 있다. 운반대가 지날 폭을 살피며 다음 합류 자리로 안내하자.']:stage===2?[`${mon.name}이 남쪽 로비까지 도착했다. 뮤츠가 막아 준 간섭도 잠잠하다.`,'열린 남문으로 안내하면 유진이 마른 해안에서 기다린다. 너도 도시 길을 따라 그곳으로 가서 직접 인계하자.']:[`${mon.name}이 남쪽 마른 해안에 도착해 기다린다.`,'유진 곁에서 호흡과 자세를 살펴 인계할 수 있는지 확인하자.'];
  g.say(mon.name,pages,undefined,[
    {label:['동쪽 중간 자리로 안내','남쪽 로비로 안내','열린 남문으로 내보낸다','해안에서 상태를 확인한다'][stage],action:()=>{
      if(!active()||!ready()||evacuationStage(save.flags,mon.flag)!==stage||(stage>=2&&!save.flags[CINNABAR_MEWTWO_ASSISTED]))return;
      g.say(mon.name,[stage===3?'유진과 함께 상태를 살폈다. 마른 바위 안쪽에서 쉬도록 자리를 잡았다.':stage<2?'열린 통로를 따라 다음 대기 자리까지 안내하자.':'확인한 길을 따라 다음 대기 자리로 안내했다. 걸어가서 다시 상태를 살피자.'],()=>{
        if(!active()||!ready()||evacuationStage(save.flags,mon.flag)!==stage||(stage>=2&&!save.flags[CINNABAR_MEWTWO_ASSISTED]))return;
        if(stage<2){startCinnabarEvacuationMotion(g,mon.id,next);return;}
        save.flags[mon.flag]=stage+1;g.persist();next();
      });
    }},
    {label:'여기서 잠시 기다리게 한다',action:close},
  ]);return true;
}
