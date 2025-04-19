# TechMate
![인트로](images/인트로.jpg)

<br/>

## 프로젝트 개요
- **프로젝트 이름**: TechMate(테크메이트)
- **진행 기간**: 2025.02.24 ~ 2025.04.11
- **서비스 한줄 소개**: IT 취준생을 위한 개인 맞춤형 IT 기사 플랫폼 (웹 및 모바일 지원)


<br/>

## 프로젝트 배경

**IT 취업 시장, 기회와 도전 공존**

- IT 산업은 **2025년 국내 고용 증가를 견인할 핵심 분야**로 전망될 만큼 지속적으로 성장하고 있습니다. 정보통신기기 산업의 내수 증가 예상 등 IT 분야의 중요성은 계속 커지고 있죠.
- 하지만 취업 시장 상황은 녹록지 않습니다. 일부 대기업은 신입 공채를 줄이고 **경력직 위주**로 채용하거나, 필요할 때만 뽑는 **상시 채용**으로 전환하는 추세입니다.
- AI와 자동화 기술 발전으로 단순 코딩 업무가 줄면서, 신입 개발자에게도 **더 높은 수준의 역량과 경험**을 요구하고 있습니다.
- 결과적으로, IT 취업 준비생들은 급변하는 시장 트렌드와 필요한 정보를 얻는 데 **어려움**을 겪고 있습니다.

**기존 서비스, 무엇이 부족했나?**

- **정보의 한계:**
    - IT 분야에 특화되지 않아 정보의 깊이가 부족하거나,
    - IT/스타트업 전문 플랫폼이라도 특정 분야(예: 경력직)에 편중되는 경향이 있습니다.
- **사용자 경험(UX)의 문제:**
    - 복잡한 화면 구성이나 정보 입력의 번거로움 (특히 모바일)은 사용자를 지치게 합니다.
    - **개인 맞춤형 추천** 기능이 부족하여 자신에게 맞는 정보를 찾기 어렵습니다.
    - 관련 없는 광고 노출이나 정보 탐색의 불편함(사용자 저항)은 결국 서비스 이탈로 이어질 수 있습니다.
- **핵심 기능 부재:**
    - 관심 기사나 채용 공고를 **스크랩**하거나 **메모**하는 기능이 부족하여 효율적인 정보 관리가 어렵습니다.

**TechMate, 그래서 만들었습니다!**

이러한 문제들을 해결하고 IT 취업 준비생들에게 **가장 필요한 정보**를 **가장 편리하게** 제공하기 위해 **TechMate**를 개발했습니다.

TechMate는 다음을 목표로 합니다.

### 프로젝트 목표

- **IT 분야 특화:** 최신 채용 정보와 시장 동향을 깊이 있게 제공합니다.
- **개인 맞춤형 기사 추천**: 사용자 기반 협업 필터링을 활용하여 정교한 추천 제공
- **직관적 UI/UX**: 사용자 경험을 극대화하는 간결하고 효율적인 디자인
- **다양한 부가 기능**: 스크랩, 메모, 퀴즈 생성 등으로 단순 기사 읽기를 넘어선 경험 제공

TechMate를 통해 IT 취업 준비생들이 변화하는 시장에 **효과적으로 대비**하고 **성공적인 취업**을 이룰 수 있도록 지원하고자 합니다.


---
<br/>

## 주요 기능 및 서비스 화면

### 0. 인트로 페이지
- 사이트 소개 및 구글/카카오 소셜 로그인 지원
![랜딩페이지](images/랜딩페이지.gif)

<br/>

### 1. 사용자 정보 등록 페이지
- 닉네임 및 관심 기사 3가지 입력
- 초기 콘텐츠 기반 필터링 → 사용자 로그 기반 협업 필터링으로 콜드 스타트 문제 해결
![사용자등록](images/사용자정보등록.gif)

<br/>

### 2. 메인 페이지
- **맞춤형 기사 추천**: 비대칭 스크롤 구조와 무한 스크롤 구현으로 집중력 향상
![메인](images/scroll.gif)

<br/>

