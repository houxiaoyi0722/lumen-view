import type { BaseInterface } from "@/types/BaseInterface";

export interface RouterRow extends BaseInterface {
  name: string;
  path: string;
  redirect: string;
  component: string;
  mate: string;
  description: string;
  children: RouterRow[];
  parentId: string;
  hidden: false;
  alwaysShow: false;
  orderBy: number;
}
