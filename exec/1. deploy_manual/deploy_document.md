# GitLab 소스 클론 빌드 및 배포 문서

## 1. 문서 정보
| 항목 | 내용 |
|------|------|
| 문서 제목 | [TechMate] GitLab 소스 클론 빌드 및 배포 문서 |
| 버전 | v0.0.1 |
| 최종 수정일 | 2025-04-09 |
| 작성자 | 김의중 / B201 |
| 승인자 | 김의중 / B201 |

## 2. 개발 환경 정보

### 2.1 소스 관리
- GitLab 버전: 17.10.3
- 프로젝트 URL: https://lab.ssafy.com/s12-bigdata-recom-sub1/S12P21B201.git
- 브랜치 정보: 
  - FE: `frontend`
  - BE: `backend`
  - DATA: `data`
  - MAIN: `master`

### 2.2 개발 도구 및 환경
- **운영체제**
    - **권장OS**: Ubuntu 20.04 LTS 또는 macOS 12 이상, `Windows 사용자`(WSL2; Windows Subsystem for Linux 사용)
- **개발 도구**
    - **IDE**
        - **FE**: Visual Studio Code version 1.99
        - **BE**: IntelliJ IDEA 2023.3.8
    - **버전 관리**: Git
- **언어 및 프레임워크**
    - **BE**: OpenJDK 17, Spring Boot 3.4.3, Hibernate 6.6.8
    - **FE**: Node 22.12.10 LTS, React 19.0.0
    - **DATA**: Python 3.9 이상, Crontab
- **데이터베이스**
    - **MySQL 8.0 이상**
    - **MongoDB 5.0 이상**
    - **Redis 7.0 이상**
- **서버 환경**
    - **웹서버**: Nginx 1.27.4
    - **WAS**: Apache Tomcat 10.1.36
    - **컨테이너 플랫폼**: Docker 28.0.1

## 3. 소스 클론 및 빌드 절차

### 3.1 소스 클론
```bash
# GitLab 저장소 클론
git clone https://lab.ssafy.com/s12-bigdata-recom-sub1/S12P21B201.git

# 특정 브랜치로 전환
git checkout [브랜치명]
```

### 3.2 빌드 환경 설정

#### 필수 환경 변수 `(젠킨스에 Credentials로 등록을 하여 사용한다)`


