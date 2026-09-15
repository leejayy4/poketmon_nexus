# 관동 홍련·20번수로·쌍둥이섬 인계 — 2026-09-15

## 방문 수첩 층별 랜드마크·현행 항로 정합

- 층별 등록: `kanto-seafoam-islands.ts`의 `PASSAGE_PLACES`가 공통 ‘얼음 수로 경계’를 반복하지 않고 현장 오브젝트와 정확히 같은 1F `동서 출구도`, B1F `수로 얼음 능선 표석`, B2F `갈라진 얼음판 표석`, B3F `굽은 암반길`, B4F `깊은 냉기 관찰대`를 사용한다. 각 concept도 시작층·선택 능선·얼음판/바위 곁길·깊은 회랑·최하층 횡단의 실제 역할을 설명한다.
- 랜드마크 길안내: `explore-panel.ts`는 각 이동 구간의 `landmark`와 `TOUR_OUTDOORS[MapId].objects[].name`이 같은 경우 그 오브젝트 이벤트를 길안내 목표로 함께 전달한다. 따라서 쌍둥이섬 각 층 버튼은 입구에서 멈추지 않고 실제 출구도·표석·암반길·관찰대 앞까지 현재 보행 경로를 계산한다. 일치하는 오브젝트가 없는 다른 통로는 기존 MapId 입구 안내를 유지한다.
- 오래된 안내 교정: 쌍둥이섬 외부의 방문 랜드마크를 ‘닫힌 동굴 입구’에서 실제 `쌍둥이섬 동쪽 동굴 입구`로 바꿨다. `tourRoute20CinnabarClosed`는 저장 호환 이벤트 ID를 유지하되 화면 이름/본문은 전 층 통과 뒤 20번수로 서쪽→홍련 상륙과 센터·연구소→쌍둥이섬·연분홍 귀환이 현재 연결됐음을 안내한다.
- 경계·상태: [Bulbapedia Seafoam Islands](https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands)의 Route20 양쪽 연결과 5층 구조를 HGSS 기준으로 재확인했다. 새 워프·좌표·잠금은 없으며 QA 중단으로 수첩 표시·현장 표지·랜드마크 보행 안내는 미검증이다.

## 방문 수첩의 19·20번수로·쌍둥이섬 층별 등록

- 문제: `markTourVisit`은 `PASSAGE_PLACES`의 도로·동굴 MapId를 방문 목록에 저장했지만 `journalPlaces()`와 화면 목록은 도시·일부 예외 장소만 열거했다. 그 결과 19번수로·20번수로·쌍둥이섬 외부/각 층을 실제 방문해도 사용자가 지방별 방문 수첩에서 개별 구간을 확인하거나 다시 길안내할 수 없었다.
- 적용: `explore-journal.ts`의 `journalPassages(region)`이 실제 `TOUR_MAPS`가 있는 `PASSAGE_PLACES`를 지방별로 수집하고 도시와 중복되는 ID를 제외한다. `explore-panel.ts`는 도시·자연과 도로·동굴 방문 수를 분리하고, 각 이동 구간의 공식 번호/고유명·층명, 랜드마크, 방문 여부, 실제 MapId 길안내 버튼을 표시한다. 관동에서는 `tour_kanto_route_19`, `tour_kanto_route_20`, `tour_kanto_seafoam_exterior`, `tour_kanto_seafoam_1f/b1f/b2f/b3f/b4f`가 이 경로로 소비된다.
- 여행 순서: 관동 남부 항목은 이름순이 아니라 연분홍 출발 기준 `19번수로→20번수로→쌍둥이섬 외부→1F→B1F→B2F→B3F→B4F`로 먼저 정렬한다. 그 밖의 관동 이동 구간은 기존 세계 등록 순서를 보존한다. 역방향 귀환도 같은 MapId를 사용하므로 중복 항목을 만들지 않는다.
- 경계·상태: 지도 본체에 근거 없는 좌표나 이동선을 추가하지 않았고 개발용 즉시 이동 목록에도 통로를 섞지 않았다. 길안내만 현재 워프·충돌 경로를 사용한다. QA 중단으로 방문 집계·필터·버튼·층별 현재 상태·화면 배치와 다른 지방 목록은 미검증이며 완료 판정이 아니다.

## 쌍둥이섬 전 층 계단 방향·귀환 표석 표현

