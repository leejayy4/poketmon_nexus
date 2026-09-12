import type { Engine } from './engine';
import type { Pokemon } from './types';
import { createTrainerBattle } from './battle';
import { pokemonMoves,SPECIES } from './pokemon';
import { maxHpAtLevel } from './growth';
import { getMap } from './maps';
import { journeyConnection } from './journey-world';

type PracticeTrainer={map:string;event:string;id:string;name:string;reward:number;team:number[][];lesson?:'type'|'switch';localPages?:string[];battlePage?:string};
const trainers:PracticeTrainer[]=[
  {map:'tour_ilex',event:'tourIlexTrainer',id:'ilex-forest-practice',name:'너도밤나무숲 곤충채집가',reward:540,team:[[10,22],[13,23],[41,24]],battlePage:'숲에서 관찰하며 키운 세 친구야.\n긴풀 옆 마른 공터에서 시작하자!',localPages:[
    '캐터피와 뿔충이를 관찰하다 주뱃도 만났어.\n남쪽 순환길 공터에서 겨뤄 볼래?',
    '두 애벌레 포켓몬의 움직임을 살핀 뒤\n더 빠른 주뱃이 나오면 기술과 교대를 다시 골라 봐.',
    '배틀은 선택이야. 표시된 흙길은 북쪽 34번도로와\n동쪽 고동마을 사이에서 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_9',event:'tourRoute9Trainer',id:'kanto-route-9-practice',name:'9번도로 캠프 트레이너',reward:500,team:[[21,23],[23,24]],battlePage:'산등성이에서 만난 동료들과 길을 익혔어.\n낮은 우회길 공터에서 시작하자!',localPages:[
    '9번도로에서 만난 깨비참과 아보를 키우고 있어.\n남쪽 우회길에서 선택 배틀을 할래?',
    '깨비참의 빠른 비행 공격 뒤에는 아보가 나와.\n동료의 남은 HP와 교대 순서를 살펴봐.',
    '배틀하지 않아도 중앙 고지 본선으로\n블루시티와 10번도로를 오갈 수 있어.'
  ]},
  {map:'tour_kanto_rock_tunnel_b1f',event:'tourRockTunnelTrainer',id:'kanto-rock-tunnel-practice',name:'돌산터널 암반 트레이너',reward:620,team:[[41,23],[74,24],[66,25]],battlePage:'동굴에서 만난 세 동료의 움직임을 보여 줄게.\n메아리 순환로 공터에서 겨뤄 보자!',localPages:[
    '주뱃·꼬마돌·알통몬과 암반을 살피는 중이야.\n서쪽 메아리 순환로에서 연습할래?',
    '비행·독, 바위·땅, 격투 타입이 차례로 나와.\n한 기술만 고집하지 말고 교대도 생각해 봐.',
    '배틀은 선택이야. 밝은 광물 표식 본선은\n양쪽 1F 계단까지 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_10_south',event:'tourRoute10SouthTrainer',id:'kanto-route-10-south-practice',name:'10번도로 포켓몬 트레이너',reward:560,team:[[21,24],[95,25]],battlePage:'산길에서 함께 걸어온 친구들이야.\n전망 언덕 안쪽 공터에서 시작하자!',localPages:[
    '깨비참과 롱스톤을 번갈아 돌보며 내려왔어.\n보라타운이 보이는 공터에서 겨뤄 볼래?',
    '빠른 비행 공격 다음에는 단단한 바위·땅 동료야.\n상대가 바뀌면 유리한 기술도 다시 골라 봐.',
    '거절해도 북쪽 돌산터널과 남쪽 보라타운을\n잇는 가운데 내리막은 언제든 지나갈 수 있어.'
  ]},
  {map:'tour_johto_route_33',event:'tourRoute33Trainer',id:'johto-route-33-practice',name:'33번도로 새잡이',reward:480,team:[[19,23],[21,24]],battlePage:'빗길에서 함께 키운 친구들이야.\n좋아, 안전한 공터에서 겨뤄 보자!',localPages:[
    '풀밭에서 만난 꼬렛과 깨비참을 키우고 있어.\n빗길 옆 공터에서 짧게 겨뤄 볼래?',
    '꼬렛의 빠른 물기와 깨비참의 비행 공격을\n상대할 동료와 기술을 골라 봐.',
    '배틀은 선택이야. 가운데 젖은 흙길로\n연결동굴과 고동마을을 계속 오갈 수 있어.'
  ]},
  {map:'tour_union_cave_1f',event:'tourUnionCaveTrainer',id:'union-cave-1f-practice',name:'연결동굴 암반 트레이너',reward:600,team:[[41,23],[74,24],[95,25]],battlePage:'동굴에서 만난 세 친구의 차이를 보여 줄게.\n발밑이 마른 공터에서 시작하자!',localPages:[
    '주뱃·꼬마돌·롱스톤과 동굴을 살피는 중이야.\n마른 암반 공터에서 선택 배틀을 할까?',
    '비행·독인 주뱃 뒤에는 바위·땅 동료들이 나와.\n상대가 바뀌면 기술과 교대를 다시 살펴봐.',
    '배틀하지 않아도 동쪽 33번도로와\n북쪽 32번도로 사이 본선은 열려 있어.'
  ]},
  {map:'tour_johto_route_32',event:'tourRoute32Trainer',id:'johto-route-32-practice',name:'32번도로 피크닉 트레이너',reward:520,team:[[23,24],[19,25]],battlePage:'긴 길에서 함께 걸어온 친구들이야.\n난간 안쪽 공터에서 겨뤄 보자!',localPages:[
    '물가 풀밭에서 만난 아보와 꼬렛을 돌보고 있어.\n긴 길을 쉬어 가며 연습할래?',
    '아보의 독 타입과 꼬렛의 빠른 노말 공격을 보고\n동료의 타입과 남은 HP를 함께 생각해 봐.',
    '배틀은 선택이야. 북쪽은 도라지시티,\n남쪽은 연결동굴과 고동마을로 이어져.'
  ]},
  {map:'tour_route_34',event:'tourRoute34Trainer',id:'route-34-field-practice',name:'34번도로 트레이너',reward:480,team:[[19,22],[96,23]],localPages:[
    '이 길에서 만난 꼬렛과 슬리프를 키우고 있어.\n숲에 들어가기 전에 함께 겨뤄 볼래?',
    '꼬렛은 빠르게 먼저 움직이고,\n슬리프는 염동력과 단단한 특수방어를 살려.',
    '배틀은 선택이야. 남쪽 큰길은 언제든\n너도밤나무숲으로 이어져 있어.'
  ]},
  {map:'tour_sinnoh_route_03',event:'journeyWalker',id:'eterna-forest-practice',name:'숲길 트레이너',reward:240,team:[[406,11],[396,12]],localPages:[
    '숲에서 만난 동료들과 영원시티까지\n걸어가는 중이야. 잠깐 연습할까?',
    '꼬몽울 다음에는 찌르꼬가 나와.\n상대가 바뀌면 기술과 교대를 살펴봐.',
    '왼쪽은 영원숲, 오른쪽은 영원시티야.\n도시 센터에서 쉬고 유채를 만나 봐.'
  ]},
  {map:'route_s01',event:'roadworker',id:'west-road-practice',name:'도로 정비원',reward:160,team:[[396,4]]},
  {map:'tour_pass_jubilife_oreburgh',event:'journeyWalker',id:'oreburgh-cave-practice',name:'산행객',reward:300,team:[[74,7],[41,7]]},
  {map:'oreburgh_gym',event:'gymTypeTrainer',id:'oreburgh-gym-types',name:'체육관 수련생',reward:200,team:[[74,7]],lesson:'type'},
  {map:'oreburgh_gym',event:'gymSwitchTrainer',id:'oreburgh-gym-switch',name:'체육관 연습생',reward:320,team:[[95,8],[396,7]],lesson:'switch'}
];
export const trainerWinFlag=(id:string)=>'trainerWon:'+id;

function gymLesson(lesson:'type'|'switch'):string[]{
  return lesson==='type'?[
    '꼬마돌은 바위·땅 타입이야.\n물·풀·격투 기술로 약점을 노려 봐.',
    '최대 네 기술의 효과를 살펴봐.\n위력뿐 아니라 상대 타입도 중요해.',
    'X → 포켓몬 → 정보 → 기술 배우기에서\n지금 배울 수 있는 기술을 준비해.'
  ]:[
    '롱스톤 다음에는 찌르꼬가 나와.\n같은 기술이 모두에게 유리하진 않아.',
    '롱스톤에는 물·풀·격투가 유리해.\n찌르꼬에게는 전기나 바위가 유리해.',
    '상대가 바뀔 때 포켓몬을 교대해 봐.\n전투 중 교대하면 상대도 행동해.'
  ];
}

const directionName=(direction:string|undefined)=>({up:'북쪽',right:'동쪽',down:'남쪽',left:'서쪽'} as Record<string,string>)[direction??'']??'해당';
function roadGuidance(){
  const route=getMap('route_s01',{departureCleared:true});
  const west=journeyConnection(route,'tour_jubilife');
  const city=getMap('tour_jubilife',{departureCleared:true});
  const south=journeyConnection(city,'tour_oreburgh');
  return [
    `${directionName(west?.entry)} 출구로 가면 축복시티야.`,
    `축복시티의 ${directionName(south?.entry)} 출구에서 암반굴을 지나면\n무쇠시티와 첫 체육관으로 이어진단다.`
  ];
}
const johtoWinRoutes:Record<string,{next:string;nextLabel:string;advice:string}>={
  'ilex-forest-practice':{next:'tour_azalea',nextLabel:'고동마을로 진행',advice:'애벌레 포켓몬 뒤 빠른 주뱃이 나올 때 기술과 교대를 잘 바꾸었어.'},
  'johto-route-33-practice':{next:'tour_union_cave_1f',nextLabel:'연결동굴로 진행',advice:'빠른 노말 공격과 비행 공격에 맞설 동료를 잘 골랐어.'},
  'union-cave-1f-practice':{next:'tour_johto_route_32',nextLabel:'32번도로로 진행',advice:'상대가 주뱃에서 바위·땅 동료로 바뀔 때 기술과 교대를 잘 살폈어.'},
  'johto-route-32-practice':{next:'tour_violet',nextLabel:'도라지시티로 진행',advice:'독 타입과 빠른 노말 공격을 상대로 파티의 남은 힘을 잘 나누었어.'},
};
export function handleRoadTrainer(g:Engine,event:string):boolean{
  const trainer=trainers.find(t=>t.map===g.save.map&&t.event===event);if(!trainer)return false;
  const badged=g.save.badges.includes('BADGE-GS01');
  if(trainer.id==='route-34-field-practice'&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    g.say(trainer.name,['함께 겨뤄 보니 동료들의 장점이 잘 보이네!','꼬렛은 빠른 공격, 슬리프는 염동력과\n특수 공격을 견디는 힘을 살렸어.','북쪽 금빛에서 쉬거나 기술을 준비하고,\n남쪽 숲으로 여행을 계속해도 좋아.'],undefined,[
      {label:'금빛센터 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','nurse');}},
      {label:'기술 작업방 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_home2','tourHost');}},
      {label:'너도밤나무숲 안내',action:()=>{if(current())g.setTourDestination('tour_ilex');}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  const johtoWin=johtoWinRoutes[trainer.id];
  if(johtoWin&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const origins=new Set(['너도밤나무숲','성도 33번도로','연결동굴 1층','성도 32번도로']);
    const owned=[...save.party,...save.box??[]].filter(mon=>origins.has(mon.met));
    const names=[...new Set(owned.map(mon=>SPECIES[mon.species].name))].slice(0,4).join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say(trainer.name,['함께 겨룬 승리 기록이 남아 있어. 상금은 이미 받았어.',johtoWin.advice,`숲·도로·동굴에서 만난 보유 동료 ${owned.length}마리\n${names}`,save.party.length?`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어. 고동센터 PC에서 동료를 편성하자.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current())return;g.panel='party';g.partyIndex=0;}},
      {label:'고동센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_azalea_center','pc');}},
      {label:johtoWin.nextLabel,action:()=>{if(current())g.setTourDestination(johtoWin.next);}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  if(trainer.localPages&&g.save.flags[trainerWinFlag(trainer.id)]){g.say(trainer.name,['함께 연습하니 동료들의 장점이 보이네!\n다음 여행에서도 서로 도와주자.',...trainer.localPages.slice(1)]);return true;}
  if(g.save.flags[trainerWinFlag(trainer.id)]){g.say(trainer.name,trainer.lesson?[
    badged?'콜배지 축하해! 함께 연습한 판단을\n다음 여행에서도 살려 봐.':'좋은 연습이었어! 준비가 되면\n가운데 길로 강석에게 가 봐.',...gymLesson(trainer.lesson)
  ]:trainer.map==='route_s01'?[`좋은 연습이었어! ${roadGuidance()[0]}`,`${roadGuidance()[1]}\n센터와 상점에서 준비하고 가.`]:['좋은 연습이었어! 동료마다 잘하는\n기술을 살려 다음 도전도 힘내 봐.','바위와 동굴의 포켓몬은 약점도 달라.\n배운 기술 중 무엇을 쓸지 살펴봐.']);return true;}
  const needsDeparture=trainer.map!=='tour_route_34';
  if((needsDeparture&&!g.save.flags.departureCleared)||!g.save.party.some(p=>p.hp>0)){g.say(trainer.name,[needsDeparture?'건강한 파트너와 출발 준비를 마치면\n짧은 연습 배틀을 해 보자.':'건강한 동료와 함께 돌아오면\n34번도로에서 겨뤄 보자.']);return true;}
  const save=g.save;
  const current=()=>g.save===save&&save.map===trainer.map&&!g.battle&&!save.flags[trainerWinFlag(trainer.id)];
  if(trainer.localPages){
    g.say(trainer.name,[trainer.localPages[0],trainer.team.map(([id,level])=>`${SPECIES[id].name} Lv.${level}`).join(' / ')+`\n이기면 ${trainer.reward}원을 줄게.`],undefined,[
      {label:'배틀한다',action:()=>{
        if(!current())return;
        const team=trainer.team.map(([species,level])=>{const maxHp=maxHpAtLevel(species,level);const p:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'연습 배틀'};p.moves=pokemonMoves(p);return p;});
        g.battle=createTrainerBattle(save,{...trainer,team});if(g.battle){g.persist();g.say(trainer.name,[trainer.battlePage??'숲에서 함께 걸어온 친구들이야.\n좋아, 같이 연습해 보자!']);}
      }},
      {label:'준비 이야기를 듣는다',action:()=>{if(current())g.say(trainer.name,trainer.localPages!.slice(1));}},
      {label:'다음에 한다',action:()=>{}}
    ]);return true;
  }
  g.say(trainer.name,[trainer.lesson?(badged?'콜배지 축하해! 다음 여행 전에\n함께 연습 배틀을 해 볼까?':'관장전 전에 연습 배틀을 해 볼까?\n바로 강석에게 도전해도 괜찮아.'):'길에서 만난 트레이너끼리\n짧게 연습 배틀을 해 볼까?',...(trainer.map==='route_s01'?roadGuidance():[]),trainer.team.map(([id,level])=>`${SPECIES[id].name} Lv.${level}`).join(' / ')+`\n이기면 ${trainer.reward}원을 줄게.`],undefined,[
    {label:'배틀한다',action:()=>{
      if(!current())return;
      const team:Pokemon[]=trainer.team.map(([species,level])=>{const maxHp=maxHpAtLevel(species,level),p:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'연습 배틀'};p.moves=pokemonMoves(p);return p;});
      g.battle=createTrainerBattle(save,{...trainer,team});if(g.battle){g.persist();g.say(trainer.name,[`좋아! ${SPECIES[team[0].species].name},\n같이 연습해 보자!`]);}
    }},
    {label:'도움말을 듣는다',action:()=>{if(current())g.say(trainer.name,trainer.lesson?gymLesson(trainer.lesson):trainer.map==='route_s01'?[...roadGuidance(),'풀밭에서 새 동료를 만나고\n센터에서 회복한 뒤 도전해 봐.','기술을 바꾸려면 X → 포켓몬 →\n정보 화면의 기술 배우기를 선택해.']:[ '남쪽 자갈밭에서 동료를 만나 봐.\n밝은 통로는 조우를 피하는 길이야.', '센터에서 회복한 뒤 도전해 봐.','기술을 바꾸려면 X → 포켓몬 →\n정보 화면의 기술 배우기를 선택해.']);}},
    {label:'다음에 한다',action:()=>{}}
  ]);return true;
}
