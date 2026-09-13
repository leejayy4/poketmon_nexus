import { MAHOGANY_POWER_MAP,MAHOGANY_POWER_NPC,MAHOGANY_POWER_SWITCH,MAHOGANY_POWER_FLAGS } from './mahogany-power';
import { MORTAR_DRAINAGE_FLAGS,MORTAR_DRAINAGE_ORDER } from './mortar-drainage';
import { MORTAR_RESCUE_READY,MORTAR_RESCUE_PROGRESS,MORTAR_RESCUE_DONE,MORTAR_RESCUE_PATH,MORTAR_RESCUE_EVENT } from './mortar-rescue';
import { MORTAR_HEAT_STAGES,MORTAR_HEAT_EVENTS } from './mortar-heat';
import { JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42 } from './johto-route-42';
import { ECRUTEAK_DISCLOSURE_STAGES,ECRUTEAK_DISCLOSURE_EVENTS } from './ecruteak-disclosure';
import { RAGE_RECOVERY_FLAGS,RAGE_GYARADOS_EVENTS,rageGyaradosCalm } from './rage-lake-gyarados';
import { MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS,MAHOGANY_TRANSMITTER_GUARD,MAHOGANY_LIFE_PRESERVED,MAHOGANY_TRANSMISSION_STOPPED } from './mahogany-transmitter';
import { RAGE_RELIEF_EVENTS,RAGE_RELIEF_STAGES } from './rage-lake-relief';
import { RAGE_STAGES,RAGE_EVENTS } from './rage-lake-nexus';
import { GOLDENROD_IAN_BRIEFED,GOLDENROD_TEST_SENT,GOLDENROD_RECEIVER_CONFIRMED,GOLDENROD_INQUIRY_READY } from './goldenrod-nexus';
import { CINNABAR_IAN_CONTACT,CINNABAR_CONTACT_MAP,CINNABAR_CONTACT_EVENT } from './cinnabar-aftermath';
import { CINNABAR_EVACUEES,CINNABAR_MEWTWO_ASSISTED,CINNABAR_SHORE_HANDOFF,CINNABAR_SHORE_EVENT,evacuationStage } from './cinnabar-evacuation-state';
import { CINNABAR_EVACUATION_WALK_CHECKED,CINNABAR_EVACUATION_LOBBY_EVENT,CINNABAR_PROTECTION_READY,CINNABAR_EVACUATION_READY,CINNABAR_PARTNER_WORK_CHECKED,CINNABAR_CONTROL_SEPARATED,CINNABAR_CONTROL_GUARD,CINNABAR_CONTROL_GUARD_EVENT,CINNABAR_CONTROL_EVENT } from './cinnabar-rescue-work';
import { CINNABAR_CONTROL_SITE,CINNABAR_SITE_ARRIVAL,CINNABAR_SITE_PROTECTION,CINNABAR_SITE_EVACUATION } from './cinnabar-control-site';
import { CINNABAR_RESCUE_STARTED,CINNABAR_RESCUE_ORDER } from './cinnabar-rescue-arrival';
import { SILPH_RECORDS_MAP } from './silph-records-room';
import { SILPH_RECORDS_SECURED,SILPH_RECORDS_GUARD,SILPH_RECORDS_GUARD_EVENT,SILPH_RECORDS_ORIGINAL_EVENT } from './silph-records-story';
import { trainerWinFlag } from './road-trainers';
import { SILPH_DISCREPANCY_FLAG,SILPH_DISCREPANCY_MAP,SILPH_DISCREPANCY_EVENT } from './silph-discrepancy-story';
import { SINNOH_DELIVERY_OBJECTIVES, meetsStoryCondition } from './data/story';
import { worldMapId } from './unified-world';
import type { MapId,SaveData } from './types';
import { GYMS } from './gyms';
import { getMap,MAPS } from './maps';
import { withParticle } from './korean-text';
import { TOUR_BUILDINGS,TOUR_INTERIORS,tourPlaceForMap,placeById } from './explore-world';
import { FLOOR_PARENTS } from './journey-world';

export interface AdventureObjective {id:string;title:string;map:MapId;action:string;event?:string;point?:{x:number;y:number}}