| 변수명 | 설명 | 기본값 | 비고 |
|--------|------|--------|------|
| **GOOGLE_BASE_URL** | Google OAuth 인증 기본 URL | `https://accounts.google.com` | OAuth 인증 시 사용 |
| **GOOGLE_CLIENT_ID** | Google OAuth 클라이언트 ID | `발급받은 구글 클라이언트ID` | Google 개발자 콘솔에서 발급 |
| **GOOGLE_REDIRECT_URL** | Google OAuth 인증 후 리디렉션 URL | `등록할 리디렉션 URL` | 로컬 개발 환경용 설정 |
| **GOOGLE_SECRET** | Google OAuth 클라이언트 시크릿 | `발급받은 구글 클라이언트 시크릿` | 보안에 주의 필요 |
| **JWT_ACCESS_EXP** | JWT 접근 토큰 만료 시간(초) | `180000` | 약 50시간 |
| **JWT_HEADER** | JWT 토큰 헤더명 | `Authorization` | 표준 인증 헤더명 |
| **JWT_PREFIX** | JWT 토큰 접두사 | `Bearer` | 표준 Bearer 인증 방식 |
| **JWT_REFRESH_EXP** | JWT 갱신 토큰 만료 시간(초) | `50400` | 약 14시간 |
| **JWT_SECRET_KEY** | JWT 서명 비밀키 | `발급받은 JWT 비밀키` | 보안에 주의 필요 |
| **KAKAO_ADMIN_KEY** | Kakao 관리자 키 | `발급받은 카카오 관리자 키` | Kakao 개발자 콘솔에서 발급 |
| **KAKAO_APP_ID** | Kakao 애플리케이션 ID | `발급받은 카카오 APP ID` | Kakao 개발자 콘솔에서 발급 |
| **KAKAO_BASE_URL** | Kakao OAuth 인증 기본 URL | `https://kauth.kakao.com` | OAuth 인증 시 사용 |
| **KAKAO_CLIENT_ID** | Kakao OAuth 클라이언트 ID | `발급받은 Kakao 클라이언트 ID` | Kakao 개발자 콘솔에서 발급 |
| **KAKAO_REDIRECT_URL** | Kakao OAuth 인증 후 리디렉션 URL | `등록할 리디렉션 URL` | 로컬 개발 환경용 설정 |
| **MONGO_AUTH** | MongoDB 인증 데이터베이스 | `admin` | MongoDB 연결 설정 |
| **MONGO_CONNECT_NAME** | MongoDB 연결 이름 | `MongoDB Connect Name` | 프로젝트 식별자 |
| **MONGO_DATABASE** | MongoDB 데이터베이스 이름 | `MongoDB Database Name` | 사용할 DB 이름 |
| **MONGO_HOST** | MongoDB 호스트 주소 | `MongoDB Host Address` | Atlas 호스팅 주소 |
| **MONGO_PASSWORD** | MongoDB 비밀번호 | `MongoDB Password` | 보안에 주의 필요 |
| **MONGO_PORT** | MongoDB 포트 | `MongoDB 포트번호` | 기본 MongoDB 포트 |
| **MONGO_USERNAME** | MongoDB 사용자 이름 | `MongoDB User Name` | DB 접근 계정 |
| **MYSQL_DATABASE** | MySQL 데이터베이스 이름 | `MySQL Database Name` | 사용할 DB 이름 |
| **MYSQL_HOST** | MySQL 호스트 주소 | `MySQL Host Address` | 로컬 개발 환경 설정 |
| **MYSQL_PASSWORD** | MySQL 비밀번호 | `MySQL Password` | 개발 환경용 (보안 취약) |
| **MYSQL_PORT** | MySQL 포트 | `MySQL 포트번호` | 기본 MySQL 포트 |
| **MYSQL_USER** | MySQL 사용자 이름 | `MySQL User Name` | 개발 환경용 계정 |
| **REDIS_HOST** | Redis 호스트 주소 | `Redis Host Address` | 로컬 개발 환경 설정 |
| **REDIS_PORT** | Redis 포트 | `Redis 포트번호` | 기본 Redis 포트 |
| **SOLAR_PRO_API_KEY** | Solar Pro API 키 | `발급받은 API 키` | 외부 서비스 연동용 키 |
| **VITE_API_BASE_URL** | 백엔드 API 서버 기본 URL | `기본 URL` | 프론트엔드에서 API 요청시 사용되는 기본 URL |
| **VITE_KAKAO_REST_API_KEY** | Kakao REST API 키 | `발급받은 Kakao REST API 키키` | Kakao 서비스(지도, 로그인 등) 연동 시 프론트엔드에서 사용 |
| **VITE_GOOGLE_CLIENT_ID** | Google OAuth 클라이언트 ID | `발급받은 구글 클라이언트 ID` | 프론트엔드에서 Google 로그인 구현 시 사용 |

### 3.3 CI/CD 파이프라인 구성

#### 배포 흐름 개요

#### CI/CD 파이프라인 단계별 설명
1. **소스 코드 관리 (GitLab)**
   - 개발자가 코드를 GitLab 리포지토리 브랜치에 Push
   - GitLab Webhook이 Jenkins에 빌드 요청 트리거
   - 브랜치 기반 배포: `frontend`, `backend`

2. **빌드 및 테스트 (Jenkins)**
   - Jenkins가 GitLab에서 소스 코드 체크아웃
   - FE: Node.js 빌드, BE: Gradle 빌드
   - 단위 테스트 및 통합 테스트 실행

3. **Docker 이미지 빌드 (Jenkins)**
   - Spring Boot Dockerfile을 사용하여 이미지 빌드

4. **운영 서버 배포 (Jenkins → Docker)**
   - Jenkins가 배포 스크립트 실행
   - 배포 후 상태 확인 및 모니터링


#### Spring Boot CICD

##### Spring Boot Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY build/libs/*.jar app.jar

