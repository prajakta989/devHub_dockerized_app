pipeline{
    agent any 
    tools {
        nodejs "NODEJS18"
    }

    stages{
        stage('checkout code'){
            steps{
                git branch:'main', url: "https://github.com/prajakta989/DevHub.git"
            }
        }
        stage('install dependancies'){
            steps{
                sh 'npm install'
            }
        }

        stage('Build step'){
            steps{
                sh 'npm run build || echo "No build step"'
            }
        }

        stage('Testing'){
            steps{
                sh '''
                  if npm start | grep -q test; then 
                  npm test
                  else
                   echo "No tests found skipping..."
                  fi
                '''
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
    }
}