export function itemSupply(save:SaveData,item:keyof SaveData['inventory']):AdventureObjective|null{
  const queue:MapId[]=[worldMapId(save.map)],seen=new Set<MapId>(queue);
  const events=save.badges.length?['martClerk']:item==='pokeBalls'?['routeGuide']:['nurse','routeGuide','trailGuide'];
  for(let i=0;i<queue.length;i++){
    const map=getMap(queue[i],save.flags),provider=map.npcs.find(n=>events.includes(n.dialogue));
    if(provider)return {id:'supply',map:map.id,event:provider.dialogue,title:map.name,action:provider.name+'에게 말을 걸자'};
    for(const warp of map.warps){if(seen.has(warp.to)||warp.requiresFlag&&!save.flags[warp.requiresFlag])continue;seen.add(warp.to);queue.push(warp.to);}
  }
  return null;
}

// Guidance reflects existing progression only; reading it never grants progress.
export function adventureObjective(save:SaveData):AdventureObjective|null{

  if(!save.party.length)return {id:'partner',event:'professor',title:'첫 파트너 만나기',map:'lab',action:'은솔박사에게 말을 걸자'};
  if(!save.flags.departureCleared)return {id:'departure',event:'gatekeeper',title:'모험 출발 준비',map:'town',action:'서쪽 입구의 도윤과 이야기하자'};
  const next=GYMS.findIndex(g=>!save.badges.includes(g.badge));
  if(next>=0)return {id:GYMS[next].id,event:GYMS[next].id,title:GYMS[next].label+'에 도전',map:(['oreburgh_gym','eterna_gym','hearthome_gym','veilstone_gym'] as const)[next],action:`관장 ${withParticle(GYMS[next].name,'과/와')} 이야기하자`};
  const nextDelivery=SINNOH_DELIVERY_OBJECTIVES.all().find(row=>!meetsStoryCondition(save,row.complete));
  if(nextDelivery){const {complete,...objective}=nextDelivery;return objective;}
  const region=tourPlaceForMap(worldMapId(save.map))?.region;
  if(region==='관동'&&save.flags.researchDelivered&&save.flags.ferryPass&&!save.flags[SILPH_DISCREPANCY_FLAG])return {
    id:'silph-discrepancy',title:'실프 공개 자료 대조',map:SILPH_DISCREPANCY_MAP,event:SILPH_DISCREPANCY_EVENT,
    action:'실프 2층 시험대에서 사용표와 납품 사본을 비교하자',
  };
  if(region==='관동'&&save.flags.researchDelivered&&save.flags.ferryPass&&save.flags[SILPH_DISCREPANCY_FLAG]&&!save.flags[SILPH_RECORDS_SECURED]){
    const guardWon=Boolean(save.flags[trainerWinFlag(SILPH_RECORDS_GUARD)]);
    return {id:'silph-records',title:'실프 반입 원본 확인',map:SILPH_RECORDS_MAP,
      event:guardWon?SILPH_RECORDS_ORIGINAL_EVENT:SILPH_RECORDS_GUARD_EVENT,
      action:guardWon?'두 배선 자료를 읽고 북쪽 작업대에서 원본을 대조하자':'기록실 경비와 원본 열람을 두고 마주하자'};
  }
  if(region==='관동'&&save.flags.researchDelivered&&save.flags.ferryPass&&save.flags[SILPH_RECORDS_SECURED]&&!save.flags[CINNABAR_RESCUE_STARTED])return {
    id:'cinnabar-arrival',title:'홍련 반입처 확인',map:CINNABAR_CONTROL_SITE,event:CINNABAR_SITE_ARRIVAL,
    action:'보호 장치 곁의 유진과 현장 상황을 확인하자',
  };
  if(region==='관동'&&save.flags[SILPH_RECORDS_SECURED]&&save.flags[CINNABAR_RESCUE_STARTED]&&!save.flags[CINNABAR_CONTROL_SEPARATED]){
    const evacuationFirst=save.flags[CINNABAR_RESCUE_ORDER]===1;
    const own=evacuationFirst?CINNABAR_EVACUATION_READY:CINNABAR_PROTECTION_READY;
    const peer=evacuationFirst?CINNABAR_PROTECTION_READY:CINNABAR_EVACUATION_READY;
    const ownEvent=evacuationFirst?CINNABAR_SITE_EVACUATION:CINNABAR_SITE_PROTECTION;
    const peerEvent=evacuationFirst?CINNABAR_SITE_PROTECTION:CINNABAR_SITE_EVACUATION;
    let event:string,action:string;
    if(!save.flags[own]){event=ownEvent;action='맡은 현장에서 안전한 준비 방법을 확인하자';}
    else if(!save.flags[peer]){event=save.flags[CINNABAR_PARTNER_WORK_CHECKED]?CINNABAR_SITE_ARRIVAL:peerEvent;action=save.flags[CINNABAR_PARTNER_WORK_CHECKED]?'유진과 서로 확인한 준비를 맞추자':'유진이 맡은 현장도 직접 살펴보자';}
    else if(!save.flags[trainerWinFlag(CINNABAR_CONTROL_GUARD)]){event=CINNABAR_CONTROL_GUARD_EVENT;action='제어실 경비와 마주하기 전에 동료를 준비하자';}
    else{event=CINNABAR_CONTROL_EVENT;action='보호 전원은 유지하고 제어 신호만 분리하자';}
    if(event===CINNABAR_SITE_EVACUATION&&!save.flags[CINNABAR_EVACUATION_WALK_CHECKED]){event=CINNABAR_EVACUATION_LOBBY_EVENT;action='남쪽 로비에서 대피 통로와 귀환문의 연결을 확인하자';}
    return {id:'cinnabar-control',title:'홍련 구조 준비',map:CINNABAR_CONTROL_SITE,event,action};
  }
  if(region==='관동'&&save.flags[SILPH_RECORDS_SECURED]&&save.flags[CINNABAR_PROTECTION_READY]&&save.flags[CINNABAR_EVACUATION_READY]&&save.flags[CINNABAR_CONTROL_SEPARATED]&&!save.flags[CINNABAR_SHORE_HANDOFF]){
    const pending=CINNABAR_EVACUEES.find(mon=>evacuationStage(save.flags,mon.flag)<4);
    if(pending){
      const stage=evacuationStage(save.flags,pending.flag);
      const witness=stage===2&&!save.flags[CINNABAR_MEWTWO_ASSISTED];
      return {id:'cinnabar-evacuation',title:'포켓몬을 안전한 해안으로',map:stage<3?CINNABAR_CONTROL_SITE:'tour_cinnabar',
        event:witness?'tourCinnabarMewtwoWitness':pending.event,
        action:witness?'남쪽 로비에서 간섭과 포켓몬의 상태를 살펴보자':stage===3?pending.name+'의 상태를 해안에서 확인하자':pending.name+'에게 다가가 다음 대기 자리로 안내하자'};
    }
    return {id:'cinnabar-handoff',title:'해안 인계 확인',map:'tour_cinnabar',event:CINNABAR_SHORE_EVENT,action:'유진과 두 포켓몬의 인계를 확인하자'};
  }
  if(region==='관동'&&save.flags[SILPH_RECORDS_SECURED]&&save.flags[CINNABAR_CONTROL_SEPARATED]&&save.flags[CINNABAR_SHORE_HANDOFF]&&!save.flags[CINNABAR_IAN_CONTACT])return {
    id:'cinnabar-aftermath',title:'홍련 연구소의 후속 연락',map:CINNABAR_CONTACT_MAP,event:CINNABAR_CONTACT_EVENT,
    action:'연구원과 돌봄 상황을 나누고 이안에게 납품 기록을 확인하자',
  };
  if((region==='관동'||region==='성도')&&save.flags[CINNABAR_IAN_CONTACT]&&!save.flags[GOLDENROD_INQUIRY_READY]){
    if(!save.flags[GOLDENROD_IAN_BRIEFED])return {id:'goldenrod-contact',title:'금빛역의 납품 연락',map:'tour_goldenrod_station',event:'tourHost',action:'역 안내원을 통해 이안의 연락을 받자'};
    if(!save.flags[GOLDENROD_TEST_SENT])return {id:'goldenrod-transmit',title:'생활 안내 시험 송출',map:'tour_goldenrod_hall',event:'tourExhibit0',action:'라디오탑 장비에서 생활 안내 신호를 확인하자'};
    if(!save.flags[GOLDENROD_RECEIVER_CONFIRMED])return {id:'goldenrod-receive',title:'주택 수신 확인',map:'tour_goldenrod_home3',event:'tourExhibit0',action:'주택 라디오에서 송출한 안내가 들리는지 확인하자'};
    return {id:'goldenrod-report',title:'금빛 현장 결과 대조',map:'tour_goldenrod_station',event:'tourHost',action:'이안과 도움이 된 점과 미확인 부분을 나눠 대조하자'};
  }
  if(region==='성도'&&save.flags[GOLDENROD_INQUIRY_READY]&&!save.flags[RAGE_STAGES[4]]){
    const stage=RAGE_STAGES.findIndex(flag=>!save.flags[flag]);
    const steps:AdventureObjective[]=[
      {id:'rage-residents',title:'호숫가의 생활',map:'tour_rage_lake_home1',event:RAGE_EVENTS.resident,action:'주민에게 물 공급과 경보가 어떤 도움이 되는지 듣자'},
      {id:'rage-intake',title:'취수 흐름 비교',map:'tour_rage_lake',event:RAGE_EVENTS.intake,action:'생활 물 공급을 유지하며 취수 비교함을 살펴보자'},
      {id:'rage-reeds',title:'갈대 밖의 조사 위치',map:'tour_rage_lake',event:RAGE_EVENTS.reeds,action:'갈대와 보행로를 남길 수 있는 조사 위치를 표시하자'},
      {id:'rage-alarm',title:'물가에 닿는 경보',map:'tour_rage_lake',event:RAGE_EVENTS.alarm,action:'정상 경보를 유지하며 시험 반사판의 방향을 고르자'},
      {id:'rage-alternatives',title:'주민과 대안 의논',map:'tour_rage_lake_home1',event:RAGE_EVENTS.resident,action:'주민과 이안에게 돌아가 대신 준비할 생활 설비를 의논하자'},
    ];
    return steps[stage];
  }
  if(region==='성도'&&save.flags[RAGE_STAGES[4]]&&!save.flags[RAGE_RELIEF_STAGES[6]]){
    const stage=RAGE_RELIEF_STAGES.findIndex(flag=>!save.flags[flag]);
    const events=[RAGE_RELIEF_EVENTS.parts,RAGE_RELIEF_EVENTS.intake,RAGE_RELIEF_EVENTS.basin,RAGE_RELIEF_EVENTS.bell,RAGE_RELIEF_EVENTS.signal,RAGE_RELIEF_EVENTS.bell,RAGE_RELIEF_EVENTS.resident];
    const actions=['주민의 작업대에서 동료와 부품을 나누어 준비하자','서쪽 둑의 받침에서 생활 공급과 별도의 홈통을 잇자','남쪽 받이의 수평을 맞추고 물이 닿는지 확인하자','낮은 둑에 수동 종과 신호판을 고정하자','동쪽 전망대에서 독립된 시험 신호를 보내자','낮은 둑으로 돌아가 수신 표식을 확인하자','주민에게 물 공급과 독립 경보의 준비 결과를 전하자'];
    return {id:'rage-relief-'+stage,title:'호숫가 생활 설비 준비',map:stage===0||stage===6?'tour_rage_lake_home1':'tour_rage_lake',event:events[stage],action:actions[stage]};
  }
  if(region==='성도'&&save.flags[RAGE_RELIEF_STAGES[6]]&&!save.flags[MAHOGANY_TRANSMISSION_STOPPED]){
    const won=Boolean(save.flags[trainerWinFlag(MAHOGANY_TRANSMITTER_GUARD)]);
    const preserved=Boolean(save.flags[MAHOGANY_LIFE_PRESERVED]);
    return {id:'mahogany-transmitter',title:'황토 송신 계통 분리',map:MAHOGANY_TRANSMITTER_MAP,
      event:!won?MAHOGANY_TRANSMITTER_EVENTS.guard:!preserved?MAHOGANY_TRANSMITTER_EVENTS.life:MAHOGANY_TRANSMITTER_EVENTS.signal,
      action:!won?'안내소의 송신 현장 담당자와 마주하자':!preserved?'생활 공급반의 손잡이를 유지하자':'생활 공급을 남기고 별도 송신 단로기만 열자'};
  }
  if(region==='성도'&&save.flags[MAHOGANY_TRANSMISSION_STOPPED]&&!save.flags[RAGE_RECOVERY_FLAGS.residents]){
    const event=!save.flags[RAGE_RECOVERY_FLAGS.distance]?RAGE_GYARADOS_EVENTS.distance:!rageGyaradosCalm(save)?RAGE_GYARADOS_EVENTS.approach:!save.flags[RAGE_RECOVERY_FLAGS.water]?RAGE_GYARADOS_EVENTS.water:!save.flags[RAGE_RECOVERY_FLAGS.bell]?RAGE_GYARADOS_EVENTS.bell:RAGE_GYARADOS_EVENTS.resident;
    return {id:'rage-recovery',title:'호수의 생활을 되찾기',map:event===RAGE_GYARADOS_EVENTS.resident?'tour_rage_lake_home1':'tour_rage_lake',event,
      action:event===RAGE_GYARADOS_EVENTS.distance?'서안에서 안전한 접근 거리를 살피자':event===RAGE_GYARADOS_EVENTS.approach?'동쪽 전망대에서 동료와 갸라도스에 대응하자':event===RAGE_GYARADOS_EVENTS.water?'물결이 잦아든 뒤 취수 받이를 확인하자':event===RAGE_GYARADOS_EVENTS.bell?'낮은 둑에서 독립 경보를 다시 확인하자':'주민에게 물가의 현장 결과를 전하자'};
  }
  if(region==='성도'&&save.flags[RAGE_RECOVERY_FLAGS.residents]&&!save.flags[ECRUTEAK_DISCLOSURE_STAGES[3]]){
    const stage=ECRUTEAK_DISCLOSURE_STAGES.findIndex(flag=>!save.flags[flag]);
    const sites:AdventureObjective[]=[
      {id:'ecruteak-ian',title:'이안이 서명한 기록',map:'tour_ecruteak_hall_2f',event:ECRUTEAK_DISCLOSURE_EVENTS.ian,action:'인주 전승시설 2층에서 이안의 설명을 듣자'},
      {id:'ecruteak-originals',title:'빠진 생활 기록 공개',map:'tour_ecruteak_hall_2f',event:ECRUTEAK_DISCLOSURE_EVENTS.originals,action:'공개대에서 서명본과 주민의 원본을 함께 놓자'},
      {id:'ecruteak-residents',title:'주민이 요구하는 책임',map:'tour_ecruteak_hall',event:ECRUTEAK_DISCLOSURE_EVENTS.resident,action:'1층 주민에게 공개한 기록에 대한 답을 듣자'},
      {id:'ecruteak-eugene',title:'다음 현장을 보는 시선',map:'tour_ecruteak_hall_3f',event:ECRUTEAK_DISCLOSURE_EVENTS.eugene,action:'3층에서 유진과 주민의 요구를 이야기하자'},
    ];return sites[stage];
  }
  const powerPending=region==='성도'&&save.flags[ECRUTEAK_DISCLOSURE_STAGES[3]]&&save.flags[MAHOGANY_LIFE_PRESERVED]&&save.flags[MAHOGANY_TRANSMISSION_STOPPED]&&save.flags[MAHOGANY_POWER_FLAGS.heard]&&!save.flags[MAHOGANY_POWER_FLAGS.done];
  if(powerPending&&(save.map===MAHOGANY_POWER_MAP||!save.flags[MORTAR_DRAINAGE_FLAGS[0]]||save.flags[MORTAR_DRAINAGE_FLAGS[5]])){
    const allocated=save.flags[MAHOGANY_POWER_FLAGS.allocation]===2,arrived=Boolean(save.flags[MAHOGANY_POWER_FLAGS.arrived]);
    return {id:arrived?'mahogany-power-handoff':allocated?'mahogany-power-walk':'mahogany-power-switch',title:'주민이 돌아갈 길의 불빛',map:MAHOGANY_POWER_MAP,event:allocated||arrived?MAHOGANY_POWER_NPC:MAHOGANY_POWER_SWITCH,action:arrived?'남쪽 문 안쪽에 도착한 주민에게 인계하자':allocated?'주민에게 이동을 부탁하고 유도등 앞길을 비워 두자':'예비 분배반에서 남쪽 출입 유도등에 전원을 보내자'};
  }
  if(region==='성도'&&save.flags[ECRUTEAK_DISCLOSURE_STAGES[3]]&&save.flags[MORTAR_DRAINAGE_FLAGS[0]]&&!save.flags[MORTAR_DRAINAGE_FLAGS[5]]){
    const stage=MORTAR_DRAINAGE_FLAGS.findIndex(flag=>!save.flags[flag]);
    const actions=['42번도로 물길에서 흐려지는 지점을 살피자','절구산 서쪽 거름틀에서 유입을 추적하자','건강한 동료와 침전 받이를 준비하자','분리한 거름틀에서 퇴적물을 수거하자','침전물을 남겨 두고 정상 배수로 돌리자','42번도로 하류로 돌아가 흐름을 다시 보자'];
    return {id:'mortar-drainage-'+stage,title:'상류와 하류를 잇는 배수홈',map:stage===0||stage===5?JOHTO_ROUTE_42:JOHTO_MT_MORTAR_1F,event:MORTAR_DRAINAGE_ORDER[stage],action:actions[stage]};
  }
  if(region==='성도'&&save.flags[ECRUTEAK_DISCLOSURE_STAGES[3]]&&!save.flags[MORTAR_HEAT_STAGES[4]]){
    const stage=MORTAR_HEAT_STAGES.findIndex(flag=>!save.flags[flag]);
    const actions=['절구산 산행객과 동료의 역할을 나누자','동쪽 암반에서 안전하게 기류를 비교하자','북쪽 횡단로의 회전 표식을 고정하자','서쪽 물길을 남기고 마른 길을 확인하자','산행객에게 확인한 우회길을 전하자'];
    return {id:'mortar-heat-'+stage,title:'절구산의 안전 우회길',map:JOHTO_MT_MORTAR_1F,event:MORTAR_HEAT_EVENTS[stage],action:actions[stage]};
  }
  if(region==='성도'&&save.flags[MORTAR_HEAT_STAGES[4]]&&!save.flags[MORTAR_RESCUE_DONE]){
    if(!save.flags[MORTAR_RESCUE_READY])return {id:'mortar-rescue-ready',title:'산행객과 함께 돌아가기',map:JOHTO_MT_MORTAR_1F,event:MORTAR_RESCUE_EVENT,action:'동쪽의 산행객과 건강한 동료의 역할을 나누자'};
    const stored=save.flags[MORTAR_RESCUE_PROGRESS];
    const i=typeof stored==='number'&&Number.isInteger(stored)&&stored>=0&&stored<MORTAR_RESCUE_PATH.length?stored:0;
    const next=MORTAR_RESCUE_PATH[i+1],here=MORTAR_RESCUE_PATH[i];
    if(!next)return {id:'mortar-rescue-return',title:'남쪽 합류점에 도착',map:JOHTO_MT_MORTAR_1F,event:'journeyWalker',action:'남쪽 산행객과 모두 돌아왔는지 확인하자'};
    const direction=next.x<here.x?'서쪽':next.x>here.x?'동쪽':next.y<here.y?'북쪽':'남쪽';
    return {id:'mortar-rescue-walk',title:'산행객과 우회길 걷기',map:JOHTO_MT_MORTAR_1F,point:i===0||(save.map===JOHTO_MT_MORTAR_1F&&save.player.x===here.x&&save.player.y===here.y)?next:here,action:`산행객 앞에서 ${direction}으로 한 칸씩 안내하자 (${i}/${MORTAR_RESCUE_PATH.length-1})`};
  }
  return explorationObjective(save);
}

