# Agent Collaboration Rules

이 프로젝트에서 Codex, Claude Code 등 코드 에이전트는 루트의 `CLAUDE.md`를 공동 작업 규칙으로 따른다.

특히 아래 원칙은 반드시 지킨다.

- 기본 작업은 로컬 `http://localhost:3002/`에서 확인한다.
- 사용자가 명시적으로 요청하기 전에는 라이브 배포하지 않는다.
- 민감정보와 사용자 API 키를 커밋하지 않는다.
- 디자인 변경은 `DESIGN_GUIDE.md`를 따른다.
- 서비스명은 `한이룸의 상세페이지 리디자인 마법사 1.0`으로 유지한다.

<!-- HIA:START -->
## 현재 배곧 운영 기준

- 시작할 때 `HIA-RULES.md`와 `STATE.md`를 읽는다. 의미 있는 변경과 검증은 `logs/`에 기록한다.
- 사용자가 확정한 배곧 브랜드 적용을 유지한다. 위의 기존 한이룸 서비스명 지침보다 최신 사용자 지시가 우선한다.
- 이 도구의 변경은 매번 `https://github.com/mharuki78/redesign-maker-15.git`에 반영한다.
- 최신 이미지 모델 규칙은 `CLAUDE.md` 6절과 `src/lib/image-models.ts`를 따른다.
- 운영 배포 대상은 `himawari5/baegot-redesign-maker`이며 다른 원저작자 scope를 사용하지 않는다.
<!-- HIA:END -->

