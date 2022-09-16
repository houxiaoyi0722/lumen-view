import request from "@/utils/request";

// 登录接口
export const Login = (data: any) => {
  return request({
    url: "/login",
    method: "post",
    data,
  });
};

// 获取登录用户信息
export const getUserinfo = () => {
  return request({
    url: "/lumen/user/userinfo",
    method: "get",
  });
};
