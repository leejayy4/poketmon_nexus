import type {Engine} from './engine';
import type {SaveData} from './types';
import {createSpecialBattle,specialBattleResultFlag} from './battle';
import {showTrainerPreparation} from './trainer-preparation';
import {MAHOGANY_TRANSMISSION_STOPPED} from './mahogany-transmitter';

export const RAGE_CALM_EVENT='johto-rage-gyarados-calm';
export const RAGE_CAPTURE_EVENT='johto-rage-gyarados-capture';
export const RAGE_RECOVERY_FLAGS={distance:'nexusRageSafeDistance',water:'nexusRageRecoveryWaterChecked',bell:'nexusRageRecoveryBellChecked',residents:'nexusRageResidentsResumed'} as const;
export const RAGE_GYARADOS_EVENTS={distance:'rageLakeWaterStone',approach:'rageLakeLookout',water:'rageReliefBasin',bell:'rageReliefBell',resident:'tourHost'} as const;
export const rageGyaradosCalm=(s:Pick<SaveData,'flags'>)=>Boolean(s.flags[specialBattleResultFlag(RAGE_CALM_EVENT,'won')]);
export const rageGyaradosCaught=(s:Pick<SaveData,'flags'>)=>Boolean(s.flags[specialBattleResultFlag(RAGE_CAPTURE_EVENT,'caught')]);
const sessions=new WeakMap<Engine,object>();

