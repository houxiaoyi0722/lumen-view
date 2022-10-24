import { defineStore } from "pinia";
import { getUserinfo } from "@/api/login";
import { getItem, removeItem, setItem } from "@/utils/storage";
import {validNull} from "@/utils/validate";
import {tagStore} from "@/stores/modules/tags";
import {routeStore} from "@/stores/modules/route";

const TOKEN = "TOKEN";

export const accountStore = defineStore({
  id: "account",
  state: () => ({
    userinfo: undefined,
    authorization: {
      token: "",
      refreshToken: "",
      tokenHead: "",
    },
  }),
  getters: {
    getUserInfo: (state) => {
      if (!state.userinfo) {
        state.userinfo = getItem("userinfo");
      }
      return state.userinfo;
    },
    getAuthorization: (state) => {
      if (validNull(state.authorization.token)) {
        state.authorization = getItem(TOKEN);
      }
      return state.authorization;
    },
  },
  actions: {
    // 获取用户信息
    async loadUserinfo() {
      const { data } = await getUserinfo();
      this.userinfo = data;
      setItem("userinfo", data);
      return Promise.resolve(data);
    },
    clearUserinfo() {
      this.userinfo = undefined;
      removeItem("userinfo");
    },
    clearToken() {
      removeItem(TOKEN);
      // @ts-ignore
      this.authorization = {};
      const account_store = accountStore();
      const tag_store = tagStore();
      const route_store = routeStore();
      account_store.clearUserinfo();
      tag_store.clearAllTags();
      route_store.removeRoute();
    },
    setToken(token: any) {
      setItem(TOKEN, token);
      this.authorization = token;
    },
  },
});
