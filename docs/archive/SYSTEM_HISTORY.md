# 공통 시스템·초기 구현 검증 기록

> **과거 기록.** 파일별로 흩어진 구현·실패·검증 근거를 통합했다. 당시의 최신·다음 작업·배정·QA 재개는 현재 지시가 아니다. 현재 기준은 [문서 안내](../README.md)와 [현재 상태](../PROJECT_STATE.md)를 따른다.

## 기록 목록

- [central-qa-20260912](#record-central-qa-20260912)
- [continue-20260909-cap-training](#record-continue-20260909-cap-training)
- [direct-journey-B](#record-direct-journey-b)
- [lead-0026](#record-lead-0026)
- [nexus-implementation-review-20260920](#record-nexus-implementation-review-20260920)
- [qa-resumed-20260912](#record-qa-resumed-20260912)
- [regional-continuation-20260913](#record-regional-continuation-20260913)
- [regional-map-repair-20260913](#record-regional-map-repair-20260913)
- [REGION_ATLAS](#record-region_atlas)
- [auto-0001-story](#record-auto-0001-story)
- [auto-0002-core](#record-auto-0002-core)
- [auto-0003-map](#record-auto-0003-map)
- [auto-0004-art](#record-auto-0004-art)
- [auto-0005-art](#record-auto-0005-art)
- [auto-0007-core](#record-auto-0007-core)
- [auto-0008-art](#record-auto-0008-art)
- [auto-0009-art](#record-auto-0009-art)
- [auto-0010-core](#record-auto-0010-core)
- [auto-0011-art](#record-auto-0011-art)
- [auto-0012-story](#record-auto-0012-story)
- [auto-0013-map](#record-auto-0013-map)
- [auto-0014-core](#record-auto-0014-core)
- [bootstrap-qa-20260907](#record-bootstrap-qa-20260907)
- [direct-20260907-art-01](#record-direct-20260907-art-01)
- [direct-20260907-art-02](#record-direct-20260907-art-02)
- [direct-20260907-art-03](#record-direct-20260907-art-03)
- [lead-0001](#record-lead-0001)
- [lead-0002](#record-lead-0002)
- [lead-0003](#record-lead-0003)
- [lead-0004](#record-lead-0004)
- [lead-0005](#record-lead-0005)
- [lead-0006](#record-lead-0006)
- [lead-0007](#record-lead-0007)
- [lead-0008](#record-lead-0008)
- [lead-0009](#record-lead-0009)
- [lead-0010](#record-lead-0010)
- [lead-0011](#record-lead-0011)
- [lead-0012](#record-lead-0012)
- [lead-0013](#record-lead-0013)
- [lead-0014](#record-lead-0014)
- [lead-0015](#record-lead-0015)
- [lead-0016](#record-lead-0016)
- [lead-0017](#record-lead-0017)
- [lead-0018](#record-lead-0018)
- [lead-0019](#record-lead-0019)
- [lead-0020](#record-lead-0020)
- [lead-0021](#record-lead-0021)
- [lead-0022](#record-lead-0022)
- [lead-0023](#record-lead-0023)
- [lead-0024](#record-lead-0024)
- [lead-0025](#record-lead-0025)
- [user-20260907-core-battle-turn](#record-user-20260907-core-battle-turn)
- [user-20260907-core-controls](#record-user-20260907-core-controls)
- [user-20260907-core-party-summary](#record-user-20260907-core-party-summary)
- [user-20260907-map-feel](#record-user-20260907-map-feel)

---

<a id="record-central-qa-20260912"></a>
## central-qa-20260912

원래 문서: `docs/autonomy/central-qa-20260912.md`

<a id="record-central-qa-20260912-중앙-일회성-점검--2026-09-12"></a>
### 중앙 일회성 점검 — 2026-09-12

사용자의 간헐적 중앙 QA 요청은 전면 재개가 아니다. 중앙에서 요청 범위만 점검하며 지방별 자동 QA 중단을 유지한다.

이번에 전체 재개로 잘못 해석해 빌드와 전체 테스트를 시작했다. 사용자 정정 후 테스트를 중단했다. 브라우저 플레이 및 사용자 저장 조작은 수행하지 않았다.

- 빌드 실패: FLOOR_PARENTS 미정의, mon.moves 선택값 처리, purchaseQuantityLimit9 오타, 신오 연결 MapId 타입 불일치, 하나 11번도로 중복 속성.
- 중단 전 테스트 로그: `Missing tour interior: tour_lentimas`로 지도 초기화 실패. 전체 테스트 결과로 집계하지 않는다.
- 위 문제는 아직 수정하지 않았다. 검은 화면의 실제 브라우저 예외는 미확인이다. 다음 중앙 점검은 초기화 오류 해결과 해당 화면 복구 확인부터 한정한다.

<a id="record-central-qa-20260912-후속-중앙-시작-화면-점검"></a>
#### 후속 중앙 시작 화면 점검

사용자가 검은 화면 수리와 간단한 QA를 다시 요청하여 초기화 및 기본 입력만 점검했다. 위 미수정 기록은 최초 점검 시점의 이력이다.

- 브라우저에서 `Missing tour interior: tour_lentimas`를 직접 재현했다. 전용 실내 설치 전에 필요한 산로·물결·보배·빌리지브리지·설화 기본 실내 정의를 등록했다.
- 선단시티와 통합 호수의 출구 표지를 지형과 겹치지 않는 위치로 옮겼다.
- 216번도로 가로 구간의 세로 가지 길이가 행 범위를 넘던 오류를 수정했다. 해당 생성기의 도착 MapId 타입도 명시했다.
- 218번도로 장소 정보를 등록하고, 별도 마을 건물 목록이 없는 독립 맵도 실제 보행 격자와 존재하는 지형 자료로 그리도록 수정했다.
- 공통 상점의 `purchaseQuantityLimit9` 오타를 `inventoryCapacity`로 고쳤다. 구매 실행은 이번에 점검하지 않았다.
- 좁은 확인: maps 모듈 초기화 성공, ACTIVE_MAPS 566개. 전체 맵 플레이 통과를 의미하지 않는다.
- 브라우저 `?qa=central-startup-20260912`: 우리 집 2층 및 하단 화면 표시를 스크린샷으로 확인했다. 오른쪽 이동 1걸음(x=7,y=6), 메뉴 열기와 닫기(panel=menu/field)를 DOM 상태로 확인했다. 복구 후 새 오류는 조회 로그에 나타나지 않았으며 이전 오류 로그는 남아 있었다.
- 지도 키 추가 확인은 브라우저 제어 시간 초과로 미확인. 전체 테스트·빌드·지방 순회·소리·저장 검증은 수행하지 않았다. 사용자 실제 저장은 건드리지 않았다.
- 이전 빌드의 다른 타입 오류는 이번 시작 화면 수리 범위 밖이며 빌드 통과로 보고하지 않는다. 상시 QA 중단과 중앙 요청 시 일회성 점검 규칙은 유지한다.

---

<a id="record-continue-20260909-cap-training"></a>
## continue-20260909-cap-training

원래 문서: `docs/autonomy/continue-20260909-cap-training.md`

<a id="record-continue-20260909-cap-training-작업-이어받기--2026-09-09--상한-동료와-교대-육성"></a>
### 작업 이어받기 — 2026-09-09 / 상한 동료와 교대 육성

<a id="record-continue-20260909-cap-training-현재-목표"></a>
#### 현재 목표
DS DP/플라티나풍을 유지하면서 여행·포획·육성·전투·도시·체육관을 연결한다. 이번에는 관동에서 잡은 Lv25 동료와 기존 낮은 레벨 파티의 교대 육성 경험치 손실을 개선했다.

<a id="record-continue-20260909-cap-training-이번-회차에서-완료한-변경"></a>
#### 이번 회차에서 완료한 변경
- 기존에는 상한 동료 몫을 소멸시키던 명시적 규칙이었다. 버그로 분류하지 않고 성장 가능한 생존 참가자끼리 총량을 분배하도록 개선했다.
- 전투 화면도 동일 함수로 실제 경험치 수혜자 수를 표시한다. 기존 DS 성장 카드의 수혜자 그림·파티번호·EXP 바와 출전 동료 전투장을 유지했다.
- 기절·미참여·중복 참가 제외, 전원 상한 정상 승리, 상대별 참여 초기화, 보상 중복 방지와 저장 복원을 검사했다.

<a id="record-continue-20260909-cap-training-수정한-파일"></a>
#### 수정한 파일
- src/battle.ts, src/renderer.ts
- tests/capped-training.test.ts, tests/capped-training-save.json, tests/capped-training-test-output.txt
- docs/DEVELOPMENT.md (38절 규칙과 이번 증거), docs/GAMEPLAY.md, docs/CONTINUE_STATE.md
- 시작 때 이미 수정 상태였던 DEVELOPMENT.md·STORY.md·PROJECT_STATE.md와 미추적 autonomy/lead-0026.md를 보존했다. STORY/PROJECT_STATE/lead-0026은 이번에 수정하지 않았다.

<a id="record-continue-20260909-cap-training-자동-테스트빌드-결과"></a>
#### 자동 테스트·빌드 결과
- 관련 21/21, 전체 587/587 통과, npm.cmd run build 통과.
- 최초 신규 저장 테스트 1건은 준비 데이터에 스타터/출발 조건이 없어 parseSave가 거부했다. 유효한 준비 데이터로 수정한 뒤 재검사 통과. 검사를 삭제하지 않았다.

<a id="record-continue-20260909-cap-training-직접-플레이-결과와-사용한-qa-식별자"></a>
#### 직접 플레이 결과와 사용한 QA 식별자
- `?qa=continue-20260909-cap-training` / tests/capped-training-save.json을 기존 파일 가져오기 UI로 불러온 **준비 저장 검증**이다.
- 서쪽길 실제 풀밭 걸음→꼬링크 Lv3 HP21 조우→꼬부기5(XP40)에서 꼬렛25 교대→꼬렛 반격7→행동 화면 수혜자1 확인→필살앞니21로 승리.
- 아래 성장 카드에 꼬부기/파티1/EXP +30, 위 화면에 꼬렛25가 남는 것을 직접 확인했다. 꼬부기는 Lv6 XP20 HP23/23, 꼬렛은 Lv25 XP0 HP79/86.
- 빠른 저장·재접속 후 위 수치와 기술 보존, 최종 경고/오류 로그0. 재로드 직후 상태 속성 미생성으로 관찰 코드가 한 번 실패했으나 로딩 완료 후 정상 조회했다. 게임 오류가 아니다.
- 사용자 실제 저장과 이전 자연 QA 저장은 열거나 수정하지 않았다. 새 게임부터 자연 성장한 결과가 아니다.

<a id="record-continue-20260909-cap-training-미검증실패사용자-결정-필요-항목"></a>
#### 미검증·실패·사용자 결정 필요 항목
- 관동 자연 파티 해안길 전투 부담, 회색 방향 여행, 첫 배지 반복 육성 부담은 미완료.
- 전원 상한·연전 경계는 자동 검사만 수행했다. 브라우저에서는 상한+성장 대상 교대 야생전을 확인했다.
- 이번 변경에 별도 사용자 결정 필요 없음. 새 스토리/지역/의존성/배포 추가 없음.

<a id="record-continue-20260909-cap-training-진행-중인-작업과-정확한-재개-위치"></a>
#### 진행 중인 작업과 정확한 재개 위치
- 이번 구현·검증 완료. 읽기 전용 Core/Story·Map/Art 검토 담당은 모두 종료했고 쓰기 작업은 이 대화에서만 수행했다.
- 준비 QA는 서쪽길 풀밭, 위 파티 저장 상태. 이 파일을 자연 진행으로 취급하지 않는다.
- 기존 자연 진행은 PROJECT_STATE.md의 `?qa=lead-0018-natural-bulbasaur`, 블루(8,9), 요가랑19·꼬마돌17·이상해씨13·비버니4·포니타18·꼬렛25, 6060원/볼1/약10 인계다. 이번에는 해당 저장을 조회하지 않았으므로 위치·수치는 이전 회차 기록이다. 시작 시 실상태를 먼저 확인한다.
- PROJECT_STATE는 기존 총괄 전용 파일이므로 변경하지 않았다. 시작 때 배정 없음/쓰기 잠금 없음 확인. 새 회차에도 배정과 git 상태를 재확인한다.

<a id="record-continue-20260909-cap-training-다음-작업-하나와-완료-조건"></a>
#### 다음 작업 하나와 완료 조건
관동 자연 파티의 블루→회색박물관 여행을 이어가며 해안길 육성·전투 부담을 점검한다.
1. 이전 자연 저장의 실상태와 기존 배정을 확인한다. 새 격리 저장으로 복사해 검사한다면 준비/복사 이력을 명시한다.
2. 실제 길로 이동하고 기존 시설·보급·전투를 연결해 수행한다. 기존 목표 회색박물관 방문과 상호작용을 확인한다.
3. 레벨 차이·교대 생존·전투 횟수와 소비량을 기록하고 확인된 가장 큰 문제 하나만 수정·자동 검사·직접 재확인한다.

<a id="record-continue-20260909-cap-training-이후-대기-작업-최대-5개"></a>
#### 이후 대기 작업 (최대 5개)
- 첫 배지 반복 육성 부담과 세 스타팅 수용 경계 정리.
- 다른 시작 파티의 영원체육관 자연 난이도.
- 기존 관동 통로의 야생 조우 연결 우선순위 검토.
- 원인 미확인인 과거 자연 저장 위치 불일치가 재현되면 저장·복원 문제 우선 추적.

---

<a id="record-direct-journey-b"></a>
## direct-journey-B

원래 문서: `docs/autonomy/direct-journey-B.md`

<a id="record-direct-journey-b-직접-구현-서브작업-b--길상점주택다층-실내"></a>
### 직접 구현 서브작업 B — 길·상점·주택·다층 실내

2026-09-07. 사용자 직접 병렬 위임에 따라 공유 폴더에서 구현했다. engine / renderer / maps / unified-world / types / town / 개발 도구 패널은 부모 소유이며 이 서브작업에서 수정하지 않았다. DEVELOPMENT.md·STORY.md·WORLD_TOUR.md의 종합 갱신과 전체 브라우저 검증은 부모 통합에서 수행한다.

<a id="record-direct-journey-b-구현"></a>
#### 구현

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

<a id="record-direct-journey-b-수정-파일"></a>
#### 수정 파일

- src/journey-world.ts — 부모 초기 scaffold 확장·접근성·층 부모·통로 메타데이터.
- src/journey-art.ts (신규) — 통로 지면·DS 나무/지붕 샘플·동굴 벽·물가·상점·실내 계단·수집물.
- src/explore-art.ts — 모든 신규 배경과 상점 외형 연결.
- src/explore-world.ts — 실제 출구 표지와 통로 Place/부모 조회.
- src/explore-interiors.ts — 센터 PC 이름·설명, event 보존.
- src/explore-journal.ts — 실내/통로 구분, 실제 전체 수량 반환.
- src/explore-minimap.ts — 층 계단 마커.
- tests/journey-world.test.ts (신규).
- 관련 회귀 최소 갱신: explore-interiors / explore-journal / explore-minimap / explore-outdoors / explore-navigation / explore-layouts / facility-navigation / unified-world 테스트.

<a id="record-direct-journey-b-부모-연결-api"></a>
#### 부모 연결 API

```ts
paintJourneyOverlay(c, images, map, flags, clock = 0)
```

월드 좌표에서 depth layers 이후, UI 이전 호출한다. `pickup:<mapId>` 플래그가 참이면 아이템을 그리지 않는다. 상점 간판도 여기에서 그린다. 계단/층 표시는 이미 `buildExploreArt`의 배경에 포함되어 있으며 별도 중복 호출하지 않는다. 이 API는 저장을 변경하지 않는다.

`journeyConnection(map, destination)`은 직접 워프 또는 그 목적지를 잇는 통로 워프를 반환한다. `FLOOR_PARENTS`는 바로 아래층, `ROOM_PARENTS`는 소속 도시, `FLOOR_INFO`는 층수와 전체 층수를 제공한다. `tourVisitSummary`는 기존 집계 외에 `passages`, `passageTotal`, `interiorTotal`을 반환한다.

부모와 확인한 통합: journey-services의 판매/PC/픽업 이벤트, renderer overlay 호출, explore-panel 직접 워프 조회 수정, town 개정 23. 서브작업이 해당 파일을 재수정하지 않았다.

<a id="record-direct-journey-b-검증"></a>
#### 검증

```powershell
node_modules/.bin/tsx.cmd --test tests/journey-world.test.ts tests/explore-world.test.ts tests/explore-interiors.test.ts tests/explore-journal.test.ts tests/explore-minimap.test.ts tests/explore-outdoors.test.ts tests/explore-navigation.test.ts tests/facility-navigation.test.ts tests/unified-world.test.ts tests/explore-layouts.test.ts tests/explore-centers.test.ts
npm.cmd run build
```

- 위 지도·층·상점·저장·센터·길안내 회귀 54/54 통과.
- 모든 실내 문과 계단을 실제 Engine 입력으로 통과하고 저장·재방문 가능 여부를 검사했다. 모든 시설·층으로 걸어가는 길안내 검사는 움직이는 마을 포켓몬을 고려해 매 걸음 현재 경로를 다시 읽는다.
- 신규 아트의 Canvas 호출 검사는 모든 신규 배경 생성·논리 크기·층수 표시·수집 후 그림 제거를 확인했다. 브라우저의 실제 픽셀·조작 검증을 대신하지 않는다.
- TypeScript / Vite build 통과.
- 병렬 통합 중 전체 테스트 스냅샷은 348개 중 299 통과·49 실패였다 (`tests/journey-B-test-output.txt`). 그 중 B 담당의 explore-layouts 1건은 실제 building.room 기준으로 수정하고 위 54개 묶음에서 재검증했다. 전투 수치/포획/주민 의뢰 기대값 등의 나머지 실패는 부모·다른 담당 통합에서 처리한다. 전체 테스트 최종 통과 주장은 하지 않는다.

<a id="record-direct-journey-b-남은-부모-확인"></a>
#### 남은 부모 확인

- 전체 브라우저/실제 화면 검증은 부모가 수행한다. 이 서브작업은 실제 브라우저 시각 검증 완료를 주장하지 않는다.
- 아이템 그림 제거에 맞춰 `getMap`은 `pickup:<mapId>`가 참인 경우 `journeyItem` 칸의 충돌도 열어야 한다. 부모에게 전달했으며 B 소유 범위 밖인 maps.ts를 직접 수정하지 않았다. 완료 시점의 maps.ts에는 아직 해당 분기가 보이지 않았다.
- 센터 PC·판매 기능은 기존 전시 대사를 열던 테스트 계약에서 실제 메뉴 계약으로 변경되어 해당 회귀를 갱신했다. 주민 의뢰로 바뀐 explore-residents 기대값은 부모가 수정하기로 했다.

---

<a id="record-lead-0026"></a>
## lead-0026

원래 문서: `docs/autonomy/lead-0026.md`

<a id="record-lead-0026-lead-0026--갈색블루-야생-만남"></a>
### lead-0026 — 갈색–블루 야생 만남

2026-09-09 완료. 네 역할 읽기 검토 후 Core 구현, Lead 실제 검증.

<a id="record-lead-0026-변경"></a>
#### 변경

- 기존 ENC-039 6종과 가중치를 해안길 한 곳에 연결. 원안22~27을 보존하고 런타임22~25로 제한.
- 추출기·런타임 데이터·앞뒤 이미지12개·출처/해시 명세 추가. 기존 자산은 보존.
- 기존 기술/성장/저장/안전길 유지. 새로운 스토리 조건은 없음.

<a id="record-lead-0026-검증"></a>
#### 검증

Core 관련25/25, 전체583/583, 빌드 성공. 6종 최소/최대레벨 포획 저장복원, 도감 페이지, 상한, 기술, 자산해시/크기, 다른 관동도로 비활성을 검사했다.

Lead는 기존 자연 저장을 파일 가져오기 없이 사용했다. 초기 브라우저는 서버 미기동/자산 갱신 중 로드 실패였고 Vite 시작 및 재로드 후 성공했다. 저장 위치는 이전 보고의 블루가 아닌 천관산(7,11)이며 파티/기존 진행은 보존되어 있었다. 원인은 확인하지 못했다. 안전길을 실제 이동해 영원숲→축복→연구길→운하→갈색→해안길에 도착했다. 브라우저 탭 연결이 한 번 끊겨 같은 QA URL로 다시 열었고 해안길 저장이 복원되었다.

풀밭에서 꼬렛25 HP86 조우. 요가랑 염동력 두 번으로 HP50, 첫 볼 실패로 요가랑 기절. 꼬마돌 교대와 돌떨구기로 HP33, 두 번째 볼로 포획했다. 포획 화면/스프라이트/여섯 번째 파티 등록 확인. 블루센터에서 전원 회복하고 빠른 저장·재접속으로 꼬렛25/기술/만난 장소/도감 caught와 파티6마리가 보존됨을 확인했다. 최종 브라우저 warn/error0.

<a id="record-lead-0026-인계와-한계"></a>
#### 인계와 한계

qa=lead-0018-natural-bulbasaur, 블루(8,9) 아래, 파티 전원 회복, 6060원/볼1/약10, steps2939. 나머지5종의 자연 포획과 새 종 뒤 스프라이트 실제 전투는 미검증(파일 검사 통과). 첫 조우에서 기존 선두가 기절했으므로 다른 자연 파티 난이도 수용은 별도다. 기존 회색 방향 여행/보급 및 다른 관동 통로는 후속 범위다.

---

<a id="record-nexus-implementation-review-20260920"></a>
## nexus-implementation-review-20260920

원래 문서: `docs/autonomy/nexus-implementation-review-20260920.md`

<a id="record-nexus-implementation-review-20260920-넥서스-전체-구현도-평가와-컴파일-복구--2026-09-20"></a>
### 넥서스 전체 구현도 평가와 컴파일 복구 · 2026-09-20

사용자 지시로 참고 사이트 대조를 포함한 전체 구현도 평가를 수행하고, 평가 중 발견한 컴파일 불가 상태를 복구했다. 이 문서는 평가 근거와 수정 내역의 보존 기록이며 도시 완료 판정이나 QA 재개 지시가 아니다.

<a id="record-nexus-implementation-review-20260920-0-검증-범위와-한계"></a>
#### 0. 검증 범위와 한계

- 수행: 정적 코드 집계, 프로젝트 자체 대장 대조, 참고 사이트 표본 확인, `npx tsc --noEmit` 타입검사, `tests/audio-scenes.test.ts` 단일 대상 검사.
- 미수행: 전체 테스트 묶음, QA 게이트 `npm.cmd run build`, 브라우저 플레이, 보행·워프·조우·전투 실행, 시각·음향 청취, 저장·재접속 검증.
- 근거: [상세 AGENTS 검증 절](../AGENTS.md#검증과-도시-완료)이 개발 중 `문법/타입 등 작업 지속에 필요한 최소 확인`을 허용하고, `실행 불가·명확한 오동작`의 원인 확인과 수정을 요구한다. 타입검사는 이 최소 확인으로 수행했고 QA 게이트 빌드·브라우저 플레이는 중단을 유지했다.
- 아래 구현도 수치는 **코드·대장 조회값**이며 플레이 검증값이 아니다.

<a id="record-nexus-implementation-review-20260920-1-컴파일-불가-상태-발견과-복구-18건--0건"></a>
#### 1. 컴파일 불가 상태 발견과 복구 (18건 → 0건)

평가 착수 시점의 작업 트리는 **타입검사를 통과하지 못했다.** `npm.cmd run build`는 `tsc && vite build`이므로 이 상태에서는 빌드가 전혀 성립하지 않았고, 로컬 `dist/`는 2026-09-13 산출물이다. 오류 11파일 18건 중 2건은 실제 런타임 크래시 경로였다.

| 파일 | 원인 | 수정 | 영향 |
| --- | --- | --- | --- |
| `src/nimbasa-nexus.ts:34` | `handleNimbasaNexus`가 `scene(g)`에서 `active`를 구조분해 누락한 채 41행에서 `active()` 호출 | 같은 파일 `handleRouteFourNexus`와 동일하게 `{save,active,guide,commit}`로 맞춤 | **런타임 크래시**. 뇌문시티 조명 점검 선택지 `모든 등을 같은 밝기로 맞추기`에서 `ReferenceError` |
| `src/audio.ts:24` | `MOVE_SOUNDS`에 `MoveStyle`의 `ice` 항목 누락 | `ice:[880,560,4,'sine']` 추가. 얼음 연출의 밝은 유리질 표현에 맞춰 고음 하강 sine | **런타임 크래시**. `얼음뭉치` 사용 시 `MOVE_SOUNDS['ice']`가 `undefined`라 구조분해에서 `TypeError` |
| `src/oreburgh-city-art.ts:1,25` | 존재하지 않는 타입 `MapData` import | 다른 painter와 동일한 `GameMap`으로 교체 | 타입 전용. 런타임 동작 불변 |
| `src/azalea-workshop.ts:15` | `guide`의 `target:typeof map`이 가드로 `tour_azalea\|tour_azalea_hall`까지 좁아져 고동센터·숲·33번도로 안내를 거부 | `setTourDestination(id:string\|null)` 실제 시그니처와 다수 관용구에 맞춰 `target:string` | 타입 전용. 4건 해소 |
| `src/goldenrod-nexus.ts:26` | 위와 같은 `typeof map` 축소 | `target:string` | 타입 전용 |
| `src/icirrus-art.ts:88` | `ICIRRUS_POND_BANK`의 `as const` 때문에 TS가 루프 변수 `y`를 리터럴 `4`로 좁혀 `y===12\|\|13`을 불가능 비교로 판정 | `let y:number` / `let x:number`로 넓힘 | **동작 불변**. 뱅크는 y 4~14 범위라 12·13은 실제 도달하는 의도된 분기 |
| `src/johto-route-42-life.ts:76` | 기술 이름(문자열)을 `flags:Record<string,boolean\|number>`에 저장 | 종을 숫자로 저장하는 기존 관례에 맞춰 `MOVE_RULES[move].id`를 저장하고 `RUNTIME_DATABASE.moves.get(id).name`으로 역조회 | **저장 스키마 위반 해소**. 표시 문구는 동일 |
| `src/johto-route-43.ts:46`, `src/sinnoh-route210-habitat.ts:20`, `src/sinnoh-route211-trails.ts:27,28`, `src/renderer.ts:339` | `GameMap.terrain`이 선택 속성인데 존재를 가정 | 기존 관용구대로 읽기는 `terrain?.some` / `terrain??[]`, 추가는 `(map.terrain??=[]).push` | 타입 전용. 풀밭 없는 맵에서의 잠재 크래시 차단 |
| `src/rage-lake-gyarados-art.ts` | `images`를 `Record<string,HTMLImageElement>`로 좁게 선언. 렌더러 저장소는 `HTMLImageElement\|HTMLCanvasElement` | 다른 20개 painter와 같은 넓은 타입으로 통일 | 타입 전용. `renderer.ts` 2건 해소 |

- 검증: `npx tsc --noEmit` 통과(오류 0). `tests/audio-scenes.test.ts` 10/10 통과.
- PROJECT_STATE에 남아 있던 `src/sinnoh-celestic-life.ts:11` 타입 오류는 현재 트리에서 재현되지 않는다. 해소 시점은 특정하지 않는다.
- 새 기능·맵·조우·보상·저장 항목을 추가하지 않았다. 모든 수정은 기존 의도를 보존하는 타입·참조 정정이다.

<a id="record-nexus-implementation-review-20260920-검사-공백-기록"></a>
##### 검사 공백 기록

`audio-scenes.test.ts` 10건은 `ice` 누락을 잡지 못했다. `MoveStyle` 전체가 `MOVE_SOUNDS` 키를 갖는지 확인하는 검사가 없었다. 이번에 `tests/move-pp.test.ts`가 모든 기술에 대해 실제 `playMove`를 호출하도록 추가했고, `ice` 항목을 일시 제거하면 그 검사가 실패하는 것을 확인했다. 같은 부류로 `typeof map` 축소는 `src/rage-lake-nexus.ts:13`에 동일 패턴이 남아 있으나 현재 호출 범위에서는 오류가 아니므로 변경하지 않았다.

<a id="record-nexus-implementation-review-20260920-1-2-검사-묶음의-실제-상태--141개-중-65개는-로드조차-되지-않는다"></a>
#### 1-2. 검사 묶음의 실제 상태 — 141개 중 65개는 로드조차 되지 않는다

컴파일 복구 뒤 파일 단위로 조회한 결과다. 과거 회차 보고의 `583개 검사 통과`는 당시 이력이며 현재 상태가 아니다.

| 구분 | 수 |
| --- | ---: |
| 테스트 파일 | 142 (기존 141 + 이번 신규 1) |
| **로드 실패 (검사 실행 자체 불가)** | **65** |
| 로드되어 실행됨 | 77 |
| 실행됐지만 실패 있음 | 36 |
| 전부 통과 | 41 |

- 로드 실패 사유는 전부 모듈 초기화 순환이다. `Cannot access 'TOUR_MAPS' before initialization` 62건, `Cannot access 'HOMES' before initialization` 3건.
- **원인:** 값(런타임) import 기준으로 순환이 있다. `maps.ts → mahogany-power.ts → mahogany-transmitter.ts → road-trainers.ts → maps.ts`, `explore-world.ts → castelia-homes.ts → castelia-gallery.ts → explore-world.ts`. `maps.ts:22`의 `MAPS` 객체가 최상위에서 즉시 `TOUR_MAPS`를 펼치므로, 진입 모듈이 `engine.ts`를 먼저 거치지 않으면 초기화 전 접근이 된다. 브라우저는 `main.ts`가 `engine`을 먼저 import해 우연히 성립하는 상태다.
- **이 65건은 기존 상태다.** HEAD `f39f13c`를 별도 worktree로 받아 같은 65개 파일을 실행해 65/65가 동일하게 로드 실패함을 확인했다. 이번 회차의 변경은 `maps.ts`·`explore-world.ts`의 import를 건드리지 않았다.
- 이 순환 해소는 제8절 6번 `장소 레지스트리`에 해당하는 구조 작업이므로 이번 회차에서 임의로 재작성하지 않았다. 신규 검사 파일은 기존 묶음의 관례대로 `import '../src/engine'`를 먼저 두어 우회했고 그 이유를 파일에 남겼다.

<a id="record-nexus-implementation-review-20260920-2-참고-사이트-활용-실측"></a>
#### 2. 참고 사이트 활용 실측

`docs/`·`src/` 전체의 URL 인용 수를 집계했다. 인용 수는 활용 정도이며 검증 완료를 뜻하지 않는다.

| 우선순위 | 사이트 | 인용 | 평가 |
| ---: | --- | ---: | --- |
| 1 | Bulbapedia | 183 | 1차 기준으로 실제 사용 |
| 2 | Serebii Pokéarth | 94 | 조우·출입구 교차검증에 실제 사용 |
| 3 | Bulbagarden Archives | 28 | 맵 이미지 참고 기록됨 |
| 4 | Bulbapedia Walkthrough | (1에 포함) | Section 번호까지 인용 |
| 5 | StrategyWiki | 2 | 거의 미사용 |
| 6 | GameFAQs | 2 | 거의 미사용 |
| 7 | PokéAPI | 1 | 미사용. 종·기술 자동 수집 채널 미활용 |
| 8 | 한국어 위키·pokemonkorea | 3 | 게임 전체가 한국어인데 공식 표기 근거가 3건 |

<a id="record-nexus-implementation-review-20260920-표본-대조-최신-작업분은-원작과-일치"></a>
##### 표본 대조: 최신 작업분은 원작과 일치

- 근거: [Bulbapedia Oreburgh Gate](https://bulbapedia.bulbagarden.net/wiki/Oreburgh_Gate), 2026-09-20 확인. 버전은 Pokémon Platinum.
- 원작 사실 1F: 주뱃 50% Lv.5-8, 고라파덕 35% Lv.5-7, 꼬마돌 15% Lv.5·7. (주뱃 20%·꼬마돌 80% 행은 D/P 전용 표기다.)
- 프로젝트 `S-OREBURGH-GATE-1F-PT`: 주뱃 50% `[5,6,7,8]`, 고라파덕 35% `[5,6,7]`, 꼬마돌 15% `[5,7]`. **비율과 레벨 선택지까지 일치.**
- 데이터에 `source.file`·`crossCheck`·`version:platinum`·`checked:2026-09-15`와 제외 항목(B1F·바위깨기·아이템·원작 트레이너 2명)이 기록돼 있다. 지시서가 요구하는 적용 기록 형식을 충족한 사례다.

<a id="record-nexus-implementation-review-20260920-같은-형식이-25에만-적용됨"></a>
##### 같은 형식이 25%에만 적용됨

조우풀 72개 중 데이터에 출처 메타를 가진 것은 **18개(25%)**다. 나머지 54개는 노드 단위 URL·확인일·버전이 비어 있다.

```
J-R29~R46(성도 전 도로), K-R07~R18(관동 전 도로), U-R06/R08/R09/R12/R13,
U-CHARGESTONE, U-REVERSAL, J-ILEX, J-ICE-PATH, J-DARK-CAVE, S02~S15 …
```

`docs/`에 213개 URL이 있어 근거가 전무한 것은 아니지만, 노드 단위로 묶인 것은 신오 최신 작업분뿐이다. **최근 회차는 규칙을 지키고 과거 대량 작업분은 소급 근거가 비어 있다.**

<a id="record-nexus-implementation-review-20260920-3-영역별-구현도-조회값"></a>
#### 3. 영역별 구현도 (조회값)

| 영역 | 수치 | 근거 |
| --- | --- | --- |
| 등록 맵 | 402 | `MAP_SIZE_STANDARDS` 제4절 |
| 맵 크기 목표 달성 | 421/533행 (79%) | 대장 현재=목표 일치. 미적용 112행(실내 76·통로 25·야외 10·시작 1) |
| 센터 보유 정착지 | 39 | `tour_*_center` 조회 |
| 껍데기 정착지 | 10 | 외부 맵만 존재, 센터·상점·실내 전무 |
| 조우 바인딩 | 77맵 / 야외·통로 약 204맵 (38%) | `runtime-encounters.ts` `MAP_POOLS` |
| 출처 기록된 조우풀 | 18/72 (25%) | 위 2절 |
| 체육관·배지 | **4/32 (12.5%)** | `gyms.ts` 신오 강석·유채·멜리사·자두 |
| 등록 종 | 80 / 설계 도감 약 590 (13%) | `runtime-pokemon-data.json` |
| 기술 | 55 | 규칙 13종 |
| 진화 | 8 / 설계 297행 (3%) | 모두 레벨 진화 |
| 아이템 | **2** | 몬스터볼·상처약 |
| 레벨 상한 | 25 | `data/rules.ts` |
| painter | 191개, `*-art.ts` 88개 전부 연결 | 미연결 0건 |
| 저장 플래그 | 235종 | 전부 `save.flags` |
| 이벤트 핸들러 | `handle*` 101 / `install*` 123 | |
| 테스트 | 141파일 | 이번 회차에 1파일만 실행 |

<a id="record-nexus-implementation-review-20260920-껍데기-정착지-10곳"></a>
##### 껍데기 정착지 10곳

`pewter, cerulean, viridian, pallet, floaroma, solaceon, aspertia, virbank, humilau, desert`

<a id="record-nexus-implementation-review-20260920-지방별-진도"></a>
##### 지방별 진도

| 지방 | 대조 버전 | 도로 | 정착지 | 체육관 |
| --- | --- | --- | --- | --- |
| 신오 | Pt | 19/30 | 14/14 | 4/8 |
| 성도 | HGSS | 18/20 | 9/10 (황토마을 없음) | 0/8 |
| 관동 | HGSS | 15/25 | 10/10 | 0/8 |
| 하나 | BW2 | **7/23** | 13/19 | 0/8 |

정식 번호 도로가 없는 구간은 `tour_pass_*` 추상 통로 24개가 대신 잇는다. 대장 제5절에 신규 공식 경유지 117개가 목표만 등록돼 있다.

<a id="record-nexus-implementation-review-20260920-4-전투육성의-실제-범위"></a>
#### 4. 전투·육성의 실제 범위

- 구현: 18타입 상성, 6능력치(HP·공격·방어·특공·특방·스피드), 물리/특수 구분, **스피드·우선도 행동 순서**, 교체, 포획, 랭크 변화(공격·방어), 흡수, 고정 피해, 레벨 비례 피해, 스텔스록, 방어, 발버둥, 무게 기반 피해, 난수 주입(`random` 파라미터)으로 결정적 재현 가능.
- 미구현: **PP 없음**(`pp` 식별자 0건), **상태이상 없음**(화상·독·마비·잠듦·얼음 판정 0건), 명중률·급소·특성·지닌물건·날씨·연속 공격 없음.

<a id="record-nexus-implementation-review-20260920-readme-기재-정정-필요"></a>
##### README 기재 정정 필요

공개 `README.md`가 전투 기능으로 `move PP`와 `status conditions`를 안내하고 `items`를 복수로 적는다. 런타임에 PP와 상태이상은 존재하지 않고 아이템은 2종이다. [AGENTS.md](../AGENTS.md)의 `미구현 이동 수단·새 잠금·보상을 기능처럼 안내하지 않는다`에 어긋나므로 이번 회차에서 정정한다.

<a id="record-nexus-implementation-review-20260920-5-공개-프로젝트-구조-참고의-채택-여부"></a>
#### 5. 공개 프로젝트 구조 참고의 채택 여부

| 참고 | 채택 목표 | 현재 |
| --- | --- | --- |
| Showdown | 전투 처리/표시 분리, 결정적 난수 | 채택. `battle.ts` ↔ `*-battle-art.ts` 분리, `random` 주입 |
| pokeemerald | 이벤트·저장 상태 경계 | 채택. 플래그 235종 전부 `save.flags` |
| pokeplatinum | 신오 원작 지리 대조 | 채택. 표본 대조 통과 |
| PokeWilds | 동료 선택이 결과를 바꾸는 현장 활동 | **가장 강한 부분.** `*-journey.ts`가 동종 대체를 거부하고 실제 개체를 추적 |
| Essentials | 조건→대사→일회성→재방문을 이벤트 레코드로 | **미채택.** `handle*` 101개 명령형 분기. 데이터 테이블 없음 |
| RPG-JS | 지역 모듈의 등록 책임 분리 | **미채택.** 레지스트리 없음 |

미채택 2건의 실측 결과: `explore-world.ts` import 130, `renderer.ts` 99, `engine.ts` 53. 장소 하나를 추가할 때 중앙 3파일을 함께 수정해야 한다. Engine 참조 95개 중 92개가 `import type`이라 런타임 순환 의존은 없다.

<a id="record-nexus-implementation-review-20260920-6-종합-판정"></a>
#### 6. 종합 판정

**신오 전반부의 수직 슬라이스로는 완성도가 높고, 네 지방 게임으로는 설계 대비 약 25~30%다.**

- 강점: 지리 존재감(402맵), 저장 견고성(`worldRevision` 이행·엄격 파싱·`?qa=` 슬롯 격리), 최신 작업분의 원작 대조 정확도, 실제 개체 추적이라는 독자적 설계, painter 미연결 0건.
- 구조적 상한: 체육관 4/32·아이템 2종·레벨 상한 25이므로 현재 완주 가능한 캠페인은 신오 네 배지까지다.
- 설계–런타임 격차: 설계 DB 종 약 590·조우표 약 700행 대 런타임 80종·72풀. `questDesignsAutoEnabled:false`로 분리한 판단은 타당하나, 문서량이 구현 진척으로 오인될 위험이 크다.

<a id="record-nexus-implementation-review-20260920-7-남은-문제"></a>
#### 7. 남은 문제

1. 전체 테스트 141파일과 QA 게이트 빌드는 여전히 미실행이다. 타입검사 통과는 컴파일 성립만 뜻하고 동작을 보증하지 않는다.
2. 조우풀 54개의 노드 단위 출처 기록이 비어 있다.
3. 껍데기 정착지 10곳은 진입해도 회복·판매·실내가 없다. 지도 표기와 실제 제공이 불일치한다.
4. 네 지방 중 세 지방에 체육관이 없어 배지 진행이 신오에서 끝난다.
5. `MoveStyle` 전수 검사, `GameMap.terrain` 선택 속성 접근 같은 부류별 회귀 검사가 없다.

<a id="record-nexus-implementation-review-20260920-7-2-이번-회차의-공통-시스템-구현--기술-pp"></a>
#### 7-2. 이번 회차의 공통 시스템 구현 — 기술 PP

제8절 1번 `자원 소모 루프`를 실제로 적용했다. 맵을 늘리지 않고 이미 있는 402맵·39센터의 의미를 올리는 공통 작업이며 지방별 복제가 없다.

- **데이터:** JSON을 직접 편집하지 않고 `scripts/design/export-runtime-pokemon.py`에 `'pp':int(r['pp'] or 0)`를 추가해 재생성했다. 값의 출처는 익스포터가 이미 고정해 둔 PokeAPI 커밋 `d4f9a4af58ade123fbc0558f68b1c69daa97d9e4`의 `moves.csv` `pp` 열이다. 캐시가 남아 있어 네트워크 없이 재현했다.
- **재생성 차분 검증:** HEAD의 JSON과 비교해 변경된 최상위 키는 `moves`와 `limits`뿐이고, `moves`의 변경은 `pp` 추가로만 한정됨을 확인했다. 종 80·소유 74·풀 72·기술 55·진화 8은 불변이다. PP 범위는 1~40이며 누락 0건이다.
- **공통 모듈:** `src/move-pp.ts` 신규. `maxPp`·`currentPp`·`usablePp`·`anyUsablePp`·`spendPp`·`restorePp`·`resetSlotPp`·`validPokemonPp`. 계약은 [RUNTIME_DATABASE의 기술 PP 절](../RUNTIME_DATABASE.md#기술-pp--2026-09-20)에 기록했다.
- **연결 지점:** `types.ts`에 `Pokemon.pp?:number[]`, `battle.ts`의 기술 실행에 소모·거부·발버둥 폴백, `engine.ts:healParty`에 센터 회복 시 전량 복구, `pokemon.ts`의 `teachMove`에 교체 슬롯 전량 부여와 `validPokemonMoves` 경유 저장 검증, `renderer.ts`의 전투 기술 버튼·`기억하고 있는 기술` 패널에 `PP 현재/최대` 표시(0이면 붉은색·기술명 흐리게), `battle-hints.ts`에 소진·폴백 안내, `pallet-sparring.ts`의 사본 시뮬레이션 전량 회복.
- **원작 대조 규칙:** 발버둥은 카운터 없는 무제한 폴백으로 PP를 소모하지 않는다. 다른 기술에 PP가 남았으면 소진된 기술 선택은 턴을 쓰지 않고 거부하고, 전 기술이 0이면 발버둥으로 해결한다. 필드 상처약은 원작처럼 PP를 회복하지 않는다.
- **하위 호환:** PP가 없던 저장은 읽을 때 전량으로 채워진다. 기술을 바꿔 남은 옛 카운터는 그 기술의 상한으로 깎여 읽히고 저장을 무효화하지 않는다. 처음 시도한 기술별 상한 거부 방식은 기존 검사 `four-moves`의 기술 재배치 사례에서 정상 저장을 거부했으므로, 거부가 아니라 읽을 때 깎는 방식으로 바꿨다.
- **경계:** 상대 포켓몬은 PP 제한이 없다. 포인트업·에테르류 도구, PP 강화, 상태이상은 도입하지 않았다.
- **검증:** `npx tsc --noEmit` 통과. 신규 `tests/move-pp.test.ts` 15/15 통과. 공통 전투·저장·성장에 걸친 기존 14파일(40검사)을 HEAD worktree와 비교해 **24통과/16실패가 기준선과 동일**하고 새로 깨진 검사가 없음을 확인했다. 브라우저 플레이·실제 음향·저장 재접속·도시 QA는 미실행이다.

<a id="record-nexus-implementation-review-20260920-8-다음-작업--포켓몬-시리즈다운-구현-순서"></a>
#### 8. 다음 작업 — 포켓몬 시리즈다운 구현 순서

지방마다 복제하지 않는 **공통 시스템**을 먼저 올리고, 그 위에서 도시 단위 작업을 잇는다. 맵 개수·크기 확대를 진척으로 대신하지 않는다.

1. ~~**자원 소모 루프**~~ — 2026-09-20 적용. 제7-2절 참조. 남은 후속은 PP 회복 도구와 상대 PP 여부 결정이다.
2. **모듈 초기화 순환 해소**: 검사 묶음 141개 중 65개가 로드조차 되지 않는다(제1-2절). 다음 공통 작업의 최우선이다. 이것을 두고 다른 기능을 올리면 회귀를 감지할 수 없다. 6번 레지스트리와 같은 작업이다.
3. **상태이상**: 독·마비·잠듦·화상·얼음 판정과 필드 지속·센터 회복을 공통 전투에 연결한다. 기술 데이터의 부가 효과가 선행 조건이다.
4. **아이템 등급**: 볼·회복약 등급과 상태회복·PP 회복을 추가해 상점·소지금·경제를 실제 선택으로 만든다. 1·3번이 선행 조건이다.
5. **껍데기 정착지 정리**: 서비스를 채우거나 지도에서 미개통으로 명시한다.
6. **조우풀 출처 소급**: 무쇠게이트 형식을 템플릿으로 54개를 채운다.
7. **장소 레지스트리**: 신규 장소가 자기 자신을 등록해 중앙 3파일 수정을 줄인다. 2번의 순환 해소를 포함하며 엔진 교체가 아니다.
8. **체육관 확장**: 성도·관동·하나 관장을 지방별 도시 작업에 맞춰 올린다. 2~4번이 선행 조건이다.

각 항목은 도시 완료와 독립된 공통 작업이며, 완료 시 [도시 완료 조건](../DEVELOPMENT.md#0-최우선-목표와-지방도시-작업-단위)과 [QA 규칙](../AGENTS.md#검증과-도시-완료)을 따른다.

---

<a id="record-qa-resumed-20260912"></a>
## qa-resumed-20260912

원래 문서: `docs/autonomy/qa-resumed-20260912.md`

<a id="record-qa-resumed-20260912-qa-재개--축복시티--하나-지도-복구"></a>
### QA 재개 · 축복시티 / 하나 지도 복구

사용자가 명시적으로 QA 재개를 지시했다. 루트 및 docs/AGENTS.md의 이전 중단·중앙 일회성 제한을 해제했다. 이후 도시 단위 검증 원칙은 유지한다.

<a id="record-qa-resumed-20260912-재현과-수정"></a>
#### 재현과 수정

- 브라우저에서 축복 진입 시 explore-panel의 누락된 직통 연결 `w.entry` 접근 예외를 확인했다. 같은 프레임에서 전환이 멈춰 화면이 어둡게 남았다. 직통 연결이 없는 이웃은 방향을 지어내지 않고 경유로 표시한다.
- 하나 지도는 `Missing atlas location: 하나/tour_lentimas` 오류였다. 산로·물결·보배·빌리지브리지·설화의 표시 좌표를 보완했다. 이 좌표는 축약 지도 표시용이며 런타임 지리·출구를 변경하지 않는다.
- 개발 패널의 초기화/갱신 예외가 게임 루프를 중단하지 않도록 분리하고 오류는 콘솔 및 패널 경고로 표시한다. 게임 엔진 자체의 오류를 숨기는 처리가 아니다.
- 기존 빌드를 막던 선택 기술 배열 접근, 신오 연결 인자의 MapId 타입, 하나 11번도로 중복 terrain 속성을 수정했다.

<a id="record-qa-resumed-20260912-검증"></a>
#### 검증

- 타입 검사 및 Vite 빌드 통과. 번들 크기 경고 유지.
- central-panel-regression 3/3 통과: 네 지방 48개 표시 지점, 패널 예외 격리, 202번도로→축복 전환 완료와 이동 잠금 해제.
- 별도 `?qa=atlas-recovery-20260912`에서 개발 도구로 축복시티 이동 후 정상 밝기, 하나 지도 15개 장소 표시, 산로마을 클릭 이동과 화면 표시 확인. 이 브라우저 이동은 개발 도구 이동이며 자연 진행 완료가 아니다. 오류 로그 없음.
- 전체 테스트 최초 재개 기준: 1284개 중 839 통과 / 445 실패. 이후 회귀 테스트 1개 추가분은 별도 위 3/3 결과다. 전체 재실행이나 실패를 통과로 바꾸는 기대값 일괄 수정은 하지 않았다. 원본 로그 `qa-resumed-20260912.log` 보존.
- QA 사본에서 빠른 저장 후 새로고침하여 산로마을 (14,11), 축복/산로 방문 기록, transition=0 복구 확인. 사용자 원본 슬롯과 파티를 사용하는 검사가 아니다.

<a id="record-qa-resumed-20260912-남은-실제-결함과-분류-순서"></a>
#### 남은 실제 결함과 분류 순서

1. 출구 충돌: collision 검사에서 의도한 211 서부 대신 205 북부로 이동. 같은 지점·방향의 워프 중복과 설치 순서를 먼저 조사한다.
2. 천관산 통로 단절: (20,3) 바닥이 시작점에서 연결되지 않음.
3. 미니맵 표식과 현재 워프 불일치, 저장 이행 및 실내 활동 실패를 영향 도시별로 분리한다.
4. 옛 지명·장소 수·치수·조우 가정의 테스트는 원작/채택 설계/현재 코드와 대조한 뒤 갱신 여부를 결정한다. 445개를 모두 독립적인 게임 버그 또는 모두 낡은 검사로 단정하지 않는다.

사용자 원본 저장은 조작하지 않았다. 사본 저장의 전체 포켓몬·배지·보상 이행, 네 지방 자연 플레이 및 소리 검증은 미완료다. 전체 QA 완료 상태가 아니다.

---

<a id="record-regional-continuation-20260913"></a>
## regional-continuation-20260913

원래 문서: `docs/autonomy/regional-continuation-20260913.md`

<a id="record-regional-continuation-20260913-네-지방-기존-장소-후속-구현--2026-09-13"></a>
### 네 지방 기존 장소 후속 구현 — 2026-09-13

<a id="record-regional-continuation-20260913-중앙-후속--레벨업을-실제-기술-습득에-연결"></a>
#### 중앙 후속 — 레벨업을 실제 기술 습득에 연결

`growth.ts`의 새 기술 처리는 기존 학습 가능 목록의 전후 차이를 사용한다. 빈 칸이 있을 때만 새 기술을 추가하고, 가득 차면 기존 기술을 유지한 채 배틀 후 기술 선택 대상으로 남긴다. 여러 레벨이 오르면 학습 순서대로 남은 칸을 채운다. 기존에 배우지 않고 남겨 둔 과거 기술을 임의로 채우지는 않는다. `renderer.ts`의 성장 화면도 스냅샷의 실제 기술 목록을 읽어 ‘배웠다’와 ‘배울 수 있다’를 구분한다. 기존 `growth-learning.ts`는 이미 습득한 기술을 후보에서 제외하므로 자동 습득분을 다시 선택하도록 요구하지 않는다.

공통 성장 경로의 코드 반영이며 테스트·타입 검사·빌드·브라우저·저장 QA는 중단 유지로 미실행이다. 네 지방 플레이 완료나 전투 규칙 전체 구현을 뜻하지 않는다.

<a id="record-regional-continuation-20260913-중앙-후속--포획한-동료를-도로-실전에-내보내기"></a>
#### 중앙 후속 — 포획한 동료를 도로 실전에 내보내기

공통 `road-trainers.ts`를 사용하는 도전 대화에 출전 동료 선택을 연결했다. `trainer-preparation.ts`는 파티를 세 마리씩 보여 주고 실제 HP·기억한 기술을 확인한 뒤 선택한 동료로 배틀을 시작한다. 취소/미리보기는 파티 순서를 바꾸지 않고, 기절한 동료는 출전할 수 없다. 선택 확정은 기존 `leadPokemon`을 사용하므로 성도 꽃 돌봄·하나 습지 동료 추적도 유지한다. 기존 즉시 도전 선택과 출발/일회 승리/보상 계약은 보존한다. 새 성장 규칙이나 재대결을 추가한 것은 아니다.

테스트·타입 검사·빌드·브라우저 QA는 중단 유지로 미실행. 소스 연결만 읽었으며 화면 가독성·입력·저장 후 플레이는 미검증이다. 모든 체육관/별도 스크립트 전투에 적용된 것은 아니고 공통 도로 트레이너 범위다.

<a id="record-regional-continuation-20260913-최신-묶음--조우와-안전한-여행-선택"></a>
#### 최신 묶음 — 조우와 안전한 여행 선택

네 지방 담당 작업이 다음 내용을 코드에 반영하고 이번 묶음을 종료했다. 아래 기존 묶음의 ‘29번 새 조우 없음’은 당시 기록이며 이번 변경에는 해당하지 않는다.

- 신오: `sinnoh-route210-habitat.ts`를 기존 210번도로 북부 생성에 연결했다. 선택 풀밭과 바깥 마른 합류길을 추가해 기존 요가랑·알통몬 조우 풀을 이용한다.
- 관동: 홍련 동·서 외곽 풀밭을 안전 샛길로 나누고 같은 좌표의 석재 표현을 연결했다. 풀밭에 들어가 기존 조우를 할지 피해 갈지 선택한다.
- 성도: 29번도로 북서쪽 풀언덕에 실제 조우 terrain과 `J-R29-DAY` 풀을 연결했다. 현재 지원하는 구구·꼬렛을 사용한다. 레벨20~22와 비율은 프로젝트 설정이며 HGSS 원작 수치가 아니다.
- 하나: 8번도로 북쪽 서식지에 마른 귀환 샛길을 열고 여행자가 실제 HP·몬스터볼·현지 출신 파티에 따라 기존 회복/보충/서식지/선택 전투로 안내한다.

중앙에서는 변경 소스와 기존 생성·이벤트 호출 연결을 읽었다. 테스트·빌드·브라우저 등 QA는 실행하지 않았다. 전투·육성 전체의 개선이나 네 도시 완료로 판정하지 않는다. 다음 회차는 사용자가 각 지방 작업에 직접 `continue`를 보내 이어간다.

REGIONAL_IMPLEMENTATION_DIRECTIVES에 따른 기존 도시·연결 구간 후속 묶음이다. 새 맵·크기 확대 없이 코드에 반영했다. QA 중단을 유지해 테스트·타입 검사·빌드·브라우저·저장/시청각 검증은 실행하지 않았다.

| 지방 | 이번 반영 | 경계 |
| --- | --- | --- |
| 신오 | 211 서부/동부에 산기슭을 돌아 본선에 합류하는 선택 길, 본선과 구분되는 산길 표현 | 기존 보행 칸·출구·조우·NPC 보존. 기존 넓은 중앙길과 본편 부족은 남음 |
| 관동 | 쌍둥이섬 1F~B4F의 서로 다른 곁길·회랑·합류, 접근할 수 없던 조사물 연결, 계단/귀환 안내 | 원작 바위/수상 퍼즐 재현 아님. 기존 층·계단·저장 좌표 보존 |
| 성도 | 무궁 주민·주택·센터가 실제 보유한 현지 출신 동료와 HP/PC 상태를 읽어 반응, 29번 무궁 연결 안내 정정 | 29번 새 조우·종·보상·통행 잠금 추가 없음 |
| 하나 | 같은 동료 재선택 시 습지 기록 유지, 갈대→물새→전망→귀환의 실제 길안내 연결 | 기존 슬롯/종 기반 동료 식별 한계 유지. 본편·보상 추가 없음 |

상세: [신오](SINNOH_HISTORY.md#record-sinnoh-continuation-20260913) · [관동](KANTO_HISTORY.md#record-kanto-continuation-20260913) · [성도](JOHTO_HISTORY.md#record-johto-continuation-20260913) · [하나](UNOVA_HISTORY.md#record-unova-continuation-20260913). 네 작업 모두 기존 호출에 연결되어 추가 미연결 함수가 남은 상태는 아니다. 런타임 검증 완료를 뜻하지 않는다.

<a id="record-regional-continuation-20260913-중앙에서-함께-고친-실제-연결-누락"></a>
#### 중앙에서 함께 고친 실제 연결 누락

- `src/explore-world.ts`: 무궁 상점의 `martClerk`가 `MART_ROOMS` 검사에서 제외되어 판매 메뉴가 열리지 않던 등록 누락을 수정했다. 기존 품목·가격·구매 계약을 유지한다.
- `src/explore-art.ts`: 실제 상점 실내에 연결된 landmark도 상점 외관 분기를 사용하게 했다. 주택 kind만 처리하던 제한을 제거했다.
- `src/explore-panel.ts`: 시설 안내의 고정 `_center`/`_hall` 추정을 없애고 도시의 실제 워프·등록 실내·부모 관계로 입구 목록을 만든다. 무궁/봉신에 없는 hall로 안내하지 않고 실제 주택·상점·유적을 포함한다. 봉신 도시 목록 중복도 ID 기준으로 제거한다.
- `src/renderer.ts`: 모든 `field-*` NPC가 도시의 한 roaming 포켓몬 위치/종을 공유하던 분기를 수정했다. `tourPokemon`만 roaming 위치를 쓰고 나머지는 각 NPC의 위치·종·전용 프레임을 사용한다. 독립 생활 콩둘기도 사람용 스프라이트 분기로 들어가지 않는다.

<a id="record-regional-continuation-20260913-다음-작업"></a>
#### 다음 작업

도시별 남은 범용 외관·길의 목적·현지 포켓몬을 키워 사용하는 경험을 보수한다. 이번 선택 길은 기존 보행 위치를 보존한 가산 방식이므로 넓은 본선을 축소하거나 원작 배치를 재현한 것은 아니다. QA 재개가 명시되기 전에는 보수 코드 반영·미검증 상태를 유지한다.

---

<a id="record-regional-map-repair-20260913"></a>
## regional-map-repair-20260913

원래 문서: `docs/autonomy/regional-map-repair-20260913.md`

<a id="record-regional-map-repair-20260913-기존-네-지방-지도-보수--2026-09-13"></a>
### 기존 네 지방 지도 보수 — 2026-09-13

사용자가 빈 들판과 이상한 장소 구현을 지적한 요청의 실제 코드 변경 기록이다. 지도 수나 크기를 늘리지 않았다. 상태는 **보수 코드 반영·미검증**이며 네 지방 완성 또는 BW2 원작 재현 완료가 아니다. 현재 QA 중단에 따라 테스트·타입 검사·빌드·브라우저·저장·시청각 QA를 실행하지 않았다.

<a id="record-regional-map-repair-20260913-확인한-코드상의-원인과-공통-수정"></a>
#### 확인한 코드상의 원인과 공통 수정

- `src/renderer.ts`: 풀밭 표시가 특정 맵 이름 목록에 한정되어 새 조우 지역은 평지처럼 보일 수 있었다. 실제 `map.terrain`에서 표시하고 보행 가능 칸·현재 카메라 범위만 그리도록 바꿨다. 동굴은 같은 분류로 지면과 발밑을 암석/먼지로 표시한다. 조우 확률·종·레벨은 변경하지 않았다.
- `src/explore-boundary-art.ts`, `src/explore-art.ts`: 별도 배치가 없는 맵의 내부 `#` 지형은 일반 바닥으로 남았다. 건물·등록 풍경·조사물·출구를 제외한 기존 충돌 지형에 테두리·암반·수목을 표시한다. 이는 미표시 장애물을 드러내는 보수이며 원작 지형 자동 생성이나 맵별 전용 디자인 완성을 뜻하지 않는다.
- `src/explore-materials.ts`, `src/explore-art.ts`: 일반 주택·시설·센터 그림은 고정된 건물 왼쪽/두 칸 높이에 의존했다. 확대된 건물의 실제 문과 그림이 어긋날 수 있어 원본 자산 문 위치를 현재 `door`에 맞췄다. 범용 자산 자체의 다양성과 넓은 건물 충돌 면적에 맞는 외관은 추가 보수가 필요하다.
- `src/region-atlas.ts`: 등록된 무궁시티의 지도 좌표가 없어 성도 지도 생성에서 예외가 날 수 있었다. 성도 남동부의 무궁 좌표를 추가했다.
- 해안 테마라는 이유만으로 모든 장소 하단에 같은 배를 그리던 코드를 제거했다. 실제 전용 항구 표현은 유지한다.

<a id="record-regional-map-repair-20260913-지방별-반영-및-연결"></a>
#### 지방별 반영 및 연결

| 지방 / 기존 장소 | 이번 코드 변경 | 남은 경계 |
| --- | --- | --- |
| 신오 / 봉신·210 북부·211 양측·천관산 통과층 | 보행로를 덮던 고정 절벽띠와 유적 배경 제거, 숲/암반 경계, 봉신 석재 생활길, 실제 문에 맞는 석조 유적 외관. 전경 함수도 `paintTourBuilding`에 연결 | 211의 단순 통로와 범용 민가, 본편 사건 완성은 남음 |
| 관동 / 홍련 상륙로·19/20번수로·쌍둥이섬 | 보행 갑판과 바다, 섬 암반, 동굴 층리와 워프 계단을 전용 painter로 연결. 조사물의 대사 등록 누락 수정. 홍련의 수면으로 보이던 상륙로 보수 | 갑판 보행은 프로젝트 재구성. 원작 Surf/Strength 퍼즐·배 운항 구현이 아님 |
| 성도 / 무궁시티 | 서쪽 굽은 해안·남서 만·꽃화단·방풍림, 현관/29번 도착/북쪽 경계를 잇는 생활길. 공통 십자길 제외, 전용 painter 연결. 상점 꽃밭 동쪽 우회길도 표시. 실내 부모를 Place로 등록 | 30번도로는 기존 미개통 경계 유지. 원작 시설 상대 위치·안내 할아버지 사건은 미재현 |
| 하나 / 설화·8번도로·설화습지 | 보행/조우 구역 위를 덮던 직사각형 물 제거, 충돌 격자에 제한한 수면과 흙 둑길/목재 데크, 갈대와 기존 관찰 표식. 설화 북행/동행길 painter에 실제 map 전달 | 계절·결빙·수상이동·새 본편 사건은 미구현. 도시 범용 건물은 남음 |

지방별 출처와 원작/프로젝트 차이: [신오](SINNOH_HISTORY.md#record-sinnoh-celestic-map-repair-20260913), [관동](KANTO_HISTORY.md#record-kanto-map-repair-20260913), [성도](JOHTO_HISTORY.md#record-cherrygrove-repair-20260913), [하나](UNOVA_HISTORY.md#record-unova-wetland-repair-20260913). 이 보고들의 **중앙 연결 대기**는 전달 당시 기록이다. 이번 중앙 변경에서 요청한 모든 import/호출을 연결했다. 호출 위치의 소스 확인과 실제 화면 검증은 다르다.

<a id="record-regional-map-repair-20260913-다음-작업-기준"></a>
#### 다음 작업 기준

새 맵 확장보다 위 장소의 원작 지도와 프로젝트 배치를 대조해 남은 반복 외관·불필요한 넓은 바닥·단순 통로부터 보수한다. 현지 포켓몬·성장·사건 결과가 부족한 곳은 장식만 추가하고 도시 완료로 처리하지 않는다. QA 재개가 명시되면 해당 도시의 진입→시설→활동→출발/귀환, 지도 선택, 저장과 시각을 묶어 검증한다. 이번에는 기존 저장·이벤트·서버·자동화를 변경하지 않았다.

---

<a id="record-region_atlas"></a>
## REGION_ATLAS

원래 문서: `docs/reference/REGION_ATLAS.md`

> **분류: 참고 자료.** 조사·설명 당시의 근거이며 현재 구현/우선순위는 [PROJECT_STATE](../PROJECT_STATE.md)와 [제작 계획](../STORY_AXIS_ROADMAP.md)이 담당한다.

<a id="record-region_atlas-개발도구-지방-타운맵"></a>
### 개발도구 지방 타운맵

> **시각 목표 변경 · 2026-09-12:** 현재 목표는 [BW·BW2풍](../VISUAL_STYLE_BW_BW2.md)이다. 아래 DP/Pt 원작·자산·적용 보고는 기존 출처와 구현 이력이며 새 목표가 아니다. 그래픽 전환 완료를 뜻하지 않으며 모든 QA 중단을 유지한다.

2026-09-10 적용. 개발도구의 신오·관동·성도·하나 지도를 사용자 제공 타운맵 이미지의 청록 바다, 단계형 녹지, 노란 연결선, 붉은 도시·푸른 자연 표식으로 다시 그렸다. 외부 이미지를 런타임에 가져오지 않는 자체 SVG 지형이다.

<a id="record-region_atlas-표시와-실제-이동의-경계"></a>
#### 표시와 실제 이동의 경계

- `src/region-atlas.ts`의 256×192 좌표는 지도 표시 전용이다. `PLACES.x/y`, MapId, 워프, 실제 이동 거리, 저장 좌표와 독립적이다.
- 원작의 도시 상대 위치와 지형을 참고하되 현재 `PLACES`와 패널 전용 대표 목적지만 조작 가능한 표식으로 표시한다. 목적지 수는 구현에 따라 늘어나므로 고정 수치를 완료 기준으로 사용하지 않는다. 원작의 모든 도시·도로를 구현했다는 의미가 아니다.
- 연결선의 양 끝은 현재 `TOUR_NEIGHBORS`에서 가져온다. 굴곡은 표시용이며 실제 도로 모양·번호·출구 방향을 의미하지 않는다. 물 위의 옅은 점선은 해안 방향 연결의 시각 표현이며 배 이용이나 파도타기 조건을 추가하지 않는다. 실제 경유·교통·조건은 [WORLD_ROUTES](../WORLD_ROUTES.md)와 현재 런타임을 따른다.
- 관동은 서부 태초·상록·회색, 중앙 노랑·무지개, 동부 보라, 남부 연분홍과 홍련섬을 배치했다. 성도는 서부 진청·담청 해안, 내륙 금빛·인주, 동부 황토·검은먹과 북쪽 분노의호수를 표현한다.
- 신오는 중앙 천관산과 북부 설원, 서부 운하·축복, 동부 장막·물가의 구도를 참고한다. 프로젝트의 `tour_lake`는 계속 **신오 호수**이며, 북서 호수 표현이 원작 예지호로의 이름·스토리 변경을 뜻하지 않는다.
- 하나는 BW2의 서남부 부채·모란만, 중앙 남부 구름 반도, 양쪽 수로, 서부 궐수·물풍경, 북부 쌍용과 동북부 기하를 참고했다. 현재 프로젝트의 단축 연결은 유지한다.

<a id="record-region_atlas-사용과-유지보수"></a>
#### 사용과 유지보수

후속 지리 복원 시 [맵·스토리 설계](../MAP_STORY_DESIGN.md)의 실제 연결 이행과 함께 반영한다. [웹 참고 자료](../reference/REFERENCE_RESEARCH.md)의 버전별 도시 위치를 사용하며 지도 그림의 변경만으로 원작 도로가 구현됐다고 기록하지 않는다.

지방 버튼으로 지도를 바꾼다. 도시 표식은 빨강, 자연 구역은 파랑, 방문은 ✓, 현재 위치는 밝은 테두리로 구분한다. 표식에 마우스를 올리거나 키보드 초점을 맞추면 전체 장소 이름을 표시한다. 표식을 누르는 기존 개발용 바로 이동, 목적지 선택, 길안내, 방문 수첩 기능을 유지한다.

도로·동굴은 도시 표식으로 가장하지 않고 방문 수첩의 별도 목록에 표시한다. 각 항목은 장소 이름·랜드마크·실제 MapId를 보여 주고, `랜드마크 길안내`는 현재 위치에서 실제 경로를 찾으며 `이 구간 바로 확인`은 개발용으로 해당 MapId의 안전 시작점에 이동한다. 두 기능은 파티·배지·포획·사건 완료를 지급하지 않는다.

현재 위치가 도시·자연이면 해당 방문 항목과 타운맵 표식에 `◎`를 표시하고, 도로·동굴이면 정확히 일치하는 MapId의 이동 구간 항목에 `◎ 현재 위치`를 표시한다. 지도 갱신 키에 현재 MapId를 포함해 개발용 이동 직후에도 이전 구간 표시가 남지 않게 한다.

새 대표 장소를 `PLACES`에 추가하면 해당 지방의 atlas 좌표도 추가한다. 기존 좌표를 이동 경로 생성에 재사용하지 않는다. 원작 도로망을 배경으로 추가할 때에는 플레이 가능한 연결로 오인시키지 않도록 구분한다.

봉신마을 `tour_celestic`은 통과 구간의 `PASSAGE_PLACES` 정의를 유지하면서 개발 패널의 신오 대표 목적지로 별도 노출한다. 신오 atlas의 `celestic` 좌표는 표시 전용이다. 영원시티와 봉신마을 사이 연결선은 `211번도로 서부 → 천관산 211 통과층 → 211번도로 동부` 보행 경로를 요약하며 두 도시 사이 직접 워프를 뜻하지 않는다.

<a id="record-region_atlas-참고-자료"></a>
#### 참고 자료

- 사용자 첨부 타운맵 이미지: 색감·픽셀 경계·도시 표식 참고.
- [HGSS 관동·성도 지도](https://commons.wikimedia.org/wiki/File:Map_Pok%C3%A9mon_HeartGold_%26_SoulSilver_FR.png): 지방 상대 지형과 도시 배치 참고.
- [플라티나 신오 지도 자료](https://www.neoseeker.com/pokemon-platinum/faqs/): 천관산·설원·해안 구도 참고.
- [하나 BW/BW2 지도](https://commons.wikimedia.org/wiki/File:Unova_Map.png): 강·반도와 BW2 도시 상대 위치 참고.

<a id="record-region_atlas-이번-확인-범위"></a>
#### 이번 확인 범위

- `npx.cmd tsc --noEmit` 통과; 43개 목적지 좌표 누락 없음.
- 격리 저장 `?qa=regional-atlas-20260910`에서 네 지방 지도 전환·표시 확인.
- 구름시티 표식 이동 후 현재 위치·방문 수 갱신, 구름→하나 1번도로→리조트데저트→뇌문 길안내 확인.
- 도시 전체 플레이·저장 복구·음향 QA는 이번 표시 변경의 검증 범위에 포함하지 않았다. 진행 중인 도시의 완료 기준은 유지한다.

---

<a id="record-auto-0001-story"></a>
## auto-0001-story

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0001-story.md`

<a id="record-auto-0001-story-auto-0001-story--스토리-문서-정합성"></a>
### auto-0001-story — 스토리 문서 정합성

- 회차: `auto-0001-story`
- 담당: Story & World Designer
- 일자: 2026-09-07
- 상태: 문서 개선·관련 테스트·빌드 완료. D3 전체 플레이 수용은 미완료 유지.
- 범위: 기존 코드와 확정 방향을 대조한 문서 수정. 코드·대사·맵·런타임 데이터·사용자 저장은 수정하지 않음. PROJECT_STATE.md와 다른 담당 작업은 조작하지 않음.

<a id="record-auto-0001-story-문제와-근거"></a>
#### 문제와 근거

<a id="record-auto-0001-story-1-현재-범위-요약이-첫-배지-시점에-머물러-있었음"></a>
##### 1. 현재 범위 요약이 첫 배지 시점에 머물러 있었음

[STORY.md](../STORY.md) 도입은 ‘최신 개발 요청으로 D2 첫 배지까지 구현’, 1절은 ‘S05 이후 지역…미구현’이라고 적었지만 뒤의 38절과 [DEVELOPMENT.md](../DEVELOPMENT.md) 47절은 통합 지도와 기존 D3를 설명한다. [gyms.ts](../../src/gyms.ts)의 네 관장, [unified-world.ts](../../src/unified-world.ts)의 체육관·연구원·선원 배치, [adventure-guide.ts](../../src/adventure-guide.ts)의 실제 목표를 확인했다.

도입·확정 수준 표·현재 플레이 순서를 네 체육관 → 자료 회수 → 전달 → 조사선 이용까지 정리했다. 첫 배지의 과거 플레이 검증 이력과 D3 전체 수용 미완료를 구분하고, 통합 이후 자유 이동에 옛 초안의 지역 잠금을 다시 적용하지 않도록 명시했다.

<a id="record-auto-0001-story-2-현재-자료승선의-진행-기록이-플래그-표에서-누락됨"></a>
##### 2. 현재 자료·승선의 진행 기록이 플래그 표에서 누락됨

[sinnoh-story.ts](../../src/sinnoh-story.ts)는 `observationCollected`를 자료 대화 시작에, `researchDelivered`를 최초 전달 대화 종료에, `ferryPass`를 승선 방향 선택에 기록한다. [save.ts](../../src/save.ts)는 세 boolean과 네 배지 → 회수 → 전달 → 승선의 의존 관계를 검사한다. 자료·승선권은 별도의 가방 아이템이 아니다.

STORY.md 6절에 기록 시점·재대화·불러오기·취소 의미를 추가했다. 새 53절에 네 관장과 도시별 인물/대화 이벤트, 박사 재방문이 필요 없는 공동조사 소개, 승선 이후 현재 본편의 끝점을 정리했다. 지도 방문만으로 이야기가 완료되는 것처럼 쓰지 않았다.

<a id="record-auto-0001-story-3-기존-단서와-장기-초안의-확정-수준을-함께-검토하기-어려웠음"></a>
##### 3. 기존 단서와 장기 초안의 확정 수준을 함께 검토하기 어려웠음

영원·연고 안내원과 장막 연구원은 3초 어긋남을 말하지만, 원인 규명·팀 아크·공명석·전설의 책임은 현재 이벤트에 없다. [초안 스토리](../개발용_초안스토리.md) 4·12절의 라이벌·적대 인물과 장기 제목은 제안이며, 7절의 SQ04는 본편 필수이고 SQ01~03·SQ05는 선택 흐름이다. 연결 초안의 ‘현재 6개 맵/전투 미구현’ 설명도 작성 당시 기준으로 남아 있다.

STORY.md 53~54절에서 현재 단서, 장기 인물·지방·전설·체육관·Pokémon Stories의 초안 범위를 연결했다. 네 배지 뒤 자료를 맡기는 이유와 전달 뒤 연구원 재대화는 동기·반응 보완 후보로만 남겼다. 새 인물·원인·보상·필수 수집은 확정하지 않았다. 8절도 확정 설계를 구현 전 기록할 수 있도록 하되 런타임 미반영 표시를 요구하는 문구로 정리했다.

<a id="record-auto-0001-story-수정-파일"></a>
#### 수정 파일

- [STORY.md](../STORY.md): 현재 요약·순서·플래그·설계 기록 규칙·회차 이력, 53~54절.
- [이 회차 보고](#record-auto-0001-story).
- 빌드 명령에 따른 `dist/` 산출물은 재생성됨. 소스 변경은 없음.

<a id="record-auto-0001-story-검증"></a>
#### 검증

| 항목 | 명령·방법 | 결과 |
| --- | --- | --- |
| 스토리·저장·통합 지도·목표 회귀 | `node node_modules/tsx/dist/cli.mjs --test tests/story-save.test.ts tests/sinnoh-front.test.ts tests/unified-world.test.ts tests/adventure-guide.test.ts` | **29/29 통과**, 실패·취소·건너뜀 0, 종료 코드 0 |
| 빌드 | `npm.cmd run build` | **통과**, TypeScript 및 Vite 프로덕션 빌드, 종료 코드 0 |
| 문서 링크·제목·문자 확인 | STORY.md와 회차 보고의 로컬 Markdown 링크 대상·앵커, 1~54절 번호, 대체문자·충돌 표식 검사 | **통과**: 문서 2개, 링크 35개, 앵커 2개, 연속 절 번호 54개. 누락 대상·대체문자·충돌 표식 없음 |
| 코드 보존 | `src/`, `scripts/`, `tests/`의 코드 파일 및 package.json/package-lock.json 총 130개 SHA-256 집계 전후 비교 | **동일**: `98F45C0B0CF99B05596657BB97B1808F76CED025CA719D622034A645C578A3A2` |

테스트는 현재 이벤트/저장 계약과 연결을 검증한다. 코드에 직접 이벤트를 호출하는 검사가 포함되므로 자연스러운 플레이의 대사 접근·분량·난이도·재미를 증명하지 않는다. 문서 전용 변경에 대해 기존 관련 테스트만 실행했으며 전체 테스트 묶음을 다시 실행한 것은 아니다.

<a id="record-auto-0001-story-실제-브라우저미검증-항목"></a>
#### 실제 브라우저·미검증 항목

- 이번 회차는 플레이 동작을 바꾸지 않았으므로 브라우저를 조작하지 않았다. 이번 회차의 QA URL·스크린샷은 없음.
- D3 전체 자연 진행, 네 관장 사이 육성·이동의 지루함, 자료 전달 동기의 설득력과 새 대사 제안의 화면 적합성은 미검증이다.
- 기존 브라우저 기록은 이번 회차의 재검증 성공으로 재사용하지 않았다.
- 연결 초안의 옛 구현 요약·지역 잠금과 DEVELOPMENT.md 일부 앞쪽의 D1/D2 시점 설명은 이번 범위에서 전면 개정하지 않았다. STORY.md에 현재 판단 기준을 명시했다.

<a id="record-auto-0001-story-다음-후보와-인계"></a>
#### 다음 후보와 인계

1. **Core 검토 후보:** 자료 전달 완료 뒤 장막 연구원이 같은 전달 부탁을 반복한다. `sinnoh-story.ts`의 `observation`은 네 배지만 검사하고 매번 동일 대사를 표시한다. STORY.md 54절의 접수 감사/조사 안내는 미확정 제안이다. 총괄이 채택·배정하면 기존 `researchDelivered`를 사용한 재대화 보완과 전달 전후·불러오기 검증을 검토한다. Story가 코드를 수정하거나 다음 담당을 호출하지 않는다.
2. **Story 후속 후보:** 초안 스토리/맵의 작성 당시 현재 구현 설명을 이력으로 표시하고 현행 문서로 연결하는 제한된 정리. 장 순서·32체육관·라이벌·전설 원인을 확정하거나 생성 DB를 수동 수정하지 않는다.
3. **QA 후속 후보:** 먼저 자연 진행의 첫 콜배지를 확인한 뒤, 배지 사이 소문 → 장막 자료 → 축복 전달 → 조사선으로 이어지는 D3 흐름을 고유 QA 저장에서 검토한다. 실제로 반복 이동·동기 공백이 드러난 지점을 기준으로 대사 보완의 우선순위를 정한다.

총괄은 이 보고와 최종 결과를 확인해 배정을 해제한다. 이번 담당은 회차 종료 후 다음 배정을 기다린다.

---

<a id="record-auto-0002-core"></a>
## auto-0002-core

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0002-core.md`

<a id="record-auto-0002-core-auto-0002-core--장막-관측-연구원-전달-완료-분기-및-ux-개선"></a>
### auto-0002-core — 장막 관측 연구원 전달 완료 분기 및 UX 개선

- 회차: `auto-0002-core`
- 담당: Core Developer
- 일자: 2026-09-07
- 상태: 코드 개선·테스트 추가·빌드 완료
- 범위: `sinnoh-story.ts`의 `observation` 이벤트에서 `researchDelivered` 상태에 따른 재대화 분기 추가.

<a id="record-auto-0002-core-문제와-근거"></a>
#### 문제와 근거

- **기존 문제**: 네 체육관 클리어 후 장막 관측 연구원에게 관측 자료를 받아 축복시티 연구 통로 안내원에게 전달(`researchDelivered=true`)했음에도 불구하고, 장막 관측 연구원에게 다시 말을 걸면 계속해서 "관측 자료를 맡길게요. 축복시티 연구 통로 안내원에게 전해 주세요"라는 최초 부탁 대사를 반복함.
- **해결**: `g.save.flags.researchDelivered`가 `true`인 경우 "자료를 무사히 전달해 주셨군요. 축복과 운하에서 조사가 시작되었어요." 및 다른 지방 탐방 격려 대사를 출력하도록 분기 추가.

<a id="record-auto-0002-core-수정-파일"></a>
#### 수정 파일

- `src/sinnoh-story.ts`: `observation` 핸들러에 `researchDelivered` 분기 추가.
- `tests/sinnoh-front.test.ts`: 자료 전달 완료 후 관측 연구원 재대화 시 정상적으로 전달 완료 안내를 표시하는지 검증하는 assertion 추가.

<a id="record-auto-0002-core-검증-결과"></a>
#### 검증 결과

- `npm.cmd test`: 296/296 통과 (회귀 없음, 신규 분기 검증 완료).
- `npm.cmd run build`: Vite 및 TypeScript 컴파일 성공.

---

<a id="record-auto-0003-map"></a>
## auto-0003-map

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0003-map.md`

<a id="record-auto-0003-map-auto-0003-map--리조트데저트-유적-암반과-북남-연결길"></a>
### auto-0003-map — 리조트데저트 유적 암반과 북남 연결길

- 회차: `auto-0003-map`
- 담당: Map & Content Designer
- 일자: 2026-09-07
- 상태: 배치 데이터 구현·전용 테스트 추가·빌드 및 회귀 통과 완료
- 범위: `src/explore-layouts.ts`에 하나 지방 `tour_desert`(리조트데저트) 레이아웃 추가, `TOWN_REVISION=22` 보정 및 검증.

<a id="record-auto-0003-map-문제와-근거"></a>
#### 문제와 근거

- **기존 문제**: 5대 단기 이동 경로(`SHORT_TOURS`) 중 영원숲, 천관산, 상록숲, 너도밤나무숲 4곳은 이미 고유 지형과 조사 구역이 배치되었으나, 하나 지방의 **리조트데저트(`tour_desert`)**만 고유 레이아웃(`TOUR_LAYOUTS`)이 없어 단순한 2x2 임시 블록만 배치되어 있었음.
- **해결**:
  - 유적 기둥 `(3,8,3,3)`, 모래 언덕 `(4,12,4,2)`, 외곽 석벽 `(14,6,3,3)`의 3개 고유 유적 조사 사물 배치.
  - 북쪽 뇌문시티 출구 `(10,2)`와 남쪽 구름시티 출구 `(10,16)`를 자연스럽게 잇고, 길 안내원 `(12,7)` 및 표지판에 안전하게 접근하는 경로(`paths`) 구성.
  - 저장 `TOWN_REVISION=22`로 이전 개정 세이브에서 새 장애물에 서 있던 플레이어 위치를 `(10,10)`으로 자동 안전 복구.

<a id="record-auto-0003-map-수정-파일"></a>
#### 수정 파일

- `src/explore-layouts.ts`: `tour_desert` 레이아웃 데이터 추가.
- `src/town.ts`: `TOWN_REVISION`을 21에서 22로 상향.
- `tests/explore-layouts.test.ts`: 레이아웃 총 11개, 조사 명칭 33개, 야외 사물 104개로 기대값 갱신.
- `tests/desert-layout.test.ts`: [신규] 북남 출구 연결, 사물 접근성, 세이브 마이그레이션 전용 테스트 추가.
- `docs/DEVELOPMENT.md`: 74절 추가.
- `docs/STORY.md`: 59절 추가.

<a id="record-auto-0003-map-검증-결과"></a>
#### 검증 결과

- `npm.cmd test`: **299/299 통과** (회귀 0, 실패 0).
- `npm.cmd run build`: Vite & TypeScript 프로덕션 빌드 성공.
- 다음 담당: **Art Director** (`auto-0004-art`)

---

<a id="record-auto-0004-art"></a>
## auto-0004-art

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0004-art.md`

<a id="record-auto-0004-art-auto-0004-art--리조트데저트-유적-암반-및-샌드스톤-비주얼-구현"></a>
### auto-0004-art — 리조트데저트 유적 암반 및 샌드스톤 비주얼 구현

- 회차: `auto-0004-art`
- 담당: Art Director
- 일자: 2026-09-07
- 상태: 그래픽 렌더링 함수 구현·전용 테스트 추가·빌드 및 회귀 검증 통과 완료
- 범위: `src/explore-art.ts`에 하나 지방 `tour_desert`(리조트데저트) 고유 암반 및 유적 샌드스톤 렌더링 함수 `paintDesertRuinsRock` 구현.

<a id="record-auto-0004-art-문제와-근거"></a>
#### 문제와 근거

- **기존 문제**: 직전 회차(`auto-0003-map`)에서 리조트데저트에 유적 사물(기둥·모래언덕·석벽)이 배치되었으나, 렌더링 시 천관산 동굴의 차가운 회색 암반 팔레트(`rock()`, `#5b6770`)가 그대로 그려져 사막 유적의 따뜻한 풍경과 어울리지 않았음.
- **해결**:
  - Nintendo DS (포켓몬 BW 고대의 성 / 리조트데저트) 감성에 맞춘 **따뜻한 사암(Sandstone)·테라코타 렌더러 `paintDesertRuinsRock`** 구현.
  - 상단 햇빛 하이라이트(`#e5d3a8`), 사암 기본체(`#c8ad7f`), 풍화된 테라코타 그림자(`#8a6b46`, `#6e5233`), 고대 석조 층위 몰탈선(`#f4e7c5`, `#7e5f3c`) 및 기둥 음각 홈 연출.
  - 리조트데저트의 기존 2x2 암반 및 3개 신규 유적 사물에 적용.

<a id="record-auto-0004-art-수정-파일"></a>
#### 수정 파일

- `src/explore-art.ts`: `paintDesertRuinsRock` 구현 및 `tour_desert` 렌더링 분기 적용.
- `tests/desert-art.test.ts`: [신규] 샌드스톤 팔레트 계층 및 바운딩 박스 렌더링 테스트 추가 (300번째 테스트).
- `docs/DEVELOPMENT.md`: 75절 추가.

<a id="record-auto-0004-art-검증-결과"></a>
#### 검증 결과

- `npm.cmd test`: **300/300 통과** (회귀 0, 신규 테스트 통과).
- `npm.cmd run build`: Vite & TypeScript 컴파일 통과.
- 다음 담당: **Gameplay Designer 겸 QA Lead** (`auto-0005-qa`)

---

<a id="record-auto-0005-art"></a>
## auto-0005-art

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0005-art.md`

<a id="record-auto-0005-art-auto-0005-art--리조트데저트-지면-재질과-지명-표식"></a>
### auto-0005-art — 리조트데저트 지면 재질과 지명 표식

- 회차: `auto-0005-art`
- 담당: Art Director
- 일자: 2026-09-07
- 상태: 완료

<a id="record-auto-0005-art-문제와-근거"></a>
#### 문제와 근거

`?qa=art-audit-20260907`의 실제 리조트데저트 화면에서 사암 유적 주변이 넓은 평면 베이지 지면으로 보였고, 범용 길 외곽의 연두 경계가 사막 색감과 충돌했다. 맵 이름도 큰 흰 메뉴 프레임으로 표시되어 필드 장면보다 HUD처럼 보였다.

<a id="record-auto-0005-art-변경"></a>
#### 변경

- `src/explore-materials.ts`: `desert`에만 고정된 모래 알갱이·바람 자국을 그려 지면을 타일 단위로 분절했다. 길은 다져진 모래, 밝은 마모선, 갈색 외곽선으로 변경했다.
- `src/renderer.ts`: 진입 지명은 기존 텍스트·페이드 시간은 유지하고, 작은 어두운 테두리와 사암색 안쪽 패널로 바꿨다.
- `tests/desert-art.test.ts`: 사막 지면·길에 사암 팔레트가 쓰이고 범용 연두 외곽선이 사용되지 않는지 검사했다.
- `docs/DEVELOPMENT.md`: 현재 시각 렌더링 사실을 76절에 기록했다.

맵 배치, 충돌, NPC, 이동, 스토리, 플래그, 저장 형식은 바꾸지 않았다. 기존 `auto-0004-art`의 사암 유적 렌더링 변경도 보존했다.

<a id="record-auto-0005-art-검증"></a>
#### 검증

- `npm.cmd test`: 302/302 통과.
- `npm.cmd run build`: TypeScript 및 Vite 프로덕션 빌드 통과.
- 실제 브라우저: Chrome `http://localhost:5173/?qa=art-0005-20260907`에서 개발 지도 → 하나 → 리조트데저트로 이동해 모래 지면·길·유적·축소 지명 표식을 확인했다. 콘솔 error/warning은 0건이었다.

<a id="record-auto-0005-art-다음-후보"></a>
#### 다음 후보

다른 Canvas 전용 유적/시설 사물도 실제 화면에서 DS 자산과의 재질 차이를 우선순위로 점검할 수 있다. 이번 회차에서는 리조트데저트로만 범위를 제한했다.

---

<a id="record-auto-0007-core"></a>
## auto-0007-core

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0007-core.md`

<a id="record-auto-0007-core-auto-0007-core--전투대화-확인-키-안내"></a>
### auto-0007-core — 전투·대화 확인 키 안내

날짜: 2026-09-07  
담당: Core Developer

<a id="record-auto-0007-core-문제와-선택"></a>
#### 문제와 선택

초기 전투·포획·회복 코드를 대조한 결과, 키보드 `A`는 WASD 왼쪽 이동으로 처리되지만 아래 화면의 일반 대화와 포획 연출은 `Z / A`를 확인 키처럼 표시했다. 포획 뒤 결과 대사를 넘기는 첫 경험에서 실제 입력과 안내가 충돌하는 재현 가능한 UX 문제다. 새 타입·PP·진화·상점·스토리 기능은 추가하지 않고 이 한 건만 수정했다.

<a id="record-auto-0007-core-변경"></a>
#### 변경

- `src/renderer.ts`: 일반 대화와 포획 진행 안내를 `Z / Enter`로 통일했다. 터치 확인은 기존대로다.
- `docs/GAMEPLAY.md`: 전투 대사와 몬스터볼 연출의 키보드/터치 설명을 실제 조작 계약에 맞췄다.
- `tests/game.test.ts`: Canvas 아래 화면이 새 문구를 렌더링하고 기존 `Z / A` 문구를 렌더링하지 않는 회귀를 추가했다.
- `docs/DEVELOPMENT.md`: 저장·전투 규칙 변경 없이 안내만 정합화한 사실을 77절에 기록했다.

저장 형식 version 1, 맵 개정 22, 파티·HP·도구·전투 결과·회복·스토리 플래그는 변경하지 않았다.

<a id="record-auto-0007-core-검증"></a>
#### 검증

- `npm.cmd test` — **303/303 통과**
- `npm.cmd run build` — 통과
- `git diff --check` — 통과
- 실제 브라우저: `http://localhost:5173/?qa=core-0007-20260907`
  - 격리 저장에서 개발 지도 이동 → 새잎마을 집 진입 → 엄마 대화를 열었다.
  - 아래 화면에 `Z / Enter 다음 이야기`가 표시되는 것을 확인했고, `Z`로 다음 대사로 진행했다.
  - 콘솔 경고·오류 0건.

<a id="record-auto-0007-core-남은-범위와-다음-후보"></a>
#### 남은 범위와 다음 후보

이번 확인은 일반 대화 표기와 Z 진행의 실제 화면 범위다. 포획 연출의 동일 문구는 Renderer의 같은 변경 경로와 자동 회귀로 확인했지만, 이 회차의 브라우저에서는 새 게임에서 포획까지 다시 진행하지 않았다. 다음 Core 후보는 새 게임 기준 첫 야생전에서 포획·회복의 연속 입력을 한 번의 격리 QA로 재확인하는 일이다.

---

<a id="record-auto-0008-art"></a>
## auto-0008-art

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0008-art.md`

<a id="record-auto-0008-art-auto-0008-art--축복시티-교류-광장-분수"></a>
### auto-0008-art — 축복시티 교류 광장 분수

- 회차: `auto-0008-art`
- 담당: Art Director
- 일자: 2026-09-07
- 상태: 코드·자동 검증 완료 / 실제 Chrome QA 환경 제한

<a id="record-auto-0008-art-선정-근거와-변경"></a>
#### 선정 근거와 변경

이전 실제 화면 검토에서 축복시티의 DS 건물·거리 타일과 달리 교류 광장 분수는 단순 Canvas 도형으로 읽혔다. 이번 회차는 전투 화면이 아니라 이 대표 도시 장면 하나로 범위를 제한했다.

`paintJubilifeFountain`은 같은 Canvas·16픽셀 격자를 유지하면서 짙은 계단식 외곽, 밝은 석조 수반, 독립된 청색 수면과 반사광, 중앙 기둥과 물기둥을 그린다. `tour_jubilife`의 기존 분수에만 적용했으며, 건물·길·맵 크기·충돌·조사·NPC·이야기·저장 데이터는 바꾸지 않았다.

<a id="record-auto-0008-art-검증"></a>
#### 검증

- `tests/desert-art.test.ts`에 분수의 수반·수면·반사광·중앙 캡 팔레트 회귀 검사를 추가했다.
- `npm.cmd test`: 304/304 통과.
- `npm.cmd run build`: TypeScript 및 Vite 빌드 통과.
- 실제 Chrome QA 예정 URL: `http://localhost:5173/?qa=art-0008-20260907`. CUA가 Chrome/IAB 브라우저를 반환하지 않아 이번 회차 안에서는 화면·콘솔 확인을 실행할 수 없었다. 자동 검증을 실제 화면 검증으로 대체하지 않는다.

<a id="record-auto-0008-art-다음-후보"></a>
#### 다음 후보

브라우저가 다시 연결되면 위 QA URL에서 축복시티 광장 진입 직후 분수와 거리 타일의 비율·깊이·콘솔 오류를 확인한다.

---

<a id="record-auto-0009-art"></a>
## auto-0009-art

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0009-art.md`

<a id="record-auto-0009-art-auto-0009-art--전투-경기장-층위"></a>
### auto-0009-art — 전투 경기장 층위

전투 배경의 평면 타원 플랫폼을 계단식 녹색 음영, 상단 하이라이트와 잔디 점무늬로 보완했다. 전투 상태·입력·저장 데이터는 변경하지 않았다.

- 전용 회귀: `battleArena`가 세 단계 플랫폼 색을 그리며 Engine 전투 상태를 바꾸지 않음을 검사.
- `npm.cmd test`: 305/305 통과. `npm.cmd run build`: 통과.
- 실제 QA URL: `http://localhost:5173/?qa=art-0009-20260907`.
- 브라우저 연결이 미가용이면 실제 화면·콘솔 검증은 미검증으로 기록한다.

---

<a id="record-auto-0010-core"></a>
## auto-0010-core

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0010-core.md`

<a id="record-auto-0010-core-auto-0010-core--제한적-타입-상성-전투-피드백"></a>
### auto-0010-core — 제한적 타입 상성 전투 피드백

2026-09-07 · 담당 Core Developer · 상태 완료

<a id="record-auto-0010-core-완료-범위"></a>
#### 완료 범위

- 현재 런타임에 등록된 공격 기술에 타입을 연결하고, 플레이어가 고른 공격의 피해에 지원되는 2배·0.5배 상성을 적용했다.
- 피해 힌트와 실제 턴이 같은 계산을 사용하며, 효과가 크거나 작은 경우 대사와 미리보기에 같은 피드백을 표시한다.
- 관장 반격은 기존 고정 피해를 유지한다. 이번 범위에서 반격 타입 상성까지 적용하면 기존의 광고 레벨·상처약 두 개 관장전 클리어 계약이 깨지는 회귀가 확인됐기 때문이다.
- 저장 구조, 파티 형식, 포획·회복·성장·스토리 플래그는 변경하지 않았다.

<a id="record-auto-0010-core-검증"></a>
#### 검증

- `npm.cmd test` — 306/306 통과.
- `npm.cmd run build` — 통과.
- `git diff --check` — 통과.
- `http://localhost:5173/?qa=core-type-0010-20260907` 격리 저장으로 실제 Canvas 게임 화면의 정상 로드를 확인했다. 현재 자연 조우는 비버니뿐이므로 물 타입 대상으로 상성 대사가 나타나는 자연 플레이 검증은 불가하다.

<a id="record-auto-0010-core-후속-범위"></a>
#### 후속 범위

타입별 야생 조우, 기술 습득, 전체 상성표와 관장 반격 재조정은 장기 전투 데이터·밸런스 결정이 필요한 별도 작업이다.

---

<a id="record-auto-0011-art"></a>
## auto-0011-art

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0011-art.md`

<a id="record-auto-0011-art-auto-0011-art--전투-기술-타입-칩"></a>
### auto-0011-art — 전투 기술 타입 칩

2026-09-07 · 담당 Art Director · 상태 자동 검증 완료 / 실제 화면 QA 미검증

<a id="record-auto-0011-art-문제와-수정"></a>
#### 문제와 수정

- 제한적 타입 상성이 전투 피해·미리보기에는 표시되지만, **싸운다**의 기술 버튼은 이름만 보여 공격 전에 타입을 읽을 수 없었다.
- 256×192 아래 화면의 기존 116×40 기술 버튼 안에서 기술명은 왼쪽, 타입은 오른쪽의 작은 테두리 칩으로 분리했다. 기존 선택 색·두 열 배치·터치 히트 영역은 유지했다.
- 모든 현재 런타임 기술이 같은 읽기 전용 `moveType()` 표를 사용한다. 이는 새 기술·상성 규칙·저장 데이터를 추가하지 않으며, 기존 종 타입 칩도 현재 표시되는 바위·땅·고스트·에스퍼·격투 색을 갖도록 보완한다.

<a id="record-auto-0011-art-검증"></a>
#### 검증

- `npx.cmd tsx --test tests/battle-move-types.test.ts` — 통과. 전기쇼크/울음소리 이름·타입 칩 팔레트와 기존 버튼 클릭의 턴 시작을 확인.
- `npm.cmd test` — 307/307 통과.
- `npm.cmd run build` — 통과.
- `git diff --check` — 통과.
- `http://localhost:5173/?qa=art-move-types-0011-20260907` — HTTP 200 응답 확인. 실제 Canvas 화면 QA는 CUA 브라우저 세션의 초기 상태 조회가 시간 초과되어 수행하지 못했다. 사용자 저장에는 접근하지 않았다.

<a id="record-auto-0011-art-다음-후보"></a>
#### 다음 후보

브라우저 자동화가 복구되면 격리 저장에서 전투의 **싸운다** 화면을 직접 캡처해 글자 간격·칩 대비·터치 선택을 시각적으로 재확인한다.

---

<a id="record-auto-0012-story"></a>
## auto-0012-story

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0012-story.md`

<a id="record-auto-0012-story-auto-0012-story--완료-배지-뒤의-도시-안내"></a>
### auto-0012-story — 완료 배지 뒤의 도시 안내

2026-09-07 · 담당 Story Editor · 상태 자동 검증 완료 / 실제 브라우저 QA 보류

<a id="record-auto-0012-story-문제와-수정"></a>
#### 문제와 수정

- 영원시티와 연고시티의 도시 안내원은 해당 체육관 배지를 이미 받은 저장에서도 각각 유채·멜리사에게 먼저 도전하라고 반복했다. 실제 목표 안내와 현재 배지 순서가 어긋나, 되돌아온 플레이어에게 완료한 진행을 다시 권하는 문제가 있었다.
- 기존 배지 배열만 읽어 영원에서는 포리스트배지 뒤 멜리사, 연고에서는 레릭배지 뒤 자두 체육관을 안내한다. 3초 단서, 관측 자료, 새 플래그·보상·지역·저장 형식은 바꾸지 않았다.
- 저장 복원 뒤에도 같은 완료 상태의 안내가 유지되는 회귀 검사를 추가했다.

<a id="record-auto-0012-story-검증"></a>
#### 검증

- `npx.cmd tsx --test tests/sinnoh-front.test.ts` — 영원·연고의 완료 배지 안내와 저장 복원 회귀 검사 통과 (11/11).
- `npm.cmd test` — 308/308 통과.
- `npm.cmd run build` — 통과.
- `git diff --check` — 통과.
- 이번 회차는 Story 대사·문서 정합성만 수정했다. 브라우저 실제 플레이 QA는 총괄 지시에 따라 수행하지 않았으며, 사용자 저장에는 접근하지 않았다.

<a id="record-auto-0012-story-다음-후보"></a>
#### 다음 후보

다음 Map 회차에서 현재 목표 안내와 실제 도보 경로의 일치 여부를 검토한다.

---

<a id="record-auto-0013-map"></a>
## auto-0013-map

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0013-map.md`

<a id="record-auto-0013-map-map--content--auto-0013-map"></a>
### Map / Content — auto-0013-map

- 일자: 2026-09-07
- 범위: 기존 탐방 지역의 출구 가독성. 새 지역·사건·보상·스토리 플래그는 추가하지 않았다.

<a id="record-auto-0013-map-문제와-변경"></a>
#### 문제와 변경

기존 길 안내원은 연결된 도시 이름만 나열했다. 실제 출구의 방향은 표지판에서만 다시 확인해야 했고, 특히 여러 연결과 지방 간 배편이 있는 도시에서 다음 도보 방향이 즉시 읽히지 않았다.

`Engine.event('tourGuide')`가 `getWorldOutdoors`의 현재 표지 데이터를 재사용하도록 변경했다. 안내원은 이제 `↑/→/↓/← 출구 → 목적지`와 기존 연결편 문구를 말한다. 표지는 실제 워프에서 만들어지므로 통합 지도에서 목적지가 대체되어도 안내와 워프가 같은 정보를 사용한다.

맵 ID, 워프 좌표, 충돌, NPC 배치, 조사 이벤트 ID, story flag, 저장 version 1 / `worldRevision: 22`는 변경하지 않았다. 사용자 저장은 고유 QA 저장만 대상으로 하려 했고 직접 수정하지 않았다.

<a id="record-auto-0013-map-검증"></a>
#### 검증

- `npx.cmd tsx --test tests/explore-world.test.ts` — 9/9 통과.
- `npm.cmd test` — 309/309 통과.
- `npm.cmd run build` — TypeScript 및 Vite 빌드 통과.
- `git diff --check` — 오류 없음 (기존 CRLF 경고만 출력).
- 새 회귀는 43개 야외 구역의 안내 대사 항목이 현재 표지의 실제 방향·목적지와 정확히 일치하는지 확인한다.

<a id="record-auto-0013-map-미검증"></a>
#### 미검증

실제 브라우저 QA는 `?qa=auto-0013-map-20260907`로 시도했으나 CUA 브라우저 세션이 30초 시간 초과 후 초기화되어 실행하지 못했다. 따라서 화면상 대사 줄바꿈·조작 확인은 미검증이며, 자동 검증 성공과 구분한다.

---

<a id="record-auto-0014-core"></a>
## auto-0014-core

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/auto-0014-core.md`

<a id="record-auto-0014-core-core--auto-0014-core"></a>
### Core — auto-0014-core

- 일자: 2026-09-07
- 범위: 야생전에서 실제 상대 종과 전투·포획 문구가 어긋나지 않도록 하는 기존 전투 데이터 사용 보완. 새 조우표·기술·저장 필드는 추가하지 않았다.

<a id="record-auto-0014-core-문제와-변경"></a>
#### 문제와 변경

`battleTurn`의 포획 성공·실패 대사는 비버니 이름으로 고정돼 있었고, 아래 전투 화면 제목도 같은 고정 이름을 사용했다. 현재 자연 조우는 비버니라 드러나지 않지만, 이미 런타임에 등록된 다른 종을 야생 상대로 연결하거나 검사할 때 실제 상대와 화면 문구가 달라졌다.

포획 결과와 전투 진행/선택 화면 제목이 `Battle.enemy.species`에서 얻는 종 이름을 사용하게 했다. 포획 프레임과 결과 카드가 이미 같은 `Pokemon` 객체를 사용하므로, 이제 세 표시가 한 상대를 가리킨다.

포획 확률·볼 소비·파티 정원·전투 순서·맵 ID·스토리 플래그·저장 `version: 1`은 변경하지 않았다. 현재 자연 조우 종도 비버니 그대로다.

<a id="record-auto-0014-core-검증"></a>
#### 검증

- `npx.cmd tsx --test tests/type-effectiveness.test.ts tests/battle-hints.test.ts tests/battle-presentation.test.ts` — 15/15 통과.
- 새 회귀는 꼬부기 야생 상대에서 아래 화면 제목과 성공 포획 대사가 모두 `꼬부기`를 표시하고 실제 그 종만 파티에 추가하는지 확인한다.
- `npm.cmd test` — 310/310 통과.
- `npm.cmd run build` — TypeScript 및 Vite 프로덕션 빌드 통과.
- `git diff --check` — 오류 없음. 기존 파일의 CRLF 경고만 출력됐다.

<a id="record-auto-0014-core-실제-플레이-qa와-남은-범위"></a>
#### 실제 플레이 QA와 남은 범위

- `?qa=auto-0014-core-20260907`로 격리 브라우저 QA를 시작하려 했으나, CUA 상태 조회가 30초 뒤 시간 초과와 세션 초기화로 끝났다. 실제 Canvas 화면 확인과 콘솔 확인은 미검증이며 사용자 저장에는 접근하지 않았다.
- 현재 자연 조우에는 비버니만 있으므로, 다른 야생 종의 자연 출현 설계·밸런스는 이번 Core 회차 범위가 아니다.

---

<a id="record-bootstrap-qa-20260907"></a>
## bootstrap-qa-20260907

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/bootstrap-qa-20260907.md`

<a id="record-bootstrap-qa-20260907-qa-회차-bootstrap-qa-20260907"></a>
### QA 회차: bootstrap-qa-20260907

2026-09-07 · Gameplay Designer / QA Lead · 이번 배정 완료

<a id="record-bootstrap-qa-20260907-변경과-원인"></a>
#### 변경과 원인

**P2: 도움말·터치 조작 이후 게임 키가 차단되는 포커스 문제 1건을 수정했다.**

새 게임에서 꼬부기를 받은 뒤 `조작 안내`를 클릭하면 포커스가 `#help`에 남았다. Z, X를 눌러도 첫 페이지에서 진행되지 않았다. 아래 화면의 다음 이야기 버튼을 터치하면 페이지는 바뀌지만 포커스는 계속 도움말에 남아, 이후 Z도 차단됐다. 위 게임 화면을 따로 클릭해야 벗어날 수 있었다.

`src/main.ts`의 keydown은 저장 폼·헤더·도움말에 대한 게임 키 소비를 막는다. 도움말 클릭은 게임 대화를 열면서 포커스를 옮기지 않았고, 아래 화면의 pointerdown은 preventDefault로 기본 포커스 이동까지 취소했다.

도움말을 열 때, 아래 화면 및 모바일 조작 버튼의 pointerdown 때 `field.focus({preventScroll:true})`를 적용했다. HTML 폼에서의 키 차단·키 해제·pointer capture는 유지했다. 새 스토리·지역·전투 규칙·세이브 필드 변경은 없다.

변경 파일:

- `src/main.ts`: 세 진입점의 게임 포커스 복귀.
- `DEVELOPMENT.md` 5절, `GAMEPLAY.md`: 실제 조작 계약 반영.
- `tests/gameplay-lead-test-output.txt`, `tests/gameplay-lead-build-output.txt`: 이번 자동 검사 출력.
- `tests/gameplay-lead-final-state.json`, `tests/gameplay-lead-console.json`, `tests/gameplay-lead-screenshots/help-keyboard-fixed.png`: 실제 브라우저 증거.
- 이 회차 보고서. `PROJECT_STATE.md`는 수정하지 않았다.

<a id="record-bootstrap-qa-20260907-직접-플레이와-재검증"></a>
#### 직접 플레이와 재검증

QA URL: `http://localhost:5173/?qa=gameplay-lead-20260907-01`

새 게임의 빈 파티에서 시작했다. 테스트 파일 가져오기·바로 이동·런타임 상태 주입 없이 게임 키와 터치를 사용했다. 아래 지도와 읽기 전용 `#field[data-state]`로 관찰했다. 사용자 기본 저장은 사용하지 않았다.

| 확인 범위 | 직접 관찰한 결과 |
| --- | --- |
| 출발 동선 | 방 → 1층 → 마을 → 연구소를 걸었다. 계단·문 전환과 목표 경로 갱신 정상. 연구소 테이블 우회와 박사 앞 도착 정상 |
| 파트너 선택 | 도입 대사 완료, 좌우 비교, 꼬부기 확인에서 X 취소 시 빈 파티 유지, 다시 선택하여 Lv.5 HP20 꼬부기 1회 수령 |
| 수정 전 재현 | 도움말 포커스에서 Z/X 무반응. 아래 화면 터치로만 page 0→1, 이후 Z도 무반응 |
| 수정 후 도움말 | 새로고침 후 도움말 클릭 시 Canvas에 포커스. Z로 문장 완성, Enter로 page 0→1, X로 남은 대사 종료 |
| 폼 입력 보호 | 저장 슬롯 선택 상태에서 Right는 슬롯을 변경하고 캐릭터 (7,4)는 유지 |
| 터치 뒤 키보드 | 슬롯 포커스 → M 지도 터치 → 키보드 M으로 닫기 → Right로 (7,4)→(8,4) 이동 |
| 모바일 버튼 | 600×900 뷰포트에서 저장 슬롯 포커스 → ▼ 버튼 → (17,9)→(17,10), 이후 키보드 Right → (18,10). 테스트 후 뷰포트 복원 |
| 출발 조건 | 도윤 대화 마지막까지 완료하여 departureCleared=true, 볼5·약2 지급. 서쪽 출구를 직접 통과 |
| 탐험·조우 | 서쪽길 흙길에서는 전투 없이 이동. 북쪽 풀밭 여섯 걸음으로 Lv.3 HP18 비버니 조우 |
| 첫 전투 | 꼬부기 몸통박치기 피해6·반격4 예고와 실제 결과 일치. 2턴 뒤 꼬부기 HP12/20, 상대 HP6/18 |
| 포획 | 성공률100% 표시에서 볼 사용. 볼5→4, HP6/18 비버니가 2번째 파티에 1회 등록. 포획 결과 → 정보 보기 정상 |
| 회복·메뉴 | 정보 화면 상처약 터치로 비버니 HP6→18, 약2→1. Z로 결과 진행, X로 정보→파티→메뉴→필드 복귀 |
| 저장 복원 | 빠른 저장·재접속 후 꼬부기 HP12/20, 비버니 HP18/18, 볼4·약1, 기존 수령·출발 플래그 유지 |

수정 후 도움말을 다시 열어 Z/Enter로 두 번째 페이지에 도착한 상태를 [화면](../../tests/gameplay-lead-screenshots/help-keyboard-fixed.png)과 [스냅샷](../../tests/gameplay-lead-final-state.json)에 보관했다. 이번 캡처 시 브라우저 경고·오류는 [0건](../../tests/gameplay-lead-console.json)이다. 수정 전 화면·중간 플레이는 이 작업의 도구 기록에 있으며, 별도 PNG로 저장하지 않았다.

<a id="record-bootstrap-qa-20260907-자동-검사"></a>
#### 자동 검사

- `npm.cmd test`: **254 passed, 0 failed**. 기존 이동·메뉴·저장·스토리·전투·포획·회복·지도 회귀 포함. [출력](../../tests/gameplay-lead-test-output.txt)
- `npm.cmd run build`: TypeScript 및 Vite 프로덕션 빌드 통과. [출력](../../tests/gameplay-lead-build-output.txt)
- 포커스 문제는 기존 Engine 단위 테스트 밖의 DOM 이벤트 연결이므로 위 실제 브라우저 재현·재검증으로 확인했다. 기존 254개가 포커스 버그 자체를 검출한다고 주장하지 않는다.

<a id="record-bootstrap-qa-20260907-게임성-판단과-남은-범위"></a>
#### 게임성 판단과 남은 범위

초반 목표 지도는 실제 계단·출구·박사·도윤 앞까지 이어져 길 찾기를 돕는다. 첫 야생전의 예상 피해와 확정 포획 안내는 학습에 유용하며, 이번 2턴 포획에서 진행 막힘은 없었다. 포획 친구 정보에서 회복하고 탐험으로 돌아가는 흐름도 정상이다.

전투 한 턴에 공격 선언·피해·반격의 세 페이지를 넘겼다. 반복 육성에서는 입력 부담이 생길 가능성이 있으나, 이번 한 전투만으로 속도나 난이도를 바꿀 근거는 부족하여 규칙을 변경하지 않았다.

화면 크기 복원 후 일부 빠른 이동 입력에서 예상 걸음보다 적게 진행되는 현상이 있었다. 도구 관찰 중 움직임이 진행 중인 상태도 확인했고, 현재 코드는 이동 중 짧은 추가 입력을 버리므로 실제 사용자 조작 문제인지 브라우저 프레임/도구 타이밍 영향인지 분리하지 못했다. 추가 버그 수정 완료로 계산하지 않는다. 초기 새로고침 직후 dataset이 아직 없는 상태를 읽은 관찰 오류 1회는 로딩 후 다시 읽어 해결했다.

이번 회차에서 센터·길 안내원의 회복/보충, 관장전, 레벨업·교대·전멸은 직접 재검증하지 않았다. 131개 맵 전수 플레이, 모바일 실제 기기의 멀티터치/길게 누르기, 전투 장기 반복과 전체 캠페인 난이도도 미검증이다. 이전 D3 전체 수용 미완료 상태를 유지한다.

다음 후보(구현 승인 또는 완료 아님):

1. **QA:** 현재 자연 진행 QA 저장에서 첫 콜배지까지 육성·회복을 이어가며 필요한 전투 수, 연속 대사 입력량, 실제 난이도와 안내의 충분성을 확인한다.
2. **QA/Core:** 안정된 프레임 환경에서 짧은 연속 방향 입력·방향 전환·Shift 달리기·포커스 이탈을 재현하여 입력 누락과 의도된 한 칸 이동 규칙을 구분한다.

이번 배정만 종료한다. 다음 회차·담당 호출은 총괄이 결정한다.

---

<a id="record-direct-20260907-art-01"></a>
## direct-20260907-art-01

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/direct-20260907-art-01.md`

<a id="record-direct-20260907-art-01-art--나무-군락과-숲-색감"></a>
### Art — 나무 군락과 숲 색감

- 요청: 사용자의 직접 요청 “포켓몬 게임 같이 수정 및 구현”, 2026-09-07.
- 기준: 승인된 Nintendo DS DP/플라티나풍. Art 영역의 기존 표현만 개선.
- 실행 전 다른 담당 네 작업은 idle이었다. 총괄에 직접 작업 알림을 보냈으나 총괄 작업이 archived라 전달되지 않았다. PROJECT_STATE.md·자동화·다른 담당의 파일은 수정하지 않았다.

<a id="record-direct-20260907-art-01-문제와-변경"></a>
#### 문제와 변경

실제 영원숲 화면에서 군락의 잎 타일이 사각형으로 잘리고, 나무가 배경에 합쳐져 인물이 항상 위로 그려졌다. 밝은 청록 잔디와 어두운 숲 경계의 대비도 강했다.

1. 기존 Sandgem 플라티나 자료의 수관·줄기를 32×48 원래 크기로 클리핑한다. 군락은 완전한 나무의 겹침으로 구성하며 홀수 높이에서도 나무 아래를 자르지 않는다. 지면 덮개와 줄기 그림자로 바닥 범위를 표현한다.
2. 나무 발 기준으로 인물·건물·표지와 함께 정렬한다. 수관은 북쪽으로 최대 16px 올라가며 좌우·남쪽은 원래 군락 안에 그린다. 숲 테마의 지면과 흙길 경계 색을 맞췄다.

대상은 영원숲·영원시티·상록시티·연분홍시티의 기존 군락 7곳과 forest 테마 지면이다. 변경 파일: `src/explore-tree-art.ts`, `src/explore-art.ts`, `src/explore-materials.ts`, `src/renderer.ts`, `public/assets/sources.json`, `tests/explore-tree-art.test.ts`, `DEVELOPMENT.md`.

맵·길·충돌·워프·조우·NPC·대사·플래그·보상·저장 구조는 유지했다. version 1 / worldRevision 18. 새 이미지 다운로드나 게임 시스템 추가는 없다.

<a id="record-direct-20260907-art-01-검증"></a>
#### 검증

- `npm.cmd test`: **271/271 통과**, 실패 0. [실행 출력](../../tests/art-groves-test-output.txt).
- 추가 검사 2개: 전체 군락의 그림 범위·정수 픽셀·홀수 크기·배치 원본 보존, 실제 Renderer의 북/남 인물과 나무 그리기 순서·저장 무변경.
- 기존 영원숲 길·충돌·조우·워프·이전 저장 및 게임 전체 회귀 포함.
- `npm.cmd run build`: TypeScript·Vite 성공. [빌드 출력](../../tests/art-groves-build-output.txt).
- `sources.json` JSON 파싱 확인.

실제 QA URL: `http://localhost:5173/?qa=direct-20260907-art-01`. 공개 지도 도구로 빈 파티의 시각 검증 상태를 준비했으며 기본 사용자 저장은 건드리지 않았다.

- 영원숲 `(11,10)`에서 아래 나무 충돌과 기존 “풀밭 옆 나무” 조사, 수관 뒤쪽 표현 확인.
- `(12,11)` 좁은 옆 통로, 서쪽 `(9,10)`부터 남쪽 `(9,15)`까지 도보 이동, `(11,15)`에서 나무 앞에 인물이 보이는 것 확인.
- 남쪽 출구로 축복시티 `(14,3)` 이동 후 영원숲 `(10,15)` 복귀. 빠른 저장·재접속 후 위치·걸음·진행 유지 확인.
- 영원시티에서 `(14,11)`→`(11,11)` 보행과 정원·센터·캐릭터 비율 확인. 상록·연분홍은 개발 이동 후 보이는 군락 일부와 홀수 높이 하단 표현을 확인했으며 도시 전체 답사는 하지 않았다.
- [관찰 상태](../../tests/art-groves-playthrough.json), [화면](../../tests/art-groves-screenshots), [브라우저 경고·오류 0건](../../tests/art-groves-console.json).

도구 제한: 한 번의 브라우저 호출 안에서 연속 보행과 DOM 위치 대기를 묶으면 갱신이 늦어져 두 번 대기 시간이 초과되었다. 이후 입력을 나누고 각 완료 좌표를 직접 확인해 위 경로를 검증했다. 이것을 게임 자동 플레이 완료로 간주하지 않았다.

<a id="record-direct-20260907-art-01-남은-범위와-다음-후보"></a>
#### 남은 범위와 다음 후보

- 이번 실제 플레이는 나무 주변 시각·이동 검증이다. 야생전·포획은 자동 회귀 범위이며 실제 전투 재검증, 북쪽 출구 왕복, D3 전체 수용은 수행하지 않았다.
- 맵 테두리의 연속 숲 타일은 여전히 평평한 경계다. 다음 Art 후보는 출구를 가리지 않는 테두리 수관·그림자 보완이다.
- 축복시티 확인 중 단색 아스팔트와 반복 보도 타일이 넓게 드러났다. 다음 후보로 도로 경계·재질의 DS 일관성을 검토한다.
- UI·캐릭터·전투 연출 전체를 수정하거나 그래픽 최종 승인으로 처리하지 않았다.

---

<a id="record-direct-20260907-art-02"></a>
## direct-20260907-art-02

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/direct-20260907-art-02.md`

<a id="record-direct-20260907-art-02-art--도시-보도와-연석-연결"></a>
### Art — 도시 보도와 연석 연결

- 사용자 직접 요청: “포켓몬 게임 같이 구현”, 2026-09-07.
- 회차: direct-20260907-art-02. 승인된 DS DP/플라티나풍의 비주얼만 개선한다.
- Map의 천관산 회차와 충돌하지 않도록 임시 복사본에서 준비했다. Map의 종료 알림 후 공용에 반영했다. Core 전투 변경이 동시 진행 중인 것을 전체 검사에서 확인해 담당자와 조정한 뒤 안정된 소스에서 검사를 다시 실행했다.

<a id="record-direct-20260907-art-02-문제와-변경"></a>
#### 문제와 변경

축복시티 화면에서 도로 가장자리의 단일 선과 직각 모서리가 보도·건물 원본의 명암에 비해 평평하게 보였다. 기존 플라티나 참고 이미지의 평평한 아스팔트 색을 유지하면서 경계의 입체감을 보완했다.

- 도시 도로에 네 단계 명암의 연석을 그리고 교차로의 안쪽 모서리와 바깥쪽 모서리를 정수 픽셀로 연결한다. 타일 내부에 경계선이 반복되지 않는다.
- 기존 보도 원본을 도로 아래까지 이어 깔고 보도 끝의 얇은 마감선을 추가한다. 횡단보도 끝은 낮은 연석으로 연결하며 인접 보도에는 기존 원본의 배수구 덮개를 사용한다.
- src/city-street-art.ts에 그림 처리를 두고 src/explore-jubilife.ts의 기존 도로 좌표·보행 가능 타일 선택은 유지한다. 원본 샘플과 가공 내용은 public/assets/sources.json에 기록한다.

적용 대상은 urban 스타일 8곳: 축복·장막·노랑·금빛·구름·모란만·뇌문·궐수시티. 맵 크기·길·충돌·건물·출입구·NPC·대사·보상·저장 형식을 바꾸지 않는다. 배수구와 연석은 평면 그림이며 새 충돌 사물이 아니다.

<a id="record-direct-20260907-art-02-검증-기록"></a>
#### 검증 기록

임시 작업본: TypeScript/Vite 빌드 성공, 신규 자동 검사 2개 통과. 실제 브라우저에서 축복시티 보도·연석·교차로 화면과 포켓몬센터 출입을 확인했다.

공용 작업본 검증:

- `npm.cmd test`: **282/282 통과**, 실패 0. [전체 출력](../../tests/city-street-test-output.txt). 신규 도시 검사 2개와 이전 나무·맵·전투·저장 회귀를 포함한다.
- 최초 실행은 진행 중인 Core 전투 변경에 관련된 기존 검사 3개가 실패했다. [최초 출력](../../tests/city-street-first-run-output.txt)을 보존했다. Core가 해당 기대값을 보강하고 소스 안정화를 알린 뒤 위 전체 검사를 다시 실행해 통과했다. Art가 전투 소스를 수정한 것은 아니다.
- `npm.cmd run build`: TypeScript/Vite 성공. [빌드 출력](../../tests/city-street-build-output.txt).
- `sources.json` 파싱과 빌드된 매니페스트의 도시 자료 포함 확인.

실제 브라우저 URL: `http://localhost:5173/?qa=direct-20260907-art-02`. [공개 저장 생성기](../../scripts/city-street-fixtures.ts)의 빈 파티 시각 QA 저장을 UI로 가져왔고 기본 사용자 저장은 수정하지 않았다. 현재 version 1 / worldRevision 19.

- 축복시티 교차로 `(14,11)`에서 위 `(14,10)` 횡단보도에 진입해 서쪽 `(11,10)` 보도로 직접 걸었다. 연석이 통행 장애물을 만들지 않는 것을 확인했다.
- 축복센터 앞 `(8,9)`에서 위로 진입, 센터 `(8,10)` 도착 후 아래 세 걸음으로 도시 `(8,9)` 복귀를 확인했다.
- 장막시티 `(14,11)` 교차로에서 연석·보도·배수구·건물과 인물의 비율을 확인하고 `(15,11)`로 걸었다.
- 빠른 저장 후 같은 QA URL로 재접속하여 위치·방향·걸음 1·방문·진행·파티·도구·소지금·배지·저장 개정 보존을 확인했다. 준비된 빈 파티 저장이므로 파티 수령/전투 진행의 실검증은 아니다.
- [원본 관찰 상태 9건](../../tests/city-street-playthrough.json), [전후 화면 및 센터·장막 화면 4장](../../tests/city-street-screenshots).

실화면 검증은 축복·장막 두 도시에 한정한다. 나머지 6개 도시의 도로 범위는 자동 검사로 확인했으며 도시 전체 답사·전투·모든 건물 출입을 이번 회차에서 실제로 재검증하지 않았다.

<a id="record-direct-20260907-art-02-남은-범위"></a>
#### 남은 범위

도시 전체의 건물·캐릭터·UI를 전면 개편하지 않았다. 이번 회차는 도로 표현이며 D3 전체 진행 수용이나 그래픽 최종 승인을 뜻하지 않는다. 다음 후보는 기존 숲 테두리의 수관과 그림자 연결이다.


---

<a id="record-direct-20260907-art-03"></a>
## direct-20260907-art-03

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/direct-20260907-art-03.md`

<a id="record-direct-20260907-art-03-art--숲-테두리의-완전한-수관과-깊이"></a>
### Art — 숲 테두리의 완전한 수관과 깊이

- 회차: direct-20260907-art-03, 2026-09-07 사용자 직접 요청.
- 범위: 기존 영원숲·상록숲·너도밤나무숲 테두리의 DS 비주얼.
- 순서: Map의 상록숲 회차와 겹치지 않도록 임시 복사본/5176에서 준비. Map 종료 알림 후 최신 공용 파일에 최소 패치를 반영했다. Core는 Art 종료 후 진행하기로 조정했다.

<a id="record-direct-20260907-art-03-문제와-변경"></a>
#### 문제와 변경

실제 영원숲 화면에서 내부 군락은 완전한 나무인데 테두리는 16px 잎 조각이 반복되어 화면 아래·옆 경계에서 나무가 잘렸다.

`forest-border-art.ts`는 기존에 막힌 테두리 안에 32×48 원래 크기의 나무를 배치한다. `explore-tree-art.ts`의 기존 Sandgem 나무 원본·계단형 윤곽·그림자를 재사용한다. 북쪽·남쪽의 연속 구간이 홀수 길이면 마지막 나무를 겹치고 출구에서는 끊는다. 줄기가 차지하는 2×2칸은 반드시 기존 테두리 충돌 안에 있으며 북쪽으로 올라간 수관도 워프 타일과 겹치지 않는다.

`explore-art.ts`의 세 숲 테두리만 낮은 녹색 바닥으로 바꾸고, `Renderer.world()`에서 새 나무를 기존 발 위치 정렬에 넣는다. 남쪽 수관은 북쪽 인물 앞에, 북쪽 테두리는 아래 인물 뒤에 보인다. 기존 내부 군락·새 상록숲 배치·길·출구·충돌·NPC·조우·대사·저장 형식은 변경하지 않는다.

<a id="record-direct-20260907-art-03-검증"></a>
#### 검증

임시 복사본: 신규 검사 2개와 기존 군락 검사 2개 통과, TypeScript/Vite 빌드 성공. 임시 폴더의 node_modules 연결 경로에서 Vite 기본 config 번들 캐시 생성이 실패해 임시 서버/빌드만 `--configLoader runner`로 실행했다. 공용 설정은 변경하지 않는다.

공용 작업본 결과:

- `npm.cmd test` **287/287 통과**, 실패 0. [전체 출력](../../tests/forest-border-test-output.txt).
- `npm.cmd run build` TypeScript/Vite 성공. [빌드 출력](../../tests/forest-border-build-output.txt).
- [테두리 검사](../../tests/forest-border-art.test.ts) 2개: 적용 외 맵 무변경, 모든 숲 나무의 범위·출구 제외·원본 맵 보존, 실제 Renderer 발 위치 정렬·저장 보존.
- [기존 군락 검사](../../tests/explore-tree-art.test.ts)는 테두리와 내부 나무가 같은 원본을 쓰므로 특정 군락의 좌표를 구분해 기존 앞뒤 순서 검증을 유지했다.
- 기존 상록숲/영원숲/천관산 배치·길·조사·충돌·저장·도시·전투 회귀 포함. 출처 매니페스트 JSON과 배포 빌드의 매니페스트 포함 확인.

실제 QA: `http://localhost:5173/?qa=direct-20260907-art-03`. [생성기](../../scripts/forest-border-fixtures.ts)의 빈 파티 저장을 공개 가져오기 UI로 적용했다. 사용자 기본 저장은 변경하지 않았다. 저장 version 1 / worldRevision 20을 유지했다.

1. 영원숲 `(10,15)` 출구 앞에서 `(9,15)`로 이동, 남쪽 수관 앞뒤 표현과 아래 방향 기존 충돌을 확인했다. `(10,15)`로 돌아가 남쪽 출구를 통해 축복시티 `(14,3)`에 갔다가 숲 `(10,15)`로 복귀했다.
2. 영원숲 북쪽 `(10,3)`에서 완전한 나무와 출구 틈을 확인하고 영원시티 `(14,31)`와 왕복했다.
3. 너도밤나무숲 동쪽 `(17,9)`에서 수관이 출구·표지를 가리지 않는 것을 확인하고 고동마을 `(2,12)`과 왕복했다.
4. 새 상록숲 남쪽 `(10,15)`에서 내부 군락·길·안내판과 테두리의 연결을 확인하고 `(10,14)`로 걸었다. 빠른 저장 후 재접속해 위치·방향·걸음·방문·플래그·파티·도구·배지·소지금·저장 개정 보존을 확인했다.

[관찰 상태 14건](../../tests/forest-border-playthrough.json), [변경 전과 북/남/동쪽·상록숲 화면 6장](../../tests/forest-border-screenshots). 최초 저장 재접속 시 개발 서버 연결이 거절되어 Vite를 다시 실행한 뒤 같은 QA URL로 복원 검증을 완료했다. 임시 미리보기 서버 5176은 종료했다. 공용 서버 5173은 다음 담당의 검증을 위해 실행 상태로 인계한다.

<a id="record-direct-20260907-art-03-남은-범위"></a>
#### 남은 범위

세 숲의 기존 테두리에 한정한 시각 개선이며 도시 테두리·다른 테마는 기존 표현을 유지한다. 전체 캠페인 수용·모든 지역 그래픽 최종 승인으로 판단하지 않는다.

이번 실제 플레이는 빈 파티의 시각·출구 검증이다. 세 숲 전체 답사·야생전·상록숲 양쪽 출구 왕복·너도밤나무숲 북쪽 왕복은 이번 Art 실검증 범위에 포함하지 않았다. 모든 출구의 그림 겹침과 기존 동작은 자동 회귀로 확인했다.

다음 후보: 숲 흙길의 모서리와 풀밭 경계 연결을 실제 화면에서 검토한다.


---

<a id="record-lead-0001"></a>
## lead-0001

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0001.md`

<a id="record-lead-0001-lead-0001--동료의-전투-규칙과-길-안내"></a>
### lead-0001 · 동료의 전투 규칙과 길 안내

2026-09-07. 상태: 완료.

<a id="record-lead-0001-검토와-선정"></a>
#### 검토와 선정

| 역할 | 검토 결과 | 총괄 판단 |
| --- | --- | --- |
| Story | 현재 요약의 진화/조우 미구현 표기가 최신 구현과 충돌. 정비원 길 안내가 연습전 분기에 가려짐 | 문서 정정 및 길 안내 복구 |
| Map / Content | 원본 TOUR_MAPS에서 조우 지형 누락 추정, 통로 반복 구조 | 누락 추정은 반려: 실제 getMap의 UNIFIED_MAPS에 다섯 조우 지형이 이미 연결됨. 통로 변형은 다음 후보 |
| Core | 발버둥이 고스트에 피해를 주면서 무효라고 표시. 반동 기절 후 추가 상대 공격 | 하나의 전투 판정 정합성 작업으로 선정 |
| Art / UI | 포켓치 저대비 작은 글자. 외부 개발 패널 시각 비중 | 게임 안 포켓치만 선정. 외부 패널은 사용자 제외 범위 |

<a id="record-lead-0001-수정-범위"></a>
#### 수정 범위

- Core: battle.ts, battle-hints.ts, struggle-resolution.test.ts.
- Map: road-trainers.ts, dialogues.ts, road-trainer-guidance.test.ts.
- Story: STORY.md만 수정. 코드 수정 없음.
- Art: renderer.ts의 poketch만 수정. 자동 줄바꿈은 통합 검토 후 제거하고 기존 고정 배치에 대비·본문9px·조작안내8px만 반영했다. 전용 테스트 파일은 추가하지 않았다.
- 총괄: 운영 기록·DEVELOPMENT.md·QA fixture, 통합 및 직접 Gameplay 검증.

기존 미커밋 변경과 사용자 저장은 보존했다. 이전 운영 문서의 자동화는 앱에 없다는 응답을 확인했고 현재 대화에 새 heartbeat `qa`를 ACTIVE로 생성했다. QA 담당 작업 ID는 제어 도구에서 찾을 수 없어 종료 성공을 확인하지 못했다. 새 운영에서는 QA 담당 신규 배정을 중지한다.

<a id="record-lead-0001-실제-gameplay-확인"></a>
#### 실제 Gameplay 확인

고유 저장 `http://localhost:5173/?qa=lead-0001-20260907`. [fixture 생성기](../../scripts/lead-fixtures.ts)가 만든 parseSave 검증 완료 파일을 실제 파일 불러오기 UI로 가져왔다. 이후 조작은 키보드 입력으로 수행하고 DOM에 공개된 관찰 상태를 읽었다.

- 멜리사에게 도전하여 캐이시 HP1의 발버둥을 사용했다. 흔들풍손에게 10 피해 → 반동1 → 캐이시 기절 → 파이리 출전의 다섯 페이지를 확인했다. 무효 문구·상대 추가 공격이 없고 파이리는 HP19를 유지했다.
- 도로 정비원은 배틀 선택 전에 서쪽 출구→축복시티, 축복시티 남쪽 출구→암반굴→무쇠시티를 안내한다. 실제 표시된 대사와 도움말을 읽고 배틀을 거절했을 때 전투 없음·돈0·도구0·플래그 불변을 확인했다.
- 긴 지명 `무지개시티 · 주민의 집 · 작업방`에서 HP1의 회복 목표·목적지·다음 구역·파티 상태를 실제 화면으로 확인했다. 한 화면 안에 겹치지 않으며 수정한 대비·본문 크기가 적용됐다.
- Art 별도 QA URL에서도 전후 화면 확인. 총괄 탭은 별개이며 사용자 저장을 건드리지 않았다.

<a id="record-lead-0001-최종-검증"></a>
#### 최종 검증

- `npm.cmd test`: **380/380 통과**, 실패·건너뛰기0. [결과](../../tests/lead-0001-test-output.txt).
- `npm.cmd run build`: TypeScript 및 Vite 프로덕션 빌드 통과.
- 신규 회귀: [발버둥9건](../../tests/struggle-resolution.test.ts), [길 안내3건](../../tests/road-trainer-guidance.test.ts).
- 실제 Gameplay는 위 고유 QA 저장에서 총괄이 수행했다. 전체 캠페인 수용이나 전체 도시 검수가 아니다.

검토 중 원본 지도만 읽은 조우 누락 추정과 옛 북쪽 방향 확인은 실제 통합 맵으로 반박했다. 다음 회차도 `Engine.map`→`getMap`→`UNIFIED_MAPS` 경로를 우선한다.

<a id="record-lead-0001-다음-후보"></a>
#### 다음 후보

통로별 탐험 구조 차이와 이동/교대 판단을 더 잘 보여 주는 기술 선택 정보. 미결정 스토리나 전체 캠페인을 이 회차의 완료 범위로 확대하지 않는다.

---

<a id="record-lead-0002"></a>
## lead-0002

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0002.md`

<a id="record-lead-0002-lead-0002--기술-비교와-서식-단서"></a>
### lead-0002 — 기술 비교와 서식 단서

2026-09-07 완료. Story Meitner, Map Banach, Core Cicero, Art Laplace가 먼저 독립 검토했다. QA 에이전트 신규 배정 없이 총괄이 Gameplay를 확인했다.

<a id="record-lead-0002-선정-및-구현"></a>
#### 선정 및 구현

- Core: move-school.ts / move-description.ts / move-school-description.test.ts. 고정·레벨·무게 피해를 변화 기술로 오표시하던 문제를 실제 규칙 기반 설명으로 수정. 기존 기술과 새 기술을 3페이지로 비교한 후 확정하며 취소·오래된 콜백·중복 확인을 방어한다.
- Map: journey-services.ts / encounter-guidance.ts / encounter-guidance.test.ts. 실제 풀에서 흔한 두 종·드문 한 종·레벨 안내. 조우 없는 통로는 이동·공터 탐험을 안내한다.
- Story의 성장 화면에서 학습으로 바로 연결하는 후보, Art의 다음 성장 표시 후보는 다음 회차로 남겼다. 이번에는 기존 두 슬롯·저장·출현 데이터와 본편을 유지했다.
- 총괄: 두 기존 테스트의 문구/교체 단계 기대값을 갱신하고 fixture와 문서를 작성. STORY 현재 요약의 무쇠 방향을 남쪽 암반굴로 바로잡고 과거 이력은 유지했다.

<a id="record-lead-0002-검증"></a>
#### 검증

- npm.cmd test: **387/387 통과**, 실패·건너뛰기 0. tests/lead-0002-test-output.txt.
- npm.cmd run build: TypeScript와 Vite 빌드 통과 (61 modules).
- git diff --check: 통과.
- 최초 통합 검사 385/387: 기존 표지 정적 문구 기대값과 즉시 기술 교체 선택지 기대값이 이번 변경과 불일치. 새 안내/비교 확정 흐름으로 갱신 후 전체 통과했다. 이전부터 있던 실패로 분류하지 않는다.

<a id="record-lead-0002-총괄-실제-gameplay"></a>
#### 총괄 실제 Gameplay

`http://localhost:5173/?qa=lead0002-20260907`. scripts/lead-0002-fixtures.ts로 parseSave 검증한 JSON을 실제 파일 선택/불러오기 UI로 가져왔다. 이후 키보드 입력과 공개된 field data-state 관찰만 사용했다.

- Lv.17 리자드: X→포켓몬→정보→기술 배우기→다음 페이지→용의분노. 고정 피해 40 설명을 화면에서 확인.
- 할퀴기와 비교 후 취소: 할퀴기/울음소리 유지. 다시 비교하여 현재/새 기술의 3줄 화면을 확인하고 확정: 용의분노/울음소리로 변경. 실제 재접속 뒤에도 유지.
- 축복–무쇠 암반굴 표지: 꼬마돌·주뱃, 드문 코코파스, Lv.7~10 확인. 돈/도구/진행 보상 변화 없음.
- 연고–장막 연결도로 표지: 길과 북쪽 공터 안내 확인. 잡을 포켓몬이 있다는 잘못된 약속 없음.
- 스크린샷은 대화 내 인라인으로 검수했고 별도 PNG 파일로 저장하지 않았다. 전 기술의 효과 설명은 자동 검사 대상이며 브라우저에서는 용의분노를 직접 확인했다. 전체 캠페인·모든 도시 수용은 아님.

사용자 실제 저장과 기존 미커밋 작업은 보존했다. 다음 후보는 성장 직후 기술 학습 연결, 기존 통로의 탐험 구조 차별화다.

---

<a id="record-lead-0003"></a>
## lead-0003

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0003.md`

<a id="record-lead-0003-lead-0003--성장-뒤-바로-배우기와-통로-탐험-확장"></a>
### lead-0003 — 성장 뒤 바로 배우기와 통로 탐험 확장

2026-09-07 완료. 시작 규칙·문서·Git 상태 확인 후 Story Avicenna, Map Bernoulli, Core Dirac, Art Sagan의 독립 검토를 취합했다. QA 에이전트는 신규 배정하지 않았다.

<a id="record-lead-0003-구현과-책임"></a>
#### 구현과 책임

- Core: src/engine.ts, src/growth-learning.ts, tests/growth-learning.test.ts. 전투별 WeakMap에 새 기술 성장 대상을 누적하며 최종 승리 뒤 성장한 동료 선택→기존 학습 화면을 연결한다. 중간 상대를 이겼을 때는 열지 않는다. 관장 보상·목표 안내·기본 계속 선택과 무성장 흐름을 유지한다.
- Map: src/journey-world.ts, tests/passage-loops.test.ts. 33통로에 도로 북쪽, 동굴 남쪽, 해안 동쪽의 2타일 폭 외곽 합류길 추가. 초기 작은 개방안은 총괄 검토에서 실제 고리가 아니어서 반려했고 충분한 외곽 경로로 바꿨다. 기존 통행·사물·풀밭·출구와 저장 개정23 유지.
- Art: src/renderer.ts의 gymRewardLower만. 학습 선택이 붙은 3선택 보상 화면의 안내를 위로 정리해 가림 방지. 기존 2선택 좌표 유지.
- 총괄: scripts/lead-0003-fixtures.ts, 문서·운영 기록, tests/gym-reward.test.ts의 고정 인덱스 기대값을 실제 계속/목표 선택으로 갱신, 통합 및 실제 Gameplay 검증.

<a id="record-lead-0003-자동-검사"></a>
#### 자동 검사

- npm.cmd test: **396/396 통과**, 실패·건너뛰기0. tests/lead-0003-test-output.txt.
- npm.cmd run build: TypeScript·Vite 통과, 62 modules.
- 새 성장 테스트5개, 통로 테스트4개. 연전·복수 성장·보상1회·취소·중단·복원·무성장, 33통로 연결·기존 좌표 보존·사물 접근 검증.
- 중간에 지도 좌표 객체 형식 오류로 초기화 실패 발생: Map이 수정 후 fixture 실행·전체 테스트·실제 브라우저로 재확인했다. 이전부터 있던 문제로 분류하지 않는다.
- 통합 초기 실패는 관장 선택지 인덱스 기대값2건 및 지도 테스트가 기존 아이템 막힘 타일을 누락한1건. 갱신 후 전체 통과.

<a id="record-lead-0003-총괄-실제-gameplay"></a>
#### 총괄 실제 Gameplay

`http://localhost:5173/?qa=lead0003-20260907`. parseSave로 검증한 fixture를 실제 파일 선택/불러오기 UI로 가져오고 키보드로 플레이했다. 숨은 런타임 상태 변경 없이 공개 DOM 관찰 상태를 읽었다.

1. 도로 정비원 연습전: Lv.6 경험치59 파이리가 실제 전투 승리로 Lv.7이 됨. 승리 후 기술 배우기→파이리→불꽃세례→울음소리와 비교→확정. 상금160원, 할퀴기/불꽃세례. 재접속 후 유지.
2. 강석 3마리 연전: Lv.15 꼬부기가 초반에 Lv.16 어니부기로 진화하고 물기 후보가 열림. 연전 중 학습창 없이 최종 승리 뒤 목표 안내/기술 배우기/계속 세 선택 확인. 콜배지·스텔스록·1,440원 지급 후 어니부기 학습 대상 유지, 학습 진입으로 보상 재지급 없음.
3. 도로: 연고–장막에서 (2,10)→(5,3)→(23,3)→(25,10), 37걸음으로 북쪽 샛길과 본길 합류.
4. 동굴: 축복–무쇠에서 (2,10)→(5,16)→(25,16)→(26,10), 36걸음으로 남쪽 암반 고리 통과. 조우 풀밭을 피하는 경로 확인.
5. 해안: 장막–물가에서 (2,10)→(18,3)→(26,3)→(26,14)→(19,14)→(18,10), 58걸음. 빠른 저장·재접속 후 map/좌표/걸음/상처약5 유지.

각 경로와 성장/보상 화면은 인라인 스크린샷으로 검수했고 별도 PNG로 저장하지 않았다. 직접 확인한 통로는 종류별 대표3개이며 33개 전체 접근은 자동 검사 범위다. 전체 캠페인·새 야생종·새 퀘스트 구현 완료를 뜻하지 않는다. 사용자 실제 저장과 다른 미커밋 작업은 보존했다.

다음 후보: 다음 성장 목표 표시, 기존 설계 출현표를 실제 모험 구역에 추가 연결하는 범위 검토. 별도 선정 전 새 본편 사건이나 전체 설계 잠금을 확정하지 않는다.

---

<a id="record-lead-0004"></a>
## lead-0004

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0004.md`

<a id="record-lead-0004-lead-0004--첫-배지-여행-연결과-초반-기술-연출"></a>
### lead-0004 — 첫 배지 여행 연결과 초반 기술 연출

2026-09-07 완료. 작업 전 규칙·개발·스토리·운영 문서와 Git 상태를 확인했다. 기존 미커밋 작업과 사용자 저장은 보존했다.

<a id="record-lead-0004-선정-및-역할"></a>
#### 선정 및 역할

네 담당의 독립 검토 후 도시 준비 동선과 세 스타팅 기술 연출 두 작업을 선정했다. Story Arendt는 FIRST_BADGE_SLICE 문서만 작성했다. Map Averroes는 city-activities/first-badge-town 및 전용 테스트, Core Pascal은 engine/starter-presentation 및 전용 테스트, Art Gibbs는 move-art/renderer battleTop 및 전용 테스트를 맡았다. 총괄은 통합 테스트·문서·Gameplay를 담당했다. QA 에이전트는 새로 배정하지 않았다.

<a id="record-lead-0004-구현"></a>
#### 구현

- 실제 축복·무쇠 안내원을 통해 센터, 상점, 기존 주민 부탁, 다음 길의 도보 경로를 선택한다. 실제 시설/NPC와 연결하며 취소와 오래된 콜백 방어를 포함한다. 연구 자료 전달 흐름을 보존한다.
- 콜배지 이후 이미 이긴 강석 대신 영원숲을 안내한다. 이후 배지를 얻으면 기존 모험 목표를 따른다. 광부 조사 오기도 수정했다.
- 불꽃세례는 분리된 불꽃, 물대포는 물줄기, 덩굴채찍은 뻗고 돌아오는 덩굴로 표현한다. 기술 선언 0.9초, 피해 표시 0.65초 동안 단계에 맞춰 표시하고 조기 입력으로 건너뛰지 않게 한다.
- 피해 계산은 기존 프레임을 유지하고 표시 HP만 보간한다. HP 0에 도달한 대상은 해당 피해 페이지 동안 남고 다음 기절 페이지에서 사라진다.

<a id="record-lead-0004-검증"></a>
#### 검증

전체 테스트 411/411 통과: tests/lead-0004-test-output.txt. npm.cmd run build 성공(64 modules). 통합 테스트는 실제 연출 시간 경과를 반영하도록 조정했다.

총괄 직접 플레이 URL: http://localhost:5173/?qa=lead0004-first-badge-20260907

새 침실에서 시작해 꼬부기를 선택하고 도윤의 출발 안내, 서쪽길 연습전·야생전·찌르꼬 포획·거품 교체 학습을 거쳤다. 축복에서 두 종 소개 보상, 상점 상처약 구매, 센터 회복을 직접 수행했다. 남쪽 암반굴의 상처약을 얻고 롱스톤과 싸운 뒤 무쇠시티에 도착했다. 센터에서 회복하고 주민 준비 보상을 받은 뒤 강석의 꼬마돌·롱스톤·두개도스를 이겨 콜배지를 받았다. 이후 주민 반응과 영원숲 도보 안내를 확인했다.

최종 저장: 꼬부기 Lv.10 HP35/35, 찌르꼬 Lv.3 HP21/21, 콜배지, TM-stealth-rock, 1900원, 몬스터볼7·상처약6. 빠른 저장 후 새로고침으로 동일 진행 유지 확인. 이 저장에는 fixture를 가져오지 않았다. 개발 초반 HMR로 저장 전 전투가 중단된 적이 있으며, 담당 수정 완료 후 도시·동굴·체육관 진행을 이어 검증했다.

별도 URL ?qa=lead0004-techniques-20260907에서 공개 세이브 파일 가져오기 UI로 세 기술 전투를 준비했다. 실제 입력으로 불꽃 이동·물줄기·덩굴 이동 화면을 확인했다. 물대포 마지막 피해의 HP0 대상 유지와 다음 기절 페이지 전환도 확인했다. 스크린샷은 대화에 표시했으며 별도 이미지 파일은 생성하지 않았다.

<a id="record-lead-0004-남은-범위"></a>
#### 남은 범위

처음부터 첫 배지까지의 난이도 검증은 꼬부기 기준이다. 물대포는 별도 연출 검증이며 자연 진행에서는 거품을 사용했다. 나머지 스타팅의 첫 배지 난이도와 도시 체험 보완을 다음 후보로 남긴다. 탄갱 사건·라이벌·새 지역이나 미정 스토리는 추가하지 않았다. 전체 게임 완성 판정은 아니다.

---

<a id="record-lead-0005"></a>
## lead-0005

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0005.md`

<a id="record-lead-0005-lead-0005--동료와-기술로-첫-배지-준비하기"></a>
### lead-0005 — 동료와 기술로 첫 배지 준비하기

2026-09-07. 규칙·개발·스토리·운영·진행 문서와 Git 상태 확인 후 네 역할에 읽기 전용 검토를 병렬 배정했다. Story Carson은 대사와 권장 레벨, Map Mill은 실제 조우/동선, Core Boole은 준비 상담과 보급, Art Bacon은 별도 QA 화면의 가독성을 검토했다. QA 에이전트는 배정하지 않았다.

<a id="record-lead-0005-선정과-구현"></a>
#### 선정과 구현

1. 무쇠체육관의 파티별 준비 상담. Core는 gym-coach.ts, gyms.ts와 전용 테스트를 수정하고 Lead가 engine.ts의 안내원 선택·포켓몬 화면 연결을 맡았다. 회복을 우선하고 현재 기술/현재 학습/가까운 미래 학습을 구분한다. 선택 공격이 강석 팀에게 유리한지는 실제 moveEffectiveness로 계산한다. 대안 동료는 현재 암반굴 조우 풀에서 고르며 종을 새로 추가하지 않는다. 배지 후 잘못된 무료 상처약 안내는 상점 구입으로 수정했다.
2. 서쪽길 동료 소개. Map은 encounter-guidance.ts와 전용 테스트를 맡고 Lead가 안내원·표지판에 연결했다. 흔한 비버니·찌르꼬, 드문 꼬몽울, Lv.3~6과 포획법을 실제 풀에서 읽는다. 설명은 두 페이지이며 안전 흙길 안내를 유지한다.

권장 레벨8은 차단 조건이 아니므로 변경하지 않았다. Art의 EXP 대비 개선은 이번 선정에서 보류했다. 새 스토리·지역·전투 규칙·배지 조건·저장 형식을 추가하지 않았다.

<a id="record-lead-0005-검증"></a>
#### 검증

- 전체 423/423 테스트, npm.cmd run build 성공(65 modules), git diff --check 통과.
- 신규 상담 분기, 상성, 미래/현재 학습 구분, 상담 무변경, 오래된 저장 콜백 무효, 실제 표지판 이동/조사 회귀를 포함한다. 기존 정적 표지판 문자열 기대는 실제 동적 안내와 안전길 내용 검증으로 변경했다.
- 실제 URL: http://localhost:5173/?qa=lead0005-preparation-20260907
- 공개 세이브 파일 선택/가져오기 UI로 격리 fixture를 로드했다. 파이리·피카츄 Lv.8에서 알통몬/안다리걸기/암반굴 Lv.7~10 안내를 확인했다. 이상해씨 Lv.8은 덩굴채찍 Lv.9를 아직 배울 수 없는 기술로 구분했다.
- 이상해씨 Lv.9에서는 상담 → 포켓몬 확인 → 정보 → 기술 배우기 → 몸통박치기 비교 → 덩굴채찍 교체를 실제 입력으로 진행했다. 다시 상담하면 현재 선택 기술이 유리하다는 내용으로 바뀌었다. 빠른 저장·재접속·새 탭에서도 덩굴채찍/울음소리가 유지됐다.
- 서쪽길 표지판의 실제 드문 종/레벨/안전길, 배지 보유·상처약0인 유채 도전 준비의 상점 안내를 확인했다.
- 개발 중 잘못된 gymTeam import로 발생했던 HMR 오류 2건은 수정했다. 최종 코드의 새 탭 로드에서는 error 로그가 없었다.
- 화면은 대화에 표시했으며 별도 PNG 파일은 생성하지 않았다. 사용자 기본 저장은 접근·변경하지 않았다.

<a id="record-lead-0005-남은-범위"></a>
#### 남은 범위

이번 검증은 변경 기능의 격리 저장 QA이다. 전 회차 꼬부기의 새 게임→콜배지 직접 플레이와 구분한다. 파이리·이상해씨의 처음부터 첫 배지까지 자연 성장과 난이도는 다음 후보이며 전체 캠페인 완료로 주장하지 않는다.

---

<a id="record-lead-0006"></a>
## lead-0006

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0006.md`

<a id="record-lead-0006-lead-0006--다음-성장을-기대하며-키우기"></a>
### lead-0006 — 다음 성장을 기대하며 키우기

2026-09-07. 규칙·개발·스토리·운영·상태 문서와 Git 상태를 확인했다. 네 역할의 읽기 전용 분석 후 성장 목표 표시와 도구 부족 안내 두 작업을 선정했다.

<a id="record-lead-0006-역할과-검토"></a>
#### 역할과 검토

Story Russell의 주민 배지 대사 불일치 후보는 현행 조건 분기를 다시 읽고 철회했다. Map Fermat의 암반굴 공터→남쪽 풀밭 바닥 표시 후보는 후순위로 남겼다. Core Ramanujan은 기본 경험치 계약에 명확한 결함이 없음을 확인하고 battle.ts의 배지 후 보급 안내와 전용 테스트를 맡았다. Art Tesla는 renderer.ts moves 배치를 맡고 Lead가 성장 예고 helper와 통합 테스트를 담당했다. QA 에이전트는 신규 배정하지 않았다.

Art 작업 중 Lead 전용 helper의 중복 작성이 발생해 쓰기를 중지시키고 Lead 구현을 복원했다. 성장 한도·기술 중복·같은 레벨 진화 우선·옛 고레벨 스타팅 저장 경계를 검사한 최종 버전으로 통합했다. 초기 중복 helper 테스트도 실제 renderer 표시·기술 배우기 터치 연결 테스트로 교체했다.

<a id="record-lead-0006-구현"></a>
#### 구현

- 다음 기술/첫 진화의 실제 레벨과 이름을 정보 화면에 한 줄 표시한다. 미래 학습표는 레벨순으로 읽고 이미 배울 수 있는 기술은 제외한다. 미구현 진화나 성장 한도 이후는 안내하지 않는다.
- 같은 레벨의 진화와 기술은 실제 gainExperience 순서에 맞춰 진화를 우선한다. 옛 저장의 이미 레벨16 이상인 미진화 스타팅은 다음 성장 시점을 예고한다.
- 기술 카드 간격을 줄이고 목표 문구를 y96에 8px 진한 녹색으로 배치했다. EXP 안내/바와 기존 터치 버튼을 유지했다.
- 볼·상처약이 없을 때 첫 배지 후에는 마을 상점을 안내한다. 부족 행동은 기존대로 턴·HP·도구를 소비하지 않는다.

<a id="record-lead-0006-검증"></a>
#### 검증

전체 431/431 테스트: tests/lead-0006-test-output.txt. npm.cmd run build 성공(66 modules). git diff --check 통과.

새 게임 QA ?qa=lead0006-growth-20260907에서 침실→집→새잎마을→연구소 이동·대화·파이리 선택 후 정보 화면의 다음 불꽃세례 Lv.7을 확인했다. 이 저장에는 fixture를 가져오지 않았다. 개발 중 HMR와 브라우저 제어 시간 초과가 있어 새 게임 첫 배지까지 연속 진행한 것으로 기록하지 않는다.

별도 ?qa=lead0006-boundaries-20260907에서는 공개 파일 선택/가져오기 UI로 유효한 경계 저장을 준비했다. 실제 도로 정비원과 전투해 파이리 Lv.6→7(경험치39, HP4/25) 성장 후 목표가 Lv.16 리자드로 바뀐 것을 확인했다. 별도 Lv.15 경계 전투에서 실제 리자드 Lv.16으로 진화했고, 목표가 Lv.17 용의분노로 바뀌었다. 빠른 저장·재접속 후 리자드 Lv.16, EXP39, HP42/56과 기술 유지를 확인했다.

배지 보유·볼0·상처약0 격리 저장에서 실제 서쪽길 귀뚤뚜기 야생전을 시작했다. 볼 및 부상 파티의 상처약 선택 모두 마을 상점 안내를 표시했다. 두 번의 부족 선택 후 턴0, 플레이어 HP25, 상대 HP21로 불필요한 반격·소비가 없음을 확인했다.

스크린샷은 대화에 표시했으며 PNG 파일은 생성하지 않았다. 사용자 기본 저장은 변경하지 않았다.

<a id="record-lead-0006-남은-범위"></a>
#### 남은 범위

이번 완료는 성장 정보와 보급 메시지 및 해당 전투 경계 검증이다. 파이리·이상해씨의 처음부터 첫 배지까지 자연 성장 난이도와 전체 캠페인 수용은 미완료다. 새 스토리·지역·경험치 규칙·진화 종을 추가하지 않았다.

---

<a id="record-lead-0007"></a>
## lead-0007

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0007.md`

<a id="record-lead-0007-lead-0007--암반굴-필드와-전투의-시각-연결"></a>
### lead-0007 — 암반굴 필드와 전투의 시각 연결

2026-09-07. 프로젝트 규칙·개발·스토리·운영·배정 문서와 Git 상태를 확인하고 네 역할의 독립 분석을 취합했다. 첫 배지 구간의 암반굴 필드와 전투 배경 두 작업을 선정했다.

<a id="record-lead-0007-역할과-구현"></a>
#### 역할과 구현

Story James와 Core Plato는 읽기 전용 검토를 했다. 일부 일반 대사·렌더링 경로 지적은 Lead가 실제 호출 경로로 재검토하여 확정 결함으로 채택하지 않았다. Map Chandrasekhar는 journey-art.ts의 길 표시와 전용 테스트, Art Carver는 oreburgh-cave-art.ts와 전용 테스트를 맡았다. Lead는 renderer.ts 연결, 표지판·산행객 안내 문구와 통합 테스트를 작성했다. QA 에이전트는 배정하지 않았다.

- 축복–무쇠 암반굴만 기존 초록 풀밭을 회갈색 자갈밭으로 표시한다. 플레이어 앞에는 작은 발밑 먼지만 그려 캐릭터를 가리지 않는다.
- 기존 안전 통로에 낮은 대비의 따뜻한 바닥 표시를 넣고 남쪽 조우 구역으로 이어지는 흔적을 더했다. 실제 통합 맵의 충돌·소품·NPC를 확인하여 표시 위치를 제한했다.
- 해당 동굴 전투는 암벽·돌기·암반 바닥과 돌 플랫폼으로 표시한다. 기존 포켓몬·HUD 좌표와 기술 연출 순서는 유지한다.
- 표지판과 산행객 준비 안내는 남쪽 자갈밭과 밝은 안전 통로를 설명한다. 맵 ID·워프·조우 종과 비중·내부 tallGrass 지형·저장 형식은 그대로다.

<a id="record-lead-0007-검증"></a>
#### 검증

전체 441/441 테스트 통과(tests/lead-0007-test-output.txt), npm.cmd run build 성공(67 modules), git diff --check 통과. 전용 검사는 다른 지역 배경 유지, 그림 범위·캔버스 상태 복원·플랫폼 좌표, 원본 맵 불변, 안전 통로와 워프, 안내 대사 연결을 확인한다.

Lead는 ?qa=lead0007-cave-20260907에서 공개 파일 가져오기 UI로 유효한 꼬부기 Lv.8 검증 저장을 불러왔다. 실제 방향키로 자갈밭에 들어가 캐릭터 가림과 발밑 표현을 확인했다. 야생 꼬마돌 Lv.9 조우 후 암벽 전투 화면에서 거품을 사용하고 몬스터볼로 포획했다. 안전 통로로 무쇠시티에 도착한 뒤 암반굴을 왕복해 축복시티로 돌아왔다. 왕복 안전 구간에서는 조우가 없었다.

빠른 저장·재접속 후 축복시티, 꼬부기 Lv.8 HP19/29, 꼬마돌 Lv.9 HP18/46, 볼4·상처약2, 도감 발견·포획 두 종이 유지됨을 확인했다. 브라우저 오류 로그는 비어 있었다. 스크린샷은 대화에 표시했으며 별도 PNG는 생성하지 않았다. 사용자 기본 저장과 기존 사용자 QA 탭은 건드리지 않았다.

<a id="record-lead-0007-남은-범위"></a>
#### 남은 범위

이번 검증은 동굴의 실제 조우·전투·포획·도시 왕복·재접속이다. 처음부터 첫 배지까지 새 게임을 다시 완주한 회차는 아니다. 파이리·이상해씨의 자연 성장 난이도 검증은 남아 있다. 포획 대사의 이름 조사(꼬마돌를 등)는 후속 후보로 기록한다. 새 이야기·지역이나 전투 규칙은 추가하지 않았다.

---

<a id="record-lead-0008"></a>
## lead-0008

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0008.md`

<a id="record-lead-0008-lead-0008--전투와-성장의-한국어-문장-정합성"></a>
### lead-0008 — 전투와 성장의 한국어 문장 정합성

2026-09-07. AGENTS.md 및 개발·스토리·운영·배정 문서, 현재 Git 상태를 확인했다. 기존 다수 변경과 사용자 저장을 보존했다.

<a id="record-lead-0008-선정과-역할"></a>
#### 선정과 역할

네 담당의 독립 읽기 검토 후 지난 실제 플레이에서 확인한 이름 조사 문제와 성장 안내를 선정했다. Story Gauss는 실제 조우·성장 호출 경로, Map Jason은 첫 배지 준비 안내 후보를 검토했다. Map 후보는 이미 존재하는 도시·체육관 안내와 중복될 수 있어 이번에는 추가하지 않았다. Art Archimedes는 renderer의 줄바꿈과 고유 QA 초기 화면을 확인했으며 전투 화면 검증은 Lead가 맡았다. QA 에이전트는 배정하지 않았다.

Core McClintock은 korean-text.ts, battle.ts와 전용 테스트 두 파일을 작성했다. Lead는 engine.ts·growth.ts·renderer.ts의 관련 문자열, 성장 테스트와 문서를 맡았다. 파일 쓰기 범위를 분리했다.

<a id="record-lead-0008-구현"></a>
#### 구현

- 한글 이름의 마지막 음절 받침으로 은/는·이/가·을/를·과/와를 선택한다. 으로/로는 ㄹ 받침 예외를 적용한다. 한글 외 끝문자는 발음을 추측하지 않고 문서화한 모음형 fallback을 사용하며 현재 한국어 종·기술명에 적용한다.
- 야생 등장·포획 성공과 실패·기절·교대·방어·흡수·반동 메시지와 전투 행동 안내에 연결한다. 예: 알통몬이 나타났다 / 알통몬을 잡았다 / 꼬마돌은 무엇을 할까.
- 성장 경험치·학습 기술명과 진화 안내에도 연결한다. 리자드(으)로 → 리자드로. 숫자 발음을 추측하지 않도록 레벨 상승은 “올랐다! Lv.16” 형식으로 표시한다.
- 전투 규칙·피해·보상·성장 순서·저장 필드는 바꾸지 않는다. 새 이벤트와 지역은 추가하지 않았다.

<a id="record-lead-0008-검증"></a>
#### 검증

448/448 테스트 통과(tests/lead-0008-test-output.txt). npm.cmd run build 성공(68 modules). git diff --check 통과. 받침·ㄹ 예외·fallback, 포획/기절 메시지, 경험치 보존·진화·덩굴채찍 학습 문장을 검사했다.

Lead 고유 브라우저 ?qa=lead0008-text-20260907에서 공개 파일 가져오기로 기존 유효 검증 저장을 사용했다. 암반굴에서 실제 알통몬 Lv.8을 조우하고 “알통몬이 나타났다”를 확인했다. 몬스터볼 실패 “알통몬이 빠져나왔다”, 거품 공격, 재포획 성공 “알통몬을 잡았다 / 알통몬이 파티에 등록되었다”를 확인했다. 포획 결과 스크린샷의 두 줄이 창 안에 정상 표시됐다. 저장 후 재접속에서 꼬부기 HP21, 알통몬 HP44, 볼3·상처약2가 유지됐다.

같은 격리 QA에 별도 파이리 Lv.15 경계 파일을 가져와 실제 도로 정비원 연습전을 진행했다. 세 번의 할퀴기 후 Lv.16 상승과 “파이리는 / 리자드로 진화했다!” 화면을 확인했다. 저장·재접속 후 리자드 Lv.16 EXP39 HP42/56과 상금160 유지, 브라우저 오류 로그 없음. 스크린샷은 대화에 표시했으며 PNG 파일은 생성하지 않았다.

<a id="record-lead-0008-남은-범위"></a>
#### 남은 범위

이번 회차는 문장 정합성과 관련 포획·성장 동작 검증이다. 검증 저장에서 진행했으며 파이리·이상해씨를 새 게임부터 첫 배지까지 완주한 검증은 아니다. 첫 배지 자연 성장·동료 구성 난이도는 다음 우선 후보로 유지한다. 사용자 기본 저장과 lead0003 탭은 변경하지 않았다.

---

<a id="record-lead-0009"></a>
## lead-0009

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0009.md`

<a id="record-lead-0009-lead-0009--도감으로-동료의-서식지-찾기"></a>
### lead-0009 — 도감으로 동료의 서식지 찾기

2026-09-07. AGENTS.md, 개발·스토리·운영·배정 문서와 Git 상태, 데이터베이스 안내를 확인했다. 기존 변경과 사용자 저장을 보존했다.

<a id="record-lead-0009-선정과-배정"></a>
#### 선정과 배정

네 역할의 독립 분석을 배정했다. 기술 교체 비교는 이미 구현되어 있어 중복 작업을 배제하고, 도감에서 놓친 동료를 다시 찾을 수 있는 서식지 안내를 선정했다. Story Kuhn은 이야기 충돌과 정보 범위를 검토했다. Map Helmholtz의 체육관 표식 후보는 후순위로 남겼다. Art Halley는 읽기 검토, 실제 도감 화면은 Lead가 확인했다. QA 에이전트는 배정하지 않았다.

Core Einstein은 runtime-encounters.ts의 speciesHabitats와 전용 테스트를 작성했다. Lead는 journey-services.ts의 도감 상세 연결, UI 흐름·저장 불변 테스트, 검증용 파일과 문서를 담당했다.

<a id="record-lead-0009-구현"></a>
#### 구현

- 실제 MAP_POOLS에 연결된 야생 조우 풀에서 종별 서식지·레벨 범위를 조회한다. 같은 node의 옛 지도 별칭과 반대 방향 별칭은 한 번만 표시한다.
- 해당 풀의 가중치 비율 30% 이상은 흔함, 10% 이상은 보통, 미만은 드묾으로 표시한다. 이는 야생 조우 안에서 해당 종이 선택될 비중이며 걸음당 조우 확률이 아니다.
- 기존 도감의 발견·포획 종 상세 설명 뒤에 지역마다 3줄짜리 서식지 페이지를 추가했다. 기록되지 않은 종을 목록에 추가하거나 포획 기록을 부여하지 않는다.
- 실제 야생 풀이 없는 종은 “야생 서식지 정보가 없다.”로 표시한다. 미구현 설계 지역·밤 출현·선물/진화 획득 장소를 추측하지 않는다. 사용자 화면에는 내부 등록 데이터 용어를 넣지 않았다.
- 도감 상세의 이전 콜백이 다른 저장이나 전투 상태에 끼어들지 않도록 방어했다. 조우 분포·성장·보상·저장 형식은 유지한다.

<a id="record-lead-0009-검증"></a>
#### 검증

454/454 테스트 통과(tests/lead-0009-test-output.txt), npm.cmd run build 성공(68 modules), git diff --check 통과. 별칭 중복·실제 레벨과 빈도·미등록 종·발견만 한 종·선물 파트너·저장 불변·이전 콜백을 검사했다.

Lead는 ?qa=lead0009-dex-20260907에서 공개 파일 가져오기로 꼬부기 포획/꼬마돌 발견 검증 저장을 준비했다. 실제 X 메뉴→트레이너 카드→도감에서 꼬부기의 서식지 정보 없음, 꼬마돌의 축복–무쇠 암반굴 Lv.7~10 흔함·천관산 하부 Lv.13~17 보통을 확인했다. 암반굴 안내 세 줄이 대화창 안에 표시됐다. 목록으로 복귀·종료·저장·재접속 후 seen [7,74], caught [7], 파티 [7]과 암반굴 위치가 유지됐다.

개발 중 UI 연결이 helper 작성보다 먼저 반영되어 일시적인 HMR missing-export 오류 한 건이 남았다. 최종 빌드와 재접속은 정상이며 별도 ?qa=lead0009-clean-20260907 새 로드는 오류 로그가 비어 있었다. 스크린샷은 대화에 표시했으며 PNG 파일은 만들지 않았다. 사용자 기본 저장과 lead0003 탭은 변경하지 않았다.

<a id="record-lead-0009-남은-범위"></a>
#### 남은 범위

도감 안내와 기록 보존을 검증한 회차다. 처음부터 첫 배지까지 새 게임 완주는 수행하지 않았다. 첫 배지 자연 성장·파티 구성 난이도는 다음 우선 대상으로 유지한다.

---

<a id="record-lead-0010"></a>
## lead-0010

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0010.md`

<a id="record-lead-0010-lead-0010--성장-후-새-기술로-바로-연결"></a>
### lead-0010 — 성장 후 새 기술로 바로 연결

2026-09-07 시작, 2026-09-08 완료. 규칙·개발·스토리·운영·배정 문서와 Git 상태를 확인했다. 기존 변경과 사용자 저장을 보존했다.

<a id="record-lead-0010-선정과-구현"></a>
#### 선정과 구현

성장 후 기술 배우기를 눌러도 기존 기술 목록 첫 페이지에서 새 기술을 다시 찾아야 하는 흐름을 개선했다. Story Herschel·Map Faraday·Art Locke에 읽기 검토를 배정하고 Core Aristotle이 move-school.ts와 전용 테스트를 작성했다. Lead는 growth-learning.ts의 전달과 통합 테스트·실제 Gameplay·문서를 맡았다. QA 에이전트는 배정하지 않았다.

`showMoveSchool`의 선택적 preferredMove가 현재 배울 수 있고 아직 기억하지 않은 기술이면 해당 목록 페이지와 커서를 맞춘다. 일반 정보 화면 진입은 기존과 같다. 성장 선택기는 전투 중 모은 새 기술 중 현재도 유효한 첫 기술을 전달한다. 자동으로 배우거나 기존 기술을 지우지 않는다. 비교·교체 확인·취소와 저장 규칙은 유지한다.

담당 검토 중 통합 작업이 먼저 반영되어 발생한 세 번째 인자 타입 오류와 새 테스트 실패는 Core 함수 구현 후 해소됐다. Map의 과거 STORY TM 문장 후보는 문서의 이력 구분 기준을 확인해야 하므로 이번에 현재 구현 결함으로 채택하지 않았다.

<a id="record-lead-0010-검증"></a>
#### 검증

전체 458/458 테스트(tests/lead-0010-test-output.txt), npm.cmd run build 성공(68 modules), git diff --check 통과. 첫 페이지·뒤 페이지의 새 기술 선택, 불가/이미 기억한 기술의 fallback, 실제 성장 후 페이지 연결과 저장 불변·취소를 확인했다.

Lead는 ?qa=lead0010-learning-20260907에서 공개 파일 가져오기로 유효한 꼬부기 Lv.12 EXP119 경계 저장을 사용했다. 개발 중 HMR로 연습전이 중단돼 통합 완료 뒤 재진행했다. 도로 정비원과 실제 거품 공격으로 승리해 Lv.13이 됐고, 기술 배우기→꼬부기 선택에서 2/2쪽의 물대포(선택 인덱스1)로 바로 연결됐다. 스크린샷으로 해당 선택 강조를 확인했다.

거품과 물대포를 비교하는 동안 기억 기술은 거품·꼬리흔들기로 유지됐다. 바꿔서 배운다 확정 후 물대포·꼬리흔들기가 됐다. 빠른 저장·재접속 후 꼬부기 Lv.13 EXP39 HP16/44, 상금160과 기술 두 개를 확인했다. 브라우저 오류 로그는 비어 있었다. 스크린샷은 대화에 표시했으며 PNG 파일은 생성하지 않았다.

<a id="record-lead-0010-남은-범위"></a>
#### 남은 범위

변경 기능은 검증 저장을 이용한 실제 성장·학습 흐름으로 확인했다. 새 게임부터 첫 배지까지 자연 성장 난이도를 완주 검증한 회차는 아니다. 해당 플레이는 다음 우선 대상으로 남긴다. 기술 비교의 “거품와 비교” 등 남은 조사 표현은 후속 후보다. 기본 사용자 저장과 lead0003 탭은 변경하지 않았다.

---

<a id="record-lead-0011"></a>
## lead-0011

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0011.md`

<a id="record-lead-0011-lead-0011--가득-찬-pc에서도-파티-교체"></a>
### lead-0011 — 가득 찬 PC에서도 파티 교체

2026-09-08. 프로젝트 규칙·개발·스토리·운영·배정 문서와 Git 상태를 확인했다. 기존 변경과 사용자 저장을 보존했다.

<a id="record-lead-0011-선정과-배정"></a>
#### 선정과 배정

파티 6마리·박스 60마리일 때 맡기기와 데려오기가 모두 거절되어 팀을 바꿀 수 없는 경계를 선정했다. Story Maxwell은 기존 보관시설 범위의 확장임을 검토했다. Map Leibniz는 실제 무쇠센터 PC 접근 좌표 (10,5) 오른쪽을 확인했다. Art Linnaeus는 대화 레이아웃을 검토했다. QA 에이전트는 배정하지 않고 Lead가 실제 Gameplay를 맡았다.

Core Darwin은 pc-swap.ts와 전용 테스트를 작성했다. Lead는 pc-swap-menu.ts, 기존 PC 메뉴 연결, UI 통합 테스트·유효한 검증 저장·문서를 담당했다. 같은 파일 병렬 쓰기는 하지 않았다.

<a id="record-lead-0011-구현"></a>
#### 구현

- 센터 PC에 파티·박스 교체 메뉴를 추가했다. 박스 동료 선택→대신 맡길 파티 선택→두 개체의 레벨·HP·기술 비교→교체 확인 순서다.
- 두 저장 슬롯의 개체만 맞바꾼다. 파티·박스 수와 다른 슬롯 순서, 개체의 경험치·성격·만난 곳·기술·HP는 유지한다. 양쪽 보관 공간이 가득 차도 가능하다.
- 교체 뒤 건강한 파티가 하나도 없으면 원본을 바꾸지 않고 거절한다. 실패 시 저장하지 않는다. 마지막 건강한 동료와 기절 개체의 교환도 거절한다.
- 확인창 기본 선택은 다시 고른다. 확정 콜백의 중복 실행과 다른 저장·전투·센터 이탈·개체 교체 후의 오래된 요청을 막는다. 기존 맡기기·데려오기·도감은 유지한다.

<a id="record-lead-0011-검증"></a>
#### 검증

전체 465/465 테스트(tests/lead-0011-test-output.txt), npm.cmd run build 성공(70 modules), git diff --check 통과. 가득 찬 공간·개체 데이터 보존·부정 인덱스·건강한 동료 보호·뒤 페이지 선택·취소·중복 확정·오래된 콜백·빈 박스를 검사했다.

Lead는 ?qa=lead0011-pc-20260908에서 공개 파일 가져오기로 유효한 파티6·박스60 저장을 준비했다. 무쇠센터 PC를 실제 Z 상호작용으로 열고 꼬부기와 꼬마돌을 비교했다. 다시 고른다 선택 후 두 개체가 유지됨을 확인하고, 재선택·확정 후 꼬마돌이 파티로, 꼬부기가 박스로 이동했다. HP는 각각 10/34와 20/20, 기술은 몸통박치기·웅크리기와 몸통박치기·꼬리흔들기로 유지됐다. 개수는 6/60 그대로였다.

빠른 저장·재접속 후 같은 개체 정보와 개수를 확인했다. 브라우저 오류 로그는 비어 있었다. 스크린샷은 대화에 표시했으며 PNG 파일은 만들지 않았다. 사용자 기본 저장과 lead0003 탭은 변경하지 않았다.

초기 테스트 fixture는 일반 스타팅을 여러 마리 복제해 저장 계약에 맞지 않았으므로 스타팅1·비버니5로 수정하고 parseSave를 통과한 파일만 브라우저에 가져왔다. 런타임 저장 규칙을 완화하지 않았다.

<a id="record-lead-0011-남은-범위"></a>
#### 남은 범위

센터 PC 교체 흐름을 검증한 회차다. 건강한 동료 보호는 자동 테스트로 확인했으며 실제 브라우저에서는 양쪽 만원 상태의 취소·성공·재접속을 확인했다. 새 게임부터 첫 배지까지 자연 성장·팀 구성 검증은 다음 우선 대상으로 유지한다.

---

<a id="record-lead-0012"></a>
## lead-0012

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0012.md`

<a id="record-lead-0012-lead-0012--야생전에서-포획-기록-확인"></a>
### lead-0012 — 야생전에서 포획 기록 확인

2026-09-08. 규칙·개발·스토리·운영·배정 문서와 Git 상태를 확인했다. 수집 중 상대가 이미 잡은 종인지 바로 구별할 수 있도록 야생전 표시 한 작업을 선정했다.

<a id="record-lead-0012-역할과-구현"></a>
#### 역할과 구현

Story Singer는 기존 도감 의미와 용어를 검토했다. Map Socrates의 검토는 병렬 통합 중간 상태를 읽은 부분이 있어 최종 코드·화면으로 다시 확인했다. Core Heisenberg는 battle.ts와 전용 기록 테스트를 작성했다. Art Sartre는 이름·레벨·HP와 아이콘 위치를 검토했으며 실제 시각 검증은 Lead가 수행했다. Lead는 renderer.ts 연결과 UI 검사·검증 저장·문서를 맡았다. QA 에이전트는 배정하지 않았다.

- 야생전 시작 시 도감 caught·파티·박스에 같은 종이 있는지 확인해 caughtBeforeBattle에 보관한다. 해당 값은 저장 데이터에 추가하지 않는다.
- 이미 잡은 종의 상대 HUD에 작은 몬스터볼을 표시한다. 행동 메뉴에는 포획 기록 있음/미포획을 경험치 참여 안내와 함께 표시한다. 이름·레벨·HP·버튼 위치는 유지한다.
- 포획 계산 중 새 동료가 저장에 추가되어도 현재 전투의 표시를 소급해서 바꾸지 않는다. 다음 조우부터 기록을 반영한다. 관장·일반 트레이너전은 표시하지 않는다.

<a id="record-lead-0012-검증"></a>
#### 검증

전체 471/471 테스트(tests/lead-0012-test-output.txt), npm.cmd run build 성공(70 modules), git diff --check 통과. 도감 발견만 한 종·기존 포획·박스 전용 개체·옛 저장 소유·트레이너전 제외·최초 포획과 다음 전투·HUD와 버튼 보존을 검사했다.

Lead는 ?qa=lead0012-caught-20260908에서 공개 가져오기 UI로 두 유효 검증 저장을 사용했다. 발견만 한 기록에서 실제 주뱃 Lv.9 조우를 시작해 미포획 안내와 아이콘 없음을 확인했다. 몬스터볼로 실제 포획했을 때 파티에는 주뱃이 추가됐지만 현재 전투의 caughtBeforeBattle은 false였다. 개발 HMR로 대화가 종료됐으나 재초기화 후 파티 [7,41]이 유지됨을 확인했다.

별도 기포획 검증 저장에서는 실제 꼬마돌 Lv.9 조우 후 작은 볼 아이콘과 포획 기록 있음 문구를 스크린샷으로 확인했다. 이름·레벨·HP와 겹치지 않았다. 도주·빠른 저장·재접속 후 도감 기록 유지, battle=null, 저장에 caughtBeforeBattle 없음과 콘솔 오류 없음까지 확인했다.

스크린샷은 대화에 표시했고 PNG는 만들지 않았다. 사용자 기본 저장과 lead0003 탭은 변경하지 않았다.

<a id="record-lead-0012-남은-범위"></a>
#### 남은 범위

이번 검증은 야생전 표시·최초 포획·기록 보존이다. 실제로 동일 종을 다시 찾아 연속 포획 전후를 비교한 것은 아니며 그 경계는 자동 테스트로 확인했다. 첫 배지 새 게임 자연 성장 난이도 검증은 남아 있다.

---

<a id="record-lead-0013"></a>
## lead-0013

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0013.md`

<a id="record-lead-0013-lead-0013--실제-야생-도로와-암반굴"></a>
### lead-0013 — 실제 야생 도로와 암반굴

2026-09-08. 사용자 최초 요청은 포켓몬다운 구현 지속이었다. 규칙·개발·스토리·첫 배지 기준·배정과 기존 Git 작업을 확인하고 Story/Map/Core/Art를 읽기 전용으로 검토했다. 도중 사용자가 도시·마을·특정 장소 사이 야생 도로·동굴 부족을 가장 큰 문제로 지정하여 해당 작업을 우선했다. 기존 미커밋 작업은 보존했다.

<a id="record-lead-0013-변경"></a>
#### 변경

- 기존 공통 통로 33곳 중 실제 조우 풀은 암반굴 1곳뿐이었다. 두 도로에 ENC-007/008을 명시적으로 연결하여 3곳이 됐다. 나머지 30곳의 조우 미구현은 유지하고 후속 최우선에 기록했다.
- Map: journey-world.ts와 신규 journey-route-layouts.ts. 암반굴 52×30, 연고–장막 54×30, 연고–들판 52×32. 기존 열린 칸·사물·NPC·ID를 보존하고 확장 영역에 안전길과 여러 풀밭/자갈밭·순환 샛길을 만들었다. 동쪽 출구와 도시 역방향 spawn을 함께 이동했다.
- Core: 추출기·runtime-encounters.ts·추출 JSON·PNG 출처와 전용 검사. 장막 도로는 Lv.18~21 요가랑·스컹뿡·포니타·델빌, 들판 도로는 Lv.15~18 랄토스·흉내내·이어롤·럭시오다. 기존 5풀을 유지하여 7풀, 소유32종/등록39종이 됐다. 신규6종 앞뒤 PNG12개를 추가했다.
- Art: journey-art.ts. 같은 레이아웃 자료로 확장 안전 흙길·잔디·물가·절벽·군락을 표시하고 암반굴 밝은 경로와 조사 표지판을 확장했다.
- 사용자 우선순위 변경 직전에 완료된 강석전 석재 실내 배경도 포함한다(oreburgh-gym-art.ts, renderer.ts 분기). 야생전과 구분하고 전투 계산·액터/HUD 위치를 유지한다.
- Lead: 기존 고정 크기/동굴 출구/미구현 조우 대상 회귀 기대값 갱신, 공개 검증 저장 생성, 브라우저 검사와 문서 갱신. 짧은 입력 누락 의심은 현재 코드에서 재현되지 않아 입력 코드를 수정하지 않았다.

<a id="record-lead-0013-자동-검증"></a>
#### 자동 검증

최종 npm.cmd test 477/477 통과(tests/lead-0013-test-output.txt). 첫 실행은 동굴의 옛 출구 x30 기대값 한 건이 실패했고 새 실제 출구 x50으로 갱신한 뒤 전체 재실행이 통과했다. 새 BFS 검사는 실제 양끝 워프와 안전 무조우길, 모든 풀밭 접근·기존 유효 좌표를 확인한다. 두 도로의 모든 슬롯·레벨 양끝 개체는 기술·포획·저장·도감·자산 검증을 통과했다. npm.cmd run build 성공(72 modules), git diff --check 성공.

<a id="record-lead-0013-총괄-직접-브라우저-검증"></a>
#### 총괄 직접 브라우저 검증

`?qa=lead0013-roads-20260908`의 공개 파일 선택/가져오기 UI를 사용했다. scripts/lead-0013-fixtures.ts의 저장은 각 시작 도시 출구 앞의 Lv.25 꼬부기·몬스터볼30·상처약10 상태다. 이동은 키보드 입력, 관찰은 실제 화면과 공개 #field[data-state]를 사용했다. 게임 내부 상태 주입·기본 사용자 저장 수정은 하지 않았다.

1. 연고시티 동쪽 출구 → 연고–장막 도로 입구 → 새 북쪽 굽은 안전길 → 장막시티를 도보 통과했다. HP80·조우 없음. 장막 남쪽 출구로 돌아와 도로 동쪽 시작점(51,10)을 확인했다.
2. 확장 남쪽 풀밭에서 스컹뿡 Lv.19를 만났다. 몸통박치기 세 번으로 HP71→23, 꼬부기 HP80→35를 확인하고 몬스터볼을 던져 포획했다. 파티2·볼29·도감 caught434·만난 장소 연고–장막 연결도로를 확인했다. 빠른 저장 후 재접속하여 개체·HP·기술·도감·도구와 battle=null 보존을 확인했다.
3. 별도 연고 남쪽 출구 저장 → 연고–들판 도로 → 확장 물가 안전길 → 들판시티를 걸었다. 들판 북쪽 출구로 돌아와 (49,10)에 진입했고 남쪽 확장 풀밭에서 랄토스 Lv.15를 만났다. 새 앞면 그림·염동력/순간이동 데이터와 도주를 확인했다.
4. 별도 축복 남쪽 출구 저장 → 암반굴 → 새 밝은 암벽 우회길 → 무쇠시티를 걸었다. 무쇠 북쪽 출구로 돌아와 (49,10)을 확인했다. 남쪽 확장 자갈밭에서 꼬마돌 Lv.8 조우·동굴 전투 배경·도주를 확인했다.
5. 동굴에서 다시 무쇠시티로 나와 체육관에 걸어 들어가 강석에게 도전했다. 실내 석재 배경의 실제 전투 화면과 기존 HUD를 확인했다.

마지막 브라우저 오류·경고 조회는 0건. 각 장소/조우/포획 화면은 대화 도구 출력에 표시했으며 별도 PNG는 저장하지 않았다.

<a id="record-lead-0013-남은-범위"></a>
#### 남은 범위

다른 공통 통로 30곳은 조우가 없다. 현재 추가 도로도 원본 구간의 공통 지형을 보존한 확장으로, 모든 통로의 고유 지도 완성은 아니다. 신규 종의 진화는 추가하지 않았고 스컹뿡·흉내내는 기존 지원 기술 규칙으로 같은 공격이 두 칸에 표시된다. 물 지형은 충돌/풍경이며 파도타기나 낚시가 아니다.

파이리 새 게임 QA는 시작 집 이동까지만 진행한 후 사용자 우선순위 변경으로 중단했다. 본 검증은 고레벨 준비 저장의 변경 구간 검증이며 파이리·이상해씨 자연 성장·첫 배지 완주, 전체 지방 수용을 완료하지 않았다. 새 본편 사건·필수 포획 조건은 추가하지 않았다.

---

<a id="record-lead-0014"></a>
## lead-0014

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0014.md`

<a id="record-lead-0014-lead-0014--네-기술과-첫-체육관-연습"></a>
### lead-0014 — 네 기술과 첫 체육관 연습

2026-09-08. 최신 직접 요청의 첫 배지 구간을 우선했다. 루트·docs 지침, 첫 배지·모험 구현 문서, docs Markdown 목록·관련 설계와 현재 Git 변경을 확인했다. 기존 lead-0013의 미커밋 도로·아트·데이터·자산을 보존했다. Story/Map/Core/Art를 나누어 검토하고 파일별 수정 범위를 배정했다. Gameplay는 Lead가 직접 수행했다.

<a id="record-lead-0014-선정과-구현"></a>
#### 선정과 구현

1. **최대 네 기술**: 속성 기술을 배우면서 기존 공격·변화 기술도 보존하기 위해 선정했다. pokemon/battle/engine/move-school/battle-hints에서 1~4개 저장, 빈칸 확인 추가, 네 칸 비교 교체, 3·4번 실행·커서·취소·선택 기억을 연결했다. 기존 두 기술과 중복 기본 기술은 유지하고 새 중복·범위 밖 학습·오래된 확인 콜백을 차단한다. renderer는 전투 2×2·파티 정보 2×2·교대 정보 두 줄로 표시한다.
2. **무쇠체육관 선택 연습 상대**: 기존 관장 직행 외에도 판단을 연습하며 성장할 방문 이유를 만들었다. badge-maps/road-trainers에 수련생 `(3,9)` 꼬마돌 Lv.7·200원, 연습생 `(13,6)` 롱스톤 Lv.8와 찌르꼬 Lv.7·320원을 추가했다. 도움말·거절·중단·일회 승리 보상·배지 반응이 있으며 강석 접근 조건은 유지한다. 기존 석재 전투 배경을 이곳 일반 트레이너전에도 적용했다. town 개정은 24이며 신규 NPC에 겹친 구저장을 기존 안전 복원 규칙으로 이행한다.

일반 트레이너는 기존 도로·암반굴 두 명과 합쳐 네 명이다. 배지 보상·필수 포획·도시 활동 조건을 변경하지 않았다. 체육관 퍼즐·탄차·탄갱 사건·라이벌을 구현한 것으로 처리하지 않는다.

<a id="record-lead-0014-자동-검증"></a>
#### 자동 검증

- 최종 `npm.cmd test`: **492/492 통과**, [실행 로그](../../tests/lead-0014-test-output.txt).
- `npm.cmd run build`: TypeScript 및 Vite 72모듈 성공. `git diff --check` 완료.
- 저장 1~4칸·빈칸/교체·중복/범위·낡은 콜백·3/4번 전투·선택 기억·진화 유지, UI 영역/터치, 트레이너 선택/중단/패배/보상·이행·도보 접근을 검사했다.
- 초기 병렬 테스트의 연습생 승리 사례는 주뱃의 현행 흡혈 위력 때문에 패배했다. 선택 연습의 두 번째 상대를 찌르꼬로 조정한 뒤 전체 검사에서 통과했다. 기존 야생 주뱃·암반굴 트레이너는 바꾸지 않았다.
- [경계 저장 생성기](../../scripts/lead-0014-fixtures.ts)의 네 파일을 `parseSave`로 검증했다. 자연 진행 저장과 분리한 준비 파일이다.

<a id="record-lead-0014-lead-직접-자연-플레이"></a>
#### Lead 직접 자연 플레이

`?qa=lead-0014-natural-charmander`에서 새 게임으로 진행했다. 파일 가져오기·순간이동·게임 상태 주입 없이 실제 키보드와 게임 메뉴를 사용했다. 관찰은 실제 Canvas와 공개 `#field[data-state]`다. 구현 중 집 이동 단계에 HMR로 저장 전 이동이 되돌아온 이력이 있으므로 한 번도 재로딩 없는 연속 실행으로 주장하지 않는다. 구현을 멈춘 뒤 연구소부터 배지까지 진행했고 중간에 저장·재접속을 명시적으로 확인했다.

| 구간 | 직접 확인한 결과 |
| --- | --- |
| 집→연구소→도윤 | 파이리 Lv.5 수령, 출발 해금, 볼 5·약 2 |
| 서쪽길 | 비버니 Lv.5 승리 후 Lv.6. 안내원 회복 후 도로 정비원 찌르꼬 Lv.4 승리, HP 1·경험치 40·160원 |
| 축복시티 | 센터 회복. 외곽 꼬몽울 Lv.5를 할퀴기로 약화해 포획. 동료 소개 보상 200원·볼 2, 전원 회복 |
| 암반굴 | 주뱃 Lv.10은 도주. 꼬마돌 Lv.8을 꼬몽울로 교대해 흡수로 승리. 분배 경험치로 파이리 Lv.7. 불꽃세례 학습 취소 시 두 기술 유지, 확정 시 세 번째 칸 추가. 저장·재접속 유지. 확장 통로를 걸어 무쇠 도착 |
| 무쇠체육관 수련생 | 도움말·거절 뒤 도전. 세 번째 기술 선택 취소는 턴 무소모. 불꽃세례 실제 사용 후 꼬몽울 교대 승리, 200원·승리 플래그. 재대화 무보상 |
| 무쇠체육관 연습생 | 상처약 1개 사용 후 도전. 중단 시 상금/승리 플래그 없음. 재도전하여 롱스톤은 꼬몽울, 찌르꼬 앞에서는 무료 파이리 교대. 파이리가 기절한 뒤 꼬몽울이 마무리, 320원. 둘 다 Lv.8 도달 |
| 도시 준비 | 센터에서 기절 포함 전원 회복·복귀점 등록. 무쇠 주민 준비 보상 300원·약 2. 상점에서 약 1개를 200원에 구매 |
| 강석전 | 파이리에서 꼬몽울로 교대하여 세 마리 모두 승리. 콜배지·스텔스록 TM·1,440원 지급. 다음 목표는 영원체육관 |
| 배지 뒤 | 수련생의 축하와 광부의 콜배지 반응 확인. 저장·재접속 후 배지·TM·승리/주민 플래그·도구/돈 유지 |

최종 저장은 무쇠시티 `(10,14,up)`, 파이리 Lv.8 EXP50 HP28/28 `[할퀴기,울음소리,불꽃세례]`, 꼬몽울 Lv.9 EXP50 HP19/54 `[흡수,흡수]`, 볼6·약5·2,420원이다. 기록된 이동은 584걸음이다. 게임 내부 seconds는 프레임 시간 누적이며 실제 소요 시간 측정으로 사용하지 않는다. 이 경로는 파이리와 잡은 꼬몽울의 조합 검증이며 파이리 단독 완주나 모든 야생 조합 수용이 아니다.

<a id="record-lead-0014-별도-경계화면-검증"></a>
#### 별도 경계·화면 검증

`?qa=lead-0014-boundaries`에서는 공개 파일 선택·불러오기 UI로 준비 파일을 가져왔다. 일반 사용자 저장과 자연 플레이 저장을 수정하지 않았다.

- Lv.16 파이리의 기존 두 기술에 불꽃세례·용의분노를 차례로 추가. 네 기술 저장·재접속 후 네 번째 기술 선택과 `용의분노` 40피해·승리를 확인했다.
- Lv.13 꼬부기의 네 칸에서 물대포와 거품을 비교했다. 취소 시 기존 배열 유지, 확정 시 세 번째 칸만 물대포로 변경, 저장·재접속 유지.
- Lv.5 HP1 파이리의 수련생전 패배 후 무쇠센터 HP19/19 회복, 돈100·볼5·약3 유지·승리 플래그 없음. 재접속 후 체육관까지 걸어 다시 도전하면 꼬마돌 HP40으로 시작했다.
- revision23의 새 NPC 위치 `(3,9)` 저장은 revision24 `(8,13,down)`으로 복원. 파티·HP1·도구·돈은 보존했다.
- Lead는 세/네 기술·실내 전투·배지 화면을 실제로 확인했다. Art는 별도 Renderer/Engine fixture에서 네 기술 메뉴·정보·교대 정보·5개 비교 선택지·네 번째 버튼 터치를 확인했다. 이 fixture 화면 검증을 자연 성장으로 합산하지 않는다.
- 자연/경계 탭의 콘솔 error/warn 조회는 모두 0건. 재접속 직후 상태를 너무 일찍 읽은 도구 오류 1회는 초기화 후 다시 읽어 해결했으며 게임 오류와 구분한다. 화면은 브라우저 도구 출력에 남겼고 별도 PNG 파일은 저장하지 않았다. 사운드 청취 수용은 하지 않았다.

<a id="record-lead-0014-다음-회차"></a>
#### 다음 회차

1. 이상해씨 새 게임에서 같은 준비·포획·기술·연습전·첫 배지 흐름을 직접 진행한다. 이번 두 기능과 파이리 완주로 세 스타팅 전체 수용을 선언하지 않는다.
2. **초반 트레이너와 관장 HP/난이도 일관성**을 현재 전투 기준으로 조정한다. 자연 플레이에서 선택 연습생의 찌르꼬가 파이리를 기절시켰다. 코드·화면상 일반 꼬마돌 Lv.7 HP40과 강석 꼬마돌 Lv.10 HP22가 서로 다른 생성 기준을 사용하므로 단순 레벨 수치만으로 균형을 평가하지 않는다. 무작정 관장 HP를 올리기 전에 세 스타팅 경로를 재검사한다.
3. 흡수 기술의 반격 HP 예고에 자기 회복이 빠지는 기존 후보를 소유 가능한 꼬몽울로 재현하고 수정한다. 실제 흡수 전투 계산은 이번 슬롯 변경 대상이 아니었다.

체육관 퍼즐과 세 스타팅 전체 수용, 영원숲 이후 구간, 조우 없는 나머지 공통 통로 30곳과 장기 A~K 과제는 남아 있다. 미확정 본편을 추가하지 않았다.

---

<a id="record-lead-0015"></a>
## lead-0015

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0015.md`

<a id="record-lead-0015-lead-0015--흡수-예고-수정과-이상해씨-시작-첫-배지"></a>
### lead-0015 — 흡수 예고 수정과 이상해씨 시작 첫 배지

<a id="record-lead-0015-구현"></a>
#### 구현

- Core: `src/battle-hints.ts`의 흡수 분기에 실제 피해 한도·자기 HP 상한을 적용한 회복량과 회복 후 반격 HP를 추가했다. 기존에는 꼬몽울 Lv.8 HP1/51 대 꼬마돌 Lv.7 HP40에서 실제로 HP1로 생존해도 기절로 예고했다.
- `tests/drain-preview.test.ts` 5개 회귀 검사: HP1 생존, 만피/상한, 상대 HP1·3·5 마무리, 상대 방어 증가, 상대 흡수와 방어 차단. 입력 불변 및 실제 `battleTurn` 결과와 비교한다.
- Story: DEVELOPMENT의 현재 계약 14절·82절에 남은 worldRevision23을 24로 정정했다. 과거 이력은 유지했다.
- Map: 체육관 접근·선택 연습전·재도전 관련 읽기 전용 검사 17개 통과. Art: 기존 두 줄 힌트 공간에 들어가는지 코드 검토했다. Lead가 실제 화면을 확인했다.
- 기존 미커밋 변경을 보존했다. 맵·저장·전투 계산·관장/연습생 HP·스토리 플래그를 변경하지 않았다.

<a id="record-lead-0015-자동-검증"></a>
#### 자동 검증

- 관련 31/31, 전체 `npm.cmd test` 497/497. 로그: `tests/lead-0015-test-output.txt`.
- `npm.cmd run build` 성공, 72모듈. `git diff --check` 통과.

<a id="record-lead-0015-lead-직접-자연-플레이"></a>
#### Lead 직접 자연 플레이

`?qa=lead-0015-natural-bulbasaur`. 준비 파일을 가져오지 않고 방향키·Z·X·메뉴로 진행했다. 초반 코드 갱신으로 집에서 재로드했고, 사용자가 중단한 뒤 동일 격리 저장으로 이어갔다. 긴 브라우저 호출의 시간 제한 뒤에도 현재 상태를 읽고 이어갔다. 한 번도 중단되지 않은 연속 세션이라고 주장하지 않는다.

1. 연구소 이상해씨 Lv.5 수령, 도윤 출발 도구 수령. 서쪽길 찌르꼬 Lv.3을 두 번 공격 후 HP9에서 포획했다. 길 안내원 회복·보급 확인.
2. 도로 정비원전: 울음소리와 몸통박치기, 상처약1 사용, 이상해씨 HP8·경험치40, 상금160. 트레이너에게 볼을 잘못 선택했을 때 턴·볼 소비 없이 거절됨도 확인.
3. 축복센터 회복·약2 보충. 동료 소개 활동으로 200원·볼2. 야생 찌르꼬 Lv.4에 승리(약1 사용)해 이상해씨 Lv.6. 센터에서 재회복한 뒤 꼬몽울 Lv.7 HP48을 몸통박치기5회로 HP23까지 줄여 포획.
4. 암반굴 알통몬 Lv.10 조우. 꼬몽울로 교대해 HP23→17. 흡수 메뉴 화면은 피해4·HP+2·반격 후13/48, 실제 결과도 상대57→53·꼬몽울13. 도주하고 밝은 통로를 걸어 동쪽 출구와 무쇠센터 도착.
5. 수련생 꼬마돌 Lv.7 HP40: 이상해씨에서 꼬몽울로 교대, 흡수3회 승리. 약0, 꼬몽울48→41, 이상해씨 Lv.7. 마지막 일격 예고 피해4·HP+2·반격 없음41/48이 실제39→41과 일치.
6. 연습생 롱스톤 Lv.8 HP45: 꼬몽울 교대·흡수3회, 꼬몽울 Lv.8 HP39. 다음 찌르꼬 Lv.7 HP33에 이상해씨를 무료 교대. 회복 없이 몸통박치기3회를 선택해 이상해씨가 기절(상대HP12). 아군 찌르꼬 Lv.3으로 마무리해 Lv.5·전광석화 학습 가능. 보상320. 학습 대화에서 기존 두 기술을 보존하고 전광석화를 3칸에 추가했다.
7. 센터에서 기절한 이상해씨 포함 전원 회복. 광부 준비 활동 보상300원·약2. 파티 최고 Lv.8이고 전원 회복 상태로 강석에게 도전.
8. 강석: 이상해씨→꼬몽울 교대, 꼬마돌에 흡수2회(이상해씨 Lv.8), 롱스톤에 흡수2회(꼬몽울 Lv.9), 두개도스에 흡수3회. 약0. 두개도스는 매 반격19 피해로 꼬몽울44→30→16, 마지막 일격 회복3으로19. 콜배지·TM·상금1440 획득.
9. 보상 화면의 다음 영원체육관 목표, 목표 안내, 무쇠 광부 재방문 후 빠른 저장·재접속. 오류·경고 로그 0건.

최종 저장: 무쇠시티 `(10,14,up)`, 이상해씨8/XP0/HP29, 찌르꼬5/XP0/HP27/전광석화3칸, 꼬몽울9/XP50/HP19, 돈2620·볼6·약4, 콜배지·스텔스록 TM, 두 도시 활동 및 세 연습전 승리 플래그. 회복점 무쇠센터, 536걸음. 게임 내 약1086초는 실제 작업 경과 시간이 아니다. 화면은 도구 출력으로 확인했으며 PNG 파일로 별도 저장하지 않았다. 음향 청취 수용은 수행하지 않았다.

<a id="record-lead-0015-난이도-판단과-다음-범위"></a>
#### 난이도 판단과 다음 범위

일반 꼬마돌7/HP40·롱스톤8/HP45가 강석10/HP22·11/HP24보다 HP가 높지만, 관장은 다른 기술·레벨·스텔스록을 사용한다. 마지막 두개도스의 실제 반격19를 확인했으므로 HP만 보고 관장을 일괄 강화하지 않았다. 연습생에서의 기절에는 회복을 선택하지 않은 플레이 판단도 작용했다. 이번 결과는 이상해씨 시작 파티의 첫 배지 도달 증거이며 스타팅별 독립 균형 수용은 아니다.

다음 우선 작업: 이상해씨 자신의 덩굴채찍 학습·활용 경로, 현재 네 기술/선택 연습전 기준 꼬부기 자연 경로, 그 결과를 토대로 초기 HP·학습 시점·연습전 소모 비교. 체육관 퍼즐은 구체 조작 설계를 현재 직접 도전 흐름과 맞춰 검토한다. 다른 30통로의 조우와 후속 지방 확장은 이 첫 배지 검토와 구분한다.

---

<a id="record-lead-0016"></a>
## lead-0016

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0016.md`

<a id="record-lead-0016-lead-0016--탄차-분류-체험과-새-기술-알림"></a>
### lead-0016 — 탄차 분류 체험과 새 기술 알림

<a id="record-lead-0016-변경"></a>
#### 변경

무쇠체육관의 빈 장식 바위에 선택 탄차 퍼즐을 연결했다. 광물 관찰대 `(11,10)`, 레버 `(5,7)`, 출발 `(6,7)`를 남쪽에서 조사한다. 줄무늬는 왼쪽, 점무늬는 오른쪽으로 차례로 운반한다. 확인 취소·오답 재시도·두 단계 완료·완료등·저장 복원을 제공한다. 탄차가 1.2초 움직이는 동안 입력을 잠그며 실행 중 재접속하면 이전 저장 단계로 복귀한다. 다른 저장·맵·상태로 넘어간 실행은 결과를 쓰지 않는다.

Map은 `gym-cart.ts`·`badge-maps.ts`·전용 테스트, Art는 `gym-cart-art.ts`, Core는 `growth-preview.ts`·전용 테스트, Story는 STORY·FIRST_BADGE 문서를 담당했다. Lead가 Engine·Renderer를 연결하고 전체 검사와 브라우저 조작을 수행했다. 기존 미커밋 파일·자산은 보존했다.

정보 화면은 미학습 자연 기술을 우선 표시한다. 이상해씨 Lv.9에서 덩굴채찍을 아직 배우지 않았으면 `배울 수 있음 · 덩굴채찍`을 유지하고, 학습 후에는 다음 진화 예고로 돌아간다. 레벨·경험치·학습표·기존 기술은 자동 변경하지 않는다.

통합 검사로 발견한 공통 체육관 복제 문제도 수정했다. `sinnoh-maps.ts`가 무쇠 전용 탄차와 연습생을 다른 세 체육관에 복사하지 않도록 제한했다. 무쇠 관장 직행·바닥·보상·배지 조건·worldRevision24는 유지한다.

<a id="record-lead-0016-자동-검사"></a>
#### 자동 검사

- 전체 `npm.cmd test`: 506/506. `tests/lead-0016-test-output.txt`.
- `npm.cmd run build`: 성공, 74모듈.
- 기존 모든 prop 접근 검사를 동적 탄차 대사에도 적용했다. 처음에는 정적 TEXT만 참조하던 검사와, 다른 체육관에 복제된 무쇠 전용 prop에서 실패했다. 동적 대사 검증과 복제 범위를 고친 뒤 전체 재통과했다.
- 전용 검사는 오답의 실제 이동 방향, 입력 잠금, 단계·레버·완료 저장, 이전 콜백 재실행, 맵/저장/전투 변경, 모든 조사 접근, 강석 직행·다른 체육관 분리, 미학습→학습 안내를 포함한다.

<a id="record-lead-0016-lead-브라우저-검증"></a>
#### Lead 브라우저 검증

`?qa=lead-0016-cart-learning`에 `scripts/lead-0016-fixtures.ts`가 만든 유효한 이상해씨 Lv.9 준비 저장을 게임의 공개 파일 가져오기 UI로 불러왔다. 이후에는 이동·Z·X·선택 메뉴로 플레이했다. 기존 lead-0014/0015 자연 진행 저장은 사용하거나 변경하지 않았다. 이번은 새 게임 자연 완주가 아닌 기능·경계 검증이다.

1. 광물 관찰대에서 줄무늬 표본·좌우 받침 안내와 선택 체험 설명 확인. 돌 위 탄차와 표본의 픽셀 그림을 화면에서 확인했다.
2. 레버를 오른쪽으로 바꾸고 출발 취소. stage0/right true 유지.
3. 오른쪽으로 잘못 발사. 이동 중 snapshot progress0.722에서 실제 targetRight true, 이동·X 입력에도 플레이어 `(6,8)`·field 유지. 오답 후 stage0 유지·원점 복귀·재시도 안내 확인.
4. 레버를 왼쪽으로 돌려 정답 배송. 분류1/2 후 재접속에서도 stage1/right false 유지. 다음 표본은 점무늬로 안내된다.
5. 오른쪽으로 전환·발사하여 분류2/2·완료등. 재조사에는 완료 안내만 나오며 돈300·약4·볼5 유지.
6. 이상해씨 정보에서 `배울 수 있음 · 덩굴채찍` 확인. 기술 배우기에서 세 번째 빈칸에 확정 학습. 기존 몸통박치기·울음소리 보존, 안내가 다음 진화 Lv.16 이상해풀로 전환됨을 화면 확인.
7. 강석에게 걸어가 도전. 세 번째 덩굴채찍으로 꼬마돌·롱스톤 각각 한 번, 두개도스 두 번 공격하여 승리. 이상해씨 Lv.10 HP35/35·XP60, 약4 유지, 콜배지·스텔스록 TM·돈1740. 상대가 첫 턴 스텔스록을 사용해 이 준비 파티에서는 실제 HP 손실이 없었다.
8. 퍼즐 재방문·저장 재접속에서 stage2/right true·덩굴채찍3칸·배지·상금 유지. 브라우저 오류·경고0건. 화면은 도구 출력으로 확인했고 별도 PNG 파일은 만들지 않았다.

<a id="record-lead-0016-남은-작업"></a>
#### 남은 작업

이상해씨가 새 게임에서 Lv.9까지 성장해 덩굴채찍을 관장전 전에 준비하는 동선과 현행 꼬부기 자연 경로는 아직 별도 검증이 필요하다. 준비 저장의 강석전 무피해 승리를 일반 난이도 수용으로 확대하지 않는다. 탄차는 두 단계 선택 체험이며 필수 관장 잠금이나 탑승형 퍼즐이 아니다. 방어 상승이 이미 +3인 경우 성공 대사를 반복하는 기존 전투 결함은 이번 범위에 넣지 않았고 다음 수정 후보로 남긴다.

---

<a id="record-lead-0017"></a>
## lead-0017

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0017.md`

<a id="record-lead-0017-lead-0017--방어-상한-예고와-현행-꼬부기-자연-첫-배지"></a>
### lead-0017 — 방어 상한 예고와 현행 꼬부기 자연 첫 배지

<a id="record-lead-0017-구현과-역할"></a>
#### 구현과 역할

Core가 src/battle.ts, src/battle-hints.ts, tests/defense-preview.test.ts를 담당했다. Map·Story·Art는 읽기 전용 검토, Lead는 자연 진행·준비 저장 기능 QA·전체 검사·문서를 담당했다. 기존 미커밋 변경과 자연 저장은 보존했다.

- 아군과 상대의 방어 상승이 이미 +3이면 성공 대사 대신 더 이상 올라가지 않는다고 알린다. 최대 단계·피해 공식·턴 소비·상대 행동은 유지한다.
- 기술 예고는 현재→다음 방어 단계 또는 최대 상태, 상승을 적용한 뒤의 반격 후 HP/기절을 표시한다. 입력 상태를 변경하지 않는다.
- 저장 형식·맵·스토리 플래그·배지 조건은 변경하지 않았다.

<a id="record-lead-0017-자동-검사"></a>
#### 자동 검사

- 전체 npm.cmd test: 509/509. tests/lead-0017-test-output.txt.
- npm.cmd run build: 성공, 74모듈.
- 신규 검사: 방어 0→1, 2→3, 3→3의 반격·턴·실제 피해, HP1/6/7 경계와 출전 인덱스1, 예고 입력 불변, 상대 방어 상한. Core 관련34/34도 통과했다.

<a id="record-lead-0017-lead-직접-자연-진행"></a>
#### Lead 직접 자연 진행

고유 ?qa=lead-0017-natural-squirtle에서 새 게임으로 시작했다. 준비 파일 가져오기·내부 상태 변경 없이 키보드와 공개 UI로 플레이했다. 초반 박사 소개 도중 Core 수정의 HMR이 발생해 소개 대화를 다시 열었으며, 파트너 수령 이후 소스 동결 상태로 진행했다.

1. 집→연구소 꼬부기Lv5(몸통박치기/꼬리흔들기)→도윤 출발 허가와 볼5·약2→서쪽길. 귀뚤뚜기Lv4 HP24에 몸통박치기6, 상대 발버둥8·반동6으로 HP12가 되어 볼1로 포획했다. 꼬부기HP12. 길 안내원에게 둘을 회복했다.
2. 도로 정비원 찌르꼬Lv4: 꼬리흔들기와 몸통박치기 뒤 꼬부기HP6, 상대HP17. 귀뚤뚜기로 교대해 발버둥 두 번으로 상대를 쓰러뜨렸으나 자신의 반동으로 기절했다. 생존한 꼬부기가 경험치40, 상금160을 받았다. 전멸은 아니며 축복센터에서 둘을 회복했다.
3. 방송국 직원의 동료 소개 활동으로 200원·볼2. 축복 풀밭 비버니Lv7 HP30을 꼬부기로 상대했다. 몸통박치기6/반격6, HP2에서 약1을 사용해18 회복 후 반격. 총 다섯 공격으로 승리해 경험치70, Lv5→7(HP14/26)이 되었다.
4. 정보 화면의 '배울 수 있음 · 거품'을 직접 보고 학습 메뉴에서 세 번째 빈칸에 추가했다. 몸통박치기·꼬리흔들기는 유지했다. 센터 회복 뒤 암반굴 안전길을 통과했다. 이번에는 동굴 야생전과 산행객을 선택하지 않았다.
5. 무쇠센터 등록·회복, 체육관 수련생 꼬마돌Lv7 HP40. 거품의 28 피해/반격 후17/26 예고와 실제 결과가 일치했다. 두 번째 거품12로 승리, 꼬부기Lv8 HP20/29·상금200. 센터 회복 후 광부의 건강한 두 동료·Lv8 준비 활동으로300원·약2.
6. 강석전은 꼬부기Lv8 HP29로 시작했다. 거품으로 꼬마돌22, 롱스톤24를 각각 한 번에 쓰러뜨렸다. Lv9가 된 뒤 두개도스26에 거품16, 상대는 스텔스록, 다음 거품10으로 승리했다. 관장전 교대·약 사용·실제 체력 손실 없음. 콜배지·스텔스록TM·1,440원과 다음 영원체육관 목표를 확인했다.
7. 계속 모험하기→체육관 밖 무쇠시티(6,26)→빠른 저장→같은 URL 재접속. 꼬부기Lv9 XP70 HP32/32와 거품 세 번째 칸, 귀뚤뚜기Lv4 HP24/24, 2,300원·볼7·약4·배지·TM·주민 보상 및 수련생 승리 플래그가 유지됐다. 최종518걸음. 게임 기록 약1,018초는 도구 조작/대기 시간이 섞여 있어 일반 이용자 소요 시간으로 보지 않는다.

<a id="record-lead-0017-lead-방어-기능-qa-준비-저장"></a>
#### Lead 방어 기능 QA (준비 저장)

별도 ?qa=lead-0017-defense-cap에서 scripts/lead-0017-fixtures.ts가 생성한 tests/lead-0017-fixtures/defense.json을 공개 파일 가져오기로 불러왔다. 꼬부기Lv10 HP35, 몸통박치기/껍질에숨기, 무쇠 수련생 앞 위치다. 방어 단계는 파일에서 설정하지 않았고 실제 기술 사용으로 쌓았다.

- 0→1: HP35에서 반격 후27/35 예고, 실제8 피해.
- 1→2: 실제7 피해, HP20.
- 2→3: 반격 후14/35 예고, 실제6 피해·방어3·턴3.
- 3→3: '방어 상승은 이미 최대', 반격 후8/35. 실제 상승 불가 대사·6 피해·방어3 유지·턴4.
- 반복해 HP2에서 '반격 후 기절 (HP 0)' 확인. 실행 후 실제 남은 HP2만 피해, 기절과 센터 복귀·HP35 회복 확인.
- DS 두 줄 힌트와 기술 선택, 대사 화면을 직접 캡처해 읽었다. 스크린샷은 도구 결과이며 별도 PNG 파일 산출물은 아니다. 이번 회차 콘솔 로그 별도 조회는 하지 않았다.

<a id="record-lead-0017-남은-검증과-다음-우선순위"></a>
#### 남은 검증과 다음 우선순위

현행 꼬부기 자연 첫 배지 경로는 확인했다. 이것만으로 전체 첫 배지 구간을 최종 수용하지 않는다. 새 게임 이상해씨의 Lv9 덩굴채찍 준비·활용, 스타팅별 난이도 비교가 남는다.

꼬부기의 초반 일반전에서는 회복/동료 기절이 있었지만 강석은 물 기술 준비 후 무피해였다. 일반 연습 상대 HP40과 관장 꼬마돌HP22·롱스톤HP24, 관장 첫 스텔스록 행동이 만든 차이이므로 다음 난이도 검토 근거로 삼는다. 이 회차에 일괄 HP 변경은 하지 않았다. Map 검토의 주뱃 흡혈 고피해 우려는 계산 근거이며 이번 자연 동굴전 증거는 아니다.

학습 확인의 '거품를 배울까요?' 조사 오류를 실제 화면에서 관찰했다. 진행에 영향은 없으며 다음 문구 정비 후보로 남긴다. 탄차·두 번째 선택 연습전은 이번 자연 경로에서 건너뛰었고 이전 회차 증거와 구분한다. 후속 지방·다른 30통로 조우는 별도 미완료다.

---

<a id="record-lead-0018"></a>
## lead-0018

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0018.md`

<a id="record-lead-0018-lead-0018--강석의-위기-판단과-이상해씨-자연-덩굴채찍-경로"></a>
### lead-0018 — 강석의 위기 판단과 이상해씨 자연 덩굴채찍 경로

<a id="record-lead-0018-변경과-배정"></a>
#### 변경과 배정

네 역할을 읽기 전용으로 검토했다. Core는 battle.ts·battle-hints.ts·roark-tactics.test.ts, Lead는 move-school.ts·four-moves.test.ts와 문서·직접 Gameplay 검증을 담당했다. Map·Story·Art는 수정하지 않았다. 시작 시 HEAD는 aabc12f였고 이전 회차 구현 및 preferredMove/성장 후 학습 연결이 이미 포함돼 있었다. 기존 변경과 저장을 보존했다.

- 강석전만 출전 상대가 배운 기술의 최대 피해와 현재 남은 HP를 비교한다. 다음 공격을 버티지 못할 상태라면 첫 행동의 스텔스록 우선 선택을 생략하고 기존 최대 피해 공격을 고른다. 건강한 상태의 설치기·다른 관장/트레이너/야생 판단은 유지한다.
- 공격 기술 예고는 해당 공격 후 상대 HP를 적용해 반격을 계산한다. 흡수·반동·마무리 예고도 같은 판단을 사용한다. 교대 예고는 실제 교대처럼 들어올 동료의 공격 하락도 초기화해 위협 판단과 일치시킨다.
- 강석 팀·레벨·HP·상금·배지·TM·도전 조건은 유지한다. 새로운 이야기·퍼즐 잠금·필수 포획은 없다.
- 기술 학습의 확인/성공 4곳과 비교 선택 1곳은 기존 withParticle로 받침에 맞는 을/를·과/와를 쓴다. '덩굴채찍을 배울까요?', '발버둥과 비교'가 된다. preferredMove·세션 검증·학습 확인과 저장은 유지한다.

<a id="record-lead-0018-자동-검증"></a>
#### 자동 검증

Core 실행 결과: 관련40/40, 전체 npm.cmd test 515/515, npm.cmd run build 성공. 수정 소스를 동결한 뒤 Lead가 diff와 신규 테스트를 검토하고 git diff --check를 통과했다. 이 회차 별도 전체 테스트 로그 파일은 생성하지 않았다.

신규6검사는 강석 거품 피격 후 공격 전환과 HP13 예고, 위협 경계/건강할 때 설치기, 다른 상대 AI 유지, 흡수·반동·마무리, 방어·약·교대 예고와 입력 불변을 포함한다. 조사 수정의 기존 네 기술 비교 기대값도 함께 갱신했다.

<a id="record-lead-0018-lead-자연-직접-플레이"></a>
#### Lead 자연 직접 플레이

고유 ?qa=lead-0018-natural-bulbasaur. 새 게임에서 시작해 준비 파일 가져오기나 내부 상태 변경 없이 키보드·공개 UI로 진행했다. 초반에 소스 수정이 병행됐고 이후 동결했다. 도구의 30초 제한으로 두 번 연결이 재설정됐지만 같은 탭의 대화/전투를 관측하고 이어갔다. 무중단 단일 실행이나 일반 이용자의 소요 시간으로 확대하지 않는다.

1. 집→연구소 이상해씨Lv5→도윤 출발 준비→서쪽길. 비버니Lv3 HP18을 몸통박치기 두 번으로 HP6까지 낮춰 볼1로 포획했다. 이상해씨HP12, 길 안내원 회복.
2. 서쪽 야생 꼬몽울Lv3: 몸통박치기7회, 상대 흡수는 피해1/회복1. 승리 경험치30, 이상해씨HP14. 비버니Lv3은 세 번 공격해 승리, 경험치30으로 Lv6 XP10 HP9. 안내원 회복.
3. 도로 정비원 찌르꼬Lv4: 울음소리1+몸통박치기4, HP5에서 약1(18회복) 사용. 승리 후 Lv6 XP50 HP11, 상금160. 축복센터 회복·약 보충과 방송국 직원 동료 소개 보상200원·볼2.
4. 축복 풀밭 찌르꼬Lv7: 울음소리와 공격 후 HP7에서 한 번 더 공격해 이상해씨 기절. 이는 Lead의 무리한 선택이었다. 비버니로 도망쳐 센터에서 회복했다. 전멸/진행 차단으로 기록하지 않는다.
5. 다음 찌르꼬Lv6: 울음소리로 반격7, 몸통박치기5회, HP2에서 약1로20 회복. 승리 Lv7 XP50 HP4. 센터 회복.
6. 찌르꼬Lv4: 몸통박치기4회로 승리, Lv8 XP20 HP8. 센터 회복. 비버니Lv7: 몸통박치기5회, 반격6씩 네 번, 승리 Lv9 XP10 HP8/32.
7. 승리 화면의 기술 배우기→이상해씨→덩굴채찍 자동 선택을 직접 확인했다. '덩굴채찍을 배울까요?'와 '덩굴채찍을 배웠다!' 문구, 기존 몸통박치기/울음소리를 유지한 세 번째 칸 추가를 화면과 상태로 확인했다.
8. 축복센터 회복→암반굴 안전길→무쇠센터 등록→광부의 두 동료 회복/Lv8 준비 활동으로300원·약2. 동굴 야생/산행객·체육관 선택 연습전/탄차는 이 경로에서 건너뛰었다.
9. 이상해씨Lv9 HP32로 강석 도전. 덩굴채찍으로 꼬마돌22·롱스톤24를 각각 한 번에 쓰러뜨려 Lv10 HP35. 두개도스전은 '18 피해 / 반격 후 HP16/35' 예고가 표시됐다. 실제 두개도스HP8, 박치기19, 이상해씨HP16으로 일치했다. 다음 덩굴채찍8로 승리했다. 관장전 약·교대 없음.
10. 콜배지·스텔스록TM·1,440원 및 다음 영원체육관 목표 확인. 계속 모험하기→무쇠시티(6,26)→빠른 저장→재접속. 이상해씨Lv10 XP70 HP16/35·덩굴채찍3칸, 비버니Lv3 HP18/18, 2,100원·볼7·약4와 배지/TM/주민 플래그 유지. 최종641걸음. 콘솔 warn/error 조회 결과0.

<a id="record-lead-0018-수용-범위와-다음-단계"></a>
#### 수용 범위와 다음 단계

새 게임에서 이상해씨 자신의 덩굴채찍을 준비하고 첫 배지를 얻는 남은 자연 경로를 이번에 확인했다. 기술 준비까지 야생5승(꼬몽울3·비버니3·찌르꼬6·찌르꼬4·비버니7)+도로 정비원1승으로 총270경험치를 얻었다. 별도 포획1전·이상해씨 기절 후 도망1전은 성장 경험치에 포함하지 않는다. 여행 전체 약2개를 사용했고 무료 회복을 반복했다.

세 스타팅 시작 파티의 자연 도달 증거는 모였으나 새 강석 판단을 적용한 꼬부기/파이리 파티의 직접 재검증과 구간 난이도 최종 수용은 남는다. 이번 관장전 한 차례 반격은 확인했으며 HP를 일괄 강화하지 않았다. 다음은 기존 준비 파티의 변경된 관장전 소모를 비교하고, 이상해씨 덩굴채찍 전 반복 육성의 부담을 평가한다. 첫 배지의 재검증을 마친 뒤 영원숲·영원시티 구간으로 이어간다.

---

<a id="record-lead-0019"></a>
## lead-0019

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0019.md`

<a id="record-lead-0019-lead-0019--영원숲-여행길과-풀-타입-체육관-외관"></a>
### lead-0019 — 영원숲 여행길과 풀 타입 체육관 외관

<a id="record-lead-0019-구현"></a>
#### 구현

네 역할의 읽기 전용 검토 뒤 Map에 숲 레이아웃·연결·검사, Art에 체육관 외관, Lead에 직접 플레이·준비 저장·통합 문서를 배정했다. Core·Story는 읽기 전용으로 마쳤다. 기존 미커밋 변경과 저장을 보존했다.

- 영원숲을 20×18에서 32×34로 확장했다. 기존 북쪽 길·안내원·조사물·풀밭과 유효 저장 좌표를 보존하고 남쪽 입구를 (10,32), 진입점을 (10,31)로 옮겼다. 축복시티 연결을 함께 갱신했다. 영원시티 북쪽 연결은 그대로다.
- 새 동쪽 굽은 안전길과 서쪽 풀밭 지름길, 동쪽 풀밭 샛길을 연결했다. 남북 안전 경로는 54걸음, 풀밭 경유 최단 경로는 32걸음이다. 이는 지도 계산이며 실제 플레이 소요 시간이 아니다. 풀밭은 기존 12칸에 서쪽 35칸·동쪽 18칸을 더했다. 기존 S05 여섯 종·Lv10~14 조우표를 쓴다.
- 영원체육관에 초록 유리 지붕·잎 문양·석조 입구·창문·화단을 그렸다. 기존 문·충돌·관장전·실내는 유지한다. 내부 테마 개선과 두 번째 배지 자연 완주는 후속 작업이다.
- 저장 revision 24를 유지한다. 새 이야기·트레이너·보상·필수 진행 조건을 추가하지 않았다.

<a id="record-lead-0019-준비-파티의-강석-회귀-검사"></a>
#### 준비 파티의 강석 회귀 검사

공개 파일 가져오기로 별도 `?qa=lead-0019-roark-parties`에서 실행했다. 생성 근거는 `scripts/lead-0019-fixtures.ts`, 입력 파일은 `tests/lead-0019-fixtures/`다. 새 게임 자연 육성 완주와 구분한다.

- 꼬부기Lv8·귀뚤뚜기Lv4: 거품으로 꼬마돌22·롱스톤24를 마무리하고 Lv9. 두개도스는 피해16·반격 후 HP13/32 예고와 실제 박치기19가 일치했다. 다음 거품10으로 승리. 공격4회·약/교대 없음. 최종 꼬부기Lv9 XP70 HP13/32, 1,740원·볼5·약4·배지/TM.
- 파이리Lv8·꼬몽울Lv8: 즉시 꼬몽울로 교대해 스텔스록을 받고 흡수7회로 승리했다. 꼬마돌18+4, 롱스톤18+6, 두개도스9+9+8. 최종 파이리XP25 HP28/28, 꼬몽울Lv9 XP45 HP18/54, 1,740원·볼5·약4·배지/TM. 마지막 흡수 직후 HP15에서 레벨 상승으로18이 된 것은 회복 예고 오류가 아니다. 약 사용 없음. 콘솔 경고/오류0.

<a id="record-lead-0019-기존-자연-저장을-이어-직접-이동"></a>
#### 기존 자연 저장을 이어 직접 이동

`?qa=lead-0018-natural-bulbasaur`를 이어서 파일 가져오기나 내부 상태 변경 없이 키보드·공개 UI로 진행했다.

1. 무쇠센터 회복→암반굴 안전길→축복시티→확장된 영원숲 (10,31). 남쪽 출입구를 통해 축복시티와 왕복했다.
2. 동쪽 안전길을 돌아 북쪽 출구까지 실제로 걸었다. 이 경로는 야생전 없이 통과했다. 전체 지도 화면도 확인했다.
3. 영원시티 (14,31) 도착→체육관 외관 화면→입장→퇴장 (6,25). 외관과 문 연결을 확인했으며 실내를 새로 구현했다고 간주하지 않는다.
4. 영원시티 남문에서 숲 (10,3)으로 돌아와 동쪽 풀밭 (27,26)의 실쿤Lv12, 서쪽 풀밭 (7,22)의 카스쿤Lv11을 자연 조우했다. 각각 도망친 뒤 본길에 합류했다. 이 검사는 새 위치의 조우·복귀이며 전투 난이도 수용이 아니다.
5. 기존 안내원 (12,7)의 회복·남북 길 안내 대화 확인→영원시티→센터 회복·귀환 지점 등록→밖 (8,9)에서 빠른 저장·재접속.
6. 최종 이상해씨Lv10 XP70 HP35/35·덩굴채찍 포함3기술, 비버니Lv3 HP18/18, 2,100원·볼7·약4·콜배지/TM, 영원센터 귀환 지점 유지. 실쿤·카스쿤은 도감 발견만 추가됐다. 재접속 후 콘솔 경고/오류0.

소스 교체 시기에 브라우저 도구 응답 지연으로 한 번 연결을 복구하고 같은 저장을 이어갔다. 무중단 실행이나 일반 이용자의 플레이 시간으로 해석하지 않는다.

<a id="record-lead-0019-검증과-후속"></a>
#### 검증과 후속

초기 전체 검사에서 옛 숲 크기/조사물 개수를 가정한 기대값과 새 나무 군락의 접근 불가능한 조사 면을 발견했다. 기대값을 갱신하고 새 군락의 실제 접근 가능한 면만 조사 대상으로 유지했다. 접근 불가능한 57면을 등록에서 제외했으며 기존 조사물과 바닥은 유지했다. 수정 후 Map 실행 결과 전체 **516/516 테스트·빌드 통과**, 관련19/19 통과. Lead는 최종 diff와 공개 브라우저 저장 복원을 확인했다. `tests/lead-0019-test-output.txt`는 수정 전 실패 로그이며 최종 성공 로그로 해석하지 않는다. 기존 숲 검사 파일을 확장했으므로 검사 수 증가와 추가 기능 수는 같지 않다.

세 스타팅의 자연 첫 배지 증거와 변경된 강석의 다른 두 준비 파티 회귀 근거를 연결했다. 반복 육성 부담·전체 난이도 최종 수용은 별도이며 다음 구현은 영원숲 동료 준비→영원시티 체육관 경험으로 이어간다. 다른 30통로 조우와 후속 지방 전체 완료를 의미하지 않는다.

---

<a id="record-lead-0020"></a>
## lead-0020

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0020.md`

<a id="record-lead-0020-lead-0020--영원체육관의-온실-공간과-도전-준비"></a>
### lead-0020 — 영원체육관의 온실 공간과 도전 준비

<a id="record-lead-0020-배정과-범위"></a>
#### 배정과 범위

네 역할 읽기 전용 검토와 Lead의 실제 기존 실내·안내원·관장 준비 화면 확인 뒤 개선 범위를 선정했다. Art는 eterna-gym-art.ts·sinnoh-maps.ts·renderer.ts와 전용 렌더 검사, Core는 gardenia-preparation.ts·sinnoh-story.ts와 준비 안내 검사, Lead는 직접 플레이·준비 파일·통합 문서를 담당한다. 기존 미커밋 변경과 자연 저장을 보존한다.

기존 영원체육관은 무쇠 바위방에 반투명 초록색만 덮었으며, 안내원은 권장값10을 상대 레벨과 구분하지 않고 안내했다. 실제 유채 팀은 꼬몽울14·체리버15·로젤리아16이다. 새로운 필수 퍼즐·트레이너·이벤트·보상·도전 조건은 이번 범위가 아니다.

<a id="record-lead-0020-검증-기록"></a>
#### 검증 기록

자연 플레이는 기존 `?qa=lead-0018-natural-bulbasaur`를 이어간다. `?qa=lead-0020-preparation`은 공개 파일 가져오기로 만든 별도 준비 파티이며 자연 성장 완주와 구분한다. 준비 파일은 `scripts/lead-0020-fixtures.ts`로 생성한 `tests/lead-0020-fixtures/unlearned-ember.json`이다.

<a id="record-lead-0020-완료한-변경"></a>
#### 완료한 변경

- 영원체육관 전용 실내를 유리벽·밝은 석재 중앙길·낮은 식재대로 그렸다. 기존 바위 세 영역을 같은 막힌 칸 안에서 표현하며 17×16 크기·유효 바닥·NPC·문·저장을 유지한다. 기존 외관 함수는 보존했다.
- 유채전은 전용 온실 전투 배경을 사용한다. 포켓몬·HP창·대사보다 먼저 그리며 다른 전투장 분기는 유지한다.
- 안내원은 실제 팀 Lv14~16과 권장 Lv10을 구분한다. 현재 파티의 장착 기술, 지금 학습 가능한 기술 순으로 실제 유채 세 동료에게 유리한 불꽃/비행 공격 한 가지를 안내한다. 미학습이면 기존 포켓몬 정보의 기술 배우기 경로를 알려 준다. 적절한 기술이 없으면 기존 영원숲의 드문 세꿀버리와 바람일으키기를 소개한다. 추천으로 파티·기술·저장·도전 조건을 바꾸지 않는다. 승리 후에는 다음 모험 목표 확인으로 전환한다.

<a id="record-lead-0020-실제-플레이-결과"></a>
#### 실제 플레이 결과

1. 기존 자연 저장 이상해씨Lv10 HP35/35·비버니Lv3·약4로 온실의 입구/북벽/식재대·관장 접근 및 세꿀버리 대안 안내를 확인했다. 유채전 전용 배경과 HP/기술 메뉴 가독성을 확인했다.
2. 첫 도전은 꼬몽울 승리→체리버 두 번 공격까지 진행했다. 마지막 타입 오류 수정의 개발 서버 HMR이 전투를 종료했다. 이상해씨Lv11 XP40 HP3/38은 저장되어 있었고 센터에서 회복했다. 이 실행을 무중단 자연 완주로 기록하지 않는다. 임의 파일 가져오기나 내부 상태 변경은 없었다.
3. 모든 런타임 파일을 동결한 뒤 Lv11 XP40 HP38/38로 다시 도전했다. 꼬몽울은 몸통박치기9+9+9+3, 메가드레인 반격3씩 세 번과 상대흡수1씩. 승리 후Lv12 HP32/41.
4. 체리버는 몸통박치기9+9 이후HP6. 상처약으로6→26→반격13, 다시13→33→반격20. 몸통박치기9→반격후7, 마지막2로 승리했다. 회복 예고 HP13/41과 실제 결과가 일치했다.
5. 로젤리아 앞에서 약1로7→27→반격후24. 몸통박치기9+9+9+7로 승리. 반격3과 상대흡수1, 마지막 레벨 상승으로 이상해씨Lv13 XP20 HP18/44.
6. 최종 도전은 공격12회·상처약3개·교대0회였다. 비버니HP18/18 유지. 포리스트배지·풀묶기TM·1,920원, 다음 레릭배지 목표 확인. 승리 후 안내원 반응→출구→영원시티(6,25) 빠른 저장·재접속. 콜/포리스트배지·TM2개·4,020원·볼7·약1·영원센터 귀환 지점 유지. 재접속 후 콘솔 경고/오류0.
7. 별도 준비 파티는 파이리Lv10의 불꽃세례 미학습 안내→X 메뉴/포켓몬/정보/기술 배우기→빈 세 번째 칸 학습→필드 복귀→안내원의 '현재 기억하고 있는 기술' 전환을 직접 확인했다. 콘솔 경고/오류0. 자연 파이리 캠페인 완주가 아니다.

<a id="record-lead-0020-자동-검사"></a>
#### 자동 검사

최종 전체 **527/527 테스트 통과**. Lead 실행 로그: `tests/lead-0020-test-output.txt`. 신규11개는 안내5개와 렌더6개다. Art 최종 빌드 성공을 확인했다. 최초 통합 빌드의 미도달 eterna 비교 TS2367은 분기 제거로 수정했다. 최종 diff 검사 통과. 렌더 검사는 그림 경계·외관 불변·맵/저장 불변·다른 체육관/전투 분기 유지를 포함한다. 자동 검사와 위 직접 플레이 기록을 구분한다.

<a id="record-lead-0020-남은-범위"></a>
#### 남은 범위

영원 도시 안내원이 GS03·GS04 이후에도 멜리사를 권하는 기존 분기는 읽기 검토에서 확인했으며 이번 체육관 준비 개선과 별도다. 다른 30통로 조우·후속 지방 전체·스타팅별 전체 난이도 수용도 이번 완료 선언에 포함하지 않는다.

---

<a id="record-lead-0021"></a>
## lead-0021

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0021.md`

<a id="record-lead-0021-lead-0021--천관산-여행길과-후속-진행-안내"></a>
### lead-0021 — 천관산 여행길과 후속 진행 안내

<a id="record-lead-0021-배정과-확인한-문제"></a>
#### 배정과 확인한 문제

네 역할 읽기 검토와 Lead의 기존 천관산 화면 관찰 뒤 3개 범위를 선정했다. Map은 남쪽 확장과 연결·지도 검사, Art는 암반 지면/경계/전투장, Core는 영원·연고 후속 안내, Lead는 직접 여행·준비 파일·통합 문서를 담당한다. 기존 미커밋 변경과 자연 저장을 보존했다.

천관산은 기존20×18의 짧은 연결방이며 바위 장식 외 지면은 회색을 덮은 잔디, 전투는 초원 배경이었다. 북쪽 영원·남쪽 연고·동쪽 호수 연결 및 회복은 정상이다. 영원은 레릭배지 이후에도 멜리사, 연고는 코블배지 이후에도 자두를 다시 권하는 안내 오류가 있었다.

새 사건·트레이너·보상·필수 진행 조건은 추가하지 않는다. 기존 S15 조우 및 북쪽/동쪽 연결과 유효 저장 좌표 보존을 기준으로 한다.

<a id="record-lead-0021-검증-구분"></a>
#### 검증 구분

자연 여행은 `?qa=lead-0018-natural-bulbasaur`를 이어가며 파일 가져오기를 하지 않는다. 별도 `?qa=lead-0021-guide`는 `scripts/lead-0021-fixtures.ts`가 생성한 세 배지/네 배지/자료 전달 준비 파일을 공개 가져오기로 읽는다. 후속 안내 검증을 자연 배지 획득이나 자료 전달 완주로 간주하지 않는다.

<a id="record-lead-0021-구현-결과"></a>
#### 구현 결과

- 천관산20×30. 기존 유효 바닥·다섯 암반·조사ID0~4·회복 안내원(12,7)·북영원/동호수 출구를 보존했다. 남연고 출구(10,28)와 연고에서의 진입(10,27)을 함께 갱신했다. 신규 암반5개는 실제 접근 가능한 면만 조사 대상으로 등록한다.
- 북쪽 진입에서 남쪽 출구 앞까지 안전길38걸음, 풀밭 경유32걸음이다. 지도 계산이며 실제 소요 시간이 아니다. 기존12칸 풀밭에 서쪽30칸을 추가하고 같은 S15 다섯 종·Lv13~17·비중을 쓴다. revision24 유지.
- 천관산만 전용 암반 지면·밝은 길·연속 지층 경계·야생전 배경을 쓴다. 다른 지역/체육관 배경과 기존 개별 바위 그림은 유지한다. 경계는 지도 크기를 따르며 열려 있는 출입 칸을 덮지 않는다.
- 영원GS03 이후·연고GS04 이후 안내는 기존 adventureObjective를 읽는다. 미보유배지→관측 자료→전달→조사선→자유 탐방으로 연결하며 현재 목적지의 실제 지도 이름도 명시한다. 기존 앞선 분기와 3초 소문, 진행 플래그·보상은 유지한다.

<a id="record-lead-0021-lead-직접-검증"></a>
#### Lead 직접 검증

1. 기존 자연 저장에서 영원센터 회복→북문→천관산(10,3). 수정 전 반복 암벽/회색 지면과 수정 후 지층·지면을 직접 비교했다. 기존(10,3) 저장 위치는 새 지도에서도 유지됐다.
2. 북문→영원(14,3)→산, 동문→호수(14,21)→산(17,9) 왕복. 확장된 동쪽 안전길을 걸어 연고(14,3) 도착, 연고 북문에서 산(10,27)으로 복귀. 안전길 이동 중 야생전 없음. 전체 지도와 남쪽 출입구 화면 확인.
3. 모든 소스 동결 후 서쪽 샛길(5,21)에서 꼬마돌Lv16 HP67을 자연 조우했다. 전용 암반 전투장과 기술/HP 표시 확인. 덩굴채찍 예고45·반격 후HP28/44와 실제45피해·돌떨구기16이 일치했다. HP22/67의 꼬마돌을 볼1로 포획했다. 이상해씨HP28, 새 꼬마돌의 돌떨구기/웅크리기·천관산 만남 기록 유지. 경험치·상처약 소모 없음.
4. 풀밭 북쪽 합류→기존 안내원에게 전원 회복, 북/남/동 안내 유지 확인. 남쪽 큰 지층을(15,21)에서 왼쪽으로 조사해 안전길/샛길 합류 단서 확인. 다시 연고→센터 회복·귀환 지점 등록→센터 밖(8,9) 빠른 저장·재접속.
5. 최종 이상해씨Lv13 XP20 HP44/44·비버니Lv3 HP18/18·꼬마돌Lv16 HP67/67, 콜/포리스트배지·TM2개·4,020원·볼6·약1·연고센터 귀환 지점 유지. 자연 탭 재접속 후 콘솔 경고/오류0. 이 회차 야생전은 동결 후 진행했고 중단 없이 포획했다.
6. 별도 준비 탭에서 영원 세 배지→장막체육관/자두, 연고 네 배지→장막시티/관측 연구원, 영원 자료 전달 후→운하시티/조사선 안내를 직접 확인했다. 첫 검증에서 자료 수령 목적지가 모호해 지도 이름을 추가한 뒤 다시 확인했다. 기존 3초 소문 유지, 콘솔 경고/오류0. 소스 교체 중 선택 파일이 초기화돼 다시 선택한 이력은 자연 저장이나 완료된 진행 변경이 아니다.

<a id="record-lead-0021-자동-검사와-남은-범위"></a>
#### 자동 검사와 남은 범위

Map 관련25/25·최종전체532/532·빌드, Core 관련14/14·빌드, Art 관련20/20·최종전체 **537/537·빌드** 통과. 최종 전체 검사는 Art 실행 결과이며 별도 전체 로그 파일을 만들지 않았다. Lead는 최종 소스와 diff 검사를 확인했다. 병렬 수정 중 발생한 모듈 로드 오류는 최종 전체 검사에서 재현되지 않았다.

멜리사 도전과 연고체육관 경험은 다음 작업이다. 현재 다른 시작 파티의 두 번째 배지, 전체 난이도 수용, 다른30통로 조우·후속 지방 전체 완료를 의미하지 않는다.

---

<a id="record-lead-0022"></a>
## lead-0022

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0022.md`

<a id="record-lead-0022-lead-0022--연고체육관과-고스트전-준비"></a>
### lead-0022 — 연고체육관과 고스트전 준비

완료: 2026-09-08. 최종 소스 동결 뒤 자연 멜리사 승리·저장 복원 및 별도 기술 학습 안내 QA를 완료했다.

<a id="record-lead-0022-배정과-범위"></a>
#### 배정과 범위

네 역할 읽기 검토와 Lead의 기존 외관·바위방·안내원 화면 확인 뒤 전용 체육관 미술과 준비 안내를 선정했다. Art는 hearthome-gym-art.ts·explore-art.ts·sinnoh-maps.ts·renderer.ts 및 전용/기존 영원 미술 검사, Core는 fantina-preparation.ts·sinnoh-story.ts 및 전용/기존 영원 안내 검사, Lead는 직접 플레이·준비 파일·문서를 담당한다. Map·Story는 읽기 전용이다. 기존 변경·저장·충돌·배지 조건을 유지한다.

기존 연고체육관은 일반 주택 외관, 보라색을 덧씌운 무쇠 바위방, 야외 전투장을 사용했다. 기존 안내는 권장값12와 상처약만 말하고 고스트전의 무효 공격을 설명하지 않았다. 새 퍼즐·트레이너·사건·진행 잠금·보상은 추가하지 않는다.

<a id="record-lead-0022-검증-구분"></a>
#### 검증 구분

자연 플레이는 `?qa=lead-0018-natural-bulbasaur`를 이어가며 내부 상태 변경이나 준비 파일 가져오기를 하지 않는다. 별도 준비 파일 `tests/lead-0022-fixtures/normal-only.json`은 비버니만 파티에 있고 스타팅은 PC에 보관한 상태이며 `scripts/lead-0022-fixtures.ts`에서 생성·저장 검증한다. 미학습/장착 안내의 기능 QA는 자연 육성 완주와 구분한다.

<a id="record-lead-0022-구현과-자동-검증"></a>
#### 구현과 자동 검증

`hearthome-gym-art.ts`는 기존 건물 범위 안의 보라색 극장 외관, 아치·커튼·카펫·받침대가 있는 실내와 멜리사 전투장을 제공한다. 실내 17×16, 세 장애물의 충돌, 문·NPC·기존 저장은 유지한다. 전용 분기를 explore-art·sinnoh-maps·renderer에 연결했다.

`fantina-preparation.ts`는 실제 Lv17~19 상대와 권장 Lv12, 노말·격투 무효 및 발버둥/변화기 예외를 설명한다. 현재 파티에서 세 상대 모두에게 피해를 줄 수 있는 장착 기술을 우선하고, 없으면 지금 배울 수 있는 기술을 안내한다. 실제 피해 계산으로 후보를 고르며 세 상대 모두에게 유리할 때만 약점이라고 표현한다. 회복·약 개수와 승리 후 기존 목적지도 안내한다. 전투 수치·조우·보상·진행 조건은 변경하지 않았다.

Core 관련 14개 검사·빌드, Art 관련 17개 검사 및 최종 전체 **548/548·빌드 통과** 보고를 확인했다. 기존 영원 검사의 일반 체육관 기대값에서 연고/멜리사만 새 전용 분기에 맞게 갱신했다. Map은 기존 유효 바닥 127칸·출입·저장 호환을 읽기 검토했다. 준비 파일은 스타팅을 PC에 보관하여 실제 저장 검증 계약을 충족한다.

<a id="record-lead-0022-lead-직접-자연-플레이"></a>
#### Lead 직접 자연 플레이

연고 상점에서 상처약 5개를 1,000원에 구매했다(4,020→3,020원, 약1→6). 개발 중 HMR로 앞선 상점 대화가 닫혔지만 구매·금전 차감은 없었다. 최종 소스 동결 후 구매와 관장전은 끊김 없이 진행했다. 체육관 전용 외관·실내·전투장을 화면에서 확인하고 안내원의 꼬마돌 돌떨구기 추천과 약6개 안내를 읽었다. 포켓몬 정보 메뉴에서 자연 포획한 꼬마돌을 선두로 옮겼다.

흔들풍손은 돌떨구기로 한 번에 쓰러뜨렸다. 고오스에게 16·16·2 피해를 주고 섀도볼28을 두 번 받아 꼬마돌이 Lv17 HP14/70이 되었다. 무우마 등장 사이 교대에서 조작상 이상해씨를 먼저 선택한 뒤 비버니로 교대했다. 비버니에게 고스트 공격이 0피해인 것을 확인하고 벤치 꼬마돌을 약3개로 회복했다. 꼬마돌로 교대·돌떨구기17 후 HP10에서 비버니로 돌아와 다시 약3개로 회복하고, 꼬마돌의 돌떨구기17·2로 승리했다. 세 참가자에게 경험치30씩 지급되고 비버니는 Lv4가 되었다. 추가 교대는 조작 선택이며 진행 오류는 없었다.

레릭배지·섀도볼TM·2,280원을 받았다. 안내원은 장막체육관과 코블배지로 목적지를 전환했다. 퇴장 후 연고시티(8,15)에서 빠른 저장·재접속하여 아래 상태의 보존을 확인했다.

- 꼬마돌 Lv17 XP50 HP10/70, 돌떨구기/웅크리기
- 이상해씨 Lv13 XP50 HP44/44, 몸통박치기/울음소리/덩굴채찍
- 비버니 Lv4 XP0 HP21/21, 기존 몸통박치기 두 칸
- 배지 GS01/02/03, 기술머신 3개, 5,300원, 볼6·약0, 연고센터 귀환점

<a id="record-lead-0022-별도-준비-파일-ui-검증"></a>
#### 별도 준비 파일 UI 검증

`?qa=lead-0022-preparation`에서 공개 파일 선택·불러오기 버튼으로 비버니 준비 파일을 가져왔다. 안내원은 풀묶기가 세 동료에게 피해를 주며 지금 배울 수 있다고 안내했다. 실제 포켓몬→정보→기술 배우기에서 풀묶기를 빈 세 번째 칸에 배우고 다시 말하자 “현재 기억하고 있는 기술” 및 회복·교대 안내로 바뀌었다. 자연 진행 탭에는 이 파일을 가져오지 않았다.

<a id="record-lead-0022-남은-검증과-다음-범위"></a>
#### 남은 검증과 다음 범위

이번 자연 파티의 세 번째 배지 경로를 확인한 결과이며 모든 스타팅·다른 파티의 난이도 수용을 뜻하지 않는다. 다음은 회복·보급 후 기존 장막 연결과 자두 도전 구간이다. 승리 후 기존 공통 목적지 문자열의 “자두과” 조사 표현도 후속 검토 후보다. 다른 30통로 조우와 후속 지방은 미완료이며 이번 종료 단계에서 브라우저 콘솔을 별도로 수집하지 않았다. 모든 담당 쓰기 배정은 종료한다.

---

<a id="record-lead-0023"></a>
## lead-0023

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0023.md`

<a id="record-lead-0023-lead-0023--장막-수련관과-네-번째-배지"></a>
### lead-0023 — 장막 수련관과 네 번째 배지

완료: 2026-09-08. 기존 자연 진행에서 연고→장막 안전길, 도로 포획·학습·자두 승리·회복·저장 복원을 확인했다.

<a id="record-lead-0023-검토와-배정"></a>
#### 검토와 배정

Art·Core 읽기 검토와 Story→Map 순차 검토를 세 담당 슬롯으로 수행했다. Lead는 실제 도로와 개선 전 장막체육관을 확인했다. 도로54×30의 안전길·풀밭 샛길은 이미 있으므로 불필요한 확장을 하지 않았다. 장막체육관의 일반 도시 건물·바위방·야외 전투장과 권장Lv15만 말하던 안내를 선정했다. QA 담당은 배정하지 않았다.

Art 소유는 veilstone-gym-art.ts·explore-art.ts·sinnoh-maps.ts·renderer.ts와 전용 미술 검사 및 기존 영원/연고 미술 기대값이다. Core 소유는 maylene-preparation.ts·sinnoh-story.ts·adventure-guide.ts와 준비·목표 조사 검사다. Lead는 별도 준비 파일·직접 QA·문서·상태를 담당했다. 기존 다른 회차 변경은 보존했다.

<a id="record-lead-0023-구현"></a>
#### 구현

- 기존81×108 건물 범위 안의 목조 수련관 외관,17×16 목재/매트 실내, 자두 전용 실내 전투장을 연결했다. 기존 세 바위의 막힘 범위에 낮은 수련도구대를 그렸다. 문(7,26), 실내문(8,15), NPC·충돌·유효 바닥·저장·다른 장소 미술은 유지했다.
- 안내원은 실제 상대Lv21~23과 권장Lv15를 구분하고 드레인펀치의 HP흡수와 반격 예고를 설명한다. 실제 피해/상대HP 비율로 현재 장착 공격 하나와 더 강한 현재 학습 가능 공격을 해당 상대명·피해량과 함께 제시한다. 모든 상대에게 유리하거나 승리를 보장한다고 표현하지 않는다. 기존 도로 요가랑/염동력→알통몬, 포니타/불꽃세례→루카리오의 역할은 실제 조우·상성·기술과 파티 준비 상태에 따라 안내한다. 회복·약 개수와 승리 후 관측 연구원 목적지도 연결했다.
- 기존 withParticle로 공통 목표의 관장 이름 조사를 고쳤다. 실제 화면의 “관장 자두와 이야기하자”를 확인했다. 전투 계산·상대 팀·도전 조건·보상·새 사건은 변경하지 않았다.

<a id="record-lead-0023-자동-검증"></a>
#### 자동 검증

Core 관련25/25·빌드, Art 관련23/23 및 최종 전체 **560/560·빌드83modules 통과** 보고를 확인했다. 기존 영원/연고 미술 검사의 장막 일반방·구름 기대만 전용 그림에 맞게 갱신했다. Lead의 scripts/lead-0023-fixtures.ts 실행으로 준비 파일 기술·저장 검증도 통과했다. 자동 계산 결과는 아래 자연 진행 증거와 구분한다.

<a id="record-lead-0023-lead-자연-플레이"></a>
#### Lead 자연 플레이

고유 저장 `?qa=lead-0018-natural-bulbasaur`를 이어가며 내부 상태 변경이나 준비 파일 가져오기를 하지 않았다. 연고센터에서 꼬마돌을 회복하고 동쪽도로 북쪽 안전길로 장막에 도착했다. 개선 전 체육관의 외관·실내·공통 안내를 화면에서 확인했다. 장막 상점에서 상처약10개를2,000원에 구입(5,300→3,300원), 센터 회복과 귀환점 등록을 했다. 소스 교체 중 상점 대화가 닫힌 뒤 메뉴 상태를 확인하고 이동을 재개했다. 구매는 한 번만 반영됐다. 최종 소스 동결 뒤 포획·학습·관장전은 HMR 중단 없이 진행했다.

도로 남쪽 풀밭에서 스컹뿡18/19를 만나 도망쳤다. 포니타18 HP67에 꼬마돌 돌떨구기35를 주고 불꽃세례7을 받은 뒤 볼1개로 포획했다. 델빌19는 도망쳤다. 요가랑18 HP81은 첫 볼 실패·꼬마돌 염동력17 피해 후 두 번째 볼로 포획했다. 볼은6→3, 꼬마돌HP70→46이 됐다. 기존 도로 출구로 장막에 돌아와 모두 회복했다.

포켓몬 정보에서 요가랑을 선두로 두고 새 수련관 외관·실내·안내원을 확인했다. 안내원이 알려 준 멜리사 보상 섀도볼TM을 요가랑의 세 번째 기술로 배웠다. 다시 말하면 “장착 · 요가랑의 섀도볼 / 요가랑HP38 중38피해”로 바뀌었다. 관장전의 반격 없음 예고와 실제 피해가 일치했다.

자두전은 요가랑의 섀도볼38로 첫 상대를 한 번에 쓰러뜨리고, 염동력35·5로 알통몬을 쓰러뜨렸다. 지구던지기22를 한 번 받고 Lv19 HP62/84가 됐다. 루카리오 등장 사이 포니타로 무료 교대하여 불꽃세례28·28·16으로 승리했다. 드레인펀치는31피해와15흡수를 두 번 보여 주었고, 루카리오HP42→29→16→0·포니타HP67→36→5였다. 전원 생존·상처약 사용0, 코블배지·드레인펀치TM·2,760원 획득을 확인했다.

안내원은 장막 관측 연구원에게 가도록 바뀌었다. 센터에서 모두 회복한 뒤 장막(8,9)에서 빠른 저장·재접속하여 다음 상태를 확인했다.

| 동료 | 레벨 / XP | 회복 후 HP | 기술 |
| --- | --- | --- | --- |
| 요가랑 |19 /40|84/84|염동력·판별·섀도볼|
| 꼬마돌 |17 /50|70/70|돌떨구기·웅크리기|
| 이상해씨 |13 /50|44/44|몸통박치기·울음소리·덩굴채찍|
| 비버니 |4 /0|21/21|기존 몸통박치기 두 칸|
| 포니타 |18 /110|67/67|불꽃세례·꼬리흔들기|

배지GS01~04·TM4개·6,060원·볼3·약10·장막센터 귀환점을 보존했다. 관측 자료 수령 플래그는 아직 없다.

<a id="record-lead-0023-별도-준비-파일-qa"></a>
#### 별도 준비 파일 QA

`?qa=lead-0023-preparation`에서 공개 파일 가져오기로 포니타18/스타팅PC 준비 파일을 불러왔다. 미학습 불꽃세례의 루카리오28피해와 학습 경로 안내를 읽고, 실제 메뉴의 두 번째 기술 페이지에서 세 번째 칸에 배웠다. 다시 안내원에게 말하면 장착 불꽃세례·28피해로 전환됐다. 이는 별도 기능 QA이며 자연 파티에는 파일을 가져오지 않았다.

<a id="record-lead-0023-남은-검증"></a>
#### 남은 검증

이 자연 파티의 신오 네 배지 구간을 확인한 결과이며 다른 스타팅·모든 파티의 전체 난이도 수용을 뜻하지 않는다. 다음 범위는 기존 관측 자료 수령→축복 전달→조사선 연결이다. 선두 변경 성공문구의 “요가랑를”은 기존 별도 조사 오류로 후속 후보에 남긴다. 다른30통로 조우·후속 지방은 미완료다. 브라우저 콘솔은 이번 종료 단계에서 별도 수집하지 않았다. 모든 담당 소스·쓰기 배정은 종료한다.

---

<a id="record-lead-0024"></a>
## lead-0024

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0024.md`

<a id="record-lead-0024-lead-0024--관측-자료-전달과-조사선-항해"></a>
### lead-0024 — 관측 자료 전달과 조사선 항해

완료: 2026-09-08. 기존 자연 파티로 자료 수령→축복 전달→운하·갈색 조사선 왕복과 저장 복원을 확인했다.

<a id="record-lead-0024-배정과-구현"></a>
#### 배정과 구현

Art·Core 읽기 검토, Story→Map 순차 검토 및 Lead 자연 여행 뒤 항해 연출·기존 안내 오류를 선정했다. Core는 engine.ts·sinnoh-story.ts·신규 ferry-journey.ts와 관련 검사, Art는 ferry-art.ts·renderer.ts와 그림 검사, Lead는 team.ts 조사·직접 QA·준비 파일·문서를 담당했다. 기존 미커밋 변경을 보존하고 QA 담당은 배정하지 않았다.

조사선 선택 즉시 도시가 바뀌던 동작에 1.8초 항해 상태를 추가했다. 상단은 DS풍 배·물결·이동 방향, 하단은 운하항→갈색항 또는 역방향과 진행 표시를 그린다. 기존 화면·터치 버튼은 항해 중 표시하지 않는다. 시작 시 입력을 비우고 이동·메뉴·확인·취소·이전 터치 동작을 차단한다. 끝에서만 기존 도착(14,11)과 ferryPass를 한 번 저장하고 도착 대사를 보여 준다. 임시 상태는 저장에 넣지 않으며 restore·returnHome은 이전 항해를 취소한다. 중간 저장은 출발 상태를 보존한다.

관측 자료를 받은 뒤 전달 전에 연구원에게 다시 말하면 최초 수령 대사와 persist를 반복하지 않고 축복 전달 안내만 한다. 선두 변경 성공 문구는 기존 withParticle로 요가랑을·꼬마돌을 처리한다. 기존 자료·배지 조건, 무료 승선, 도착 위치, 일반 워프와 파티·돈·도구는 유지한다. 새 사건·항로·선실·보상·지역 잠금을 만들지 않았다.

<a id="record-lead-0024-자동-검증"></a>
#### 자동 검증

Lead team6/6, Core 관련39/39·빌드, Art 관련9/9 및 최종 전체 **569/569·빌드85modules 통과** 보고를 확인했다. 기존 즉시 도착 검사는 항해 완료 뒤의 동일한 저장 계약을 확인하도록 갱신했다. 단일 도착 저장, 오래된 콜백·중복 입력, restore·returnHome 취소, 양방향 그림·터치 차단을 검사했다. scripts/lead-0024-fixtures.ts로 별도 자료 보유 파일 생성·parseSave 검증을 통과했다.

<a id="record-lead-0024-lead-자연-진행"></a>
#### Lead 자연 진행

`?qa=lead-0018-natural-bulbasaur`의 기존 다섯 동료·네 배지를 이어갔다. 장막 연구원(16,14)에게 자료를 받은 뒤 장막→연고–장막 연결도로 안전길→연고→천관산 안전길→영원→영원숲 안전길→축복으로 직접 걸었다. 도중 소스 갱신·브라우저 제어 시간 초과가 있었지만 서버200과 저장 위치를 확인하여 영원숲에서 재연결했고 전투·자료 전달을 건너뛰지 않았다.

축복 연구 통로 안내원(16,14)의 두 페이지를 끝내 researchDelivered=true를 확인했다. 서쪽문→research_path→운하로 걸어 선원(16,14)을 만났다. 일반 운하–갈색 워프가 별도로 존재하므로 이것을 조사선 승선 증거로 사용하지 않았다.

- 취소: 운하에 머물고 ferryJourney=null, ferryPass 미설정 유지.
- 출항: elapsed0.0167/duration1.8/outbound=true, 출발 지도 운하 유지와 배·물결·운하항→갈색항 화면을 확인했다.
- 도착: 갈색(14,11), ferryPass=true, 도착 대사·빠른 저장·재접속 보존.
- 귀환: 갈색 선원 선택 뒤 반대 방향 배와 갈색항→운하항 화면, 운하(14,11) 도착 확인.
- 중간 저장: 다시 출항해 방향키·X를 입력해도 출발 좌표와 field 패널 유지. 항해 중 빠른 저장·재접속은 운하(16,15), ferryJourney=null로 복원되었다. 이미 얻은 ferryPass는 보존됐다.
- 선두 조사: 실제 포켓몬 정보에서 꼬마돌→요가랑 선두 변경 후 “꼬마돌을”, “요가랑을”을 확인하고 원래 순서를 복원·저장했다.

최종 자연 인계는 운하시티(16,15) 위쪽, 요가랑19 XP40 HP84/84·꼬마돌17 XP50 HP70/70·이상해씨13 XP50 HP44/44·비버니4 XP0 HP21/21·포니타18 XP110 HP67/67이다. 기술·배지4·TM4·6,060원·볼3·약10·장막센터 귀환점은 유지했다. observationCollected/researchDelivered/ferryPass=true, 운하·갈색 방문을 기록했다. 자연 탭 콘솔 warn/error 조회 결과는0개였다.

<a id="record-lead-0024-별도-준비-파일-검증과-남은-범위"></a>
#### 별도 준비 파일 검증과 남은 범위

`?qa=lead-0024-records`에서 공개 파일 가져오기로 자료 보유·미전달 상태를 불러와 연구원 재방문이 한 페이지 전달 안내인지 확인했다. 연구 전달 플래그는 생기지 않았고 콘솔 warn/error0개다. 이 파일을 자연 진행 탭에 가져오지 않았다.

현재 자연 파티의 네 배지 이후 자료 전달·조사선 왕복까지 확인한 결과다. 다른 스타팅의 전체 난이도 수용, 다른30통로 조우·관동 이후 본편은 여전히 미완료다. 갈색 도착은 기존 자유 탐방의 시작이며 사건 해결·엔딩으로 보고하지 않는다. 다음 후보는 갈색항 주변의 기존 여행·주민·연결도로 경험이다. 모든 담당 쓰기 배정을 종료했다.

---

<a id="record-lead-0025"></a>
## lead-0025

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/lead-0025.md`

<a id="record-lead-0025-lead-0025--갈색항-이후-탐방"></a>
### lead-0025 — 갈색항 이후 탐방

<a id="record-lead-0025-검토와-배정"></a>
#### 검토와 배정

Art·Core 및 Story→Map 읽기 검토와 Lead 자연 갈색 도착·주민/터미널 방문으로 범위를 정했다. 승선 이후 어디서든 왕복선만 권하고 목표 위치가 현재 발밑이 되는 문제, 공용 시청을 쓰던 여객 터미널 외관, PC 이름 조사를 선정했다. 새 관동 본편·체육관·보상은 추가하지 않는다.

Core는 adventure-guide.ts·journey-services.ts와 관련 검사(sinnoh-guide-progress.test.ts의 새 목적지 기대 포함), Art는 vermilion-terminal-art.ts·explore-art.ts 및 전용 검사, Lead는 자연 플레이·문서·상태를 담당한다. 기존 미커밋 변경을 보존한다. QA 담당은 배정하지 않았다.

갈색–블루 도로에는 기존 공통32×20 구조·풀밭·여행자·일회 상처약이 있지만 조우 풀은 없다. ENC-039 중앙 도로망 설계는 여러 도로를 묶고 런타임 밖 종과Lv27을 포함하므로 이번 안내/미술 변경에 임의로 연결하지 않는다. 낚시용 갈색/블루 설계도 풀밭 조우로 대체하지 않는다. 이 통로의 야생 만남은 미완료로 유지한다.

<a id="record-lead-0025-구현과-검증"></a>
#### 구현과 검증

완료: 2026-09-08. adventureObjective의 기존 배지·자료·승선 목표가 끝난 뒤 실제 getMap 워프를 같은 지방 안에서 너비 우선으로 탐색해 미방문 대표시설·숲을 안내한다. 센터·상점은 탐방 후보로 경쟁하지 않으며 회복/보급 안내는 유지한다. 현재 대표시설 안에서는 안내원과 전시를 둘러보는 목표를 유지하고, 밖으로 나가면 다음 미방문 장소를 찾는다. tourVisited는 입장 기록일 뿐 전시 열람 완료나 새 퀘스트 플래그가 아니다. 후보가 없으면 지도에서 원하는 곳을 고르는 자유 탐방으로 돌아간다. getMap이 잠긴 워프를 먼저 거르는 것을 마지막 검토에서 확인했다.

갈색 여객 터미널에 전용 주황 지붕·차양·수평창·원형창 외관을 연결했다. 기존148×188 건물 범위·문(31,14)·도시 충돌·실내·다른 시청은 유지한다. PC 보관/복귀 문구에 기존 withParticle을 적용했다.

Core 관련25/25·빌드, Art 관련21/21·빌드86modules, 최종 전체 **579/579 통과** 보고를 확인했다. 초기 전체1실패는 새 PC 검사 준비 상태의 출발 플래그 누락이었으며 준비 상태를 고친 뒤 전체 재검사에 통과했다. 실제 데이터/파티 규칙을 완화하지 않았다. 최종 diff 검사도 통과했다.

<a id="record-lead-0025-lead-자연-탐방"></a>
#### Lead 자연 탐방

`?qa=lead-0018-natural-bulbasaur`의 기존 파티로 운하 선원에게 승선을 선택해 갈색에 도착했다. 주민 여행객 대화, 기존 터미널 안내원과 공용 외관을 먼저 확인했다. 갈색센터 회복·귀환점 등록 뒤 새 터미널 외관과 같은 문으로 실내 진입을 확인했다. 소스 갱신 중 PC 대화가 닫힌 적은 있으나 그때 보관을 실행하지 않았다.

실제 M지도→목표 안내를 눌렀을 때 터미널 내부에서 현재 발밑이 아닌 안내원 접근면(9,8), 오른쪽 Z대화로 이어졌다. 안내원과 여객선 모형을 직접 조사했다. 퇴장 시 블루시티 수족관으로 목표가 바뀌고 갈색→갈색–블루 해안길→블루→수족관 경로를 표시했다. snapshot의 공개 navigation.tiles를 읽어 방향키로 실제 표시 길을 따라 걸었다. 도로에서도 목적지가 유지됐고 수족관 내부의 안내원 접근면까지 도착했다. 수족관 안내원과 푸른 수족관 전시를 조사하고 퇴장하자 회색시티 화석 박물관/회색–블루 암반굴로 다음 목표가 바뀌었다.

블루센터 회복·귀환점 등록 후 실제 PC에서 요가랑을 맡겨 “요가랑을 박스에 맡겼다”를 확인하고 다시 데려와 “요가랑이 파티로 돌아왔다”를 확인했다. 박스0·파티5 및 선두 요가랑의 원래 순서를 복원했다. 블루시티(8,9) 아래쪽에서 빠른 저장·재접속하여 파티·방문 기록·회색 박물관 목표를 확인했다. 별도 파일 가져오기나 내부 상태 변경은 하지 않았다. 자연 탭 콘솔 warn/error0개였다.

최종 인계: 요가랑19 XP40 HP84/84(염동력/판별/섀도볼), 꼬마돌17 XP50 HP70/70, 이상해씨13 XP50 HP44/44, 비버니4 XP0 HP21/21, 포니타18 XP110 HP67/67. 기존 기술·배지4·TM4·6,060원·볼3·약10·자료/승선3플래그 유지, 블루센터 귀환점. 갈색터미널/센터·해안길·블루/수족관/센터 방문 기록을 보존했다.

<a id="record-lead-0025-남은-범위"></a>
#### 남은 범위

이번 완료는 갈색→블루 시설 탐방과 안내 기능이며 새 관동 본편이나 조우 추가가 아니다. 갈색–블루의 야생 만남은 미완료다. 다음에는 회색 방향의 기존 여행을 검토하되, 반복 시설 안내만 확장하지 말고 관동 야생 만남을 위한 데이터·종·기술·레벨상한·자산 준비를 우선 조사한다. 다른 스타팅 전체 난이도 수용과 후속 지방도 별도다. 모든 담당 쓰기 배정을 종료한다.

---

<a id="record-user-20260907-core-battle-turn"></a>
## user-20260907-core-battle-turn

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/user-20260907-core-battle-turn.md`

<a id="record-user-20260907-core-battle-turn-core--반격피격기절-순서"></a>
### Core — 반격·피격·기절 순서

- 회차: `user-20260907-core-battle-turn`, 2026-09-07 사용자 직접 요청 “포켓몬 게임 같이 구현”.
- 최신 개발/스토리/운영 지침을 확인했다. Map/Art도 직접 요청을 진행 중이어서 Core는 전투 계산·안내·관련 테스트에 한정했다. Renderer·맵·그림·PROJECT_STATE.md·자동화는 수정하지 않았다. Art/Map의 상태 문의에 소스 안정화와 QA 진행 상황을 전달했다.

<a id="record-user-20260907-core-battle-turn-문제와-구현"></a>
#### 문제와 구현

1. 반격 기술 사용과 피해를 한 페이지에 표시해, 공격 대사에 이미 HP 0과 숨겨진 포켓몬이 보일 수 있었다. 반격 선언에는 기존 HP·개체를 유지하고, 다음 피해 페이지에서 HP와 효과를 반영한 뒤 기절·교대를 표시한다.
2. 남은 HP보다 큰 계산 피해를 대사·효과·미리보기에 표시했다. 이제 실제 손실 `min(남은 HP, 계산 피해)`를 표시한다. 공격 공식·최종 HP·기절·성장·도구 소비·포획 확률·보상은 유지한다.

상처약·일반 교대·포획 실패·변화 기술 뒤 반격에도 같은 순서를 적용한다. 무료 교대·거절·마지막 일격에는 추가 반격을 만들지 않는다. 결과는 대사 전에 한 번 확정하고 페이지 진행·재접속은 피해를 재적용하지 않는다.

변경 파일: `src/battle.ts`, `src/battle-hints.ts`, 새 `tests/battle-counter-order.test.ts`, 기존 `tests/battle-presentation.test.ts`, `tests/battle-hints.test.ts`, `tests/battle-effects.test.ts`, `tests/capture-motion.test.ts`, QA 저장 생성기 `scripts/core-battle-turn-fixtures.ts`, `DEVELOPMENT.md` 67절, `GAMEPLAY.md`.

<a id="record-user-20260907-core-battle-turn-자동-검증"></a>
#### 자동 검증

- 수정 전 새 회귀 5개 모두 실패: [출력](../../tests/core-battle-turn-before.txt).
- `npm.cmd test`: **282/282 통과**, 실패 0. 같은 시점의 Map/Art 검사 포함. [출력](../../tests/core-battle-turn-test-output.txt).
- `npm.cmd run build`: TypeScript·Vite 성공. [출력](../../tests/core-battle-turn-build-output.txt).
- 신규 5개는 여섯 턴 행동의 반격 전후 HP, 기절 전 출전 개체, 마지막 일격 피해·경험치, 낮은 HP의 반격 미리보기, 대사 진행·저장 복원 무중복을 검사한다.
- 기존 세 검사의 실패는 바뀐 반격 페이지 위치와 실제 손실 미리보기에 대한 기대를 보강해 해결했다. 포획 실패·효과 만료·전체 레벨/관장 피해 회귀를 유지했다.

<a id="record-user-20260907-core-battle-turn-실제-브라우저"></a>
#### 실제 브라우저

- QA: `http://localhost:5173/?qa=core-battle-turn-20260907`.
- 생성기로 만든 `tests/fixtures/core-battle-turn/faint.json`을 기존 파일 선택·불러오기 UI로 적용했다. 꼬부기 Lv8 HP2와 비버니 Lv8, 강석 앞 위치는 검증용 초기 조건이며 자연 육성 기록이 아니다. 기본 사용자 저장은 건드리지 않았다.
- 실제 키보드로 도전·꼬리흔들기·기절·교대·공격을 진행했다. 반격 선언 HP2/꼬부기 → 실제 2 피해/HP0 → 기절/꼬부기 유지 → 비버니 HP33 등장 순서를 화면과 관찰 상태로 확인했다.
- 비버니로 두 번 공격한 뒤 HP23에서 상처약 사용: 회복 HP33 → 반격 선언 HP33 → 피해 HP28을 확인했다. 약은 2개에서 1개로 줄었다.
- 남은 꼬마돌 HP4에 몸통박치기 선택 미리보기 “상대에게 4 피해 / 쓰러뜨리면 반격 없음”을 실제 화면에서 확인했다.
- 마지막 피해 페이지는 실제 4 피해/꼬마돌 HP0·비버니 HP28이었다. 대사 도중 새로고침 후 무쇠체육관 필드에서 HP0·28, 약1·볼5, 비버니 경험치50, 기존 플래그를 보존했다. 배지·상금은 지급되지 않았으며 다시 도전하면 기존처럼 첫 상대부터 시작한다.
- [화면 10장](../../tests/core-battle-turn-screenshots), [단계별 상태 및 콘솔](../../tests/core-battle-turn-playthrough.json). 브라우저 경고·오류 0건.

<a id="record-user-20260907-core-battle-turn-남은-범위와-다음-후보"></a>
#### 남은 범위와 다음 후보

- 관장전 일부 턴의 실제 검증이다. 야생 포획 실패·상처약·교대 등 경계는 자동 회귀 범위와 브라우저 기록의 해당 항목을 구분한다. D3 전체 모험 수용·전체 관장 연전·모바일 실기기 검증을 완료했다고 판단하지 않는다.
- 다음 Core 후보: 첫 콜배지까지 자연 진행하며 반복 전투의 대사 조작 횟수와 준비 동선을 검토한다. 타입 상성·PP·진화 등의 미결정 새 시스템은 이번에 추가하지 않았다.

---

<a id="record-user-20260907-core-controls"></a>
## user-20260907-core-controls

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/user-20260907-core-controls.md`

<a id="record-user-20260907-core-controls-core--걷기와-조사메뉴-입력-연결"></a>
### Core — 걷기와 조사·메뉴 입력 연결

- 회차: `user-20260907-core-controls`
- 요청: 사용자의 직접 요청 “포켓몬 게임 같이 수정 및 구현”. Core 담당의 기존 조작 불편 2개를 개선했다.
- 시작 시 다른 네 담당 작업은 앱 조회에서 idle이었다. PROJECT_STATE.md의 Story running 표기는 과거 배정 기록과 차이가 있었으며 이 파일은 수정하지 않았다. 다른 담당 호출·새 자동화 생성은 하지 않았다.

<a id="record-user-20260907-core-controls-문제와-변경"></a>
#### 문제와 변경

1. 걸음 중 Z/X/M을 누르면 `Engine.press`가 입력을 버렸다. 실제 QA에서 `ArrowRight+x` 후 한 칸은 이동했지만 `panel: field`에 남는 것을 재현했다. 이제 첫 요청 하나를 현재 걸음이 끝날 때 처리하고 추가 걸음은 시작하지 않는다. 조사 방향은 그대로 유지한다.
2. 대화/메뉴 선택과 문 전환 중 방향키를 필드 보행 Set에도 넣어 화면을 닫거나 문을 통과한 뒤 뜻하지 않은 이동이 가능했다. 잠긴 화면의 방향 입력은 보행에 보관하지 않으며 정리된 키의 OS 자동 반복은 새 보행을 시작하지 않는다. 포커스 이탈·저장 패널 진입·저장 복원 등에서는 보관 요청도 제거한다.

문 전환과 야생 조우는 보관한 요청보다 우선한다. 처리한 확인을 새 대화의 첫 페이지에 다시 적용하지 않는다. 저장 ID·형식·유효 진행·스토리·비주얼·맵 배치는 변경하지 않았다.

<a id="record-user-20260907-core-controls-수정-파일"></a>
#### 수정 파일

- `src/engine.ts`: 한 걸음의 확인/메뉴/지도 요청, 잠금 상태의 방향 입력 분리, clearInput.
- `src/main.ts`: blur/visibilitychange와 외부 UI focusin에서 보행/보관 요청 초기화.
- `tests/field-input.test.ts`: 입력·NPC 대화·조사·워프·야생 조우·복원·터치 콜백·일반 보행 회귀 11개.
- `DEVELOPMENT.md` 5·63절, `GAMEPLAY.md`: 확정된 조작 계약.

<a id="record-user-20260907-core-controls-자동-검증"></a>
#### 자동 검증

- 수정 전 최초 회귀 실행: 8개 중 6개 실패로 입력 누락·방향 잔류·전환 입력 문제 확인. 이후 NPC 접근 시나리오를 실제 걸음 중 대화로 보강하고 경계 회귀 3개 추가.
- `npm.cmd test`: **269/269 통과**, 실패 0. 출력: `tests/core-controls-test-output.txt`.
- `npm.cmd run build`: TypeScript 및 Vite 성공. 출력: `tests/core-controls-build-output.txt`.
- 기존 저장·첫 모험·전투·관장 연전·길안내·맵·성장 회귀를 포함한다.

<a id="record-user-20260907-core-controls-실제-브라우저-검증"></a>
#### 실제 브라우저 검증

- URL: `http://localhost:5173/?qa=core-controls-20260907`. 사용자 기본 저장을 수정·초기화하지 않았다.
- 입력은 실제 Canvas 키보드 조작으로 수행하고 `#field`의 관찰용 data-state 및 화면으로 확인했다. 런타임 강제 상태 변경은 사용하지 않았다.
- 한 걸음 뒤 X 메뉴 표시, 메뉴 방향+확인 후 제자리 유지, 걷는 중 Z로 창문 조사, 대화 방향+확인 후 제자리 유지, 걷는 중 M 지도 표시를 확인했다.
- 화면 증거: `tests/core-controls-screenshots/01-buffered-menu.png`, `02-buffered-investigation.png`, `03-buffered-map.png`.
- 계단 진입 중 `ArrowUp+x` 후 메뉴가 끼어들지 않고 `home (10,4)`로 도착, 걸음 수 10·필드 상태를 확인했다. 빠른 저장과 새로고침 뒤 같은 위치·걸음·빈 플래그를 유지했다. 브라우저 오류·경고 로그는 0개다.
- 문 전환 화면: `tests/core-controls-screenshots/04-door-priority.png`. 단계별 상태·수정 전 재현·최종 저장·콘솔은 `tests/core-controls-playthrough.json`에 기록했다.

<a id="record-user-20260907-core-controls-남은-검증과-다음-후보"></a>
#### 남은 검증과 다음 후보

- 이번 실제 플레이는 시작 구역 조작 검증이다. D3 전체 플레이 수용, 체육관까지 자연 진행, 모바일 실기기의 멀티터치·OS 장기 자동 반복은 이번에 완료했다고 판단하지 않는다. 야생 조우와 저장 복원 경계는 자동 회귀에 포함했다.
- 다음 후보: 기존 QA 인계의 첫 콜배지까지 자연 진행을 수행하면서 반복 전투의 조작 피로와 준비 동선을 확인한다. 미구현 타입 상성·PP·진화는 이번 요청에서 설계를 확정하거나 선행 구현하지 않았다.

---

<a id="record-user-20260907-core-party-summary"></a>
## user-20260907-core-party-summary

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/user-20260907-core-party-summary.md`

<a id="record-user-20260907-core-party-summary-core--파티-정보-비교"></a>
### Core — 파티 정보 비교

2026-09-07 사용자 직접 구현 요청. Map 상록숲 → Art 숲 테두리 → Core 순서로 공용 수정·검증을 분리했다. 앞선 작업이 끝나기 전에는 임시 작업본에서 준비했다.

<a id="record-user-20260907-core-party-summary-변경"></a>
#### 변경

기존 정보 화면에서 다른 친구를 비교하려면 목록으로 돌아가 다시 선택해야 했다. 위/아래 방향키와 **↑ 이전 / ↓ 다음** 터치 버튼으로 현재 파티 순서대로 정보를 넘기도록 했다. 끝에서 반대쪽으로 순환하며 기절한 개체도 표시한다. 위 화면의 개체·HP·순번과 아래 기술·경험치를 함께 갱신한다.

좌/우는 선두 지정·상처약 선택에 사용한다. 정보를 넘겨도 행동 선택을 유지하고 확인은 현재 개체에 적용한다. 선두 변경 뒤에도 같은 개체를 보여 주며 X로 목록에 돌아갈 때 선택을 유지한다. 대화·전투·이동·전환 중과 다른 패널에서는 넘기기 콜백을 차단한다. 한 마리 파티에는 넘기기 버튼이 없다.

- 코드: [Engine](../../src/engine.ts), [Renderer](../../src/renderer.ts)의 정보 화면 부분만 수정했다. Art의 숲 import·월드 레이어를 보존한 것을 반영 전 파일과 비교했다.
- 안내: [DEVELOPMENT 70절](2026-09-22-rebaseline/DEVELOPMENT.md#70-파티-정보-화면에서-이전다음-비교), [GAMEPLAY](../GAMEPLAY.md).
- 기존 파티·HP·도구의 저장 구조와 version 1 / worldRevision 20, 스토리·맵·전투 규칙은 유지한다. 비교 동작 자체는 진행을 변경하지 않는다.

<a id="record-user-20260907-core-party-summary-자동-검증"></a>
#### 자동 검증

- `npm.cmd test`: **293/293 통과**. [전체 결과](../../tests/party-summary-test.txt).
- `npm.cmd run build`: 성공. [빌드 결과](../../tests/party-summary-build.txt).
- 새 [파티 정보 검사](../../tests/party-summary-navigation.test.ts) 6개: 1~6마리 순환·기절 포함, 키보드와 터치, 표시 갱신과 진행 무변경, 회복 대상·거절, 선두·저장 복원, 잠금·잘못된 입력, 빈 파티/한 마리 버튼 제외.
- 기존 파티·회복·포획 결과·전투·입력·저장·맵·Art 회귀도 같은 전체 검사에 포함한다.

<a id="record-user-20260907-core-party-summary-실제-브라우저-검증"></a>
#### 실제 브라우저 검증

`http://localhost:5173/?qa=core-party-summary-20260907`에서 [준비 스크립트](../../scripts/party-summary-fixture.ts)의 [QA 저장](../../tests/party-summary-save.json)을 기존 파일 선택·불러오기 UI로 가져왔다. 건강한 꼬부기, HP 3/19 피카츄, HP 0/18 비버니와 상처약 2개로 시작했다. 사용자 저장은 사용하지 않았다.

| 관찰 | 확인 결과 |
| --- | --- |
| 01~03 | 꼬부기 → 키보드 피카츄 → 터치 비버니. 순번·HP·기술·경험치가 해당 개체와 일치 |
| 04~05 | 마지막에서 첫 번째, 첫 번째에서 터치 이전으로 마지막 순환 |
| 06 | 상처약을 선택한 채 위 방향으로 피카츄를 보면 행동 선택 유지 |
| 07 | 피카츄만 HP 3→19, 약 2→1. 회복 대화 중 아래 입력으로 대상이 바뀌지 않음 |
| 08 | 기절한 비버니의 상처약 사용 거절. HP 0·약 1 유지 |
| 09 | 피카츄 선두 지정 후 파티 순서 25/7/399, 정보는 피카츄 1/3 유지 |
| 10 | 꼬부기를 비교한 뒤 X로 목록 복귀. 두 번째 꼬부기 선택 유지 |
| 11~12 | 필드 복귀·빠른 저장·재접속. 순서 25/7/399, HP 19/20/0, 상처약 1 유지 |

[관찰 상태 12건](../../tests/party-summary-playthrough.json)과 [화면 12개](../../tests/party-summary-screenshots), [오류·경고 0건](../../tests/party-summary-console.json)을 남겼다. 비교만 한 01~06의 저장은 경과 시간 외에 시작 상태와 동일함을 검사했다. 임시 작업본의 5177 화면 검증과 별도로 공용 게임에서 위 절차를 수행했다. 임시 서버는 종료했다.

<a id="record-user-20260907-core-party-summary-남은-범위와-다음-후보"></a>
#### 남은 범위와 다음 후보

이번 변경의 검사에서 남은 실패는 없다. 실제 브라우저는 세 마리의 준비된 저장을 사용했으며 빈 파티·한 마리·여섯 마리와 잠금 경계 전체는 자동 검사 범위다. 실제 전투와 새 게임부터의 D3 전체 모험 수용은 이번에 재검증하지 않았다.

다음 후보는 포획 결과 → 정보 비교 → 여섯 마리 편성 → 다음 전투의 선두 출전을 잇는 실제 플레이 회귀다. 새로운 스토리나 전투 규칙을 추가하는 요청으로 해석하지 않는다.

---

<a id="record-user-20260907-map-feel"></a>
## user-20260907-map-feel

원래 문서: `docs/review-pending/2026-09-12/legacy-reports/user-20260907-map-feel.md`

<a id="record-user-20260907-map-feel-map--user-20260907-map-feel"></a>
### Map — user-20260907-map-feel

- 요청: 사용자의 직접 요청 “포켓몬 게임 같이 수정 및 구현”. 담당은 Map & Content Designer.
- 상태: 이번 범위 구현·회귀 검사·빌드·실제 브라우저 재검증 완료.
- 배정 확인: PROJECT_STATE에는 auto-0001-story running이 남아 있었으나 앱의 최신 상태에서 Story 작업 completed/idle을 확인한 뒤 수정했다. 총괄에 직접 요청 우선 작업을 알리려 했으나 총괄 작업이 archived여서 전달되지 않았다. PROJECT_STATE 수정·다른 담당 실행·자동화 생성은 하지 않았다.

<a id="record-user-20260907-map-feel-근거와-변경"></a>
#### 근거와 변경

1. 영원숲의 실제 화면이 넓은 십자형 길과 작은 풀밭만 있는 공간이었다. 기존 20×18 범위에 DS 나무 군락 네 곳, 굽은 흙길, 기존 풀밭으로 빠지는 샛길을 배치했다. 나무 그림·충돌·조사는 같은 배치 데이터에서 만든다. 기존 길 가장자리 조사 ID와 출구를 보존했다.
2. 직접 걸어 만난 안내원은 출구가 북쪽/남쪽인데도 ‘서쪽’으로 돌아가라고 말했다. 영원숲에서 북쪽 영원시티·남쪽 축복시티와 안전한 흙길을 안내하도록 수정했다. 회복·보충·전투·진행 조건은 유지했다.
3. 나무가 생긴 종전 바닥에서 저장한 진행을 보호하기 위해 맵 개정 18을 적용했다. 기존 이행 코드가 겹친 위치만 `(10,10)`으로 옮기며 다른 진행을 보존한다. 저장 필드나 별도 보상은 추가하지 않았다.

수정 파일: `src/explore-layouts.ts`, `src/explore-world.ts`, `src/explore-outdoors.ts`, `src/town.ts`, `src/sinnoh-story.ts`; 관련 회귀 검사 `tests/eterna-forest-layout.test.ts`, `tests/explore-layouts.test.ts`, `tests/explore-minimap.test.ts`. 문서 `DEVELOPMENT.md` 62절, `STORY.md` 55절, `WORLD_TOUR.md` 반영.

<a id="record-user-20260907-map-feel-검증"></a>
#### 검증

- `npm.cmd test`: **258/258 통과**. [출력](../../tests/eterna-forest-test-output.txt).
- `npm.cmd run build`: **통과**. [출력](../../tests/eterna-forest-build-output.txt).
- 처음 검사에서 지도 버튼 수 한 곳이 4→5로 달라졌다. 새 나무와 마주한 시작 위치에 조사 버튼이 생기는 정상 동작임을 확인하고 해당 조사 힌트도 명시적으로 검사하도록 갱신했다.
- 숲의 옛 바닥 좌표 전체에 대해 개정 17 저장의 파티·도구·배지·플래그·걸음·시간을 보존하는지 검사했다. 기존 맵 연결·사물 접근·지도·저장 회귀도 통과했다.

실제 QA URL: `http://localhost:5173/?qa=user-20260907-map-feel`.
공개 파일 불러오기 UI로 [개정 17 QA 저장](../../tests/eterna-forest-revision17-save.json)을 사용했다. 사용자 저장은 접근·초기화하지 않았다.

- 새 나무 위치 `(10,12)`의 저장을 `(10,10)`으로 안전하게 이행하고 꼬부기·도구·진행을 보존.
- 나무 충돌·조사, 안내원 대화, 북쪽 표지 접근 확인.
- 영원숲→축복시티→영원숲→영원시티→영원숲을 방향키로 직접 왕복. 흙길에서는 야생전 없음.
- 기존 선택 풀밭으로 들어가 여섯 풀밭 걸음 후 비버니 Lv.7 조우. 도주 후 숲으로 복귀.
- 지도에서 남쪽 축복시티 경로가 새 나무 왼쪽을 우회하는 것 확인.
- 개정 18 빠른 저장·새로고침 후 위치 `(10,10)`·파티·도구·방문 기록 보존 확인.

[관찰 20건](../../tests/eterna-forest-playthrough.json), [화면 4장](../../tests/eterna-forest-screenshots), [브라우저 경고·오류 0건](../../tests/eterna-forest-console.json).
브라우저 자동화 중 프레임이 늦게 갱신되어 한 이동 완료 대기가 만료됐지만, 최신 DOM과 화면에서 이동 완료를 확인하고 이후에는 각 걸음의 실제 완료를 관찰하며 진행했다. 게임 코드 오류로 판정하지 않았다.

<a id="record-user-20260907-map-feel-남은-범위와-다음-후보"></a>
#### 남은 범위와 다음 후보

- 이번 실플레이는 준비된 저장을 쓴 영원숲 검증이다. 새 게임부터 첫 배지 자연 진행, D3 전체 캠페인 수용, 다른 숲·도시의 화면 완성도는 완료 판정하지 않는다.
- 다음 우선 후보: 천관산 하부의 단순 직사각형 통로·암반 배치와 안내 문구를 실제 출구/조우 위치에 맞춰 점검. 새로운 지역이나 탄갱 사건을 선행 구현하지 않는다.
- 지도는 기존 통행 가능한 최단 경로를 사용한다. 흙길 밖의 짧은 잔디도 통행 가능하며 길안내의 흙길 우선 정책은 이번에 추가하지 않았다.

