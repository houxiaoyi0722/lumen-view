import { ref } from "vue";
// todo 修改为后端提供
export const sexList = ref([
  { value: "MAN", label: "男" },
  { value: "WOMEN", label: "女" },
]);

export const enableList = ref([
  { value: true, label: "启用" },
  { value: false, label: "禁用" },
]);
