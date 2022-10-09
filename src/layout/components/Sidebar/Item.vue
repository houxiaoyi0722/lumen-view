<template>
  <el-icon><Grid /></el-icon>
  <span>{{ title }}</span>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: ["title", "icon"],
  setup(icon) {
    const isElementIcon = computed(() => icon && icon.startsWith("el-icon"));

    return {
      isElementIcon,
    };
  },
});
</script>
<style lang="scss" scoped>
.icon {
  margin-right: 10px;
  width: 16px !important;
  height: 16px !important;
  font-size: 16px;
  text-align: center;
  color: currentColor;
}
</style>
