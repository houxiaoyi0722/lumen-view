import * as dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import type { App } from "vue";

dayjs.locale("zh-cn");

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    readonly $dayjs: any;
  }
}

export default {
  install: (app: App<Element>): void => {
    app.config.globalProperties.$dayjs = dayjs;
  },
};
