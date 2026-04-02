pipeline{
    agent any 
    
    tools{
        nodejs "NODEJS18"
    }

    stages{
        stage('Checkout'){
            steps{
                git 'https://github.com/prajakta989/devHub-web.git'
            }
        }

        stage('Install dependancies'){
            steps{
                sh 'npm install'
            }
        }

        stage('Build'){
            steps{
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'SONAR'
            }
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

        // stage('Quality Gate') {
        //     steps {
        //         timeout(time: 2, unit: 'HOURS') {
        //         waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }
    }
}