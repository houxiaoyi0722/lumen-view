import request from "@/utils/request";
import { validNull } from "@/utils/validate";
import type { ProcessDefinition } from "@/types/FlowableType";

export const processDefinitionPage = (data: any) => {
  return request({
    url: `/lumen/flowable/process/page?name=${data.name}${validNull(data.active) ? "" : "&active=" + data.active}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,
    method: "get",
  });
};

export const processXmlResource = (
  deploymentId: string,
  resourceName: string
) => {
  return request({
    url: `/lumen/flowable/processXmlResource?deploymentId=${deploymentId}&resourceName=${encodeURIComponent(resourceName)}`,
    method: "get",
  });
};

export const suspendedOrActiveProcess = (data: ProcessDefinition) => {
  return request({
    url: `/lumen/flowable/suspensionState`,
    method: "put",
    data: {
      processDefinitionId: data.id,
      suspensionState: data.suspensionState,
    },
  });
};

export const deleteProcess = (data: ProcessDefinition) => {
  return request({
    url: `/lumen/flowable/deleteProcess?deploymentId=${data.deploymentId}`,
    method: "delete",
  });
};

export const deployProcess = (formData: any) => {
  return request({
    url: `/lumen/flowable/deployProcess`,
    method: "PUT",
    data: formData,
  });
};

export const userList = (name: any) => {
  return request({
    url: `/lumen/flowable/user/list?name=${name}`,
    method: "get",
  });
};

export const groupList = (name: any) => {
  return request({
    url: `/lumen/flowable/group/list?name=${name}`,
    method: "get",
  });
};
