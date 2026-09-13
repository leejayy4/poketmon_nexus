import type { Engine } from './engine';
import { handleCinnabarAftermath } from './cinnabar-aftermath';
import type { SaveData,Pokemon } from './types';
import { createTrainerBattle } from './battle';
import { handleCinnabarCircuitModel } from './cinnabar-circuit-model';
import { maxHpAtLevel } from './growth';
import { CINNABAR_RESEARCH_HABITATS,isCinnabarResearchCompanion as regionalCompanion } from './cinnabar-habitats';
import { encounterPool,encounterOrigin } from './runtime-encounters';
import { encounterGuidance } from './encounter-guidance';
import { SPECIES,pokemonMoves } from './pokemon';
import { showMoveSchool } from './move-school';
import { leadPokemon } from './team';
import { TOUR_OUTDOORS } from './explore-world';

const CLIFF_OBSERVED='cinnabarCliffObserved',SHORE_OBSERVED='cinnabarShoreObserved';
function guideResearchSite(g:Engine,name:string){
  const site=TOUR_OUTDOORS.tour_cinnabar.objects.find(object=>object.name===name);
  if(site)g.setTourDestination('tour_cinnabar',site.event);
}
export function cinnabarSurveyPages(save:SaveData):string[]{
  return [
    `북동쪽 절벽 · ${save.flags[CLIFF_OBSERVED]===true?'관찰함':'아직 관찰하지 않음'}\n남쪽 물가 · ${save.flags[SHORE_OBSERVED]===true?'관찰함':'아직 관찰하지 않음'}`,
    ...(save.flags[CLIFF_OBSERVED]===true&&save.flags[SHORE_OBSERVED]===true?['절벽에는 거친 구멍과 붉은 층이 남고,\n물가에서는 파도가 닿는 면이 매끈했다.','같은 화산암도 물과 바람을 만나\n표면이 달라진다는 것을 직접 살펴봤다.']:['두 장소의 돌을 직접 조사하면\n관찰 내용을 이 수첩에서 비교할 수 있어요.']),
  ];
}

export function cinnabarCompanionPages(save:SaveData):string[]{
  const owned=[...save.party,...save.box??[]];
  return CINNABAR_RESEARCH_HABITATS.map(map=>({map,origin:encounterOrigin(map)!})).flatMap(({map,origin})=>(encounterPool(map)?.slots??[]).map(slot=>{
    const local=owned.filter(p=>p.species===slot.speciesId&&p.met===origin);
    const known=save.pokedex?.caught.includes(slot.speciesId)||owned.some(p=>p.species===slot.speciesId);
    return `${SPECIES[slot.speciesId].name} · ${origin}\n${local.length?'현지 동료 '+local.length+'마리':known?'다른 장소의 포획 기록 있음':'아직 포획 기록 없음'}`;
  }));
}

/** Existing island research, without a new quest, reward or progression lock. */
export function handleCinnabarResearch(g:Engine,event:string):boolean{
  if(handleCinnabarAftermath(g,event,()=>{handlePublicCinnabarResearch(g,event);}))return true;
  return handlePublicCinnabarResearch(g,event);
}

