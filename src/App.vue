<template>
  <el-config-provider>
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'

export default defineComponent({
  components: {
    ElConfigProvider,
  }
})
</script>

