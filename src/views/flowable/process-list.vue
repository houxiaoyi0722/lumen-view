<template>
  <vxe-grid
    ref="xGrid"
    v-bind="gridOptions"
    v-on="gridEvents"
    @cell-menu="cellContextMenuEvent"
    @menu-click="contextMenuClickEvent"
  >
    <template #name_item="{ data }">
      <vxe-input
        v-model="data.name"
        clearable
        type="text"
        placeholder="请输入名称"
      ></vxe-input>
    </template>
    <template #active_item="{ data }">
      <vxe-select v-model="data.active" clearable>
        <vxe-option value="true" label="活动中"></vxe-option>
        <vxe-option value="false" label="挂起"></vxe-option>
      </vxe-select>
    </template>
    <template #operate_item>
      <vxe-button
        type="submit"
        status="primary"
        content="查询"
        @click="findList()"
      ></vxe-button>
      <vxe-button type="reset" content="重置" @click="reset()"></vxe-button>
    </template>

    <template #enabled_default="{ row }">
      {{ row.suspensionState === "1" ? "活动中" : "挂起" }}
    </template>
    <template #operate="{ row }">
      <vxe-button
        v-if="row.suspensionState === '1'"
        title="挂起"
        content="挂起"
        @click="activeOrSuspend(row)"
      ></vxe-button>
      <vxe-button
        v-if="row.suspensionState === '2'"
        title="激活"
        content="激活"
        @click="activeOrSuspend(row)"
      ></vxe-button>
    </template>
  </vxe-grid>

  <vxe-modal
    v-model="editModal.showEdit"
    id="myModal6"
    fullscreen
    transfer
    destroy-on-close
  >
    <process-edit
      :process-define-id="editModal.processDefineId"
      :deployment-id="editModal.deploymentId"
      :resource-name="editModal.resourceName"
    />
  </vxe-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridListeners,
  VxeGridEvents,
} from "vxe-table";
import {
  deleteProcess,
  processDefinitionPage,
  suspendedOrActiveProcess,
} from "@/api/flowable";
import ProcessEdit from "@/views/flowable/process-edit.vue";
import { commonAlert } from "@/components/hooks/common-hooks";
import type {ProcessDefinition} from "@/types/FlowableType";

export default defineComponent({
  name: "process-list",
  components: { ProcessEdit },
  setup() {
    const xGrid = ref<VxeGridInstance>();

    const editModal = reactive({
      showEdit: false,
      processDefineId: "",
      deploymentId: "",
      resourceName: "",
    });

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
          active: undefined,
        },
        items: [
          { field: "name", title: "流程名称", slots: { default: "name_item" } },
          {
            field: "active",
            title: "活动状态",
            slots: { default: "active_item" },
          },
          { slots: { default: "operate_item" } },
        ],
      },
      columns: [
        { type: "seq", width: 60, align: "center" },
        {
          width: 400,
          field: "id",
          title: "流程定义id",
        },
        {
          width: 200,
          field: "name",
          title: "流程名称",
        },
        {
          width: 200,
          field: "key",
          title: "流程key",
        },
        {
          width: 200,
          field: "description",
          title: "描述",
        },
        {
          width: 100,
          align: "center",
          field: "version",
          title: "版本",
        },
        {
          width: 300,
          field: "deploymentId",
          title: "部署id",
        },
        {
          width: 100,
          align: "center",
          field: "suspensionState",
          title: "活动状态",
          slots: { default: "enabled_default" },
        },
        {
          title: "操作",
          align: "center",
          width: 100,
          fixed: "right",
          slots: { default: "operate" },
        },
      ],
      menuConfig: {
        body: {
          options: [
            [
              {
                code: "create",
                name: "新增",
                visible: true,
                disabled: false,
              },
              {
                code: "save",
                name: "编辑",
                visible: true,
                disabled: false,
              },
              {
                code: "delete",
                name: "删除",
                visible: true,
                disabled: false,
              },
            ],
          ],
        },
      },
      data: [],
    });

    const gridEvents: VxeGridListeners = {
      pageChange({ currentPage, pageSize }) {
        if (gridOptions.pagerConfig) {
          gridOptions.pagerConfig.currentPage = currentPage;
          gridOptions.pagerConfig.pageSize = pageSize;
        }
        findList();
      },
    };

    const findList = () => {
      gridOptions.loading = true;

      const pagerConfig: any = gridOptions.pagerConfig;

      processDefinitionPage({
        name: gridOptions.formConfig?.data.name,
        active: gridOptions.formConfig?.data.active,
        pageNumber: pagerConfig.currentPage,
        pageSize: pagerConfig.pageSize,
      })
        .then((res: any) => {
          gridOptions.loading = false;

          if (gridOptions.pagerConfig) {
            gridOptions.pagerConfig.total = res.total;
          }
          gridOptions.data = res.data;
        })
        .catch(() => {
          gridOptions.loading = false;
        });
    };

    const reset = () => {
      gridOptions.formConfig!.data.name = "";
      gridOptions.formConfig!.data.active = null;
    };

    const cellContextMenuEvent: VxeGridEvents.CellMenu = ({ row }) => {
      const $grid = xGrid.value;
      $grid!.setCurrentRow(row);
    };

    const contextMenuClickEvent: VxeGridEvents.MenuClick = ({
      menu,
      row,
      column,
    }) => {
      const $grid = xGrid.value;
      switch (menu.code) {
        case "create":
          // createProcess();
          break;
        case "save":
          editProcess(row);
          break;
        case "delete":
          remove(row);
          break;
      }
    };

    const editProcess = (row: ProcessDefinition) => {
      editModal.showEdit = true;
      editModal.processDefineId = row.id;
      editModal.deploymentId = row.deploymentId;
      editModal.resourceName = row.resourceName;
    };

    const remove = (row: ProcessDefinition) => {
      deleteProcess(row).then((res) => {
        if (commonAlert(res, "删除成功")) {
          findList();
        }
      });
    };

    const activeOrSuspend = (row: ProcessDefinition) => {
      suspendedOrActiveProcess(row).then((res) => {
        if (commonAlert(res, "更新成功")) {
          findList();
        }
      });
    };

    findList();

    return {
      xGrid,
      gridOptions,
      editModal,
      gridEvents,
      findList,
      reset,
      editProcess,
      activeOrSuspend,
      contextMenuClickEvent,
      cellContextMenuEvent,
    };
  },
});
</script>

<style scoped></style>
