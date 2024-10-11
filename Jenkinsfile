pipeline {
    agent none

    stages {
        stage('Clone Repository') {
            agent {
                docker {
                    image 'node:14-alpine'
                    args '-u root'
                }
            }
            steps {
                git branch: 'main', url: 'https://github.com/K-srand/Gangwon-do-activity_frontend.git'
            }
        }

        stage('Install Dependencies and Build') {
            agent {
                docker {
                    image 'node:14-alpine'
                    args '-u root'
                }
            }
            environment {
                NODE_OPTIONS = '--max-old-space-size=4096'
                PATH = "/usr/bin:/usr/local/bin:$PATH"
            }
            steps {
                sh 'npm config set cache /var/lib/jenkins/.npm --global'
                sh 'npm config set prefix /var/lib/jenkins/.npm-global --global'
                sh 'npm install'
                sh 'CI=false npm run build'
            }
        }

        stage('Build Docker Image') {
            agent any
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
            agent any
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
            agent any
            steps {
                script {
                    try {
                        sh 'docker stop frontend-app || true && docker rm frontend-app || true'
                        sh 'docker run -d --name frontend-app -p 80:80 ksuji/frontend-app:latest'
                    } catch (Exception e) {
                        echo "Deployment failed: ${e.message}"
                    }
                }
            }
        }
    }
}
