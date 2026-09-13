import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { encounterGuidance } from './encounter-guidance';
import { JOHTO_MOOMOO_FARM,JOHTO_ROUTE_38,JOHTO_ROUTE_39 } from './johto-olivine-approach';

const MAPS:Set<string>=new Set([JOHTO_ROUTE_38,JOHTO_ROUTE_39,JOHTO_MOOMOO_FARM]);

/** Route and farm life for the Ecruteak-to-Olivine approach; no rewards or travel locks. */
export function handleJohtoOlivineLife(g:Engine,event:string):boolean{
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const partyLine=save.party.length?`동료 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 함께 걷는 동료가 없다.';
  const visited=new Set(save.tourVisited??[]),routeLine=`방문 기록 · 38번도로 ${visited.has(JOHTO_ROUTE_38)?'있음':'없음'} · 39번도로 ${visited.has(JOHTO_ROUTE_39)?'있음':'없음'} · 튼튼목장 ${visited.has(JOHTO_MOOMOO_FARM)?'있음':'없음'}`;
  const habitat=save.map===JOHTO_ROUTE_38||save.map===JOHTO_ROUTE_39?encounterGuidance(save.map).pages:[];
  if(event==='journeyWalker'){
    if(save.map===JOHTO_ROUTE_38)g.say('38번도로 목초지 여행자',[partyLine,...habitat,'동쪽은 인주시티, 서쪽 끝은 39번도로로 꺾여 담청시티까지 내려간다.','가운데 큰길은 풀을 피하는 안전 본선이며 조우와 트레이너전은 선택이다.']);
    else if(save.map===JOHTO_ROUTE_39)g.say('39번도로 목장 주민',[partyLine,...habitat,'북쪽은 38번도로·인주, 남쪽은 담청시티, 동쪽은 튼튼목장 선택 분기다.','목장에 들르거나 풀밭에 들어가지 않아도 육상 본선으로 담청까지 갈 수 있다.']);
    else g.say('튼튼목장 돌봄 주민',[partyLine,routeLine,'작업대에서 건강한 동료와 먹이통·물그릇·울타리를 살필 수 있다.','현재 우유·아이템·회복·보상은 지급하지 않으며 서쪽 출구로 39번도로에 돌아간다.']);
    return true;
  }
  if(event==='tourRoute38EcruteakStone'||event==='tourRoute38Route39Stone'||event==='tourRoute38PastureFence'){
    g.say(event==='tourRoute38PastureFence'?'바람 목초지 관찰 울타리':'38번도로 방향 표석',[partyLine,'인주시티 ↔ 38번도로 ↔ 39번도로 ↔ 담청시티',event==='tourRoute38PastureFence'?'울타리 너머 풀결과 동료의 반응을 살필 수 있다. 관찰만으로 조우나 보상이 생기지 않는다.':'서쪽 끝에서 길이 남쪽으로 꺾이며 튼튼목장은 39번도로의 선택 분기다.']);return true;
  }
  if(event==='tourRoute39FarmStone'||event==='tourRoute39SeaFence'){
    g.say(event==='tourRoute39FarmStone'?'튼튼목장 분기 표지':'담청 바다 전망 울타리',[partyLine,routeLine,event==='tourRoute39FarmStone'?'동쪽 목장에 들렀다가 같은 출구로 돌아올 수 있다. 방문은 담청 통행 조건이 아니다.':'남쪽으로 담청 등대와 항구가 보인다. 이 육상 내리막은 40번수로와 구분한다.']);return true;
  }
  if(event==='tourMoomooCareTable'){
    if(!healthy.length){g.say('목장 돌봄 작업대',[partyLine,'함께 울타리와 물그릇을 살필 건강한 동료가 없다. 담청 또는 인주센터에서 회복한 뒤 다시 와도 된다.']);return true;}
    const current=()=>g.save===save&&save.map===JOHTO_MOOMOO_FARM&&!g.battle;
    g.say('목장 돌봄 작업대',[partyLine,'먹이통·물그릇·울타리를 함께 살필 건강한 동료를 고르자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current()||!save.party.includes(mon)||mon.hp<=0)return;
      save.flags.moomooFarmCareSpecies=mon.species;save.flags.moomooFarmCareObserved=true;g.persist();
      g.say('튼튼목장 돌봄 기록',[`${SPECIES[mon.species].name}와 먹이통의 높이, 물그릇의 깨끗함, 울타리의 열린 틈을 차례로 살폈다.`,'HP·능력·도구·돈은 변하지 않는다. 우유나 보상도 지급되지 않는다.']);
    }})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='tourMoomooPasture'){
    const species=Number(save.flags.moomooFarmCareSpecies??0),name=SPECIES[species]?.name;
    g.say('넓은 방목 울타리',[name?`${name}와 목장 작업을 살핀 기록이 있다.`:'사람과 포켓몬이 넓은 간격으로 울타리를 따라 걷는다.','현재 방목지는 생활 관찰 구역이며 야생 조우·포획·치료 장소가 아니다.']);return true;
  }
  if(event==='tourMoomooReturnStone'){g.say('39번도로 귀환 표지',['서쪽 출구 → 39번도로','39번도로 북쪽 → 38번도로·인주 / 남쪽 → 담청시티','같은 길로 목장에 다시 돌아올 수 있다.']);return true;}
  if(event==='tourMoomooPokemon'){
    const species=Number(save.flags.moomooFarmCareSpecies??0),name=SPECIES[species]?.name;
    g.say('목장 일을 돕는 알통몬',['알통! 낮은 물통을 옮긴 뒤 통행로를 비켜 선다.',name?`${name}와 남긴 돌봄 기록을 보고 울타리 쪽을 가리킨다.`:'돌봄 주민과 먹이통·물그릇·울타리를 차례로 확인한다.','주민과 함께 일하는 생활 포켓몬이며 야생 조우·포획 대상이 아니다.']);return true;
  }
  return false;
}
