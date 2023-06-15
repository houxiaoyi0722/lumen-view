<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
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
        title="编辑"
        content="编辑"
        @click="editProcess(row)"
      ></vxe-button>
      <vxe-button title="激活/挂起" content="激活/挂起"></vxe-button>
    </template>
  </vxe-grid>

  <vxe-modal v-model="editModal.showEdit" id="myModal6" fullscreen transfer destroy-on-close>
    <process-edit :process-define-id="editModal.processDefineId" :deployment-id="editModal.deploymentId" :resource-name="editModal.resourceName" />
  </vxe-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridListeners,
} from "vxe-table";
import { processDefinitionPage } from "@/api/flowable";
import ProcessEdit from "@/views/flowable/process-edit.vue";

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
        { type: "seq", width: 60 },
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
          width: 300,
          fixed: "right",
          slots: { default: "operate" },
        },
      ],
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

    const editProcess = (row: any) => {
      editModal.showEdit = true;
      editModal.processDefineId = row.id;
      editModal.deploymentId = row.deploymentId;
      editModal.resourceName = row.resourceName;
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
    };
  },
});
</script>

<style scoped></style>
