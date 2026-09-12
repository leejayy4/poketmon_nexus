import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { TOUR_OUTDOORS } from './explore-world';
import { ETERNA_BORDER_NAME } from './eterna-city-layout';

const PARTNER='eternaSurveyPartner';
const SLOT='eternaSurveyPartnerSlot';
const STATUE='eternaSurveyStatue',BORDER='eternaSurveyBorder';
const FINISHED='eternaSurveyCompared';

/** An optional walking survey: evidence comes from inspecting real outdoor props. */
export function handleEternaHistory(g:Engine,event:string):boolean{
  const s=g.save,city=s.map==='tour_eterna',hall=s.map==='tour_eterna_hall';
  if(!city&&!hall)return false;
  const object=city?TOUR_OUTDOORS.tour_eterna.objects.find(o=>o.event===event):undefined;
  if(object&&(object.name==='오래된 석상'||object.name===ETERNA_BORDER_NAME)){
    const slot=s.flags[SLOT],mon=typeof slot==='number'?s.party[slot]:undefined;
    if(!mon||mon.species!==s.flags[PARTNER]){
      if(s.flags[PARTNER]===undefined)return false;
      g.say('답사 수첩',[...object.pages,'파티 편성이 바뀌어 답사 동료를 찾지 못했다.\n역사관에서 동료를 다시 고르자.','이미 살펴본 장소의 기록은 남아 있다.']);return true;
    }
    if(mon.hp<=0){g.say('답사 수첩',['함께 답사할 동료가 지쳐 있다.\n센터에서 쉬고 다시 살펴보자.']);return true;}
    const statue=object.name==='오래된 석상',key=statue?STATUE:BORDER;
    const pages=[...object.pages,`${SPECIES[mon.species].name}와 함께\n주변을 천천히 살펴보았다.`,
      statue?'관찰 기록: 돌받침 가장자리의 이끼.\n사람이 걷는 길은 석상을 돌아간다.':'관찰 기록: 돌담 바깥의 나무 뿌리.\n돌담 옆으로 작은 길과 수로가 이어진다.'];
    g.say(object.name,pages,()=>{
      if(g.save!==s||s.map!=='tour_eterna'||s.flags[SLOT]!==slot||s.party[slot as number]!==mon||mon.hp<=0||s.flags[PARTNER]!==mon.species)return;
      s.flags[key]=true;g.persist();g.audio.play('confirm');
      g.say('답사 수첩',[s.flags[STATUE]&&s.flags[BORDER]?'두 장소를 기록했다.\n역사관의 옛 지도와 비교해 보자.':'수첩에 관찰한 모습을 그렸다.\n다른 답사 지점도 찾아보자.']);
    });return true;
  }
  if(!hall||!['tourHost','tourExhibit1'].includes(event))return false;
  const current=()=>g.save===s&&s.map==='tour_eterna_hall'&&!g.battle;
  const menu=()=>{
    if(!current())return;
    const slot=s.flags[SLOT],partner=typeof slot==='number'?s.party[slot]:undefined;
    const partnerText=partner&&partner.species===s.flags[PARTNER]?`답사 동료: ${SPECIES[partner.species].name}`:s.flags[PARTNER]===undefined?'답사 동료를 먼저 골라 주세요.':'파티가 바뀌었네요. 동료를 다시 골라 주세요.';
    g.say('역사관 답사 책상',['옛 지도와 지금의 영원을 비교해 보세요.\n동료와 석상·숲 경계를 돌아보는 답사예요.',
      partnerText,
      `석상 ${s.flags[STATUE]?'기록함':'미기록'} · 숲 경계 ${s.flags[BORDER]?'기록함':'미기록'}\n${s.flags[FINISHED]?'지난 비교 기록도 다시 볼 수 있어요.':'기록은 두 장소에서 직접 조사해 주세요.'}`],undefined,[
      {label:'답사 동료 고르기',action:()=>choose(0)},
      {label:'옛 지도와 비교',action:compare},
      {label:'답사 위치 확인',action:()=>{if(current())g.say('옛 도시 지도',['석상: 도시 중앙, 주택가 위쪽 광장.\n돌담: 역사관 동쪽 숲 아래 산책길.','수로 둘레의 산책길로 돌아올 수 있어요.\n역사관 밖에서 사물을 정면 조사하세요.'],menu);}},
      {label:'책상에서 일어나기',action:()=>{}}
    ]);
  };
  const choose=(page:number)=>{
    if(!current())return;
    if(!s.party.length){g.say('역사관 안내원',['함께 걸을 동료를 데리고 와 주세요.'],menu);return;}
    g.say('답사 동료',['함께 주변을 살펴볼 동료를 골라 주세요.'],undefined,[
      ...s.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current()||!s.party.includes(mon))return;
        if(mon.hp<=0){g.say('역사관 안내원',['이 동료는 센터에서 쉬어야겠어요.'],()=>choose(page));return;}
        s.flags[PARTNER]=mon.species;s.flags[SLOT]=s.party.indexOf(mon);g.persist();
        g.say('답사 수첩',[`${SPECIES[mon.species].name}와 답사하기로 했다.\n석상과 동쪽 돌담을 살펴보자.`,
          '기록한 장소는 동료를 바꿔도 남아요.\n배틀이나 배지의 필수 조건은 아니에요.'],menu);
      }})),
      ...(s.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(page?0:1)}]:[]),
      {label:'돌아가기',action:menu}
    ]);
  };
  function compare(){
    if(!current())return;
    if(!s.flags[STATUE]||!s.flags[BORDER]){g.say('역사관 안내원',['먼저 석상과 숲 경계를 직접 살펴보세요.\n동료를 골랐다면 밖으로 나가도 돼요.'],menu);return;}
    g.say('옛 도시 지도',['석상 주변의 길, 숲을 따라 굽은 돌담.\n답사 수첩을 지도 옆에 펼쳤다.','두 장소에서 공통으로 본 것은 무엇일까?'],undefined,[
      {label:'자연을 남겨 둔 길',action:()=>{
        if(!current())return;
        s.flags[FINISHED]=true;g.persist();g.audio.play('confirm');
        g.say('역사관 안내원',['석상의 이끼와 돌담의 나무 뿌리를\n피해 사람들이 길을 내며 살아왔군요.','지금 동료와 걸은 길도 그 일부예요.\n옛 지도에는 없던 오늘의 여행이지요.','숲에서 만난 동료를 돌보며 여행하세요.\n센터와 유채의 정원도 들러 보세요.'],menu);
      }},
      {label:'두 장소가 같은 건물',action:()=>{if(current())g.say('역사관 안내원',['석상은 광장, 돌담은 숲 경계에 있어요.\n모양보다 주변의 길과 식물을 비교해 봐요.'],compare);}},
      {label:'나중에 비교하기',action:menu}
    ]);
  }
  menu();return true;
}
