pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'frontend-app:latest'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/jenkinstest', url: 'https://github.com/K-srand/Gangwon-do-activity_frontend.git'
            }
        }
        stage('Install Dependencies') {
            when {
                branch 'feature/jenkinstest'
            }
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            when {
                branch 'feature/jenkinstest'
            }
            steps {
                sh 'npm run build'
            }
        }
        stage('Docker Build') {
            when {
                branch 'feature/jenkinstest'
            }
            steps {
                script {
                    dockerImage = docker.build(DOCKER_IMAGE)
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'feature/jenkinstest'
            }
            steps {
                script {
                    sh 'docker stop frontend-app || true'
                    sh 'docker rm frontend-app || true'
                    sh 'docker run -d -p 3030:80 --name frontend-app frontend-app:latest'
                }
            }
        }
    }
}
