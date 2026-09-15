# 신오 봉신마을 후속 구현 — 2026-09-15

## 봉신 유적 전승 문양 모사

- 출처·버전: [Serebii Pokéarth 봉신마을](https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml), [Bulbapedia Platinum 공략 Section 11](https://bulbapedia.bulbagarden.net/wiki/Appendix:Platinum_walkthrough/Section_11), [Bulbagarden DPPt 지도 목록](https://archives.bulbagarden.net/wiki/Category:Diamond,_Pearl,_and_Platinum_maps). 2026-09-15 확인, Pokémon Platinum 기준.
- 원작 사실: 봉신마을은 210번도로 동쪽·211번도로 서쪽 사이의 오래된 마을이며 중앙 유적의 벽화가 신오 창조 전승을 나타낸다. Pt 본편에서는 오래된부적 전달, 갤럭시단 조무래기와 태홍 전투, 파도타기 전달이 이어진다. 지도 목록에는 `Celestic Town Pt.png`, `Celestic Ruins Pt.png`가 별도 장소로 등록되어 있다.
- 프로젝트 적용: 기존 `tour_coronet_211_pass`의 밝은/짙은 지층을 같은 건강한 동료와 모두 기록한 뒤 `tour_celestic_ruins`의 `tourCelesticRuinsTrace` 모사대에서 순서를 맞춘다. 완료 상태 `celesticRuinsTraceCompleted`를 저장하고 벽화 재관람, 봉신센터 회복·PC, 210번도로 북부 출발로 이어진다.
- 원작과의 차이: 프로젝트 선택 조사이며 오래된부적·갤럭시단·태홍·파도타기·전설 획득을 시작하거나 대신하지 않는다. 아이템·경험치·통행 잠금도 없다.
- 적용 코드: `src/sinnoh-celestic-trace.ts`, `src/sinnoh-celestic-route.ts`, `src/sinnoh-celestic-life.ts`, `src/explore-world.ts`. 기존 공통 저장·목적지·회복·PC를 소비한다.
- 시각 적용: renderer의 캐시 바탕 뒤 world 좌표에서 `paintCelesticTrace`를 호출한다. 등록된 모사대 footprint 안에서 미완료 종이의 기록선과 완료 후 세 문양·서동 지층선을 구분하며 통행·NPC·워프를 덮지 않는다.
- 검증: 코드 반영. QA 중단에 따라 테스트·빌드·브라우저 보행·화면·저장 재접속·음향 검증은 미실행이며 봉신마을 완료 판정이 아니다.

## 모사 결과의 유적·생활 반응 연결

- 개별 지도 대조: [Celestic Town Pt.png](https://archives.bulbagarden.net/wiki/File%3ACelestic_Town_Pt.png) 512×468, [Celestic Ruins Pt.png](https://archives.bulbagarden.net/wiki/File%3ACelestic_Ruins_Pt.png) 281×282를 2026-09-15 직접 열람했다. 둘은 Pokémon Platinum의 서로 다른 장소 이미지이며, 프로젝트도 `tour_celestic` 외부와 단일 출입구를 가진 `tour_celestic_ruins` 실내로 분리한다.
- 구현: `celesticRuinsTraceCompleted`와 현장 동료 종을 프레스코·전승 기록이 함께 소비한다. 모사 전에는 천관산 양쪽 지층 또는 모사대를 안내하고, 완료 후에는 밝은 균열→짙은 물자국 순서와 동료 이름을 남긴다. 기록에서 완성 모사지 재관람 또는 `tour_celestic_home/tourCelesticFamilyRest` 귀환을 선택할 수 있다.
- 경계: Pt 유적의 본편 전투·오래된부적·파도타기·전설 사건은 열지 않는다. 지도 이미지를 자산이나 타일로 복제하지 않았고 장소 분리와 단일 출입 구조의 대조에만 사용했다.
- 상태: 코드·문서 반영, 모든 QA 미실행. 유적·봉신마을 완료 근거가 아니다.

## 현지 동료의 실제 산길 실전·성장 근거

- 구현: 봉신센터 기술 준비에서 선택한 210 북부·211 서부·211 동부·천관산 출신의 실제 파티 객체, 출발 레벨, 대상 선택전을 저장한다. 공통 전투가 누적한 `defeatedOpponentParticipants`와 최종 승리를 함께 확인해 그 개체가 적어도 한 상대 격파에 참가한 경우에만 `celesticRouteBattlePartnerWon`을 기록한다.
- 재진입: 선택전의 과거 승리 기록만 있고 현지 동료 참여 기록이 없으면 상금 0원의 재확인전을 허용한다. 완료 뒤 트레이너 재대화는 출발→현재 레벨·HP, 현지 보유 동료, 파티 부상·기절, 천관산 또는 봉신센터 귀환을 표시한다. 다른 동종을 이전 개체로 대신하지 않는다.
- 소비: `src/sinnoh-celestic-battle.ts` → `engine.actBattle`; `field-partner-party.ts`가 미완료 선택 개체의 파티 이동·진화를 추적; `sinnoh-celestic-life.ts`가 준비; `road-trainers.ts`가 재확인전과 결과를 소비한다. 전투 피해·경험치·상금 계산은 기존 공통 시스템을 유지한다.
- 원작/프로젝트: 앞 절의 Pt 210·211번도로 및 봉신 자료를 여행 배경으로 사용한다. 이 참여 기록과 재확인전은 넥서스의 포획→성장→실전→귀환 연결이며 원작 트레이너 파티·스토리 사건 재현이 아니다.
- 검증: QA 중단. 타입 검사·빌드·브라우저·실제 포획/전투/진화·PC 교체·저장 복원은 미실행이며 도시 완료 근거가 아니다.
