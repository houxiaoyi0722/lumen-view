import { defineStore } from "pinia";
import { getUserinfo } from "@/api/login";

export const accountStore = defineStore({
  id: "account",
  state: () => ({
    userinfo: undefined,
  }),
  getters: {},
  actions: {
    // 获取用户信息
    async loadUserinfo() {
      const { data } = await getUserinfo();
      this.userinfo = data;
      return Promise.resolve(data);
    },
    clearUserinfo() {
      this.userinfo = undefined;
    },
  },
});
