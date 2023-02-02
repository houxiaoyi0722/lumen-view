import request from "@/utils/request";
import type {User} from "@/types/ManageType";
import type {AxiosPromise} from "axios";

// 登录接口
export const Login = (data: any) => {
  return request({
    url: "/login",
    method: "post",
    data,
  });
};

// 获取登录用户信息
export const getUserinfo = (): AxiosPromise<User> => {
  return request({
    url: "/lumen/user/userinfo",
    method: "get",
  });
};
