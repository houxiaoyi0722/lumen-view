import request from "@/utils/request";
import {validNull} from "@/utils/validate";

export const processDefinitionPage = (data: any) => {
  return request({
    url: `/lumen/flowable/process/page?name=${data.name}${validNull(data.active)? "":"&active=" + data.active}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,
    method: "get",
  });
};
