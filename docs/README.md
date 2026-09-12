# 문서 안내

2026-09-10 크기 기준 보완: [맵 크기 기준·전체 대장](MAP_SIZE_STANDARDS.md)에 사용자 참고표보다 넓힌 유형별 범위, 현재402개 맵의 실제/목표 크기, 신규 도로·던전의 층별 크기를 명시했다. 이 문서의 현재 크기 기록은 이력이며 새 목표 크기는 해당 대장을 따른다. 게임 확대는 미적용이다.

이 폴더의 문서는 역할이 다르다. **현재 구현 판단은 소스와 [DEVELOPMENT.md](DEVELOPMENT.md)·[STORY.md](STORY.md)를 우선**하고, 초안·설계 DB의 항목은 아래 상태표에서 `부분 반영` 또는 `미구현`으로 확인한 뒤 사용한다.

## 문서 책임과 충돌 해결

**최신 사용자 지시가 우선한다.** 목표는 포켓몬 세계관에 맞는 DP풍 맵·스토리를 실제 게임에 적용하는 것이며, 지방별로 시티·마을 하나씩 구현하고 도시가 완성되면 QA한다. 같은 규칙을 여러 문서에서 별도로 정하지 않고 아래 담당 문서를 참조한다.

| 판단할 내용 | 단일 기준 | 다른 문서의 역할 |
| --- | --- | --- |
| 웹 근거·참고 버전·조회 한계 | [REFERENCE_RESEARCH](REFERENCE_RESEARCH.md) | 사이트 추천과 실제 본문 확인을 구분하고 근거 URL을 유지 |
| 후속 맵·스토리 요구와 도시 담당 경계 | [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md) | WORLD_ROUTES의 지리 목표를 맵별로 구체화. 현재 배정/저장/진행은 CONTINUE_STATE 우선 |
| 개발 목표·우선순위·도시 완료 조건 | [DEVELOPMENT 제0절](DEVELOPMENT.md#0-최우선-목표와-지방도시-작업-단위) | 지방 문서는 해당 도시의 맵·스토리·포켓몬·디자인으로 구체화 |
| 실행·보존·QA 시점 | 루트 AGENTS → [상세 AGENTS](AGENTS.md#검증과-도시-완료) | 운영 문서·지역 문서에 별도 주기/회차 제한을 만들지 않음 |
| 확정 이야기·이벤트·플래그 | [STORY](STORY.md)와 최신 사용자 결정 | 장기 초안은 미확정 선택을 제공. 초안만으로 큰 사건·새 잠금을 실행하지 않음 |
| 도시 디자인·지방별 세부 요구 | [신오](SINNOH_REGION_PLAN.md) · [관동](KANTO_REGION_PLAN.md) · [성도](JOHTO_REGION_GUIDE.md) · [하나](UNOVA_REGION.md) | 기존 프로젝트 번호는 내부 이행 자료. 플레이어 표시 기준은 WORLD_ROUTES |
| 현재 경로·출구·교통·플레이어 표시명 | 실제 `ACTIVE_MAPS`/워프·이벤트 코드 → [WORLD_ROUTES](WORLD_ROUTES.md) | 공식 번호·고유명을 우선하고 창작 구간은 새 공식풍 번호를 만들지 않음 |
| 공통 데이터 관계·출처·현재 수량 | [WORLD_DATA_STANDARDS](WORLD_DATA_STANDARDS.md) + 관련 소스/JSON | 설계 DB는 후보 수치·조건. 설계 수량과 실행 지원 수량을 구분 |
| 현재 재개 도시·위치·누적 구현·다음 QA 조건 | [CONTINUE_STATE](CONTINUE_STATE.md) | PROJECT_STATE는 배정/쓰기 범위만 관리. 옛 담당 보고의 다음 작업으로 재개 위치를 덮어쓰지 않음 |
| 실제 검증 근거 | 날짜가 있는 개별 보고·테스트/저장 결과 | JOURNEY_IMPLEMENTATION·autonomy의 과거 PASS·미완료는 그 시점의 이력이며 현재 QA 지시가 아님 |

충돌 처리 순서: 현재 상태인지 미래 요구인지 먼저 구분 → 해당 기준 문서와 최신 코드/사용자 지시 대조 → 기준 문서를 수정 → 요약·참조·생성기 설명을 같은 회차에 갱신한다. 코드가 부족하면 ‘미반영’으로 기록하고 요구를 삭제해 맞추지 않는다. 과거 보고의 사실·실패를 고쳐 현재 완료처럼 만들지 않는다.

‘현재’, ‘이번 요청’, ‘최신’이 있는 과거 절도 작성일/회차 기준으로 읽는다. 첫 배지 재시작·매 기능 검증·3회차 QC·과거 역할의 코드 수정 금지는 현행 전체 작업 제한으로 상속하지 않는다. 현재 저장·미커밋 구현을 보존하고 도로 표시는 최신 WORLD_ROUTES의 도시별 이행 기준을 따른다.

## 현재 기준

성도 작업은 [JOHTO_REGION_GUIDE.md](JOHTO_REGION_GUIDE.md)를 필수 참조한다. 장소별 보완·확장, 도로/수로 번호·동굴 명칭·도시 간 경유지와 현재 MapId 대응을 기록했다.34번·금빛역 등 반영된 내용과 후속 확장안을 구분한다.

| 문서 | 역할 |
| --- | --- |
| [REFERENCE_RESEARCH.md](REFERENCE_RESEARCH.md) | 웹 자료의 역할·버전·실제 확인·접근 실패, 지리/사건/데이터 근거 |
| [MAP_STORY_DESIGN.md](MAP_STORY_DESIGN.md) | 현재 저장소 차이, 다음 도시 순서, 맵별 공간·포켓몬·스토리·이행 요구 |
| [WORLD_DATA_STANDARDS.md](WORLD_DATA_STANDARDS.md) | 네 지방 공통 테이블 관계·세계관·원자료/프로젝트 규칙·현재 실행 지원 범위 |
| [WORLD_ROUTES.md](WORLD_ROUTES.md) | 장소43·연결49의 실제 경유·출구, 원작 지리 대조, 지방별 번호 기준과 지방 간 교통 |
| [KANTO_REGION_PLAN.md](KANTO_REGION_PLAN.md) | 관동 도시 요구·현재 MapId·저장 계약. 옛 프로젝트 번호는 내부 이행 자료이며 신규 공식 표시는 WORLD_ROUTES |
| [DEVELOPMENT.md](DEVELOPMENT.md) | 현재 구조·지도·전투·저장 계약과 설계 반영 현황 |
| [STORY.md](STORY.md) | 현재 이야기·대사·플래그, 사용자 확정 장기 방향, 미구현 경계 |
| [SINNOH_REGION_PLAN.md](SINNOH_REGION_PLAN.md) | 신오 도시 요구와 현재/예정 구간. 옛 축약 번호와 Pt 지리 복원안을 구분 |
| [GAMEPLAY.md](GAMEPLAY.md) | 플레이어가 실제로 사용할 수 있는 조작과 기능 |
| [WORLD_TOUR.md](WORLD_TOUR.md) | 통합 지도·장소·그래픽 구성과 과거 검증 이력 |
| [UNOVA_REGION.md](UNOVA_REGION.md) | 하나 도시·생태·현재 연결과 B2W2 후속 지리. 구름/사막 접근로 부분 반영과 신규 동굴·항공 미구현을 구분 |

## 장기 설계와 데이터

| 문서 | 지위 |
| --- | --- |
| [스토리·월드 설계 검토](스토리_월드_설계검토.md) | 사용자 확정 큰 방향과 아직 채택되지 않은 보완 제안을 구분한 검토서 |
| [개발용 초안 스토리](개발용_초안스토리.md) | CH/SQ/PG 장기 이야기 제안. 일부 출발·신오 전반만 현재 코드와 접점이 있음 |
| [개발용 초안 맵](개발용_초안맵.md) | S/K/J/U/X 90개 권역과 장기 동선 제안. 현재 지도 구현과 1:1 대응하지 않음 |
| [개발용 데이터베이스 안내](개발용_데이터베이스_안내.md) | 도감·출현·진화·체육관·아이템·기술·퀘스트 DB의 생성·출처·런타임 추출 안내 |

세부 DB: [포켓몬도감](개발용_포켓몬도감.md) · [지역별 출현표](개발용_지역별출현표.md) · [진화 DB](개발용_진화데이터베이스.md) · [체육관 DB](개발용_체육관데이터베이스.md) · [아이템 DB](개발용_아이템데이터베이스.md) · [기술 DB](개발용_기술데이터베이스.md) · [퀘스트 DB](개발용_퀘스트데이터베이스.md)

설계 DB 전체는 기획 자료다. 현재 반영량은 WORLD_DATA_STANDARDS와 해당 코드로 확인한다. DEVELOPMENT 85절·STORY 61절은 당시 설계 대조 기록이며 이후 도시 구현과 최신 인계를 우선한다.

## 구현·검증과 운영 기록

최신 정책 정리와 문서 대조 결과는 [지방·도시 단위 문서 정리 기록](autonomy/city-policy-docs-20260909.md)을 따른다. 과거 보고 해석은 [이력 폴더 안내](autonomy/README.md)에 둔다.

공통 데이터·지도 문서의 2026-09-09 대조 범위와 검증은 [공통 문서 검토 기록](autonomy/shared-world-docs-20260909.md)에 둔다. 현재 게임 재개 위치는 CONTINUE_STATE를 유지한다.

| 문서·폴더 | 역할 |
| --- | --- |
| [JOURNEY_IMPLEMENTATION.md](JOURNEY_IMPLEMENTATION.md) | 최신 모험 확장의 자동 검사·직접 브라우저 증거·미검증 항목 |
| [PROJECT_STATE.md](PROJECT_STATE.md) | 현재 자율 작업 배정과 인계 상태. 구현 사양 문서가 아님 |
| [AUTONOMOUS_WORKFLOW.md](AUTONOMOUS_WORKFLOW.md) | 자율 운영 절차 |
| [autonomy/](autonomy/) | 회차별 변경·검증 이력. 최신 계약보다 우선하지 않음 |

## 상태 읽는 법

- `현재 구현`: 소스에 연결되어 현재 저장·플레이에서 사용한다.
- `부분 반영`: 설계 중 명시된 일부 ID·수치·흐름만 구현했다.
- `사용자 확정·런타임 미반영`: 방향은 확정됐지만 코드·대사·플래그로 실행되지 않는다.
- `설계 제안·미구현`: 검토 또는 제작 후보이며 승인·구현 사실이 아니다.
- `이력`: 당시 결과를 보존한 기록이며 현재 수량·기능 판단에는 최신 기준 문서를 우선한다.

설계 데이터 변경 순서는 `docs/design-data/nexus-plan.json` → `python -X utf8 scripts/design/build_databases.py` → 필요한 범위만 `python -X utf8 scripts/design/export-runtime-pokemon.py`다. 생성 문서나 결과 JSON만 직접 고쳐 런타임 구현으로 표시하지 않는다.
