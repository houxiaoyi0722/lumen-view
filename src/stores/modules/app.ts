import { defineStore } from "pinia";
import { getItem, setItem } from "@/utils/storage";
import { validNull } from "@/utils/validate";
import { icons, svgIcons } from "@/components/IconAdapter/icons";

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
    obtainElIcons: (state): string[] => {
      if (validNull(state.elIcons)) {
        state.elIcons = getItem(EL_ICONS);
      }
      return state.elIcons;
    },
    kVElIcons: (state): any[] => {
      if (validNull(state.elIcons)) {
        state.elIcons = getItem(EL_ICONS);
      }
      return state.elIcons.map(item => {
        return { label: item, value: item };
      });
    },
    obtainVxeIcons: (state) => {
      return state.vxeIcons;
    },
    kVVxeIcons: (state): any[] => {
      return state.vxeIcons.map(item => {
        return { label: item, value: item };
      });
    },
    obtainSvgIcons: (state) => {
      return state.svgIcons;
    },
    kVSvgIcons: (state): any[] => {
      return state.svgIcons.map(item => {
        return { label: item, value: item };
      });
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
