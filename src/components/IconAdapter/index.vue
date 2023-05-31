<template>
  <div style="width: 30px;vertical-align: middle;">
    <!-- iconType为空或者为el时为true -->
    <el-icon v-if="isElIcon()">
      <component :is="name"></component>
    </el-icon>
    <!-- iconType为空或者为el时为true -->
    <vxe-icon style="margin-left: 5px;margin-right: 5px" v-else-if="isVxeIcon()" :name="name"></vxe-icon>
    <svg-icon v-else :name="name"></svg-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { appStore } from "@/stores/modules/app";

export default defineComponent({
  name: "IconAdapter",
  components: { SvgIcon },
  props: {
    name: {
      type: String,
    },
    // EL - VXE - SVG
    iconType: {
      type: String,
    },
  },
  setup(props) {
    const app_store = appStore();
    const isElIcon = () => {
      return (
        app_store.obtainElIcons.find((item: string) => item === props.name) &&
        (!props.iconType || props.iconType === "EL")
      );
    };
    const isVxeIcon = () => {
      return (
        app_store.obtainVxeIcons.find((item: string) => item === props.name) &&
        (!props.iconType || props.iconType === "VXE")
      );
    };
    return {
      isElIcon,
      isVxeIcon,
    };
  },
});
</script>

<style scoped></style>
