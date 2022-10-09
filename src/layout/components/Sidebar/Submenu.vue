<template>
  <div>
    <el-menu-item v-if="!menu.children" :index="basePath">
      <item :icon="menu.meta.icon" :title="menu.meta.title" />
    </el-menu-item>
    <el-sub-menu v-else :index="resolvePath(menu.path)">
      <template #title>
        <item :icon="menu.meta.icon" :title="menu.meta.title" />
      </template>
      <submenu
        v-for="submenu in menu.children"
        :key="submenu.path"
        :is-nest="true"
        :menu="submenu"
        :base-path="resolvePath(submenu.path)"
      />
    </el-sub-menu>
  </div>
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
    isNest: {
      type: Boolean,
      default: false,
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
