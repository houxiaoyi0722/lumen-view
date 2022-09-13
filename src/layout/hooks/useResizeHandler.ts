import { onBeforeMount, onBeforeUnmount /*watch*/ } from "vue";
// import { useRouter } from 'vue-router';
import { appStore } from "@/stores/modules/app";

const app_store = appStore();

const WIDTH = 768;
export const useResizeHandler = () => {
  // const router = useRouter();
  // const route = router.currentRoute;

  const isMobile = () => {
    return window.innerWidth < WIDTH;
  };

  const resizeHandler = () => {
    if (isMobile()) {
      app_store.setDevice("mobile");
      app_store.setCollapse(1);
    } else {
      app_store.setDevice("desktop");
      app_store.setCollapse(0);
    }
  };

  onBeforeMount(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });

  // // 监听路由的时候不能使用useRoute获取路由，否则会有警告
  // watch(route, () => {
  //   if (store.state.app.device === 'mobile' && !store.state.app.sidebar.collapse) {
  //     store.commit('app/setCollapse', 1)
  //   }
  // })
};
