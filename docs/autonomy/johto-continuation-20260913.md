# 무궁시티 보유 동료 반응

## 최신 묶음 — 황토 주택의 동료와 잠깐 휴식

- 2026-09-15 출발 보완: 휴식 직후와 주민 재방문에서 서쪽 `tour_johto_route_42`·인주, 북쪽 `tour_johto_route_43`·분노의호수, 동쪽 `tour_johto_route_44`·얼음샛길, 황토 센터를 선택해 기존 목적지 안내로 이어지게 했다. 실제 워프를 걷는 길안내이며 순간이동·새 통행 잠금·사건 완료가 아니다. QA 중단으로 경로 소비는 미검증이다.
- 변경: `tour_mahogany_home1` 기존 주민 `tourHost` → `mahoganyHomeHerbTable` 빈 바구니 정돈 → `mahoganyHomeCompanionSeat` 방석 펼치기와 휴식. 실제 건강한 파티 개체를 선택하며 재방문에는 정돈/방석 상태를 보존한다. `nexusMahoganyHomeTablePrepared`, `nexusMahoganyHomeRested`는 선택 생활 상태다. 경험치·HP·아이템·CH05 완료를 바꾸지 않는다.
- 선행/경계: `nexusMahoganyPowerHandoff` 이후 열린다. 안내소 출구 조명 인계와 `nexusMortarDownstreamChecked` 국소 배수 개선은 별개로 설명한다. 등대·상류 전체·성도 전체 복구를 주장하지 않는다. 동료 선택 후 저장/맵/플레이어/좌표/파티/HP 및 대화 세션을 다시 확인한다.
- 실제 소비: `mahogany-life.ts` 첫 분기 → `handleMahoganyHomecoming`. 기존 renderer 가구 호출 → `paintMahoganyPowerFurnishing` → `paintMahoganyHomecoming`으로 바구니와 방석 상태를 그린다. 공통 renderer 직접 수정 없음. 상호작용의 `setTourDestination`으로 손질대와 휴식자리 연결. 없는 동료를 가구 위에 생성하지 않는다.
- 공간: 기존 24×18 주택과 기존 가구 footprint 유지. 황토 서문42번도로↔인주, 북문43번도로↔분노의호수, 동문44번도로↔얼음샛길 연결은 변경하지 않는다. 크기 기준은 MAP_SIZE_STANDARDS, 여행 계약은 WORLD_ROUTES, 장면 설계는 MAP_STORY_DESIGN 및 NEXUS_STORY_MASTER의 작은 생활 결말을 따른다.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town (2026-09-13 열람, HGSS 구분). 원작의 작은 마을과 서42/북43/동44 연결을 참고했다. 이 주택의 정돈·휴식 및 예비 전원/국소 배수 후 반응은 넥서스 각색이며 원작 사건 복제가 아니다. 외부 코드·자산 재사용 없음.
- 검증: 소스 소비 위치를 읽은 구현 기록뿐이다. 사용자 중단 지시에 따라 테스트·빌드·브라우저·시청각·저장 QA 모두 미실행. 도시 완료 아님. 다음: 중앙 인계 후 생활 장면의 발견 안내와 채택된 후속 사건 경계를 이어 정리한다.

## 최신 묶음 — 42번도로·절구산 작은 배수홈의 재유입 개선

- 중앙 연결 회신: renderer의두맵`mortarDrainageLayers`소비와DownstreamCloudy시작후미완료6단계guide연결완료. 인주공개후자유분기이며절구산구조완료를선행조건으로넣지않았다. 기존조사물event는보존하고신규두props는별도event,기존42번난간은ordinary복귀를제공한다. 실행QA는없다.

