# TechMate 외부 서비스 연동 정보

## 1. 문서 정보
| 항목 | 내용 |
|------|------|
| 문서 제목 | [TechMate] 외부 서비스 연동 정보 |
| 버전 | v0.0.1 |
| 최종 수정일 | 2025-04-10 |
| 작성자 | 김의중 / B201 |
| 승인자 | 김의중 / B201 |

## 2. 개요

이 문서는 TechMate 서비스에서 사용하는 외부 API 및 서비스에 대한 정보와 설정 방법을 제공합니다. 서비스 운영 및 개발에 필요한 인증 정보, API 키, 사용 예시 등을 포함합니다.

## 3. 소셜 로그인 연동

### 3.1 Google OAuth 연동

#### 기본 정보
| 항목 | 내용 |
|------|------|
| 서비스명 | Google OAuth 2.0 |
| 사용 목적 | 사용자 인증 및 소셜 로그인 |
| 연동 범위 | 이메일, 프로필 정보 |
| 관리 콘솔 | [Google Cloud Console](https://console.cloud.google.com/) |

#### 설정 정보
| 항목 | 값 | 환경변수명 |
|------|------|------|
| 기본 URL | https://accounts.google.com | GOOGLE_BASE_URL |
| 클라이언트 ID | [발급받은 구글 클라이언트 ID] | GOOGLE_CLIENT_ID |
| 클라이언트 시크릿 | [발급받은 구글 클라이언트 시크릿] | GOOGLE_SECRET |
| 리디렉션 URL | https://j12b201.p.ssafy.io/api/v1/credentials/oauth/google | GOOGLE_REDIRECT_URL |

#### 개발자 계정 정보
| 항목 | 내용 |
|------|------|
| 계정 | mdsoo55828@gmail.com |
| 프로젝트명 | TechMate |
| 인증 방식 | OAuth 2.0 |

#### 설정 방법
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 메뉴로 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형 "웹 애플리케이션" 선택
6. 리디렉션 URI 추가: `https://j12b201.p.ssafy.io/api/v1/credentials/oauth/google`
7. 생성된 클라이언트 ID와 시크릿 정보 저장

### 3.2 Kakao OAuth 연동

#### 기본 정보
| 항목 | 내용 |
|------|------|
| 서비스명 | Kakao OAuth |
| 사용 목적 | 사용자 인증 및 소셜 로그인 |
| 연동 범위 | 이메일, 프로필 정보 |
| 관리 콘솔 | [Kakao Developers](https://developers.kakao.com/) |

#### 설정 정보
| 항목 | 값 | 환경변수명 |
|------|------|------|
| 기본 URL | https://kauth.kakao.com | KAKAO_BASE_URL |
| REST API 키 | [발급받은 Kakao 클라이언트 ID] | KAKAO_CLIENT_ID |
| 리디렉션 URL | https://j12b201.p.ssafy.io/api/v1/credentials/oauth/kakao | KAKAO_REDIRECT_URL |
| 관리자 키 | [발급받은 카카오 관리자 키] | KAKAO_ADMIN_KEY |
| 애플리케이션 ID | [발급받은 카카오 APP ID] | KAKAO_APP_ID |

#### 개발자 계정 정보
| 항목 | 내용 |
|------|------|
| 계정 | mdsoo55828@gmail.com |
| 앱 이름 | TechMate |
| 인증 방식 | REST API |

#### 설정 방법
1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 애플리케이션 추가
3. "앱 설정" > "플랫폼" 메뉴에서 웹 플랫폼 등록
   - 사이트 도메인: `https://j12b201.p.ssafy.io`
4. "제품 설정" > "카카오 로그인" 활성화
   - 동의항목: 이메일, 프로필 정보 등 필요한 항목 선택
   - Redirect URI: `https://j12b201.p.ssafy.io/api/v1/credentials/oauth/kakao` 추가
5. 발급된 REST API 키와 관리자 키 저장

## 4. SOLAR API 연동

### 기본 정보
| 항목 | 내용 |
|------|------|
| 서비스명 | SOLAR Pro API |
| 사용 목적 | 생성형 AI 서비스 |
| 제공업체 | 업스테이지(Upstage) |
| API 문서 | [SOLAR API 문서](https://console.upstage.ai/api/chat) |

### 설정 정보
| 항목 | 값 | 환경변수명 |
|------|------|------|
| API 키 | [발급받은 API 키] | SOLAR_PRO_API_KEY |
| 호출 제한 | 서비스 등급에 따라 다름 | - |

### 개발자 계정 정보
| 항목 | 내용 |
|------|------|
| 계정 | mdsoo55828@gmail.com |
| 앱 이름 | TechMate |
| 키 발급일 | 2025-03-15 |
| 갱신 주기 | 1년 |

### 설정 방법
1. [업스테이지 AI 플랫폼](https://console.upstage.ai/docs/getting-started)에 접속
2. 회원가입 및 로그인
3. SOLAR API 사용 신청
4. 승인 후 API 키 발급
5. 발급받은 API 키를 시스템 환경변수로 설정

## 6. 보안 및 관리 지침

### API 키 관리
1. 모든 API 키와 시크릿은 환경 변수로 관리하며, 소스 코드에 직접 포함하지 않습니다.
2. Jenkins CI/CD 환경에서는 Jenkins Credentials로 관리합니다.
3. API 키는 정기적으로 (6개월~1년) 갱신하는 것을 권장합니다.
4. 개발 환경과 운영 환경의 API 키를 분리하여 관리합니다.

### 모니터링 및 사용량 관리
1. 각 API 사용량을 정기적으로 모니터링합니다.
2. 사용량 한도에 근접할 경우 알림을 설정합니다.
3. 비용이 발생하는 API의 경우 월별 사용량 보고서를 작성합니다.

### 에러 처리
1. API 호출 실패 시 적절한 대체 기능을 제공합니다.
2. 재시도 메커니즘을 구현하여 일시적인 오류에 대응합니다.
3. API 오류는 별도의 로그로 기록하여 추후 분석이 가능하도록 합니다.

## 7. 갱신 일정 및 담당자

| 서비스 | 다음 갱신일 | 담당자 | 비고 |
|--------|------------|--------|------|
| Google OAuth | 2026-03-15 | 김찬우 |  |
| Kakao OAuth | 2026-03-15 | 김찬우 |  |
| SOLAR Pro API | 2026-03-15 | 김찬우우 | |