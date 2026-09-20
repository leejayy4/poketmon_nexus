import type { Engine } from './engine';
import type { Pokemon } from './types';
import { createTrainerBattle } from './battle';
import { maxHpAtLevel } from './growth';
import { pokemonMoves } from './pokemon';
import { trainerWinFlag } from './trainer-flags';
import { showTrainerPreparation } from './trainer-preparation';
import { SILPH_RECORDS_MAP } from './silph-records-room';

export const SILPH_RECORDS_SECURED='nexusSilphRecordsSecured';
export const SILPH_RECORDS_GUARD='silph-records-guard';
export const SILPH_RECORDS_GUARD_EVENT='tourSilphRecordsGuard';
export const SILPH_RECORDS_ORIGINAL_EVENT='tourSilphRecordsOriginalDesk';
export const SILPH_RECORDS_PROTECTION_EVENT='tourSilphRecordsWiring';
export const SILPH_RECORDS_CONTROL_EVENT='tourSilphRecordsControl';
type Session={save:Engine['save'];player:Engine['save']['player'];protection:boolean;control:boolean;token:object};
const sessions=new WeakMap<Engine,Session>();

export function handleSilphRecordsStory(g:Engine,event:string):boolean{
  if(g.save.map!==SILPH_RECORDS_MAP||g.battle){sessions.delete(g);return false;}
  if(![SILPH_RECORDS_GUARD_EVENT,SILPH_RECORDS_ORIGINAL_EVENT,SILPH_RECORDS_PROTECTION_EVENT,SILPH_RECORDS_CONTROL_EVENT].includes(event)){
    const previous=sessions.get(g);if(previous)previous.token={};return false;
  }
  const save=g.save;
  let state=sessions.get(g);
  // Walking mutates coordinates; warp/recovery replaces player, even on the same save.
  if(!state||state.save!==save||state.player!==save.player){state={save,player:save.player,protection:false,control:false,token:{}};sessions.set(g,state);}
  const session=state,token={};session.token=token;
  const active=()=>g.save===save&&save.player===session.player&&save.map===SILPH_RECORDS_MAP&&!g.battle&&sessions.get(g)===session&&session.token===token&&Boolean(save.flags.nexusSilphDiscrepancyConfirmed);
  const won=()=>Boolean(save.flags[trainerWinFlag(SILPH_RECORDS_GUARD)]);
  const close=()=>{if(sessions.get(g)===session)sessions.delete(g);};
  const center=()=>{if(!active())return;close();g.setTourDestination('tour_saffron_center','nurse');g.say('공개층으로 돌아가기',['남쪽 문으로 공개 2층에 돌아가 계단을 내려가자. 노랑 포켓몬센터에서 동료를 회복할 수 있다.']);};
  if(!active())return false;
  if(event===SILPH_RECORDS_GUARD_EVENT){
    if(won()){g.say('기록실 경비',['더는 대조를 막지 않겠다. 반입 지시를 그대로 따랐지만, 공개 사용표와 다른 구역인 이유는 나도 듣지 못했다.','원본을 훼손하지 말아 줘. 서쪽 보호선 안내와 동쪽 제어선 기록을 읽고 북쪽 작업대에서 비교해 봐.']);return true;}
    const current=()=>active()&&!won();
    const start=()=>{
      if(!current())return;
      if(!save.party.some(mon=>mon.hp>0)){g.say('기록실 경비',['쓰러진 동료를 억지로 내보내지 마. 회복하고 돌아와도 늦지 않아.'],undefined,[{label:'센터로 돌아갈 준비',action:center},{label:'지금은 물러난다',action:close}]);return;}
      const team:Pokemon[]=[[66,23],[74,24]].map(([species,level])=>{const maxHp=maxHpAtLevel(species,level);const mon:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'실프 기록실 경비 동료'};mon.moves=pokemonMoves(mon);return mon;});
      g.battle=createTrainerBattle(save,{id:SILPH_RECORDS_GUARD,name:'기록실 경비',reward:0,team});
      if(g.battle){close();g.persist();g.say('기록실 경비',['반입 자료를 외부에 보여 주지 말라는 지시다. 그래도 확인하겠다면 나를 넘어 봐!']);}
    };
    g.say('기록실 경비',['공개층 직원들은 생활 장치를 돌볼 뿐이야. 이 반입 기록을 막으라는 지시는 내게 따로 내려왔다.','원본 열람을 두고 겨룬다. 알통몬 Lv.23 · 꼬마돌 Lv.24.','돌아가는 문과 서가 통로는 막지 않겠다. 동료를 준비하고 다시 와도 돼.'],undefined,[
      {label:'원본을 확인하기 위해 겨룬다',action:start},
      {label:'출전 동료를 고른다',action:()=>showTrainerPreparation(g,current,start)},
      {label:'센터에서 준비한다',action:center},
      {label:'지금은 물러난다',action:close},
    ]);return true;
  }
  if(event===SILPH_RECORDS_PROTECTION_EVENT||event===SILPH_RECORDS_CONTROL_EVENT){
    const protection=event===SILPH_RECORDS_PROTECTION_EVENT;
    g.say(protection?'보호선 안내':'제어선 운용 기록',protection?['보호선은 대피 중인 포켓몬의 보호 장치에 전원을 공급한다.','제어 신호를 멈춰도 보호 전원은 따로 유지해야 한다.']:['제어선은 장치의 동작을 외부 신호에 맞춰 제한한다.','제어 신호와 보호 전원은 독립된 선이다. 전체 전원을 끄면 보호 장치까지 멈춘다.'],()=>{
      if(!active())return;
      if(protection)session.protection=true;else session.control=true;
    });return true;
  }
  const result=()=>g.say('보존한 반입 원본',['원본의 반입처는 홍련의 비공개 설비다. 공개 사용표의 대피 장치에 별도의 제어선이 함께 납품됐다.','원본을 훼손하지 않도록 보존했다. 보호 전원을 유지하면서 제어 신호를 분리해야 한다는 차이도 확인했다.','홍련 현장에서 이 배선이 어떻게 쓰이는지 확인해야 한다. 그곳의 포켓몬들이 안전한지는 아직 알 수 없다.']);
  if(save.flags[SILPH_RECORDS_SECURED]){result();return true;}
  if(!won()){g.say('원본 대조 작업대',['경비가 보관함을 잠근 채 지키고 있다. 먼저 작업대 남쪽의 경비와 마주해야 한다.'],undefined,[{label:'경비 위치 확인',action:()=>{if(active())g.setTourDestination(SILPH_RECORDS_MAP,SILPH_RECORDS_GUARD_EVENT);}},{label:'센터에서 준비한다',action:center},{label:'물러난다',action:close}]);return true;}
  if(!session.protection||!session.control){g.say('원본을 펼치기 전에',['서쪽 보호선 안내와 동쪽 제어선 기록을 모두 읽고 배선의 용도를 대조하자.'],undefined,[{label:'아직 읽지 않은 자료로',action:()=>{if(active())g.setTourDestination(SILPH_RECORDS_MAP,session.protection?SILPH_RECORDS_CONTROL_EVENT:SILPH_RECORDS_PROTECTION_EVENT);}},{label:'이번 대조를 그만둔다',action:close}]);return true;}
  g.say('홍련 반입 원본',['반입처: 홍련 비공개 설비. 보호 장치와 별도의 제어선이 함께 적혀 있다.','두 선을 어떻게 구분해야 할까?'],undefined,[
    {label:'보호 전원 유지 · 제어 신호 분리',action:()=>{
      if(!active()||!won()||!session.protection||!session.control||save.flags[SILPH_RECORDS_SECURED])return;
      g.say('원본 보존',['공개 사본과 원본의 장비 표기를 맞췄다. 홍련으로 간 장비는 보호 기능과 제어 기능을 따로 가진다.','원본을 접히거나 찢어지지 않게 보존하고 반입처를 기록했다.'],()=>{
        if(!active()||!won()||!session.protection||!session.control||save.flags[SILPH_RECORDS_SECURED])return;
        save.flags[SILPH_RECORDS_SECURED]=true;g.persist();close();result();
      });
    }},
    {label:'모든 전원을 함께 끈다',action:()=>{if(!active()||!won())return;g.say('보호선의 역할',['전체 전원을 끄면 보호 장치도 멈춘다. 두 선의 역할을 다시 살펴보자.']);}},
    {label:'대조를 그만둔다',action:close},
  ]);return true;
}
