import type { Engine } from './engine';
import type { Choice,MapId,SaveData } from './types';
import { SPECIES } from './pokemon';
import { TOUR_OUTDOORS } from './explore-world';
import { encounterGuidance } from './encounter-guidance';

const CITY='tour_castelia',HALL='tour_castelia_hall';
const DISPLAY='casteliaGalleryDisplay';
const VIEWS=[
  {name:'서쪽 항만 수면',title:'빛과 그늘',flag:'casteliaSketchWest',detail:'밝은 물결과 부두 그늘을\n나란히 그려 넣었다.',comparison:'그림은 밝은 항구의 아침을 담았지만,\n내 스케치에는 부두 그늘도 남아 있다.'},
  {name:'중앙 부두의 물결',title:'물길과 산책로',flag:'casteliaSketchMiddle',detail:'물길 양쪽의 산책로와\n그 사이를 잇는 데크를 그렸다.',comparison:'그림 속 물길을 따라 시선을 옮기니\n직접 돌아 걸었던 데크가 떠오른다.'},
  {name:'동쪽 항만 전경',title:'빌딩의 그림자',flag:'casteliaSketchEast',detail:'긴 빌딩 그림자가 물결에 따라\n잘게 나뉘는 모습을 그렸다.',comparison:'그림 속 반듯한 빌딩과 달리\n물 위의 빌딩은 계속 흔들리고 있었다.'},
] as const;

export function casteliaChosenSketch(flags:SaveData['flags']):string|undefined{
  const value=flags[DISPLAY];
  if(typeof value!=='number'||!Number.isInteger(value)||value<1||value>VIEWS.length)return;
  const view=VIEWS[value-1],species=flags[view.flag];
  return typeof species==='number'&&SPECIES[species]?view.title:undefined;
}

