# Pokémon NEXUS

DS 시대 BW·BW2풍의 화면과 포켓몬 여행을 바탕으로 만드는 TypeScript/Vite/Canvas 싱글플레이 팬 RPG입니다.

목표는 신오→관동→성도→하나의 **32배지·4리그 본편**, 신오 귀환·넥서스 최종장, 엔딩 뒤 작은 고려의 **4배지 여행**입니다. 탐험·포획·육성·진화·배틀과 주민·라이벌·독립적인 포켓몬 이야기를 연결합니다.

**현재는 부분 구현된 프로토타입을 활용해 제작 체계를 재정립한 단계입니다.** 전체 목표가 구현됐다는 뜻은 아닙니다. 기술 방향은 기존 기반의 부분 재설계(HYBRID), 다음 제작 목표는 새 게임부터 무쇠 첫 배지와 귀환까지입니다.

![기존 전투 화면 기록](tests/first-adventure-screenshots/battle.png)

이 화면은 과거 구현 기록이며 최신 첫 제작 구간의 수용 증거가 아닙니다.

## 개발을 이어갈 때

[문서 안내](docs/README.md) → [비전·결정](docs/NEXUS_GOAL.md) → [현재 상태](docs/PROJECT_STATE.md) → [제작 계획](docs/STORY_AXIS_ROADMAP.md)을 확인합니다. 작업에 필요한 전문 문서만 추가로 읽습니다.

- [기술·저장 이행 계약](docs/DEVELOPMENT.md)
- [채택된 메인 서사](docs/story/NEXUS_MAIN_STORY_CANON.md)
- [도시 제작·완료 기준](docs/MAP_STORY_DESIGN.md)
- [첫 배지 제작 구간](docs/FIRST_BADGE_SLICE.md)
- [짧은 인계](docs/CONTINUE_STATE.md) · [작업 규칙](docs/AGENTS.md)
- [기존 조작·플레이 안내](docs/GAMEPLAY.md)

## 로컬 실행

```powershell
npm.cmd install
npm.cmd run dev
```

현재 게임 QA는 중단 상태입니다. 문서 정리로 테스트·빌드·브라우저·저장 검증이 재개되지는 않습니다. 검증 재개 후에는 도시 완성 시 관련 검사와 실제 여정을 함께 확인합니다.

비공식 비상업 팬 프로젝트입니다. Pokémon 및 관련 상표의 권리는 각 권리자에게 있습니다.
