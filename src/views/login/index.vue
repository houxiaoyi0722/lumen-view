<template>
  <div class="login">
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <h1 class="title">Vue3 Element Admin</h1>
      <el-form-item prop="username">
        <el-input
          v-model="model.username"
          prefix-icon="UserFilled"
          clearable
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="model.password"
          prefix-icon="Lock"
          show-password
          clearable
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="btn"
          @click="submit"
        >
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
} from "vue";
import { Login } from "/src/api/login.ts";
import { useRouter, useRoute } from "vue-router";
import { appStore } from "../../stores/modules/app";

export default defineComponent({
  name: "login",
  setup() {
    const app_store = appStore();
    const { proxy: ctx } = getCurrentInstance(); // 可以把ctx当成vue2中的this
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      model: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      loading: false,
      btnText: computed(() => (state.loading ? "登录中..." : "登录")),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return;
        }
        state.loginForm.validate(async (valid) => {
          if (valid) {
            state.loading = true;
            const { refreshToken, token, tokenHead } = await Login(
              state.model
            ).catch(() => {
              state.loading = false;
            });
            const data = {
              refreshToken: refreshToken,
              token: token,
              tokenHead: tokenHead,
            };
            app_store.setToken(data);

            ctx.$message.success({
              message: "登录成功",
              duration: 1000,
            });
            const targetPath = decodeURIComponent(route.query.redirect);
            if (targetPath.startsWith("http")) {
              // 如果是一个url地址
              window.location.href = targetPath;
            } else if (targetPath.startsWith("/")) {
              // 如果是内部路由地址
              await router.push(targetPath);
            } else {
              await router.push("/");
            }
            state.loading = false;
          }
        });
      },
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;
  .form {
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;
    .title {
      color: #fff;
      text-align: center;
      font-size: 24px;
      margin: 0 0 24px;
    }
    .btn {
      width: 100%;
    }
  }
}
</style>
