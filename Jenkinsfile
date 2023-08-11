pipeline {

  agent any

  environment {
    PROFILE = "test"
    DOCKER_REGISTY = "10.144.233.86:8082"
    img_name = "lumen-view-${PROFILE}"
    img_version = "0.0.1"
  }

  stages {

    stage('准备') {
      steps {
        sh 'printenv'
      }
    }

    stage('构建') {
      steps {
        sh 'sonar-scanner -Dsonar.projectKey=lumen-view -Dsonar.sources=. -Dsonar.host.url=http://10.144.233.86:9002 -Dsonar.login=${SONAR_TOKEN}'
        sh "npm config get registry"
        sh "npm config set registry=http://10.144.233.86:8011/repository/lumen-npm/"
        sh "npm install"
        sh "npm run build-only:${PROFILE}"
      }
    }

    stage('打包镜像') {
      steps {
        sh "docker build -t ${img_name.toLowerCase()}:${img_version.toLowerCase()} -f Dockerfile ."
        sh "docker tag ${img_name.toLowerCase()}:${img_version.toLowerCase()} ${DOCKER_REGISTY}/sang/${img_name.toLowerCase()}:${img_version.toLowerCase()}"
        sh "docker tag ${img_name.toLowerCase()}:${img_version.toLowerCase()} ${DOCKER_REGISTY}/sang/${img_name.toLowerCase()}:latest"
        withCredentials([usernamePassword(credentialsId: 'docker-register', passwordVariable: 'dockerPassword', usernameVariable: 'dockerUser')]) {
          sh "docker login -u ${dockerUser} -p ${dockerPassword} ${DOCKER_REGISTY}"
          sh "docker push ${DOCKER_REGISTY}/sang/${img_name.toLowerCase()}:${img_version.toLowerCase()}"
          sh "docker push ${DOCKER_REGISTY}/sang/${img_name.toLowerCase()}:latest"
        }
      }
    }

    stage('部署') {
      steps {
        sh "cp k8s/deployment.yaml /opt/kubernetes/lumen/deployment-lumen-view.yaml"
        script {
          def remote = [:]
          remote.name = 'centos'
          remote.host = '10.144.233.86'
          withCredentials([usernamePassword(credentialsId: 'centos', passwordVariable: 'password', usernameVariable: 'user')]) {
            remote.user = "${user}"
            remote.password = "${password}"
            remote.allowAnyHosts = true
          }
          sshCommand remote: remote, command: "kubectl delete -f /opt/kubernetes/lumen/deployment-lumen-view.yaml"
          sshCommand remote: remote, command: "kubectl apply -f /opt/kubernetes/lumen/deployment-lumen-view.yaml"
        }
      }
    }

  }
}
