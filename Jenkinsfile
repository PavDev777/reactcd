pipeline {
  agent any

  environment {
    DOCKERHUB_USER = 'pavdev777'      // заполнить
    DOCKERHUB_CRED = 'dockerhub_creds'       // Jenkins credentials id (username/password)
    KUBECONFIG_CRED = 'kubeconfig'      // Jenkins secret file id
    NAMESPACE = 'multitier'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Push images') {
      steps {
        script {
          // login once
          withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CRED, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          }

          // build & push frontend
          sh """
            docker build -t ${DOCKERHUB_USER}/frontend:${BUILD_NUMBER} ./frontend
            docker push ${DOCKERHUB_USER}/frontend:${BUILD_NUMBER}
          """

          // build & push backend
          sh """
            docker build -t ${DOCKERHUB_USER}/backend:${BUILD_NUMBER} ./backend
            docker push ${DOCKERHUB_USER}/backend:${BUILD_NUMBER}
          """
        }
      }
    }

    stage('Helm deploy') {
      steps {
        // use kubeconfig file stored as Secret file in Jenkins (credentials type: Secret file)
        withCredentials([file(credentialsId: env.KUBECONFIG_CRED, variable: 'KUBECONFIG')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG

            # ensure bitnami repo for mariadb (dependency)
            export HELM_EXPERIMENTAL_OCI=1
            helm dependency update ./charts/multitier

            # deploy, passing tags built above
            helm upgrade --install multitier ./charts/multitier -n ${NAMESPACE} --create-namespace \
              --set frontend.image.tag=${BUILD_NUMBER} \
              --set frontend.image.repository=${DOCKERHUB_USER}/frontend \
              --set backend.image.tag=${BUILD_NUMBER} \
              --set backend.image.repository=${DOCKERHUB_USER}/backend
          '''
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline finished"
    }
  }
}