- 배정/범위: 채택된상류추적·수로회복의한현장을중앙지시에따라기존42번/절구산에구체화했다. 직접원인은국소거름틀의모래·낙엽퇴적과넘침에의한재유입으로한정한다. 조직/열원/강제복원장치/스이쿤출현원인을새확정하지않으며성도전체수로복구로기록하지않는다.
- 진입·행동: 인주유진대화후42번 `tourRoute42WaterRail` 흐림확인→동굴입구(45,7)→절구산서측 `mortarSedimentScreen` 상류대조→`mortarSettlingBasin` 건강동료와물밖받침·임시유입분리→거름틀퇴적물을물밖수거함에담기→받이에서거름틀유지·정상홈통복귀→남문(28,54)으로42번하류재방문. 하류만막기/퇴적물을아래로밀기/물속에동료넣기선택은진행하지않는다.
- 공간: 신규거름틀(17,25)/침전받이(17,30)는기존비보행벽1칸씩, 서쪽x16보행접촉. 배수홈x17,y24..33은폭좁은물홈·측면임시홈통으로표현한다.42번관측웅덩이는기존비보행x64..69,y4이며원작큰수면/수상조우확대가아니다. 기존보행·조우·조사물·워프·MORTAR_RESCUE_PATH·지도크기를보존한다.
- 상태/실물: `MORTAR_DRAINAGE_FLAGS`는 DownstreamCloudy/SedimentTraced/SettlingPrepared/DebrisCollected/DrainRestored/DownstreamChecked(각nexusMortar접두). 거름틀퇴적물/임시측면흐름/수거함/정상배수/하류잎·모래감소를별도상태로그린다. 실제유체시뮬레이션은아니지만원인대상조치와두맵의결과그림이연결된다. 단순관찰만으로복구하지않으며물밖수거·홈통복귀뒤하류재방문까지필요하다.
- 소비: `mortar-drainage.ts`/`johto-route-42-life.ts`최우선handler와ordinary복귀, `johto-route-42.ts`props·조사물등록. `mortar-drainage-art.ts`의`mortarDrainageLayers(c,map,flags)`두맵renderer목록및guide6단계중앙연결요청. 지정된mahogany-power.ts/renderer.ts직접수정없음. 현재save/player/map/좌표/session/동료실체·HP와선행순서를지연콜백에확인한다.
- 출처: [Serebii HGSS Route42](https://www.serebii.net/pokearth/johto/route42.shtml)와[HGSS Mt.Mortar](https://www.serebii.net/pokearth/johto/mt.mortar.shtml),2026-09-13개별본문재확인. 원작은물이분리한42번세입구와절구산여러구역/수상이동을갖는다. 현재단일입구·1층통합굴의작은배수설비/모래·낙엽사건/42번관측웅덩이는넥서스창작각색이다. 원작수로타일복제/Surf·폭포/전설획득/아이템보상없음. 지도픽셀판독을근거로주장하지않고개별장소본문만대조했으며외부자산재사용없음.
- 검증: 소스·자료읽기와코드반영. QA전부중단으로테스트/타입/빌드/브라우저/저장/시각·음향검증미실행. 실제지도접근·전환·그림은미검증. CH05전체완료/새일반교통잠금/보상없음. 지역현장한묶음종료.

## 최신 묶음 — 황토 안내소 예비 전원 배분

- 중앙 소비 완료 회신: engine프레임update/engine.map·maps.getMap의순수projection, renderer실수좌표·depth·분배반가구·조명layers, 단계guide가연결되었다. 이전연결요청기록은당시상태다. 이동중현재/다음두칸reserved합성, 기존예약보존·목표예약확인, dialogue/transition/transitionWarp일시정지, 비유한·0이하dt방어를지역코드에추가했다. 원래예약은projection별WeakMap에보관해자체예약누적·자체대기를피한다. QA미실행.

- 채택: MAP_STORY_DESIGN 마지막 `CH05 전력 분배의 첫 현장 — 황토 안내소 실행 설계`의 중앙배정을 적용했다. 앞 후보미채택기록은 당시이력이며 이번설계로첫현장이구체화되었다. 조건은 `nexusEcruteakEugeneReflected` + 기존 `nexusMahoganyLifePreserved` + `nexusMahoganyTransmissionStopped`; 절구산완료를요구하지않는다.
- 실제공간: 기존28×24 `tour_mahogany_hall`의생활수첩작업대내(9,17)2×2비보행칸만 `mahoganyReserveSwitch` props로재배정. 원래작업대왼쪽기록조사는유지한다. 생활공급반/송신제어기/기존NPC/남문(14,23)/스폰(14,20)유지. 주민초기(12,15)→x12,y20→x16,y20→(16,21)안전자리. 길은기존보행칸이며새맵·바닥차단없음.
- 행동/상태: 주민의어두운대기자리불편을들은뒤 분배반의 한정된예비전원을 전시등(1) 또는출입유도등(2)으로선택. 실제두배선/분배손잡이/전시빛/바닥연속유도등이선택을소비한다. 전시등만켜면주민이남아있고유도등배분후주민에게이동을부탁한다. 도착은0.35초한칸의실제경로이동끝에서만저장하며도착주민대화에서인계를별도로기록한다.
- 상태키: `nexusMahoganyPowerNeedHeard`, `nexusMahoganyPowerAllocation`, `nexusMahoganyPowerArrived`, `nexusMahoganyPowerHandoff`. 기존생활전원/송신정지를덮어쓰지않는다. 진행중부하변경을거절하고현재방이탈/저장·player교체/배틀/선행조건실효면미확정motion을취소한다. 중간위치는저장하지않으며재시작시초기주민자리, 확정도착후는안전자리다. 타NPC/플레이어가다음칸에있으면대기한다.
- API/소비: `mahogany-power.ts`의 `handleMahoganyPower`를life첫분기에연결, interiors기존가구props부분교체/주민등록. 중앙에 `updateMahoganyPower(g,dt)`, 순수 `applyMahoganyPower(map,flags,position?)`, `mahoganyPowerPosition(g)`를프레임/지도·충돌/렌더실수좌표에연결요청했다. `mahogany-power-art.ts`의 `paintMahoganyPowerFurnishing`/`mahoganyPowerLayers`는동일가구depth/바닥·전시조명을그린다. NPC와무관하게고정walkable칸에유도등을그리며문까지(14,21..23)도연결한다.
- 출처/원작차이: [HGSS 황토](https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town), [로켓단HQ](https://bulbapedia.bulbagarden.net/wiki/Team_Rocket_HQ)의2026-09-13본문확인이력참조. 원작의기념품점/지하송신발전실과별개로, 이번안내소예비전원·전시/피난등배분·주민이동은채택넥서스첫현장각색이다. 원작라이코사건/발전소원인/전설등장·포획/보상·교통잠금/CH05전체완료를추가하지않았다. 외부코드·자산재사용없음.
- 검증: 코드반영·소스읽기만. QA전부중단으로테스트·타입·빌드·브라우저·이동/저장·시각/음향검증미실행. 중앙연결과실제플레이검증은구분한다. 이현장한묶음만수행하고종료한다.

## 최신 묶음 — 절구산 구조 동선의 암벽 랜드마크

- 부족한 부분: `journey-art.ts`의 공통동굴그림은 막힌칸에 반복 암벽, 보행칸에 공통바닥을 그린다. 구조동선의방향표식은있으나 동쪽·북쪽·서쪽·남쪽굽이의암벽형태가구별되지않았다. 기존바닥/열기/우회표식은그대로두고선택된벽구간만대체한다.
- 좌표/그림: 동쪽안전자리옆(47,17)1×5갈라진세로암벽, 북쪽횡단로윗벽(22,11)6×1층진암반, 서쪽하강옆(8,18)1×6돌무더기, 남쪽합류아래(19,42)5×1낮은암벽. `walkable==='#'`이면서props/warp가없는칸만16px셀내clip한다. 바닥계산에NPC점유를사용하지않으며 기존보행칸·조우·워프·조사물·MORTAR_RESCUE_PATH는변경하지않는다.
- 소비: 신규 `src/mortar-landmarks-art.ts`의 `mortarLandmarkLayers(c,map)`를기존 `mortar-heat-art.ts`가합성하고중앙renderer의기존`mortarHeatLayers`depth목록이소비한다. 랜드마크depth -1은기존배경위/바닥안내와NPC아래다. 스토리시작전에도지형은표시하고기존열기/우회플래그조건은유지한다. 공유renderer직접수정/새훅요청없음.
- 출처: [Serebii HGSS Mt.Mortar](https://www.serebii.net/pokearth/johto/mt.mortar.shtml),2026-09-13 개별장소페이지직접열람. 1F/1F-2/1F-3/B1F구역과42번도로접속을대조했다. 해당페이지의 [HGSS1F지도링크](https://www.serebii.net/pokearth/maps/johto-hgss/35-1f.png)도열었으나 이번도구결과로지도픽셀을시각판독했다고주장하지않는다. 네랜드마크좌표/단층순환굴/산행객구조는넥서스기존배치의창작보수이며원작타일복제·원작앤테이사건이아니다. 외부자산/코드재사용없음.
- 검증: 소스·참고자료읽기와코드반영만. 모든QA중단으로테스트·타입·빌드·브라우저·저장·시청각검증미실행. 실제동굴화면/랜드마크식별성은미검증. 새맵/크기확대/열원확정/전설/진행잠금없음. 이번묶음종료.

## 라이코 전력 구간 — 구체 계약 조사와 후보 인계

- 조사 결과: NEXUS_STORY_MASTER60/285와JOHTO_REGION_GUIDE258은 피난길 전력 분배와 전기흐름이상 반응을 확정한다. `design-data/quests.json` CH05(48~54)는 J02~J07/J10/J12와 전력·산길·상류 역할을 규정하지만 배전장치/실제MapId/배분부하/주민행동은 특정하지 않는다. 같은파일LEG-0243(400~410)은CH09전기흔적후일담이며 `pokemon.json`13735~13747은이전초안/엔딩후/implemented:false다. 후일담을CH05장치계약으로상속하지않는다.
- 후보 한 곳(미채택): `tour_mahogany_hall` 기존28×24. 이미 생활공급반(18,17)과송신제어기(22,17), 별도바닥배선과남문(14,23)이있다. 생활공급유지/송신정지 플래그는 실제현재코드이고, 피난조명 배분·주민대피는 현재없다. CH05장소범위에 이곳을 추가채택할지부터 중앙결정이필요하다.
- 권장안(설계제안): 기존생활반을건드리지않는 별도예비전원을 전시등과남쪽출입유도등중선택배분하고, 대기자리→남문안쪽길의조명·주민실제이동으로결과를보인다. 기존길은항상열어두고 전원장애원인/라이코등장/획득/보상은새로확정하지않는다. 반복스위치세개나표지확인으로완료시키지않는다.
- 채택 필요: 장소, 예비전원·두부하의실물위치와제약, 참여주민·안전도착점, 선행조건/진행상태, 라이코관여시점. 중앙에위근거와후보를전달했다. 원작HGSS황토기념품점/HQ와 프로젝트기존안내소 및제안피난조명사건을구분한다(정확한원작출처는아래황토구현절의2026-09-13확인기록).
- 이번 결과: 조사·지역인계만수정. 미채택전력설비/암전/주민사건/새플래그를코드에추가하지않았다. QA중단으로모든테스트·빌드·브라우저검증미실행. 다른도시확장없이이번묶음종료.

## 최신 묶음 — 절구산 산행객의 실제 우회 동행

- 중앙 후속 보수 수신: `mortarRescueDirections(flags)`로 재준비/대기 방향을 NPC 기준으로 통일했다. 최초 북쪽 첫 칸은 옆에서 진입하며 이후 NPC 바로 앞 칸과 다음 이동방향을 안내한다. 해당 중앙 코드 변경을 보존했다. QA 미실행.

- 범위: 기존 우회 공유 `nexusMortarBypassShared` 이후 동쪽 안전자리(44,20)의 새 산행객 한 명을 기존 북서 우회로로 남쪽 합류점까지 안내한다. 직접열원/장치/조직은 미확정 유지, 앤테이출현·획득/CH05완료/보상/새길잠금 없음.
- 실제 이동: `MORTAR_RESCUE_PATH`는 (44,20)→(44,16)→(16,16)→(16,18)→(14,18)→(14,38)→(27,38)를 기존보행칸으로 한칸씩 잇는다. 건강한 동료의 받침 지키기/발디딜곳 살피기 역할을 선택한 뒤 성공한타일이동만 진행한다. 지정다음칸+실제이전칸+한칸거리+동료건강을 확인하며 대사/타이머/워프로 건너뛰지 않는다. 길이탈·전투·동료기절 때 산행객은 기다린다. 재편성은 진행순번을 보존한다.
- NPC/저장: `nexusMortarRescueReady`, `nexusMortarRescueProgress`, `nexusMortarRescuePartnerSpecies`, `nexusMortarRescueReturned`. 산행객은 매진행 한칸뒤따르고 저장된순번으로 재진입위치를 복원한다. 마지막은 player(27,38)/NPC(26,38), 기존남쪽산행객(28,37) 대화에서만 귀환확인. 완료후 남쪽에서 쉬며 우회경험을 회고한다. 동굴출구(28,54)/42번워프/열기/조우/기존산행객은 보존한다.
- 공통소비: `mortar-rescue.ts` exports 순수 `applyMortarRescue(map,flags):GameMap`는 대상NPC만 복제한다. `stepMortarRescue(g,from):boolean`의 true 때만 저장한다. 중앙 maps.getMap/engine.map의projection 및 실제이동완료·warp처리후/onFieldStep전 호출과persist, guide현재NPC/다음방향/진행수/마지막합류 연결회신수신. 공유원본NPC를변경하지않는다. 지역 life최우선훅과새NPC등록, 기존mortarHeatLayers에현재다음보행칸발자국표시 연결.
- 근거/구분: NEXUS_STORY_MASTER60/196/286의 열기·암반을읽는우회구조를 구체화한 넥서스 창작 산행객 동행이다. 원작 HGSS 앤테이구조사건 재현이 아니다. 이전절의 HGSS절구산/42번 본문은 지리대조근거이며 NPC구조는원작사실로기록하지않는다. 외부코드/자산재사용없음.
- 검증: 소스읽기와코드반영, 중앙소비회신만. QA중단으로 테스트·타입·빌드·브라우저·자연플레이·전투중단·저장복귀·시청각검증미실행. 이동보존과완료조건은코드상구현이며 실제구조경험/도시완료검증아님. 이번묶음종료, 다른도시자동확장없음.

## 절구산 후속 — 원인 설계 경계와 우회 방향 보수

- 확정 범위 확인: NEXUS_STORY_MASTER60/196/286은 앤테이의 산지·지열 이상 반응과 열기·암반을 읽는 우회·구조를 규정한다.26/198/272는 성도 강제복원 중단의 상위 범위다. 절구산의 직접 열원·특정 장치·현장 운영자·정지 행동은 해당 절에 없다. 설계DB `docs/design-data/nexus-plan.json`3155부근 앤테이 레코드는 node J20/CH10/핵심 전설 산길 흔적 후일담이며 CH05 장치 해결 계약이 아니다.
- 중앙에 필요한 설계 결정(직접 원인, 현장 실물과 조치, 인물, 생활 계통 유지 경계)을 전달했다. 임의 원인/조직/장치/전설 획득을 추가하지 않았다.
- 독립 보수: 기존 `mortarHeatLayers`에 북쪽 실제 표식(32,11)에서 횡단로y16까지의 점선 연결, 동쪽→북쪽→서쪽→남쪽 합류의 방향 화살표, 온열 바닥 진입부y23의 평면 사선 표시를 추가했다. 모두 기존 보행 칸 안에만 그리며 물길/충돌/맵 크기/상태·진척 플래그 변경 없음. 기존 중앙 depth 훅을 그대로 소비한다.
- QA 중단 유지: 소스·설계 기록 읽기와 코드 반영만 수행했다. 방향 표시의 실제 화면/보행/저장/음향 검증은 미실행. 열기 원인 조사·해결을 구현했다고 판단하지 않는다.

## 최신 묶음 — 42번도로·절구산 온열 구간과 생활 우회

- 중앙 배정: 인주 CH05 도입 뒤 `nexusEcruteakEugeneReflected` 조건. 인주동문→42번도로88×32 `tourRoute42MortarBoard`→북쪽입구→절구산1층56×56 산행객. 기존 남쪽출구(28,54)→42번(45,9), 본선서인주/동황토 유지. 신설층/확대/필수이동기술/포획잠금/길차단 없음.
- 행동: 건강한 실제 파티 동료를 골라 비행 동료는 안전자리의 바람 반응·끈 비교, 나머지는 짐 받침·긴 끈 비교로 분담. 동쪽 메아리벽에서 온열 기류 비교→북쪽 회전 표식→서쪽 물길의 마른 가장자리→남쪽 산행객에 우회 공유. 물붓기로원인제거/통로에짐쌓기/물길메우기/열기해결선언은 진행하지 않는다. 동료선택 지연콜백에서 실제참조/HP, 모든단계에서 save/player/map/좌표/session과선행상태 확인.
- 실제 배치: 동쪽 기존보행바닥x40..42,y24..30에온열색/기류무늬. 북쪽회전표식(32,11)은 기존막힌벽1칸에props/조사물등록. 단계별바닥점선은동쪽x44,y16..22→북쪽x14..44,y16→서쪽x14,y18..36→남쪽x14..28,y38이며 현재walkable인칸만표시한다. 최종기존남쪽귀환표식(33,42)에우회도가남는다. 실제지형/물길/기존문/워프/일반조우/전투계약변경없음. 동쪽열기는최종후에도남아원인미해결을표현한다.
- 상태/소비: `mortar-heat.ts`의 `MORTAR_HEAT_STAGES`는 CompanionReady/HeatCompared/NorthMarked/WestChecked/BypassShared(각`nexusMortar`접두), events는 journeyWalker/EchoWall/mortarNorthBypassMarker/WaterTrace/journeyWalker. `johto-route-42-life.ts`첫분기와ordinary복귀 연결. `mortar-heat-art.ts`의 `mortarHeatLayers(c,map,flags)`depth훅/5단계목표를중앙에전달하고 연결완료회신을받았다. 실행검증은아니다. 기존생활관찰을본편으로읽지않는다.
- 출처: [Serebii HGSS Mt. Mortar](https://www.serebii.net/pokearth/johto/mt.mortar.shtml), [HGSS Route42](https://www.serebii.net/pokearth/johto/route42.shtml),2026-09-13 GenIV본문확인. 원작42번은인주와황토를잇고물이갈라놓은세입구로절구산에접근하며동굴은여러구역/지하와이동기술을사용한다. 현재는도로중앙단일분기와1층통합순환굴각색이며, 온열/산행객우회는채택CH05산길열기조사의프로젝트사건이다. 원작앤테이정위치/포획/태권왕·배루키보상/Surf·폭포/깊은층을구현하지않았다. 외부지도이미지·코드·자산재사용없음.
- 상태: 코드반영·자료/소스읽기. QA모두중단으로테스트/타입/빌드/브라우저/저장/시각·음향미실행. 실제보행·표식가독성·동료변경·저장미검증. 생활우회확인이지열기원인·상류오염·전력해결/앤테이획득/CH05완료아님.

## 최신 묶음 — 인주 CH05 서명·생활 원본 공개

- 중앙 배정: `nexusRageResidentsResumed` 뒤 기존 통합 전승시설2층 이안 →2층 공개대 →1층 주민 →3층 유진. 각층28×24 유지. 새MapId/크기/계단/출입잠금 없음. 기존 방울/목조/전망 생활 견학 플래그는 본편 단계로 읽지 않는다.
- 현장: 2층(18,17)6×2 공개대 신규 workbench/props, 각층(21,20)에 이안/주민/유진 NPC. 기존 가구와 별도 공간이며 남쪽접촉·중앙귀환 통로를 남긴다. 이안의 서명본을 지우지 않고 주민 원본과 누락 표시를 나란히 펼치는 선택만 공개를 진행한다. painter는 서명된 종이→원본/대조표식으로 변한다. 주민은 즉시용서 대신 원본 보존·복구 참여를 요구하고, 유진은 구조체계의 필요와 현장 목소리 누락 문제를 함께 말한다.
- 상태: `nexusEcruteakIanAdmitted`, `nexusEcruteakOriginalsPublic`, `nexusEcruteakResidentsDemanded`, `nexusEcruteakEugeneReflected`. 첫 결과만 persist, 지연콜백은save/player/map/좌표/session/선행조건 확인. 기존 `ecruteak-life.ts`의 current 동적 기본값도 originMap/player/좌표캡처로 보수했다. 원본 공개는 복구나 CH05 완료가 아니다.
- 다음 연결: 완료 직후 미구현 원인조사 목표를 자동등록하지 않는다. 재방문 길보기는 실제 인주서문→38번도로 `tourRoute38EcruteakStone`→39번/담청방향, 동문→42번 `tourRoute42MortarBoard`의절구산선택분기, 같은42번 `tourRoute42WaterRail` 산물길난간이다. 전력/열기·우회/상류오염은 앞으로 별도로 구현할 문제이며 이 기존 장소의 관찰을 원인규명으로 표시하지 않는다.
- 소비: `ecruteak-disclosure.ts`의 `handleEcruteakDisclosure`를 life 첫분기에 연결. `ecruteak-interiors.ts`실물/NPC등록. `ecruteak-disclosure-art.ts`의 `paintEcruteakDisclosureFurnishing(c,mapId,o,flags)` 동일가구depth 훅과4단계 guide를 중앙에 전달. 렌더/목표 통합은 중앙소유이며 동일depth painter/4단계 guide 연결 완료 회신을 받았다. 실행 검증은 아니다.
- 출처: [Ecruteak City](https://bulbapedia.bulbagarden.net/wiki/Ecruteak_City), [Burned Tower](https://bulbapedia.bulbagarden.net/wiki/Burned_Tower), [Bell Tower](https://bulbapedia.bulbagarden.net/wiki/Bell_Tower),2026-09-13 본문 HGSS/GenIV 구분확인. 원작 인주는37/38/42번 출구, 서쪽불탄탑과 북동쪽방울탑의 분리시설, 불탄탑지하 세포켓몬과 상실/되살림 전승, HGSS방울소리길을 갖는다. 프로젝트는 기존3층 공개전승시설과 채택된 이안/유진/주민서명공개 사건으로 각색한다. 원작10층/지하·로밍/무지개빛날개/전설소환/강제포획을 구현하지 않았다. 외부지도이미지·코드·자산재사용없음.
- 검증: 자료/소스읽기 및 코드반영만. QA전부중단으로 테스트·타입·빌드·게임브라우저·저장·시청각미실행. 실제계단왕복/대사/화면은 미검증, 도시/CH05완료아님.

## 최신 묶음 — 송신 정지 후 붉은 갸라도스 대응·생활 재개

- 조건/공간: `nexusMahoganyTransmissionStopped` 뒤 기존 서안 수위 표석에서 안전거리 → 동쪽 전망대에서 실제 동료 대응. 기존56×48 수면 내 x43,y17의48px 붉은 개체/거친 물결을 표시하며 진정 뒤 x36,y21로 물러나 완만한 물결이 된다. 수면영역 안 clip, 길/props/충돌/수상워프 추가 없음. 둑길로 걸어 접근하며 파도타기를 제공하지 않는다.
- 공통 계약 소비: 중앙의 `createSpecialBattle`와 `specialBattleResultFlag`를 그대로 사용. `johto-rage-gyarados-calm`은130/Lv25/shiny/allowCapture:false, 공통 실제 `won`만 진정으로 읽는다. 주민 생활 재개 뒤 `johto-rage-gyarados-capture`의 allowCapture:true를 명시 선택하며 공통 `caught`만 개체 제거와 중복 방지에 사용한다. 패배/도주는 진정·포획으로 읽지 않는다. 일반 조우풀/종/기술/전투 계산/저장 직렬화를 지방에 복제하지 않는다.
- 현장 후속: 진정 뒤 `rageReliefBasin` 물 받이와 마른 보행길 → `rageReliefBell` 독립 응답 → 집 `tourHost` 주민 결과 전달. 별도 `nexusRageRecoveryWaterChecked`/`nexusRageRecoveryBellChecked`/`nexusRageResidentsResumed`이며 진정 전 준비 플래그를 새 회복 확인으로 재사용하지 않는다. 안전거리 플래그는 `nexusRageSafeDistance`. 포획은 생활 재개 조건이 아니며 추가 배지/도구 보상/CH04 전체 완료 플래그 없음.
- 재방문/생활 그림: 수위 표석은 대응전/진정후/포획후를 구분한다. 포획 후 수면 개체를 숨기며 보유한 붉은색은 중앙 공통 저장/렌더가 담당한다. 주민 재개 후 기존 손질대에 갈대 바구니와 물통, 기존 창가 자리에는 주민 피카츄와 물그릇을 그린다. 동료는 공통 `paintTownPokemon` 소비, 실제 NPC 이동/유체 시뮬레이션 아님. 기존 일상 관찰은 ordinary/bypass로 보존한다.
- 소비/API: `rage-lake-gyarados.ts`를 life 최우선 분기에 연결. export `RAGE_CALM_EVENT`, `RAGE_CAPTURE_EVENT`, `RAGE_RECOVERY_FLAGS`, `RAGE_GYARADOS_EVENTS`, `rageGyaradosCalm({flags})`, `rageGyaradosCaught({flags})`. `rage-lake-gyarados-art.ts` exports `rageLakeGyaradosLayers(c,map,flags,images)`와 `paintRageLakeRecoveryFurnishing(c,mapId,o,flags,images)`를 중앙 depth/동일가구/guide 연결에 전달했다. 중앙 renderer 두 훅과 필수 guide5단계 연결을 소스로 읽고 회신도 수신했다. 포획은 필수 guide에서 제외한다. 실제현재save/player/좌표/session/선행조건/중복포획을 생성 직전에 재확인하고 생성 null이면 배틀을 시작하지 않는다.
- 출처: [HGSS 분노의호수](https://www.serebii.net/pokearth/johto/lakeofrage.shtml)·[황토 로켓단아지트](https://bulbapedia.bulbagarden.net/wiki/Team_Rocket_HQ),2026-09-13 본문 확인 이력. 원작 붉은 갸라도스/송신 사건을 참고하되, 넥서스는 채택 NEXUS_STORY_MASTER CH04~05 §3의 송신정지→진정→생활회복→선택포획 순서, 현재 레벨상한25와 둑대응을 사용한다. 원작Lv30/Surf/붉은비늘·비전머신보상/지하아지트 재현이 아니다. 붉은130이미지·종지원·변형저장은 중앙 제공 공통 자산/API이며 지역 외부자산 복제 없음.
- 검증: 코드·공통API 소스 읽기와 반영만 수행. 모든 QA 중단 유지로 테스트·타입·빌드·게임브라우저·전투실행·시각/음향·저장 검증 미실행. 진정승리/선택포획/PC·재로딩/그림은 미검증이며 도시 전체 완료가 아니다.

## 최신 묶음 — 황토 송신 현장 대립·분리 정지

- 중앙 배정/NEXUS_STORY_MASTER CH04~05 §3: `nexusRageReliefReady` 이후 황토 안내소의 현장 담당자와 명시 선택 전투 → 생활 공급 손잡이 고정 → 송신 단로기만 열어 정지. 준비 전 담당자는 기후표/주민기록/출입문 일상 안내를 한다. 기존 관찰 플래그는 요건이 아니다.
- 실제 공간: `tour_mahogany_hall` 기존28×24 유지. 남동 작업구역 생활 공급반(18,17)2×2 / 송신 제어기(22,17)2×2를 신규 console 가구와 props로 등록, 현장 담당 NPC(21,20). 기존 기후표/암석/생활 수첩과 겹치지 않고 y19에서 양쪽 장치 접촉 가능. 청록 생활선/황토 송신선은 y19의 바닥 높이 배선이다. 중앙남문x14·마을 복귀·기존 안내원·센터/상점/도로 통행 유지. 신규MapId/방/크기/워프 없음.
- 전투/상태: 공통 `showTrainerPreparation`에서 실제 선두 선택 → `createTrainerBattle`, 지원종 알통몬24/꼬마돌25, reward0. 공통 승리 키 `trainerWinFlag('mahogany-transmission-keeper')`만 전투 승리로 읽으며 패배/중단은 정지 요건이 아니다. 이후 `nexusMahoganyLifePreserved` → `nexusMahoganyTransmissionStopped`를 각 대상 행동과 대사 종료 뒤 기록한다. 동료전투/경험치/패배 처리는 공통 엔진 소비이며 새 지급품·돈 보상·종 정의·전투 계산 복제 없음. 기존저장/player/좌표/session/선행상태를 지연 콜백에서 재확인한다.
- 물리 결과: 켜진 생활 공급반 손잡이와 유지 고정표, 송신 단로기의 열린 방향/고정표와 꺼진 표시등으로 결과를 남긴다. 다른 선을 함께 뽑거나 공통 전원을 내리는 선택은 진행하지 않는다. 송신정지 뒤 43번도로를 통한 호수 현장 재방문을 안내하며 갸라도스 진정/포획/CH04 완료는 기록하지 않는다.
- 소비: `mahogany-transmitter.ts` → `mahogany-life.ts` 첫 분기, `mahogany-interiors.ts` console/NPC/충돌 등록. `mahogany-transmitter-art.ts` exports `paintMahoganyTransmitterFurnishing(c,mapId,o,flags)`와 `mahoganyTransmitterLayers(c,map)`. 중앙 기존 가구 동일depth/바닥배선과 adventure-guide 담당전투→생활유지→송신분리 연결을 소스로 읽고 회신도 수신했다. 실행 검증은 아니다. 정지 뒤 호수 WaterStone은 현재 도입/준비 회고이며 갸라도스 후속 핸들러는 다음 구현 경계다.
- 출처: [Bulbapedia Mahogany Town](https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town), [Team Rocket HQ](https://bulbapedia.bulbagarden.net/wiki/Team_Rocket_HQ), 2026-09-13 본문 HGSS/Generation IV 구분 확인. 원작 황토는 서42/북43/동44번도로, 기념품점 아래 비밀계단·로켓단 아지트와 지하 송신 발전실을 두며 HGSS는 목호와 협력 전투 및 붐볼 발전 정지로 이어진다. 프로젝트는 기존 안내소의 부속 작업구역, 일반 현장 담당자와 단일 공통 전투, 생활 공급 유지·별도 송신 단로기 조작으로 각색한다. 원작 지하3층·암호문·로켓단 NPC·붐볼·비전머신 보상·동쪽 길막/배지 조건을 구현하지 않았다. 원작 지도 이미지/외부 코드·자산 재사용 없음. 중앙 REFERENCE_RESEARCH/WORLD_ROUTES/MAP_STORY_DESIGN 통합 기록에 인계한다.
- 검증/남은점: 원작자료/소스 읽기 및 코드 반영. QA 중단 유지로 테스트·타입·빌드·게임 브라우저·저장·시각/음향 미실행. 자연진행/패배후재진입/전투 및 장치화면은 미검증, 황토/호수/CH04 전체 완료 아님.

## 최신 묶음 — 분노의호수 분리 취수·수동 경보 준비

- 중앙 후속 배정: 위기 발견 이후 생활 대안의 실제 준비까지 이어 구현. `nexusRageAlternativesNeeded` 뒤 집의 `rageLakeHomeReedTable` 부품 준비 → 외부 `rageReliefIntake` → `rageReliefBasin` → `rageReliefBell` 설치 → 기존 `rageLakeLookout` 시험 전달 → `rageReliefBell` 낮은 물가 수신 확인 → 집 `tourHost` 결과 전달. 43번도로/황토 귀환 조건 유지.
- 공간: 기존56×48 안 서안 보행길 x20..24와 호수 수면 x28..47 사이 둑에 분기(25,20), 받이(25,28), 경보(25,30)를 등록. 수면 가장자리 x27에서 분기까지 가로 취수홈통, x25,y20..28 남쪽 받이까지 세로 홈통을 그린다. painter는 각 칸의 blocked 여부와 footprint 내부 clip을 사용한다. 수면·갈대 지형·기존 워프·크기 목표 변경 없음. 집24×18의 기존 손질대 위 부품은 현장 설치에 따라 사라진다.
- 행동/상태: 건강한 실제 파티 동료를 골라 받침 지키기 또는 작은 부품 나르기로 준비한다. 쓰러진 동료는 센터 목적지/다른 동료 선택, 파티 선택은 페이지로 제공한다. `RAGE_RELIEF_STAGES`는 Parts/Channel/Water/Bell/Signal/Received/Ready 순서, 각 플래그는 `nexusRageRelief` 접두. 기존 밸브 차단·받침 없이 통수·송신기 선 공용·정상 경보 차단·현장 수신 생략은 진행하지 않는다. 현재 save/player/좌표/session과 동료 참조/HP를 지연 콜백에 확인한다. 같은 결과 재저장·최종 목적지 반복 없음.
- 결과 표현: 연결 이후 홈통과 빈 받이, 통수 이후 연속 물선과 채워진 받이, 독립 경보 설치 이후 수동 종/높은 신호판, 시험 전달 뒤 전망대 시험판·낮은 둑 응답판, 직접 수신 확인 뒤 표시가 남는다. 주민 물받기와 종 응답은 대사·장치 상태 표현이며 실제 NPC 이동·유체·경보음 시뮬레이션은 아니다. 송신기 정지·황토 대립·갸라도스·CH04 전체 완료는 적용하지 않는다.
- 소비: `rage-lake-relief.ts` → `rage-lake-life.ts` 첫 분기, ordinary/bypass로 기존 주민/작업대/관찰 보존. `rage-lake-layout.ts` props/조사물 등록. `rage-lake-relief-art.ts`의 `rageLakeReliefLayers`와 `paintRageLakeReliefFurnishing`는 중앙 renderer의 도입 다음 depth 목록/기존 가구 직후에 연결됐다는 회신을 받았다. 중앙 adventure-guide 7단계 연결 회신 수신.
- 출처: 아래 도입과 같은 [HGSS 분노의호수](https://www.serebii.net/pokearth/johto/lakeofrage.shtml)·[43번도로](https://www.serebii.net/pokearth/johto/route43.shtml) 본문(2026-09-13). 도로와 호수 연결은 원작 대조, 주민 생활을 지키는 분리 홈통·수동 신호판/종과 이안 준비는 NEXUS_STORY_MASTER CH04~05 §2의 프로젝트 각색이다. 원작 장치 재현/원작 정지 조건 도입/외부 자산 재사용이 아니다. 중앙 출처·연결·사건 통합 기록에 인계.
- 검증/남은점: 자료·소스 읽기와 코드 적용만 수행. 모든 QA 중단에 따라 테스트·타입·빌드·게임 브라우저·저장·시각·음향 미실행. 실제 배치/이동/목표/대사/저장 동작과 도시 완성은 미검증. 생활 대안의 코드상 준비 결과와 본편 완료를 분리한다.

## 최신 묶음 — 분노의호수 생활 설비 현장 비교

- 중앙 배정: NEXUS_STORY_MASTER CH04~05 §2 도입. `nexusGoldenrodInquiryReady` 이후 `tour_rage_lake_home1/tourHost` 주민 → `tour_rage_lake/rageLakeWaterStone` 취수 비교 → `rageLakeReedDesk` 마른 둑 표식 → `rageLakeLookout` 경보 시험 → 주민 귀환. 진입/귀환은 황토마을 ↔ 43번도로(`tour_johto_route_43`) ↔ 분노의호수. 새 도로·동굴·워프·잠금 없음.
- 실제 행동: 생활 밸브를 유지한 채 비교 받이 눈금을 맞추고, 살아 있는 갈대를 피한 기존 기록대의 둑쪽에 표식을 남기며, 정상 경보를 유지한 채 시험 반사판 방향을 바꾼다. 공급 차단/갈대 훼손/정상 경보 차단 선택은 진행하지 않는다. 결과는 받이·표식·시험 반사판의 지속 표시로 소비한다. 실제 유체/날씨/경보음 시뮬레이션이나 수로 설치는 아니다.
- 상태: `nexusRageResidentsHeard`, `nexusRageIntakeCompared`, `nexusRageReedMarked`, `nexusRageAlarmTested`, `nexusRageAlternativesNeeded`. 마지막은 대체 수로·독립 경보의 필요 확인이며 설치·송신 정지·갸라도스 진정·CH04 완료가 아니다. 완료 재방문은 결과 회고, 동일 주민 목적지 자동 반복 없음. 기존 선택 관찰 플래그를 본편으로 읽지 않는다. 저장/player 참조·위치·session·전투 여부를 지연 콜백에서 확인하고 첫 결과만 persist한다.
- 소비: `rage-lake-nexus.ts`의 `handleRageLakeNexus`를 `rage-lake-life.ts` 첫 분기에 연결. 평소 관찰로 돌아가는 bypass 유지. `rage-lake-nexus-art.ts`의 `rageLakeNexusLayers`는 실제 props 이벤트·좌표가 일치하는 (22,18)/(14,31)/(50,18)의 기존 1타일 내부에 clip한다. 중앙 renderer depth 목록과 adventure-guide 5단계 연결 반영을 소스로 읽었다. 맵 크기·충돌·새 시설 footprint 변경 없음.
- 출처/확인일/버전: [Serebii Lake of Rage](https://www.serebii.net/pokearth/johto/lakeofrage.shtml), [Serebii Route 43](https://www.serebii.net/pokearth/johto/route43.shtml), 2026-09-13 HGSS/Gen IV 본문 확인. 원작은 호수 남쪽43번도로, 도로 남쪽황토/북쪽호수, 도로 두 갈래와 로켓단 시기 유료 게이트, 호수의 요일별 수위와 강제진화 전파 사건이 있다. 넥서스 물 공급/생활 경보/비교 설비·이안 대안 준비는 채택된 프로젝트 각색이다. 원작 통행료·날씨/수위 변화·Surf·갸라도스 획득을 구현하지 않았다. 지도 이미지·외부 코드/자산 재사용 없음. 출처 책임은 REFERENCE_RESEARCH, 기존 연결 기준은 WORLD_ROUTES, 사건 기준은 MAP_STORY_DESIGN/NEXUS_STORY_MASTER이며 중앙 통합 기록에 인계한다.
- 검증/남은점: 자료와 소스 읽기 및 코드 반영. 모든 QA 중단 유지로 테스트·타입·빌드·게임 브라우저·저장·시각·음향 검증 미실행. 주민 배우 이동/실제 물 흐름/대체설비 설치는 미구현이며 이번 도입과 도시 전체를 완료로 판정하지 않는다.

> 고동 마무리: 중앙 가구 렌더 연결 회신 반영. 플레이 대사의 관찰 기록/지급 등 구현 설명을 재료 바구니·바람·휴식에 관한 말로 정리했다. 새 제작 약속 없음. QA 전부 미실행.

## 최신 묶음 — 고동 실제 선별·건조 작업

- 조건/장소: 중앙 배정에 따라 기존 고동 tour_azalea/tour_azalea_hall을 작업한다. 마당 tourAzaleaApricornYard → azaleaHallSortingDesk → azaleaHallDryingShelf → azaleaHallPokemonRest. 건강한 파티 동료는 매 작업 선택 시 실체 참조/HP/현재 저장·player·좌표·session을 확인한다. 포획 출신은 필수 조건이 아니다.
- 실제 선택: 격투/바위/땅 동료는 받침 지키기, 나머지는 작은 바구니 나르기로 준비. 선별은 색이 아닌 갈라짐으로 분리해야 진행한다. 건조에서 비행 동료는 떨어져 바람을 보내고 나머지는 간격 받침을 사용한다. 세게 불거나 빽빽하게 모으면 crowded 상태가 남으며 다시 벌려야 한다. 마지막은 계속 작업 대신 휴식자리를 마련하는 판단이다. HP/기술/아이템은 변경하지 않는다.
- 상태: azaleaWorkBatch/Sorted/Drying/Rested/Crowded/Ventilated. 기존 azaleaApricornPrepared/WorkshopObserved/CompanionRested는 새 완료로 읽지 않는다. 같은 작업 재방문은 현재 배치를 설명하며 제작품/보상/통행/호수 본편 완료 없음. nexusGoldenrodInquiryReady는 주민의 생활 유지 맥락에만 사용한다.
- 소비: azalea-workshop.ts handleAzaleaWorkshop를 azalea-life 첫 분기에 연결. azalea-workshop-art.ts paintAzaleaWorkshopFurnishing(c,mapId,o,flags) 기존 선별대/선반/휴게석 동일depth 훅 중앙 요청. 분리 접시/간격/바람 또는 받침/휴식자리 표시. 신규 맵·가구 footprint·출구 변경 없음.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Kurt , 2026-09-13 본문 HGSS 항목 확인. 원작 강집은 고동 북서 집에서 규토리로 볼을 만들며 HGSS는 같은 종류 여러 개를 다음 날 제작한다. 이번은 기존 공방의 현장 재료 분리/건조/휴식이라는 넥서스 선택 작업이며 원작 제작·시간·보상·야돈우물 해금을 구현했다고 주장하지 않는다. 외부 코드/자산 재사용 없음.
- 상태/남은점: 자료·소스 읽기 및 코드 반영. QA 전부 미실행. 중앙 renderer가 기존 가구 직후 같은 depth에 painter를 연결했다고 회신했다. 자연 진행/저장/재방문/동료변경/그림 검증 미실행. 공방 전체 품질·CH04/호수 완료 아님.

## 금빛 수신 장면 후속 — 실제 생활자리 표시

- 기존 home3 청취 소파 tourExhibit2를 피카츄의 청취 자리로 명명하고 기존 blocked footprint 안에 방석·물그릇·등록 field-pikachu를 그린다. 신규 보행 장애/워프/방 크기 변경 없음. 중앙 renderer가 기존 동일-depth Furnishing 훅에 다섯 번째 this.images 전달을 적용했다고 회신했다. 피카츄·방석·그릇의 실제 렌더 소비 연결 반영, QA 미실행.
- 수신 전 동료가 수신기 쪽을 보며 앉고, ReceiverConfirmed 후 물그릇의 물과 정돈된 방석/동료 방향이 바뀐다. tourExhibit2 조사에서 전후 반응을 읽는다. 실제 NPC 이동 애니메이션/음성은 없고 가구 위치에 지속되는 생활 표현이다. 포획·보상·별도 본편완료 플래그 없음.
- player 객체 참조 guard 및 이미 기록된 결과의 persist 생략 반영. QA 모두 미실행. 출처/프로젝트 구분은 아래 금빛 본편 묶음과 동일.

## 최신 본편 묶음 — 금빛 CH04 첫 연락과 생활 장비

- 현재 도시: 중앙의 명시 배정으로 무궁 보수에서 기존 금빛시티 CH04 도입으로 전환. 무궁29/46 미검증 작업은 보존한다.
- 조건/진입: `nexusCinnabarIanContactConfirmed`가 있어야 `tour_goldenrod_station`/`tourHost`에서 이안 납품 연락을 선택할 수 있다. 없으면 기존 역 일상 그대로. 최초 대사를 끝내면 `nexusGoldenrodIanBriefed`만 기록하며 교통을 잠그지 않는다.
- 실제 현장: `tour_goldenrod_hall`/`tourExhibit0` 공개 조정석 시험 송출 → `nexusGoldenrodTestSent`; 이어 `tour_goldenrod_home3`/`tourExhibit0` 수신 다이얼 확인 → `nexusGoldenrodReceiverConfirmed`. 송출 전에 수신하면 대기 안내만 한다. 수신 장면에서 주민이 작업을 멈추고 동료의 휴식/그릇을 챙기는 모습을 대사로 보여준다. 배우 이동/실제 음성 송출 연출은 미구현이다. 두 기기 상태등은 별도 painter로 상태를 표시한다.
- 결과/재방문: 수신 후 역에 돌아와 이안과 원본/현장 결과를 대조하고 유진의 구조 체계 관심을 드러낸다. 명시 전달 뒤 `nexusGoldenrodInquiryReady`. 모두 첫 결과만 persist, 기존 상태 재방문은 회고/길안내다. 금빛의 도움이 사업 전체 안전을 증명하지 않으며 공방·숲·인주 생활과 이후 호수 경보/물 공급을 따로 조사할 이유를 남긴다. CH04 완료·황토/호수 해결·신규 보상 없음.
- 소비: `src/goldenrod-nexus.ts` export `handleGoldenrodNexus(g,event,ordinary)`를 기존 `handleGoldenrodRadio` 첫 분기에 연결. public bypass로 역 안내/방송 체험을 보존한다. 역 남문/무료 노랑 왕복/주민/상점/맵 크기 유지. 공통 engine/world/data 수정 없음.
- 중앙 시각 훅: `src/goldenrod-nexus-art.ts` export `paintGoldenrodNexusFurnishing(c,mapId,o,flags):void`. 두 map의 `tourExhibit0` 가구만, 실제 o.x/y 기준. IanBriefed 후 대기등, TestSent/ReceiverConfirmed 후 켜짐. 기존 가구와 같은 depth draw 뒤 호출 요청 전달(캐시배경/전체 배우 뒤 금지). 중앙이 기존 가구 depth draw에 연결 완료했다고 회신했다. 중앙 목표도 역→탑→주택→역 순으로 연결했다. 런타임 검증은 미실행이다.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Goldenrod_City , 2026-09-13 실제 본문 확인. HGSS 도시의 통신/상업 역할, 라디오타워·금빛역·주택 시설 및 금빛↔노랑 열차 연결. 원작은 승차권/발전소 조건이 있으나 넥서스 무료 왕복은 유지한다. 팀 아크·이안·시험 채널·생활 수신 장면은 NEXUS_STORY_MASTER CH04~05 §1의 프로젝트 채택 각색이다. 원작 로켓단 사건/7배지 잠금/원작 트레이너는 도입하지 않았다. 외부 코드/자산 재사용 없음.
- 검증/남은 본편: 자료/소스 읽기·코드 반영, QA 전부 미실행. 중앙 시각/목표 훅은 연결 회신 수신. 다중 장소 자연 진행/저장/재방문/방송 공존 검증은 미확인. 워프 후 같은 좌표 재진입에 대비해 세션 guard에 save.player 객체 참조도 포함한다. 생활 장면의 배우 동작은 후속이며 CH04 전체와 금빛 도시 완료는 아님. 황토·호수는 후속, 이번 묶음 종료.

## 최신 묶음 — 해안길과 꽃길 주택 남쪽 연결

- 변경: 기존 주택 서쪽 x6..7 길은 y30 뒤 막혀 남쪽 산책축과 끊겨 있었다. 기존44×40 안에서 `(6,31)4×3` 바닥을 열어 서쪽 관찰대→주택 서쪽→남쪽 산책축→집 문/공동화단으로 돌아오는 길을 연결했다. 기존 바닥·건물·문·워프·조사물·수역은 유지한다.
- 그림: 기존 `paintCherrygroveGround`의 해안 포장을 y33까지 이어 남쪽 x16까지 꺾었다. 물 경계가 바뀌는 y24/x4..5와 y35/x6..13에 방파제 가로 반환면을 추가했다. 벽은 물의 막힌 칸 안, 길 이음은 실제 보행 칸에만 그린다.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Cherrygrove_City , 2026-09-13 본문 확인. HGSS City Tour는 센터·상점·30번 출구·바다·주택을 잇고 서쪽 섬은 Surf가 필요하다. 이번 남서 보행 연결/방파제는 그 생활 공간 관계를 참고한 넥서스 기존 배치 보수이며 원작 지도 타일 복제가 아니다. 원작 지도 이미지는 미열람. 섬 이동/Surf/보상/투어 강제는 추가하지 않았다. 외부 코드/자산 재사용 없음.
- 소비: `johto-cherrygrove.ts` open→walkable, `johto-cherrygrove-art.ts` 기존 배경 painter. 중앙 훅/공통 renderer/data/센터 life 수정 없음.
- 검증/남은점: 소스·자료 읽기만 수행. 테스트/타입/빌드/게임 브라우저/저장/시청각 QA 미실행. 실제 보행·카메라 시야에서의 해안 품질은 미검증이며 도시 완료 아님. 한 묶음 종료.

## 최신 묶음 — 무궁 상점 정면 진입로

- 결함/변경: 상점 문(32,11) 남쪽의 기존9×2 연속 꽃밭이 정면 접근을 막아 동쪽 끝 우회를 요구했다. 꽃밭을 서쪽(28,13)3×2/동쪽(33,13)4×2로 나눠 x31..32,y13..14 네 칸을 보행로로 열고 x31..32,y12..19 포장으로 동서 큰길과 문을 연결했다. 기존 동쪽 우회도 유지한다.
- 실제 소비: `johto-cherrygrove.ts`의 feature 배열이 충돌·월드 feature 등록을 함께 생성한다. `johto-cherrygrove-art.ts`의 기존 `paintCherrygroveGround`에서 같은 두 화단 범위와 진입 포장을 그린다. 공통 renderer/전투/JSON 수정 및 중앙 훅 필요 없음. 유효 바닥·문/실내 귀환 워프·NPC·44×40 유지.
- 출처: https://www.serebii.net/pokearth/johto/cherrygrovecity.shtml , 2026-09-13 본문 확인, HGSS/Gen IV. 확인 사실은 북쪽30번/동쪽29번 출구, 해변과 작은 섬, 프렌들리숍의 보급 역할이다. 원작 지도 이미지는 이번에 열람하지 않았다. 꽃밭 사이2칸 출입로는 기존 프로젝트 시설 접근 보수이며 원작 타일 배치 복제가 아니다. 파도타기/섬 접근/새 물품은 미적용. 외부 자산/코드 재사용 없음.
- 상태: 자료 확인·코드 반영. 모든 QA 중단에 따라 테스트/타입/빌드/게임 브라우저/저장/시청각 미실행. 실제 문 접근/화면은 미검증, 도시 완료 아님. 다음에는 남은 해안과 시설 간 공간 품질을 이어 보수한다.

## 최신 묶음 — 46번 공터 동료 편성·실전·귀환

- 실제 변화: `route46Trainer`의 대화 진입을 `johtoRoute46Practice`로 연결했다. 현재 파티에서 동료 선택 → 기존 `leadPokemon`으로 실제 선두 변경/저장 또는 `showMoveSchool`로 실제 기술 편성 → 기존 `handleRoadTrainer`의 `tourRoute46Trainer` 배틀 상담으로 이어진다. 현지 포획 여부는 잠금으로 쓰지 않는다. 기절한 동료는 회복 안내, 파티가 없으면 PC 안내로 분기한다.
- 결과: 기존 `trainerWon:johto-route-46-practice`만 읽어 승리 후 재방문을 구분하며 동료 편성·무궁센터 귀환·45번 출발을 제공한다. 전투 직후 자동 화면은 추가하지 않았으며 다시 말 걸 때 후속 행동이 열린다. 보상 재지급·새 승리 플래그·실전 참여 종 추정 없음.
- 소비 위치: 새 `src/johto-route46-practice.ts`를 기존 `handleJohtoBlackthornSouthLife` 첫 분기에 연결. `johto-blackthorn-south.ts` NPC 대화와 지방 내 길안내 2곳을 새 공개 이벤트로 맞췄다. 공통 전투·파티·JSON은 수정하지 않았다. 내부 기존 배틀 event/id/reward/team은 유지하며 공통 추가 훅 필요 없음.
- 출처/확인: https://www.serebii.net/pokearth/johto/route46.shtml , 2026-09-13, HGSS/Gen IV 지리·낮 출현·트레이너 표 본문. 원작46은29/45 연결과 남향 낙차, 꼬마돌·깨비참·꼬렛 생태가 있으며 Ted/Erin/Bailey 트레이너 구성이 따로 있다. 현재3종 선택 실전과 레벨·보상·양방향 우회 귀환은 기존 넥서스 재구성으로 원작 트레이너 복제가 아니다. 이번 코드는 기존 실전 주변 준비/귀환 연결만 변경한다. 외부 코드/자산 재사용 없음.
- 관련 근거: [REFERENCE_RESEARCH](../REFERENCE_RESEARCH.md), [WORLD_ROUTES](../WORLD_ROUTES.md#성도29번도로-풀언덕-합류-보수), [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md#무궁29번도로-현지-동료-여행). 중앙의 지방 파일/인계 한정 지시에 따라 이번 정확 출처 기록은 이 절에 두며 상위 문서에는 복제하지 않았다.
- 검증/남은 요구: 소스 읽기와 원작 자료 확인만 수행. QA 전부 중단으로 타입/테스트/빌드/브라우저/저장/시청각 미실행. 실제 선두 출전·기술 변경·승리 후 재진입·길안내는 미검증. 도시 전체 시각 품질·본편 사건·30번/연두 후속 연결은 완료 아님. 이번 묶음 종료, 사용자 continue 때 현재 도시를 이어간다.

## 최신 묶음 — 29번 풀언덕 동쪽 본선 합류

- 변경: 기존 남쪽 접근에 더해 북서 풀언덕 동쪽25..29/y10..12 보행 연결을 열고 포석을 기존 painter에 연결했다. 풀밭 조사 안내도 양쪽 접근을 설명한다.80×32·기존 저장 위치·조우 범위·외부 워프 유지.
- 근거: REFERENCE_RESEARCH의 성도29번도로 선택 풀언덕 절에 Bulbapedia/Serebii 정확 URL·확인일·HGSS 사실·프로젝트 차이·소비 위치·QA 미실행을 기록하고 WORLD_ROUTES/MAP_STORY_DESIGN에 연결했다.
- 검증: 소스/자료 읽기만 수행. 테스트·빌드·브라우저·저장·시청각 QA 미실행, 도시 완료 아님.
- 다음: 기존29번 생태→무궁 회복→46번 선택 실전의 행동 연결을 이어 보수. 신규 맵 확대보다 현재 장소 우선.

## 최신 묶음 — 29번도로 실제 만남·포획 연결

- 핵심 부족: 무궁 동쪽29번도로에 풀언덕 외형/안내만 있고 실제 야생 조우가 없었다. 기존 북서쪽 언덕 보행 칸에 긴풀 3영역을 지정하고 `J-R29-DAY`를 공통 조우 소비에 연결했다. 기존 painter가 terrain을 그대로 그린다. 동서 본선·언덕 조사 접근로·46번 합류·쉼터·무궁 귀환 워프는 안전길로 유지한다.
- 데이터: `scripts/design/runtime-local-pools.json` 원본과 `src/runtime-pokemon-data.json` 실행 풀을 함께 추가하고 원본 SHA256 기록을 갱신했다. 지원 종 구구16·꼬렛19를 사용하며 새로운 종/기술/저장 스키마를 만들지 않았다. 전체 exporter/테스트/빌드는 실행하지 않았다.
- 출처: 2026-09-13 https://www.serebii.net/pokearth/johto/route29.shtml HGSS 낮 지상 조우는 구구·꼬리선·꼬렛. 현재 미지원 꼬리선은 제외했다. 레벨20~22·비율80/20은 기존 성도 진행용 프로젝트 설정으로 원작 레벨2~4/출현율과 다르다. 밤·박치기·라디오 조우는 미적용이다.
- 플레이 연결: 기존 야생전/포획에서 출신을 성도29번도로로 기록하며 주민의 실제 보유 반응에도 포함한다. 무궁 센터/PC/숍 →29번 선택 포획→기존 남쪽 쉼터 기술 편성→46번 선택 실전 경로를 기존 기능으로 이용할 수 있도록29번 풀언덕 길안내와 생태 문구를 갱신했다. 필수 포획 잠금·보상·새 사건 없음.
- 검증/미완료: 소스와 출처를 읽어 구현했다. QA 중단으로 테스트·타입 검사·빌드·브라우저·저장·시청각 검증은 미실행. 실제 포획/재로드/풀 표시/난이도는 미검증이며 도시 완료가 아니다. 이번 묶음은 여기서 종료한다. 다음 사용자 continue에서 기존 장소 보수를 이어간다.

## 최신 묶음 — 해안 주민과 꽃 돌봄 재진입 안내

- 변경: 해안 산책 주민의 대사 event를 전용으로 분리해 꽃길 주민집·해안 관찰대·공동 화단으로 기존 목적지 안내를 연결했다. 동쪽 길잡이는 기존 여행 준비 반응을 유지한다. 주민 좌표·보행/충돌·워프는 변경하지 않았다.
- 활동: 동료 미선택/파티 이탈은 주민집, 기절은 센터, 바람 미확인은 해안 관찰대로 안내 선택을 제공한다. 설치 후 해안에서도 화단을 직접 조사한 것처럼 말하던 문구를 현재 장소에 맞게 나누고 주민집 복귀 안내를 추가했다. 기존 완료/바람 기록과 회복 규칙은 유지한다.
- 검증: 기존 NPC·활동 처리 소스를 읽어 구현했다. 모든 QA 중단에 따라 테스트·타입 검사·빌드·브라우저·저장·시청각 검증 미실행. 길안내의 실제 도착 동작과 도시 완료는 미검증이다.
- 다음 continue: 무궁 생활 포켓몬의 생성/표시 데이터와 외부 조사물 렌더를 읽고, 해안 관찰 위치에서 남은 시각 표현 불일치를 보수한다. 새 맵/확대보다 기존 장소를 우선한다.

## 최신 묶음 — 무궁 주택·숍 조사물 전용 표현

- 변경: 기존 조사물 6개에 `johto-cherrygrove-furniture-art.ts` 전용 painter를 작성하고 `paintTourFurnishing`에 연결했다. 꽃 화분은 2단 화분대, 낮잠 자리는 방석·물그릇, 해안 기록은 바람/물결 기록, 생활책은 책등·펼친 책, 여행용품은 물통·접힌 지도, 도로 준비표는29번 동서축과46번 북쪽 분기로 표현한다.
- 보존: 기존 event·상호작용·충돌·가구 크기·보행 칸·워프를 유지한다. 그림은 각 가구 footprint로 clip한다. 신규 판매품·회복·진행 해금은 추가하지 않았다.
- 검증: 기존 가구 데이터와 공통 가구 렌더 분기를 읽고 구현했다. QA 중단에 따라 테스트·타입 검사·빌드·브라우저·저장·시청각 검증을 실행하지 않았다. 실제 화면·도시 완료는 미검증이다.
- 다음 continue: 무궁 외부의 주민·생활 포켓몬 위치와 꽃 돌봄 조사 동선을 소스로 대조하고, 기존 활동 위치에서 남은 시각적 안내/접근 불일치를 보수한다. 새 지도·크기 확장으로 넘어가지 않는다.

## 최신 묶음 — 무궁시티 실내 기능과 가구 표현

- 변경: 센터의 회복 안내판이 공통 의자 fallback으로 그려지던 경로에 전용 안내판 painter를 연결했다. 기존 차트 footprint 안에 세 가지 안내 그림과 받침을 표현한다.
- 실내: 센터·숍의 서비스 접근/대기·열람 바닥, 두 주택의 나무 바닥·생활 깔개·북쪽 해안 창문을 기존 배경 렌더에 연결했다. 바닥은 실제 보행 칸에만 적용하고 창문은 북쪽 벽 안에 둔다. 가구·워프·NPC·상호작용·맵 크기는 변경하지 않았다.
- 검증: 렌더 소비 경로와 가구 event를 소스로 참고해 구현했다. 사용자 QA 중단 지시에 따라 테스트·타입 검사·빌드·브라우저·저장·시청각 검증은 실행하지 않았다. 화면 품질과 도시 완료는 미검증이다.
- 다음 continue: 두 주택의 기존 식물·해안 기록/책장과 숍 여행용품이 실제 조사 내용에 맞게 보이는지 가구별 공통 렌더를 읽고 전용 표현을 보수한다. 새 가구로 보행 칸을 막거나 새 맵으로 범위를 넓히지 않는다.

## 최신 묶음 — 46번도로 보행면 구분

- 변경: 기존 `paintJohtoBlackthornSouth` 호출에46번 전용 보행면 표현을 연결했다. 중앙 흙길, 동쪽 귀환 굽이의 낮은 포석 이음, 서쪽 조우 풀밭 옆 마른 접근띠, 트레이너 `(23,58)` 주변 실전 공터를 각각 배치했다. 긴풀은 실제 terrain 범위를 제외한 바닥 위에 기존 렌더로 유지한다.
- 불일치 보수:46번 낙차 턱의 어두운 벽면을 보행 y=22 위에서 제거하고 실제 막힌 y=24 행 안에 그린다. y=23 워프 진입 칸을 가리지 않는다.45번 표현·기존 워프·충돌·조우·크기는 변경하지 않았다.
- 검증: 맵 생성 소스와 painter 호출을 읽어 작성했다. 테스트·빌드·브라우저·저장·시청각 QA 미실행, 실제 화면 품질은 미검증이다.
- 다음 continue: 무궁시티 필수 실내의 기존 주민/센터/상점 가구가 실제 서비스·생활 역할에 맞게 보이는지 `johto-cherrygrove.ts`와 실내 렌더 소비 경로를 소스로 대조하고, 넓은 실내의 남은 빈 공간을 기능 동선 중심으로 보수한다. 도시 완료가 아니다.

## 최신 묶음 — 46번도로 조사 접근·쉼터 기술 편성

- 변경: 북쪽 귀환 표석을 `(12,7)`→`(14,7)`, 생태판을 `(11,47)`→`(10,47)`로 옮겨 각각 기존 길 `(15,7)`·`(9,47)`에서 조사하게 했다. 모두 기존 막힌 칸으로 이동해 유효 보행 위치는 보존했다. 조우 풀에서 막힌 쉼터 `(8,47)`만 제외하고 나머지 풀밭·기존 종/레벨은 유지했다.
- 행동 연결:46번 쉼터와29번 도착 쉼터에서 파티 동료 선택→기존 `showMoveSchool` 기술 편성→46번 선택 트레이너/무궁센터 길안내를 연결했다. 기절한 동료는 회복 안내로 분기한다. 새 학습 규칙·무료 회복·보상·강제 실전은 추가하지 않았다.
- 검증: 맵 좌표·트레이너 배치·기술 편성 호출을 소스로 읽었다. 테스트·빌드·브라우저·저장·시청각 QA 미실행, 도시 완료가 아니다.
- 다음 continue: `src/johto-blackthorn-south-art.ts`에서46번도로의 마른 선택 실전 공터·서쪽 풀밭 입구·동쪽 귀환 오르막을 구분하는 보행면 표현을 보수한다.45번도로 및 새 지도 확장으로 범위를 넓히지 않는다.

## 최신 묶음 — 29번도로 지형과 합류 안내 접근

- 변경: `johto-blackthorn-south-art.ts`의 기존 호출 안에서29번도로 전용 지형을 그린다. 무궁 서쪽 도착은 포석, 동서 본선은 흙길,46번 북쪽 접근은 돌바닥 이음, 북서 풀언덕·남쪽 쉼터는 짧은 잔디와 가지 길로 구분했다. 기존 전체 보행면이 같은 길로 칠해지던 표현을 덮고, 둑의 측면·흙층은 막힌 칸 안에만 그린다. 조우 긴풀은 추가하지 않았다.
- 접근 수정:46번 합류 안내 `(64,9)`는 네 인접 칸이 모두 막혀 있었다. 이미 막힌 `(65,9)`로 옮겨 기존 본선 `(66,9)`에서 조사하도록 수정했다. 유효 보행 칸·워프·크기80×32는 보존한다.
- 검증: 소스 읽기로 렌더 호출 위치·충돌/조사 좌표를 대조했다. 테스트·빌드·브라우저·저장·시청각 QA 미실행. 원작 새 사건/지형 기믹을 채택한 것이 아닌 기존 프로젝트 구간 표현 보수다.
- 다음 continue:29번도로 쉼터와46번도로 선택 풀밭의 조사/트레이너 접근을 소스로 대조하고, 도착→현지 동료→선택 실전→무궁 귀환에서 남은 장소별 행동 누락을 보수한다. 도시 완료가 아니다.

## 최신 묶음 — 29·46번도로에서 실제 시설로 귀환

- 변경: 두 도로 여행자의 준비 메뉴를 무궁센터 회복 `tourHost`, PC `tourExhibit1`, 상점 `martClerk` 목적지로 연결했다. 현재 파티 부상 수와 실제 몬스터볼/상처약 수량을 읽는다. 이동은 기존 경로 안내이며 순간이동·무료 보급이 아니다. 대화 콜백은 원래 저장/맵/비전투 상태에서만 작동한다.
- 누락 수정: 표석·생태판에 작성한 장소 설명이 공통 상태 메시지로 덮이던 것을 수정했다.46번 남쪽 표석의 무궁 미개통 설명과29번의 부정확한 야생 안내를 현재 연결/조우 상태로 맞췄다.
- 검증: 관련 소스 읽기만 수행, 테스트·빌드·브라우저·저장·시청각 QA 미실행. 지형·워프·상점 가격·보상 변경 없음.
- 다음 continue: `src/johto-blackthorn-south-art.ts`의29번도로를 기존 크기에서 보수한다. 무궁 도착길/46번 북쪽 합류/풀언덕 선택 가지가 같은 넓은 바닥으로 보이는 문제를 실제 walkable과 맞는 지형·길 표현으로 구분한다. 새 조우나 새 맵 추가는 별도 범위다.

## 최신 묶음 — 꽃길 활동 재방문 이어하기

- 변경: `johto-cherrygrove-care.ts`에서 주민집 화분과 주민 대화를 같은 활동 입구로 연결했다. 진행 중이면 선택 동료·바람 확인 상태를 읽어 해안/화단 이어하기를 제공하고, 기절한 동료는 기록을 유지한 채 센터 회복으로 안내한다.46번도로 출신이면 해당 생활 반응도 표시한다.
- 재시작 경계: 동료 다시 고르기는 별도 메뉴로 분리했다. 메뉴를 열거나 취소하는 것만으로 기록을 지우지 않으며 건강한 동료를 실제 선택했을 때만 바람 확인을 초기화한다. 완료 기록은 재방문 시 유지한다.
- 검증: 기존 호출 경로와 상태 분기를 소스로 읽었다. 테스트·빌드·브라우저·저장·시청각 QA는 미실행이다. 도시 완료가 아니다.
- 다음 continue: 무궁시티와29/46번도로의 현행 안내에서 과거 미개통/동쪽 합류부만 표시하는 문구가 남은 곳을 실제 출구와 대조하고, 도로에서 센터·상점으로 돌아오는 준비 동선을 보수한다. 새 맵을 추가하지 않는다.

## 최신 묶음 — 해안·주택·공동 화단 생활길

- 변경: 기존 해안 관찰대 `(7,23)`에서 서쪽 주택 옆 `(6..7,24..30)`과 주택 현관 앞 `(8..16,29..30)`을 지나 공동 화단 남쪽 `(17..26,28..31)`으로 포장 표현을 이었다. 기존 보행 칸에만 그리며 새 맵·확대·충돌/워프 변경은 없다. 상점 동쪽 우회 포장은 보존한다.
- 불일치 수정: 화단 기둥이 y=28 보행 칸으로 걸치던 그림을 y=27의 막힌 화단 안으로 옮겼다. 조사물 `(21,27)` 앞 `(20..22,28)`은 낮은 디딤 포장으로 표시하고 기둥을 치웠다. 주택 주민의 실제 위치를 실내 host 좌표 `(7,8)`와 맞췄다.
- 연결/검증: 기존 `paintCherrygroveGround` 호출을 그대로 사용한다. 소스 읽기만 수행했으며 테스트·빌드·브라우저·저장·시청각 QA는 실행하지 않았다. 도시 완료가 아니다.
- 다음 continue: `src/johto-cherrygrove-care.ts`에서 활동 중 주민집을 다시 찾았을 때 무조건 동료 재선택 화면이 열려 바람 기록이 지워지는 흐름을 보수한다. 이어하기/다른 동료로 다시 준비를 구분하고 현지 동료 반응과 연결한다.

## 최신 묶음 — 파티 변경 시 꽃길 동료 추적

- 변경: `johto-cherrygrove-party.ts`가 파티 변경 전 실제 객체를 잡고 변경 후 같은 객체의 슬롯을 찾는다. `team.ts` 선두 변경, `journey-services.ts` PC 맡기기, `pc-swap.ts` 파티/박스 교체의 성공 경로에 연결했다. 다른 동료가 빠지거나 선두가 바뀌면 선택 슬롯을 따라가고, 선택 동료를 맡기거나 교체하면 미완료 선택·바람 확인만 해제한다. 같은 종끼리 교체해도 활동이 넘어가지 않는다.
- 보존: 실패·취소·이미 선두인 경우는 변경하지 않는다. 완료된 설치 기록과 그림은 보존한다. PC에서 데려오기는 끝에 추가하므로 기존 선택 슬롯이 바뀌지 않는다. 개체 UID나 공통 저장 스키마를 추가하지 않았다.
- 검증: 관련 변경 경로를 소스로 읽었으며 테스트·빌드·브라우저·저장 QA는 미실행이다. 과거 버전에서 이미 잘못 이어진 기록까지 식별·복원하는 이행은 제공하지 않는다.
- 다음 continue 시작: `src/johto-cherrygrove.ts`와 `src/johto-cherrygrove-art.ts`에서 공동 화단 `(21,27)`의 조사 접근 및 꽃길 주민집→해안→화단 동선을 소스로 읽고 남은 지형/표현 불일치를 보수한다. 도시 완료로 판정하지 않는다.

## 최신 묶음 — 센터 PC·회복 장치 복구

- 변경: 센터 `(3,8)` 회복 장치와 `(11,8)` PC를 가구/충돌/조사물로 등록했다. 각각 기존 `tourHost→nurse`, `tourExhibit1→pcMenu` 실행 경로를 사용한다. 센터 여행 안내에서 회복·PC 편성·46번도로 목적지를 선택한다. 상점 진열대/도로 준비표 이벤트에 `tour` 접두어를 적용해 공통 실내 조사 처리에 도달하게 했다.
- 검증: 소스의 Engine.event, isWorldCenter, journey-services PC 분기와 가구 렌더 소비를 읽었다. 테스트·빌드·브라우저·저장·음향 QA는 실행하지 않았다. 기존 출입구·보행 축·다른 담당 변경은 보존했다.
- 남은 문제: 실제 PC 입출고·회복·길안내는 실행 미검증.29번 야생 조우와30번도로/연두마을 연결은 여전히 미구현이며 도시 완료가 아니다.
- 다음 continue: `src/johto-cherrygrove-care.ts`의 선택 동료 추적을 기존 PC 입출고·파티 정렬 방식과 대조하여 다른 동료로 활동을 이어버릴 수 있는 경계를 보수한다. 공통 개체 ID 스키마를 임의 추가하지 않는다.

## 다음 구현 묶음 — 공동 화단 바람막이

- 변경: `johto-cherrygrove-care.ts`를 기존 life 핸들러 첫머리에 연결했다. 꽃길 주민집 화분에서 동료 선택 → 해안 관찰대에서 바람 확인 → 기존 공동 화단 `(21,27)`에서 설치 방향 선택 → 주민집 재방문 순서다. 동쪽 오답은 재시도, 취소는 진행 보존, 기절/파티 이탈은 진행 보류한다. 재선택은 이전 중간 기록을 초기화한다.
- 실제 결과: 기존 flags에 선택 슬롯·종과 바람 확인·설치 완료를 기록한다. renderer.ts에는 import와 호출만 추가해 설치 완료 시 기존 막힌 화단 안에 천 바람막이를 그린다. 새 맵·확대·보상·HP 변경·통행 잠금은 없다. 원작 사건이 아닌 기존 꽃길 생활의 프로젝트 선택 활동이다.
- 검증 여부: 소스 읽기만 수행. 테스트·빌드·브라우저·저장·시청각 QA는 중단 유지, 전부 미검증.
- 남은 문제: 포켓몬 저장에 개체 UID가 없어 기존 방식인 슬롯/종 기준이다. 동일 종을 같은 슬롯으로 교체하면 구별하지 못한다.29번 조우 미구현과30번/연두 경계는 그대로다.
- 다음 continue 시작: `src/johto-cherrygrove.ts`의 센터 healer/PC 조사물과 실제 서비스 등록을 읽고, 회복→편성→29/46번 귀환 흐름의 남은 시설 누락을 같은 도시 안에서 보수한다. QA는 재개하지 않는다.

- `src/johto-cherrygrove-life.ts`: 기존 외부 주민, 두 주택 주민/생활 조사물, 센터 휴게석/안내도가 실제 party·box·met·HP를 읽는다. 현지 동료 없음/건강/부상/기절/PC 보관 및 전체 파티 회복 필요를 구분한다. HP·아이템·보상·저장을 변경하지 않는다.
- `src/johto-blackthorn-south-life.ts`: 기존 journey-services 호출 경로 첫머리에서 새 핸들러를 실행하도록 연결했다. 공통 연결 추가는 필요 없다.29번 여행자의 무궁 미연결 안내를 고치고 무궁 목적지 선택을 추가했다.
- 데이터 경계: 현재29번도로 terrain은 비어 있으며 조우가 없다.46번도로 기존 꼬렛·깨비참·꼬마돌 안내를 사용한다.29번 출신 문자열은 기존 저장에 있을 때만 읽고 실제 포획 가능으로 안내하지 않는다. 새 원작 사실·종·조우·맵·보상·잠금은 채택하지 않았다.
- 보존: 센터 간호사 tourHost 및 PC/상점 이벤트는 가로채지 않는다. 문·우회길·워프·저장 ID 불변. 테스트·빌드·브라우저 QA는 미실행이며 대화의 실제 출력·서비스 회귀는 미검증이다.
