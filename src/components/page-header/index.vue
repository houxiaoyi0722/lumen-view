<template>
  <el-page-header
    @back="goBack"
    title="返回"
    class="page-header breadcrumb-hidden"
  >
    <template #content>
      <span class="text-large font-600 mr-3">{{ name }}</span>
    </template>
  </el-page-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageHeader",
  props: {
    name: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter();
    const goBack = () => {
      router.back();
    };
    return { goBack };
  },
});
</script>

<style scoped>
.page-header {
  padding: 1.5rem;
  background-color: #fff;
}
.breadcrumb-hidden >>> .el-page-header__breadcrumb {
  margin-bottom: 0px;
}
</style>
