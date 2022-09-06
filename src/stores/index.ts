import { appStore } from '@/stores/modules/app'
import { accountStore } from '@/stores/modules/account'
import { menuStore } from '@/stores/modules/menu'
import { tagStore } from '@/stores/modules/tags'

export const account_store = accountStore()
export const menu_store = menuStore()
export const tag_store = tagStore()
export const app_store = appStore()