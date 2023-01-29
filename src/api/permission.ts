import request from "@/utils/request";

// 获取角色键值对树
export const permissionsListByRoute = (route: any) => {
  return request({
    url: "/lumen/permissions/permission/route",
    method: "post",
    data: {
      router: route,
    },
  });
};

// 获取角色键值对树
export const saveRolePermList = (role: any) => {
  return request({
    url: "/lumen/role/permissions",
    method: "put",
    data: role,
  });
};
