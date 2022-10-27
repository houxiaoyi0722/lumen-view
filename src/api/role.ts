import request from "@/utils/request";

// 获取角色列表
export const getRolesTree = () => {
  return request({
    url: "/lumen/role/rolesTree",
    method: "get",
  });
};
