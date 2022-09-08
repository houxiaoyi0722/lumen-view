import { ElLoading } from "element-plus";
import router from "@/router";
import { app_store, account_store, route_store } from "@/stores";

const getPageTitle = (title: any) => {
  const appTitle = app_store.name;
  if (title) {
    return `${title} - ${appTitle}`;
  }
  return appTitle;
};

// 白名单，里面是路由对象的name
const WhiteList = ["login"];

// vue-router4的路由守卫不再是通过next放行，而是通过return返回true或false或者一个路由地址
router.beforeEach(async (to) => {
  document.title = getPageTitle(!!to.meta && to.meta.title);

  if (WhiteList.includes(<string>to.name)) {
    return true;
  }
  if (!window.localStorage["TOKEN"]) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
      },
      replace: true,
    };
  } else {
    // 获取用户角色信息，根据角色判断权限
    const userinfo = account_store.userinfo;
    if (!userinfo) {
      const loadingInstance = ElLoading.service({
        lock: true,
        text: "正在加载数据，请稍候~",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        // 获取用户信息
        await account_store.loadUserinfo();
        loadingInstance.close();
      } catch (err) {
        loadingInstance.close();
        return false;
      }

      // 删除所有动态路由
      route_store.routes.forEach((item) => {
        router.removeRoute(item.name);
      });
      return to.fullPath;
    }

    // 生成菜单（如果你的项目有动态菜单，在此处会添加动态路由）
    if (route_store.routes.length <= 0) {
      const loadingInstance = ElLoading.service({
        lock: true,
        text: "正在加载数据，请稍候~",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        await route_store.generateMenus(userinfo);
        loadingInstance.close();
        return to.fullPath; // 添加动态路由后，必须加这一句触发重定向，否则会404
      } catch (err) {
        loadingInstance.close();
        return false;
      }
    }
  }
});
