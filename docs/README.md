# Pokémon NEXUS 문서 안내

**처음에는 [비전·결정](NEXUS_GOAL.md) → [현재 상태](PROJECT_STATE.md) → [제작 계획](STORY_AXIS_ROADMAP.md)을 읽는다.** 관련 서사·지역·기술 자료만 추가로 확인한다. 현재 게임은 부분 구현·미검증이다.

## 기준과 현재 상태

| 책임 | 문서 |
| --- | --- |
| 비전·범위·기술 방향·남은 제품 선택 | [NEXUS_GOAL](NEXUS_GOAL.md) |
| 정적 구현 근거·위험·협업 상태 | [PROJECT_STATE](PROJECT_STATE.md) |
| 다음 실행 묶음·의존·단계 종료 | [STORY_AXIS_ROADMAP](STORY_AXIS_ROADMAP.md) |
| 짧은 재개 위치 | [CONTINUE_STATE](CONTINUE_STATE.md) |
| 아키텍처·저장 이행·실행 계약 | [DEVELOPMENT](DEVELOPMENT.md) |
| 콘텐츠 제작 절차·도시 완료 | [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md) |
| 첫 여정의 범위·수용 | [FIRST_BADGE_SLICE](FIRST_BADGE_SLICE.md) |
| 원고와 현재 코드/플래그 대응 | [STORY](STORY.md) |
| 공통 데이터·입력/생성/실행 소비 | [RUNTIME_DATABASE](RUNTIME_DATABASE.md) |
| 계속 적용하는 보존·QA·참고 원칙 | [AGENTS](AGENTS.md) |

구현 정의·소비 연결·자동 검사·실제 플레이·도시 수용을 구분한다. 문서 완결·맵 수·과거 PASS는 현재 게임 완료가 아니다. **QA 중단은 유지한다.**

## 서사와 지방 설계

| 위치 | 내용 |
| --- | --- |
| [story/NEXUS_MAIN_STORY_CANON](story/NEXUS_MAIN_STORY_CANON.md) | 인과·인물·세계 규칙·결말·폐기/보류의 단일 기준 |
| [본편28장](story/NEXUS_STORY_COMPLETE.md) · [포켓몬 연작](story/NEXUS_POKEMON_CHRONICLES.md) · [고려](story/GORYEO_STORY_COMPLETE.md) · [장면 대본](story/NEXUS_KEY_SCENES.md) | 채택된 상세 원고. COMPLETE는 원고를 뜻하며 게임 구현 완료가 아님 |
| [서사 출처 대장](story/NEXUS_STORY_SOURCE_LEDGER.md) | 사용자 요구·원작 모티프·창작 변경의 근거 |
| [신오](regions/SINNOH_REGION_PLAN.md) · [관동](regions/KANTO_REGION_PLAN.md) · [성도](regions/JOHTO_REGION_GUIDE.md) · [하나](regions/UNOVA_REGION.md) | 지방별 고유 지리·생태·도시 요구. 날짜별 적용 기록은 과거 근거 |
| [WORLD_ROUTES](WORLD_ROUTES.md) | 공식명·번호·MapId·실제 연결·교통·귀환·개발 지도 경계 |
| [MAP_SIZE_STANDARDS](MAP_SIZE_STANDARDS.md) · [VISUAL_STYLE_BW_BW2](VISUAL_STYLE_BW_BW2.md) | 현재/목표 크기와 표현 기준 |

## 적극 참고할 자료

[REFERENCE_RESEARCH](reference/REFERENCE_RESEARCH.md)를 **조사·설계·구현 검토의 기본 참고군**으로 사용한다.

- 장소·맵·조우·진행: Bulbapedia, Serebii Pokéarth, StrategyWiki, GameFAQs.
- 원작 구현: pret의 Platinum·HeartGold·Emerald와 관련 세대 저장소.
- 데이터·배틀·확장: PokéAPI, Pokémon Showdown, pokeemerald-expansion.
- 콘텐츠·생태·TypeScript 구조: Pokémon Essentials, PokeWilds, RPG-JS.

관련 페이지·소스를 실제로 읽고 확인한 범위와 채택/변경/미채택 이유를 남긴다. 외부 방식을 무조건 복제하거나 매번 모든 자료를 열람하는 규칙은 아니다. 원작 사실·넥서스 창작·실행 지원·검증을 구별한다. 코드/자산을 실제 재사용할 때는 파일·버전·라이선스를 별도로 기록한다.

[GAMEPLAY](GAMEPLAY.md)는 기존 조작 안내, [WORLD_TOUR](WORLD_TOUR.md)는 생성 지도 설명이다. 최신 구현 사실은 PROJECT_STATE와 코드에서 확인한다.

## 생성기 입력과 출력

[설계 DB 안내](개발용_데이터베이스_안내.md)와 [데이터 계약](RUNTIME_DATABASE.md)을 따른다.

- 입력: [nexus-plan.json](design-data/nexus-plan.json), [초안맵](개발용_초안맵.md), [초안스토리](개발용_초안스토리.md).
- 출력: 개발용_포켓몬도감·지역별출현표·진화/체육관/아이템/기술/퀘스트데이터베이스·데이터베이스_안내.md, design-data의 생성 JSON, WORLD_TOUR.md.
- 파서와 출력 경로가 사용하므로 이 파일군은 제자리에 둔다. 초안이라는 이름만으로 지우거나 표를 바꾸지 않는다.
- [NEXUS_STORY_MASTER](NEXUS_STORY_MASTER.md)와 [WORLD_DATA_STANDARDS](WORLD_DATA_STANDARDS.md)는 생성기 링크 때문에 남긴 짧은 호환 안내다. 독립 기준을 추가하지 않는다.
- 새28장·신규종·32배지 본선과 옛 생성 조건은 이행 전이다. 설계 레코드는 저장 완료 사실이 아니다.

## 과거 기록과 삭제 기준

[archive 안내](archive/README.md)에서 지방별 구현·검증, 공통 시스템, 결정 이력을 찾는다. 고유 근거가 있는 이전 대장만 별도로 유지한다.

회차별 autonomy와 삭제 검토 대기 폴더는 통합 후 제거했다. 대체된 규칙·색인·데이터 계약 사본, 낡은 GitHub 비교, 중복 진단문은 삭제했다. 필요한 출처·지도 계약은 담당 문서에 통합했다. 상세 삭제 범위와 기록 위치는 archive 안내에 있다.

앞으로도 **필요한 내용 통합 → 링크 이관 → 중복 파일 삭제** 순서로 정리한다. 새 회차 문서나 모든 문서의 전체 사본을 기본으로 만들지 않는다.

## 충돌과 갱신

1. 판단하에 최선의 방안을 결정한다. 사용자의 최신 직접 지시와 이미 채택된 범위를 따른다.
2. 제품·서사는 담당 기준, 현재 동작은 코드와 날짜/방법이 있는 검증 근거로 판정한다.
3. 지역 부록·과거 기록의 옛 배정·우선순위·QA 재개·완료 수량을 현재 지시로 승계하지 않는다.
4. 같은 결정·상태·TODO·출구·목표 크기를 여러 문서에 복제하지 않는다. 해당 담당 문서만 갱신한다.

저장 보호와 첫 여정 연결 구현에 착수했다. 반영 범위와 다음 위치는 PROJECT_STATE·CONTINUE_STATE를 따른다. 이 문서 갱신은 QA 재개가 아니다.
