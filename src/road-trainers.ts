import { createCatalog } from './data/catalog';
import { showTrainerPreparation } from './trainer-preparation';
import { showIcirrusRouteBattle } from './icirrus-route-battle';
import type { Engine } from './engine';
import type { Pokemon } from './types';
import { createTrainerBattle } from './battle';
import { pokemonMoves,SPECIES } from './pokemon';
import { maxHpAtLevel } from './growth';
import { trainerWinFlag } from './trainer-flags';
import { getMap } from './maps';
import { journeyConnection } from './journey-world';
import { CELESTIC_ROUTE_BATTLE,celesticTrainerCode } from './sinnoh-celestic-battle';
import { prepareRoute43PartnerBattle } from './johto-route-43-battle';
import { JOHTO_EAST_BATTLE,canRetryJohtoEastPartnerBattle,prepareJohtoEastPartnerBattle } from './johto-east-battle';
import { canRetryJohtoSouthPartnerBattle,prepareJohtoSouthPartnerBattle } from './johto-south-battle';
import { ROUTE_TWELVE_JOURNEY,ROUTE_TWELVE_TRAINER,canRetryRouteTwelvePartnerBattle,prepareRouteTwelvePartnerBattle } from './unova-route-twelve-journey';
import { ROUTE_ELEVEN_JOURNEY,ROUTE_ELEVEN_TRAINER,canRetryRouteElevenPartnerBattle,prepareRouteElevenPartnerBattle } from './unova-route-eleven-journey';
import { ROUTE_NINE_JOURNEY,ROUTE_NINE_TRAINER,canRetryRouteNinePartnerBattle,prepareRouteNinePartnerBattle } from './unova-route-nine-journey';
import { ROUTE_EIGHT_JOURNEY,ROUTE_EIGHT_TRAINER,canRetryRouteEightPartnerBattle,prepareRouteEightPartnerBattle } from './unova-route-eight-journey';
import { ROUTE203_JOURNEY,ROUTE203_TRAINER,canRetryRoute203PartnerBattle,prepareRoute203PartnerBattle } from './sinnoh-route203-journey';
import { OREBURGH_GATE_JOURNEY,OREBURGH_GATE_TRAINER,canRetryOreburghGatePartnerBattle,prepareOreburghGatePartnerBattle } from './oreburgh-gate-journey';