- 근거·버전: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://archives.bulbagarden.net/wiki/Category:Seafoam_Islands_maps , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml (2026-09-15, HGSS). 개별 층 지도들의 사다리 연결과 동서 분리 통로를 기존 MapId 워프에 대조했다.
- 적용·차이: `kanto-south-art.ts`가 1F=0, B1F=1, B2F=2, B3F=3, B4F=4의 깊이를 실제 워프 대상과 비교해 모든 동굴 계단에 상승/하강 방향 표식을 그린다. 과거 B1F·B2F 전용 분기에서 빠졌던 1F·B3F·B4F도 같은 규칙을 소비한다. B3F/B2F/B1F 동쪽 상승 회랑과 1F 서쪽 출구의 조사물은 일반 가구 대신 냉기 표석·남쪽 진행 화살표 실루엣으로 표시한다.
- 경계·상태: 계단 그림은 기존 워프·충돌·도착점·경로 선택을 바꾸지 않으며 원작 타일/이미지를 재사용하지 않은 Canvas 재구성이다. QA 중단으로 실제 층별 방향 표시, 카메라·배우 겹침, 표석 가독성과 BW·BW2풍 화면 품질은 미검증이며 쌍둥이섬 완료가 아니다.

## 20번수로 실전 뒤 쌍둥이섬 B4F 재탐험

- 근거·버전: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B4F_HGSS.png , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (2026-09-15, HGSS). 원작 B4F의 최하층 냉기 공간과 양쪽 사다리를 재탐험 목적지 근거로 유지한다.
- 적용·차이: `seafoam-exploration.ts`의 홍련 수첩은 20번수로 실제 참가 승리 뒤 B4F 냉기 관찰대를 다시 안내한다. 플레이어가 실제 `tourSeafoamB4Cold`에 도달해야 `seafoamB4BattleReturnObserved`가 저장된다. 추적 동료가 파티에 있으면 귀환전 시작→현재 레벨·HP를 표시하고, PC 이동·편성 변경으로 슬롯이 없으면 당시 승리 기록과 현재 동료 상태를 구분한다. 원작 고정 사건이 아니라 포획·성장·귀환을 잇는 넥서스 선택 활동이다.
- 연구 귀환: 관찰대에서 홍련 연구소 `tourExhibit2`로 안내하며, `cinnabar-research.ts`가 같은 실제 참가 동료의 귀환전 결과와 B4F 재탐험 여부를 함께 읽는다. 포획·승리·재탐험은 통행·보상·본편 조건이 아니다.
- 상태: 코드와 대장 반영. QA 중단으로 B4F 길찾기, 실제 관찰대 도달, 동일 객체/PC 분기, 저장·재진입, 연구 귀환, 화면·음향은 미검증이며 쌍둥이섬·홍련 완료가 아니다.

## 쌍둥이섬 동료의 20번수로 실제 성장 실전

- 근거·버전: https://bulbapedia.bulbagarden.net/wiki/Sea_Route_20 , https://www.serebii.net/pokearth/kanto/4th/route20.shtml , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (2026-09-15, HGSS). 원작 서쪽 모래톱의 새조련사 어니와 찌르꼬 Lv.48을 프로젝트 성장 상한에 맞춘 기존 귀환전의 근거로 유지한다.
- 적용·차이: `route20-homeward-battle.ts`는 건강한 쌍둥이섬 출신 선두 동료의 실제 객체·시작 레벨·파티 슬롯을 준비하고, 공통 전투의 `defeatedOpponentParticipants`에 그 객체가 포함된 최종 승리만 `nexusRoute20BattlePartnerWon`으로 기록한다. 기존 상대 찌르꼬 Lv.25·첫 승리 상금 560원은 유지한다. 과거 승리만 있고 참가 증거가 없는 저장은 현지 동료 선두로 상금 없는 확인전을 할 수 있다.
- 귀환 소비: `cinnabar-research.ts`는 선택한 쌍둥이섬 동료를 선두에 둔 뒤 20번수로 귀환전으로 안내하고, 실제 참가 승리 뒤 시작→현재 레벨·HP를 연구 관찰에 표시한다. `engine.ts`가 전투 결과를 기록하고 `field-partner-party.ts`가 편성 이동·진화를 같은 객체로 추적하며 PC 이동 때 슬롯을 해제한다. 포획·승리·참가는 통행이나 연구 조건이 아니다.
- 상태: 코드·대장 반영. 테스트·타입 검사·빌드·브라우저·배틀·격파 참가자·경험치·상금·패배 복귀·편성/진화/PC·저장·화면·음향은 QA 중단으로 미검증이며 홍련 완료가 아니다.

## 쌍둥이섬 귀환 결과의 홍련 상륙 소비

- 근거·버전: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://bulbapedia.bulbagarden.net/wiki/Sea_Route_20 , https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml , https://www.serebii.net/pokearth/kanto/4th/route20.shtml (2026-09-15, HGSS). 원작의 홍련–20번수로–쌍둥이섬 연결을 프로젝트 안전 연락선과 대조했다.
- 적용·차이: 홍련 서쪽 `tourCinnabarRoute20Landing`이 쌍둥이섬 1F~B4F 현장 표시 수, 전 층 출신 파티/PC 동료, B4F 출신 동료 종·레벨, 현재 파티 부상을 읽는다. 돌아온 사실을 `seafoamCinnabarReturnReviewed`에 한 번 기록하고 센터 회복·연구소 동료 비교·20번수로 재출발을 제공한다. HGSS의 분화 후 홍련 위에 연구 생활을 둔 넥서스 재구성이며 원작의 파도타기·체육관·프리져 사건을 주장하지 않는다.
- 상태: 상륙표 상호작용은 보상·통행·포획·수첩 완성 조건이 아니다. `src/cinnabar-life.ts`가 실제 이벤트를 소비한다. QA 중단으로 도착·상호작용·파티/PC 출처 판정·저장/재방문·목적지 이동·화면·음향은 미검증이며 홍련 완료 판정이 아니다.

