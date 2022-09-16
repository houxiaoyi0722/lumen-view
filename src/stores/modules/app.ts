import { defineStore } from "pinia";
import { removeItem, setItem } from "@/utils/storage";

export const appStore = defineStore("app", {
  state: () => ({
    name: "lumen",
    authorization: {
      token: "",
      refreshToken: "",
      tokenHead: "",
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
      removeItem("TOKEN");
      // @ts-ignore
      this.authorization = {};
    },
    setToken(token: any) {
      setItem("TOKEN", token);
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
