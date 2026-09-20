# 문서 안내

> **2026-09-21 새 스토리 원고:** [본편 28장·32배지](NEXUS_STORY_COMPLETE.md) → [SQ16·EX20·생활 연작](NEXUS_POKEMON_CHRONICLES.md) → [고려 네 거점·4체육관](GORYEO_STORY_COMPLETE.md). [출처·요구사항 대응](NEXUS_STORY_SOURCE_LEDGER.md)에서 원작과 창작을 구분한다. 서사 내용은 이 원고가 기존 통합 서사의 지방 이동·배지·첫 리그 배치를 대체한다. 범위·완료 판정은 NEXUS_GOAL, 실제 구현은 STORY가 계속 담당한다. 문서 완결은 구현 완료가 아니다.

> **장기 Goal · 2026-09-20 등록:** [NEXUS_GOAL](NEXUS_GOAL.md)이 Goal 범위·완료 판정·공통 시스템의 단일 대장이고, [스토리 기준 로드맵](STORY_AXIS_ROADMAP.md)이 장별 현황과 단계 순서를 관리한다. **네 지방 중 하나라도 필수 구현·검증이 남으면 Goal을 완료로 표시하지 않는다.**

> **현행 구현 우선 기준:** [REGIONAL_IMPLEMENTATION_DIRECTIVES](REGIONAL_IMPLEMENTATION_DIRECTIVES.md)는 지방별 작업 선택·도시 산출물·기존 맵 보수의 필수 기준이다. 현재 QA는 중단이다. 날짜별 보고의 재개 문구를 운영 지시로 사용하지 않는다.

2026-09-12 정리 기준. **포켓몬 넥서스는 Nintendo DS BW·BW2풍을 목표로 한다.** 현재 맵·스토리 구현을 지방→시티/마을 단위로 이어가며, 그래픽 전환 완료를 뜻하지 않는다. **사용자 재개 지시 전까지 모든 QA 중단**을 유지한다.

## 먼저 읽을 문서

1. [작업 지침](../AGENTS.md)과 [상세 규칙](AGENTS.md): 실행·보존·QA 중단.
2. [장기 Goal](NEXUS_GOAL.md)과 [스토리 기준 로드맵](STORY_AXIS_ROADMAP.md): 무엇을 완성이라 부르는지와 어떤 순서로 만드는지.
3. [지방별 구현 지시](REGIONAL_IMPLEMENTATION_DIRECTIVES.md): 작업 선택·도시별 필수 산출물과 기존 맵 보수 우선순위. 이어 [현재 인계](CONTINUE_STATE.md)와 [배정 상태](PROJECT_STATE.md)에서 실제 도시와 쓰기 범위를 확인한다.
4. [개발 기준](DEVELOPMENT.md)·[현재 스토리](STORY.md): 실제 코드/플래그/저장 계약과 구현 기록.
5. [넥서스 통합 서사](NEXUS_STORY_MASTER.md)·[BW·BW2풍 기준](VISUAL_STYLE_BW_BW2.md): 채택된 목표. 해당 지방 설계와 맵·스토리 적용표를 이어 읽는다.

## 문서 책임과 충돌 해결

