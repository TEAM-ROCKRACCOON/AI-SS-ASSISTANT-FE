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

## 디렉토리 구조

src/
├── App.tsx                  # 라우팅 구성
├── index.tsx                # 엔트리 포인트, React Query 초기화
├── pages/                   # 주요 페이지 (대시보드, 설정 등)
│   ├── DashboardPage.tsx
│   ├── AddRoutinePage.tsx
│   ├── ScheduleSuggestionPage.tsx
│   ├── SchedulePreviewPage.tsx
│   ├── SetupPage.tsx
│   └── InitPage.tsx
├── components/              # UI 컴포넌트들
├── hooks/                   # 커스텀 훅 (ex. useDashboardData 등)
├── services/                # API 통신 함수
├── stores/                  # Zustand 상태관리
├── types/                   # 타입 정의

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
