import { defineStore } from "pinia";
import { getUserinfo } from "@/api/login";
import { getItem, removeItem, setItem } from "@/utils/storage";

export const accountStore = defineStore({
  id: "account",
  state: () => ({
    userinfo: undefined,
  }),
  getters: {
    getUserInfo: (state) => {
      if (!state.userinfo) {
        state.userinfo = getItem("userinfo");
      }
      return state.userinfo;
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
  },
});
