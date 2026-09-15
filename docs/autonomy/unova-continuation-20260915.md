# 하나 구름시티 후속 구현 · 2026-09-15

## 하나 8번도로 실제 동료 실전과 설화 도착 · 2026-09-16

- 근거: [Bulbapedia Unova Route 8](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8), [Serebii Pokéarth Route 8](https://www.serebii.net/pokearth/unova/route8.shtml), [B2W2 Route 8 지도](https://bulbapedia.bulbagarden.net/wiki/File%3AUnova_Route_8_Map.png), [B2W2 Walkthrough Section 19](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_19), 2026-09-16 확인.
- 적용: 버전 교차 부분 풀 딱정곤·쪼마리 중 건강한 실제 선두 객체의 시작 레벨과 직접 격파·최종 승리를 기록하고 설화 동문에서 같은 객체의 현재 레벨·HP를 소비한다. 기절·PC 이동·과거 승리는 회복·재편성·무보상 재확인전으로 복구한다.
- 이동: 튜브라인브리지→8번도로 포획/실전→설화 동문→생활관→설화의 습지→전망→도로 번호 없는 용나선탑 접근로. 계절·결빙·수상·낚시·아이템은 미적용이며 QA는 중단 상태다.

## 하나 9번도로 치라미 선택 조우와 라이더 실전 · 2026-09-16

- 근거: [Bulbapedia Unova Route 9](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_9), [Serebii Pokéarth Route 9](https://www.serebii.net/pokearth/unova/route9.shtml), [B2W2 Route 9 지도 자료](https://bulbapedia.bulbagarden.net/wiki/File%3AUnova_Route_9_Map.png), [B2W2 Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13), 2026-09-16 확인.
- 적용: 남서쪽 실제 열린 셀 두 곳에 치라미 Lv.24~25 선택 조우를 연결하고, 포장 본선 밖 치라미·스콜피 라이더 선택전과 모험 안내를 추가했다. 바깥 흙길과 중앙 포장 본선은 안전하게 유지한다.
- 경계: 치라미만 현재 지원되는 원작 일반 풀 종이므로 100% 부분 풀로 명시했다. 원작의 나머지 종·진한/흔들리는 풀·숨겨진동굴·도전자굴·결빙·아이템은 제외했다. QA는 전부 미실행이다.
- 실제 동료 계약: `unova-route-nine-journey.ts`가 현지 치라미 실제 선두와 시작 레벨을 기록하고 최종 승리·상대 격파 참가를 함께 확인한다. 공통 tracker는 파티 순서를 따라가며 PC 이동 때 슬롯을 비운다. 쌍용 서문 쉼터는 같은 건강한 객체만 귀환 완료로 인정하고 기절·PC 이동·과거 승리는 회복·재편성·무보상 재확인전으로 복구한다.
- 쇼핑몰 1층 후속: 실제 참가·서문 귀환을 마친 같은 건강한 치라미가 입고 정리대→여행용품 통행선→동행 휴게 순서로 생활 작업을 한다. 각 단계는 기존 실내 객체에 저장되며 구매·아이템·회복·보상·상층·로토무·결빙 사건은 추가하지 않았다.

## 쌍용시티 11번도로 실제 동료 도착과 9번도로 출발

- 근거: [Bulbapedia Opelucid City](https://bulbapedia.bulbagarden.net/wiki/Opelucid_City), [Serebii Pokéarth Opelucid City](https://www.serebii.net/pokearth/unova/opelucidcity.shtml), [Serebii B2W2 version areas](https://www.serebii.net/black2white2/versionarea.shtml), [B2W2 Walkthrough Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_13), 2026-09-15 확인.
- 적용: 11번도로 선택전에 실제 참가한 같은 객체를 동문·역사관 생활 기록까지 추적한다. 기절은 센터 회복, PC 이동은 원래 동료 재편성을 안내하고 동종 대체는 인정하지 않는다. 이후 역사관 기술·문양 활동과 9번도로 외부·튜브라인브리지로 안내한다.
- 경계: 자유 통행을 유지하고 체육관·배지·플라스마 결빙·유전자쐐기·10번도로는 추가하지 않았다. 외부 코드·지도·자산은 재사용하지 않았으며 QA 중단으로 모든 실행 동작은 미검증이다.

## 구름하수도 포획 동료의 공원 실전과 센터 귀환

- 대상 이동: 구름시티 `tour_castelia` → 구름하수도 `tour_castelia_sewers` → 숨은 공원 `tour_castelia_park` → 같은 하수도 → 구름시티 포켓몬센터 `tour_castelia_center`. 세부 좌표와 왕복 계약은 `WORLD_ROUTES.md`의 구름하수도 절을 따른다.
- 실제 확인 자료와 확인일: [Bulbapedia Castelia Sewers](https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers), [Bulbagarden 마른 상태 B2W2 지도](https://bulbapedia.bulbagarden.net/wiki/File:Castelia_Sewers_dry_B2W2.png), [Bulbapedia B2W2 Walkthrough Part 4](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_4), [Serebii Pokéarth Castelia Sewers](https://www.serebii.net/pokearth/unova/casteliasewers.shtml), 2026-09-15 확인. 버전은 Pokémon Black 2·White 2다.
- 원작 사실: 구름하수도는 구름시티 관광선착장 쪽에서 들어가 공원·뒷골목과 이어진다. 마른 바닥 걸음 조우는 꼬렛 45%, 주뱃 45%, 질퍽이 10%, Lv.14~17이다. 첫 진행에는 휴 동행과 플라스마단 전투가 있고, 계절 수위와 파도타기에 따라 접근 범위가 달라진다.
- 프로젝트 차이: 현재 프로젝트는 고정된 마른 통로와 자유 탐험을 사용한다. 휴 동행·플라스마단/아크로마 사건·전투 후 자동 회복·계절 수위·파도타기·유물의 길은 구현한 것으로 취급하지 않는다. 기존 하수도/공원 조우와 공원 선택전을 재사용해 현지 포획 동료의 시작 Lv과 전투 뒤 현재 Lv·HP를 기록하고, 같은 길로 항구 센터에 귀환하는 선택 여행으로 재구성했다.
- 적용 코드와 상태: `src/castelia-sewer-journey.ts`의 `handleCasteliaSewerJourney`가 `tourCasteliaSewerHabitat` 흔적 확인 → `tourCasteliaParkLight`의 건강한 현지 파티 동료 선택 → 기존 `tourCasteliaParkTrainer` 선택전 → `tourCasteliaParkReturn`의 결과·귀환 기록을 연결한다. `src/castelia-gallery.ts`가 기존 지역 이벤트 진입점에서 이 핸들러를 호출한다. PC 보관 동료 안내는 센터의 실제 `tourExhibit1` 이벤트로 연결했다.
- 저장 결과: `nexusCasteliaSewerHabitatInspected`, `nexusCasteliaSewerParkPartner`, `nexusCasteliaSewerParkPartnerLevel`, `nexusCasteliaSewerParkReturned`를 사용하며 기존 `trainerWon:castelia-park-practice`를 읽는다. 새 보상·통행 잠금·별도 경험치·자동 회복을 만들지 않는다.
- 검증 상태: 자료 확인과 지역 코드 연결만 반영했다. 사용자 지시에 따라 테스트·빌드·브라우저·자연 플레이·저장 재접속·시각·음향 QA는 모두 미실행이며 구름시티 완료로 판정하지 않는다.
- 재사용: 외부 코드와 자산은 복사하지 않았다. 원작의 지리·조우·진행 관계만 참고했다.

## 구름 동쪽 큰길에서 4번도로로 출발

- 실제 확인 자료와 확인일: [Bulbapedia Unova Route 4](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_4), [Bulbapedia B2W2 Walkthrough Part 4](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_4), [Bulbapedia B2W2 Walkthrough Part 5](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_5), [Serebii Pokéarth Route 4](https://www.serebii.net/pokearth/unova/route4.shtml), 2026-09-15 확인. 버전은 Pokémon Black 2·White 2다.
- 원작 사실: 구름시티 북쪽 보행 출구는 4번도로로 이어지고, 4번도로는 북쪽 뇌문·조인애버뉴와 사막 분기를 연결한다. B2는 도로와 건물이 완공됐고 W2는 고대 유적 발견 뒤 공사가 중단되어 지형이 크게 다르다. 원작은 세 번째 배지와 아크로마·암팰리스 진행 조건도 둔다.
- 프로젝트 차이와 적용: 현재 `tour_unova_route_04`는 두 버전의 어느 한 지도를 그대로 복제하지 않은 넥서스 재구성이다. 남북 포장 본선, 동쪽 리조트데저트 선택 분기, 조인애버뉴 연결을 유지하고 원작 배지·아크로마·암팰리스 잠금은 채택하지 않는다. 구름 동쪽 큰길의 실제 조사물 `tourCasteliaRouteFourDesk`에서 건강한 선두의 Lv·HP와 현재 볼·상처약 수량을 확인해 출발을 저장하고, 4번도로 남부 `tourRouteFourWindStake`에서 같은 동료와 포장 본선/사막 분기의 모래 흔적을 구분한다. 완료 뒤 기존 넥서스 `tourRouteFourWorkSample` 또는 구름센터 귀환으로 이어진다.
- 적용 코드와 저장: `src/castelia-sewer-park.ts`가 통행로 밖 벽면에 출발 점검대를 등록한다. `src/castelia-route-four-departure.ts`의 `handleCasteliaRouteFourDeparture`가 도시 점검과 실제 도로 도착을 처리하며, `src/castelia-gallery.ts`의 기존 지역 이벤트 경로가 호출한다. `nexusCasteliaRouteFourPrepared`, `nexusCasteliaRouteFourSpecies`, `nexusCasteliaRouteFourLevel`, `nexusCasteliaRouteFourWindChecked`를 저장한다.
- 결과와 경계: 동료 편성·회복·아이템 수량은 기존 공통 구조를 읽기만 한다. 기록 없이도 4번도로 통행은 열려 있고, 새 조우·전투·보상·아이템 지급·회복·기술 효과·CH06 완료는 없다. 기존 하수도/공원 동료 루프와 구름 원본 비교 플래그를 다시 쓰지 않는다.
- 검증 상태: 개별 자료 확인 및 지역 코드 호출 반영. QA 중단에 따라 테스트·타입 검사·빌드·브라우저·보행·저장 재접속·시각·음향 검증은 모두 미실행이며 구름시티 완료로 판정하지 않는다.


## 보배마을–12번도로 포획·성장·귀환

- 자료: [Bulbapedia Unova Route 12](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_12), [Serebii Pokéarth Route 12](https://www.serebii.net/pokearth/unova/route12.shtml), [Bulbapedia Lacunosa Town](https://bulbapedia.bulbagarden.net/wiki/Lacunosa_Town), BW2, 2026-09-15 확인.
- 적용: 두 선택 풀밭의 로젤리아·세꿀버리·유토브 Lv.24~25, 조우 없는 낮은 길, 프로젝트 선택 트레이너, 보배 주민의 파티·PC 귀환 반응, 모험 안내를 연결했다.
- 경계: 버전 전용종·두르보·진한/흔들리는 풀·특별 조우·아이템은 미구현이다. 외부 코드·자산은 재사용하지 않았다. QA 중단으로 구현은 미검증이다.


## 빌리지브리지–11번도로 여행 연결

- 출처: [Bulbapedia Village Bridge](https://bulbapedia.bulbagarden.net/wiki/Village_Bridge), [Serebii Pokéarth Village Bridge](https://www.serebii.net/pokearth/unova/villagebridge.shtml), [B2W2 여름 지도 기록](https://bulbapedia.bulbagarden.net/wiki/File:Village_Bridge_Summer_B2W2.png), 2026-09-15 확인.
- 적용: 12번도로 도착 동료·부상 반응, 생활관 통행/휴게, 기존 11번도로 포획·선택전, 빌리지브리지 귀환, 쌍용 재출발을 하나의 안내 흐름으로 연결했다.
- 경계: 원작 코트·식당·마을 풀숲·주민 트레이너·수상/낚시·음악 기능과 외부 자산은 적용하지 않았다. QA 중단으로 미검증이다.


## 12번도로 실제 동료 선택전과 귀환

- 건강한 12번도로 출신 실제 파티 객체를 선두로 묶고 시작 레벨과 상대 격파 참가를 기록한다. 과거 승리·다른 동료 승리는 귀환 완료가 아니며 PC 이동/기절은 재편성·회복·상금 없는 재확인전으로 복구한다.
- 근거: [Route 12](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_12), [B2W2 여름 지도](https://bulbapedia.bulbagarden.net/wiki/File:Unova_Route_12_Summer_B2W2.png), [B2W2 Walkthrough Part 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12), [Pokéarth](https://www.serebii.net/pokearth/unova/route12.shtml), 2026-09-15. QA 미실행.


## 11번도로 실제 동료 실전과 다리 귀환

- 건강한 11번도로 출신 마릴·딱정곤·쪼마리 실제 선두 객체와 시작 레벨을 기록하고, 그 개체의 상대 격파와 최종 승리를 함께 확인한다. 파티 순서 변경은 추적하고 PC 이동·기절·과거 승리는 재편성·회복·상금 없는 재확인전으로 복구한다.
- 근거: [Bulbapedia Route 11](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_11), [Pokéarth Route 11](https://www.serebii.net/pokearth/unova/route11.shtml), [BW2 Walkthrough Part 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12), 2026-09-15. QA 미실행.


## 빌리지브리지 네 생활 리듬

- 풀피리·기타·비트박스 주민과 중앙 엔카 연습자를 실제 NPC로 배치하고 네 파트의 대사 구성을 누적한다. 11·12번도로 귀환 기록에 반응하지만 실제 음원·해금·보상·통행 조건은 없다.
- 근거: [Village Bridge](https://bulbapedia.bulbagarden.net/wiki/Village_Bridge), [Pokéarth](https://www.serebii.net/pokearth/unova/villagebridge.shtml), [B2W2 여름 지도](https://bulbapedia.bulbagarden.net/wiki/File:Village_Bridge_Summer_B2W2.png), [Walkthrough Part 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3ABlack_2_and_White_2_walkthrough/Section_12), 2026-09-15. QA 미실행.
