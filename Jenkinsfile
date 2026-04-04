pipeline{
    agent any

    tools {
        nodejs "NODEJS20"
    }

    enviroment {
        DOCKER_HUB = "prajakta989"
        FRONTEND_IMAGE = "${DOCKER_HUB}/devhubweb"
        BACKEND_IMAGE = "${DOCKER_HUB}/devhub"
    }

    stages{
        stage('Checkout code'){
            steps {
                git  branch: 'main', url: 'https://github.com/prajakta989/devHub_dockerized_app.git'
            }
        }

        stage('Frontend - Install dependancies'){
            steps {
                dir('devHub-web'){
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Build'){
            steps{
                dir('devHub-web'){
                    sh 'npm run build'
                }
            }
        }

        stage('Frontend - SonarQube Analysis') {
            environment {
                scannerHome = tool 'SONAR'
            }
            dir('devHub-web'){
                steps {
                 withSonarQubeEnv('sonarserver') {
                    sh 'echo $scannerHome'
                    sh '''
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=devhub-web \
                    -Dsonar.sources=.'''
                    }
                }
            }
            
        }

        // BACKEND STAGES

        stage('Backend - Install dependancies'){
            steps {
                dir('DevHub'){
                    sh 'npm install'
                }
            }
        }

        stage('Backend - Build'){
            steps{
                dir('DevHub'){
                    sh 'npm run build || echo "No build step"'
                }
            }
        }

        stage('Backend - Test') {
            steps {
                dir('DevHub') {
                    sh '''
                      if npm start | grep -q test; then 
                        npm test
                      else
                        echo "No tests found skipping..."
                      fi
                    '''
                }
            }
        }

        //DOCKER STAGES
        stage('Docker Build Images'){
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:latest ./devHub-web'
                sh 'docker build -t $BACKEND_IMAGE:latest ./DevHub'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $FRONTEND_IMAGE:latest'
                sh 'docker push $BACKEND_IMAGE:latest'
            }
        }

        // ================= DEPLOY =================
        stage('Deploy Containers') {
            steps {
                sh '''
                docker stop frontend || true
                docker stop backend || true

                docker rm frontend || true
                docker rm backend || true

                docker run -d -p 3000:3000 --name frontend $FRONTEND_IMAGE:latest
                docker run -d -p 5000:5000 --name backend $BACKEND_IMAGE:latest
                '''
            }
        }

    }
}