| 판단할 내용 | 단일 기준 | 다른 문서와의 관계 |
| --- | --- | --- |
| 작업 실행·보존·QA | [루트 AGENTS](../AGENTS.md) → [상세 AGENTS](AGENTS.md) | 사용자 최신 지시가 우선. QA 중단 중 도시 완료 QA도 실행하지 않음 |
| Goal 범위·완료 판정·공통 시스템 번호 | [NEXUS_GOAL](NEXUS_GOAL.md) | 네 지방 중 하나라도 필수 구현·검증이 남으면 완료로 표시하지 않음. 지방·도시 순서의 단일 대장 |
| 장별 구현 현황·단계 순서·선행 조건 | [STORY_AXIS_ROADMAP](STORY_AXIS_ROADMAP.md) | CH00~CH10 기준의 진척 척도. NEXUS_GOAL과 충돌하면 NEXUS_GOAL을 따름 |
| 지방별 구현 우선순위·산출물·자료 적용 | [REGIONAL_IMPLEMENTATION_DIRECTIVES](REGIONAL_IMPLEMENTATION_DIRECTIVES.md) | 지방별 작업에서 필수 적용. 아래 지리·서사·크기·데이터의 확정 계약은 각 담당 문서를 따름 |
| 목표·도시 완료 조건·현재 기능 | [DEVELOPMENT](DEVELOPMENT.md)와 관련 코드 | 문서 수량·과거 PASS를 현재 완료 증거로 쓰지 않음 |
| 시각·연출 목표 | [VISUAL_STYLE_BW_BW2](VISUAL_STYLE_BW_BW2.md) | 현재 목표는 BW·BW2. DP/Pt 원작·기존 자산·과거 화면 기록은 보존 |
| 본편 인과·인물 성장·배지/사건·엔딩 | [NEXUS_STORY_MASTER](NEXUS_STORY_MASTER.md) | v2의 장면·성장 공급·재진입·복선/최종 회수를 원고·맵이 구체화. 런타임 적용은 별도 |
| 실제 스토리·대사·플래그 | [STORY](STORY.md)와 관련 코드 | 새 설계를 기존 생활 이벤트 완료로 대체하지 않음 |
| 맵별 사건·도시 담당 경계 | [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md) | 도착 이유→행동→포획/육성/배틀→상태 변화→다음 경유·귀환 |
| 도시 디자인·생태·장소별 요구 | 지방별 문서 | 시각은 BW·BW2, 지리는 각 지방 원작과 프로젝트 명시 차이 유지 |
| 장소·공식 도로·동굴·교통·귀환 | [WORLD_ROUTES](WORLD_ROUTES.md)와 실제 MapId/워프 | 설계 노드·내부 별칭을 원작 번호나 실행 MapId로 혼동하지 않음 |
| 현재/목표 맵 크기 | [MAP_SIZE_STANDARDS](MAP_SIZE_STANDARDS.md) | 정사각형 강제 없음. 새 크기 목표는 이 대장만 갱신 |
| 공통 실행 구조·실제 소비 경로 | [RUNTIME_DATABASE](RUNTIME_DATABASE.md) | src/data와 현재 플레이 연결, 미지원 범위·저장 분리 |
| 공통 데이터·세대·실행 지원 | [WORLD_DATA_STANDARDS](WORLD_DATA_STANDARDS.md)와 코드 | 시각 승격이 기술표/전투 규칙의 일괄 5세대 전환을 뜻하지 않음 |
| 웹 근거·원작 버전·출처 | [REFERENCE_RESEARCH](REFERENCE_RESEARCH.md) | 검색 결과/본문/화면 분석과 프로젝트 창작을 구분 |
| 현재 재개/작업 배정 | [CONTINUE_STATE](CONTINUE_STATE.md) / [PROJECT_STATE](PROJECT_STATE.md) | 과거 보고의 다음 작업으로 현재 담당 도시를 교체하지 않음 |
| 삭제 전 검토 | [검토함](review-pending/2026-09-12/README.md) | 이동 목록·사유·복원 경로 보존. 사용자 결정 전 삭제 없음 |

충돌 시 현재 상태/목표/과거 이력을 먼저 구분하고, 담당 기준 문서와 최신 코드·사용자 지시를 대조한다. 미래 요구를 현재 구현으로 바꾸거나 과거 실패·미검증을 완료로 고쳐 쓰지 않는다.

## 지방·세계·플레이

외부 개발 참고는 [GitHub 프로젝트 비교](GITHUB_PROJECT_COMPARISON.md)를 참조한다. 인기 지표·게임/엔진 구분·현재 프로젝트의 보완 후보를 담은 조사 기록이며 구현 지시나 완료 증거가 아니다.

| 문서 | 용도 |
| --- | --- |
| [신오](SINNOH_REGION_PLAN.md) | 신오 도시·산악·호수·시작/귀환 구간 |
| [관동](KANTO_REGION_PLAN.md) | 관동 도시·항구·연구·도로/동굴 |
| [성도](JOHTO_REGION_GUIDE.md) | 성도 마을·전승·탑·숲·수로 |
| [하나](UNOVA_REGION.md) | 하나 B2W2 지리와 NEXUS 사건 배치의 차이 |
| [지역 지도](REGION_ATLAS.md) | 개발도구의 지방 지도 설계와 반영 상태 |
| [세계 여행](WORLD_TOUR.md) | 통합 지도·시설·출입 구조와 기존 구현 기록 |
| [조작·플레이 안내](GAMEPLAY.md) | 실제 사용할 수 있는 조작과 기능 |

## 서사 원고와 생성 설계 자료

‘초안’이라는 파일명은 기존 참조와 생성기 호환 때문에 유지한다. 현행 원본이므로 정리 후보로 옮기지 않았다.