## 쌍둥이섬 B4F 이후 동쪽 상승 귀환 회랑

- 근거·버전: https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B4F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (2026-09-15, HGSS). B4F 양쪽 사다리와 각 상층의 분리 회랑을 대조했다.
- 적용·차이: B4F 냉기 관찰대는 이제 현행 `K-SEAFOAM-B4F` 조우 안내와 그 층에서 포획한 실제 동료를 표시하며, 목적지를 즉시 ‘홍련 출구’라고 부르지 않고 동쪽 상승 계단으로 안내한다. `tour_kanto_seafoam_b3f` `(43,28)`→B2F `(43,29)`→B1F `(43,29)`→1F `(43,37)`에 실제 조사 가능한 귀환 표석을 두어 다음 계단·20번수로·홍련 방향을 단계별로 읽게 했다. 기존 충돌 안의 막힌 벽 셀을 사용하고 보행 폭·워프·조우·저장 ID는 유지한다.
- 소비·상태: `seafoam-exploration.ts`, `kanto-seafoam-islands.ts`, `cinnabar-research.ts`가 현장 포획→최하층 관찰→동쪽 상승→홍련 연구 귀환을 소비한다. 자동 이동·새 플래그·보상·잠금·HM·전설 사건은 없다. QA 중단으로 표석 접근, 실제 계단 선택, 동료 출처 문구, 전 층 왕복과 저장·화면·음향은 미검증이다.

## 쌍둥이섬 B4F 최하층 냉기 선반·귀환선

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B4F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27
- 확인일·버전: 2026-09-15, HGSS. 864×448 B4F 지도와 장소·Pokéarth·Walkthrough의 최하층 동선 및 조우표를 대조했다.
- 원작 사실: HGSS B4F 일반 동굴 조우는 골뱃30%, 쥬레곤24%, 골덕14%, 루주라12%, 고라파덕10%, 쥬쥬10%이며 수상·낚시와 프리져 공간도 별도 존재한다. 층 양쪽 사다리는 아래층 횡단 뒤 서로 다른 B3F 통로로 돌아간다.
- 프로젝트 차이: 기존 56×48 충돌과 두 계단을 보존하고, 서쪽 계단 `(12,3)`→서쪽 넓은 선반→중앙 마른 목→남쪽 발판→동쪽 냉기 선반→상승 계단 `(44,42)`의 비조우 안전선을 유지한다. 현재 지원 종 쥬쥬만 Lv.24~25·100%로 선택 암반 네 곳에 투영했다. 미지원 종·수상/낚시·아이템·HM 퍼즐·프리져는 추가하지 않았다.
- 실제 적용: `src/kanto-seafoam-islands.ts`가 `tour_kanto_seafoam_b4f`에 `(10,19,7×3)`, `(26,25,3×6)`, `(30,31,10×3)`, `(43,21,6×5)` 조우 지형을 배치한다. `src/seafoam-chamber-art.ts`는 안전 얼음선과 조우 암반 흔적을 구분한다. `LOCAL-K-SEAFOAM-B4F`는 공식 exporter로 런타임 데이터와 출처 manifest에 생성됐고 `runtime-encounters.ts`가 MapId를 소비한다. `cinnabar-habitats.ts`는 B4F 포획 출처를 홍련 수첩·연구 동료 판정에 포함한다.
- 생성·검증 상태: 생성 결과 73소유종·65풀·55지원기술. 데이터 생성은 QA가 아니다. 테스트·타입 검사·빌드·브라우저·실제 보행/조우/포획/전투·두 계단 왕복·홍련 귀환·저장·화면·음향은 QA 중단으로 미실행이며 B4F·홍련·관동 완료 판정이 아니다.

