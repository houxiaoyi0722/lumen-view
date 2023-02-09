<template>
  <icon-adapter :name="icon"></icon-adapter>
  <span>{{ title }}</span>
</template>

<script>
import { defineComponent } from "vue";
import IconAdapter from "@/components/IconAdapter/index.vue";

export default defineComponent({
  components: { IconAdapter },
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
