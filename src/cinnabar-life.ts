import type { Engine } from './engine';
import { handleCinnabarEvacuation } from './cinnabar-evacuation';
import { handleCinnabarRescueWork } from './cinnabar-rescue-work';
import { handleCinnabarRescueArrival } from './cinnabar-rescue-arrival';
import type { GameMap } from './types';
import type { TourInterior,FurnishingKind } from './explore-interiors';
import { CINNABAR_ROUTE,CINNABAR_DEPARTURE_ROUTE } from './cinnabar-layout';
import { KANTO_ROUTE_TWENTY } from './kanto-south-sea-route';
import { handleSeafoamExploration,showSeafoamNotebook } from './seafoam-exploration';
import { handleRoute20HomewardBattle } from './route20-homeward-battle';
import { CINNABAR_SHORE_EVENT,CINNABAR_SHORE_HANDOFF } from './cinnabar-evacuation-state';
import { SPECIES } from './pokemon';
import { isSeafoamCompanion } from './cinnabar-habitats';
import { encounterOrigin } from './runtime-encounters';

let seafoamNotebookEvent:string|undefined;
const shoreCareEvents=new Map<string,string>();
const SHORE_CARE_PREPARED='nexusCinnabarShoreCarePrepared';
const SEAFOAM_CINNABAR_RETURN_REVIEWED='seafoamCinnabarReturnReviewed';
const CINNABAR_ROUTE20_LANDING='tourCinnabarRoute20Landing';

const homes=[
  {id:'tour_cinnabar_home1',title:'바닷가 동료의 집',host:'동료를 돌보는 주민',objects:[['함께 쓰는 식탁','사람의 식기 옆에 낮은 물그릇이 있다.\n바닷바람에 날리지 않게 받침을 놓았다.'],['돌봄 기록','풀밭에서 돌아오면 몸 상태를 살피고\n다쳤을 때는 센터에 가자는 메모다.'],['동료의 잠자리','모래를 털어 낸 작은 방석이다.\n창가에는 그늘이 드리워져 있다.'],['창가 화분','짠 바람을 피하도록 창 안쪽에 두었다.']]},
  {id:'tour_cinnabar_home2',title:'섬 여행자의 작업방',host:'여행 준비를 하는 주민',objects:[['가방 수선대','볼 주머니와 어깨끈을 손질하는 자리다.\n옆에는 동료가 쉬는 자리가 있다.'],['해안길 수첩','북쪽은 태초–홍련 해안길,\n동쪽은 홍련–갈색 해안길이라고 적혀 있다.'],['여행 준비 소파','출발 전에 함께 쉬며 짐을 정리한다.'],['물뿌리개와 화분','여행을 떠나면 이웃이 물을 주기로 했다.']]},
];

export function installCinnabarHomes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>){
  for(const home of homes){
    const map=maps[home.id],room=rooms[home.id];
    map.name='홍련섬 · '+home.title;room.title=home.title;map.npcs[0].name=home.host;
    room.greeting=['포켓몬과 함께 사는 집이에요.\n여행 준비를 하고 가세요.'];
    const kinds:FurnishingKind[]=['workbench','chart','bench','plants'];
    room.objects.forEach((o,i)=>{o.name=home.objects[i][0];o.pages=[home.objects[i][1]];o.kind=kinds[i]??o.kind;});
    if(home.id==='tour_cinnabar_home2')seafoamNotebookEvent=room.objects[1]?.event;
    if(home.id==='tour_cinnabar_home1')for(const object of room.objects)shoreCareEvents.set(object.event,object.name);
  }
}