export function handleRageLakeGyarados(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save,map=save.map;
  const home=map==='tour_rage_lake_home1'&&event===RAGE_GYARADOS_EVENTS.resident;
  if(!save.flags[MAHOGANY_TRANSMISSION_STOPPED]||(!home&&(map!=='tour_rage_lake'||event===RAGE_GYARADOS_EVENTS.resident||!Object.values(RAGE_GYARADOS_EVENTS).some(e=>e===event))))return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags[MAHOGANY_TRANSMISSION_STOPPED]);
  const normal=()=>{if(active()){sessions.delete(g);ordinary();}};
  const guide=(target:Parameters<Engine['setTourDestination']>[0],id:string)=>()=>{if(active())g.setTourDestination(target,id);};
  const center=guide('tour_rage_lake_center','tourHost');
  const next=()=>{if(!active())return;
    const target=!save.flags[RAGE_RECOVERY_FLAGS.distance]?RAGE_GYARADOS_EVENTS.distance:!rageGyaradosCalm(save)?RAGE_GYARADOS_EVENTS.approach:!save.flags[RAGE_RECOVERY_FLAGS.water]?RAGE_GYARADOS_EVENTS.water:!save.flags[RAGE_RECOVERY_FLAGS.bell]?RAGE_GYARADOS_EVENTS.bell:!save.flags[RAGE_RECOVERY_FLAGS.residents]?RAGE_GYARADOS_EVENTS.resident:null;
    if(target)guide(target===RAGE_GYARADOS_EVENTS.resident?'tour_rage_lake_home1':'tour_rage_lake',target)();
  };
  const record=(flag:string,text:string,condition:()=>boolean=active)=>{if(!condition())return;g.say('호숫가에서',[text],()=>{if(!condition())return;if(!save.flags[flag]){save.flags[flag]=true;g.persist();}next();});};
  const options=[{label:'다음 현장으로',action:next},{label:'평소 이야기와 관찰',action:normal},{label:'센터에서 회복',action:center}];
  if(home){
    if(!rageGyaradosCalm(save)||!save.flags[RAGE_RECOVERY_FLAGS.water]||!save.flags[RAGE_RECOVERY_FLAGS.bell]){g.say('호숫가 주민',['송신이 멈췄어도 물가의 큰 물결은 직접 살펴야 해요. 동료와 안전한 둑에서 대응한 뒤 물과 경보가 남아 있는지도 확인해 주세요.'],undefined,options);return true;}
    if(save.flags[RAGE_RECOVERY_FLAGS.residents]){g.say('다시 쓰는 호숫가',['주민: 받이에서 물을 받아 갈대를 씻고 있어요. 동료도 물그릇 앞에서 편하게 쉬네요.','이안: 생활을 지키며 멈출 수 있었어. 갸라도스를 동료로 맞을지는 네 선택이야.'],undefined,[{label:'동쪽 전망대로',action:guide('tour_rage_lake',RAGE_GYARADOS_EVENTS.approach)},{label:'평소 주민 이야기',action:normal},{label:'인주로 돌아가는 길',action:()=>{if(!active())return;g.say('인주로 돌아가는 길',['남쪽 43번도로를 내려가 황토마을에 도착하자. 황토 서문에서 42번도로를 따라가면 인주시티다.','절구산 입구는 42번도로의 선택 갈림길이다. 인주로 가려면 도로 본선을 따라 서쪽으로 계속 걸으면 된다.'],undefined,[{label:'인주를 목적지로',action:()=>{if(active())g.setTourDestination('tour_ecruteak');}},{label:'지도를 덮는다',action:()=>{}}]);}},{label:'43번도로 귀환',action:guide('tour_johto_route_43','tourRoute43LakeBoard')}]);return true;}
    g.say('호숫가 주민',['큰 물결이 잦아들고, 분리 취수와 수동 경보도 그대로 쓰고 있어요. 이젠 동료와 물가 생활을 다시 이어갈 수 있겠어요.'],undefined,[{label:'물과 경보의 현장 결과 전하기',action:()=>record(RAGE_RECOVERY_FLAGS.residents,'주민이 물통과 갈대 바구니를 다시 사용하기 시작했다. 이안은 생활을 유지한 채 위험한 송신을 멈춘 과정을 남겼다.',()=>active()&&rageGyaradosCalm(save)&&Boolean(save.flags[RAGE_RECOVERY_FLAGS.water]&&save.flags[RAGE_RECOVERY_FLAGS.bell]))},{label:'나중에 이야기한다',action:()=>{}}]);return true;
  }
  if(event===RAGE_GYARADOS_EVENTS.distance){
    if(rageGyaradosCaught(save)){g.say('서안에서 바라본 호수',['붉은 갸라도스는 동료가 되었고 호수에는 완만한 물결이 남았다. 주민의 물 받이와 둑길은 계속 이용할 수 있다.'],undefined,[{label:'평소 수위 관찰',action:normal},{label:'주민에게',action:guide('tour_rage_lake_home1','tourHost')}]);return true;}
    if(rageGyaradosCalm(save)){g.say('서안의 물결',['동쪽에서 밀려오던 거친 물결이 잦아들었다. 둑길과 취수 받이는 그대로 이어진다.'],undefined,options);return true;}
    g.say('서안의 안전거리',['붉은 갸라도스가 동쪽 수면에서 거친 물결을 일으킨다. 물로 들어가지 말고 둑 안쪽을 따라 동쪽 전망대로 가자.','포켓몬을 던져 넣거나 생활 받이를 밟고 가까이 가면 위험하다. 동료와 발 디딜 곳이 있는 전망대에서 대응하자.'],undefined,[{label:save.flags[RAGE_RECOVERY_FLAGS.distance]?'동쪽 전망대로':'둑의 접근 거리 확인',action:()=>save.flags[RAGE_RECOVERY_FLAGS.distance]?next():record(RAGE_RECOVERY_FLAGS.distance,'안쪽 둑의 안전거리를 확인했다. 동쪽 전망대에서 건강한 동료를 먼저 준비하자.')},{label:'평소 수위 관찰',action:normal}]);return true;
  }
  if(event===RAGE_GYARADOS_EVENTS.approach){
    if(!save.flags[RAGE_RECOVERY_FLAGS.distance]){g.say('동쪽 물가',['물결에 휩쓸리지 않게 서안에서 둑의 접근 거리를 먼저 살피자.'],undefined,options);return true;}
    if(rageGyaradosCaught(save)){g.say('잔잔해진 동쪽 수면',['붉은 갸라도스는 이미 동료가 되었다. 물가에는 완만한 물결만 남았다.'],undefined,[{label:'평소 전망 관찰',action:normal},{label:'주민에게',action:guide('tour_rage_lake_home1','tourHost')}]);return true;}
    const calm=rageGyaradosCalm(save),capture=calm&&Boolean(save.flags[RAGE_RECOVERY_FLAGS.residents]);
    if(calm&&!capture){g.say('잦아든 물결',['갸라도스가 호수 안쪽으로 물러났다. 지금은 주민의 물 받이와 낮은 둑 경보를 확인하고 돌아가자.'],undefined,options);return true;}
    const current=()=>active()&&Boolean(save.flags[RAGE_RECOVERY_FLAGS.distance])&&!rageGyaradosCaught(save)&&(capture?rageGyaradosCalm(save)&&Boolean(save.flags[RAGE_RECOVERY_FLAGS.residents]):!rageGyaradosCalm(save));
    const start=()=>{if(!current())return;const battle=createSpecialBattle(save,{eventId:capture?RAGE_CAPTURE_EVENT:RAGE_CALM_EVENT,species:130,level:25,met:'분노의호수',allowCapture:capture,shiny:true});if(!battle){g.say('먼저 동료를 준비하자',['지금은 대응을 시작할 수 없다. 센터에서 동료의 상태를 살피고 돌아오자.'],undefined,[{label:'센터로',action:center}]);return;}g.battle=battle;sessions.delete(g);g.persist();};
    g.say(capture?'다시 만나는 붉은 갸라도스':'거친 물결에 대응하기',capture?['물결이 잦아든 갸라도스와 다시 마주할 수 있다. 동료로 맞고 싶다면 몬스터볼과 파티 상태를 준비하자.','포획하지 않아도 주민의 생활은 이어진다.']:['갸라도스 Lv.25가 거친 물결을 일으킨다. 둑에서 동료와 대응해 힘을 가라앉히자.','지금은 진정 대응이다. 몬스터볼 대신 기술과 교대로 물결을 버텨 내자.'],undefined,[{label:capture?'동료를 고르고 선택 포획':'동료를 고르고 진정 대응',action:()=>showTrainerPreparation(g,current,start)},{label:'센터에서 회복',action:center},{label:'지금은 물러난다',action:()=>{}}]);return true;
  }
  if(!rageGyaradosCalm(save)){g.say('물가 생활 확인',['거친 물결이 남아 있다. 먼저 동쪽 전망대에서 동료와 대응하자.'],undefined,options);return true;}
  const water=event===RAGE_GYARADOS_EVENTS.water,flag=water?RAGE_RECOVERY_FLAGS.water:RAGE_RECOVERY_FLAGS.bell;
  g.say(water?'주민 취수 받이':'낮은 둑 수동 경보',water?['큰 물결이 잦아든 뒤에도 분리 홈통의 물은 받이에 모인다. 넘치는 물이 보행길로 흐르지 않는지 살피자.']:['주민이 수동 종과 신호판을 다시 움직인다. 송신기가 꺼져 있어도 낮은 둑에서 응답을 읽을 수 있다.'],undefined,[{label:save.flags[flag]?'다음 현장으로':water?'받이의 흐름 확인':'독립 응답 확인',action:()=>save.flags[flag]?next():record(flag,water?'받이의 물과 마른 보행길을 확인했다. 생활 공급이 유지되고 있다.':'송신기와 별개의 수동 경보 응답을 확인했다. 주민에게 결과를 전하자.',()=>active()&&rageGyaradosCalm(save))},{label:'평소 설비 살피기',action:normal}]);return true;
}
