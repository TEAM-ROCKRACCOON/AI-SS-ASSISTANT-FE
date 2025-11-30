# AI-SS-ASSISTANT-FE

팀 명: **바위너구리** (Team25)   
프로젝트 명: **AI 쓱싹비서**

> **AI 쓱싹비서**는 정수선형계획법과 자체 강화학습 AI 기반,  
> 사용자 맞춤형 청소 일정 추천 및 시각적 동기부여 서비스입니다. 

자취 초년생의 **생활 패턴·일정·날씨·피드백**을 종합해  
“**지금 현실적으로 할 수 있는 청소 루틴**”을 자동으로 만들어줍니다.
**ILP**로 초안을 생성하고 **자체 강화학습 AI**로 매주 더 개인화된 일정을 제공합니다.

---

## 주요 기능

### 1. 루틴 자동 생성 & 최적화
- Google Calendar에서 사용자의 **고정 일정**을 가져와 청소 가능 시간대를 계산
- PuLP 기반 **정수선형계획법(ILP)**으로 제약조건(요일·시간대 선호, 주간 총 청소 시간, 중복 작업 제한)을 만족하는 초기 청소 스케줄 생성
- Tianshou(PPO) 기반 자체 **강화학습 에이전트**가 사용자의 실행 이력·만족도 피드백을 학습하여, 다음 주 루틴을 점점 더 개인화

### 2. 날씨 기반 청소 추천
- OpenWeatherMap API로 거주 지역의 **기온·강수량·미세먼지/습도**를 조회 
- “맑은 날엔 빨래”, “미세먼지 심한 날엔 환기 금지” 등 규칙 기반 추천으로 **날씨에 맞는 청소 루틴** 자동 제안

### 3. 시각 피드백 (Before → After)
- 사용자가 업로드한 방 사진에서 Grounded-SAM으로 **정돈이 필요한 물체**를 검출 후 마스킹 
- Smart-Eraser + 생성형 AI로 **청소 후 예상 이미지**를 생성해 “미리 보기” 제공  
- 청소 전·후 이미지를 비교하며 **시각적 동기부여** 제공

### 4. 온보딩 & 습관 설문

- 닉네임·주소·선호 청소 시간대/요일/물건 양 등을 받는 **온보딩 플로우**
- 최초 한 번의 설문으로 “자취초년생도 바로 따라 할 수 있는”  
  기본 청소 루틴을 자동 구성

### 5. 체크리스트 & 주간 스케줄

- **오늘 탭(CHECKLIST)**  
  - 오늘 해야 할 청소 항목 리스트  
  - 시간·완료 여부 수정, 항목 추가/삭제  
  - 날씨 카드와 함께 오늘 컨디션을 한눈에 확인
- **주간 탭(SCHEDULE)**  
  - 한 주 단위로 **시간축 기반 주간 뷰** 제공  
  - 고정 일정(회의·수업 등)과 청소 루틴을 한 캘린더에서 시각화
- **피드백 탭(FeedbackPage)**  
  - 루틴 별 수행 여부 및 만족도를 입력  
  - 다음 주 ILP & 강화학습 업데이트에 반영

---

## 아키텍처 개요

1. **사용자 경험(UI/UX)**
   - 모바일 퍼스트 레이아웃, 하단 탭 내비게이션
   - 날씨/체크리스트/주간 캘린더를 자연스럽게 넘나드는 인터랙션

2. **상태 관리 및 API 연동**
   - `Zustand`로 **인증·사용자 정보** 전역 관리
   - `React Query`로 Todo·날씨·피드백·프로필 데이터를 캐싱/동기화
   - `Axios` + 공통 `http` 클라이언트로 인증 헤더, 에러 처리 일원화

3. **온보딩/인증 플로우**
   - Google OAuth 인가 코드 기반 로그인
   - 로그인 후 `/init → 온보딩 → /home` 으로 이어지는 가드 라우팅

4. **Mock & Dev 환경 지원**
   - `MSW`(Mock Service Worker)로 실 서버 없이도 대부분 화면을 체험 가능
   - Kakao 주소 검색, 대시보드 데이터 등에 더미 응답 제공

---

## 디렉토리 구조

> 실제 프로젝트 구조(일부 파일 생략)

