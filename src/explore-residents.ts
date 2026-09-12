import type { NPC } from './types';

export interface TourResident extends NPC { pages:string[] }
type ResidentLine=[name:string,sprite:string,text:string];
// Local life in the exploration prototype; no quests or rewards.
const residents:Record<string,[ResidentLine,ResidentLine]>={
  tour_jubilife:[['광장 주민','middle_aged_man','분수 앞에서 잠깐 쉬는 중이야.\n방송국 시계를 보면 시간을 알 수 있지.'],['방송국 직원','ace_trainer_f','카메라 앞에 서면 괜히 긴장돼요.\n오늘은 광장 풍경을 담고 싶네요.']],
  tour_oreburgh:[['광부','worker','돌마다 색과 무게가 다르지.\n쉬는 날에도 반짝이는 돌이 눈에 들어와.'],['전시관 학생','school_kid_m','광차 모형을 보러 왔어요.\n바퀴가 어떻게 움직이는지 궁금해요.']],
  tour_eterna:[['정원 주민','old_man','오래된 석상 곁에도 새잎이 돋지.\n같은 길을 걸어도 볼 것이 달라진단다.'],['역사관 방문객','school_kid_f','석상 문양을 공책에 그렸어요.\n역사관 안의 전시와 비교해 볼래요.']],
  tour_hearthome:[['꽃을 돌보는 주민','pokemon_breeder_f','꽃 색을 섞어 심으면 더 환해져요.\n산책하는 분들이 웃으면 저도 기뻐요.'],['공연 연습생','lass','무대에 서기 전에 깊게 숨을 쉬어.\n오늘은 리본을 매는 연습부터 할래.']],
  tour_veilstone:[['광장 산책객','ace_trainer_m','계단식 광장을 천천히 돌아봤어.\n높이가 달라지니 건물도 다르게 보여.'],['백화점 직원','middle_aged_man','진열대를 보기 좋게 정리했어요.\n색을 맞추는 데 시간이 꽤 걸렸죠.']],
  tour_pastoria:[['습지 관찰자','rancher','물가에서는 조용히 기다려 봐.\n물결 사이로 작은 움직임이 보일 거야.'],['관찰소 학생','school_kid_f','젖은 나무 데크는 천천히 걸어요.\n물에 비친 하늘을 그리고 있답니다.']],
  tour_canalave:[['부두 작업자','worker','창고 일을 마치고 바람을 쐬는 중이야.\n운하를 따라 보면 부두가 한눈에 보여.'],['항구 여행객','ace_trainer_f','다른 지방으로 이어지는 길이 있네요.\n떠나기 전에 운하를 한 번 더 볼래요.']],
  tour_snowpoint:[['눈길 주민','rancher','눈 위 발자국은 금방 새로 덮이지.\n집 지붕을 보며 길을 기억해 두렴.'],['신전 방문객','lass','차가운 공기 속에서는 소리도 또렷해.\n신전 앞에선 발걸음도 조용해지네.']],
  tour_lake:[['호수 관찰자','scientist_f','이곳은 신오 세 호수를 한곳으로 부르는 장소가 아니에요.\n여러 물가의 흔적을 비교하는 관찰 거점이랍니다.'],['설원길 여행자','ace_trainer_f','북쪽 길은 선단으로 이어지지만 216번도로와 217번도로 전체를 옮긴 길은 아니에요.\n찬바람에 대비하고 출발해야겠어요.']],
  tour_sunyshore:[['해안 주민','middle_aged_man','바다를 보면 햇빛이 잘게 부서져.\n같은 자리에서도 빛깔이 계속 달라져.'],['등대 관찰자','scientist_f','태양광 설비와 등대를 살펴봤어요.\n빛으로 길을 알려 준다는 게 멋져요.']],
  tour_vermilion:[['부두 일꾼','worker','지붕 색이 바닷빛과 잘 어울리지?\n일을 마치면 이 길로 한 바퀴 돌아.'],['터미널 여행객','ace_trainer_m','터미널에선 여행 기분이 더 나네.\n이번에는 천천히 마을을 돌아볼래.']],
  tour_pallet:[['마을 주민','pokemon_breeder_f','바닷바람이 빨래를 말려 줘요.\n작은 마을이라 이웃 얼굴도 익숙하죠.'],['연구소 학생','school_kid_m','연구소에 있는 도구를 구경했어요.\n모르는 게 많아서 공책이 꽉 찼어요.']],
  tour_viridian:[['나무를 돌보는 주민','rancher','늘 푸른 나무라도 새잎은 다르지.\n가지 끝의 밝은 색을 찾아보렴.'],['숲길 산책객','lass','울타리를 따라 걸으면 마음이 편해.\n숲에 가기 전에 여기서 잠깐 쉴래.']],
  tour_pewter:[['석재 작업자','worker','잘 다듬은 돌은 손끝 느낌이 달라.\n이 마을의 회색빛이 나는 좋더라.'],['화석 관람객','school_kid_f','화석 모양을 자세히 보고 왔어요.\n작은 무늬에도 이야기가 있는 것 같아요.']],
  tour_cerulean:[['물가 주민','pokemon_breeder_f','분수 소리를 들으면 더위가 가셔요.\n물에 비친 집들도 구경해 보세요.'],['수족관 학생','school_kid_m','수족관 수조를 한참 보고 있었어요.\n물속에서는 빛이 흔들려 보이더라고요.']],
  tour_celadon:[['정원사','ace_trainer_f','꽃은 가까이서도 멀리서도 봐 주세요.\n정원 전체의 색도 신경 써서 심었어요.'],['백화점 손님','old_man','구경을 마치면 정원에서 쉬곤 해.\n오늘 마음에 든 건 이 꽃향기란다.']],
  tour_saffron:[['거리 직장인','middle_aged_man','빌딩 사이로 보이는 하늘도 좋지.\n점심 뒤에는 광장을 한 바퀴 돌아.'],['기술 연구원','scientist_f','실프 사옥 전시를 정리하고 나왔어요.\n작은 장치 하나에도 생각이 담겨 있죠.']],
  tour_lavender:[['정원을 돌보는 주민','pokemon_breeder_f','꽃을 고르고 조용히 물을 주고 있어요.\n누군가를 떠올리며 쉬어 가도 좋아요.'],['탑 방문객','old_man','탑을 둘러보고 바람을 쐬는 중이란다.\n말없이 함께 걷는 것도 위로가 되지.']],
  tour_fuchsia:[['보호구역 관찰자','rancher','연못 주변에서는 발소리를 낮춰 봐.\n한 자리에서 바라보는 재미도 있지.'],['안내소 방문객','school_kid_f','관찰한 풍경을 작은 그림으로 남겨요.\n안내소에서 본 표본도 그려 봤어요.']],
  tour_cinnabar:[['암석 연구원','scientist_f','붉은 암석의 결을 살펴보는 중이에요.\n바닷가 돌과 나란히 비교해 봤죠.'],['섬 주민','middle_aged_man','바닷바람을 맞으면 기분이 풀리지.\n연구소까지 천천히 걸어가 보게.']],
  tour_goldenrod:[['시장 주민','middle_aged_man','광장에서는 서로 안부부터 묻지.\n바쁜 도시라도 인사는 빼놓지 않아.'],['라디오 청취자','lass','목소리만 듣고 장면을 상상해 봐.\n라디오에는 그런 재미가 있더라.']],
  tour_violet:[['탑 앞 주민','old_man','지붕 위에 새가 쉬었다 가곤 해.\n고개를 들어 처마도 살펴보렴.'],['탑 견학생','school_kid_m','나무 기둥의 무늬가 모두 달라요.\n천천히 보니 작은 차이가 보이네요.']],
  tour_azalea:[['공방 장인','worker','손으로 다듬은 물건은 하나씩 달라.\n규토리도 모양부터 살펴보곤 하지.'],['우물가 주민','pokemon_breeder_f','공방에서 나는 나무 향이 좋아요.\n볼일을 마치고 우물가에서 쉬어요.']],
  tour_ecruteak:[['목조 거리 주민','old_man','오래된 나무에는 손길이 남아 있지.\n잘 돌보면 다음 사람도 쓸 수 있단다.'],['탑 산책객','ace_trainer_f','지붕 선을 따라 하늘을 봤어요.\n탑을 둘러보고 정원도 걸어 보려고요.']],
  tour_mahogany:[['산기슭 주민','rancher','산바람은 골목마다 느낌이 달라.\n장터에서 쉬며 바람을 피해 가렴.'],['산길 여행객','ace_trainer_m','산길 안내소에서 지도를 보고 왔어.\n떠나기 전에 신발 끈부터 묶어야지.']],
  tour_olivine:[['항구 작업자','worker','멀리서도 등대가 보여 든든하지.\n창고 일을 마치면 부두를 둘러봐.'],['등대 방문객','lass','바다 쪽에서 등대를 올려다봤어.\n다른 지방으로 가기 전에 기억해 둘래.']],
  tour_cianwood:[['해변 산책객','rancher','파도 소리에 맞춰 천천히 걸어 봐.\n모래와 바위의 빛깔도 다르단다.'],['도장 수련생','ace_trainer_m','몸을 움직인 뒤에는 숨을 고르고 쉬어.\n오늘은 바다를 보며 어깨를 풀고 있어.']],
  tour_blackthorn:[['암반 관찰자','scientist_f','푸른 암반의 줄무늬를 보고 있어요.\n빛이 드는 쪽에서 더 잘 보이네요.'],['사당 주민','old_man','용 문양은 가까이서 천천히 보렴.\n사당 안과 밖의 무늬를 비교해 보게.']],
  tour_castelia:[['해안 직장인','middle_aged_man','빌딩에서 나와 바다를 보면 시원해.\n쉬는 시간엔 산책로를 꼭 걷지.'],['갤러리 관람객','ace_trainer_f','항구 그림을 보고 밖으로 나왔어요.\n같은 풍경을 제 눈으로 보고 싶어서요.']],
  tour_aspertia:[['언덕 주민','pokemon_breeder_f','언덕에서 보면 지붕들이 작아 보여요.\n산책을 마치면 학교 앞을 지나가죠.'],['학교 학생','school_kid_m','운동장을 달리고 잠깐 쉬고 있어요.\n학교 안의 게시판도 구경해 보세요.']],
  tour_virbank:[['공장 작업자','worker','도구를 제자리에 두고 나왔어.\n정리까지 마쳐야 오늘 일이 끝나지.'],['견학 온 학생','school_kid_f','공장 모형에서 연결된 길을 봤어요.\n재료가 어디로 가는지 따라가 봤죠.']],
  tour_nimbasa:[['놀이 광장 주민','lass','관람차를 올려다보면 설레곤 해.\n오늘은 광장에서 천천히 놀다 갈래.'],['안내소 직원','ace_trainer_m','친구와 헤어지면 만날 곳을 정해 둬.\n눈에 띄는 건물이 있으면 편하거든.']],
  tour_driftveil:[['화물 작업자','worker','창고마다 물건을 구분해 두지.\n정리가 잘되면 일도 덜 헷갈려.'],['시장 손님','pokemon_breeder_f','장터를 구경하면 시간이 금방 가요.\n이번에는 부두 쪽도 돌아볼 거예요.']],
  tour_mistralton:[['화물 담당자','worker','화물 표시는 멀리서도 읽혀야 해.\n작은 글씨 하나도 다시 확인하지.'],['공항 방문객','school_kid_f','터미널의 비행기 모형을 보고 왔어요.\n날개 모양을 공책에 그려 뒀답니다.']],
  tour_opelucid:[['광장 주민','old_man','돌기둥 문양은 오래 보아도 재미있지.\n서 있는 자리마다 모양이 달라 보여.'],['역사관 연구원','scientist_f','용 문양을 모아 비교하고 있어요.\n닮은 부분과 다른 부분을 찾아보세요.']],
  tour_humilau:[['해변 주민','rancher','나무 데크 아래 물소리를 들어 봐.\n바다 가까이 사는 즐거움 중 하나지.'],['해양 관찰자','school_kid_m','바다 색을 하나로 칠하면 아쉬워요.\n깊은 곳과 얕은 곳의 색이 다르네요.']],
};

