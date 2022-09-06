import {defineStore} from "pinia";

export const menuStore = defineStore({
    id: "menu",
    state: () => ({
        menus: [],
    }),
    getters: {
    },
    actions: {
        async generateMenus(userinfo : any) {
            // // 方式一：只有固定菜单
            // const menus = getFilterMenus(fixedRoutes)
            // commit('SET_MENUS', menus)

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
    },
});