import { defineStore } from "pinia";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { validNull } from "@/utils/validate";
import {accountStore} from "@/stores/modules/account";
import {tagStore} from "@/stores/modules/tags";
import {routeStore} from "@/stores/modules/route";

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
    setCollapse(collapse: any) {
      this.sidebar.collapse = collapse;
      setItem(COLLAPSE, collapse);
    },
    setDevice(device: string) {
      this.device = device;
    },
  },
});
