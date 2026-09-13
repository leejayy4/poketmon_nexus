# 211 여행 중 천관산 서쪽 선택 서식지 — 2026-09-13

- 변경: 천관산 통과층의 기존 서쪽 선택길 `(18,20) 2×2`에 조우 terrain을 추가했다. 동쪽 기존 `(37,28) 2×4`는 유지한다. 지층 조사 좌표·동서 직선 본선·워프·기존 보행칸은 변경하지 않았다. 이정표는 양쪽 선택 암반길을 안내한다.
- 소비: `sinnoh-celestic-route.ts`의 terrain → 기존 이동 조우 판정 → `runtime-encounters.ts`의 `tour_coronet_211_pass`/`S-CORONET-211`. 기존 지역 painter는 terrain 칸을 덮지 않고 공통 조우 지형 표현에 맡긴다. 새 풀·JSON·엔진 복제 없음.
- 현재 풀: 지원된 주뱃/알통몬/꼬마돌/요가랑, 프로젝트 Lv16~18, 가중치10/20/40/30. 포획 후 봉신 회복·기술 준비 및 기존211 동부 선택전으로 이어갈 수 있다. 관찰/포획/배틀을 통행 잠금으로 쓰지 않는다.
- 원작 자료: https://www.serebii.net/pokearth/sinnoh/4th/route211.shtml 및 https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_211 를2026-09-13 직접 열람. Pt 트레이너표의 서부 꼬마돌/롱스톤과 동부 요가랑 등 산길 도전 구성을 확인했다. 현재 선택전 편성/레벨은 그 표의 복제가 아니다.
- 기존 풀 출처 대조: https://bulbapedia.bulbagarden.net/wiki/Mount_Coronet#Northern_1F_room_1_(Eterna_City_-_Celestic_Town_side) . 현재 실행 JSON이 가리키는 Pt 북부1층 풀을 재사용한다. 새 암반 좌표와 일부 선택길만 조우하는 방식은 프로젝트 재구성이다. Serebii `/mtcoronet.shtml` 접근은 실패했으므로 근거로 사용하지 않는다. 외부 코드/자산 재사용 없음.
- 중앙 후속 요구: 211서부/동부 MapId에는 아직 MAP_POOLS 연결이 없다. 야외 풀밭 확장에는 각 도로의 Pt 낮 출현종/레벨을 따로 확정하여 지역별 풀 노드와 두 MapId 바인딩을 중앙에서 연결해야 한다. 동굴 풀을 야외 도로에 임의 재사용하지 않았다.
- 상태: 코드 반영·미검증. 모든 QA 중단으로 테스트/타입/빌드/브라우저/저장/시청각 확인 없음. 원작 전체 재현·도시 완료 아님. 야외211 만남, 전체 자연 여행과 새 조우의 시각/전투 확인은 남아 있다. 이번 묶음 종료.
