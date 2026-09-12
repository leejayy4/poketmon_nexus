import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';

const SLOT='hearthomePracticePartnerSlot',SPECIES_FLAG='hearthomePracticePartner';
const ROUTINE='hearthomePracticeRoutine',DONE='hearthomePracticeCompleted';
const routineNames=['걸음 맞추기','기술 연출 확인','인사 연습'] as const;
export const HEARTHOME_GARDEN_EVENT='hearthomePracticeGarden';

export function installHearthomePracticeGarden(map:GameMap,outdoors:TourOutdoors){
  const object=outdoors.objects.find(item=>item.name==='동쪽 야외 연습 정원');if(!object)return;
  const previous=object.event,keys=new Set(object.cells.map(cell=>`${cell.x},${cell.y}`));object.event=HEARTHOME_GARDEN_EVENT;
  for(const prop of map.props)if(prop.dialogue===previous&&keys.has(`${prop.x},${prop.y}`))prop.dialogue=HEARTHOME_GARDEN_EVENT;
}

/** A small partner rehearsal, deliberately separate from a full Contest system. */
export function handleHearthomePerformance(g:Engine,event:string):boolean{
  if(g.save.map==='tour_hearthome'&&event==='tourResident1'){
    g.say('공연 연습생',g.save.flags[DONE]?['동료와 무대 연습을 마쳤구나!\n어떤 순서였든 호흡이 더 잘 맞아 보여.','완전한 대회가 아니어도 함께 걷고 인사하면\n서로의 움직임을 알 수 있어.']:['동쪽 연습 정원에서 걸음을 맞춘 뒤\n콘테스트 홀의 작은 무대에 올라 봐.','승패나 보상 없이 동료와 호흡을 맞추는\n짧은 연습부터 할 수 있어.']);return true;
  }
  if(g.save.map==='tour_hearthome'&&event===HEARTHOME_GARDEN_EVENT){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_hearthome'&&!g.battle;
    const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;
    if(!mon||mon.species!==save.flags[SPECIES_FLAG]){
      g.say('동쪽 야외 연습 정원',['리본 표식 사이로 넓은 걸음길이 이어진다.\n콘테스트 홀에서 연습 동료를 먼저 골라 보자.'],undefined,[{label:'콘테스트 홀 안내',action:()=>{if(current())g.setTourDestination('tour_hearthome_hall','hearthomePracticeStage');}},{label:'정원 더 보기',action:()=>{}}]);return true;
    }
    if(mon.hp<=0){g.say('동쪽 야외 연습 정원',[`${SPECIES[mon.species].name}은 지금 지쳐 있다.\n센터에서 쉬고 걸음을 맞춰 보자.`]);return true;}
    g.say('동쪽 야외 연습 정원',[`${SPECIES[mon.species].name}와 표식 사이를 걸었다.\n빠르기를 맞추자 움직임이 한결 자연스럽다.`,'콘테스트 홀의 작은 무대에서는\n걸음·기술 연출·인사를 골라 연습할 수 있다.'],undefined,[{label:'홀 무대 안내',action:()=>{if(current())g.setTourDestination('tour_hearthome_hall','hearthomePracticeStage');}},{label:'산책 계속하기',action:()=>{}}]);return true;
  }
  if(g.save.map!=='tour_hearthome_hall'||!['tourHost','tourExhibit0','hearthomePracticeStage'].includes(event))return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_hearthome_hall'&&!g.battle;
  const selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[SPECIES_FLAG]?mon:undefined;};
  const menu=()=>{
    if(!current())return;const mon=selected(),routine=typeof save.flags[ROUTINE]==='number'?routineNames[save.flags[ROUTINE] as number]:undefined;
    g.say('콘테스트 연습 안내원',['이곳은 동료와 호흡을 맞추는 작은 무대예요.\n정식 콘테스트 대회와는 달라요.',mon?`연습 동료: ${SPECIES[mon.species].name}\n${routine?`지난 연습: ${routine}`:'연습 순서를 골라 주세요.'}`:'먼저 함께 연습할 동료를 골라 주세요.'],undefined,[
      {label:'연습 동료 고르기',action:()=>choose(0)},
      {label:'연습 순서 고르기',action:practice},
      {label:'무대에서 내려오기',action:()=>{}},
    ]);
  };
  const choose=(page:number)=>{
    if(!current())return;if(!save.party.length){g.say('콘테스트 연습 안내원',['함께 여행할 동료가 생기면 찾아와 주세요.'],menu);return;}
    g.say('연습 동료',['무대에서 함께 움직일 동료를 골라 주세요.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current()||!save.party.includes(mon))return;
        if(mon.hp<=0){g.say('콘테스트 연습 안내원',['지친 동료는 센터에서 먼저 쉬게 해 주세요.'],()=>choose(page));return;}
        save.flags[SLOT]=save.party.indexOf(mon);save.flags[SPECIES_FLAG]=mon.species;save.flags[DONE]=false;g.persist();
        g.say('연습 동료',[`${SPECIES[mon.species].name}와 무대에 오르기로 했다.\n연습 순서를 골라 호흡을 맞춰 보자.`],menu);
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(page?0:1)}]:[]),{label:'돌아가기',action:menu},
    ]);
  };
  function practice(){
    if(!current())return;const mon=selected();if(!mon){g.say('콘테스트 연습 안내원',['연습 동료를 먼저 골라 주세요.'],menu);return;}
    if(mon.hp<=0){g.say('콘테스트 연습 안내원',['연습 동료가 지쳐 있어요.\n센터에서 쉬고 다시 시작해 주세요.'],menu);return;}
    g.say('연습 순서',['무대에서 무엇을 맞춰 볼까요?'],undefined,[...routineNames.map((name,index)=>({label:name,action:()=>{
      if(!current()||selected()!==mon||mon.hp<=0)return;
      save.flags[ROUTINE]=index;save.flags[DONE]=true;g.persist();g.audio.play('confirm');
      const detail=index===0?'서로의 속도에 맞춰 무대를 한 바퀴 돌았다.':index===1?`${mon.moves[0]??'움직임'}의 자세를 천천히 보여 주었다.`:'관객석을 향해 나란히 고개를 숙였다.';
      g.say('동료 공연 연습',[`${SPECIES[mon.species].name}와 ${name}를 시작했다.\n${detail}`,'승패나 보상은 없지만 서로의 움직임을 익혔다.\n다른 순서도 언제든 다시 연습할 수 있다.'],menu);
    }})),{label:'돌아가기',action:menu}]);
  }
  menu();return true;
}