# 환경변수 정의
ARG MYSQL_HOST
ARG MYSQL_PORT
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG KAKAO_APP_ID
ARG KAKAO_CLIENT_ID
ARG KAKAO_REDIRECT_URL
ARG KAKAO_BASE_URL
ARG KAKAO_ADMIN_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_REDIRECT_URL
ARG GOOGLE_BASE_URL
ARG GOOGLE_SECRET
ARG JWT_SECRET_KEY
ARG JWT_ACCESS_EXP
ARG JWT_REFRESH_EXP
ARG JWT_HEADER
ARG JWT_PREFIX
ARG REDIS_HOST
ARG REDIS_PORT
ARG MONGO_CONNECT_NAME
ARG MONGO_DATABASE
ARG MONGO_AUTH
ARG MONGO_HOST
ARG MONGO_PASSWORD
ARG MONGO_PORT
ARG MONGO_USERNAME
ARG SOLAR_PRO_API_KEY

# 빌드 시 주입된 환경변수를 컨테이너 환경변수로 설정
ENV MYSQL_HOST=${MYSQL_HOST}
ENV MYSQL_PORT=${MYSQL_PORT}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV KAKAO_APP_ID=${KAKAO_APP_ID}
ENV KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID}
ENV KAKAO_REDIRECT_URL=${KAKAO_REDIRECT_URL}
ENV KAKAO_BASE_URL=${KAKAO_BASE_URL}
ENV KAKAO_ADMIN_KEY=${KAKAO_ADMIN_KEY}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_REDIRECT_URL=${GOOGLE_REDIRECT_URL}
ENV GOOGLE_BASE_URL=${GOOGLE_BASE_URL}
ENV GOOGLE_SECRET=${GOOGLE_SECRET}
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV JWT_ACCESS_EXP=${JWT_ACCESS_EXP}
ENV JWT_REFRESH_EXP=${JWT_REFRESH_EXP}
ENV JWT_HEADER=${JWT_HEADER}
ENV JWT_PREFIX=${JWT_PREFIX}
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV MONGO_CONNECT_NAME=${MONGO_CONNECT_NAME}
ENV MONGO_DATABASE=${MONGO_DATABASE}
ENV MONGO_AUTH=${MONGO_AUTH}
ENV MONGO_HOST=${MONGO_HOST}
ENV MONGO_PASSWORD=${MONGO_PASSWORD}
ENV MONGO_PORT=${MONGO_PORT}
ENV MONGO_USERNAME=${MONGO_USERNAME}
ENV SOLAR_PRO_API_KEY=${SOLAR_PRO_API_KEY}

