import type { Engine } from './engine';
import { handleSeafoamBoulder,SEAFOAM_BOULDER_MAP,SEAFOAM_BOULDER_EVENT,SEAFOAM_BOULDER_MOVED } from './seafoam-boulder';
import { encounterGuidance } from './encounter-guidance';
import { SPECIES } from './pokemon';
import { isSeafoamCompanion } from './cinnabar-habitats';

const stops=[
  {map:'tour_kanto_seafoam_1f',event:'tourSeafoam1FWater',name:'입구의 얼음층'},
  {map:'tour_kanto_seafoam_b1f',event:'tourSeafoamB1Water',name:'수로 둘레길'},
  {map:'tour_kanto_seafoam_b2f',event:'tourSeafoamB2Water',name:'암벽 회랑'},
  {map:'tour_kanto_seafoam_b3f',event:'tourSeafoamB3Water',name:'굽은 냉기길'},
  {map:'tour_kanto_seafoam_b4f',event:'tourSeafoamB4Cold',name:'최하층 냉기 관찰대'},
] as const;

/** Read field marks in town; only the original field interaction can create them. */
export function showSeafoamNotebook(g:Engine){
  const save=g.save,map=save.map;
  const current=()=>g.save===save&&save.map===map&&!g.battle;
  const recorded=stops.filter(stop=>save.flags[`seafoamFieldMark:${stop.map}`]===true);
  const missing=stops.find(stop=>save.flags[`seafoamFieldMark:${stop.map}`]!==true);
  const companions=save.party.filter(isSeafoamCompanion),stored=(save.box??[]).filter(isSeafoamCompanion);
  const practiceWon=save.flags['trainerWon:cinnabar-field-practice']===true;
  const guide=(target:string,event?:string)=>()=>{if(current())g.setTourDestination(target,event);};
  g.say('해안길 수첩',[
    recorded.length?`쌍둥이섬에서 남긴 표시 ${recorded.length}/${stops.length}곳\n${recorded.map(stop=>stop.name).join(' · ')}`:'아직 쌍둥이섬에서 남긴 표시가 없다.\n섬 안의 곁길을 걸으며 기억할 곳을 표시해 보자.',
    ...(companions.length?companions.map(p=>`${SPECIES[p.species].name} Lv.${p.level} · HP ${p.hp}/${p.maxHp}\n${p.met}에서 만난 동료`):[stored.length?'쌍둥이섬에서 만난 동료가 센터 PC에 있다. 함께 여행하려면 파티로 데려오자.':'쌍둥이섬에서 만난 동료는 아직 파티에 없다. 포획은 자유이며 수첩 표시와 통행 조건은 아니다.']),
    companions.length?(practiceWon?'홍련 연구원과 겨룬 기록이 있다. 동료의 기술을 다시 편성하고 다음 해안 여행을 준비하자.':'홍련 연구소에서 동료의 기술을 편성한 뒤, 도시의 암석 연구원과 연습 배틀을 할 수 있다.'):'홍련센터에서 회복하고 파티를 정리할 수 있다.',
    '홍련 → 20번수로 → 쌍둥이섬 → 20번수로 → 19번수로 → 연분홍\n돌아오는 길도 같은 장소를 거친다.',
    save.party.some(p=>p.hp<p.maxHp)?'지친 동료가 있다. 출발 전에 홍련센터에 들르자.':'동료의 기술과 여행 도구를 살피고 출발하자.',
  ],undefined,[
    {label:save.flags[SEAFOAM_BOULDER_MOVED]===true?'B2F 열린 곁길로':'B2F 바위 곁길 살피기',action:guide(SEAFOAM_BOULDER_MAP,SEAFOAM_BOULDER_EVENT)},
    ...(missing?[{label:'남기지 않은 장소 안내',action:guide(missing.map,missing.event)}]:[]),
    ...(companions.length?[{label:'현지 동료 기술 준비',action:guide('tour_cinnabar_hall','tourExhibit2')},...(!practiceWon?[{label:'연구원 연습 배틀 안내',action:guide('tour_cinnabar','tourResident0')}]:[])]:[]),
    {label:'20번수로로 출발',action:guide('tour_kanto_route_20')},
    {label:'센터에서 준비',action:guide('tour_cinnabar_center','nurse')},
    {label:'동료 살피기',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
    {label:'수첩 덮기',action:()=>{}},
  ]);
}

/** Optional field notebook: each mark requires reaching the existing local object. */
export function handleSeafoamExploration(g:Engine,event:string):boolean{
  if(handleSeafoamBoulder(g,event))return true;
  const index=stops.findIndex(stop=>stop.map===g.save.map&&stop.event===event);
  if(index<0)return false;
  const stop=stops[index],save=g.save;
  const current=()=>g.save===save&&g.save.map===stop.map&&!g.battle;
  const key=`seafoamFieldMark:${stop.map}`;
  const route=()=>{
    if(!current())return;
    const next=stops[index+1];
    if(next)g.setTourDestination(next.map,next.event);
    else g.setTourDestination('tour_cinnabar');
  };
  const show=()=>{
    const count=stops.filter(item=>save.flags[`seafoamFieldMark:${item.map}`]===true).length;
    g.say(stop.name,[
      ['입구의 밝은 얼음층 뒤로 아래층 계단이 이어진다.','둘레길 안쪽의 물소리와 바깥 마른 길을 구분했다.','암벽을 돌아온 회랑이 계단 앞에서 합류한다.','굽은 길 아래에서 올라오는 냉기를 느꼈다.','가장 낮은 발판에서 올라가는 계단 방향을 확인했다.'][index],
      ...(index===1?[...encounterGuidance(stop.map).pages,'북쪽 둘레길의 거친 암반에서 만날 수 있다. 서쪽 넓은 본선으로 돌아가면 계단까지 피해서 갈 수 있다.']:[]),
      ...(index===2?[...encounterGuidance(stop.map).pages,'중앙 얼음 암벽의 오른쪽 곁길에서 만날 수 있다. 서쪽 넓은 본선은 조우 구간을 지나지 않고 남쪽 계단으로 이어진다.']:[]),
      save.flags[key]?'이 장소의 길과 귀환 방향을 수첩에 표시해 두었다.':'지금 서 있는 장소를 여행 수첩에 표시할 수 있다.',
      `쌍둥이섬 여행 수첩 ${count}/${stops.length}곳 · 마음에 드는 길을 자유롭게 남겨 두자.`,
    ],undefined,[
      {label:save.flags[key]?'표시 다시 보기':'수첩에 표시',action:()=>{if(!current())return;if(!save.flags[key]){save.flags[key]=true;g.persist();}show();}},
      ...(index===2?[{label:save.flags[SEAFOAM_BOULDER_MOVED]===true?'열린 암벽 곁길로':'홈 위의 바위 살피기',action:()=>{if(current())g.setTourDestination(SEAFOAM_BOULDER_MAP,SEAFOAM_BOULDER_EVENT);}}]:[]),
      {label:index===4?'홍련 출구로':'다음 층 조사로',action:route},
      {label:'입구로 돌아가기',action:()=>{if(current())g.setTourDestination('tour_kanto_seafoam_exterior');}},
      {label:'주변 더 살피기',action:()=>{}},
    ]);
  };
  show();return true;
}
