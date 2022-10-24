import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 引入svg图标注册脚本
import "vite-plugin-svg-icons/register";

// 权限控制
import "./permission";

import "@/styles/index.scss"; // global css

import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
import dayjs from "@/utils/dayjs/index";

// 给 vue 实例挂载内部对象，例如：
// app.config.globalProperties.$XModal = VXETable.modal
// app.config.globalProperties.$XPrint = VXETable.print
// app.config.globalProperties.$XSaveFile = VXETable.saveFile
// app.config.globalProperties.$XReadFile = VXETable.readFile
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// store
app.use(createPinia());
app.use(dayjs);
app.use(router);
app.use(ElementPlus);
app.use(VXETable);

app.mount("#app");
