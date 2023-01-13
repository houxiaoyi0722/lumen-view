<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><Menu /></el-icon>
          <span>菜单按钮权限</span>
        </span>
      </template>
      <el-tree
        ref="elTree"
        :load="loadNode"
        lazy
        node-key="id"
        destroy-on-close
        show-checkbox
        :props="treeProps"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-icon v-if="!!node.data.mate && !!node.data.mate.icon">
              <component :is="node.data.mate.icon"></component>
            </el-icon>
            <span style="margin-left: 3px">
              <a> {{ !data.mate ? data.name : data.mate.title }} </a>
            </span>
          </span>
        </template>
      </el-tree>
    </el-tab-pane>
    <el-tab-pane label="">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><StarFilled /></el-icon>
          <span>其他权限</span>
        </span>
      </template>
      其他
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { RoleVo } from "@/types/ManageType";
import type { Tree } from "@/types/CommonType";
import type Node from "element-plus/es/components/tree/src/model/node";
import { routerByParentId } from "@/api/routers";
import { commonAlert } from "@/components/hooks/common-hooks";
import {permissionsListByRoute} from "@/api/permission";

export default defineComponent({
  name: "rolePermissionManage",
  props: {
    role: {
      type: Object as PropType<RoleVo>,
      validator: (role: RoleVo) => !!role.id,
    },
  },
  setup(props) {
    const treeProps = {
      label: "name",
      isLeaf: "isLeaf",
    };
    const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
      console.log(node);
      routerByParentId(node.data.id, props.role?.roleCode).then((res: any) => {
        console.log(res);
        if (commonAlert(res, "")) {
          // 叶子节点加载页面下按钮权限
          if (res.data.length === 0) {
            // todo 这里直接从后端加载,暂时使用手动维护,前端缓存(同步)再渲染
            permissionsListByRoute({
              id:node.data.id
            }).then(result => {
              console.log(result)
              result.data.forEach((item: any) => item.isLeaf = true)
              return resolve(result.data);
            });
          }
          res.data.forEach((item: any) => item.disabled = true)
          // 非叶子节点时加载下级菜单
          return resolve(res.data);
        }
        return resolve([]);
      });
    };

    return {
      loadNode,
      treeProps,
    };
  },
});
</script>

<style scoped>
.custom-tabs-label .el-icon {
  vertical-align: middle;
}
</style>
