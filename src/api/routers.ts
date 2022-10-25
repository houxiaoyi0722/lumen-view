import request from "@/utils/request";

// 获取菜单
export const getRouters = () => {
  return request({
    url: "/lumen/router/routerTree",
    method: "get",
  });
};

// 获取所有菜单
export const getAllRouters = () => {
  return request({
    url: "/lumen/router/routers",
    method: "get",
  });
};
