import {defineStore} from "pinia";

export const app = defineStore({
    id: "app",
    state: () => ({
        name: 'lumen',
    }),
    getters: {
        getName: (state) => state.name,
    },
    actions: {
        SET_NAME(name) {
            this.name = name;
        },
    },
});