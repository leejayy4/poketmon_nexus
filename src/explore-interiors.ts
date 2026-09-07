import type { Place } from './explore-world';
import type { Point } from './types';

export type FurnishingKind = 'console'|'camera'|'shelf'|'mineral'|'fossil'|'tank'|'plants'|'model'|'altar'|'bell'|'memorial'|'stage'|'workbench'|'machine'|'chart'|'bench'|'healer';
export type RoomStyle = 'studio'|'museum'|'garden'|'shrine'|'stage'|'shop'|'terminal'|'lab'|'school'|'workshop'|'gallery'|'dojo'|'center';
type Exhibit = [FurnishingKind, string, string];
export interface Furnishing extends Point { w:number; h:number; kind:FurnishingKind; name:string; pages:string[]; event:string }
export interface TourInterior { style:RoomStyle; title:string; objects:Furnishing[]; host:Point; reception?:Point & {w:number;h:number}; greeting:string[] }
interface Collection { style:RoomStyle; exhibits:[Exhibit,Exhibit,Exhibit] }
const exhibit=(kind:FurnishingKind,name:string,text:string):Exhibit=>[kind,name,text];
// Facility names and exhibits are authored for the compressed tour, not story rewards.
const collections:Record<string,Collection>={
  jubilife:{style:'studio',exhibits:[exhibit('console','방송 조정석','화면에 마을 풍경이 비친다.\n작은 조절 손잡이가 줄지어 있다.'),exhibit('camera','스튜디오 카메라','광장을 소개하는 방송 세트다.\n카메라 앞에 빈 인터뷰 자리가 있다.'),exhibit('shelf','방송 자료실','여행과 포켓몬 생활을 다룬\n방송 기록이 날짜별로 꽂혀 있다.')]},
  oreburgh:{style:'museum',exhibits:[exhibit('mineral','광석 표본','반짝이는 광물과 검은 석탄이\n채굴한 깊이에 따라 놓여 있다.'),exhibit('model','탄광 모형','작은 광차가 레일 위에 있다.\n갱도와 운반 길을 한눈에 볼 수 있다.'),exhibit('workbench','광부의 도구','곡괭이와 작업등에\n오랫동안 사용한 흔적이 남아 있다.')]},
  eterna:{style:'shrine',exhibits:[exhibit('altar','오래된 석상','바람에 닳은 석상을 옮겨 놓았다.\n받침에 오래된 문양이 남아 있다.'),exhibit('chart','옛 도시 지도','숲과 사원을 중심으로 자란\n영원시티의 옛 모습이 그려져 있다.'),exhibit('plants','이끼 정원','축축한 돌 사이로 이끼가 자란다.\n오래된 숲 냄새가 난다.')]},
  hearthome:{style:'stage',exhibits:[exhibit('stage','콘테스트 무대','분홍 커튼 아래 작은 무대다.\n리본 장식이 조명을 받아 반짝인다.'),exhibit('shelf','리본 전시대','색과 모양이 다른 리본을\n유리 안에 가지런히 전시했다.'),exhibit('console','무대 조명석','빛의 색을 표시한 조절판이다.\n지금은 견학용 화면이 켜져 있다.')]},
  veilstone:{style:'shop',exhibits:[exhibit('shelf','여행용품 진열대','가방과 물통, 접이식 지도가 있다.\n탐방 전시품이라 구매할 수는 없다.'),exhibit('shelf','인형 코너','포켓몬 모양의 인형들이\n크기 순서대로 앉아 있다.'),exhibit('chart','층별 안내판','백화점의 층별 안내 그림이다.\n탐방에서는 이 전시층을 둘러본다.')]},
  pastoria:{style:'garden',exhibits:[exhibit('tank','습지 단면 수조','갈대 뿌리 아래의 물길까지\n투명한 유리 너머로 보인다.'),exhibit('plants','갈대 표본','물가에 자라는 풀을 모아 놓았다.\n잎 끝에 작은 물방울이 맺혀 있다.'),exhibit('chart','습지 관찰 지도','나무 데크와 관찰 지점이\n지도에 표시되어 있다.')]},
  canalave:{style:'terminal',exhibits:[exhibit('model','운하 선박 모형','화물선과 여객선 모형이 있다.\n배마다 갑판의 모양이 다르다.'),exhibit('chart','지방 항로도','갈색시티와 기하시티로 잇는\n탐방 항로가 그려져 있다.'),exhibit('workbench','항만 작업대','굵은 밧줄과 신호 깃발이다.\n매듭 묶는 법도 붙어 있다.')]},
  snowpoint:{style:'shrine',exhibits:[exhibit('altar','얼음 석상','푸른 얼음 속에 돌기둥이 있다.\n표면에 눈 결정이 붙어 있다.'),exhibit('chart','신전 문양','눈꽃과 돌기둥을 그린 문양이다.\n작은 탁본이 옆에 놓여 있다.'),exhibit('mineral','얼음 결정','빛을 받으면 하얗게 빛나는\n결정을 차가운 상자에 보관했다.')]},
  sunyshore:{style:'terminal',exhibits:[exhibit('machine','등대 렌즈','두꺼운 렌즈와 반사판이다.\n멀리 빛을 보내는 구조가 보인다.'),exhibit('model','태양광 설비 모형','해안 산책로 위에 설치한\n태양광 판의 모형이다.'),exhibit('chart','해안 안내도','등대와 바닷가를 잇는\n산책 지점이 표시되어 있다.')]},
  lake:{style:'garden',exhibits:[exhibit('tank','호수 관찰 수조','잔잔한 물 아래 자갈과 수초가\n층층이 놓여 있다.'),exhibit('chart','호숫가 스케치','작은 섬과 나무 그림자가\n수면에 비친 모습을 그렸다.'),exhibit('bench','호수 쉼터 의자','창으로 호수를 보며 쉬는 자리다.\n방석이 햇볕에 따뜻해져 있다.')]},
  vermilion:{style:'terminal',exhibits:[exhibit('model','여객선 모형','주황색 굴뚝을 단 여객선이다.\n갑판의 작은 의자까지 만들었다.'),exhibit('chart','여객 항로도','운하시티로 향하는 탐방 항로가\n푸른 선으로 표시되어 있다.'),exhibit('bench','대합실 의자','여행 가방을 놓을 공간이 있는\n긴 대합실 의자다.')]},
  pallet:{style:'lab',exhibits:[exhibit('machine','관찰 장치','표본을 확대해 보는 장치다.\n렌즈 옆에 관찰 노트가 있다.'),exhibit('shelf','생태 연구 서가','포켓몬의 생활 환경을 기록한\n책과 노트가 꽂혀 있다.'),exhibit('plants','연구용 화분','작은 새싹 옆에 성장 날짜를\n적은 팻말이 꽂혀 있다.')]},
  viridian:{style:'garden',exhibits:[exhibit('plants','상록수 묘목','사계절 푸른 잎을 유지하는\n나무의 어린 묘목이다.'),exhibit('chart','숲 산책 지도','회색시티 방향의 짧은 숲길과\n쉼터가 표시되어 있다.'),exhibit('shelf','숲 관찰 수첩','잎과 발자국을 그린\n관찰 수첩이 정리되어 있다.')]},
  pewter:{style:'museum',exhibits:[exhibit('fossil','화석 전시대','돌 속에 남은 나선 모양 흔적이다.\n옆에는 발견 지층 그림이 있다.'),exhibit('mineral','지층 표본','서로 다른 색의 돌을\n층별로 비교할 수 있다.'),exhibit('workbench','화석 정리 도구','작은 솔과 확대경이 놓여 있다.\n표면의 흙을 조심히 털어 낸다.')]},
  cerulean:{style:'garden',exhibits:[exhibit('tank','푸른 수족관','수초 사이로 공기 방울이 오른다.\n푸른 조명이 물결처럼 일렁인다.'),exhibit('tank','하천 단면 수조','모래와 자갈 사이로 흐르는\n작은 물길을 재현했다.'),exhibit('chart','수로 지도','도시를 지나는 수로와 분수의\n위치를 한눈에 볼 수 있다.')]},
  celadon:{style:'shop',exhibits:[exhibit('plants','꽃집 코너','여러 색의 꽃이 바구니에 담겼다.\n달콤한 꽃향기가 난다.'),exhibit('shelf','정원용품 진열대','작은 물뿌리개와 화분이 있다.\n탐방 전시품이라 구매할 수는 없다.'),exhibit('shelf','선물 코너','리본을 묶은 선물 상자들이\n색깔별로 정리되어 있다.')]},
  saffron:{style:'lab',exhibits:[exhibit('console','제품 시연 단말','기술 제품의 구조를 보여 주는\n견학용 화면이 켜져 있다.'),exhibit('machine','개발 장치','작은 부품과 센서가 연결되어 있다.\n투명 덮개 안에서 불빛이 깜빡인다.'),exhibit('chart','건물 안내도','사옥의 부서와 로비 위치를\n그림으로 안내하고 있다.')]},
  lavender:{style:'shrine',exhibits:[exhibit('memorial','추모비','소중한 친구들을 기억하는 자리다.\n앞에 작은 꽃다발이 놓여 있다.'),exhibit('bell','위령의 종','손때 묻은 작은 종이다.\n조용한 실내에 바람이 스쳐 간다.'),exhibit('plants','추모의 꽃','보라색과 하얀 꽃들이\n단정하게 꽂혀 있다.')]},
  fuchsia:{style:'garden',exhibits:[exhibit('model','보호구역 모형','연못과 풀밭을 나눈 모형이다.\n관찰용 길이 가장자리를 돈다.'),exhibit('plants','서식지 식물','보호구역에서 자라는 풀과\n낮은 관목을 소개하고 있다.'),exhibit('chart','관찰 예절 안내','거리를 두고 조용히 지켜보며\n풀과 나무를 보호해 달라는 안내다.')]},
  cinnabar:{style:'lab',exhibits:[exhibit('mineral','화산암 표본','붉은 암석과 구멍이 많은 돌이다.\n식은 용암의 흔적이 남아 있다.'),exhibit('machine','지열 관측 장치','지면의 온도 변화를 기록하는\n장치의 견학용 모형이다.'),exhibit('chart','화산 단면도','지하에서 바다까지 이어지는\n암반의 층을 그려 놓았다.')]},
  goldenrod:{style:'studio',exhibits:[exhibit('console','라디오 조정석','음량 눈금과 방송 채널을\n표시한 조절판이 놓여 있다.'),exhibit('camera','녹음 부스','방송용 마이크와 방음벽이다.\n책상 위에는 읽을 원고가 있다.'),exhibit('shelf','음반 자료실','방송에 쓰는 음반과 대본을\n날짜별로 정리해 두었다.')]},
  violet:{style:'shrine',exhibits:[exhibit('altar','탑의 중심 기둥','결이 깊은 나무 기둥이다.\n오래된 탑을 지탱한 흔적이 보인다.'),exhibit('chart','새 그림 족자','탑 주변에 모이는 새들을\n긴 두루마리에 그려 놓았다.'),exhibit('bell','작은 풍경','처마에 달았던 작은 풍경이다.\n얇은 금속 조각이 반짝인다.')]},
  azalea:{style:'workshop',exhibits:[exhibit('workbench','규토리 작업대','속을 다듬는 도구와\n반쯤 가공한 규토리가 있다.'),exhibit('shelf','규토리 보관함','색이 다른 규토리를\n작은 칸마다 나누어 담았다.'),exhibit('plants','규토리 묘목','둥근 열매를 맺는 묘목이다.\n잎 아래 작은 열매가 숨어 있다.')]},
  ecruteak:{style:'shrine',exhibits:[exhibit('bell','방울 전시대','서로 다른 크기의 방울이다.\n탑에 달았던 끈도 함께 전시했다.'),exhibit('altar','목조 탑 모형','층층이 겹친 지붕을 받치는\n목조 짜임이 정교하다.'),exhibit('chart','옛 거리 족자','탑과 목조 집들이 늘어선\n인주시티의 거리를 그렸다.')]},
  mahogany:{style:'workshop',exhibits:[exhibit('chart','산길 안내도','산기슭과 분노의호수를 잇는\n탐방 길이 표시되어 있다.'),exhibit('workbench','산행 준비대','밧줄과 튼튼한 장갑이 있다.\n사용법을 그린 그림이 붙어 있다.'),exhibit('shelf','산마을 특산품','나무로 만든 작은 소품들이\n갈색 상자에 담겨 있다.')]},
  rage_lake:{style:'garden',exhibits:[exhibit('tank','호수 수초 수조','길고 가는 수초가\n잔물결에 따라 흔들린다.'),exhibit('chart','붉은 단풍 기록','호숫가 단풍을 시기별로 그렸다.\n가을 칸이 유난히 붉다.'),exhibit('bench','관찰 벤치','호수를 향해 놓인 의자다.\n옆에 작은 쌍안경이 있다.')]},
  olivine:{style:'terminal',exhibits:[exhibit('machine','항로 등불','먼바다에 신호를 보내던 등불이다.\n큰 렌즈가 빛을 한곳에 모은다.'),exhibit('chart','항구 연결도','구름시티로 이어지는 탐방 항로와\n진청 방향의 길을 안내한다.'),exhibit('model','등대 모형','줄무늬 탑 꼭대기에\n작은 전망 창이 있다.')]},
  cianwood:{style:'dojo',exhibits:[exhibit('stage','수련 마루','바닷바람이 드는 나무 마루다.\n도복과 수건이 단정히 놓여 있다.'),exhibit('mineral','수련용 바위','둥글게 닳은 해변 바위다.\n밀리지 않게 받침으로 고정했다.'),exhibit('chart','호흡법 족자','자세를 가다듬고 천천히 호흡하는\n방법을 그림으로 안내한다.')]},
  blackthorn:{style:'shrine',exhibits:[exhibit('altar','용의 석상','굽이친 몸과 뿔 모양의 문양이다.\n푸른 돌에 깊게 새겨져 있다.'),exhibit('chart','사당 벽화','물과 산 사이를 나는 용을\n길게 펼친 그림이다.'),exhibit('mineral','푸른 암석','빛의 방향에 따라 푸른 결이\n다르게 보이는 암석이다.')]},
  castelia:{style:'gallery',exhibits:[exhibit('chart','항구의 아침','높은 건물 사이로 배가 들어오는\n구름시티의 아침 풍경화다.'),exhibit('model','도시 조각','빌딩과 부두를 기하학 모양으로\n표현한 작은 조각 작품이다.'),exhibit('bench','감상 의자','벽의 작품을 천천히 감상할 수\n있도록 놓아 둔 의자다.')]},
  aspertia:{style:'school',exhibits:[exhibit('chart','교실 칠판','지도 읽는 법과 포켓몬을\n관찰할 때의 예절이 적혀 있다.'),exhibit('shelf','학교 도서 코너','초보 여행자를 위한\n그림책과 지도책이 있다.'),exhibit('workbench','학생 책상','공책 위에 마을의 전망 언덕을\n그린 그림이 펼쳐져 있다.')]},
  virbank:{style:'workshop',exhibits:[exhibit('machine','생산 설비 모형','톱니와 배관의 연결을 보여 주는\n전시용 설비다.'),exhibit('workbench','정비 작업대','크기가 다른 공구를\n모양에 맞춰 걸어 놓았다.'),exhibit('chart','공장 공정도','재료가 들어와 가공되고\n부두로 나가는 순서를 그렸다.')]},
  nimbasa:{style:'stage',exhibits:[exhibit('model','관람차 모형','색색의 작은 객실이\n커다란 바퀴를 둘러싸고 있다.'),exhibit('console','조명 전시대','놀이 광장을 밝히는 전구들이\n색깔별로 연결되어 있다.'),exhibit('chart','놀이공원 안내도','관람차와 광장, 쉼터를 표시한\n알록달록한 지도다.')]},
  driftveil:{style:'shop',exhibits:[exhibit('shelf','시장 가판대','나무 상자에 열매와\n포장된 특산품이 놓여 있다.'),exhibit('mineral','광물 견본','부두에서 운반하는 광물의\n견본을 비교할 수 있다.'),exhibit('workbench','선적 저울','화물을 달던 튼튼한 저울이다.\n무게별 추도 옆에 놓여 있다.')]},
  mistralton:{style:'terminal',exhibits:[exhibit('model','비행기 모형','긴 날개 아래 작은 바퀴가 있다.\n화물칸 문이 열려 있다.'),exhibit('console','운항 안내 단말','활주로와 화물 창고를 소개하는\n견학용 화면이다.'),exhibit('bench','출발 대합실','큰 창 옆에 줄지어 놓인 의자다.\n활주로 표시가 창에 비친다.')]},
  opelucid:{style:'museum',exhibits:[exhibit('altar','용 문양 기둥','푸른 돌기둥에 용이 새겨져 있다.\n도시의 광장 문양과 닮았다.'),exhibit('chart','도시의 변천','오래된 돌집과 새로운 건물을\n나란히 그린 전시물이다.'),exhibit('shelf','역사 기록','건축과 전승을 기록한\n책들이 시대별로 꽂혀 있다.')]},
  humilau:{style:'garden',exhibits:[exhibit('tank','얕은 바다 수조','밝은 모래와 산호 모형 사이로\n맑은 물이 흐른다.'),exhibit('chart','수상 마을 지도','집과 집을 잇는 나무 데크와\n운하시티 연결편을 안내한다.'),exhibit('model','해변 집 모형','물 위에 기둥을 세워 만든 집이다.\n작은 계단이 데크로 이어진다.')]},
  dragonspiral:{style:'shrine',exhibits:[exhibit('altar','나선 탑 모형','돌층이 빙글빙글 이어지는\n탑의 구조를 재현했다.'),exhibit('chart','유적 탁본','닳은 벽면의 문양을\n종이에 옮겨 놓았다.'),exhibit('mineral','탑의 석재','오래된 돌에 이끼가 남아 있다.\n쌓은 방향을 표시한 선이 보인다.')]},
};

