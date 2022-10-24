import { defineStore } from "pinia";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { validNull } from "@/utils/validate";
import {accountStore} from "@/stores/modules/account";
import {tagStore} from "@/stores/modules/tags";
import {routeStore} from "@/stores/modules/route";

const COLLAPSE = "VEA-COLLAPSE";

export const appStore = defineStore("app", {
  state: () => ({
    name: "lumen",
    sidebar: {
      collapse: getItem(COLLAPSE),
    },
    device: "",
  }),
  getters: {},
  actions: {
    setCollapse(collapse: any) {
      this.sidebar.collapse = collapse;
      setItem(COLLAPSE, collapse);
    },
    setDevice(device: string) {
      this.device = device;
    },
  },
});
