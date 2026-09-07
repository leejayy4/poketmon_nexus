# 직접 구현 서브작업 B — 길·상점·주택·다층 실내

2026-09-07. 사용자 직접 병렬 위임에 따라 공유 폴더에서 구현했다. engine / renderer / maps / unified-world / types / town / 개발 도구 패널은 부모 소유이며 이 서브작업에서 수정하지 않았다. DEVELOPMENT.md·STORY.md·WORLD_TOUR.md의 종합 갱신과 전체 브라우저 검증은 부모 통합에서 수행한다.

## 구현

- 기존 43개 장소 사이의 같은 지방 도시 직접 연결 33곳을 32×20 도로·암반굴·해안길로 교체했다. 양쪽 도시의 출구와 귀환 스폰 좌표는 유지한다. 숲·천관산·연구 통로·지방 연결은 보존한다.
- 모든 통로에 세 칸 폭의 본선, 북쪽 샛길 공터·상처약 조사 칸·여행자·양쪽 이정표·선택 가능한 풀밭이 있다. 풀밭을 막아도 두 출구 사이의 길은 열린다.
- 주요 마을 35곳 전부에 프렌들리숍과 주민의 집이 있다. 기존 체육관으로 쓰는 첫 주택은 보존한다. 추가로 호수·유적 마당의 기존 집도 개방했다.
- 상점 38곳 및 기존 백화점 판매층 2곳이 `martClerk`를 사용한다. 상점 계산대 모든 앞 칸에서 점원과 상호작용할 수 있다. 몬스터볼·상처약 표시 가격은 기존 DB의 각 200원이다.
- 대표 시설 15곳과 도시형 공동주택 41곳은 각각 3층이다. 방송 제작실·연구실·등대 관측실·수련층·독서실·공동 정원·휴게실의 가구와 용도를 구분했다. 상점은 파란 지붕의 단층 외형으로 그린다.
- 계단 좌표는 위로 `(12,7)`, 아래로 `(12,10)`이며, 도착 칸은 각각 `(12,9)` / `(12,8)`이다. 상층에 야외로 직접 나가는 문이나 가짜 현관 매트를 남기지 않는다.
- 38개 센터의 두 번째 사물은 기존 `tourExhibit1` ID를 유지한 `포켓몬 보관 PC`다. 실제 보관·인출·도감 동작은 부모의 journey-services가 처리한다.
- 통로의 가상 Place는 고유 통로 ID를 사용한다. 통로에 있다는 이유로 어느 도시에도 도착/방문 판정을 하지 않는다. 실내·층은 소속 도시로 묶으며 실제 방문하지 않은 층의 기록을 만들지 않는다.
- 통로 표지의 긴 이름은 방향 다음 줄에 표시한다. 미니맵에서 새 상점·주택·계단의 실제 워프 좌표를 표시한다.

현재 이 서브작업 완료 시점 수량: 탐방 맵 379 = 기존 야외 43 + 통로 33 + 실내 303. 통합 ACTIVE_MAPS는 391. 3층 건물 56, 상점으로 분류한 방 40, 주거용 방 159. DB 전체나 모든 마을 이야기를 구현한 수량은 아니다.

## 수정 파일

- src/journey-world.ts — 부모 초기 scaffold 확장·접근성·층 부모·통로 메타데이터.
- src/journey-art.ts (신규) — 통로 지면·DS 나무/지붕 샘플·동굴 벽·물가·상점·실내 계단·수집물.
- src/explore-art.ts — 모든 신규 배경과 상점 외형 연결.
- src/explore-world.ts — 실제 출구 표지와 통로 Place/부모 조회.
- src/explore-interiors.ts — 센터 PC 이름·설명, event 보존.
- src/explore-journal.ts — 실내/통로 구분, 실제 전체 수량 반환.
- src/explore-minimap.ts — 층 계단 마커.
- tests/journey-world.test.ts (신규).
- 관련 회귀 최소 갱신: explore-interiors / explore-journal / explore-minimap / explore-outdoors / explore-navigation / explore-layouts / facility-navigation / unified-world 테스트.

## 부모 연결 API

```ts
paintJourneyOverlay(c, images, map, flags, clock = 0)
```

월드 좌표에서 depth layers 이후, UI 이전 호출한다. `pickup:<mapId>` 플래그가 참이면 아이템을 그리지 않는다. 상점 간판도 여기에서 그린다. 계단/층 표시는 이미 `buildExploreArt`의 배경에 포함되어 있으며 별도 중복 호출하지 않는다. 이 API는 저장을 변경하지 않는다.

`journeyConnection(map, destination)`은 직접 워프 또는 그 목적지를 잇는 통로 워프를 반환한다. `FLOOR_PARENTS`는 바로 아래층, `ROOM_PARENTS`는 소속 도시, `FLOOR_INFO`는 층수와 전체 층수를 제공한다. `tourVisitSummary`는 기존 집계 외에 `passages`, `passageTotal`, `interiorTotal`을 반환한다.

부모와 확인한 통합: journey-services의 판매/PC/픽업 이벤트, renderer overlay 호출, explore-panel 직접 워프 조회 수정, town 개정 23. 서브작업이 해당 파일을 재수정하지 않았다.

## 검증

```powershell
node_modules/.bin/tsx.cmd --test tests/journey-world.test.ts tests/explore-world.test.ts tests/explore-interiors.test.ts tests/explore-journal.test.ts tests/explore-minimap.test.ts tests/explore-outdoors.test.ts tests/explore-navigation.test.ts tests/facility-navigation.test.ts tests/unified-world.test.ts tests/explore-layouts.test.ts tests/explore-centers.test.ts
npm.cmd run build
```

- 위 지도·층·상점·저장·센터·길안내 회귀 54/54 통과.
- 모든 실내 문과 계단을 실제 Engine 입력으로 통과하고 저장·재방문 가능 여부를 검사했다. 모든 시설·층으로 걸어가는 길안내 검사는 움직이는 마을 포켓몬을 고려해 매 걸음 현재 경로를 다시 읽는다.
- 신규 아트의 Canvas 호출 검사는 모든 신규 배경 생성·논리 크기·층수 표시·수집 후 그림 제거를 확인했다. 브라우저의 실제 픽셀·조작 검증을 대신하지 않는다.
- TypeScript / Vite build 통과.
- 병렬 통합 중 전체 테스트 스냅샷은 348개 중 299 통과·49 실패였다 (`tests/journey-B-test-output.txt`). 그 중 B 담당의 explore-layouts 1건은 실제 building.room 기준으로 수정하고 위 54개 묶음에서 재검증했다. 전투 수치/포획/주민 의뢰 기대값 등의 나머지 실패는 부모·다른 담당 통합에서 처리한다. 전체 테스트 최종 통과 주장은 하지 않는다.

## 남은 부모 확인

- 전체 브라우저/실제 화면 검증은 부모가 수행한다. 이 서브작업은 실제 브라우저 시각 검증 완료를 주장하지 않는다.
- 아이템 그림 제거에 맞춰 `getMap`은 `pickup:<mapId>`가 참인 경우 `journeyItem` 칸의 충돌도 열어야 한다. 부모에게 전달했으며 B 소유 범위 밖인 maps.ts를 직접 수정하지 않았다. 완료 시점의 maps.ts에는 아직 해당 분기가 보이지 않았다.
- 센터 PC·판매 기능은 기존 전시 대사를 열던 테스트 계약에서 실제 메뉴 계약으로 변경되어 해당 회귀를 갱신했다. 주민 의뢰로 바뀐 explore-residents 기대값은 부모가 수정하기로 했다.
