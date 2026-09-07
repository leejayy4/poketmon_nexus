# auto-0004-art — 리조트데저트 유적 암반 및 샌드스톤 비주얼 구현

- 회차: `auto-0004-art`
- 담당: Art Director
- 일자: 2026-09-07
- 상태: 그래픽 렌더링 함수 구현·전용 테스트 추가·빌드 및 회귀 검증 통과 완료
- 범위: `src/explore-art.ts`에 하나 지방 `tour_desert`(리조트데저트) 고유 암반 및 유적 샌드스톤 렌더링 함수 `paintDesertRuinsRock` 구현.

## 문제와 근거

- **기존 문제**: 직전 회차(`auto-0003-map`)에서 리조트데저트에 유적 사물(기둥·모래언덕·석벽)이 배치되었으나, 렌더링 시 천관산 동굴의 차가운 회색 암반 팔레트(`rock()`, `#5b6770`)가 그대로 그려져 사막 유적의 따뜻한 풍경과 어울리지 않았음.
- **해결**:
  - Nintendo DS (포켓몬 BW 고대의 성 / 리조트데저트) 감성에 맞춘 **따뜻한 사암(Sandstone)·테라코타 렌더러 `paintDesertRuinsRock`** 구현.
  - 상단 햇빛 하이라이트(`#e5d3a8`), 사암 기본체(`#c8ad7f`), 풍화된 테라코타 그림자(`#8a6b46`, `#6e5233`), 고대 석조 층위 몰탈선(`#f4e7c5`, `#7e5f3c`) 및 기둥 음각 홈 연출.
  - 리조트데저트의 기존 2x2 암반 및 3개 신규 유적 사물에 적용.

## 수정 파일

- `src/explore-art.ts`: `paintDesertRuinsRock` 구현 및 `tour_desert` 렌더링 분기 적용.
- `tests/desert-art.test.ts`: [신규] 샌드스톤 팔레트 계층 및 바운딩 박스 렌더링 테스트 추가 (300번째 테스트).
- `docs/DEVELOPMENT.md`: 75절 추가.

## 검증 결과

- `npm.cmd test`: **300/300 통과** (회귀 0, 신규 테스트 통과).
- `npm.cmd run build`: Vite & TypeScript 컴파일 통과.
- 다음 담당: **Gameplay Designer 겸 QA Lead** (`auto-0005-qa`)
