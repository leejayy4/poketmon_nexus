import type { Engine } from './engine';
import type { Choice, Pokemon, SaveData } from './types';
import { SPECIES } from './pokemon';
import { oreburghRoarkMinePages } from './oreburgh-roark-story';

const MINE='tour_oreburgh_mine',HALL='tour_oreburgh_hall';
const F={
  species:'oreburghMinePartnerSpecies',party:'oreburghMinePartnerPartySlot',box:'oreburghMinePartnerBoxSlot',run:'oreburghMinePartnerRun',
  tracks:'oreburghMinePartnerTracks',space:'oreburghMinePartnerSpace',rail:'oreburghMinePartnerRailChecked',
  echo:'oreburghMinePartnerEcho',work:'oreburghMinePartnerWorkComplete',
  model:'oreburghMinePartnerModelCompared',ore:'oreburghMinePartnerOreCompared',tools:'oreburghMinePartnerToolsReviewed',
  returned:'oreburghMinePartnerHallReturned',revisited:'oreburghMinePartnerMineRevisited',
  lastSpecies:'oreburghMineHallRecordSpecies',lastReturned:'oreburghMineHallRecordComplete',
} as const;
const progress=[F.tracks,F.space,F.rail,F.echo,F.work,F.model,F.ore,F.tools,F.returned,F.revisited];
const nameOf=(mon:Pokemon)=>SPECIES[mon.species].name;
const recordedName=(value:boolean|number|undefined)=>typeof value==='number'?SPECIES[value]?.name:undefined;
const conversations=new WeakMap<Engine,object>();

/** Engine.confirm/cancel clears dialogue before invoking the selected action.
 * Consume the whole menu once, including cancel, and reject superseded menus. */
function say(g:Engine,speaker:string,pages:string[],after?:()=>void,choices?:Choice[]){
  const save=g.save,map=save.map,steps=save.steps,token={};let consumed=false;
  conversations.set(g,token);
  const once=(action:()=>void)=>()=>{
    if(consumed||conversations.get(g)!==token||g.save!==save||save.map!==map||save.steps!==steps||g.battle||g.transition||g.dialogue!==null)return;
    consumed=true;conversations.delete(g);action();
  };
  g.say(speaker,pages,after?once(after):undefined,choices?.map(choice=>({...choice,action:once(choice.action)})));
}

/** Slots are only restored after a roster edit by following the captured object.
 * A species-only legacy record is deliberately never assigned to a current mon. */
export function oreburghMinePartner(save:SaveData):Pokemon|undefined{
  const party=save.flags[F.party],box=save.flags[F.box];
  const mon=typeof party==='number'&&Number.isInteger(party)&&party>=0?save.party[party]
    :typeof box==='number'&&Number.isInteger(box)&&box>=0?save.box?.[box]:undefined;
  return mon?.species===save.flags[F.species]?mon:undefined;
}

export function trackOreburghMinePartner(save:SaveData):()=>void{
  const mon=oreburghMinePartner(save);
  if(!mon)return ()=>{};
  return ()=>{
    const party=save.party.indexOf(mon),box=save.box?.indexOf(mon)??-1;
    delete save.flags[F.party];delete save.flags[F.box];
    if(party>=0)save.flags[F.party]=party;
    else if(box>=0)save.flags[F.box]=box;
    // Keep completed notes even if a future roster operation removes the mon.
    if(party>=0||box>=0)save.flags[F.species]=mon.species;
  };
}

