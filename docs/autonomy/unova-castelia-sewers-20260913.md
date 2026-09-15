# 구름 항구·하수도·숨은 공원 적용 — 2026-09-13

## 2026-09-15 · 하수도 포획 동료의 공원 실전·귀환 묶음

- 확인일 2026-09-15, 기본 대조 **Pokémon Black 2·White 2**. [Bulbapedia 구름하수도](https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers)의 `In the games`·조우표와 [마른 상태 원작 지도](https://bulbapedia.bulbagarden.net/wiki/File:Castelia_Sewers_dry_B2W2.png), [구름시티의 Castelia Park](https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park), [BW2 Walkthrough Part 4](https://bulbapedia.bulbagarden.net/wiki/Appendix:Black_2_and_White_2_walkthrough/Section_4), [Serebii Pokéarth 구름하수도](https://www.serebii.net/pokearth/unova/casteliasewers.shtml)를 실제로 읽었다. 원작은 Thumb Pier 진입, 휴이 최초 동행, 플라스마단·아크로마 사건, 유적통로, 계절별 건조/침수, 공원·뒷골목 출구를 가진다. 걷기 조우는 꼬렛45%·주뱃45%·질퍽이10%, Lv.14~17이고 공원은 건물 사이 중앙 나무와 양쪽 풀밭 구조다.
- 프로젝트는 기존 `tour_castelia` `(59,48)` → `tour_castelia_sewers` → `tour_castelia_park`의 **고정 마른 축약 왕복**을 보존한다. 원작 지도 이미지를 복사하지 않았고 계절·파도타기·휴이 동행·플라스마단/아크로마·유적통로·뒷골목·아이템 배치는 추가하지 않았다. 기존 공원 선택 트레이너도 원작 NPC 재현이 아닌 넥서스 자유 실전이다.
- `src/castelia-sewer-journey.ts`의 `handleCasteliaSewerJourney`가 기존 조사물과 실제 저장을 연결한다. `tourCasteliaSewerHabitat`에서 흔적 확인 → `tourCasteliaParkLight`에서 `met`가 `구름하수도` 또는 `구름시티 공원`인 **건강한 실제 파티 동료** 선택·선두 편성 → 기존 `tourCasteliaParkTrainer` 선택전 → `tourCasteliaParkReturn`에서 승리 플래그와 같은 실제 동료의 현재 Lv/HP를 확인하고 하수도 본선·항구 센터 귀환을 기록한다. `src/castelia-gallery.ts`가 이 하나 전용 핸들러를 기존 여행 이벤트 경로에서 소비한다.
- 신규 상태는 `nexusCasteliaSewerHabitatInspected`, `nexusCasteliaSewerParkPartner`, `nexusCasteliaSewerParkPartnerLevel`, `nexusCasteliaSewerParkReturned`다. 포획은 기존 야생전, 성장·피해는 기존 전투, 편성·회복은 기존 파티/센터 계약만 사용한다. 선택전 승리 `trainerWon:castelia-park-practice`를 읽되 재보상하지 않는다. 포획·배틀·기록을 거절해도 하수도·공원·항구 왕복은 열린다.
- 이 기록은 구름의 자유 탐험 한 묶음이며 CH06, 원작 하수도 사건, 플라스마단 격퇴, 구름 체육관, 도시 전체 완료를 뜻하지 않는다. 사용자 QA 중단에 따라 테스트·빌드·브라우저 플레이·화면·음향·실제 포획/성장/저장·재로드 검증은 모두 미실행이다.

## 근거와 범위

- 확인일 2026-09-13, BW2: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers — 항구 입구, 공원 출구, 계절별 건조/침수와 최초 동행 조건. 프로젝트는 건조 통로와 공원 왕복만 채택한다. 휴이 동행·아크로마/플라스마단 사건·유적통로·침수 골목 출구·파도타기·계절 해금은 구현하지 않는다.
- BW2: https://www.serebii.net/pokearth/unova/casteliasewers.shtml — 같은 연결과 보행 조우 꼬렛45/주뱃45/질퍽이10 대조. 부두 영문명은 Bulbapedia Thumb Pier/Serebii Sightseeing Pier로 서로 달라 프로젝트 표시는 고유 부두명 대신 구름시티 항구로 한정한다. 질퍽이는 Bulbapedia15 또는17, Serebii15~17 표기이며 현재 공통 풀 범위14~17은 프로젝트 차이다.
- W2 일반풀: https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park — 꼬렛30%, 이브이5%, 에나비15%, 콩둘기15%, 치릴리35%. B2의 이어롤/소미안과 구분한다. 원작 우측 진한풀·더블배틀은 채택하지 않으며 양쪽 모두 일반풀 단일 조우다.
- 개별 페이지의 텍스트/조우표를 읽었다. 원작 지도 이미지의 타일 대조는 미완료이며 아래 좌표와 크기는 프로젝트 축약 배치다. 외부 코드·이미지 자산을 복사하지 않았다.

## 실제 연결 계약

| 출발 MapId/출구 | 도착 MapId/안전 도착 | 방향·귀환 |
| --- | --- | --- |
| `tour_castelia` (59,48) | `tour_castelia_sewers` (44,24) | 동쪽 계단으로 진입. 도시 귀환은 (58,48) |
| `tour_castelia_sewers` (46,24) | `tour_castelia` (58,48) | 동쪽 계단으로 항구 귀환 |
| `tour_castelia_sewers` (6,2) | `tour_castelia_park` (16,36) | 서쪽 통로 끝 북쪽 계단 |
| `tour_castelia_park` (16,38) | `tour_castelia_sewers` (6,3) | 남쪽 계단. 하수도 남쪽 본선→동쪽 항구 |

도로 번호가 붙은 도시 간 구간이 아닌 도시 내부 고유명 **구름하수도**다. 별도 ‘몇번동굴’을 원작 번호처럼 붙이지 않는다. 기존 북쪽 지상 정원(U01-GARDEN), 도시72×64, 선박·4번도로·스카이애로 기존 연결을 보존한다.

## 소비 위치와 상태

- `src/castelia-sewer-park.ts`: 두 맵 설치, 충돌과 같은 바닥 그림, 계단/표지, 하수도 선택 조우실(19,11,5,5), 공원 일반풀(4,10,8,8)/(22,19,6,7). 본선은 조우 영역을 피할 수 있다. 기존 공통 야외 조사물 대사를 사용하며 독자 저장 구조 없음.
- `src/explore-castelia.ts`: 기존 도시 painter에서 실제 입구 타일이 열렸을 때 계단 그림 소비.
- 중앙 연결 반영: `explore-world.ts`의 installer와 `explore-art.ts` 첫 바탕 분기에서 전용 painter를 소비한다. `runtime-encounters.ts`는 node `U-CASTELIA-SEWERS`/`U-CASTELIA-PARK-W2`를 사용한다. 중앙 데이터 담당은 W2 공원 전체5종과 자산 반영을 회신했다. `region-atlas.ts`에는 하수도(156,164)/공원(156,144) 표시 좌표가 추가됐다. 소스 반영 근거이며 화면 검증이 아니다.
- 표지 대사는 `engine.ts` event의 `getWorldOutdoors(...).objects.find(...)`를 통해 실제 소비한다. 공원 외곽은 보행 불가 셀의 빌딩 뒷벽/남쪽 담장, 중앙 상징나무는 막힌 섬 x10..12/y20..24 안에 그린다.
- 중앙 회신: `explore-journal`의 journalPlaces와 panelPlaces/방문집계가 두 장소를 소비하고 패널 연결선은 실제 warp도 읽는다. 따라서 표시 계약도 항구→하수도→공원이다. 실행 확인은 하지 않았다.
- 크기 단일 기준: [MAP_SIZE_STANDARDS](../MAP_SIZE_STANDARDS.md)의48×28/32×40 행. 연결 책임은 [WORLD_ROUTES](../WORLD_ROUTES.md), 사건 범위는 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md), 출처 색인은 [REFERENCE_RESEARCH](../REFERENCE_RESEARCH.md)로 인계한다.
- 검증: 사용자 QA 중단으로 테스트·빌드·실행·화면·저장 검증 전부 미실행. 도시 완료·CH06 완료가 아니다. 다음은 중앙 소비 연결 반영과 실제 미검증 상태 유지, 이후 사용자 QA 재개 때 왕복/조우/포획/성장/회복 검증이다.


### 중앙 배수홈 시각 보수
2026-09-13, BW2: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers 의 In the games를 다시 확인했다. 원작은 계절에 따라 건조/침수 상태가 바뀐다. 프로젝트는 고정 마른 재구성으로, `castelia-sewer-park.ts` painter에서 기존 막힌 x4/y4..26 및 y26/x4..45에 낮은 배수홈, 곁방 동쪽에 유입구 쇠창살을 그린다. 원작 지도 좌표 재현이나 계절/파도타기 구현이 아니다. 보행·조우·워프 변경 없음. 기존 buildExploreArt 소비 유지, 화면 QA 미실행.
