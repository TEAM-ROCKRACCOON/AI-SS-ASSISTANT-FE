# AI-SS-ASSISTANT-FE

**AI-SS-ASSISTANT-FE**는 Team 25 바위너구리의 프로젝트 **AI 쓱싹비서**의 프론트엔드 저장소입니다.  
이 프로젝트는 사용자의 생활 패턴, 일정, 날씨 데이터를 기반으로 **개인화된 청소 루틴을 추천하고 시각화**하는 서비스입니다.

---

## 주요 기능

- Google Calendar 기반 고정 일정 자동 분석
- 온보딩 설문을 통한 사용자 맞춤 초기 설정
- AI 기반 청소 루틴 추천 및 스케줄링
- 루틴 체크/수정 및 주간 달성률 피드백
- 일주일 루틴 미리보기 및 결과 반영
- 강화학습 기반 개인화 루틴 고도화 (AI 연동 예정)

---

```markdown
## 프로젝트 디렉토리 구조

```

src/
├── App.tsx                            # 전체 라우팅 및 페이지 구조 정의
├── index.tsx                          # 애플리케이션 진입점, ReactDOM 렌더링
├── App.css / index.css                # 글로벌 스타일 시트
│
├── components/                        # 재사용 가능한 UI 컴포넌트 모음
│   ├── CleaningRoutineCard.tsx        # 청소 루틴 정보 카드 컴포넌트
│   ├── TodayRoutineList.tsx           # 오늘의 청소 루틴 목록
│   ├── TodoCard.tsx                   # 단일 할 일 카드
│   ├── WeeklySchedule.tsx             # 주간 일정 표시용 컴포넌트
│   └── ui/                            # 버튼, 카드 등 UI 파트 공통 요소
│       ├── Button.tsx                 # 공통 버튼 컴포넌트
│       ├── Card.tsx                   # 공통 카드 UI
│       ├── Checkbox.tsx               # 체크박스 UI
│       ├── Input.tsx                  # 공통 입력창
│       └── Navigation.tsx             # 하단 내비게이션 바
│
├── hooks/
│   └── useDashboardData.ts            # 대시보드에서 사용하는 커스텀 훅
│
├── lib/                               # 유틸리티 및 API 모듈
│   ├── api.ts                         # Axios 설정 및 기본 API 유틸
│   ├── routineService.ts              # 루틴 관련 API 함수
│   └── utils.ts                       # 시간/날짜 등 공통 유틸 함수
│
├── pages/                             # 라우팅 대상 주요 화면들
│   ├── AddRoutinePage.tsx             # 새로운 루틴 추가 페이지
│   ├── DashboardPage.tsx              # 오늘 할 일 대시보드
│   ├── FeedbackPage.tsx               # 루틴 피드백 입력 및 분석 페이지
│   ├── HomePage.tsx                   # 초기 홈화면 구조
│   ├── InitPage.tsx                   # 최초 사용 시 초기 정보 입력 화면
│   ├── LoginPage.tsx                  # 구글 로그인 화면
│   ├── SchedulePreviewPage.txt        # 청소 일정 미리보기 (추후 .tsx로 변경 필요)
│   ├── ScheduleSuggestionPage.txt     # AI 추천 일정 화면 (추후 .tsx로 변경 필요)
│   ├── SettingsPage.tsx               # 프로필/로그아웃 등 설정 화면
│   ├── SetupPage.tsx                  # 온보딩 후 청소 선호 설정 화면
│   ├── TodayPage.tsx                  # 오늘 할 일만 집중해서 보여주는 페이지
│   ├── WeekPage.tsx                   # 일주일 단위 루틴 요약 화면
│   └── onboarding/                    # 온보딩 단계별 세부 페이지
│       ├── AddressPage.tsx            # 사용자 주소 입력 화면
│       ├── InitialSurveyPage.tsx      # 청소 습관 설문 입력
│       └── NicknamePage.tsx           # 닉네임 입력 화면
│
├── store/
│   └── userStore.ts                   # 사용자 상태 관리 (Zustand 사용)
│
├── types/
│   ├── routine.ts                     # 루틴 관련 타입 정의
│   └── user.ts                        # 사용자 관련 타입 정의
│
├── styles/                            # 커스텀 스타일 정의 공간
├── utils/                             # 기타 유틸리티 함수들
│
├── reportWebVitals.ts                # 웹 성능 측정용 (CRA 기본)
├── setupTests.ts                     # 테스트 설정 파일
└── react-app-env.d.ts                # 환경 설정 타입 선언 (CRA 기본)

```
```

---

## 기술 스택

| 구분         | 사용 기술 |
|--------------|-----------|
| 프레임워크   | React (TypeScript) |
| 상태관리     | Zustand |
| 비동기 처리   | React Query |
| UI 스타일링  | Tailwind CSS |
| 라우팅       | React Router |
| 시각화       | Chart.js (예정) |
| API 호출     | Axios |
| 캘린더 연동  | Google Calendar API (예정) |

---

## 실행 방법

```bash
# 프로젝트 클론
git clone https://github.com/TEAM-ROCKRACCOON/AI-SS-ASSISTANT-FE.git
cd AI-SS-ASSISTANT-FE

# 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev  # 또는 npm start
````

기본 실행 주소: [http://localhost:3000](http://localhost:3000)

---

## 관련 저장소

* **AI 모델**: [AI-SS-ASSISTANT-AI](https://github.com/TEAM-ROCKRACCOON/AI-SS-ASSISTANT-AI)
* **백엔드 서버**: [AI-SS-ASSISTANT-BE](https://github.com/TEAM-ROCKRACCOON/AI-SS-ASSISTANT-BE)

---
