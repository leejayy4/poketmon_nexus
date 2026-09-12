import type { Engine } from './engine';
import type { GameMap } from './types';
import type { TourInterior } from './explore-interiors';
import { CINNABAR_ROUTE,CINNABAR_DEPARTURE_ROUTE } from './cinnabar-layout';

const homes=[
  {id:'tour_cinnabar_home1',title:'바닷가 동료의 집',host:'동료를 돌보는 주민',objects:[['함께 쓰는 식탁','사람의 식기 옆에 낮은 물그릇이 있다.\n바닷바람에 날리지 않게 받침을 놓았다.'],['돌봄 기록','풀밭에서 돌아오면 몸 상태를 살피고\n다쳤을 때는 센터에 가자는 메모다.'],['동료의 잠자리','모래를 털어 낸 작은 방석이다.\n창가에는 그늘이 드리워져 있다.'],['창가 화분','짠 바람을 피하도록 창 안쪽에 두었다.']]},
  {id:'tour_cinnabar_home2',title:'섬 여행자의 작업방',host:'여행 준비를 하는 주민',objects:[['가방 수선대','볼 주머니와 어깨끈을 손질하는 자리다.\n옆에는 동료가 쉬는 자리가 있다.'],['해안길 수첩','북쪽은 태초–홍련 해안길,\n동쪽은 홍련–갈색 해안길이라고 적혀 있다.'],['여행 준비 소파','출발 전에 함께 쉬며 짐을 정리한다.'],['물뿌리개와 화분','여행을 떠나면 이웃이 물을 주기로 했다.']]},
];

export function installCinnabarHomes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>){
  for(const home of homes){
    const map=maps[home.id],room=rooms[home.id];
    map.name='홍련섬 · '+home.title;room.title=home.title;map.npcs[0].name=home.host;
    room.greeting=['포켓몬과 함께 사는 집이에요.\n여행 준비를 하고 가세요.'];
    room.objects.forEach((o,i)=>{o.name=home.objects[i][0];o.pages=[home.objects[i][1]];});
  }
}

export function handleCinnabarLife(g:Engine,event:string):boolean{
  if(g.save.map===CINNABAR_ROUTE&&event==='journeyWalker'){
    const save=g.save,current=()=>g.save===save&&save.map===CINNABAR_ROUTE&&!g.battle;
    g.say('해안길 여행자',['서쪽은 태초마을, 동쪽은 홍련섬이야.\n만을 돌아가는 모래길을 따라가면 돼.','북쪽 전망길과 남쪽 바위 샛길은\n다시 큰길로 돌아올 수 있어.','홍련에서는 바닷가 돌을 관찰해 봐.\n외곽 풀밭에서는 새 동료도 만날 수 있어.'],undefined,[
      {label:'홍련센터 안내',action:()=>{if(current())g.setTourDestination('tour_cinnabar_center','nurse');}},
      {label:'홍련 연구소 안내',action:()=>{if(current())g.setTourDestination('tour_cinnabar_hall','tourExhibit0');}},
      {label:'태초로 돌아가는 길',action:()=>{if(current())g.setTourDestination('tour_pallet');}},
      {label:'여행 계속하기',action:()=>{}},
    ]);return true;
  }
  const home=homes.find(h=>h.id===g.save.map);
  const city=g.save.map==='tour_cinnabar'&&['tourGuide','tourResident1'].includes(event);
  if(!city&&!(home&&['tourHost','tourDetail4_7'].includes(event)))return false;
  const save=g.save,map=save.map,current=()=>g.save===save&&save.map===map&&!g.battle;
  const guide=(target:Parameters<Engine['setTourDestination']>[0],event?:string)=>()=>{if(current())g.setTourDestination(target,event);};
  const departure=()=>{
    if(!current())return;
    g.say('홍련에서 다음 여행',['북쪽 해안길 → 태초마을\n동쪽 해안길 → 갈색시티','현재 두 길은 걸어서 왕복할 수 있어요.\n연구소 관찰이나 포획은 출발 조건이 아니에요.'],undefined,[
      {label:'태초행 길 안내',action:guide(CINNABAR_ROUTE)},
      {label:'갈색행 길 안내',action:guide(CINNABAR_DEPARTURE_ROUTE)},
      {label:'먼저 파티 살피기',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'마치기',action:()=>{}},
    ]);
  };
  const injured=save.party.filter(p=>p.hp<p.maxHp).length;
  g.say(home?.host??(event==='tourResident1'?'섬 주민':'홍련 안내원'),[
    home?'외곽 풀밭에서 동료를 만났나요?\n길을 떠나기 전에 함께 쉬고 준비해요.':'연구소와 외곽 풀밭을 둘러보고\n남쪽 물가에서 함께 쉬어 가세요.',
    injured?`회복이 필요한 동료 ${injured}마리\n센터에서 쉬게 해 주세요.`:'동료들의 HP가 모두 건강해요.\n기술과 도구도 확인하고 출발해요.',
    `몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개\n상점은 주거 구역 서쪽에 있어요.`,
  ],undefined,[
    {label:'센터·PC 안내',action:guide('tour_cinnabar_center','nurse')},
    {label:'상점 안내',action:guide('tour_cinnabar_mart','martClerk')},
    {label:'다음 여행 준비',action:departure},
    {label:'이야기 마치기',action:()=>{}},
  ]);return true;
}
