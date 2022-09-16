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
  getters: {},
  actions: {
    async generateRoutes() {
      new Promise((resolve, reject) => {
        getRouters()
          .then((response) => {
            const { data } = response;
            // const formatRoute = formatRoutes(data);
            const formatRoute = data;

            formatRoute.push({
              path: "/:pathMatch(.*)",
              redirect: "/404",
              hidden: true,
            });
            filterAsyncRouter(formatRoute);
            this.routes = this.routes.concat(formatRoute);
            formatRoute.forEach((route: any) => router.addRoute(route));
            resolve(formatRoute);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });

      // const menus = router;

      // 方式一：只有固定菜单
      // const menus = getFilterMenus(fixedRoutes);
      // commit("SET_MENUS", menus);
      // // 方式二：有动态菜单
      // // 从后台获取菜单
      // const { code, data } = await GetMenus({ role: userinfo.role })
      //
      // if (+code === 200) {
      //     // 过滤出需要添加的动态路由
      //     const filterRoutes = getFilterRoutes(asyncRoutes, data)
      //     filterRoutes.forEach(route => router.addRoute(route))
      //
      //     // 生成菜单
      //     const menus = getFilterMenus([...fixedRoutes, ...filterRoutes])
      //     this.menus =  menus
      // }
    },
    removeRoute() {
      this.routes = [];
    },
    routeList() {
      this.routes;
    },
  },
});

export function formatRoutes(aMenu: any) {
  const aRouter: Array<any> = [];

  aMenu.forEach((oMenu: any) => {
    const { path, component, name, mate, hidden, chileRouter } = oMenu;
    if (!validNull(component)) {
      const oRouter = {
        path: path,
        component: component,
        hidden: hidden,
        meta: mate,
        name: name,
        children: validNull(chileRouter) ? [] : formatRoutes(chileRouter),
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
        route.component = modules[`@/views/${route.component}.vue`];
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}
