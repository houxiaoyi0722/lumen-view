import request from "@/utils/request";

export const userPage = (data: any) => {
  return request({
    url: "/lumen/user/users",
    method: "post",
    data: data,
  });
};

export const update = (data: any) => {
  return request({
    url: "/lumen/user/user",
    method: "put",
    data: data,
  });
};

export const insert = (data: any) => {
  return request({
    url: "/lumen/user/user",
    method: "post",
    data: data,
  });
};

export const remove = (data: any) => {
  return request({
    url: "/lumen/user/user",
    method: "delete",
    data: data,
  });
};

export const resetUserPassword = (data: any) => {
  return request({
    url: "/lumen/user/password/reset",
    method: "put",
    data: data,
  });
};

export const getUserExData = (data: string) => {
  return request({
    url: `/lumen/user/exData/${data}`,
    method: "get",
  });
};

export const saveUserExt = (data: any) => {
  return request({
    url: `/lumen/user/exData`,
    method: "put",
    data
  });
};
