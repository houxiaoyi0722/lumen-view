<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cacheList">
      <component :is="Component" :key="key" />
    </keep-alive>
  </router-view>
</template>
<script>
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { tagStore } from "../../../stores/modules/tags";

export default defineComponent({
  name: "contents",
  setup() {
    const tag_store = tagStore();
    const route = useRoute();
    const cacheList = computed(() => tag_store.cacheList());
    const key = computed(() => route.fullPath);

    return {
      cacheList,
      key,
    };
  },
});
</script>