function companionStatus(save:SaveData):string{
  const mon=oreburghMinePartner(save);
  if(!mon){
    const old=recordedName(save.flags.oreburghMineWorkSpecies);
    return old&&save.flags.oreburghMineWorkComplete
      ? `${old}와 남긴 예전 레일·광맥 기록이 있어요. 새 관찰은 작업반장에게 함께할 동료를 골라 시작하세요.`
      :old&&save.flags.oreburghMineRailChecked
      ? `${old}와 레일을 살핀 예전 기록이 있어요. 새 관찰은 작업반장에게 동료를 고르면 시작할 수 있어요.`
      :'작업반장에게 함께할 동료를 고르면 레일과 광맥을 살펴볼 수 있어요.';
  }
  if(!save.party.includes(mon))return `${nameOf(mon)}는 지금 PC 박스에서 쉬고 있어요. 기록은 남아 있으니 같은 동료를 다시 데려오세요.`;
  if(mon.hp<=0)return `${nameOf(mon)}가 지쳐 있어요. 센터에서 쉬고 돌아오면 하던 곳부터 이어 갈 수 있어요.`;
  if(save.flags[F.revisited])return `${nameOf(mon)}와 탄갱을 살피고 전시관 기록을 정리한 뒤 작업반장에게 돌아왔어요.`;
  if(save.flags[F.returned])return `${nameOf(mon)}와 전시관에서 비교를 마쳤어요. 탄갱 작업반장에게 돌아가 이야기를 전해 주세요.`;
  if(save.flags[F.work])return `${nameOf(mon)}와 레일·광맥을 확인했어요. 도시 북동쪽 전시관의 모형·광석·도구를 비교해 보세요.`;
  if(save.flags[F.rail])return `${nameOf(mon)}와 레일의 폭을 확인했어요. 측면 광맥에서 울림을 비교해 보세요.`;
  return `${nameOf(mon)}와 운반 레일의 바퀴 자국과 비켜설 공간을 살펴보세요.`;
}

function ready(g:Engine,speaker:string):Pokemon|undefined{
  const mon=oreburghMinePartner(g.save);
  if(mon&&g.save.party.includes(mon)&&mon.hp>0)return mon;
  say(g,speaker,[companionStatus(g.save)]);return undefined;
}

function choose(g:Engine,page=0){
  const save=g.save,run=save.flags[F.run],current=()=>g.save===save&&save.map===MINE&&!g.battle&&!g.transition&&save.flags[F.run]===run;
  const choices=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0);
  if(!choices.length){say(g,'무쇠탄갱 작업반장',['센터에서 동료를 회복하고 돌아오세요. 함께 걷던 기록은 그대로 둘게요.']);return;}
  const chooseMon=(mon:Pokemon)=>{
    if(!current()||!save.party.includes(mon)||mon.hp<=0)return;
    if(oreburghMinePartner(save)===mon){say(g,'무쇠탄갱 작업반장',[companionStatus(save)]);return;}
    const start=()=>{
      if(!current()||!save.party.includes(mon)||mon.hp<=0)return;
      save.flags[F.run]=typeof run==='number'?run+1:1;
      save.flags[F.species]=mon.species;save.flags[F.party]=save.party.indexOf(mon);delete save.flags[F.box];
      for(const key of progress)delete save.flags[key];
      g.persist();say(g,'무쇠탄갱 작업반장',[`${nameOf(mon)}와 작업로를 살펴보기로 했어요.`,
        '먼저 운반 레일에서 광차 바퀴 자국과 비켜설 공간을 확인하세요.']);
    };
    if(save.flags[F.species]&&progress.some(key=>save.flags[key])){
      say(g,'동료 바꾸기',['새 동료와는 레일부터 다시 살펴봐요. 지금 진행 중인 관찰은 새로 시작하며, 이미 남긴 탄갱·전시관 완료 기록은 보관해요.'],undefined,[
        {label:'새 동료로 시작',action:start},{label:'지금 동료와 계속',action:()=>{if(current())say(g,'무쇠탄갱 작업반장',[companionStatus(save)]);}},
      ]);
    }else start();
  };
  say(g,'함께 살필 동료',['탄갱 밖에서 만난 친구도 괜찮아요. 함께 걸을 건강한 파티 동료를 골라 주세요.'],undefined,[
    ...choices.slice(page*3,page*3+3).map(({mon,slot})=>({label:`${slot+1}. ${nameOf(mon)} Lv.${mon.level}`,action:()=>chooseMon(mon)})),
    ...(choices.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>{if(current())choose(g,page?0:1);}}]:[]),
    {label:'고르지 않고 돌아가기',action:()=>{}},
  ]);
}

