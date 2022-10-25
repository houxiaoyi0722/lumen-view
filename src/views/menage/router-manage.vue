<template>
  <vxe-toolbar ref="xToolbar" :refresh="{ query: searchMethod }" custom>
    <template #buttons>
      <vxe-button @click="insertEvent">新增</vxe-button>
      <vxe-button @click="saveEvent">保存数据</vxe-button>
    </template>
  </vxe-toolbar>

  <vxe-table
    show-overflow
    keep-source
    ref="xTable"
    :row-config="{ keyField: 'id' }"
    :column-config="{ resizable: true }"
    :loading="routerMng.loading"
    :tree-config="routerMng.treeConfig"
    :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
    :data="routerMng.tableData"
  >
    <vxe-column type="checkbox" width="60"></vxe-column>
    <vxe-column field="name" title="路由名称" tree-node></vxe-column>
    <vxe-column field="path" title="访问路径" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.path" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="redirect" title="跳转路径" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.redirect" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="component" title="component" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.component" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="mate" title="元数据" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input :v-model="JSON.stringify(row.mate)" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="description" title="描述" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.description" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="hidden" title="是否隐藏" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.hidden" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="orderBy" title="排序" width="80" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.orderBy" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="roles" title="权限管理" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.roles" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column title="操作" width="300">
      <template #default="{ row }">
        <vxe-button
          type="text"
          status="primary"
          @click="insertRow(row, 'current')"
          >插入节点</vxe-button
        >
        <vxe-button
          type="text"
          status="primary"
          @click="insertRow(row, 'bottom')"
          >插入子节点</vxe-button
        >
        <vxe-button type="text" status="primary" @click="removeRow(row)"
          >删除</vxe-button
        >
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from "vue";
import type { VxeTableInstance, VxeToolbarInstance } from "vxe-table";
import { getAllRouters } from "@/api/routers";

export default defineComponent({
  setup() {
    const routerMng = reactive({
      loading: false,
      tableData: [] as any[],
      treeConfig: {
        transform: true,
        rowField: "id",
        parentField: "parentId",
      },
    });

    const xTable = ref<VxeTableInstance>();
    const xToolbar = ref<VxeToolbarInstance>();

    const findList = () => {
      routerMng.loading = true;

      return new Promise((resolve) => {
        getAllRouters()
          .then((res) => {
            routerMng.tableData = res.data;
            routerMng.loading = false;
            resolve(null);
          })
          .catch(() => {
            routerMng.loading = false;
          });
      });
    };

    const searchMethod = () => {
      const $table = xTable.value;
      // 清除所有状态
      return findList();
    };

    const insertRow = async (currRow: any, locat: string) => {
      const $table = xTable.value;
      const date = new Date();
      // 如果 null 则插入到目标节点顶部
      // 如果 -1 则插入到目标节点底部
      // 如果 row 则有插入到效的目标节点该行的位置
      if (locat === "current") {
        const record = {
          name: "新数据",
          id: Date.now(),
          parentId: currRow.parentId, // 父节点必须与当前行一致
          date: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
        };
        const { row: newRow } = await $table!.insertAt(record, currRow);
        await $table!.setEditRow(newRow); // 插入子节点
      } else if (locat === "top") {
        const record = {
          name: "新数据",
          id: Date.now(),
          parentId: currRow.id, // 需要指定父节点，自动插入该节点中
          date: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
        };
        const { row: newRow } = await $table!.insert(record);
        await $table!.setTreeExpand(currRow, true); // 将父节点展开
        await $table!.setEditRow(newRow); // 插入子节点
      } else if (locat === "bottom") {
        const record = {
          name: "新数据",
          id: Date.now(),
          parentId: currRow.id, // 需要指定父节点，自动插入该节点中
          date: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
        };
        const { row: newRow } = await $table!.insertAt(record, -1);
        await $table!.setTreeExpand(currRow, true); // 将父节点展开
        await $table!.setEditRow(newRow); // 插入子节点
      }
    };

    const removeRow = async (row: any) => {
      const $table = xTable.value;
      await $table!.remove(row);
    };

    const insertEvent = async () => {
      const $table = xTable.value;
      const date = new Date();
      const record = {
        name: "新数据",
        id: Date.now(),
        parentId: null,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      };
      const { row: newRow } = await $table!.insert(record);
      await $table!.setEditRow(newRow);
    };

    const saveEvent = async () => {
      console.log(123);
    };

    nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = xTable.value;
      const $toolbar = xToolbar.value;
      $table!.connect($toolbar!);
      findList();
    });

    return {
      xTable,
      xToolbar,
      routerMng,
      insertEvent,
      saveEvent,
      searchMethod,
      removeRow,
      insertRow,
    };
  },
});
</script>

<style scoped></style>
