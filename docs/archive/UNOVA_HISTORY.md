# 하나 구현·검증 기록

> **과거 기록.** 파일별로 흩어진 구현·실패·검증 근거를 통합했다. 당시의 최신·다음 작업·배정·QA 재개는 현재 지시가 아니다. 현재 기준은 [문서 안내](../README.md)와 [현재 상태](../PROJECT_STATE.md)를 따른다.

## 기록 목록

- [unova-castelia-comparison-20260913](#record-unova-castelia-comparison-20260913)
- [unova-castelia-sewers-20260913](#record-unova-castelia-sewers-20260913)
- [unova-continuation-20260913](#record-unova-continuation-20260913)
- [unova-continuation-20260915](#record-unova-continuation-20260915)
- [unova-wetland-repair-20260913](#record-unova-wetland-repair-20260913)

---

<a id="record-unova-castelia-comparison-20260913"></a>
## unova-castelia-comparison-20260913

원래 문서: `docs/autonomy/unova-castelia-comparison-20260913.md`

<a id="record-unova-castelia-comparison-20260913-구름-전시공개-원본-대조-단계--2026-09-13"></a>
### 구름 전시·공개 원본 대조 단계 — 2026-09-13

<a id="record-unova-castelia-comparison-20260913-적용-근거"></a>
#### 적용 근거

- 확인일2026-09-13, BW2: https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Studio_Castelia — 원작 아틀리에구름은 젊은 작가의 작품 전시 공간이다. 항만 사업 전시·성도 기록 대조는 원작 사건이 아닌 채택된 NEXUS_STORY_MASTER CH06 각색이다.
- 같은 날 https://www.serebii.net/pokearth/unova/casteliacity.shtml 개별 장소 페이지를 열었다. 원작 갤러리/항구의 도시 생활을 구조 참고로 삼으며 외부 코드나 자산을 복사하지 않았다. 이번 회차 지도 이미지 대조·실행 검증은 하지 않았다.
- `src/ecruteak-disclosure.ts`와 성도 인계에서 `nexusEcruteakOriginalsPublic` 의미를 읽었다. 서명본과 주민 원본을 인주 공개대에 함께 펼친 결과다. 원본 소지·하나 운송·성도 전체 완료가 아니다. 구름 대사도 원본은 인주에 남고 직접 읽은 항목을 대조한다고 명시한다.

<a id="record-unova-castelia-comparison-20260913-코드와-플레이-단계"></a>
#### 코드와 플레이 단계

- `src/castelia-original-comparison.ts`: `casteliaComparisonReady(save)`는 공개 원본 플래그와 자유답사 Cargo/Worker/RestMat/Alley를 모두 요구한다. 준비 전에는 기존 자유답사를 그대로 사용한다.
- `castelia-field-intro.ts`의 기존 전시 조사물 `tourCasteliaProjectExhibit` 선택지에서 비교를 시작한다. 운송의 이익과 쉬는 자리 두 항목을 선택하면 현장으로 안내한다. 평균으로 성급히 결론내는 선택은 진행을 기록하지 않는다.
- `castelia-gallery.ts` 첫머리의 `handleCasteliaOriginalWitness`가 기존 실제 `tourResident0` 직장인→`tourResident1` 주민 대화를 소비한다. 답사 기록만으로 새 증언을 자동 완료하지 않는다. 새 증언 이후 전시로 돌아와 두 말을 구분해 보존한다.
- 신규 플래그 순서: `nexusCasteliaComparisonOpened` → `nexusCasteliaWorkerCompared` → `nexusCasteliaResidentCompared` → `nexusCasteliaComparisonPreserved`. 마지막은 구름의 제한 비교 기록이며 CH06/CH05 완료가 아니다.
- 상태 확정은 결과 대화 종료 후다. 저장객체·플레이어객체·맵·좌표·대화 세션·선행조건을 재확인하고 최초 결과만 persist한다. 기존 원본/자유답사 상태·소지품·종 데이터·교통 잠금은 변경하지 않는다.
- 보존 후 기존 `tour_unova_route_04`를 목적지로 설정한다. 실제 구름 북쪽4번도로→뇌문 여행이며 뇌문 철도 증언이나 본편 공개가 이미 구현됐다고 안내하지 않는다.
- 중앙이 adventure-guide 연결을 회신했다. ready이면 시작 전 전시, opened 뒤 직장인→주민→전시에서 보존, preserved 뒤4번도로를 자유답사 안내보다 우선한다. 하수도/공원에서는 기존 탐험 안내를 유지한다. 지역 담당은 공유 engine/renderer/catalog를 수정하지 않았다.

<a id="record-unova-castelia-comparison-20260913-검증과-다음-범위"></a>
#### 검증과 다음 범위

모든 테스트·빌드·브라우저·시청각·저장 QA 미실행. 지역 호출 연결을 읽고 중앙 길안내 반영을 회신받은 상태이며 도시 완료가 아니다. 다음 범위는 뇌문/물풍경 후속 현장 계약이다. 이번 구름 대조만으로 본편 전체 공개·성도복구·원본 운송을 완료 처리하지 않는다.

<a id="record-unova-castelia-comparison-20260913-중앙-전시-상태-표현"></a>
#### 중앙 전시 상태 표현
비교를 시작하면 기존 전시 가구에 두 장의 구름 현장 기록을 표시한다. 직장인/주민 대조 단계가 끝날 때 각 기록에 글줄이 채워지고, 함께 보존하면 묶음 표시가 생긴다. renderer가 현재 저장 플래그를 매 프레임 전달하므로 정적 배경 캐시에 완료 그림을 굳히지 않는다. 인주 원본 이동을 뜻하지 않으며 새 충돌/보상/진행 상태는 없다. 시각 QA 미실행.

---

<a id="record-unova-castelia-sewers-20260913"></a>
## unova-castelia-sewers-20260913

원래 문서: `docs/autonomy/unova-castelia-sewers-20260913.md`

<a id="record-unova-castelia-sewers-20260913-구름-항구하수도숨은-공원-적용--2026-09-13"></a>
### 구름 항구·하수도·숨은 공원 적용 — 2026-09-13

<a id="record-unova-castelia-sewers-20260913-2026-09-15--하수도-포획-동료의-공원-실전귀환-묶음"></a>
#### 2026-09-15 · 하수도 포획 동료의 공원 실전·귀환 묶음

- 확인일 2026-09-15, 기본 대조 **Pokémon Black 2·White 2**. [Bulbapedia 구름하수도](https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers)의 `In the games`·조우표와 [마른 상태 원작 지도](https://bulbapedia.bulbagarden.net/wiki/File:Castelia_Sewers_dry_B2W2.png), [구름시티의 Castelia Park](https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park), [BW2 Walkthrough Part 4](https://bulbapedia.bulbagarden.net/wiki/Appendix:Black_2_and_White_2_walkthrough/Section_4), [Serebii Pokéarth 구름하수도](https://www.serebii.net/pokearth/unova/casteliasewers.shtml)를 실제로 읽었다. 원작은 Thumb Pier 진입, 휴이 최초 동행, 플라스마단·아크로마 사건, 유적통로, 계절별 건조/침수, 공원·뒷골목 출구를 가진다. 걷기 조우는 꼬렛45%·주뱃45%·질퍽이10%, Lv.14~17이고 공원은 건물 사이 중앙 나무와 양쪽 풀밭 구조다.
- 프로젝트는 기존 `tour_castelia` `(59,48)` → `tour_castelia_sewers` → `tour_castelia_park`의 **고정 마른 축약 왕복**을 보존한다. 원작 지도 이미지를 복사하지 않았고 계절·파도타기·휴이 동행·플라스마단/아크로마·유적통로·뒷골목·아이템 배치는 추가하지 않았다. 기존 공원 선택 트레이너도 원작 NPC 재현이 아닌 넥서스 자유 실전이다.
- `src/castelia-sewer-journey.ts`의 `handleCasteliaSewerJourney`가 기존 조사물과 실제 저장을 연결한다. `tourCasteliaSewerHabitat`에서 흔적 확인 → `tourCasteliaParkLight`에서 `met`가 `구름하수도` 또는 `구름시티 공원`인 **건강한 실제 파티 동료** 선택·선두 편성 → 기존 `tourCasteliaParkTrainer` 선택전 → `tourCasteliaParkReturn`에서 승리 플래그와 같은 실제 동료의 현재 Lv/HP를 확인하고 하수도 본선·항구 센터 귀환을 기록한다. `src/castelia-gallery.ts`가 이 하나 전용 핸들러를 기존 여행 이벤트 경로에서 소비한다.
- 신규 상태는 `nexusCasteliaSewerHabitatInspected`, `nexusCasteliaSewerParkPartner`, `nexusCasteliaSewerParkPartnerLevel`, `nexusCasteliaSewerParkReturned`다. 포획은 기존 야생전, 성장·피해는 기존 전투, 편성·회복은 기존 파티/센터 계약만 사용한다. 선택전 승리 `trainerWon:castelia-park-practice`를 읽되 재보상하지 않는다. 포획·배틀·기록을 거절해도 하수도·공원·항구 왕복은 열린다.
- 이 기록은 구름의 자유 탐험 한 묶음이며 CH06, 원작 하수도 사건, 플라스마단 격퇴, 구름 체육관, 도시 전체 완료를 뜻하지 않는다. 사용자 QA 중단에 따라 테스트·빌드·브라우저 플레이·화면·음향·실제 포획/성장/저장·재로드 검증은 모두 미실행이다.

<a id="record-unova-castelia-sewers-20260913-근거와-범위"></a>
#### 근거와 범위

- 확인일 2026-09-13, BW2: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers — 항구 입구, 공원 출구, 계절별 건조/침수와 최초 동행 조건. 프로젝트는 건조 통로와 공원 왕복만 채택한다. 휴이 동행·아크로마/플라스마단 사건·유적통로·침수 골목 출구·파도타기·계절 해금은 구현하지 않는다.
- BW2: https://www.serebii.net/pokearth/unova/casteliasewers.shtml — 같은 연결과 보행 조우 꼬렛45/주뱃45/질퍽이10 대조. 부두 영문명은 Bulbapedia Thumb Pier/Serebii Sightseeing Pier로 서로 달라 프로젝트 표시는 고유 부두명 대신 구름시티 항구로 한정한다. 질퍽이는 Bulbapedia15 또는17, Serebii15~17 표기이며 현재 공통 풀 범위14~17은 프로젝트 차이다.
- W2 일반풀: https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park — 꼬렛30%, 이브이5%, 에나비15%, 콩둘기15%, 치릴리35%. B2의 이어롤/소미안과 구분한다. 원작 우측 진한풀·더블배틀은 채택하지 않으며 양쪽 모두 일반풀 단일 조우다.
- 개별 페이지의 텍스트/조우표를 읽었다. 원작 지도 이미지의 타일 대조는 미완료이며 아래 좌표와 크기는 프로젝트 축약 배치다. 외부 코드·이미지 자산을 복사하지 않았다.

<a id="record-unova-castelia-sewers-20260913-실제-연결-계약"></a>
#### 실제 연결 계약

| 출발 MapId/출구 | 도착 MapId/안전 도착 | 방향·귀환 |
| --- | --- | --- |
| `tour_castelia` (59,48) | `tour_castelia_sewers` (44,24) | 동쪽 계단으로 진입. 도시 귀환은 (58,48) |
| `tour_castelia_sewers` (46,24) | `tour_castelia` (58,48) | 동쪽 계단으로 항구 귀환 |
| `tour_castelia_sewers` (6,2) | `tour_castelia_park` (16,36) | 서쪽 통로 끝 북쪽 계단 |
| `tour_castelia_park` (16,38) | `tour_castelia_sewers` (6,3) | 남쪽 계단. 하수도 남쪽 본선→동쪽 항구 |

도로 번호가 붙은 도시 간 구간이 아닌 도시 내부 고유명 **구름하수도**다. 별도 ‘몇번동굴’을 원작 번호처럼 붙이지 않는다. 기존 북쪽 지상 정원(U01-GARDEN), 도시72×64, 선박·4번도로·스카이애로 기존 연결을 보존한다.

<a id="record-unova-castelia-sewers-20260913-소비-위치와-상태"></a>
#### 소비 위치와 상태

- `src/castelia-sewer-park.ts`: 두 맵 설치, 충돌과 같은 바닥 그림, 계단/표지, 하수도 선택 조우실(19,11,5,5), 공원 일반풀(4,10,8,8)/(22,19,6,7). 본선은 조우 영역을 피할 수 있다. 기존 공통 야외 조사물 대사를 사용하며 독자 저장 구조 없음.
- `src/explore-castelia.ts`: 기존 도시 painter에서 실제 입구 타일이 열렸을 때 계단 그림 소비.
- 중앙 연결 반영: `explore-world.ts`의 installer와 `explore-art.ts` 첫 바탕 분기에서 전용 painter를 소비한다. `runtime-encounters.ts`는 node `U-CASTELIA-SEWERS`/`U-CASTELIA-PARK-W2`를 사용한다. 중앙 데이터 담당은 W2 공원 전체5종과 자산 반영을 회신했다. `region-atlas.ts`에는 하수도(156,164)/공원(156,144) 표시 좌표가 추가됐다. 소스 반영 근거이며 화면 검증이 아니다.
- 표지 대사는 `engine.ts` event의 `getWorldOutdoors(...).objects.find(...)`를 통해 실제 소비한다. 공원 외곽은 보행 불가 셀의 빌딩 뒷벽/남쪽 담장, 중앙 상징나무는 막힌 섬 x10..12/y20..24 안에 그린다.
- 중앙 회신: `explore-journal`의 journalPlaces와 panelPlaces/방문집계가 두 장소를 소비하고 패널 연결선은 실제 warp도 읽는다. 따라서 표시 계약도 항구→하수도→공원이다. 실행 확인은 하지 않았다.
- 크기 단일 기준: [MAP_SIZE_STANDARDS](../MAP_SIZE_STANDARDS.md)의48×28/32×40 행. 연결 책임은 [WORLD_ROUTES](../WORLD_ROUTES.md), 사건 범위는 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md), 출처 색인은 [REFERENCE_RESEARCH](../reference/REFERENCE_RESEARCH.md)로 인계한다.
- 검증: 사용자 QA 중단으로 테스트·빌드·실행·화면·저장 검증 전부 미실행. 도시 완료·CH06 완료가 아니다. 다음은 중앙 소비 연결 반영과 실제 미검증 상태 유지, 이후 사용자 QA 재개 때 왕복/조우/포획/성장/회복 검증이다.


<a id="record-unova-castelia-sewers-20260913-중앙-배수홈-시각-보수"></a>
##### 중앙 배수홈 시각 보수
2026-09-13, BW2: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers 의 In the games를 다시 확인했다. 원작은 계절에 따라 건조/침수 상태가 바뀐다. 프로젝트는 고정 마른 재구성으로, `castelia-sewer-park.ts` painter에서 기존 막힌 x4/y4..26 및 y26/x4..45에 낮은 배수홈, 곁방 동쪽에 유입구 쇠창살을 그린다. 원작 지도 좌표 재현이나 계절/파도타기 구현이 아니다. 보행·조우·워프 변경 없음. 기존 buildExploreArt 소비 유지, 화면 QA 미실행.

---

<a id="record-unova-continuation-20260913"></a>
## unova-continuation-20260913

원래 문서: `docs/autonomy/unova-continuation-20260913.md`

<a id="record-unova-continuation-20260913-최신-작업--구름-북쪽-조우-정원-접근귀환"></a>
#### 최신 작업 — 구름 북쪽 조우 정원 접근/귀환

- 확인/변경: 현재 소스에 독립 castelia_park/sewer MapId는 없고 tour_castelia terrain 두 구역(26,4,5×3)/(45,5,5×3)이 있다. explore-castelia의 기존계획에 해당풀밭 보행영역과 둘레길/남쪽 진입로를 명시했다. 서쪽 진입27..29/7..11, 동쪽46..48/8..11은11행 큰길에 합류하며 둘레는 각각25..31/3..7,44..50/4..8이다. 정원 밖으로 나와 같은 길로 센터에 돌아갈 수 있고 포획하지 않아도 큰길은 열린다.
- 소비: CASTELIA_GARDEN_PATHS를 casteliaPlan.paths 생성과 기존 paintCasteliaStreets가 함께 소비한다. 풀밭 그림은 기존 terrain renderer, 조우는 unified-world의 CASTELIA_GRASS 및 runtime-encounters U01-GARDEN 유지. 현재 LOCAL-U-CASTELIA-GARDEN-DAY는519 60/548 40, Lv22..24. 공유데이터 변경 없음. 기존문/워프/매트/CH도입과 기존보행 보존. 새 중앙훅 불필요.
- 원작: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers In the games/조우표를2026-09-13 직접열람. BW2 Thumb Pier 입구→하수도→공원 출구가 있으며 하수도는꼬렛/주뱃/질퍽이다. https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park 의 앞선BW2표열람에서콩둘기와버전별풀포켓몬 확인. 현재북쪽정원은그생태를도시지상으로각색한기존공간이며원작공원/하수도재현아님. 하수도MapId/수상/계절/동행전투/풀원작조우를추가하지않았다. 원작지도이미지직접열람없음,외부코드/자산재사용없음.
- 상태: 코드반영·QA전부미실행. 원작공원정식경유는미구현, 기존북쪽정원실제보행/조우/포획/센터귀환검증은남는다. 도시완료아님.
<a id="record-unova-continuation-20260913-최신-작업--골목-매트의-콩둘기-정착-표현"></a>
#### 최신 작업 — 골목 매트의 콩둘기 정착 표현

castelia-field-intro.ts에서 casteliaRestMatCell을 추출해 매트와 포켓몬이 동일한 골목 화분정원(50,19,2×10)의 기존 cells 첫 안전한 #칸을 사용한다. NPC/warp 칸 제외. casteliaRestingPokemonLayers는 기존 RestMat 저장 후 해당 칸 내부14px 콩둘기519를 depth=y+.95 actor layer로 반환한다. 중앙에 기존 pokemon-519 자산 drawImage callback과 sort 전 push를 요청했다. 기존 구름 피카츄를 옮기지 않으며 별도의 지역 생활 개체 정착 표현이다. 이전에는 빈자리, 이후에는 쉬는 정착 모습과 재조사 대사가 남는다. 이동경로/도착 과정은 구현하지 않았고 별도 위치 저장·포획·소유·보상·CH완료 없음. 기존x/y/player 콜백가드/단계순서 보존.

출처: https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park 의 BW2 조우표를2026-09-13 직접 열람(진입 https://bulbapedia.bulbagarden.net/wiki/Castelia_Park 리다이렉트). 원작 공원에 콩둘기가 등장한다는 종 근거만 채택. 원작 공원은 하수도 접근이며 현재 골목 매트 개체는 넥서스 도시생태 각색이다. 기존 로드 종 이미지 재사용, 외부자산 새복제 없음. 중앙 actor 훅 연결 확인 전 표시 적용완료 아님. 모든 QA 미실행,14px 가독성/가구·캐릭터 겹침은 미검증.
<a id="record-unova-continuation-20260913-최신-인계--구름-자유-현장-도입-중앙-그림-연결-수신"></a>
#### 최신 인계 — 구름 자유 현장 도입 중앙 그림 연결 수신

중앙이 paintCasteliaProjectExhibit를 가구 첫 판정에, paintCasteliaFieldSites를 배경 직후/캐릭터 전에 연결했다고 전달했다. 따라서 전시 가구→기존 화물 접근 수레자국→실제 해안 직장인→골목 매트 펼치기→실제 갤러리 관람객→전시 재방문의 이벤트·저장·그림 소비 연결을 코드 반영 범위로 인계한다. 이전 ‘현장 그림 연결 요청 상태’는 이 인계로 갱신한다. 중앙 연결은 전달받은 소스 반영 상태이며 실행 검증 근거가 아니다.

매트는 비보행 가구 자리의 시각 변화이며 포켓몬 이동·회복 기능이 아니다. 지역 관찰 플래그는 CH05 완료/성도 원본 확보/CH06 승격·완료를 의미하지 않는다. 정확한 본편 선행 API와 후속 원본 비교·공개 단계는 남아 있다. 테스트·타입·빌드·브라우저·저장·시청각 QA 전부 미실행. 이번 구름 자유 현장 도입 묶음을 종료하며 신규 도시 확장을 자동 시작하지 않는다.
<a id="record-unova-continuation-20260913-ch06-도입-보완--실제-주민과-매트-펼치기"></a>
#### CH06 도입 보완 — 실제 주민과 매트 펼치기

초기 세 장소 기록안은 행동 결과가 부족해 수정했다. 전시→화물 접근의 실제 두 줄 수레자국→기존 해안 직장인(tourResident0) 증언→골목 빈 받침의 휴식 매트 펼치기→기존 갤러리 관람객(tourResident1)의 골목 이용 경험→전시 재방문 순서다. 주민객체 없는 가상 현장 발언을 제거했다. casteliaFieldWorker/RestMat은 지역 단계만 저장하며 CH05/CH06을 승격하지 않는다. 조사 전 자유방문/기존대사와 완료후 기존주민대사는 유지한다. 매트는 기존 골목 object.cells 중 실제 #인 칸 하나 내부에만 표시하며 보행/충돌/포켓몬 위치/회복 효과를 바꾸지 않는다. 재방문에 매트와 반응이 남는다.

중앙은 paintCasteliaProjectExhibit 가구 훅을 연결했다고 전달했다. 새 paintCasteliaFieldSites(c,map,save)의 수레자국(44..54/48..49 실제 보행칸)과 매트 표시를 야외배경 뒤/캐릭터 전 소비하도록 추가 요청했다. 이 현장 그림 연결 확인 전에는 도입 적용 완료로 판정하지 않는다. QA 모두 미실행. 원작 본문과 프로젝트 각색 경계는 직전 기록 유지.
<a id="record-unova-continuation-20260913-최신-작업--구름-ch06-자유-현장-도입-본편-승격-대기"></a>
#### 최신 작업 — 구름 CH06 자유 현장 도입 (본편 승격 대기)

- 사용자/중앙 지정으로 구름 기존 장소에 한정하여 도입 구현. NEXUS_STORY_MASTER CH06~07 204~206의 사업 전시/실제 혜택/서로 다른 시민 경험을 각색했다. CH05 전체 완료나 성도 원본 확보를 임의 설정하지 않는다. casteliaFieldExhibit/Cargo/Alley는 자유 방문 관찰만이며 CH06 완료가 아니다.
- 동선/소비: castelia-interiors의 hall 기존`objects[1]`의 좌표 `(19,7)`→tourCasteliaProjectExhibit, castelia-gallery 첫 호출→castelia-field-intro. 전시를 보고 기존 동쪽 화물부두(44,50,13×10)의 이벤트를 직접 조사해 수레 길을 비교한 후 주택 옆 화분골목(50,19,2×10)에서 거처의 좁은 길을 기록한다. 현장의 작업자/주민 대화는 해당 조사에서 전달하며 별도 NPC를 추가하지 않았다. 기존 지형의 넓은 운송로/좁은 생활로 차이를 소비한다. 원래 대사는 관찰 시작 전 유지한다. 기록 이후도 재조사 가능, 일회 persist, 전시 재방문 반응 및4번도로/뇌문·물풍경 다음 비교 이유를 연결한다. 관찰 메뉴 세개를 한 자리에서 체크하지 않는다. 기존 스케치 이벤트/선행기능을 보존했다.
- 그림: paintCasteliaProjectExhibit(c,mapId,o) export에 기존 가구크기 내부 사업동선 그림 작성. 중앙 renderer 가구루프에서 일반 그림보다 먼저 소비 요청했다. 중앙연결 전 전용그림 미연결이며 현재 공통가구 그림은 유지된다. engine/renderer/공유DB는 수정하지 않았다.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Castelia_City 를2026-09-13 직접 열람. BW2 표기 본문과 Oceanfront Road/Ocean Piers의 상업도시·항만·골목·갤러리 구분을 참고. BW2와BW의 선박/시설 차이는 채택하지 않았다. CH06 사업/시민 대화는 넥서스 채택서사 각색이며 원작사건이 아니다. 이미지 직접열람 없음, 외부 코드/자산 재사용 없음.
- 남은점: 중앙 전용가구 painter 연결, CH05 전체완료/원본 전달의 명시적 본편 API, 시민 설득/공개원본 확보/후속도시 본편 단계는 미구현. QA 전부 미실행, 도시/CH06 완료 아님. 이번구름 도입 묶음 후 다른 도시 확장하지 않는다.
<a id="record-unova-continuation-20260913-최신-작업--8번도로-진입-높이와-습지-분기-연결"></a>
#### 최신 작업 — 8번도로 진입 높이와 습지 분기 연결

- 결함/구현: 기존 목재 분기 표시가33..37열과5행만 사용해 실제 습지 워프39,5 앞의 접근 재질이 끊겼다. 기존 보행칸에서35..40/5..8 착지면과33..37/7..16 목재길을 이어 표현했다. props39,7은 #이므로 덧칠되지 않는다. 서쪽1..7/16..20은 설화 둑 착지면,5·6열은 동서 진행 계단,22..24/14..17은 기존 북쪽 선택 트레이너 공터와 본선을 잇는 답압면으로 표시한다.
- 보존/소비: unova-route-eight.ts의 기존 paintUnovaRouteEight 내부만 변경. map.walkable==='.' 및 terrain 제외를 먼저 적용하여 보행·풀밭·조우·워프·NPC·이벤트/저장은 변경하지 않는다. explore-art 기존 호출 소비, 공통 수정/추가 훅 없음. 새 계단은 높이 표현이며 일방통행이 아니다.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8 의 Route description과 BW2 조우표를2026-09-13 직접 열람했다. 원작은 설화 동쪽에서 습지/다리로 분기하며 BW2 딱정곤·쪼마리 비율은 버전별로 다르다. 현재 프로젝트는 마른 안전 본선/선택풀밭/낮춘 레벨 계약을 유지한다. 좌표·목재길·계단은 프로젝트 연결 가독성 보수이며 원작 지도 재현 아님. BW 벨/플라스마 길막·Surf·결빙·새보상 채택 없음. 지도 이미지 미열람, 외부 코드/자산 재사용 없음.
- 상태: 코드 반영·모든 QA 미실행. 실제 분기/도시 귀환/트레이너 접근과 계단 가독성은 재개 후 검증이 남으며 도시 완료 아님.
<a id="record-unova-continuation-20260913-최신-작업--생활관-동료-교류-코너"></a>
#### 최신 작업 — 생활관 동료 교류 코너

생활관1층 기존 두 번째 가구(설치 좌표19,7)를 동료 교류 코너로 변경했다. 현재 파티를3마리씩 살펴 실제 동료를 선택하면 현재레벨/HP/만난곳/실제 pokemonMoves를 보여 준다. 같은 객체가 파티에 남았는지 확인한 뒤 해당 슬롯의 공통 파티 화면, 센터 회복·PC,8번도로 기존 실전 준비 NPC로 연결한다. 레벨19와 상대18/19를 비교한 준비 조언만 하며 성장량/출전성과를 추정하지 않는다. 빈 파티/기절/취소도 기록이나 보상 없이 되돌아간다. 가구 painter는 기존 테이블 위 기술 앨범과 볼 방석으로 표시한다.

소비: icirrus-interiors 기존 가구/props 등록 → journey-services가 이미 호출하는 icirrus-home-life → 기존 파티 UI/길안내. icirrus-hall-art 기존 renderer 소비로 가구 표시. 공통 수정/새 훅 없음. 문·가구좌표·충돌·기존 도착/물비교/관찰/전투 유지.

출처: https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 의 Pokémon Fan Club 및 Items BW/BW2 항목을2026-09-13 직접 열람. 원작은 동료를 보여 주고 만난 이후 성장량에 따라 물품을 받는 장소다. 이번은 넥서스 생활관 내부 교류 코너 각색이며 팬클럽 건물 재현이 아니다. metLevel 계약을 도입하거나 성장차를 추정하지 않고 원작 보상/친밀도평가를 미채택했다. 코드/자산 재사용 없음. 모든 QA 미실행. 남은 것은 실제 가구접근/파티화면 복귀/실전까지 자연이동 검증이며 도시 완료 아님.
<a id="record-unova-continuation-20260913-최신-정정--풍차-실루엣을-북쪽-두-행에-수용"></a>
#### 최신 정정 — 풍차 실루엣을 북쪽 두 행에 수용

이전 풍차 중심 y36은 실제 남쪽길과 겹쳐 #clip으로 몸체가 잘릴 수 있었다. icirrus-art의 그림을 타일34..36/34..35(48×32px) 안에 온전히 수용하도록 축소했다. 날개는 픽셀 x+53..90/y+1..22, 기둥은y+14..26, 받침은y+27..30이며 길 시작y+32까지 침범하지 않는다. 전체3×2 footprint가 #인지 먼저 읽고 한 칸이라도 보행이면 풍차 전체를 생략하여 조각 실루엣을 만들지 않는다. 기존 길·워프·props·안내판은 보존했다. 이번 수정은 앞선 자체 배치 오류 보수이며 새 원작 대조가 아니다. QA는 전부 미실행, 실제 가독성은 미검증이다.
<a id="record-unova-continuation-20260913-최신-작업--남쪽-풍차와-귀환-안내판"></a>
#### 최신 작업 — 남쪽 풍차와 귀환 안내판

기존31,34,11×6 귀환 부조 영역을 풍차 받침/기둥/고정 날개와 작은 안내판으로 교체했다. feature 이름/설명, 기존 explore-art의 호출 조건과 map 인자, icirrus-art의 painter를 연결했다. 그림 전체는 실제 #칸으로 clip하여 기존 남쪽 보행길을 덮지 않는다. 기존 tourOutdoor3 중 남쪽 보행에 인접한 조사칸을 우선 골라 안내판 하나로 모으고 props/outdoors.cells를 함께 맞췄다. 기존 interiors 설치에서 호출하며 이벤트/페이지/귀환 기능/워프/보행/저장은 유지한다. 정지 풍차이며 애니메이션은 추가하지 않았다.

근거: 중앙이2026-09-13 직접 열람한 https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 본문203~205의 남쪽 풍차/고지대 건물 사실과 이 작업의 앞선 동일 본문 열람을 재사용한다. BW2 기본 대조이나 풍차 좌표/형태는 프로젝트 재구성이다. https://www.serebii.net/pokearth/maps/unova/40.png 이미지 시각열람은 미확인이고 원작 지도 재현으로 주장하지 않는다. 외부 코드/자산 재사용 없음. 공통 explore-art에는 기존 호출 한 곳의 조건/인자만 수정했다. 모든 QA 미실행, 실제 풍차 실루엣/부분 클립 가독성·안내판 접근은 남은 검증이며 도시 완료 아님.
<a id="record-unova-continuation-20260913-최신-작업--연못-동쪽-고지-보행-연결"></a>
#### 최신 작업 — 연못 동쪽 고지 보행 연결

- 결함/변경: 기본 계획의 중앙길21..26과 연못17..25/5..12가 겹쳐 북쪽 일부 수변 통과폭이26열 한 칸으로 줄어드는 구조다. 수역 밖26..28/4..14를3칸 석재 둑길로 열어 남쪽 거리↔북쪽 접근/생활관 갈림길의 공간을 확보했다. 남쪽12·13행은 낮은 계단으로 표시한다. 기존 유효 보행칸은 닫지 않고 props/NPC 칸은 보존하며 수역·문·워프·저장은 변경하지 않았다.
- 소비: icirrus-city-layout.ts의 ICIRRUS_POND_BANK/openIcirrusPondBank → icirrus-interiors 기존 설치, icirrus-art 기존 TownDetails의 같은 좌표 painter, 기존 paintIcirrusMinimapAccess에 새 접근면 포함. 공통 파일/추가 중앙 훅 불필요. 기존 전망판·계단·습지길·활동 보존.
- 원작 근거: https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 를2026-09-13 다시 열람했다. 공통 본문의 습지와 높은 건물 지대/동쪽8번도로/북쪽용나선 연결, BW2 항목의 체육관 폐쇄 및 BW와의 차이를 확인했다. 이번에는 지도 이미지 직접 열람 없음.3칸 둑길과 계단 좌표는 기존 프로젝트의1칸 병목을 보수하는 자체 재구성이며 원작 지형 복제가 아니다. 원작 신규 시설/겨울/통행잠금/수상이동/보상 미채택, 외부 코드·자산 재사용 없음.
- 상태: 코드 반영·QA 전부 미실행. 실제 경로 폭/화면/미니맵·출입·저장 검증 및 BW2 지도 이미지 대조는 남는다. 도시 완료 아님.
<a id="record-unova-continuation-20260913-최신-작업--실제-건물-문-앞-고지-접근면"></a>
#### 최신 작업 — 실제 건물 문 앞 고지 접근면

- 변경: icirrus-art.ts의 기존 paintIcirrusTownDetails 마지막에 실제 center/mart/hall/home1/home2 실내행 warp 좌표를 읽는 문 앞 발판을 연결했다. 문 남쪽1행은 석재 착지면,2행은 낮은 계단을3칸 폭으로 표시한다. 실제 보행칸만 칠하며 props/terrain은 제외한다. 앞선 공통 높이 경계 표현을 문 접근면에서 덮어 문까지 이어지는 재질을 명확히 한다. 기존 호출이 소비하므로 공통 파일/중앙 훅 변경 없음.
- 범위: 보행·건물문·워프·기존 위치·저장·활동 모두 유지했다. 접근 불가를 실행으로 확인한 수정이 아니라 실제 출입 워프와 고지 접근 그림의 연결 보수다. 기존 전망둔덕/습지길/중앙 조사판 수정 보존. 새 맵/시설/기능/잠금 없음.
- 출처: https://www.serebii.net/pokearth/unova/icirruscity.shtml (2026-09-13 열람), 페이지 HTML의 지도 참조 https://www.serebii.net/pokearth/maps/unova/40.png 를 직접 열었으나 도구 결과에 시각 이미지가 표시되지 않았다. BW/BW2 공용 참조 이미지의 버전별 상세 차이는 미확인이다. 앞선 https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 본문의 습지 주변 고지대 건물 설명을 참고한다. 이번3×2 접근면은 기존 프로젝트 문 위치에 맞춘 자체 구성이며 BW2 원작 계단 좌표 재현이 아니다. 외부 코드/자산 재사용 없음.
- 상태: 소스 반영·모든 QA 미실행. 남은점은 지도 이미지 실제 열람/버전 확인, 자연 출입 및 주변 계단·건물 그림의 가독성 검증이다. 도시 완료 아님.
<a id="record-unova-continuation-20260913-최신-작업--습지-세-경로의-재질과-갈림길-구분"></a>
#### 최신 작업 — 습지 세 경로의 재질과 갈림길 구분

- 구현: icirrus-moor-path-art.ts를 unova-icirrus-moor.ts의 기존 paintIcirrusMoor에서 기본 지형 직후 호출한다. 중앙은3칸 목재 중심선과 보행 가능한 자갈 어깨, 서쪽은 황토 답압면/갈대 가장자리, 동쪽은 방향에 따라 널 방향이 꺾이는 회녹색 데크다. 중앙의 실제 네 순환로 합류 구간에서 재질을 넓혀 갈림길을 구별한다. 경계선은 실제 인접 #칸 방향에만 그리며 가로막는 난간을 추가하지 않는다.
- 보존: 56×48, 보행 문자열 전체, 워프·NPC·조사좌표·서쪽 조우terrain 유지. terrain 칸은 덧칠하지 않고 기존 풀밭 소비를 보존한다. 기존 props/관찰 painter보다 먼저 적용한다. 시각적으로 중심선 폭을 구별하되 어깨도 계속 걸을 수 있다. 직각 순환로의 실제 위상은 변경하지 않았다. 생활/완료기록/동료추적 코드 및 공통 renderer/JSON/CONTINUE_STATE 수정 없음.
- 자료: https://www.serebii.net/pokearth/unova/mooroficirrus.shtml 을2026-09-13 열람, BW2 Standard Walking 종/레벨 구분과 BW/BW2 트레이너 구분을 확인했다. https://bulbapedia.bulbagarden.net/wiki/Moor_of_Icirrus 의 앞선 Geography 열람은 웅덩이와 그루터기의 지형 근거로 재사용한다. BW2 지도 이미지 자체는 이번 도구 응답에서 확인되지 않았으므로 원작 지도 대조 완료로 표시하지 않는다. 기존 프로젝트의 마른 안전길/서쪽 제한 조우/56×48 순환로를 유지한 자체 재질 설계이며 원작 데크 배치 복제가 아니다. 계절·Surf·원작 레벨·아이템·보상 채택 없음, 외부 코드/자산 재사용 없음.
- 상태/남은점: 기존 painter 소비까지 코드 반영, 모든 QA(테스트/타입/빌드/게임 브라우저/시청각/저장) 미실행. 실제 BW2 지도 이미지 대조, 재질 경계/관찰 그림과의 가독성 및 자연 보행 검증이 남는다. 도시 완료 아님.
<a id="record-unova-continuation-20260913-最新-작업--올라갈-수-없던-설화-전망-둔덕-개방"></a>
#### 最新 작업 — 올라갈 수 없던 설화 전망 둔덕 개방

- 결함/변경: 기존 용나선탑 전망 둔덕(29,16,13×7)은 내부 접근 공간 없이 막힌 rocks 시설이었다. 남쪽 거리에서35..36/21..24 계단과32..38/20..21 전망 발판을 열었다. 통로의 tourOutdoor2 테두리 props와 outdoors cells만 함께 제외하고 다른 조사물/NPC를 보존한다. 보행 칸을 닫거나 워프·저장 위치·맵 크기를 변경하지 않는다. 동쪽8번도로 접근로도 유지한다.
- 실제 소비: icirrus-city-layout.ts의 openIcirrusLookout을 기존 icirrus-interiors.ts 설치에 호출했다. 동일 ICIRRUS_LOOKOUT_ACCESS를 icirrus-art.ts의 기존 paintIcirrusTownDetails가 읽어 석재 발판/계단을 그린다. 기존 icirrus-overlook-art의 보행 클립이 새 발판 위 암반을 제외한다. 공통 renderer/battle/runtime JSON 수정 없음, 중앙 추가 훅 필요 없음.
- 원작 근거: https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 를2026-09-13 본문 열람했다. 기본 대조 BW2. 공통 지리 본문은 습한 저지대 때문에 다수 건물이 높은 땅에 있으며 북쪽 용나선탑/동쪽8번도로 연결을 설명한다. 이 지형 원칙을 프로젝트 기존 전망 둔덕에 적용했다. BW2 지도 이미지 자체는 이번 열람에서 확인하지 못했으므로 원작 좌표/외관 대조 완료가 아니다. 원작 시설/겨울 잠금/체육관/출구를 새로 채택하지 않았다. 외부 코드·이미지 재사용 없음.
- 상태: 코드 반영·미검증. QA 중단으로 테스트·빌드·브라우저·저장·시청각 모두 미실행. 계단 실제 접근과 경계 가독성은 재개 후 확인한다. 설화 전체 완료 아님. 다음은 실제 BW2 지도 이미지 확보 후 기존 건물 문 접근과 고지/저지 연결의 남은 차이를 다룬다. 직전 전투 훅은 중앙이 연결했다고 전달했으므로 재구현하지 않았다.
<a id="record-unova-continuation-20260913-최신-작업--현지-포획-동료와-기존-선택-실전-연결"></a>
#### 최신 작업 — 현지 포획 동료와 기존 선택 실전 연결

- 변경: src/icirrus-route-battle.ts의 showIcirrusRouteBattle(g,start?)를 작성했다. 실제 met가 하나8번도로 또는 설화의 습지인 파티/PC 동료와 현재 HP를 읽는다. 공통 showTrainerPreparation을 소비해 기술 확인→실제 선두 선택→기존 startBattle을 연결한다. 전투/저장/데이터 계산을 복제하지 않았다. 선택 실전 승리 후 재대화는 부상 상태에 따른 회복 또는 튜브라인브리지→9번도로→쌍용 여행, 습지 재방문을 제공한다. 포획·승리를 통행 조건으로 추가하지 않는다.
- 연결 상태: 중앙 담당에게 road-trainers.ts의 기존8번도로 승리 분기 및 startBattle 정의 뒤 지역 분기에 이 함수를 연결하도록 정확한 최소 훅을 전달했다. 공유 파일은 이번 담당이 수정하지 않았다. 중앙 연결 전에는 미연결이며 런타임 적용 완료로 보고하지 않는다. 기존 출발 조건/팀/620원 일회 상금/경험치/패배 처리는 공통 코드가 유지한다. 특정 동료의 출전·승리 기록은 별도로 추가하지 않았다.
- 외부 근거: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8 본문 Connecting locations 및 Route description을 2026-09-13 직접 열람. 기본 대조 BW2, BW의 벨·플라스마단 길막은 별도 버전 내용이므로 채택하지 않았다. 원작 연결은 서쪽 설화시티/북쪽 설화습지/동쪽 튜브라인브리지다. 이번 선택 트레이너와 레벨/상금·마른 풀밭 조우는 기존 프로젝트 재구성이며 원작 트레이너 재현이 아니다. 코드/자산 재사용 없음.
- 관련 문서: ../WORLD_ROUTES.md의8번도로 경유 및 ../MAP_STORY_DESIGN.md의 설화 선택 활동, ../REFERENCE_RESEARCH.md의 기존 습지 조사 근거에 연결하는 지방 적용 기록이다. 중앙은 필요한 공통 대장 링크만 반영할 수 있다.
- 검증: 소스 읽기/구현만 수행. 테스트·빌드·브라우저·저장·음향·시각 QA 모두 미실행. 남은 도시 요구: 중앙 훅 연결, 정상 포획→편성→기술 선택→승패→회복/다리 귀환의 재개 후 검증, 채택 본편 사건/성장 공급의 도시 수준 적용. 이번 묶음으로 도시 완료를 판정하지 않는다.

<a id="record-unova-continuation-20260913-최신-작업--원작-지형-참고-그루터기와-현지-길찾기"></a>
#### 최신 작업 — 원작 지형 참고 그루터기와 현지 길찾기

설화습지 서쪽 포획 풀숲 옆과 동쪽 물새 길 옆의 기존 막힌 칸에 서로 구별되는 그루터기를 그림/조사물/이벤트로 연결했다. 조사 선택은 기존 갈대/물새 지점과 남쪽 귀환 데크 길안내로 이어진다. 기존 보행과 조우는 보존하며 조사 발판이 풀밭을 덮지 않도록 했다. 근거·버전 차이·실제 소비 위치는 REFERENCE_RESEARCH의 2026-09-13 그루터기 적용 절에 기록했다. QA는 모두 미실행. 다음은 현재 습지의 포획 동료를 기존 선택 실전과 연결하는 흐름을 살피며, 지형 장식이나 기록만 반복 추가하지 않는다.
<a id="record-unova-continuation-20260913-설화습지-동료-관찰-재방문-연결-보수"></a>
### 설화습지 동료 관찰 재방문 연결 보수

<a id="record-unova-continuation-20260913-중앙-후속--생활-뜰-입구의-조사물-제거-누락-수정"></a>
#### 중앙 후속 — 생활 뜰 입구의 조사물 제거 누락 수정

이전 통로 helper가 모든 props를 보존하면서 뜰 테두리에 생성된 tourOutdoor1도 남겼다. 이 때문에 내부 길만 열리고 테두리 입구가 막히는 누락이 있었다. 통로 안의 해당 조사물만 map.props와 outdoors.objects.cells 양쪽에서 제외한 후 같은 격자를 개방하도록 수정했다. 잔여 시설 가장자리의 조사와 이벤트 ID는 보존한다. 설치 호출에 실제 outdoors 데이터를 전달한다. 테스트·빌드·브라우저 QA는 중단 유지로 미실행이며 이전 기록의 개방 표현은 코드 의도와 실제 검증을 구분해 읽는다.

<a id="record-unova-continuation-20260913-중앙-후속--실제-출구와-장식-경계-정합성"></a>
#### 중앙 후속 — 실제 출구와 장식 경계 정합성

설화 전용 painter의 북쪽 기둥 두 개는 기존 보행 여부와 무관하게 그려지고 있었다. 기둥 상단/받침까지 실제 #칸으로 clip해 보행 칸을 가리는 표현을 제외했다. 동·북쪽 고정 입체 문턱은 제거하고 북쪽 야외 워프에서 남쪽으로 이어지는 실제 보행 칸에 평면 방향표를 그린다. 기존 동쪽 화살표와 모든 워프/충돌은 유지한다. 구현 지시서의 ‘실제 길과 그림 일치’에 따른 프로젝트 표현 보수이며 원작 재현 판정은 아니다. QA 중단으로 브라우저·보행·시각 검증 미실행.

<a id="record-unova-continuation-20260913-중앙-후속--설화-생활-뜰-보행-개방"></a>
#### 중앙 후속 — 설화 생활 뜰 보행 개방

구현 지시서3절 공간 밀도를 적용해 통째로 막혀 있던 생활 뜰에 x10..11/y16..22 남북 통로와 y19/x10..16 동쪽 가지를 추가했다. 기존 보행 칸을 닫지 않고 NPC·조사물 칸은 보존한다. 기존 도시 설치에서 호출하며 전용 painter는 같은 통로 좌표와 실제 보행 격자를 읽어 목재 바닥을 그린다. 시설 그림의 기존 보행 클립으로 통로 위 장식을 제외한다. 원작 지도 복제가 아닌 프로젝트 생활 동선 보수이며 세척/회복 기능을 새로 구현한 것은 아니다. QA 중단으로 자연 보행·시설 가독성·시각 검증은 미실행이다.

<a id="record-unova-continuation-20260913-중앙-후속--물새-관찰의-행동과-현장-결과"></a>
#### 중앙 후속 — 물새 관찰의 행동과 현장 결과

갈대 기록 뒤 물새 데크에서 난간 뒤 기다리기/발자국 조사/미루기를 선택한다. 기다리기는 선택 즉시 기존 물새 기록을 남기는 연출이며 실제 시간 대기 시뮬레이션은 아니다. 발자국만 조사하면 방향을 확정하지 않고 관찰로 돌아갈 수 있다. 완료 후 기존 motion painter에 북쪽으로 향하는 먼 날갯짓3개를 연결했다. 종 지정·포획 NPC·새 보상·통행 잠금 없이 프로젝트의 기존 생활 관찰을 보강한다. 기존 완료 저장은 재풀이를 요구하지 않는다. 테스트·빌드·브라우저·시각 QA는 중단 유지로 미실행이다.

<a id="record-unova-continuation-20260913-중앙-후속--갈대-현장-비교-선택"></a>
#### 중앙 후속 — 갈대 현장 비교 선택

처음 갈대 말뚝을 조사하면 자동 완료 대신 실제 동료와 젖은 아래 눈금/마른 갈대 끝을 비교해 현재 수위를 선택한다. 정답일 때만 기존 갈대 완료 플래그를 기록하고 다음 물새 데크로 안내한다. 오답은 단서를 다시 살피며 HP/아이템 손실 없이 재시도한다. 취소는 완료하지 않는다. 기존 완료 저장은 그대로 재확인하며 새로운 필수 통행 조건은 없다. 그림에는 물선을 관찰 전부터 표시하고 기록 후 별도 체크를 더한다. 이 퍼즐은 프로젝트 생활 활동 보강이며 원작 사건 재현이 아니다. 코드만 반영했고 모든 QA는 미실행이다.

<a id="record-unova-continuation-20260913-중앙-후속--관찰-현장에-선택-동료-표시"></a>
#### 중앙 후속 — 관찰 현장에 선택 동료 표시

갈대·물새·북쪽 전망 지점의 세 칸 이내에서 멈추면 실제 선택한 건강한 파티 동료를 옆의 빈 데크에 표시한다. `icirrusMoorPartnerLayer`가 위치를 고르고 renderer가 기존 종별 이미지를24px로 축소해 깊이 정렬한다. 실제 필드 보행 스프라이트나 추종 이동은 아닌 정지 관찰 연출이다. NPC·워프·조사물·플레이어 바로 옆 칸을 피하며 빈 자리가 없으면 생략한다. 기절/PC 맡기기 후에는 표시하지 않는다. 기존 기록판의 완료 표시와 함께 사용하고 새 충돌·저장·활동 보상은 없다. QA 중단으로 실제 화면·가독성·이동은 미검증이다.

<a id="record-unova-continuation-20260913-중앙-후속--전투-준비와-관찰-동료-유지"></a>
#### 중앙 후속 — 전투 준비와 관찰 동료 유지

`field-partner-party.ts`의 공통 파티 변경 훅을 선두 교체·PC 맡기기·파티/박스 교환에 연결했다. 실제 포켓몬 객체를 따라 관찰 동료의 슬롯을 갱신하므로 선두 변경이나 다른 동료를 맡긴 뒤에도 진행 중인 습지 관찰을 이어갈 수 있다. 기존 무궁 꽃 돌봄 추적도 같은 훅에서 보존한다. 관찰 동료 자체를 맡기면 슬롯 연결만 해제해 같은 종의 다른 개체가 기록을 이어받지 않게 한다. 수첩 기록은 남지만 다시 동료를 선택하면 새 관찰을 시작한다. 영구 개체 ID/박스 복귀 자동 복원은 이번 범위가 아니다. 관련 안내도 수정했다.

QA 중단으로 테스트·타입 검사·빌드·브라우저·저장 검증 미실행. 코드 반영·미검증이며 도시 완료가 아니다. 다음 continue에서는 이 슬롯 이동 보수를 반복하지 않고 기존 현장 활동의 선택/결과를 이어 보강한다.

<a id="record-unova-continuation-20260913-최신-인계--8번도로-포획전투-준비와-안전-귀환"></a>
#### 최신 인계 — 8번도로 포획/전투 준비와 안전 귀환

- 플레이 변경: `src/unova-route-eight.ts` 북쪽 서식지 아래(18..20,13..15)에 짧은 마른 귀환 샛길을 열었다. 기존 막힌 칸을 여는 국소 변경으로 유효 저장 위치를 없애지 않으며 기존 격자 기반 painter가 실제 길을 그린다. 풀밭/조우/트레이너/워프는 유지한다. 센터 귀환 때 풀밭 재진입을 피하는 선택 경로다.
- 준비 연결: `src/journey-services.ts`의 8번도로 여행자는 현재 HP·몬스터볼·파티의 실제8번도로 출신 동료를 읽어 센터 회복/PC, 상점 보충, 기존 북쪽 서식지 조사 지점, 기존 선택 트레이너, 습지 관찰, 동쪽 다리로 길안내한다. 건강/보급이 준비되면 현지 동료가 없는 파티에는 서식지, 있는 파티에는 트레이너를 먼저 제시한다. 자동 전투/회복/포획은 수행하지 않는다.
- 검증: 구현과 소스 확인만 수행. QA 중단으로 테스트·빌드·브라우저·저장/시청각 확인 없음. 경로/대화 실제 동작과 전투 밸런스는 미검증이다. 새 원작 사실·본편 잠금·보상·도시 확대는 없다.
- 남은 문제/다음 continue: `src/icirrus-moor-life.ts`의 파티 슬롯 기반 동료 식별을 공통 Pokemon 필드와 대조해 포획 후 교대/PC 준비로 관찰이 끊기는 문제를 보수한다. 이번 안내와 샛길을 재구현하지 않는다. 설화 전체 완료 아님.

<a id="record-unova-continuation-20260913-최신-인계--습지-조사-접근면과-귀환-표시"></a>
#### 최신 인계 — 습지 조사 접근면과 귀환 표시

- 변경: `src/unova-icirrus-moor.ts`의 기존 네 props는 인접 보행 칸이 있어 이동하지 않았다. 각 prop의 실제 인접 보행 칸을 읽어 작은 목재 조사 발판을 그린다. NPC 칸은 제외한다. 귀환 데크에는 남향 표식, 기존 남쪽 워프 앞에는 세 바닥 방향표를 추가했다. 충돌·조사 ID·저장·워프는 유지한다.
- 생활 움직임: 기존 갈대 좌표가 보행로 위에 있어, 인접한 막힌 칸 중 조사물이 없는 곳으로만 움직임을 그리도록 수정했다. `renderer.ts`의 기존 호출에 map을 전달했다. 기존 관찰 결과/재방문 painter는 유지한다.
- 검증: 소스/배치 읽기 및 연결 확인만 수행. 테스트·빌드·브라우저·저장/시청각 QA는 중단 유지. 실제 접근 입력·화면 가독성은 미검증이다. 원작 사실·새 장소·보상 채택 없음.
- 다음 continue: `src/icirrus-moor-life.ts`의 같은 동료 식별이 파티 슬롯 이동에 따라 끊기는 기존 한계를 공통 Pokemon 저장 필드와 대조한다. 안정 식별 필드가 없다면 동일 종을 동일 개체로 가정하지 말고 기존 진행을 보존하는 명시적 동료 재선택 흐름으로 보완한다. 그림을 반복 추가하지 않는다. 도시 완료 미판정.

<a id="record-unova-continuation-20260913-최신-인계--8번도로-경로-구별과-조사-접근"></a>
#### 최신 인계 — 8번도로 경로 구별과 조사 접근

- 변경: `src/unova-route-eight.ts`의 서쪽 경계 조사물을(5,24)→(5,22), 동쪽 표지를(58,12)→(58,14)로 옮겼다. 각각 본선 보행(5,21)/(58,15)에 인접한다. 원래 두 위치는 주변이 막혀 있었고 새 위치도 기존 막힌 칸이므로 유효 보행 칸·워프·이벤트 ID는 보존한다. 동쪽 props와 signs 좌표를 함께 수정했다.
- 지형: 기존 painter에 중앙 마른 본선, 북쪽 습지 분기의 목재 데크, 북쪽 트레이너 앞 대기 공간을 연결했다. 실제 보행 칸만 그리며 선택 풀밭은 제외해 조우 경계를 유지한다. 맵 크기/충돌/트레이너/조우표는 변경하지 않았다. 원작 사실을 새로 채택하지 않은 프로젝트 경로 보수다.
- 검증: 소스 연결/좌표 읽기만 수행. 테스트·빌드·브라우저·저장/시각/음향 QA 중단 유지. 실제 표지 조사·보행·화면은 미검증이다.
- 다음 continue: `src/unova-icirrus-moor.ts`의 귀환 데크(21,39)와 각 관찰 지점 주변 보행/props를 읽어 접근 가능한 조사면과 그림이 맞는지 기존 범위 안에서 보수한다. 이번 8번도로 재질/표지 작업은 반복하지 않는다. 도시 완료 미판정.

<a id="record-unova-continuation-20260913-최신-인계--생활관-전체-활동의-다음-동선"></a>
#### 최신 인계 — 생활관 전체 활동의 다음 동선

- 변경: `src/journey-services.ts`의 기존 생활관 이벤트를 보완했다. 1층 도착 기록 결과→2층 물 비교, 선행 기록 없는2층→1층/도시 연못, 비교 결과→연못 수위판/3층/습지, 3층 휴게 결과→북문 접근로/설화센터의 실제 setTourDestination 선택을 연결했다. 물 비교 재방문은 기존 습지 완료 기록도 읽는다.
- 보존: 기록 순서·플래그·보상·HP·워프·가구 위치는 유지했다. 콜백은 시작 저장·층·전투 상태를 확인한다. 새 본편/원작 사실/지역 잠금을 추가하지 않았다.
- 검증: 소스 연결만 확인. 테스트·빌드·브라우저·저장/시청각 QA 중단 유지. 실제 계단 길안내·목적지 도달은 미검증이다. 도시 완료로 판정하지 않는다.
- 다음 continue: 생활관/연못의 미세 안내 추가를 반복하지 않는다. `src/unova-route-eight.ts`의 긴 안전 본선과 선택 풀밭 주변에서 기존 트레이너·습지 분기가 시야에 구별되는지 소스를 읽고 길의 지형/조사 접근을 보수한다. 맵 확대 없이 기존 설화 담당 범위를 유지한다.

<a id="record-unova-continuation-20260913-최신-인계--연못과-생활관습지-연결"></a>
#### 최신 인계 — 연못과 생활관/습지 연결

- 변경: `src/icirrus-home-life.ts`의 기존 `tourOutdoor0`에서 도착 기록 전→생활관1층, 기록 후→2층 물 비교, 습지 현장 관찰로 실제 길안내를 연결했다. 재방문 시 물 비교/습지 완료 플래그에 반응한다. 기존 조사 핸들러 연결을 사용한다.
- 현장 결과: `src/icirrus-pond-art.ts`가 기존 연못 조사물 중 북쪽 막힌 물가 칸을 찾아 수위판을 그린다. renderer가 기존 `icirrusWaterCompared`를 전달해 비교 완료 선을 표시한다. 그림은 기록을 만들거나 물 높이를 변경하지 않는다.
- 검증: 소스 읽기와 호출 확인만 수행했다. 테스트·빌드·브라우저·저장/시청각 QA는 중단 유지. 수위판 위치/가독성/길안내 실제 표시는 미검증이다. 새 원작 사실·맵·보상·잠금·회복은 추가하지 않았다.
- 다음 continue: 생활관2층 `tourIcirrusWaterStudy`의 선행 기록 부족 안내와 비교 결과에서 실제 다음 목적지 선택이 없는 부분을 보완한다. 현재 기록 순서와 기존 플래그는 유지한다. 이번 연못 painter/조사 안내는 반복하지 않는다. 도시 완료 미판정.

<a id="record-unova-continuation-20260913-최신-인계--도시-빗물-연못-보수"></a>
#### 최신 인계 — 도시 빗물 연못 보수

- 변경: `src/icirrus-pond-art.ts`에서 기존 연못17,5/9×8과 실제 보행 격자를 함께 읽어 수면·석재 물턱·갈대를 그린다. `src/explore-art.ts` 해당 water 분기와 `src/renderer.ts` 움직임 호출까지 연결했다. 정적 수면과 물결이 같은 마스크를 사용한다.
- 중복 제거: 설화 연못만 공통 물결 대상에서 제외하고 `src/icirrus-art.ts`의 옛 연못 물턱/난간/물결 함수와 사용하지 않는 보조 함수를 제거했다. 새 물결은 주변 네 칸이 모두 수면인 내부에서만 움직인다. 보행 칸에는 수면을 칠하지 않는다. 맵 크기·충돌·워프·조사 이벤트·저장은 유지한다.
- 검증: 지침/소스/호출만 확인. 테스트·빌드·브라우저·저장/시청각 QA는 중단 유지, 실행 결과는 미검증이다. 원작 사실 추가 없이 기존 프로젝트 빗물 연못을 보수했다.
- 남은 문제/다음 continue: `src/icirrus-city-layout.ts`와 `src/explore-outdoors.ts`의 기존 연못 조사 `tourOutdoor0`에서 생활관 물 비교와 연결되는 실제 활동 안내가 있는지 읽고, 기존 기록을 활용한 귀환 동선을 보완한다. 이번 수면/둔덕/생활 뜰을 반복 제작하지 않는다. 도시 완료 미판정.

<a id="record-unova-continuation-20260913-최신-인계--용나선-전망-둔덕-보수"></a>
#### 최신 인계 — 용나선 전망 둔덕 보수

- 변경: `src/icirrus-overlook-art.ts`에서 층진 암반·갈라진 틈 식생·북향 방향판을 그려 `src/explore-art.ts`의 해당 rocks 분기에 연결했다. 공통 바위 네 덩어리를 대체하고 기존 `icirrus-art.ts`의 중복 축대/난간/깜빡이는 표식을 제거했다. 기존 13×7 지형 안의 막힌 칸만 그리므로 동쪽 보행축 위에 암반을 칠하지 않는다.
- 행동: `src/icirrus-home-life.ts`의 기존 외부 `tourOutdoor2`는 해자 관찰/탑 바람 기록에 반응하며 북문 접근로 또는 생활관 3층으로 실제 길안내한다. 전망 둔덕·탑 입구·8번도로 북쪽 습지의 차이를 설명한다. 기존 이벤트/워프/충돌/저장·보상은 변경하지 않았다.
- 검증: 소스 읽기와 호출 연결만 확인했다. QA 중단으로 테스트·빌드·브라우저·저장/시각/음향은 미검증이다. 바위와 보행 경계의 실제 가독성은 미확인이다.
- 근거: 기존 프로젝트 전망 지형의 보수다. 새 BW2 사실·자산·본편을 채택하지 않았으며 원작 지형 재현으로 주장하지 않는다.
- 다음 continue: `src/icirrus-art.ts`의 도시 빗물 연못과 `src/explore-art.ts`의 공통 water 렌더를 읽어 도시 연못의 반복 물결/보행 경계가 기존 습지 지형과 맞는지 보수한다. 이번 둔덕·생활 뜰은 재구현하지 않는다. 도시 완료 미판정·QA 중단 유지.

<a id="record-unova-continuation-20260913-최신-인계--생활-뜰-손질-공간-보수"></a>
#### 최신 인계 — 생활 뜰 손질 공간 보수

- 변경: `src/icirrus-art.ts`에 돌 수조·배수 홈·두 건조대·천·장화 선반을 그리는 painter를 추가하고 `src/explore-art.ts`의 해당 garden 분기에 연결했다. 공통 눈 장식과 예전 중복 난간/갈대 표현을 제거했다. map.walkable로 막힌 칸만 clip하여 기존 보행 칸에 시설 그림을 겹치지 않는다.
- 행동 연결: `src/icirrus-home-life.ts`에서 기존 설화 `tourOutdoor1`을 처리한다. 손질 기록을 읽고 기존 주택 1층 손질방/3층 건조 휴게방으로 실제 목적지 안내를 제공한다. 기존 핸들러 연결을 사용하며 새 이벤트·저장·회복·보상을 만들지 않았다.
- 검증: 소스 읽기와 연결 확인만 수행. 테스트·빌드·브라우저·저장/시각/음향 QA 중단 유지. clipping에 따른 가구 일부 가림과 안내선 실제 표시는 미검증이다. 기존 부지·맵 크기·충돌·워프는 보존한다.
- 원작/프로젝트: 기존 프로젝트 생활 뜰의 손질 역할을 표현했으며 새 원작 사실이나 BW2 원작 자산은 채택하지 않았다.
- 다음 continue: `src/icirrus-art.ts`와 설화의 rocks형 ‘용나선탑 전망 둔덕’을 대조해 공통 바위 네 덩어리가 전망 공간을 대신하는 부분을 실제 충돌/조사 지점에 맞춰 보수한다. 이번 생활 뜰/외관/동문은 다시 만들지 않는다. 도시 완료 미판정.

<a id="record-unova-continuation-20260913-최신-인계--실제-동문과-귀환-부조-구분"></a>
#### 최신 인계 — 실제 동문과 귀환 부조 구분

- 변경: `src/icirrus-city-layout.ts`의 남동쪽 statue형 ‘8번도로 동문’을 ‘습지 여행 귀환 부조’로 바로잡았다. 기존 11×6 부지/종류/배열 순서와 `tourOutdoor3` 이벤트를 유지한다. 설명은 실제 출구가 동쪽 마른 길 끝이며 습지와 북문 접근로가 별도라는 내용으로 수정했다.
- 그림: `src/icirrus-art.ts`의 낮은 경로 부조 painter를 `src/explore-art.ts`에 연결해 기존 큰 사람 모양 조각상을 대체했다. 실제 8번도로 워프를 읽어 진입 보행 칸 다섯 곳에 동쪽 방향 바닥 상감을 그린다. 추가 장애물·워프·저장 변경은 없다.
- 검증: 소스와 기존 호출을 읽었다. QA 중단에 따라 테스트·빌드·브라우저·저장/시각/음향 검증 없음. 실제 화면에서의 경로 인지와 기존 길안내 문구 표시는 미검증이다.
- 근거/차이: 기존 프로젝트 장식/출구의 불일치를 바로잡은 것으로 새 원작 지리·사건을 채택하지 않았다. BW2 원작 부조 재현이 아니다.
- 다음 continue: `src/icirrus-art.ts`의 습지 생활 뜰 건조 난간과 `src/icirrus-city-layout.ts`의 garden형 생활 뜰을 대조해 반복 눈 장식이 손질 공간처럼 보이지 않는 부분을 보수한다. 동문/부조/주택 외관을 다시 만들지 않는다. 도시 완료 미판정·QA 중단 유지.

<a id="record-unova-continuation-20260913-최신-인계--생활관과-주택-외관"></a>
#### 최신 인계 — 생활관과 주택 외관

- 변경: `src/icirrus-building-art.ts`를 작성하고 `src/explore-art.ts`의 실제 건물 painter에 연결했다. 설화 생활관·주택1·주택2의 room ID만 대상으로 하며 센터/상점 등 다른 건물은 기존 painter를 사용한다. 긴 전망창과 석재 현관의 생활관, 건조대가 있는 습지 주택, 바람막이가 있는 전망 주택으로 형태를 구분했다.
- 문/공간: 각 건물의 x/y/w/h 안으로 그림을 제한하고 door 좌표에서 문턱을 마지막으로 그린다. 기존 부지·출입 워프·통행·실내·깊이 정렬은 유지한다. 별도 이미지 자산이나 새 맵을 추가하지 않았다.
- 검증: 현재 지침·인계·건물 정의·공통 painter를 읽고 호출 연결을 확인했다. QA 중단에 따라 테스트·빌드·브라우저·저장/시청각 검증은 하지 않았다. 실제 화면의 높이감과 문 접근 가독성은 미검증이다.
- 원작/프로젝트: 기존 프로젝트 습지 주거/생활관 역할에 맞춘 창작 외관이다. 새 BW2 원작 사실이나 원작 건물 재현을 주장하지 않는다.
- 다음 continue: `src/icirrus-city-layout.ts`의 실제 동문(y18)과 남동쪽 statue형 ‘8번도로 동문’ 장식(x31,y34)이 서로 떨어진 문제를 읽고 기존 출구 인지가 어긋나는 장식을 보수한다. 워프·유효 보행 위치는 유지하며 이번 외관은 다시 만들지 않는다. 도시 완료 미판정·QA 중단 유지.

<a id="record-unova-continuation-20260913-최신-인계--주택-생활-가구-보수"></a>
#### 최신 인계 — 주택 생활 가구 보수

- 변경: `src/icirrus-home-art.ts`를 추가하고 renderer의 기존 가구 호출에 연결했다. 주택 두 동 각 1~3층의 기존 가구 크기·좌표·이벤트를 사용해 장화와 천, 장비 두루마리, 펼친 빗물 수첩, 탑 경로 지도, 낮은 방석을 그린다. 공통 가구 그림을 대체하며 충돌·계단·보행 위치는 바꾸지 않는다.
- 결과: 기존 손질 기록은 장화의 진흙 표시/방석, 습지 완료는 수첩 메모, 탑 관찰 단계는 지도 표시, 귀환 휴게는 방석의 사용 흔적에 반영된다. 새 원작 사실·보상·회복·본편은 추가하지 않은 프로젝트 생활 표현이다.
- 오류 보수: `src/icirrus-home-life.ts`의 선택 콜백을 시작한 맵으로 한정하고 손질 동료의 슬롯 내 동일 객체·건강을 다시 확인한다. 다른 집이나 변경된 파티에 이전 선택을 적용하지 않는다.
- 검증: 소스 읽기/호출 연결 확인만 수행했다. 테스트·빌드·브라우저·저장·시각/음향 QA는 중단 유지. 실제 가구 가독성과 회귀 동작은 미검증이다.
- 남은 문제/다음 continue: `src/icirrus-art.ts`와 `src/explore-layouts.ts` 및 설화 외부 건물 정의에서 주택 두 동·생활관·센터의 실제 현관과 외관을 대조해, 역할을 알 수 없는 반복 외관을 보수한다. 이번 주택/생활관 가구를 반복 구현하지 않는다. 도시 완료 미판정.

<a id="record-unova-continuation-20260913-최신-인계--생활관-세-층-가구벽면-보수"></a>
#### 최신 인계 — 생활관 세 층 가구/벽면 보수

- 변경: `src/icirrus-hall-art.ts`의 전용 가구 painter를 `src/renderer.ts`의 기존 가구 깊이 정렬 호출에 연결했다. 기존 가구 좌표/크기/이벤트를 읽고 일반 가구를 대체하므로 중복 그림을 쌓지 않는다. 1층은 도착 경로 지도, 2층은 마른 길·갈대·도시 물을 구분한 세 칸 수조, 3층은 탑 형태가 있는 전망 모형이다. 보조 가구는 수첩·시료·휴게석으로 구분한다.
- 결과: 도착 기록·물 비교·동료 휴게·용나선 바람의 기존 플래그를 읽어 가구의 기록표와 바람 표시를 그린다. `src/icirrus-art.ts`의 생활관 벽면도 1층 경로판/2층 수위 자료/3층 넓은 전망 창으로 교체했다. 28×24 크기·가구 충돌·계단·출구·저장 계약은 유지한다.
- 검증: 지침과 현재 소스를 읽고 렌더러 연결을 확인했다. QA 중단에 따라 테스트·빌드·브라우저·저장·시각/음향 검증은 실행하지 않았다. 화면 품질과 가구 가독성은 미검증이다.
- 원작/프로젝트: 새 원작 사실이나 자산은 채택하지 않았다. 기존 프로젝트 습지 생활관의 역할을 그린 창작 표현으로 BW2 원작 실내 재현은 아니다.
- 남은 문제/다음 continue: `src/icirrus-interiors.ts`의 주택 두 동과 `src/icirrus-home-life.ts`를 시작점으로, 손질방·빗물 기록방·건조 휴게방의 기존 가구를 역할에 맞게 보수한다. 이번 생활관 painter와 습지 관찰판은 재구현하지 않는다. 도시 완료 미판정·QA 중단 유지.

<a id="record-unova-continuation-20260913-최신-인계--현장-기록-시각-반응"></a>
#### 최신 인계 — 현장 기록 시각 반응

- 변경: `src/icirrus-moor-observation-art.ts`를 추가하고 `src/renderer.ts`의 import와 깊이 정렬 직전 호출 두 곳에 연결했다. 기존 props의 이벤트로 실제 좌표를 찾아 수위 눈금판·깃털 흔적판·북쪽 종합 기록대를 각각 그린다. 새 좌표나 조사 이벤트는 만들지 않았다.
- 행동 결과: 기존 갈대/물새 플래그에 따라 측정선·흔적 메모가 채워진다. 북쪽 기록대는 두 조사 결과를 각각 보여 주고 완료 시 묶음 표식을 표시한다. 같은 저장으로 재방문하면 그 상태를 다시 그린다. 건강한 선택 동료가 기존 슬롯/종 조건을 충족할 때만 다음 미완료 지점의 작은 책갈피가 움직인다. 그림은 저장을 수정하지 않는다.
- 근거/차이: 새 원작 사실은 채택하지 않았다. 기록판과 책갈피는 기존 프로젝트 선택 관찰의 결과 표현이며 BW2 원작 시설 재현 주장이 아니다. 맵 크기·충돌·워프·보상·본편은 그대로다.
- 검증: 소스 연결만 확인했다. QA 중단에 따라 테스트·빌드·브라우저·저장/시각/음향 검증 없음. 도시 완료가 아니다.
- 남은 문제: 기존 일반 조사물과의 실제 화면 겹침·읽기 쉬움, 슬롯/종 식별의 한계는 미검증으로 남는다. 설화 실내들은 아직 공통 외관 요소가 많다.
- 다음 continue 시작 위치: `src/icirrus-art.ts`의 `paintIcirrusInteriorDetails`와 `src/icirrus-interiors.ts`를 읽어 생활관 1층 도착 기록/2층 물 비교/3층 전망이 같은 벽 장식으로 보이는 부분을 실제 가구 위치에 맞춰 보수한다. 이번 관찰판/재방문 구현은 반복하지 않는다. QA 중단 유지.

2026-09-13. 변경 파일: `src/icirrus-moor-life.ts`.

기존 관찰원은 같은 동료를 다시 골라도 갈대·물새·완료 플래그를 삭제했다. 같은 파티 슬롯/종의 건강한 동료를 다시 선택하면 기록을 유지하고 다음 지점 안내로 이어지도록 수정했다. 다른 동료를 선택하면 새 관찰을 시작한다는 문구를 선택 전에 표시한다. 기존 저장 플래그와 슬롯/종 식별 계약은 유지한다.

갈대 조사 결과→동쪽 물새 데크, 물새 조사 결과→북쪽 전망대, 기록 완료→귀환 데크에 실제 `setTourDestination` 선택을 붙였다. 관찰원도 현재 단계에 맞는 다음 지점을 안내한다. 귀환 데크에서는 설화센터/8번도로/기록 재방문을 선택한다. 목적지 안내는 워프나 자동 이동이 아니다. 모든 콜백은 현재 저장·맵·전투 상태를 확인한다.

기존 `journey-services.ts`의 `handleIcirrusMoorLife` 연결을 그대로 사용하며 공통 파일 추가 수정은 필요 없다. 원작 사실·본편·보상·새 맵·통행 잠금·회복은 추가하지 않았다. 기존 동료가 기절하거나 원래 슬롯에 없으면 기록을 보존한 채 준비 안내를 표시한다.

QA 중단: 테스트·빌드·브라우저 실행 없음. 소스 수정만 반영했다. 실제 안내선·저장·재방문은 미검증이며 슬롯/종으로 동료를 식별하는 기존 한계도 남아 있다.











8번도로 후속 문구: tourRouteEightMarsh의 개발 기능 설명을 가운데 마른 길을 통한 설화시티/다리 귀환 행동 안내로 교체했다. 계절·날씨·수상 이동 미구현 경계는 개발 기록에 유지하며 QA 미실행.





중앙 연결 수신: casteliaRestingPokemonLayers를 renderer actor sort 직전에 등록하고 기존 pokemon-519/14px/imageSmoothing=false로 연결했다고 전달받았다. 전용 actor 소비는 코드 반영 상태이며 QA 전부 미실행. 앞선 연결대기 상태를 이 기록으로 갱신한다. 이번 정착 표현 묶음 종료.


---

<a id="record-unova-continuation-20260915"></a>
## unova-continuation-20260915

원래 문서: `docs/autonomy/unova-continuation-20260915.md`

<a id="record-unova-continuation-20260915-하나-구름시티-후속-구현--2026-09-15"></a>
### 하나 구름시티 후속 구현 · 2026-09-15

<a id="record-unova-continuation-20260915-하나-8번도로-실제-동료-실전과-설화-도착--2026-09-16"></a>
#### 하나 8번도로 실제 동료 실전과 설화 도착 · 2026-09-16

- 근거: [Bulbapedia Unova Route 8](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8), [Serebii Pokéarth Route 8](https://www.serebii.net/pokearth/unova/route8.shtml), [B2W2 Route 8 지도](https://bulbapedia.bulbagarden.net/wiki/File%3AUnova_Route_8_Map.png), [B2W2 Walkthrough Section 19](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_19), 2026-09-16 확인.
- 적용: 버전 교차 부분 풀 딱정곤·쪼마리 중 건강한 실제 선두 객체의 시작 레벨과 직접 격파·최종 승리를 기록하고 설화 동문에서 같은 객체의 현재 레벨·HP를 소비한다. 기절·PC 이동·과거 승리는 회복·재편성·무보상 재확인전으로 복구한다.
- 이동: 튜브라인브리지→8번도로 포획/실전→설화 동문→생활관→설화의 습지→전망→도로 번호 없는 용나선탑 접근로. 계절·결빙·수상·낚시·아이템은 미적용이며 QA는 중단 상태다.

<a id="record-unova-continuation-20260915-하나-9번도로-치라미-선택-조우와-라이더-실전--2026-09-16"></a>
#### 하나 9번도로 치라미 선택 조우와 라이더 실전 · 2026-09-16

- 근거: [Bulbapedia Unova Route 9](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_9), [Serebii Pokéarth Route 9](https://www.serebii.net/pokearth/unova/route9.shtml), [B2W2 Route 9 지도 자료](https://bulbapedia.bulbagarden.net/wiki/File%3AUnova_Route_9_Map.png), [B2W2 Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13), 2026-09-16 확인.
- 적용: 남서쪽 실제 열린 셀 두 곳에 치라미 Lv.24~25 선택 조우를 연결하고, 포장 본선 밖 치라미·스콜피 라이더 선택전과 모험 안내를 추가했다. 바깥 흙길과 중앙 포장 본선은 안전하게 유지한다.
- 경계: 치라미만 현재 지원되는 원작 일반 풀 종이므로 100% 부분 풀로 명시했다. 원작의 나머지 종·진한/흔들리는 풀·숨겨진동굴·도전자굴·결빙·아이템은 제외했다. QA는 전부 미실행이다.
- 실제 동료 계약: `unova-route-nine-journey.ts`가 현지 치라미 실제 선두와 시작 레벨을 기록하고 최종 승리·상대 격파 참가를 함께 확인한다. 공통 tracker는 파티 순서를 따라가며 PC 이동 때 슬롯을 비운다. 쌍용 서문 쉼터는 같은 건강한 객체만 귀환 완료로 인정하고 기절·PC 이동·과거 승리는 회복·재편성·무보상 재확인전으로 복구한다.
- 쇼핑몰 1층 후속: 실제 참가·서문 귀환을 마친 같은 건강한 치라미가 입고 정리대→여행용품 통행선→동행 휴게 순서로 생활 작업을 한다. 각 단계는 기존 실내 객체에 저장되며 구매·아이템·회복·보상·상층·로토무·결빙 사건은 추가하지 않았다.

<a id="record-unova-continuation-20260915-쌍용시티-11번도로-실제-동료-도착과-9번도로-출발"></a>
#### 쌍용시티 11번도로 실제 동료 도착과 9번도로 출발

- 근거: [Bulbapedia Opelucid City](https://bulbapedia.bulbagarden.net/wiki/Opelucid_City), [Serebii Pokéarth Opelucid City](https://www.serebii.net/pokearth/unova/opelucidcity.shtml), [Serebii B2W2 version areas](https://www.serebii.net/black2white2/versionarea.shtml), [B2W2 Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13), 2026-09-15 확인.
- 적용: 11번도로 선택전에 실제 참가한 같은 객체를 동문·역사관 생활 기록까지 추적한다. 기절은 센터 회복, PC 이동은 원래 동료 재편성을 안내하고 동종 대체는 인정하지 않는다. 이후 역사관 기술·문양 활동과 9번도로 외부·튜브라인브리지로 안내한다.
- 경계: 자유 통행을 유지하고 체육관·배지·플라스마 결빙·유전자쐐기·10번도로는 추가하지 않았다. 외부 코드·지도·자산은 재사용하지 않았으며 QA 중단으로 모든 실행 동작은 미검증이다.

<a id="record-unova-continuation-20260915-구름하수도-포획-동료의-공원-실전과-센터-귀환"></a>
#### 구름하수도 포획 동료의 공원 실전과 센터 귀환

- 대상 이동: 구름시티 `tour_castelia` → 구름하수도 `tour_castelia_sewers` → 숨은 공원 `tour_castelia_park` → 같은 하수도 → 구름시티 포켓몬센터 `tour_castelia_center`. 세부 좌표와 왕복 계약은 `WORLD_ROUTES.md`의 구름하수도 절을 따른다.
- 실제 확인 자료와 확인일: [Bulbapedia Castelia Sewers](https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers), [Bulbagarden 마른 상태 B2W2 지도](https://bulbapedia.bulbagarden.net/wiki/File:Castelia_Sewers_dry_B2W2.png), [Bulbapedia B2W2 Walkthrough Part 4](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_4), [Serebii Pokéarth Castelia Sewers](https://www.serebii.net/pokearth/unova/casteliasewers.shtml), 2026-09-15 확인. 버전은 Pokémon Black 2·White 2다.
- 원작 사실: 구름하수도는 구름시티 관광선착장 쪽에서 들어가 공원·뒷골목과 이어진다. 마른 바닥 걸음 조우는 꼬렛 45%, 주뱃 45%, 질퍽이 10%, Lv.14~17이다. 첫 진행에는 휴 동행과 플라스마단 전투가 있고, 계절 수위와 파도타기에 따라 접근 범위가 달라진다.
- 프로젝트 차이: 현재 프로젝트는 고정된 마른 통로와 자유 탐험을 사용한다. 휴 동행·플라스마단/아크로마 사건·전투 후 자동 회복·계절 수위·파도타기·유물의 길은 구현한 것으로 취급하지 않는다. 기존 하수도/공원 조우와 공원 선택전을 재사용해 현지 포획 동료의 시작 Lv과 전투 뒤 현재 Lv·HP를 기록하고, 같은 길로 항구 센터에 귀환하는 선택 여행으로 재구성했다.
- 적용 코드와 상태: `src/castelia-sewer-journey.ts`의 `handleCasteliaSewerJourney`가 `tourCasteliaSewerHabitat` 흔적 확인 → `tourCasteliaParkLight`의 건강한 현지 파티 동료 선택 → 기존 `tourCasteliaParkTrainer` 선택전 → `tourCasteliaParkReturn`의 결과·귀환 기록을 연결한다. `src/castelia-gallery.ts`가 기존 지역 이벤트 진입점에서 이 핸들러를 호출한다. PC 보관 동료 안내는 센터의 실제 `tourExhibit1` 이벤트로 연결했다.
- 저장 결과: `nexusCasteliaSewerHabitatInspected`, `nexusCasteliaSewerParkPartner`, `nexusCasteliaSewerParkPartnerLevel`, `nexusCasteliaSewerParkReturned`를 사용하며 기존 `trainerWon:castelia-park-practice`를 읽는다. 새 보상·통행 잠금·별도 경험치·자동 회복을 만들지 않는다.
- 검증 상태: 자료 확인과 지역 코드 연결만 반영했다. 사용자 지시에 따라 테스트·빌드·브라우저·자연 플레이·저장 재접속·시각·음향 QA는 모두 미실행이며 구름시티 완료로 판정하지 않는다.
- 재사용: 외부 코드와 자산은 복사하지 않았다. 원작의 지리·조우·진행 관계만 참고했다.

<a id="record-unova-continuation-20260915-구름-동쪽-큰길에서-4번도로로-출발"></a>
#### 구름 동쪽 큰길에서 4번도로로 출발

- 실제 확인 자료와 확인일: [Bulbapedia Unova Route 4](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_4), [Bulbapedia B2W2 Walkthrough Part 4](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_4), [Bulbapedia B2W2 Walkthrough Part 5](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_5), [Serebii Pokéarth Route 4](https://www.serebii.net/pokearth/unova/route4.shtml), 2026-09-15 확인. 버전은 Pokémon Black 2·White 2다.
- 원작 사실: 구름시티 북쪽 보행 출구는 4번도로로 이어지고, 4번도로는 북쪽 뇌문·조인애버뉴와 사막 분기를 연결한다. B2는 도로와 건물이 완공됐고 W2는 고대 유적 발견 뒤 공사가 중단되어 지형이 크게 다르다. 원작은 세 번째 배지와 아크로마·암팰리스 진행 조건도 둔다.
- 프로젝트 차이와 적용: 현재 `tour_unova_route_04`는 두 버전의 어느 한 지도를 그대로 복제하지 않은 넥서스 재구성이다. 남북 포장 본선, 동쪽 리조트데저트 선택 분기, 조인애버뉴 연결을 유지하고 원작 배지·아크로마·암팰리스 잠금은 채택하지 않는다. 구름 동쪽 큰길의 실제 조사물 `tourCasteliaRouteFourDesk`에서 건강한 선두의 Lv·HP와 현재 볼·상처약 수량을 확인해 출발을 저장하고, 4번도로 남부 `tourRouteFourWindStake`에서 같은 동료와 포장 본선/사막 분기의 모래 흔적을 구분한다. 완료 뒤 기존 넥서스 `tourRouteFourWorkSample` 또는 구름센터 귀환으로 이어진다.
- 적용 코드와 저장: `src/castelia-sewer-park.ts`가 통행로 밖 벽면에 출발 점검대를 등록한다. `src/castelia-route-four-departure.ts`의 `handleCasteliaRouteFourDeparture`가 도시 점검과 실제 도로 도착을 처리하며, `src/castelia-gallery.ts`의 기존 지역 이벤트 경로가 호출한다. `nexusCasteliaRouteFourPrepared`, `nexusCasteliaRouteFourSpecies`, `nexusCasteliaRouteFourLevel`, `nexusCasteliaRouteFourWindChecked`를 저장한다.
- 결과와 경계: 동료 편성·회복·아이템 수량은 기존 공통 구조를 읽기만 한다. 기록 없이도 4번도로 통행은 열려 있고, 새 조우·전투·보상·아이템 지급·회복·기술 효과·CH06 완료는 없다. 기존 하수도/공원 동료 루프와 구름 원본 비교 플래그를 다시 쓰지 않는다.
- 검증 상태: 개별 자료 확인 및 지역 코드 호출 반영. QA 중단에 따라 테스트·타입 검사·빌드·브라우저·보행·저장 재접속·시각·음향 검증은 모두 미실행이며 구름시티 완료로 판정하지 않는다.


<a id="record-unova-continuation-20260915-보배마을12번도로-포획성장귀환"></a>
#### 보배마을–12번도로 포획·성장·귀환

- 자료: [Bulbapedia Unova Route 12](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_12), [Serebii Pokéarth Route 12](https://www.serebii.net/pokearth/unova/route12.shtml), [Bulbapedia Lacunosa Town](https://bulbapedia.bulbagarden.net/wiki/Lacunosa_Town), BW2, 2026-09-15 확인.
- 적용: 두 선택 풀밭의 로젤리아·세꿀버리·유토브 Lv.24~25, 조우 없는 낮은 길, 프로젝트 선택 트레이너, 보배 주민의 파티·PC 귀환 반응, 모험 안내를 연결했다.
- 경계: 버전 전용종·두르보·진한/흔들리는 풀·특별 조우·아이템은 미구현이다. 외부 코드·자산은 재사용하지 않았다. QA 중단으로 구현은 미검증이다.


<a id="record-unova-continuation-20260915-빌리지브리지11번도로-여행-연결"></a>
#### 빌리지브리지–11번도로 여행 연결

- 출처: [Bulbapedia Village Bridge](https://bulbapedia.bulbagarden.net/wiki/Village_Bridge), [Serebii Pokéarth Village Bridge](https://www.serebii.net/pokearth/unova/villagebridge.shtml), [B2W2 여름 지도 기록](https://bulbapedia.bulbagarden.net/wiki/File:Village_Bridge_Summer_B2W2.png), 2026-09-15 확인.
- 적용: 12번도로 도착 동료·부상 반응, 생활관 통행/휴게, 기존 11번도로 포획·선택전, 빌리지브리지 귀환, 쌍용 재출발을 하나의 안내 흐름으로 연결했다.
- 경계: 원작 코트·식당·마을 풀숲·주민 트레이너·수상/낚시·음악 기능과 외부 자산은 적용하지 않았다. QA 중단으로 미검증이다.


<a id="record-unova-continuation-20260915-12번도로-실제-동료-선택전과-귀환"></a>
#### 12번도로 실제 동료 선택전과 귀환

- 건강한 12번도로 출신 실제 파티 객체를 선두로 묶고 시작 레벨과 상대 격파 참가를 기록한다. 과거 승리·다른 동료 승리는 귀환 완료가 아니며 PC 이동/기절은 재편성·회복·상금 없는 재확인전으로 복구한다.
- 근거: [Route 12](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_12), [B2W2 여름 지도](https://bulbapedia.bulbagarden.net/wiki/File:Unova_Route_12_Summer_B2W2.png), [B2W2 Walkthrough Part 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12), [Pokéarth](https://www.serebii.net/pokearth/unova/route12.shtml), 2026-09-15. QA 미실행.


<a id="record-unova-continuation-20260915-11번도로-실제-동료-실전과-다리-귀환"></a>
#### 11번도로 실제 동료 실전과 다리 귀환

- 건강한 11번도로 출신 마릴·딱정곤·쪼마리 실제 선두 객체와 시작 레벨을 기록하고, 그 개체의 상대 격파와 최종 승리를 함께 확인한다. 파티 순서 변경은 추적하고 PC 이동·기절·과거 승리는 재편성·회복·상금 없는 재확인전으로 복구한다.
- 근거: [Bulbapedia Route 11](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_11), [Pokéarth Route 11](https://www.serebii.net/pokearth/unova/route11.shtml), [BW2 Walkthrough Part 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12), 2026-09-15. QA 미실행.


<a id="record-unova-continuation-20260915-빌리지브리지-네-생활-리듬"></a>
#### 빌리지브리지 네 생활 리듬

- 풀피리·기타·비트박스 주민과 중앙 엔카 연습자를 실제 NPC로 배치하고 네 파트의 대사 구성을 누적한다. 11·12번도로 귀환 기록에 반응하지만 실제 음원·해금·보상·통행 조건은 없다.
- 근거: [Village Bridge](https://bulbapedia.bulbagarden.net/wiki/Village_Bridge), [Pokéarth](https://www.serebii.net/pokearth/unova/villagebridge.shtml), [B2W2 여름 지도](https://bulbapedia.bulbagarden.net/wiki/File:Village_Bridge_Summer_B2W2.png), [Walkthrough Part 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12), 2026-09-15. QA 미실행.

---

<a id="record-unova-wetland-repair-20260913"></a>
## unova-wetland-repair-20260913

원래 문서: `docs/autonomy/unova-wetland-repair-20260913.md`

<a id="record-unova-wetland-repair-20260913-하나-기존-습지-지형-보수--2026-09-13"></a>
### 하나 기존 습지 지형 보수 — 2026-09-13

범위는 기존 설화시티48×44·8번도로64×36·설화의 습지56×48이다. 크기·워프·충돌·동료 활동·조우표는 변경하지 않았다. QA 중단에 따라 테스트·빌드·브라우저·저장 검증은 실행하지 않았다.

<a id="record-unova-wetland-repair-20260913-실제-원인과-수정"></a>
#### 실제 원인과 수정

- `src/unova-route-eight.ts`: 기존 painter는 경로를 그린 뒤 사각형 물 세 개를 덮어 보행 가능 영역과 풀밭을 물처럼 보이게 했다. 이를 제거하고 실제 충돌 격자로 수면을 제한했다. 물결 좌표도 마른 순환로 밖으로 옮겼다.
- `src/unova-icirrus-moor.ts`: 반복 물 타일과 네 직사각형 수면을 제거했다. 서쪽 흙 둑길·중앙과 동쪽 목재 데크를 구별하고 서로 다른 크기의 곡선 수면·갈대·바위를 배치했다. 기존 수위/물새/북쪽 전망 이벤트에는 눈에 띄는 표식 받침을 적용했다.
- `src/icirrus-wetland-art.ts`: 두 맵의 기존 보행 격자를 읽어 마른 길/수면을 구분하는 전용 painter. 남쪽 높이띠·밝은 둑 가장자리·목재 판재가 낮은 물가와 높은 보행면을 구분한다. 자산 복제나 외부 의존성 없음.
- `src/icirrus-art.ts`: 설화 북행 석재길·동쪽 생활길과 실제 보행면 가장자리의 축대를 추가했다. 용나선 방향 북문에는 두 석재 표식을 두었다. 중앙 담당은 기존 `paintIcirrusTownDetails(c)` 호출을 `paintIcirrusTownDetails(c,map)`으로 변경해야 보행 격자 기반 표현이 적용된다. 기존 import는 그대로다. 두 도로 painter는 기존 등록을 그대로 사용한다.

<a id="record-unova-wetland-repair-20260913-원작과-프로젝트-경계"></a>
#### 원작과 프로젝트 경계

2026-09-13 [Serebii 설화시티 페이지](https://www.serebii.net/pokearth/unova/icirruscity.shtml)를 열었다. BW/BW2 버전 자료를 포함한 장소 페이지이나 이번에는 원작 전체 맵 이미지/타일을 정밀 대조하지 않았다. 8번도로 요청 URL은 도구에서 열리지 않았다. 따라서 이번 곡선 수면, 목재 데크, 축대, 두 북문 석재 표식은 기존 프로젝트의 습지 도시 구성을 보수한 창작 표현이며 BW2 원작 타일 배치 재현으로 주장하지 않는다. 계절별 결빙·수상이동·새 사건은 구현하지 않았다.

<a id="record-unova-wetland-repair-20260913-남은-한계"></a>
#### 남은 한계

소스 구현만 반영했다. 도시 호출의 map 인자는 중앙 통합 대상이다. 실제 화면의 건물/가구 겹침, 각 출구 시야, 움직임 수용은 미검증이다. 기존 맵의 넓은 보행 격자 자체와 도시 공통 건물 배치는 이번 보수 범위에서 유지했다. 기존 쇼핑몰 공개층의 완성도나 본편 진행은 이번 변경의 완료 근거가 아니다.

