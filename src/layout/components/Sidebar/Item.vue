<template>
  <el-icon>
    <component :is="icon"></component>
  </el-icon>
  <span>{{ title }}</span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: ["title", "icon"],
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
