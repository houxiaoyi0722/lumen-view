import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 权限控制
import "./permission";

import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
// 给 vue 实例挂载内部对象，例如：
// app.config.globalProperties.$XModal = VXETable.modal
// app.config.globalProperties.$XPrint = VXETable.print
// app.config.globalProperties.$XSaveFile = VXETable.saveFile
// app.config.globalProperties.$XReadFile = VXETable.readFile
const app = createApp(App);

// store
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(VXETable);

app.mount("#app");
