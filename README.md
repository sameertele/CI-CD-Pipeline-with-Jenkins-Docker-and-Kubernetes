DevOps CI/CD Pipeline for a Node.js Application
Project Overview
This project demonstrates a fundamental Continuous Integration/Continuous Delivery (CI/CD) pipeline for a simple Node.js Express web application. It automates the entire software delivery process from code commit to deployment, showcasing the integration of essential DevOps tools.

The pipeline automates:

Building the application into a Docker image.

Pushing the Docker image to a container registry.

Deploying the containerized application to a Kubernetes cluster.

Key Features
Automated Builds: Triggered by changes in the source code.

Containerization: Application packaged into a Docker image for consistent environments.

Image Registry Integration: Docker images pushed to and pulled from Docker Hub.

Orchestrated Deployment: Application deployed and managed by Kubernetes.

Local Development Environment: All tools set up for easy local experimentation and learning.

Technologies Used
Node.js / Express.js: The web application runtime and framework.

Docker: For containerizing the application.

Docker Desktop: Provides the Docker Engine and a local Kubernetes environment.

Minikube: A tool for running a single-node Kubernetes cluster locally.

Jenkins: The open-source automation server orchestrating the CI/CD pipeline.

Git / GitHub: For source code version control and hosting the repository.

Docker Hub: A cloud-based registry service for storing Docker images.

kubectl: The command-line tool for interacting with Kubernetes clusters.

Project Structure
my-devops-app/
├── app.js                 # Simple Node.js Express application
├── package.json           # Node.js project dependencies
├── Dockerfile             # Instructions for building the Docker image
├── Jenkinsfile            # Jenkins Pipeline script defining CI/CD stages
└── kubernetes/            # Kubernetes manifest files
    ├── deployment.yaml    # Defines the application deployment (pods)
    └── service.yaml       # Defines how the application is exposed (NodePort)

Getting Started
Follow these steps to set up and run the CI/CD pipeline on your macOS machine.

Prerequisites

Before you begin, ensure you have the following installed:

Homebrew: macOS package manager.

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

Git: For version control.

Docker Desktop: Download and install from Docker Desktop. Ensure it's running.

A Docker Hub account: Create one at hub.docker.com.

Step 1: Create Project Files

Create a directory named my-devops-app and place the app.js, package.json, Dockerfile, Jenkinsfile, and kubernetes/ directory (with deployment.yaml and service.yaml) inside it.

Remember to replace placeholders like your-dockerhub-username and your-github-username/your-repo.git in the Dockerfile, Jenkinsfile, deployment.yaml, and service.yaml with your actual details.

Step 2: Install and Configure Jenkins

Install Jenkins via Homebrew:

brew install jenkins
brew services start jenkins

Get Initial Admin Password:

cat $(brew --prefix)/opt/jenkins/home/secrets/initialAdminPassword

Copy the outputted password.

Access Jenkins UI: Open http://localhost:8080 in your browser.

Complete Setup: Paste the password, "Install suggested plugins," and create your admin user (remember these credentials).

Install Jenkins Plugins: Go to Manage Jenkins > Manage Plugins > Available plugins. Install:

Docker Pipeline

Kubernetes CLI

Pipeline: Kubernetes

Add Docker Hub Credentials to Jenkins:

Go to Manage Jenkins > Manage Credentials > (global).

Click Add Credentials.

Kind: Username with password

Username: Your Docker Hub username

Password: Your Docker Hub password

ID: docker-hub-credentials (Must match the Jenkinsfile variable)

Click Create.

Step 3: Configure Permissions for Jenkins to Use Docker

Your Jenkins service needs permission to interact with Docker Desktop's daemon.

Identify Jenkins running user:

ps aux | grep jenkins | grep -v grep | head -n 1 | awk '{print $1}'

This will likely be your macOS username (e.g., sameertele).

Find Docker socket group:

ls -l /var/run/docker.sock

The group will likely be daemon.

Add your user to the daemon group:

sudo dseditgroup -o edit -a <YOUR_MACOS_USERNAME> -t user daemon

(Replace <YOUR_MACOS_USERNAME> with the username from step 1).

Restart Jenkins:

brew services restart jenkins

