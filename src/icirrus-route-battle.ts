import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { showTrainerPreparation } from './trainer-preparation';

const MAP='tour_unova_route_08',WIN='trainerWon:unova-route-8-practice';
const local=(mon:Engine['save']['party'][number])=>mon.met==='하나 8번도로'||mon.met==='설화의 습지';

/** Regional context around the shared battle/lead-selection implementation. */
export function showIcirrusRouteBattle(g:Engine,start?:()=>void){
  const save=g.save,current=()=>g.save===save&&save.map===MAP&&!g.battle;
  if(!current())return;
  const won=!!save.flags[WIN],party=save.party.filter(local),boxed=(save.box??[]).filter(local);
  const tired=save.party.some(mon=>mon.hp<mon.maxHp);
  const guide=(map:string,event?:string)=>()=>{if(current())g.setTourDestination(map,event);};
  const prepare=()=>{if(current()&&start&&!save.flags[WIN])showTrainerPreparation(g,()=>current()&&!save.flags[WIN],start);};
  g.say('8번도로 습지 트레이너',[
    won?'좋은 승부였어. 동료들의 상태를 살피고 다음 길을 골라 보자.':'딱정곤 Lv.18과 쪼마리 Lv.19가 기다리고 있어. 이기면 상금 620원을 줄게.',
    party.length?`8번도로·습지에서 만난 파티 동료\n${party.map(mon=>`${SPECIES[mon.species].name} Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}`).join('\n')}`:boxed.length?'이 근처에서 만난 동료가 PC에 있어. 설화센터에서 데려와도 좋아.':'이 근처에서 잡은 동료가 없어도 지금 파티로 도전할 수 있어.',
    won?(tired?'지친 동료를 설화센터에서 쉬게 해 주자. 다리로 떠나는 건 그 뒤여도 괜찮아.':'동쪽 다리 너머에는 또 다른 길이 기다려. 습지로 돌아가 함께 산책해도 좋고.'):tired?'지친 동료가 있네. 회복하러 돌아가거나 건강한 동료를 먼저 내보내자.':'출전 동료를 고르면 기술을 확인한 뒤 그 동료로 배틀을 시작할 수 있어.',
    '동쪽은 튜브라인브리지→9번도로→쌍용시티, 서쪽은 설화시티야. 도전하지 않아도 길은 열려 있어.',
  ],undefined,[
    ...(!won&&start?[{label:'동료·기술을 고르고 도전',action:prepare}]:[]),
    {label:'현재 파티와 기술 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
    {label:'설화센터 회복·PC',action:guide('tour_icirrus_center')},
    {label:'동쪽 튜브라인브리지로',action:guide('tour_tubeline_bridge')},
    {label:'습지 동료 관찰로',action:guide('tour_icirrus_moor','icirrusMoorKeeper')},
    {label:won?'계속 걷는다':'나중에 도전한다',action:()=>{}},
  ]);
}
