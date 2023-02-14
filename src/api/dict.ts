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

