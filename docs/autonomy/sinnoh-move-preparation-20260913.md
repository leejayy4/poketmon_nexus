# 봉신 포획 동료의 기술 준비 연결 — 2026-09-13

- 변경: `src/sinnoh-celestic-life.ts`의 센터 여행 지도에서 파티 동료를 선택하여 기존 `showMoveSchool`을 연다. 실제 허용 기술 비교·빈 칸 학습·교체·저장은 공통 `move-school.ts`→`teachMove` 계약을 그대로 소비한다. 공통 코드·데이터 JSON은 수정하지 않았다.
- 플레이 연결: 210 북부에서 포획 → 봉신센터 회복/PC 편성 → 센터 지도에서 동료 선택/기술 변경 → 기존 210 북부 선택 트레이너. 승리 플래그가 이미 있으면 같은 지도에서 210 남부 출발을 안내한다. 기술 준비와 특정 포획은 통행 조건이 아니며 보상/경험치를 새로 지급하지 않는다. 파티 4~6번째도 다음 페이지에서 선택한다.
- 채택 설계 대조: NEXUS_STORY_MASTER의 성장 공급 표 중 신규 동료 사용/기술 준비 위치를 적용했다. 현재 봉신 생활 활동을 CH08/09 본편 해결로 승격하지 않는다. 이번 기능은 준비 행동이며 팀 아크 사건 구현이 아니다.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Celestic_Town , 2026-09-13 직접 열람. Platinum Pokémon Center 절에서 센터의 트레이너 도전을 확인했다. 본 구현은 원작 일일 센터 트레이너나 전용 기술 전수를 복제하지 않고 기존 북부 선택전과 프로젝트 공통 학습 기능을 연결한다. 외부 코드/자산 재사용 없음.
- 소비 위치: `tour_celestic_center` / `tourCelesticCenterGuide` → 동료 선택 → 공통 showMoveSchool → 기존 기술 저장. 다음 목적지는 `route210NorthTrainer` 또는 `route210SouthSign`. 기존 길 안내이며 순간이동 아님.
- 관련 기준: [REFERENCE_RESEARCH](../REFERENCE_RESEARCH.md)의 봉신 시설 조사, [WORLD_ROUTES](../WORLD_ROUTES.md)의 봉신↔210 북부↔210 남부, [MAP_STORY_DESIGN](../MAP_STORY_DESIGN.md)의 준비→동료 행동→귀환 기준.
- 검증: 모든 QA 중단 유지. 테스트·빌드·브라우저·저장·음향 미실행. 기술 변경 후 실제 선택전 사용과 저장 복원은 미검증이다.
- 남은 도시 요구: 전체 자연 이동/포획/회복/기술 사용/선택전/귀환 연결의 실행 확인, 실내 깊이와 협곡 표현 확인, 채택 본편의 도시별 구체 장면 적용은 남아 있다. 이번 묶음은 종료한다.
