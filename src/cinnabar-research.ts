import type { Engine } from './engine';
import type { SaveData } from './types';
import { CINNABAR_HABITAT_NAME } from './cinnabar-layout';
import { encounterPool } from './runtime-encounters';
import { encounterGuidance } from './encounter-guidance';
import { SPECIES,pokemonMoves } from './pokemon';
import { showMoveSchool } from './move-school';
import { TOUR_OUTDOORS } from './explore-world';

const CLIFF_OBSERVED='cinnabarCliffObserved',SHORE_OBSERVED='cinnabarShoreObserved';
export function cinnabarSurveyPages(save:SaveData):string[]{
  return [
    `북동쪽 절벽 · ${save.flags[CLIFF_OBSERVED]===true?'관찰함':'아직 관찰하지 않음'}\n남쪽 물가 · ${save.flags[SHORE_OBSERVED]===true?'관찰함':'아직 관찰하지 않음'}`,
    ...(save.flags[CLIFF_OBSERVED]===true&&save.flags[SHORE_OBSERVED]===true?['절벽에는 거친 구멍과 붉은 층이 남고,\n물가에서는 파도가 닿는 면이 매끈했다.','같은 화산암도 물과 바람을 만나\n표면이 달라진다는 것을 직접 살펴봤다.']:['두 장소의 돌을 직접 조사하면\n관찰 내용을 이 수첩에서 비교할 수 있어요.']),
  ];
}

export function cinnabarCompanionPages(save:SaveData):string[]{
  const owned=[...save.party,...save.box??[]];
  return (encounterPool('tour_cinnabar')?.slots??[]).map(slot=>{
    const local=owned.filter(p=>p.species===slot.speciesId&&p.met===CINNABAR_HABITAT_NAME);
    const known=save.pokedex?.caught.includes(slot.speciesId)||owned.some(p=>p.species===slot.speciesId);
    return `${SPECIES[slot.speciesId].name}\n${local.length?'홍련에서 만난 동료 '+local.length+'마리':known?'포획 기록 있음 · 홍련 동료 없음':'아직 포획 기록 없음'}`;
  });
}

/** Existing island research, without a new quest, reward or progression lock. */
export function handleCinnabarResearch(g:Engine,event:string):boolean{
  if(g.save.map==='tour_cinnabar'){
    const object=TOUR_OUTDOORS.tour_cinnabar.objects.find(o=>o.event===event);
    const key=object?.name==='붉은 화산암 절벽'?CLIFF_OBSERVED:object?.name==='물에 닳은 화산암'?SHORE_OBSERVED:undefined;
    if(object&&key){
      const save=g.save,first=save.flags[key]!==true;
      if(first){g.save.flags[key]=true;g.persist();g.audio.play('confirm');}
      g.say(object.name,[...object.pages,first?'표면을 살펴보고 관찰 내용을 적었다.\n연구소의 표본과 비교해 보자.':'관찰했던 표면을 다시 살펴보았다.\n연구소에 돌아가면 두 기록을 비교할 수 있다.'],undefined,[
        {label:'연구소 길 안내',action:()=>{if(g.save===save&&save.map==='tour_cinnabar'&&!g.battle)g.setTourDestination('tour_cinnabar_hall','tourExhibit0');}},
        {label:'계속 둘러보기',action:()=>{}},
      ]);return true;
    }
  }
  if(g.save.map==='tour_cinnabar'&&event==='tourResident0'){
    g.say('암석 연구원',['절벽 아래와 남서쪽 물가 앞에\n풀밭이 있어요. 포장길은 안전해요.',...encounterGuidance('tour_cinnabar').pages,'동료가 되면 연구소의 서식 관찰판에서\n만난 장소와 기술을 함께 살펴보세요.']);return true;
  }
  if(g.save.map==='tour_cinnabar_hall'&&event==='tourExhibit2'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_cinnabar_hall'&&!g.battle;
    const select=(page=0)=>{
      if(!current())return;
      const companions=save.party.map((p,index)=>({p,index})).filter(({p})=>p.met===CINNABAR_HABITAT_NAME);
      g.say('홍련 동료 관찰',companions.length?['관찰할 동료를 골라 주세요.\n지금 기억하는 기술을 함께 살펴봐요.']:['홍련 외곽에서 만난 동료가\n현재 파티에 없어요.','박스에 있다면 센터 PC에서 데려오세요.\n관찰하지 않아도 자유롭게 여행할 수 있어요.'],undefined,[
        ...companions.slice(page*3,page*3+3).map(({p,index})=>({label:`${SPECIES[p.species].name} Lv.${p.level}`,action:()=>{
          if(!current()||save.party[index]!==p||p.met!==CINNABAR_HABITAT_NAME)return;
          g.say('홍련 동료 관찰',[`${SPECIES[p.species].name} · ${SPECIES[p.species].types.join('·')}\n${p.met}`,`현재 기술\n${pokemonMoves(p).join(' / ')}`,'새 기술은 현재 레벨과 배운 기록에 맞춰\n기술 편성에서 확인할 수 있어요.'],undefined,[
            {label:'기술 편성',action:()=>{if(current()&&save.party[index]===p){g.partyIndex=index;showMoveSchool(g);}}},
            {label:'다른 동료 관찰',action:()=>select(page)},
            {label:'관찰 마치기',action:()=>{}},
          ]);
        }})),
        ...(companions.length>3?[{label:page?'앞쪽 동료':'다음 동료',action:()=>select(page?0:1)}]:[]),
        {label:'관찰판으로',action:menu},
      ]);
    };
    const menu=()=>{
      if(!current())return;
      g.say('홍련 서식 관찰판',[...encounterGuidance('tour_cinnabar').pages,...cinnabarCompanionPages(save),'도감 기록과 홍련에서 만난 동료를\n구분해서 살펴봅니다.'],undefined,[
        {label:'현지 동료·기술 관찰',action:()=>select()},
        {label:'센터 PC 안내',action:()=>{if(current())g.setTourDestination('tour_cinnabar_center','tourExhibit1');}},
        {label:'관찰 마치기',action:()=>{}},
      ]);
    };
    menu();return true;
  }
  if(g.save.map!=='tour_cinnabar_hall'||!['tourHost','tourExhibit0'].includes(event))return false;
  const save=g.save;
  const current=()=>g.save===save&&g.save.map==='tour_cinnabar_hall'&&!g.battle;
  const compare=()=>{
    if(!current())return;
    g.say('화산암 관찰',['같은 화산암도 놓인 장소에 따라\n표면이 달라져요.',...cinnabarSurveyPages(save)],undefined,[
      {label:'북동쪽 절벽',action:()=>{if(current())g.say('화산암 관찰',['표본과 절벽에는 거친 구멍과\n겹겹이 굳은 붉은 결이 보여요.','연구소 밖 오른쪽 길 위에 절벽이 있어요.\n돌을 떼지 않고 표면을 살펴보세요.'],undefined,[{label:'다른 장소 비교',action:compare},{label:'밖에서 살펴보기',action:()=>{}}]);}},
      {label:'남쪽 물가',action:()=>{if(current())g.say('화산암 관찰',['물가의 돌도 위쪽에는 거친 결이 남아요.\n파도가 닿는 아래쪽은 매끈하지요.','남쪽 만의 서편에서 비교해 보세요.\n알통몬이 쉬는 곳에는 돌을 던지지 마세요.'],undefined,[{label:'다른 장소 비교',action:compare},{label:'밖에서 살펴보기',action:()=>{}}]);}},
      {label:'그만 살펴보기',action:()=>{}},
    ]);
  };
  compare();return true;
}
