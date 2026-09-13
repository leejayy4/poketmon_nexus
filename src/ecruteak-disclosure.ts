import type {Engine} from './engine';
import {MAHOGANY_POWER_MAP,MAHOGANY_POWER_NPC,MAHOGANY_POWER_FLAGS} from './mahogany-power';
export const ECRUTEAK_DISCLOSURE_STAGES=['nexusEcruteakIanAdmitted','nexusEcruteakOriginalsPublic','nexusEcruteakResidentsDemanded','nexusEcruteakEugeneReflected'] as const;
export const ECRUTEAK_DISCLOSURE_EVENTS={ian:'ecruteakDisclosureIan',originals:'ecruteakDisclosureOriginals',resident:'ecruteakDisclosureResident',eugene:'ecruteakDisclosureEugene'} as const;
const sites=[['tour_ecruteak_hall_2f',ECRUTEAK_DISCLOSURE_EVENTS.ian],['tour_ecruteak_hall_2f',ECRUTEAK_DISCLOSURE_EVENTS.originals],['tour_ecruteak_hall',ECRUTEAK_DISCLOSURE_EVENTS.resident],['tour_ecruteak_hall_3f',ECRUTEAK_DISCLOSURE_EVENTS.eugene]] as const;
const sessions=new WeakMap<Engine,object>();
export function handleEcruteakDisclosure(g:Engine,event:string):boolean{
  const save=g.save,map=save.map,index=sites.findIndex(([m,e])=>m===map&&e===event);if(index<0)return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const guide=(target:Parameters<Engine['setTourDestination']>[0],e:string)=>()=>{if(active())g.setTourDestination(target,e);};
  const next=()=>{const i=ECRUTEAK_DISCLOSURE_STAGES.findIndex(f=>!save.flags[f]);if(i>=0)guide(sites[i][0],sites[i][1])();else travel();};
  if(!save.flags.nexusRageResidentsResumed){g.say('전승시설의 방문자',['오래된 기록과 주민이 남긴 말을 함께 보관하는 곳이다. 공개 전시와 계단은 자유롭게 살펴볼 수 있다.']);return true;}
  if(index>0&&!save.flags[ECRUTEAK_DISCLOSURE_STAGES[index-1]]){g.say('함께 공개할 기록',['앞 자리에서 남긴 설명과 원본을 먼저 대조하자.'],undefined,[{label:'앞 자리로',action:next},{label:'나중에 살핀다',action:()=>{}}]);return true;}
  const commit=(pages:string[])=>{if(!active())return;g.say('전승시설에서',pages,()=>{if(!active()||!save.flags.nexusRageResidentsResumed||index>0&&!save.flags[ECRUTEAK_DISCLOSURE_STAGES[index-1]])return;if(!save.flags[ECRUTEAK_DISCLOSURE_STAGES[index]]){save.flags[ECRUTEAK_DISCLOSURE_STAGES[index]]=true;g.persist();}next();});};
  const travel=()=>{if(!active())return;g.say('다음 현장을 살필 길',['유진: 전력이 어디로 가는지, 산길의 열기가 어느 우회를 막는지, 상류 물에 무엇이 섞이는지는 서로 다른 문제야. 같은 숫자로 묶지 말자.','황토 안내소에서는 주민이 돌아갈 길을 비추는 예비 전원을 살펴보자. 동쪽 42번도로를 따라 황토마을로 가면 돼. 산길과 상류의 원인은 각 현장에서 따로 확인하자.'],undefined,[
    {label:save.flags[MAHOGANY_POWER_FLAGS.done]?'42번도로 너머 황토 주민 재방문':'42번도로 너머 황토 안내소 전력 현장',action:guide(MAHOGANY_POWER_MAP,MAHOGANY_POWER_NPC)},
    {label:'서문 38번도로 방향',action:guide('tour_johto_route_38','tourRoute38EcruteakStone')},
    {label:'42번도로 절구산 분기',action:guide('tour_johto_route_42','tourRoute42MortarBoard')},
    {label:'42번도로 산물길 난간',action:guide('tour_johto_route_42','tourRoute42WaterRail')},
    {label:'나중에 출발한다',action:()=>{}},
  ]);};
  if(save.flags[ECRUTEAK_DISCLOSURE_STAGES[index]]){
    const recap=['이안: 서명한 설명과 빠진 생활 기록은 공개대에 함께 남겼어. 내 이름을 지우지 않을 거야.','서명된 설명 옆에 주민의 원래 기록과 누락 부분이 나란히 펼쳐져 있다.','주민: 공개했다고 바로 용서하는 건 아니에요. 현장에 돌아와 듣고, 복구할 때도 함께해 주세요.','유진: 구조 체계가 필요하다는 생각은 같아. 하지만 도움을 받는 사람의 말을 빼면, 무엇을 지키는 체계인지 알 수 없겠어.'];
    g.say('남겨 둔 약속',[recap[index]],undefined,[{label:save.flags[ECRUTEAK_DISCLOSURE_STAGES[3]]?'실제 연결된 길 살피기':'다음 이야기 자리',action:save.flags[ECRUTEAK_DISCLOSURE_STAGES[3]]?travel:next},{label:'이야기를 마친다',action:()=>{}}]);return true;
  }
  const scenes=[
    {speaker:'이안',pages:['이안: 주민들은 내가 서명한 설명을 믿었어. 물이 언제 필요한지, 경보가 어디에서 안 보이는지 말했는데 나는 평균 수치만 옮겼지.','보고서가 틀린 게 아니라, 내가 듣지 않은 말이 있었어. 원본과 내 서명을 같이 공개할게.'],yes:'서명과 생활 기록을 함께 펼치기',result:['이안이 서명된 설명을 꺼내 공개대에 놓았다. 옆 자리에서 주민의 원래 기록과 대조할 수 있다.']},
    {speaker:'생활 기록 공개대',pages:['서명된 설명에는 공급의 평균과 경보 범위만 적혀 있다. 주민의 기록에는 물 받는 시각, 낮은 둑의 시야, 동료가 쉬는 자리가 남아 있다.','빠진 말을 공개할 때 어떻게 놓을까?'],yes:'서명본 옆에 누락 없는 원본 펼치기',result:['서명본을 덮어쓰지 않고 주민의 원본을 옆에 펼쳤다. 빠진 생활 기록에 표시를 붙여 누구나 두 문서를 대조할 수 있게 했다.']},
    {speaker:'전승시설을 돌보는 주민',pages:['잃은 것을 그리워하는 마음은 알아요. 그렇다고 지금 살아가는 사람과 포켓몬의 말을 지워도 되는 건 아니죠.','오늘 공개한 건 시작이에요. 바로 용서해 달라는 말보다, 원본을 남기고 다음 복구 현장에도 함께 와 주세요.'],yes:'원본 보존과 복구 참여 요구 듣기',result:['이안: 원본은 여기 남기겠습니다. 다음 현장에서는 결론부터 쓰지 않고 주민의 말부터 듣겠습니다.','주민은 용서를 선언하지 않았다. 공개와 지속적인 복구 참여를 요구했다.']},
    {speaker:'유진',pages:['유진: 강한 구조 체계라면 같은 피해를 막을 수 있다고 생각했어. 호수에서도 물과 경보는 필요했지.','그런데 필요한 기능이 있다는 이유로 그 사람들의 말을 빼 버리면 안 되겠어. 누가 어디에서 도움을 받는지 현장에서 함께 확인해야 해.'],yes:'서로 다른 현장을 나누어 살피기로',result:['유진과 이안은 전력의 경로, 산길의 열기와 우회, 상류 물을 각각 살필 문제로 나누었다. 아직 어느 원인도 해결했다고 적지 않았다.']},
  ][index];
  g.say(scenes.speaker,scenes.pages,undefined,[{label:scenes.yes,action:()=>commit(scenes.result)},...(index===1?[{label:'서명을 지우고 요약본만 남기기',action:()=>{if(active())g.say('원본을 남기자',['이안: 내 설명이 무엇을 빠뜨렸는지 볼 수 있어야 해. 서명도 원본도 지우지 말자.']);}}]:[]),{label:'나중에 이어가기',action:()=>{}}]);return true;
}
