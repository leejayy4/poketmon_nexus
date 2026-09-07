# auto-0003-map — 리조트데저트 유적 암반과 북남 연결길

- 회차: `auto-0003-map`
- 담당: Map & Content Designer
- 일자: 2026-09-07
- 상태: 배치 데이터 구현·전용 테스트 추가·빌드 및 회귀 통과 완료
- 범위: `src/explore-layouts.ts`에 하나 지방 `tour_desert`(리조트데저트) 레이아웃 추가, `TOWN_REVISION=22` 보정 및 검증.

## 문제와 근거

- **기존 문제**: 5대 단기 이동 경로(`SHORT_TOURS`) 중 영원숲, 천관산, 상록숲, 너도밤나무숲 4곳은 이미 고유 지형과 조사 구역이 배치되었으나, 하나 지방의 **리조트데저트(`tour_desert`)**만 고유 레이아웃(`TOUR_LAYOUTS`)이 없어 단순한 2x2 임시 블록만 배치되어 있었음.
- **해결**:
  - 유적 기둥 `(3,8,3,3)`, 모래 언덕 `(4,12,4,2)`, 외곽 석벽 `(14,6,3,3)`의 3개 고유 유적 조사 사물 배치.
  - 북쪽 뇌문시티 출구 `(10,2)`와 남쪽 구름시티 출구 `(10,16)`를 자연스럽게 잇고, 길 안내원 `(12,7)` 및 표지판에 안전하게 접근하는 경로(`paths`) 구성.
  - 저장 `TOWN_REVISION=22`로 이전 개정 세이브에서 새 장애물에 서 있던 플레이어 위치를 `(10,10)`으로 자동 안전 복구.

## 수정 파일

- `src/explore-layouts.ts`: `tour_desert` 레이아웃 데이터 추가.
- `src/town.ts`: `TOWN_REVISION`을 21에서 22로 상향.
- `tests/explore-layouts.test.ts`: 레이아웃 총 11개, 조사 명칭 33개, 야외 사물 104개로 기대값 갱신.
- `tests/desert-layout.test.ts`: [신규] 북남 출구 연결, 사물 접근성, 세이브 마이그레이션 전용 테스트 추가.
- `docs/DEVELOPMENT.md`: 74절 추가.
- `docs/STORY.md`: 59절 추가.

## 검증 결과

- `npm.cmd test`: **299/299 통과** (회귀 0, 실패 0).
- `npm.cmd run build`: Vite & TypeScript 프로덕션 빌드 성공.
- 다음 담당: **Art Director** (`auto-0004-art`)