## 쌍둥이섬 B3F 굽은 냉기 회랑·조우 적용

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B3F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27
- 확인일·버전: 2026-09-15, HGSS. B3F 개별 지도, 장소·Pokéarth 층 정보와 Walkthrough B3F 조우표를 대조했다.
- 원작 사실: HGSS B3F는 얼음 발판·암벽과 여러 층간 사다리가 굴곡을 만들며 일반 동굴 조우는 골뱃30%, 쥬레곤24%, 골덕14%, 고라파덕12%, 주뱃10%, 쥬쥬10%다. 수상·낚시 조우와 바위·해류 퍼즐도 별도 존재한다.
- 프로젝트 차이: 현행 지원 종인 쥬쥬·주뱃만 50/50, 프로젝트 상한 Lv.24~25로 정규화했다. 원작 전체 평면을 복제하지 않고 기존 48×48 충돌의 중앙 굽은 곁길을 조우 냉기 회랑으로 사용하며, 서쪽 직행 본선과 남쪽 B4F 계단 발판은 비조우 안전선으로 유지한다. 골뱃·쥬레곤·골덕·고라파덕, 라디오·수상·낚시, 아이템·HM·프리져는 추가하지 않았다.
- 실제 적용: `src/kanto-seafoam-islands.ts`가 `tour_kanto_seafoam_b3f`의 기존 중앙 굴곡에 `(16,9,5×3)`→`(18,13,3×4)`→`(22,16,5×3)`→`(24,21,3×5)`→`(20,25,4×3)` 조우석을 배치한다. 닿지 않던 수로 경계는 `(22,23)`에서 회랑 보행 셀 `(24,23)`에 인접한 `(23,23)`으로 옮겼다. `src/seafoam-chamber-art.ts`가 B3F를 소비해 안전 얼음과 조우 암반 흔적을 구분한다. `scripts/design/runtime-local-pools.json`의 `LOCAL-K-SEAFOAM-B3F`를 공식 exporter로 `src/runtime-pokemon-data.json`·`public/assets/pokemon-runtime-sources.json`에 생성하고 `src/runtime-encounters.ts`가 MapId를 연결한다. `src/cinnabar-habitats.ts`는 B3F 포획 출처를 기존 쌍둥이섬 동료 목록에 포함해 홍련 수첩·연구소 준비·현지 동료 판정이 실제 B3F 포획을 소비하게 한다.
- 생성·검증 상태: exporter 결과는 현재 전체 73소유종·64풀·55지원기술이다. 데이터 생성은 QA가 아니다. 테스트·타입 검사·빌드·브라우저·실제 조우/전투·충돌·계단 왕복·저장·시각/음향은 QA 중단으로 미실행이며 B3F·홍련·관동 완료 판정이 아니다.

## 쌍둥이섬 B1F 수로 능선·안전 본선 정합

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B1F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27
- 확인일·버전: 2026-09-15, HGSS. B1F 개별 지도 이미지와 장소·공략의 B1F 조우표를 대조했다.
- 원작 사실: HGSS B1F는 중앙의 흰 얼음 지형과 암벽·사다리·괴력 바위가 굴곡을 만들고, 일반 동굴 조우는 쥬쥬 30%, 골뱃 30%, 고라파덕 16%, 골덕 14%, 주뱃 10%다.
- 프로젝트 차이: 기존 `LOCAL-K-SEAFOAM-B1F`의 지원 종 쥬쥬75%·주뱃25%, Lv.23~24만 유지한다. 서쪽 넓은 본선은 비조우 얼음바닥으로 두고, 북쪽 암반 `(16..20,12..14)`에서 오른쪽 수로 굽이 `(21..23,14..19)`까지 조우 능선을 이어 실제 선택 경로와 terrain을 맞췄다. 원작 전체 종·비율·레벨, 괴력·해류, 아이템·트레이너는 추가하지 않았다.
- 실제 적용: `src/kanto-seafoam-islands.ts`가 `tour_kanto_seafoam_b1f`에 조우 terrain `(21,14,3×6)`을 추가하고, 안전 본선 쪽에 있던 `tourSeafoamB1IceRidge` 표석을 실제 능선 보행 셀 `(23,20)`에 인접한 `(24,20)`으로 옮긴다. `(24,18)`은 기존 비상 보관함과 그 접근 셀 `(23,18)`을 위해 보존한다. `src/seafoam-chamber-art.ts`가 능선 하부 `(21..23,20..23)`와 남쪽 합류 `(14..23,23..25)`에 비조우 얼음 결을 그리고 조우 암반에는 쥬쥬·주뱃 환경 흔적만 얹는다. 공통 terrain 조우와 기존 런타임 풀이 소비한다.
- 보존·상태: 48×48 크기, 1F/B2F 양방향 계단, 서쪽 안전 본선, 수로 경계, 보관함·현장 기록·홍련 귀환을 유지했다. QA 중단으로 충돌·표석 접근·조우·시각·전투·저장·귀환은 미검증이며 완료 판정이 아니다.

