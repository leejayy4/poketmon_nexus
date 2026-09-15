# 구름 전시·공개 원본 대조 단계 — 2026-09-13

## 적용 근거

- 확인일2026-09-13, BW2: https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Studio_Castelia — 원작 아틀리에구름은 젊은 작가의 작품 전시 공간이다. 항만 사업 전시·성도 기록 대조는 원작 사건이 아닌 채택된 NEXUS_STORY_MASTER CH06 각색이다.
- 같은 날 https://www.serebii.net/pokearth/unova/casteliacity.shtml 개별 장소 페이지를 열었다. 원작 갤러리/항구의 도시 생활을 구조 참고로 삼으며 외부 코드나 자산을 복사하지 않았다. 이번 회차 지도 이미지 대조·실행 검증은 하지 않았다.
- `src/ecruteak-disclosure.ts`와 성도 인계에서 `nexusEcruteakOriginalsPublic` 의미를 읽었다. 서명본과 주민 원본을 인주 공개대에 함께 펼친 결과다. 원본 소지·하나 운송·성도 전체 완료가 아니다. 구름 대사도 원본은 인주에 남고 직접 읽은 항목을 대조한다고 명시한다.

## 코드와 플레이 단계

- `src/castelia-original-comparison.ts`: `casteliaComparisonReady(save)`는 공개 원본 플래그와 자유답사 Cargo/Worker/RestMat/Alley를 모두 요구한다. 준비 전에는 기존 자유답사를 그대로 사용한다.
- `castelia-field-intro.ts`의 기존 전시 조사물 `tourCasteliaProjectExhibit` 선택지에서 비교를 시작한다. 운송의 이익과 쉬는 자리 두 항목을 선택하면 현장으로 안내한다. 평균으로 성급히 결론내는 선택은 진행을 기록하지 않는다.
- `castelia-gallery.ts` 첫머리의 `handleCasteliaOriginalWitness`가 기존 실제 `tourResident0` 직장인→`tourResident1` 주민 대화를 소비한다. 답사 기록만으로 새 증언을 자동 완료하지 않는다. 새 증언 이후 전시로 돌아와 두 말을 구분해 보존한다.
- 신규 플래그 순서: `nexusCasteliaComparisonOpened` → `nexusCasteliaWorkerCompared` → `nexusCasteliaResidentCompared` → `nexusCasteliaComparisonPreserved`. 마지막은 구름의 제한 비교 기록이며 CH06/CH05 완료가 아니다.
- 상태 확정은 결과 대화 종료 후다. 저장객체·플레이어객체·맵·좌표·대화 세션·선행조건을 재확인하고 최초 결과만 persist한다. 기존 원본/자유답사 상태·소지품·종 데이터·교통 잠금은 변경하지 않는다.
- 보존 후 기존 `tour_unova_route_04`를 목적지로 설정한다. 실제 구름 북쪽4번도로→뇌문 여행이며 뇌문 철도 증언이나 본편 공개가 이미 구현됐다고 안내하지 않는다.
- 중앙이 adventure-guide 연결을 회신했다. ready이면 시작 전 전시, opened 뒤 직장인→주민→전시에서 보존, preserved 뒤4번도로를 자유답사 안내보다 우선한다. 하수도/공원에서는 기존 탐험 안내를 유지한다. 지역 담당은 공유 engine/renderer/catalog를 수정하지 않았다.

## 검증과 다음 범위

모든 테스트·빌드·브라우저·시청각·저장 QA 미실행. 지역 호출 연결을 읽고 중앙 길안내 반영을 회신받은 상태이며 도시 완료가 아니다. 다음 범위는 뇌문/물풍경 후속 현장 계약이다. 이번 구름 대조만으로 본편 전체 공개·성도복구·원본 운송을 완료 처리하지 않는다.

## 중앙 전시 상태 표현
비교를 시작하면 기존 전시 가구에 두 장의 구름 현장 기록을 표시한다. 직장인/주민 대조 단계가 끝날 때 각 기록에 글줄이 채워지고, 함께 보존하면 묶음 표시가 생긴다. renderer가 현재 저장 플래그를 매 프레임 전달하므로 정적 배경 캐시에 완료 그림을 굳히지 않는다. 인주 원본 이동을 뜻하지 않으며 새 충돌/보상/진행 상태는 없다. 시각 QA 미실행.