function handleCinnabarHomecoming(g:Engine,event:string):boolean{
  const save=g.save;
  if(save.map!=='tour_cinnabar_home1'||save.flags[CINNABAR_SHORE_HANDOFF]!==true)return false;
  const object=shoreCareEvents.get(event);
  if(event!=='tourHost'&&!object)return false;
  const current=()=>g.save===save&&save.map==='tour_cinnabar_home1'&&!g.battle&&!g.move&&!g.transition;
  const guide=(map:string,target?:string)=>()=>{if(current())g.setTourDestination(map,target);};
  const prepared=save.flags[SHORE_CARE_PREPARED]===true;
  if(object){
    const pages:Record<string,string[]>={
      '함께 쓰는 식탁':prepared?['해안으로 가져갈 낮은 물그릇과 사람의 물병을 나누어 놓았다. 피카츄와 알통몬이 급하게 마시지 않도록 작은 그릇부터 채운다.']:['낮은 물그릇을 씻어 두었다. 마른 깔개까지 챙기면 해안 돌봄 자리에 가져갈 수 있다.'],
      '돌봄 기록':prepared?['피카츄·알통몬의 호흡, 먹이, 휴식 시간을 따로 기록한다. 제어 설비 기록과 살아 있는 포켓몬의 상태를 한 항목으로 뭉치지 않았다.']:['분화 뒤 다시 꾸린 집에서 포켓몬의 상태를 먼저 살피자는 기록이다. 이번 해안 인계 내용은 아직 빈칸이다.'],
      '동료의 잠자리':prepared?['여분의 마른 깔개를 접어 해안 바람막이에 보낼 꾸러미로 묶었다. 집의 동료가 쓰는 자리는 그대로 남겼다.']:['창가의 그늘진 방석 옆에 여분의 마른 깔개가 있다.'],
      '창가 화분':prepared?['짠 바람에 강한 잎의 방향을 보고 해안 바람막이 입구가 바람을 등지도록 표시했다.']:['잎이 한쪽으로 눕는다. 오늘 해안의 바람 방향을 짐작할 수 있다.'],
    };
    g.say(object,pages[object]??['해안 돌봄을 위한 생활 기록이 남아 있다.'],undefined,[
      {label:'해안 돌봄 자리로',action:guide('tour_cinnabar',CINNABAR_SHORE_EVENT)},
      {label:'집을 더 둘러본다',action:()=>{}},
    ]);return true;
  }
  const healthy=save.party.filter(mon=>mon.hp>0);
  const partnerId=Number(save.flags.nexusCinnabarShoreCarePartner??0);
  const partnerName=SPECIES[partnerId]?.name;
  const show=()=>{
    if(!current())return;
    g.say('동료를 돌보는 주민',[
      prepared?`해안 돌봄 꾸러미를 준비했다${partnerName?`. ${partnerName}도 마른 깔개와 물그릇을 함께 확인했다.`:'.'}`:'피카츄와 알통몬이 해안에 무사히 도착했군요. 이 집에서 쓰는 방식대로 물그릇·마른 깔개·바람막이 방향을 함께 챙겨 주세요.',
      prepared?'돌봄 기록에는 두 포켓몬의 호흡·먹이·휴식을 따로 남겼어요. 이제 센터에서 파티를 쉬게 하거나 공식 20번수로로 다음 여행을 떠날 수 있어요.':'건강한 파티 동료와 준비하면 운반할 물건과 사람들이 걷는 길을 다시 확인할 수 있어요. 준비하지 않아도 도시와 수로 통행은 열려 있어요.',
      'HGSS의 분화 이후 홍련을 바탕으로 하되, 이 주거 구역과 연구소는 넥서스에서 다시 꾸린 생활 공간이에요.',
    ],undefined,[
      ...(!prepared&&healthy.length?[{label:'동료와 돌봄 꾸러미 준비',action:()=>{
        if(!current()||save.flags[SHORE_CARE_PREPARED])return;
        const partner=save.party.find(mon=>mon.hp>0);if(!partner)return;
        save.flags[SHORE_CARE_PREPARED]=true;save.flags.nexusCinnabarShoreCarePartner=partner.species;g.persist();show();
      }}]:[]),
      ...(!prepared&&!healthy.length?[{label:'센터에서 동료 회복',action:guide('tour_cinnabar_center','nurse')}]:[]),
      {label:'해안의 두 포켓몬에게',action:guide('tour_cinnabar',CINNABAR_SHORE_EVENT)},
      {label:'홍련센터에서 쉬기',action:guide('tour_cinnabar_center','nurse')},
      {label:'20번수로로 다음 여행',action:guide(KANTO_ROUTE_TWENTY,'route20HomewardKeeper')},
      {label:'집에 머문다',action:()=>{}},
    ]);
  };
  show();return true;
}

