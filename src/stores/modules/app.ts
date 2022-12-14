import {defineStore} from "pinia";
import {getItem, setItem} from "@/utils/storage";

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
