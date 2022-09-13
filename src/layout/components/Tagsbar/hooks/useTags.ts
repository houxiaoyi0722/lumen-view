import { useScrollbar } from "./useScrollbar";
import { watch, computed, ref, nextTick, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { tagStore } from "@/stores/modules/tags";

const tag_store = tagStore();

export const isAffix = (tag: any) => {
  return !!tag.meta && tag.meta.affix;
};

export const useTags = () => {
  const router = useRouter();
  const route = router.currentRoute;
  const routes = computed(() => router.getRoutes());
  const tagList = computed(() => tag_store.tagList);

  const tagsItem = ref([]);

  const setItemRef = (i: any, el: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tagsItem.value[i] = el;
  };

  const scrollbar = useScrollbar(tagsItem);

  watch(
    () => tagList.value.length,
    () => {
      tagsItem.value = [];
    }
  );

  const filterAffixTags = (routes: any) => {
    return routes.filter((route: any) => isAffix(route));
  };

  const initTags = () => {
    const affixTags = filterAffixTags(routes.value);

    for (const tag of affixTags) {
      if (tag.name) {
        tag_store.addTag(tag);
      }
    }

    // 不在路由中的所有标签，需要删除
    const noUseTags = tagList.value.filter((tag) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      routes.value.every((route) => route.name !== tag.name)
    );
    noUseTags.forEach((tag) => {
      tag_store.delTag(tag);
    });
  };

  const addTag = () => {
    const tag = route.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!!tag.name && tag.matched[0].components.default.name === "layout") {
      tag_store.addTag(tag);
    }
  };

  const saveActivePosition = (tag: any) => {
    const index = tagList.value.findIndex(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (item) => item.fullPath === tag.fullPath
    );

    tag_store.saveActivePosition(Math.max(0, index));
  };

  const moveToCurrentTag = () => {
    nextTick(() => {
      for (const tag of tagsItem.value) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!!tag && tag.to.path === route.value.path) {
          scrollbar.moveToTarget(tag);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (tag.to.fullPath !== route.value.fullPath) {
            tag_store.updateTagList(route.value);
          }
          break;
        }
      }
    });
  };

  onBeforeMount(() => {
    initTags();
    addTag();
    moveToCurrentTag();
  });

  watch(route, (newRoute, oldRoute) => {
    saveActivePosition(oldRoute); // 保存标签的位置
    addTag();
    moveToCurrentTag();
  });

  return {
    tagList,
    setItemRef,
    isAffix,
    ...scrollbar,
  };
};
