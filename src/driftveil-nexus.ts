import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { leadPokemon } from './team';

export const DRIFTVEIL_NEXUS={
  route:'nexusRouteFiveGrassCompared',bridge:'nexusDrawbridgeShadowCompared',arrival:'nexusDriftveilArrivalLogged',
  partner:'nexusDriftveilWorkPartner',slot:'nexusDriftveilWorkPartnerSlot',prepared:'nexusDriftveilCargoPartnerPrepared',sorted:'nexusDriftveilCargoSorted',rested:'nexusDriftveilPartnerRested',ledger:'nexusDriftveilLedgerPreserved',
} as const;
const sessions=new WeakMap<Engine,object>();
const unlocked=(g:Engine)=>Boolean(g.save.flags.nexusNimbasaVoicesPreserved);

function context(g:Engine){
  const save=g.save,player=save.player,map=save.map,x=player.x,y=player.y,token={};sessions.set(g,token);
  const active=()=>g.save===save&&g.save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&unlocked(g);
  const guide=(target:string,event?:string)=>()=>{if(active())g.setTourDestination(target,event);};
  const commit=(flag:string,value:boolean|number=true)=>{if(!active())return false;save.flags[flag]=value;g.persist();return true;};
  return {save,active,guide,commit};
}

/** Optional Route 5 and bridge observations. Neither recreates the Elesa/Charles gate. */
export function handleDriftveilJourney(g:Engine,event:string):boolean{
  if(!unlocked(g))return false;
  const f=DRIFTVEIL_NEXUS,{save,active,guide,commit}=context(g);
  if(save.map==='tour_pass_nimbasa_driftveil'&&event==='tourRouteFiveFoodTruck'){
    const first=!save.flags[f.route];
    g.say('5번도로 푸드트럭',[first?'포장 본선 옆 트레일러와 공연 공터, 북쪽의 좁은 풀밭을 서로 다른 공간으로 기록했다.':'포장 본선과 북쪽 풀밭의 구분이 수첩에 남아 있다.','북쪽 풀밭에서는 치라미를 만날 수 있다. 포획하지 않아도 본선과 도개교는 계속 열린다.'],undefined,[
      {label:first?'도로와 풀밭을 기록':'북쪽 풀밭으로',action:()=>{if(first&&!commit(f.route))return;guide('tour_pass_nimbasa_driftveil')();}},
      {label:'공연가와 배틀 준비',action:guide('tour_pass_nimbasa_driftveil','tourRouteFiveTrainer')},
      {label:'도개교로 진행',action:guide('tour_driftveil_drawbridge','tourDrawbridgeWingWatch')},
    ]);return true;
  }
  if(save.map==='tour_driftveil_drawbridge'&&event==='tourDrawbridgeWingWatch'){
    const first=!save.flags[f.bridge];
    g.say('도개교 그림자 관찰선',[first?'강 위를 도는 꼬지보리의 그림자가 보행판에 잠깐 머문다. 그림자 지점은 다리 전체의 풀밭이 아니다.':'꼬지보리 그림자 지점과 안전 보행선이 수첩에 따로 남아 있다.','그림자에서는 선택 조우가 생길 수 있지만 떨어지는 날개 도구와 개폐 시간 사건은 아직 적용하지 않았다.'],undefined,[
      {label:first?'그림자와 보행선 기록':'그림자를 다시 살핀다',action:()=>{if(first&&!commit(f.bridge))return;guide('tour_driftveil_drawbridge')();}},
      {label:'물풍경시티로 건너간다',action:guide('tour_driftveil','tourResident0')},
      {label:'5번도로로 돌아간다',action:guide('tour_pass_nimbasa_driftveil')},
    ]);return true;
  }
  return false;
}

