import { ref } from "vue";

export const sexList = ref([
  { value: "1", label: "男" },
  { value: "0", label: "女" },
]);

export const enableList = ref([
  { value: true, label: "启用" },
  { value: false, label: "禁用" },
]);
