pipeline {
    agent {
        docker {
            image 'node:14-alpine' // Node.js 환경을 제공하는 Docker 이미지
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        GITHUB_ACCESS_TOKEN = credentials('github-access-token')
        NODE_OPTIONS = '--max-old-space-size=2048' // 메모리 옵션 추가
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/K-srand/Gangwon-do-activity_frontend.git', credentialsId: 'github-access-token'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm config set cache /var/lib/jenkins/.npm'
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
