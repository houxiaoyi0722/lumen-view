import {defineStore} from "pinia";

export const tagStore = defineStore({
    id: "tags",
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