## 쌍둥이섬 B2F 조우 암반 회랑 보수

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B2F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27
- 확인일·버전: 2026-09-15, HGSS. B2F 개별 지도 이미지와 장소·공략의 B2F 조우표·트레이너 절을 대조했다.
- 원작 사실: HGSS B2F는 여러 얼음 발판·암벽과 층간 사다리가 이어지며 일반 동굴 조우는 쥬쥬 30%, 골뱃 30%, 고라파덕 16%, 골덕 14%, 주뱃 10%다. 스키선수·보더 전투와 괴력·파도타기 퍼즐도 존재한다.
- 프로젝트 차이: 현재 지원 종과 Lv.25 상한을 지켜 기존 `LOCAL-K-SEAFOAM-B2F`의 쥬쥬 75%·주뱃 25%, Lv.24~25만 유지한다. 기존 48×48 안에서 중앙의 좁은 3타일 조우 통로를 서쪽 접근과 남쪽 합류가 읽히는 6타일 폭의 굽은 암반 회랑으로 보수했다. 서쪽 넓은 본선과 계단 발판은 안전하며 스키선수·보더, 골뱃·고라파덕·골덕, 원작 아이템, 괴력·파도타기·미끄럼은 추가하지 않았다.
- 실제 적용: `src/kanto-seafoam-islands.ts`가 `tour_kanto_seafoam_b2f` 중앙 충돌을 `[14,17,10,3]`·`[18,19,6,7]`로 연결하고 조우 지면을 `(18,17,3×7)`·`(21,18,3×5)` 두 암반대로 설정한다. 기존 얼음판 표석은 회랑에서 닿지 않던 `(25,24)`에서 보행 끝 `(23,24)`에 인접한 `(24,24)`로 옮겼다. `src/seafoam-chamber-art.ts`는 기존 동굴 조우석을 덮지 않고 쥬쥬의 젖은 흔적과 주뱃의 어두운 천장 흔적만 작은 픽셀로 겹친다. 공통 `engine.ts`의 실제 terrain 보행 조우와 기존 런타임 풀이 소비하며, B1F `(10,3)`·B3F `(23,33)` 및 동쪽 귀환 계단은 변경하지 않았다.
- 구현·검증 상태: 코드·대장 반영. QA 중단으로 충돌 접근성, 실제 조우, 전투 후 홍련센터 회복·귀환, 화면·저장·음향은 미검증이며 B2F·홍련·관동 완료로 판정하지 않는다.

## 쌍둥이섬 B1F·B2F 실제 보행 갈림길

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B1F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27
- 확인일·버전: 2026-09-15, 포켓몬스터 하트골드·소울실버. 개별 장소, Pokéarth 4세대 층별 자료, B1F HGSS 832×416 지도, Walkthrough Part 27의 동선을 대조했다.
- 원작 사실: 쌍둥이섬은 20번수로 가운데의 다층 얼음 동굴이며 B1F·B2F에는 갈라진 통로와 얼음 지형, 쥬쥬·주뱃을 포함한 동굴 조우가 있다. 원작의 괴력·바위·해류 퍼즐과 층별 아이템은 이 회차의 보행 선택과 별개다.
- 프로젝트 차이: 원작 평면을 복제하지 않고 기존 48×48 충돌과 양방향 계단을 보존했다. B1F는 조우 암반을 피하는 서쪽 넓은 본선과 쥬쥬·주뱃 서식 암반을 도는 수로 능선길, B2F는 남쪽 직행 본선과 조우·보상 없는 서쪽 막다른 얼음판 우회로 구분했다. 안내는 순간이동이 아니다. B1F 능선은 북쪽 경유와 남쪽 끝을 차례로 확인하고 B2F 우회는 서쪽 끝과 남쪽 합류를 확인해야 기록된다.
- 실제 적용: `src/seafoam-ice-walk.ts`가 `tour_kanto_seafoam_b1f`의 `(15,8)`→본선 `(5,29)` 또는 능선 북쪽 `(18,11)`→남쪽 `(24,22)`, `tour_kanto_seafoam_b2f`의 `(15,8)`→직행 `(15,27)` 또는 서쪽 `(1,15)`→`(15,27)`을 이벤트와 저장 상태로 연결한다. `src/kanto-seafoam-islands.ts`가 막힌 암벽 셀에 표식을 설치하고, `src/seafoam-exploration.ts`가 선택·경유·도착·수첩 안내를 소비하며, `src/kanto-south-art.ts`가 갈림/발자국 표식을 그린다. 포획·승리·괴력·미끄럼 이동은 조건이 아니며 기존 B1F 보관함, B2F 바위, 대피, 계단과 귀환을 변경하지 않는다.
- 구현·검증 상태: 코드와 대장에 반영했다. QA 중단에 따라 테스트·타입 검사·빌드·브라우저·플레이·저장·시각/음향 검증은 실행하지 않았으며 실제 접근성, 조우 차이, 재진입 상태, 표식 표현은 미검증이다. 관동 남부 또는 홍련 완료로 판정하지 않는다.

### 실제 경유 발견과 홍련 귀환 소비