export function handleDriftveilCity(g:Engine,event:string):boolean{
  if(!unlocked(g)||g.save.map!=='tour_driftveil')return false;
  const f=DRIFTVEIL_NEXUS,{save,active,guide,commit}=context(g);
  if(event==='tourResident0'){
    if(!save.flags[f.arrival])commit(f.arrival);
    g.say('도개교 도착 여행자',[save.flags[f.bridge]?'5번도로의 북쪽 풀밭과 도개교 그림자를 구분해 건너왔군요.':'도개교 동쪽 보행선을 따라 시장 도시까지 왔군요.','서쪽 시장 배달 상인이 실제 화물 분류를 도와줄 건강한 동료를 찾고 있어요.'],undefined,[{label:'시장 배달 상인에게',action:guide('tour_driftveil','tourResident1')},{label:'포켓몬센터로',action:guide('tour_driftveil_center','nurse')},{label:'도개교로 돌아간다',action:guide('tour_driftveil_drawbridge')}]);return true;
  }
  if(event==='tourResident1'){
    if(save.flags[f.ledger]){const species=Number(save.flags[f.partner]??0);g.say('시장 배달 상인',[`${SPECIES[species]?.name??'동료'}와 마친 분류와 휴식 기록이 시장 2층 장부에 남아 있어요.`,'오늘 파티가 달라져도 다른 포켓몬을 그날의 동료로 대신 세지 않아요. 북쪽 6번도로로 떠나거나 도개교를 건너 뇌문으로 돌아갈 수 있어요.'],undefined,[{label:'6번도로로',action:guide('tour_pass_driftveil_mistralton')},{label:'도개교로',action:guide('tour_driftveil_drawbridge')},{label:'시장에 머문다',action:()=>{}}]);return true;}
    const stored=save.flags[f.slot],selected=typeof stored==='number'&&save.party[stored]?.species===save.flags[f.partner]?save.party[stored]:undefined;
    if(save.flags[f.sorted]&&selected){g.say('시장 배달 상인',['목적지 표식별로 나눈 바구니가 텃밭 가장자리에 놓여 있어요.','동쪽 작업장의 알통몬이 쉬는 급수대를 살펴봐 주세요.'],undefined,[{label:'알통몬에게',action:guide('tour_driftveil','tourResident4')},{label:'배달 텃밭 다시 보기',action:guide('tour_driftveil','tourOutdoor7')}]);return true;}
    if((save.flags[f.prepared]||save.flags[f.sorted])&&!selected){g.say('시장 배달 상인',['함께 일하기로 한 동료가 현재 파티에 없어요. 다른 포켓몬을 그 동료로 대신 기록하지 않을게요.','센터 PC에서 다시 데려오거나 여기서 새 동료를 고르면 바구니 분류를 처음부터 시작할 수 있어요.'],undefined,[{label:'새 동료를 고른다',action:()=>{if(active()){delete save.flags[f.prepared];delete save.flags[f.sorted];delete save.flags[f.rested];delete save.flags[f.ledger];delete save.flags[f.slot];g.persist();g.setTourDestination('tour_driftveil','tourResident1');}}},{label:'센터 PC로',action:guide('tour_driftveil_center','pc')},{label:'나중에 돕는다',action:()=>{}}]);return true;}
    if(selected?.hp===0){g.say('시장 배달 상인',[`${SPECIES[selected.species].name}가 지쳐 있어요. 바구니를 옮기기 전에 센터에서 쉬게 해 주세요.`],undefined,[{label:'센터로',action:guide('tour_driftveil_center','nurse')},{label:'다른 동료를 고른다',action:()=>{if(active()){delete save.flags[f.prepared];delete save.flags[f.slot];g.persist();g.setTourDestination('tour_driftveil','tourResident1');}}}]);return true;}
    if(save.flags[f.prepared]&&selected){g.say('시장 배달 상인',[`${SPECIES[selected.species].name}와 맡을 표식을 정했어요.`,'남쪽 시장 배달 텃밭의 바구니를 직접 살펴보고 농산물·광물·생활 물품을 나눠 주세요.'],undefined,[{label:'배달 텃밭으로',action:guide('tour_driftveil','tourOutdoor7')},{label:'동료를 다시 고른다',action:()=>{if(active()){delete save.flags[f.prepared];delete save.flags[f.slot];g.persist();g.setTourDestination('tour_driftveil','tourResident1');}}}]);return true;}
    const candidates=save.party.filter(mon=>mon.hp>0);
    if(!candidates.length){g.say('시장 배달 상인',['화물을 나누기 전에 건강한 동료가 필요해요.','북서쪽 센터에서 회복하거나 PC로 편성한 뒤 돌아와 주세요.'],undefined,[{label:'센터로',action:guide('tour_driftveil_center','nurse')},{label:'그냥 둘러본다',action:()=>{}}]);return true;}
    const choices=candidates.map(mon=>({label:`${SPECIES[mon.species].name} · Lv.${mon.level}`,action:()=>{
      if(!active()||!save.party.includes(mon)||mon.hp<=0)return;
      const formation=leadPokemon(save,save.party.indexOf(mon));save.flags[f.partner]=mon.species;save.flags[f.slot]=save.party.indexOf(mon);save.flags[f.prepared]=true;delete save.flags[f.sorted];delete save.flags[f.rested];delete save.flags[f.ledger];g.persist();
      g.say('시장 작업 동료',[`${SPECIES[mon.species].name}와 맡을 바구니 표식을 확인했다.`,formation,'남쪽 배달 텃밭에서 실제 바구니를 살펴보자.'],undefined,[{label:'배달 텃밭으로',action:guide('tour_driftveil','tourOutdoor7')},{label:'시장을 더 본다',action:()=>{}}]);
    }}));
    g.say('함께 일할 동료',['현재 파티의 건강한 동료 한 마리를 골라 바구니를 분류한다.','선택은 회복·경험치·아이템 지급을 대신하지 않는다.'],undefined,[...choices,{label:'나중에 돕는다',action:()=>{}}]);return true;
  }
  if(event==='tourOutdoor7'){
    const slot=save.flags[f.slot],partner=typeof slot==='number'&&save.party[slot]?.species===save.flags[f.partner]?save.party[slot]:undefined;
    if(!save.flags[f.prepared]||!partner){g.say('시장 배달 텃밭',['표식이 다른 바구니들이 놓여 있다. 시장 배달 상인과 함께 일할 동료부터 정하자.'],undefined,[{label:'배달 상인에게',action:guide('tour_driftveil','tourResident1')},{label:'텃밭을 더 본다',action:()=>{}}]);return true;}
    if(partner.hp<=0){g.say('시장 배달 텃밭',[`${SPECIES[partner.species].name}가 지쳐 바구니 곁에서 쉬고 있다.`,'센터에서 회복한 뒤 같은 텃밭으로 돌아오면 분류를 이어갈 수 있다.'],undefined,[{label:'센터로',action:guide('tour_driftveil_center','nurse')},{label:'여기서 쉰다',action:()=>{}}]);return true;}
    if(!save.flags[f.sorted]){
      g.say('배달 바구니',['농산물·광물·생활 물품 표식이 서로 섞여 있다.',`${SPECIES[partner.species].name}와 목적지별로 나누고 빈 바구니를 통행로 밖에 놓을까?`],undefined,[{label:'함께 분류한다',action:()=>{
        if(!active()||save.party[Number(save.flags[f.slot])]!==partner||partner.hp<=0||!commit(f.sorted))return;
        g.say('배달 바구니 분류',[`${SPECIES[partner.species].name}와 농산물·광물·생활 물품을 서로 다른 목적지 표식 옆에 놓았다.`,'빈 바구니는 통행로를 막지 않게 텃밭 안쪽으로 돌려놓았다. 동쪽 알통몬에게 일이 끝났다고 알리자.'],undefined,[{label:'알통몬에게',action:guide('tour_driftveil','tourResident4')},{label:'텃밭에 머문다',action:()=>{}}]);
      }},{label:'나중에 분류한다',action:()=>{}}]);return true;
    }
    g.say('배달 바구니 분류',[`${SPECIES[partner.species].name}와 나눈 바구니가 목적지 표식 곁에 놓여 있다.`,'빈 바구니가 통행로를 막지 않는 것도 확인했다.'],undefined,[{label:'알통몬에게',action:guide('tour_driftveil','tourResident4')},{label:'분류를 다시 확인',action:()=>{}}]);return true;
  }
  if(event==='tourResident4'&&save.flags[f.sorted]){
    if(save.flags[f.ledger]){const species=Number(save.flags[f.partner]??0);g.say('상자를 옮기는 알통몬',[`알통! ${SPECIES[species]?.name??'동료'}와 쉬었던 날의 교대 기록을 기억하는 듯하다.`,'현재 파티의 다른 포켓몬을 이전 동료로 세지 않고 물그릇 곁의 통행로를 비켜 준다.']);return true;}
    const species=Number(save.flags[f.partner]??0),slot=save.flags[f.slot],partner=typeof slot==='number'&&save.party[slot]?.species===species?save.party[slot]:undefined;
    if(!partner){g.say('상자를 옮기는 알통몬',['알통몬은 함께 일한 동료가 돌아오기를 기다린다.','센터 PC에서 그 동료를 편성하거나 시장 상인에게 새 동료를 정해 달라고 하자.'],undefined,[{label:'센터 PC로',action:guide('tour_driftveil_center','pc')},{label:'시장 상인에게',action:guide('tour_driftveil','tourResident1')}]);return true;}
    if(partner.hp<=0){g.say('상자를 옮기는 알통몬',[`${SPECIES[partner.species].name}의 기운이 떨어진 것을 보고 상자를 내려놓았다.`,'북서쪽 센터에서 실제 회복을 마친 뒤 휴게 급수대로 돌아오자.'],undefined,[{label:'센터로',action:guide('tour_driftveil_center','nurse')},{label:'곁에서 쉰다',action:()=>{}}]);return true;}
    g.say('상자를 옮기는 알통몬',['알통! 알통몬이 남쪽 휴게원의 물그릇과 그늘을 가리킨다.',`${SPECIES[partner.species].name}와 급수대를 직접 확인하면 교대 휴식을 마칠 수 있다.`],undefined,[{label:'휴게 급수대로',action:guide('tour_driftveil','tourOutdoor9')},{label:'알통몬 곁에 머문다',action:()=>{}}]);return true;
  }
  if(event==='tourOutdoor9'){
    const species=Number(save.flags[f.partner]??0),slot=save.flags[f.slot],partner=typeof slot==='number'&&save.party[slot]?.species===species?save.party[slot]:undefined;
    if(!save.flags[f.sorted]||!partner){g.say('교대 작업자 휴게원',['물그릇과 그늘이 준비돼 있다. 먼저 시장 상인과 동료를 정해 바구니 분류를 마치자.'],undefined,[{label:'시장 상인에게',action:guide('tour_driftveil','tourResident1')},{label:'휴게원을 살핀다',action:()=>{}}]);return true;}
    if(partner.hp<=0){g.say('교대 작업자 휴게원',[`${SPECIES[partner.species].name}에게는 잠깐의 물보다 센터 치료가 먼저 필요하다.`],undefined,[{label:'센터로',action:guide('tour_driftveil_center','nurse')},{label:'여기서 기다린다',action:()=>{}}]);return true;}
    if(!save.flags[f.rested]){
      g.say('휴게 급수대',[`깨끗한 물그릇과 몸을 뻗을 그늘이 비어 있다. ${SPECIES[partner.species].name}와 알통몬이 일을 마친 뒤 쉬기 좋은 자리다.`],undefined,[{label:'물과 그늘을 챙긴다',action:()=>{
        if(!active()||save.party[Number(save.flags[f.slot])]!==partner||partner.hp<=0||!commit(f.rested))return;
        g.say('작업 포켓몬 휴게',[`${SPECIES[partner.species].name}와 알통몬이 상자를 내려놓고 물을 마신 뒤 그늘에서 몸을 풀었다.`,`현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}\n다친 HP는 센터에서 치료해야 한다.`,'시장 2층 장부에 일과 휴식을 함께 남기자.'],undefined,[{label:'선적 기록실로',action:guide('tour_driftveil_hall_2f','tourExhibit0')},{label:'센터에서 회복',action:guide('tour_driftveil_center','nurse')},{label:'더 쉰다',action:()=>{}}]);
      }},{label:'나중에 쉰다',action:()=>{}}]);return true;
    }
    g.say('작업 포켓몬 휴게',[`${SPECIES[partner.species].name}와 알통몬이 쉬었던 물그릇과 그늘이 정돈돼 있다.`,'시장 2층 장부에 일과 휴식을 함께 남길 수 있다.'],undefined,[{label:'선적 기록실로',action:guide('tour_driftveil_hall_2f','tourExhibit0')},{label:'더 쉰다',action:()=>{}}]);return true;
  }
  return false;
}

