# 원작 조사 자료와 적용 근거

## 성도29번도로 선택 풀언덕 — 2026-09-13

- 대상: `tour_johto_route_29`, `tourRoute29GrassHill`. 무궁 동쪽 기존80×32 맵의 북서 풀언덕 동쪽 연결길 보수.
- 출처: https://bulbapedia.bulbagarden.net/wiki/Johto_Route_29 (2026-09-13 본문 확인, HGSS/Generation IV 관련 구조). 조우 근거는 https://www.serebii.net/pokearth/johto/route29.shtml (같은 날 HGSS 낮 표 확인).
- 원작 사실: 서쪽 무궁·동쪽 연두·북쪽46 연결, 풀밭을 지나는 굽은 길과 동향 낙차 지름길이 있다. 낮에는 구구·꼬리선·꼬렛이 등장한다.
- 프로젝트 차이/결정: 현재 연두는 미개통이며 원작 전체 지형은 아니다. 기존 남쪽 접점 외에 풀언덕 동쪽 `(25..29,10..12)` 보행 연결을 열고 완만한 포석으로 본선 합류를 드러낸다. 원작 낙차·풀베기 잠금은 복제하지 않으며 양방향 도보로 구성한다. 조우는 지원 구구·꼬렛만, 레벨20~22/비율80:20은 프로젝트 조정이다.
- 실제 소비: `johto-blackthorn-south.ts`의 r29 보행 격자/terrain/조사물 → `johto-blackthorn-south-art.ts`의 기존 `paintRoute29Ground` 및 terrain 긴풀 렌더. `runtime-encounters.ts`의 `J-R29-DAY`가 공통 야생전·포획으로 이어진다. 신규 dependency·외부 코드/자산 재사용 없음.
- 연결 기록: [경유](WORLD_ROUTES.md#성도29번도로-풀언덕-합류-보수), [활동](MAP_STORY_DESIGN.md#무궁29번도로-현지-동료-여행).
- 상태: 자료 확인·코드 반영. 모든 QA 중단으로 플레이/저장/화면 검증 미실행. 원작 재현/BW2 품질/도시 완료로 판정하지 않는다.

장소별 신규 기록은 [구현 지시서의 적용 기록 양식](REGIONAL_IMPLEMENTATION_DIRECTIVES.md#외부-자료-적용-기록의-작성-절차)을 따른다. 사이트 목록 자체는 근거 기록이 아니다. 미확인 출처·프로젝트 자체 보수·원작 대조·실제 플레이 검증을 구분하고, 경유는 WORLD_ROUTES, 사건은 MAP_STORY_DESIGN의 해당 기록으로 연결한다.

## 공개 GitHub 프로젝트 비교 — 2026-09-12

[공개 포켓몬 프로젝트 조사·비교](GITHUB_PROJECT_COMPARISON.md)에 Showdown·pokeemerald·PokeWilds·RPG-JS·pokeemerald-expansion·pokeplatinum·Essentials의 출처, 조사 당시 인기 지표, 로컬 대조와 적용 후보를 정리했다. README/설정 소스 조사와 실제 게임 플레이를 구분하며, 코드 수량은 당시 스냅샷이다. 현재 시각·스토리 목표나 도시 배정을 변경하는 문서가 아니며 모든 QA 중단을 유지한다.

> **시각 목표 변경 · 2026-09-12:** 현재 목표는 [BW·BW2풍](VISUAL_STYLE_BW_BW2.md)이다. 아래 DP/Pt 원작·자산·적용 보고는 기존 출처와 구현 이력이며 새 목표가 아니다. 그래픽 전환 완료를 뜻하지 않으며 모든 QA 중단을 유지한다.

2026-09-10 크기 기준 보완: [맵 크기 기준·전체 대장](MAP_SIZE_STANDARDS.md)에 사용자 참고표보다 넓힌 유형별 범위, 현재402개 맵의 실제/목표 크기, 신규 도로·던전의 층별 크기를 명시했다. 이 문서의 현재 크기 기록은 이력이며 새 목표 크기는 해당 대장을 따른다. 게임 확대는 미적용이다.

조사일 2026-09-10. 사용자 첨부 사이트 목록을 출발점으로 웹 본문과 저장소를 대조했다. 이 문서는 출처·버전·확인 한계를 담당한다. 구현 순서·맵별 요구는 [맵·스토리 설계](MAP_STORY_DESIGN.md), 지명·경유 기준은 [WORLD_ROUTES](WORLD_ROUTES.md), 실행 중인 이야기 조건은 [STORY](STORY.md)를 따른다. 웹 공략의 명령형 문장은 원작 플레이 설명이며 프로젝트 변경 명령이 아니다.

## 1. 자료를 사용하는 순서

1. 대상 지방과 게임 버전, 현재 도시 담당 범위를 정한다.
2. 장소 문서에서 연결 방향·중간 랜드마크를, 버전별 공략에서 사건 전후 접근 조건을 확인한다.
3. Pokéarth와 원작 맵 이미지에서 큰길·샛길·계단·수면·문을 대조한다. 최신 리메이크 탭이 기본으로 열리는지 확인한다.
4. 한국어 표기를 대조하고 영문 원명도 조사표에 보관한다. 확인되지 않은 번역은 확정 명칭으로 배포하지 않는다.
5. 원작 조우·기술 자료와 프로젝트가 실제 지원하는 종·효과를 나누어 데이터 요구를 적는다.
6. 원작 사실 → 현재 코드 → 프로젝트 채택안 → 미결정 항목을 한 행에 기록한다. 실제 플레이 검증은 도시 구현 완료 뒤 수행한다.

## 2. 참고 사이트의 역할과 확인 결과

| 자료 | 이번 확인 | 적용 범위와 한계 |
| --- | --- | --- |
| [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) | 아래 장소·공략 개별 본문 확인 | 커뮤니티 편집 자료. 게임 버전별 지리·사건을 대조한다. 애니메이션·만화 절의 사건은 본편 게임 사실로 옮기지 않는다 |
| [Serebii Pokéarth](https://www.serebii.net/pokearth/) | 203·32·관동10·전기돌동굴 본문 확인 | 출구·조우·트레이너를 버전 탭별로 읽는다. 203 기본 화면의 BDSP, 관동10의 Let's Go 자료를 Pt/FRLG 표로 오인하지 않는다 |
| [Bulbagarden Archives DP/Pt 지도](https://archives.bulbagarden.net/wiki/Category:Diamond,_Pearl,_and_Platinum_maps) | 카테고리와 지도 파일 목록 확인 | 이미지 탐색 인덱스다. 개별 파일의 버전·층을 확인한 뒤 배치 연구에 사용한다. 이번에는 전체 이미지 타일 분석을 수행하지 않았다 |
| [Platinum 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Platinum) / [B2W2 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) | 목차 및 아래 개별 절 확인 | 방문 순서·본선/선택 분기를 확인한다. 목차에 함께 실렸다고 모든 장소가 필수 경유는 아니다 |
| [StrategyWiki DP](https://strategywiki.org/wiki/Pok%C3%A9mon_Diamond_and_Pearl/Walkthrough) | 이번 도구에서 본문 접근 실패 | 보조 후보. 이번 설계 사실의 단독 근거로 사용하지 않음 |
| [GameFAQs Platinum](https://gamefaqs.gamespot.com/ds/946308-pokemon-platinum-version/faqs) | 공략 목록 접근 확인 | 개별 작성자·버전·최종 갱신을 읽은 뒤 퍼즐 교차검증에 사용. 목록만으로 개별 공략 검증을 주장하지 않음 |
| [Pokémon Database 지도](https://pokemondb.net/maps) | 목록 확인 | 특정 동굴·체육관 퍼즐 자료다. 네 지방 전체의 지도/스토리 데이터베이스가 아님 |
| [Spriters Resource DP](https://www.spriters-resource.com/ds_dsi/pokemondiamondpearl/) / [Textures Resource DP](https://textures.spriters-resource.com/ds_dsi/pokemondiamondpearl/) | 이번 본문 접근 실패 | 추후 프레임·오브젝트·재질 구조 참고 후보. 이번에 에셋을 취득·적용하거나 이용 조건을 확인한 것은 아님 |
| [한국어 포켓몬 위키: 전기돌동굴](https://pokemon.fandom.com/ko/wiki/전기돌동굴) | 이번 본문 접근 실패 | 첨부 명칭과 저장소 표기를 사용하되 새로운 한국어 번역의 검증 완료 근거로 삼지 않음 |
| [PokéAPI v2 문서](https://pokeapi.co/docs/v2) | 공식 API 문서 확인 | 종·기술·진화·버전별 장소 조우 관계용. 실제 타일 좌표·워프·사건 순서를 생성하는 원본은 아님 |

추가 크기 조사: [pret/pokeemerald layouts.json](https://github.com/pret/pokeemerald/blob/master/data/layouts/layouts.json)의 장소별 width/height와 구름시티·돌산터널 본문을 확인했다. 에메랄드 재구성 데이터는 공식 개발문서와 구별하고, 서로 다른 종횡비의 근거로만 사용한다. 사용자 예시와 실제 조회값의 차이, 이번에 지정한 프로젝트 목표 크기는 [크기 대장 제2절](MAP_SIZE_STANDARDS.md#2-세계관-자료와-크기-선정)에 기록했다.

## 3. 이번 설계에 사용한 원작 근거

각 항목의 적용 판단은 프로젝트 설계이며 원문을 옮긴 공략이 아니다. 조회 실패 자료는 이 목록의 사실 근거에서 제외했다.

| 근거 ID / 버전 | 확인한 사실 | 적용할 설계 판단 |
| --- | --- | --- |
| S1 · Pt / [공략 목차](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Platinum) | 시작권역과 축복·무쇠, 꽃향기·영원 접근이 별도 구간으로 나뉨 | 창작 출발지와 공식 출발지를 이름만 바꾸어 합치지 않고 연결·이야기를 함께 이행 |
| S2 · DPPt / [203번도로](https://www.serebii.net/pokearth/sinnoh/route203.shtml) | 서쪽 축복, 동쪽 무쇠게이트. 연못과 트레이너가 있는 야외 도로 | 현재 축복–무쇠 암반굴 앞에 야외 구간이 필요. 라이벌전은 별도 스토리 채택안 |
| S3 · Pt / [영원 이후 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Platinum/Part_5) | 갤럭시단 영원 건물 사건과 자전거 가게 복귀가 서사적으로 연결됨 | 역사관 답사는 프로젝트 선택 활동. 원작 구조 사건이나 자전거 해금의 완료를 대신하지 않음 |
| K1 · 버전별 지리 / [관동10번도로](https://www.serebii.net/pokearth/kanto/route10.shtml) | 돌산터널이 도로 남북을 가르며 발전소 접근이 별개 | 현재 홍련–갈색 해안길의 프로젝트10번과 완전히 다른 연결로 관리 |
| K2 · FRLG/HGSS / [갈색시티](https://bulbapedia.bulbagarden.net/wiki/Vermilion_City) | 항구와 포켓몬 애호가 시설, 버전별 선박·도시 상황이 존재 | FRLG 시점의 사건을 HGSS 외형에 표현할 수 있으나 두 시대 선박 사건을 동시에 기정사실화하지 않음 |
| J1 · HGSS / [32번도로](https://www.serebii.net/pokearth/johto/route32.shtml) | 북쪽 도라지·남쪽 연결동굴·서쪽 유적, 긴 길과 동굴 앞 센터 | 고동 도착 묶음에 32번·동굴·33번의 구분과 출발 전 보급을 포함 |
| J2 · HGSS / [연결동굴](https://bulbapedia.bulbagarden.net/wiki/Union_Cave) | 32·33번 사이 통과 동굴이며 지하 탐험 구역도 존재 | 필수 통과층과 선택 지하 탐험을 구분. 모든 층 완료를 도시 도착 조건으로 만들지 않음 |
| J4 · HGSS / [33번도로](https://www.serebii.net/pokearth/johto/route33.shtml) | 연결동굴과 고동 사이의 짧은 우천 도로, 작은 풀밭. 낮에는 꼬렛·통통코·깨비참, SS에는 아보 참고 | 현재 등록된 꼬렛·깨비참·아보만 낮·도보 프로젝트 풀로 사용. 비 전투 효과와 버전 선택은 구현하지 않음 |
| J5 · HGSS / [32번도로](https://www.serebii.net/pokearth/johto/route32.shtml) | 도라지–연결동굴 사이의 긴 해안/절벽 길. 낮 도보 종과 수상·낚시 종이 구분됨 | 현재 등록된 꼬렛·아보만 낮·도보 프로젝트 풀로 사용. 물가 표현을 수상·낚시 조우로 확대하지 않음 |
| J6 · HGSS / [너도밤나무숲](https://www.serebii.net/pokearth/johto/ilexforest.shtml) | 북쪽은34번도로, 동쪽은 고동마을이며 낮 도보에는 캐터피/단데기 또는 뿔충이/딱충이, 주뱃·파라스가 등장 | 현재 지원되는 두 버전의 애벌레 계열과 주뱃을 합친 낮 프로젝트 풀을 남쪽 선택 긴풀에 적용. 파라스와 밤·박치기·수상/낚시·선물·사당 사건은 제외 |
| J3 · HGSS / [공략 목차](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver) | 성도 본편과 관동 후반이 다른 진행 단계 | 프로젝트의 신오→관동→성도 순서는 원작 주인공의 배지 순서를 복제하지 않음 |
| U1 · B2W2 / [공략 목차](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) | 도개교·물풍경 뒤 6번/동굴, 궐수 이후 산로·물결·동부권 흐름 | 궐수–쌍용 직통굴을 B2W2 본선으로 설명하지 않음 |
| U2 · B2W2 / [6번도로](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_6) | 계절 연구소가 있으며 B2W2의 파도타기 전달은 PWT 인근 사건 이후 조건 | 사철록과 계절 관찰은 장소 주제로 채택. 체렌·PWT 보상 조건은 프로젝트 미확정 |
| U3 · B2W2 / [6번과 두 동굴 공략](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2/Part_9) | 전기돌동굴은 1F→B1F→1F로 출구에 접근하고 B2F는 더 깊은 탐험. 궐수의동굴은 별도 장소 | 2맵 축약도 1F 귀환을 보존. B1F에서 곧장 도시로 나오는 구조는 피함 |
| U4 · BW/B2W2 / [전기돌동굴](https://bulbapedia.bulbagarden.net/wiki/Chargestone_Cave) | 자력에 끌리는 결정 퍼즐. BW 입구 거미줄과 B2W2 다리 공사 조건이 다름 | 퍼즐은 장소 요구로 채택. BW의 야콘 거미줄 제거 사건을 B2W2에 이식하지 않음 |
| U5 · 출구 대조 / [Pokéarth 전기돌동굴](https://www.serebii.net/pokearth/unova/chargestonecave.shtml) | 남쪽 6번도로, 북쪽 궐수 | 분할 뒤에도 양쪽 도시와 도보 귀환을 보존 |
| U6 · B2W2 / [마린튜브](https://bulbapedia.bulbagarden.net/wiki/Marine_Tube) | 물결과 기하를 잇는 해저 관람 통로 | 해저 경관은 관찰 연출로 설계. 유리 밖 포켓몬을 자동 야생 조우로 처리하지 않음 |

## 4. 기준 버전과 이름 검증

| 지방 | 지리·장소 기준 | 이야기 적용 | 그래픽 해석 |
| --- | --- | --- | --- |
| 신오 | Pt. DP/BDSP 차이는 별도 주석 | 현재 네 배지·관측 자료 계약 유지, 원작 사건의 채택 여부를 별도 기록 | 신오 고유 지형·건축을 BW·BW2풍으로 표현 |
| 관동 | FRLG의 도시·시설 시점을 기본 설계로 사용 | HGSS 시간 경과를 자동 도입하지 않음. 홍련의 재난 이후 모습·보라 시설 등은 FRLG와 혼합하지 않음 | HGSS의 DS 표현을 참고하되 시설 존재는 FRLG 기준 |
| 성도 | HGSS | 금빛 라디오 생활과 원작 조직 점거 사건을 구분 | 목조 도시·숲·해안·전통 탑 |
| 하나 | B2W2 | BW의 본편 사건과 혼합하지 않음. B2/W2별 가용종·리버스마운틴 차이는 개별 맵 착수 때 한쪽 선택 또는 명시적 프로젝트 변형 | B2W2 공간 정체성과 BW·BW2풍 깊이·카메라·움직임을 목표로 표현 |

영문 원명·현행 한국어 표시·목표 한국어 표시·참조 버전·URL·확인 상태를 명칭 이행표에 둔다. `Chargestone Cave`와 `Mistralton Cave`는 각각 전기돌동굴과 궐수의동굴로 구분한다. 현재 ‘영원숲’과 자료의 ‘영원의숲’ 같은 표기 차이도 저장 출처 문자열을 확인한 뒤 표준화한다.

## 5. 데이터 조사에서 실제 적용까지

PokéAPI의 `location-area`에는 버전별 조우와 방식·조건 관계가 있고, 기술에는 습득 버전 그룹이 있다. 이 자료에서 지도 출구나 스토리 플래그를 추론하지 않는다. 실제 수집 계약은 [공식 v2 문서](https://pokeapi.co/docs/v2), 프로젝트 생성 경로는 [WORLD_DATA_STANDARDS](WORLD_DATA_STANDARDS.md)를 따른다.

조사 기록의 최소 필드는 `sourceUrl / accessedAt / gameVersion / locationArea / encounterMethod / condition / species / sourceLevel / projectLevel / projectWeight / implementationStatus`다. 서식 참고 종이 런타임에 없으면 후보로 남기고, 스프라이트·기술·타입·저장 검증까지 갖춰야 조우를 켠다. 원작 확률과 프로젝트 가중치를 같은 숫자 열에 덮어쓰지 않는다.

이번에는 웹 자료 읽기·소스 조회·런타임 맵 목록의 메모리 내 집계만 수행했다. 데이터를 수집·재생성하거나 이미지·음악을 게임 자산에 추가하지 않았다. 아래 설계의 크기·루프 수·조작 방식·동료 활동은 원작 사실이 아니라 프로젝트 제안이다.

### 하나 11번도로 B2W2 서식 근거 — 2026-09-12

- [Bulbapedia · Unova Route 11](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_11): 쌍용시티와 빌리지브리지를 잇는 공식 11번도로이며 B2W2 일반 풀숲에는 고라파덕·마릴·글라이거·쟝고·세비퍼·딱정곤·뽀록나·쪼마리가 기록돼 있다. 흔들리는 풀·수상·낚시·특별 조우는 일반 도보 풀과 분리한다.
- 일반 풀숲 후보 중 낮은 단계인 마릴·딱정곤·쪼마리를 런타임에 함께 추가했다. 원작 레벨 36~39와 버전별 비중을 복제하지 않고 현재 Lv.25 성장 상한에 맞춘 프로젝트 Lv.23~25·35/35/30 풀로 명시한다. 앞뒤 스프라이트·지원 기술·포획 저장 데이터도 같은 생성 절차에 포함했다. 비리디온 특별 조우, 결빙 본편 사건, 흔들리는 풀, 수상이동·낚시는 채택 전까지 구현 범위 밖이다.

### 하나 9번도로·튜브라인브리지 지리 근거 — 2026-09-12

- [Bulbapedia · Unova Route 9](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_9)에서 9번도로가 쌍용시티와 튜브라인브리지를 잇는 짧은 숲길이고 포장 본선·북쪽 쇼핑몰 나인·남쪽 풀숲을 갖는다는 장소 관계를 확인했다. [Bulbapedia · List of routes](https://bulbapedia.bulbagarden.net/wiki/List_of_routes)에서 튜브라인브리지가 9번도로와 8번도로 사이임을 교차 확인했다.
- 프로젝트는 `tour_unova_route_09` 56×28과 `tour_tubeline_bridge` 80×18로 재구성한다. 이는 원작 타일·걸음 수 복제가 아니며 쇼핑몰 실내·도전자굴·결빙 사건·열차 탑승·8번도로는 별도 구현으로 남긴다. QA 중단 상태라 미검증이다.

### 하나 8번도로 지리 근거 — 2026-09-12

- [Bulbapedia · Unova Route 8](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8)에서 8번도로가 설화시티와 튜브라인브리지를 잇고 북쪽 설화의 습지로 갈라지며, 잦은 비의 웅덩이와 겨울 결빙이 장소 특징임을 확인했다. B2W2에서 튜브라인브리지의 원작 개방 시점이 제한되는 사실과 프로젝트의 자유 왕복 재구성을 구분한다.
- 같은 B2W2 웅덩이 표에서 두까비·딱정곤·쪼마리·메더 등이 계절별로 기록된 것을 다시 확인했다. 현재 공통 런타임에 이미 등록된 딱정곤·쪼마리만 선택해 Lv.24~25·50/50 프로젝트 풀로 조정했다. 원작 Lv.54~57·버전별 비중을 복제하지 않았고, 두까비·메더·독개굴, 수상·낚시·대량발생·결빙은 적용하지 않았다.
- 프로젝트 `tour_unova_route_08`은 64×36으로 두고 마른 본선, 북쪽 습지 분기, 남쪽 웅덩이 우회로를 적용했다. 북쪽 분기는 독립 MapId `tour_icirrus_moor` 56×48의 중앙 마른 데크·서쪽 갈대 수위 순환로·동쪽 물새 관찰 순환로로 이어진다. 계절·날씨·결빙 이동 효과, 조우·트레이너·원작 인물 사건은 후속 범위다. QA 중단 상태라 미검증이다.

### 설화시티·용나선탑 지리 근거 — 2026-09-12

- [Bulbapedia · Dragonspiral Tower](https://bulbapedia.bulbagarden.net/wiki/Dragonspiral_Tower)에서 용나선탑이 설화시티 북쪽에 있고 첫 접근 구역이 도시 북쪽 입구와 직접 이어진다는 장소 관계를 확인했다. [Serebii Pokéarth · Dragonspiral Tower](https://www.serebii.net/pokearth/unova/dragonspiraltower.shtml)의 남쪽 출구 표기도 설화시티를 가리킨다.
- 프로젝트는 두 장소 사이에 공식 도로 번호를 만들지 않고 `tour_dragonspiral_approach` 48×40을 둔다. 마른 본선과 습지 가장자리·해자 관찰 데크를 연결하되 수상 이동·원작 인물·전설 조우·포획·본편 잠금을 추가하지 않는다. 기존 궐수–용나선탑 암반굴은 과거 저장 귀환용으로 보존한다. QA 중단 상태라 미검증이다.

## 2026-09-12 서사 재구성의 출처 경계

이번 개정은 기존 출처 대장과 스토리 검토의 자료를 바탕으로 한 창작 설계이며 신규 웹 조사를 수행한 기록이 아니다. [NEXUS_STORY_MASTER](NEXUS_STORY_MASTER.md)의 팀 아크·공명·신규 인물·지방 간 사건 인과·전설 협력 목적·용나선 CH07 편입은 프로젝트 창작이다. 원작 지명/생태/전설 테마와 프로젝트 사건을 분리한다. 원작 인물의 구체 역할·대사와 수상 이동을 구현할 때 해당 도시의 참고 버전·근거를 다시 대조한다. ‘공식 넥서스 설정’이나 모든 시리즈가 공유하는 확정 연대기로 서술하지 않는다.

## 2026-09-12 BW·BW2 시각 목표 승격

시각·연출의 현행 기준은 [VISUAL_STYLE_BW_BW2](VISUAL_STYLE_BW_BW2.md)다. [BW 공식 소개](https://www.pokemon.co.jp/series/bw/), [BW2 공식 사이트](https://www.pokemon.co.jp/ex/b2w2/), [BW2 모험의 무대](https://www.pokemon.co.jp/ex/b2w2/story/), [Nintendo 개발자 인터뷰](https://iwataasks.nintendo.com/interviews/ds/pokemon-black2-white2/0/0/)의 검색 결과를 확인했다. 전 프레임·화면 분석이나 원작 엔진 수치 검증은 수행하지 않았다.

DP/Pt·HGSS 자료는 신오/관동/성도의 원작 지리·문화·기존 자산 출처로 유지한다. 시각 목표를 BW·BW2로 바꿔도 이 출처를 BW로 재표기하지 않는다. 전경/깊이·제한된 카메라·지속 스프라이트 움직임·배틀/이벤트 연출은 프로젝트 제작 목표이며 현재 지원 사실과 구분한다.

### 성도 용의굴 HGSS 생태 경계 — 2026-09-12

- [Bulbapedia · Dragon's Den](https://bulbapedia.bulbagarden.net/wiki/Dragons_Den)과 [Dratini](https://bulbapedia.bulbagarden.net/wiki/Dratini_%28Pok%C3%A9mon%29)에서 HGSS 용의굴의 잉어킹·미뇽·신뇽 계열이 수상 이동 또는 낚시 방식이며, 신속 미뇽은 장로 문답 뒤 받는 별도 선물임을 확인했다.
- 현재 프로젝트 용의굴은 육상 둘레길만 지원하므로 이 종들을 도보 조우로 바꾸지 않는다. 수상/낚시 시스템과 런타임 종·기술·자산이 함께 준비될 때 별도 적용하며, 장로 시험과 선물 미뇽도 본편·보상 계약을 확정하기 전에는 열지 않는다.

### 성도 44번도로·얼음샛길·검은먹·용의굴 HGSS 적용 — 2026-09-12 확인

- 정확한 페이지: [HGSS 공략 Section 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_12), [Section 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_13), [Pokéarth 검은먹시티](https://www.serebii.net/pokearth/johto/blackthorncity.shtml), [얼음샛길](https://www.serebii.net/pokearth/johto/icepath.shtml), [용의굴](https://www.serebii.net/pokearth/johto/dragon%27sden.shtml), [HGSS 지도 이미지 분류](https://archives.bulbagarden.net/wiki/Category%3AHeartGold_and_SoulSilver_maps). 대조 버전은 HeartGold/SoulSilver, 확인일은 2026-09-12다.
- 원작과 적용 차이: 원작의 얼음 미끄럼·괴력 바위, 이향 체육관 뒤 장로 시험·라이징배지·특별 미뇽, 용의굴 수상·낚시는 현재 런타임에 채택하지 않았다. 현재 적용은 독립 MapId 다섯 구간의 육상 양방향 본선, 검은먹 외부·필수 실내, 용의굴·사당, 44번도로 덩쿠리와 얼음샛길 주뱃 선택 조우, 선택 실전과 동료 관찰이다. 프로젝트 레벨·상금·지도 크기·BW/BW2 표현은 원작 수치 복제가 아니다.
- 검증 경계: 준비 사본 기반 덩쿠리 포획, 검은먹센터 회복·PC 취소·슬롯 저장/재불러오기, 용의굴/사당 귀환 및 화면을 확인했다. 황토부터 전 구간을 한 번에 걷는 자연 진행과 실제 음향 청취는 남아 있다.

### 관동 15번도로 FRLG 생태 경계 — 2026-09-12

- [Bulbapedia · Kanto Route 15](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_15)와 [PokeTools · FireRed Route 15](https://www.poketools.com/firered/route-15)에서 FRLG 일반 풀숲 후보에 구구·뚜벅초/모다피 계열·콘팡·메타몽 등이 있고 버전별 종과 비중이 다름을 대조했다.
- 현재 공통 런타임이 정확히 지원하는 원작 후보는 구구뿐이므로 `K-R15-DAY`에는 구구만 넣었다. Lv.24~25와 단일 종 가중치는 성장 상한에 맞춘 프로젝트 조정이며 원작 출현율 복제가 아니다.
- 세 선택 풀밭만 도보 조우 구역이고 가운데 동서 본선과 출구는 안전하다. 미지원 뚜벅초·냄새꼬·콘팡·모다피·우츠동·메타몽, 버전 차이, 아이템, 게이트 도감 보상, 원작 트레이너 전원은 후속 데이터·사건 계약 없이 구현했다고 표시하지 않는다.

### 관동 14번도로 FRLG 생태 경계 — 2026-09-12

- [Bulbapedia · Kanto Route 14](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_14)에서14번도로가 북쪽13번도로와 남쪽15번도로를 잇고, FRLG 일반 풀숲에 구구·피죤·뚜벅초/모다피 계열·콘팡·메타몽이 기록된 것을 확인했다. 원작의 나무베기 분기와 여러 새잡이·폭주족 배치는 현재 프로젝트의 자유 왕복 구조와 구분한다.
- 현재 런타임이 정확히 지원하는 원작 후보 구구·피죤만 `K-R14-DAY`에 넣었다. Lv.24~25와70/30 가중치는 현재 성장 상한에 맞춘 프로젝트 조정이며 원작 레벨·출현율 복제가 아니다.
- 동쪽 물새길·서쪽 바람막이·남동 쉼터의 세 선택 풀밭만 조우 구역이며 굽은 남북 본선과 출구는 안전하다. 미지원 식물·곤충·메타몽 계열, 아이템, 나무베기 잠금, 원작 트레이너 전원은 적용하지 않았다.

### 관동 13번도로 HGSS/FRLG 지리 적용 — 2026-09-12 확인

- 참고 URL: [Bulbapedia · Kanto Route 13](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_13), [Bulbapedia · FRLG Walkthrough Route 13](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AFireRed_and_LeafGreen_walkthrough/Section_10), [Bulbagarden Archives · Kanto Route 13 FRLG map](https://bulbapedia.bulbagarden.net/wiki/File%3AKanto_Route_13_FRLG.png). 기본 대조는 HGSS이며, 길쭉한 울타리 미로와 사일런스브리지 접근 형태는 FRLG 자료도 함께 참고했다.
- 원작 사실:13번도로는 서쪽14번도로와 동쪽12번도로를 잇고, 좁은 울타리 미로와 남쪽 물가, 동쪽 사일런스브리지 일부를 포함한다. FRLG에는 나무베기로 접근하는 북동 풀밭과 다수 트레이너·숨은 아이템이 있다.
- 프로젝트 변경/적용: `tour_kanto_route_13`을72×32 가로 맵으로 재구성하고 서쪽 `(1,16)`을14번도로, 동쪽 `(70,16)`을 후속12번도로 임시 경계로 둔다. `tourRoute13FenceSurvey`는 건강한 동료 또는 혼자 울타리 틈→굽이→난간을 확인해 선택 종과 완료 플래그만 저장한다.
- 구현/검증 상태: 울타리 본선·세 순환로·사일런스브리지 전망·BW/BW2풍 전용 표현과14번도로/호환길 귀환을 구현했다. FRLG 일반 풀숲 후보 중 현재 지원되는 구구·피죤만 `K-R13-DAY` Lv.24~25·80/20으로 북동쪽 선택 풀밭 한 곳에 연결하고, 동쪽 마른 순환로에 구구24→피죤25 선택 새잡이를 적용했다. 프로젝트 레벨·가중치는 원작 수치 복제가 아니다. 미지원 식물·곤충·메타몽 계열, 나무베기·수상/낚시·아이템·12번도로 독립 연결과 브라우저 보행/화면/음향은 아직 구현 또는 검증 완료로 표시하지 않는다.

### 관동 12번도로 HGSS 지리 적용 — 2026-09-12 확인

- 참고 URL: [Bulbapedia · Kanto Route 12](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_12), [Serebii Pokéarth · HGSS Route 12](https://www.serebii.net/pokearth/kanto/4th/route12.shtml), [Bulbapedia · HGSS Walkthrough Route 12](https://bulbapedia.bulbagarden.net/wiki/Appendix%3AHeartGold_and_SoulSilver_walkthrough/Section_23). 기본 대조 버전은 HGSS다.
- 원작 사실:12번도로는 북쪽 보라타운, 남쪽13번도로, 서쪽11번도로를 잇는 동부 해안 다리이며 사일런스브리지와 낚시 명소로 불린다. 낚시꾼·낚시형 조우·낚시 형제의 집과 버전별 잠만보 재등장 조건이 있다.
- 프로젝트 변경/적용: `tour_kanto_route_12`를32×88 육상 보행 맵으로 재구성해 북쪽 `(16,1)`↔보라타운 남문 `(14,32)`, 남쪽 `(16,86)`↔13번도로 동쪽 `(70,16)`을 연결했다.11번도로는 방향 표지만 두며 `tourRoute12BridgeCheck`는 건강한 동료 또는 혼자 난간→마른 발판→귀환 표지를 점검하고 완료/선택 종만 저장한다.
- 구현/검증 상태: 안전한 다리 본선·네 측면 순환로·낚시 명소 전망·생활 고라파덕·BW/BW2풍 수면/목재 난간 표현과 양방향 귀환을 구현했다. HGSS에서 육상 풀숲이 제거된 경계를 따라 야생 조우는 연결하지 않았다. 대신13번도로에서 포획·육성할 수 있는 피죤 Lv.25 한 마리를 쓰는 프로젝트 선택 실전 `tourRoute12Trainer`와 점검/보유/승리 상태를 읽는 `tourRoute12Keeper`를 적용했다. 이는 원작 트레이너 파티 복제가 아니다.11번도로 출구·낚시·수상 이동·낚시 형제 집·잠만보 사건과 브라우저 보행/화면/음향은 구현 또는 검증 완료로 표시하지 않는다.
# 외부 자료 적용 추가 기준 — 2026-09-12

현재 실행 지시는 [지방별 적용 지시](REGIONAL_IMPLEMENTATION_DIRECTIVES.md)를 따른다. QA 운영 정책은 루트 AGENTS를 따른다. 이 문서의 과거 재개/중단 기록으로 QA를 실행하지 않는다.

| 자료 | 사용할 질문 | 교차 대조 및 한계 |
| --- | --- | --- |
| [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) | 장소 연결·인물·사건·버전 차이 | 원작 버전을 명시하고 실제 워프와 별도로 기록 |
| [Serebii Pokéarth](https://www.serebii.net/pokearth/) | 출구·조우·트레이너·아이템 배치 | 해당 게임 탭을 고정. 이번8번도로 세부 URL 조회는 실패했으므로 세부 내용 확인으로 표시하지 않음 |
| [Bulbagarden Archives](https://archives.bulbagarden.net/wiki/Main_Page) | 원작 맵 이미지·지형/타일 배치 | 이미지 파일의 게임·언어·해상도·출처 확인. 그림 좌표를 곧바로 프로젝트 충돌 좌표로 쓰지 않음 |
| [Bulbapedia 공략](https://bulbapedia.bulbagarden.net/wiki/Appendix:Walkthroughs) | 사건 순서·배지·통행 조건 | Pt/HGSS/BW/BW2를 섞지 않음. 넥서스의 채택 사건과 원작 사건을 구분 |
| [StrategyWiki](https://strategywiki.org/wiki/Main_Page) | 퍼즐·던전·아이템 공략 보조 | 개별 문서의 판본과 완성도를 확인해 다른 자료와 대조 |
| [GameFAQs](https://gamefaqs.gamespot.com/) | 세부 동선·작성자 공략·던전 지도 | 작성자·게임·작성일을 적고 단독 확정 근거로 사용하지 않음 |
| [PokéAPI v2](https://pokeapi.co/docs/v2) | 종·기술·진화·버전별 데이터 조회 | 수집→정규화→실행 지원 필터→공통 카탈로그 순서. 맵 모양/본편 스토리 원본으로 사용하지 않음 |
| [한국어 포켓몬 위키](https://pokemon.fandom.com/ko/wiki/포켓몬_위키) | 한글 명칭 대조 | 공식 게임 표기 우선, 영문 ID·버전과 매핑하여 오역/동명이명 확인 |

위 표는 역할별 참고 목록이며 모든 사이트의 모든 항목을 이번에 검증했다는 의미가 아니다. 이번에 [하나8번도로](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_8)와 PokéAPI 문서, Showdown·Essentials·RPG-JS·PokeWilds·pokeplatinum 저장소를 열어 확인했다. 개별 도시 구현 시에는 정확한 페이지 URL·게임 버전·확인일·원작 사실·프로젝트 변경·실행 여부·검증 여부를 한 행에 기록한다.

### 신오 211번도로·천관산·봉신마을 Pt 적용 — 2026-09-12 확인

- 참고 URL: [Bulbapedia · Sinnoh Route 211](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_211), [Bulbapedia · Mount Coronet](https://bulbapedia.bulbagarden.net/wiki/Coronet), [Bulbapedia · Celestic Town](https://bulbapedia.bulbagarden.net/wiki/Kannagi_Town), [Serebii Pokéarth · Route 211](https://www.serebii.net/pokearth/sinnoh/4th/route211.shtml), [Serebii Pokéarth · Celestic Town](https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml), [Bulbagarden Archives · DPPt maps](https://archives.bulbagarden.net/wiki/Category%3ADiamond%2C_Pearl%2C_and_Platinum_maps), [Bulbapedia · Platinum walkthrough Part 11](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Platinum/Part_11), [Bulbapedia · Platinum walkthrough Part 14](https://bulbapedia.bulbagarden.net/wiki/Appendix%3APlatinum_walkthrough/Section_14), [한국어 포켓몬 위키 · 211번도로](https://pokemon.fandom.com/ko/wiki/211%EB%B2%88%EB%8F%84%EB%A1%9C). 기본 대조 버전은 Platinum이며 확인일은 2026-09-12다. 한국어 위키 본문은 검색 색인으로만 확인했고 사이트 직접 접근은 차단되어 보조 명칭 근거로만 사용한다.
- 원작 사실: 211번도로는 서쪽 영원시티와 동쪽 봉신마을을 잇고 천관산이 두 구간을 나눈다. 서·동부는 풀밭·산길 구성과 음악이 다르며, 봉신마을은 중앙 유적과 신오의 옛 전승을 보존하는 작은 마을이다. 봉신마을의 서쪽 출구는 211번도로, 동쪽 출구는 210번도로다. Pt 본편의 봉신마을에는 오래된부적 전달, 갤럭시단과 태홍, 유적 조사와 파도타기 획득이 이어지지만 이 사건들은 현재 프로젝트에 자동 채택하지 않는다.
- 프로젝트 변경/적용: `tour_eterna` 동문→`tour_sinnoh_route_211_west`→`tour_coronet_211_pass`→`tour_sinnoh_route_211_east`→`tour_celestic` 서문으로 재구성했다. 원작 타일과 레벨을 복제하지 않고 서·동부 지형 대비, 천관산 두 지층 비교, 봉신 돌담·벽화 앞마당을 BW·BW2풍으로 표현한다. 현재 선택 트레이너 편성과 상금, 동료 지층 비교는 프로젝트 활동이며 원작 트레이너표·보상이 아니다.
- 구현/검증 상태: 네 MapId의 왕복 워프·표지·주민·선택전·동료 지층 기록·봉신 개발 지도 목적지와 표시 좌표를 구현했다. 집중 검사 4/4와 타입 검사, 봉신→211 동부→천관산 실제 보행·빠른 저장 재접속, 봉신 지도 직접 이동과 벽화 앞마당 화면을 확인했다. 전용 야생 조우, 봉신 유적 실내, 동쪽 210번도로 출구, 원작 본편 사건·조직전·HM 보상, 전 구간 자연 보행·전투 완주·음향은 아직 구현 또는 검증 완료가 아니다.

### 2026-09-13 · 신오 210번도로 북부 야생 생태

- 원작 근거: Serebii Pokéarth의 DPPt 210번도로 자료는 북부가 봉신마을 서쪽 출구와 이어지는 안개 구간이며, 플라티나 낮 보행 조우에 파비코·요가랑·비버통·알통몬·근육몬·스라크가 등장한다고 구분한다. 출처: https://www.serebii.net/pokearth/sinnoh/4th/route210.shtml
- 프로젝트 적용: 현재 런타임과 기술·이미지가 이미 지원되는 요가랑(307)·알통몬(66)만 `S-R210-NORTH-DAY`에 넣었다. Lv.20~22와 55/45 비율은 현재 봉신 여행 파티에 맞춘 재구성이며 원작 레벨·출현율 복제가 아니다.
- 제외 범위: 파비코·비버통·근육몬·스라크, 아침/밤 차이, 파도타기·낚시·포켓트레, 아이템과 본편 잠금은 적용하지 않았다. 조우 풀밭은 선택 안개 숲에만 두고 봉신↔210 남부 표시 본선은 안전하게 유지한다.

### 2026-09-13 · 봉신마을 생활 시설

- 원작 근거: [Serebii Pokéarth · Celestic Town](https://www.serebii.net/pokearth/sinnoh/4th/celestictown.shtml)과 [Bulbapedia · Celestic Town](https://bulbapedia.bulbagarden.net/wiki/Celestic_Town)을 대조했다. 봉신마을에는 포켓몬센터가 있고, 별도 프렌들리숍 대신 북서쪽 민가의 노부부가 물품을 판매하며, 중앙 유적과 전승을 보존하는 가족의 집이 주요 장소다.
- 프로젝트 적용: `tour_celestic_center` 28×22, `tour_celestic_shop` 24×20, `tour_celestic_home` 24×20을 추가했다. 센터는 회복·귀환점·PC, 민가 상점은 현행 공통 몬스터볼·상처약 거래, 전승가옥은 가족 기록·천관산 옛 지도·동료 휴게를 맡는다.
- 경계: 시간대별 원작 판매표, 안경·친밀도 관련 수령물, 난천과 가족의 본편 대사, 오래된부적·갤럭시단 사건·파도타기 보상은 열지 않았다. 시설 배치·대사·판매 품목은 현재 프로젝트 여행 흐름에 맞춘 재구성이다.

## 설화습지 선택 조우 — 2026-09-13

출처: https://www.serebii.net/pokearth/unova/mooroficirrus.shtml 및 https://bulbapedia.bulbagarden.net/wiki/Moor_of_Icirrus 본문을 조회했다. BW2 웅덩이 조우에는 쪼마리·딱정곤이 포함된다. B2 비겨울 비율20%/5%를 현재 지원하는 두 종만으로 정규화해80/20으로 사용한다. 원작 레벨54~57 대신 프로젝트23~24, 웅덩이 대신 서쪽 마른 가장자리 긴풀을 사용한다. 겨울·수상·낚시와 미지원 종은 미채택이다.

적용: tour_icirrus_moor, U-MOOR-DAY. runtime-local-pools 원본→runtime JSON→runtime-encounters→기존 야생전/포획과 출신 기록에 연결했다. unova-icirrus-moor의 terrain을 기존 필드/미니맵 렌더가 소비한다. 외부 코드/자산 재사용 없음. 자료 확인·코드 반영, QA 미실행. 경유는 [WORLD_ROUTES](WORLD_ROUTES.md), 선택 활동은 [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md)의 최신 설화습지 절 참조.

### 2026-09-13 · 210번도로 북부 협곡 횡단 표현

- 대상: 신오 봉신 진입 구간 `tour_sinnoh_route_210_north`; 기존 통과 좌표와 이벤트 유지.
- 출처/확인일/버전: [Bulbapedia Route 210](https://bulbapedia.bulbagarden.net/wiki/Sinnoh_Route_210), 2026-09-13 본문 Route description 및 Pt 지도 설명 열람. 북부 안개 협곡과 물 위를 건너 봉신으로 이어지는 다리 구성을 확인했다. Serebii의 `/sinnoh/pt/210.shtml` 접근은 실패했으므로 이번 근거로 삼지 않는다.
- 현재 차이/결정: 기존 굽은 통로는 흙길·나무·돌 위주였다. 원작의 협곡/다리 장소 특징을 반영하되 좌표와 폭은 기존 저장을 보존하는 프로젝트 재구성이다. `(23..33,25..30)` 기존 보행 칸 전체를 목재 다리로 표현하고, `(24..32,19..37)` 중 차단 칸에만 계류를 그린다. 원작 배치 복제·파도타기·안개 전투 효과·무장조 등 새 조우 추가를 뜻하지 않는다.
- 실제 연결: `src/sinnoh-route210-gorge-art.ts` → 기존 `sinnoh-celestic-art.ts`의 `paintSinnohCelesticDetails`에서 호출. 기존 충돌·워프·풀밭·미니맵 보행 경로 유지. 물은 통행 불가 배경이며 보이는 다리의 모든 바닥 칸은 기존 통과로다.
- 관련 기준: [WORLD_ROUTES](WORLD_ROUTES.md)의 봉신→210 북부→210 남부 경유와 [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md)의 도시 도착/동료/귀환 기준. 본편 사건 추가 없음. 목표 표현은 [BW·BW2](VISUAL_STYLE_BW_BW2.md)이며 완성도 달성 주장은 하지 않는다.
- 상태/재사용: 장소 자료 확인 및 코드 반영, QA 중단으로 플레이·시각·저장 검증 미실행. 외부 코드·이미지·자산 재사용 없음. 원작 장소 설명을 참고해 Canvas 그림을 새로 작성했다.
# 2026-09-13 관동 쌍둥이섬1F 조우 적용

- 대상: `tour_kanto_seafoam_1f` 기존 선택 곁길 두 곳.
- 출처/확인일/버전: https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml · 2026-09-13 · HGSS. 본문의1F Standard Walking에서 주뱃·골뱃·고라파덕·골덕 및 주뱃 Lv.26~28을 확인했다.
- 적용: 현재 지원 종 주뱃만 채택. Lv.22~24·주뱃100%·선택 암반 구역 두 곳은 레벨 상한25에 맞춘 프로젝트 조정이다. 원작 전체 종/가중치·수상이동·라디오·전설은 적용하지 않았다.
- 소비: `scripts/design/runtime-local-pools.json` 원본과 `src/runtime-pokemon-data.json` 소비 데이터에 같은 풀을 추가했다. 전체 재생성은 실행하지 않았다. `runtime-encounters.ts`의 MapId 바인딩→공통 야생 전투/포획/경험치, `kanto-seafoam-islands.ts`의 terrain→기존 동굴 조우 그림과 남부 painter로 연결한다. 새 종·기술 정의는 복제하지 않았다.
- 관련 기준: [이동 대장](WORLD_ROUTES.md), [사건 설계](MAP_STORY_DESIGN.md), [관동](KANTO_REGION_PLAN.md). 기존20번수로 경유/워프는 유지한다. 본편 완료·포획 잠금은 없다.
- 상태: 자료 본문 확인·코드 반영. 모든 QA 중단으로 테스트/빌드/플레이/저장/시청각 미실행. 코드·이미지 자산 재사용 없음.

## 설화습지 그루터기 길찾기 적용 — 2026-09-13

- 출처: https://bulbapedia.bulbagarden.net/wiki/Moor_of_Icirrus (2026-09-13 본문 Geography 및 BW/BW2 구분 열람). 원작 습지는8번도로 북쪽이며 웅덩이·그루터기가 지형 특징이다. 계절 결빙 설명은 이번에 채택하지 않았다. Serebii https://www.serebii.net/pokearth/unova/8.shtml 은 접근 실패로 미확인이다.
- 버전/차이: 기본 대조 BW2. 본문의 공통 지형 설명에서 그루터기만 참고했다. 원작 좌표/지도 재현이 아니라 기존56×48 프로젝트 습지의 서쪽 포획길과 동쪽 관찰길을 구별하는 재구성이다. 원작 전설 사건·계절 이동·아이템 보상은 적용하지 않았다.
- 실제 적용: tour_icirrus_moor의 기존 장애물(7,28)/(41,23)에 이끼/갈라진 그루터기 props와 그림을 함께 등록했다. unova-icirrus-moor.ts → explore-art.ts의 paintIcirrusMoor, icirrus-moor-life.ts → journey-services.ts의 기존 핸들러가 소비한다. tourIcirrusMoorWestStump / tourIcirrusMoorEastStump 조사에서 현지 풀숲/관찰길 설명과 기존 목적지 안내를 제공한다. 발판은 조우 지형을 덮지 않는다.
- 연결 기준: [WORLD_ROUTES](WORLD_ROUTES.md)의8번도로↔설화습지 왕복 유지. [MAP_STORY_DESIGN](MAP_STORY_DESIGN.md)의 설화 선택 생활 활동 범위이며 본편 완료 플래그를 추가하지 않는다. 맵 치수·보행·조우표·워프·저장 구조 유지.
- 재사용/상태: 외부 코드·이미지 재사용 없음, 직접 작성한 Canvas 그림. 자료 확인 및 코드 반영, 테스트·빌드·브라우저·저장·시청각 QA 미실행. 도시 완료 아님.

## 2026-09-13 천관산211 선택 암반길

- 출처: https://bulbapedia.bulbagarden.net/wiki/Mount_Coronet (2026-09-13 확인, DPPt 지리/북부1F 구분 참조). 천관산은211번도로 및 영원·봉신 사이를 잇는 동굴 지리를 가진다.
- 프로젝트 차이: `tour_coronet_211_pass` 56×48의 독립 통과층과 지층 관찰은 프로젝트 재구성이다. 원작의 북부1F 타일 복제나 HM 조건 적용이 아니다. 기존 십자 본선의 양쪽에2칸 폭 암반 순환길을 열어 기존 서쪽/동쪽 조사 위치로 돌아오게 했다.
- 적용: `openCoronet211SurveyTrails`→`installSinnohCelesticRoute`에서 실제 walkable 수정→`paintSinnohCelesticDetails`가 같은 walkable로 암반/바닥 표현. 기존 coronet211WestLayer/EastLayer 이벤트와 모든 워프·기존 바닥 보존. 신규 종/보상/본편 플래그 없음. 코드 반영·QA 전부 미실행.

## 2026-09-13 천관산211 동굴 조우

- 출처: https://bulbapedia.bulbagarden.net/wiki/Mount_Coronet#Northern_1F_room_1_(Eterna_City_-_Celestic_Town_side), 확인2026-09-13, Pt 북부1F 영원·봉신 측. 주뱃·알통몬·꼬마돌·요가랑이 원작 표에 존재한다.
- 프로젝트: 지원 중인 네 종만 선택, Lv16~18와 비중10/20/40/30은 프로젝트 조정이다. 원작 전체 조우율/종별 레벨·시간 변화 재현이 아니다.
- 적용: LOCAL-S-CORONET-211 원본→runtime-pokemon-data pools→runtime-encounters의 tour_coronet_211_pass 바인딩. 동쪽 선택 암반길 (37,28) 2×4에 조우 terrain, 공통 동굴 바닥 표시·포획·성장 소비. 본선/지층 조사/워프와 맵56×48 유지. 현지 동료는 기존 관찰 선택과211/210 선택 트레이너 준비에 사용할 수 있으며 강제 포획 조건은 없다.
- 상태: 코드·데이터 반영, source manifest 해시 갱신. 전체 exporter·테스트·빌드·브라우저·저장 QA 모두 미실행.

## 쌍둥이섬 B1F 생태 연결 — 2026-09-13

출처 https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml 의 HGSS B1F Standard Walking(2026-09-13 열람): 쥬쥬30% Lv32~34, 주뱃10% Lv28~29. 프로젝트는 지원 두 종을75/25로 정규화하고 현재 성장 범위에 맞춰 Lv23~24로 조정한다. 다른 원작 종·시즌·수상 조우·진화는 포함하지 않는다.

`runtime-local-pools.json` LOCAL-K-SEAFOAM-B1F → runtime pools/ownable86 → `runtime-encounters.ts` → `tour_kanto_seafoam_b1f` 기존 선택 회랑(16,12)5×3 terrain을 연결했다. 기존 공통 동굴 조우 그림/포획/성장/PC를 사용한다. `cinnabar-research.ts`의 현지 동료 준비에 지하1층 실제 출신을 포함해 기술 편성·선두 선택으로 이어진다. 계단·본선·관찰 지점·맵 크기 유지. 쥬쥬는 박치기·울음소리·얼음뭉치만 현 지원이며 전체 원작 기술 구현이 아니다. BW 앞/뒤 이미지 출처는 pokemon-runtime-sources.json. 코드 반영·QA 전부 미실행, 자연 포획/전투/저장과 난이도 미확인.


### 쌍둥이섬 B2F 선택 조우 — 2026-09-13
- 출처: https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml (HGSS B2F 본문, 2026-09-13 확인). 원작 쥬쥬30% Lv33~35, 주뱃10% Lv29~30; 다른 세 종도 등장한다.
- 프로젝트: 지원 부분집합 쥬쥬75%/주뱃25%, Lv24~25. `tour_kanto_seafoam_b2f`의 (18,19)3×4 선택 암반 회랑만 연결. 기존 서쪽 본선·워프·조사물은 유지.
- 적용: runtime-local-pools → runtime-pokemon-data → runtime-encounters, 기존 동굴 terrain 렌더링/조우 소비. 홍련 연구·해안 수첩이 지하2층 포획 출신을 읽으며 `tourSeafoamB2Water`에서 실제 풀을 안내한다.
- 원작 전체 조우표/퍼즐/트레이너 재현이 아니다. QA 중단으로 실행·보행·포획·저장·시각 미검증.


### 홍련 현장 원작 경계 재확인 — 2026-09-13

- URL: https://bulbapedia.bulbagarden.net/wiki/Cinnabar_Island
- 확인일: 2026-09-13. HGSS 관련 본문과 연결 장소 표를 읽음. 지도 이미지 타일 대조는 하지 않음.
- 원작: 성도 배경 게임의 홍련은 분화 피해를 입었고 강연은 쌍둥이섬으로 체육관을 옮겼다. 북쪽21번수로/동쪽20번수로 연결이다.
- 프로젝트 차이: 기존 연구 시설과 채택 CH03의 비공개 구조 현장은 넥서스 재구성이다. HGSS의 존속 건물/정사 사건처럼 설명하지 않는다.
- 적용: `tour_cinnabar_control_site` 계획, KANTO_REGION_PLAN의 중앙 실행 계약. 현재는 설계·배정 단계이며 코드 등록/QA 완료가 아니다. 원작 연결과 현재 프로젝트 출구 방향은 WORLD_ROUTES에서 별도로 관리한다.


## 2026-09-13 설화 남쪽 랜드마크 대조

- 출처: https://bulbapedia.bulbagarden.net/wiki/Icirrus_City 본문 Connecting locations 및 도입 지리 설명을 직접 열람했다. 기본 대조 BW2이며, 남쪽 풍차와 습한 저지대 때문에 높은 곳에 놓인 건물 설명은 도시 공통 본문이다.
- 원작 사실: 남쪽 풍차가 도시의 시각 요소다. 이번에 원작 풍차 좌표·크기·날개 애니메이션을 확인한 것은 아니다. https://www.serebii.net/pokearth/maps/unova/40.png 를 열었으나 도구에 이미지가 표시되지 않았다. 지도 이미지 대조는 미완료다.
- 프로젝트 적용 대상: tour_icirrus, icirrusPlan의 남쪽 귀환 부조 영역. 기존 안내 기능과 길을 보존하며 풍차/작은 안내판으로 보수하도록 담당에 배정했다. 이 기록 시점에는 구현 대기이며 별도 인계 없이 적용 완료로 해석하지 않는다. 외부 이미지·코드 재사용 없음. QA 중단 유지.

- 후속 코드 반영: 기존 explore-art 호출에서 남쪽 풍차 painter를 소비한다. 첫 배치는 남쪽길과 겹쳐 잘림 위험이 있어, 최종 실루엣을 기존 비보행 타일34..36/34..35의3×2 범위로 수정했다. 전체 받침·기둥·날개는36행 보행로 위쪽에 들어간다. 기존 tourOutdoor3는 작은 안내판 한 곳으로 모아 기존 이벤트를 유지했다. 정지 표현이며 화면 검증·원작 지도 이미지 대조는 여전히 미완료다.

### 황토 안내소 예비 전원 현장 중앙 연결 (2026-09-13)

- 출처: https://bulbapedia.bulbagarden.net/wiki/Mahogany_Town — 2026-09-13 확인, HGSS 구분. 원작 황토는 서쪽 42번·북쪽 43번·동쪽 44번도로 및 기념품점 아래 로켓단 기지가 연결된다.
- 프로젝트 차이: `tour_mahogany_hall`의 예비 전시등/출입 유도등 선택과 주민 안전 도착은 넥서스 추가 사건이며 원작 기지 재현이나 로켓단 사건 전체 완료가 아니다. 기존 교통 조건을 변경하지 않는다.
- 적용: `src/mahogany-power.ts`, `src/mahogany-power-art.ts`와 `engine.ts` 매 프레임 갱신, `maps.ts` 저장별 NPC 투영, `renderer.ts` 보간 좌표·가구·조명 레이어. 사건 계약은 MAP_STORY_DESIGN의 CH05 황토 실행 설계를 따른다. 코드 연결, QA 중단으로 실행·저장·화면은 미검증.

### 구름 하수도 경유 공원 복원 착수 (2026-09-13)

- 확인 URL: https://bulbapedia.bulbagarden.net/wiki/Castelia_Sewers (In the games/Pokémon), https://bulbapedia.bulbagarden.net/wiki/Castelia_City. BW2 하수도는 Thumb Pier에서 진입하며 공원 출구가 있다. 원작은 체육관 앞 Clyde 대화 이후 진입, 최초 Hugh 동행, 계절별 수위 차이를 가진다.
- 현재와의 차이: 기존 북쪽 지상 정원은 프로젝트 각색이며 하수도 경유 공원이 아니다. 원작 걷기 조우는 꼬렛45/주뱃45/질퍽이10, Lv14~17. 현재 소비 가능한 종과 성장 수준은 별도 대조한다.
- 적용 상태: 하나 담당에 실제 구름→하수도→공원 왕복 구현 배정. 아직 구현 완료나 독립 MapId 등록 완료가 아니며 크기·연결·조우 계약 수신 후 중앙 연결한다. 계절·파도타기·Hugh 동행·Clyde 잠금은 이 배정만으로 구현되지 않는다. QA중단.

### 구름 공원 W2 일반풀 공통 데이터 (2026-09-13)

https://bulbapedia.bulbagarden.net/wiki/Castelia_City#Castelia_Park 본문·조우표 확인. 하수도 경유·건물에 둘러싸인 공원·중앙 나무와 좌우 풀밭이 원작 구조다. W2 일반풀의 꼬렛30%(15·16), 이브이5%(18), 에나비15%(15·16), 콩둘기15%(15·16), 치릴리35%(15·16·17)를 `U-CASTELIA-PARK-W2`로 작성했다. B2 이어롤/소미안과 섞지 않는다. 종별 `levelChoices` 소비.

이브이·에나비 데이터와 기존 pinned sprite exporter 자산 생성까지 반영(58종·51풀·54기술), 원본 URL·해시는 pokemon-runtime-sources.json. 두 종 BW2 습득표를 사용하되 지원 기술 필터·진화 제한은 유지한다. 원작 진한풀 더블배틀·흔들리는 풀·선물 이브이·진화가 구현된 것은 아니다. MapId 바인딩은 지역 코드 준비 후 적용. QA미실행.
