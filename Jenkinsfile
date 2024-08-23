pipeline {
    agent {
        docker {
            image 'node:14-alpine' // Node.js 환경을 제공하는 Docker 이미지
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Docker 소켓 공유
        }
    }

    environment {
        GITHUB_ACCESS_TOKEN = credentials('github-access-token')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/K-srand/Gangwon-do-activity_frontend.git', credentialsId: 'github-access-token'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') { // frontend 디렉토리로 이동
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('frontend') { // frontend 디렉토리로 이동
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('frontend') { // frontend 디렉토리로 이동
                    script {
                        docker.build('frontend-app', '-f Dockerfile .')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 이미 실행 중인 컨테이너를 중지하고 삭제
                    sh 'docker stop frontend-app || true && docker rm frontend-app || true'

                    // 새로운 컨테이너를 실행
                    sh 'docker run -d --name frontend-app -p 3000:3000 frontend-app'
                }
            }
        }
    }
}
