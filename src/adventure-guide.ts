import { SEAFOAM_B1_HABITAT_OBSERVED,SEAFOAM_B2_ICE_OBSERVED,SEAFOAM_FINDINGS_COMPARED } from './seafoam-ice-walk';
import { NIMBASA_NEXUS } from './nimbasa-nexus';
import { CELESTIC_ROUTE_BATTLE } from './sinnoh-celestic-battle';
import { DRIFTVEIL_NEXUS } from './driftveil-nexus';
import { MISTRALTON_NEXUS } from './mistralton-nexus';
import { ROUTE43_HOMEWARD_FLAGS,ROUTE43_HOMEWARD_EVENTS } from './johto-route-43-life';
import { CASTELIA_SEWER_JOURNEY } from './castelia-sewer-journey';
import { CASTELIA_COMPARISON,casteliaComparisonReady } from './castelia-original-comparison';
import { TOUR_OUTDOORS } from './explore-world';
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
import { trainerWinFlag } from './trainer-flags';
import { SILPH_DISCREPANCY_FLAG,SILPH_DISCREPANCY_MAP,SILPH_DISCREPANCY_EVENT } from './silph-discrepancy-story';
import { SINNOH_DELIVERY_OBJECTIVES, meetsStoryCondition } from './data/story';
import { worldMapId,isWorldCenter } from './unified-world';
import type { MapId,SaveData } from './types';
import { GYMS } from './gyms';
import { getMap,MAPS } from './maps';
import { withParticle } from './korean-text';
import { SPECIES } from './pokemon';
import { OPELUCID_ARRIVAL,opelucidArrivalPartner } from './opelucid-arrival';
import { ROUTE_NINE_JOURNEY,isRouteNinePartner } from './unova-route-nine-journey';
import { ROUTE_EIGHT_JOURNEY,isRouteEightPartner } from './unova-route-eight-journey';
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
  const localMap=worldMapId(save.map),prepared=CELESTIC_ROUTE_BATTLE;
  if(['tour_celestic','tour_celestic_center','tour_sinnoh_route_210_north','tour_sinnoh_route_211_west','tour_sinnoh_route_211_east','tour_coronet_211_pass'].includes(localMap)&&save.flags[prepared.partner]&&!save.flags[prepared.participated]){
    const code=save.flags[prepared.trainer],slot=save.flags[prepared.slot];
    const partner=typeof slot==='number'?save.party[slot]:undefined;
    if(!partner||partner.species!==save.flags[prepared.partner])return {id:'celestic-reprepare',title:'산길 동료 다시 준비',map:'tour_celestic_center',event:'tourCelesticCenterGuide',action:'센터에서 현재 파티를 확인하고 산길 도전을 다시 준비하자'};
    if(partner.hp<=0)return {id:'celestic-recover',title:'산길 동료 회복',map:'tour_celestic_center',event:'nurse',action:'선택한 동료를 회복한 뒤 산길 실전으로 돌아가자'};
    if(code===1)return {id:'celestic-route-210',title:'준비한 동료와 산길 실전',map:'tour_sinnoh_route_210_north',event:'route210NorthTrainer',action:'준비한 동료를 출전시켜 210번도로 북부 트레이너와 겨뤄 보자'};
    if(code===2)return {id:'celestic-route-211-west',title:'준비한 동료와 산길 실전',map:'tour_sinnoh_route_211_west',event:'route211WestTrainer',action:'준비한 동료와 211번도로 서부 트레이너를 찾아가자'};
    if(code===3)return {id:'celestic-route-211-east',title:'준비한 동료와 산길 실전',map:'tour_sinnoh_route_211_east',event:'route211EastTrainer',action:'준비한 동료와 211번도로 동부 트레이너를 찾아가자'};
  }
  const oreburghJourneyMaps=['tour_jubilife','tour_sinnoh_route_203','tour_oreburgh_gate_1f','tour_oreburgh','tour_oreburgh_center','tour_oreburgh_hall','tour_oreburgh_mart','tour_oreburgh_home2','tour_oreburgh_mine'];
  if(!save.badges.includes(GYMS[0].badge)&&oreburghJourneyMaps.includes(localMap)&&!save.flags.oreburghGateArrivalReviewed)return explorationObjective(save);
  if(!save.badges.includes(GYMS[0].badge)&&oreburghJourneyMaps.includes(localMap)&&save.flags.oreburghGateArrivalReviewed&&!save.flags.oreburghRoarkMineBriefed)return {id:'oreburgh-mine-roark',title:'탄갱에서 강석의 작업 확인',map:'tour_oreburgh_mine',event:'oreburghMineForeman',action:'남쪽 무쇠탄갱의 작업반장에게 강석의 작업과 체육관 도전을 물어보자'};
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
  if(worldMapId(save.map)==='tour_johto_route_43'&&save.flags[RAGE_RECOVERY_FLAGS.residents]&&save.flags[ROUTE43_HOMEWARD_FLAGS.started]&&!save.flags[ROUTE43_HOMEWARD_FLAGS.returned]){
    const f=ROUTE43_HOMEWARD_FLAGS,e=ROUTE43_HOMEWARD_EVENTS;
    const event=!save.flags[f.rinsed]?e.water:!save.flags[f.dried]?e.dry:e.town;
    return {id:'route43-homeward-'+event,title:'주민의 거름틀 돌려주기',map:'tour_johto_route_43',event,action:event===e.water?'상류 물길 관찰대에서 거름틀의 진흙을 씻자':event===e.dry?'남쪽 옛 검문 기단에서 거름틀을 말리자':'남쪽 황토 표석에서 주민의 거름틀을 돌려주자'};
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
  if(['tour_jubilife','tour_jubilife_center','tour_jubilife_school','tour_sinnoh_route_203','tour_oreburgh_gate_1f','tour_oreburgh'].includes(current)&&save.flags.jubilifeArrivedVia202&&!save.flags.jubilifeRoute203ReturnReviewed){
    const local=[...save.party,...(save.box??[])].filter(mon=>mon.met==='신오 203번도로'&&[63,396,399,403].includes(mon.species));
    const slot=save.flags.sinnohRoute203PartnerSlot,partner=typeof slot==='number'?save.party[slot]:undefined;
    const participated=save.flags.sinnohRoute203PartnerWon===true&&!!partner&&partner.species===save.flags.sinnohRoute203Partner&&partner.met==='신오 203번도로';
    if(['tour_jubilife','tour_jubilife_center','tour_jubilife_school'].includes(current))return {id:'route203-departure',title:'축복 동문에서 무쇠로',map:'tour_jubilife',event:'jubilifeEastGuide',action:'동문 안내원에게 203번도로 풀밭·선택 실전·무쇠게이트 귀환 길을 듣자'};
    if(current==='tour_sinnoh_route_203'&&!local.length)return {id:'route203-capture',title:'연못과 언덕의 동료',map:'tour_sinnoh_route_203',event:'route203Sign',action:'서쪽 낮은 풀밭이나 동쪽 큰 풀밭에서 찌르꼬·비버니·꼬링크·캐이시를 만나 포획하거나 본선으로 계속 걷자'};
    if(current==='tour_sinnoh_route_203'&&!participated)return {id:'route203-practice',title:'203번도로 동료와 선택 실전',map:'tour_sinnoh_route_203',event:'route203Walker',action:save.flags['trainerWon:sinnoh-route-203-practice']?'건강한 203번도로 동료를 선두로 두고 상금 없는 재확인전을 마치자':'건강한 203번도로 동료를 선두로 두고 연못과 바위턱 사이 트레이너와 겨루거나 그대로 통과하자'};
    if(current==='tour_sinnoh_route_203'&&participated)return {id:'route203-homecoming',title:'포획과 성장 뒤 축복 귀환',map:'tour_jubilife',event:'jubilifeEastGuide',action:'서쪽 축복시티 동문으로 돌아가 같은 203번도로 동료의 성장과 귀환을 기록하자'};
    return {id:'oreburgh-gate-crossing',title:'무쇠게이트를 지나 탄광 도시로',map:'tour_oreburgh_gate_1f',event:'oreburghGateWorker',action:'밝은 1층 통과로를 따라 무쇠시티로 가거나 서쪽 203번도로로 돌아가자'};
  }
  if(['tour_jubilife','tour_sinnoh_route_203','tour_oreburgh_gate_1f','tour_oreburgh','tour_oreburgh_center'].includes(current)&&save.flags.jubilifeRoute203ReturnReviewed&&!save.flags.oreburghGateArrivalReviewed){
    const local=[...save.party,...(save.box??[])].filter(mon=>mon.met==='무쇠게이트 1층'&&[41,54,74].includes(mon.species));
    const slot=save.flags.oreburghGatePartnerSlot,partner=typeof slot==='number'?save.party[slot]:undefined;
    const participated=save.flags.oreburghGatePartnerWon===true&&!!partner&&partner.species===save.flags.oreburghGatePartner&&partner.met==='무쇠게이트 1층';
    if(current==='tour_jubilife'||current==='tour_sinnoh_route_203')return {id:'oreburgh-gate-departure',title:'203번도로 너머 동굴로',map:'tour_oreburgh_gate_1f',event:'oreburghGateSign',action:'203번도로 동쪽 끝에서 무쇠게이트 1층으로 들어가 밝은 본선을 따라가자'};
    if(current==='tour_oreburgh_gate_1f'&&!local.length)return {id:'oreburgh-gate-capture',title:'광석 통과로의 동료',map:'tour_oreburgh_gate_1f',event:'oreburghGateSign',action:'느슨한 돌길에서 주뱃·고라파덕·꼬마돌을 만나 포획하거나 안전한 가운데 본선으로 계속 걷자'};
    if(current==='tour_oreburgh_gate_1f'&&!participated)return {id:'oreburgh-gate-practice',title:'동굴 동료와 선택 실전',map:'tour_oreburgh_gate_1f',event:'oreburghGateWorker',action:save.flags['trainerWon:oreburgh-gate-1f-practice']?'건강한 무쇠게이트 동료를 선두로 두고 상금 없는 재확인전을 마치자':'건강한 무쇠게이트 동료를 선두로 두고 작업자와 겨루거나 동쪽 본선으로 통과하자'};
    return {id:'oreburgh-gate-arrival',title:'동굴 동료와 무쇠 도착',map:'tour_oreburgh',event:'oreburghWestArrivalGuide',action:participated?'동쪽 무쇠시티의 서문 안내원에게 같은 동료의 실전과 도착을 기록하자':'무쇠시티 서문 안내원에게 동굴 출신 동료와 현재 여행 상태를 보여 주자'};
  }
  if((current.startsWith('tour_kanto_seafoam_')||current==='tour_cinnabar'||current==='tour_cinnabar_hall'||current==='tour_cinnabar_center')
    &&save.flags[SEAFOAM_B1_HABITAT_OBSERVED]===true&&save.flags[SEAFOAM_B2_ICE_OBSERVED]===true&&!save.flags[SEAFOAM_FINDINGS_COMPARED]){
    return {id:'seafoam-findings-return',title:'동굴 발견을 홍련에서 비교',map:'tour_cinnabar_hall',event:'tourExhibit2',action:'홍련 연구소 관찰판에서 쌍둥이섬 길 기록 비교를 고르자. 동굴 탐험은 계속할 수 있다'};
  }
  if(['tour_pass_nimbasa_driftveil','tour_driftveil_drawbridge','tour_driftveil','tour_driftveil_hall_2f','tour_pass_driftveil_mistralton','tour_route_six_lab','tour_chargestone_1f','tour_chargestone_b1f','tour_mistralton','tour_mistralton_hall','tour_mistralton_hall_2f','tour_mistralton_center'].includes(current)&&save.flags[NIMBASA_NEXUS.preserved]){
    const f=DRIFTVEIL_NEXUS;
    if(!save.flags[f.route])return {id:'route-five-grass',title:'포장길과 북쪽 풀밭',map:'tour_pass_nimbasa_driftveil',event:'tourRouteFiveFoodTruck',action:'푸드트럭 옆에서 포장 본선과 치라미 풀밭을 구분해 살피자'};
    if(!save.flags[f.bridge])return {id:'drawbridge-shadow',title:'도개교 위를 스치는 그림자',map:'tour_driftveil_drawbridge',event:'tourDrawbridgeWingWatch',action:'안전 보행선과 꼬지보리 그림자 지점을 나누어 기록하자'};
    if(!save.flags[f.arrival])return {id:'driftveil-arrival',title:'시장 도시 도착',map:'tour_driftveil',event:'tourResident0',action:'도개교 도착 여행자에게 시장과 센터 위치를 듣자'};
    if(!save.flags[f.prepared])return {id:'driftveil-partner',title:'시장 일을 함께할 동료',map:'tour_driftveil',event:'tourResident1',action:'건강한 동료를 골라 맡을 바구니 표식을 정하자'};
    if(!save.flags[f.ledger]){
      const slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined;
      if(!partner||partner.species!==save.flags[f.partner])return {id:'driftveil-reprepare',title:'시장 동료 다시 선택',map:'tour_driftveil',event:'tourResident1',action:'시장 상인에게 돌아가 현재 파티의 동료를 다시 정하자'};
      if(partner.hp<=0)return {id:'driftveil-recovery',title:'작업 동료 회복',map:'tour_driftveil_center',event:'nurse',action:'선택한 동료를 센터에서 치료한 뒤 작업 장소로 돌아오자'};
    }
    if(!save.flags[f.sorted])return {id:'driftveil-sorting',title:'동료와 화물 나누기',map:'tour_driftveil',event:'tourOutdoor7',action:'시장 배달 텃밭에서 바구니를 목적지별로 직접 나누자'};
    if(!save.flags[f.rested])return {id:'driftveil-rest',title:'일한 동료의 휴식',map:'tour_driftveil',event:'tourOutdoor9',action:'알통몬 남쪽 휴게원의 물그릇과 그늘을 확인하자'};
    if(!save.flags[f.ledger])return {id:'driftveil-ledger',title:'일과 휴식을 함께 기록',map:'tour_driftveil_hall_2f',event:'tourExhibit0',action:'시장 2층 장부에 화물 분류와 동료 휴식을 함께 남기자'};
    if(['tour_pass_nimbasa_driftveil','tour_driftveil_drawbridge','tour_driftveil','tour_driftveil_hall_2f'].includes(current))return {id:'driftveil-next',title:'6번도로와 전기돌동굴',map:'tour_pass_driftveil_mistralton',action:'북쪽 6번도로를 지나 전기돌동굴과 궐수시티로 이어가자'};
    if(['tour_pass_driftveil_mistralton','tour_route_six_lab'].includes(current)&&!save.flags.unovaRouteSixObservation)return {id:'route-six-observation',title:'6번도로의 계절 생태',map:'tour_route_six_lab',event:'tourRouteSixLabJournal',action:'곁풀의 딱정곤·쪼마리와 강물 흔적을 살핀 뒤 연구소 기록대에 관찰을 남기자'};
    if(current==='tour_pass_driftveil_mistralton'&&!save.flags[trainerWinFlag('unova-route-6-practice')])return {id:'route-six-practice',title:'6번도로 선택 실전',map:'tour_pass_driftveil_mistralton',event:'tourRouteSixTrainer',action:'동쪽 마른 공터에서 딱정곤·쪼마리 트레이너와 선택 배틀을 하거나 북쪽 동굴로 진행하자'};
    if(!save.flags.chargestonePushLearned)return {id:'chargestone-learning',title:'전기돌동굴 결정 익히기',map:'tour_chargestone_1f',event:'tourChargestoneLearningCrystal',action:'1층 남부의 학습 결정과 자석 바위 방향을 확인하자'};
    if(!save.flags.chargestoneMainCrystalMoved)return {id:'chargestone-main-crystal',title:'B1F 본선 결정',map:'tour_chargestone_b1f',event:'tourChargestoneMainCrystal',action:'결정 조우장 옆 마른 길을 따라 본선 결정을 북쪽 자석 바위로 밀자'};
    if(!save.flags.mistraltonArrivalLogged)return {id:'mistralton-arrival',title:'궐수시티 도착 기록',map:'tour_mistralton_hall',event:'tourMistraltonArrivalBoard',action:'1층 도착 안내도에 6번도로와 전기돌동굴 경유를 남기자'};
    const m=MISTRALTON_NEXUS,slot=save.flags[m.slot],partner=typeof slot==='number'?save.party[slot]:undefined;
    if(save.flags[m.completed])return save.flags[m.rewarded]
      ?{id:'mistralton-flight',title:'산로마을로 이어지는 비행',map:'tour_mistralton_hall',event:'tourMistraltonLentimasFlight',action:'1층 조종사에게 산로행 왕복편을 물어보거나 남쪽 전기돌동굴로 돌아가자'}
      :{id:'mistralton-cargo-supply',title:'남겨 둔 작업 보급',map:'tour_mistralton_hall_2f',event:'tourMistraltonCargoLog',action:'몬스터볼 3개 공간을 마련한 뒤 적재표에서 보급을 받자. 항공편은 바로 이용할 수 있다'};
    if(!save.flags[m.prepared]||!partner||partner.species!==save.flags[m.partner])return {id:'mistralton-cargo-partner',title:'바람을 읽을 작업 동료',map:'tour_mistralton_hall_2f',event:'tourMistraltonCargoLog',action:'화물 적재표에서 건강한 비행 또는 에스퍼타입 동료를 고르자'};
    if(partner.hp<=0)return {id:'mistralton-cargo-recovery',title:'작업 동료 회복',map:'tour_mistralton_center',event:'nurse',action:'선택한 동료를 센터에서 치료한 뒤 적재장으로 돌아오자'};
    if(!save.flags[m.loaded])return {id:'mistralton-cargo-load',title:'광물과 농산물 싣기',map:'tour_mistralton',event:'tourOutdoor3',action:'동쪽 화물 적재장에서 바람에 맞춘 상자 순서를 직접 고르자'};
    if(!save.flags[m.rested])return {id:'mistralton-cargo-rest',title:'함께 일한 동료의 휴식',map:'tour_mistralton',event:'tourOutdoor4',action:'바람쉼터에서 동료의 날개·발·호흡과 물그릇을 확인하자'};
    if(!save.flags[m.completed])return {id:'mistralton-cargo-record',title:'빠르고 안전한 화물 기록',map:'tour_mistralton_hall_2f',event:'tourMistraltonCargoLog',action:'터미널 적재표에 동료의 작업과 휴식을 함께 남기자'};
    return {id:'mistralton-flight',title:'산로마을로 이어지는 비행',map:'tour_mistralton_hall',event:'tourMistraltonLentimasFlight',action:'센터에서 동료를 회복하고 1층 조종사에게 산로행 왕복편을 물어보자'};
  }
  if(['tour_lentimas','tour_lentimas_hall','tour_lentimas_center','tour_reversal_mountain_exterior','tour_reversal_mountain_a','tour_reversal_mountain_b','tour_undella','tour_undella_hall','tour_undella_center','tour_unova_route_13'].includes(current)&&save.flags.lentimasFlightArrived){
    if(!save.flags.lentimasMountainPrepared)return {id:'lentimas-mountain-preparation',title:'재바람 산길 준비',map:'tour_lentimas_hall',event:'tourLentimasPreparation',action:'산길 안내소에서 건강한 동료를 고르거나 혼자 물·마른 천·귀환 방향을 확인하자'};
    if(['tour_lentimas','tour_lentimas_hall','tour_lentimas_center'].includes(current))return {id:'reversal-exterior-departure',title:'리버스마운틴 외부 생태',map:'tour_reversal_mountain_exterior',event:'tourReversalTracks',action:'동쪽 출구로 나가 스콜피·톱치가 머무는 곁풀과 조우 없는 가운데 길을 구분하자'};
    if(current==='tour_reversal_mountain_exterior'&&!save.flags[trainerWinFlag('unova-reversal-exterior-practice')])return {id:'reversal-exterior-practice',title:'재바람 능선 선택 실전',map:'tour_reversal_mountain_exterior',event:'tourReversalExteriorTrainer',action:'곁풀 밖 공터에서 스콜피·톱치 트레이너와 겨루거나 동쪽 통과구역 A로 진행하자'};
    if(current==='tour_reversal_mountain_exterior')return {id:'reversal-entrance-cavern',title:'식은 수로가 있는 첫 동굴',map:'tour_reversal_mountain_a',event:'tourReversalCooledChannel',action:'동쪽 입구로 들어가 피그점프·스콜피·단굴·또르박쥐가 사는 곁 선반과 마른 통로를 구분하자'};
    if(current==='tour_reversal_mountain_a')return {id:'reversal-main-cavern',title:'서늘한 바람을 찾는 깊은 길',map:'tour_reversal_mountain_b',event:'tourReversalCoolAlcove',action:'통과구역 B의 고온 지면을 우회하고 동쪽 물결마을 출구로 향하자'};
    if(current==='tour_reversal_mountain_b')return {id:'undella-arrival',title:'산에서 바다로 이어진 여행',map:'tour_undella_hall',event:'tourUndellaArrivalLog',action:'동쪽 출구로 물결마을에 도착해 안내소 1층에 산로부터 걸어온 순서를 남기자'};
    if(!save.flags.undellaArrivalLogged)return {id:'undella-arrival-log',title:'산로에서 물결까지의 기록',map:'tour_undella_hall',event:'tourUndellaArrivalLog',action:'안내소 1층에서 산로마을·리버스마운틴 외부·A·B·물결마을 순서를 기록하자'};
    const routeThirteen=[...save.party,...(save.box??[])].filter(mon=>mon.met==='하나 13번도로');
    if(['tour_undella','tour_undella_hall','tour_undella_center'].includes(current)&&!save.flags.undellaRouteThirteenReturnReviewed)return {id:'route-thirteen-departure',title:'13번도로 해안 생태',map:'tour_unova_route_13',event:'tourRouteThirteenCoast',action:'동쪽 13번도로 곁풀에서 덩쿠리·패리퍼를 만나거나 가운데 길로 보배마을 방향을 살피자'};
    if(current==='tour_unova_route_13'&&!routeThirteen.length)return {id:'route-thirteen-encounter',title:'절벽 풀의 서로 다른 생활',map:'tour_unova_route_13',event:'tourRouteThirteenMeadow',action:'곁풀에서 덩쿠리·패리퍼를 만나 포획하거나 조우 없는 가운데 길로 계속 진행하자'};
    if(current==='tour_unova_route_13'&&!save.flags[trainerWinFlag('unova-route-13-practice')])return {id:'route-thirteen-practice',title:'해안 동료와 선택 실전',map:'tour_unova_route_13',event:'tourRouteThirteenTrainer',action:'절벽 곁 마른 공터에서 덩쿠리·패리퍼 트레이너와 겨루거나 남북 본선으로 계속 걷자'};
    if(current==='tour_unova_route_13')return {id:'route-thirteen-homecoming',title:'포획과 성장 뒤 물결 귀환',map:'tour_undella',event:'tourResident3',action:'남쪽 물결마을로 돌아가 동쪽 길 안내원에게 13번도로 동료와 실전 결과를 보여 주자'};
    return {id:'undella-return-choice',title:'해안에서 다음 길과 귀환 고르기',map:'tour_undella',action:'서쪽 리버스마운틴으로 산로에 돌아가거나 동쪽 13번도로와 보배마을로 여행을 이어가자'};
  }
  if(['tour_lacunosa','tour_lacunosa_hall','tour_lacunosa_hall_2f','tour_lacunosa_hall_3f','tour_lacunosa_center','tour_unova_route_12','tour_village_bridge','tour_village_bridge_hall','tour_village_bridge_hall_2f','tour_village_bridge_hall_3f','tour_village_bridge_center','tour_unova_route_11'].includes(current)){
    const routeTwelve=[...save.party,...(save.box??[])].filter(mon=>mon.met==='하나 12번도로');
    const routeTwelveSlot=save.flags.nexusRouteTwelveBattlePartnerSlot,routeTwelvePartner=typeof routeTwelveSlot==='number'?save.party[routeTwelveSlot]:undefined;
    const routeTwelveParticipant=save.flags.nexusRouteTwelveBattlePartnerWon===true&&!!routeTwelvePartner&&routeTwelvePartner.species===save.flags.nexusRouteTwelveBattlePartner&&routeTwelvePartner.met==='하나 12번도로';
    if(!save.flags.lacunosaWallLogged)return {id:'lacunosa-wall-log',title:'성벽 안에서 이어지는 길',map:'tour_lacunosa_hall',event:'tourLacunosaWallLog',action:'기록관 1층에서 남쪽 13번도로 문과 서쪽 귀환 방향을 살피자'};
    if(!save.flags.lacunosaCourtyardCared)return {id:'lacunosa-courtyard-care',title:'사람과 포켓몬의 공동 안뜰',map:'tour_lacunosa_hall_3f',event:'tourLacunosaCourtyardCare',action:'건강한 동료와 안뜰 물그릇·그늘·통로를 살피거나 혼자 기록하자'};
    if(['tour_lacunosa','tour_lacunosa_hall','tour_lacunosa_hall_2f','tour_lacunosa_hall_3f','tour_lacunosa_center'].includes(current)&&!save.flags.lacunosaRouteTwelveReturnReviewed)return {id:'route-twelve-departure',title:'12번도로 전원 생태',map:'tour_unova_route_12',event:'tourRouteTwelveMeadow',action:'서쪽 12번도로에서 로젤리아·세꿀버리·유토브가 사는 곁풀과 안전한 낮은 길을 구분하자'};
    if(current==='tour_unova_route_12'&&!routeTwelve.length)return {id:'route-twelve-capture',title:'전원 초원의 동료 만나기',map:'tour_unova_route_12',event:'tourRouteTwelveMeadow',action:'북쪽이나 남쪽 곁풀에서 현지 포켓몬을 만나고 포획하거나 안전한 길로 계속 가자'};
    if(current==='tour_unova_route_12'&&!routeTwelveParticipant)return {id:'route-twelve-practice',title:'현지 동료와 선택 실전',map:'tour_unova_route_12',event:'tourRouteTwelveTrainer',action:save.flags[trainerWinFlag('unova-route-12-practice')]?'12번도로의 건강한 동료를 선두로 두고 상금 없는 재확인전을 마치자':'12번도로의 건강한 동료를 선두로 두고 초원 트레이너와 겨루거나 그대로 통과하자'};
    if(current==='tour_unova_route_12')return {id:'route-twelve-homecoming',title:'포획과 성장 뒤 보배 귀환',map:'tour_lacunosa',event:'tourResident3',action:'동쪽 보배마을로 돌아가 서쪽 길 안내원에게 12번도로 동료와 실전 결과를 보여 주자'};
    if(!save.flags.villageBridgeWalkLogged)return {id:'village-bridge-walk-log',title:'두 도로를 잇는 긴 다리',map:'tour_village_bridge_hall',event:'tourVillageBridgeWalkLog',action:'생활관 1층에서 12번도로 도착점·중앙 보행선·11번도로 방향을 확인하자'};
    if(!save.flags.villageBridgeRested)return {id:'village-bridge-rest-log',title:'다리를 건넌 동료의 휴식',map:'tour_village_bridge_hall_3f',event:'tourVillageBridgeRestLog',action:'생활관 3층에서 동료와 휴게뜰의 물그릇·그늘·통행 여백을 살피자'};
    if(current==='tour_village_bridge'){
      const ensemble=Number(save.flags.villageBridgeEnsembleParts??0),parts=[{bit:1,event:'tourVillageBridgeFlute',action:'동쪽 난간의 풀피리 주민을 만나자'},{bit:2,event:'tourVillageBridgeGuitar',action:'서쪽 둔치의 기타 주민을 만나자'},{bit:4,event:'tourVillageBridgeBeatbox',action:'다리 끝의 박자 주민을 만나자'},{bit:8,event:'tourResident2',action:'중앙 공연 뜰의 엔카 연습자를 만나자'}],part=parts.find(item=>(ensemble&item.bit)===0);
      if(part)return {id:'village-bridge-ensemble',title:'다리에서 이어지는 네 생활 리듬',map:'tour_village_bridge',event:part.event,action:part.action};
    }
    const routeEleven=[...save.party,...(save.box??[])].filter(mon=>mon.met==='하나 11번도로'&&[183,588,616].includes(mon.species));
    const routeElevenSlot=save.flags.nexusRouteElevenBattlePartnerSlot,routeElevenPartner=typeof routeElevenSlot==='number'?save.party[routeElevenSlot]:undefined;
    const routeElevenParticipant=save.flags.nexusRouteElevenBattlePartnerWon===true&&!!routeElevenPartner&&routeElevenPartner.species===save.flags.nexusRouteElevenBattlePartner&&routeElevenPartner.met==='하나 11번도로';
    if(['tour_village_bridge','tour_village_bridge_hall','tour_village_bridge_hall_2f','tour_village_bridge_hall_3f','tour_village_bridge_center'].includes(current)&&!save.flags.villageBridgeRouteElevenReturnReviewed)return {id:'route-eleven-departure',title:'11번도로 물길과 바위 단차',map:'tour_unova_route_11',event:'tourRouteElevenWaterfall',action:'서쪽 11번도로에서 선택 풀밭과 조우 없는 가운데 길을 구분하자'};
    if(current==='tour_unova_route_11'&&!routeEleven.length)return {id:'route-eleven-capture',title:'물길 곁의 현지 동료',map:'tour_unova_route_11',action:'두 선택 풀밭에서 마릴·딱정곤·쪼마리를 만나고 포획하거나 가운데 길로 계속 가자'};
    if(current==='tour_unova_route_11'&&!routeElevenParticipant)return {id:'route-eleven-practice',title:'현지 동료와 선택 실전',map:'tour_unova_route_11',event:'tourRouteElevenTrainer',action:save.flags[trainerWinFlag('unova-route-11-practice')]?'11번도로의 건강한 동료를 선두로 두고 상금 없는 재확인전을 마치자':'11번도로의 건강한 동료를 선두로 두고 생태 트레이너와 겨루거나 그대로 통과하자'};
    if(current==='tour_unova_route_11')return {id:'route-eleven-homecoming',title:'포획과 성장 뒤 다리 귀환',map:'tour_village_bridge',event:'tourResident3',action:'동쪽 빌리지브리지로 돌아가 길 안내원에게 11번도로 동료와 실전 결과를 보여 주자'};
    return {id:'opelucid-next',title:'석조 거리의 쌍용시티',map:'tour_unova_route_11',action:'서쪽 11번도로를 다시 지나 쌍용시티 동문으로 여행을 이어가자'};
  }
  if(['tour_opelucid','tour_opelucid_center','tour_opelucid_hall','tour_opelucid_hall_2f','tour_opelucid_hall_3f','tour_unova_route_09','tour_unova_mall_nine_1f','tour_tubeline_bridge'].includes(current)){
    const arrival=opelucidArrivalPartner(save);
    if(arrival.state==='fainted')return {id:'opelucid-partner-recovery',title:'11번도로 동료 회복',map:'tour_opelucid_center',event:'tourOpelucidCenterGuide',action:`${arrival.partner?withParticle(SPECIES[arrival.partner.species].name,'을/를'):'실전 동료를'} 센터에서 회복한 뒤 동문 여행자에게 돌아가자`};
    if(arrival.state==='missing')return {id:'opelucid-partner-return',title:'실전 동료 다시 편성',map:'tour_opelucid_center',event:'tourOpelucidCenterGuide',action:'센터 PC에서 11번도로 선택 실전에 참가한 원래 동료를 현재 파티로 데려오자'};
    if(arrival.state==='ready'&&!save.flags[OPELUCID_ARRIVAL.arrived])return {id:'opelucid-east-arrival',title:'11번도로에서 쌍용 동문으로',map:'tour_opelucid',event:'tourResident0',action:'동문 여행자에게 11번도로 실전에 참가한 같은 동료의 도착과 현재 상태를 보여 주자'};
    if(!save.flags.opelucidCityLogged)return {id:'opelucid-city-log',title:'두 시대의 생활 거리',map:'tour_opelucid_hall',event:'tourOpelucidCityLog',action:'역사관 1층에서 동문·오래된 석조 거리·새 거리의 보행 순서를 기록하자'};
    if(!save.flags[OPELUCID_ARRIVAL.moveStudy])return {id:'opelucid-move-study',title:'11번도로 동료의 기술 역할',map:'tour_opelucid_hall_2f',event:'tourOpelucidMoveStudy',action:'역사관 2층에서 마릴·딱정곤·쪼마리의 현재 기술과 지원 기술을 비교하자'};
    if(!save.flags.opelucidCompanionObserved)return {id:'opelucid-companion-observation',title:'용 문양과 동료의 움직임',map:'tour_opelucid_hall_3f',event:'tourOpelucidCompanionObserve',action:'3층 관찰석에서 건강한 동료와 광장 기둥의 선·비늘·발자국 모양을 살피자'};
    if(!save.flags.routeNineMallFrontChecked)return {id:'opelucid-route-nine-departure',title:'서쪽 9번도로 출발',map:'tour_unova_route_09',event:'tourRouteNineMall',action:'서문에서 9번도로로 나가 쇼핑몰 나인 외부의 보행선·하역선·포장 본선을 구분하자'};
    if(![...save.party,...(save.box??[])].some(mon=>mon.met==='하나 9번도로'))return {id:'opelucid-route-nine-capture',title:'9번도로 치라미 만나기',map:'tour_unova_route_09',event:'tourRouteNineGrass',action:'남쪽 선택 풀밭에서 치라미를 만나 포획하거나 바깥 흙길로 포장 본선에 돌아오자'};
    const routeNineSlot=save.flags[ROUTE_NINE_JOURNEY.slot],routeNinePartner=typeof routeNineSlot==='number'?save.party[routeNineSlot]:undefined;
    const routeNineParticipant=save.flags[ROUTE_NINE_JOURNEY.participated]===true&&routeNinePartner?.species===save.flags[ROUTE_NINE_JOURNEY.partner]&&isRouteNinePartner(routeNinePartner);
    if(!routeNineParticipant)return {id:'opelucid-route-nine-practice',title:'현지 치라미와 9번도로 실전',map:'tour_unova_route_09',event:'tourRouteNineTrainer',action:save.flags['trainerWon:unova-route-9-practice']?'건강한 9번도로 치라미를 선두로 두고 상금 없는 재확인전을 마치자':'건강한 9번도로 치라미를 선두로 두고 라이더와 겨루거나 그대로 지나가자'};
    if(routeNinePartner!.hp<=0)return {id:'opelucid-route-nine-recovery',title:'9번도로 동료 회복',map:'tour_opelucid_center',event:'nurse',action:'실전에 참가한 치라미를 쌍용센터에서 회복하고 서문 쉼터로 돌아가자'};
    if(!save.flags[ROUTE_NINE_JOURNEY.returned])return {id:'opelucid-route-nine-return',title:'치라미와 포장 본선 귀환',map:'tour_unova_route_09',event:'tourRouteNineRest',action:'쌍용 서문 쉼터에서 같은 치라미의 출발 레벨·현재 레벨·HP를 확인하자'};
    if(!save.flags.mallNineDeliverySorted)return {id:'mall-nine-delivery',title:'쇼핑몰 나인 입고 정리',map:'tour_unova_mall_nine_1f',event:'tourMallNineDeliveries',action:'북쪽 쇼핑몰 공개 1층에서 같은 치라미와 작은 상자의 입고일·하역선·진열 방향을 맞추자'};
    if(!save.flags.mallNineTravelLaneChecked)return {id:'mall-nine-travel-lane',title:'진열대 사이 포켓몬 통행선',map:'tour_unova_mall_nine_1f',event:'tourMallNineTravelGoods',action:'여행용품 진열대와 손수레 사이에 사람과 포켓몬이 지날 여백을 확인하자'};
    if(!save.flags.mallNinePartnerWorkCompleted)return {id:'mall-nine-partner-rest',title:'함께 일한 치라미의 휴식',map:'tour_unova_mall_nine_1f',event:'tourMallNineRest',action:'동행 휴게 구역에서 같은 치라미의 현재 레벨·HP와 작업 뒤 휴식을 기록하자'};
    if(!save.flags.routeNineGrassPathChecked)return {id:'opelucid-route-nine-grass',title:'9번도로 숲 풀길 기록',map:'tour_unova_route_09',event:'tourRouteNineGrass',action:'남쪽 풀길의 마른 흙·바람·치라미가 머무는 풀을 살피고 포장 본선으로 돌아오자'};
    if(!save.flags.tubelineCrossingChecked)return {id:'opelucid-tubeline-crossing',title:'튜브라인브리지 횡단',map:'tour_tubeline_bridge',event:'tubelineGuide',action:'서쪽 점검대부터 동쪽 점검대까지 철골 보행 통로를 확인하거나 그대로 건너자'};
    return {id:'opelucid-westward',title:'9번도로 너머 설화시티',map:'tour_tubeline_bridge',action:'튜브라인브리지를 건너 하나 8번도로와 설화시티 방향으로 여행을 이어가자'};
  }
  if(['tour_unova_route_08','tour_icirrus','tour_icirrus_center','tour_icirrus_hall','tour_icirrus_hall_2f','tour_icirrus_hall_3f','tour_icirrus_moor'].includes(current)){
    const owned=[...save.party,...(save.box??[])].filter(isRouteEightPartner),f=ROUTE_EIGHT_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined;
    const participated=save.flags[f.participated]===true&&partner?.species===save.flags[f.partner]&&isRouteEightPartner(partner);
    if(!owned.length)return {id:'route-eight-capture',title:'빗물 습지의 현지 동료',map:'tour_unova_route_08',event:'tourRouteEightMarsh',action:'북쪽·남쪽 선택 풀밭에서 딱정곤·쪼마리를 만나 포획하거나 가운데 마른 본선으로 계속 가자'};
    if(!participated)return {id:'route-eight-practice',title:'현지 동료와 8번도로 실전',map:'tour_unova_route_08',event:'tourRouteEightTrainer',action:save.flags['trainerWon:unova-route-8-practice']?'건강한 8번도로 동료를 선두로 두고 상금 없는 재확인전을 마치자':'건강한 8번도로 동료를 선두로 두고 습지 트레이너와 겨루거나 그대로 지나가자'};
    if(partner!.hp<=0)return {id:'route-eight-recovery',title:'습지 동료 회복',map:'tour_icirrus_center',event:'nurse',action:'실전에 참가한 동료를 설화센터에서 회복하고 동문 여행자에게 돌아가자'};
    if(!save.flags[f.arrived])return {id:'icirrus-route-eight-arrival',title:'8번도로에서 설화 동문으로',map:'tour_icirrus',event:'tourResident0',action:'동문 여행자에게 선택 실전에 참가한 같은 동료의 현재 레벨과 HP를 보여 주자'};
    if(!save.flags.icirrusArrivalLogged)return {id:'icirrus-arrival-log',title:'마른 본선과 빗물 순환로',map:'tour_icirrus_hall',event:'tourIcirrusArrivalLog',action:'생활관 1층에서 8번도로 동문·마른 본선·빗물 순환로의 도착 순서를 기록하자'};
    if(!save.flags.icirrusWaterCompared)return {id:'icirrus-water-study',title:'길·연못·생활용 물 구분',map:'tour_icirrus_hall_2f',event:'tourIcirrusWaterStudy',action:'생활관 2층에서 웅덩이·도시 연못·발을 씻는 물의 서로 다른 쓰임을 비교하자'};
    if(!save.flags.icirrusMoorObservationCompleted)return {id:'icirrus-moor-observation',title:'설화의 습지 생태 관찰',map:'tour_icirrus_moor',event:'icirrusMoorKeeper',action:'8번도로 북쪽 분기에서 갈대 수위와 물새 흔적을 동료와 살피고 같은 데크로 돌아오자'};
    if(!save.flags.icirrusCompanionRested)return {id:'icirrus-companion-rest',title:'북쪽 전망에서 여행 정리',map:'tour_icirrus_hall_3f',event:'tourIcirrusCompanionRest',action:'생활관 3층에서 동료와 8번도로·습지·북쪽 용나선 방향을 돌아보자'};
    return {id:'icirrus-dragonspiral-next',title:'도로 번호 없는 용나선탑 접근로',map:'tour_dragonspiral_approach',action:'설화 북문에서 별도 접근로를 지나 용나선탑 기슭으로 여행을 이어가자'};
  }
  if(['tour_unova_route_04','tour_join_avenue','tour_nimbasa','tour_nimbasa_hall'].includes(current)&&save.flags[CASTELIA_COMPARISON.preserved]){
    const f=NIMBASA_NEXUS;
    if(!save.flags[f.route])return {id:'nimbasa-route-comparison',title:'길과 생활의 기록',map:'tour_unova_route_04',event:'tourRouteFourWorkSample',action:'4번도로 공사 표본에서 노반과 사암 흔적을 대조하자'};
    if(!save.flags[f.arrival])return {id:'nimbasa-arrival',title:'뇌문에 도착한 여행자',map:'tour_nimbasa',event:'tourResident0',action:'조인애버뉴를 거쳐 도착한 여행자의 경험을 듣자'};
    if(!save.flags[f.lights])return {id:'nimbasa-light-comparison',title:'길을 밝히는 불빛',map:'tour_nimbasa',event:'tourResident4',action:'조명 점검원과 길찾기와 휴식의 차이를 살펴보자'};
    if(!save.flags[f.preserved])return {id:'nimbasa-preserve',title:'서로 다른 현장 기록',map:'tour_nimbasa_hall',event:'tourExhibit0',action:'놀이 지도에 도로와 시민의 경험을 함께 남기자'};
    return {id:'nimbasa-westward',title:'화물이 도착하는 도시',map:'tour_pass_nimbasa_driftveil',action:'서쪽 5번도로와 물풍경도개교로 여행을 이어가자'};
  }
  if((current==='tour_castelia'||current==='tour_castelia_hall')&&casteliaComparisonReady(save)){
    const f=CASTELIA_COMPARISON;
    if(save.flags[f.preserved])return {id:'castelia-comparison-next',title:'다음 현장의 목소리',map:'tour_unova_route_04',action:'북쪽 4번도로를 지나 뇌문 철도의 현장으로 향하자'};
    if(!save.flags[f.opened])return {id:'castelia-comparison-open',title:'인주 기록과 구름 전시',map:'tour_castelia_hall',event:'tourCasteliaProjectExhibit',action:'전시대에서 인주 공개 기록과 대조할 항목을 고르자'};
    if(!save.flags[f.worker])return {id:'castelia-comparison-worker',title:'운송 길의 실제 이익',map:'tour_castelia',event:'tourResident0',action:'해안 직장인에게 넓어진 운송 길의 경험을 다시 물어보자'};
    if(!save.flags[f.resident])return {id:'castelia-comparison-resident',title:'골목에서 살아가는 동료',map:'tour_castelia',event:'tourResident1',action:'골목 주민의 생활 통로와 동료 휴식 자리도 함께 대조하자'};
    return {id:'castelia-comparison-preserve',title:'서로 다른 증언 함께 남기기',map:'tour_castelia_hall',event:'tourCasteliaProjectExhibit',action:'전시대로 돌아가 두 증언을 출처별로 보존하자'};
  }
  if((current==='tour_castelia'||current==='tour_castelia_hall')&&save.flags.casteliaFieldExhibit){
    const sites=TOUR_OUTDOORS.tour_castelia.objects;
    const cargo=sites.find(o=>o.name==='동쪽 화물 부두')?.event;
    const alley=sites.find(o=>o.name==='골목의 화분 정원')?.event;
    const steps=[
      {flag:'casteliaFieldCargo',event:cargo,action:'동쪽 화물 부두에서 전시 동선과 수레 자국을 비교하자'},
      {flag:'casteliaFieldWorker',event:'tourResident0',action:'해안 직장인에게 실제 운송 길의 변화를 물어보자'},
      {flag:'casteliaFieldRestMat',event:alley,action:'화분 골목에서 통로를 비운 휴식 자리를 마련하자'},
      {flag:'casteliaFieldAlley',event:'tourResident1',action:'골목 주민에게 생활 길과 휴식 자리의 이야기를 듣자'},
    ];
    const step=steps.find(step=>!save.flags[step.flag]);
    if(step?.event)return {id:'castelia-field-'+step.flag,title:'구름의 두 가지 생활 길',map:'tour_castelia',event:step.event,action:step.action};
    if(!step&&current==='tour_castelia')return {id:'castelia-field-report',title:'현장과 전시 함께 살피기',map:'tour_castelia_hall',event:'tourCasteliaProjectExhibit',action:'전시대로 돌아가 부두와 골목의 기록을 함께 살펴보자'};
    if(!step)return {id:'castelia-field-departure',title:'다음 도시의 운송 길',map:'tour_unova_route_04',action:'북쪽 4번도로를 따라 다음 여행을 이어가자'};
  }
  if(current==='tour_castelia_sewers'||current==='tour_castelia_park'){
    const f=CASTELIA_SEWER_JOURNEY,slot=save.flags[f.slot];
    const partner=typeof slot==='number'?save.party[slot]:undefined;
    if(save.flags[f.returned])return {id:'castelia-harbor-return',title:'동료와 항구로 귀환',map:'tour_castelia_center',event:'nurse',action:'하수도 동쪽 계단과 항구를 거쳐 센터에서 쉬자'};
    if(!save.flags[f.inspected])return {id:'castelia-sewer-habitat',title:'하수도의 서식 흔적',map:'tour_castelia_sewers',event:'tourCasteliaSewerHabitat',action:'마른 배수 곁방에서 포켓몬의 흔적을 살펴보자'};
    if(!partner||partner.species!==save.flags[f.partner]||!['구름하수도','구름시티 공원'].includes(partner.met))return {id:'castelia-hidden-park',title:'두 서식지의 동료 선택',map:'tour_castelia_park',event:'tourCasteliaParkLight',action:'현지에서 만난 동료를 데리고 공원의 햇볕 자리로 가자'};
    if(partner.hp<=0)return {id:'castelia-partner-recovery',title:'동료 회복 후 돌아오기',map:'tour_castelia_center',event:'nurse',action:'항구 센터에서 동료를 회복한 뒤 공원에 돌아오자'};
    if(!save.flags[f.participated])return {id:'castelia-park-practice',title:'선택한 동료와 배틀',map:'tour_castelia_park',event:'tourCasteliaParkTrainer',action:'선택한 동료를 실제로 출전시켜 산책 트레이너와 겨뤄 보자'};
    return {id:'castelia-park-return',title:'동료와 귀환 준비',map:'tour_castelia_park',event:'tourCasteliaParkReturn',action:'남쪽 계단 앞에서 동료의 성장과 귀환 길을 기록하자'};
  }
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
  const nextArea=(id:MapId)=>{
    const exit=getMap(worldMapId(save.map),save.flags).warps.find(w=>w.to===id&&(!w.requiresFlag||save.flags[w.requiresFlag]));
    const arrows={up:'↑',down:'↓',left:'←',right:'→'};
    return `${exit?arrows[exit.entry]+' ':''}${getMap(id,save.flags).name}`;
  };
  if(save.party.some(p=>p.hp*5<=p.maxHp)){
    for(const area of connectedAreas(save)){
      const nurse=area.map.npcs.find(n=>['mom','nurse','routeGuide','trailGuide'].includes(n.dialogue)||(isWorldCenter(area.map.id)&&n.dialogue==='tourHost'));
      if(!nurse)continue;
      const recovery:AdventureObjective={id:'recover',event:nurse.dialogue==='tourHost'?'nurse':nurse.dialogue,title:'포켓몬을 회복하자',map:area.id,action:nurse.name+'에게 말을 걸자'};
      const ferry=save.map==='tour_vermilion'&&area.first==='tour_canalave';
      return {objective:recovery,lines:area.first?[ferry?'선원에게 왕복선을 부탁하자':'회복: '+area.map.name,'다음: '+nextArea(area.first)]:[save.party.some(p=>p.hp===0)?'쓰러진 친구가 있어요':'HP가 위험한 친구가 있어요',recovery.action]};
    }
  }
  if(save.map===objective.map)return {objective,lines:['이곳에서 할 일',objective.action]};
  for(const area of connectedAreas(save)){
    if(area.id===objective.map&&area.first)return {objective,lines:['목적지: '+MAPS[objective.map].name,'다음: '+nextArea(area.first)]};
  }
  return {objective,lines:['목적지: '+MAPS[objective.map].name,'주변 안내원에게 길을 물어보자']};
}
