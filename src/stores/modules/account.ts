import { defineStore } from "pinia";
import { getUserinfo } from "@/api/login";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { validNull } from "@/utils/validate";
import { tagStore } from "@/stores/modules/tags";
import { routeStore } from "@/stores/modules/route";
import type { User } from "@/types/ManageType";

const TOKEN = "TOKEN";
const USERINFO = "USERINFO";
const PERMISSIONS = "PERMISSIONS";

export const accountStore = defineStore({
  id: "account",
  state: () => ({
    userinfo: {} as User,
    authorization: {
      token: "",
      refreshToken: "",
      tokenHead: "",
    },
    permissions: [] as string[],
  }),
  getters: {
    getUserInfo: (state) => {
      if (validNull(state.userinfo)) {
        state.userinfo = getItem(USERINFO);
      }
      return state.userinfo;
    },
    getAuthorization: (state) => {
      if (validNull(state.authorization.token)) {
        state.authorization = getItem(TOKEN);
      }
      return state.authorization;
    },
    getPermissions: (state) => {
      if (validNull(state.permissions)) {
        state.permissions = getItem(PERMISSIONS);
      }
      return state.permissions;
    },
  },
  actions: {
    // 获取用户信息
    async loadUserinfo() {
      const { data } = await getUserinfo();
      let perArr: string[] = [];
      if (!validNull(data.roles)) {
        data.roles.forEach((role) => {
          perArr = perArr.concat(role.permissions.map((item) => item.code));
        });
      }
      this.userinfo = data;
      this.permissions = perArr;

      setItem(USERINFO, data);
      setItem(PERMISSIONS, perArr);
      return Promise.resolve(data);
    },
    clearUserinfo() {
      this.userinfo = {} as User;
      removeItem(USERINFO);
      removeItem(PERMISSIONS);
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
