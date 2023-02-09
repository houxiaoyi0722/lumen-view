import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 引入svg图标注册脚本
import "vite-plugin-svg-icons/register";
// icon-svg组件
import SvgIcon from "@/components/SvgIcon/index.vue";

// 权限控制
import "./permission";

import "@/styles/index.scss"; // global css

import {
  // 全局对象
  // VXETable,

  // 表格功能
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,

  // 可选组件
  Icon,
  Column,
  // Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  Form,
  FormItem,
  FormGather,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  Switch,
  Input,
  Select,
  // Optgroup,
  // Option,
  Textarea,
  Button,
  Modal,
  // List,
  // Pulldown,
  // 表格
  Table,
} from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
import dayjs from "@/utils/dayjs/index";
import { accountStore } from "@/stores/modules/account";
import { appStore } from "@/stores/modules/app";

// 给 vue 实例挂载内部对象，例如：
// app.config.globalProperties.$XModal = VXETable.modal
// app.config.globalProperties.$XPrint = VXETable.print
// app.config.globalProperties.$XSaveFile = VXETable.saveFile
// app.config.globalProperties.$XReadFile = VXETable.readFile
const app = createApp(App);
// store
app.use(createPinia());
app.use(dayjs);
app.use(router);
app.use(ElementPlus);

// 表格功能
app.use(Filter).use(Edit).use(Menu).use(Export).use(Keyboard).use(Validator);

// 可选组件
app
  .use(Icon)
  .use(Column)
  // .use(Colgroup)
  .use(Grid)
  .use(Tooltip)
  .use(Toolbar)
  .use(Pager)
  .use(Form)
  .use(FormItem)
  .use(FormGather)
  // .use(Checkbox)
  // .use(CheckboxGroup)
  // .use(Radio)
  // .use(RadioGroup)
  // .use(RadioButton)
  .use(Switch)
  .use(Input)
  .use(Select)
  // .use(Optgroup)
  // .use(Option)
  .use(Textarea)
  .use(Button)
  .use(Modal)
  // .use(List)
  // .use(Pulldown)

  // 安装表格
  .use(Table);

app.mount("#app");

// 使 v-focus 在所有组件中都可用 在Pina创建后再调用
app.directive("permission", (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  const account_store = accountStore();
  if (!account_store.getPermissions.find((item) => item === binding.value)) {
    el.parentNode && el.parentNode.removeChild(el);
  }
});

app.component("svgIcon", SvgIcon);
const elIcons: string[] = [];
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
  elIcons.push(key);
}
appStore().setElIcons(elIcons);
