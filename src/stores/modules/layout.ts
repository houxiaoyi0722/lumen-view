import { defineStore } from "pinia";
import defaultSettings from "@/default-settings";
import { getItem, setItem } from "@/utils/storage";

export const layout = defineStore({
  id: "layout",
  state: () => ({
    setting: getItem("setting") || defaultSettings,
  }),
  getters: {},
  actions: {
    setSetting(setting: any) {
      this.setting = setting;
      setItem("defaultSettings", setting);
    },
  },
});
