pipeline {

  agent any

  environment {
    PROFILE = "test"
    DOCKER_REGISTY = "10.144.233.86:8082"
    img_name = "lumen-view-${PROFILE}"
    img_version = "0.0.1"
  }

  stages {

    stage('prepare') {
      steps {
        sh 'printenv'
      }
    }

    stage('npm build') {
      steps {
        sh "npm install"
        sh "npm run build-only:${PROFILE}"
      }
    }

    stage('image build and push') {
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

    //stage("部署到远端服务") {
    //  steps {
    //    script {
    //      def remoteConfig = [:]
    //      remoteConfig.name = "my-remote-server"
    //      remoteConfig.host = "${REMOTE_HOST}"
    //      remoteConfig.port = "${REMOTE_SSH_PORT}".toInteger()
    //      remoteConfig.allowAnyHosts = true
    //
    //      withCredentials([
    //        sshUserPrivateKey(
    //          credentialsId: "${REMOTE_CRED}",
    //          keyFileVariable: "privateKeyFilePath"
    //        ),
    //        usernamePassword(
    //          credentialsId: "${CODING_ARTIFACTS_CREDENTIALS_ID}",
    //          usernameVariable: 'CODING_DOCKER_REG_USERNAME',
    //          passwordVariable: 'CODING_DOCKER_REG_PASSWORD'
    //        )
    //      ]) {
    //        // SSH 登录用户名
    //        remoteConfig.user = "${REMOTE_USER_NAME}"
    //        // SSH 私钥文件地址
    //        remoteConfig.identityFile = privateKeyFilePath
    //
    //        // 请确保远端环境中有 Docker 环境
    //        sshCommand(
    //          remote: remoteConfig,
    //          command: "docker login -u ${CODING_DOCKER_REG_USERNAME} -p ${CODING_DOCKER_REG_PASSWORD} ${CODING_DOCKER_REG_HOST}",
    //          sudo: true,
    //        )
    //
    //        sshCommand(
    //          remote: remoteConfig,
    //          command: "docker rm -f java-spring-app | true",
    //          sudo: true,
    //        )
    //
    //        // DOCKER_IMAGE_VERSION 中涉及到 GIT_LOCAL_BRANCH / GIT_TAG / GIT_COMMIT 的环境变量的使用
    //        // 需要在本地完成拼接后，再传入到远端服务器中使用
    //        DOCKER_IMAGE_URL = sh(
    //          script: "echo ${CODING_DOCKER_REG_HOST}/${CODING_DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}",
    //          returnStdout: true
    //        )
    //
    //        sshCommand(
    //          remote: remoteConfig,
    //         command: "docker run -d -p 8080:8080 --name java-spring-app ${DOCKER_IMAGE_URL}",
    //          sudo: true,
    //       )
    //
    //        echo "部署成功，请到 http://${REMOTE_HOST}:8080 预览效果"
    //      }
    //    }
    //  }
    //}
  }
}
