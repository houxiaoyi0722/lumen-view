import { defineStore } from "pinia";

export const appStore = defineStore("app", {
  state: () => ({
    name: "lumen",
    authorization: {
      token: "",
      refreshToken: "",
      tokenHead: "",
      expiresIn: 0,
    },
  }),
  getters: {
    incrName: (state) => state.name,
  },
  actions: {
    clearToken() {
      this.authorization = {
        token: "",
        refreshToken: "",
        tokenHead: "",
        expiresIn: 0,
      };
    },
    setToken(token: any) {
      this.authorization = token;
    },
  },
});
