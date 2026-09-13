# 관동 기존 수로·동굴 표현 보수

2026-09-13. 범위: 기존 19·20번수로, 쌍둥이섬 외부/다섯 층, 홍련 상륙로. 확대·새 맵 추가 없이 구현했다. 테스트·타입 검사·빌드·브라우저·저장·시청각 QA는 실행하지 않았다.

## 원인과 변경

- `src/explore-art.ts`의 `PASSAGES` 조기 반환이 새 수로/동굴을 공통 통로 표현으로 처리했다. 새 `src/kanto-south-art.ts`는 19번 북부 모래 해안, 두 수로의 목재 갑판·경계 난간, 보행 불가 바다, 섬 외부 해안·암반, 동굴 마른 바닥·층리 얼음벽을 구분한다. 보행 가능 칸에는 수면을 칠하지 않는다.
- 계단 그림 없이 좌표만 있던 동굴 워프에 계단을, 외부 입구에 어두운 개구부를, 항로 경계에 마른 갑판 연결 표식을 그린다. 실제 `map.warps`에서 위치를 읽는다.
- 홍련 가장자리 전체를 수면으로 칠하는 기존 분기로 서쪽 상륙로가 물처럼 보였다. `paintCinnabarLanding`은 기존 남서 보행 칸만 목재 데크로 덮고 북쪽/동쪽 기존 출구도 마른 발판으로 표시한다.
- `src/kanto-seafoam-islands.ts`는 조사 props를 생성하면서 `outdoors.objects`에는 빈 배열을 넣었다. 층별 원본 objects를 보관·등록해 조사문 조회가 같은 데이터를 사용하게 수정했다.

## 중앙 연결 요청

중앙 소유 `src/explore-art.ts`는 직접 수정하지 않았다. 아래 연결을 중앙 담당에게 전송했다.

```ts
import { paintKantoSouthPassage,paintCinnabarLanding } from './kanto-south-art';
// buildExploreArt: 반드시 공통 if(PASSAGES[id])보다 먼저
if(paintKantoSouthPassage(c,map))return canvas;
// 일반 도시 지형/건물/조사물 작업 후, 마지막 return canvas 전
paintCinnabarLanding(c,map);
```

전용 painter 작성과 실제 호출 연결은 구분한다. 전달 시점에는 중앙 연결 대기이며 화면 적용/품질 검증 완료가 아니다. renderer.ts·region-atlas.ts·AGENTS·CONTINUE_STATE·PROJECT_STATE도 수정하지 않았다.

## 원작과 프로젝트 경계

확인일 2026-09-13, 기본 대조 HGSS: https://www.serebii.net/pokearth/kanto/4th/seafoamislands.shtml . 해당 자료는20번수로의 다층 동굴, 1F/B1F/B2F/B3F/B4F와 별도 체육관, Surf/Strength를 구분한다. 이번에 원작 자산을 복사하지 않았다.

현재 프로젝트의 연락선 명칭·마른 갑판 보행과 B4F를 경유하는 단순 왕복 계단은 원작 수상/바위 퍼즐 재현이 아니다. 이번 수정은 기존 보행 계약을 시각적으로 읽게 하는 보수이며 실제 배 운항·파도타기·퍼즐·체육관·조우를 추가하지 않는다. 선형 통로의 탐험 밀도, 층별 수역과 퍼즐, 전용 스프라이트, 홍련 전체 도시 구성은 여전히 후속 과제다.
