import type {Engine} from './engine';
import {SPECIES} from './pokemon';
import {JOHTO_ROUTE_42,JOHTO_MT_MORTAR_1F} from './johto-route-42';
export const MORTAR_DRAINAGE_FLAGS=['nexusMortarDownstreamCloudy','nexusMortarSedimentTraced','nexusMortarSettlingPrepared','nexusMortarDebrisCollected','nexusMortarDrainRestored','nexusMortarDownstreamChecked'] as const;
export const MORTAR_DRAINAGE_EVENTS={downstream:'tourRoute42WaterRail',source:'mortarSedimentScreen',basin:'mortarSettlingBasin'} as const;
const sites=[JOHTO_ROUTE_42,JOHTO_MT_MORTAR_1F,JOHTO_MT_MORTAR_1F,JOHTO_MT_MORTAR_1F,JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42] as const;
export const MORTAR_DRAINAGE_ORDER=[MORTAR_DRAINAGE_EVENTS.downstream,MORTAR_DRAINAGE_EVENTS.source,MORTAR_DRAINAGE_EVENTS.basin,MORTAR_DRAINAGE_EVENTS.source,MORTAR_DRAINAGE_EVENTS.basin,MORTAR_DRAINAGE_EVENTS.downstream] as const;
const sessions=new WeakMap<Engine,object>();
export function handleMortarDrainage(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save,map=save.map;if(!sites.some((m,i)=>m===map&&MORTAR_DRAINAGE_ORDER[i]===event))return false;
  if(!save.flags.nexusEcruteakEugeneReflected){if(event===MORTAR_DRAINAGE_EVENTS.downstream)return false;g.say('암반 배수홈',['바위 가장자리에 거름틀과 침전 받이가 놓여 있다. 기존 산행길은 그대로 이어진다.']);return true;}
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusEcruteakEugeneReflected);
  const pending=()=>MORTAR_DRAINAGE_FLAGS.findIndex(f=>!save.flags[f]);
  const next=()=>{const i=pending();if(active()&&i>=0)g.setTourDestination(sites[i],MORTAR_DRAINAGE_ORDER[i]);};
  const normal=()=>{if(active()){sessions.delete(g);ordinary();}};
  const i=pending();
  if(i<0){g.say('다시 흐르는 작은 배수홈',['거름틀의 퇴적물은 수거함에 남고, 배수홈은 정상 방향으로 흐른다. 42번도로의 이 관측 지점에서도 떠내려오는 모래와 잎이 줄었다.','이 작은 구간의 재유입을 줄인 결과다. 상류 전체의 오염원이나 다른 수로까지 해결한 것은 아니다.'],undefined,[{label:'평소 물길 관찰',action:normal},{label:'42번도로 본선으로',action:()=>{if(active())g.setTourDestination(JOHTO_ROUTE_42,'tourRoute42MortarBoard');}}]);return true;}
  if(map!==sites[i]||event!==MORTAR_DRAINAGE_ORDER[i]){g.say('상류와 하류를 함께',['물이 어디에서 흐려지는지와 받이의 상태를 차례로 대조하자.'],undefined,[{label:'다음 실제 작업 지점',action:next},{label:'평소 관찰',action:normal}]);return true;}
  const finish=(text:string,valid:()=>boolean=active)=>{if(!valid()||pending()!==i)return;g.say('작은 배수홈',[text],()=>{if(!valid()||pending()!==i)return;save.flags[MORTAR_DRAINAGE_FLAGS[i]]=true;g.persist();next();});};
  if(i===2){const choose=(page=0)=>{if(!active())return;g.say('침전 받이 준비',['거름틀을 열기 전에 흐름을 옆 침전 받이로 받아야 모래가 아래로 쏟아지지 않는다. 동료와 빈 받침을 먼저 고정하자.'],undefined,[
    ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name}와 받이 준비`,action:()=>{const valid=()=>active()&&save.party.includes(mon)&&mon.hp>0;if(!valid()){if(active())g.say('먼저 동료를 돌보자',['건강한 동료와 작업하자.'],undefined,[{label:'인주 센터로',action:()=>{if(active())g.setTourDestination('tour_ecruteak_center','tourHost');}},{label:'다른 동료',action:()=>choose(page)}]);return;}
      const strong=SPECIES[mon.species].types.some(t=>['격투','바위','땅'].includes(t));g.say('물 밖에서 역할 나누기',[strong?'동료가 물 밖 받침을 지키고 사람이 짧은 홈통을 맞춘다.':'동료가 빈 바구니 쪽을 지키고 사람이 작은 받침을 나누어 맞춘다.'],undefined,[{label:'받침 고정 후 침전 쪽으로 분리',action:()=>finish('물 밖 받침을 고정하고 유입을 침전 받이 쪽으로 돌렸다. 거름틀 아래로 바로 흘려보내지 않고 퇴적물을 걷어낼 수 있다.',valid)},{label:'동료를 물속에 넣어 막기',action:()=>{if(valid())g.say('안전한 받침을 쓰자',['동료를 물속에 넣을 필요는 없다. 바깥 받침과 짧은 홈통을 쓰자.']);}}]);}})),
    ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),{label:'나중에 작업',action:()=>{}},
  ]);};choose();return true;}
  const scenes=[
    {title:'42번도로 물길 난간',text:'작은 관측 웅덩이에 잎 조각과 모래가 떠내려온다. 절구산의 얕은 배수홈 쪽 흐름과 대조하자.',yes:'유입 방향을 따라 상류로',no:'하류에 흙을 쌓아 막기',result:'절구산 서쪽 보행길의 거름틀로 이어지는 작은 유입을 살피기로 했다. 기존 동굴 입구로 올라가자.',wrong:'하류만 막으면 고인 물이 생활길로 넘칠 수 있다.'},
    {title:'상류 거름틀',text:'거름틀에 모래와 낙엽이 뭉쳐 있다. 가장자리로 넘친 물이 그 퇴적물을 다시 아래로 밀어낸다.',yes:'넘침과 퇴적물 재유입 대조',no:'거름틀을 곧바로 들어올리기',result:'이 배수홈에서 퇴적물이 다시 흘러드는 지점을 찾았다. 먼저 아래쪽 침전 받이로 유입을 분리하자.',wrong:'그대로 열면 모래와 잎이 한꺼번에 아래로 쏟아진다.'},
    {title:'',text:'',yes:'',no:'',result:'',wrong:''},
    {title:'분리해 둔 거름틀',text:'물은 옆 침전 받이로 흐르고 있다. 거름틀의 모래와 낙엽을 어떻게 옮길까?',yes:'퇴적물을 물 밖 수거함에 담기',no:'아래 물길로 밀어내기',result:'모래와 낙엽을 물 밖 수거함으로 옮겼다. 거름틀을 다시 끼우고 아래 받이에서 정상 흐름을 돌릴 수 있다.',wrong:'아래로 밀면 같은 재유입이 계속된다. 물 밖 수거함으로 옮기자.'},
    {title:'침전 받이의 복귀 홈통',text:'거름틀은 비었고 퇴적물은 수거함에 있다. 기존 정상 배수홈으로 어떻게 돌릴까?',yes:'거름틀을 두고 정상 홈통으로 복귀',no:'침전물을 함께 쏟아 복귀',result:'거름틀을 유지한 채 홈통을 정상 방향으로 돌렸다. 침전물은 물 밖에 남고 배수홈을 따라 물이 다시 이어진다. 42번도로 하류로 직접 돌아가자.',wrong:'침전물까지 쏟으면 작업 전과 같아진다. 모아 둔 것은 물 밖에 남겨 두자.'},
    {title:'42번도로 하류 재방문',text:'관측 웅덩이로 이어지는 흐름이 남아 있고, 앞서 떠내려오던 잎과 모래가 줄어 있다.',yes:'상류 조치 뒤 하류 흐름 확인',no:'성도 모든 수로가 복구됐다고 기록',result:'상류 거름틀 조치와 이 하류 지점의 결과를 함께 남겼다. 작은 배수 구간의 재유입이 줄었고 일반 산물길은 그대로 열린다.',wrong:'확인한 것은 이 배수홈과 관측 지점뿐이다. 다른 오염원은 따로 추적해야 한다.'},
  ][i];
  g.say(scenes.title,[scenes.text],undefined,[{label:scenes.yes,action:()=>finish(scenes.result)},{label:scenes.no,action:()=>{if(active())g.say('아래 흐름도 지키자',[scenes.wrong]);}},{label:'나중에 이어가기',action:()=>{}}]);return true;
}
