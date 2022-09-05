import { useCounterStore } from 'src/stores/modules/counter'

export default {
    setup() {
        const store = useCounterStore()
        store.increment()
        return {
            // 您可以返回整个 store 实例以在模板中使用它
            store,
        }
    },
}