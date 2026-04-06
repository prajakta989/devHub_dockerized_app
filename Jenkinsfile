pipeline{
    agent any

    tools {
        nodejs "NODEJS20"
    }

    environment {
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
            steps {
                dir('devHub-web') {
                    withSonarQubeEnv('sonarserver') {
                        sh '''
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=devhub-web \
                        -Dsonar.sources=.
                        '''
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

        stage('Testing') {
            steps {
                dir('backend') {
                    sh '''
                    if grep -q '"test"' package.json; then
                        npm test
                    else
                        echo "No tests found, skipping..."
                    fi
                    '''
                }
            }
        }

        stage('SonarQube Analysis'){
            steps{
                withSonarQubeEnv('sonarserver'){
                    sh '''
                        npx sonar-scanner \
                        -Dsonar.projectKey=devshub-backend \
                        -Dsonar.sources=. \
                    '''
                }
            }
        }

        //DOCKER STAGES
        stage('Docker Build Images'){
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER ./devHub-web'
                sh 'docker build -t $BACKEND_IMAGE:$BUILD_NUMBER ./DevHub'
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
                sh '''
                # Tag as latest
                docker tag $FRONTEND_IMAGE:$BUILD_NUMBER $FRONTEND_IMAGE:latest
                docker tag $BACKEND_IMAGE:$BUILD_NUMBER $BACKEND_IMAGE:latest

                # Tag as latest
                docker push $FRONTEND_IMAGE:$BUILD_NUMBER
                docker push $BACKEND_IMAGE:$BUILD_NUMBER

                # Push latest images
                docker push $FRONTEND_IMAGE:latest
                docker push $BACKEND_IMAGE:$BUILD_NUMBER
                '''
            }
        }

        // ================= DEPLOY =================
        stage('Deploy Containers') {
            steps {
                withCredentials([
                    string(credentialsId: 'MONGODB_CONNECTION_STRING', variable: 'MONGODB_CONNECTION_STRING'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    sh '''
                    export TAG=$BUILD_NUMBER
                    docker compose down || true

                    export MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING
                    export JWT_SECRET=$JWT_SECRET

                    docker compose up -d
                    '''
                }
            }
        }

        //Health check
        stage('Health Check') {
            steps {
                sh '''
                sleep 10
                curl -f http://backend:3000/feed || exit 1
                '''
            }
        }

    }
}