### 3. 기사 상세 페이지
- 기사 내용, 좋아요, 스크랩, 퀴즈 생성 버튼 제공
- 추천 기사 4가지 표시
![상세_웹](images/splitdesign.gif)
![상세_웹](images/mobile.gif)


#### 3-1. 메모 페이지
- 스크랩 시 폴더 선택 및 생성 가능
- 마크다운 지원 메모장 제공 → 직관적 기록 가능
- 메모 완료 시 초록색 버튼 표시로 접근성 강화
![메모_웹](images/메모웹.png)
![메모_모바일](images/메모_모바일.png)

#### 3-2. 퀴즈 페이지
- AI 기반 기사 분석 후 관련 문제 생성 (3문제)
- 퀴즈 결과와 해설 제공 → 기사 내용을 보다 효과적으로 기억 가능
![퀴즈_웹](images/기사상세+퀴즈_웹.png)
![퀴즈_모바일](images/퀴즈모바일.png)

<br/>

### 4. 네비게이션(Nav)
- 카테고리 이동, 키워드 검색, 마이페이지 이동, 로그아웃 및 회원 탈퇴 기능 포함
![네비게이션](images/네비게이션.png)

<br/>

### 5. 마이페이지
- 사용자 현황 및 퀴즈 풀이 기록 확인 가능
- 닉네임 수정, 스크랩한 기사 관리 (폴더 추가/수정/삭제)
![마이페이지](images/마이페이지_웹.png)
![마이페이지](images/마이페이지폴더.gif)

---

<br/>

## 프로젝트 구조 및 설계 산출물

### 설계 자료
1. **시퀀스 다이어그램**: [Notion 링크](https://www.notion.so/1b260a1ef67280e5a45cde45443a8918)
2. **화면 설계 (Wireframe)**: [Figma 링크](https://www.figma.com/design/kp01dAosVVnBr3xcTK9EWt/B201?node-id=61-5278&t=BQwcxWqOpQDLf0Ry-1)
3. **시스템 아키텍처** [Notion 링크](https://www.notion.so/1c060a1ef67280c59561ea22bbc468bf)
4. **ERD**: [Notion 링크](https://www.notion.so/ERD-1b460a1ef67280cb8f94d3822c8a5e6f)
5. **요구사항 명세서**: [Notion 링크](https://www.notion.so/1a660a1ef672805b81a4dca930b5fb3a)
6. **기능 명세서**: [Notion 링크](https://www.notion.so/1ad60a1ef67280b59d1aeefa2bd20d5e)
7. **API 명세서**: [Notion 링크](https://www.notion.so/API-1ae60a1ef672800ba1dfd6a341d0e86c)

---

<br/>

## 기술 스택

| **분류**         | **기술 및 도구**                                                                 |
|-------------------|----------------------------------------------------------------------------------|
| **운영체제**      | Ubuntu 20.04 LTS, macOS 12 이상, Windows (WSL2 권장)                            |
| **개발 도구**     | IDE: Visual Studio Code (프론트엔드), IntelliJ IDEA, Visual Studio Code (백엔드) |
|                   | 버전 관리: Git                                                                  |
|                   | 컨테이너화 도구: Docker, Docker Compose                                         |
| **언어 및 프레임워크** | JavaScript: Node.js (v22.12.0 LTS), React (v19.0.0)                             |
|                   | Java: OpenJDK 17, Spring Boot (v3.4.3), Spring Data JPA, Spring Security        |
|                   | Python: Python 3.9 이상, FastAPI                                                |
| **데이터베이스**  | MySQL (v8.0 이상), MongoDB (v5.0 이상), Redis (v7.0 이상)                       |
| **인프라 도구**   | Jenkins, Nginx (v1.27.6)                                                        |
| **패키지 관리자** | npm, Gradle, pip                                                                |



---

<br/>

## 팀원 소개

| 이름       | 역할                      |
|------------|---------------------------|
| 김의중     | 인프라/백엔드 (팀장)      |
| 김찬우     | 백엔드                   |
| 이해수     | 데이터       |
| 이상호     | 프론트엔드               |
| 최현정     | 프론트엔드               |
| 정효원     | 프론트엔드               |
