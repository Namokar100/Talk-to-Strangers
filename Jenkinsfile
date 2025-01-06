pipeline {
    agent any
    environment {
        APP_DIR = '.'  // Replace with your application directory
    }
    triggers {
        // Automatically triggers the pipeline when there's a push event from GitHub
        pollSCM('H/5 * * * *') // You can replace this with a webhook trigger
    }
    stages {
        stage('Checkout Code') {
            steps {
                // Pull the latest code from GitHub
                git branch: 'main', credentialsId: 'github_credentials', url: 'https://github.com/Namokar100/Talk-to-Strangers.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Navigate to the app directory and install dependencies
                dir(APP_DIR) {
                    bat 'npm install'
                }
            }
        }
        stage('Restart Server') {
            steps {
                // Use pm2 to restart the server
                dir(APP_DIR) {
                    sh '''
                    pm2 stop all || true
                    pm2 start index.js --name tg-backend
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline execution completed.'
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}