function explorationObjective(save:SaveData):AdventureObjective{
  const current=worldMapId(save.map),place=tourPlaceForMap(current)
    ??getMap(current,save.flags).warps.map(w=>tourPlaceForMap(w.to)).find(Boolean);
  const fallback:AdventureObjective={id:'explore',title:'자유롭게 둘러보기',map:current,action:'지도에서 가 보고 싶은 곳을 골라 보자'};
  if(!place)return fallback;
  const landmark=(id:string)=>TOUR_BUILDINGS[id]?.find(b=>b.kind==='landmark')?.room;
  const localHall=landmark(place.id);
  const floorRoot=(id:MapId)=>{let root=id;const seen=new Set<MapId>();while(FLOOR_PARENTS[root]&&!seen.has(root)){seen.add(root);root=FLOOR_PARENTS[root];}return root;};
  // Entering records a visit, not a completed inspection. Keep the current hall
  // (including its floors) available until the player chooses to leave it.
  if(current==='tour_vermilion_hall_3f'){
    const notebook=TOUR_INTERIORS[current]?.objects.find(object=>object.name==='여행 준비 수첩');
    return {id:'vermilion-practice',title:'동료 기술 연습',map:current,event:notebook?.event??'tourHost',action:'여행 준비 수첩을 살펴보자'};
  }
  if(localHall&&floorRoot(current)===localHall){
    const map=getMap(current,save.flags),host=map.npcs.find(n=>n.dialogue==='tourHost');
    const exhibit=TOUR_INTERIORS[current]?.objects.find(o=>map.props.some(p=>p.dialogue===o.event));
    return {id:'explore',title:'시설 둘러보기',map:current,
      event:host?.dialogue??exhibit?.event,
      action:host?'안내원과 전시를 천천히 살펴보자':exhibit?withParticle(exhibit.name,'을/를')+' 살펴보자':'방 안의 길과 출입구를 살펴보자'};
  }
  const visited=new Set<string>(save.tourVisited??[]),queue=[current],seen=new Set(queue);
  // Actual open warps determine distance; another region is never a shortcut.
  // Centers and marts remain available through recovery/supply guidance, rather
  // than competing with the existing representative facilities for this goal.
  for(let i=0;i<queue.length;i++){
    const id=queue[i],area=tourPlaceForMap(id),hall=area&&landmark(area.id);
    if(id===hall&&TOUR_INTERIORS[id]&&!visited.has(id))return {
      id:'explore',title:'시설 둘러보기',map:id,event:'tourHost',action:'안내원에게 시설 이야기를 들어 보자',
    };
    if(placeById(id)&&!hall&&id!==current&&!visited.has(id))return {
      id:'explore',title:'주변 둘러보기',map:id,event:getMap(id,save.flags).npcs.find(n=>['tourGuide','trailGuide'].includes(n.dialogue))?.dialogue,action:'주변 길과 안내원을 살펴보자',
    };
    for(const warp of getMap(id,save.flags).warps){
      if(warp.requiresFlag&&!save.flags[warp.requiresFlag])continue;
      const next=tourPlaceForMap(warp.to);
      if(seen.has(warp.to)||next&&next.region!==place.region)continue;
      seen.add(warp.to);queue.push(warp.to);
    }
  }
  return fallback;
}

