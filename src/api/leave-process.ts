import request from "@/utils/request";

export const saveDraft = (data: any) => {
  return request({
    url: `/lumen/leaveProcess/leaveProcess`,
    method: "post",
    data,
  });
};

export const startProcess = (data: any) => {
  return request({
    url: `/lumen/leaveProcess/startProcess`,
    method: "post",
    data,
  });
};


export const completeTask = (data: any) => {
  return request({
    url: `/lumen/leaveProcess/completeTask`,
    method: "post",
    data,
  });
};
