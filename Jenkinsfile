pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vardhans07/ChatterUp_project.git'
            }
        }

        stage('Check Node') {
            steps {
                bat '"D:\\C\\Program Files\\nodejs\\node.exe" -v'
                bat '"D:\\C\\Program Files\\nodejs\\npm.cmd" -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '"D:\\C\\Program Files\\nodejs\\npm.cmd" install'
            }
        }

        stage('Build') {
            steps {
                bat '"D:\\C\\Program Files\\nodejs\\npm.cmd" run build'
            }
        }

        stage('Test') {
            steps {
                bat '"D:\\C\\Program Files\\nodejs\\npm.cmd" test'
            }
        }

        stage('Deploy') {
            steps {
                bat '"D:\\C\\Program Files\\nodejs\\node.exe" index.js'
            }
        }
    }
}