function handlePublicCinnabarResearch(g:Engine,event:string):boolean{
  if(handleCinnabarCircuitModel(g,event))return true;
  if(g.save.map==='tour_cinnabar'){
    const object=TOUR_OUTDOORS.tour_cinnabar.objects.find(o=>o.event===event);
    const key=object?.name==='붉은 화산암 절벽'?CLIFF_OBSERVED:object?.name==='물에 닳은 화산암'?SHORE_OBSERVED:undefined;
    if(object&&key){
      const save=g.save,first=save.flags[key]!==true;
      const partner=save.party[0];
      const companionPage=partner&&regionalCompanion(partner)
        ?partner.hp<=0?`${SPECIES[partner.species].name}은 지금 쉬어야 한다.\n혼자 표면을 살핀 뒤 센터로 돌아가자.`
          :`${SPECIES[partner.species].name}과 함께 안전한 발판에서 살폈다.\n${partner.met}에서 만난 동료와 홍련을 걷고 있다.`
        :'돌을 떼어 내지 않고 마른 발판에서 표면을 살폈다.';
      if(first){g.save.flags[key]=true;g.persist();g.audio.play('confirm');}
      g.say(object.name,[...object.pages,companionPage,first?'표면을 살펴보고 관찰 내용을 적었다.\n연구소의 표본과 비교해 보자.':'관찰했던 표면을 다시 살펴보았다.\n연구소에 돌아가면 두 기록을 비교할 수 있다.'],undefined,[
        {label:'연구소 길 안내',action:()=>{if(g.save===save&&save.map==='tour_cinnabar'&&!g.battle)g.setTourDestination('tour_cinnabar_hall','tourExhibit0');}},
        {label:key===CLIFF_OBSERVED?'물가와 비교하러':'절벽과 비교하러',action:()=>{
          if(g.save===save&&save.map==='tour_cinnabar'&&!g.battle)guideResearchSite(g,key===CLIFF_OBSERVED?'물에 닳은 화산암':'붉은 화산암 절벽');
        }},
        {label:'계속 둘러보기',action:()=>{}},
      ]);return true;
    }
  }
  if(g.save.map==='tour_cinnabar'&&event==='tourResident0'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_cinnabar'&&!g.battle;
    const won=save.flags['trainerWon:cinnabar-field-practice']===true;
    g.say('암석 연구원',['절벽 아래와 남서쪽 물가 앞에\n풀밭이 있어요. 포장길은 안전해요.',...encounterGuidance('tour_cinnabar').pages,
      won?'함께 겨룬 경험을 다음 여행에서도 살려 봐요.\n지친 동료는 센터에서 회복해 주세요.':'제가 돌보는 꼬마돌 Lv.20과 알통몬 Lv.21을 상대로\n기술과 교대를 연습할래요? 상금은 없는 연습이에요.',
    ],undefined,[
      ...(!won?[{label:'연습 배틀한다',action:()=>{
        if(!current()||save.flags['trainerWon:cinnabar-field-practice'])return;
        if(!save.party.some(p=>p.hp>0)){
          g.say('암석 연구원',['싸울 수 있는 동료가 없어요.\n먼저 홍련센터에서 회복하거나 편성해 주세요.'],undefined,[
            {label:'센터 안내',action:()=>{if(current())g.setTourDestination('tour_cinnabar_center','nurse');}},
            {label:'다음에 한다',action:()=>{}},
          ]);return;
        }
        const team:Pokemon[]=[[74,20],[66,21]].map(([species,level])=>{
          const maxHp=maxHpAtLevel(species,level);
          const p:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'홍련 연구원 동료'};
          p.moves=pokemonMoves(p);return p;
        });
        g.battle=createTrainerBattle(save,{id:'cinnabar-field-practice',name:'암석 연구원',reward:0,team});
        if(g.battle){g.persist();g.say('암석 연구원',['꼬마돌 다음에는 알통몬이 나와요.\n상대가 바뀌면 기술과 동료를 다시 골라 보세요!']);}
      }}]:[]),
      {label:'동료·기술 준비',action:()=>{if(current())g.setTourDestination('tour_cinnabar_hall','tourExhibit2');}},
      {label:'센터에서 회복',action:()=>{if(current())g.setTourDestination('tour_cinnabar_center','nurse');}},
      {label:'여행 계속하기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map==='tour_cinnabar_hall'&&event==='tourExhibit2'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_cinnabar_hall'&&!g.battle;
    const select=(page=0)=>{
      if(!current())return;
      const companions=save.party.map((p,index)=>({p,index})).filter(({p})=>regionalCompanion(p));
      g.say('홍련 동료 관찰',companions.length?['관찰할 동료를 골라 주세요.\n지금 기억하는 기술을 함께 살펴봐요.']:['홍련 외곽·쌍둥이섬 1층/지하1·2층 동료가\n현재 파티에 없어요.','박스에 있다면 센터 PC에서 데려오세요.\n관찰하지 않아도 자유롭게 여행할 수 있어요.'],undefined,[
        ...companions.slice(page*3,page*3+3).map(({p,index})=>({label:`${SPECIES[p.species].name} Lv.${p.level}`,action:()=>{
          if(!current()||save.party[index]!==p||!regionalCompanion(p))return;
          g.say('홍련 동료 관찰',[`${SPECIES[p.species].name} · ${SPECIES[p.species].types.join('·')}\n${p.met}`,`현재 기술\n${pokemonMoves(p).join(' / ')}`,'새 기술은 현재 레벨과 배운 기록에 맞춰\n기술 편성에서 확인할 수 있어요.'],undefined,[
            {label:'기술 편성',action:()=>{if(current()&&save.party[index]===p){g.partyIndex=index;showMoveSchool(g,0,undefined,false,{label:'동료 준비로 돌아가기',action:()=>{if(current()&&save.party[index]===p)select(page);}});}}},
            {label:'이 동료와 현장으로',action:()=>{
              if(!current()||save.party[index]!==p)return;
              const message=leadPokemon(save,index);
              if(p.hp<=0){
                g.say('동료와 출발',[message],undefined,[
                  {label:'센터 안내',action:()=>{if(current())g.setTourDestination('tour_cinnabar_center','nurse');}},
                  {label:'다른 동료 선택',action:()=>select(page)},
                ]);return;
              }
              g.partyIndex=0;g.persist();
              g.say('동료와 출발',[message,'포장길을 따라 관찰 장소로 가 보자.\n외곽 풀밭에서 야생 포켓몬을 만나면 이 동료가 먼저 나간다.'],undefined,[
                {label:'관찰 장소 안내',action:()=>{if(current())guideResearchSite(g,save.flags[CLIFF_OBSERVED]===true?'물에 닳은 화산암':'붉은 화산암 절벽');}},
                ...(!save.flags['trainerWon:cinnabar-field-practice']?[{label:'연구원 배틀로',action:()=>{if(current())g.setTourDestination('tour_cinnabar','tourResident0');}}]:[{label:'쌍둥이섬에서 성장',action:()=>{if(current())g.setTourDestination('tour_kanto_seafoam_1f');}}]),
                {label:'준비 더 하기',action:()=>select()},
              ]);
            }},
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
      {label:'북동쪽 절벽',action:()=>{if(current())g.say('화산암 관찰',['표본과 절벽에는 거친 구멍과\n겹겹이 굳은 붉은 결이 보여요.','연구소 밖 오른쪽 길 위에 절벽이 있어요.\n돌을 떼지 않고 표면을 살펴보세요.'],undefined,[{label:'다른 장소 비교',action:compare},{label:'절벽으로 길 안내',action:()=>{if(current())guideResearchSite(g,'붉은 화산암 절벽');}}]);}},
      {label:'남쪽 물가',action:()=>{if(current())g.say('화산암 관찰',['물가의 돌도 위쪽에는 거친 결이 남아요.\n파도가 닿는 아래쪽은 매끈하지요.','남쪽 만의 서편에서 비교해 보세요.\n알통몬이 쉬는 곳에는 돌을 던지지 마세요.'],undefined,[{label:'다른 장소 비교',action:compare},{label:'물가로 길 안내',action:()=>{if(current())guideResearchSite(g,'물에 닳은 화산암');}}]);}},
      {label:'그만 살펴보기',action:()=>{}},
    ]);
  };
  compare();return true;
}
