pipeline {
    agent none

    stages {
        stage('Clone Repository') {
            agent {
                docker {
                    image 'node:14-alpine' // Node.js 환경을 제공하는 Docker 이미지
                    args '-u root' // 루트 사용자로 실행
                }
            }
            steps {
                git branch: 'main', url: 'https://github.com/K-srand/Gangwon-do-activity_frontend.git'
            }
        }

        stage('Install Dependencies and Build') {
            agent {
                docker {
                    image 'node:14-alpine' // Node.js 환경을 제공하는 Docker 이미지
                    args '-u root' // 루트 사용자로 실행
                }
            }
            environment {
                NODE_OPTIONS = '--max-old-space-size=4096' // 메모리 옵션 추가
                PATH = "/usr/bin:/usr/local/bin:$PATH" // Docker 경로 추가
            }
            steps {
                // npm 캐시 경로를 Jenkins 홈 디렉토리로 설정
                sh 'npm config set cache /var/lib/jenkins/.npm --global'
                // npm 글로벌 설치 경로를 Jenkins 홈 디렉토리로 설정
                sh 'npm config set prefix /var/lib/jenkins/.npm-global --global'
                // 의존성 설치
                sh 'npm install'
                // CI 환경 변수 설정을 해제하여 경고 무시
                sh 'CI=false npm run build'
            }
        }

        stage('Build Docker Image') {
            agent any // Jenkins 호스트 또는 Docker를 지원하는 별도의 에이전트를 사용
            steps {
                script {
                    echo '도커 버전 확인 및 빌드'
                    sh 'docker --version'
                    echo "Docker 이미지를 빌드 중..."
                    sh 'docker build -t ksuji/frontend-app:latest -f Dockerfile .'
                }
            }
        }

        stage('Docker Push') {
            agent any // Jenkins 호스트 또는 Docker를 지원하는 별도의 에이전트를 사용
            steps {
                echo 'Docker Hub에 로그인 중...'
                withCredentials([
                    string(credentialsId: 'docker-hub-username', variable: 'DOCKER_HUB_USERNAME'),
                    string(credentialsId: 'docker-hub-password', variable: 'DOCKER_HUB_PASSWORD')
                ]) {
                    sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                }
                echo "Docker 이미지를 푸시 중..."
                sh 'docker push ksuji/frontend-app:latest'
            }
        }

        stage('Deploy') {
            agent any // Jenkins 호스트 또는 Docker를 지원하는 별도의 에이전트를 사용
            steps {
                script {
                    sh 'docker stop frontend-app || true && docker rm frontend-app || true'
                    sh 'docker run -d --name frontend-app -p 3000:3000 ksuji/frontend-app:latest'
                }
            }
        }
    }
}
