# 공개 포켓몬 프로젝트 조사·비교

> **현행 적용 정정:** [지방별 실행 지시](REGIONAL_IMPLEMENTATION_DIRECTIVES.md)가 사용자 승인된 후속 기준이다. 현재 BW·BW2풍/QA 재개이며 공통 카탈로그가 연결됐다. 아래402맵·53종 등의 수치와 QA 중단·문서만 반영 문장은 이전 조사 시점의 이력이다. 최신 코드 조회는568맵·57종·소유50종·31풀·53기술·진화5개이며 완성도 수치가 아니다.

조사·반영일: 2026-09-12. 사용자 요청에 따른 GitHub 조사와 현재 프로젝트 비교 기록이다. 외부 저장소의 README·기능 설명·일부 설정 소스와 로컬 코드/문서를 읽었다. 외부 게임 설치·실행·전체 소스 감사는 하지 않았다. 모든 QA 중단을 유지하며 이 문서는 구현 완료나 신규 기능 일괄 승인을 뜻하지 않는다.

## 1. 비교 대상과 인기 지표

별 수는 조사 당시 GitHub 웹 표시의 근삿값으로, 전체 인기 순위나 실제 이용자 수가 아니다. 검색 인덱스와 본문 조회 시점의 차이도 있다. 게임·제작 기반·원작 복원·범용 엔진을 구분한다.

