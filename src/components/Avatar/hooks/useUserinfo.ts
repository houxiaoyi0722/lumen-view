import { computed } from "vue";
import { accountStore } from "@/stores/modules/account";

export const useUserinfo = () => {
  const account_store = accountStore();
  const userinfo = computed(() => account_store.userinfo);

  return { userinfo };
};