ENTRYPOINT ["java", "-jar", "app.jar"]
```

##### Spring Boot Jenkinsfile
```jenkinsfile
pipeline {
    agent any

    environment {
        // MySQL 환경변수
        MYSQL_HOST = credentials('MYSQL_HOST')
        MYSQL_PORT = credentials('MYSQL_PORT')
        MYSQL_DATABASE = credentials('MYSQL_DATABASE')
        MYSQL_USER = credentials('MYSQL_USER')
        MYSQL_PASSWORD = credentials('MYSQL_PASSWORD')

        // OAuth 카카오 환경변수
        KAKAO_APP_ID = credentials('KAKAO_APP_ID')
        KAKAO_CLIENT_ID = credentials('KAKAO_CLIENT_ID')
        KAKAO_REDIRECT_URL = credentials('KAKAO_REDIRECT_URL')
        KAKAO_BASE_URL = credentials('KAKAO_BASE_URL')
        KAKAO_ADMIN_KEY = credentials('KAKAO_ADMIN_KEY')

        // OAuth 구글 환경변수
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_REDIRECT_URL = credentials('GOOGLE_REDIRECT_URL')
        GOOGLE_BASE_URL = credentials('GOOGLE_BASE_URL')
        GOOGLE_SECRET = credentials('GOOGLE_SECRET')

        // JWT 환경변수
        JWT_SECRET_KEY = credentials('JWT_SECRET_KEY')
        JWT_ACCESS_EXP = credentials('JWT_ACCESS_EXP')
        JWT_REFRESH_EXP = credentials('JWT_REFRESH_EXP')
        JWT_HEADER = credentials('JWT_HEADER')
        JWT_PREFIX = credentials('JWT_PREFIX')

        // Redis 환경변수
        REDIS_HOST = credentials('REDIS_HOST')
        REDIS_PORT = credentials('REDIS_PORT')

        // Mongo 환경변수
        MONGO_CONNECT_NAME = credentials('MONGO_CONNECT_NAME')
        MONGO_DATABASE = credentials('MONGO_DATABASE')
        MONGO_AUTH = credentials('MONGO_AUTH')
        MONGO_HOST = credentials('MONGO_HOST')
        MONGO_PASSWORD = credentials('MONGO_PASSWORD')
        MONGO_PORT = credentials('MONGO_PORT')
        MONGO_USERNAME = credentials('MONGO_USERNAME')

        // 생성형AI 환경변수
        SOLAR_PRO_API_KEY = credentials('SOLAR_PRO_API_KEY')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/backend']], extensions: [], userRemoteConfigs: [[credentialsId: 'gitlab-repo-access', url: 'https://lab.ssafy.com/s12-bigdata-recom-sub1/S12P21B201.git']])
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    sh 'chmod +x gradlew'
                    sh './gradlew clean build -x test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh '''
                    docker build \
                    --build-arg MYSQL_HOST=${MYSQL_HOST} \
                    --build-arg MYSQL_PORT=${MYSQL_PORT} \
                    --build-arg MYSQL_DATABASE=${MYSQL_DATABASE} \
                    --build-arg MYSQL_USER=${MYSQL_USER} \
                    --build-arg MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                    --build-arg KAKAO_APP_ID=${KAKAO_APP_ID} \
                    --build-arg KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID} \
                    --build-arg KAKAO_REDIRECT_URL=${KAKAO_REDIRECT_URL} \
                    --build-arg KAKAO_BASE_URL=${KAKAO_BASE_URL} \
                    --build-arg KAKAO_ADMIN_KEY=${KAKAO_ADMIN_KEY} \
                    --build-arg GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
                    --build-arg GOOGLE_REDIRECT_URL=${GOOGLE_REDIRECT_URL} \
                    --build-arg GOOGLE_BASE_URL=${GOOGLE_BASE_URL} \
                    --build-arg GOOGLE_SECRET=${GOOGLE_SECRET} \
                    --build-arg JWT_SECRET_KEY=${JWT_SECRET_KEY} \
                    --build-arg JWT_ACCESS_EXP=${JWT_ACCESS_EXP} \
                    --build-arg JWT_REFRESH_EXP=${JWT_REFRESH_EXP} \
                    --build-arg JWT_HEADER=${JWT_HEADER} \
                    --build-arg JWT_PREFIX=${JWT_PREFIX} \
                    --build-arg REDIS_HOST=${REDIS_HOST} \
                    --build-arg REDIS_PORT=${REDIS_PORT} \
                    --build-arg MONGO_CONNECT_NAME=${MONGO_CONNECT_NAME} \
                    --build-arg MONGO_DATABASE=${MONGO_DATABASE} \
                    --build-arg MONGO_AUTH=${MONGO_AUTH} \
                    --build-arg MONGO_HOST=${MONGO_HOST} \
                    --build-arg MONGO_PASSWORD=${MONGO_PASSWORD} \
                    --build-arg MONGO_PORT=${MONGO_PORT} \
                    --build-arg MONGO_USERNAME=${MONGO_USERNAME} \
                    --build-arg SOLAR_PRO_API_KEY=${SOLAR_PRO_API_KEY} \
                    -t springboot:latest .
                    '''
                }
            }
        }

        stage('Stop Previous Container') {
            steps {
                sh 'docker stop springboot || true'
                sh 'docker rm springboot || true'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker run -d --name springboot \
                  --network techmate_default \
                  -p 8080:8080 \
                  -e MYSQL_HOST=${MYSQL_HOST} \
                  -e MYSQL_PORT=${MYSQL_PORT} \
                  -e MYSQL_DATABASE=${MYSQL_DATABASE} \
                  -e MYSQL_USER=${MYSQL_USER} \
                  -e MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                  -e KAKAO_APP_ID=${KAKAO_APP_ID} \
                  -e KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID} \
                  -e KAKAO_REDIRECT_URL=${KAKAO_REDIRECT_URL} \
                  -e KAKAO_BASE_URL=${KAKAO_BASE_URL} \
                  -e KAKAO_ADMIN_KEY=${KAKAO_ADMIN_KEY} \
                  -e GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
                  -e GOOGLE_REDIRECT_URL=${GOOGLE_REDIRECT_URL} \
                  -e GOOGLE_BASE_URL=${GOOGLE_BASE_URL} \
                  -e GOOGLE_SECRET=${GOOGLE_SECRET} \
                  -e JWT_SECRET_KEY=${JWT_SECRET_KEY} \
                  -e JWT_ACCESS_EXP=${JWT_ACCESS_EXP} \
                  -e JWT_REFRESH_EXP=${JWT_REFRESH_EXP} \
                  -e JWT_HEADER=${JWT_HEADER} \
                  -e JWT_PREFIX=${JWT_PREFIX} \
                  -e REDIS_HOST=${REDIS_HOST} \
                  -e REDIS_PORT=${REDIS_PORT} \
                  -e MONGO_CONNECT_NAME=${MONGO_CONNECT_NAME} \
                  -e MONGO_DATABASE=${MONGO_DATABASE} \
                  -e MONGO_AUTH=${MONGO_AUTH} \
                  -e MONGO_HOST=${MONGO_HOST} \
                  -e MONGO_PASSWORD=${MONGO_PASSWORD} \
                  -e MONGO_PORT=${MONGO_PORT} \
                  -e MONGO_USERNAME=${MONGO_USERNAME} \
                  -e SOLAR_PRO_API_KEY=${SOLAR_PRO_API_KEY} \
                  springboot:latest
                '''
            }
        }
    }
}
```

#### React SPA CICD

##### React Jenkinsfile
```jenkinsfile
pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    
    // 환경 변수 설정
    environment {
        VITE_API_BASE_URL = credentials('VITE_API_BASE_URL') // Jenkins에 등록된 자격 증명 사용
        VITE_KAKAO_REST_API_KEY = credentials('VITE_KAKAO_REST_API_KEY')
        VITE_GOOGLE_CLIENT_ID = credentials('VITE_GOOGLE_CLIENT_ID')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/frontend']], extensions: [], userRemoteConfigs: [[credentialsId: 'gitlab-repo-access', url: 'https://lab.ssafy.com/s12-bigdata-recom-sub1/S12P21B201.git']])
            }
        }
        stage('Build') {
            steps {
                dir('frontend') {
                    // 환경 변수를 .env 파일에 저장
                    sh 'echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env'
                    sh 'echo "VITE_KAKAO_REST_API_KEY=${VITE_KAKAO_REST_API_KEY}" > .env'
                    sh 'echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" > .env'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy to Nginx') {
            steps {
                sh '''
                docker cp frontend/dist/. nginx:/usr/share/nginx/html
                docker exec nginx nginx -s reload
                '''
            }
        }
    }
    post {
        success {
            echo 'Frontend deployment successful!'
        }
        failure {
            echo 'Frontend deployment failed!'
        }
    }
}
```

### 3.4 Nginx 웹서버 설정

#### Docker-Compose 설정

```yaml
nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/html:/usr/share/nginx/html
```

#### 주요 설정 파일
##### **nginx.conf 설정**
```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    include /etc/nginx/conf.d/*.conf;
}
```

##### **default.conf 설정**
```nginx
server {
    listen 80;
    server_name j12b201.p.ssafy.io;

    # HTTP를 HTTPS로 리디렉션
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name j12b201.p.ssafy.io;

    # SSL 인증서 설정
    ssl_certificate /etc/letsencrypt/live/p.ssafy.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/p.ssafy.io/privkey.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # 기본 설정
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 API 설정
    location /api {
        proxy_pass http://172.18.0.6:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. 시스템 아키텍처

![TechMate 시스템 아키텍처](./images/lastTech.png)

## 5. 문서 변경 이력

| **버전** | **날짜** | **변경 내용** | **작성자** |
|----------|---------|--------------|------------|
|v0.0.1|2025-04-09|최초 작성|김의중|