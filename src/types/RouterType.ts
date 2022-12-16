import type { BaseType } from "@/types/BaseType";

export interface RouterType extends BaseType {
  name: string;
  path: string;
  redirect: string;
  component: string;
  mate: string;
  description: string;
  children: RouterType[];
  parentId: string;
  hidden: false;
  alwaysShow: false;
  orderBy: number;
}
