# 원작 조사와 적용 근거

> **분류: 참고 자료.** 현행 결정은 [비전](../NEXUS_GOAL.md)·[서사 기준](../story/NEXUS_MAIN_STORY_CANON.md), 실제 현재 상태는 [PROJECT_STATE](../PROJECT_STATE.md)에서 확인한다. 상단은 2026-09-22 사용자 지정 참고군과 사용 기준이며, 아래 날짜별 내용은 당시 조사·구현 기록이다. 이번 문서 정리에서 외부 자료의 최신 내용·전체 소스·라이선스를 재검증한 것은 아니다.

## 적극 참고 원칙

새 제작 묶음의 조사·설계·구현 검토에서는 **관련된 아래 자료를 기본 참고군으로 적극 검토한다.** 원작 장소·진행은 사이트와 공략으로, 원작 구현·시스템 설계는 GitHub 소스로 대조한다. 기존 구현도 보존만을 목적으로 답습하지 않고 이 근거와 NEXUS의 채택 기준에 맞춰 재사용·수정 여부를 판단한다.

이 목록은 원작과 외부 프로젝트를 무조건 따르거나 매 작업마다 전부 열람하라는 뜻이 아니다. 작업의 질문을 먼저 정하고 관련 페이지·파일을 실제로 읽는다. **사이트 목록을 붙이는 것만으로 조사나 설계 검토를 완료했다고 할 수 없다.** 외부 자료와 기존 구현이 충돌하면 버전·검토 범위를 확인하고, NEXUS에서 채택·수정·미채택할 이유를 적는다. 원작의 잠금·보상·장편 사건을 자동 도입하거나 엔진 이식·프로젝트 통째 복제로 연결하지 않는다.

### 목적별 기본 참고군

