# 뭉탱이

공동구매 모집, 채팅, 구매 승인 흐름을 제공하는 React + Vite 앱입니다.

## 실행

```bash
npm install
npm run dev
```

## API 연결

앱은 API 기본 경로 `/api`와 WebSocket 경로 `/ws`를 사용합니다. 개발 중 프록시를 사용하려면 `.env.example`을 `.env.local`로 복사한 뒤 `VITE_API_PROXY_TARGET`, `VITE_WS_PROXY_TARGET`, `VITE_UPLOADS_PROXY_TARGET`을 백엔드 주소에 맞게 설정하세요. Vite를 다시 시작해야 설정이 적용됩니다.

프록시 대신 브라우저에서 백엔드를 직접 호출하려면 `VITE_API_BASE_URL`에 `/api`가 포함된 API 주소를 지정하고, WebSocket은 `VITE_WS_BASE_URL`에 `wss://호스트/ws/groups/{id}` 형태로 지정할 수 있습니다. 직접 연결 시 백엔드가 CORS와 WebSocket 연결을 허용해야 합니다.

인증 토큰은 로그인 성공 후 브라우저 로컬 저장소에 저장되며, 보호된 요청에 Bearer 헤더로 전달됩니다. API는 명세서의 `{ success, data }` 성공 응답과 `{ success: false, error }` 실패 응답 형식을 사용합니다.

## 연결 기능

- 회원가입, 로그인, 로그아웃, 내 정보 조회 및 수정
- 모집방 목록 검색·페이지 이동·상세 조회·참여·작성·삭제
- 이미지 업로드, 수량·모집 인원 검증, 마감 시간 입력
- 내 채팅방, 구매 내역, 내가 만든 모집방 및 알림
- 채팅 기록과 WebSocket 실시간 메시지, 구매 요청·승인, 채팅 나가기
- 가상 코인 충전 및 잔액 표시

## 검사

```bash
npm run lint
npm run build
```