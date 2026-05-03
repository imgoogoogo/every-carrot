# 에브리당근 프로젝트 보고서

---

## 목차

- [요구분석](#요구분석)
  - [프로젝트 소개](#프로젝트-소개)
  - [프로젝트 목적](#프로젝트-목적)
  - [문제 정의](#문제-정의)
  - [예상 사용자](#예상-사용자)
  - [기능 요구사항](#기능-요구사항)
  - [비기능 요구사항](#비기능-요구사항)
  - [유스케이스](#유스케이스)
- [설계](#설계)
  - [시스템 아키텍처](#시스템-아키텍처)
  - [데이터베이스 설계 ERD](#데이터베이스-설계-erd)
  - [데이터베이스 명세서](#데이터베이스-명세서)
  - [API 설계](#api-설계)
- [구현](#구현)
  - [프론트엔드](#프론트엔드)
  - [백엔드](#백엔드)
  - [데이터베이스](#데이터베이스)
- [테스트](#테스트)
  - [테스트 케이스 및 결과](#테스트-케이스-및-결과)
- [설치 및 실행](#설치-및-실행)
- [향후 개선 사항](#향후-개선-사항)
- [결론](#결론)

---

## 요구분석

### 프로젝트 소개

**에브리당근(Every Carrot)** 은 동국대학교 WISE 캠퍼스 학생들을 위한 캠퍼스 중고 거래 플랫폼입니다.  
학교 이메일(@dongguk.ac.kr) 인증을 통해 재학생만 가입할 수 있으며, 물품 등록·거래·채팅까지 원스톱으로 제공합니다.

---

### 프로젝트 목적

- 캠퍼스 내 중고 거래를 안전하고 편리하게 제공
- 학교 이메일 인증으로 신뢰도 있는 거래 환경 구축
- 채팅 기능을 통한 실시간 판매자-구매자 소통 지원

---

### 문제 정의

| 문제 | 내용 |
|------|------|
| 신뢰 문제 | 기존 중고 플랫폼은 비학생도 이용 가능해 캠퍼스 내 거래 신뢰도 낮음 |
| 접근성 문제 | 캠퍼스 내 거래 정보가 단톡방·게시판 등에 분산되어 불편 |
| 소통 문제 | 거래 문의를 위한 별도 연락 수단 필요 |

---

### 예상 사용자

- 동국대학교 WISE 캠퍼스 재학생
- 학교 이메일(@dongguk.ac.kr) 보유자
- 중고 물품을 사거나 팔고자 하는 학생

---

### 기능 요구사항

| 구분 | 기능 |
|------|------|
| 인증 | 학교 이메일 인증, 회원가입, 로그인, 로그아웃 |
| 물품 | 물품 등록, 수정, 삭제, 목록 조회, 상세 조회 |
| 물품 상태 | 판매중 / 예약중 / 판매완료 상태 변경 |
| 검색/필터 | 카테고리 필터, 키워드 검색, 가격 범위 필터 |
| 채팅 | 1:1 실시간 채팅, 채팅 목록, 읽음 처리 |
| 마이페이지 | 프로필 조회·수정, 내 물품 목록 |
| 유저 프로필 | 타 사용자 프로필 조회, 판매 물품 탭 필터 |

---

### 비기능 요구사항

| 구분 | 내용 |
|------|------|
| 보안 | JWT Access Token + Refresh Token(HttpOnly Cookie) 인증 |
| 보안 | 학교 이메일(@dongguk.ac.kr)만 가입 허용 |
| 성능 | 물품 목록 페이지네이션 (기본 20개, 최대 50개) |
| 성능 | 물품/메시지 인덱스 최적화 |
| UX | 모바일 퍼스트 UI (max-width: 430px) |
| 실시간 | Socket.io 기반 채팅 실시간 처리 |

---

### 유스케이스

```
<img width="2764" height="4004" alt="image" src="https://github.com/user-attachments/assets/ab158e09-968c-4042-95fd-cacbcf13cb6b" />

```

---

## 설계

### 시스템 아키텍처

```
[클라이언트]
  React 19 + Vite
  Tailwind CSS
  React Router DOM
  axios (HTTP)
  Socket.io-client (실시간 채팅)
        │
        │ HTTP/WebSocket
        ▼
[서버] Node.js + Express 5
  REST API (/api/auth, /api/products, /api/users, /api/chats)
  Socket.io (채팅 실시간)
  multer (이미지 업로드)
  JWT 인증 미들웨어
        │
        ▼
[데이터베이스] MySQL 8.0
  users / products / categories
  chat_rooms / messages / email_verifications
```

---

### 데이터베이스 설계 ERD

```
users ──────────── products ──────── categories
  │                   │
  │              chat_rooms
  │             /    │
  └── buyer_id  │  seller_id
                │
             messages
```

**관계 요약**
- `users` 1 : N `products` (판매자)
- `products` 1 : N `chat_rooms`
- `users` 1 : N `chat_rooms` (구매자/판매자)
- `chat_rooms` 1 : N `messages`
- `categories` 1 : N `products`

---

### 데이터베이스 명세서

#### users

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT AUTO_INCREMENT | PK |
| email | VARCHAR(100) UNIQUE | 학교 이메일 |
| password | VARCHAR(255) | bcrypt 해시 |
| nickname | VARCHAR(30) UNIQUE | 닉네임 |
| department | VARCHAR(50) | 학과 |
| profile_image | VARCHAR(255) | 프로필 이미지 경로 |
| is_verified | BOOLEAN | 이메일 인증 여부 |
| created_at | DATETIME | 가입일 |

#### products

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT AUTO_INCREMENT | PK |
| seller_id | INT | FK → users.id |
| title | VARCHAR(100) | 물품명 |
| description | TEXT | 설명 |
| price | INT | 가격 |
| category_id | INT | FK → categories.id |
| status | ENUM | 판매중/예약중/판매완료 |
| image_url | VARCHAR(255) | 이미지 경로 |
| created_at | DATETIME | 등록일 |

#### chat_rooms

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT AUTO_INCREMENT | PK |
| product_id | INT | FK → products.id |
| buyer_id | INT | FK → users.id |
| seller_id | INT | FK → users.id |
| created_at | DATETIME | 생성일 |

#### messages

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT AUTO_INCREMENT | PK |
| chat_room_id | INT | FK → chat_rooms.id |
| sender_id | INT | FK → users.id |
| content | TEXT | 메시지 내용 |
| is_read | BOOLEAN | 읽음 여부 |
| created_at | DATETIME | 전송일 |

---

### API 설계

#### 인증 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /api/auth/send-verification | 이메일 인증 코드 발송 | ✗ |
| POST | /api/auth/verify-email | 이메일 인증 확인 | ✗ |
| POST | /api/auth/register | 회원가입 | ✗ |
| POST | /api/auth/login | 로그인 (JWT 발급) | ✗ |

#### 물품 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/products | 물품 목록 (필터/검색/페이징) | ✗ |
| POST | /api/products | 물품 등록 | ✓ |
| GET | /api/products/me | 내 물품 목록 | ✓ |
| GET | /api/products/:id | 물품 상세 | ✗ |
| PUT | /api/products/:id | 물품 수정 | ✓ |
| DELETE | /api/products/:id | 물품 삭제 | ✓ |
| PATCH | /api/products/:id/status | 판매 상태 변경 | ✓ |

#### 유저 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/users/me | 내 프로필 조회 | ✓ |
| PUT | /api/users/me | 내 프로필 수정 | ✓ |
| GET | /api/users/:id | 타 유저 프로필 조회 | ✗ |

#### 채팅 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /api/chats | 채팅방 생성 | ✓ |
| GET | /api/chats | 내 채팅 목록 | ✓ |
| GET | /api/chats/:id/messages | 채팅 메시지 조회 | ✓ |

---

## 구현

### 프론트엔드

**기술 스택**
- React 19 + Vite 8
- Tailwind CSS 3 (커스텀 컬러: brand #F29100, brand-red #E94E1B)
- React Router DOM 7
- axios 1.15 (Bearer Token 인터셉터)
- Socket.io-client 4.8

**화면 목록**

| 페이지 | 경로 | 설명 |
|--------|------|------|
| LoginPage | / , /login | 로그인 |
| RegisterPage | /register | 회원가입 + 이메일 인증 |
| MainPage | /main | 홈 (물품 목록, 카테고리 필터) |
| ProductDetailPage | /products/:id | 물품 상세, 채팅하기 |
| ProductFormPage | /write | 물품 등록 |
| ProductFormPage | /write/:id | 물품 수정 |
| MyPage | /mypage | 마이페이지, 프로필 수정 |
| MyProductsPage | /mypage/products | 내 물품 목록 |
| ChatListPage | /chat | 채팅 목록 |
| ChatRoomPage | /chat/:id | 채팅방 (실시간) |
| UserProfilePage | /users/:id | 타 유저 프로필 + 물품 탭 |

**주요 구현 사항**
- JWT Access Token → localStorage 저장, axios 인터셉터에서 자동 첨부
- Refresh Token → HttpOnly Cookie (withCredentials: true)
- 물품 등록/수정 → multipart/form-data (이미지 포함)
- 채팅 → Socket.io 실시간 연결
- 유저 프로필 → 전체/판매중/판매완료 탭 필터링
- 모바일 퍼스트 레이아웃 (max-width: 430px, 스크롤바 숨김)

---

### 백엔드

**기술 스택**
- Node.js + Express 5
- mysql2 (MySQL 연결 풀)
- bcrypt (비밀번호 해시)
- jsonwebtoken (JWT 발급/검증)
- multer (이미지 업로드 → /uploads/products, /uploads/profiles)
- nodemailer (이메일 인증 코드 발송)
- socket.io (실시간 채팅)
- cookie-parser (Refresh Token 쿠키 처리)

**디렉토리 구조**
```
backend/
├── config/       # DB, Socket.io 설정
├── controllers/  # 채팅 컨트롤러
├── middleware/   # auth(JWT), upload(multer)
├── models/       # 채팅 모델
├── products/     # 물품 CRUD 핸들러
├── routes/       # auth, products, users, chat 라우터
├── users/        # 유저 핸들러
├── utils/        # 이메일 발송 유틸
├── uploads/      # 업로드 이미지 저장
├── schema.sql    # DB 스키마
└── index.js      # 서버 엔트리포인트
```

**인증 흐름**
1. 로그인 → Access Token (1시간) 발급 → localStorage
2. Refresh Token (7일) → HttpOnly Cookie
3. API 요청 시 Authorization: Bearer {token} 헤더 자동 첨부
4. 토큰 만료 시 Refresh Token으로 갱신

---

### 데이터베이스

- MySQL 8.0
- DB명: `every_carrot`
- 문자셋: utf8mb4 (이모지 포함 한국어 완전 지원)
- 테이블: users, categories, products, chat_rooms, messages, email_verifications
- 성능 인덱스: products(status, category_id, seller_id, price, created_at), messages(chat_room_id + created_at, is_read)
- 카테고리 기초 데이터: 전자기기, 의류/잡화, 도서/교재, 스포츠/레저, 가구/인테리어, 식품/음료, 뷰티/미용, 기타

---

## 테스트

### 테스트 케이스 및 결과

| 기능 | 테스트 항목 | 결과 |
|------|------------|------|
| 회원가입 | 학교 이메일 인증 후 가입 | ✅ 정상 |
| 로그인 | JWT 발급 및 localStorage 저장 | ✅ 정상 |
| 로그아웃 | 토큰 삭제 및 로그인 페이지 이동 | ✅ 정상 |
| 물품 등록 | 이미지 + 정보 입력 후 DB 저장 | ✅ 정상 |
| 물품 목록 | 실제 DB 데이터 홈 화면 표시 | ✅ 정상 |
| 물품 상세 | 판매자 정보, 가격, 설명 표시 | ✅ 정상 |
| 물품 수정 | 기존 데이터 로드 후 PUT 호출 | ✅ 정상 |
| 내 물품 목록 | GET /api/products/me 연동 | ✅ 정상 |
| 마이페이지 | 실제 닉네임/학과 표시 | ✅ 정상 |
| 프로필 수정 | PUT 호출 후 화면 즉시 반영 | ✅ 정상 |
| 유저 프로필 | 전체/판매중/판매완료 탭 필터 | ✅ 정상 |
| 채팅 목록 | 채팅방 목록 조회 | ✅ 정상 |
| 실시간 채팅 | Socket.io 메시지 송수신 | ✅ 정상 |

---

## 설치 및 실행

### 사전 요구사항

- Node.js 18+
- MySQL 8.0
- npm

### 백엔드 실행

```bash
cd backend
npm install
# .env 파일 설정 (DB, JWT, 이메일 정보)
node index.js
# 서버: http://localhost:3000
```

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
# 앱: http://localhost:5174
```

### .env 설정 항목

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=****
DB_NAME=every_carrot
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=****
EMAIL_PASS=****
ALLOWED_EMAIL_DOMAIN=dongguk.ac.kr
JWT_SECRET=****
JWT_REFRESH_SECRET=****
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
```

### 데이터베이스 초기화

```bash
mysql -u root -p < backend/schema.sql
```

---

## 향후 개선 사항

| 항목 | 내용 |
|------|------|
| 토큰 자동 갱신 | Access Token 만료 시 axios 인터셉터에서 자동 갱신 처리 |
| 알림 기능 | 채팅 메시지 수신 시 푸시 알림 |
| 반응형 웹 | 태블릿/PC 화면 대응 브레이크포인트 추가 |
| 이미지 다중 업로드 | 물품당 최대 1장 → 다중 이미지 지원 |
| 검색 고도화 | 제목+설명 외 태그 기반 검색 |

---

## 결론

에브리당근은 동국대학교 WISE 캠퍼스 학생들을 위한 중고 거래 플랫폼으로,  
학교 이메일 인증 기반의 신뢰 있는 거래 환경과 실시간 채팅을 통한 편리한 소통을 구현하였습니다.

React + Node.js + MySQL 풀스택 구조로 개발하였으며, 프론트엔드와 백엔드를 역할 분리하여  
Git 브랜치 전략(feature → develop → main)을 통해 협업하였습니다.

향후 토큰 자동 갱신, 찜 기능, 알림 등을 추가하면 실제 서비스 수준의 앱으로 발전 가능합니다.
