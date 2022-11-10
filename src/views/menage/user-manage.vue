<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
    <template #name_item="{ data }">
      <vxe-input
        v-model="data.name"
        type="text"
        placeholder="请输入名称"
      ></vxe-input>
    </template>
    <template #userName_item="{ data }">
      <vxe-input
        v-model="data.userName"
        type="text"
        placeholder="请输入账号"
      ></vxe-input>
    </template>
    <template #enable_item="{ data }">
      <vxe-select v-model="data.sex" transfer>
        <vxe-option
          v-for="item in userManage.enableList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></vxe-option>
      </vxe-select>
    </template>
    <template #roles_item="{ data }">
      <vxe-select v-model="data.sex" transfer>
        <vxe-option
          v-for="item in sexList1"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></vxe-option>
      </vxe-select>
    </template>
    <template #userGroup_item="{ data }">
      <vxe-select v-model="data.sex" transfer>
        <vxe-option
          v-for="item in sexList1"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></vxe-option>
      </vxe-select>
    </template>
    <template #operate_item>
      <vxe-button
        type="submit"
        status="primary"
        content="查询"
        @click="findList()"
      ></vxe-button>
      <vxe-button type="reset" content="重置"></vxe-button>
    </template>

    <template #name_edit="{ row }">
      <vxe-input v-model="row.name"></vxe-input>
    </template>
    <template #username_edit="{ row }">
      <vxe-input v-model="row.username"></vxe-input>
    </template>
    <template #enabled_default="{ row }">
      <vxe-switch
        v-model="row.enabled"
        open-label="是"
        close-label="否"
      ></vxe-switch>
    </template>
    <template #enabled_edit="{ row }">
      <vxe-switch
        v-model="row.enabled"
        open-label="是"
        close-label="否"
      ></vxe-switch>
    </template>
    <template #roles_default="{ row }">
      {{ transLabels(row.roles, userManage.roleList).join(",") }}
    </template>
    <template #roles_edit="{ row }">
      <el-tree-select
        v-model="row.roles"
        :teleported="false"
        :data="userManage.roleList"
        multiple
        collapse-tags
        collapse-tags-tooltip
        filterable
        check-strictly
      />
    </template>

    <template #userGroup_default="{ row }">
      {{ transLabels([row.userGroup], userManage.userGroupList).join(",") }}
    </template>
    <template #userGroup_edit="{ row }">
      <el-tree-select
        v-model="row.userGroup"
        :teleported="false"
        :data="userManage.userGroupList"
        filterable
        check-strictly
      />
    </template>

    <template #password_default="{ row }">
      <vxe-button type="reset" content="重置" @click="row"></vxe-button>
    </template>

    <template #operate="{ row }">
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
    </template>
  </vxe-grid>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import VXETable from "vxe-table";
import type {
  VxeGridInstance,
  VxeGridListeners,
  VxeGridProps,
} from "vxe-table";
import { userPage } from "@/api/user";
import { enableList } from "@/stores/dictionaries";
import { transLabels } from "@/components/hooks/common-hooks";
import { roleStore } from "@/stores/modules/roles";
import {userGroupStore} from "@/stores/modules/user-group";

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
      formConfig: {
        data: {
          name: "",
          userName: "",
          enable: undefined,
          roles: "",
          userGroup: "",
        },
        items: [
          { field: "name", title: "姓名", slots: { default: "name_item" } },
          {
            field: "userName",
            title: "用户名",
            slots: { default: "userName_item" },
          },
          {
            field: "enable",
            title: "是否启用",
            slots: { default: "enable_item" },
          },
          { field: "roles", title: "角色", slots: { default: "roles_item" } },
          {
            field: "userGroup",
            title: "用户组",
            slots: { default: "userGroup_item" },
          },
          { slots: { default: "operate_item" } },
        ],
      },
      editConfig: {
        trigger: "click",
        mode: "cell",
        showStatus: true,
      },
      columns: [
        { type: "seq", width: 60 },
        {
          field: "name",
          title: "姓名",
          editRender: { autofocus: ".vxe-input--inner" },
          slots: { edit: "name_edit" },
        },
        {
          field: "username",
          title: "用户名",
          editRender: { autofocus: ".vxe-input--inner" },
          slots: { edit: "username_edit" },
        },
        {
          width: 100,
          align: "center",
          field: "enabled",
          title: "是否启用",
          editRender: {},
          slots: { edit: "enabled_edit", default: "enabled_default" },
        },
        {
          field: "roles",
          title: "角色",
          editRender: {},
          slots: { edit: "roles_edit", default: "roles_default" },
        },
        {
          field: "userGroup",
          title: "用户组",
          showOverflow: true,
          editRender: {},
          slots: { edit: "userGroup_edit", default: "userGroup_default" },
        },
        {
          field: "password",
          title: "密码",
          width: 100,
          slots: { default: "password_default" },
        },
        { title: "操作", width: 200, slots: { default: "operate" } },
      ],
      data: [],
    });

    const userManage = reactive({
      enableList,
      roleList: [] as any[],
      userGroupList: [] as any[],
    });

    onMounted(() => {
      roleStore()
        .getRolesKVTree()
        .then((res) => {
          userManage.roleList = res;
        });
      userGroupStore()
        .getUserGroupKVTree()
        .then((res) => {
          userManage.userGroupList = res;
        });
    });

    const findList = () => {
      gridOptions.loading = true;
      const formConfig: any = gridOptions.formConfig;
      const pagerConfig: any = gridOptions.pagerConfig;
      userPage({
        ...formConfig.data,
        pageNumber: pagerConfig.currentPage - 1,
        pageSize: pagerConfig.pageSize,
      }).then((res: any) => {
        gridOptions.loading = false;
        if (gridOptions.pagerConfig) {
          gridOptions.pagerConfig.total = res.total;
        }

        for (const row of res.data) {
          row.roles = row.roles.map((item: any) => item.id);
        }
        gridOptions.data = res.data;
      });
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
      userManage,
      transLabels,
      findList,
      editRowEvent,
      saveRowEvent,
      removeRowEvent,
    };
  },
});
</script>

<style scoped></style>
