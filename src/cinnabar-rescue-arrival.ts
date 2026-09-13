import type { Engine } from './engine';
import { CINNABAR_CONTROL_SITE,CINNABAR_SITE_ARRIVAL,CINNABAR_SITE_PROTECTION,CINNABAR_SITE_EVACUATION } from './cinnabar-control-site';

export const CINNABAR_RESCUE_STARTED='nexusCinnabarRescueStarted';
/** 1 = player scouts evacuation first; 2 = player maintains protection first. Not task completion. */
export const CINNABAR_RESCUE_ORDER='nexusCinnabarRescueOrder';
const sessions=new WeakMap<Engine,object>();

export function handleCinnabarRescueArrival(g:Engine,event:string):boolean{
  if(g.save.map!==CINNABAR_CONTROL_SITE){sessions.delete(g);return false;}
  if(![CINNABAR_SITE_ARRIVAL,CINNABAR_SITE_PROTECTION,CINNABAR_SITE_EVACUATION,'tourCinnabarSitePokemon','tourCinnabarSiteServiceDoor','tourCinnabarSiteControl'].includes(event)){sessions.delete(g);return false;}
  const save=g.save,player=save.player,token={};sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===CINNABAR_CONTROL_SITE&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusSilphRecordsSecured);
  const close=()=>{if(sessions.get(g)===token)sessions.delete(g);};
  if(!active())return false;
  const started=()=>Boolean(save.flags[CINNABAR_RESCUE_STARTED]);
  const order=()=>save.flags[CINNABAR_RESCUE_ORDER];
  const guide=()=>{
    if(!active())return;
    const evacuation=order()===1;
    g.setTourDestination(CINNABAR_CONTROL_SITE,evacuation?CINNABAR_SITE_EVACUATION:CINNABAR_SITE_PROTECTION);
    g.say('유진',evacuation?['너는 동쪽 대피로를 살펴봐. 나는 보호 전원 곁에서 기다릴게.','포켓몬을 옮기기 전에 양쪽 준비를 서로 확인하자.']:['너는 서쪽 보호 전원을 살펴봐. 나는 동쪽 대피로 쪽을 맡을게.','전원과 통로가 안전한지 확인하기 전에는 포켓몬을 옮기지 말자.']);
  };
  if(event===CINNABAR_SITE_ARRIVAL){
    if(started()){
      g.say('유진',['책임자를 놓친 건 마음에 걸려. 그래도 이 친구들을 두고 갈 수는 없겠지.','우리가 맡은 준비를 마친 뒤 서로 확인하고 움직이자.'],undefined,[{label:'맡은 장소 확인',action:guide},{label:'포켓몬 곁에 남는다',action:close}]);return true;
    }
    const choose=(first:1|2)=>{
      if(!active()||started())return;
      g.say('유진',first===1?['알겠어. 네가 대피로를 정찰하는 동안 나는 보호 전원 곁을 맡을게.','아직 옮기지는 말자. 둘 다 준비되면 다시 확인하는 거야.']:['알겠어. 네가 보호 전원을 살피는 동안 나는 동쪽 대피로를 맡을게.','아직 옮기지는 말자. 둘 다 준비되면 다시 확인하는 거야.'],()=>{
        if(!active()||started())return;
        save.flags[CINNABAR_RESCUE_ORDER]=first;save.flags[CINNABAR_RESCUE_STARTED]=true;g.persist();guide();
      });
    };
    g.say('유진',[
      '실프 원본의 반입 표식이 여기에도 있어. 저 북쪽 서비스 문으로 책임자가 빠져나갔어!',
      '보호 장치 옆의 피카츄가 발을 떨고 있다. 알통몬은 닫힌 문과 우리를 번갈아 바라본다.',
      '너는 포켓몬들 쪽으로 몸을 돌렸다. 여기 있는 친구들을 두고 갈 수는 없다.',
      '지금 보내면 또 같은 일을 할 거야…! …그래도 혼자 두고 가겠다는 건 아니야. 같이 돕자.',
      '대피로 정찰과 보호 전원 확인을 나눠 맡자. 어느 쪽부터 살필래?',
    ],undefined,[
      {label:'대피로 정찰을 먼저 맡는다',action:()=>choose(1)},
      {label:'보호 전원 확인을 먼저 맡는다',action:()=>choose(2)},
      {label:'주변을 더 살펴본다',action:close},
    ]);return true;
  }
  if(event==='tourCinnabarSitePokemon'){
    g.say('보호 장치 곁의 포켓몬',[started()?'피카츄가 한 걸음 다가왔다가 보호 장치 옆에 멈춘다. 알통몬도 움직일 신호를 기다린다.':'피카츄는 보호 장치의 불빛을 바라본다. 알통몬은 발을 옮기려다 닫힌 문 앞에서 멈춘다.','먼저 유진과 함께 이곳을 빠져나갈 준비를 나누자.']);return true;
  }
  if(event==='tourCinnabarSiteServiceDoor'){
    g.say('닫힌 서비스 문',['책임자가 지나간 뒤 잠긴 문이다. 아래쪽 먼지에 급한 발자국이 남았다.','바로 뒤 보호 장치 곁에서 포켓몬들이 우리를 기다리고 있다.']);return true;
  }
  if(event==='tourCinnabarSiteControl'){
    g.say('제어 신호 단말',['제어선의 신호가 아직 깜빡인다. 실프 원본에 적힌 보호 전원과는 별개의 선이다.','먼저 보호 장치와 대피로를 살펴야 한다. 이 단말을 보고 있는 동안에도 포켓몬들은 대기 구역에 남아 있다.']);return true;
  }
  if(!started()){
    g.say('현장 준비',['먼저 중앙 보호 장치 곁의 유진과 일을 나누자.'],undefined,[{label:'유진 위치 확인',action:()=>{if(active())g.setTourDestination(CINNABAR_CONTROL_SITE,CINNABAR_SITE_ARRIVAL);}},{label:'주변을 살펴본다',action:close}]);return true;
  }
  const protection=event===CINNABAR_SITE_PROTECTION;
  g.say(protection?'보호 전원 장치':'동쪽 대피로 확인대',protection?[
    '보호 전원 표시가 켜져 있다. 아래 연결선은 포켓몬이 머무는 장치로 이어진다.',
    '전원을 함부로 끄지 않고 배선을 살폈다. 아직 유지 작업을 마친 것은 아니다.',
  ]:[
    '동쪽 통로를 따라 남쪽 반입 로비로 돌아갈 수 있다. 낮은 운반대가 옆에 놓여 있다.',
    '통로와 운반대를 살폈다. 포켓몬을 옮길 준비는 아직 함께 확인해야 한다.',
  ],undefined,[{label:'유진과 맡은 일 확인',action:()=>{if(active())g.setTourDestination(CINNABAR_CONTROL_SITE,CINNABAR_SITE_ARRIVAL);}},{label:'살펴보기를 마친다',action:close}]);
  return true;
}
