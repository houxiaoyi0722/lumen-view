import {defineStore} from "pinia";

export const menu = defineStore({
    id: "menu",
    state: () => ({
        counter: 0,
    }),
    getters: {
        doubleCount: (state) => state.counter * 2,
    },
    actions: {
        increment() {
            this.counter++;
        },
    },
});