export function handleDriftveilLedger(g:Engine,event:string):boolean{
  if(!unlocked(g)||g.save.map!=='tour_driftveil_hall_2f'||event!=='tourExhibit0')return false;
  const f=DRIFTVEIL_NEXUS,{save,guide,commit}=context(g);
  if(!save.flags[f.rested]){g.say('화물 분류 장부',['도개교를 건넌 화물의 목적지는 적혀 있지만 플레이어의 작업·휴식 칸은 비어 있다.','시장 배달 상인에게서 건강한 동료와 분류를 돕고 알통몬 휴게원까지 살펴보자.'],undefined,[{label:'시장 배달 상인에게',action:guide('tour_driftveil','tourResident1')},{label:'장부를 더 본다',action:()=>{}}]);return true;}
  if(!save.flags[f.ledger])commit(f.ledger);
  const species=Number(save.flags[f.partner]??0);
  g.say('물풍경 선적 기록',[`${SPECIES[species]?.name??'동료'}와 나눈 화물의 목적지, 작업 뒤 물과 그늘을 확인한 시간이 같은 장부에 기록됐다.`,'시장과 광물 창고가 커져도 사람과 포켓몬의 통행선, 일한 뒤의 휴식 시간은 함께 지켜야 한다.','다음 공식 육로는 북쪽 6번도로 → 전기돌동굴 → 궐수시티이며, 도개교로 뇌문에도 돌아갈 수 있다.'],undefined,[{label:'6번도로로 진행',action:guide('tour_pass_driftveil_mistralton')},{label:'도개교로 귀환',action:guide('tour_driftveil_drawbridge')},{label:'시장에 머문다',action:()=>{}}]);return true;
}