/** Optional sketches record an observed view and species, not a quest or capture. */
export function handleCasteliaGallery(g:Engine,event:string):boolean{
  const s=g.save,map=s.map;
  if(map!==CITY&&map!==HALL)return false;
  const current=()=>g.save===s&&s.map===map&&!g.battle;
  const objects=TOUR_OUTDOORS[CITY].objects;
  const ownedSketch=(index:number)=>{
    const species=s.flags[VIEWS[index].flag];
    return typeof species==='number'&&SPECIES[species]?species:undefined;
  };
  const guide=(target:MapId,interaction?:string)=>{if(current())g.setTourDestination(target,interaction);};
  if(map===CITY&&event==='tourResident1'){
    const sketch=casteliaChosenSketch(s.flags);
    g.say('갤러리 관람객',[
      sketch?`${sketch}을 골라 두셨군요.\n동쪽 작업실 주민도 항구를 그리고 있어요.`:'항구 그림을 본 뒤 실제 물가를 걸었어요.\n동쪽 골목에도 그림 작업실이 있답니다.',
      '골목 아래 집에서는 정원 동료와\n여행 기술을 살펴볼 수 있어요.',
    ],undefined,[
      {label:'그림 작업실로 안내',action:()=>guide('tour_castelia_home4','tourHost')},
      {label:'동료의 집으로 안내',action:()=>guide('tour_castelia_home5','tourHost')},
      {label:'갤러리로 안내',action:()=>guide(HALL,'tourExhibit0')},
      {label:'닫기',action:()=>{}},
    ]);return true;
  }
  if(map===CITY&&event==='tourResident0'){
    g.say('해안 직장인',[
      '점심 뒤에는 북쪽 정원도 걸어 봐.\n건물 사이 풀밭에 동료들이 살고 있어.',
      ...encounterGuidance(CITY).pages,
      `몬스터볼 ${s.inventory.pokeBalls}개 · 상처약 ${s.inventory.potions}개\n센터와 가게에서 준비하고 둘러봐.`,
    ],undefined,[
      {label:'정원 앞 피카츄로 안내',action:()=>guide(CITY,'tourPokemon')},
      {label:'센터에서 쉬기',action:()=>guide('tour_castelia_center','nurse')},
      {label:'상점으로 안내',action:()=>guide('tour_castelia_mart','martClerk')},
      {label:'갤러리로 안내',action:()=>guide(HALL,'tourExhibit0')},
      {label:'4번도로로 출발',action:()=>guide('tour_unova_route_04')},
      {label:'닫기',action:()=>{}},
    ]);return true;
  }
  const destinations=()=>{
    if(!current())return;
    g.say('항구 산책',['보고 싶은 풍경을 고르면\n아래 지도에 걸어갈 길을 표시합니다.','현재 선두 동료와 풍경을 남길 수 있어요.\n한 곳만 둘러봐도 그림과 비교할 수 있어요.'],undefined,[
      ...VIEWS.map(v=>({label:v.title,action:()=>{
        const o=objects.find(o=>o.name===v.name);if(o)guide(CITY,o.event);
      }})),
      {label:'닫기',action:()=>{}},
    ]);
  };
  const menu=()=>{
    if(!current())return;
    const choices:Choice[]=VIEWS.flatMap((v,i)=>ownedSketch(i)===undefined?[]:[{label:v.title+' 비교',action:()=>{
      if(!current())return;
      const species=ownedSketch(i);if(species===undefined)return;
      let saved=false;
      g.say('항구의 아침',[`${SPECIES[species].name}와 함께 보았던\n${v.name}의 스케치를 펼쳤다.`,v.comparison,'이번에 마음에 남은 풍경으로\n이 스케치를 골라 둘까요?'],undefined,[
        {label:'이 풍경을 고른다',action:()=>{
          if(!current()||saved||ownedSketch(i)!==species)return;
          saved=true;s.flags[DISPLAY]=i+1;g.persist();g.audio.play('confirm');
          g.say('내 항구 스케치',[`${v.title}을 골라 두었다.\n다른 풍경을 골라 다시 바꿀 수도 있다.`],menu);
        }},
        {label:'비교만 마친다',action:menu},
      ]);
    }}]);
    const selected=s.flags[DISPLAY];
    const chosen=typeof selected==='number'&&Number.isInteger(selected)&&selected>=1&&selected<=3&&ownedSketch(selected-1)!==undefined?VIEWS[selected-1]:undefined;
    g.say('항구 갤러리',[
      '그림을 본 뒤 실제 항구를 걸어 보세요.\n동료와 본 풍경은 저마다 다를 거예요.',
      chosen?`지금 고른 스케치: ${chosen.title}\n다른 날 다시 살펴보고 바꿔도 좋아요.`:'아직 골라 둔 스케치가 없어요.\n항구에서 본 풍경 하나를 가져와 보세요.',
    ],undefined,[...choices,{label:'항구 풍경 보러 가기',action:destinations},{label:'4번도로로 출발',action:()=>guide('tour_unova_route_04')},{label:'닫기',action:()=>{}}]);
  };
  if(map===HALL&&['tourHost','tourExhibit0'].includes(event)){menu();return true;}
  if(map!==CITY)return false;
  const object=objects.find(o=>o.event===event),view=VIEWS.find(v=>v.name===object?.name);
  if(!object||!view)return false;
  const mon=s.party[0];
  if(!mon||mon.hp<=0){
    g.say(object.name,[...object.pages,'건강한 선두 동료와 함께 오면\n이 풍경을 스케치로 남길 수 있다.'],undefined,[{label:'센터로 안내',action:()=>guide('tour_castelia_center','nurse')},{label:'풍경 감상 마치기',action:()=>{}}]);return true;
  }
  let recorded=false;
  g.say(object.name,[...object.pages,`${SPECIES[mon.species].name}와 함께\n잠시 멈춰 항구를 바라보았다.`],undefined,[
    {label:'이 풍경을 남긴다',action:()=>{
      if(!current()||recorded||s.party[0]!==mon||mon.hp<=0)return;
      recorded=true;s.flags[view.flag]=mon.species;g.persist();g.audio.play('confirm');
      g.say('항구 스케치',[view.detail,'갤러리의 「항구의 아침」과\n직접 본 모습을 비교해 보자.'],undefined,[{label:'갤러리로 안내',action:()=>guide(HALL,'tourExhibit0')},{label:'산책 계속하기',action:()=>{}}]);
    }},
    {label:'그냥 바라본다',action:()=>{}},
  ]);return true;
}
