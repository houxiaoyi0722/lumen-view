import { appStore } from "@/stores/modules/app";
import { accountStore } from "@/stores/modules/account";
import { routeStore } from "@/stores/modules/route";
import { tagStore } from "@/stores/modules/tags";

export const account_store = accountStore();
export const route_store = routeStore();
export const tag_store = tagStore();
export const app_store = appStore();
