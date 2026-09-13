import type {Engine} from './engine';
import {SPECIES} from './pokemon';
import {JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42} from './johto-route-42';
export const MORTAR_HEAT_STAGES=['nexusMortarCompanionReady','nexusMortarHeatCompared','nexusMortarNorthMarked','nexusMortarWestChecked','nexusMortarBypassShared'] as const;
export const MORTAR_HEAT_EVENTS=['journeyWalker','tourMortarEchoWall','mortarNorthBypassMarker','tourMortarWaterTrace','journeyWalker'] as const;
const sessions=new WeakMap<Engine,object>();
export function handleMortarHeat(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save,map=save.map;
  const route=map===JOHTO_ROUTE_42&&event==='tourRoute42MortarBoard';
  if(!save.flags.nexusEcruteakEugeneReflected||(!route&&(map!==JOHTO_MT_MORTAR_1F||!MORTAR_HEAT_EVENTS.some(e=>e===event))))return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusEcruteakEugeneReflected);
  const guide=(target:Parameters<Engine['setTourDestination']>[0],id:string)=>()=>{if(active())g.setTourDestination(target,id);};
  const normal=()=>{if(active()){sessions.delete(g);ordinary();}};
  const pending=()=>MORTAR_HEAT_STAGES.findIndex(f=>!save.flags[f]);
  const next=()=>{const i=pending();if(i>=0)guide(JOHTO_MT_MORTAR_1F,MORTAR_HEAT_EVENTS[i])();};
  if(route){g.say('절구산 분기',['산행객이 동쪽 암반에서 올라오는 열기와 짐을 나르는 길이 겹친다고 전했다. 북쪽 동굴 입구로 가서 기존 우회길을 함께 살펴보자.','42번도로 본선은 그대로 열려 있다.'],undefined,[{label:'절구산 산행객에게',action:guide(JOHTO_MT_MORTAR_1F,'journeyWalker')},{label:'평소 도로 안내',action:normal}]);return true;}
  const i=pending();
  if(i<0){g.say('남겨 둔 우회 안내',['산행객: 북쪽 횡단로와 서쪽 물길 옆 마른 길을 따라 짐을 옮길 수 있겠어. 동쪽 열기는 아직 남아 있어.','열기의 원인이나 앤테이와의 관계는 아직 밝혀지지 않았다. 물길 오염·전력 문제도 별도 조사다.'],undefined,[{label:'42번도로로',action:guide(JOHTO_ROUTE_42,'tourRoute42MortarBoard')},{label:'평소 탐험 이야기',action:normal}]);return true;}
  if(event!==MORTAR_HEAT_EVENTS[i]){g.say('산길 현장 순서',['동쪽 열기를 살핀 뒤 북쪽 길의 회전 지점, 서쪽 물길 가장자리, 남쪽 산행객 순서로 돌아보자.'],undefined,[{label:'다음 현장',action:next},{label:'평소 관찰',action:normal}]);return true;}
  const finish=(text:string,valid:()=>boolean=active)=>{if(!valid()||pending()!==i)return;g.say('산행객의 생활길',[text],()=>{if(!valid()||pending()!==i)return;save.flags[MORTAR_HEAT_STAGES[i]]=true;g.persist();next();});};
  if(i===0){const choose=(page=0)=>{if(!active())return;g.say('동료와 산길 준비',['한 번에 짐을 옮기지 않고, 동료와 열기가 올라오는 방향부터 살필 거야. 건강한 동료를 골라 보자.'],undefined,[
    ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name}와 살피기`,action:()=>{const valid=()=>active()&&save.party.includes(mon)&&mon.hp>0;if(!valid()){if(active())g.say('먼저 회복하자',['쓰러진 동료는 인주 센터에서 쉬게 하자.'],undefined,[{label:'인주 센터로',action:guide('tour_ecruteak_center','tourHost')},{label:'다른 동료',action:()=>choose(page)}]);return;}
      const wing=SPECIES[mon.species].types.includes('비행');g.say('역할 나누기',[wing?'동료가 안전한 자리에서 바람 방향에 반응하는 동안 사람이 표식 끈의 흔들림을 비교할 수 있다.':'동료가 짐 받침 곁을 지키는 동안 사람이 긴 표식 끈으로 바람 방향을 비교할 수 있다.'],undefined,[{label:wing?'바람 반응과 끈을 함께 비교':'받침을 지키며 끈으로 비교',action:()=>finish('동료와 안전한 거리에서 비교할 준비를 했다. 동쪽 메아리벽으로 가자.',valid)},{label:'동료를 열기 속에 먼저 보낸다',action:()=>{if(valid())g.say('무리하지 말자',['뜨거운 홈에 동료를 들여보낼 필요는 없다. 안전한 자리에서 비교하자.']);}}]);}})),
    ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),{label:'나중에 준비',action:()=>{}},
  ]);};choose();return true;}
  const scenes=[{title:'',text:'',yes:'',no:'',result:'',wrong:''},
    {title:'동쪽 온열 암반',text:'벽의 낮은 홈에서 올라오는 따뜻한 기류가 표식 끈을 밀어 올린다. 짐을 두는 바닥 쪽과 바람을 비교하자.',yes:'뜨거운 홈 밖에서 기류 비교',no:'물을 부어 열기를 바로 없애기',result:'홈 가까운 기류와 짐자리의 기류가 다르다. 열기를 없앴다고 단정하지 않고 북쪽 횡단로로 우회할 지점을 살펴보자.',wrong:'원인을 모른 채 물을 붓거나 물길을 바꾸지 말자. 안전한 거리에서 비교하자.'},
    {title:'북쪽 횡단로 회전 표식',text:'동쪽에서 온 길이 서쪽으로 꺾인다. 벽에 붙은 표식 받침은 짐을 나르는 길을 가리지 않는다.',yes:'북쪽에서 서쪽으로 꺾는 표식 고정',no:'지름길 중앙에 짐을 쌓아 막기',result:'벽의 기존 받침에 서쪽 방향 표식을 고정했다. 북쪽 횡단로를 따라 서쪽 물길 옆까지 직접 가 보자.',wrong:'일반 산행길은 막지 않는다. 벽의 받침에 표식을 남기자.'},
    {title:'서쪽 물길 옆 마른 길',text:'암반 홈의 물은 그대로 흐른다. 짐을 실은 사람이 남쪽 합류점까지 돌아갈 마른 가장자리를 고르자.',yes:'물길을 남기고 마른 가장자리 표시',no:'물길을 메워 넓은 지름길 만들기',result:'물길을 메우지 않고 서쪽 마른 길에서 남쪽 합류점으로 이어지는 표식을 남겼다. 산행객에게 돌아가 생활길을 전하자.',wrong:'물을 막으면 다른 생활길로 넘칠 수 있다. 기존 마른 가장자리를 사용하자.'},
    {title:'남쪽 합류점의 산행객',text:'산행객: 북쪽 회전 지점과 서쪽 물길 가장자리를 지나 여기까지 돌아왔구나. 짐을 옮길 때 어떻게 안내하면 되겠어?',yes:'열기를 피해 북쪽·서쪽 기존길 공유',no:'열기 원인을 해결했다고 알리기',result:'산행객이 짐 옆에 북쪽·서쪽 우회 안내를 펼쳤다. 기존 생활길은 유지되며 동쪽 열기의 원인 조사는 아직 남아 있다.',wrong:'안전한 우회를 살핀 것이지 열기의 원인을 없앤 것은 아니다.'},
  ][i];
  g.say(scenes.title,[scenes.text],undefined,[{label:scenes.yes,action:()=>finish(scenes.result)},{label:scenes.no,action:()=>{if(active())g.say('생활길을 남기자',[scenes.wrong]);}},{label:'나중에 이어가기',action:()=>{}}]);return true;
}
