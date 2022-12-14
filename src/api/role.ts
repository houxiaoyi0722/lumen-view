import request from "@/utils/request";

// 获取角色键值对树
export const rolesKVTree = () => {
  return request({
    url: "/lumen/role/rolesKVTree",
    method: "get",
  });
};

// 获取角色列表树
export const getRolesTree = () => {
  return request({
    url: "/lumen/role/rolesTree",
    method: "get",
  });
};

// 获取角色列表树
export const roleListUpdate = (roles: any) => {
  return request({
    url: "/lumen/role/roleListUpdate",
    method: "post",
    data: roles,
  });
};
