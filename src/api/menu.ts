import request from "@/utils/request";

// 获取菜单
export const GetMenus = (params: any) => {
  return request({
    url: "/api/menus",
    method: "get",
    params,
  });
};
