<template>
  <el-menu-item v-if="!menu.children" :index="basePath">
    <item v-if="menu && menu.meta && menu.meta.icon" :icon="menu.meta.icon" :title="menu.meta.title" />
  </el-menu-item>
  <el-sub-menu v-else :index="resolvePath(menu.path)">
    <template #title>
      <item v-if="menu && menu.meta && menu.meta.icon" :icon="menu.meta.icon" :title="menu.meta.title" />
    </template>
    <submenu
      v-for="submenu in menu.children"
      :key="submenu.path"
      :menu="submenu"
      :base-path="resolvePath(submenu.path)"
    />
  </el-sub-menu>
</template>
<script>
import { defineComponent } from "vue";
import Item from "./Item.vue";
import path from "path-browserify";
import { isExternal } from "@/utils/validate";
export default defineComponent({
  name: "Submenu",
  components: {
    Item,
  },
  props: {
    menu: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
});
</script>
