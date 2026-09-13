import type {Engine} from './engine';
import {SPECIES} from './pokemon';

export const RAGE_RELIEF_EVENTS={parts:'rageLakeHomeReedTable',intake:'rageReliefIntake',basin:'rageReliefBasin',bell:'rageReliefBell',signal:'rageLakeLookout',resident:'tourHost'} as const;
export const RAGE_RELIEF_STAGES=['nexusRageReliefParts','nexusRageReliefChannel','nexusRageReliefWater','nexusRageReliefBell','nexusRageReliefSignal','nexusRageReliefReceived','nexusRageReliefReady'] as const;
const sessions=new WeakMap<Engine,object>();
export function handleRageLakeRelief(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save,map=save.map;
  const events=[RAGE_RELIEF_EVENTS.parts,RAGE_RELIEF_EVENTS.intake,RAGE_RELIEF_EVENTS.basin,RAGE_RELIEF_EVENTS.bell,RAGE_RELIEF_EVENTS.signal,RAGE_RELIEF_EVENTS.bell,RAGE_RELIEF_EVENTS.resident];
  const matches=(i:number)=>event===events[i]&&map===(i===0||i===6?'tour_rage_lake_home1':'tour_rage_lake');
  if(!events.some((_,i)=>matches(i)))return false;
  const fixture=[RAGE_RELIEF_EVENTS.intake,RAGE_RELIEF_EVENTS.basin,RAGE_RELIEF_EVENTS.bell].some(e=>event===e);
  if(!save.flags.nexusRageAlternativesNeeded){if(!fixture)return false;g.say('호숫가 작업자리',['둑 가장자리의 비어 있는 받침이다. 먼저 주민과 생활 설비의 상태를 살펴보자.']);return true;}
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusRageAlternativesNeeded);
  const normal=()=>{if(active()){sessions.delete(g);ordinary();}};
  const pending=()=>RAGE_RELIEF_STAGES.findIndex(f=>!save.flags[f]);
  const next=()=>{if(!active())return;const i=pending();if(i>=0)g.setTourDestination(i===0||i===6?'tour_rage_lake_home1':'tour_rage_lake',events[i]);};
  const i=pending();
  if(i<0){g.say('호숫가 생활 설비',['분리 홈통의 물이 주민 받이에 닿고, 독립 경보의 수신 표식도 남아 있다.','주민: 지금 설비를 건드리지 않고도 물과 알림을 받을 방법이 생겼어요. 이안과 다음 조치를 의논해 주세요.'],undefined,[{label:'평소 이야기와 관찰',action:normal},{label:'안내를 마친다',action:()=>{}}]);return true;}
  if(!matches(i)){
    const done=events.some((e,j)=>j<i&&matches(j));
    g.say('호숫가 작업',[done?'앞서 마련한 부품과 장치는 제자리에 있다. 남은 현장의 결과까지 확인하자.':'앞 작업을 마친 뒤 이 자리에서 이어가자.'],undefined,[{label:'다음 작업 자리로',action:next},{label:'평소 이야기와 관찰',action:normal},{label:'나중에 하기',action:()=>{}}]);return true;
  }
  const finish=(text:string,valid:()=>boolean=active)=>{if(!valid()||pending()!==i)return;g.say('호숫가 작업',[text],()=>{if(!valid()||pending()!==i)return;save.flags[RAGE_RELIEF_STAGES[i]]=true;g.persist();next();});};
  if(i===0){
    const choose=(page=0)=>{
    if(!active())return;
    g.say('갈대 손질 작업대',['주민이 짧은 홈통과 받침, 수동 종과 접이식 신호판을 내어 주었다. 긴 통을 한꺼번에 들지 말고 동료와 나누어 준비하자.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name}와 준비`,action:()=>{
        const valid=()=>active()&&save.party.includes(mon)&&mon.hp>0;
        if(!valid()){if(active())g.say('동료의 상태',['건강한 동료와 함께 작업하자. 호수 센터에서 쉬어 갈 수 있다.'],undefined,[{label:'호수 센터로',action:()=>{if(active())g.setTourDestination('tour_rage_lake_center','tourHost');}},{label:'다른 동료',action:()=>choose(page)}]);return;}
        const support=SPECIES[mon.species].types.some(t=>['격투','바위','땅'].includes(t));
        g.say('작업 나누기',[support?'동료가 낮은 받침을 지키고 사람이 홈통을 얹으면 흔들리지 않겠다.':'사람이 작은 부품을 나르는 동안 동료가 갈림길에서 떨어진 부품을 지켜 주면 좋겠다.'],undefined,[
          {label:support?'받침을 지키며 나누어 준비':'작은 부품으로 나누어 준비',action:()=>finish('짧은 홈통과 받침, 독립 경보 부품을 나누어 준비했다. 수위 표석 남동쪽 둑의 분기 받침으로 가자.',valid)},
          {label:'한 번에 전부 싣기',action:()=>{if(valid())g.say('서두르지 말자',['부품이 흔들려 동료가 다칠 수 있다. 작은 묶음으로 나누자.']);}},
        ]);
      }})),...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),{label:'평소 작업대 살피기',action:normal},{label:'나중에 하기',action:()=>{}},
    ]);};choose();return true;
  }
  const actions=[
    {title:'',question:'',yes:'',no:'',result:'',wrong:''},
    {title:'분리 취수 분기',question:'생활 공급을 유지한 채 둑의 빈 받침을 따라 짧은 홈통을 이을 자리다.',yes:'기존 공급을 두고 별도 홈통 잇기',no:'기존 관을 빼서 홈통에 연결',result:'기존 공급은 남겨 두고 서안의 빈 둑 받침을 따라 남쪽 받이까지 홈통을 이었다. 아직 통수하지 않았다.',wrong:'기존 관을 빼면 주민의 물 공급이 끊긴다. 분리된 비교 받이 쪽에서 이어야 한다.'},
    {title:'주민 취수 받이',question:'홈통 끝의 받이가 기울어 있다. 물이 생활길에 넘치지 않게 받침부터 맞추자.',yes:'받침 수평을 맞추고 소량 통수',no:'기울어진 채 물을 한꺼번에 보내기',result:'받침을 맞추고 소량을 흘렸다. 분리 홈통을 따라 물이 남쪽 주민 받이에 모인다. 주민이 동료 그릇에 쓸 물을 여기서 받을 수 있다.',wrong:'물이 보행로로 넘칠 수 있다. 받침을 맞춘 뒤 작은 흐름으로 확인하자.'},
    {title:'낮은 둑의 독립 경보',question:'송신기 전원에 의존하지 않는 수동 종과 접이식 신호판이다. 물가에서 볼 수 있게 두자.',yes:'수동 종과 높은 신호판 고정',no:'기존 송신기 선에 함께 연결',result:'낮은 둑 받침에 수동 종과 신호판을 고정했다. 전원이 아니라 사람이 전달하는 독립 경보다. 동쪽 전망대에서 시험 신호를 보내자.',wrong:'같은 송신기 선을 쓰면 함께 끊긴다. 수동 장치를 따로 사용하자.'},
    {title:'동쪽 전망대의 전달 시험',question:'건너편 낮은 둑의 주민이 신호판을 보고 있다. 정상 경보는 그대로 두고 시험 신호를 보내자.',yes:'접이식 신호판으로 시험 전달',no:'정상 경보를 꺼서 시험',result:'전망대에서 시험 신호판을 펼쳤다. 낮은 둑에서 주민이 수동 종을 울리고 응답 표식을 올렸다. 직접 건너가 물가에서도 표시를 읽을 수 있는지 확인하자.',wrong:'정상 경보를 끌 필요는 없다. 독립된 신호판으로 전달하자.'},
    {title:'낮은 물가 수신 확인',question:'주민의 응답 표식이 종 옆에 올라왔다. 물가 높이에서 가려지는지 확인하자.',yes:'낮은 물가에서 응답 표식 확인',no:'전망대 결과만으로 끝내기',result:'낮은 물가에서도 높은 신호판과 응답 표식이 보인다. 주민이 송신기와 별개로 종을 움직일 수 있는 것도 확인했다. 집으로 돌아가 물과 경보 결과를 함께 전하자.',wrong:'전망대에서 보이는 것만으로 물가의 전달을 알 수 없다. 여기서 표식을 확인하자.'},
    {title:'주민과 준비 결과',question:'주민: 남쪽 받이에서 물을 받고, 낮은 둑에서 신호를 받아 보았어요. 이안: 두 결과를 함께 남기자.',yes:'물 공급과 독립 경보 준비를 전달',no:'송신기를 바로 끈다',result:'주민과 이안이 분리 취수와 독립 경보의 준비 결과를 확인했다. 현재 송신기는 그대로이며 황토 현장의 다음 조치는 아직 남아 있다.',wrong:'송신 정지는 황토 현장에서 다뤄야 한다. 여기서는 생활 대안의 준비 결과를 전하자.'},
  ][i];
  g.say(actions.title,[actions.question],undefined,[{label:actions.yes,action:()=>finish(actions.result)},{label:actions.no,action:()=>{if(active())g.say('생활을 지키는 작업',[actions.wrong]);}},{label:'나중에 하기',action:()=>{}}]);return true;
}
