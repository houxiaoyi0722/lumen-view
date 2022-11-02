<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
<!--    <template #operate="{ row }">
      <template v-if="$refs.xGrid.isEditByRow(row)">
        <vxe-button
          status="primary"
          title="保存"
          circle
          @click="saveRowEvent(row)"
        ></vxe-button>
      </template>
      <template v-else>
        <vxe-button title="编辑" @click="editRowEvent(row)"></vxe-button>
      </template>
      <vxe-button title="删除" @click="removeRowEvent(row)"></vxe-button>
      <vxe-button title="查看"></vxe-button>
      <vxe-button title="设置"></vxe-button>
    </template>-->

    <template #name_edit="{ row }">
      <vxe-input v-model="row.name"></vxe-input>
    </template>
    <template #userName_edit="{ row }">
      <vxe-input v-model="row.userName"></vxe-input>
    </template>
    <template #role_edit="{ row }">
      <vxe-input v-model="row.role"></vxe-input>
    </template>
    <template #describe_edit="{ row }">
      <vxe-input v-model="row.describe"></vxe-input>
    </template>
  </vxe-grid>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import VXETable from "vxe-table";
import type {
  VxeGridInstance,
  VxeGridListeners,
  VxeGridProps,
} from "vxe-table";

export default defineComponent({
  name: "userManage",
  setup() {
    const xGrid = ref<VxeGridInstance>();

    const gridOptions = reactive<VxeGridProps>({
      border: true,
      keepSource: true,
      showOverflow: true,
      height: 530,
      loading: false,
      columnConfig: {
        resizable: true,
      },
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 200, 500],
      },
      editConfig: {
        trigger: "click",
        mode: "cell",
        showStatus: true,
      },
      columns: [
        { type: "seq", width: 60 },
        { type: "checkbox", width: 50 },
        {
          field: "name",
          title: "姓名",
          editRender: { autofocus: ".vxe-input--inner" },
          slots: { edit: "name_edit" },
        },
        {
          field: "userName",
          title: "用户名",
          editRender: { autofocus: ".vxe-input--inner" },
          slots: { edit: "userName_edit" },
        },
        {
          field: "password",
          title: "密码",
          editRender: {},
          slots: { default: "password_default", edit: "password_edit" },
        },
        {
          field: "phone",
          title: "电话",
          editRender: {},
          slots: { edit: "phone_edit" },
        },
        {
          field: "mobilePhone",
          title: "移动电话",
          editRender: {},
          slots: { edit: "mobilePhone_edit" },
        },
        {
          field: "address",
          title: "地址",
          editRender: {},
          slots: { edit: "address_edit" },
        },
        {
          field: "email",
          title: "邮箱地址",
          editRender: {},
          slots: { edit: "email_edit" },
        },
        {
          field: "enabled",
          title: "是否启用",
          editRender: {},
          slots: { edit: "enabled_edit" },
        },
        {
          field: "roles",
          title: "角色",
          editRender: {},
          slots: { edit: "roles_edit" },
        },
        {
          field: "userGroup",
          title: "用户组",
          showOverflow: true,
          editRender: {},
          slots: { edit: "userGroup_edit" },
        },
      ],
      data: [],
    });

    const findList = () => {
      gridOptions.loading = true;
      setTimeout(() => {
        gridOptions.loading = false;
        if (gridOptions.pagerConfig) {
          gridOptions.pagerConfig.total = 10;
        }
        gridOptions.data = [
          {
            id: 10001,
            name: "Test1",
            nickname: "T1",
            role: "Develop",
            sex: "1",
            age: 28,
            address: "Shenzhen",
          },
          {
            id: 10002,
            name: "Test2",
            nickname: "T2",
            role: "Test",
            sex: "0",
            age: 22,
            address: "Guangzhou",
          },
          {
            id: 10003,
            name: "Test3",
            nickname: "T3",
            role: "PM",
            sex: "1",
            age: 32,
            address: "Shanghai",
          },
          {
            id: 10004,
            name: "Test4",
            nickname: "T4",
            role: "Designer",
            sex: "0",
            age: 23,
            address: "Shenzhen",
          },
          {
            id: 10005,
            name: "Test5",
            nickname: "T5",
            role: "Develop",
            sex: "0",
            age: 30,
            address: "Shanghai",
          },
          {
            id: 10006,
            name: "Test6",
            nickname: "T6",
            role: "Develop",
            sex: "0",
            age: 27,
            address: "Shanghai",
          },
          {
            id: 10007,
            name: "Test7",
            nickname: "T7",
            role: "Develop",
            sex: "1",
            age: 29,
            address: "Shenzhen",
          },
          {
            id: 10008,
            name: "Test8",
            nickname: "T8",
            role: "Develop",
            sex: "0",
            age: 32,
            address: "Shanghai",
          },
          {
            id: 10009,
            name: "Test9",
            nickname: "T9",
            role: "Develop",
            sex: "1",
            age: 30,
            address: "Shenzhen",
          },
          {
            id: 10010,
            name: "Test10",
            nickname: "T10",
            role: "Develop",
            sex: "0",
            age: 34,
            address: "Shanghai",
          },
        ];
      }, 300);
    };

    const gridEvents: VxeGridListeners = {
      pageChange({ currentPage, pageSize }) {
        if (gridOptions.pagerConfig) {
          gridOptions.pagerConfig.currentPage = currentPage;
          gridOptions.pagerConfig.pageSize = pageSize;
        }
        findList();
      },
    };

    const editRowEvent = (row: any) => {
      const $grid = xGrid.value;
      if ($grid) {
        $grid.setEditRow(row);
      }
    };

    const saveRowEvent = async () => {
      const $grid = xGrid.value;
      if ($grid) {
        await $grid.clearEdit();
        gridOptions.loading = true;
        // 模拟异步保存
        setTimeout(() => {
          gridOptions.loading = false;
          VXETable.modal.message({ content: "保存成功！", status: "success" });
        }, 300);
      }
    };

    const removeRowEvent = async (row: any) => {
      const type = await VXETable.modal.confirm("您确定要删除该数据?");
      const $grid = xGrid.value;
      if ($grid) {
        if (type === "confirm") {
          await $grid.remove(row);
        }
      }
    };

    findList();

    return {
      xGrid,
      gridOptions,
      gridEvents,
      editRowEvent,
      saveRowEvent,
      removeRowEvent,
    };
  },
});
</script>

<style scoped></style>
