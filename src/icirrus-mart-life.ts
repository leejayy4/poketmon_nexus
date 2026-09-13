import type { Engine } from './engine';

const MAP='tour_icirrus_mart';

/** Local preparation guidance beside the unchanged common shop counter. */
export function handleIcirrusMartLife(g:Engine,event:string):boolean{
  if(g.save.map!==MAP||event!=='tourIcirrusMartGuide')return false;
  const save=g.save,current=()=>g.save===save&&save.map===MAP&&!g.battle;
  const healthy=save.party.filter(mon=>mon.hp===mon.maxHp).length,hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
  g.say('설화 도보 여행 준비대',[save.party.length?`파티 ${save.party.length}마리 · 건강 ${healthy} · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있다. 센터 PC에서 동료를 편성할 수 있다.',`몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개 · 소지금 ${save.money}원`,'동쪽 하나 8번도로는 마른 중앙 본선과 선택 풀밭을 구분한다. 북쪽의 설화의 습지는 마른 데크 관찰지다.','설화 북문의 번호 없는 접근로는 용나선탑 기슭으로 이어진다. 접근로와 탑에는 새 야생 조우나 필수 포획이 없다.','부상·기절한 동료의 실제 회복은 상점이 아니라 설화시티 포켓몬센터에서 한다.'],undefined,[
    {label:'상점 카운터',action:()=>{if(current())g.setTourDestination(MAP,'martClerk');}},
    {label:'8번도로 준비',action:()=>{if(current())g.setTourDestination('tour_unova_route_08','routeEightGuide');}},
    {label:'설화의 습지 준비',action:()=>{if(current())g.setTourDestination('tour_icirrus_moor','icirrusMoorKeeper');}},
    {label:'용나선탑 준비',action:()=>{if(current())g.setTourDestination('tour_dragonspiral_approach','dragonspiralApproachKeeper');}},
    {label:'준비를 마친다',action:()=>{}},
  ]);return true;
}
