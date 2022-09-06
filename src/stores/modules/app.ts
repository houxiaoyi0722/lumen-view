import {defineStore} from "pinia";

export const appStore = defineStore("app",{
    state: () => ({
        name: 'lumen',
        counter: 0,
    }),
    getters: {
        incrName: (state) => state.name,
    },
    actions: {
        handle(name: string) {
            this.name = name;
        },
    },
});