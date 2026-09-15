import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const CITY='tour_castelia',ROUTE='tour_unova_route_04',CENTER='tour_castelia_center';
const DESK='tourCasteliaRouteFourDesk',WIND='tourRouteFourWindStake',SAMPLE='tourRouteFourWorkSample';
export const CASTELIA_ROUTE_FOUR_DEPARTURE={prepared:'nexusCasteliaRouteFourPrepared',species:'nexusCasteliaRouteFourSpecies',level:'nexusCasteliaRouteFourLevel',wind:'nexusCasteliaRouteFourWindChecked'} as const;

/** Optional city-to-route handoff. It records the actual lead and route visit without locking Route 4. */
export function handleCasteliaRouteFourDeparture(g:Engine,event:string):boolean{
  const save=g.save,map=save.map,player=save.player,x=player.x,y=player.y,f=CASTELIA_ROUTE_FOUR_DEPARTURE;
  if(!((map===CITY&&event===DESK)||(map===ROUTE&&event===WIND)))return false;
  const current=()=>g.save===save&&g.save.player===player&&g.save.map===map&&player.x===x&&player.y===y&&!g.battle;
  const guide=(target:string,id?:string)=>()=>{if(current())g.setTourDestination(target,id);};

  if(map===CITY){
    const lead=save.party[0],healthyLead=lead&&lead.hp>0?lead:undefined;
    const ready=Boolean(save.flags.nexusCasteliaComparisonPreserved);
    const previous=Number(save.flags[f.species]??0),previousName=SPECIES[previous]?.name;
    g.say('4번도로 출발 점검대',[
      ready?'구름의 운송길과 생활 골목 증언을 출처별로 보존했다. 다음 현장은 북쪽 4번도로다.':'동쪽 출구는 4번도로와 조인애버뉴를 지나 뇌문시티로 이어진다. 구름 현장 기록을 마치지 않아도 길은 열려 있다.',
      healthyLead?`현재 선두 ${SPECIES[healthyLead.species].name} · Lv.${healthyLead.level} · HP ${healthyLead.hp}/${healthyLead.maxHp}`:lead?`현재 선두 ${SPECIES[lead.species].name}은 지쳐 있다. 센터에서 회복한 뒤 출발 기록을 남길 수 있다.`:'현재 선두 동료가 없다. 센터 PC에서 파티를 편성할 수 있다.',
      `몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개`,
      save.flags[f.prepared]&&previousName?`앞서 ${previousName}와 남긴 출발 기록이 있다. 새 선두로 다시 기록할 수도 있다.`:'점검은 보급을 지급하거나 길을 잠그지 않는다.',
    ],undefined,[
      ...(healthyLead?[{label:`${SPECIES[healthyLead.species].name}와 출발 기록`,action:()=>{
        if(!current()||save.party[0]!==healthyLead||healthyLead.hp<=0)return;
        save.flags[f.prepared]=true;save.flags[f.species]=healthyLead.species;save.flags[f.level]=healthyLead.level;save.flags[f.wind]=false;g.persist();
        g.say('4번도로 출발 기록',[`${SPECIES[healthyLead.species].name}와 포장 큰길·동쪽 사막 분기·항구 센터 귀환 방향을 확인했다.`,'4번도로 남부의 모래바람 관측 말뚝에서 실제 바람 흔적과 비교하자.'],undefined,[{label:'4번도로로 출발',action:guide(ROUTE,WIND)},{label:'도시에서 더 준비',action:()=>{}}]);
      }}]:[]),
      {label:lead?'센터에서 회복':'센터 PC에서 편성',action:guide(CENTER,lead?'nurse':'tourExhibit1')},
      {label:'기록 없이 4번도로로',action:guide(ROUTE)},
      {label:'나중에 출발한다',action:()=>{}},
    ]);return true;
  }

  const species=Number(save.flags[f.species]??0),start=Number(save.flags[f.level]??0);
  const companion=save.party.find(mon=>mon.species===species&&mon.hp>0);
  if(!save.flags[f.prepared]){
    g.say('모래바람 관측 말뚝',['여러 높이에 남은 모래 자국이 남북 포장 본선 쪽으로 기울어 있다.','구름 동쪽 출발 점검대에서 선두 동료와 방향을 기록할 수 있지만, 기록 없이도 조인애버뉴와 뇌문으로 갈 수 있다.'],undefined,[{label:'구름 출발 점검대로',action:guide(CITY,DESK)},{label:'북쪽 본선을 계속 걷기',action:guide(ROUTE,SAMPLE)},{label:'말뚝을 더 본다',action:()=>{}}]);return true;
  }
  if(save.flags[f.wind]){
    const name=SPECIES[species]?.name??'동료';
    g.say('4번도로 바람 기록',[`${name}와 구름에서 출발한 Lv.${start} 기록, 이 말뚝에서 확인한 모래 방향이 함께 남아 있다.`,'남북 본선은 조인애버뉴·뇌문 방향이고 동쪽은 리조트데저트 선택 분기다.'],undefined,[{label:'분기 공사 표본으로',action:guide(ROUTE,SAMPLE)},{label:'구름센터로 귀환',action:guide(CENTER,'nurse')},{label:'계속 걷는다',action:()=>{}}]);return true;
  }
  if(!companion){
    g.say('모래바람 관측 말뚝',['출발 기록의 동료가 현재 건강한 파티에 없다. 모래 흔적 비교는 보류할 수 있다.','통행은 막히지 않으며 남쪽 구름센터에서 회복·편성한 뒤 다시 돌아올 수 있다.'],undefined,[{label:'구름센터로 귀환',action:guide(CENTER,'nurse')},{label:'기록 없이 북쪽으로',action:guide(ROUTE,SAMPLE)},{label:'지금은 머문다',action:()=>{}}]);return true;
  }
  g.say('모래바람 관측 말뚝',[`${SPECIES[companion.species].name}와 낮은 자국부터 높은 자국까지 살폈다.`,'낮은 모래선은 동쪽 사막 쪽에서 시작해 남북 포장 본선 가장자리에서 끊긴다. 포장길과 선택 사막 분기를 구분할 수 있다.'],undefined,[
    {label:'바람 방향을 여행 기록에 남기기',action:()=>{
      if(!current()||!save.party.includes(companion)||companion.hp<=0)return;
      save.flags[f.wind]=true;g.persist();
      g.say('구름–4번도로 출발 기록',[`구름 출발 Lv.${start} → 현재 Lv.${companion.level} · HP ${companion.hp}/${companion.maxHp}`,'포장 본선과 동쪽 사막 분기를 따로 기록했다. 다음 공사 표본에서 도로의 노반과 남겨 둔 사암을 비교하자.'],undefined,[{label:'분기 공사 표본으로',action:guide(ROUTE,SAMPLE)},{label:'구름센터로 귀환',action:guide(CENTER,'nurse')},{label:'탐험을 계속한다',action:()=>{}}]);
    }},
    {label:'나중에 기록한다',action:()=>{}},
  ]);return true;
}
