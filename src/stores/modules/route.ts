import { defineStore } from "pinia";
import { validNull } from "@/utils/validate";
import { getRouters } from "@/api/routers";
import router, { constantRoutes } from "@/router";

const Layout = () => import("@/layout/index.vue");
const modules = import.meta.glob("@/views/**/**.vue");

export const routeStore = defineStore({
  id: "route",
  state: () => ({
    routes: constantRoutes,
  }),
  getters: {
    menus: (state) => state.routes.filter((item:any) => !item.hidden),
  },
  actions: {
    generateRoutes() {
      return new Promise((resolve, reject) => {
        getRouters()
          .then((response) => {
            const { data } = response;
            const formatRoute = formatRoutes(data);
            formatRoute.push({
              path: "/:pathMatch(.*)*",
              redirect: "/404",
              hidden: true,
              meta: {
                title: "",
                icon: "",
              },
            });
            filterAsyncRouter(formatRoute);
            this.routes = this.routes.concat(formatRoute);
            resolve(formatRoute);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    removeRoute() {
      this.routes = constantRoutes;
    },
  },
});

export function formatRoutes(aMenu: any) {
  const aRouter: Array<any> = [];
  aMenu.forEach((oMenu: any) => {
    const { path, component, name, mate, hidden, children } = oMenu;
    if (!validNull(component)) {
      const oRouter = {
        path: path,
        component: component,
        hidden: hidden,
        meta: mate,
        name: name,
        children: validNull(children) ? undefined : formatRoutes(children),
      };
      aRouter.push(oRouter);
    }
  });
  return aRouter;
}

function filterAsyncRouter(asyncRouterMap: any) {
  // 遍历后台传来的路由字符串，转换为组件对象
  return asyncRouterMap.filter((route: any) => {
    if (route.component) {
      if (route.component === "Layout") {
        // Layout组件特殊处理
        route.component = Layout;
      } else {
        route.component = modules[`/src/views/${route.component}.vue`];
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}