type PracticeTrainer={map:string;event:string;id:string;name:string;reward:number;team:number[][];lesson?:'type'|'switch';localPages?:string[];battlePage?:string};
const trainers:PracticeTrainer[]=[
  {map:'tour_pass_nimbasa_driftveil',event:'tourRouteFiveTrainer',id:'unova-route-5-practice',name:'5번도로 공연가',reward:560,team:[[572,23]],battlePage:'북쪽 풀밭에서 만난 치라미와 박자를 맞춰 봤어.\n포장 본선 옆 마른 공연 자리에서 시작하자!',localPages:['치라미와 함께 5번도로의 공연 길을 걷고 있어.\n물풍경도개교로 가기 전에 선택 배틀을 할래?','치라미의 빠른 몸놀림에 맞춰 기술과 교대할 동료를 골라 봐.\n북쪽 풀밭에서는 직접 치라미를 만날 수 있어.','거절하거나 져도 동쪽 뇌문시티와 서쪽 물풍경도개교를 잇는 포장 본선은 계속 열려 있어.']},
  {map:'tour_pass_driftveil_mistralton',event:'tourRouteSixTrainer',id:'unova-route-6-practice',name:'6번도로 생태 트레이너',reward:600,team:[[588,24],[616,25]],battlePage:'강가 풀에서 움직임을 비교한 두 동료야.\n동쪽 마른 공터에서 시작하자!',localPages:['딱정곤과 쪼마리를 번갈아 돌보며 6번도로를 조사하고 있어.\n계절 연구소 앞 공터에서 선택 배틀을 할래?','단단히 버티는 방식이 다른 두 벌레포켓몬을 보고\n기술과 교대할 동료를 골라 봐.','거절하거나 져도 물풍경시티와 전기돌동굴을 잇는\n가운데 본선과 두 목재 다리는 계속 열려 있어.']},
  {map:'tour_reversal_mountain_exterior',event:'tourReversalExteriorTrainer',id:'unova-reversal-exterior-practice',name:'리버스마운틴 자전거 트레이너',reward:640,team:[[451,24],[328,25]],battlePage:'재바람 곁풀에서 만난 스콜피와 톱치야.\n가운데 마른 길을 비운 공터에서 시작하자!',localPages:['스콜피와 톱치의 발자국을 따라 외부 능선을 달리고 있어.\n동굴에 들어가기 전에 선택 배틀을 할래?','독·벌레 타입과 땅 타입이 차례로 나온다.\n상대가 바뀌면 기술과 교대할 동료를 다시 골라 봐.','거절하거나 져도 서쪽 산로마을과 동쪽 통과구역 A를 잇는 가운데 길은 계속 열려 있어.']},
  {map:'tour_unova_route_13',event:'tourRouteThirteenTrainer',id:'unova-route-13-practice',name:'13번도로 해안 생태 트레이너',reward:660,team:[[114,24],[279,25]],battlePage:'고지 풀과 해풍을 오간 덩쿠리와 패리퍼야.\n절벽 곁 마른 공터에서 시작하자!',localPages:['덩쿠리와 패리퍼가 해안 절벽의 서로 다른 자리를 쓰는 모습을 살피고 있어.\n물결마을로 돌아가기 전에 선택 배틀을 할래?','풀 타입 뒤 물·비행 타입이 나온다.\n상대가 바뀌면 기술과 교대할 동료를 다시 골라 봐.','거절하거나 져도 남쪽 물결마을과 북쪽 보배마을을 잇는 가운데 길은 계속 열려 있어.']},
  {map:'tour_unova_route_12',event:'tourRouteTwelveTrainer',id:'unova-route-12-practice',name:'12번도로 초원 트레이너',reward:680,team:[[315,24],[415,24],[520,25]],battlePage:'언덕과 풀밭을 함께 오간 로젤리아·세꿀버리·유토브야.\n낮은 길 옆 마른 공터에서 시작하자!',localPages:['12번도로의 세 포켓몬이 풀과 바람을 다르게 쓰는 모습을 보고 있어.\n빌리지브리지에 가기 전 선택 배틀을 할래?','풀·독 타입, 벌레·비행 타입, 비행 타입이 차례로 나온다.\n상대가 바뀔 때 기술과 교대를 다시 골라 봐.','거절하거나 져도 동쪽 보배마을과 서쪽 빌리지브리지를 잇는 낮은 길은 계속 열려 있어.']},
  {map:'tour_unova_route_09',event:'tourRouteNineTrainer',id:'unova-route-9-practice',name:'9번도로 라이더',reward:640,team:[[572,24],[451,25]],battlePage:'포장도로와 남쪽 숲길을 오가는 치라미와 스콜피야.\n본선 바깥 마른 공터에서 겨뤄 보자!',localPages:['B2W2 9번도로의 치라미와 라이더의 스콜피를 함께 돌보고 있어.\n쇼핑몰 나인 남쪽 공터에서 선택 배틀을 할래?','노말 타입 치라미 뒤에는 독·벌레 타입 스콜피가 나와.\n상대가 바뀌면 기술과 교대를 다시 골라 봐.','거절하거나 져도 동쪽 쌍용시티와 서쪽 튜브라인브리지를 잇는 포장 본선은 계속 열려 있어.']},
  {map:'tour_castelia_park',event:'tourCasteliaParkTrainer',id:'castelia-park-practice',name:'공원 산책 트레이너',reward:320,team:[[519,16],[548,17]],battlePage:'풀밭 밖 산책길에서 겨뤄 보자. 콩둘기, 먼저 나와!',localPages:['이 공원에서 만난 동료와 함께 산책하고 있어.\n네 동료들과 배틀해 볼래?','콩둘기 뒤에는 치릴리가 나와. 상대의 타입과 남은 HP를 보고 기술이나 교대를 골라 봐.','풀밭에서 새 동료를 만났다면 출전 순서를 골라 함께 연습해 봐. 남쪽 하수도를 거쳐 항구 센터로 돌아갈 수 있어.']},
  {map:'tour_johto_route_45',event:'tourRoute45Trainer',id:'johto-route-45-practice',name:'45번도로 산악 트레이너',reward:640,team:[[74,24],[95,25]],battlePage:'산길 풀숲에서 돌본 꼬마돌과 롱스톤이야.\n동쪽 오르막 옆 마른 공터에서 시작하자!',localPages:['45번도로에서 만난 꼬마돌과 함께 절벽을 내려왔어.\n산악 동료를 상대로 선택 배틀을 할래?','꼬마돌 다음에는 더 단단한 롱스톤이 나와.\n물·풀 기술이나 교대할 동료를 살펴봐.','거절하거나 져도 검은먹과46번도로,\n일방 턱의 동쪽 귀환 오르막은 계속 열려 있어.']},
  {map:'tour_johto_route_30',event:'tourRoute30Trainer',id:'johto-route-30-practice',name:'30번도로 곤충채집가',reward:500,team:[[10,22],[13,22],[16,23]],battlePage:'연못 양쪽 풀길에서 관찰한 세 동료야.\n동쪽 마른 공터에서 시작하자!',localPages:['캐터피·뿔충이·구구와 30번도로를 걷고 있어.\n연못 동쪽의 마른 공터에서 선택 배틀을 할래?','애벌레포켓몬 뒤 구구가 나오면 기술과 교대할 동료를 다시 살펴봐.','거절하거나 져도 무궁시티와31번도로 예정 경계를 잇는 가운데 길은 계속 열려 있어.']},
  {map:'tour_johto_route_31',event:'tourRoute31Trainer',id:'johto-route-31-practice',name:'31번도로 곤충채집가',reward:520,team:[[10,22],[10,22],[13,23],[16,23]],battlePage:'작은 연못 곁 풀숲에서 관찰한 동료들이야.\n남쪽 마른 우회로에서 시작하자!',localPages:['캐터피와 뿔충이를 돌보며 도라지까지 걷는 중이야.\n풀숲 밖 마른 길에서 선택 배틀을 할래?','애벌레포켓몬 뒤 구구가 나오면 남은 HP와 교대를 다시 살펴봐.','거절하거나 져도30번도로와 도라지시티를 잇는 본선은 계속 열려 있어. 동쪽 동굴은 입구 탐사 뒤 같은 길로 돌아올 수 있어.']},
  {map:'tour_johto_route_46',event:'tourRoute46Trainer',id:'johto-route-46-practice',name:'46번도로 산기슭 트레이너',reward:620,team:[[19,23],[21,24],[74,24]],battlePage:'평지와 바위턱에서 함께 키운 세 동료야.\n남쪽 합류부 앞 마른 공터에서 시작하자!',localPages:['46번도로의 꼬렛·깨비참·꼬마돌과 보폭을 맞췄어.\n29번도로에 합류하기 전 선택 배틀을 할래?','빠른 노말·비행 동료 뒤 바위·땅 동료가 나와.\n상대가 바뀔 때 기술과 교대를 다시 골라 봐.','배틀하지 않아도45번도로와29번도로 동쪽 합류부를\n계속 왕복할 수 있어.']},
  {map:'tour_johto_route_44',event:'tourRoute44Trainer',id:'johto-route-44-practice',name:'44번도로 풀숲 트레이너',reward:620,team:[[114,24]],battlePage:'쌍둥이 연못 사이 풀숲에서 만난 덩쿠리야.\n본선 밖 마른 공터에서 시작하자!',localPages:['44번도로 풀숲에서 만난 덩쿠리를 키우고 있어.\n얼음샛길에 들어가기 전 선택 배틀을 할래?','덩굴 공격과 버티는 힘을 살펴보고\n유리한 기술이나 교대를 골라 봐.','거절하거나 져도 황토와 얼음샛길 본선은 계속 열려 있어.']},
  {map:'tour_johto_ice_path_b1f',event:'tourIcePathTrainer',id:'johto-ice-path-practice',name:'얼음샛길 동굴 트레이너',reward:640,team:[[41,24],[114,25]],battlePage:'동굴의 주뱃과44번도로의 덩쿠리를 함께 돌봤어.\n얼음마루 밖 암반 공터에서 시작하자!',localPages:['주뱃과 덩쿠리로 차가운 동굴을 건너는 연습을 하고 있어.\n선택 배틀을 할래?','빠른 비행·독 동료 다음에는 풀 타입 동료가 나와.\n상대가 바뀌면 기술과 교대를 다시 골라 봐.','거절하거나 져도 네 층 계단과 검은먹 출구는 모두 열려 있어.']},
  {map:'tour_johto_route_43',event:'tourRoute43Trainer',id:'johto-route-43-practice',name:'43번도로 새잡이',reward:600,team:[[17,25]],battlePage:'호숫바람을 타고 단련한 피죤이야.\n서쪽 풀밭 옆 마른 공터에서 시작하자!',localPages:['43번도로에서 만난 피죤과 호수까지 걷고 있어.\n서쪽 풀밭 옆에서 선택 배틀을 할래?','빠른 비행 공격을 견딜 동료와 기술을 골라 봐.\n배틀 뒤에도 피죤을 직접 만날 풀밭은 그대로 열려 있어.','거절하거나 져도 가운데 본선으로 황토마을과\n분노의호수를 계속 오갈 수 있어.']},
  {map:'tour_johto_route_43',event:'tourRoute43Camper',id:'johto-route-43-camper-practice',name:'43번도로 야영객',reward:520,team:[[41,24]],battlePage:'서쪽 숲그늘에서 함께 쉬며 키운 주뱃이야.\n북쪽 풀밭 아래 마른 자리에서 겨뤄 보자!',localPages:['원작 43번도로의 야영객처럼 숲길 포켓몬과 함께 걷고 있어.\n북쪽 풀밭을 지난 동료와 선택 배틀을 할래?','주뱃의 빠른 비행·독 공격을 보고 기술과 교대할 동료를 골라 봐.\n남쪽 풀밭에서는 피죤을 만나 새잡이전까지 이어갈 수 있어.','거절하거나 져도 서쪽 길과 동쪽 옛 검문 길은 모두 열려 있어.']},
  {map:'tour_johto_route_38',event:'tourRoute38Trainer',id:'johto-route-38-practice',name:'38번도로 목초지 트레이너',reward:560,team:[[96,24],[19,25]],battlePage:'바람 센 목초지를 함께 걸은 두 동료야.\n마른 샛길 공터에서 시작하자!',localPages:['슬리프와 꼬렛을 번갈아 돌보며 38번도로를 걷고 있어.\n선택 배틀을 할래?','염동력 뒤 빠른 노말 공격이 이어져.\n남은 HP와 교대 순서를 함께 살펴봐.','배틀하지 않아도 동쪽 인주와 서쪽39번도로 본선은 계속 열려 있어.']},
  {map:'tour_johto_route_39',event:'tourRoute39Trainer',id:'johto-route-39-practice',name:'39번도로 목장 트레이너',reward:580,team:[[16,24],[19,25]],battlePage:'목장 울타리와 바닷바람에 익숙한 두 동료야.\n본선 밖 마른 공터에서 시작하자!',localPages:['구구와 꼬렛을 데리고 목장과 담청 사이를 걷고 있어.\n선택 배틀을 할래?','비행 공격 뒤 빠른 노말 공격이 이어져.\n담청에 닿기 전 파티의 힘을 나눠 봐.','거절하거나 져도 북쪽38번도로·동쪽 목장·남쪽 담청 길은 열려 있어.']},
  {map:'tour_olivine',event:'olivineDockTrainer',id:'olivine-dock-practice',name:'담청 작업항 트레이너',reward:600,team:[[66,24],[21,25]],battlePage:'짐을 나르는 힘과 바닷바람을 읽는 속도를 보여 줄게.\n안전선 안쪽 공터에서 시작하자!',localPages:['등대에서 외항의 빛과 안전선을 기록했구나.\n알통몬과 깨비참을 상대로 작업항 선택 배틀을 할래?','격투 타입 뒤 빠른 비행 타입이 나온다.\n상대가 바뀌면 기술과 교대를 다시 고르자.','배틀하지 않아도 센터·등대·39번도로와 기존 여객 항로는 계속 이용할 수 있어.']},
  {map:'tour_cianwood_hall',event:'cianwoodDojoTrainer',id:'cianwood-dojo-practice',name:'바다 도장 수련생',reward:620,team:[[66,24],[74,25],[21,25]],battlePage:'균형과 자세를 실제 기술 선택으로 이어가 보자.\n알통몬, 꼬마돌, 깨비참과 차례로 간다!',localPages:['외부 산책과 도장 동행 수련을 마쳤구나.\n선택 실전으로 이어갈래?','격투→바위·땅→비행 타입으로 상대가 바뀐다.\n한 기술만 반복하지 말고 교대와 남은 HP를 살펴봐.','거절하거나 져도 도장·도시·41번수로 연락선은 계속 열려 있어.']},
  {map:'tour_johto_route_35',event:'tourRoute35Trainer',id:'johto-route-35-practice',name:'35번도로 포켓몬 트레이너',reward:540,team:[[96,24],[19,25]],battlePage:'도시 외곽에서 함께 키운 두 친구야.\n긴풀 앞 마른 운동장에서 시작하자!',localPages:[
    '35번도로에서 만난 슬리프와 꼬렛을 키우고 있어.\n운동장 안쪽에서 선택 배틀을 할래?',
    '슬리프의 염동력 뒤에는 빠른 꼬렛이 나와.\n상대가 바뀌면 기술과 교대를 다시 살펴봐.',
    '거절해도 가운데 본선으로 금빛시티와\n자연공원을 계속 오갈 수 있어.'
  ]},
  {map:'tour_johto_national_park',event:'tourNationalParkTrainer',id:'johto-national-park-practice',name:'자연공원 곤충채집가',reward:560,team:[[10,23],[13,23],[16,24]],battlePage:'공원에서 관찰하며 키운 세 친구야.\n화단 밖 마른 공터에서 시작하자!',localPages:[
    '캐터피와 뿔충이, 구구를 함께 돌보고 있어.\n자유 산책 중에 선택 배틀을 할래?',
    '애벌레 포켓몬 뒤 구구가 나오면\n타입과 남은 HP를 보고 기술을 다시 골라 봐.',
    '배틀은 곤충채집 대회가 아니야. 남북 큰길과\n바깥 순환 산책로는 계속 열려 있어.'
  ]},
  {map:'tour_johto_route_36',event:'tourRoute36Trainer',id:'johto-route-36-practice',name:'36번도로 새잡이',reward:540,team:[[19,24],[16,25]],battlePage:'갈림길 주변에서 키운 두 친구야.\n서쪽 가지의 마른 공터에서 시작하자!',localPages:[
    '꼬렛과 구구를 번갈아 키우며 세 방향을 걷고 있어.\n본선 밖 공터에서 선택 배틀을 할래?',
    '빠른 노말 공격과 비행 공격을 견딜\n동료와 기술을 차례로 준비해 봐.',
    '거절해도 도라지·자연공원·37번도로의\n세 방향을 모두 오갈 수 있어.'
  ]},
  {map:'tour_johto_route_37',event:'tourRoute37Trainer',id:'johto-route-37-practice',name:'37번도로 포켓몬 트레이너',reward:560,team:[[16,24],[19,25]],battlePage:'단풍길에서 함께 걸은 두 친구야.\n규토리나무 반대쪽 공터에서 시작하자!',localPages:[
    '구구와 꼬렛을 데리고 인주까지 걷는 중이야.\n단풍 샛길 공터에서 선택 배틀을 할래?',
    '구구의 비행 공격 뒤 빠른 꼬렛이 나와.\n인주에 닿기 전 파티의 남은 힘을 나눠 봐.',
    '배틀하지 않아도 가운데 길로 36번도로와\n인주시티를 계속 왕복할 수 있어.'
  ]},
  {map:'tour_unova_route_11',event:'tourRouteElevenTrainer',id:'unova-route-11-practice',name:'11번도로 생태 트레이너',reward:620,team:[[183,24],[588,24],[616,25]],battlePage:'물가와 바위 곁에서 만난 세 친구야.\n풀숲 옆 마른 공터에서 시작하자!',localPages:[
    '마릴·딱정곤·쪼마리와 11번도로를 살피고 있어.\n물길 전망 순환로에서 선택 배틀을 할래?',
    '마릴의 물 기술 뒤에는 딱정곤과 쪼마리의\n서로 다른 벌레 기술이 이어져. 교대와 남은 HP를 살펴봐.',
    '배틀을 거절하거나 져도 중앙 길은 열려 있어.\n서쪽은 쌍용시티, 동쪽은 빌리지브리지야.'
  ]},
  {map:'tour_kanto_route_7',event:'tourRoute7Trainer',id:'kanto-route-7-practice',name:'7번도로 포켓몬 트레이너',reward:520,team:[[52,23],[16,24]],battlePage:'정원 가장자리에서 만난 두 친구야.\n긴풀 아래 마른 공터에서 시작하자!',localPages:[
    '7번도로에서 만난 나옹과 구구를 키우고 있어.\n정원 샛길 공터에서 선택 배틀을 할래?',
    '나옹의 빠른 공격 뒤에는 구구의 비행 공격이 나와.\n동료의 남은 HP와 교대 순서를 살펴봐.',
    '배틀하지 않아도 가운데 길로 무지개시티와\n노랑시티를 계속 오갈 수 있어.'
  ]},
  {map:'tour_kanto_route_8',event:'tourRoute8Trainer',id:'kanto-route-8-practice',name:'8번도로 새잡이',reward:540,team:[[16,24],[21,25]],battlePage:'도시 외곽을 함께 걸어온 두 친구야.\n꽃둑 옆 마른 공터에서 시작하자!',localPages:[
    '8번도로에서 만난 구구와 깨비참을 키우고 있어.\n보라 경계 공터에서 선택 배틀을 할래?',
    '구구 다음에는 더 빠른 깨비참이 나와.\n비행 공격을 견딜 동료와 기술을 준비해 봐.',
    '거절해도 가운데 길로 노랑시티와 보라타운을\n계속 오갈 수 있고 지하통로 입구도 열려 있어.'
  ]},
  {map:'tour_unova_route_08',event:'tourRouteEightTrainer',id:'unova-route-8-practice',name:'8번도로 습지 트레이너',reward:620,team:[[588,18],[616,19]],battlePage:'얕은 습지에서 돌보는 어린 두 친구야.\n마른 순환로 공터에서 시작하자!',localPages:[
    '딱정곤과 쪼마리의 움직임을 비교하며 8번도로를 살피고 있어.\n북쪽 순환로에서 선택 배틀을 할래?',
    '어린 두 포켓몬은 같은 습지에 살아도 쓰는 기술과 버티는 방법이 달라.\n상대가 바뀌면 기술과 교대를 다시 골라 봐.',
    '거절하거나 져도 가운데 마른 본선은 열려 있어.\n서쪽은 설화시티, 동쪽은 튜브라인브리지야.'
  ]},
  {map:'tour_kanto_route_16',event:'tourRoute16Trainer',id:'kanto-route-16-practice',name:'16번도로 관문 트레이너',reward:560,team:[[19,24],[21,24]],battlePage:'도시 정원과 관문 사이에서 걸음을 맞춘 동료들이야.\n동쪽 전망 공터에서 시작하자!',localPages:[
    '16번도로 풀밭에서 만난 꼬렛과 깨비참을 키우고 있어.\n17번도로로 내려가기 전 선택 배틀을 할래?',
    '빠른 노말 공격과 비행 공격을 차례로 살펴봐.\n긴 내리막에 들어가기 전 파티의 남은 HP도 확인하자.',
    '거절하거나 져도 북쪽 무지개시티와\n남쪽17번도로 본선은 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_17',event:'tourRoute17Trainer',id:'kanto-route-17-practice',name:'17번도로 내리막 트레이너',reward:580,team:[[19,24],[21,25]],battlePage:'긴 내리막에서 속도를 맞춘 두 동료야.\n남부 바람 표식 안쪽 공터에서 시작하자!',localPages:[
    '17번도로 풀밭에서 만난 꼬렛과 깨비참을 키우고 있어.\n본선 밖 남부 공터에서 선택 배틀을 할래?',
    '빠른 노말 공격 뒤 비행 공격이 이어져.\n내리막을 다 내려가기 전 남은 HP와 교대를 살펴봐.',
    '거절하거나 져도 가운데 길로16번도로와\n18번도로를 계속 왕복할 수 있어.'
  ]},
  {map:'tour_kanto_route_18',event:'tourRoute18Trainer',id:'kanto-route-18-practice',name:'18번도로 새잡이',reward:600,team:[[21,24],[19,25],[21,25]],battlePage:'연분홍 외곽 풀밭에서 함께 움직인 동료들이야.\n남쪽 마른 공터에서 시작하자!',localPages:[
    '18번도로의 깨비참과 꼬렛을 번갈아 키우고 있어.\n연분홍에 들어가기 전 선택 배틀을 할래?',
    '비행 공격 사이에 빠른 노말 공격이 이어져.\n상대가 바뀔 때 기술과 교대 순서를 다시 골라 봐.',
    '배틀하지 않아도 서쪽17번도로와\n동쪽 연분홍시티 길은 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_15',event:'tourRoute15Trainer',id:'kanto-route-15-practice',name:'15번도로 초원 트레이너',reward:600,team:[[16,24],[16,25]],battlePage:'15번도로 바람에 익숙한 두 구구야.\n동쪽 쉼터 옆 마른 공터에서 시작하자!',localPages:[
    '15번도로 풀밭에서 만난 구구를 함께 키우고 있어.\n동쪽 쉼터 옆에서 선택 배틀을 할래?',
    '첫 구구 다음에는 한 단계 더 자란 동료가 나와.\n남은 HP와 기술 횟수를 살펴보며 교대해 봐.',
    '배틀하지 않거나 져도 연분홍시티와\n14번도로 인계 지점 사이 본선은 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_14',event:'tourRoute14Trainer',id:'kanto-route-14-practice',name:'14번도로 새잡이',reward:620,team:[[16,24],[17,25]],battlePage:'14번도로 해풍에 익숙한 구구와 피죤이야.\n남동쪽 풀밭 밖 공터에서 시작하자!',localPages:[
    '구구와 피죤의 날갯짓을 살피며14번도로를 오르고 있어.\n남동쪽 마른 공터에서 선택 배틀을 할래?',
    '두 번째 동료는 한 단계 진화해 더 단단해.\n남은 HP와 기술 횟수를 살펴보며 교대해 봐.',
    '배틀하지 않거나 져도 남쪽15번도로와\n북쪽13번도로 인계 지점 사이 본선은 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_13',event:'tourRoute13Trainer',id:'kanto-route-13-practice',name:'13번도로 새잡이',reward:640,team:[[16,24],[17,25]],battlePage:'울타리 위의 바람을 읽는 구구와 피죤이야.\n동쪽 마른 순환로에서 시작하자!',localPages:[
    '13번도로의 한 곳뿐인 풀밭 주변에서 구구와 피죤을 돌보고 있어.\n동쪽 마른 순환로에서 선택 배틀을 할래?',
    '좁은 울타리 길에서는 상대가 바뀔 때\n남은 HP와 교대 순서를 차분히 살펴봐.',
    '배틀하지 않거나 져도 서쪽14번도로와\n동쪽12번도로 인계 지점 사이 본선은 계속 열려 있어.'
  ]},
  {map:'tour_kanto_route_12',event:'tourRoute12Trainer',id:'kanto-route-12-practice',name:'12번도로 다리 트레이너',reward:600,team:[[17,25]],battlePage:'13번도로에서부터 함께 온 피죤이야.\n남쪽 바람막이 공터에서 시작하자!',localPages:[
    '13번도로 울타리 길에서 키운 피죤과 사일런스브리지를 걷고 있어.\n남쪽 바람막이 공터에서 선택 배틀을 할래?',
    '12번도로에는 HGSS 기준 육상 풀숲이 없어.\n남쪽13번도로에서 만난 동료를 편성해 실전을 준비해 봐.',
    '배틀하지 않거나 져도 북쪽 보라타운과\n남쪽13번도로 사이 다리 본선은 계속 열려 있어.'
  ]},
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
  {map:'tour_violet_hall_2f',event:'violetTowerTrainer',id:'violet-tower-practice',name:'모다피의 탑 수련생',reward:560,team:[[41,24],[74,25]],battlePage:'흔들림을 읽는 주뱃과 중심을 지키는 꼬마돌이야.\n서로 다른 움직임을 보고 기술을 골라 봐!',localPages:[
    '세 층에서 동료와 호흡을 맞췄구나.\n이번에는 실제 기술과 교대를 함께 연습할래?',
    '주뱃은 빠른 비행·독 타입이고 꼬마돌은 단단한 바위·땅 타입이야.\n상대가 바뀌면 같은 기술만 고집하지 않아도 돼.',
    '배틀은 선택이야. 거절하거나 져도 계단과 전망,\n도라지시티의 모든 길은 계속 이용할 수 있어.'
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
  {map:'tour_sinnoh_route_215',event:'route215Trainer',id:'sinnoh-route-215-practice',name:'215번도로 비바람 트레이너',reward:520,team:[[307,20],[77,21]],battlePage:'빗길에서 함께 키운 두 동료야.\n비숲 옆 마른 공터에서 시작하자!',localPages:[
    '215번도로에서 만난 요가랑과 포니타를 키우고 있어.\n비숲 옆 마른 공터에서 선택 배틀을 할래?',
    '요가랑의 격투·에스퍼 기술 뒤 포니타가 나오면\n상대 타입과 남은 HP를 보고 기술과 교대를 골라 봐.',
    '배틀을 거절하거나 져도 210번도로 남부와\n장막시티를 잇는 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_212_south',event:'route212MarshTrainer',id:'sinnoh-route-212-south-practice',name:'212번도로 습지 트레이너',reward:460,team:[[280,17],[427,18]],battlePage:'습지에서 함께 키운 두 동료야.\n갈대 데크 옆 마른 자리에서 시작하자!',localPages:[
    '212번도로에서 만난 랄토스와 이어롤을 키우고 있어.\n갈대 데크 옆 공터에서 선택 배틀을 할래?',
    '랄토스의 에스퍼 기술 뒤 이어롤이 나오면\n타입뿐 아니라 속도와 남은 HP도 살펴봐.',
    '배틀을 거절하거나 져도 북부 정원길과\n들판시티를 잇는 데크 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_205_south',event:'route205ForestTrainer',id:'sinnoh-route-205-south-practice',name:'205번도로 숲가 트레이너',reward:300,team:[[268,11],[406,12]],battlePage:'영원숲 가장자리에서 돌본 두 동료야.\n강길 옆 마른 공터에서 시작하자!',localPages:[
    '영원숲에서 만난 카스쿤과 꼬몽울을 돌보고 있어.\n205번도로 강길 옆 공터에서 선택 배틀을 할래?',
    '단단해지기로 버티는 카스쿤 뒤 꼬몽울이 나오면\n공격할 때와 동료를 바꿀 때를 나눠 생각해 봐.',
    '배틀하지 않아도 남쪽 꽃향기마을과 북쪽 영원숲을\n잇는 가운데 길은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_205_north',event:'route205NorthTrainer',id:'sinnoh-route-205-north-practice',name:'205번도로 북부 트레이너',reward:340,team:[[265,12],[427,13]],battlePage:'영원숲에서 함께 나온 두 동료야.\n도시 앞 꽃길 옆 공터에서 시작하자!',localPages:[
    '영원숲에서 만난 개무소와 이어롤을 키우고 있어.\n영원시티에 들어가기 전에 선택 배틀을 할래?',
    '개무소 뒤 빠른 이어롤이 나오면\n남은 HP와 기술, 교대 순서를 다시 살펴봐.',
    '배틀을 거절하거나 져도 남쪽 영원숲과\n북쪽 영원시티를 잇는 다리 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_206',event:'route206UnderpassTrainer',id:'sinnoh-route-206-underpass-practice',name:'206번도로 아래길 트레이너',reward:380,team:[[427,14],[77,15]],battlePage:'아래 풀길에서 함께 달린 두 동료야.\n고가 바깥 공터에서 시작하자!',localPages:[
    '이어롤과 포니타의 걸음 차이를 살피며 206번도로를 달렸어.\n아래길 공터에서 선택 배틀을 할래?',
    '이어롤 뒤 더 빠른 포니타가 나오면\n남은 HP와 행동 순서를 보고 기술과 교대를 골라 봐.',
    '배틀하지 않아도 가운데 고가 본선으로\n영원시티와 207번도로를 계속 오갈 수 있어.'
  ]},
  {map:'tour_sinnoh_route_207',event:'route207MountainTrainer',id:'sinnoh-route-207-mountain-practice',name:'207번도로 산악 트레이너',reward:420,team:[[74,15],[66,16]],battlePage:'산기슭에서 함께 단련한 두 동료야.\n천관산 앞 마른 공터에서 시작하자!',localPages:[
    '꼬마돌과 알통몬과 함께 천관산 입구를 살피고 있어.\n산 앞 공터에서 선택 배틀을 할래?',
    '단단한 바위·땅 타입 뒤 격투 타입이 나오면\n한 기술만 반복하지 말고 교대도 생각해 봐.',
    '거절하거나 져도 서쪽 206번도로와 동쪽 천관산 하부를\n잇는 산길 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_208',event:'route208Trainer',id:'sinnoh-route-208-practice',name:'208번도로 산기슭 트레이너',reward:440,team:[[74,16],[307,17]],battlePage:'천관산 하부에서 함께 걸어온 두 동료야.\n개울 옆 마른 공터에서 시작하자!',localPages:[
    '천관산에서 만난 꼬마돌과 요가랑과 함께 내려왔어.\n208번도로 개울 옆 공터에서 선택 배틀을 할래?',
    '바위·땅 타입 뒤 격투·에스퍼 타입이 나오면\n상대가 바뀔 때 기술과 교대도 다시 골라 봐.',
    '배틀하지 않아도 서쪽 천관산과 동쪽 연고시티를\n잇는 계단 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_209',event:'route209Trainer',id:'sinnoh-route-209-practice',name:'209번도로 초원 트레이너',reward:460,team:[[315,17],[280,18]],battlePage:'초원과 연못길에서 함께 호흡을 맞춘 두 동료야.\n로스트타워 갈림길 전 공터에서 시작하자!',localPages:[
    '로젤리아와 랄토스와 함께 연고에서 신수까지 걷고 있어.\n굽은 초원길 공터에서 선택 배틀을 할래?',
    '풀·독 타입 뒤 에스퍼 타입이 나오면\n상대가 바뀔 때 기술과 교대 순서를 다시 살펴봐.',
    '배틀하지 않아도 남쪽 연고시티와 북쪽 신수마을,\n로스트타워 분기는 모두 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_211_west',event:'route211WestTrainer',id:'sinnoh-route-211-west-practice',name:'211번도로 서부 트레이너',reward:440,team:[[74,16],[307,17]],battlePage:'서쪽 산기슭에서 함께 걸은 두 동료야.\n천관산 입구 앞 공터에서 시작하자!',localPages:[
    '꼬마돌과 요가랑과 함께 211번도로 서부를 걷고 있어.\n천관산 입구 앞에서 선택 배틀을 할래?',
    '바위·땅 타입 뒤 격투·에스퍼 타입이 나오면\n기술과 교대 순서를 다시 살펴봐.',
    '거절하거나 져도 영원시티와 천관산 통과층을\n잇는 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_211_east',event:'route211EastTrainer',id:'sinnoh-route-211-east-practice',name:'211번도로 동부 트레이너',reward:460,team:[[77,17],[66,18]],battlePage:'산 그림자와 숲 경계를 함께 달린 두 동료야.\n봉신마을 앞 공터에서 시작하자!',localPages:[
    '포니타와 알통몬과 함께 211번도로 동부를 걷고 있어.\n봉신마을 앞에서 선택 배틀을 할래?',
    '빠른 불꽃 타입 뒤 격투 타입이 나오면\n남은 HP와 다음 교대를 함께 살펴봐.',
    '거절하거나 져도 천관산 통과층과 봉신마을을\n잇는 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_210_south',event:'route210Trainer',id:'sinnoh-route-210-south-practice',name:'210번도로 목장길 트레이너',reward:500,team:[[439,19],[77,20]],battlePage:'목장길과 카페터 사이에서 함께 키운 두 동료야.\n풀밭 바깥 공터에서 시작하자!',localPages:[
    '흉내내와 포니타를 데리고 신수 목장길을 걷고 있어.\n카페터 아래 공터에서 선택 배틀을 할래?',
    '에스퍼·페어리 타입 뒤 불꽃 타입이 나오면\n상대의 약점과 남은 HP를 보고 기술과 교대를 골라 봐.',
    '배틀하지 않아도 남쪽 신수마을과 북쪽 215번도로를\n잇는 가운데 목장길은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_210_north',event:'route210NorthTrainer',id:'sinnoh-route-210-north-practice',name:'210번도로 북부 트레이너',reward:520,team:[[307,20],[66,21]],battlePage:'안개 낀 산길에서 함께 보폭을 맞춘 두 동료야.\n풀밭 옆 마른 길에서 시작하자!',localPages:[
    '요가랑과 알통몬과 함께 210번도로 북부를 걷고 있어.\n안개 길 공터에서 선택 배틀을 할래?',
    '두 격투 동료도 기술과 능력치가 달라.\n상대가 바뀌면 남은 HP와 교대 순서를 다시 살펴봐.',
    '거절하거나 져도 봉신마을과 210번도로 남부를\n잇는 굽은 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_214',event:'route214Trainer',id:'sinnoh-route-214-practice',name:'214번도로 암벽 트레이너',reward:560,team:[[434,21],[77,22]],battlePage:'장막 남쪽 암벽길에서 함께 키운 두 동료야.\n풀밭 바깥 마른 길에서 시작하자!',localPages:[
    '스컹뿡과 포니타와 함께 입지호수 근처로 내려가는 중이야.\n암벽 사이 공터에서 선택 배틀을 할래?',
    '독·악 타입 뒤 불꽃 타입이 나오면\n상대와 파티의 남은 HP를 보고 기술과 교대를 골라 봐.',
    '배틀하지 않아도 북쪽 장막시티와 남쪽 입지호수 근처를\n잇는 암벽 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_213',event:'route213Trainer',id:'sinnoh-route-213-practice',name:'213번도로 해변 트레이너',reward:540,team:[[183,20],[16,21]],battlePage:'습지와 해변 사이를 함께 걸은 두 동료야.\n모래길 위 마른 공터에서 시작하자!',localPages:[
    '마릴과 구구를 데리고 들판에서 호수근처까지 걷고 있어.\n해안 산책로 공터에서 선택 배틀을 할래?',
    '물 타입 뒤 빠른 비행 타입이 나오면\n파티의 남은 HP와 다음 교대도 함께 살펴봐.',
    '배틀하지 않아도 서쪽 들판시티와 동쪽 입지호수 근처를\n잇는 해변 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_222',event:'route222Trainer',id:'sinnoh-route-222-practice',name:'222번도로 해안 트레이너',reward:600,team:[[16,22],[183,23]],battlePage:'해풍 속에서 함께 걸어온 두 동료야.\n방풍림 아래 마른 공터에서 시작하자!',localPages:[
    '구구와 마릴을 데리고 물가시티까지 해안을 걷고 있어.\n방풍림 옆 공터에서 선택 배틀을 할래?',
    '빠른 비행 타입 뒤 물 타입이 나오면\n한 기술만 반복하지 말고 교대할 동료도 살펴봐.',
    '배틀하지 않아도 서쪽 입지호수 근처와 동쪽 물가시티를\n잇는 해안 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_216',event:'route216Trainer',id:'sinnoh-route-216-practice',name:'216번도로 눈절벽 트레이너',reward:580,team:[[66,21],[77,22]],battlePage:'산길과 눈바람에 익숙한 두 동료야.\n피난림 앞 마른 공터에서 시작하자!',localPages:[
    '알통몬과 포니타와 함께 눈절벽을 건너고 있어.\n피난림 앞 공터에서 선택 배틀을 할래?',
    '격투 타입 뒤 불꽃 타입이 나오면\n눈길에서 지친 파티의 HP와 교대 순서를 살펴봐.',
    '배틀하지 않아도 서쪽 천관산 북부와 동쪽 217번도로를\n잇는 설원 본선은 계속 열려 있어.'
  ]},
  {map:'tour_sinnoh_route_217',event:'route217Trainer',id:'sinnoh-route-217-practice',name:'217번도로 설원 트레이너',reward:620,team:[[16,22],[74,23]],battlePage:'긴 설원에서 서로를 지켜 준 두 동료야.\n표석 옆 바람막이 공터에서 시작하자!',localPages:[
    '구구와 꼬마돌과 함께 표석을 따라 여기까지 왔어.\n바람막이 공터에서 선택 배틀을 할래?',
    '빠른 비행 타입 뒤 단단한 바위·땅 타입이 나오면\n상대가 바뀔 때 유리한 기술도 다시 골라 봐.',
    '거절하거나 져도 북쪽 216번도로와 남쪽 예지호수 근처를\n잇는 표석 본선은 계속 열려 있어.'
  ]},
  {map:'route_s01',event:'roadworker',id:'west-road-practice',name:'도로 정비원',reward:160,team:[[396,4]]},
  {map:'tour_sinnoh_route_202',event:'route202TrainerStarly',id:'sinnoh-route-202-starly',name:'202번도로 소년',reward:80,team:[[396,5]],battlePage:'찌르꼬와 함께 첫 실전을 시작하자!',localPages:['찌르꼬와 잔모래에서 축복까지 걷고 있어.\n첫 트레이너 배틀을 해 볼래?','빠른 찌르꼬를 상대하며 파트너의 HP와 기술을 살펴봐.','거절하거나 져도 202번도로 본선은 계속 열려 있어.']},
  {map:'tour_sinnoh_route_202',event:'route202TrainerBidoof',id:'sinnoh-route-202-bidoof',name:'202번도로 소녀',reward:80,team:[[399,5]],battlePage:'비버니와 차근차근 겨뤄 보자!',localPages:['비버니와 풀밭 가장자리를 걷고 있어.\n포켓몬 배틀을 해 볼래?','남은 HP를 확인하고 필요하면 동료를 교대해 봐.','배틀하지 않아도 잔모래와 축복을 계속 오갈 수 있어.']},
  {map:'tour_sinnoh_route_202',event:'route202TrainerBurmy',id:'sinnoh-route-202-burmy',name:'202번도로 소년',reward:80,team:[[412,5]],battlePage:'도롱충이와 축복 입구에서 기다렸어!',localPages:['도롱충이와 북쪽 풀길을 살피고 있어.\n축복시티에 가기 전 한 번 겨뤄 볼래?','풀 타입에 유리한 기술이 있다면 이번에 시험해 봐.','거절하거나 져도 북쪽 축복시티 출구는 막히지 않아.']},
  {map:'tour_jubilife_school',event:'jubilifeSchoolStarly',id:'sinnoh-jubilife-school-starly',name:'트레이너스쿨 학생',reward:120,team:[[396,6]],battlePage:'202번도로에서 키운 찌르꼬와 수업 실전을 시작하자!',localPages:['찌르꼬와 함께 선공과 남은 HP를 공부하고 있어.\n파란 실습 매트에서 선택 배틀을 할래?','빠른 상대를 만나면 기술 설명과 파티 상태를 먼저 확인해 봐.','배틀을 하지 않아도 수업과 203번도로 출발은 계속 열려 있어.']},
  {map:'tour_jubilife_school',event:'jubilifeSchoolBidoof',id:'sinnoh-jubilife-school-bidoof',name:'트레이너스쿨 학생',reward:120,team:[[399,6]],battlePage:'비버니와 배운 기본기를 차근차근 확인해 보자!',localPages:['비버니와 함께 교대와 회복 시점을 공부하고 있어.\n파란 실습 매트에서 선택 배틀을 할래?','상대가 버틸 때는 남은 HP를 보고 기술이나 동료를 다시 골라 봐.','배틀을 거절하거나 져도 학교 출입과 동쪽 여행길은 막히지 않아.']},
  {map:'tour_pass_jubilife_oreburgh',event:'journeyWalker',id:'oreburgh-cave-practice',name:'산행객',reward:300,team:[[74,7],[41,7]]},
  {map:'tour_sinnoh_route_203',event:'route203Walker',id:'sinnoh-route-203-practice',name:'203번도로 초보 트레이너',reward:180,team:[[396,6],[403,7]],battlePage:'연못과 바위턱 사이 마른 공터에서 찌르꼬와 꼬링크의 호흡을 보여 줄게!',localPages:['찌르꼬와 꼬링크를 데리고 축복에서 무쇠게이트까지 걷고 있어.\n연못 옆 마른 공터에서 선택 배틀을 할래?','빠른 비행 동료 뒤 전기 동료가 나와.\n상대가 바뀌면 남은 HP와 기술을 다시 살펴봐.','거절하거나 져도 서쪽 축복시티와 동쪽 무쇠게이트를\n잇는 203번도로 본선은 계속 열려 있어.']},
  {map:'tour_oreburgh_gate_1f',event:'oreburghGateWorker',id:'oreburgh-gate-1f-practice',name:'무쇠게이트 작업자',reward:240,team:[[41,7],[74,8]],battlePage:'조명 통과로 옆 공터에서 주뱃과 꼬마돌의 동굴 움직임을 보여 줄게!',localPages:['주뱃과 꼬마돌이 밝은 통과로와 광석벽을 살피고 있어.\n작업선 밖 공터에서 선택 배틀을 할래?','빠른 비행·독 동료 뒤 단단한 바위·땅 동료가 나와.\n상대가 바뀌면 유리한 기술과 교대를 다시 골라 봐.','배틀하지 않아도 서쪽 203번도로와 동쪽 무쇠시티를\n잇는 1층 본선은 열려 있어. B1F는 아직 개방하지 않았어.']},
  {map:'tour_oreburgh_mine',event:'oreburghMineWorker',id:'oreburgh-mine-practice',name:'무쇠탄갱 광부',reward:360,team:[[66,9],[74,10]],battlePage:'작업로 밖 공터에서 알통몬과 꼬마돌의 호흡을 보여 줄게!',localPages:['알통몬과 꼬마돌이 광차 길을 함께 관리하고 있어.\n작업로 밖 공터에서 선택 배틀을 할래?','힘으로 밀어붙이는 동료 뒤 단단한 바위·땅 동료가 나와.\n상대가 바뀌면 기술과 교대를 다시 살펴봐.','거절하거나 져도 탄갱 탐험층과 무쇠시티 귀환로는\n계속 열려 있어. 강석 도전 조건도 바뀌지 않아.']},
  {map:'oreburgh_gym',event:'gymTypeTrainer',id:'oreburgh-gym-types',name:'체육관 수련생',reward:200,team:[[74,7]],lesson:'type'},
  {map:'oreburgh_gym',event:'gymSwitchTrainer',id:'oreburgh-gym-switch',name:'체육관 연습생',reward:320,team:[[95,8],[396,7]],lesson:'switch'}
];
export const ROAD_TRAINER_DATABASE=createCatalog('road trainers by map/event',trainers,t=>`${t.map}:${t.event}`);
export { trainerWinFlag };

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
const johtoMiddleWinRoutes:Record<string,{next:string;nextLabel:string;advice:string}>={
  'johto-route-35-practice':{next:'tour_johto_national_park',nextLabel:'자연공원으로 진행',advice:'슬리프에서 빠른 꼬렛으로 상대가 바뀔 때 기술과 교대를 잘 살폈어.'},
  'johto-national-park-practice':{next:'tour_johto_route_36',nextLabel:'36번도로로 진행',advice:'애벌레 포켓몬 뒤 구구가 나올 때 타입과 남은 HP를 잘 확인했어.'},
  'johto-route-36-practice':{next:'tour_johto_route_37',nextLabel:'37번도로로 진행',advice:'꼬렛과 구구의 빠른 공격에 맞춰 파티의 힘을 잘 나누었어.'},
  'johto-route-37-practice':{next:'tour_ecruteak',nextLabel:'인주시티로 진행',advice:'구구와 꼬렛의 순서를 읽고 인주 도착 전 준비를 잘 마쳤어.'},
};
const johtoWestWinRoutes:Record<string,{next:string;nextLabel:string;advice:string}>={
  'johto-route-38-practice':{next:'tour_johto_route_39',nextLabel:'39번도로로 진행',advice:'슬리프의 염동력 뒤 빠른 꼬렛이 나올 때 교대와 남은 HP를 잘 살폈어.'},
  'johto-route-39-practice':{next:'tour_olivine',nextLabel:'담청시티로 진행',advice:'구구의 비행 공격과 꼬렛의 빠른 공격에 맞춰 파티의 힘을 잘 나누었어.'},
  'olivine-dock-practice':{next:'tour_olivine_center',nextLabel:'담청센터로 이동',advice:'알통몬에서 깨비참으로 상대가 바뀔 때 기술과 교대를 다시 골랐어.'},
  'cianwood-dojo-practice':{next:'tour_johto_route_41',nextLabel:'41번수로로 돌아가기',advice:'격투에서 바위·땅, 다시 비행 타입으로 바뀔 때 기술과 교대를 잘 나눴어.'},
};
const johtoLakeWinRoutes:Record<string,{next:string;nextLabel:string;advice:string}>={
  'johto-route-43-camper-practice':{next:'tour_rage_lake',nextLabel:'분노의호수로 진행',advice:'주뱃의 빠른 비행·독 공격에 맞춰 동료와 기술을 잘 골랐어.'},
  'johto-route-43-practice':{next:'tour_rage_lake',nextLabel:'분노의호수로 진행',advice:'피죤의 빠른 비행 공격에 맞춰 동료와 기술을 잘 골랐어.'},
};
const johtoEastWinRoutes:Record<string,{next:string;nextLabel:string;advice:string}>={
  'johto-route-44-practice':{next:'tour_johto_ice_path_1f',nextLabel:'얼음샛길로 진행',advice:'덩쿠리의 풀 공격에 맞춰 유리한 기술과 동료를 잘 골랐어.'},
  'johto-ice-path-practice':{next:'tour_blackthorn',nextLabel:'검은먹시티로 진행',advice:'주뱃에서 덩쿠리로 상대가 바뀔 때 기술과 교대를 잘 조정했어.'},
};
const sinnohCelesticWinRoutes:Record<string,{next:string;nextEvent:string;nextLabel:string;advice:string}>={
  'sinnoh-route-211-west-practice':{next:'tour_coronet_211_pass',nextEvent:'coronet211Guide',nextLabel:'천관산 통과층으로',advice:'꼬마돌에서 요가랑으로 상대가 바뀔 때 기술과 교대를 다시 살폈어.'},
  'sinnoh-route-211-east-practice':{next:'tour_celestic_center',nextEvent:'tourCelesticCenterGuide',nextLabel:'봉신센터로 돌아가기',advice:'포니타의 빠른 불꽃 공격 뒤 알통몬의 격투 공격에 맞춰 파티의 힘을 나누었어.'},
  'sinnoh-route-210-north-practice':{next:'tour_celestic_center',nextEvent:'tourCelesticCenterGuide',nextLabel:'봉신센터로 돌아가기',advice:'서로 다른 움직임을 가진 요가랑과 알통몬에 맞춰 기술과 교대를 다시 골랐어.'},
};
export function handleRoadTrainer(g:Engine,event:string):boolean{
  const trainer=ROAD_TRAINER_DATABASE.get(`${g.save.map}:${event}`);if(!trainer)return false;
  const parkRetry=()=>{
    const slot=g.save.flags.nexusCasteliaSewerParkPartnerSlot;
    const mon=typeof slot==='number'?g.save.party[slot]:undefined;
    return trainer.id==='castelia-park-practice'&&!g.save.flags.nexusCasteliaSewerParkPartnerWon&&!!mon&&mon.species===g.save.flags.nexusCasteliaSewerParkPartner&&['구름하수도','구름시티 공원'].includes(mon.met);
  };
  const celesticRetry=()=>{
    const f=CELESTIC_ROUTE_BATTLE,slot=g.save.flags[f.slot];
    const mon=typeof slot==='number'?g.save.party[slot]:undefined;
    return !!g.save.flags[trainerWinFlag(trainer.id)]&&!g.save.flags[f.participated]&&g.save.flags[f.trainer]===celesticTrainerCode(trainer.id)&&!!mon&&mon.species===g.save.flags[f.partner]&&['신오 210번도로 북부','천관산 211 통과층','신오 211번도로 서부','신오 211번도로 동부'].includes(mon.met);
  };
  const eastRetry=()=>canRetryJohtoEastPartnerBattle(g.save,trainer.id);
  const southRetry=()=>canRetryJohtoSouthPartnerBattle(g.save,trainer.id);
  const routeTwelveRetry=()=>canRetryRouteTwelvePartnerBattle(g.save,trainer.id);
  const routeElevenRetry=()=>canRetryRouteElevenPartnerBattle(g.save,trainer.id);
  const routeNineRetry=()=>canRetryRouteNinePartnerBattle(g.save,trainer.id);
  const routeEightRetry=()=>canRetryRouteEightPartnerBattle(g.save,trainer.id);
  const route203Retry=()=>canRetryRoute203PartnerBattle(g.save,trainer.id);
  const oreburghGateRetry=()=>canRetryOreburghGatePartnerBattle(g.save,trainer.id);
  const badged=g.save.badges.includes('BADGE-GS01');
  if(trainer.id==='sinnoh-route-205-north-practice'&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const owned=[...save.party,...save.box??[]].filter(mon=>mon.met==='영원숲');
    const names=[...new Set(owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say(trainer.name,['205번도로 북부 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.','개무소 뒤 이어롤이 나올 때 기술과 교대를 다시 고른 경험을 다음 길에서도 활용해 봐.',`영원숲에서 만난 보유 동료 ${owned.length}마리 · ${names}`,`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'영원시티 센터 안내',action:()=>{if(current())g.setTourDestination('tour_eterna_center','nurse');}},
      {label:'206번도로 안내',action:()=>{if(current())g.setTourDestination('tour_sinnoh_route_206','route206Sign');}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  if(trainer.id==='sinnoh-route-208-practice'&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const owned=[...save.party,...save.box??[]].filter(mon=>mon.met==='천관산 하부');
    const names=[...new Set(owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say(trainer.name,['208번도로 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.','꼬마돌에서 요가랑으로 상대가 바뀔 때 기술과 교대를 다시 살핀 경험을 기억해 둬.',`천관산 하부에서 만난 보유 동료 ${owned.length}마리 · ${names}`,`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'천관산 쉼터 안내',action:()=>{if(current())g.setTourDestination('tour_coronet','trailGuide');}},
      {label:'연고시티 센터 안내',action:()=>{if(current())g.setTourDestination('tour_hearthome_center','nurse');}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  const celesticWin=sinnohCelesticWinRoutes[trainer.id];
  if(celesticWin&&g.save.flags[trainerWinFlag(trainer.id)]&&!celesticRetry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const origins=new Set(['신오 210번도로 북부','천관산 211 통과층','신오 211번도로 서부','신오 211번도로 동부']);
    const party=save.party.filter(mon=>origins.has(mon.met)),boxed=(save.box??[]).filter(mon=>origins.has(mon.met));
    const names=[...new Set([...party,...boxed].map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].slice(0,5).join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    const f=CELESTIC_ROUTE_BATTLE,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined;
    const joined=save.flags[f.trainer]===celesticTrainerCode(trainer.id)&&save.flags[f.participated]&&partner&&partner.species===save.flags[f.partner];
    const start=Number(save.flags[f.level]??0);
    g.say(trainer.name,['이 산길 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',celesticWin.advice,joined?`${SPECIES[partner.species].name}가 실제 승리에 참가했다.\n출발 Lv.${start} → 현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}`:'선택한 현지 동료의 실제 승리 참가는 아직 기록되지 않았다.',`210·211번도로와 천관산에서 만난 보유 동료 ${party.length+boxed.length}마리\n파티 ${party.length} · PC ${boxed.length} · ${names}`,save.party.length?`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어. 봉신센터 PC에서 동료를 편성하자.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'봉신센터에서 회복·편성',action:()=>{if(current())g.setTourDestination('tour_celestic_center','tourHost');}},
      {label:celesticWin.nextLabel,action:()=>{if(current())g.setTourDestination(celesticWin.next,celesticWin.nextEvent);}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  if(trainer.id==='olivine-dock-practice'&&!g.save.flags.olivineLighthouseCompleted){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    g.say(trainer.name,['작업항 실전 전에 등대에서 외항의 빛과 안전선을 먼저 읽어 보자.','1층에서 건강한 동료를 고르고 2층 항로 표지, 3층 등실 기록까지 이어진다.','실전과 등대 기록을 하지 않아도 도시·39번도로·기존 여객 항로는 막히지 않는다.'],undefined,[{label:'등대 1층 안내',action:()=>{if(current())g.setTourDestination('tour_olivine_hall','olivineLighthouseLensTable');}},{label:'그대로 지나간다',action:()=>{}}]);return true;
  }
  if(trainer.id==='cianwood-dojo-practice'&&!g.save.flags.cianwoodDojoPracticeCompleted){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    g.say(trainer.name,['선택 실전 전에 동료와 해변 흐름을 읽고 도장 자세를 맞춰 보자.','외부 해풍 화단→발자국→호흡마당 뒤, 도장 균형 마루→둥근바위 자세→동행 기록 순서다.','수련과 실전을 하지 않아도 도장 출입·도시·41번수로 연락선은 막히지 않는다.'],undefined,[{label:'외부 화단 안내',action:()=>{if(current())g.setTourDestination('tour_cianwood','tourCianwoodGardenCare');}},{label:'균형 마루 안내',action:()=>{if(current())g.setTourDestination('tour_cianwood_hall','cianwoodDojoBalanceMat');}},{label:'그대로 지나간다',action:()=>{}}]);return true;
  }
  if(trainer.id==='violet-tower-practice'&&!g.save.flags.violetTowerPracticeCompleted){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    g.say(trainer.name,['여기는 동료와 맞춘 움직임을 실제 기술과 교대로 이어 보는 자리야.','먼저 1층 첫걸음·2층 균형·3층 호흡 수련을 마치고 돌아오면 선택 배틀을 할 수 있어.','수련이나 배틀을 하지 않아도 계단과 도시 이동은 막히지 않아.'],undefined,[
      {label:'1층 첫걸음 안내',action:()=>{if(current())g.setTourDestination('tour_violet_hall','violetTowerFirstStep');}},
      {label:'3층 호흡 안내',action:()=>{if(current())g.setTourDestination('tour_violet_hall_3f','violetTowerBreathingBell');}},
      {label:'그대로 지나간다',action:()=>{}},
    ]);return true;
  }
  if(trainer.id==='violet-tower-practice'&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const species=Number(save.flags.violetTowerPracticeSpecies??0),partner=SPECIES[species]?.name??'동료';
    g.say(trainer.name,['탑 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',`${partner}와 맞춘 첫걸음·균형·호흡을 실제 기술 선택까지 잘 이어 냈구나.`,'주뱃에서 꼬마돌로 상대가 바뀔 때 타입과 교대를 다시 살핀 경험을 다음 길에서도 활용해 봐.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'도라지센터 안내',action:()=>{if(current())g.setTourDestination('tour_violet_center','nurse');}},
      {label:'3층 여행 수첩',action:()=>{if(current())g.setTourDestination('tour_violet_hall_3f','violetTowerJourneyBook');}},
      {label:'계속 둘러본다',action:()=>{}},
    ]);return true;
  }
  if(trainer.id==='route-34-field-practice'&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    g.say(trainer.name,['함께 겨뤄 보니 동료들의 장점이 잘 보이네!','꼬렛은 빠른 공격, 슬리프는 염동력과\n특수 공격을 견디는 힘을 살렸어.','북쪽 금빛에서 쉬거나 기술을 준비하고,\n남쪽 숲으로 여행을 계속해도 좋아.'],undefined,[
      {label:'금빛센터 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','nurse');}},
      {label:'기술 작업방 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_home2','tourHost');}},
      {label:'너도밤나무숲 안내',action:()=>{if(current())g.setTourDestination('tour_ilex');}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  const middleWin=johtoMiddleWinRoutes[trainer.id];
  if(middleWin&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const origins=new Set(['성도 35번도로','자연공원','성도 36번도로','성도 37번도로']);
    const party=save.party.filter(mon=>origins.has(mon.met)),boxed=(save.box??[]).filter(mon=>origins.has(mon.met));
    const names=[...new Set([...party,...boxed].map(mon=>SPECIES[mon.species].name))].slice(0,5).join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say(trainer.name,['이 구간 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',middleWin.advice,`성도 중부에서 만난 보유 동료 ${party.length+boxed.length}마리\n파티 ${party.length} · PC ${boxed.length} · ${names}`,`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'인주센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_ecruteak_center','pc');}},
      {label:middleWin.nextLabel,action:()=>{if(current())g.setTourDestination(middleWin.next);}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  const westWin=johtoWestWinRoutes[trainer.id];
  if(westWin&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle,origins=new Set(['성도 38번도로','성도 39번도로']);
    const party=save.party.filter(mon=>origins.has(mon.met)),boxed=(save.box??[]).filter(mon=>origins.has(mon.met)),names=[...new Set([...party,...boxed].map(mon=>SPECIES[mon.species].name))].join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say(trainer.name,['이 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',westWin.advice,`38·39번도로에서 만난 보유 동료 ${party.length+boxed.length}마리\n파티 ${party.length} · PC ${boxed.length} · ${names}`,`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'담청센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_olivine_center','pc');}},{label:westWin.nextLabel,action:()=>{if(current())g.setTourDestination(westWin.next);}},{label:'계속 둘러본다',action:()=>{}}]);return true;
  }
  const lakeWin=johtoLakeWinRoutes[trainer.id];
  if(lakeWin&&g.save.flags[trainerWinFlag(trainer.id)]){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const owned=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 43번도로');
    const names=[...new Set(owned.map(mon=>SPECIES[mon.species].name))].join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say(trainer.name,['43번도로 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',lakeWin.advice,`43번도로에서 만난 보유 동료 ${owned.length}마리 · ${names}`,`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'황토센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','pc');}},{label:lakeWin.nextLabel,action:()=>{if(current())g.setTourDestination(lakeWin.next);}},{label:'계속 걷기',action:()=>{}}]);return true;
  }
  const eastWin=johtoEastWinRoutes[trainer.id];
  if(eastWin&&g.save.flags[trainerWinFlag(trainer.id)]&&!eastRetry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle,origins=new Set(['성도 44번도로','얼음샛길']);
    const owned=[...save.party,...save.box??[]].filter(mon=>origins.has(mon.met)),names=[...new Set(owned.map(mon=>SPECIES[mon.species].name))].join('·')||'아직 없음';
    const hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    const f=JOHTO_EAST_BATTLE,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined,start=Number(save.flags[f.level]??0),recorded=SPECIES[Number(save.flags[f.partner]??0)]?.name;
    const result=save.flags[f.participated]===true&&recorded?(partner&&partner.species===save.flags[f.partner]?`${recorded}가 실제로 상대를 쓰러뜨린 기록 · Lv.${start}→${partner.level} · HP ${partner.hp}/${partner.maxHp}`:`${recorded}가 실제로 상대를 쓰러뜨린 기록 · 시작 Lv.${start} · 현재 PC 또는 다른 편성`):'현지 동료의 실제 상대 격파 기록은 아직 없다. 현지 동료를 선두로 편성한 뒤 다시 말을 걸면 상금 없는 재확인전을 할 수 있다.';
    g.say(trainer.name,['성도 동부 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',eastWin.advice,result,`44번도로·얼음샛길에서 만난 보유 동료 ${owned.length}마리 · ${names}`,`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'황토센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','pc');}},{label:eastWin.nextLabel,action:()=>{if(current())g.setTourDestination(eastWin.next);}},{label:'계속 걷기',action:()=>{}}]);return true;
  }
  if(trainer.id===ROUTE_ELEVEN_TRAINER&&g.save.flags[trainerWinFlag(trainer.id)]&&g.save.flags[ROUTE_ELEVEN_JOURNEY.participated]===true&&!routeElevenRetry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle;
    const localSpecies=new Set([183,588,616]);
    const party=save.party.filter(mon=>mon.met==='하나 11번도로'&&localSpecies.has(mon.species));
    const boxed=(save.box??[]).filter(mon=>mon.met==='하나 11번도로'&&localSpecies.has(mon.species));
    const names=[...new Set([...party,...boxed].map(mon=>SPECIES[mon.species].name))].join('·')||'아직 없음';
    const f=ROUTE_ELEVEN_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined,start=Number(save.flags[f.level]??0),recorded=SPECIES[Number(save.flags[f.partner]??0)]?.name??'11번도로 동료';
    const state=partner&&partner.species===save.flags[f.partner]?`${recorded}가 실제 승리에 참가했다.\n출발 Lv.${start} → 현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}`:`${recorded}가 실제 승리에 참가한 기록이 있다. 현재는 PC 또는 다른 편성에 있다.`;
    g.say(trainer.name,['11번도로 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',state,`11번도로에서 만난 보유 동료 ${party.length+boxed.length}마리\n파티 ${party.length} · PC ${boxed.length} · ${names}`,'같은 동료와 빌리지브리지 서쪽 안내원에게 돌아가면 포획·성장·귀환을 함께 기록할 수 있어.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'빌리지브리지로 귀환',action:()=>{if(current())g.setTourDestination('tour_village_bridge','tourResident3');}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  if(trainer.id===ROUTE_NINE_TRAINER&&g.save.flags[trainerWinFlag(trainer.id)]&&g.save.flags[ROUTE_NINE_JOURNEY.participated]===true&&!routeNineRetry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle,f=ROUTE_NINE_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined,start=Number(save.flags[f.level]??0);
    const state=partner&&partner.species===save.flags[f.partner]?`치라미가 실제 승리에 참가했다.\n출발 Lv.${start} → 현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}`:`치라미가 실제 승리에 참가한 기록이 있다. 현재는 PC 또는 다른 편성에 있다.`;
    g.say(trainer.name,['9번도로 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',state,'같은 치라미와 쌍용 서문 쉼터 또는 튜브라인브리지 동쪽 점검원에게 가면 포획·성장·귀환을 함께 확인할 수 있어.'],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'쌍용 서문 쉼터',action:()=>{if(current())g.setTourDestination('tour_unova_route_09','tourRouteNineRest');}},{label:'튜브라인브리지',action:()=>{if(current())g.setTourDestination('tour_tubeline_bridge','tourGuide');}},{label:'계속 걷기',action:()=>{}}]);return true;
  }
  if(trainer.id===ROUTE_TWELVE_TRAINER&&g.save.flags[trainerWinFlag(trainer.id)]&&g.save.flags[ROUTE_TWELVE_JOURNEY.participated]===true&&!routeTwelveRetry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle,f=ROUTE_TWELVE_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined,start=Number(save.flags[f.level]??0),recorded=SPECIES[Number(save.flags[f.partner]??0)]?.name??'12번도로 동료';
    const state=partner&&partner.species===save.flags[f.partner]?`${recorded}가 실제 승리에 참가했다.\n출발 Lv.${start} → 현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}`:`${recorded}가 실제 승리에 참가한 기록이 있다. 현재는 PC 또는 다른 편성에 있다.`;
    g.say(trainer.name,['12번도로 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',state,'같은 동료와 보배마을 서쪽 안내원에게 돌아가면 포획·성장·귀환을 함께 기록할 수 있어.'],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'보배마을로 귀환',action:()=>{if(current())g.setTourDestination('tour_lacunosa','tourResident3');}},{label:'계속 걷기',action:()=>{}}]);return true;
  }
  if(trainer.id===ROUTE203_TRAINER&&g.save.flags[trainerWinFlag(trainer.id)]&&g.save.flags[ROUTE203_JOURNEY.participated]===true&&!route203Retry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle,f=ROUTE203_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined,start=Number(save.flags[f.level]??0),recorded=SPECIES[Number(save.flags[f.partner]??0)]?.name??'203번도로 동료';
    const state=partner&&partner.species===save.flags[f.partner]?`${recorded}가 실제 승리에 참가했다.\n출발 Lv.${start} → 현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}`:`${recorded}가 실제 승리에 참가한 기록이 있다. 현재는 PC 또는 다른 편성에 있다.`;
    g.say(trainer.name,['203번도로 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',state,'같은 동료와 축복시티 동문 안내원에게 돌아가면 포획·성장·귀환을 함께 기록할 수 있어.'],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'축복시티로 귀환',action:()=>{if(current())g.setTourDestination('tour_jubilife','jubilifeEastGuide');}},{label:'무쇠게이트로 계속',action:()=>{if(current())g.setTourDestination('tour_oreburgh_gate_1f','oreburghGateSign');}}]);return true;
  }
  if(trainer.id===OREBURGH_GATE_TRAINER&&g.save.flags[trainerWinFlag(trainer.id)]&&g.save.flags[OREBURGH_GATE_JOURNEY.participated]===true&&!oreburghGateRetry()){
    const save=g.save,current=()=>g.save===save&&save.map===trainer.map&&!g.battle,f=OREBURGH_GATE_JOURNEY,slot=save.flags[f.slot],partner=typeof slot==='number'?save.party[slot]:undefined,start=Number(save.flags[f.level]??0),recorded=SPECIES[Number(save.flags[f.partner]??0)]?.name??'무쇠게이트 동료';
    const state=partner&&partner.species===save.flags[f.partner]?`${recorded}가 실제 승리에 참가했다.\n출발 Lv.${start} → 현재 Lv.${partner.level} · HP ${partner.hp}/${partner.maxHp}`:`${recorded}가 실제 승리에 참가한 기록이 있다. 현재는 PC 또는 다른 편성에 있다.`;
    g.say(trainer.name,['무쇠게이트 선택 배틀의 승리 기록이 남아 있어. 상금은 이미 받았어.',state,'같은 동료와 동쪽 무쇠시티 도착 안내원에게 가면 동굴 여행과 성장을 함께 기록할 수 있어.'],undefined,[{label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},{label:'무쇠시티로 이동',action:()=>{if(current())g.setTourDestination('tour_oreburgh','oreburghWestArrivalGuide');}},{label:'203번도로로 귀환',action:()=>{if(current())g.setTourDestination('tour_sinnoh_route_203','route203Sign');}}]);return true;
  }
  if(trainer.id===ROUTE_EIGHT_TRAINER&&g.save.flags[trainerWinFlag(trainer.id)]&&g.save.flags[ROUTE_EIGHT_JOURNEY.participated]===true&&!routeEightRetry()){showIcirrusRouteBattle(g);return true;}
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
  if(trainer.localPages&&g.save.flags[trainerWinFlag(trainer.id)]&&!parkRetry()&&!celesticRetry()&&!eastRetry()&&!southRetry()&&!routeTwelveRetry()&&!routeElevenRetry()&&!routeNineRetry()&&!routeEightRetry()&&!route203Retry()&&!oreburghGateRetry()){g.say(trainer.name,['함께 연습하니 동료들의 장점이 보이네!\n다음 여행에서도 서로 도와주자.',...trainer.localPages.slice(1)]);return true;}
  if(g.save.flags[trainerWinFlag(trainer.id)]&&!parkRetry()&&!celesticRetry()&&!eastRetry()&&!southRetry()&&!routeTwelveRetry()&&!routeElevenRetry()&&!routeNineRetry()&&!routeEightRetry()&&!route203Retry()&&!oreburghGateRetry()){g.say(trainer.name,trainer.lesson?[
    badged?'콜배지 축하해! 함께 연습한 판단을\n다음 여행에서도 살려 봐.':'좋은 연습이었어! 준비가 되면\n가운데 길로 강석에게 가 봐.',...gymLesson(trainer.lesson)
  ]:trainer.map==='route_s01'?[`좋은 연습이었어! ${roadGuidance()[0]}`,`${roadGuidance()[1]}\n센터와 상점에서 준비하고 가.`]:['좋은 연습이었어! 동료마다 잘하는\n기술을 살려 다음 도전도 힘내 봐.','바위와 동굴의 포켓몬은 약점도 달라.\n배운 기술 중 무엇을 쓸지 살펴봐.']);return true;}
  const needsDeparture=trainer.map!=='tour_route_34'&&trainer.id!=='violet-tower-practice';
  if((needsDeparture&&!g.save.flags.departureCleared)||!g.save.party.some(p=>p.hp>0)){g.say(trainer.name,[needsDeparture?'건강한 파트너와 출발 준비를 마치면\n짧은 연습 배틀을 해 보자.':trainer.id==='violet-tower-practice'?'도라지센터에서 동료를 회복하거나 편성한 뒤\n2층 수련 자리로 돌아오면 겨뤄 보자.':'건강한 동료와 함께 돌아오면\n34번도로에서 겨뤄 보자.']);return true;}
  const save=g.save;
  const current=()=>g.save===save&&save.map===trainer.map&&!g.battle&&(!save.flags[trainerWinFlag(trainer.id)]||parkRetry()||celesticRetry()||eastRetry()||southRetry()||routeTwelveRetry()||routeElevenRetry()||routeNineRetry()||routeEightRetry()||route203Retry()||oreburghGateRetry());
  const startBattle=()=>{
    if(!current()||!save.party.some(mon=>mon.hp>0))return;
    prepareRoute43PartnerBattle(save,trainer.id);
    prepareJohtoEastPartnerBattle(save,trainer.id);
    prepareJohtoSouthPartnerBattle(save,trainer.id);
    prepareRouteTwelvePartnerBattle(save,trainer.id);
    prepareRouteElevenPartnerBattle(save,trainer.id);
    prepareRouteNinePartnerBattle(save,trainer.id);
    prepareRouteEightPartnerBattle(save,trainer.id);
    prepareRoute203PartnerBattle(save,trainer.id);
    prepareOreburghGatePartnerBattle(save,trainer.id);
    const team:Pokemon[]=trainer.team.map(([species,level])=>{
      const maxHp=maxHpAtLevel(species,level);
      const mon:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'연습 배틀'};
      mon.moves=pokemonMoves(mon);return mon;
    });
    g.battle=createTrainerBattle(save,{...trainer,reward:save.flags[trainerWinFlag(trainer.id)]?0:trainer.reward,team});
    if(g.battle){g.persist();g.say(trainer.name,[trainer.battlePage??`좋아! ${SPECIES[team[0].species].name},\n같이 연습해 보자!`]);}
  };
  if(trainer.id===ROUTE_EIGHT_TRAINER){showIcirrusRouteBattle(g,startBattle);return true;}
  if(trainer.localPages){
    g.say(trainer.name,[trainer.localPages[0],trainer.team.map(([id,level])=>`${SPECIES[id].name} Lv.${level}`).join(' / ')+(save.flags[trainerWinFlag(trainer.id)]?'\n상금 없는 재확인전이야.':`\n이기면 ${trainer.reward}원을 줄게.`)],undefined,[
      {label:'배틀한다',action:startBattle},
      {label:'출전 동료를 고른다',action:()=>showTrainerPreparation(g,current,startBattle)},
      {label:'준비 이야기를 듣는다',action:()=>{if(current())g.say(trainer.name,trainer.localPages!.slice(1));}},
      {label:'다음에 한다',action:()=>{}}
    ]);return true;
  }
  g.say(trainer.name,[trainer.lesson?(badged?'콜배지 축하해! 다음 여행 전에\n함께 연습 배틀을 해 볼까?':'관장전 전에 연습 배틀을 해 볼까?\n바로 강석에게 도전해도 괜찮아.'):'길에서 만난 트레이너끼리\n짧게 연습 배틀을 해 볼까?',...(trainer.map==='route_s01'?roadGuidance():[]),trainer.team.map(([id,level])=>`${SPECIES[id].name} Lv.${level}`).join(' / ')+(save.flags[trainerWinFlag(trainer.id)]?'\n상금 없는 재확인전이야.':`\n이기면 ${trainer.reward}원을 줄게.`)],undefined,[
    {label:'배틀한다',action:startBattle},
      {label:'출전 동료를 고른다',action:()=>showTrainerPreparation(g,current,startBattle)},
    {label:'도움말을 듣는다',action:()=>{if(current())g.say(trainer.name,trainer.lesson?gymLesson(trainer.lesson):trainer.map==='route_s01'?[...roadGuidance(),'풀밭에서 새 동료를 만나고\n센터에서 회복한 뒤 도전해 봐.','기술을 바꾸려면 X → 포켓몬 →\n정보 화면의 기술 배우기를 선택해.']:[ '남쪽 자갈밭에서 동료를 만나 봐.\n밝은 통로는 조우를 피하는 길이야.', '센터에서 회복한 뒤 도전해 봐.','기술을 바꾸려면 X → 포켓몬 →\n정보 화면의 기술 배우기를 선택해.']);}},
    {label:'다음에 한다',action:()=>{}}
  ]);return true;
}