function observe(g:Engine,id:string):boolean{
  const save=g.save,rail=id==='oreburghMineRail',speaker=rail?'탄갱 운반 레일':'측면 갱도 광맥';
  const mon=ready(g,speaker);if(!mon)return true;
  const run=save.flags[F.run],current=()=>g.save===save&&save.map===MINE&&!g.battle&&!g.transition&&save.flags[F.run]===run&&oreburghMinePartner(save)===mon&&save.party.includes(mon)&&mon.hp>0;
  if(!rail&&!save.flags[F.rail]){say(g,speaker,['레일에서 바퀴 자국과 비켜설 폭을 먼저 확인하면 두 장소의 소리를 비교할 수 있어요.']);return true;}
  const action=(label:string,run:()=>void):Choice=>({label,action:()=>{if(current())run();}});
  if(rail){
    const inspect=(key:string,page:string)=>{
      save.flags[key]=true;
      if(save.flags[F.tracks]&&save.flags[F.space])save.flags[F.rail]=true;
      // Preserve old completed records while a different companion is still learning.
      if(save.flags[F.rail]&&!save.flags.oreburghMineWorkComplete){save.flags.oreburghMineWorkSpecies=mon.species;save.flags.oreburghMineRailChecked=true;}
      g.persist();say(g,speaker,[page,save.flags[F.rail]?'바퀴 자국과 대피 폭을 함께 확인했다. 측면 갱도에서 광맥의 울림도 살펴보자.':'이제 같은 레일에서 비켜설 공간도 살펴보자.']);
    };
    say(g,speaker,[`${nameOf(mon)}와 레일 옆의 밝은 작업로에 섰다.`,save.flags[F.rail]?'이미 확인한 길이다. 자국과 대피 폭을 다시 살펴볼 수 있다.':'빈 광차가 지나간 자국과 동료가 안전하게 비켜설 공간을 살펴보자.'],undefined,[
      action('광차 바퀴 자국 살피기',()=>inspect(F.tracks,`${nameOf(mon)}와 광차가 지난 자국을 따라 눈으로 길을 짚었다. 빈 레일 쪽에서는 바퀴 소리가 길게 이어진다.`)),
      action('비켜설 공간 살피기',()=>{
        if(!save.flags[F.tracks]){say(g,speaker,['먼저 바퀴 자국을 보면 광차가 지나는 자리를 구분할 수 있다. 자국 밖의 넓은 작업로를 살펴보자.']);return;}
        inspect(F.space,`${nameOf(mon)}와 바퀴 자국 밖의 넓은 작업로에 나란히 섰다. 사람과 포켓몬이 함께 비켜설 만큼 여유가 있다.`);
      }),
      {label:'나중에 살펴보기',action:()=>{}},
    ]);return true;
  }
  say(g,speaker,[`${nameOf(mon)}와 측면 갱도의 광맥 앞에 멈췄다.`,save.flags[F.work]?'레일과 광맥의 울림을 이미 비교했다. 도시 전시관에서도 이 차이를 찾아보자.':'레일에서 들은 소리와 벽에서 돌아오는 울림을 비교해 보자.'],undefined,[
    action('광맥의 울림 듣기',()=>{if(!save.flags[F.rail])return;save.flags[F.echo]=true;g.persist();say(g,speaker,[`${nameOf(mon)}와 조용히 귀를 기울였다. 레일을 따라 길게 이어지던 소리와 달리 가까운 암반에서 짧은 울림이 돌아온다.`,'광맥을 다시 살펴 두 장소의 소리를 비교해 보자.']);}),
    action('레일과 소리 비교하기',()=>{
      if(!save.flags[F.rail])return;
      if(!save.flags[F.echo]){say(g,speaker,['먼저 광맥 앞에서 울림을 듣고 레일에서 들은 소리를 떠올려 보자.']);return;}
      save.flags[F.work]=true;save.flags.oreburghMineWorkSpecies=mon.species;save.flags.oreburghMineRailChecked=true;save.flags.oreburghMineWorkComplete=true;
      g.persist();say(g,speaker,[`${nameOf(mon)}와 레일의 긴 소리, 가까운 암반의 짧은 울림을 비교했다.`,'작업로를 따라 남쪽 출구로 나가 도시 북동쪽 광산 전시관을 찾아보자. 탄광 모형·광석 표본·광부의 도구에서 실제 갱도를 되짚을 수 있다.']);
    }),
    {label:'나중에 비교하기',action:()=>{}},
  ]);return true;
}

