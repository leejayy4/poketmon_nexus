# 구름 항구·하수도·숨은 공원 적용 — 2026-09-13

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
- 중앙 요청: explore-world installer, explore-art 바탕 painter, 지방지도, runtime-encounters node `U-CASTELIA-SEWERS`/`U-CASTELIA-PARK-W2`. 중앙 데이터 담당은 풀/자산/MapId 바인딩 준비를 회신했다. 실제 설치/그림 연결 완료는 후속 기록으로 구분한다.
- 크기 단일 기준: [MAP_SIZE_STANDARDS](../MAP_SIZE_STANDARDS.md)의48×28/32×40 행. 연결 책임은 [WORLD_ROUTES](../WORLD_ROUTES.md), 사건 범위는 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md), 출처 색인은 [REFERENCE_RESEARCH](../REFERENCE_RESEARCH.md)로 인계한다.
- 검증: 사용자 QA 중단으로 테스트·빌드·실행·화면·저장 검증 전부 미실행. 도시 완료·CH06 완료가 아니다. 다음은 중앙 소비 연결 반영과 실제 미검증 상태 유지, 이후 사용자 QA 재개 때 왕복/조우/포획/성장/회복 검증이다.
