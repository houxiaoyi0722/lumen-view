import { defineStore } from "pinia";
import { rolesKVTree } from "@/api/role";
import { validNull } from "@/utils/validate";

export const roleStore = defineStore("role", {
  state: () => ({
    rolesKVTree: [] as any[],
  }),
  getters: {},
  actions: {
    async getRolesKVTree() {
      if (validNull(this.rolesKVTree)) {
        await rolesKVTree().then((res) => {
          this.rolesKVTree = res.data;
        });
        return this.rolesKVTree;
      } else {
        return this.rolesKVTree;
      }
    },
  },
});
