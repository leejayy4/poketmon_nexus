import type { Engine } from './engine';
import type { Pokemon,SaveData } from './types';
import type { Furnishing } from './explore-interiors';
import { createTrainerBattle } from './battle';
import { maxHpAtLevel } from './growth';
import { pokemonMoves } from './pokemon';
import { trainerWinFlag } from './trainer-flags';
import { showTrainerPreparation } from './trainer-preparation';
import { CINNABAR_CONTROL_SITE,CINNABAR_SITE_ARRIVAL,CINNABAR_SITE_PROTECTION,CINNABAR_SITE_EVACUATION } from './cinnabar-control-site';
import { CINNABAR_RESCUE_STARTED,CINNABAR_RESCUE_ORDER } from './cinnabar-rescue-arrival';

export const CINNABAR_PROTECTION_READY='nexusCinnabarProtectionReady';
export const CINNABAR_EVACUATION_READY='nexusCinnabarEvacuationReady';
export const CINNABAR_PARTNER_WORK_CHECKED='nexusCinnabarPartnerWorkChecked';
export const CINNABAR_EVACUATION_WALK_CHECKED='nexusCinnabarEvacuationWalkChecked';
export const CINNABAR_EVACUATION_LOBBY_EVENT='tourCinnabarSitePlan';
export const CINNABAR_CONTROL_SEPARATED='nexusCinnabarControlSeparated';
export const CINNABAR_CONTROL_GUARD='cinnabar-control-guard';
export const CINNABAR_CONTROL_GUARD_EVENT='tourCinnabarControlGuard';
export const CINNABAR_CONTROL_EVENT='tourCinnabarSiteControl';
const sessions=new WeakMap<Engine,object>();