- 추가 대조 사실: Bulbapedia의 HGSS 항목은 B1F 중앙 흰 구역의 숨은 얼음상처약과 B2F 북서쪽 사다리 남서 암벽을 포함한 숨은 진주 두 곳을 기록한다. B1F·B2F 조우표의 쥬쥬·주뱃은 층별 서식 흔적 재구성의 근거로 함께 사용했다.
- 프로젝트 적용과 차이: B1F 북쪽 경유 `(18,11)`에서 기존 쥬쥬·주뱃 조우 안내와 젖은 둥근 발자국·날개 흔적을 관찰하고, B2F 서쪽 끝 `(1,15)`에서 얼음 아래 조개껍질 광택을 채취 없이 기록한다. 발자국·날개 흔적은 프로젝트 생태 표현이며 원작 고정 오브젝트가 아니다. 원작 얼음상처약·진주는 지급하지 않는다. 두 기록은 `tour_cinnabar_hall/tourExhibit2`에서 환경 차이로 비교되고 홍련센터 또는 공식 20번수로 귀환을 안내한다. `seafoamB1RidgeHabitatObserved`, `seafoamB2WestIceObserved`, `seafoamRouteFindingsCompared`는 선택 기록이며 통행·조우·포획·본편 조건이 아니다.
- 실제 소비: `src/seafoam-ice-walk.ts`의 현장 상호작용과 `src/cinnabar-research.ts`의 홍련 서식 관찰판이 소비한다. 지도 설치와 표식 painter는 기존 `kanto-seafoam-islands.ts`·`kanto-south-art.ts` 연결을 사용한다. 외부 코드·자산은 재사용하지 않았다.
- 상태: 코드·문서 반영, 모든 QA 미실행. 실제 조우 발생, 경유 순서, 저장/재진입, 연구소 비교와 귀환 목적지, 화면·음향은 미검증이다.

## 홍련 사건 결과 → 주거 돌봄 → 20번수로 출발

- 참고 URL: https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml , https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://bulbapedia.bulbagarden.net/wiki/Appendix:HeartGold_and_SoulSilver_walkthrough/Section_27 , https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Lab
- 확인일·버전: 2026-09-15, 하트골드·소울실버와 파이어레드·리프그린 차이 대조.
- 원작 사실: HGSS 홍련섬은 화산 분화 뒤 포켓몬센터만 재건됐고 북쪽 21번수로·동쪽 20번수로와 연결된다. 체육관은 쌍둥이섬으로 옮겨졌다. FRLG의 포켓몬연구소와 주거·상점이 있는 섬은 분화 전 구성이며 HGSS 시점에는 남아 있지 않다.
- 프로젝트 차이: 넥서스 홍련은 HGSS의 붉은 화산 지형·20번수로 연결 위에 FRLG 연구소 성격과 창작 복구 주거 구역을 함께 둔다. 새 체육관·배지·21번수로·파도타기를 열지 않고, 채택 서사의 해안 인계 결과가 주민 생활에 남도록 기존 `바닷가 동료의 집`에서 물그릇·마른 깔개·바람막이를 준비하는 선택 활동을 추가했다.
- 실제 적용: `src/cinnabar-life.ts`의 `handleCinnabarHomecoming`은 `nexusCinnabarShoreHandoffComplete` 뒤 `tour_cinnabar_home1` 안내원과 네 생활 사물을 동적 후일담으로 바꾼다. 건강한 파티 선두와 준비하면 `nexusCinnabarShoreCarePrepared`와 동료 종을 저장하고, 피카츄·알통몬의 상태를 설비 기록과 분리해 남긴다. 준비 뒤 해안 `tourCinnabarShoreHandoff`, 홍련센터, 공식 `tour_kanto_route_20`의 `route20HomewardKeeper`로 이어진다. 활동은 보상·회복·통행 조건이 아니다.
- 검증 상태: 코드와 지역 인계에 반영했으나 QA 중단에 따라 테스트·타입 검사·빌드·브라우저·시각/음향·저장 검증을 실행하지 않았다. 집 사물 이벤트 ID, 상태 저장·재진입, 해안/센터/20번수로 목적지 연결은 미검증이다.

## 20번수로 서쪽 모래톱 귀환전

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Sea_Route_20 , https://www.serebii.net/pokearth/kanto/4th/route20.shtml
- 확인일·버전: 2026-09-15, 포켓몬스터 하트골드·소울실버(Generation IV).
- 원작 사실: 20번수로는 서쪽 홍련섬과 동쪽 19번수로를 잇고 쌍둥이섬이 가운데를 가른다. HGSS 서쪽에는 합쳐진 큰 모래톱과 여러 트레이너가 있으며, 새조련사 어니는 찌르꼬 Lv.48 한 마리를 사용한다. 수로의 일반 이동과 야생 조우는 파도타기 기반이다.
- 프로젝트 차이: 현행 엔진에는 파도타기·수상 조우가 없으므로 기존 안전 연락선 데크와 서쪽 모래톱을 유지했다. 원작 트레이너를 그대로 복제하지 않고 `20번수로 새 조련사`의 찌르꼬 Lv.25·상금 560원 선택 귀환전으로 성장 곡선에 맞췄다. 쌍둥이섬 출신 동료가 파티에 있으면 종·레벨·HP·기술을 보여 주지만 포획과 승리는 통행 조건이 아니다.
- 실제 적용: `src/kanto-south-sea-route.ts`의 `tour_kanto_route_20` 서쪽 모래톱 `(63,25)`에 `route20HomewardKeeper` NPC를 배치했다. `src/route20-homeward-battle.ts`가 공통 트레이너 배틀과 `trainerWon:kanto-route-20-homeward-practice` 결과를 소비하며, 승리 재방문에서 홍련센터·파티·수첩 귀환을 안내한다. `src/cinnabar-life.ts`가 지역 핸들러를 실제 사건 흐름에 연결한다.
- 검증 상태: 사용자 지시에 따라 테스트·타입 검사·빌드·브라우저 플레이·시각·음향·저장 QA를 모두 실행하지 않았다. 코드 반영 상태이며 실제 전투 종료 플래그, 상금, 화면 배치, 센터 귀환은 미검증이다.

