import { startFerryJourney } from './ferry-journey';
import type { Engine } from './engine';
import { GYMS } from './gyms';
import { gardeniaPreparationPages } from './gardenia-preparation';
import { fantinaPreparationPages } from './fantina-preparation';
import { maylenePreparationPages } from './maylene-preparation';
import { adventureObjective } from './adventure-guide';
import { MAPS } from './maps';
import { viridianForestGuidePages } from './encounter-guidance';
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
    if(!g.save.flags.observationCollected){g.say('연구 통로 안내원',['무쇠·영원·연고·장막의 네 배지와\n장막 관측 연구원의 자료가 필요해요.']);return true}
    if(!g.save.flags.researchDelivered){g.say('연구 통로 안내원',['장막의 관측 자료를 받았어요.\n은솔박사의 공동조사 소개도 도착했어요.','연구 연결길로 운하시티에 가세요.\n선원이 무료 왕복 승선을 도와줄 거예요.'],()=>{g.save.flags.researchDelivered=true;g.persist()});return true}
    g.say('연구 통로 안내원',['연구 연결길은 운하시티로 이어져요.\n배를 타도 이곳으로 돌아올 수 있어요.']);return true;
  }
  if(id==='sinnohWestRouteSign'&&g.save.map==='research_path'){g.say('서부 연구 연결길 이정표',['← 축복시티 · → 운하시티','현재는 218번도로의 육로·수상 구간을 대신하는 창작 도보 우회로예요. 물 위 이동 없이 걸어서 왕복할 수 있습니다.']);return true;}
  if(id==='sinnohWestResearcher'&&g.save.map==='research_path'){g.say('수로 조사원',['풀밭 가장자리에서 수위와 바람 흔적을 기록하고 있어요.','이 길의 풀밭은 현재 조우가 확인된 장소가 아니니 새 포켓몬이 나온다고 안내하지 않아요.','운하의 일반 도보 출구와 자료 전달 뒤 조사선 승선은 서로 다른 이동입니다.']);return true;}
  if(id==='route218Sign'&&g.save.map==='tour_sinnoh_route_218'){g.say('218번도로 이정표',['← 축복시티 · → 서부 연구 연결길 · 운하시티','이곳은 218번도로의 육지 접근부와 수로 전망 구간입니다. 현재 물 위를 건너는 이동은 열리지 않았습니다.']);return true;}
  if(id==='route218Observer'&&g.save.map==='tour_sinnoh_route_218'){g.say('218번도로 수로 관찰자',['서쪽 육지길에서 수면과 바람을 살피고 있어요.','동쪽은 기존 서부 연구 연결길로 이어지는 도보 우회입니다. 원작 수상 구간을 건넜다는 뜻은 아니에요.','현재 이 접근부에는 확인된 야생 조우나 트레이너전이 없습니다.']);return true;}
  if(id==='route209Sign'&&g.save.map==='tour_sinnoh_route_209'){g.say('209번도로 이정표',['↓ 연고시티 · ↑ 신수마을','굽은 풀길 동쪽 언덕은 로스트타워 방면입니다. 현재는 탑 입구와 내부가 열리지 않았습니다.']);return true;}
  if(id==='route209TowerSign'&&g.save.map==='tour_sinnoh_route_209'){g.say('추모탑 방면 표지',['동쪽 높은 길 너머에 로스트타워가 있습니다.','이번 구간에서는 분기 지형만 남겼으며 탑 내부·사건·보상은 아직 적용하지 않았습니다.']);return true;}
  if(id==='route209Walker'&&g.save.map==='tour_sinnoh_route_209'){g.say('209번도로 여행자',['연고에서 나온 길은 연못을 돌아 신수마을까지 북쪽으로 이어져요.','길가 포켓몬과 트레이너는 확인된 배치가 적용되기 전까지 나타나지 않습니다.']);return true;}
  if(id==='solaceonSign'&&g.save.map==='tour_solaceon'){g.say('신수마을 이정표',['↓ 209번도로 · ↑ 210번도로 남부','210번도로 남부를 지나면 비와 다리의 215번도로가 장막시티까지 이어집니다.']);return true;}
  if(id==='solaceonBreeder'&&g.save.map==='tour_solaceon'){g.say('신수마을 목장지기',['이 마을에서는 사람과 포켓몬이 풀밭과 물을 함께 돌봅니다.','현재 목장은 생활 공간이며 맡기기·교배·보상 기능은 아직 없습니다.']);return true;}
  if(id==='solaceonTraveler'&&g.save.map==='tour_solaceon'){g.say('신수마을 여행자',['연고에서 209번도로를 따라 여기까지 왔어요.','북쪽은 카페와 키 큰 풀이 있는 210번도로 남부예요. 그다음 215번도로에서 비를 만나게 됩니다.']);return true;}
  if(id==='route210SouthSign'&&g.save.map==='tour_sinnoh_route_210_south'){g.say('210번도로 남부 이정표',['↓ 신수마을 · ↑ 215번도로 · 장막시티','키 큰 풀과 목장길을 지나 북쪽 출구로 가세요. 안개 낀 210번도로 북부는 이번 장막행 본선에 포함되지 않습니다.']);return true;}
  if(id==='route210CafeSign'&&g.save.map==='tour_sinnoh_route_210_south'){g.say('길가 카페터 안내',['여행자와 포켓몬이 비가 오기 전 쉬어 가는 자리입니다.','현재는 야외 쉼터이며 카페 실내·판매·회복 기능은 아직 없습니다.']);return true;}
  if(id==='route210CafeKeeper'&&g.save.map==='tour_sinnoh_route_210_south'){g.say('210번도로 카페 주인',['신수 쪽 풀밭을 지나온 포켓몬에게 물을 주세요.','북쪽으로 가면 215번도로의 비가 시작됩니다. 지금은 이 자리에서 판매하거나 회복해 주지는 않아요.']);return true;}
  if(id==='route210Rancher'&&g.save.map==='tour_sinnoh_route_210_south'){g.say('210번도로 목장 일꾼',['키 큰 풀은 목장 포켓몬이 몸을 숨기는 생활 공간이기도 해요.','현재 이 풀밭에는 확인된 야생 조우나 트레이너전을 새로 배치하지 않았습니다.']);return true;}
  if(id==='route215Sign'&&g.save.map==='tour_sinnoh_route_215'){g.say('215번도로 이정표',['← 210번도로 남부 · → 장막시티','비가 계속 내리는 계류 길입니다. 본선과 나무다리를 따라가면 장막 서쪽에 도착합니다.']);return true;}
  if(id==='route215BridgeSign'&&g.save.map==='tour_sinnoh_route_215'){g.say('215번도로 다리 표지',['빗물 계류를 건너는 나무다리 구간입니다.','현재 비는 장소 설정과 지형으로 적용했으며 별도 이동 방해·전투 효과는 없습니다.']);return true;}
  if(id==='route215BridgeKeeper'&&g.save.map==='tour_sinnoh_route_215'){g.say('215번도로 다리 관리인',['비가 거세지면 포켓몬과 함께 발판을 천천히 확인해요.','다리 양쪽의 마른 길은 210번도로 남부와 장막시티로 이어집니다.']);return true;}
  if(id==='route215Traveler'&&g.save.map==='tour_sinnoh_route_215'){g.say('비를 피하는 여행자',['신수에서 출발해 210번도로 남부를 지나왔어요.','장막에 도착하면 센터에서 젖은 동료를 먼저 쉬게 할 생각이에요.']);return true;}
  if(id==='route212NorthSign'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('212번도로 북부 이정표',['↑ 연고시티 · ↓ 212번도로 남부 · 들판시티','정돈된 정원길은 남쪽으로 갈수록 비와 습지가 많은 길로 바뀝니다.']);return true;}
  if(id==='route212MansionSign'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('포켓몬저택 방면 표지',['동쪽 정원 너머는 포켓몬저택 부지입니다.','현재는 정원 접근과 표지만 있으며 저택 실내·사건·보상은 아직 적용하지 않았습니다.']);return true;}
  if(id==='route212Gardener'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('212번도로 정원사',['포켓몬이 다니는 길을 남겨 두고 화단과 나무를 돌보고 있어요.','남쪽 습지로 갈 때는 젖은 흙과 데크 가장자리를 살펴보세요.']);return true;}
  if(id==='route212NorthTraveler'&&g.save.map==='tour_sinnoh_route_212_north'){g.say('정원길 여행자',['연고의 꽃길과 들판의 습지 사이에서 풍경이 천천히 달라져요.','현재 이 북부 길에는 확인된 야생 조우나 트레이너전을 새로 배치하지 않았습니다.']);return true;}
  if(id==='route212SouthSign'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('212번도로 남부 이정표',['↑ 212번도로 북부 · 연고시티 · ↓ 들판시티','빗물못과 늪 사이의 굽은 길과 데크를 따라 이동하세요.']);return true;}
  if(id==='route212MarshSign'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('남부 습지 안내',['비로 불어난 물길과 진흙 구역입니다.','현재 늪은 지형과 장소 설정이며 별도 이동 저하·조우·날씨 전투 효과는 없습니다.']);return true;}
  if(id==='route212BoardwalkKeeper'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('212번도로 데크 관리인',['갈대 사이 데크가 들판 방향 본선과 이어지는지 살피고 있어요.','포켓몬과 함께 젖은 발판을 천천히 건너세요.']);return true;}
  if(id==='route212MarshTraveler'&&g.save.map==='tour_sinnoh_route_212_south'){g.say('습지 여행자',['북부 정원길에서 내려오니 비 냄새와 갈대 소리가 짙어졌어요.','남쪽 출구의 들판시티에서 동료를 쉬게 할 거예요.']);return true;}
  if(id==='route213Sign'&&g.save.map==='tour_sinnoh_route_213'){g.say('213번도로 이정표',['← 들판시티 · → 입지호수 근처','해변과 리조트 앞 정원길을 지나 호수근처 공유 갈림길로 이어집니다.']);return true;}
  if(id==='route213BeachWalker'&&g.save.map==='tour_sinnoh_route_213'){g.say('213번도로 해변 여행자',['습지를 나온 포켓몬과 바닷바람을 맞으며 걷고 있어요.','현재 해변에는 확인된 조우·트레이너전·수상이동을 새로 적용하지 않았습니다.']);return true;}
  if(id==='route214Sign'&&g.save.map==='tour_sinnoh_route_214'){g.say('214번도로 이정표',['↑ 장막시티 · ↓ 입지호수 근처','층층 암벽과 선택 풀밭을 지나 호숫가 갈림길로 내려갑니다.']);return true;}
  if(id==='route214Hiker'&&g.save.map==='tour_sinnoh_route_214'){g.say('214번도로 등산객',['장막 남쪽의 바위턱은 입지호수 근처까지 이어져요.','이 길의 풀밭에는 확인된 조우나 트레이너전을 아직 새로 배치하지 않았습니다.']);return true;}
  if(id==='valorLakefrontSign'&&g.save.map==='tour_valor_lakefront'){g.say('입지호수 근처 이정표',['← 213번도로 · 들판시티','↑ 214번도로 · 장막시티','→ 222번도로 · 물가시티']);return true;}
  if(id==='valorLakeSign'&&g.save.map==='tour_valor_lakefront'){g.say('입지호수 전망 안내',['이곳은 세 도로가 만나는 입지호수 근처입니다.','호수 본체·호수 동굴·전설 포켓몬 사건은 현재 열리지 않았습니다. 기존 통합 신오 호수와도 별도 장소입니다.']);return true;}
  if(id==='valorLakefrontRanger'&&g.save.map==='tour_valor_lakefront'){g.say('입지호수 근처 관리인',['해변의 213번도로와 암벽의 214번도로가 여기서 만나요.','동쪽 222번도로를 따라가면 물가시티의 태양광 산책로가 보입니다.']);return true;}
  if(id==='route222Sign'&&g.save.map==='tour_sinnoh_route_222'){g.say('222번도로 이정표',['← 입지호수 근처 · → 물가시티','방풍림과 해안 절벽을 지나 물가시티로 이어지는 동쪽 해안길입니다.']);return true;}
  if(id==='route222CoastWalker'&&g.save.map==='tour_sinnoh_route_222'){g.say('222번도로 해안 여행자',['멀리 물가시티의 등대와 태양광 설비가 보여요.','이 해안에는 확인된 조우·트레이너전·수상이동을 아직 새로 적용하지 않았습니다.']);return true;}
  if(id==='coronetNorthSign'){g.say('천관산 북부 표지',['남쪽은 천관산 하부, 북쪽 출구는 216번도로입니다.','상층·창기둥·전설 사건과는 분리된 통과층입니다.']);return true;}
  if(id==='coronetNorthClimber'){g.say('북부 등산객',['암반 통로 끝에서 눈바람이 시작돼요.','동료의 상태를 살피고 216번도로로 나가세요.']);return true;}
  if(id==='route216Sign'||id==='route216Hiker'){g.say('216번도로 안내',['← 천관산 북부 · → 217번도로','짧은 눈절벽과 피난림을 지나 긴 설원으로 이어집니다.']);return true;}
  if(id==='route217Sign'||id==='route217Traveler'){g.say('217번도로 안내',['↑ 216번도로 · ↓ 예지호수 근처','깊은 눈과 표석을 따라가는 긴 설원입니다. 이동 저하와 조우는 아직 적용하지 않았습니다.']);return true;}
  if(id==='acuitySign'||id==='acuityRanger'){g.say('예지호수 근처 안내',['↑ 217번도로 · ↓ 선단시티','이곳은 설원과 선단 사이의 호숫가 갈림길입니다.']);return true;}
  if(id==='acuityLakeSign'){g.say('예지호수 전망',['예지호수 본체와 호수 동굴은 아직 열리지 않았습니다.','창작 통합 호수와 별개의 공식 호수 접근 장소입니다.']);return true;}
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
