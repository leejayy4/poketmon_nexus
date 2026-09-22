# 과거 기록과 문서 정리 결과

이 폴더는 **과거 구현·실패·검증·결정의 근거**다. 당시의 최신·다음 작업·담당·QA 재개는 현재 지시가 아니다. 현행 입구는 [문서 안내](../README.md), 현재 사실은 [PROJECT_STATE](../PROJECT_STATE.md)다.

## 통합 기록

| 문서 | 보존 내용 |
| --- | --- |
| [공통 시스템·초기 검증](SYSTEM_HISTORY.md) | 공통 전투·저장·입력·초기 여정·화면·개발 지도와 검사 근거 |
| [신오](SINNOH_HISTORY.md) | 시작권역·도로·동굴·영원·무쇠 등 구현/실패/검증 기록 |
| [관동](KANTO_HISTORY.md) | 도시·도로·홍련·상록숲 등 구현/검증 기록 |
| [성도](JOHTO_HISTORY.md) | 금빛·검은먹·무궁·도로/동굴 등 구현/검증 기록 |
| [하나](UNOVA_HISTORY.md) | 구름·설화·습지·도로 등 구현/검증 기록 |
| [문서·설계 결정](DECISION_HISTORY.md) | 중복 문서/운영 보고의 고유 결정과 검증 한계를 요약 |

구현/검증 보고 114개의 본문은 앞의 다섯 파일에 통합했다. 문서·운영 중심 보고 12개는 결정 이력으로 요약했다. 각 절에 원래 파일 경로와 안정된 앵커를 남겼고 기존 링크를 해당 절로 옮겼다. 과거 자연 진행·준비 저장·미실행·실패의 차이를 보존했다.

## 남겨 둔 이전 대장

전부를 다시 보관하는 대신, 회차 보고만으로 복구하기 어려운 고유 계약·좌표·미검증 이력이 있는 아래 7개만 유지한다.

| 보관본 | 남기는 이유 |
| --- | --- |
| [CONTINUE_STATE](2026-09-22-rebaseline/CONTINUE_STATE.md) | 누적 도시 인계·당시 배정·실패·재개 위치 |
| [DEVELOPMENT](2026-09-22-rebaseline/DEVELOPMENT.md) | 도시별 세부 실행 계약·좌표·이행·검증 경계 |
| [STORY](2026-09-22-rebaseline/STORY.md) | 구 사건 플래그·행동·보상·구현 이력 |
| [MAP_STORY_DESIGN](2026-09-22-rebaseline/MAP_STORY_DESIGN.md) | 지역별 사건/공간 대응의 이전 명세 |
| [NEXUS_STORY_MASTER](2026-09-22-rebaseline/NEXUS_STORY_MASTER.md) | 구 CH/SQ/PG 판본과 새 원고 사이의 설계 출처. 현행 정사 아님 |
| [FIRST_BADGE_SLICE](2026-09-22-rebaseline/FIRST_BADGE_SLICE.md) | 이전 종·경로의 자연 성장/첫 배지 수용과 한계 |
| [JOURNEY_IMPLEMENTATION](2026-09-22-rebaseline/JOURNEY_IMPLEMENTATION.md) | 초기 연속 여행·준비 저장·검사 근거 |

이전 대장을 새 제작의 입력으로 모두 읽지 않는다. 특정 예전 구현·저장·검증 근거가 필요할 때만 해당 절을 찾는다.

## 실제로 삭제한 중복 문서

사용자의 2026-09-22 “필요없는 문서 지우고 구조 정리” 요청에 따라 단순 보관 이동에서 실제 정리로 전환했다.

| 삭제 범위 | 통합/대체 위치 |
| --- | --- |
| autonomy의 개별 회차 문서와 색인 | 위 지방/공통/결정 통합 기록 |
| review-pending의 초기 회차49개·설계검토·색인·별도 AGENTS·이동 대장 | 구현/검증은 통합 기록, 채택 경위는 DECISION_HISTORY. 검토 대기 폴더 종료 |
| 재정립 사본의 AGENTS·AUTONOMOUS_WORKFLOW·repository-README·README.pre-rebaseline | 현행 작업 규칙과 문서 입구 |
| 재정립 사본의 NEXUS_GOAL·PROJECT_STATE·STORY_AXIS_ROADMAP | 현행 비전/상태/로드맵, 필요한 옛 배정은 남긴 CONTINUE_STATE |
| 재정립 사본의 GORYEO_STORY_COMPLETE·RUNTIME_DATABASE·WORLD_DATA_STANDARDS·REGIONAL_IMPLEMENTATION_DIRECTIVES | 채택 고려 원고·통합 데이터 계약·제작 계약·참고 기준 |
| reference/GITHUB_PROJECT_COMPARISON.md | 참고군과 고유 조회 범위는 REFERENCE_RESEARCH. 옛 stars·낡은 구현 수량·QA 재개 문구 폐기 |
| reference/REGION_ATLAS.md | 실제 지도 계약은 WORLD_ROUTES, 당시 검사 내용은 SYSTEM_HISTORY |
| reference/rebaseline-diagnosis-20260922.txt | 이미 반영한 재정립 결정은 NEXUS_GOAL. 대화 복사본 중복 제거 |

서사 6개는 docs/story, 지방 설계 4개는 docs/regions로 모았다. 코드·데이터·자산·생성기 입력은 문서 정리 대상으로 삭제하지 않았다.
생성기가 사용하는 두 호환 안내·개발용_*.md·WORLD_TOUR 경로는 유지했다.

## 검증 범위

docs의 Markdown을 188개에서 53개로 정리했다. 문서 내부 링크·앵커 1,610건과 diff 공백을 확인했다. 채택 서사 6개의 본문은 링크 경로 외에 보존했다. 비문서 파일 1,716개 중 정리 대상인 이동 대장 JSON·진단 대화 TXT 2개만 삭제했고, 나머지 1,714개는 해시가 일치했다. 게임 테스트·타입검사·빌드·브라우저·실제 저장·시청각 QA는 실행하지 않았다.