| 문서 | 역할 |
| --- | --- |
| [장별 스토리 원고](개발용_초안스토리.md) | 통합 서사v2의 장면 목차와 CH/SQ/PG 내용·조건, 생성기 입력 |
| [장기 맵 원고](개발용_초안맵.md) | S/K/J/U/X 설계 노드·장소·체육관·획득 배치, 생성기 입력 |
| [데이터베이스 안내](개발용_데이터베이스_안내.md) | 생성 원본·결과물·원자료·실행 추출의 관계 |
| [포켓몬도감](개발용_포켓몬도감.md) · [지역별 출현표](개발용_지역별출현표.md) | 종·서식지·입수 설계 |
| [진화](개발용_진화데이터베이스.md) · [기술](개발용_기술데이터베이스.md) | 진화 조건·기술 후보·지원 경계 |
| [아이템](개발용_아이템데이터베이스.md) · [체육관](개발용_체육관데이터베이스.md) | 도구·도전 팀·보상·필수/권장 구분 |
| [퀘스트](개발용_퀘스트데이터베이스.md) | CH/SQ/PG/LEG/CARE 설계 레코드. 존재 자체는 실행 완료 아님 |
| [design-data/](design-data/) | 원본 nexus-plan.json·생성 JSON·과거 생성 출처/검증 기록 |

생성기는 장별 스토리·맵 원고와 nexus-plan.json을 함께 읽는다. 원고/생성 원본과 결과물을 동기화하며 런타임 추출은 별도 작업이다. 전체 생성기에 포함된 검증도 현재 QA 중단 대상이므로 이 안내를 읽었다고 실행하지 않는다. validation.json은 기록 당시의 결과다.

## 운영·과거 근거·검토 대기

| 위치 | 유지 이유 |
| --- | --- |
| [AUTONOMOUS_WORKFLOW](AUTONOMOUS_WORKFLOW.md) | 운영 절차. 문서 정리로 자동화·배정 변경 없음 |
| [FIRST_BADGE_SLICE](FIRST_BADGE_SLICE.md) | 시작 구간의 기존 설계/수용 근거. 재시작 지시가 아님 |
| [JOURNEY_IMPLEMENTATION](JOURNEY_IMPLEMENTATION.md) | 이전 구현·자연/준비 저장·검증 근거. 현재 QA 지시가 아님 |
| [autonomy/](autonomy/README.md) | 최신 도시 인계와 선택적으로 유지한 종합 보고 |
| [삭제 전 검토함](review-pending/2026-09-12/README.md) | 이전 자동/직접 회차49개와 통합된 스토리 검토1개. 삭제 없이 이동 |

검토함 자료도 고유한 실패·자연 진행·출처 근거가 있을 수 있다. 일괄 폐기 대상으로 확정한 것이 아니며 보관/복원/삭제는 사용자가 결정한다. 현재 문서의 링크와 이동한 파일 내부의 상대 링크는 새 위치를 가리키도록 조정했다.

## 문서 보관과 갱신 규칙

| 분류 | 위치·대상 | 처리 |
| --- | --- | --- |
| 현행 기준·탐색 입구 | 루트/상세 AGENTS, 이 색인, 구현 지시서와 위 책임표의 기준 문서 | 링크 호환을 위해 현 위치 유지. 규칙은 담당 문서에서 갱신하고 다른 문서는 연결 |
| 현재 진행 | CONTINUE_STATE, PROJECT_STATE | 현행 요약과 관련 보고 링크만 우선 읽음. 과거 배정을 최신 작업으로 오인하지 않음 |
| 원고·생성 자료 | 개발용_*.md, design-data/ | 초안이라는 이름만으로 이동/폐기하지 않음. 생성기 입력과 생성 결과를 구분 |
| 참고·사용 안내 | REFERENCE_RESEARCH, GITHUB_PROJECT_COMPARISON, GAMEPLAY, REGION_ATLAS, WORLD_TOUR | 조사·사용법·구조 설명. 현재 구현 우선순위를 덮어쓰지 않음 |
| 변경·검증 이력 | autonomy/, JOURNEY_IMPLEMENTATION, FIRST_BADGE_SLICE | 당시 근거 보존. 해당 구간의 근거가 필요할 때만 읽음 |
| 정리 검토 대기 | review-pending/날짜/ | 사용자 검토 전 삭제 금지. 이동 시 원래 경로·현재 경로·사유와 참조 링크 보존 |

새 문서는 기존 담당 문서의 관련 절로 수용할 수 있는지 먼저 확인한다. 별도 보고가 필요하면 autonomy 색인에 연결하고 기준 문서에 내용을 중복 복사하지 않는다. 이 정리에서는 파일을 추가 이동하거나 삭제하지 않았다. 기존 검토함은 계속 사용자 검토 대기다.

## 상태 표시

- **채택 설계·미반영:** 사용자 결정은 반영됐지만 아직 코드·대사·플래그로 실행되지 않음.
- **부분 구현·미검증:** 코드 적용 범위가 있으나 QA 중단 등으로 완료 근거가 없음.
- **도시 완료:** 계획한 도시 전체 구현과 필요한 검증이 끝난 상태. QA 중단 중 새로 선언하지 않음.
- **과거 이력:** 기록 당시의 구현·검증이며 현재 품질·수량과 구분.
- **검토 대기:** 삭제하지 않은 정리 후보. 사용자 검토 전 자동 처리 없음.
