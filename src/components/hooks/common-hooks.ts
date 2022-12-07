import { validNull } from "@/utils/validate";
import VXETable from "vxe-table";

/**
 * 将values中的id装换为treelist中的labels列表
 * @param values
 * @param treeList
 */
export const transLabels = (values: [], treeList: Array<any>): Array<string> => {
  let labels: Array<string> = [];
  if (!validNull(values)) {
    for (const node of treeList) {
      if (!validNull(node.children)) {
        labels = labels.concat(transLabels(values, node.children));
      }
      if (values.some((item: string) => item === node.value)) {
        labels.push(node.label);
      }
    }
  }
  return labels;
};

/**
 * 将所给列表包装为对象
 */
export const transIdObjs = (values: any[], field: string): Array<any> => {
  const objs: Array<any> = [];
  if (!validNull(values)) {
    for (const value of values) {
      const obj: any = {};
      obj[field] = value;
      objs.push(obj);
    }
  }
  return objs;
};

/**
 * 将所给列表包装为对象
 */
export const transObj = (value: any, field: string): any => {
  const obj: any = {};
  if (!validNull(value)) {
    obj[field] = value;
  }
  return obj;
};

/**
 * 公共弹窗响应类
 * @param res
 */
export const commonAlert = (res: any,successMsg:string): boolean => {
  if (res.code != "200") {
    VXETable.modal.message({ status: "error", content: res.message });
    return false;
  } else {
    if (!validNull(successMsg)) {
      VXETable.modal.message({
        status: "success",
        content: successMsg,
      });
    }
    return true;
  }
}