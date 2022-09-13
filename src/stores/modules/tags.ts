import { defineStore } from "pinia";

export const tagStore = defineStore({
  id: "tags",
  state: () => ({
    cacheList: [],
    tagList: [],
  }),
  getters: {},
  actions: {
    DEL_CACHE_LIST(tag: any) {
      console.log(111);
    },
    addTag(tag: any) {
      console.log(111);
    },
    delTag(tag: any) {
      console.log(111);
    },
    saveActivePosition(index: any) {
      console.log(111);
    },
    updateTagList(value: any) {
      console.log(111);
    },
    delAllTags() {
      console.log(111);
    },
    delSomeTags(tags: any) {
      console.log(111);
    },
    delOtherTags(tag: any) {
      console.log(111);
    },
    cacheList() {
      this.cacheList;
    },
  },
});
