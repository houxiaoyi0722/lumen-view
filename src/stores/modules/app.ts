import { defineStore } from "pinia";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { validNull } from "@/utils/validate";

const COLLAPSE = "VEA-COLLAPSE";
const TOKEN = "TOKEN";

export const appStore = defineStore("app", {
  state: () => ({
    name: "lumen",
    authorization: {
      token: "",
      refreshToken: "",
      tokenHead: "",
    },
    sidebar: {
      collapse: getItem(COLLAPSE),
    },
    device: "",
  }),
  getters: {
    getAuthorization: (state) => {
      if (validNull(state.authorization.token)) {
        state.authorization = getItem(TOKEN);
      }
      return state.authorization;
    },
  },
  actions: {
    clearToken() {
      removeItem(TOKEN);
      // @ts-ignore
      this.authorization = {};
    },
    setToken(token: any) {
      setItem(TOKEN, token);
      this.authorization = token;
    },
    setCollapse(collapse: any) {
      this.sidebar.collapse = collapse;
      setItem(COLLAPSE, collapse);
    },
    setDevice(device: string) {
      this.device = device;
    },
  },
});
