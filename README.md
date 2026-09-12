# Pokémon Nexus

2026-09-10 크기 기준 보완: [맵 크기 기준·전체 대장](docs/MAP_SIZE_STANDARDS.md)에 사용자 참고표보다 넓힌 유형별 범위, 현재402개 맵의 실제/목표 크기, 신규 도로·던전의 층별 크기를 명시했다. 이 문서의 현재 크기 기록은 이력이며 새 목표 크기는 해당 대장을 따른다. 게임 확대는 미적용이다.

포켓몬 세계관에 맞는 Nintendo DS DP/플라티나풍 팬게임입니다. **맵·스토리 구현과 실제 적용을 우선하고, 지방별로 시티·마을 하나씩 완성합니다.** 도시의 포켓몬·주민·디자인과 진입 도로·동굴·다음 여행을 함께 만듭니다.

지역별 야생 포켓몬·첫 진화·기술 교체·박스/도감, 도시 사이 통로와 상점·층별 실내를 플레이에 연결했습니다. [현재 데이터 지원 범위](docs/WORLD_DATA_STANDARDS.md)와 [도시 재개 기록](docs/CONTINUE_STATE.md)에서 확인할 수 있습니다.

## 실행

```powershell
npm.cmd install
npm.cmd run dev
```

## 문서

- [플레이 안내](docs/GAMEPLAY.md)
- [개발 기준](docs/DEVELOPMENT.md) · [스토리 기준](docs/STORY.md)
- [전체 지도](docs/WORLD_TOUR.md)
- [맵·스토리 개발 설계](docs/MAP_STORY_DESIGN.md) · [웹 참고 자료와 조사 근거](docs/REFERENCE_RESEARCH.md)
- [설계 데이터베이스](docs/개발용_데이터베이스_안내.md)
- [작업 규칙](docs/AGENTS.md) · [자동 운영](docs/AUTONOMOUS_WORKFLOW.md) · [배정 상태](docs/PROJECT_STATE.md)
- [문서 책임·충돌 해결과 전체 목록](docs/README.md)

## 검증

QA는 도시의 계획된 구현을 모두 끝낸 뒤 아래 검사와 도시 플레이를 모아서 수행합니다. 변경마다 반복하지 않습니다. [도시 완료 기준](docs/DEVELOPMENT.md#0-최우선-목표와-지방도시-작업-단위)과 [QA 규칙](docs/AGENTS.md#검증과-도시-완료)을 따릅니다.

```powershell
npm.cmd test
npm.cmd run build
```