export function createTourInterior(p:Place,center:boolean):TourInterior {
  const collection:Collection=center?{style:'center',exhibits:[
    exhibit('healer','회복 장치','몬스터볼을 올리는 홈이 있는\n포켓몬센터의 회복 장치다.'),
    exhibit('console','센터 안내 단말',p.name+'의 안내 화면이다.\n주변 장소와 쉼터를 소개한다.'),
    exhibit('bench','대기 의자','여행자가 잠시 쉬어 가는 자리다.\n옆에 여행 안내 책자가 있다.'),
  ]}:collections[p.id.slice(5)];
  if(!collection)throw Error('Missing tour interior: '+p.id);
  const positions=center?[{x:3,y:4,w:2,h:2},{x:11,y:4,w:2,h:2},{x:3,y:8,w:3,h:2}]
    :collection.style==='stage'?[{x:4,y:4,w:4,h:2},{x:10,y:4,w:3,h:2},{x:4,y:8,w:2,h:2}]
    :collection.style==='shrine'?[{x:6,y:4,w:3,h:2},{x:11,y:4,w:2,h:2},{x:3,y:8,w:2,h:2}]
    :[{x:3,y:4,w:3,h:2},{x:10,y:4,w:3,h:2},{x:3,y:8,w:3,h:2}];
  const title=center?'포켓몬센터':p.landmark;
  return {style:collection.style,title,host:center?{x:8,y:5}:{x:10,y:8},...(center?{reception:{x:6,y:6,w:4,h:1}}:{}),objects:collection.exhibits.map(([kind,name,text],i)=>({...positions[i],kind,name,pages:[text],event:'tourExhibit'+i})),greeting:[p.name+'의 '+title+'입니다.',center?'어서 오세요! 편하게 쉬어 가세요.\n장치와 안내 PC도 살펴보세요.':'전시물 앞에서 Z 또는 Enter로\n안내 글을 읽어 보세요.']};
}
