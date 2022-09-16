import { ElLoading } from "element-plus";
import router from "@/router";
import { accountStore } from "@/stores/modules/account";
import { appStore } from "@/stores/modules/app";
import { routeStore } from "@/stores/modules/route";

// 白名单，里面是路由对象的name
const WhiteList = ["login"];

// vue-router4的路由守卫不再是通过next放行，而是通过return返回true或false或者一个路由地址
router.beforeEach(async (to) => {
  const account_store = accountStore();
  const app_store = appStore();
  const route_store = routeStore();

  const appTitle = app_store.name;
  if (!!to.meta && to.meta.title) {
    document.title = `${to.meta.title} - ${appTitle}`;
  }
  if (!window.localStorage["TOKEN"]) {
    // 如果未登录,判断是否在白名单中,不在跳到登录页
    if (WhiteList.includes(<string>to.name)) {
      return true;
    } else {
      return {
        name: "login",
        query: {
          redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
        },
        replace: true,
      };
    }
  } else {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      return {
        name: "Dashboard",
      };
    } else {
      // 获取用户角色信息，根据角色判断权限
      const hasUserinfo = account_store.userinfo;
      if (!hasUserinfo) {
        const loadingInstance = ElLoading.service({
          lock: true,
          text: "正在加载数据，请稍候~",
          background: "rgba(0, 0, 0, 0.7)",
        });

        try {
          // 获取用户信息
          await account_store.loadUserinfo();
          // 生成菜单（如果你的项目有动态菜单，在此处会添加动态路由）
          await route_store.generateRoutes();

          loadingInstance.close();
        } catch (err) {
          loadingInstance.close();
          return false;
        }
        return to.fullPath; // 添加动态路由后，必须加这一句触发重定向，否则会404
      } else {
        return true;
      }
    }
  }
});
