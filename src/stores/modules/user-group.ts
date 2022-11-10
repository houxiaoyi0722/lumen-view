import { defineStore } from "pinia";
import { validNull } from "@/utils/validate";
import { userGroupKVTree } from "@/api/user-group";

export const userGroupStore = defineStore("userGroup", {
  state: () => ({
    userGroupKVTree: [] as any[],
  }),
  getters: {},
  actions: {
    async getUserGroupKVTree() {
      if (validNull(this.userGroupKVTree)) {
        await userGroupKVTree().then((res) => {
          this.userGroupKVTree = res.data;
        });
        return this.userGroupKVTree;
      } else {
        return this.userGroupKVTree;
      }
    },
  },
});
