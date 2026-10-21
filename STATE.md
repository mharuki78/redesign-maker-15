# 배곧 상세페이지 리디자인 마법사 — 현재 상태

- 최종 갱신: 2026-10-21 Asia/Seoul
- 작성자: Codex
- 통합 담당: Codex · redesign-models-20261021
- 진행 중 작업: 이미지 생성·편집 모델 최신화

## 목표와 완료 기준

최신 공식 이미지 모델을 UI와 새 생성·기존 이미지 편집에 함께 적용하고, 지정 GitHub 저장소와 배곧 운영 프로젝트에 반영한다.

## 현재 상태

- 구현: OpenAI Image 2.5 Sunburst와 Google Nano Banana 2.1, 공통 모델 목록·어댑터 적용.
- 검증: 실제 route handler의 공급자 모의 테스트 8개, Next 빌드·타입 검사 통과. Chrome PC와 390px 모바일에서 모델 선택·설정 표시 확인. 모바일 가로 넘침 없음. Impeccable 변경 파일 검사 결과 `[]`.
- 미완료: Git push, 운영 배포 확인.

## 유지할 결정

수정 저장소는 `mharuki78/redesign-maker-15`, Vercel은 `himawari5/baegot-redesign-maker`. 사용자 API 키·기존 저장 작업과 provider 값을 유지한다. [결정](DECISIONS.md).

## 다음 행동

main에 push하고 해당 커밋의 배곧 운영 배포와 실제 인트라넷 화면을 확인한다.

## 막힌 점 · 미확인

- 실제 유료 공급자의 이미지 생성은 미실시. 이번 검증은 요청 계약과 응답 처리, 화면에 한정한다.
- 새 세션의 HIA 자동 로딩은 미실시. 기존 Figma 파일 URL이 없어 Figma 자산 조회는 미실시.

## 산출물과 근거

[작업 기록](logs/2026-10-21-image-model-update.md), `tests/image-models.test.cjs`.

## 실행 환경과 재개 조건

`C:/project/redesign-maker-15`, Next 16.2.4, 로컬 `http://localhost:3002/redesign/15`. 민감정보는 기록하지 않는다.
