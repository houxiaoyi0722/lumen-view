import axios from "axios";
import { ElMessage } from "element-plus";
import { appStore } from "@/stores/modules/app";
import router from "@/router";
import { validNull } from "@/utils/validate";
import { getItem } from "@/utils/storage";
import {accountStore} from "@/stores/modules/account";

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 100000,
  withCredentials: true,
});

// 拦截请求
request.interceptors.request.use(
  (config) => {
    const authorization = getItem("TOKEN");
    if (!validNull(authorization)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers["Authorization"] =
        `Bearer ` + JSON.stringify(authorization);
    }

    return config;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

// 拦截响应
request.interceptors.response.use(
  // 响应成功进入第1个函数，该函数的参数是响应对象
  (response) => {
    return response.data;
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async (error) => {
    // 如果响应码是 401 ，则请求获取新的 token
    // 响应拦截器中的 error 就是那个响应的错误对象
    if (error.response && error.response.status === 401) {
      // 校验是否有 refresh_token
      const app_store = appStore();
      const account_store = accountStore();
      const authorization = error.response.headers["authorization"];

      if (validNull(authorization)) {
        ElMessage.error(error.response.data.message);

        // 清除token
        await app_store.clearToken();
        await account_store.clearUserinfo();

        const redirect = encodeURIComponent(window.location.href);
        await router.push(`/login?redirect=${redirect}`);

        return Promise.reject(error);
      } else {
        // 如果refresh_token未过期且接口返回新的token,重新请求

        // 如果获取成功，则把新的 token 更新到容器中
        const auth = app_store.getAuthorization;
        app_store.setToken({
          token: authorization,
          refreshToken: auth.refreshToken,
          tokenHead: auth.tokenHead,
        });
        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config);
      }
    }

    // console.dir(error) // 可在此进行错误上报
    try {
      ElMessage.error(error.response.data.message);
    } catch (err) {
      ElMessage.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default request;
