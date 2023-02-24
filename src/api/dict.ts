import request from "@/utils/request";

export const dictPage = (data: any) => {
  return request({
    url: "/lumen/dict/dictionaries",
    method: "post",
    data: data,
  });
};

export const findOne = (id: string) => {
  return request({
    url: `/lumen/dict/items?id=${id}`,
    method: "get",
  });
};
/**
 * 更新item列表
 * @param param
 */
export const dictItemUpdate = (param: any) => {
  return request({
    url: "/lumen/dict/dict/item",
    method: "put",
    data: param,
  });
};
/**
 * 更新dict列表
 * @param param
 */
export const dictUpdate = (param: any) => {
  return request({
    url: "/lumen/dict/dict/listUpdate",
    method: "put",
    data: param,
  });
};

/**
 * 删除dict
 * @param param
 */
export const delDictList = (param: any) => {
  return request({
    url: "/lumen/dict/dictionaries",
    method: "delete",
    data: param,
  });
}
