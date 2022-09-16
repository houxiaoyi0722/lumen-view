import request from "@/utils/request";

// 获取菜单
export const getRouters = () => {
  return request({
    url: "/lumen/router/routerTree",
    method: "get",
  });
};
