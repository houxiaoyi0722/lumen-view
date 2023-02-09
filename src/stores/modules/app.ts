import { defineStore } from "pinia";
import { getItem, setItem } from "@/utils/storage";
import { validNull } from "@/utils/validate";
import {icons, svgIcons} from "@/components/adapter/icons";

const COLLAPSE = "VEA-COLLAPSE";
const EL_ICONS = "EL_ICONS";

export const appStore = defineStore("app", {
  state: () => ({
    name: "lumen",
    sidebar: {
      collapse: getItem(COLLAPSE),
    },
    device: "",
    elIcons: [] as string[],
    vxeIcons: icons as string[],
    svgIcons: svgIcons as string[],
  }),
  getters: {
    obtainElIcons: (state) => {
      if (validNull(state.elIcons)) {
        state.elIcons = getItem(EL_ICONS);
      }
      return state.elIcons;
    },
    obtainVxeIcons: (state) => {
      return state.vxeIcons;
    },
    obtainSvgIcons: (state) => {
      return state.svgIcons;
    },
  },
  actions: {
    setCollapse(collapse: any) {
      this.sidebar.collapse = collapse;
      setItem(COLLAPSE, collapse);
    },
    setDevice(device: string) {
      this.device = device;
    },
    setElIcons(elIcons: string[]) {
      this.elIcons = elIcons;
      setItem(EL_ICONS, elIcons);
    },
  },
});
