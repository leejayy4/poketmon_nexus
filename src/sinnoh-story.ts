import { startFerryJourney } from './ferry-journey';
import type { Engine } from './engine';
import { GYMS } from './gyms';
import { gardeniaPreparationPages } from './gardenia-preparation';
import { fantinaPreparationPages } from './fantina-preparation';
import { maylenePreparationPages } from './maylene-preparation';
import { adventureObjective } from './adventure-guide';
import { MAPS } from './maps';
import { SPECIES } from './pokemon';
import { viridianForestGuidePages } from './encounter-guidance';
const canonicalLakeEvents:Record<string,{key:string;name:string}>={
  verityLakeKeeper:{key:'verityLake',name:'진실호수'},valorLakeBodyKeeper:{key:'valorLakeBody',name:'입지호수'},acuityLakeBodyKeeper:{key:'acuityLakeBody',name:'예지호수'},
  verityLakeSign:{key:'verityLake',name:'진실호수'},valorLakeBodySign:{key:'valorLakeBody',name:'입지호수'},acuityLakeBodySign:{key:'acuityLakeBody',name:'예지호수'},
  verityLakeCaveSign:{key:'verityLake',name:'진실호수'},valorLakeBodyCaveSign:{key:'valorLakeBody',name:'입지호수'},acuityLakeBodyCaveSign:{key:'acuityLakeBody',name:'예지호수'},
};
export function sinnohEvent(g:Engine,id:string):boolean {
  if(id==='viridianForestGuide'){g.say('길 안내원',viridianForestGuidePages());return true;}
  if(id==='sinnohGymGuide'){
    if(g.save.map==='eterna_gym'){g.say('체육관 안내원',gardeniaPreparationPages(g.save));return true;}
    if(g.save.map==='hearthome_gym'){g.say('체육관 안내원',fantinaPreparationPages(g.save));return true;}
    if(g.save.map==='veilstone_gym'){g.say('체육관 안내원',maylenePreparationPages(g.save));return true;}
    const gym=GYMS[['eterna_gym','hearthome_gym','veilstone_gym'].indexOf(g.save.map)+1];
    g.say('체육관 안내원',['이곳은 '+gym.name+'의 체육관이에요.\n앞선 배지를 얻었다면 도전하세요.','레벨 '+gym.level+'과 상처약을 준비하세요.\n센터에서 회복하고 상점에 들러요.']);return true;
  }
  if(id==='trailGuide'){
    g.healParty();if(!g.save.badges.length)g.save.inventory.potions=Math.max(2,g.save.inventory.potions);g.persist();
    const directions=g.save.map==='tour_eterna_forest'
      ?['흙길을 따르면 풀밭을 피할 수 있어요.\n영원숲 북쪽길은 영원시티로 이어져요.','영원숲 남쪽길은 축복시티로 이어져요.\n두 길 모두 걸어서 돌아올 수 있어요.']
      :g.save.map==='tour_coronet'
      ?['영원 쪽은 천관산 영원 입구길을 지나요.\n남쪽은 현재 축약 연결로 연고에 이어져요.','동쪽 갈림길은 통합 신오 호수 거점이에요.\n풀밭을 피하려면 흙길을 따라가세요.']
      :['가운데 길은 안전하고 풀밭은 훈련 장소예요.\n서쪽으로 돌아갈 수도 있어요.'];
    g.say('길 안내원',[g.save.badges.length?'포켓몬들이 모두 건강해졌어요.\n도구는 마을 상점에서 구입하세요.':'포켓몬을 회복하고 상처약을\n2개까지 채웠어요.',...directions]);return true;
  }
  if(id==='sinnohGuide'){
    const has=(badge:string)=>g.save.badges.includes(badge);
    const hearthomeChoices=g.save.map==='tour_hearthome'?[
      {label:'209번도로 · 신수 방면',action:()=>g.setTourDestination('tour_sinnoh_route_209','journeySign')},
      {label:'212번도로 · 들판 방면',action:()=>g.setTourDestination('tour_sinnoh_route_212_north','journeySign')},
      {label:'안내 마치기',action:()=>{}},
    ]:undefined;
    const pages=g.save.map==='tour_eterna'
      ?has('BADGE-GS02')?['유채에게 승리했군요. 천관산 길을 지나\n연고의 멜리사에게 도전해 보세요.','얼마 전 시계가 3초 늦어졌어요.\n다른 도시에서도 같은 일이 있었대요.']:['천관산 연결길을 지나면 연고예요.\n먼저 유채의 체육관에 도전해 보세요.','얼마 전 시계가 3초 늦어졌어요.\n다른 도시에서도 같은 일이 있었대요.']
      :g.save.map==='tour_hearthome'
      ?has('BADGE-GS03')
        ?['멜리사에게 승리했군요. 209번도로와 신수마을을 지나\n210번도로 남부·215번도로를 따라 장막으로 가세요.','215번도로에는 비와 물길이 이어져요.\n포켓몬을 쉬게 하며 다리를 건너세요.','콘테스트 홀의 작은 무대와 동쪽 정원에서는\n파티 동료와 공연 동작을 연습할 수 있어요.','역의 시계 기록도 3초가 어긋났대요.\n장막 연구원이 기록을 모으고 있어요.']
        :[
          '이곳은 멜리사의 체육관이 있는 연고예요.\n센터에서 회복하고 상점에서 여행을 준비하세요.',
          g.save.flags.hearthomePracticeCompleted?'동료와 공연 연습을 마쳤군요.\n체육관에 가거나 정원에서 다시 호흡을 맞춰 보세요.':'동쪽 야외 연습 정원을 걸은 뒤\n콘테스트 홀의 작은 무대에 올라 보세요.',
          '장막 방면은 209번도로·신수마을·210번도로 남부·\n215번도로를 차례로 지나가요.',
          '두 연결도로는 걸어서 나갔다가\n언제든 연고로 돌아올 수 있어요.',
        ]
      :g.save.flags.researchDelivered?['GYM 간판이 있는 곳이 자두의 체육관이에요.\n관측 자료는 무사히 전달됐대요.','다른 지방도 자유롭게 둘러보며\n새로운 소식을 찾아보세요.']:['GYM 간판이 있는 곳이 자두의 체육관이에요.\n승리하면 마을의 관측 연구원을 만나세요.'];
    if((g.save.map==='tour_eterna'&&has('BADGE-GS03'))||(g.save.map==='tour_hearthome'&&has('BADGE-GS04'))){
      const objective=adventureObjective(g.save),gym=GYMS.find(gym=>gym.id===objective?.id);
      if(objective)pages[0]=`${MAPS[objective.map].name} · ${objective.title}\n${gym?`관장 ${gym.name}에게 도전해 보세요.`:objective.id==='observation'?'관측 연구원을 만나 보세요.':objective.action}`;
    }
    g.say('도시 안내원',pages,undefined,hearthomeChoices);return true;
  }
  if(id==='observation'){
    if(!GYMS.every(gym=>g.save.badges.includes(gym.badge))){g.say('관측 연구원',['신오의 네 체육관을 돌아온 뒤\n관측 자료 전달을 부탁하고 싶어요.']);return true}
    if(g.save.flags.researchDelivered){
      g.say('관측 연구원',['자료를 무사히 전달해 주셨군요.\n축복과 운하에서 조사가 시작되었어요.','선원을 만나 바다 건너의 다른 지방도\n자유롭게 둘러보고 오세요.']);
      return true;
    }
    if(g.save.flags.observationCollected){g.say('관측 연구원',['맡긴 관측 자료는 축복시티의\n연구 통로 안내원에게 전해 주세요.']);return true;}
    g.save.flags.observationCollected=true;g.persist();g.say('관측 연구원',['도시의 시계와 열차 기록이\n같은 순간 3초씩 어긋났어요.','관측 자료를 맡길게요. 축복시티\n연구 통로 안내원에게 전해 주세요.']);return true;
  }
  if(id==='researchGate'){
    const save=g.save,map=save.map;
    if(!g.save.flags.observationCollected){g.say('연구 통로 안내원',['무쇠·영원·연고·장막의 네 배지와\n장막 관측 연구원의 자료가 필요해요.']);return true}
    if(!g.save.flags.researchDelivered){g.say('연구 통로 안내원',['장막의 관측 자료를 받았어요.\n은솔박사의 공동조사 소개도 도착했어요.','연구 연결길로 운하시티에 가세요.\n선원이 무료 왕복 승선을 도와줄 거예요.'],()=>{if(g.save!==save||save.map!==map||g.battle||!save.flags.observationCollected||save.flags.researchDelivered)return;save.flags.researchDelivered=true;g.persist()});return true}
    g.say('연구 통로 안내원',['연구 연결길은 운하시티로 이어져요.\n배를 타도 이곳으로 돌아올 수 있어요.']);return true;
  }
  if(id==='sinnohWestRouteSign'&&g.save.map==='research_path'){g.say('서부 연구 연결길 이정표',['← 축복시티 · → 운하시티','현재는 218번도로의 육로·수상 구간을 대신하는 창작 도보 우회로예요. 물 위 이동 없이 걸어서 왕복할 수 있습니다.']);return true;}
  if(id==='sinnohWestResearcher'&&g.save.map==='research_path'){g.say('수로 조사원',['풀밭 가장자리에서 수위와 바람 흔적을 기록하고 있어요.','이 길의 풀밭은 현재 조우가 확인된 장소가 아니니 새 포켓몬이 나온다고 안내하지 않아요.','운하의 일반 도보 출구와 자료 전달 뒤 조사선 승선은 서로 다른 이동입니다.']);return true;}
  if(id==='route218Sign'&&g.save.map==='tour_sinnoh_route_218'){g.say('218번도로 이정표',['← 축복시티 · → 서부 연구 연결길 · 운하시티','이곳은 218번도로의 육지 접근부와 수로 전망 구간입니다. 현재 물 위를 건너는 이동은 열리지 않았습니다.']);return true;}
  if(id==='route218Observer'&&g.save.map==='tour_sinnoh_route_218'){g.say('218번도로 수로 관찰자',['서쪽 육지길에서 수면과 바람을 살피고 있어요.','동쪽은 기존 서부 연구 연결길로 이어지는 도보 우회입니다. 원작 수상 구간을 건넜다는 뜻은 아니에요.','현재 이 접근부에는 확인된 야생 조우나 트레이너전이 없습니다.']);return true;}
  if(id==='route209Sign'&&g.save.map==='tour_sinnoh_route_209'){g.say('209번도로 이정표',['↓ 연고시티 · ↑ 신수마을','굽은 풀길 동쪽 언덕에서 로스트타워 1층~최상층으로 들어갈 수 있습니다. 초원 선택 트레이너와 겨루지 않아도 모든 길은 열려 있습니다.']);return true;}
  if(id==='route209TowerSign'&&g.save.map==='tour_sinnoh_route_209'){g.say('추모탑 방면 표지',['동쪽 높은 길의 로스트타워 입구가 열려 있습니다.','5개 층을 자유롭게 오갈 수 있지만 조우·아이템·본편 사건·보상은 없습니다.']);return true;}
  if(id==='solaceonSign'&&g.save.map==='tour_solaceon'){g.say('신수마을 이정표',['↓ 209번도로 · ↑ 210번도로 남부','210번도로 남부를 지나면 비와 다리의 215번도로가 장막시티까지 이어집니다.']);return true;}
  if((id==='solaceonBreeder'||id==='solaceonTraveler')&&g.save.map==='tour_solaceon'){
    const roadOwned=[...g.save.party,...g.save.box??[]].filter(mon=>mon.met==='신오 215번도로'||mon.met==='연고–장막 연결도로');
    const names=[...new Set(roadOwned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,4).join('·')||'아직 없음';
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say(id==='solaceonBreeder'?'신수마을 목장지기':'신수마을 여행자',['이곳은 209번도로와 210번도로 남부 사이에서 사람과 포켓몬이 쉬어 가는 목장 마을이에요.',`215번도로 계통에서 만난 보유 동료 ${roadOwned.length}마리 · ${names}`,g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 포켓몬센터 PC에서 동료를 편성하세요.','회복이 필요하면 남쪽 209번도로 너머 연고시티 센터, 북쪽 210번도로 남부·215번도로 너머 장막시티 센터를 이용하세요. 목장의 맡기기·교배·보상 기능은 아직 없습니다.']);return true;
  }
  if(id==='route210SouthSign'&&g.save.map==='tour_sinnoh_route_210_south'){g.say('210번도로 남부 이정표',['↓ 신수마을 · ↑ 215번도로 · 장막시티','키 큰 풀과 목장길을 지나 북쪽 출구로 가세요. 안개 낀 210번도로 북부는 이번 장막행 본선에 포함되지 않습니다.']);return true;}
  if(id==='route210CafeSign'&&g.save.map==='tour_sinnoh_route_210_south'){g.say('길가 카페터 안내',['여행자와 포켓몬이 비가 오기 전 쉬어 가는 자리입니다.','현재는 야외 쉼터이며 카페 실내·판매·회복 기능은 아직 없습니다.']);return true;}
  if((id==='route210CafeKeeper'||id==='route210Rancher')&&g.save.map==='tour_sinnoh_route_210_south'){
    const roadOwned=[...g.save.party,...g.save.box??[]].filter(mon=>mon.met==='신오 215번도로'||mon.met==='연고–장막 연결도로');
    const names=[...new Set(roadOwned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,4).join('·')||'아직 없음';
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say(id==='route210CafeKeeper'?'210번도로 카페 주인':'210번도로 목장 일꾼',['이 풀밭과 초지는 목장 포켓몬이 쉬고 여행자가 비구간에 들어가기 전 상태를 살피는 곳이에요.',`215번도로 계통에서 만난 보유 동료 ${roadOwned.length}마리 · ${names}`,g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 도시 포켓몬센터 PC에서 동료를 편성하세요.','부상이나 기절이 있으면 남쪽 신수·209번도로 너머 연고센터로 돌아가거나, 북쪽 215번도로를 지나 장막센터를 이용하세요. 카페 판매와 무료 회복은 아직 없습니다.']);return true;
  }
  if(id==='route215Sign'&&g.save.map==='tour_sinnoh_route_215'){g.say('215번도로 이정표',['← 210번도로 남부 · → 장막시티','비가 계속 내리는 계류 길입니다. 본선과 나무다리를 따라가면 장막 서쪽에 도착합니다.']);return true;}
  if(id==='route215BridgeSign'&&g.save.map==='tour_sinnoh_route_215'){g.say('215번도로 다리 표지',['빗물 계류를 건너는 나무다리 구간입니다.','현재 비는 장소 설정과 지형으로 적용했으며 별도 이동 방해·전투 효과는 없습니다.']);return true;}
  if(id==='route215BridgeKeeper'&&g.save.map==='tour_sinnoh_route_215'){g.say('215번도로 다리 관리인',['비가 거세지면 포켓몬과 함께 발판을 천천히 확인해요.','다리 양쪽의 마른 길은 210번도로 남부와 장막시티로 이어집니다.']);return true;}
  if(id==='route215Traveler'&&g.save.map==='tour_sinnoh_route_215'){g.say('비를 피하는 여행자',['신수에서 출발해 210번도로 남부를 지나왔어요.','장막에 도착하면 센터에서 젖은 동료를 먼저 쉬게 할 생각이에요.']);return true;}
  if(id==='route212NorthSign'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('212번도로 북부 이정표',['↑ 연고시티 · ↓ 212번도로 남부 · 들판시티','정돈된 정원길은 남쪽으로 갈수록 비와 습지가 많은 길로 바뀝니다.']);return true;}
  if(id==='route212MansionSign'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('포켓몬저택 방면 표지',['동쪽 정원 너머는 포켓몬저택 부지입니다.','현재는 정원 접근과 표지만 있으며 저택 실내·사건·보상은 아직 적용하지 않았습니다.']);return true;}
  if(id==='route212Gardener'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('212번도로 정원사',['포켓몬이 다니는 길을 남겨 두고 화단과 나무를 돌보고 있어요.','남쪽 습지로 갈 때는 젖은 흙과 데크 가장자리를 살펴보세요.']);return true;}
  if(id==='route212NorthTraveler'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('정원길 여행자',['연고의 꽃길과 들판의 습지 사이에서 풍경이 천천히 달라져요.','현재 이 북부 길에는 확인된 야생 조우나 트레이너전을 새로 배치하지 않았습니다.']);return true;}
  if(id==='route212SouthSign'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('212번도로 남부 이정표',['↑ 212번도로 북부 · 연고시티 · ↓ 들판시티','빗물못과 늪 사이의 굽은 길과 데크를 따라 이동하세요.']);return true;}
  if(id==='route212MarshSign'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('남부 습지 안내',['비로 불어난 물길과 진흙 구역입니다.','갈대 옆 긴풀에는 야생 포켓몬이 살지만 데크 본선은 피해서 지나갈 수 있습니다. 진흙 이동 저하와 날씨 전투 효과는 아직 없습니다.']);return true;}
  if(id==='route212BoardwalkKeeper'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('212번도로 데크 관리인',['갈대 사이 데크가 들판 방향 본선과 이어지는지 살피고 있어요.','포켓몬과 함께 젖은 발판을 천천히 건너세요.']);return true;}
  if(id==='route212MarshTraveler'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('습지 여행자',['북부 정원길에서 내려오니 비 냄새와 갈대 소리가 짙어졌어요.','남쪽 출구의 들판시티에서 동료를 쉬게 할 거예요.']);return true;}
  if(id==='route213Sign'&&g.save.map==='tour_sinnoh_route_213'){g.say('213번도로 이정표',['← 들판시티 · → 입지호수 근처','해변과 리조트 앞 정원길을 지나 호수근처 공유 갈림길로 이어집니다.']);return true;}
  if(id==='route213BeachCaretaker'&&g.save.map==='tour_sinnoh_route_213'){
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say('213번도로 해변 관리인',['습지를 나온 포켓몬의 젖은 발과 털을 모래가 붙기 전에 살피고 있어요.',g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 들판시티 포켓몬센터 PC에서 동료를 편성하세요.','회복이 필요하면 서쪽 들판시티 센터로 돌아가세요. 동쪽 입지호수 근처에서는 214번도로의 장막과 222번도로의 물가 방향도 선택할 수 있지만 호반 자체에는 회복 시설이 없습니다.','해변 선택전과 관계없이 본선은 열려 있고 수상이동은 아직 없습니다.']);return true;
  }
  if(id==='route214Sign'&&g.save.map==='tour_sinnoh_route_214'){g.say('214번도로 이정표',['↑ 장막시티 · ↓ 입지호수 근처','층층 암벽과 선택 풀밭을 지나 호숫가 갈림길로 내려갑니다.']);return true;}
  if(id==='valorLakefrontSign'&&g.save.map==='tour_valor_lakefront'){g.say('입지호수 근처 이정표',['← 213번도로 · 들판시티','↑ 214번도로 · 장막시티','→ 222번도로 · 물가시티']);return true;}
  if(id==='valorLakeSign'&&g.save.map==='tour_valor_lakefront'){g.say('입지호수 전망 안내',['이곳은 세 도로가 만나는 입지호수 근처이며 호수 본체 둘레길로 들어갈 수 있습니다.','중앙섬·호수 동굴·전설 포켓몬 사건은 아직 열리지 않았으며 기존 통합 신오 호수와도 별도 장소입니다.']);return true;}
  if(id==='valorLakefrontRanger'&&g.save.map==='tour_valor_lakefront'){
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say('입지호수 근처 관리인',['해변의 213번도로와 암벽의 214번도로가 여기서 만나고 동쪽 222번도로가 물가시티로 이어져요.',g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 세 도시의 포켓몬센터에서 동료를 편성하세요.','회복이 필요하면 서쪽 213번도로 너머 들판센터, 북쪽 214번도로 너머 장막센터, 동쪽 222번도로 너머 물가센터를 이용하세요. 호반 자체에는 무료 회복이 없습니다.'],undefined,[
      {label:'들판시티 센터 안내',action:()=>g.setTourDestination('tour_pastoria_center','nurse')},
      {label:'장막시티 센터 안내',action:()=>g.setTourDestination('tour_veilstone_center','nurse')},
      {label:'물가시티 센터 안내',action:()=>g.setTourDestination('tour_sunyshore_center','nurse')},
      {label:'계속 둘러본다',action:()=>{}},
    ]);return true;
  }
  if(id==='route222Sign'&&g.save.map==='tour_sinnoh_route_222'){g.say('222번도로 이정표',['← 입지호수 근처 · → 물가시티','방풍림과 해안 절벽을 지나 물가시티로 이어지는 동쪽 해안길입니다.']);return true;}
  if(id==='coronetNorthSign'){g.say('천관산 북부 표지',['남쪽은 천관산 하부, 북쪽 출구는 216번도로입니다.','상층·창기둥·전설 사건과는 분리된 통과층입니다.']);return true;}
  if(id==='coronetNorthClimber'){g.say('북부 등산객',['암반 통로 끝에서 눈바람이 시작돼요.','동료의 상태를 살피고 216번도로로 나가세요.']);return true;}
  if(id==='route216Sign'){g.say('216번도로 안내',['← 천관산 북부 · → 217번도로','짧은 눈절벽과 피난림을 지나 긴 설원으로 이어집니다. 선택 트레이너와 겨루지 않아도 본선은 열려 있습니다.']);return true;}
  if(id==='route217Sign'){g.say('217번도로 안내',['↑ 216번도로 · ↓ 예지호수 근처','표석을 따라가는 긴 설원입니다. 선택전과 관계없이 통행할 수 있으며 깊은 눈 이동 저하와 야생 조우는 아직 없습니다.']);return true;}
  if(id==='route217ShelterKeeper'&&g.save.map==='tour_sinnoh_route_217'){
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say('217번도로 피난림 관리인',['바람이 약한 나무 사이에서 파티 상태와 남은 이동 거리를 확인하세요.',g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 선단시티 포켓몬센터에서 동료를 편성하세요.','이 피난림은 길을 확인하는 장소이며 무료 회복 시설은 아닙니다. 북쪽은 216번도로·천관산, 남쪽은 예지호수 근처·선단시티 센터로 이어집니다.']);return true;
  }
  if((id==='acuitySign'||id==='acuityRanger')&&g.save.map==='tour_acuity_lakefront'){
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say('예지호수 근처 안내',['↑ 217번도로 · 216번도로 · 천관산 북부','↓ 선단시티',g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 선단시티 포켓몬센터 PC에서 동료를 편성하세요.','호숫가에는 무료 회복이 없습니다. 남쪽 선단시티 센터에서 쉬고 같은 길로 돌아올 수 있습니다.']);return true;
  }
  if(id==='acuityLakeSign'){g.say('예지호수 전망',['북쪽 길에서 예지호수 본체의 둘레길로 들어갈 수 있습니다.','중앙섬·호수 동굴·전설 사건은 아직 열리지 않았으며 창작 통합 호수와도 별개입니다.']);return true;}
  if(id==='route203Sign'){g.say('203번도로 이정표',['← 축복시티 · → 무쇠게이트 · 무쇠시티','연못과 바위턱을 지나 동굴 입구로 이어집니다.']);return true;}
  if(id==='route203Walker'){g.say('203번도로 소년',['축복에서 처음으로 바위가 많은 길을 걷고 있어요.','현재 새 조우나 트레이너전은 배치하지 않았습니다.']);return true;}
  if(id==='oreburghGateSign'){g.say('무쇠게이트 이정표',['← 203번도로 · 축복시티 · → 무쇠시티','밝은 통과로와 광석벽을 따라가면 도시 입구가 나옵니다.']);return true;}
  if(id==='oreburghGateBasementSign'){g.say('무쇠게이트 지하 표지',['아래쪽은 선택 탐험구역 B1F 방향입니다.','현재 계단·지하층·아이템은 아직 적용하지 않았습니다.']);return true;}
  if(id==='oreburghGateWorker'){g.say('무쇠게이트 작업자',['야외 203번도로와 광산 도시 사이의 조명을 살피고 있어요.','본선은 막히지 않았으니 포켓몬과 함께 밝은 길을 따라가세요.']);return true;}
  if(id==='route201Sign'){g.say('201번도로 이정표',['← 새잎마을 · → 잔모래마을','첫 파트너와 낮은 초원길을 따라 해안 연구 마을로 향합니다.']);return true;}
  if(id==='verityApproachSign'){g.say('진실호수근처 방향 표지',['북서쪽 길은 진실호수 근처와 호수 본체 둘레길로 이어집니다.','중앙섬·호수 동굴·전설 사건은 아직 열리지 않았습니다.']);return true;}
  if(id==='route201Walker'){g.say('201번도로 산책객',['파트너와 처음 걷는다면 풀과 나무 사이에서 서로의 속도를 맞춰 봐요.','이 신규 구간에는 확인된 조우나 트레이너전을 아직 배치하지 않았습니다.']);return true;}
  if(id==='sandgemSign'){g.say('잔모래마을 이정표',['← 201번도로 · 새잎마을','↑ 202번도로 · 축복시티']);return true;}
  if(id==='sandgemLabSign'){g.say('잔모래 연구 안내',['이곳은 해안 생태를 정리하는 연구 공간입니다.','새잎마을의 은솔박사 연구소와 첫 파트너 수령 계약은 그대로 유지됩니다.']);return true;}
  if(id==='sandgemResearcher'||id==='sandgemResident'){g.say('잔모래마을 주민',['201번도로의 초원과 남쪽 해안에서 포켓몬의 생활 흔적을 살펴요.','북쪽 202번도로를 따라가면 축복시티에 도착합니다.']);return true;}
  if(id==='route202Sign'){g.say('202번도로 이정표',['↓ 잔모래마을 · ↑ 축복시티','풀길과 낮은 턱을 따라 북쪽 교류 도시로 이동합니다.']);return true;}
  if(id==='route202Walker'){g.say('202번도로 초보 트레이너',['나도 파트너와 도시까지 걷는 연습을 하고 있어요.','현재는 대화만 하며 트레이너전이나 보상을 새로 만들지 않았습니다.']);return true;}
  if(id==='route204Sign'||id==='route204Walker'){g.say('204번도로 남부 안내',['↓ 축복시티 · ↑ 험한샛길','연못과 숲 가장자리를 지나 짧은 동굴로 들어갑니다.']);return true;}
  if(id==='ravagedPathSign'||id==='ravagedPathHiker'){g.say('험한샛길 안내',['↓ 204번도로 남부 · ↑ 꽃향기마을','밝은 본선을 따라 암반 사이를 통과하세요. 선택 탐험구역은 아직 열리지 않았습니다.']);return true;}
  if(id==='floaromaSign'){g.say('꽃향기마을 이정표',['↓ 험한샛길 · 축복시티','↑ 205번도로 남부 · 영원숲']);return true;}
  if(id==='floaromaGardener'||id==='floaromaResident'){
    const local=[...g.save.party,...g.save.box??[]].filter(mon=>mon.met==='영원숲');
    const names=[...new Set(local.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,4).join('·')||'아직 없음';
    const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
    g.say('꽃향기마을 주민',['사람과 포켓몬이 꽃밭의 물길과 향기를 함께 돌보고 있어요.',`영원숲에서 만난 보유 동료 ${local.length}마리 · ${names}`,g.save.party.length?`현재 파티 ${g.save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 포켓몬센터 PC에서 동료를 편성하세요.','회복이 필요하면 남쪽은 험한샛길·204번도로를 지나 축복시티, 북쪽은 205번도로·영원숲을 지나 영원시티 센터로 이어져요. 골짜기발전소 사건과 보상은 아직 적용하지 않았습니다.']);return true;
  }
  if(id==='route205Sign'||id==='route205Worker'){g.say('205번도로 남부 안내',['↓ 꽃향기마을 · ↑ 영원숲','강과 나무길을 따라 숲 남쪽 입구로 이동합니다. 야생 조우는 영원숲 풀밭에서 일어나며 강길 옆 선택 트레이너는 통행을 막지 않습니다.']);return true;}
  if(id==='route205NorthSign'){g.say('205번도로 북부 이정표',['↓ 영원숲 · ↑ 영원시티','숲 북쪽의 강과 다리를 지나 오래된 도시의 꽃길로 이어집니다.']);return true;}
  if(id==='route205NorthWorker'){g.say('205번도로 북부 여행 안내',['영원숲을 나온 포켓몬의 발과 털을 살피며 다리를 건너세요.','도시 앞 공터의 선택 트레이너와 겨루지 않아도 영원시티와 영원숲을 계속 오갈 수 있습니다.']);return true;}
  if(id==='route206Sign'){g.say('206번도로 이정표',['↑ 영원시티 · ↓ 207번도로 · 천관산','고가 본선과 아래 풀길이 다시 합류합니다. 자전거 전용 이동은 아직 적용하지 않았습니다.']);return true;}
  if(id==='route206Cyclist'){g.say('206번도로 자전거 여행자',['고가에서 바람을 맞으며 아래 풀길의 포켓몬 흔적도 살펴봐요.','아래길 선택 트레이너와 겨루지 않아도 본선은 열려 있습니다. 자전거 대여와 일방 경사는 아직 없습니다.']);return true;}
  if(id==='route207Sign'){g.say('207번도로 이정표',['← 206번도로 · 영원시티 · → 천관산 하부','바위턱과 산 앞 풀밭을 지나 동굴 입구로 이어집니다.']);return true;}
  if(id==='route207Hiker'){g.say('207번도로 등산객',['천관산에 들어가기 전에 동료 상태와 도구를 확인해요.','산 앞 선택 트레이너와 겨루지 않아도 동굴 입구로 갈 수 있습니다. 암벽등반 조건은 아직 없습니다.']);return true;}
  if(id==='route208Sign'){g.say('208번도로 이정표',['← 천관산 하부 · → 연고시티','계단 본선과 개울 산책길이 연고 입구 전에 다시 합류합니다. 선택 트레이너와 겨루지 않아도 통행할 수 있습니다.']);return true;}
  if(id==='route211WestSign'||id==='route211WestHiker'){g.say('211번도로 서부 안내',['← 영원시티 · → 천관산 211 통과층','산기슭 본선을 따라 봉신마을 방향으로 이동합니다.']);return true;}
  if(id==='coronet211Sign'||id==='coronet211Guide'){g.say('천관산 211 통과층 안내',['← 211번도로 서부 · → 211번도로 동부','이 통과층은 하부·북부·상층과 구분되며 새 사건이나 아이템은 없습니다.']);return true;}
  if(id==='route211EastSign'||id==='route211EastWalker'){g.say('211번도로 동부 안내',['← 천관산 · → 봉신마을','산 그림자와 숲 사이 길을 따라 전승 마을로 갑니다.']);return true;}
  if(id==='celesticSign'){g.say('봉신마을 이정표',['← 211번도로 동부 · 천관산 · 영원시티','작은 석벽과 전승 앞마당을 중심으로 한 산마을입니다.']);return true;}
  if(id==='celesticMural'||id==='celesticElder'||id==='celesticResident'){g.say('봉신마을 전승 안내',['오래된 벽화와 산의 이야기를 보존하는 장소입니다.','현재 벽화 사건·조직 등장·전설 포켓몬·보상은 적용하지 않았습니다.']);return true;}
  if(id==='veritySign'||id==='verityRanger'){g.say('진실호수 근처 안내',['↓ 201번도로 · ↑ 진실호수','시작 마을 가까이의 숲과 초원을 지나 호수 둘레길로 들어갑니다.']);return true;}
  if(id==='verityLakeSign'&&g.save.map==='tour_verity_lakefront'){g.say('진실호수 안내',['이 길은 진실호수 본체 둘레길로 이어집니다.','중앙섬·호수 동굴·전설 사건은 아직 열리지 않았습니다.']);return true;}
  if(id==='valorLakeSign'){g.say('입지호수 전망 안내',['세 도로의 갈림길에서 입지호수 본체 둘레길로 들어갈 수 있습니다.','중앙섬·호수 동굴·전설 포켓몬 사건은 아직 열리지 않았으며 기존 통합 호수와도 별개입니다.']);return true;}
  if(id==='verityLakeKeeper'||id==='valorLakeBodyKeeper'||id==='acuityLakeBodyKeeper'){
    const lake=canonicalLakeEvents[id],species=Number(g.save.flags[lake.key+'ObservationSpecies']??0),done=Boolean(g.save.flags[lake.key+'ObservationComplete']);
    const partner=g.save.party.find(mon=>mon.species===species&&mon.hp>0),healthy=g.save.party.map((mon,index)=>({mon,index})).filter(x=>x.mon.hp>0);
    if(done&&partner){g.say(lake.name+' 관찰자',[`${SPECIES[partner.species].name}와 중앙 수면·동굴 방향 흔적 비교를 마쳤습니다.`,'이 기록은 관찰 활동이며 전설 포켓몬 사건·포획·보상·통행 조건이 아닙니다.']);return true;}
    if(!healthy.length){g.say(lake.name+' 관찰자',['건강한 파티 동료와 돌아오면 중앙 수면과 동굴 방향의 흔적을 비교할 수 있습니다.','둘레길과 귀환로는 관찰을 하지 않아도 자유롭게 이용할 수 있습니다.']);return true;}
    g.say(lake.name+' 관찰자',[partner?`${SPECIES[partner.species].name}와 관찰을 이어 갈 수 있습니다.`:'함께 걸을 건강한 파티 동료를 골라 주세요.','먼저 중앙 수면 표식, 다음으로 동굴 방향 표식을 살펴보세요.'],undefined,[...healthy.map(({mon,index})=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{g.save.flags[lake.key+'ObservationSpecies']=mon.species;g.save.flags[lake.key+'WaterObserved']=false;g.save.flags[lake.key+'ObservationComplete']=false;g.persist();g.say(lake.name+' 관찰자',[`${index+1}번째 동료 ${SPECIES[mon.species].name}와 관찰을 시작합니다.`,'중앙 수면 표식부터 살펴보세요.']);}})),{label:'다음에 관찰한다',action:()=>{}}]);return true;
  }
  if(id==='verityLakeSign'||id==='valorLakeBodySign'||id==='acuityLakeBodySign'){
    const lake=canonicalLakeEvents[id],species=Number(g.save.flags[lake.key+'ObservationSpecies']??0),partner=g.save.party.find(mon=>mon.species===species&&mon.hp>0);
    if(!partner){g.say(lake.name+' 중앙 수면',['호수 관찰자에게 건강한 파티 동료를 먼저 선택하면 물결을 함께 기록할 수 있습니다.','둘레길 관람과 귀환은 계속 가능합니다.']);return true;}
    g.save.flags[lake.key+'WaterObserved']=true;g.persist();g.say(lake.name+' 중앙 수면',[`${SPECIES[partner.species].name}와 물결의 방향과 둘레 숲의 움직임을 기록했습니다.`,'이제 동굴 방향 표식에서 물가 흔적을 비교해 보세요.']);return true;
  }
  if(id==='verityLakeCaveSign'||id==='valorLakeBodyCaveSign'||id==='acuityLakeBodyCaveSign'){
    const lake=canonicalLakeEvents[id],species=Number(g.save.flags[lake.key+'ObservationSpecies']??0),partner=g.save.party.find(mon=>mon.species===species&&mon.hp>0),water=Boolean(g.save.flags[lake.key+'WaterObserved']);
    if(!partner||!water){g.say(lake.name+' 동굴 방향',['중앙섬 너머에 호수 동굴이 있습니다. 관찰자에게 동료를 고르고 중앙 수면을 먼저 살펴보세요.','수상이동·섬 진입·동굴 내부는 아직 적용하지 않았습니다.']);return true;}
    g.save.flags[lake.key+'ObservationComplete']=true;g.persist();g.say(lake.name+' 동굴 방향',[`${SPECIES[partner.species].name}와 중앙 수면의 물결과 섬 방향 흔적을 비교했습니다.`,'관찰은 완료됐지만 수상이동·동굴 진입·전설 포켓몬·보상은 열리지 않습니다. 같은 둘레길로 자유롭게 돌아갈 수 있습니다.']);return true;
  }
  if(id==='oreburghMineEntrance'){g.say('무쇠탄갱 입구',['도시 남쪽의 광석 작업장과 탐험층입니다.','선택 방문 장소이며 강석 도전·콜배지·도시 통행의 조건이 아닙니다.']);return true;}
  if(id==='oreburghMineSign'){g.say('무쇠탄갱 안전 표지',['운반 레일과 밝은 작업로를 따라가면 도시 출구로 돌아옵니다.','측면 갱도는 관찰 후 같은 본선으로 합류합니다.']);return true;}
  if(id==='oreburghMineForeman'){
    const species=Number(g.save.flags.oreburghMineWorkSpecies??0),done=Boolean(g.save.flags.oreburghMineWorkComplete);
    const partner=g.save.party.find(mon=>mon.species===species&&mon.hp>0),healthy=g.save.party.map((mon,index)=>({mon,index})).filter(x=>x.mon.hp>0);
    if(done&&partner){g.say('무쇠탄갱 작업반장',[`${SPECIES[partner.species].name}와 레일 폭과 광맥 울림을 모두 확인했군요.`,'이 작업 기록은 강석 도전·콜배지·통행 조건이나 보상과 관계없습니다.']);return true;}
    if(!healthy.length){g.say('무쇠탄갱 작업반장',['건강한 파티 동료와 오면 작업로의 안전을 함께 확인할 수 있어요.','탄갱 출입과 도시 귀환은 이 활동을 하지 않아도 자유롭습니다.']);return true;}
    g.say('무쇠탄갱 작업반장',[partner?`${SPECIES[partner.species].name}와 작업 확인을 이어 갈 수 있어요.`:'운반 레일을 함께 살필 건강한 파티 동료를 골라 주세요.','먼저 운반 레일, 다음으로 측면 갱도 광맥을 살펴보세요.'],undefined,[...healthy.map(({mon,index})=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{g.save.flags.oreburghMineWorkSpecies=mon.species;g.save.flags.oreburghMineRailChecked=false;g.save.flags.oreburghMineWorkComplete=false;g.persist();g.say('무쇠탄갱 작업반장',[`${index+1}번째 동료 ${SPECIES[mon.species].name}와 작업 확인을 시작합니다.`,'운반 레일의 빈 폭부터 살펴보세요.']);}})),{label:'다음에 돕는다',action:()=>{}}]);return true;
  }
  if(id==='oreburghMineRail'){
    const species=Number(g.save.flags.oreburghMineWorkSpecies??0),partner=g.save.party.find(mon=>mon.species===species&&mon.hp>0);
    if(!partner){g.say('탄갱 운반 레일',['작업반장에게 건강한 파티 동료를 먼저 정하면 레일의 빈 폭을 함께 확인할 수 있습니다.','광차를 조작하거나 보상을 얻는 기능은 없습니다.']);return true;}
    g.save.flags.oreburghMineRailChecked=true;g.persist();g.say('탄갱 운반 레일',[`${SPECIES[partner.species].name}와 광차 바퀴 자국, 사람과 포켓몬이 비켜설 폭을 확인했습니다.`,'이제 측면 갱도 광맥에서 울림을 비교해 보세요.']);return true;
  }
  if(id==='oreburghMineSeam'){
    const species=Number(g.save.flags.oreburghMineWorkSpecies??0),partner=g.save.party.find(mon=>mon.species===species&&mon.hp>0),rail=Boolean(g.save.flags.oreburghMineRailChecked);
    if(!partner||!rail){g.say('측면 갱도 광맥',['작업반장에게 동료를 정하고 운반 레일의 안전 폭을 먼저 확인하세요.','광석을 채취하거나 아이템으로 가져가지는 않습니다.']);return true;}
    g.save.flags.oreburghMineWorkComplete=true;g.persist();g.say('측면 갱도 광맥',[`${SPECIES[partner.species].name}와 레일 쪽 소리와 암반에서 돌아오는 울림을 비교했습니다.`,'작업 확인은 끝났지만 광석·아이템·돈·경험치·통행 조건은 바뀌지 않습니다.']);return true;
  }
  if(id==='oreburghMineWorker'){g.say('포켓몬과 일하는 광부',['사람과 포켓몬이 소리와 손짓을 맞추며 광차 길을 관리해요.','원한다면 작업로 밖 공터에서 선택 배틀로 호흡을 맞춰 볼 수 있어요. 배틀과 관계없이 출구는 열려 있습니다.']);return true;}
  if(id==='lostTowerKeeper'){g.say('로스트타워 방문자',['사람과 포켓몬을 기억하며 조용히 각 층을 돌보고 있습니다.','특정 유령 사건이나 보상을 완료하는 장소는 아닙니다.']);return true;}
  if(id==='lostTowerMemorial'){g.say('로스트타워 추모석',['이름을 특정하지 않은 작은 꽃과 돌이 놓여 있습니다.','물건을 가져가거나 사건을 시작하지 않고 잠시 머물 수 있습니다.']);return true;}
  if(id==='lostTowerFloorSign'){g.say('로스트타워 층 안내',['계단은 위층과 아래층의 순환 통로로 이어집니다.','최상층까지 간 뒤 같은 입구로 209번도로에 돌아갈 수 있습니다.']);return true;}
  if(id==='windworksBranchSign'){g.say('골짜기발전소 갈림길',['205번도로 남부 강가에서 서쪽 발전소 마당으로 들어갑니다.','선택 방문이며 영원숲 통행이나 본편 진행 조건이 아닙니다.']);return true;}
  if(id==='windworksSign'||id==='windworksEngineer'||id==='windworksCaretaker'){g.say('골짜기발전소 안내',['강의 수위와 바람을 살피며 사람과 포켓몬이 설비를 관리합니다.','현재 조직 점거·열쇠·전투·보상 사건은 없습니다.']);return true;}
  if(id==='windworksRiver'){g.say('발전소 앞 강',['풍차 마당을 따라 흐르는 물의 방향을 살펴볼 수 있습니다.','물에 들어가거나 낚시·포획을 시작하지 않습니다.']);return true;}
  if(id==='windworksTurbine'||id==='windworksControl'||id==='windworksGenerator'||id==='windworksSafety'){g.say('발전 설비',['풍차·제어반·발전기 사이의 안전 통로가 표시되어 있습니다.','설비를 직접 조작하거나 전력을 복구하는 사건은 없습니다.']);return true;}
  if(id==='windworksOperator'){g.say('발전소 운전원',['포켓몬이 쉬는 외부 마당과 발전기가 충분히 떨어졌는지 확인하고 있어요.','관찰을 마치면 같은 출입문으로 205번도로에 돌아갈 수 있습니다.']);return true;}
  if(id==='ferry'){
    if(g.ferryJourney)return true;
    if(!g.save.flags.researchDelivered){g.say('조사선 선원',['축복의 연구 통로 안내를 마치고 와 주세요.']);return true}
    const outbound=g.save.map==='tour_canalave';
    const save=g.save,map=save.map;let consumed=false;
    g.say('조사선 선원',[outbound?'관동 갈색항으로 출발합니다.\n조사 승선은 왕복 무료예요.':'신오 운하항으로 돌아갈 수 있어요.\n갈색시티와 주변 마을도 둘러보세요.'],undefined,[{label:outbound?'갈색항으로 간다':'운하항으로 돌아간다',action:()=>{
      if(consumed||g.save!==save||g.save.map!==map)return;
      consumed=true;startFerryJourney(g,outbound);
    }},{label:'아직 머무른다',action:()=>{consumed=true;}}]);return true;
  }
  return false;
}
