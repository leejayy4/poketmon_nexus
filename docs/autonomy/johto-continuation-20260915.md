# 성도 황토·42번도로 이어받기 — 2026-09-15

## 얼음샛길 네 층의 실제 선택 조우 회랑

- **정확한 출처·확인일·버전:** 2026-09-15, HGSS [Bulbapedia Ice Path](https://bulbapedia.bulbagarden.net/wiki/Ice_Path), [Serebii Pokéarth](https://www.serebii.net/pokearth/johto/icepath.shtml), [HGSS Walkthrough Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12). 원작 얼음샛길은 44번도로↔검은먹의 1F/B1F/B2F/B3F 동굴이며 모든 층에 야생 동굴 조우가 있다.
- **발견한 실행 공백:** `runtime-encounters.ts`는 네 MapId를 `J-ICE-PATH`에 연결하고 주뱃22~24 풀도 존재했지만 `johto-ice-path.ts`의 네 맵 `terrain`이 모두 빈 배열이라 공통 `onFieldStep` 조우가 실제로 시작되지 않았다.
- **프로젝트 적용:** 1F `(12,23,8×3)/(43,29,4×6)`, B1F `(7,20,4×8)/(20,34,8×4)`, B2F `(7,33,4×6)/(22,17,4×9)/(35,18,4×8)`, B3F `(7,18,4×8)/(16,28,7×4)/(29,16,4×8)`을 선택 서리 조우 회랑으로 연결했다. 각 계단 사이에는 같은 기존 보행 격자 안의 비조우 암반 우회 폭을 남겨 포획·전투가 통행 조건이 되지 않는다.
- **소비와 경계:** `johto-ice-path.ts` terrain → `runtime-encounters.ts` 네 MapId → `LOCAL-J-ICE-PATH` → 공통 cave terrain renderer·야생전·포획·성장·저장. 원작 얼음돼지·루주라·딜리버드·골뱃, 층별 확률, 미끄럼·괴력·폭포·도구는 추가하지 않았다. 원본/런타임 pool 설명을 함께 고쳤으며 QA 중단으로 모든 실행 검증은 미실행이다.
- **동행 개체 보수:** 기존 `johto-ice-path-life.ts`는 `icePathCompanionSpecies`만 저장하고 파티의 같은 종 첫 개체를 찾아 활동을 이어 잘못된 대체가 가능했다. 이제 쉼터에서 실제 파티 슬롯을 함께 저장하고 `field-partner-party.ts`가 진행 중 파티 재배치·진화를 같은 객체로 추적한다. PC 보관이나 이전 저장의 슬롯 부재는 자동 대체하지 않고 44번도로 쉼터에서 명시적으로 다시 선택하며, 기절은 같은 객체의 센터 회복을 요구한다. B1F/B3F의 중단·재선택·검은먹 출구 안내를 추가했고 동굴 통행은 잠그지 않는다. QA 중단으로 재배치·PC·기절·이전 저장 재개는 미검증이다.

## 43번도로 북부 포획→성장 선택전

- **정확한 출처·버전:** 2026-09-15, HGSS [Bulbapedia 43번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_43), [Serebii Pokéarth](https://www.serebii.net/pokearth/johto/route43.shtml), [HGSS Walkthrough Section 11](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_11). 원작 서쪽 길에는 여러 트레이너와 긴 풀이 있고 야영객 태일은 모래두지18·고지18·주뱃20을 사용한다.
- **프로젝트 변경:** 현재 공통 종·기술 카탈로그가 지원하는 주뱃만 Lv.24로 축약하고 상금520원의 이름 없는 지역 야영객 선택전으로 재구성했다. 북부 피죤 풀밭 아래 `(9,43)`에 두어 현지 포획 동료가 실제 공통 전투·경험치·성장을 거쳐 호수로 갈 수 있다. 원작 트레이너 이름·정확 팀·상금·전화 재대결을 복제하지 않으며 전투는 길막이 아니다.
- **적용:** `src/johto-route-43.ts`의 `route43Camper/tourRoute43Camper`, `src/road-trainers.ts`의 `johto-route-43-camper-practice`, `src/johto-route-43-life.ts`의 두 선택전 상태 안내. 기존 야생 조우·포획·성장·저장과 road trainer 공통 소비 경로를 사용한다.
- **검증:** 코드·문서 반영. QA 중단으로 타입 검사·빌드·브라우저 보행·조우·포획·전투·경험치·저장·화면·음향을 실행하지 않았으며 황토 도시 완료가 아니다.
- **실제 참가·성장 기록:** `src/johto-route-43-battle.ts`는 두 선택전 시작 시 선두가 건강한 `met=성도 43번도로` 실제 객체일 때만 슬롯·종·시작 레벨·대상 트레이너를 저장한다. 승리 시 공통 battle의 `defeatedOpponentParticipants`에 같은 객체가 있을 때만 참가 완료로 남긴다. `engine.ts` 결과 훅과 `field-partner-party.ts`의 파티 재배치/PC 보관 추적을 사용하고, `johto-route-43-life.ts`가 시작→현재 레벨·HP를 호수/황토 표지와 상류 여행자에게 표시한다. 파티의 다른 동료로 전투하는 선택도 유지된다.

## 43번도로 두 갈래 길의 지형·충돌 보수

- **지도 자료:** 2026-09-15 HGSS [Bulbagarden 전체 지도 이미지 608×834](https://bulbapedia.bulbagarden.net/wiki/File%3AJohto_Route_43_HGSS.png), [Bulbapedia 장소](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_43), [Serebii Pokéarth](https://www.serebii.net/pokearth/johto/route43.shtml), [HGSS Walkthrough Section 11](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_11)을 실제 대조했다.
- **원작/프로젝트 적용:** 원작은 동쪽 검문소의 짧고 풀이 없는 길과 서쪽 트레이너·긴 풀길을 선택한다. 현행 32×80 크기와 양쪽 워프를 보존하면서 북·남 합류부, 서쪽 긴 풀길, 동쪽 옛 검문 길을 충돌 격자로 분리했다. 서쪽은 두 긴풀 구역과 기존 새잡이, 동쪽은 상류 여행자·물길·옛 기단을 배치한다. 양쪽 모두 황토↔호수를 왕복하며 통행료·강제전투·길막·HM은 없다.
- **코드 소비:** `src/johto-route-43.ts`가 walkable·terrain·NPC·표석 좌표와 `paintJohtoRoute43`를 함께 정의한다. 호수 도착 표지는 북쪽 합류 보행면에 인접한 `(19,8)`, 거름틀의 옛 기단은 동쪽 길 `(22,56)`으로 맞췄다. 공통 `explore-art.ts`에서 `JOHTO_ROUTE_43`일 때 전용 painter를 호출하는 중앙 연결이 필요하다.
- **검증:** 지역 코드 반영. QA 중단으로 두 길 실제 보행·조우 진입/회피·NPC 접근·왕복·미니맵·저장·화면은 미검증이며 원작 지도 재현 완료나 황토 도시 완료가 아니다.

## 호수 주민 작업의 43번도로 실제 귀환

- **정확한 출처·확인일·버전:** 2026-09-15, Pokémon HeartGold·SoulSilver. [Bulbapedia 43번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_43), [Bulbapedia 분노의호수](https://bulbapedia.bulbagarden.net/wiki/Lake_of_Rage), [Serebii Pokéarth 43번도로](https://www.serebii.net/pokearth/johto/route43.shtml), [Bulbapedia HGSS Walkthrough Section 11](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_11)을 개별 열람했다.
- **원작 사실:** 43번도로는 남쪽 황토와 북쪽 분노의호수를 잇는다. HGSS에는 검문소를 지나는 짧은 길과 트레이너·긴 풀이 많은 서쪽 길이 있고, 피죤·메리프·보송송·키링키 등이 육상 풀에서 등장한다. 호수 사건은 전파 영향을 받은 붉은 갸라도스와 황토의 지하 시설 조사로 이어진다.
- **프로젝트 변경:** 기존 32×80 재구성의 가운데 마른 왕복 본선, 두 선택 풀밭, 옛 검문 기단을 유지한다. `nexusRageResidentsResumed` 뒤 호수 주민이 다시 쓰는 갈대 거름틀을 43번도로 출신의 실제 건강한 파티 동료와 운반한다. 호수 남쪽 표지에서 시작 → 상류 물길에서 진흙 씻기 → 옛 기단에서 말리기 → 황토 북쪽 표석에서 주민 작업 바구니로 반환한다. 원작 검문 통행료·로켓단 전투·아이템·수상/낚시·숨은 북쪽 길을 새로 열지 않는다.
- **적용 코드·MapId·이벤트:** `src/johto-route-43-life.ts`, `tour_johto_route_43`의 `tourRoute43LakeBoard` → `tourRoute43WaterRail` → `tourRoute43GateTrace` → `tourRoute43MahoganyBoard`. 단계 상태는 `nexusRoute43ResidentFrames*`이며 보상·HP·경험치·통행·전력·송신·배수·갸라도스 상태를 바꾸지 않는다. 반환 뒤 기존 황토 주택/센터 또는 같은 43번도로 호수 귀환을 안내한다. `src/rage-route-homecoming-art.ts`는 현재 단계의 기존 막힌 prop 셀에 거름틀 한 개를 표시하는 지역 painter다.
- **중앙 소비 요청:** renderer의 동적 월드 레이어에서 `rageRouteHomecomingLayers(c,map,g.save.flags)`를 기존 43번도로 인물과 깊이 정렬해 합성해야 한다. 이벤트 행동은 기존 `handleJohtoRoute43Life` 경로로 이미 소비된다.
- **실제 동료 식별 보수:** 시작 때 `nexusRoute43ResidentFramesSlot`과 종을 함께 저장하고 이후에는 그 슬롯의 같은 개체·43번도로 출신·건강 상태를 모두 확인한다. 같은 종의 다른 개체로 대체하지 않는다. 파티 재정렬·진화 때 실제 객체를 따라 슬롯/종을 갱신하고 PC 보관 때 슬롯을 지우려면 공통 `trackFieldPartners`에 이 진행 중 레코드를 연결해야 하며 중앙에 계약을 전달했다.
- **중앙 연결·행동 보수:** renderer의 `rageRouteHomecomingLayers`와 공통 `trackFieldPartners`의 반환 전 slot/species 추적이 연결됐다. 물길 조사·옛 기단 조사·황토 표석 조사만으로 상태를 쓰지 않으며, 각 위치에서 `거름틀을 씻는다` → `거름틀을 세운다` → `주민에게 돌려준다`를 선택할 때 같은 실제 동료·현재 맵/좌표·HP·선행 단계를 다시 확인하고 저장한다.
- **PC 교체 재개:** 기절로 slot이 유지된 상태와 PC 보관으로 실제 개체 추적 slot이 삭제된 상태를 구분한다. 기절은 같은 동료의 회복을 요구한다. slot이 삭제됐으면 현재 파티의 건강한 43번도로 출신 동료를 플레이어가 명시적으로 다시 선택해 남은 작업을 인계한다. 이미 씻음/말림 단계와 거름틀의 화면 위치는 보존하며 같은 종의 다른 개체를 자동 지정하지 않는다.
- **구현·검증 상태:** 지역 이벤트·저장 단계·그림 API를 반영했다. QA 중단으로 실제 포획 동료 선택·네 지점 보행·재편성/기절 재개·귀환·저장·화면·음향은 미검증이며 황토·호수·성도·CH05 완료가 아니다.

## 42번도로 깨비참 포획·성장·기슭 선택 실전

- **정확한 출처·확인일·버전:** 2026-09-15, Pokémon HeartGold·SoulSilver. [Bulbapedia 성도 42번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_42), [Serebii Pokéarth 42번도로](https://www.serebii.net/pokearth/johto/route42.shtml), [Bulbapedia HGSS Walkthrough Section 10](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_10)을 개별 열람했다.
- **원작 사실:** HGSS 42번도로는 인주와 황토 사이에 있고 절구산의 여러 입구와 두 수면이 길을 나눈다. 깨비참은 HGSS 풀숲에서 Lv.14·16으로 출현하며, 도로에는 낚시꾼·괴짜·등산가 트레이너가 있다. 중앙 규토리 군락은 수상 이동과 풀베기를 전제로 접근한다.
- **프로젝트 변경:** 현재 단일 육상 본선과 절구산 1층 선택 입구를 유지한다. 앞서 군락에서 건강한 동료의 실제 기술로 마른 길을 보여 준 뒤 깨비참 Lv.16 한 번의 선택 포획전을 연다. 승리로 쓰러뜨리면 재생성하지 않고, 포획하면 `met=성도 42번도로`를 보존한다. 이후 기슭 트레이너의 깨비참17→꼬마돌18 선택 실전으로 경험치·기술·교대를 활용한다. 이 팀과 상금480원은 현재 레벨 범위에 맞춘 넥서스 구성으로 원작 트레이너 복제가 아니다. 수상·풀베기·규토리 채집·원작 아이템·전화 재대결·스이쿤 사건은 적용하지 않았다.
- **적용 코드·MapId·이벤트:** `src/johto-route-42.ts`의 `tour_johto_route_42` / `route42GroveTrainer`; `src/johto-route-42-life.ts`의 `route42SpearowGrove`, 특별전 `johto-route-42-spearow`, 선택전 `johto-route-42-grove-practice`. 기존 공통 특별 야생전·트레이너전·성장·포획·선두 선택 API를 소비하며 공통 엔진·렌더러·가이드·런타임 카탈로그는 수정하지 않았다. 황토센터 `tour_mahogany_center/tourHost`, 주택 `tour_mahogany_home1/tourHost`, 인주·절구산·황토의 기존 양방향 본선을 귀환으로 유지한다.
- **구현·검증 상태:** 지역 코드와 실제 맵 NPC·대화·전투 시작 경로에 반영했다. QA 중단에 따라 테스트·타입 검사·빌드·브라우저·자연 포획·경험치/기술 성장·선택전·귀환·저장 재접속·화면·음향 검증은 실행하지 않았다. 따라서 구현 미검증이며 황토 도시 완료 판정이 아니다.

## 42번도로 규토리나무 아래 깨비참 현장 행동

- **확인일·버전·출처:** 2026-09-15, Pokémon HeartGold·SoulSilver. [Bulbapedia 42번도로](https://bulbapedia.bulbagarden.net/wiki/Route_42), [Bulbapedia HGSS Walkthrough Section 10](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_10), [Serebii Pokéarth 42번도로](https://www.serebii.net/pokearth/johto/route42.shtml), [Bulbapedia 절구산](https://bulbapedia.bulbagarden.net/wiki/Mortar).
- **원작 사실:** 42번도로는 인주시티와 황토마을 사이의 절구산 기슭이며 작은 호수 둘과 절구산의 여러 입구로 구간이 나뉜다. 중앙에는 세 그루의 규토리나무가 있고 HGSS 낮 육상 조우에는 깨비참이 포함된다. 절구산은 선택 던전이며 여러 층·수로·폭포·괴력 요소와 높은 조우율을 가진다.
- **프로젝트 변경:** 현재 `tour_johto_route_42`는 수상 이동 없이 인주↔황토를 왕복하고 `tour_johto_mt_mortar_1f` 한 곳만 선택 분기로 연다. 중앙 기슭에 `route42SpearowGrove`를 두고 깨비참을 포획·전투 대상으로 추가하는 대신, 건강한 파티 동료가 실제 보유한 기술 하나의 세기를 조절해 마른 길을 보여 주는 비보상 선택 행동을 적용했다. 규토리 채집, 수상 이동, 나무박치기 조우, 절구산 깊은 층, 태권왕·배루키 보상과 전설 사건은 열지 않았다.
- **적용 코드·MapId·결과:** `src/johto-route-42.ts`의 `tour_johto_route_42` 중앙 군락 오브젝트, `src/johto-route-42-life.ts`의 `route42SpearowGrove`. 결과는 `nexusRoute42SpearowGuided`, 선택 동료 종과 기술 이름으로 저장하고 황토센터 `tour_mahogany_center/tourHost` 또는 산기슭 주택 `tour_mahogany_home1/tourHost` 귀환 길안내로 잇는다. HP·경험치·능력치·포획·도구·통행 상태는 바꾸지 않는다.
- **구현·검증 상태:** 지역 코드와 기존 생활 핸들러 호출 경로에 반영했다. QA 중단 지침에 따라 테스트·빌드·브라우저·자연 보행·화면·저장 재접속·음향 검증을 수행하지 않았으며 구현은 미검증이다.

## 호수 사건 뒤 황토센터 귀환·성장 기록

- **확인일·버전·출처:** 2026-09-15, Pokémon HeartGold·SoulSilver. [Bulbapedia 황토마을](https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town), [Serebii Pokéarth 황토마을](https://www.serebii.net/pokearth/johto/mahoganytown.shtml), [Bulbapedia HGSS Walkthrough Section 10](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_10).
- **원작 사실:** 황토마을은 서쪽 42번도로, 북쪽 43번도로와 분노의호수, 동쪽 44번도로의 교차 거점이다. HGSS에서는 기념품점 아래 송신 시설의 전파가 주변 포켓몬과 붉은 갸라도스 사건에 영향을 주며, 사건 진행에 따라 상점과 동쪽 진행 상태가 달라진다. 마을에는 포켓몬센터가 있다.
- **프로젝트 변경:** 채택된 넥서스 서사에서는 생활 공급을 유지한 채 송신 계통만 분리하고, 갸라도스 진정 뒤 주민의 취수·경보·갈대 작업 재개를 별도 결과로 기록한다. 원작 로켓단 기지·상점 변환·체육관·배지·동문 길막을 복제하지 않는다. 주민 재개 플래그 뒤 황토센터 편성대에서 건강한 파티 동료 한 마리의 실제 레벨·HP·현재 기술을 확인하고, 43번도로 결과 재확인 또는 44번도로·얼음샛길 준비, 센터 회복, 산기슭 주택 휴식으로 이어지게 했다.
- **적용 코드·MapId·상태:** `src/mahogany-life.ts`, `tour_mahogany_center/mahoganyCenterPartyTable`. `nexusRageResidentsResumed`를 결과 조건으로 읽고 `nexusMahoganyRecoveryDebriefed`, `nexusMahoganyRecoverySpecies`를 저장한다. 경험치·HP·기술·포획·도구·통행·배지 상태는 변경하지 않는다. 주택 생활 기록은 황토 귀환 기록 여부에 반응한다.
- **구현·검증 상태:** 기존 `handleMahoganyLife` 호출 경로 안에 연결되어 공통 파일 수정이 필요 없다. QA 중단으로 이벤트 접근·간호사 회복·파티 화면·43·44번도로 목적지·저장 재접속·화면·음향은 미검증이다.


## 얼음샛길 네 층의 필드 지형 표현

- **근거:** 2026-09-15 HGSS [Bulbapedia Ice Path](https://bulbapedia.bulbagarden.net/wiki/Ice_Path), [Serebii Pokéarth](https://www.serebii.net/pokearth/johto/icepath.shtml), [Walkthrough Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12)를 대조했다. 개별 HGSS 1F 지도 파일은 열람 오류가 있어 확인 완료로 기록하지 않는다.
- **실제 적용:** `src/johto-ice-path.ts`의 전용 painter가 네 MapId의 충돌 격자·선택 조우 terrain·워프·조사물을 직접 읽어 깊이별 암벽, 마른 우회로, 밝은 서리 회랑, 계단을 그린다. `src/explore-art.ts`에서 일반 통로 fallback보다 먼저 소비한다.
- **경계:** 외부 자산은 재사용하지 않았고 HGSS 층 구조를 현재 16px BW·BW2풍 Canvas 표현으로 재구성했다. 미끄럼·괴력·낙하 퍼즐과 원작 도구는 여전히 미구현이다. QA 중단으로 화면·가독성·보행·조우·저장·음향은 미검증이다.



## 성도 동부 현지 동료의 실제 선택전 참여

- HGSS [44번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_44), [Pokéarth](https://www.serebii.net/pokearth/johto/route44.shtml), [얼음샛길](https://bulbapedia.bulbagarden.net/wiki/Ice_Path), [Walkthrough Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12)를 2026-09-15 대조했다.
- johto-east-battle.ts는 44번도로·얼음샛길 출신 실제 선두 객체의 슬롯·종·시작 레벨·대상 트레이너를 저장한다. 공통 전투의 상대 격파 참가 참조와 최종 승리가 모두 있을 때만 결과를 기록하며 편성·진화를 같은 객체로 추적한다.
- 기존 승리에 증거가 없으면 현지 선두로 상금 없는 재확인전을 할 수 있다. 승리 대화는 성장·HP와 황토센터/얼음샛길/검은먹 귀환을 표시한다. 포획·출전·승리는 길막이 아니며 QA 중단으로 모든 실행 검증은 미실행이다.



## 검은먹 도착 뒤 실전·수련 객체 연결
- 2026-09-15 HGSS [Blackthorn City](https://bulbapedia.bulbagarden.net/wiki/Blackthorn_City), [Pokéarth](https://www.serebii.net/pokearth/johto/blackthorncity.shtml), [887×792 지도](https://archives.bulbagarden.net/wiki/File%3ABlackthorn_City_HGSS.png), [Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_13)을 실제 대조했다.
- blackthorn-life.ts의 안내원·센터가 동부 산길 실제 격파 동료와 시작→현재 성장/HP 또는 PC 상태를 읽는다. 기존 검은먹 수련은 종만으로 동종 개체가 대신할 수 있던 문제를 blackthornTrainingSlot+species로 보수하고 field-partner-party.ts에 진행 중 객체 추적을 연결했다.
- PC 보관/이전 저장은 외부 수행 물길에서 재선택하며 기절은 같은 개체 회복을 요구한다. 원작 체육관·배지·장로 시험은 미적용, QA 중단으로 실행 검증 미실행이다.



## 검은먹 남쪽 현지 동료의 실제 실전
- 2026-09-15 HGSS [45번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_45), [Pokéarth 45](https://www.serebii.net/pokearth/johto/route45.shtml), [45 지도](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_45_HGSS.png), [46번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_46), [Pokéarth 46](https://www.serebii.net/pokearth/johto/route46.shtml), [46 지도](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_46_HGSS.png)를 대조했다.
- johto-south-battle.ts가 29·45·46번도로 출신 실제 선두 객체의 슬롯·종·시작 레벨을 저장하고 공통 battle 상대 격파 참가 참조와 최종 승리로만 완료한다. road-trainers/engine/field tracker/46번 준비 상담/남쪽 생활 안내에 연결했다.
- 기존 승리는 현지 선두일 때 상금 없는 재확인전을 제공한다. 여행자와 표석은 성장·HP·PC 상태 및 검은먹/무궁 귀환을 표시한다. QA 중단으로 실행 검증은 미실행이다.



## 남쪽 산길 실전의 검은먹 귀환 반응
- blackthorn-life.ts가 JOHTO_SOUTH_BATTLE 기록을 안내원·센터·주택·남문 표석에 연결했다. 현지 실제 동료가 파티에 있으면 시작→현재 레벨/HP, PC 또는 다른 편성이면 역사 기록을 표시한다.
- HGSS 검은먹→45→46 지리와 센터 귀환을 바탕으로 한 넥서스 반응이며 서쪽 얼음샛길 결과와 분리한다. 체육관·배지·통행에는 영향 없고 QA는 미실행이다.



## 남쪽 산길에서 무궁시티로 돌아온 성장 기록
- 2026-09-15 HGSS [무궁시티](https://bulbapedia.bulbagarden.net/wiki/Cherrygrove_City), [Pokéarth](https://www.serebii.net/pokearth/johto/cherrygrovecity.shtml), [무궁 지도](https://archives.bulbagarden.net/wiki/File%3ACherrygrove_City_HGSS.png), [29번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_29), [29 지도](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_29_HGSS.png)를 대조했다.
- johto-cherrygrove-life.ts가 누락한45번도로 출신을 파티/PC 집계에 포함하고 JOHTO_SOUTH_BATTLE 실제 격파 동료의 시작→현재 레벨·HP/PC 상태를 길안내·센터·주택에 표시한다.
- 센터 회복·PC·기술 준비와46번 재확인전을 이어 주며 도시 투어 보상·통행 잠금은 추가하지 않았다. QA 미실행이다.

## 무궁 꽃길에 이어지는 남쪽 동료의 돌봄

- 2026-09-15 HGSS [무궁시티](https://bulbapedia.bulbagarden.net/wiki/Cherrygrove_City), [Pokéarth](https://www.serebii.net/pokearth/johto/cherrygrovecity.shtml), [무궁 지도](https://archives.bulbagarden.net/wiki/File%3ACherrygrove_City_HGSS.png), [29번도로](https://bulbapedia.bulbagarden.net/wiki/Johto_Route_29), [29번 지도](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_29_HGSS.png)를 대조했다.
- johto-cherrygrove-care.ts가 29·45·46번도로와 기존29번 합류부 표기 출신을 남쪽 귀환 동료로 인식한다. JOHTO_SOUTH_BATTLE에서 실제 상대를 쓰러뜨린 정확한 객체를 선택하면 시작→현재 레벨을 해안 바람 관찰·공동 화단 돌봄에 연결한다.
- 다른 건강한 동료 선택은 그대로 허용하고 PC 이동·편성 변경은 기존 exact-object 재선택 규칙을 따른다. 원작 고정 사건·보상·통행 조건은 추가하지 않았으며 QA 중단으로 실행 검증은 미실행이다.

## 무궁 북문–성도30번도로

- 2026-09-15 HGSS [30번도로](https://bulbapedia.bulbagarden.net/wiki/Route_30), [Pokéarth](https://www.serebii.net/pokearth/johto/route30.shtml), [HGSS 563×1196 지도](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_30_HGSS.png), [Walkthrough Section 2](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_2)를 실제 대조했다.
- `src/johto-route-30.ts`의40×88 MapId를 무궁 북문과 양방향 연결하고 연못 동·서 갈림, 두 가옥 앞 기록판, 네 선택 풀밭, 안전 본선, 선택 곤충채집가,31번 예정 경계를 적용했다. 낮 HGSS 지원종 혼합 풀은 현재 레벨 흐름에 맞춰20~23으로 조정했다.
- 원작 초기 길막·이상한 알·도감·규토리상자·수상/낚시·아이템은 적용하지 않았다. 공식 exporter는73종·67풀·55기술을 생성했으며 QA 중단으로 보행·전투·포획·저장·화면·음향은 미검증이다.

## 성도31번도로–도라지 동문 · 2026-09-16

- 2026-09-16 HGSS [31번도로](https://bulbapedia.bulbagarden.net/wiki/Route_31), [Pokéarth](https://www.serebii.net/pokearth/johto/route31.shtml), [HGSS 1012×472 지도](https://archives.bulbagarden.net/wiki/File%3AJohto_Route_31_HGSS.png), [Walkthrough Section 3](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_3)을 실제 대조했다.
- `src/johto-route-30.ts`에56×28 Route31을 추가해30번 북쪽과 도라지 동문을 왕복 연결했다. 작은 연못·선택 긴풀·곤충채집가·어둠의동굴 서쪽 입구 경계를 적용하고 도라지 기록석이30·31번 출신 동료와 무궁 귀환을 소비한다.
- 낮 풀은 지원되는 구구와 두 버전 애벌레 계열을 Lv.21~23으로 조정했다. 모다피·동굴 내부·메일/TM/아이템/Cut 지름길은 제외했다. 2026-09-16 동시 데이터까지 반영한 exporter 결과74종·70풀·55기술, QA 중단으로 실행 검증 미실행이다.
- `johto-route31-battle-art.ts`를 renderer에 연결해 작은 연못·숲길·동쪽 암벽 입구를31번도로 전용 전투 배경으로 그린다. 중앙이 추가한30번도로 painter와 전투 분기는 그대로 보존했다. 원작 자산 재사용 없음, 화면 QA 미실행이다.


## 2026-09-16 어둠의동굴 남서 탐사 구역

- HGSS Dark Cave의 Bulbapedia·Serebii Pokéarth·Violet-side 1088×832 지도·Walkthrough Section 13을 실제 대조했다.
- `tour_johto_dark_cave_west`56×48을31번도로 동쪽 `(42,6)`과 동굴 서쪽 `(1,38)`에 양방향 연결했다. 밝은 돌 안전 고리, 선택 암반 조우 세 곳, 작은 연못, 북동 심부 경계를 구현했다.
- 원작31번 쪽 일반 보행 꼬마돌60%·주뱃39%를 `J-DARK-CAVE-WEST` Lv.22~24로 생성했다. 미지원 노고치1%는 대체하지 않았고 원작 이동기술·아이템·낚시·라디오·대량발생·46/45번도로 관통은 열지 않았다.
- 공식 exporter 결과는 공유 작업을 포함해74종·71풀·55기술이다. QA 중단에 따라 테스트·빌드·브라우저·화면·음향·저장 검증은 실행하지 않았으며 도시·동굴 완료가 아니다.
- 후속으로 현지 포획 동료의 정확한 객체를 서식 흔적→연못 메아리→심부 경계에 연결하고 시작/완료 레벨을 기록한다. 미완료 파티 재배치는 추적하되 PC 이동·기절은 자동 대체하지 않으며, 도라지 동문 기록석에서 현지 보유 수와 귀환 성장을 확인한다. QA는 계속 중단 상태다.
- 전용 필드 painter를 배경 생성 경로에 연결해 막힌 암벽·밝은 돌 안전선·거친 조우 바닥·귀환 고리의 지하 연못·31번도로 출구를 프로젝트 도형으로 구분했다. 화면 검증은 QA 중단으로 미실행이다.
- HGSS Blackthorn-side 지도와45번 쪽 조우를 대조해 `tour_johto_dark_cave_east`64×56을45·46번도로에 연결했다. 두 입구 주머니는 내부에서 분리해 원작 이동기술 없는 관통을 만들지 않고 각 도로로 귀환한다. 주뱃·꼬마돌50/50 Lv.23~25와 전용 필드 painter, 지도 안전점 등록을 반영했다. exporter74종·72풀·55기술, QA 미실행이다.
