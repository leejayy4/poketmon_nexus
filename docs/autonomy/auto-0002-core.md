# auto-0002-core — 장막 관측 연구원 전달 완료 분기 및 UX 개선

- 회차: `auto-0002-core`
- 담당: Core Developer
- 일자: 2026-09-07
- 상태: 코드 개선·테스트 추가·빌드 완료
- 범위: `sinnoh-story.ts`의 `observation` 이벤트에서 `researchDelivered` 상태에 따른 재대화 분기 추가.

## 문제와 근거

- **기존 문제**: 네 체육관 클리어 후 장막 관측 연구원에게 관측 자료를 받아 축복시티 연구 통로 안내원에게 전달(`researchDelivered=true`)했음에도 불구하고, 장막 관측 연구원에게 다시 말을 걸면 계속해서 "관측 자료를 맡길게요. 축복시티 연구 통로 안내원에게 전해 주세요"라는 최초 부탁 대사를 반복함.
- **해결**: `g.save.flags.researchDelivered`가 `true`인 경우 "자료를 무사히 전달해 주셨군요. 축복과 운하에서 조사가 시작되었어요." 및 다른 지방 탐방 격려 대사를 출력하도록 분기 추가.

## 수정 파일

- `src/sinnoh-story.ts`: `observation` 핸들러에 `researchDelivered` 분기 추가.
- `tests/sinnoh-front.test.ts`: 자료 전달 완료 후 관측 연구원 재대화 시 정상적으로 전달 완료 안내를 표시하는지 검증하는 assertion 추가.

## 검증 결과

- `npm.cmd test`: 296/296 통과 (회귀 없음, 신규 분기 검증 완료).
- `npm.cmd run build`: Vite 및 TypeScript 컴파일 성공.