export function handleCinnabarRescueWork(g:Engine,event:string):boolean{
  const save=g.save;
  if(save.map!==CINNABAR_CONTROL_SITE||!save.flags[CINNABAR_RESCUE_STARTED]){sessions.delete(g);return false;}
  if(![CINNABAR_SITE_ARRIVAL,CINNABAR_SITE_PROTECTION,CINNABAR_SITE_EVACUATION,CINNABAR_EVACUATION_LOBBY_EVENT,CINNABAR_CONTROL_GUARD_EVENT,CINNABAR_CONTROL_EVENT,'tourCinnabarSitePokemon','tourCinnabarSiteStretcher'].includes(event)){sessions.delete(g);return false;}
  const token={},player=save.player;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===CINNABAR_CONTROL_SITE&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusSilphRecordsSecured&&save.flags[CINNABAR_RESCUE_STARTED]);
  const close=()=>{if(sessions.get(g)===token)sessions.delete(g);};
  const ready=()=>Boolean(save.flags[CINNABAR_PROTECTION_READY]&&save.flags[CINNABAR_EVACUATION_READY]);
  const won=()=>Boolean(save.flags[trainerWinFlag(CINNABAR_CONTROL_GUARD)]);
  const playerEvac=save.flags[CINNABAR_RESCUE_ORDER]===1;
  const ownKey=playerEvac?CINNABAR_EVACUATION_READY:CINNABAR_PROTECTION_READY;
  const peerKey=playerEvac?CINNABAR_PROTECTION_READY:CINNABAR_EVACUATION_READY;
  const ownEvent=playerEvac?CINNABAR_SITE_EVACUATION:CINNABAR_SITE_PROTECTION;
  const peerEvent=playerEvac?CINNABAR_SITE_PROTECTION:CINNABAR_SITE_EVACUATION;
  const guide=(target:string)=>{if(active())g.setTourDestination(CINNABAR_CONTROL_SITE,target);};
  const center=()=>{if(!active())return;close();g.setTourDestination('tour_cinnabar_center','nurse');g.say('홍련센터로',['남쪽 반입 로비의 문으로 나가 홍련 포켓몬센터에서 회복하고 돌아오자. 끝낸 준비는 남겨 둔다.']);};
  if(!active())return false;
  if(event===CINNABAR_EVACUATION_LOBBY_EVENT){
    g.say('남쪽 로비 연결 확인',['동쪽 통로가 이 반입 로비로 이어진다. 남쪽 귀환문까지 운반대가 지나갈 공간이 열려 있다.'],undefined,[
      {label:'로비 연결을 확인한다',action:()=>{if(!active())return;g.say('대피로 끝에서',['열린 남문과 동쪽 통로의 합류를 확인했다. 동쪽 확인대로 돌아가 통로 상태를 맞춰 보자.'],()=>{if(!active())return;save.flags[CINNABAR_EVACUATION_WALK_CHECKED]=true;g.persist();guide(CINNABAR_SITE_EVACUATION);});}},
      {label:'확인을 미룬다',action:close},
    ]);return true;
  }
  if(event===CINNABAR_SITE_PROTECTION||event===CINNABAR_SITE_EVACUATION){
    const protection=event===CINNABAR_SITE_PROTECTION,key=protection?CINNABAR_PROTECTION_READY:CINNABAR_EVACUATION_READY;
    if(save.flags[key]){g.say(protection?'유지 중인 보호 전원':'확인한 대피 통로',protection?['보호 전원 표시가 안정돼 있다. 제어 신호선과 분리해 유지한 공급선이 보인다.']:['동쪽 통로에서 남쪽 반입 로비까지 운반대가 지날 길을 확인했다. 포켓몬들은 아직 보호 구역에 있다.'],undefined,[{label:'유진에게 돌아가기',action:()=>guide(CINNABAR_SITE_ARRIVAL)},{label:'살펴보기를 마친다',action:close}]);return true;}
    if(!protection&&!save.flags[CINNABAR_EVACUATION_WALK_CHECKED]){
      g.say('대피로를 끝까지 살펴보자',['이 확인대에서 동쪽 길을 따라 남쪽 반입 로비로 걸어가자. 로비 구역도 앞에서 귀환문까지 연결되는지 확인해야 한다.'],undefined,[{label:'남쪽 로비 확인 지점',action:()=>guide(CINNABAR_EVACUATION_LOBBY_EVENT)},{label:'정찰을 미룬다',action:close}]);return true;
    }
    if(event===peerEvent){
      if(!save.flags[ownKey]){g.say('나눈 준비 작업',['먼저 네가 맡은 쪽을 확인한 뒤 유진이 맡은 현장도 함께 살펴보자.'],undefined,[{label:'내가 맡은 곳으로',action:()=>guide(ownEvent)},{label:'돌아간다',action:close}]);return true;}
      g.say(protection?'유진이 맡은 보호 전원':'유진이 맡은 대피 통로',protection?['유진이 전원을 살핀 흔적이 있다. 공급선이 보호 장치로 이어지고 표시등도 켜져 있다.']:['유진이 운반대를 벽 쪽에 붙여 두었다. 통로 끝에서 남쪽 로비로 돌아가는 길이 보인다.'],undefined,[
        {label:'현장을 확인하고 유진에게 묻는다',action:()=>{if(!active()||!save.flags[ownKey]||save.flags[peerKey])return;g.say('상대 작업의 현장 확인',['눈으로 확인한 상태를 유진에게 전하고 작업을 마쳤는지 직접 물어보자.'],()=>{if(!active()||!save.flags[ownKey]||save.flags[peerKey])return;save.flags[CINNABAR_PARTNER_WORK_CHECKED]=true;g.persist();guide(CINNABAR_SITE_ARRIVAL);});}},
        {label:'확인을 미룬다',action:close},
      ]);return true;
    }
    g.say(protection?'보호 전원 유지':'대피 통로 정찰',protection?['보호 전원선과 제어 신호선이 나란히 놓여 있다. 포켓몬을 보호하면서 어떤 선을 유지할까?']:['동쪽 길을 따라 운반대가 지나갈 곳을 살핀다. 대피 통로를 어느 곳까지 이어 확인할까?'],undefined,[
      {label:protection?'보호 공급선을 유지한다':'동쪽 길과 남쪽 반입 로비 연결 확인',action:()=>{
        if(!active()||save.flags[key])return;
        g.say(protection?'보호 공급 확인':'대피 본선 확인',protection?['보호 공급선을 고정하고 표시등이 켜져 있는지 확인했다. 제어 신호는 그대로 두었다.']:['동쪽 길을 돌아 남쪽 로비로 이어지는 공간과 운반대 폭을 확인했다. 돌아오는 문도 열려 있다.'],()=>{
          if(!active()||save.flags[key])return;save.flags[key]=true;g.persist();guide(peerEvent);
        });
      }},
      {label:protection?'주 전원을 모두 끈다':'잠긴 북쪽 서비스 문을 대피로로 삼는다',action:()=>{if(!active())return;g.say('다시 살펴보기',protection?['그렇게 하면 보호 장치까지 멈춘다. 보호 공급선은 유지해야 한다.']:['서비스 문은 안쪽에서 잠겨 있다. 언제든 돌아갈 수 있는 남쪽 로비까지 길을 확인하자.']);}},
      {label:'작업을 미룬다',action:close},
    ]);return true;
  }
  if(event===CINNABAR_SITE_ARRIVAL){
    if(save.flags[CINNABAR_CONTROL_SEPARATED]){g.say('유진',['제어 신호가 멈췄어. 보호 전원은 계속 켜져 있네.','이제 포켓몬들을 한 마리씩 데리고 나갈 준비를 하자. 아직 현장 밖으로 옮긴 건 아니야.']);return true;}
    if(ready()){g.say('유진',['보호 전원과 남쪽 대피 통로를 서로 확인했어.','북쪽 제어실로 가자. 보호 전원을 건드리지 않고 신호만 분리해야 해.'],undefined,[{label:'제어실로',action:()=>guide(won()?CINNABAR_CONTROL_EVENT:CINNABAR_CONTROL_GUARD_EVENT)},{label:'곁에서 기다린다',action:close}]);return true;}
    if(save.flags[ownKey]&&save.flags[CINNABAR_PARTNER_WORK_CHECKED]){
      g.say('유진',playerEvac?['네가 본 대로 보호 공급선을 확인했어. 표시등을 보면서 유지하고 있어.','남쪽 통로도 네가 확인했구나. 양쪽 준비가 맞는지 마지막으로 확인하자.']:['네가 본 통로를 따라 운반대가 남쪽 로비까지 지날 수 있는지 살폈어.','보호 전원도 네가 유지했구나. 양쪽 준비를 마지막으로 확인하자.'],undefined,[
        {label:'서로 확인한 준비를 맞춘다',action:()=>{if(!active()||!save.flags[ownKey]||!save.flags[CINNABAR_PARTNER_WORK_CHECKED]||save.flags[peerKey])return;g.say('구조 준비 확인',['서로 맡은 현장과 결과를 맞췄다. 보호 전원은 유지하고 대피 통로는 남쪽 로비까지 사용할 수 있다.'],()=>{if(!active()||!save.flags[ownKey]||!save.flags[CINNABAR_PARTNER_WORK_CHECKED]||save.flags[peerKey])return;save.flags[peerKey]=true;g.persist();guide(CINNABAR_CONTROL_GUARD_EVENT);});}},
        {label:'다시 살펴본다',action:close},
      ]);return true;
    }
    g.say('유진',[save.flags[ownKey]?'내가 맡은 현장도 직접 보고 와 줘. 서로 본 상태를 맞춰 보자.':'먼저 네가 맡은 현장을 살펴봐. 나는 반대쪽 준비를 맡을게.'],undefined,[{label:'준비 현장으로',action:()=>guide(save.flags[ownKey]?peerEvent:ownEvent)},{label:'센터에서 준비',action:center},{label:'잠시 기다린다',action:close}]);return true;
  }
  if(event==='tourCinnabarSitePokemon'||event==='tourCinnabarSiteStretcher'){
    g.say(event==='tourCinnabarSitePokemon'?'대피를 기다리는 포켓몬':'대피 운반대',[save.flags[CINNABAR_CONTROL_SEPARATED]?'제어 신호가 멈추자 포켓몬들이 고개를 들었다. 아직 보호 구역에서 움직일 신호를 기다린다.':ready()?'보호 전원과 통로 준비를 마쳤지만 제어 신호가 아직 이어지고 있다.':'포켓몬들은 보호 장치 곁에서 기다린다. 전원과 통로부터 안전하게 준비하자.']);return true;
  }
  if(!ready()){g.say('제어실 앞',['보호 전원과 대피 통로를 먼저 확인해야 한다. 유진과 나눈 준비를 마치고 돌아오자.'],undefined,[{label:'유진에게',action:()=>guide(CINNABAR_SITE_ARRIVAL)},{label:'센터에서 준비',action:center},{label:'돌아간다',action:close}]);return true;}
  if(event===CINNABAR_CONTROL_GUARD_EVENT){
    if(won()){g.say('제어실 경비',['더는 신호 단말을 가로막지 않겠다. 보호 공급선까지 끊지는 마라.']);return true;}
    const current=()=>active()&&ready()&&!won();
    const start=()=>{
      if(!current())return;
      if(!save.party.some(p=>p.hp>0)){g.say('제어실 경비',['쓰러진 동료부터 돌보고 와라. 남쪽 문은 열려 있다.'],undefined,[{label:'센터 안내',action:center},{label:'물러난다',action:close}]);return;}
      const team:Pokemon[]=[[66,24],[74,25]].map(([species,level])=>{const maxHp=maxHpAtLevel(species,level);const mon:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'홍련 제어실 경비 동료'};mon.moves=pokemonMoves(mon);return mon;});
      g.battle=createTrainerBattle(save,{id:CINNABAR_CONTROL_GUARD,name:'제어실 경비',reward:0,team});if(g.battle){close();g.persist();g.say('제어실 경비',['신호를 유지하라는 지시다. 단말을 조작하려면 나부터 넘어라!']);}
    };
    g.say('제어실 경비',['신호 단말을 지키라는 지시를 받았다. 대피 통로까지 막을 생각은 없다.','알통몬 Lv.24 · 꼬마돌 Lv.25'],undefined,[{label:'신호 단말을 확보하기 위해 겨룬다',action:start},{label:'출전 동료를 고른다',action:()=>showTrainerPreparation(g,current,start)},{label:'센터에서 준비',action:center},{label:'물러난다',action:close}]);return true;
  }
  if(save.flags[CINNABAR_CONTROL_SEPARATED]){g.say('분리한 제어 신호',['제어 신호 표시가 꺼져 있다. 보호 공급선은 그대로 유지된다.','포켓몬들은 아직 중앙 보호 구역에 있다. 실제 대피와 해안 인계가 남았다.']);return true;}
  if(!won()){g.say('제어 신호 단말',['경비가 단말 조작을 막고 있다. 먼저 제어실 경비와 마주하자.'],undefined,[{label:'경비 위치 확인',action:()=>guide(CINNABAR_CONTROL_GUARD_EVENT)},{label:'돌아간다',action:close}]);return true;}
  g.say('제어 신호 분리',['보호 전원과 대피 통로 준비가 끝났고 경비도 물러섰다. 어느 연결을 분리할까?'],undefined,[
    {label:'보호 공급은 두고 제어 신호만 분리',action:()=>{if(!active()||!ready()||!won()||save.flags[CINNABAR_CONTROL_SEPARATED])return;g.say('제어선 분리',['제어 신호 연결을 분리했다. 보호 장치 표시등은 켜진 채로 남았다.'],()=>{if(!active()||!ready()||!won()||save.flags[CINNABAR_CONTROL_SEPARATED])return;save.flags[CINNABAR_CONTROL_SEPARATED]=true;g.persist();guide(CINNABAR_SITE_ARRIVAL);});}},
    {label:'보호 공급선도 함께 분리',action:()=>{if(active())g.say('보호 전원을 남겨 두자',['보호 공급선까지 끊으면 기다리는 포켓몬을 지킬 수 없다. 제어 신호만 분리하자.']);}},
    {label:'조작을 미룬다',action:close},
  ]);return true;
}

/** Add to the same depth layer AFTER drawing this furnishing, with live save flags. */
export function paintCinnabarRescueFurnishing(c:CanvasRenderingContext2D,o:Furnishing,flags:SaveData['flags']){
  const key=o.event===CINNABAR_SITE_PROTECTION?CINNABAR_PROTECTION_READY:o.event===CINNABAR_SITE_EVACUATION?CINNABAR_EVACUATION_READY:o.event===CINNABAR_CONTROL_EVENT?CINNABAR_CONTROL_SEPARATED:undefined;
  if(!key)return;
  c.save();
  const x=o.x+1,y=o.y;
    const done=Boolean(flags[key]);c.fillStyle=done?'#a9e5b4':'#e0ba78';c.fillRect(x*16+3,y*16-4,10,5);
    if(done){c.strokeStyle='#365e4b';c.lineWidth=2;c.beginPath();c.moveTo(x*16+4,y*16-2);c.lineTo(x*16+6,y*16);c.lineTo(x*16+11,y*16-4);c.stroke();}
  c.restore();
}
