import request from "@/utils/request";

// 获取角色下权限列表
export const permissionsListByRole = (role: any) => {
  return request({
    url: "/lumen/permissions/permission/role",
    method: "post",
    data: {
      role: role,
    },
  });
};

// 获取路由下权限列表
export const permissionsListByRouter = (router: any) => {
  return request({
    url: "/lumen/permissions/permission/router",
    method: "post",
    data: {
      router: router,
    },
  });
};


// 保存角色权限
export const saveRolePermList = (role: any) => {
  return request({
    url: "/lumen/role/permissions",
    method: "put",
    data: role,
  });
};

// 保存路由权限
export const saveRouterPerList = (router: any) => {
  return request({
    url: "/lumen/permissions/table/permission",
    method: "post",
    data: router,
  });
}
