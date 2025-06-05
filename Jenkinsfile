// Jenkinsfile for CI/CD Pipeline
// This pipeline automates the build, push, and deployment of a Node.js application
// using Docker and Kubernetes.

// Define environment variables
def appName = "my-devops-app" // Name of your application
def dockerRegistry = "telesameer" // Replace with your Docker Hub username
def dockerImage = "${dockerRegistry}/${appName}" // Full Docker image name
def dockerTag = "latest" // Or use a dynamic tag like env.BUILD_NUMBER

pipeline {
    agent any // The Jenkins agent where the pipeline will run

    environment {
        // Define Docker Hub credentials ID configured in Jenkins
        // This ID should match the one you set up in Jenkins Credentials
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'
    }

    stages {
        // Stage 1: Checkout SCM (Source Code Management)
        // Fetches the source code from the configured Git repository.
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out source code..."
                    // Ensure your Jenkins job is configured to use SCM (Git)
                    // For example, if using a Git repo, configure it in the job settings.
                    // This step is implicitly handled by Jenkins if configured correctly.
                    // For a declarative pipeline, 'checkout scm' is often implied or can be explicit.
                    git branch: 'main', url: 'https://github.com/sameertele/CI-CD-Pipeline-with-Jenkins-Docker-and-Kubernetes' // REPLACE with your actual Git repo URL
                }
            }
        }

        // Stage 2: Build Docker Image
        // Builds the Docker image from the Dockerfile in the workspace.
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${dockerImage}:${dockerTag}"
                    // Build the Docker image using the Dockerfile in the current directory
                    // The 'docker.build()' command is provided by the Docker Pipeline plugin
                    docker.build("${dockerImage}:${dockerTag}", ".")
                }
            }
        }

        // Stage 3: Push Docker Image to Registry
        // Pushes the built Docker image to Docker Hub using the configured credentials.
        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker image to registry: ${dockerImage}:${dockerTag}"
                    // Get Docker Hub credentials
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        // Push the image to Docker Hub
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker push ${dockerImage}:${dockerTag}"
                        sh "docker logout" // Log out after pushing
                    }
                }
            }
        }

        // Stage 4: Deploy to Kubernetes
        // Applies the Kubernetes deployment and service manifests to the cluster.
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes..."
                    // Apply Kubernetes deployment and service manifests
                    // Ensure your Jenkins agent has kubectl configured and authenticated
                    // You might need to configure a Kubernetes Cloud in Jenkins for this
                    // or ensure kubectl is available on the agent and configured to connect
                    // to your cluster.
                    sh "kubectl apply -f kubernetes/deployment.yaml"
                    sh "kubectl apply -f kubernetes/service.yaml"
                    echo "Deployment to Kubernetes complete."
                }
            }
        }
    }

    // Post-build actions (e.g., cleanup, notifications)
    post {
        always {
            echo "Pipeline finished."
            // Clean up workspace if needed
            // cleanWs()
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}