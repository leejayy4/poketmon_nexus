# 봉신 전승가옥 동료 귀환 휴식 — 2026-09-15

- 변경: `src/sinnoh-celestic-life.ts`의 기존 `tour_celestic_home`·`tourCelesticFamilyRest`에 실제 파티 동료 선택, 저장되는 휴식 기록, 재방문 반응을 연결했다. 건강한 현재 파티 동료만 함께 앉을 수 있고, 기절 또는 미편성 상태에서는 기존 봉신 포켓몬센터로 안내한다. 휴식은 HP·경험치·아이템·통행 조건을 바꾸지 않는다.
- 여행 연결: 210번도로 북부에서 만난 동료를 선택하면 안개 숲의 잎 냄새와 계절 기록으로 반응한다. 다른 동료도 함께 쉴 수 있으며 산길 가족 기록으로 남긴다. 행동 뒤 기존 210번도로 북부 여행자 또는 211번도로·천관산 옛 지도로 이어져 `산길 활동/포획 → 봉신 귀환 → 주민과 동료 휴식 → 다음 여행`이 끊기지 않는다. 저장 플래그는 휴식한 종과 210 북부 출신 여부를 기록하며 같은 종의 개체 동일성을 추정하지 않는다.
- 원작 자료: https://bulbapedia.bulbagarden.net/wiki/Celestic_Town (2026-09-15 직접 열람, Pokémon Platinum/Generation IV). 봉신마을이 신오의 역사와 옛 생활방식을 보존하는 작은 마을이고 서쪽 211번도로·동쪽 210번도로에 연결되며, 난천 가족의 집과 중앙 봉신 유적이 있다는 사실을 확인했다. https://www.serebii.net/pokearth/sinnoh/4th/route210.shtml (2026-09-15 직접 열람, Pokémon Platinum/Generation IV)에서 210번도로의 북부 안개 산길과 장소별 야생·트레이너 구성을 대조했다.
- 원작과의 차이: 전승가옥의 동료 방석, 산길 귀환 휴식, 계절 기록은 포켓몬 넥서스의 생활 장면이다. 원작 난천 가족의 사진·도감 등록, 갤럭시단/태홍 전투, 오래된부적, 파도타기 보상, 친밀도 일일 보상은 열지 않았다. 원작 지도·대사·외부 코드와 자산을 복제하지 않았다.
- 적용 위치: MapId `tour_celestic_home`, 이벤트 `tourHost` / `tourCelesticFamilyRest`; 기존 목적지 `tour_sinnoh_route_210_north:route210NorthWalker`, `tour_celestic_home:tourCelesticFamilyMap`, `tour_celestic_center:tourHost`. 기존 방석 가구와 전용 painter를 그대로 소비하므로 공통 renderer·engine·map 등록 변경이나 중앙 연결은 필요 없다.
- 검증 상태: 코드 반영·미검증. QA 중단 지침에 따라 테스트·타입 검사·빌드·브라우저·저장 복원·시각·음향 검증을 실행하지 않았다. 봉신마을 또는 신오 도시 완료 판정이 아니다.
