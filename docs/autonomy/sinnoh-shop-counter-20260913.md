# 봉신 민가 상점 판매대 등록 누락 보수 — 2026-09-13

- 변경: `src/sinnoh-celestic-route.ts`, `src/sinnoh-celestic-interior-art.ts`.
- 원인: 상점 reception은 충돌/판매 props를 만들지만 전경 렌더러는 center에 대해서만 reception을 그린다. 봉신 상점은 일반 objects만 그려져 판매대의 실물 표현이 누락됐다.
- 수정: 기존 reception `(8,6) 8×1`을 그 좌표 그대로 전용 workbench furnishing에 등록했다. 기존 차단 칸과 판매 이벤트는 이미 생성되어 있으므로 추가 props나 충돌을 만들지 않는다. 목재 상판·보관 서랍·샘플 상자·계산 단말을 기존 가구 렌더 깊이에서 표시한다.
- 연결: 기존 비센터 `room.objects` 전경 루프→`paintTourFurnishing`→`paintCelesticFurnishing` 호출을 사용한다. 공통 renderer 변경 없이 실제 판매대 그림이 등록된다. 점원·현관·재고·거래 로직·저장·보행은 유지한다.
- 원작 신규 사실/사건이 아닌 기존 프로젝트 민가 상점의 누락 보수다. QA 중단으로 테스트·빌드·브라우저·저장/시청각 검증은 실행하지 않았다. 소스 구조 확인 및 구현·미검증 상태다.
- 남은 문제/다음 시작점: 실내 가구와 NPC 깊이 겹침은 실행 미검증이다. 다음 continue는 전용 실내/상점 표시 누락 보수를 반복하지 말고 `sinnoh-celestic-life.ts`의 실내 안내인 대사가 실제 시설 역할에 맞는지 현재 이벤트 분기를 확인하고 보수한다. 중앙 PROJECT_STATE·다른 지방 인계 미수정.
