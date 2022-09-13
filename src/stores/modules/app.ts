import { defineStore } from "pinia";
import { setItem } from "@/utils/storage";

export const appStore = defineStore("app", {
  state: () => ({
    name: "lumen",
    authorization: {
      token: "",
      refreshToken: "",
      tokenHead: "",
      expiresIn: 0,
    },
    sidebar: {
      collapse: {},
    },
    device: "",
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
      setItem("TOKEN",token);
      this.authorization = token;
    },
    setCollapse(collapse: any) {
      this.sidebar.collapse = collapse;
    },
    setDevice(device: string) {
      this.device = device;
    },
  },
});
