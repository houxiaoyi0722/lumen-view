<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><Menu /></el-icon>
          <span>页面所属权限</span>
        </span>
      </template>
      <vxe-table
        show-overflow
        keep-source
        ref="xTable"
        max-height="750"
        :data="routerPriMng.tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column
          field="name"
          title="权限名称"
          :edit-render="{ defaultValue: router.name + '-' }"
        >
          <template #edit="{ row }">
            <vxe-input v-model="row.name" type="text"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column field="code" title="权限代码" :edit-render="{ defaultValue: router.path + '-' }">
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
import type { PropType } from "vue";
import {defineComponent, onMounted, ref} from "vue";
import { VXETable } from "vxe-table";
import type { VxeTableInstance } from "vxe-table";
import type {RouterType} from "@/types/RouterType";
import {permissionsListByRouter, saveRouterPerList} from "@/api/permission";
import {commonAlert} from "@/components/hooks/common-hooks";

export default defineComponent({
  name: "routerPermissionManage",
  props: {
    router: {
      type: Object as PropType<RouterType>,
      validator: (router: RouterType) => !!router.id,
    },
  },
  setup(props) {
    const xTable = ref<VxeTableInstance>();

    const routerPriMng = ref({
      tableData: [] as RouterType[],
    });


    onMounted(() => {
      permissionsListByRouter({
        id: props.router!.id
      }).then(res => {
        if (commonAlert(res, "")) {
          routerPriMng.value.tableData = res.data
        }
      });
    });

    const insertEvent = async (row: RouterType) => {
      const $table = xTable.value;
      const record = {
        sex: "1",
        date12: "2021-01-01",
      };
      const { row: newRow } = await $table!.insertAt(record, row);
      await $table!.setEditCell(newRow, "name");
    };

    const getInsertEvent = () => {
      const $table = xTable.value;
      const insertRecords = $table!.getInsertRecords();
      VXETable.modal.alert(`新增：${insertRecords.length}`);
    };

    // todo 保存路由下权限列表
    const saveEvent = () => {
      const $table = xTable.value;
      const { insertRecords, removeRecords, updateRecords } =
        $table!.getRecordset();

      // saveRouterPerList().then()
      VXETable.modal.alert(
        `insertRecords=${insertRecords.length} removeRecords=${removeRecords.length} updateRecords=${updateRecords.length}`
      );
    };

    return {
      xTable,
      routerPriMng,
      insertEvent,
      getInsertEvent,
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
