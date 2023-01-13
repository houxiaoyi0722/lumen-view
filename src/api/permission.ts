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
