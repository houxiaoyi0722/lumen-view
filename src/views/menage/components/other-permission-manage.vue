<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><Menu /></el-icon>
          <span>其他权限</span>
        </span>
      </template>
      <vxe-table
        show-overflow
        keep-source
        ref="xTable"
        max-height="750"
        :data="otherPri.tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column
          field="name"
          title="权限名称"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input v-model="row.name" type="text"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column
          field="code"
          title="权限代码"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input v-model="row.code" type="text"></vxe-input>
          </template>
        </vxe-column>
      </vxe-table>

      <div class="drawer-button">
        <vxe-button @click="insertEvent(-1)">新增</vxe-button>
        <vxe-button @click="$refs.xTable.removeCheckboxRow()">删除</vxe-button>
        <vxe-button @click="saveEvent">保存</vxe-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import type {VxeTableInstance} from "vxe-table";
import {permissionsListByRouter, saveRouterPerList} from "@/api/permission";
import {commonAlert} from "@/components/hooks/common-hooks";
import type {Permission} from "@/types/ManageType";

export default defineComponent({
  name: "otherPermissionManage",
  setup() {
    const xTable = ref<VxeTableInstance>();

    const otherPri = ref({
      tableData: [] as Permission[],
    });

    onMounted(() => {
      loadTableData();
    });

    const loadTableData = () => {
      // 其他权限不归属与某个路由(路由id为空)
      permissionsListByRouter({}).then((res) => {
        if (commonAlert(res, "")) {
          otherPri.value.tableData = res.data;
        }
      });
    };

    const insertEvent = async (row: number) => {
      const $table = xTable.value;
      const record = {};
      const { row: newRow } = await $table!.insertAt(record, row);
      await $table!.setEditCell(newRow, "name");
    };

    const saveEvent = () => {
      const $table = xTable.value;
      const tableData = $table?.getTableData();
      console.log(tableData);
      saveRouterPerList({
        insertList: $table?.getInsertRecords(),
        updateList: $table?.getUpdateRecords(),
        removeList: $table?.getRemoveRecords(),
      }).then((res) => {
        if (commonAlert(res, "保存成功")) {
          loadTableData();
        }
      });
    };

    return {
      xTable,
      otherPri,
      insertEvent,
      saveEvent,
    };
  },
});
</script>

<style scoped>
.custom-tabs-label .el-icon {
  vertical-align: middle;
}
.drawer-button {
  margin-top: 20px;
  text-align: center;
  align-content: center;
}
</style>