| 저장소·출처 | 당시 stars | 성격·확인 내용 | 프로젝트에 참고할 부분·한계 |
| --- | ---: | --- | --- |
| [smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown) | 약 5.9k | 전투 시뮬레이터. README상 1~9세대 싱글·더블·트리플 지원, 시뮬레이터와 서버·클라이언트 문서 분리 | 전투 효과·행동 순서·데이터/판정/표시 분리. 도시·스토리 RPG 엔진은 아님 |
| [pret/pokeemerald](https://github.com/pret/pokeemerald) | 약 3.5k | 에메랄드 역컴파일. 원작 ROM 재구성 프로젝트 | 원작 필드·맵 이벤트 구조의 후속 조사 대상. 웹 엔진에 직접 장착하는 라이브러리가 아님 |
| [SheerSt/pokewilds](https://github.com/SheerSt/pokewilds) | 약 2.9k | libGDX/Java 기반 2세대풍 게임·엔진. README상 Alpha, 절차 생성 바이옴·탐험 거리별 야생 레벨·필드 기술 | 포켓몬과 환경 상호작용, 탐험의 목적. 정해진 도시·배지 서사의 직접 대체재는 아님. 멀티플레이 등 예정 기능을 구현으로 계산하지 않음 |
| [RSamaium/RPG-JS](https://github.com/RSamaium/RPG-JS) | 약 1.7k | TypeScript 브라우저 RPG/MMORPG 프레임워크. 맵·NPC·이벤트·저장과 Tiled 연계 설명 | 같은 웹 기술권의 콘텐츠 제작 구조. 포켓몬 게임은 아니며 현재 Canvas 엔진 교체를 권고한 것이 아님 |
| [rh-hideout/pokeemerald-expansion](https://github.com/rh-hideout/pokeemerald-expansion) | 약 825 | 에메랄드 기반 GBA ROM 핵 제작 기반. README는 독립 완성 게임이 아니라고 명시 | 전투·육성·편의 기능의 분류와 확장 범위 참고. C/GBA 코드의 직접 이식 비용은 별도 검토 |
| [pret/pokeplatinum](https://github.com/pret/pokeplatinum) | 약 530 | 플라티나 역컴파일. README상 WIP | 기존 DP/Pt 지리·자산·DS 동작의 원작 참고. 현재 BW·BW2 시각 목표를 대신하지 않음 |
| [Maruno17/pokemon-essentials](https://github.com/Maruno17/pokemon-essentials) | 약 370, forks 약 700 | RPG Maker XP용 팬게임 기반. 저장소 자체는 완전한 프로젝트가 아니며 그래픽·음향 등 일부 파일 제외 | 조우·기술·전투 설정과 팬게임 제작 데이터 구조. Ruby/RMXP 의존성이 있어 TypeScript에 즉시 통합할 수 없음 |

추가 원문: [Essentials 필드 설정](https://github.com/Maruno17/pokemon-essentials/blob/master/Data/Scripts/001_Settings.rb), [전투 설정](https://github.com/Maruno17/pokemon-essentials/blob/master/Data/Scripts/002_BattleSettings.rb), [Showdown 구조 문서](https://github.com/smogon/pokemon-showdown/blob/master/ARCHITECTURE.md). 앞의 두 설정 파일은 조사에서 확인했고, 구조 문서는 후속 상세 조사 진입점이다.

## 2. 로컬 대조와 한계

조사 시점의 package.json은 TypeScript·Vite 기반이고 렌더링은 자체 Canvas 2D다. 당시 runtime-pokemon-data.json을 읽은 수치는 등록53종·소유46종·조우19풀·기술53개·진화5개였다. 이는 갱신되는 작업 트리의 읽기 스냅샷이며 실행 확인 수치가 아니다. 맵 약402개는 당시 MAP_SIZE_STANDARDS의 기존 조회 기록을 인용했으며 이번에 활성 맵 전체를 실행 집계하지 않았다. 현재 값은 [공통 데이터 기준](WORLD_DATA_STANDARDS.md)과 코드, [맵 크기 대장](MAP_SIZE_STANDARDS.md)에서 확인한다.

당시 types.ts·battle.ts·growth.ts에서 단순 개체 구조, 제한된 피해식, 성장 상한 Lv.25를 확인했다. 공통 데이터 문서는 PP·명중·급소·속도 기반 행동 순서·전체 상태이상을 미구현으로 구분했다. 이 기록을 후속 구현 이후에도 현재 한계로 반복 인용하지 않는다.

현재 코드/인계에는 네 지방 이동·도시별 생활·포획 출처·선택 트레이너·일부 본편 연결이 존재한다. QA 중단 이후 적용 내용은 미검증이며 외부 프로젝트와 품질 점수나 완주 시간을 비교할 증거는 없다.

## 3. 비교에서 도출한 보완 후보

아래는 조사자의 설계 제안이다. 현재 담당 도시와 승인 범위에 필요한 부분만 선정하며 자동으로 전체 과제나 새 시스템 의무가 되지 않는다.

| 영역 | 현재 구조에서 보이는 과제 | 참고 방향 | 도시 작업에 적용하는 방법 |
| --- | --- | --- | --- |
| 맵·스토리 밀도 | 많은 장소에 비해 플레이 선택·성장·사건 결과가 제한될 수 있음 | Essentials의 제작 구조, 원작 맵/이벤트 자료 | 진입 이유→현지 동료/실전→사건 행동→결과→출발을 한 도시 안에서 연결. 대사와 방문 기록만으로 사건을 대체하지 않음 |
| 전투·육성 | 단순 피해식·낮은 성장 상한·지원 효과/진화 제한 | Showdown의 전투 규칙, expansion의 기능 분류 | 도시 경험에 필요한 종별 능력치·물리/특수→속도/우선도→PP/명중→상태이상 등을 단계적으로 검토. 기존 팀·회복·경제와 함께 조정 |
| 콘텐츠 제작 | 도시별 이벤트 분기가 늘면서 여러 코드 파일을 수정해야 함 | Essentials·RPG-JS의 데이터/이벤트 구성 | 반복되는 조우표·트레이너 팀·상점·조건/결과부터 데이터로 분리. 대규모 범용 엔진 재작성은 피함 |
| 포켓몬 생태 | 주민이 포획 출처를 읽는 반응이 실제 선택·행동으로 이어질 여지 | PokeWilds의 바이옴과 필드 상호작용 | 현지 종의 생태와 활동을 연결. 수변 관찰·숲 탐색 같은 후보를 검토하되 필수 포획·새 통행 잠금을 임의 도입하지 않음 |
| 공간·연출 | 확대된 장소의 반복 바닥·시설과 화면별 특징을 점검할 필요 | 기존 DS 원작 자료와 현재 시각 기준 | 대장의 목표 크기를 유지하며 랜드마크·굴곡·높이 표현·발견 지점으로 공간을 채움. 맵 개수/면적만으로 완성도를 계산하지 않음 |

## 4. 적용 경계와 후속 참고 순서

- 현재 담당 도시의 맵·스토리 적용을 먼저 진행하고, 필요한 제작 구조는 Essentials/RPG-JS, 생태 활동은 PokeWilds, 전투 효과는 Showdown/expansion에서 목적에 맞게 조사한다. 모든 저장소를 매 회차 읽지 않는다.
- 직전 구두 비교는 DP/플라티나풍을 기준으로 설명했다. 현재 문서에는 [BW·BW2 시각 목표](VISUAL_STYLE_BW_BW2.md)가 기록되어 있으므로 pokeplatinum은 기존 DS 구현·신오 원작 참고로 한정한다. 이 비교 문서가 시각 목표를 새로 결정하거나 되돌리지 않는다.
- 스토리 적용 여부는 [넥서스 통합 서사](NEXUS_STORY_MASTER.md), 실제 플래그는 [STORY](STORY.md), 도시별 요구는 [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md)을 따른다. 이전 답변의 '라이벌·조직 미확정' 일반론으로 이후 채택된 설계를 취소하지 않는다.
- 엔진 교체·의존성 추가·소스/자산 복사는 이번 조사에 포함하지 않는다. 실제 재사용 단계에서는 대상 파일의 라이선스·출처·버전과 이식 범위를 확인한다. 공개 저장소라는 사실만으로 모든 자산의 재사용 조건이 같다고 보지 않는다.
- 문서 반영만 수행했다. 게임 코드·데이터·저장·작업 배정·자동화와 기존 도시 인계는 변경하지 않으며, 모든 QA 중단을 유지한다.
