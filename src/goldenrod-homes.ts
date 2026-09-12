import type { GameMap } from './types';
import type { TourInterior } from './explore-interiors';
import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { showMoveSchool } from './move-school';
import { route34TacticsPages,route34TrainingPages } from './goldenrod-radio';

const homes=[
  {id:'tour_goldenrod_home1',title:'동료와 사는 집',host:'동료를 돌보는 주민',greeting:'여행하는 친구의 몸 상태도 살펴보렴.\n회복은 포켓몬센터에서 할 수 있어.',objects:[['가족 식탁','사람의 식기 옆에 포켓몬용 그릇이 있다.\n함께 식사하는 자리다.'],['돌봄 책장','동료의 건강과 기술을 살펴보는 책이다.'],['동료의 잠자리','낮은 소파 옆에 작은 방석을 놓았다.'],['창가 화분','잎에 묻은 먼지를 닦아 놓았다.']]},
  {id:'tour_goldenrod_home2',title:'여행 준비 작업방',host:'여행을 준비하는 주민',greeting:'길을 떠나기 전에 기술을 살펴봐.\n지금 배울 수 있는 기술을 함께 고르자.',objects:[['여행 준비 책상','동료의 기술을 비교하고 준비하는 자리다.'],['여행 기록 책장','34번도로와 숲에서 쓴 수첩이 있다.'],['가방 수선 자리','해진 가방과 포켓몬용 방석을 수선했다.'],['숲길 화분','잎 아래에 작은 물방울이 맺혀 있다.']]},
  {id:'tour_goldenrod_home3',title:'라디오를 듣는 집',host:'방송을 듣는 주민',greeting:'라디오 타워에서 여행 동료를 소개해 봐.\n만난 장소부터 이야기하면 좋겠지.',objects:[['라디오 청취 책상','탁상 라디오 옆에 여행 엽서가 놓였다.'],['방송 엽서 책장','포켓몬과 함께한 여행 이야기를 모았다.'],['청취 소파','동료와 나란히 앉아 방송을 듣는 자리다.'],['방송 시간표 옆 화분','가족이 돌아가며 물을 주는 화분이다.']]},
] as const;

/** Change existing room identities and furnishings without moving saved floor tiles. */
export function installGoldenrodHomes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,floors:Record<string,{title:string}>){
  for(const home of homes)for(let floor=1;floor<=3;floor++){
    const id=home.id+(floor===1?'':`_${floor}f`),room=rooms[id],map=maps[id];
    const title=home.title+` · ${floor}층`;
    room.title=title;map.name='금빛시티 · '+title;floors[id].title=title;
    map.npcs[0].name=home.host;
    room.greeting=[home.greeting,floor===1?'오른쪽 계단으로 올라가면\n독서실과 공동 정원이 있어.':'오른쪽 아래 계단으로 내려가면\n1층 현관으로 돌아갈 수 있어.'];
    if(floor===1)room.objects.forEach((object,index)=>{
      object.name=home.objects[index][0];object.pages=[home.objects[index][1]];
      if(home.id==='tour_goldenrod_home3'&&index===0)object.kind='console';
    });
    if(floor===2){room.objects[2].name=home.title+'의 수첩';room.objects[2].pages=[home.greeting];}
  }
}

export function handleGoldenrodHome(g:Engine,event:string):boolean{
  const home=homes.find(h=>h.id===g.save.map);
  if(!home||!['tourHost','tourDetail4_7'].includes(event))return false;
  const save=g.save,current=()=>g.save===save&&save.map===home.id&&!g.battle;
  const guide=(map:'tour_goldenrod_center'|'tour_goldenrod_hall',event:string)=>()=>{if(current())g.setTourDestination(map,event);};
  const choose=(page=0)=>{
    if(!current())return;
    if(!save.party.length){g.say(home.host,['함께 여행하는 동료가 생기면 찾아와.']);return;}
    g.say('여행 동료 준비',['기술을 살펴볼 동료를 골라 주세요.\n현재 레벨과 가진 기술머신을 사용합니다.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current()||!save.party.includes(mon))return;
        g.partyIndex=save.party.indexOf(mon);showMoveSchool(g);
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(page?0:1)}]:[]),
      {label:'그만 살펴보기',action:()=>{}},
    ]);
  };
  const injured=save.party.filter(mon=>mon.hp<mon.maxHp).length;
  g.say(home.host,[home.greeting,home.id.endsWith('home1')?`함께 걷는 동료 ${save.party.length}마리\nHP 회복이 필요한 동료 ${injured}마리`:'동료와 함께 준비하고\n남쪽 34번도로로 여행을 떠나렴.'],undefined,[
    ...(home.id==='tour_goldenrod_home2'?[{label:'34번 동료 육성 정보',action:()=>{if(current())g.say('34번도로 동료 육성',route34TrainingPages(save));}}]:[]),
    ...(home.id==='tour_goldenrod_home2'?[{label:'숲 여행 전술 준비',action:()=>{if(current())g.say('너도밤나무숲 준비',route34TacticsPages(save));}}]:[]),
    {label:'동료 기술 준비',action:()=>choose()},
    {label:'센터까지 안내',action:guide('tour_goldenrod_center','nurse')},
    {label:'라디오 체험 안내',action:guide('tour_goldenrod_hall','tourExhibit0')},
    {label:'인사하고 떠나기',action:()=>{}},
  ]);return true;
}
