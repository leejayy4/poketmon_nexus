# 원작 조사 자료와 적용 근거

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
| 신오 | Pt. DP/BDSP 차이는 별도 주석 | 현재 네 배지·관측 자료 계약 유지, 원작 사건의 채택 여부를 별도 기록 | DP/Pt 카메라·타일·건물 비율 |
| 관동 | FRLG의 도시·시설 시점을 기본 설계로 사용 | HGSS 시간 경과를 자동 도입하지 않음. 홍련의 재난 이후 모습·보라 시설 등은 FRLG와 혼합하지 않음 | HGSS의 DS 표현을 참고하되 시설 존재는 FRLG 기준 |
| 성도 | HGSS | 금빛 라디오 생활과 원작 조직 점거 사건을 구분 | 목조 도시·숲·해안·전통 탑 |
| 하나 | B2W2 | BW의 본편 사건과 혼합하지 않음. B2/W2별 가용종·리버스마운틴 차이는 개별 맵 착수 때 한쪽 선택 또는 명시적 프로젝트 변형 | B2W2 공간 정체성을 DP/Pt 화면 비율·음영으로 표현 |

영문 원명·현행 한국어 표시·목표 한국어 표시·참조 버전·URL·확인 상태를 명칭 이행표에 둔다. `Chargestone Cave`와 `Mistralton Cave`는 각각 전기돌동굴과 궐수의동굴로 구분한다. 현재 ‘영원숲’과 자료의 ‘영원의숲’ 같은 표기 차이도 저장 출처 문자열을 확인한 뒤 표준화한다.

## 5. 데이터 조사에서 실제 적용까지

PokéAPI의 `location-area`에는 버전별 조우와 방식·조건 관계가 있고, 기술에는 습득 버전 그룹이 있다. 이 자료에서 지도 출구나 스토리 플래그를 추론하지 않는다. 실제 수집 계약은 [공식 v2 문서](https://pokeapi.co/docs/v2), 프로젝트 생성 경로는 [WORLD_DATA_STANDARDS](WORLD_DATA_STANDARDS.md)를 따른다.

조사 기록의 최소 필드는 `sourceUrl / accessedAt / gameVersion / locationArea / encounterMethod / condition / species / sourceLevel / projectLevel / projectWeight / implementationStatus`다. 서식 참고 종이 런타임에 없으면 후보로 남기고, 스프라이트·기술·타입·저장 검증까지 갖춰야 조우를 켠다. 원작 확률과 프로젝트 가중치를 같은 숫자 열에 덮어쓰지 않는다.

이번에는 웹 자료 읽기·소스 조회·런타임 맵 목록의 메모리 내 집계만 수행했다. 데이터를 수집·재생성하거나 이미지·음악을 게임 자산에 추가하지 않았다. 아래 설계의 크기·루프 수·조작 방식·동료 활동은 원작 사실이 아니라 프로젝트 제안이다.