```bash
src/
├── App.tsx                      # 라우터 및 전체 레이아웃
├── index.tsx                    # 엔트리: ReactDOM + MSW 부트스트랩
├── index.css                    # Tailwind 및 글로벌 스타일
│
├── assets/
│   ├── room_before.jpg          # Before/After 데모 이미지
│   └── room_after.jpg
│
├── components/
│   ├── CleaningRoutineCard.tsx  # 추천 루틴 카드
│   ├── TodayRoutineList.tsx     # 오늘 할 일 리스트 (구 버전, 일부 화면에서 사용)
│   ├── TodoCard.tsx             # 단일 Todo 카드
│   ├── WeatherCard.tsx          # 상단 날씨 카드
│   ├── WeeklySchedule.tsx       # 주간 타임라인 뷰
│   └── ui/                      # 공통 UI 컴포넌트
│       ├── Button.tsx
│       ├── button.variants.ts   # 버튼 variant 스타일 정의
│       ├── Card.tsx
│       ├── Checkbox.tsx
│       ├── Input.tsx
│       └── Navigation.tsx       # 하단 탭 네비게이션
│
├── entities/
│   ├── feedback/
│   │   └── api/index.ts         # 피드백 관련 API 래퍼
│   ├── todo/
│   │   ├── api/index.ts         # Todo CRUD API
│   │   └── model/
│   │       ├── queries.ts       # React Query 훅 래핑
│   │       └── types.ts         # Todo 도메인 타입
│   └── user/
│       ├── api/index.ts         # 로그인·온보딩·프로필 API
│       └── model/
│           ├── authStore.ts     # 인증/토큰 상태(Zustand)
│           └── habitMapper.ts   # 온보딩 설문 → 서버 DTO 매핑
│
├── hooks/
│   ├── useDashboardData.ts      # 날씨/피드백/요약 데이터 통합 조회
│   ├── useFeedback.ts           # 피드백 작성/조회 훅
│   ├── useProfile.ts            # 프로필 조회/수정 훅
│   └── useTodos.ts              # 오늘/주간 Todo + Mutations 훅
│
├── lib/
│   ├── apiErrorHandler.ts       # 공통 에러 Alert/로그 헬퍼
│   ├── authService.ts           # 토큰 저장/조회/삭제
│   ├── feedbackService.ts       # 피드백 도메인 헬퍼
│   ├── kakaoLocal.ts            # Kakao 로컬 주소 검색 + Mock
│   ├── time.ts                  # 날짜/시간 포맷 유틸
│   ├── todoService.ts           # Todo 변환/가공 유틸
│   ├── userService.ts           # 로그인/온보딩 고수준 서비스
│   └── utils.ts                 # 기타 공용 유틸 함수
│
├── mocks/
│   ├── demoWeeklyTodos.ts       # 주간 Todo 데모 데이터
│   ├── handlers.ts              # MSW 핸들러 정의
│   ├── browser.ts               # setupWorker 생성
│   └── startMock.ts             # mock 서버 부트스트랩
│
├── pages/
│   ├── AddRoutinePage.tsx       # 루틴 추가/템플릿 관리 화면
│   ├── FeedbackPage.tsx         # 루틴 피드백 입력 화면
│   ├── HomePage.tsx             # 홈 화면
│   ├── ImagePage.tsx            # Before/After 이미지 생성 화면
│   ├── InitPage.tsx             # 최초 진입 시 프로필/온보딩 포워딩
│   ├── LoginPage.tsx            # 로그인 화면
│   ├── SettingsPage.tsx         # 프로필/로그아웃/회원탈퇴
│   ├── SetupPage.tsx            # 청소 선호 세팅
│   ├── TodayPage.tsx            # 오늘 체크리스트 + 날씨
│   ├── WeekPage.tsx             # 주간 타임라인
│   └── onboarding/
│       ├── AddressPage.tsx                # 거주지 & 좌표 입력
│       ├── GoogleCalendarConnectPage.tsx  # Google 캘린더 연동 트리거
│       ├── InitialSurveyPage.tsx          # 청소 습관/선호 설문
│       └── NicknamePage.tsx               # 닉네임 입력
│
├── shared/
│   └── api/
│       ├── http.ts              # 공통 Axios 인스턴스 및 인터셉터
│       └── types.ts             # 공용 API envelope 타입
│
├── store/
│   ├── routineStore.ts          
│   └── userStore.ts             # 사용자/온보딩 상태 관리
│
├── test/                        # MSW 기반 테스트 유틸
│   ├── mswServer.ts
│   ├── setup.ts
│   └── utils.tsx
│
├── types/
│   ├── routine.ts               # 루틴 도메인 타입
│   └── user.ts                  # 유저 도메인 타입
│
├── env.d.ts                     # Vite 환경 변수 타입
└── ...
