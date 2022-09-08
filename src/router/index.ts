import { createRouter, createWebHistory } from "vue-router";
const Layout = () => import("@/layout/index.vue");
const Redirect = () => import("@/views/redirect/index.vue");
const Home = () => import("@/views/home/index.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/redirect/:path(.*)",
      component: Layout,
      children: [
        {
          path: "",
          component: Redirect,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/home",
      component: Layout,
      name: "Dashboard",
      meta: {
        title: "工作台",
        icon: "home",
      },
      children: [
        {
          path: "",
          name: "home",
          component: Home,
          meta: {
            title: "首页",
            affix: true,
          },
        },
      ],
    },
  ],
});

export default router;