/** The west landing consumes the cave trip without turning research or capture into a travel lock. */
function handleSeafoamCinnabarReturn(g:Engine,event:string):boolean{
  const save=g.save;
  if(save.map!=='tour_cinnabar'||event!==CINNABAR_ROUTE20_LANDING)return false;
  const current=()=>g.save===save&&save.map==='tour_cinnabar'&&!g.battle&&!g.move&&!g.transition;
  const guide=(map:string,target?:string)=>()=>{if(current())g.setTourDestination(map,target);};
  const marks=['tour_kanto_seafoam_1f','tour_kanto_seafoam_b1f','tour_kanto_seafoam_b2f','tour_kanto_seafoam_b3f','tour_kanto_seafoam_b4f']
    .filter(map=>save.flags[`seafoamFieldMark:${map}`]===true).length;
  const owned=[...save.party,...(save.box??[])];
  const companions=owned.filter(isSeafoamCompanion);
  const b4Origin=encounterOrigin('tour_kanto_seafoam_b4f');
  const deepest=companions.filter(mon=>mon.met===b4Origin);
  const injured=save.party.filter(mon=>mon.hp<mon.maxHp).length;
  const first=save.flags[SEAFOAM_CINNABAR_RETURN_REVIEWED]!==true;
  if(first&&(marks>0||companions.length>0)){
    save.flags[SEAFOAM_CINNABAR_RETURN_REVIEWED]=true;g.persist();
  }
  g.say('20번수로 홍련 상륙표',[
    '동쪽 연락선은 관동 20번수로 서쪽 구간과 쌍둥이섬 1F→B1F→B2F→B3F→B4F를 거쳐 반대편으로 이어진다.',
    marks?`쌍둥이섬 현장 표시 ${marks}/5곳을 남기고 홍련으로 돌아왔다.`:'아직 쌍둥이섬 현장 표시는 없다. 동굴을 통과하거나 다시 돌아가는 데 필요한 조건은 아니다.',
    deepest.length?`최하층에서 만난 동료 · ${deepest.map(mon=>`${SPECIES[mon.species].name} Lv.${mon.level}`).join(' · ')}\n연구소에서 그 층의 만남과 현재 기술을 살필 수 있다.`:companions.length?`쌍둥이섬에서 만난 동료 ${companions.length}마리의 출처를 수첩이 기억한다.\n최하층 포획 없이도 연구와 다음 여행을 계속할 수 있다.`:'포획한 동료가 없어도 귀환과 다음 출발은 자유롭다.',
    injured?`현재 파티에서 회복이 필요한 동료 ${injured}마리. 서쪽 상륙로에서 북동쪽 센터로 먼저 갈 수 있다.`:'현재 파티는 모두 건강하다. 센터·연구소를 둘러본 뒤 같은 20번수로로 재출발할 수 있다.',
    first&&(marks>0||companions.length>0)?'이번 귀환 내용을 홍련 여행 수첩에 남겼다. 보상이나 통행 조건은 바뀌지 않는다.':'기록을 다시 확인했다. 쌍둥이섬과 20번수로는 양방향으로 열려 있다.',
  ],undefined,[
    {label:'홍련센터에서 회복',action:guide('tour_cinnabar_center','nurse')},
    {label:'연구소에서 비교',action:guide('tour_cinnabar_hall','tourExhibit2')},
    {label:'20번수로로 재출발',action:guide(KANTO_ROUTE_TWENTY)},
    {label:'상륙지를 더 살핀다',action:()=>{}},
  ]);return true;
}

export function handleCinnabarLife(g:Engine,event:string):boolean{
  if(handleCinnabarEvacuation(g,event))return true;
  if(handleCinnabarRescueWork(g,event))return true;
  if(handleCinnabarRescueArrival(g,event))return true;
  if(handleSeafoamExploration(g,event))return true;
  if(handleRoute20HomewardBattle(g,event))return true;
  if(handleCinnabarHomecoming(g,event))return true;
  if(handleSeafoamCinnabarReturn(g,event))return true;
  if(g.save.map==='tour_cinnabar_home2'&&event===seafoamNotebookEvent){showSeafoamNotebook(g);return true;}
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
    g.say('홍련에서 다음 여행',['서쪽 관동20번수로 → 쌍둥이섬 → 19번수로 → 연분홍시티','북쪽 태초–홍련 해안길은 공식21번수로를 대신하는 현재 도보 재구성이며, 동쪽 홍련–갈색 해안길은 원작에 없는 창작 직결로예요.','세 길은 연구소 관찰이나 포획을 출발 조건으로 삼지 않아요.'],undefined,[
      {label:'연분홍행 공식 항로',action:guide(KANTO_ROUTE_TWENTY)},
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
    ...(home?.id==='tour_cinnabar_home2'?[{label:'쌍둥이섬 수첩 보기',action:()=>{if(current())showSeafoamNotebook(g);}}]:[]),
    {label:'센터·PC 안내',action:guide('tour_cinnabar_center','nurse')},
    {label:'상점 안내',action:guide('tour_cinnabar_mart','martClerk')},
    {label:'다음 여행 준비',action:departure},
    {label:'이야기 마치기',action:()=>{}},
  ]);return true;
}
