<script>
import { h } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "redirect",
  setup() {
    const router = useRouter();
    const route = useRoute();
    router.replace(route.fullPath.replace(/^\/redirect/, ""));
  },
  render() {
    return h("div");
  },
};
</script>