| 조사 목적 | 기본 자료 | 읽을 내용과 적용 경계 |
| --- | --- | --- |
| 장소·인물·세계관·사건 | [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) | 해당 장소·인물의 게임별 본문, 연결 지리와 사건 전후 상태를 읽는다. 서로 다른 버전의 사실을 섞지 않는다. |
| 지도·출입구·출현·트레이너·아이템 | [Serebii Pokéarth](https://www.serebii.net/pokearth/) | 도시·도로·동굴 작업마다 해당 버전의 장소 페이지를 기본 대조한다. 전체 배치를 복사하지 않고 출입·경유·서식·생활 요소를 선정한다. |
| 실제 진행 순서·길막·던전·재방문 | [StrategyWiki](https://strategywiki.org/wiki/Main_Page), [GameFAQs](https://gamefaqs.gamespot.com/), [Bulbapedia Walkthrough](https://bulbapedia.bulbagarden.net/wiki/Appendix:Walkthroughs) | 해당 게임 공략의 앞뒤 구간과 조건을 읽는다. 작성자·게임 버전을 구분하고 필요한 부분을 교차 대조한다. 원작 진행 설명은 NEXUS 변경 지시가 아니다. |
| 원작 지도 이미지·한국어 표기 보조 | [Bulbagarden Archives](https://archives.bulbagarden.net/wiki/Main_Page), [한국어 포켓몬 위키](https://pokemon.fandom.com/ko/wiki/포켓몬_위키) | 지도 이미지의 게임·버전·출처를 확인하고 큰길·샛길·층·문을 비교한다. 한국어 명칭은 공식 게임 표기와 대조하며 영문 원명도 남긴다. |
| 종·타입·기술·특성·진화·조우 데이터 | [PokéAPI 문서](https://pokeapi.co/docs/v2), [PokéAPI 저장소](https://github.com/PokeAPI/pokeapi) | 대상 리소스와 버전 그룹을 읽고 초기 수집·참조 데이터로 활용한다. 스토리 동선의 근거로 쓰지 않으며 수집 가능 데이터와 현재 지원 기능을 구분한다. |
| 원작 구현 자료 탐색 | [pret 조직](https://github.com/pret) | 대상 게임 저장소와 관련 파일을 찾는 입구다. 원작의 재구성 소스와 공식 개발문서를 구분하고 저장소 이름만으로 구현을 확인했다고 쓰지 않는다. |
| 신오 Pt 필드·이벤트·진행 구조 | [pret/pokeplatinum](https://github.com/pret/pokeplatinum) | 대상 맵·NPC·스크립트·플래그·아이템·진행 조건에 해당하는 파일을 읽는다. 신오 첫 제작 구간에서 사이트의 장소 설명과 실제 구조를 함께 대조한다. |
| 성도·관동 HGSS 필드·이벤트 | [pret/pokeheartgold](https://github.com/pret/pokeheartgold) | 성도와 HGSS 관동의 대상 장소·이벤트·진행 조건을 읽는다. NEXUS의 지방 순서와 원작 해금 조건을 별도 판단한다. |
| 관동·성도의 다른 세대 비교 | [pret/pokered](https://github.com/pret/pokered), [pret/pokecrystal](https://github.com/pret/pokecrystal) | 같은 장소의 지리·이벤트 차이나 단순한 시스템 분리를 비교할 때 읽는다. HGSS 기본 기준을 대체하거나 다른 세대 조건을 자동 혼합하지 않는다. |
| 공통 필드·이벤트·저장·아이템 구조 | [pret/pokeemerald](https://github.com/pret/pokeemerald) | 관련 상태 정의, 읽기·쓰기 경로와 이벤트 소비 지점을 함께 읽는다. 데이터 배치나 저장 형식을 NEXUS에 그대로 강제하지 않는다. |
| 기능 확장·세대 규칙·데이터 호환 | [pokeemerald-expansion](https://github.com/rh-hideout/pokeemerald-expansion) | 대상 기능의 설정·테이블·호출 경로·기존 기능과의 경계를 읽는다. 지원·부분 지원·미지원 범위와 기본 동작을 설계한다. |
| 전투 규칙·턴 처리·표시 분리 | [Pokémon Showdown](https://github.com/smogon/pokemon-showdown) | 대상 세대의 턴 순서·기술·특성·도구·상태·날씨 처리와 관련 검증 사례를 읽는다. 공통 전투 담당이 난수·결과 표현·규칙의 경계를 정하며 지방별 계산 복사나 통째 이식을 하지 않는다. |
| 콘텐츠 이벤트 제작 | [Pokémon Essentials](https://github.com/Maruno17/pokemon-essentials) | 대상 NPC·조건·대사·전투·보상·완료·재방문 구조를 읽고 NEXUS의 사건 레코드와 비교한다. 기존 핸들러·영구 ID와 연결할 방법을 정한다. |
| 탐험·생태·동료의 필드 상호작용 | [PokeWilds](https://github.com/SheerSt/pokewilds) | 대상 바이옴·상호작용·탐험 상태·저장 경계를 읽는다. 동료에 따른 선택 활동의 참고이며 필수 포획 잠금·새 이동 기술을 자동 도입하지 않는다. |
| TypeScript 맵·이벤트·저장 모듈 | [RPG-JS](https://github.com/RSamaium/RPG-JS) | 맵 등록·이벤트 모듈·플레이어 상태·공유 데이터의 책임과 호출 경로를 읽는다. 기존 웹 엔진을 점진적으로 재구성하는 비교 자료로 쓴다. |

지방별 기본 대조 버전은 **신오 Pt, 관동·성도 HGSS, 하나 BW2**다. BW·FRLG·적/녹·크리스탈 등 다른 버전의 지형·사건을 채택하면 차이와 이유를 기록한다. 하나 자료를 찾을 때 다른 지방의 pret 구현을 원작 근거로 대체하지 않는다. 표현 목표는 [공통 BW·BW2풍](../VISUAL_STYLE_BW_BW2.md)을 유지한다.

### 작업별 검토 시점과 결과

- **지역·도시·도로·동굴:** 배치·사건 설계 전에 Bulbapedia와 해당 버전 Pokéarth를 읽고, 진행·길막은 StrategyWiki/GameFAQs 등 해당 공략의 앞뒤 구간으로 대조한다. 신오·성도·관동은 필요 범위의 pret 맵·이벤트 소스도 읽는다. 실제 연결·층·귀환 경로와 채택한 차이를 [WORLD_ROUTES](../WORLD_ROUTES.md) 및 해당 지방 문서에 반영한다.
- **배틀·규칙 확장:** 규칙이나 결과 계약을 바꾸기 전에 Showdown의 대상 세대 데이터·처리 흐름을 읽고, 기능 설정·호환이 쟁점이면 expansion을 추가로 비교한다. NEXUS에서 지원할 동작, 처리 순서, 난수와 표시의 경계, 검증할 사례를 먼저 정한다.
- **저장·진행 상태·모듈 재설계:** 저장 형식·ID·플래그·마이그레이션 경계를 정하기 전에 pokeemerald와 RPG-JS의 관련 정의 및 읽기·쓰기 경로를 비교한다. 필드 활동 상태는 필요에 따라 PokeWilds도 검토한다. 외부 패턴의 장단점과 기존 저장 보존 방법을 설계 결과로 남긴다.
- **NPC·사건·생활 콘텐츠:** 이벤트 모델을 바꾸거나 제작 묶음을 설계할 때 Essentials의 관련 조건·결과·재방문 구조와 해당 원작 pret 스크립트를 읽는다. 본편 진행, 선택 활동, 포켓몬 소유, 보상, 통행 조건을 분리한 적용안을 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md)의 계약에 맞춘다.
- **포켓몬·기술·조우 데이터:** 수집·생성 입력을 바꾸기 전에 PokéAPI의 대상 리소스·버전 그룹, 지역 조우는 Pokéarth의 대상 버전을 읽는다. 확장 구조가 필요하면 expansion의 관련 테이블도 대조한다. 원작값·프로젝트 조정값·런타임 지원 범위와 생성 경로를 [RUNTIME_DATABASE](../RUNTIME_DATABASE.md)에 맞춰 기록한다.

검토 결과는 기존 담당 문서나 이 문서의 적용 기록에 통합한다. 같은 사이트 목록·정책을 지방마다 복제하거나 참고 문서를 작업마다 새로 만들지 않는다. 과거에 읽은 자료는 범위와 버전이 그대로 유효하면 해당 기록을 연결해 활용하고, 변경된 질문·버전·파일만 다시 확인한다. 이 참고 기준은 현재의 **게임 QA 중단**을 해제하지 않는다.

### 출처와 채택 판단의 기록

각 조사·적용 기록은 다음을 구분해 남긴다. 아직 열람하지 않은 자료에 조회일·검토 완료 표시를 붙이지 않는다.

1. **조회 근거:** 정확한 페이지 URL, 조회일, 대상 게임·버전. GitHub는 저장소·파일 경로·읽은 범위와 commit 또는 tag/version을 함께 기록하고 가능하면 해당 리비전의 고정 링크를 사용한다. 확인하지 못한 항목은 미확인으로 남긴다.
2. **원작 사실·외부 설계:** 자료에서 직접 확인한 연결·조건·데이터·구조와 검토 범위를 적는다. README만 읽었으면 README 검토로, 파일 일부를 읽었으면 해당 부분 검토로 표시한다. 자료 간 차이·추론·미확인 항목을 구별한다.
3. **NEXUS의 채택 판단:** 채택·수정 채택·미채택과 이유, 기존 기준과의 관계, 적용 대상 MapId·이벤트·데이터 ID·담당 코드/문서를 적는다. 외부 자료의 존재가 새 기능 채택이나 구현 완료의 근거가 되지 않는다.
4. **구현·검증 상태:** 설계만 작성 / 코드 반영 / 자동 검사 / 실제 플레이·저장·화면·음향 확인을 구분하고 실제 수행한 범위만 적는다. 과거 구현 기록과 이번 제작의 수용 결과를 구분한다.
5. **실제 재사용:** 코드·데이터·이미지·음원 등 외부 내용을 복사하거나 변형해 포함할 때는 단순 설계 참고와 별도로 원본 출처·파일·commit/version·해당 자료의 라이선스·이용 조건·수정 내용·고지 위치를 기록한다. 저장소의 코드 라이선스를 모든 자산에 일괄 적용하지 않는다.

아래는 당시 조사·구현의 근거 기록이다. 날짜가 지난 수치·도시 상태·담당 배정은 현재 사실이나 새 실행 명령으로 승계하지 않는다.

---

## 저장 보호와 활성 사본 — 2026-09-22

- **조회 원문:** pret/pokeemerald commit `5eff78649e7170a877b961ef0b3da13b81a16038`의 [include/save.h](https://github.com/pret/pokeemerald/blob/5eff78649e7170a877b961ef0b3da13b81a16038/include/save.h), [src/save.c](https://github.com/pret/pokeemerald/blob/5eff78649e7170a877b961ef0b3da13b81a16038/src/save.c), [src/load_save.c](https://github.com/pret/pokeemerald/blob/5eff78649e7170a877b961ef0b3da13b81a16038/src/load_save.c). SaveSector·두 슬롯 정의, GetSaveValidStatus/TryLoadSaveSlot/CopySaveSlotData, WriteSaveSectorOrSlot/HandleWriteSector/HandleReplaceSector/WriteSectorSignatureByte, 파티·필드 상태 복원 경로를 읽었다. signature·checksum·필수 sector와 counter로 정상 저장을 판정하고 교대 슬롯 쓰기 실패 때 이전 상태를 유지하는 구조다.
- **조회 원문:** RPG-JS commit `0fa8fb9042bc16bbe67c6b490b910431fae9f518`의 [common save service](https://github.com/RSamaium/RPG-JS/blob/0fa8fb9042bc16bbe67c6b490b910431fae9f518/packages/common/src/services/save.ts), [server save service](https://github.com/RSamaium/RPG-JS/blob/0fa8fb9042bc16bbe67c6b490b910431fae9f518/packages/server/src/services/save.ts), [client save service](https://github.com/RSamaium/RPG-JS/blob/0fa8fb9042bc16bbe67c6b490b910431fae9f518/packages/client/src/services/save.ts), [Player.ts L948 이후](https://github.com/RSamaium/RPG-JS/blob/0fa8fb9042bc16bbe67c6b490b910431fae9f518/packages/server/src/Player/Player.ts#L948)의 prepareSnapshotForObjectLoad/snapshot/applySnapshot/save/load 범위. 저장소 전략·스냅샷 준비·실제 맵 복원을 분리한다. 읽은 경로의 원본 백업·전체 스키마 검증·트랜잭션 롤백은 확인되지 않았다.
- **수정 채택:** NEXUS `inspectSave`는 버전별 후보 해석을, `SaveSession`은 원문 보관·검증된 별도 사본·활성 선택을 담당한다. 슬롯 격리와 복구 UI는 NEXUS 구현이다. 외부 설계의 참고를 localStorage 다중 키 트랜잭션 보장으로 바꾸지 않는다.
- **미채택:** GBA flash sector/바이너리 checksum/숫자 플래그 주소, RPG-JS 서버·WebSocket·DI·메모리 저장소. 기존 TS/Vite/Canvas와 v1 게임 데이터를 유지하며 코드·자산을 복사하지 않았다.
- **상태:** 저장 보호·Engine·슬롯/파일/새 게임 UI 코드 및 회귀 검사 원고 반영. QA 중단으로 테스트·타입검사·빌드·저장 복원·브라우저 미실행. 기술 키·실패 표는 [DEVELOPMENT §5](../DEVELOPMENT.md#5-저장-계약과-안전한-이행)에만 둔다.

## 첫 여정 호수·잔모래 연결 복원 — 2026-09-22

- **자료·범위:** [Bulbapedia Route 201](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_201), [Serebii Pt Route 201](https://www.serebii.net/pokearth/sinnoh/4th/route201.shtml)에서 떡잎·잔모래·진실호수근처의 관계를 대조했다. pret/pokeplatinum `main`의 [잔모래 events L241~271](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/events/events_sandgem_town.json), [센터 1층 L79~85](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/events/events_sandgem_town_pokecenter_1f.json), [연구소 L128~135](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/events/events_sandgem_town_pokemon_research_lab.json), [호수근처 L30~54](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/events/events_verity_lakefront.json)의 warp_events를 읽었다. 이 조회는 commit 미고정이므로 위 URL의 이후 변경 가능성을 남긴다.
- **채택·차이:** 별도 호수근처/호수 본체, 센터·연구소 각각의 왕복 연결 구조를 채택한다. NEXUS 기존 MapId·좌표·접근 조건을 유지하고 `unified-world.ts`의 통째 워프 교체를 출발 타일·진입 방향별 갱신으로 바꿨다. 원작 도입 잠금·물높이·스타팅 위치·219번도로는 이 수정에 들여오지 않았다. 코드·지도 자산 재사용은 없다.
- **상태:** [실제 출구/도착/귀환 표](../WORLD_ROUTES.md#시작-구간의-현재-연결과-남은-개정)와 코드·회귀 검사 원고 반영. 보행·회복·저장은 미검증이다. 축복 시계는 원작 이벤트 복제가 아닌 채택 NEXUS 본편 1장의 창작 장면이며, 분수와 큰 초침 차이만 첫 구간에 연결했다.

## 무쇠탄갱 강석 만남·동료 귀환 — 2026-09-22

Pt의 강석 현장 만남·광부/포켓몬 협업·서식지 보호를 직접 대조해 `tour_oreburgh_mine`의 `oreburghRoarkShift`와 도시 전시관 귀환 활동에 반영했다. 정확 URL·확인일·원작 사실·프로젝트 차이·소비 파일은 [통합 기록의 자료 표](../archive/SINNOH_HISTORY.md#record-nexus-oreburgh-city-20260922-원작-자료와-프로젝트-차이)에 있다. 강석과의 대화 후 체육관으로 돌아가는 순서를 채택하되 원작의 체육관 선행 잠금·바위깨기·추가 층은 도입하지 않았다. 기존 단일 탐험층·조우풀을 보존했으며 외부 코드/이미지 재사용은 없다. 상태는 코드 반영·게임 QA 미실행이다. 연결은 [WORLD_ROUTES](../WORLD_ROUTES.md), 사건은 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md)을 따른다.

## 신오 무쇠시티 Pt 지리·광산 생활 적용 — 2026-09-16

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Oreburgh_City , https://www.serebii.net/pokearth/sinnoh/4th/oreburghcity.shtml , https://archives.bulbagarden.net/wiki/File:Oreburgh_City_DPPt.png , https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2 (Pokémon Platinum, 2026-09-16 확인).
- 원작 사실: 무쇠시티는 서쪽 무쇠게이트, 북쪽 207번도로, 남쪽 무쇠탄갱과 연결되는 광산 도시다. 북동쪽 광산 전시관은 석탄·탄갱 전시와 화석 복원을 담당한다. 지하 광산의 공기를 바꾸는 환기구와 자동 석탄 운반 설비가 도시 생활을 이루며, 강석은 남쪽 탄갱에서 만난 뒤 동쪽 첫 체육관으로 돌아가는 진행이다.
- 프로젝트 변경: 원작 타일을 복제하지 않고 BW·BW2풍 공통 렌더러용 48×44 전용 배치로 재구성했다. 서문→중앙 광산 안내판→센터/전시관→동쪽 체육관과 남쪽 광재·레일→탄갱 흐름을 만든다. 기존 207번도로 남쪽에 무쇠 북문 분기를 연결하되 자전거·바위깨기 기능이나 새 잠금은 요구하지 않는다. 화석 복원, 알통몬↔캐이시 교환, Pt 아이템, 라이벌 길막은 현재 공통 기능·서사 계약이 없어 미채택했다.
- 적용 코드·상태: `src/oreburgh-city-layout.ts` → `src/explore-expansion.ts` → `src/explore-world.ts`가 `tour_oreburgh` 크기·건물·광재/레일/환기구·도로를 생성한다. `src/sinnoh-route-203-gate.ts`가 서문 `(1,12)`과 게이트→도시 도착 `(2,12)`을, `src/sinnoh-route-206-207.ts`가 `tour_sinnoh_route_207` 남문 `(23,26)` ↔ 도시 북문 `(16,2)`을 연결한다. `src/oreburgh-wayfinding.ts`와 `src/sinnoh-story.ts`가 세 실제 출구와 `oreburghCityDirectory`를 소비한다. `src/oreburgh-interiors.ts`는 센터·전시관·상점·작업방을 확장하면서 기존 회복/PC/판매 및 `city-activities.ts`의 탄갱 기록 반응을 보존한다. `src/adventure-guide.ts`와 `oreburghMineForeman`은 서문 도착→탄갱에서 강석의 작업 확인→동쪽 체육관 안내를 잇되 새 잠금을 만들지 않는다. 외부 코드·지도·자산은 재사용하지 않았고 QA 중단으로 충돌·문·워프·보행·저장·화면·음향은 미검증이다.

## 신오 무쇠게이트 1층 Pt 조우·도착 적용 — 2026-09-16

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Oreburgh_Gate , https://www.serebii.net/pokearth/sinnoh/4th/oreburghgate.shtml , https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2 (Pokémon Platinum, 2026-09-15 확인).
- 원작 사실: 무쇠게이트는 서쪽 203번도로와 동쪽 무쇠시티를 잇는 짧은 동굴이다. Pt 1층 일반 동굴 조우는 주뱃50% Lv.5~8, 고라파덕35% Lv.5~7, 꼬마돌15% Lv.5·7이다. 1층은 동서 통과로와 두 트레이너가 있고 북쪽 B1F 분기는 바위깨기 진행과 연결된다.
- 프로젝트 변경: `tour_oreburgh_gate_1f` 48×40의 가운데 동서 본선은 조우 없이 유지하고 북서·북동·남쪽 곁방의 느슨한 돌길 세 곳에서만 위 Pt 조우를 사용한다. 원작 두 트레이너를 복제하지 않고 기존 작업자 주뱃 Lv.7·꼬마돌 Lv.8 선택전을 유지한다. B1F·바위깨기·아이템·수상/낚시·추가 잠금은 적용하지 않으며 서쪽 203번도로와 동쪽 무쇠시티 왕복은 항상 열린다.
- 적용 코드·상태: `scripts/design/runtime-local-pools.json/LOCAL-S-OREBURGH-GATE-1F-PT` → `scripts/design/export-runtime-pokemon.py` → `src/runtime-pokemon-data.json`·`public/assets/pokemon-runtime-sources.json` → `src/runtime-encounters.ts` → `src/sinnoh-route-203-gate.ts`의 실제 `terrain`이 공통 보행 조우를 소비한다. `src/oreburgh-gate-journey.ts`, `src/road-trainers.ts`, `src/engine.ts`, `src/field-partner-party.ts`가 실제 현지 개체·시작 레벨·격파 참가·파티 재배치를 기록하고, `src/unified-world.ts`와 `src/sinnoh-story.ts`의 `oreburghWestArrivalGuide`가 무쇠 도착을 소비한다. 생성 결과는 공유 변경 포함 74종·68풀·55기술이며 외부 코드·지도·자산은 복사하지 않았다. QA 중단으로 조우·워프·전투·객체 추적·저장·화면·음향은 미검증이다.
- 전투 표현: `oreburgh-gate-battle-art.ts`를 `renderer.ts`의 `tour_oreburgh_gate_1f` 전투 분기에 연결했다. 양쪽 출구의 자연광, 짧은 동서 통과로, 미개통 B1F 방향의 역T자 갈림, 무쇠 쪽 광맥과 느슨한 돌 발판을 프로젝트 자체 Canvas 도형으로 그린다. 원작 자산은 재사용하지 않았고 B1F·바위깨기·자전거 경사·아이템을 열지 않았다. 전투·조우·저장은 불변이며 2026-09-16 화면 QA는 미실행이다.
- 외부 필드 표현: `oreburgh-gate-field-art.ts`가 실제 `map.walkable`의 막힌 칸에만 서쪽 퇴적 암벽·동쪽 청회/황동 광맥·남쪽 B1F 폐쇄 경계와 작업등을 그리고, 양쪽 실제 1F 출구 안쪽에 투명 자연광을 더한다. `renderer.ts`가 NPC·조사물보다 앞에서 소비한다. `(20,26)`은 기존 기록판과 폐쇄 계단 그림이며 워프가 아니다. 충돌·조우·출구·저장은 바꾸지 않았고 QA 중단으로 화면·가림·카메라·보행은 미검증이다.

## 하나 8번도로 B2W2 실제 동료 실전·설화 도착 — 2026-09-16

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8 , https://www.serebii.net/pokearth/unova/route8.shtml , https://bulbapedia.bulbagarden.net/wiki/File%3AUnova_Route_8_Map.png , https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_19 (Pokémon Black 2·White 2, 2026-09-16 확인).
- 원작 사실: 8번도로는 서쪽 설화시티, 동쪽 튜브라인브리지, 북쪽 설화의 습지를 잇는 비와 웅덩이의 길이다. 겨울에는 웅덩이가 얼어 보행 조우가 사라진다. B2W2 겨울 외 웅덩이는 두까비40%·메더20%, B2의 딱정곤5%/쪼마리20%와 W2의 딱정곤20%/쪼마리5%를 포함하며 원작 레벨은 54~57이다. W2/B2 모두 쪼마리를 쓰는 트레이너가 있고 B2W2 방문은 후일담 Section 19에 배치된다.
- 프로젝트 변경: 기존 `U-R08-DAY`는 현재 지원되는 버전 교차종 딱정곤·쪼마리만 50/50·Lv.24~25로 합친 프로젝트 부분 풀이다. 실제 계절·겨울 결빙·두까비·메더·독개굴·수상·낚시·아이템·날씨 돌 보상은 적용하지 않는다. 중앙 마른 본선은 안전하고 포획·승리는 통행 조건이 아니다.
- 적용 코드·상태: `src/unova-route-eight-journey.ts`가 실제 파티 객체·슬롯·시작 레벨을 저장하고 `src/engine.ts`가 최종 승리와 `defeatedOpponentParticipants`의 동일 객체를 확인한다. `src/field-partner-party.ts`가 재배치를 추적하고 `src/road-trainers.ts`·`src/icirrus-route-battle.ts`가 재확인전과 실제 성장 결과를 제공한다. `src/journey-services.ts` 설화 동문과 `src/adventure-guide.ts`가 같은 건강한 객체의 도착→생활관→습지→북쪽 접근로를 소비한다. QA 중단으로 미검증이다.

## 하나 쇼핑몰 나인 B2W2 공개 1층 동료 작업 — 2026-09-16

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Shopping_Mall_Nine , https://bulbapedia.bulbagarden.net/wiki/Unova_Route_9 , https://www.serebii.net/pokearth/unova/route9.shtml , https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13 (Pokémon Black 2·White 2, 2026-09-16 확인).
- 원작 사실: 쇼핑몰 나인은 하나 9번도로 북쪽의 대형 상업 시설이다. B2W2에는 여러 판매대·자판기·트레이너, 가전 상자가 있는 창고와 로토무 폼체인지가 있고, 결빙 사건 중에는 9번도로 얼음길을 통해 접근한다.
- 프로젝트 변경: 기존 36×28 공개 1층의 입고 정리대·여행용품 진열·동행 휴게 구역만 사용한다. 9번도로 선택전에 실제 참가하고 서문 귀환을 마친 같은 건강한 치라미가 작은 상자 표식 방향→진열 통행 여백→작업 뒤 휴식을 순서대로 살핀다. 원작 판매·자판기·트레이너·가전 창고·로토무 폼체인지·결빙 접근은 구현하지 않았다.
- 적용 코드·상태: `src/unova-route-nine-life.ts`가 `nexusRouteNineBattlePartner*`의 같은 객체와 `nexusRouteNinePartnerReturned`를 확인해 `mallNineDeliverySorted`→`mallNineTravelLaneChecked`→`mallNinePartnerWorkCompleted`를 저장한다. `src/adventure-guide.ts`가 서문 귀환 뒤 세 실내 단계를 안내하고 기존 `src/unova-route-nine.ts`의 실제 workbench/shelf/bench 이벤트가 이를 소비한다. 외부 코드·지도·자산은 재사용하지 않았으며 QA 중단으로 미검증이다.

## 하나 9번도로 B2W2 선택 조우·라이더 실전 — 2026-09-16

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_9 , https://www.serebii.net/pokearth/unova/route9.shtml , https://bulbapedia.bulbagarden.net/wiki/File%3AUnova_Route_9_Map.png , https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13 (Pokémon Black 2·White 2, 2026-09-16 확인).
- 원작 사실: 하나 9번도로는 동쪽 쌍용시티와 서쪽 튜브라인브리지를 잇는 짧은 숲길로 중앙 포장도로, 북쪽 쇼핑몰 나인, 남쪽의 굽은 일반 풀·진한 풀, 폭주족·불량배 트레이너가 있다. B2W2 일반 풀은 치라미30%, B2 고디보미 또는 W2 듀란25%, 더스트나15%, 자망칼15%, 레파르다스10%, 질뻐기5%, Lv.37~40이다. 라이더 필립은 스콜피 Lv.43을 사용한다. 결빙 뒤 일부 길은 얼음 퍼즐로 바뀌며 도전자굴 입구는 막혀 있다.
- 프로젝트 변경: 현재 런타임이 지원하는 원작 일반 풀 종은 치라미뿐이므로 `U-R09-BW2`를 치라미100%·Lv.24~25 부분 풀로 낮췄다. 남서쪽 두 선택 풀밭만 조우하며 바깥 흙길과 포장 본선은 안전하다. 라이더 선택전은 치라미와 원작 라이더 사용종 스콜피를 조합한 넥서스 실전이다. 원작 인물·전체 파티·상금·배치를 복제하지 않았고 결빙·도전자굴·진한/흔들리는 풀·숨겨진동굴·아이템은 제외했다.
- 적용 코드·상태: `src/unova-route-nine.ts`의 실제 terrain·NPC, `scripts/design/runtime-local-pools.json/LOCAL-U-R09-BW2` → 공식 exporter → `src/runtime-pokemon-data.json`·출처 manifest, `src/runtime-encounters.ts`의 MapId 연결, `src/road-trainers.ts`의 선택전, `src/unova-route-nine-life.ts`와 `src/adventure-guide.ts`의 포획→실전→생활 기록→다리 흐름에 소비된다. 외부 코드·지도·자산은 재사용하지 않았다. QA 중단으로 런타임 전체는 미검증이다.
- 실제 참가·귀환 보강: `src/unova-route-nine-journey.ts`가 전투 직전 건강한 9번도로 출신 치라미의 실제 객체·슬롯·시작 레벨을 저장하고, `src/engine.ts`에서 최종 승리와 `defeatedOpponentParticipants`의 동일 객체 격파 참가를 함께 확인한다. `src/field-partner-party.ts`는 파티 순서를 따라 슬롯을 갱신하고 PC 이동 시 슬롯을 비운다. `src/road-trainers.ts`는 과거 승리·대체 객체를 인정하지 않는 무보상 재확인전을 제공하며 `src/unova-route-nine-life.ts`의 쌍용 서문 쉼터가 같은 건강한 객체의 시작/현재 레벨·HP를 귀환 기록으로 소비한다. QA는 모두 미실행이다.
- 전투 표현: `unova-route-nine-battle-art.ts`를 `renderer.ts`의 `tour_unova_route_09` 분기에 연결했다. 북쪽 쇼핑몰 외관, 중앙 포장 본선·차선 표식, 남쪽 방풍림을 공통으로 그리고 전투 시작 위치가 남쪽 풀길(`player.y >= 18`)이면 긴풀 발판, 포장 본선이면 마른 도로 공터 발판을 사용한다. 원작 자산은 재사용하지 않았고 전투·조우·보상·저장은 바꾸지 않았다. 2026-09-16 코드 반영, 화면 QA는 미실행이다.

## 하나 쌍용시티 B2W2 동문 도착·역사관·서쪽 여행 적용 — 2026-09-15

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Opelucid_City , https://www.serebii.net/pokearth/unova/opelucidcity.shtml , https://www.serebii.net/black2white2/versionarea.shtml , https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13 (Pokémon Black 2·White 2, 2026-09-15 확인).
- 원작 사실: 쌍용시티는 하나 북부 도시로 서쪽 9번도로와 동쪽 11번도로를 잇는다. B·B2는 미래 지향 외관, W·W2는 전통·자연 지향 외관이며 B2W2 본편에서 사간과 일곱 번째 체육관 뒤 플라스마 프리깃이 도시를 얼리고 유전자쐐기 사건이 이어진다. BW의 10번도로 연결은 B2W2에서 사라졌다.
- 프로젝트 변경: W2의 오래된 석조 거리와 B2의 새 생활 인레이가 공존하는 기존 넥서스 재구성을 유지한다. 11번도로의 마릴·딱정곤·쪼마리 중 선택전에 실제 참가한 같은 객체가 건강하게 동문에 도착했을 때만 도착 기록을 남긴다. 역사관은 도시 생활·현지 기술·동료 문양 관찰 시설이며 체육관·배지·프리깃 결빙·유전자쐐기·10번도로 사건은 적용하지 않는다. 서쪽은 9번도로와 튜브라인브리지, 동쪽은 11번도로와 빌리지브리지로 표시한다.
- 적용 코드·상태: `src/opelucid-arrival.ts`의 실제 객체/슬롯 상태, `src/journey-services.ts`의 동문·센터·역사관 1~3층 소비, `src/adventure-guide.ts`의 도착→회복/재편성→기록→기술→관찰→9번도로→튜브라인브리지 순서에 적용했다. 기존 `opelucid-city-layout.ts`, `unova-route-nine-life.ts`, `opelucid-battle-art.ts`와 공통 파티·PC·전투 기록을 재사용하며 외부 코드·지도·자산은 복사하지 않았다. QA 중단으로 이벤트 접근·파티 재배치·저장·보행·화면·음향은 미검증이다.

## 하나 빌리지브리지 B2W2 주민 음악 파트 적용 — 2026-09-15

- 출처: https://bulbapedia.bulbagarden.net/wiki/Village_Bridge , https://www.serebii.net/pokearth/unova/villagebridge.shtml , https://bulbapedia.bulbagarden.net/wiki/File:Village_Bridge_Summer_B2W2.png , https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12 (Pokémon Black 2·White 2, 2026-09-15 확인).
- 원작 사실: 빌리지브리지의 장소 음악은 다리 곳곳에 사는 네 NPC와 대화하면서 풀피리·기타·비트박스·엔카 파트가 더해지는 방식으로 장소의 주민 생활과 연결된다. 다리는 11번도로와 12번도로 사이의 오래된 정착지다.
- 프로젝트 변경/소비: 원작 음원을 복사하거나 실제 오디오 레이어를 해금하지 않는다. `src/explore-residents.ts`가 중앙 보행선을 피해 세 추가 주민을 배치하고 기존 중앙 공연자를 네 번째 파트로 쓴다. `src/village-bridge-life.ts`가 `villageBridgeEnsembleParts` 비트와 1~4개 파트별 대사 리듬, 11·12번도로 귀환 반응을 저장·표시하며 `src/journey-services.ts`와 `src/adventure-guide.ts`가 이벤트와 찾기 순서를 소비한다. 외부 코드·지도·음원·자산은 재사용하지 않았다. 보상·포획·통행 조건은 없으며 QA 중단으로 NPC 접근·대사·저장·화면·음향은 미검증이다.

## 하나 빌리지브리지 BW2 생활·11번도로 왕복 적용 — 2026-09-15

- 출처: https://bulbapedia.bulbagarden.net/wiki/Village_Bridge , https://www.serebii.net/pokearth/unova/villagebridge.shtml , https://bulbapedia.bulbagarden.net/wiki/File:Village_Bridge_Summer_B2W2.png (Pokémon Black 2·White 2, 2026-09-15 확인).
- 원작 사실: 빌리지브리지는 하나의 정착민이 세운 오래된 석조 다리이며 서쪽 11번도로와 동쪽 12번도로를 잇는다. 주민은 다리 위와 아래에서 생활하고 음악의 여러 파트를 맡는다. BW2에서는 BW의 식당 대신 테니스·농구 코트가 있으며, 일반 풀에는 골덕35%·마릴35%·쟝고15%·세비퍼15%가 Lv.36~39로 등장한다. 주민 트레이너와 다리 아래 수상·낚시 조우도 별도 존재한다.
- 프로젝트 변경: 현재 72×48 맵의 긴 중앙 보행 다리·양쪽 둔치·센터·생활관·세 주택·공연 뜰·동료 휴게뜰을 유지한다. 새 코트·식당·마을 풀숲·수상/낚시·원작 트레이너와 음악 기능을 구현 완료로 간주하지 않는다. 대신 12번도로 도착 동료와 부상 상태를 읽어 센터·생활관으로 안내하고, 통행·휴게 기록 뒤 기존 11번도로의 마릴·딱정곤·쪼마리 포획과 선택 실전을 거쳐 같은 다리로 귀환하는 넥서스 여행으로 연결했다.
- 적용 코드/상태: `src/village-bridge-layout.ts`와 `src/village-bridge-interiors.ts`의 실제 공간, `src/journey-services.ts`의 `tourResident0/2/3` 동적 반응과 `villageBridgeRouteElevenReturnReviewed`, `src/adventure-guide.ts`의 도착→생활관→11번도로 포획·실전→다리 귀환→쌍용 출발 순서에 소비된다. 11번도로 조우와 전투는 기존 `U-R11-DAY`·`unova-route-11-practice`를 재사용한다. `src/unova-route-eleven-journey.ts`가 실제 현지 선두 객체·시작 레벨·상대 격파 참가를 기록하고 `field-partner-party.ts`·`engine.ts`·`road-trainers.ts`가 순서 추적·승리 소비·무보상 재확인전을 담당한다. 다리 주민은 같은 객체의 건강과 현재 상태가 확인될 때만 귀환을 완료하며 과거 승리나 다른 동료의 승리를 대신 인정하지 않는다. 원작 코드·지도·자산은 복사하지 않았다. 테스트·빌드·브라우저·보행·저장·시각·음향 QA는 중단 상태다.

## 하나 12번도로 BW2 전원 생태·보배 귀환 적용 — 2026-09-15

- 출처: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_12 , https://www.serebii.net/pokearth/unova/route12.shtml , https://bulbapedia.bulbagarden.net/wiki/Lacunosa_Town , https://bulbapedia.bulbagarden.net/wiki/File:Unova_Route_12_Summer_B2W2.png , https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12 (Pokémon Black 2·White 2, 2026-09-15 확인).
- 원작 사실: 하나 12번도로는 서쪽 빌리지브리지와 동쪽 보배마을을 잇는 짧고 완만한 구릉·큰 초원이다. 북쪽에 진한 풀, 남쪽에 일반 긴풀이 있고 아래 작은 길로 긴풀을 피할 수 있다. BW2 일반 풀숲에는 로젤리아25%, 세꿀버리20%, 유토브25%, 두르보15%와 B2 쁘사이저15% 또는 W2 헤라크로스15%가 Lv.35~38로 등장한다. 트레이너에는 격투가와 로젤리아를 쓰는 백커들이 있다.
- 프로젝트 변경: `tour_unova_route_12`의 북쪽·남쪽 곁풀 두 곳에 현재 지원되는 로젤리아25·세꿀버리20·유토브25의 상대 비중을 유지한 `U-R12-BW2`를 연결했다. 원작 레벨은 공통 상한에 맞춰 Lv.24~25로 낮췄다. B2/W2 버전 전용종, 두르보, 진한/흔들리는 풀, 대량발생·특별 조우는 적용하지 않았다. 초원 트레이너는 원작 인물·파티 복제가 아닌 프로젝트 선택 실전이며 낮은 남쪽 길은 조우 없이 열린다.
- 적용 코드/상태: `src/unova-route-twelve.ts`의 실제 `tallGrass`와 `tourRouteTwelveTrainer`, `src/runtime-encounters.ts`의 MapId→노드, `scripts/design/runtime-local-pools.json`의 풀, `src/road-trainers.ts`의 선택전, `src/unova-route-twelve-journey.ts`의 실제 파티 객체·시작 레벨·상대 격파 참가 기록, `src/field-partner-party.ts`의 파티 순서 추적, `src/engine.ts`의 전투 결과 소비, `src/journey-services.ts`의 동일 객체·회복·재편성 귀환 반응, `src/adventure-guide.ts`의 포획·성장·귀환 순서에 소비된다. 과거 승리나 다른 동료의 승리는 귀환 완료로 인정하지 않으며 PC 이동 뒤에는 현지 동료를 다시 선두로 골라 상금 없는 재확인전을 수행한다. `scripts/design/export-runtime-pokemon.py --assets`로 `src/runtime-pokemon-data.json`과 출처 목록을 갱신했다. 외부 코드·지도·자산은 복사하지 않았다. QA 중단으로 조우·전투·워프·저장·화면·음향은 미검증이다.

# 원작 조사 자료와 적용 근거

> **2026-09-21 스토리 전면 원고 조사:** [게임·애니·극장판 출처와 적용표](../story/NEXUS_STORY_SOURCE_LEDGER.md)에 개별 링크, 확인 범위, 새 본편/SQ/EX의 적용 위치를 기록했다. 영화 공식 소개 확인과 전체 영상·배경종 조사 완료를 구분한다. 지도·자산·런타임 구현의 적용 증거로 사용하지 않는다.

## 관동 쌍둥이섬 B3F 냉기 회랑 조우 — 2026-09-15

- 출처: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B3F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (HGSS, 2026-09-15 확인).
- 원작/차이: B3F의 골뱃30·쥬레곤24·골덕14·고라파덕12·주뱃10·쥬쥬10%와 얼음·암벽·다중 사다리를 대조했다. 프로젝트는 지원되는 쥬쥬/주뱃50/50·Lv.24~25를 중앙 굽은 선택 회랑에만 적용하고 서쪽 본선과 계단 발판을 안전하게 둔다. 미지원 종·수상/낚시·라디오·아이템·HM·전설은 제외했다.
- 소비: `runtime-local-pools.json/LOCAL-K-SEAFOAM-B3F`→공식 exporter→`runtime-pokemon-data.json`·출처 manifest→`runtime-encounters.ts` MapId→`kanto-seafoam-islands.ts` terrain→공통 엔진 보행 조우. B3F painter·수로 경계 접근과 `cinnabar-habitats.ts`의 쌍둥이섬 포획 출처 판정도 함께 연결했다. 생성 73종/64풀/55기술, 모든 QA 미실행이다.

## 관동 쌍둥이섬 B1F 능선 조우 공간 — 2026-09-15

- 출처: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B1F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (HGSS, 2026-09-15 확인).
- 원작/차이: B1F 중앙 흰 얼음·암벽·사다리와 쥬쥬30/골뱃30/고라파덕16/골덕14/주뱃10%를 대조했다. 프로젝트는 지원되는 쥬쥬/주뱃 기존75/25·Lv.23~24만 사용하며, 안전 본선과 북쪽→오른쪽 굽이 조우 능선을 공간으로 구분한다. 원작 퍼즐·아이템·미지원 종은 제외했다.
- 소비: `kanto-seafoam-islands.ts`의 기존 충돌·추가 terrain·접근 표석→공통 terrain 조우와 `LOCAL-K-SEAFOAM-B1F`; `seafoam-chamber-art.ts`의 안전 얼음바닥/조우 암반 환경 흔적. 코드 반영, QA 전부 미실행이다.

## 관동 쌍둥이섬 B2F 조우 회랑 — 2026-09-15

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B2F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (HGSS, 2026-09-15 확인).
- 원작/프로젝트 차이: 원작 B2F의 쥬쥬30·골뱃30·고라파덕16·골덕14·주뱃10%와 얼음 발판·사다리 구조를 대조했다. 프로젝트는 지원되는 쥬쥬/주뱃만 기존75/25·Lv.24~25로 유지하고 중앙 조우 암반을 실제 굽은 회랑으로 넓혔다. 원작 트레이너·아이템·HM 퍼즐은 제외했다.
- 소비·상태: `kanto-seafoam-islands.ts` 충돌/terrain→공통 `engine.ts` 보행 조우→기존 `LOCAL-K-SEAFOAM-B2F`; `seafoam-chamber-art.ts`는 동굴 조우석 위에 종별 환경 흔적만 표시한다. 계단·일반 왕복·저장은 보존했다. 모든 QA 미실행이다.

## 성도 43번도로 주민 작업 귀환 — 2026-09-15

- 대상/출처: `tour_johto_route_43`; https://bulbapedia.bulbagarden.net/wiki/Johto_Route_43, https://bulbapedia.bulbagarden.net/wiki/Lake_of_Rage, https://www.serebii.net/pokearth/johto/route43.shtml, https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_11 (모두 2026-09-15 열람, HGSS).
- 원작/차이: 원작의 황토↔43번도로↔호수 연결, 검문소 길과 긴 풀·트레이너 길, HGSS 육상 생태를 대조했다. 넥서스는 기존 자유 통행 재구성을 보존하고 호수 주민 생활 재개 뒤 43번도로 출신 파티 동료와 갈대 거름틀을 씻어 황토로 돌려보내는 선택 행동을 추가한다. 검문 통행료·로켓단·수상/낚시·아이템은 적용하지 않는다.
- 실제 소비/상태: `johto-route-43-life.ts`의 호수표지→상류물길→옛기단→황토표석, `rage-route-homecoming-art.ts`의 단계별 거름틀 layer를 renderer가 합성한다. 이벤트 코드는 기존 journey-services 경로가 소비한다. QA 전면 중단으로 구현 미검증이며 사건·도시 완료가 아니다.
- **개별 지도 대조 보수:** https://bulbapedia.bulbagarden.net/wiki/File%3AJohto_Route_43_HGSS.png (2026-09-15 확인, HGSS 608×834 전체 지도 이미지)와 위 장소·공략을 함께 대조했다. 현행 32×80을 확대하지 않고 북·남 합류부 사이를 서쪽 긴 풀/트레이너 길과 동쪽 짧은 옛 검문 길로 분리했다. `johto-route-43.ts`가 충돌·긴풀·NPC/표석 좌표와 `paintJohtoRoute43` 전용 바탕을 함께 제공하며 `explore-art.ts`가 전용 painter를 소비한다. 원작 타일/이미지는 복제·재사용하지 않았다. 모든 실행 검증은 미실행이다.
- **포획·성장·전투 연속성:** 같은 세 출처의 HGSS 트레이너 표에서 야영객 태일의 모래두지18·고지18·주뱃20을 확인했다. 현재 공통 카탈로그에 이미 있는 주뱃만 Lv.24로 축약한 북부 선택전을 `tourRoute43Camper`/`johto-route-43-camper-practice`에 배치했다. 원작 이름·팀·상금 복제가 아니며 프로젝트 레벨 상한 안에서 북부 피죤 포획→선택전 경험치→분노의호수 도착을 잇는다. 남부 피죤25 새잡이전과 함께 두 전투 모두 통행 조건이 아니다. 적용 파일은 `johto-route-43.ts`, `road-trainers.ts`, `johto-route-43-life.ts`; QA 중단으로 전투·성장·저장 미검증이다.
- **실제 참가 판정:** `johto-route-43-battle.ts`가 전투 직전의 43번도로 출신 선두 객체와 시작 레벨을 저장하고, `engine.ts`에서 승리 결과의 `defeatedOpponentParticipants`에 같은 객체가 포함된 경우만 완료한다. `field-partner-party.ts`는 파티 순서 변경 때 객체를 따라 슬롯을 고치고 PC 보관 때 슬롯을 비운다. `johto-route-43-life.ts`는 이 근거로 시작/현재 레벨과 HP를 보여 주며, 종이나 승리 플래그만으로 참가를 추정하지 않는다. QA 중단으로 실제 성장 표시는 미검증이다.

## 신오 봉신 유적 전승 실내 보수 — 2026-09-15

- 참고 URL·버전: [Bulbapedia · Celestic Town / Celestic Ruins](https://bulbapedia.bulbagarden.net/wiki/Celestic_Ruins), [Serebii Pokéarth · Celestic Town](https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml), [Bulbagarden Archives · DPPt 지도 분류](https://archives.bulbagarden.net/wiki/Category%3ADiamond%2C_Pearl%2C_and_Platinum_maps), [Bulbapedia · Platinum walkthrough Section 14](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_14). 2026-09-15 확인, 기본 대조 Pokémon Platinum. Archives의 장소별 분류 URL은 응답하지 않아 DPPt 전체 지도 분류와 Bulbapedia 실내 이미지를 구조 대조에 사용했다.
- 원작 사실: 봉신마을 중앙의 작은 고대 사당은 동굴 내부이며, 뒤쪽 벽면의 프레스코에는 유크시·엠라이트·아그놈 전승이 새겨져 있다. Pt에서는 별도 사건 순서 뒤 벽화를 조사하면 난천의 해석 장면이 열리고, 앞선 본편에서는 유적 안의 태홍 전투 뒤 파도타기를 받는다.
- 프로젝트 변경: 원작 타일·사건을 복제하지 않고 24×20 전시실을 32×28 공개 전승 공간으로 보수했다. 후벽 프레스코, 왼쪽 전승 기록 감실, 오른쪽 211번도로 암석 비교 감실, 중앙 관람축과 남쪽 단일 귀환로를 분리했다. 태홍·갤럭시단·오래된부적·난천 후일담·파도타기·전설 포획은 열지 않는다.
- 적용 코드·MapId·이벤트: `src/sinnoh-celestic-route.ts`, `src/sinnoh-celestic-ruins-art.ts`, `src/sinnoh-celestic-life.ts`; `tour_celestic_ruins`; `tourCelesticRuinsMural`, `tourCelesticRuinsRecord`, `tourCelesticRuinsStone`, `tourCelesticRuinsReturn`. 남문 `(16,27)`은 `tour_celestic` 유적 앞마당 `(20,15)`로 귀환하고 스폰은 `(16,24)`다.
- 구현/검증 상태: 지역 맵·충돌·전시 props·대사·전용 painter 코드를 반영했다. 전역 QA 중단에 따라 테스트·타입 검사·빌드·브라우저·시각/음향·저장 검증은 모두 실행하지 않았으며 봉신 도시 완료 근거가 아니다.

## 2026-09-15 네 지방 도시 단위 후속 적용

- 신오 Pt 봉신마을·유적: https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml · https://bulbapedia.bulbagarden.net/wiki/Appendix:Platinum_walkthrough/Section_11 · https://archives.bulbagarden.net/wiki/Category:Diamond,_Pearl,_and_Platinum_maps. 천관산 두 지층 기록을 유적 모사대로 연결했다. 원작 오래된부적·조직전·파도타기는 제외했다. 세부는 [신오 기록](../archive/SINNOH_HISTORY.md#record-sinnoh-continuation-20260915).
- 관동 HGSS 20번수로: https://bulbapedia.bulbagarden.net/wiki/Sea_Route_20 · https://www.serebii.net/pokearth/kanto/4th/route20.shtml. 쌍둥이섬 귀환 뒤 서쪽 모래톱 선택전을 프로젝트 Lv.25로 조정해 적용했다. 파도타기·수상 조우·원작 전체 트레이너는 제외했다. 세부는 [관동 기록](../archive/KANTO_HISTORY.md#record-kanto-continuation-20260915).
- 성도 HGSS 42번도로·절구산: https://bulbapedia.bulbagarden.net/wiki/Route_42 · https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_10 · https://www.serebii.net/pokearth/johto/route42.shtml · https://bulbapedia.bulbagarden.net/wiki/Mortar. 규토리 군락의 깨비참을 건강한 동료의 실제 기술로 안전하게 돌려보내는 선택 행동을 적용했다. 채집·수상 이동·깊은 층 보상은 제외했다. 세부는 [성도 기록](../archive/JOHTO_HISTORY.md#record-johto-continuation-20260915).
- 하나 B2W2 구름하수도: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers · https://bulbapedia.bulbagarden.net/wiki/File:Castelia_Sewers_dry_B2W2.png · https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_4 · https://www.serebii.net/pokearth/unova/casteliasewers.shtml. 흔적→현지 포획 동료→기존 선택전→성장 상태→항구센터 귀환을 연결했다. 휴/플라스마단·계절 수위·파도타기는 제외했다. 세부는 [하나 기록](../archive/UNOVA_HISTORY.md#record-unova-continuation-20260915).
- 확인일은 모두 2026-09-15이며 외부 코드·자산은 재사용하지 않았다. 모든 실행 검증은 QA 중단으로 미실행이다.

후속 적용에서는 관동 HGSS 분화 후 홍련의 포켓몬센터만 남은 상태와 FRLG 분화 전 연구소를 구분해, 넥서스의 해안 인계 후 주거 돌봄을 창작 복구 생활로 기록했다. 성도 HGSS 황토마을·43번도로·44번도로 자료는 호수 사건 뒤 도시 귀환과 동쪽 얼음샛길 준비를 분리하는 근거로 사용했다. 정확한 개별 URL·MapId·이벤트·플래그는 [관동](../archive/KANTO_HISTORY.md#record-kanto-continuation-20260915)과 [성도](../archive/JOHTO_HISTORY.md#record-johto-continuation-20260915) 기록을 따른다.

하나 B2W2 4번도로 후속은 Bulbapedia Route 4, B2W2 Walkthrough Part 4·5, Serebii Pokéarth Route 4를 대조했다. Black 2의 완공 구간과 White 2의 유적 공사 중단 차이를 한 지형 사실로 합치지 않고, 현재 프로젝트의 포장 본선·동쪽 사막 분기 출발 점검으로 재구성했다. 정확 URL과 적용 이벤트는 [하나 기록](../archive/UNOVA_HISTORY.md#record-unova-continuation-20260915)을 따른다.

## 봉신마을·유적 전승 모사 — 2026-09-15

- Pt 개별 자료: https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml, https://bulbapedia.bulbagarden.net/wiki/Appendix:Platinum_walkthrough/Section_11, https://archives.bulbagarden.net/wiki/Category:Diamond,_Pearl,_and_Platinum_maps
- 확인 사실: 210번도로 동쪽·211번도로 서쪽 사이의 오래된 마을, 중앙 유적의 신오 창조 전승 벽화, 별도 `Celestic Town Pt`/`Celestic Ruins Pt` 지도 항목을 확인했다.
- 적용·차이: 천관산211 두 지층 기록을 같은 동료와 유적 모사대에서 맞추는 프로젝트 선택 활동으로 연결했다. Pt의 오래된부적·갤럭시단/태홍 전투·파도타기 전달은 구현하거나 완료 처리하지 않는다. 세부 적용과 미검증 경계는 [신오 후속 기록](../archive/SINNOH_HISTORY.md#record-sinnoh-continuation-20260915)을 따른다.

## 성도 황토마을 생활 귀환 — 2026-09-15

- 대상: `tour_mahogany_home1`의 `tourHost` → `mahoganyHomeHerbTable` → `mahoganyHomeCompanionSeat`, 이후 `tour_johto_route_42`·`43`·`44` 또는 황토 센터 목적지 안내.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town (2026-09-15 확인, HGSS 장소), https://www.serebii.net/pokearth/johto/mahoganytown.shtml (2026-09-15 확인, Pokéarth HGSS), https://bulbapedia.bulbagarden.net/wiki/Appendix:HeartGold_and_SoulSilver_walkthrough/Section_11 및 /Section_12 (2026-09-15 확인, HGSS 진행), https://www.serebii.net/pokearth/johto/route42.shtml · route43.shtml (2026-09-15 확인, HGSS 지리·조우).
- 원작 사실: 황토마을은 서쪽42번도로·북쪽43번도로·동쪽44번도로가 만나는 작은 산간 마을이다. 42번도로는 인주와 황토 사이 절구산 세 입구를 지나고, 43번도로는 두 갈래 길로 분노의호수에 닿는다. HGSS 원작의 기념품점·로켓단 기지·체육관·44번도로 길막은 사건 진행과 묶여 있다.
- 프로젝트 차이/결정: 현재 넥서스의 안내소 전력 인계와 절구산 작은 배수홈 개선은 원작 사건이 아닌 채택 각색이다. 둘을 지역 전체 복구로 합치지 않는다. 원작 로켓단 기지·체육관·44번 길막을 새로 복제하지 않고, 전력 인계 뒤 실제 건강한 파티 동료와 집안일·휴식을 수행한 후 기존 자유 통행 세 도로 중 다음 여정을 고르게 한다.
- 실제 소비: `mahogany-homecoming.ts` 상태·행동·재방문·가구 표시 → `mahogany-life.ts` 이벤트 우선 분기 → 기존 `mahogany-power-art.ts` 가구 렌더 호출. 목적지는 기존 `setTourDestination`과 실제 맵/워프를 사용하며 순간이동하지 않는다. 외부 코드·자산 재사용 없음.
- 연결 기록: `WORLD_ROUTES.md` 성도 황토 경유, `MAP_STORY_DESIGN.md` 황토·호수 후속, `docs/autonomy/johto-continuation-20260913.md` 구현 인계.
- 상태: 자료 확인·코드 반영. QA 중단으로 실제 대화·파티 재검증·목적지 경로·저장·화면·음향은 미검증이며 황토/성도/CH05 완료로 판정하지 않는다.

## 성도29번도로 선택 풀언덕 — 2026-09-13

- 대상: `tour_johto_route_29`, `tourRoute29GrassHill`. 무궁 동쪽 기존80×32 맵의 북서 풀언덕 동쪽 연결길 보수.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Johto_Route_29 (2026-09-13 본문 확인, HGSS/Generation IV 관련 구조). 조우 근거는 https://www.serebii.net/pokearth/johto/route29.shtml (같은 날 HGSS 낮 표 확인).
- 원작 사실: 서쪽 무궁·동쪽 연두·북쪽46 연결, 풀밭을 지나는 굽은 길과 동향 낙차 지름길이 있다. 낮에는 구구·꼬리선·꼬렛이 등장한다.
- 프로젝트 차이/결정: 현재 연두는 미개통이며 원작 전체 지형은 아니다. 기존 남쪽 접점 외에 풀언덕 동쪽 `(25..29,10..12)` 보행 연결을 열고 완만한 포석으로 본선 합류를 드러낸다. 원작 낙차·풀베기 잠금은 복제하지 않으며 양방향 도보로 구성한다. 조우는 지원 구구·꼬렛만, 레벨20~22/비율80:20은 프로젝트 조정이다.
- 실제 소비: `johto-blackthorn-south.ts`의 r29 보행 격자/terrain/조사물 → `johto-blackthorn-south-art.ts`의 기존 `paintRoute29Ground` 및 terrain 긴풀 렌더. `runtime-encounters.ts`의 `J-R29-DAY`가 공통 야생전·포획으로 이어진다. 신규 dependency·외부 코드/자산 재사용 없음.
- 연결 기록: [경유](../WORLD_ROUTES.md#성도29번도로-풀언덕-합류-보수), [활동](../archive/2026-09-22-rebaseline/MAP_STORY_DESIGN.md#무궁29번도로-현지-동료-여행).
- 상태: 자료 확인·코드 반영. 모든 QA 중단으로 플레이/저장/화면 검증 미실행. 원작 재현/BW2 품질/도시 완료로 판정하지 않는다.

장소별 신규 기록은 [구현 지시서의 적용 기록 양식](../MAP_STORY_DESIGN.md)을 따른다. 사이트 목록 자체는 근거 기록이 아니다. 미확인 출처·프로젝트 자체 보수·원작 대조·실제 플레이 검증을 구분하고, 경유는 WORLD_ROUTES, 사건은 MAP_STORY_DESIGN의 해당 기록으로 연결한다.

## 성도 30번도로 전투 공간 — 2026-09-15

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Johto_Route_30 및 https://www.serebii.net/pokearth/johto/route30.shtml (2026-09-15 확인, HGSS/Generation IV).
- 원작 사실: 30번도로는 무궁시티와 31번도로를 잇는 풀길이며, 남쪽 낮은 턱의 풀밭 우회, 규토리 주민 집 옆 작은 연못, 북쪽의 서쪽 31번도로 길과 동쪽 포켓몬 할아버지 집 갈림이 장소를 구성한다. 젊은 트레이너와 긴풀 조우가 여행의 첫 실전을 만든다.
- 프로젝트 차이·소비: 원작 지도·타일을 복제하지 않고 현재 `johto-route-30.ts`의 40×88 연못 갈림·안전 본선·선택 풀밭을 전투에서도 알아보도록 `johto-route30-battle-art.ts`에 연못, 낮은 절벽, 흙길, 풀 전투 발판을 그렸다. `renderer.ts`가 `tour_johto_route_30`의 야생전·선택전에서 소비한다. 원작 초기 알 심부름 길막·도감·규토리상자·도구·파도타기·낚시는 추가하지 않았다.
- 적용 MapId/상태: `tour_johto_route_30`. 코드 반영. QA 중단으로 타입 검사·빌드·실제 전투·화면 가림·애니메이션·음향은 미검증이며 30번도로/무궁/성도 완료 근거가 아니다.

## 성도 31번도로 전투 공간 — 2026-09-16

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Johto_Route_31 및 https://www.serebii.net/pokearth/johto/route31.shtml (2026-09-16 확인, HGSS/Generation IV).
- 원작 사실: 31번도로는 30번도로와 도라지시티 사이의 짧은 자연길이며 동쪽에 어둠의동굴 서쪽 입구, 북쪽에 작은 연못이 있다. 풀베기 지름길과 턱이 있지만 기술이 없으면 동쪽 긴풀과 동굴 앞을 돌아 서쪽 도라지시티로 향한다.
- 프로젝트 차이·소비: 현재 `johto-route-30.ts`가 설치한 56×28 31번도로의 작은 연못·선택 긴풀·동굴 입구·도라지 동문을 전투 공간에도 연결했다. `johto-route31-battle-art.ts`가 동굴 입구 실루엣, 북쪽 연못, 굽은 안전 흙길, 낮은 턱과 남쪽 풀 발판을 프로젝트 자체 도형으로 그리고 `renderer.ts`가 `tour_johto_route_31` 전투에서 소비한다. 원작 풀베기 잠금·메일 배달·TM·아이템은 추가하지 않았고 동굴은 남서 탐사 구역만 별도 MapId로 연다.
- 적용 MapId/상태: `tour_johto_route_31`. 코드 반영. QA 중단으로 타입 검사·빌드·전투·화면 가림·애니메이션·음향은 미검증이며 31번도로/도라지/성도 완료 근거가 아니다.
- 외부 필드 후속: `johto-route30-field-art.ts`가 30번도로 남쪽 안전 본선을 둘러싼 낮은 턱, 연못가 갈대, 갈림 숲 가장자리와 31번도로 남쪽 긴풀 우회의 턱·숲 경계·동쪽 어둠의동굴 열린 입구를 그린다. 각 지형은 `map.walkable`의 기존 막힌 칸에서만 그리며 `renderer.ts`가 건물·NPC·수면 움직임 전에 소비한다. 실제 워프는 입구 바로 아래 열린 칸에 있다. QA 중단으로 화면·가림·카메라·보행은 미검증이다.

## 하나 쌍용시티 전투 공간 — 2026-09-15

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Opelucid_City 및 https://www.serebii.net/pokearth/unova/opelucidcity.shtml (2026-09-15 확인, B2W2).
- 원작 사실: 쌍용시티는 11번도로와 연결되고 B2/B에서는 미래적 기술 도시, W2/W에서는 오래된 것을 존중하는 전통 도시로 외관과 음악이 갈린다. B2W2의 옛 10번도로 북문은 붕괴 뒤 폐쇄되며 후반에는 플라스마 프리깃의 결빙 사건이 발생한다.
- 프로젝트 차이·소비: 현재 넥서스는 `opelucid-city-layout.ts`의 오래된 석조 거리와 새 생활 정원이 공존하는 재구성을 유지하며 W2의 역사 지향을 전투 배경의 주축으로 채택했다. `opelucid-battle-art.ts`의 계단형 석조 윤곽·용 문양 문·오래된 포장 이음·절제된 현대 인레이를 `renderer.ts`가 `tour_opelucid` 전투에서 소비한다. 체육관·전설배지·플라스마단·결빙·10번도로 재개통은 적용하지 않았다.
- 외부 필드 후속: 같은 B2W2 장소 근거를 기존 64×64 `opelucid-city-layout.ts`의 실제 feature 좌표에 적용했다. `opelucid-field-art.ts`가 서쪽 구시가지의 불규칙 석재, 동쪽 생활 정원의 규칙 포장·화단, 중앙의 서로 맞물린 용 문양, 계단과 완만한 경사가 만나는 관찰뜰, 동쪽 11번도로 도착문을 구분해 그리고 `renderer.ts`가 건물·NPC보다 앞에서 소비한다. 서쪽 레거시 표식은 원작 도로로 오인하지 않도록 낮은 석조색으로 분리했다. 충돌·문·워프·조우·스토리 잠금은 변경하지 않았다.
- 상태: 코드 반영. QA 중단으로 타입 검사·빌드·실제 전투 진입·화면·캐릭터 가림·음향은 미검증이며 쌍용/하나 완료 근거가 아니다.

## 하나 빌리지브리지 전투 공간 — 2026-09-15

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Village_Bridge 및 https://www.serebii.net/pokearth/unova/villagebridge.shtml (2026-09-15 확인, 기본 대조 B2W2).
- 원작 사실: 빌리지브리지는 11번도로와 12번도로 사이의 200년 이상 된 석조 아치교이며, 홍수 뒤 주민들이 다리 위에 집을 다시 세워 생활한다. B2W2에서는 스포츠 코트와 다리 아래 비밀 노랫소리 공간이 장소 활동으로 쓰인다.
- 프로젝트 차이·소비: 원작 지도·타일을 복제하지 않고 수로, 석조 아치, 다리 상판과 주거 지붕이 보이는 전용 전투 배경을 `village-bridge-battle-art.ts`에 작성했다. `renderer.ts`가 `tour_village_bridge`의 야생전·선택전에서 이를 소비한다. 원작 트레이너·일일 보상·파도타기·비밀 방 사건은 이번 변경에 포함하지 않았다.
- 상태: 코드 반영. QA 중단으로 타입 검사·빌드·실제 전투·화면 가림·애니메이션·음향은 모두 미검증이며 빌리지브리지/하나 완료 근거가 아니다.
- 외부 필드 후속: 같은 B2W2 장소 근거를 기존 72×48 `village-bridge-layout.ts`에 적용했다. `village-bridge-field-art.ts`가 실제 64칸 중앙 보행 다리의 막힌 가장자리에는 석재 난간과 교각 흔적을, 열린 상판에는 석재 이음과 수면 반사를 그린다. `renderer.ts`가 NPC·건물보다 앞에서 이 층을 소비하며 충돌·워프·조우·통행 조건은 바꾸지 않는다. QA 중단으로 화면·카메라 경계·캐릭터 가림은 미검증이다.

## 공개 GitHub 프로젝트 비교 — 2026-09-12

기존 공개 프로젝트 비교 문서의 참고 목록과 적용 권고는 상단 기준으로 통합했다. 2026-09-12에는 Showdown·pokeemerald·PokeWilds·RPG-JS·pokeemerald-expansion·pokeplatinum·Essentials의 README·기능 설명·일부 설정과 로컬 자료를 읽었으며, 외부 게임 설치·실행·전체 소스 감사는 하지 않았다. 당시 인기 지표·로컬 수량·현재 상태로 오인될 문구는 이번 통합에서 폐기했다.

고유 출처 이력: Essentials의 [Data/Scripts/001_Settings.rb](https://github.com/Maruno17/pokemon-essentials/blob/master/Data/Scripts/001_Settings.rb)와 [Data/Scripts/002_BattleSettings.rb](https://github.com/Maruno17/pokemon-essentials/blob/master/Data/Scripts/002_BattleSettings.rb)는 당시 확인한 파일이다. 해당 조회의 commit/version은 기존 기록에 없으므로 미확인이다. Showdown의 [ARCHITECTURE.md](https://github.com/smogon/pokemon-showdown/blob/master/ARCHITECTURE.md)는 당시 제시한 후속 상세 조사 진입점이며, 읽기 완료 근거가 아니다. 이 이력은 현재 저장소 내용의 재확인이나 기능 구현·검증을 뜻하지 않는다.

> **시각 목표 변경 · 2026-09-12:** 현재 목표는 [BW·BW2풍](../VISUAL_STYLE_BW_BW2.md)이다. 아래 DP/Pt 원작·자산·적용 보고는 기존 출처와 구현 이력이며 새 목표가 아니다. 그래픽 전환 완료를 뜻하지 않으며 모든 QA 중단을 유지한다.

2026-09-10 크기 기준 보완: [맵 크기 기준·전체 대장](../MAP_SIZE_STANDARDS.md)에 사용자 참고표보다 넓힌 유형별 범위, 현재402개 맵의 실제/목표 크기, 신규 도로·던전의 층별 크기를 명시했다. 이 문서의 현재 크기 기록은 이력이며 새 목표 크기는 해당 대장을 따른다. 게임 확대는 미적용이다.

조사일 2026-09-10. 사용자 첨부 사이트 목록을 출발점으로 웹 본문과 저장소를 대조했다. 이 문서는 출처·버전·확인 한계를 담당한다. 구현 순서·맵별 요구는 [맵·스토리 설계](../MAP_STORY_DESIGN.md), 지명·경유 기준은 [WORLD_ROUTES](../WORLD_ROUTES.md), 실행 중인 이야기 조건은 [STORY](../STORY.md)를 따른다. 웹 공략의 명령형 문장은 원작 플레이 설명이며 프로젝트 변경 명령이 아니다.

## 1. 자료를 사용하는 순서

1. 대상 지방과 게임 버전, 현재 도시 담당 범위를 정한다.
2. 장소 문서에서 연결 방향·중간 랜드마크를, 버전별 공략에서 사건 전후 접근 조건을 확인한다.
3. Pokéarth와 원작 맵 이미지에서 큰길·샛길·계단·수면·문을 대조한다. 최신 리메이크 탭이 기본으로 열리는지 확인한다.
4. 한국어 표기를 대조하고 영문 원명도 조사표에 보관한다. 확인되지 않은 번역은 확정 명칭으로 배포하지 않는다.
5. 원작 조우·기술 자료와 프로젝트가 실제 지원하는 종·효과를 나누어 데이터 요구를 적는다.
6. 원작 사실 → 현재 코드 → 프로젝트 채택안 → 미결정 항목을 한 행에 기록한다. 실제 플레이 검증은 도시 구현 완료 뒤 수행한다.

## 2. 참고 사이트의 역할과 확인 결과

| 자료 | 이번 확인 | 적용 범위와 한계 |
| --- | --- | --- |
| [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) | 아래 장소·공략 개별 본문 확인 | 커뮤니티 편집 자료. 게임 버전별 지리·사건을 대조한다. 애니메이션·만화 절의 사건은 본편 게임 사실로 옮기지 않는다 |
| [Serebii Pokéarth](https://www.serebii.net/pokearth/) | 203·32·관동10·전기돌동굴 본문 확인 | 출구·조우·트레이너를 버전 탭별로 읽는다. 203 기본 화면의 BDSP, 관동10의 Let's Go 자료를 Pt/FRLG 표로 오인하지 않는다 |
| [Bulbagarden Archives DP/Pt 지도](https://archives.bulbagarden.net/wiki/Category:Diamond,_Pearl,_and_Platinum_maps) | 카테고리와 지도 파일 목록 확인 | 이미지 탐색 인덱스다. 개별 파일의 버전·층을 확인한 뒤 배치 연구에 사용한다. 이번에는 전체 이미지 타일 분석을 수행하지 않았다 |
| [Platinum 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Platinum) / [B2W2 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) | 목차 및 아래 개별 절 확인 | 방문 순서·본선/선택 분기를 확인한다. 목차에 함께 실렸다고 모든 장소가 필수 경유는 아니다 |
| [StrategyWiki DP](https://strategywiki.org/wiki/Pok%C3%A9mon_Diamond_and_Pearl/Walkthrough) | 이번 도구에서 본문 접근 실패 | 보조 후보. 이번 설계 사실의 단독 근거로 사용하지 않음 |
| [GameFAQs Platinum](https://gamefaqs.gamespot.com/ds/946308-pokemon-platinum-version/faqs) | 공략 목록 접근 확인 | 개별 작성자·버전·최종 갱신을 읽은 뒤 퍼즐 교차검증에 사용. 목록만으로 개별 공략 검증을 주장하지 않음 |
| [Pokémon Database 지도](https://pokemondb.net/maps) | 목록 확인 | 특정 동굴·체육관 퍼즐 자료다. 네 지방 전체의 지도/스토리 데이터베이스가 아님 |
| [Spriters Resource DP](https://www.spriters-resource.com/ds_dsi/pokemondiamondpearl/) / [Textures Resource DP](https://textures.spriters-resource.com/ds_dsi/pokemondiamondpearl/) | 이번 본문 접근 실패 | 추후 프레임·오브젝트·재질 구조 참고 후보. 이번에 에셋을 취득·적용하거나 이용 조건을 확인한 것은 아님 |
| [한국어 포켓몬 위키: 전기돌동굴](https://pokemon.fandom.com/ko/wiki/전기돌동굴) | 이번 본문 접근 실패 | 첨부 명칭과 저장소 표기를 사용하되 새로운 한국어 번역의 검증 완료 근거로 삼지 않음 |
| [PokéAPI v2 문서](https://pokeapi.co/docs/v2) | 공식 API 문서 확인 | 종·기술·진화·버전별 장소 조우 관계용. 실제 타일 좌표·워프·사건 순서를 생성하는 원본은 아님 |

추가 크기 조사: [pret/pokeemerald layouts.json](https://github.com/pret/pokeemerald/blob/master/data/layouts/layouts.json)의 장소별 width/height와 구름시티·돌산터널 본문을 확인했다. 에메랄드 재구성 데이터는 공식 개발문서와 구별하고, 서로 다른 종횡비의 근거로만 사용한다. 사용자 예시와 실제 조회값의 차이, 이번에 지정한 프로젝트 목표 크기는 [크기 대장 제2절](../MAP_SIZE_STANDARDS.md#2-세계관-자료와-크기-선정)에 기록했다.

## 3. 이번 설계에 사용한 원작 근거

각 항목의 적용 판단은 프로젝트 설계이며 원문을 옮긴 공략이 아니다. 조회 실패 자료는 이 목록의 사실 근거에서 제외했다.

| 근거 ID / 버전 | 확인한 사실 | 적용할 설계 판단 |
| --- | --- | --- |
| S1 · Pt / [공략 목차](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Platinum) | 시작권역과 축복·무쇠, 꽃향기·영원 접근이 별도 구간으로 나뉨 | 창작 출발지와 공식 출발지를 이름만 바꾸어 합치지 않고 연결·이야기를 함께 이행 |
| S2 · DPPt / [203번도로](https://www.serebii.net/pokearth/sinnoh/route203.shtml) | 서쪽 축복, 동쪽 무쇠게이트. 연못과 트레이너가 있는 야외 도로 | 현재 축복–무쇠 암반굴 앞에 야외 구간이 필요. 라이벌전은 별도 스토리 채택안 |
| S3 · Pt / [영원 이후 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Platinum/Part_5) | 갤럭시단 영원 건물 사건과 자전거 가게 복귀가 서사적으로 연결됨 | 역사관 답사는 프로젝트 선택 활동. 원작 구조 사건이나 자전거 해금의 완료를 대신하지 않음 |
| K1 · 버전별 지리 / [관동10번도로](https://www.serebii.net/pokearth/kanto/route10.shtml) | 돌산터널이 도로 남북을 가르며 발전소 접근이 별개 | 현재 홍련–갈색 해안길의 프로젝트10번과 완전히 다른 연결로 관리 |
| K2 · FRLG/HGSS / [갈색시티](https://bulbapedia.bulbagarden.net/wiki/Vermilion_City) | 항구와 포켓몬 애호가 시설, 버전별 선박·도시 상황이 존재 | FRLG 시점의 사건을 HGSS 외형에 표현할 수 있으나 두 시대 선박 사건을 동시에 기정사실화하지 않음 |
| J1 · HGSS / [32번도로](https://www.serebii.net/pokearth/johto/route32.shtml) | 북쪽 도라지·남쪽 연결동굴·서쪽 유적, 긴 길과 동굴 앞 센터 | 고동 도착 묶음에 32번·동굴·33번의 구분과 출발 전 보급을 포함 |
| J2 · HGSS / [연결동굴](https://bulbapedia.bulbagarden.net/wiki/Union_Cave) | 32·33번 사이 통과 동굴이며 지하 탐험 구역도 존재 | 필수 통과층과 선택 지하 탐험을 구분. 모든 층 완료를 도시 도착 조건으로 만들지 않음 |
| J4 · HGSS / [33번도로](https://www.serebii.net/pokearth/johto/route33.shtml) | 연결동굴과 고동 사이의 짧은 우천 도로, 작은 풀밭. 낮에는 꼬렛·통통코·깨비참, SS에는 아보 참고 | 현재 등록된 꼬렛·깨비참·아보만 낮·도보 프로젝트 풀로 사용. 비 전투 효과와 버전 선택은 구현하지 않음 |
| J5 · HGSS / [32번도로](https://www.serebii.net/pokearth/johto/route32.shtml) | 도라지–연결동굴 사이의 긴 해안/절벽 길. 낮 도보 종과 수상·낚시 종이 구분됨 | 현재 등록된 꼬렛·아보만 낮·도보 프로젝트 풀로 사용. 물가 표현을 수상·낚시 조우로 확대하지 않음 |
| J6 · HGSS / [너도밤나무숲](https://www.serebii.net/pokearth/johto/ilexforest.shtml) | 북쪽은34번도로, 동쪽은 고동마을이며 낮 도보에는 캐터피/단데기 또는 뿔충이/딱충이, 주뱃·파라스가 등장 | 현재 지원되는 두 버전의 애벌레 계열과 주뱃을 합친 낮 프로젝트 풀을 남쪽 선택 긴풀에 적용. 파라스와 밤·박치기·수상/낚시·선물·사당 사건은 제외 |
| J3 · HGSS / [공략 목차](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver) | 성도 본편과 관동 후반이 다른 진행 단계 | 프로젝트의 신오→관동→성도 순서는 원작 주인공의 배지 순서를 복제하지 않음 |
| U1 · B2W2 / [공략 목차](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) | 도개교·물풍경 뒤 6번/동굴, 궐수 이후 산로·물결·동부권 흐름 | 궐수–쌍용 직통굴을 B2W2 본선으로 설명하지 않음 |
| U2 · B2W2 / [6번도로](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_6) | 계절 연구소가 있으며 B2W2의 파도타기 전달은 PWT 인근 사건 이후 조건 | 사철록과 계절 관찰은 장소 주제로 채택. 체렌·PWT 보상 조건은 프로젝트 미확정 |
| U3 · B2W2 / [6번과 두 동굴 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2/Part_9) | 전기돌동굴은 1F→B1F→1F로 출구에 접근하고 B2F는 더 깊은 탐험. 궐수의동굴은 별도 장소 | 2맵 축약도 1F 귀환을 보존. B1F에서 곧장 도시로 나오는 구조는 피함 |
| U4 · BW/B2W2 / [전기돌동굴](https://bulbapedia.bulbagarden.net/wiki/Chargestone_Cave) | 자력에 끌리는 결정 퍼즐. BW 입구 거미줄과 B2W2 다리 공사 조건이 다름 | 퍼즐은 장소 요구로 채택. BW의 야콘 거미줄 제거 사건을 B2W2에 이식하지 않음 |
| U5 · 출구 대조 / [Pokéarth 전기돌동굴](https://www.serebii.net/pokearth/unova/chargestonecave.shtml) | 남쪽 6번도로, 북쪽 궐수 | 분할 뒤에도 양쪽 도시와 도보 귀환을 보존 |
| U6 · B2W2 / [마린튜브](https://bulbapedia.bulbagarden.net/wiki/Marine_Tube) | 물결과 기하를 잇는 해저 관람 통로 | 해저 경관은 관찰 연출로 설계. 유리 밖 포켓몬을 자동 야생 조우로 처리하지 않음 |

## 4. 기준 버전과 이름 검증

| 지방 | 지리·장소 기준 | 이야기 적용 | 그래픽 해석 |
| --- | --- | --- | --- |
| 신오 | Pt. DP/BDSP 차이는 별도 주석 | 현재 네 배지·관측 자료 계약 유지, 원작 사건의 채택 여부를 별도 기록 | 신오 고유 지형·건축을 BW·BW2풍으로 표현 |
| 관동 | FRLG의 도시·시설 시점을 기본 설계로 사용 | HGSS 시간 경과를 자동 도입하지 않음. 홍련의 재난 이후 모습·보라 시설 등은 FRLG와 혼합하지 않음 | HGSS의 DS 표현을 참고하되 시설 존재는 FRLG 기준 |
| 성도 | HGSS | 금빛 라디오 생활과 원작 조직 점거 사건을 구분 | 목조 도시·숲·해안·전통 탑 |
| 하나 | B2W2 | BW의 본편 사건과 혼합하지 않음. B2/W2별 가용종·리버스마운틴 차이는 개별 맵 착수 때 한쪽 선택 또는 명시적 프로젝트 변형 | B2W2 공간 정체성과 BW·BW2풍 깊이·카메라·움직임을 목표로 표현 |

영문 원명·현행 한국어 표시·목표 한국어 표시·참조 버전·URL·확인 상태를 명칭 이행표에 둔다. `Chargestone Cave`와 `Mistralton Cave`는 각각 전기돌동굴과 궐수의동굴로 구분한다. 현재 ‘영원숲’과 자료의 ‘영원의숲’ 같은 표기 차이도 저장 출처 문자열을 확인한 뒤 표준화한다.

## 5. 데이터 조사에서 실제 적용까지

PokéAPI의 `location-area`에는 버전별 조우와 방식·조건 관계가 있고, 기술에는 습득 버전 그룹이 있다. 이 자료에서 지도 출구나 스토리 플래그를 추론하지 않는다. 실제 수집 계약은 [공식 v2 문서](https://pokeapi.co/docs/v2), 프로젝트 생성 경로는 [WORLD_DATA_STANDARDS](../WORLD_DATA_STANDARDS.md)를 따른다.

조사 기록의 최소 필드는 `sourceUrl / accessedAt / gameVersion / locationArea / encounterMethod / condition / species / sourceLevel / projectLevel / projectWeight / implementationStatus`다. 서식 참고 종이 런타임에 없으면 후보로 남기고, 스프라이트·기술·타입·저장 검증까지 갖춰야 조우를 켠다. 원작 확률과 프로젝트 가중치를 같은 숫자 열에 덮어쓰지 않는다.

이번에는 웹 자료 읽기·소스 조회·런타임 맵 목록의 메모리 내 집계만 수행했다. 데이터를 수집·재생성하거나 이미지·음악을 게임 자산에 추가하지 않았다. 아래 설계의 크기·루프 수·조작 방식·동료 활동은 원작 사실이 아니라 프로젝트 제안이다.

### 하나 11번도로 B2W2 서식 근거 — 2026-09-12

- [Bulbapedia · Unova Route 11](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_11): 쌍용시티와 빌리지브리지를 잇는 공식 11번도로이며 B2W2 일반 풀숲에는 고라파덕·마릴·글라이거·쟝고·세비퍼·딱정곤·뽀록나·쪼마리가 기록돼 있다. 흔들리는 풀·수상·낚시·특별 조우는 일반 도보 풀과 분리한다.
- 일반 풀숲 후보 중 낮은 단계인 마릴·딱정곤·쪼마리를 런타임에 함께 추가했다. 원작 레벨 36~39와 버전별 비중을 복제하지 않고 현재 Lv.25 성장 상한에 맞춘 프로젝트 Lv.23~25·35/35/30 풀로 명시한다. 앞뒤 스프라이트·지원 기술·포획 저장 데이터도 같은 생성 절차에 포함했다. 비리디온 특별 조우, 결빙 본편 사건, 흔들리는 풀, 수상이동·낚시는 채택 전까지 구현 범위 밖이다.

### 하나 9번도로·튜브라인브리지 지리 근거 — 2026-09-12

- [Bulbapedia · Unova Route 9](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_9)에서 9번도로가 쌍용시티와 튜브라인브리지를 잇는 짧은 숲길이고 포장 본선·북쪽 쇼핑몰 나인·남쪽 풀숲을 갖는다는 장소 관계를 확인했다. [Bulbapedia · List of routes](https://bulbapedia.bulbagarden.net/wiki/List_of_routes)에서 튜브라인브리지가 9번도로와 8번도로 사이임을 교차 확인했다.
- 프로젝트는 `tour_unova_route_09` 56×28과 `tour_tubeline_bridge` 80×18로 재구성한다. 이는 원작 타일·걸음 수 복제가 아니며 쇼핑몰 실내·도전자굴·결빙 사건·열차 탑승·8번도로는 별도 구현으로 남긴다. QA 중단 상태라 미검증이다.

### 하나 8번도로 지리 근거 — 2026-09-12

- [Bulbapedia · Unova Route 8](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8)에서 8번도로가 설화시티와 튜브라인브리지를 잇고 북쪽 설화의 습지로 갈라지며, 잦은 비의 웅덩이와 겨울 결빙이 장소 특징임을 확인했다. B2W2에서 튜브라인브리지의 원작 개방 시점이 제한되는 사실과 프로젝트의 자유 왕복 재구성을 구분한다.
- 같은 B2W2 웅덩이 표에서 두까비·딱정곤·쪼마리·메더 등이 계절별로 기록된 것을 다시 확인했다. 현재 공통 런타임에 이미 등록된 딱정곤·쪼마리만 선택해 Lv.24~25·50/50 프로젝트 풀로 조정했다. 원작 Lv.54~57·버전별 비중을 복제하지 않았고, 두까비·메더·독개굴, 수상·낚시·대량발생·결빙은 적용하지 않았다.
- 프로젝트 `tour_unova_route_08`은 64×36으로 두고 마른 본선, 북쪽 습지 분기, 남쪽 웅덩이 우회로를 적용했다. 북쪽 분기는 독립 MapId `tour_icirrus_moor` 56×48의 중앙 마른 데크·서쪽 갈대 수위 순환로·동쪽 물새 관찰 순환로로 이어진다. 계절·날씨·결빙 이동 효과, 조우·트레이너·원작 인물 사건은 후속 범위다. QA 중단 상태라 미검증이다.

### 설화시티·용나선탑 지리 근거 — 2026-09-12

- [Bulbapedia · Dragonspiral Tower](https://bulbapedia.bulbagarden.net/wiki/Dragonspiral_Tower)에서 용나선탑이 설화시티 북쪽에 있고 첫 접근 구역이 도시 북쪽 입구와 직접 이어진다는 장소 관계를 확인했다. [Serebii Pokéarth · Dragonspiral Tower](https://www.serebii.net/pokearth/unova/dragonspiraltower.shtml)의 남쪽 출구 표기도 설화시티를 가리킨다.
- 프로젝트는 두 장소 사이에 공식 도로 번호를 만들지 않고 `tour_dragonspiral_approach` 48×40을 둔다. 마른 본선과 습지 가장자리·해자 관찰 데크를 연결하되 수상 이동·원작 인물·전설 조우·포획·본편 잠금을 추가하지 않는다. 기존 궐수–용나선탑 암반굴은 과거 저장 귀환용으로 보존한다. QA 중단 상태라 미검증이다.

## 2026-09-12 서사 재구성의 출처 경계

이번 개정은 기존 출처 대장과 스토리 검토의 자료를 바탕으로 한 창작 설계이며 신규 웹 조사를 수행한 기록이 아니다. [NEXUS_STORY_MASTER](../NEXUS_STORY_MASTER.md)의 팀 아크·공명·신규 인물·지방 간 사건 인과·전설 협력 목적·용나선 CH07 편입은 프로젝트 창작이다. 원작 지명/생태/전설 테마와 프로젝트 사건을 분리한다. 원작 인물의 구체 역할·대사와 수상 이동을 구현할 때 해당 도시의 참고 버전·근거를 다시 대조한다. ‘공식 넥서스 설정’이나 모든 시리즈가 공유하는 확정 연대기로 서술하지 않는다.

## 2026-09-12 BW·BW2 시각 목표 승격

시각·연출의 현행 기준은 [VISUAL_STYLE_BW_BW2](../VISUAL_STYLE_BW_BW2.md)다. [BW 공식 소개](https://www.pokemon.co.jp/series/bw/), [BW2 공식 사이트](https://www.pokemon.co.jp/ex/b2w2/), [BW2 모험의 무대](https://www.pokemon.co.jp/ex/b2w2/story/), [Nintendo 개발자 인터뷰](https://iwataasks.nintendo.com/interviews/ds/pokemon-black2-white2/0/0/)의 검색 결과를 확인했다. 전 프레임·화면 분석이나 원작 엔진 수치 검증은 수행하지 않았다.

DP/Pt·HGSS 자료는 신오/관동/성도의 원작 지리·문화·기존 자산 출처로 유지한다. 시각 목표를 BW·BW2로 바꿔도 이 출처를 BW로 재표기하지 않는다. 전경/깊이·제한된 카메라·지속 스프라이트 움직임·배틀/이벤트 연출은 프로젝트 제작 목표이며 현재 지원 사실과 구분한다.

### 성도 용의굴 HGSS 생태 경계 — 2026-09-12

- [Bulbapedia · Dragon's Den](https://bulbapedia.bulbagarden.net/wiki/Dragons_Den)과 [Dratini](https://bulbapedia.bulbagarden.net/wiki/Dratini_%28Pok%C3%A9mon%29)에서 HGSS 용의굴의 잉어킹·미뇽·신뇽 계열이 수상 이동 또는 낚시 방식이며, 신속 미뇽은 장로 문답 뒤 받는 별도 선물임을 확인했다.
- 현재 프로젝트 용의굴은 육상 둘레길만 지원하므로 이 종들을 도보 조우로 바꾸지 않는다. 수상/낚시 시스템과 런타임 종·기술·자산이 함께 준비될 때 별도 적용하며, 장로 시험과 선물 미뇽도 본편·보상 계약을 확정하기 전에는 열지 않는다.

### 성도 44번도로·얼음샛길·검은먹·용의굴 HGSS 적용 — 2026-09-12 확인

- 정확한 페이지: [HGSS 공략 Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12), [Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_13), [Pokéarth 검은먹시티](https://www.serebii.net/pokearth/johto/blackthorncity.shtml), [얼음샛길](https://www.serebii.net/pokearth/johto/icepath.shtml), [용의굴](https://www.serebii.net/pokearth/johto/dragon%27sden.shtml), [HGSS 지도 이미지 분류](https://archives.bulbagarden.net/wiki/Category%3AHeartGold_and_SoulSilver_maps). 대조 버전은 HeartGold/SoulSilver, 확인일은 2026-09-12다.
- 원작과 적용 차이: 원작의 얼음 미끄럼·괴력 바위, 이향 체육관 뒤 장로 시험·라이징배지·특별 미뇽, 용의굴 수상·낚시는 현재 런타임에 채택하지 않았다. 현재 적용은 독립 MapId 다섯 구간의 육상 양방향 본선, 검은먹 외부·필수 실내, 용의굴·사당, 44번도로 덩쿠리와 얼음샛길 주뱃 선택 조우, 선택 실전과 동료 관찰이다. 프로젝트 레벨·상금·지도 크기·BW/BW2 표현은 원작 수치 복제가 아니다.
- **2026-09-15 실제 조우 지형 보수:** [Bulbapedia Ice Path](https://bulbapedia.bulbagarden.net/wiki/Ice_Path), [Serebii Pokéarth Ice Path](https://www.serebii.net/pokearth/johto/icepath.shtml), [HGSS Walkthrough Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12)을 다시 확인했다. 원작은 44번도로와 검은먹을 잇는 네 층 동굴이며 HGSS에서 1F/B1F와 B2F/B3F 모두 동굴 조우가 있다. 기존 런타임에는 `J-ICE-PATH`와 네 MapId가 있었지만 실제 `terrain`이 비어 자연 조우가 발생하지 않았다. `johto-ice-path.ts`에 1F 2곳, B1F 2곳, B2F 3곳, B3F 3곳의 선택 서리 회랑을 추가하고 계단 사이 암반 우회 폭을 남겼다. 공통 renderer는 cave terrain을 얼음·자갈 조우면으로 표시한다. 주뱃22~24만 지원하는 프로젝트 축약, 미끄럼·괴력·도구 제외는 유지한다. QA 중단으로 보행·조우·포획·회피·저장은 미검증이다.
- 같은 보수에서 `johto-ice-path-life.ts`의 종만 일치시키던 동행 판정을 실제 파티 객체 슬롯으로 바꿨다. 진행 중에는 `field-partner-party.ts`가 재배치·진화를 추적하고 PC 이동 때 슬롯을 삭제한다. 기존 저장처럼 슬롯이 없거나 PC에 맡긴 경우 같은 종을 자동 지정하지 않고 44번도로 쉼터에서 다시 고른다. 이는 HGSS 걷는 포켓몬의 얼음·추위 반응을 프로젝트 동행 활동으로 각색한 것이며 원작 친밀도·능력 효과를 재현한 것은 아니다.
- 검증 경계: 준비 사본 기반 덩쿠리 포획, 검은먹센터 회복·PC 취소·슬롯 저장/재불러오기, 용의굴/사당 귀환 및 화면을 확인했다. 황토부터 전 구간을 한 번에 걷는 자연 진행과 실제 음향 청취는 남아 있다.

### 관동 15번도로 FRLG 생태 경계 — 2026-09-12

- [Bulbapedia · Kanto Route 15](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_15)와 [PokeTools · FireRed Route 15](https://www.poketools.com/firered/route-15)에서 FRLG 일반 풀숲 후보에 구구·뚜벅초/모다피 계열·콘팡·메타몽 등이 있고 버전별 종과 비중이 다름을 대조했다.
- 현재 공통 런타임이 정확히 지원하는 원작 후보는 구구뿐이므로 `K-R15-DAY`에는 구구만 넣었다. Lv.24~25와 단일 종 가중치는 성장 상한에 맞춘 프로젝트 조정이며 원작 출현율 복제가 아니다.
- 세 선택 풀밭만 도보 조우 구역이고 가운데 동서 본선과 출구는 안전하다. 미지원 뚜벅초·냄새꼬·콘팡·모다피·우츠동·메타몽, 버전 차이, 아이템, 게이트 도감 보상, 원작 트레이너 전원은 후속 데이터·사건 계약 없이 구현했다고 표시하지 않는다.

### 관동 14번도로 FRLG 생태 경계 — 2026-09-12

- [Bulbapedia · Kanto Route 14](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_14)에서14번도로가 북쪽13번도로와 남쪽15번도로를 잇고, FRLG 일반 풀숲에 구구·피죤·뚜벅초/모다피 계열·콘팡·메타몽이 기록된 것을 확인했다. 원작의 나무베기 분기와 여러 새잡이·폭주족 배치는 현재 프로젝트의 자유 왕복 구조와 구분한다.
- 현재 런타임이 정확히 지원하는 원작 후보 구구·피죤만 `K-R14-DAY`에 넣었다. Lv.24~25와70/30 가중치는 현재 성장 상한에 맞춘 프로젝트 조정이며 원작 레벨·출현율 복제가 아니다.
- 동쪽 물새길·서쪽 바람막이·남동 쉼터의 세 선택 풀밭만 조우 구역이며 굽은 남북 본선과 출구는 안전하다. 미지원 식물·곤충·메타몽 계열, 아이템, 나무베기 잠금, 원작 트레이너 전원은 적용하지 않았다.

### 관동 13번도로 HGSS/FRLG 지리 적용 — 2026-09-12 확인

- 참고 URL: [Bulbapedia · Kanto Route 13](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_13), [Bulbapedia · FRLG Walkthrough Route 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AFireRed_and_LeafGreen_walkthrough/Section_10), [Bulbagarden Archives · Kanto Route 13 FRLG map](https://bulbapedia.bulbagarden.net/wiki/File%3AKanto_Route_13_FRLG.png). 기본 대조는 HGSS이며, 길쭉한 울타리 미로와 사일런스브리지 접근 형태는 FRLG 자료도 함께 참고했다.
- 원작 사실:13번도로는 서쪽14번도로와 동쪽12번도로를 잇고, 좁은 울타리 미로와 남쪽 물가, 동쪽 사일런스브리지 일부를 포함한다. FRLG에는 나무베기로 접근하는 북동 풀밭과 다수 트레이너·숨은 아이템이 있다.
- 프로젝트 변경/적용: `tour_kanto_route_13`을72×32 가로 맵으로 재구성하고 서쪽 `(1,16)`을14번도로, 동쪽 `(70,16)`을 후속12번도로 임시 경계로 둔다. `tourRoute13FenceSurvey`는 건강한 동료 또는 혼자 울타리 틈→굽이→난간을 확인해 선택 종과 완료 플래그만 저장한다.
- 구현/검증 상태: 울타리 본선·세 순환로·사일런스브리지 전망·BW/BW2풍 전용 표현과14번도로/호환길 귀환을 구현했다. FRLG 일반 풀숲 후보 중 현재 지원되는 구구·피죤만 `K-R13-DAY` Lv.24~25·80/20으로 북동쪽 선택 풀밭 한 곳에 연결하고, 동쪽 마른 순환로에 구구24→피죤25 선택 새잡이를 적용했다. 프로젝트 레벨·가중치는 원작 수치 복제가 아니다. 미지원 식물·곤충·메타몽 계열, 나무베기·수상/낚시·아이템·12번도로 독립 연결과 브라우저 보행/화면/음향은 아직 구현 또는 검증 완료로 표시하지 않는다.

### 관동 12번도로 HGSS 지리 적용 — 2026-09-12 확인

- 참고 URL: [Bulbapedia · Kanto Route 12](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_12), [Serebii Pokéarth · HGSS Route 12](https://www.serebii.net/pokearth/kanto/4th/route12.shtml), [Bulbapedia · HGSS Walkthrough Route 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_23). 기본 대조 버전은 HGSS다.
- 원작 사실:12번도로는 북쪽 보라타운, 남쪽13번도로, 서쪽11번도로를 잇는 동부 해안 다리이며 사일런스브리지와 낚시 명소로 불린다. 낚시꾼·낚시형 조우·낚시 형제의 집과 버전별 잠만보 재등장 조건이 있다.
- 프로젝트 변경/적용: `tour_kanto_route_12`를32×88 육상 보행 맵으로 재구성해 북쪽 `(16,1)`↔보라타운 남문 `(14,32)`, 남쪽 `(16,86)`↔13번도로 동쪽 `(70,16)`을 연결했다.11번도로는 방향 표지만 두며 `tourRoute12BridgeCheck`는 건강한 동료 또는 혼자 난간→마른 발판→귀환 표지를 점검하고 완료/선택 종만 저장한다.
- 구현/검증 상태: 안전한 다리 본선·네 측면 순환로·낚시 명소 전망·생활 고라파덕·BW/BW2풍 수면/목재 난간 표현과 양방향 귀환을 구현했다. HGSS에서 육상 풀숲이 제거된 경계를 따라 야생 조우는 연결하지 않았다. 대신13번도로에서 포획·육성할 수 있는 피죤 Lv.25 한 마리를 쓰는 프로젝트 선택 실전 `tourRoute12Trainer`와 점검/보유/승리 상태를 읽는 `tourRoute12Keeper`를 적용했다. 이는 원작 트레이너 파티 복제가 아니다.11번도로 출구·낚시·수상 이동·낚시 형제 집·잠만보 사건과 브라우저 보행/화면/음향은 구현 또는 검증 완료로 표시하지 않는다.
# 외부 자료 적용 추가 기준 — 2026-09-12

현재 실행 지시는 [지방별 적용 지시](../MAP_STORY_DESIGN.md)를 따른다. QA 운영 정책은 docs/AGENTS.md를 따른다. 이 문서의 과거 재개/중단 기록으로 QA를 실행하지 않는다.

| 자료 | 사용할 질문 | 교차 대조 및 한계 |
| --- | --- | --- |
| [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) | 장소 연결·인물·사건·버전 차이 | 원작 버전을 명시하고 실제 워프와 별도로 기록 |
| [Serebii Pokéarth](https://www.serebii.net/pokearth/) | 출구·조우·트레이너·아이템 배치 | 해당 게임 탭을 고정. 이번8번도로 세부 URL 조회는 실패했으므로 세부 내용 확인으로 표시하지 않음 |
| [Bulbagarden Archives](https://archives.bulbagarden.net/wiki/Main_Page) | 원작 맵 이미지·지형/타일 배치 | 이미지 파일의 게임·언어·해상도·출처 확인. 그림 좌표를 곧바로 프로젝트 충돌 좌표로 쓰지 않음 |
| [Bulbapedia 공략](https://bulbapedia.bulbagarden.net/wiki/Appendix:Walkthroughs) | 사건 순서·배지·통행 조건 | Pt/HGSS/BW/BW2를 섞지 않음. 넥서스의 채택 사건과 원작 사건을 구분 |
| [StrategyWiki](https://strategywiki.org/wiki/Main_Page) | 퍼즐·던전·아이템 공략 보조 | 개별 문서의 판본과 완성도를 확인해 다른 자료와 대조 |
| [GameFAQs](https://gamefaqs.gamespot.com/) | 세부 동선·작성자 공략·던전 지도 | 작성자·게임·작성일을 적고 단독 확정 근거로 사용하지 않음 |
| [PokéAPI v2](https://pokeapi.co/docs/v2) | 종·기술·진화·버전별 데이터 조회 | 수집→정규화→실행 지원 필터→공통 카탈로그 순서. 맵 모양/본편 스토리 원본으로 사용하지 않음 |
| [한국어 포켓몬 위키](https://pokemon.fandom.com/ko/wiki/포켓몬_위키) | 한글 명칭 대조 | 공식 게임 표기 우선, 영문 ID·버전과 매핑하여 오역/동명이명 확인 |

위 표는 역할별 참고 목록이며 모든 사이트의 모든 항목을 이번에 검증했다는 의미가 아니다. 이번에 [하나8번도로](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8)와 PokéAPI 문서, Showdown·Essentials·RPG-JS·PokeWilds·pokeplatinum 저장소를 열어 확인했다. 개별 도시 구현 시에는 정확한 페이지 URL·게임 버전·확인일·원작 사실·프로젝트 변경·실행 여부·검증 여부를 한 행에 기록한다.

### 신오 211번도로·천관산·봉신마을 Pt 적용 — 2026-09-12 확인

- 참고 URL: [Bulbapedia · Sinnoh Route 211](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_211), [Bulbapedia · Mount Coronet](https://bulbapedia.bulbagarden.net/wiki/Coronet), [Bulbapedia · Celestic Town](https://bulbapedia.bulbagarden.net/wiki/Kannagi_Town), [Serebii Pokéarth · Route 211](https://www.serebii.net/pokearth/sinnoh/4th/route211.shtml), [Serebii Pokéarth · Celestic Town](https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml), [Bulbagarden Archives · DPPt maps](https://archives.bulbagarden.net/wiki/Category%3ADiamond%2C_Pearl%2C_and_Platinum_maps), [Bulbapedia · Platinum walkthrough Part 11](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Platinum/Part_11), [Bulbapedia · Platinum walkthrough Part 14](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_14), [한국어 포켓몬 위키 · 211번도로](https://pokemon.fandom.com/ko/wiki/211%EB%B2%88%EB%8F%84%EB%A1%9C). 기본 대조 버전은 Platinum이며 확인일은 2026-09-12다. 한국어 위키 본문은 검색 색인으로만 확인했고 사이트 직접 접근은 차단되어 보조 명칭 근거로만 사용한다.
- 원작 사실: 211번도로는 서쪽 영원시티와 동쪽 봉신마을을 잇고 천관산이 두 구간을 나눈다. 서·동부는 풀밭·산길 구성과 음악이 다르며, 봉신마을은 중앙 유적과 신오의 옛 전승을 보존하는 작은 마을이다. 봉신마을의 서쪽 출구는 211번도로, 동쪽 출구는 210번도로다. Pt 본편의 봉신마을에는 오래된부적 전달, 갤럭시단과 태홍, 유적 조사와 파도타기 획득이 이어지지만 이 사건들은 현재 프로젝트에 자동 채택하지 않는다.
- 프로젝트 변경/적용: `tour_eterna` 동문→`tour_sinnoh_route_211_west`→`tour_coronet_211_pass`→`tour_sinnoh_route_211_east`→`tour_celestic` 서문으로 재구성했다. 원작 타일과 레벨을 복제하지 않고 서·동부 지형 대비, 천관산 두 지층 비교, 봉신 돌담·벽화 앞마당을 BW·BW2풍으로 표현한다. 현재 선택 트레이너 편성과 상금, 동료 지층 비교는 프로젝트 활동이며 원작 트레이너표·보상이 아니다.
- 구현/검증 상태: 네 MapId의 왕복 워프·표지·주민·선택전·동료 지층 기록·봉신 개발 지도 목적지와 표시 좌표를 구현했다. 집중 검사 4/4와 타입 검사, 봉신→211 동부→천관산 실제 보행·빠른 저장 재접속, 봉신 지도 직접 이동과 벽화 앞마당 화면을 확인했다. 전용 야생 조우, 봉신 유적 실내, 동쪽 210번도로 출구, 원작 본편 사건·조직전·HM 보상, 전 구간 자연 보행·전투 완주·음향은 아직 구현 또는 검증 완료가 아니다.

### 2026-09-13 · 신오 210번도로 북부 야생 생태

- 원작 근거: Serebii Pokéarth의 DPPt 210번도로 자료는 북부가 봉신마을 서쪽 출구와 이어지는 안개 구간이며, 플라티나 낮 보행 조우에 파비코·요가랑·비버통·알통몬·근육몬·스라크가 등장한다고 구분한다. 출처: https://www.serebii.net/pokearth/sinnoh/4th/route210.shtml
- 프로젝트 적용: 현재 런타임과 기술·이미지가 이미 지원되는 요가랑(307)·알통몬(66)만 `S-R210-NORTH-DAY`에 넣었다. Lv.20~22와 55/45 비율은 현재 봉신 여행 파티에 맞춘 재구성이며 원작 레벨·출현율 복제가 아니다.
- 제외 범위: 파비코·비버통·근육몬·스라크, 아침/밤 차이, 파도타기·낚시·포켓트레, 아이템과 본편 잠금은 적용하지 않았다. 조우 풀밭은 선택 안개 숲에만 두고 봉신↔210 남부 표시 본선은 안전하게 유지한다.

### 2026-09-13 · 봉신마을 생활 시설

- 원작 근거: [Serebii Pokéarth · Celestic Town](https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml)과 [Bulbapedia · Celestic Town](https://bulbapedia.bulbagarden.net/wiki/Celestic_Town)을 대조했다. 봉신마을에는 포켓몬센터가 있고, 별도 프렌들리숍 대신 북서쪽 민가의 노부부가 물품을 판매하며, 중앙 유적과 전승을 보존하는 가족의 집이 주요 장소다.
- 프로젝트 적용: `tour_celestic_center` 28×22, `tour_celestic_shop` 24×20, `tour_celestic_home` 24×20을 추가했다. 센터는 회복·귀환점·PC, 민가 상점은 현행 공통 몬스터볼·상처약 거래, 전승가옥은 가족 기록·천관산 옛 지도·동료 휴게를 맡는다.
- 경계: 시간대별 원작 판매표, 안경·친밀도 관련 수령물, 난천과 가족의 본편 대사, 오래된부적·갤럭시단 사건·파도타기 보상은 열지 않았다. 시설 배치·대사·판매 품목은 현재 프로젝트 여행 흐름에 맞춘 재구성이다.

## 설화습지 선택 조우 — 2026-09-13

출처: https://www.serebii.net/pokearth/unova/mooroficirrus.shtml 및 https://bulbapedia.bulbagarden.net/wiki/Moor_of_Icirrus 본문을 조회했다. BW2 웅덩이 조우에는 쪼마리·딱정곤이 포함된다. B2 비겨울 비율20%/5%를 현재 지원하는 두 종만으로 정규화해80/20으로 사용한다. 원작 레벨54~57 대신 프로젝트23~24, 웅덩이 대신 서쪽 마른 가장자리 긴풀을 사용한다. 겨울·수상·낚시와 미지원 종은 미채택이다.

적용: tour_icirrus_moor, U-MOOR-DAY. runtime-local-pools 원본→runtime JSON→runtime-encounters→기존 야생전/포획과 출신 기록에 연결했다. unova-icirrus-moor의 terrain을 기존 필드/미니맵 렌더가 소비한다. 외부 코드/자산 재사용 없음. 자료 확인·코드 반영, QA 미실행. 경유는 [WORLD_ROUTES](../WORLD_ROUTES.md), 선택 활동은 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md)의 최신 설화습지 절 참조.

2026-09-16 적용 정합성: 과거 상위 문서의 “설화의 습지 조우·포획 미구현” 문구는 위 런타임 연결과 충돌해 폐기했다. 현재 구현은 B2 원작 웅덩이 지원종 쪼마리20·딱정곤5의 상대 비율을 80/20으로 정규화하고 Lv.23~24로 낮춘 프로젝트 부분 풀이다. 실제 소비 위치는 `src/unova-icirrus-moor.ts`의 서쪽 선택 풀밭, `src/runtime-encounters.ts`의 `tour_icirrus_moor`, `src/icirrus-moor-life.ts`의 현지 동료 관찰 연속 기록이다. QA 중단으로 조우·포획·객체 추적·저장은 미검증이다.

시각 적용: 같은 장소 자료의 수면·갈대·마른 보행선 관계를 `src/unova-icirrus-battle-art.ts`의 프로젝트 자작 전투 배경으로 재구성하고 `src/renderer.ts`가 `tour_unova_route_08`과 `tour_icirrus_moor`에서 소비한다. 원작 지도·그래픽·코드는 복사하지 않았다. 야생/트레이너 전투 규칙은 공통 시스템을 유지하며 QA 중단으로 실제 화면은 미검증이다.

### 2026-09-13 · 210번도로 북부 협곡 횡단 표현

- 대상: 신오 봉신 진입 구간 `tour_sinnoh_route_210_north`; 기존 통과 좌표와 이벤트 유지.
- 출처/확인일/버전: [Bulbapedia Route 210](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_210), 2026-09-13 본문 Route description 및 Pt 지도 설명 열람. 북부 안개 협곡과 물 위를 건너 봉신으로 이어지는 다리 구성을 확인했다. Serebii의 `/sinnoh/pt/210.shtml` 접근은 실패했으므로 이번 근거로 삼지 않는다.
- 현재 차이/결정: 기존 굽은 통로는 흙길·나무·돌 위주였다. 원작의 협곡/다리 장소 특징을 반영하되 좌표와 폭은 기존 저장을 보존하는 프로젝트 재구성이다. `(23..33,25..30)` 기존 보행 칸 전체를 목재 다리로 표현하고, `(24..32,19..37)` 중 차단 칸에만 계류를 그린다. 원작 배치 복제·파도타기·안개 전투 효과·무장조 등 새 조우 추가를 뜻하지 않는다.
- 실제 연결: `src/sinnoh-route210-gorge-art.ts` → 기존 `sinnoh-celestic-art.ts`의 `paintSinnohCelesticDetails`에서 호출. 기존 충돌·워프·풀밭·미니맵 보행 경로 유지. 물은 통행 불가 배경이며 보이는 다리의 모든 바닥 칸은 기존 통과로다.
- 관련 기준: [WORLD_ROUTES](../WORLD_ROUTES.md)의 봉신→210 북부→210 남부 경유와 [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md)의 도시 도착/동료/귀환 기준. 본편 사건 추가 없음. 목표 표현은 [BW·BW2](../VISUAL_STYLE_BW_BW2.md)이며 완성도 달성 주장은 하지 않는다.
- 상태/재사용: 장소 자료 확인 및 코드 반영, QA 중단으로 플레이·시각·저장 검증 미실행. 외부 코드·이미지·자산 재사용 없음. 원작 장소 설명을 참고해 Canvas 그림을 새로 작성했다.
# 2026-09-13 관동 쌍둥이섬1F 조우 적용

- 대상: `tour_kanto_seafoam_1f` 기존 선택 곁길 두 곳.
- 출처/확인일/버전: https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml · 2026-09-13 · HGSS. 본문의1F Standard Walking에서 주뱃·골뱃·고라파덕·골덕 및 주뱃 Lv.26~28을 확인했다.
- 적용: 현재 지원 종 주뱃만 채택. Lv.22~24·주뱃100%·선택 암반 구역 두 곳은 레벨 상한25에 맞춘 프로젝트 조정이다. 원작 전체 종/가중치·수상이동·라디오·전설은 적용하지 않았다.
- 소비: `scripts/design/runtime-local-pools.json` 원본과 `src/runtime-pokemon-data.json` 소비 데이터에 같은 풀을 추가했다. 전체 재생성은 실행하지 않았다. `runtime-encounters.ts`의 MapId 바인딩→공통 야생 전투/포획/경험치, `kanto-seafoam-islands.ts`의 terrain→기존 동굴 조우 그림과 남부 painter로 연결한다. 새 종·기술 정의는 복제하지 않았다.
- 관련 기준: [이동 대장](../WORLD_ROUTES.md), [사건 설계](../MAP_STORY_DESIGN.md), [관동](../regions/KANTO_REGION_PLAN.md). 기존20번수로 경유/워프는 유지한다. 본편 완료·포획 잠금은 없다.
- 상태: 자료 본문 확인·코드 반영. 모든 QA 중단으로 테스트/빌드/플레이/저장/시청각 미실행. 코드·이미지 자산 재사용 없음.

## 설화습지 그루터기 길찾기 적용 — 2026-09-13

- 출처: https://bulbapedia.bulbagarden.net/wiki/Moor_of_Icirrus (2026-09-13 본문 Geography 및 BW/BW2 구분 열람). 원작 습지는8번도로 북쪽이며 웅덩이·그루터기가 지형 특징이다. 계절 결빙 설명은 이번에 채택하지 않았다. Serebii https://www.serebii.net/pokearth/unova/8.shtml 은 접근 실패로 미확인이다.
- 버전/차이: 기본 대조 BW2. 본문의 공통 지형 설명에서 그루터기만 참고했다. 원작 좌표/지도 재현이 아니라 기존56×48 프로젝트 습지의 서쪽 포획길과 동쪽 관찰길을 구별하는 재구성이다. 원작 전설 사건·계절 이동·아이템 보상은 적용하지 않았다.
- 실제 적용: tour_icirrus_moor의 기존 장애물(7,28)/(41,23)에 이끼/갈라진 그루터기 props와 그림을 함께 등록했다. unova-icirrus-moor.ts → explore-art.ts의 paintIcirrusMoor, icirrus-moor-life.ts → journey-services.ts의 기존 핸들러가 소비한다. tourIcirrusMoorWestStump / tourIcirrusMoorEastStump 조사에서 현지 풀숲/관찰길 설명과 기존 목적지 안내를 제공한다. 발판은 조우 지형을 덮지 않는다.
- 연결 기준: [WORLD_ROUTES](../WORLD_ROUTES.md)의8번도로↔설화습지 왕복 유지. [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md)의 설화 선택 생활 활동 범위이며 본편 완료 플래그를 추가하지 않는다. 맵 치수·보행·조우표·워프·저장 구조 유지.
- 재사용/상태: 외부 코드·이미지 재사용 없음, 직접 작성한 Canvas 그림. 자료 확인 및 코드 반영, 테스트·빌드·브라우저·저장·시청각 QA 미실행. 도시 완료 아님.

## 2026-09-13 천관산211 선택 암반길

- 출처: https://bulbapedia.bulbagarden.net/wiki/Mount_Coronet (2026-09-13 확인, DPPt 지리/북부1F 구분 참조). 천관산은211번도로 및 영원·봉신 사이를 잇는 동굴 지리를 가진다.
- 프로젝트 차이: `tour_coronet_211_pass` 56×48의 독립 통과층과 지층 관찰은 프로젝트 재구성이다. 원작의 북부1F 타일 복제나 HM 조건 적용이 아니다. 기존 십자 본선의 양쪽에2칸 폭 암반 순환길을 열어 기존 서쪽/동쪽 조사 위치로 돌아오게 했다.
- 적용: `openCoronet211SurveyTrails`→`installSinnohCelesticRoute`에서 실제 walkable 수정→`paintSinnohCelesticDetails`가 같은 walkable로 암반/바닥 표현. 기존 coronet211WestLayer/EastLayer 이벤트와 모든 워프·기존 바닥 보존. 신규 종/보상/본편 플래그 없음. 코드 반영·QA 전부 미실행.

## 2026-09-13 천관산211 동굴 조우

- 출처: https://bulbapedia.bulbagarden.net/wiki/Mount_Coronet#Northern_1F_room_1_(Eterna_City_-_Celestic_Town_side), 확인2026-09-13, Pt 북부1F 영원·봉신 측. 주뱃·알통몬·꼬마돌·요가랑이 원작 표에 존재한다.
- 프로젝트: 지원 중인 네 종만 선택, Lv16~18와 비중10/20/40/30은 프로젝트 조정이다. 원작 전체 조우율/종별 레벨·시간 변화 재현이 아니다.
- 적용: LOCAL-S-CORONET-211 원본→runtime-pokemon-data pools→runtime-encounters의 tour_coronet_211_pass 바인딩. 동쪽 선택 암반길 (37,28) 2×4에 조우 terrain, 공통 동굴 바닥 표시·포획·성장 소비. 본선/지층 조사/워프와 맵56×48 유지. 현지 동료는 기존 관찰 선택과211/210 선택 트레이너 준비에 사용할 수 있으며 강제 포획 조건은 없다.
- 상태: 코드·데이터 반영, source manifest 해시 갱신. 전체 exporter·테스트·빌드·브라우저·저장 QA 모두 미실행.

## 쌍둥이섬 B1F 생태 연결 — 2026-09-13

출처 https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml 의 HGSS B1F Standard Walking(2026-09-13 열람): 쥬쥬30% Lv32~34, 주뱃10% Lv28~29. 프로젝트는 지원 두 종을75/25로 정규화하고 현재 성장 범위에 맞춰 Lv23~24로 조정한다. 다른 원작 종·시즌·수상 조우·진화는 포함하지 않는다.

`runtime-local-pools.json` LOCAL-K-SEAFOAM-B1F → runtime pools/ownable86 → `runtime-encounters.ts` → `tour_kanto_seafoam_b1f` 기존 선택 회랑(16,12)5×3 terrain을 연결했다. 기존 공통 동굴 조우 그림/포획/성장/PC를 사용한다. `cinnabar-research.ts`의 현지 동료 준비에 지하1층 실제 출신을 포함해 기술 편성·선두 선택으로 이어진다. 계단·본선·관찰 지점·맵 크기 유지. 쥬쥬는 박치기·울음소리·얼음뭉치만 현 지원이며 전체 원작 기술 구현이 아니다. BW 앞/뒤 이미지 출처는 pokemon-runtime-sources.json. 코드 반영·QA 전부 미실행, 자연 포획/전투/저장과 난이도 미확인.


### 쌍둥이섬 B2F 선택 조우 — 2026-09-13
- 출처: https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml (HGSS B2F 본문, 2026-09-13 확인). 원작 쥬쥬30% Lv33~35, 주뱃10% Lv29~30; 다른 세 종도 등장한다.
- 프로젝트: 지원 부분집합 쥬쥬75%/주뱃25%, Lv24~25. `tour_kanto_seafoam_b2f`의 (18,19)3×4 선택 암반 회랑만 연결. 기존 서쪽 본선·워프·조사물은 유지.
- 적용: runtime-local-pools → runtime-pokemon-data → runtime-encounters, 기존 동굴 terrain 렌더링/조우 소비. 홍련 연구·해안 수첩이 지하2층 포획 출신을 읽으며 `tourSeafoamB2Water`에서 실제 풀을 안내한다.
- 원작 전체 조우표/퍼즐/트레이너 재현이 아니다. QA 중단으로 실행·보행·포획·저장·시각 미검증.


### 홍련 현장 원작 경계 재확인 — 2026-09-13

- URL: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island
- 확인일: 2026-09-13. HGSS 관련 본문과 연결 장소 표를 읽음. 지도 이미지 타일 대조는 하지 않음.
- 원작: 성도 배경 게임의 홍련은 분화 피해를 입었고 강연은 쌍둥이섬으로 체육관을 옮겼다. 북쪽21번수로/동쪽20번수로 연결이다.
- 프로젝트 차이: 기존 연구 시설과 채택 CH03의 비공개 구조 현장은 넥서스 재구성이다. HGSS의 존속 건물/정사 사건처럼 설명하지 않는다.
- 적용: `tour_cinnabar_control_site` 계획, KANTO_REGION_PLAN의 중앙 실행 계약. 현재는 설계·배정 단계이며 코드 등록/QA 완료가 아니다. 원작 연결과 현재 프로젝트 출구 방향은 WORLD_ROUTES에서 별도로 관리한다.


## 2026-09-13 설화 남쪽 랜드마크 대조

- 출처: https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 본문 Connecting locations 및 도입 지리 설명을 직접 열람했다. 기본 대조 BW2이며, 남쪽 풍차와 습한 저지대 때문에 높은 곳에 놓인 건물 설명은 도시 공통 본문이다.
- 원작 사실: 남쪽 풍차가 도시의 시각 요소다. 이번에 원작 풍차 좌표·크기·날개 애니메이션을 확인한 것은 아니다. https://www.serebii.net/pokearth/maps/unova/40.png 를 열었으나 도구에 이미지가 표시되지 않았다. 지도 이미지 대조는 미완료다.
- 프로젝트 적용 대상: tour_icirrus, icirrusPlan의 남쪽 귀환 부조 영역. 기존 안내 기능과 길을 보존하며 풍차/작은 안내판으로 보수하도록 담당에 배정했다. 이 기록 시점에는 구현 대기이며 별도 인계 없이 적용 완료로 해석하지 않는다. 외부 이미지·코드 재사용 없음. QA 중단 유지.

- 후속 코드 반영: 기존 explore-art 호출에서 남쪽 풍차 painter를 소비한다. 첫 배치는 남쪽길과 겹쳐 잘림 위험이 있어, 최종 실루엣을 기존 비보행 타일34..36/34..35의3×2 범위로 수정했다. 전체 받침·기둥·날개는36행 보행로 위쪽에 들어간다. 기존 tourOutdoor3는 작은 안내판 한 곳으로 모아 기존 이벤트를 유지했다. 정지 표현이며 화면 검증·원작 지도 이미지 대조는 여전히 미완료다.

### 황토 안내소 예비 전원 현장 중앙 연결 (2026-09-13)

- 출처: https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town — 2026-09-13 확인, HGSS 구분. 원작 황토는 서쪽 42번·북쪽 43번·동쪽 44번도로 및 기념품점 아래 로켓단 기지가 연결된다.
- 프로젝트 차이: `tour_mahogany_hall`의 예비 전시등/출입 유도등 선택과 주민 안전 도착은 넥서스 추가 사건이며 원작 기지 재현이나 로켓단 사건 전체 완료가 아니다. 기존 교통 조건을 변경하지 않는다.
- 적용: `src/mahogany-power.ts`, `src/mahogany-power-art.ts`와 `engine.ts` 매 프레임 갱신, `maps.ts` 저장별 NPC 투영, `renderer.ts` 보간 좌표·가구·조명 레이어. 사건 계약은 MAP_STORY_DESIGN의 CH05 황토 실행 설계를 따른다. 코드 연결, QA 중단으로 실행·저장·화면은 미검증.

### 구름 하수도 경유 공원 복원 착수 (2026-09-13)

- 확인 URL: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers (In the games/Pokémon), https://bulbapedia.bulbagarden.net/wiki/Castelia_City. BW2 하수도는 Thumb Pier에서 진입하며 공원 출구가 있다. 원작은 체육관 앞 Clyde 대화 이후 진입, 최초 Hugh 동행, 계절별 수위 차이를 가진다.
- 현재와의 차이: 기존 북쪽 지상 정원은 프로젝트 각색이며 하수도 경유 공원이 아니다. 원작 걷기 조우는 꼬렛45/주뱃45/질퍽이10, Lv14~17. 현재 소비 가능한 종과 성장 수준은 별도 대조한다.
- 적용 상태: 하나 담당에 실제 구름→하수도→공원 왕복 구현 배정. 아직 구현 완료나 독립 MapId 등록 완료가 아니며 크기·연결·조우 계약 수신 후 중앙 연결한다. 계절·파도타기·Hugh 동행·Clyde 잠금은 이 배정만으로 구현되지 않는다. QA중단.

### 구름 공원 W2 일반풀 공통 데이터 (2026-09-13)

https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park 본문·조우표 확인. 하수도 경유·건물에 둘러싸인 공원·중앙 나무와 좌우 풀밭이 원작 구조다. W2 일반풀의 꼬렛30%(15·16), 이브이5%(18), 에나비15%(15·16), 콩둘기15%(15·16), 치릴리35%(15·16·17)를 `U-CASTELIA-PARK-W2`로 작성했다. B2 이어롤/소미안과 섞지 않는다. 종별 `levelChoices` 소비.

이브이·에나비 데이터와 기존 pinned sprite exporter 자산 생성까지 반영(58종·51풀·54기술), 원본 URL·해시는 pokemon-runtime-sources.json. 두 종 BW2 습득표를 사용하되 지원 기술 필터·진화 제한은 유지한다. 원작 진한풀 더블배틀·흔들리는 풀·선물 이브이·진화가 구현된 것은 아니다. MapId 바인딩은 지역 코드 준비 후 적용. QA미실행.


## 2026-09-15 구름 동료 성장: 콩둘기→유토브
확인일 2026-09-15, BW2 대조: https://bulbapedia.bulbagarden.net/wiki/Pidove_(Pok%C3%A9mon) — 원작 콩둘기는 Lv.21 유토브, Lv.32 켄호로우로 진화한다. 이번 적용은 기존 Lv.25 상한 안의 첫 진화만 활성화한다. exporter의 기존 설계 진화 EV-0519-0520을 선택하고 520 종 데이터·BW2 기술표·앞뒤 자산을 같은 고정 출처로 생성했다. 실제 소비는 data/runtime→growth.gainExperience→기존 battle 성장 프레임, save의 OWNABLE_SPECIES다. 새 야생 유토브 조우는 추가하지 않는다. 기존 Lv.21 이상 콩둘기는 다음 레벨 상승 때 적용되며 이미 Lv.25인 개체의 소급 진화는 이번 범위에 없다. 생성 결과 소유59종/51풀/54기술. 데이터 생성은 QA가 아니며 전투·진화·저장·시각 QA 모두 미실행.


## 2026-09-15 숲 동료의 최종 진화
단데기→버터플, 딱충이→독침붕 Lv.10을 기존 설계 진화 원본에서 exporter 허용 목록에 추가했다. 확인 출처: https://bulbapedia.bulbagarden.net/wiki/Butterfree 및 https://bulbapedia.bulbagarden.net/wiki/Cocoon (2026-09-15). 종12/15의 능력치·Pt 기술표·앞뒤 스프라이트를 기존 고정 PokeAPI 출처로 생성했다. 기본 지리 대조 HGSS와 별개로 공통 기술 획득표는 기존 Pt 정책을 유지하며 상태이상 등 미지원 기술은 활성화하지 않았다. pokemon.levelMoves는 이전 진화 단계를 재귀적으로 읽어 기존 애벌레 기술을 저장·편성 검사에서 유지한다. 반복 진화 데이터는 방문 집합으로 종료한다. growth/battle/save는 기존 공통 소비. 61소유종/8진화/54지원기술이며 생성은 QA가 아니다. 기존 상한25 개체 소급진화·실제 전투/저장/시각 확인은 미완료.

## 2026-09-15 하나 4번도로·뇌문 현장 대조

- BW2 지리·버전 차이: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_4 — 구름시티↔뇌문시티·조인애버뉴, 리조트데저트 분기와 깊은 모래를 확인했다. B2는 도로변 정착지 완공, W2는 고대 유적 발견 뒤 공사 중단으로 서로 다르다. 프로젝트는 통행 가능한 남북 노반과 남겨 둔 사암 흔적을 함께 둔 재구성이며 어느 버전의 정확한 타일 복제도 아니다. 배지·암팰리스·아크로마 잠금은 적용하지 않는다.
- BW2 장소/조우 교차 확인: https://www.serebii.net/pokearth/unova/route4.shtml — 4번도로 개별 페이지를 확인했다. 이번 회차는 기존 MapId 동선과 조사물을 사건에 연결하며 새 조우 풀·아이템·트레이너는 추가하지 않았다.
- BW2 도시 생활: https://bulbapedia.bulbagarden.net/wiki/Nimbasa_City 및 https://www.serebii.net/pokearth/unova/nimbasacity.shtml — 뇌문의 놀이공원·관람차·경기장·뮤지컬 도시 성격을 대조했다. 프로젝트의 길찾기 조명/낮춘 포켓몬 휴식등 증언은 넥서스 각색이다.
- 적용: `tour_unova_route_04`의 `tourRouteFourWorkSample` → `tour_nimbasa`의 `tourResident0`/`tourResident4` → `tour_nimbasa_hall`의 `tourExhibit0`. 점검원에게서 큰길 방향등 유지/휴식등 낮추기를 직접 선택해야 저장되며 `paintNimbasaNexusLights`가 낮춘 세 등과 밝은 귀환 방향등을 구분한다. 구현은 `src/nimbasa-nexus.ts`, 실제 호출은 `journey-services.ts`·`city-activities.ts`, 이어가기 안내는 `adventure-guide.ts`; 중앙 `renderer.ts`가 월드 배경 다음·actor 이전에 저장 상태 painter를 소비한다. 확인일 2026-09-15. QA 중단으로 이동·대사·플래그·저장·화면·음향은 미검증이다.

### 구름 공원 동료·전투 참여 정합성

`castelia-sewer-journey.ts`는 포획 장소가 구름하수도/구름시티 공원인 실제 파티 개체의 슬롯을 저장한다. `field-partner-party.ts`가 선두 편성·PC 교체·전투 성장과 진화 뒤 같은 객체의 슬롯/종을 갱신한다. `battle.ts`는 각 상대에게 참여한 실제 개체 참조를 누적하고 `engine.ts` 승리 시 지역 기록 함수가 선택 동료 포함 여부를 판정한다. 옛 전역 승리만으로 참여를 주장하지 않으며, `road-trainers.ts`는 필요한 경우 상금0 재확인전을 제공한다. 포켓몬 개체 ID를 새로 만들거나 다른 동종을 대체 지정하지 않았다. QA 중단으로 진화·교대·승리·패배·PC 이동·귀환 저장은 미검증이다.

## 2026-09-15 신오 봉신 센터의 동료별 산길 재출발

- 참고 URL·버전: https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_211, https://www.serebii.net/pokearth/sinnoh/4th/route211.shtml, https://archives.bulbagarden.net/wiki/Category%3ADiamond%2C_Pearl%2C_and_Platinum_maps, https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Platinum/Part_11. 확인일 2026-09-15, 기본 대조 Pokémon Platinum.
- 원작 사실: 211번도로는 영원시티와 봉신마을 사이를 잇지만 중앙의 천관산으로 동·서 구간이 나뉜다. 양쪽에 산기슭 길과 풀밭이 있고, Pt 동부 조우표에는 요가랑·데구리·근육몬·랑딸랑·동미러가 기록되어 있다.
- 프로젝트 변경: 원작의 정해진 사건 순서나 이동 기술 잠금을 복제하지 않는다. 봉신 센터에서 기술을 준비한 동료의 `met`과 기존 선택전 승리 상태를 읽어 210 북부, 211 서부, 천관산 통과층, 211 동부 중 관련 미완료 도전 또는 다음 연결 구간을 안내한다. 선택전은 여행 잠금이 아니다.
- 적용 코드·MapId·이벤트: `src/sinnoh-celestic-life.ts`의 `preparedDeparture`와 `tourCelesticCenterGuide`; `tour_celestic_center`, `tour_sinnoh_route_210_north`, `tour_sinnoh_route_210_south`, `tour_sinnoh_route_211_west`, `tour_coronet_211_pass`, `tour_sinnoh_route_211_east`; `route210NorthTrainer`, `route210SouthSign`, `route211WestTrainer`, `route211WestSign`, `coronet211Guide`, `route211EastTrainer`, `route211EastSign`.
- 구현/검증 상태: 동료별 재출발 분기를 코드에 연결했다. 전역 QA 중단에 따라 타입 검사·빌드·브라우저 플레이·저장·시각·음향 검증은 실행하지 않았으며 도시 완료 근거가 아니다.
- 선택전 결과 적용: 같은 Pt 자료의 영원시티↔211 서부↔천관산↔211 동부↔봉신 연결을 `src/road-trainers.ts`의 `sinnohCelesticWinRoutes`에 소비했다. 211 서부 승리 후 천관산 통과층, 211 동부·210 북부 승리 후 봉신센터를 안내하며, 파티와 PC의 네 현지 `met` 및 부상·기절 상태를 재대화에 표시한다. 원작의 개별 트레이너·상금·사건을 그대로 복제한 것이 아니라 기존 넥서스 선택전 결과와 귀환을 잇는 재구성이다. 코드 반영 상태이며 모든 실행 검증은 QA 중단으로 미실행이다.
- 개별 지도 확인: https://archives.bulbagarden.net/wiki/File%3ACelestic_Town_Pt.png (512×468)와 https://archives.bulbagarden.net/wiki/File%3ACelestic_Ruins_Pt.png (281×282), 확인일 2026-09-15, Pokémon Platinum. 외부 마을과 유적 실내가 별도 장소로 제시되는 점을 현재 `tour_celestic`↔`tour_celestic_ruins` 분리 및 남쪽 단일 귀환축과 대조했다. 이미지는 구조 참고만 했으며 자산·타일을 재사용하지 않았다.
- 모사 결과 소비: `src/sinnoh-celestic-trace.ts`가 공개하는 `CELESTIC_TRACE_DONE`을 `src/sinnoh-celestic-life.ts`의 `tourCelesticRuinsMural`·`tourCelesticRuinsRecord`가 읽는다. 완료한 동료와 서→동 지층 순서가 프레스코·기록에 남고 모사대 재관람 또는 전승가 휴식으로 이어진다. 코드 반영·QA 미실행이다.
- 현지 동료 실전 소비: 같은 2026-09-15 Pt 출처를 배경으로 `src/sinnoh-celestic-battle.ts`가 준비한 실제 파티 객체와 공통 `Battle.defeatedOpponentParticipants`·최종 승리를 결합한다. `engine.ts` 전투 종료 호출, `field-partner-party.ts` 파티 이동/진화 추적, `sinnoh-celestic-life.ts` 출발 준비, `road-trainers.ts`의 상금 없는 과거 승리 재확인전 및 결과·귀환 안내가 소비한다. 전투 규칙과 경험치 계산은 변경하지 않았다. 코드 반영, 모든 실행 검증 미실행이다.
- 211번도로 풀밭 확대: https://www.serebii.net/pokearth/sinnoh/4th/route211.shtml 의 동·서 구분, 산기슭 길·작은 풀밭 설명과 Pt 낮 조우표를 2026-09-15 다시 확인했다. `src/sinnoh-route211-trails.ts`에서 `tour_sinnoh_route_211_west`의 북쪽 산기슭/남쪽 암반 곁길, `tour_sinnoh_route_211_east`의 높은 산길/낮은 돌선반에 각각 선택 풀밭을 배치했다. 인접 한 줄은 마른 귀환 차선이고 중앙 5칸 본선·워프·NPC·표지는 건드리지 않는다. 기존 `runtime-encounters.ts`의 `S-R211-WEST/EAST`와 `runtime-local-pools.json`의 Pt 지원 종 부분집합을 소비하며 새 종·레벨·시간대 규칙은 추가하지 않았다. 코드 반영, 실제 조우·포획·충돌·화면·저장 검증은 QA 중단으로 미실행이다.


## 2026-09-15 구름하수도 연구원 보급

- 출처: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers — BW2, 2026-09-15 개별 페이지 In the games/Scientists 확인. 원작은 하수도 연구원이 약을 연구하고 매일 여러 약 중 하나를 지급한다.
- 프로젝트 차이: 기존 마른 곁방 (28,11)의 배수 연구원에게 상처약 하나를 한 번만 받을 수 있다. 계절·일일 초기화·무작위 약·새 연구실·스토리 잠금은 추가하지 않았다.
- 소비: castelia-sewer-park.ts NPC 등록 → castelia-gallery 기존 핸들러 → castelia-sewer-journey.ts 실제 inventory 증가와 일회 플래그. 소지 한도에서는 지급 기록 없이 재방문 가능. QA 중단으로 미검증.
## 관동 쌍둥이섬 B1F·B2F 보행 갈림길 — 2026-09-15

- 출처·버전: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B1F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (2026-09-15 확인, HGSS). 다층 얼음 동굴의 갈라진 통로·얼음 지형과 B1F/B2F 쥬쥬·주뱃 조우를 대조했다.
- 적용: 원작 평면·괴력/해류 퍼즐을 복제하지 않고 `tour_kanto_seafoam_b1f`의 안전 본선/북쪽 경유 `(18,11)`을 소비하는 조우 능선길과 `tour_kanto_seafoam_b2f`의 직행/서쪽 무보상 우회를 실제 출발·체크·합류 이벤트로 연결했다. 소비 위치는 `seafoam-ice-walk.ts`→`kanto-seafoam-islands.ts`/`seafoam-exploration.ts`/`kanto-south-art.ts`이며 기존 보관함·바위·계단·귀환은 보존했다. QA 중단으로 전 항목 미검증이다.
- 발견·귀환 소비: 같은 Bulbapedia HGSS 층별 아이템·조우표의 B1F 중앙 흰 구역 숨은 얼음상처약, B2F 북서 암벽을 포함한 숨은 진주, B1F·B2F 쥬쥬·주뱃 조우를 대조했다. 프로젝트는 아이템을 지급하지 않고 B1F 발자국·날개 흔적과 B2F 얼음 아래 광택의 비채취 기록으로 재구성하며, 발자국·날개 흔적은 원작 고정 오브젝트가 아닌 프로젝트 생태 표현이다. `seafoam-ice-walk.ts` 현장 플래그를 `cinnabar-research.ts`의 `tour_cinnabar_hall/tourExhibit2`가 비교하고 센터·20번수로 귀환을 안내한다. QA 미실행이다.
# 하나 5번도로·물풍경도개교·물풍경시 BW2 적용 — 2026-09-15

- **정확한 자료·버전:** [Bulbapedia · Unova Route 5](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_5), [Serebii Pokéarth · Unova Route 5](https://www.serebii.net/pokearth/unova/route5.shtml), [Bulbapedia · Driftveil Drawbridge](https://bulbapedia.bulbagarden.net/wiki/Driftveil_Drawbridge), [Bulbapedia · Driftveil City](https://bulbapedia.bulbagarden.net/wiki/Driftveil_City)를 2026-09-15에 확인했다. 기준 버전은 Black 2·White 2다.
- **원작 사실:** 5번도로는 동쪽 뇌문시티와 서쪽 물풍경도개교를 잇는 짧은 숲길이며 포장 본선, 트레일러·공연가, 북쪽 좁은 풀밭이 구분된다. BW2 일반 풀에는 치라미 Lv.21~24 등이 출현한다. 물풍경도개교는 선박 일정에 따라 오르내리며 비행 포켓몬의 그림자에서 꼬지보리 Lv.23~26 또는 날개 도구를 만난다. 물풍경시에는 서쪽 시장이 있고, BW2에서는 옛 냉동창고 대신 PWT와 광업 성장 흔적·대형 숙박 건물이 강조된다.
- **프로젝트 변경·미적용:** `tour_pass_nimbasa_driftveil`의 포장 본선 밖 북쪽 `(18,4) 10×3`에 치라미만 있는 지원 부분집합 풀을 적용했다. 쌔비냥·깨봉이·고디탱/유니란·흔들리는 풀·숨겨진동굴은 아직 없다. `tour_driftveil_drawbridge`의 `(58,13) 3×2`를 일반 풀밭이 아닌 그림자 조우 셀로 소비해 꼬지보리 Lv.23~25만 적용했다. Lv.26과 날개 도구, 실제 개폐 시간, 카밀레·찰스 선행 잠금은 적용하지 않았다. 물풍경은 시장 분류→작업 동료 휴식→2층 선적 장부의 프로젝트 선택 활동으로 재구성했으며 PWT·냉동창고 사건·체육관 잠금은 열지 않는다.
- **적용 코드·소비 위치:** `scripts/design/runtime-local-pools.json`의 `U-R05-BW2`·`U-DRIFTVEIL-DRAWBRIDGE-BW2`, `scripts/design/export-runtime-pokemon.py`, 생성 결과 `src/runtime-pokemon-data.json`·`public/assets/pokemon-runtime-sources.json`, 맵 연결 `src/runtime-encounters.ts`·`src/nimbasa-west-route.ts`, 선택전 `src/road-trainers.ts`, 그림자 필드/전투 표현 `src/drawbridge-shadow-art.ts`·`src/renderer.ts`, 여행·도시 사건 `src/driftveil-nexus.ts`, 작업 결과 표현 `src/driftveil-work-art.ts`, 정확한 동료 추적 `src/field-partner-party.ts`, 중앙 소비 `src/journey-services.ts`·`src/city-activities.ts`다. 물풍경 외부의 기존 `tourOutdoor7` 시장 배달 텃밭과 `tourOutdoor9` 교대 휴게원을 실제 행동 지점으로 사용한다.
- **구현·검증 상태:** 코드와 생성 데이터·스프라이트 출처는 반영했다. 사용자 QA 중단에 따라 풀밭 진입, 치라미/꼬지보리 조우·포획, 선택전·성장, 시장 선택, 센터/PC, 6번도로 진행·도개교 귀환, 저장·화면·음향은 모두 미검증이다.

# 하나 6번도로·전기돌동굴 BW2 생태 적용 — 2026-09-15

- **정확한 자료·버전:** [Bulbapedia · Unova Route 6](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_6), [Serebii Pokéarth · Route 6](https://www.serebii.net/pokearth/unova/route6.shtml), [Bulbapedia · Chargestone Cave](https://bulbapedia.bulbagarden.net/wiki/Chargestone_Cave), [Serebii Pokéarth · Chargestone Cave](https://www.serebii.net/pokearth/unova/chargestonecave.shtml)를 2026-09-15에 확인했다. 기본 지리는 Black 2·White 2이며 6번도로 일반 풀의 버전 차이는 Black 2를 선택했다.
- **원작 사실:** 6번도로는 물풍경시티와 전기돌동굴 사이에 강·목재 다리·계절 연구소가 있으며 B2 일반 풀의 딱정곤은 5%, 쪼마리는 25%, 원작 레벨은 23~26이다. 전기돌동굴 B2W2 1F 일반 동굴 조우는 코코파스 10%, 단굴 5%, 파쪼옥 39%, 철시드 20%, 기어르 24%, 저리어 2%이고 레벨은 25~28이다. B1F는 같은 종 구성에 원작 레벨 28~31이다.
- **프로젝트 변경·미적용:** 6번도로는 지원 종 두 마리의 비율을 17:83으로 정규화하고 Lv.26을 상한 25로 낮췄다. 중앙 길과 다리는 안전하며 `(8,13) 4×4`, `(28,39) 4×4` 곁풀만 조우한다. 전기돌동굴은 단굴·저리어를 제외한 지원 부분집합의 상대 비율을 유지하고 1F를 Lv.24~25, B1F를 Lv.25로 조정했다. 1F `(13,43) 3×3`, `(35,29) 3×3`, B1F `(10,30) 3×5`, `(31,25) 3×3` 결정장만 조우하며 계단과 본선 결정 통로는 안전하다. 진한풀·흔들리는풀·수상/낚시·먼지구름·메모리링크·B2F·원작 아이템과 사건 잠금은 적용하지 않았다.
- **적용 코드·MapId/이벤트:** 지역 풀은 `scripts/design/runtime-local-pools.json`의 `U-R06-B2`, `U-CHARGESTONE-1F-BW2`, `U-CHARGESTONE-B1F-BW2`이며 `src/runtime-pokemon-data.json`으로 생성된다. MapId 바인딩은 `src/runtime-encounters.ts`, 지형·충돌·워프·NPC는 `src/unova-route-six.ts`, 6번도로 선택전 `tourRouteSixTrainer`는 `src/road-trainers.ts`, 연구원·결정 사건은 `src/journey-services.ts`, 물풍경 장부 이후 연구소→선택전/통과→1F 학습 결정→B1F 본선 결정→궐수 도착은 `src/adventure-guide.ts`가 소비한다. 새 종 595·597·599의 BW2 기술표와 앞뒤 자산 출처는 `scripts/design/export-runtime-pokemon.py`와 `public/assets/pokemon-runtime-sources.json`에 고정된다.
- **구현·검증 상태:** 코드·생성 데이터·자산을 반영했다. QA 중단에 따라 이동, 풀/동굴 조우, 포획, 선택전, 경험치·성장, 결정 퍼즐과 귀환, 저장, 화면·음향은 모두 미검증이다.

# 하나 궐수시티 화물 서비스 적용 — 2026-09-15

- **정확한 자료·버전:** [Bulbapedia · Mistralton City](https://bulbapedia.bulbagarden.net/wiki/Mistralton_City), [Serebii Pokéarth · Mistralton City](https://www.serebii.net/pokearth/unova/mistraltoncity.shtml), [Bulbapedia B2W2 Walkthrough Part 10](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2/Part_10)을 2026-09-15에 확인했다. 기준 버전은 Black 2·White 2다.
- **원작 사실:** 궐수시티 면적의 큰 부분을 활주로가 차지하고 화물 서비스가 도시 생활의 중심이다. 활주로 가장자리에서 채소를 재배해 화물기로 운송한다. B2W2 화물 서비스의 작업원은 파티에 비행 또는 에스퍼타입 포켓몬이 있으면 네트볼 5개를 준다. 6개 배지와 궐수의탑 사건 뒤 풍란과 산로마을로 비행하는 원작 순서가 있다.
- **프로젝트 변경:** 현재 넥서스는 미확정 배지·궐수의탑 사건으로 화물 활동이나 귀환을 잠그지 않는다. 터미널 2층 `tourMistraltonCargoLog`에서 건강한 비행/에스퍼 동료의 실제 파티 슬롯을 선택하고, 외부 `tourOutdoor3`에서 광물 표본/농산물 적재 순서를 정한 다음 `tourOutdoor4`에서 같은 동료의 날개·발·호흡과 물그릇을 확인해 적재표로 돌아온다. 파티에서 빠진 동종은 대신 인정하지 않는다. 현재 아이템 카탈로그에 네트볼이 없어 완료 보급은 일반 몬스터볼 최대 3개로 축소하고 소지 상한 999를 넘기지 않는다. 활동은 산로행·전기돌동굴 귀환·체육관·도감의 조건이 아니다.
- **적용 코드·상태 표현:** `src/mistralton-nexus.ts`가 선택→적재→휴식→기록과 일회 보급을 처리하고, `src/field-partner-party.ts`가 같은 파티 객체의 재배치·진화를 추적한다. `src/city-activities.ts`가 이벤트를 우선 소비하며 `src/mistralton-work-art.ts`와 `src/renderer.ts`가 선택한 상자 순서와 물그릇을 기존 막힌 현장 셀에 표시한다. `src/adventure-guide.ts`는 도착 뒤 이 순서와 1층 산로행 조종사를 안내한다. `src/mistralton-interiors.ts`·`src/journey-services.ts`의 운항 안내는 실제 산로 왕복편과 일치하도록 교정했다.
- **구현·검증 상태:** 코드와 문서를 반영했다. QA 중단에 따라 동료 타입/슬롯 선택, PC 이동·진화·기절, 적재 선택·취소·재선택, 보급 상한, 산로 왕복, 저장, 현장 그림과 화면·음향은 모두 미검증이다.

### 2026-09-15 하나 산로마을·리버스마운틴 생태 적용

- **정확한 자료·버전:** [Bulbapedia · Lentimas Town](https://bulbapedia.bulbagarden.net/wiki/Lentimas_Town), [Bulbapedia · Reversal Mountain](https://bulbapedia.bulbagarden.net/wiki/Reversal_Mountain), [Serebii Pokéarth · Reversal Mountain](https://www.serebii.net/pokearth/unova/reversalmountain.shtml)을 2026-09-15에 확인했다. 기준은 Black 2다.
- **원작 사실:** 산로마을은 궐수의 항공편으로 도착하며 동쪽 리버스마운틴으로 이어진다. 산의 서쪽은 산로, 동쪽은 물결마을이며 외부는 건조 지형이다. Black 2 외부 일반 풀에는 스콜피 30%, 톱치 15% 등이 Lv31~34로, 내부 입구에는 피그점프 20%·스콜피 15%·단굴 25%·또르박쥐 35% 등이 Lv31~35로 등장한다. 본 동굴은 피그점프 비율이 5%로 줄며 비앙카가 첫 통과에 동행해 야생전을 더블배틀로 만든다.
- **프로젝트 변경:** `tour_reversal_mountain_exterior`는 스콜피·톱치만 67:33으로, `tour_reversal_mountain_a`와 `tour_reversal_mountain_b`는 피그점프·스콜피·단굴·또르박쥐의 원작 상대 비중을 보존한 부분집합으로 구성했다. Lv31~35는 성장 상한에 맞춰 Lv24~25로 조정했다. 조우 지형은 곁풀·곁 선반에만 두어 산로↔물결 가운데 길과 귀환을 막지 않는다. 비앙카 더블배틀·전투 후 회복, 히드런과 마그마스톤, 먼지구름, 버전 전용 둔타·폭타, 원작 아이템은 지원 계약이 없어 적용하지 않았다.
- **적용 코드·상태 표현:** `src/unova-reversal-mountain.ts`의 실제 terrain/NPC/흔적 안내, `scripts/design/runtime-local-pools.json`의 `U-REVERSAL-EXTERIOR-B2`·`U-REVERSAL-ENTRANCE-B2`·`U-REVERSAL-MAIN-B2`, `src/runtime-encounters.ts`의 세 MapId 결합, `src/road-trainers.ts`의 외부 선택전, `src/adventure-guide.ts`의 산로 준비→외부 생태→A→B→물결 기록 순서에 적용했다. `export-runtime-pokemon.py`가 다섯 종을 BW2 기술 습득 기준으로 생성한다.
- **구현·검증 상태:** 코드·런타임 데이터·출처 기록을 반영했다. QA 중단에 따라 보행, 조우, 포획, 선택전, 가이드 순서, 양방향 워프, 저장, 화면·음향은 미검증이며 산로/물결 도시 완료로 판정하지 않는다.

### 2026-09-15 하나 물결마을·13번도로 포획과 귀환 적용

- **정확한 자료·버전:** [Bulbapedia · Undella Town](https://bulbapedia.bulbagarden.net/wiki/Undella_Town), [Bulbapedia · Unova Route 13](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_13), [Serebii Pokéarth · Route 13](https://www.serebii.net/pokearth/unova/route13.shtml)을 2026-09-15에 확인했다. 기준은 Black 2·White 2다.
- **원작 사실:** 물결마을은 서쪽 리버스마운틴, 북쪽 13번도로, 동쪽 물결만·마린튜브와 연결된 해변 휴양지다. 13번도로는 물결과 보배마을을 잇는 하나의 가장 긴 해안도로로 모래톱·해변·풀 덮인 절벽·숨은동굴이 있으며, B2W2 일반 풀에는 덩쿠리25%와 패리퍼25%가 Lv34·36·37로 등장한다. 북부에는 자이언트홀 분기와 코바르온 특별 조우가 있다.
- **프로젝트 변경:** `tour_unova_route_13`은 물결 동쪽에서 보배 남문으로 오르는 36×96 축약 지형이다. 네 곁풀에 덩쿠리·패리퍼만 50:50, Lv24~25로 적용하고 가운데 길은 조우 없이 둔다. 선택 트레이너는 두 현지 종으로 포획·성장을 연습하게 하는 프로젝트 인물이며 원작 특정 트레이너 복제가 아니다. 승리와 13번도로 출신 보유 동료가 함께 있을 때 물결 길 안내원이 수·종·최고 레벨을 읽고 센터와 양쪽 귀환을 안내한다. 숨은동굴·재생 도구·파도타기/낚시·코바르온·자이언트홀 분기·계절 휴양객 사건은 적용하지 않았다.
- **적용 코드·상태 표현:** `src/unova-route-thirteen.ts`의 실제 terrain과 트레이너 NPC, `scripts/design/runtime-local-pools.json`의 `U-R13-BW2`, `src/runtime-encounters.ts`, `src/road-trainers.ts`, `src/adventure-guide.ts`, `src/journey-services.ts`에 적용했다. `export-runtime-pokemon.py`는 덩쿠리·패리퍼에 BW2 습득 기술을 사용하며 생성 런타임과 앞/뒤 스프라이트 출처 manifest를 갱신한다.
- **구현·검증 상태:** 코드·데이터·문서를 반영했다. QA 중단에 따라 풀밭 표시·보행·조우·포획·전투·경험치·귀환 반응·저장·화면·음향은 미검증이며 물결마을 완료로 판정하지 않는다.
# 2026-09-15 신오 시작권역 Pt 적용 — 201번도로·잔모래마을·202번도로

- 확인 자료: [Bulbapedia 201번도로](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_201), [Serebii Pokéarth 201번도로](https://www.serebii.net/pokearth/sinnoh/4th/route201.shtml), [Bulbagarden Pt 201 지도](https://archives.bulbagarden.net/wiki/File%3ASinnoh_Route_201_Pt.png), [Bulbapedia 잔모래마을](https://bulbapedia.bulbagarden.net/wiki/Sandgem_Town), [Bulbagarden Pt 잔모래 지도](https://archives.bulbagarden.net/wiki/File%3ASandgem_Town_Pt.png), [Bulbapedia 202번도로](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_202), [Serebii Pokéarth 202번도로](https://www.serebii.net/pokearth/sinnoh/4th/route202.shtml), [Bulbagarden Pt 202 지도](https://archives.bulbagarden.net/wiki/File%3ASinnoh_Route_202_Pt.png). 2026-09-15 확인, Pokémon Platinum 낮 기준.
- 원작 사실: 201은 떡잎·잔모래·진실호수 근처를 잇는 첫 숲길이며 일반 트레이너가 없고 Pt 낮 풀밭은 찌르꼬40%·비버니60%, Lv2~3이다. 잔모래는 바닷가 모래 마을이자 마박사 연구소 소재지다. 202는 잔모래–축복의 굴곡진 풀길이며 첫 NPC 트레이너 3명(찌르꼬·비버니·도롱충이 각 Lv5)과 Pt 낮 비버니50%·찌르꼬30%·꼬링크20% 조우가 있다.
- 프로젝트 적용: `tour_sinnoh_route_201`의 마른 본선 옆 선택 풀밭 두 곳을 `S-R201-DAY`에, `tour_sinnoh_route_202`의 선택 풀밭 세 곳을 `S-R202-DAY`에 연결했다. 202 세 NPC는 공통 선택 트레이너 시스템을 소비하고 승리 여부와 관계없이 잔모래↔축복 통행을 유지한다. 적용 위치는 `src/sinnoh-opening-route.ts`, `src/runtime-encounters.ts`, `src/road-trainers.ts`, `scripts/design/runtime-local-pools.json`, 생성 결과 `src/runtime-pokemon-data.json`·`public/assets/pokemon-runtime-sources.json`이다.
- 원작과의 차이: 시작 파트너는 기존 새잎마을 은솔박사 계약을 보존하므로 Pt 201 박사 수령·라이벌전을 중복하지 않는다. 202 포획 시범과 몬스터볼 5개 보상도 새 필수 사건으로 넣지 않았다. 시간대 엔진이 낮 고정이라 귀뚤뚜기·대량발생·포켓트레·더블슬롯 조우는 제외했다. 지도 이미지는 방향·굴곡·풀밭 분산·해안 분위기 대조에만 사용하고 자산을 복제하지 않았다.
- 구현/검증 상태: 코드와 생성 데이터 반영. QA 중단으로 테스트·빌드·브라우저 보행·조우·전투·포획·저장·시각·음향은 미실행이며 잔모래 또는 축복 도시 완료 근거가 아니다.

## 잔모래 도시 시설 적용 추가 기록

- 개별 근거: 위 [Bulbapedia 잔모래마을](https://bulbapedia.bulbagarden.net/wiki/Sandgem_Town)은 Pt 잔모래가 201 서쪽·202 북쪽·219 남쪽에 접하고, 남쪽 모래 해안·마박사 연구소·포켓몬센터가 있는 바닷바람 마을임을 명시한다. [Pt 잔모래 지도](https://archives.bulbagarden.net/wiki/File%3ASandgem_Town_Pt.png)는 496×402의 Pokémon Platinum 장소 이미지로 2026-09-15 직접 대조했다. [Platinum 공략 Part 1](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Platinum/Part_1)은 원작에서 201 라이벌전 뒤 집으로 귀환하고 잔모래의 마박사에게 감사하러 가는 순서를 설명한다.
- 프로젝트 적용: `tour_sandgem`의 서쪽 센터와 동쪽 연구소에 충돌 footprint·문·양방향 워프를 만들었다. `tour_sandgem_center` 20×16은 공통 간호사 회복·PC와 201/202 사이 귀환 거점, `tour_sandgem_lab` 24×18은 Pt 낮 생태표와 실제 파티/박스의 `met`을 읽는 연구 시설이다. 이벤트는 `sandgemCenterSign`, `sandgemLabResearcher`, `sandgemRoute201Record`, `sandgemRoute202Record`, `sandgemHabitatConsole`; 적용 코드는 `src/sinnoh-opening-route.ts`, `src/explore-world.ts`, `src/sinnoh-story.ts`다.
- 차이/상태: 남쪽 219번도로는 현재 해안 경관만 있으며 별도 출구·수로가 아니다. 연구소는 기존 새잎 은솔박사 파트너 수령을 옮기거나 반복하지 않고 201/202 생태 기록만 담당한다. 대량발생·상점 구매·새 보상·길막은 추가하지 않았다. 코드·문서 반영, 모든 QA 미실행이며 잔모래 도시 완료가 아니다.

## 축복시티 남문 도착과 사방 연결 보수

- 확인 자료: [Bulbapedia 축복시티](https://bulbapedia.bulbagarden.net/wiki/Jubilife_City), [Serebii Pokéarth 축복시티](https://www.serebii.net/pokearth/sinnoh/4th/jubilifecity.shtml), [Bulbagarden Pt 축복 지도](https://archives.bulbagarden.net/wiki/File%3AJubilife_City_Pt.png), [Platinum 공략 Part 2](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Platinum/Part_2). 2026-09-15 확인, Pokémon Platinum 기준.
- 원작 사실: 축복은 신오의 큰 현대 도시로 방송국·포켓치 회사·트레이너스쿨·글로벌터미널이 있으며 북쪽 204번도로, 동쪽 203번도로, 남쪽 202번도로, 서쪽 218번도로에 접한다. Pt 공략은 202의 세 트레이너 뒤 북쪽으로 축복에 들어오고, 도착 시 Looker/VS레코더와 학교 소포·포켓치 캠페인이 이어지는 순서를 기록한다.
- 프로젝트 변경: 기존 런타임의 202 동문/203 남문 연결을 원작 방향대로 교환했다. `tour_sinnoh_route_202` 북쪽→`tour_jubilife` 남문 `(14,34)/(14,33)`, 축복 동문 `(38,24)`→`tour_sinnoh_route_203` `(3,14)`, 203 귀환→축복 `(37,24)`이다. 남문 `jubilifeSouthGreeter`가 202 출신 보유 동료, 세 선택전 승리 수, 파티 부상·기절을 읽고 센터·광장·방송국·203 출발을 안내하며 `jubilifeArrivedVia202`를 저장한다. 적용 코드는 `src/unified-world.ts`, `src/sinnoh-story.ts`다.
- 차이/상태: Looker·VS레코더·소포·포켓치 쿠폰·갤럭시단 사건은 현재 채택 서사와 기능 계약이 없어 추가하지 않았다. 기존 방송국 전시·센터·두 종 소개 활동·연구 자료 전달을 보존한다. 지도 이미지는 방향과 도시 규모 대조에만 사용하고 자산을 복제하지 않았다. 코드·문서 반영, QA 중단으로 출입구 왕복·도착 위치·NPC 접근·저장·화면·음향은 미검증이며 축복 완료가 아니다.

## 축복시티 트레이너스쿨 적용

- 확인 자료: [Bulbapedia 신오 트레이너스쿨](https://bulbapedia.bulbagarden.net/wiki/Trainers%27_School_%28Sinnoh%29), [Serebii Pokéarth 축복시티 Trainer School](https://www.serebii.net/pokearth/sinnoh/4th/jubilifecity.shtml), [Bulbapedia Platinum 공략 Part 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2), [Bulbagarden Pt 축복 지도](https://archives.bulbagarden.net/wiki/File%3AJubilife_City_Pt.png). 2026-09-15 확인, Pokémon Platinum 기준.
- 원작 사실: 학교는 축복시티의 글로벌터미널 동쪽·포켓몬센터 서쪽에 있고, 기초 수업·트레이너 노트·상태이상 칠판과 두 학생의 실전 공간이 있다. Pt 학생은 DP의 캐이시 둘이 아니라 찌르꼬♂ Lv.6과 비버니♀ Lv.6이며 각각 120원을 지급한다. 공략 순서에는 라이벌 소포 전달·타운맵, 교실 X어택·두 학생 뒤 상처약, 이후 포켓치 캠페인이 포함된다.
- 프로젝트 변경: 압축된 `tour_jubilife` 서쪽 생활 건물 하나를 `tour_jubilife_school` 문으로 연결하고 24×18 교실에 상태이상 칠판·파티 노트·202→축복→203 여행 칠판·두 선택 학생전을 배치했다. 선생님은 실제 파티/박스의 `신오 202번도로` 출신 수, 202 세 실전과 학교 두 실전 승리, 현재 부상·기절을 읽고 센터 또는 203번도로를 안내한다. 적용 코드는 `src/explore-jubilife.ts`, `src/jubilife-trainer-school.ts`, `src/explore-world.ts`, `src/sinnoh-story.ts`, `src/road-trainers.ts`; 이벤트는 `jubilifeSchoolTeacher`, `jubilifeSchoolBoard`, `jubilifeSchoolNotebook`, `jubilifeSchoolRouteBoard`, `jubilifeSchoolStarly`, `jubilifeSchoolBidoof`다.
- 차이/상태: 기존 창작 프롤로그에 원작 라이벌 소포가 없으므로 타운맵 전달·X어택·상처약·포켓치 캠페인을 새 보상이나 잠금으로 복제하지 않았다. 학생전은 선택이며 첫 승리 상금만 공통 전투 시스템으로 지급하고 학교·203 통행과 무관하다. 외부 원본 이미지는 배치 대조에만 사용했다. 코드·문서 반영, QA 중단으로 건물 충돌·문/왕복 워프·NPC/소품 접근·전투·상금·재대화·저장·화면·음향은 미검증이며 축복 완료가 아니다.
- 도시 생활 연결: 같은 Pt 축복 자료의 현대 교류 도시·방송국·학교·사방 도로 관계를 바탕으로, 학교에서 실제 `신오 202번도로` 출신 건강한 파티 객체를 고르고 외부 `jubilifePlazaLearning` 분수와 방송국 1층 `tourExhibit0`을 직접 방문한 뒤 학교로 돌아오는 무보상 현장학습을 추가했다. `jubilifeCityLearningPartner/Slot`은 편성 변경 시 같은 객체를 추적하고 PC 이동 시 동종 대체를 인정하지 않는다. `jubilifeCityLearningPlaza`, `jubilifeCityLearningBroadcast`, `jubilifeCityLearningCompleted`는 방문 결과만 저장하며 길·전투·보상을 잠그지 않는다. 적용 코드는 `src/jubilife-city-learning.ts`, `src/city-activities.ts`, `src/explore-world.ts`, `src/field-partner-party.ts`, `src/sinnoh-story.ts`다. QA 중단으로 선두 전환·객체 추적·분수/방송국 상호작용·귀환 완료 기록은 미검증이다.

## 축복시티 포켓치주식회사 3층 적용

- 확인 자료: [Bulbapedia 포켓치주식회사](https://bulbapedia.bulbagarden.net/wiki/Poketch_Company), [Bulbapedia 축복시티](https://bulbapedia.bulbagarden.net/wiki/Jubilife_City), [Serebii Pokéarth 축복시티](https://www.serebii.net/pokearth/sinnoh/4th/jubilifecity.shtml), [Bulbapedia Platinum 공략 Part 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2). 2026-09-15 확인, Pokémon Platinum 기준.
- 원작 사실: 포켓치주식회사는 축복 북서쪽의 가족 소유 소규모 회사로, 사장이 취미로 좋아하는 장치를 만들던 일이 사업으로 성장했다. 본사는 가족 거주 공간을 포함한 3층이며 포켓치를 개발·제조한다. 첫 방문의 사장은 도시 세 광대 퀴즈와 쿠폰 뒤 포켓치를 지급하고 이후 배지 수에 따라 앱을 제공한다. 축복은 북204·동203·남202·서218 네 방향 이동의 중심지다.
- 프로젝트 변경: 북쪽 기존 주거 건물을 `tour_jubilife_poketch_1f` 문으로 교체하고 24×20의 안내층·개발실·가족 생활층을 계단으로 연결했다. 1층 `jubilifePoketchTravelConsole`은 실제 `steps`와 `tourVisited`에서 202·203·204남부·218 방문을 읽고 `jubilifePoketchRouteChart`가 정확한 사방 연결과 203→무쇠게이트를 안내한다. 2층은 실제 걸음·파티 부상/기절을 읽는 시제품, 3층은 가족 기업의 개발 수첩·거실·북서쪽 창가 생활을 배치했다. 적용 코드는 `src/jubilife-poketch-company.ts`, `src/explore-jubilife.ts`, `src/explore-world.ts`, `src/city-activities.ts`이며 MapId는 `tour_jubilife_poketch_1f`~`3f`다.
- 차이/상태: 현재 공통 UI·아이템 계약에 포켓치가 없으므로 광대 쿠폰·포켓치 기기·배지별 앱을 지급하지 않고 여행 기록을 읽는 견학용 시제품으로 한정했다. 원작 가족 기업 성격과 3층 생활 구조는 유지하며 모든 층과 도시 귀환은 조건 없이 개방한다. 코드·문서 반영, QA 중단으로 외부 건물 충돌·문·층간/도시 왕복 워프·NPC/소품 접근·걸음/방문/파티 표시·저장·화면·음향은 미검증이며 축복 완료가 아니다.

## 축복시티 프렌들리숍·공동주택 생활 적용

- 확인 자료: [Bulbapedia 축복시티](https://bulbapedia.bulbagarden.net/wiki/Jubilife_City), [Serebii Pokéarth 축복시티](https://www.serebii.net/pokearth/sinnoh/4th/jubilifecity.shtml), [Bulbapedia Platinum 공략 Part 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2), [Bulbagarden Pt 축복 지도](https://archives.bulbagarden.net/wiki/File%3AJubilife_City_Pt.png). 2026-09-15 확인, Pokémon Platinum 기준.
- 원작 사실: Pt 축복 프렌들리숍은 일반 도구 판매대 외에 에어메일 50원·힐볼 300원 판매대를 둔다. 북동쪽 축복 콘도 1층 소녀는 선공에 영향을 주는 선제공격손톱을 주며, 주민들은 포켓치·기술·힐볼을 이야기한다. 공략은 도시 탐방 뒤 동쪽 203번도로 라이벌전을 대비해 센터에서 회복하고 훈련하도록 안내한다.
- 프로젝트 변경: `tour_jubilife_mart`를 24×20으로 확대해 공통 `martClerk`의 몬스터볼·상처약 판매, 두 실제 진열대, 에어메일/힐볼 견본, 북204·동203·남202·서218 보급표를 분리했다. `tour_jubilife_home1`~`3f`를 각 24×18로 확대해 현관 방석·외출 준비, 가족 식탁·기술 책장, 공동 화분·도시 전망·동료 물그릇을 층간 계단과 같은 외부 문으로 연결했다. 원작 북동 콘도 위치를 그대로 복제하지 않고 압축된 현재 지도의 남동 생활 구역 외부 문 `(26,28)`에 모았으며, 주민은 현재 파티 부상/기절과 학교·포켓치사·상점 관계에 반응한다. 적용 코드는 `src/jubilife-daily-interiors.ts`, `src/explore-world.ts`, `src/city-activities.ts`다.
- 차이/상태: 공통 상점이 지원하는 일반 몬스터볼·상처약만 구매 가능하며 에어메일·힐볼은 원작 상품을 설명하는 비판매 견본이다. 선제공격손톱 아이템 계약이 없어 원작 소녀의 지급을 복제하지 않는다. 생활 소품은 회복·아이템·통행 보상이 아니고 모든 층은 자유 왕복이다. 코드·문서 반영, QA 중단으로 계산대 구매·문/계단/귀환·NPC/소품 접근·동적 파티 상태·저장·화면·음향은 미검증이며 축복 완료가 아니다.

## 축복시티 사방 출구·시설 길찾기 적용

- 확인 자료: [Bulbapedia 축복시티](https://bulbapedia.bulbagarden.net/wiki/Jubilife_City), [Serebii Pokéarth 축복시티](https://www.serebii.net/pokearth/sinnoh/4th/jubilifecity.shtml), [Bulbagarden Pt 축복 지도](https://archives.bulbagarden.net/wiki/File%3AJubilife_City_Pt.png), [Bulbapedia Platinum 공략 Part 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2). 2026-09-15 확인, Pokémon Platinum 기준.
- 원작 사실: 축복은 북쪽 204번도로, 동쪽 203번도로, 남쪽 202번도로, 서쪽 218번도로에 접한다. 지도와 공략에서 트레이너스쿨은 도시 서쪽, 포켓치주식회사는 북서쪽, 축복방송국은 동쪽의 주요 목적지이며 콘도는 북동쪽에 있다.
- 프로젝트 변경·실제 연결: `src/jubilife-wayfinding.ts`의 `installJubilifeWayfinding`이 `tour_jubilife`의 네 기존 표지 이벤트를 최종 방향의 MapId `tour_sinnoh_route_204_south`/`203`/`202`/`218`과 다음 경유 설명으로 교정한다. 중앙 보행로 `(23,14)`에는 충돌 셀과 `jubilifeCityDirectory` 조사 이벤트를 함께 두어 북서 회사·서쪽 센터/학교·동쪽 방송국·남쪽 상점/공동주택을 안내한다. `src/explore-world.ts`가 야외 데이터 생성 직후 이를 소비하므로 이후 `createUnifiedWorld`의 런타임 워프 교정과 안내 내용이 일치한다.
- 차이/상태: 원작 도시 배치를 타일 단위로 복제하지 않고 40×36 압축 지도와 기존 저장 경계를 유지한다. 204는 험한샛길·꽃향기·205 남부, 218은 수로 접근부 뒤 창작 도보 연구 연결길을 거치는 프로젝트 경로를 명시한다. 외부 코드·자산은 재사용하지 않았다. 코드·문서 반영, QA 중단으로 안내판 접근·표지 충돌·방향별 워프·귀환·화면·저장은 미검증이며 축복 완료가 아니다.
- BW·BW2풍 표시 적용: `src/explore-jubilife.ts`의 `paintJubilifeWayfindingGround`가 실제 네 출구 가까이에 204/203/202/218 번호와 방향을 그리며 중앙 조사 셀과 같은 `(23,14)`에 도시 안내판을 표시한다. `paintJubilifeBuilding`은 실제 건물 종류와 문 좌표를 소비해 학교·포켓치사·방송국 간판을 구분하고, `src/explore-art.ts`가 축복 배경과 건물 depth layer에서 두 painter를 호출한다. 원작 이미지·타일·간판 자산은 재사용하지 않은 프로젝트 Canvas 표현이며 화면 검증은 미실행이다.

## 축복시티 동문→203번도로 포획·성장·귀환 적용

- 자료·확인일·버전: [Bulbapedia 신오 203번도로](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_203), [Serebii Pokéarth 203번도로](https://www.serebii.net/pokearth/sinnoh/4th/route203.shtml), [Bulbapedia Platinum 공략 Part 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_2), 2026-09-15 확인, Pokémon Platinum.
- 원작 사실: 203번도로는 서쪽 축복시티와 동쪽 무쇠게이트를 잇고, 작은 연못·계단식 언덕·서쪽의 작은 풀밭과 동쪽 큰 풀밭을 지난다. Pt 낮 일반 풀숲은 찌르꼬35% Lv.4/6/7, 비버니25% Lv.4~7, 꼬링크25% Lv.4~5, 캐이시15% Lv.4~5다. Pt에서는 라이벌전과 여러 일반 트레이너 뒤 무쇠게이트로 진행한다.
- 전투 표현: `src/sinnoh-route203-battle-art.ts`를 `src/renderer.ts`의 `tour_sinnoh_route_203` 소비 분기에 연결했다. 서쪽 작은 연못, 동쪽 두 단 언덕과 돌계단, 풀숲 전투와 중앙 흙길 선택전을 구분해 표시한다. 원작 타일·라이벌 장면은 복제하지 않았으며 BW·BW2풍으로 재구성했다. QA 중단 상태라 실제 전환·스프라이트 겹침·화면 출력은 미검증이다.
- 필드 표현: `src/sinnoh-route203-field-art.ts`를 외부 필드 렌더 경로에 연결했다. 실제 `tour_sinnoh_route_203` 좌표의 서쪽 연못 둑에는 갈대·돌·수면 반사를, 가운데 오르막에는 세 구간 돌계단을, 동쪽 막힌 바위턱에는 두 단 암반면을 덧그린다. 기존 통행 셀·워프·조우 범위·이벤트는 바꾸지 않았으며 원작 이미지는 사용하지 않았다. QA 중단으로 카메라·가림·보행 중 화면은 미검증이다.
- 프로젝트 변경·실제 연결: `src/sinnoh-route-203-gate.ts`가 안전 본선과 분리된 세 `tallGrass`를, `scripts/design/runtime-local-pools.json`의 `S-R203-DAY`와 `src/runtime-encounters.ts`가 위 네 종의 낮 보행 조우를 연결한다. `export-runtime-pokemon.py`로 `src/runtime-pokemon-data.json`과 `public/assets/pokemon-runtime-sources.json`을 생성했다. 기존 `route203Walker`/`sinnoh-route-203-practice`는 `src/sinnoh-route203-journey.ts`, `src/road-trainers.ts`, `src/engine.ts`, `src/field-partner-party.ts`에서 실제 현지 개체의 시작 레벨·격파 참가·현재 객체를 추적한다. 축복 동문 `jubilifeEastGuide`와 `src/sinnoh-story.ts`, `src/adventure-guide.ts`가 포획→선택 실전→축복 귀환 또는 무쇠게이트 진행을 소비한다.
- 차이·상태: 원작 라이벌전·개별 일반 트레이너 전체·바닥 아이템·PP/진화 취소 팁은 이번 넥서스 사건에 채택하지 않았다. 시간 정책에 따라 아침 귀뚤뚜기, 밤 주뱃/귀뚤뚜기와 대량발생·포켓레이더·GBA 삽입·수상·낚시는 제외했다. 포획이나 승리는 통행 조건이 아니며 외부 코드·지도·자산을 재사용하지 않았다. 데이터/코드 반영, QA 중단으로 풀 접근·조우율·레벨·포획·실제 격파 참가·경험치 성장·PC/동종 교체·왕복·저장은 미검증이다.

### 2026-09-15 전기돌동굴 전투 공간 연결
- 출처: https://bulbapedia.bulbagarden.net/wiki/Chargestone_Cave (확인 2026-09-15, BW2 대조). 원작의 전기를 띤 부유 광석과 6번도로↔궐수시티 연결을 참고했다.
- 프로젝트 차이: 원작 배경 자산 복제가 아닌 청록 광석·암반의 Canvas 배경이다. `src/chargestone-battle-art.ts`를 `renderer.ts`의 `battleArena`에서 `tour_chargestone_1f`, `tour_chargestone_b1f`에 적용한다. 원작 전체 층·자기장 진화·스토리 잠금 구현을 의미하지 않는다.
- QA 중단: 코드 연결만 반영, 전투 화면·가림·저장·플레이 미검증. 지리 연결은 WORLD_ROUTES, 사건 범위는 MAP_STORY_DESIGN을 따른다.

### 2026-09-15 얼음샛길 전투 색상 연결
- https://bulbapedia.bulbagarden.net/wiki/Ice_Path 확인(2026-09-15), HGSS 대조. 44번도로와 검은먹을 잇는 4층 얼음 동굴이라는 장소 성격을 참고했다.
- 프로젝트 표현: 원작 자산 복제 없이 공통 전투 지형의 암반·바닥·발판을 청회색 얼음 색상으로 구분한다. `oreburgh-cave-art.ts/paintCaveBattleArena`의 icy 옵션을 `renderer.ts`에서 얼음샛길 4 MapId에 적용. 전투 규칙·지리·퍼즐 구현 추가 없음. QA 미실행.


### 2026-09-15 얼음샛길 네 층 필드 표현 연결
- **자료·버전·확인일:** [Bulbapedia Ice Path](https://bulbapedia.bulbagarden.net/wiki/Ice_Path), [Serebii Pokéarth Ice Path](https://www.serebii.net/pokearth/johto/icepath.shtml), [HGSS Walkthrough Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12), 2026-09-15, Pokémon HeartGold·SoulSilver. `File:Ice_Path_1F_HGSS.png`는 열람 오류로 실제 확인 자료에 포함하지 않는다.
- **원작 사실:** 44번도로와 검은먹시티를 잇는 1F/B1F/B2F/B3F 얼음 동굴이며 계단, 얼음 바닥과 암반 통로, 층별 야생 조우가 여행 동선을 이룬다.
- **프로젝트 변경·소비:** 원작 타일·이미지를 재사용하지 않고 `src/johto-ice-path.ts`의 `paintJohtoIcePath`가 `tour_johto_ice_path_1f/b1f/b2f/b3f`의 실제 walkable·terrain·warp·prop을 읽어 층별 암벽, 비조우 암반 우회, 서리 조우 회랑, 계단과 표식을 BW·BW2풍 Canvas 타일로 그린다. `src/explore-art.ts`가 일반 passage painter보다 먼저 호출한다. 미끄럼 강제 이동·괴력 바위·낙하·원작 도구는 적용하지 않았다.
- **상태:** 필드 렌더 경로에 코드 연결. QA 중단으로 타입 검사·빌드·실제 화면·보행·조우 표시·계단 가독성·저장·음향은 미검증이며 원작 지도 재현 완료 또는 도시 완료 근거가 아니다.


### 2026-09-15 성도 44번도로·얼음샛길 현지 동료 실전 적용
- **자료:** [Bulbapedia Johto Route 44](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_44), [Serebii Pokéarth Route 44](https://www.serebii.net/pokearth/johto/route44.shtml), [Bulbapedia Ice Path](https://bulbapedia.bulbagarden.net/wiki/Ice_Path), [Serebii Pokéarth Ice Path](https://www.serebii.net/pokearth/johto/icepath.shtml), [HGSS Walkthrough Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12), 확인일 2026-09-15, HGSS.
- **원작 사실:** 44번도로는 황토와 얼음샛길 사이의 연못·풀밭·트레이너 구간이고 얼음샛길은 네 층을 거쳐 검은먹으로 이어진다. 원작 트레이너·조우와 통과 던전이 연속 여행을 만든다.
- **프로젝트 변경·소비:** 원작 특정 트레이너 팀을 복제한 기록이 아니라 현재 지원종·레벨의 기존 선택전에서 성도 44번도로/얼음샛길 출신 실제 파티 객체가 상대를 쓰러뜨렸는지 공통 battle 참가 참조로 판정한다. src/johto-east-battle.ts의 시작/결과 상태를 src/road-trainers.ts, src/engine.ts, src/field-partner-party.ts가 소비하고 황토센터·얼음샛길·검은먹 귀환 안내에 표시한다. 기존 승리는 상금 없는 재확인전으로만 증거를 새로 만든다.
- **상태:** 코드 반영. QA 중단으로 선두 선택·교대·상대 격파·성장·기절·PC·저장·귀환은 미검증이며 도시 완료 근거가 아니다.


### 2026-09-15 하나 13번도로 전투 공간
- 출처: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_13 (확인 2026-09-15, BW2). 물결마을과 보배마을을 잇는 긴 해안도로, 모래톱·바다·풀이 덮인 절벽이라는 장소 성격을 확인했다.
- 프로젝트 적용: `src/unova-route-thirteen-battle-art.ts`의 자체 Canvas 배경을 `renderer.ts` 전투 진입에서 `tour_unova_route_13`에 소비한다. 원작 이미지·타일을 복제하지 않았으며 현재 축약 지형의 해안과 고지 초원을 한 화면에 표현한다.
- 경계: 파도타기·괴력·숨은동굴·거대동굴·재생 아이템을 추가하지 않았다. 전투 규칙·조우표·저장은 변경하지 않았다. QA 중단으로 실제 화면과 포켓몬 가림은 미검증이다.


### 2026-09-15 검은먹 도착 후 현지 동료 결과 소비
- **자료·버전·확인일:** [Bulbapedia Blackthorn City](https://bulbapedia.bulbagarden.net/wiki/Blackthorn_City), [Serebii Pokéarth Blackthorn City](https://www.serebii.net/pokearth/johto/blackthorncity.shtml), [Bulbagarden Blackthorn City HGSS map](https://archives.bulbagarden.net/wiki/File%3ABlackthorn_City_HGSS.png), [HGSS Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_13), 확인일 2026-09-15, Pokémon HeartGold·SoulSilver.
- **원작 사실:** 검은먹은 산중 암벽 도시이며 얼음샛길과 45번도로 사이에 있고, HGSS에서는 높은 지형·절벽·강·서리 낀 얼음샛길 입구·센터·용의굴이 도시 생활과 진행을 이룬다. 피곤한 파티는 센터로 가라는 Trainer Tips와 산봉우리를 바라보는 동행 반응도 있다.
- **프로젝트 변경·소비:** 체육관·이향·라이징배지·장로 시험·특별 미뇽은 적용하지 않는다. src/blackthorn-life.ts가 44번도로/얼음샛길 실제 격파 동료의 시작→현재 레벨·HP 또는 PC 상태를 안내원과 센터에 표시하고, 현재 도시 수련은 blackthornTrainingSlot+species로 같은 실제 개체만 찬물→암반→용의굴에 이어 준다. src/field-partner-party.ts가 진행 중 재배치·진화를 추적하고 PC 보관 시 슬롯을 지운다. 지도 이미지는 지형 대조만 했고 자산을 복제하지 않았다.
- **상태:** 코드 반영. QA 중단으로 도착 대화·센터 회복/PC·동종 복수 개체·수련 재선택·용의굴 귀환·저장·화면·음향은 미검증이며 검은먹 완료 근거가 아니다.


### 2026-09-15 하나 12번도로 전투 공간
- 출처: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_12 (확인 2026-09-15, BW2). 빌리지브리지와 보배마을을 잇는 짧은 길, 넓은 초원·완만한 언덕·아래쪽 풀 회피 보행로를 확인했다.
- 프로젝트 적용: `src/unova-route-twelve-battle-art.ts`의 자체 Canvas 배경을 `renderer.ts`에서 `tour_unova_route_12` 전투에 소비한다. 완만한 초원 언덕과 낮은 흙길을 표현하며 원작 이미지·타일은 복제하지 않는다.
- 경계: 숨은 아이템·날씨·짙은 풀 규칙을 추가하지 않았고 전투 규칙·조우·저장은 유지한다. QA 중단으로 실제 화면과 가림은 미검증이다.


### 2026-09-15 성도 45·46번도로 현지 동료 실전 적용
- **자료·버전·확인일:** [Bulbapedia Route 45](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_45), [Serebii Pokéarth Route 45](https://www.serebii.net/pokearth/johto/route45.shtml), [HGSS Route 45 map](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_45_HGSS.png), [Bulbapedia Route 46](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_46), [Serebii Pokéarth Route 46](https://www.serebii.net/pokearth/johto/route46.shtml), [HGSS Route 46 map](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_46_HGSS.png), 확인일 2026-09-15, HGSS.
- **원작 사실:** 45번도로는 검은먹에서 46번도로로 내려가는 Mountain Road이며 강, 여러 갈래 풀길과 남향 턱 때문에 원작에서는 북쪽으로 직접 돌아갈 수 없다. 46번도로는 45번도로와 29번도로를 잇는 더 낮은 산길이다. HGSS 육상 생태와 트레이너가 내려가는 여행에 연속된다.
- **프로젝트 변경·소비:** 현재 프로젝트는 저장과 귀환 계약을 위해 각 턱 옆에 별도 동쪽 오르막을 둔다. src/johto-south-battle.ts는 met=성도 29/45/46번도로인 실제 선두 객체의 슬롯·종·시작 레벨·대상 선택전을 기록하고, 공통 battle 참가 참조에 같은 객체가 있으며 최종 승리한 경우만 현지 실전 결과로 남긴다. road-trainers.ts, engine.ts, field-partner-party.ts, johto-route46-practice.ts, johto-blackthorn-south-life.ts가 재확인전·성장/HP·검은먹/무궁 귀환에 소비한다.
- **경계·상태:** 원작 트레이너 팀·상금·전화 재대결을 복제하지 않으며 상금 없는 재확인전은 증거가 없는 기존 승리 저장만 보완한다. 포획·승리·참가는 통행 조건이 아니다. QA 중단으로 보행·포획·선두·교대·격파·성장·PC·저장·화면·음향은 미검증이다.



### 2026-09-15 검은먹 남쪽 산길 귀환 소비
- **근거:** 같은 날 확인한 [Blackthorn City](https://bulbapedia.bulbagarden.net/wiki/Blackthorn_City), [Route 45](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_45), [Route 46](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_46), 각 Serebii Pokéarth와 HGSS 개별 지도. 원작은 검은먹 남쪽에서 45번 Mountain Road와46번도로로 내려가는 지리와 센터 회복을 제공한다.
- **적용:** src/blackthorn-life.ts가 JOHTO_SOUTH_BATTLE의 실제 객체·시작 레벨·현재 레벨·HP·PC 경계를 안내원/센터/주택/남문 표석에 표시한다. 기존 얼음샛길 결과와 저장 키를 합치지 않는다. 이는 원작 고정 대사나 이벤트 복제가 아니라 포획·성장·귀환을 도시 생활에 남기는 넥서스 재구성이다.
- **상태:** 코드 반영, QA 중단으로 귀환 대화·PC·회복·재출발·저장·화면·음향 미검증. 검은먹 완료 근거 아님.



### 2026-09-15 검은먹 현행 지리 문서 정합성
- HGSS 검은먹·45·46번도로 개별 장소와 지도 대조에 따라 JOHTO_REGION_GUIDE의 초기 미개통 기록을 후속 구현 상태로 정정했다. 실제 소비는 tour_blackthorn 서/북/남 워프, tour_johto_dragons_den/shrine, tour_johto_route_45/46/29와 tour_cherrygrove다.
- 46번도로 전용 상담은 JOHTO_SOUTH_BATTLE 객체 결과를 직접 읽어 실제 격파 성장과 PC 경계를 표시한다. 원작 사건/대사 복제가 아닌 프로젝트 여행 귀환 표현이며 QA 중단으로 미검증이다.

## 관동 쌍둥이섬 B4F 최하층 조우 — 2026-09-15

- 출처: https://bulbapedia.bulbagarden.net/wiki/Seafoam_Islands , https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml , https://archives.bulbagarden.net/wiki/File:Seafoam_Islands_B4F_HGSS.png , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_27 (HGSS, 2026-09-15 확인).
- 원작/차이: 864×448 B4F 지도와 골뱃30·쥬레곤24·골덕14·루주라12·고라파덕10·쥬쥬10% 보행표를 대조했다. 프로젝트는 지원되는 쥬쥬100%·Lv.24~25를 네 선택 냉기 선반에만 적용하고 두 B3F 계단 사이 마른 안전선을 남긴다. 수상/낚시·미지원 종·아이템·HM·프리져는 제외했다.
- 소비: `runtime-local-pools.json/LOCAL-K-SEAFOAM-B4F`→공식 exporter→런타임 데이터/출처 manifest→`runtime-encounters.ts`→`kanto-seafoam-islands.ts` terrain→공통 보행 조우. 전용 painter와 `cinnabar-habitats.ts`의 포획 출처 판정도 연결했다. 생성 73종/65풀/55기술, 모든 QA 미실행이다.
- 후속 소비: 같은 HGSS 지도와 층별 자료에 따라 B4F 관찰의 목적지를 동쪽 상승 계단으로 교정하고 B3F/B2F/B1F 동쪽 분리 회랑과 1F 서쪽 출구에 실제 방향 표석을 배치했다. 이는 원작 사다리 관계를 기존 프로젝트 충돌에 투영한 안내이며 원작 표지 복제나 자동 이동이 아니다. B4F 현장은 해당 층 포획 동료를 읽고 홍련 연구는 쌍둥이섬 전 층을 안내한다. QA 미실행이다.
- 홍련 귀환 소비: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://bulbapedia.bulbagarden.net/wiki/Sea_Route_20 , https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml , https://www.serebii.net/pokearth/kanto/4th/route20.shtml 을 같은 날 HGSS 기준으로 대조했다. `cinnabar-life.ts`의 서쪽 상륙표가 전 층 표시·포획 출처·B4F 동료·파티 부상을 읽고 센터/연구/재출발로 연결한다. 홍련 연구 생활은 프로젝트 재구성이며 원작 체육관·파도타기·전설 사건이 아니다. 모든 QA 미실행이다.
- 홍련 재건 센터: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml 을 2026-09-16 HGSS 기준으로 다시 확인했다. 원작은 분화로 도시가 파괴되고 포켓몬센터만 재건됐으며 북쪽 21번수로·동쪽 20번수로와 연결된다. `src/cinnabar-interiors.ts`가 `tour_cinnabar_center`를 28×22로 확장하고 기존 회복·PC 이벤트를 보존한 채 쌍둥이섬 동료 건조석, 남부 수로 귀환도, 화산재 돌봄 준비대를 실제 충돌·조사 사물로 등록한다. 연구소·주택은 프로젝트의 창작 복구이며 이번 변경은 체육관·화석 복원·프리져·파도타기·21번수로 원형 구현을 뜻하지 않는다. 테스트·빌드·플레이·저장·시각/음향 QA는 중단으로 미실행이다.
- 홍련 공개 연구소: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Lab , https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island 을 2026-09-16 대조했다. 원작 연구소는 1·3세대와 리메이크에 등장하며 큰 접수부와 서쪽의 세 연구실, 교환·기술·화석 복원 기능이 있었지만 HGSS 이전 분화로 파괴됐다. `src/cinnabar-interiors.ts`와 `src/cinnabar-interior-art.ts`는 이를 원본 존속으로 쓰지 않고 `tour_cinnabar_hall` 28×24 복구 공개실의 관찰 구역 분리와 출구 유도에만 참고했다. 기존 화산암 비교 `tourExhibit0`, 회로 모형 `tourExhibit1`, 현지 동료·기술 관찰 `tourExhibit2`를 유지하고 복구 경계판·현장 귀환 기록대를 실제 사물로 추가했다. 원작 교환·기술 지급·화석 복원·전설 연구는 미적용이며 모든 QA는 미실행이다.
- 홍련 복구 생활 실내: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island , https://www.serebii.net/pokearth/kanto/4th/cinnabarisland.shtml 을 2026-09-16 HGSS 기준으로 대조했다. HGSS 홍련에는 분화 뒤 재건 센터 외에 원작 상점·주택이 존속하지 않으므로 `tour_cinnabar_mart`, `home1`, `home2`는 넥서스 창작 복구임을 유지한다. `src/cinnabar-interiors.ts`가 상점 24×20과 두 집 24×18을 실제 충돌·문·안전점까지 확장하고, 기존 구매 및 `cinnabar-life.ts`의 해안 돌봄·쌍둥이섬 수첩 이벤트 ID를 보존한다. 상점 추가 사물은 공식 20번수로 보급과 센터 회복을 안내하지만 새 판매품·보상·통행 조건을 만들지 않는다. 모든 QA는 미실행이다.
- 성장 실전 소비: HGSS 20번수로 자료의 서쪽 모래톱 새조련사/찌르꼬 구성을 현행 Lv.25 선택전에 유지했다. `route20-homeward-battle.ts`→공통 `Battle.defeatedOpponentParticipants`→`engine.ts` 결과 기록으로 쌍둥이섬 선두 동료의 실제 격파 참가를 확인하고, `cinnabar-research.ts`가 시작/현재 레벨·HP를 읽는다. 원작 레벨48·수상 이동·전체 트레이너는 확대 적용하지 않았고 QA는 미실행이다.
- 재탐험 소비: B4F 지도와 양쪽 사다리 구조를 기존 MapId에 유지하고, 실제 참가 승리 뒤 수첩→`tour_kanto_seafoam_b4f/tourSeafoamB4Cold`→홍련 연구소 순환을 연결했다. `seafoamB4BattleReturnObserved`는 실제 관찰대 상호작용에서만 생성되는 프로젝트 선택 기록이며 원작 사건·보상·잠금이 아니다. QA 미실행이다.
- 시각 소비: Bulbagarden Seafoam Islands map category와 HGSS 층별 지도에서 확인한 사다리 관계를 `kanto-south-art.ts`의 MapId 깊이 비교로 투영했다. 1F~B4F 모든 계단이 실제 연결 대상에 따라 상승/하강 표식을 얻고, 동쪽 귀환 조사물 네 곳은 별도 냉기 방향 표석으로 그린다. 외부 이미지·타일은 재사용하지 않았고 화면 QA는 미실행이다.


### 2026-09-15 29번도로에서 무궁시티로 돌아온 성장 기록
- **자료·버전·확인일:** [Bulbapedia Cherrygrove City](https://bulbapedia.bulbagarden.net/wiki/Cherrygrove_City), [Serebii Pokéarth Cherrygrove City](https://www.serebii.net/pokearth/johto/cherrygrovecity.shtml), [HGSS Cherrygrove map](https://archives.bulbagarden.net/wiki/File%3ACherrygrove_City_HGSS.png), [Bulbapedia Route 29](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_29), [Serebii Pokéarth Route 29](https://www.serebii.net/pokearth/johto/route29.shtml), [HGSS Route 29 map](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_29_HGSS.png), 확인일 2026-09-15, HGSS.
- **원작 사실:** 무궁은 꽃향기와 바닷바람의 작은 도시이며 동쪽29번도로, 북쪽30번도로에 접하고 센터·상점이 초반 여행 거점 역할을 한다. 29번도로는 동쪽 연두마을에서 서쪽 무궁으로 이어지고 북쪽46번도로와 합류한다.
- **프로젝트 변경·소비:** 현재 북쪽30번도로와 동쪽 연두마을은 미개통이고, 검은먹→45→46→29→무궁 귀환을 기존 센터·PC·주민 생활에 연결한다. src/johto-cherrygrove-life.ts가 45번도로 출신을 누락하던 집계를 수정하고 JOHTO_SOUTH_BATTLE의 실제 격파 동료, 시작→현재 레벨·HP 또는 PC 상태를 길안내·센터·두 주택에서 소비한다. 원작 강제 도시 투어·러닝슈즈·맵카드 보상은 추가하지 않았다.
- **꽃길 활동 적용:** src/johto-cherrygrove-care.ts는 29·45·46번도로 및 기존29번 합류부 출신을 무궁 귀환 동료로 인식한다. JOHTO_SOUTH_BATTLE에서 실제 격파에 참가한 정확한 객체를 꽃길 동료로 고르면 실전 시작 레벨과 현재 레벨을 표시한다. 이는 HGSS 고정 사건의 복제가 아니라 바닷바람·꽃길 도시 성격에 프로젝트의 포획·전투·성장·귀환을 연결한 선택 활동이며, QA 중단으로 실행 검증은 하지 않았다.
- **상태:** 코드 반영. QA 중단으로 29번 서문 도착·센터 회복/PC·주민 대화·동종 객체·재출발·저장·화면·음향은 미검증이며 무궁 도시 완료 근거가 아니다.

### 성도30번도로 무궁 북문 적용 — 2026-09-15

- **자료·버전·확인일:** [Bulbapedia Route 30](https://bulbapedia.bulbagarden.net/wiki/Route_30), [Serebii Pokéarth Route 30](https://www.serebii.net/pokearth/johto/route30.shtml), [Bulbagarden HGSS Route 30 map](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_30_HGSS.png), [HGSS Walkthrough Section 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_2), 확인일 2026-09-15, HGSS.
- **원작 사실:** 30번도로는 남쪽 무궁시티와 북쪽31번도로를 잇는 긴 초원길이다. 연못과 턱 주변에서 동·서 길이 갈리고 규토리 주민 집과 포켓몬 할아버지 집이 있으며 초보 트레이너와 낮 풀 조우가 있다. HGSS 낮에는 구구와 버전별 캐터피/단데기 또는 뿔충이/딱충이가 등장한다.
- **프로젝트 변경·소비:** `src/johto-route-30.ts`의 `tour_johto_route_30`40×88이 무궁 북문 왕복, 두 갈래 연못길, 두 가옥 앞 기록판, 선택 풀과 선택 곤충채집가,31번 예정 경계를 제공한다. `runtime-local-pools.json/LOCAL-J-R30-DAY`→공식 exporter→런타임 데이터→`runtime-encounters.ts`가 두 버전의 지원종을 합쳐 Lv.20~23으로 조정한다. 원작 Lv.2~4, 초기 트레이너 길막, 이상한 알·도감·규토리상자·수상/낚시·원작 보상은 적용하지 않았다.
- **상태:** 코드와 생성 데이터 반영. QA 중단으로 보행·워프·충돌·조우·포획·전투·귀환·저장·화면·음향은 미검증이며 무궁 도시 완료 근거가 아니다.

### 성도31번도로·도라지 동문 적용 — 2026-09-16

- **자료·버전·확인일:** [Bulbapedia Route 31](https://bulbapedia.bulbagarden.net/wiki/Route_31), [Serebii Pokéarth Route 31](https://www.serebii.net/pokearth/johto/route31.shtml), [Bulbagarden HGSS Route 31 map](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_31_HGSS.png), [HGSS Walkthrough Section 3](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_3), 확인일 2026-09-16, HGSS.
- **원작 사실:** 31번도로는30번도로와 서쪽 도라지시티를 잇는 짧은 숲길이며 동쪽에 어둠의동굴 서쪽 입구, 북쪽 작은 연못, 턱·긴풀 우회와 곤충채집가가 있다. HGSS 낮에는 구구·모다피와 버전별 애벌레 계열이 등장한다.
- **프로젝트 변경·소비:** `src/johto-route-30.ts`의 `tour_johto_route_31`56×28이30번 남쪽, 도라지 동문, 작은 연못 우회, 선택 풀밭·곤충채집가, 어둠의동굴 입구를 제공한다. `LOCAL-J-R31-DAY`는 지원되는 구구·캐터피·단데기·뿔충이·딱충이를 Lv.21~23으로 조정하며 미지원 모다피를 제외한다. `violet-city-layout.ts`와 `violet-life.ts`가 동문 기록석, 현지 보유 동료, 무궁 귀환과 동굴 남서 탐사 가능 상태를 소비한다. 메일 배달·TM44·VS레코더·아이템·Cut 지름길은 적용하지 않았다.
- **상태:** 코드와 생성 데이터 반영. QA 중단으로 보행·동문 워프·충돌·조우·포획·선택전·귀환·저장·화면·음향은 미검증이며 도라지 완료 근거가 아니다.
- **전투 표현:** `src/johto-route31-battle-art.ts`를 `renderer.ts`의 `tour_johto_route_31` 분기에서 소비해 작은 연못·숲길·어둠의동굴 암벽을 BW·BW2풍 Canvas 배경으로 구분한다. 원작 자산은 재사용하지 않았고 전투 규칙·상대·보상·저장은 바꾸지 않았다. 2026-09-16 코드 반영, 화면 QA는 미실행이다.

### 성도 어둠의동굴 31번도로 쪽 적용 — 2026-09-16

- **자료·버전·확인일:** [Bulbapedia Dark Cave](https://bulbapedia.bulbagarden.net/wiki/Dark_Cave), [Serebii Pokéarth Dark Cave](https://www.serebii.net/pokearth/johto/darkcave.shtml), [Bulbagarden HGSS Dark Cave Violet-side map](https://archives.bulbagarden.net/wiki/File%3ADark_Cave_1_HGSS.png), [HGSS Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_13), 확인일 2026-09-16, HGSS. 지도는1088×832의 Violet Side 전체 배치를 구조 대조에만 사용했으며 이미지·타일을 재사용하지 않았다.
- **원작 사실:** 어둠의동굴은31·46·45번도로에 입구를 둔 단층 두 구역 선택 동굴이다. 31번도로 쪽 남서 구역의 일반 보행은 꼬마돌60%, 주뱃39%, 노고치1%, Lv.2~4이며 완전 관통과 일부 물건에는 플래시·파도타기·바위깨기·괴력이 필요하다. 본편 완료에 필수인 동굴은 아니다.
- **프로젝트 변경·소비:** `src/johto-dark-cave-west.ts`의 `tour_johto_dark_cave_west`56×48이31번도로 `(42,6)`과 동굴 서쪽 `(1,38)`을 왕복 연결한다. 밝은 돌 안전 고리, 선택 암반 조우 세 곳, 작은 연못, 심부 경계를 제공한다. `LOCAL-J-DARK-CAVE-WEST`→공식 exporter→`runtime-encounters.ts/J-DARK-CAVE-WEST`가 지원되는 꼬마돌·주뱃을 원작 상대 비율로 Lv.22~24에 공급하며 미지원 노고치는 대체하지 않는다. 원작 이동기술·아이템·낚시·라디오·대량발생·46/45번 관통은 적용하지 않았다.
- **사건·귀환 소비:** `src/johto-dark-cave-life.ts`는 현지에서 포획한 건강한 파티 객체만 조사 동료로 고른다. 서식 흔적→작은 연못 메아리→심부 경계에서 같은 객체를 추적하고 시작/완료 레벨을 기록한다. `field-partner-party.ts`가 미완료 중 파티 재배치만 따라가며 PC 이동 시 다른 동종 객체로 넘기지 않는다. `violet-life.ts`의31번도로 동문 기록석이 현지 보유 수와 완료 동료·레벨 변화를 읽어 동굴→도라지 귀환을 닫는다. 이는 원작 고정 사건 복제가 아닌 넥서스 선택 생태 활동이다.
- **시각 소비:** `paintJohtoDarkCaveWest`를 `explore-art.ts`의 실제 배경 생성 경로에 연결했다. 막힌 암벽, 밝은 돌 안전선, 거친 암반 조우 바닥, 남쪽 귀환 고리 안의 지하 연못,31번도로 출구를 서로 다른 프로젝트 도형으로 그린다. 원작 지도 이미지는 구조 대조만 했고 픽셀·타일을 재사용하지 않았다.
- **전투 표현:** `src/johto-dark-cave-battle-art.ts`를 `renderer.ts`의 `tour_johto_dark_cave_west` 분기에 연결했다. 31번도로 입구의 제한된 빛과 프로젝트 밝은 돌 표식, 거친 암반 알코브를 공통으로 표시하고, 실제 남쪽 귀환 고리 좌표(`player.y >= 33`)에서 시작한 조우는 두 번째 지하 연못과 좁은 마른 선반을 사용한다. 원작 플래시·파도타기·바위깨기·괴력·아이템은 열지 않았으며 전투 규칙·조우·보상·저장은 바꾸지 않았다.

### 성도 어둠의동굴 45·46번도로 쪽 적용 — 2026-09-16

- **자료·버전·확인일:** [Bulbapedia Dark Cave](https://bulbapedia.bulbagarden.net/wiki/Dark_Cave), [Serebii Pokéarth Dark Cave](https://www.serebii.net/pokearth/johto/darkcave.shtml), [Bulbagarden HGSS Dark Cave Blackthorn-side map](https://archives.bulbagarden.net/wiki/File%3ADark_Cave_2_HGSS.png), [HGSS Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_13), 확인일 2026-09-16, HGSS. 지도1088×800은 구조 대조에만 사용하고 자산은 재사용하지 않았다.
- **원작 사실:** 북동 구역의 북쪽45번도로 입구는 굽은 길과 큰 지하 연못으로 내려가며, 남쪽은31번 쪽 구역과46번도로 입구에 관계한다. 완전 통과에는 파도타기·바위깨기·괴력이 관여한다. HGSS 일반 보행은 주뱃30·골뱃5·꼬마돌30·데구리20·마자용15, Lv.20~25다.
- **프로젝트 변경·소비:** `src/johto-dark-cave-east.ts`의 `tour_johto_dark_cave_east`64×56이45번 `(8,17)`↔동굴 `(32,1)`,46번 `(28,22)`↔동굴 `(52,54)`을 연결한다. 두 입구 주머니를 내부에서 분리해 각 도로로 귀환시키며, `paintJohtoDarkCaveEast`가 암벽·밝은 돌·거친 조우 바닥·중앙 물길을 실제 배경에 그린다. `LOCAL-J-DARK-CAVE-EAST`는 지원되는 주뱃·꼬마돌의 원작 동률을50/50, Lv.23~25로 공급하고 미지원 세 종은 대체하지 않는다. 내부 관통·원작 아이템·낚시·라디오·이동기술은 미적용이다.
- **상태:** 코드와 생성 데이터 반영. QA 중단으로45/46번 입구 접근·워프·충돌·조우·포획·귀환·지도 바로 확인·필드/전투 화면·저장은 미검증이며 동굴·검은먹·무궁·성도 완료 근거가 아니다.
- **상태:** 코드와 생성 데이터 반영. QA 중단으로 보행·워프·충돌·조우·포획·전투·귀환·저장·필드/전투 화면·조명·음향은 미검증이며 어둠의동굴·도라지·무궁·성도 완료 근거가 아니다.

### 2026-09-22 초기 등록과 NEXUS 세 동료 도입

- **등록 근거:** pret/pokeplatinum `main`의 [무쇠탄갱 B2F 이벤트](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/events/events_oreburgh_mine_b2f.json)·[B2F 스크립트](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/scripts/scripts_oreburgh_mine_b2f.s)와 대응 B1F 파일을 읽었다. 오브젝트의 LOCALID_ROARK가 script1에 연결되고 ScriptEntry가 대화/동작으로 이어지며 완료 효과가 장면과 구분되는 구조를 대조했다.
- **채택/변경:** 첫 여정의 실제 MapId+event→기존 어댑터 등록과 완료 효과 분리를 채택했다. 지도 배치·저장 사실·대화 표현을 구분하고 도로 트레이너→등록→도시 폴백 순서를 보존했다. 원작 바위깨기/오브젝트 제거 순서나 의무 통행 잠금은 이식하지 않았다. 외부 코드 복사는 없다.
- **데이터 근거:** [PokéAPI v2 문서](https://pokeapi.co/docs/v2)의 PokemonStat, PokemonMoveVersion, Move PP 구조를 읽었다. 종 능력치·버전별 습득·기술 PP 분리를 채택하고 기존 고정 CSV/지원 기술을 재사용했다. 신규 사슴/늑대/물범의 이름·수치·습득표는 `scripts/design/nexus-starters.json`의 프로젝트 잠정안이며 공식종 자료에서 가져오지 않았다.
- **원고 적용:** CANON·본편1장·주요 장면의 챔피언 꿈, 가족 엽서, 하린의 기다림, 첫 동료와 바깥 걷기, 도윤/유진 만남을 재사용한 시작 공간에 연결했다. 첫 친선전 상대는 세 신규 타입 모두와 중립 관계인 기존 현지 비버니 Lv5로 정했다. 특정 원작 라이벌 스타팅 선택 규칙을 복제하지 않았고 유진의 최종 팀을 확정하지 않는다. 친선전 종료는 도윤의 현장 응급 처치다. 잔모래까지 강제 동행하지 않으며, 이후 직접 찾아가는 센터 재회 연결은 아래 후속 적용에 기록한다.
- **제외/검증 경계:** 신규 외부 자산 취득 없이 자작 정지 SVG만 추가했다. 오프라인 실행 데이터 생성과 코드/문서 대조만 했으며 테스트·타입검사·빌드·브라우저·저장·시각/음향 QA는 실행하지 않았다.

### 2026-09-22 잔모래 센터 재회와 첫 포획·성장 연결

- **원문·확인 범위:** pret/pokeplatinum `main`의 [잔모래 스크립트](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/scripts/scripts_sandgem_town.s), [잔모래 센터 1층 스크립트](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/scripts/scripts_sandgem_town_pokecenter_1f.s), [202번도로 스크립트](https://raw.githubusercontent.com/pret/pokeplatinum/main/res/field/scripts/scripts_route_202.s)를 2026-09-22 읽었다. 커밋 미고정 조회이므로 이후 URL 내용은 바뀔 수 있다.
- **확인한 원작 흐름:** 잔모래 연구소 퇴장 뒤 센터→상점→가족에게 알리기 순서로 안내한다. 센터 간호사는 공통 회복 서비스를 호출하고 주민이 회복과 PC를 따로 설명한다. 202번도로는 가족 소포 조건을 확인한 뒤 풀밭에서 포획 시범을 실행하고 볼5개를 더 지급한 다음 도로 상태를 바꾼다.
- **채택·변경:** 실제 시설의 이용과 설명을 분리하는 구조를 참고했다. NEXUS의 유진 재회는 채택 본편1장의 창작이며 v2 출발 뒤 센터 대기석의 `tourExhibit2`에서 첫 승부 승패/생략을 읽는다. 간호사를 실제 이용해야 회복 기록이 생기며, 친선전 응급 처치나 대화만으로 센터 회복을 대신하지 않는다. 포획 안내 완료와 일반 야생전의 실제 포획, 현지 동료의 승리한 전투 참가를 서로 다른 상태로 기록한다.
- **보급·제외:** 기존 도윤 출발 보급에 원작의 볼5개를 다시 더하지 않는다. 첫 배지 전 잔모래 간호사는 현재 수량을 몬스터볼5개·상처약2개까지 올리는 부족분 보충을 반복 제공한다. 기존 수량이 많으면 줄이지 않고 배지 뒤에는 무료 도구 보충을 끝낸다. 성별 상대역·강제 가족 재방문·시범 자동 포획·새 상점·강제 동행·통행 잠금은 이식하지 않았다. 포획과 친선전은 선택이며 기존 v1에 새 장면을 자동 기록하지 않는다.
- **소비·호환:** [초기 여행](../../src/nexus-early-journey.ts)·[상태/배치](../../src/nexus-early-state.ts)→[첫 여정 등록](../../src/first-journey-events.ts)·[Engine](../../src/engine.ts)·[목표 안내](../../src/adventure-guide.ts)가 기존 201/202 조우·전투·파티/PC·경험치·회복·왕복 지도를 재사용한다. 센터 배우는 기존 막힌 벤치 칸에 둔다. 비버니 Lv2 소유 허용은 기존 Lv3 이상 HP를 유지하며, 집에서는 HP 손상 없이 PP만 부족해도 회복한다. v2 신규 사실이 없는 이전 저장도 읽으며 자동 완료는 지급하지 않는다. 시작 공간은 여전히 새잎 `town/lab`이고 최종 떡잎 지리 이행은 남아 있다.
- **상태:** 외부 코드·대사·지도·자산 복사 없이 코드와 원문을 대조했다. 테스트·타입검사·빌드·자연 조우/포획/성장·회복·왕복 보행·저장/재접속·화면/음향은 실행하지 않았다. 구현 연결과 정적 검토는 실제 초반 여정 수용을 뜻하지 않는다.
