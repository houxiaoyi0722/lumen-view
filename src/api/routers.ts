import request from "@/utils/request";

// 获取菜单
export const getRouters = () => {
  return request({
    url: "/lumen/router/routerTree",
    method: "get",
  });
};

// 获取所有树形菜单
export const allRouterTree = () => {
  return request({
    url: "/lumen/router/allRouterTree",
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

// 插入菜单数据
export const saveRouters = (routes: any) => {
  return request({
    url: "/lumen/router/routers",
    method: "post",
    data: routes,
  });
};

// 更新菜单数据
export const updateRouters = (routes: any) => {
  return request({
    url: "/lumen/router/routers",
    method: "put",
    data: routes,
  });
};

// 删除菜单数据
export const removeRouters = (routeIds: any) => {
  return request({
    url: "/lumen/router/routers",
    method: "delete",
    data: routeIds,
  });
};

// 更新菜单数据
export const routerUpdate = (tableData: any) => {
  return request({
    url: "/lumen/router/routerUpdate",
    method: "post",
    data: tableData,
  });
};
