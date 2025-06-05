// Jenkinsfile for CI/CD Pipeline
// This pipeline automates the build, push, and deployment of a Node.js application
// using Docker and Kubernetes.

def appName = "my-devops-app" // Name of application
def dockerRegistry = "telesameer"
def dockerImage = "${dockerRegistry}/${appName}"
def dockerTag = "latest"

pipeline {
    agent any // The Jenkins agent where the pipeline will run

    environment {
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'
    }
// Stage 1
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out source code..."
                    git branch: 'main', url: 'https://github.com/sameertele/CI-CD-Pipeline-with-Jenkins-Docker-and-Kubernetes' // REPLACE with your actual Git repo URL
                }
            }
        }

        // Stage 2
        stage('Build Docker Image') {
            steps {
                script {
                    def dockerBinPath = '/usr/local/bin'
                    withEnv(["PATH=${dockerBinPath}:${env.PATH}"]){
                        withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                            echo "Logged into Docker Hub. Starting Docker build..."
                        }
                    echo "Building Docker image: ${dockerImage}:${dockerTag}"
                    docker.build("${dockerImage}:${dockerTag}", ".")
                    }
                }
            }
        }
// Stage 3: 
        stage('Push Docker Image') {
            steps {
                script {
                    def dockerBinPath = '/usr/local/bin' 
                    withEnv(["PATH=${dockerBinPath}:${env.PATH}"]) {
                        echo "Pushing Docker image to registry: ${dockerImage}:${dockerTag}"
                        withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                            sh "docker push ${dockerImage}:${dockerTag}"
                        }
                    }
                }
            }
        }

        // Stage 4: Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def kubectlBinPath = '/usr/local/bin'
                    
                    withEnv(["PATH=${kubectlBinPath}:${env.PATH}"]) {
                        echo "Deploying to Kubernetes..."
                        sh "kubectl apply -f kubernetes/deployment.yaml"
                        sh "kubectl apply -f kubernetes/service.yaml"
                        echo "Deployment to Kubernetes complete."
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}