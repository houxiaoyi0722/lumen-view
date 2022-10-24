<template>
  <div class="home" ref="aaaa">home</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const aaaa = ref();

onMounted(() => {
  console.log(aaaa.value);
});

defineExpose(aaaa);
</script>

<style lang="scss" scoped>
.home {
  color: $mainColor;
}
</style>