/** Called before the legacy mine branches in sinnoh-story. Roark's story stays separate. */
export function handleOreburghMineCompanion(g:Engine,id:string):boolean{
  if(g.save.map!==MINE)return false;
  if(id==='oreburghMineRail'||id==='oreburghMineSeam')return observe(g,id);
  if(id!=='oreburghMineForeman')return false;
  const save=g.save,run=save.flags[F.run],current=()=>g.save===save&&save.map===MINE&&!g.battle&&!g.transition&&save.flags[F.run]===run,mon=oreburghMinePartner(save);
  if(!save.flags.oreburghRoarkMineBriefed){save.flags.oreburghRoarkMineBriefed=true;g.persist();}
  const choices:Choice[]=[];
  if(save.flags[F.returned]&&!save.flags[F.revisited])choices.push({label:'전시관에서 본 내용 전하기',action:()=>{
    if(!current()||!save.flags[F.returned]||save.flags[F.revisited])return;const chosen=ready(g,'무쇠탄갱 작업반장');if(!chosen||chosen!==mon)return;
    save.flags[F.revisited]=true;g.persist();say(g,'무쇠탄갱 작업반장',[`${nameOf(chosen)}와 전시관 모형의 대피 폭, 광석 표본, 손짓 신호를 실제 갱도와 비교한 이야기를 전했다.`,
      '작업반장이 고개를 끄덕였다. “전시관에서 본 길이 이 작업로였군요. 다음에 돌아오면 같은 친구와 다시 둘러봐요.”']);
  }});
  choices.push({label:mon?'함께할 동료 확인·변경':'함께할 동료 고르기',action:()=>{if(current())choose(g);}});
  if(save.flags[F.work])choices.push({label:'광산 전시관 안내',action:()=>{if(current())g.setTourDestination(HALL,'tourHost');}});
  choices.push({label:'포켓몬센터 안내',action:()=>{if(current())g.setTourDestination('tour_oreburgh_center','nurse');}});
  choices.push({label:'이야기를 마친다',action:()=>{}});
  say(g,'무쇠탄갱 작업반장',[...oreburghRoarkMinePages(save),companionStatus(save),
    '탄갱 작업은 함께 걷고 살피는 선택 활동이에요. 관찰을 쉬어도 체육관 도전과 여행은 계속할 수 있어요.'],undefined,choices);return true;
}

const exhibits={
  tourExhibit0:{name:'광석 표본',flag:F.ore,label:'광맥에서 본 결 비교하기',description:'깊이에 따라 색과 결이 다른 광석과 석탄 표본이 놓여 있다.',result:'광맥에서 보았던 줄무늬와 암반의 결을 표본에서 찾았다. 레일 옆과 측면 갱도에서 울림이 달랐던 자리도 떠올렸다.'},
  tourExhibit1:{name:'탄광 모형',flag:F.model,label:'모형에서 대피 공간 찾기',description:'작은 광차와 작업로, 사람과 포켓몬이 비켜서는 공간을 내려다볼 수 있다.',result:'바퀴 자국 옆의 넓은 작업로와 측면 갱도가 본선으로 돌아오는 지점을 모형에서 찾았다.'},
  tourExhibit2:{name:'광부의 도구',flag:F.tools,label:'동료와 손짓 신호 맞추기',description:'작업 도구 옆에는 멈춤과 길 양보를 나타내는 손짓이 그려져 있다.',result:'그림의 멈춤 신호를 따라 하고 동료와 나란히 비켜서 보았다. 레일에서 확인한 대피 폭이 왜 필요한지 다시 떠올렸다.'},
} as const;

