import { createRouter, createWebHistory } from "vue-router";
const Layout = () => import("@/layout/index.vue");
const Redirect = () => import("@/views/redirect/index.vue");
const Home = () => import("@/views/home/index.vue");

export const constantRoutes = [
  {
    path: "/",
    redirect: "/home",
    hidden: true,
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/home",
    component: Layout,
    name: "Dashboard",
    meta: {
      title: "工作台",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: {
          title: "首页",
          affix: true,
          icon: "HomeFilled",
        },
      },
      {
        path: "/flowable/holiday",
        component: () => import("@/views/process/holiday-process.vue"),
        hidden: true,
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401.vue"),
    hidden: true,
  },
  {
    path: "/redirect/:path(.*)",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "",
        component: Redirect,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // @ts-ignore
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  },
});

export default router;
