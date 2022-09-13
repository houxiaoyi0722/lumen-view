<template>
  <i
    class="fold-btn el-icon-s-fold"
    :class="{ collapse: collapse }"
    @click="handleToggleMenu"
  ></i>
</template>
<script>
import { defineComponent, computed } from "vue";
import { appStore } from "../../../stores/modules/app";

export default defineComponent({
  setup() {
    const app_store = appStore();

    const collapse = computed(() => !!app_store.sidebar.collapse);
    const handleToggleMenu = () => {
      app_store.setCollapse(+!collapse.value);
    };
    return {
      collapse,
      handleToggleMenu,
    };
  },
});
</script>
<style lang="scss" scoped>
.fold-btn {
  line-height: 48px;
  padding: 0 10px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
  &.collapse {
    transform: scale(-1, 1);
  }
}
</style>
