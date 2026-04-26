# every-carrot


## 페이지 구성

| 페이지 | 경로 | 접근 권한 | 주요 기능 |
|--------|------|----------|-----------|
| 메인 (물품 목록) | `/` | 모두 | 물품 목록, 검색, 카테고리 필터 |
| 로그인 | `/login` | 비로그인 | 이메일/비밀번호 로그인 |
| 회원가입 | `/register` | 비로그인 | 학교 이메일 인증 + 가입 |
| 물품 등록 | `/products/new` | 로그인 | 물품 정보 입력 + 사진 업로드 |
| 물품 상세 | `/products/:id` | 모두 | 물품 정보 + 채팅하기 버튼 |
| 물품 수정 | `/products/:id/edit` | 작성자만 | 물품 정보 수정 |
| 채팅 목록 | `/chats` | 로그인 | 내 채팅방 목록 |
| 채팅방 | `/chats/:id` | 참여자만 | 실시간 1:1 채팅 |
| 마이페이지 | `/profile` | 로그인 | 프로필 수정, 내 물품 목록 |

---

## API 엔드포인트 목록 (초안)

### 인증
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/verify-email` | 이메일 인증코드 확인 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/auth/refresh` | 토큰 갱신 |
| POST | `/api/auth/send-verification` | 이메일 인증 코드 발송

### 사용자
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/users/me` | 내 프로필 조회 |
| PUT | `/api/users/me` | 프로필 수정 |
| GET | `/api/users/:id` | 특정 사용자 조회 (채팅방 상대 프로필)

### 물품
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/products` | 물품 목록 (검색, 필터, 페이지네이션) |
| GET | `/api/products/:id` | 물품 상세 |
| POST | `/api/products` | 물품 등록 |
| PUT | `/api/products/:id` | 물품 수정 |
| DELETE | `/api/products/:id` | 물품 삭제 |
| PATCH | `/api/products/:id/status` | 거래 상태 변경 |
| GET | `/api/products/me` | 내가 등록한 상품 목록 조회 |

### 채팅
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/chats` | 내 채팅방 목록 |
| POST | `/api/chats` | 채팅방 생성 (물품ID + 상대방ID) |
| GET | `/api/chats/:id/messages` | 채팅 메시지 내역 조회 |
| POST | /api/chats/:id/messages | 메시지 저장
| PATCH | /api/chats/:id/read | 메시지 읽음 처리

### Socket.io 이벤트
| 이벤트 | 방향 | 설명 |
|--------|------|------|
| `join_room` | Client → Server | 채팅방 입장 |
| `send_message` | Client → Server | 메시지 전송 |
| `receive_message` | Server → Client | 메시지 수신 |
| `leave_room` | Client → Server | 채팅방 퇴장 |

---

## 카테고리 목록

| ID | 카테고리명 | 예시 |
|----|-----------|------|
| 1 | 전자기기 | 노트북, 태블릿, 이어폰, 충전기 |
| 2 | 도서 | 전공서적, 교양서, 문제집 |
| 3 | 의류/패션 | 옷, 신발, 가방, 액세서리 |
| 4 | 생활용품 | 자취용품, 주방용품, 문구류 |
| 5 | 기타 | 위 카테고리에 해당하지 않는 물품 |

---