## 남은 경계

- 20번수로 파도타기, 낚시, 수상 야생 조우, 원작 전체 트레이너·아이템은 구현하지 않았다.
- 쌍둥이섬 보관함·B2F 바위·대피 사건·기존 조우·홍련 연구원 연습전은 변경하거나 반복하지 않았다.
- 홍련 도시 단위 전체 QA는 중단 상태이므로 관동 남부 완료로 판정하지 않는다.

## 쌍둥이섬 B1F·B2F 계단 사이 얼음 지형 보수

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B1F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27
- 확인일·버전: 2026-09-15, 포켓몬스터 하트골드·소울실버(Generation IV). Bulbagarden 지도는 `Seafoam Islands B1F HGSS` 832×416 게임 지도이며, Walkthrough Part 27의 B1F·B2F 절을 함께 대조했다.
- 원작 사실: 쌍둥이섬은 20번수로 가운데의 5층 얼음 동굴이다. HGSS B1F에는 바위 무리 뒤 북중앙 능선과 층간 사다리 동선이 있고, B2F 하층은 여러 얼음판을 차례로 지나 동쪽 사다리로 내려간다. B1F·B2F의 일반 동굴 조우에는 쥬쥬·주뱃 등이 포함되며, B2F에는 스키선수·보더 트레이너가 배치된다.
- 프로젝트 차이: 원작 평면을 복제하지 않고 현행 48×48 양방향 계단 본선에 맞춰 재구성했다. `tour_kanto_seafoam_b1f`의 서쪽 계단 길에는 두 구역의 얼음 능선을, `tour_kanto_seafoam_b2f`의 북서 하강선·남쪽 합류선·동쪽 상승선에는 세 구역의 갈라진 얼음판을 보이는 지면으로 적용했다. 얼음은 탐험 방향과 냉기 생태를 읽게 하는 표현이며 미끄럼 이동·원작 트레이너·아이템·파도타기·괴력 전체 퍼즐은 추가하지 않았다. 기존 B2F 작은 바위 곁길, B1F 동료 보관함, 대피·홍련/연분홍 귀환 계약과 조우 지면은 보존했다.
- 실제 적용: `src/seafoam-chamber-art.ts`의 `paintSeafoamChamberRelief`가 맵 충돌의 실제 보행 타일에만 B1F 2곳·B2F 3곳의 얼음 결을 그리며, 워프·사물·조우 지면·동적 바위 포켓은 덮지 않는다. `src/kanto-seafoam-islands.ts`의 `tourSeafoamB1IceRidge`와 `tourSeafoamB2IceField` 표석은 각각 계단 사이 본선, 쥬쥬·주뱃 서식 암반, 동쪽 귀환 계단과 선택 바위 곁길을 안내한다. 적용 MapId는 `tour_kanto_seafoam_b1f`, `tour_kanto_seafoam_b2f`다.
- 구현·검증 상태: 코드와 인계 기록에 반영했다. 현행 QA 중단에 따라 테스트·타입 검사·빌드·브라우저·시각/음향·저장 검증은 실행하지 않았다. 얼음 지면의 실제 화면, 표석 접근, 계단 왕복, 조우 지면 보존, 바위 이동 전후 겹침은 미검증이며 관동 남부 또는 홍련 도시 완료로 판정하지 않는다.
## 홍련 재건 포켓몬센터 확장

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml
- 확인일·버전: 2026-09-16, 포켓몬스터 하트골드·소울실버. 도시 지리·분화 뒤 시설·20/21번수로 연결을 대조했다.
- 원작 사실: HGSS 홍련은 분화로 기존 도시가 파괴되고 포켓몬센터만 재건됐다. 북쪽은 21번수로로 태초마을, 동쪽은 20번수로와 쌍둥이섬으로 이어지며 체육관은 쌍둥이섬으로 이전했다.
- 프로젝트 차이: 넥서스의 연구소와 주거지는 창작 복구 공간으로 유지한다. 재건 센터는 원작의 유일한 회복 거점을 확장해 20번수로·쌍둥이섬 귀환 동료의 회복·PC·건조·다음 경로 확인을 한 공간에 묶었다. 현행 21번수로는 수상 지리가 아닌 도보 해안길 재구성임을 내부 귀환도에 명시했다. 체육관·화석 복원·파도타기·프리져·보상·통행 잠금은 추가하지 않았다.
- 실제 적용: `src/cinnabar-interiors.ts`가 `tour_cinnabar_center`를 28×22로 확대하고 기존 `tourHost`, `tourExhibit0/1/2`, 외부 문과 MapId를 유지한다. 입구 `(14,21)`/안전점 `(14,18)`, 간호사·접수대, 회복 장치·PC·대기석을 재배치하고 `cinnabarCenterSeafoamRest`, `cinnabarCenterSeaRouteChart`, `cinnabarCenterAshCare` 조사 사물과 충돌을 등록한다. `src/explore-world.ts`가 설치 함수를 실제 월드 생성 흐름에서 호출한다.
- 구현·검증 상태: 코드·크기·이동·사건·출처 대장 반영. QA 중단으로 테스트·타입 검사·빌드·브라우저·실제 문 진입/퇴장·회복·PC·조사 사물·저장·화면·음향은 미실행이며 홍련 또는 관동 완료 판정이 아니다.

