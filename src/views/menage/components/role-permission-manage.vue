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
        :load="loadNode"
        lazy
        node-key="id"
        destroy-on-close
        :expand-on-click-node="false"
        :props="treeProps"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <a> Append </a>
              <a style="margin-left: 8px"> Delete </a>
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

export default defineComponent({
  name: "rolePermissionManage",
  props: {
    role: {
      type: Object as PropType<RoleVo>,
      validator: (role: RoleVo) => !!role.id,
    },
  },
  setup(props) {
    const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
      console.log(node);
      routerByParentId(node.data.id, props.role?.roleCode).then((res: any) => {
        console.log(res);
        if (commonAlert(res, "")) {
          return resolve(res.data);
        }
        return resolve([]);
      });
    };

    const treeProps = {
      label: "",
      isLeaf: "isLeaf",
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