Restart your Mac: Highly recommended to ensure group changes propagate.

Step 4: Set up Minikube (Local Kubernetes Cluster)

Disable Kubernetes in Docker Desktop:

Open Docker Desktop Dashboard > Settings > Kubernetes.

Uncheck "Enable Kubernetes" and "Apply & Restart".

Install Minikube & kubectl:

brew install minikube kubectl

Start Minikube Cluster:

minikube start --driver=docker

Wait for it to fully initialize.

Step 5: Push Your Code to GitHub (or other Git provider)

Initialize Git in your project directory:

cd my-devops-app/
git init
git add .
git commit -m "Initial project setup for CI/CD pipeline"

Create a new, empty repository on GitHub.

Link and Push:

git branch -M main
git remote add origin https://github.com/your-github-username/your-repo.git # REPLACE
git push -u origin main

Step 6: Configure and Run Jenkins Pipeline Job

Create New Jenkins Item:

In Jenkins UI, click "New Item".

Name: my-devops-pipeline

Type: Pipeline

Click OK.

Configure Pipeline:

Scroll to "Pipeline" section.

Definition: Pipeline script from SCM

SCM: Git

Repository URL: Your GitHub repository URL.

Branches to build: */main

Script Path: Jenkinsfile

Click Save.

Run Pipeline: Click "Build Now" on the left sidebar of your job page.

Monitor: Check the "Console Output" of the build for progress and any errors.

Step 7: Access Your Deployed Application

Once the Jenkins pipeline completes successfully:

Get Minikube IP:

minikube ip

(e.g., 192.168.49.2)

Confirm Service NodePort:

kubectl get services my-devops-app-service

(Look for 80:30001/TCP, 30001 is the NodePort).

Access on Your Mac:
Open browser to http://<MINIKUBE_IP>:30001 (e.g., http://192.168.49.2:30001).

Access from Another Device (on same network):

Run minikube tunnel in a separate terminal window on your Mac (keep it running). You'll likely be prompted for your password.

Find your Mac's local IP address (e.g., 192.168.1.100) from System Settings > Network.

From the other device, open browser to http://<YOUR_MAC_IP>:30001 (e.g., http://192.168.1.100:30001).

Troubleshooting Common Issues
docker: command not found or kubectl: command not found in Jenkins:

Ensure the executable paths are correctly specified in your Jenkinsfile within withEnv blocks for the relevant stages:

withEnv(["PATH=/usr/local/bin:${env.PATH}"]) { // Use your actual path from 'which docker/kubectl'
    sh "docker build ..."
    sh "kubectl apply ..."
}

401 Unauthorized during docker build (pulling base image):

This is often due to Docker Hub rate limits on unauthenticated pulls. Ensure docker login happens before docker build in your Jenkinsfile's "Build Docker Image" stage.

connect: connection refused or Kubernetes deployment errors:

Your Minikube cluster is likely not running or unhealthy. In your terminal, run minikube stop then minikube start --driver=docker. Wait for it to fully start.

Application not accessible from other devices:

Check your Mac's Firewall: Temporarily disable it for testing. If it works, add a rule to allow connections to port 30001.

Verify minikube tunnel is running.

Ensure both devices are on the same local network. Check router settings for "AP Isolation" or "Client Isolation."

Shutting Down and Restarting
To Shut Down:

Stop Minikube Tunnel (if running): Press Ctrl+C in its terminal window.

Stop Minikube Cluster:

minikube stop

Stop Jenkins Service:

brew services stop jenkins

Quit Docker Desktop: Click the Docker whale icon in your menu bar and select "Quit Docker Desktop".

To Restart:

Start Docker Desktop: Launch the Docker Desktop application. Wait for it to fully start (whale icon solid).

Start Minikube Cluster:

minikube start --driver=docker

Start Jenkins Service:

brew services start jenkins

Access Jenkins UI: Go to http://localhost:8080.

Run Jenkins Pipeline: Navigate to your my-devops-pipeline job and click "Build Now".

(Optional - For external access): Open a new terminal and run minikube tunnel.

This README provides a comprehensive guide to replicate and understand the CI/CD pipeline project. Feel free to explore, modify, and enhance it further!
