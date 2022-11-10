import { validNull } from "@/utils/validate";

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