export function createTourResidents(id:string):TourResident[]{
  if(id==='tour_canalave')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'부두 작업자',sprite:'worker',x:43,y:29,facing:'down',pages:['작업 포켓몬과 신호를 맞추며 화물 간격을 확인하고 있어.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'항구 여행객',sprite:'ace_trainer_f',x:18,y:30,facing:'right',pages:['서부 연구길과 일반 지방 연결, 조사선 안내를 따로 확인하고 있어요.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'운하 수위 기록원',sprite:'scientist_f',x:45,y:42,facing:'up',pages:['도개 수로의 높이와 작업 시간을 함께 적어요.','포켓몬이 젖은 바닥에서 오래 일하지 않도록 교대 시간도 기록합니다.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'동료 휴게 관리인',sprite:'pokemon_breeder_f',x:18,y:49,facing:'left',pages:['작업을 마친 포켓몬에게 먼저 물을 주고 발과 털을 살펴요.','힘이 남아 보여도 정해 둔 휴식은 건너뛰지 않아요.']},
    {id:'tourResident4',dialogue:'tourResident4',name:'표찰을 정리하는 알통몬',sprite:'field-machop',x:45,y:31,facing:'down',pages:['알통! 화물 표찰의 색을 확인하고 빈 운반함 옆에서 작업자 신호를 기다린다.','화물을 직접 옮기는 조우·포획 대상이 아니라 항만에서 주민과 생활하는 동료다.']},
  ];
  if(id==='tour_lentimas')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'착륙장 정비사',sprite:'worker',x:16,y:29,facing:'left',pages:['화산재가 바퀴와 날개 틈에 끼지 않았는지 먼저 살펴요.','사람과 포켓몬 모두 재를 털고 물을 마신 뒤 마을로 들어갑니다.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'재바람 돌봄이',sprite:'pokemon_breeder_f',x:13,y:12,facing:'right',pages:['마른 천으로 눈가와 발부터 조심스럽게 닦아 줘요.','재바람 휴게뜰의 낮은 돌담 뒤에서 쉬면 바람이 한결 약해져요.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'화산 흙 도공',sprite:'middle_aged_man',x:23,y:18,facing:'right',pages:['산의 흙은 색과 입자가 달라서 물을 섞는 양도 달라요.','동쪽 리버스마운틴에 갈 여행자는 뜨거운 지면과 재바람에 대비해야 해요.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'산길 조사원',sprite:'scientist_f',x:32,y:23,facing:'down',pages:['동쪽 표지는 리버스마운틴과 그 너머 물결마을 방향을 가리켜요.','외부와 통과구역 A·B의 귀환 표지를 확인하면 같은 길로 산로마을까지 돌아올 수 있어요.']},
  ];
  if(id==='tour_undella')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'동굴 도착 여행자',sprite:'ace_trainer_f',x:12,y:14,facing:'left',pages:['붉은 동굴을 빠져나오니 바닷바람이 아주 시원해요.','먼저 센터에서 동료의 발과 호흡을 살펴보려고 해요.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'온천수 관찰원',sprite:'scientist_f',x:21,y:12,facing:'left',pages:['산에서 내려온 따뜻한 물이 바닷바람에 천천히 식어요.','관찰지의 물은 회복 시설이 아니니 실제 회복은 센터를 이용해 주세요.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'해풍 정원지기',sprite:'pokemon_breeder_f',x:24,y:20,facing:'up',pages:['동굴을 지나온 포켓몬은 그늘에서 물을 마시며 천천히 쉬어야 해요.','소금기 있는 바람에 민감한 잎과 동료 상태를 함께 살핀답니다.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'동쪽 길 안내원',sprite:'rancher',x:39,y:22,facing:'up',pages:['동쪽은 하나 13번도로와 보배마을 방향이에요.','해안 절벽과 고지 초원을 지나 보배마을 남쪽 성벽 문까지 왕복할 수 있어요.']},
  ];
  if(id==='tour_lacunosa')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'13번도로 도착 주민',sprite:'ace_trainer_f',x:11,y:31,facing:'right',pages:['남쪽 성벽 문은 하나 13번도로와 물결마을로 이어져요.','동료의 발에 모래나 풀이 끼었는지 안뜰에서 먼저 살펴 주세요.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'공동 안뜰 돌봄이',sprite:'pokemon_breeder_f',x:18,y:18,facing:'up',pages:['이웃과 포켓몬이 함께 쉬도록 그늘과 물그릇을 나누어 관리해요.','마을의 오래된 이야기를 사실로 정하지 않고 생활 기록과 구분해 둡니다.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'식재료 건조 관리인',sprite:'rancher',x:31,y:17,facing:'left',pages:['들판 허브와 열매는 사람용과 포켓몬용을 칸으로 나눠 말려요.','바람이 강하면 안뜰 쪽 낮은 선반으로 옮깁니다.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'12번도로 길 안내원',sprite:'middle_aged_man',x:31,y:31,facing:'left',pages:['서쪽은 하나 12번도로와 빌리지브리지 방향이란다.','전원 초원까지 왕복할 수 있지만 빌리지브리지 경계는 아직 연결되지 않았어.']},
  ];
  if(id==='tour_mistralton')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'동굴 도착 여행자',sprite:'ace_trainer_f',x:18,y:48,facing:'left',pages:['전기돌동굴의 푸른빛을 지나오니\n넓은 하늘과 활주로가 먼저 보여요.','센터는 북서쪽, 공항 터미널은 중심가 동쪽이에요.\n남쪽 출구로 돌아가면 동굴 북부 입구입니다.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'활주로 유도원',sprite:'worker',x:40,y:14,facing:'right',pages:['흰 유도선 안쪽은 비행기와 작업 포켓몬의 길이야.','여행자는 울타리 밖 보행로를 따라가 줘.\n동쪽 길과 터미널 입구가 그 길에서 이어져.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'화물 기록원',sprite:'scientist_f',x:43,y:25,facing:'up',pages:['동굴 광물 표본과 농작물 화물이\n서로 섞이지 않도록 목적지를 기록해요.','현재 터미널은 도시 안내와 작업 관찰 공간이에요.\n확인되지 않은 항공편을 예약할 수는 없어요.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'바람쉼터 관리인',sprite:'pokemon_breeder_f',x:57,y:27,facing:'right',pages:['비행을 마친 포켓몬은 바로 다시 날지 않아요.\n날개와 발을 살피고 물부터 마시게 하죠.','남쪽 농로의 낮은 풀은 바람을 막아 주지만\n현재 야생 조우 구역은 아닙니다.']},
  ];
  if(id==='tour_driftveil')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'도개교 도착 여행자',sprite:'ace_trainer_f',x:18,y:48,facing:'left',pages:['물풍경도개교를 건너오니 시장 냄새와 부두 소리가 함께 나네요.','센터는 북서쪽, 시장 건물은 북쪽 중심가에 있어요.\n동쪽은 화물을 나르는 작업 구역이에요.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'시장 배달 상인',sprite:'pokemon_breeder_f',x:20,y:37,facing:'down',pages:['텃밭에서 가져온 물건은 시장 가판대별로 나눠요.','파트너가 바구니를 옮긴 뒤에는\n물그릇과 그늘부터 챙겨 준답니다.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'광물 분류 작업자',sprite:'worker',x:39,y:14,facing:'right',pages:['광석은 색만 보고 섞으면 안 돼.\n무게와 도착지도 함께 확인해야 하지.','북쪽 출구로 나갈 여행자는\n다음 6번도로와 동굴 준비를 시장에서 마쳐 둬.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'부두 기록원',sprite:'scientist_f',x:48,y:30,facing:'up',pages:['사람과 포켓몬이 어느 화물을 옮겼는지 기록하고 있어요.','작업 시간만큼 휴식 시간도 남겨야\n다음 교대가 무리 없이 이어집니다.']},
    {id:'tourResident4',dialogue:'tourResident4',name:'상자를 옮기는 알통몬',sprite:'field-machop',x:55,y:34,facing:'down',pages:['알통!\n표식이 같은 상자 곁에서 다음 지시를 기다린다.','작업자 쪽을 확인한 뒤 팔을 가볍게 푼다.\n교대 휴게원은 바로 남쪽이다.']},
  ];
  if(id==='tour_nimbasa')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'조인애버뉴 여행자',sprite:'ace_trainer_f',x:18,y:47,facing:'left',pages:['남쪽 조인애버뉴를 지나 막 도착했어요.\n4번도로의 모래빛과 이 도시 조명이 아주 다르네요.','센터는 북서쪽, 관람차와 공연 거리는 동쪽이에요.\n먼저 파트너가 쉴 곳부터 찾아보려고요.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'관람차 광장 주민',sprite:'lass',x:40,y:16,facing:'up',pages:['관람차가 한 바퀴 도는 동안\n파트너와 오늘 걸어온 길을 이야기해요.','남쪽 환영 광장까지 불빛이 이어져서\n조인애버뉴에서 온 여행자도 길을 찾기 쉬워요.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'공연 진행요원',sprite:'ace_trainer_m',x:56,y:22,facing:'right',pages:['동쪽 광장은 공연과 경기 관람객이 함께 지나가요.\n파트너와 나란히 걸을 공간을 비워 두고 있죠.','놀이공원 안내소에서 도시 시설을 살핀 뒤\n조명 분수를 약속 장소로 삼아 보세요.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'휴게원 관리인',sprite:'pokemon_breeder_f',x:54,y:31,facing:'right',pages:['응원을 마친 포켓몬이 쉴 수 있도록\n급수대와 그늘을 매일 살펴요.','공연 연습 마당은 남쪽에 있지만\n지나는 여행자의 길을 막지는 않아요.']},
    {id:'tourResident4',dialogue:'tourResident4',name:'조명 점검원',sprite:'worker',x:61,y:38,facing:'down',pages:['해가 지기 전에 꽃길 조명을 하나씩 확인해.\n포켓몬 눈높이의 등은 너무 밝지 않게 맞추지.','서쪽 큰길로 돌아가면 센터와 주택가,\n남쪽으로 가면 조인애버뉴 출구야.']},
  ];
  if(id==='tour_goldenrod')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'남쪽 시장 상인',sprite:'middle_aged_man',x:17,y:52,facing:'left',pages:['34번도로로 떠날 거라면 도시락과 도구를 챙겨.\n센터와 상점은 북쪽 도심에 있어.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'방송 엽서 배달원',sprite:'lass',x:40,y:23,facing:'right',pages:['라디오 타워로 온 여행 엽서를 배달 중이야.\n동료와 만난 장소가 엽서마다 적혀 있어.']},
    {id:'tourResident2',dialogue:'tourResident2',name:'선로를 바라보는 여행자',sprite:'ace_trainer_m',x:43,y:14,facing:'up',pages:['저 선로는 금빛역에서 노랑시티로 이어져.\n열차는 서쪽 역 현관에서 탈 수 있어.']},
    {id:'tourResident3',dialogue:'tourResident3',name:'34번도로 숲지기',sprite:'rancher',x:18,y:63,facing:'down',pages:['포장이 끝나는 곳부터 34번도로의 긴 길이 시작돼.\n큰길은 안전하고 풀밭은 새 동료의 터전이지.']},
    {id:'tourResident4',dialogue:'tourResident4',name:'시장 일을 돕는 알통몬',sprite:'field-machop',x:18,y:51,facing:'down',pages:['알통!\n텃밭에서 옮긴 바구니를 내려놓고 숨을 고른다.','상인을 돌아보고 다시 힘차게 팔을 들었다.\n사람과 포켓몬이 함께 꾸리는 시장이다.']},
  ];
  if(id==='tour_vermilion')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'부두 일꾼',sprite:'worker',x:43,y:14,facing:'down',pages:['동쪽 하역 데크와 남쪽 정박 길을\n한 바퀴 돌면 항구 구조가 보여.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'항구 여행객',sprite:'ace_trainer_m',x:18,y:47,facing:'right',pages:['바닷바람을 피해 정원에서 쉬는 중이야.\n다음 해안길을 지도에서 살펴봤어.']},
    {id:'vermilionGuide',dialogue:'vermilionGuide',name:'항구 안내원',sprite:'rancher',x:34,y:12,facing:'down',pages:['서쪽 홍련, 북쪽 블루, 동쪽 운하 방향을 안내하고 있어요.']},
  ];
  if(id==='tour_cinnabar')return [
    {id:'tourResident0',dialogue:'tourResident0',name:'암석 연구원',sprite:'scientist_f',x:34,y:9,facing:'right',pages:['절벽의 붉은 결을 살펴보는 중이에요.\n연구소 표본과 같은 화산암이지요.','남쪽 만의 돌은 파도에 닳아 매끈해요.\n연구소에서 두 장소를 비교해 보세요.']},
    {id:'tourResident1',dialogue:'tourResident1',name:'섬 주민',sprite:'middle_aged_man',x:17,y:32,facing:'right',pages:['알통몬과 짐을 나르고 쉬는 중이야.\n물가에는 돌을 던지지 말아 주게.','북쪽 길로 돌아가면 센터와 상점이 있어.\n갈색으로 가는 출구는 마을 오른쪽이야.']},
  ];
  return (residents[id]??[]).map(([name,sprite,text],i)=>({id:'tourResident'+i,dialogue:'tourResident'+i,name,sprite,
    x:i===0?10:20,y:i===0?13:12,facing:i===0?'right':'down',pages:[text]}));
}
