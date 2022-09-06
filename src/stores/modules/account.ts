import {defineStore} from "pinia";

export const accountStore = defineStore({
    id: "account",
    state: () => ({
        userinfo: {},
    }),
    getters: {
    },
    actions: {
        // 获取用户信息
        async loadUserinfo() {
/*            const { code, data } = await GetUserinfo()
            if (+code === 200) {
                this.userinfo = data
                return Promise.resolve(data)
            }*/
        },
    },
});