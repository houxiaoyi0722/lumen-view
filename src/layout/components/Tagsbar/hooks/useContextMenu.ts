import { onMounted, onBeforeUnmount, reactive, toRefs, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { tagStore } from "@/stores/modules/tags";
import { isAffix } from "@/layout/components/Tagsbar/hooks/useTags";

const tag_store = tagStore();

export const useContextMenu = (tagList: any) => {
  const router = useRouter();
  const route = useRoute();

  const state = reactive({
    visible: false,
    top: 0,
    left: 0,
    selectedTag: {
      fullPath: {},
    },
    openMenu(tag: any, e: any) {
      state.visible = true;
      state.left = e.clientX;
      state.top = e.clientY;
      state.selectedTag = tag;
    },
    closeMenu() {
      state.visible = false;
    },
    refreshSelectedTag(tag: any) {
      tag_store.DEL_CACHE_LIST(tag);
      const { fullPath } = tag;
      nextTick(() => {
        router.replace({
          path: "/redirect" + fullPath,
        });
      });
    },
    closeTag(tag: any) {
      if (isAffix(tag)) return;

      const closedTagIndex = tagList.value.findIndex(
        (item: any) => item.fullPath === tag.fullPath
      );
      tag_store.delTag(tag);
      if (isActive(tag)) {
        toLastTag(closedTagIndex - 1);
      }
    },
    closeOtherTags() {
      tag_store.delOtherTags(state.selectedTag);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      router.push(state.selectedTag);
    },
    closeLeftTags() {
      state.closeSomeTags("left");
    },
    closeRightTags() {
      state.closeSomeTags("right");
    },
    closeSomeTags(direction: any) {
      const index = tagList.value.findIndex(
        (item: any) => item.fullPath === state.selectedTag.fullPath
      );

      if (
        (direction === "left" && index <= 0) ||
        (direction === "right" && index >= tagList.value.length - 1)
      ) {
        return;
      }

      const needToClose =
        direction === "left"
          ? tagList.value.slice(0, index)
          : tagList.value.slice(index + 1);
      tag_store.delSomeTags(needToClose);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      router.push(state.selectedTag);
    },
    closeAllTags() {
      tag_store.delAllTags();
      router.push("/");
    },
  });

  const isActive = (tag: any) => {
    return tag.fullPath === route.fullPath;
  };

  const toLastTag = (lastTagIndex: any) => {
    const lastTag = tagList.value[lastTagIndex];
    if (lastTag) {
      router.push(lastTag.fullPath);
    } else {
      router.push("/");
    }
  };

  onMounted(() => {
    document.addEventListener("click", state.closeMenu);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", state.closeMenu);
  });

  return toRefs(state);
};