// Breadth-first traversal measures area transitions, not walking distance.
function* connectedAreas(save:SaveData){
  const queue:{id:MapId;first:MapId|null}[]=[{id:worldMapId(save.map),first:null}],seen=new Set<MapId>([worldMapId(save.map)]);
  for(let i=0;i<queue.length;i++){
    const current=queue[i],map=getMap(current.id,save.flags);
    yield {...current,map};
    const exits=map.warps.filter(w=>!w.requiresFlag||save.flags[w.requiresFlag]).map(w=>w.to);
    // The existing ferry is a dialogue transition rather than a map warp.
    if(save.flags.researchDelivered&&map.npcs.some(n=>n.dialogue==='ferry')){
      if(current.id==='tour_vermilion')exits.push('tour_canalave');
      if(current.id==='tour_canalave')exits.push('tour_vermilion');
    }
    for(const id of exits){if(seen.has(id))continue;seen.add(id);queue.push({id,first:current.first??id});}
  }
}

export function adventureGuide(save:SaveData):{objective:AdventureObjective;lines:[string,string]}|null{
  const objective=adventureObjective(save);if(!objective)return null;
  if(save.party.some(p=>p.hp*5<=p.maxHp)){
    for(const area of connectedAreas(save)){
      const nurse=area.map.npcs.find(n=>['mom','nurse','routeGuide','trailGuide'].includes(n.dialogue));
      if(!nurse)continue;
      const recovery:AdventureObjective={id:'recover',event:nurse.dialogue,title:'포켓몬을 회복하자',map:area.id,action:nurse.name+'에게 말을 걸자'};
      const ferry=save.map==='tour_vermilion'&&area.first==='tour_canalave';
      return {objective:recovery,lines:area.first?[ferry?'선원에게 왕복선을 부탁하자':'회복: '+area.map.name,'다음 구역: '+MAPS[area.first].name]:[save.party.some(p=>p.hp===0)?'쓰러진 친구가 있어요':'HP가 위험한 친구가 있어요',recovery.action]};
    }
  }
  if(save.map===objective.map)return {objective,lines:['이곳에서 할 일',objective.action]};
  for(const area of connectedAreas(save)){
    if(area.id===objective.map&&area.first)return {objective,lines:['목적지: '+MAPS[objective.map].name,'다음 구역: '+MAPS[area.first].name]};
  }
  return {objective,lines:['목적지: '+MAPS[objective.map].name,'주변 안내원에게 길을 물어보자']};
}