/** Called before city-activities' old species-only exhibition responses. */
export function handleOreburghMineExhibition(g:Engine,id:string):boolean{
  const save=g.save;
  if(save.map==='tour_oreburgh'&&id==='tourResident1'){
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    say(g,'전시관 학생',['광산 전시관은 도시 북동쪽이에요. 탄갱에서 동료와 살핀 길을 작은 모형에서도 찾아볼 수 있어요.',companionStatus(save),
      save.party.length?`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 포켓몬센터 PC에서 동료를 편성할 수 있어요.',
      ...(hurt||fainted?['북서쪽 포켓몬센터에서 함께 쉬고 돌아오세요. 하던 관찰은 이어 갈 수 있어요.']:[])]);return true;
  }
  if(save.map!==HALL)return false;
  const run=save.flags[F.run],current=()=>g.save===save&&save.map===HALL&&!g.battle&&!g.transition&&save.flags[F.run]===run;
  if(id==='tourHost'){
    const mon=oreburghMinePartner(save);
    const prior=recordedName(save.flags[F.lastSpecies]);
    const choices:Choice[]=[];
    if(save.flags[F.work]&&!save.flags[F.returned])choices.push({label:'함께 살핀 기록 정리하기',action:()=>{
      if(!current()||!save.flags[F.work]||save.flags[F.returned])return;const chosen=ready(g,'광산 전시관 안내원');if(!chosen||chosen!==mon)return;
      if(![F.model,F.ore,F.tools].every(key=>save.flags[key])){say(g,'광산 전시관 안내원',['전시물과 실제 갱도를 하나씩 비교해 보세요.',
        ...(!save.flags[F.model]?['탄광 모형에서 비켜설 공간을 찾아보세요.']:[]),
        ...(!save.flags[F.ore]?['광석 표본에서 광맥의 결을 찾아보세요.']:[]),
        ...(!save.flags[F.tools]?['광부의 도구 옆에서 동료와 손짓 신호를 맞춰 보세요.']:[])]);return;}
      save.flags[F.returned]=true;save.flags[F.lastSpecies]=chosen.species;save.flags[F.lastReturned]=true;
      g.persist();say(g,'광산 전시관 안내원',[`${nameOf(chosen)}와 탄갱에서 살핀 레일·광맥을 세 전시물과 비교해 기록했다.`,
        '도시 남쪽 탄갱의 작업반장에게 돌아가 무엇을 보았는지 전해 주세요.']);
    }});
    choices.push({label:'탄갱 작업반장 안내',action:()=>{if(current())g.setTourDestination(MINE,'oreburghMineForeman');}});
    choices.push({label:'관람을 계속한다',action:()=>{}});
    say(g,'광산 전시관 안내원',['무쇠탄갱의 광석층, 운반 레일, 작업 도구를 보존한 전시관입니다.',companionStatus(save),
      ...(save.flags[F.work]&&!save.flags[F.returned]?[`탄광 모형 ${save.flags[F.model]?'비교함':'살펴보기'} · 광석 표본 ${save.flags[F.ore]?'비교함':'살펴보기'} · 손짓 신호 ${save.flags[F.tools]?'맞춰 봄':'살펴보기'}`]:[]),
      ...(prior&&save.flags[F.lastReturned]?[`${prior}와 함께 정리한 전시관 방문 기록도 보관하고 있어요.`]:[])],undefined,choices);return true;
  }
  const exhibit=exhibits[id as keyof typeof exhibits];if(!exhibit)return false;
  const mon=oreburghMinePartner(save);
  if(!mon||!save.flags[F.work]){say(g,exhibit.name,[exhibit.description,companionStatus(save)]);return true;}
  say(g,exhibit.name,[exhibit.description,save.flags[exhibit.flag]?`${nameOf(mon)}와 비교한 전시물이다. 같은 동료와 다시 살펴볼 수 있다.`:`${nameOf(mon)}와 탄갱에서 살핀 것을 떠올려 보자.`],undefined,[
    {label:exhibit.label,action:()=>{
      if(!current()||!save.flags[F.work])return;const chosen=ready(g,exhibit.name);if(!chosen||chosen!==mon)return;
      save.flags[exhibit.flag]=true;g.persist();
      say(g,exhibit.name,[`${nameOf(chosen)}와 ${exhibit.result}`,[F.model,F.ore,F.tools].every(key=>save.flags[key])
        ?save.flags[F.returned]?'전에 남긴 기록과도 같은 모습이다. 탄갱 작업반장에게 다시 들러 보자.':'세 전시물을 모두 비교했다. 안내원에게 함께 살핀 기록을 정리해 달라고 하자.'
        :'다른 전시물에서도 실제 탄갱에서 본 흔적을 찾아보자.']);
    }},
    {label:'관람을 계속한다',action:()=>{}},
  ]);return true;
}
