<template>
  <vxe-form :data="dictManage.formData" @submit="findList">
    <vxe-form-item title="名称" field="name" :item-render="{}">
      <template #default="{ data }">
        <vxe-input v-model="data.name" placeholder="请输入名称"></vxe-input>
      </template>
    </vxe-form-item>
    <vxe-form-item title="code" field="sex" :item-render="{}">
      <template #default="{ data }">
        <vxe-input v-model="data.name" placeholder="请输入名称"></vxe-input>
      </template>
    </vxe-form-item>
    <vxe-form-item>
      <template #default>
        <vxe-button type="submit" status="primary">查询</vxe-button>
        <vxe-button type="reset">重置</vxe-button>
      </template>
    </vxe-form-item>
  </vxe-form>
  <vxe-toolbar perfect>
    <template #buttons>
      <vxe-button status="perfect">新增</vxe-button>
      <vxe-button status="perfect">删除</vxe-button>
    </template>
  </vxe-toolbar>
  <vxe-table
    ref="xTable1"
    border
    auto-resize
    :data="dictManage.tableData"
    @toggle-row-expand="toggleExpandChangeEvent"
  >
    <vxe-column type="seq" width="60"></vxe-column>
    <vxe-column type="expand" width="80">
      <template #content="{ row, rowIndex }">
        <div v-if="rowIndex === 1" class="expand-wrapper">
          <vxe-table border :data="dictManage.otherList">
            <vxe-column field="role" title="Role"></vxe-column>
            <vxe-column field="address" title="Address"></vxe-column>
          </vxe-table>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="groupId" title="字典组" width="400"></vxe-column>
    <vxe-column field="groupName" title="组名称" width="400"></vxe-column>
    <vxe-column field="comment" title="备注" width="400"></vxe-column>
  </vxe-table>
  <vxe-pager
      align="right"
      size="small"
      v-model:current-page="dictManage.page.currentPage"
      v-model:page-size="dictManage.page.pageSize"
      :total="100">
  </vxe-pager>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from "vue";
import type {
  VxeTableInstance,
  VxeTableEvents,
  VxeColumnPropTypes,
} from "vxe-table";

export default defineComponent({
  setup() {
    const xTable1 = ref<VxeTableInstance>();

    const dictManage = reactive({
      formData: {

      },
      tableData: [],
      otherList: [],
      page: {
        currentPage: 1,
        pageSize: 10,
      },
    });

    const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand = ({
      expanded,
    }) => {

      console.log("行展开事件" + expanded);
    };

    return {
      dictManage,
      toggleExpandChangeEvent,
    };
  },
});
</script>

<style scoped></style>
