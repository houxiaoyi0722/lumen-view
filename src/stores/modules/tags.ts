import { defineStore } from "pinia";
import { getItem, removeItem, setItem } from "@/utils/storage";

const TAGLIST = "TAGLIST";

export const tagStore = defineStore({
  id: "tags",
  state: () => ({
    cacheList: [],
    tagList: getItem(TAGLIST) || [],
    activePosition: -1,
  }),
  getters: {},
  actions: {
    addCacheList(tag: any) {
      // @ts-ignore
      if (this.cacheList.includes(tag.name)) return;
      if (!tag.meta.noCache) {
        // @ts-ignore
        this.cacheList.push(tag.name);
      }
    },
    delCacheList(tag: any) {
      // @ts-ignore
      this.cacheList = this.cacheList.filter((v) => v !== tag.name);
    },
    addTagList({ path, fullPath, name, meta, params, query }: any) {
      if (this.tagList.some((v: any) => v.path === path)) return false;

      const target = Object.assign(
        {},
        { path, fullPath, name, meta, params, query },
        {
          title: meta.title || "未命名",
          fullPath: fullPath || path,
        }
      );
      if (this.activePosition === -1) {
        if (name === "home") {
          this.tagList.unshift(target);
        } else {
          this.tagList.push(target);
        }
      } else {
        this.tagList.splice(this.activePosition + 1, 0, target);
      }

      // 保存到localStorage
      setItem(TAGLIST, this.tagList);
    },
    delTagList(tag: any) {
      this.tagList = this.tagList.filter((v: any) => v.path !== tag.path);
      // 保存到localStorage
      setItem(TAGLIST, this.tagList);
    },
    delOtherTagList(tag: any) {
      this.tagList = this.tagList.filter(
        (v: any) => !!v.meta.affix || v.path === tag.path
      );
      // 保存到localStorage
      setItem(TAGLIST, this.tagList);
    },
    delOtherCacheList(tag: any) {
      // @ts-ignore
      this.cacheList = this.cacheList.filter((v) => v === tag.name);
    },
    delSomeTagList(tags: any) {
      this.tagList = this.tagList.filter(
        (v: any) =>
          v.meta.affix || tags.every((tag: any) => tag.path !== v.path)
      );
      // 保存到localStorage
      setItem(TAGLIST, this.tagList);
    },
    delSomeCacheList(tags: any) {
      // @ts-ignore
      this.cacheList = this.cacheList.filter((v) =>
        tags.every((tag: any) => tag.name !== v)
      );
    },
    delAllTagList() {
      this.tagList = this.tagList.filter((v: any) => v.meta.affix);
      // 保存到localStorage
      removeItem(TAGLIST);
    },
    delAllCacheList() {
      // @ts-ignore
      this.cacheList = [];
    },
    clearAllTags() {
      // @ts-ignore
      this.cacheList = [];
      this.tagList = [];
      // 保存到localStorage
      removeItem(TAGLIST);
    },
    updateTagList(tag: any) {
      const index = this.tagList.findIndex((v: any) => v.path === tag.path);
      if (index > -1) {
        this.tagList[index] = Object.assign({}, this.tagList[index], tag);
        // 保存到localStorage
        setItem(TAGLIST, this.tagList);
      }
    },
    saveActivePosition(index: any) {
      this.activePosition = index;
    },

    addTag(tag: any) {
      this.addTagList(tag);
      this.addCacheList(tag);
    },
    delTag(tag: any) {
      this.delTagList(tag);
      this.delCacheList(tag);
    },
    delOtherTags(tag: any) {
      this.delOtherTagList(tag);
      this.delOtherCacheList(tag);
    },
    delSomeTags(tags: any) {
      this.delSomeTagList(tags);
      this.delSomeCacheList(tags);
    },
    delAllTags() {
      this.delAllTagList();
      this.delAllCacheList();
    },
  },
});
