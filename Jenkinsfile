pipeline {
    agent {
        docker {
            image 'node:14-alpine' // Node.js 환경을 제공하는 Docker 이미지
            args '-v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.npm:/root/.npm' // 캐시 디렉토리 마운트
        }
    }

    environment {
        NODE_OPTIONS = '--max-old-space-size=2048' // 메모리 옵션 추가
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/K-srand/Gangwon-do-activity_frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // npm 캐시 경로를 Jenkins 홈 디렉토리로 설정
                sh 'npm config set cache /var/lib/jenkins/.npm --global'
                // npm 글로벌 설치 경로를 Jenkins 홈 디렉토리로 설정
                sh 'npm config set prefix /var/lib/jenkins/.npm-global --global'
                // 의존성 설치
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('frontend-app', '-f Dockerfile .')
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker stop frontend-app || true && docker rm frontend-app || true'
                    sh 'docker run -d --name frontend-app -p 3000:3000 frontend-app'
                }
            }
        }
    }
}
