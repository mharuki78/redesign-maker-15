# 이미지 모델 최신화

- 날짜·시간대: 2026-10-21 Asia/Seoul
- 작업ID: redesign-models-20261021
- 작성자·담당: Codex / 리디자인 마법사

## 사용자 확정

이미지 생성 모델을 최신으로 변경하고, 리디자인 마법사의 변경은 항상 `mharuki78/redesign-maker-15`에 반영한다.

## 구현과 검증

- 공식 OpenAI Images API와 Google 이미지 생성·Interactions 문서를 확인했다.
- UI·새 생성·섹션 수정을 공통 모델 목록과 이미지 어댑터로 연결했다.
- Google의 텍스트·참조 이미지 입력, 출력 비율, REST steps 응답 처리를 적용했다. 서버 대화 저장은 사용하지 않는다.
- 기존 사용자 요청문·제품 우선 참조 순서·키 전달·비JSON 오류 처리를 유지했다.
- 테스트: 구형 모델에서 성공 경로 4개 실패 → 수정 후 6개 통과. 빌드에서 남아 있던 Google 분석 모델 참조를 발견했고, 새 작업의 분석 경로 테스트를 추가해 실패를 확인한 뒤 Interactions JSON 텍스트 응답으로 수정했다. 최종 8개 통과. 실제 유료 요청은 하지 않았다.
- Next production build와 TypeScript 검사 통과. Chrome에서 두 모델의 선택 상태, API 키 설정 문구를 확인했다. 390px 모바일의 본문 폭 375px로 가로 넘침 없고 Google 버튼은 두 줄로 정상 표시된다.
- Impeccable 변경 파일 검사 결과 `[]`. 로컬 증거: `output/model-update/local-desktop.png`, `local-mobile.png`.
- HIA 운영 규칙·상태·결정을 이 프로젝트 안에 초기화했다. 기존 AGENTS/CLAUDE 백업과 SHA-256 manifest는 `backups/hia-*`에 있으며 Git에서 제외한다. 기존 지침은 표시 바깥을 보존하고 CLAUDE의 모델 규칙만 사용자 요청에 따라 갱신했다.
- 새 세션 자동 로딩과 Figma 자산 조회는 미검증.

## 운영 검증

- 코드 커밋 `f18b39d46135b5192a6cf230c07309179caf5302`: origin/main 일치 확인.
- 배포 `dpl_9SH4pXUGJ6AaDSu8GFs7nLfWWBuw`: project `prj_CuXYaU9hKDC8x0FCb6Qg1dec9pkD`, production, 동일 SHA, READY. `baegot-redesign-maker.vercel.app` alias 정상.
- Chrome의 새 검증 탭에서 `https://baegotint.com/automation/redesign-maker` → 새 리디자인 → 생성 옵션을 열어 OpenAI Image 2.5와 Google Nano Banana 2.1을 확인했다. Google 버튼 선택 상태를 확인했다. 기존 사용자 작업 탭은 새로고침하거나 수정하지 않았다.
- 증거 `output/model-update/production.png`. 로컬 검증 탭과 포트 3002 서버 종료, 임시 viewport reset 완료. 운영 결과 탭은 열어 두었다.

## 미확인과 다음 행동

필수 구현·배포 완료. 실제 유료 이미지 생성 품질, 새 세션 HIA 자동 로딩, Figma 자산 조회는 미검증. 다음 사용자 요청을 기다린다.
