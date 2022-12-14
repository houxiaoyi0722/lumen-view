import request from "@/utils/request";

export const getUserGroup = () => {
  return request({
    url: "/lumen/user/group/userGroupTree",
    method: "get",
  });
};

// 获取角色列表树
export const userGroupUpdate = (userGroups: any) => {
  return request({
    url: "/lumen/user/group/userGroupListUpdate",
    method: "post",
    data: userGroups,
  });
};

// 用户组KVTree
export const userGroupKVTree = () => {
  return request({
    url: "/lumen/user/group/userGroupKVTree",
    method: "get",
  });
};
