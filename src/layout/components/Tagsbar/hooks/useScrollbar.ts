import { ref } from "vue";

export const useScrollbar = (tagsItem: any) => {
  const scrollContainer = ref(null);

  const handleScroll = (e: any) => {
    const eventDelta = e.wheelDelta || -e.deltaY;
    // @ts-ignore
    scrollContainer.value.wrap$.scrollLeft -= eventDelta / 4;
  };

  const moveToTarget = (currentTag: any) => {
    // @ts-ignore
    const containerWidth = scrollContainer.value.wrap$.offsetWidth;
    // @ts-ignore
    const scrollWrapper = scrollContainer.value.wrap$;
    const tagList = tagsItem.value;

    let firstTag = null;
    let lastTag = null;

    if (tagList.length > 0) {
      firstTag = tagList[0];
      lastTag = tagList[tagList.length - 1];
    }
    if (firstTag === currentTag) {
      scrollWrapper.scrollLeft = 0;
    } else if (lastTag === currentTag) {
      scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth;
    } else {
      const el = currentTag.$el.nextElementSibling;
      scrollWrapper.scrollLeft =
        el.offsetLeft + el.offsetWidth > containerWidth
          ? el.offsetLeft - el.offsetWidth
          : 0;
    }
  };

  return {
    scrollContainer,
    handleScroll,
    moveToTarget,
  };
};