## 홍련 복구 화산 연구소 확장

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Lab , https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island
- 확인일·버전: 2026-09-16. 원작 연구소의 1·3세대/리메이크 내부 구성과 HGSS 시점의 파괴 상태를 분리해 확인했다. Bulbagarden 지도 카테고리는 이번 조회에서 열리지 않아 지도 확인 완료로 기록하지 않는다.
- 원작 사실: 홍련랩은 큰 접수부에서 서쪽 세 방으로 이어지며 교환, 기술, 화석 복원 기능이 있었다. HGSS 이전 분화로 다른 옛 시설과 함께 파괴되어 HGSS에는 존재하지 않는다.
- 프로젝트 차이: 현재 공개 연구소는 넥서스에서 복구한 창작 시설이다. 원작 방 구분은 화산암·회로·현지 동료 관찰 구역을 읽히게 하는 공간 구성에만 참고했고 교환·기술 지급·화석 복원·전설 연구는 옮기지 않았다. 별도 보호·제어 현장으로 이어지는 문도 추가하지 않았다.
- 실제 적용: `src/cinnabar-interiors.ts`가 `tour_cinnabar_hall`을 28×24로 확대하고 외부 문과 `tourHost`, `tourExhibit0/1/2`를 유지한다. 입구 `(14,23)`/안전점 `(14,20)`, 서쪽 화산암·동료 관찰, 동쪽 회로 모형, `cinnabarLabReconstructionRecord`, `cinnabarLabReturnDesk`를 실제 충돌·조사 사물로 등록한다. `src/cinnabar-interior-art.ts`는 확대 폭을 세 구역으로 나눈 바닥 결 및 세 활동 지점에서 출구까지의 화살표를 그린다.
- 구현·검증 상태: 코드·크기·이동·사건·출처 대장 반영. QA 중단으로 타입 검사·테스트·빌드·브라우저·문 왕복·사물 접근·동료 편성·전투 귀환·저장·화면·음향은 모두 미실행이며 홍련 또는 관동 완료 판정이 아니다.

## 홍련 상점·두 주택 생활권 확장

- 참고 URL: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml
- 확인일·버전: 2026-09-16, HGSS. 분화 뒤 시설 구성과 20·21번수로 연결을 다시 대조했다.
- 원작 사실과 차이: HGSS 홍련에는 재건 센터 외 기존 상점·주택이 남아 있지 않다. 현행 상점과 두 주택은 넥서스의 창작 복구 생활권이며 분화 전 원형 복제나 HGSS 존속 시설로 기록하지 않는다.
- 실제 적용: `src/cinnabar-interiors.ts`가 `tour_cinnabar_mart` 24×20, `tour_cinnabar_home1`·`home2` 각 24×18의 충돌·조사 사물·입구·안전점을 생성한다. 상점의 기존 `martClerk` 구매와 판매 사물은 유지하고 `cinnabarMartSeaRouteShelf`, `cinnabarMartSupplyChart`, `cinnabarMartPackingBench`를 추가했다. 주택은 기존 네 사물의 이벤트 ID를 유지해 `cinnabar-life.ts`의 해안 돌봄과 쌍둥이섬 수첩 후일담을 계속 소비한다.
- 구현·검증 상태: 코드와 크기·이동·스토리·출처 대장 반영. 새 상품·보상·잠금은 없다. QA 중단으로 타입 검사·테스트·빌드·브라우저·문 왕복·구매·동적 주거 반응·저장·화면·음향은 모두 미실행이며 홍련 또는 관동 완료 판정이 아니다.
