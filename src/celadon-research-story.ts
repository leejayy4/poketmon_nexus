import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { KANTO_ROUTE_SEVEN } from './kanto-saffron-approach';

const STARTED='celadonResearchContactStarted';
const FIELD='celadonResearchRoute7Logged';
const COMPARED='celadonResearchSilphCompared';
const RETURNED='celadonResearchReturned';

const active=(g:Engine,save:Engine['save'],map:string)=>g.save===save&&save.map===map&&!g.battle;
const destination=(g:Engine,map:Parameters<Engine['setTourDestination']>[0],title:string,pages:string[])=>{
  g.setTourDestination(map);g.say(title,[...pages,'지도에 목적지를 표시했다. 실제 도로와 출구를 따라 이동하자.']);
};

/** A four-state Celadon contact scene that prepares, but does not complete, the adopted Kanto incident. */
export function handleCeladonResearchStory(g:Engine,event:string):boolean{
  const save=g.save,started=Boolean(save.flags[STARTED]),field=Boolean(save.flags[FIELD]),compared=Boolean(save.flags[COMPARED]),returned=Boolean(save.flags[RETURNED]);
  const route7Owned=[...save.party,...(save.box??[])].filter(mon=>mon.met==='관동 7번도로');
  const names=[...new Set(route7Owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,4).join('·')||'없음';

  if(event==='celadonDepartmentResearchLink'&&save.map==='tour_celadon_hall_3f'){
    const status=`연락 ${started?'개시':'대기'} · 7번도로 현장 ${field?'기록':'미기록'} · 실프 공개 기록 ${compared?'비교':'미비교'} · 무지개 귀환 ${returned?'정리':'미정리'}`;
    if(returned){
      g.say('하린–무지개 연구 연락대',[status,'하린과 무지개 연구진은 7번도로의 생활 반응과 노랑 실프 공개 기록에서 같은 관리 표식을 확인했다.','공개 안전 장치만으로는 표식의 용도를 단정할 수 없어 해석을 보류했다. 홍련의 비공개 설비와 대조할 원본을 남겨 두었다.','연락 기록은 보상·배지·통행 조건이 아니며 관동 본편 사건 완료도 아니다.'],undefined,[
        {label:'7번도로 기록 다시 보기',action:()=>{if(active(g,save,'tour_celadon_hall_3f'))destination(g,KANTO_ROUTE_SEVEN,'7번도로 현장 기록',['무지개 동쪽 정원 경계의 현장 기록대로 돌아간다.']);}},
        {label:'실프 공개 기록 다시 보기',action:()=>{if(active(g,save,'tour_celadon_hall_3f'))destination(g,'tour_saffron_hall_2f','실프 공개 기록',['노랑 실프 사옥 2층의 동료 반응 관찰 기록으로 돌아간다.']);}},
        {label:'연락 기록을 닫는다',action:()=>{}},
      ]);return true;
    }
    if(compared){
      g.say('하린–무지개 연구 연락대',[status,'하린: “공개 기록의 표식이 현장 기록과 같아요. 하지만 이것만으로 위험한 제어 장치라고 단정하면 안 돼요.”','무지개 연구원: “확인한 사실과 아직 모르는 해석을 나눠 적죠. 홍련 설비와 비교할 수 있도록 원본을 보존하겠습니다.”'],undefined,[
        {label:'귀환 해석을 정리한다',action:()=>{if(!active(g,save,'tour_celadon_hall_3f')||save.flags[RETURNED])return;save.flags[RETURNED]=true;g.persist();g.say('무지개 연구 연락 기록',['7번도로 생활 반응과 실프 공개 장치 기록을 한 묶음으로 보존했다.','같은 표식의 의미는 홍련 비공개 설비를 확인할 때까지 보류했다.','관동 사건 완료나 보상은 발생하지 않았다.']);}},
        {label:'실프 기록을 다시 본다',action:()=>{if(active(g,save,'tour_celadon_hall_3f'))destination(g,'tour_saffron_hall_2f','실프 공개 기록',['노랑 실프 사옥 2층에서 비교한 공개 기록을 다시 볼 수 있다.']);}},
        {label:'나중에 정리한다',action:()=>{}},
      ]);return true;
    }
    if(started){
      g.say('하린–무지개 연구 연락대',[status,field?'하린: “7번도로 현장 기록이 도착했어요. 이제 노랑 실프의 공개 동료 반응 기록과 대조해 주세요.”':'하린: “먼저 7번도로 정원 경계에서 사람과 포켓몬이 쉬는 환경을 그대로 기록해 주세요.”',`7번도로 출신 보유 ${route7Owned.length}마리 · ${names}`,'현지 포켓몬을 포획하거나 트레이너에게 승리할 필요는 없다.'],undefined,[
        {label:field?'노랑 실프 공개층':'7번도로 현장',action:()=>{if(!active(g,save,'tour_celadon_hall_3f'))return;destination(g,field?'tour_saffron_hall_2f':KANTO_ROUTE_SEVEN,field?'실프 공개 기록 비교':'7번도로 현장 기록',[field?'7번도로를 건너 노랑 실프 사옥 2층의 공개 기록을 확인한다.':'동쪽 7번도로 정원 경계의 기록대를 확인한다.']);}},
        {label:'현재 파티 확인',action:()=>{if(!active(g,save,'tour_celadon_hall_3f'))return;g.panel='party';g.partyIndex=0;}},
        {label:'연락을 닫는다',action:()=>{}},
      ]);return true;
    }
    g.say('하린–무지개 연구 연락대',[status,'무지개 연구진이 도시 정원과 7번도로의 생활 반응을 노랑 실프 공개 안전 기록과 비교하려 한다.','하린은 빠른 결론보다 쉬어야 하는 포켓몬의 상태와 확인한 원본을 먼저 남기자고 한다.','이 연락은 채택된 관동 이야기의 준비 동선이며 포획·승리·보상 조건은 없다.'],undefined,[
      {label:'연락을 시작한다',action:()=>{if(!active(g,save,'tour_celadon_hall_3f')||save.flags[STARTED])return;save.flags[STARTED]=true;g.persist();g.say('하린의 연락',['“먼저 7번도로 정원 경계의 생활 반응을 기록해 주세요. 포켓몬을 억지로 붙잡거나 싸울 필요는 없어요.”','연락을 시작했다. 동쪽 7번도로 현장 기록대로 갈 수 있다.'],()=>{if(active(g,save,'tour_celadon_hall_3f'))g.setTourDestination(KANTO_ROUTE_SEVEN);});}},
      {label:'7번도로 위치 확인',action:()=>{if(active(g,save,'tour_celadon_hall_3f'))destination(g,KANTO_ROUTE_SEVEN,'7번도로 안내',['백화점에서 내려가 동쪽 향기정원을 지나면 7번도로다.']);}},
      {label:'나중에 연락한다',action:()=>{}},
    ]);return true;
  }

  if(event==='celadonResearchRoute7Field'&&save.map===KANTO_ROUTE_SEVEN){
    if(!started){g.say('7번도로 생활 반응 기록대',['무지개 정원 경계의 빛·향기·그늘과 사람·포켓몬의 휴식 반응을 적는 공개 기록대다.','백화점3층 연구 연락을 시작하면 하린과 무지개 연구진에게 이 현장 기록을 연결할 수 있다.','조사만으로 포획·배틀·보상·통행 상태는 바뀌지 않는다.']);return true;}
    if(field){g.say('7번도로 생활 반응 기록대',['이미 빛·향기·그늘과 동료 휴식 반응을 기록했다.',`7번도로 출신 보유 ${route7Owned.length}마리 · ${names}`,'다음 비교 장소는 동쪽 노랑시티 실프 사옥 2층의 공개 동료 반응 기록이다.'],undefined,[{label:'노랑 실프 공개층',action:()=>{if(active(g,save,KANTO_ROUTE_SEVEN))destination(g,'tour_saffron_hall_2f','실프 공개 기록 비교',['7번도로 동쪽 노랑시티의 실프 사옥 2층으로 향한다.']);}},{label:'기록을 닫는다',action:()=>{}}]);return true;}
    g.say('7번도로 생활 반응 기록대',['하린의 요청대로 정원 경계의 빛·향기·그늘과 사람·포켓몬의 휴식 반응을 살핀다.',`현재 7번도로 출신 보유 ${route7Owned.length}마리 · ${names}`,'현지 동료가 없어도 환경 기록을 남길 수 있다.'],undefined,[
      {label:'현장 기록을 남긴다',action:()=>{if(!active(g,save,KANTO_ROUTE_SEVEN)||save.flags[FIELD])return;save.flags[FIELD]=true;g.persist();g.say('7번도로 현장 기록',['확인한 생활 환경과 동료 반응을 원본 그대로 저장했다.','포획·트레이너 승리·보상 기록은 요구하지 않았다.','다음은 노랑 실프 사옥 2층의 공개 동료 반응 기록이다.'],()=>{if(active(g,save,KANTO_ROUTE_SEVEN))g.setTourDestination('tour_saffron_hall_2f');});}},
      {label:'나중에 기록한다',action:()=>{}},
    ]);return true;
  }

  if(event==='saffronSilphObservationLog'&&save.map==='tour_saffron_hall_2f'&&started){
    if(!field){g.say('실프 동료 반응 관찰 기록',['공개 안전 장치의 빛·소리·진동에 대한 포켓몬 반응이 정리돼 있다.','먼저 무지개 쪽 7번도로 정원 경계에서 현장 생활 반응을 기록하면 같은 조건으로 비교할 수 있다.','공개 견학은 자유로우며 현장 기록이 통행 조건은 아니다.'],undefined,[{label:'7번도로 현장',action:()=>{if(active(g,save,'tour_saffron_hall_2f'))destination(g,KANTO_ROUTE_SEVEN,'7번도로 현장 기록',['7번도로 서쪽 무지개 정원 경계의 기록대로 돌아간다.']);}},{label:'공개 기록만 본다',action:()=>{}}]);return true;}
    if(compared){g.say('실프 동료 반응 관찰 기록',['7번도로 현장 기록과 비교한 공개 원본이 그대로 보존돼 있다.','두 기록에서 같은 관리 표식이 확인됐지만 용도는 아직 단정하지 않았다.','무지개 백화점3층 연락대로 돌아가 확인한 사실과 보류한 해석을 나눠 정리하자.'],undefined,[{label:'무지개 연구 연락대',action:()=>{if(active(g,save,'tour_saffron_hall_2f'))destination(g,'tour_celadon_hall_3f','무지개 귀환 안내',['7번도로를 서쪽으로 건너 무지개 백화점3층으로 돌아간다.']);}},{label:'기록을 더 본다',action:()=>{}}]);return true;}
    g.say('실프 동료 반응 관찰 기록',['7번도로 현장 원본과 실프 공개 안전 장치 기록을 같은 화면에 놓았다.','빛·소리·진동의 관리 표식이 두 기록에 반복되지만 공개 자료만으로 용도를 단정할 수 없다.'],undefined,[
      {label:'공개 기록과 대조한다',action:()=>{if(!active(g,save,'tour_saffron_hall_2f')||save.flags[COMPARED])return;save.flags[COMPARED]=true;g.persist();g.say('실프 공개 기록 비교',['같은 관리 표식과 기록 시각을 확인했다. 공개 원본은 수정하지 않고 비교 결과만 남겼다.','하린과 무지개 연구진에게 돌아가 확인한 사실과 미확인 해석을 구분해야 한다.','사옥 사건·봉쇄 해결이나 보상은 발생하지 않았다.'],()=>{if(active(g,save,'tour_saffron_hall_2f'))g.setTourDestination('tour_celadon_hall_3f');});}},
      {label:'대조를 보류한다',action:()=>{}},
    ]);return true;
  }
  return false;
}
