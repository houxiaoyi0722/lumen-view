import request from "@/utils/request";

export const userPage = (data: any) => {
  return request({
    url: "/lumen/user/users",
    method: "post",
    data: data,
  });
};