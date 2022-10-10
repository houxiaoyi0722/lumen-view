import { createApp } from "vue";
import { createPinia } from "pinia";

//告诉前页面内的事件监听器内部是否会调用preventDefault函数来阻止事件的默认行为，以便浏览器根据这个信息更好地做出决策来优化页面性能
import "default-passive-events";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 权限控制
import "./permission";

import "@/styles/index.scss"; // global css

import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
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
app.use(router);
app.use(ElementPlus);
app.use(VXETable);

app.mount("#app");
